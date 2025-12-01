# Lawsuit — Backend Functional Specification & Dev Guide

*(Node + Express + TypeScript + Prisma + PostgreSQL + Zod)*

**Purpose:** Backend to support the Lawsuit frontend: authentication, role-based APIs, appointment booking/payments, case & document management, chat, video meetings integration, admin operations, reporting, and notifications. This spec is written so an AI code generator (Cursor/Claude) can scaffold a working backend with >99% accuracy.

---

## Table of contents

1. Tech stack & versions
2. High-level architecture
3. Environment variables
4. Prisma schema (DB models)
5. Auth & RBAC (JWT flow)
6. API design — routes, handlers, permissions, request/response shapes (complete list)
7. Validation (Zod) schemas — per endpoint
8. File uploads & storage (documents, lawyer proofs)
9. Payments & webhooks (Razorpay/Stripe)
10. Real-time chat & notifications (WebSockets)
11. Video meeting integration (room token flow)
12. Error handling, logging & monitoring
13. Pagination, filtering, sorting standards
14. Rate limiting & security middleware
15. Testing strategy (unit, integration, contract)
16. CI/CD, migrations, seeding, deployment notes
17. Folder & file structure (exact)
18. Cursor/Claude prompt templates & step-by-step generation plan
19. Appendix: example requests/responses, seed data, SQL snippets

---

## 1. Tech stack & pinned versions (recommended)

* Node.js 20.x (LTS)
* TypeScript 5.x
* Express 4.x (Types)
* Prisma 5.x + `prisma` CLI
* PostgreSQL 14+
* Zod 4.x
* pg (node-postgres) as DB driver (used by Prisma under the hood)
* `multer` for uploads (or `multer-s3` if S3 storage)
* `jsonwebtoken` or `@aws-sdk/crypto` for JWT (we’ll use `jsonwebtoken`)
* `socket.io` 4.x for WebSocket (or `ws`)
* `pino` for logging (or `winston`)
* `jest` / `supertest` for tests (integration)
* `eslint`, `prettier`, `husky` for quality hooks

(When generating, pin versions in package.json to avoid drift — list can be included in generation prompts.)

---

## 2. High-level architecture

* **API server**: Express + TypeScript + Zod validation + Prisma client.
* **Auth**: JWT access tokens + refresh tokens (secure httpOnly cookies).
* **Storage**: PostgreSQL for structured data; file storage on S3 (recommended) or local storage in dev.
* **Real-time**: Socket.io server attached to Express for chat and live notifications.
* **Payments**: Razorpay (primary, India) + optional Stripe; webhook endpoints to confirm payments.
* **Video calls**: Use a third-party provider (Daily.co, Jitsi or Janus); backend issues room tokens or creates meeting session.
* **Dev**: MSW not necessary for backend; use fixtures & database seeding for tests.

---

## 3. Environment variables (required)

```
# App
NODE_ENV=development
PORT=4000

# Database (Prisma)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/LAWSUIT_DB?schema=public

# JWT
JWT_ACCESS_TOKEN_SECRET=changeme_access_secret
JWT_REFRESH_TOKEN_SECRET=changeme_refresh_secret
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=30d

# Payment
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=rzp_secret_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# File storage (S3)
S3_BUCKET=lawsuit-dev
S3_REGION=ap-south-1
S3_ACCESS_KEY=AKIA...
S3_SECRET_KEY=...

# Socket & Video
VIDEO_PROVIDER_API_KEY=...
VIDEO_PROVIDER_SECRET=...

# Misc
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

---

## 4) Prisma schema (data models)

Below is a recommended Prisma schema (`prisma/schema.prisma`). It covers users, lawyers, organisations, cases, appointments, documents, chat, reviews, templates, and audit.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String      @id @default(cuid())
  name           String
  email          String      @unique
  phone          String?     
  role           Role        @default(CLIENT)
  passwordHash   String?     
  avatarUrl      String?     
  isVerified     Boolean     @default(false)
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  // Relations
  lawyerProfile  Lawyer?     @relation(fields: [lawyerProfileId], references: [id])
  lawyerProfileId String?
  casesAsClient  Case[]      @relation("ClientCases")
  appointments   Appointment[]
  refreshTokens  RefreshToken[]
  reviews        Review[]    @relation("GivenReviews")

  organisation   Organisation? @relation(fields: [organisationId], references: [id])
  organisationId String?

  // For audit
  createdBy      String?
}

model Lawyer {
  id                String     @id @default(cuid())
  userId            String     @unique
  user              User       @relation(fields: [userId], references: [id])
  licenseNumber     String?
  stateBarIds       String[]
  specializations   String[]   // e.g. ["Family Law", "Criminal"]
  experienceYears   Int
  languages         String[]
  feePerConsultation Int
  rating            Float?     @default(0)
  bio               String?
  isVerified         Boolean   @default(false)
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt

  cases             Case[]     @relation("LawyerCases")
  appointments      Appointment[]
  documents         Document[] 
  reviewsReceived   Review[]   @relation("ReceivedReviews")
}

model Organisation {
  id          String   @id @default(cuid())
  name        String
  address     String?
  contactEmail String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  users       User[]
}

model Case {
  id            String      @id @default(cuid())
  title         String
  description   String?
  status        CaseStatus  @default(ONGOING)
  clientId      String
  client        User        @relation("ClientCases", fields: [clientId], references: [id])
  lawyerId      String?
  lawyer        Lawyer?     @relation("LawyerCases", fields: [lawyerId], references: [id])
  timeline      TimelineEvent[]
  documents     Document[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  hearings      Hearing[]
}

model TimelineEvent {
  id        String   @id @default(cuid())
  caseId    String
  case      Case     @relation(fields: [caseId], references: [id])
  type      TimelineEventType
  title     String
  description String?
  date      DateTime
}

model Hearing {
  id        String   @id @default(cuid())
  caseId    String
  case      Case     @relation(fields: [caseId], references: [id])
  date      DateTime
  notes     String?
  createdBy String?  // userId who added
  createdAt DateTime @default(now())
}

model Document {
  id         String   @id @default(cuid())
  caseId     String?
  case       Case?    @relation(fields: [caseId], references: [id])
  uploaderId String
  uploader   User     @relation(fields: [uploaderId], references: [id])
  filename   String
  url        String
  mimeType   String
  size       Int
  uploadedAt DateTime @default(now())
  version    Int      @default(1)
}

model Appointment {
  id          String   @id @default(cuid())
  lawyerId    String
  lawyer      Lawyer   @relation(fields: [lawyerId], references: [id])
  clientId    String
  client      User     @relation(fields: [clientId], references: [id])
  datetime    DateTime
  status      AppointmentStatus @default(BOOKED)
  paymentId   String?
  paymentStatus PaymentStatus? 
  meetingLink String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Chat {
  id        String     @id @default(cuid())
  caseId    String?    // optional tie to case
  participants String[] // array of user ids
  messages  ChatMessage[]
  createdAt DateTime   @default(now())
}

model ChatMessage {
  id        String   @id @default(cuid())
  chatId    String
  chat      Chat     @relation(fields: [chatId], references: [id])
  senderId  String
  sender    User     @relation(fields: [senderId], references: [id])
  text      String?
  attachments String[] // urls or document ids
  createdAt DateTime @default(now())
  delivered Boolean  @default(false)
  readAt    DateTime?
}

model Review {
  id        String   @id @default(cuid())
  fromUserId String
  fromUser  User     @relation("GivenReviews", fields: [fromUserId], references: [id])
  toLawyerId String
  toLawyer  Lawyer   @relation("ReceivedReviews", fields: [toLawyerId], references: [id])
  rating    Int
  comment   String?
  createdAt DateTime @default(now())
}

model Template {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdBy String? // admin user Id
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  token     String
  createdAt DateTime @default(now())
  expiresAt DateTime
}

enum Role {
  CLIENT
  LAWYER
  ADMIN
  ORGANISATION
}

enum CaseStatus {
  ONGOING
  CLOSED
  PENDING
}

enum AppointmentStatus {
  BOOKED
  PAID
  CANCELLED
  COMPLETED
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}

enum TimelineEventType {
  HEARING
  TASK
  DOCUMENT
}
```

> Notes: Prisma arrays for Postgres (`String[]`) work; Prisma will map them to PostgreSQL array columns.

---

## 5) Auth & RBAC

**Flow**

* Signup: `POST /auth/register` (role: client/lawyer/organisation request). For lawyers, require document upload and admin verification flag `isVerified=false`.
* Login: `POST /auth/login` returns access token (JWT) and refresh token (httpOnly cookie or DB-stored token).
* OTP: If you want OTP for login, send OTP endpoint and verify; or implement via passwordless — both supported.
* Refresh: `POST /auth/refresh` (send refresh token cookie) returns new access token.
* Logout: `POST /auth/logout` revokes refresh token in DB.

**JWT claims**

```
{
  sub: userId,
  role: "CLIENT" | "LAWYER" | "ADMIN" | "ORGANISATION",
  iat, exp
}
```

**RBAC middleware**

* `authMiddleware` verifies JWT and attaches `req.user = { id, role, email, ... }`.
* `requireRole(...roles)` checks `req.user.role` and returns 403 if not allowed.
* `requireOwnershipOrRole(resourceOwnerIdParam, ...roles)` helper for endpoints where a user can access their own resources or admins can access.

**Token storage**

* Use refresh tokens stored in `RefreshToken` model with expiry and token identifier for revocation.

---

## 6) API Design — endpoints, validation, permissions, request & response shapes

Below are grouped by resource. For each route I specify HTTP method, path, auth requirement, Zod schema alias, and sample responses.

> Convention: API base `/api/v1`. Use standard JSON: `{ success: boolean, data?:..., error?: { code, message } }`.

### Auth

1. `POST /api/v1/auth/register`

   * Public
   * Body: `{ name, email, password, phone?, role: 'client'|'lawyer'|'organisation' }`
   * Validation: Zod `RegisterSchema`
   * Response: `{ success: true, data: { user, message: 'verify OTP or pending verification' } }`
   * For lawyer: server creates `Lawyer` entry stub and requires admin verification for `isVerified`.

2. `POST /api/v1/auth/login`

   * Public
   * Body: `{ email, password }`
   * Response: `{ success: true, data: { accessToken, user } }` + set `refresh_token` cookie

3. `POST /api/v1/auth/refresh`

   * Auth via cookie
   * Response: new access token

4. `POST /api/v1/auth/logout`

   * Auth required
   * Body optional
   * Response: success, clears cookie and revokes refresh token

5. `POST /api/v1/auth/request-otp` (optional)

   * Body: `{ email | phone }`
   * Sends OTP via email/SMS

6. `POST /api/v1/auth/verify-otp`

   * Body `{ userId, otp }`
   * If valid, issues tokens.

---

### Users & Profiles

1. `GET /api/v1/users/me`

   * Auth
   * Returns `User` with role and profile (lawyer data if lawyer).

2. `PUT /api/v1/users/me`

   * Auth
   * Body: `{ name?, phone?, avatarUrl? }`
   * Update self.

3. `GET /api/v1/users/:id`

   * Auth; allowed roles: ADMIN or owner
   * Returns public user info.

4. `POST /api/v1/lawyers/apply`

   * Auth (role = LAWYER)
   * Uploads verification docs and sets `isVerified=false`. (File upload)

5. `GET /api/v1/lawyers`

   * Public (or auth)
   * Query params: `q, location, specialization, minExperience, minRating, page, limit, sortBy`
   * Response: paginated `Lawyer[]` (uses `use prisma.findMany({ where, skip, take, orderBy })`)

6. `GET /api/v1/lawyers/:id`

   * Public
   * Returns full lawyer profile and reviews.

7. `PUT /api/v1/lawyers/:id`

   * Auth (LAWYER owner or ADMIN)
   * Update profile details.

---

### Appointments (Booking & Payment)

1. `POST /api/v1/appointments`

   * Auth (CLIENT)
   * Body: `{ lawyerId, datetime (ISO), caseId? }`
   * Steps:

     * Validate lawyer availability (simple conflict check).
     * Create `Appointment` with status `BOOKED`, paymentStatus `PENDING`.
     * Return appointment and payment intent (via PaymentService) or checkout details.
   * Response: `{ success: true, data: { appointment, payment: { provider, checkoutOptions } } }`

2. `POST /api/v1/appointments/:id/cancel`

   * Auth (client or lawyer)
   * Check permissions; update status to `CANCELLED`.

3. `POST /api/v1/appointments/:id/confirm-payment`

   * Called after payment success (client-side flow returns paymentId).
   * Verify payment via payment provider API or webhook, set appointment `status=PAID`, `paymentStatus=SUCCESS`, create `meetingLink` if applicable.

4. `GET /api/v1/appointments`

   * Auth (client/lawyer/admin)
   * Query:user-specific list: upcoming/past, pagination.

5. Webhook: `POST /api/v1/webhooks/payments/razorpay`

   * Public (provider posts)
   * Validate signature, confirm payment, mark appointment as paid.

---

### Cases & Documents

1. `POST /api/v1/cases`

   * Auth (client)
   * Body: `{ title, description, lawyerId? }`
   * Creates Case.

2. `GET /api/v1/cases`

   * Auth (client/lawyer/admin)
   * Returns cases relevant to user.

3. `GET /api/v1/cases/:id`

   * Auth; only stakeholders (client, assigned lawyer, admin)
   * Returns case with timeline, hearings, docs.

4. `PUT /api/v1/cases/:id`

   * Auth (lawyer or admin or client if allowed)
   * Update case status/assign lawyer.

5. `POST /api/v1/cases/:id/documents`

   * Auth (client, lawyer)
   * Accept multipart/form-data file: stores file (S3), saves Document record with `url`, `uploaderId`, `caseId`, `mimeType`, `size`.
   * Response: uploaded document metadata.

6. `GET /api/v1/cases/:id/documents`

   * Auth (stakeholders)
   * Returns array of documents.

7. `DELETE /api/v1/cases/:id/documents/:docId`

   * Auth (uploader or admin)
   * Remove record & file (S3 delete).

8. `POST /api/v1/cases/:id/timeline`

   * Auth (lawyer or client as allowed)
   * Add timeline event (hearing/task/document).

9. `POST /api/v1/cases/:id/hearings`

   * Auth (lawyer)
   * Add hearing entry with date & notes.

---

### Chat & Messaging

1. `POST /api/v1/chat`

   * Auth (client/lawyer)
   * Body: `{ caseId? }` -> returns existing chat or creates new chat with participants

2. `GET /api/v1/chat/:chatId/messages`

   * Auth & participant only
   * Query pagination: page/limit

3. `POST /api/v1/chat/:chatId/messages`

   * Auth & participant only
   * Body: `{ text?, attachments[] }`
   * Persist ChatMessage and emit via socket.io to participants.

4. `GET /api/v1/chat/:chatId/participants`

   * Return participant list.

> Real-time socket.io handles `message:send`, `message:receive`, `typing`, `read` events; backend validates tokens on socket connect.

---

### Reviews & Ratings

1. `POST /api/v1/lawyers/:id/reviews`

   * Auth (client who had appointment with lawyer)
   * Body `{ rating: number (1-5), comment? }`
   * Create Review; update lawyer rating aggregate.

2. `GET /api/v1/lawyers/:id/reviews`

   * Public

---

### Admin

1. `GET /api/v1/admin/reports`

   * Auth (ADMIN)
   * Reports for active cases, revenue, new registrations, etc.

2. `POST /api/v1/admin/templates`

   * Create templates for agreements.

3. `PUT /api/v1/admin/templates/:id`

4. `DELETE /api/v1/admin/templates/:id`

5. `GET /api/v1/admin/filters` & `POST /api/v1/admin/filters`

   * Create and manage filter values used by frontend (case categories, specializations).

6. `GET /api/v1/admin/verification/requests`

   * View pending lawyer verification requests; `POST /api/v1/admin/verification/:lawyerId/approve` and `/reject`.

---

### Organisation endpoints

1. `POST /api/v1/organisations` (ADMIN or organisation owner)
2. `GET /api/v1/organisations/:id/users`
3. `POST /api/v1/organisations/:id/invite` (invite user to organisation)

---

### Utilities

1. `GET /api/v1/search`

   * Global search across lawyers/cases.

2. `GET /api/v1/i18n/en`

   * Return text strings (frontend pulls for i18n).

3. `GET /api/v1/health`

   * Health check.

---

## 7) Zod validation schemas (examples)

Create `src/schemas/*.ts` files; export Zod schemas and typed helpers (e.g., `type LoginInput = z.infer<typeof LoginSchema>`).

Examples:

```ts
// src/schemas/auth.ts
import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  role: z.enum(['client','lawyer','organisation']).default('client'),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

```ts
// src/schemas/appointment.ts
import { z } from 'zod';
export const BookAppointmentSchema = z.object({
  lawyerId: z.string().cuid(),
  datetime: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: 'Invalid datetime' }),
  caseId: z.string().cuid().optional(),
});
```

Use `express-zod-api` style middleware (or write small helper) that validates `req.body`, `req.params`, `req.query` and returns 400 with structured error messages.

---

## 8) File uploads & storage

* Use `multer` or `cloudinary` for multipart handling.
* Two storage modes:

  * **Dev/local**: store to `uploads/` folder with folder per case or per user.
  * **Production**: upload to S3. Implement `src/services/storage.ts` with `uploadFile(file, { path, acl })` and `deleteFile(url)`.

**Security**

* Validate file size and mime type. Example allowed: pdf, docx, jpg, png. Max size e.g., 25MB.
* Store metadata in `Document` model.

**Routes**:

* `POST /api/v1/cases/:id/documents` uses multer single/multiple; server uploads to S3, stores `url` and returns document meta.

---

## 9) Payments & webhooks

**Payment service wrapper**

* `src/services/paymentService.ts` exposes:

  * `createOrder({ amount, currency, receipt, notes })` (Razorpay)
  * `verifySignature(payload, signature, secret)` (webhook verification)
  * `fetchPayment(paymentId)` for verification.

**Flow**

1. Client calls `POST /api/v1/appointments` -> backend creates appointment record (status BOOKED) and calls `createOrder()` -> returns `orderId` (Razorpay) and checkout config.
2. Client completes checkout and obtains `paymentId` -> client calls `POST /api/v1/appointments/:id/confirm-payment` with `paymentId`.
3. Backend calls Razorpay to verify payment status or uses webhook.
4. On success set appointment `status=PAID`, `paymentStatus=SUCCESS`, and generate meeting link.

**Webhook**

* Expose `POST /api/v1/webhooks/payments/razorpay`, verify signature via `crypto` HMAC using secret, update records accordingly.

**Security**: Never trust client-only signals — always verify with provider or webhook.

---

## 10) Real-time chat & notifications (Socket.io)

* Attach `socket.io` server to Express HTTP server.
* On socket connect: validate access token via JWT.
* Join rooms: `chat:<chatId>`, `user:<userId>`.
* Events:

  * `message:send` -> server persists ChatMessage and emits `message:receive` to room.
  * `typing:start` / `typing:stop` -> notify participants.
  * `message:read` -> mark readAt.

**Scaling**: use Redis adapter for socket.io when scaling across instances.

**Push notifications**: Implement `pushService` to send browser push (VAPID keys) or email notifications when offline.

---

## 11) Video meetings integration

* Backend creates meeting/room on provider (Daily.co / Jitsi / custom) via API in `src/services/videoService.ts`.
* Expose endpoint `POST /api/v1/meetings/create` (auth, appointmentId) that:

  * Validates appointment ownership and time window,
  * Calls provider to create room/session,
  * Returns `roomUrl` or `token` to client.
* Meeting link stored in appointment.

If using Daily.co: create meeting via REST, return `roomUrl`. If using token-based provider, sign token on backend and send.

---

## 12) Error handling, logging & monitoring

* `src/middleware/errorHandler.ts` centralizes error responses. Use custom `ApiError` class with `status`, `code`, `message`.
* Use `pino` for structured logging. Log request id, user id, path, params.
* Integrate Sentry or similar for production error monitoring.
* Implement request id middleware to attach `X-Request-Id`.

---

## 13) Pagination, filtering, sorting standards

* Query params: `page` (1-based), `limit` (default 20, max 100), `q`, `sortBy` (e.g., `rating:desc`), `filters` as repeated keys.
* Response envelope:

```json
{
  "success": true,
  "data": [...],
  "meta": { "total": 123, "page": 1, "limit": 20 }
}
```

* Use Prisma `skip: (page-1)*limit` and `take: limit`.

---

## 14) Rate limiting & security middleware

* Rate limiter (e.g., `express-rate-limit`) globally: `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS`.
* Per-route stricter limits for login, OTP, and payment endpoints.
* Helmet for headers: `helmet()` middleware.
* CORS policy: restrict to frontend origin(s).
* Body size limit: `express.json({ limit: '10mb' })`.
* Input validation (Zod) everywhere to prevent injection.
* Sanitize filenames and URLs.

---

## 15) Testing strategy

* **Unit tests**: services, utils, validation schemas.
* **Integration**: API tests using `supertest` against an in-memory DB (use PostgreSQL test container via Docker or `pg` test DB) and Prisma migrations run against test DB. Use `jest` for runner.
* **Contract tests**: payment webhook simulation, socket events.
* **E2E** (optional): Playwright to test flows via UI.
* Use fixtures & seed scripts to insert stable deterministic data into test DB.

---

## 16) CI/CD, migrations, seeding, deployment

* Use GitHub Actions:

  * Steps: install, `pnpm install`, `pnpm prisma migrate deploy` (or `prisma migrate reset` in test), `pnpm build`, run tests, lint.
* Database migrations: `prisma migrate dev` locally, commit migration files, `prisma migrate deploy` in production.
* Seeding: `prisma db seed` script to insert admin account and sample lawyers/clients.
* Deployment: Host on Vercel (serverless functions possible) or render/Heroku/AWS ECS for full node server. For long-running socket.io and webhooks, use standard server env (not serverless).
* Env management: use secrets in hosting platform for DB, JWT, S3, Payment keys.

---

## 17) Folder & file structure (exact)

```
lawsuit-backend/
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ src/
│  ├─ index.ts                    # server start
│  ├─ app.ts                      # express app
│  ├─ config/
│  │  └─ index.ts                 # load env and config
│  ├─ routes/
│  │  ├─ auth.routes.ts
│  │  ├─ users.routes.ts
│  │  ├─ lawyers.routes.ts
│  │  ├─ appointments.routes.ts
│  │  ├─ cases.routes.ts
│  │  ├─ chat.routes.ts
│  │  ├─ admin.routes.ts
│  │  └─ webhooks.routes.ts
│  ├─ controllers/
│  │  ├─ auth.controller.ts
│  │  ├─ users.controller.ts
│  │  ├─ lawyers.controller.ts
│  │  ├─ appointments.controller.ts
│  │  ├─ cases.controller.ts
│  │  ├─ chat.controller.ts
│  │  └─ admin.controller.ts
│  ├─ services/
│  │  ├─ auth.service.ts
│  │  ├─ user.service.ts
│  │  ├─ lawyer.service.ts
│  │  ├─ appointment.service.ts
│  │  ├─ case.service.ts
│  │  ├─ payment.service.ts
│  │  ├─ storage.service.ts
│  │  ├─ video.service.ts
│  │  └─ socket.service.ts
│  ├─ middleware/
│  │  ├─ auth.middleware.ts
│  │  ├─ rbac.middleware.ts
│  │  ├─ validate.middleware.ts
│  │  ├─ error.middleware.ts
│  │  └─ rateLimit.middleware.ts
│  ├─ schemas/
│  │  ├─ auth.schema.ts
│  │  ├─ user.schema.ts
│  │  ├─ appointment.schema.ts
│  │  └─ case.schema.ts
│  ├─ utils/
│  │  ├─ logger.ts
│  │  ├─ email.ts
│  │  └─ helpers.ts
│  ├─ sockets/
│  │  └─ index.ts
│  └─ tests/
│     ├─ unit/
│     └─ integration/
├─ .env.example
├─ package.json
├─ tsconfig.json
├─ jest.config.js
└─ README.md
```

---

## 18) Cursor/Claude prompt templates & step-by-step generation plan (backend)

Below are ready-to-copy prompts for Cursor/Claude. Use them in order. Each prompt instructs to create a single file (or a tightly coupled pair) and a corresponding test where applicable. After each generation, run quick checks: `pnpm install` (or npm), `tsc --noEmit`, `npm run test` for the created pieces.

> Global prompt header to use at the start of each prompt:

```
You are an expert Node.js + TypeScript backend engineer. Generate a single file at PATH: <path> using Express, TypeScript, Prisma, and Zod. Follow the project folder structure in this spec. Output only the file contents. Add a short header comment:
// Auto-generated by Cursor — Lawsuit backend
Make sure imports use relative paths as per folder structure and export named/default as specified.
```

### Ordered prompts (first 20; continue similarly afterwards)

**Prompt 01 — Project bootstrap**

```
Generate package.json, tsconfig.json, .env.example, .gitignore, and README.md exactly. package.json must include scripts:
"dev": "ts-node-dev --respawn --transpile-only src/index.ts",
"build": "tsc",
"start": "node dist/index.js",
"migration:dev": "prisma migrate dev",
"prisma:generate": "prisma generate",
"seed": "ts-node prisma/seed.ts",
"test": "jest --runInBand"
Add dependencies: express, prisma, @prisma/client, zod, jsonwebtoken, bcrypt, multer, socket.io, pino, dotenv, axios. DevDependencies: types for node, express, jest, ts-node-dev, ts-jest, supertest, typescript.
Suggested commit: "chore: backend bootstrap (express, prisma, tsconfig, scripts)"
```

**Prompt 02 — Prisma schema and seed**

```
Generate prisma/schema.prisma exactly as in the spec (copy the schema). Also create prisma/seed.ts which seeds an admin user, a client, two lawyers, and some sample cases and appointments. The seed script should use Prisma client, upsert patterns, and print seeded ids.
Suggested commit: "chore(prisma): add schema and seed script"
```

**Prompt 03 — src/config/index.ts**

```
Create config loader that reads process.env, validates required env vars using zod (a ConfigSchema). Export typed config object { port, databaseUrl, jwt secrets, aws keys, razorpay keys, rateLimit settings }.
Suggested commit: "feat(config): add env validation and typed config"
```

**Prompt 04 — src/index.ts and src/app.ts**

```
Create src/index.ts that imports app from src/app.ts, starts HTTP server on config.port, attaches socket.io via src/sockets/index.ts, and logs server ready. Create src/app.ts that sets up express, middleware (helmet, cors, json parser, request id, pino logger), and mounts routes from src/routes/index.ts, error handler and 404 handler.
Suggested commit: "feat(core): express app and server start with socket init"
```

**Prompt 05 — src/routes/index.ts**

```
Create central router that mounts auth, users, lawyers, appointments, cases, chat, admin, webhooks routers under /api/v1. Export default router.
Suggested commit: "feat(routes): register api v1 routes"
```

**Prompt 06 — Auth controller & routes**

```
Create:
- src/controllers/auth.controller.ts with register, login, refresh, logout handlers using auth.service.
- src/routes/auth.routes.ts wiring POST /register, /login, /refresh, /logout.
- src/services/auth.service.ts implementing register (hash password with bcrypt), login (verify password, generate tokens), generateAccessToken, generateRefreshToken, save refresh token to DB, verifyRefreshToken, revokeRefreshToken.
Add Zod schemas in src/schemas/auth.schema.ts referenced by validate middleware.
Suggested commit: "feat(auth): add auth controller, service, routes and validation"
```

**Prompt 07 — Middleware: auth, validate, rbac, error, rateLimit**

```
Create middleware files:
- src/middleware/auth.middleware.ts (verify JWT, attach req.user)
- src/middleware/rbac.middleware.ts (function requireRole(...roles))
- src/middleware/validate.middleware.ts (takes zod schema and checks req.body/params/query)
- src/middleware/error.middleware.ts and ApiError class
- src/middleware/rateLimit.middleware.ts using express-rate-limit reading config.
Suggested commit: "feat(middleware): auth, rbac, validation, error, rateLimit"
```

**Prompt 08 — Users controller/service/routes**

```
Create src/controllers/users.controller.ts, src/services/user.service.ts, and src/routes/users.routes.ts implementing endpoints:
GET /users/me, PUT /users/me, GET /users/:id
Integrate auth middleware and validate schema for update.
Suggested commit: "feat(users): add profile endpoints and service"
```

**Prompt 09 — Lawyer controller/service/routes**

```
Create files for lawyer resource:
- src/controllers/lawyers.controller.ts
- src/services/lawyer.service.ts with search/filter logic using prisma query where clauses
- src/routes/lawyers.routes.ts with endpoints GET /lawyers, GET /lawyers/:id, PUT /lawyers/:id, POST /lawyers/apply (file uploads)
Use multer for file uploads; storage.service is referenced.
Add Zod schemas for query params and body.
Suggested commit: "feat(lawyers): add search and profile management APIs"
```

**Prompt 10 — Appointments controller/service/routes + payment integration scaffold**

```
Create:
- src/controllers/appointments.controller.ts (book, cancel, list, confirm-payment)
- src/services/appointment.service.ts handling availability checks
- src/services/payment.service.ts scaffold with methods createOrder, verifyPayment and verifyWebhook (Razorpay)
- src/routes/appointments.routes.ts wiring endpoints
Include Zod validation for booking and confirm payment.
Suggested commit: "feat(appointments): add booking endpoints and payment service scaffolding"
```

(Continue in similar style: cases controllers, documents + storage.service, chat/socket files, admin routes, webhooks routes, video.service, tests, prisma client generator.)

```

### After first 10 prompts
- Run `pnpm install` or `npm install`.
- Run `pnpm prisma generate`.
- Run `pnpm prisma migrate dev --name init`.
- Run `pnpm prisma db seed`.
- Start server `pnpm dev`.
- Run tests `pnpm test`.

If any TypeScript issues arise, re-run the single-file prompt appended with: "Fix compile errors and ensure `tsc --noEmit` passes."

```

---

## 19) Appendix: example request & response (one flow)

**Book appointment**:

* Request: `POST /api/v1/appointments` (Authorization: Bearer <token>)

```json
{
  "lawyerId": "lawyer_001",
  "datetime": "2025-11-20T10:00:00.000Z",
  "caseId": "case_001"
}
```

* Response:

```json
{
  "success": true,
  "data": {
    "appointment": {
      "id": "appt_001",
      "lawyerId": "lawyer_001",
      "clientId": "user_001",
      "datetime": "2025-11-20T10:00:00.000Z",
      "status": "BOOKED",
      "payment": {
        "provider": "razorpay",
        "orderId": "order_abc123",
        "checkoutOptions": { /* for frontend integration */ }
      }
    }
  }
}
```

**Webhook (Razorpay)**: POST to `/api/v1/webhooks/payments/razorpay` with signature header `x-razorpay-signature`. Server verifies HMAC and updates appointment to `PAID`.

---

## Extra tips & best practices

* **Atomic commits**: after generating each logical unit, commit with meaningful message (prompts above include suggestions).
* **Test-driven generation**: create tests first for critical services (auth, payment, appointment).
* **Secrets**: always use environment secrets in host (never commit).
* **Observability**: add metrics and health endpoints early.
* **Documentation**: auto-generate OpenAPI spec from route definitions or maintain a `openapi.yaml` file manually for public API docs.

---

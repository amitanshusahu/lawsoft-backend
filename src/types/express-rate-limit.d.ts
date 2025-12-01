// small declaration file to satisfy TypeScript if @types/express-rate-limit isn't installed.

declare module 'express-rate-limit' {
  import { RequestHandler } from 'express';
  const rateLimit: (opts: any) => RequestHandler;
  export default rateLimit;
}

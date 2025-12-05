import { z } from 'zod';
export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
        phone: z.string().optional(),
        role: z.enum(['CLIENT', 'LAWYER', 'ADMIN']),
    }),
});
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
    }),
});
export const refreshSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1),
    }),
});
export const logoutSchema = refreshSchema;
export const requestOtpSchema = z.object({
    body: z.object({
        identifier: z.string().min(4), // phone or email
    }),
});
export const verifyOtpSchema = z.object({
    body: z.object({
        identifier: z.string().min(4),
        code: z.string().length(6),
    }),
});
export const restorePasswordSchema = z.object({
    body: z.object({
        identifier: z.string().min(4),
        code: z.string().length(6),
        password: z.string().min(8),
    }),
});
export default {
    registerSchema,
    loginSchema,
    refreshSchema,
    logoutSchema,
    requestOtpSchema,
    verifyOtpSchema,
    restorePasswordSchema,
};
//# sourceMappingURL=auth.schema.js.map
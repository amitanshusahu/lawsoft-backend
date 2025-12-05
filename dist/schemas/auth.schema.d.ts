import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        role: z.ZodEnum<{
            CLIENT: "CLIENT";
            LAWYER: "LAWYER";
            ADMIN: "ADMIN";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const refreshSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const logoutSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const requestOtpSchema: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const verifyOtpSchema: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
        code: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const restorePasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
        code: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshInput = z.infer<typeof refreshSchema>['body'];
export type RequestOtpInput = z.infer<typeof requestOtpSchema>['body'];
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>['body'];
export type RestorePasswordInput = z.infer<typeof restorePasswordSchema>['body'];
declare const _default: {
    registerSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
            phone: z.ZodOptional<z.ZodString>;
            role: z.ZodEnum<{
                CLIENT: "CLIENT";
                LAWYER: "LAWYER";
                ADMIN: "ADMIN";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    loginSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    refreshSchema: z.ZodObject<{
        body: z.ZodObject<{
            refreshToken: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    logoutSchema: z.ZodObject<{
        body: z.ZodObject<{
            refreshToken: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    requestOtpSchema: z.ZodObject<{
        body: z.ZodObject<{
            identifier: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    verifyOtpSchema: z.ZodObject<{
        body: z.ZodObject<{
            identifier: z.ZodString;
            code: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    restorePasswordSchema: z.ZodObject<{
        body: z.ZodObject<{
            identifier: z.ZodString;
            code: z.ZodString;
            password: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export default _default;
//# sourceMappingURL=auth.schema.d.ts.map
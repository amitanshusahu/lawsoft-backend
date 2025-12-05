import jwt from 'jsonwebtoken';
type Tokens = {
    accessToken: string;
    refreshToken: string;
};
export declare function generateAccessToken(payload: object): Promise<any>;
export declare function generateRefreshToken(payload: object): Promise<any>;
export declare function register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'CLIENT' | 'LAWYER' | 'ADMIN';
}): Promise<{
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string;
        role: import("@prisma/client").$Enums.UserRole;
        passwordHash: string | null;
        avatarUrl: string | null;
        isVerified: boolean;
        emailVerified: boolean;
        phoneVerified: boolean;
        fcmToken: string | null;
    };
} & Tokens>;
export declare function login(data: {
    email: string;
    password: string;
}): Promise<{
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string;
        role: import("@prisma/client").$Enums.UserRole;
        passwordHash: string | null;
        avatarUrl: string | null;
        isVerified: boolean;
        emailVerified: boolean;
        phoneVerified: boolean;
        fcmToken: string | null;
    };
} & Tokens>;
export declare function verifyRefreshToken(token: string): Promise<string | jwt.JwtPayload>;
export declare function revokeRefreshToken(token: string): Promise<void>;
export declare function refreshTokens(token: string): Promise<{
    accessToken: any;
    refreshToken: any;
}>;
export declare function requestOtp(identifier: string): Promise<{
    ok: boolean;
    sent: boolean;
} | {
    ok: boolean;
    sent?: undefined;
}>;
export declare function verifyOtp(identifier: string, code: string): Promise<{
    user: any;
    accessToken: any;
    refreshToken: any;
}>;
export declare function restorePassword(identifier: string, code: string, newPassword: string): Promise<{
    ok: boolean;
}>;
declare const _default: {
    register: typeof register;
    login: typeof login;
    generateAccessToken: typeof generateAccessToken;
    generateRefreshToken: typeof generateRefreshToken;
    verifyRefreshToken: typeof verifyRefreshToken;
    revokeRefreshToken: typeof revokeRefreshToken;
    refreshTokens: typeof refreshTokens;
    restorePassword: typeof restorePassword;
};
export default _default;
//# sourceMappingURL=auth.service.d.ts.map
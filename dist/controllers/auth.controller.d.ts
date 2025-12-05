import { Request, Response } from 'express';
export declare function register(req: Request, res: Response): Promise<void>;
export declare function login(req: Request, res: Response): Promise<void>;
export declare function refresh(req: Request, res: Response): Promise<void>;
export declare function logout(req: Request, res: Response): Promise<void>;
export declare function requestOtp(req: Request, res: Response): Promise<void>;
export declare function verifyOtp(req: Request, res: Response): Promise<void>;
export declare function getMe(req: Request, res: Response): Promise<void>;
export declare function restorePassword(req: Request, res: Response): Promise<void>;
declare const _default: {
    register: typeof register;
    login: typeof login;
    refresh: typeof refresh;
    logout: typeof logout;
    requestOtp: typeof requestOtp;
    verifyOtp: typeof verifyOtp;
    getMe: typeof getMe;
    restorePassword: typeof restorePassword;
};
export default _default;
//# sourceMappingURL=auth.controller.d.ts.map
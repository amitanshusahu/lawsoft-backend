import { Request, Response } from 'express';
export declare function getMe(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateMe(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getClientInformation(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function postClientInformation(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getLawyerInformation(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function postLawyerInformation(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    getMe: typeof getMe;
    updateMe: typeof updateMe;
    getById: typeof getById;
    getClientInformation: typeof getClientInformation;
    postClientInformation: typeof postClientInformation;
    getLawyerInformation: typeof getLawyerInformation;
    postLawyerInformation: typeof postLawyerInformation;
};
export default _default;
//# sourceMappingURL=users.controller.d.ts.map
import { Request, Response } from 'express';
export declare function book(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function availability(req: Request, res: Response): Promise<void>;
export declare function cancel(req: Request, res: Response): Promise<void>;
export declare function attend(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function list(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function confirmPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function webhook(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    book: typeof book;
    cancel: typeof cancel;
    list: typeof list;
    confirmPayment: typeof confirmPayment;
    webhook: typeof webhook;
};
export default _default;
//# sourceMappingURL=appointments.controller.d.ts.map
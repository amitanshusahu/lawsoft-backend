import { Request, Response } from 'express';
export declare function search(req: Request, res: Response): Promise<void>;
export declare function getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function update(req: Request, res: Response): Promise<void>;
export declare function apply(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    search: typeof search;
    getById: typeof getById;
    update: typeof update;
    apply: typeof apply;
};
export default _default;
//# sourceMappingURL=lawyers.controller.d.ts.map
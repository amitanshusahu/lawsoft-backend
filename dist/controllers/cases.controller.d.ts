import { Request, Response } from 'express';
export declare function createCase(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function listCases(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getCase(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateCase(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function addDocument(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function listDocuments(req: Request, res: Response): Promise<void>;
export declare function addTimeline(req: Request, res: Response): Promise<void>;
export declare function addHearing(req: Request, res: Response): Promise<void>;
export declare function generatePresignedUpload(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    createCase: typeof createCase;
    listCases: typeof listCases;
    getCase: typeof getCase;
    updateCase: typeof updateCase;
    addDocument: typeof addDocument;
    listDocuments: typeof listDocuments;
    addTimeline: typeof addTimeline;
    addHearing: typeof addHearing;
    generatePresignedUpload: typeof generatePresignedUpload;
};
export default _default;
//# sourceMappingURL=cases.controller.d.ts.map
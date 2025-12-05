import { Request, Response } from 'express';
export declare function createChat(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getMessages(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function postMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getParticipants(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    createChat: typeof createChat;
    getMessages: typeof getMessages;
    postMessage: typeof postMessage;
    getParticipants: typeof getParticipants;
};
export default _default;
//# sourceMappingURL=chat.controller.d.ts.map
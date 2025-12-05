import { Socket } from 'socket.io';
export declare function socketAuthMiddleware(socket: Socket, next: (err?: any) => void): Promise<void>;
export declare function canJoinChat(socket: Socket, chatId: string): Promise<boolean>;
export default socketAuthMiddleware;
//# sourceMappingURL=socket-auth.middleware.d.ts.map
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
export declare function getIO(): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | null;
export declare function init(server: HttpServer, opts?: {
    logger?: any;
}): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export default init;
//# sourceMappingURL=index.d.ts.map
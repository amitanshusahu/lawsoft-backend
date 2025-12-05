import http from 'http';
declare const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
declare function start(): Promise<void>;
declare function shutdown(code?: number): Promise<void>;
export { server, start, shutdown };
export default server;
//# sourceMappingURL=index.d.ts.map
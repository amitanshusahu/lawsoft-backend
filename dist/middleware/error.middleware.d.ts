import { ErrorRequestHandler } from 'express';
export declare class ApiError extends Error {
    statusCode: number;
    details?: any;
    constructor(statusCode?: number, message?: string, details?: any);
}
/** Express error-handling middleware that understands ApiError */
declare const errorHandler: ErrorRequestHandler;
export default errorHandler;
//# sourceMappingURL=error.middleware.d.ts.map
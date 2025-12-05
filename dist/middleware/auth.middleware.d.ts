import { RequestHandler } from 'express';
/**
 * Attach user to req.user after verifying JWT access token.
 * Usage: app.use(authMiddleware) or router.use(authMiddleware)
 */
export declare const authMiddleware: RequestHandler;
export default authMiddleware;
//# sourceMappingURL=auth.middleware.d.ts.map
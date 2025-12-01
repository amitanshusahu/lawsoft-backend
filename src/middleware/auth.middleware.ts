import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { ApiError } from './error.middleware.js';

/**
 * Attach user to req.user after verifying JWT access token.
 * Usage: app.use(authMiddleware) or router.use(authMiddleware)
 */
export const authMiddleware: RequestHandler = (req, _res, next) => {
	try {
		const auth = (req.headers.authorization as string) || '';
		if (!auth.startsWith('Bearer ')) {
			throw new ApiError(401, 'Missing or invalid Authorization header');
		}
		const token = auth.slice(7).trim();
		if (!token) throw new ApiError(401, 'Missing token');

		const payload = jwt.verify(token, config.jwt.accessToken.secret) as any;
		// Attach a minimal user object. Consumers can widen types if needed.
		(req as any).user = { id: payload.sub, role: payload.role };
		return next();
	} catch (err: any) {
		return next(new ApiError(401, String(err.message ?? 'Invalid token')));
	}
};

export default authMiddleware;

import { RequestHandler } from 'express';
import { ApiError } from './error.middleware.js';

/** requireRole(...roles) - middleware factory to enforce user roles */
export function requireRole(...roles: string[]): RequestHandler {
	return (req, _res, next) => {
		const user = (req as any).user;
		if (!user || !user.role) {
			return next(new ApiError(401, 'Authentication required'));
		}

		if (!roles.includes(user.role)) {
			return next(new ApiError(403, 'Forbidden - insufficient role'));
		}

		return next();
	};
}

export default requireRole;

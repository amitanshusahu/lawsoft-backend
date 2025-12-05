import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { ApiError } from './error.middleware.js';
/**
 * Attach user to req.user after verifying JWT access token.
 * Usage: app.use(authMiddleware) or router.use(authMiddleware)
 */
export const authMiddleware = (req, _res, next) => {
    try {
        const auth = req.headers.authorization || '';
        if (!auth.startsWith('Bearer ')) {
            throw new ApiError(401, 'Missing or invalid Authorization header');
        }
        const token = auth.slice(7).trim();
        if (!token)
            throw new ApiError(401, 'Missing token');
        const payload = jwt.verify(token, config.jwt.accessToken.secret);
        // Attach a minimal user object. Consumers can widen types if needed.
        req.user = { id: payload.sub, role: payload.role };
        return next();
    }
    catch (err) {
        return next(new ApiError(401, String(err.message ?? 'Invalid token')));
    }
};
export default authMiddleware;
//# sourceMappingURL=auth.middleware.js.map
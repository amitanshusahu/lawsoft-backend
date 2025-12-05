import { ApiError } from './error.middleware.js';
/** requireRole(...roles) - middleware factory to enforce user roles */
export function requireRole(...roles) {
    return (req, _res, next) => {
        const user = req.user;
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
//# sourceMappingURL=rbac.middleware.js.map
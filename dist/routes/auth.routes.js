import express from 'express';
import * as controller from '../controllers/auth.controller.js';
import validate from '../middleware/validate.middleware.js';
import schemas from '../schemas/auth.schema.js';
import auth from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/register', validate(schemas.registerSchema), controller.register);
router.post('/login', validate(schemas.loginSchema), controller.login);
router.post('/refresh', validate(schemas.refreshSchema), controller.refresh);
router.post('/logout', validate(schemas.logoutSchema), controller.logout);
router.post('/request-otp', validate(schemas.requestOtpSchema), controller.requestOtp);
router.post('/verify-otp', validate(schemas.verifyOtpSchema), controller.verifyOtp);
router.get('/me', auth, controller.getMe);
router.put('/restore-password', validate(schemas.restorePasswordSchema), controller.restorePassword);
export default router;
//# sourceMappingURL=auth.routes.js.map
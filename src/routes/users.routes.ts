import express from 'express';
import * as controller from '../controllers/users.controller.js';
import auth from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import schemas from '../schemas/user.schema.js';
import requireRole from '../middleware/rbac.middleware.js';

const router = express.Router();

// Protected routes
router.get('/me', auth, controller.getMe);
router.put('/me', auth, validate(schemas.updateUserSchema), controller.updateMe);

// Client information - read & update (client)
router.get('/client-information', auth, requireRole('CLIENT'), controller.getClientInformation);
router.post('/client-information', auth, requireRole('CLIENT'), validate(schemas.clientInfoSchema), controller.postClientInformation);

// Lawyer information - read & update (lawyer)
router.get('/lawyer-information', auth, requireRole('LAWYER'), controller.getLawyerInformation);
router.post('/lawyer-information', auth, requireRole('LAWYER'), validate(schemas.lawyerInfoSchema), controller.postLawyerInformation);

// Public: get user by id
router.get('/:id', auth, requireRole('ADMIN'), controller.getById);

export default router;

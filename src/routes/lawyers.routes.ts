import express from 'express';
import * as controller from '../controllers/lawyers.controller.js';
import validate from '../middleware/validate.middleware.js';
import schemas from '../schemas/lawyer.schema.js';
import auth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/rbac.middleware.js';

const router = express.Router();

router.get('/', validate(schemas.lawyerSearchSchema), controller.search);
router.get('/:id', controller.getById);
router.put('/:id', auth, validate(schemas.updateLawyerSchema), controller.update);
router.post('/apply', auth, requireRole('LAWYER','ADMIN'), validate(schemas.lawyerProfileSchema), controller.apply);

export default router;

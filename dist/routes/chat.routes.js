import express from 'express';
import * as ctrl from '../controllers/chat.controller.js';
import auth from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import schemas from '../schemas/chat.schema.js';
const router = express.Router();
router.post('/', auth, validate(schemas.createChatSchema), ctrl.createChat);
router.get('/:chatId/messages', auth, validate(schemas.getMessagesSchema), ctrl.getMessages);
router.post('/:chatId/messages', auth, validate(schemas.postMessageSchema), ctrl.postMessage);
router.get('/:chatId/participants', auth, ctrl.getParticipants);
export default router;
//# sourceMappingURL=chat.routes.js.map
// import { Router } from "express";
// import * as controller from "../controllers/model.controller.js";

import express from 'express';
import * as controller from '../controllers/model.controller.js';
import validate from '../middleware/validate.middleware.js';
import schemas from '../schemas/model.schema.js';
import auth from '../middleware/auth.middleware.js';

// const router = Router();
const router = express.Router();

/**
 * POST /api/model/chat
 * Body: { messages: [{ role: "user", content: "Hello" }], temperature?: 0.7 }
 */
router.post("/chat", validate(schemas.chatCompletionSchema), controller.chatCompletionHandler);

export default router;
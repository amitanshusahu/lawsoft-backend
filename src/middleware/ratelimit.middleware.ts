import rateLimit from 'express-rate-limit';
import config from '../config/index.js';
import type { Request, Response } from 'express';

const limiter = rateLimit({
	windowMs: config.rateLimit.windowMs,
	max: config.rateLimit.max,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req: Request, res: Response) => {
		res.status(429).json({ error: 'Too many requests, please try again later.' });
	},
});

export default limiter;

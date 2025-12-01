import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export class ApiError extends Error {
	statusCode: number;
	details?: any;

	constructor(statusCode = 500, message = 'Internal Server Error', details?: any) {
		super(message);
		this.statusCode = statusCode;
		this.details = details;
		Error.captureStackTrace(this, this.constructor);
	}
}

/** Express error-handling middleware that understands ApiError */
const errorHandler: ErrorRequestHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
	if (err instanceof ApiError) {
		return res.status(err.statusCode).json({ error: err.message, details: err.details });
	}

	// unknown error
	// Avoid leaking internals in production; here we return message for developer convenience
	const status = err?.statusCode || 500;
	const message = err?.message || 'Internal Server Error';
	return res.status(status).json({ error: message });
};

export default errorHandler;

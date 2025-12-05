import { RequestHandler } from 'express';
import { ZodSchema } from 'zod';
type AnyZod = ZodSchema<any>;
/**
 * validate(schema) - middleware factory that expects a schema with optional keys: body, query, params
 */
export default function validate(schema: AnyZod): RequestHandler;
export {};
//# sourceMappingURL=validate.middleware.d.ts.map
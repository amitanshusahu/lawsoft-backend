import { z } from 'zod';
export const createChatSchema = z.object({
    body: z.object({
        otherUserId: z.string().min(1),
        caseId: z.string().optional(),
    }),
});
export const getMessagesSchema = z.object({
    params: z.object({ chatId: z.string().min(1) }),
    query: z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().default(20) }).optional(),
});
export const postMessageSchema = z.object({
    params: z.object({ chatId: z.string().min(1) }),
    body: z.object({ text: z.string().optional(), attachments: z.array(z.string()).optional() }).refine((d) => !!d.text || (d.attachments && d.attachments.length > 0), { message: 'text or attachments required' }),
});
export default { createChatSchema, getMessagesSchema, postMessageSchema };
//# sourceMappingURL=chat.schema.js.map
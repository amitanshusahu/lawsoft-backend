import { z } from "zod";
// Body schema for chat completion requests (wrapped under { body: ... } to match validate middleware)
const chatBodySchema = z.object({
    messages: z.array(z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string().min(1, "Message content cannot be empty"),
    })),
    temperature: z.number().min(0).max(2).optional().default(1),
    top_p: z.number().min(0).max(1).optional().default(1),
    max_tokens: z.number().int().positive().optional(),
    stream: z.boolean().optional().default(false),
});
export const chatCompletionSchema = z.object({ body: chatBodySchema });
export default { chatCompletionSchema };
//# sourceMappingURL=model.schema.js.map
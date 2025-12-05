import { z } from "zod";
declare const chatBodySchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            system: "system";
            assistant: "assistant";
        }>;
        content: z.ZodString;
    }, z.core.$strip>>;
    temperature: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    top_p: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    max_tokens: z.ZodOptional<z.ZodNumber>;
    stream: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const chatCompletionSchema: z.ZodObject<{
    body: z.ZodObject<{
        messages: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<{
                user: "user";
                system: "system";
                assistant: "assistant";
            }>;
            content: z.ZodString;
        }, z.core.$strip>>;
        temperature: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        top_p: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        max_tokens: z.ZodOptional<z.ZodNumber>;
        stream: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ChatCompletionRequest = z.infer<typeof chatBodySchema>;
declare const _default: {
    chatCompletionSchema: z.ZodObject<{
        body: z.ZodObject<{
            messages: z.ZodArray<z.ZodObject<{
                role: z.ZodEnum<{
                    user: "user";
                    system: "system";
                    assistant: "assistant";
                }>;
                content: z.ZodString;
            }, z.core.$strip>>;
            temperature: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            top_p: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            max_tokens: z.ZodOptional<z.ZodNumber>;
            stream: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export default _default;
//# sourceMappingURL=model.schema.d.ts.map
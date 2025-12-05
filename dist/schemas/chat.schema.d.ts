import { z } from 'zod';
export declare const createChatSchema: z.ZodObject<{
    body: z.ZodObject<{
        otherUserId: z.ZodString;
        caseId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getMessagesSchema: z.ZodObject<{
    params: z.ZodObject<{
        chatId: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodOptional<z.ZodObject<{
        page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const postMessageSchema: z.ZodObject<{
    params: z.ZodObject<{
        chatId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        text: z.ZodOptional<z.ZodString>;
        attachments: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const _default: {
    createChatSchema: z.ZodObject<{
        body: z.ZodObject<{
            otherUserId: z.ZodString;
            caseId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getMessagesSchema: z.ZodObject<{
        params: z.ZodObject<{
            chatId: z.ZodString;
        }, z.core.$strip>;
        query: z.ZodOptional<z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    postMessageSchema: z.ZodObject<{
        params: z.ZodObject<{
            chatId: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            text: z.ZodOptional<z.ZodString>;
            attachments: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export default _default;
//# sourceMappingURL=chat.schema.d.ts.map
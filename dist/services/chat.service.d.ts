export declare function getOrCreateChat(opts: {
    caseId?: string;
    userA: string;
    userB: string;
}): Promise<{
    caseId: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function isParticipant(chatId: string, userId: string): Promise<boolean>;
export declare function ensureParticipantsShareRelation(userA: string, userB: string): Promise<boolean>;
export declare function addMessage(chatId: string, senderId: string, text?: string, attachments?: string[]): Promise<{
    id: string;
    createdAt: Date;
    chatId: string;
    senderId: string;
    text: string | null;
    attachments: string[];
    isRead: boolean;
    readAt: Date | null;
}>;
export declare function getMessages(chatId: string, page?: number, limit?: number): Promise<{
    items: {
        id: string;
        createdAt: Date;
        chatId: string;
        senderId: string;
        text: string | null;
        attachments: string[];
        isRead: boolean;
        readAt: Date | null;
    }[];
    total: number;
    page: number;
    limit: number;
}>;
export declare function getParticipants(chatId: string): Promise<({
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    email: string;
    phone: string;
    role: import("@prisma/client").$Enums.UserRole;
    passwordHash: string | null;
    avatarUrl: string | null;
    isVerified: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    fcmToken: string | null;
} | null)[]>;
export declare function markMessageRead(messageId: string, readerId: string): Promise<{
    id: string;
    createdAt: Date;
    chatId: string;
    senderId: string;
    text: string | null;
    attachments: string[];
    isRead: boolean;
    readAt: Date | null;
}>;
declare const _default: {
    getOrCreateChat: typeof getOrCreateChat;
    isParticipant: typeof isParticipant;
    ensureParticipantsShareRelation: typeof ensureParticipantsShareRelation;
    addMessage: typeof addMessage;
    getMessages: typeof getMessages;
    getParticipants: typeof getParticipants;
    markMessageRead: typeof markMessageRead;
};
export default _default;
//# sourceMappingURL=chat.service.d.ts.map
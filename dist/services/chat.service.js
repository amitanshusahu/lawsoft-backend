import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Ensure there's a chat for a case or a one-to-one chat between two users
export async function getOrCreateChat(opts) {
    const { caseId, userA, userB } = opts;
    if (caseId) {
        // Try to find chat tied to case
        const existing = await prisma.chat.findUnique({ where: { caseId } });
        if (existing)
            return existing;
        // Create chat linked to case
        return prisma.chat.create({ data: { caseId } });
    }
    // For one-to-one chats not tied to a case, we create a chat and rely on messages to track participants
    // This schema currently doesn't store participants directly, so we create a chat record and rely on messages
    const c = await prisma.chat.create({ data: {} });
    return c;
}
export async function isParticipant(chatId, userId) {
    // Participant if they have sent/received messages in the chat or are involved in the linked case
    const chat = await prisma.chat.findUnique({ where: { id: chatId }, include: { case: true } });
    if (!chat)
        return false;
    if (chat.case) {
        if (chat.case.clientId === userId || chat.case.lawyerId === userId)
            return true;
    }
    const msg = await prisma.chatMessage.findFirst({ where: { chatId, OR: [{ senderId: userId }] } });
    if (msg)
        return true;
    return false;
}
export async function ensureParticipantsShareRelation(userA, userB) {
    // Check for confirmed appointment between the two
    const appt = await prisma.appointment.findFirst({ where: { OR: [{ clientId: userA, lawyerId: userB, status: 'CONFIRMED' }, { clientId: userB, lawyerId: userA, status: 'CONFIRMED' }] } });
    if (appt)
        return true;
    // Check for case linking the users
    const c = await prisma.case.findFirst({ where: { OR: [{ clientId: userA, lawyerId: userB }, { clientId: userB, lawyerId: userA }] } });
    if (c)
        return true;
    return false;
}
export async function addMessage(chatId, senderId, text, attachments) {
    const msg = await prisma.chatMessage.create({ data: { chatId, senderId, text: text ?? null, attachments: attachments ?? [] } });
    return msg;
}
export async function getMessages(chatId, page = 1, limit = 20) {
    const skip = Math.max(0, (page - 1) * limit);
    const items = await prisma.chatMessage.findMany({ where: { chatId }, orderBy: { createdAt: 'desc' }, skip, take: limit });
    const total = await prisma.chatMessage.count({ where: { chatId } });
    return { items, total, page, limit };
}
export async function getParticipants(chatId) {
    const chat = await prisma.chat.findUnique({ where: { id: chatId }, include: { case: { include: { client: true, lawyer: true } } } });
    if (!chat)
        return [];
    if (chat.case) {
        const client = await prisma.user.findUnique({ where: { id: chat.case.clientId } });
        const lawyer = chat.case.lawyerId ? await prisma.user.findUnique({ where: { id: chat.case.lawyerId } }) : null;
        return [client, lawyer].filter(Boolean);
    }
    // For non-case chats, derive participants from messages
    const msgs = await prisma.chatMessage.findMany({ where: { chatId }, distinct: ['senderId'] });
    const ids = Array.from(new Set(msgs.map((m) => m.senderId)));
    const users = await prisma.user.findMany({ where: { id: { in: ids } } });
    return users;
}
export async function markMessageRead(messageId, readerId) {
    return prisma.chatMessage.update({ where: { id: messageId }, data: { isRead: true, readAt: new Date() } });
}
export default { getOrCreateChat, isParticipant, ensureParticipantsShareRelation, addMessage, getMessages, getParticipants, markMessageRead };
//# sourceMappingURL=chat.service.js.map
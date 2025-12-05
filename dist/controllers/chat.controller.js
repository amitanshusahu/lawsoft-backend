import chatService from '../services/chat.service.js';
import { getIO } from '../sockets/index.js';
export async function createChat(req, res) {
    try {
        const userId = req.user?.id;
        const { otherUserId, caseId } = req.body;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        // Ensure users have relation if caseId not provided
        if (!caseId) {
            const ok = await chatService.ensureParticipantsShareRelation(userId, otherUserId);
            if (!ok)
                return res.status(403).json({ error: 'No shared case or appointment' });
        }
        const chat = await chatService.getOrCreateChat({ caseId, userA: userId, userB: otherUserId });
        res.json({ chat });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export async function getMessages(req, res) {
    try {
        const userId = req.user?.id;
        const chatId = req.params.chatId;
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const ok = await chatService.isParticipant(chatId, userId);
        if (!ok)
            return res.status(403).json({ error: 'Forbidden' });
        const data = await chatService.getMessages(chatId, page, limit);
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: String(err.message ?? err) });
    }
}
export async function postMessage(req, res) {
    try {
        const userId = req.user?.id;
        const chatId = req.params.chatId;
        const { text, attachments } = req.body;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const ok = await chatService.isParticipant(chatId, userId);
        if (!ok)
            return res.status(403).json({ error: 'Forbidden' });
        const msg = await chatService.addMessage(chatId, userId, text, attachments);
        // Emit via socket.io
        try {
            const io = getIO();
            if (io) {
                io.to(`chat_${chatId}`).emit('chat:message:new', { message: msg });
            }
        }
        catch (err) {
            // ignore socket emit errors
        }
        res.status(201).json({ message: msg });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export async function getParticipants(req, res) {
    try {
        const userId = req.user?.id;
        const chatId = req.params.chatId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const ok = await chatService.isParticipant(chatId, userId);
        if (!ok)
            return res.status(403).json({ error: 'Forbidden' });
        const participants = await chatService.getParticipants(chatId);
        res.json({ participants });
    }
    catch (err) {
        res.status(500).json({ error: String(err.message ?? err) });
    }
}
export default { createChat, getMessages, postMessage, getParticipants };
//# sourceMappingURL=chat.controller.js.map
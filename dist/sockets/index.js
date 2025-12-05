import { Server } from 'socket.io';
import socketAuthMiddleware, { canJoinChat } from '../middleware/socket-auth.middleware.js';
import chatService from '../services/chat.service.js';
let io = null;
export function getIO() {
    return io;
}
export function init(server, opts) {
    io = new Server(server, { cors: { origin: '*' } });
    // Use middleware to authenticate socket
    io.use((socket, next) => socketAuthMiddleware(socket, next));
    io.on('connection', (socket) => {
        const user = socket.user;
        // join rooms on request
        socket.on('chat:join', async (payload) => {
            try {
                const { chatId } = payload;
                const ok = await canJoinChat(socket, chatId);
                if (!ok)
                    return socket.emit('chat:room:joined', { chatId, ok: false, reason: 'not_participant' });
                socket.join(`chat_${chatId}`);
                socket.emit('chat:room:joined', { chatId, ok: true });
            }
            catch (err) {
                socket.emit('chat:room:joined', { ok: false, reason: 'error' });
            }
        });
        socket.on('chat:message:new', async (payload) => {
            try {
                const { chatId, text, attachments } = payload;
                const userId = socket.user?.id;
                const ok = await canJoinChat(socket, chatId);
                if (!ok)
                    return socket.emit('error', 'not_allowed');
                const msg = await chatService.addMessage(chatId, userId, text, attachments);
                io?.to(`chat_${chatId}`).emit('chat:message:new', { message: msg });
            }
            catch (err) {
                socket.emit('error', String(err));
            }
        });
        socket.on('chat:typing:start', (payload) => {
            const { chatId } = payload;
            socket.to(`chat_${chatId}`).emit('chat:typing:start', { user: { id: socket.user?.id, name: socket.user?.name } });
        });
        socket.on('chat:typing:stop', (payload) => {
            const { chatId } = payload;
            socket.to(`chat_${chatId}`).emit('chat:typing:stop', { user: { id: socket.user?.id } });
        });
        socket.on('chat:message:read', async (payload) => {
            try {
                const { chatId, messageId } = payload;
                const ok = await canJoinChat(socket, chatId);
                if (!ok)
                    return;
                const m = await chatService.markMessageRead(messageId, socket.user?.id);
                io?.to(`chat_${chatId}`).emit('chat:message:read', { messageId, readerId: socket.user?.id, readAt: m.readAt });
            }
            catch (err) {
                // ignore
            }
        });
    });
    return io;
}
export default init;
//# sourceMappingURL=index.js.map
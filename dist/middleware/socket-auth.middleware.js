import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import chatService from '../services/chat.service.js';
export async function socketAuthMiddleware(socket, next) {
    try {
        const token = (socket.handshake.auth && socket.handshake.auth.token) || socket.handshake.headers?.authorization || '';
        let tok = token;
        if (tok.startsWith('Bearer '))
            tok = tok.slice(7);
        if (!tok)
            return next(new Error('Missing token'));
        const payload = jwt.verify(tok, config.jwt.accessToken.secret);
        socket.user = { id: payload.sub, role: payload.role };
        // Optionally restrict room join attempts by verifying participant when joining room
        return next();
    }
    catch (err) {
        return next(new Error('Authentication error'));
    }
}
export async function canJoinChat(socket, chatId) {
    const user = socket.user;
    if (!user)
        return false;
    return await chatService.isParticipant(chatId, user.id);
}
export default socketAuthMiddleware;
//# sourceMappingURL=socket-auth.middleware.js.map
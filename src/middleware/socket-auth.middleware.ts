import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import chatService from '../services/chat.service.js';

export async function socketAuthMiddleware(socket: Socket, next: (err?: any) => void) {
  try {
    const token = (socket.handshake.auth && socket.handshake.auth.token) || (socket.handshake.headers?.authorization as string) || '';
    let tok = token;
    if (tok.startsWith('Bearer ')) tok = tok.slice(7);
    if (!tok) return next(new Error('Missing token'));
    const payload = (jwt as any).verify(tok, config.jwt.accessToken.secret) as any;
    (socket as any).user = { id: payload.sub, role: payload.role };
    // Optionally restrict room join attempts by verifying participant when joining room
    return next();
  } catch (err: any) {
    return next(new Error('Authentication error'));
  }
}

export async function canJoinChat(socket: Socket, chatId: string) {
  const user = (socket as any).user;
  if (!user) return false;
  return await chatService.isParticipant(chatId, user.id);
}

export default socketAuthMiddleware;

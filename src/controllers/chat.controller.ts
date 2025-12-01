import { Request, Response } from 'express';
import chatService from '../services/chat.service.js';
import { getIO } from '../sockets/index.js';

export async function createChat(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id as string;
    const { otherUserId, caseId } = req.body as any;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Ensure users have relation if caseId not provided
    if (!caseId) {
      const ok = await chatService.ensureParticipantsShareRelation(userId, otherUserId);
      if (!ok) return res.status(403).json({ error: 'No shared case or appointment' });
    }

    const chat = await chatService.getOrCreateChat({ caseId, userA: userId, userB: otherUserId });
    res.json({ chat });
  } catch (err: any) {
    res.status(400).json({ error: String(err.message ?? err) });
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id as string;
    const chatId = req.params.chatId;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const ok = await chatService.isParticipant(chatId, userId);
    if (!ok) return res.status(403).json({ error: 'Forbidden' });

    const data = await chatService.getMessages(chatId, page, limit);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: String(err.message ?? err) });
  }
}

export async function postMessage(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id as string;
    const chatId = req.params.chatId;
    const { text, attachments } = req.body as any;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const ok = await chatService.isParticipant(chatId, userId);
    if (!ok) return res.status(403).json({ error: 'Forbidden' });

    const msg = await chatService.addMessage(chatId, userId, text, attachments);

    // Emit via socket.io
    try {
      const io = getIO();
      if (io) {
        io.to(`chat_${chatId}`).emit('chat:message:new', { message: msg });
      }
    } catch (err) {
      // ignore socket emit errors
    }

    res.status(201).json({ message: msg });
  } catch (err: any) {
    res.status(400).json({ error: String(err.message ?? err) });
  }
}

export async function getParticipants(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id as string;
    const chatId = req.params.chatId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const ok = await chatService.isParticipant(chatId, userId);
    if (!ok) return res.status(403).json({ error: 'Forbidden' });
    const participants = await chatService.getParticipants(chatId);
    res.json({ participants });
  } catch (err: any) {
    res.status(500).json({ error: String(err.message ?? err) });
  }
}

export default { createChat, getMessages, postMessage, getParticipants };

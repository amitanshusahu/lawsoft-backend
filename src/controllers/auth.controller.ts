import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import usersService from '../services/users.service.js';

export async function register(req: Request, res: Response) {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err: any) {
    res.status(400).json({ error: String(err.message ?? err) });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.json({ user, accessToken, refreshToken });
  } catch (err: any) {
    res.status(401).json({ error: String(err.message ?? err) });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshTokens(refreshToken);
    res.json(tokens);
  } catch (err: any) {
    res.status(401).json({ error: String(err.message ?? err) });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    await authService.revokeRefreshToken(refreshToken);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: String(err.message ?? err) });
  }
}

export async function requestOtp(req: Request, res: Response) {
  try {
    const { identifier } = req.body as any;
    const out = await authService.requestOtp(identifier);
    res.json(out);
  } catch (err: any) {
    res.status(429).json({ error: String(err.message ?? err) });
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { identifier, code } = req.body as any;
    const tokens = await authService.verifyOtp(identifier, code);
    res.json(tokens);
  } catch (err: any) {
    res.status(400).json({ error: String(err.message ?? err) });
  }
}

export async function getMe(req: Request, res: Response) {
//   const uid = (req as any).user?.id as string | undefined;
//   if (!uid) return res.status(401).json({ error: 'Unauthorized' });
//   const user = await usersService.getCurrent(uid);
//   if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: (req as any).user });
}

export async function restorePassword(req: Request, res: Response) {
  try {
    const { identifier, code, password } = req.body as any;
    const out = await authService.restorePassword(identifier, code, password);
    res.json(out);
  } catch (err: any) {
    res.status(400).json({ error: String(err.message ?? err) });
  }
}

export default { register, login, refresh, logout, requestOtp, verifyOtp, getMe, restorePassword };

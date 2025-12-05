import * as authService from '../services/auth.service.js';
export async function register(req, res) {
    try {
        const { user, accessToken, refreshToken } = await authService.register(req.body);
        res.status(201).json({ user, accessToken, refreshToken });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export async function login(req, res) {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body);
        res.json({ user, accessToken, refreshToken });
    }
    catch (err) {
        res.status(401).json({ error: String(err.message ?? err) });
    }
}
export async function refresh(req, res) {
    try {
        const { refreshToken } = req.body;
        const tokens = await authService.refreshTokens(refreshToken);
        res.json(tokens);
    }
    catch (err) {
        res.status(401).json({ error: String(err.message ?? err) });
    }
}
export async function logout(req, res) {
    try {
        const { refreshToken } = req.body;
        await authService.revokeRefreshToken(refreshToken);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export async function requestOtp(req, res) {
    try {
        const { identifier } = req.body;
        const out = await authService.requestOtp(identifier);
        res.json(out);
    }
    catch (err) {
        res.status(429).json({ error: String(err.message ?? err) });
    }
}
export async function verifyOtp(req, res) {
    try {
        const { identifier, code } = req.body;
        const tokens = await authService.verifyOtp(identifier, code);
        res.json(tokens);
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export async function getMe(req, res) {
    //   const uid = (req as any).user?.id as string | undefined;
    //   if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    //   const user = await usersService.getCurrent(uid);
    //   if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: req.user });
}
export async function restorePassword(req, res) {
    try {
        const { identifier, code, password } = req.body;
        const out = await authService.restorePassword(identifier, code, password);
        res.json(out);
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export default { register, login, refresh, logout, requestOtp, verifyOtp, getMe, restorePassword };
//# sourceMappingURL=auth.controller.js.map
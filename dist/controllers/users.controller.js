import usersService from '../services/users.service.js';
export async function getMe(req, res) {
    const uid = req.user?.id;
    if (!uid)
        return res.status(401).json({ error: 'Unauthorized' });
    const user = await usersService.getCurrent(uid);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    res.json({ user });
}
export async function updateMe(req, res) {
    const uid = req.user?.id;
    if (!uid)
        return res.status(401).json({ error: 'Unauthorized' });
    const payload = req.body;
    try {
        const user = await usersService.updateById(uid, payload);
        res.json({ user });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export async function getById(req, res) {
    const id = req.params.id;
    const user = await usersService.getById(id);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    res.json({ user });
}
export async function getClientInformation(req, res) {
    const uid = req.user?.id;
    if (!uid)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const client = await usersService.getClientInfoByUserId(uid);
        if (!client)
            return res.status(404).json({ error: 'Client profile not found' });
        res.json({ client });
    }
    catch (err) {
        res.status(500).json({ error: String(err.message ?? err) });
    }
}
export async function postClientInformation(req, res) {
    const uid = req.user?.id;
    if (!uid)
        return res.status(401).json({ error: 'Unauthorized' });
    const payload = req.body;
    try {
        const updated = await usersService.upsertClientInfo(uid, payload);
        res.json({ client: updated });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export async function getLawyerInformation(req, res) {
    const uid = req.user?.id;
    if (!uid)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const lawyer = await usersService.getLawyerInfoByUserId(uid);
        if (!lawyer)
            return res.status(404).json({ error: 'Lawyer profile not found' });
        res.json({ lawyer });
    }
    catch (err) {
        res.status(500).json({ error: String(err.message ?? err) });
    }
}
export async function postLawyerInformation(req, res) {
    const uid = req.user?.id;
    if (!uid)
        return res.status(401).json({ error: 'Unauthorized' });
    const payload = req.body;
    try {
        const updated = await usersService.upsertLawyerInfo(uid, payload);
        res.json({ lawyer: updated });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export default { getMe, updateMe, getById, getClientInformation, postClientInformation, getLawyerInformation, postLawyerInformation };
//# sourceMappingURL=users.controller.js.map
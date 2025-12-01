import { Request, Response } from 'express';
import usersService from '../services/users.service.js';

export async function getMe(req: Request, res: Response) {
	const uid = (req as any).user?.id as string | undefined;
	if (!uid) return res.status(401).json({ error: 'Unauthorized' });
	const user = await usersService.getCurrent(uid);
	if (!user) return res.status(404).json({ error: 'User not found' });
	res.json({ user });
}

export async function updateMe(req: Request, res: Response) {
	const uid = (req as any).user?.id as string | undefined;
	if (!uid) return res.status(401).json({ error: 'Unauthorized' });
	const payload = req.body;
	try {
		const user = await usersService.updateById(uid, payload);
		res.json({ user });
	} catch (err: any) {
		res.status(400).json({ error: String(err.message ?? err) });
	}
}

export async function getById(req: Request, res: Response) {
	const id = req.params.id;
	const user = await usersService.getById(id);
	if (!user) return res.status(404).json({ error: 'User not found' });
	res.json({ user });
}

export async function getClientInformation(req: Request, res: Response) {
	const uid = (req as any).user?.id as string | undefined;
 	if (!uid) return res.status(401).json({ error: 'Unauthorized' });
 	try {
 		const client = await usersService.getClientInfoByUserId(uid as string);
 		if (!client) return res.status(404).json({ error: 'Client profile not found' });
 		res.json({ client });
 	} catch (err: any) {
 		res.status(500).json({ error: String(err.message ?? err) });
 	}
}

export async function postClientInformation(req: Request, res: Response) {
	const uid = (req as any).user?.id as string | undefined;
 	if (!uid) return res.status(401).json({ error: 'Unauthorized' });
 	const payload = req.body;
 	try {
 		const updated = await usersService.upsertClientInfo(uid as string, payload);
 		res.json({ client: updated });
 	} catch (err: any) {
 		res.status(400).json({ error: String(err.message ?? err) });
 	}
}

export async function getLawyerInformation(req: Request, res: Response) {
	const uid = (req as any).user?.id as string | undefined;
 	if (!uid) return res.status(401).json({ error: 'Unauthorized' });
 	try {
 		const lawyer = await usersService.getLawyerInfoByUserId(uid as string);
 		if (!lawyer) return res.status(404).json({ error: 'Lawyer profile not found' });
 		res.json({ lawyer });
 	} catch (err: any) {
 		res.status(500).json({ error: String(err.message ?? err) });
 	}
}

export async function postLawyerInformation(req: Request, res: Response) {
	const uid = (req as any).user?.id as string | undefined;
 	if (!uid) return res.status(401).json({ error: 'Unauthorized' });
 	const payload = req.body;
 	try {
 		const updated = await usersService.upsertLawyerInfo(uid as string, payload);
 		res.json({ lawyer: updated });
 	} catch (err: any) {
 		res.status(400).json({ error: String(err.message ?? err) });
 	}
}

export default { getMe, updateMe, getById, getClientInformation, postClientInformation, getLawyerInformation, postLawyerInformation };

import caseService from '../services/case.service.js';
import storageService from '../services/storage.service.js';
import { ApiError } from '../middleware/error.middleware.js';
export async function createCase(req, res) {
    try {
        const clientId = req.user?.id;
        if (!clientId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { title, description, category } = req.body;
        const c = await caseService.createCase({ clientId, title, description, category });
        res.status(201).json({ case: c });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export async function listCases(req, res) {
    try {
        const uid = req.user?.id;
        const role = req.user?.role;
        if (!uid)
            return res.status(401).json({ error: 'Unauthorized' });
        const items = await caseService.listForUser(uid, role);
        res.json({ items });
    }
    catch (err) {
        res.status(500).json({ error: String(err.message ?? err) });
    }
}
export async function getCase(req, res) {
    try {
        const id = req.params.id;
        const c = await caseService.getById(id);
        if (!c)
            return res.status(404).json({ error: 'Case not found' });
        res.json({ case: c });
    }
    catch (err) {
        res.status(500).json({ error: String(err.message ?? err) });
    }
}
export async function updateCase(req, res) {
    try {
        const id = req.params.id;
        const user = req.user;
        const existing = await caseService.getById(id);
        if (!existing)
            return res.status(404).json({ error: 'Case not found' });
        // Access control: allow if admin, lawyer assigned, or client owner
        if (user.role !== 'ADMIN' && user.role !== 'LAWYER' && existing.clientId !== user.id) {
            throw new ApiError(403, 'Forbidden');
        }
        const updated = await caseService.updateCase(id, req.body);
        res.json({ case: updated });
    }
    catch (err) {
        if (err instanceof ApiError)
            return res.status(err.statusCode).json({ error: err.message });
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export async function addDocument(req, res) {
    try {
        const caseId = req.params.id;
        const uploaderId = req.user?.id;
        if (!uploaderId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { fileurl, fileName, mimeType, size } = req.body;
        // create document record pointing to the s3 url (assuming public PUT will succeed)
        const doc = await caseService.addDocument(caseId, uploaderId, { fileurl, fileName, mimeType, size });
        res.status(201).json({ document: doc });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export async function listDocuments(req, res) {
    try {
        const caseId = req.params.id;
        const docs = await caseService.listDocuments(caseId);
        res.json({ documents: docs });
    }
    catch (err) {
        res.status(500).json({ error: String(err.message ?? err) });
    }
}
export async function addTimeline(req, res) {
    try {
        const caseId = req.params.id;
        const { title, description, eventDate, type } = req.body;
        const ev = await caseService.addTimelineEvent(caseId, { title, description, eventDate: new Date(eventDate), type });
        res.status(201).json({ event: ev });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export async function addHearing(req, res) {
    try {
        const caseId = req.params.id;
        const { date, court, judge, purpose, notes } = req.body;
        const hearing = await caseService.addHearing(caseId, { date: new Date(date), court, judge, purpose, notes });
        res.status(201).json({ hearing });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
// zod schema for this controller is not defined in src/schemas/case.schema.ts please define it there 
export async function generatePresignedUpload(req, res) {
    try {
        const uploaderId = req.user?.id;
        if (!uploaderId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { fileName, mimeType, size } = req.params; // changed from req.body to req.params for testing
        // generate presigned URL for upload
        const key = `documents/${uploaderId}-${Date.now()}-${fileName}`;
        const presigned = await storageService.createPresignedUpload(key, mimeType);
        if (!presigned)
            return res.status(501).json({ error: 'Storage not configured' });
        res.status(201).json({ upload: presigned });
    }
    catch (err) {
        res.status(400).json({ error: String(err.message ?? err) });
    }
}
export default { createCase, listCases, getCase, updateCase, addDocument, listDocuments, addTimeline, addHearing, generatePresignedUpload };
//# sourceMappingURL=cases.controller.js.map
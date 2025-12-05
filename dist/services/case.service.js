import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function createCase(data) {
    return prisma.case.create({ data: { clientId: data.clientId, title: data.title, description: data.description ?? '', category: data.category ?? '', courtName: data.courtName ?? '' } });
}
export async function listForUser(userId, role) {
    if (role === 'LAWYER') {
        return prisma.case.findMany({ where: { lawyerId: userId }, include: { documents: true, timeline: true, hearings: true } });
    }
    // default: client
    return prisma.case.findMany({ where: { clientId: userId }, include: { documents: true, timeline: true, hearings: true } });
}
export async function getById(id) {
    return prisma.case.findUnique({ where: { id }, include: { documents: true, timeline: true, hearings: true, chat: true } });
}
export async function updateCase(id, data) {
    return prisma.case.update({ where: { id }, data });
}
export async function addDocument(caseId, uploaderId, doc) {
    //   const url = configUrlForKey(doc.key);
    return prisma.document.create({ data: { caseId, uploaderId, filename: doc.fileName, url: doc.fileurl, mimeType: doc.mimeType, size: doc.size ?? 0 } });
}
// this is a helper fn move it to utils/helper.ts later
// function configUrlForKey(key: string) {
//   // If S3 configured, derive URL; otherwise return key as path
//   // This is a simple helper; in production you may want to store CDN URL or S3 domain in config
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const cfg = require('../config/index.js').config;
//   if (cfg.aws?.s3?.bucket && cfg.aws?.s3?.region) {
//     return `https://${cfg.aws.s3.bucket}.s3.${cfg.aws.s3.region}.amazonaws.com/${key}`;
//   }
//   return key;
// }
export async function listDocuments(caseId) {
    return prisma.document.findMany({ where: { caseId } });
}
export async function addTimelineEvent(caseId, data) {
    return prisma.caseTimeline.create({ data: { caseId, title: data.title, description: data.description, eventDate: data.eventDate, type: data.type ?? 'event' } });
}
export async function addHearing(caseId, data) {
    return prisma.hearing.create({ data: { caseId, date: data.date, court: data.court ?? null, judge: data.judge ?? null, purpose: data.purpose ?? '', notes: data.notes ?? null } });
}
export default { createCase, listForUser, getById, updateCase, addDocument, listDocuments, addTimelineEvent, addHearing };
//# sourceMappingURL=case.service.js.map
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function getById(id) {
    return prisma.user.findUnique({ where: { id } });
}
export async function updateById(id, data) {
    return prisma.user.update({ where: { id }, data });
}
export async function getCurrent(userId) {
    return getById(userId);
}
// ----- Client & Lawyer profile helpers -----
export async function getClientInfoByUserId(userId) {
    // Prisma model is `Client` mapped to prisma.client
    return prisma.client.findUnique({ where: { userId } });
}
export async function upsertClientInfo(userId, payload) {
    // Use upsert so create or update is handled in one call
    return prisma.client.upsert({
        where: { userId },
        create: { userId, ...payload },
        update: payload,
    });
}
export async function getLawyerInfoByUserId(userId) {
    // Prisma model is `Lawyer` mapped to prisma.lawyer
    return prisma.lawyer.findUnique({ where: { userId } });
}
export async function upsertLawyerInfo(userId, payload) {
    return prisma.lawyer.upsert({
        where: { userId },
        create: { userId, ...payload },
        update: payload,
    });
}
// extend default export
export default { getById, updateById, getCurrent, getClientInfoByUserId, upsertClientInfo, getLawyerInfoByUserId, upsertLawyerInfo };
//# sourceMappingURL=users.service.js.map
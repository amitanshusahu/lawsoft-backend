import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SearchParams = {
  q?: string;
  specialization?: string;
  city?: string;
  minExperience?: number;
  maxFee?: number;
  languages?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

export async function search(params: SearchParams) {
  const {
    q,
    specialization,
    city,
    minExperience,
    maxFee,
    languages,
    page = 1,
    limit = 20,
    sortBy,
    order = 'desc',
  } = params;

  const where: any = {};
  const and: any[] = [];

  if (q) {
    and.push({
      OR: [
        { user: { name: { contains: q, mode: 'insensitive' } } },
        { specializations: { has: q } },
        { bio: { contains: q, mode: 'insensitive' } },
      ],
    });
  }

  if (specialization) {
    and.push({ specializations: { has: specialization } });
  }

  if (city) {
    and.push({ city: { contains: city, mode: 'insensitive' } });
  }

  if (typeof minExperience === 'number') {
    and.push({ experienceYears: { gte: minExperience } });
  }

  if (typeof maxFee === 'number') {
    and.push({ feePerConsultation: { lte: maxFee } });
  }

  if (languages && languages.length) {
    and.push({ languages: { hasSome: languages } });
  }

  if (and.length) where.AND = and;

  const orderBy: any = [];
  if (sortBy === 'rating') orderBy.push({ rating: order });
  else if (sortBy === 'experience') orderBy.push({ experienceYears: order });
  else if (sortBy === 'fee') orderBy.push({ feePerConsultation: order });
  else if (sortBy === 'createdAt') orderBy.push({ createdAt: order });
  else orderBy.push({ rating: 'desc' });

  const skip = Math.max(0, (page - 1) * limit);

  const [items, total] = await Promise.all([
    prisma.lawyer.findMany({ where, include: { user: true }, skip, take: limit, orderBy }),
    prisma.lawyer.count({ where }),
  ]);

  return { items, total, page, limit };
}

export async function getById(id: string) {
  return prisma.lawyer.findUnique({ where: { id }, include: { user: true } });
}

export async function updateById(id: string, data: any) {
  return prisma.lawyer.update({ where: { id }, data });
}

export default { search, getById, updateById };

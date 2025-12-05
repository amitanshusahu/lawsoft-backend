import { z } from 'zod';
export const lawyerSearchSchema = z.object({
    query: z.object({
        q: z.string().optional(),
        specialization: z.string().optional(),
        city: z.string().optional(),
        minExperience: z.coerce.number().optional(),
        maxFee: z.coerce.number().optional(),
        languages: z.string().optional(), // comma-separated
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(20),
        sortBy: z.enum(['rating', 'experience', 'fee', 'createdAt']).optional(),
        order: z.enum(['asc', 'desc']).default('desc'),
    }),
});
export const updateLawyerSchema = z.object({
    body: z.object({
        licenseNumber: z.string().optional(),
        barCouncilId: z.string().optional(),
        specializations: z.array(z.string()).optional(),
        experienceYears: z.coerce.number().optional(),
        languages: z.array(z.string()).optional(),
        feePerConsultation: z.coerce.number().optional(),
        bio: z.string().optional(),
        isAvailable: z.boolean().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        address: z.string().optional(),
    }),
});
export const lawyerProfileSchema = z.object({
    body: z.object({
        // If the user is already registered, frontend may pass userId to attach profile
        userId: z.string().optional(),
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        licenseNumber: z.string().optional(),
        fileName: z.string().optional(),
        fileType: z.string().optional(),
    }),
});
export default { lawyerSearchSchema, updateLawyerSchema, lawyerProfileSchema };
//# sourceMappingURL=lawyer.schema.js.map
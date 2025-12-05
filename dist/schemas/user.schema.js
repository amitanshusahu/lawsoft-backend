import { z } from 'zod';
export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        phone: z.string().min(7).optional(),
        avatarUrl: z.string().url().optional(),
    }),
});
export const clientInfoSchema = z.object({
    body: z.object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        pincode: z.string().optional(),
        dob: z.string().optional(), // ISO date
        gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
        income: z.number().nonnegative().optional(),
        incomeProofUrl: z.string().url().optional(),
        caste: z.enum(['GENERAL', 'OBC', 'SC', 'ST', 'EWS', 'OTHER']).optional(),
        casteProofUrl: z.string().url().optional(),
    }),
});
export const lawyerInfoSchema = z.object({
    body: z.object({
        barCouncilId: z.string().optional(),
        licenseNumber: z.string().optional(),
        barCouncil: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional(),
        country: z.string().optional(),
        specializations: z.array(z.string()).optional(),
        experienceYears: z.number().int().nonnegative().optional(),
        exprience: z.string().optional(),
        education: z.string().optional(),
        languages: z.array(z.string()).optional(),
        feePerConsultation: z.number().nonnegative().optional(),
        bio: z.string().max(2000).optional(),
        licenseProofUrl: z.string().url().optional(),
        barCouncilProofUrl: z.string().url().optional(),
    }),
});
export default { updateUserSchema, clientInfoSchema, lawyerInfoSchema };
//# sourceMappingURL=user.schema.js.map
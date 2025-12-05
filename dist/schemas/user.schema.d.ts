import { z } from 'zod';
export declare const updateUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        avatarUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const clientInfoSchema: z.ZodObject<{
    body: z.ZodObject<{
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        pincode: z.ZodOptional<z.ZodString>;
        dob: z.ZodOptional<z.ZodString>;
        gender: z.ZodOptional<z.ZodEnum<{
            MALE: "MALE";
            FEMALE: "FEMALE";
            OTHER: "OTHER";
            PREFER_NOT_TO_SAY: "PREFER_NOT_TO_SAY";
        }>>;
        income: z.ZodOptional<z.ZodNumber>;
        incomeProofUrl: z.ZodOptional<z.ZodString>;
        caste: z.ZodOptional<z.ZodEnum<{
            OTHER: "OTHER";
            GENERAL: "GENERAL";
            OBC: "OBC";
            SC: "SC";
            ST: "ST";
            EWS: "EWS";
        }>>;
        casteProofUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const lawyerInfoSchema: z.ZodObject<{
    body: z.ZodObject<{
        barCouncilId: z.ZodOptional<z.ZodString>;
        licenseNumber: z.ZodOptional<z.ZodString>;
        barCouncil: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        pincode: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        specializations: z.ZodOptional<z.ZodArray<z.ZodString>>;
        experienceYears: z.ZodOptional<z.ZodNumber>;
        exprience: z.ZodOptional<z.ZodString>;
        education: z.ZodOptional<z.ZodString>;
        languages: z.ZodOptional<z.ZodArray<z.ZodString>>;
        feePerConsultation: z.ZodOptional<z.ZodNumber>;
        bio: z.ZodOptional<z.ZodString>;
        licenseProofUrl: z.ZodOptional<z.ZodString>;
        barCouncilProofUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const _default: {
    updateUserSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            avatarUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    clientInfoSchema: z.ZodObject<{
        body: z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            state: z.ZodOptional<z.ZodString>;
            country: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            dob: z.ZodOptional<z.ZodString>;
            gender: z.ZodOptional<z.ZodEnum<{
                MALE: "MALE";
                FEMALE: "FEMALE";
                OTHER: "OTHER";
                PREFER_NOT_TO_SAY: "PREFER_NOT_TO_SAY";
            }>>;
            income: z.ZodOptional<z.ZodNumber>;
            incomeProofUrl: z.ZodOptional<z.ZodString>;
            caste: z.ZodOptional<z.ZodEnum<{
                OTHER: "OTHER";
                GENERAL: "GENERAL";
                OBC: "OBC";
                SC: "SC";
                ST: "ST";
                EWS: "EWS";
            }>>;
            casteProofUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    lawyerInfoSchema: z.ZodObject<{
        body: z.ZodObject<{
            barCouncilId: z.ZodOptional<z.ZodString>;
            licenseNumber: z.ZodOptional<z.ZodString>;
            barCouncil: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            state: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            country: z.ZodOptional<z.ZodString>;
            specializations: z.ZodOptional<z.ZodArray<z.ZodString>>;
            experienceYears: z.ZodOptional<z.ZodNumber>;
            exprience: z.ZodOptional<z.ZodString>;
            education: z.ZodOptional<z.ZodString>;
            languages: z.ZodOptional<z.ZodArray<z.ZodString>>;
            feePerConsultation: z.ZodOptional<z.ZodNumber>;
            bio: z.ZodOptional<z.ZodString>;
            licenseProofUrl: z.ZodOptional<z.ZodString>;
            barCouncilProofUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export default _default;
//# sourceMappingURL=user.schema.d.ts.map
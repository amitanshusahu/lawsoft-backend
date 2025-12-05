import { z } from 'zod';
export declare const lawyerSearchSchema: z.ZodObject<{
    query: z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
        specialization: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        minExperience: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        maxFee: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        languages: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        sortBy: z.ZodOptional<z.ZodEnum<{
            createdAt: "createdAt";
            experience: "experience";
            rating: "rating";
            fee: "fee";
        }>>;
        order: z.ZodDefault<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateLawyerSchema: z.ZodObject<{
    body: z.ZodObject<{
        licenseNumber: z.ZodOptional<z.ZodString>;
        barCouncilId: z.ZodOptional<z.ZodString>;
        specializations: z.ZodOptional<z.ZodArray<z.ZodString>>;
        experienceYears: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        languages: z.ZodOptional<z.ZodArray<z.ZodString>>;
        feePerConsultation: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        bio: z.ZodOptional<z.ZodString>;
        isAvailable: z.ZodOptional<z.ZodBoolean>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const lawyerProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        userId: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        licenseNumber: z.ZodOptional<z.ZodString>;
        fileName: z.ZodOptional<z.ZodString>;
        fileType: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const _default: {
    lawyerSearchSchema: z.ZodObject<{
        query: z.ZodObject<{
            q: z.ZodOptional<z.ZodString>;
            specialization: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            minExperience: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
            maxFee: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
            languages: z.ZodOptional<z.ZodString>;
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodEnum<{
                createdAt: "createdAt";
                experience: "experience";
                rating: "rating";
                fee: "fee";
            }>>;
            order: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateLawyerSchema: z.ZodObject<{
        body: z.ZodObject<{
            licenseNumber: z.ZodOptional<z.ZodString>;
            barCouncilId: z.ZodOptional<z.ZodString>;
            specializations: z.ZodOptional<z.ZodArray<z.ZodString>>;
            experienceYears: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
            languages: z.ZodOptional<z.ZodArray<z.ZodString>>;
            feePerConsultation: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
            bio: z.ZodOptional<z.ZodString>;
            isAvailable: z.ZodOptional<z.ZodBoolean>;
            city: z.ZodOptional<z.ZodString>;
            state: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    lawyerProfileSchema: z.ZodObject<{
        body: z.ZodObject<{
            userId: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            licenseNumber: z.ZodOptional<z.ZodString>;
            fileName: z.ZodOptional<z.ZodString>;
            fileType: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export default _default;
//# sourceMappingURL=lawyer.schema.d.ts.map
import { z } from 'zod';
export declare const bookAppointmentSchema: z.ZodObject<{
    body: z.ZodObject<{
        lawyerId: z.ZodString;
        scheduledAt: z.ZodString;
        durationMins: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const cancelAppointmentSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const availabilitySchema: z.ZodObject<{
    body: z.ZodObject<{
        lawyerId: z.ZodString;
        date: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            durationMins: z.ZodOptional<z.ZodNumber>;
            intervalMins: z.ZodOptional<z.ZodNumber>;
            workHours: z.ZodOptional<z.ZodObject<{
                start: z.ZodString;
                end: z.ZodString;
            }, z.core.$strip>>;
            excludePastSlots: z.ZodOptional<z.ZodBoolean>;
            bufferMins: z.ZodOptional<z.ZodNumber>;
            lunchBreak: z.ZodOptional<z.ZodObject<{
                start: z.ZodString;
                end: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const confirmPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        appointmentId: z.ZodString;
        razorpay_payment_id: z.ZodString;
        razorpay_order_id: z.ZodString;
        razorpay_signature: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const _default: {
    bookAppointmentSchema: z.ZodObject<{
        body: z.ZodObject<{
            lawyerId: z.ZodString;
            scheduledAt: z.ZodString;
            durationMins: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    cancelAppointmentSchema: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    availabilitySchema: z.ZodObject<{
        body: z.ZodObject<{
            lawyerId: z.ZodString;
            date: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                durationMins: z.ZodOptional<z.ZodNumber>;
                intervalMins: z.ZodOptional<z.ZodNumber>;
                workHours: z.ZodOptional<z.ZodObject<{
                    start: z.ZodString;
                    end: z.ZodString;
                }, z.core.$strip>>;
                excludePastSlots: z.ZodOptional<z.ZodBoolean>;
                bufferMins: z.ZodOptional<z.ZodNumber>;
                lunchBreak: z.ZodOptional<z.ZodObject<{
                    start: z.ZodString;
                    end: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    confirmPaymentSchema: z.ZodObject<{
        body: z.ZodObject<{
            appointmentId: z.ZodString;
            razorpay_payment_id: z.ZodString;
            razorpay_order_id: z.ZodString;
            razorpay_signature: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export default _default;
//# sourceMappingURL=appointment.schema.d.ts.map
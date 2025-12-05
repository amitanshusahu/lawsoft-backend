export declare function isAvailable(lawyerId: string, scheduledAt: Date, durationMins?: number): Promise<boolean>;
export declare function getAvailableSlots(lawyerId: string, targetDate: Date | string, // Accept Date or ISO string like "2025-04-05"
options?: {
    durationMins?: number;
    intervalMins?: number;
    workHours?: {
        start: string;
        end: string;
    };
    excludePastSlots?: boolean;
    bufferMins?: number;
    lunchBreak?: {
        start: string;
        end: string;
    };
}): Promise<Date[]>;
export declare function bookAppointment(data: {
    clientId: string;
    lawyerId: string;
    scheduledAt: Date;
    durationMins?: number;
    notes?: string;
}): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.AppointmentStatus;
    clientId: string;
    lawyerId: string;
    scheduledAt: Date;
    durationMins: number;
    meetingLink: string | null;
    notes: string | null;
    paymentId: string | null;
}>;
export declare function cancelAppointment(id: string, byUserId?: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.AppointmentStatus;
    clientId: string;
    lawyerId: string;
    scheduledAt: Date;
    durationMins: number;
    meetingLink: string | null;
    notes: string | null;
    paymentId: string | null;
}>;
export declare function markAppointmentAttended(id: string, byUserId?: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.AppointmentStatus;
    clientId: string;
    lawyerId: string;
    scheduledAt: Date;
    durationMins: number;
    meetingLink: string | null;
    notes: string | null;
    paymentId: string | null;
}>;
export declare function listForUser(userId: string, role: string): Promise<({
    client: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string;
        role: import("@prisma/client").$Enums.UserRole;
        passwordHash: string | null;
        avatarUrl: string | null;
        isVerified: boolean;
        emailVerified: boolean;
        phoneVerified: boolean;
        fcmToken: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.AppointmentStatus;
    clientId: string;
    lawyerId: string;
    scheduledAt: Date;
    durationMins: number;
    meetingLink: string | null;
    notes: string | null;
    paymentId: string | null;
})[] | ({
    lawyer: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string;
        role: import("@prisma/client").$Enums.UserRole;
        passwordHash: string | null;
        avatarUrl: string | null;
        isVerified: boolean;
        emailVerified: boolean;
        phoneVerified: boolean;
        fcmToken: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.AppointmentStatus;
    clientId: string;
    lawyerId: string;
    scheduledAt: Date;
    durationMins: number;
    meetingLink: string | null;
    notes: string | null;
    paymentId: string | null;
})[]>;
declare const _default: {
    isAvailable: typeof isAvailable;
    getAvailableSlots: typeof getAvailableSlots;
    bookAppointment: typeof bookAppointment;
    cancelAppointment: typeof cancelAppointment;
    markAppointmentAttended: typeof markAppointmentAttended;
    listForUser: typeof listForUser;
};
export default _default;
//# sourceMappingURL=appointment.service.d.ts.map
type CreateOrderOpts = {
    userId: string;
    appointmentId?: string;
    amount: number;
    currency?: string;
    provider?: 'razorpay' | 'stripe';
};
/**
 * createOrder - create a Payment record and, for Razorpay, also create a provider order
 */
export declare function createOrder(opts: CreateOrderOpts): Promise<{
    payment: {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        userId: string;
        appointmentId: string | null;
        amount: number;
        currency: string;
        provider: string;
        providerOrderId: string | null;
        providerPaymentId: string | null;
        signature: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    };
    order: any;
} | {
    payment: {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        userId: string;
        appointmentId: string | null;
        amount: number;
        currency: string;
        provider: string;
        providerOrderId: string | null;
        providerPaymentId: string | null;
        signature: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    };
    order?: undefined;
}>;
export declare function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean;
export declare function verifyWebhook(bodyString: string, signatureHeader: string): Promise<boolean>;
export declare function markPaymentPaid(paymentId: string, providerPaymentId?: string): Promise<{
    id: string;
    createdAt: Date;
    status: import("@prisma/client").$Enums.PaymentStatus;
    userId: string;
    appointmentId: string | null;
    amount: number;
    currency: string;
    provider: string;
    providerOrderId: string | null;
    providerPaymentId: string | null;
    signature: string | null;
    metadata: import("@prisma/client/runtime/library").JsonValue | null;
}>;
declare const _default: {
    createOrder: typeof createOrder;
    verifyPaymentSignature: typeof verifyPaymentSignature;
    verifyWebhook: typeof verifyWebhook;
    markPaymentPaid: typeof markPaymentPaid;
};
export default _default;
//# sourceMappingURL=payment.service.d.ts.map
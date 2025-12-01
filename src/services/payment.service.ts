import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import config from '../config/index.js';

const prisma = new PrismaClient();

const razorClient = new Razorpay({ key_id: config.payments?.razorpay?.keyId, key_secret: config.payments?.razorpay?.keySecret });
console.warn('Razorpay client initialized:', razorClient !== null);

type CreateOrderOpts = { userId: string; appointmentId?: string; amount: number; currency?: string; provider?: 'razorpay' | 'stripe' };

/**
 * createOrder - create a Payment record and, for Razorpay, also create a provider order
 */
export async function createOrder(opts: CreateOrderOpts) {
  const { userId, appointmentId, amount, currency = 'INR', provider = 'razorpay' } = opts;

  const payment = await prisma.payment.create({
    data: {
      userId,
      appointmentId,
      amount,
      currency,
      provider,
      status: 'PENDING',
    },
  });

  if ( razorClient) {
    // Razorpay expects amount in paise (we already store paise). Create an order with receipt = payment.id
    const order: any = await razorClient.orders.create({
      amount: payment.amount,
      currency: payment.currency,
      receipt: payment.id,
      payment_capture: true,
      notes: { appointmentId: appointmentId ?? '' },
    });

    // persist provider order info in metadata. providerOrderId column may not be available in generated client yet,
    // so write metadata and leave providerOrderId update for a follow-up prisma migration/generation step.
    await prisma.payment.update({ where: { id: payment.id }, data: { metadata: { ...((payment.metadata as any) || {}), providerOrderId: order.id, providerOrder: order } as any } as any });
    return { payment, order };
  }

  // fallback: return local record
  return { payment };
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const secret = config.payments?.razorpay?.keySecret || '';
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  return expected === signature;
}

export async function verifyWebhook(bodyString: string, signatureHeader: string) {
  const secret = config.payments?.razorpay?.keySecret;
  if (!secret) throw new Error('Webhook secret not configured');
  const expected = crypto.createHmac('sha256', secret).update(bodyString).digest('hex');
  return expected === signatureHeader;
}

export async function markPaymentPaid(paymentId: string, providerPaymentId?: string) {
  const p = await prisma.payment.update({ where: { id: paymentId }, data: { status: 'COMPLETED', providerPaymentId } });
  if (p.appointmentId) {
    await prisma.appointment.update({ where: { id: p.appointmentId }, data: { status: 'CONFIRMED', paymentId: p.id } });
  }
  return p;
}

export default { createOrder, verifyPaymentSignature, verifyWebhook, markPaymentPaid };

import appointmentService from '../services/appointment.service.js';
import paymentService from '../services/payment.service.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function extractError(err) {
    if (!err)
        return 'Unknown error';
    if (typeof err === 'string')
        return err;
    if (err instanceof Error && err.message)
        return err.message;
    // prisma errors sometimes have meta or message fields
    if (err.message)
        return err.message;
    if (err.meta && typeof err.meta === 'object') {
        try {
            return JSON.stringify(err.meta);
        }
        catch (e) { }
    }
    try {
        return JSON.stringify(err);
    }
    catch (e) {
        return String(err);
    }
}
export async function book(req, res) {
    try {
        const clientId = req.user?.id;
        const { lawyerId, scheduledAt, durationMins, notes } = req.body;
        if (!clientId)
            return res.status(401).json({ error: 'Unauthorized' });
        const appt = await appointmentService.bookAppointment({ clientId, lawyerId, scheduledAt: new Date(scheduledAt), durationMins, notes });
        // Determine amount from lawyer fee (stored in paise). Fallback to 1.
        const lawyer = await prisma.lawyer.findUnique({ where: { id: lawyerId } });
        const amount = lawyer?.feePerConsultation ?? 1000;
        console.warn("Booking appointment for amount:", amount);
        // Create provider order (Razorpay) and local payment record
        const pay = await paymentService.createOrder({ userId: clientId, appointmentId: appt.id, amount, provider: 'razorpay' });
        res.status(201).json({ appointment: appt, payment: pay });
    }
    catch (err) {
        const msg = extractError(err);
        res.status(400).json({ error: msg });
    }
}
export async function availability(req, res) {
    try {
        const { lawyerId, date, options } = req.body;
        const slots = await appointmentService.getAvailableSlots(lawyerId, new Date(date));
        res.json({ slots });
    }
    catch (err) {
        const msg = extractError(err);
        res.status(400).json({ error: msg });
    }
}
export async function cancel(req, res) {
    try {
        const id = req.params.id;
        const updated = await appointmentService.cancelAppointment(id, req.user?.id);
        res.json({ appointment: updated });
    }
    catch (err) {
        const msg = extractError(err);
        res.status(400).json({ error: msg });
    }
}
export async function attend(req, res) {
    try {
        const id = req.params.id;
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const updated = await appointmentService.markAppointmentAttended(id, userId);
        res.json({ appointment: updated });
    }
    catch (err) {
        const msg = extractError(err);
        res.status(400).json({ error: msg });
    }
}
export async function list(req, res) {
    try {
        const uid = req.user?.id;
        const role = req.user?.role;
        if (!uid)
            return res.status(401).json({ error: 'Unauthorized' });
        const items = await appointmentService.listForUser(uid, role);
        res.json({ items });
    }
    catch (err) {
        const msg = extractError(err);
        res.status(500).json({ error: msg });
    }
}
export async function confirmPayment(req, res) {
    try {
        const { appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        // verify signature
        const ok = paymentService.verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!ok)
            return res.status(400).json({ error: 'Invalid signature' });
        // mark payment and appointment
        // providerPaymentId passed as razorpay_payment_id; find payment by appointmentId
        // For simplicity, find payment record by appointmentId
        const prismaMod = await import('@prisma/client');
        const prisma = new prismaMod.PrismaClient();
        const p = await prisma.payment.findFirst({ where: { appointmentId } });
        if (!p)
            return res.status(404).json({ error: 'Payment record not found' });
        await paymentService.markPaymentPaid(p.id, razorpay_payment_id);
        res.json({ success: true });
    }
    catch (err) {
        const msg = extractError(err);
        res.status(400).json({ error: msg });
    }
}
// Public webhook endpoint for provider notifications
export async function webhook(req, res) {
    try {
        const bodyString = JSON.stringify(req.body);
        const sig = req.headers['x-razorpay-signature'] || '';
        const valid = await paymentService.verifyWebhook(bodyString, sig);
        if (!valid)
            return res.status(400).json({ error: 'Invalid webhook signature' });
        // Inspect payload and update DB accordingly. Razorpay payloads vary; assume payment entity contained
        const payload = req.body;
        const event = payload.event || payload.event_type || '';
        if (event.includes('payment')) {
            // extract payment and order ids
            const rp = payload.payload?.payment?.entity || payload.payload?.payment?.entity || payload;
            const providerPaymentId = rp?.id;
            const providerOrderId = rp?.order_id;
            // find payment by providerOrderId or by appointment mapping
            const prismaMod = await import('@prisma/client');
            const prisma = new prismaMod.PrismaClient();
            const payment = await prisma.payment.findFirst({ where: { providerPaymentId } });
            if (payment) {
                await prisma.payment.update({ where: { id: payment.id }, data: { status: 'COMPLETED' } });
                if (payment.appointmentId)
                    await prisma.appointment.update({ where: { id: payment.appointmentId }, data: { status: 'CONFIRMED' } });
            }
        }
        res.json({ ok: true });
    }
    catch (err) {
        const msg = extractError(err);
        res.status(400).json({ error: msg });
    }
}
export default { book, cancel, list, confirmPayment, webhook };
//# sourceMappingURL=appointments.controller.js.map
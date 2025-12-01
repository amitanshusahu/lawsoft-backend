import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Resolve an identifier that could be either a user id (users.id) or a lawyer profile id (lawyers.id)
 * to the canonical user id that is stored on appointments.lawyerId (which references users.id).
 */
async function resolveLawyerUserId(idOrProfileId: string) {
  // If a user exists with this id, assume it's already the correct user id
  const user = await prisma.user.findUnique({ where: { id: idOrProfileId } })
  if (user) return user.id

  // Otherwise, try to find a Lawyer profile with that id and return its userId
  const lawyerProfile = await prisma.lawyer.findUnique({ where: { id: idOrProfileId } })
  if (lawyerProfile) return lawyerProfile.userId

  // Not found
  return null
}

export async function isAvailable(lawyerId: string, scheduledAt: Date, durationMins = 30) {
  // Resolve profile id -> user id if needed
  const resolvedLawyerId = await resolveLawyerUserId(lawyerId) || lawyerId
  // Basic availability: ensure no appointment exists for the same lawyer at the same scheduledAt
  const existing = await prisma.appointment.findFirst({ where: { lawyerId: resolvedLawyerId, scheduledAt } });
  return !existing;
}
export async function getAvailableSlots(
  lawyerId: string,
  targetDate: Date | string, // Accept Date or ISO string like "2025-04-05"
  options: {
    durationMins?: number;           // e.g., 30, 60
    intervalMins?: number;           // slot step: 15, 30, etc.
    workHours?: { start: string; end: string }; // "09:00" – "18:00"
    excludePastSlots?: boolean;      // don't return slots already passed today
    bufferMins?: number;             // break between appointments
    lunchBreak?: { start: string; end: string }; // e.g., "13:00" – "14:00"
  } = {}
): Promise<Date[]> {
  const {
    durationMins = 30,
    intervalMins = 30,
    workHours = { start: '06:00', end: '19:00' },
    excludePastSlots = true,
    bufferMins = 0,
    lunchBreak,
  } = options;

  // Normalize target date to start of day in local time
  const date = new Date(targetDate);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  // Fetch all appointments for this lawyer on the target day
  const resolvedLawyerId = await resolveLawyerUserId(lawyerId) || lawyerId
  const appointments = await prisma.appointment.findMany({
    where: {
      lawyerId: resolvedLawyerId,
      scheduledAt: {
        gte: dayStart,
        lt: dayEnd,
      },
      status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] },
    },
    orderBy: { scheduledAt: 'asc' },
  });

  const availableSlots: Date[] = [];
  const now = new Date();

  // Parse working hours
  const [startH, startM] = workHours.start.split(':').map(Number);
  const [endH, endM] = workHours.end.split(':').map(Number);

  let currentTime = new Date(dayStart);
  currentTime.setHours(startH, startM, 0, 0);

  const workDayEnd = new Date(dayStart);
  workDayEnd.setHours(endH, endM, 0, 0);

  // Helper: check overlap
  const hasConflict = (slotStart: Date, slotEnd: Date) => {
    return appointments.some((apt) => {
      const aptEnd = new Date(apt.scheduledAt);
      aptEnd.setMinutes(aptEnd.getMinutes() + (apt.durationMins || durationMins) + bufferMins);

      return slotStart < aptEnd && apt.scheduledAt < slotEnd;
    });
  };

  // Helper: check if time is in lunch break
  const isInLunchBreak = (time: Date) => {
    if (!lunchBreak) return false;
    const [lStartH, lStartM] = lunchBreak.start.split(':').map(Number);
    const [lEndH, lEndM] = lunchBreak.end.split(':').map(Number);

    const lunchStart = new Date(dayStart);
    lunchStart.setHours(lStartH, lStartM, 0, 0);
    const lunchEnd = new Date(dayStart);
    lunchEnd.setHours(lEndH, lEndM, 0, 0);

    return time >= lunchStart && time < lunchEnd;
  };

  // Generate slots
  while (currentTime < workDayEnd) {
    const slotEnd = new Date(currentTime);
    slotEnd.setMinutes(slotEnd.getMinutes() + durationMins);

    // Skip if slot goes beyond working hours
    if (slotEnd > workDayEnd) break;

    // Skip lunch break
    if (isInLunchBreak(currentTime)) {
      currentTime.setMinutes(currentTime.getMinutes() + intervalMins);
      continue;
    }

    // Skip if already passed (and option enabled)
    if (excludePastSlots && slotEnd <= now) {
      currentTime.setMinutes(currentTime.getMinutes() + intervalMins);
      continue;
    }

    // Check conflict
    if (!hasConflict(currentTime, slotEnd)) {
      availableSlots.push(new Date(currentTime)); // clone
    }

    // Move to next slot
    currentTime.setMinutes(currentTime.getMinutes() + intervalMins);
  }

  return availableSlots;
}

export async function bookAppointment(data: { clientId: string; lawyerId: string; scheduledAt: Date; durationMins?: number; notes?: string }) {
  // Resolve lawyer identifier (accept either user id or lawyer profile id)
  const resolvedLawyerId = await resolveLawyerUserId(data.lawyerId)
  if (!resolvedLawyerId) throw new Error('Invalid lawyer id')

  const available = await isAvailable(resolvedLawyerId, data.scheduledAt, data.durationMins ?? 30);
  if (!available) throw new Error('Slot not available');

  const appt = await prisma.appointment.create({
    data: {
      clientId: data.clientId,
      lawyerId: resolvedLawyerId,
      scheduledAt: data.scheduledAt,
      durationMins: data.durationMins ?? 30,
      notes: data.notes,
      status: 'PENDING',
    },
  });
  console.warn('Book apppointment fcn:', appt);
  return appt;
}

export async function cancelAppointment(id: string, byUserId?: string) {
  // In a real app, check permissions (owner or lawyer/admin)
  return prisma.appointment.update({ where: { id }, data: { status: 'CANCELLED' } });
}

export async function markAppointmentAttended(id: string, byUserId?: string) {
  // Note: In production you may enforce permissions: only the lawyer or client or admin may mark attended.
  // Here we perform a simple existence check and update status to COMPLETED.
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) throw new Error('Appointment not found');

  const updated = await prisma.appointment.update({ where: { id }, data: { status: 'COMPLETED' } });
  return updated;
}

export async function listForUser(userId: string, role: string) {
  if (role === 'LAWYER') {
    return prisma.appointment.findMany({ where: { lawyerId: userId }, include: { client: true } });
  }
  return prisma.appointment.findMany({ where: { clientId: userId }, include: { lawyer: true } });
}

export default { isAvailable, getAvailableSlots, bookAppointment, cancelAppointment, markAppointmentAttended, listForUser };

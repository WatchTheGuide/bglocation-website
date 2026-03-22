import { prisma } from '@/lib/db';

const PENDING_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const UNSUBSCRIBED_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function cleanupStaleSubscribers(): Promise<void> {
  const now = new Date();

  await prisma.subscriber.deleteMany({
    where: {
      OR: [
        {
          status: 'pending',
          createdAt: { lt: new Date(now.getTime() - PENDING_MAX_AGE_MS) },
        },
        {
          status: 'unsubscribed',
          unsubscribedAt: { lt: new Date(now.getTime() - UNSUBSCRIBED_MAX_AGE_MS) },
        },
      ],
    },
  });
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid subscriber ID' }, { status: 400 });
  }

  const subscriber = await prisma.subscriber.findUnique({
    where: { id },
  });

  if (!subscriber) {
    return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
  }

  // Hard delete — GDPR Art. 17
  await prisma.subscriber.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Subscriber deleted' });
}

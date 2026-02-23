import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const logs = await prisma.puasaLog.findMany({
      where: { userId },
      orderBy: { day: 'asc' },
    });

    // Convert to boolean array [day1, day2, ..., day30]
    const puasaData = Array(30).fill(false);
    logs.forEach((log) => {
      if (log.day >= 1 && log.day <= 30) {
        puasaData[log.day - 1] = log.fasted;
      }
    });

    return NextResponse.json({ puasaData });
  } catch (error) {
    console.error('GET puasa error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { day, fasted } = await request.json();

    if (day < 1 || day > 30) {
      return NextResponse.json({ error: 'Invalid day' }, { status: 400 });
    }

    await prisma.puasaLog.upsert({
      where: {
        userId_day: { userId, day },
      },
      update: { fasted },
      create: { userId, day, fasted },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT puasa error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

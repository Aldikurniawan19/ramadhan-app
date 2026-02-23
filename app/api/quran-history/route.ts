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

    const history = await prisma.quranHistory.findUnique({
      where: { userId },
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error('GET quran-history error:', error);
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
    const { surahNomor, surahNama, ayatNomor } = await request.json();

    if (!surahNomor || !surahNama || !ayatNomor) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const history = await prisma.quranHistory.upsert({
      where: { userId },
      update: { surahNomor, surahNama, ayatNomor },
      create: { userId, surahNomor, surahNama, ayatNomor },
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error('PUT quran-history error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

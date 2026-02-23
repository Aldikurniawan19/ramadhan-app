import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { city } = await request.json();

    if (!city || typeof city !== 'string') {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { city },
      select: { city: true },
    });

    return NextResponse.json({ city: user.city });
  } catch (error) {
    console.error('PUT user/city error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

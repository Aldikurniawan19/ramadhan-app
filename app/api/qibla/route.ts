import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get user city from session/db (same pattern as prayer-times)
    let city = 'Jakarta';
    let country = 'Indonesia';

    const session = await getServerSession(authOptions);
    if (session?.user) {
      const userId = (session.user as any).id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { city: true },
      });
      if (user?.city) {
        const parts = user.city.split(',').map((s: string) => s.trim());
        city = parts[0] || 'Jakarta';
        country = parts[1] || 'Indonesia';
      }
    }

    // Step 1: Get coordinates for the city using Aladhan timingsByCity
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const dateStr = `${dd}-${mm}-${yyyy}`;

    const timingsUrl = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=20`;
    const timingsRes = await fetch(timingsUrl, { next: { revalidate: 86400 } });
    const timingsData = await timingsRes.json();

    if (timingsData.code !== 200 || !timingsData.data?.meta) {
      throw new Error('Failed to get city coordinates');
    }

    const latitude = timingsData.data.meta.latitude;
    const longitude = timingsData.data.meta.longitude;

    // Step 2: Fetch Qibla direction from Aladhan
    const qiblaUrl = `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`;
    const qiblaRes = await fetch(qiblaUrl, { next: { revalidate: 86400 } });
    const qiblaData = await qiblaRes.json();

    if (qiblaData.code !== 200 || !qiblaData.data) {
      throw new Error('Failed to get Qibla direction');
    }

    return NextResponse.json({
      direction: qiblaData.data.direction, // degrees from North (clockwise)
      city: `${city}, ${country}`,
      latitude,
      longitude,
    });
  } catch (error) {
    console.error('Qibla API error:', error);
    // Fallback: Qibla direction from Jakarta
    return NextResponse.json({
      direction: 295.14,
      city: 'Jakarta, Indonesia',
      latitude: -6.2088,
      longitude: 106.8456,
      fallback: true,
    });
  }
}

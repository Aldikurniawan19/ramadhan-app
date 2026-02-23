import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get user city from session/db
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

    // Build today's date in DD-MM-YYYY format
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const dateStr = `${dd}-${mm}-${yyyy}`;

    // Fetch from Aladhan API (method 20 = Kemenag RI)
    const url = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=20`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache for 1 hour
    const data = await res.json();

    if (data.code !== 200 || !data.data?.timings) {
      throw new Error('Invalid API response');
    }

    const t = data.data.timings;

    const prayerTimes = [
      { id: 'imsak', name: 'Imsak', time: t.Imsak?.substring(0, 5), icon: 'fa-cloud-moon' },
      { id: 'subuh', name: 'Subuh', time: t.Fajr?.substring(0, 5), icon: 'fa-moon' },
      { id: 'dzuhur', name: 'Dzuhur', time: t.Dhuhr?.substring(0, 5), icon: 'fa-sun' },
      { id: 'ashar', name: 'Ashar', time: t.Asr?.substring(0, 5), icon: 'fa-cloud-sun' },
      { id: 'maghrib', name: 'Maghrib', time: t.Maghrib?.substring(0, 5), icon: 'fa-sunset' },
      { id: 'isya', name: 'Isya', time: t.Isha?.substring(0, 5), icon: 'fa-star-and-crescent' },
    ];

    return NextResponse.json({
      prayerTimes,
      city: `${city}, ${country}`,
      date: data.data.date?.readable || dateStr,
    });
  } catch (error) {
    console.error('Prayer times API error:', error);
    // Return fallback hardcoded times on error
    return NextResponse.json({
      prayerTimes: [
        { id: 'imsak', name: 'Imsak', time: '04:28', icon: 'fa-cloud-moon' },
        { id: 'subuh', name: 'Subuh', time: '04:38', icon: 'fa-moon' },
        { id: 'dzuhur', name: 'Dzuhur', time: '11:57', icon: 'fa-sun' },
        { id: 'ashar', name: 'Ashar', time: '15:13', icon: 'fa-cloud-sun' },
        { id: 'maghrib', name: 'Maghrib', time: '18:02', icon: 'fa-sunset' },
        { id: 'isya', name: 'Isya', time: '19:12', icon: 'fa-star-and-crescent' },
      ],
      city: 'Jakarta, Indonesia',
      date: new Date().toLocaleDateString('en-GB'),
      fallback: true,
    });
  }
}

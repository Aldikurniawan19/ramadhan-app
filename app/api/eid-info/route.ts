import { NextResponse } from 'next/server';

interface AladhanHToGResponse {
  code: number;
  data?: {
    gregorian?: {
      date: string; // "DD-MM-YYYY"
      day: string;
      month: { number: number; en: string };
      year: string;
    };
    hijri?: {
      date: string;
      day: string;
      month: { number: number; en: string };
      year: string;
    };
  };
}

// Convert "DD-MM-YYYY" to Date object at UTC+7 midnight (or local start of day)
function parseAladhanDate(dateStr: string): Date {
  const [dd, mm, yyyy] = dateStr.split('-').map(Number);
  const formatted = `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}T00:00:00+07:00`;
  return new Date(formatted);
}

export async function GET() {
  try {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const dateStr = `${dd}-${mm}-${yyyy}`;

    // 1. Get current Hijri year and month from Aladhan API
    const gToHRes = await fetch(
      `https://api.aladhan.com/v1/gToH/${dateStr}`,
      { next: { revalidate: 3600 } } // cache 1 hour
    );
    const gToHData = await gToHRes.json();

    if (gToHData.code !== 200 || !gToHData.data?.hijri) {
      throw new Error('Failed to fetch Hijri date from Aladhan API');
    }

    const currentHijriYear = parseInt(gToHData.data.hijri.year, 10);

    // 2. Define target Eids to check dynamically across current and next Hijri years
    const eidsToCheck = [
      {
        hijriStr: `01-10-${currentHijriYear}`,
        type: 'Idul Fitri' as const,
        hijriYear: String(currentHijriYear),
        name: `Hari Raya Idul Fitri ${currentHijriYear} H`,
        emoji: '🕌',
        icon: 'fa-mosque',
      },
      {
        hijriStr: `10-12-${currentHijriYear}`,
        type: 'Idul Adha' as const,
        hijriYear: String(currentHijriYear),
        name: `Hari Raya Idul Adha ${currentHijriYear} H`,
        emoji: '🐑',
        icon: 'fa-kaaba',
      },
      {
        hijriStr: `01-10-${currentHijriYear + 1}`,
        type: 'Idul Fitri' as const,
        hijriYear: String(currentHijriYear + 1),
        name: `Hari Raya Idul Fitri ${currentHijriYear + 1} H`,
        emoji: '🕌',
        icon: 'fa-mosque',
      },
      {
        hijriStr: `10-12-${currentHijriYear + 1}`,
        type: 'Idul Adha' as const,
        hijriYear: String(currentHijriYear + 1),
        name: `Hari Raya Idul Adha ${currentHijriYear + 1} H`,
        emoji: '🐑',
        icon: 'fa-kaaba',
      },
    ];

    // 3. Fetch Gregorian dates for all candidate Eids via Aladhan hToG API
    const eidPromises = eidsToCheck.map(async (eid) => {
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/hToG/${eid.hijriStr}`,
          { next: { revalidate: 86400 } } // cache 24h
        );
        const data: AladhanHToGResponse = await res.json();
        if (data.code === 200 && data.data?.gregorian) {
          const greg = data.data.gregorian;
          const dateObj = parseAladhanDate(greg.date);
          return {
            ...eid,
            gregorianDateStr: greg.date,
            targetTimestamp: dateObj.getTime(),
          };
        }
      } catch (err) {
        console.error(`Error fetching hToG for ${eid.hijriStr}:`, err);
      }
      return null;
    });

    const fetchedEids = (await Promise.all(eidPromises)).filter(Boolean);

    // 4. Find the next upcoming Eid relative to right now
    const nowMs = now.getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;

    let targetEid = fetchedEids.find((e) => e && (e.targetTimestamp + oneDayMs > nowMs));

    if (!targetEid && fetchedEids.length > 0) {
      targetEid = fetchedEids[fetchedEids.length - 1];
    }

    if (!targetEid) {
      throw new Error('No Eid dates returned from API');
    }

    const diff = targetEid.targetTimestamp - nowMs;
    const isToday = diff <= 0 && diff > -oneDayMs;

    return NextResponse.json({
      success: true,
      eid: {
        name: targetEid.name,
        type: targetEid.type,
        hijriYear: targetEid.hijriYear,
        gregorianDate: targetEid.gregorianDateStr,
        targetTimestamp: targetEid.targetTimestamp,
        isToday,
        icon: targetEid.icon,
        emoji: targetEid.emoji,
      },
    });
  } catch (error) {
    console.error('Eid info API error:', error);

    // Fallback calculation using current year estimation
    const now = new Date();
    const yr = now.getFullYear();
    const targetDate = new Date(`${yr}-03-20T00:00:00+07:00`);
    const diff = targetDate.getTime() - now.getTime();

    return NextResponse.json({
      success: false,
      fallback: true,
      eid: {
        name: 'Hari Raya Idul Fitri 1447 H',
        type: 'Idul Fitri',
        hijriYear: '1447',
        gregorianDate: '20-03-2026',
        targetTimestamp: targetDate.getTime(),
        isToday: diff <= 0 && diff > -86400000,
        icon: 'fa-mosque',
        emoji: '🕌',
      },
    });
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get today's date in DD-MM-YYYY format
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const dateStr = `${dd}-${mm}-${yyyy}`;

    // Convert today's Gregorian date → Hijri
    const res = await fetch(
      `https://api.aladhan.com/v1/gToH/${dateStr}`,
      { next: { revalidate: 3600 } } // cache 1 hour
    );
    const data = await res.json();

    if (data.code !== 200 || !data.data?.hijri) {
      throw new Error('Invalid Hijri conversion response');
    }

    const hijri = data.data.hijri;
    const hijriMonth = hijri.month.number;  // 9 = Ramadan
    const hijriDay = parseInt(hijri.day, 10);
    const hijriYear = hijri.year;
    const hijriMonthName = hijri.month.en;

    // Check if we're currently in Ramadan
    const isRamadan = hijriMonth === 9;

    // Get Ramadan 1st day to determine the day-of-week it started
    let ramadanStartDayOfWeek = 3; // fallback Wednesday
    let ramadanStartGregorian = '';
    let ramadanDays = 30; // default

    if (isRamadan) {
      // Fetch Hijri-to-Gregorian for 1st of current Ramadan
      const hToGRes = await fetch(
        `https://api.aladhan.com/v1/hToG/01-09-${hijriYear}`,
        { next: { revalidate: 86400 } } // cache 24h
      );
      const hToGData = await hToGRes.json();

      if (hToGData.code === 200 && hToGData.data?.gregorian) {
        const greg = hToGData.data.gregorian;
        // Map weekday name to index (0=Sunday, 1=Monday, ... 6=Saturday)
        const dayNameMap: Record<string, number> = {
          'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
          'Thursday': 4, 'Friday': 5, 'Saturday': 6,
        };
        ramadanStartDayOfWeek = dayNameMap[greg.weekday.en] ?? 3;
        ramadanStartGregorian = `${greg.day}-${greg.month.en}-${greg.year}`;
      }

      // Get total days in Ramadan from the Hijri data
      if (hijri.month.days) {
        ramadanDays = hijri.month.days;
      }
    }

    return NextResponse.json({
      isRamadan,
      hijriDate: hijri.date,
      hijriDay: isRamadan ? hijriDay : 0,
      hijriYear,
      hijriMonthName,
      ramadanStartDayOfWeek,     // 0=Sun, 1=Mon, ... 6=Sat
      ramadanStartGregorian,
      ramadanDays,
    });
  } catch (error) {
    console.error('Ramadan info API error:', error);
    // Fallback values
    return NextResponse.json({
      isRamadan: true,
      hijriDay: 1,
      hijriYear: '1447',
      hijriMonthName: 'Ramaḍān',
      ramadanStartDayOfWeek: 3, // Wednesday
      ramadanStartGregorian: '18-February-2026',
      ramadanDays: 30,
      fallback: true,
    });
  }
}

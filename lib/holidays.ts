// Indonesian National & Religious Holidays
// Dates that shift yearly (Islamic/Lunar) are specified per-year

export interface Holiday {
  date: string; // "YYYY-MM-DD"
  name: string;
  type: 'Islam' | 'Kristen' | 'Hindu' | 'Buddha' | 'Tionghoa' | 'Nasional';
  emoji: string;
}

// Fixed holidays (same date every year)
const FIXED_HOLIDAYS: Omit<Holiday, 'date'>[] = [
  { name: 'Tahun Baru Masehi', type: 'Nasional', emoji: '🎉' },
  { name: 'Hari Buruh Internasional', type: 'Nasional', emoji: '⚙️' },
  { name: 'Hari Lahir Pancasila', type: 'Nasional', emoji: '🇮🇩' },
  { name: 'Hari Kemerdekaan RI', type: 'Nasional', emoji: '🇮🇩' },
  { name: 'Hari Natal', type: 'Kristen', emoji: '🎄' },
];

const FIXED_DATES: Record<string, number> = {
  'Tahun Baru Masehi': 101,       // 1 Jan
  'Hari Buruh Internasional': 501, // 1 Mei
  'Hari Lahir Pancasila': 601,     // 1 Jun
  'Hari Kemerdekaan RI': 817,      // 17 Agt
  'Hari Natal': 1225,              // 25 Des
};

// Variable holidays per year (Islamic, Lunar, etc.)
const VARIABLE_HOLIDAYS: Record<number, Holiday[]> = {
  2025: [
    { date: '2025-01-27', name: 'Isra Mi\'raj Nabi Muhammad', type: 'Islam', emoji: '🌙' },
    { date: '2025-01-29', name: 'Tahun Baru Imlek', type: 'Tionghoa', emoji: '🏮' },
    { date: '2025-03-29', name: 'Hari Raya Nyepi', type: 'Hindu', emoji: '🙏' },
    { date: '2025-03-30', name: 'Hari Raya Idul Fitri 1446 H (Hari 1)', type: 'Islam', emoji: '🕌' },
    { date: '2025-03-31', name: 'Hari Raya Idul Fitri 1446 H (Hari 2)', type: 'Islam', emoji: '🕌' },
    { date: '2025-04-18', name: 'Wafat Isa Almasih', type: 'Kristen', emoji: '✝️' },
    { date: '2025-05-12', name: 'Hari Raya Waisak', type: 'Buddha', emoji: '🪷' },
    { date: '2025-05-29', name: 'Kenaikan Isa Almasih', type: 'Kristen', emoji: '✝️' },
    { date: '2025-06-06', name: 'Hari Raya Idul Adha 1446 H', type: 'Islam', emoji: '🐑' },
    { date: '2025-06-27', name: 'Tahun Baru Islam 1447 H', type: 'Islam', emoji: '🌙' },
    { date: '2025-09-05', name: 'Maulid Nabi Muhammad SAW', type: 'Islam', emoji: '🌙' },
  ],
  2026: [
    { date: '2026-01-16', name: 'Isra Mi\'raj Nabi Muhammad', type: 'Islam', emoji: '🌙' },
    { date: '2026-02-17', name: 'Tahun Baru Imlek', type: 'Tionghoa', emoji: '🏮' },
    { date: '2026-03-19', name: 'Hari Raya Nyepi', type: 'Hindu', emoji: '🙏' },
    { date: '2026-03-20', name: 'Hari Raya Idul Fitri 1447 H (Hari 1)', type: 'Islam', emoji: '🕌' },
    { date: '2026-03-21', name: 'Hari Raya Idul Fitri 1447 H (Hari 2)', type: 'Islam', emoji: '🕌' },
    { date: '2026-04-03', name: 'Wafat Isa Almasih', type: 'Kristen', emoji: '✝️' },
    { date: '2026-05-14', name: 'Kenaikan Isa Almasih', type: 'Kristen', emoji: '✝️' },
    { date: '2026-05-31', name: 'Hari Raya Waisak', type: 'Buddha', emoji: '🪷' },
    { date: '2026-05-27', name: 'Hari Raya Idul Adha 1447 H', type: 'Islam', emoji: '🐑' },
    { date: '2026-06-17', name: 'Tahun Baru Islam 1448 H', type: 'Islam', emoji: '🌙' },
    { date: '2026-08-26', name: 'Maulid Nabi Muhammad SAW', type: 'Islam', emoji: '🌙' },
  ],
  2027: [
    { date: '2027-01-05', name: 'Isra Mi\'raj Nabi Muhammad', type: 'Islam', emoji: '🌙' },
    { date: '2027-02-06', name: 'Tahun Baru Imlek', type: 'Tionghoa', emoji: '🏮' },
    { date: '2027-03-09', name: 'Hari Raya Idul Fitri 1448 H (Hari 1)', type: 'Islam', emoji: '🕌' },
    { date: '2027-03-10', name: 'Hari Raya Idul Fitri 1448 H (Hari 2)', type: 'Islam', emoji: '🕌' },
    { date: '2027-03-19', name: 'Wafat Isa Almasih', type: 'Kristen', emoji: '✝️' },
    { date: '2027-03-28', name: 'Hari Raya Nyepi', type: 'Hindu', emoji: '🙏' },
    { date: '2027-05-06', name: 'Kenaikan Isa Almasih', type: 'Kristen', emoji: '✝️' },
    { date: '2027-05-16', name: 'Hari Raya Idul Adha 1448 H', type: 'Islam', emoji: '🐑' },
    { date: '2027-05-20', name: 'Hari Raya Waisak', type: 'Buddha', emoji: '🪷' },
    { date: '2027-06-06', name: 'Tahun Baru Islam 1449 H', type: 'Islam', emoji: '🌙' },
    { date: '2027-08-16', name: 'Maulid Nabi Muhammad SAW', type: 'Islam', emoji: '🌙' },
  ],
};

/**
 * Build fixed holidays for a given year.
 */
function getFixedHolidaysForYear(year: number): Holiday[] {
  return FIXED_HOLIDAYS.map((h) => {
    const code = FIXED_DATES[h.name];
    const month = Math.floor(code / 100);
    const day = code % 100;
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return { ...h, date: `${year}-${mm}-${dd}` };
  });
}

/**
 * Get all holidays for a specific month/year.
 */
export function getHolidaysForMonth(year: number, month: number): Holiday[] {
  const mm = String(month + 1).padStart(2, '0'); // month is 0-indexed
  const prefix = `${year}-${mm}`;

  const fixed = getFixedHolidaysForYear(year).filter((h) => h.date.startsWith(prefix));
  const variable = (VARIABLE_HOLIDAYS[year] || []).filter((h) => h.date.startsWith(prefix));

  return [...fixed, ...variable].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get holidays map for a month: date-string -> Holiday[]
 */
export function getHolidayMap(year: number, month: number): Record<string, Holiday[]> {
  const holidays = getHolidaysForMonth(year, month);
  const map: Record<string, Holiday[]> = {};
  for (const h of holidays) {
    if (!map[h.date]) map[h.date] = [];
    map[h.date].push(h);
  }
  return map;
}

/**
 * Color for holiday type
 */
export function getHolidayColor(type: Holiday['type']): string {
  switch (type) {
    case 'Islam': return '#00FFD4';
    case 'Kristen': return '#FFD700';
    case 'Hindu': return '#FF8C00';
    case 'Buddha': return '#DA70D6';
    case 'Tionghoa': return '#FF4444';
    case 'Nasional': return '#5465FF';
    default: return '#D2DDFF';
  }
}

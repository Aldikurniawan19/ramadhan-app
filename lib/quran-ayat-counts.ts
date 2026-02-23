/**
 * Number of ayat per surah (index 0 = surah 1, etc.)
 * Total: 6,236 ayat across 114 surahs
 */
export const AYAT_PER_SURAH: number[] = [
  7,   286, 200, 176, 120, 165, 206, 75,  129, 109, // 1-10
  123, 111, 43,  52,  99,  128, 111, 110, 98,  135, // 11-20
  112, 78,  118, 64,  77,  227, 93,  88,  69,  60,  // 21-30
  34,  30,  73,  54,  45,  83,  182, 88,  75,  85,  // 31-40
  54,  53,  89,  59,  37,  35,  38,  29,  18,  45,  // 41-50
  60,  49,  62,  55,  78,  96,  29,  22,  24,  13,  // 51-60
  14,  11,  11,  18,  12,  12,  30,  52,  52,  44,  // 61-70
  28,  28,  20,  56,  40,  31,  50,  40,  46,  42,  // 71-80
  29,  19,  36,  25,  22,  17,  19,  26,  30,  20,  // 81-90
  15,  21,  11,  8,   8,   19,  5,   8,   8,   11,  // 91-100
  11,  8,   3,   9,   5,   4,   7,   3,   6,   3,   // 101-110
  5,   4,   5,   6,                                   // 111-114
];

export const TOTAL_AYAT = 6236;
export const TOTAL_SURAHS = 114;

/**
 * Calculate how many total ayat have been read up to the given surah + ayat.
 * Assumes all previous surahs were read completely.
 */
export function calculateAyatRead(surahNomor: number, ayatNomor: number): number {
  let total = 0;
  for (let i = 0; i < surahNomor - 1; i++) {
    total += AYAT_PER_SURAH[i];
  }
  total += ayatNomor;
  return total;
}

/**
 * Get progress percentage (0-100)
 */
export function calculateProgress(surahNomor: number, ayatNomor: number): number {
  const read = calculateAyatRead(surahNomor, ayatNomor);
  return Math.round((read / TOTAL_AYAT) * 100);
}

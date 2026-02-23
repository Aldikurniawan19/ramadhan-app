'use client';

import { usePuasa } from '../context/PuasaContext';

// Parse "dd-MonthName-yyyy" or "dd-MM-yyyy" into a JS Date (UTC midnight)
function parseRamadanStart(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Format: "1-March-2026" or "28-February-2026"
  const namedMonths: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };

  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;

  const d = parseInt(parts[0], 10);
  const m = namedMonths[parts[1]] ?? parseInt(parts[1], 10) - 1;
  const y = parseInt(parts[2], 10);

  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  return new Date(Date.UTC(y, m, d));
}

// Get short Gregorian month name in Indonesian
const ID_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
const ID_MONTHS_FULL = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function CalendarGrid() {
  const { puasaData, togglePuasa, currentHariRamadhan, ramadanInfo, ramadanLoading } = usePuasa();

  const emptyCellsStart = ramadanInfo.ramadanStartDayOfWeek; // 0=Sun ... 6=Sat
  const totalDays = ramadanInfo.ramadanDays;

  // Parse the Gregorian start date of Ramadan day 1
  const ramadanStartDate = parseRamadanStart(ramadanInfo.ramadanStartGregorian);

  // Build a Gregorian Date for a given Ramadan day index (0-based)
  function getGregorianDate(dayIndex: number): Date | null {
    if (!ramadanStartDate) return null;
    const d = new Date(ramadanStartDate);
    d.setUTCDate(d.getUTCDate() + dayIndex);
    return d;
  }

  // Figure out which Gregorian months span Ramadan for the header subtitle
  const startDate = ramadanStartDate;
  const endDate = ramadanStartDate ? new Date(Date.UTC(
    ramadanStartDate.getUTCFullYear(),
    ramadanStartDate.getUTCMonth(),
    ramadanStartDate.getUTCDate() + totalDays - 1
  )) : null;

  let gregorianRange = '';
  if (startDate && endDate) {
    const sM = startDate.getUTCMonth();
    const eM = endDate.getUTCMonth();
    const yr = endDate.getUTCFullYear();
    gregorianRange = sM === eM
      ? `${ID_MONTHS_FULL[sM]} ${yr}`
      : `${ID_MONTHS_FULL[sM]} – ${ID_MONTHS_FULL[eM]} ${yr}`;
  }

  return (
    <>
      {/* Calendar Card */}
      <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-4 md:p-8 mb-6">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm md:text-lg font-semibold text-white">
              {ramadanLoading ? (
                <span className="animate-pulse">Ramadhan ...</span>
              ) : (
                `Ramadhan ${ramadanInfo.hijriYear} H`
              )}
            </h3>
            {!ramadanLoading && gregorianRange && (
              <p className="text-xs md:text-sm text-r-light/50 mt-0.5">{gregorianRange}</p>
            )}
          </div>
          <span className="text-xs md:text-sm text-r-cyan bg-r-cyan/10 px-3 py-1.5 rounded-md border border-r-cyan/20 shrink-0">
            {ramadanLoading ? '...' : `Hari ke-${currentHariRamadhan}`}
          </span>
        </div>

        {/* Day-of-week Headers */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-3">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
            <div
              key={d}
              className={`text-[9px] md:text-xs font-semibold uppercase tracking-wide ${
                i === 0 ? 'text-red-400' : 'text-r-light/50'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {/* Empty cells before day 1 */}
          {Array(emptyCellsStart).fill(null).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day cells */}
          {Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;
            const isPuasa = puasaData[i];
            const isToday = day === currentHariRamadhan;
            const isFuture = day > currentHariRamadhan;

            const gregDate = getGregorianDate(i);
            const gregDay = gregDate ? gregDate.getUTCDate() : null;
            const gregMonth = gregDate ? ID_MONTHS[gregDate.getUTCMonth()] : null;

            // Cell base styles
            let cellClass =
              'relative flex flex-col items-center justify-center rounded-xl py-1.5 md:py-2 transition-all select-none ';

            if (isPuasa) {
              cellClass += 'bg-r-cyan/15 border border-r-cyan/40 shadow-[0_0_12px_rgba(0,255,212,0.08)]';
            } else if (isToday) {
              cellClass += 'bg-r-blue/20 border border-r-blue/60 ring-2 ring-r-blue/40';
            } else if (isFuture) {
              cellClass += 'bg-transparent border border-r-light/5';
            } else {
              cellClass += 'bg-red-500/8 border border-red-500/20';
            }

            // Hijri day number color
            let hijriColor = '';
            if (isPuasa) hijriColor = 'text-r-cyan';
            else if (isToday) hijriColor = 'text-white font-bold';
            else if (isFuture) hijriColor = 'text-r-light/25';
            else hijriColor = 'text-red-400';

            // Gregorian date color
            let gregColor = '';
            if (isPuasa) gregColor = 'text-r-cyan/60';
            else if (isToday) gregColor = 'text-white/60';
            else if (isFuture) gregColor = 'text-r-light/15';
            else gregColor = 'text-red-400/50';

            return (
              <button
                key={day}
                className={`${cellClass} ${!isFuture ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}`}
                onClick={() => !isFuture && togglePuasa(i)}
                disabled={isFuture}
                title={`Hari ke-${day}${gregDate ? ` • ${gregDay} ${gregMonth}` : ''}`}
              >
                {/* Hijri day — primary */}
                <span className={`text-xs md:text-sm font-semibold leading-tight ${hijriColor}`}>
                  {day}
                </span>

                {/* Gregorian date — secondary */}
                {gregDay !== null && (
                  <span className={`text-[8px] md:text-[10px] leading-tight ${gregColor}`}>
                    {gregDay} {gregMonth}
                  </span>
                )}

                {/* Puasa checkmark dot */}
                {isPuasa && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-r-cyan" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-5 pt-4 border-t border-r-light/10 text-[10px] md:text-xs text-r-light/50">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-r-cyan/15 border border-r-cyan/40 inline-block" />
            Puasa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-r-blue/20 border border-r-blue/60 inline-block" />
            Hari ini
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500/8 border border-red-500/20 inline-block" />
            Tidak puasa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border border-r-light/5 inline-block" />
            Belum tiba
          </span>
        </div>
      </div>

      {/* Today's Puasa Toggle */}
      <div className="bg-gradient-to-r from-[#2a2b3d] to-r-light/5 border border-r-light/10 rounded-2xl p-5 md:p-6 flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium text-sm md:text-lg mb-1">Puasa Hari Ini?</h3>
          <p className="text-xs md:text-sm text-r-light/60">Ketuk untuk menandai puasa</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={puasaData[currentHariRamadhan - 1]}
            onChange={() => togglePuasa(currentHariRamadhan - 1)}
          />
          <div className="w-11 h-6 md:w-14 md:h-7 bg-r-light/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] md:after:top-[2px] md:after:left-[4px] after:bg-r-light/50 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 md:after:h-6 md:after:w-6 after:transition-all peer-checked:bg-r-cyan"></div>
        </label>
      </div>
    </>
  );
}

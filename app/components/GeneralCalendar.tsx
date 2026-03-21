'use client';

import { useState, useMemo } from 'react';
import { getHolidayMap, getHolidaysForMonth, getHolidayColor, type Holiday } from '@/lib/holidays';

const ID_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

export default function GeneralCalendar() {
  const now = new Date();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDate = now.getDate();

  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday[] | null>(null);

  const isCurrentMonth = year === todayYear && month === todayMonth;

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const holidayMap = useMemo(() => getHolidayMap(year, month), [year, month]);
  const monthHolidays = useMemo(() => getHolidaysForMonth(year, month), [year, month]);

  function prevMonth() {
    setSelectedHoliday(null);
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    setSelectedHoliday(null);
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function goToday() {
    setSelectedHoliday(null);
    setYear(todayYear);
    setMonth(todayMonth);
  }

  function dateKey(day: number): string {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }

  return (
    <>
      {/* Calendar Card */}
      <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-4 md:p-8 mb-6">

        {/* Header — Month Navigator */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-r-light/5 border border-r-light/10 flex items-center justify-center text-r-light/60 hover:text-white hover:bg-r-light/10 transition-all active:scale-90"
            aria-label="Bulan sebelumnya"
          >
            <i className="fa-solid fa-chevron-left text-sm" />
          </button>

          <div className="text-center">
            <h3 className="text-base md:text-xl font-semibold text-white">
              {ID_MONTHS[month]} {year}
            </h3>
            {!isCurrentMonth && (
              <button
                onClick={goToday}
                className="text-[10px] md:text-xs text-r-cyan hover:underline mt-0.5 transition-colors"
              >
                Kembali ke hari ini
              </button>
            )}
          </div>

          <button
            onClick={nextMonth}
            className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-r-light/5 border border-r-light/10 flex items-center justify-center text-r-light/60 hover:text-white hover:bg-r-light/10 transition-all active:scale-90"
            aria-label="Bulan berikutnya"
          >
            <i className="fa-solid fa-chevron-right text-sm" />
          </button>
        </div>

        {/* Day-of-week Headers */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-3">
          {DAY_LABELS.map((d, i) => (
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
          {Array(firstDay)
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const key = dateKey(day);
            const holidays = holidayMap[key] || [];
            const hasHoliday = holidays.length > 0;
            const isToday = isCurrentMonth && day === todayDate;
            const dayOfWeek = (firstDay + i) % 7;
            const isSunday = dayOfWeek === 0;

            // Cell base styles
            let cellClass =
              'relative flex flex-col items-center justify-center rounded-xl py-2 md:py-2.5 transition-all select-none cursor-pointer ';

            if (isToday) {
              cellClass +=
                'bg-r-blue/20 border-2 border-r-blue/60 ring-2 ring-r-blue/30 shadow-[0_0_16px_rgba(84,101,255,0.15)]';
            } else if (hasHoliday) {
              cellClass +=
                'bg-r-cyan/5 border border-r-cyan/20 hover:bg-r-cyan/10';
            } else {
              cellClass +=
                'bg-transparent border border-r-light/5 hover:bg-r-light/5 hover:border-r-light/10';
            }

            // Text color
            let textColor = 'text-r-light/80';
            if (isToday) textColor = 'text-white font-bold';
            else if (isSunday || hasHoliday) textColor = 'text-red-400';

            return (
              <button
                key={day}
                className={`${cellClass} hover:scale-105 active:scale-95`}
                onClick={() => {
                  if (hasHoliday) setSelectedHoliday(holidays);
                  else setSelectedHoliday(null);
                }}
                title={
                  hasHoliday
                    ? holidays.map((h) => h.name).join(', ')
                    : `${day} ${ID_MONTHS[month]} ${year}`
                }
              >
                {/* Day number */}
                <span
                  className={`text-xs md:text-sm font-semibold leading-tight ${textColor}`}
                >
                  {day}
                </span>

                {/* Holiday dot(s) */}
                {hasHoliday && (
                  <div className="flex gap-0.5 mt-0.5">
                    {holidays.slice(0, 3).map((h, idx) => (
                      <span
                        key={idx}
                        className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                        style={{ backgroundColor: getHolidayColor(h.type) }}
                      />
                    ))}
                  </div>
                )}

                {/* Today indicator */}
                {isToday && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-r-blue animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-5 pt-4 border-t border-r-light/10 text-[10px] md:text-xs text-r-light/50">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-r-blue/20 border-2 border-r-blue/60 inline-block" />
            Hari ini
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#00FFD4' }} />
            Islam
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#5465FF' }} />
            Nasional
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#FFD700' }} />
            Kristen
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#FF8C00' }} />
            Hindu
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#DA70D6' }} />
            Buddha
          </span>
        </div>
      </div>

      {/* Selected Holiday Detail */}
      {selectedHoliday && selectedHoliday.length > 0 && (
        <div className="bg-gradient-to-r from-[#2a2b3d] to-r-light/5 border border-r-light/10 rounded-2xl p-5 md:p-6 mb-6 animate-fadeIn">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-white font-medium text-sm md:text-base">Detail Hari Besar</h4>
            <button
              onClick={() => setSelectedHoliday(null)}
              className="text-r-light/40 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          {selectedHoliday.map((h, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <span className="text-2xl">{h.emoji}</span>
              <div>
                <p className="text-white text-sm md:text-base font-medium">{h.name}</p>
                <p className="text-r-light/50 text-xs">
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5"
                    style={{ backgroundColor: getHolidayColor(h.type) }}
                  />
                  {h.type} • {h.date.split('-').reverse().join('/')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Month Holidays List */}
      {monthHolidays.length > 0 && (
        <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-5 md:p-6">
          <h4 className="text-white font-semibold text-sm md:text-base mb-4 flex items-center gap-2">
            <i className="fa-solid fa-calendar-check text-r-cyan" />
            Hari Besar Bulan {ID_MONTHS[month]}
          </h4>
          <div className="space-y-3">
            {monthHolidays.map((h, i) => {
              const dayNum = parseInt(h.date.split('-')[2], 10);
              const dayOfWeek = new Date(year, month, dayNum).getDay();
              const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dayOfWeek];

              return (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl bg-r-light/[0.03] border border-r-light/5 hover:border-r-light/10 transition-colors"
                >
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0"
                    style={{
                      backgroundColor: getHolidayColor(h.type) + '15',
                      color: getHolidayColor(h.type),
                    }}
                  >
                    {h.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs md:text-sm font-medium truncate">{h.name}</p>
                    <p className="text-r-light/40 text-[10px] md:text-xs">
                      {dayName}, {dayNum} {ID_MONTHS[month]} {year}
                    </p>
                  </div>
                  <span
                    className="text-[9px] md:text-[10px] px-2 py-1 rounded-md border shrink-0"
                    style={{
                      color: getHolidayColor(h.type),
                      borderColor: getHolidayColor(h.type) + '30',
                      backgroundColor: getHolidayColor(h.type) + '10',
                    }}
                  >
                    {h.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state for months with no holidays */}
      {monthHolidays.length === 0 && (
        <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-8 text-center">
          <i className="fa-regular fa-calendar text-3xl text-r-light/20 mb-3" />
          <p className="text-r-light/40 text-sm">Tidak ada hari besar di bulan ini</p>
        </div>
      )}
    </>
  );
}

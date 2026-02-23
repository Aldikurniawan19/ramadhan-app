'use client';

import { usePuasa } from '../context/PuasaContext';

export default function CalendarGrid() {
  const { puasaData, togglePuasa, currentHariRamadhan, ramadanInfo, ramadanLoading } = usePuasa();

  const emptyCellsStart = ramadanInfo.ramadanStartDayOfWeek; // 0=Sun ... 6=Sat
  const totalDays = ramadanInfo.ramadanDays;

  return (
    <>
      {/* Calendar Card */}
      <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-5 md:p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm md:text-lg font-semibold text-white">
            {ramadanLoading ? (
              <span className="animate-pulse">Ramadhan ...</span>
            ) : (
              `Ramadhan ${ramadanInfo.hijriYear} H`
            )}
          </h3>
          <span className="text-xs md:text-sm text-r-cyan bg-r-cyan/10 px-3 py-1.5 rounded-md border border-r-cyan/20">
            {ramadanLoading ? '...' : `Hari ke-${currentHariRamadhan}`}
          </span>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 md:gap-4 text-center mb-4">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
            <div
              key={d}
              className={`text-[10px] md:text-sm font-medium ${i === 0 ? 'text-red-400' : 'text-r-light/60'}`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 md:gap-4 text-center">
          {Array(emptyCellsStart).fill(null).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;
            const isPuasa = puasaData[i];
            const isToday = day === currentHariRamadhan;
            const isFuture = day > currentHariRamadhan;

            let btnClass =
              'w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs md:text-sm mx-auto transition-all ';

            if (isPuasa) {
              btnClass += 'bg-r-cyan/20 text-r-cyan border border-r-cyan/50 shadow-[0_0_10px_rgba(0,255,212,0.1)]';
            } else if (isToday) {
              btnClass += 'bg-r-light/10 text-white border border-white/40 ring-2 ring-r-blue/50';
            } else if (isFuture) {
              btnClass += 'bg-transparent text-r-light/30 border border-transparent';
            } else {
              btnClass += 'bg-red-500/10 text-red-400 border border-red-500/30';
            }

            return (
              <div key={day} className="flex items-center justify-center py-1 md:py-2">
                <button
                  className={`${btnClass} ${!isFuture ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                  onClick={() => !isFuture && togglePuasa(i)}
                  disabled={isFuture}
                  title={`Hari ke-${day}`}
                >
                  {day}
                </button>
              </div>
            );
          })}
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

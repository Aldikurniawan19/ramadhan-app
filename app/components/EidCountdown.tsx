'use client';

import { useState, useEffect } from 'react';
import { fetchNextEid, calculateEidTimeLeft, DynamicEid } from '@/lib/eid';

export default function EidCountdown() {
  const [mounted, setMounted] = useState(false);
  const [eidData, setEidData] = useState<DynamicEid | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    setMounted(true);

    const loadEid = async () => {
      try {
        const data = await fetchNextEid();
        setEidData(data);
      } catch (err) {
        console.error('Failed to load Eid info:', err);
      }
    };

    loadEid();
  }, []);

  useEffect(() => {
    if (!eidData) return;

    const updateTimer = () => {
      const { isToday: today, timeLeft: left } = calculateEidTimeLeft(eidData.targetTimestamp);
      setIsToday(today);
      setTimeLeft(left);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [eidData]);

  if (!mounted || !eidData) return null;

  return (
    <div className="relative bg-gradient-to-br from-[#1a233a] to-[#0f1524] rounded-2xl p-4 md:p-6 shadow-md border border-r-light/10 overflow-hidden mb-6">
      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-r-blue/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-r-cyan/10 rounded-full blur-lg"></div>

      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-white/90 text-xs md:text-sm font-medium mb-3 flex items-center gap-2">
          <i className={`fa-solid ${eidData.icon} text-r-cyan`}></i>
          {isToday ? `Selamat ${eidData.name}! ${eidData.emoji}` : `Menuju ${eidData.name}`}
        </h2>

        {isToday ? (
          <div className="my-2 py-3 px-6 bg-r-cyan/10 border border-r-cyan/30 rounded-xl text-center">
            <p className="text-r-cyan font-bold text-base md:text-xl">
              Taqabbalallahu Minna Wa Minkum ✨
            </p>
            <p className="text-xs md:text-sm text-r-light/70 mt-1">
              Selamat Merayakan {eidData.name} {eidData.emoji}
            </p>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-2 md:gap-4 w-full">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-black/30 rounded-xl flex items-center justify-center border border-white/5 backdrop-blur-sm shadow-inner">
                <span className="text-xl md:text-3xl font-bold text-white tracking-wider">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] text-r-light/60 mt-1.5 uppercase tracking-wider font-medium">Hari</span>
            </div>

            <span className="text-lg md:text-2xl text-r-cyan/50 font-light -mt-5">:</span>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-black/30 rounded-xl flex items-center justify-center border border-white/5 backdrop-blur-sm shadow-inner">
                <span className="text-xl md:text-3xl font-bold text-white tracking-wider">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] text-r-light/60 mt-1.5 uppercase tracking-wider font-medium">Jam</span>
            </div>

            <span className="text-lg md:text-2xl text-r-cyan/50 font-light -mt-5">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-black/30 rounded-xl flex items-center justify-center border border-white/5 backdrop-blur-sm shadow-inner">
                <span className="text-xl md:text-3xl font-bold text-white tracking-wider">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] text-r-light/60 mt-1.5 uppercase tracking-wider font-medium">Menit</span>
            </div>

            <span className="text-lg md:text-2xl text-r-cyan/50 font-light -mt-5">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-black/30 rounded-xl flex items-center justify-center border border-white/5 backdrop-blur-sm shadow-inner flex-col overflow-hidden relative">
                <span className="text-xl md:text-3xl font-bold text-r-cyan tracking-wider z-10">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] text-r-light/60 mt-1.5 uppercase tracking-wider font-medium">Detik</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { usePrayerTimes, PrayerTime } from '@/app/context/PrayerTimesContext';

function getNextPrayer(prayerData: PrayerTime[]) {
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const currentSecs = now.getSeconds();

  let nextIndex = 0;
  let nextMins = 24 * 60;

  for (let i = 0; i < prayerData.length; i++) {
    const [h, m] = prayerData[i].time.split(':').map(Number);
    const pMins = h * 60 + m;
    if (pMins > currentMins || (pMins === currentMins && currentSecs === 0)) {
      nextIndex = i;
      nextMins = pMins;
      break;
    }
  }

  if (nextMins === 24 * 60) {
    const [h, m] = prayerData[0].time.split(':').map(Number);
    nextMins = 24 * 60 + h * 60 + m;
    nextIndex = 0;
  }

  let diffMins = nextMins - currentMins - 1;
  let diffSecs = 60 - currentSecs;
  if (diffSecs === 60) { diffSecs = 0; diffMins += 1; }

  const hoursLeft = Math.floor(diffMins / 60);
  const minsLeft = diffMins % 60;
  const progress = Math.min(100, Math.max(0, ((180 - diffMins) / 180) * 100));

  return {
    nextIndex,
    countdown: `${String(hoursLeft).padStart(2, '0')}:${String(minsLeft).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`,
    prayerName: prayerData[nextIndex].name,
    prayerTime: prayerData[nextIndex].time,
    progress,
  };
}

export default function HeroCountdown() {
  const { prayerData, city, isLoading } = usePrayerTimes();
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState({
    nextIndex: 0,
    countdown: '--:--:--',
    prayerName: prayerData[0]?.name || 'Imsak',
    prayerTime: prayerData[0]?.time || '04:28',
    progress: 0,
  });

  useEffect(() => {
    setMounted(true);
    setState(getNextPrayer(prayerData));
    const interval = setInterval(() => setState(getNextPrayer(prayerData)), 1000);
    return () => clearInterval(interval);
  }, [prayerData]);

  return (
    <div className="relative bg-gradient-to-br from-r-blue to-[#2b358a] rounded-3xl p-6 md:p-10 shadow-[0_10px_30px_rgba(84,101,255,0.3)] overflow-hidden mb-8">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-r-cyan/20 rounded-full blur-xl"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {isLoading && (
          <div className="absolute top-0 right-0 flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 bg-r-cyan rounded-full animate-pulse"></div>
            <span className="text-[10px] text-white/60">Live</span>
          </div>
        )}
        <p className="text-white/80 text-sm md:text-base font-medium mb-1">
          Menuju {state.prayerName}
        </p>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-wider my-3 drop-shadow-md">
          {state.countdown}
        </h2>
        <div className="w-full max-w-lg bg-black/20 rounded-full h-1.5 md:h-2 mt-2 mb-4">
          <div
            className="bg-r-cyan h-1.5 md:h-2 rounded-full transition-[width] duration-1000 ease-linear"
            style={{ width: `${state.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between w-full max-w-lg text-xs md:text-sm text-white/90 font-medium">
          <span>{state.prayerTime} WIB</span>
          <span className="text-white/60 text-[11px]">
            <i className="fa-solid fa-location-dot mr-1"></i>{city}
          </span>
        </div>
      </div>
    </div>
  );
}

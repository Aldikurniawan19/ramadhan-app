'use client';

import { useState, useEffect } from 'react';
import { usePrayerTimes } from '@/app/context/PrayerTimesContext';
import { usePuasa } from '@/app/context/PuasaContext';

function getNextPrayerIndex(prayerData: { time: string }[]): number {
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < prayerData.length; i++) {
    const [h, m] = prayerData[i].time.split(':').map(Number);
    if (h * 60 + m > currentMins) return i;
  }
  return 0;
}

export default function PrayerTimesGrid() {
  const { prayerData, isLoading } = usePrayerTimes();
  const { ramadanInfo, ramadanLoading } = usePuasa();
  const [activeIndex, setActiveIndex] = useState(0);

  // Display Imsak only during Ramadan
  const showImsak = !ramadanLoading && ramadanInfo.isRamadan;
  const filteredPrayerData = showImsak
    ? prayerData
    : prayerData.filter((p) => p.id !== 'imsak');

  useEffect(() => {
    setActiveIndex(getNextPrayerIndex(filteredPrayerData));
    const interval = setInterval(() => setActiveIndex(getNextPrayerIndex(filteredPrayerData)), 60000);
    return () => clearInterval(interval);
  }, [filteredPrayerData]);

  return (
    <div className={`flex md:grid ${showImsak ? 'md:grid-cols-6' : 'md:grid-cols-5'} gap-3 overflow-x-auto md:overflow-visible hide-scrollbar pb-4 -mx-6 px-6 md:mx-0 md:px-0`}>
      {filteredPrayerData.map((prayer, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={prayer.id}
            className={`min-w-[85px] md:min-w-0 md:w-full rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shrink-0 md:shrink relative ${
              isActive
                ? 'bg-r-blue/20 border border-r-cyan shadow-[0_0_15px_rgba(0,255,212,0.15)]'
                : 'bg-r-light/5 border border-r-light/10'
            } ${isLoading ? 'animate-pulse' : ''}`}
          >
            {isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-r-cyan rounded-full border-2 border-r-dark shadow-[0_0_10px_#00FFD4]"></div>
            )}
            <span className={`text-xs md:text-sm ${isActive ? 'text-r-cyan font-medium' : 'text-r-light/60'}`}>
              {prayer.name}
            </span>
            <i className={`fa-solid ${prayer.icon} text-lg md:text-2xl ${isActive ? 'text-r-cyan' : 'text-r-light/40'}`}></i>
            <span className="text-sm md:text-base font-semibold text-white">{prayer.time}</span>
          </div>
        );
      })}
    </div>
  );
}

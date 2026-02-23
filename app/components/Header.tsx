'use client';

import { usePrayerTimes } from '@/app/context/PrayerTimesContext';
import { openLocationModal } from '@/app/components/LocationModal';

export default function Header() {
  const { city } = usePrayerTimes();

  return (
    <header className="w-full pt-12 md:pt-8 pb-4 z-10 px-6">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        <button
          onClick={openLocationModal}
          className="flex items-center gap-2 text-r-light/80 hover:text-r-cyan transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-location-dot text-r-cyan"></i>
          <span className="text-sm font-medium">{city}</span>
          <i className="fa-solid fa-chevron-down text-xs ml-1"></i>
        </button>
        <button className="relative w-10 h-10 rounded-full bg-r-light/5 flex items-center justify-center hover:bg-r-light/10 transition">
          <i className="fa-regular fa-bell text-r-light"></i>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-r-cyan rounded-full"></span>
        </button>
      </div>
    </header>
  );
}

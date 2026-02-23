'use client';

import HeroCountdown from '@/app/components/HeroCountdown';
import PrayerTimesGrid from '@/app/components/PrayerTimesGrid';
import StatsCard from '@/app/components/StatsCard';
import { openTasbihModal } from '@/app/components/TasbihModal';
import { usePuasa } from '@/app/context/PuasaContext';
import Link from 'next/link';

export default function HomePage() {
  const { currentHariRamadhan, ramadanInfo, ramadanLoading } = usePuasa();

  return (
    <div className="transition-opacity duration-300 opacity-100 px-6">
      <div className="max-w-5xl mx-auto w-full">

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Assalamu&apos;alaikum,</h1>
          <p className="text-r-light/70 text-sm mt-1">
            {ramadanLoading ? (
              <span className="animate-pulse">Memuat...</span>
            ) : ramadanInfo.isRamadan ? (
              `Ramadhan Hari Ke-${currentHariRamadhan}`
            ) : (
              'Selamat Datang'
            )}
          </p>
        </div>

        {/* Hero Countdown */}
        <HeroCountdown />

        {/* Quick Actions */}
        <div className="grid grid-cols-4 md:flex md:justify-center md:gap-16 gap-4 mb-8">
          <Link href="/quran" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-r-light/5 flex items-center justify-center text-r-cyan group-hover:bg-r-blue group-hover:text-white transition-all duration-300 shadow-sm border border-r-light/5">
              <i className="fa-solid fa-book-quran text-xl md:text-2xl"></i>
            </div>
            <span className="text-[11px] md:text-sm font-medium text-r-light/80">Al-Quran</span>
          </Link>

          <Link href="/doa" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-r-light/5 flex items-center justify-center text-r-cyan group-hover:bg-r-blue group-hover:text-white transition-all duration-300 shadow-sm border border-r-light/5">
              <i className="fa-solid fa-hands-praying text-xl md:text-2xl"></i>
            </div>
            <span className="text-[11px] md:text-sm font-medium text-r-light/80">Doa Harian</span>
          </Link>

          <button className="flex flex-col items-center gap-2 group" onClick={openTasbihModal}>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-r-light/5 flex items-center justify-center text-r-cyan group-hover:bg-r-blue group-hover:text-white transition-all duration-300 shadow-sm border border-r-light/5">
              <i className="fa-solid fa-fingerprint text-xl md:text-2xl"></i>
            </div>
            <span className="text-[11px] md:text-sm font-medium text-r-light/80">Tasbih</span>
          </button>

          <button
            className="flex flex-col items-center gap-2 group"
            onClick={() => alert('Fitur Kompas Kiblat sedang dalam pengembangan!')}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-r-light/5 flex items-center justify-center text-r-cyan group-hover:bg-r-blue group-hover:text-white transition-all duration-300 shadow-sm border border-r-light/5">
              <i className="fa-solid fa-compass text-xl md:text-2xl"></i>
            </div>
            <span className="text-[11px] md:text-sm font-medium text-r-light/80">Kiblat</span>
          </button>
        </div>

        {/* Ibadah Summary */}
        <div className="mb-4 flex justify-between items-end">
          <h3 className="text-lg md:text-xl font-semibold text-white">Ringkasan Ibadah</h3>
        </div>
        <StatsCard />

        {/* Prayer Times */}
        <div className="mb-4 flex justify-between items-end">
          <h3 className="text-lg md:text-xl font-semibold text-white">Jadwal Sholat</h3>
          <span className="text-xs md:text-sm text-r-cyan cursor-pointer hover:underline">Lihat Semua</span>
        </div>
        <PrayerTimesGrid />

        {/* Daily Verse */}
        <div className="mt-4 md:mt-8 bg-r-light/5 border border-r-light/10 rounded-2xl p-5 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48 bg-r-blue/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-r-blue/20 flex items-center justify-center text-r-blue">
              <i className="fa-solid fa-quote-right text-xs md:text-sm"></i>
            </div>
            <h3 className="text-sm md:text-base font-semibold text-white">Ayat Hari Ini</h3>
          </div>
          <p className="text-sm md:text-lg text-r-light/80 leading-relaxed italic relative z-10">
            &quot;Hai orang-orang yang beriman, diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu agar kamu bertakwa.&quot;
          </p>
          <p className="text-xs md:text-sm text-r-cyan mt-3 font-medium">(QS. Al-Baqarah: 183)</p>
        </div>

      </div>
    </div>
  );
}

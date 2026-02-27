'use client';

import { useState, useEffect } from 'react';
import { usePrayerTimes } from '@/app/context/PrayerTimesContext';
import Link from 'next/link';

interface PrayerDetail {
  id: string;
  name: string;
  time: string;
  icon: string;
  arabicName: string;
  description: string;
  rakaat: string;
}

const PRAYER_DETAILS: Record<string, { arabicName: string; description: string; rakaat: string }> = {
  imsak: {
    arabicName: 'إمساك',
    description: 'Waktu berhenti makan & minum sebelum Subuh',
    rakaat: '-',
  },
  subuh: {
    arabicName: 'الفجر',
    description: 'Sholat pertama di waktu fajar',
    rakaat: '2 Rakaat',
  },
  dzuhur: {
    arabicName: 'الظهر',
    description: 'Sholat di tengah hari saat matahari tergelincir',
    rakaat: '4 Rakaat',
  },
  ashar: {
    arabicName: 'العصر',
    description: 'Sholat di sore hari',
    rakaat: '4 Rakaat',
  },
  maghrib: {
    arabicName: 'المغرب',
    description: 'Sholat saat matahari terbenam',
    rakaat: '3 Rakaat',
  },
  isya: {
    arabicName: 'العشاء',
    description: 'Sholat di malam hari',
    rakaat: '4 Rakaat',
  },
};

function getNextPrayerIndex(prayers: { time: string }[]): number {
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < prayers.length; i++) {
    const [h, m] = prayers[i].time.split(':').map(Number);
    if (h * 60 + m > currentMins) return i;
  }
  return 0;
}

function getCountdown(targetTime: string): string {
  const now = new Date();
  const [h, m] = targetTime.split(':').map(Number);
  let diffMin = (h * 60 + m) - (now.getHours() * 60 + now.getMinutes());
  if (diffMin < 0) diffMin += 1440; // next day
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  if (hours === 0) return `${mins} menit lagi`;
  return `${hours} jam ${mins} menit lagi`;
}

function getCurrentDateFormatted(): string {
  const now = new Date();
  const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

export default function JadwalSholatPage() {
  const { prayerData, city, isLoading } = usePrayerTimes();
  const [nextIndex, setNextIndex] = useState(0);
  const [countdown, setCountdown] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Enrich prayer data with details
  const prayers: PrayerDetail[] = prayerData.map((p) => ({
    ...p,
    arabicName: PRAYER_DETAILS[p.id]?.arabicName || '',
    description: PRAYER_DETAILS[p.id]?.description || '',
    rakaat: PRAYER_DETAILS[p.id]?.rakaat || '-',
  }));

  useEffect(() => {
    const update = () => {
      const idx = getNextPrayerIndex(prayerData);
      setNextIndex(idx);
      setCountdown(getCountdown(prayerData[idx]?.time || '00:00'));
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    };
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [prayerData]);

  const nextPrayer = prayers[nextIndex];

  // Determine which prayers have passed
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="pb-6 px-6">
      <div className="max-w-5xl mx-auto w-full">

        {/* Header */}
        <div className="mb-6 mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Jadwal Sholat</h1>
            <p className="text-r-light/60 text-sm mt-1">{getCurrentDateFormatted()}</p>
          </div>
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-r-light/5 flex items-center justify-center text-r-light/60 hover:text-white hover:bg-r-light/10 transition"
          >
            <i className="fa-solid fa-arrow-left text-sm"></i>
          </Link>
        </div>

        {/* Next Prayer Hero Card */}
        {!isLoading && nextPrayer && (
          <div className="relative bg-gradient-to-br from-[#1e2040] via-[#252850] to-[#1a1b30] border border-r-light/10 rounded-2xl p-5 md:p-7 mb-6 overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-r-blue/15 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-r-cyan/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-r-cyan animate-pulse"></div>
                <span className="text-xs text-r-cyan font-medium uppercase tracking-wider">Sholat Berikutnya</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">{nextPrayer.name}</h2>
                  <p className="text-r-light/50 text-sm mb-3" style={{ fontFamily: "'Amiri', serif" }}>
                    {nextPrayer.arabicName}
                  </p>
                  <div className="flex items-center gap-2">
                    <i className="fa-regular fa-clock text-r-cyan text-xs"></i>
                    <span className="text-sm text-r-light/70">{countdown}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">{nextPrayer.time}</div>
                  <span className="text-xs text-r-light/40 mt-1 block">{nextPrayer.rakaat}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location & Current Time Info */}
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-2 text-r-light/50 text-xs">
            <i className="fa-solid fa-location-dot text-r-cyan text-[10px]"></i>
            <span>{city}</span>
          </div>
          <div className="flex items-center gap-2 text-r-light/50 text-xs">
            <i className="fa-regular fa-clock text-[10px]"></i>
            <span>Sekarang {currentTime}</span>
          </div>
        </div>

        {/* Prayer Times List */}
        <div className="space-y-2.5">
          {prayers.map((prayer, index) => {
            const [ph, pm] = prayer.time.split(':').map(Number);
            const prayerMins = ph * 60 + pm;
            const isPassed = prayerMins <= currentMins;
            const isNext = index === nextIndex;

            return (
              <div
                key={prayer.id}
                className={`rounded-2xl p-4 md:p-5 border transition-all duration-300 ${
                  isNext
                    ? 'bg-r-blue/10 border-r-cyan/30 shadow-[0_0_20px_rgba(0,255,212,0.08)]'
                    : isPassed
                      ? 'bg-r-light/[0.02] border-r-light/[0.06]'
                      : 'bg-r-light/5 border-r-light/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Icon + Info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isNext
                        ? 'bg-r-cyan/15'
                        : isPassed
                          ? 'bg-r-light/[0.04]'
                          : 'bg-r-light/[0.06]'
                    }`}>
                      <i className={`fa-solid ${prayer.icon} text-lg ${
                        isNext
                          ? 'text-r-cyan'
                          : isPassed
                            ? 'text-r-light/20'
                            : 'text-r-light/40'
                      }`}></i>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm md:text-base font-semibold ${
                          isNext ? 'text-r-cyan' : isPassed ? 'text-r-light/30' : 'text-white'
                        }`}>
                          {prayer.name}
                        </h3>
                        {isNext && (
                          <span className="text-[9px] bg-r-cyan/15 text-r-cyan px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">
                            Berikutnya
                          </span>
                        )}
                        {isPassed && !isNext && (
                          <i className="fa-solid fa-check text-[10px] text-r-light/20"></i>
                        )}
                      </div>
                      <p className={`text-[11px] md:text-xs mt-0.5 ${
                        isPassed && !isNext ? 'text-r-light/20' : 'text-r-light/40'
                      }`}>
                        {prayer.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Time + Rakaat */}
                  <div className="text-right shrink-0 ml-3">
                    <div className={`text-lg md:text-xl font-bold tracking-tight ${
                      isNext ? 'text-white' : isPassed ? 'text-r-light/25' : 'text-white'
                    }`}>
                      {prayer.time}
                    </div>
                    {prayer.rakaat !== '-' && (
                      <span className={`text-[10px] md:text-xs ${
                        isPassed && !isNext ? 'text-r-light/15' : 'text-r-light/35'
                      }`}>
                        {prayer.rakaat}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Footer */}
        <div className="mt-6 bg-r-light/[0.03] border border-r-light/[0.06] rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-r-blue/10 flex items-center justify-center shrink-0 mt-0.5">
            <i className="fa-solid fa-info text-r-blue text-xs"></i>
          </div>
          <div>
            <p className="text-xs text-r-light/50 leading-relaxed">
              Jadwal sholat berdasarkan perhitungan <span className="text-r-light/70 font-medium">Kementerian Agama RI</span> untuk wilayah <span className="text-r-light/70 font-medium">{city}</span>.
              Waktu dapat berbeda beberapa menit tergantung lokasi tepatnya.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

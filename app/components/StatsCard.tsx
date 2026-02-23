'use client';

import { useState, useEffect } from 'react';
import { usePuasa } from '../context/PuasaContext';
import { calculateProgress, TOTAL_SURAHS, TOTAL_AYAT, calculateAyatRead } from '@/lib/quran-ayat-counts';

interface QuranHistory {
  surahNomor: number;
  surahNama: string;
  ayatNomor: number;
}

export default function StatsCard() {
  const { puasaData, ramadanInfo } = usePuasa();
  const totalPuasa = puasaData.filter(Boolean).length;
  const ramadanDays = ramadanInfo.ramadanDays;
  const puasaPercent = (totalPuasa / ramadanDays) * 100;

  const [quranHistory, setQuranHistory] = useState<QuranHistory | null>(null);
  const [quranLoading, setQuranLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/quran-history');
        if (res.ok) {
          const json = await res.json();
          if (json.history) {
            setQuranHistory(json.history);
          }
        }
      } catch {
        // silently fail
      } finally {
        setQuranLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const quranPercent = quranHistory
    ? calculateProgress(quranHistory.surahNomor, quranHistory.ayatNomor)
    : 0;

  const ayatRead = quranHistory
    ? calculateAyatRead(quranHistory.surahNomor, quranHistory.ayatNomor)
    : 0;

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
      {/* Puasa */}
      <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-2 md:mb-4">
          <i className="fa-solid fa-moon text-r-cyan md:text-lg"></i>
          <span className="text-xs md:text-sm font-medium text-white">Puasa</span>
        </div>
        <div className="flex items-end gap-1 md:gap-2 mb-2 md:mb-4">
          <span className="text-2xl md:text-4xl font-bold text-white">{totalPuasa}</span>
          <span className="text-r-light/60 text-[10px] md:text-xs mb-1 md:mb-2">/ {ramadanDays} Hari</span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-1.5 md:h-2">
          <div
            className="bg-r-cyan h-1.5 md:h-2 rounded-full transition-all duration-500"
            style={{ width: `${puasaPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Khatam Quran */}
      <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-2 md:mb-4">
          <i className="fa-solid fa-book-open text-r-blue md:text-lg"></i>
          <span className="text-xs md:text-sm font-medium text-white">Khatam</span>
        </div>

        {quranLoading ? (
          <div className="flex items-end gap-1 md:gap-2 mb-2 md:mb-4">
            <span className="text-2xl md:text-4xl font-bold text-white/30">—</span>
          </div>
        ) : quranHistory ? (
          <>
            <div className="flex items-end gap-1 md:gap-2 mb-1">
              <span className="text-2xl md:text-4xl font-bold text-white">{quranPercent}</span>
              <span className="text-r-light/60 text-[10px] md:text-xs mb-1 md:mb-2">%</span>
            </div>
            <p className="text-[10px] md:text-xs text-r-light/40 mb-2 md:mb-3 truncate">
              <i className="fa-solid fa-bookmark text-r-blue/60 mr-1"></i>
              {quranHistory.surahNama} : {quranHistory.ayatNomor}
            </p>
          </>
        ) : (
          <>
            <div className="flex items-end gap-1 md:gap-2 mb-1">
              <span className="text-2xl md:text-4xl font-bold text-white">0</span>
              <span className="text-r-light/60 text-[10px] md:text-xs mb-1 md:mb-2">%</span>
            </div>
            <p className="text-[10px] md:text-xs text-r-light/40 mb-2 md:mb-3">
              Belum mulai membaca
            </p>
          </>
        )}

        <div className="w-full bg-black/40 rounded-full h-1.5 md:h-2">
          <div
            className="bg-r-blue h-1.5 md:h-2 rounded-full transition-all duration-700"
            style={{ width: `${quranPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

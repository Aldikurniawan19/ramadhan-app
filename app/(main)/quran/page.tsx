'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Surah } from '@/lib/quran';
import { calculateProgress, calculateAyatRead, TOTAL_AYAT, TOTAL_SURAHS, AYAT_PER_SURAH } from '@/lib/quran-ayat-counts';

interface QuranHistory {
  surahNomor: number;
  surahNama: string;
  ayatNomor: number;
}

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRead, setLastRead] = useState<QuranHistory | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch('https://equran.id/api/v2/surat');
        if (!res.ok) throw new Error('Gagal memuat data');
        const json = await res.json();
        setSurahs(json.data);
      } catch (err) {
        setError('Gagal memuat daftar surah. Periksa koneksi internet Anda.');
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();

    // Fetch last-read history
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/quran-history');
        if (res.ok) {
          const json = await res.json();
          if (json.history) {
            setLastRead(json.history);
          }
        }
      } catch {
        // silently fail — history is non-critical
      }
    };
    fetchHistory();
  }, []);

  const filtered = surahs.filter(
    (s) =>
      s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
      s.arti.toLowerCase().includes(search.toLowerCase()) ||
      String(s.nomor).includes(search)
  );

  const quranPercent = lastRead
    ? calculateProgress(lastRead.surahNomor, lastRead.ayatNomor)
    : 0;
  const ayatRead = lastRead
    ? calculateAyatRead(lastRead.surahNomor, lastRead.ayatNomor)
    : 0;
  // completed surahs = all surahs before the current one
  const completedSurahs = lastRead ? lastRead.surahNomor - 1 : 0;

  // SVG circular progress
  const circleRadius = 42;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleOffset = circleCircumference - (quranPercent / 100) * circleCircumference;

  return (
    <div className="pb-6 px-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-6 mt-2">
          <h1 className="text-2xl font-semibold text-white">Al-Qur&apos;an</h1>
          <p className="text-r-light/70 text-sm mt-1">114 Surah • 6.236 Ayat</p>
        </div>

        {/* Last Read */}
        <div className="bg-gradient-to-r from-[#2a2b3d] to-r-light/5 border border-r-light/10 rounded-2xl p-4 md:p-6 mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-r-cyan mb-1 flex items-center gap-1">
              <i className="fa-solid fa-book-open-reader"></i> Terakhir Dibaca
            </p>
            {lastRead ? (
              <>
                <h3 className="text-white font-medium text-lg md:text-2xl">{lastRead.surahNama}</h3>
                <p className="text-xs md:text-sm text-r-light/60">Ayat {lastRead.ayatNomor}</p>
              </>
            ) : (
              <>
                <h3 className="text-white/50 font-medium text-lg md:text-2xl">Belum ada riwayat</h3>
                <p className="text-xs md:text-sm text-r-light/40">Tandai ayat saat membaca surah</p>
              </>
            )}
          </div>
          {lastRead ? (
            <Link
              href={`/quran/${lastRead.surahNomor}`}
              className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-r-blue flex items-center justify-center text-white shadow-lg hover:scale-105 transition"
            >
              <i className="fa-solid fa-play text-xs md:text-base ml-0.5"></i>
            </Link>
          ) : (
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-r-light/10 flex items-center justify-center text-r-light/30">
              <i className="fa-solid fa-book-open text-xs md:text-base"></i>
            </div>
          )}
        </div>

        {/* Quran Progress Card */}
        <div className="bg-gradient-to-br from-[#1e2040] via-[#252850] to-[#1a1b30] border border-r-light/10 rounded-2xl p-4 md:p-6 mb-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-r-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-r-cyan/5 rounded-full blur-2xl"></div>

          <div className="flex items-center gap-4 md:gap-6 relative z-10">
            {/* Circular Progress */}
            <div className="relative shrink-0">
              <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="50" cy="50" r={circleRadius}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="6"
                />
                {/* Progress circle */}
                <circle
                  cx="50" cy="50" r={circleRadius}
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={circleOffset}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5465FF" />
                    <stop offset="100%" stopColor="#00D4AA" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl md:text-2xl font-bold text-white">{quranPercent}%</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-white mb-2 flex items-center gap-2">
                <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                Progress Khatam
              </h3>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-r-light/50">Ayat Dibaca</span>
                  <span className="text-white font-medium">{ayatRead.toLocaleString()} <span className="text-r-light/40">/ {TOTAL_AYAT.toLocaleString()}</span></span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-r-light/50">Surah Selesai</span>
                  <span className="text-white font-medium">{completedSurahs} <span className="text-r-light/40">/ {TOTAL_SURAHS}</span></span>
                </div>
                {lastRead && (
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-r-light/50">Sedang Dibaca</span>
                    <span className="text-r-cyan font-medium truncate ml-2">{lastRead.surahNama}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full-width progress bar at bottom */}
          <div className="w-full bg-black/30 rounded-full h-1.5 mt-4 relative z-10">
            <div
              className="h-1.5 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${quranPercent}%`,
                background: 'linear-gradient(90deg, #5465FF, #00D4AA)',
              }}
            ></div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-3 md:p-4 flex items-center gap-3 mb-6">
          <i className="fa-solid fa-magnifying-glass text-r-light/40 ml-2"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau nomor surah..."
            className="bg-transparent border-none outline-none text-white w-full text-sm md:text-base placeholder:text-r-light/40"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-r-light/40 hover:text-white transition mr-1">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Surah Count / Loading */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-white">Daftar Surah</h3>
          {!loading && (
            <span className="text-xs text-r-light/40">
              {filtered.length} surah
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <i className="fa-solid fa-spinner fa-spin text-r-cyan text-3xl mb-4"></i>
            <p className="text-r-light/50 text-sm">Memuat daftar surah...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
            <i className="fa-solid fa-wifi text-red-400 text-2xl mb-3"></i>
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-r-cyan text-sm hover:underline"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Surah List */}
        {!loading && !error && (
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((surah) => (
              <Link
                key={surah.nomor}
                href={`/quran/${surah.nomor}`}
                className="bg-r-light/5 hover:bg-r-light/10 transition border border-r-light/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center w-10 h-10">
                    <i className="fa-regular fa-star text-r-cyan/30 text-3xl absolute"></i>
                    <span className="text-xs font-semibold text-white relative z-10">{surah.nomor}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium group-hover:text-r-cyan transition">{surah.namaLatin}</h3>
                    <p className="text-xs text-r-light/60">
                      {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                    </p>
                    <p className="text-[10px] text-r-light/40 mt-0.5">{surah.arti}</p>
                  </div>
                </div>
                <div className="text-right text-r-cyan text-xl" style={{ fontFamily: "'Times New Roman', serif" }}>
                  {surah.nama}
                </div>
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12">
                <i className="fa-solid fa-search text-r-light/20 text-3xl mb-3"></i>
                <p className="text-r-light/40 text-sm">Surah tidak ditemukan</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

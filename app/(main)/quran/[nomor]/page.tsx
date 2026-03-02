'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SurahDetail, Ayat } from '@/lib/quran';
import AudioPlayer, { type PlayMode } from '@/app/components/AudioPlayer';

export default function SurahDetailPage() {
  const params = useParams();
  const router = useRouter();
  const nomor = Number(params.nomor);

  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarkedAyat, setBookmarkedAyat] = useState<number | null>(null);
  const [savingAyat, setSavingAyat] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  // Audio state
  const [playerVisible, setPlayerVisible] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>('ayat');
  const [currentAyatIndex, setCurrentAyatIndex] = useState<number | null>(null);
  const [selectedQari, setSelectedQari] = useState('05'); // default: Misyari Rasyid Al-Afasi
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const ayatRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Scroll to active ayat when it changes
  useEffect(() => {
    if (currentAyatIndex !== null && playerVisible) {
      const ayatEl = ayatRefs.current.get(currentAyatIndex);
      if (ayatEl) {
        ayatEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentAyatIndex, playerVisible]);

  // Fetch current bookmark for this surah
  const fetchBookmark = useCallback(async () => {
    try {
      const res = await fetch('/api/quran-history');
      if (res.ok) {
        const json = await res.json();
        if (json.history && json.history.surahNomor === nomor) {
          setBookmarkedAyat(json.history.ayatNomor);
        }
      }
    } catch {
      // silently fail
    }
  }, [nomor]);

  useEffect(() => {
    if (!nomor || nomor < 1 || nomor > 114) {
      setError('Surah tidak valid');
      setLoading(false);
      return;
    }

    const fetchSurah = async () => {
      try {
        const res = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
        if (!res.ok) throw new Error('Gagal memuat surah');
        const json = await res.json();
        setSurah(json.data);
      } catch {
        setError('Gagal memuat surah. Periksa koneksi internet Anda.');
      } finally {
        setLoading(false);
      }
    };

    // Reset audio state on surah change
    setPlayerVisible(false);
    setCurrentAyatIndex(null);
    setIsAudioPlaying(false);

    fetchSurah();
    fetchBookmark();
  }, [nomor, fetchBookmark]);

  const handleBookmark = async (ayat: Ayat) => {
    if (!surah) return;
    setSavingAyat(ayat.nomorAyat);

    try {
      const res = await fetch('/api/quran-history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahNomor: nomor,
          surahNama: surah.namaLatin,
          ayatNomor: ayat.nomorAyat,
        }),
      });

      if (res.ok) {
        setBookmarkedAyat(ayat.nomorAyat);
        setToastMessage(`Ditandai: ${surah.namaLatin} ayat ${ayat.nomorAyat}`);
        setTimeout(() => setToastMessage(''), 2500);
      }
    } catch {
      setToastMessage('Gagal menyimpan. Coba lagi.');
      setTimeout(() => setToastMessage(''), 2500);
    } finally {
      setSavingAyat(null);
    }
  };

  const handlePlayAyat = (index: number) => {
    if (playerVisible && playMode === 'ayat' && currentAyatIndex === index && isAudioPlaying) {
      // If same ayat is playing, let the player handle pause
      return;
    }
    setPlayMode('ayat');
    setCurrentAyatIndex(index);
    setPlayerVisible(true);
  };

  const handlePlayFullSurah = () => {
    setPlayMode('surah');
    setCurrentAyatIndex(null);
    setPlayerVisible(true);
  };

  const handleClosePlayer = () => {
    setPlayerVisible(false);
    setCurrentAyatIndex(null);
    setIsAudioPlaying(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6">
        <i className="fa-solid fa-spinner fa-spin text-r-cyan text-3xl mb-4"></i>
        <p className="text-r-light/50 text-sm">Memuat surah...</p>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6">
        <i className="fa-solid fa-circle-exclamation text-red-400 text-3xl mb-4"></i>
        <p className="text-red-400 text-sm mb-4">{error || 'Surah tidak ditemukan'}</p>
        <Link href="/quran" className="text-r-cyan text-sm hover:underline">
          ← Kembali ke Daftar Surah
        </Link>
      </div>
    );
  }

  return (
    <div className={`pb-6 px-6 ${playerVisible ? 'pb-36' : ''}`}>
      <div className="max-w-3xl mx-auto w-full">

        {/* Back Button + Header */}
        <div className="flex items-center gap-4 mb-6 mt-2">
          <button
            onClick={() => router.push('/quran')}
            className="w-10 h-10 rounded-full bg-r-light/5 border border-r-light/10 flex items-center justify-center text-r-light/60 hover:text-r-cyan hover:bg-r-light/10 transition shrink-0"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold text-white truncate">{surah.namaLatin}</h1>
            <p className="text-r-light/50 text-xs md:text-sm">
              {surah.tempatTurun} • {surah.jumlahAyat} Ayat • {surah.arti}
            </p>
          </div>
          <div className="text-r-cyan text-2xl md:text-3xl shrink-0" style={{ fontFamily: "'Times New Roman', serif" }}>
            {surah.nama}
          </div>
        </div>

        {/* Murottal Full Surah Button */}
        <button
          onClick={handlePlayFullSurah}
          className={`w-full mb-6 flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border transition group ${
            playerVisible && playMode === 'surah'
              ? 'bg-gradient-to-r from-r-blue/20 to-r-cyan/10 border-r-cyan/30 shadow-[0_0_20px_rgba(0,212,170,0.1)]'
              : 'bg-r-light/5 border-r-light/10 hover:bg-r-light/10 hover:border-r-light/20'
          }`}
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
            playerVisible && playMode === 'surah'
              ? 'bg-gradient-to-br from-r-blue to-r-cyan shadow-[0_2px_10px_rgba(84,101,255,0.4)]'
              : 'bg-r-blue/20 group-hover:bg-r-blue/30'
          }`}>
            <i className={`fa-solid ${
              playerVisible && playMode === 'surah' && isAudioPlaying ? 'fa-pause' : 'fa-play'
            } text-white text-xs ${!(playerVisible && playMode === 'surah' && isAudioPlaying) ? 'ml-0.5' : ''}`}></i>
          </div>
          <div className="text-left">
            <p className={`text-sm font-medium transition ${
              playerVisible && playMode === 'surah' ? 'text-r-cyan' : 'text-white group-hover:text-r-cyan'
            }`}>
              Murottal {surah.namaLatin}
            </p>
            <p className="text-[10px] text-r-light/40">
              Dengarkan full surah
            </p>
          </div>
          <i className={`fa-solid fa-headphones ml-auto text-lg transition ${
            playerVisible && playMode === 'surah' ? 'text-r-cyan' : 'text-r-light/20 group-hover:text-r-light/40'
          }`}></i>
        </button>

        {/* Bismillah Card (skip for At-Taubah / surah 9) */}
        {nomor !== 9 && (
          <div className="bg-gradient-to-br from-r-blue to-[#2b358a] rounded-2xl p-6 md:p-8 text-center mb-6 relative overflow-hidden shadow-[0_5px_20px_rgba(84,101,255,0.25)]">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-r-cyan/10 rounded-full blur-xl"></div>
            <p className="text-white text-2xl md:text-3xl leading-loose relative z-10" style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-white/60 text-xs md:text-sm mt-3 relative z-10">
              Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
            </p>
          </div>
        )}

        {/* Ayat List */}
        <div className="space-y-4">
          {surah.ayat.map((ayat: Ayat, index: number) => {
            const isActiveAyat = playerVisible && playMode === 'ayat' && currentAyatIndex === index;

            return (
              <div
                key={ayat.nomorAyat}
                ref={(el) => {
                  if (el) ayatRefs.current.set(index, el);
                }}
                className={`bg-r-light/5 border rounded-2xl p-5 md:p-6 hover:border-r-light/20 transition ${
                  isActiveAyat
                    ? 'border-r-cyan/40 bg-r-cyan/5 animate-ayat-glow'
                    : bookmarkedAyat === ayat.nomorAyat
                      ? 'border-r-cyan/40 bg-r-cyan/5'
                      : 'border-r-light/10'
                }`}
              >
                {/* Ayat Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-r-blue/20 flex items-center justify-center">
                      <span className="text-xs md:text-sm font-semibold text-r-cyan">{ayat.nomorAyat}</span>
                    </div>
                    <span className="text-[10px] md:text-xs text-r-light/40">
                      {surah.namaLatin} : {ayat.nomorAyat}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Play Ayat Button */}
                    <button
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                        isActiveAyat && isAudioPlaying
                          ? 'bg-gradient-to-br from-r-blue to-r-cyan text-white shadow-[0_2px_8px_rgba(0,212,170,0.3)]'
                          : 'bg-r-light/5 text-r-light/40 hover:text-r-cyan hover:bg-r-light/10'
                      }`}
                      title="Putar ayat"
                      onClick={() => handlePlayAyat(index)}
                    >
                      <i className={`fa-solid ${
                        isActiveAyat && isAudioPlaying ? 'fa-volume-high' : 'fa-play'
                      } text-xs ${!(isActiveAyat && isAudioPlaying) ? 'ml-0.5' : ''}`}></i>
                    </button>
                    {/* Bookmark Button */}
                    <button
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                        bookmarkedAyat === ayat.nomorAyat
                          ? 'bg-r-cyan/20 text-r-cyan'
                          : 'bg-r-light/5 text-r-light/40 hover:text-r-cyan hover:bg-r-light/10'
                      }`}
                      title="Tandai terakhir dibaca"
                      onClick={() => handleBookmark(ayat)}
                      disabled={savingAyat === ayat.nomorAyat}
                    >
                      {savingAyat === ayat.nomorAyat ? (
                        <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                      ) : (
                        <i className={`fa-${bookmarkedAyat === ayat.nomorAyat ? 'solid' : 'regular'} fa-bookmark text-xs`}></i>
                      )}
                    </button>
                    {/* Copy Button */}
                    <button
                      className="w-8 h-8 rounded-full bg-r-light/5 flex items-center justify-center text-r-light/40 hover:text-r-cyan hover:bg-r-light/10 transition"
                      title="Salin ayat"
                      onClick={() => {
                        navigator.clipboard.writeText(`${ayat.teksArab}\n\n${ayat.teksIndonesia}\n\n(${surah.namaLatin}: ${ayat.nomorAyat})`);
                      }}
                    >
                      <i className="fa-regular fa-copy text-xs"></i>
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <p
                  className="text-white text-right text-xl md:text-2xl leading-[2.5] md:leading-[2.8] mb-5"
                  style={{ fontFamily: "'Traditional Arabic', 'Amiri', 'KFGQPC Uthman Taha Naskh', serif" }}
                  dir="rtl"
                >
                  {ayat.teksArab}
                </p>

                {/* Latin Transliteration */}
                <p className="text-r-light/40 text-xs md:text-sm italic mb-3 leading-relaxed">
                  {ayat.teksLatin}
                </p>

                {/* Indonesian Translation */}
                <p className="text-r-light/70 text-sm md:text-base leading-relaxed">
                  {ayat.teksIndonesia}
                </p>
              </div>
            );
          })}
        </div>

        {/* Navigation Between Surahs */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-r-light/10">
          {surah.suratSebelumnya ? (
            <Link
              href={`/quran/${(surah.suratSebelumnya as any).nomor}`}
              className="flex items-center gap-2 text-r-light/50 hover:text-r-cyan transition text-sm"
            >
              <i className="fa-solid fa-chevron-left text-xs"></i>
              <span>{(surah.suratSebelumnya as any).namaLatin}</span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/quran"
            className="w-10 h-10 rounded-full bg-r-light/5 border border-r-light/10 flex items-center justify-center text-r-light/50 hover:text-r-cyan transition"
          >
            <i className="fa-solid fa-list text-sm"></i>
          </Link>

          {surah.suratSelanjutnya ? (
            <Link
              href={`/quran/${(surah.suratSelanjutnya as any).nomor}`}
              className="flex items-center gap-2 text-r-light/50 hover:text-r-cyan transition text-sm"
            >
              <span>{(surah.suratSelanjutnya as any).namaLatin}</span>
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </Link>
          ) : (
            <div />
          )}
        </div>

      </div>

      {/* Audio Player */}
      {surah && (
        <AudioPlayer
          surahName={surah.namaLatin}
          surahNomor={nomor}
          ayatList={surah.ayat}
          audioFullSurah={surah.audioFull}
          currentAyatIndex={currentAyatIndex}
          playMode={playMode}
          selectedQari={selectedQari}
          isVisible={playerVisible}
          onClose={handleClosePlayer}
          onAyatChange={setCurrentAyatIndex}
          onQariChange={setSelectedQari}
          onPlayModeChange={setPlayMode}
          onPlayingChange={setIsAudioPlaying}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-r-cyan/90 text-r-dark text-sm font-medium px-5 py-3 rounded-xl shadow-lg z-50 animate-bounce-in flex items-center gap-2">
          <i className="fa-solid fa-bookmark"></i>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

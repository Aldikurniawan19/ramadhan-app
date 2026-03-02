'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Ayat } from '@/lib/quran';

export const QARI_LIST: { key: string; name: string }[] = [
  { key: '01', name: 'Abdullah Al-Juhany' },
  { key: '02', name: 'Abdul Muhsin Al-Qasim' },
  { key: '03', name: 'Abdurrahman as-Sudais' },
  { key: '04', name: 'Ibrahim Al-Dossari' },
  { key: '05', name: 'Misyari Rasyid Al-Afasi' },
  { key: '06', name: 'Yasser Al-Dosari' },
];

export type PlayMode = 'ayat' | 'surah';

interface AudioPlayerProps {
  surahName: string;
  surahNomor: number;
  ayatList: Ayat[];
  audioFullSurah: Record<string, string>;
  currentAyatIndex: number | null;      // null = full surah mode
  playMode: PlayMode;
  selectedQari: string;
  isVisible: boolean;
  onClose: () => void;
  onAyatChange: (index: number) => void;
  onQariChange: (qari: string) => void;
  onPlayModeChange: (mode: PlayMode) => void;
  onPlayingChange: (playing: boolean) => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({
  surahName,
  surahNomor,
  ayatList,
  audioFullSurah,
  currentAyatIndex,
  playMode,
  selectedQari,
  isVisible,
  onClose,
  onAyatChange,
  onQariChange,
  onPlayModeChange,
  onPlayingChange,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showQariMenu, setShowQariMenu] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // Get current audio URL
  const getAudioUrl = useCallback((): string => {
    if (playMode === 'surah') {
      return audioFullSurah[selectedQari] || '';
    }
    if (currentAyatIndex !== null && ayatList[currentAyatIndex]) {
      return ayatList[currentAyatIndex].audio[selectedQari] || '';
    }
    return '';
  }, [playMode, selectedQari, audioFullSurah, currentAyatIndex, ayatList]);

  // Load and play audio when URL changes
  useEffect(() => {
    const url = getAudioUrl();
    if (!url || !isVisible) return;

    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    audio.src = url;
    audio.load();

    const handleCanPlay = () => {
      setIsLoading(false);
      audio.play().catch(() => setIsPlaying(false));
    };

    audio.addEventListener('canplay', handleCanPlay, { once: true });
    return () => audio.removeEventListener('canplay', handleCanPlay);
  }, [getAudioUrl, isVisible]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => { setIsPlaying(true); onPlayingChange(true); };
    const onPause = () => { setIsPlaying(false); onPlayingChange(false); };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onError = () => { setIsLoading(false); setIsPlaying(false); };

    const onEnded = () => {
      setIsPlaying(false);
      onPlayingChange(false);

      // Auto-play next ayat
      if (playMode === 'ayat' && autoPlay && currentAyatIndex !== null) {
        const nextIndex = currentAyatIndex + 1;
        if (nextIndex < ayatList.length) {
          onAyatChange(nextIndex);
        }
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [playMode, autoPlay, currentAyatIndex, ayatList.length, onAyatChange, onPlayingChange]);

  // Cleanup on unmount or close
  useEffect(() => {
    if (!isVisible && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [isVisible]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePrev = () => {
    if (playMode === 'ayat' && currentAyatIndex !== null && currentAyatIndex > 0) {
      onAyatChange(currentAyatIndex - 1);
    }
  };

  const handleNext = () => {
    if (playMode === 'ayat' && currentAyatIndex !== null && currentAyatIndex < ayatList.length - 1) {
      onAyatChange(currentAyatIndex + 1);
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setShowQariMenu(false);
    onClose();
  };

  const handleQariSelect = (key: string) => {
    onQariChange(key);
    setShowQariMenu(false);
  };

  const handleModeToggle = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentTime(0);
    setDuration(0);
    const newMode = playMode === 'ayat' ? 'surah' : 'ayat';
    onPlayModeChange(newMode);
    if (newMode === 'ayat' && currentAyatIndex === null) {
      onAyatChange(0);
    }
  };

  if (!isVisible) return <audio ref={audioRef} preload="none" />;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentQariName = QARI_LIST.find((q) => q.key === selectedQari)?.name || 'Pilih Qari';
  const displayTitle =
    playMode === 'surah'
      ? `${surahName} (Full)`
      : currentAyatIndex !== null
        ? `${surahName} : Ayat ${ayatList[currentAyatIndex]?.nomorAyat ?? ''}`
        : surahName;

  return (
    <>
      <audio ref={audioRef} preload="none" />

      {/* Qari Selection Modal */}
      {showQariMenu && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowQariMenu(false)}
          />
          <div className="relative z-10 w-full max-w-lg bg-[#1a1b2e]/95 backdrop-blur-xl border border-r-light/10 rounded-t-3xl p-6 pb-8 animate-slide-up">
            <div className="w-10 h-1 bg-r-light/20 rounded-full mx-auto mb-5" />
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <i className="fa-solid fa-microphone text-r-cyan text-sm" />
              Pilih Qari
            </h3>
            <div className="space-y-2">
              {QARI_LIST.map((qari) => (
                <button
                  key={qari.key}
                  onClick={() => handleQariSelect(qari.key)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center justify-between ${
                    selectedQari === qari.key
                      ? 'bg-r-cyan/10 border border-r-cyan/30 text-r-cyan'
                      : 'bg-r-light/5 border border-transparent text-r-light/70 hover:bg-r-light/10 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-medium">{qari.name}</span>
                  {selectedQari === qari.key && (
                    <i className="fa-solid fa-check text-r-cyan text-xs" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Audio Player */}
      <div
        className="fixed bottom-[72px] left-0 right-0 z-50 px-3 pb-2 animate-slide-up"
        style={{ maxWidth: '100vw' }}
      >
        <div className="max-w-3xl mx-auto bg-[#1a1b2e]/90 backdrop-blur-2xl border border-r-light/10 rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.4)] overflow-hidden">

          {/* Progress Bar (thin top line) */}
          <div className="w-full h-1 bg-r-light/5 relative">
            <div
              className="h-full bg-gradient-to-r from-r-blue to-r-cyan transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Main Controls */}
          <div className="px-4 pt-3 pb-2">
            {/* Title Row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-white text-sm font-medium truncate">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin text-r-cyan text-xs" />
                      Memuat...
                    </span>
                  ) : (
                    displayTitle
                  )}
                </p>
                <p className="text-r-light/40 text-[10px] mt-0.5 truncate">
                  {currentQariName}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-full bg-r-light/5 flex items-center justify-center text-r-light/40 hover:text-red-400 hover:bg-red-500/10 transition shrink-0"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            </div>

            {/* Seekbar */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-r-light/40 w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 appearance-none bg-r-light/10 rounded-full outline-none cursor-pointer accent-r-cyan
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-r-cyan [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(0,212,170,0.5)]
                  [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-r-cyan [&::-moz-range-thumb]:border-none"
              />
              <span className="text-[10px] text-r-light/40 w-8 tabular-nums">{formatTime(duration)}</span>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              {/* Left: mode & auto-play  */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleModeToggle}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-r-light/5 text-r-light/50 hover:text-r-cyan hover:bg-r-light/10 transition text-[10px] font-medium"
                  title={playMode === 'ayat' ? 'Mode: Per Ayat' : 'Mode: Full Surah'}
                >
                  <i className={`fa-solid ${playMode === 'ayat' ? 'fa-list-ol' : 'fa-book-open'} text-[10px]`} />
                  {playMode === 'ayat' ? 'Ayat' : 'Surah'}
                </button>
                {playMode === 'ayat' && (
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition ${
                      autoPlay
                        ? 'bg-r-cyan/10 text-r-cyan'
                        : 'bg-r-light/5 text-r-light/40 hover:text-r-light/60'
                    }`}
                    title="Auto-play ayat berikutnya"
                  >
                    <i className="fa-solid fa-forward text-[8px]" />
                    Auto
                  </button>
                )}
              </div>

              {/* Center: Transport Controls */}
              <div className="flex items-center gap-3">
                {playMode === 'ayat' && (
                  <button
                    onClick={handlePrev}
                    disabled={currentAyatIndex === null || currentAyatIndex === 0}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-r-light/50 hover:text-white disabled:text-r-light/20 transition"
                  >
                    <i className="fa-solid fa-backward-step text-sm" />
                  </button>
                )}
                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-r-blue to-r-cyan flex items-center justify-center text-white shadow-[0_2px_12px_rgba(84,101,255,0.4)] hover:shadow-[0_2px_20px_rgba(84,101,255,0.6)] active:scale-95 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <i className="fa-solid fa-spinner fa-spin text-sm" />
                  ) : isPlaying ? (
                    <i className="fa-solid fa-pause text-sm" />
                  ) : (
                    <i className="fa-solid fa-play text-sm ml-0.5" />
                  )}
                </button>
                {playMode === 'ayat' && (
                  <button
                    onClick={handleNext}
                    disabled={currentAyatIndex === null || currentAyatIndex >= ayatList.length - 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-r-light/50 hover:text-white disabled:text-r-light/20 transition"
                  >
                    <i className="fa-solid fa-forward-step text-sm" />
                  </button>
                )}
              </div>

              {/* Right: Qari selector */}
              <button
                onClick={() => setShowQariMenu(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-r-light/5 text-r-light/50 hover:text-r-cyan hover:bg-r-light/10 transition text-[10px] font-medium"
              >
                <i className="fa-solid fa-microphone text-[10px]" />
                Qari
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

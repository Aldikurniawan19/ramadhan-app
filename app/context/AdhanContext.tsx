'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface AdhanContextValue {
  adhanEnabled: Record<string, boolean>; // e.g., { subuh: true, dzuhur: true, ashar: true, maghrib: true, isya: true }
  toggleAdhan: (prayerId: string) => void;
  toggleAllAdhan: (enabled: boolean) => void;
  playAdhan: () => void;
  stopAdhan: () => void;
  isPlaying: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const DEFAULT_ADHAN_SETTINGS: Record<string, boolean> = {
  subuh: true,
  dzuhur: true,
  ashar: true,
  maghrib: true,
  isya: true,
};

const AdhanContext = createContext<AdhanContextValue>({
  adhanEnabled: DEFAULT_ADHAN_SETTINGS,
  toggleAdhan: () => {},
  toggleAllAdhan: () => {},
  playAdhan: () => {},
  stopAdhan: () => {},
  isPlaying: false,
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function useAdhan() {
  return useContext(AdhanContext);
}

export function AdhanProvider({ children }: { children: ReactNode }) {
  const [adhanEnabled, setAdhanEnabled] = useState<Record<string, boolean>>(DEFAULT_ADHAN_SETTINGS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  // Audio API fallback
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('adhan-settings');
      if (saved) {
        setAdhanEnabled(JSON.parse(saved));
      }
    } catch {
      // Ignore errors
    }
    
    // Setup Audio
    if (typeof window !== 'undefined') {
      const audioEl = new Audio('/adhan.mp3');
      audioEl.addEventListener('ended', () => setIsPlaying(false));
      audioEl.addEventListener('pause', () => setIsPlaying(false));
      audioEl.addEventListener('play', () => setIsPlaying(true));
      setAudio(audioEl);
      
      // Initialize Web Audio Context for fallback
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        setAudioContext(new AudioContextClass());
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (Object.keys(adhanEnabled).length > 0) {
      localStorage.setItem('adhan-settings', JSON.stringify(adhanEnabled));
    }
  }, [adhanEnabled]);

  const toggleAdhan = useCallback((prayerId: string) => {
    setAdhanEnabled(prev => ({ ...prev, [prayerId]: !prev[prayerId] }));
  }, []);

  const toggleAllAdhan = useCallback((enabled: boolean) => {
    setAdhanEnabled(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => next[k] = enabled);
      return next;
    });
  }, []);

  // Fallback beep if adhan.mp3 is empty/fails
  const playFallbackBeep = useCallback(() => {
    if (!audioContext) return;
    setIsPlaying(true);
    
    // Beautiful chime sound
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.5); // E5
    osc.frequency.setValueAtTime(783.99, audioContext.currentTime + 1); // G5
    
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + 2.5);
    
    setTimeout(() => {
      setIsPlaying(false);
    }, 2500);
  }, [audioContext]);

  const playAdhan = useCallback(() => {
    if (isPlaying) return;
    
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.warn('Could not play mp3, using fallback beep:', err);
        // Play fallback beep if mp3 fails (e.g. empty file or playback restrictions)
        if (audioContext && audioContext.state !== 'running') {
            audioContext.resume().then(playFallbackBeep);
        } else {
            playFallbackBeep();
        }
      });
    } else {
      playFallbackBeep();
    }
  }, [audio, isPlaying, playFallbackBeep, audioContext]);

  const stopAdhan = useCallback(() => {
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
  }, [audio]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <AdhanContext.Provider value={{
      adhanEnabled,
      toggleAdhan,
      toggleAllAdhan,
      playAdhan,
      stopAdhan,
      isPlaying,
      isModalOpen,
      openModal,
      closeModal
    }}>
      {children}
    </AdhanContext.Provider>
  );
}

'use client';

import { useAdhan } from '@/app/context/AdhanContext';
import { useEffect, useState } from 'react';

const PRAYERS = [
  { id: 'subuh', name: 'Subuh' },
  { id: 'dzuhur', name: 'Dzuhur' },
  { id: 'ashar', name: 'Ashar' },
  { id: 'maghrib', name: 'Maghrib' },
  { id: 'isya', name: 'Isya' },
];

export default function AdhanSettingsModal() {
  const { isModalOpen, closeModal, adhanEnabled, toggleAdhan, toggleAllAdhan, playAdhan, stopAdhan, isPlaying } = useAdhan();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const allEnabled = Object.values(adhanEnabled).every(Boolean);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeModal}
      ></div>

      {/* Modal */}
      <div 
        className={`fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:bottom-auto md:right-auto md:-translate-x-1/2 w-full md:w-[450px] bg-[#1a1b26] md:rounded-3xl rounded-t-3xl border border-r-light/10 shadow-2xl z-50 transition-all duration-300 transform ${
          isModalOpen ? 'translate-y-0 md:-translate-y-1/2 opacity-100' : 'translate-y-full md:-translate-y-1/2 opacity-0 pointer-events-none md:scale-95'
        }`}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Suara Adzan</h2>
            <button 
              onClick={closeModal}
              className="w-8 h-8 rounded-full bg-r-light/10 flex items-center justify-center text-r-light/60 hover:text-white hover:bg-r-light/20 transition"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <p className="text-sm text-r-light/60 mb-6">
            Atur waktu sholat mana saja yang akan memutar suara adzan secara otomatis saat waktunya tiba.
          </p>

          {/* Master Toggle */}
          <div className="bg-r-blue/10 border border-r-cyan/30 rounded-2xl p-4 mb-4 flex items-center justify-between">
            <div>
              <span className="text-white font-medium block">Aktifkan Semua</span>
              <span className="text-xs text-r-light/50">Putar adzan untuk semua waktu sholat</span>
            </div>
            <button 
              onClick={() => toggleAllAdhan(!allEnabled)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${allEnabled ? 'bg-r-cyan' : 'bg-r-light/20'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${allEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Individual Prayers */}
          <div className="space-y-2 mb-6">
            {PRAYERS.map(prayer => {
              const enabled = adhanEnabled[prayer.id] ?? true;
              return (
                <div key={prayer.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-r-light/5 transition">
                  <span className="text-r-light/90">{prayer.name}</span>
                  <button 
                    onClick={() => toggleAdhan(prayer.id)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${enabled ? 'bg-r-cyan' : 'bg-r-light/20'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={isPlaying ? stopAdhan : playAdhan}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
                isPlaying 
                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                  : 'bg-r-light/10 text-white hover:bg-r-light/20'
              }`}
            >
              <i className={`fa-solid ${isPlaying ? 'fa-stop' : 'fa-play'}`}></i>
              {isPlaying ? 'Hentikan Preview' : 'Preview Suara'}
            </button>
            <button
              onClick={closeModal}
              className="flex-1 bg-r-cyan hover:bg-[#00e0b9] text-[#050208] py-3 rounded-xl font-semibold transition"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

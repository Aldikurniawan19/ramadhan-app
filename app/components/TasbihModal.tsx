'use client';

import { useState, useEffect, useCallback } from 'react';

interface TasbihState {
  isOpen: boolean;
}

// We use a global event bus pattern so layout can open the modal from anywhere
const OPEN_EVENT = 'open-tasbih';

export function openTasbihModal() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export default function TasbihModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  const dzikir =
    count < 33
      ? 'Subhanallah'
      : count < 66
      ? 'Alhamdulillah'
      : count < 99
      ? 'Allahu Akbar'
      : 'Lailahaillallah';

  const openModal = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => setVisible(true), 10);
  }, []);

  const closeModal = () => {
    setVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  useEffect(() => {
    window.addEventListener(OPEN_EVENT, openModal);
    return () => window.removeEventListener(OPEN_EVENT, openModal);
  }, [openModal]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-r-dark/90 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div
        className={`bg-[#1a1b26] border border-r-light/10 rounded-3xl p-6 w-[85%] max-w-sm flex flex-col items-center relative shadow-2xl transition-transform duration-300 ${
          visible ? 'scale-100' : 'scale-95'
        }`}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-r-light/5 text-r-light/50 hover:text-white hover:bg-r-light/10 transition"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h3 className="text-xl font-semibold text-white mb-2">Tasbih Digital</h3>
        <p className="text-r-cyan text-sm font-medium mb-6 h-5">{dzikir}</p>

        {/* Counter Ring */}
        <div className="w-36 h-36 rounded-full border-[6px] border-r-blue/30 bg-r-light/5 flex items-center justify-center mb-8 relative shadow-[0_0_40px_rgba(84,101,255,0.15)]">
          <span
            className="text-6xl font-bold text-white transition-transform"
            style={{ display: 'inline-block' }}
          >
            {count}
          </span>
        </div>

        {/* TAP Button */}
        <button
          onClick={() => setCount((c) => c + 1)}
          className="w-full py-4 bg-gradient-to-r from-r-blue to-r-cyan rounded-2xl text-r-dark font-bold text-xl hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-hand-pointer text-lg"></i> TAP
        </button>
        <button
          onClick={() => setCount(0)}
          className="mt-5 text-r-light/50 text-sm hover:text-white flex items-center gap-2 transition-colors"
        >
          <i className="fa-solid fa-rotate-right"></i> Reset Hitungan
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

// approximate date for Eid al-Adha 10 Dzulhijjah 1447 H (2026)
const TARGET_DATE = new Date('2026-05-27T00:00:00+07:00').getTime();

export default function EidCountdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative bg-gradient-to-br from-[#1a233a] to-[#0f1524] rounded-2xl p-4 md:p-6 shadow-md border border-r-light/10 overflow-hidden mb-6">
      {/* Decorative elements (reduced size) */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-r-blue/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-r-cyan/10 rounded-full blur-lg"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-white/90 text-xs md:text-sm font-medium mb-3 flex items-center gap-2">
          <i className="fa-solid fa-mosque text-r-cyan"></i>
          Menuju Idul Adha 1447 H
        </h2>
        
        <div className="flex justify-center items-center gap-2 md:gap-4 w-full">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-black/30 rounded-xl flex items-center justify-center border border-white/5 backdrop-blur-sm shadow-inner">
              <span className="text-xl md:text-3xl font-bold text-white tracking-wider">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[9px] md:text-[10px] text-r-light/60 mt-1.5 uppercase tracking-wider font-medium">Hari</span>
          </div>
          
          <span className="text-lg md:text-2xl text-r-cyan/50 font-light -mt-5">:</span>
          
          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-black/30 rounded-xl flex items-center justify-center border border-white/5 backdrop-blur-sm shadow-inner">
              <span className="text-xl md:text-3xl font-bold text-white tracking-wider">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[9px] md:text-[10px] text-r-light/60 mt-1.5 uppercase tracking-wider font-medium">Jam</span>
          </div>

          <span className="text-lg md:text-2xl text-r-cyan/50 font-light -mt-5">:</span>
          
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-black/30 rounded-xl flex items-center justify-center border border-white/5 backdrop-blur-sm shadow-inner">
              <span className="text-xl md:text-3xl font-bold text-white tracking-wider">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[9px] md:text-[10px] text-r-light/60 mt-1.5 uppercase tracking-wider font-medium">Menit</span>
          </div>

          <span className="text-lg md:text-2xl text-r-cyan/50 font-light -mt-5">:</span>
          
          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-black/30 rounded-xl flex items-center justify-center border border-white/5 backdrop-blur-sm shadow-inner flex-col overflow-hidden relative">
              <span className="text-xl md:text-3xl font-bold text-r-cyan tracking-wider z-10">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[9px] md:text-[10px] text-r-light/60 mt-1.5 uppercase tracking-wider font-medium">Detik</span>
          </div>
        </div>
      </div>
    </div>
  );
}

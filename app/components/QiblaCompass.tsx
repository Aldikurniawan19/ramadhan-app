'use client';

import { useState, useEffect, useCallback } from 'react';

interface QiblaData {
  direction: number;
  city: string;
  latitude: number;
  longitude: number;
}

export default function QiblaCompass() {
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [orientationSupported, setOrientationSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Fetch Qibla direction from API
  useEffect(() => {
    const fetchQibla = async () => {
      try {
        const res = await fetch('/api/qibla');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setQiblaData(data);
      } catch {
        setError('Gagal memuat arah kiblat');
      } finally {
        setLoading(false);
      }
    };
    fetchQibla();
  }, []);

  // Handle device orientation
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let heading: number | null = null;

    // iOS: webkitCompassHeading
    if ((event as any).webkitCompassHeading !== undefined) {
      heading = (event as any).webkitCompassHeading;
    }
    // Android / standard: event.alpha (0-360, 0 = North)
    else if (event.alpha !== null) {
      heading = 360 - event.alpha;
    }

    if (heading !== null) {
      setCompassHeading(heading);
      setOrientationSupported(true);
    }
  }, []);

  // Request device orientation permission (required for iOS 13+)
  const requestPermission = async () => {
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission === 'function') {
      try {
        const permission = await DOE.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } catch {
        setError('Izin sensor kompas ditolak');
      }
    } else {
      // Non-iOS or older browsers — just attach
      setPermissionGranted(true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  useEffect(() => {
    // Check if DeviceOrientationEvent exists
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const DOE = DeviceOrientationEvent as any;
      if (typeof DOE.requestPermission !== 'function') {
        // Not iOS 13+ — attach directly
        setPermissionGranted(true);
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  // Calculate compass rotation
  const qiblaDirection = qiblaData?.direction ?? 0;

  // When we have device heading, rotate the entire compass so North faces actual North,
  // then the Qibla needle points to the real Qibla direction
  const compassRotation = compassHeading !== null
    ? -compassHeading // rotate compass by negative heading to align with real North
    : 0;

  const qiblaNeedleRotation = qiblaDirection; // Qibla bearing from North

  // Cardinal directions for the compass rose
  const cardinals = [
    { label: 'N', angle: 0 },
    { label: 'E', angle: 90 },
    { label: 'S', angle: 180 },
    { label: 'W', angle: 270 },
  ];

  // Degree ticks
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5); // every 5°

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-r-cyan/20 border-t-r-cyan rounded-full animate-spin mb-4" />
        <p className="text-r-light/60 text-sm animate-pulse">Menghitung arah kiblat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <i className="fa-solid fa-exclamation-triangle text-red-400 text-3xl mb-4" />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* City badge */}
      <div className="flex items-center gap-2 bg-r-light/5 border border-r-light/10 rounded-full px-4 py-2 mb-6">
        <i className="fa-solid fa-location-dot text-r-cyan text-xs" />
        <span className="text-sm text-r-light/80">{qiblaData?.city}</span>
      </div>

      {/* Compass Container */}
      <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] mb-6">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-r-cyan/5 to-r-blue/5 border border-r-light/10 shadow-[0_0_40px_rgba(0,255,212,0.05)]" />

        {/* Rotating compass face */}
        <div
          className="absolute inset-2 md:inset-3 rounded-full transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${compassRotation}deg)` }}
        >
          {/* Compass background */}
          <div className="absolute inset-0 rounded-full bg-r-dark border border-r-light/15" />

          {/* Degree ticks */}
          {ticks.map((deg) => {
            const isMajor = deg % 90 === 0;
            const isMinor = deg % 45 === 0;
            return (
              <div
                key={deg}
                className="absolute top-0 left-1/2 origin-bottom"
                style={{
                  transform: `translateX(-50%) rotate(${deg}deg)`,
                  height: '50%',
                }}
              >
                <div
                  className={`w-px mx-auto ${
                    isMajor
                      ? 'h-3 md:h-4 bg-r-light/60'
                      : isMinor
                      ? 'h-2 md:h-3 bg-r-light/30'
                      : 'h-1.5 md:h-2 bg-r-light/10'
                  }`}
                />
              </div>
            );
          })}

          {/* Cardinal direction labels */}
          {cardinals.map((c) => (
            <div
              key={c.label}
              className="absolute top-0 left-1/2 origin-bottom"
              style={{
                transform: `translateX(-50%) rotate(${c.angle}deg)`,
                height: '50%',
              }}
            >
              <span
                className={`block text-center text-xs md:text-sm font-bold mt-4 md:mt-5 ${
                  c.label === 'N' ? 'text-red-400' : 'text-r-light/60'
                }`}
                style={{ transform: `rotate(${-c.angle}deg)` }}
              >
                {c.label}
              </span>
            </div>
          ))}

          {/* Qibla needle */}
          <div
            className="absolute top-0 left-1/2 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${qiblaNeedleRotation}deg)`,
              height: '50%',
            }}
          >
            {/* Needle line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 md:w-1.5 rounded-full bg-gradient-to-t from-r-cyan/80 to-r-cyan"
              style={{ height: '85%' }}
            />
            {/* Kaaba icon at tip */}
            <div className="absolute top-2 md:top-3 left-1/2 -translate-x-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-r-cyan/20 border border-r-cyan/50 flex items-center justify-center shadow-[0_0_12px_rgba(0,255,212,0.3)]"
              style={{ transform: `rotate(${-qiblaNeedleRotation}deg)` }}
            >
              <i className="fa-solid fa-kaaba text-r-cyan text-[10px] md:text-xs" />
            </div>
          </div>

          {/* Center point */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-r-light/20 border-2 border-r-light/40" />
          </div>
        </div>
      </div>

      {/* Bearing info */}
      <div className="text-center mb-6">
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">
          {qiblaDirection.toFixed(1)}°
        </div>
        <p className="text-sm text-r-light/50">dari arah Utara (searah jarum jam)</p>
      </div>

      {/* Device orientation status */}
      {!orientationSupported && (
        <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-4 md:p-5 w-full max-w-sm">
          {!permissionGranted ? (
            <div className="text-center">
              <i className="fa-solid fa-mobile-screen text-r-cyan text-2xl mb-3" />
              <p className="text-sm text-r-light/70 mb-3">
                Aktifkan sensor kompas untuk pengalaman interaktif
              </p>
              <button
                onClick={requestPermission}
                className="bg-r-cyan/15 text-r-cyan border border-r-cyan/30 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-r-cyan/25 transition-all"
              >
                <i className="fa-solid fa-compass mr-2" />
                Aktifkan Kompas
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-info-circle text-r-blue text-lg" />
              <p className="text-xs text-r-light/50">
                Kompas interaktif tersedia di perangkat mobile. Arahkan perangkat Anda ke arah
                <span className="text-r-cyan font-medium"> {qiblaDirection.toFixed(1)}°</span> dari Utara.
              </p>
            </div>
          )}
        </div>
      )}

      {orientationSupported && compassHeading !== null && (
        <div className="bg-r-cyan/5 border border-r-cyan/15 rounded-2xl p-4 w-full max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-r-cyan/10 flex items-center justify-center">
              <i className="fa-solid fa-compass text-r-cyan text-sm" />
            </div>
            <div>
              <p className="text-xs text-r-light/60">Arah perangkat Anda</p>
              <p className="text-sm font-semibold text-white">{Math.round(compassHeading)}° dari Utara</p>
            </div>
          </div>
        </div>
      )}

      {/* Kaaba info card */}
      <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-5 w-full max-w-sm mt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-r-blue/20 flex items-center justify-center">
            <i className="fa-solid fa-kaaba text-r-blue text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Ka&apos;bah, Mekkah</h3>
            <p className="text-xs text-r-light/50">21.4225° N, 39.8262° E</p>
          </div>
        </div>
        <p className="text-xs text-r-light/40 leading-relaxed">
          Arah kiblat dihitung berdasarkan lokasi Anda saat ini menuju Ka&apos;bah di Masjidil Haram, Mekkah, Arab Saudi.
        </p>
      </div>
    </div>
  );
}

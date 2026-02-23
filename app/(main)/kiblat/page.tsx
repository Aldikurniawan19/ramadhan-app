'use client';

import QiblaCompass from '@/app/components/QiblaCompass';

export default function KiblatPage() {
  return (
    <div className="pb-6 px-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-6 mt-2">
          <h1 className="text-2xl font-semibold text-white">Arah Kiblat</h1>
          <p className="text-r-light/70 text-sm mt-1">Temukan arah kiblat dari lokasi Anda</p>
        </div>

        <QiblaCompass />
      </div>
    </div>
  );
}

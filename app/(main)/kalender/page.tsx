'use client';

import CalendarGrid from '@/app/components/CalendarGrid';

export default function KalenderPage() {
  return (
    <div className="pb-6 px-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-6 mt-2">
          <h1 className="text-2xl font-semibold text-white">Kalender Puasa</h1>
          <p className="text-r-light/70 text-sm mt-1">Pantau dan tandai hari puasa Anda</p>
        </div>

        <CalendarGrid />
      </div>
    </div>
  );
}

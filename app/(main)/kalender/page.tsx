'use client';

import GeneralCalendar from '@/app/components/GeneralCalendar';

export default function KalenderPage() {
  return (
    <div className="pb-6 px-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-6 mt-2">
          <h1 className="text-2xl font-semibold text-white">Kalender</h1>
          <p className="text-r-light/70 text-sm mt-1">Kalender umum dengan hari-hari besar Indonesia</p>
        </div>

        <GeneralCalendar />
      </div>
    </div>
  );
}

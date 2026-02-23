'use client';

import { useState, useEffect, useRef } from 'react';
import { usePrayerTimes } from '@/app/context/PrayerTimesContext';

// Major Indonesian cities grouped by island/region
const INDONESIA_CITIES: { region: string; cities: string[] }[] = [
  {
    region: 'Jawa',
    cities: [
      'Jakarta', 'Surabaya', 'Bandung', 'Semarang', 'Yogyakarta',
      'Bekasi', 'Tangerang', 'Depok', 'Bogor', 'Malang',
      'Solo', 'Cirebon', 'Serang', 'Tasikmalaya', 'Tegal',
    ],
  },
  {
    region: 'Sumatera',
    cities: [
      'Medan', 'Palembang', 'Padang', 'Pekanbaru', 'Bandar Lampung',
      'Jambi', 'Bengkulu', 'Banda Aceh', 'Batam', 'Pangkal Pinang',
    ],
  },
  {
    region: 'Kalimantan',
    cities: [
      'Banjarmasin', 'Pontianak', 'Samarinda', 'Balikpapan', 'Palangkaraya',
      'Tarakan',
    ],
  },
  {
    region: 'Sulawesi',
    cities: [
      'Makassar', 'Manado', 'Palu', 'Kendari', 'Gorontalo', 'Mamuju',
    ],
  },
  {
    region: 'Bali & Nusa Tenggara',
    cities: [
      'Denpasar', 'Mataram', 'Kupang',
    ],
  },
  {
    region: 'Maluku & Papua',
    cities: [
      'Ambon', 'Ternate', 'Jayapura', 'Sorong', 'Manokwari',
    ],
  },
];

// Flatten for search
const ALL_CITIES = INDONESIA_CITIES.flatMap((g) =>
  g.cities.map((c) => ({ city: c, region: g.region }))
);

let openModalFn: (() => void) | null = null;

export function openLocationModal() {
  openModalFn?.();
}

export default function LocationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { city: currentCity, refreshPrayerTimes } = usePrayerTimes();

  useEffect(() => {
    openModalFn = () => setIsOpen(true);
    return () => { openModalFn = null; };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const currentCityName = currentCity.split(',')[0].trim();

  const filtered = search.trim()
    ? ALL_CITIES.filter(
        (c) =>
          c.city.toLowerCase().includes(search.toLowerCase()) ||
          c.region.toLowerCase().includes(search.toLowerCase())
      )
    : ALL_CITIES;

  // Group filtered results back by region
  const groupedResults: { region: string; cities: { city: string; region: string }[] }[] = [];
  const regionMap = new Map<string, { city: string; region: string }[]>();
  for (const item of filtered) {
    if (!regionMap.has(item.region)) regionMap.set(item.region, []);
    regionMap.get(item.region)!.push(item);
  }
  Array.from(regionMap.entries()).forEach(([region, cities]) => {
    groupedResults.push({ region, cities });
  });

  const handleSelect = async (cityName: string) => {
    if (saving) return;
    setSaving(true);

    try {
      const cityValue = `${cityName}, Indonesia`;
      const res = await fetch('/api/user/city', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cityValue }),
      });

      if (res.ok) {
        setIsOpen(false);
        setToast(`Lokasi diubah ke ${cityName}`);
        setTimeout(() => setToast(''), 2500);
        // Refresh prayer times with new city
        await refreshPrayerTimes();
      } else {
        setToast('Gagal menyimpan lokasi');
        setTimeout(() => setToast(''), 2500);
      }
    } catch {
      setToast('Gagal menyimpan lokasi');
      setTimeout(() => setToast(''), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen && !toast) return null;

  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !saving && setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full">
            {/* Header */}
            <div className="pt-12 pb-4 px-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Pilih Lokasi</h2>
                <p className="text-xs text-r-light/50 mt-0.5">
                  Sesuaikan jadwal sholat dengan kotamu
                </p>
              </div>
              <button
                onClick={() => !saving && setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-r-light/10 flex items-center justify-center text-r-light/60 hover:text-white hover:bg-r-light/20 transition"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Search */}
            <div className="px-6 mb-4">
              <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-3 flex items-center gap-3">
                <i className="fa-solid fa-magnifying-glass text-r-light/40 ml-1"></i>
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kota..."
                  className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-r-light/40"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="text-r-light/40 hover:text-white transition"
                  >
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>
                )}
              </div>
            </div>

            {/* City List */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-4">
              {groupedResults.length === 0 && (
                <div className="text-center py-12">
                  <i className="fa-solid fa-search text-r-light/20 text-2xl mb-3"></i>
                  <p className="text-r-light/40 text-sm">Kota tidak ditemukan</p>
                </div>
              )}

              {groupedResults.map((group) => (
                <div key={group.region}>
                  <h3 className="text-xs font-semibold text-r-light/40 uppercase tracking-wider mb-2 px-1">
                    {group.region}
                  </h3>
                  <div className="space-y-1">
                    {group.cities.map((item) => {
                      const isSelected = item.city === currentCityName;
                      return (
                        <button
                          key={item.city}
                          onClick={() => handleSelect(item.city)}
                          disabled={saving}
                          className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition ${
                            isSelected
                              ? 'bg-r-blue/20 border border-r-cyan/30 text-r-cyan'
                              : 'bg-r-light/5 border border-transparent hover:bg-r-light/10 text-white'
                          } ${saving ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <i className={`fa-solid fa-location-dot text-sm ${isSelected ? 'text-r-cyan' : 'text-r-light/30'}`}></i>
                            <span className="text-sm font-medium">{item.city}</span>
                          </div>
                          {isSelected && (
                            <i className="fa-solid fa-check text-r-cyan text-sm"></i>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-r-cyan/90 text-r-dark text-sm font-medium px-5 py-3 rounded-xl shadow-lg z-[110] flex items-center gap-2">
          <i className="fa-solid fa-location-dot"></i>
          {toast}
        </div>
      )}
    </>
  );
}

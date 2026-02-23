'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Doa {
  id: number;
  judul: string;
  arab: string;
  latin: string;
  terjemah: string;
}

export default function DoaPage() {
  const [doaList, setDoaList] = useState<Doa[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDoa() {
      try {
        const res = await fetch('/api/doa');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setDoaList(data);
      } catch (err) {
        console.error('Failed to load doa:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoa();
  }, []);

  const filtered = doaList.filter((d) =>
    d.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 transition-opacity duration-300 opacity-100">
      <div className="max-w-3xl mx-auto w-full">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-r-light/5 border border-r-light/10 flex items-center justify-center text-r-light/60 hover:text-white hover:bg-r-light/10 transition-all"
          >
            <i className="fa-solid fa-arrow-left text-sm"></i>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">Doa-Doa Harian</h1>
            <p className="text-xs text-r-light/50">{doaList.length} doa tersedia</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-r-light/30 text-sm"></i>
          <input
            type="text"
            placeholder="Cari doa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-r-light/5 border border-r-light/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-r-light/30 focus:outline-none focus:border-r-cyan/50 focus:ring-1 focus:ring-r-cyan/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-r-light/40 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-r-light/5 border border-r-light/10 rounded-2xl p-5 animate-pulse"
              >
                <div className="h-4 bg-r-light/10 rounded w-2/3 mb-3"></div>
                <div className="h-3 bg-r-light/10 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16">
            <i className="fa-solid fa-search text-4xl text-r-light/20 mb-4 block"></i>
            <p className="text-r-light/50 text-sm">
              {search ? `Tidak ditemukan doa "${search}"` : 'Gagal memuat data doa'}
            </p>
          </div>
        )}

        {/* Doa list */}
        <div className="space-y-3 pb-4">
          {filtered.map((doa, index) => {
            const isExpanded = expandedId === doa.id;
            return (
              <div
                key={doa.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'bg-r-blue/10 border-r-cyan/30 shadow-[0_0_20px_rgba(0,255,212,0.08)]'
                    : 'bg-r-light/5 border-r-light/10 hover:border-r-light/20'
                }`}
              >
                {/* Header - clickable */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : doa.id)}
                  className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                        isExpanded
                          ? 'bg-r-cyan/20 text-r-cyan'
                          : 'bg-r-light/10 text-r-light/50'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-sm md:text-base font-medium truncate transition-colors ${
                        isExpanded ? 'text-r-cyan' : 'text-white'
                      }`}
                    >
                      {doa.judul}
                    </span>
                  </div>
                  <i
                    className={`fa-solid fa-chevron-down text-xs ml-3 shrink-0 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-r-cyan' : 'text-r-light/30'
                    }`}
                  ></i>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 md:px-5 pb-5 space-y-4 animate-fadeIn">
                    <hr className="border-r-light/10" />

                    {/* Arabic */}
                    <div className="bg-r-dark/50 rounded-xl p-4 md:p-5">
                      <p className="text-right text-lg md:text-2xl leading-[2.2] md:leading-[2.4] text-white font-medium" dir="rtl">
                        {doa.arab}
                      </p>
                    </div>

                    {/* Latin */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-r-cyan/60 font-semibold mb-1.5">
                        Latin
                      </p>
                      <p className="text-sm text-r-light/70 italic leading-relaxed">
                        {doa.latin}
                      </p>
                    </div>

                    {/* Translation */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-r-cyan/60 font-semibold mb-1.5">
                        Terjemahan
                      </p>
                      <p className="text-sm text-r-light/80 leading-relaxed">
                        {doa.terjemah}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

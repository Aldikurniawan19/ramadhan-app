'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FaqItem {
  id: string;
  category: 'sholat' | 'puasa' | 'quran' | 'fitur' | 'akun';
  question: string;
  answer: string;
  icon: string;
}

const FAQ_LIST: FaqItem[] = [
  // Sholat & Adzan
  {
    id: '1',
    category: 'sholat',
    question: 'Bagaimana cara mengubah lokasi jadwal sholat?',
    answer: 'Anda dapat mengubah lokasi dengan menekan nama kota di bagian beranda, atau buka menu Profil > Preferensi Aplikasi. Pilih atau cari kota Anda di Indonesia untuk menyesuaikan waktu sholat berdasarkan lokasi terkini.',
    icon: 'fa-solid fa-location-dot',
  },
  {
    id: '2',
    category: 'sholat',
    question: 'Mengapa suara Adzan tidak berbunyi saat masuk waktu sholat?',
    answer: 'Pastikan notifikasi browser diizinkan. Selain itu, buka menu Profil > Pengaturan Notifikasi untuk memastikan audio adzan diaktifkan pada waktu sholat yang Anda inginkan.',
    icon: 'fa-solid fa-bell',
  },
  {
    id: '3',
    category: 'sholat',
    question: 'Berapa selisih waktu Imsak dengan Subuh?',
    answer: 'Jadwal Imsak diset sekitar 10 menit sebelum waktu Subuh sesuai perhitungan standar Kementerian Agama Republik Indonesia (Kemenag RI).',
    icon: 'fa-solid fa-cloud-moon',
  },

  // Puasa & Kalender
  {
    id: '4',
    category: 'puasa',
    question: 'Bagaimana cara menandai riwayat puasa harian?',
    answer: 'Buka menu Kalender di bagian bawah aplikasi, lalu ketuk tanggal hari ini untuk menandai status puasa Anda (warna cyan berarti puasa, merah berarti tidak puasa).',
    icon: 'fa-solid fa-calendar-check',
  },
  {
    id: '5',
    category: 'puasa',
    question: 'Mengapa kartu Progres Puasa tidak muncul di luar bulan Ramadhan?',
    answer: 'Kartu Progres Puasa pada Ringkasan Ibadah dirancang muncul secara otomatis saat masuk bulan Ramadhan dan tersembunyi otomatis setelah Ramadhan berakhir.',
    icon: 'fa-solid fa-moon',
  },

  // Al-Quran & Khatam
  {
    id: '6',
    category: 'quran',
    question: 'Bagaimana cara mencatat progres Khatam Quran?',
    answer: 'Saat membaca Al-Quran di aplikasi, ketuk ikon penanda (bookmark) pada ayat terakhir yang Anda baca. Persentase progres Khatam Quran di beranda akan terupdate secara otomatis.',
    icon: 'fa-solid fa-book-quran',
  },
  {
    id: '7',
    category: 'quran',
    question: 'Apakah tersedia audio Murottal di aplikasi ini?',
    answer: 'Ya! Setiap surah Al-Quran dilengkapi dengan pemutar audio murottal per ayat yang dapat diputar secara langsung.',
    icon: 'fa-solid fa-volume-high',
  },

  // Fitur Lainnya
  {
    id: '8',
    category: 'fitur',
    question: 'Bagaimana cara kerja hitung mundur Hari Raya Idul Fitri & Idul Adha?',
    answer: 'Hitung mundur dihitung secara otomatis dan dinamis dari API resmi kalender Hijriah. Setelah Idul Fitri berlalu, target akan berganti otomatis ke Idul Adha dan seterusnya.',
    icon: 'fa-solid fa-mosque',
  },
  {
    id: '9',
    category: 'fitur',
    question: 'Bagaimana cara menggunakan fitur Tasbih digital?',
    answer: 'Tekan menu Tasbih di beranda untuk membuka modal hitungan zikir. Anda dapat menambah hitungan, mereset counter, atau mengaktifkan getaran haptik.',
    icon: 'fa-solid fa-fingerprint',
  },
  {
    id: '10',
    category: 'fitur',
    question: 'Bagaimana cara menggunakan Kompas Kiblat?',
    answer: 'Buka menu Kiblat dan berikan izin lokasi (GPS) pada perangkat Anda. Kompas akan secara otomatis menghitung sudut azimuth Ka\'bah di Mekkah dari lokasi Anda berada.',
    icon: 'fa-solid fa-compass',
  },

  // Akun
  {
    id: '11',
    category: 'akun',
    question: 'Apakah data tracker saya akan hilang jika ganti perangkat?',
    answer: 'Tidak, selama Anda login dengan akun yang sama, semua data tracker puasa, riwayat bacaan Al-Quran, dan preferensi aplikasi Anda tersimpan secara aman di database server.',
    icon: 'fa-solid fa-user-shield',
  },
];

const CATEGORIES = [
  { id: 'semua', name: 'Semua' },
  { id: 'sholat', name: 'Sholat & Adzan' },
  { id: 'puasa', name: 'Puasa & Kalender' },
  { id: 'quran', name: 'Al-Quran' },
  { id: 'fitur', name: 'Fitur Lainnya' },
  { id: 'akun', name: 'Akun' },
];

export default function BantuanPage() {
  const [activeCategory, setActiveCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['1']);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_LIST.filter((faq) => {
    const matchesCategory = activeCategory === 'semua' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-8 px-6">
      <div className="max-w-3xl mx-auto w-full">

        {/* Header */}
        <div className="mb-6 mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white">Bantuan & FAQ</h1>
            <p className="text-r-light/60 text-sm mt-1">Pusat bantuan & pertanyaan umum penggunaan aplikasi</p>
          </div>
          <Link
            href="/profil"
            className="w-10 h-10 rounded-full bg-r-light/5 flex items-center justify-center text-r-light/60 hover:text-white hover:bg-r-light/10 transition shrink-0"
          >
            <i className="fa-solid fa-arrow-left text-sm"></i>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-r-light/5 border border-r-light/10 rounded-2xl p-3.5 mb-6 flex items-center gap-3">
          <i className="fa-solid fa-magnifying-glass text-r-cyan ml-1"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pertanyaan..."
            className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-r-light/40"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-r-light/40 hover:text-white transition">
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-4">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-r-cyan text-r-dark font-semibold shadow-[0_0_15px_rgba(0,255,212,0.3)]'
                    : 'bg-r-light/5 text-r-light/70 hover:bg-r-light/10 border border-r-light/5'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-r-light/5 border border-r-light/10 rounded-2xl p-6">
              <i className="fa-solid fa-circle-question text-r-light/20 text-4xl mb-3"></i>
              <p className="text-white font-medium text-sm">Tidak menemukan hasil</p>
              <p className="text-r-light/40 text-xs mt-1">Coba kata kunci lain atau pilih kategori berbeda</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? 'bg-r-light/10 border-r-cyan/30 shadow-md'
                      : 'bg-r-light/5 border-r-light/10 hover:bg-r-light/[0.08]'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-4 md:p-5 flex items-center justify-between text-left gap-4"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isOpen ? 'bg-r-cyan/15 text-r-cyan' : 'bg-r-light/10 text-r-light/60'
                      }`}>
                        <i className={`${faq.icon} text-sm md:text-base`}></i>
                      </div>
                      <span className="text-sm md:text-base font-semibold text-white">
                        {faq.question}
                      </span>
                    </div>
                    <i className={`fa-solid fa-chevron-down text-xs text-r-light/50 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-r-cyan' : ''
                    }`}></i>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 md:px-5 md:pb-6 pt-1 text-xs md:text-sm text-r-light/80 leading-relaxed border-t border-r-light/5 ml-12 md:ml-14">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support Footer */}
        <div className="mt-8 bg-gradient-to-r from-r-blue/20 to-[#2b358a]/30 border border-r-cyan/30 rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-r-cyan/10 rounded-full blur-2xl"></div>
          <h3 className="text-base md:text-lg font-semibold text-white mb-1">Masih Butuh Bantuan?</h3>
          <p className="text-xs md:text-sm text-r-light/70 mb-4">
            Tim dukungan kami siap membantu pertanyaan atau kendala penggunaan aplikasi Anda.
          </p>
          <a
            href="mailto:support@ramadhan-app.com"
            className="inline-flex items-center gap-2 bg-r-cyan text-r-dark font-semibold px-5 py-2.5 rounded-xl text-xs md:text-sm hover:bg-[#00e0b9] transition shadow-md"
          >
            <i className="fa-solid fa-envelope"></i>
            Hubungi Dukungan
          </a>
        </div>

      </div>
    </div>
  );
}

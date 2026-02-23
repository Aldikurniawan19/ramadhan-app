'use client';

import HeroCountdown from '@/app/components/HeroCountdown';
import PrayerTimesGrid from '@/app/components/PrayerTimesGrid';
import StatsCard from '@/app/components/StatsCard';
import { openTasbihModal } from '@/app/components/TasbihModal';
import { usePuasa } from '@/app/context/PuasaContext';
import Link from 'next/link';

// 30 Ramadan-related verses — one for each day
const DAILY_VERSES = [
  { text: 'Hai orang-orang yang beriman, diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu agar kamu bertakwa.', ref: 'QS. Al-Baqarah: 183' },
  { text: 'Bulan Ramadhan, bulan yang di dalamnya diturunkan Al-Quran sebagai petunjuk bagi manusia dan penjelasan-penjelasan mengenai petunjuk itu serta pembeda antara yang hak dan bathil.', ref: 'QS. Al-Baqarah: 185' },
  { text: 'Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku adalah dekat. Aku mengabulkan permohonan orang yang berdoa apabila ia memohon kepada-Ku.', ref: 'QS. Al-Baqarah: 186' },
  { text: 'Allah menghendaki kemudahan bagimu dan tidak menghendaki kesukaran bagimu.', ref: 'QS. Al-Baqarah: 185' },
  { text: 'Sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan.', ref: 'QS. Al-Insyirah: 5-6' },
  { text: 'Dan bersabarlah, karena sesungguhnya Allah tidak menyia-nyiakan pahala orang-orang yang berbuat kebaikan.', ref: 'QS. Hud: 115' },
  { text: 'Bacalah dengan menyebut nama Tuhanmu yang menciptakan. Dia telah menciptakan manusia dari segumpal darah. Bacalah, dan Tuhanmulah Yang Maha Pemurah.', ref: 'QS. Al-Alaq: 1-3' },
  { text: 'Dan orang-orang yang berjihad di jalan Kami, sungguh akan Kami tunjukkan kepada mereka jalan-jalan Kami.', ref: 'QS. Al-Ankabut: 69' },
  { text: 'Maka ingatlah kepada-Ku, niscaya Aku akan mengingat kamu. Bersyukurlah kepada-Ku dan janganlah kamu mengingkari nikmat-Ku.', ref: 'QS. Al-Baqarah: 152' },
  { text: 'Sesungguhnya Allah beserta orang-orang yang sabar.', ref: 'QS. Al-Baqarah: 153' },
  { text: 'Dan barang siapa bertawakal kepada Allah, niscaya Allah akan mencukupkan keperluannya.', ref: 'QS. Ath-Thalaq: 3' },
  { text: 'Sesungguhnya Allah tidak akan mengubah keadaan suatu kaum sebelum mereka mengubah keadaan diri mereka sendiri.', ref: "QS. Ar-Ra'd: 11" },
  { text: 'Dan mohonlah pertolongan dengan sabar dan shalat. Dan sesungguhnya yang demikian itu sungguh berat, kecuali bagi orang-orang yang khusyu.', ref: 'QS. Al-Baqarah: 45' },
  { text: 'Barang siapa yang mengerjakan kebaikan seberat zarrah pun, niscaya dia akan melihat balasannya.', ref: 'QS. Az-Zalzalah: 7' },
  { text: 'Dan Tuhanmu berfirman: Berdoalah kepada-Ku, niscaya akan Aku kabulkan untukmu.', ref: 'QS. Ghafir: 60' },
  { text: 'Sesungguhnya Kami telah menurunkan Al-Quran pada malam kemuliaan. Dan tahukah kamu apakah malam kemuliaan itu? Malam kemuliaan itu lebih baik dari seribu bulan.', ref: 'QS. Al-Qadr: 1-3' },
  { text: 'Dan Kami tidak mengutus engkau Muhammad melainkan untuk menjadi rahmat bagi seluruh alam.', ref: 'QS. Al-Anbiya: 107' },
  { text: 'Maka nikmat Tuhanmu yang manakah yang kamu dustakan?', ref: 'QS. Ar-Rahman: 13' },
  { text: 'Sesungguhnya orang-orang yang beriman dan mengerjakan kebajikan, mereka itu adalah sebaik-baik makhluk.', ref: 'QS. Al-Bayyinah: 7' },
  { text: 'Dan janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya yang berputus asa dari rahmat Allah hanyalah orang-orang yang kafir.', ref: 'QS. Yusuf: 87' },
  { text: 'Katakanlah: Hai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah.', ref: 'QS. Az-Zumar: 53' },
  { text: 'Dan hanya kepada Allah hendaknya kamu bertawakal, jika kamu benar-benar orang yang beriman.', ref: 'QS. Al-Maidah: 23' },
  { text: 'Sungguh, Allah bersama orang-orang yang bertakwa dan orang-orang yang berbuat kebaikan.', ref: 'QS. An-Nahl: 128' },
  { text: 'Hai orang-orang yang beriman, bertakwalah kepada Allah dan hendaklah setiap diri memperhatikan apa yang telah diperbuatnya untuk hari esok.', ref: 'QS. Al-Hasyr: 18' },
  { text: 'Sesungguhnya shalat itu mencegah dari perbuatan keji dan mungkar.', ref: 'QS. Al-Ankabut: 45' },
  { text: 'Dan orang-orang yang menafkahkan hartanya di malam dan siang hari secara sembunyi-sembunyi dan terang-terangan, maka mereka mendapat pahala di sisi Tuhannya.', ref: 'QS. Al-Baqarah: 274' },
  { text: 'Sesungguhnya Kami menurunkan Al-Quran ini kepadamu dengan berangsur-angsur.', ref: 'QS. Al-Insan: 23' },
  { text: 'Dan bertasbihlah dengan memuji Tuhanmu sebelum terbit matahari dan sebelum terbenamnya.', ref: 'QS. Thaha: 130' },
  { text: 'Allah-lah yang menciptakan langit dan bumi dan apa yang ada di antaranya dalam enam masa.', ref: 'QS. As-Sajdah: 4' },
  { text: 'Dan carilah pada apa yang telah dianugerahkan Allah kepadamu kebahagiaan negeri akhirat, dan janganlah kamu melupakan bagianmu dari kenikmatan dunia.', ref: 'QS. Al-Qashash: 77' },
];

export default function HomePage() {
  const { currentHariRamadhan, ramadanInfo, ramadanLoading } = usePuasa();

  // Pick today's verse based on the Ramadan day (1-indexed, wraps around)
  const todayVerse = DAILY_VERSES[(currentHariRamadhan - 1) % DAILY_VERSES.length];

  return (
    <div className="transition-opacity duration-300 opacity-100 px-6">
      <div className="max-w-5xl mx-auto w-full">

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Assalamu&apos;alaikum,</h1>
          <p className="text-r-light/70 text-sm mt-1">
            {ramadanLoading ? (
              <span className="animate-pulse">Memuat...</span>
            ) : ramadanInfo.isRamadan ? (
              `Ramadhan Hari Ke-${currentHariRamadhan}`
            ) : (
              'Selamat Datang'
            )}
          </p>
        </div>

        {/* Hero Countdown */}
        <HeroCountdown />

        {/* Quick Actions */}
        <div className="grid grid-cols-4 md:flex md:justify-center md:gap-16 gap-4 mb-8">
          <Link href="/quran" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-r-light/5 flex items-center justify-center text-r-cyan group-hover:bg-r-blue group-hover:text-white transition-all duration-300 shadow-sm border border-r-light/5">
              <i className="fa-solid fa-book-quran text-xl md:text-2xl"></i>
            </div>
            <span className="text-[11px] md:text-sm font-medium text-r-light/80">Al-Quran</span>
          </Link>

          <Link href="/doa" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-r-light/5 flex items-center justify-center text-r-cyan group-hover:bg-r-blue group-hover:text-white transition-all duration-300 shadow-sm border border-r-light/5">
              <i className="fa-solid fa-hands-praying text-xl md:text-2xl"></i>
            </div>
            <span className="text-[11px] md:text-sm font-medium text-r-light/80">Doa Harian</span>
          </Link>

          <button className="flex flex-col items-center gap-2 group" onClick={openTasbihModal}>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-r-light/5 flex items-center justify-center text-r-cyan group-hover:bg-r-blue group-hover:text-white transition-all duration-300 shadow-sm border border-r-light/5">
              <i className="fa-solid fa-fingerprint text-xl md:text-2xl"></i>
            </div>
            <span className="text-[11px] md:text-sm font-medium text-r-light/80">Tasbih</span>
          </button>

          <Link href="/kiblat" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-r-light/5 flex items-center justify-center text-r-cyan group-hover:bg-r-blue group-hover:text-white transition-all duration-300 shadow-sm border border-r-light/5">
              <i className="fa-solid fa-compass text-xl md:text-2xl"></i>
            </div>
            <span className="text-[11px] md:text-sm font-medium text-r-light/80">Kiblat</span>
          </Link>
        </div>

        {/* Ibadah Summary */}
        <div className="mb-4 flex justify-between items-end">
          <h3 className="text-lg md:text-xl font-semibold text-white">Ringkasan Ibadah</h3>
        </div>
        <StatsCard />

        {/* Prayer Times */}
        <div className="mb-4 flex justify-between items-end">
          <h3 className="text-lg md:text-xl font-semibold text-white">Jadwal Sholat</h3>
          <span className="text-xs md:text-sm text-r-cyan cursor-pointer hover:underline">Lihat Semua</span>
        </div>
        <PrayerTimesGrid />

        {/* Daily Verse — rotates based on Ramadan day */}
        <div className="mt-4 md:mt-8 bg-r-light/5 border border-r-light/10 rounded-2xl p-5 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48 bg-r-blue/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-r-blue/20 flex items-center justify-center text-r-blue">
              <i className="fa-solid fa-quote-right text-xs md:text-sm"></i>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-semibold text-white">Ayat Hari Ini</h3>
              <span className="text-[10px] md:text-xs text-r-light/40">Hari ke-{currentHariRamadhan} Ramadhan</span>
            </div>
          </div>
          <p className="text-sm md:text-lg text-r-light/80 leading-relaxed italic relative z-10">
            &quot;{todayVerse.text}&quot;
          </p>
          <p className="text-xs md:text-sm text-r-cyan mt-3 font-medium">({todayVerse.ref})</p>
        </div>

      </div>
    </div>
  );
}

<p align="center">
  <img src="public/icon-512x512.png" alt="Aplikasi Ramadhan" width="120" />
</p>

<h1 align="center">🌙 Aplikasi Ramadhan</h1>

<p align="center">
  <strong>Aplikasi ibadah Ramadhan lengkap — jadwal sholat, Al-Quran, tasbih, doa harian, dan lainnya.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-5.14-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PWA-Supported-5A0FC8?style=flat-square&logo=pwa" alt="PWA" />
</p>

---

## 📖 Tentang

**Aplikasi Ramadhan** adalah aplikasi web progresif (PWA) yang dirancang untuk membantu umat Muslim menjalankan ibadah selama bulan Ramadhan. Dibangun dengan teknologi modern dan antarmuka yang elegan berwarna gelap, aplikasi ini menyediakan fitur lengkap mulai dari jadwal sholat real-time, pembaca Al-Quran, penghitung tasbih digital, hingga pelacakan puasa harian.

Aplikasi ini dapat diinstal di perangkat mobile seperti aplikasi native — tanpa perlu melalui app store.

---

## ✨ Fitur Utama

### 🕌 Jadwal Sholat & Countdown
- Jadwal sholat harian berdasarkan **lokasi pengguna** (mendukung semua kota di Indonesia)
- **Countdown real-time** menuju waktu sholat berikutnya dengan progress bar animasi
- Pengaturan lokasi via modal pemilih kota

### 📖 Al-Quran Digital
- Daftar **114 surah** lengkap dengan metadata (jumlah ayat, tempat turun, arti)
- Fitur **pencarian surah** berdasarkan nama
- **Riwayat bacaan** — otomatis menyimpan terakhir dibaca (surah & ayat) ke database
- **Progress tracking** — menampilkan persentase Al-Quran yang telah dibaca

### 🎧 Murottal Al-Qur'an
- **Audio per ayat** — tombol play di setiap ayat, putar murottal individual
- **Audio full surah** — putar seluruh surah dalam satu klik
- **6 pilihan qari** — Abdullah Al-Juhany, Abdul Muhsin Al-Qasim, Abdurrahman as-Sudais, Ibrahim Al-Dossari, Misyari Rasyid Al-Afasi, Yasser Al-Dosari
- **Sticky audio player** — desain glassmorphism, muncul di atas bottom nav dengan play/pause, prev/next, seekbar
- **Auto-play** — otomatis lanjut ke ayat berikutnya
- **Highlight ayat aktif** — border glow animasi dan auto-scroll ke ayat yang sedang diputar
- Menggunakan API **equran.id/api/v2** (sama dengan fitur Al-Quran)

### 🤲 Doa Harian
- Koleksi doa-doa harian lengkap dengan **teks Arab, Latin, dan terjemahan**
- Fitur **pencarian** doa berdasarkan judul
- Tampilan **accordion** yang elegan untuk setiap doa

### 📿 Tasbih Digital
- Penghitung digital interaktif dengan tampilan **modal fullscreen**
- Otomatis menampilkan **dzikir yang sesuai**: Subhanallah (1-33), Alhamdulillah (34-66), Allahu Akbar (67-99), Lailahaillallah (100+)
- Tombol reset dan animasi smooth

### 🗓️ Kalender Puasa
- **Kalender 30 hari** Ramadhan interaktif
- Tandai hari puasa yang sudah dijalankan
- Data tersimpan di database per-user

### 🧭 Arah Kiblat
- Kompas digital untuk menemukan **arah kiblat**
- Menggunakan lokasi GPS perangkat

### 🔔 Sistem Notifikasi
- Notifikasi **Iftar** (buka puasa)
- Notifikasi **Imsak** (sahur)
- Pengingat **Tadarus** Al-Quran
- Pengingat mengisi **kalender puasa**

### 📝 Ayat Hari Ini
- **30 ayat pilihan** — satu untuk setiap hari Ramadhan
- Rotasi otomatis berdasarkan hari ke-berapa Ramadhan

### 👤 Profil & Autentikasi
- Sistem **registrasi & login** lengkap
- Profil pengguna dengan avatar
- Data ibadah tersimpan aman per-akun

---

## 🏗️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **UI** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + Custom Design System |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM 5.14](https://www.prisma.io/) |
| **Auth** | [NextAuth.js 4](https://next-auth.js.org/) + bcryptjs |
| **PWA** | Service Worker + Web App Manifest |
| **Font** | [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts) |
| **Icons** | [Font Awesome 6](https://fontawesome.com/) |

---

## 🎨 Design System

Aplikasi menggunakan **dark-mode design** yang konsisten dengan palet warna kustom:

| Token | Warna | Hex | Kegunaan |
|-------|-------|-----|----------|
| `r-cyan` | 🟢 Cyan | `#00FFD4` | Aksen, highlight, aktif state |
| `r-blue` | 🔵 Blue | `#5465FF` | CTA, gradien, tombol utama |
| `r-light` | ⚪ Light | `#D2DDFF` | Teks utama, border halus |
| `r-dark` | ⚫ Dark | `#050208` | Background utama |

---

## 📁 Struktur Proyek

```
ramadhan/
├── app/
│   ├── (auth)/                  # Grup rute autentikasi
│   │   ├── login/page.tsx       # Halaman login
│   │   └── register/page.tsx    # Halaman registrasi
│   ├── (main)/                  # Grup rute utama (terproteksi)
│   │   ├── layout.tsx           # Layout dengan Header, BottomNav, Modal
│   │   ├── page.tsx             # Beranda — countdown, stats, ayat hari ini
│   │   ├── quran/page.tsx       # Daftar surah & riwayat bacaan
│   │   ├── doa/page.tsx         # Doa-doa harian
│   │   ├── kalender/page.tsx    # Kalender puasa 30 hari
│   │   ├── kiblat/page.tsx      # Kompas arah kiblat
│   │   ├── jadwal-sholat/page.tsx # Jadwal sholat lengkap
│   │   └── profil/page.tsx      # Profil pengguna & logout
│   ├── api/                     # API Routes
│   │   ├── auth/                # NextAuth endpoint
│   │   ├── doa/route.ts         # Proxy API doa harian
│   │   ├── prayer-times/route.ts # Jadwal sholat berdasarkan kota
│   │   ├── puasa/route.ts       # CRUD log puasa harian
│   │   ├── qibla/route.ts       # Data arah kiblat
│   │   ├── quran-history/route.ts # Riwayat bacaan Quran
│   │   ├── ramadan-info/route.ts  # Info hari Ramadhan
│   │   ├── register/route.ts   # Registrasi user baru
│   │   └── user/               # Update data user
│   ├── components/              # Komponen UI
│   │   ├── AudioPlayer.tsx      # Sticky audio player murottal
│   │   ├── AuthProvider.tsx     # NextAuth session provider
│   │   ├── BottomNav.tsx        # Navigasi bawah mobile
│   │   ├── CalendarGrid.tsx     # Grid kalender puasa
│   │   ├── EidCountdown.tsx     # Countdown Hari Raya Idul Fitri
│   │   ├── Header.tsx           # Header dengan lokasi & notifikasi
│   │   ├── HeroCountdown.tsx    # Countdown sholat berikutnya
│   │   ├── LocationModal.tsx    # Modal pemilih kota
│   │   ├── NotificationManager.tsx # Manager notifikasi
│   │   ├── NotificationPanel.tsx   # Panel daftar notifikasi
│   │   ├── PrayerTimesGrid.tsx  # Grid jadwal sholat
│   │   ├── QiblaCompass.tsx     # Kompas kiblat
│   │   ├── StatsCard.tsx        # Ringkasan ibadah
│   │   └── TasbihModal.tsx      # Modal tasbih digital
│   ├── context/                 # React Context Providers
│   │   ├── PrayerTimesContext.tsx # State jadwal sholat & kota
│   │   └── PuasaContext.tsx     # State puasa & hari Ramadhan
│   ├── globals.css              # Global CSS & design tokens
│   └── layout.tsx               # Root layout, metadata, PWA config
├── lib/                         # Utilities & helpers
│   ├── auth.ts                  # Konfigurasi NextAuth
│   ├── prisma.ts                # Prisma client singleton
│   ├── quran.ts                 # Tipe & utilitas Al-Quran
│   └── quran-ayat-counts.ts     # Data jumlah ayat per surah
├── prisma/
│   └── schema.prisma            # Database schema (User, PuasaLog, QuranHistory)
├── public/
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service worker
│   ├── icon-192x192.png         # App icon (192px)
│   └── icon-512x512.png         # App icon (512px)
├── middleware.ts                 # Auth middleware (proteksi rute)
├── tailwind.config.ts           # Konfigurasi Tailwind + design tokens
├── next.config.mjs              # Konfigurasi Next.js
└── package.json
```

---

## 🗄️ Database Schema

Aplikasi menggunakan **3 model** utama di PostgreSQL:

```prisma
model User {
  id           String         @id @default(cuid())
  name         String
  email        String         @unique
  password     String         // bcrypt hashed
  city         String         @default("Jakarta, Indonesia")
  createdAt    DateTime       @default(now())
  puasaLogs    PuasaLog[]
  quranHistory QuranHistory?
}

model PuasaLog {
  id     String  @id @default(cuid())
  userId String
  day    Int     // Hari ke-1 s/d 30 Ramadhan
  fasted Boolean @default(false)
  @@unique([userId, day])
}

model QuranHistory {
  id         String   @id @default(cuid())
  userId     String   @unique
  surahNomor Int
  surahNama  String
  ayatNomor  Int
  updatedAt  DateTime @updatedAt
}
```

---

## 🚀 Memulai

### Prasyarat

- **Node.js** 18+
- **PostgreSQL** database
- **npm** atau **yarn**

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/Aldikurniawan19/ramadhan-app.git
cd ramadhan-app

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
```

### Konfigurasi Environment

Buat file `.env` di root proyek:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ramadhan_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push

# (Opsional) Buka Prisma Studio untuk melihat data
npx prisma studio
```

### Menjalankan Aplikasi

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Buka **[http://localhost:3000](http://localhost:3000)** di browser.

---

## 📱 Instalasi PWA

Aplikasi ini mendukung instalasi sebagai PWA di perangkat mobile:

1. Buka aplikasi di **Chrome / Safari**
2. Tap menu **⋮** → **"Add to Home Screen"** (Android) atau **Share → "Add to Home Screen"** (iOS)
3. Aplikasi akan tampil dan berjalan seperti **native app** — fullscreen tanpa address bar

---

## 🛡️ Keamanan

- **Password hashing** menggunakan bcryptjs
- **Session-based auth** via NextAuth.js dengan JWT
- **Route protection** via middleware — semua halaman utama memerlukan login
- **Cascade delete** — menghapus user juga menghapus semua data terkait

---

## 📄 API Routes

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/register` | Registrasi pengguna baru |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth authentication |
| `GET` | `/api/prayer-times?city=...` | Jadwal sholat berdasarkan kota |
| `GET` | `/api/ramadan-info` | Info hari Ramadhan saat ini |
| `GET/POST` | `/api/puasa` | Baca/tulis log puasa harian |
| `GET` | `/api/doa` | Daftar doa-doa harian |
| `GET` | `/api/qibla` | Data arah kiblat |
| `GET/POST` | `/api/quran-history` | Riwayat bacaan Al-Quran |
| `PATCH` | `/api/user` | Update data user (kota, dll) |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. **Fork** repository ini
2. Buat **branch** fitur (`git checkout -b fitur/fitur-baru`)
3. **Commit** perubahan (`git commit -m 'Menambah fitur baru'`)
4. **Push** ke branch (`git push origin fitur/fitur-baru`)
5. Buat **Pull Request**

---

## 📜 Lisensi

Proyek ini dibuat untuk keperluan pribadi dan edukasi.

---

<p align="center">
  Dibuat dengan ❤️ untuk bulan Ramadhan 🌙
</p>

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { id: 'home', label: 'Beranda', href: '/', icon: 'fa-solid fa-house' },
  { id: 'quran', label: 'Quran', href: '/quran', icon: 'fa-solid fa-book-open' },
  { id: 'kalender', label: 'Kalender', href: '/kalender', icon: 'fa-regular fa-calendar-days' },
  { id: 'profil', label: 'Profil', href: '/profil', icon: 'fa-regular fa-user' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 w-full bg-r-dark/95 backdrop-blur-md border-t border-r-light/10 z-20">
      <div className="max-w-5xl mx-auto px-6 py-4 pb-8 sm:pb-6">
        <ul className="flex justify-between items-center relative">
          {/* Beranda */}
          <li>
            <Link
              href="/"
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                isActive('/') ? 'text-r-cyan' : 'text-r-light/40 hover:text-r-cyan'
              }`}
            >
              <i className="fa-solid fa-house text-xl mb-1"></i>
              <span className="text-[10px] md:text-xs font-medium">Beranda</span>
            </Link>
          </li>

          {/* Quran */}
          <li>
            <Link
              href="/quran"
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                isActive('/quran') ? 'text-r-cyan' : 'text-r-light/40 hover:text-r-cyan'
              }`}
            >
              <i className="fa-solid fa-book-open text-xl mb-1"></i>
              <span className="text-[10px] md:text-xs font-medium">Quran</span>
            </Link>
          </li>

          {/* Floating Center Mosque Button */}
          <li className="relative -top-5 md:-top-7">
            <Link
              href="/"
              className="w-14 h-14 md:w-16 md:h-16 bg-r-blue rounded-full flex items-center justify-center text-white shadow-[0_5px_20px_rgba(84,101,255,0.4)] hover:scale-105 transition-transform border-4 border-r-dark"
            >
              <i className="fa-solid fa-mosque text-xl md:text-2xl"></i>
            </Link>
          </li>

          {/* Kalender */}
          <li>
            <Link
              href="/kalender"
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                isActive('/kalender') ? 'text-r-cyan' : 'text-r-light/40 hover:text-r-cyan'
              }`}
            >
              <i className="fa-regular fa-calendar-days text-xl mb-1"></i>
              <span className="text-[10px] md:text-xs font-medium">Kalender</span>
            </Link>
          </li>

          {/* Profil */}
          <li>
            <Link
              href="/profil"
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                isActive('/profil') ? 'text-r-cyan' : 'text-r-light/40 hover:text-r-cyan'
              }`}
            >
              <i className="fa-regular fa-user text-xl mb-1"></i>
              <span className="text-[10px] md:text-xs font-medium">Profil</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

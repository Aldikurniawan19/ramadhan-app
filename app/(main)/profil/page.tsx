'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const userName = session?.user?.name || 'Hamba Allah';
  const userEmail = session?.user?.email || '';

  return (
    <div className="pb-6 px-6">
      <div className="max-w-2xl mx-auto w-full">

        {/* Avatar */}
        <div className="flex flex-col items-center mt-6 md:mt-10 mb-8 md:mb-12">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-r-blue/20 rounded-full border-2 border-r-cyan flex items-center justify-center mb-4 relative shadow-[0_0_20px_rgba(0,255,212,0.2)]">
            <i className="fa-solid fa-user text-4xl md:text-6xl text-r-cyan"></i>
            <button className="absolute bottom-0 right-0 md:right-2 md:bottom-2 w-8 h-8 md:w-10 md:h-10 bg-r-blue rounded-full flex items-center justify-center text-white border-2 border-[#1a1b26] hover:scale-110 transition-transform cursor-pointer">
              <i className="fa-solid fa-pen text-xs md:text-sm"></i>
            </button>
          </div>
          <h2 className="text-xl md:text-3xl font-semibold text-white">{userName}</h2>
          <p className="text-r-light/60 text-sm md:text-base mt-1">{userEmail}</p>
        </div>

        {/* Menu List */}
        <div className="bg-r-light/5 border border-r-light/10 rounded-2xl overflow-hidden flex flex-col">
          {[
            { icon: 'fa-regular fa-bell', label: 'Pengaturan Notifikasi' },
            { icon: 'fa-solid fa-sliders', label: 'Preferensi Aplikasi' },
            { icon: 'fa-regular fa-circle-question', label: 'Bantuan & FAQ' },
          ].map((item, i) => (
            <button
              key={i}
              className="flex items-center justify-between p-4 md:p-6 hover:bg-r-light/10 transition border-b border-r-light/5"
            >
              <div className="flex items-center gap-3 md:gap-5">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-r-light/10 flex items-center justify-center text-r-light/80">
                  <i className={`${item.icon} md:text-lg`}></i>
                </div>
                <span className="text-sm md:text-base text-white font-medium">{item.label}</span>
              </div>
              <i className="fa-solid fa-chevron-right text-xs md:text-sm text-r-light/40"></i>
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-between p-4 md:p-6 hover:bg-red-500/10 transition"
          >
            <div className="flex items-center gap-3 md:gap-5">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                <i className="fa-solid fa-arrow-right-from-bracket md:text-lg"></i>
              </div>
              <span className="text-sm md:text-base text-red-400 font-medium">Keluar</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}

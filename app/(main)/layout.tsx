import { PuasaProvider } from '@/app/context/PuasaContext';
import { PrayerTimesProvider } from '@/app/context/PrayerTimesContext';
import Header from '@/app/components/Header';
import BottomNav from '@/app/components/BottomNav';
import TasbihModal from '@/app/components/TasbihModal';
import LocationModal from '@/app/components/LocationModal';
import NotificationPanel from '@/app/components/NotificationPanel';
import NotificationManager from '@/app/components/NotificationManager';
import { AdhanProvider } from '@/app/context/AdhanContext';
import AdhanSettingsModal from '@/app/components/AdhanSettingsModal';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PuasaProvider>
      <PrayerTimesProvider>
        <AdhanProvider>
          <div className="w-full flex flex-col relative bg-r-dark" style={{ minHeight: '100dvh' }}>
            <Header />
            <main className="flex-1 w-full relative overflow-x-hidden" style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))' }}>
              {children}
              {/* Footer */}
              <footer className="mt-8 pb-4 px-6">
                <div className="max-w-5xl mx-auto text-center">
                  <p className="text-r-light/30 text-xs">
                    © {new Date().getFullYear()} <a href="https://github.com/Aldikurniawan19/ramadhan-app.git" target="_blank" rel="noopener noreferrer" className="text-r-cyan/50 hover:text-r-cyan hover:underline font-medium transition-colors">Ramadhan App</a> by <a href="https://github.com/aldikurniawan19" target="_blank" rel="noopener noreferrer" className="text-r-cyan/50 hover:text-r-cyan hover:underline font-medium transition-colors">Aldi Kurniawan</a>
                  </p>
                </div>
              </footer>
            </main>
            <BottomNav />
            <TasbihModal />
            <LocationModal />
            <NotificationPanel />
            <NotificationManager />
            <AdhanSettingsModal />
          </div>
        </AdhanProvider>
      </PrayerTimesProvider>
    </PuasaProvider>
  );
}

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

import { PuasaProvider } from '@/app/context/PuasaContext';
import { PrayerTimesProvider } from '@/app/context/PrayerTimesContext';
import Header from '@/app/components/Header';
import BottomNav from '@/app/components/BottomNav';
import TasbihModal from '@/app/components/TasbihModal';
import LocationModal from '@/app/components/LocationModal';
import NotificationPanel from '@/app/components/NotificationPanel';
import NotificationManager from '@/app/components/NotificationManager';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PuasaProvider>
      <PrayerTimesProvider>
        <div className="w-full min-h-screen flex flex-col relative bg-r-dark">
          <Header />
          <main className="flex-1 w-full pb-28 relative overflow-x-hidden">
            {children}
          </main>
          <BottomNav />
          <TasbihModal />
          <LocationModal />
          <NotificationPanel />
          <NotificationManager />
        </div>
      </PrayerTimesProvider>
    </PuasaProvider>
  );
}

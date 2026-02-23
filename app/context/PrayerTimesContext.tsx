'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface PrayerTime {
  id: string;
  name: string;
  time: string;
  icon: string;
}

interface PrayerTimesContextValue {
  prayerData: PrayerTime[];
  city: string;
  isLoading: boolean;
  refreshPrayerTimes: () => Promise<void>;
}

const DEFAULT_PRAYER_DATA: PrayerTime[] = [
  { id: 'imsak', name: 'Imsak', time: '04:28', icon: 'fa-cloud-moon' },
  { id: 'subuh', name: 'Subuh', time: '04:38', icon: 'fa-moon' },
  { id: 'dzuhur', name: 'Dzuhur', time: '11:57', icon: 'fa-sun' },
  { id: 'ashar', name: 'Ashar', time: '15:13', icon: 'fa-cloud-sun' },
  { id: 'maghrib', name: 'Maghrib', time: '18:02', icon: 'fa-sunset' },
  { id: 'isya', name: 'Isya', time: '19:12', icon: 'fa-star-and-crescent' },
];

const PrayerTimesContext = createContext<PrayerTimesContextValue>({
  prayerData: DEFAULT_PRAYER_DATA,
  city: 'Jakarta, Indonesia',
  isLoading: true,
  refreshPrayerTimes: async () => {},
});

export function usePrayerTimes() {
  return useContext(PrayerTimesContext);
}

export function PrayerTimesProvider({ children }: { children: ReactNode }) {
  const [prayerData, setPrayerData] = useState<PrayerTime[]>(DEFAULT_PRAYER_DATA);
  const [city, setCity] = useState('Jakarta, Indonesia');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrayerTimes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/prayer-times');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.prayerTimes?.length) {
        setPrayerData(data.prayerTimes);
      }
      if (data.city) {
        setCity(data.city);
      }
    } catch (err) {
      console.error('Failed to fetch prayer times:', err);
      // Keep default data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  return (
    <PrayerTimesContext.Provider value={{ prayerData, city, isLoading, refreshPrayerTimes: fetchPrayerTimes }}>
      {children}
    </PrayerTimesContext.Provider>
  );
}

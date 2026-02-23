'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface RamadanInfo {
  isRamadan: boolean;
  hijriDay: number;
  hijriYear: string;
  ramadanStartDayOfWeek: number; // 0=Sun ... 6=Sat
  ramadanDays: number;
}

interface PuasaContextType {
  puasaData: boolean[];
  togglePuasa: (index: number) => void;
  currentHariRamadhan: number;
  isLoading: boolean;
  ramadanInfo: RamadanInfo;
  ramadanLoading: boolean;
}

const DEFAULT_RAMADAN_INFO: RamadanInfo = {
  isRamadan: true,
  hijriDay: 1,
  hijriYear: '1447',
  ramadanStartDayOfWeek: 3,
  ramadanDays: 30,
};

const PuasaContext = createContext<PuasaContextType | null>(null);

export function PuasaProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [ramadanInfo, setRamadanInfo] = useState<RamadanInfo>(DEFAULT_RAMADAN_INFO);
  const [ramadanLoading, setRamadanLoading] = useState(true);

  const [puasaData, setPuasaData] = useState<boolean[]>(() => {
    return Array(30).fill(false);
  });

  // Fetch Ramadan info from API
  useEffect(() => {
    const fetchRamadanInfo = async () => {
      try {
        const res = await fetch('/api/ramadan-info');
        if (res.ok) {
          const data = await res.json();
          setRamadanInfo({
            isRamadan: data.isRamadan,
            hijriDay: data.hijriDay || 1,
            hijriYear: data.hijriYear || '1447',
            ramadanStartDayOfWeek: data.ramadanStartDayOfWeek ?? 3,
            ramadanDays: data.ramadanDays || 30,
          });
        }
      } catch (error) {
        console.error('Failed to fetch Ramadan info:', error);
      } finally {
        setRamadanLoading(false);
      }
    };

    fetchRamadanInfo();
  }, []);

  const currentHariRamadhan = ramadanInfo.hijriDay;

  // Fetch puasa data from API on mount
  useEffect(() => {
    if (!session?.user) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/puasa');
        if (res.ok) {
          const data = await res.json();
          setPuasaData(data.puasaData);
        }
      } catch (error) {
        console.error('Failed to fetch puasa data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const togglePuasa = useCallback(async (index: number) => {
    const newValue = !puasaData[index];

    // Optimistic update
    setPuasaData((prev) => {
      const next = [...prev];
      next[index] = newValue;
      return next;
    });

    // Persist to API
    try {
      await fetch('/api/puasa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: index + 1, fasted: newValue }),
      });
    } catch (error) {
      console.error('Failed to save puasa data:', error);
      // Revert on error
      setPuasaData((prev) => {
        const next = [...prev];
        next[index] = !newValue;
        return next;
      });
    }
  }, [puasaData]);

  return (
    <PuasaContext.Provider value={{ puasaData, togglePuasa, currentHariRamadhan, isLoading, ramadanInfo, ramadanLoading }}>
      {children}
    </PuasaContext.Provider>
  );
}

export function usePuasa() {
  const ctx = useContext(PuasaContext);
  if (!ctx) throw new Error('usePuasa must be used within PuasaProvider');
  return ctx;
}

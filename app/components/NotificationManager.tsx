'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { usePrayerTimes } from '@/app/context/PrayerTimesContext';
import { usePuasa } from '@/app/context/PuasaContext';
import { useAdhan } from '@/app/context/AdhanContext';
import { addNotification, type AppNotification } from './NotificationPanel';

// localStorage key prefix to track sent notifications per day
const STORAGE_KEY = 'ramadan-notifs-sent';

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getSentToday(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const data = JSON.parse(raw);
    if (data.date !== getTodayKey()) return new Set();
    return new Set(data.sent || []);
  } catch {
    return new Set();
  }
}

function markSentToday(type: string) {
  const sent = getSentToday();
  sent.add(type);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    date: getTodayKey(),
    sent: Array.from(sent),
  }));
}

function parseTime(timeStr: string): { h: number; m: number } | null {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return { h, m };
}

/** Convert HH:MM string to total minutes since midnight */
function timeToMinutes(timeStr: string): number | null {
  const parsed = parseTime(timeStr);
  if (!parsed) return null;
  return parsed.h * 60 + parsed.m;
}

function currentMinutesSinceMidnight(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function currentHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/** Check if current time is within ±1 minute of a trigger time (handles midnight wrap) */
function isWithinTriggerWindow(triggerTimeStr: string): boolean {
  const triggerMin = timeToMinutes(triggerTimeStr);
  if (triggerMin === null) return false;
  const nowMin = currentMinutesSinceMidnight();
  const diff = Math.abs(nowMin - triggerMin);
  // Handle midnight wrap (e.g. trigger at 23:59, now at 00:00 → diff = 1439, actual = 1)
  return diff <= 1 || diff >= 1439;
}

/** Subtract N minutes from a time string and return new "HH:MM" */
function subtractMinutes(timeStr: string, minutes: number): string | null {
  const parsed = parseTime(timeStr);
  if (!parsed) return null;
  let totalMin = parsed.h * 60 + parsed.m - minutes;
  if (totalMin < 0) totalMin += 1440; // wrap around midnight
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Request browser notification permission
function requestNotifPermission() {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function sendBrowserNotification(title: string, body: string, icon?: string) {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: title, // prevents duplicates
    });
  } catch {
    // Silent fail (e.g. in some mobile browsers)
  }
}

interface NotifConfig {
  type: AppNotification['type'];
  id: string; // unique id for dedup per day (e.g. 'sholat-subuh')
  triggerTime: string; // "HH:MM"
  title: string;
  message: string;
  icon: string;
  href: string;
}

interface QuranHistoryData {
  surahNomor: number;
  surahNama: string;
  ayatNomor: number;
}

export default function NotificationManager() {
  const { prayerData, isLoading: prayerLoading } = usePrayerTimes();
  const { currentHariRamadhan, puasaData } = usePuasa();
  const { playAdhan, adhanEnabled } = useAdhan();
  const hasRequestedPermission = useRef(false);
  const [quranHistory, setQuranHistory] = useState<QuranHistoryData | null>(null);
  const quranHistoryFetched = useRef(false);

  // Request permission on mount
  useEffect(() => {
    if (!hasRequestedPermission.current) {
      hasRequestedPermission.current = true;
      setTimeout(requestNotifPermission, 3000);
    }
  }, []);

  // Fetch Quran reading history once on mount
  useEffect(() => {
    if (quranHistoryFetched.current) return;
    quranHistoryFetched.current = true;

    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/quran-history');
        if (res.ok) {
          const json = await res.json();
          if (json.history) {
            setQuranHistory(json.history);
          }
        }
      } catch {
        // silently fail — history is non-critical
      }
    };
    fetchHistory();
  }, []);

  const checkAndSendNotifications = useCallback(() => {
    if (prayerLoading) return;

    const now = currentHHMM();
    const sent = getSentToday();

    // Find prayer times
    const imsakEntry = prayerData.find((p) => p.id === 'imsak');
    const subuhEntry = prayerData.find((p) => p.id === 'subuh');
    const dzuhurEntry = prayerData.find((p) => p.id === 'dzuhur');
    const asharEntry = prayerData.find((p) => p.id === 'ashar');
    const maghribEntry = prayerData.find((p) => p.id === 'maghrib');
    const isyaEntry = prayerData.find((p) => p.id === 'isya');

    // Build notification configs
    const notifConfigs: NotifConfig[] = [];

    // 1. Imsak warning (5 min before)
    if (imsakEntry) {
      const warnTime = subtractMinutes(imsakEntry.time, 5);
      if (warnTime) {
        notifConfigs.push({
          type: 'imsak',
          id: 'imsak',
          triggerTime: warnTime,
          title: 'Waktu Imsak Hampir Tiba ⏰',
          message: `5 menit lagi waktu imsak (${imsakEntry.time}). Segera selesaikan sahur! 🌙`,
          icon: 'fa-solid fa-cloud-moon',
          href: '/',
        });
      }
    }

    // 2. Iftar (Maghrib time)
    if (maghribEntry) {
      notifConfigs.push({
        type: 'iftar',
        id: 'iftar',
        triggerTime: maghribEntry.time,
        title: 'Waktunya Berbuka Puasa! 🌙',
        message: `Alhamdulillah, waktu berbuka puasa telah tiba (${maghribEntry.time}). Selamat berbuka!`,
        icon: 'fa-solid fa-utensils',
        href: '/',
      });
    }

    // 3. Prayer time notifications for all 5 prayers
    const prayerNotifs: Array<{ entry: typeof subuhEntry; name: string; idSuffix: string; emoji: string }> = [
      { entry: subuhEntry, name: 'Subuh', idSuffix: 'subuh', emoji: '🌅' },
      { entry: dzuhurEntry, name: 'Dzuhur', idSuffix: 'dzuhur', emoji: '☀️' },
      { entry: asharEntry, name: 'Ashar', idSuffix: 'ashar', emoji: '🌤️' },
      { entry: maghribEntry, name: 'Maghrib', idSuffix: 'maghrib', emoji: '🌇' },
      { entry: isyaEntry, name: 'Isya', idSuffix: 'isya', emoji: '🌙' },
    ];

    for (const prayer of prayerNotifs) {
      if (prayer.entry) {
        notifConfigs.push({
          type: 'sholat',
          id: `sholat-${prayer.idSuffix}`,
          triggerTime: prayer.entry.time,
          title: `Waktu Sholat ${prayer.name} ${prayer.emoji}`,
          message: `Waktu sholat ${prayer.name} telah tiba (${prayer.entry.time}). Ayo tunaikan sholat! 🕌`,
          icon: 'fa-solid fa-mosque',
          href: '/',
        });
      }
    }

    // 4. Tadarus reminder (20:00) — with last-read Quran data
    const tadarusMessage = quranHistory
      ? `Lanjutkan membaca Surah ${quranHistory.surahNama} ayat ${quranHistory.ayatNomor}. Setiap huruf bernilai pahala! 📖`
      : 'Sempatkan membaca Al-Quran malam ini. Setiap huruf bernilai pahala! 📖';
    const tadarusHref = quranHistory
      ? `/quran/${quranHistory.surahNomor}`
      : '/quran';

    notifConfigs.push({
      type: 'tadarus',
      id: 'tadarus',
      triggerTime: '20:00',
      title: 'Yuk Lanjutkan Tadarus! 📖',
      message: tadarusMessage,
      icon: 'fa-solid fa-book-quran',
      href: tadarusHref,
    });

    // 5. Puasa calendar reminder (07:00)
    const todayPuasa = puasaData[currentHariRamadhan - 1];
    if (!todayPuasa) {
      notifConfigs.push({
        type: 'puasa',
        id: 'puasa',
        triggerTime: '07:00',
        title: 'Tandai Puasa Hari Ini ✅',
        message: `Hari ke-${currentHariRamadhan} Ramadhan. Sudah puasa? Tandai di kalender!`,
        icon: 'fa-solid fa-calendar-check',
        href: '/kalender',
      });
    }

    // Check each config using ±1 minute window
    for (const config of notifConfigs) {
      if (sent.has(config.id)) continue;
      if (!isWithinTriggerWindow(config.triggerTime)) continue;

      // Match! Send notification
      const notif: AppNotification = {
        id: `${config.id}-${Date.now()}`,
        type: config.type,
        title: config.title,
        message: config.message,
        icon: config.icon,
        iconColor: '',
        href: config.href,
        time: now,
        read: false,
      };

      addNotification(notif);
      sendBrowserNotification(config.title, config.message);
      markSentToday(config.id);

      // Play Adhan if it's a prayer notification and adhan is enabled for this prayer
      if (config.type === 'sholat' && config.id.startsWith('sholat-')) {
        const prayerName = config.id.replace('sholat-', ''); // e.g. 'subuh'
        if (adhanEnabled[prayerName]) {
          playAdhan();
        }
      }
    }
  }, [prayerData, prayerLoading, puasaData, currentHariRamadhan, quranHistory, playAdhan, adhanEnabled]);

  // Poll every 30 seconds
  useEffect(() => {
    checkAndSendNotifications();
    const interval = setInterval(checkAndSendNotifications, 30_000);
    return () => clearInterval(interval);
  }, [checkAndSendNotifications]);

  // This is a headless component — no UI
  return null;
}

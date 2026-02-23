'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePrayerTimes } from '@/app/context/PrayerTimesContext';
import { usePuasa } from '@/app/context/PuasaContext';
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

function currentHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
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
  triggerTime: string; // "HH:MM"
  title: string;
  message: string;
  icon: string;
  href: string;
}

export default function NotificationManager() {
  const { prayerData, isLoading: prayerLoading } = usePrayerTimes();
  const { currentHariRamadhan, puasaData } = usePuasa();
  const hasRequestedPermission = useRef(false);

  // Request permission on mount
  useEffect(() => {
    if (!hasRequestedPermission.current) {
      hasRequestedPermission.current = true;
      // Delay permission request slightly
      setTimeout(requestNotifPermission, 3000);
    }
  }, []);

  const checkAndSendNotifications = useCallback(() => {
    if (prayerLoading) return;

    const now = currentHHMM();
    const sent = getSentToday();

    // Find imsak and maghrib times
    const imsakEntry = prayerData.find((p) => p.id === 'imsak');
    const maghribEntry = prayerData.find((p) => p.id === 'maghrib');

    // Build notification configs
    const notifConfigs: NotifConfig[] = [];

    // 1. Imsak warning (10 min before)
    if (imsakEntry) {
      const parsed = parseTime(imsakEntry.time);
      if (parsed) {
        let warnH = parsed.h;
        let warnM = parsed.m - 10;
        if (warnM < 0) { warnM += 60; warnH -= 1; }
        if (warnH < 0) warnH += 24;
        const warnTime = `${String(warnH).padStart(2, '0')}:${String(warnM).padStart(2, '0')}`;

        notifConfigs.push({
          type: 'imsak',
          triggerTime: warnTime,
          title: 'Waktu Imsak Hampir Tiba',
          message: `10 menit lagi waktu imsak (${imsakEntry.time}). Segera selesaikan sahur! 🌙`,
          icon: 'fa-solid fa-cloud-moon',
          href: '/',
        });
      }
    }

    // 2. Iftar (Maghrib time)
    if (maghribEntry) {
      notifConfigs.push({
        type: 'iftar',
        triggerTime: maghribEntry.time,
        title: 'Waktunya Berbuka Puasa! 🌙',
        message: `Alhamdulillah, waktu berbuka puasa telah tiba (${maghribEntry.time}). Selamat berbuka!`,
        icon: 'fa-solid fa-utensils',
        href: '/',
      });
    }

    // 3. Tadarus reminder (20:00)
    notifConfigs.push({
      type: 'tadarus',
      triggerTime: '20:00',
      title: 'Yuk Lanjutkan Tadarus! 📖',
      message: 'Sempatkan membaca Al-Quran malam ini. Setiap huruf bernilai pahala!',
      icon: 'fa-solid fa-book-quran',
      href: '/quran',
    });

    // 4. Puasa calendar reminder (07:00)
    const todayPuasa = puasaData[currentHariRamadhan - 1];
    if (!todayPuasa) {
      notifConfigs.push({
        type: 'puasa',
        triggerTime: '07:00',
        title: 'Tandai Puasa Hari Ini ✅',
        message: `Hari ke-${currentHariRamadhan} Ramadhan. Sudah puasa? Tandai di kalender!`,
        icon: 'fa-solid fa-calendar-check',
        href: '/kalender',
      });
    }

    // Check each config
    for (const config of notifConfigs) {
      if (sent.has(config.type)) continue;
      if (now !== config.triggerTime) continue;

      // Match! Send notification
      const notif: AppNotification = {
        id: `${config.type}-${Date.now()}`,
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
      markSentToday(config.type);
    }
  }, [prayerData, prayerLoading, puasaData, currentHariRamadhan]);

  // Poll every 30 seconds
  useEffect(() => {
    checkAndSendNotifications();
    const interval = setInterval(checkAndSendNotifications, 30_000);
    return () => clearInterval(interval);
  }, [checkAndSendNotifications]);

  // This is a headless component — no UI
  return null;
}

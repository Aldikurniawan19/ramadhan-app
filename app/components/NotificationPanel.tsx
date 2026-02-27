'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export interface AppNotification {
  id: string;
  type: 'iftar' | 'imsak' | 'tadarus' | 'puasa' | 'sholat';
  title: string;
  message: string;
  icon: string;
  iconColor: string;
  href: string;
  time: string; // display time "HH:MM"
  read: boolean;
}

// Global state shared between NotificationManager and NotificationPanel
let notificationsStore: AppNotification[] = [];
let listeners: Array<() => void> = [];

export function getNotifications() {
  return notificationsStore;
}

export function addNotification(notif: AppNotification) {
  notificationsStore = [notif, ...notificationsStore].slice(0, 20); // keep last 20
  listeners.forEach((fn) => fn());
}

export function markAllRead() {
  notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
  listeners.forEach((fn) => fn());
}

export function clearNotifications() {
  notificationsStore = [];
  listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(notificationsStore);

  useEffect(() => {
    const unsub = subscribe(() => setNotifications([...notificationsStore]));
    return unsub;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  return { notifications, unreadCount };
}

// Open/close control
let openPanelFn: (() => void) | null = null;

export function openNotificationPanel() {
  openPanelFn?.();
}

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    openPanelFn = () => {
      if (isOpen) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
        // Mark all as read when panel opens
        setTimeout(() => markAllRead(), 500);
      }
    };
    return () => { openPanelFn = null; };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  if (!isOpen) return null;

  const iconMap: Record<string, { bg: string; text: string }> = {
    iftar: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
    imsak: { bg: 'bg-purple-500/15', text: 'text-purple-400' },
    tadarus: { bg: 'bg-r-blue/15', text: 'text-r-blue' },
    puasa: { bg: 'bg-r-cyan/15', text: 'text-r-cyan' },
    sholat: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  };

  return (
    <>
      {/* Backdrop — matches location modal */}
      <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* Dropdown Panel */}
      <div
        ref={panelRef}
        className="fixed top-20 right-4 md:right-8 z-[100] w-[calc(100%-2rem)] max-w-sm bg-[#1a1b2e]/95 backdrop-blur-xl border border-white/[0.1] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-dropdown"
        style={{ maxHeight: 'min(480px, calc(100vh - 8rem))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-bell text-r-cyan text-sm" />
            <h2 className="text-sm font-semibold text-white">Notifikasi</h2>
            {unreadCount > 0 && (
              <span className="bg-r-cyan/20 text-r-cyan text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-[11px] text-r-light/40 hover:text-red-400 transition px-2 py-1 rounded-lg hover:bg-white/5"
              >
                Hapus semua
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-r-light/50 hover:text-white hover:bg-white/10 transition"
            >
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <i className="fa-regular fa-bell-slash text-r-light/20 text-lg" />
              </div>
              <p className="text-sm text-r-light/40 mb-1">Belum ada notifikasi</p>
              <p className="text-[11px] text-r-light/25 leading-relaxed">
                Notifikasi akan muncul saat waktu imsak, berbuka, dan pengingat ibadah
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {notifications.map((notif) => {
                const style = iconMap[notif.type] || iconMap.puasa;
                return (
                  <Link
                    key={notif.id}
                    href={notif.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl transition hover:bg-white/5 ${
                      !notif.read ? 'bg-white/[0.03]' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <i className={`${notif.icon} ${style.text} text-xs`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-white">{notif.title}</span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-r-cyan shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-r-light/50 mt-0.5 line-clamp-2">{notif.message}</p>
                      <span className="text-[10px] text-r-light/30 mt-0.5 block">{notif.time}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-white/[0.06]">
          <p className="text-[10px] text-r-light/25 text-center">
            Notifikasi browser akan muncul otomatis saat waktu imsak & berbuka
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdownFadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

export interface DynamicEid {
  name: string;
  type: 'Idul Fitri' | 'Idul Adha';
  hijriYear: string;
  gregorianDate: string;
  targetTimestamp: number;
  isToday: boolean;
  icon: string;
  emoji: string;
}

export interface EidCountdownData {
  eid: DynamicEid;
  isToday: boolean;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export async function fetchNextEid(): Promise<DynamicEid> {
  const res = await fetch('/api/eid-info');
  if (!res.ok) throw new Error('Failed to fetch Eid info');
  const data = await res.json();
  if (!data.eid) throw new Error('Invalid Eid response');
  return data.eid;
}

export function calculateEidTimeLeft(targetTimestamp: number, nowMs: number = Date.now()) {
  const diff = targetTimestamp - nowMs;
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (diff <= 0 && diff > -oneDayMs) {
    return {
      isToday: true,
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    };
  }

  const remaining = Math.max(0, diff);
  return {
    isToday: false,
    timeLeft: {
      days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
      hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((remaining % (1000 * 60)) / 1000),
    },
  };
}

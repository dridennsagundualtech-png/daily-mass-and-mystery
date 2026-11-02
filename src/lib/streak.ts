import { dateKey } from "./liturgy";
import { readLocal, writeLocal, useLocal } from "./storage";

export const STREAK_KEY = "sc.prayedDays";

export function markPrayedToday(date = new Date()) {
  const days = readLocal<string[]>(STREAK_KEY, []);
  const k = dateKey(date);
  if (!days.includes(k)) writeLocal(STREAK_KEY, [...days, k]);
}

/** Consecutive days ending today (or yesterday, if today isn't marked yet). */
export function computeStreak(days: string[], today = new Date()): number {
  const set = new Set(days);
  const cur = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!set.has(dateKey(cur))) cur.setDate(cur.getDate() - 1);
  let n = 0;
  while (set.has(dateKey(cur))) {
    n++;
    cur.setDate(cur.getDate() - 1);
  }
  return n;
}

export function useStreak() {
  const [days] = useLocal<string[]>(STREAK_KEY, []);
  return { days, streak: computeStreak(days), prayedToday: days.includes(dateKey(new Date())) };
}

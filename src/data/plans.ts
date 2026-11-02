/**
 * Reading plans. Each plan is a list of days; each day is a list of
 * { book, chapter }. Plans here are generated from books.ts by spreading the
 * chapters evenly across the days. You may replace `days` with a hand-written list.
 */
import { BOOKS } from "./books";

export interface PlanReading {
  book: string;
  chapter: number;
}
export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  days: PlanReading[][];
}

function chaptersOf(ids: string[] | null): PlanReading[] {
  const list = ids ? BOOKS.filter((b) => ids.includes(b.id)) : BOOKS;
  return list.flatMap((b) => Array.from({ length: b.chapters }, (_, i) => ({ book: b.id, chapter: i + 1 })));
}

function spread(chapters: PlanReading[], dayCount: number): PlanReading[][] {
  return Array.from({ length: dayCount }, (_, d) =>
    chapters.slice(Math.floor((d * chapters.length) / dayCount), Math.floor(((d + 1) * chapters.length) / dayCount)),
  );
}

export const PLANS: ReadingPlan[] = [
  { id: "bible-year", name: "Bible in a Year", description: "All 73 books in 365 days.", days: spread(chaptersOf(null), 365) },
  { id: "gospels-30", name: "Gospels in 30 Days", description: "Matthew, Mark, Luke and John.", days: spread(chaptersOf(["MAT", "MRK", "LUK", "JHN"]), 30) },
  { id: "psalms-30", name: "Psalms in 30 Days", description: "Five psalms a day.", days: spread(chaptersOf(["PSA"]), 30) },
];

export const planById = (id: string) => PLANS.find((p) => p.id === id);

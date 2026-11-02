import { createFileRoute, Link, useHydrated } from "@tanstack/react-router";
import { Copy, Flame, Share2 } from "lucide-react";
import { Btn, Card, Page, btnClass } from "@/components/app-ui";
import { getToday } from "@/lib/today";
import { copyText, shareText } from "@/lib/share";
import { markPrayedToday, useStreak } from "@/lib/streak";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — Sinner's Cure" },
      { name: "description", content: "Today's Mass, the Church season, a daily verse and today's Rosary mysteries." },
      { property: "og:title", content: "Today — Sinner's Cure" },
      { property: "og:description", content: "Today's Mass, the Church season, a daily verse and today's Rosary mysteries." },
    ],
  }),
  component: TodayPage,
});

const DOT: Record<string, string> = {
  green: "bg-lit-green",
  violet: "bg-lit-violet",
  white: "bg-lit-white",
  red: "bg-lit-red",
  rose: "bg-lit-rose",
};

function TodayPage() {
  const hydrated = useHydrated();
  const { streak, prayedToday } = useStreak();
  if (!hydrated) return <Page title="Today">{null}</Page>;
  const t = getToday(new Date());
  const verseText = `"${t.verse.text}" — ${t.verse.ref}`;

  return (
    <Page eyebrow={t.dateLabel} title="Today">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 font-medium">
          <span className={`size-3.5 rounded-full border border-foreground/20 ${DOT[t.color]}`} aria-hidden />
          {t.season} · {t.colorName}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 font-medium">
          <Flame className="size-4 text-primary" aria-hidden /> {streak} day{streak === 1 ? "" : "s"}
        </span>
      </div>

      <div className="space-y-4">
        <Card>
          <p className="eyebrow">Today's Mass</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold leading-snug">{t.mass.celebration}</h2>
          <p className="mt-3">{t.mass.summary}</p>
          {t.mass.readings.length > 0 && (
            <dl className="mt-4 divide-y border-t">
              {t.mass.readings.map((r) => (
                <div key={r.label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted-foreground">{r.label}</dt>
                  <dd className="text-right font-medium">{r.citation}</dd>
                </div>
              ))}
            </dl>
          )}
        </Card>

        <Card>
          <p className="eyebrow">Verse of the day</p>
          <blockquote className="scripture mt-2">“{t.verse.text}”</blockquote>
          <p className="mt-2 font-medium text-primary">{t.verse.ref}</p>
          <div className="mt-4 flex gap-3">
            <Btn variant="outline" onClick={() => copyText(verseText)}>
              <Copy className="size-5" /> Copy
            </Btn>
            <Btn variant="outline" onClick={() => shareText(verseText)}>
              <Share2 className="size-5" /> Share
            </Btn>
          </div>
        </Card>

        <Card>
          <p className="eyebrow">Today's Rosary</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold">{t.mysteries.name}</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-6">
            {t.mysteries.mysteries.map((m) => (
              <li key={m.title}>{m.title}</li>
            ))}
          </ol>
          <Link to="/rosary" className={btnClass("primary", "mt-5 w-full")}>
            Start praying
          </Link>
        </Card>

        <Card>
          <p className="eyebrow">Daily prayer</p>
          <p className="mt-1">
            {prayedToday ? "You have prayed today. God bless you." : "Mark today when you have prayed to keep your streak."}
          </p>
          {!prayedToday && (
            <Btn variant="outline" className="mt-4 w-full" onClick={() => markPrayedToday()}>
              I prayed today
            </Btn>
          )}
        </Card>
      </div>
    </Page>
  );
}

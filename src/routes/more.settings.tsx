import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Moon, Sun } from "lucide-react";
import { Card, Page } from "@/components/app-ui";
import { TEXT_SCALES, useSettings } from "@/lib/settings";

export const Route = createFileRoute("/more/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Sinner's Cure" },
      { name: "description", content: "Choose light or dark theme, text size and a daily reminder time." },
      { property: "og:title", content: "Settings — Sinner's Cure" },
      { property: "og:description", content: "Choose light or dark theme, text size and a daily reminder time." },
    ],
  }),
  component: SettingsPage,
});

const SIZE_NAMES = ["Normal", "Large", "Larger", "Extra large", "Huge"];

function SettingsPage() {
  const { settings, update } = useSettings();
  const opt = (active: boolean) =>
    `flex min-h-14 items-center justify-center gap-2 rounded-xl border font-semibold ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`;

  return (
    <Page title="Settings">
      <Link to="/more" className="-mt-2 mb-4 inline-flex min-h-11 items-center gap-1 text-primary">
        <ChevronLeft className="size-5" /> More
      </Link>
      <div className="space-y-4">
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Theme</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className={opt(settings.theme === "light")} onClick={() => update({ theme: "light" })} aria-pressed={settings.theme === "light"}>
              <Sun className="size-5" /> Light
            </button>
            <button className={opt(settings.theme === "dark")} onClick={() => update({ theme: "dark" })} aria-pressed={settings.theme === "dark"}>
              <Moon className="size-5" /> Dark
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold">Text size</h2>
          <p className="mb-3 text-muted-foreground">Makes all text in the app bigger and easier to read.</p>
          <div className="grid gap-2">
            {TEXT_SCALES.map((s, i) => (
              <button key={s} className={`${opt(settings.textScale === s)} justify-between px-4`} onClick={() => update({ textScale: s })} aria-pressed={settings.textScale === s}>
                <span>{SIZE_NAMES[i]}</span>
                <span className="font-serif" style={{ fontSize: `${s * 1.1}rem` }}>
                  Aa
                </span>
              </button>
            ))}
          </div>
          <p className="scripture mt-4 border-t pt-4">In the beginning God created heaven, and earth.</p>
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold">Daily reminder</h2>
          <p className="mb-3 text-muted-foreground">Choose a time to be reminded to pray. Notifications will be connected later.</p>
          <div className="flex gap-3">
            <input
              type="time"
              value={settings.reminder}
              onChange={(e) => update({ reminder: e.target.value })}
              className="min-h-12 flex-1 rounded-xl border border-input bg-background px-4"
              aria-label="Reminder time"
            />
            {settings.reminder && (
              <button className="min-h-12 rounded-xl border px-4 font-semibold" onClick={() => update({ reminder: "" })}>
                Off
              </button>
            )}
          </div>
        </Card>
      </div>
    </Page>
  );
}

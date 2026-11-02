import { ChevronLeft, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { BeadRing } from "./bead-ring";
import { Btn, PrayerText } from "./app-ui";
import { beadAt, type Step } from "@/lib/steps";
import { markPrayedToday } from "@/lib/streak";

/** One-step-at-a-time bead prayer. Parent owns `index` (persisted). */
export function BeadPrayer({
  steps,
  index,
  onIndex,
  doneLabel,
}: {
  steps: Step[];
  index: number;
  onIndex: (i: number) => void;
  doneLabel: string;
}) {
  const finished = index >= steps.length;
  useEffect(() => {
    if (finished) markPrayedToday();
  }, [finished]);

  if (finished) {
    return (
      <div className="card-surface p-6 text-center">
        <BeadRing current={60} className="mx-auto w-40" />
        <h2 className="mt-4 font-serif text-2xl font-semibold">{doneLabel}</h2>
        <p className="mt-2 text-muted-foreground">Thanks be to God. Your prayer is counted in today's streak.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Btn variant="outline" onClick={() => onIndex(steps.length - 1)}>
            <ChevronLeft className="size-5" /> Back
          </Btn>
          <Btn onClick={() => onIndex(0)}>
            <RotateCcw className="size-5" /> Start over
          </Btn>
        </div>
      </div>
    );
  }

  const step = steps[index]!;
  const next = () => onIndex(index + 1);
  const pct = Math.round((index / steps.length) * 100);

  return (
    <div>
      <div className="flex items-center gap-4">
        <BeadRing current={beadAt(steps, index)} className="w-32 shrink-0" />
        <div className="min-w-0">
          <p className="eyebrow">
            Step {index + 1} of {steps.length} · {pct}%
          </p>
          {step.subtitle && <p className="mt-1 text-muted-foreground">{step.subtitle}</p>}
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={next}
        className="card-surface mt-4 block w-full p-5 text-left"
        aria-label="Tap to continue to the next prayer"
      >
        <h2 className="font-serif text-[1.65rem] font-semibold leading-tight text-primary">{step.title}</h2>
        {(step.scripture || step.fruit) && (
          <div className="mt-2 space-y-0.5 text-muted-foreground">
            {step.scripture && <p>Scripture: {step.scripture}</p>}
            {step.fruit && <p>Fruit of the mystery: {step.fruit}</p>}
          </div>
        )}
        <div className="mt-4">
          <PrayerText text={step.text} />
        </div>
        <p className="mt-5 text-center text-sm text-muted-foreground">Tap anywhere here to continue</p>
      </button>

      <div className="sticky bottom-20 mt-4 flex gap-3 bg-background py-2">
        <Btn variant="outline" onClick={() => onIndex(Math.max(0, index - 1))} disabled={index === 0} aria-label="Back">
          <ChevronLeft className="size-5" /> Back
        </Btn>
        <Btn className="flex-1" onClick={next}>
          {index === steps.length - 1 ? "Finish" : "Next"}
        </Btn>
      </div>
    </div>
  );
}

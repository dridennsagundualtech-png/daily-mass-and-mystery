import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Copy } from "lucide-react";
import { Btn, Page, PrayerText } from "@/components/app-ui";
import { prayerById } from "@/data/prayers";
import { copyText } from "@/lib/share";

export const Route = createFileRoute("/prayers/$id")({
  loader: ({ params }) => {
    const prayer = prayerById(params.id);
    if (!prayer) throw notFound();
    return prayer;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Prayer"} — Sinner's Cure` },
      { name: "description", content: `The full text of the ${loaderData?.title ?? "prayer"}.` },
      { property: "og:title", content: `${loaderData?.title ?? "Prayer"} — Sinner's Cure` },
      { property: "og:description", content: `The full text of the ${loaderData?.title ?? "prayer"}.` },
    ],
  }),
  component: PrayerPage,
});

function PrayerPage() {
  const p = Route.useLoaderData();
  return (
    <Page title={p.title}>
      <Link to="/prayers" className="-mt-2 mb-4 inline-flex min-h-11 items-center gap-1 text-primary">
        <ChevronLeft className="size-5" /> All prayers
      </Link>
      <article className="card-surface p-5">
        <PrayerText text={p.text} />
      </article>
      <Btn variant="outline" className="mt-4" onClick={() => copyText(`${p.title}\n\n${p.text}`)}>
        <Copy className="size-5" /> Copy
      </Btn>
    </Page>
  );
}

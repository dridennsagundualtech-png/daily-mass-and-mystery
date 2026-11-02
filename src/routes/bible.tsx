import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, ChevronLeft, ChevronRight, Copy, Minus, NotebookPen, Plus, Search, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Btn, Page, btnClass } from "@/components/app-ui";
import { BOOKS, bookById, type Testament } from "@/data/books";
import { getChapter, refLabel, searchBible, verseKey } from "@/data/bible";
import { HL_BG, HL_COLORS, useBookmarks, useHighlights, useLastRead, useNotes } from "@/lib/bible-store";
import { useSettings } from "@/lib/settings";
import { copyText, shareText } from "@/lib/share";

interface BibleSearch {
  book?: string;
  ch?: number;
  v?: number;
}

export const Route = createFileRoute("/bible")({
  validateSearch: (s: Record<string, unknown>): BibleSearch => ({
    book: typeof s.book === "string" ? s.book : undefined,
    ch: s.ch !== undefined ? Number(s.ch) || undefined : undefined,
    v: s.v !== undefined ? Number(s.v) || undefined : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Holy Bible — Sinner's Cure" },
      { name: "description", content: "All 73 books of the Catholic Bible with highlights, bookmarks, notes and search." },
      { property: "og:title", content: "Holy Bible — Sinner's Cure" },
      { property: "og:description", content: "All 73 books of the Catholic Bible with highlights, bookmarks, notes and search." },
    ],
  }),
  component: BiblePage,
});

function BiblePage() {
  const { book, ch, v } = Route.useSearch();
  const b = book ? bookById(book) : undefined;
  if (b && ch && ch >= 1 && ch <= b.chapters) return <Reader bookId={b.id} ch={ch} verse={v} />;
  return <Library />;
}

function Library() {
  const [last] = useLastRead();
  const [tab, setTab] = useState<Testament>("OT");
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const hits = searchBible(query);

  return (
    <Page title="Holy Bible">
      <label className="mb-4 flex min-h-12 items-center gap-2 rounded-xl border border-input bg-card px-4">
        <Search className="size-5 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the Bible"
          className="min-w-0 flex-1 bg-transparent py-3 outline-none"
          aria-label="Search the Bible"
        />
      </label>

      {query.trim().length >= 2 ? (
        <div className="space-y-2">
          <p className="text-muted-foreground">{hits.length} result{hits.length === 1 ? "" : "s"}</p>
          {hits.map((h) => {
            const [bk, c, vv] = h.key.split(".");
            return (
              <Link key={h.key} to="/bible" search={{ book: bk, ch: Number(c), v: Number(vv) }} className="card-surface block p-4">
                <p className="font-semibold text-primary">{refLabel(h.key)}</p>
                <p className="font-serif text-lg">{h.text}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <>
          {last && bookById(last.book) && (
            <Link to="/bible" search={{ book: last.book, ch: last.ch }} className="card-surface mb-4 flex min-h-16 items-center justify-between p-4">
              <span>
                <span className="eyebrow block">Continue reading</span>
                <span className="font-serif text-xl font-semibold">
                  {bookById(last.book)?.name} {last.ch}
                </span>
              </span>
              <ChevronRight className="size-6 text-primary" />
            </Link>
          )}

          <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1" role="tablist">
            {(["OT", "NT"] as Testament[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`min-h-11 rounded-lg font-semibold ${tab === t ? "bg-card text-foreground" : "text-muted-foreground"}`}
              >
                {t === "OT" ? "Old Testament" : "New Testament"}
              </button>
            ))}
          </div>

          <ul className="card-surface divide-y overflow-hidden">
            {BOOKS.filter((bk) => bk.testament === tab).map((bk) => (
              <li key={bk.id}>
                <button
                  className="flex min-h-14 w-full items-center justify-between px-4 text-left text-lg"
                  onClick={() => setOpen(open === bk.id ? null : bk.id)}
                  aria-expanded={open === bk.id}
                >
                  <span className="font-serif text-xl">{bk.name}</span>
                  <span className="text-muted-foreground">{bk.chapters}</span>
                </button>
                {open === bk.id && <ChapterGrid bookId={bk.id} />}
              </li>
            ))}
          </ul>
        </>
      )}
    </Page>
  );
}

function ChapterGrid({ bookId, current }: { bookId: string; current?: number }) {
  const bk = bookById(bookId)!;
  return (
    <div className="grid grid-cols-5 gap-2 px-4 pb-4">
      {Array.from({ length: bk.chapters }, (_, i) => i + 1).map((c) => (
        <Link
          key={c}
          to="/bible"
          search={{ book: bookId, ch: c }}
          className={`flex min-h-12 items-center justify-center rounded-lg border font-medium ${c === current ? "border-primary bg-primary text-primary-foreground" : getChapter(bookId, c) ? "bg-card" : "bg-muted text-muted-foreground"}`}
        >
          {c}
        </Link>
      ))}
    </div>
  );
}

function Reader({ bookId, ch, verse }: { bookId: string; ch: number; verse?: number }) {
  const book = bookById(bookId)!;
  const verses = getChapter(bookId, ch);
  const navigate = useNavigate();
  const [, setLast] = useLastRead();
  const [hl, setHl] = useHighlights();
  const [marks, setMarks] = useBookmarks();
  const [notes, setNotes] = useNotes();
  const { bumpText } = useSettings();
  const [sel, setSel] = useState<number | null>(null);
  const [picker, setPicker] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setLast({ book: bookId, ch });
    setSel(null);
    setPicker(false);
    if (verse) document.getElementById(`v${verse}`)?.scrollIntoView({ block: "center" });
    else window.scrollTo(0, 0);
  }, [bookId, ch, verse, setLast]);

  const idx = BOOKS.findIndex((b) => b.id === bookId);
  const prev = ch > 1 ? { book: bookId, ch: ch - 1 } : idx > 0 ? { book: BOOKS[idx - 1].id, ch: BOOKS[idx - 1].chapters } : null;
  const next = ch < book.chapters ? { book: bookId, ch: ch + 1 } : idx < BOOKS.length - 1 ? { book: BOOKS[idx + 1].id, ch: 1 } : null;

  const key = sel ? verseKey(bookId, ch, sel) : "";
  const selText = sel && verses ? `"${verses[sel - 1]}" — ${book.name} ${ch}:${sel}` : "";

  return (
    <main className="mx-auto max-w-xl pb-44">
      <header className="sticky top-0 z-20 flex items-center gap-1 border-b bg-background px-2 py-2">
        <Link to="/bible" className="flex size-12 items-center justify-center" aria-label="All books">
          <ChevronLeft className="size-6" />
        </Link>
        <button onClick={() => setPicker(!picker)} className="min-h-12 flex-1 truncate rounded-lg px-2 text-left font-serif text-xl font-semibold" aria-expanded={picker}>
          {book.name} {ch} <span className="text-base text-muted-foreground">▾</span>
        </button>
        <button onClick={() => bumpText(-1)} className="flex size-12 items-center justify-center rounded-lg border" aria-label="Smaller text">
          <Minus className="size-5" />
        </button>
        <button onClick={() => bumpText(1)} className="flex size-12 items-center justify-center rounded-lg border" aria-label="Larger text">
          <Plus className="size-5" />
        </button>
      </header>

      {picker && (
        <div className="border-b bg-card pt-4">
          <p className="eyebrow mb-2 px-4">Choose a chapter</p>
          <ChapterGrid bookId={bookId} current={ch} />
        </div>
      )}

      <article className="px-4 pt-5">
        <h1 className="mb-4 text-center font-serif text-3xl font-semibold">
          {book.name} <span className="text-primary">{ch}</span>
        </h1>
        {verses ? (
          <div className="scripture">
            {verses.map((t, i) => {
              const n = i + 1;
              const k = verseKey(bookId, ch, n);
              const color = hl[k];
              return (
                <span
                  key={n}
                  id={`v${n}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSel(sel === n ? null : n);
                    setEditing(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && setSel(sel === n ? null : n)}
                  className={`cursor-pointer rounded-sm py-0.5 ${color ? HL_BG[color] : ""} ${sel === n ? "underline decoration-primary decoration-2 underline-offset-4" : ""} ${verse === n && !color ? "bg-accent" : ""}`}
                >
                  <sup className="mr-1 font-sans text-[0.7em] font-semibold text-primary">{n}</sup>
                  {marks.includes(k) && <Bookmark className="mr-1 inline size-4 fill-primary text-primary" aria-label="Bookmarked" />}
                  {t}
                  {notes[k] && <NotebookPen className="ml-1 inline size-4 text-primary" aria-label="Has note" />}{" "}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="card-surface p-5 text-center">
            <p>This chapter is not included in the sample text yet.</p>
            <p className="mt-1 text-muted-foreground">The full Bible will be added later.</p>
          </div>
        )}

        <div className="mt-8 flex justify-between gap-3">
          {prev ? (
            <Link to="/bible" search={prev} className={btnClass("outline")}>
              <ChevronLeft className="size-5" /> Previous
            </Link>
          ) : <span />}
          {next && (
            <Link to="/bible" search={next} className={btnClass("outline")}>
              Next <ChevronRight className="size-5" />
            </Link>
          )}
        </div>
      </article>

      {sel && verses && (
        <div className="fixed inset-x-0 bottom-16 z-30 border-t bg-card px-4 pb-[env(safe-area-inset-bottom)] pt-3">
          <div className="mx-auto max-w-xl">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {book.name} {ch}:{sel}
              </p>
              <button onClick={() => setSel(null)} className="flex size-11 items-center justify-center" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            {editing ? (
              <div className="pb-3">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  autoFocus
                  className="w-full rounded-xl border border-input bg-background p-3"
                  placeholder="Write a note"
                  aria-label="Note"
                />
                <div className="mt-2 flex gap-2">
                  <Btn
                    className="flex-1"
                    onClick={() => {
                      setNotes((n) => {
                        const c = { ...n };
                        if (draft.trim()) c[key] = draft.trim();
                        else delete c[key];
                        return c;
                      });
                      setEditing(false);
                    }}
                  >
                    Save note
                  </Btn>
                  <Btn variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Btn>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 py-2">
                  {HL_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setHl((h) => (h[key] === c ? omit(h, key) : { ...h, [key]: c }))}
                      className={`size-11 rounded-full border-2 ${HL_BG[c]} ${hl[key] === c ? "border-foreground" : "border-border"}`}
                      aria-label={`Highlight ${c}`}
                      aria-pressed={hl[key] === c}
                    />
                  ))}
                  {hl[key] && (
                    <button onClick={() => setHl((h) => omit(h, key))} className="min-h-11 px-2 text-muted-foreground">
                      Clear
                    </button>
                  )}
                </div>
                {notes[key] && <p className="mb-2 rounded-lg bg-muted p-3">{notes[key]}</p>}
                <div className="grid grid-cols-4 gap-2 pb-3">
                  <Action
                    label={marks.includes(key) ? "Saved" : "Bookmark"}
                    onClick={() => setMarks((m) => (m.includes(key) ? m.filter((x) => x !== key) : [...m, key]))}
                  >
                    <Bookmark className={`size-5 ${marks.includes(key) ? "fill-primary text-primary" : ""}`} />
                  </Action>
                  <Action
                    label="Note"
                    onClick={() => {
                      setDraft(notes[key] ?? "");
                      setEditing(true);
                    }}
                  >
                    <NotebookPen className="size-5" />
                  </Action>
                  <Action label="Copy" onClick={() => copyText(selText)}>
                    <Copy className="size-5" />
                  </Action>
                  <Action label="Share" onClick={() => shareText(selText)}>
                    <Share2 className="size-5" />
                  </Action>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* keep navigate referenced for future swipe support */}
      <span hidden>{typeof navigate}</span>
    </main>
  );
}

function omit<T extends Record<string, unknown>>(o: T, k: string): T {
  const c = { ...o };
  delete c[k];
  return c;
}

function Action({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl border text-sm font-medium">
      {children}
      {label}
    </button>
  );
}

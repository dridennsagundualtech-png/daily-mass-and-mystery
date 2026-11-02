import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BottomNav, Toaster } from "@/components/app-ui";
import { useSettings } from "@/lib/settings";
import { getToday } from "@/lib/today";
import { setupOffline } from "@/lib/pwa";
import { useReminder } from "@/lib/reminder";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-6xl font-semibold text-foreground">404</h1>
        <p className="mt-3 text-muted-foreground">This page could not be found.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex min-h-12 items-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground">
            Go to Today
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-muted-foreground">Something went wrong. Try again.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Applies saved theme + text size before first paint (no network involved).
const BOOT = `try{var s=JSON.parse(localStorage.getItem('sc.settings')||'{}');var h=document.documentElement;if(s.theme==='dark')h.classList.add('dark');if(s.textScale)h.style.fontSize=(s.textScale*100)+'%';}catch(e){}`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Sinner's Cure — Catholic Bible & Prayer" },
      { name: "description", content: "A Catholic Bible, Rosary and prayer companion that works on your phone." },
      { property: "og:title", content: "Sinner's Cure — Catholic Bible & Prayer" },
      { property: "og:description", content: "A Catholic Bible, Rosary and prayer companion that works on your phone." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/favicon.ico" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { settings } = useSettings();

  useEffect(() => {
    const h = document.documentElement;
    h.classList.toggle("dark", settings.theme === "dark");
    h.style.fontSize = `${settings.textScale * 100}%`;
  }, [settings.theme, settings.textScale]);

  useEffect(() => {
    document.documentElement.dataset["lit"] = getToday(new Date()).color;
    void setupOffline();
  }, []);
  useReminder(settings.reminder, settings.reminderFor);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
      <BottomNav />
    </QueryClientProvider>
  );
}

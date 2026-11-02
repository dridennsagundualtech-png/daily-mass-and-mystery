/**
 * The only place the offline service worker is registered.
 * Never registers in development, inside the editor preview, or in iframes.
 */
const PREVIEW_LABEL = /^(?:id-preview|preview)(?:-[a-z0-9]+)?--.+$/;
const PREVIEW_DOMAINS = [".lovable.app", ".gpt-eng.com", ".gptengineer.run"];

function refused(): boolean {
  if (!import.meta.env.PROD) return true;
  if (window.self !== window.top) return true;
  const host = window.location.hostname.toLowerCase();
  const label = host.split(".")[0] ?? "";
  if (PREVIEW_DOMAINS.some((d) => host.endsWith(d)) && (PREVIEW_LABEL.test(label) || /^project--.+-dev$/.test(label))) return true;
  if (host === "lovableproject.com" || host.endsWith(".lovableproject.com")) return true;
  if (host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com")) return true;
  if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")) return true;
  if (new URLSearchParams(window.location.search).get("sw") === "off") return true;
  return false;
}

async function unregisterAppSW() {
  if (!("serviceWorker" in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(regs.filter((r) => r.active?.scriptURL.endsWith("/sw.js")).map((r) => r.unregister()));
}

const WARM = ["/", "/mass", "/bible", "/rosary", "/prayers", "/prayers/chaplet", "/prayers/confession", "/more", "/more/settings"];

export async function setupOffline() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (refused()) {
    await unregisterAppSW();
    return;
  }
  const { registerSW } = await import("virtual:pwa-register");
  registerSW({
    immediate: true,
    onRegisteredSW: async () => {
      await navigator.serviceWorker.ready;
      // Cache the main pages so every tab opens without internet.
      await Promise.allSettled(WARM.map((u) => fetch(u, { headers: { accept: "text/html" } })));
    },
  });
}

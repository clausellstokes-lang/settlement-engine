// Ambient global types - the Vite client env plus the handful of custom
// window globals this app installs. Resolves the `import.meta.env` and
// `window.X` type-error classes across the non-domain layers (measured by
// `npm run typecheck:full`; see tsconfig.full.json). Types only - this file
// produces no runtime output.
//
// Script-mode (no import/export) so the interfaces merge into the global
// scope rather than becoming a module.

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  // App config vars (see .env.example). Optional - unset in some environments.
  readonly [key: `VITE_${string}`]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Dev-only store handle exposed in main.jsx for map automation. */
  __store?: unknown;
  /** Analytics bridge installed by lib/analyticsProvider.js (Tier 8.8). */
  __sf_analytics_provider?: (event: string, props?: Record<string, unknown>) => void;
  /** Which analytics provider installed ('plausible' | 'posthog'), if any. */
  __sf_analytics_installed?: string;
  /** Plausible global (present when VITE_PLAUSIBLE_DOMAIN is configured). Carries a `.q` pre-load queue, per Plausible's own stub pattern. */
  plausible?: ((...args: unknown[]) => void) & { q?: unknown[] };
}

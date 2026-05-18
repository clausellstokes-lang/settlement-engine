/**
 * lib/flags.js — Feature flag registry.
 *
 * Every cross-cutting product change ships behind a flag so we can
 * roll back without redeploying. The funnel + UI redesign is a big
 * change touching dozens of components — without flags, "ship it" and
 * "revert it" both become multi-hour migrations.
 *
 * Resolution order (highest precedence first):
 *
 *   1. URL parameter  ?flag.homepageAnonGen=false   (persisted to localStorage)
 *   2. localStorage   key `flag.<name>`             (set by QA / devs)
 *   3. Vite env var   VITE_FLAG_<NAME_UPPERCASE>    (CI / staging overrides)
 *   4. Hard-coded default in this file              (what ships in prod)
 *
 * Keep defaults aligned with what should be live in prod. Flags are a
 * killswitch, not a substitute for a config file. If a flag would be on
 * everywhere forever, delete the flag and inline the change.
 *
 * Usage:
 *   import { flag, useFlag } from '@/lib/flags';
 *
 *   if (flag('discordOauth')) { ... }              // in plain JS
 *   const showRail = useFlag('pipelineRail');      // in React components
 *
 * Adding a flag: add a new entry to FLAGS below with `default` +
 * `description`. The description is shown in the dev panel and read by
 * the team — keep it short and concrete.
 */

import { useSyncExternalStore } from 'react';

// ── Registry ──────────────────────────────────────────────────────────────
// Every flag is declared here. New flags get added to this map, not as
// loose strings sprinkled through the codebase.
//
// `default` is what runs in prod when no override is set.
// `description` is shown in the dev flag panel.
export const FLAGS = Object.freeze({
  // ── Funnel / monetization ────────────────────────────────────────────────
  homepageAnonGen: {
    default: true,
    description: 'Anonymous one-shot generator on the homepage (no signup required).',
  },
  singleDossier: {
    default: true,
    description: '$2.99 single-dossier microtransaction (one PDF, no account).',
  },
  founderTier: {
    default: true,
    description: 'Founder Lifetime tier ($99 one-time, 500-seat cap).',
  },
  aiRepriced: {
    default: true,
    description: 'AI costs use the new schedule (3/4/5) instead of the legacy (8/10/12).',
  },
  packsRepriced: {
    default: true,
    description: 'Credit packs use the new schedule (25/60/150) instead of legacy (5/15/40).',
  },
  tierRenames: {
    default: true,
    description: 'Tier names use Wanderer/Cartographer instead of Free/Premium.',
  },

  // ── Auth ─────────────────────────────────────────────────────────────────
  discordOauth: {
    default: false,
    description: 'Discord OAuth button (off until the OAuth review completes).',
  },

  // ── Surface area ─────────────────────────────────────────────────────────
  gallery: {
    default: true,
    description: 'Public dossier gallery route at /gallery (SEO surface).',
  },
  pipelineRail: {
    default: true,
    description: '"How this was simulated" rail beside the dossier output.',
  },
  onboardingCoach: {
    default: true,
    description: 'Onboarding coach overlay shown after first generation.',
  },
  checklist: {
    default: true,
    description: 'Onboarding checklist on the dashboard for new accounts.',
  },

  // ── Accessibility ────────────────────────────────────────────────────────
  wcagBodyContrast: {
    default: true,
    description: 'Use ink-600 for body copy (passes WCAG 4.5:1) instead of muted-500.',
  },
});

// ── Resolution ────────────────────────────────────────────────────────────

const STORAGE_PREFIX = 'flag.';
const URL_PARAM_PREFIX = 'flag.';

// Parse "true" / "false" / "1" / "0" strings; anything else is undefined.
function parseBool(s) {
  if (s == null) return undefined;
  const v = String(s).toLowerCase().trim();
  if (v === 'true' || v === '1' || v === 'on' || v === 'yes') return true;
  if (v === 'false' || v === '0' || v === 'off' || v === 'no') return false;
  return undefined;
}

// Read from URL (?flag.X=true) and persist to localStorage as a side
// effect so the override survives a page refresh.
function fromUrl(name) {
  if (typeof window === 'undefined') return undefined;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(URL_PARAM_PREFIX + name);
  const v = parseBool(raw);
  if (v !== undefined) {
    try { window.localStorage.setItem(STORAGE_PREFIX + name, String(v)); } catch { /* private mode */ }
  }
  return v;
}

function fromLocalStorage(name) {
  if (typeof window === 'undefined') return undefined;
  try {
    return parseBool(window.localStorage.getItem(STORAGE_PREFIX + name));
  } catch {
    return undefined;
  }
}

// Read from Vite env. Convention: VITE_FLAG_HOMEPAGE_ANON_GEN.
function fromEnv(name) {
  if (typeof import.meta === 'undefined' || !import.meta.env) return undefined;
  const key = 'VITE_FLAG_' + name.replace(/([A-Z])/g, '_$1').toUpperCase();
  return parseBool(import.meta.env[key]);
}

/**
 * Read a flag's current value. Cheap — call it inline in render code.
 */
export function flag(name) {
  const decl = FLAGS[name];
  if (!decl) {
    if (import.meta?.env?.DEV) {
       
      console.warn(`[flags] unknown flag: ${name}`);
    }
    return false;
  }
  return (
    fromUrl(name)            ??
    fromLocalStorage(name)   ??
    fromEnv(name)            ??
    decl.default
  );
}

// ── React hook ─────────────────────────────────────────────────────────────
// Subscribes to localStorage changes so the dev flag panel can flip
// flags without a page reload.

const listeners = new Set();
function notifyAll() { for (const fn of listeners) fn(); }

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Imperatively set a flag override (writes to localStorage). Used by
 * the dev flag panel; not generally needed in product code.
 */
export function setFlagOverride(name, value) {
  if (typeof window === 'undefined') return;
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(STORAGE_PREFIX + name);
    } else {
      window.localStorage.setItem(STORAGE_PREFIX + name, String(value));
    }
    notifyAll();
  } catch { /* private mode */ }
}

/**
 * React hook. Re-renders when the flag override changes.
 */
export function useFlag(name) {
  return useSyncExternalStore(
    subscribe,
    () => flag(name),
    () => FLAGS[name]?.default ?? false,
  );
}

/**
 * Read all current flag values at once. Useful for dev panels and
 * for sending the flag state with error reports.
 */
export function getAllFlags() {
  const out = {};
  for (const name of Object.keys(FLAGS)) out[name] = flag(name);
  return out;
}

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
 *   1. URL parameter  ?flag.heroV2=true             (persisted to localStorage)
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
 *   const showHero = useFlag('heroV2');            // in React components
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
  // ── Auth ─────────────────────────────────────────────────────────────────
  discordOauth: {
    default: false,
    description: 'Discord OAuth button (off until the OAuth review completes).',
  },
  googleOauth: {
    default: false,
    description: 'Google OAuth button (off until the Supabase provider is configured).',
  },

  // ── Dark-shipped / not-yet-enabled critique work ───────────────────────────
  // Each flag below gates one critique-mandated change that is NOT yet
  // promoted to GA — defaults are false; flip to true (locally, via env, or
  // here) to light it up. Flags that soaked default-on everywhere have been
  // removed and their on-path inlined, per the doctrine note above.
  dossierFiveTabs: {
    default: true,
    description: 'P102 / D-1: consolidate 14 dossier tabs into 5 thematic groups. PROMOTED default-on; flag retained as soak killswitch.',
  },
  inlineEdit: {
    default: true,
    description: 'P106 / E-1: click-to-edit names + pills + paragraphs in the dossier. PROMOTED default-on; flag retained as soak killswitch.',
  },
  workshopNav: {
    default: true,
    description: 'P107 / CP-2: Workshop as top-level nav destination. PROMOTED default-on; flag retained as soak killswitch.',
  },
  canonicalViewModel: {
    default: true,
    description: 'M0.1 / doc §1: route food balance + export posture + viability through the canonical display model (deriveDossierViewModel). PROMOTED default-on; flag retained as soak killswitch.',
  },
  pdfVisualChains: {
    default: true,
    description: 'Render PDF supply chains as the web visual node-flow (SupplyChainFlow) instead of flat PROC/OUT/DEP rows. PROMOTED default-on; flag retained as killswitch.',
  },
  versionHistory: {
    default: true,
    description: 'P109 / E-5: per-settlement version timeline + diff + revert. Cartographer-gated. PROMOTED default-on after revert-mutation soak (P133).',
  },
  mapDropPreview: {
    default: true,
    description: 'P111 / M-3: hover-tooltip during drag with terrain + trade-route context.',
  },
  mapAutosave: {
    default: true,
    description: 'P112 / M-5: auto-save map state into the active campaign (rides the campaign cloud sync, so maps persist per account and across devices). PROMOTED default-on.',
  },
  welcomeBack: {
    default: true,
    description: 'P115 / X-9: welcome-back hero variant on return visits + post-session check-in.',
  },
  founderRecognition: {
    default: false,
    description: 'P116 / X-8: Founder Lifetime surfaces only to demonstrated worldbuilders.',
  },
  heroV2: {
    default: true,
    description: 'P117 / H-1: two-voice hero rewrite (anti-AI as H1 + italic deck translation).',
  },
  onboardingDiet: {
    default: true,
    description: 'P118 / O-1: collapse the 4-system onboarding pile-up to Checklist + first-dossier callouts only. Suppresses OnboardingCoach + nudge toast when on.',
  },
  wizardChromeDiet: {
    default: true,
    description: 'P119 / W-1: collapse 7 wizard chrome rows into one combined header.',
  },
  narrativeLayerStrip: {
    default: true,
    description: 'P121 / D-4: lift narrative buttons into labeled strip below dossier title.',
  },
  mobileSingleChrome: {
    default: false,
    description: 'P123 / A-2: drop mobile top header; auth chip joins bottom nav.',
  },
  compendiumInlineHelp: {
    default: false,
    description: 'P126 / CP-1: "?" affordance on every config control opens Compendium snippet.',
  },
  summaryMagazineV2: {
    default: true,
    description: 'P129 / D-2: Summary tab as two-column magazine spread. Replaces single-column layout.',
  },
  tableView: {
    default: true,
    description: 'P142 / D-6: 380px phone-optimized session-running view of a settlement.',
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

// Read from Vite env. Convention: VITE_FLAG_MOBILE_SINGLE_CHROME.
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

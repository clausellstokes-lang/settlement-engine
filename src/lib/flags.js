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
    default: true,
    description: 'Discord OAuth sign-in button. Safe flag-on: an unconfigured provider degrades to a calm message.',
  },
  googleOauth: {
    default: true,
    description: 'Google OAuth sign-in button. Safe flag-on: an unconfigured provider degrades to a calm message.',
  },

  // ── Content protection ─────────────────────────────────────────────────────
  copyGuard: {
    default: false,
    description: 'Site-wide copy/cut/context-menu deterrent (lib/copyGuard.js). Default OFF per owner ruling (reconciliation #5); machinery + [data-allow-copy] exemptions retained. This is the one flag to flip to enable.',
  },
  perimeterCaptcha: {
    default: false,
    description: 'Wave-D PERIMETER: adaptive human-verification (Cloudflare Turnstile, managed/invisible mode) on the auth flows (sign-in/up/reset) and the purchase-initiation surfaces. Default OFF and INERT: with the flag off the widget is never imported (zero eager bytes) and no captchaToken is sent. Flip ON only AFTER the owner adds the Turnstile site+secret keys and enables Supabase Auth captcha protection — see docs/PERIMETER_RUNBOOK.md. The anonymous generation funnel is DELIBERATELY excluded (kept frictionless; rate limits + bot-wave telemetry cover it).',
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
    default: true,
    description: 'P126 / CP-1: "?" affordance on every config control opens Compendium snippet. Promoted on.',
  },
  summaryMagazineV2: {
    default: true,
    description: 'P129 / D-2: Summary tab as two-column magazine spread. Replaces single-column layout.',
  },
  tableView: {
    default: true,
    description: 'P142 / D-6: 380px phone-optimized session-running view of a settlement.',
  },
  // DEPRECATED (no longer read). The Welcome page was rewritten wholesale into
  // the scrollable salt-road landing (HomeLanding + home/LandingBelowFold), which
  // does NOT fork on this flag — HomeLanding was its sole consumer and the flag
  // read was removed with the rewrite. The registry entry is kept (registry
  // entries are not deleted); it is now inert. Safe to retire in a later flag
  // sweep once no analytics/config references remain.
  landingV2: {
    default: true,
    description: 'DEPRECATED / inert — the scrollable landing no longer forks on this flag (HomeLanding rewrite). Kept as a registry entry only.',
  },

  // ── Simulation ──────────────────────────────────────────────────────────────
  // Advance-scaling: an Advance runs N REAL one-week ticks (week=1, month=4,
  // season=13, year=52) with a determinate progress bar, a pause-at-forks
  // resume flow, and the auto-resolve toggle — instead of a single coarse step.
  // PROMOTED default-on after the multi-tick STORE integration landed
  // (campaignWorldPulseSlice: the flag-branched advance, resolveIntervalMajors
  // resume, advanceAutoResolve, pausedAdvance surfacing). Flag retained as a soak
  // killswitch — set false (via env or localStorage) to fall back to the
  // byte-identical single-tick advance path.
  advanceMultiTick: {
    default: true,
    description: 'PROMOTED default-on; flag retained as soak killswitch. Advance runs N real one-week ticks per interval (month=4, season=13, year=52) with a progress bar + pause/resume + auto-resolve toggle. Set false to fall back to the byte-identical single-tick advance.',
  },
  // Runs the multi-tick advance in a Web Worker so the main thread stays
  // interactive during a long advance (a year is 48 synchronous kernel ticks). The
  // worker runs the SAME pure simulate function with a custom-content snapshot, so
  // output is byte-identical to the in-thread path; a killswitch fallback runs it
  // in-thread when off (and it always runs in-thread in Node/tests/SSR, where there
  // is no Worker). Set false (?flag.simAdvanceWorker=false) for instant per-browser
  // rollback to the synchronous advance.
  simAdvanceWorker: {
    default: true,
    description: 'Run the multi-tick world advance in a Web Worker (main thread stays interactive). Byte-identical output; set false to fall back to the in-thread advance.',
  },
  // R-18 WORKER PARANOIA MODE — a DEV-ONLY self-verification of the worker↔sync
  // determinism claim. When on, every worker advance is ALSO re-run in-thread and
  // the two worldStates are diffed; any divergence is reported loudly. Default OFF
  // and gated on import.meta.env.DEV so it is inert (dead code) on every production
  // path REGARDLESS of the flag — the promise is structural, not honor-system. Off
  // it is byte-neutral (one flag read, no second advance). Doubles the advance cost
  // when on, which is exactly the deal a paranoia switch offers.
  advanceWorkerParanoia: {
    default: false,
    description: 'DEV-ONLY: re-run each Web Worker advance in-thread and diff the two worldStates, surfacing any determinism divergence. Default OFF; inert in production builds (import.meta.env.DEV gate) even if forced on. Doubles advance compute while on.',
  },
  // The read-only surfacing layer for the war-economy phases. OFF by default.
  // When on, a "War & Resolve" Inspector tab reads each settlement's morale
  // signals — Hope, Resolve, Faith relation, Supply, pro-war / anti-war balance —
  // and the same signals ground the AI narrative + daily-life prose. Pure display:
  // it computes nothing the simulation doesn't already know and mutates no state.
  warEconomySurfacing: {
    default: false,
    description: 'A read-only "War & Resolve" tab surfacing each settlement\'s Hope / Resolve / Faith relation / Supply / pro-war vs anti-war balance, and the same signals grounding the AI narrative + daily-life prose. Display-only; touches no simulation state.',
  },

  // ── W-Session surfaces (docs/briefs/SESSION_FOUNDRY_SCOPE.md) ──────────────
  sessionMode: {
    default: true,
    description: 'W-Session: distraction-free run-of-play overlay on a saved settlement.',
  },
  foundryExport: {
    default: true,
    description: 'W-Session: Foundry VTT module export beside the PDF in ExportSheet.',
  },

  // ── Pricing copy ────────────────────────────────────────────────────────────
  // The simulation-led copy ("Generate a town in seconds, then run the region for
  // years.") vs. the old "unlimited saves" pitch. Default-ON: the live conversion
  // surface must sell the actual moat (the war/trade/pantheon living simulation),
  // not "unlimited saves" — a feature countless free tools offer. The storage/saves
  // line stays a SECONDARY bullet. Size is FREE, so this variant must NOT pitch
  // size/metropolis/capital as premium. Set false to A/B back to the old copy.
  pricingSimulationCopy: {
    default: true,
    description: 'Simulation-led premium pricing copy. ON (default) = "generate a town, then run the region" — names the simulation, never size. OFF = the old "unlimited saves / full size" copy.',
  },

  // ── Loading journeys (Slice C2L) — the taste-gate ──────────────────────────
  // The progress-scrubbed growth film as the generation loading backdrop (and the
  // reality-mode unfurl behind the realm/FMG boot). Default OFF: the stills floor
  // is the shipping default; the walk flips this on to compare film-on vs
  // stills-only WITHOUT a rebuild (engineering law #5). Streamed media never
  // touches the eager JS closure; flag-off ships zero network weight.
  loadingJourneyFilm: {
    default: false,
    description: 'C2L: the progress-scrubbed journey film as the loading backdrop (generation + realm). OFF = stills floor only (default). Flip on at the taste walk to compare without a rebuild.',
  },
  // C2 THE WELCOME (THE FILM RULING): the scroll-scrubbed travel-and-stop film as
  // the Welcome page backdrop. OFF (default) = the stills journey ships (the floor
  // is always present — desk still + six stop stills, every section readable, zero
  // network weight); flip ON at the taste walk to compare film-on vs stills-only
  // without a rebuild. Shares loadingJourneySetBg for the media set (below).
  welcomeJourneyFilm: {
    default: false,
    description: 'C2: the scroll-scrubbed journey film behind the Welcome page. OFF = stills floor only (default, zero video bytes). Flip on at the taste walk to compare film-on vs stills-only without a rebuild.',
  },
  // Which produced media set the film uses when loadingJourneyFilm is on. TRUE =
  // the "bg" set (six 5.04s legs, ~42 MB, cinematic drift); FALSE = the "journey"
  // set (six 2.5s legs, ~10 MB, lean). The owner ruled BOTH ship to the walk; this
  // switches between them at runtime. The losing set is deleted at the walk ruling.
  loadingJourneySetBg: {
    default: true,
    description: 'C2L media-set toggle (only meaningful when loadingJourneyFilm is on). TRUE = "bg" set (5.04s legs, ~42 MB); FALSE = "journey" set (2.5s legs, ~10 MB). The walk compares the two; the loser is deleted.',
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

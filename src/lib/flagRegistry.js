/**
 * lib/flagRegistry.js — the LEAN, first-paint-safe flag resolution core.
 *
 * This module carries ONLY what the runtime needs to resolve a flag: the
 * name→default map (FLAG_DEFAULTS) and the resolution order (URL > localStorage
 * > env > default). It deliberately carries NO description prose — those live in
 * the (lazy) lib/flags.js sidecar and are read only by the dev flag panel.
 *
 * WHY THE SPLIT (R-14 first-paint reclaim): crash forensics (lib/crashForensics.js,
 * armed eagerly at store boot) must read flags_on SYNCHRONOUSLY at crash time, so
 * getAllFlags has to sit in the first-paint closure. When getAllFlags lived in
 * flags.js, importing it dragged the whole ~4.5 KB description registry eager for
 * nothing. Splitting the resolution core out here keeps the synchronous
 * crash-forensics contract intact while the prose stays lazy (the registryProse
 * idiom — see tests/build/vendorPdfLazy.test.js). flags.js re-exports every
 * function below unchanged, so its 20-plus consumers see an identical API.
 *
 * Resolution order (highest precedence first):
 *   1. URL parameter  ?flag.heroV2=true             (persisted to localStorage)
 *   2. localStorage   key `flag.<name>`             (set by QA / devs)
 *   3. Vite env var   VITE_FLAG_<NAME_UPPERCASE>    (CI / staging overrides)
 *   4. Hard-coded default in FLAG_DEFAULTS below     (what ships in prod)
 */

import { useSyncExternalStore } from 'react';

// ── Registry defaults ───────────────────────────────────────────────────────
// name → the value that runs in prod when no override is set. The single source
// of truth for WHICH flags exist and their shipped defaults; flags.js composes
// the human-facing FLAGS object (default + description) from these keys.
export const FLAG_DEFAULTS = Object.freeze({
  discordOauth: true,
  googleOauth: true,
  copyGuard: false,
  perimeterCaptcha: false,
  imFellDisplayFace: false,
  dossierFiveTabs: true,
  inlineEdit: true,
  settlementWorkbench: false,
  heraldCommandBrief: false,
  realmItemShadowDiagnostics: false,
  // Availability and promotion are deliberately separate. The scene may ship as
  // an opt-in portrait while the established 2D plan remains the default until
  // the machine, device, accessibility, and lived-evaluation contract is green.
  settlementScene3d: true,
  settlementScene3dDefault: false,
  workshopNav: true,
  canonicalViewModel: true,
  pdfVisualChains: true,
  versionHistory: true,
  mapDropPreview: true,
  mapAutosave: true,
  welcomeBack: true,
  // ⭐ LIT 2026-09-03 — row O-16, the owner's word of that day (a PAID-SURFACE
  // flip: Founder Lifetime is a subscription tier, so this one was held on the
  // desk by nature rather than by doubt). THE EVIDENCE LINE, because an
  // entitlement surface may not be lit on an assertion:
  //   • The flip's own stated precondition was "flip when audience hook is
  //     stable" (FounderTile.jsx). The ladder's every boundary — anon, first
  //     save, first export, first narrate, the five-save rung and each of the
  //     three campaign signals — is pinned in tests/hooks/useReaderAudience.test.js.
  //   • The tile SELLS NOTHING: the $99 checkout, its price arithmetic and its
  //     retry path were removed at ODQ §118 (a chair is given, never bought), so
  //     lighting it opens no purchase path.
  //   • The scarcity claim agrees across surfaces: the tile and the pricing
  //     cards both read FOUNDER_SEAT_CAP (30) and the same live RPC. The 500-vs-30
  //     contradiction the 2026-07-13 review found was cured with the checkout.
  //   • The gate now carries its grounds, not just its verdict
  //     (hooks/useFounderTileEligible.js `founderRecognitionEvidence`).
  // WHAT MOVES FOR A PAYING CUSTOMER: nothing. The tile self-gates on
  // tier !== 'premium', so a subscriber sees exactly what they saw before. What
  // changes is that a signed-in, non-premium reader whose behaviour has earned
  // 'worldbuilder' now sees the Hall's recognition tile on the account page.
  founderRecognition: true,
  heroV2: true,
  wizardChromeDiet: true,
  narrativeLayerStrip: true,
  // RETIRED 2026-09-06 (§904 chair car): `mobileSingleChrome` had no reader —
  // src/App.jsx lost its three read sites at 8bf493d05 (fix(nav), 2026-06-22):
  // the nav slice became a hard-coded `.slice(0, 5)`, the mobile top header
  // renders unconditionally, and the auth-chip 6th slot was deleted. The entry
  // was bookkeeping. Rebuilding the single-chrome mobile nav is an OWNER ROW
  // (ODQ §904), not a flag flip.
  compendiumInlineHelp: true,
  summaryMagazineV2: true,
  tableView: true,
  landingV2: true,
  advanceMultiTick: true,
  simAdvanceWorker: true,
  advanceWorkerParanoia: false,
  generationWorker: false,
  // ⭐ LIT 2026-09-06 — lane L-UI-MAT, lighting wave POSITION 4 (L-UI / `C4-UI`),
  // under owner row **O-13**, RATIFIED by the chair at ODQ §882.1: "O-13 three
  // product flags flip in L-UI (`warEconomySurfacing`, `handbookVoice`,
  // `mobileSingleChrome`) … RATIFIED". Two of the three land here; the third
  // was retired at §904 — its reader was deleted at 8bf493d05.
  //
  // THIS IS A DECLARED DISPLAY-ONLY SHIFT, AND IT WAS PROVEN RATHER THAN ASSERTED:
  //   • STRUCTURAL — no module under `src/domain/` or `src/generators/` imports
  //     `lib/flags.js` or `lib/flagRegistry.js` at all (measured: zero hits), so a
  //     flag value cannot reach a generator, a seed, a hash or a persisted config.
  //     Every one of the 36 importers is a component, hook, store action or pdf
  //     view-model — all render-time.
  //   • EXECUTED — the 525-row generator golden-master corpus was hashed with an
  //     independent probe before and after this flip: aggregate
  //     `92ef697dbea663df6d72c9e584a36595b6fd52b0d4bad4ba3f38272c8b146d8d`
  //     UNMOVED, 0 of 525 rows changed, with a planted-field negative control
  //     proving the comparator could see (it moved the aggregate to `d72c1ea7…`).
  //
  // `handbookVoice` (V-26b): the Keeper's Handbook header + concept essay now
  // render in the house voice. The numbered steps and the Compendium lifeline stay
  // plain in both states — THE CLARITY CLAUSE, pinned in handbookVoice.test.jsx.
  // `warEconomySurfacing`: the read-only "War & Resolve" fold-in surfaces inside the
  // Herald's War door. Its DATA stays premium/campaign-gated exactly as before — a
  // flag-on reader with no campaign gets the empty state, never war data — so no
  // paid-surface entitlement moves; only the door becomes reachable.
  handbookVoice: true,
  warEconomySurfacing: true,
  sessionMode: true,
  foundryExport: true,
  pricingSimulationCopy: true,
  // Walk W1 (owner order 2026-07-21, ledger 70a19ce5): both growth-film systems
  // flipped ON at the taste walk. The stills floor stays the fallback (JourneyFilm
  // mobile/coarse-pointer/reduced-motion gates are unchanged). loadingJourneyFilm
  // also activates the RealmUnfurlLoading backdrop over the booting FMG map.
  loadingJourneyFilm: true,
  welcomeJourneyFilm: true,
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
  if (!(name in FLAG_DEFAULTS)) {
    if (import.meta?.env?.DEV) {

      console.warn(`[flags] unknown flag: ${name}`);
    }
    return false;
  }
  return (
    fromUrl(name)            ??
    fromLocalStorage(name)   ??
    fromEnv(name)            ??
    FLAG_DEFAULTS[name]
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
    () => FLAG_DEFAULTS[name] ?? false,
  );
}

/**
 * Read all current flag values at once. Useful for dev panels and
 * for sending the flag state with error reports (crash forensics).
 */
export function getAllFlags() {
  const out = {};
  for (const name of Object.keys(FLAG_DEFAULTS)) out[name] = flag(name);
  return out;
}

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
  workshopNav: true,
  canonicalViewModel: true,
  pdfVisualChains: true,
  versionHistory: true,
  mapDropPreview: true,
  mapAutosave: true,
  welcomeBack: true,
  founderRecognition: false,
  heroV2: true,
  wizardChromeDiet: true,
  narrativeLayerStrip: true,
  mobileSingleChrome: false,
  compendiumInlineHelp: true,
  summaryMagazineV2: true,
  tableView: true,
  landingV2: true,
  advanceMultiTick: true,
  simAdvanceWorker: true,
  advanceWorkerParanoia: false,
  handbookVoice: false,
  warEconomySurfacing: false,
  sessionMode: true,
  foundryExport: true,
  pricingSimulationCopy: true,
  // Walk W1 (owner order 2026-07-21, ledger 70a19ce5): both growth-film systems
  // flipped ON at the taste walk. The stills floor stays the fallback (JourneyFilm
  // mobile/coarse-pointer/reduced-motion gates are unchanged). loadingJourneyFilm
  // also activates the RealmUnfurlLoading backdrop over the booting FMG map.
  loadingJourneyFilm: true,
  welcomeJourneyFilm: true,
  loadingJourneySetBg: true,
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

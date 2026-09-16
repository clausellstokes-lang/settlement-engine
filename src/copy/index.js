/**
 * copy/index.js — Single entry point for user-facing strings.
 *
 * Components call `t('hero.title')` instead of inlining literals.
 * Switching tone, A/B-testing variants, or adding a new locale all
 * become file-level changes here — components don't move.
 *
 * Usage:
 *   import { t } from '@/copy';
 *   <h1>{t('hero.title')}</h1>
 *   <button>{t('ai.narrative.button', { cost: 3 })}</button>
 *
 * Template interpolation uses `{name}` placeholders. Missing variables
 * are left as the literal `{name}` so the bug surfaces visibly rather
 * than silently rendering "undefined".
 *
 * Missing keys warn in DEV (a loud console.warn so we catch typos where
 * we'll notice them) and return the key string in every environment (so a
 * typo renders the harmless key text rather than taking down the page).
 */

import { en } from './en.js';

// ── The locale registry (V-27a localization scaffold) ───────────────────────
// `en` is the built-in base locale. Additional locales register at runtime with
// the SAME nested shape as `en`; components keep calling `t()` unchanged. The
// active locale is a module-level pointer, swapped by `setLocale`.
//
// FIRST-PAINT LAW (see copy/en.js): this whole module is off the eager entry
// closure — only lazy surfaces import it, and the app shell reads `footer`
// through copy/footer.js. Locale plumbing stays lazy: a non-`en` locale is
// loaded through `import()` (e.g. `loadPseudoLocale`), never a static eager
// import, so the eager first-paint budget is untouched.
const LOCALES = { en };
let activeId = 'en';

/** The id of the always-present base locale. */
export const DEFAULT_LOCALE = 'en';

/** Register a locale table (same nested shape as `en`) under an id. */
export function registerLocale(id, table) {
  if (!id || table == null || typeof table !== 'object') return false;
  LOCALES[id] = table;
  return true;
}

/**
 * Switch the active locale. Unknown ids are rejected (loud in dev) and the
 * previous locale stays active — a missing locale must never blank the UI.
 * Returns true if the switch happened.
 */
export function setLocale(id) {
  if (!Object.prototype.hasOwnProperty.call(LOCALES, id)) {
    if (import.meta?.env?.DEV) {

      console.warn(`[copy] unknown locale: ${id} — staying on ${activeId}`);
    }
    return false;
  }
  activeId = id;
  return true;
}

/** The active locale id. */
export function getLocale() {
  return activeId;
}

/** Every registered locale id (base + any lazily-loaded ones). */
export function listLocales() {
  return Object.keys(LOCALES);
}

/**
 * Lazily load + register the pseudo-locale and return its id, proving the
 * localization door swings without shipping translated content. The pseudo
 * table rides its own dynamic-import chunk — zero eager first-paint cost. This
 * is a DEV/QA locale (visibly transformed English), never a real language.
 */
export async function loadPseudoLocale() {
  const { pseudo, PSEUDO_LOCALE_ID } = await import('./pseudo.js');
  registerLocale(PSEUDO_LOCALE_ID, pseudo);
  return PSEUDO_LOCALE_ID;
}

// Resolve a dotted key path against a nested object. Returns undefined
// if any segment is missing. Kept tiny on purpose — no lodash.
function resolve(obj, dottedKey) {
  const parts = dottedKey.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

// Resolve a key against the active locale, falling back to the base `en`
// locale for any key the active locale does not carry (partial translations
// stay functional — the extraction pin, not a blank string, catches the gap).
function resolveActive(dottedKey) {
  const primary = resolve(LOCALES[activeId], dottedKey);
  if (primary !== undefined) return primary;
  if (activeId !== 'en') return resolve(en, dottedKey);
  return undefined;
}

// Substitute {name} placeholders from `vars`. Untouched placeholders are
// left visible so missing vars are loud.
function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
  );
}

/**
 * Get a copy string by dotted key. Optional `vars` substitute `{name}`
 * placeholders.
 *
 *   t('common.save')                       // "Save"
 *   t('ai.narrative.button', { cost: 3 })  // "Generate narrative (3 credits)"
 */
export function t(key, vars) {
  const raw = resolveActive(key);
  if (typeof raw !== 'string') {
    // Loud in dev, safe in prod.
    if (import.meta?.env?.DEV) {
       
      console.warn(`[copy] missing key: ${key}`);
    }
    return key;
  }
  return interpolate(raw, vars);
}

/**
 * Get a whole subtree (object) of copy. Useful when a component renders
 * a list of strings under a namespace (e.g., a tier's feature bullets).
 *
 *   tx('pricing.tiers.wanderer.features')  // ['3 saved settlements', ...]
 */
export function tx(key) {
  const raw = resolveActive(key);
  if (raw == null) {
    if (import.meta?.env?.DEV) {
       
      console.warn(`[copy] missing subtree: ${key}`);
    }
    return null;
  }
  return raw;
}

// Re-export the raw map for test imports and for code that needs to
// walk the tree (e.g., the copy linter that ensures every namespace
// has the same keys across locales).
export { en };

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
 * Missing keys throw in DEV (so we catch typos in the only place we'll
 * notice them) and return the key string in PROD (so a typo can't take
 * down the page).
 */

import { en } from './en.js';

// The active locale. Today this is hard-coded; tomorrow it reads from
// the store or a query param without any component changes.
const ACTIVE = en;

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
  const raw = resolve(ACTIVE, key);
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
  const raw = resolve(ACTIVE, key);
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

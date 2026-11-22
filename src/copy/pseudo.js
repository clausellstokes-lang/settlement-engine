/**
 * copy/pseudo.js — THE PSEUDO-LOCALE (V-27a localization scaffold).
 *
 * A derived, non-human locale that proves the localization door swings without
 * any translated content. Every leaf string in `en` is transformed — vowels
 * accented and the string wrapped in ⟦ ⟧ brackets — so an activated pseudo-
 * locale is instantly, visibly distinct from English while the KEY STRUCTURE
 * stays byte-for-byte identical to `en`. Two payoffs:
 *
 *   1. Key parity is automatic (the pseudo is derived from `en`), so the
 *      extraction-completeness pin has a real second locale to check against.
 *   2. Any user-facing string that is NOT extracted into the copy registry —
 *      a hard-coded JSX literal — stays plain English on screen while everything
 *      around it is bracketed, surfacing the leak at a glance.
 *
 * `{placeholder}` tokens are preserved untouched so interpolation still works.
 * This is a DEV/QA locale, never shipped or offered as a real language, and it
 * rides its own dynamic-import chunk (loaded only via copy/index.js
 * `loadPseudoLocale`) so it costs zero eager first-paint bytes.
 */

import { en } from './en.js';

/** BCP-47-style private-use tag for a pseudo-locale (the industry convention). */
export const PSEUDO_LOCALE_ID = 'en-XA';

// Accent map — a stable, reversible-by-eye transform of the ASCII letters most
// common in the copy. Anything unmapped passes through unchanged.
const ACCENT = Object.freeze({
  a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', y: 'ý',
  A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú', Y: 'Ý',
  c: 'ç', n: 'ñ', s: 'š',
  C: 'Ç', N: 'Ñ', S: 'Š',
});

/** Accent the letters of one plain-text run (no placeholders inside). */
function accentRun(run) {
  let out = '';
  for (const ch of run) out += ACCENT[ch] || ch;
  return out;
}

/**
 * Pseudo-transform a single string: accent the prose but leave every
 * `{placeholder}` token exactly as written, then bracket the whole so it reads
 * as unmistakably "translated".
 */
export function pseudoString(str) {
  // Split into placeholder / non-placeholder segments; only accent the latter.
  const parts = str.split(/(\{\w+\})/g);
  const body = parts
    .map((seg) => (/^\{\w+\}$/.test(seg) ? seg : accentRun(seg)))
    .join('');
  return `⟦${body}⟧`;
}

/** Recursively derive a pseudo table with `en`'s exact shape. */
function deepPseudo(node) {
  if (typeof node === 'string') return pseudoString(node);
  if (Array.isArray(node)) return Object.freeze(node.map(deepPseudo));
  if (node && typeof node === 'object') {
    const out = {};
    for (const k of Object.keys(node)) out[k] = deepPseudo(node[k]);
    return Object.freeze(out);
  }
  // Non-string leaves (none exist in `en` today) pass through unchanged.
  return node;
}

/** The pseudo-locale table — same nested shape as `en`, every string transformed. */
export const pseudo = deepPseudo(en);

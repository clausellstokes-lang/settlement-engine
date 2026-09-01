/**
 * format — small string/number formatters used across PDF sections.
 *
 * Centralised so floats don't show up as "37.80241935483871" anywhere.
 */

import { plotHookText } from '../../lib/proseSeams.js';

export function cap(s) {
  if (!s || typeof s !== 'string') return s || '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function num(n, dec = 0) {
  if (n == null || Number.isNaN(n) || n === '') return '–';
  if (typeof n !== 'number') return String(n);
  if (dec === 0) return String(Math.round(n));
  return Number(n.toFixed(dec)).toString();
}

export function pct(n, dec = 0) {
  if (n == null || Number.isNaN(n)) return '–';
  if (typeof n !== 'number') return String(n);
  return `${num(n, dec)}%`;
}

/**
 * Format a float that might appear in raw engine output (e.g. food balance,
 * safety ratio). Caps to 2 decimals, drops trailing zeros, returns '–' if null.
 */
export function smart(n) {
  if (n == null || Number.isNaN(n) || n === '') return '–';
  if (typeof n !== 'number') return String(n);
  if (Number.isInteger(n)) return String(n);
  if (Math.abs(n) >= 100) return String(Math.round(n));
  if (Math.abs(n) >= 10) return Number(n.toFixed(1)).toString();
  return Number(n.toFixed(2)).toString();
}

export function plural(n, sing, plur) {
  if (n === 1) return sing;
  return plur || sing + 's';
}

/**
 * label — extract a human-readable label from a possibly-object value.
 * Engine items are often `{ name, label, type, ... }`. Snake-case keys are
 * humanised (e.g. `iron_ore` → `Iron Ore`) so they read naturally on the page.
 */
export function label(item) {
  if (!item) return '';
  const raw = typeof item === 'string'
    ? item
    : (item.label || item.name || item.title || item.type || item.good || '');
  return humanize(raw);
}

/**
 * noteText — extract the PROSE from an object-shaped coherence note, structural
 * suggestion, or structural violation, instead of collapsing it to its bare
 * category key (pdf-2). The engine emits these shapes:
 *   - coherence note:        { type, severity, note }
 *   - structural suggestion: { type:'suggestion', reason, suggested[] }
 *   - structural violation:  { type, institution|group, reason }
 * Falls back to a description/text field, then to label() for label-shaped items,
 * so a plain string or a `{label}` item still reads exactly as before.
 */
export function noteText(item) {
  if (!item) return '';
  if (typeof item === 'string') return humanize(item);
  if (item.note) return String(item.note);
  if (item.reason) {
    const who = item.institution || item.group;
    const suggested = Array.isArray(item.suggested) && item.suggested.length
      ? ` Consider: ${item.suggested.map(label).filter(Boolean).join(', ')}.`
      : '';
    return who ? `${label(who)}: ${item.reason}${suggested}` : `${item.reason}${suggested}`;
  }
  if (item.description) return String(item.description);
  if (item.text) return String(item.text);
  return label(item);
}

/**
 * humanize — turn `snake_case`, `kebab-case`, or `camelCase` keys into Title Case.
 * Strings already containing spaces are returned as-is (with light casing).
 *
 * Idempotent: strips any ZWNJ before processing, because `\b\w` treats ZWNJ as
 * a non-word character and would otherwise cap the letter after it
 * ("Shellf[ZWNJ]ish" → "Shellf[ZWNJ]Ish" → "ShellfIsh" once the ZWNJ goes
 * invisible in the reader). noLig() no longer inserts any, but user-authored
 * data can still carry one — see stripZwnj.
 */
export function humanize(s) {
  if (!s || typeof s !== 'string') return s || '';
  // Strip ZWNJ first so re-application doesn't fabricate capital letters.
  s = stripZwnj(s);
  // If it already contains whitespace, just return as-is.
  if (/[\s/]/.test(s)) return noLig(s);
  // Insert spaces between camelCase/PascalCase boundaries first, then unify
  // separators, then title-case word boundaries.
  const out = s
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')   // camel → "camel Case"
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // ABCDef → "ABC Def"
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
  return noLig(out);
}

/**
 * hookText — extract plot-hook prose from the canonical raw/normalized shapes:
 * a bare string, `{ hook }`, or `{ text }`.
 */
export function hookText(h) {
  return noLig(plotHookText(h));
}

/**
 * sentence — capitalize first letter and ensure ends with punctuation.
 */
export function sentence(s) {
  if (!s || typeof s !== 'string') return s || '';
  const trimmed = s.trim();
  if (!trimmed) return '';
  const head = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  const out = /[.!?]$/.test(head) ? head : head + '.';
  return noLig(out);
}

/**
 * truncate — cap a string at maxLen, append ellipsis. Used for compact cards.
 */
export function truncate(s, maxLen) {
  if (!s || typeof s !== 'string') return s || '';
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen).trimEnd() + '…';
}

/**
 * finite — coerce a value to a finite number or fall back to a default. Use
 * before any arithmetic that feeds into a width/position style — `??` doesn't
 * catch NaN (`NaN ?? 0` is NaN), and `||` collapses 0 to the default. Both are
 * wrong for percentage math.
 */
export function finite(n, fallback = 0) {
  if (typeof n !== 'number') {
    const parsed = Number(n);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return Number.isFinite(n) ? n : fallback;
}

/**
 * safePct — always returns a finite number in [0, 100]. Use anywhere a
 * `${x}%` style string is built. NaN, Infinity, null, undefined → 0.
 */
export function safePct(n) {
  const v = finite(n, 0);
  if (v < 0) return 0;
  if (v > 100) return 100;
  return v;
}

/**
 * noLig — IDENTITY for strings. Retained as the declared render chokepoint; it
 * no longer mutates anything.
 *
 * ⚠ HISTORY, because emptying this body changed paid-surface bytes.
 * It used to insert a zero-width non-joiner (U+200C) between every
 * `fi`/`fl`/`ff`/`ffi`/`ffl` to block a `liga` GSUB lookup in the pre-v2 Lora
 * and Nunito faces, whose ligated glyph dropped the dotted-i. The v2 re-cut
 * REMOVED those lookups from all eight faces — measured: `availableFeatures`
 * carries no `liga`/`clig`/`dlig`/`hlig`/`rlig`, and `layout()` of a 33-char
 * ligature-bait string returns 33 glyphs, 1:1. The guard had nothing left to
 * defuse. tests/build/fontsAndMeta.test.js §3d now pins that as an executed
 * guarantee instead of prose: if it ever reds, fix the FONT — do not resurrect
 * the insertion.
 *
 * ⛔ WHAT IT STILL DID, AND WHY IT HAD TO GO. U+200C is covered by NONE of the
 * eight embedded faces. @react-pdf does not draw an uncovered codepoint as a
 * `.notdef` box — it substitutes a NON-EMBEDDED base-14 `/Helvetica` and encodes
 * by low-byte truncation. So every insertion split the text run onto an
 * unembedded font: 25–86 such runs per dossier, on 100% of exports, measured —
 * and a fallback run SWALLOWS ADJACENT COVERED CHARACTERS (one measured run
 * carried the ZWNJ *and* a legible hyphen). The cure had outlived its disease
 * and become the disease. tests/pdf/renderedFontEmbedding.test.js is the
 * render-level arm that now holds the line.
 *
 * Kept as a seam rather than deleted outright: it is the chokepoint that 39
 * `safe()` call sites and the Dense primitives render through, so a future font
 * problem has exactly one place to be fixed. Contract preserved exactly —
 * non-strings pass through, nullish becomes ''.
 */
export function noLig(s) {
  if (!s || typeof s !== 'string') return s || '';
  return s;
}

/**
 * safe — `noLig` + null guard. Use for any string about to hit the renderer.
 */
export function safe(s) {
  if (s == null) return '';
  return noLig(String(s));
}

/**
 * stripZwnj — remove any zero-width non-joiner (U+200C) from a string.
 *
 * ⚠ ITS SOURCE CHANGED, ITS VALUE DID NOT. This was written to undo noLig()'s
 * own insertions; noLig is now identity, so nothing in this codebase emits a
 * ZWNJ any more. What remains is the case that matters MORE: a ZWNJ arriving in
 * USER-AUTHORED data (custom content names, deity portfolios, tradition
 * epithets). src/domain/customContentSchema.js validates type and length only —
 * there is no charset validation anywhere in it — so a pasted ZWNJ reaches the
 * renderer, where it is covered by NONE of the eight embedded faces and would
 * split the run onto a non-embedded Helvetica. Keep this call live.
 *
 * ZWNJ also persists through `.toUpperCase()` / `textTransform: 'uppercase'` and
 * creates a line-break opportunity inside the word in some PDF readers (so
 * "Conflict" → "Conf<ZWNJ>lict" → "CONF<ZWNJ>LICT" → renders as "CONF LICT"),
 * which is why the uppercase-styled nodes (Pill, Tag, label, ChapterBand
 * eyebrow) call it rather than trusting their input.
 */
export function stripZwnj(s) {
  if (s == null) return '';
  return String(s).replace(/\u200C/g, '');
}

/**
 * upper — uppercase a string with ZWNJ stripped. Use anywhere code calls
 * `.toUpperCase()` directly (rather than relying on CSS textTransform).
 */
export function upper(s) {
  if (s == null) return '';
  return stripZwnj(s).toUpperCase();
}

/**
 * prominentPair / prominentType / prominentProse — THE reader contract for
 * `settlement.prominentRelationship`, in one place so the PDF Overview chapter,
 * the PDF Relationships chapter and the Foundry journal cannot drift apart.
 *
 * The record has exactly ONE writer, `genRelNarrative()`
 * (src/generators/power/settlementNarrative.js), and it carries exactly six
 * keys: `{ npc1, npc2, type, phrasing, full, tension }`. It describes an
 * NPC-TO-NPC edge INSIDE the settlement, not a link to another settlement:
 * `npc1`/`npc2` are canonical NPC names (pinned by
 * tests/generators/generationCertificationCorpus.test.js), `type` is the
 * archetype's human LABEL (`topRel.typeName`, e.g. "Quiet Rivalry"), `full` is
 * the archetype's description of the pair, `phrasing` the rumour sentence and
 * `tension` the friction line.
 *
 * ⚠ WHY THIS EXISTS. Every export reader used to read `otherSettlement`,
 * `relationshipType`, `description`, `summary`, `flavour` and `flavor` — six
 * keys no writer in this repo has ever produced (`otherSettlement` has never
 * once appeared under src/generators/ in the project's history). So all three
 * exports rendered the record as its bare fallback — "Neighbour · linked" with
 * an EMPTY body — while the real prose sat unread one key away. Reading the
 * keys that are actually written is the entire repair: generation is untouched.
 *
 * ⚠ `prominentProse` reads `phrasing` FIRST on purpose.
 * `prominentRelationship.phrasing` is a registered user-editable prose path
 * (src/domain/userEdits.js, src/store/settlementPendingEdits.js) and the field
 * the AI narrative refiner rewrites (supabase/functions/generate-narrative).
 * Preferring `full` would silently drop a user's own edit from their export.
 *
 * ⚠ Never humanize() an NPC name — humanize splits at an inner capital, so
 * "McTavish" would render "Mc Tavish". Names ship verbatim, exactly as every
 * other NPC surface in the app renders them.
 */
export function prominentPair(pr) {
  const a = typeof pr?.npc1 === 'string' ? pr.npc1.trim() : '';
  const b = typeof pr?.npc2 === 'string' ? pr.npc2.trim() : '';
  if (a && b) return `${a} & ${b}`;
  return a || b || '';
}

export function prominentType(pr) {
  const t = typeof pr?.type === 'string' ? pr.type.trim() : '';
  return t ? cap(t) : '';
}

export function prominentProse(pr) {
  for (const key of ['phrasing', 'full', 'tension']) {
    const v = pr?.[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

export default {
  cap, num, pct, smart, plural, label, humanize, hookText, sentence, truncate, noLig, safe,
  finite, safePct, stripZwnj, upper, prominentPair, prominentType, prominentProse,
};

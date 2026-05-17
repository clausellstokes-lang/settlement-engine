/**
 * format — small string/number formatters used across PDF sections.
 *
 * Centralised so floats don't show up as "37.80241935483871" anywhere.
 */

export function cap(s) {
  if (!s || typeof s !== 'string') return s || '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function num(n, dec = 0) {
  if (n == null || Number.isNaN(n) || n === '') return '—';
  if (typeof n !== 'number') return String(n);
  if (dec === 0) return String(Math.round(n));
  return Number(n.toFixed(dec)).toString();
}

export function pct(n, dec = 0) {
  if (n == null || Number.isNaN(n)) return '—';
  if (typeof n !== 'number') return String(n);
  return `${num(n, dec)}%`;
}

/**
 * Format a float that might appear in raw engine output (e.g. food balance,
 * safety ratio). Caps to 2 decimals, drops trailing zeros, returns '—' if null.
 */
export function smart(n) {
  if (n == null || Number.isNaN(n) || n === '') return '—';
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
 * humanize — turn `snake_case`, `kebab-case`, or `camelCase` keys into Title Case.
 * Strings already containing spaces are returned as-is (with light casing).
 *
 * Idempotent: strips any ZWNJ from prior `noLig()` calls before processing,
 * because `\b\w` treats ZWNJ as a non-word character and would otherwise
 * cap the letter after it ("Shellf[ZWNJ]ish" → "Shellf[ZWNJ]Ish" → "ShellfIsh"
 * once the ZWNJ goes invisible in the reader).
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
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
  return noLig(out);
}

/**
 * hookText — extract the text of a plot hook regardless of shape. The engine
 * emits hooks under many keys depending on which subsystem produced them
 * (NPC, conflict, viability, history, neighbour). Walk the common ones.
 */
export function hookText(h) {
  if (!h) return '';
  if (typeof h === 'string') return noLig(h);
  if (typeof h !== 'object') return noLig(String(h));
  const raw =
       h.hook
    || h.text
    || h.description
    || h.summary
    || h.prompt
    || h.title
    || h.label
    || h.body
    || h.content
    || (typeof h.value === 'string' ? h.value : null)
    || '';
  return noLig(raw);
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
 * noLig — defuse OpenType ligature substitutions that the bundled Lora fontkit
 * subset renders incorrectly (notably `fi`/`fl`/`ffi`/`ffl`, where the ligated
 * glyph drops the dotted-i and looks like the user typed `f` instead of `fi`).
 *
 * We insert a zero-width non-joiner (U+200C) between the problematic pairs so
 * fontkit can't fuse them. The character is invisible in PDF readers but
 * blocks the GSUB lookup. Apply on every string we hand to <Text> or
 * <TextInput>; idempotent (won't double-insert if already there).
 */
const ZWNJ = '\u200C';
export function noLig(s) {
  if (!s || typeof s !== 'string') return s || '';
  if (s.indexOf('f') === -1) return s;
  return s
    .replace(/ffi/g, `f${ZWNJ}f${ZWNJ}i`)
    .replace(/ffl/g, `f${ZWNJ}f${ZWNJ}l`)
    .replace(/fi/g, `f${ZWNJ}i`)
    .replace(/fl/g, `f${ZWNJ}l`)
    .replace(/ff/g, `f${ZWNJ}f`);
}

/**
 * safe — `noLig` + null guard. Use for any string about to hit the renderer.
 */
export function safe(s) {
  if (s == null) return '';
  return noLig(String(s));
}

/**
 * stripZwnj — remove the zero-width non-joiners noLig inserts. ZWNJ persists
 * through `.toUpperCase()` / `textTransform: 'uppercase'` and creates a
 * line-break opportunity inside the word in some PDF readers (so "Conflict"
 * → "Conf‌lict" → uppercased to "CONF‌LICT" → renders as "CONF LICT").
 *
 * Apply in any uppercase-styled Text node (Pill, Tag, label, ChapterBand
 * eyebrow). The Lora ligatures we need to defuse are only triggered between
 * lowercase letters anyway, so stripping ZWNJ from uppercase text is safe.
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

export default { cap, num, pct, smart, plural, label, humanize, hookText, sentence, truncate, noLig, safe, finite, safePct, stripZwnj, upper };

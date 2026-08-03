/**
 * civility.js — THE CIVILITY GUARD, one validator, two modes
 * (docs/DESIGN_PROFILE_IMAGE.md §9).
 *
 * THE ORDER, in one sentence: obscene or abusive language in text that BECOMES
 * PUBLIC is prevented — and nothing else happens to anybody. No lockouts, no
 * strikes, no shadow penalties. "The guard rejects a string, never a person."
 *
 * ── THE TWO MODES (the guard forks by the text's ORIGIN, never by its content)
 *
 *   BLOCK  — for AUTHORED-PUBLIC fields (a display name, a comment, a name
 *            renamed for a share). The text was written FOR the public, so the
 *            gate is the entry: `checkCivility` says blocked, the save/post is
 *            refused, and the author rewrites it. Nothing is stored.
 *
 *   VEIL   — for PRIVATE-ORIGIN text riding a share (a DM's own secrets, plot
 *            hooks and NPC goals that the shareDm opt-in publishes). The author
 *            wrote it in privacy and may simply have forgotten what is in it, so
 *            the share is NEVER blocked and no friction is applied: the flagged
 *            term renders VEILED on the public projection, and that is all.
 *            `veilText` / `veilDeep`.
 *
 * ⚠️ THE STORAGE LAW (binding, design §9): the veil is a PROJECTION TRANSFORM,
 * never a storage write. Nothing in this module mutates its input or is allowed
 * anywhere near a write path — the author's private text is never modified,
 * because their world is theirs, including its language. `veilDeep` builds a new
 * value and returns it; the original survives every share, unshare and reimport
 * byte-intact. The pins assert both halves (tests/lib/civility.veil.test.js).
 *
 * ── ONE VALIDATOR, TWO MIRRORS
 * This module is the CLIENT mirror. The SERVER mirror (supabase/migrations/
 * 195_civility_guard.sql: `public.civility_blocked(text)`) re-validates every
 * save/post, because client checks are courtesy and server checks are law. The
 * two mirrors share ONE test-vector file — tests/fixtures/civilityVectors.js —
 * so they cannot drift (the writer/reader-drift hazard applied to validation).
 *
 * ── THE MATCHING DISCIPLINE (the Scunthorpe defense)
 * Matching is by whole TOKEN EQUALITY over a normalized token stream — NEVER by
 * bare substring, which convicts innocent words and, in a fantasy-name product,
 * convicts them constantly. "Scunthorpe", "Cockburn", "Assassin", "Bass",
 * "Analysis" and "Class" are not flagged because they are not the token; no
 * allowlist entry is needed to save them. The normalizer folds casual evasion
 * (case, diacritics, homoglyphs, leet digits, repeated characters, zero-width
 * padding, and letters spaced apart) onto the same token the list carries.
 *
 * ── HONESTY ABOUT THE CEILING (recorded so nobody oversells this)
 * Normalization catches casual evasion. DETERMINED evasion beats any filter,
 * and this one is no exception — a novel spelling, an unlisted language, an
 * infix, or a word the list does not carry all pass. The guard is a CIVILITY
 * FLOOR; the backstop is the existing report + admin-remove lane. Two layers,
 * named as two on purpose. Specific known gaps:
 *   • Only the closed suffix set below is tolerated; prefixed forms are missed.
 *   • Splitting a word into chunks longer than two characters ("fuc k") is missed.
 *   • The lists are English-centric (design §9, "Limitations recorded").
 *
 * ── NO ECHO, BY CONSTRUCTION
 * `checkCivility` returns ONLY `{ blocked, version }` — it deliberately does not
 * return WHICH term matched, so no refusal surface can accidentally echo the
 * matched word back at the author. The design's refusal copy is
 * non-accusatory and offers a mistake path; the span finder that the veil needs
 * is module-private for the same reason.
 *
 * Pure: no DOM, no network, no store, no I/O. Safe in a worker or in SQL-parity
 * tests.
 */

import { ALLOW, CIVILITY_LIST_VERSION, PHRASES, TERMS } from '../data/civilityLists.js';

export { CIVILITY_LIST_VERSION };

/** The mark a veiled term renders as. Fixed width, so it leaks no term length. */
export const VEIL_MARK = '▒▒▒';

/**
 * Characters that carry no glyph but can pad a word apart — zero-width space /
 * non-joiner / joiner, the bidi marks, word joiner, Mongolian vowel separator,
 * BOM, and the soft hyphen. Stripped before any other fold, so a word padded
 * with them normalizes to the same token as the bare word.
 *
 * ⚠️ WRITTEN AS NUMERIC CODE POINTS ON PURPOSE. Pasting the literal characters
 * into a regex class here would put invisible bytes in the source — unreviewable
 * in a diff, silently lost to an editor's whitespace trim, and exactly the
 * authored-invisible-byte hazard tests/lint/controlBytes.test.js exists to
 * catch. Numbers stay legible and diffable.
 */
const ZERO_WIDTH_CODEPOINTS = new Set([
  0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0x2060, 0x180e, 0xfeff, 0x00ad,
]);

/**
 * Homoglyph folds — visually identical letters from other scripts. Cyrillic and
 * Greek lookalikes are the ones that actually appear in evasion attempts, so
 * those are what the table carries; other confusable blocks (fullwidth Latin,
 * Cherokee, mathematical alphanumerics) are NOT folded, and that gap is one of
 * the ceiling limitations the module header records rather than hides.
 */
const HOMOGLYPHS = Object.freeze({
  // Cyrillic
  а: 'a', е: 'e', о: 'o', р: 'p', с: 'c', у: 'y', х: 'x', к: 'k', м: 'm',
  н: 'h', т: 't', в: 'b', і: 'i', ѕ: 's', ј: 'j', ԁ: 'd', ɡ: 'g',
  // Greek
  ο: 'o', ι: 'i', κ: 'k', ν: 'v', ρ: 'p', τ: 't', υ: 'u', χ: 'x', α: 'a',
  ε: 'e', ѵ: 'v',
});

/**
 * Leet folds. Applied unconditionally: token-EQUALITY matching means a stray
 * fold inside an innocent word ("Population 4500" → "population asoo") cannot
 * produce a match unless the whole token lands on a listed word.
 */
const LEET = Object.freeze({
  0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', 9: 'g',
  '@': 'a', $: 's', '!': 'i', '|': 'i', '+': 't', '£': 'l', '€': 'e',
});

/**
 * The closed suffix set a blocked stem tolerates. Deliberately small: every
 * addition widens the false-positive surface, and the guard is a floor.
 */
const SUFFIXES = Object.freeze(['s', 'es', 'ed', 'er', 'ers', 'ing', 'ings', 'y', 'ty']);

/** Longest short-token run we will re-join when hunting spaced-out evasion. */
const MAX_JOIN_TOKENS = 8;

/** A token counts as "short" (a possible evasion fragment) at this length or below. */
const SHORT_TOKEN_LEN = 2;

/** Collapse runs of one repeated character: `fuuuck` → `fuck`, `shit` → `shit`. */
function squeeze(word) {
  let out = '';
  for (let i = 0; i < word.length; i += 1) {
    if (word[i] !== word[i - 1]) out += word[i];
  }
  return out;
}

/**
 * The list, folded through the SAME normalizer the candidate text goes through —
 * built once. An entry is stored with both its raw and squeezed forms so the
 * dual-form match below can require a length floor (see `matchesEntry`).
 */
function foldEntry(entry) {
  const raw = String(entry || '');
  return { raw, squeezed: squeeze(raw) };
}

const BLOCK_ENTRIES = Object.freeze(TERMS.map(foldEntry));
const PHRASE_ENTRIES = Object.freeze(PHRASES.map((phrase) => phrase.map(foldEntry)));
const ALLOW_SET = new Set(ALLOW.map((word) => String(word || '')));

/**
 * Does a normalized token match a list entry?
 *
 * Two forms, and the second carries a LENGTH FLOOR that is load-bearing. Repeat
 * collapsing is what catches `shiiiit`, but it also collapses the LIST's own
 * doubled letters — and the shortened entries land on real words. The squeezed
 * form of the racial slur on the list is `niger`, which is a country and a
 * river; the squeezed form of the homophobic slur is `fagot`, which is a bundle
 * of sticks and a bassoon. Requiring the candidate to be at least as long as the
 * entry it squeezed onto clears both of those words while still catching
 * `niggger` and every other over-repeated evasion. Without the floor this guard
 * would refuse the names of places and instruments — which, in a product about
 * inventing places, is the expensive failure.
 *
 * Pinned from both sides by the Scunthorpe and evasion vector sets.
 */
function matchesEntry(token, entry) {
  if (token === entry.raw) return true;
  return squeeze(token) === entry.squeezed && token.length >= entry.raw.length;
}

/**
 * `matchesEntry`, plus the closed suffix set applied to the candidate.
 *
 * THE SILENT-E RESTORATION is not cosmetic. English drops a stem's final `e`
 * before a vowel-initial suffix, so `rape` + `ing` is spelled `raping` and
 * stripping `ing` yields `rap` — which matches nothing. Every inflected form of
 * an `e`-final entry would slip through without this. So each stripped stem is
 * tried BOTH as-is and with the `e` put back.
 */
function matchesEntryWithSuffix(token, entry) {
  if (matchesEntry(token, entry)) return true;
  for (const suffix of SUFFIXES) {
    if (token.length > suffix.length && token.endsWith(suffix)) {
      const stem = token.slice(0, -suffix.length);
      if (matchesEntry(stem, entry)) return true;
      if (matchesEntry(`${stem}e`, entry)) return true;
    }
  }
  return false;
}

/**
 * Fold one code point to zero or more normalized characters.
 * Returns '' for anything that should vanish (zero-width, combining marks).
 */
function foldCodePoint(cp) {
  if (ZERO_WIDTH_CODEPOINTS.has(cp.codePointAt(0) ?? -1)) return '';
  // NFD then drop combining marks: `é` → `e`, `ñ` → `n`.
  const stripped = cp.normalize('NFD').replace(/\p{M}/gu, '');
  if (!stripped) return '';
  let out = '';
  for (const ch of stripped.toLowerCase()) {
    out += HOMOGLYPHS[ch] || LEET[ch] || ch;
  }
  return out;
}

/**
 * Normalize `text` into TOKENS that each remember where they came from in the
 * ORIGINAL string. The provenance is what makes the veil possible: the mask has
 * to replace the author's actual characters, not the folded ones.
 *
 * Exported for the pins (tests assert the fold directly) — not for consumers,
 * who want `checkCivility` / `veilText`.
 *
 * @param {unknown} text
 * @returns {Array<{ raw: string, start: number, end: number }>} tokens in order
 */
export function normalizeTokens(text) {
  const source = typeof text === 'string' ? text : '';
  /** @type {Array<{ c: string, start: number, end: number }>} */
  const chars = [];
  let index = 0;
  for (const cp of source) {
    const width = cp.length;
    const folded = foldCodePoint(cp);
    for (const c of folded) {
      chars.push({ c, start: index, end: index + width });
    }
    index += width;
  }

  /** @type {Array<{ raw: string, start: number, end: number }>} */
  const tokens = [];
  /** @type {{ raw: string, start: number, end: number } | null} */
  let current = null;
  for (const entry of chars) {
    const isWord = (entry.c >= 'a' && entry.c <= 'z') || (entry.c >= '0' && entry.c <= '9');
    if (!isWord) { current = null; continue; }
    if (!current) {
      current = { raw: entry.c, start: entry.start, end: entry.end };
      tokens.push(current);
    } else {
      current.raw += entry.c;
      current.end = entry.end;
    }
  }
  return tokens;
}

/**
 * Every candidate the matcher considers: the real tokens, plus the SYNTHETIC
 * re-joins of short adjacent tokens that catch spaced-out evasion (`f u c k`,
 * `fu ck`, `n i g g e r`). Sub-runs are generated, not just maximal runs, so a
 * fragment sitting inside a longer run of short words is still found.
 */
function candidates(tokens) {
  const out = tokens.map((token) => ({ raw: token.raw, start: token.start, end: token.end }));
  let runStart = 0;
  while (runStart < tokens.length) {
    if (tokens[runStart].raw.length > SHORT_TOKEN_LEN) { runStart += 1; continue; }
    let runEnd = runStart;
    while (runEnd + 1 < tokens.length && tokens[runEnd + 1].raw.length <= SHORT_TOKEN_LEN) runEnd += 1;
    for (let i = runStart; i <= runEnd; i += 1) {
      const limit = Math.min(runEnd, i + MAX_JOIN_TOKENS - 1);
      let joined = tokens[i].raw;
      for (let j = i + 1; j <= limit; j += 1) {
        joined += tokens[j].raw;
        out.push({ raw: joined, start: tokens[i].start, end: tokens[j].end });
      }
    }
    runStart = runEnd + 1;
  }
  return out;
}

/**
 * The spans of `text` that carry a flagged term, in ORIGINAL-string coordinates,
 * merged and sorted. MODULE-PRIVATE on purpose: exporting it would hand every
 * refusal surface the matched term, and the design forbids echoing it.
 *
 * @param {unknown} text
 * @returns {Array<{ start: number, end: number }>}
 */
function flaggedSpans(text) {
  const tokens = normalizeTokens(text);
  if (tokens.length === 0) return [];

  /** @type {Array<{ start: number, end: number }>} */
  const spans = [];

  for (const candidate of candidates(tokens)) {
    if (ALLOW_SET.has(candidate.raw)) continue;
    for (const entry of BLOCK_ENTRIES) {
      if (matchesEntryWithSuffix(candidate.raw, entry)) {
        spans.push({ start: candidate.start, end: candidate.end });
        break;
      }
    }
  }

  // Phrases match consecutive REAL tokens (a phrase spelled across synthetic
  // re-joins would be indistinguishable from an ordinary sentence).
  for (const phrase of PHRASE_ENTRIES) {
    if (phrase.length === 0) continue;
    for (let i = 0; i + phrase.length <= tokens.length; i += 1) {
      let hit = true;
      for (let j = 0; j < phrase.length; j += 1) {
        if (!matchesEntryWithSuffix(tokens[i + j].raw, phrase[j])) { hit = false; break; }
      }
      if (hit) spans.push({ start: tokens[i].start, end: tokens[i + phrase.length - 1].end });
    }
  }

  if (spans.length === 0) return [];
  spans.sort((a, b) => a.start - b.start || a.end - b.end);
  /** @type {Array<{ start: number, end: number }>} */
  const merged = [];
  for (const span of spans) {
    const last = merged[merged.length - 1];
    if (last && span.start <= last.end) last.end = Math.max(last.end, span.end);
    else merged.push({ start: span.start, end: span.end });
  }
  return merged;
}

/**
 * BLOCK MODE — is this AUTHORED-PUBLIC text refused?
 *
 * The shape is exactly the `CivilityGuard` contract the Founders' Hall declares
 * for its injected seam (src/lib/foundersHall.js `HALL_CIVILITY_GUARD`), so this
 * function can be passed straight in wherever that seam is wired.
 *
 * Returns no term, by construction — see the module header's "no echo" note.
 *
 * @param {unknown} text
 * @returns {{ blocked: boolean, version: string }}
 */
export function checkCivility(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return { blocked: false, version: CIVILITY_LIST_VERSION };
  }
  return { blocked: flaggedSpans(text).length > 0, version: CIVILITY_LIST_VERSION };
}

/**
 * VEIL MODE — the projection transform for PRIVATE-ORIGIN text riding a share.
 *
 * Returns a NEW string with each flagged span replaced by `VEIL_MARK`. Never
 * blocks, never punishes, never writes. When nothing is flagged the SAME string
 * instance comes back, so a clean payload is untouched and cheap.
 *
 * @param {unknown} text
 * @returns {unknown} the veiled string, or the input unchanged when not a string
 */
export function veilText(text) {
  if (typeof text !== 'string' || text.length === 0) return text;
  const spans = flaggedSpans(text);
  if (spans.length === 0) return text;
  let out = '';
  let cursor = 0;
  for (const span of spans) {
    out += text.slice(cursor, span.start) + VEIL_MARK;
    cursor = span.end;
  }
  return out + text.slice(cursor);
}

/**
 * VEIL MODE, applied across a whole public projection.
 *
 * Walks arrays and plain objects and veils every string leaf, returning a NEW
 * value. Non-plain values (Date, Map, class instances, functions) are returned
 * as-is rather than reconstructed — a public settlement projection carries only
 * JSON shapes, and rebuilding an exotic type here would be a silent data change.
 *
 * ⚠️ NEVER call this on a value bound for storage. It is a read/serialize-side
 * transform only (the §9 storage law).
 *
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function veilDeep(value) {
  if (typeof value === 'string') return /** @type {T} */ (/** @type {unknown} */ (veilText(value)));
  if (Array.isArray(value)) return /** @type {T} */ (/** @type {unknown} */ (value.map(veilDeep)));
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [key, child] of Object.entries(value)) out[key] = veilDeep(child);
    return /** @type {T} */ (/** @type {unknown} */ (out));
  }
  return value;
}

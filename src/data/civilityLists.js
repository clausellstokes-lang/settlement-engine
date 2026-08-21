/**
 * civilityLists.js — THE CIVILITY LISTS (docs/DESIGN_PROFILE_IMAGE.md §9).
 *
 * These are DATA, not code. The design's ruling: "Both lists are DATA (authored,
 * versioned, updatable without code); severity is one class in v1 (blocked is
 * blocked)." Editing this file is a content change — no validator logic lives
 * here, and no consumer imports it except src/lib/civility.js (the ONE validator).
 *
 * ⚠️ THE ENTRIES ARE WRITTEN IN THEIR NORMALIZED FORM, and the validator folds
 * every candidate through the SAME normalizer before comparing (civility.js
 * `normalizeTokens`). So an entry must be lower-case a–z0–9 only: no spaces
 * inside a word, no punctuation, no capitals. A multi-word phrase is expressed
 * as an array of word tokens in PHRASES, never as a spaced string in TERMS.
 *
 * WHY THE LIST IS SMALL AND CLINICAL. The guard is a CIVILITY FLOOR, not a
 * content-moderation product (§9's "honesty about the ceiling"). Its job is to
 * stop the casual, obvious case at the moment text becomes public; determined
 * evasion is explicitly out of scope and the backstop is the report + admin
 * lane. A sprawling list buys very little additional catch and costs a great
 * deal in false positives — which, in a FANTASY-NAME product full of invented
 * words, are the expensive failure. The seed below is the set already ruled
 * blockable by migration 075's `reserved_external_names` profanity guard (the
 * product's existing, shipped judgment about which words it refuses), carried
 * forward verbatim so the two surfaces cannot disagree about what is blocked.
 *
 * GROWING THE LIST is a content decision for the owner, not an engineering one.
 * Bump CIVILITY_LIST_VERSION whenever TERMS/PHRASES/ALLOW change, so a stored
 * verdict can be told apart from a verdict under a later list.
 *
 * i18n: the v1 lists are English-centric, recorded as a known limitation in the
 * design (§9 "Limitations recorded"). Adding a language is a list version bump,
 * not a code change — which is exactly why the lists live in their own file.
 */

/**
 * The list version. Bump on ANY edit to TERMS / PHRASES / ALLOW below.
 * Consumers may record it beside a verdict; nothing branches on it.
 * @type {string}
 */
export const CIVILITY_LIST_VERSION = '1.0.0';

/**
 * Blocked single words, in normalized form (lower-case, a–z0–9, no separators).
 *
 * PROVENANCE: migration 075's `reserved_external_names` profanity seed — the
 * words this product has already decided it will not carry on a public name.
 * Kept identical so the display-name RPC and this guard never diverge on the
 * question "is this word refused here".
 *
 * @type {ReadonlyArray<string>}
 */
export const TERMS = Object.freeze([
  'fuck',
  'shit',
  'bitch',
  'cunt',
  'nigger',
  'faggot',
  'rape',
  'nazi',
]);

/**
 * Blocked multi-word phrases, as arrays of normalized word tokens.
 *
 * A phrase exists for the case where no single word is blockable but the
 * sequence is — the tokens are matched consecutively over the normalized token
 * stream. Empty in v1: every seeded entry above is a single word, and inventing
 * phrase entries without an owner content ruling would be the validator
 * authoring policy rather than enforcing it.
 *
 * @type {ReadonlyArray<ReadonlyArray<string>>}
 */
export const PHRASES = Object.freeze([]);

/**
 * THE ALLOWLIST — normalized whole words that are NEVER flagged, even when a
 * fold would otherwise collide them with a TERMS entry (§9's "an ALLOWLIST
 * rides beside the blocklist for known collisions").
 *
 * It is deliberately near-empty in v1, and that is a STRENGTH signal rather
 * than an omission: the validator matches whole TOKENS, never substrings, so
 * the classic collisions (Scunthorpe, Cockburn, Assassin, Bass, Class,
 * Analysis, Shitake-as-part-of-a-longer-word) never reach the list at all —
 * they simply are not the token. The allowlist exists for the residual case a
 * fold creates: a legitimate word that, after diacritic/homoglyph/leet folding
 * and repeat collapsing, lands exactly on a blocked entry. Add entries here
 * when a real false positive is reported; do not speculate them in.
 *
 * @type {ReadonlyArray<string>}
 */
export const ALLOW = Object.freeze([]);

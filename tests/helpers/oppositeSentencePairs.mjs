/**
 * oppositeSentencePairs.mjs — THE ONE HOME of the pairs of sentences that read as opposite on one page (DISAGREE, PROSE-6;
 * the owner's order of 2026-11-22, "Can you fix these:"; the lines the chair took, `docs/chair/2026-11-20/content/prose/lines/
 * DISAGREE-LINES.md`). A helper, never a suite; read by `tests/domain/oppositeSentencePairs.test.js`. Pure.
 *
 * ONE ROW A PAIR, keyed by desk, position (the block), pool and variant ids, never by a sentence's text. A new pair is one row.
 * The texts are read from the generated leaves, and each side is matched against the page by template: the text
 * regex-escaped, each `{slot}` a lazy wildcard, "the town" as "the" and any one word (the tier noun the composer speaks),
 * the first letter either case, the final stop dropped. THE PAGE CUTS A LINE AT A CLAUSE (it prints GEN-17 GARRISONED v2 as
 * "The town pays wages for its defense as well as keeping its walls.": DISAGREE-PHASE1.md), so a side also matches each of
 * its variants' clause prefixes (cut at ", " "; " ": ", closed by a stop), except a prefix of fewer than four literal words
 * and a prefix some variant of the same pool OUTSIDE the side also yields (it cannot name the variant).
 */
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';

/** @typedef {{ desk: 'defense'|'economy'|'general', position: string, pool: string, vids: ReadonlyArray<number> }} PairSide */
/** @typedef {{ id: string, a: PairSide, b: PairSide }} OppositePair */

const side = (/** @type {PairSide} */ s) => Object.freeze({ ...s, vids: Object.freeze([...s.vids]) });

/** @type {ReadonlyArray<Readonly<OppositePair>>} */
export const OPPOSITE_PAIRS = Object.freeze([
  // FOOD: the food trades fail to put food by, beside a table where food is no worry (the siege's v5, v6 stand apart; v2 is
  // flat for this pair by the chair's final lines, 18a9791b3).
  Object.freeze({ id: 'FOOD',
    a: side({ desk: 'defense', position: 'DS-DEF-2', pool: 'CHAIN: food trades failing', vids: [1, 2, 3, 4] }),
    b: side({ desk: 'economy', position: 'DS-ECO-9', pool: 'SECURE', vids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }) }),
  // WAGES HAS NO ROW (the chair, 2026-11-23 03:55 UTC): DS-DEF-2 Economic Survival: WEAK v1 and v2 were re-worded in place
  // (their WORD_CORRECTIONS rows), so no pair of variant ids is left; their OLD words are pinned at 0 pages
  // (`PINNED_OLD_WORDS`).
  // PROSE-E (the chair, N70): P1-P4's TRUE pairs were cured by re-wording in place (five WORD_CORRECTIONS rows,
  // CHAIR-2026-11-23-N70), so none of them is a row; their OLD words are pinned at 0 pages. This row is WATCHED: CRITICAL v1
  // said "cannot fund a response to anything" beside GARRISONED v1's people under arms (dz-village-7, under siege); v2 ("has
  // no money to meet trouble") and v3 ("could not pay for a bad month") co-printed with it on 0 of the 900
  // (map/DISAGREE-E-PHASE1.md) and are not re-worded: they stay at 0 here. (NO-MARKET v12 × ECO-10 `established` is NOT a
  // row: v12 prints only as the cut "{settlement} has no market.", under the matcher's floor; its tail is `PINNED_TAILS`.)
  Object.freeze({ id: 'CRITICAL v2-v3 x GARRISONED v1 (watched)',
    a: side({ desk: 'defense', position: 'DS-DEF-2', pool: 'Economic Survival: CRITICAL', vids: [2, 3] }),
    b: side({ desk: 'general', position: 'DS-GEN-17', pool: 'GARRISONED', vids: [1] }) }),
]);

/**
 * THE CLAUSES PINNED AT 0 PAGES: a variant's tail after its first clause cut, which the page never prints (the page cuts the
 * line there). GEN-17 GARRISONED v2's "and the money is found every season" printed on 0 of the 900 (DISAGREE-PHASE1.md);
 * the row that makes the source match the page was built by WORDS-2 E9 (the tenth chair's E9), and its old words moved to
 * PINNED_OLD_WORDS.
 * @type {ReadonlyArray<Readonly<{ id: string, side: PairSide }>>}
 */
export const PINNED_TAILS = Object.freeze([
  // GEN-17 GARRISONED v2's tail LEFT this table (WORDS-2 E9, the tenth chair's E9): the source was corrected to what the page
  // prints (its WORD_CORRECTIONS row), so no tail is left to hold; its old words are pinned at 0 pages in PINNED_OLD_WORDS.
  // The chair, N71 (PROSE-E): GEN-13 NO-MARKET v12 draws (46 of the 900 pages, every one beside ECO-10 `POSTURE: established`)
  // and the site mount prints it cut, "{settlement} has no market." (`generalDeskRead.js :: siteClause`); its tail, "and trades
  // in a small way: a sack here, a bundle there, carried between neighbours", would read as NO-MARKET v10's old words did
  // beside `established`, so it is held at 0 pages. Not re-worded: no page prints it.
  Object.freeze({ id: 'GEN-13 NO-MARKET v12 tail', side: side({ desk: 'general', position: 'DS-GEN-13', pool: 'NO-MARKET', vids: [12] }) }),
]);

/**
 * THE OLD WORDS PINNED AT 0 PAGES: a variant re-worded in place (its WORD_CORRECTIONS row in
 * `scripts/generate-dossier-state-prose.mjs`) whose former words must never print again. The leaf no longer holds them,
 * so they are written here once, keyed by pool and vid, and matched by the same template as every side.
 * @type {ReadonlyArray<Readonly<{ id: string, side: PairSide, text: string }>>}
 */
export const PINNED_OLD_WORDS = Object.freeze([
  Object.freeze({ id: 'DS-GEN-17 GARRISONED v2, the old words (TENTH-CHAIR-E9)',
    side: side({ desk: 'general', position: 'DS-GEN-17', pool: 'GARRISONED', vids: [2] }),
    text: '{settlement} pays wages for its defense as well as keeping its walls, and the money is found every season.' }),
  Object.freeze({ id: 'DS-DEF-2 Economic Survival: WEAK v1, the old words (CHAIR-2026-11-23-03:55)',
    side: side({ desk: 'defense', position: 'DS-DEF-2', pool: 'Economic Survival: WEAK', vids: [1] }),
    text: '{settlement} is always short of money for its defence: no money is laid by to pay for a long one, and whoever is called to make one knows it.' }),
  Object.freeze({ id: 'DS-DEF-2 Economic Survival: WEAK v2, the old words (CHAIR-2026-11-23-03:45)',
    side: side({ desk: 'defense', position: 'DS-DEF-2', pool: 'Economic Survival: WEAK', vids: [2] }),
    text: 'The people who would have to hold {settlement} through something know there is no money to pay them for it.' }),
  // PROSE-E (the chair, N70; lines `lines/DISAGREE-E-LINES.md`, FINAL at 24d8edf83): five lines re-worded in place, each by
  // its WORD_CORRECTIONS row (ruling CHAIR-2026-11-23-N70); on the uncured leaves each printed on the measure's seeds.
  Object.freeze({ id: 'DS-GEN-13 NO-MARKET v10, the old words (CHAIR-2026-11-23-N70)',
    side: side({ desk: 'general', position: 'DS-GEN-13', pool: 'NO-MARKET', vids: [10] }),
    text: 'Trade at {settlement} goes as far as neighbours can carry it between themselves, and there is no market to take it beyond that.' }),
  Object.freeze({ id: 'DS-DEF-2 Internal Security: full legal chain v1, the old words (CHAIR-2026-11-23-N70)',
    side: side({ desk: 'defense', position: 'DS-DEF-2', pool: 'Internal Security: full legal chain (court AND prison)', vids: [1] }),
    text: 'Offenders at {settlement} are arrested, heard and held, and each case is written down, so people expect a hearing, not a beating.' }),
  Object.freeze({ id: 'DS-DEF-2 Internal Security: full legal chain v2, the old words (CHAIR-2026-11-23-N70)',
    side: side({ desk: 'defense', position: 'DS-DEF-2', pool: 'Internal Security: full legal chain (court AND prison)', vids: [2] }),
    text: "A thing done wrong at {settlement} goes somewhere and takes time, and the town has come to rely on that rather than on the watch's temper." }),
  Object.freeze({ id: 'DS-DEF-2 CHAIN: food trades working v1, the old words (CHAIR-2026-11-23-N70)',
    side: side({ desk: 'defense', position: 'DS-DEF-2', pool: 'CHAIN: food trades working', vids: [1] }),
    text: "{settlement}'s food trades are working, and what they put by means the town would not run short at once if it were cut off." }),
  Object.freeze({ id: 'DS-DEF-2 Economic Survival: CRITICAL v1, the old words (CHAIR-2026-11-23-N70)',
    side: side({ desk: 'defense', position: 'DS-DEF-2', pool: 'Economic Survival: CRITICAL', vids: [1] }),
    text: "{settlement} cannot fund a response to anything. Any sustained pressure exhausts the town's capacity almost immediately and then continues." }),
]);

const LEAVES = Object.freeze({ defense: DOSSIER_STATE_PROSE_DEFENSE, economy: DOSSIER_STATE_PROSE_ECONOMY, general: DOSSIER_STATE_PROSE_GENERAL });

/** @param {PairSide} s @returns {ReadonlyArray<{ vid: number, text: string, wordings?: string[] }>} the side's whole pool */
export function poolOf(s) {
  const pool = /** @type {any} */ (LEAVES)[s.desk]?.[s.position]?.pools?.[s.pool];
  if (!Array.isArray(pool)) throw new Error(`oppositeSentencePairs: no pool ${s.desk} ${s.position} [${s.pool}]`);
  return pool;
}

/** @param {PairSide} s @returns {string[]} the texts (and wordings) of the side's variants, from the leaf */
export function textsOf(s) {
  const pool = poolOf(s);
  for (const vid of s.vids) if (!pool.some((v) => v.vid === vid)) throw new Error(`oppositeSentencePairs: no v${vid} in [${s.pool}]`);
  return pool.filter((v) => s.vids.includes(v.vid)).flatMap((v) => [v.text, ...(v.wordings || [])]);
}

/** @param {string} s */
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** @param {string} body @returns {{ source: string, literalWords: number }} */
function pattern(body) {
  let source = '';
  let literal = '';
  for (const part of body.split(/(\{[a-zA-Z]+\}|[Tt]he town)/)) {
    if (/^\{[a-zA-Z]+\}$/.test(part)) source += '.+?';
    else if (/^[Tt]he town$/.test(part)) { source += '[Tt]he \\S+'; literal += ' the '; }
    else { source += esc(part); literal += part; }
  }
  const c = source[0];
  if (/[A-Za-z]/.test(c)) source = `[${c.toUpperCase()}${c.toLowerCase()}]` + source.slice(1);
  return { source, literalWords: literal.split(/\s+/).filter((w) => /\w/.test(w)).length };
}

/** @param {string} text @returns {{ full: string, cuts: string[] }} the template sources of one text */
function formsOf(text) {
  const body = text.trim().replace(/[.!?]$/, '');
  const cuts = [...body.matchAll(/[,;:] /g)].map((m) => pattern(body.slice(0, m.index)))
    .filter((p) => p.literalWords >= 4).map((p) => `${p.source}\\.`);
  return { full: pattern(body).source, cuts };
}

/** @type {WeakMap<PairSide, ReadonlyArray<RegExp>>} */
const MATCHERS = new WeakMap();

/**
 * The side's matcher: every template (full and admitted cut) of its variants.
 * @param {PairSide} s @returns {ReadonlyArray<RegExp>}
 */
export function matchersOf(s) {
  const held = MATCHERS.get(s);
  if (held) return held;
  const outside = new Set(poolOf(s).filter((v) => !s.vids.includes(v.vid))
    .flatMap((v) => [v.text, ...(v.wordings || [])]).flatMap((t) => { const f = formsOf(t); return [f.full, ...f.cuts]; }));
  const sources = new Set(textsOf(s).flatMap((t) => { const f = formsOf(t); return [f.full, ...f.cuts.filter((c) => !outside.has(c))]; }));
  const res = Object.freeze([...sources].map((src) => new RegExp(src)));
  MATCHERS.set(s, res);
  return res;
}

/**
 * The pinned tail's matcher: each of the side's texts after its first clause cut (", " "; " ": "), as a template.
 * @param {PairSide} s @returns {ReadonlyArray<RegExp>}
 */
export function tailMatchersOf(s) {
  return Object.freeze(textsOf(s).map((t) => {
    const m = /[,;:] /.exec(t);
    if (!m) throw new Error(`oppositeSentencePairs: no clause cut in "${t}"`);
    return new RegExp(pattern(t.slice(m.index + 2).trim().replace(/[.!?]$/, '')).source);
  }));
}

/**
 * The old words' matcher: the text's template and its clause-cut forms, but a cut the variant's NEW words also yield (PROSE-E:
 * CHAIN working v1 keeps its first clause, "{settlement}'s food trades are working,"), or that IS the new words whole (WORDS-2
 * E9: GEN-17 GARRISONED v2's old words cut at their tail are its new words) — that cut is not the old words. While the leaf
 * still holds the old text (before the cure), nothing is excluded, so the pin reads the old words whole.
 * @param {{ text: string, side: PairSide }} pin @returns {ReadonlyArray<RegExp>}
 */
export function oldWordsMatchersOf(pin) {
  const f = formsOf(pin.text);
  const current = textsOf(pin.side);
  const shared = current.includes(pin.text)
    ? new Set()
    : new Set(current.flatMap((t) => { const g = formsOf(t); return [`${g.full}\\.`, ...g.cuts]; }));
  return Object.freeze([f.full, ...f.cuts.filter((c) => !shared.has(c))].map((src) => new RegExp(src)));
}

/** @param {unknown} printProse `buildPrintProse(s, {})` @returns {string[]} every mount's text */
export function pageTextsOf(printProse) {
  return Object.values(/** @type {Record<string, unknown>} */ (printProse || {}))
    .flatMap((mounts) => Object.values(/** @type {Record<string, unknown>} */ (mounts || {})).map(String));
}

/** @param {ReadonlyArray<RegExp>} res @param {ReadonlyArray<string>} texts */
export const sidePrinted = (res, texts) => texts.some((t) => res.some((re) => re.test(t)));

/**
 * The rows both of whose sides print on one page.
 * @param {ReadonlyArray<string>} texts the page's mount texts @returns {string[]} the rows' ids
 */
export function oppositePairsOnPage(texts) {
  return OPPOSITE_PAIRS.filter((p) => sidePrinted(matchersOf(p.a), texts) && sidePrinted(matchersOf(p.b), texts)).map((p) => p.id);
}

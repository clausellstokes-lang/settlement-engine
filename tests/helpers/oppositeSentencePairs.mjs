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
  // WAGES: no money to pay the defenders, beside a town that pays wages for its defence.
  Object.freeze({ id: 'WAGES',
    a: side({ desk: 'defense', position: 'DS-DEF-2', pool: 'Economic Survival: WEAK', vids: [1, 2] }),
    b: side({ desk: 'general', position: 'DS-GEN-17', pool: 'GARRISONED', vids: [2] }) }),
]);

/**
 * THE CLAUSES PINNED AT 0 PAGES: a variant's tail after its first clause cut, which the page never prints (the page cuts the
 * line there). GEN-17 GARRISONED v2's "and the money is found every season" printed on 0 of the 900 (DISAGREE-PHASE1.md);
 * the row that makes the source match the page is on the chair's list for after the first deploy.
 * @type {ReadonlyArray<Readonly<{ id: string, side: PairSide }>>}
 */
export const PINNED_TAILS = Object.freeze([
  Object.freeze({ id: 'GEN-17 GARRISONED v2 tail', side: side({ desk: 'general', position: 'DS-GEN-17', pool: 'GARRISONED', vids: [2] }) }),
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

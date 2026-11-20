/**
 * domain/display/outputInWords.js — WHAT THE TOWN'S WORK YIELDS, IN WORDS (PAGE-1's OUTPUT unit, F3b; BUILD.md
 * of 2026-11-20). The one reader every surface that used to print the economy's output figure calls.
 *
 * WHY. The Economics header printed `economicState.compound.economyOutput` as "n/100" beside the prosperity word,
 * and the PDF's Economics strip printed it bare. The figure is the economy dial after its drags
 * (`generators/priorityHelpers.js :: getInstFlags`, the economy output block): it never passed 50 in the chair's
 * 300 towns, and it stood two steps from the prosperity word (another model's) in 36% of them. A grade out of 100
 * beside a word it cannot agree with tells the DM nothing true. This reader says instead, in plain words, how much
 * of what its own work could yield the town makes, and which drag holds it back most.
 *
 * WHAT IT READS, ALL STORED ON THE RECORD AT BIRTH (`economicState.compound`, stamped once):
 *   - the figure: `compound.economyOutput`;
 *   - what the work could yield: the town's own economy dial, `compound.raw.economy`;
 *   - the share: the one over the other (two stored numbers; nothing the generator decided is redone);
 *   - the drags' own inputs: the market (`compound.inst.hasMarket`), crime (`compound.criminalEffective`), the
 *     magic dial (`compound.raw.magic`), the crises the generator read (`config.stressTypes` / `config.stressType`),
 *     the neighbour (`config.neighborRelationship.relationshipType`).
 *
 * ⚠ THE DRAGS' WEIGHTS ARE NOT STORED. The generator multiplies the dial by one factor a drag and keeps only the
 * product. To say which drag holds the town back MOST the page has to weigh them, so `factorsOf` below mirrors the
 * generator's own weights (priorityHelpers.js, the economy output block and its `economyStressMult` table). ⛔ IT
 * NEVER ASSERTS A DRAG THE RECORD CONTRADICTS: before it names one, it multiplies the dial by every factor it read
 * and checks the product against the STORED figure (`agreesWithRecord`). A record the mirror does not reproduce
 * exactly (a legacy save, an edited config, a later change to the generator's weights) gets the share alone, never
 * a named drag. `tests/domain/display/outputInWords.test.jsx` holds the mirror to the born towns, where it
 * reproduces every stored figure (and docs/chair/2026-11-20/content/page/build/OUTPUT/ holds it to
 * the chair's 300 and the census's 720: every one read).
 *
 * WHAT IT SAYS (no figure out of 100, none of the model's working):
 *   "It gets about three parts in four of what its work could yield; having no market holds it back most."
 *   "It gets all its work could yield; nothing holds it back."
 *   "It gets more than its work alone could yield, though the debt crisis weighs on it."
 * Null where the record holds no figure or no dial (then the surface prints nothing in the figure's place).
 *
 * Pure: no store, no React, no rng.
 */
import { CRISIS_NOUN } from '../crisis/crisisNoun.js';
import { crisisKindOf } from '../facts/crisisKind.js';

/**
 * Each crisis's pull on the economy, as the generator weighs it (priorityHelpers.js, `economyStressMult`). A crisis
 * missing here does not touch the figure.
 */
const CRISIS_PULL = Object.freeze(/** @type {Record<string, number>} */ ({
  under_siege: 0.45, famine: 0.60, occupied: 0.70, plague_onset: 0.75, indebted: 0.85, politically_fractured: 0.85,
  insurgency: 0.88, mass_migration: 0.90, wartime: 0.88, religious_conversion: 0.92, slave_revolt: 0.72,
}));

/**
 * The neighbour's pull, as the generator reads it (the relationship type by name, in this order), and the words
 * for the ones that hold a town back.
 * @type {ReadonlyArray<{ test: (t: string) => boolean, factor: number, words: string | null }>}
 */
const NEIGHBOUR = Object.freeze([
  { test: (t) => t.includes('hostile') || t.includes('rival'), factor: 0.88, words: 'a hostile neighbour' },
  { test: (t) => t.includes('cold_war'), factor: 0.93, words: 'a cold war with a neighbour' },
  { test: (t) => t.includes('tense'), factor: 0.97, words: 'trouble with a neighbour' },
  { test: (t) => t.includes('trade_partner'), factor: 1.08, words: null },
  { test: (t) => t.includes('allied'), factor: 1.05, words: null },
]);

/** The share of its work the town makes, in words: the first rung whose floor it reaches. */
const SHARE_WORDS = Object.freeze(/** @type {ReadonlyArray<readonly [number, string]>} */ ([
  [1.05, 'more than'],
  [0.95, 'all'],
  [0.85, 'nearly all'],
  [0.78, 'about four parts in five'],
  [0.71, 'about three parts in four'],
  [0.6, 'about two parts in three'],
  [0.42, 'about half'],
  [0.29, 'about a third'],
  [-Infinity, 'less than a third'],
]));

/** Where the town makes all its work could, a drag is named only when it pulls below this. */
const WEIGHS_ON = 0.95;

/** The drags in the order a tie is broken (the larger pull first, then this order). */
const DRAG_ORDER = Object.freeze(['market', 'crisis', 'crime', 'neighbour', 'magic']);

/** @param {unknown} v @returns {number | null} */
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

/**
 * The factors the record's own inputs carry, each with the words for it as a drag.
 * @param {any} settlement
 * @returns {Array<{ kind: string, factor: number, words: string }> | null} null where an input is missing
 */
function factorsOf(settlement) {
  const c = settlement?.economicState?.compound;
  const crime = num(c?.criminalEffective), magic = num(c?.raw?.magic);
  const hasMarket = c?.inst?.hasMarket;
  if (crime === null || magic === null || typeof hasMarket !== 'boolean') return null;
  const cfg = settlement?.config || {};
  /** @type {string[]} */
  const crises = Array.isArray(cfg.stressTypes) && cfg.stressTypes.length ? cfg.stressTypes : cfg.stressType ? [cfg.stressType] : [];
  const relation = String(cfg.neighborRelationship?.relationshipType || '').toLowerCase();
  const row = NEIGHBOUR.find((r) => r.test(relation));
  /** @type {Array<{ kind: string, factor: number, words: string }>} */
  const out = [
    { kind: 'market', factor: hasMarket ? 1 : 0.75, words: 'having no market' },
    { kind: 'crime', factor: Math.max(0.58, 1 - (crime - 30) / 310), words: 'crime' },
    { kind: 'magic', factor: 1 + (magic - 50) / 290, words: 'the little magic it has' },
    { kind: 'neighbour', factor: row ? row.factor : 1, words: row?.words || 'its neighbour' },
  ];
  for (const type of [...new Set(crises)]) {
    const pull = CRISIS_PULL[type];
    if (pull === undefined) continue;
    const kind = crisisKindOf(type);
    out.push({ kind: 'crisis', factor: pull, words: `the ${(kind && CRISIS_NOUN[kind]) || 'crisis'}` });
  }
  return out;
}

/**
 * Does the product of the dial and every factor read reproduce the stored figure (the generator clamps to 0..100)?
 * @param {number} dial @param {number} figure @param {Array<{ factor: number }>} factors @returns {boolean}
 */
function agreesWithRecord(dial, figure, factors) {
  const product = Math.max(0, Math.min(100, factors.reduce((p, f) => p * f.factor, dial)));
  return Math.abs(product - figure) <= 1e-6 * Math.max(1, figure);
}

/**
 * The reading behind the line: the share, its words, and the drag that holds the town back most (or null).
 * @param {any} settlement
 * @returns {{ share: number, shareWords: string, drag: { kind: string, words: string } | null, read: boolean } | null}
 *   `read` is whether the drags were read (the mirror reproduced the stored figure); null with no figure or dial
 */
export function outputReading(settlement) {
  const c = settlement?.economicState?.compound;
  const figure = num(c?.economyOutput), dial = num(c?.raw?.economy);
  if (figure === null || dial === null || dial <= 0) return null;
  const share = figure / dial;
  const shareWords = /** @type {string} */ (SHARE_WORDS.find(([floor]) => share >= floor)?.[1]);
  const factors = factorsOf(settlement);
  const read = !!factors && agreesWithRecord(dial, figure, factors);
  if (!read) return { share, shareWords, drag: null, read };
  // A town that makes all its work could still names a drag that pulls by a twentieth or more (what lifts it makes
  // up the loss: its magic, a trading neighbour, little crime); a smaller pull there is nothing.
  const floor = share >= 0.95 ? WEIGHS_ON : 1;
  const drags = /** @type {NonNullable<typeof factors>} */ (factors).filter((f) => f.factor < floor)
    .sort((a, b) => a.factor - b.factor || DRAG_ORDER.indexOf(a.kind) - DRAG_ORDER.indexOf(b.kind));
  return { share, shareWords, drag: drags[0] ? { kind: drags[0].kind, words: drags[0].words } : null, read };
}

/**
 * The one line every surface prints in the figure's place, or null where the record holds no figure.
 * @param {any} settlement
 * @returns {string | null}
 */
export function outputInWords(settlement) {
  const r = outputReading(settlement);
  if (!r) return null;
  if (r.share >= 0.95) {
    const made = r.share >= 1.05 ? 'It gets more than its work alone could yield' : 'It gets all its work could yield';
    if (!r.read) return `${made}.`;
    return r.drag ? `${made}, though ${r.drag.words} weighs on it.` : `${made}; nothing holds it back.`;
  }
  const made = `It gets ${r.shareWords} of what its work could yield`;
  return r.drag ? `${made}; ${r.drag.words} holds it back most.` : `${made}.`;
}

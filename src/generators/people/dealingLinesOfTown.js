/**
 * dealingLinesOfTown.js — ONE TOWN PASS FOR "HOW THEY DEAL" (E13b, WORDS-1; the tenth chair's ruling G39 of 2026-11-25).
 * After the last draw, where every card is final (beside E8b's pass: `narrativeGenerator.js :: generateCoherence`, and the
 * people regen), the cards of a town whose stored line IS a pair's first line (`data/people/dealingLines.js`) are ranked, pair by
 * pair, by a hash of the seed and the card's own id (no stream pull: no draw anywhere moves); the first keeps the line it holds,
 * the next takes the pair's next line, and so on, a line held by another card of the town (a keeper, a card already resolved)
 * taken last. Only when the pool is exhausted does a line repeat. A title row's line is never a pair's first line, so it never
 * takes part; a keeper (the regen's) is never touched; a second pass changes nothing.
 * @enforced-by tests/generators/people/dealingLines.test.js
 */
import { DEALING_POOL_OF_FIRST_LINE } from '../../data/people/dealingLines.js';
import { fnv1a32 } from '../../kernel/proseHash.js';

/** @param {unknown} card @returns {string | null} */
const behaviourOf = (card) => {
  const p = card && typeof card === 'object' ? /** @type {Record<string, any>} */ (card).presentation : null;
  return p && typeof p.behaviour === 'string' ? p.behaviour : null;
};

/**
 * The town's cards, each pair's lines given in turn. Returns the same array when nothing moves.
 * @template T @param {T[]} npcs @param {unknown} seed the record's seed (the regen's own on a regen)
 * @param {{ keep?: ReadonlySet<string> }} [options] `keep`: the ids of cards the user keeps (never touched)
 * @returns {T[]}
 */
export function dealingLinesOfTown(npcs, seed, options = {}) {
  if (!Array.isArray(npcs)) return npcs;
  const keep = options.keep || new Set();
  /** @type {Map<string, number[]>} a pair's first line → the cards that hold it and take part */
  const groups = new Map();
  npcs.forEach((card, i) => {
    const line = behaviourOf(card);
    if (line === null || !DEALING_POOL_OF_FIRST_LINE.has(line)) return;
    if (keep.has(String(/** @type {Record<string, any>} */ (card)?.id))) return;
    const group = groups.get(line) || []; group.push(i); groups.set(line, group);
  });
  const key = (/** @type {number} */ i) => fnv1a32(`${String(seed ?? '')}::dealing::${String(/** @type {Record<string, any>} */ (npcs[i])?.id ?? /** @type {Record<string, any>} */ (npcs[i])?.name ?? i)}`);
  /** @type {T[] | null} */ let out = null;
  for (const [first, members] of groups) {
    const lines = /** @type {ReadonlyArray<string>} */ (DEALING_POOL_OF_FIRST_LINE.get(first));
    const heldElsewhere = new Set(npcs.filter((_, i) => !members.includes(i)).map(behaviourOf).filter((b) => b !== null && lines.includes(b)));
    const free = lines.filter((l) => !heldElsewhere.has(l));
    const ranked = members.slice().sort((a, b) => key(a) - key(b) || a - b);
    ranked.forEach((i, rank) => {
      const line = rank < free.length ? free[rank] : lines[(rank - free.length) % lines.length];
      if (line === behaviourOf(npcs[i])) return;
      const card = /** @type {Record<string, any>} */ (npcs[i]);
      (out ||= npcs.slice())[i] = /** @type {T} */ ({ ...card, presentation: { ...card.presentation, behaviour: line } });
    });
  }
  return out || npcs;
}

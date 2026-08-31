/**
 * domain/prosperityRank.js — THE ONE ladder for a prosperity LABEL as 0..1.
 *
 * ── THE CLASS THIS LEAF CLOSES ───────────────────────────────────────────────
 * `economicState.prosperity` is a six-label CATEGORICAL (`deriveProsperityLabel`,
 * economy/prosperity.js). It carries no declared unit, and four consumers therefore
 * re-quantified it to 0..1 on THREE different scales — the §711.6 same-field-different-meaning
 * family, measured at ODQ §759.3 (5th–7th sightings). Each consumer was internally consistent,
 * so nothing ever reddened:
 *
 *   label        corruption.js  interiorModel/townLayoutV2   neighbourGenerator
 *   Struggling       0.2                 0.2                      0.1
 *   Poor             0.2                 0.2                      0.25
 *   Moderate         0.4                 0.5 (unreachable)        0.5
 *   Comfortable      0.6                 0.5                      0.65
 *   Prosperous       0.8                 0.9                      0.8
 *   Wealthy          1.0                 0.9                      0.95
 *
 * The same `Comfortable` settlement was 0.6 of maximum to the corruption climate, 0.5 to the
 * tavern interior and 0.65 to neighbour economics. Worse: the interior/townV2 arm matched
 * `/comfortable|modest|stable/`, and the generator emits `Moderate` — a word NO arm of that
 * regex can match — so `Moderate` and `Comfortable` collapsed to the same 0.5 there, one by
 * intent and one by falling off the end of the ladder.
 *
 * ── WHY THIS LADDER WINS ─────────────────────────────────────────────────────
 * The defenseScoreBands precedent: adopt the spelling with the strongest existing claim and
 * say why. `neighbourGenerator`'s `PROSPERITY_RANK` wins on three counts — it is the only one
 * keyed on the EXACT vocabulary `deriveProsperityLabel` emits (the other two are substring and
 * regex probes), the only one MONOTONE across all six emitted labels, and the only one that
 * already carried the legacy aliases that reach these readers through stored and defaulted
 * records (`historyGenerator.js:159` defaults to `'Modest'`, a label the generator has never
 * emitted). Its values are therefore carried over UNCHANGED, and it is the one consumer this
 * leaf leaves byte-identical.
 *
 * ── THE VOCABULARY IS CLOSED, AND ITS CLOSURE IS ASSERTED ────────────────────
 * `PROSPERITY_LABELS` is the six `deriveProsperityLabel` can return. Everything else in
 * `PROSPERITY_RANK` is an ALIAS: a spelling that reaches a reader from somewhere other than
 * this generation's own economy step. `tests/domain/prosperityRank.test.js` asserts BOTH
 * directions against `prosperity.js`'s own LABELS array, so a seventh label cannot be minted
 * without this leaf noticing.
 *
 * ── ALL FOUR CONSUMERS ARE ON IT (T8) ───────────────────────────────────────
 * `neighbourGenerator.js`, `interior/interiorModel.js` and the town layout builder named in
 * the table above moved in T7. (Its module path is deliberately not spelled here: this leaf
 * carries no map surface, and the §11.4 allowlist walker reads source text, so writing the
 * path would enrol a pure ladder in the settlement-map census for a comment.)
 * `corruption.js` could not: its climate adapter feeds `corruptionPass`, a GENERATION
 * step, so the flip was same-seed load-bearing and ODQ §773.1 holds every golden-moving wave
 * for T8's single shift window. It rode there (J-T7-C / §809), the registered holdout export
 * that stood here in the meantime is deleted, and the golden rows it moved are re-recorded
 * under the SHIFT RECORD in `tests/property/generatorGoldenMaster.test.js`.
 *
 * Pure, dependency-free and deliberately tiny — it is imported by a generator, two domain
 * derivers and the town layout builder, and none of them may drag another's graph in.
 */

/**
 * The six labels `deriveProsperityLabel` can return, in canonical band order
 * (lowest first). Anything else that appears in `PROSPERITY_RANK` is an alias.
 * @type {readonly string[]}
 */
export const PROSPERITY_LABELS = Object.freeze([
  'Struggling', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy',
]);

/**
 * Prosperity label → 0..1. The six emitted labels first, then the aliases.
 * @type {Readonly<Record<string, number>>}
 */
export const PROSPERITY_RANK = Object.freeze({
  // ── The emitted six ──
  Struggling: 0.1,
  Poor: 0.25,
  Moderate: 0.5,
  Comfortable: 0.65,
  Prosperous: 0.8,
  Wealthy: 0.95,
  // ── Aliases. Never emitted by deriveProsperityLabel, but reachable: `Subsistence` is
  // computeBaseProsperity's own bottom rung, `Modest` is historyGenerator's default, and the
  // rest are older spellings that survive in stored records and hand-written fixtures. ──
  Subsistence: 0.05,
  Impoverished: 0.1,
  Destitute: 0.1,
  Meager: 0.2,
  Modest: 0.4,
  Stable: 0.45,
  Thriving: 0.9,
  Affluent: 1.0,
  Opulent: 1.0,
});

/**
 * The value an UNRECOGNISED prosperity reads as. Middling, and deliberately so: an unknown
 * label is missing information, not a poor settlement. All four prior consumers already
 * defaulted here (0.4 in corruption's case, which is its own `Moderate`), so the neutral is
 * inherited rather than invented.
 */
export const PROSPERITY_RANK_NEUTRAL = 0.5;

const FOLDED = Object.freeze(Object.fromEntries(
  Object.entries(PROSPERITY_RANK).map(([label, rank]) => [label.toLowerCase(), rank]),
));

// Longest key first, so a decorated label containing two ladder words resolves to the more
// specific one and the scan is order-independent of object key order.
const FOLDED_BY_LENGTH = Object.freeze(
  Object.keys(FOLDED).sort((a, b) => (b.length - a.length) || (a < b ? -1 : a > b ? 1 : 0)),
);

/**
 * The LABEL out of any shape `economicState.prosperity` is known to take: a bare string, or
 * an object under `label` / `tier` / `level`. All three spellings existed across the four
 * prior readers; unifying the ladder without unifying the shape read would have left half the
 * divergence in place.
 * @param {unknown} value @returns {string}
 */
export function prosperityLabelOf(value) {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object') {
    const record = /** @type {Record<string, unknown>} */ (value);
    for (const key of ['label', 'tier', 'level']) {
      const candidate = record[key];
      if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
    }
  }
  return '';
}

/**
 * A prosperity label (in any of its shapes) as 0..1. TOTAL — every input returns a number.
 *
 * Resolution order, and it is deterministic by construction: exact case-folded label, then a
 * longest-first substring scan (the tolerance `corruption.js` already had for decorated
 * labels such as `'Poor (declining)'`), then `PROSPERITY_RANK_NEUTRAL`.
 *
 * @param {unknown} value @returns {number} 0..1
 */
export function prosperityRank01(value) {
  const folded = prosperityLabelOf(value).toLowerCase();
  if (!folded) return PROSPERITY_RANK_NEUTRAL;
  const exact = FOLDED[folded];
  if (exact !== undefined) return exact;
  for (const key of FOLDED_BY_LENGTH) {
    if (folded.includes(key)) return FOLDED[key];
  }
  return PROSPERITY_RANK_NEUTRAL;
}

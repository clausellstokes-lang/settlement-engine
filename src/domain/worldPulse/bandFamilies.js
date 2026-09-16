/**
 * bandFamilies.js — SP-6a SIGNIFICANCE and SP-6b SEVERITY, THE TWO BAND FAMILIES,
 * MINTED ONCE HERE. Volumes ASSIGN their kinds to a class; no volume authors a scale.
 *
 * WHY ONE FILE FOR TWO SCALES. The tuning-ledger audit counted a dozen independently
 * authored significance scales feeding ONE pacing governor, and five of the fourteen
 * measured tuning-table drift instances were significance bands. The cure the spine's
 * ruling R5 chose is not a lint rule but an ARITHMETIC one: there is one scale, it has
 * a rank, and a volume that wants "more important than X" asks this file rather than
 * spelling a comparison. A scale nobody can author twice cannot drift.
 *
 * ── SP-6a SIGNIFICANCE: A BORROW, NOT A MINT ────────────────────────────────────
 *
 * ⚠ CENSUS CORRECTION, measured 2026-08-04 against the live tree. The compiled FP
 * architecture (§2a class 4) and the CW program architecture (S15) both record that
 * "the ruled significance vocabulary today is TWO-valued (major|notable); `routine`
 * does not exist until SP-A mints the family." THAT IS WRONG, and the correction is
 * recorded here because building on it would have made this file a SECOND spelling
 * rather than the canonical one. `routine` is live today, authored on kind rows and
 * read by four news composers:
 *
 *   AUTHORED  src/domain/worldPulse/eventProse.js — DispositionReceiptSignificance is
 *             literally `'notable'|'routine'`; `war_culture_suppressed`,
 *             `lineage_claim_suppressed`, `trajectory_misread` and `envoy_on_the_road`
 *             all carry 'routine'; the lineage/warCost/envoy typedefs spell the full
 *             `'major'|'notable'|'routine'`.
 *   READ      dispositionNews.js:199-200 · envoyNews.js:182 · warCostsNews.js:155 ·
 *             lineageNews.js:80-81
 *
 * So this family BORROWS the three words the estate already speaks (J-WR-10-B's
 * borrow-before-minting rule, honoured) and mints only what was genuinely missing: the
 * frozen ORDER, the rank, and the two shapes the pacing governor's input grammar needs.
 * The real debt the census meant to name is different and remains open: the words are
 * spelled inline at every site and compared ad hoc — `heraldFeed.js:95` mixes a banded
 * `significance === 'major'` with a raw `severity >= 0.72` float. Migrating those
 * surfaces onto this family is SP-E's census and each surface's own small wave; this
 * wave supplies the thing they migrate ONTO and edits no existing source.
 *
 * ── SP-6b SEVERITY: A GENUINE MINT, AND WHY NOTHING WAS BORROWABLE ──────────────
 *
 * J-WR-10-B requires that a mint record what it looked for. Five severity spellings
 * were measured in the tree on 2026-08-04, and not one of them grades an OUTCOME:
 *
 *   historyBeats.js SEVERITY_RANK {catastrophic, major, moderate, minor} — module-
 *     private, and it grades AUTHORED generator history events, not engine receipts.
 *     Its `major` is the significance family's top class: borrowing it would put one
 *     word on two ladders, which is the silent-semantic-error class the pressure-ladder
 *     census exists to kill.
 *   activeConditions.js / threatProfile.js SEVERITY_BANDS {low, medium, high, critical}
 *     — bands a 0..1 scalar for an ONGOING CONDITION, a state, not a verdict.
 *   structuralFingerprint.js severityBand {low, moderate, high, severe} — the analytics
 *     fingerprint plane, a different consumer entirely.
 *   heraldFilter.js severityBand {routine, strained, critical} — DISPLAY, derived from
 *     a float, and its bottom rung IS the significance family's bottom class.
 *   data/constants.js SEVERITY — not a ladder at all: a validation-issue KIND enum.
 *
 * Nothing existed to borrow, so a ladder is minted — and it is minted in words that
 * collide with NOTHING. All four rungs were measured to appear as quoted string
 * literals ZERO times anywhere under src/ before this file, and
 * tests/lint/spBandFamilies.walker.test.js keeps both families disjoint from every
 * frozen band vocabulary in the tree from here on. Reading the wrong ladder is a
 * silent semantic error no walker catches; a ladder whose words no other ladder speaks
 * cannot be read by mistake.
 *
 * PURE. No world state, no store, no PRNG, no imports. Consumed by nothing at land
 * time — dark by construction (the lane-P precedent).
 */

/**
 * SP-6a — THE ONE SIGNIFICANCE SCALE, ASCENDING. A news kind is assigned a class in
 * the wave that mints it; the class is the pacing governor's input and the frequency
 * floor's denominator. There is no fourth class and no per-volume scale.
 * @type {readonly string[]}
 */
export const SIGNIFICANCE_CLASSES = Object.freeze(['routine', 'notable', 'major']);

/**
 * SP-6b — THE ONE SEVERITY LADDER, ASCENDING. It grades an OUTCOME: what a receipt or
 * an ending cost. Endings-share envelopes reference these rungs (the WR-9 discipline's
 * grading axis). Distinct from significance by design — significance says how loudly
 * the world should speak of a thing, severity says how badly it went, and a routine
 * beat may be ruinous for the town it happened to.
 * @type {readonly string[]}
 */
export const SEVERITY_LADDER = Object.freeze(['glancing', 'telling', 'grave', 'ruinous']);

/**
 * Rank of a significance class (0 = routine). THROWS on an unknown class: a silent
 * fallback would file an unregistered kind at whatever rank the fallback chose, and
 * the pacing governor would throttle by that lie.
 * @param {string} cls
 * @returns {number}
 */
export function significanceRankOf(cls) {
  return rankIn(SIGNIFICANCE_CLASSES, cls, 'significance class');
}

/**
 * Rank of a severity rung (0 = glancing). THROWS on an unknown rung, for the same
 * reason `significanceRankOf` does.
 * @param {string} rung
 * @returns {number}
 */
export function severityRankOf(rung) {
  return rankIn(SEVERITY_LADDER, rung, 'severity rung');
}

/**
 * THE SIGNIFICANCE-FLOOR SHAPE. "At or above this floor" — the one comparison a
 * consumer is allowed to make against the family, so no surface re-derives an ordering
 * from a string compare or a hand-written `=== 'major' || === 'notable'` chain.
 * @param {string} candidate
 * @param {string} floor
 * @returns {boolean}
 */
export function admitsSignificance(candidate, floor) {
  return significanceRankOf(candidate) >= significanceRankOf(floor);
}

/**
 * THE SECTION-CAP SHAPE. A Herald desk's per-window budget, one cap per significance
 * class. TOTAL by construction: a cap table missing a class is refused rather than
 * defaulted, because a missing class silently means "unlimited" — which is precisely
 * how depth becomes wallpaper.
 *
 * The NUMBERS are a volume's §7 tuning row and the owner signs them; the SHAPE is the
 * family's and lives here.
 *
 * @param {Record<string, number>} caps  one non-negative integer per significance class
 * @returns {Readonly<Record<string, number>>}
 */
export function sectionCapShape(caps) {
  const table = caps && typeof caps === 'object' ? caps : {};
  const keys = Object.keys(table).sort();
  const expected = [...SIGNIFICANCE_CLASSES].sort();
  if (keys.length !== expected.length || keys.some((k, i) => k !== expected[i])) {
    throw new Error(
      `bandFamilies.sectionCapShape: a cap table must name every significance class exactly once`
      + ` (expected ${expected.join(', ')}; got ${keys.join(', ') || 'nothing'})`,
    );
  }
  for (const cls of SIGNIFICANCE_CLASSES) {
    const cap = table[cls];
    if (!Number.isInteger(cap) || cap < 0) {
      throw new Error(
        `bandFamilies.sectionCapShape: cap for "${cls}" must be a non-negative integer (got ${JSON.stringify(cap)})`,
      );
    }
  }
  return Object.freeze({ ...table });
}

/**
 * @param {readonly string[]} ladder @param {unknown} word @param {string} label
 * @returns {number}
 */
function rankIn(ladder, word, label) {
  const i = typeof word === 'string' ? ladder.indexOf(word) : -1;
  if (i < 0) {
    throw new Error(
      `bandFamilies: unknown ${label} ${JSON.stringify(word)} — the family is [${ladder.join(', ')}]`
      + ' and volumes assign to it rather than authoring a scale',
    );
  }
  return i;
}

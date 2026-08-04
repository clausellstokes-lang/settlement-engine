/**
 * razingWitness.js — WR-8 amendment R: THE WORLD JUDGES ON THE OBSERVER'S AXIS.
 *
 * One event, read through every observer's character. The amendment's own
 * sentence: "the relationship hit lands banded by the OBSERVER's alignment —
 * monumental from good settlements and good deities, lesser-but-real from
 * neutral, and from the evil axis... recognition (a war god approves; an evil
 * court takes notes on a peer)."
 *
 * ── WHAT THIS LEAF IS, AND WHY IT HOLDS NO IMPORTS ──────────────────────────
 * It is the LAW of the judgment, in the idiom `razing.js` established: the band
 * table, the magnitudes, and the receipts. It holds NO IMPORTS AT ALL for the
 * reason the sibling law leaves do — a law that can reach the world acquires the
 * ability to be quietly conditioned by it — and because the alternative is a
 * cycle: the ASSEMBLY that gathers observers lives in `razingExecution.js`,
 * which already owns the substrate walk this leaf would otherwise need.
 *
 * ⚠️ IT WRITES NOTHING, AND THAT IS STRUCTURAL. It returns HIT ROWS — a band, a
 * resentment addend, a trust multiplier, a fear addend and a receipt per
 * observer — and the assembly folds them onto the real edges through
 * `applyRelationshipPatch`, the relationship estate's ONE sanctioned writer. A
 * second relationship writer minted here would be exactly the ghost-write class
 * the razing's institution ruling (R-WZ-1) already refused one estate over.
 *
 * ── THE THREE BANDS ARE THE OBSERVER'S OWN NATURE, AND THE VOCABULARY IS CLOSED
 * `ownNatureBandFor` reads `malicious` / `balanced` / `benevolent` / `unknown` —
 * the same derived-alignment word the razing's own initiation gate reads, so the
 * razer's nature and the witness's nature mean the same thing across WR-8. The
 * mapping is total over that vocabulary and a pin walks it exhaustively.
 *
 * ⚠️ `unknown` YIELDS NO HIT AT ALL, and the omission is a ruling rather than a
 * gap (J-WZ4-1, vetoable). An unread character is not a neutral one. The
 * amendment refuses to let silence become a verdict at the intent layer; the
 * same refusal belongs here, where the alternative is to manufacture a moral
 * reaction for a court whose morals could not be read. It also keeps the
 * direction strict: a razing that cannot be judged is not judged.
 *
 * ── WHY RECOGNITION IS NOT A NEGATIVE HIT, AND NOT A NO-OP EITHER ────────────
 * The evil axis does not forgive the razer and does not resent it: it PRICES it.
 * Fear rises — that is amendment R's own "terror WORKS on the fearful
 * (fear_of_dominance rises; some submit)" arriving on the axis the relationship
 * substrate actually owns — and trust rises slightly, because a court that will
 * burn a city is a court worth an arrangement. Resentment does not move at all.
 * That is the honest shape of "takes notes on a peer", and it makes the two
 * aftermath forks the amendment names (terror works / terror backfires) reachable
 * from ONE read of the neighbours' character rather than from a second switch.
 *
 * ── THE JUST RAZING IS SANCTIONED, NOT FREE ─────────────────────────────────
 * R2's manager ruling, applied here as a single band-down multiplier on the
 * `vengeance` road: "reduced moral drift and relationship hits — but never zero
 * for a good actor: burning a city is still burning a city." JUST_BAND is
 * deliberately well above zero so the sentence stays true, and the pin asserts
 * BOTH halves — strictly smaller than the initiation hit, and strictly positive.
 *
 * ── WHY THE MORAL HIT SCALES WITH LOVE OF THE VICTIM AND RECOGNITION DOES NOT ─
 * Outrage is grief plus principle. The principle half fires for any good court
 * that hears of it (GRIEF_FLOOR — the share that does not depend on having
 * loved the burned town), and the grief half scales with the observer's own
 * adequacy to the victim, which is the SAME `trust`-to-the-victim reading the
 * vengeance license already uses (J-WZ2-2). No new axis and no new band are
 * minted here. Recognition is scaled by the fire alone: an evil court's respect
 * is for the act's size, not for the dead.
 *
 * PURE over its arguments: no rng, no wall-clock, no mutation, no writes, no
 * imports. Deterministic; every fold is over a caller-ordered list.
 */

/**
 * The judgment vocabulary, closed, in descending moral weight. A pin walks it
 * against RAZING_ALIGNMENT_BANDS so neither list can gain a member alone.
 */
export const RAZING_JUDGMENT_BANDS = Object.freeze(['monumental', 'lesser', 'recognition']);

/**
 * THE BAND TABLE. Total over `ownNatureBandFor`'s closed vocabulary; `unknown`
 * is present as an explicit null rather than as an absent key, so the totality
 * pin reads a decision instead of a lookup miss.
 * @type {Readonly<Record<string, string|null>>}
 */
export const JUDGMENT_BAND_OF_NATURE = Object.freeze({
  benevolent: 'monumental',
  balanced: 'lesser',
  malicious: 'recognition',
  unknown: null,
});

export const RAZING_WITNESS_TUNING = Object.freeze({
  // ── MONUMENTAL: a good court hears that a city was burned and its people
  // killed in it. The trust loss is a MULTIPLIER (what is left of the standing
  // the razer had) rather than an addend, because trust is the axis a single
  // atrocity should mostly destroy rather than dent.
  MONUMENTAL_RESENTMENT: 0.34,
  MONUMENTAL_TRUST_LOSS: 0.55,
  MONUMENTAL_FEAR: 0.18,
  // ── LESSER: real, and smaller. A neutral court condemns it and goes on
  // trading. Every magnitude is strictly under its monumental twin (pinned).
  LESSER_RESENTMENT: 0.14,
  LESSER_TRUST_LOSS: 0.22,
  LESSER_FEAR: 0.12,
  // ── RECOGNITION: no resentment at all, the largest fear move of the three,
  // and a small trust GAIN. See the header for why this is not a no-op.
  RECOGNITION_TRUST_GAIN: 0.06,
  RECOGNITION_FEAR: 0.2,
  // R2: the just razing is sanctioned, not free. Strictly between 0 and 1 —
  // the pin asserts both bounds, because either one alone permits a reading the
  // ruling forbids ("free" at 0, "identical" at 1).
  JUST_BAND: 0.45,
  // The share of a moral hit that is PRINCIPLE rather than grief: what a good
  // court feels about a burning it had no personal stake in.
  GRIEF_FLOOR: 0.5,
});

/** @param {unknown} value @returns {number} 0..1 */
function clamp01(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** @param {number} value @returns {number} 4-dp round, the repo's byte-tidy float */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * THE OBSERVER'S BAND, from the observer's own nature.
 *
 * Total over the closed alignment vocabulary AND over everything outside it: an
 * unrecognized word reads `null` exactly as `unknown` does, so a future band
 * added to the alignment leaf cannot silently acquire the neutral verdict — it
 * gets no verdict until someone files it here, which is the direction that keeps
 * a judgment honest.
 *
 * @param {unknown} alignmentBand the observer's `ownNatureBandFor` word
 * @returns {string|null} one of RAZING_JUDGMENT_BANDS, or null for no judgment
 */
export function razingJudgmentBandFor(alignmentBand) {
  const word = typeof alignmentBand === 'string' ? alignmentBand : '';
  return Object.prototype.hasOwnProperty.call(JUDGMENT_BAND_OF_NATURE, word)
    ? JUDGMENT_BAND_OF_NATURE[word]
    : null;
}

/**
 * @typedef {Object} RazingWitnessHit
 * @property {string} observerId
 * @property {string} band             one of RAZING_JUDGMENT_BANDS
 * @property {number} scale01          the applied magnitude share (fire × stake × sanction)
 * @property {number} resentmentAdd01  addend for the observer→razer resentment axis
 * @property {number} trustFactor      multiplier for the observer→razer trust axis
 * @property {number} fearAdd01        addend for the observer→razer fear axis
 * @property {string} receipt          what this court decided, in its own voice
 */

/**
 * THE WORLD'S VERDICTS ON ONE BURNING, one row per observer that has one.
 *
 * @param {{ observers?: ReadonlyArray<unknown>, road?: unknown, severity01?: unknown,
 *   victimName?: unknown, razerName?: unknown }} args
 *   observers: `{ observerId, alignmentBand, adequacyToVictim01 }` rows, already
 *   ordered by the caller (the assembly hands them codepoint-sorted). road: the
 *   permitted razing's road, one of RAZING_ROADS.
 * @returns {RazingWitnessHit[]} one row per JUDGING observer, caller order preserved
 */
export function razingWitnessHits({
  observers = [], road = '', severity01 = 0, victimName = '', razerName = '',
} = {}) {
  const T = RAZING_WITNESS_TUNING;
  const fire = clamp01(severity01);
  const sanction = String(road || '') === 'vengeance' ? T.JUST_BAND : 1;
  const victim = typeof victimName === 'string' && victimName ? victimName : 'the town';
  const razer = typeof razerName === 'string' && razerName ? razerName : 'the victor';
  /** @type {RazingWitnessHit[]} */
  const out = [];
  for (const raw of Array.isArray(observers) ? observers : []) {
    const row = recordOf(raw);
    const observerId = String(row.observerId ?? '');
    if (!observerId) continue;
    const band = razingJudgmentBandFor(row.alignmentBand);
    if (!band) continue;
    const stake = clamp01(row.adequacyToVictim01);
    // Grief scales the moral bands; the evil axis prices the fire alone.
    const share = band === 'recognition'
      ? fire
      : fire * (T.GRIEF_FLOOR + (1 - T.GRIEF_FLOOR) * stake);
    const scale01 = round4(clamp01(share * sanction));
    if (band === 'recognition') {
      out.push({
        observerId,
        band,
        scale01,
        resentmentAdd01: 0,
        trustFactor: 1,
        fearAdd01: round4(T.RECOGNITION_FEAR * scale01),
        receipt: `${razer} burned ${victim} to the ground, and this court took note of what ${razer} is willing to do.`,
      });
      continue;
    }
    const resentment = band === 'monumental' ? T.MONUMENTAL_RESENTMENT : T.LESSER_RESENTMENT;
    const trustLoss = band === 'monumental' ? T.MONUMENTAL_TRUST_LOSS : T.LESSER_TRUST_LOSS;
    const fear = band === 'monumental' ? T.MONUMENTAL_FEAR : T.LESSER_FEAR;
    out.push({
      observerId,
      band,
      scale01,
      resentmentAdd01: round4(resentment * scale01),
      trustFactor: round4(1 - trustLoss * scale01),
      fearAdd01: round4(fear * scale01),
      receipt: band === 'monumental'
        ? `${razer} burned ${victim} to the ground and killed its people in it. This court will not forget it.`
        : `${razer} burned ${victim} to the ground. This court condemns it and keeps its distance.`,
    });
  }
  return out;
}

/**
 * The RECOGNITION trust gain, kept out of the hit row's multiplier so the trust
 * axis has exactly one shape (`next = current × trustFactor + trustAdd`) across
 * all three bands and the assembly never branches on the band it was handed.
 * @param {RazingWitnessHit|null|undefined} hit @returns {number} 0..1 addend
 */
export function razingWitnessTrustAdd(hit) {
  const row = recordOf(hit);
  return row.band === 'recognition'
    ? round4(RAZING_WITNESS_TUNING.RECOGNITION_TRUST_GAIN * clamp01(row.scale01))
    : 0;
}

/**
 * domain/worldPulse/deityAxes.js — the deity AXIS-PROJECTION + temper-derivation
 * leaf (Phase 4 W-F2). A TRUE dependency-free leaf: it imports NOTHING, so every
 * consumer — the stance core (deityStance.js), the niche key (cultImpositionApply),
 * the temper readers (religiousContest / religionState / disposition), and the
 * W-F3 corruption-plane surface — can read ONE mapping without an import cycle.
 *
 * The double-axis behavior reads a deity's alignment on two 0..1 COORDINATES:
 * `evil01` (the good–evil malice axis) and `chaos01` (the law–chaos disorder axis),
 * each centered so `neutral` (and a legacy/absent axis) reads exactly 0.5 — the
 * no-signal midpoint. These are the owner-named `evil01` / `chaos01` the W-F3
 * amplified-site table consumes.
 *
 * `deriveTemper` is the axis-integration DERIVATION: warlike/peacelike/neutral is
 * no longer an independent stored axis — it falls out of the two alignment axes
 * (evil + chaos push warlike; good + law push peacelike; the neutral core reads
 * neutral). `deityTemper` is the read-time seam every temper reader routes
 * through. It has exactly TWO arms (W-FAITH D1, car F2c):
 *
 *   1. an AUTHORED `authoredTemper` wins — the stance dial the author set, and an
 *      authored `neutral` is a REAL choice that beats a derivation which would
 *      have said warlike (§797.4: neutral is first-class on every aspect);
 *   2. otherwise the derivation from the two alignment axes, byte-for-byte as
 *      before.
 *
 * ⛔ THE RETIRED FIELD STAYS RETIRED. `temperamentAxis` is NEVER consulted by
 * either arm. It is RETIRED as a load-bearing field (W-F5 stage 1 dropped the
 * byte-identity short-circuit): the stored field still persists harmlessly in
 * embeds and the DB (migrations 049/056 keep the column + CHECK), but it is inert
 * to every engine temper read. D1 chose a NEW field over re-arming that one
 * precisely because every existing custom deity carries a `temperamentAxis` minted
 * as a COMPAT MIRROR, not as intent — re-arming it would silently shift content a
 * user never authored. Only a null/absent deity ⇒ undefined.
 *
 * ⚠ WHAT THE AUTHORED ARM CAN AND CANNOT REACH, measured at F2c and pinned by
 * `tests/domain/deityTemperConsumerCensus.walker.test.js`: `deitySnapshotFrom`
 * (domain/deitySnapshot.js) copies a NAMED key list and does not carry
 * `authoredTemper`, so every consumer that reads an EMBED — the whole engine —
 * still derives. The authored word reaches only the surfaces handed a RAW authored
 * definition, which today is the compendium's deity draft preview. Carrying the
 * key into the embed is an owner-gated persisted-shape act, deliberately NOT taken
 * here; the census walker holds the tripwire.
 *
 * (Homed in worldPulse rather than the domain/deityConstants leaf so the W-F2 diff
 * stays clear of that leaf's edge-function bundle; corruption.js can still import it
 * without a cycle — this leaf imports nothing.)
 */

/** @type {Record<string, number>} */
const EVIL01 = Object.freeze({ evil: 1, neutral: 0.5, good: 0 });
/** @type {Record<string, number>} */
const CHAOS01 = Object.freeze({ chaotic: 1, neutral: 0.5, lawful: 0 });

/**
 * The 0..1 malice coordinate of a deity's alignment axis: evil 1 · neutral 0.5 ·
 * good 0. A legacy/absent alignmentAxis reads neutral (0.5). Pure.
 * @param {{ alignmentAxis?: string } | null} [deity]
 * @returns {number}
 */
export function evil01(deity) {
  return EVIL01[String(deity?.alignmentAxis ?? 'neutral')] ?? 0.5;
}

/**
 * The 0..1 disorder coordinate of a deity's law axis: chaotic 1 · neutral 0.5 ·
 * lawful 0. A legacy/absent lawAxis reads neutral (0.5) — the lawAxis-absence ⇒
 * neutral back-compat discipline. Pure.
 * @param {{ lawAxis?: string } | null} [deity]
 * @returns {number}
 */
export function chaos01(deity) {
  return CHAOS01[String(deity?.lawAxis ?? 'neutral')] ?? 0.5;
}

// Weights for the intrinsic-temper derivation. Intent (good–evil) dominates the
// niche-grid temper; chaos adds belligerence (method); a dead-band around the
// neutral core reads 'neutral'. LIVE for every deity (W-F5 stage 1 retired the
// stored-value short-circuit), so these weights now shape every engine temper read.
export const TEMPER_DERIVATION = Object.freeze({
  W_EVIL: 0.7,      // evil ⇒ warlike, good ⇒ peacelike (intent leads intrinsic temper)
  W_CHAOS: 0.3,     // chaos adds belligerence; lawful order is calmer
  THRESHOLD: 0.15,  // dead-band half-width around the neutral core ⇒ 'neutral'
});

/**
 * Derive an intrinsic temperament ('warlike' | 'peacelike' | 'neutral') from the
 * two 0..1 alignment coordinates (the spec's alignment01 / law01, i.e. evil01 /
 * chaos01) — the niche-grid temper for a DERIVED-only deity. `context` is reserved
 * for W-F4/W-F5 culture/terrain affinity biasing and is ignored this wave. Pure.
 * @param {number} evilCoord   0 good … 1 evil (the evil01 coordinate)
 * @param {number} chaosCoord  0 lawful … 1 chaotic (the chaos01 coordinate)
 * @param {unknown} [context]  reserved (affinity biasing) — ignored this wave
 * @returns {'warlike' | 'peacelike' | 'neutral'}
 */
export function deriveTemper(evilCoord, chaosCoord, context) {
  void context;
  const { W_EVIL, W_CHAOS, THRESHOLD } = TEMPER_DERIVATION;
  const score = W_EVIL * (evilCoord - 0.5) + W_CHAOS * (chaosCoord - 0.5);
  if (score > THRESHOLD) return 'warlike';
  if (score < -THRESHOLD) return 'peacelike';
  return 'neutral';
}

/**
 * The three temper words, and the ONLY three `deityTemper` may return. This is a
 * MIRROR of `customContentSchema.DEITY_TEMPER_KEYS`, restated here rather than
 * imported because this leaf imports NOTHING by design (see the file header: every
 * temper consumer must be able to read it without an import cycle, and
 * customContentSchema is a heavy authoring module the pulse must never pull in).
 * The duplication is pinned against its source in the F2c census walker, so the
 * mirror cannot silently rot — the same discipline F1c applied to its three
 * vocabulary mirrors.
 *
 * It is also `deriveTemper`'s declared output range, which is what makes the
 * authored arm's guard non-vacuous: an `authoredTemper` outside this set cannot be
 * a word the derivation would ever produce either.
 * @type {readonly string[]}
 */
export const TEMPER_WORDS = Object.freeze(['warlike', 'peacelike', 'neutral']);

/**
 * The READ-TIME temper seam — TWO arms (W-FAITH D1, wired by car F2c).
 *
 * 1. **AUTHORED WINS.** A deity carrying a valid `authoredTemper` reads that word.
 *    An authored `neutral` is a REAL choice and beats a derivation that would have
 *    said warlike (§797.4 — neutral is first-class on every aspect), so the arm is
 *    a set-membership test and never a truthiness test.
 * 2. **OTHERWISE DERIVE**, from the two alignment axes (evil01 + chaos01), exactly
 *    as before. Since no deity authored before F1c carries the field, EVERY read in
 *    every existing world takes this arm ⇒ byte-identical.
 *
 * ⛔ The retired stored `temperamentAxis` is consulted by NEITHER arm (W-F5 stage 1
 * dropped its short-circuit; D1 declines to re-arm it because it was minted as a
 * compat mirror, not as intent). It stays in the typedef only because embeds and
 * the DB still carry it.
 *
 * ⚠ An `authoredTemper` outside `TEMPER_WORDS` falls through to the derivation
 * rather than being returned verbatim. That is not defensive noise: `nicheOf`
 * (cultImpositionApply.js) builds a niche KEY out of this return value, so a word
 * that escaped validation would mint a niche no other deity can ever share — the
 * write-time walls (validateDeity, the admission projection, migration 200's CHECK)
 * all refuse it, and this leaf declines to be the one place that would not.
 *
 * A null/absent deity ⇒ undefined (the callers' pre-existing neutral fallback). Pure.
 * @param {{ authoredTemper?: string, temperamentAxis?: string, alignmentAxis?: string, lawAxis?: string } | null} [deity]
 * @returns {string | undefined}
 */
export function deityTemper(deity) {
  if (!deity) return undefined;
  const authored = deity.authoredTemper;
  if (typeof authored === 'string' && TEMPER_WORDS.includes(authored)) return authored;
  return deriveTemper(evil01(deity), chaos01(deity));
}

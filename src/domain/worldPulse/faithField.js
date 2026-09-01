/**
 * domain/worldPulse/faithField.js — THE INFLUENCE FIELD (W-FAITH D4, car F3c).
 *
 * Every unsuppressed pantheon member exerts a weighted pull on the settlement's
 * typed effect channels, instead of only the patron mattering:
 *
 *   w(d, s)              = share01(d) × rankWeight(d) × standingWeight(d) × [patron ? PATRON_AMP : 1]
 *   term(d, s, channel)  = aspectTerm(d, channel) × w(d, s) × pietyMult(s) × magicGate(s)
 *   channelTotal(s, ch)  = clamp(Σ term, −DAMP_MAX, +DAMP_MAX)
 *   channelMult(s, ch)   = clamp(1 + channelTotal, MULT_MIN, MULT_MAX)
 *
 * ⭐ THE FIELD IS DARK. Nothing in production calls it: the channel wiring is
 * W-FAITH F4c's car, and this one builds the kernel those channels will read so the
 * caps, the gate and the goldens exist BEFORE anything depends on them. The
 * darkness is PROVED, not asserted — `tests/property/faithFieldDormancyFence.test.js`
 * runs an import census over all of `src/` and reds the moment a production module
 * imports this file. ⚠ That census is the fence; when F4c lands a caller it must
 * REPLACE the fence with a driven byte-identity golden in the same commit, never
 * delete it. (The shape is `espionageDormancyFence`'s, verbatim: for a subsystem
 * with no caller an import census is STRICTLY STRONGER than a state pin, because a
 * state pin passes on a quiet fixture while this fails the moment a caller exists.)
 *
 * ⛔ NO FLAG. The door this field will one day open is `faithFieldEnabled` (D7), and
 * it is deliberately NOT minted here: the estate's virtual-flag surface is at its
 * declared ceiling and TE-VIRT-1 owes every such key a home. A flag with no reader
 * is a worse artifact than a named seam, so the seam is NAMED (see FAITH_FIELD_DOOR
 * below) and the flag lands with the car that first needs it to be off.
 *
 * WHAT THE FIELD DELIBERATELY DOES NOT CARRY — and this is the volume's own risk #1:
 *
 *   • THE TEMPER. `deityTemper` already has exactly one mechanical coupling, the
 *     signed warlike drive in `disposition.js`. Feeding the temper into a
 *     `war_readiness` channel here would be the DOUBLE-COUNT W-FAITH D1 forbids,
 *     wearing a new subsystem's clothes. D4's prose lists "temper pull" inside
 *     `aspectTerm`; risk #1 of the same volume forbids exactly that coupling, and
 *     where a volume contradicts itself the RISK REGISTER wins — it is the half
 *     written to be defended. The deity's character reaches PEOPLE instead, on a
 *     different plane, through `faithWitnessSource.js`.
 *   • THE FLAW — LANDED (W-FAITH F5c), attached to chart positions, not to any
 *     standalone enum (the D2 supersession, ODQ §800.3 J2). The register and both
 *     modulation readers live in `deityFlaws.js`; this file applies exactly ONE of
 *     them — the JEALOUS boon fade, inside `aspectTerm`'s boon addend, so it is
 *     inside the gated product and a magic-dead zero stays exactly zero. The
 *     WRATHFUL pull sharpening is `faithWitnessSource.js`'s, on the other plane.
 *
 * READ TIMING is the estate's: `pietyMultOf` reads `config.faithProfile.piety`,
 * which the religion projection writes at tick END and every amplified site consumes
 * at the NEXT tick's start. This field is one more such site, so it inherits the
 * anti-runaway seam rather than opening a second one — this tick's field effects can
 * never re-enter this tick's piety.
 *
 * WHY IT TAKES A RELIGION STATE RATHER THAN JUST A SETTLEMENT. The projected
 * read-model (`config.faithProfile.deities[]`) carries share/standing/isPatron but
 * NOT each member's snapshot, so it cannot answer `rankAxis` or the authored
 * boon/bane. Widening that projection would change a PERSISTED shape on every faith
 * settlement; reading the religion state instead is what `martialReadiness` already
 * does for the patron, so this follows the estate rather than reshaping it.
 *
 * PURE: no rng, no wall-clock, no mutation, codepoint-ordered aggregation. Imports
 * only `kernel/math`, the piety leaf, the cult-imposition leaf, the magic ledger and
 * the zero-import binding leaf below — each of which imports only `deityAxes` /
 * `data/constants` or nothing at all, so the graph stays acyclic and this leaf remains
 * importable by the religion engine.
 */
import { clamp, clamp01 } from '../../kernel/math.js';
import { PIETY_TUNING, pietyMultOf } from './piety.js';
import { deityRankStrength } from './cultImpositionApply.js';
import { magicLedger } from '../magicLedger.js';
// ⭐⭐ THE CAUSAL BINDING MOVED OUT, AND THE DIRECTION OF THE IMPORT IS THE WHOLE POINT
// (SUBSTRATE coupling wave 6, REC-1 — the WAVE-D `userRouteIdentity.js` idiom).
// `causalState.js` is EAGER and needed exactly the binding table and the pricing pair;
// importing THIS file for them dragged the field kernel AND `piety.js` (28,584 B) into
// the first-paint closure, and a chunk pin cannot cure a genuinely-eager static edge —
// measured, it made the closure 291 B WORSE (FP-G17). So the substrate now imports
// `faithChannelBindings.js` and this file imports it too: the field still reads the
// register it iterates, the causal site no longer reaches through the field to get it,
// and the measured closure fell 1,054,284 → 1,047,050 B.
// ⚠⚠ AND NOTHING IS RE-EXPORTED FROM HERE, which is a REVERSAL of this car's first cut
// and the reversal is the interesting half. A convenience re-export kept every consumer
// address stable — and left the leaf a `worldPulse` MECHANISM with no direct importer,
// which `mechanismLitCoverage`'s ratchet correctly reds: AUTO lit credit is granted for a
// direct import, so a re-export would have hidden a new mechanism behind an old address
// and left it lit-unproven. The consumers follow the symbol to its one home instead
// (§870.4's law), and the re-export would have had no reader left in any case.
import { FAITH_CHANNEL_BINDINGS } from './faithChannelBindings.js';
import { FLAW_EFFECTS, jealousBoonScale01 } from './deityFlaws.js';
import { FAITH_FIELD_TUNING, FAITH_FIELD_DOOR } from './faithTuningSurface.js';

/**
 * The channel vocabulary, MIRRORED from `customContentSchema.DEITY_EFFECT_CHANNEL_KEYS`
 * rather than imported: that module is the heavy authoring wall, and the pulse must
 * not pull it in (the same reasoning that keeps `deityAxes` import-free). The mirror
 * is pinned against its source in the field's own test, exactly as F1c pinned its
 * three vocabulary mirrors and F2c pinned `TEMPER_WORDS`.
 *
 * ⚠ OWNER-UNSIGNED. This register is `DESIGN_W_FAITH` §D3 prose, not a signed pack
 * row; F1c's receipt records that the pack contains no boon/bane register at all.
 * @type {readonly string[]}
 */
export const FAITH_CHANNELS = Object.freeze([
  'harvest', 'trade', 'craft', 'healing', 'sea', 'order', 'war_readiness', 'learning', 'hearth',
]);

/**
 * The banded magnitudes, mirrored from `DEITY_EFFECT_STRENGTH_KEYS` on the same
 * terms. A strength is a BAND WORD and never a float in authored content; the
 * numbers in `FAITH_FIELD_TUNING.STRENGTH` are this kernel's interpretation of the
 * bands, and they are the tuning surface the owner signs (F6c), not authored data.
 * @type {readonly string[]}
 */
export const FAITH_STRENGTHS = Object.freeze(['faint', 'firm', 'heavy']);

/**
 * The channels that name no causal quantity, each with the measurement that says so.
 * Kept as a POSITIVE register rather than as the absence of a binding, so the set is
 * enumerable, testable and impossible to shrink by accident: the wiring test asserts
 * `FAITH_CHANNELS === keys(BINDINGS) ∪ keys(UNBOUND)` exactly, so a tenth channel, or
 * a binding quietly deleted, reds rather than going silently inert.
 * @type {Readonly<Record<string, string>>}
 */
export const FAITH_UNBOUND_CHANNELS = Object.freeze({
  sea: 'No settlement causal variable names the sea. The estate\'s only sea quantity is stormMultOf (spatial/navalLayer.js), consumed solely by roads/seaRoads.js in the spatial layer behind the dark virtual navalEnabled — not a causal variable, and not readable from a settlement.',
  learning: 'No settlement causal variable names learning. The only engine uses of the word are LAW_BAND_KEYS\'s law-band adaptation rate and dispositionTreatyLearningActive, neither of which is "Learning and record".',
  hearth: 'No fertility or household causal variable exists. The word appears only in a founding-myth vocabulary token and in interior furniture templates.',
});

/**
 * W-FAITH F6c — THE TUNING AND THE DOOR MOVED TO THE SIGNATURE SURFACE.
 *
 * `FAITH_FIELD_TUNING` (PATRON_AMP, STRENGTH, DAMP_MAX, CAUSAL_SWING — every one an
 * owner-unsigned candidate, §763) and `FAITH_FIELD_DOOR` now live in
 * `faithTuningSurface.js`, the ONE file the owner's pen edits, so the tune-and-sign
 * act is a single file's diff (the D4 density-signature pattern). They are
 * re-exported here VERBATIM — same objects, not copies — so every existing import
 * path still resolves and a fork between the two spellings is unconstructible
 * (pinned by identity in `tests/domain/faithTuningSurface.test.js`). The derivation
 * notes for each value, including the CAUSAL_SWING lawOrderSwing-parity note and the
 * DAMP_MAX 63 % reachable-band note, moved with the numbers they explain.
 */
export { FAITH_FIELD_TUNING, FAITH_FIELD_DOOR };

/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {{ deityRef?: unknown, snapshot?: Record<string, unknown>, share?: unknown, standing?: unknown, suppressed?: unknown }} FaithMember */
/** @typedef {{ deities?: Record<string, FaithMember>, patronRef?: unknown }} FaithReligionState */
/** @typedef {{ deityRef: string, channel: string, weight: number, term: number, flaw?: string }} FaithContribution */
/** @typedef {{ channels: Record<string, number>, mults: Record<string, number>, contributors: readonly FaithContribution[], gated: boolean, members: number }} FaithFieldReading */

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');

/**
 * The flaw word whose modulation rides the boon term, DERIVED from the register so
 * the register stays the single decision point: re-homing or striking the jealous
 * row in `deityFlaws.FLAW_EFFECTS` moves or silences this cause with it. When no
 * `boon_term` effect exists the fade below is always the literal 1, so the empty
 * fallback is never observable in a contributor.
 * @type {string}
 */
const BOON_FLAW = Object.values(FLAW_EFFECTS).find((e) => e.modulates === 'boon_term')?.flaw ?? '';

/**
 * 0-HOLE DISCIPLINE: this leaf declares no `any`. A settlement arrives as the
 * estate's own `SimSettlement`, and every other shape it meets is reached through
 * the module that owns that shape rather than re-read here — which is what keeps
 * this file off the observed-shape ratchet entirely.
 */

/**
 * THE ONE MAGIC-GATE CHOKEPOINT (D3). Where the world's magic dial says magic does
 * not exist, boon and bane contribute a ZERO mechanical term and survive as cultural
 * emphasis in prose only.
 *
 * It is ONE gate on the whole term fold rather than a branch per channel, so there
 * is exactly one place to read and exactly one place to get wrong.
 *
 * ⚠⚠ IT IS **NOT** `bufferMagic01`'s PREDICATE, AND THE DIFFERENCE IS DELIBERATE.
 * That reader answers 0 for `!present || !magicExists`, because it returns a 0..1
 * SCALE on which an unprofiled settlement legitimately has no magic buffer. This is
 * a GATE on the whole faith term, and a settlement with no magic record at all has
 * not said magic is dead — it has said nothing. `present: false` means "never
 * profiled", which is the DORMANCY case; answering 0 there would silence the faith
 * field on every settlement that predates the magic ledger, and would make an
 * unmeasured world observably different from a measured one for a reason that has
 * nothing to do with faith. D3 gates on "the world's magic dial SAYS magic does not
 * exist"; an absent dial says nothing, so only an explicit `magicExists === false`
 * closes this gate.
 *
 * @param {SimSettlement | null | undefined} settlement
 * @returns {0 | 1}
 */
export function magicGate01(settlement) {
  // ⚠ THE LEDGER IS CALLED WHOLE RATHER THAN PROJECTED INTO, AND THE OBSERVED-SHAPE
  // RATCHET IS WHY. An earlier cut of this function re-read `config.magicExists` and
  // the legacy `settlement.magicLevel` itself, in `magicBufferApply`'s
  // explicit-projection style. That style is right where a caller's shape genuinely
  // differs — and wrong here: it minted this file its OWN reads of two keys the
  // generator never writes, which `check-observed-shape-readers` refused as NEW rows
  // against a new file's ceiling of 0. Calling the ledger whole keeps those reads in
  // `magicLedger.js`, where the estate's frozen rows for them already live, and
  // leaves exactly one module in the tree that knows how a magic dial is spelled.
  const ledger = magicLedger(settlement);
  return ledger.present === true && ledger.magicExists === false ? 0 : 1;
}

/**
 * The standing weight, reusing PIETY_TUNING's own table so the field and devotion
 * can never disagree about what `established` is worth. An unrecognised standing
 * reads as the weakest, which is the table's existing fallback.
 * @param {unknown} standing
 * @returns {number}
 */
export function standingWeight(standing) {
  const table = /** @type {Record<string, number>} */ (
    /** @type {unknown} */ (PIETY_TUNING.STANDING_DEVOTION));
  return table[str(standing)] ?? table.cult;
}

/**
 * `w(d, s)` — one member's voice in the field, before any channel is considered.
 *
 * `share` is the religion state's 0..100 adherent pool, normalised here with the
 * same `clamp01(share / 100)` the piety module uses; `rankWeight` is the estate's
 * existing `deityRankStrength`; `standingWeight` is PIETY_TUNING's table.
 *
 * @param {FaithMember | null | undefined} member
 * @param {boolean} isPatron
 * @returns {number} 0 when the member has no adherents — silence, not a floor
 */
export function memberWeight(member, isPatron) {
  const share01 = clamp01((Number(member?.share) || 0) / 100);
  if (share01 === 0) return 0;
  const rank = deityRankStrength(member?.snapshot);
  const amp = isPatron ? FAITH_FIELD_TUNING.PATRON_AMP : 1;
  return share01 * rank * standingWeight(member?.standing) * amp;
}

/**
 * `aspectTerm(d, channel)` — the deity's own signed pull on ONE channel, unweighted.
 *
 * Boon adds, bane subtracts, and a deity may legally carry both on the SAME channel
 * (D3 / §5 open question 3 — a storm god who blesses and wrecks the sea): they sum,
 * and a deity that blesses and blights equally nets to silence, which is honest.
 *
 * Both halves are SET-MEMBERSHIP tests, never truthiness: an authored value outside
 * the closed vocabulary contributes nothing rather than being coerced into a band.
 *
 * ⭐ THE JEALOUS FLAW (W-FAITH F5c) SCALES THE BOON ADDEND ONLY — `boonScale01` is
 * `deityFlaws.jealousBoonScale01`'s answer, defaulting to the literal 1 so every
 * pre-flaw caller is byte-identical. The scale lives INSIDE this term, and the term
 * is inside the fold's `× gate` product, so a magic-dead world's zero stays exactly
 * zero no matter what a flaw does — the one-magic-gate law, held by construction.
 * The bane is deliberately untouched: the charter says the BOON weakens.
 *
 * @param {Record<string, unknown> | null | undefined} snapshot
 * @param {string} channel
 * @param {number} [boonScale01] the jealous fade, 0..1; default 1 (inert)
 * @returns {number}
 */
export function aspectTerm(snapshot, channel, boonScale01 = 1) {
  if (!snapshot || !FAITH_CHANNELS.includes(channel)) return 0;
  const mag = /** @type {Record<string, number>} */ (
    /** @type {unknown} */ (FAITH_FIELD_TUNING.STRENGTH));
  let term = 0;
  if (str(snapshot.boonChannel) === channel) term += (mag[str(snapshot.boonStrength)] ?? 0) * boonScale01;
  if (str(snapshot.baneChannel) === channel) term -= mag[str(snapshot.baneStrength)] ?? 0;
  return term;
}

/**
 * The unsuppressed members, in a total order so the fold is deterministic. Mirrors
 * `religionState`'s file-local `activeRefs` — restated rather than imported because
 * that module is the religion ENGINE and this leaf must stay importable by it
 * without a cycle (and `activeRefs` is not exported there in any case).
 * @param {FaithReligionState | null | undefined} state
 * @returns {Array<{ member: FaithMember, isPatron: boolean }>}
 */
function activeMembers(state) {
  const deities = state && typeof state.deities === 'object' && state.deities ? state.deities : null;
  if (!deities) return [];
  const patronRef = str(state?.patronRef);
  return Object.keys(deities)
    .filter((ref) => ref && deities[ref] && !deities[ref].suppressed)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
    .map((ref) => ({ member: deities[ref], isPatron: ref === patronRef }));
}

/**
 * THE FIELD, per settlement: a signed total and a multiplier for every channel, plus
 * the contributors that produced them.
 *
 * ⭐ THE DORMANCY GUARANTEE, and it is exact rather than approximate: with no
 * religion state, no members, no authored boon/bane, or a dead-magic world, every
 * channel's total is EXACTLY 0 and its multiplier EXACTLY 1 — the same literal 1.0
 * every `*Of(settlement)` reader in this subsystem answers when its record is
 * absent. Legacy worlds cannot observe the feature because there is nothing to
 * observe, not because a small number was rounded away.
 *
 * @param {SimSettlement | null | undefined} settlement
 * @param {FaithReligionState | null | undefined} religionState
 * @returns {FaithFieldReading}
 */
export function faithFieldOf(settlement, religionState) {
  const members = activeMembers(religionState);
  const gate = magicGate01(settlement);
  // Absent settlement ⇒ the same literal 1 `pietyMultOf` answers for an absent
  // record; narrowed here rather than cast, so the null case is visible.
  const piety = settlement ? pietyMultOf(settlement) : 1;
  // W-FAITH F5c — THE JEALOUS FADE, computed once per member because it is
  // channel-blind (the fade is about the boon, whichever channel carries it).
  // `contested01` counts RIVAL GODS ONLY — the other ACTIVE members' pool fraction.
  // Unbelief does not contest: a sole god among the faithless keeps its whole
  // blessing, which is the honest reading of "share is contested". On a conserved
  // pantheon this is (100 − own share)/100 minus the godless remainder.
  const totalShare = members.reduce((sum, { member }) => sum + (Number(member?.share) || 0), 0);
  const voices = members.map(({ member, isPatron }) => {
    const contested01 = clamp01((totalShare - (Number(member?.share) || 0)) / 100);
    return { member, isPatron, boonScale01: jealousBoonScale01(member?.snapshot, contested01) };
  });
  /** @type {Record<string, number>} */
  const channels = {};
  /** @type {Record<string, number>} */
  const mults = {};
  /** @type {FaithContribution[]} */
  const contributors = [];

  for (const channel of FAITH_CHANNELS) {
    let total = 0;
    for (const { member, isPatron, boonScale01 } of voices) {
      const aspect = aspectTerm(member?.snapshot, channel, boonScale01);
      if (aspect === 0) continue;
      const weight = memberWeight(member, isPatron);
      // THE ONE GATE, applied to the term rather than to the sum: a dead-magic world
      // produces a contributor list that is EMPTY rather than one full of zeroes, so
      // a receipt reader cannot mistake a silenced god for a present one.
      const term = aspect * weight * piety * gate;
      if (term === 0) continue;
      total += term;
      contributors.push({
        deityRef: str(member?.deityRef),
        channel,
        weight,
        term,
        // The typed cause (D2: herald colour rides the flaw token), a key ONLY when
        // the fade actually touched this term — the boon channel, scale off 1. A
        // dormant or bane-side contribution keeps its exact pre-flaw shape.
        ...(boonScale01 !== 1 && str(member?.snapshot?.boonChannel) === channel
          ? { flaw: BOON_FLAW } : {}),
      });
    }
    // THE BACKSTOP. Signed and symmetric, so an unnormalised pantheon of blighters
    // bottoms out exactly as an unnormalised pantheon of blessers tops out. On a
    // CONSERVED pantheon this clamp never binds (see FAITH_FIELD_TUNING.DAMP_MAX):
    // the pool itself is the bound, and this is what catches a caller who forgot.
    const capped = clamp(total, -FAITH_FIELD_TUNING.DAMP_MAX, FAITH_FIELD_TUNING.DAMP_MAX);
    channels[channel] = capped;
    // The composite bound is PIETY_TUNING's own, so no faith-side multiplier can
    // leave the range the owner set for this subsystem.
    mults[channel] = clamp(1 + capped, PIETY_TUNING.MULT_MIN, PIETY_TUNING.MULT_MAX);
  }
  return { channels, mults, contributors, gated: gate === 0, members: members.length };
}

/**
 * The single-channel reader, shaped like every other `*Of(settlement)` multiplier in
 * this subsystem so a future consumer reads it the way it already reads piety.
 * Absent everything ⇒ literal 1. An unknown channel ⇒ literal 1, never `undefined`:
 * a consumer that mistypes a channel name gets the identity, not a NaN downstream.
 *
 * @param {SimSettlement | null | undefined} settlement
 * @param {FaithReligionState | null | undefined} religionState
 * @param {string} channel
 * @returns {number}
 */
export function faithChannelMult(settlement, religionState, channel) {
  if (!FAITH_CHANNELS.includes(channel)) return 1;
  return faithFieldOf(settlement, religionState).mults[channel];
}

// ─────────────────────────────────────────────────────────────────────────────
// W-FAITH F4c — THE PROJECTION SEAM, and why the wiring needs one at all.
//
// `causalState.deriveCausalState(settlement)` takes ONLY a settlement. Every one of
// its callers — dailyLife, the PDF system-state section, the dossier engine
// sections, SubstrateTab, lib/structuralFingerprint, magicProfile — holds no
// worldState and therefore no religion state, while `faithFieldOf` REQUIRES one
// (F3c's M2: the projected `faithProfile.deities[]` carries share/standing/isPatron
// but not each member's snapshot, so it cannot answer the authored boon/bane).
// The field therefore cannot be computed at the causal site.
//
// The seam that resolves it is the estate's own, already worked twice in this very
// subsystem: `projectReligionStateOntoSettlement` holds BOTH objects and already
// attaches two conditional derived read-models — `piety` (W-F3) and `martial`
// (W-F8). The field is the third, and it inherits their whole discipline:
//
//   • CONDITIONAL — absent unless some deity authors a boon or bane, which no deity
//     in the estate does. A key is a byte; no key, no byte, byte-identical.
//   • RE-DERIVED EVERY TICK from the religion state; never authoritative state, so
//     it cannot drift out of agreement with the pantheon that produced it.
//   • READ-TIMED — written at tick END, consumed at the next tick's START, exactly
//     as piety is. This tick's field effects can never re-enter this tick's piety,
//     which is the anti-runaway seam this file's header names.
//
// ⚠ DELIBERATELY NOT WIDENED: the alternative was to carry every member's snapshot
// into `faithProfile.deities[]` so a causal reader could recompute the field. That is
// a per-deity persisted-shape change on every faith settlement in the estate, and
// F3c's M2 refused it on exactly that ground. One small computed record is the
// cheaper honest shape.
// ─────────────────────────────────────────────────────────────────────────────

/** @typedef {{ channels: Record<string, number> }} FaithFieldProjection */

/** Six decimals, the estate's persisted-float idiom — a projected read-model that is
 *  re-derived every tick must not churn a save's bytes in the fifteenth digit.
 *  ⚠ `-0` is normalised to `0`: `Math.round(-0.2)` is `-0`, which serialises as `-0`
 *  and would make two arithmetically identical saves differ by a character.
 *  @param {number} v @returns {number} */
const round6 = (v) => {
  const r = Math.round(v * 1e6) / 1e6;
  return r === 0 ? 0 : r;
};

/**
 * THE PROJECTED FIELD, or `null` when there is nothing to project.
 *
 * Only channels whose signed total is non-zero are carried, in codepoint order, so
 * the record names what actually moved and a reader cannot mistake a silenced god for
 * a present one (the same reasoning that keeps `contributors` empty under the magic
 * gate rather than full of zeroes).
 *
 * ⭐⭐ IT ITERATES `FAITH_CHANNEL_BINDINGS`, NOT `FAITH_CHANNELS`, AND THAT IS A
 * DELIBERATE NARROWING. The three channels that name no causal variable would otherwise
 * mint a persisted key that NOTHING reads — a writer with no reader, the exact mirror of
 * the reader-with-no-writer class the observed-shape ratchet caught in this very
 * subsystem one car ago. Worse, it would make an authored `boon: learning` change a
 * save's bytes while changing no behaviour at all, which is the shape of a promise
 * quietly broken. Narrowed here, `boon: learning` mints no key, moves no score, and is
 * inert in the strongest available sense: there is nothing of it anywhere.
 *
 * ⭐ NULL IS THE DORMANCY GUARANTEE AND IT IS EXACT. No religion state, no members,
 * no authored boon/bane on a BOUND channel, or a dead-magic world ⇒ every total is
 * exactly 0 ⇒ no channels ⇒ `null` ⇒ the caller attaches NO KEY. Legacy worlds cannot
 * observe the feature because there is nothing to observe.
 *
 * @param {SimSettlement | null | undefined} settlement
 * @param {FaithReligionState | null | undefined} religionState
 * @returns {FaithFieldProjection | null}
 */
export function faithFieldProjection(settlement, religionState) {
  const reading = faithFieldOf(settlement, religionState);
  /** @type {Record<string, number>} */
  const channels = {};
  let any = false;
  // Codepoint order: `Object.keys` on a frozen literal preserves insertion order, and the
  // sort makes the record's key order a property of the CHANNEL NAMES rather than of how
  // the register happens to be written — so re-ordering the register cannot churn a save.
  for (const channel of Object.keys(FAITH_CHANNEL_BINDINGS).sort()) {
    const total = round6(reading.channels[channel]);
    if (total === 0) continue;
    channels[channel] = total;
    any = true;
  }
  return any ? { channels } : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// `faithChannelTotalOf` and `faithChannelLift` — THE PRICING PAIR — now live in
// `faithChannelBindings.js` beside the register they read, and are imported FROM THERE
// by everything that uses them: the eager `causalState.js` and the wiring test. They
// moved because `causalState.js` is eager (see the import block's note, and REC-1 in the
// SUBSTRATE coupling's wave-6 receipt for the measured closure), and they are NOT
// re-exported here — the address follows the symbol.
// ─────────────────────────────────────────────────────────────────────────────

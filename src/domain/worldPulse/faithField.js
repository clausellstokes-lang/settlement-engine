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
 *   • THE FLAW. Vice-pole modulation is F5c's, attached to chart positions.
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
 * only `kernel/math`, the piety leaf, the cult-imposition leaf and the magic ledger
 * — each of which imports only `deityAxes` / `data/constants`, so the graph stays
 * acyclic and this leaf remains importable by the religion engine.
 */
import { clamp, clamp01 } from '../../kernel/math.js';
import { PIETY_TUNING, pietyMultOf } from './piety.js';
import { deityRankStrength } from './cultImpositionApply.js';
import { magicLedger } from '../magicLedger.js';

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
 * The seam name TE-VIRT-1 owes a home. Written as a STRING rather than read from
 * any rules object, because nothing reads it yet and a key that is only ever
 * compared against would read as a live gate that is permanently off — which is
 * indistinguishable, to the next lane, from a feature that was tried and shelved.
 */
export const FAITH_FIELD_DOOR = 'faithFieldEnabled';

/**
 * ⚠ EVERY NUMBER BELOW IS AN OWNER-UNSIGNED CANDIDATE (§763's tuning carve-out).
 * The SHAPE is the car's claim; the values are the pen's.
 */
export const FAITH_FIELD_TUNING = Object.freeze({
  // The patron is louder than a co-resident cult, but not categorically different —
  // the whole point of a FIELD is that the patron stopped being the only voice.
  PATRON_AMP: 1.6,
  // Band → signed magnitude, before any weighting. `heavy` at full weight is a
  // quarter-turn on a channel; a cult with a faint boon is nearly inaudible, which
  // is the intended texture.
  STRENGTH: Object.freeze({ faint: 0.05, firm: 0.12, heavy: 0.25 }),
  // THE SATURATION CAP — the piety module's own DAMP_MAX by value and by intent.
  //
  // ⚠⚠ IT IS A BACKSTOP, NOT THE RUNAWAY GUARANTEE, AND THAT WAS MEASURED RATHER
  // THAN ASSUMED. The first draft of this file claimed "ten heavy-boon deities move
  // a channel no further than the cap"; executing it showed ten heavy-boon deities
  // reach 0.25175, and that NO conserved pantheon can reach 0.6 at all. The real
  // bound is STRUCTURAL: `renormShares` conserves the adherent pool at 100 points,
  // so Σ share01 ≤ 1 and the whole fold is bounded by
  //     max|channel| = STRENGTH.heavy × DEITY_RANK_STRENGTH.major × PATRON_AMP
  //                  = 0.25 × 0.95 × 1.6 = 0.38
  // attained only by a lone ascendant major patron holding the entire pool. A
  // pantheon cannot run away because ADDING a god DIVIDES the pool rather than
  // adding to it — a stronger guarantee than a clamp, because it holds by
  // construction instead of by a number somebody could raise.
  //
  // The clamp stays, and is live rather than dead code: it binds the moment a
  // caller hands in an UNNORMALISED state (measured — ten members at 100 share each
  // clamp to exactly 0.6). Both halves are pinned in `faithFieldEquation.test.js`.
  //
  // ⚠ FOR THE PEN (F6c): the reachable band therefore uses 63 % of the declared cap.
  // Whether that is right taste — a lower cap, or a louder STRENGTH ladder — is a
  // tuning row for the owner's signature, not a lane's call to make silently.
  DAMP_MAX: 0.6,
});

/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {{ deityRef?: unknown, snapshot?: Record<string, unknown>, share?: unknown, standing?: unknown, suppressed?: unknown }} FaithMember */
/** @typedef {{ deities?: Record<string, FaithMember>, patronRef?: unknown }} FaithReligionState */
/** @typedef {{ deityRef: string, channel: string, weight: number, term: number }} FaithContribution */
/** @typedef {{ channels: Record<string, number>, mults: Record<string, number>, contributors: readonly FaithContribution[], gated: boolean, members: number }} FaithFieldReading */

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');

/**
 * 0-HOLE DISCIPLINE: this leaf declares no `any`. A settlement arrives as the
 * estate's `SimSettlement`, and the one shape that is NOT that — the magic ledger's
 * own read surface — is PROJECTED explicitly below rather than cast across, which is
 * `magicBufferApply`'s stated idiom and keeps the narrowing where it is checkable.
 * @param {unknown} value @returns {Record<string, unknown>}
 */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {}
);

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
  // PROJECTED, not cast (magicBufferApply's discipline): the ledger owns a read
  // surface this file does not, so the three fields it reads are narrowed here where
  // the narrowing is checkable, rather than asserted across a shape mismatch.
  const config = asRecord(settlement?.config);
  const legacyBand = asRecord(settlement).magicLevel;
  const ledger = magicLedger({
    config: {
      magicLevel: typeof config.magicLevel === 'string' ? config.magicLevel : undefined,
      priorityMagic: Number.isFinite(Number(config.priorityMagic))
        ? Number(config.priorityMagic) : undefined,
      magicExists: config.magicExists === false ? false : undefined,
    },
    magicLevel: typeof legacyBand === 'string' ? legacyBand : undefined,
  });
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
 * @param {Record<string, unknown> | null | undefined} snapshot
 * @param {string} channel
 * @returns {number}
 */
export function aspectTerm(snapshot, channel) {
  if (!snapshot || !FAITH_CHANNELS.includes(channel)) return 0;
  const mag = /** @type {Record<string, number>} */ (
    /** @type {unknown} */ (FAITH_FIELD_TUNING.STRENGTH));
  let term = 0;
  if (str(snapshot.boonChannel) === channel) term += mag[str(snapshot.boonStrength)] ?? 0;
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
  /** @type {Record<string, number>} */
  const channels = {};
  /** @type {Record<string, number>} */
  const mults = {};
  /** @type {FaithContribution[]} */
  const contributors = [];

  for (const channel of FAITH_CHANNELS) {
    let total = 0;
    for (const { member, isPatron } of members) {
      const aspect = aspectTerm(member?.snapshot, channel);
      if (aspect === 0) continue;
      const weight = memberWeight(member, isPatron);
      // THE ONE GATE, applied to the term rather than to the sum: a dead-magic world
      // produces a contributor list that is EMPTY rather than one full of zeroes, so
      // a receipt reader cannot mistake a silenced god for a present one.
      const term = aspect * weight * piety * gate;
      if (term === 0) continue;
      total += term;
      contributors.push({ deityRef: str(member?.deityRef), channel, weight, term });
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

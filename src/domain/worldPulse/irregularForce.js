/**
 * domain/worldPulse/irregularForce.js — W-SEAT **D10, THE IRREGULAR-FORCE LAW**, car SEAT-7a.
 *
 * THE OWNER'S MECHANISM, QUOTED FROM THE VOLUME (`docs/DESIGN_W_SEAT.md`, D10): "A coup,
 * rebellion, or insurgency that crosses its attempt gate births a typed IRREGULAR FORCE,
 * derived by THE SAME law a regular unit of that settlement would use in wartime … THE
 * CONTEST: below a force threshold, the existing verdict math stands with ONE new typed
 * term (the force ratio)." This leaf is that below-threshold half, and NOTHING else: it
 * derives how many people would rise and what that mass is worth against the loyal side,
 * and it hands the coup verdict a single dimensionless factor. The engagement machinery,
 * the `civilContests` ledger and the splinter birth are LATER CARS and are named in §DEFERRED.
 *
 * ⛔⛔ THE CHARTER'S OWN SHAPE FOR THIS TERM COULD NOT LAND, AND THAT IS MEASURED RATHER
 * THAN ARGUED. F3 charters `forceRatioAdj` as a SIXTH SIGNED ADDITIVE TERM in the pHold
 * clamp. The estate's own adj-budget instrument (`tests/domain/foreignSeatCoupAdj.test.js`)
 * pins the five live terms at a worst case of exactly 0.815 against a `DECLARED_BUDGET` of
 * 0.82 — five thousandths of headroom — and says of itself, verbatim: "The committed
 * budget. Raising it is a tuning-signature act, not a lane's call." A sixth ADDITIVE term
 * of any magnitude a designer would choose therefore cannot land without an owner tuning
 * signature, which THE PROMISE reserves to the tuning sitting.
 *
 * ⭐ SO THE TERM IS MULTIPLICATIVE ON `share`, NOT ADDITIVE BESIDE IT — and this is the
 * better home on the merits, not merely the available one. The budget exists to stop
 * additive terms from SATURATING the clamp until `share` (the thing the contest is
 * actually about) stops mattering; a force ratio is a claim ABOUT share — whether the
 * court's standing is backed by anyone who can fight — so scaling share expresses it
 * without ever crowding it out. A lopsided political contest stays lopsided. The
 * factor-exactly-1-when-dark idiom is this very verdict file's own, already at
 * `rulingPowerCoup.js` :93/:108 (`ladderEffectivePowerFactor`, "Returns EXACTLY 1.0 when
 * the ladder is dark"), so no new pattern is invented here. JUDGMENT — vetoable.
 *
 * ⛔ DARKNESS IS BIT IDENTITY, BY CONSTRUCTION AND NOT BY ARITHMETIC. With the key dark
 * `irregularShareFactor` returns the literal `1` before it reads a single field of the
 * world, and `x * 1` is exact for every finite double — so a dark verdict reproduces the
 * pre-SEAT-7a verdict to the last bit rather than closely. Pinned both ways in
 * `tests/domain/irregularForceDormancy.byteIdentity.test.js`.
 *
 * ⚠ THE GATE READ IS SPELLED POSITIVELY AND ON THE OPTIONAL-CHAIN RECEIVER ON PURPOSE.
 * `tests/lint/engineGatedRuleKeys.walker.test.js` discovers a virtual key only through a
 * closed set of `=== true` receiver spellings, and its own decoy list proves a `!== true`
 * early return is INVISIBLE to it — a negative-polarity gate would leave this key
 * manifested with no measured read and red the walker's `manifestWithoutRead` arm.
 *
 * §DEFERRED — deliberately deferred, documented, NOT a bug to re-find:
 *   · the `civilContests` ledger + the above-threshold engagement adapter (F3) — a NEW
 *     PERSISTED SHAPE, which is an owner-gated class no lane may take alone.
 *   · the splinter birth (a) and its heads conservation (F1/F5, A2.1.2).
 *   · the `SEIZED_FRACTION` band, the veteran share and the levy resolver (F2) — each is a
 *     new tuning value, and every one of them owes a register row this lane may not write.
 *   · D11's instigation seed (F6) — SEAT-8, and conditional on W-COIN-2.
 */
import { clamp01 } from '../../kernel/math.js';
import { coupContenders } from '../rulingPowerCoup.js';
import { commonsGrievance01 } from './commonsVoiceKernel.js';
import { deriveMilitaryCapacity } from './militaryStrength.js';

/** @typedef {import('../rulingPower.js').RulingPowerSettlement} RulingPowerSettlement */

/**
 * The ONE dial this car mints. Every decimal in this leaf lives inside this span on
 * purpose: `scripts/lib/tuning-inventory.mjs` measures bare decimals per file SHRINK-ONLY
 * with new files banked at zero, so an unhoused literal here would be an unregistered dial
 * and would red the ratchet. Housing it declares it instead.
 *
 * ⛔ THIS TABLE IS UNREGISTERED AT THIS COMMIT AND THAT IS THE DESIGNED HANDOFF, NOT AN
 * OVERSIGHT: P1 totality is "no baseline and no ceiling, because a new table must red BY ID
 * until it is registered", and both the `.tuning-register.json` row and the
 * `.tuning-inventory.json` refreeze are REGISTER ACTS reserved to the landing. The exact
 * figures they must carry are PREDICTED in this car's receipt so the chair can derive them.
 */
export const IRREGULAR_TUNING = Object.freeze({
  /**
   * The share of the incumbent's political standing that a MAXIMAL rising takes off the
   * table. The factor spans `[1 - SHARE_WEIGHT, 1]`, so a court whose own people are
   * entirely against it argues from a little over two thirds of the standing its roster
   * claims — and a court nobody would rise against argues from exactly all of it.
   */
  SHARE_WEIGHT: 0.30,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * The occupied arm's substitute for the legitimacy deficit — the deposed regime's memory.
 *
 * ⛔ `resistance` REPLACES the deficit and NEVER sums with it (A2.2.6, seal-blocking). The
 * census proved the two fight: resistance already contains pre-occupation legitimacy at 0.3
 * weight with the OPPOSITE sign, so a rising against an occupier that also read the deficit
 * would have the same fact pulling both ways. A rising against an occupier reads the
 * deposed regime's memory; a rising against a legitimate ruler reads the deficit.
 *
 * @param {unknown} worldState @param {string} settlementId
 * @returns {number|null} 0..1 resistance, or null when the settlement is not occupied
 */
function occupiedResistance01(worldState, settlementId) {
  const row = asObject(asObject(asObject(worldState).occupations)[settlementId]);
  if (!row.occupierId) return null;
  const r = Number(row.resistance);
  return Number.isFinite(r) ? clamp01(r) : null;
}

/**
 * `participation01` — D10's SINGLE politics→force bridge (F4). Grep-zero before this car.
 *
 * THE SHAPE IS A CONJUNCTION AND NOT A WEIGHTED SUM, AND THAT IS A RULING RATHER THAN A
 * SIMPLIFICATION. A rising needs BOTH a population with a reason and a faction worth
 * rallying behind; either one at zero is genuinely zero people in the square, which a
 * weighted sum cannot express without inventing a floor nobody chose. A product also mints
 * no blend weights, and every blend weight is a dial this lane may not register.
 *
 * ⚠ THE ALIGNED SHARE IS AN ELITE PROXY AND IS STATED AS ONE (F4). The estate holds no
 * popular-backing quantity at all; the challengers' roster weight is the nearest true
 * thing. A religion-style adherent ledger is the recorded future option and is owner-gated.
 *
 * ⚠ NOT FLAG-GATED, DELIBERATELY. F4 rules participation "nearly flag-independent … default
 * worlds still rise". It is a pure read that costs nothing until a gated caller asks for it.
 *
 * @param {unknown} settlement a bare settlement record
 * @param {unknown} worldState the live world (for the occupations ledger)
 * @param {string} settlementId
 * @returns {number} 0..1 — the fraction of the settlement that would join a rising
 */
export function participation01(settlement, worldState, settlementId) {
  const s = asObject(settlement);
  const resistance = occupiedResistance01(worldState, settlementId);
  const cause = resistance == null ? commonsGrievance01(s) : resistance;
  // ⛔ CAST THROUGH `unknown`, NEVER THROUGH `any` — `tests/lint/domainAnyCastBaseline.test.js`
  // allows a NEW src/domain file exactly ZERO any-holes and refuses both a baseline row and a
  // DECLARED_OVERRUN as the cure. The two-step cast is the verdict file's own idiom, live at
  // `rulingPowerCoup.js`'s `ladderEffectivePowerFactor` call.
  const { challengers, incumbent } = coupContenders(
    /** @type {RulingPowerSettlement} */ (/** @type {unknown} */ (s)),
  );
  const challengerWeight = challengers.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const incumbentWeight = Number(incumbent.amplifiedWeight) || 0;
  const total = challengerWeight + incumbentWeight;
  const aligned = total > 0 ? challengerWeight / total : 0;
  return clamp01(cause * aligned);
}

/**
 * `irregularShareFactor` — D10's below-threshold contest term, as a dimensionless factor on
 * the incumbent's political share in `resolveCoupVerdict`.
 *
 * THE FORCE LAW, HONOURED AT ITS SIMPLEST TRUE FORM (F2 + F1's UNIT LAW): both sides are
 * read off `deriveMilitaryCapacity`'s EXISTING facets on the 0..100 capacity axis, so there
 * is no second combat math and no headcount is ever converted twice — this car never
 * touches heads at all. The rising is the settlement's own manpower at the participating
 * fraction; the loyal side is the institutional envelope (garrison, watch, walls) plus the
 * manpower that did NOT rise. The refinements F2 names on top of this — the seized
 * institutional fraction, the veteran share, the levy resolver — are each a new dial and
 * are deferred with the register row they would owe.
 *
 * Returns EXACTLY `1` when the key is dark, when no rising has mass, or when the world is
 * garbage — INERT, never NaN, into a clamp that would otherwise poison the whole verdict.
 *
 * @param {unknown} worldState @param {unknown} snapshot @param {string} settlementId
 * @returns {number} `[1 - IRREGULAR_TUNING.SHARE_WEIGHT, 1]`
 */
export function irregularShareFactor(worldState, snapshot, settlementId) {
  // ⛔ POSITIVE `=== true` on the optional-chain receiver — the census's discoverable form.
  const lit = /** @type {{ simulationRules?: { irregularForceEnabled?: unknown } }} */ (
    asObject(worldState)
  )?.simulationRules?.irregularForceEnabled === true;
  if (!lit) return 1;

  const entry = asObject(asObject(asObject(snapshot).byId).get instanceof Function
    ? /** @type {Map<string, unknown>} */ (/** @type {unknown} */ (asObject(snapshot).byId)).get(settlementId)
    : null);
  const settlement = asObject(entry.settlement);
  if (!settlement.powerStructure) return 1;

  const participation = participation01(settlement, worldState, settlementId);
  if (!(participation > 0)) return 1;

  const facets = asObject(asObject(deriveMilitaryCapacity(settlement)).facets);
  const manpower = Number(facets.manpower) || 0;
  const institutions = Number(facets.institutions) || 0;
  const rising = manpower * participation;
  const loyal = institutions + manpower * (1 - participation);
  const contested = rising + loyal;
  if (!(contested > 0)) return 1;

  return 1 - IRREGULAR_TUNING.SHARE_WEIGHT * clamp01(rising / contested);
}

/**
 * espionageMath.js — ES-0: the espionage layer's arithmetic, minted as pure leaves
 * before anything calls them.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.1-§3.4b, §3.7, §3.8, §3.12, §3.14. Nothing here reads a
 * clock, draws a random number, touches a store, or writes anything: every function is a
 * pure read over its arguments (the two that take a settlement read it through the
 * estate's existing canonical accessors and nothing else).
 *
 * DARK BY CONSTRUCTION, IN THE STRONGEST SENSE THE ESTATE HAS: no flag guards these
 * functions because NOTHING CALLS THEM YET. The WR-10 dark-instrument precedent — the
 * leaves land, get pinned, and wait for the wave that wires them (ES-1..ES-5). A source
 * scan proving no engine module imports this file is part of the ES-0 dormancy fence.
 *
 * ⚠ THE WORLD-SIDE TERMS ARE ARGUMENTS, NOT IMPORTS, IN `catchChance01`. The catch model
 * (§3.3) composes eight world-derived factors. They arrive as a measured record rather
 * than being gathered here, for two reasons that are both about honesty: the gathering
 * belongs to the gauntlet STAGE (ES-2, which owns the per-tick walk and the keyed-hash
 * roll), and a function that gathers its own inputs cannot have any single factor
 * mutated out in a test — which is exactly how a term that looks live turns out to be
 * dead. Every factor below is individually droppable, and the mutation battery drops
 * each one.
 *
 * ⚠ ONE ROLL, ONE DIP (J-ES-3, and the fork it cites is real). corruption.js documents
 * in-source that ONSET reads DRAGGED security while EXPOSURE reads RAW, because the
 * guild's shielding is already priced into `exposureChance`'s −guildStrength term.
 * The catch roll is a NEW roll with NO −guildStrength term anywhere in its chain, so it
 * takes the DRAGGED side EXACTLY ONCE: the caller passes `guildEffectiveSecurity(...)`
 * already multiplied by `(1 - patronageSecurityDrag(...).drag)` as `securityEff01`, and
 * this leaf applies no further criminal discount. Reading RAW security instead would
 * make a criminally-captured town catch spies as well as a clean one, which inverts the
 * owner's sentence.
 *
 * ⚠ THE FROZEN/LIVE SPLIT IS WHY `orderBand` EXISTS. `climate.security` is
 * generation-frozen and saturates: it is blind to war, occupation and razed courts.
 * `law_order` is the ONE settlement security read that moves with the world, so the
 * catch chain carries it as `ORDER_FACTOR[causalBand(law_order)]`. ALL FIVE causalBand
 * rungs are MEASURED reachable on really-generated settlements (the dead-band law,
 * executed at ES-0 over 180 settlements spanning six tiers x six route classes x five
 * cultures): deity-free worlds produce collapsed/critical/strained/adequate (18/37/49/76)
 * and `surplus` is reached ONLY through the patron-deity law lever — 39 of the same 180
 * settlements crossed 75 once a lawful patron was attached, topping out at 82, while a
 * chaotic patron bottoms the score at 0. The table is therefore TOTAL over causalBand's
 * five rungs: it is keyed on an ESTATE vocabulary, not a minted one, and cutting a rung
 * from it would leave `ORDER_FACTOR[band]` undefined — a NaN in the product, which is
 * strictly worse than the dead arm the cut would be trying to prevent.
 */
import { ROADS_TUNING, embassyEnvoyWeight01, factionPowerStanding01, roadsImportanceWeight } from '../../roads/state.js';
// ES-1 — TWO WORDS THIS LEAF USED TO AUTHOR NOW ARRIVE FROM THEIR ONE MINT. The demand
// vocabulary and the itinerary cap are ROW facts before they are arithmetic facts: the
// errand's persistence DTO matches against them, so the errand vocabulary leaf owns them
// and this file BORROWS. Authoring a second `3` and a second demand list here was the
// arrangement ES-0 landed with, and it would have let the normalizer refuse a fourth stop
// while `legStack` happily priced one — a disagreement exactly one integer wide.
// ES-3 extends that same borrow to the two words the GRADIENT's DTO matches against: the
// tap vocabulary and the rooted re-sample cap. Both are row facts before they are
// arithmetic facts — `normalizeCovertMission` refuses a persisted partial whose tap is not
// in the list and a gradient longer than the cap allows — so the errand vocabulary owns the
// mint and this file re-exposes it. Authoring a second tap list here would have let the
// ramp price an interval the ledger cannot hold, which is a disagreement exactly one
// interval wide and invisible until a save file crossed it.
import {
  ENVOY_COVERT_DEMANDS,
  ENVOY_COVERT_TAPS,
  MAX_COVERT_DWELL_RESAMPLES,
  MAX_COVERT_ITINERARY_STOPS,
} from '../envoyErrandVocabulary.js';
import { readCorruptionClimate } from '../../corruption.js';
import { settlementHasUnderways } from '../clandestineFacet.js';
import { criminalStrength01Of } from '../supplyKernel.js';

/** @param {unknown} value @returns {number} */
function n01(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return number < 0 ? 0 : number > 1 ? 1 : number;
}

/**
 * ES-5b EXPORTED, ONE WORD, ZERO BEHAVIOR CHANGE. `round4` is not in kernel/math.js
 * (measured: only `clamp01` is), and the estate's two other exported `round4`s live in
 * npcLadderState.js (INTERIOR) and peaceTermsPrimitives.js (GRAMMAR) — importing either
 * from an INFO leaf would mint a cross-layer pair FOR A ROUNDING HELPER. The espionage
 * family already defines its own; exporting it keeps the borrow INFO→INFO and mints no
 * second spelling.
 * @param {number} value @returns {number}
 */
export function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/**
 * THE ACCESS DEPTH A READ WAS TAKEN AT (owner addition H). Codepoint-sorted totality
 * export; the SEMANTIC depth order is performance < beliefs < delta, which is
 * deliberately NOT the sort order — a consumer that needs depth must use
 * `TAP_DEPTH`, never the array index, or it will rank an open visitor's hearsay above
 * an embedded agent's read.
 *
 * ES-3: this is the errand vocabulary's `ENVOY_COVERT_TAPS` — the SAME frozen array, not a
 * copy — for the reason `DEMAND_BANDS` gives below. The persistence DTO matches a gathered
 * partial's tap against it, so the row owns the mint.
 * @type {ReadonlyArray<string>}
 */
export const TAP_LEVELS = ENVOY_COVERT_TAPS;

/** The depth order the words carry. Higher is deeper access. */
export const TAP_DEPTH = Object.freeze({ performance: 0, beliefs: 1, delta: 2 });

/**
 * HOW WELL A MISSION ANSWERED WHAT IT WAS SENT TO ANSWER (owner addition G).
 * Codepoint-sorted totality export; `MISSION_GRADE_ORDER` carries the ranking for the
 * same reason `TAP_DEPTH` does.
 * @type {ReadonlyArray<string>}
 */
export const MISSION_GRADES = Object.freeze(['empty', 'exceeded', 'met', 'partial']);

/** The grade ranking. Higher is better. */
export const MISSION_GRADE_ORDER = Object.freeze({ empty: 0, partial: 1, met: 2, exceeded: 3 });

/**
 * The graded bar a mission is sent to clear (§1, addition G). Codepoint-sorted.
 * ES-1: this is the errand vocabulary's `ENVOY_COVERT_DEMANDS`, re-exported under the
 * arithmetic's name — the SAME frozen array, not a copy of it, so the two can never
 * disagree about what a court may ask for.
 */
export const DEMAND_BANDS = ENVOY_COVERT_DEMANDS;

/** What a deliberating court decides to do about the gap in its picture (§3.12). Sorted. */
export const DELIBERATION_VERDICTS = Object.freeze(['act_now', 'dispatch_and_wait', 'wait_expired']);

/**
 * EVERY CONSTANT THE ESPIONAGE ARITHMETIC READS, in one frozen export (the house idiom).
 * Every value is a RAW-AUTHORED PROPOSAL until the owner signs it at the soak redo
 * (L5, THE PROMISE). None of it is ratified and no band below is tuned.
 */
export const ESPIONAGE_TUNING = Object.freeze({
  // §3.2 COVERT COMPETENCE. The power/activity split is stated explicitly because the
  // substrate carries two spellings and conflating them is the recorded failure mode:
  // POWER is `criminalStrength01Of` (the guild/faction grip) and ACTIVITY is
  // `climate.crime` (criminalEffective-derived). The directive draws a distinction the
  // generator does not, so both terms are carried, separately weighted.
  COMP_BASE: 0.35,
  COMP_POWER_W: 0.35,
  COMP_CRIME_W: 0.15,
  UW_HOME_LIFT: 1.1,
  NOTOR_W: 0.5,

  // §3.3 THE CATCH MODEL.
  CATCH_BASE: 0.06,
  CATCH_CAP: 0.6,
  SHELTER_W: 0.6,
  WARINESS_W: 0.5,
  STRESS_POROSITY: 0.35,
  UNDERWAYS_EXPOSURE_DISCOUNT: 0.8,
  INSIDE_ASSET_RELIEF: 0.75,
  // TOTAL over causalBand's five rungs. A settlement whose rule of law has collapsed
  // catches almost nobody; one in surplus keeps a watch that works.
  ORDER_FACTOR: Object.freeze({
    collapsed: 0.4,
    critical: 0.65,
    strained: 0.85,
    adequate: 1,
    surplus: 1.3,
  }),

  // §3.4 THE ITINERARY. Quadratic, so a third stop is a CHOICE and not free efficiency.
  // ES-1: the cap itself is the errand vocabulary's, because the row's normalizer is what
  // enforces it. This key re-exposes that one number rather than authoring a second.
  MAX_ITINERARY_STOPS: MAX_COVERT_ITINERARY_STOPS,
  LEG_STACK: 0.35,

  // §3.4b THE ROOTED DWELL. Monotone, and the hard cap is a backstop: the soft bound
  // (gather-or-govern) must bind first on every reachable input, or the cap is a dead band.
  DWELL_RAMP: Object.freeze([1, 1.25, 1.6, 2.1]),
  // ES-3: the errand vocabulary's `MAX_COVERT_DWELL_RESAMPLES`, re-exposed rather than
  // re-authored — the gradient's LENGTH is what the persistence DTO bounds.
  DWELL_RESAMPLE_CAP: MAX_COVERT_DWELL_RESAMPLES,

  // §3.7 THE GRADIENT.
  SECONDHAND_CAP: 0.75,
  PERF_SELF_CAP: 0.6,
  PERF_POISON_W: 0.5,

  // §3.8 THE MISSING-NPC TELL, and the home-side miss clock (J-ES-14).
  W_TELL: 0.6,
  W_CAUGHT: 0.4,
  TELL_CAP: 3,
  CAUGHT_CAP: 2,
  MISS_GRACE_TICKS: 6,

  // §3.11 THE ABSENCE COST. A LONE weight on a SINGLE ratio (away members over roster),
  // so `presentShare01 ∈ [0.5, 1]`: a faction whose entire roster is abroad loses HALF
  // its council and contest weight, never all of it. Set BY PARITY under CR-ES5B-6 —
  // seven of the family's ten `*_W` keys are exactly 0.5, and the three that are not are
  // split-term weights apportioning inside a multi-term sum, which this is not. Its
  // structural twins are NOTOR_W, WARINESS_W and both weights of §3.14 below — §3.14 is
  // THE OTHER GRAIN OF THIS SAME AMENDMENT, so any other value here would be the anomaly.
  // ⛔ CHAIR-AUTHORED DARK TUNING. Individually vetoable, engine-inert while the flag is
  // dark, and re-ratified under the owner's tuning signature at soak. It is NOT tuned to
  // make a test pass, and never to dodge a consolidation-floor crossing.
  ABSENT_W: 0.5,

  // §3.12 DELIBERATION.
  DELIBERATION_CONF_FLOOR: 0.5,
  PATIENCE_BASE_TICKS: 8,
  PATIENCE_FREQ_TICKS: 8,
  DEMAND_FLOOR01: Object.freeze({ corroborate: 0.45, confirm: 0.65, certain: 0.85 }),

  // §3.14 THE PROMOTION-RISK REGISTER.
  PROMOTION_AWAY_CAP_WEEKS: 12,
  PROMOTION_EXPOSURE_W: 0.5,
  PROMOTION_RIVAL_W: 0.5,
});

/**
 * §3.1 NOTORIETY — power rank x faction influence, as ONE number with three consequences
 * (worse at hiding, worth more when caught, missed faster at home).
 *
 * ⚠ THIS IS A CONSUMER WIDENING, NOT A SECOND SPELLING. The arithmetic is
 * `embassyEnvoyWeight01` VERBATIM, imported from roads/state.js — J-WR-10 forbids a
 * rival spelling of an existing pure leaf, and the roads export keeps its embassy name
 * because renaming it would move the war lane. The name change lives HERE, on the
 * import-source side, and tests/domain/espionageMath.test.js pins that this function's
 * output equals the roads leaf's on the same inputs, so a future edit that quietly
 * re-derives the blend reds. The observer-side twin is `believedNotorietyRank`
 * (npcCirculation.js) wherever another court is doing the noticing — belief, not truth,
 * and never self-belief (HZ10).
 *
 * Keyed on `.faction`, NEVER `.name` (the FACTION-KEY DEFECT CLASS) — via the existing
 * `factionPowerStanding01` resolver, which is why this mints no fifth spelling of it.
 *
 * @param {unknown} homeSettlement the operative's home settlement.
 * @param {unknown} npc the operative.
 * @returns {number} 0..1
 */
export function operativeNotoriety01(homeSettlement, npc) {
  return embassyEnvoyWeight01({
    importanceWeight01: roadsImportanceWeight(
      /** @type {Parameters<typeof roadsImportanceWeight>[0]} */ (npc),
    ),
    factionPower01: factionPowerStanding01(
      /** @type {Parameters<typeof factionPowerStanding01>[0]} */ (homeSettlement),
      /** @type {Parameters<typeof factionPowerStanding01>[1]} */ (npc),
    ),
  });
}

/**
 * §3.2 COVERT COMPETENCE — how good this person is at not being seen, sourced from the
 * criminal capacity of the court that trained them and dragged down by their own fame.
 *
 * The notability term is the design's own joke made arithmetic: the ideal spy is
 * nobody, so the realm's most notable person is its worst operative. It composes with
 * J-ES-4's importance-INVERSE covert casting rather than duplicating it — casting picks
 * WHO goes, this prices how well they do once chosen.
 *
 * @param {unknown} homeSettlement @param {unknown} npc @returns {number} 0..1
 */
export function covertCompetence01(homeSettlement, npc) {
  const T = ESPIONAGE_TUNING;
  const climate = readCorruptionClimate(
    /** @type {Parameters<typeof readCorruptionClimate>[0]} */ (homeSettlement),
  );
  const power01 = criminalStrength01Of(
    /** @type {Parameters<typeof criminalStrength01Of>[0]} */ (homeSettlement),
  );
  const underways = settlementHasUnderways(
    /** @type {Parameters<typeof settlementHasUnderways>[0]} */ (homeSettlement),
  ) ? T.UW_HOME_LIFT : 1;
  const base = n01(T.COMP_BASE + T.COMP_POWER_W * n01(power01) + T.COMP_CRIME_W * n01(climate.crime));
  const fame = n01(operativeNotoriety01(homeSettlement, npc));
  return round4(n01(base * underways * (1 - T.NOTOR_W * fame)));
}

/**
 * §3.4 SUPERLINEAR LEG RISK. k is the stop index reached, 1..MAX_ITINERARY_STOPS.
 * Quadratic in (k-1), so the rungs are x1 / x1.35 / x2.4 at the proposed weight: a
 * two-stop journey is a modest gamble and a three-stop one is a real bet. Out-of-range
 * k is CLAMPED rather than rejected — this is a multiplier in a product, and returning
 * null here would turn a bad index into a NaN two frames away.
 *
 * @param {unknown} k @returns {number} >= 1
 */
export function legStack(k) {
  const stops = Math.max(1, Math.min(ESPIONAGE_TUNING.MAX_ITINERARY_STOPS,
    Math.trunc(Number(k)) || 1));
  return round4(1 + ESPIONAGE_TUNING.LEG_STACK * (stops - 1) * (stops - 1));
}

/**
 * §3.4b THE DWELL RAMP. A face seen too long in the same market gets noticed: capture
 * odds climb by dwell band, place-dependently (this multiplies the TARGET-side terms).
 * Interval 0 is the within-plan stay and is exactly 1, so a mission that never roots is
 * byte-identical to one with no ramp at all. Monotone non-decreasing, and the top band
 * is the plateau for every interval past the table.
 *
 * @param {unknown} intervalIdx 0 = the minted stay; 1+ = rooted re-sample intervals.
 * @returns {number} >= 1
 */
export function dwellRamp(intervalIdx) {
  const ramp = ESPIONAGE_TUNING.DWELL_RAMP;
  const index = Math.max(0, Math.trunc(Number(intervalIdx)) || 0);
  return ramp[Math.min(index, ramp.length - 1)];
}

/**
 * @typedef {Object} CatchFactors
 * @property {unknown} hostRung      a ROADS_TUNING.T4_RUNG value (1 rival, 2 cold war,
 *   3 hostile). ANYTHING ELSE MEANS NO ROLL — a friendly host rolls NOTHING, and the
 *   friend case reaches the world only through §3.5's exposure road.
 * @property {unknown} securityEff01 dragged effective security (see the header's J-ES-3 note)
 * @property {unknown} orderBand     a causalBand word for the target's `law_order`
 * @property {unknown} stressLoad01  0..1; stressed settlements are porous (addition C)
 * @property {unknown} hasUnderways  the target's clandestine facet
 * @property {unknown} hasInsideAsset a live corruption-web asset at the target (addition C)
 * @property {unknown} wariness01    §3.8's derived read
 * @property {unknown} competence01  §3.2, the operative's shelter
 * @property {unknown} stops         k for §3.4's legStack
 * @property {unknown} intervalIdx   the dwell interval for §3.4b's ramp
 */

/**
 * §3.3(b) THE STAY-DETECTION CHANCE at one stop in one dwell interval.
 *
 * PURE and TRUTH-SIDE: this is the WORLD acting on the traveller, exactly as the roads
 * gauntlet rolls truth. The K3 boundary runs between a court's DECISIONS (which read
 * BELIEF) and the world's OUTCOMES (which read truth), and this program never crosses
 * it — the dispatch-refusal read that decides whether to send at all is the believed
 * one, and it lives elsewhere.
 *
 * Returns 0 for a non-hostile host, which is the whole friend rule expressed as
 * arithmetic rather than as a caller-side condition somebody can forget.
 *
 * @param {CatchFactors} factors @returns {number} 0..CATCH_CAP
 */
export function catchChance01(factors) {
  const T = ESPIONAGE_TUNING;
  const row = factors && typeof factors === 'object' ? factors : /** @type {CatchFactors} */ ({});
  const rung = Number(row.hostRung);
  const rungs = /** @type {ReadonlyArray<number>} */ (Object.values(ROADS_TUNING.T4_RUNG));
  if (!Number.isFinite(rung) || !rungs.includes(rung)) return 0;

  const orderFactor = /** @type {Readonly<Record<string, number>>} */ (T.ORDER_FACTOR)[String(row.orderBand)];
  const order = Number.isFinite(orderFactor) ? orderFactor : T.ORDER_FACTOR.adequate;
  const porosity = 1 - T.STRESS_POROSITY * n01(row.stressLoad01);
  const underways = row.hasUnderways === true ? T.UNDERWAYS_EXPOSURE_DISCOUNT : 1;
  const asset = row.hasInsideAsset === true ? T.INSIDE_ASSET_RELIEF : 1;
  const wariness = 1 + T.WARINESS_W * n01(row.wariness01);
  const shelter = 1 - T.SHELTER_W * n01(row.competence01);

  const chance = T.CATCH_BASE * rung
    * n01(row.securityEff01) * order * wariness
    * porosity * underways * asset * shelter
    * legStack(row.stops) * dwellRamp(row.intervalIdx);
  return round4(Math.max(0, Math.min(T.CATCH_CAP, chance)));
}

/**
 * §3.8 THE MISSING-NPC TELL, pure core. A court that has noticed foreign notables going
 * quiet, and a court that has recently caught somebody, both check the next caravan
 * harder.
 *
 * ⚠ THE CORE TAKES COUNTS, NOT A WORLD, AND THAT FENCE IS THE POINT. The dangerous half
 * of this read is the VISIBILITY PREDICATE that produces `overdueForeignNotables` — it
 * must count only what the target can LAWFULLY observe (declared-face schedules that
 * have lapsed, plus absence-beliefs it already holds), and NEVER a bare covert row. A
 * covert mission's existence leaking into a foreign court's derived state would breach
 * the audience-projection boundary AND partially cancel the owner's "covert means less
 * likely captured" for free. The predicate lands at ES-5 with its own anchored negative;
 * keeping the arithmetic here counts-only means this leaf cannot be the leak.
 *
 * @param {{ overdueNotables?: unknown, recentCovertHolds?: unknown }} input
 * @returns {number} 0..1
 */
export function wariness01Core(input) {
  const T = ESPIONAGE_TUNING;
  const row = input && typeof input === 'object' ? input : {};
  const overdue = Math.max(0, Number(row.overdueNotables) || 0);
  const holds = Math.max(0, Number(row.recentCovertHolds) || 0);
  return round4(n01(
    T.W_TELL * Math.min(1, overdue / T.TELL_CAP)
    + T.W_CAUGHT * Math.min(1, holds / T.CAUGHT_CAP),
  ));
}

/**
 * §3.14 THE PROMOTION-RISK REGISTER, pure core — a DERIVED read, never a stock. The
 * longer the ambitious are abroad, the weaker they defend a contested rung against
 * rivals who never left.
 *
 * ⚠ STAGED HONESTLY. The register has two consumers and only one of them exists at
 * ES-0's landing: §3.4b's gather-or-govern read (mission mechanics). The other — the
 * ladder CONTEST term, which CHANGES home political outcomes — is Q1-gated and lands at
 * ES-5 alongside the bench discount, one amendment with two grains. Until then the
 * gather-or-govern read folds the climbing catch ALONE and declares this term absent
 * rather than narrating a risk no machinery delivers.
 *
 * @param {{ awayWeeks?: unknown, rungExposure01?: unknown, rivalPressure01?: unknown }} input
 * @returns {number} 0..1
 */
export function promotionRisk01Core(input) {
  const T = ESPIONAGE_TUNING;
  const row = input && typeof input === 'object' ? input : {};
  const away = Math.min(1, Math.max(0, Number(row.awayWeeks) || 0) / T.PROMOTION_AWAY_CAP_WEEKS);
  const pressure = T.PROMOTION_EXPOSURE_W * n01(row.rungExposure01)
    + T.PROMOTION_RIVAL_W * n01(row.rivalPressure01);
  return round4(n01(away * pressure));
}

/**
 * §3.14 THE GRADE at close — how well the landed confidence answered the bar the mission
 * was SENT to clear. One bar, three consumers (the early-resolve threshold, the
 * deliberation dispatch, and this) — no second spelling of "how sure did we need to be".
 *
 * `empty` is reachable and is meant to be: a host with no belief about the subject
 * yields nothing, which is the honesty negative the products wave pins.
 *
 * @param {{ bestConfidence01?: unknown, demand?: unknown }} input
 * @returns {'empty'|'partial'|'met'|'exceeded'}
 */
export function missionGradeFor(input) {
  const row = input && typeof input === 'object' ? input : {};
  const floors = ESPIONAGE_TUNING.DEMAND_FLOOR01;
  const bar = /** @type {Readonly<Record<string, number>>} */ (floors)[String(row.demand)];
  const floor = Number.isFinite(bar) ? bar : floors.confirm;
  const confidence = Number(row.bestConfidence01);
  if (!Number.isFinite(confidence) || confidence <= 0) return 'empty';
  if (confidence >= Math.min(1, floor + (1 - floor) / 2)) return 'exceeded';
  if (confidence >= floor) return 'met';
  return 'partial';
}

/**
 * §3.12 SPY-BEFORE-DECISION. Courts MAY defer a decision pending a confirmation mission
 * and MUST NOT always wait.
 *
 * Three verdicts, and the ordering of the guards is the design:
 *   1. URGENCY FORCES `act_now`. A siege at the gate, an overflow at the top band, war
 *      strain at the top band — a closed three-member list, each an existing banded read
 *      the caller resolves. Nobody waits on a spy with an army outside.
 *   2. TIMEOUT gives `wait_expired`. Patience ran out and the court decides anyway, on a
 *      picture now STALER than when the wait began. That is the drama, not a bug.
 *   3. `dispatch_and_wait` requires ALL of: a deciding leg genuinely stale or
 *      low-confidence, a castable operative, and doctrine patience clearing the bar.
 *      Each is a separate guard, individually mutable, because a conjunction whose arms
 *      cannot be dropped one at a time is a conjunction nobody has proven.
 * Anything else is `act_now` — the default is to DECIDE, which is what keeps a court
 * from becoming permanently deliberative.
 *
 * @param {{ decidingConfidence01?: unknown, frequency01?: unknown, urgent?: unknown,
 *   castable?: unknown, ticksSinceDispatch?: unknown, dispatched?: unknown }} input
 * @returns {'act_now'|'dispatch_and_wait'|'wait_expired'}
 */
export function deliberationRead(input) {
  const T = ESPIONAGE_TUNING;
  const row = input && typeof input === 'object' ? input : {};
  if (row.urgent === true) return 'act_now';
  const patience = T.PATIENCE_BASE_TICKS + T.PATIENCE_FREQ_TICKS * n01(row.frequency01);
  if (row.dispatched === true) {
    return (Number(row.ticksSinceDispatch) || 0) >= patience ? 'wait_expired' : 'dispatch_and_wait';
  }
  if (row.castable !== true) return 'act_now';
  const confidence = Number(row.decidingConfidence01);
  const stale = !Number.isFinite(confidence) || confidence < T.DELIBERATION_CONF_FLOOR;
  if (!stale) return 'act_now';
  return 'dispatch_and_wait';
}

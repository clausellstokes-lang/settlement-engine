/**
 * demographicsPlans.js — WAVE P3, THE PLAN. THE WRITER.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md §5c ("THE PLAN, NOT THE REROLL", review
 * amendment 3, accepted), §5 (overflow), §5b (the spatial law) and acceptance claims
 * 5, 6, 7 and 8 are this file's contract.
 *
 * ── THE DEFECT §5c EXISTS TO PREVENT ───────────────────────────────────────
 * A response chosen every tick is not a decision, it is weather. A city that draws
 * "found a satellite" on Monday, "seek imports" on Tuesday and "found a satellite"
 * again on Wednesday has committed to nothing, spent nothing, and produces a
 * chronicle no reader can follow — deterministic and INCOHERENT, which is the worst
 * of both. So the draw fires on a band CROSSING, the selection becomes ONE PERSISTENT
 * PLAN, and the plan holds:
 *
 *     proposed -> underway -> completed | failed | abandoned
 *
 * with a startup cost, a duration, real progress, named failure conditions, a
 * reconsideration threshold that is a band-crossing MAGNITUDE rather than drift, a
 * cooldown afterwards, and a receipt naming why it was chosen. §5c's scope trim is
 * respected exactly: ONE active plan per settlement, riding the docket idiom this
 * tree already uses. This is not a general planning system and must not become one.
 *
 * ── ASK P2 FIRST, ALWAYS ───────────────────────────────────────────────────
 * The lane runs AFTER the homeostat in the same tick and is handed the homeostat's
 * own per-origin answer. Spare capacity in reachable existing settlements has
 * therefore ALREADY been consumed before a single response is scored, and the
 * leftover — P2's `unplaced` — is the only thing that can weigh the founding lean.
 * A realm with empty houses in it does not mint settlements.
 *
 * ── THE FOUNDING ITSELF IS NOT WRITTEN HERE (single writer) ────────────────
 * A completed satellite plan emits an INTENT. The steading is minted by the ONE
 * founding path, `mintSteading` in settlementLifecycleKernel.js, exactly as the
 * organic mover and the FORCE verb do — so a plan-driven founding is structurally
 * identical to an organic one and the wave-E conservation pin covers it verbatim.
 * Forking a second mint here would have been the fastest way to make the two
 * foundings silently disagree about what a steading is.
 *
 * ── AND NEITHER IS THE TIER LADDER ─────────────────────────────────────────
 * A completed PROMOTION plan raises no tier and mints nobody. Design §0b is explicit
 * that the tier transition already has ONE writer (tier drift's eligibility, which
 * P1a extended with the viability read rather than forking), and §5b's saturation
 * clause asks only that a realm with no legal ground stops sprawling and starts
 * DEEPENING. That is what the competition produces: at saturation the founding lean
 * collapses to zero and the promotion lean carries the saturation term, so pressure
 * resolves up the EXISTING conserved ladder, with the same people on the same ground.
 * The plan's completion is the commitment and the receipt; the ascension is the
 * ladder's own, and not one person is created by it.
 *
 * ── ZERO PRNG STREAMS ──────────────────────────────────────────────────────
 * Not one draw is taken from any fork. Every stochastic choice is a keyed hash:
 * the response race is per-response keyed (§5c's own words), the site pick is keyed
 * by the episode, and the provisioning is arithmetic. P1's pin that each settlement
 * consumes EXACTLY TWO draws from `demographics:<id>` therefore still holds with this
 * lane lit, which is the same discipline P1a and P2 each chose for the same reason.
 *
 * Pure and headless apart from the ledger it owns: no store, no React, no I/O, no
 * clock, no ambient randomness.
 *
 * @enforced-by tests/domain/demographicsPlans.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import { formatCount } from '../formatNumber.js';
import { hash01 } from '../region/contestMath.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { LANDFORM_SUITABILITY, seamLandforms } from './steadingTopography.js';
import {
  demographicsActive,
  densityCeilingOf,
  effectiveBoundOf,
  foodCapacityOf,
  pressureOf,
} from './demographicsRates.js';
import { connectivity01Of, demographicReadings, prosperity01Of } from './demographicsPushPull.js';
import { chooseLegalSite, landLine, legalFoundingSites } from './demographicsLand.js';
import {
  OVERFLOW_BANDS,
  bandDemandsResponse,
  nextTierHeadroom,
  overflowBandOf,
  overflowRankOf,
  responseLine,
  scoreResponses,
  selectResponse,
} from './demographicsResponses.js';
import { DEMOGRAPHIC_PLANS_LEDGER, WORKS_KINDS, WORKS_TUNING } from './demographicsWorks.js';

/** @typedef {import('./demographicsRates.js').DemoSettlement} DemoSettlement */
/** @typedef {import('./demographicsPushPull.js').DemoItem} DemoItem */
/** @typedef {import('./demographicsLand.js').LandDigest} LandDigest */
/** @typedef {import('./steadingTopography.js').SteadingSite} SteadingSite */
/** @typedef {{ saveId?: (string|number), settlement?: DemoSettlement }} PlanUpdate */
/** @typedef {{ settlements?: DemoItem[] }} PlanSnapshot */

/**
 * ONE SETTLEMENT'S PLAN. Every conditional key is declared HERE, on the owning
 * typedef, so no consumer anywhere needs an any-cast to read one.
 * @typedef {Object} DemographicPlan
 * @property {string} id
 * @property {string} response       a RESPONSES member
 * @property {string} state          a PLAN_STATES member
 * @property {string} episode        the band crossing that opened it (`<tick>:<band>`)
 * @property {string} band           the overflow band at the crossing
 * @property {number} openedTick
 * @property {number} startupCost    provision the undertaking needs before it can finish
 * @property {number} provision      provision raised so far (the lane's own capital)
 * @property {number} duration       ticks of work after the plan is under way
 * @property {number} progress       ticks worked
 * @property {number} weight         the score that won the race
 * @property {string[]} because      the winning response's contributing reasons
 * @property {number} [underwayTick] when the first provision was raised
 * @property {SteadingSite} [site]   the ground the §5b law allowed (satellite only)
 */

/**
 * ONE SETTLEMENT'S ROW in the plan ledger.
 * @typedef {Object} PlanEntry
 * @property {string} [band]          the last observed overflow band (absent ⇒ `easy`)
 * @property {number} [cooldownUntil] no new episode may open before this tick
 * @property {Record<string, number>} [works] completed works by WORKS_KINDS
 * @property {DemographicPlan} [plan] the ONE active plan
 */

/** The closed PLAN STATE vocabulary. @type {ReadonlyArray<string>} */
export const PLAN_STATES = Object.freeze([
  'abandoned', 'completed', 'failed', 'proposed', 'underway',
]);

/**
 * The closed OUTCOME vocabulary — why a plan stopped. A plan that ends without one
 * of these words is a bug, not a mystery.
 * @type {ReadonlyArray<string>}
 */
export const PLAN_OUTCOMES = Object.freeze([
  'delivered', 'ground_lost', 'headroom_lost', 'lane_dark', 'pressure_eased', 'unaffordable',
]);

export const PLAN_TUNING = Object.freeze({
  /** Ticks of work each undertaking needs once it is under way. */
  DURATIONS: Object.freeze({
    emigration: 13, imports: 26, infrastructure: 39, promotion: 52, satellite: 26, send: 0,
  }),
  /** Provision each undertaking must raise before it can finish — THE CAPITAL COST.
   *  A satellite is dear because the child does not appear for free: the parent pays
   *  in people (wave E's conserved debit, applied by the mint) AND in the stores,
   *  tools and beasts that go out with them, which is this number. */
  STARTUP: Object.freeze({
    emigration: 20, imports: 45, infrastructure: 90, promotion: 140, satellite: 120, send: 0,
  }),
  /** Provision raised per tick, banded by the settlement's prosperity rung. A
   *  subsistence town raises one unit a week and a wealthy one five, so the same
   *  undertaking takes a poor place five times as long and often defeats it — which
   *  is the point, and is why `unaffordable` is a named outcome rather than a hang. */
  PROVISION_BANDS: Object.freeze([1, 2, 3, 5]),
  /** Fields that make a genuine surplus feed the undertaking as well as the town. */
  PROVISION_SURPLUS_BONUS: 1,
  /** The food-flow ratio at which that bonus applies. */
  PROVISION_SURPLUS_EASE: 1.15,
  /** How long past its duration a plan waits for provision it cannot raise before it
   *  is called off. Without this an unaffordable plan blocks the settlement forever
   *  and the lane looks dead rather than defeated. */
  PATIENCE: 78,
  /** THE COOLDOWNS, and why the completed one is the longest. A settlement that has
   *  just spent a season and its stores on an undertaking does not begin another the
   *  following spring; wave E's own SEED_COOLDOWN of 52 governs the SPONTANEOUS
   *  founding, while this governs the deliberated, provisioned one, which is rarer by
   *  design. This number is also what makes acceptance claim 5 measurable: over two
   *  hundred ticks of oscillating pressure a settlement opens ONE episode. */
  COOLDOWN_COMPLETED: 182,
  COOLDOWN_ABANDONED: 52,
  COOLDOWN_FAILED: 78,
  /** THE RECONSIDERATION THRESHOLD (§5c): a plan is abandoned only when pressure has
   *  fallen this many BANDS below the band that opened it. One rung is drift and a
   *  city does not change its mind over drift; two rungs is a different world. */
  ABANDON_BAND_DROP: 2,
});

const T = PLAN_TUNING;

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** Codepoint comparator (device/locale-stable ordering). @param {string} a @param {string} b */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The plan ledger, or an empty record. @param {Record<string, unknown>|null|undefined} worldState
 *  @returns {Record<string, PlanEntry>} */
export function plansLedgerOf(worldState) {
  const led = getSpatialLedger(
    /** @type {Record<string, unknown>} */ (worldState || {}), DEMOGRAPHIC_PLANS_LEDGER,
  );
  return led && typeof led === 'object' && !Array.isArray(led)
    ? /** @type {Record<string, PlanEntry>} */ (led)
    : {};
}

/** One settlement's active plan, or null. @param {Record<string, unknown>|null|undefined} worldState
 *  @param {string} settlementId @returns {DemographicPlan|null} */
export function activePlanOf(worldState, settlementId) {
  const plan = asObject(plansLedgerOf(worldState)[String(settlementId)]).plan;
  const state = String(asObject(plan).state || '');
  return state === 'proposed' || state === 'underway'
    ? /** @type {DemographicPlan} */ (plan)
    : null;
}

/**
 * IS THIS ROW WORTH KEEPING? Drop-when-empty, so a realm that has never planned
 * anything — or one whose last plan closed long ago and left nothing behind —
 * serializes byte-identically to one where the lane does not exist. A stored band of
 * `easy` is the default reading and is therefore not worth a key.
 * @param {PlanEntry} entry @param {number} tick @returns {boolean}
 */
function entryWorthKeeping(entry, tick) {
  if (entry.plan) return true;
  if (num(entry.cooldownUntil, 0) > tick) return true;
  if (String(entry.band || 'easy') !== 'easy') return true;
  for (const kind of WORKS_KINDS) if (num(asObject(entry.works)[kind], 0) > 0) return true;
  return false;
}

/** The provision one settlement raises per tick. @param {number} prosperity01
 *  @param {number} foodFlowRatio @param {boolean} foodKnown @returns {number} */
export function provisionRateOf(prosperity01, foodFlowRatio, foodKnown) {
  const bands = /** @type {ReadonlyArray<number>} */ (T.PROVISION_BANDS);
  const rung = Math.max(0, Math.min(bands.length - 1, Math.floor(clamp01(prosperity01) * bands.length)));
  const surplus = foodKnown && num(foodFlowRatio, 1) >= T.PROVISION_SURPLUS_EASE ? T.PROVISION_SURPLUS_BONUS : 0;
  return Math.max(1, num(bands[rung], 1) + surplus);
}

/**
 * @typedef {Object} FoundIntent
 * @property {string} parentId
 * @property {string} planId
 * @property {SteadingSite|null} site      the ground the §5b law allowed (null ⇒ aspatial)
 * @property {number} provisionSpent
 * @property {ReadonlyArray<string>} because
 */

/**
 * @typedef {Object} PlanAdvanceResult
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} receipts
 * @property {ReadonlyArray<FoundIntent>} foundIntents  consumed by the ONE founding path
 * @property {{ opened: number, completed: number, failed: number, abandoned: number,
 *   provisionRaised: number, provisionSpent: number, provisionForfeited: number }} accounting
 */

/** The accounting a dormant or still tick reports. */
function stillAccounting() {
  return {
    opened: 0, completed: 0, failed: 0, abandoned: 0,
    provisionRaised: 0, provisionSpent: 0, provisionForfeited: 0,
  };
}

/**
 * ADVANCE THE PLAN LANE ONE TICK.
 *
 * DORMANT (flag absent) ⇒ the SAME worldState reference back, immediately: zero
 * reads, zero keys, zero receipts.
 *
 * @param {Object} args
 * @param {PlanSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState
 * @param {PlanUpdate[]} args.settlementUpdates  READ-ONLY here: the freshest head count
 * @param {number} args.tick
 * @param {Array<Record<string, unknown>>} args.migrationReceipts  P2's OWN answer this tick
 * @param {boolean} args.satelliteLaneLit  is wave E's founding path even present
 * @param {LandDigest|null} [args.digest]  the FROZEN rasters, READ-ONLY
 * @param {Record<string, number>} [args.satelliteCaps]  wave E's per-tier cap table
 * @param {string} [args.realmId]  the campaign's own seed, for the draw keys
 * @returns {PlanAdvanceResult}
 */
export function advanceDemographicPlans({
  snapshot, worldState, settlementUpdates, tick, migrationReceipts,
  satelliteLaneLit, digest, satelliteCaps, realmId,
}) {
  /** @type {PlanAdvanceResult} */
  const inert = {
    worldState, changed: false, receipts: [], foundIntents: Object.freeze([]), accounting: stillAccounting(),
  };
  if (!demographicsActive(worldState)) return inert;

  const items = Array.isArray(asObject(snapshot).settlements)
    ? /** @type {DemoItem[]} */ (asObject(snapshot).settlements)
    : [];
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  /** @type {Map<string, DemoSettlement>} */
  const freshById = new Map();
  for (const u of updates) freshById.set(String(u.saveId), /** @type {DemoSettlement} */ (asObject(u).settlement || {}));
  /** @type {Map<string, DemoItem>} */
  const itemById = new Map(items.map((it) => [String(it.id), it]));
  /** @type {Map<string, string>} */
  const nameById = new Map(items.map((it) => [String(it.id), String(it.name || it.id)]));
  /** Every settlement's grade, for the §5b tier-pair band. @param {string} id */
  const tierOf = (id) => {
    const s = asObject(freshById.get(String(id)) || asObject(itemById.get(String(id))).settlement);
    return String(s.tier || asObject(s.config).tier || 'village');
  };

  // P2'S OWN ANSWER, indexed by origin. A settlement with no migration receipt this
  // tick raised no column at all, which reads as "nothing was placed and nothing was
  // left over" rather than as a founding licence.
  /** @type {Map<string, { placed: number, unplaced: number, considered: number }>} */
  const homeostatByOrigin = new Map();
  for (const receipt of (Array.isArray(migrationReceipts) ? migrationReceipts : [])) {
    if (String(asObject(receipt).kind) !== 'demographic_migration') continue;
    const originId = String(asObject(receipt).originId || '');
    if (!originId) continue;
    homeostatByOrigin.set(originId, {
      placed: Math.max(0, num(asObject(receipt).departures, 0)),
      unplaced: Math.max(0, num(asObject(receipt).unplaced, 0)),
      considered: Math.max(0, num(asObject(receipt).considered, 0)),
    });
  }

  const prior = plansLedgerOf(worldState);
  /** @type {Record<string, PlanEntry>} */
  const next = {};
  for (const id of Object.keys(prior).sort(codepoint)) {
    const row = asObject(prior[id]);
    next[id] = /** @type {PlanEntry} */ ({
      ...row,
      ...(row.works ? { works: { ...asObject(row.works) } } : {}),
      ...(row.plan ? { plan: { ...asObject(row.plan) } } : {}),
    });
  }
  let ledgerChanged = false;

  const stepTick = Math.max(0, Math.round(num(tick, 0)));
  const realm = String(realmId || asObject(worldState).rngSeed || 'realm');
  /** @type {Array<Record<string, unknown>>} */
  const receipts = [];
  /** @type {Array<FoundIntent>} */
  const foundIntents = [];
  const accounting = stillAccounting();

  for (const settlementId of items.map((it) => String(it.id)).sort(codepoint)) {
    const settlement = freshById.get(settlementId);
    if (!settlement) continue;                              // the apply pass cannot write it
    const raw = asObject(settlement);
    if (raw.lifecycleStatus || asObject(raw.config).lifecycleStatus) continue;  // a remnant plans nothing
    const population = Math.max(0, Math.round(num(settlement.population, 0)));
    if (population <= 0) continue;

    const entry = /** @type {PlanEntry} */ (next[settlementId] || {});
    const item = itemById.get(settlementId) || null;
    const name = nameById.get(settlementId) || settlementId;
    const readings = demographicReadings(settlement, worldState, settlementId);
    const bound = effectiveBoundOf(
      foodCapacityOf(settlement, worldState, settlementId),
      densityCeilingOf(settlement, worldState, settlementId),
    );
    const pressure01 = pressureOf(population, bound.bound);
    const band = overflowBandOf(pressure01);
    const storedBand = String(entry.band || 'easy');
    const tier = tierOf(settlementId);
    const prosperity01 = prosperity01Of(item);

    /** @param {Partial<PlanEntry>} patch */
    const write = (patch) => {
      next[settlementId] = /** @type {PlanEntry} */ ({ ...(next[settlementId] || {}), ...patch });
      ledgerChanged = true;
    };
    /** @param {string} kind @param {Record<string, unknown>} body */
    const receipt = (kind, body) => {
      receipts.push({
        id: `demographics.plan.${settlementId}.${stepTick}.${kind}`,
        kind, tick: stepTick, settlementId, band, pressure01: Math.round(pressure01 * 10000) / 10000,
        ...body,
      });
    };

    // ── THE GROUND, RE-ASKED THIS ATTEMPT (J-P7: never a stored census) ──
    const cap = num(asObject(satelliteCaps)[tier], 0);
    const ground = legalFoundingSites({
      digest: digest || null,
      worldState,
      parentId: settlementId,
      newTier: 'thorp',                                    // wave E founds thorps and only thorps
      tierOf,
      prefer: seamLandforms(null),
    });

    const plan = /** @type {DemographicPlan|undefined} */ (entry.plan);
    const active = plan && (plan.state === 'proposed' || plan.state === 'underway') ? plan : null;

    // ══════════════════════════════════════════════════════════════════════
    // AN ACTIVE PLAN: hold it, work it, or close it. NO DRAW IS TAKEN HERE.
    // ══════════════════════════════════════════════════════════════════════
    if (active) {
      // THE ACCRUAL HAPPENS FIRST, on EVERY path out of this block. It used to sit
      // beside the progress step, below the two closing branches, and a plan that
      // closed on the tick it accrued then reported the PRE-accrual figure — the
      // conservation pin caught it as an exact six-unit shortfall between what the
      // lane said it raised and what its receipts accounted for. Raising here means
      // one arithmetic for all five exits.
      const raised = provisionRateOf(prosperity01, readings.foodFlowRatio, readings.foodKnown);
      const provision = Math.max(0, num(active.provision, 0)) + raised;
      accounting.provisionRaised += raised;

      /** @param {string} outcome @param {string} state @param {number} cooldown @param {string} line */
      const close = (outcome, state, cooldown, line) => {
        const forfeited = state === 'completed' ? 0 : Math.max(0, provision);
        const spent = state === 'completed' ? Math.max(0, num(active.startupCost, 0)) : 0;
        accounting.provisionSpent += spent;
        accounting.provisionForfeited += forfeited;
        if (state === 'completed') accounting.completed += 1;
        else if (state === 'failed') accounting.failed += 1;
        else accounting.abandoned += 1;
        // ASSIGNED, NOT PATCHED. `write` merges a patch OVER the existing row, and a
        // merge cannot express a REMOVAL: patching `{...rowWithoutPlan}` leaves the
        // base row's own `plan` key untouched, so the plan closes again every tick
        // forever. Measured on a 120-tick smoke before this line existed: one opening
        // at tick 1 and ninety-four identical closures from tick 27 onward.
        const closed = /** @type {PlanEntry} */ ({ ...(next[settlementId] || {}) });
        delete closed.plan;
        closed.cooldownUntil = stepTick + cooldown;
        closed.band = band;
        next[settlementId] = closed;
        ledgerChanged = true;
        receipt('demographic_plan_closed', {
          planId: active.id, response: active.response, state, outcome,
          episode: active.episode, provisionRaised: provision,
          provisionSpent: spent, provisionForfeited: forfeited,
          openedTick: active.openedTick, line,
        });
      };

      // (a) RECONSIDERATION — a band-crossing MAGNITUDE, never drift (§5c).
      const dropped = overflowRankOf(active.band) - overflowRankOf(band);
      if (dropped >= T.ABANDON_BAND_DROP) {
        close('pressure_eased', 'abandoned', T.COOLDOWN_ABANDONED,
          `${name} let the plan go: the pressure that raised it has passed.`);
        continue;
      }
      // (b) FAILURE CONDITIONS — the response became impossible while it was underway.
      if (active.response === 'satellite' && !satelliteLaneLit) {
        close('lane_dark', 'failed', T.COOLDOWN_FAILED, `${name} could send nobody out after all.`);
        continue;
      }
      if (active.response === 'satellite' && ground.applicable && ground.saturated) {
        close('ground_lost', 'failed', T.COOLDOWN_FAILED,
          `${name} found the ground it had chosen already taken.`);
        continue;
      }
      // EARNED ASCENSION CAN BE UN-EARNED WHILE THE WORK IS UNDER WAY (J-P4). A town
      // that commits to becoming a city and then loses the food base that would feed one
      // must stop, because the promotion window is a REQUIREMENT and not a formality;
      // finishing anyway would land it above a granary that cannot hold it. Without this
      // arm the outcome vocabulary carries a word nothing can ever emit, which is the
      // unreachable-predicate shape this tree has been bitten by before.
      if (active.response === 'promotion' && !nextTierHeadroom(readings, tier)) {
        close('headroom_lost', 'failed', T.COOLDOWN_FAILED,
          `${name} can no longer feed the greater place it meant to become.`);
        continue;
      }
      // (c) PROGRESS. The provision was raised at the top of this block.
      const state = 'underway';
      const progress = Math.max(0, num(active.progress, 0)) + 1;
      const duration = Math.max(0, num(active.duration, 0));
      const cost = Math.max(0, num(active.startupCost, 0));
      if (progress >= duration && provision >= cost) {
        // ── COMPLETED. The effect lands here, and it never mints a person. ──
        const worked = { ...asObject(asObject(next[settlementId]).works) };
        if (WORKS_KINDS.includes(active.response)) {
          worked[active.response] = Math.min(
            WORKS_TUNING.WORKS_CAP, num(worked[active.response], 0) + 1,
          );
          write({ works: /** @type {Record<string, number>} */ (worked) });
        }
        if (active.response === 'satellite') {
          foundIntents.push({
            parentId: settlementId,
            planId: active.id,
            site: active.site || null,
            provisionSpent: cost,
            because: Object.freeze([...(Array.isArray(active.because) ? active.because : [])]),
          });
        }
        close('delivered', 'completed', T.COOLDOWN_COMPLETED,
          `${responseLine(active.response, name)} It is done.`);
        continue;
      }
      if (progress > duration + T.PATIENCE) {
        close('unaffordable', 'failed', T.COOLDOWN_FAILED,
          `${name} could never raise what the undertaking needed.`);
        continue;
      }
      write({
        band,
        plan: /** @type {DemographicPlan} */ ({
          ...active,
          state,
          provision,
          progress,
          ...(active.state === 'proposed' ? { underwayTick: stepTick } : {}),
        }),
      });
      continue;
    }

    // ══════════════════════════════════════════════════════════════════════
    // NO ACTIVE PLAN: may an episode open? Three gates, and all three must pass.
    // ══════════════════════════════════════════════════════════════════════
    const cooled = stepTick >= num(entry.cooldownUntil, 0);
    // THE CROSSING, NOT THE LEVEL (§5c). A settlement that merely SITS in a demanding
    // band draws nothing: it drew when it arrived there, and the cooldown is what lets
    // it try again. A settlement whose cooldown has just expired while it is still in
    // a demanding band counts the expiry as its crossing, so a lasting crisis is not
    // silently forgiven for want of a fresh threshold to cross.
    const crossed = band !== storedBand || (cooled && num(entry.cooldownUntil, 0) > 0);
    if (band !== storedBand) { write({ band }); }
    if (!cooled || !crossed || !bandDemandsResponse(band)) {
      if (!entryWorthKeeping(/** @type {PlanEntry} */ (next[settlementId] || {}), stepTick)) {
        if (next[settlementId]) { delete next[settlementId]; ledgerChanged = true; }
      }
      continue;
    }

    const episode = `${stepTick}:${band}`;
    const scored = scoreResponses({
      readings,
      pressure01,
      tier,
      prosperity01,
      connectivity01: connectivity01Of(item),
      homeostat: homeostatByOrigin.get(settlementId) || { placed: 0, unplaced: 0, considered: 0 },
      ground: { applicable: ground.applicable, saturated: ground.saturated, sites: ground.sites.length },
      satelliteLaneLit,
      satelliteCap: cap,
    });
    const choice = selectResponse({ scored, realmId: realm, settlementId, episode });
    if (!choice.response) continue;

    // `send` is finished the moment it is chosen: the homeostat ALREADY moved those
    // people this tick, so a persisted plan for it would be a commitment to something
    // that has happened. It closes the episode with a receipt and a cooldown.
    if (choice.response === 'send') {
      write({ band, cooldownUntil: stepTick + T.COOLDOWN_COMPLETED });
      receipt('demographic_plan_closed', {
        planId: `plan.${settlementId}.${stepTick}`, response: 'send', state: 'completed',
        outcome: 'delivered', episode, provisionRaised: 0, provisionSpent: 0, provisionForfeited: 0,
        openedTick: stepTick, line: responseLine('send', name),
        // THE MENU TRAVELS WITH THE SAME-TICK CLOSURE TOO. An episode that resolves by
        // sending people is still an episode, and "the realm absorbed them, so the
        // frontier was never on the table" is exactly the sentence a reader needs; a
        // receipt that carried it only when a plan PERSISTED would go silent in the one
        // case acceptance claim 6 is about.
        considered: choice.scored.filter((s) => s.available).map((s) => s.response),
        refused: choice.scored.filter((s) => !s.available).map((s) => `${s.response}:${s.refusal}`),
        because: [...choice.because],
      });
      accounting.completed += 1;
      continue;
    }

    // THE SITE IS CHOSEN AT PROPOSAL, not at completion: a city that commits to
    // founding a steading commits to a PLACE, and re-picking the ground on the last
    // day would be the reroll §5c forbids wearing a plan's clothes.
    /** @type {SteadingSite|null} */
    let site = null;
    if (choice.response === 'satellite' && ground.applicable) {
      site = chooseLegalSite({
        sites: ground.sites,
        suitability: LANDFORM_SUITABILITY,
        roll: hash01(`demographics.plan.${realm}.${settlementId}.${episode}.site`),
      });
      if (!site) continue;                                 // the law allowed nothing after all
    }

    const response = choice.response;
    /** @type {DemographicPlan} */
    const opened = {
      id: `plan.${settlementId}.${stepTick}`,
      response,
      state: 'proposed',
      episode,
      band,
      openedTick: stepTick,
      startupCost: num(asObject(T.STARTUP)[response], 0),
      provision: 0,
      duration: num(asObject(T.DURATIONS)[response], 0),
      progress: 0,
      weight: choice.weight,
      because: [...choice.because],
      ...(site ? { site } : {}),
    };
    write({ band, plan: opened });
    accounting.opened += 1;
    receipt('demographic_plan_opened', {
      planId: opened.id, response, episode, weight: choice.weight, because: opened.because,
      startupCost: opened.startupCost, duration: opened.duration,
      considered: scored.filter((s) => s.available).map((s) => s.response),
      refused: scored.filter((s) => !s.available).map((s) => `${s.response}:${s.refusal}`),
      saturated: ground.applicable && ground.saturated,
      land: landLine(ground, name),
      line: `${responseLine(response, name)} ${because(choice.because)}`,
    });
  }

  // Conditional and drop-when-empty: the last row to close takes the key with it.
  let nextWorldState = worldState;
  if (ledgerChanged) {
    for (const id of Object.keys(next)) {
      if (!entryWorthKeeping(/** @type {PlanEntry} */ (next[id]), stepTick)) delete next[id];
    }
    const keys = Object.keys(next).length;
    nextWorldState = keys > 0
      ? setSpatialLedger(worldState, DEMOGRAPHIC_PLANS_LEDGER, next)
      : (Object.keys(prior).length > 0 ? dropSpatialLedger(worldState, DEMOGRAPHIC_PLANS_LEDGER) : worldState);
  }

  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    receipts,
    foundIntents: Object.freeze(foundIntents),
    accounting,
  };
}

/** The reasons, as a sentence a person reads (the legibility law).
 *  @param {ReadonlyArray<string>} reasons @returns {string} */
function because(reasons) {
  const words = (Array.isArray(reasons) ? reasons : []).slice(0, 2).map((r) => String(r).replace(/_/g, ' '));
  return words.length ? `The reasons given are ${words.join(' and ')}.` : '';
}

/**
 * THE PLAN'S OWN LINE for a dossier or a Herald reader (P4 consumes this; P3 authors
 * it honestly now so nothing downstream re-derives it).
 * @param {DemographicPlan|null} plan @param {string} name @returns {string}
 */
export function planLine(plan, name) {
  if (!plan) return `${name} has nothing in hand.`;
  const share = plan.duration > 0
    ? Math.min(100, Math.round((num(plan.progress, 0) / plan.duration) * 100))
    : 100;
  const raised = Math.min(100, plan.startupCost > 0
    ? Math.round((num(plan.provision, 0) / plan.startupCost) * 100) : 100);
  return `${responseLine(plan.response, name)} The work stands at ${share} percent `
    + `and ${formatCount(num(plan.provision, 0))} of the stores it needs are raised `
    + `(${raised} percent).`;
}

/** Every overflow band, exported so a pin reads the live vocabulary rather than
 *  restating it. @type {ReadonlyArray<string>} */
export const PLAN_OVERFLOW_BANDS = OVERFLOW_BANDS;

/**
 * domain/worldPulse/magicSubstitutionReagents.js — W-K slice K4: REAGENT SUPPLY
 * CHAINS (binding law docs/DESIGN_MAGIC_ECONOMY.md §7, with §3c's TWO-TIMESCALE LAW
 * and §1 law 1, NO EXEMPTION).
 *
 * §7's claim is that one decision buys everything: denominate magic's hunger in the
 * goods catalog, let magic institutions generate corridor demand in W-J's flow
 * ledger, and anti-magic siegecraft becomes economic warfare BY CONSTRUCTION. This
 * file is that decision executed, and the measure of whether it was executed
 * honestly is how little new machinery it contains.
 *
 * ── NOTHING NEW WAS INVENTED, AND THAT IS THE FEATURE ───────────────────────
 * The reagent good already exists (goodsCatalog `arcane_reagents`, with
 * 'alchemical reagents' and 'magical components' already aliased onto it). The
 * reagent chains already exist (supplyChainData's arcane_magical group, one of them
 * literally titled 'Alchemy and Reagents'). The corridor is already a thing a want
 * earns (routeNetworkFlows' `unmet_import`). The impairment mark already exists
 * (entities/status.js `supply_starved`, which supplyShipments stamps when a link
 * runs dry). The status verdict already reads that mark (institutionStatusLifecycle's
 * `supply_shortage` cause signal). So K4 adds a SPINE that names which chains are
 * magic's material dependency, and then routes magic's hunger through machinery the
 * estate already trusts.
 *
 * IN PARTICULAR, `ROUTE_FLOW_SOURCES` IS NOT WIDENED. Reagent hunger accrues under
 * the existing `unmet_import` source, because that is precisely what it is: a
 * settlement declares it needs a good, an admissible partner makes it, and no road
 * brings it. Minting a `reagent_demand` source would have forked the attribution
 * table that J2 calls the single writer of attribution in the estate, in exchange for
 * a distinction the goods id already carries. The good travels on the traversal
 * (`reasonGoods`), so a receipt still says the corridor is about reagents.
 *
 * ── THE TWO-TIMESCALE LAW, END TO END (§7, §3c) ─────────────────────────────
 * "Interdiction of a reagent route IMPAIRS (fast) before economic failure SHELLS
 * (slow)." Both halves are honoured, and the second one by NOT doing it here:
 *
 *   FAST — `reagentInterdictionMarks` stamps a `supply_starved` impairment on the
 *   magic institutions of a settlement whose reagent link has run dry. K1 reads that
 *   mark on the very next advance and grades the house `impaired`, with the cure
 *   already written ("the road reopens or the stores refill"). One tick.
 *
 *   SLOW — nothing in this file closes anything. A SHELL is an economic verdict, it
 *   is minted by institutionLifecycle's multi-tick decline streak and by K2's regime
 *   demotion, and a reagent cut reaches it only through the long way round: less
 *   substitution, worse food, worse prosperity, eventually a demotion. Writing a
 *   fast-path shell here would have collapsed the two timescales into one and made
 *   the design's central distinction unobservable.
 *
 * ── DORMANCY (law 8, §10) ───────────────────────────────────────────────────
 * Every entry point returns its INPUT BY REFERENCE when the flag is absent, the way
 * `accrueRouteFlows` and `applyInstitutionStatus` already do, so the dormancy pin
 * asserts object identity rather than a deep equality that could pass on a copy.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no mutation, no store. Every
 * ledger is walked in codepoint-sorted key order.
 *
 * @enforced-by tests/domain/magicSubstitutionReagents.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import { REAGENT_CHAIN_SPINE, REAGENT_STAPLE_LABEL } from '../../data/supplyChainResourceIndex.js';
import { normalizeGood } from '../region/goodsCatalog.js';
import { canonExports, canonImports } from '../canonicalAccessors.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { mkImpairment, withImpairment } from '../entities/status.js';
import { SUPPLY_STARVED_IMPAIRMENT } from '../spatial/supplyShipments.js';
import { magicEconomyActive } from './institutionStatusModel.js';
import { practitionerRungWeight } from './magicSubstitution.js';
import {
  admissibleCorridors,
  edgeIdForPair,
  withFlowStep,
} from './routeNetworkFlows.js';
import {
  corridorDemand,
  corridorId,
  emptyRouteNetwork,
  readRouteNetwork,
  routeLifecycleActive,
  withCorridors,
  withEdgeUsage,
  writeRouteNetwork,
} from './routeNetworkLedger.js';

/**
 * The J2 source every reagent traversal accrues under. Named as a constant rather
 * than inlined so the deliberate REUSE of an existing source (see the header) is a
 * thing a source scan can find, instead of a string that reads like a coincidence.
 * @type {string}
 */
export const REAGENT_FLOW_SOURCE = 'unmet_import';

/**
 * REAGENT_TUNING (§11: "reagent demand scales"). PROPOSED, soak-vetoable, R-15 shape.
 *
 * SUPPLY_FACTOR is the material factor K4's substitution channel multiplies its cap
 * band by, one rung per posture a settlement can be in about its reagents. The rungs
 * are ordered and the STARVED rung is exactly zero, which is what makes the
 * interdiction bite rather than merely inconvenience: a cut reagent road ends the
 * substitution channel, and the food deficit reappears through the conservation
 * identity in magicSubstitution.js.
 *
 * `unknown` is the honest rung and it is deliberately low rather than absent. A magic
 * house with no declared import, no local production and no shipment record is buying
 * at market in a way the estate does not model; pretending that is full supply would
 * let an unmodelled world substitute at the ceiling, and pretending it is zero would
 * make the whole channel unreachable outside a fully wired trade graph.
 *
 * DEMAND_SCALE_BY_REGIME is §7's "scaled by regime". It multiplies the spine's own
 * per-chain demandWeight, so an industrial foundry presses on its corridors harder
 * than a patronised circle does, and a subsistence settlement presses not at all.
 * @type {Readonly<Record<string, unknown>>}
 */
export const REAGENT_TUNING = Object.freeze({
  SUPPLY_FACTOR: Object.freeze({
    starved: 0,
    unknown: 0.25,
    declared: 0.5,
    supplied: 0.85,
    local: 1,
  }),
  DEMAND_SCALE_BY_REGIME: Object.freeze({
    subsistence: 0,
    funded: 1,
    patronized: 2,
    industrial: 3,
  }),
  // The severity a reagent cut stamps. Deliberately the SAME number K1 already grades
  // `supply_shortage` at (INSTITUTION_STATUS_TUNING.defaultSeverity.supply_shortage =
  // 0.6, itself borrowed from supplyKernel's SUPPLY_STARVED stamp), because a magic
  // house starved of reagents is not a special case of starvation, and inventing a
  // second number here would have been the first exemption.
  INTERDICTION_SEVERITY: 0.6,
  // Bound on how many corridors one settlement's reagent hunger may press in a single
  // pulse. The admissible-partner set is already linear, so this is not the
  // anti-quadratic guard; it is a fairness guard, so one magical metropolis cannot
  // spend the whole pulse's corridor attention on itself.
  MAX_PARTNERS_PER_SETTLEMENT: 4,
});

/**
 * The closed posture vocabulary (law 7): what a settlement's relationship to its
 * reagent supply currently is. Ordered best to worst for readability; the factor
 * table above is total over it.
 * @type {ReadonlyArray<string>}
 */
export const REAGENT_POSTURES = Object.freeze([
  'local', 'supplied', 'declared', 'unknown', 'starved',
]);

/** @param {unknown} value @returns {Record<string, unknown>} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {}
);

/** @param {unknown} value @returns {ReadonlyArray<unknown>} */
const asArray = (value) => (Array.isArray(value) ? value : []);

/** @param {unknown} value @returns {string} */
const asId = (value) => (value == null ? '' : String(value));

/** @param {unknown} value @param {number} fallback @returns {number} */
const num = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

/**
 * The goods-catalog id a spine label denominates. Memo-free and total: the catalog
 * owns the mapping, and an unrecognised label answers its own `custom.` id rather
 * than null, which keeps a DM's own reagent a real want.
 * @param {string} label
 * @returns {string}
 */
export function reagentGoodId(label) {
  const good = normalizeGood(/** @type {never} */ (label));
  return good && good.id ? String(good.id) : '';
}

/**
 * THE STAPLE ID: what an interdiction denies when it wants to reach the magic
 * economy rather than one workshop (§7's "the buffer draws down reagent stocks BY
 * NAME"). Derived through the catalog, never hard-coded, so a catalog rename moves it.
 * @returns {string}
 */
export function reagentStapleGoodId() {
  return reagentGoodId(REAGENT_STAPLE_LABEL);
}

/**
 * The spine rungs a settlement is actually running, by full `${needKey}.${chainId}`
 * id. Reads `economicState.activeChains`, which is the engine's own stamp of which
 * chains are live, so K4 cannot credit a chain the economy does not think is running.
 *
 * @param {{ economicState?: unknown }|null|undefined} settlement
 * @returns {ReadonlyArray<string>} codepoint sorted
 */
export function spineChainsOf(settlement) {
  /** @type {Set<string>} */
  const out = new Set();
  for (const raw of asArray(asRecord(asRecord(settlement).economicState).activeChains)) {
    const chain = asRecord(raw);
    const id = `${asId(chain.needKey)}.${asId(chain.chainId)}`;
    if (Object.prototype.hasOwnProperty.call(REAGENT_CHAIN_SPINE, id)) out.add(id);
  }
  return Object.freeze([...out].sort());
}

/**
 * Every reagent good this settlement hungers for, with the integer weight of that
 * hunger (§7: demand "scaled by regime", where the per-chain half lives in the spine
 * and the regime half in REAGENT_TUNING).
 *
 * A settlement with LIVE MAGIC INSTITUTIONS but no stamped arcane chain still hungers,
 * at the staple, at weight 1. That is not a widening: substitution itself spends
 * reagents (§6 says so in as many words), so a guild that feeds a city while the
 * economy model has not stamped it a chain is still buying components, and pretending
 * otherwise would let the most magical settlements press zero corridor demand.
 *
 * @param {{ economicState?: unknown, institutions?: unknown }|null|undefined} settlement
 * @returns {Map<string, number>} goods id to weight, insertion order irrelevant
 */
export function reagentHungerOf(settlement) {
  /** @type {Map<string, number>} */
  const hunger = new Map();
  /** @param {string} goodId @param {number} weight */
  const press = (goodId, weight) => {
    if (!goodId || weight <= 0) return;
    hunger.set(goodId, Math.max(hunger.get(goodId) || 0, weight));
  };
  for (const chainKey of spineChainsOf(settlement)) {
    const rung = REAGENT_CHAIN_SPINE[chainKey];
    for (const label of rung.consumes) press(reagentGoodId(label), num(rung.demandWeight, 1));
  }
  if (hunger.size === 0) {
    const hasPractitioner = liveInstitutions(settlement)
      .some((inst) => practitionerRungWeight(inst) > 0);
    if (hasPractitioner) press(reagentStapleGoodId(), 1);
  }
  return hunger;
}

/**
 * The reagent goods a settlement PRODUCES, read through the canonical exports
 * accessor and the catalog, so a settlement that makes its own components is not
 * counted as dependent on anybody.
 * @param {Record<string, unknown>|null|undefined} settlement
 * @returns {Set<string>}
 */
export function reagentExportsOf(settlement) {
  /** @type {Set<string>} */
  const out = new Set();
  for (const raw of asArray(canonExports(/** @type {never} */ (settlement)))) {
    const id = reagentGoodId(/** @type {never} */ (raw));
    if (id) out.add(id);
  }
  return out;
}

/**
 * THE REAGENT POSTURE of one settlement: which rung of REAGENT_POSTURES it sits on,
 * and therefore what its substitution channel is allowed to be multiplied by.
 *
 * Resolution order is worst-first on purpose. A STARVED link outranks a local
 * export, because a settlement whose reagent link has visibly run dry is in trouble
 * whatever else its ledger claims, and the alternative ordering would let a nominal
 * export line hide a live interdiction from the food model.
 *
 * @param {{
 *   settlement: Record<string, unknown>|null|undefined,
 *   worldState: Record<string, unknown>|null|undefined,
 *   cid: string|number,
 * }} input
 * @returns {{ posture: string, supply01: number, hunger: ReadonlyArray<string>, starvedGoods: ReadonlyArray<string> }}
 */
export function reagentPosture(input) {
  const settlement = input.settlement || {};
  const cid = String(input.cid);
  const hunger = reagentHungerOf(settlement);
  const hungerIds = Object.freeze([...hunger.keys()].sort());
  const factors = /** @type {Record<string, number>} */ (REAGENT_TUNING.SUPPLY_FACTOR);
  if (hungerIds.length === 0) {
    return { posture: 'unknown', supply01: 0, hunger: hungerIds, starvedGoods: Object.freeze([]) };
  }

  const shipments = asRecord(asRecord(asRecord(input.worldState).spatialLedgers).supplyShipments);
  /** @type {Set<string>} */
  const starved = new Set();
  let liveInbound = false;
  for (const key of Object.keys(shipments).sort()) {
    const record = asRecord(shipments[key]);
    if (asId(record.settlementId) !== cid) continue;
    const good = normalizeGood(/** @type {never} */ (record.input));
    const goodId = good && good.id ? String(good.id) : '';
    if (!goodId || !hunger.has(goodId)) continue;
    if (record.starving === true) { starved.add(goodId); continue; }
    if (asId(record.sourceId)) liveInbound = true;
  }
  if (starved.size > 0) {
    return {
      posture: 'starved',
      supply01: factors.starved,
      hunger: hungerIds,
      starvedGoods: Object.freeze([...starved].sort()),
    };
  }

  const made = reagentExportsOf(settlement);
  if (hungerIds.some((goodId) => made.has(goodId))) {
    return { posture: 'local', supply01: factors.local, hunger: hungerIds, starvedGoods: Object.freeze([]) };
  }
  if (liveInbound) {
    return { posture: 'supplied', supply01: factors.supplied, hunger: hungerIds, starvedGoods: Object.freeze([]) };
  }

  // The canonical imports accessor, not a hand-rolled primaryImports/imports
  // fallback: that fallback has exactly one correct spelling and canonicalAccessors
  // owns it.
  const declared = asArray(canonImports(/** @type {never} */ (settlement)))
    .map((entry) => reagentGoodId(/** @type {never} */ (entry)));
  if (declared.some((goodId) => hunger.has(goodId))) {
    return { posture: 'declared', supply01: factors.declared, hunger: hungerIds, starvedGoods: Object.freeze([]) };
  }
  return { posture: 'unknown', supply01: factors.unknown, hunger: hungerIds, starvedGoods: Object.freeze([]) };
}

/**
 * THE INTERDICTION MARK (§7's fast half; §3c's cause vocabulary).
 *
 * Returns the settlement with a `supply_starved` impairment stamped on every LIVE
 * magic institution, or the INPUT BY REFERENCE when the reagent supply is not cut.
 * K1 needs nothing else: `INSTITUTION_CAUSE_SIGNAL.supply_shortage` already reads
 * this exact impairment type, so the very next advance grades the house `impaired`
 * with the cure attached, and lifts it automatically when the link refills, because
 * presence is re-derived rather than persisted.
 *
 * THE MARK USES THE ESTATE'S OWN FACTORY (`mkImpairment` / `withImpairment`), which
 * is why the institution's own `status` recomputes through `effectiveStatus` on the
 * way out and why re-stamping the same cause is idempotent rather than additive.
 * A hand-rolled impairments push would have skipped both.
 *
 * `causeRef` is a caller-supplied deterministic id, never a clock and never an rng.
 *
 * @param {{
 *   settlement: Record<string, unknown>|null|undefined,
 *   worldState: Record<string, unknown>|null|undefined,
 *   cid: string|number,
 *   causeRef?: string,
 * }} input
 * @returns {{ settlement: Record<string, unknown>, changed: boolean, marked: ReadonlyArray<string>, starvedGoods: ReadonlyArray<string> }}
 */
export function reagentInterdictionMarks(input) {
  const settlement = /** @type {Record<string, unknown>} */ (input.settlement || {});
  const inert = { settlement, changed: false, marked: Object.freeze([]), starvedGoods: Object.freeze([]) };
  if (!magicEconomyActive(input.worldState)) return inert;

  const posture = reagentPosture({ settlement, worldState: input.worldState, cid: input.cid });
  if (posture.posture !== 'starved') return inert;

  const causeRef = String(input.causeRef || `reagent:${String(input.cid)}`);
  const live = new Set(liveInstitutions(settlement)
    .filter((inst) => practitionerRungWeight(inst) > 0));
  if (live.size === 0) return inert;

  /** @type {Array<string>} */
  const marked = [];
  const roster = asArray(settlement.institutions).map((raw) => {
    const inst = /** @type {Record<string, unknown>} */ (raw);
    if (!live.has(inst)) return inst;
    marked.push(String(inst.name == null ? '' : inst.name));
    return withImpairment(/** @type {never} */ (inst), /** @type {never} */ (mkImpairment(
      SUPPLY_STARVED_IMPAIRMENT,
      num(REAGENT_TUNING.INTERDICTION_SEVERITY, 0.6),
      causeRef,
      'The reagent road is cut and the benches are running dry.',
    )));
  });

  return {
    settlement: { ...settlement, institutions: roster },
    changed: true,
    marked: Object.freeze(marked.sort()),
    starvedGoods: posture.starvedGoods,
  };
}

/**
 * @typedef {Object} ReagentFlowResult
 * @property {Record<string, unknown>} worldState  the world with the demand folded on
 * @property {boolean} changed
 * @property {number} traversals   how many wants this pass offered
 * @property {number} accrued      how many landed on an admissible pair
 * @property {number} offNetwork   how many the bounded-candidate law refused
 * @property {number} corridorsTouched
 * @property {number} edgesTouched
 */

/**
 * ACCRUE ONE PULSE OF REAGENT CORRIDOR DEMAND (§7: "magic institutions generate
 * corridor demand in W-J's flow ledger, scaled by regime").
 *
 * Written as a SECOND ACCRUAL PASS over J2's own published accessors rather than as
 * an edit to J2. That composes correctly and it is not a coincidence that it does:
 * J2's accrual seeds each corridor from the PRIOR PERSISTED RECORD, so two passes in
 * either order add rather than overwrite, and `withFlowStep` is the one accrual
 * writer either of them may use. The alternative, threading a reagent extractor into
 * `goodsTraversals`, would have put a magic-economy read inside a route-lifecycle leaf
 * and coupled two slices' flags in one function.
 *
 * BOUNDED BY THE SAME LAW J2 IS BOUNDED BY: only admissible pairs (the genesis
 * candidate set unioned with the existing edges) may be written, and an inadmissible
 * want is counted into `offNetwork` rather than silently dropped or silently minted.
 * A reagent corridor therefore cannot be the thing that reintroduces the quadratic.
 *
 * DOUBLY DORMANT, on purpose: the pass is inert unless BOTH the magic economy and the
 * route lifecycle are lit, because demand written into a ledger the world does not
 * have is not demand, it is a stray key.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   members: ReadonlyArray<{ id: string, config: Record<string, unknown>, settlement: Record<string, unknown> }>,
 *   regimeOf?: (cid: string) => (string|null),
 *   tick?: number,
 * }} input
 * @returns {ReagentFlowResult}
 */
export function accrueReagentDemand(input) {
  const worldState = input.worldState;
  /** @type {ReagentFlowResult} */
  const inert = {
    worldState,
    changed: false,
    traversals: 0,
    accrued: 0,
    offNetwork: 0,
    corridorsTouched: 0,
    edgesTouched: 0,
  };
  if (!magicEconomyActive(worldState) || !routeLifecycleActive(worldState)) return inert;

  const members = Array.isArray(input.members) ? input.members : [];
  if (members.length === 0) return inert;
  const tick = num(input.tick, 0);
  const network = readRouteNetwork(worldState) || emptyRouteNetwork();
  const admissible = admissibleCorridors({ members, worldState, network });
  const scales = /** @type {Record<string, number>} */ (REAGENT_TUNING.DEMAND_SCALE_BY_REGIME);
  const regimeOf = typeof input.regimeOf === 'function' ? input.regimeOf : () => null;

  // Who makes what, over the same membership. Built once, from the catalog, so the
  // supplier question is answered exactly the way J2's material index answers it.
  /** @type {Map<string, Set<string>>} */
  const makers = new Map();
  for (const member of members) {
    makers.set(String(member.id), reagentExportsOf(member.settlement));
  }

  /** @type {Array<{ a: string, b: string, weight: number, good: string }>} */
  const traversals = [];
  for (const member of [...members].sort((x, y) => (String(x.id) < String(y.id) ? -1 : 1))) {
    const cid = String(member.id);
    const scale = num(scales[String(regimeOf(cid) || '')], 0);
    if (scale <= 0) continue;
    const hunger = reagentHungerOf(member.settlement);
    if (hunger.size === 0) continue;
    const partners = [...(admissible.partnersOf.get(cid) || new Set())].sort()
      .slice(0, Math.max(0, num(REAGENT_TUNING.MAX_PARTNERS_PER_SETTLEMENT, 0)));
    for (const partnerId of partners) {
      const supplied = makers.get(partnerId);
      if (!supplied || supplied.size === 0) continue;
      for (const goodId of [...hunger.keys()].sort()) {
        if (!supplied.has(goodId)) continue;
        traversals.push({
          a: cid, b: partnerId, good: goodId,
          weight: Math.max(1, Math.round(num(hunger.get(goodId), 1) * scale)),
        });
      }
    }
  }
  if (traversals.length === 0) return inert;

  /** @type {Record<string, unknown>} */
  const nextCorridors = {};
  /** @type {Record<string, unknown>} */
  const nextUsage = {};
  let accrued = 0;
  let offNetwork = 0;

  const ordered = [...traversals].sort((x, y) => {
    const left = `${x.a}|${x.b}|${x.good}`;
    const right = `${y.a}|${y.b}|${y.good}`;
    return left < right ? -1 : left > right ? 1 : 0;
  });

  for (const traversal of ordered) {
    const id = corridorId(traversal.a, traversal.b);
    if (!admissible.pairs.has(id)) { offNetwork += 1; continue; }
    const edgeId = edgeIdForPair(network, traversal.a, traversal.b);
    if (edgeId) {
      // Rebuilt field by field rather than spread, because the persisted usage
      // record arrives typed as unknown and a blanket spread would be the estate's
      // any-cast in a different hat. The three accrual maps are exactly what
      // withFlowStep reads; reasonGoods rides along only when it was there, which is
      // the same drop-when-empty shape J2 writes.
      const priorUsage = asRecord(asRecord(asRecord(network.edges)[edgeId]).usage);
      const prior = nextUsage[edgeId] || {
        flows: asRecord(priorUsage.flows),
        tally: asRecord(priorUsage.tally),
        receipts: asRecord(priorUsage.receipts),
        ...(Array.isArray(priorUsage.reasonGoods) ? { reasonGoods: priorUsage.reasonGoods } : {}),
        lastTick: tick,
      };
      const stepped = withFlowStep(
        /** @type {never} */ (prior), REAGENT_FLOW_SOURCE, traversal.weight, traversal.good);
      nextUsage[edgeId] = { ...stepped, lastTick: tick };
    } else {
      const pair = admissible.pairs.get(id) || [traversal.a, traversal.b];
      const prior = nextCorridors[id]
        || asRecord(network.corridor)[id]
        || corridorDemand({ a: pair[0], b: pair[1], sinceTick: tick });
      const stepped = withFlowStep(
        /** @type {never} */ (prior), REAGENT_FLOW_SOURCE, traversal.weight, traversal.good);
      const before = asRecord(prior);
      nextCorridors[id] = {
        a: before.a,
        b: before.b,
        flows: stepped.flows,
        tally: stepped.tally,
        receipts: stepped.receipts,
        ...(stepped.reasonGoods ? { reasonGoods: stepped.reasonGoods } : {}),
        sinceTick: num(before.sinceTick, tick),
        // NOT advanced, for J2's own stated reason: this pass MEASURES and J3
        // EVALUATES, and a cursor moved by a measurer would tell the evaluator a
        // corridor had been considered when nothing had considered it.
        lastCharterEval: num(before.lastCharterEval, tick),
      };
    }
    accrued += 1;
  }

  if (accrued === 0) {
    return { ...inert, traversals: traversals.length, offNetwork };
  }
  const folded = withEdgeUsage(
    withCorridors(network, /** @type {never} */ (nextCorridors)),
    /** @type {never} */ (nextUsage),
  );
  return {
    worldState: writeRouteNetwork(worldState, folded),
    changed: true,
    traversals: traversals.length,
    accrued,
    offNetwork,
    corridorsTouched: Object.keys(nextCorridors).length,
    edgesTouched: Object.keys(nextUsage).length,
  };
}

/**
 * The reagent supply factor for one settlement, which is the number
 * `deriveMagicSubstitution` multiplies its cap band by. A thin convenience over
 * `reagentPosture`, exported so the two leaves compose at the call site without the
 * substitution file having to know what a shipment record looks like.
 *
 * @param {{ settlement: Record<string, unknown>|null|undefined, worldState: Record<string, unknown>|null|undefined, cid: string|number }} input
 * @returns {number} 0..1
 */
export function reagentSupplyFactor(input) {
  return clamp01(num(reagentPosture(input).supply01, 0));
}

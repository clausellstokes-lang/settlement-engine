/**
 * routeNetworkFlowsSelfSufficiency.js — REALM SELF-SUFFICIENCY (W-J slice J2;
 * binding law docs/DESIGN_ROUTE_LIFECYCLE.md §5, §13).
 *
 * §5 promotes the owner's efficiency law from a principle to a MEASURED METRIC:
 * realm self-sufficiency, emitted per pulse into the behavioral observation, with
 * a soak envelope of monotone improvement absent shocks. This is that metric, and
 * the brief for it was three words: bounded, honest, cheap.
 *
 * ── BOUNDED ────────────────────────────────────────────────────────────────
 * Exactly 0..1, always, on every world including an empty one. Every component is
 * a ratio of a count to a count, so there is no scale to drift and no unit to
 * argue about across realms of different sizes.
 *
 * ── HONEST: THREE COMPONENTS, BECAUSE THERE ARE THREE FAILURES ─────────────
 * A single number would hide the diagnosis this whole program exists to produce.
 *
 *   PROVISION is the ECONOMY's answer: of the goods the realm's settlements want,
 *   how many does the realm make ANYWHERE? A realm that makes no iron has an
 *   economic problem, and no road will fix it.
 *
 *   CIRCULATION is the ROADS' answer: of the wants the realm CAN satisfy from its
 *   own production, how many can actually reach a maker over the lived network? A
 *   realm with grain in the north and hunger in the south, and no road between, is
 *   not one realm. This is the component a charter moves, and it is why the metric
 *   belongs to the route program rather than to the economy.
 *
 *   SUSTENANCE is the oldest question: can the realm feed itself? Read from the
 *   conserved food ledger, aggregated, clamped.
 *
 * A realm that WANTS NOTHING scores 1 on the first two, and the reason is stated
 * rather than fallen into: a place that needs nothing from anyone is the most
 * self-sufficient thing there is, and reporting 0 for an empty denominator would
 * make an untouched fixture look like a catastrophe. SUSTENANCE has no such
 * reading, so when no settlement carries a food ledger the component is EXCLUDED
 * and the remaining weights renormalize. An absent instrument reports as an absent
 * instrument; it never reports as a zero.
 *
 * ── CHEAP ──────────────────────────────────────────────────────────────────
 * One pass over the membership to build the material index, one pass over the
 * edges for components, then one pass over the wants. No pair enumeration, no
 * pathfinding, nothing quadratic. It can run every pulse without anyone noticing.
 *
 * ── DORMANCY ───────────────────────────────────────────────────────────────
 * `routeLifecycleActive` gates it and a dark world answers null, not zero. A dark
 * receipt therefore carries no metric key at all, which keeps every soak envelope
 * already on disk reading exactly as it did before this slice existed.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store.
 */

import { clamp01 } from '../../kernel/math.js';
import { foodLedger } from '../foodLedger.js';
import { readRouteNetwork, routeLifecycleActive } from './routeNetworkLedger.js';
import {
  buildMaterialIndex,
  connectedSuppliers,
  realmSupplies,
} from './routeNetworkFlowsMaterial.js';

/**
 * ROUTE_LIFECYCLE_TUNING, the metric half (§12: every entry a band). The weights
 * sum to 1 when all three components are present, and renormalize when sustenance
 * is unreadable. Sustenance carries the largest single share because §0's material
 * law names feeding the realm first.
 * @type {Readonly<Record<string, number>>}
 */
export const SELF_SUFFICIENCY_WEIGHTS = Object.freeze({
  provision: 0.3,
  circulation: 0.3,
  sustenance: 0.4,
});

/** @param {number} value @returns {number} */
function round4(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 10000) / 10000 : 0;
}

/**
 * @typedef {Object} RealmSelfSufficiency
 * @property {number} selfSufficiency01  the bounded 0..1 metric
 * @property {number} provision01        goods the realm makes, of goods it wants
 * @property {number} circulation01      satisfiable wants a road actually reaches
 * @property {number|null} sustenance01  food adequacy, or null when unreadable
 * @property {number} settlements        how many members the reading covered
 * @property {number} wantedGoods        distinct goods any settlement imports
 * @property {number} providedGoods      of those, how many the realm makes at all
 * @property {number} satisfiableWants   consumer-good pairs the realm could serve
 * @property {number} connectedWants     of those, how many a road reaches today
 * @property {number} strandedWants      the roads diagnosis: makeable, unreachable
 */

/**
 * THE FOOD HALF. Aggregated over the whole realm rather than averaged per
 * settlement, so one starving hamlet does not outweigh a fed city and one fed city
 * does not hide a starving province: the realm either grows what it eats or it
 * does not. Returns null when no settlement carries a readable food ledger.
 *
 * @param {ReadonlyArray<{ settlement: Record<string, unknown> }>} members
 * @returns {number|null}
 */
export function realmSustenance01(members) {
  let need = 0;
  let production = 0;
  let readable = 0;
  for (const member of Array.isArray(members) ? members : []) {
    const ledger = foodLedger(/** @type {never} */ (member.settlement));
    if (!ledger.present) continue;
    readable += 1;
    need += Math.max(0, ledger.dailyNeed);
    production += Math.max(0, ledger.dailyProduction);
  }
  if (readable === 0 || need <= 0) return null;
  return clamp01(production / need);
}

/**
 * MEASURE THE REALM (§5). Pure, total, and independent of the flag: the gate lives
 * in `observeRealmSelfSufficiency` so a test can measure a fixture directly while
 * the emission stays dormant-safe.
 *
 * @param {{
 *   members: ReadonlyArray<import('./routeNetworkFlowsMaterial.js').MaterialMember>,
 *   network?: import('./routeNetworkLedger.js').RouteNetwork|null,
 * }} input
 * @returns {RealmSelfSufficiency}
 */
export function measureRealmSelfSufficiency(input) {
  const members = Array.isArray(input.members) ? input.members : [];
  const index = buildMaterialIndex({ members, network: input.network || null });

  const wantedGoods = [...index.consumersOf.keys()].sort();
  let providedGoods = 0;
  for (const goodId of wantedGoods) {
    if (realmSupplies(index, goodId)) providedGoods += 1;
  }

  let satisfiableWants = 0;
  let connectedWants = 0;
  for (const consumerId of index.memberIds) {
    const wanted = index.importsOf.get(consumerId) || new Set();
    for (const goodId of [...wanted].sort()) {
      if (!realmSupplies(index, goodId, consumerId)) continue;
      satisfiableWants += 1;
      if (connectedSuppliers(index, consumerId, goodId).length > 0) connectedWants += 1;
    }
  }

  // An empty denominator is the "wants nothing" reading, stated at the source so no
  // caller has to guess whether a 1 means perfect or means untested.
  const provision01 = wantedGoods.length === 0 ? 1 : clamp01(providedGoods / wantedGoods.length);
  const circulation01 = satisfiableWants === 0 ? 1 : clamp01(connectedWants / satisfiableWants);
  const sustenance01 = realmSustenance01(members);

  let total = provision01 * SELF_SUFFICIENCY_WEIGHTS.provision
    + circulation01 * SELF_SUFFICIENCY_WEIGHTS.circulation;
  let weight = SELF_SUFFICIENCY_WEIGHTS.provision + SELF_SUFFICIENCY_WEIGHTS.circulation;
  if (sustenance01 != null) {
    total += sustenance01 * SELF_SUFFICIENCY_WEIGHTS.sustenance;
    weight += SELF_SUFFICIENCY_WEIGHTS.sustenance;
  }

  return {
    selfSufficiency01: round4(weight > 0 ? clamp01(total / weight) : 1),
    provision01: round4(provision01),
    circulation01: round4(circulation01),
    sustenance01: sustenance01 == null ? null : round4(sustenance01),
    settlements: index.memberIds.length,
    wantedGoods: wantedGoods.length,
    providedGoods,
    satisfiableWants,
    connectedWants,
    strandedWants: satisfiableWants - connectedWants,
  };
}

/**
 * THE ONE SHAPE ADAPTER for the audit surface. A soak carries its settlements as
 * saves shaped `{ id, settlement }`, and older shapes carry the settlement itself
 * with an id on it. Both resolve here, in one function, because a reader that
 * guesses at a writer's spelling is the estate's most expensive recurring bug.
 *
 * @param {ReadonlyArray<unknown>|null|undefined} saves
 * @returns {Array<import('./routeNetworkFlowsMaterial.js').MaterialMember>}
 */
export function selfSufficiencyMembersFromSaves(saves) {
  if (!Array.isArray(saves)) return [];
  /** @type {Array<import('./routeNetworkFlowsMaterial.js').MaterialMember>} */
  const out = [];
  for (const entry of saves) {
    if (!entry || typeof entry !== 'object') continue;
    const save = /** @type {Record<string, unknown>} */ (entry);
    const id = save.id != null ? String(save.id)
      : save.saveId != null ? String(save.saveId) : '';
    if (!id) continue;
    const settlement = save.settlement && typeof save.settlement === 'object'
      ? /** @type {Record<string, unknown>} */ (save.settlement)
      : save;
    out.push({ id, settlement });
  }
  return out;
}

/**
 * THE PER-PULSE EMISSION (§5, §13). Returns null on a DARK world, which is how the
 * observation surface drops the key entirely rather than recording a zero: a zero
 * would read as a realm that cannot feed itself, and a dormant subsystem must
 * never be mistaken for a failing one.
 *
 * @param {{
 *   worldState: Record<string, unknown>|null|undefined,
 *   saves: ReadonlyArray<unknown>|null|undefined,
 * }} input
 * @returns {RealmSelfSufficiency|null}
 */
export function observeRealmSelfSufficiency(input) {
  if (!routeLifecycleActive(input.worldState)) return null;
  return measureRealmSelfSufficiency({
    members: selfSufficiencyMembersFromSaves(input.saves),
    network: readRouteNetwork(input.worldState),
  });
}

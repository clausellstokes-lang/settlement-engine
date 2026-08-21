/**
 * routeNetworkFlowsMaterial.js — THE MATERIAL INDEX (W-J slice J2; binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §5, "efficiency is MATERIAL").
 *
 * The owner's law is that the network's fitness is the realm's ability to feed,
 * supply, garrison and people itself. Two questions have to be cheap before that
 * law can be measured at all:
 *
 *   WHO WANTS WHAT, AND WHO MAKES IT? Every settlement's declared imports are its
 *   unmet local demand and its declared exports are its surplus, both read through
 *   the goodsCatalog vocabulary so `wheat`, `Grain`, and `grain (surplus)` are one
 *   good and not three. The catalog is the denomination §5 asks for.
 *
 *   CAN THE WANT ACTUALLY REACH THE MAKER? A realm that grows enough grain in the
 *   north and starves in the south is not self-sufficient; it is two realms. So the
 *   index answers supply questions over the LIVED NETWORK's components, which is
 *   the whole reason routes belong in a material metric at all: closing a material
 *   loop is a thing a ROAD does.
 *
 * This leaf is the ONE place either question is answered, so the objective scorer
 * and the realm metric can never disagree about who supplies whom. Building it once
 * per pulse and passing it down is also what keeps both callers linear: the index
 * costs one pass over the membership plus one pass over the edges.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store. Sets are built by
 * codepoint-sorted iteration so every derived list is stable.
 */

import { normalizeGood, goodCriticality } from '../region/goodsCatalog.js';
import { canonExports } from '../canonicalAccessors.js';
import { routeNetworkComponents, routeConnected } from './routeNetworkLedger.js';

/**
 * The criticality at or above which a good is CRITICAL, and therefore worth paying
 * for a second road to (§5's resilience credit). goodsCatalog scores criticality on
 * 0..1 with staples high and luxuries low; this is the rung, and it is a tuning
 * band the soak may veto.
 * @type {number}
 */
export const CRITICAL_GOOD_FLOOR = 0.6;

/** @param {unknown} value @returns {Record<string, unknown>} */
function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * @typedef {Object} MaterialMember
 * @property {string} id
 * @property {Record<string, unknown>} settlement
 */

/**
 * The canonical goods ids in a raw list. Anything the catalog cannot place becomes
 * a `custom.` entry rather than being dropped, because a DM's own trade good is
 * still a want and silently discarding it would make the realm look more
 * self-sufficient than it is.
 *
 * @param {unknown} raw
 * @returns {Set<string>}
 */
export function goodIdsOf(raw) {
  /** @type {Set<string>} */
  const ids = new Set();
  if (!Array.isArray(raw)) return ids;
  for (const entry of raw) {
    const good = normalizeGood(/** @type {never} */ (entry));
    if (good && good.id) ids.add(String(good.id));
  }
  return ids;
}

/**
 * The catalog label for a good id, for a receipt that reads like a sentence about
 * grain rather than about `good.grain`. Falls back to the id, which is the honest
 * answer for a custom good nobody labelled.
 *
 * @param {string} goodId
 * @returns {string}
 */
export function goodLabelOf(goodId) {
  const good = normalizeGood(/** @type {never} */ (goodId));
  return good && good.label ? String(good.label) : String(goodId);
}

/**
 * @typedef {Object} MaterialIndex
 * @property {ReadonlyArray<string>} memberIds  codepoint sorted
 * @property {Map<string, Set<string>>} importsOf  settlement id to wanted good ids
 * @property {Map<string, Set<string>>} exportsOf  settlement id to supplied good ids
 * @property {Map<string, Set<string>>} suppliersOf  good id to the settlements making it
 * @property {Map<string, Set<string>>} consumersOf  good id to the settlements wanting it
 * @property {Map<string, string>} components  settlement id to lived-network component
 * @property {Set<string>} criticalGoods  the goods a second road is worth paying for
 */

/**
 * Build the index once per pulse. `network` may be null on a realm whose genesis
 * derived nothing at all, in which case every component lookup answers "alone",
 * which is the isolation-as-fate law reading honestly rather than crashing.
 *
 * @param {{
 *   members: ReadonlyArray<MaterialMember>,
 *   network: import('./routeNetworkLedger.js').RouteNetwork|null|undefined,
 * }} input
 * @returns {MaterialIndex}
 */
export function buildMaterialIndex(input) {
  const members = Array.isArray(input.members) ? input.members : [];
  const memberIds = [...new Set(members.map(m => String(m.id)).filter(Boolean))].sort();
  const byId = new Map(members.map(m => [String(m.id), asRecord(m.settlement)]));

  /** @type {Map<string, Set<string>>} */
  const importsOf = new Map();
  /** @type {Map<string, Set<string>>} */
  const exportsOf = new Map();
  /** @type {Map<string, Set<string>>} */
  const suppliersOf = new Map();
  /** @type {Map<string, Set<string>>} */
  const consumersOf = new Map();
  /** @type {Set<string>} */
  const criticalGoods = new Set();

  /** @param {Map<string, Set<string>>} map @param {string} key @param {string} value */
  const link = (map, key, value) => {
    const set = map.get(key) || new Set();
    set.add(value);
    map.set(key, set);
  };

  for (const id of memberIds) {
    const settlement = byId.get(id) || {};
    const economic = asRecord(settlement.economicState);
    const wanted = goodIdsOf(
      Array.isArray(economic.primaryImports) ? economic.primaryImports : economic.imports,
    );
    const supplied = goodIdsOf(canonExports(/** @type {never} */ (settlement)));
    importsOf.set(id, wanted);
    exportsOf.set(id, supplied);
    for (const goodId of [...wanted].sort()) {
      link(consumersOf, goodId, id);
      if (goodCriticality(goodId) >= CRITICAL_GOOD_FLOOR) criticalGoods.add(goodId);
    }
    for (const goodId of [...supplied].sort()) {
      link(suppliersOf, goodId, id);
      if (goodCriticality(goodId) >= CRITICAL_GOOD_FLOOR) criticalGoods.add(goodId);
    }
  }

  return {
    memberIds,
    importsOf,
    exportsOf,
    suppliersOf,
    consumersOf,
    components: routeNetworkComponents(input.network || null),
    criticalGoods,
  };
}

/**
 * The settlements that both make `goodId` and can currently reach `consumerId`
 * over the lived network. This is the function that makes a road matter to the
 * economy: sever the edge and the same supplier stops counting.
 *
 * @param {MaterialIndex} index
 * @param {string} consumerId
 * @param {string} goodId
 * @returns {Array<string>} codepoint sorted, never including the consumer itself
 */
export function connectedSuppliers(index, consumerId, goodId) {
  const suppliers = index.suppliersOf.get(String(goodId));
  if (!suppliers || suppliers.size === 0) return [];
  /** @type {Array<string>} */
  const reachable = [];
  for (const supplierId of [...suppliers].sort()) {
    if (supplierId === String(consumerId)) continue;
    if (!routeConnected(index.components, consumerId, supplierId)) continue;
    reachable.push(supplierId);
  }
  return reachable;
}

/**
 * Does the realm make `goodId` at all, anywhere, regardless of whether a road
 * reaches it? The distinction between this question and `connectedSuppliers` is
 * the whole diagnosis the self-sufficiency metric reports: a realm that cannot
 * make a thing has an ECONOMIC problem, and a realm that makes it but cannot move
 * it has a ROADS problem, and treating those as one number would hide exactly the
 * signal this program exists to create.
 *
 * @param {MaterialIndex} index
 * @param {string} goodId
 * @param {string} [exceptId] a supplier to ignore (itself, usually)
 * @returns {boolean}
 */
export function realmSupplies(index, goodId, exceptId = '') {
  const suppliers = index.suppliersOf.get(String(goodId));
  if (!suppliers || suppliers.size === 0) return false;
  if (!exceptId) return true;
  for (const supplierId of suppliers) {
    if (supplierId !== String(exceptId)) return true;
  }
  return false;
}

/**
 * @typedef {Object} MaterialWant
 * @property {string} good      the goodsCatalog id
 * @property {string} goodLabel the catalog label, for a legible receipt
 * @property {string} fromId    the settlement that makes it
 * @property {string} toId      the settlement that wants it
 * @property {boolean} critical
 * @property {boolean} alreadyServed  a connected supplier already reaches the consumer
 */

/**
 * THE WANTS ACROSS ONE PAIR, in both directions (§5's LOCAL term, itemized). Each
 * want is one good that one endpoint makes and the other needs, carrying its own
 * receipt: which good, which way, and whether the realm is already serving it by
 * some other road. `alreadyServed` is what separates a corridor that closes a
 * material loop from one that merely adds a second way to do something the realm
 * can already do, and §5 scores those two very differently.
 *
 * @param {MaterialIndex} index
 * @param {string} a @param {string} b
 * @returns {Array<MaterialWant>}
 */
export function wantsAcross(index, a, b) {
  /** @type {Array<MaterialWant>} */
  const wants = [];
  /** @param {string} consumerId @param {string} supplierId */
  const collect = (consumerId, supplierId) => {
    const wanted = index.importsOf.get(consumerId) || new Set();
    const supplied = index.exportsOf.get(supplierId) || new Set();
    for (const goodId of [...wanted].sort()) {
      if (!supplied.has(goodId)) continue;
      wants.push({
        good: goodId,
        goodLabel: goodLabelOf(goodId),
        fromId: supplierId,
        toId: consumerId,
        critical: index.criticalGoods.has(goodId),
        alreadyServed: connectedSuppliers(index, consumerId, goodId).length > 0,
      });
    }
  };
  collect(String(a), String(b));
  collect(String(b), String(a));
  return wants;
}

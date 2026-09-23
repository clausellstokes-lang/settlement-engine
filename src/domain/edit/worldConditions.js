/**
 * worldConditions.js — THE WORLD HALF OF `requires`, AS TEN NAMED PREDICATES
 * (EM-B1a, wave 1; ODQ §934.50 / design §18, corrected by design §19 ruling 6).
 *
 * ⛔ THE ORDER THIS LEAF EXISTS TO SERVE. An op's `requires` splits into
 * `{ world, registry }`. The WORLD half is named pure predicates over the record and
 * the campaign that decide WHICH SEALS A CARD OFFERS AT ALL — "not a guard refusing an
 * act but the world's state determining which acts exist". The REGISTRY half stays the
 * guards' suggestive ordering condition and is spelled in `operations.js`.
 *
 * ⭐⭐ SCOPED IS A CONTRACT, NOT A STYLE NOTE (the chair's ruling R9). Every predicate
 * answers about the card's SUBJECT — the settlement in `record`, and the counterparty
 * where the seal names one — and ONLY while its process is at a LIVE stage. A seal
 * offered on town A because town B has a coup, or because a coup already resolved, is a
 * DEFECT. Five rows needed a subject filter and two a stage filter; the rest were
 * already scoped by their readers, and the per-row notes below say which.
 *
 * ⛔ EVERY FACT IS READ AT ITS SOURCE MODULE AND THROUGH ITS EXPORTED GATE (§7's coding
 * instruction) — never a bare string and never a raw flag. That is why the two closed
 * vocabularies are IMPORTED and their members read out of them rather than typed here:
 * a rename upstream empties the lookup, and A2's reader arm reds instead of the row
 * quietly answering false forever.
 *
 * ⛔ PURE, TOTAL, FALSE-ON-ABSENCE. An absent field yields `false`, never a throw, so a
 * card simply does not offer the seal. No writes, no draws, no store, no React.
 *
 * ⭐ TEN IDS, NINE OF THEM LIVE. `openRoute` is ONE id answered by TWO readers (the
 * regional graph's confirmed channel, always live; the route-network ledger, gated
 * behind `routeLifecycleEnabled`, which is off by default), and `readers` is the data
 * position the ruling names when it says "the seal names which". ONE row is still
 * honestly absent, declares `source: 'EM-E4'` and `readers: []`, and returns `false`
 * until the packet that lands its state arrives; it is not invented here.
 *
 * ⭐ `pendingPeaceOffer` IS NO LONGER ONE OF THEM (U28). EM-E4 landed the standing offer
 * as a record on the RECEIVING settlement, keyed by the counterparty that made it
 * (`peaceTermsDrafting.js`'s `PEACE_OFFER_KEY`, `peaceOffersOf`, `pendingPeaceOfferFrom`),
 * which is precisely the state this row was waiting on — so the row reads it rather than
 * answering a stale `false` about a fact the tree now carries.
 */

import { STATUS_ACTIVE } from '../entities/status.js';
import { atWarWith } from '../roads/embassyHazard.js';
import { activeDeployments, liveSieges } from '../display/warStatus.js';
import { edgeKeyBetween } from '../worldPulse/relationshipEvolution.js';
import { PRIMARY_RELATIONSHIP_TYPES } from '../worldPulse/relationshipCompatibility.js';
import { hasBeliefMaps } from '../display/settlementBeliefs.js';
import { getSpatialLedger } from '../spatial/spatialLedgerAccess.js';
import { COUP_STRESSOR_TYPE } from '../worldPulse/coup.js';
import { peaceOffersOf, pendingPeaceOfferFrom } from '../worldPulse/peaceTermsDrafting.js';
import { REGIONAL_CHANNEL_TYPES, activeChannelsFrom } from '../region/graph.js';
import { ROUTE_GRADES, readRouteNetwork, routeLifecycleActive } from '../worldPulse/routeNetworkLedger.js';

/**
 * ⭐ EVERY DOOR INTO THIS LEAF IS `unknown`, NEVER `any`, AND THE NARROWING IS THE CHECK'S
 * OWN. A predicate is handed a record and a campaign this leaf does not own the shapes of;
 * `any` would type-check by surrendering, and the any-cast ratchet counts every one of
 * them (version 8 carried ten here against an allowance of zero). `unknown` plus the
 * `isRecordObject` TYPE PREDICATE below buys the same freedom with no hole: an absent or
 * misshapen field cannot be read at all until it has been tested, which is also exactly
 * the false-on-absence law this leaf promises.
 *
 * @typedef {{
 *   id: string,
 *   module: string,
 *   symbol: string,
 *   gate: ((campaignState: unknown) => boolean)|null
 * }} WorldConditionReader
 *
 * @typedef {{
 *   predicate: (record: unknown, campaignState: unknown) => boolean,
 *   readers: readonly WorldConditionReader[],
 *   source: 'live'|'EM-E4',
 * }} WorldConditionRow
 *
 * A row as its author writes it: `source` is the helper's to stamp, never the author's.
 * @typedef {{
 *   predicate: (record: unknown, campaignState: unknown) => boolean,
 *   readers: readonly WorldConditionReader[],
 * }} WorldConditionRowDraft
 *
 * One edge of the regional graph, at the shape `edgeKeyBetween` declares it.
 * @typedef {{ from?: unknown, to?: unknown, id?: unknown }} GraphEdgeLike
 */

/**
 * The LIVE stages of a stressor's lifecycle: the pulse's seven minus the three terminal
 * ones (`resolved`, `residual`, `dormant`). ⚠ `foodStockpile.js`'s `ACTIVE_STAGES` is
 * module-private, so this leaf declares its own frozen four and mirrors that module's
 * idiom rather than reaching for an unexported constant. A2 asserts the partition by
 * behaviour over all seven of `STRESSOR_LIFECYCLE_STAGES`, so a pulse-vocabulary change
 * reds here instead of drifting.
 */
const LIVE_STRESSOR_STAGES = Object.freeze(['active', 'easing', 'emerging', 'peaking']);

/** The default a stressor carries when it is stored without an explicit stage. */
const DEFAULT_STRESSOR_STAGE = 'active';

/**
 * The two vocabulary members this leaf reads, taken OUT of their own closed lists so an
 * upstream rename cannot leave a bare string pointing at nothing.
 */
const TRADE_ROUTE = REGIONAL_CHANNEL_TYPES.filter((t) => t === 'trade_route')[0] || '';
const TRADE_PARTNER = PRIMARY_RELATIONSHIP_TYPES.filter((t) => t === 'trade_partner')[0] || '';

/**
 * The bottom rung of the route ladder. A decayed way is still an EDGE, so absence is not
 * the test: `ROUTE_GRADES` is authored best-first and its last member is the overgrown
 * remnant that must not offer a route.
 */
const HIDDEN_GRADE = ROUTE_GRADES[ROUTE_GRADES.length - 1];

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecordObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * An unknown value as a list, so a `.some` callback has a contextual type. A union of
 * two array types (`unknown[] | never[]`) does NOT contextually type its callback, which
 * is where three of version 8's implicit-`any` errors came from.
 * @param {unknown} value @returns {readonly unknown[]}
 */
function listOf(value) {
  return Array.isArray(value) ? value : [];
}

/** @param {unknown} record @returns {string} the card's SUBJECT id, or '' when absent */
function subjectId(record) {
  return isRecordObject(record) && record.id != null ? String(record.id) : '';
}

/**
 * ⭐ THE TWO DOORWAYS ANSWER A RECORD OR `null`, AND NOTHING BETWEEN. A campaign whose
 * `worldState` is not an object is indistinguishable from one that has none — which is
 * this leaf's false-on-absence law spelled as a type rather than as a comment, and is what
 * lets every neighbour below be called at its OWN declared parameter with no `any`.
 * @param {unknown} campaignState @returns {Record<string, unknown>|null}
 */
function worldOf(campaignState) {
  const world = isRecordObject(campaignState) ? campaignState.worldState : null;
  return isRecordObject(world) ? world : null;
}

/** @param {unknown} campaignState @returns {Record<string, unknown>|null} */
function graphOf(campaignState) {
  const graph = isRecordObject(campaignState) ? campaignState.regionalGraph : null;
  return isRecordObject(graph) ? graph : null;
}

/**
 * The regional graph's edge list at the shape its own readers declare. The assertion is a
 * WIDENING and asserts nothing about any edge: every field stays `unknown`, and an absent
 * or misshapen list is the empty one.
 * @param {unknown} graph @returns {readonly GraphEdgeLike[]}
 */
function edgesOf(graph) {
  return /** @type {readonly GraphEdgeLike[]} */ (isRecordObject(graph) ? listOf(graph.edges) : []);
}

/**
 * The ids the regional graph connects to `id`, and NOTHING else. This is the subject
 * filter for every pair-scoped row: a war or a trade edge between two neighbours never
 * enters the list, so it can never answer for this card.
 * @param {unknown} graph @param {string} id @returns {string[]}
 */
function counterpartiesOf(graph, id) {
  const edges = edgesOf(graph);
  /** @type {Set<string>} */
  const others = new Set();
  for (const edge of edges) {
    if (!isRecordObject(edge)) continue;
    const from = edge.from != null ? String(edge.from) : '';
    const to = edge.to != null ? String(edge.to) : '';
    if (from === id && to) others.add(to);
    if (to === id && from) others.add(from);
  }
  return [...others];
}

/** @param {string} id @param {string} module @param {string} symbol @returns {WorldConditionReader} */
function reader(id, module, symbol) {
  return Object.freeze({ id, module, symbol, gate: null });
}

/** @param {WorldConditionRowDraft} row @returns {WorldConditionRow} */
function liveRow(row) {
  return Object.freeze({ ...row, readers: Object.freeze(row.readers), source: 'live' });
}

/** A row whose state does not exist yet. It answers false and says why, as data. */
const ABSENT_UNTIL_E4 = Object.freeze({
  predicate: () => false,
  readers: Object.freeze([]),
  source: 'EM-E4',
});

/**
 * THE ROSTER. Ten ids, authored in codepoint order; nine live, one honestly absent.
 * @type {Readonly<Record<string, WorldConditionRow>>}
 */
export const WORLD_CONDITIONS = Object.freeze({
  // SUBJECT: the per-observer index, keyed by the observer's own id. The realm-wide
  // panel gate `hasBeliefMaps` is DEMOTED to a dormancy pre-gate: it answers "does this
  // world carry any belief map at all", which would offer town A's seal for town B's
  // map. STAGE: presence of the entry IS its stage, by construction.
  beliefExists: liveRow({
    predicate: (record, campaignState) => {
      const world = worldOf(campaignState);
      if (!hasBeliefMaps(world)) return false;
      /** @type {unknown} */
      const maps = getSpatialLedger(world, 'beliefMaps');
      const mine = isRecordObject(maps) ? maps[subjectId(record)] : null;
      return isRecordObject(mine) && Object.keys(mine).length > 0;
    },
    readers: [reader('belief-ledger', 'src/domain/spatial/spatialLedgerAccess.js', 'getSpatialLedger')],
  }),

  envoyArrived: ABSENT_UNTIL_E4,

  // SUBJECT and STAGE both already held by the reader: the deployment ledger is keyed by
  // the fielding settlement's OWN id, and presence in it IS the live stage. A recalled
  // army's key is gone.
  forceInField: liveRow({
    predicate: (record, campaignState) => {
      const id = subjectId(record);
      if (!id) return false;
      return activeDeployments(worldOf(campaignState)).some((d) => d.homeId === id);
    },
    readers: [reader('deployment-ledger', 'src/domain/display/warStatus.js', 'activeDeployments')],
  }),

  // SUBJECT: the record's own people. STAGE: ACTIVE-OR-ABSENT is the live stage, because
  // the ops-layer writer spells `status: input.status || 'active'`, so a person stored
  // without the key is active by the writer's own default. A literal equality against
  // the constant alone would read false on roughly nine people in ten.
  npcPresent: liveRow({
    predicate: (record) => {
      const people = isRecordObject(record) ? listOf(record.npcs) : [];
      return people.some((n) => isRecordObject(n) && (n.status ?? STATUS_ACTIVE) === STATUS_ACTIVE);
    },
    readers: [reader('npc-status', 'src/domain/entities/status.js', 'STATUS_ACTIVE')],
  }),

  // SUBJECT: reader 1 filters on `channel.from` by construction; reader 2 needs the leaf
  // to filter on the edge's two endpoints. STAGE: reader 1 admits only `confirmed`
  // channels; reader 2 needs the leaf to reject the bottom rung, or an overgrown remnant
  // would offer a direct trade route.
  openRoute: liveRow({
    predicate: (record, campaignState) => {
      const id = subjectId(record);
      if (!id) return false;
      // `activeChannelsFrom` spells `graph || {}` on its own first line, so the empty
      // graph and the absent one are the SAME call; the assertion only names the shape.
      const graph = /** @type {import('../region/graph.js').RegionGraph} */ (graphOf(campaignState) ?? {});
      const channels = activeChannelsFrom(graph, id, { types: [TRADE_ROUTE] });
      if (channels.length > 0) return true;
      const world = worldOf(campaignState);
      if (!routeLifecycleActive(world)) return false;
      /** @type {unknown} */
      const network = readRouteNetwork(world);
      const edges = isRecordObject(network) && isRecordObject(network.edges)
        ? Object.values(network.edges)
        : [];
      return edges.some((e) => isRecordObject(e)
        && (String(e.a) === id || String(e.b) === id)
        && e.grade !== HIDDEN_GRADE);
    },
    readers: [
      reader('regional-channel', 'src/domain/region/graph.js', 'activeChannelsFrom'),
      Object.freeze({
        id: 'route-network',
        module: 'src/domain/worldPulse/routeNetworkLedger.js',
        symbol: 'readRouteNetwork',
        /** @param {unknown} campaignState @returns {boolean} */
        gate: (campaignState) => routeLifecycleActive(worldOf(campaignState)),
      }),
    ],
  }),

  // SUBJECT: structural. EM-E4's record stands ON THE RECEIVING SETTLEMENT and is keyed by
  // the counterparty that made each offer, so another town's offers are on another town's
  // record and are not reachable from here at all — no filter is needed and none is faked.
  // STAGE: also structural. A STANDING offer is the pending stage by construction, and both
  // ways out of it (`withoutPeaceOffer`, which acceptance and refusal each call) take the
  // key off, so a war already settled offers neither seal.
  // ⛔ THE CARD-LEVEL QUESTION IS "does any counterparty's offer stand", because a predicate
  // is handed the record and the campaign and never a counterparty; design §18's per-seal
  // read from ONE named court is `pendingPeaceOfferFrom` itself, which is why the keys come
  // from `peaceOffersOf` and each is put back through that exported gate rather than being
  // trusted as a key. A bag entry that is not a real offer therefore cannot light the seal.
  pendingPeaceOffer: liveRow({
    predicate: (record) => Object.keys(peaceOffersOf(record))
      .some((fromId) => !!pendingPeaceOfferFrom(record, fromId)),
    readers: [reader('peace-offer-record', 'src/domain/worldPulse/peaceTermsDrafting.js', 'pendingPeaceOfferFrom')],
  }),

  // SUBJECT: the stressor's own `affectedSettlementIds`. STAGE: the live four. Both
  // filters mirror the tree's own idiom at `blockadeFor` and `famineFor`.
  plotInMotion: liveRow({
    predicate: (record, campaignState) => {
      const id = subjectId(record);
      if (!id) return false;
      const world = worldOf(campaignState);
      const stressors = isRecordObject(world) ? listOf(world.stressors) : [];
      return stressors.some((s) => isRecordObject(s)
        && s.type === COUP_STRESSOR_TYPE
        && LIVE_STRESSOR_STAGES.includes(String(s.lifecycleStage || DEFAULT_STRESSOR_STAGE))
        && listOf(s.affectedSettlementIds).map(String).includes(id));
    },
    readers: [reader('coup-stressor', 'src/domain/worldPulse/coup.js', 'COUP_STRESSOR_TYPE')],
  }),

  // SUBJECT: the leaf filters for a siege whose TARGET is this settlement or whose
  // COALITION names it, so a siege elsewhere never answers. STAGE: already held, the
  // reader builds only from confirmed fronts and live deployments.
  siegeInProgress: liveRow({
    predicate: (record, campaignState) => {
      const id = subjectId(record);
      if (!id) return false;
      const sieges = liveSieges({ worldState: worldOf(campaignState), regionalGraph: graphOf(campaignState) });
      return sieges.some((s) => s.targetId === id || s.coalition.includes(id));
    },
    readers: [reader('siege-panel', 'src/domain/display/warStatus.js', 'liveSieges')],
  }),

  // SUBJECT: the leaf resolves the PAIR's own edge key, because `relationshipStates` is
  // keyed by the regional edge's id and a synthesized key would orphan. STAGE: already
  // held, the stored type is the edge's present state and never a history.
  tradeWith: liveRow({
    predicate: (record, campaignState) => {
      const id = subjectId(record);
      if (!id) return false;
      const graph = graphOf(campaignState);
      const edges = edgesOf(graph);
      const world = worldOf(campaignState);
      const states = isRecordObject(world) && isRecordObject(world.relationshipStates)
        ? world.relationshipStates
        : {};
      return counterpartiesOf(graph, id).some((other) => {
        const key = edgeKeyBetween(edges, id, other);
        const state = key && isRecordObject(states[key]) ? states[key] : null;
        return !!state && state.relationshipType === TRADE_PARTNER;
      });
    },
    readers: [reader('relationship-edge', 'src/domain/worldPulse/relationshipEvolution.js', 'edgeKeyBetween')],
  }),

  // SUBJECT and STAGE both already held: the reader takes the pair and tests live war
  // fronts in both directions plus the CURRENT hostile rung. The counterparty list is
  // the graph's own edges into this settlement, so a war between two neighbours is not
  // reachable from here.
  warInProgress: liveRow({
    predicate: (record, campaignState) => {
      const id = subjectId(record);
      if (!id) return false;
      const graph = graphOf(campaignState);
      const world = worldOf(campaignState);
      // Absent either half there is no counterparty to answer for, and `counterpartiesOf`
      // on an absent graph already returns the empty list: the guard states the same
      // false-on-absence outcome at the neighbour's own declared parameter.
      if (!graph || !world) return false;
      return counterpartiesOf(graph, id).some((other) => atWarWith(graph, world, id, other));
    },
    readers: [reader('war-layer', 'src/domain/roads/embassyHazard.js', 'atWarWith')],
  }),
});

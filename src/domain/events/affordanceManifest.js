/**
 * domain/events/affordanceManifest.js — THE AFFORDANCE MANIFEST (Composer V2 §2).
 *
 * The composer is a projection of this manifest: per authorable verb —
 * predicate (available/reasons/unlocks), dial schemas (§3), targetsFrom (the
 * TARGET_ENTITY_BY_EVENT source of truth, moved here), authority + scope, and
 * `foldedInto` legibility for the NON_AUTHORABLE types. Two walkers make it
 * fail-closed: the coverage walker (every registry type has an entry or a
 * fold) and the predicate-parity walker (every vetoMutation code in
 * mutateEntities/mutateWorld is claimed by some entry's coversVetoCodes).
 *
 * THE SAME-FUNCTION LAW: predicates WRAP the sim's own gates — the exports
 * below (readCorruptionClimate / isCriminalInstitution, governingFactionOf,
 * reconcileCultImposition, TIER_ORDER, canonStressors) are the exact functions
 * the mutation handlers run — never re-implementations. Unavailability
 * TEACHES: a false predicate carries reasons[] and unlocks[] ("requires a
 * criminal organization"), so the UI grays-with-reason instead of hiding.
 *
 * FIRST-PAINT LAW (the registryProse idiom): this module is a LAZY LEAF.
 * Never import it from the store, the domain event pipeline, or any eager
 * module — only from lazy composer surfaces (and tests). Its imports point the
 * safe direction (lazy → eager). Sentinel for the dist guard:
 * AFFORDANCE_MANIFEST_LAZY_SENTINEL. @enforced-by
 * tests/build/vendorPdfLazy.test.js (closure sentinel + byte budget).
 */

import { EVENT_REGISTRY, EVENT_TYPES } from './registry.js';
import { readCorruptionClimate } from '../corruption.js';
import { governingFactionOf, RULING_POWER_CAUSES } from '../rulingPower.js';
import { reconcileCultImposition } from '../worldPulse/cultImpositionApply.js';
import { TIER_ORDER, popToTier } from '../../data/constants.js';
import { deriveAllActiveConditions } from '../activeConditions.js';
import { canonExports, canonImports, canonStressors } from '../canonicalAccessors.js';
// The generosity verbs' same-function gates (FP-G3): the structural gate the handler
// AND the mover run (generosityGate — a zero-import leaf), and the mover's own hard
// reserve floor (foodStockpile.STOCKPILE_TUNING — safe HERE because this manifest is a
// LAZY leaf; the EAGER handler mirrors the constant under a parity pin instead).
import { qualifiesForGenerosity, normalizeBondKind } from '../spatial/generosityGate.js';
import { STOCKPILE_TUNING } from '../worldPulse/foodStockpile.js';

// The loose open-object shape of the events layer ("schemaless open objects at
// this layer" — mutateEntities.js's own words). Aliased to the schema's OWN
// loose record type (SimSettlement.config = Record<string, any>) rather than a
// local `{any}` typedef: the looseness is owned, documented, and any-census-
// counted where it is DECLARED (settlement.schema.js), and this projection
// layer reads settlements, entities, options, and conditions through one bag
// exactly as the handler layer it mirrors does.
/** @typedef {NonNullable<import('../settlement.schema.js').SimSettlement['config']>} Mut */

export const AFFORDANCE_MANIFEST_LAZY_SENTINEL = 'AFFORDANCE_MANIFEST_LAZY_SENTINEL';

// ── targetsFrom — the TARGET_ENTITY_BY_EVENT source of truth ────────────────
// (moved verbatim from eventComposer/EventComposerConstants.js, which now
// re-exports it; `null` = new entity / free identity text.)
export const TARGET_ENTITY_BY_EVENT = Object.freeze({
  ADD_INSTITUTION:      null,
  ADD_FACTION:          null,
  REMOVE_INSTITUTION:   'institutions',
  DAMAGE_INSTITUTION:   'institutions',
  IMPAIR_INSTITUTION:   'institutions',
  ADD_NPC:              null,
  KILL_NPC:             'npcs',
  IMPOSE_CORRUPTION:    'npcs',
  ASSIGN_NPC_TO_ROLE:   'npcs',
  IMPAIR_FACTION:       'factions',
  RESTORE_FACTION:      'factions',
  EXPOSE_CORRUPTION:    'factions',
  RESTORE_INSTITUTION:  'institutions',
  DEPLETE_RESOURCE:     'resources',
  RECOVERED_RESOURCE:   'resources',
  CUT_TRADE_ROUTE:      null,
  CREATE_ROUTE:         null,
  SETTLEMENT_DISPUTE:   'neighbours',
  BROKERED_ALLIANCE:    'neighbours',
  OPENED_TRADE_ROUTE:   'neighbours',
  RESOLVE_STRESSOR:     'stressors',
  ADD_TRADE_GOOD:       null,
  REMOVE_TRADE_GOOD:    'tradeGoods',
  ADD_RESOURCE:         null,
  REMOVE_RESOURCE:      'resources',
  PROMOTE_NPC:          null,
  DEMOTE_NPC:           null,
  FORCE_RELIEF:         'neighbours',
  OFFER_CREDIT:         'neighbours',
});

// Word-banded severity — "words at the table, numbers in the engine" (moved
// from EventComposerConstants.js, which re-exports it).
export const STRESSOR_SEVERITY_VALUES = Object.freeze({ minor: 0.35, moderate: 0.6, severe: 0.85 });

// The generosity verbs' word-banded MAGNITUDE (FP-G3): the share of the giver's
// ABOVE-FLOOR surplus the decree sends. Same table-words-engine-numbers law.
export const RELIEF_MAGNITUDE_VALUES = Object.freeze({ token: 0.25, measured: 0.5, generous: 0.85 });

// §9b/§9g/§9h relationship vocabularies (moved from EventComposerConstants.js).
export const RELATIONSHIP_OPTIONS = Object.freeze({
  SETTLEMENT_DISPUTE: ['neutral', 'rival', 'cold_war', 'hostile'],
  BROKERED_ALLIANCE:  ['allied'],
  OPENED_TRADE_ROUTE: ['allied', 'client', 'patron', 'trade_partners'],
});
export const RELATIONSHIP_LABELS = Object.freeze({
  neutral: 'Neutral', rival: 'Rival', cold_war: 'Cold War', hostile: 'Hostile',
  allied: 'Allied', client: 'Client', patron: 'Patron', trade_partners: 'Trade Partners',
});

// The 9 registry types the DM does not author directly — each folds into a
// carrying verb below (the walker asserts legibility). Kept as data here; the
// composer re-exports the Set shape it always used.
export const NON_AUTHORABLE_EVENTS = new Set([
  'KILL_LEADER',
  'CUT_TRADE_ROUTE',
  'DAMAGE_INSTITUTION',
  'DEMOTE_NPC',
  'REFUGEE_WAVE',
  'PLAGUE',
  'RAID_OR_MONSTER_ATTACK',
  'REMOVED_THREAT',
  'STARTED_RIOT',
]);

// ── Target options (moved from eventComposer/helpers.js buildTargetOptions —
// domain-pure; helpers.js re-exports for its old callers) ────────────────────
//
// A SECOND DESK MIRRORS THESE, DELIBERATELY: the Session Ledger offers the same
// institution/resource rosters from domain/events/targetRosters.js. Single-
// sourcing them here was tried and REVERTED — a leaf imported by two different
// LAZY chunks (this manifest's and the ledger's) is hoisted by Rollup into the
// entry chunk, which measured +3,985 B of first paint and blew the closure
// budget. The mirror is the cheaper half of that trade; parity is pinned in
// tests/domain/tableLedger.test.js against the very entries below, so the two
// copies cannot drift without a red.

/** Build {id, name} options from a dossier collection for the target picker.
 * @param {Mut} settlement
 * @param {string|null|undefined} collectionKey
 * @returns {Array<{id: string, name: string}>}
 */
export function buildTargetOptions(settlement, collectionKey) {
  if (!collectionKey || !settlement) return [];
  let list;
  switch (collectionKey) {
    case 'institutions': list = settlement.institutions || []; break;
    case 'npcs':         list = settlement.npcs || []; break;
    case 'factions':     list = settlement.powerStructure?.factions || []; break;
    case 'neighbours':   {
      const net = settlement.neighbourNetwork || settlement.neighbourLinks || [];
      list = net.map((/** @type {Mut} */ l) => ({ id: l.name || l.neighbourName || l.id, name: l.name || l.neighbourName || l.id }));
      break;
    }
    case 'resources':    {
      const fromConfig = (settlement.config?.nearbyResources || []).map((/** @type {Mut} */ k) => ({ id: k, name: k }));
      const fromList   = (settlement.resources || []).map((/** @type {Mut} */ r) => ({
        id: r.id || r.key || r.name,
        name: r.name || r.id || r.key,
      }));
      list = [...fromList, ...fromConfig];
      break;
    }
    case 'stressors':    {
      list = canonStressors(settlement).filter(Boolean).map((/** @type {Mut} */ st) => ({
        id: st.type || st.name || st.label,
        name: st.label || st.name || st.type,
      }));
      break;
    }
    case 'tradeGoods':   {
      const ec = settlement.economicState || {};
      const labels = [
        ...canonExports(settlement),
        ...canonImports(settlement),
        ...(Array.isArray(ec.transit) ? ec.transit : []),
      ]
        .map((/** @type {Mut} */ e) => (typeof e === 'string' ? e : e?.name || e?.good || ''))
        .filter(Boolean);
      list = labels.map((/** @type {Mut} */ l) => ({ id: l, name: l }));
      break;
    }
    default: return [];
  }
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const id = item.id || item.faction || item.name;
    const name = item.faction || item.name || item.id;
    if (!id || !name) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id: String(id), name: String(name) });
  }
  return out;
}

// ── Shared gate readers (each wraps ONE sim function — never re-derives) ────

const impairedEntities = (/** @type {Mut} */ list) =>
  (list || []).filter((/** @type {Mut} */ e) =>
    (e?.impairments || []).length > 0 || e?.status === 'impaired' || e?.status === 'removed' || e?.status === 'destroyed');

const depletedKeys = (/** @type {Mut} */ s) => {
  const state = s?.config?.nearbyResourcesState || {};
  const dep = new Set((s?.config?.nearbyResourcesDepleted || []).map(String));
  for (const [k, v] of Object.entries(state)) if (v === 'depleted') dep.add(String(k));
  return dep;
};

const factionsOf = (/** @type {Mut} */ s) => s?.powerStructure?.factions || s?.factions || [];

const npcSwapPairsExist = (/** @type {Mut} */ s) => {
  const byFaction = new Map();
  for (const npc of s?.npcs || []) {
    const f = npc?.factionAffiliation;
    if (!f || !npc?.name) continue;
    byFaction.set(f, (byFaction.get(f) || 0) + 1);
    if (byFaction.get(f) >= 2) return true;
  }
  return false;
};

/** The exact seat gate transferRulingPower runs: every faction EXCEPT the one
 *  already on the governing seat (wraps governingFactionOf — same-function law). */
const rulingPowerTargets = (/** @type {Mut} */ s) => {
  const governing = governingFactionOf(s);
  return factionsOf(s)
    .filter((/** @type {Mut} */ f) => f && f !== governing)
    .map((/** @type {Mut} */ f) => ({ id: String(f.faction || f.name || ''), name: String(f.faction || f.name || '') }))
    .filter((/** @type {Mut} */ o) => o.id);
};

/** Criminal organizations the corruption verbs can link to — the ONE wrap over
 *  readCorruptionClimate (replaces the composer's comment-mirror filter). */
export const criminalOrgOptions = (/** @type {Mut} */ s) => readCorruptionClimate(s).criminalInstitutions;

// ── The generosity verbs' gate readers (FP-G3 — same-function law) ──────────
/** Linked neighbours whose relationship KIND passes the §0.1 structural gate —
 *  the SAME qualifiesForGenerosity the forceRelief/offerCredit handlers (and the
 *  organic mover) run, over the SAME link fields the handlers match. */
const qualifyingNeighbourOptions = (/** @type {Mut} */ s) => {
  const seen = new Set();
  const out = [];
  for (const link of s?.neighbourNetwork || []) {
    const kind = normalizeBondKind(link?.relationshipType);
    if (!qualifiesForGenerosity({ bond: { kind, strength01: 1 } })) continue;
    const id = String(link?.name || link?.neighbourName || link?.id || '');
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({ id, name: id });
  }
  return out;
};
/** Months of grain above the mover's hard reserve floor — the spareable surplus a
 *  decree may move (the SAME STOCKPILE_TUNING floor the mover honours). */
const spareableMonthsOf = (/** @type {Mut} */ s) => {
  const months = Number(s?.economicState?.foodSecurity?.storageMonths);
  const floor = Number(STOCKPILE_TUNING.reserveTitheFloorMonths) || 1;
  return Number.isFinite(months) ? Math.max(0, months - floor) : 0;
};
/** The shared FORCE_RELIEF / OFFER_CREDIT availability gate (§0.1 + the floor). */
const generosityVerbPredicate = (/** @type {Mut} */ s) => {
  if (!qualifyingNeighbourOptions(s).length) {
    return no(['No allied, trade-partner, or vassal/patron neighbour to send grain to.'],
      ['Broker an alliance or open a trade route first — generosity needs a qualifying bond (design law 1).']);
  }
  // The tenth-month flooring means anything under 0.1 spareable months moves ZERO grain.
  return gate(spareableMonthsOf(s) >= 0.1,
    'The granary holds nothing above the reserve floor.',
    'Only grain above the hard reserve floor can be sent.');
};

/** Compromised entities EXPOSE_CORRUPTION can act on (§3 current-state filter):
 *  corrupt NPCs (the rich path) + institutions/factions carrying a
 *  corruption-typed impairment (the scandal path has teeth only there). */
const compromisedTargets = (/** @type {Mut} */ s) => {
  const out = [];
  for (const n of s?.npcs || []) {
    if (n?.corrupt) out.push({ id: String(n.id || n.name), name: String(n.name || n.id) });
  }
  const marked = (/** @type {Mut} */ e) => (e?.impairments || []).some((/** @type {Mut} */ i) => i?.type === 'corruption');
  for (const i of s?.institutions || []) if (marked(i)) out.push({ id: String(i.id || i.name), name: String(i.name || i.id) });
  for (const f of factionsOf(s)) if (marked(f)) out.push({ id: String(f.id || f.faction || f.name), name: String(f.faction || f.name || f.id) });
  return out;
};

const ok = () => ({ available: true, reasons: [], unlocks: [] });
/** @param {string[]} reasons @param {string[]} [unlocks] */
const no = (reasons, unlocks = []) => ({ available: false, reasons, unlocks });
/** @param {boolean} cond @param {string} reason @param {string} [unlock] */
const gate = (cond, reason, unlock) => (cond ? ok() : no([reason], unlock ? [unlock] : []));

// ── Dial-schema shorthand (§3: enum / band / range / target / toggle) ───────

const severityBandDial = (/** @type {string} */ key = 'severity') => ({
  key, kind: 'band', bandWords: STRESSOR_SEVERITY_VALUES, default: 'moderate',
  min: 0, max: 1, clampAtCommit: true, label: 'Severity',
});
/** @param {string} key @param {string[]} options @param {string} def @param {string} label */
const enumDial = (key, options, def, label) => ({ key, kind: 'enum', options, default: def, clampAtCommit: true, label });
/** @param {string} key @param {boolean} def @param {string} label */
const toggleDial = (key, def, label) => ({ key, kind: 'toggle', default: def, clampAtCommit: true, label });
/** @param {string} key @param {string} from @param {string} label */
const targetDial = (key, from, label) => ({ key, kind: 'target', targetsFrom: from, clampAtCommit: true, label });

// ── The manifest ─────────────────────────────────────────────────────────────
// Entry shape: { type, label, family, scope, authority, targetsFrom,
//   entityKind?, dials, predicate(settlement, ctx), coversVetoCodes,
//   targetOptions?(settlement), foldedInto? }.
// `authority` is the authorityFor class this verb routes under; every W1
// settlement verb is DM-authored directly ('dm_direct') — W-COMPOSER-2's realm
// verbs carry their real changeAuthorityPolicy families here.
// EXECUTION RESTRAINT (§9): ≤3-4 visible dials per verb; word bands over raw
// numbers; target pickers do not count against the dial budget.

const entry = (/** @type {Mut} */ e) => Object.freeze({
  scope: 'settlement',
  authority: 'dm_direct',
  targetsFrom: /** @type {Record<string, string|null>} */ (TARGET_ENTITY_BY_EVENT)[e.type] ?? null,
  dials: [],
  coversVetoCodes: [],
  label: EVENT_REGISTRY[e.type]?.label || e.type,
  ...e,
});

export const AFFORDANCE_MANIFEST = Object.freeze({
  // ── Economy ────────────────────────────────────────────────────────────
  ADD_INSTITUTION: entry({
    type: 'ADD_INSTITUTION', family: 'Economy', entityKind: 'settlement',
    predicate: () => ok(),
  }),
  REMOVE_INSTITUTION: entry({
    type: 'REMOVE_INSTITUTION', family: 'Economy',
    coversVetoCodes: ['institution_not_found'],
    predicate: (/** @type {Mut} */ s) => gate((s?.institutions || []).length > 0,
      'No institutions to remove.', 'Add an institution first.'),
  }),
  IMPAIR_INSTITUTION: entry({
    type: 'IMPAIR_INSTITUTION', family: 'Economy',
    coversVetoCodes: ['institution_not_found'],
    predicate: (/** @type {Mut} */ s) => gate((s?.institutions || []).length > 0,
      'No institutions to impair.', 'Add an institution first.'),
  }),
  RESTORE_INSTITUTION: entry({
    type: 'RESTORE_INSTITUTION', family: 'Economy',
    coversVetoCodes: ['institution_not_found'],
    targetOptions: (/** @type {Mut} */ s) => buildTargetOptions(s, 'institutions')
      .filter(o => impairedEntities(s?.institutions).some((/** @type {Mut} */ e) => String(e.id || e.name) === o.id || String(e.name) === o.name)),
    predicate: (/** @type {Mut} */ s) => gate(impairedEntities(s?.institutions).length > 0,
      'No institution is impaired.', 'Only a wounded institution can recover.'),
  }),
  DEPLETE_RESOURCE: entry({
    type: 'DEPLETE_RESOURCE', family: 'Economy',
    coversVetoCodes: ['empty_target'],
    targetOptions: (/** @type {Mut} */ s) => {
      const dep = depletedKeys(s);
      return buildTargetOptions(s, 'resources').filter(o => !dep.has(o.id));
    },
    predicate(/** @type {Mut} */ s) {
      const dep = depletedKeys(s);
      return gate(buildTargetOptions(s, 'resources').some(o => !dep.has(o.id)),
        'Every worked resource is already depleted.', 'Add or recover a resource first.');
    },
  }),
  RECOVERED_RESOURCE: entry({
    type: 'RECOVERED_RESOURCE', family: 'Economy',
    coversVetoCodes: ['empty_target'],
    targetOptions: (/** @type {Mut} */ s) => {
      const dep = depletedKeys(s);
      return buildTargetOptions(s, 'resources').filter(o => dep.has(o.id));
    },
    predicate: (/** @type {Mut} */ s) => gate(depletedKeys(s).size > 0,
      'No resource is depleted.', 'Only a depleted resource can be recovered.'),
  }),
  ADD_RESOURCE: entry({
    type: 'ADD_RESOURCE', family: 'Economy', entityKind: 'settlement',
    coversVetoCodes: ['empty_target'],
    predicate: () => ok(),
  }),
  REMOVE_RESOURCE: entry({
    type: 'REMOVE_RESOURCE', family: 'Economy',
    coversVetoCodes: ['resource_not_found'],
    predicate: (/** @type {Mut} */ s) => gate((s?.config?.nearbyResources || []).length > 0,
      'No worked resource to remove.'),
  }),
  ADD_TRADE_GOOD: entry({
    type: 'ADD_TRADE_GOOD', family: 'Economy', entityKind: 'settlement',
    coversVetoCodes: ['trade_good_already_present'],
    dials: [
      enumDial('direction', ['export', 'import'], 'export', 'Direction'),
      toggleDial('entrepot', false, 'Transit through the warehouses'),
    ],
    predicate: () => ok(),
  }),
  REMOVE_TRADE_GOOD: entry({
    type: 'REMOVE_TRADE_GOOD', family: 'Economy',
    coversVetoCodes: ['trade_good_not_found'],
    predicate: (/** @type {Mut} */ s) => gate(buildTargetOptions(s, 'tradeGoods').length > 0,
      'No goods move through the settlement\'s markets.', 'Add a trade good first.'),
  }),

  // ── People ─────────────────────────────────────────────────────────────
  ADD_NPC: entry({
    type: 'ADD_NPC', family: 'People', entityKind: 'settlement',
    dials: [enumDial('importance', ['minor', 'notable', 'key', 'pillar'], 'notable', 'Importance')],
    predicate: () => ok(),
  }),
  KILL_NPC: entry({
    type: 'KILL_NPC', family: 'People',
    coversVetoCodes: ['npc_not_found'],
    predicate: (/** @type {Mut} */ s) => gate((s?.npcs || []).length > 0, 'No NPCs to remove.'),
  }),
  ASSIGN_NPC_TO_ROLE: entry({
    type: 'ASSIGN_NPC_TO_ROLE', family: 'People',
    dials: [enumDial('quality', ['weak', 'competent', 'popular', 'corrupt', 'faction_captured'], 'competent', 'Quality')],
    predicate: () => ok(), // creates the NPC when missing — never gated
  }),
  PROMOTE_NPC: entry({
    type: 'PROMOTE_NPC', family: 'People', entityKind: 'npcs',
    coversVetoCodes: ['swap_pair_incomplete', 'swap_pair_invalid', 'swap_cross_faction'],
    predicate: (/** @type {Mut} */ s) => gate(npcSwapPairsExist(s),
      'No faction has two members to swap standing.', 'Needs a faction with two seated members.'),
  }),

  // ── Power ──────────────────────────────────────────────────────────────
  ADD_FACTION: entry({
    type: 'ADD_FACTION', family: 'Power', entityKind: 'settlement',
    coversVetoCodes: ['empty_target'],
    predicate: () => ok(),
  }),
  IMPAIR_FACTION: entry({
    type: 'IMPAIR_FACTION', family: 'Power',
    coversVetoCodes: ['faction_not_found'],
    predicate: (/** @type {Mut} */ s) => gate(factionsOf(s).length > 0, 'No factions to impair.'),
  }),
  RESTORE_FACTION: entry({
    type: 'RESTORE_FACTION', family: 'Power',
    coversVetoCodes: ['faction_not_found'],
    targetOptions: (/** @type {Mut} */ s) => buildTargetOptions(s, 'factions')
      .filter(o => impairedEntities(factionsOf(s)).some((/** @type {Mut} */ e) =>
        String(e.id || e.faction || e.name) === o.id || String(e.faction || e.name) === o.name)),
    predicate: (/** @type {Mut} */ s) => gate(impairedEntities(factionsOf(s)).length > 0,
      'No faction is impaired.', 'Only a wounded faction can recover.'),
  }),
  CHANGE_RULING_POWER: entry({
    type: 'CHANGE_RULING_POWER', family: 'Power', targetsFrom: 'factions',
    coversVetoCodes: ['power_faction_not_found', 'power_already_governing', 'power_no_governing_faction'],
    dials: [enumDial('cause', [...RULING_POWER_CAUSES], 'coup', 'How power changes hands')],
    // The exact seat gate transferRulingPower runs: a governing faction must
    // exist, and only a DIFFERENT faction can take the seat.
    targetOptions: rulingPowerTargets,
    predicate(/** @type {Mut} */ s) {
      const governing = governingFactionOf(s);
      if (!governing) return no(['No faction currently holds the governing seat.'], ['Seat a governing faction first.']);
      return gate(rulingPowerTargets(s).length > 0,
        'No other faction can take the seat.', 'Add a second faction first.');
    },
  }),
  EXPOSE_CORRUPTION: entry({
    type: 'EXPOSE_CORRUPTION', family: 'Power',
    coversVetoCodes: ['target_not_found'],
    // §3: the target dial lists only actually-compromised entities.
    targetOptions: (/** @type {Mut} */ s) => compromisedTargets(s),
    predicate: (/** @type {Mut} */ s) => gate(compromisedTargets(s).length > 0,
      'Nothing here is compromised.', 'Impose corruption first — or let the rot spread on its own.'),
  }),
  IMPOSE_CORRUPTION: entry({
    type: 'IMPOSE_CORRUPTION', family: 'Power',
    // no_beneficiary — W-DOCTRINE-3b §6: a FOREIGN-kind composer leash whose endpoint (settlement
    // id / faction) does not resolve. The channel requirement's veto, replacing no_criminal_org
    // for the foreign path. (The verb stays settlement-scoped + walker-legal.)
    coversVetoCodes: ['npc_not_found', 'npc_already_corrupt', 'no_criminal_org', 'no_beneficiary'],
    dials: [enumDial('scope', ['individual', 'individual_institution'], 'individual', 'How far the rot reaches')],
    targetOptions: (/** @type {Mut} */ s) => buildTargetOptions(s, 'npcs')
      .filter(o => !(s?.npcs || []).find((/** @type {Mut} */ n) => String(n.id || n.name) === o.id)?.corrupt),
    predicate(/** @type {Mut} */ s) {
      // The SAME climate read the imposeCorruption handler runs.
      const climate = readCorruptionClimate(s);
      const cleanNpc = (s?.npcs || []).some((/** @type {Mut} */ n) => n?.name && !n.corrupt);
      if (!climate.criminalInstitutions.length) {
        return no(['No criminal organization operates here.'], ['Requires a criminal organization (add one, e.g. a Thieves\' Guild).']);
      }
      return gate(cleanNpc, 'Every named NPC is already compromised.', 'Add a clean NPC first.');
    },
  }),
  DESTROY_SETTLEMENT: entry({
    type: 'DESTROY_SETTLEMENT', family: 'Realm', entityKind: 'settlement',
    predicate: (/** @type {Mut} */ s) => gate(s?.status !== 'destroyed', 'The settlement is already destroyed.'),
  }),
  SHIFT_TIER: entry({
    type: 'SHIFT_TIER', family: 'Realm', entityKind: 'settlement',
    coversVetoCodes: ['tier_unknown', 'tier_at_bound'],
    // The legal moves — the same TIER_ORDER walk clampTierDirection/shiftTier run.
    dials: [enumDial('direction', ['promotion', 'demotion'], 'promotion', 'Direction')],
    predicate(/** @type {Mut} */ s) {
      const tier = s?.tier || s?.config?.tier || popToTier(Number(s?.population) || 0);
      const idx = TIER_ORDER.indexOf(tier);
      return gate(idx >= 0, `The settlement's tier ("${tier}") is not on the tier ladder.`);
    },
  }),

  // ── Faith ──────────────────────────────────────────────────────────────
  SET_PRIMARY_DEITY: entry({
    type: 'SET_PRIMARY_DEITY', family: 'Faith', entityKind: 'settlement',
    predicate: (/** @type {Mut} */ s, /** @type {Mut} */ ctx) =>
      ctx?.canUseCustom === false
        ? no(['Deities come from your custom Compendium.'], ['Requires premium custom content.'])
        : ok(),
  }),
  IMPOSE_CULT: entry({
    type: 'IMPOSE_CULT', family: 'Faith', entityKind: 'settlement',
    coversVetoCodes: ['cult_invalid', 'cult_is_patron', 'cult_no_cult_slots'],
    predicate(/** @type {Mut} */ s, /** @type {Mut} */ ctx) {
      if (ctx?.canUseCustom === false) {
        return no(['Deities come from your custom Compendium.'], ['Requires premium custom content.']);
      }
      // The SAME placement probe imposeCult runs, with a niche-neutral test
      // deity: refused ⇒ no cult slot exists at this tier.
      const config = s?.config || {};
      const probe = reconcileCultImposition({
        patron: config.primaryDeitySnapshot || null,
        cults: Array.isArray(config.cultDeitySnapshots) ? config.cultDeitySnapshots : [],
        tier: s?.tier || config.tier || 'village',
        deity: { _deityRef: '__probe__', name: '__probe__' },
      });
      return gate(probe.action !== 'refused' || probe.reason !== 'no_cult_slots',
        'No cult slot at this settlement tier.', 'A larger settlement hosts more deities.');
    },
  }),

  // ── War (authored crises) ──────────────────────────────────────────────
  APPLY_STRESSOR: entry({
    type: 'APPLY_STRESSOR', family: 'War', targetsFrom: 'stressors', entityKind: 'settlement',
    dials: [
      severityBandDial(),
      targetDial('instigatorNeighbour', 'neighbours', 'Instigating neighbour'),
      enumDial('instigatorRelationship', ['rival', 'cold_war', 'hostile'], 'rival', 'Souring to'),
    ],
    predicate: () => ok(),
  }),
  RESOLVE_STRESSOR: entry({
    type: 'RESOLVE_STRESSOR', family: 'War',
    coversVetoCodes: ['stressor_not_found', 'threat_not_found'],
    predicate: (/** @type {Mut} */ s) => gate(canonStressors(s).filter(Boolean).length > 0
      || deriveAllActiveConditions(s).length > 0,
      'No active crisis to resolve.'),
  }),

  // ── Relations ──────────────────────────────────────────────────────────
  SETTLEMENT_DISPUTE: entry({
    type: 'SETTLEMENT_DISPUTE', family: 'Relations',
    coversVetoCodes: ['empty_target'],
    dials: [enumDial('relationshipType', [...RELATIONSHIP_OPTIONS.SETTLEMENT_DISPUTE], 'neutral', 'New relationship')],
    predicate: (/** @type {Mut} */ s) => gate(buildTargetOptions(s, 'neighbours').length > 0,
      'No linked neighbours.', 'Link a neighbour first.'),
  }),
  BROKERED_ALLIANCE: entry({
    type: 'BROKERED_ALLIANCE', family: 'Relations',
    // relationshipType is FIXED ('allied') — a one-option enum is not a dial.
    predicate: (/** @type {Mut} */ s) => gate(buildTargetOptions(s, 'neighbours').length > 0,
      'No linked neighbours.', 'Link a neighbour first.'),
  }),
  OPENED_TRADE_ROUTE: entry({
    type: 'OPENED_TRADE_ROUTE', family: 'Relations',
    dials: [enumDial('relationshipType', [...RELATIONSHIP_OPTIONS.OPENED_TRADE_ROUTE], 'allied', 'New relationship')],
    predicate: (/** @type {Mut} */ s, /** @type {Mut} */ ctx) =>
      gate(buildTargetOptions(s, 'neighbours').length > 0 || (ctx?.campaignPeerCount || 0) > 0,
        'No linked neighbours or campaign peers.', 'Link a neighbour or add a campaign member.'),
  }),

  // ── The generosity counterpart verbs (FP-G3 — the Counterpart Criterion) ──
  // The DM-forceable twins of the generosity engine's grain instruments. SAME-
  // FUNCTION predicates: qualifiesForGenerosity (the §0.1 structural gate the
  // handler and the mover both run) + the mover's own STOCKPILE_TUNING reserve
  // floor. The target dial lists only qualifying neighbours (§3 current-state
  // filter); the magnitude dial is word-banded (≤4 dials, clampAtCommit).
  FORCE_RELIEF: entry({
    type: 'FORCE_RELIEF', family: 'Relations',
    coversVetoCodes: ['empty_target', 'neighbour_not_linked', 'relief_unqualified', 'relief_nothing_to_send'],
    dials: [{
      key: 'magnitude', kind: 'band', bandWords: RELIEF_MAGNITUDE_VALUES, default: 'measured',
      min: 0, max: 1, clampAtCommit: true, label: 'Magnitude',
    }],
    targetOptions: qualifyingNeighbourOptions,
    predicate: generosityVerbPredicate,
  }),
  // Directive 3 — the DM charters a road to ANOTHER SAVE, so its target roster is
  // cross-settlement and this settlement object simply cannot see it (targetsFrom
  // stays null; the composer supplies the roster the way the neighbour-link idiom
  // already does). The real legality gate is therefore deliberately NOT duplicated
  // here as a half-informed guess: domain/roads/userRoutes.js validateUserRoute is
  // the ONE gate, and the picker and the command runtime both run it. A permissive
  // predicate that admits a verb the shared gate then judges is honest; a
  // restrictive one written against data this layer lacks would only be wrong.
  CREATE_ROUTE: entry({
    type: 'CREATE_ROUTE', family: 'Relations', entityKind: 'settlement',
    coversVetoCodes: [
      'route_endpoints_incomplete',
      'route_mode_unsupported',
      'route_identity_mismatch',
    ],
    predicate: () => ok(),
  }),
  OFFER_CREDIT: entry({
    type: 'OFFER_CREDIT', family: 'Relations',
    coversVetoCodes: ['credit_unqualified', 'credit_nothing_to_lend'],
    dials: [{
      key: 'magnitude', kind: 'band', bandWords: RELIEF_MAGNITUDE_VALUES, default: 'measured',
      min: 0, max: 1, clampAtCommit: true, label: 'Magnitude',
    }],
    targetOptions: qualifyingNeighbourOptions,
    predicate: generosityVerbPredicate,
  }),

  // ── Folded types (§2: the fold is legible — each names its carrying verb) ──
  KILL_LEADER: entry({
    type: 'KILL_LEADER', family: 'People',
    foldedInto: { via: 'KILL_NPC', note: 'A leader\'s death is authored as Kill / remove NPC — the consequences derive from the NPC\'s own pillar standing.' },
    predicate: () => no(['Folded into Kill / remove NPC.']),
  }),
  CUT_TRADE_ROUTE: entry({
    type: 'CUT_TRADE_ROUTE', family: 'Relations',
    foldedInto: { via: 'SETTLEMENT_DISPUTE', note: 'A severed route is authored as Settlement dispute — pick the neighbour and sour the relationship.' },
    predicate: () => no(['Folded into Settlement dispute.']),
  }),
  DAMAGE_INSTITUTION: entry({
    type: 'DAMAGE_INSTITUTION', family: 'Economy',
    foldedInto: { via: 'IMPAIR_INSTITUTION', note: 'Damage is authored as Impair institution (the single "weaken it" action).' },
    predicate: () => no(['Folded into Impair institution.']),
  }),
  DEMOTE_NPC: entry({
    type: 'DEMOTE_NPC', family: 'People',
    foldedInto: { via: 'PROMOTE_NPC', note: 'A demotion IS the merged Promote/Demote standing swap — a promote of A is a demote of B.' },
    predicate: () => no(['Folded into Promote/Demote NPC.']),
  }),
  REFUGEE_WAVE: entry({
    type: 'REFUGEE_WAVE', family: 'War',
    foldedInto: { via: 'APPLY_STRESSOR', note: 'A refugee wave arrives via Apply stressor (migration pressure).' },
    predicate: () => no(['Folded into Apply stressor.']),
  }),
  PLAGUE: entry({
    type: 'PLAGUE', family: 'War',
    foldedInto: { via: 'APPLY_STRESSOR', note: 'PLAGUE arrives via Apply stressor (plague) — one fiction, one roaming stressor.' },
    predicate: () => no(['Folded into Apply stressor.']),
  }),
  RAID_OR_MONSTER_ATTACK: entry({
    type: 'RAID_OR_MONSTER_ATTACK', family: 'War',
    foldedInto: { via: 'APPLY_STRESSOR', note: 'A raid is authored as Apply stressor (raiders / monster threat).' },
    predicate: () => no(['Folded into Apply stressor.']),
  }),
  REMOVED_THREAT: entry({
    type: 'REMOVED_THREAT', family: 'War',
    foldedInto: { via: 'RESOLVE_STRESSOR', note: 'Neutralizing a threat is authored as Remove stressor on the live crisis.' },
    predicate: () => no(['Folded into Remove stressor.']),
  }),
  STARTED_RIOT: entry({
    type: 'STARTED_RIOT', family: 'War',
    foldedInto: { via: 'APPLY_STRESSOR', note: 'A riot is authored as Apply stressor (unrest) — the aftermath condition follows.' },
    predicate: () => no(['Folded into Apply stressor.']),
  }),
});

// ── Veto prose (Composer V2 §2 — the refusal TEACHES) ───────────────────────
// The handler-veto channel carries only { code, detail } (eager bytes are
// constitutional); the DM-facing sentences live HERE, on the lazy side. Keyed
// by the exact codes the predicate-parity walker enumerates.
/** @type {Record<string, (d: string) => string>} */
const VETO_PROSE = {
  institution_not_found: d => `No institution "${d}" is here to act on.`,
  faction_not_found: d => `No faction "${d}" is here to act on.`,
  npc_not_found: d => `No NPC "${d}" is here to act on.`,
  target_not_found: d => `No corrupt NPC, faction, or institution "${d}" to expose.`,
  npc_already_corrupt: d => `${d || 'That NPC'} is already compromised.`,
  no_criminal_org: () => 'No criminal organization operates here to link the NPC to.',
  swap_pair_incomplete: () => 'The standing swap needs both an NPC and a counterpart.',
  swap_pair_invalid: () => 'The standing swap needs two distinct NPCs that exist here.',
  swap_cross_faction: d => `${d || 'The pair'} belong to different factions — standing swaps stay inside one faction.`,
  cult_invalid: () => 'The cult names no deity.',
  cult_is_patron: d => `${d || 'That deity'} already holds the patron seat — a patron cannot also be a cult.`,
  cult_no_cult_slots: () => 'No cult slot at this settlement tier.',
  tier_unknown: d => `The settlement's tier ("${d}") is not on the tier ladder.`,
  tier_at_bound: d => d === 'promotion'
    ? 'Already at the metropolis cap — no promotion possible.'
    : 'Already at the thorp floor — no demotion possible.',
  empty_target: () => 'This change needs a target.',
  threat_not_found: d => `No active threat "${d}" to neutralize.`,
  neighbour_not_linked: d => `"${d}" is not a linked neighbour of this settlement.`,
  stressor_not_found: d => `No active crisis "${d}" to resolve.`,
  trade_good_already_present: d => `${d} already moves through the settlement's markets.`,
  trade_good_not_found: d => `No trade good "${d}" moves through the settlement's markets.`,
  resource_not_found: d => `"${d}" is not a worked resource here.`,
  power_faction_not_found: d => `No faction "${d}" to hand power to.`,
  power_already_governing: d => `${d || 'That faction'} already holds power here.`,
  power_no_governing_faction: () => 'No faction currently holds the governing seat to transfer from.',
  relief_unqualified: d => `${d || 'That neighbour'} holds no qualifying bond — grain relief needs an ally, trade partner, or vassal/patron (a decree overrides the willingness, never the law).`,
  relief_nothing_to_send: () => 'The granary holds nothing above the reserve floor — no grain can be decreed away.',
  credit_unqualified: d => `${d || 'That neighbour'} holds no qualifying bond — grain credit needs an ally, trade partner, or vassal/patron.`,
  credit_nothing_to_lend: () => 'The granary holds nothing above the reserve floor — there is nothing to lend.',
};

/** The DM-facing refusal sentence for a veto warning. Falls back to the terse
 *  eager message shape for unknown codes (fail-open on prose, never on law).
 * @param {string|null|undefined} code
 * @param {string} [detail]
 * @returns {string}
 */
export function vetoProse(code, detail = '') {
  const f = VETO_PROSE[String(code || '')];
  return f ? f(String(detail || '')) : `The change was refused (${code}${detail ? `: ${detail}` : ''}).`;
}

/** Verb families for the browse rail, in display order. */
export const VERB_FAMILIES = Object.freeze(['Economy', 'People', 'Power', 'Faith', 'War', 'Relations', 'Realm']);

/** The authorable manifest entries (no folds), in registry order. */
export function authorableVerbs() {
  const m = /** @type {Record<string, Mut>} */ (AFFORDANCE_MANIFEST);
  return EVENT_TYPES.filter(t => m[t] && !m[t].foldedInto).map(t => m[t]);
}

/**
 * TARGET-FIRST NAVIGATION (§4): the inversion of targetsFrom — entity kind →
 * the verbs legal against it. `entityKind` covers entity-centric verbs whose
 * target field is a custom picker (PROMOTE_NPC) and settlement-scoped verbs.
 * @param {string} kind
 */
export function verbsForEntityKind(kind) {
  return authorableVerbs().filter(v => v.targetsFrom === kind || v.entityKind === kind);
}

/** Every entity kind target-first navigation offers, in display order. */
export const ENTITY_KINDS = Object.freeze([
  'settlement', 'institutions', 'npcs', 'factions', 'neighbours', 'resources', 'stressors', 'tradeGoods',
]);

/**
 * THE PRESSURES RAIL (§4): the situation speaks first — active conditions
 * surface the verbs they make relevant. Derived from the activeConditions
 * read-model (severity-ranked); capped at `cap` (≤3 by design law).
 * @param {Mut} settlement
 * @param {number} [cap]
 * @returns {Array<{ type: string, reason: string, targetId: string|null }>}
 */
export function pressureSuggestions(settlement, cap = 3) {
  const conditions = deriveAllActiveConditions(settlement)
    .sort((/** @type {Mut} */ a, /** @type {Mut} */ b) => (b.severity || 0) - (a.severity || 0));
  /** @type {Array<{ type: string, reason: string, targetId: string|null }>} */
  const out = [];
  const seen = new Set();
  const push = (/** @type {string} */ type, /** @type {string} */ reason, /** @type {string|null} */ targetId = null) => {
    const key = `${type}:${targetId || ''}`;
    if (seen.has(key) || out.length >= cap) return;
    const v = /** @type {Record<string, Mut>} */ (AFFORDANCE_MANIFEST)[type];
    if (!v || v.foldedInto || !v.predicate(settlement, {}).available) return;
    seen.add(key);
    out.push({ type, reason, targetId });
  };
  for (const c of conditions) {
    if (out.length >= cap) break;
    const label = c.label || c.archetype;
    switch (c.archetype) {
      case 'plague':
      case 'regional_migration_pressure':
      case 'stressor_residual':
      case 'trade_route_cut':
        push('RESOLVE_STRESSOR', `${label} grips the settlement — wind it down.`, c.triggeredAt?.sourceEventTargetId || null);
        break;
      case 'corruption_exposed':
        push('CHANGE_RULING_POWER', `${label}: the scandal opens the seat to a challenger.`);
        break;
      case 'food_anchor_lost':
        push('RESTORE_INSTITUTION', `${label}: restore the broken anchor.`, c.triggeredAt?.sourceEventTargetId || null);
        break;
      case 'government_overthrown':
        push('IMPAIR_FACTION', `${label}: the old power still has partisans to squeeze.`);
        break;
      case 'siege_lifted':
        push('BROKERED_ALLIANCE', `${label}: relief won — bind the friendship.`);
        break;
      default:
        push('RESOLVE_STRESSOR', `${label} weighs on the settlement.`, c.triggeredAt?.sourceEventTargetId || null);
        break;
    }
  }
  // Quiet town: suggest the corruption seam when a criminal org operates.
  if (out.length < cap && readCorruptionClimate(settlement).hasCriminalInst) {
    push('IMPOSE_CORRUPTION', 'A criminal organization operates here — someone can be turned.');
  }
  return out;
}

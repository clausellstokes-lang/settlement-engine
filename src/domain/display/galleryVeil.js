/**
 * domain/display/galleryVeil.js — THE GALLERY VEIL (RULINGS-CROSS X-21, X-21b, X-21c, X-21d).
 *
 * The owner: "The DM can choose exactly which sentences or boxes or grouping are hidden
 * explicitly." This module is the veil's FOUNDATION, pure and headless: the address
 * grammar, the one default set, the resolver, and the projection. The curate UI that
 * writes deltas is a later lane (W2-VEIL-B); nothing here renders.
 *
 * NOT the civility veil. publicSafe.js `veilPublicPayload` masks flagged words in text;
 * this module REMOVES addressed facts from a public projection. Two different seams.
 *
 * ── THE ADDRESS GRAMMAR (the unit of hiding is an address, never text) ─────────────
 *   tab:<tabId>                    a grouping: a dossier tab (`tab:plot_hooks`)
 *   block:<position>               a grouping: a registered block/mount position
 *                                  (`block:defense.criminalStructure`)
 *   card:<kind>:<id>               a box. EXISTENCE IS PUBLIC (X-21b): a card is never
 *                                  hidden whole. A card-level DELTA is read as "every
 *                                  depth field of this card" and expands into field
 *                                  addresses; the card address itself never enters the
 *                                  hidden set, and the card's identity fields stay.
 *   field:<kind>:<id>:<field>      a sentence: one depth fact at its one home
 *   class:<kind>:<field>           a field-class master switch ("Secrets: hidden for
 *                                  everyone"); per-card field eyes are its exceptions
 *
 * ── THE IDENTITY FLOOR (never hidden; asserted, not hoped) ──────────────────────────
 * The settlement's own name, tier, population, config (culture, terrain: what the
 * place passage is composed from) and every card's identity fields (CARD_KINDS[k].floor)
 * have no address. `isHideable` refuses them, `resolveVeil` drops them, and `applyVeil`
 * never deletes them even if a malformed set names them.
 *
 * ── THE VEIL ONLY REMOVES (X-21 (d)) ────────────────────────────────────────────────
 * `applyVeil` takes an ALREADY-PROJECTED public settlement (toPublicSafe's output) and
 * only deletes from it. It never reads a source record, so no veil entry, delta or
 * "shown" eye can put back a field the projection did not already carry. The existing
 * "Reveal DM content" switch (gallery_share_dm, and its per-member form revealDm) stays
 * the one door to DM-only content.
 *
 * ── STORAGE (U3; migrations are the owner's hand) ───────────────────────────────────
 * A share's veil is a DELTA LIST against `defaultVeilFor`, stored inside the existing
 * `gallery_member_overrides` jsonb object under the reserved key VEIL_OVERRIDE_KEY. The
 * column's only constraint is "is an object" (migration 092), and the server reader
 * (093 `_gallery_apply_member_overrides`) only ever reads `overrides -> <npc key>`, so the
 * reserved key is inert server-side. The existing per-NPC overrides fold in as card-level
 * deltas: `revealDm:false` reads as a card-level hide of that NPC, and a card-level hide
 * of an NPC is written back as `revealDm:false` (one mechanism, read both ways), so the
 * DM-depth half of it is ALREADY enforced by the server today.
 *
 * Pure; never mutates its inputs.
 */

import { galleryMemberKey } from './publicSafe.js';
import { deriveDefenseVulnerabilities } from './defenseDisplay.js';
import { entityIdFor, eventIdFor, slugifyEntity } from '../dossier/entityLinks.js';
import { facetOf } from '../spatial/cohesionWeave.js';
import { deepClone } from '../clone.js';
import { factionIdFromName } from '../../lib/entities.js';
import { brokerageLegalityOf } from '../../data/informationBrokerageTuning.js';

/** @typedef {Record<string, unknown>} Rec */
/** @typedef {{ address: string, hidden: boolean }} VeilDelta */
/** @typedef {{ address: string, cls: string, reason: string }} VeilDefault */
/**
 * @typedef {{
 *   lists: ReadonlyArray<ReadonlyArray<string>>,
 *   idOf: (card: Rec) => string,
 *   floor: ReadonlyArray<string>,
 *   fields: Readonly<Record<string, ReadonlyArray<string>>>,
 * }} CardKind
 */

/** The reserved key inside gallery_member_overrides that carries the veil's deltas. */
export const VEIL_OVERRIDE_KEY = '$veil';
/** The stored shape's version. */
export const VEIL_VERSION = 1;
/** Write-path bounds (a hand-crafted payload cannot bloat the row). */
export const VEIL_MAX_DELTAS = 2000;
const ADDRESS_MAX = 300;

/** @param {unknown} v @returns {v is Rec} */
function isRec(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/** @param {unknown} v @returns {Rec[]} */
function recs(v) {
  return Array.isArray(v) ? v.filter(isRec) : [];
}

/** @param {unknown} v @returns {string} */
function str(v) {
  return typeof v === 'string' ? v : '';
}

/**
 * Read a dotted path to an array of records.
 * @param {Rec} root @param {ReadonlyArray<string>} path @returns {Rec[]}
 */
function listAt(root, path) {
  /** @type {unknown} */
  let cur = root;
  for (const seg of path) {
    if (!isRec(cur)) return [];
    cur = cur[seg];
  }
  return recs(cur);
}

/** @param {Rec} card @param {string} prefix @param {...unknown} parts @returns {string} */
function ownIdOr(card, prefix, ...parts) {
  const own = str(card.id);
  if (own) return own;
  return `${prefix}.${slugifyEntity(parts.map(p => (Array.isArray(p) ? p.join('-') : str(p))).filter(Boolean).join('-'))}`;
}

// ── THE CARD KINDS ────────────────────────────────────────────────────────────────
// Where each kind's cards live in a settlement, the id the veil addresses them by (the
// entity index's own convention wherever the index has one), the IDENTITY FLOOR (no
// eye, X-21b), and the DEPTH EYES (X-21b's ladder) mapped to the data keys they remove.
// A field address whose eye is not in the table removes the literal key of that name,
// unless the key is on the floor. Virtual eyes (`services`, `people`) are handled in
// applyVeil because their rows live outside the card.

/** @type {Readonly<Record<string, CardKind>>} */
export const CARD_KINDS = Object.freeze({
  npc: {
    // npcs[] plus the faction-roster copies (factionGrouping embeds the same records).
    lists: [['npcs'], ['powerStructure', 'factions', '*', 'members'], ['factions', '*', 'members']],
    // The gallery member-override key, so a card delta and a revealDm override agree.
    idOf: (card) => galleryMemberKey(card),
    floor: ['id', 'name', 'role', 'title', 'category', 'gender', 'presentation',
      'factionAffiliation', 'secondaryAffiliation', 'influence'],
    fields: {
      personality: ['personality'],
      physical: ['physical'],
      goals: ['goal', 'goals', 'factionGoal'],
      constraint: ['activeConstraint'],
      whereabouts: ['whereabouts', 'location', 'currentLocation'],
      secret: ['secret'],
      ties: ['relationships', 'institution', 'linkedInstitutionIds', 'linkedFactionIds'],
      hooks: ['plotHooks'],
      corruption: ['corrupt', 'corruptionVector', 'corruptTies'],
    },
  },
  institution: {
    lists: [['institutions']],
    idOf: (card) => entityIdFor('institution', card),
    floor: ['id', 'name', 'category', 'priorityCategory', 'catalogId', 'tier'],
    fields: {
      description: ['desc', 'description'],
      // What the house does, as the catalog declares it: its tags, facets and brokerage
      // service keys. A clandestine house's front is its name; this is its function.
      function: ['tags', 'facets', 'serviceKeys'],
      services: [],
      people: [],
    },
  },
  faction: {
    lists: [['powerStructure', 'factions'], ['factions']],
    idOf: (card) => factionIdFromName(str(card.faction) || str(card.name)) || ownIdOr(card, 'faction', card.name),
    floor: ['id', 'faction', 'name', 'category', 'power', 'rawPower', 'powerLabel', 'isGoverning'],
    fields: {
      description: ['desc', 'description', 'crisisNote'],
      goals: ['goals', 'goal', 'agenda'],
      conflicts: ['conflicts'],
      members: ['members'],
      capture: ['captureState'],
    },
  },
  event: {
    lists: [['history', 'historicalEvents'], ['history', 'eventsTimeline']],
    idOf: (card) => eventIdFor(card) || ownIdOr(card, 'event', card.name),
    floor: ['id', 'name', 'title', 'type', 'templateType', 'yearsAgo', 'year', 'era', 'severity'],
    fields: {
      description: ['description', 'desc'],
      lastingEffects: ['lastingEffects'],
      hooks: ['plotHooks'],
    },
  },
  tension: {
    lists: [['history', 'currentTensions']],
    idOf: (card) => ownIdOr(card, 'tension', card.name || card.title || card.type),
    floor: ['id', 'name', 'title', 'type', 'factions', 'severity'],
    fields: {
      description: ['description', 'desc'],
      lastingEffects: ['lastingEffects'],
      hooks: ['plotHooks'],
    },
  },
  conflict: {
    lists: [['conflicts'], ['powerStructure', 'conflicts']],
    idOf: (card) => ownIdOr(card, 'conflict', card.parties, card.issue),
    floor: ['id', 'parties', 'issue', 'intensity'],
    fields: {
      stakes: ['stakes'],
      description: ['desc', 'description'],
      hooks: ['plotHooks'],
    },
  },
  relationship: {
    lists: [['relationships']],
    idOf: (card) => ownIdOr(card, 'relationship', card.npc1Id || card.npc1Name, card.npc2Id || card.npc2Name, card.type),
    floor: ['id', 'type', 'typeName', 'strength', 'npc1Id', 'npc2Id', 'npc1Name', 'npc2Name', 'npc1Role', 'npc2Role'],
    fields: {
      tension: ['tension'],
      description: ['description'],
      hooks: ['plotHooks'],
    },
  },
});

/** The settlement's own identity floor (X-21b): never hidden, by any address. */
export const SETTLEMENT_FLOOR = Object.freeze(['id', 'name', 'tier', 'population', 'config']);

/**
 * Every card of a kind in a settlement (all its lists; faction-roster copies included).
 * @param {Rec} s @param {string} kind @returns {Rec[]}
 */
function cardsOf(s, kind) {
  const k = CARD_KINDS[kind];
  if (!k) return [];
  /** @type {Rec[]} */
  const out = [];
  for (const path of k.lists) {
    const star = path.indexOf('*');
    if (star < 0) { out.push(...listAt(s, path)); continue; }
    for (const owner of listAt(s, path.slice(0, star))) out.push(...listAt(owner, path.slice(star + 1)));
  }
  return out;
}

// ── THE GROUPINGS ─────────────────────────────────────────────────────────────────
// Each registered tab/block names the data it removes. A grouping whose display is
// DERIVED from identity facts (Defense's criminal-structure label reads institution
// names; the first-survey label reads nothing) cannot be made absent by deletion
// alone, so the projection also carries the effective grouping list (`galleryVeil`)
// for the renderers. Grouping DEFAULTS are therefore emitted STATICALLY, never from the
// data: the list a visitor can read names only what every share hides, plus the DM's
// own choices, and never betrays that a town had a thieves' guild.

/** Every key, at any depth, that carries hook text (the PRIVATE_KEY_RE `hook` token). */
const HOOK_KEY_RE = /hook/i;

/** @param {unknown} v @returns {unknown} */
function dropHookKeys(v) {
  if (Array.isArray(v)) return v.map(dropHookKeys);
  if (!isRec(v)) return v;
  /** @type {Rec} */
  const out = {};
  for (const [k, c] of Object.entries(v)) {
    if (HOOK_KEY_RE.test(k)) continue;
    out[k] = dropHookKeys(c);
  }
  return out;
}

/** @param {Rec} s @param {string} key @returns {Rec|null} */
function recAt(s, key) {
  const v = s[key];
  return isRec(v) ? v : null;
}

/** @type {Readonly<Record<string, (s: Rec) => void>>} */
export const GROUPING_REMOVERS = Object.freeze({
  // X-21d: every plot hook. The tab's content IS the hook fields, wherever they sit.
  'tab:plot_hooks': (s) => {
    for (const k of Object.keys(s)) {
      if (SETTLEMENT_FLOOR.includes(k)) continue;
      if (HOOK_KEY_RE.test(k)) { delete s[k]; continue; }
      s[k] = dropHookKeys(s[k]);
    }
  },
  // X-21c: the criminal services category (classifier category `criminal`).
  'block:services.criminal': (s) => {
    const av = recAt(s, 'availableServices');
    if (av) delete av.criminal;
  },
  // X-21c: Defense's criminal architecture (DefenseTab CRIMINAL_MOUNT and the section's
  // safety-profile reads: criminalInstitutions, crimeTypes).
  'block:defense.criminalStructure': (s) => {
    const sp = recAt(recAt(s, 'economicState') || {}, 'safetyProfile');
    if (sp) { delete sp.criminalInstitutions; delete sp.crimeTypes; }
  },
  // X-21c: Power's capture reading (PowerTab UNDERSIDE_MOUNT: criminalCaptureState, the
  // per-faction and per-pair capture states, the black-market capture share).
  'block:power.criminalUnderside': (s) => {
    const ps = recAt(s, 'powerStructure');
    if (ps) {
      delete ps.criminalCaptureState;
      for (const f of recs(ps.factions)) delete f.captureState;
      for (const p of recs(ps.factionRelationships)) delete p.captureState;
    }
    const sp = recAt(recAt(s, 'economicState') || {}, 'safetyProfile');
    if (sp) delete sp.blackMarketCapture;
  },
  // X-21c: defense vulnerabilities (DefenseTab's Vulnerabilities section reads exactly
  // the rows deriveDefenseVulnerabilities selects; the same predicate removes them).
  'block:defense.vulnerabilities': (s) => {
    if (!Array.isArray(s.structuralViolations)) return;
    const vuln = new Set(deriveDefenseVulnerabilities({ structuralViolations: recs(s.structuralViolations) }));
    s.structuralViolations = s.structuralViolations.filter(r => !vuln.has(/** @type {Rec} */ (r)));
  },
  // X-21c: rumors' DM truth and war truth-vs-belief. Both are campaign-ledger reads gated
  // off public/player renders (RumorsTab/WarTab includeGroundTruth); the campaign is not
  // on the public allowlist, so there is no settlement data to remove. Marker only.
  'block:rumors.dmTruth': () => {},
  'block:war.truthVsBelief': () => {},
  // X-21c: engine housekeeping.
  'block:housekeeping.structuralIssues': (s) => { delete s.structuralViolations; delete s.structuralSuggestions; },
  'block:housekeeping.coherenceNotes': (s) => { delete s.coherenceNotes; },
  'block:housekeeping.firstSurvey': () => {},
  'block:housekeeping.receipt': (s) => { delete s.generationCoherenceReceipt; },
  'block:housekeeping.decrees': (s) => { delete s.decrees; delete s.dmLayer; },
});

// ── ADDRESSES ─────────────────────────────────────────────────────────────────────

/**
 * Parse an address. Returns null for anything outside the grammar.
 * @param {unknown} address
 * @returns {{ type: 'tab'|'block', id: string }
 *   | { type: 'card', kind: string, id: string }
 *   | { type: 'field', kind: string, id: string, field: string }
 *   | { type: 'class', kind: string, field: string } | null}
 */
export function parseVeilAddress(address) {
  if (typeof address !== 'string' || !address || address.length > ADDRESS_MAX) return null;
  const i = address.indexOf(':');
  if (i <= 0) return null;
  const head = address.slice(0, i);
  const rest = address.slice(i + 1);
  if (!rest) return null;
  if (head === 'tab' || head === 'block') return { type: head, id: rest };
  if (head === 'class') {
    const j = rest.indexOf(':');
    if (j <= 0 || j === rest.length - 1) return null;
    return { type: 'class', kind: rest.slice(0, j), field: rest.slice(j + 1) };
  }
  if (head === 'card' || head === 'field') {
    const j = rest.indexOf(':');
    if (j <= 0) return null;
    const kind = rest.slice(0, j);
    const tail = rest.slice(j + 1);
    if (!tail) return null;
    if (head === 'card') return { type: 'card', kind, id: tail };
    // The id may itself contain ':' — the field is the LAST segment.
    const k = tail.lastIndexOf(':');
    if (k <= 0 || k === tail.length - 1) return null;
    return { type: 'field', kind, id: tail.slice(0, k), field: tail.slice(k + 1) };
  }
  return null;
}

/**
 * May this address enter the hidden set? Groupings must be registered; card addresses
 * never (existence is public: a card-level DELTA expands to fields instead); field and
 * class addresses must name a known kind and a field off its identity floor.
 * @param {unknown} address
 * @returns {boolean}
 */
export function isHideable(address) {
  const p = parseVeilAddress(address);
  if (!p) return false;
  if (p.type === 'field' || p.type === 'class') {
    if (p.kind === 'settlement') return false;
    const kind = CARD_KINDS[p.kind];
    if (!kind) return false;
    if (kind.floor.includes(p.field)) return false;
    const keys = kind.fields[p.field];
    if (keys && keys.some(k => kind.floor.includes(k))) return false;
    return true;
  }
  if (p.type === 'card') return false;
  return typeof address === 'string' && Object.prototype.hasOwnProperty.call(GROUPING_REMOVERS, address);
}

/** @param {string} kind @param {string} id @returns {string[]} */
function cardDepthAddresses(kind, id) {
  const k = CARD_KINDS[kind];
  if (!k) return [];
  return Object.keys(k.fields).map(f => `field:${kind}:${id}:${f}`);
}

// ── THE ONE DEFAULT SET (X-21c as corrected by X-21d) ───────────────────────────────

/** The grouping addresses the default set always carries (static, data-independent). */
const STATIC_DEFAULT_GROUPINGS = Object.freeze([
  ['tab:plot_hooks', 'plot-hooks', 'X-21d: every plot hook is hidden by default'],
  ['block:services.criminal', 'criminal-services', 'X-21c: the criminal services category'],
  ['block:defense.criminalStructure', 'defense-criminal-architecture', "X-21c: Defense's criminal architecture"],
  ['block:power.criminalUnderside', 'power-capture', "X-21c: Power's capture reading"],
  ['block:defense.vulnerabilities', 'defense-vulnerabilities', 'X-21c: defense vulnerabilities and watch gaps'],
  ['block:rumors.dmTruth', 'rumor-truth', "X-21c: rumors' DM truth"],
  ['block:war.truthVsBelief', 'war-truth', 'X-21c: war truth versus belief'],
  ['block:housekeeping.structuralIssues', 'housekeeping', 'X-21c: engine housekeeping (structural issues)'],
  ['block:housekeeping.coherenceNotes', 'housekeeping', 'X-21c: engine housekeeping (coherence notes)'],
  ['block:housekeeping.firstSurvey', 'housekeeping', 'X-21c: engine housekeeping (first-survey warnings)'],
  ['block:housekeeping.receipt', 'housekeeping', 'X-21c: engine housekeeping (the generation receipt)'],
  ['block:housekeeping.decrees', 'housekeeping', 'X-21c: engine housekeeping (pending decrees)'],
]);


/** @param {Rec} inst @returns {boolean} */
function isCriminalInstitution(inst) {
  return str(inst.category).toLowerCase() === 'criminal' || str(inst.priorityCategory).toLowerCase() === 'criminal';
}

/**
 * The declared clandestine/hidden flags the data carries, read through the ONE facet
 * chokepoint (cohesionWeave.js facetOf): the catalog's `clandestine` kind, the custom
 * `institutionFunction: 'clandestine'` spelling, and the `subterranean` kind (the
 * catalog's underground network, catacomb sanctuary and black-market bazaar rows).
 * @param {Rec} inst @returns {boolean}
 */
function isClandestineInstitution(inst) {
  return facetOf(inst, 'clandestine') === 'clandestine'
    || facetOf(inst, 'institutionFunction') === 'clandestine'
    || facetOf(inst, 'subterranean') === 'subterranean';
}

/**
 * One table, one row per default class. Each row derives its addresses from the DATA
 * (classifier category, declared facets, catalog service keys, present fields), never
 * from a label. Grouping rows are static (see GROUPING_REMOVERS). Order matters only for
 * the reason a shared address reports: the most specific class comes first (a whisper
 * market is reported as a covert brokerage, an underground network as clandestine, before
 * the general criminal row that also covers them).
 * @type {ReadonlyArray<{ cls: string, reason: string, select: (s: Rec) => string[] }>}
 */
export const DEFAULT_VEIL_RULES = Object.freeze([
  {
    cls: 'covert-brokerage',
    reason: 'X-21c: a covert information brokerage (the catalog marks it illegal: brokerage service keys plus the criminal tag)',
    select: (s) => recs(s.institutions).filter(i => brokerageLegalityOf(i) === 'illegal')
      .flatMap(i => ['description', 'function', 'services'].map(f => `field:institution:${CARD_KINDS.institution.idOf(i)}:${f}`)),
  },
  {
    cls: 'clandestine-institution',
    reason: "X-21c: a clandestine or underground institution's true function (its front, the name, stays)",
    select: (s) => recs(s.institutions).filter(isClandestineInstitution)
      .flatMap(i => ['description', 'function', 'services'].map(f => `field:institution:${CARD_KINDS.institution.idOf(i)}:${f}`)),
  },
  {
    cls: 'criminal-institution',
    reason: "X-21c: a criminal institution's description, function, services and people (its name and category stay: existence is public)",
    select: (s) => recs(s.institutions).filter(isCriminalInstitution)
      .flatMap(i => ['description', 'function', 'services', 'people'].map(f => `field:institution:${CARD_KINDS.institution.idOf(i)}:${f}`)),
  },
  {
    cls: 'criminal-faction',
    reason: "X-21c: a criminal faction's depth (members, goals, conflicts, description)",
    select: (s) => {
      const out = new Set();
      for (const path of CARD_KINDS.faction.lists) {
        for (const f of listAt(s, path)) {
          if (str(f.category).toLowerCase() !== 'criminal') continue;
          for (const field of ['members', 'goals', 'conflicts', 'description']) out.add(`field:faction:${CARD_KINDS.faction.idOf(f)}:${field}`);
        }
      }
      return [...out];
    },
  },
  {
    cls: 'npc-secret',
    reason: 'X-21c: NPC secrets',
    select: (s) => (recs(s.npcs).some(n => n.secret != null) ? ['class:npc:secret'] : []),
  },
  {
    cls: 'npc-corruption',
    reason: 'X-21c: NPC corruption and compromise flags',
    select: (s) => (recs(s.npcs).some(n => n.corrupt != null || n.corruptionVector != null || n.corruptTies != null)
      ? ['class:npc:corruption'] : []),
  },
  {
    cls: 'plot-hooks',
    reason: 'X-21d: every hook field on a card',
    select: (s) => Object.keys(CARD_KINDS)
      .filter(kind => CARD_KINDS[kind].fields.hooks && cardsOf(s, kind).some(c => c.plotHooks != null))
      .map(kind => `class:${kind}:hooks`),
  },
]);

/**
 * The one default veil for a settlement (X-21d: no profiles). Static groupings plus the
 * data-derived class and field rows, deduplicated, each with its class and reason so the
 * curate preview can mark "hidden by default" apart from "hidden by you". Every default
 * is an eye, never a lock: a delta may flip any of them.
 * @param {unknown} settlement
 * @returns {VeilDefault[]}
 */
export function defaultVeilFor(settlement) {
  const s = isRec(settlement) ? settlement : {};
  /** @type {Map<string, VeilDefault>} */
  const out = new Map();
  for (const [address, cls, reason] of STATIC_DEFAULT_GROUPINGS) out.set(address, { address, cls, reason });
  for (const rule of DEFAULT_VEIL_RULES) {
    for (const address of rule.select(s)) {
      if (!out.has(address) && isHideable(address)) out.set(address, { address, cls: rule.cls, reason: rule.reason });
    }
  }
  return [...out.values()];
}

// ── RESOLVE ───────────────────────────────────────────────────────────────────────

/**
 * The prefix of a per-card EXCEPTION to a field-class master switch ("Secrets: hidden for
 * everyone", but this one card's secret shown). An exception only ever cancels a class
 * removal on one card; it can restore nothing the projection did not carry.
 */
export const VEIL_EXCEPTION_PREFIX = 'except:';

/**
 * The effective hidden set: the defaults, then each delta in order (hidden:true adds,
 * hidden:false removes). A card-level delta expands to that card's depth fields (the card
 * itself is never hidden). A field delta with hidden:false also records a per-card
 * exception (`except:field:…`) so it overrides a class switch on that card. Anything not
 * hideable (floor fields, unknown groupings, bad grammar) is dropped.
 * @param {ReadonlyArray<VeilDefault|string>|null|undefined} defaults
 * @param {ReadonlyArray<VeilDelta>|null|undefined} shareDeltas
 * @returns {Set<string>}
 */
export function resolveVeil(defaults, shareDeltas) {
  /** @type {Set<string>} */
  const hidden = new Set();
  for (const d of defaults || []) {
    const a = typeof d === 'string' ? d : d && d.address;
    if (isHideable(a)) hidden.add(/** @type {string} */ (a));
  }
  for (const delta of shareDeltas || []) {
    if (!delta || typeof delta.hidden !== 'boolean') continue;
    const p = parseVeilAddress(delta.address);
    if (!p) continue;
    const targets = p.type === 'card' ? cardDepthAddresses(p.kind, p.id) : [delta.address];
    for (const t of targets) {
      if (!isHideable(t)) continue;
      const isField = t.startsWith('field:');
      if (delta.hidden) {
        hidden.add(t);
        if (isField) hidden.delete(VEIL_EXCEPTION_PREFIX + t);
      } else {
        hidden.delete(t);
        if (isField) hidden.add(VEIL_EXCEPTION_PREFIX + t);
      }
    }
  }
  return hidden;
}

// ── APPLY ─────────────────────────────────────────────────────────────────────────

/** @param {Rec} card @param {CardKind} kind @param {string} field */
function dropField(card, kind, field) {
  const keys = kind.fields[field] || [field];
  for (const key of keys) {
    if (kind.floor.includes(key)) continue;
    delete card[key];
  }
}

/**
 * Project a public settlement through a veil: every hidden fact is ABSENT (deleted, not
 * blanked). Removal only; the identity floor and every card survive.
 *
 * The result carries `galleryVeil: { v, hidden }` listing the effective GROUPING
 * addresses (tabs and blocks) so renderers can drop a grouping whose display is derived
 * from identity facts. Field and class addresses are never listed: they act by absence,
 * and listing them would name what was there.
 *
 * @param {unknown} publicSettlement  toPublicSafe's output (never a raw record)
 * @param {Iterable<string>|null|undefined} veil  resolveVeil's output
 * @returns {Rec}
 */
export function applyVeil(publicSettlement, veil) {
  const s = /** @type {Rec} */ (deepClone(isRec(publicSettlement) ? publicSettlement : {}));
  const entries = [...(veil || [])];
  const hidden = entries.filter(isHideable);
  /** @type {Set<string>} field addresses a class switch must spare */
  const exceptions = new Set(entries
    .filter(a => typeof a === 'string' && a.startsWith(VEIL_EXCEPTION_PREFIX))
    .map(a => a.slice(VEIL_EXCEPTION_PREFIX.length))
    .filter(isHideable));
  /** @type {string[]} */
  const groupings = [];
  /** @type {Map<string, Set<string>>} kind -> fields hidden on every card */
  const classes = new Map();
  /** @type {Map<string, Map<string, Set<string>>>} kind -> id -> fields */
  const fields = new Map();
  for (const a of hidden) {
    const p = parseVeilAddress(a);
    if (!p) continue;
    if (p.type === 'tab' || p.type === 'block') { groupings.push(a); continue; }
    if (p.type === 'class') {
      if (!classes.has(p.kind)) classes.set(p.kind, new Set());
      /** @type {Set<string>} */ (classes.get(p.kind)).add(p.field);
      continue;
    }
    if (p.type === 'field') {
      if (!fields.has(p.kind)) fields.set(p.kind, new Map());
      const byId = /** @type {Map<string, Set<string>>} */ (fields.get(p.kind));
      if (!byId.has(p.id)) byId.set(p.id, new Set());
      /** @type {Set<string>} */ (byId.get(p.id)).add(p.field);
    }
  }

  // Virtual institution eyes, read BEFORE any card is touched (ids derive from names).
  /** @type {Set<string>} */
  const servicesOf = new Set();
  /** @type {Set<string>} */
  const peopleOf = new Set();
  const instKind = CARD_KINDS.institution;
  for (const inst of cardsOf(s, 'institution')) {
    const id = instKind.idOf(inst);
    const name = str(inst.name);
    const f = fields.get('institution')?.get(id);
    const cls = classes.get('institution');
    /** @param {string} eye @returns {boolean} */
    const veiled = (eye) => !!(f?.has(eye) || (cls?.has(eye) && !exceptions.has(`field:institution:${id}:${eye}`)));
    if (name && veiled('services')) servicesOf.add(name);
    if (name && veiled('people')) peopleOf.add(name);
  }

  // Cards: class switches, then per-card eyes.
  for (const kindName of Object.keys(CARD_KINDS)) {
    const kind = CARD_KINDS[kindName];
    const cls = classes.get(kindName);
    const byId = fields.get(kindName);
    if (!cls && !byId) continue;
    for (const card of cardsOf(s, kindName)) {
      const id = kind.idOf(card);
      const own = byId?.get(id);
      for (const f of cls || []) {
        if (!exceptions.has(`field:${kindName}:${id}:${f}`)) dropField(card, kind, f);
      }
      for (const f of own || []) dropField(card, kind, f);
    }
  }

  // An institution's services: the rows in availableServices it offers.
  const av = recAt(s, 'availableServices');
  if (av && servicesOf.size) {
    for (const [cat, rows] of Object.entries(av)) {
      if (Array.isArray(rows)) av[cat] = rows.filter(r => !(isRec(r) && servicesOf.has(str(r.institution))));
    }
  }
  // An institution's people: the NPCs' links to it (the NPC cards themselves stay).
  if (peopleOf.size) {
    for (const npc of cardsOf(s, 'npc')) {
      if (peopleOf.has(str(npc.institution))) delete npc.institution;
    }
  }

  // Groupings last (a tab remover sees the cards already trimmed).
  for (const g of groupings) GROUPING_REMOVERS[g](s);

  s.galleryVeil = { v: VEIL_VERSION, hidden: [...groupings].sort() };
  return s;
}

/**
 * Is a grouping veiled on this projected settlement? (For renderers of derived blocks.)
 * @param {unknown} settlement @param {string} address @returns {boolean}
 */
export function isVeiled(settlement, address) {
  if (!isRec(settlement)) return false;
  const gv = settlement.galleryVeil;
  return isRec(gv) && Array.isArray(gv.hidden) && gv.hidden.includes(address);
}

// ── STORAGE (inside gallery_member_overrides) ───────────────────────────────────────

/**
 * Clamp a raw delta list: grammar-valid addresses, boolean hidden, bounded, last write
 * per address wins (order kept).
 * @param {unknown} raw
 * @returns {VeilDelta[]}
 */
export function clampVeilDeltas(raw) {
  if (!Array.isArray(raw)) return [];
  /** @type {Map<string, boolean>} */
  const byAddress = new Map();
  for (const d of raw) {
    if (!isRec(d) || typeof d.hidden !== 'boolean') continue;
    if (!parseVeilAddress(d.address)) continue;
    const a = /** @type {string} */ (d.address);
    byAddress.delete(a);
    byAddress.set(a, d.hidden);
  }
  return [...byAddress].slice(-VEIL_MAX_DELTAS).map(([address, hidden]) => ({ address, hidden }));
}

/**
 * Read a share's veil from its gallery_member_overrides object. `marked` is false for a
 * share exported before the veil existed: such a share is projected exactly as before
 * (no defaults are imposed on a page the owner already published). For a marked share the
 * deltas are the stored list plus each `revealDm:false` member read as a card-level hide.
 * @param {unknown} memberOverrides
 * @returns {{ marked: boolean, deltas: VeilDelta[] }}
 */
export function readShareVeil(memberOverrides) {
  if (!isRec(memberOverrides)) return { marked: false, deltas: [] };
  const stored = memberOverrides[VEIL_OVERRIDE_KEY];
  if (!isRec(stored)) return { marked: false, deltas: [] };
  /** @type {VeilDelta[]} */
  const cardDeltas = [];
  for (const [key, ov] of Object.entries(memberOverrides)) {
    if (key === VEIL_OVERRIDE_KEY || !isRec(ov)) continue;
    if (ov.revealDm === false) cardDeltas.push({ address: `card:npc:${key}`, hidden: true });
  }
  return { marked: true, deltas: [...cardDeltas, ...clampVeilDeltas(stored.deltas)] };
}

/**
 * Write a delta list into a gallery_member_overrides object (a new object; the input is
 * not mutated). NPC card-level deltas go to the member's `revealDm` (hidden:true writes
 * revealDm:false, which the server's 093 splice already enforces; hidden:false clears a
 * revealDm:false), everything else into the reserved key. Writing marks the share.
 * @param {unknown} memberOverrides
 * @param {ReadonlyArray<VeilDelta>} deltas
 * @returns {Rec}
 */
export function writeShareVeil(memberOverrides, deltas) {
  /** @type {Rec} */
  const out = {};
  if (isRec(memberOverrides)) {
    for (const [k, v] of Object.entries(memberOverrides)) {
      if (k !== VEIL_OVERRIDE_KEY && isRec(v)) out[k] = { ...v };
    }
  }
  /** @type {VeilDelta[]} */
  const rest = [];
  for (const d of clampVeilDeltas(deltas)) {
    const p = parseVeilAddress(d.address);
    if (p && p.type === 'card' && p.kind === 'npc') {
      const entry = isRec(out[p.id]) ? { .../** @type {Rec} */ (out[p.id]) } : {};
      if (d.hidden) entry.revealDm = false;
      else if (entry.revealDm === false) delete entry.revealDm;
      if (Object.keys(entry).length) out[p.id] = entry; else delete out[p.id];
      continue;
    }
    rest.push(d);
  }
  out[VEIL_OVERRIDE_KEY] = { v: VEIL_VERSION, deltas: rest };
  return out;
}

/**
 * The share's projected settlement: defaults derived from the projection itself, the
 * stored deltas, applied. An unmarked (pre-veil) share is returned unchanged.
 * @param {Rec} publicSettlement  toPublicSafe's output
 * @param {unknown} memberOverrides  the share row's gallery_member_overrides
 * @returns {Rec}
 */
export function projectShareVeil(publicSettlement, memberOverrides) {
  const { marked, deltas } = readShareVeil(memberOverrides);
  if (!marked) return publicSettlement;
  return applyVeil(publicSettlement, resolveVeil(defaultVeilFor(publicSettlement), deltas));
}

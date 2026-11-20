/**
 * galleryDoors.js — THE DOORS BESIDE `data`, the client's twin of migration 212's VEIL-DOORS section (REVIEW-VEIL-10's
 * V10-1, V10-3, V10-4; the seventh chair's rulings VR19 to VR23). Rule for rule with the SQL, each function naming its
 * twin; tests/security/galleryDoors.pglite.test.js reads both over the same stored rows.
 *
 *   THE TILES (VR19, VR22): tilesUnderVeil — on a row whose share carries a veil marker, the tile columns read from the
 *     document the read serves: stability its band word alone, prosperity its stored band (VR28 tier 2), every tile drawn from the town
 *     withheld where a name a share could hide lies inside it. A row with no marker: the row's own columns (VR23).
 *   THE CHRONICLE (VR20 (B), VR21): veilChronicle — each entry by its own veil, then the newest fifty of what is served,
 *     each as a shared page draws it.
 *   A SHARED MAP'S WORLD (VR40, VEIL-DOORS-3): publicWorld, publicWorldSections — the stored world snapshot and its
 *     section list without the chronicle, whatever the row holds.
 *
 * SQL twins: _gallery_doors_band, _gallery_doors_names, _gallery_doors_tile, _gallery_public_tile_rows (the marked
 * branch), _gallery_doors_chronicle_classes, _gallery_doors_chronicle, _gallery_doors_closed, _gallery_doors_world,
 * _gallery_doors_world_sections.
 */
import { STABILITY_BANDS } from './labelBands.js';
import { CARD_KINDS } from './galleryVeil.js';
import { buildNameSearch, nameFold } from './gallerySecondHomes.js';
import { isHideableHouse } from '../people/cardVeil.js';

/** @typedef {Record<string, any>} Rec */
/** @param {unknown} v @returns {v is Rec} */
function isRec(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
const str = (/** @type {unknown} */ v) => (typeof v === 'string' ? v : '');
const QUALIFIER = /(?:[ \t]*[([][^()[\]]*[)\]])+[ \t]*$/;
const squeezedFold = (/** @type {unknown} */ t) => nameFold(t).replace(/_/g, '');

/**
 * THE STABILITY TILE'S BAND WORD: the longest band that opens the label (spaces, tabs and line ends trimmed at either
 * end) and is not followed by an ASCII letter; null where none does. SQL twin: _gallery_doors_band.
 * @param {unknown} label @returns {string|null}
 */
export function tileBand(label) {
  const t = str(label).replace(/^[ \t\n\r]+|[ \t\n\r]+$/g, '');
  let best = null;
  for (const b of STABILITY_BANDS) {
    if (!t.startsWith(b) || /[A-Za-z]/.test(t.charAt(b.length))) continue;
    if (!best || b.length > best.length) best = b;
  }
  return best;
}

/**
 * EVERY NAME A SHARE COULD HIDE, squeezed folds: each hideable house's name, name without its qualifier, label and
 * catalogue identity; each power flagged hidden by `faction` and `name`. SQL twin: _gallery_doors_names.
 * @param {unknown} d @returns {string[]}
 */
export function hideableNames(d) {
  /** @type {Rec} */
  const s = isRec(d) ? d : {};
  const out = new Set();
  for (const i of Array.isArray(s.institutions) ? s.institutions : []) {
    if (!isRec(i) || !isHideableHouse(i)) continue;
    for (const v of [str(i.name), str(i.name).replace(QUALIFIER, ''), str(i.label), str(i.catalogId)]) out.add(squeezedFold(v));
  }
  const powers = isRec(s.powerStructure) && Array.isArray(s.powerStructure.factions) ? s.powerStructure.factions : [];
  for (const f of powers) if (isRec(f) && f.hidden === true) for (const k of ['faction', 'name']) out.add(squeezedFold(str(f[k])));
  out.delete('');
  return [...out];
}

/** A tile drawn from the town on a marked row: null where a hideable name lies inside it. SQL twin: _gallery_doors_tile. */
export function doorTile(/** @type {string|null} */ v, /** @type {string[]} */ names) {
  if (v == null) return null;
  const f = squeezedFold(v);
  return names.some(n => f.includes(n)) ? null : v;
}

const nz = (/** @type {unknown} */ v) => (v == null || v === '' ? null : typeof v === 'string' ? v : JSON.stringify(v));
/** The value at a path as SQL's `#>>` reads it: a string as itself, any other JSON value as its text; '' and absent null. */
function at(/** @type {unknown} */ d, /** @type {string[]} */ path) {
  let x = d;
  for (const k of path) { if (Array.isArray(x)) x = x[Number(k)]; else if (isRec(x)) x = x[k]; else return null; }
  return nz(x);
}

/**
 * THE TILE COLUMNS UNDER THE ROW'S VEIL (the marked branch of _gallery_public_tile_rows). `doc`: the document the read
 * serves (the narration where narrated, then the frozen copy in snapshot mode). The columns 147 reads, by its paths.
 * @param {unknown} doc @returns {Rec}
 */
export function tilesUnderVeil(doc) {
  const names = hideableNames(doc);
  const first = (/** @type {string[][]} */ paths) => { for (const p of paths) { const v = at(doc, p); if (v != null) return v; } return null; };
  const pop = at(doc, ['population']);
  return {
    population: pop != null && /^[0-9]+$/.test(pop) ? Number(pop) : null,
    terrain: doorTile(first([['config', 'terrainType'], ['config', 'terrainOverride'], ['geography', 'terrain'], ['terrain']]), names),
    government_type: doorTile(first([['powerStructure', 'government'], ['powerStructure', 'governingName'], ['powerStructure', 'governmentType'], ['government', 'type'], ['governmentType']]), names),
    magic_level: doorTile(first([['config', 'magicLevel'], ['magicLevel']]), names),
    stability: doorTile(tileBand(first([['powerStructure', 'stability'], ['viability', 'stability'], ['systemState', 'stability'], ['stability']])), names),
    primary_resource: doorTile(first([['config', 'nearbyResources', '0'], ['nearbyResources', '0']]), names),
    threat_level: doorTile(first([['threatProfile', 'level'], ['defense', 'threatLevel'], ['threatLevel']]), names),
    culture: doorTile(at(doc, ['config', 'culture']), names),
    prosperity: doorTile(at(doc, ['economicState', 'prosperity']), names),
    primary_deity: doorTile(at(doc, ['config', 'primaryDeitySnapshot', 'name']), names),
  };
}

/**
 * THE CHRONICLE'S CLASSES (SQL twin: _gallery_doors_chronicle_classes, whose comment states each class; VEIL-DOORS-2's
 * hand-back holds the table, type by type, with its rule, why and an example). Every type is classed ON PURPOSE; a type
 * no class knows is withheld, and the walker reds on a written type this table omits.
 */
const CLASS_OF = Object.freeze({
  house: ['ADD_INSTITUTION', 'REMOVE_INSTITUTION', 'DAMAGE_INSTITUTION', 'IMPAIR_INSTITUTION', 'RESTORE_INSTITUTION'],
  person: ['ADD_NPC', 'KILL_NPC', 'ASSIGN_NPC_TO_ROLE', 'KILL_LEADER', 'PROMOTE_NPC', 'DEMOTE_NPC'],
  power: ['IMPAIR_FACTION', 'RESTORE_FACTION', 'ADD_FACTION', 'CHANGE_RULING_POWER'],
  covert: ['IMPOSE_CORRUPTION', 'EXPOSE_CORRUPTION'],
  stressor: ['APPLY_STRESSOR', 'RESOLVE_STRESSOR'],
  withheld: ['TABLE_INCIDENT'],
  target: ['DEPLETE_RESOURCE', 'CUT_TRADE_ROUTE', 'CREATE_ROUTE', 'SETTLEMENT_DISPUTE', 'DESTROY_SETTLEMENT', 'REFUGEE_WAVE', 'PLAGUE',
    'RAID_OR_MONSTER_ATTACK', 'REMOVED_THREAT', 'BROKERED_ALLIANCE', 'STARTED_RIOT', 'OPENED_TRADE_ROUTE', 'RECOVERED_RESOURCE',
    'ADD_TRADE_GOOD', 'REMOVE_TRADE_GOOD', 'ADD_RESOURCE', 'SET_PRIMARY_DEITY', 'IMPOSE_CULT', 'SHIFT_TIER', 'REMOVE_RESOURCE',
    'FORCE_RELIEF', 'OFFER_CREDIT', 'RENAME_SETTLEMENT'],
});
/** @type {Readonly<Record<string, string>>} */
export const CHRONICLE_CLASSES = Object.freeze(Object.fromEntries(Object.entries(CLASS_OF).flatMap(([c, types]) => types.map(t => [t, c]))));
/**
 * A stressor whose key or label is a crime's (squeezed fold, asked by containment): withheld under a shut criminal
 * grouping. The whole catalogue (stressorsCore.js :: STRESSOR_CATALOG) and the generation vocabulary (stressTypes.js ::
 * STRESS_TYPE_MAP) read by VEIL-DOORS-3: criminal_corridor "Criminal corridor", infiltration "Infiltration network",
 * infiltrated "Infiltrated"; no other key or label is crime-worded.
 */
const CRIME_STRESSORS = Object.freeze(['criminalcorridor', 'infiltration', 'infiltrated']);
/** The registry's label of a target (src/domain/events/registry.js :: labelOf, its case aside: every compare is folded). */
const targetLabel = (/** @type {unknown} */ t) => str(t).replace(/^.*[.]/, '').replace(/_/g, ' ');
const CRIMINAL_GROUPINGS = Object.freeze(['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside']);

/**
 * A chronicle entry's time or a freeze's date, as milliseconds; null where it is none. SQL twin: _gallery_doors_time
 * (a string opening with a date, then Date.parse).
 * @param {unknown} t @returns {number|null}
 */
function timeOf(t) {
  if (typeof t !== 'string' || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(t)) return null;
  const ms = Date.parse(t);
  return Number.isNaN(ms) ? null : ms;
}

/** The cards of a kind, by the veil's own lists. */
function cards(/** @type {unknown} */ s, /** @type {string} */ kind) {
  /** @type {Rec[]} */
  const out = [];
  for (const path of CARD_KINDS[kind].lists) {
    /** @type {unknown[]} */
    let level = [s];
    for (const k of path) level = level.flatMap((/** @type {unknown} */ x) => (k === '*' ? (Array.isArray(x) ? x : []) : isRec(x) && x[k] !== undefined ? [x[k]] : []));
    for (const l of level) if (Array.isArray(l)) out.push(...l.filter(isRec));
  }
  return out;
}

/**
 * THE CHRONICLE BY ITS OWN VEIL. SQL twin: _gallery_doors_chronicle (its comment states each rule).
 * @param {unknown} log the raw campaign_state.eventLog
 * @param {{ proj: unknown, body: unknown, groupings?: string[]|null, src?: unknown, shareDm?: boolean, frozen?: unknown, legacy?: (log: unknown) => unknown }} veil
 *   `body` undefined/null: an unmarked listed share (the caller's 032 projection, `legacy`, is served). `frozen`: the share's
 *   marker where the read serves its frozen copy (VEIL-DOORS-2, item 6: only entries at or before its `at` are served).
 * @returns {Rec[]|null|unknown}
 */
export function veilChronicle(log, { proj, body, groupings = [], src = null, shareDm = false, frozen = null, legacy = (l) => l }) {
  if (body == null) return legacy(log);
  if (!Array.isArray(log)) return null;
  if (!isRec(body) || Object.keys(body).every(k => k === 'name')) return null;
  /** @type {Rec} */
  const p = isRec(proj) ? proj : {};
  const instId = CARD_KINDS.institution.idOf; const npcId = CARD_KINDS.npc.idOf;
  const kept = new Set(cards(body, 'institution').map(instId).filter(Boolean));
  const gone = cards(p, 'institution').filter(c => instId(c) && !kept.has(instId(c)));
  const keptPeople = new Set(cards(body, 'npc').map(npcId).filter(Boolean));
  const gonePeople = cards(p, 'npc').filter(c => npcId(c) && !keptPeople.has(npcId(c)));
  /** @type {unknown[]} */
  const powers = !shareDm && isRec(src) && isRec(src.powerStructure) && Array.isArray(src.powerStructure.factions) ? src.powerStructure.factions : [];
  const names = [...gone.flatMap(c => [str(c.name), str(c.label), str(c.catalogId)]), ...gonePeople.map(c => str(c.name)),
    ...powers.filter(isRec).filter(f => f.hidden === true).flatMap(f => [str(f.faction), str(f.name)])].filter(Boolean);
  const shut = gone.length > 0 || CRIMINAL_GROUPINGS.some(g => (groupings || []).includes(g));
  /** @type {Rec[]} */
  const bodyInsts = Array.isArray(body.institutions) ? body.institutions.filter(isRec) : [];
  /** @type {Rec[]} */
  const shown = isRec(body.powerStructure) && Array.isArray(body.powerStructure.factions) ? body.powerStructure.factions.filter(isRec).filter(f => f.hidden !== true) : [];
  const opens = [...bodyInsts.map(e => str(e.name) || str(e.label)), ...bodyInsts.map(e => str(e.catalogId)), ...shown.flatMap(f => [str(f.faction), str(f.name)])].filter(Boolean);
  // (VEIL-DOORS-2) the log's own names the served body does not show: each house, person or power entry's target, each
  // house it places a person at
  /** @type {Rec[]} */
  const bodyPeople = Array.isArray(body.npcs) ? body.npcs.filter(isRec) : [];
  const shownFolds = new Set([...opens, ...bodyPeople.flatMap(n => [str(n.name), str(n.id)])].map(squeezedFold));
  const typeOf = (/** @type {Rec} */ e) => (isRec(e.event) && str(e.event.type)) || str(e.type);
  for (const e of log) {
    if (!isRec(e)) continue;
    const ev = isRec(e.event) ? e.event : null;
    const cls = CHRONICLE_CLASSES[typeOf(e)];
    const found = [];
    if (cls === 'house' || cls === 'person' || cls === 'power') found.push(targetLabel((ev && str(ev.targetId)) || e.targetId));
    for (const bag of [ev, isRec(e.payload) ? e.payload : null, ev && isRec(ev.payload) ? ev.payload : null]) {
      if (bag) for (const k of ['institution', 'criminalInstitution']) found.push(str(bag[k]));
    }
    for (const x of found) if (squeezedFold(x) !== '' && !shownFolds.has(squeezedFold(x)) && !names.includes(x)) names.push(x);
  }
  const search = names.length ? buildNameSearch(names, opens) : null;
  const truthy = (/** @type {unknown} */ v) => !!v;
  const served = [];
  for (const e of log) {
    if (!isRec(e)) continue;
    const ev = isRec(e.event) ? e.event : null;
    const type = (ev && str(ev.type)) || str(e.type);
    const cls = type ? CHRONICLE_CLASSES[type] : undefined;
    if (!cls) continue;
    if (cls === 'covert' && shut) continue;
    if (cls === 'withheld') continue;
    if (cls === 'stressor' && shut) {
      // (VEIL-DOORS-3, item 3) its key, its label, its targets and its summary, each by containment
      const evp = ev && isRec(ev.payload) ? ev.payload : {}; const top = isRec(e.payload) ? e.payload : {};
      const said = [evp.stressorType, evp.label, ev && ev.targetId, e.targetId, e.narrativeSummary, top.stressorType, top.label].map((x) => squeezedFold(str(x)));
      if (said.some((t) => CRIME_STRESSORS.some((k) => t.includes(k)))) continue;
    }
    if (search && search.holds([e.narrativeSummary ?? null, e.targetId ?? null, ev ? ev.targetId ?? null : null, ev ? ev.payload ?? null : null, e.payload ?? null])) continue;
    const when = truthy(e.timestamp) ? e.timestamp : e.appliedAt;
    if (frozen != null) {
      const at = timeOf(isRec(frozen) ? frozen.at : null); const t = timeOf(when);
      if (at == null || t == null || t > at) continue;
    }
    /** @type {Rec} */
    const m = {};
    if (when !== undefined && when !== null) m.appliedAt = when;
    if (e.narrativeSummary !== undefined && e.narrativeSummary !== null) m.narrativeSummary = e.narrativeSummary;
    if (truthy(e.partyCaused) || (ev && truthy(ev.partyCaused)) || e.cause === 'party_action' || (ev && ev.cause === 'party_action')) m.partyCaused = true;
    if (ev && ev.type !== undefined && ev.type !== null) m.event = { type: ev.type };
    served.push(m);
  }
  return served.slice(-50); // the newest fifty (032's window), taken over what is served (VR21)
}

/**
 * A SHARED MAP'S WORLD SENDS NO CHRONICLE (the seventh chair's VR40): the stored world snapshot as both map reads serve it,
 * its top-level `chronicle` dropped whatever it holds; a snapshot that is not an object is none. SQL twin:
 * _gallery_doors_world.
 * @param {unknown} snapshot @returns {Rec|null}
 */
export function publicWorld(snapshot) {
  if (!isRec(snapshot)) return null;
  const { chronicle: _dropped, ...rest } = snapshot;
  return rest;
}

/**
 * The stored section list beside it, without the `chronicle` key; a list that is not an array is none. SQL twin:
 * _gallery_doors_world_sections (jsonb `-` on an array drops each string element equal to the key).
 * @param {unknown} sections @returns {unknown[]|null}
 */
export function publicWorldSections(sections) {
  return Array.isArray(sections) ? sections.filter((k) => k !== 'chronicle') : null;
}

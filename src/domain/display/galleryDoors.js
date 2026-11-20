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
 *
 * SQL twins: _gallery_doors_band, _gallery_doors_names, _gallery_doors_tile, _gallery_public_tile_rows (the marked
 * branch), _gallery_doors_chronicle_classes, _gallery_doors_chronicle, _gallery_doors_closed.
 */
import { STABILITY_BANDS } from './labelBands.js';
import { CARD_KINDS } from './galleryVeil.js';
import { buildNameSearch, nameFold } from './gallerySecondHomes.js';
import { isHideableHouse } from '../people/cardVeil.js';
import { EVENT_TYPES } from '../events/registry.js';

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
 * THE CHRONICLE'S CLASSES (SQL twin: _gallery_doors_chronicle_classes): every registry type a target class, but the
 * covert act; the settlement-row writers' and the table ledger's rows. A type no class knows is withheld.
 */
export const CHRONICLE_CLASSES = Object.freeze(Object.fromEntries([
  ...EVENT_TYPES.map(t => [t, t === 'IMPOSE_CORRUPTION' ? 'covert' : 'target']),
  ['RENAME_SETTLEMENT', 'target'], ['TABLE_INCIDENT', 'target'],
]));
const CRIMINAL_GROUPINGS = Object.freeze(['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside']);

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
 * @param {{ proj: unknown, body: unknown, groupings?: string[]|null, src?: unknown, shareDm?: boolean, legacy?: (log: unknown) => unknown }} veil
 *   `body` undefined/null: an unmarked listed share (the caller's 032 projection, `legacy`, is served).
 * @returns {Rec[]|null|unknown}
 */
export function veilChronicle(log, { proj, body, groupings = [], src = null, shareDm = false, legacy = (l) => l }) {
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
    if (search && search.holds([e.narrativeSummary ?? null, e.targetId ?? null, ev ? ev.targetId ?? null : null, ev ? ev.payload ?? null : null, e.payload ?? null])) continue;
    /** @type {Rec} */
    const m = {};
    const when = truthy(e.timestamp) ? e.timestamp : e.appliedAt;
    if (when !== undefined && when !== null) m.appliedAt = when;
    if (e.narrativeSummary !== undefined && e.narrativeSummary !== null) m.narrativeSummary = e.narrativeSummary;
    if (truthy(e.partyCaused) || (ev && truthy(ev.partyCaused)) || e.cause === 'party_action' || (ev && ev.cause === 'party_action')) m.partyCaused = true;
    if (ev && ev.type !== undefined && ev.type !== null) m.event = { type: ev.type };
    served.push(m);
  }
  return served.slice(-50); // the newest fifty (032's window), taken over what is served (VR21)
}

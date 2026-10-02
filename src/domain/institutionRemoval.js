/**
 * institutionRemoval.js — THE REMOVAL SWEEP OVER THE RENAME'S OWN LIST
 * (design §22.3 item 10, via §22.2 item 10).
 *
 * A REMOVAL OWES THE SAME CASCADE A RENAME DOES. Every declared surface that
 * holds a handle to a house must lose it when the house is removed, and the
 * surface list is the ONE `INSTITUTION_RENAME_SURFACES` declares: nothing here is
 * declared twice, and a row added there is swept here for free.
 *
 * ⛔ THE REMOVAL RULE IS THE RECORD'S OWN MEASURED ABSENCE SHAPE, NEVER A NULL.
 * The generator already omits most of these keys on most records, so deleting
 * returns the record to a shape it carries, while writing `null` would mint a new
 * one for every tolerant reader to meet for the first time.
 *
 * ⛔ THE ORPHAN REPORT IS A REPORT, NOT A REFUSAL. The sweep COMPLETES and hands
 * back what it could not heal: §P8 makes a guard that refuses rather than offers
 * `proceed` a STOP, and whether a DM is warned is the op layer's judgment.
 *
 * ⛔ THE ONE PATH THIS READS AND NEVER WRITES is RESOLVED from the ledger, not
 * spelled: "never touched" means never WRITTEN, and the ledger's `readable` flag
 * is what says so. Flip that row to false and this module throws at import.
 *
 * PURE. No store, no persistence, no React.
 */

import {
  INSTITUTION_RENAME_SURFACES,
  NON_CASCADED_SURFACES,
  cascadeDraftOf,
  isRecord,
  listOf,
  matchesName,
  resolveSites,
} from './institutionRename.js';

/** @typedef {import('./institutionRename.js').StoredRecord} StoredRecord */
/** @typedef {import('./institutionRename.js').OrphanKind} OrphanKind */
/** @typedef {import('./institutionRename.js').OrphanNote} OrphanNote */
/** @typedef {import('./institutionRename.js').SurfaceRow} SurfaceRow */

/** The ONE readable non-cascaded path, RESOLVED from the ledger rather than spelled. */
const READABLE_ROWS = NON_CASCADED_SURFACES.filter((row) => row.kind === 'matched-pattern' && row.readable);
if (READABLE_ROWS.length !== 1) {
  throw new Error(`institutionRemoval: the orphan report resolves exactly ONE readable matched-pattern row from NON_CASCADED_SURFACES, found ${READABLE_ROWS.length}. A second reader of a non-cascaded path is a decision the chair grants, never a default.`);
}
const PROCESSOR_PATH = READABLE_ROWS[0].path;

/**
 * Row 1's path and row 24's, RESOLVED from the cascade list by their declared
 * removal rules rather than spelled. Each is guarded at import for the same
 * reason the readable row above is: a list that stopped declaring the rule this
 * module reports on must refuse to load, not report on nothing.
 * @param {string} rule @returns {SurfaceRow}
 */
function rowByRemoval(rule) {
  const found = INSTITUTION_RENAME_SURFACES.filter((row) => row.removal === rule);
  if (found.length !== 1) {
    throw new Error(`institutionRemoval: the orphan report resolves exactly ONE '${rule}' row from INSTITUTION_RENAME_SURFACES, found ${found.length}. The rule is declared on the row, never spelled here.`);
  }
  return found[0];
}
const ROSTER_ROW = rowByRemoval('drop-record');
const LABEL_ROW = rowByRemoval('report-only');

/**
 * Every string value a declared path addresses on this record.
 * @param {StoredRecord} settlement @param {string} path @returns {string[]}
 */
function valuesAt(settlement, path) {
  const out = [];
  for (const site of resolveSites(settlement, path)) {
    const held = site.owner[site.key];
    if (site.isList) { for (const item of listOf(held) || []) if (typeof item === 'string') out.push(item); }
    else if (typeof held === 'string') out.push(held);
  }
  return out;
}

/**
 * Sweep one declared row's sites. Arrays are walked BACKWARDS so a splice cannot
 * skip the neighbour that slid into the vacated index.
 * @param {StoredRecord} settlement @param {SurfaceRow} row @param {string} name
 * @returns {boolean} whether anything moved
 */
function sweepRow(settlement, row, name) {
  const sites = resolveSites(settlement, row.path);
  let moved = false;
  for (let s = sites.length - 1; s >= 0; s -= 1) {
    const site = sites[s];
    if (site.isList) {
      const list = listOf(site.owner[site.key]);
      if (!list) continue;
      for (let i = list.length - 1; i >= 0; i -= 1) {
        if (!matchesName(list[i], row.match, name)) continue;
        list.splice(i, 1);
        moved = true;
      }
      continue;
    }
    if (!matchesName(site.owner[site.key], row.match, name)) continue;
    if (row.removal === 'report-only') continue;
    if (row.removal === 'delete-key') delete site.owner[site.key];
    else if (row.removal === 'delete-dependency-object') { if (site.via) delete site.via.owner[site.via.key]; }
    else if (site.holder && site.index >= 0) site.holder.splice(site.index, 1);
    else continue;
    moved = true;
  }
  return moved;
}

/**
 * The chain's own durable id, when it carries one.
 * @param {StoredRecord} chain @returns {string|null}
 */
function chainIdOf(chain) {
  return typeof chain.chainId === 'string' ? chain.chainId : null;
}

/**
 * The orphan report: what the sweep could not heal, in a CLOSED vocabulary of two
 * kinds the op layer's guard engine branches on. Run AFTER the sweep, because
 * "names no surviving roster house" is a question about the roster the sweep
 * leaves behind. Both paths it reads are RESOLVED, never spelled.
 * @param {StoredRecord} settlement @param {string} name @returns {OrphanNote[]}
 */
function orphansAfter(settlement, name) {
  /** @type {OrphanNote[]} */
  const notes = [];
  const surviving = new Set(valuesAt(settlement, ROSTER_ROW.path).map((value) => value.trim()));
  for (const site of resolveSites(settlement, PROCESSOR_PATH)) {
    const processors = listOf(site.owner[site.key]) || [];
    const named = processors.some((value) => matchesName(value, 'exact', name));
    const kept = processors.some((value) => typeof value === 'string' && surviving.has(value.trim()));
    if (!named || kept) continue;
    notes.push({ kind: 'chain-lost-its-last-processor', path: PROCESSOR_PATH, chainId: chainIdOf(site.owner) });
  }
  for (const site of resolveSites(settlement, LABEL_ROW.path)) {
    if (!matchesName(site.owner[site.key], LABEL_ROW.match, name)) continue;
    notes.push({ kind: 'chain-label-names-a-removed-house', path: LABEL_ROW.path, chainId: chainIdOf(site.owner) });
  }
  return notes;
}

/**
 * Sweep an institution removal across every surface in
 * `INSTITUTION_RENAME_SURFACES`. MUTATES the settlement it is HANDED.
 * @param {unknown} settlement @param {string} name
 * @returns {{ changed: boolean, touched: string[], orphaned: OrphanNote[] }}
 */
export function applyInstitutionRemovalToSettlement(settlement, name) {
  /** @type {string[]} */
  const touched = [];
  if (!isRecord(settlement) || !name) return { changed: false, touched, orphaned: [] };
  for (const row of INSTITUTION_RENAME_SURFACES) {
    if (sweepRow(settlement, row, name) && !touched.includes(row.path)) touched.push(row.path);
  }
  if (!touched.length) return { changed: false, touched, orphaned: [] };
  return { changed: true, touched, orphaned: orphansAfter(settlement, name) };
}

/**
 * The IMMUTABLE form: the touched buckets, deep-cloned, ready to spread.
 * @param {unknown} settlement @param {string} name
 * @returns {{ changed: boolean, touched: string[], changes: StoredRecord, orphaned: OrphanNote[] }}
 */
export function institutionRemovalChanges(settlement, name) {
  if (!isRecord(settlement)) return { changed: false, touched: [], changes: {}, orphaned: [] };
  const draft = cascadeDraftOf(settlement);
  const { changed, touched, orphaned } = applyInstitutionRemovalToSettlement(draft, name);
  if (!changed) return { changed: false, touched: [], changes: {}, orphaned: [] };
  return { changed: true, touched, changes: draft, orphaned };
}

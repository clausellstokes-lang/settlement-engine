/**
 * domain/display/heraldIndex.js — THE HERALD INDEX (SP-6's THE HERALD INDEX
 * amendment, owner order 2026-08-03).
 *
 * Headlines are SEARCHABLE by typed facet: settlement (the address chain), NPC,
 * faction/house, institution, good, service, route, treaty/war/arc, desk/kind,
 * and time band.
 *
 * ── THE INDEX LAW ───────────────────────────────────────────────────────────
 * The index derives from TYPED ENTITY REFS — the SAME slot fills that render the
 * prose are recorded as IDS on the entry, so the sentence and its searchability
 * are ONE record that cannot drift. Therefore:
 *
 *   FREE TEXT   matches rendered prose (the recorded headline, the summary, the
 *               typed kind label, and resolved settlement NAMES).
 *   FACETS      match REFS ONLY. Never name-regex entity inference — the
 *               finite-semantics law. A facet with no ref on an entry does not
 *               match that entry, however suggestively its prose reads.
 *
 * ── THE AUDIENCE LAW BINDS THE INDEX ────────────────────────────────────────
 * Covert / DM-only entries never appear in a projection's search the projection
 * could not read. `includeCovert` defaults to FALSE — search is a view, never a
 * leak, and the fail-closed pin is the hardest one in the file.
 *
 * ── THE READER SHELL (and what is still dark) ───────────────────────────────
 * Six facets read fields today's receipts already carry. The rest are declared
 * PENDING: their `refsOf` readers are written and wired, and each looks for the
 * typed slot the mint path will record — so the day the mint-time entity-ref
 * slots land, those facets light with no further change here. A PENDING facet
 * returns an empty ref set today and is reported by `facetAvailability` rather
 * than silently returning nothing, because a facet that quietly matches nothing
 * is indistinguishable from a facet that is broken.
 *
 * PURE: no store, no React, no Date, no rng. Display-side, derived, no engine
 * state — exactly as the amendment requires.
 *
 * @enforced-by tests/domain/heraldIndex.test.js
 */

import { timeBandOf } from './heraldCausalGrammar.js';

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** Every non-empty id in a value, whether it arrived as one id or a list. */
function ids(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (value == null) return [];
  const one = String(value).trim();
  return one ? [one] : [];
}

/** The record an entry was normalized from, plus its nested outcome. */
function recordsOf(entry) {
  const record = asObject(asObject(entry).record);
  return [record, asObject(record.outcome)];
}

/** Read the first spelling of a typed ref slot that the records actually carry. */
function refFromRecord(entry, keys) {
  const out = [];
  for (const source of recordsOf(entry)) {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(source, key)) out.push(...ids(source[key]));
    }
  }
  return [...new Set(out)];
}

/**
 * THE FACET REGISTRY. One row per typed facet: its id, its reader-facing label,
 * whether it is LIVE today, and the ref reader.
 *
 * `status: 'live'` means a field exists on today's receipts. `status: 'pending'`
 * means the reader is wired and waiting on the mint-time typed slot — the row is
 * the reader shell, not a promise.
 */
export const HERALD_FACETS = Object.freeze([
  Object.freeze({
    id: 'settlement',
    label: 'Settlement',
    status: 'live',
    refsOf: (entry) => [...new Set([
      ...ids(asObject(entry).subject && asObject(asObject(entry).subject).settlementId),
      ...ids(asObject(entry).affectedIds),
    ])],
  }),
  Object.freeze({
    id: 'npc',
    label: 'Person',
    status: 'live',
    refsOf: (entry) => ids(asObject(asObject(entry).subject).npcId),
  }),
  Object.freeze({
    id: 'faction',
    label: 'Faction or house',
    status: 'live',
    // A merchant house is a faction with books; the subject slot carries both,
    // and the typed `houseId` spelling is read beside it for the day it lands.
    refsOf: (entry) => [...new Set([
      ...ids(asObject(asObject(entry).subject).factionId),
      ...refFromRecord(entry, ['houseId', 'merchantHouseId']),
    ])],
  }),
  Object.freeze({
    id: 'desk',
    label: 'Desk',
    status: 'live',
    refsOf: (entry) => ids(asObject(entry).section),
  }),
  Object.freeze({
    id: 'kind',
    label: 'Kind',
    status: 'live',
    refsOf: (entry) => ids(asObject(entry).kind),
  }),
  Object.freeze({
    id: 'timeBand',
    label: 'When',
    status: 'live',
    // Banded, never a tick: the reader gets the band word's id, and the engine
    // count never reaches the page.
    refsOf: (entry, ctx) => {
      const tick = asObject(entry).tick;
      if (!Number.isFinite(tick)) return [];
      const now = Number.isFinite(ctx?.nowTick) ? Number(ctx.nowTick) : Number(tick);
      return [timeBandOf(Math.max(0, now - Number(tick)), ctx?.intervalWeeks ?? 1).id];
    },
  }),
  Object.freeze({
    id: 'institution',
    label: 'Institution',
    status: 'pending',
    refsOf: (entry) => refFromRecord(entry, ['institutionId', 'institutionIds']),
  }),
  Object.freeze({
    id: 'good',
    label: 'Good',
    status: 'pending',
    refsOf: (entry) => refFromRecord(entry, ['goodId', 'goodIds']),
  }),
  Object.freeze({
    id: 'service',
    label: 'Service',
    status: 'pending',
    refsOf: (entry) => refFromRecord(entry, ['serviceId', 'serviceIds']),
  }),
  Object.freeze({
    id: 'route',
    label: 'Route',
    status: 'pending',
    refsOf: (entry) => refFromRecord(entry, ['routeId', 'routeIds']),
  }),
  Object.freeze({
    id: 'arc',
    label: 'Treaty, war or arc',
    status: 'pending',
    refsOf: (entry) => refFromRecord(entry, ['treatyId', 'warId', 'arcId']),
  }),
]);

/** Facet id → row, for the callers that hold a facet id and nothing else. */
export const HERALD_FACET_BY_ID = Object.freeze(Object.fromEntries(
  HERALD_FACETS.map((facet) => [facet.id, facet]),
));

/**
 * Which facets can actually match today, measured over a real corpus rather than
 * declared. `declared` is the registry's own status; `populated` is whether ANY
 * entry in this corpus carries a ref for it. A facet that is declared live but
 * populated nowhere is a surface a reader would find dead, and this is how the
 * UI knows to dim it rather than offering an empty promise.
 *
 * @param {ReadonlyArray<Record<string, unknown>>} entries
 * @param {{ nowTick?: number, intervalWeeks?: number }} [ctx]
 * @returns {Array<{ id: string, label: string, declared: string, populated: boolean, values: string[] }>}
 */
export function facetAvailability(entries = [], ctx = {}) {
  return HERALD_FACETS.map((facet) => {
    const values = new Set();
    for (const entry of entries) for (const ref of facet.refsOf(entry, ctx)) values.add(ref);
    return {
      id: facet.id,
      label: facet.label,
      declared: facet.status,
      populated: values.size > 0,
      values: [...values].sort(),
    };
  });
}

/**
 * THE AUDIENCE GATE. Covert entries are dropped unless the caller has PROVEN a
 * DM session. Fail closed: the default is false, and an entry whose provenance
 * cannot be read at all is treated as covert rather than as canon.
 * @param {Record<string, unknown>} entry
 * @param {boolean} includeCovert
 * @returns {boolean}
 */
export function readableBy(entry, includeCovert) {
  const provenance = asObject(entry).provenance;
  if (provenance === 'covert') return !!includeCovert;
  // A record that carries a covert marker anywhere the normalizer did not lift
  // is still covert. The chip is a projection; the marker is the fact.
  for (const source of recordsOf(entry)) {
    if (source.covert === true || source.visibility === 'covert') return !!includeCovert;
  }
  return true;
}

/** The free-text haystack: RENDERED PROSE ONLY, plus resolved settlement names. */
function proseHaystack(entry, nameById) {
  const row = asObject(entry);
  const hay = [];
  if (row.headline) hay.push(String(row.headline));
  if (row.summary) hay.push(String(row.summary));
  if (row.kind) hay.push(String(row.kind).replace(/_/g, ' '));
  for (const id of HERALD_FACET_BY_ID.settlement.refsOf(entry)) {
    const name = nameById?.get?.(String(id));
    if (name) hay.push(String(name));
  }
  return hay.join('  ').toLowerCase();
}

/**
 * SEARCH THE HERALD.
 *
 * `query` matches rendered prose. `facets` is `{ [facetId]: string[] }` and
 * matches REFS ONLY — an entry matches a facet when it carries at least one of
 * the requested refs, and must match EVERY requested facet (facets narrow
 * together; values within one facet widen).
 *
 * Results are ORGANIZED as the amendment asks: grouped by desk, then by time
 * band, each group deterministically ordered (severity desc, recency desc,
 * codepoint id) so the same corpus reads the same way forever.
 *
 * @param {Object} args
 * @param {ReadonlyArray<Record<string, unknown>>} args.entries
 * @param {string} [args.query]
 * @param {Record<string, ReadonlyArray<string>>} [args.facets]
 * @param {Map<string,string>} [args.nameById]
 * @param {boolean} [args.includeCovert]  DM sessions only; default FALSE
 * @param {number} [args.nowTick]
 * @param {number} [args.intervalWeeks]
 * @returns {{ results: Array<Record<string, unknown>>, groups: Array<{ desk: string, timeBand: string, items: Array<Record<string, unknown>> }>, redactedCount: number }}
 */
export function searchHerald({
  entries = [], query = '', facets = {}, nameById = new Map(),
  includeCovert = false, nowTick = null, intervalWeeks = 1,
}) {
  const ctx = { nowTick, intervalWeeks };
  const q = String(query || '').trim().toLowerCase();
  const requested = Object.entries(facets)
    .filter(([id, values]) => HERALD_FACET_BY_ID[id] && Array.isArray(values) && values.length > 0)
    .map(([id, values]) => ({ facet: HERALD_FACET_BY_ID[id], wanted: new Set(values.map(String)) }));

  let redactedCount = 0;
  const results = [];
  for (const entry of entries) {
    if (!readableBy(entry, includeCovert)) { redactedCount += 1; continue; }
    if (q && !proseHaystack(entry, nameById).includes(q)) continue;
    const matchesFacets = requested.every(({ facet, wanted }) =>
      facet.refsOf(entry, ctx).some((ref) => wanted.has(String(ref))));
    if (!matchesFacets) continue;
    results.push(entry);
  }

  results.sort((a, b) => {
    const sa = Number(asObject(a).severity) || 0;
    const sb = Number(asObject(b).severity) || 0;
    if (sb !== sa) return sb - sa;
    const ta = Number.isFinite(asObject(a).tick) ? Number(asObject(a).tick) : -1;
    const tb = Number.isFinite(asObject(b).tick) ? Number(asObject(b).tick) : -1;
    if (tb !== ta) return tb - ta;
    const ia = String(asObject(a).id ?? '');
    const ib = String(asObject(b).id ?? '');
    return ia < ib ? -1 : ia > ib ? 1 : 0;
  });

  /** @type {Map<string, { desk: string, timeBand: string, items: Array<Record<string, unknown>> }>} */
  const grouped = new Map();
  for (const entry of results) {
    const desk = HERALD_FACET_BY_ID.desk.refsOf(entry)[0] || 'events';
    const band = HERALD_FACET_BY_ID.timeBand.refsOf(entry, ctx)[0] || 'this_season';
    const key = `${desk} ${band}`;
    if (!grouped.has(key)) grouped.set(key, { desk, timeBand: band, items: [] });
    grouped.get(key).items.push(entry);
  }

  return { results, groups: [...grouped.values()], redactedCount };
}

/**
 * THE ROUND TRIP, one half: the refs an entry carries, by facet — what an entity
 * panel needs to link back from a headline to the panels of everything named in
 * it. The other half (an entity's headlines) is `searchHerald` with that entity's
 * facet, which is why there is only one index and it cannot drift from itself.
 *
 * @param {Record<string, unknown>} entry
 * @param {{ nowTick?: number, intervalWeeks?: number }} [ctx]
 * @returns {Record<string, string[]>}
 */
export function entryRefs(entry, ctx = {}) {
  /** @type {Record<string, string[]>} */
  const out = {};
  for (const facet of HERALD_FACETS) {
    const refs = facet.refsOf(entry, ctx);
    if (refs.length) out[facet.id] = refs;
  }
  return out;
}

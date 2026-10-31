/**
 * dossierSearch.js — THE DOSSIER SEARCH, its pure half (RULINGS-CROSS X-19, corrected by
 * X-19b: "the results should be whatever object exists within the dossier ... this is to be
 * a one stop shop").
 *
 * A result is one of the dossier's OWN objects: a person, an institution, a service, a
 * faction, a tie, a conflict, a neighbour, an event, a tension, a tradition, a plot hook, a
 * worked resource. This module only FINDS them; the view mounts each one through the same
 * component and props its tab gives it (components/dossier/DossierSearchResults.jsx). So
 * every object here carries the RAW record its tab renders, never a summary of it (R2).
 *
 *   enumerateDossierObjects(settlement, viewer, options) -> { settlement, objects }
 *   rankDossierObjects(enumeration, query, options)      -> { total, groups }
 *   searchDossier(settlement, query, viewer, options)    -> both, in one call
 *
 * The indexed families (people, factions, institutions, events) come off
 * `entityLinks.js :: buildDossierEntityIndex`, so a result carries the index id the
 * navigator lands on, and the owning tab is `TYPE_TO_TAB`'s. The families the index does not
 * hold (ties, conflicts, tensions, traditions, hooks, services, worked resources) are read
 * from the same fields their tabs read.
 *
 * RANKING (X-19, kept by X-19b): an exact name, then a name prefix, then a word in the name,
 * then the name containing the query anywhere, then the text containing it. Ties break by
 * prominence (influence, power share, service count, severity, priority), then by the order
 * the tab itself lists them. Results group under their owning tab; the groups run by their
 * best object, and a tie runs in TAB_ORDER (people first).
 *
 * AUDIENCE (X-19: "no DM secret in a public or player-view result"):
 *   playerView     the whole settlement is projected through `toPublicSafe` before anything
 *                  is enumerated, so a secret, a goal or a hook is not in the objects at all
 *                  (the server's own gallery projection, mirrored client-side), and the plot
 *                  hooks family is not enumerated.
 *   publicDossier  the owner chose what the payload carries, and the objects render as their
 *                  tabs render them; a person's secret, goal, constraint and whereabouts are
 *                  never MATCHED, so a query can never surface a card by its secret.
 *   `tabs`         a family whose tab the viewer does not have is dropped whole.
 *
 * Pure: no React, no store, no writes. Lazy by construction (only the search view imports it).
 */
import { buildDossierEntityIndex, neighbourIdFor, slugifyEntity } from './entityLinks.js';
import { isLiveInstitution } from '../institutions/institutionRoster.js';
import { collectPlotHooks } from './plotHooks.js';
import { toPublicSafe } from '../display/publicSafe.js';
import { institutionDisplayName } from '../display/institutionDisplayName.js';
import { resourceDisplayName } from '../display/resourceDisplayName.js';
import { relationshipsDeskLists } from '../display/stateProse/relationshipsDeskRead.js';
import { deriveFoundingTraditions } from '../traditions/genesis.js';
import { mergeCustomFoundingTraditions } from '../traditions/customFounding.js';
import { PROXY_SERVICE_HOSTS } from '../../data/servicesData.js';
import { compareCodepoint } from '../deterministicSort.js';

/**
 * @typedef {{ publicDossier?: boolean, playerView?: boolean }} SearchViewer
 *
 * @typedef {Object} SearchObject
 * @property {string} type        the object family ('npc', 'institution', 'tie', ...)
 * @property {string} key         unique within one enumeration
 * @property {string} tab         the tab that owns the object (its group header)
 * @property {string|null} id     the entity-index id, when the family is indexed
 * @property {string[]} names     the strings the object is NAMED by
 * @property {string[]} text      the other strings its card shows the reader
 * @property {number} prominence  the tiebreak within one match tier
 * @property {number} order       the order its tab lists it in
 * @property {unknown} raw        the record its tab's component renders
 * @property {Record<string, unknown>} meta  render context the tab carries beside the record
 *
 * @typedef {SearchObject & { score: number }} SearchHit
 * @typedef {{ tab: string, score: number, objects: SearchHit[] }} SearchGroup
 * @typedef {{ settlement: Record<string, unknown>, objects: SearchObject[] }} SearchEnumeration
 * @typedef {{ id: string, tab: string, currentName: string, traits?: unknown }} IndexEntry  one entity-index entry
 */

/** The DOM id of the results region; the search bar's combobox points its aria-controls at it. */
export const SEARCH_RESULTS_ID = 'sf-search-results';

/** Whether a typed query is long enough to search on: one letter matches nearly every object,
 *  so a query is two characters or more.
 *  @param {unknown} query @returns {boolean} */
export function isSearchActive(query) {
  return foldSearchText(query).length > 1;
}

/** The tie order of groups whose best objects score alike: people first, then the systems. */
export const SEARCH_TAB_ORDER = Object.freeze([
  'npcs', 'institutions', 'services', 'power', 'relationships',
  'history', 'traditions', 'plot_hooks', 'resources',
]);

/** Match tiers, best first. */
export const MATCH = Object.freeze({ EXACT: 5, PREFIX: 4, WORD: 3, NAME: 2, TEXT: 1, NONE: 0 });

/** @param {unknown} v @returns {Record<string, unknown>|null} */
function asRecord(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : null;
}
/** @param {unknown} v @returns {unknown[]} */
function asList(v) {
  return Array.isArray(v) ? v : [];
}
/** @param {unknown} v @returns {string} */
function asText(v) {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return '';
}
/** @param {unknown} v @returns {number} */
function asNumber(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}
/** Every string inside a value: a string, a list of strings, or an object's string fields.
 *  @param {unknown} v @returns {string[]} */
function textsOf(v) {
  if (typeof v === 'string') return v ? [v] : [];
  if (Array.isArray(v)) return v.flatMap((item) => (typeof item === 'string' && item ? [item] : []));
  const rec = asRecord(v);
  if (!rec) return [];
  return Object.values(rec).flatMap((item) => (typeof item === 'string' && item ? [item] : []));
}
/** An engine token read as words ('crime_wave' -> 'crime wave'), for matching only.
 *  @param {unknown} v @returns {string} */
function tokenWords(v) {
  return asText(v).replace(/[_-]+/g, ' ').trim();
}

/**
 * The one fold both sides of a match pass through: case, accents and runs of space.
 * @param {unknown} value
 * @returns {string}
 */
export function foldSearchText(value) {
  return asText(value)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** @param {string} s @returns {string} */
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * How well one object answers a folded query (MATCH tiers). Names outrank text.
 * @param {Pick<SearchObject, 'names'|'text'>} object
 * @param {string} q  an already-folded query
 * @returns {number}
 */
export function matchScore(object, q) {
  if (!q) return MATCH.NONE;
  const wordStart = new RegExp(`(^|[^a-z0-9])${escapeRegExp(q)}`);
  let best = /** @type {number} */ (MATCH.NONE);
  for (const name of object.names) {
    const n = foldSearchText(name);
    if (!n) continue;
    if (n === q) return MATCH.EXACT;
    if (n.startsWith(q)) best = Math.max(best, MATCH.PREFIX);
    else if (wordStart.test(n)) best = Math.max(best, MATCH.WORD);
    else if (n.includes(q)) best = Math.max(best, MATCH.NAME);
  }
  if (best > MATCH.NONE) return best;
  return object.text.some((t) => foldSearchText(t).includes(q)) ? MATCH.TEXT : MATCH.NONE;
}

const INFLUENCE_RANK = Object.freeze({ high: 3, moderate: 2, low: 1 });
const SEVERITY_RANK = Object.freeze({ catastrophic: 3, major: 2, minor: 1 });
const INTENSITY_RANK = Object.freeze({ high: 3, moderate: 2, low: 1 });
const VALUE_RANK = Object.freeze({ 'very high': 4, high: 3, medium: 2, low: 1 });

/** @param {Readonly<Record<string, number>>} table @param {unknown} key @returns {number} */
function rankOf(table, key) {
  return table[asText(key)] || 0;
}
/** The worst severity a tension or event carries (it may be one word or a list).
 *  @param {unknown} severity @returns {number} */
function severityRank(severity) {
  const list = Array.isArray(severity) ? severity : [severity];
  return list.reduce((best, s) => Math.max(best, rankOf(SEVERITY_RANK, s)), 0);
}

/**
 * Every service row as `{ category, svc }`, flattened out of the category map the generator
 * writes (the Services tab's own walk; its categories are lower-case keys, so the codepoint
 * order is the tab's alphabetical one).
 * @param {unknown} availableServices
 * @returns {Array<{ category: string, svc: unknown, index: number }>}
 */
function serviceRows(availableServices) {
  const map = asRecord(availableServices);
  if (!map) return [];
  return Object.keys(map).sort(compareCodepoint).flatMap((category) =>
    asList(map[category]).map((svc, index) => ({ category, svc, index })));
}

/**
 * The traditions the Traditions tab shows: the lit mirror when the engine wrote one, else the
 * founding preview with the DM's custom traditions merged in (TraditionsTab's own rule).
 * @param {Record<string, unknown>} settlement
 * @param {unknown} customTraditions
 * @returns {{ preview: boolean, recs: unknown[] }}
 */
function traditionsOf(settlement, customTraditions) {
  const mirror = Array.isArray(settlement.traditions) ? settlement.traditions : null;
  const preview = !mirror || mirror.length === 0;
  if (!preview) return { preview, recs: /** @type {unknown[]} */ (mirror) };
  const founding = deriveFoundingTraditions(
    /** @type {Parameters<typeof deriveFoundingTraditions>[0]} */ (/** @type {unknown} */ (settlement)));
  const custom = /** @type {Parameters<typeof mergeCustomFoundingTraditions>[1]} */ (
    Array.isArray(customTraditions) ? customTraditions : []);
  return { preview, recs: mergeCustomFoundingTraditions(founding, custom) };
}

/**
 * The index id of a historical event: the index keys an event without its own id by its name
 * (`entityLinks.js :: eventIdFor`), and a generated event carries no id. Resolved against the
 * index by the caller; an event the name does not reach opens its tab without a landing.
 * @param {Record<string, unknown>} evt
 * @returns {string}
 */
function eventNameKey(evt) {
  return asText(evt.name) ? `event.${slugifyEntity(evt.name)}` : '';
}

/**
 * Enumerate every searchable object of one settlement, for one viewer. Run once per
 * settlement (the view memoises it); ranking a query over it is the cheap half.
 *
 * @param {unknown} settlement
 * @param {SearchViewer} [viewer]
 * @param {{ customTraditions?: unknown }} [options]
 * @returns {SearchEnumeration}
 */
export function enumerateDossierObjects(settlement, viewer = {}, options = {}) {
  const playerView = viewer.playerView === true;
  const dmFieldsSearchable = !playerView && viewer.publicDossier !== true;
  const source = asRecord(settlement);
  if (!source) return { settlement: {}, objects: [] };
  // THE PLAYER GATE: the projection is the payload a player view is served, so nothing the
  // projection strips can be found, and nothing found can carry it into a rendered card.
  const view = playerView ? toPublicSafe(source) : source;
  const index = buildDossierEntityIndex(view);
  // An event's index id: the entry that wraps this very record (an authored id), else the
  // name key the index gives a generated, id-less event.
  const eventIds = new Map(index.events.map((entry) => [entry.raw, entry.id]));
  /** @param {Record<string, unknown>} evt @returns {string|null} */
  const eventId = (evt) => eventIds.get(evt) ?? index.resolve(eventNameKey(evt))?.id ?? null;
  /** @type {SearchObject[]} */
  const objects = [];
  /** @param {Omit<SearchObject, 'order'|'names'|'text'> & { names: unknown[], text: unknown[] }} o */
  const push = (o) => {
    objects.push({
      ...o,
      names: o.names.map(asText).filter(Boolean),
      text: o.text.flatMap(textsOf),
      order: objects.length,
    });
  };

  // The index builds each family by mapping its settlement array in order, so entry `i` IS
  // element `i`: the id, tab, live name and traits come off the entry, and every field the card
  // shows is read off the settlement's own record (the same object the entry wraps).
  // PEOPLE — the NPC card's `npc`.
  const people = asList(view.npcs);
  index.npcs.forEach((/** @type {IndexEntry} */ entry, /** @type {number} */ i) => {
    const npc = asRecord(people[i]) || {};
    const traits = asList(entry.traits).map(asRecord).filter((t) => t && (dmFieldsSearchable || t.visibility !== 'gm'));
    push({
      type: 'npc', key: `npc:${entry.id}:${objects.length}`, tab: entry.tab, id: entry.id,
      names: [entry.currentName],
      text: [
        npc.title, npc.role, npc.factionAffiliation, npc.structuralPosition,
        ...traits.map((t) => (t ? t.value : '')),
        ...(dmFieldsSearchable ? [npc.activeConstraint, asRecord(npc.goal)?.short, npc.goal] : []),
      ],
      prominence: rankOf(INFLUENCE_RANK, npc.influence) * 1000 + asNumber(npc.power),
      raw: npc, meta: {},
    });
  });

  // INSTITUTIONS — the index's entries, each with the service rows the Institutions tab joins
  // under it (a proxy host lists none, as on that tab).
  /** @type {Map<string, Array<Record<string, unknown>>>} */
  const servicesByInstitution = new Map();
  for (const { svc } of serviceRows(view.availableServices)) {
    const row = asRecord(svc);
    const host = row ? asText(row.institution) : '';
    if (!row || !host || Object.prototype.hasOwnProperty.call(PROXY_SERVICE_HOSTS, host.toLowerCase())) continue;
    const list = servicesByInstitution.get(host) || [];
    list.push(row);
    servicesByInstitution.set(host, list);
  }
  // Every house is listed, as on its tab (display, not a provider count); a ruin is shown but
  // never credited with function, so it ranks under every live house (institutionRoster).
  const roster = asList(view.institutions);
  index.institutions.forEach((/** @type {IndexEntry} */ entry, /** @type {number} */ i) => {
    const inst = asRecord(roster[i]) || {};
    const services = servicesByInstitution.get(asText(inst.name)) || [];
    push({
      type: 'institution', key: `institution:${entry.id}:${objects.length}`, tab: entry.tab, id: entry.id,
      names: [institutionDisplayName(inst), inst.name],
      text: [tokenWords(inst.category), inst.desc, ...services.flatMap((s) => [institutionDisplayName(s.name), s.desc])],
      prominence: isLiveInstitution(inst) ? services.length : -1,
      raw: inst, meta: {},
    });
  });

  // SERVICES — every row of the catalogue, as the Services tab lists it, under its category.
  for (const { category, svc, index: i } of serviceRows(view.availableServices)) {
    const row = asRecord(svc);
    const name = row ? asText(row.name) : asText(svc);
    if (!name) continue;
    push({
      type: 'service', key: `service:${category}:${i}`, tab: 'services', id: null,
      names: [institutionDisplayName(name), name],
      text: row ? [row.desc, institutionDisplayName(row.institution)] : [],
      prominence: 0,
      raw: svc, meta: { category, host: row ? asText(row.institution).toLowerCase() : name.toLowerCase() },
    });
  }

  // FACTIONS — the Power roster rows (the index reads the same list, in the same order).
  const powerFactions = asList(asRecord(view.powerStructure)?.factions);
  const factionList = powerFactions.length ? powerFactions : asList(view.factions);
  index.factions.forEach((/** @type {IndexEntry} */ entry, /** @type {number} */ i) => {
    const faction = asRecord(factionList[i]) || {};
    push({
      type: 'faction', key: `faction:${entry.id}:${objects.length}`, tab: entry.tab, id: entry.id,
      names: [entry.currentName],
      text: [faction.desc, faction.crisisNote, tokenWords(faction.category)],
      prominence: asNumber(faction.power),
      raw: faction, meta: {},
    });
  });

  // RELATIONSHIPS — the neighbour cards, the ties, the conflicts.
  for (const row of relationshipsDeskLists(view).neighbours) {
    const id = neighbourIdFor(row);
    push({
      type: 'neighbour', key: `neighbour:${id || objects.length}`, tab: 'relationships', id,
      names: [row.neighbourName, row.name],
      text: [tokenWords(row.relationshipType), row.description, row.summary],
      prominence: 0,
      raw: row, meta: {},
    });
  }
  asList(view.relationships).forEach((tie, i) => {
    const rel = asRecord(tie);
    if (!rel) return;
    push({
      type: 'tie', key: `tie:${i}`, tab: 'relationships', id: null,
      names: [rel.npc1Name, rel.npc2Name],
      text: [rel.typeName || tokenWords(rel.type), rel.description, rel.tension, rel.npc1Role, rel.npc2Role],
      prominence: 0,
      raw: rel, meta: { tieType: asText(rel.type) },
    });
  });
  asList(view.conflicts).forEach((c, i) => {
    const conflict = asRecord(c);
    if (!conflict) return;
    push({
      type: 'conflict', key: `conflict:${i}`, tab: 'relationships', id: null,
      names: asList(conflict.parties),
      text: [conflict.issue, conflict.stakes, conflict.issue ? '' : conflict.desc],
      prominence: rankOf(INTENSITY_RANK, conflict.intensity),
      raw: conflict, meta: {},
    });
  });

  // HISTORY — the event cards and the tension rows.
  const history = asRecord(view.history) || {};
  asList(history.historicalEvents).forEach((e, i) => {
    const evt = asRecord(e);
    if (!evt) return;
    push({
      type: 'event', key: `event:${i}`, tab: 'history', id: eventId(evt),
      names: [evt.name, tokenWords(evt.type)],
      text: [evt.description, ...asList(evt.lastingEffects)],
      prominence: severityRank(evt.severity),
      raw: evt, meta: {},
    });
  });
  asList(history.currentTensions).forEach((t, i) => {
    const tension = asRecord(t);
    if (!tension) return;
    push({
      type: 'tension', key: `tension:${i}`, tab: 'history', id: null,
      names: [tokenWords(tension.type)],
      text: [tension.description],
      prominence: 0,
      raw: tension, meta: {},
    });
  });

  // TRADITIONS — the register the Traditions tab shows (mirror, or the founding preview).
  const { preview, recs } = traditionsOf(view, options.customTraditions);
  recs.forEach((r, i) => {
    const rec = asRecord(r);
    if (!rec) return;
    const motif = asRecord(rec.coreMotif) || {};
    push({
      type: 'tradition', key: `tradition:${asText(rec.id) || i}:${i}`, tab: 'traditions', id: null,
      names: [rec.name],
      text: [tokenWords(motif.element), tokenWords(motif.act), asRecord(rec.expression)?.epithet],
      prominence: 0,
      raw: rec, meta: { preview },
    });
  });

  // PLOT HOOKS — the collector's cards (the Plot Hooks tab is their one home, X-2). Never in a
  // player view: a hook is DM-only material.
  if (!playerView) {
    collectPlotHooks(/** @type {Parameters<typeof collectPlotHooks>[0]} */ (/** @type {unknown} */ (view)))
      .forEach((hook, i) => {
        push({
          type: 'hook', key: `hook:${i}`, tab: 'plot_hooks', id: null,
          names: [hook.source],
          text: [hook.text, hook.role, hook.sub],
          prominence: asNumber(hook.priority),
          raw: hook, meta: {},
        });
      });
  }

  // RESOURCES — the worked chains, in the Resources tab's stage order.
  const exploitation = asRecord(asRecord(view.resourceAnalysis)?.exploitation) || {};
  /** @param {string} stage @param {unknown} chains */
  const pushChains = (stage, chains) => asList(chains).forEach((c, i) => {
    const chain = asRecord(c);
    if (!chain) return;
    push({
      type: 'resource', key: `resource:${stage}:${i}`, tab: 'resources', id: null,
      names: [resourceDisplayName(chain.rawResource), tokenWords(chain.rawResource)],
      text: [
        ...asList(chain.intermediateGoods), ...asList(chain.finalProducts),
        ...asList(chain.processingInstitutions).map(institutionDisplayName), ...asList(chain.dependsOn),
      ],
      prominence: rankOf(VALUE_RANK, chain.exportValue),
      raw: chain, meta: { stage },
    });
  });
  pushChains('unexploited', exploitation.unexploited);
  pushChains('partial', exploitation.partiallyExploited);
  pushChains('full', exploitation.fullyExploited);

  return { settlement: view, objects };
}

/**
 * Rank one query over an enumeration: every object the query matches, grouped under its
 * owning tab, the groups by their best object then TAB_ORDER, the objects by match tier then
 * prominence then the tab's own order.
 *
 * @param {SearchEnumeration} enumeration
 * @param {unknown} query
 * @param {{ tabs?: ReadonlyArray<string>|null }} [options]  the tab ids the viewer has; a
 *   family whose tab is absent is dropped (null keeps every family).
 * @returns {{ total: number, groups: SearchGroup[] }}
 */
export function rankDossierObjects(enumeration, query, options = {}) {
  if (!isSearchActive(query)) return { total: 0, groups: [] };
  const q = foldSearchText(query);
  const allowed = Array.isArray(options.tabs) ? new Set(options.tabs) : null;
  /** @type {Map<string, SearchHit[]>} */
  const byTab = new Map();
  for (const object of enumeration.objects) {
    if (allowed && !allowed.has(object.tab)) continue;
    const score = matchScore(object, q);
    if (score === MATCH.NONE) continue;
    const list = byTab.get(object.tab) || [];
    list.push({ ...object, score });
    byTab.set(object.tab, list);
  }
  const tabRank = (/** @type {string} */ tab) => {
    const i = SEARCH_TAB_ORDER.indexOf(tab);
    return i < 0 ? SEARCH_TAB_ORDER.length : i;
  };
  /** @type {SearchGroup[]} */
  const groups = [...byTab].map(([tab, hits]) => {
    hits.sort((a, b) => b.score - a.score || b.prominence - a.prominence || a.order - b.order);
    return { tab, score: hits[0].score, objects: hits };
  });
  groups.sort((a, b) => b.score - a.score || tabRank(a.tab) - tabRank(b.tab));
  return { total: groups.reduce((n, g) => n + g.objects.length, 0), groups };
}

/**
 * Enumerate and rank in one call.
 * @param {unknown} settlement
 * @param {unknown} query
 * @param {SearchViewer} [viewer]
 * @param {{ tabs?: ReadonlyArray<string>|null, customTraditions?: unknown }} [options]
 * @returns {{ settlement: Record<string, unknown>, total: number, groups: SearchGroup[] }}
 */
export function searchDossier(settlement, query, viewer = {}, options = {}) {
  const enumeration = enumerateDossierObjects(settlement, viewer, options);
  return { settlement: enumeration.settlement, ...rankDossierObjects(enumeration, query, options) };
}

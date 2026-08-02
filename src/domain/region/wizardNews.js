import { goodCriticality } from './goodsCatalog.js';
import { ensureRegionalGraphOnce } from './graph.js';
import { wallClockNow } from '../clock.js';
import { compareCodepoint } from '../deterministicSort.js';

export const WIZARD_NEWS_SCHEMA_VERSION = 1;
export const WIZARD_NEWS_SIGNIFICANCE = Object.freeze({
  MAJOR: 'major',
  NOTABLE: 'notable',
  ROUTINE: 'routine',
});

const MAX_ENTRIES = 240;

// ── Types ──────────────────────────────────────────────────────────────────

/** @typedef {{id?: string, label?: string}} ImpactGood */

/**
 * A queued regional impact (region/propagation.js shape) as this module
 * reads it.
 * @typedef {Object} WizardRegionalImpact
 * @property {string | number} [id]
 * @property {string} [kind]
 * @property {string} [status]
 * @property {string} [channelType]
 * @property {string | number} [channelId]
 * @property {number} [severity]
 * @property {number} [waveDepth]
 * @property {number} [delayTicks]
 * @property {ImpactGood[]} [goods]
 * @property {string | number} [sourceSettlementId]
 * @property {string | number} [targetSettlementId]
 * @property {string} [sourceSettlementName]
 * @property {string} [targetSettlementName]
 * @property {Array<string | number>} [pathSettlementIds]
 * @property {string} [explanation]
 * @property {string | null} [sourceEventId]
 */

/**
 * @typedef {Object} WizardGraphEvent
 * @property {string} [id]
 * @property {Array<string | number>} [impactIds]
 * @property {{type?: string, id?: string}} [sourceEvent]
 */

/**
 * The regional-graph slice this module reads (ensureRegionalGraph output).
 * @typedef {Object} WizardGraph
 * @property {Array<{id?: string | number, name?: string}>} [nodes]
 * @property {Array<{id?: string | number, type?: string}>} [channels]
 * @property {WizardGraphEvent[]} [eventLog]
 * @property {WizardRegionalImpact[]} [queuedImpacts]
 */

/**
 * Canonical normalized feed entry (normalizeEntry output).
 * @typedef {Object} WizardNewsEntry
 * @property {number} schemaVersion
 * @property {string} id
 * @property {string} createdAt
 * @property {number} tick
 * @property {string} scope
 * @property {string} significance
 * @property {number} score
 * @property {string} headline
 * @property {string} summary
 * @property {string} kind
 * @property {string | null} impactKind
 * @property {string | null} channelType
 * @property {number} severity
 * @property {string[]} settlementIds
 * @property {string[]} [settlementNames] NEWS ADDRESS LAW reader layer.
 * @property {string[]} impactIds
 * @property {string[]} channelIds
 * @property {string | null} sourceEventId
 * @property {string[]} tags
 * @property {string[]} reasons
 * @property {string[]} [npcIds]      NEWS ADDRESS LAW actor layer — present only when non-empty.
 * @property {string[]} [factionIds]  NEWS ADDRESS LAW actor layer — present only when non-empty.
 * @property {string} [source]
 * @property {boolean} [covert]
 * @property {string} [familyId] SP-6 structural template family.
 */

/**
 * A raw (possibly partial / persisted) entry accepted by normalizeEntry.
 * @typedef {Object} RawWizardNewsEntry
 * @property {string | number} [id]
 * @property {string} [createdAt]
 * @property {number} [tick]
 * @property {string} [scope]
 * @property {string} [significance]
 * @property {number} [score]
 * @property {string} [headline]
 * @property {string} [summary]
 * @property {string} [kind]
 * @property {string | null} [impactKind]
 * @property {string | null} [channelType]
 * @property {number} [severity]
 * @property {Array<string | number | null | undefined>} [settlementIds]
 * @property {Array<string | number | null | undefined>} [settlementNames]
 * @property {Array<string | number | null | undefined>} [impactIds]
 * @property {Array<string | number | null | undefined>} [channelIds]
 * @property {string | null} [sourceEventId]
 * @property {Array<string | number | null | undefined>} [tags]
 * @property {Array<string | number | null | undefined>} [reasons]
 * @property {Array<string | number | null | undefined>} [npcIds]
 * @property {Array<string | number | null | undefined>} [factionIds]
 * @property {string} [source]
 * @property {boolean} [covert]
 * @property {string} [familyId]
 */

/**
 * @typedef {Object} WizardNewsOptions
 * @property {string} [now]          deterministic timestamp for replay
 * @property {number} [tick]
 * @property {string} [createdAt]
 * @property {Object} [graph]
 * @property {string} [transition]
 * @property {WizardGraphEvent | null} [event]
 * @property {number} [maxEntries]
 */

/**
 * @typedef {Object} WizardNewsFeed
 * @property {number} [schemaVersion]
 * @property {number} [currentTick]
 * @property {RawWizardNewsEntry[]} [entries]
 * @property {string} [updatedAt]
 */

/** @type {Set<string | undefined>} */
const CRITICAL_IMPACT_KINDS = new Set([
  'import_shortage',
  'authority_instability',
  'protection_gap',
  'conflict_pressure',
  'migration_pressure',
  'route_disruption',
]);

/** @type {Set<string | undefined>} */
const CRITICAL_CHANNEL_TYPES = new Set([
  'trade_dependency',
  'trade_route',
  'political_authority',
  'military_protection',
  'war_front',
  'resource_competition',
]);

/** @type {Readonly<Record<string, string>>} */
const IMPACT_LABELS = Object.freeze({
  import_shortage: 'Import shortage',
  export_market_loss: 'Export market loss',
  route_disruption: 'Route disruption',
  authority_instability: 'Authority instability',
  tax_revenue_disruption: 'Revenue disruption',
  protection_gap: 'Protection gap',
  service_disruption: 'Service disruption',
  conflict_pressure: 'Conflict pressure',
  migration_pressure: 'Migration pressure',
  information_shock: 'Information shock',
  criminal_pressure: 'Criminal pressure',
  religious_pressure: 'Religious pressure',
  // [domain-events-region-7] G1d — the relief lane's positive-sign beat.
  relief: 'Regional relief',
});

// Reader-facing scoring receipts. The score and all numeric evidence remain on
// the entry; these closed phrases are the only form the reasons take in prose.
const IMPACT_REASON_PHRASES = Object.freeze({
  high: 'a heavy blow',
  meaningful: 'a real blow',
  criticalImpact: 'a matter that cuts deep',
  criticalChannel: 'carried along a vital road',
  cascade: 'spreading from town to town',
  broad: 'reaching across the country',
  criticalGoods: 'touching goods the country cannot do without',
  importantGoods: 'touching goods that matter',
  applied: 'the effect has taken hold',
  ready: 'the long wait is over',
  resolved: 'a great pressure lifted',
  expired: 'the danger has passed',
  routine: 'a quiet matter',
});

// The regional graph keeps the typed channel on the record. Prose speaks the
// same fact through a finite world vocabulary instead of printing an engine key.
/** @type {Readonly<Record<string, string>>} */
const CHANNEL_PHRASES = Object.freeze({
  trade_dependency: 'through the trade that binds the two towns',
  export_market: 'through the markets they share',
  trade_route: 'along the trade roads',
  political_authority: 'through the chain of authority',
  tax_obligation: 'along the tax road',
  military_protection: 'under the shield that joins them',
  war_front: 'along the war front',
  resource_competition: 'through their struggle over scarce goods',
  service_dependency: 'through the services one town owes the other',
  religious_authority: 'through the temples that bind them',
  criminal_corridor: 'along the hidden roads of the underworld',
  migration_pressure: 'along the roads taken by the displaced',
  information_flow: 'by rumour and messenger',
});

function nowIso() {
  return wallClockNow();
}

/**
 * @param {unknown} value
 * @param {number} [fallback]
 * @returns {number}
 */
function finiteNumber(value, fallback = 0) {
  return /** @type {number} */ (Number.isFinite(value) ? value : fallback);
}

/**
 * @param {unknown} value
 * @returns {number}
 */
function clamp01(value) {
  const n = finiteNumber(value, 0);
  return Math.max(0, Math.min(1, n));
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function human(value) {
  if (!value) return '';
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * @param {string | null | undefined} kind
 * @returns {string}
 */
function impactLabel(kind) {
  return IMPACT_LABELS[/** @type {string} */ (kind)] || human(kind) || 'Regional pressure';
}

/**
 * @param {WizardGraph} graph
 * @returns {Map<string, string>}
 */
function nodeNameMap(graph) {
  // Map only REALLY-NAMED nodes: graph normalization (region/graph.js) defaults a
  // nameless node's name to String(node.id), so a node "has a name" that is just
  // its raw internal id. Exclude those (name === id) as well as the truly nameless
  // so the headline/summary fallback chains reach a neutral in-world phrase, never
  // the raw id inside diegetic copy.
  return new Map(
    (graph.nodes || [])
      .filter(node => node && node.name && String(node.name) !== String(node.id))
      .map(node => /** @type {[string, string]} */ ([String(node.id), String(node.name)])),
  );
}

/**
 * @param {WizardGraph} graph
 * @returns {Map<string, {id?: string | number, type?: string}>}
 */
function channelMap(graph) {
  return new Map((graph.channels || []).map(channel => /** @type {[string, {id?: string | number, type?: string}]} */ ([String(channel.id), channel])));
}

/**
 * @param {WizardGraph} graph
 * @param {string | number | null | undefined} impactId
 * @returns {WizardGraphEvent | null}
 */
function eventForImpact(graph, impactId) {
  if (!impactId) return null;
  return (graph.eventLog || []).find(event =>
    Array.isArray(event.impactIds) && event.impactIds.map(String).includes(String(impactId))
  ) || null;
}

/**
 * @param {ImpactGood[]} [goods]
 * @returns {number}
 */
function maxCriticality(goods = []) {
  return (goods || []).reduce((max, good) => Math.max(max, goodCriticality(good)), 0);
}

/**
 * Compact an id list: drop falsy members, stringify, dedupe. NON-ARRAY INPUT
 * DEGRADES TO EMPTY rather than throwing — this runs on PERSISTED save data
 * (ensureWizardNewsFeed re-normalizes every stored entry on every read), and a
 * malformed or hand-edited field must not take the whole feed down with a
 * TypeError. Degrading here is the same fail-closed posture normalizeEntry
 * already applies to every other field it reads.
 * @param {unknown} [values]
 * @returns {string[]}
 */
function compactIds(values = []) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter(Boolean).map(String))];
}

/** Names are an ADDRESS CHAIN parallel to settlementIds, not a set. Preserve two
 * distinct settlements that honestly share one name instead of deduplicating them. */
function compactNames(values = []) {
  if (!Array.isArray(values)) return [];
  return values.filter(value => value != null && value !== '').map(String);
}

/**
 * @param {WizardRegionalImpact} impact
 * @returns {string[]}
 */
function pathSettlementIds(impact) {
  return compactIds([
    impact.sourceSettlementId,
    ...(Array.isArray(impact.pathSettlementIds) ? impact.pathSettlementIds : []),
    impact.targetSettlementId,
  ]);
}

/**
 * @param {WizardRegionalImpact} impact
 * @param {string} [transition]
 * @returns {{score: number, reasons: string[]}}
 */
function scoreImpact(impact, transition = 'queued') {
  const severity = clamp01(impact.severity);
  const pathCount = pathSettlementIds(impact).length;
  const criticality = maxCriticality(impact.goods);
  /** @type {string[]} */
  const reasons = [];
  let score = Math.round(severity * 70);

  if (severity >= 0.75) {
    score += 25;
    reasons.push(IMPACT_REASON_PHRASES.high);
  } else if (severity >= 0.6) {
    score += 15;
    reasons.push(IMPACT_REASON_PHRASES.meaningful);
  }

  if (CRITICAL_IMPACT_KINDS.has(impact.kind)) {
    score += 14;
    reasons.push(IMPACT_REASON_PHRASES.criticalImpact);
  }

  if (CRITICAL_CHANNEL_TYPES.has(impact.channelType)) {
    score += 10;
    reasons.push(IMPACT_REASON_PHRASES.criticalChannel);
  }

  if ((impact.waveDepth || 0) > 0) {
    score += 16;
    reasons.push(IMPACT_REASON_PHRASES.cascade);
  }

  if (pathCount >= 3) {
    score += 14;
    reasons.push(IMPACT_REASON_PHRASES.broad);
  }

  if (criticality >= 0.8) {
    score += 12;
    reasons.push(IMPACT_REASON_PHRASES.criticalGoods);
  } else if (criticality >= 0.65) {
    score += 7;
    reasons.push(IMPACT_REASON_PHRASES.importantGoods);
  }

  if (transition === 'applied') {
    score += 10;
    reasons.push(IMPACT_REASON_PHRASES.applied);
  } else if (transition === 'ready') {
    score += 8;
    reasons.push(IMPACT_REASON_PHRASES.ready);
  } else if (transition === 'resolved' && severity >= 0.6) {
    score += 6;
    reasons.push(IMPACT_REASON_PHRASES.resolved);
  } else if (transition === 'expired') {
    score += 4;
    reasons.push(IMPACT_REASON_PHRASES.expired);
  }

  return { score, reasons };
}

/**
 * @param {WizardRegionalImpact} impact
 * @param {string} [transition]
 * @returns {{score: number, reasons: string[], significance: string}}
 */
function significanceForImpact(impact, transition = 'queued') {
  const severity = clamp01(impact.severity);
  const pathCount = pathSettlementIds(impact).length;
  const { score, reasons } = scoreImpact(impact, transition);
  const major =
    score >= 85
    || severity >= 0.75
    || ((impact.waveDepth || 0) > 0 && severity >= 0.4)
    || pathCount >= 3
    || (transition === 'applied' && severity >= 0.65);

  return {
    score,
    reasons: reasons.length ? reasons : [IMPACT_REASON_PHRASES.routine],
    significance: major ? WIZARD_NEWS_SIGNIFICANCE.MAJOR : WIZARD_NEWS_SIGNIFICANCE.NOTABLE,
  };
}

/**
 * @param {WizardRegionalImpact} impact
 * @returns {string}
 */
function scopeForImpact(impact) {
  if (pathSettlementIds(impact).length >= 3 || (impact.waveDepth || 0) > 0) return 'realm';
  if (impact.sourceSettlementId && impact.targetSettlementId && String(impact.sourceSettlementId) !== String(impact.targetSettlementId)) return 'regional';
  return 'settlement';
}

/**
 * @param {WizardRegionalImpact} impact
 * @param {string} transition
 * @param {Map<string, string>} names
 * @returns {string}
 */
function headlineForImpact(impact, transition, names) {
  const label = impactLabel(impact.kind);
  // C2 (bar 4): the neutral fallback speaks the world's register, never the
  // software's — "a far settlement". The two templates that once LED with the
  // target now lead with the label instead, so the lowercase phrase serves every
  // position (and no capitalized twin literal is needed — the eager-byte law).
  // Raw ids still never leak (finding-11's law holds).
  const target = names.get(String(impact.targetSettlementId)) || impact.targetSettlementName || 'a far settlement';

  if ((impact.waveDepth || 0) > 0 && (transition === 'queued' || transition === 'ready')) {
    return `Regional cascade reaches ${target}`;
  }
  // [domain-events-region-7] G1d — relief reads as a POSITIVE beat (pressure eases),
  // not "faces relief" / "relief takes hold".
  if (impact.kind === 'relief') {
    if (transition === 'applied' || transition === 'resolved') return `Pressure eases in ${target}`;
    return `Relief reaches ${target}`;
  }
  if (transition === 'ready') return `${label} reaches ${target}`;
  if (transition === 'applied') return `${label} takes hold in ${target}`;
  if (transition === 'resolved') return `${label} is resolved in ${target}`;
  if (transition === 'ignored') return `${label} is dismissed for ${target}`;
  if (transition === 'expired') return `${label} passes before reaching ${target}`;
  return `${label} weighs on ${target}`;
}

/**
 * @param {WizardRegionalImpact} impact
 * @param {string} transition
 * @param {Map<string, string>} names
 * @param {Map<string, {id?: string | number, type?: string}>} channels
 * @returns {string}
 */
function summaryForImpact(impact, transition, names, channels) {
  const source = names.get(String(impact.sourceSettlementId)) || impact.sourceSettlementName || 'A regional source';
  const target = names.get(String(impact.targetSettlementId)) || impact.targetSettlementName || 'the target';
  const channel = channels.get(String(impact.channelId));
  const channelType = String(impact.channelType || channel?.type || '');
  const road = CHANNEL_PHRASES[channelType] || 'across the region';
  const goods = (impact.goods || [])
    .map((good) => {
      if (typeof good === 'string') return human(good);
      return good?.label || human(good?.id);
    })
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');
  const goodsPart = goods ? `, with ${goods} caught in the balance` : '';
  const label = impactLabel(impact.kind).toLowerCase();
  if (transition === 'ready') return `${impactLabel(impact.kind)} from ${source} now stands at ${target}'s door ${road}${goodsPart}.`;
  if (transition === 'applied') return `${impactLabel(impact.kind)} from ${source} has taken hold in ${target} ${road}${goodsPart}.`;
  if (transition === 'resolved') return `${target} has broken the ${label} that came from ${source} ${road}${goodsPart}.`;
  if (transition === 'ignored') return `${target} has turned aside the ${label} that came from ${source} ${road}${goodsPart}.`;
  if (transition === 'expired') return `${impactLabel(impact.kind)} from ${source} faded before it could reach ${target} ${road}${goodsPart}.`;
  return `${impactLabel(impact.kind)} is moving from ${source} toward ${target} ${road}${goodsPart}.`;
}

/**
 * @param {WizardRegionalImpact} impact
 * @param {string} transition
 * @returns {string[]}
 */
function tagList(impact, transition) {
  return compactIds([
    transition,
    impact.kind,
    impact.channelType,
    ...(impact.goods || []).map(g => g.id || g.label),
    (impact.waveDepth || 0) > 0 ? 'cascade' : null,
  ]);
}

// Deterministic timestamps: callers thread options.now so replay stamps no
// wall-clock time; the wall clock is the fallback ONLY when not provided.
/**
 * @param {RawWizardNewsEntry | null | undefined} entry
 * @param {WizardNewsOptions} [options]
 * @returns {WizardNewsEntry | null}
 */
function normalizeEntry(entry, options = {}) {
  if (!entry?.id) return null;
  const familyId = entry.familyId ? String(entry.familyId) : '';
  const severity = clamp01(entry.severity);
  const score = Math.max(0, Math.round(finiteNumber(entry.score, severity * 70)));
  const significance = entry.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR
    ? WIZARD_NEWS_SIGNIFICANCE.MAJOR
    : familyId && entry.significance === WIZARD_NEWS_SIGNIFICANCE.ROUTINE
      ? WIZARD_NEWS_SIGNIFICANCE.ROUTINE
      : WIZARD_NEWS_SIGNIFICANCE.NOTABLE;

  return {
    schemaVersion: WIZARD_NEWS_SCHEMA_VERSION,
    id: String(entry.id),
    createdAt: entry.createdAt || options.now || nowIso(),
    tick: Math.max(0, Math.floor(finiteNumber(entry.tick, 0))),
    scope: entry.scope || 'regional',
    significance,
    score,
    headline: entry.headline || 'Regional update',
    summary: entry.summary || '',
    kind: entry.kind || 'queued',
    impactKind: entry.impactKind || null,
    channelType: entry.channelType || null,
    severity,
    settlementIds: compactIds(entry.settlementIds),
    // The reader half of the governed SP-6 address chain. It rides familyId so
    // existing v1 producers that happened to pass names remain byte-identical
    // when the WR-2 flag is dark; new governed rows retain both together.
    ...(familyId && compactNames(entry.settlementNames).length
      ? { settlementNames: compactNames(entry.settlementNames) }
      : {}),
    impactIds: compactIds(entry.impactIds),
    channelIds: compactIds(entry.channelIds),
    sourceEventId: entry.sourceEventId || null,
    tags: compactIds(entry.tags),
    reasons: compactIds(entry.reasons),
    // THE NEWS ADDRESS LAW's ACTOR layer (T4 ONE-REGEN batch). `settlementIds`
    // already carries the place; these carry the SUBJECT — the npc or faction the
    // beat is about — as TYPED ids, so the Herald links a subject instead of
    // scanning its own headline prose for a name. Ids are minted only where a
    // composer already holds the typed identity, in the realm entity web's own
    // spelling (`<saveId>:<localId>`), so a rendered link resolves or degrades to
    // exactly today's text.
    //
    // BYTE-NEUTRAL BY CONSTRUCTION (the V-17 `source` idiom above): the key is
    // spread in ONLY when a non-empty id list survives compaction. Every entry
    // minted without ids — and every entry already persisted in a save, which
    // ensureWizardNewsFeed re-normalizes on every read — serializes exactly as
    // before. Absent-tolerant on old saves without a migration.
    ...(compactIds(entry.npcIds).length ? { npcIds: compactIds(entry.npcIds) } : {}),
    ...(compactIds(entry.factionIds).length ? { factionIds: compactIds(entry.factionIds) } : {}),
    // V-17 provenance: table-authored history (source:'table') is distinguishable
    // from world-authored (the soak excludes 'table'). BYTE-NEUTRAL: world entries
    // pass no `source`, so this spread adds nothing and their serialization is
    // unchanged; only table-imported entries carry the field.
    ...(entry.source ? { source: entry.source } : {}),
    // Covert pass-through (the same byte-neutral idiom): no generated feed writes
    // `covert` today, so every existing entry serializes unchanged — but an
    // imported/future covert entry KEEPS its flag through normalization, so the
    // World Book's player-face isCovertEntry filter is live end-to-end instead of
    // a dead branch (SB2 finding: covert marks must not survive into the handout).
    ...(entry.covert === true ? { covert: true } : {}),
    // SP-6 family identity is metadata, never prose. It records which structural
    // template produced the rendered sentence; changing slot fills cannot disguise
    // a repeated family from the soak instrument.
    ...(familyId ? { familyId } : {}),
  };
}

/**
 * @param {WizardNewsEntry[]} entries
 * @returns {WizardNewsEntry[]}
 */
function sortEntries(entries) {
  return entries.slice().sort((a, b) => {
    if (b.tick !== a.tick) return b.tick - a.tick;
    if (b.score !== a.score) return b.score - a.score;
    return compareCodepoint(b.createdAt, a.createdAt);
  });
}

/**
 * Cap the feed to `max`. At or below the cap this is the byte-identical recency
 * slice (`sortedEntries.slice(0, max)`). Above it: keep the most-recent `max`
 * (RECENCY — so recent low-volume notables, e.g. a season marker, always
 * survive), then RESCUE the heads of major arcs that recency would flush — one
 * slot per story, so a high-volume major arc (e.g. a 100-entry crime churn)
 * contributes at most its single newest entry and can never dominate the feed.
 * Each rescue displaces the OLDEST recency entry; rescues are bounded to
 * floor(max/2) so recency always keeps the majority of the window. Pure +
 * deterministic: operates on the pre-sorted array and filters by reference, so
 * the global newest-first order is preserved and the total is always <= max.
 * @param {WizardNewsEntry[]} sortedEntries  already sorted newest-first
 * @param {number} [max]
 * @returns {WizardNewsEntry[]}
 */
function capEntries(sortedEntries, max = MAX_ENTRIES) {
  if (sortedEntries.length <= max) return sortedEntries.slice(0, max);
  const recent = sortedEntries.slice(0, max);
  /** @type {Set<WizardNewsEntry>} */
  const recentSet = new Set(recent);
  /** @type {Set<string>} */
  const majorArcs = new Set();
  for (const e of sortedEntries) {
    if (e.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR) majorArcs.add(arcIdForEntry(e));
  }
  // One HEAD (newest entry) per major arc, kept only when recency would flush it
  // (an orphan: its whole arc fell outside the most-recent-`max` window).
  /** @type {Set<string>} */
  const seenArc = new Set();
  /** @type {WizardNewsEntry[]} */
  const orphanHeads = [];
  for (const e of sortedEntries) {            // newest-first
    const a = arcIdForEntry(e);
    if (seenArc.has(a)) continue;
    seenArc.add(a);
    if (majorArcs.has(a) && !recentSet.has(e)) orphanHeads.push(e);
  }
  if (orphanHeads.length === 0) return recent;              // identical to pure recency
  const rescue = orphanHeads.slice(0, Math.floor(max / 2)); // never displace more than half the window
  // Each rescue displaces the OLDEST recency entry. Rescues are orphans (chosen
  // only when NOT in `recent`), so `recent ∩ rescue = ∅` and dropping the oldest
  // `rescue.length` recency entries reduces to a head slice: keep the newest
  // (max − rescue.length) recency entries, then add the rescued heads.
  /** @type {Set<WizardNewsEntry>} */
  const keep = new Set([...recent.slice(0, max - rescue.length), ...rescue]);
  return sortedEntries.filter(e => keep.has(e));            // preserve global order, total === max
}

/**
 * @param {WizardNewsFeed | null | undefined} [feed]
 * @param {WizardNewsOptions} [options]
 * @returns {{schemaVersion: number, currentTick: number, entries: WizardNewsEntry[], updatedAt: string}}
 */
export function ensureWizardNewsFeed(feed = {}, options = {}) {
  const entries = /** @type {WizardNewsEntry[]} */ (Array.isArray(feed?.entries)
    ? feed.entries.map(entry => normalizeEntry(entry, options)).filter(Boolean)
    : []);
  return {
    schemaVersion: WIZARD_NEWS_SCHEMA_VERSION,
    currentTick: Math.max(0, Math.floor(finiteNumber(feed?.currentTick, 0))),
    entries: capEntries(sortEntries(entries), MAX_ENTRIES),
    updatedAt: feed?.updatedAt || options.now || nowIso(),
  };
}

/**
 * Project one stored Wizard News feed for a reader without rewriting or
 * re-normalizing it. The DM receives the original feed, byte for byte. Every
 * other audience fails closed: covert entries and entries explicitly authored
 * for a DM-only audience are omitted while the feed's schema, clock, and other
 * sidecar fields are preserved.
 *
 * This is deliberately a read-side projection rather than a second feed. A
 * covert fact stays available to the DM and to replay, but cannot cross a
 * player/public presentation seam merely because that surface reads the shared
 * campaign feed directly.
 *
 * @template T
 * @param {T} feed
 * @param {string} [audience]
 * @returns {T}
 */
export function projectWizardNewsForAudience(feed, audience = 'dm') {
  if (audience === 'dm' || !feed || typeof feed !== 'object') return feed;
  const record = /** @type {{entries?: unknown}} */ (feed);
  if (!Array.isArray(record.entries)) return feed;

  const entries = record.entries.filter((entry) => {
    if (!entry || typeof entry !== 'object') return true;
    const row = /** @type {{covert?: unknown, audience?: unknown}} */ (entry);
    return row.covert !== true && row.audience !== 'dm-only' && row.audience !== 'dm';
  });
  if (entries.length === record.entries.length) return feed;
  return /** @type {T} */ ({ ...record, entries });
}

/**
 * @param {WizardNewsFeed | null | undefined} [feed]
 * @param {number} [ticks]
 * @param {WizardNewsOptions} [options]
 * @returns {{schemaVersion: number, currentTick: number, entries: WizardNewsEntry[], updatedAt: string}}
 */
export function advanceWizardNewsFeed(feed = {}, ticks = 1, options = {}) {
  const current = ensureWizardNewsFeed(feed, options);
  const amount = Math.max(1, Math.floor(finiteNumber(ticks, 1)));
  return {
    ...current,
    currentTick: current.currentTick + amount,
    updatedAt: options.now || nowIso(),
  };
}

/**
 * @param {WizardRegionalImpact | null | undefined} impact
 * @param {WizardNewsOptions} [options]
 * @returns {WizardNewsEntry | null}
 */
export function createWizardNewsEntryFromImpact(impact, options = {}) {
  if (!impact?.id) return null;
  // performance-scale-7: the diff below passes its already-ensured `after` graph per
  // changed impact — ensureRegionalGraphOnce skips the redundant re-normalization.
  const graph = ensureRegionalGraphOnce(options.graph || {});
  const transition = options.transition || impact.status || 'queued';
  const tick = Math.max(0, Math.floor(finiteNumber(options.tick, 0)));
  const names = nodeNameMap(graph);
  const channels = channelMap(graph);
  const event = options.event || eventForImpact(graph, impact.id);
  const { significance, score, reasons } = significanceForImpact(impact, transition);
  const createdAt = options.createdAt || options.now || nowIso();

  return normalizeEntry({
    id: `wizard_news.${tick}.${transition}.${impact.id}`,
    createdAt,
    tick,
    scope: scopeForImpact(impact),
    significance,
    score,
    headline: headlineForImpact(impact, transition, names),
    summary: summaryForImpact(impact, transition, names, channels),
    kind: transition,
    impactKind: impact.kind,
    channelType: impact.channelType || channels.get(String(impact.channelId))?.type || null,
    severity: impact.severity,
    settlementIds: pathSettlementIds(impact),
    impactIds: [impact.id],
    channelIds: [impact.channelId],
    sourceEventId: event?.sourceEvent?.id || event?.id || impact.sourceEventId || null,
    tags: tagList(impact, transition),
    reasons,
  });
}

/**
 * @param {WizardGraph | null | undefined} [beforeGraph]
 * @param {WizardGraph | null | undefined} [afterGraph]
 * @param {WizardNewsOptions} [options]
 * @returns {WizardNewsEntry[]}
 */
export function deriveWizardNewsEntriesFromGraphChange(beforeGraph = {}, afterGraph = {}, options = {}) {
  // performance-scale-7: this diff runs per changed outcome application, so re-
  // normalizing the whole graph ×2 here multiplied by the outcome count. The call
  // sites already hold ensureRegionalGraph outputs (branded), so the Once form skips
  // the redundant normalization; an unbranded/rehydrated graph still gets a full ensure.
  const before = ensureRegionalGraphOnce(/** @type {import('./graph.js').RegionGraph} */ (beforeGraph || {}));
  const after = ensureRegionalGraphOnce(/** @type {import('./graph.js').RegionGraph} */ (afterGraph || {}));
  const beforeById = new Map(before.queuedImpacts.map(impact => [impact.id, impact]));
  const entries = [];
  const tick = Math.max(0, Math.floor(finiteNumber(options.tick, 0)));
  const createdAt = options.createdAt || options.now || nowIso();

  for (const impact of after.queuedImpacts) {
    const previous = beforeById.get(impact.id);
    let transition = null;

    if (!previous) {
      transition = impact.status || 'queued';
    } else if (previous.status !== impact.status) {
      transition = impact.status;
    } else if (
      impact.status === 'queued'
      && (previous.delayTicks || 0) > 0
      && (impact.delayTicks || 0) <= 0
    ) {
      transition = 'ready';
    }

    if (!transition) continue;
    const entry = createWizardNewsEntryFromImpact(impact, {
      graph: after,
      transition,
      tick,
      createdAt,
    });
    if (entry) entries.push(entry);
  }

  return sortEntries(entries);
}

/**
 * @param {WizardNewsFeed | null | undefined} [feed]
 * @param {RawWizardNewsEntry[]} [entries]
 * @param {WizardNewsOptions} [options]
 * @returns {{schemaVersion: number, currentTick: number, entries: WizardNewsEntry[], updatedAt: string}}
 */
export function appendWizardNewsEntries(feed = {}, entries = [], options = {}) {
  const current = ensureWizardNewsFeed(feed, options);
  const byId = new Map(current.entries.map(entry => [entry.id, entry]));
  for (const raw of entries || []) {
    const entry = normalizeEntry(raw, options);
    if (!entry) continue;
    byId.set(entry.id, { ...(byId.get(entry.id) || {}), ...entry });
  }
  return {
    ...current,
    entries: capEntries(sortEntries([...byId.values()]), options.maxEntries || MAX_ENTRIES),
    updatedAt: entries?.length ? (options.now || nowIso()) : current.updatedAt,
  };
}

// ── THE AUTHORING GUARD (habitat removal for the SILENT ID-LESS DROP) ───────────
//
// THE CLASS: a world-pulse mover authors a receipt with a kind, a headline, reasons
// and no `id`. normalizeEntry returns null on `!entry?.id` and the sink push below is
// id-gated, so the beat is dropped from BOTH the canonical feed and the audit receipt
// — silently, on the ONE path an author never re-reads. The subsystem fires, narrates
// nothing, and every downstream reading of it (Herald, Chronicle, soak observation)
// records an honest zero. Two members lived undetected for their whole life:
// momentum.js climbDownNews and the four supplyWebWarfare.js campaign receipts, both
// fixed 2026-07-31. Nothing would have caught a third.
//
// THE GUARD makes the drop LOUD at the seam where entries are AUTHORED rather than
// where they are normalized. That distinction is load-bearing: normalizeEntry also
// runs over PERSISTED save data on every read (ensureWizardNewsFeed), where degrading
// a malformed row is the deliberate fail-closed posture and throwing would take a save
// down. appendObservedWizardNewsEntries has exactly one caller family — pulseKernel's
// thirteen mover-append sites — and every entry reaching it is freshly minted this
// tick, so an id-less entry here is always an authoring bug and never bad save data.
//
// SAFETY (the residueStripGuard.js precedent, verbatim posture):
//   • Pure read; it never mutates an entry or the feed → byte-neutral to the simulation.
//   • It runs ONLY under NODE_ENV==='test' → never in the browser, never in the soak's
//     default run. A mistaken check can only surface as a TEST failure, never a silent
//     determinism corruption.
// So a future author that forgets an id reds the suite the moment ANY test drives its
// mover, instead of shipping a subsystem that narrates into a void.

/** True only in a Node test run (vitest sets NODE_ENV=test). Browser / prod / soak = off.
 *  Reads `process` reflectively and narrows it to a REAL shape rather than taking the
 *  loose cast the sibling guards use: this file's any-cast baseline is 0, and that
 *  ratchet is fix-the-types, never widen-the-baseline. (Do not name the loose cast
 *  literally here either. The detector is a text scan, so quoting it in prose counts
 *  as one.) */
function authoringGuardEnabled() {
  try {
    const proc = /** @type {{ env?: { NODE_ENV?: string } } | undefined} */ (
      Reflect.get(globalThis, 'process')
    );
    return proc?.env?.NODE_ENV === 'test';
  } catch {
    return false;
  }
}

/**
 * The distinct `kind`s among freshly-authored entries that carry no id (deduped,
 * codepoint-sorted). Pure; exported for direct unit testing.
 * @param {RawWizardNewsEntry[]} [entries]
 * @returns {string[]}
 */
export function findIdlessAuthoredEntries(entries = []) {
  return [...new Set((entries || [])
    .filter(entry => entry && !entry.id)
    .map(entry => String(entry.kind || 'unknown')))].sort(compareCodepoint);
}

/**
 * Test-only assertion on the authoring seam: throws if a mover minted a receipt the
 * feed would silently discard. No-op everywhere but a Node test run, always read-only.
 * @param {RawWizardNewsEntry[]} [entries]
 */
export function assertAuthoredEntriesCarryIds(entries = []) {
  if (!authoringGuardEnabled()) return;
  const kinds = findIdlessAuthoredEntries(entries);
  if (kinds.length) {
    throw new Error(
      '[wizard-news] a mover authored ID-LESS receipt(s), which the feed DROPS silently. kind(s): '
      + kinds.join(', ')
      + '\nAn entry without `id` is refused by normalizeEntry AND skipped by the audit receipt sink,'
      + ' so the beat reaches no reader, no Herald and no soak receipt.'
      + '\nMint one in the house shape `wizard_news.${tick}.<slug>.<stableParts>` (see'
      + ' generosityNews.js, upswingKernel.js), using stablePart on actor/target ids and'
      + ' enough parts that two beats of the same kind cannot collide within one tick.',
    );
  }
}

/**
 * Audit-only append seam. Valid raw receipts are copied into `receiptSink`
 * before the canonical feed normalizes, dedupes, sorts, and caps them. With no
 * sink this delegates exactly to appendWizardNewsEntries.
 * @param {WizardNewsFeed | null | undefined} [feed]
 * @param {RawWizardNewsEntry[]} [entries]
 * @param {WizardNewsOptions} [options]
 * @param {RawWizardNewsEntry[] | null} [receiptSink]
 * @returns {ReturnType<typeof appendWizardNewsEntries>}
 */
export function appendObservedWizardNewsEntries(feed = {}, entries = [], options = {}, receiptSink = null) {
  assertAuthoredEntriesCarryIds(entries);
  if (Array.isArray(receiptSink)) {
    for (const entry of entries || []) if (entry?.id) receiptSink.push(entry);
  }
  return appendWizardNewsEntries(feed, entries, options);
}

/**
 * Fold a per-settlement pulse mover's result into the kernel's threaded state (the
 * upswing/lifecycle/growth applier — the "minimal-line" mover-registration idiom that keeps
 * pulseKernel under its frozen line ceiling). A mover returns
 * `{ changed, worldState, settlementUpdates?, newsEntries }`; when UNCHANGED it returns the
 * same references, so this is byte-identical to the inline `if (r.changed) { … }` blocks it
 * replaces. Pure; no side effects.
 * @param {{ changed?: boolean, worldState?: Record<string, unknown>, settlementUpdates?: unknown[], newsEntries?: unknown[] }} result
 * @param {Record<string, unknown>} worldState @param {unknown[]} settlementUpdates
 * @param {ReturnType<typeof appendWizardNewsEntries>} wizardNews @param {string|null} now
 * @param {RawWizardNewsEntry[] | null} [receiptSink]
 * @returns {{ worldState: Record<string, unknown>, settlementUpdates: unknown[], wizardNews: ReturnType<typeof appendWizardNewsEntries> }} */
export function applyPulseMover(result, worldState, settlementUpdates, wizardNews, now, receiptSink = null) {
  if (!result || !result.changed) return { worldState, settlementUpdates, wizardNews };
  const news = Array.isArray(result.newsEntries) && result.newsEntries.length
    ? appendObservedWizardNewsEntries(wizardNews, /** @type {Parameters<typeof appendWizardNewsEntries>[1]} */ (result.newsEntries), { now: now ?? undefined }, receiptSink)
    : wizardNews;
  return {
    worldState: result.worldState !== undefined ? result.worldState : worldState,
    settlementUpdates: result.settlementUpdates !== undefined ? result.settlementUpdates : settlementUpdates,
    wizardNews: news,
  };
}

export function summarizeWizardNews(feed = {}) {
  const current = ensureWizardNewsFeed(feed);
  const major = current.entries.filter(entry => entry.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR);
  // Preserve the v1 public return shape: routine is a governed subtype of the
  // existing non-major bucket, not a new unconditional summary key.
  const notables = current.entries.filter(entry => entry.significance !== WIZARD_NEWS_SIGNIFICANCE.MAJOR);
  const byTick = [];
  const groups = new Map();

  for (const entry of current.entries) {
    if (!groups.has(entry.tick)) groups.set(entry.tick, []);
    groups.get(entry.tick).push(entry);
  }

  for (const [tick, entries] of groups.entries()) {
    byTick.push({ tick, entries: sortEntries(entries) });
  }

  byTick.sort((a, b) => b.tick - a.tick);
  return { feed: current, major, notables, byTick, threads: deriveNewsThreads(current.entries) };
}

// ── Arc threading ───────────────────────────────────────────────────────────
// A DM reads news as STORIES, not isolated ticks: an impact that queues, matures
// (ready), takes hold (applied), then resolves is ONE arc; a recurring pressure
// of the same kind on the same place is one escalating arc. Threading collapses
// each arc into a single entry with its progression, so a slow-burning story
// (or a damped-but-repeating world-pulse beat) reads as one thread instead of a
// wall of near-duplicates. Determinism is preserved: arcs order by significance,
// then tick, then score, then a codepoint tiebreak on the stable arc id.

/**
 * Stable arc identity for an entry. A regional impact's lifecycle
 * (queued → ready → applied → resolved) threads on its impact id; anything else
 * threads by (substantive type × primary settlement) so the same kind of
 * pressure recurring on the same place is recognised as one continuing arc.
 * @param {WizardNewsEntry} entry
 * @returns {string}
 */
function arcIdForEntry(entry) {
  if (Array.isArray(entry.impactIds) && entry.impactIds.length) {
    return `impact:${entry.impactIds[0]}`;
  }
  const place = (Array.isArray(entry.settlementIds) && entry.settlementIds[0]) || 'realm';
  const kind = entry.impactKind || entry.kind || 'update';
  return `arc:${kind}:${place}`;
}

/**
 * @param {string} significance
 * @returns {number}
 */
function significanceRank(significance) {
  if (significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR) return 2;
  if (significance === WIZARD_NEWS_SIGNIFICANCE.NOTABLE) return 1;
  return 0;
}

/**
 * A threaded arc.
 * @typedef {Object} WizardNewsThread
 * @property {string} arcId
 * @property {WizardNewsEntry[]} entries   chronological (oldest → newest); each carries entry.thread
 * @property {WizardNewsEntry} head        the latest stage (what the panel renders collapsed)
 * @property {number} size
 * @property {string} significance         highest SP-6a class across the stages
 * @property {number} tick                 head tick (for ordering)
 * @property {number} score                max score across stages
 * @property {string[]} settlementIds      union across stages
 */

/**
 * Group feed entries into arcs. Stamps each entry (on a copy) with
 *   entry.thread = { arcId, stage, priorEntryIds }
 * and returns the arcs newest/most-significant first. Pure; deterministic.
 * @param {WizardNewsEntry[]} entries
 * @returns {WizardNewsThread[]}
 */
export function deriveNewsThreads(entries = []) {
  /** @type {Map<string, WizardNewsEntry[]>} */
  const byArc = new Map();
  for (const entry of entries || []) {
    if (!entry?.id) continue;
    const arcId = arcIdForEntry(entry);
    const bucket = byArc.get(arcId);
    if (bucket) bucket.push(entry);
    else byArc.set(arcId, [entry]);
  }

  /** @type {WizardNewsThread[]} */
  const threads = [];
  for (const [arcId, arcEntries] of byArc.entries()) {
    // Chronological progression: oldest → newest. Codepoint tiebreak keeps the
    // stage order deterministic when two stages land on the same tick.
    const chronological = arcEntries.slice().sort((/** @type {WizardNewsEntry} */ a, /** @type {WizardNewsEntry} */ b) =>
      (a.tick - b.tick) || (a.score - b.score) || compareCodepoint(a.id, b.id));

    /** @type {string[]} */
    const priorEntryIds = [];
    const stamped = chronological.map((/** @type {WizardNewsEntry} */ entry, /** @type {number} */ index) => {
      const thread = { arcId, stage: index + 1, priorEntryIds: [...priorEntryIds] };
      priorEntryIds.push(entry.id);
      return { ...entry, thread };
    });

    const head = stamped[stamped.length - 1];
    threads.push({
      arcId,
      entries: stamped,
      head,
      size: stamped.length,
      significance: stamped.some(e => e.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR)
        ? WIZARD_NEWS_SIGNIFICANCE.MAJOR
        : stamped.some(e => e.significance === WIZARD_NEWS_SIGNIFICANCE.NOTABLE)
          ? WIZARD_NEWS_SIGNIFICANCE.NOTABLE
          : WIZARD_NEWS_SIGNIFICANCE.ROUTINE,
      tick: head.tick,
      score: stamped.reduce((max, e) => Math.max(max, e.score || 0), 0),
      settlementIds: [...new Set(stamped.flatMap(e => e.settlementIds || []))],
    });
  }

  return threads.sort((a, b) =>
    (significanceRank(b.significance) - significanceRank(a.significance))
    || (b.tick - a.tick)
    || (b.score - a.score)
    || compareCodepoint(a.arcId, b.arcId));
}

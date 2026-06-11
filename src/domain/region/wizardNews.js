import { goodCriticality } from './goodsCatalog.js';
import { ensureRegionalGraph } from './graph.js';

export const WIZARD_NEWS_SCHEMA_VERSION = 1;
export const WIZARD_NEWS_SIGNIFICANCE = Object.freeze({
  MAJOR: 'major',
  NOTABLE: 'notable',
});

const MAX_ENTRIES = 240;

const CRITICAL_IMPACT_KINDS = new Set([
  'import_shortage',
  'authority_instability',
  'protection_gap',
  'conflict_pressure',
  'migration_pressure',
  'route_disruption',
]);

const CRITICAL_CHANNEL_TYPES = new Set([
  'trade_dependency',
  'trade_route',
  'political_authority',
  'military_protection',
  'war_front',
  'resource_competition',
]);

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
});

const TRANSITION_LABELS = Object.freeze({
  queued: 'Queued',
  ready: 'Ready',
  applied: 'Applied',
  resolved: 'Resolved',
  ignored: 'Ignored',
  expired: 'Expired',
});

function nowIso() {
  return new Date().toISOString();
}

function finiteNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function clamp01(value) {
  const n = finiteNumber(value, 0);
  return Math.max(0, Math.min(1, n));
}

function human(value) {
  if (!value) return '';
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function impactLabel(kind) {
  return IMPACT_LABELS[kind] || human(kind) || 'Regional pressure';
}

function transitionLabel(transition) {
  return TRANSITION_LABELS[transition] || human(transition) || 'Update';
}

function nodeNameMap(graph) {
  return new Map((graph.nodes || []).map(node => [String(node.id), node.name || String(node.id)]));
}

function channelMap(graph) {
  return new Map((graph.channels || []).map(channel => [String(channel.id), channel]));
}

function eventForImpact(graph, impactId) {
  if (!impactId) return null;
  return (graph.eventLog || []).find(event =>
    Array.isArray(event.impactIds) && event.impactIds.map(String).includes(String(impactId))
  ) || null;
}

function maxCriticality(goods = []) {
  return (goods || []).reduce((max, good) => Math.max(max, goodCriticality(good)), 0);
}

function compactIds(values = []) {
  return [...new Set((values || []).filter(Boolean).map(String))];
}

function pathSettlementIds(impact) {
  return compactIds([
    impact.sourceSettlementId,
    ...(Array.isArray(impact.pathSettlementIds) ? impact.pathSettlementIds : []),
    impact.targetSettlementId,
  ]);
}

function scoreImpact(impact, transition = 'queued') {
  const severity = clamp01(impact.severity);
  const pathCount = pathSettlementIds(impact).length;
  const criticality = maxCriticality(impact.goods);
  const reasons = [];
  let score = Math.round(severity * 70);

  if (severity >= 0.75) {
    score += 25;
    reasons.push('high severity');
  } else if (severity >= 0.6) {
    score += 15;
    reasons.push('meaningful severity');
  }

  if (CRITICAL_IMPACT_KINDS.has(impact.kind)) {
    score += 14;
    reasons.push('critical impact type');
  }

  if (CRITICAL_CHANNEL_TYPES.has(impact.channelType)) {
    score += 10;
    reasons.push('critical regional channel');
  }

  if ((impact.waveDepth || 0) > 0) {
    score += 16;
    reasons.push('chain propagation');
  }

  if (pathCount >= 3) {
    score += 14;
    reasons.push('multi-settlement scope');
  }

  if (criticality >= 0.8) {
    score += 12;
    reasons.push('critical goods involved');
  } else if (criticality >= 0.65) {
    score += 7;
    reasons.push('important goods involved');
  }

  if (transition === 'applied') {
    score += 10;
    reasons.push('effect took hold');
  } else if (transition === 'ready') {
    score += 8;
    reasons.push('delayed effect matured');
  } else if (transition === 'resolved' && severity >= 0.6) {
    score += 6;
    reasons.push('major pressure resolved');
  } else if (transition === 'expired') {
    score += 4;
    reasons.push('threat window closed');
  }

  return { score, reasons };
}

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
    reasons: reasons.length ? reasons : ['routine regional update'],
    significance: major ? WIZARD_NEWS_SIGNIFICANCE.MAJOR : WIZARD_NEWS_SIGNIFICANCE.NOTABLE,
  };
}

function scopeForImpact(impact) {
  if (pathSettlementIds(impact).length >= 3 || (impact.waveDepth || 0) > 0) return 'realm';
  if (impact.sourceSettlementId && impact.targetSettlementId && String(impact.sourceSettlementId) !== String(impact.targetSettlementId)) return 'regional';
  return 'settlement';
}

function headlineForImpact(impact, transition, names) {
  const label = impactLabel(impact.kind);
  const target = names.get(String(impact.targetSettlementId)) || impact.targetSettlementName || impact.targetSettlementId || 'Unknown settlement';

  if ((impact.waveDepth || 0) > 0 && (transition === 'queued' || transition === 'ready')) {
    return `Regional cascade reaches ${target}`;
  }
  if (transition === 'ready') return `${label} reaches ${target}`;
  if (transition === 'applied') return `${label} takes hold in ${target}`;
  if (transition === 'resolved') return `${target} resolves ${label.toLowerCase()}`;
  if (transition === 'ignored') return `${label} is dismissed for ${target}`;
  if (transition === 'expired') return `${label} passes before reaching ${target}`;
  return `${target} faces ${label.toLowerCase()}`;
}

function summaryForImpact(impact, transition, names, channels, event) {
  const source = names.get(String(impact.sourceSettlementId)) || impact.sourceSettlementName || impact.sourceSettlementId || 'A regional source';
  const target = names.get(String(impact.targetSettlementId)) || impact.targetSettlementName || impact.targetSettlementId || 'the target';
  const channel = channels.get(String(impact.channelId));
  const channelType = human(impact.channelType || channel?.type || 'regional channel').toLowerCase();
  const goods = (impact.goods || []).map(g => g.label || g.id).filter(Boolean).slice(0, 3).join(', ');
  const eventType = event?.sourceEvent?.type ? human(event.sourceEvent.type).toLowerCase() : null;
  const explanation = impact.explanation || `${source} is pressuring ${target} through a ${channelType}.`;
  const prefix = `${transitionLabel(transition)} via ${channelType}`;
  const goodsPart = goods ? ` around ${goods}` : '';
  const eventPart = eventType ? ` after ${eventType}` : '';
  return `${prefix}${goodsPart}${eventPart}: ${explanation}`;
}

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
function normalizeEntry(entry, options = {}) {
  if (!entry?.id) return null;
  const severity = clamp01(entry.severity);
  const score = Math.max(0, Math.round(finiteNumber(entry.score, severity * 70)));
  const significance = entry.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR
    ? WIZARD_NEWS_SIGNIFICANCE.MAJOR
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
    impactIds: compactIds(entry.impactIds),
    channelIds: compactIds(entry.channelIds),
    sourceEventId: entry.sourceEventId || null,
    tags: compactIds(entry.tags),
    reasons: compactIds(entry.reasons),
  };
}

function sortEntries(entries) {
  return entries.slice().sort((a, b) => {
    if (b.tick !== a.tick) return b.tick - a.tick;
    if (b.score !== a.score) return b.score - a.score;
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
}

export function ensureWizardNewsFeed(feed = {}, options = {}) {
  const entries = Array.isArray(feed?.entries)
    ? feed.entries.map(entry => normalizeEntry(entry, options)).filter(Boolean)
    : [];
  return {
    schemaVersion: WIZARD_NEWS_SCHEMA_VERSION,
    currentTick: Math.max(0, Math.floor(finiteNumber(feed?.currentTick, 0))),
    entries: sortEntries(entries).slice(0, MAX_ENTRIES),
    updatedAt: feed?.updatedAt || options.now || nowIso(),
  };
}

export function advanceWizardNewsFeed(feed = {}, ticks = 1, options = {}) {
  const current = ensureWizardNewsFeed(feed, options);
  const amount = Math.max(1, Math.floor(finiteNumber(ticks, 1)));
  return {
    ...current,
    currentTick: current.currentTick + amount,
    updatedAt: options.now || nowIso(),
  };
}

export function createWizardNewsEntryFromImpact(impact, options = {}) {
  if (!impact?.id) return null;
  const graph = ensureRegionalGraph(options.graph || {});
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
    summary: summaryForImpact(impact, transition, names, channels, event),
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

export function deriveWizardNewsEntriesFromGraphChange(beforeGraph = {}, afterGraph = {}, options = {}) {
  const before = ensureRegionalGraph(beforeGraph || {});
  const after = ensureRegionalGraph(afterGraph || {});
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
    entries: sortEntries([...byId.values()]).slice(0, options.maxEntries || MAX_ENTRIES),
    updatedAt: entries?.length ? (options.now || nowIso()) : current.updatedAt,
  };
}

export function summarizeWizardNews(feed = {}) {
  const current = ensureWizardNewsFeed(feed);
  const major = current.entries.filter(entry => entry.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR);
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
  return { feed: current, major, notables, byTick };
}

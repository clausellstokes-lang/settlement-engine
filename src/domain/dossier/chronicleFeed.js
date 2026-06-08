/**
 * domain/dossier/chronicleFeed.js — the unified campaign Chronicle (spec §8 M3c).
 *
 * One chronological feed that merges the three event sources a DM cares about:
 *   - manual events   — the authored Make Changes events (campaignState.eventLog)
 *   - party-caused     — manual events flagged "caused by the party" (M3b)
 *   - world pulse      — autonomous world-engine events (worldPulse / worldState)
 * plus the settlement's own historical recentEvents.
 *
 * Each entry is normalized to a common shape and tagged with a `source`
 * ('manual' | 'party' | 'world') so the UI can mark who drove it. No new
 * persistence — this reads the arrays the save already carries. Pure + tested.
 */

/** Best-effort epoch ms for a timestamp-ish value, or null. */
function toTime(at) {
  if (!at) return null;
  const t = new Date(at).getTime();
  return Number.isNaN(t) ? null : t;
}

/**
 * Normalize one heterogeneous raw event into the common Chronicle shape.
 * `source` is the feed the entry came from; a party-caused entry overrides it
 * to 'party'. EventLog entries nest the authored event under `.event`, so we
 * look there too.
 */
function normalizeEntry(raw, index, source) {
  if (!raw) return null;
  if (typeof raw === 'string') {
    return { id: `${source}-${index}`, title: raw, summary: '', at: null, severity: null, partyCaused: false, source };
  }
  if (typeof raw !== 'object') return null;

  const inner = (raw.event && typeof raw.event === 'object') ? raw.event : raw;
  const title = raw.title || raw.label || raw.name || raw.type || raw.kind || inner.type || inner.kind || 'Event';
  const summary = raw.summary || raw.description || raw.detail || raw.text || raw.note || raw.narrativeSummary || inner.description || '';
  const at = raw.createdAt || raw.created_at || raw.timestamp || raw.at || raw.date || raw.when || raw.appliedAt || null;
  const partyCaused = !!(raw.partyCaused || inner.partyCaused || raw.cause === 'party_action' || inner.cause === 'party_action');

  return {
    id: raw.id || raw.eventId || inner.id || `${source}-${index}`,
    title,
    summary,
    at,
    severity: raw.severity || raw.weight || raw.scale || null,
    partyCaused,
    source: partyCaused ? 'party' : source,
  };
}

/**
 * Build the unified Chronicle feed, newest first.
 *
 * @param {Object} sources
 * @param {Array} [sources.manual]     authored EventLog entries (campaignState.eventLog)
 * @param {Array} [sources.worldPulse] world-pulse events (campaignState.worldPulse.events)
 * @param {Array} [sources.worldLog]   world-state event log (campaignState.worldState.eventLog)
 * @param {Array} [sources.recent]     settlement.recentEvents (historical)
 * @param {Object} [opts]
 * @param {number} [opts.limit=40]     max entries (0 / negative = unlimited)
 * @returns {Array<{id,title,summary,at,severity,partyCaused,source}>}
 */
export function buildChronicleFeed({ manual = [], worldPulse = [], worldLog = [], recent = [] } = {}, { limit = 40 } = {}) {
  // Order of collection sets dedupe precedence: a manual/party entry wins over a
  // world-history duplicate of the same id.
  const tagged = [
    ...arr(manual).map((e, i) => normalizeEntry(e, `m${i}`, 'manual')),
    ...arr(worldPulse).map((e, i) => normalizeEntry(e, `wp${i}`, 'world')),
    ...arr(worldLog).map((e, i) => normalizeEntry(e, `wl${i}`, 'world')),
    ...arr(recent).map((e, i) => normalizeEntry(e, `r${i}`, 'world')),
  ].filter(e => e && (e.title || e.summary));

  const seen = new Set();
  const deduped = [];
  for (const entry of tagged) {
    if (seen.has(entry.id)) continue;
    seen.add(entry.id);
    deduped.push(entry);
  }

  // Newest first; undated entries trail in collection order (stable).
  const dated = deduped.filter(e => toTime(e.at) != null).sort((a, b) => toTime(b.at) - toTime(a.at));
  const undated = deduped.filter(e => toTime(e.at) == null);
  const sorted = [...dated, ...undated];

  return (typeof limit === 'number' && limit > 0) ? sorted.slice(0, limit) : sorted;
}

function arr(v) {
  return Array.isArray(v) ? v : [];
}

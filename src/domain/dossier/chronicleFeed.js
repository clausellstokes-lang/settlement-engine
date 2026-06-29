/**
 * domain/dossier/chronicleFeed.js — the unified campaign Chronicle.
 *
 * One chronological feed that merges the three event sources a DM cares about:
 *   - manual events   — the authored Make Changes events (campaignState.eventLog)
 *   - party-caused     — manual events flagged "caused by the party"
 *   - world pulse      — autonomous world-engine events (worldPulse / worldState)
 * plus the settlement's own historical recentEvents.
 *
 * Each entry is normalized to a common shape and tagged with a `source`
 * ('manual' | 'party' | 'world') so the UI can mark who drove it. No new
 * persistence — this reads the arrays the save already carries. Pure + tested.
 */

/**
 * Best-effort epoch ms for a timestamp-ish value, or null.
 * @param {any} at
 * @returns {number | null}
 */
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
 * @param {any} raw
 * @param {string|number} index
 * @param {string} source
 * @returns {any}
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
 * @param {any[]} [sources.manual]     authored EventLog entries (campaignState.eventLog)
 * @param {any[]} [sources.worldPulse] world-pulse events (campaignState.worldPulse.events)
 * @param {any[]} [sources.worldLog]   world-state event log (campaignState.worldState.eventLog)
 * @param {any[]} [sources.recent]     settlement.recentEvents (historical)
 * @param {Object} [opts]
 * @param {number} [opts.limit=40]     max entries (0 / negative = unlimited)
 * @param {string|number|Date|null} [opts.reference] campaign-start / canonization moment;
 *                                      when given, each dated entry gets a relativeDay
 *                                      (≥0, starting at zero) + "Day N" relativeLabel.
 * @returns {any[]}
 */
export function buildChronicleFeed({ manual = [], worldPulse = [], worldLog = [], recent = [] } = {}, { limit = 40, reference = null } = {}) {
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
  const dated = deduped.filter(e => toTime(e.at) != null).sort((a, b) => /** @type {number} */ (toTime(b.at)) - /** @type {number} */ (toTime(a.at)));
  const undated = deduped.filter(e => toTime(e.at) == null);
  const sorted = [...dated, ...undated];

  // Relative timing from the campaign-start / canonization reference
  // ("starting at zero"). Day 0 is the reference; entries before it clamp to 0.
  const refTime = toTime(reference);
  const DAY_MS = 86400000;
  const timed = sorted.map((e) => {
    const t = toTime(e.at);
    const relativeDay = (refTime != null && t != null) ? Math.max(0, Math.floor((t - refTime) / DAY_MS)) : null;
    return { ...e, relativeDay, relativeLabel: relativeDay != null ? `Day ${relativeDay}` : null };
  });

  return (typeof limit === 'number' && limit > 0) ? timed.slice(0, limit) : timed;
}

/** @param {any} v @returns {any[]} */
function arr(v) {
  return Array.isArray(v) ? v : [];
}

/**
 * Pick the most grounding-relevant Chronicle entries to feed the AI overlay +
 * Daily Life regeneration ("feed into AI; recent weighted more
 * heavily, party-caused weighted strongly").
 *
 * Scores each entry by recency (the feed is newest-first, so earlier = newer)
 * plus a source bonus — party-caused strongest, then manual edits — then returns
 * the top `limit` in chronological (newest-first) order as a compact, PII-free
 * payload the prompt can lean on. Pure.
 *
 * @param {any[]} feed                a buildChronicleFeed result
 * @param {Object} [opts]
 * @param {number} [opts.limit=8]
 * @returns {any[]}
 */
export function selectChronicleContext(feed = [], { limit = 8 } = {}) {
  if (!Array.isArray(feed) || !feed.length) return [];
  const n = feed.length;
  const scored = feed.map((e, i) => {
    const recency = 1 - i / n;                        // 1 (newest) → ~0 (oldest)
    const bonus = e.partyCaused ? 1.0 : (e.source === 'manual' ? 0.3 : 0);
    return { i, e, score: recency + bonus };
  });
  const top = scored.slice().sort((a, b) => b.score - a.score).slice(0, Math.max(0, limit));
  top.sort((a, b) => a.i - b.i);                      // back to chronological (newest-first)
  return top.map(({ e }) => ({
    when: e.relativeLabel || null,
    what: e.title,
    detail: e.summary || undefined,
    source: e.source,
    party: !!e.partyCaused,
  }));
}

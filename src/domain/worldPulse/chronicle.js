/**
 * domain/worldPulse/chronicle.js — grounding for an AI campaign chronicle.
 *
 * Wizard News is deterministic, structured, and explainable — ideal grounding
 * for an optional AI "this season's regional chronicle" prose pass (mirroring
 * the dossier's narrative layer). This builds the PII-free grounding payload.
 *
 * The PROSE pass itself must run server-side (the clientAiBoundary contract
 * test forbids the browser calling Anthropic). So the flow is:
 *   client → buildChronicleGrounding() → POST to a `generate-chronicle` edge
 *   function → Anthropic → prose. This module is the pure, testable half; the
 *   edge function + deploy live in the Supabase project. See
 *   docs/world-pulse-roadmap.md (Phase 4a).
 */

const ACTIVE_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);

/**
 * @param {Object} args
 * @param {any} [args.wizardNews]   campaign.wizardNews ({ entries, currentTick })
 * @param {any} [args.worldState]   campaign.worldState
 * @param {any} [args.snapshot]     a world snapshot (for settlement names + conditions)
 * @param {number} [args.tick]      restrict to a single tick (default: the latest)
 * @param {number} [args.lookback]  how many recent ticks to include when tick is omitted
 * @returns {Object} grounding payload — pure data, no PII
 */
export function buildChronicleGrounding({ wizardNews, worldState, snapshot, tick = null, lookback = 1 } = {}) {
  const allEntries = Array.isArray(wizardNews?.entries) ? wizardNews.entries : [];
  // Default window: the latest tick that HAS entries — the feed clock can sit
  // ahead of the newest entry (manual impact advances, entry-less pulses),
  // which would ground the paid chronicle on an empty window.
  const latestTick = tick != null
    ? tick
    : allEntries.length
      ? allEntries.reduce((max, e) => Math.max(max, e.tick || 0), 0)
      : (worldState?.tick ?? 0);
  const minTick = tick != null ? tick : latestTick - Math.max(0, lookback - 1);

  const entries = allEntries.filter(e => (e.tick ?? 0) >= minTick && (e.tick ?? 0) <= latestTick);

  const settlements = (snapshot?.settlements || []).map(item => ({
    id: item.id,
    name: item.name,
    conditions: (item.activeConditions || [])
      .slice(0, 6)
      .map(c => ({ label: c.label || c.archetype, archetype: c.archetype, severity: c.severity })),
  }));

  const stressors = (worldState?.stressors || [])
    .filter(s => ACTIVE_STAGES.has(s.lifecycleStage || 'active'))
    .slice(0, 12)
    .map(s => ({
      type: s.type,
      label: s.label,
      severity: s.severity,
      affected: s.affectedSettlementIds || [],
      // Spawn-variant context: who is behind it (nullable until the DM names
      // a non-settlement force) and the table-facing hooks the variant implies.
      ...(s.originContext?.variant ? { variant: s.originContext.variant } : {}),
      ...(s.originContext?.attackerLabel ? { attacker: s.originContext.attackerLabel } : {}),
      ...(s.originContext?.hooks?.length ? { hooks: s.originContext.hooks.slice(0, 2) } : {}),
    }));

  return {
    tick: latestTick,
    fromTick: minTick,
    calendar: worldState?.calendar || null,
    headlines: entries.map(e => ({
      headline: e.headline,
      summary: e.summary,
      scope: e.scope,
      significance: e.significance,
      settlementIds: e.settlementIds || [],
      reasons: e.reasons || [],
    })),
    majorHeadlines: entries.filter(e => e.significance === 'major').map(e => e.headline),
    realmArcs: entries.filter(e => e.scope === 'realm').map(e => ({ headline: e.headline, settlementIds: e.settlementIds || [] })),
    settlements,
    stressors,
    // A compact instruction the edge prompt can lean on (kept here so the prose
    // pass and the grounding never drift apart).
    intent: 'Write a short in-world chronicle of the season\'s regional events, grounded ONLY in the headlines/stressors above. Name settlements; do not invent events.',
  };
}

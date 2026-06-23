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

import { liveSieges, liveTradeWars } from '../display/warStatus.js';

const ACTIVE_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);

const WAR_SHAPED_STRESSOR_TYPES = new Set(['siege', 'wartime', 'occupation']);

/**
 * Build a settlementId → name lookup from a snapshot's settlements.
 * @param {any} snapshot
 * @returns {Map<string, string>}
 */
function nameByIdFrom(snapshot) {
  /** @type {Map<string, string>} */
  const map = new Map();
  for (const item of snapshot?.settlements || []) {
    const id = item?.id != null ? String(item.id) : null;
    const name = item?.name || item?.settlement?.name;
    if (id && name) map.set(id, String(name));
  }
  return map;
}

/**
 * @param {Object} args
 * @param {any} [args.wizardNews]   campaign.wizardNews ({ entries, currentTick })
 * @param {any} [args.worldState]   campaign.worldState
 * @param {any} [args.snapshot]     a world snapshot (for settlement names + conditions)
 * @param {any} [args.regionalGraph] the live regional graph — its war_front
 *   channels name a siege's COALITION and its trade_dependency goods name a trade
 *   war's COMMODITY. Optional: absent ⇒ the coalition/commodity story is
 *   simply omitted (a no-war chronicle is unchanged).
 * @param {number} [args.tick]      restrict to a single tick (default: the latest)
 * @param {number} [args.lookback]  how many recent ticks to include when tick is omitted
 * @returns {Object} grounding payload — pure data, no PII
 */
export function buildChronicleGrounding({ wizardNews, worldState, snapshot, regionalGraph = null, tick = null, lookback = 1 } = {}) {
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

  const nameById = nameByIdFrom(snapshot);
  const resolveName = (/** @type {any} */ id) => nameById.get(String(id)) || String(id);

  // Name the COALITION behind each war-shaped stressor from the live
  // war_front channels (besiegers into the besieged victim). Codepoint-stable,
  // resolved against the snapshot's names. Empty when no graph / no fronts.
  const siegesByVictim = new Map(
    liveSieges({ worldState, regionalGraph }).map(s => [s.targetId, s.coalition]),
  );

  const stressors = (worldState?.stressors || [])
    .filter(s => ACTIVE_STAGES.has(s.lifecycleStage || 'active'))
    .slice(0, 12)
    .map(s => {
      // For a war-shaped stressor, the coalition is the union of besiegers across
      // its affected (besieged) settlements — the STORY the chronicle should name.
      const coalition = WAR_SHAPED_STRESSOR_TYPES.has(s.type)
        ? [...new Set((s.affectedSettlementIds || []).flatMap((/** @type {any} */ id) => siegesByVictim.get(String(id)) || []))]
          .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
        : [];
      return {
        type: s.type,
        label: s.label,
        severity: s.severity,
        affected: s.affectedSettlementIds || [],
        // Spawn-variant context: who is behind it (nullable until the DM names
        // a non-settlement force) and the table-facing hooks the variant implies.
        ...(s.originContext?.variant ? { variant: s.originContext.variant } : {}),
        ...(s.originContext?.attackerLabel ? { attacker: s.originContext.attackerLabel } : {}),
        ...(s.originContext?.hooks?.length ? { hooks: s.originContext.hooks.slice(0, 2) } : {}),
        // Name the besieging coalition (2+ attackers ⇒ a coalition siege).
        ...(coalition.length ? { coalition: coalition.map(resolveName) } : {}),
      };
    });

  // The live trade wars, each naming its contested COMMODITY (the story a
  // trade-war chronicle should name). Empty when no prize has flipped.
  const tradeWars = liveTradeWars({ worldState, regionalGraph }).map(w => ({
    commodity: w.commodityLabel,
    buyer: resolveName(w.buyerId),
    supplier: resolveName(w.winnerId),
    displaced: w.incumbentId ? resolveName(w.incumbentId) : null,
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
    // The live trade wars (commodity + buyer + new supplier). Omitted when
    // empty so a no-trade-war chronicle grounding is unchanged.
    ...(tradeWars.length ? { tradeWars } : {}),
    // A compact instruction the edge prompt can lean on (kept here so the prose
    // pass and the grounding never drift apart).
    intent: 'Write a short in-world chronicle of the season\'s regional events, grounded ONLY in the headlines/stressors above. Name settlements; do not invent events.',
  };
}

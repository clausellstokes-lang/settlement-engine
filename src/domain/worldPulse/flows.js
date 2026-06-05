/**
 * domain/worldPulse/flows.js — inter-settlement population + trade flows.
 *
 * Channels emit conditions, but until now nothing actually *moved* between
 * settlements. This adds two flows, distinct from stressor spread (which makes
 * the SAME crisis jump a channel): flows model the SPILLOVER of a crisis onto
 * connected settlements.
 *
 *  • population flow — a settlement under a severe displacement crisis (famine,
 *    siege, plague, occupation, …) sends refugees down its confirmed channels;
 *    the destination gets `regional_migration_pressure` with a populationDelta.
 *  • trade-scarcity flow — a trade_dependency supplier in a trade/route crisis
 *    transmits `regional_import_shortage` (price scarcity) to its dependents.
 *
 * Pure + deterministic; emits candidate outcomes in the standard shape, so they
 * flow through conflict-resolution → roll → apply like any other candidate.
 */

import { activeChannelsFrom } from '../region/index.js';
import { deriveActiveCondition } from '../activeConditions.js';
import { stablePart } from './worldState.js';

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

const DISPLACEMENT_STRESSORS = new Set([
  'famine', 'siege', 'plague', 'disease_outbreak', 'occupation', 'wartime',
  'mass_migration', 'monster_raider_pressure', 'insurgency',
]);
const MIGRATION_CHANNELS = ['migration_pressure', 'trade_route', 'political_authority'];
const TRADE_CRISIS = /trade_route_cut|export_market|famine|import_shortage|food_anchor/;

function populationFlows(snapshot, tick) {
  const graph = snapshot.regionalGraph;
  const out = [];
  for (const s of snapshot.worldState?.stressors || []) {
    if (!DISPLACEMENT_STRESSORS.has(s.type) || (s.severity || 0) < 0.6) continue;
    const affected = new Set((s.affectedSettlementIds || []).map(String));
    for (const sourceId of affected) {
      const source = snapshot.byId?.get?.(sourceId);
      const sourcePop = source?.settlement?.population || 0;
      for (const channel of activeChannelsFrom(graph, sourceId, { types: MIGRATION_CHANNELS })) {
        const destId = String(channel.to);
        if (affected.has(destId)) continue;
        const dest = snapshot.byId?.get?.(destId);
        if (!dest) continue;
        const fraction = Math.min(0.12, 0.04 + (s.severity - 0.6) * 0.2);
        const refugees = Math.round(sourcePop * fraction);
        if (refugees <= 0) continue;
        const severity = clamp01(0.3 + s.severity * 0.3);
        const human = String(s.type).replace(/_/g, ' ');
        out.push({
          id: `candidate.flow.migration.${stablePart(s.id)}.${stablePart(destId)}.${tick}`,
          type: 'condition',
          candidateType: 'flow_migration',
          ruleId: `flow_migration_${s.type}`,
          ruleFamily: 'flow',
          targetSaveId: destId,
          severity,
          probability: Math.min(0.45, 0.1 + s.severity * 0.3),
          applyMode: severity >= 0.72 ? 'proposal' : 'auto',
          headline: `Refugees from ${source?.name || sourceId} reach ${dest?.name || destId}`,
          summary: `~${refugees} people flee ${human} in ${source?.name || sourceId} toward ${dest?.name || destId}.`,
          reasons: [
            `A severe ${human} (${s.severity.toFixed(2)}) is displacing people.`,
            `A confirmed ${channel.type.replace(/_/g, ' ')} channel carries them.`,
          ],
          condition: deriveActiveCondition({
            archetype: 'regional_migration_pressure',
            severity,
            status: 'worsening',
            triggeredAt: { tick, sourceEventType: 'WORLD_PULSE_FLOW_MIGRATION', sourceEventTargetId: sourceId },
            causes: [{ source: s.id, effect: 'population_flow', reason: `Refugees fleeing ${human}.` }],
          }),
          populationDeltas: [
            { saveId: sourceId, delta: -refugees, reason: `Refugees flee ${human}.` },
            { saveId: destId, delta: refugees, reason: `Refugees arrive from ${source?.name || sourceId}.` },
          ],
          metadata: { flowKind: 'population', from: sourceId, to: destId, populationDelta: refugees, channelType: channel.type },
          conflictTags: [`settlement:${destId}:migration`, `flow:migration:${sourceId}:${destId}`, `population_transfer:${sourceId}`],
        });
      }
    }
  }
  return out;
}

function tradeScarcityFlows(snapshot, tick) {
  const graph = snapshot.regionalGraph;
  const out = [];
  for (const item of snapshot.settlements || []) {
    const supplierId = String(item.id);
    const conditionCrisis = (item.activeConditions || []).some(c => TRADE_CRISIS.test(c.archetype || ''));
    const connectivityCrisis = (item.causal?.scores?.trade_connectivity ?? 60) < 35;
    if (!conditionCrisis && !connectivityCrisis) continue;
    for (const channel of activeChannelsFrom(graph, supplierId, { types: ['trade_dependency'] })) {
      const destId = String(channel.to);
      const dest = snapshot.byId?.get?.(destId);
      if (!dest) continue;
      const severity = clamp01(0.4 + (channel.strength || 0.5) * 0.3);
      out.push({
        id: `candidate.flow.trade.${stablePart(supplierId)}.${stablePart(destId)}.${tick}`,
        type: 'condition',
        candidateType: 'flow_trade_scarcity',
        ruleId: 'flow_trade_scarcity',
        ruleFamily: 'flow',
        targetSaveId: destId,
        severity,
        probability: Math.min(0.4, 0.12 + severity * 0.28),
        applyMode: severity >= 0.72 ? 'proposal' : 'auto',
        headline: `Supply from ${item.name || supplierId} fails ${dest?.name || destId}`,
        summary: `${item.name || supplierId} can no longer meet its trade obligation; prices climb in ${dest?.name || destId}.`,
        reasons: [
          `${item.name || supplierId} is in a trade/supply crisis.`,
          `A confirmed trade-dependency channel makes ${dest?.name || destId} reliant on it.`,
        ],
        condition: deriveActiveCondition({
          archetype: 'regional_import_shortage',
          severity,
          status: 'worsening',
          triggeredAt: { tick, sourceEventType: 'WORLD_PULSE_FLOW_TRADE', sourceEventTargetId: supplierId },
          causes: [{ source: supplierId, effect: 'trade_scarcity_flow', reason: 'A trade-dependency supplier is in crisis.' }],
        }),
        metadata: { flowKind: 'trade', from: supplierId, to: destId, channelType: 'trade_dependency', strength: channel.strength },
        conflictTags: [`settlement:${destId}:import_shortage`, `flow:trade:${supplierId}:${destId}`],
      });
    }
  }
  return out;
}

/**
 * Derive population + trade-scarcity flow candidates for a snapshot.
 * @param {any} snapshot
 * @param {{ tick?: number }} [options]
 */
export function deriveFlowCandidates(snapshot, { tick = 0 } = {}) {
  if (!snapshot?.regionalGraph) return [];
  return [...populationFlows(snapshot, tick), ...tradeScarcityFlows(snapshot, tick)];
}

// R-PA2 probe: compose an Instant World headlessly from a byte-copy of the code of record
// and report what the realm holds at birth (relations, worldState ledgers, histories), plus timing.
// Usage: node birth.mjs <seed> <realmSize> <tone>
import { performance } from 'node:perf_hooks';
const base = new URL('./cor/src/', import.meta.url);
const { composeInstantWorld, loadGenerationLawPayloads } = await import(new URL('lib/instantWorld/composeInstantWorld.js', base));
const seed = process.argv[2] || 'pa2-probe';
const realmSize = process.argv[3] || 'medium';
const tone = process.argv[4] || 'realistic_regional';
await loadGenerationLawPayloads();
const t0 = performance.now();
const b1 = composeInstantWorld({ seed, basicConfig: { realmSize, tone } });
const t1 = performance.now();
const b2 = composeInstantWorld({ seed, basicConfig: { realmSize, tone } });
const ws = b1.campaign.worldState;
const out = {
  seed, realmSize, tone,
  composeMs: Math.round(t1 - t0),
  memberCount: b1.settlements.length,
  fingerprintStable: b1.fingerprint === b2.fingerprint,
  bundleBytesStable: JSON.stringify(b1) === JSON.stringify(b2),
  planLaw: b1.plan.planLaw ?? '(absent=law1)',
  planRelations: b1.plan.relations || null,
  worldStateKeys: Object.keys(ws),
  tick: ws.tick, canonizedAt: ws.canonizedAt, rngSeed: ws.rngSeed,
  presetId: ws.simulationRules?.presetId,
  pactFormationEnabled: ws.simulationRules?.pactFormationEnabled,
  warLayerEnabled: ws.simulationRules?.warLayerEnabled,
  relationshipStatesCount: Object.keys(ws.relationshipStates || {}).length,
  pulseHistory: (ws.pulseHistory || []).length,
  spatialLedgers: ws.spatialLedgers ?? '(absent)',
  channels: (b1.campaign.regionalGraph?.channels || []).map(c => `${c.type}:${c.status}`),
  regionalGraphKeys: Object.keys(b1.campaign.regionalGraph || {}),
  members: b1.settlements.map(m => {
    const s = m.settlement;
    const h = s.history || {};
    return {
      slot: m._slot, tier: m.tier, name: s.name, seed: m.seed,
      founding: h.founding ? { age: h.founding.age, reason: h.founding.reason, foundedBy: h.founding.foundedBy } : null,
      historyKeys: Object.keys(h),
      events: (h.historicalEvents || []).map(e => `${e.type}|${e.yearsAgo}|${e.severity}|${e.name}`),
      tensions: (h.currentTensions || []).map(t => (typeof t === 'string' ? t : JSON.stringify(t)).slice(0, 140)),
      neighbourNetwork: (s.neighbourNetwork || []).map(n => ({ id: n.id, name: n.name, rel: n.relationshipType || n.type, source: n.source, cause: n.genesisCause })),
      cfgNeighbourRelationship: m.config?.neighborRelationship ?? m.config?.neighbourRelationship ?? null,
    };
  }),
};
console.log(JSON.stringify(out, null, 1));

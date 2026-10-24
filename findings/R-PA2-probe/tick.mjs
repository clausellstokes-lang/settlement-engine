// R-PA2 probe: the real per-tick kernel cost on a composed Instant World, and what a
// forward run does to the dossiers (PA-L3's "a forward run changes the generated present").
// Usage: node tick.mjs <realmSize> <tone> <weeks>
import { performance } from 'node:perf_hooks';
import { createHash } from 'node:crypto';
const base = new URL('./cor/src/', import.meta.url);
const { composeInstantWorld, loadGenerationLawPayloads } = await import(new URL('lib/instantWorld/composeInstantWorld.js', base));
const { canonizeWorldState } = await import(new URL('domain/worldPulse/worldState.js', base));
const { simulateCampaignWorldInterval } = await import(new URL('domain/worldPulse/advanceInterval.js', base));
const realmSize = process.argv[2] || 'medium';
const tone = process.argv[3] || 'realistic_regional';
const weeks = Number(process.argv[4] || 4);
const NOW = '2026-10-23T00:00:00.000Z';
await loadGenerationLawPayloads();
const b = composeInstantWorld({ seed: 'pa2-probe', basicConfig: { realmSize, tone }, clock: () => NOW });
const campaign = { ...b.campaign, worldState: canonizeWorldState(b.campaign.worldState, NOW, b.campaign) };
const saves = b.settlements.map(s => ({ id: s.id, name: s.name, tier: s.tier, settlement: s.settlement, config: s.config, seed: s.seed, campaignState: s.campaignState }));
const h = (o) => createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0, 12);
const before = Object.fromEntries(saves.map(s => [s.id, h(s.settlement)]));
const historyBefore = Object.fromEntries(saves.map(s => [s.id, h(s.settlement.history)]));
const runs = [];
let res;
for (let r = 0; r < 2; r++) {
  const t0 = performance.now();
  res = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_week', weeks, commit: true, now: NOW, autoResolve: true });
  runs.push(Math.round(performance.now() - t0));
}
const upd = res.settlementUpdates || [];
let changed = 0, historyChanged = 0;
for (const u of upd) {
  if (h(u.settlement) !== before[String(u.saveId)]) changed++;
  if (h(u.settlement?.history) !== historyBefore[String(u.saveId)]) historyChanged++;
}
const ws = res.worldState;
console.log(JSON.stringify({
  realmSize, tone, weeks, members: saves.length,
  msPerRun: runs, msPerTickWarm: Math.round(runs[1] / weeks),
  tickAfter: ws.tick, calendar: ws.calendar,
  dossiersUpdated: upd.length, dossiersWhoseBytesChanged: changed, dossiersWhoseHistoryChanged: historyChanged,
  relationshipStates: Object.keys(ws.relationshipStates || {}).length,
  spatialLedgerKeys: Object.keys(ws.spatialLedgers || {}),
  conditionalKeys: Object.keys(ws).filter(k => !['schemaVersion','canonizedAt','tick','calendar','rngSeed','volatility','simulationRules','stressors','relationshipStates','npcStates','factionStates','proposals','pulseHistory','settlementTickStates','pendingEvents','dispositionStats','deployments','tradeWarState','warExhaustion'].includes(k)),
  pulseHistoryLen: (ws.pulseHistory || []).length,
  pulseHistoryLastBytes: JSON.stringify((ws.pulseHistory || []).slice(-1)).length,
  worldStateBytes: JSON.stringify(ws).length,
}, null, 1));

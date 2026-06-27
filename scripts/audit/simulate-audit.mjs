/**
 * simulate-audit.mjs — Phase 2: regional / campaign simulation audit.
 *
 * Builds campaigns of varied topology from REAL generated members, runs the pure
 * advanceCampaignWorld over many ticks/intervals, and collects telemetry on
 * propagation, event firing, condition lifecycle, decay, bounded growth, and
 * autoresolver behaviour. Flags runaway / stall / explosive / uniform / chaotic.
 *
 * Usage: npx vite-node scripts/audit/simulate-audit.mjs -- --reps 8 --ticks 24 --out <path.json>
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { deriveAllActiveConditions } from '../../src/domain/activeConditions.js';
import { writeFileSync } from 'node:fs';

function arg(name, def) { const i = process.argv.indexOf(`--${name}`); return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def; }
const REPS = parseInt(arg('reps', '8'), 10);          // campaigns per topology
const TICKS = parseInt(arg('ticks', '24'), 10);       // advances per campaign
const OUT = arg('out', 'scratchpad/simulate-audit.json');

const ID = (i) => String.fromCharCode(97 + (i % 26)) + (i >= 26 ? Math.floor(i / 26) : '');
function member(i, seed) {
  const tiers = ['village', 'town', 'town', 'city'];
  const s = generateSettlementPipeline({ settType: tiers[i % tiers.length], culture: 'germanic' }, null, { seed, customContent: {} });
  return { id: ID(i), name: s.name || `S-${i}`, phase: 'canon', settlement: s, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

// Topology builders → { channels, stressors } given member ids.
const TOPOLOGIES = {
  small:        { n: 3,  ch: (ids) => chain(ids),                       str: () => [] },
  large:        { n: 30, ch: (ids) => chain(ids).concat(ring(ids)),     str: (ids) => siege(ids, 1) },
  dense:        { n: 12, ch: (ids) => dense(ids),                       str: (ids) => siege(ids, 1) },
  sparse:       { n: 16, ch: (ids) => sparse(ids),                      str: () => [] },
  isolated:     { n: 8,  ch: () => [],                                  str: () => [] },
  hubSpoke:     { n: 14, ch: (ids) => hub(ids),                         str: () => [] },
  tradeHeavy:   { n: 12, ch: (ids) => dense(ids).map(c => ({ ...c, type: 'trade_dependency' })), str: () => [] },
  fragmented:   { n: 12, ch: (ids) => chain(ids).map(c => ({ ...c, type: 'political_authority', status: 'contested' })), str: (ids) => siege(ids, 2) },
  frontier:     { n: 10, ch: (ids) => chain(ids).map(c => ({ ...c, type: 'military_protection' })), str: (ids) => siege(ids, 3).concat(monster(ids, 2)) },
  interdependent:{ n: 18, ch: (ids) => dense(ids).concat(ring(ids)),    str: (ids) => siege(ids, 2) },
};
function chain(ids) { const c = []; for (let i = 1; i < ids.length; i++) c.push({ type: 'trade_route', from: ids[i - 1], to: ids[i], status: 'confirmed' }); return c; }
function ring(ids) { const c = chain(ids); if (ids.length > 2) c.push({ type: 'trade_route', from: ids[ids.length - 1], to: ids[0], status: 'confirmed' }); return c; }
function dense(ids) { const c = []; for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) if ((i + j) % 2 === 0) c.push({ type: 'trade_route', from: ids[i], to: ids[j], status: 'confirmed' }); return c; }
function sparse(ids) { const c = []; for (let i = 2; i < ids.length; i += 3) c.push({ type: 'trade_route', from: ids[i - 2], to: ids[i], status: 'confirmed' }); return c; }
function hub(ids) { return ids.slice(1).map(t => ({ type: 'political_authority', from: ids[0], to: t, status: 'confirmed' })); }
function siege(ids, k) { return ids.slice(0, k).map((id) => ({ id: `world_stressor.siege.${id}`, type: 'siege', severity: 0.8, affectedSettlementIds: [id] })); }
function monster(ids, k) { return ids.slice(0, k).map((id) => ({ id: `world_stressor.monster.${id}`, type: 'monster_pressure', severity: 0.7, affectedSettlementIds: [id] })); }

function summ(arr) { if (!arr.length) return { n: 0 }; const s = arr.slice().sort((a, b) => a - b); const mean = arr.reduce((a, b) => a + b, 0) / arr.length; return { n: arr.length, min: s[0], p50: s[(s.length / 2) | 0], mean: Math.round(mean * 100) / 100, max: s[s.length - 1] }; }

const report = { meta: { reps: REPS, ticks: TICKS }, topologies: {}, anomalies: {} };
function inc(m, k) { m[k] = (m[k] || 0) + 1; }

for (const [topo, spec] of Object.entries(TOPOLOGIES)) {
  const evtRates = [], stressorPeaks = [], condPeaks = [], autoRates = [], finalStressors = [], throwsArr = [];
  let stalls = 0, runaways = 0;
  for (let r = 0; r < REPS; r++) {
    const ids = Array.from({ length: spec.n }, (_, i) => ID(i));
    let saves = ids.map((id, i) => member(i, `sim-${topo}-${r}-${i}`));
    let campaign = {
      id: `${topo}-${r}`, name: topo, settlementIds: ids,
      worldState: { rngSeed: `sim-${topo}-${r}`, tick: 0, stressors: spec.str(ids) },
      regionalGraph: ensureRegionalGraph({ channels: spec.ch(ids) }),
      wizardNews: { currentTick: 0, entries: [] },
    };
    let events = 0, autoApplied = 0, maxStressors = (campaign.worldState.stressors || []).length, maxConds = 0, threw = false;
    const interval = ['one_month', 'one_season', 'one_year'][r % 3];
    for (let t = 0; t < TICKS; t++) {
      let result;
      try {
        result = advanceCampaignWorld({ campaign, saves, interval, now: `2026-03-01T00:00:${String(t % 60).padStart(2, '0')}.000Z` });
      } catch { threw = true; inc(report.anomalies, `THROW:${topo}`); break; }
      if (!result) { inc(report.anomalies, `NULL_RESULT:${topo}`); break; }
      const prevEntries = (campaign.wizardNews?.entries || []).length;
      campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph, wizardNews: result.wizardNews };
      saves = saves.map(s => { const u = result.settlementUpdates?.find(x => String(x.saveId) === String(s.id)); return u ? { ...s, settlement: u.settlement } : s; });
      events += Math.max(0, (result.wizardNews?.entries || []).length - prevEntries);
      autoApplied += (result.autoApplied || []).length;
      maxStressors = Math.max(maxStressors, (result.worldState.stressors || []).length);
      for (const s of saves) { try { maxConds = Math.max(maxConds, deriveAllActiveConditions(s.settlement).length); } catch { /* tolerate */ } }
    }
    if (threw) { throwsArr.push(1); continue; }
    evtRates.push(events / TICKS);
    autoRates.push(autoApplied / TICKS);
    stressorPeaks.push(maxStressors);
    condPeaks.push(maxConds);
    finalStressors.push((campaign.worldState.stressors || []).length);
    if (events === 0) stalls++;                                  // alive?
    if (maxStressors > spec.n * 3) runaways++;                   // bounded?
  }
  report.topologies[topo] = {
    n: spec.n, eventsPerTick: summ(evtRates), autoAppliedPerTick: summ(autoRates),
    stressorPeak: summ(stressorPeaks), conditionPeak: summ(condPeaks), finalStressors: summ(finalStressors),
    stalls, runaways, throws: throwsArr.length,
  };
  if (stalls > REPS / 2) inc(report.anomalies, `STALL:${topo}`);
  if (runaways > 0) inc(report.anomalies, `RUNAWAY:${topo}`);
  process.stderr.write(`  ${topo}: evt/tick≈${report.topologies[topo].eventsPerTick.mean} stressorPeak≈${report.topologies[topo].stressorPeak.mean} stalls=${stalls} runaways=${runaways} throws=${throwsArr.length}\n`);
}
writeFileSync(OUT, JSON.stringify(report, null, 2));
process.stderr.write(`DONE → ${OUT}\n`);

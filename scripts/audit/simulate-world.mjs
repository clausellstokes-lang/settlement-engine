/**
 * simulate-world.mjs — Phase 3: the UNIFIED "everything-on" world simulation.
 *
 * Activates EVERY subsystem at once (war layer, settlement strategy, religion — all
 * dormant by default — plus every default-on organic system), on a rich region built
 * to trigger the conditional dynamics (hostile pairs + military asymmetry for war,
 * low-legitimacy multi-faction seats for coups, embedded rival deities for religion,
 * varied tiers for promotion/demotion, seed displacement stressors for flow/spread).
 * Then it soaks the world and measures whether all 95 catalogued dynamics fire, in
 * balance and in tune with each other, and whether the world keeps evolving (no
 * stalls, no runaways) — across week/month/season/year scales.
 *
 * Usage: npx vite-node scripts/audit/simulate-world.mjs -- --ticks 80 --reps 2 --out <p.json>
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { deriveAllActiveConditions } from '../../src/domain/activeConditions.js';
import { TIER_ORDER } from '../../src/domain/customContentSchema.js';
import { writeFileSync } from 'node:fs';

function arg(name, def) { const i = process.argv.indexOf(`--${name}`); return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def; }
const TICKS = parseInt(arg('ticks', '80'), 10);
const REPS = parseInt(arg('reps', '2'), 10);
const OUT = arg('out', 'scratchpad/simulate-world.json');
const SCALE_TICKS = parseInt(arg('scaleTicks', '40'), 10);
const ID = (i) => String.fromCharCode(97 + (i % 26)) + (i >= 26 ? String(Math.floor(i / 26)) : '');
const tierIdx = (t) => TIER_ORDER.indexOf(t);

const DEITIES = [
  { _deityRef: 'custom:lu_vael', name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major' },
  { _deityRef: 'custom:lu_korl', name: 'Korl', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major' },   // evil → relaxes capture-ladder gate
  { _deityRef: 'custom:lu_aurum', name: 'Aurum', alignmentAxis: 'neutral', temperamentAxis: 'peaceful', rankAxis: 'major' },
];
const cultDeity = (i) => ({ _deityRef: `custom:lu_faded${i}`, name: `Faded${i}`, alignmentAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: 'cult' });

// EVERYTHING-ON rules.
const RULES = {
  propagationMode: 'full', intensity: 'dramatic', migrationMode: 'roll',
  stressorsEnabled: true, emergentEventsEnabled: true, relationshipDynamicsEnabled: true,
  npcAgencyEnabled: true, factionCompetitionEnabled: true, populationDynamicsEnabled: true,
  migrationFlowsEnabled: true, tradeFlowsEnabled: true, resourceDriftEnabled: true,
  tierDriftEnabled: true, institutionLifecycleEnabled: true,
  warLayerEnabled: true, settlementStrategyEnabled: true, religionDynamicsEnabled: true,
  majorChangesRequireProposal: false,   // auto-apply majors so cascades propagate
};

function buildWorld(seedBase) {
  // 18 settlements: 6 strong faith/military centres (city/metropolis, rival deities),
  // 12 weaker members (town/village, some cult faith, some low-legitimacy).
  const tiers = ['metropolis', 'city', 'city', 'city', 'city', 'city', 'town', 'town', 'town', 'town', 'village', 'village', 'town', 'village'];
  const n = tiers.length;
  const ids = Array.from({ length: n }, (_, i) => ID(i));
  const saves = ids.map((id, i) => {
    const s = generateSettlementPipeline({ settType: tiers[i], culture: 'germanic' }, null, { seed: `${seedBase}-${i}`, customContent: {} });
    s.config = { ...s.config };
    if (i < 6) {                                    // faith + military centres
      s.config.primaryDeityRef = DEITIES[i % 3]._deityRef;
      s.config.primaryDeitySnapshot = DEITIES[i % 3];
      s.config.priorityMilitary = 70;
    } else if (i % 3 === 0) {                        // weak cult converts
      s.config.primaryDeityRef = cultDeity(i)._deityRef;
      s.config.primaryDeitySnapshot = cultDeity(i);
      s.powerStructure = { ...s.powerStructure, publicLegitimacy: { score: 24, label: 'Crisis' } };
    } else if (i % 3 === 1) {                        // low-legitimacy coup-prone
      s.powerStructure = { ...s.powerStructure, publicLegitimacy: { score: 22, label: 'Crisis' } };
    }
    s.config.nearbyResourcesState = i % 2 ? 'strained' : 'abundant';   // resource drift room
    return { id, name: s.name || `S-${i}`, phase: 'canon', settlement: s, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
  });

  // Mixed-relationship edges (drive war + relationship + religion mints) + structural channels.
  const edges = [];
  const E = (a, b, rt) => edges.push({ id: `edge.${ids[a]}.${ids[b]}`, from: ids[a], to: ids[b], relationshipType: rt });
  // hostile / rival / cold_war pairs — strong attacker → weaker target (war fuel)
  E(0, 6, 'hostile'); E(1, 7, 'hostile'); E(2, 8, 'rival'); E(3, 9, 'cold_war'); E(4, 10, 'rival'); E(5, 11, 'hostile');
  // alliances + trade (relationship dynamics + faith carriers + migration channels)
  E(0, 1, 'allied'); E(2, 3, 'allied'); E(4, 5, 'trade_partner');
  for (let c = 6; c < n; c++) { E((c) % 6, c, c % 2 ? 'allied' : 'trade_partner'); E((c + 2) % 6, c, c % 2 ? 'trade_partner' : 'allied'); }
  const channels = [];
  const C = (a, b, type) => channels.push({ type, from: ids[a], to: ids[b], status: 'confirmed' });
  for (let i = 1; i < n; i++) C(i - 1, i, 'trade_dependency');
  C(0, 6, 'military_protection'); C(1, 7, 'military_protection'); C(0, n - 1, 'political_authority');
  for (let i = 0; i < n; i += 3) for (let j = i + 3; j < n; j += 4) C(i, j, 'trade_dependency');

  // seed high-severity displacement stressors (spread + flow_migration + mass_migration fuel)
  const stressors = [
    { id: `world_stressor.siege.${ids[6]}`, type: 'siege', severity: 0.82, affectedSettlementIds: [ids[6]] },
    { id: `world_stressor.famine.${ids[8]}`, type: 'famine', severity: 0.78, affectedSettlementIds: [ids[8]] },
    { id: `world_stressor.disease_outbreak.${ids[10]}`, type: 'disease_outbreak', severity: 0.7, affectedSettlementIds: [ids[10]] },
  ];
  return { ids, saves, edges, channels, stressors };
}

// ── telemetry ──────────────────────────────────────────────────────────────
function newAgg() {
  return {
    ranTicks: 0, throws: 0,
    candByType: {}, autoAppliedTotal: 0, proposalsTotal: 0, majorsTotal: 0, selectedTotal: 0,
    candPerTick: [], stressorCountPerTick: [], distinctFamiliesPerTick: [],
    stressorByType: {}, stressorByStage: {}, resolvedStressors: 0,
    promotions: 0, demotions: 0, instGained: 0, instLost: 0,
    govChanges: 0, conversions: 0, captureAdvances: 0, corruptionOnsets: 0, corruptionExposures: 0,
    popStart: 0, popEnd: 0, popMin: Infinity, popMax: 0,
    relTypeFlips: 0, channelTypesFinal: {}, newsBySignificance: {}, realmArcs: 0,
    convByCause: {}, occupiedPeak: 0, occupationTicks: 0, warlikeOccupierTicks: 0,
    warPostureSeen: false, deploymentsSeen: false, occupationsSeen: false, tradeWarSeen: false, pantheonSeen: false, warExhaustionSeen: false,
    deityTierChanges: 0, conditionPeak: 0,
    stalls: 0, zeroCandTicks: 0, noveltyTail: 0,
    firstSeenTick: {},
  };
}

function runWorld(seedBase, interval, ticks, agg) {
  const { ids, saves: saves0, edges, channels, stressors } = buildWorld(seedBase);
  let saves = saves0;
  let campaign = {
    id: seedBase, name: 'world', settlementIds: ids,
    worldState: { rngSeed: seedBase, tick: 0, volatility: 'turbulent', stressors, simulationRules: RULES },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  const tierBy = new Map(saves.map(s => [s.id, s.settlement.tier]));
  const instBy = new Map(saves.map(s => [s.id, (s.settlement.institutions || []).length]));
  const govBy = new Map(saves.map(s => [s.id, s.settlement.powerStructure?.governingName || s.settlement.powerStructure?.government]));
  const faithBy = new Map(saves.map(s => [s.id, s.settlement.config?.primaryDeitySnapshot?.name || null]));
  const relBy = new Map();
  const captureBy = new Map();
  const deityTierBy = {};
  const TR = { cult: 0, minor: 1, major: 2 };
  agg.popStart += saves.reduce((t, s) => t + (Number(s.settlement.population) || 0), 0);

  for (let t = 0; t < ticks; t++) {
    let r;
    try { r = advanceCampaignWorld({ campaign, saves, interval, now: `2026-03-01T00:00:${String(t % 60).padStart(2, '0')}.000Z` }); }
    catch (e) { agg.throws++; agg.lastThrow = String(e).slice(0, 160); break; }
    if (!r) break;
    agg.ranTicks++;
    const cands = r.candidates || [];
    const fams = new Set();
    for (const c of cands) {
      const ct = c.candidateType || c.type || 'unknown';
      agg.candByType[ct] = (agg.candByType[ct] || 0) + 1; fams.add(ct);
      if (!(ct in agg.firstSeenTick)) agg.firstSeenTick[ct] = agg.ranTicks;
      // conversion attribution: occupation-driven vs neighbour-contest
      if (ct === 'stressor_birth_religious_conversion_fracture') { const cause = c.metadata?.conversionCause || 'contest'; agg.convByCause[cause] = (agg.convByCause[cause] || 0) + 1; }
    }
    agg.candPerTick.push(cands.length);
    agg.distinctFamiliesPerTick.push(fams.size);
    if (cands.length === 0) { agg.zeroCandTicks++; }
    if (t >= ticks - Math.min(10, ticks) && fams.size > 0) agg.noveltyTail += fams.size;
    agg.autoAppliedTotal += (r.autoApplied || []).length;
    agg.proposalsTotal += (r.proposals || []).length;
    agg.majorsTotal += (r.majors || []).length;
    agg.selectedTotal += (r.selected || []).length;
    agg.resolvedStressors += (r.resolvedStressors || []).length;

    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
    saves = saves.map(s => { const u = r.settlementUpdates?.find(x => String(x.saveId) === String(s.id)); return u ? { ...s, settlement: u.settlement } : s; });

    // stressors
    const strs = r.worldState?.stressors || [];
    agg.stressorCountPerTick.push(strs.length);
    for (const x of strs) { agg.stressorByType[x.type] = (agg.stressorByType[x.type] || 0) + 1; const stg = x.lifecycleStage || x.stage || '?'; agg.stressorByStage[stg] = (agg.stressorByStage[stg] || 0) + 1; }

    // per-settlement evolution
    let popNow = 0, condNow = 0;
    for (const s of saves) {
      popNow += Number(s.settlement.population) || 0;
      try { condNow += deriveAllActiveConditions(s.settlement).length; } catch { /* tolerate */ }
      const pt = tierBy.get(s.id), nt = s.settlement.tier;
      if (pt && nt && pt !== nt) { (tierIdx(nt) > tierIdx(pt) ? agg.promotions++ : agg.demotions++); tierBy.set(s.id, nt); }
      const pi = instBy.get(s.id), ni = (s.settlement.institutions || []).length;
      if (ni > pi) agg.instGained += ni - pi; else if (ni < pi) agg.instLost += pi - ni; instBy.set(s.id, ni);
      const pg = govBy.get(s.id), ng = s.settlement.powerStructure?.governingName || s.settlement.powerStructure?.government;
      if (pg && ng && pg !== ng) agg.govChanges++; govBy.set(s.id, ng);
      const pf = faithBy.get(s.id), nf = s.settlement.config?.primaryDeitySnapshot?.name || null;
      if (pf !== nf) agg.conversions++; faithBy.set(s.id, nf);
      const pc = captureBy.get(s.id), nc = s.settlement.powerStructure?.criminalCaptureState || s.settlement.powerStructure?.captureState;
      if (nc && pc && nc !== pc) agg.captureAdvances++; captureBy.set(s.id, nc);
    }
    agg.popMin = Math.min(agg.popMin, popNow); agg.popMax = Math.max(agg.popMax, popNow);
    agg.conditionPeak = Math.max(agg.conditionPeak, condNow);

    // relationship type flips
    for (const [k, v] of Object.entries(r.worldState?.relationshipStates || {})) { const nt = v?.relationshipType; const pt = relBy.get(k); if (pt && nt && pt !== nt) agg.relTypeFlips++; relBy.set(k, nt); }

    // corruption / capture events from pulseRecord
    const pr = r.pulseRecord || {};
    for (const e of (pr.corruptionEvents || [])) { if (/onset|corrupt/.test(e.kind || '')) agg.corruptionOnsets++; if (/ousted|exposed|demoted|reform/.test(e.kind || '')) agg.corruptionExposures++; }
    agg.captureAdvances += (pr.factionCaptureEvents || []).length;

    // war-layer + religion ledgers present?
    const ws = r.worldState || {};
    if (ws.warPosture && Object.keys(ws.warPosture).length) agg.warPostureSeen = true;
    if (ws.deployments && Object.keys(ws.deployments).length) agg.deploymentsSeen = true;
    if (ws.occupations && Object.keys(ws.occupations).length) agg.occupationsSeen = true;
    if (ws.tradeWarState && Object.keys(ws.tradeWarState).length) agg.tradeWarSeen = true;
    if (ws.warExhaustion && Object.keys(ws.warExhaustion).length) agg.warExhaustionSeen = true;
    if (ws.pantheon && Object.keys(ws.pantheon).length) {
      agg.pantheonSeen = true;
      for (const [did, led] of Object.entries(ws.pantheon)) { const pt = deityTierBy[did], nt = led?.tier; if (pt && nt && pt !== nt) agg.deityTierChanges++; deityTierBy[did] = nt; }
    }
    // occupation telemetry (force-coupling context)
    const occLedger = ws.occupations && typeof ws.occupations === 'object' ? ws.occupations : {};
    const occIds = Object.keys(occLedger);
    agg.occupiedPeak = Math.max(agg.occupiedPeak, occIds.length);
    agg.occupationTicks += occIds.length;
    for (const cid of occIds) { const occId = occLedger[cid]?.occupierId; const occSave = saves.find(sv => String(sv.id) === String(occId)); if (occSave?.settlement?.config?.primaryDeitySnapshot?.temperamentAxis === 'warlike') agg.warlikeOccupierTicks++; }
    // news
    for (const e of (r.wizardNews?.entries || []).slice(-20)) { const sig = e.significance || '?'; agg.newsBySignificance[sig] = (agg.newsBySignificance[sig] || 0) + 1; if (/realm|arc/.test(e.impactKind || e.tags?.join(',') || '')) agg.realmArcs++; }
  }
  agg.popEnd += saves.reduce((t, s) => t + (Number(s.settlement.population) || 0), 0);
  // final channel-type histogram
  for (const c of (campaign.regionalGraph?.channels || campaign.regionalGraph?.edges || [])) { const ty = c.type || c.relationshipType; agg.channelTypesFinal[ty] = (agg.channelTypesFinal[ty] || 0) + 1; }
}

// ── main ───────────────────────────────────────────────────────────────────
const report = { meta: { ticks: TICKS, reps: REPS, scaleTicks: SCALE_TICKS, rules: RULES }, soak: newAgg(), scales: {} };

// long soak at one_week
for (let r = 0; r < REPS; r++) runWorld(`world-soak-${r}`, 'one_week', TICKS, report.soak);

// scale comparison
for (const interval of ['one_week', 'one_month', 'one_season', 'one_year']) {
  const agg = newAgg();
  runWorld(`world-scale-${interval}`, interval, SCALE_TICKS, agg);
  report.scales[interval] = {
    ranTicks: agg.ranTicks, throws: agg.throws, distinctFamilies: Object.keys(agg.candByType).length,
    candTotal: Object.values(agg.candByType).reduce((a, b) => a + b, 0),
    promotions: agg.promotions, demotions: agg.demotions, instGained: agg.instGained, instLost: agg.instLost,
    govChanges: agg.govChanges, conversions: agg.conversions, relTypeFlips: agg.relTypeFlips,
    popStart: agg.popStart, popEnd: agg.popEnd,
    layers: { war: agg.warPostureSeen, deploy: agg.deploymentsSeen, occ: agg.occupationsSeen, tradeWar: agg.tradeWarSeen, pantheon: agg.pantheonSeen },
  };
}

// summarize soak
const s = report.soak;
const sum = (a) => a.reduce((x, y) => x + y, 0);
const mean = (a) => a.length ? Math.round(sum(a) / a.length * 100) / 100 : 0;
report.soakSummary = {
  ranTicks: s.ranTicks, throws: s.throws, lastThrow: s.lastThrow,
  distinctDynamicsFired: Object.keys(s.candByType).length,
  candPerTickMean: mean(s.candPerTick), candPerTickMin: Math.min(...s.candPerTick), candPerTickMax: Math.max(...s.candPerTick),
  distinctFamiliesPerTickMean: mean(s.distinctFamiliesPerTick),
  zeroCandTicks: s.zeroCandTicks, noveltyTailFamilies: s.noveltyTail,
  stressorCountMean: mean(s.stressorCountPerTick), stressorCountMax: Math.max(...s.stressorCountPerTick),
  autoApplied: s.autoAppliedTotal, proposals: s.proposalsTotal, majors: s.majorsTotal, resolvedStressors: s.resolvedStressors,
  promotions: s.promotions, demotions: s.demotions, instGained: s.instGained, instLost: s.instLost,
  govChanges: s.govChanges, conversions: s.conversions, captureAdvances: s.captureAdvances,
  corruptionOnsets: s.corruptionOnsets, corruptionExposures: s.corruptionExposures,
  relTypeFlips: s.relTypeFlips, deityTierChanges: s.deityTierChanges, realmArcs: s.realmArcs, conditionPeak: s.conditionPeak,
  occupiedPeak: s.occupiedPeak, occupationTicks: s.occupationTicks, warlikeOccupierTicks: s.warlikeOccupierTicks, conversionsByCause: s.convByCause,
  popStart: s.popStart, popEnd: s.popEnd, popMin: s.popMin === Infinity ? 0 : s.popMin, popMax: s.popMax,
  popDeltaPct: s.popStart ? Math.round((s.popEnd - s.popStart) / s.popStart * 1000) / 10 : 0,
  layersActive: { war: s.warPostureSeen, deployments: s.deploymentsSeen, occupations: s.occupationsSeen, tradeWar: s.tradeWarSeen, warExhaustion: s.warExhaustionSeen, pantheon: s.pantheonSeen },
  stressorByStage: s.stressorByStage, newsBySignificance: s.newsBySignificance,
  channelTypesFinal: s.channelTypesFinal,
  topDynamics: Object.fromEntries(Object.entries(s.candByType).sort((a, b) => b[1] - a[1]).slice(0, 30)),
  stressorTypes: Object.fromEntries(Object.entries(s.stressorByType).sort((a, b) => b[1] - a[1])),
};
writeFileSync(OUT, JSON.stringify(report, null, 2));
const ss = report.soakSummary;
process.stderr.write(`\n=== SOAK (${ss.ranTicks} ticks, ${REPS} reps) ===\n`);
process.stderr.write(`distinct dynamics fired: ${ss.distinctDynamicsFired} | cand/tick ${ss.candPerTickMin}-${ss.candPerTickMax} (mean ${ss.candPerTickMean}) | zeroCandTicks ${ss.zeroCandTicks}\n`);
process.stderr.write(`stressors mean ${ss.stressorCountMean} max ${ss.stressorCountMax} resolved ${ss.resolvedStressors} | stages ${JSON.stringify(ss.stressorByStage)}\n`);
process.stderr.write(`promo ${ss.promotions} demo ${ss.demotions} | inst +${ss.instGained}/-${ss.instLost} | gov ${ss.govChanges} | conversions ${ss.conversions} | captureAdv ${ss.captureAdvances} | corrupt ${ss.corruptionOnsets}/${ss.corruptionExposures} | relFlips ${ss.relTypeFlips} | deityTierΔ ${ss.deityTierChanges}\n`);
process.stderr.write(`layers: ${JSON.stringify(ss.layersActive)}\n`);
process.stderr.write(`occupation: peak ${ss.occupiedPeak} settlement-ticks ${ss.occupationTicks} (warlike-occupier ${ss.warlikeOccupierTicks}) | conversions by cause ${JSON.stringify(ss.conversionsByCause)}\n`);
process.stderr.write(`population ${ss.popStart}→${ss.popEnd} (${ss.popDeltaPct}%) min ${ss.popMin} max ${ss.popMax}\n`);
process.stderr.write(`throws ${ss.throws}${ss.lastThrow ? ' ('+ss.lastThrow+')' : ''}\n`);
process.stderr.write(`DONE → ${OUT}\n`);

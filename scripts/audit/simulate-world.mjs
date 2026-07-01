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
 * HARNESS FIXTURE NOTES (see scripts/audit/AUDIT_REPORT.md §"Whole-world soak"):
 *  • Durable hostility: the war gate (buildWantsWarLookup) reads relationshipStates
 *    THEN edge.relationshipType. We seed each attacker↔target pair as hostile/rival/
 *    cold_war in THREE places that all survive the per-tick threading + any store-
 *    layer rebuild: (1) the regionalGraph edge, (2) worldState.relationshipStates,
 *    (3) each save's settlement.neighbourNetwork. We also keep the alliance/trade
 *    edge loop from re-emitting a same-id edge over a hostile pair — that collision
 *    silently clobbered every hostility seed to trade_partner/allied at graph
 *    construction (dedupeById keeps the last write), so the organic war loop never
 *    fired. No pre-seeded siege: every conquest below is organic.
 *  • Trustworthy scales: advanceCampaignWorld is a SINGLE one-week kernel tick; the
 *    interval only scales population magnitude (~7.8× for one_year), so stacking N
 *    coarse one_year ticks is a harness artifact (+89% pop). The scale section holds
 *    the seed FIXED and runs ticksForInterval() REAL one-week ticks (1/4/12/48), the
 *    same weekly granularity simulateCampaignWorldInterval drives — cross-checked
 *    against it in report.intervalEquivalence.
 *  • Births vs live-AUC: stressorLiveTickAUCByType sums LIVE stressors every tick
 *    (persistence-weighted); stressorBirthsByType counts distinct stressor_birth_*
 *    generation events (the true generation share). appliedByType counts outcomes
 *    that LANDED (r.autoApplied) vs candByType which counts what merely ROLLED.
 *
 * Usage: npx vite-node scripts/audit/simulate-world.mjs -- --ticks 80 --reps 2 --out <p.json>
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { advanceCampaignWorld, ticksForInterval, simulateCampaignWorldInterval } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { deriveAllActiveConditions } from '../../src/domain/activeConditions.js';
import { TIER_ORDER } from '../../src/domain/customContentSchema.js';
import { writeFileSync } from 'node:fs';

function arg(name, def) { const i = process.argv.indexOf(`--${name}`); return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def; }
const TICKS = parseInt(arg('ticks', '80'), 10);
const REPS = parseInt(arg('reps', '2'), 10);
const OUT = arg('out', 'scratchpad/simulate-world.json');
const SCALE_TICKS = parseInt(arg('scaleTicks', '40'), 10);
// --scales 0 skips the scale + interval-equivalence sections (each runs a 48-tick one_year), for a
// fast core-soak structural check. Default on.
const RUN_SCALES = arg('scales', '1') !== '0';
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
  // Defender-attrition SPIKE: OFF by default so the soak baseline is unchanged. Enable
  // with DEFENDER_ATTRITION=1 to validate the spike's convergence (WAR_NEVER_TERMINATED /
  // STALL_RISK must stay clear) before the flag graduates.
  defenderAttritionEnabled: process.env.DEFENDER_ATTRITION === '1',
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
  // hostile / rival / cold_war pairs — strong attacker → weaker target (the organic war fuel).
  const hostilePairs = [[0, 6, 'hostile'], [1, 7, 'hostile'], [2, 8, 'rival'], [3, 9, 'cold_war'], [4, 10, 'rival'], [5, 11, 'hostile']];
  const pairKey = (a, b) => `${ids[a]}::${ids[b]}`;
  const hostileBy = new Set(hostilePairs.flatMap(([a, b]) => [pairKey(a, b), pairKey(b, a)]));
  const edges = [];
  const E = (a, b, rt) => edges.push({ id: `edge.${ids[a]}.${ids[b]}`, from: ids[a], to: ids[b], relationshipType: rt });
  for (const [a, b, rt] of hostilePairs) E(a, b, rt);
  // alliances + trade (relationship dynamics + faith carriers + migration channels). NEVER re-emit an
  // edge over a hostile pair: a same-id alliance/trade edge wins dedupeById (last write) and clobbers
  // the hostility seed at graph construction — the bug that silenced the entire organic war loop.
  E(0, 1, 'allied'); E(2, 3, 'allied'); E(4, 5, 'trade_partner');
  const tryE = (a, b, rt) => { if (!hostileBy.has(pairKey(a, b))) E(a, b, rt); };
  for (let c = 6; c < n; c++) { tryE((c) % 6, c, c % 2 ? 'allied' : 'trade_partner'); tryE((c + 2) % 6, c, c % 2 ? 'trade_partner' : 'allied'); }

  // Durable hostility lives in THREE places the war gate / a rebuild can read, so it survives every
  // tick: (1) the edge above; (2) worldState.relationshipStates — buildWantsWarLookup reads this
  // FIRST, and ensureRelationshipStatesForGraph keeps an existing state, so it is sticky; (3) each
  // end's neighbourNetwork — so a store-layer deriveRegionalGraphFromSaves re-mints the hostile edge
  // (canonicalEdgeForLink reads relationshipFrom/To) rather than refreshing it away. This is the
  // same durable-hostility shape tests/domain/mobilizationPulse.integration seeds.
  const relationshipStates = {};
  for (const [a, b, rt] of hostilePairs) relationshipStates[`edge.${ids[a]}.${ids[b]}`] = { relationshipType: rt };
  for (const [a, b, rt] of hostilePairs) {
    const att = saves[a], tgt = saves[b];
    const base = { relationshipType: rt, relationshipFrom: att.id, relationshipTo: tgt.id, bidirectional: true };
    att.settlement.neighbourNetwork = [...(att.settlement.neighbourNetwork || []),
      { ...base, id: tgt.id, linkId: `link.${att.id}.${tgt.id}`, neighbourName: tgt.name, name: tgt.name }];
    tgt.settlement.neighbourNetwork = [...(tgt.settlement.neighbourNetwork || []),
      { ...base, id: att.id, linkId: `link.${tgt.id}.${att.id}`, neighbourName: att.name, name: att.name }];
  }

  const channels = [];
  const C = (a, b, type) => channels.push({ type, from: ids[a], to: ids[b], status: 'confirmed' });
  for (let i = 1; i < n; i++) C(i - 1, i, 'trade_dependency');
  C(0, 6, 'military_protection'); C(1, 7, 'military_protection'); C(0, n - 1, 'political_authority');
  for (let i = 0; i < n; i += 3) for (let j = i + 3; j < n; j += 4) C(i, j, 'trade_dependency');

  // Seed non-war displacement stressors (spread + flow_migration + mass_migration fuel) on rival
  // targets. NO pre-seeded siege: every siege/conquest now comes from the organic war ramp, so the
  // conquest→occupation→conversion coupling is attributable to the war layer, not a fixture siege.
  const stressors = [
    { id: `world_stressor.famine.${ids[8]}`, type: 'famine', severity: 0.78, affectedSettlementIds: [ids[8]] },
    { id: `world_stressor.disease_outbreak.${ids[10]}`, type: 'disease_outbreak', severity: 0.7, affectedSettlementIds: [ids[10]] },
  ];
  return { ids, saves, edges, channels, relationshipStates, stressors };
}

// ── telemetry ──────────────────────────────────────────────────────────────
function newAgg() {
  return {
    ranTicks: 0, throws: 0,
    candByType: {}, appliedByType: {}, autoAppliedTotal: 0, proposalsTotal: 0, majorsTotal: 0, selectedTotal: 0,
    candPerTick: [], stressorCountPerTick: [], distinctFamiliesPerTick: [], popPerTick: [],
    stressorByType: {}, stressorBirthByType: {}, stressorByStage: {}, resolvedStressors: 0,
    promotions: 0, demotions: 0, instGained: 0, instLost: 0,
    govChanges: 0, conversions: 0, captureAdvances: 0, corruptionOnsets: 0, corruptionExposures: 0,
    popStart: 0, popEnd: 0, popMin: Infinity, popMax: 0,
    relTypeFlips: 0, channelTypesFinal: {}, newsBySignificance: {}, realmArcs: 0,
    convByCause: {}, occupiedPeak: 0, occupationTicks: 0, warlikeOccupierTicks: 0,
    warPostureSeen: false, deploymentsSeen: false, occupationsSeen: false, tradeWarSeen: false, pantheonSeen: false, warExhaustionSeen: false,
    deityTierChanges: 0, conditionPeak: 0,
    stalls: 0, zeroCandTicks: 0, tailFamilyDensity: 0,
    firstSeenTick: {},
  };
}

function runWorld(seedBase, interval, ticks, agg) {
  const { ids, saves: saves0, edges, channels, relationshipStates, stressors } = buildWorld(seedBase);
  let saves = saves0;
  let campaign = {
    id: seedBase, name: 'world', settlementIds: ids,
    worldState: { rngSeed: seedBase, tick: 0, volatility: 'turbulent', stressors, relationshipStates, simulationRules: RULES },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  const tierBy = new Map(saves.map(s => [s.id, s.settlement.tier]));
  // Institutions mutate IN PLACE on closure (status:'remnant', _worldPulseInactive:true; never
  // spliced), so a length delta misses every closure. Track each institution's inactive flag and
  // count flips: active→inactive is a loss, inactive→active (reopen) or a brand-new active id a gain.
  const instInactive = (inst) => inst?._worldPulseInactive === true || inst?.status === 'removed' || inst?.status === 'destroyed';
  const instKey = (inst) => String(inst?.id || inst?.name || '');
  const instStateBy = new Map(saves.map(s => [s.id, new Map((s.settlement.institutions || []).map(i => [instKey(i), instInactive(i)]))]));
  // corruptionOnsets has no engine event; derive it by diffing npcStates corruption:true tick-over-tick.
  let prevCorruptNpcs = new Set();
  const govBy = new Map(saves.map(s => [s.id, s.settlement.powerStructure?.governingName || s.settlement.powerStructure?.government]));
  const faithBy = new Map(saves.map(s => [s.id, s.settlement.config?.primaryDeitySnapshot?.name || null]));
  const relBy = new Map();
  const captureBy = new Map();
  const deityTierBy = {};
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
      // distinct stressor_birth_* GENERATION events (the true generation share) — vs the live-tick
      // AUC below, which persistence-weights long-lived types (rcf's episodic echo inflates its AUC).
      if (ct.startsWith('stressor_birth_')) { const bare = ct.slice('stressor_birth_'.length); agg.stressorBirthByType[bare] = (agg.stressorBirthByType[bare] || 0) + 1; }
      // conversion attribution: occupation-driven vs neighbour-contest
      if (ct === 'stressor_birth_religious_conversion_fracture') { const cause = c.metadata?.conversionCause || 'contest'; agg.convByCause[cause] = (agg.convByCause[cause] || 0) + 1; }
    }
    agg.candPerTick.push(cands.length);
    agg.distinctFamiliesPerTick.push(fams.size);
    if (cands.length === 0) { agg.zeroCandTicks++; }
    // tailFamilyDensity = family-count summed over the last window: a DENSITY of late activity, not
    // novelty. True late-novelty (families first seen IN the window) is derived from firstSeenTick.
    if (t >= ticks - Math.min(10, ticks) && fams.size > 0) agg.tailFamilyDensity += fams.size;
    agg.autoAppliedTotal += (r.autoApplied || []).length;
    agg.proposalsTotal += (r.proposals || []).length;
    agg.majorsTotal += (r.majors || []).length;
    agg.selectedTotal += (r.selected || []).length;
    agg.resolvedStressors += (r.resolvedStressors || []).length;
    // appliedByType: outcomes that LANDED (auto-applied), grouped by type — vs candByType which
    // counts what merely ROLLED (e.g. betrayal/coup_detat roll heavily but land ~0).
    for (const o of (r.autoApplied || [])) { const ot = o.candidateType || o.type || o.ruleId || 'unknown'; agg.appliedByType[ot] = (agg.appliedByType[ot] || 0) + 1; }

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
      // institution gains/losses via inactive-flag flips (a length delta misses in-place closures)
      const prevInst = instStateBy.get(s.id) || new Map();
      const curInst = new Map();
      for (const inst of (s.settlement.institutions || [])) {
        const k = instKey(inst); if (!k) continue;
        const inactive = instInactive(inst); curInst.set(k, inactive);
        if (!prevInst.has(k)) { if (!inactive) agg.instGained++; }     // newly founded, active
        else if (prevInst.get(k) && !inactive) agg.instGained++;        // reopened
        else if (!prevInst.get(k) && inactive) agg.instLost++;          // closed this tick
      }
      instStateBy.set(s.id, curInst);
      const pg = govBy.get(s.id), ng = s.settlement.powerStructure?.governingName || s.settlement.powerStructure?.government;
      if (pg && ng && pg !== ng) agg.govChanges++; govBy.set(s.id, ng);
      const pf = faithBy.get(s.id), nf = s.settlement.config?.primaryDeitySnapshot?.name || null;
      if (pf !== nf) agg.conversions++; faithBy.set(s.id, nf);
      const pc = captureBy.get(s.id), nc = s.settlement.powerStructure?.criminalCaptureState || s.settlement.powerStructure?.captureState;
      if (nc && pc && nc !== pc) agg.captureAdvances++; captureBy.set(s.id, nc);
    }
    agg.popMin = Math.min(agg.popMin, popNow); agg.popMax = Math.max(agg.popMax, popNow);
    agg.popPerTick.push(popNow);   // measured population trajectory (recovery is read, not inferred)
    agg.conditionPeak = Math.max(agg.conditionPeak, condNow);

    // relationship type flips
    for (const [k, v] of Object.entries(r.worldState?.relationshipStates || {})) { const nt = v?.relationshipType; const pt = relBy.get(k); if (pt && nt && pt !== nt) agg.relTypeFlips++; relBy.set(k, nt); }

    // corruption ONSETS: the engine emits no 'onset' event, so derive them by diffing the
    // npcStates corruption flag false→true per npc id, tick-over-tick.
    const npcStates = r.worldState?.npcStates || {};
    const curCorruptNpcs = new Set();
    for (const [id, st] of Object.entries(npcStates)) {
      if (st?.corruption !== true) continue;
      curCorruptNpcs.add(id);
      if (!prevCorruptNpcs.has(id)) agg.corruptionOnsets++;
    }
    prevCorruptNpcs = curCorruptNpcs;
    // EXPOSURES do emit (corruptionEvents kind 'ousted' / 'institution_reformed'); capture too.
    const pr = r.pulseRecord || {};
    for (const e of (pr.corruptionEvents || [])) { if (/ousted|exposed|demoted|reform/.test(e.kind || '')) agg.corruptionExposures++; }
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

// Scale comparison — hold the seed FIXED and run ticksForInterval() REAL one-week ticks (1/4/12/48),
// the granularity simulateCampaignWorldInterval drives. The old loop varied seed AND interval together
// at a fixed tick count, letting every tick apply a coarse interval magnitude (~7.8× for one_year), so
// the "interval collapse" / +89% population was harness arithmetic, not engine hysteresis. A fixed
// seed makes each scale a deterministic prefix of the next (one_week is tick 1 of one_year).
const SCALE_SEED = 'world-scale-fixed';
for (const interval of (RUN_SCALES ? ['one_week', 'one_month', 'one_season', 'one_year'] : [])) {
  const weeks = ticksForInterval(interval);
  const agg = newAgg();
  runWorld(SCALE_SEED, 'one_week', weeks, agg);
  report.scales[interval] = {
    weeks, simulatedMonths: weeks * 0.25,
    ranTicks: agg.ranTicks, throws: agg.throws, distinctFamilies: Object.keys(agg.candByType).length,
    candTotal: Object.values(agg.candByType).reduce((a, b) => a + b, 0), appliedTotal: agg.autoAppliedTotal,
    promotions: agg.promotions, demotions: agg.demotions, instGained: agg.instGained, instLost: agg.instLost,
    govChanges: agg.govChanges, conversions: agg.conversions, relTypeFlips: agg.relTypeFlips,
    popStart: agg.popStart, popEnd: agg.popEnd,
    popDeltaPct: agg.popStart ? Math.round((agg.popEnd - agg.popStart) / agg.popStart * 1000) / 10 : 0,
    layers: { war: agg.warPostureSeen, deploy: agg.deploymentsSeen, occ: agg.occupationsSeen, tradeWar: agg.tradeWarSeen, pantheon: agg.pantheonSeen },
  };
}

// Interval-equivalence cross-check — drive the REAL multi-month driver
// (simulateCampaignWorldInterval = N threaded one-week kernel ticks) from the SAME fixed seed, and
// confirm its composed population stays bounded (no coarse-magnitude spike) and lines up with the
// weekly scale run. This is the trustworthy way to read multi-month population, per gap #8.
report.intervalEquivalence = {};
for (const interval of (RUN_SCALES ? ['one_month', 'one_season', 'one_year'] : [])) {
  const { ids, saves, edges, channels, relationshipStates, stressors } = buildWorld(SCALE_SEED);
  const campaign = {
    id: SCALE_SEED, name: 'world', settlementIds: ids,
    worldState: { rngSeed: SCALE_SEED, tick: 0, volatility: 'turbulent', stressors, relationshipStates, simulationRules: RULES },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  const popStart = saves.reduce((t, sv) => t + (Number(sv.settlement.population) || 0), 0);
  let res = null, threw = null;
  try { res = await simulateCampaignWorldInterval({ campaign, saves, interval, commit: true, autoResolve: true, now: '2026-03-01T00:00:00.000Z' }); }
  catch (e) { threw = String(e).slice(0, 160); }
  const finalById = new Map((res?.settlementUpdates || []).map(u => [String(u.saveId), u.settlement]));
  const popEnd = saves.reduce((t, sv) => t + (Number((finalById.get(String(sv.id)) || sv.settlement).population) || 0), 0);
  report.intervalEquivalence[interval] = {
    weeks: ticksForInterval(interval), driver: 'simulateCampaignWorldInterval', status: res?.status || (threw ? 'threw' : '?'), threw,
    popStart, popEnd, popDeltaPct: popStart ? Math.round((popEnd - popStart) / popStart * 1000) / 10 : 0,
    weeklyScalePopEnd: report.scales[interval]?.popEnd ?? null,
    matchesWeeklyScale: report.scales[interval] ? popEnd === report.scales[interval].popEnd : null,
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
  zeroCandTicks: s.zeroCandTicks,
  // tailFamilyDensity = late-window family-count AUC (activity density, NOT novelty); lateNovelFamilies
  // = families FIRST seen inside the last window (true late novelty), derived from firstSeenTick.
  tailFamilyDensity: s.tailFamilyDensity,
  lateNovelFamilies: Object.values(s.firstSeenTick).filter(ft => ft > s.ranTicks - Math.min(10, s.ranTicks)).length,
  stressorCountMean: mean(s.stressorCountPerTick), stressorCountMax: Math.max(...s.stressorCountPerTick),
  autoApplied: s.autoAppliedTotal, proposals: s.proposalsTotal, majors: s.majorsTotal, resolvedStressors: s.resolvedStressors,
  promotions: s.promotions, demotions: s.demotions, instGained: s.instGained, instLost: s.instLost,
  govChanges: s.govChanges, conversions: s.conversions, captureAdvances: s.captureAdvances,
  corruptionOnsets: s.corruptionOnsets, corruptionExposures: s.corruptionExposures,
  relTypeFlips: s.relTypeFlips, deityTierChanges: s.deityTierChanges, realmArcs: s.realmArcs, conditionPeak: s.conditionPeak,
  occupiedPeak: s.occupiedPeak, occupationTicks: s.occupationTicks, warlikeOccupierTicks: s.warlikeOccupierTicks, conversionsByCause: s.convByCause,
  popStart: s.popStart, popEnd: s.popEnd, popMin: s.popMin === Infinity ? 0 : s.popMin, popMax: s.popMax,
  popMeanPerTick: mean(s.popPerTick),
  popDeltaPct: s.popStart ? Math.round((s.popEnd - s.popStart) / s.popStart * 1000) / 10 : 0,
  layersActive: { war: s.warPostureSeen, deployments: s.deploymentsSeen, occupations: s.occupationsSeen, tradeWar: s.tradeWarSeen, warExhaustion: s.warExhaustionSeen, pantheon: s.pantheonSeen },
  // Organic war loop digest — every link in the chain (none of these can come from a pre-seeded
  // stressor; they are war-layer-only signals): mobilization → deploy → home-bleed → exhaustion →
  // sue-for-peace, plus conquest rolled vs LANDED.
  warChain: {
    war_mobilization: s.candByType.war_mobilization || 0,
    mobilization_reaction: Object.entries(s.candByType).filter(([k]) => k.startsWith('mobilization_reaction')).reduce((a, [, v]) => a + v, 0),
    strategy_deploy: s.candByType.strategy_deploy || 0,
    army_deployed: s.candByType.army_deployed || 0,
    war_drain: s.candByType.war_drain || 0,
    war_exhaustion: s.candByType.war_exhaustion || 0,
    sue_for_peace: s.candByType.strategy_sue_for_peace || 0,
    conquestRolled: s.candByType.conquest || 0,
    conquestApplied: s.appliedByType.conquest || 0,
  },
  stressorByStage: s.stressorByStage, newsBySignificance: s.newsBySignificance,
  channelTypesFinal: s.channelTypesFinal,
  topDynamics: Object.fromEntries(Object.entries(s.candByType).sort((a, b) => b[1] - a[1]).slice(0, 30)),
  topApplied: Object.fromEntries(Object.entries(s.appliedByType).sort((a, b) => b[1] - a[1]).slice(0, 30)),
  stressorBirthsByType: Object.fromEntries(Object.entries(s.stressorBirthByType).sort((a, b) => b[1] - a[1])),
  stressorLiveTickAUCByType: Object.fromEntries(Object.entries(s.stressorByType).sort((a, b) => b[1] - a[1])),
};

// Self-diagnosing health flags — make a soak fail LOUDLY if a load-bearing dynamic goes silent. The
// WAR_LOOP_SILENT flag is the exact regression this harness pass fixed (the organic war loop firing
// 0× because seeded hostility was clobbered before tick 1); it guards against a quiet re-break.
{
  const ss = report.soakSummary;
  const flags = [];
  if (ss.throws > 0) flags.push('THREW');
  if (!ss.layersActive.war) flags.push('WAR_LOOP_SILENT');
  if (ss.warChain.strategy_deploy === 0) flags.push('NO_DEPLOY');
  if (ss.warChain.conquestApplied === 0) flags.push('NO_ORGANIC_CONQUEST');
  if (ss.warChain.sue_for_peace === 0) flags.push('WAR_NEVER_TERMINATED');
  if (Math.abs(ss.popDeltaPct) > 50) flags.push(`POP_SWING_${ss.popDeltaPct}pct`);
  if (ss.zeroCandTicks > ss.ranTicks * 0.2) flags.push('STALL_RISK');
  ss.flags = flags;
  ss.healthy = flags.length === 0;
}
writeFileSync(OUT, JSON.stringify(report, null, 2));
const ss = report.soakSummary;
process.stderr.write(`\n=== SOAK (${ss.ranTicks} ticks, ${REPS} reps) ===\n`);
process.stderr.write(`distinct dynamics fired: ${ss.distinctDynamicsFired} | cand/tick ${ss.candPerTickMin}-${ss.candPerTickMax} (mean ${ss.candPerTickMean}) | zeroCandTicks ${ss.zeroCandTicks}\n`);
process.stderr.write(`stressors mean ${ss.stressorCountMean} max ${ss.stressorCountMax} resolved ${ss.resolvedStressors} | stages ${JSON.stringify(ss.stressorByStage)}\n`);
process.stderr.write(`promo ${ss.promotions} demo ${ss.demotions} | inst +${ss.instGained}/-${ss.instLost} | gov ${ss.govChanges} | conversions ${ss.conversions} | captureAdv ${ss.captureAdvances} | corrupt onsets ${ss.corruptionOnsets} exposures ${ss.corruptionExposures} | relFlips ${ss.relTypeFlips} | deityTierΔ ${ss.deityTierChanges}\n`);
process.stderr.write(`layers: ${JSON.stringify(ss.layersActive)}\n`);
process.stderr.write(`war chain (organic): ${JSON.stringify(ss.warChain)}\n`);
process.stderr.write(`rolled→landed: betrayal ${(s.candByType.stressor_birth_betrayal || 0)}→${(s.appliedByType.stressor_birth_betrayal || 0)} | coup_detat ${(s.candByType.stressor_birth_coup_detat || 0)}→${(s.appliedByType.stressor_birth_coup_detat || 0)}\n`);
process.stderr.write(`tailFamilyDensity ${ss.tailFamilyDensity} | lateNovelFamilies ${ss.lateNovelFamilies}\n`);
process.stderr.write(`stressor births (generation share): ${JSON.stringify(ss.stressorBirthsByType)}\n`);
process.stderr.write(`stressor live-tick AUC: ${JSON.stringify(ss.stressorLiveTickAUCByType)}\n`);
process.stderr.write(`occupation: peak ${ss.occupiedPeak} settlement-ticks ${ss.occupationTicks} (warlike-occupier ${ss.warlikeOccupierTicks}) | conversions by cause ${JSON.stringify(ss.conversionsByCause)}\n`);
process.stderr.write(`population ${ss.popStart}→${ss.popEnd} (${ss.popDeltaPct}%) min ${ss.popMin} max ${ss.popMax} mean/tick ${ss.popMeanPerTick}\n`);
process.stderr.write(`throws ${ss.throws}${ss.lastThrow ? ' (' + ss.lastThrow + ')' : ''}\n`);
process.stderr.write(`\n=== SCALES (fixed seed, ticksForInterval weekly ticks) ===\n`);
for (const [iv, sc] of Object.entries(report.scales)) process.stderr.write(`${iv} (${sc.weeks}w / ${sc.simulatedMonths}mo): cand ${sc.candTotal} applied ${sc.appliedTotal} fam ${sc.distinctFamilies} | pop ${sc.popStart}→${sc.popEnd} (${sc.popDeltaPct}%) | layers ${JSON.stringify(sc.layers)}\n`);
process.stderr.write(`\n=== INTERVAL-EQUIVALENCE (simulateCampaignWorldInterval, fixed seed) ===\n`);
for (const [iv, eq] of Object.entries(report.intervalEquivalence)) process.stderr.write(`${iv} (${eq.weeks}w) ${eq.status}: pop ${eq.popStart}→${eq.popEnd} (${eq.popDeltaPct}%) | weeklyScalePopEnd ${eq.weeklyScalePopEnd} match=${eq.matchesWeeklyScale}${eq.threw ? ' THREW ' + eq.threw : ''}\n`);
process.stderr.write(`\nHEALTH: ${ss.healthy ? 'OK (no flags)' : 'FLAGS → ' + ss.flags.join(', ')}\n`);
process.stderr.write(`DONE → ${OUT}\n`);

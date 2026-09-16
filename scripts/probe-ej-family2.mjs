/**
 * scripts/probe-ej-family2.mjs — E-J FAMILY-2 CROSS-TICK REACHABILITY PROBE (TRANCHE 3b-C).
 *
 * VERIFY-FIRST evidence script (NOT a shipped code path, NOT a vitest test). It answers the
 * two preconditions E-J-v2 deferred for the CROSS-TICK war chain, then STOPS — the family-2
 * `causedBy` edge was NOT built because precondition V2 is DISPROVEN.
 *
 * THE QUESTION: can a conquest/occupation applied-outcome receipt name its mobilization/deploy
 * PARENT's RECORDED key (`wizard_news.<parentTick>.world_pulse.applied.world_outcome.<type>...`),
 * dark, with NO persisted-shape change? (E-J-v2's family-1 waves worked because parent+child are
 * minted in the SAME advance; family-2 is cross-tick — the deploy fires ticks before the conquest.)
 *
 * HOW IT DRIVES: the emergentArcSoak fixture, verbatim (15y one_month x 8 settlements, seed
 * 'arc-soak-seed', full_simulation rules + provenanceLedgerEnabled lit test-locally). Deterministic.
 *
 * ── MEASURED VERDICT (seed 'arc-soak-seed', base composite-r4 bff01718) ──────────────────────
 * V1 REACHABILITY = YES. 2 conquests fire (t=83 b->c, t=104 e->f). BOTH are recorded ledger keys,
 *   and BOTH deploy parents are recorded keys too:
 *     wizard_news.83.world_pulse.applied.world_outcome.conquest.c.83
 *     wizard_news.104.world_pulse.applied.world_outcome.conquest.f.104
 *     wizard_news.81.world_pulse.applied.world_outcome.strategy_deploy.b.c.81   (deploy for b->c)
 *     wizard_news.81.world_pulse.applied.world_outcome.strategy_deploy.e.f.81   (deploy for e->f)
 *   Both deploys are genuinely cross-tick (deploy@81 -> conquest@83 / @104). The raw war OUTCOMES
 *   carry no top-level sourceEventId/causedBy, but their APPLIED NEWS ENTRIES do
 *   (newsEntryForOutcome, applyWorldPulse.js:290: `sourceEventId: outcome.id`), so they land as keys.
 *
 * V2 CROSS-TICK PARENT-KEY DERIVABILITY = NO. At each conquest's RECORD seam
 *   (appendPulseHistoryWithProvenance, pulseKernel.js:2497), `worldState.deployments[occupier]` is
 *   ABSENT (measured `depAtRecord === null`): the siege resolves and the besieger's deployment is
 *   moved into resolvedDeployments at pulseKernel.js:870 — ~1600 lines and all movers before the
 *   recorder — so the deploy tick (`sinceTick=81`, the ONLY persisted carrier of the deploy tick)
 *   is gone. `warPosture[occupier].sinceTick` holds the tick the CURRENT posture was entered
 *   (measured 82 / 84), NOT the deploy tick 81, so reconstructing the parent key from it yields a
 *   NON-recorded key (`reconstructedDeployKeyIsRecorded === false`). Occupier + target ARE derivable
 *   from the conquest outcome; the deploy tick T_d is NOT persisted anywhere reachable at record time.
 *
 * => Deriving the deploy/mobilization parent's recorded key at conquest record time REQUIRES A NEW
 *    PERSISTED FIELD (stamp the deploy tick / deploy-outcome id onto the conquest power_transfer or
 *    the occupations ledger at conquest time). That is a durable-receipt persistence-shape change =
 *    OWNER-GATED. Per the 3b-C brief: STOP, do NOT force it, move to the owner manifest.
 *
 * Run: node scripts/probe-ej-family2.mjs [outfile.json]   (writes evidence JSON to tmpdir by default)
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { simulateCampaignWorldPulse } from '../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../src/domain/region/index.js';
import { buildSpatialDigest } from '../src/domain/spatial/index.js';
import { SIMULATION_RULE_PRESETS } from '../src/domain/worldPulse/simulationRules.js';
import { stablePart } from '../src/domain/worldPulse/worldState.js';
import { makeGridPack, placeSettlements } from '../tests/fixtures/spatialPackFixtures.js';

const OUT = process.argv[2] || path.join(os.tmpdir(), 'probe-ej-family2-out.json');
const NOW = '2026-01-01T00:00:00.000Z';
const GRAIN = 'Bulk grain and foodstuffs';
const IDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const TICKS = 15 * 12;
const SEED = 'arc-soak-seed';
const RULES = Object.freeze({ ...SIMULATION_RULE_PRESETS.full_simulation.rules, provenanceLedgerEnabled: true });
const deity = (ref, name, align, law, rank) => ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const D = { lg: deity('custom:as_dawn', 'Dawnfather', 'good', 'lawful', 'major'), ce: deity('custom:as_maw', 'The Maw', 'evil', 'chaotic', 'major') };

function spatialDigest() {
  const pack = makeGridPack({ cols: 10, rows: 8 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}
function stt(name, patron, { exports = [], imports = [], patch = {} } = {}) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35, primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron },
    institutions: [], economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: { publicLegitimacy: { score: 26, label: 'Legitimacy Crisis' }, factions: [
      { faction: 'Merchant League', category: 'economy', power: 68 }, { faction: 'Temple Wardens', category: 'religious', power: 57 }, { faction: 'City Guard', category: 'military', power: 50 }], conflicts: [] },
    npcs: [
      { id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key', category: 'civic', personality: { dominant: 'stern' } },
      { id: `factor_${name}`, name: `Factor ${name}`, importance: 'key', category: 'economy', personality: { dominant: 'bold' } },
      { id: `deacon_${name}`, name: `Deacon ${name}`, importance: 'notable', category: 'religious', personality: { dominant: 'devout' } }],
    activeConditions: [], ...patch,
  };
}
const save = (id, name, patron, opts) => ({ id, name, phase: 'canon', settlement: stt(name, patron, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const ch = (to) => ({ id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to, goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed' });
function makeSaves() {
  return IDS.map((id, i) => (i === 0
    ? save(id, 'Ashford', D.lg, { exports: [GRAIN], patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.85 }] } })
    : save(id, `S${id.toUpperCase()}`, i % 2 ? D.ce : D.lg, { imports: [GRAIN], ...(i < 3 ? { patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.78 }] } } : {}) })));
}
function makeCampaign(seed) {
  return {
    id: 'arc-soak', name: 'Emergent Arc Soak', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, calendar: { elapsedWeeks: 4 }, simulationRules: { ...RULES },
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.92, affectedSettlementIds: ['a'], age: 3 },
        { id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 2 },
        { id: 'world_stressor.disease_outbreak.c', type: 'disease_outbreak', severity: 0.74, affectedSettlementIds: ['c'], age: 1 }],
      spatialCanonVersion: 1, spatialDigest: spatialDigest() },
    regionalGraph: ensureRegionalGraph({
      edges: [...IDS.slice(1).map((to) => ({ id: `e.a.${to}`, from: 'a', to, relationshipType: 'trade_partner' })),
        { id: 'e.b.c', from: 'b', to: 'c', relationshipType: 'rival' }, { id: 'e.c.d', from: 'c', to: 'd', relationshipType: 'hostile' },
        { id: 'e.e.f', from: 'e', to: 'f', relationshipType: 'rival' }, { id: 'e.a.h', from: 'a', to: 'h', relationshipType: 'ally' }],
      channels: IDS.slice(1).map(ch) }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

// ── DRIVE, capturing per-tick conquests + the live army/transit state at each conquest's record seam ──
let campaign = makeCampaign(SEED);
let saves = makeSaves();
const conquests = [];
for (let t = 0; t < TICKS; t++) {
  const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
  const dig = r.pulseRecord?.impactDigest || [];
  const digIds = new Set(dig.map((d) => String(d.id)));
  for (const o of (r.selected || [])) {
    if (o?.type === 'power_transfer' && o?.powerTransfer?.cause === 'conquest') {
      const occupier = String(o?.condition?.causes?.[0]?.source ?? '');
      const target = String(o?.targetSaveId ?? '');
      const ws = r.worldState || {};
      const dep = (ws.deployments || {})[occupier] || null;
      const wp = (ws.warPosture || {})[occupier] || null;
      conquests.push({
        tick: r.tick, occupier, target,
        conquestNewsId: `wizard_news.${r.tick}.world_pulse.applied.${o.id}`,
        conquestInDigest: digIds.has(`wizard_news.${r.tick}.world_pulse.applied.${o.id}`),
        depAtRecord: dep ? { targetId: dep.targetId ?? null, sinceTick: dep.sinceTick ?? null, role: dep.role ?? null } : null,
        warPostureAtRecord: wp ? { state: wp.state ?? null, sinceTick: wp.sinceTick ?? null } : null,
      });
    }
  }
  const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
  saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
  campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews || campaign.wizardNews };
}

const provenance = campaign.worldState?.spatialLedgers?.provenance || {};
const keys = Object.keys(provenance);
const keySet = new Set(keys);
const deepChainList = [];
for (const k of keys) for (const p of (provenance[k]?.parents || [])) if (keySet.has(p)) deepChainList.push(`${k} <- ${p}`);
const conquestRecordedKeys = keys.filter((k) => k.includes('.world_outcome.conquest.'));
const deployRecordedKeys = keys.filter((k) => k.includes('.world_outcome.strategy_deploy.'));
const mobRecordedKeys = keys.filter((k) => k.includes('.world_outcome.war_mobilization.'));
const occKeys = keys.filter((k) => /occupation_(vassalized|collapsed|resistance|burden)/.test(k));

const v2 = conquests.map((c) => {
  const F = stablePart(c.occupier), T = stablePart(c.target);
  const Td = c.depAtRecord && Number.isFinite(c.depAtRecord.sinceTick) ? c.depAtRecord.sinceTick : null;
  const reconDeployKey = Td != null ? `wizard_news.${Td}.world_pulse.applied.world_outcome.strategy_deploy.${F}.${T}.${Td}` : null;
  const Tm = c.warPostureAtRecord && Number.isFinite(c.warPostureAtRecord.sinceTick) ? c.warPostureAtRecord.sinceTick : null;
  const reconMobKey = Tm != null ? `wizard_news.${Tm}.world_pulse.applied.world_outcome.war_mobilization.${F}.${Tm}` : null;
  return {
    tick: c.tick, occupier: c.occupier, target: c.target,
    conquestRecorded: keySet.has(c.conquestNewsId), conquestInDigest: c.conquestInDigest,
    depAtRecord: c.depAtRecord, warPostureAtRecord: c.warPostureAtRecord,
    recordedDeployKeysForPair: deployRecordedKeys.filter((k) => k.includes(`.strategy_deploy.${F}.${T}.`)),
    derivable_Td: Td, reconstructedDeployKey: reconDeployKey,
    reconstructedDeployKeyIsRecorded: reconDeployKey ? keySet.has(reconDeployKey) : false,
    derivable_Tm: Tm, reconstructedMobKey: reconMobKey,
    reconstructedMobKeyIsRecorded: reconMobKey ? keySet.has(reconMobKey) : false,
  };
});

const anyDerivable = v2.some((c) => c.reconstructedDeployKeyIsRecorded || c.reconstructedMobKeyIsRecorded);
const out = {
  verdict: { V1_reachability: conquestRecordedKeys.length > 0 && deployRecordedKeys.length > 0 ? 'YES' : 'NO',
    V2_crossTickParentKeyDerivable: anyDerivable ? 'YES' : 'NO',
    overall: anyDerivable ? 'BUILDABLE' : 'BLOCKED (deploy tick not persisted at conquest record seam; requires a new persisted field = owner-gated)' },
  totals: { totalKeys: keys.length, deepChains: deepChainList.length, conquestCount: conquests.length,
    recordedConquestKeys: conquestRecordedKeys.length, recordedDeployKeys: deployRecordedKeys.length,
    recordedMobKeys: mobRecordedKeys.length, recordedOccupationKeys: occKeys.length },
  conquestRecordedKeys, deployRecordedKeys, occKeys, deepChainList, v2,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log('WROTE', OUT);
console.log('VERDICT: V1=%s V2=%s -> %s', out.verdict.V1_reachability, out.verdict.V2_crossTickParentKeyDerivable, out.verdict.overall);
console.log('totalKeys=%d deepChains=%d conquests=%d | recorded conquest=%d deploy=%d mob=%d occupation=%d',
  keys.length, deepChainList.length, conquests.length, conquestRecordedKeys.length, deployRecordedKeys.length, mobRecordedKeys.length, occKeys.length);
for (const c of v2) console.log('  conquest t=%d %s->%s | depAtRecord=%s warPosture=%s | reconDeployRecorded=%s reconMobRecorded=%s',
  c.tick, c.occupier, c.target, JSON.stringify(c.depAtRecord), JSON.stringify(c.warPostureAtRecord), c.reconstructedDeployKeyIsRecorded, c.reconstructedMobKeyIsRecorded);

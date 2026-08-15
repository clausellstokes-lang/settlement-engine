/**
 * interventionDormancyGolden.test.js — W-CONVERGENCE dormancy proof + lit-path
 * anti-vacuity (DESIGN_CONVERGENCE.md §6 "dormancy byte-identity").
 *
 * THE CONSTITUTIONAL DORMANCY LAW: the intervention mover (advanceIntervention, wired into
 * pulseKernel after the war/coup layers) is DORMANT behind the virtual interventionEnabled
 * flag (AND-ed with warLayerEnabled). With the gate ABSENT it must be a pure no-op — no
 * `interventions` ledger, no interventionAdj tilt, no intervention news — byte-identical to
 * the pre-wire engine EVEN IN a channelled war-world (a LIVE coup contest + hostile neighbors
 * who WOULD commit a column if lit). The war / belief / spatial goldens must never move.
 *
 * Pinned two ways (the supplyWebWarfare / corruptionWeb idiom):
 *   1. A FULL-ADVANCE dormancy golden: a warLayer-on, channelled world that WOULD mint an
 *      intervention if lit is driven N ticks with the gate ABSENT, projected to a mechanical
 *      summary (the interventions census + the news/candidate/roll histograms), normalized
 *      + sha256-hashed.
 *   2. A dormancy CONTRACT: the dormant final world carries NO interventions ledger.
 *
 * THE LIT-PATH ANTI-VACUITY: the same fixture with the gate ON actually commits an
 * intervention column through the REAL pulse pipeline (a foreign patron joins the coup).
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/interventionDormancyGolden.test.js -t "captures"
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'intervention-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['ford', 'crown', 'delve'];

function digestFor() {
  const pack = makeGridPack({ cols: 20, rows: 16 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

function ivSettlement(name, { tier = 'town', population = 3000, prosperity = 'Stable', factions } = {}) {
  return {
    name, tier, population,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { prosperity, primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Stable' },
      factions: factions || [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
  };
}

const ivSave = (id, name, patch) => ({ id, name, phase: 'canon', settlement: ivSettlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

// The standing coup at Ferrywater (ford) — a live internal contest with a two-faction
// field (a governing seat + a strong challenger) that keeps the intervention window open.
const coupStressor = () => ({
  id: 'world_stressor.coup_detat.ford',
  type: 'coup_detat',
  severity: 0.55,
  peakSeverity: 0.55,
  originSettlementId: 'ford',
  affectedSettlementIds: ['ford'],
  originContext: { sponsorSettlementId: 'crown' },
});

/**
 * The channelled fixture: Ferrywater (ford) is in a live coup. Crownhold (crown, the
 * birth-stamped sponsor) and Delvemoor (delve) are HOSTILE neighbors who — if the gate is
 * lit — would each consider throwing a column into ford's contest (install_friendlier_regime:
 * hostile edge + challenger affinity). warLayer is ON so the gate's AND-condition is met;
 * only the virtual interventionEnabled flag decides.
 * @param {string} seed @param {boolean} lit
 */
function makeCampaignAndSaves(seed, lit) {
  const saves = [
    ivSave('ford', 'Ferrywater', {
      tier: 'town', population: 3200,
      factions: [
        { faction: 'Town Council', category: 'civic', power: 40, isGoverning: true },
        { faction: 'The Garrison', category: 'military', power: 36 },
      ],
    }),
    ivSave('crown', 'Crownhold', { tier: 'city', population: 55000, prosperity: 'Wealthy' }),
    ivSave('delve', 'Delvemoor', { tier: 'town', population: 4200, prosperity: 'Wealthy' }),
  ];
  /** @type {Record<string, unknown>} */
  const simulationRules = {
    infoMode: 'full', stressorsEnabled: false, warLayerEnabled: true,
    ...(lit ? { interventionEnabled: true } : {}),
  };
  const campaign = {
    id: 'convergence', name: 'Convergence', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules,
      calendar: { elapsedWeeks: 30 },
      spatialCanonVersion: 1,
      spatialDigest: digestFor(),
      stressors: [coupStressor()],
      relationshipStates: {
        'edge.crown.ford': { relationshipType: 'hostile', resentment: 0.5, trust: 0.1 },
        'edge.delve.ford': { relationshipType: 'hostile', resentment: 0.5, trust: 0.1 },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.crown.ford', from: 'crown', to: 'ford', relationshipType: 'hostile' },
        { id: 'edge.delve.ford', from: 'delve', to: 'ford', relationshipType: 'hostile' },
      ],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

function driveTicks(seed, lit, ticks, interval) {
  let { campaign, saves } = makeCampaignAndSaves(seed, lit);
  /** @type {Record<string, number>} */
  const candidateTypes = {};
  /** @type {Record<string, number>} */
  const newsKinds = {};
  let rollTotal = 0;
  let rollPassed = 0;
  for (let t = 0; t < ticks; t++) {
    // Keep the internal contest live across the whole drive (stressorsEnabled is off, so
    // the injected coup is never aged/resolved — re-seed defensively each tick).
    campaign = { ...campaign, worldState: { ...campaign.worldState, stressors: [coupStressor()] } };
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    for (const o of [...(r.selected || []), ...(r.autoApplied || [])]) {
      const type = String(o?.candidateType || o?.type || 'unknown');
      candidateTypes[type] = (candidateTypes[type] || 0) + 1;
    }
    for (const e of (r.wizardNews?.entries || [])) {
      const k = String(e?.impactKind || e?.kind || 'unknown');
      newsKinds[k] = (newsKinds[k] || 0) + 1;
    }
    for (const x of (r.rollExplanations || [])) { rollTotal += 1; if (x && x.passed) rollPassed += 1; }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { campaign, saves, candidateTypes, newsKinds, rollSummary: { total: rollTotal, passed: rollPassed } };
}

/** The interventions census: every committed column, keyed by patron→target:side:motive. */
function interventionCensus(worldState) {
  const led = worldState?.spatialLedgers?.interventions || {};
  return Object.keys(led).sort().map((k) => {
    const r = led[k] || {};
    return `${r.interId}->${r.target}:${r.side}:${r.motive}`;
  });
}

function projectionHash({ campaign, candidateTypes, newsKinds, rollSummary }) {
  const ws = campaign.worldState || {};
  const projection = {
    tick: ws.tick ?? null,
    // The doctrine's signal — dormant ⇒ no interventions ledger ⇒ empty census.
    interventionCensus: interventionCensus(ws),
    interventionCount: interventionCensus(ws).length,
    candidateTypes,
    newsKinds,
    rollSummary,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'cv-a', ticks: 6, interval: 'one_month' },
    { seed: 'cv-b', ticks: 10, interval: 'one_month' },
    { seed: 'cv-c', ticks: 8, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('convergence — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the intervention dormancy manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = dormantHashFor(c);
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    }, 120_000);
    return;
  }

  it('the dormancy manifest exists (run UPDATE_GOLDEN=1 to capture it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full dormant corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('every dormant config reproduces the golden projection (any drift ⇒ dormancy broke)', () => {
    const drift = [];
    for (const c of rows) if (manifest[keyOf(c)] !== dormantHashFor(c)) drift.push(keyOf(c));
    expect(drift).toEqual([]);
  }, 120_000);

  it('dormancy CONTRACT: the gate absent writes NO interventions ledger, even in a live coup world', () => {
    const { campaign } = driveTicks('cv-b', false, 10, 'one_month');
    const sl = /** @type {Record<string, unknown>} */ (campaign.worldState?.spatialLedgers || {});
    expect(sl.interventions, 'no interventions ledger when dormant').toBeUndefined();
    expect(interventionCensus(campaign.worldState)).toEqual([]);
  }, 60_000);
});

describe('convergence — lit-path anti-vacuity (the pulseKernel integration commits a column)', () => {
  it('gate ON: a foreign patron commits an intervention column in the channelled coup, through the real pipeline', () => {
    // Drive long enough for the loaded-dice (E0-rare) initiation to fire on this seed.
    const { campaign } = driveTicks('cv-b', true, 60, 'one_month');
    const census = interventionCensus(campaign.worldState);
    expect(census.length, 'a foreign column materialized under the lit gate (anti-vacuity)').toBeGreaterThan(0);
    // It joined ford's contest on the challenger side (install_friendlier_regime).
    expect(census.some((m) => m.includes('->ford:'))).toBe(true);
  }, 120_000);
});

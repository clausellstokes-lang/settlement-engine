/**
 * beliefAxesDormancyGolden.test.js — D-1 (deep-couplings) dormancy proof + lit anti-vacuity.
 *
 * THE CONSTITUTIONAL DORMANCY LAW (DESIGN_DEEP_COUPLINGS law 2): the belief axes (the two
 * BeliefRecord fields + the cultural feeder's tradition_change beat) are DORMANT behind the
 * virtual `beliefAxesEnabled` flag. A world shaped to tempt BOTH feeders — belief-active +
 * traditions-active + a refugee column afield + a patron that shifts mid-run — is driven N real
 * pulse ticks with the flag ABSENT, and the belief maps must be byte-identical to the pre-D-1
 * engine: NO populationTrendBand, NO observanceLabel, NO tradition_change beat.
 *
 * Pinned the traditions way: (1) a full-advance dormancy golden of the belief-map projection;
 * (2) a dormancy CONTRACT (zero axis fields, zero tradition_change beat when dark, though D-0 +
 * traditions are BOTH lit). The lit anti-vacuity block: the flag ON populates the axes and the
 * cultural beat, and two lit runs are byte-identical.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/beliefAxesDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'belief-axes-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const UPDATE = process.env.UPDATE_GOLDEN === '1';
const FLIP_TICK = 10;
const IDS = ['a', 'b', 'c'];

function spatialDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}
const rel = (id, from, to) => ({ id, from, to, relationshipType: 'allied' });
const chan = (id, from, to) => ({ id, type: 'trade_route', from, to, status: 'confirmed' });
function faithCity(deityRef) {
  return {
    _seed: 's:a', name: 'Ashford', tier: 'city', population: 9000,
    config: { tradeRouteAccess: 'road', economicBase: 'trade', culture: 'lowland', terrainType: 'plains', primaryDeitySnapshot: { name: 'The Ember', _deityRef: deityRef, alignmentAxis: 'good', lawAxis: 'lawful' } },
    institutions: [{ name: 'Town hall', required: true, category: 'civic', status: 'active' }, { name: 'Grand temple', category: 'faith', status: 'active' }],
    economicState: { prosperity: 'Comfortable', primaryExports: [], incomeSources: ['Trade tariffs'] },
    powerStructure: { publicLegitimacy: { score: 55, label: 'Accepted' }, factions: [{ name: 'Temple', isGoverning: true, power: 60 }], conflicts: [] },
    calamityHistory: [], npcs: [], activeConditions: [],
  };
}
const plain = (name, seed) => ({ _seed: seed, name, tier: 'town', population: 1400, config: { economicBase: 'agrarian', terrainType: 'hills', culture: 'upland' }, institutions: [{ name: 'Market', category: 'trade' }], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] }, activeConditions: [], npcs: [] });
const save = (id, name, st) => ({ id, name, phase: 'canon', settlement: st, campaignState: { phase: 'canon', eventLog: [], locks: {} } });

function makeCampaign(seed, lit) {
  const simulationRules = {
    warLayerEnabled: false, traditionsEnabled: true, propagationMode: 'first_order',
    infoMode: 'unreliable', migrationRumorsEnabled: true, ...(lit ? { beliefAxesEnabled: true } : {}),
  };
  return {
    id: 'ba-golden', name: 'ba-golden', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules, calendar: { elapsedWeeks: 0, year: 1 },
      spatialCanonVersion: 1, spatialDigest: spatialDigest(),
      spatialLedgers: { migration: { 'b:c:1': { originId: 'b', destId: 'c', arrivals: 500, departTick: 1, arrivalTick: 40 } } },
    },
    regionalGraph: ensureRegionalGraph({ edges: [rel('e.ab', 'a', 'b'), rel('e.ac', 'a', 'c'), rel('e.bc', 'b', 'c')], channels: [chan('ch.ab', 'a', 'b'), chan('ch.bc', 'b', 'c')] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

/** Drive N ticks; project the belief maps + the axis-field / cultural-beat tallies. */
function projectionFor({ seed, ticks, lit }) {
  let campaign = makeCampaign(seed, lit);
  let saves = [save('a', 'Ashford', faithCity('deity.old')), save('b', 'Briarwatch', plain('Briarwatch', 's:b')), save('c', 'Crownhold', plain('Crownhold', 's:c'))];
  const changeBeatIds = new Set();
  for (let t = 0; t < ticks; t += 1) {
    if (t >= FLIP_TICK) saves = saves.map((s) => (s.id === 'a' ? { ...s, settlement: { ...s.settlement, config: { ...s.settlement.config, primaryDeitySnapshot: { ...s.settlement.config.primaryDeitySnapshot, _deityRef: 'deity.new' } } } } : s));
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    for (const e of (r.wizardNews?.entries || [])) if (e.impactKind === 'tradition_change') changeBeatIds.add(String(e.id));
    const u = new Map((r.settlementUpdates || []).map((x) => [String(x.saveId), x.settlement]));
    saves = saves.map((s) => (u.has(s.id) ? { ...s, settlement: u.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
  }
  /** @type {Record<string, unknown>} */
  const beliefSummary = {};
  let axisFields = 0;
  const maps = campaign.worldState?.spatialLedgers?.beliefMaps || {};
  for (const obs of Object.keys(maps).sort()) {
    for (const slotKey of Object.keys(maps[obs]).sort()) {
      const slot = maps[obs][slotKey];
      for (const subj of Object.keys(slot).sort()) {
        const rec = slot[subj];
        if (!rec || typeof rec !== 'object') continue;
        if ('populationTrendBand' in rec || 'observanceLabel' in rec) axisFields += 1;
        beliefSummary[`${obs}/${slotKey}/${subj}`] = {
          strengthBand: rec.strengthBand, allianceLabel: rec.allianceLabel,
          faithLabel: rec.faithLabel, confBand: Math.round((rec.confidence01 ?? 0) * 10),
        };
      }
    }
  }
  return { tick: campaign.worldState?.tick ?? null, beliefs: beliefSummary, axisFields, changeBeats: changeBeatIds.size };
}

const hashOf = (p) => createHash('sha256').update(JSON.stringify({ tick: p.tick, beliefs: p.beliefs })).digest('hex');

function corpus() {
  return [
    { seed: 'ba-a', ticks: 12, lit: false },
    { seed: 'ba-b', ticks: 16, lit: false },
  ];
}
const keyOf = (c) => [c.seed, c.ticks].join('|');

describe('belief axes — dormancy golden (dark is byte-identical to pre-D-1)', () => {
  const rows = corpus();
  if (UPDATE) {
    it('captures the dormancy manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = hashOf(projectionFor(c));
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    });
    return;
  }

  it('the dormancy manifest exists (run UPDATE_GOLDEN=1 to capture it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });
  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full dormant corpus', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('every dormant config reproduces the golden projection (any drift ⇒ dormancy broke)', () => {
    const drift = [];
    for (const c of rows) if (manifest[keyOf(c)] !== hashOf(projectionFor(c))) drift.push(keyOf(c));
    expect(drift).toEqual([]);
  }, 30_000);

  it('dormancy CONTRACT: the gate absent adds NO axis field and NO tradition_change beat', () => {
    for (const c of rows) {
      const p = projectionFor(c);
      expect(p.axisFields, `${keyOf(c)}: no belief record carries an axis field when dark`).toBe(0);
      expect(p.changeBeats, `${keyOf(c)}: no cultural beat when dark (D-0 + traditions still lit)`).toBe(0);
      expect(Object.keys(p.beliefs).length, `${keyOf(c)}: the fixture actually forms beliefs (non-vacuous)`).toBeGreaterThan(0);
    }
  }, 30_000);
});

describe('belief axes — lit anti-vacuity (the flag populates the axes)', () => {
  it('gate ON: axis fields populate and the cultural beat fires', () => {
    const lit = projectionFor({ seed: 'ba-lit', ticks: 16, lit: true });
    expect(lit.axisFields, 'lit belief records carry the axis fields').toBeGreaterThan(0);
    expect(lit.changeBeats, 'the rededication became rumor-visible').toBeGreaterThan(0);
  }, 30_000);

  it('gate ON: two lit runs are byte-identical (deep determinism)', () => {
    const a = projectionFor({ seed: 'ba-det', ticks: 16, lit: true });
    const b = projectionFor({ seed: 'ba-det', ticks: 16, lit: true });
    expect(hashOf(a)).toBe(hashOf(b));
  }, 30_000);
});

/**
 * provenanceDormancyGolden.test.js — THE PROVENANCE LEDGER dormancy proof + lit-path
 * anti-vacuity (design: engine finale #1, the constitutional dormancy law).
 *
 * The recorded cause-edge writer (appendPulseHistoryWithProvenance, wired at the sole
 * commit chokepoint) is DORMANT behind the virtual provenanceLedgerEnabled flag. With
 * the gate ABSENT it is a pure no-op — no 'provenance' ledger key, and the pulseHistory
 * it commits is byte-identical to the pre-writer engine.
 *
 * Pinned three ways:
 *   1. A FULL-ADVANCE dormancy golden: a real multi-tick run with the gate absent,
 *      projected to a MECHANICAL summary (tick + the pulseHistory structure + the
 *      provenance ledger, which is null when dormant), ORACLE-NORMALIZED + hashed.
 *   2. A dormancy CONTRACT: the gate absent adds NO 'provenance' ledger.
 *   3. LIT-PATH ANTI-VACUITY: the gate ON populates public cause edges plus
 *      mechanically-tagged state-only roots,
 *      AND the pulseHistory is IDENTICAL to the dormant run (the writer is additive-
 *      only — it never perturbs the pulse record). A pin that never fires is worthless.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/provenanceDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'provenance-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

function struckTown(name) {
  return {
    name, tier: 'town', population: 1500,
    config: { tradeRouteAccess: 'road', economicBase: 'agrarian' },
    institutions: [
      { name: 'Town hall', required: true, category: 'civic' },
      { name: 'Market', category: 'trade' },
      { name: 'Blacksmith', category: 'crafts' },
      { name: 'Garrison', category: 'military' },
    ],
    economicState: { prosperity: 'Comfortable', primaryExports: ['grain'], primaryImports: ['iron'] },
    powerStructure: { publicLegitimacy: { score: 45, label: 'Contested' }, factions: [], conflicts: [] },
    calamityHistory: [{ type: 'fire', name: `Calamity of ${name}`, year: 4, tick: 208, deaths: 90, exodus: 200, k: 1, targets: ['Tannery'] }],
    npcs: [{ id: `steward_${name}`, name: `Steward ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}
const plainTown = (name) => ({
  name, tier: 'town', population: 1400, config: { economicBase: 'agrarian' },
  institutions: [{ name: 'Market', category: 'trade' }],
  economicState: { prosperity: 'Comfortable', primaryExports: [], primaryImports: [] },
  powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
  activeConditions: [], npcs: [],
});
const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/** @param {string} seed @param {boolean} lit */
function makeCampaignAndSaves(seed, lit) {
  const saves = [
    save('a', 'Ashford', struckTown('Ashford')),
    save('b', 'Briarwatch', plainTown('Briarwatch')),
    save('c', 'Corveth', struckTown('Corveth')),
  ];
  const simulationRules = lit
    ? { warLayerEnabled: true, upswingArcsEnabled: true, provenanceLedgerEnabled: true }
    : { warLayerEnabled: true, upswingArcsEnabled: true };
  const campaign = {
    id: 'prov-pulse', name: 'Provenance Pulse', settlementIds: ['a', 'b', 'c'],
    worldState: {
      rngSeed: seed, tick: 260, simulationRules,
      calendar: { elapsedWeeks: 260, year: 5 }, stressors: [],
    },
    regionalGraph: ensureRegionalGraph({ edges: [
      { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' },
      { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
    ] }),
    wizardNews: { currentTick: 260, entries: [] },
  };
  return { campaign, saves };
}

/** Drive N ticks; return final { campaign, saves }. */
function driveTicks(seed, lit, ticks, interval) {
  let { campaign, saves } = makeCampaignAndSaves(seed, lit);
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { campaign, saves };
}

/** The mechanical projection: tick + the pulseHistory STRUCTURE + the provenance ledger. */
function projection({ campaign }) {
  const ws = campaign.worldState || {};
  const ledgers = ws.spatialLedgers || {};
  const history = (ws.pulseHistory || []).map((r) => ({
    id: r.id, tick: r.tick, selected: r.selectedCount ?? null,
    outcomes: (r.selectedOutcomes || []).map((o) => o.id),
    digest: (r.impactDigest || []).map((d) => d.id),
  }));
  return { tick: ws.tick ?? null, provenance: ledgers.provenance || null, history };
}
function hashOf(state) {
  return createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection(state)))).digest('hex');
}

function corpus() {
  return [
    { seed: 'prov-a', ticks: 5, interval: 'one_month' },
    { seed: 'prov-b', ticks: 8, interval: 'one_month' },
    { seed: 'prov-c', ticks: 6, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => hashOf(driveTicks(c.seed, false, c.ticks, c.interval));

describe('provenance ledger — dormancy golden (wired-but-dormant is byte-identical)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the provenance dormancy manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = dormantHashFor(c);
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

  it('covers the full dormant corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('every dormant config reproduces the golden projection (any drift ⇒ dormancy broke)', () => {
    const drift = [];
    for (const c of rows) if (manifest[keyOf(c)] !== dormantHashFor(c)) drift.push(keyOf(c));
    expect(drift).toEqual([]);
  }, 30_000);

  it('dormancy CONTRACT: the gate absent adds NO provenance ledger', () => {
    const { campaign } = driveTicks('prov-b', false, 8, 'one_month');
    expect(campaign.worldState?.spatialLedgers?.provenance, 'no provenance ledger when dormant').toBeUndefined();
  });
});

describe('provenance ledger — lit-path anti-vacuity (the recorded edges appear)', () => {
  it('gate ON: the provenance ledger POPULATES with recorded cause-edges', () => {
    const { campaign } = driveTicks('prov-b', true, 8, 'one_month');
    const led = campaign.worldState?.spatialLedgers?.provenance;
    expect(led, 'the provenance ledger materializes when lit').toBeTruthy();
    const ids = Object.keys(led);
    expect(ids.length, 'recorded edges accumulate').toBeGreaterThan(0);
    const parentEdgeCount = ids.filter(id => led[id].parents?.length > 0).length;
    const mechanicalCount = ids.filter(id => led[id].receiptClass === 'mechanical').length;
    // Every entry is structural — parent id(s), a type, a tick, and only the
    // conditional mechanical class marker; no prose/PII keys.
    for (const id of ids.slice(0, 20)) {
      expect(Array.isArray(led[id].parents)).toBe(true);
      expect(typeof led[id].type).toBe('string');
      expect(Number.isFinite(led[id].tick)).toBe(true);
      if (led[id].parents.length === 0) expect(led[id].receiptClass).toBe('mechanical');
      if (led[id].receiptClass === 'mechanical') {
        expect(Object.keys(led[id]).sort())
          .toEqual(['parents', 'receiptClass', 'tick', 'type']);
      } else {
        expect(Object.keys(led[id]).sort()).toEqual(['parents', 'tick', 'type']);
      }
    }
    expect(parentEdgeCount, 'at least one real cause edge exists').toBeGreaterThan(0);
    expect(mechanicalCount, 'state-only audit roots exist').toBeGreaterThan(0);
  }, 30_000);

  it('gate ON is ADDITIVE-ONLY: the pulseHistory is identical to the dormant run', () => {
    const lit = driveTicks('prov-b', true, 8, 'one_month');
    const dark = driveTicks('prov-b', false, 8, 'one_month');
    const strip = (ws) => (ws.pulseHistory || []).map((r) => ({ id: r.id, tick: r.tick, outcomes: (r.selectedOutcomes || []).map((o) => o.id), digest: (r.impactDigest || []).map((d) => d.id) }));
    expect(strip(lit.campaign.worldState)).toEqual(strip(dark.campaign.worldState));
  }, 30_000);
});

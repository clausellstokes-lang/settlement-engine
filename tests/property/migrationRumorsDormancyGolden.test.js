/**
 * migrationRumorsDormancyGolden.test.js — D-0 (deep-couplings) dormancy proof + lit walkthrough.
 *
 * THE CONSTITUTIONAL DORMANCY LAW (DESIGN_DEEP_COUPLINGS law 2): the migration rumor carrier
 * (rumorCarrierParams → advanceRumorLedgers' refugee lane + the migration_flight seed events) is
 * DORMANT behind the virtual `migrationRumorsEnabled` flag. A war-flight-shaped spatial world —
 * one with a refugee column afield (pre-seeded in-transit, the migration.js MigrationColumn shape)
 * — is driven N real pulse ticks with the flag ABSENT, and the rumor ledgers must be byte-identical
 * to the pre-D-0 engine: zero migration_flight record, zero 'refugee' framing, no new ledger key.
 *
 * Pinned the traditions way:
 *   1. A FULL-ADVANCE dormancy golden: the flag-off projection of the rumor ledgers (hashed) —
 *      any drift trips it.
 *   2. A dormancy CONTRACT: the gate absent carries NO migration_flight rumor and NO refugee
 *      framing anywhere, though a column is afield the whole run.
 *
 * THE LIT WALKTHROUGH (the later describe block): flag ON, a war-flight column measurably seeds
 * the ledgers along its path — a migration_flight rumor reaches an en-route settlement with
 * DEGRADED fidelity at distance — and two lit runs are byte-identical (deep determinism).
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/migrationRumorsDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'migration-rumors-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const UPDATE = process.env.UPDATE_GOLDEN === '1';

const IDS = ['a', 'b', 'c', 'd'];

function spatialDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}
const tradeChannel = (to) => ({ id: `ch.a.${to}`, type: 'trade_route', from: 'a', to, status: 'confirmed' });

function save(id, name) {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier: 'town', population: 1600,
      config: { tradeRouteAccess: 'road' }, institutions: [],
      economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: { publicLegitimacy: { score: 40 }, factions: [], conflicts: [] },
      npcs: [], activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

/** A world with an in-flight refugee column a→c (a long journey ⇒ it stays afield the whole run,
 *  relaying + seeding its flight event). Lit ⇒ migrationRumorsEnabled true. */
function makeCampaign(seed, infoMode, lit) {
  const simulationRules = lit
    ? { propagationMode: 'first_order', infoMode, migrationRumorsEnabled: true }
    : { propagationMode: 'first_order', infoMode };
  return {
    id: 'mig-rumor-golden', name: 'mig-rumor-golden', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules,
      spatialCanonVersion: 1, spatialDigest: spatialDigest(),
      spatialLedgers: { migration: { 'a:c:1': { originId: 'a', destId: 'c', arrivals: 500, departTick: 1, arrivalTick: 40 } } },
    },
    regionalGraph: ensureRegionalGraph({ channels: [tradeChannel('b'), tradeChannel('c'), tradeChannel('d')] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

/** Drive N one-week ticks; return the rumor-ledger projection + migration_flight tally. */
function projectionFor({ seed, ticks, infoMode, lit }) {
  let campaign = makeCampaign(seed, infoMode, lit);
  let saves = [save('a', 'Ashford'), save('b', 'Briarwatch'), save('c', 'Crownhold'), save('d', 'Deepmoor')];
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
  }
  /** @type {Record<string, Record<string, unknown>>} */
  const ledgerSummary = {};
  let flightRecords = 0;
  let refugeeFraming = 0;
  const ledgers = campaign.worldState?.spatialLedgers?.rumorLedgers || {};
  for (const sid of Object.keys(ledgers).sort()) {
    /** @type {Record<string, unknown>} */
    const bySid = {};
    for (const [key, rec] of Object.entries(ledgers[sid]).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
      if (rec.content?.what === 'migration_flight') flightRecords += 1;
      if (Array.isArray(rec.framing) && rec.framing.includes('refugee')) refugeeFraming += 1;
      bySid[key] = {
        hop: rec.hopCount, arrival: rec.arrivalTick, eventTick: rec.eventTick,
        what: rec.content?.what ?? null, framing: rec.framing ?? [],
        completenessBand: Math.round((rec.completeness01 ?? 0) * 10),
        magnitude: rec.content?.magnitude ?? null,
      };
    }
    ledgerSummary[sid] = bySid;
  }
  return { infoMode, tick: campaign.worldState?.tick ?? null, ledgers: ledgerSummary, flightRecords, refugeeFraming };
}

const hashOf = (p) => createHash('sha256').update(JSON.stringify({ infoMode: p.infoMode, tick: p.tick, ledgers: p.ledgers })).digest('hex');

function corpus() {
  return [
    { seed: 'mr-a', ticks: 10, infoMode: 'perfect_delayed', lit: false },
    { seed: 'mr-b', ticks: 12, infoMode: 'unreliable', lit: false },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.infoMode].join('|');

describe('migration rumor carrier — dormancy golden (dark is byte-identical to pre-D-0)', () => {
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

  it('dormancy CONTRACT: the gate absent carries NO migration_flight rumor, NO refugee framing', () => {
    for (const c of rows) {
      const p = projectionFor(c);
      expect(p.flightRecords, `${keyOf(c)} must carry no migration_flight when dormant`).toBe(0);
      expect(p.refugeeFraming, `${keyOf(c)} must carry no refugee framing when dormant`).toBe(0);
    }
  }, 30_000);
});

describe('migration rumor carrier — lit walkthrough (the war-flight column seeds along its path)', () => {
  it('gate ON: a migration_flight rumor reaches an en-route settlement with degraded fidelity', () => {
    const lit = projectionFor({ seed: 'mr-lit', ticks: 12, infoMode: 'unreliable', lit: true });
    // The flag lights the lane: the flight event entered the net and rode the carriers.
    expect(lit.flightRecords, 'the lit run seeds migration_flight rumors').toBeGreaterThan(0);
    expect(lit.refugeeFraming, 'the refugee carrier relayed at least once').toBeGreaterThan(0);
    // A migration_flight record heard at distance (hop >= 1, fidelity degraded below full).
    let heardAtDistance = false;
    for (const sid of Object.keys(lit.ledgers)) {
      for (const rec of Object.values(lit.ledgers[sid])) {
        if (rec.what === 'migration_flight' && rec.hop >= 1 && rec.completenessBand < 10) heardAtDistance = true;
      }
    }
    expect(heardAtDistance, 'an en-route settlement heard a road-worn telling of the flight').toBe(true);
  }, 30_000);

  it('gate ON vs OFF: the same fixture diverges only when lit (the flag is the whole seam)', () => {
    const dark = projectionFor({ seed: 'mr-cmp', ticks: 12, infoMode: 'unreliable', lit: false });
    const lit = projectionFor({ seed: 'mr-cmp', ticks: 12, infoMode: 'unreliable', lit: true });
    expect(dark.flightRecords).toBe(0);
    expect(lit.flightRecords).toBeGreaterThan(0);
    expect(hashOf(dark)).not.toBe(hashOf(lit));
  }, 30_000);

  it('gate ON: two lit runs are byte-identical (deep determinism)', () => {
    const a = projectionFor({ seed: 'mr-det', ticks: 12, infoMode: 'unreliable', lit: true });
    const b = projectionFor({ seed: 'mr-det', ticks: 12, infoMode: 'unreliable', lit: true });
    expect(hashOf(a)).toBe(hashOf(b));
  }, 30_000);
});

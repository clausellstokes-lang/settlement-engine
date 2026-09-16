/**
 * rumorLedgerGolden.test.js — the RUMOR-LEDGER golden (Phase 5.5 STEP 3.5).
 *
 * The mirror of worldpulseSpatialGolden for the information layer: the same
 * spatial famine fixture driven through N real pulse ticks with infoMode
 * perfect_delayed / unreliable, projected to a MECHANICAL summary of the rumor
 * ledgers (per-settlement event keys, hop counts, arrival ticks, lineage
 * roots, independence counts, fidelity bands) and hashed — a drift in the
 * seeding gate, hop budget, latency law, degradation distribution, merge rule,
 * or expiry trips it.
 *
 * Inputs are fully deterministic (fixed rngSeed + fixed `now` + a frozen
 * digest that is a pure function of a fixture pack), so the hash is stable
 * across runs and machines — asserted by the two-run determinism test.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/rumorLedgerGolden.test.js
 *
 * ── SHIFT RECORD ────────────────────────────────────────────────────────────
 * A hash manifest cannot show WHY it moved, so every re-record is written down here.
 * Re-recording without adding a row is a deleted alarm.
 *
 * 2026-08-31 — THE METRONOME FINALLY FIRES (1 config of 3 moved; 0 configs added, 0
 *   removed). Lane T8, the shift window. RULED at ODQ §774.2, which ratified J-HER-I:
 *   the cure and this re-record ride T8's declared window, with the record naming the cause.
 *   THE CAUSE IS A GUARD THAT COULD NEVER FIRE. `worldPulseFeedCuration`'s
 *   `isMetronomeRepeat` suppresses a beat repeating the same impactKind, headline,
 *   settlements AND REASONS inside a six-tick window, and `stateOnlyRumorSeedsFromHistory`
 *   runs the PRIVATE rumor seeds through the same predicate. `npcAgency`'s candidate receipt
 *   interpolated two per-tick floats — `Pressure gate 0.62, ambition 0.41.` — so every
 *   re-emission was a different STRING, the reasons key never matched, and the suppressor had
 *   never fired on this family since the day it was built. The sentence is now banded to four
 *   fixed spellings (`eventProse.npcPressureWord` / `npcAmbitionWord`), so it fires.
 *   THE COMPLETE DIFF IS ONE VANISHED RUMOR, measured over the whole projection base-vs-tip
 *   and never inferred from a hash. In `rl-c|14|unreliable`, the seed
 *   `trade:candidate.npc.reform.d_n_d.7` stops being seeded and disappears from ALL FOUR
 *   settlement ledgers (17 keys → 16 on each of a, b, c, d). Not one surviving rumor moved:
 *   zero changes to hop, arrival, eventTick, lineage root or length, independence,
 *   completeness band, accuracy band, magnitude or relay on any other key in any ledger.
 *   That is precisely what the suppressor is for — a repeat that was escaping it.
 *   ⭐ THE OTHER TWO CONFIGS ARE BYTE-IDENTICAL, and they are this record's control:
 *   `rl-a|8|perfect_delayed` and `rl-b|8|unreliable` run the same changed code and their
 *   hashes do not move, so 1 of 3 is a count of a cause and not a sample of a cascade.
 *   ⚠ THE FIGURE WAS RE-MEASURED, NOT INHERITED. HER-7's note predicted "exactly one of its
 *   three configs" at a tree five landings older; this lane re-derived it at its own base and
 *   the prediction held to the config, the settlement set and the key.
 *   TOTALITY CONTROL: the lane's base reproduces all three committed hashes with 0
 *   mismatches, so the two unmoved rows are unmoved and not merely unchecked.
 *   CONTAINMENT: the whole of tests/property/ was run at the tip; this is the only manifest
 *   that moved. The public news entries are unaffected — the effect lives entirely on the
 *   STATE-ONLY seed path, which is why an entry-level diff would have shown nothing.
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { recordGolden } from '../helpers/goldenRecordDoor.js';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'rumor-ledger-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const UPDATE = process.env.UPDATE_GOLDEN === '1';

const IDS = ['a', 'b', 'c', 'd'];
const GRAIN = 'Bulk grain and foodstuffs';

function spatialDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

function save(id, name, exports, imports, patch = {}) {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier: 'town', population: 1600,
      config: { tradeRouteAccess: 'road', priorityEconomy: 25 },
      institutions: [],
      economicState: { primaryExports: exports, primaryImports: imports },
      powerStructure: { publicLegitimacy: { score: 34, label: 'Contested' }, factions: [], conflicts: [] },
      npcs: [{ id: `n_${id}`, name: 'Reeve', importance: 'key' }],
      activeConditions: patch.activeConditions || [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

const grainChannel = (to) => ({
  id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to,
  goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed',
});

function makeCampaign(seed, infoMode) {
  return {
    id: 'rumor-golden', name: 'rumor-golden', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1,
      simulationRules: { propagationMode: 'first_order', infoMode },
      stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 3 }],
      spatialCanonVersion: 1,
      spatialDigest: spatialDigest(),
    },
    regionalGraph: ensureRegionalGraph({ channels: [grainChannel('b'), grainChannel('c'), grainChannel('d')] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

/** Drive N one-week ticks; project the ledgers to the mechanical summary. */
function projectionFor({ seed, ticks, infoMode }) {
  let campaign = makeCampaign(seed, infoMode);
  let saves = [
    save('a', 'Ashford', [GRAIN], [], { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.7 }] }),
    save('b', 'Briarwatch', [], [GRAIN]),
    save('c', 'Crownhold', [], [GRAIN]),
    save('d', 'Deepmoor', [], [GRAIN]),
  ];
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
  }
  /** @type {Record<string, Record<string, unknown>>} */
  const ledgerSummary = {};
  const ledgers = campaign.worldState?.spatialLedgers?.rumorLedgers || {};
  for (const sid of Object.keys(ledgers).sort()) {
    /** @type {Record<string, unknown>} */
    const bySid = {};
    for (const [key, rec] of Object.entries(ledgers[sid]).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
      bySid[key] = {
        hop: rec.hopCount,
        arrival: rec.arrivalTick,
        eventTick: rec.eventTick,
        root: rec.lineageIds?.[1] ?? null,
        lineageLen: rec.lineageIds?.length ?? 0,
        independence: rec.corroborationRoots?.length ?? 0,
        // Banded fidelity (stable under tiny float-law retunes; a real
        // distribution change still moves bands).
        completenessBand: Math.round((rec.completeness01 ?? 0) * 10),
        accuracyBand: Math.round((rec.accuracy01 ?? 0) * 10),
        magnitude: rec.content?.magnitude ?? null,
        relayed: rec.relayedTick != null,
      };
    }
    ledgerSummary[sid] = bySid;
  }
  return { infoMode, tick: campaign.worldState?.tick ?? null, ledgers: ledgerSummary };
}

const hashOf = (p) => createHash('sha256').update(JSON.stringify(p)).digest('hex');

function corpus() {
  return [
    { seed: 'rl-a', ticks: 8, infoMode: 'perfect_delayed' },
    { seed: 'rl-b', ticks: 8, infoMode: 'unreliable' },
    { seed: 'rl-c', ticks: 14, infoMode: 'unreliable' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.infoMode].join('|');

describe('rumor-ledger golden (STEP 3.5, deterministic)', () => {
  const rows = corpus();

  if (UPDATE) {
    it('captures the rumor-ledger golden manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = hashOf(projectionFor(c));
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      recordGolden({ surface: 'rumor-ledger-golden', path: MANIFEST, produce: () => JSON.stringify(out, Object.keys(out).sort(), 2) + '\n' });
      expect(Object.keys(out).length).toBe(rows.length);
    });
    return;
  }

  it('the rumor-ledger manifest exists (run UPDATE_GOLDEN=1 to capture it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full corpus', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('is deterministic across two runs (byte-identical projection)', () => {
    for (const c of rows) {
      expect(hashOf(projectionFor(c))).toBe(hashOf(projectionFor(c)));
    }
  }, 30_000);

  it('anti-vacuity: the ledgers are non-empty and the two modes differ', () => {
    const pd = projectionFor(rows[0]);
    const un = projectionFor(rows[1]);
    expect(Object.keys(pd.ledgers).length).toBeGreaterThan(0);
    expect(Object.keys(un.ledgers).length).toBeGreaterThan(0);
    expect(hashOf(pd)).not.toBe(hashOf(un));
  }, 30_000);

  it('every config produces the golden projection', () => {
    const drift = [];
    for (const c of rows) {
      if (manifest[keyOf(c)] !== hashOf(projectionFor(c))) drift.push(keyOf(c));
    }
    expect(drift).toEqual([]);
  }, 30_000);
});

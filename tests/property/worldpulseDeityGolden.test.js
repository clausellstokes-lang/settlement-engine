/**
 * worldpulseDeityGolden.test.js — the CONSUMER for tests/fixtures/worldpulse-golden-master.json.
 *
 * The generator golden pins GENERATION; the deity-free dormancy oracle pins that a
 * faithless world stays byte-identical. Neither pins the FAITH MACHINERY in motion.
 * This is that pin: a DEITY-ACTIVATED campaign (patrons across the law×align plane,
 * a rival cult, faith spread ON) driven through N real pulse ticks
 * (simulateCampaignWorldPulse — the same kernel the coup soak uses), projected to a
 * MECHANICAL faith summary (the pantheon ledger, per-settlement patron seat +
 * legitimacy, the candidate-selection histogram, and an aggregate roll summary —
 * NEVER prose), ORACLE-NORMALIZED (the dormancy normalizer: absent === {} === [],
 * keys sorted) and hashed. A tuning-constant nudge, an rng fork-label rename, or a
 * stance/piety/amplifier drift in faith code trips this without false-positiving on
 * narrative-copy edits.
 *
 * This is the fixture's FIRST real pin — the deity-free corpus it shipped with was
 * never wired to a consumer. Inputs are fully deterministic (fixed rngSeed + fixed
 * `now`), the seams the within-build determinism tests use.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/worldpulseDeityGolden.test.js
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
// The canonical dormancy oracle (absent === {} === [], key-sorted) — the same
// normalizer every "byte-identical" faith gate references. Imported from its
// defining test, mirroring tests/domain/pantheon.test.js and occupation.test.js.
import { normalizeForDormancy } from '../domain/religionDormancy.byteIdentity.test.js';

const PULSE_MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'worldpulse-golden-master.json');
const NOW = '2026-01-01T00:00:00.000Z';
// Full engine (local + spread): the tolerant reader maps this pre-split key to
// faithSpreadEnabled — the spread-on baseline the soaks drive.
const RULES = { religionDynamicsEnabled: true };

// Patrons spanning the two-axis plane so the pin exercises the law-axis stance
// (W-F2/F4), the piety amplifiers (W-F3), and the corruption plane (W-F3).
const deity = (ref, name, align, law, rank) => ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const D = {
  lg: deity('custom:lu_dawn', 'Dawnfather', 'good', 'lawful', 'major'),   // lawful-good patron
  ce: deity('custom:lu_maw', 'The Maw', 'evil', 'chaotic', 'major'),       // chaotic-evil patron
  le: deity('custom:lu_ledger', 'The Ledger', 'evil', 'lawful', 'minor'),  // lawful-evil rival cult
  nn: deity('custom:lu_still', 'The Still', 'neutral', 'neutral', 'minor'), // true-neutral (stance-zero)
};

function pulseSettlement(name, patron, cults, patch = {}) {
  return {
    name, tier: 'town', population: 1600,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30,
      primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron,
      ...(cults && cults.length ? { cultDeitySnapshots: cults } : {}),
    },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 34, label: 'Contested' },
      factions: [
        { faction: 'Temple Wardens', category: 'religious', power: 62 },
        { faction: 'Merchant League', category: 'economy', power: 55 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `priest_${name}`, name: `Priest ${name}`, importance: 'key' }],
    activeConditions: [],
    ...patch,
  };
}

const pulseSave = (id, name, patron, cults, patch) => ({
  id, name, phase: 'canon', settlement: pulseSettlement(name, patron, cults, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

function makeCampaignAndSaves(seed) {
  const saves = [
    pulseSave('a', 'Ashford', D.lg, [], { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.6 }] }),
    pulseSave('b', 'Briarwatch', D.ce, [D.le]),
    pulseSave('c', 'Crownhold', D.nn, []),
  ];
  const campaign = {
    id: 'deity-pulse', name: 'Deity Pulse', settlementIds: ['a', 'b', 'c'],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules: RULES,
      stressors: [
        { id: 'world_stressor.famine.b', type: 'famine', severity: 0.7, affectedSettlementIds: ['b'], age: 2 },
      ],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
        { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'trade_partner' },
      ],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** The deity-activated pulse corpus: a fixed faith world driven at (seed, N ticks,
 *  interval) points. Key = `${seed}|${ticks}|${interval}`. */
function pulseCorpus() {
  return [
    { seed: 'gm-pulse-a', ticks: 3, interval: 'one_week' },
    { seed: 'gm-pulse-a', ticks: 3, interval: 'one_month' },
    { seed: 'gm-pulse-b', ticks: 5, interval: 'one_month' },
    { seed: 'gm-pulse-c', ticks: 8, interval: 'one_week' },
  ];
}
const pulseKeyOf = (c) => [c.seed, c.ticks, c.interval].join('|');

/** Hash the ORACLE-NORMALIZED MECHANICAL faith projection after N real pulse ticks. */
function pulseHashFor({ seed, ticks, interval }) {
  let { campaign, saves } = makeCampaignAndSaves(seed);
  /** @type {Record<string, number>} */
  const candidateTypes = {};
  let rollTotal = 0;
  let rollPassed = 0;
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    for (const o of [...(r.selected || []), ...(r.autoApplied || [])]) {
      const type = String(o?.candidateType || o?.type || 'unknown');
      candidateTypes[type] = (candidateTypes[type] || 0) + 1;
    }
    for (const x of (r.rollExplanations || [])) {
      rollTotal += 1;
      if (x && x.passed) rollPassed += 1;
    }
    // Thread state forward: worldState + deep-cloned settlement updates → next saves.
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.worldState?.regionalGraph || campaign.regionalGraph };
  }
  // Per-settlement final patron seat + legitimacy (the faith seat + its political hold).
  /** @type {Record<string, {patronRef: string|null, legit: number|null}>} */
  const patrons = {};
  for (const s of saves) {
    const cfg = s.settlement?.config || {};
    const leg = Number(s.settlement?.powerStructure?.publicLegitimacy?.score);
    patrons[s.id] = {
      patronRef: cfg.primaryDeityRef || null,
      legit: Number.isFinite(leg) ? leg : null,
    };
  }
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    pantheon: campaign.worldState?.pantheon || {},   // the deity ledger: wins/losses/seats/tier
    patrons,                                          // per-settlement seat + legitimacy
    candidateTypes,                                   // selection histogram (mechanical)
    rollSummary: { total: rollTotal, passed: rollPassed }, // roll-formula drift
  };
  return createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex');
}

describe('worldPulse deity golden master (deity-activated cross-build mechanical stability)', () => {
  const rows = pulseCorpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the deity-pulse golden manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[pulseKeyOf(c)] = pulseHashFor(c);
      if (!existsSync(dirname(PULSE_MANIFEST))) mkdirSync(dirname(PULSE_MANIFEST), { recursive: true });
      writeFileSync(PULSE_MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    });
    return;
  }

  it('the deity-pulse manifest exists (run UPDATE_GOLDEN=1 to capture it)', () => {
    expect(existsSync(PULSE_MANIFEST)).toBe(true);
  });

  const manifest = existsSync(PULSE_MANIFEST) ? JSON.parse(readFileSync(PULSE_MANIFEST, 'utf-8')) : {};

  it('covers the full pulse corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(pulseKeyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('anti-vacuity: the faith machinery actually moves (a deity holds a seat)', () => {
    // The pin would be worthless if the pulse were inert — prove a patron seat is
    // held and the pantheon ledger is populated on a representative row.
    let { campaign, saves } = makeCampaignAndSaves('gm-pulse-b');
    for (let t = 0; t < 5; t++) {
      const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
      const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
      saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
      campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.worldState?.regionalGraph || campaign.regionalGraph };
    }
    expect(Object.keys(campaign.worldState?.pantheon || {}).length).toBeGreaterThan(0);
    expect(saves.some((s) => s.settlement?.config?.primaryDeityRef)).toBe(true);
  });

  it('every deity-pulse config produces the golden mechanical projection', () => {
    const drift = [];
    for (const c of rows) {
      const k = pulseKeyOf(c);
      if (manifest[k] !== pulseHashFor(c)) drift.push(k);
    }
    expect(drift).toEqual([]);
  }, 30_000);
});

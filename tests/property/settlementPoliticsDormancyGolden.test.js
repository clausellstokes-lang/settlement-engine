/**
 * settlementPoliticsDormancyGolden.test.js — W-DOCTRINE-4 dormancy proof + lit-path
 * anti-vacuity (DESIGN_SETTLEMENT_POLITICS §7).
 *
 * THE CONSTITUTIONAL DORMANCY LAW: the settlement-politics mover (advanceSettlementPolitics,
 * wired into pulseKernel just after the corruption-web mint) is DORMANT behind the virtual
 * settlementPoliticsEnabled flag (AND-ed with factionCompetitionEnabled). With the gate ABSENT
 * it must be a pure no-op — no worldState.politicsLedgers, byte-identical to the pre-wire engine
 * EVEN IN A MULTI-FACTION, WARM-TIED world (two structurally-aligned factions with seated
 * leaders who WOULD coalesce if lit). The faction / belief / deity goldens must never move.
 *
 * Pinned two ways (the corruptionWeb / peaceCausal idiom):
 *   1. A FULL-ADVANCE dormancy golden: a faction-rich world that WOULD form a bloc if lit is
 *      driven N ticks with the gate ABSENT, projected to a mechanical summary (the realm bloc
 *      census + the candidate / news histograms), oracle-normalized + hashed.
 *   2. A dormancy CONTRACT: the dormant final world carries NO politicsLedgers key anywhere.
 *
 * THE LIT-PATH ANTI-VACUITY: the same fixture with the gate ON actually forms a bloc through
 * the REAL pulse pipeline (ensureFactionStates → seatNpcsIntoFactions → advanceSettlementPolitics
 * → worldState.politicsLedgers).
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/settlementPoliticsDormancyGolden.test.js
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../domain/religionDormancy.byteIdentity.test.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'settlement-politics-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['harbor', 'ridge'];

/** A settlement with TWO structurally-aligned factions (merchant + craft) and their seated
 *  PILLAR leaders (importance:'pillar' ⇒ dotRank 3 ⇒ leader_champion), plus a WARM ally tie
 *  between the two leaders — a pair that WOULD coalesce (patronage glue) if politics is lit. */
function polSettlement(name, { governing = 'Merchant League' } = {}) {
  return {
    name, tier: 'town', population: 4200,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Stable' },
      factions: [
        { faction: 'Merchant League', category: 'merchant', power: 44, isGoverning: governing === 'Merchant League' },
        { faction: 'Craft Guild', category: 'craft', power: 40, isGoverning: governing === 'Craft Guild' },
      ],
      conflicts: [],
    },
    npcs: [
      { id: 'lead_m', name: 'Alda Vane', importance: 'pillar', factionAffiliation: 'Merchant League', role: 'Guildmaster' },
      { id: 'lead_c', name: 'Boro Kell', importance: 'pillar', factionAffiliation: 'Craft Guild', role: 'Master Artisan' },
    ],
    relationships: [
      { type: 'ally', typeName: 'Trusted Allies', strength: 'close', npc1Id: 'lead_m', npc2Id: 'lead_c', npc1Name: 'Alda Vane', npc2Name: 'Boro Kell' },
    ],
    activeConditions: [],
  };
}

const polSave = (id, name, patch) => ({ id, name, phase: 'canon', settlement: polSettlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/** @param {string} seed @param {boolean} lit */
function makeCampaignAndSaves(seed, lit) {
  const saves = [
    polSave('harbor', 'Harborford', { governing: 'Merchant League' }),
    polSave('ridge', 'Stonebridge', { governing: 'Craft Guild' }),
  ];
  /** @type {Record<string, unknown>} */
  const simulationRules = {
    stressorsEnabled: false, factionCompetitionEnabled: true,
    ...(lit ? { settlementPoliticsEnabled: true } : {}),
  };
  const campaign = {
    id: 'settlement-politics', name: 'Settlement Politics', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules,
      calendar: { elapsedWeeks: 30 },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.harbor.ridge', from: 'harbor', to: 'ridge', relationshipType: 'trade_partner' }],
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
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    for (const o of [...(r.selected || []), ...(r.autoApplied || [])]) {
      const type = String(o?.candidateType || o?.type || 'unknown');
      candidateTypes[type] = (candidateTypes[type] || 0) + 1;
    }
    for (const e of (r.wizardNews?.entries || [])) {
      const k = String(e?.impactKind || e?.kind || 'unknown');
      newsKinds[k] = (newsKinds[k] || 0) + 1;
    }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { campaign, saves, candidateTypes, newsKinds };
}

/** The realm-wide bloc census: per settlement, its blocs as `id|end|glueType|covert` marks. */
function blocCensus(worldState) {
  const ledgers = worldState?.politicsLedgers || {};
  /** @type {Record<string, string[]>} */
  const census = {};
  for (const cid of Object.keys(ledgers).sort()) {
    const blocs = Array.isArray(ledgers[cid]?.blocs) ? ledgers[cid].blocs : [];
    const marks = blocs.map((b) => `${b.id}|${b.end}|${b.glue?.[0]?.type}|${b.covert ? 'covert' : 'overt'}`).sort();
    if (marks.length) census[cid] = marks;
  }
  return census;
}

function projectionHash({ campaign, candidateTypes, newsKinds }) {
  const ws = campaign.worldState || {};
  const projection = {
    tick: ws.tick ?? null,
    // The doctrine's signal — dormant ⇒ no politicsLedgers key ⇒ empty census ⇒ proven.
    blocCensus: blocCensus(ws),
    hasPoliticsLedger: ws.politicsLedgers !== undefined,
    candidateTypes,
    newsKinds,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'pol-a', ticks: 4, interval: 'one_month' },
    { seed: 'pol-b', ticks: 8, interval: 'one_month' },
    { seed: 'pol-c', ticks: 6, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('settlement politics — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the settlement-politics dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent forms NO bloc, even in a warm-tied multi-faction world', () => {
    const { campaign } = driveTicks('pol-b', false, 8, 'one_month');
    expect(campaign.worldState?.politicsLedgers, 'no politicsLedgers ledger when dormant').toBeUndefined();
  }, 60_000);
});

describe('settlement politics — lit-path anti-vacuity (the pulseKernel integration forms end-to-end)', () => {
  it('gate ON: two aligned, warm-tied factions coalesce through the real pipeline', () => {
    const { campaign } = driveTicks('pol-b', true, 24, 'one_month');
    const census = blocCensus(campaign.worldState);
    const totalBlocs = Object.values(census).reduce((n, marks) => n + marks.length, 0);
    expect(totalBlocs, 'a bloc materialized under the lit gate (anti-vacuity)').toBeGreaterThan(0);
  }, 120_000);
});

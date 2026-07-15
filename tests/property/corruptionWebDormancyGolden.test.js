/**
 * corruptionWebDormancyGolden.test.js — W-DOCTRINE-3b dormancy proof + lit-path
 * anti-vacuity (DESIGN_CORRUPTION_WEB.md §2/§7).
 *
 * THE CONSTITUTIONAL DORMANCY LAW: the corruption-web mover (advanceCorruptionWeb, wired
 * into pulseKernel just after the local corruption onset + capture climb) is DORMANT behind
 * the virtual corruptionWebEnabled flag (AND-ed with beliefsActive). With the gate ABSENT it
 * must be a pure no-op — no minted foreign leash, no npcStates.corruptionLeash, byte-identical
 * to the pre-wire engine EVEN IN A BELIEF-ACTIVE, CHANNELLED world (a hostile/criminal edge, a
 * corruptible target, a pre-seeded obligation that WOULD recruit cheap if lit). The war /
 * belief / corruption goldens must never move. (The broader pre-wire proof is the full existing
 * property/golden suite still passing with this wiring present; this file adds the doctrine-
 * specific fence + the driven-mint anti-vacuity.)
 *
 * Pinned two ways (the supplyWebWarfare / peaceCausal idiom):
 *   1. A FULL-ADVANCE dormancy golden: a belief-active, channelled world that WOULD mint a
 *      foreign asset if lit is driven N ticks with the gate ABSENT, projected to a mechanical
 *      summary (the corrupt-leash census across the realm + the news / roll histograms),
 *      oracle-normalized + hashed.
 *   2. A dormancy CONTRACT: the dormant final world carries NO foreign-web leash anywhere —
 *      no npcStates.corruptionLeash, no settlement.npcs corruptTies.leash with conspiracy
 *      'foreign_web'. The channelled target's clerk stays clean (no criminal org ⇒ no local
 *      onset either, so the ONLY path to corruption is the foreign mint — which is dark).
 *
 * THE LIT-PATH ANTI-VACUITY: the same fixture with the gate ON actually mints a foreign_settlement
 * leash through the REAL pulse pipeline (npcStates.corruptionLeash → the mirror → settlement.npcs).
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/corruptionWebDormancyGolden.test.js
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { normalizeForDormancy } from '../domain/religionDormancy.byteIdentity.test.js';
import { resolveLeash } from '../../src/domain/corruptionLeash.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'corruption-web-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['crown', 'ford', 'midvale'];

function digestFor() {
  const pack = makeGridPack({ cols: 20, rows: 16 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

function cwSettlement(name, { tier = 'town', population = 3000, prosperity = 'Stable', institutions = [], npcs = [] } = {}) {
  return {
    name, tier, population,
    config: { tradeRouteAccess: 'road' },
    institutions,
    economicState: { prosperity, primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Stable' },
      factions: [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true }],
      conflicts: [],
    },
    npcs,
    activeConditions: [],
  };
}

const cwSave = (id, name, patch) => ({ id, name, phase: 'canon', settlement: cwSettlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/**
 * The channelled fixture: Crownhold (a wealthy city) holds a CRIMINAL-NETWORK edge into
 * Ferrywater (a town whose clerk carries a corruptible flaw but whose town has NO criminal
 * institution — so LOCAL onset can never fire; the ONLY route to corruption is a foreign mint).
 * A pre-seeded obligation (Ferrywater owes Crownhold — a decade of "generous" gifts) makes the
 * recruit cheap. If lit, Crownhold mints a covert asset in Ferrywater.
 * @param {string} seed @param {boolean} lit
 */
function makeCampaignAndSaves(seed, lit) {
  const saves = [
    cwSave('crown', 'Crownhold', { tier: 'city', population: 55000, prosperity: 'Wealthy' }),
    cwSave('ford', 'Ferrywater', {
      tier: 'town', population: 3200,
      npcs: [{ id: 'clerk', name: 'Clerk Ana', importance: 'key', personality: { flaw: 'greedy' } }],
    }),
    cwSave('midvale', 'Midvale', { tier: 'town', population: 2600 }),
  ];
  /** @type {Record<string, unknown>} */
  const simulationRules = {
    infoMode: 'full', stressorsEnabled: false,
    ...(lit ? { corruptionWebEnabled: true } : {}),
  };
  const campaign = {
    id: 'corruption-web', name: 'Corruption Web', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules,
      calendar: { elapsedWeeks: 30 },
      spatialCanonVersion: 1,
      spatialDigest: digestFor(),
      // A decade of indebting gifts — Ferrywater owes Crownhold (the E1 obligation multiplier).
      spatialLedgers: { obligations: { 'ford:crown:grain_relief': { from: 'ford', to: 'crown', kind: 'grain_relief', magnitude: 1.0, mintTick: 0, lastTick: 0 } } },
      relationshipStates: {
        'edge.crown.ford': { relationshipType: 'criminal_network', resentment: 0.2, trust: 0.3 },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.crown.ford', from: 'crown', to: 'ford', relationshipType: 'criminal_network' },
        { id: 'edge.ford.midvale', from: 'ford', to: 'midvale', relationshipType: 'trade_partner' },
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

/** The realm-wide corrupt-leash census: for every settlement, its corrupt NPCs and their
 *  RESOLVED leash kind (the deterministic signal a foreign mint would move). */
function leashCensus(saves) {
  /** @type {Record<string, string[]>} */
  const census = {};
  for (const save of saves.sort((a, b) => (a.id < b.id ? -1 : 1))) {
    const npcs = save.settlement?.npcs || [];
    const marks = [];
    for (const npc of npcs) {
      if (npc?.corrupt !== true) continue;
      const leash = resolveLeash(npc, save.settlement);
      marks.push(`${npc.id || npc.name}:${leash.kind}:${leash.settlementId || ''}`);
    }
    if (marks.length) census[String(save.id)] = marks.sort();
  }
  return census;
}

/** Count npcStates carrying a foreign-web corruptionLeash sidecar (the mint's authoritative mark). */
function leashSidecarCount(worldState) {
  const states = worldState?.npcStates || {};
  return Object.values(states).filter((/** @type {any} */ s) => s && s.corruptionLeash && typeof s.corruptionLeash === 'object').length;
}

function projectionHash({ campaign, saves, candidateTypes, newsKinds, rollSummary }) {
  const ws = campaign.worldState || {};
  const projection = {
    tick: ws.tick ?? null,
    // The doctrine's signal — dormant ⇒ no foreign_web leash anywhere ⇒ the manifest proves it.
    leashCensus: leashCensus(saves),
    leashSidecars: leashSidecarCount(ws),
    candidateTypes,
    newsKinds,
    rollSummary,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'cw-a', ticks: 4, interval: 'one_month' },
    { seed: 'cw-b', ticks: 8, interval: 'one_month' },
    { seed: 'cw-c', ticks: 6, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('corruption web — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the corruption-web dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent mints NO foreign leash, even in a channelled belief-world', () => {
    const { campaign, saves } = driveTicks('cw-b', false, 8, 'one_month');
    expect(leashSidecarCount(campaign.worldState), 'no corruptionLeash sidecar when dormant').toBe(0);
    // Ferrywater's clerk stays clean (no criminal org ⇒ no local onset; the foreign mint is dark).
    const census = leashCensus(saves);
    expect(Object.keys(census).length, 'no corrupt NPCs at all when dormant').toBe(0);
  }, 60_000);
});

describe('corruption web — lit-path anti-vacuity (the pulseKernel integration mints end-to-end)', () => {
  it('gate ON: the patron mints a foreign_settlement leash in the channelled target, through the real pipeline', () => {
    const { campaign, saves } = driveTicks('cw-b', true, 24, 'one_month');
    // The authoritative mark: an npcStates.corruptionLeash sidecar (the mint), OR the mirrored
    // corruptTies.leash on a saved NPC (the dual-write). Either proves the pipeline fired.
    const sidecars = leashSidecarCount(campaign.worldState);
    const census = leashCensus(saves);
    const foreignMarks = Object.values(census).flat().filter((m) => m.includes(':foreign_settlement:crown'));
    expect(sidecars + foreignMarks.length, 'a foreign asset materialized under the lit gate (anti-vacuity)').toBeGreaterThan(0);
  }, 120_000);
});

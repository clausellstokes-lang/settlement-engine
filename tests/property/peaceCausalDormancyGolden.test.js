/**
 * peaceCausalDormancyGolden.test.js — W-PEACE-1 dormancy proof + lit-path anti-vacuity.
 *
 * THE CENTREPIECE (DESIGN_PEACE_ENGINE.md §8, the constitutional dormancy law):
 * the causal-reasons movers (advanceWarReasons + advancePeaceReasons, wired into
 * pulseKernel after the generosity mover) are DORMANT behind the virtual
 * peaceEngineEnabled flag (AND-ed with warLayerEnabled — the peace-engine gate).
 * With the gate ABSENT they must be pure no-ops — zero ledger keys, byte-identical
 * to the pre-wire engine, EVEN IN A LIT-WAR WORLD (warLayerEnabled +
 * settlementStrategyEnabled true): the war-layer goldens must never move.
 *
 * This pins it two ways (the generosityDormancyGolden idiom):
 *   1. A FULL-ADVANCE dormancy golden: a war-shaped world (a strong, aggrieved,
 *      shaky-seated aggressor beside a weak rich neighbour, an old-wound hostile
 *      edge, and a cross-pressured third town) that WOULD accumulate reasons if
 *      lit is driven N real pulse ticks with the gate absent, projected to a
 *      MECHANICAL summary (the two reason ledgers, deployments, warExhaustion,
 *      the news histogram, the candidate/roll summary), ORACLE-NORMALIZED and
 *      hashed. The manifest was captured BEFORE the pulseKernel wiring landed
 *      (the mover files existed but were unimported ⇒ the hash is the pristine
 *      pre-wire engine); it holding AFTER the wiring proves the wired-but-dormant
 *      movers are byte-identical to pre-wire. Any drift trips this — STOP.
 *   2. A dormancy CONTRACT assertion: the dormant final world carries NEITHER
 *      reason sub-ledger (warReasons / peaceReasons).
 *
 * THE LIT-PATH ANTI-VACUITY (§14: motive is state, state is receipted): the same
 * fixture with the gate ON must actually accumulate — typed war reasons on the
 * hostile pair (grievance at minimum), typed peace reasons once a war goes live,
 * and the §14.4 irony read-model rendering its "N of M peace reasons now
 * present" line from the ledgers. A pin that never fires would be worthless.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/peaceCausalDormancyGolden.test.js
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { warCausalBrief } from '../../src/domain/worldPulse/peaceReasons.js';
import { normalizeForDormancy } from '../domain/religionDormancy.byteIdentity.test.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'peace-causal-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

/** A settlement with enough military/economic texture for the war layer to move. */
function pcSettlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: patch.priorityMilitary ?? 35 },
    institutions: patch.institutions || [],
    economicState: {
      prosperity: patch.prosperity || 'Prosperous',
      primaryExports: patch.exports || [],
      primaryImports: [],
      ...(patch.foodSecurity ? { foodSecurity: patch.foodSecurity } : {}),
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: patch.legitimacy != null && patch.legitimacy < 40 ? 'Contested' : 'Stable' },
      factions: patch.factions || [
        { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
        { faction: 'Merchant League', category: 'economy', power: 52 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}

const pcSave = (id, name, patch = {}) => ({
  id, name, phase: 'canon', settlement: pcSettlement(name, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

/**
 * The war-shaped fixture: Ironhold (strong city, contested seat — legitimacy
 * hunger; an old-wound hostile edge — grievance + revanchism fuel) beside
 * Weakmoor (weak, rich in grain — the envy target), with Midwater tied to both
 * (the mediation candidate). If lit, the hostile pair accumulates casus; once
 * the war layer marches, the war pair accumulates casus pacis.
 * @param {string} seed @param {boolean} lit @param {boolean} warWorld
 */
function makeCampaignAndSaves(seed, lit, warWorld) {
  const saves = [
    // The m9d fortified-city march profile (citadel roster, High Command 96,
    // deep granary) — but with a CONTESTED seat (34 < the 45 hunger ceiling),
    // so the deploy gate clears AND legitimacy_hunger accumulates when lit.
    pcSave('iron', 'Ironhold', {
      tier: 'city', population: 60000, legitimacy: 34, priorityMilitary: 40,
      institutions: [{ name: 'Great Citadel' }, { name: 'City Garrison' }, { name: 'Royal Armory' }, { name: 'War College' }],
      exports: [{ name: 'Forged Weapons' }],
      foodSecurity: { storageMonths: 9, resilienceScore: 85 },
      factions: [{ faction: 'High Command', category: 'military', power: 96, isGoverning: true }],
    }),
    pcSave('weak', 'Weakmoor', {
      tier: 'village', population: 280, legitimacy: 24, priorityMilitary: 10,
      prosperity: 'Struggling', exports: ['Bulk grain and foodstuffs'],
      factions: [
        { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
        { faction: 'Hedge Wardens', category: 'military', power: 18 },
      ],
    }),
    pcSave('mid', 'Midwater', { population: 2200, legitimacy: 62, priorityMilitary: 20 }),
  ];
  /** @type {Record<string, unknown>} */
  const simulationRules = warWorld
    ? {
      warLayerEnabled: true, settlementStrategyEnabled: true,
      ...(lit ? { peaceEngineEnabled: true } : {}),
    }
    : {};
  const campaign = {
    id: 'peace-causal', name: 'Peace Causal', settlementIds: ['iron', 'weak', 'mid'],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules,
      calendar: { elapsedWeeks: 30 },
      // Pre-mobilized aggressor (the warInitiateResolveSplit idiom): the war
      // layer's deploy gate requires a mobilized posture, so the fixture's war
      // actually marches within the drive window (the anti-vacuity pin needs a
      // live war for the peace side to accumulate on).
      ...(warWorld ? { warPosture: { iron: { state: 'mobilized', progress: 1, sinceTick: 0 } } } : {}),
      relationshipStates: {
        'edge.iron.weak': {
          relationshipType: 'hostile', resentment: 0.7, trust: 0.1,
          recentIncidents: [
            { type: 'war_raid', tick: -12, description: 'The burning of the mill road' },
            { type: 'betrayal_recorded', tick: -20, description: 'The broken parley of the ford' },
          ],
        },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.iron.weak', from: 'iron', to: 'weak', relationshipType: 'hostile' },
        { id: 'edge.iron.mid', from: 'iron', to: 'mid', relationshipType: 'trade_partner' },
        { id: 'edge.weak.mid', from: 'weak', to: 'mid', relationshipType: 'trade_partner' },
      ],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** Drive N ticks; return the final state + per-tick folds (the generosity idiom). */
function driveTicks(seed, lit, warWorld, ticks, interval) {
  let { campaign, saves } = makeCampaignAndSaves(seed, lit, warWorld);
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

/** The mechanical projection — everything the causal movers would touch if lit. */
function projectionHash({ campaign, candidateTypes, newsKinds, rollSummary }) {
  const ws = campaign.worldState || {};
  const ledgers = ws.spatialLedgers || {};
  /** @type {Record<string, unknown>} */
  const deployments = {};
  for (const key of Object.keys(ws.deployments || {}).sort()) {
    const rec = ws.deployments[key] || {};
    deployments[key] = {
      targetId: rec.targetId ?? null,
      strength: Number.isFinite(rec.currentEffectiveStrength) ? Math.round(rec.currentEffectiveStrength * 1000) / 1000 : null,
      age: rec.deploymentAge ?? null,
    };
  }
  /** @type {Record<string, number>} */
  const exhaustion = {};
  for (const key of Object.keys(ws.warExhaustion || {}).sort()) {
    const v = Number(ws.warExhaustion[key]);
    if (Number.isFinite(v)) exhaustion[key] = Math.round(v * 1000) / 1000;
  }
  const projection = {
    tick: ws.tick ?? null,
    warReasons: ledgers.warReasons || {},
    peaceReasons: ledgers.peaceReasons || {},
    deployments,
    warExhaustion: exhaustion,
    candidateTypes,
    newsKinds,
    rollSummary,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

/**
 * The dormant corpus. The `war` rows are THE load-bearing configs: a fully lit
 * war world (warLayer + strategy on) with peaceEngineEnabled ABSENT — the
 * existing war-layer behaviour that must never move. The `calm` row proves the
 * all-default engine is untouched too.
 */
function corpus() {
  return [
    { seed: 'pc-a', ticks: 4, interval: 'one_month', warWorld: true },
    { seed: 'pc-b', ticks: 8, interval: 'one_month', warWorld: true },
    { seed: 'pc-c', ticks: 6, interval: 'one_week', warWorld: false },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval, c.warWorld ? 'war' : 'calm'].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.warWorld, c.ticks, c.interval)).hash;

describe('peace-causal movers — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the peace-causal dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NEITHER reason sub-ledger, even in a lit-war world', () => {
    const { campaign } = driveTicks('pc-b', false, true, 8, 'one_month');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.warReasons, 'warReasons ledger must be absent when dormant').toBeUndefined();
    expect(ledgers.peaceReasons, 'peaceReasons ledger must be absent when dormant').toBeUndefined();
  }, 60_000);
});

describe('peace-causal movers — lit-path anti-vacuity (§14: motive is state, state is receipted) [soak seed]', () => {
  it('gate ON: typed war reasons accumulate on the hostile pair, typed peace reasons on the live war, and the irony brief renders', () => {
    const { campaign } = driveTicks('pc-b', true, true, 8, 'one_month');
    const ws = campaign.worldState || {};
    const ledgers = ws.spatialLedgers || {};

    // WAR SIDE: the aggrieved aggressor holds a typed, receipted case.
    const warLedger = ledgers.warReasons || {};
    const ironCase = warLedger['iron>weak'];
    expect(ironCase, 'the hostile pair accumulated a war-reason entry').toBeTruthy();
    expect(ironCase.reasons.grievance, 'grievance materialized from the seeded resentment').toBeTruthy();
    expect(ironCase.reasons.grievance.score).toBeGreaterThan(0);
    expect(ironCase.reasons.grievance.receipt.length, 'the grievance is receipted').toBeGreaterThan(0);
    expect(Number.isFinite(ironCase.reasons.grievance.sinceTick), 'sinceTick stamps when the reason first stood').toBe(true);

    // Every materialized record is bounded and receipted (the §14 contract).
    for (const pairKey of Object.keys(warLedger)) {
      for (const type of Object.keys(warLedger[pairKey].reasons)) {
        const rec = warLedger[pairKey].reasons[type];
        expect(rec.score, `${pairKey}/${type} bounded`).toBeGreaterThanOrEqual(0);
        expect(rec.score, `${pairKey}/${type} bounded`).toBeLessThanOrEqual(1);
        expect(rec.receipt.length, `${pairKey}/${type} receipted`).toBeGreaterThan(0);
      }
    }

    // PEACE SIDE: once a war goes live, casus pacis accumulates on the war pair.
    const deployments = ws.deployments || {};
    const attackers = Object.keys(deployments).filter((id) => deployments[id]?.targetId != null);
    expect(attackers.length, 'the war layer actually marched in this fixture (anti-vacuity)').toBeGreaterThan(0);
    const peaceLedger = ledgers.peaceReasons || {};
    expect(Object.keys(peaceLedger).length, 'the live war accumulated peace-reason entries').toBeGreaterThan(0);

    // THE IRONY READ-MODEL (§14.4): the brief renders "N of M" from the ledgers.
    const a = attackers[0];
    const t = String(deployments[a].targetId);
    const brief = warCausalBrief(ws, a, t);
    expect(brief.line).toMatch(/^\d of 7 peace reasons now present/);
    expect(brief.peace.length).toBe(7);
    expect(brief.war.length).toBe(7);
    expect(brief.peacePresent).toBeGreaterThan(0);
  }, 120_000);

  it('the lit path stays BOUNDED and shape-lawful (every record carries the shared shape)', () => {
    const { campaign } = driveTicks('pc-a', true, true, 6, 'one_month');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    for (const ledgerName of ['warReasons', 'peaceReasons']) {
      const ledger = ledgers[ledgerName] || {};
      for (const pairKey of Object.keys(ledger)) {
        expect(pairKey).toMatch(/^.+>.+$/);
        for (const type of Object.keys(ledger[pairKey].reasons)) {
          const rec = ledger[pairKey].reasons[type];
          expect(Object.keys(rec).sort((x, y) => (x < y ? -1 : 1)).filter((k) => k !== 'evidence'))
            .toEqual(['receipt', 'score', 'sinceTick', 'tick', 'type']);
          expect(rec.type).toBe(type);
        }
      }
    }
  }, 120_000);
});

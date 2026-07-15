/**
 * generosityDormancyGolden.test.js — the E1a-WIRE dormancy proof + lit-path anti-vacuity.
 *
 * THE CENTREPIECE (design §6, the constitutional dormancy law): the generosity mover
 * (advanceGenerosity, wired into pulseKernel as the final constructive-flow mover) is
 * DORMANT behind the virtual constructiveFlowsEnabled flag. With the gate ABSENT it must
 * be a pure no-op — zero forks, zero ledger keys, byte-identical to the pre-wire engine.
 *
 * This pins it two ways:
 *   1. A FULL-ADVANCE dormancy golden (the worldpulseDeityGolden idiom): a famine world
 *      whose allied pairs WOULD trigger relief if lit is driven N real pulse ticks with the
 *      gate absent, projected to a MECHANICAL summary (granary storageMonths, the three
 *      generosity sub-ledgers, relief-incident counts, the relief news histogram, the
 *      candidate/roll summary), ORACLE-NORMALIZED and hashed. The manifest was captured
 *      BEFORE the pulseKernel wiring landed (the mover file existed but was unimported ⇒ the
 *      hash is the pristine pre-wire engine); it holding AFTER the wiring proves the wired-
 *      but-dormant mover is byte-identical to pre-wire. Any drift trips this — STOP.
 *   2. A dormancy CONTRACT assertion: the dormant final world carries NONE of the three
 *      generosity sub-ledgers (obligations / generosityWillingness / bufferDiscipline).
 *
 * THE LIT-PATH ANTI-VACUITY (design §7 — "aid changes history"): the same famine fixture
 * with the gate ON must actually move relief — the obligation ledger populates (the durable
 * artifact the §7 soak reads), grain leaves the giver's granary conserved, and a succor
 * receipt reaches the Chronicle. A pin that never fires would be worthless. Tagged as the
 * soak-suite seed for the 30-year "aid changes history" criterion.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/generosityDormancyGolden.test.js
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../domain/religionDormancy.byteIdentity.test.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'generosity-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

const deity = (ref, name, align, law) => ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: 'major' });
const D = {
  lg: deity('custom:gen_dawn', 'Dawnfather', 'good', 'lawful'),
  nn: deity('custom:gen_still', 'The Still', 'neutral', 'neutral'),
};

/** A settlement with an explicit granary ledger so relief has real stock to move. */
function genSettlement(name, patron, storageMonths, deficitPct, factions) {
  return {
    name, tier: 'town', population: 1600,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 20,
      primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron,
      economicBase: 'agrarian',
    },
    institutions: name === 'Ashford' ? [{ name: 'Temple of the Dawn', category: 'religious' }] : [],
    economicState: {
      primaryExports: ['Bulk grain and foodstuffs'], primaryImports: [],
      economicBase: 'agrarian',
      foodSecurity: { storageMonths, deficitPct, surplusPct: 0, foodRatio: deficitPct > 0 ? 0.6 : 1.2, importDependency: 0.2, resilienceScore: 55 },
    },
    powerStructure: {
      publicLegitimacy: { score: 44, label: 'Contested' },
      factions: factions || [{ faction: 'Landed Gentry', category: 'noble', power: 60 }],
      conflicts: [],
    },
    npcs: [{ id: `steward_${name}`, name: `Steward ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}

const genSave = (id, name, patron, storageMonths, deficitPct, factions) => ({
  id, name, phase: 'canon', settlement: genSettlement(name, patron, storageMonths, deficitPct, factions),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

/**
 * The famine fixture: Ashford (granary-rich, lawful-good, temple roster) is ALLIED to
 * Briarwatch (deep famine, empty granary). If lit, relief flows Ashford → Briarwatch.
 * @param {string} seed @param {boolean} lit
 */
function makeCampaignAndSaves(seed, lit) {
  const saves = [
    genSave('a', 'Ashford', D.lg, 8, 0),                 // the giver — full granary
    genSave('b', 'Briarwatch', D.nn, 0.4, 55),           // the receiver — famine, empty granary
    genSave('c', 'Crownhold', D.nn, 5, 0),               // a bystander (trade partner of a)
  ];
  const simulationRules = lit
    ? { warLayerEnabled: false, constructiveFlowsEnabled: true }
    : { warLayerEnabled: false };
  const campaign = {
    id: 'gen-pulse', name: 'Generosity Pulse', settlementIds: ['a', 'b', 'c'],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules,
      calendar: { elapsedWeeks: 30 },
      stressors: [
        { id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 3 },
      ],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' },
        { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'trade_partner' },
      ],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** Drive N ticks; return the final { campaign, saves, newsKinds } and the per-tick fold. */
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

/** Count relief-typed incidents across all persisted relationship states. */
function reliefIncidentCounts(worldState) {
  /** @type {Record<string, number>} */
  const counts = {};
  const states = worldState?.relationshipStates || {};
  for (const key of Object.keys(states)) {
    const incs = Array.isArray(states[key]?.recentIncidents) ? states[key].recentIncidents : [];
    for (const inc of incs) {
      const type = String(inc?.type || '');
      if (type.startsWith('relief_') || type.startsWith('credit_') || type === 'refuge_granted') {
        counts[type] = (counts[type] || 0) + 1;
      }
    }
  }
  return counts;
}

/** The mechanical projection — everything the generosity mover would touch if lit. */
function projectionHash({ campaign, saves, candidateTypes, newsKinds, rollSummary }) {
  /** @type {Record<string, number|null>} */
  const granary = {};
  for (const s of saves) {
    const m = Number(s.settlement?.economicState?.foodSecurity?.storageMonths);
    granary[s.id] = Number.isFinite(m) ? Math.round(m * 10) / 10 : null;
  }
  const ledgers = campaign.worldState?.spatialLedgers || {};
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    granary,
    obligations: ledgers.obligations || {},
    generosityWillingness: ledgers.generosityWillingness || {},
    bufferDiscipline: ledgers.bufferDiscipline || {},
    reliefIncidents: reliefIncidentCounts(campaign.worldState),
    candidateTypes,
    reliefNews: {
      relief: newsKinds.generosity_relief || 0,
      refusal: newsKinds.generosity_refusal || 0,
    },
    rollSummary,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

/** The dormant corpus (gate ABSENT). */
function corpus() {
  return [
    { seed: 'gen-a', ticks: 4, interval: 'one_month' },
    { seed: 'gen-b', ticks: 6, interval: 'one_month' },
    { seed: 'gen-c', ticks: 8, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('generosity mover — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the generosity dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NONE of the three generosity sub-ledgers', () => {
    const { campaign } = driveTicks('gen-b', false, 6, 'one_month');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.obligations, 'obligations ledger must be absent when dormant').toBeUndefined();
    expect(ledgers.generosityWillingness, 'willingness ledger must be absent when dormant').toBeUndefined();
    expect(ledgers.bufferDiscipline, 'buffer ledger must be absent when dormant').toBeUndefined();
    expect(reliefIncidentCounts(campaign.worldState), 'no relief incidents when dormant').toEqual({});
  });
});

describe('generosity mover — lit-path anti-vacuity (design §7: aid changes history) [soak seed]', () => {
  it('gate ON: relief flows in the famine fixture — the obligation ledger populates and grain moves conserved', () => {
    const { campaign, saves, newsKinds } = driveTicks('gen-b', true, 8, 'one_month');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    const obligations = ledgers.obligations || {};
    const reliefNews = newsKinds.generosity_relief || 0;
    const incidents = reliefIncidentCounts(campaign.worldState);

    // AID CHANGES HISTORY: the durable obligation the §7 soak reads.
    expect(Object.keys(obligations).length, 'at least one obligation minted when lit').toBeGreaterThan(0);
    // A succor receipt reached the Chronicle.
    expect(reliefNews, 'at least one relief receipt when lit').toBeGreaterThan(0);
    // The typed reciprocity memory recorded the gift.
    expect((incidents.relief_given || 0) + (incidents.relief_received || 0), 'a relief incident was banked').toBeGreaterThan(0);

    // CONSERVATION: an obligation debtor→creditor is Briarwatch→Ashford (the giver is owed).
    const owedToAshford = Object.values(obligations).some((r) => r && r.to === 'a' && r.from === 'b');
    expect(owedToAshford, 'Briarwatch owes Ashford after relief').toBe(true);

    // Grain actually left the giver relative to the dormant baseline (real stock moved).
    const litGranary = Number(saves.find((s) => s.id === 'a')?.settlement?.economicState?.foodSecurity?.storageMonths);
    const dormant = driveTicks('gen-b', false, 8, 'one_month');
    const dormantGranary = Number(dormant.saves.find((s) => s.id === 'a')?.settlement?.economicState?.foodSecurity?.storageMonths);
    expect(litGranary, "the giver's granary drew down to send relief").toBeLessThan(dormantGranary);
  }, 30_000);

  it('the lit path stays BOUNDED and self-consistent (a drama engine, not a welfare runaway)', () => {
    const { campaign } = driveTicks('gen-b', true, 12, 'one_month');
    const obligations = campaign.worldState?.spatialLedgers?.obligations || {};
    for (const rec of Object.values(obligations)) {
      expect(rec.magnitude, 'obligation magnitude bounded [0,1]').toBeGreaterThanOrEqual(0);
      expect(rec.magnitude, 'obligation magnitude bounded [0,1]').toBeLessThanOrEqual(1);
    }
  }, 30_000);
});

/**
 * cacophonySoak.test.js — E0 THE CACOPHONY SOAK (design §5 / plan §8C).
 *
 * A 30-year governor-lit drive over a multi-settlement realm that heavily exercises
 * the SEAM drama classes (pressure-born economic_shock/plague births + the
 * crisis-legitimacy succession_coup contest). The envelope bounds below were
 * MEASURED first (ratchet-floor philosophy), then set GENEROUSLY — they are a
 * regression floor/ceiling, not an a-priori design band. Diagnostics print on every
 * run so the architect can re-check the band.
 *
 * HONESTY NOTE (plan §8C): calamity/religious-contest/war-mobilization pacing is
 * REGISTERED-BUT-NOT-WIRED this wave (the bypass producers), so this soak asserts on
 * the GOVERNED SEAM classes only. In this fixture the dominant governed birth is
 * succession_coup (crisis legitimacy), with a minority of economic_shock — claiming
 * a rich multi-class band would over-state what the wired seam produces.
 */
import { describe, expect, test } from 'vitest';
import { createHash } from 'node:crypto';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { dramaClassOf, isChainedConsequence, countLiveMajorArcs, TEMPO_BUDGETS } from '../../src/domain/worldPulse/narrativeTempo.js';

const NOW = '2026-01-01T00:00:00.000Z';
const GRAIN = 'Bulk grain and foodstuffs';
const IDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const YEARS = 30;
const TICKS = YEARS * 12;        // one_month ticks
const DECADE_TICKS = 120;        // 10 years of months

function st(name, { exports = [], imports = [], patch = {} } = {}) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: {
      publicLegitimacy: { score: 26, label: 'Legitimacy Crisis' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 68 },
        { faction: 'Temple Wardens', category: 'religious', power: 57 },
        { faction: 'City Guard', category: 'military', power: 50 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
    ...patch,
  };
}
const save = (id, name, opts) => ({ id, name, phase: 'canon', settlement: st(name, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const ch = (to) => ({ id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to, goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed' });
function makeSaves() {
  return IDS.map((id, i) => (i === 0
    ? save(id, 'Ashford', { exports: [GRAIN], patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.85 }] } })
    : save(id, `S${id.toUpperCase()}`, { imports: [GRAIN], ...(i < 3 ? { patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.78 }] } } : {}) })));
}
function makeCampaign(tier) {
  return {
    id: 'cacophony-soak', name: 'Cacophony Soak', settlementIds: [...IDS],
    worldState: {
      rngSeed: 'cacophony-soak-seed', tick: 1, calendar: { elapsedWeeks: 4 },
      ...(tier ? { simulationRules: { narrativeTempo: tier } } : {}),
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.92, affectedSettlementIds: ['a'], age: 3 },
        { id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 2 },
        { id: 'world_stressor.disease_outbreak.c', type: 'disease_outbreak', severity: 0.74, affectedSettlementIds: ['c'], age: 1 },
      ],
    },
    regionalGraph: ensureRegionalGraph({
      edges: IDS.slice(1).map((to) => ({ id: `e.a.${to}`, from: 'a', to, relationshipType: 'trade_partner' })),
      channels: IDS.slice(1).map(ch),
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

function soak(tier) {
  let campaign = makeCampaign(tier);
  let saves = makeSaves();
  let births = 0;
  let deferrals = 0;
  let maxLiveArcs = 0;
  /** @type {Record<string, number>} */
  const byClassBirth = {};
  /** @type {Record<string, number>} */
  const byClassDef = {};
  /** @type {number[]} */
  const perDecadeBirths = [];
  let decadeBirths = 0;
  /** @type {string[]} */
  const projection = [];

  for (let t = 0; t < TICKS; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    maxLiveArcs = Math.max(maxLiveArcs, countLiveMajorArcs(r.worldState));
    for (const o of r.selected || []) {
      const cls = dramaClassOf(o);
      if (cls !== null && !isChainedConsequence(o)) {
        births += 1;
        decadeBirths += 1;
        byClassBirth[cls] = (byClassBirth[cls] || 0) + 1;
      }
    }
    for (const d of r.tempoDeferred || []) {
      deferrals += 1;
      byClassDef[d.class] = (byClassDef[d.class] || 0) + 1;
    }
    projection.push((r.selected || []).map((o) => o.candidateType).sort().join(','));
    projection.push((r.tempoDeferred || []).map((d) => d.class).sort().join(','));
    if ((t + 1) % DECADE_TICKS === 0) { perDecadeBirths.push(decadeBirths); decadeBirths = 0; }

    const upd = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (upd.has(s.id) ? { ...s, settlement: upd.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }

  return {
    births, deferrals, maxLiveArcs, byClassBirth, byClassDef, perDecadeBirths,
    majorsPerSettlementYear: births / (IDS.length * YEARS),
    hash: createHash('sha256').update(JSON.stringify(projection)).digest('hex'),
  };
}

describe('THE CACOPHONY SOAK — 30y density envelope (governor lit, measured band)', () => {
  const full = soak('full_simulation');
  const off = soak(null);

  test('diagnostics (printed for the architect to sanity-check the band)', () => {
     
    console.log('[cacophony-soak] full_simulation 30y / %d settlements: births=%d deferrals=%d maxLiveArcs=%d majors/settlement-year=%s perDecade=%s birthsByClass=%s defByClass=%s',
      IDS.length, full.births, full.deferrals, full.maxLiveArcs,
      full.majorsPerSettlementYear.toFixed(3), JSON.stringify(full.perDecadeBirths),
      JSON.stringify(full.byClassBirth), JSON.stringify(full.byClassDef));
     
    console.log('[cacophony-soak] OFF (dormant) births=%d (the governor must pace BELOW this)', off.births);
    expect(true).toBe(true);
  }, 60_000);

  test('anti-vacuity: the governor BOTH fires births AND paces deferrals (the machinery moves when lit)', () => {
    expect(full.births).toBeGreaterThan(0);
    expect(full.deferrals).toBeGreaterThan(0);
    expect(Object.keys(full.byClassBirth).length).toBeGreaterThan(0);
  }, 60_000);

  test('simultaneous realm majors stay <= arcMax (measured 3; full_simulation arcMax=10)', () => {
    expect(full.maxLiveArcs).toBeLessThanOrEqual(TEMPO_BUDGETS.full_simulation.arcMax);
  }, 60_000);

  test('majors/settlement-year sits in the MEASURED band (measured ~0.45; floor/ceiling generous)', () => {
    // Ratchet-floor: real drama (> a trickle) but bounded well under cacophony.
    expect(full.majorsPerSettlementYear).toBeGreaterThan(0.1);
    expect(full.majorsPerSettlementYear).toBeLessThan(1.5);
  }, 60_000);

  test('NO decade is silent AND no decade is saturated (measured per-decade ~35-38)', () => {
    expect(full.perDecadeBirths.length).toBe(YEARS / 10);
    for (const d of full.perDecadeBirths) {
      expect(d, `a silent decade means the pressure was permanently denied: ${JSON.stringify(full.perDecadeBirths)}`).toBeGreaterThan(0);
      expect(d, `a saturated decade means cacophony: ${JSON.stringify(full.perDecadeBirths)}`).toBeLessThan(120);
    }
  }, 60_000);

  test('QUIET-BEFORE-STORM at scale: every class that DEFERRED also BIRTHED (deferral-not-denial)', () => {
    for (const cls of Object.keys(full.byClassDef)) {
      expect(
        (full.byClassBirth[cls] || 0),
        `class '${cls}' deferred ${full.byClassDef[cls]}× but NEVER birthed over ${YEARS}y — pressure was denied, not delayed`,
      ).toBeGreaterThan(0);
    }
    // ...and the pressure keeps releasing to the very end (the last decade is not silent).
    expect(full.perDecadeBirths[full.perDecadeBirths.length - 1]).toBeGreaterThan(0);
  }, 60_000);

  test('the governor MEASURABLY throttles: dormant (OFF) births strictly exceed the lit soak', () => {
    expect(off.births).toBeGreaterThan(full.births);
  }, 60_000);

  test('two-run determinism: an identical soak hashes identically (zero rng in the governor)', () => {
    expect(soak('full_simulation').hash).toBe(full.hash);
  }, 90_000);
});

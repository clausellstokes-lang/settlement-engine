/**
 * WR-2 integration pins: outcome attribution, action bars, WR-1 subordination,
 * and treaty verdict learning. These tests stay at the pure module seams so they
 * prove mechanics without depending on a soak or the later receipt projection.
 */

import { describe, expect, it } from 'vitest';

import {
  collectDispositionChannelDeltas,
  collectDispositionDeltas,
} from '../../src/domain/worldPulse/dispositionDeltas.js';
import {
  advanceDispositionChannels,
  applyDispositionDeltas,
  migrateDispositionStats,
} from '../../src/domain/worldPulse/dispositionLedger.js';
import { enumerateMoves } from '../../src/domain/worldPulse/settlementStrategy.js';
import { objectiveForArchetype } from '../../src/domain/worldPulse/scoringObjective.js';
import { readWarTerminations } from '../../src/domain/worldPulse/warTermination.js';
import { advanceTreaties, treatyPairKey } from '../../src/domain/worldPulse/peaceTerms.js';
import { repudiateTreaty } from '../../src/domain/worldPulse/treatyBreach.js';
import { dispositionTransitionNewsEntries } from '../../src/domain/worldPulse/dispositionNews.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';

const NEUTRAL_BARS = Object.freeze({
  martial: 1,
  mercantile: 1,
  diplomatic: 1,
  insular: 1,
  deityWar: 1,
  martialInAggressiveness: true,
});

const moveMap = (rows) => Object.fromEntries(rows.map((row) => [row.move, row]));

describe('WR-2 resolved outcomes — typed channels over the legacy collector', () => {
  it('maps war/occupation to martial and trade contests to mercantile without changing the dark collector', () => {
    const war = { dispositionDeltas: [
      { id: 'captor', outcome: 'win', magnitude: 2 },
      { id: 'fallen', outcome: 'loss' },
    ] };
    const trade = { dispositionDeltas: [
      { id: 'factor', outcome: 'win', channel: 'diplomatic' },
      { id: 'loser', outcome: 'loss' },
    ] };
    const occupation = { dispositionDeltas: [
      { id: 'occupier', outcome: 'loss', magnitude: 0.5 },
      { id: 'town', outcome: 'win' },
    ] };

    // The old two-source result remains byte-shaped exactly as before WR-2.
    expect(collectDispositionDeltas(war, trade)).toEqual([
      { id: 'captor', outcome: 'win', magnitude: 2 },
      { id: 'fallen', outcome: 'loss' },
      { id: 'factor', outcome: 'win', channel: 'diplomatic' },
      { id: 'loser', outcome: 'loss' },
    ]);
    expect(collectDispositionChannelDeltas(war, trade, occupation)).toEqual([
      { id: 'captor', outcome: 'win', magnitude: 2, channel: 'martial', sourceKind: 'war_resolution' },
      { id: 'fallen', outcome: 'loss', channel: 'martial', sourceKind: 'war_resolution' },
      { id: 'factor', outcome: 'win', channel: 'mercantile', sourceKind: 'trade_contest' },
      { id: 'loser', outcome: 'loss', channel: 'mercantile', sourceKind: 'trade_contest' },
      { id: 'occupier', outcome: 'loss', magnitude: 0.5, channel: 'martial', sourceKind: 'occupation_outcome' },
      { id: 'town', outcome: 'win', channel: 'martial', sourceKind: 'occupation_outcome' },
    ]);
  });

  it('delegates the disabled rich writer to the legacy writer exactly', () => {
    const ledger = { a: { wins: 2, losses: 1, score: 1 } };
    const deltas = [{ id: 'a', channel: 'mercantile', outcome: 'win', magnitude: 2 }];
    const legacy = applyDispositionDeltas(ledger, deltas);
    const dark = advanceDispositionChannels(ledger, deltas, { enabled: false, tick: 80 });
    expect(dark).toEqual({ ledger: legacy, transitions: [] });
    expect(dark.ledger.a.channels).toBeUndefined();
  });
});

describe('WR-2 strategy integration — dispositions move bars, never targets', () => {
  const ctx = (hostileTargets) => ({
    hostileTargets,
    vassalIds: [],
    homeBesieged: false,
    vassalBesieged: false,
    besieging: [],
  });
  const strength = (id) => ({ seat: 0.8, enemy: 0.4, ally: 0.1 }[String(id)] ?? 0.5);
  const baseArgs = {
    sId: 'seat',
    ctx: ctx(['enemy']),
    aggressiveness: 1,
    strengthFor: strength,
    exhaustion: 0.2,
  };

  it('has positive controls for martial, diplomatic, mercantile, and insular action bars', () => {
    const neutral = moveMap(enumerateMoves({ ...baseArgs, dispositionThresholds: NEUTRAL_BARS }));
    const legacy = moveMap(enumerateMoves(baseArgs));
    expect(neutral).toEqual(legacy); // unit bars are exact legacy behavior

    const martialSidecarOnly = moveMap(enumerateMoves({
      ...baseArgs,
      dispositionThresholds: { ...NEUTRAL_BARS, martial: 0.8 },
    }));
    expect(martialSidecarOnly.deploy.score).toBe(neutral.deploy.score);
    const martial = moveMap(enumerateMoves({
      ...baseArgs,
      // computeAggressiveness is the ONE martial-history consumption. Supplying
      // its resulting drive changes the scorer; the D.martial sidecar must not.
      aggressiveness: 1.1,
      dispositionThresholds: { ...NEUTRAL_BARS, martial: 0.8 },
    }));
    expect(martial.deploy.score).toBeGreaterThan(neutral.deploy.score);

    const diplomatic = moveMap(enumerateMoves({
      ...baseArgs,
      dispositionThresholds: { ...NEUTRAL_BARS, diplomatic: 0.8 },
    }));
    expect(diplomatic.sue_for_peace.score).toBeGreaterThan(neutral.sue_for_peace.score);

    const insular = moveMap(enumerateMoves({
      ...baseArgs,
      dispositionThresholds: { ...NEUTRAL_BARS, insular: 0.8 },
    }));
    expect(insular.hold.score).toBeGreaterThan(neutral.hold.score);
    expect(insular.deploy.score).toBeLessThan(neutral.deploy.score);
    expect(insular.sue_for_peace.score).toBeGreaterThan(neutral.sue_for_peace.score);

    const merchantArgs = { ...baseArgs, objective: objectiveForArchetype('merchant') };
    const merchantNeutral = moveMap(enumerateMoves({
      ...merchantArgs,
      dispositionThresholds: NEUTRAL_BARS,
    }));
    const mercantile = moveMap(enumerateMoves({
      ...merchantArgs,
      dispositionThresholds: { ...NEUTRAL_BARS, mercantile: 0.8 },
    }));
    for (const move of ['reroute', 'embargo', 'credit']) {
      expect(mercantile[move].score, move).toBeGreaterThan(merchantNeutral[move].score);
    }
  });

  it('keeps a strong ally outside the target set; only an independently-open hostility arm is priceable', () => {
    const highPressure = { ...NEUTRAL_BARS, martial: 0.8 };

    // Ordinary ally arm: a tempting weak ally is not hostile, so even the lowest
    // martial bar cannot manufacture it as a target. The real enemy remains chosen.
    const protectedAlly = moveMap(enumerateMoves({
      ...baseArgs,
      ctx: ctx(['enemy']),
      dispositionThresholds: highPressure,
    }));
    expect(protectedAlly.deploy.bestTargetId).toBe('enemy');
    const noFoe = moveMap(enumerateMoves({
      ...baseArgs,
      ctx: ctx([]),
      dispositionThresholds: highPressure,
    }));
    expect(noFoe.deploy).toBeUndefined();

    // Pressured/betrayal arm: once another subsystem has independently admitted
    // the former ally to hostileTargets, disposition may price the march but still
    // cannot rename its target. Increasing pressure moves only the score.
    const betrayedNeutral = moveMap(enumerateMoves({
      ...baseArgs,
      ctx: ctx(['ally']),
      dispositionThresholds: NEUTRAL_BARS,
    }));
    const betrayedModerate = moveMap(enumerateMoves({
      ...baseArgs,
      ctx: ctx(['ally']),
      aggressiveness: 1.05,
      dispositionThresholds: { ...NEUTRAL_BARS, martial: 0.9 },
    }));
    const betrayedStrong = moveMap(enumerateMoves({
      ...baseArgs,
      ctx: ctx(['ally']),
      aggressiveness: 1.1,
      dispositionThresholds: highPressure,
    }));
    expect(betrayedStrong.deploy.bestTargetId).toBe('ally');
    expect(betrayedModerate.deploy.score).toBeGreaterThan(betrayedNeutral.deploy.score);
    expect(betrayedStrong.deploy.score).toBeGreaterThan(betrayedModerate.deploy.score);
  });

  it('lets WR-1 own every disposition read on the live sue-for-peace path', () => {
    const termination = { suePressure01: 0.7 };
    const neutral = moveMap(enumerateMoves({
      ...baseArgs,
      termination,
      peaceAggressiveness: 1,
      dispositionThresholds: NEUTRAL_BARS,
    }));
    const loaded = moveMap(enumerateMoves({
      ...baseArgs,
      termination,
      peaceAggressiveness: 1,
      dispositionThresholds: {
        ...NEUTRAL_BARS,
        martial: 0.8,
        mercantile: 0.8,
        diplomatic: 0.8,
        insular: 0.8,
        deityWar: 0.88,
      },
    }));
    expect(loaded.sue_for_peace.score).toBe(neutral.sue_for_peace.score);
  });
});

function warTown(id, name = id) {
  return {
    id,
    name,
    settlement: {
      name,
      tier: 'town',
      population: 2000,
      config: {},
      institutions: [],
      economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: `${name} seat`, category: 'civic', power: 60, isGoverning: true }],
        conflicts: [],
      },
      npcs: [],
      activeConditions: [],
    },
  };
}

const warSnapshot = (items) => ({
  settlements: items,
  byId: new Map(items.map((item) => [String(item.id), item])),
  regionalGraph: { edges: [], channels: [] },
});

describe('WR-2 termination integration — a bar load, never a fifth WR-1 term', () => {
  it('shifts sue pressure while the four terms, bands, deciding term, and receipt stay unchanged', () => {
    const deployment = {
      targetId: 'b',
      maxStartStrength: 1,
      currentEffectiveStrength: 0.7,
      casusReasons: [{
        type: 'grievance', score: 0.8, receipt: 'An old wrong stands.', atTick: 1,
      }],
    };
    const reasonPair = {
      updatedTick: 9,
      reasons: {
        grievance: {
          type: 'grievance', score: 0.8, sinceTick: 1, tick: 9,
          receipt: 'An old wrong stands.',
        },
      },
    };
    const base = {
      tick: 9,
      simulationRules: { warLayerEnabled: true, warTerminationEnabled: true },
      deployments: { a: deployment },
      warExhaustion: { a: 0.4 },
      spatialLedgers: { warReasons: { 'a>b': reasonPair } },
    };
    const entry = migrateDispositionStats({ a: { wins: 0, losses: 0, score: 0 } }, 9).a;
    entry.channels.diplomatic = { stock01: 1, band: 'dominant' };
    const lit = {
      ...base,
      simulationRules: { ...base.simulationRules, dispositionChannelsEnabled: true },
      dispositionStats: { a: entry },
    };
    const snapshot = warSnapshot([warTown('a', 'Aster'), warTown('b', 'Briar')]);
    const darkRead = readWarTerminations({ worldState: base, snapshot, sunkCostPressureFor: () => 0 })
      .byAttacker.get('a');
    const litRead = readWarTerminations({ worldState: lit, snapshot, sunkCostPressureFor: () => 0 })
      .byAttacker.get('a');

    expect(Object.keys(darkRead.bands)).toEqual(['cause', 'cost_to_continue', 'cost_to_stop', 'momentum']);
    expect(litRead.bands).toEqual(darkRead.bands);
    expect(litRead.decidingTerm).toBe(darkRead.decidingTerm);
    const { dispositionReasons, ...litCanonicalReceipt } = litRead.receipt;
    expect(litCanonicalReceipt).toEqual(darkRead.receipt);
    expect(dispositionReasons).toEqual([
      'Kept agreements have taught this court confidence in parley.',
    ]);
    expect(litRead.suePressure01).not.toBe(darkRead.suePressure01);
  });
});

function treatyItem(id, population) {
  return {
    id,
    name: id,
    settlement: {
      name: id,
      tier: 'town',
      population,
      config: { tradeRouteAccess: 'road', priorityMilitary: 30 },
      institutions: [],
      economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: `${id} council`, category: 'civic', power: 60, isGoverning: true }],
        conflicts: [],
      },
      npcs: [],
      activeConditions: [],
    },
  };
}

const TREATY_ITEMS = [treatyItem('iron', 5000), treatyItem('weak', 1200)];
const TREATY_EDGE = { id: 'edge.iron.weak', from: 'iron', to: 'weak', relationshipType: 'cold_war' };
const TREATY_SNAPSHOT = {
  byId: new Map(TREATY_ITEMS.map((item) => [item.id, item])),
  regionalGraph: { edges: [TREATY_EDGE] },
};
const TREATY_RULES = Object.freeze({
  warLayerEnabled: true,
  peaceEngineEnabled: true,
  dispositionChannelsEnabled: true,
});

function treatyTerm(expiresTick) {
  return {
    type: 'non_aggression',
    family: 'security',
    magnitude: 0.4,
    mintedTick: 0,
    expiresTick,
    weightSpent: 1,
    complianceState: 'honored',
    trueState: 'honored',
    burden01: 0,
    receipt: 'The courts promised not to march.',
  };
}

function treatyWorld({ expiresTick = 100, rules = TREATY_RULES } = {}) {
  const treaty = {
    parties: ['iron', 'weak'],
    victorId: 'iron',
    loserId: 'weak',
    mintedTick: 0,
    believedMarginAtSignature: 0.4,
    budgetGranted: 1,
    budgetSpent: 1,
    complianceState: 'honored',
    terms: [treatyTerm(expiresTick)],
    receipts: ['The Market Peace.'],
  };
  return {
    tick: 9,
    simulationRules: { ...rules },
    calendar: { elapsedWeeks: 9 },
    deployments: {},
    relationshipStates: {
      'edge.iron.weak': { relationshipType: 'cold_war', trust: 0.4, resentment: 0.1 },
    },
    dispositionStats: {},
    spatialLedgers: { treaties: { [treatyPairKey('iron', 'weak')]: treaty } },
  };
}

function advanceTreaty(worldState, tick, pIndex = null) {
  return advanceTreaties({
    snapshot: TREATY_SNAPSHOT,
    worldState,
    graph: { edges: [TREATY_EDGE] },
    pIndex,
    tick,
    now: '2026-01-01T00:00:00.000Z',
  });
}

describe('WR-2 treaty integration — each resolved verdict teaches diplomacy once', () => {
  it('an honored treaty reaching its horizon teaches both parties once', () => {
    const first = advanceTreaty(treatyWorld({ expiresTick: 10 }), 10);
    expect(first.dispositionDeltas).toEqual([
      { id: 'iron', channel: 'diplomatic', outcome: 'win', sourceKind: 'treaty_held' },
      { id: 'weak', channel: 'diplomatic', outcome: 'win', sourceKind: 'treaty_held' },
    ]);
    const learned = advanceDispositionChannels({}, first.dispositionDeltas, { enabled: true, tick: 10 }).ledger;
    expect(learned.iron.channels.diplomatic.stock01).toBeGreaterThan(0.5);
    expect(learned.weak.channels.diplomatic.stock01).toBeGreaterThan(0.5);

    const repeated = advanceTreaty(first.worldState, 11);
    expect(repeated.dispositionDeltas).toEqual([]);
  });

  it('an observed default teaches only the oathbreaker, on the transition only', () => {
    const pIndex = {
      get(id, kind) {
        return String(id) === 'weak' && (kind === 'economy' || kind === 'food')
          ? { score: 1 }
          : null;
      },
      strongest(id, kinds = []) {
        return kinds.map((kind) => this.get(id, kind)).find(Boolean) || null;
      },
    };
    const first = advanceTreaty(treatyWorld(), 10, pIndex);
    expect(first.dispositionDeltas).toHaveLength(1);
    expect(first.dispositionDeltas[0]).toMatchObject({
      id: 'weak', channel: 'diplomatic', outcome: 'loss', sourceKind: 'treaty_default',
    });
    const learned = advanceDispositionChannels({}, first.dispositionDeltas, { enabled: true, tick: 10 }).ledger;
    expect(learned.weak.channels.diplomatic.stock01).toBeLessThan(0.5);
    expect(learned.iron).toBeUndefined();

    const repeated = advanceTreaty(first.worldState, 11, pIndex);
    expect(repeated.dispositionDeltas).toEqual([]);
  });

  it('a public repudiation writes one diplomatic loss and cannot repeat it', () => {
    const source = treatyWorld();
    const first = repudiateTreaty(source, { fromId: 'iron', toId: 'weak', tick: 10 });
    expect(first.ok).toBe(true);
    const after = first.worldState.dispositionStats.iron.channels.diplomatic.stock01;
    expect(after).toBeLessThan(0.5);

    const repeated = repudiateTreaty(first.worldState, { fromId: 'iron', toId: 'weak', tick: 10 });
    expect(repeated.ok).toBe(false);
    expect(repeated.worldState).toBe(first.worldState);
    expect(repeated.worldState.dispositionStats.iron.channels.diplomatic.stock01).toBe(after);

    const laterMover = advanceTreaty(first.worldState, 11);
    expect(laterMover.dispositionDeltas).toEqual([]);
    expect(getSpatialLedger(laterMover.worldState, 'treaties')).toBeTruthy();
  });

  // SOL-BANK-3. `repudiateTreaty` used to declare its transition rows as the
  // widened `Array<Record<string, unknown>>`, which the news composer's exact
  // parameter rejected — the gate's own typecheck named it. The declaration is
  // now DERIVED from the sole producer, but a JSDoc type is only a claim while
  // the tsc gate is dark behind ~351 inherited errors, so the RUNTIME truth of
  // the five members the composer reads by name gets its own executed pin here.
  //
  // ANTI-VACUITY: an empty ledger moves the stock without crossing a band and
  // yields ZERO rows, so a naive fixture would pin an empty array and prove
  // nothing. The seed below sits just inside `settled` precisely so the loss
  // crosses into `measured`, and the row count is asserted before the members.
  it('a repudiation transition row carries every member the news composer reads by name', () => {
    const seeded = {
      ...treatyWorld(),
      dispositionStats: {
        iron: { channels: { diplomatic: { stock01: 0.405, band: 'settled', updatedTick: 10 } } },
      },
    };
    const result = repudiateTreaty(seeded, { fromId: 'iron', toId: 'weak', tick: 10 });
    expect(result.ok).toBe(true);

    const rows = result.dispositionTransitions;
    expect(Array.isArray(rows)).toBe(true);
    expect(rows).toHaveLength(1);

    const NAMED_BY_THE_COMPOSER = ['channel', 'id', 'kind', 'tick', 'toBand'];
    const missing = NAMED_BY_THE_COMPOSER.filter((member) => rows[0][member] === undefined);
    expect(missing).toEqual([]);
    expect(rows[0]).toMatchObject({
      kind: 'band_crossing', id: 'iron', channel: 'diplomatic',
      fromBand: 'settled', toBand: 'measured', tick: 10,
    });

    // The consumer must actually accept the produced rows, not merely typecheck
    // against them: one crossing composes exactly one addressed entry.
    const news = dispositionTransitionNewsEntries({
      transitions: rows,
      snapshot: { byId: new Map([['iron', { name: 'Ironhold', settlement: { name: 'Ironhold' } }]]) },
      worldState: result.worldState,
      now: '2026-01-01T00:00:00.000Z',
    });
    expect(news).toHaveLength(1);
    expect(news[0].kind).toBe('disposition_diplomatic_crossed');
    expect(news[0].settlementIds).toEqual(['iron']);
  });
});

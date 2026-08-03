/**
 * WR-1 — the pure war-termination read.
 *
 * Pins the two-flag dormancy wall, opening anchors, dissolution totality and
 * named special cases, one-read-per-deployment census, four-term disagreement,
 * qualitative persistence envelope, and the no-age/no-mutation laws.
 */

import { describe, expect, it } from 'vitest';
import {
  WAR_CAUSE_DISSOLUTION,
  WAR_TERMINATION_BANDS,
  pinDeploymentCasusReasons,
  readWarTerminations,
  warTerminationBand,
} from '../../src/domain/worldPulse/warTermination.js';
import { WAR_REASON_TYPES } from '../../src/domain/worldPulse/warReasonTaxonomy.js';
import { REASON_TUNING } from '../../src/domain/worldPulse/warReasons.js';
import { MOMENTUM_TUNING } from '../../src/domain/worldPulse/momentum.js';

const LIT_RULES = Object.freeze({
  warLayerEnabled: true,
  warTerminationEnabled: true,
});

function town(id, {
  name = id,
  tier = 'town',
  population = 2000,
  patronRef = '',
} = {}) {
  return {
    id,
    name,
    settlement: {
      name,
      tier,
      population,
      config: patronRef
        ? { primaryDeitySnapshot: { _deityRef: patronRef, name: patronRef } }
        : {},
    },
  };
}

function snapshot(items = [], edges = [], channels = []) {
  return {
    settlements: items,
    byId: new Map(items.map((item) => [String(item.id), item])),
    regionalGraph: { edges, channels },
  };
}

function reason(type, score = 0.8, tick = 3) {
  return { type, score, sinceTick: 1, tick, receipt: `Authored ${type} receipt.` };
}

function reasonEntry(types, tick = 3) {
  return {
    reasons: Object.fromEntries(types.map(([type, score]) => [type, reason(type, score, tick)])),
    updatedTick: tick,
  };
}

function world({
  deployments = {},
  reasonPairs = {},
  warExhaustion = {},
  rules = LIT_RULES,
  relationshipStates = {},
  extraLedgers = {},
  extra = {},
} = {}) {
  return {
    tick: 9,
    simulationRules: { ...rules },
    deployments,
    warExhaustion,
    relationshipStates,
    spatialLedgers: { warReasons: reasonPairs, ...extraLedgers },
    ...extra,
  };
}

function pressureIndex(rows = {}) {
  return {
    get(id, kind) {
      const value = rows[`${id}:${kind}`];
      return Number.isFinite(value) ? { score: value } : null;
    },
    strongest(id, kinds = []) {
      const candidates = kinds
        .map((kind) => this.get(id, kind))
        .filter(Boolean)
        .sort((a, b) => b.score - a.score);
      return candidates[0] || null;
    },
  };
}

function deployment(targetId, types, overrides = {}) {
  return {
    targetId,
    maxStartStrength: 1,
    currentEffectiveStrength: 1,
    casusReasons: types.map((type) => ({
      type,
      score: 0.8,
      receipt: `Opening ${type} receipt.`,
      atTick: 1,
    })),
    ...overrides,
  };
}

describe('WR-1 opening pins and total dissolution table', () => {
  it('keeps the exact legacy three-field casus shape while either flag is dark', () => {
    const reasons = [{ type: 'sacred_claim', score: 0.75, receipt: 'The altars divide them.' }];
    const dark = pinDeploymentCasusReasons({
      reasons,
      tick: 12,
      attackerItem: town('a', { patronRef: 'old-god' }),
      defenderItem: town('b', { patronRef: 'other-god' }),
      simulationRules: { warLayerEnabled: true },
    });
    expect(dark).toEqual({
      casusReasons: [{ type: 'sacred_claim', score: 0.75, receipt: 'The altars divide them.' }],
      sacredAnchors: {},
    });
    expect(reasons).toEqual([{ type: 'sacred_claim', score: 0.75, receipt: 'The altars divide them.' }]);
  });

  it('pins atTick and only the two immutable sacred anchors when both flags are lit', () => {
    const pinned = pinDeploymentCasusReasons({
      reasons: [
        { type: 'grievance', score: 0.4, receipt: 'An old wrong stands.' },
        { type: 'sacred_claim', score: 0.7, receipt: 'The rites stand opposed.' },
      ],
      tick: 12.9,
      attackerItem: town('a', { patronRef: 'old-god' }),
      defenderItem: town('b', { patronRef: 'other-god' }),
      simulationRules: LIT_RULES,
    });
    expect(pinned.casusReasons).toEqual([
      { type: 'grievance', score: 0.4, receipt: 'An old wrong stands.', atTick: 12 },
      { type: 'sacred_claim', score: 0.7, receipt: 'The rites stand opposed.', atTick: 12 },
    ]);
    expect(pinned.sacredAnchors).toEqual({
      attackerPatronRef: 'old-god',
      defenderPatronRef: 'other-god',
    });
  });

  it('covers the taxonomy exactly and projects only the closed four bands', () => {
    expect(Object.keys(WAR_CAUSE_DISSOLUTION).sort()).toEqual([...WAR_REASON_TYPES].sort());
    expect(Object.keys(WAR_CAUSE_DISSOLUTION)).toHaveLength(14);
    expect(WAR_TERMINATION_BANDS).toEqual(['quiet', 'present', 'pressing', 'decisive']);
    expect([0, 0.2, 0.45, 0.7].map(warTerminationBand))
      .toEqual(['quiet', 'present', 'pressing', 'decisive']);
  });
});

describe('WR-1 deployment census and dormancy', () => {
  it('fails closed unless both flags are exact true booleans', () => {
    const deployments = { a: deployment('b', ['grievance']) };
    const cases = [
      {},
      { warLayerEnabled: true },
      { warTerminationEnabled: true },
      { warLayerEnabled: 1, warTerminationEnabled: true },
      { warLayerEnabled: true, warTerminationEnabled: 'true' },
    ];
    for (const rules of cases) {
      const read = readWarTerminations({ worldState: world({ deployments, rules }) });
      expect(read.receipts).toEqual([]);
      expect([...read.byAttacker]).toEqual([]);
    }
  });

  it('reads each valid surviving deployment once in codepoint order', () => {
    const deployments = {
      zeta: deployment('omega', ['grievance']),
      alpha: deployment('beta', ['grievance']),
      self: deployment('self', ['grievance']),
      broken: { role: 'siege' },
    };
    const reasonPairs = {
      'zeta>omega': reasonEntry([['grievance', 0.8]]),
      'alpha>beta': reasonEntry([['grievance', 0.8]]),
    };
    const graphOnlyWar = {
      type: 'war_front', from: 'ghost', to: 'shade', status: 'active',
    };
    const read = readWarTerminations({
      worldState: world({ deployments, reasonPairs }),
      snapshot: snapshot([], [], [graphOnlyWar]),
    });
    expect(read.receipts.map((receipt) => receipt.attackerId)).toEqual(['alpha', 'zeta']);
    expect([...read.byAttacker.keys()]).toEqual(['alpha', 'zeta']);
    expect(read.receipts).toHaveLength(2);
  });

  it('does not manufacture a deployment read from a war-front channel', () => {
    const read = readWarTerminations({
      worldState: world(),
      snapshot: snapshot([], [], [{ type: 'war_front', from: 'a', to: 'b', status: 'active' }]),
    });
    expect(read).toEqual({ receipts: [], byAttacker: new Map() });
  });
});

describe('WR-1 cause dissolution', () => {
  it('treats every ordinary founding cause as live only while its current fold survives', () => {
    const ordinary = WAR_REASON_TYPES.filter((type) => !['opportunism', 'sacred_claim'].includes(type));
    for (const type of ordinary) {
      const live = readWarTerminations({
        worldState: world({
          deployments: { a: deployment('b', [type]) },
          reasonPairs: { 'a>b': reasonEntry([[type, 0.8]]) },
        }),
      }).byAttacker.get('a');
      expect(live?.dissolvedCauseTypes).toEqual([]);

      const dead = readWarTerminations({
        worldState: world({ deployments: { a: deployment('b', [type]) } }),
      }).byAttacker.get('a');
      expect(dead?.dissolvedCauseTypes).toEqual([type]);
      expect(dead?.receipt.causeState).toBe('dissolved');
    }
  });

  it('dissolves sacred_claim when either pinned patron is unseated', () => {
    const dep = deployment('b', ['sacred_claim'], {
      attackerPatronRef: 'sun-old',
      defenderPatronRef: 'moon-old',
    });
    const reasonPairs = { 'a>b': reasonEntry([['sacred_claim', 0.8]]) };
    const held = readWarTerminations({
      worldState: world({ deployments: { a: dep }, reasonPairs }),
      snapshot: snapshot([
        town('a', { name: 'Aster', patronRef: 'sun-old' }),
        town('b', { name: 'Briar', patronRef: 'moon-old' }),
      ]),
    }).byAttacker.get('a');
    expect(held?.dissolvedCauseTypes).toEqual([]);
    expect(held?.receipt.causeState).toBe('live');

    const unseated = readWarTerminations({
      worldState: world({ deployments: { a: dep }, reasonPairs }),
      snapshot: snapshot([
        town('a', { name: 'Aster', patronRef: 'sun-new' }),
        town('b', { name: 'Briar', patronRef: 'moon-old' }),
      ]),
    }).byAttacker.get('a');
    expect(unseated?.dissolvedCauseTypes).toEqual(['sacred_claim']);
    expect(unseated?.receipt.causeState).toBe('dissolved');
    expect(unseated?.receipt.reason).toContain('The war has outlived its reason');
    expect(unseated?.receipt.reason).toContain('a god named when the banners rose is no longer worshipped from the same throne');
    expect(unseated?.receipt.reason).not.toContain('sacred_claim'); // anchored: the two authored sacred-dissolution clauses above prove the receipt is live
  });

  it('names the authored cause that fell away when another founding cause survives', () => {
    const partial = readWarTerminations({
      worldState: world({
        deployments: { a: deployment('b', ['grievance', 'revanchism']) },
        reasonPairs: { 'a>b': reasonEntry([['revanchism', 0.8]]) },
      }),
      snapshot: snapshot([town('a', { name: 'Aster' }), town('b', { name: 'Briar' })]),
    }).byAttacker.get('a');

    expect(partial?.dissolvedCauseTypes).toEqual(['grievance']);
    expect(partial?.receipt.causeState).toBe('live');
    expect(partial?.receipt.reason).toContain('Part of the founding case has fallen away');
    expect(partial?.receipt.reason).toContain('the court no longer recognizes the grievance that raised its banners');
    expect(partial?.receipt.reason).not.toContain('revanchism'); // anchored: the authored grievance clause above proves the partial-dissolution receipt is live
  });

  it('keeps a live legacy sacred cause neutral when its old anchors are unavailable', () => {
    const legacy = readWarTerminations({
      worldState: world({
        deployments: { a: deployment('b', ['sacred_claim']) },
        reasonPairs: { 'a>b': reasonEntry([['sacred_claim', 0.8]]) },
      }),
      snapshot: snapshot([
        town('a', { name: 'Aster', patronRef: 'sun-new' }),
        town('b', { name: 'Briar', patronRef: 'moon-new' }),
      ]),
    }).byAttacker.get('a');
    expect(legacy?.dissolvedCauseTypes).toEqual([]);
    expect(legacy?.receipt.causeState).toBe('anchor_unavailable');
    expect(legacy?.bands.cause).toBe('present');

    const absentLiveReason = readWarTerminations({
      worldState: world({ deployments: { a: deployment('b', ['sacred_claim']) } }),
      snapshot: snapshot([
        town('a', { patronRef: 'sun-new' }),
        town('b', { patronRef: 'moon-new' }),
      ]),
    }).byAttacker.get('a');
    expect(absentLiveReason?.dissolvedCauseTypes).toEqual(['sacred_claim']);
    expect(absentLiveReason?.receipt.causeState).toBe('dissolved');
  });

  it('dissolves opportunism when the victim gains a patron or stops being weak', () => {
    const dep = deployment('lamb', ['opportunism']);
    const reasonPairs = { 'wolf>lamb': reasonEntry([['opportunism', 0.8]]) };
    const unprotected = readWarTerminations({
      worldState: world({ deployments: { wolf: dep }, reasonPairs }),
      snapshot: snapshot([
        town('wolf', { tier: 'city', population: 5000 }),
        town('lamb', { tier: 'village', population: 500 }),
      ]),
    }).byAttacker.get('wolf');
    expect(unprotected?.dissolvedCauseTypes).toEqual([]);

    const patronEdge = {
      id: 'guardian-lamb', from: 'guardian', to: 'lamb', relationshipType: 'patron',
    };
    const protectedRead = readWarTerminations({
      worldState: world({
        deployments: { wolf: dep },
        reasonPairs,
        relationshipStates: { 'guardian-lamb': { relationshipType: 'patron' } },
      }),
      snapshot: snapshot([
        town('wolf', { tier: 'city', population: 5000 }),
        town('lamb', { tier: 'village', population: 500 }),
        town('guardian'),
      ], [patronEdge]),
    }).byAttacker.get('wolf');
    expect(protectedRead?.dissolvedCauseTypes).toEqual(['opportunism']);

    const recovered = readWarTerminations({
      worldState: world({ deployments: { wolf: dep }, reasonPairs }),
      snapshot: snapshot([
        town('wolf', { tier: 'village', population: 500 }),
        town('lamb', { tier: 'city', population: 5000 }),
      ]),
    }).byAttacker.get('wolf');
    expect(recovered?.dissolvedCauseTypes).toEqual(['opportunism']);
    expect(recovered?.receipt.reason).toContain('no longer sees an undefended prize');
  });
});

describe('WR-1 four-term disagreement and receipt envelope', () => {
  it('makes each of the four canonical terms deciding on a real fixture', () => {
    const byTerm = {};

    byTerm.cause = readWarTerminations({
      worldState: world({
        deployments: { a: deployment('b', ['grievance']) },
        reasonPairs: { 'a>b': reasonEntry([['grievance', 1]]) },
      }),
      snapshot: snapshot([town('a', { name: 'Aster' }), town('b', { name: 'Briar' })]),
      sunkCostPressureFor: () => 0,
    }).byAttacker.get('a')?.decidingTerm;

    byTerm.cost_to_continue = readWarTerminations({
      worldState: world({
        deployments: {
          a: deployment('b', ['grievance'], { currentEffectiveStrength: 0 }),
        },
        reasonPairs: { 'a>b': reasonEntry([['grievance', 0.2]]) },
        warExhaustion: { a: 1 },
      }),
      snapshot: snapshot([town('a', { name: 'Aster' }), town('b', { name: 'Briar' })]),
      pIndex: pressureIndex({ 'a:economy': 1 }),
      sunkCostPressureFor: () => 0,
    }).byAttacker.get('a')?.decidingTerm;

    byTerm.cost_to_stop = readWarTerminations({
      worldState: world({ deployments: { a: deployment('b', []) } }),
      snapshot: snapshot([town('a', { name: 'Aster' }), town('b', { name: 'Briar' })]),
      sunkCostPressureFor: () => 1,
    }).byAttacker.get('a')?.decidingTerm;

    byTerm.momentum = readWarTerminations({
      worldState: world({
        deployments: { a: deployment('b', []) },
        rules: { ...LIT_RULES, infoMode: 'unreliable', momentumEnabled: true },
        extraLedgers: {
          commitments: {
            'a>war:b': {
              stock: MOMENTUM_TUNING.STOCK_MAX,
              sinceTick: 1,
              lastDepositTick: 9,
              deposits: [{ tick: 9, kind: 'siege', mag: 1 }],
            },
          },
        },
        extra: { spatialCanonVersion: 1 },
      }),
      snapshot: snapshot([town('a', { name: 'Aster' }), town('b', { name: 'Briar' })]),
      sunkCostPressureFor: () => 0,
    }).byAttacker.get('a')?.decidingTerm;

    expect(byTerm).toEqual({
      cause: 'cause',
      cost_to_continue: 'cost_to_continue',
      cost_to_stop: 'cost_to_stop',
      momentum: 'momentum',
    });
  });

  it('keeps both amendment-C disagreement arms reachable', () => {
    const deadCauseBase = {
      deployments: { a: deployment('b', ['grievance']) },
    };
    const cheapStop = readWarTerminations({
      worldState: world(deadCauseBase),
      snapshot: snapshot([town('a', { name: 'Aster' }), town('b', { name: 'Briar' })]),
      sunkCostPressureFor: () => 0,
    }).byAttacker.get('a');
    const costlyStop = readWarTerminations({
      worldState: world(deadCauseBase),
      snapshot: snapshot([town('a', { name: 'Aster' }), town('b', { name: 'Briar' })]),
      sunkCostPressureFor: () => 1,
    }).byAttacker.get('a');
    expect(cheapStop?.dissolvedCauseTypes).toEqual(['grievance']);
    expect(costlyStop?.suePressure01).toBeLessThan(cheapStop?.suePressure01);

    const liveCause = readWarTerminations({
      worldState: world({
        deployments: { a: deployment('b', ['grievance']) },
        reasonPairs: { 'a>b': reasonEntry([['grievance', 0.8]]) },
      }),
      snapshot: snapshot([town('a', { name: 'Aster' }), town('b', { name: 'Briar' })]),
      sunkCostPressureFor: () => 0,
    }).byAttacker.get('a');
    const unbearable = readWarTerminations({
      worldState: world({
        deployments: { a: deployment('b', ['grievance'], { currentEffectiveStrength: 0 }) },
        reasonPairs: { 'a>b': reasonEntry([['grievance', 0.8]]) },
        warExhaustion: { a: 1 },
      }),
      snapshot: snapshot([town('a', { name: 'Aster' }), town('b', { name: 'Briar' })]),
      pIndex: pressureIndex({ 'a:economy': 1 }),
      sunkCostPressureFor: () => 0,
    }).byAttacker.get('a');
    expect(unbearable?.dissolvedCauseTypes).toEqual([]);
    expect(unbearable?.suePressure01).toBeGreaterThan(liveCause?.suePressure01);
  });

  it('uses the canonical term-order tie break', () => {
    const tiedScore = REASON_TUNING.AGGREGATE_SATURATION * 0.25;
    const read = readWarTerminations({
      worldState: world({
        deployments: { a: deployment('b', ['grievance']) },
        reasonPairs: { 'a>b': reasonEntry([['grievance', tiedScore]]) },
      }),
      snapshot: snapshot([town('a', { name: 'Aster' }), town('b', { name: 'Briar' })]),
      sunkCostPressureFor: () => 0,
    }).byAttacker.get('a');
    expect(read?.bands.cause).toBe(read?.bands.cost_to_stop);
    expect(read?.decidingTerm).toBe('cause');
  });

  it('persists no numeric control and keeps the numeric sue read ephemeral', () => {
    const state = world({
      deployments: { 'raw-attacker-id': deployment('raw-target-id', ['grievance']) },
      reasonPairs: { 'raw-attacker-id>raw-target-id': reasonEntry([['grievance', 0.8]]) },
    });
    const read = readWarTerminations({ worldState: state, tick: 9 });
    const receipt = read.receipts[0];
    expect(Object.keys(receipt).sort()).toEqual([
      'attackerId', 'believedBalanceBand', 'causeBand', 'causeState',
      'costToContinueBand', 'costToStopBand', 'decidingTerm', 'homeFrontBand',
      'homeFrontComponents', 'homeFrontDurationBand', 'id', 'kind',
      'momentumBand', 'reason', 'settlementIds', 'targetId', 'tick',
      'trajectory', 'trajectoryMisread', 'truthBalanceBand',
    ]);
    expect(Object.values(receipt).filter((value) => typeof value === 'number')).toEqual([9]);
    const numericLeaves = [];
    const visit = (value, key = '') => {
      if (typeof value === 'number') numericLeaves.push([key, value]);
      else if (Array.isArray(value)) value.forEach((item, index) => visit(item, `${key}[${index}]`));
      else if (value && typeof value === 'object') {
        Object.entries(value).forEach(([childKey, child]) => visit(child, childKey));
      }
    };
    visit(receipt);
    expect(numericLeaves).toEqual([['tick', 9]]);
    expect(typeof read.byAttacker.get('raw-attacker-id')?.suePressure01).toBe('number');
    expect(receipt.reason).toMatch(/[A-Za-z]/);
    expect(receipt.reason.match(/\d/)).toBeNull();
    expect(receipt.reason.includes('raw-attacker-id')).toBe(false);
    expect(receipt.reason.includes('raw-target-id')).toBe(false);
  });

  it('ignores deployment age and leaves every input byte untouched', () => {
    const base = world({
      deployments: {
        a: deployment('b', ['grievance'], {
          deploymentAge: 0,
          currentEffectiveStrength: 0.5,
        }),
      },
      reasonPairs: { 'a>b': reasonEntry([['grievance', 0.8]]) },
      warExhaustion: { a: 0.4 },
    });
    const old = structuredClone(base);
    old.deployments.a.deploymentAge = 999;
    const snap = snapshot([town('a', { name: 'Aster' }), town('b', { name: 'Briar' })]);
    const beforeBase = JSON.stringify(base);
    const beforeOld = JSON.stringify(old);
    const freshRead = readWarTerminations({ worldState: base, snapshot: snap });
    const oldRead = readWarTerminations({ worldState: old, snapshot: snap });
    expect([...freshRead.byAttacker.values()]).toEqual([...oldRead.byAttacker.values()]);
    expect(JSON.stringify(base)).toBe(beforeBase);
    expect(JSON.stringify(old)).toBe(beforeOld);
  });
});

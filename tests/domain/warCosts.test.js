/** WR-4 — receipt-carried balance history and pure comparative costs. */

import { describe, expect, it, vi } from 'vitest';

import {
  WAR_COST_BALANCE_BANDS,
  WAR_COST_TRAJECTORY_MARGIN_BANDS,
  WAR_COST_TRAJECTORIES,
  WAR_COSTS_TUNING,
  compareWarCostTrajectoryTruth,
  evaluateWarCostTrajectory,
  priorWarCostReceipt,
  readWarHomeFront,
  warCostBalanceBand,
} from '../../src/domain/worldPulse/warCosts.js';

function snapshotFor(settlement, edges = []) {
  const rows = [
    { id: 'actor', name: 'Ashford', settlement },
    { id: 'peer', name: 'Reedbank', settlement: { name: 'Reedbank' } },
    { id: 'buyer', name: 'Northmarket', settlement: { name: 'Northmarket' } },
  ];
  return {
    byId: new Map(rows.map(row => [row.id, row])),
    regionalGraph: { edges },
  };
}

function fullHomeFrontArgs() {
  const settlement = {
    name: 'Ashford', tier: 'town', population: 900, config: { tier: 'town' },
    economicState: {
      primaryImports: [{ id: 'grain', label: 'Grain' }],
      primaryExports: [{ id: 'iron', label: 'Iron' }],
      foodSecurity: {
        storageMonths: 1,
        stockpile: {
          capacityMonths: 4,
          deployed: true,
        },
      },
    },
    institutions: [{ id: 'temple', name: 'Temple of Dawn' }],
    powerStructure: {
      factions: [{ id: 'civic-council', name: 'Civic Council', isGoverning: true }],
    },
  };
  return {
    actorId: 'actor',
    deployment: { sinceTick: 4, deploymentAge: 8, deployedPopulation: 120 },
    worldState: {
      tick: 12,
      spatialLedgers: {
        routeNetwork: {
          edges: {
            'route.actor.peer.land': {
              a: 'actor', b: 'peer', grade: 'track',
              gradeStep: { direction: 'down', tick: 6 },
            },
          },
          corridor: {},
        },
        institutionStatus: {
          actor: { temple: { shell: { sinceTick: 7 } } },
        },
      },
      tradeWarState: {
        'buyer:grain': {
          incumbentId: 'actor', winnerId: 'peer', buyerId: 'buyer',
          commodityId: 'grain', lastFlipTick: 8,
        },
      },
    },
    snapshot: snapshotFor(settlement),
  };
}

describe('WR-4 closed balance bands', () => {
  it('bands the full -1..1 advantage axis at the owner-retunable cutoffs', () => {
    const T = WAR_COSTS_TUNING;
    expect(warCostBalanceBand(-1)).toBe('far_behind');
    expect(warCostBalanceBand(T.FAR_BEHIND_AT)).toBe('far_behind');
    expect(warCostBalanceBand(T.FAR_BEHIND_AT + 0.01)).toBe('behind');
    expect(warCostBalanceBand(T.MATCHED_LOW)).toBe('matched');
    expect(warCostBalanceBand(0)).toBe('matched');
    expect(warCostBalanceBand(T.MATCHED_HIGH)).toBe('matched');
    expect(warCostBalanceBand(T.MATCHED_HIGH + 0.01)).toBe('ahead');
    expect(warCostBalanceBand(T.FAR_AHEAD_AT)).toBe('far_ahead');
    expect(warCostBalanceBand(1)).toBe('far_ahead');
  });

  it('clamps out-of-range advantages and fails malformed input to matched', () => {
    expect(warCostBalanceBand(-99)).toBe('far_behind');
    expect(warCostBalanceBand(99)).toBe('far_ahead');
    for (const value of [undefined, null, '0.7', Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(warCostBalanceBand(value)).toBe('matched');
    }
    expect(WAR_COST_BALANCE_BANDS).toEqual([
      'far_behind', 'behind', 'matched', 'ahead', 'far_ahead',
    ]);
  });
});

describe('WR-4 belief-only comparative-cost trajectory', () => {
  it('an improving believed balance expects cheaper later terms and holds', () => {
    const read = evaluateWarCostTrajectory({
      priorBelievedBand: 'behind',
      currentBelievedBand: 'ahead',
    });

    expect(read).toEqual({
      trajectory: 'winning',
      trajectoryMarginBand: 'clear',
      comparison: {
        endNowCost: 'higher',
        endLaterCost: 'lower',
        preferredTiming: 'later',
        pressure: 'continue',
      },
      receipt: {
        kind: 'war_trajectory_winning',
        audience: 'public',
        stateRead: 'believed_balance_band_history',
        priorBelievedBand: 'behind',
        currentBelievedBand: 'ahead',
        trajectory: 'winning',
        trajectoryMarginBand: 'clear',
      },
    });
  });

  it('a worsening believed balance expects costlier later terms and sues now', () => {
    const read = evaluateWarCostTrajectory({
      priorBelievedBand: 'far_ahead',
      currentBelievedBand: 'matched',
    });

    expect(read).toEqual({
      trajectory: 'losing',
      trajectoryMarginBand: 'clear',
      comparison: {
        endNowCost: 'lower',
        endLaterCost: 'higher',
        preferredTiming: 'now',
        pressure: 'sue',
      },
      receipt: {
        kind: 'war_trajectory_losing',
        audience: 'public',
        stateRead: 'believed_balance_band_history',
        priorBelievedBand: 'far_ahead',
        currentBelievedBand: 'matched',
        trajectory: 'losing',
        trajectoryMarginBand: 'clear',
      },
    });
  });

  it('labels a one-band directional step narrow and a two-band step clear', () => {
    const narrow = evaluateWarCostTrajectory({
      priorBelievedBand: 'matched',
      currentBelievedBand: 'ahead',
    });
    const clear = evaluateWarCostTrajectory({
      priorBelievedBand: 'behind',
      currentBelievedBand: 'ahead',
    });
    expect(narrow.trajectoryMarginBand).toBe('narrow');
    expect(narrow.receipt?.trajectoryMarginBand).toBe('narrow');
    expect(clear.trajectoryMarginBand).toBe('clear');
    expect(clear.receipt?.trajectoryMarginBand).toBe('clear');
    expect(WAR_COST_TRAJECTORY_MARGIN_BANDS).toEqual(['narrow', 'clear']);
  });

  it('first observation, missing history, invalid bands, and equal bands are EVEN and silent', () => {
    for (const args of [
      {},
      { currentBelievedBand: 'ahead' },
      { priorBelievedBand: 'behind' },
      { priorBelievedBand: 'invented', currentBelievedBand: 'ahead' },
      { priorBelievedBand: 'matched', currentBelievedBand: 'matched' },
    ]) {
      expect(evaluateWarCostTrajectory(args)).toEqual({
        trajectory: 'even',
        trajectoryMarginBand: null,
        comparison: null,
        receipt: null,
      });
    }
  });

  it('hardest negative: overwhelming but unchanged advantage is not a trend', () => {
    expect(evaluateWarCostTrajectory({
      priorBelievedBand: 'far_ahead',
      currentBelievedBand: 'far_ahead',
    })).toEqual({
      trajectory: 'even',
      trajectoryMarginBand: null,
      comparison: null,
      receipt: null,
    });
  });
});

describe('WR-4 truth is diagnostic, never behavioral', () => {
  it('exposes an opposite true trajectory without changing the court comparison', () => {
    const court = evaluateWarCostTrajectory({
      priorBelievedBand: 'matched',
      currentBelievedBand: 'ahead',
    });
    const diagnostic = compareWarCostTrajectoryTruth({
      believedTrajectory: court.trajectory,
      priorTruthBand: 'matched',
      currentTruthBand: 'behind',
    });

    expect(court.comparison?.pressure).toBe('continue');
    expect(Object.hasOwn(court, 'truthTrajectory')).toBe(false);
    expect(diagnostic).toEqual({
      truthTrajectory: 'losing',
      misread: true,
      receipt: {
        kind: 'trajectory_misread',
        audience: 'dm-only',
        courtStateRead: 'believed_balance_band_history',
        truthStateRead: 'true_balance_band_history',
        believedTrajectory: 'winning',
        truthTrajectory: 'losing',
        priorTruthBand: 'matched',
        currentTruthBand: 'behind',
      },
    });
  });

  it('first truth observation cannot accuse the court of a misread', () => {
    expect(compareWarCostTrajectoryTruth({
      believedTrajectory: 'winning',
      currentTruthBand: 'behind',
    })).toEqual({ truthTrajectory: null, misread: false, receipt: null });
  });

  it('an even believed read stays silent and is not accused of a misread', () => {
    const court = evaluateWarCostTrajectory({
      priorBelievedBand: 'matched',
      currentBelievedBand: 'matched',
    });
    const diagnostic = compareWarCostTrajectoryTruth({
      believedTrajectory: court.trajectory,
      priorTruthBand: 'matched',
      currentTruthBand: 'far_behind',
    });
    expect(court.receipt).toBeNull();
    expect(diagnostic.truthTrajectory).toBe('losing');
    expect(diagnostic.misread).toBe(false);
    expect(diagnostic.receipt).toBeNull();
  });

  it('is deterministic, input-pure, rng-free, and closed-vocabulary', () => {
    const args = Object.freeze({
      priorBelievedBand: 'ahead',
      currentBelievedBand: 'behind',
    });
    const random = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('warCosts must not draw');
    });
    try {
      const first = evaluateWarCostTrajectory(args);
      expect(first).toEqual(evaluateWarCostTrajectory(args));
      expect(WAR_COST_TRAJECTORIES).toEqual(['losing', 'even', 'winning']);
      expect(WAR_COST_TRAJECTORIES).toContain(first.trajectory);
      expect(args).toEqual({
        priorBelievedBand: 'ahead',
        currentBelievedBand: 'behind',
      });
    } finally {
      random.mockRestore();
    }
  });
});

describe('WR-4 receipt-carried trajectory history', () => {
  it('finds the newest prior receipt for the exact directed war pair', () => {
    const old = {
      kind: 'war_termination_read', tick: 2,
      attackerId: 'actor', targetId: 'peer', currentBelievedBand: 'behind',
    };
    const newestPrior = {
      kind: 'war_termination_read', tick: 8,
      attackerId: 'actor', targetId: 'peer', currentBelievedBand: 'matched',
    };
    const current = {
      kind: 'war_termination_read', tick: 10,
      attackerId: 'actor', targetId: 'peer', currentBelievedBand: 'ahead',
    };
    const reverse = {
      kind: 'war_termination_read', tick: 9,
      attackerId: 'peer', targetId: 'actor', currentBelievedBand: 'far_ahead',
    };
    const worldState = {
      // Deliberately out of tick order: the receipt tick, not array luck, wins.
      pulseHistory: [
        { tick: 8, warTerminationReads: [newestPrior] },
        { tick: 2, warTerminationReads: [old] },
        { tick: 10, warTerminationReads: [reverse, current] },
        { tick: 11, warTerminationReads: [{ ...current, tick: Number.NaN }] },
      ],
    };

    expect(priorWarCostReceipt(worldState, 'actor', 'peer', 10)).toBe(newestPrior);
    expect(priorWarCostReceipt(worldState, 'actor', 'peer', 8)).toBe(old);
    expect(priorWarCostReceipt(worldState, 'actor', 'peer', 10, 8)).toBe(newestPrior);
    expect(priorWarCostReceipt(worldState, 'actor', 'peer', 10, 9)).toBeNull();
    expect(priorWarCostReceipt(worldState, 'actor', 'peer')).toBe(current);
    expect(priorWarCostReceipt(worldState, 'peer', 'actor', 10)).toBe(reverse);
    expect(priorWarCostReceipt(worldState, 'actor', 'missing')).toBeNull();
  });
});

describe('WR-4 home-front read', () => {
  it('reads all five real degradation paths and keeps their attribution honest', () => {
    const read = readWarHomeFront(fullHomeFrontArgs());

    expect(Object.keys(read.components)).toEqual([
      'roads', 'stores', 'hands', 'institutions', 'markets',
    ]);
    for (const component of Object.values(read.components)) {
      expect(component.score01).toBeGreaterThan(0);
    }
    expect(read.components.roads.route).toBe('the road between Ashford and Reedbank');
    expect(read.components.stores).not.toHaveProperty('good');
    expect(read.components.institutions.temple).toBe('Temple of Dawn');
    expect(read.components.markets.good).toBe('Grain');
    expect(read.components.markets).not.toHaveProperty('house');
    expect(read.receiptComponents.markets).not.toHaveProperty('house');
    for (const component of Object.values(read.receiptComponents)) {
      expect(component).not.toHaveProperty('score01');
    }
    expect(read.score01).toBeGreaterThan(0);
  });

  it('a sparse world is an exact quiet zero', () => {
    const read = readWarHomeFront({
      actorId: 'actor',
      deployment: {},
      worldState: {},
      snapshot: snapshotFor({}),
    });
    expect(read.score01).toBe(0);
    expect(read.band).toBe('quiet');
    expect(read.durationBand).toBe('opening');
    expect(Object.values(read.components).every(component => component.score01 === 0))
      .toBe(true);
  });

  it('age alone stays exact zero and cannot even change the duration receipt', () => {
    const base = {
      actorId: 'actor',
      worldState: { tick: 100 },
      snapshot: snapshotFor({ name: 'Ashford', population: 900 }),
    };
    const opening = readWarHomeFront({ ...base, deployment: { sinceTick: 100, deploymentAge: 0 } });
    const ancient = readWarHomeFront({ ...base, deployment: { sinceTick: 0, deploymentAge: 100 } });
    expect(ancient.score01).toBe(0);
    expect(ancient.band).toBe('quiet');
    expect(ancient.durationBand).toBe('opening');
    expect(ancient.receiptComponents).toEqual(opening.receiptComponents);
  });

  it('duration multiplies attributable evidence exactly once', () => {
    const settlement = { name: 'Ashford', population: 880 };
    const base = {
      actorId: 'actor',
      snapshot: snapshotFor(settlement),
    };
    const opening = readWarHomeFront({
      ...base,
      deployment: { sinceTick: 0, deploymentAge: 0, deployedPopulation: 120 },
      worldState: { tick: 0 },
    });
    const sustained = readWarHomeFront({
      ...base,
      deployment: { sinceTick: 0, deploymentAge: 20, deployedPopulation: 120 },
      worldState: { tick: 20 },
    });
    const gain = 1 + Math.min(
      WAR_COSTS_TUNING.DURATION_GAIN_CAP,
      20 * WAR_COSTS_TUNING.DURATION_GAIN_PER_TICK,
    );
    expect(sustained.components).toEqual(opening.components);
    expect(sustained.score01).toBeCloseTo(opening.score01 * gain, 10);
    expect(sustained.durationBand).toBe('sustained');
  });

  it('charges only the attacker home for its own conscripts, not allied or vassal levies', () => {
    const base = {
      actorId: 'actor',
      worldState: { tick: 12 },
      snapshot: snapshotFor({ name: 'Ashford', population: 900 }),
    };
    const leviesOnly = readWarHomeFront({
      ...base,
      deployment: {
        sinceTick: 4,
        deployedPopulation: 120,
        leviedPopulationBySource: { vassalA: 80, allyB: 40 },
      },
    });
    expect(leviesOnly.components.hands.score01).toBe(0);
    expect(leviesOnly.components.hands.band).toBe('quiet');

    const withOwnConscripts = readWarHomeFront({
      ...base,
      deployment: {
        sinceTick: 4,
        deployedPopulation: 240,
        leviedPopulationBySource: { vassalA: 80, allyB: 40 },
      },
    });
    expect(withOwnConscripts.components.hands.score01).toBeGreaterThan(0);
    expect(withOwnConscripts.components.hands.stateRead)
      .toBe('deployment.deployedPopulation|leviedPopulationBySource');
  });

  it('never invents a store good because the real stockpile schema carries no attributable good', () => {
    const args = fullHomeFrontArgs();
    const read = readWarHomeFront(args);
    expect(read.components.stores.score01).toBeGreaterThan(0);
    expect(read.components.stores).not.toHaveProperty('good');
    expect(read.receiptComponents.stores).not.toHaveProperty('good');
  });

  it('does not embed raw endpoint ids in a route receipt when authored names are absent', () => {
    const actorId = 'actor_internal_42';
    const peerId = 'peer_internal_77';
    const read = readWarHomeFront({
      actorId,
      deployment: { sinceTick: 5 },
      worldState: {
        tick: 10,
        spatialLedgers: {
          routeNetwork: {
            edges: {
              'route.internal': {
                a: actorId, b: peerId, grade: 'track',
                gradeStep: { direction: 'down', tick: 7 },
              },
            },
            corridor: {},
          },
        },
      },
      snapshot: {
        byId: new Map([
          [actorId, { id: actorId, name: actorId, settlement: { name: actorId } }],
          [peerId, { id: peerId, name: peerId, settlement: { name: peerId } }],
        ]),
        regionalGraph: { edges: [] },
      },
    });
    expect(read.components.roads.score01).toBeGreaterThan(0);
    expect(read.components.roads).not.toHaveProperty('route');
    const receipt = JSON.stringify(read.receiptComponents);
    expect(receipt).not.toContain(actorId);
    expect(receipt).not.toContain(peerId);
  });

  it('rejects missing, non-finite, coerced, pre-war, and future evidence timestamps', () => {
    const invalidTicks = [undefined, null, Number.NaN, Number.POSITIVE_INFINITY, '7', 4, 11];
    for (const evidenceTick of invalidTicks) {
      const settlement = {
        name: 'Ashford', population: 900,
        economicState: { primaryImports: [{ id: 'grain', label: 'Grain' }] },
        institutions: [{ id: 'private-institution-id' }],
        powerStructure: {
          factions: [{ id: 'governor-id', name: 'The Governing Council', isGoverning: true }],
        },
      };
      const edge = { id: 'rel.actor.peer', from: 'actor', to: 'peer' };
      const read = readWarHomeFront({
        actorId: 'actor',
        deployment: { sinceTick: 5 },
        worldState: {
          tick: 10,
          spatialLedgers: {
            institutionStatus: {
              actor: {
                private_institution_id: { shell: { sinceTick: evidenceTick } },
              },
            },
          },
          relationshipStates: {
            [edge.id]: {
              turningPoints: [{
                tick: evidenceTick,
                fromType: 'trade_partner',
                toType: 'neutral',
              }],
            },
          },
          tradeWarState: {
            'buyer:grain': {
              incumbentId: 'actor', winnerId: 'peer', buyerId: 'buyer',
              commodityId: 'grain', lastFlipTick: evidenceTick,
            },
          },
        },
        snapshot: snapshotFor(settlement, [edge]),
      });
      expect(read.components.institutions.score01, String(evidenceTick)).toBe(0);
      expect(read.components.markets.score01, String(evidenceTick)).toBe(0);
      expect(read.score01, String(evidenceTick)).toBe(0);
    }
  });

  it('requires a non-empty different winner before a trade-war row proves a lost market', () => {
    const settlement = {
      name: 'Ashford', population: 900,
      economicState: { primaryImports: [{ id: 'grain', label: 'Grain' }] },
    };
    for (const winnerId of [undefined, '', 'actor']) {
      const read = readWarHomeFront({
        actorId: 'actor',
        deployment: { sinceTick: 5 },
        worldState: {
          tick: 10,
          tradeWarState: {
            'buyer:grain': {
              incumbentId: 'actor', winnerId, buyerId: 'buyer',
              commodityId: 'grain', lastFlipTick: 8,
            },
          },
        },
        snapshot: snapshotFor(settlement),
      });
      expect(read.components.markets.score01).toBe(0);
      expect(read.components.markets).not.toHaveProperty('counterpartId');
      expect(read.components.markets).not.toHaveProperty('good');
    }
  });

  it('keeps a displaced supplier charged while another supplier holds the market', () => {
    const settlement = {
      name: 'Ashford', population: 900,
      economicState: { primaryImports: [{ id: 'grain', label: 'Grain' }] },
    };
    const read = readWarHomeFront({
      actorId: 'actor',
      deployment: { sinceTick: 5 },
      worldState: {
        tick: 12,
        tradeWarState: {
          'buyer:grain': {
            incumbentId: 'peer', winnerId: 'third', buyerId: 'buyer',
            commodityId: 'grain', lastFlipTick: 8, updatedTick: 12,
            lostSupplierSinceTick: { actor: 8, peer: 12 },
          },
        },
      },
      snapshot: snapshotFor(settlement),
    });
    expect(read.components.markets).toMatchObject({
      band: 'pressing', counterpartId: 'buyer', good: 'Grain',
    });
  });

  it('does not re-date an old supplier loss when a later supplier loses the same prize', () => {
    const settlement = {
      name: 'Ashford', population: 900,
      economicState: { primaryImports: [{ id: 'grain', label: 'Grain' }] },
    };
    const read = readWarHomeFront({
      actorId: 'actor',
      deployment: { sinceTick: 5 },
      worldState: {
        tick: 12,
        tradeWarState: {
          'buyer:grain': {
            incumbentId: 'peer', winnerId: 'third', buyerId: 'buyer',
            commodityId: 'grain', lastFlipTick: 10, updatedTick: 12,
            lostSupplierSinceTick: { actor: 4, peer: 10 },
          },
        },
      },
      snapshot: snapshotFor(settlement),
    });
    expect(read.components.markets.score01).toBe(0);
  });

  it('does not keep charging a relationship loss after the trade tie is restored', () => {
    const settlement = { name: 'Ashford', population: 900 };
    const edge = { id: 'rel.actor.peer', from: 'actor', to: 'peer', relationshipType: 'trade_partner' };
    const read = readWarHomeFront({
      actorId: 'actor',
      deployment: { sinceTick: 5 },
      worldState: {
        tick: 12,
        relationshipStates: {
          [edge.id]: {
            relationshipType: 'trade_partner',
            turningPoints: [
              { tick: 7, fromType: 'trade_partner', toType: 'neutral' },
              { tick: 10, fromType: 'neutral', toType: 'trade_partner' },
            ],
          },
        },
      },
      snapshot: snapshotFor(settlement, [edge]),
    });
    expect(read.components.markets.score01).toBe(0);
    expect(read.components.markets).not.toHaveProperty('counterpartId');
  });

  it('uses valid in-deployment clocks without leaking raw ids or naming a governing faction as a house', () => {
    const settlement = {
      name: 'Ashford', population: 900,
      economicState: { primaryImports: [{ id: 'grain', label: 'Grain' }] },
      institutions: [{ id: 'private-institution-id' }],
      powerStructure: {
        factions: [{ id: 'governor-id', name: 'The Governing Council', isGoverning: true }],
      },
    };
    const edge = { id: 'rel.actor.peer', from: 'actor', to: 'peer' };
    const read = readWarHomeFront({
      actorId: 'actor',
      deployment: { sinceTick: 5 },
      worldState: {
        tick: 10,
        spatialLedgers: {
          institutionStatus: {
            actor: { private_institution_id: { shell: { sinceTick: 7 } } },
          },
        },
        relationshipStates: {
          [edge.id]: {
            turningPoints: [{ tick: 7, fromType: 'trade_partner', toType: 'neutral' }],
          },
        },
        tradeWarState: {
          'buyer:grain': {
            incumbentId: 'actor', winnerId: 'peer', buyerId: 'buyer',
            commodityId: 'grain', lastFlipTick: 8,
          },
        },
      },
      snapshot: snapshotFor(settlement, [edge]),
    });
    expect(read.components.institutions.score01).toBeGreaterThan(0);
    expect(read.components.institutions).not.toHaveProperty('temple');
    expect(JSON.stringify(read.receiptComponents)).not.toContain('private-institution-id');
    expect(read.components.markets.score01).toBeGreaterThan(0);
    expect(read.components.markets.good).toBe('Grain');
    expect(read.components.markets).not.toHaveProperty('house');
    expect(JSON.stringify(read.receiptComponents)).not.toContain('The Governing Council');
  });

  it('is deterministic, input-pure, and consumes no RNG', () => {
    const args = fullHomeFrontArgs();
    const before = JSON.stringify({
      deployment: args.deployment,
      worldState: args.worldState,
      settlement: args.snapshot.byId.get('actor').settlement,
    });
    const random = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('warCosts home front must not draw');
    });
    try {
      expect(readWarHomeFront(args)).toEqual(readWarHomeFront(args));
      expect(JSON.stringify({
        deployment: args.deployment,
        worldState: args.worldState,
        settlement: args.snapshot.byId.get('actor').settlement,
      })).toBe(before);
    } finally {
      random.mockRestore();
    }
  });
});

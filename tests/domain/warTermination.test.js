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
import { FALL_CAUSE_PROSE } from '../../src/domain/worldPulse/warTerminationCauseTables.js';
import { PATRON_FALL_CAUSES, recordPatronFall } from '../../src/domain/worldPulse/patronFall.js';
import { COUPLING_REGISTRY } from '../../src/domain/certification/couplingRegistry.js';
import { KIND_SECTION } from '../../src/domain/display/chroniclersLetter.js';
import { CONDITIONAL_LEDGER_KEYS } from '../../src/domain/worldPulse/worldState.js';
import {
  WORLD_SNAPSHOT_HARD_DENY,
  WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST,
} from '../../src/domain/display/worldSnapshotPublic.js';

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
    expect(Object.keys(WAR_CAUSE_DISSOLUTION)).toHaveLength(16);
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
  it('treats every ledger-derived founding cause as live only while its current fold survives', () => {
    // alliance_obligation is not ledger-derived: its closed join anchor and
    // exact bilateral compact override a stale reason fold in both directions.
    const ordinary = WAR_REASON_TYPES.filter((type) => ![
      'opportunism', 'sacred_claim', 'alliance_obligation',
    ].includes(type));
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

  // ── WF-1d · THE DISSOLUTION-NAMES-THE-FALL JOIN (six acceptance cases) ──────────
  // A sacred war outliving its faith could say only THAT the claim died, never why.
  // These six pin the join, its two fences, and its registration. The ring is always
  // seeded THROUGH the landed recordPatronFall writer, never by poking the object,
  // and the drive always spells the LITERAL faithUnseatingEnabled: true.
  const SACRED_PINS = { attackerPatronRef: 'sun-old', defenderPatronRef: 'moon-old' };
  const sacredWar = (extraRules, religionStates, dep = deployment('b', ['sacred_claim'], SACRED_PINS)) => readWarTerminations({
    worldState: world({
      deployments: { a: dep },
      reasonPairs: { 'a>b': reasonEntry([['sacred_claim', 0.8]]) },
      rules: { ...LIT_RULES, ...extraRules },
      extra: religionStates ? { religionStates } : {},
    }),
    snapshot: snapshot([
      town('a', { name: 'Aster', patronRef: 'sun-new' }),
      town('b', { name: 'Briar', patronRef: 'moon-old' }),
    ]),
  }).byAttacker.get('a');
  const ringFor = (ref, cause) => {
    const religion = {};
    recordPatronFall(religion, { ref, cause, atTick: 7 });
    return { a: religion };
  };

  it('WF-1d names the fall: a lit dissolution carries the typed token and the house clause', () => {
    const ring = ringFor('sun-old', 'discredited');
    expect(ring.a.patronFalls).toEqual([{ ref: 'sun-old', cause: 'discredited', atTick: 7 }]);
    const lit = sacredWar({ faithUnseatingEnabled: true }, ring);
    expect(lit?.dissolvedCauseTypes).toEqual(['sacred_claim']);
    expect(lit?.receipt.causeState).toBe('dissolved');
    expect(lit?.receipt.patronFallCause).toBe('discredited');
    expect(lit?.receipt.reason).toContain('no longer worshipped from the same throne'
      + ' — the creed lost its rightful claim in the town it was named from');
  });

  it('WF-1d dormancy: flag-absent and flag-false receipts are byte-identical, and only the lit drive moves a byte', () => {
    const dark = JSON.stringify(sacredWar({}, ringFor('sun-old', 'discredited'))?.receipt);
    const off = JSON.stringify(sacredWar({ faithUnseatingEnabled: false }, ringFor('sun-old', 'discredited'))?.receipt);
    const lit = JSON.stringify(sacredWar({ faithUnseatingEnabled: true }, ringFor('sun-old', 'discredited'))?.receipt);
    expect(dark).toBe(off);
    // The fence has something to SEE: without this the two arms above could agree
    // because the join is dead rather than because it is dormant.
    expect(lit).not.toBe(dark);
    expect(dark).toContain('no longer worshipped from the same throne. Still,');
    // The other fifteen casus clauses are untouched by the selector refactor. This arm is
    // also the GUARD pin: the anchors ARE pinned and the ring DOES record their fall, so
    // only the sacred_claim guard stops a grievance war from wearing a patron-fall token.
    const other = sacredWar({ faithUnseatingEnabled: true }, ringFor('sun-old', 'discredited'),
      deployment('b', ['grievance'], SACRED_PINS));
    expect(other?.dissolvedCauseTypes).toEqual(['grievance']);
    const otherKeys = Object.keys(other?.receipt || {});
    expect(other?.receipt.reason).toContain('the court no longer recognizes the grievance that raised its banners');
    expect(otherKeys).not.toContain('patronFallCause'); // anchored: this drive pins both anchors and records their fall — the A1 case proves that same ring DOES set the key on a sacred war, so only the casus guard can be holding here
  });

  it('WF-1d honesty: a lit world whose ring records no fall for the PINNED anchor invents no cause', () => {
    const lit = sacredWar({ faithUnseatingEnabled: true }, ringFor('some-other-god', 'displaced'));
    const dark = sacredWar({}, ringFor('some-other-god', 'displaced'));
    expect(lit?.receipt.causeState).toBe('dissolved');
    expect(JSON.stringify(lit?.receipt)).toBe(JSON.stringify(dark?.receipt));
    const litKeys = Object.keys(lit?.receipt || {});
    expect(litKeys.length).toBeGreaterThan(0);
    expect(litKeys).not.toContain('patronFallCause'); // anchored: the receipt rendered with a non-empty key set (asserted above) and the A1 case sets this exact key on this exact drive
  });

  it('WF-1d legacy: an anchor_unavailable deployment gets no invented cause, by the existing control flow', () => {
    const legacy = sacredWar({ faithUnseatingEnabled: true }, ringFor('sun-old', 'discredited'),
      deployment('b', ['sacred_claim']));
    expect(legacy?.receipt.causeState).toBe('anchor_unavailable');
    expect(legacy?.dissolvedCauseTypes).toEqual([]);
    const legacyKeys = Object.keys(legacy?.receipt || {});
    expect(legacyKeys.length).toBeGreaterThan(0);
    expect(legacyKeys).not.toContain('patronFallCause'); // anchored: causeState anchor_unavailable and dissolvedCauseTypes [] are asserted above over a ring that DOES name sun-old, so the guard is proven false rather than the fixture unreached
  });

  it('WF-1d lifecycle and veil: nothing persists, no ledger key moves, and the receipt crosses no veil', () => {
    const ring = ringFor('sun-old', 'discredited');
    const worldBefore = world({
      deployments: { a: deployment('b', ['sacred_claim'], SACRED_PINS) },
      reasonPairs: { 'a>b': reasonEntry([['sacred_claim', 0.8]]) },
      rules: { ...LIT_RULES, faithUnseatingEnabled: true },
      extra: { religionStates: ring },
    });
    const frozen = JSON.stringify(worldBefore);
    readWarTerminations({
      worldState: worldBefore,
      snapshot: snapshot([
        town('a', { name: 'Aster', patronRef: 'sun-new' }),
        town('b', { name: 'Briar', patronRef: 'moon-old' }),
      ]),
    });
    expect(JSON.stringify(worldBefore)).toBe(frozen);
    expect(CONDITIONAL_LEDGER_KEYS.length).toBeGreaterThan(0);
    expect([...CONDITIONAL_LEDGER_KEYS]).not.toContain('patronFallCause'); // anchored: the length floor asserted above proves the frozen list really loaded, so this cannot pass over an empty array
    expect(WORLD_SNAPSHOT_HARD_DENY).toContain('religionStates');
    expect([...WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST]).not.toContain('religionStates'); // anchored: the hard-deny membership asserted above proves the veil tables loaded and DO carry religionStates
  });

  it('WF-1d registration: the vocabularies match, the pair is licensed once, and no Chronicle row exists', () => {
    expect(Object.keys(FALL_CAUSE_PROSE).sort()).toEqual([...PATRON_FALL_CAUSES].sort());
    const faithWar = COUPLING_REGISTRY.filter((row) => row.direction === 'FAITH→WAR');
    expect(faithWar).toHaveLength(1);
    expect(faithWar[0].read.split('#')[0]).toBe('src/domain/worldPulse/warTermination.js');
    expect(faithWar[0].counterforce.split('#')[0]).toBe('src/domain/worldPulse/warTermination.js');
    expect(faithWar[0].flags).toContain('faithUnseatingEnabled');
    // ⛔ A DECLARED RE-RECORD OF THIS JUSTIFICATION — COMMENT ONLY (WF-8a, ODQ §309 / §321.2a).
    // Every assertion below is unchanged and still true; only the reasoning is re-recorded, and
    // it is re-recorded because execution refuted half of it.
    //
    // WHAT STANDS. The Chronicle row is REFUSED for WF-1d's OWN kinds on a measurement that has
    // not moved: this member mints a receipt kind, not an impactKind, so `war_termination_read`
    // and the `patron_fall*` family earn no KIND_SECTION row. Both absences are asserted below.
    //
    // WHAT WAS WRONG. The old clause said such a row "would have no minter and nothing would red
    // on it". The second half was already false when it was written — a planted dead key reds
    // the KIND_SECTION minter check, which has existed since 1477c284 — and it is doubly false
    // now: WF-8a relocated that check into tests/lint/heraldRouting.walker.test.js and gave it a
    // written-ruling escape plus stale/orphan hygiene. A minter-less key reds there, and only
    // there. The refusal was right; the reason it gave was not the reason.
    //
    // ⭐ AND THE SETTLEMENT OBITUARY IS THE COUNTER-EXAMPLE, LAWFULLY. WF-8a lands
    // `faith_last_altar_dark` in KIND_SECTION WITH its live minter in the same commit — the
    // condition §321.2(a) always set for the row it refused. It collides with none of the
    // absences below, which is why this pin flips in JUSTIFICATION and not in assertion.
    const sectionKeys = Object.keys(KIND_SECTION);
    expect(sectionKeys).toContain('pantheon_extinction');
    expect(sectionKeys).not.toContain('war_termination_read'); // anchored: the pantheon_extinction membership asserted above proves KIND_SECTION loaded and carries the faith family, so this is a populated-table negative
    expect(sectionKeys.filter((key) => key.startsWith('patron_fall'))).toEqual([]);
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
      'attackerId', 'authoritySignature', 'believedBalanceBand', 'booksDirection',
      'booksInterest', 'booksPublicReason', 'booksReason', 'causeBand', 'causeState',
      'costToContinueBand', 'costToStopBand', 'decidingTerm', 'homeFrontBand',
      'homeFrontComponents', 'homeFrontDurationBand', 'id', 'kind',
      'momentumBand', 'momentumBroken', 'opponentAuthoritySignature',
      'opponentBelievedBalanceBand', 'opponentTruthBalanceBand', 'reason', 'rulerLawfulnessBand',
      'rulerMoralityBand', 'rulerSecurityBand', 'settlementIds', 'targetId',
      'tick', 'trajectory', 'trajectoryMisread', 'truthBalanceBand',
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

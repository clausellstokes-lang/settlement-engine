/** @vitest-environment node */
import { describe, expect, test } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════════
// F1 BETA GATE — THE PLAYER-SAFE VISIBILITY AUDIT (the headline gate).
//
// Proves NO player-facing / public / PDF surface that consumes the B-track read-
// models exposes gm/hidden/covert state:
//   - covert MOBILIZATION (a settlement secretly gearing for war)
//   - covert SMUGGLING (battlefield-enemy trade — the only tie that can exist)
// AND that every surface is HEURISTIC (no internals: no contest primitives,
// candidateBase, dispositionStats, war_drain, rng.fork, raw enum names, raw
// floats) AND SELF-GATES (a dormant settlement surfaces nothing).
//
// The display read-models are the SINGLE seam every surface (dossier / Realm /
// PDF / map) goes through, so auditing them + the PDF liveWorld view-model proves
// the property for every consumer (the components are thin renderers of these).
// ═══════════════════════════════════════════════════════════════════════════════

import {
  settlementMobilization,
  mobilizationStandings,
  hasLiveMobilization,
} from '../../../src/domain/display/mobilizationStatus.js';
import {
  deployedArmyStatus,
  deployedArmyStandings,
} from '../../../src/domain/display/armyStrength.js';
import {
  settlementOccupation,
  occupierHoldings,
  occupationStandings,
} from '../../../src/domain/display/occupationStatus.js';
import {
  settlementTradePressure,
} from '../../../src/domain/display/tradePressure.js';
import { buildPdfLiveWorld } from '../../../src/pdf/lib/liveWorld.js';
import { ensureRegionalGraph } from '../../../src/domain/region/index.js';

// Tokens that MUST NEVER appear in any player-facing surface string — engine
// internals, contest primitives, RNG forks, and the raw snake_case/camelCase ENUM
// + archetype identifiers (an enum leak would surface the underscored token; the
// DM prose uses natural English like "fully mobilized", which is allowed). We only
// forbid the UNAMBIGUOUS internal identifiers, never plain English words.
const FORBIDDEN_INTERNALS = [
  'dispositionStats', 'candidateBase', 'war_drain', 'contestOverThirdParty',
  'rng.fork', 'currentEffectiveStrength', 'accumulatedAttrition', 'supplyIntegrity',
  'benefitYield', 'feasibilityRatio', 'theoreticalCapacity', 'warLayerEnabled',
  // raw posture / occupation-state ENUM identifiers (underscored) must not leak.
  'war_preparation', 'war_exhaustion', 'occupation_resistance',
  'occupation_burden', 'war_spoils', 'OCCUPIER_BENEFIT_CONTAINMENT',
];

/** Recursively collect every string value in an object/array. */
function collectStrings(value, acc = []) {
  if (typeof value === 'string') acc.push(value);
  else if (Array.isArray(value)) value.forEach(v => collectStrings(v, acc));
  else if (value && typeof value === 'object') Object.values(value).forEach(v => collectStrings(v, acc));
  return acc;
}

/** Assert no forbidden internal token appears in any string of `surface`. */
function assertNoInternals(surface, label) {
  const strings = collectStrings(surface);
  for (const s of strings) {
    for (const bad of FORBIDDEN_INTERNALS) {
      expect(s, `${label}: surface string "${s}" leaked internal token "${bad}"`).not.toContain(bad);
    }
    // No bare floats (e.g. "0.42") in a player-facing heuristic surface.
    expect(s, `${label}: surface string "${s}" leaked a raw float`).not.toMatch(/\b0\.\d{2,}\b/);
  }
}

function save(id, name, patch = {}) {
  return {
    id,
    settlement: {
      id,
      name,
      tier: patch.tier || 'town',
      population: patch.population || 4000,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: {
        prosperity: 'Prosperous',
        primaryExports: patch.exports || [],
        primaryImports: patch.imports || [],
        ...(patch.foodSecurity ? { foodSecurity: patch.foodSecurity } : {}),
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      },
      activeConditions: [],
    },
  };
}

describe('VISIBILITY AUDIT — covert MOBILIZATION never leaks to a player view', () => {
  const worldState = {
    warPosture: {
      overt: { state: 'mobilized', progress: 1, sinceTick: 0, covert: false },
      secret: { state: 'war_preparation', progress: 0.5, sinceTick: 0, covert: true },
    },
  };

  test('a player view (includeCovert default false) never surfaces the covert mobilizer', () => {
    const playerStandings = mobilizationStandings({ worldState }); // default false
    expect(playerStandings.map(s => s.id)).toEqual(['overt']);
    expect(settlementMobilization({ settlementId: 'secret', worldState })).toBeNull();
    // The OVERT one is fine to surface — but in heuristic language only.
    assertNoInternals(playerStandings, 'player mobilization standings');
  });

  test('the GM view CAN see the covert mobilizer, flagged covert', () => {
    const gm = mobilizationStandings({ worldState, includeCovert: true });
    const secret = gm.find(s => s.id === 'secret');
    expect(secret).toBeTruthy();
    expect(secret.covert).toBe(true);
    // Even the GM surface stays heuristic (no enum / float leak).
    assertNoInternals(gm, 'gm mobilization standings');
  });

  test('hasLiveMobilization (player gate) is false for a covert-only world', () => {
    expect(hasLiveMobilization({ worldState: { warPosture: { x: { state: 'mobilized', covert: true } } } })).toBe(false);
  });
});

describe('VISIBILITY AUDIT — covert SMUGGLING never leaks to a player view', () => {
  const settlements = [
    save('warhawk', 'Warhawk', { imports: ['Iron'] }),
    save('forge', 'Forgeholt', { exports: ['Iron'] }),
  ];
  const regionalGraph = ensureRegionalGraph({
    edges: [{ id: 'eh', from: 'forge', to: 'warhawk', relationshipType: 'hostile' }],
    channels: [{ type: 'trade_dependency', from: 'forge', to: 'warhawk', status: 'confirmed', strength: 0.8, goods: [{ id: 'iron', label: 'Iron' }] }],
  });
  const worldState = { tick: 5, relationshipStates: { eh: { relationshipType: 'hostile' } } };

  test('a player view surfaces no covert smuggling tie', () => {
    const playerTies = settlementTradePressure({ settlementId: 'warhawk', regionalGraph, settlements, worldState, tick: 5, includeCovert: false, nameFor: (id) => id });
    expect(playerTies.every(t => t.covert !== true)).toBe(true);
    expect(playerTies.some(t => /smuggl/i.test(t.phrase))).toBe(false);
    assertNoInternals(playerTies, 'player trade pressure');
  });
});

describe('VISIBILITY AUDIT — PDF liveWorld is player-safe (covert excluded)', () => {
  test('the PDF view-model never carries covert mobilization or smuggling', () => {
    const settlements = [
      save('secret', 'Secrettown', { imports: ['Iron'] }),
      save('forge', 'Forgeholt', { exports: ['Iron'] }),
    ];
    const regionalGraph = ensureRegionalGraph({
      edges: [{ id: 'eh', from: 'forge', to: 'secret', relationshipType: 'hostile' }],
      channels: [{ type: 'trade_dependency', from: 'forge', to: 'secret', status: 'confirmed', strength: 0.8, goods: [{ id: 'iron', label: 'Iron' }] }],
    });
    const worldState = {
      tick: 5,
      relationshipStates: { eh: { relationshipType: 'hostile' } },
      // 'secret' is covertly mobilizing — must NOT appear in the PDF slice.
      warPosture: { secret: { state: 'war_preparation', progress: 0.5, sinceTick: 0, covert: true } },
    };
    const campaign = { worldState, regionalGraph, settlements, nameFor: (id) => id };
    const lw = buildPdfLiveWorld({ settlement: settlements[0].settlement, campaign });
    // The covert mobilizer must not surface in the PDF slice.
    expect(lw?.mobilization).toBeFalsy();
    // No covert smuggling tie in the PDF trade pressure.
    const tp = lw?.tradePressure || [];
    expect(tp.some(t => /smuggl/i.test(t.phrase))).toBe(false);
    if (lw) assertNoInternals(lw, 'pdf liveWorld');
  });
});

describe('VISIBILITY AUDIT — heuristic, no-internals across all surfaces', () => {
  const worldState = {
    warPosture: { a: { state: 'mobilized', progress: 1, sinceTick: 0 } },
    deployments: { a: { targetId: 'b', maxStartStrength: 100, currentEffectiveStrength: 42, supplyIntegrity: 0.3, morale: 0.4, foodReserve: 0.3 } },
    occupations: { c: { occupierId: 'a', state: 'contested', resistance: 0.7, sinceTick: 0 } },
  };
  const nameFor = (id) => `Town-${id}`;

  test('mobilization / army / occupation surfaces carry no internals or floats', () => {
    assertNoInternals(settlementMobilization({ settlementId: 'a', worldState }), 'mobilization');
    assertNoInternals(deployedArmyStatus({ settlementId: 'a', worldState, nameFor }), 'army');
    assertNoInternals(deployedArmyStandings({ worldState, nameFor }), 'army standings');
    assertNoInternals(settlementOccupation({ settlementId: 'c', worldState, nameFor }), 'occupation occupied');
    assertNoInternals(occupierHoldings({ settlementId: 'a', worldState, nameFor }), 'occupier holdings');
    assertNoInternals(occupationStandings({ worldState, nameFor }), 'occupation standings');
  });
});

describe('VISIBILITY AUDIT — self-gating (a dormant settlement surfaces nothing)', () => {
  test('every B-track surface is empty/null for a peaceful, non-campaign settlement', () => {
    const empty = {};
    expect(settlementMobilization({ settlementId: 'x', worldState: empty })).toBeNull();
    expect(mobilizationStandings({ worldState: empty })).toEqual([]);
    expect(deployedArmyStatus({ settlementId: 'x', worldState: empty })).toBeNull();
    expect(deployedArmyStandings({ worldState: empty })).toEqual([]);
    expect(settlementOccupation({ settlementId: 'x', worldState: empty })).toBeNull();
    expect(occupierHoldings({ settlementId: 'x', worldState: empty })).toBeNull();
    expect(occupationStandings({ worldState: empty })).toEqual([]);
    expect(settlementTradePressure({ settlementId: 'x', regionalGraph: null, settlements: [], worldState: empty })).toEqual([]);
    // PDF slice: no live state + no deity ⇒ null (byte-identical off-state).
    expect(buildPdfLiveWorld({ settlement: { id: 'x' }, campaign: null })).toBeNull();
  });
});

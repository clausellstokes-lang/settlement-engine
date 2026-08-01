/**
 * routeNetworkConsumersStrategic.test.js — W-J slice J4, THE GARRISON ASYMMETRY
 * (binding law docs/DESIGN_ROUTE_LIFECYCLE.md §7's asymmetry and §6's last sentence,
 * with DESIGN_REALM_DIRECTIVES.md J-D9 (l), and §1 Law 7).
 *
 * The claims this file is responsible for:
 *
 *   THE ASYMMETRY HOLDS END TO END, FROM A REAL WAR LEDGER. J3 pinned the floor by
 *   writing `strategicNeed` onto an edge by hand, which proved the ladder honoured a
 *   band and said nothing about whether anything would ever set one. Here the band
 *   comes from `worldState.deployments`, the war layer's own record, through the
 *   derivation, onto the ledger, and into the decay sweep. TRADE DIES AND THE ROAD
 *   HOLDS AT ROAD, across four hundred weeks of total silence.
 *
 *   THE NEGATIVE CONTROL IS THE FIXTURE. The same realm, the same silence, the same
 *   sweeps, with the deployment recalled: road, track, hidden.
 *
 *   A LAPSED NEED DROPS THE KEY. When the war ends the edge is BYTE-IDENTICAL to an
 *   edge that never had a need, which is what stops the garrison floor from outliving
 *   every war the realm ever fought.
 *
 *   NO FALSE BEATS. A regression pin for a defect this slice's wiring made reachable
 *   and then found: the ladder used to return `demote` for a step the grade writer
 *   then refused, so a garrisoned road minted a `route_demoted` Herald beat on every
 *   sweep while never moving. Measured at seven spurious beats over three hundred and
 *   twenty weeks before the fix; the pin holds it at zero.
 */
import { describe, expect, it } from 'vitest';
import {
  ROUTE_STRATEGIC_TUNING,
  STRATEGIC_SOURCES,
  applyStrategicNeeds,
  applyWarLayerRouteNeeds,
  deriveStrategicNeeds,
  isPersistedStrategicBand,
  strategicCharterNeeds,
} from '../../src/domain/worldPulse/routeNetworkConsumersStrategic.js';
import { flowMembersFromSnapshot } from '../../src/domain/worldPulse/routeNetworkFlows.js';
import { ensureGenesisRouteNetwork } from '../../src/domain/worldPulse/routeNetworkGenesis.js';
import { readRouteNetwork } from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { sweepRouteDecay } from '../../src/domain/worldPulse/routeNetworkDecay.js';
import {
  ROUTE_CHARTER_TUNING,
  applyRouteCharter,
  evaluateRouteCharters,
} from '../../src/domain/worldPulse/routeNetworkCharter.js';

const EDGE = 'route.ashfen.brackwater.land';

/**
 * A PAIR THAT WANTS NOTHING, on one genesis road. Two seats exporting the same good
 * and importing none, so the material objective is pure cost and neither the
 * objective gate nor the dual-benefit mercy can hold the road up. That is the fixture
 * the ladder's DOWN arm needs, and it is the same one J3's decay pins use.
 */
function barrenRealm(extra = {}) {
  const members = flowMembersFromSnapshot([
    {
      id: 'ashfen',
      settlement: {
        config: { tradeRouteAccess: 'crossroads' },
        economicState: { primaryImports: [], primaryExports: ['grain'] },
      },
    },
    {
      id: 'brackwater',
      settlement: {
        config: { tradeRouteAccess: 'road' },
        economicState: { primaryImports: [], primaryExports: ['grain'] },
      },
    },
  ]);
  const world = ensureGenesisRouteNetwork(
    { simulationRules: { routeLifecycleEnabled: true }, tick: 0, campaignId: 'j4-strategic' },
    members.map(m => ({ id: m.id, config: m.config })), 0,
  );
  return { world: { ...world, ...extra }, members };
}

/** @param {Record<string, unknown>} world @returns {string} */
function gradeOf(world) {
  const edges = readRouteNetwork(world);
  return edges ? String(edges.edges[EDGE].grade) : '';
}

/** @param {Record<string, unknown>} world @returns {unknown} */
function edgeOf(world) {
  const network = readRouteNetwork(world);
  return network ? network.edges[EDGE] : null;
}

/**
 * Sweep the ladder over a long silence and report what the Herald was told.
 * @param {Record<string, unknown>} world
 * @param {ReadonlyArray<unknown>} members
 */
function silence(world, members) {
  let current = world;
  /** @type {Array<Record<string, unknown>>} */
  const news = [];
  for (let tick = 0; tick <= 400; tick += 40) {
    const swept = sweepRouteDecay({
      worldState: current, members: /** @type {never} */ (members), tick,
    });
    current = swept.worldState;
    for (const item of swept.news) news.push(item);
  }
  return { world: current, news };
}

describe('J4 §7 the garrison asymmetry, end to end from the war layer own ledger', () => {
  it('a standing deployment writes the band onto the road it marches', () => {
    const { world } = barrenRealm({ deployments: { ashfen: { targetId: 'brackwater' } } });
    const needs = deriveStrategicNeeds({ worldState: world });
    expect(needs.length).toBe(1);
    expect(needs[0]).toEqual({
      a: 'ashfen',
      b: 'brackwater',
      band: 'garrison',
      byPowerRef: 'ashfen',
      source: 'deployment',
      edgeId: EDGE,
    });
    const applied = applyStrategicNeeds({ worldState: world, needs });
    expect(applied.written).toBe(1);
    expect(applied.cleared).toBe(0);
    expect([...applied.heldEdgeIds]).toEqual([EDGE]);
    expect(/** @type {Record<string, unknown>} */ (edgeOf(applied.worldState)).strategicNeed)
      .toBe('garrison');
  });

  it('TRADE DIES AND THE ROAD HOLDS: four hundred weeks of silence, still a road', () => {
    const { world, members } = barrenRealm({ deployments: { ashfen: { targetId: 'brackwater' } } });
    const armed = applyWarLayerRouteNeeds({ worldState: world, graph: null });
    const outcome = silence(armed.worldState, members);
    expect(gradeOf(outcome.world)).toBe('road');
  });

  it('THE NEGATIVE CONTROL: the same realm and the same silence with no army on it', () => {
    // One key of worldState differs from the pin above. Nothing else.
    const { world, members } = barrenRealm();
    const bare = applyWarLayerRouteNeeds({ worldState: world, graph: null });
    expect(bare.written).toBe(0);
    const outcome = silence(bare.worldState, members);
    expect(gradeOf(outcome.world)).toBe('hidden');
  });

  it('a garrisoned road mints NO grade-step beats, and its twin mints several', () => {
    // THE REGRESSION PIN for the defect J4 found: the ladder returned `demote` for a
    // step the grade writer refused, so the Herald was told a road fell every sweep
    // while it stayed exactly where it was. Seven beats, measured, before the fix.
    const armed = barrenRealm({ deployments: { ashfen: { targetId: 'brackwater' } } });
    const held = silence(
      applyWarLayerRouteNeeds({ worldState: armed.world, graph: null }).worldState,
      armed.members,
    );
    expect(held.news.length).toBe(0);
    expect(gradeOf(held.world)).toBe('road');

    const free = barrenRealm();
    const fell = silence(free.world, free.members);
    expect(fell.news.length).toBeGreaterThan(0);
    expect(fell.news.map(item => String(item.candidateType)).sort())
      .toEqual(['route_abandoned', 'route_demoted']);
  });

  it('the sweep that holds a garrisoned road steps nothing at all', () => {
    const { world, members } = barrenRealm({ deployments: { ashfen: { targetId: 'brackwater' } } });
    const armed = applyWarLayerRouteNeeds({ worldState: world, graph: null });
    const swept = sweepRouteDecay({
      worldState: armed.worldState, members: /** @type {never} */ (members), tick: 400,
    });
    expect(swept.stepped).toBe(0);
    expect(swept.changed).toBe(false);
    expect(swept.verdicts[0].verdict).toBe('garrison_floor');
    expect(swept.verdicts[0].to).toBe('road');
  });
});

describe('J4 §7 a lapsed need drops the key, so the floor cannot outlive its war', () => {
  it('the recalled deployment leaves an edge byte-identical to one that never had a need', () => {
    const { world } = barrenRealm({ deployments: { ashfen: { targetId: 'brackwater' } } });
    const armed = applyWarLayerRouteNeeds({ worldState: world, graph: null });
    expect(Object.keys(/** @type {Record<string, unknown>} */ (edgeOf(armed.worldState))))
      .toContain('strategicNeed');

    const peace = { ...armed.worldState, deployments: {} };
    const lifted = applyWarLayerRouteNeeds({ worldState: peace, graph: null });
    expect(lifted.cleared).toBe(1);
    expect(lifted.changed).toBe(true);

    // BYTE IDENTITY against the untouched realm, which is the whole point: an edge
    // whose war is over must serialize exactly like one that never had a war.
    const virgin = barrenRealm();
    expect(edgeOf(lifted.worldState)).toEqual(edgeOf(virgin.world));
    expect(JSON.parse(JSON.stringify(readRouteNetwork(lifted.worldState))))
      .toEqual(JSON.parse(JSON.stringify(readRouteNetwork(virgin.world))));
  });

  it('and the road resumes decaying the moment the key is gone', () => {
    const { world, members } = barrenRealm({ deployments: { ashfen: { targetId: 'brackwater' } } });
    const armed = applyWarLayerRouteNeeds({ worldState: world, graph: null });
    const held = silence(armed.worldState, members);
    expect(gradeOf(held.world)).toBe('road');

    const peace = { ...held.world, deployments: {} };
    const lifted = applyWarLayerRouteNeeds({ worldState: peace, graph: null });
    const after = silence(lifted.worldState, members);
    expect(gradeOf(after.world)).toBe('hidden');
  });

  it('applying the same needs twice moves nothing and returns the same reference', () => {
    const { world } = barrenRealm({ deployments: { ashfen: { targetId: 'brackwater' } } });
    const once = applyWarLayerRouteNeeds({ worldState: world, graph: null });
    const twice = applyWarLayerRouteNeeds({ worldState: once.worldState, graph: null });
    expect(twice.changed).toBe(false);
    expect(twice.written).toBe(0);
    expect(twice.cleared).toBe(0);
    expect(twice.worldState).toBe(once.worldState);
  });
});

describe('J4 §7 three sources, and the strongest need wins the road', () => {
  it('a live war front outranks the deployment on the same pair', () => {
    const { world } = barrenRealm({
      deployments: { ashfen: { targetId: 'brackwater' } },
    });
    const needs = deriveStrategicNeeds({
      worldState: world,
      graph: { channels: [{ type: 'war_front', status: 'confirmed', from: 'brackwater', to: 'ashfen' }] },
    });
    expect(needs.length).toBe(1);
    expect(needs[0].band).toBe('front');
    expect(needs[0].source).toBe('war_front');
    expect(needs[0].byPowerRef).toBe('brackwater');
  });

  it('an occupation is a garrison, read where the occupation layer keeps it', () => {
    const { world } = barrenRealm({
      occupations: { brackwater: { occupierId: 'ashfen', state: 'held' } },
    });
    const needs = deriveStrategicNeeds({ worldState: world });
    expect(needs.map(row => [row.band, row.source])).toEqual([['garrison', 'occupation']]);
  });

  it('a hostile-RELATIONSHIP front is not a siege and buys no road', () => {
    // The read goes through warFrontReads' own gate, so a channel that shares the
    // war_front shape without a war-layer provenance cannot mint a strategic need.
    const { world } = barrenRealm();
    const needs = deriveStrategicNeeds({
      worldState: world,
      graph: {
        channels: [{
          type: 'war_front',
          status: 'confirmed',
          from: 'brackwater',
          to: 'ashfen',
          evidence: [{ source: 'relationship_label' }],
        }],
      },
    });
    expect(needs).toEqual([]);
  });

  it('the source vocabulary is closed and every word this file produced is in it', () => {
    expect([...STRATEGIC_SOURCES].sort())
      .toEqual(['deployment', 'occupation', 'posture', 'war_front']);
  });
});

describe('J4 §7 watch is derived, read, and never persisted', () => {
  it('a mobilized seat watches the roads it HAS, and the ledger records nothing', () => {
    const { world } = barrenRealm({ warPosture: { ashfen: { state: 'mobilized' } } });
    const needs = deriveStrategicNeeds({ worldState: world });
    expect(needs.map(row => [row.band, row.source])).toEqual([['watch', 'posture']]);

    const applied = applyStrategicNeeds({ worldState: world, needs });
    expect(applied.written).toBe(0);
    expect(applied.changed).toBe(false);
    // Anchored by the pin above: the derivation DID produce a watch row for this
    // exact edge, so an absent key here is a refusal to persist and not an empty read.
    expect(Object.keys(/** @type {Record<string, unknown>} */ (edgeOf(applied.worldState))).sort())
      .toEqual(['a', 'b', 'charter', 'grade', 'mode', 'provenance']);
  });

  it('a calm realm watches nothing, so the posture arm is genuinely reading the state', () => {
    const { world } = barrenRealm({ warPosture: { ashfen: { state: 'peace' } } });
    expect(deriveStrategicNeeds({ worldState: world })).toEqual([]);
  });

  it('the persist bar is the band the floor and the charter already speak', () => {
    expect(String(ROUTE_STRATEGIC_TUNING.PERSIST_BAND))
      .toBe(String(ROUTE_CHARTER_TUNING.MILITARY_CHARTER_BAND));
    expect(isPersistedStrategicBand('watch')).toBe(false);
    expect(isPersistedStrategicBand('garrison')).toBe(true);
    expect(isPersistedStrategicBand('front')).toBe(true);
    expect(isPersistedStrategicBand('none')).toBe(false);
    expect(isPersistedStrategicBand('rumour_of_war')).toBe(false);
  });
});

describe('J4 §6 the military charter seam J3 declared and deferred', () => {
  it('a need on a pair no road serves becomes a charter row, and the charter lands', () => {
    const { world, members } = barrenRealm({
      deployments: { ashfen: { targetId: 'dunmoor' } },
    });
    const applied = applyWarLayerRouteNeeds({ worldState: world, graph: null });
    // The pair carries no edge, so nothing is persisted and the row is handed on.
    expect(applied.written).toBe(0);
    expect([...applied.charterNeeds]).toEqual([
      { a: 'ashfen', b: 'dunmoor', band: 'garrison', byPowerRef: 'ashfen' },
    ]);

    const swept = evaluateRouteCharters({
      worldState: applied.worldState,
      members: /** @type {never} */ (members),
      tick: 30,
      strategicNeeds: applied.charterNeeds,
    });
    const military = swept.verdicts.filter(v => v.flavor === 'military');
    expect(military.length).toBe(1);
    expect(military[0].verdict).toBe('charter');
    expect(military[0].dominantFlowClass).toBe('military');

    const built = applyRouteCharter({
      worldState: swept.worldState, verdict: military[0], tick: 30,
    });
    expect(built.changed).toBe(true);
    const edges = /** @type {Record<string, Record<string, unknown>>} */ (
      (readRouteNetwork(built.worldState) || { edges: {} }).edges);
    expect(edges['route.ashfen.dunmoor.land'].grade).toBe('track');
    expect(/** @type {Record<string, unknown>} */ (edges['route.ashfen.dunmoor.land'].charter).byPowerRef)
      .toBe('ashfen');
  });

  it('a below-band need buys nothing, so the charter bar is real', () => {
    const { world } = barrenRealm({ warPosture: { ashfen: { state: 'mobilized' } } });
    const applied = applyWarLayerRouteNeeds({ worldState: world, graph: null });
    expect([...applied.charterNeeds]).toEqual([]);
    expect(strategicCharterNeeds([
      { a: 'a', b: 'b', band: 'watch', byPowerRef: null, source: 'posture', edgeId: null },
    ])).toEqual([]);
  });

  it('a need on a pair a road ALREADY serves is not a charter row', () => {
    const { world } = barrenRealm({ deployments: { ashfen: { targetId: 'brackwater' } } });
    const applied = applyWarLayerRouteNeeds({ worldState: world, graph: null });
    expect([...applied.charterNeeds]).toEqual([]);
    expect(applied.written).toBe(1);
  });
});

describe('J4 Law 7 dormancy: a dark world derives no need and is untouched by identity', () => {
  it('the derivation is empty and the write returns the input reference', () => {
    const { world } = barrenRealm({ deployments: { ashfen: { targetId: 'brackwater' } } });
    const dark = { ...world, simulationRules: {} };
    expect(deriveStrategicNeeds({ worldState: dark })).toEqual([]);
    const applied = applyWarLayerRouteNeeds({ worldState: dark, graph: null });
    expect(applied.changed).toBe(false);
    expect(applied.worldState).toBe(dark);
    expect(applied.needs).toEqual([]);
    expect(applied.charterNeeds).toEqual([]);
  });

  it('a lit world with no route ledger at all is also a no-op by reference', () => {
    const bare = {
      simulationRules: { routeLifecycleEnabled: true },
      deployments: { ashfen: { targetId: 'brackwater' } },
    };
    const applied = applyWarLayerRouteNeeds({ worldState: bare, graph: null });
    expect(applied.changed).toBe(false);
    expect(applied.worldState).toBe(bare);
  });
});

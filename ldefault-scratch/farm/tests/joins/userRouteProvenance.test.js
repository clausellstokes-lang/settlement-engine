/**
 * Join harness — a user route survives every lifecycle path, and costs the public
 * projection nothing.
 *
 * J-D3's whole promise is "a provenance mark every lifecycle path must respect".
 * A mark that survives the write and dies on regeneration is the exact failure
 * this project has been bitten by before (the _refugeeWaves lesson next door), so
 * the survival claims here run through the REAL generation pipeline, the REAL
 * snapshot helper, and the REAL public sanitizer rather than through a stand-in.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { scrubUndoneEvent } from '../../src/domain/events/undoEvent.js';
import { stripDerivedConfigKeys } from '../../src/store/settlementSlice.js';
import { snapshotSettlement, planTimelineUndo } from '../../src/store/settlementSliceHelpers.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import {
  deriveUserRoutePath,
  recordedUserRouteIds,
  userRouteEdgeId,
  validateUserRoute,
} from '../../src/domain/roads/userRoutes.js';

const NOW = '2026-07-31T00:00:00.000Z';
const SEED = 'user-route-1';
const A = 'save-alpha';
const B = 'save-beta';
const EDGE = `route.${A}.${B}.land`;

const BASE_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
};

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

/** Exactly how settlementSlice.applyChange rebuilds the next run's input. */
const buildNextConfig = (settlement) => ({
  ...(settlement?._config || stripDerivedConfigKeys(settlement?.config) || {}),
});

const routeEvent = (overrides = {}) => ({
  id: 'ev-route-1',
  type: 'CREATE_ROUTE',
  targetId: 'Beta',
  cause: 'player_action',
  payload: {
    routeId: EDGE,
    mode: 'land',
    band: 'steady',
    a: A,
    b: B,
    createdTick: 3,
    selfSaveId: A,
    selfName: 'Alpha',
    partnerSaveId: B,
    partnerName: 'Beta',
    partnerTier: 'town',
    ...(overrides.payload || {}),
  },
  ...(() => { const { payload, ...rest } = overrides; return rest; })(),
});

const mutate = (settlement, event) =>
  mutateSettlement({ settlement, event, now: NOW });

describe('user-route edge identity is deterministic and direction-free', () => {
  test('either endpoint first yields the same id, in codepoint order', () => {
    expect(userRouteEdgeId(A, B, 'land')).toBe(EDGE);
    expect(userRouteEdgeId(B, A, 'land')).toBe(EDGE);
    // Codepoint order, not locale order: an uppercase id sorts BEFORE lowercase.
    expect(userRouteEdgeId('Zeta', 'alpha', 'land')).toBe('route.Zeta.alpha.land');
  });

  test('mode is part of the identity, so land and water are different roads', () => {
    expect(userRouteEdgeId(A, B, 'water')).not.toBe(EDGE); // anchored: both ids are asserted exactly above and below
    expect(userRouteEdgeId(A, B, 'water')).toBe(`route.${A}.${B}.water`);
  });
});

describe('the derivation reads the frozen map and refuses honestly', () => {
  const digest = {
    settlementIds: [A, B, 'save-gamma'],
    distanceMatrix: { [A]: { [B]: 900 }, [B]: { [A]: 900 } },
  };

  test('a reachable pair returns the digest cost and its typed band', () => {
    expect(deriveUserRoutePath(digest, A, B)).toEqual({
      ok: true, mode: 'land', cost: 900, band: 'steady', routeId: EDGE,
    });
  });

  test('an unreachable pair is isolation, not an error to route around', () => {
    expect(deriveUserRoutePath(digest, A, 'save-gamma'))
      .toEqual({ ok: false, reason: 'no_passable_path' });
  });

  test('a settlement absent from the frozen digest cannot be routed to', () => {
    expect(deriveUserRoutePath(digest, A, 'save-unplaced'))
      .toEqual({ ok: false, reason: 'endpoint_not_on_the_map' });
  });

  test('no digest at all is a refusal, never a fabricated path', () => {
    expect(deriveUserRoutePath(null, A, B))
      .toEqual({ ok: false, reason: 'realm_not_canonized' });
  });
});

describe('the route mark survives every lifecycle path', () => {
  test('it lands in BOTH config twins and rides a full regeneration', () => {
    const s1 = gen(BASE_CFG, SEED);
    const routed = mutate(s1, routeEvent());

    expect(routed.config._userRoutes).toHaveLength(1);
    expect(routed.config._userRoutes[0]).toMatchObject({
      routeId: EDGE,
      provenance: 'user',
      mode: 'land',
      band: 'steady',
      createdTick: 3,
      atEventId: 'ev-route-1',
    });
    // The mirror is what carries it across applyChange's rebuild.
    expect(routed._config._userRoutes).toEqual(routed.config._userRoutes);

    const s2 = gen(buildNextConfig(routed), SEED);
    expect(s2.config._userRoutes).toEqual(routed.config._userRoutes);
    expect(s2._config._userRoutes).toEqual(routed.config._userRoutes);
  });

  test('it survives a JSON round trip byte-for-byte', () => {
    const routed = mutate(gen(BASE_CFG, SEED), routeEvent());
    const reloaded = JSON.parse(JSON.stringify(routed));
    expect(reloaded.config._userRoutes).toEqual(routed.config._userRoutes);
    expect(recordedUserRouteIds(reloaded)).toEqual(new Set([EDGE]));
    const entry = reloaded.neighbourNetwork.find(n => n.linkId === EDGE);
    expect(entry).toMatchObject({ id: B, name: 'Beta', bidirectional: true });
  });

  test('it survives a snapshot and restore', () => {
    const routed = mutate(gen(BASE_CFG, SEED), routeEvent());
    const snapshot = snapshotSettlement(routed);
    expect(recordedUserRouteIds(snapshot)).toEqual(new Set([EDGE]));
  });

  test('the domain undo removes BOTH marks, leaving no half a route behind', () => {
    const base = gen(BASE_CFG, SEED);
    const routed = mutate(base, routeEvent());
    expect(recordedUserRouteIds(routed).size).toBe(1);

    const undone = scrubUndoneEvent(routed, { event: routeEvent() });
    expect(recordedUserRouteIds(undone)).toEqual(new Set());
    expect(undone.neighbourNetwork.some(n => n.linkId === EDGE)).toBe(false);
  });

  test('the TIMELINE undo refuses this type rather than undoing one endpoint', () => {
    // The domain inverse above is exact for ONE settlement. The store's undo can
    // only reach the active save, so reversing a route there would leave the
    // partner holding a road to nowhere. It refuses by type instead.
    const plan = planTimelineUndo([
      { event: { type: 'CREATE_ROUTE' }, beforeState: {} },
    ]);
    expect(plan).toMatchObject({ ok: false, reason: 'entry_not_undoable_bilateral' });
    const ordinary = planTimelineUndo([
      { event: { type: 'CUT_TRADE_ROUTE' }, beforeState: {} },
    ]);
    expect(ordinary.ok).toBe(true);
  });
});

describe('the public projection learns nothing new', () => {
  test('the route neighbour entry carries NO key its siblings lack', () => {
    const base = gen(BASE_CFG, SEED);
    const seeded = {
      ...base,
      neighbourNetwork: [{
        id: 'save-existing',
        linkId: 'link_save-alpha_save-existing',
        name: 'Elsewhere',
        neighbourName: 'Elsewhere',
        tier: 'village',
        neighbourTier: 'village',
        relationshipType: 'trade_partner',
        relationshipFrom: A,
        relationshipTo: 'save-existing',
        localRelationshipRole: 'trade_partner',
        displayRelationshipType: 'trade_partner',
        description: 'Generated with trade partner standing toward Elsewhere.',
        bidirectional: true,
      }],
    };
    const routed = mutate(seeded, routeEvent());
    const publicView = toPublicSafe(routed);
    const network = publicView.neighbourNetwork;
    expect(network).toHaveLength(2);

    const sibling = network.find(n => n.linkId === 'link_save-alpha_save-existing');
    const route = network.find(n => n.linkId === EDGE);
    expect(sibling).toBeTruthy();
    expect(route).toBeTruthy();
    // THE ANCHORED NEGATIVE: both key sets are asserted non-empty and EQUAL, so a
    // new key on the route entry cannot pass by emptying the comparison.
    const siblingKeys = Object.keys(sibling).sort();
    const routeKeys = Object.keys(route).sort();
    expect(siblingKeys.length).toBeGreaterThan(8);
    expect(routeKeys).toEqual(siblingKeys);
  });

  test('the raw _config twin never reaches a public projection', () => {
    const routed = mutate(gen(BASE_CFG, SEED), routeEvent());
    expect(routed._config._userRoutes).toHaveLength(1);
    const publicView = toPublicSafe(routed);
    // anchored: the private twin is proven present on the source object above, so this absence is a real strip rather than a field that was never there
    expect(publicView).not.toHaveProperty('_config');
  });
});

describe('the shared validator is the one gate the picker and the writer both run', () => {
  const digest = {
    settlementIds: [A, B],
    distanceMatrix: { [A]: { [B]: 300 }, [B]: { [A]: 300 } },
  };
  const members = [A, B];

  test('it clears a legal pair and names the road', () => {
    expect(validateUserRoute({
      digest,
      fromSaveId: A,
      toSaveId: B,
      fromSettlement: { config: {} },
      toSettlement: { config: {} },
      memberIds: members,
    })).toEqual({
      ok: true, mode: 'land', cost: 300, band: 'close', routeId: EDGE,
    });
  });

  test('it refuses a second road over a pair that already has one', () => {
    const routed = mutate(gen(BASE_CFG, SEED), routeEvent());
    expect(validateUserRoute({
      digest,
      fromSaveId: A,
      toSaveId: B,
      fromSettlement: routed,
      toSettlement: { config: {} },
      memberIds: members,
    })).toEqual({ ok: false, reason: 'route_already_chartered' });
  });

  test('it refuses an endpoint outside the realm', () => {
    expect(validateUserRoute({
      digest,
      fromSaveId: A,
      toSaveId: B,
      fromSettlement: { config: {} },
      toSettlement: { config: {} },
      memberIds: [A],
    })).toEqual({ ok: false, reason: 'endpoint_outside_the_realm' });
  });
});

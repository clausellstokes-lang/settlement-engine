/**
 * roadScenePlayerSafe.test.js — V-25a THE PLAYER-SAFE ROAD SCENE (§15 / the V-11 player-variant
 * precedent). composeRoadScenePlayerBrief is the inhabitant view of the road: legs + coarse
 * condition words + PUBLIC gate facts, and NOTHING of the DM-secret movement layer.
 *
 * The load-bearing pin is a DEEP SCAN of the serialized player brief against an EVERY-SECRET
 * world — the same payload-assertion discipline as roadsSecretsProbe / worldExport: redaction
 * means THE DATA DOES NOT SHIP, never a field/CSS check. Plus: the structural audience guard
 * (assembleBrief throws on a non-player-safe source), fail-closed on a COVERT war front, and a
 * non-vacuity check that ordinary public road content still comes through.
 */
import { describe, it, expect } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { composeRoadSceneBrief, composeRoadScenePlayerBrief } from '../../src/domain/briefs/roadScene.js';
import { SOURCE, bundleSources } from '../../src/domain/briefs/citations.js';

const IDS = ['a', 'b', 'c'];
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();
// TWO war fronts into 'b': a PUBLIC one (Xanthe) and a COVERT one (visibility 'gm', Zephyr).
const graph = ensureRegionalGraph({
  edges: [{ id: 'e.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }],
  channels: [
    { from: 'a', to: 'b', type: 'trade_route', status: 'confirmed', strength: 0.5 },
    { id: 'wf', from: 'x', to: 'b', type: 'war_front', status: 'confirmed', visibility: 'public' },
    { id: 'wfc', from: 'z', to: 'b', type: 'war_front', status: 'confirmed', visibility: 'gm' },
  ],
});
const settlements = [
  { id: 'a', name: 'Aldermoor' }, { id: 'b', name: 'Brackwater' }, { id: 'c', name: 'Corley' },
  { id: 'x', name: 'Xanthe' }, { id: 'z', name: 'Zephyr' },
];

// A world carrying EVERY secret movement carrier a roads-bearing campaign holds.
function everySecretWorld() {
  return {
    tick: 5, rngSeed: 's', calendar: { elapsedWeeks: 5, year: 1 },
    spatialCanonVersion: 1, spatialDigest: DIGEST,
    occupations: { b: { occupierId: 'x', state: 'extractive' } },
    spatialLedgers: {
      armyTransit: { 'x>b': { armyId: 'x', originId: 'x', destId: 'b', role: 'march', path: ['a', 'b'], departTick: 0, arrivalTick: 10, position01: 0.7 } },
      migration: { 'a:b:0': { originId: 'a', destId: 'b', arrivals: 40, departTick: 0, arrivalTick: 10 } },
      roads: {
        missions: { 'road.a.envoy.0': { npcKey: 'a:m', npcName: 'The Envoy', homeId: 'a', destId: 'b', path: ['a', 'b'], phase: 'outbound', purpose: { kind: 'diplomacy', ref: 'b' }, escort01: 1.3 } },
        ransoms: { 'ransom.road.a.lord.0': { npcKey: 'a:lord', captorId: 'x', termWeeks: 39, remainingWeeks: 20, willConvert: true, partyRelease: false } },
      },
      traditions: { b: [{ id: 'fest', scaleBand: 3, window: { startWeekOfYear: 6, weeks: 1 } }] },
    },
  };
}

// Every token that betrays the DM-secret movement/roads layer — must appear NOWHERE in the player brief.
const SECRET_TOKENS = ['armyTransit', 'position01', 'ransom', 'willConvert', 'partyRelease', 'purposeKind', 'road.a.', 'npcKey', 'escort01', 'diplomacy', 'Zephyr'];

describe('V-25a — the player-safe road scene never ships a DM secret', () => {
  const world = everySecretWorld();
  const player = composeRoadScenePlayerBrief({ originId: 'a', destId: 'b', worldState: world, settlements, regionalGraph: graph, tick: 5 });
  const serialized = JSON.stringify(player);

  it('composes audience "player", every section SOURCE.ROADS_PUBLIC (structural guard did not throw)', () => {
    expect(player.audience).toBe('player');
    expect(bundleSources(player)).toEqual([SOURCE.ROADS_PUBLIC]);
  });

  it('a deep scan of the serialized player brief finds ZERO movement/roads secret tokens', () => {
    for (const token of SECRET_TOKENS) {
      expect(serialized.includes(token), `secret token "${token}" leaked into the player road scene`).toBe(false);
    }
  });

  it('the DM composer over the SAME world DOES carry those secrets (the probe is not vacuous)', () => {
    const dm = JSON.stringify(composeRoadSceneBrief({ originId: 'a', destId: 'b', worldState: world, settlements, regionalGraph: graph, tick: 5 }));
    expect(dm.includes('Xanthe') || dm.includes('army')).toBe(true); // the movement layer is present for the DM
  });

  it('non-vacuity: the legs + PUBLIC gate facts survive (a coarse road still reads)', () => {
    const road = player.sections.find(s => s.id === 'road');
    const gates = player.sections.find(s => s.id === 'gates');
    expect(road.items[0].leg).toBe('Aldermoor → Brackwater');
    expect(road.items[0].danger).toBeUndefined(); // no numeric embattlement/tolls in the player lead
    // the PUBLIC siege + the visible garrison + the festival are inhabitant-knowledge
    expect(gates.items.some(g => g.state === 'under siege' && g.by === 'Xanthe')).toBe(true);
    expect(gates.items.some(g => g.state === 'occupied' && g.by === 'Xanthe')).toBe(true);
    expect(gates.items.some(g => g.state === 'a festival is on')).toBe(true);
  });

  it('FAIL-CLOSED: a covert (visibility:"gm") war front is NEVER named to the party', () => {
    const gates = player.sections.find(s => s.id === 'gates');
    const siege = gates.items.find(g => g.state === 'under siege');
    expect(siege.by).toBe('Xanthe'); // Zephyr (the covert aggressor) is absent
    expect(serialized.includes('Zephyr')).toBe(false);
  });
});

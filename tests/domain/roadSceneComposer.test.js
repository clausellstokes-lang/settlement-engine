/**
 * roadSceneComposer.test.js — THE ROAD SCENE composer (R-7; DESIGN_THE_ROADS §14). Pins the
 * three sections + sources, INERT-NOT-CRASH (a quiet realm → empty bundle), the ZERO-WRITE PIN
 * (worldState reference-equal), the citation law (every section sourced, audience dm), and
 * REGISTRY-DRIVEN purposes (a future purpose reads gracefully — per-purpose, never a count pin).
 */
import { describe, it, expect } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { composeRoadSceneBrief, composeRoadSceneChecked } from '../../src/domain/briefs/roadScene.js';
import { bundleCitationCoverage, bundleSources, SOURCE, isPlayerSafeSource, assembleBrief, section } from '../../src/domain/briefs/citations.js';

const IDS = ['a', 'b', 'c'];
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();
const graph = ensureRegionalGraph({
  edges: [{ id: 'e.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }],
  channels: [
    { from: 'a', to: 'b', type: 'trade_route', status: 'confirmed', strength: 0.5 },
    { id: 'wf', from: 'x', to: 'b', type: 'war_front', status: 'confirmed', visibility: 'public' },
  ],
});
const settlements = [
  { id: 'a', name: 'Aldermoor' }, { id: 'b', name: 'Brackwater' }, { id: 'c', name: 'Corley' }, { id: 'x', name: 'Xanthe' },
];

function warShapedWorld(missionOverrides = {}) {
  return {
    tick: 5, rngSeed: 's', calendar: { elapsedWeeks: 5, year: 1 },
    spatialCanonVersion: 1, spatialDigest: DIGEST,
    occupations: { b: { occupierId: 'x', state: 'extractive' } },
    spatialLedgers: {
      armyTransit: { 'x>b': { armyId: 'x', originId: 'x', destId: 'b', role: 'march', path: ['a', 'b'], departTick: 0, arrivalTick: 10, position01: 0 } },
      migration: { 'a:b:0': { originId: 'a', destId: 'b', arrivals: 40, departTick: 0, arrivalTick: 10 } },
      roads: { missions: { 'road.a.a:m.0': { npcKey: 'a:m', npcName: 'The Envoy', homeId: 'a', destId: 'b', path: ['a', 'b'], phase: 'outbound', purpose: { kind: 'trade', ref: 'b' }, escort01: 1.3, ...missionOverrides } } },
      traditions: { b: [{ id: 'fest', scaleBand: 3, window: { startWeekOfYear: 6, weeks: 1 } }] }, // active at weekOfYear 6 (elapsedWeeks 5)
    },
  };
}

describe('roadScene composer — the three sections (§14)', () => {
  const brief = composeRoadSceneBrief({ originId: 'a', destId: 'b', worldState: warShapedWorld(), settlements, regionalGraph: graph, tick: 5 });
  const byId = Object.fromEntries(brief.sections.map(s => [s.id, s]));

  it('a war-shaped world composes all three sections, every one sourced ROADS_TRUTH / audience dm', () => {
    expect(brief.audience).toBe('dm');
    expect(brief.sections.map(s => s.id).sort()).toEqual(['gates', 'onRoad', 'road']);
    for (const s of brief.sections) expect(s.source).toBe(SOURCE.ROADS_TRUTH);
    expect(bundleCitationCoverage(brief)).toBe(1);
    expect(bundleSources(brief)).toEqual([SOURCE.ROADS_TRUTH]);
  });

  it('ROADS_TRUTH is DM-ONLY — a player bundle can never carry it (§15 structural guard)', () => {
    expect(isPlayerSafeSource(SOURCE.ROADS_TRUTH)).toBe(false);
    expect(() => assembleBrief({ kind: 'roadScene', audience: 'player', sections: [section('road', 'R', SOURCE.ROADS_TRUTH, [{ x: 1 }])] })).toThrow();
  });

  it('THE ROAD lists the leg + per-hop conditions', () => {
    const road = byId.road.items;
    expect(road[0].leg).toBe('Aldermoor → Brackwater');
    expect(road.some(i => i.at === 'Brackwater')).toBe(true);
  });

  it('ON THE ROAD carries the army (on route), the migrant column (+reason), and the envoy (+purpose+escort)', () => {
    const on = byId.onRoad.items;
    expect(on.find(i => i.kind === 'army')?.banner).toBe('Xanthe');
    const mig = on.find(i => i.kind === 'migrants');
    expect(mig.from).toBe('Aldermoor'); expect(mig.to).toBe('Brackwater');
    expect(typeof mig.reason).toBe('string'); expect(mig.reason.length).toBeGreaterThan(0);
    const envoy = on.find(i => i.kind === 'envoy');
    expect(envoy.npc).toBe('The Envoy'); expect(envoy.purpose).toBe('trade business'); expect(envoy.escort).toBe('a strong escort');
  });

  it('AT THE GATES carries occupation, siege, and the festival guest-right note', () => {
    const gates = byId.gates.items;
    expect(gates.find(g => g.state === 'occupied')?.by).toBe('Xanthe');
    expect(gates.find(g => g.state === 'under siege')?.by).toBe('Xanthe');
    expect(gates.find(g => g.state === 'a festival is on')?.guestRight).toMatch(/guest-right/);
  });
});

describe('roadScene composer — INERT-NOT-CRASH + zero-write (§14)', () => {
  it('an aspatial / quiet realm yields an EMPTY bundle, never a throw', () => {
    expect(composeRoadSceneBrief({ originId: 'a', destId: 'b', worldState: {}, settlements }).sections).toEqual([]);
    expect(composeRoadSceneBrief({}).sections).toEqual([]);
    expect(composeRoadSceneBrief(undefined).sections).toEqual([]);
  });

  it('a valid route with no traffic yields only THE ROAD (empty ON THE ROAD + GATES dropped)', () => {
    const quiet = { tick: 1, calendar: { elapsedWeeks: 1 }, spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: {} };
    const brief = composeRoadSceneBrief({ originId: 'a', destId: 'b', worldState: quiet, settlements, regionalGraph: { channels: [] }, tick: 1 });
    expect(brief.sections.map(s => s.id)).toEqual(['road']);
  });

  it('THE ZERO-WRITE PIN: compose leaves worldState reference-equal', () => {
    const ws = warShapedWorld();
    const { wrote } = composeRoadSceneChecked({ originId: 'a', destId: 'b', worldState: ws, settlements, regionalGraph: graph, tick: 5 });
    expect(wrote).toBe(false);
  });
});

describe('roadScene composer — REGISTRY-DRIVEN purposes (R-8-safe; no count pin)', () => {
  it('a KNOWN purpose reads its label; an UNKNOWN (future) purpose reads gracefully', () => {
    const known = composeRoadSceneBrief({ originId: 'a', destId: 'b', worldState: warShapedWorld({ purpose: { kind: 'diplomacy', ref: 'b' } }), settlements, regionalGraph: graph, tick: 5 });
    expect(known.sections.find(s => s.id === 'onRoad').items.find(i => i.kind === 'envoy').purpose).toBe('a diplomatic errand');
    // A purpose kind THIS wave does not know (an R-8 embassy purpose) must not crash or blank —
    // it degrades to a generic label. This pins per-purpose behavior, never the purpose LIST.
    const future = composeRoadSceneBrief({ originId: 'a', destId: 'b', worldState: warShapedWorld({ purpose: { kind: 'peace_embassy', ref: 'b' } }), settlements, regionalGraph: graph, tick: 5 });
    expect(future.sections.find(s => s.id === 'onRoad').items.find(i => i.kind === 'envoy').purpose).toBe('peace_embassy business');
  });
});

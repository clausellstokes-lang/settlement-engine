/**
 * memoryWeaveGhostEvents.test.js — DEEP COUPLINGS D-7b pins (design §10.5).
 *
 * THE GHOST EVENTS: a rite imposition (traditions/relations.js) finally leaves a
 * DECAYING grievance mark on the overlord↔vassal edge, minted through the plane's
 * ONE writer (applyRelationshipPatch) as a typed rite_imposed incident. Gated on
 * the host's flag (traditionsEnabled) AND memoryWeaveEnabled, so a lit-traditions /
 * weave-dark world is byte-identical on the relationship plane. Plus the memory-weave
 * core (the flag, the pair→edge-key resolver, the sanctioned incident applicator).
 *
 * route_seized (the seizer↔victim roads capture) is a POST-ROADS-FOLD seam: its host
 * event is on the unfolded roads branch, so the applicator is ready (mintMemoryWeaveIncident
 * + the ROUTE_SEIZED type) but wired at the roads capture site when roads folds.
 */
import { describe, it, expect } from 'vitest';
import {
  memoryWeaveActive, mintMemoryWeaveIncident, edgeKeyBetween, MEMORY_WEAVE_INCIDENT_TYPES,
} from '../../src/domain/worldPulse/relationshipEvolution.js';
import { advanceRelations } from '../../src/domain/traditions/relations.js';
import { advanceTraditions } from '../../src/domain/worldPulse/traditionsKernel.js';

const NOW = '2026-01-01T00:00:00.000Z';

describe('D-7b memory-weave core — the flag, the key resolver, the applicator', () => {
  it('memoryWeaveActive reads the virtual flag defensively (absent ⇒ dark)', () => {
    expect(memoryWeaveActive(null)).toBe(false);
    expect(memoryWeaveActive({})).toBe(false);
    expect(memoryWeaveActive({ simulationRules: {} })).toBe(false);
    expect(memoryWeaveActive({ simulationRules: { memoryWeaveEnabled: false } })).toBe(false);
    expect(memoryWeaveActive({ simulationRules: { memoryWeaveEnabled: true } })).toBe(true);
  });
  it('edgeKeyBetween finds the pair edge in either orientation, null when absent', () => {
    const edges = [{ id: 'rel.o.v', from: 'o', to: 'v' }, { id: 'rel.x.y', from: 'x', to: 'y' }];
    expect(edgeKeyBetween(edges, 'o', 'v')).toBe('rel.o.v');
    expect(edgeKeyBetween(edges, 'v', 'o')).toBe('rel.o.v'); // undirected
    expect(edgeKeyBetween(edges, 'o', 'z')).toBe(null);
    expect(edgeKeyBetween(null, 'o', 'v')).toBe(null);
  });
  it('mintMemoryWeaveIncident writes ONLY through applyRelationshipPatch (a typed incident + clamped patch)', () => {
    const ws = { tick: 20, relationshipStates: { 'rel.o.v': { resentment: 0.2, recentIncidents: [] } } };
    const next = mintMemoryWeaveIncident(ws, {
      relationshipKey: 'rel.o.v', incidentType: MEMORY_WEAVE_INCIDENT_TYPES.RITE_IMPOSED,
      patch: { resentment: 0.5 }, severity: 0.35, id: 'x',
    }, NOW);
    const edge = next.relationshipStates['rel.o.v'];
    expect(edge.resentment).toBe(0.5);
    expect(edge.recentIncidents.at(-1)).toMatchObject({ type: 'rite_imposed', tick: 20 });
    // no key / no patch ⇒ byte-safe no-op (same ref)
    expect(mintMemoryWeaveIncident(ws, { relationshipKey: null, incidentType: 'x', patch: { resentment: 1 } }, NOW)).toBe(ws);
    expect(mintMemoryWeaveIncident(ws, { relationshipKey: 'rel.o.v', incidentType: 'x', patch: null }, NOW)).toBe(ws);
  });
});

describe('D-7b advanceRelations surfaces the imposition (imposedOverlordId)', () => {
  const makeRec = (o = {}) => ({
    id: o.id, coreMotif: o.coreMotif || { element: 'e', act: 'a' }, name: o.name || 'R', foundedYear: 1,
    window: { startWeekOfYear: 10, weeks: 1 }, scaleBand: o.scaleBand ?? 3, ownerKey: null, ownerKind: null,
    ownerLabel: null, deityRef: null, expression: { trappings: [], epithet: '' }, mutationLog: [],
    lastHeldYear: null, lastOutcome: null, suppressedBy: null, adoptedFrom: o.adoptedFrom ?? null,
  });
  const localSet = () => [makeRec({ id: 't.v.0', scaleBand: 3 }), makeRec({ id: 't.v.1', scaleBand: 2 })];
  const overlordSet = () => [makeRec({ id: 't.o.0', name: 'Imperial', scaleBand: 5 })];
  const traditionsOf = (m) => (sid) => m[sid] || null;
  const vassalWorld = (seed) => ({ rngSeed: seed, occupations: { v: { occupierId: 'o', state: 'vassalized' } } });

  it('reports the overlord id EXACTLY when a rite is imposed this tick, null otherwise', () => {
    // Find a firing seed (IMPOSE_CHANCE is a private dial — behavioural pin).
    let imposedSeed = null;
    for (let i = 0; i < 3000 && !imposedSeed; i += 1) {
      const out = advanceRelations({ recs: localSet(), worldState: vassalWorld(`s${i}`), sid: 'v', year: 5, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ o: overlordSet() }) });
      if (out.imposedOverlordId) imposedSeed = `s${i}`;
    }
    expect(imposedSeed).toBeTruthy();
    const fired = advanceRelations({ recs: localSet(), worldState: { ...vassalWorld(imposedSeed) }, sid: 'v', year: 5, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ o: overlordSet() }) });
    expect(fired.imposedOverlordId).toBe('o');
    expect(fired.changed).toBe(true);
    // Not vassalized ⇒ never surfaces an overlord.
    const notOccupied = advanceRelations({ recs: localSet(), worldState: { rngSeed: imposedSeed }, sid: 'v', year: 5, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ o: overlordSet() }) });
    expect(notOccupied.imposedOverlordId).toBe(null);
  });
});

describe('D-7b mover integration — the rite_imposed grievance mark (lit) vs byte-identical (dark)', () => {
  const makeRec = (o = {}) => ({
    id: o.id, coreMotif: o.coreMotif || { element: 'e', act: 'a' }, name: o.name || 'R', foundedYear: 1,
    window: o.window || { startWeekOfYear: 40, weeks: 1 }, scaleBand: o.scaleBand ?? 3, ownerKey: null,
    ownerKind: null, ownerLabel: null, deityRef: null, expression: { trappings: [], epithet: '' },
    mutationLog: [], lastHeldYear: null, lastOutcome: null, suppressedBy: null, adoptedFrom: o.adoptedFrom ?? null,
  });
  const vassalSet = () => [makeRec({ id: 't.v.0', name: 'Founding', scaleBand: 3 }), makeRec({ id: 't.v.1', name: 'Local Fair', scaleBand: 2 })];
  const overlordSet = () => [makeRec({ id: 't.o.0', name: 'Imperial Procession', scaleBand: 5 })];

  /** Build a lit-traditions world (overlord o vassalizes v; edge rel.o.v). memoryWeaveEnabled togglable. */
  function world(seed, weave) {
    const vs = { name: 'Vassalton', tier: 'town', population: 4000, economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 50 }, factions: [] }, activeConditions: [], traditions: vassalSet() };
    const os = { name: 'Overlordia', tier: 'city', population: 9000, economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 60 }, factions: [] }, activeConditions: [], traditions: overlordSet() };
    const snapshot = {
      settlements: [{ id: 'o', name: 'Overlordia', settlement: os }, { id: 'v', name: 'Vassalton', settlement: vs }],
      regionalGraph: { edges: [{ id: 'rel.o.v', from: 'o', to: 'v' }] },
    };
    const rules = { traditionsEnabled: true };
    if (weave) rules.memoryWeaveEnabled = true;
    const worldState = {
      rngSeed: seed, tick: 10, calendar: { elapsedWeeks: 9 }, simulationRules: rules, stressors: [],
      occupations: { v: { occupierId: 'o', state: 'vassalized' } },
      spatialLedgers: { traditions: { o: overlordSet(), v: vassalSet() } },
      relationshipStates: {},
    };
    return { snapshot, worldState, updates: [{ saveId: 'o', settlement: os }, { saveId: 'v', settlement: vs }] };
  }

  /** Scan for a seed that imposes through the mover (checks the persisted vassal ledger). */
  function firingSeed() {
    for (let i = 0; i < 3000; i += 1) {
      const seed = `mv${i}`;
      const { snapshot, worldState, updates } = world(seed, true);
      const res = advanceTraditions({ snapshot, worldState, settlementUpdates: updates, tick: 10, now: NOW });
      const v = res.worldState?.spatialLedgers?.traditions?.v || [];
      if (v.some((r) => String(r.id).endsWith('::imposed'))) return seed;
    }
    throw new Error('no firing seed found');
  }

  it('LIT: an imposition mints a rite_imposed incident on the overlord↔vassal edge (resentment up, decade-clock typed)', () => {
    const seed = firingSeed();
    const { snapshot, worldState, updates } = world(seed, true);
    const res = advanceTraditions({ snapshot, worldState, settlementUpdates: updates, tick: 10, now: NOW });
    const edge = res.worldState.relationshipStates['rel.o.v'];
    expect(edge).toBeTruthy();
    const inc = edge.recentIncidents.at(-1);
    expect(inc.type).toBe('rite_imposed');
    expect(inc.tick).toBe(10);
    expect(edge.resentment).toBeGreaterThan(0); // the vassal resents the trade
  });

  it('DARK weave (lit traditions, memoryWeave absent): the same imposition leaves the relationship plane BYTE-IDENTICAL', () => {
    const seed = firingSeed();
    const { snapshot, worldState, updates } = world(seed, false);
    const res = advanceTraditions({ snapshot, worldState, settlementUpdates: updates, tick: 10, now: NOW });
    // The traditions ledger still imposes (host behaviour unchanged)…
    const v = res.worldState.spatialLedgers.traditions.v;
    expect(v.some((r) => String(r.id).endsWith('::imposed'))).toBe(true);
    // …but NO relationship incident is minted (the weave gate held): plane byte-identical to input {}.
    expect(JSON.stringify(res.worldState.relationshipStates || {})).toBe('{}');
  });
});

/**
 * traditionsRelations.test.js — THE TRADITIONS relations (ENGINE LIFT #4, T-4).
 *
 * T4-a (this block): §8 IMPOSITION / SUPPRESSION / RESTORATION — the occupation ledger is the
 * ONE authority; a vassalized settlement may be forced (a seeded per-year chance) to TRADE a
 * non-founding rite for its overlord's; the traded rite is SUPPRESSED (never deleted, never
 * moved — the founding core at index 0 is immutable); and it RETURNS intact when the
 * vassalization ends (a liberation festival from pure mechanics). Unit pins on the pure leaf
 * (advanceRelations) + a mover-integration pin (a suppressed rite does not occur).
 *
 * T4-b (adoption + the aspatial dormancy proofs) lives lower in this file / in the dormancy golden.
 */
import { describe, it, expect } from 'vitest';
import { advanceRelations } from '../../src/domain/traditions/relations.js';
import { advanceTraditions } from '../../src/domain/worldPulse/traditionsKernel.js';

const NOW = '2026-01-01T00:00:00.000Z';
const SID = 'a';

/** A complete TraditionRec with a controllable motif / scale / suppression. */
function makeRec(o = {}) {
  return {
    id: o.id || 'tradition.vassal.0',
    coreMotif: o.coreMotif || { element: 'harvest', act: 'feast' },
    name: o.name || 'The Harvest Feast',
    foundedYear: o.foundedYear ?? 1,
    window: o.window || { startWeekOfYear: 10, weeks: 1 },
    scaleBand: o.scaleBand ?? 3,
    ownerKey: o.ownerKey ?? null,
    ownerKind: o.ownerKind ?? null,
    ownerLabel: o.ownerLabel ?? null,
    deityRef: o.deityRef ?? null,
    expression: o.expression || { trappings: ['long tables set in the square'], epithet: 'kept since the first furrow' },
    mutationLog: o.mutationLog || [],
    lastHeldYear: o.lastHeldYear ?? null,
    lastOutcome: o.lastOutcome ?? null,
    suppressedBy: o.suppressedBy ?? null,
    adoptedFrom: o.adoptedFrom ?? null,
  };
}

/** A founding-core + one non-founding local set (the imposition victim is the non-founding one). */
const localSet = () => [
  makeRec({ id: 'tradition.vassal.0', coreMotif: { element: 'founding', act: 'feast' }, name: 'The Founding Feast', scaleBand: 3 }),
  makeRec({ id: 'tradition.vassal.1', coreMotif: { element: 'harvest', act: 'fair' }, name: 'The Harvest Fair', scaleBand: 2 }),
];
/** The overlord's grand rite (its highest-scale, the one imposed). */
const overlordSet = () => [
  makeRec({ id: 'tradition.overlord.0', coreMotif: { element: 'founding', act: 'procession' }, name: 'The Imperial Procession', scaleBand: 5, expression: { trappings: ['the banners of every quarter'], epithet: 'the overlord’s pomp' } }),
];

const vassalWorld = (rngSeed, overlordId = 'overlord', state = 'vassalized') => ({
  rngSeed,
  occupations: { [SID]: { occupierId: overlordId, state } },
});
const traditionsOf = (map) => (sid) => map[sid] || null;

/** Scan seeds until imposition fires (or not) — IMPOSE_CHANCE is a private dial, so pin behaviorally. */
function findSeed(want, { recs = localSet(), world = null, resolver = traditionsOf({ overlord: overlordSet() }), year = 5 } = {}) {
  for (let i = 0; i < 2000; i += 1) {
    const seed = `imp-${i}`;
    const w = world ? { ...world, rngSeed: seed } : vassalWorld(seed);
    const out = advanceRelations({ recs, settlement: {}, worldState: w, sid: SID, year, localTierBand: 3, minted: false, traditionsOf: resolver });
    const imposed = out.recs.some((r) => String(r.id).endsWith('::imposed'));
    if (imposed === want) return seed;
  }
  throw new Error(`no seed produced imposition=${want}`);
}

describe('§8 IMPOSITION — a vassalized settlement trades a rite for the overlord’s', () => {
  it('imposes the overlord’s top rite and SUPPRESSES a non-founding local rite (founding core untouched)', () => {
    const seed = findSeed(true);
    const recs = localSet();
    const out = advanceRelations({
      recs, settlement: {}, worldState: vassalWorld(seed), sid: SID, year: 5, localTierBand: 3, minted: false,
      traditionsOf: traditionsOf({ overlord: overlordSet() }),
    });
    expect(out.changed).toBe(true);
    // The founding core (index 0) is immutable — never suppressed, never moved.
    expect(out.recs[0].id).toBe('tradition.vassal.0');
    expect(out.recs[0].suppressedBy).toBe(null);
    // The non-founding local rite is SUPPRESSED (not deleted): suppressedBy {overlordId, sinceYear, traded}.
    const victim = out.recs.find((r) => r.id === 'tradition.vassal.1');
    expect(victim.suppressedBy).toMatchObject({ overlordId: 'overlord', sinceYear: 5 });
    expect(victim.suppressedBy.traded.id).toBe('tradition.vassal.1::imposed');
    expect(victim.mutationLog.at(-1)).toMatchObject({ year: 5, kind: 'imposition' });
    // The imposed copy carries the overlord's motif/expression + adoptedFrom, a LOCAL id, capped scale.
    const imposed = out.recs.find((r) => r.id === 'tradition.vassal.1::imposed');
    expect(imposed.adoptedFrom).toBe('overlord');
    expect(imposed.coreMotif).toEqual({ element: 'founding', act: 'procession' });
    expect(imposed.name).toBe('The Imperial Procession');
    expect(imposed.scaleBand).toBe(3); // min(overlord 5, localTierBand 3)
    expect(imposed.suppressedBy).toBe(null);
    expect(imposed.mutationLog[0]).toMatchObject({ kind: 'imposition' });
  });

  it('does NOT impose when the settlement is not vassalized (occupation absent or a lower state)', () => {
    const seed = findSeed(true);
    const notOccupied = advanceRelations({ recs: localSet(), settlement: {}, worldState: { rngSeed: seed }, sid: SID, year: 5, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ overlord: overlordSet() }) });
    expect(notOccupied.changed).toBe(false);
    const stabilized = advanceRelations({ recs: localSet(), settlement: {}, worldState: vassalWorld(seed, 'overlord', 'stabilized'), sid: SID, year: 5, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ overlord: overlordSet() }) });
    expect(stabilized.changed).toBe(false);
  });

  it('does NOT impose when only the immutable founding core exists (nothing to trade)', () => {
    const seed = findSeed(true); // a seed that DOES impose on a normal two-rite set
    const out = advanceRelations({ recs: [localSet()[0]], settlement: {}, worldState: vassalWorld(seed), sid: SID, year: 5, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ overlord: overlordSet() }) });
    expect(out.changed).toBe(false);
  });

  it('is idempotent — a second tick under the SAME overlord does not re-impose', () => {
    const seed = findSeed(true);
    const first = advanceRelations({ recs: localSet(), settlement: {}, worldState: vassalWorld(seed), sid: SID, year: 5, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ overlord: overlordSet() }) });
    expect(first.changed).toBe(true);
    const second = advanceRelations({ recs: first.recs, settlement: {}, worldState: vassalWorld(seed), sid: SID, year: 6, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ overlord: overlordSet() }) });
    expect(second.changed).toBe(false);
  });

  it('does NOT impose when the overlord has no traditions to lend', () => {
    const seed = findSeed(true);
    const out = advanceRelations({ recs: localSet(), settlement: {}, worldState: vassalWorld(seed), sid: SID, year: 5, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ overlord: [] }) });
    expect(out.changed).toBe(false);
  });

  it('a freshly-minted set is a NO-OP (relations begin the tick after the mint)', () => {
    const seed = findSeed(true);
    const recs = localSet();
    const out = advanceRelations({ recs, settlement: {}, worldState: vassalWorld(seed), sid: SID, year: 5, localTierBand: 3, minted: true, traditionsOf: traditionsOf({ overlord: overlordSet() }) });
    expect(out.changed).toBe(false);
    expect(out.recs).toBe(recs);
  });
});

describe('§8 LIBERATION / RESTORATION — the suppressed rite returns when the occupation ends', () => {
  /** Build an imposed+suppressed set (year 5, overlord). */
  function occupiedSet() {
    const seed = findSeed(true);
    return advanceRelations({ recs: localSet(), settlement: {}, worldState: vassalWorld(seed), sid: SID, year: 5, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ overlord: overlordSet() }) }).recs;
  }

  it('clears suppressedBy, stamps a restoration row, and removes the imposed copy when liberated', () => {
    const occupied = occupiedSet();
    expect(occupied.find((r) => r.id === 'tradition.vassal.1').suppressedBy).not.toBe(null);
    // Occupation is GONE (no occupations ledger) ⇒ liberation.
    const out = advanceRelations({ recs: occupied, settlement: {}, worldState: { rngSeed: 'x' }, sid: SID, year: 9, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ overlord: overlordSet() }) });
    expect(out.changed).toBe(true);
    const restored = out.recs.find((r) => r.id === 'tradition.vassal.1');
    expect(restored.suppressedBy).toBe(null);
    expect(restored.mutationLog.at(-1)).toMatchObject({ year: 9, kind: 'restoration' });
    // The imposed copy is gone; the founding core still leads.
    expect(out.recs.some((r) => String(r.id).endsWith('::imposed'))).toBe(false);
    expect(out.recs[0].id).toBe('tradition.vassal.0');
  });

  it('a DROP below vassalized (occupation stabilized/contested) also liberates', () => {
    const occupied = occupiedSet();
    const out = advanceRelations({ recs: occupied, settlement: {}, worldState: vassalWorld('x', 'overlord', 'contested'), sid: SID, year: 9, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ overlord: overlordSet() }) });
    expect(out.changed).toBe(true);
    expect(out.recs.find((r) => r.id === 'tradition.vassal.1').suppressedBy).toBe(null);
  });

  it('does NOT restore while the SAME overlord still holds it vassalized', () => {
    const occupied = occupiedSet();
    const out = advanceRelations({ recs: occupied, settlement: {}, worldState: vassalWorld('x', 'overlord', 'vassalized'), sid: SID, year: 9, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ overlord: overlordSet() }) });
    // Still suppressed (and idempotent — no re-imposition).
    expect(out.recs.find((r) => r.id === 'tradition.vassal.1').suppressedBy).not.toBe(null);
  });

  it('a NEW overlord liberates the old rite before its own imposition can land', () => {
    const occupied = occupiedSet();
    // A different overlord now holds it — the old suppression is no longer in force.
    const out = advanceRelations({ recs: occupied, settlement: {}, worldState: vassalWorld('x', 'other_overlord', 'vassalized'), sid: SID, year: 9, localTierBand: 3, minted: false, traditionsOf: traditionsOf({ overlord: overlordSet(), other_overlord: overlordSet() }) });
    const restored = out.recs.find((r) => r.id === 'tradition.vassal.1');
    expect(restored.suppressedBy === null || restored.suppressedBy.overlordId === 'other_overlord').toBe(true);
  });
});

describe('§8 mover integration — a suppressed rite does not occur', () => {
  it('through advanceTraditions: an occupied town suppresses a rite that then does not resolve an outcome', () => {
    // A pre-suppressed local set (the imposition already happened a prior tick) carried into the mover.
    const suppressedVictim = makeRec({
      id: 'tradition.vassal.1', coreMotif: { element: 'harvest', act: 'fair' }, name: 'The Harvest Fair',
      window: { startWeekOfYear: 10, weeks: 1 }, scaleBand: 2,
      suppressedBy: { overlordId: 'overlord', sinceYear: 3, traded: { id: 'tradition.vassal.1::imposed' } },
    });
    const founding = makeRec({ id: 'tradition.vassal.0', coreMotif: { element: 'founding', act: 'feast' }, name: 'The Founding Feast', window: { startWeekOfYear: 40, weeks: 1 }, scaleBand: 3 });
    const recs = [founding, suppressedVictim];
    const s = {
      name: 'Vassalton', tier: 'town', population: 4000,
      economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 50 }, factions: [] }, activeConditions: [],
      traditions: recs,
    };
    const snapshot = { settlements: [{ id: SID, name: 'Vassalton', settlement: s }] };
    const worldState = {
      rngSeed: 'mv', tick: 10, calendar: { elapsedWeeks: 9 }, // week 10, year 1 — the Fair's window is open
      simulationRules: { traditionsEnabled: true }, stressors: [],
      occupations: { [SID]: { occupierId: 'overlord', state: 'vassalized' } },
      spatialLedgers: { traditions: { [SID]: recs } },
    };
    const res = advanceTraditions({ snapshot, worldState, settlementUpdates: [{ saveId: SID, settlement: s }], tick: 10, now: NOW });
    const ledger = res.worldState?.spatialLedgers?.traditions?.[SID] || recs;
    const victim = ledger.find((r) => r.id === 'tradition.vassal.1');
    // The suppressed Fair did NOT resolve an outcome (its window was open, but it is traded away).
    expect(victim.lastHeldYear).toBe(null);
    expect(victim.lastOutcome).toBe(null);
    expect(victim.suppressedBy).not.toBe(null);
  });
});

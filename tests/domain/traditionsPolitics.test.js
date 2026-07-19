/**
 * traditionsPolitics.test.js — THE TRADITIONS politics (ENGINE LIFT #4, T-3).
 *
 * T3-a (this block): OWNERSHIP ASSIGNMENT at mint by motif-fit (§6 — the founding core to
 * the SEAT via governingFactionOf on the REAL `.faction` shape; fair/market to merchant/craft;
 * offering/vigil to a religious power; contest to the military; a fallback to the seat, or
 * unowned when there is no seat) + OWNER-TARGETED effect routing (seat = full legitimacy weight;
 * a faction/institution owner = half weight + the news NAMES them).
 *
 * T3-b (the reassignment/mutation block) lives lower in this file.
 */
import { describe, it, expect } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  assignOwnership, factionOwnerKey, institutionOwnerKey, halfWeightHit, routedLegitimacyHit,
} from '../../src/domain/traditions/politics.js';
import {
  advanceTraditions, successScore, outcomeForDraw, TRADITION_OUTCOME,
} from '../../src/domain/worldPulse/traditionsKernel.js';

const NOW = '2026-01-01T00:00:00.000Z';
const SID = 'a';

/** A complete TraditionRec with a controllable motif / owner / scale. */
function makeRec(o = {}) {
  return {
    id: o.id || 'tradition.politon.0',
    coreMotif: o.coreMotif || { element: 'harvest', act: 'feast' },
    name: o.name || 'The Harvest Feast',
    foundedYear: o.foundedYear ?? 1,
    window: o.window || { startWeekOfYear: 10, weeks: 1 },
    scaleBand: o.scaleBand ?? 4,
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

/** A settlement with a real multi-power structure (factions carry `.faction`, not `.name`). */
function politicalTown(o = {}) {
  return {
    _seed: o.seed || 'politon-seed',
    name: 'Politon', tier: o.tier || 'city', population: o.population ?? 12000,
    config: o.config || {},
    institutions: o.institutions || [{ name: 'High Temple', category: 'religious', status: 'active' }],
    economicState: { prosperity: o.prosperity || 'Comfortable' },
    powerStructure: {
      publicLegitimacy: { score: o.legit ?? 55 },
      factions: o.factions || [
        { faction: 'The Lord Mayor', isGoverning: true, category: 'government', power: 55 },
        { faction: "Merchants' Guild", category: 'merchant', power: 40 },
        { faction: 'City Watch', category: 'military', power: 35 },
      ],
    },
    activeConditions: o.activeConditions || [],
  };
}

/** Run ONE traditions tick over a pre-seeded ledger (owners preserved — not minted). */
function runTick({ settlement, recs, rngSeed = 's', weeks = 9, tick = 10 }) {
  const s = { ...settlement, traditions: recs };
  const snapshot = { settlements: [{ id: SID, name: s.name || 'Town', settlement: s }] };
  const worldState = {
    rngSeed, tick,
    calendar: { elapsedWeeks: weeks },
    simulationRules: { traditionsEnabled: true },
    stressors: [],
    spatialLedgers: { traditions: { [SID]: recs } },
  };
  const settlementUpdates = [{ saveId: SID, settlement: s }];
  const res = advanceTraditions({ snapshot, worldState, settlementUpdates, tick, now: NOW });
  return {
    res,
    ledger: res.worldState?.spatialLedgers?.traditions?.[SID],
    updated: res.settlementUpdates.find((u) => String(u.saveId) === SID)?.settlement,
    news: res.newsEntries,
  };
}

/** Find an rngSeed whose (score, draw) resolves the given outcome for a rec/settlement. */
function findSeed(wantOutcome, rec, settlement, year = 1) {
  for (let i = 0; i < 800; i += 1) {
    const rngSeed = `seek-${i}`;
    const score = successScore({ rec, settlement, worldState: { rngSeed }, sid: SID, year, warTypes: new Set() });
    const r = createPRNG(`${rngSeed}::tradition:${rec.id}:${year}`).random();
    if (outcomeForDraw(score, r) === wantOutcome) return rngSeed;
  }
  throw new Error(`no seed produced ${wantOutcome}`);
}

describe('T3-a §6 assignOwnership — motif-fit assignment on the REAL faction shape', () => {
  const town = politicalTown();
  const recs = [
    makeRec({ id: 't.0', coreMotif: { element: 'founding', act: 'feast' } }),   // origin → seat
    makeRec({ id: 't.1', coreMotif: { element: 'market', act: 'fair' } }),       // fair → merchant
    makeRec({ id: 't.2', coreMotif: { element: 'the-dead', act: 'offering' } }), // devotional → religious
    makeRec({ id: 't.3', coreMotif: { element: 'harvest', act: 'contest' } }),   // contest → military
  ];
  const owned = assignOwnership(recs, town);

  it('the founding core is held by the SEAT (governingFactionOf), keyed on `.faction`', () => {
    expect(owned[0].ownerKind).toBe('seat');
    expect(owned[0].ownerKey).toBe(factionOwnerKey({ faction: 'The Lord Mayor' }));
    expect(owned[0].ownerLabel).toBe('The Lord Mayor');
  });
  it('a fair goes to the merchant faction', () => {
    expect(owned[1].ownerKind).toBe('faction');
    expect(owned[1].ownerKey).toBe(factionOwnerKey({ faction: "Merchants' Guild" }));
    expect(owned[1].ownerLabel).toBe("Merchants' Guild");
  });
  it('a devotional observance goes to a religious power — here the temple institution', () => {
    expect(owned[2].ownerKind).toBe('institution');
    expect(owned[2].ownerKey).toBe(institutionOwnerKey('High Temple'));
    expect(owned[2].ownerLabel).toBe('High Temple');
  });
  it('a contest goes to the military faction', () => {
    expect(owned[3].ownerKind).toBe('faction');
    expect(owned[3].ownerKey).toBe(factionOwnerKey({ faction: 'City Watch' }));
  });
  it('no matching power ⇒ the record falls to the seat', () => {
    // A merchantless town: the fair has no commerce power ⇒ seat.
    const noMerch = politicalTown({ factions: [{ faction: 'The Council', isGoverning: true, category: 'government' }] });
    const [core, fair] = assignOwnership(
      [makeRec({ id: 'x.0', coreMotif: { element: 'founding', act: 'feast' } }),
        makeRec({ id: 'x.1', coreMotif: { element: 'market', act: 'fair' } })],
      { ...noMerch, institutions: [] },
    );
    expect(core.ownerKind).toBe('seat');
    expect(fair.ownerKind).toBe('seat');
  });
  it('no ruling seat ⇒ the record is left UNOWNED (interim, full-weight routing)', () => {
    const seatless = politicalTown({ factions: [] });
    const [core] = assignOwnership([makeRec({ id: 'y.0', coreMotif: { element: 'founding', act: 'feast' } })], { ...seatless, institutions: [] });
    expect(core.ownerKey).toBeNull();
    expect(core.ownerKind).toBeNull();
  });
  it('assignment is deterministic (same settlement ⇒ same owners)', () => {
    const a = JSON.stringify(assignOwnership(recs, town));
    const b = JSON.stringify(assignOwnership(recs, town));
    expect(a).toBe(b);
  });
});

describe('T3-a §6 halfWeightHit / routedLegitimacyHit — the owner-weight map', () => {
  it('halves away from zero so a ±1 hit never vanishes', () => {
    expect(halfWeightHit(3)).toBe(2);
    expect(halfWeightHit(1)).toBe(1);
    expect(halfWeightHit(-1)).toBe(-1);
    expect(halfWeightHit(-3)).toBe(-2);
    expect(halfWeightHit(0)).toBe(0);
  });
  it('routes seat/unowned at full weight, faction/institution at half', () => {
    expect(routedLegitimacyHit(3, 'seat')).toBe(3);
    expect(routedLegitimacyHit(3, null)).toBe(3);
    expect(routedLegitimacyHit(3, 'faction')).toBe(2);
    expect(routedLegitimacyHit(-3, 'institution')).toBe(-2);
  });
});

describe('T3-a §6 owner-targeted routing — end to end through the mover', () => {
  it('a SEAT-owned triumph lands the FULL +3 legitimacy on the town', () => {
    const rec = makeRec({ id: 'seat.0', scaleBand: 4, ownerKind: 'seat', ownerKey: 'fac.lord', ownerLabel: 'The Lord Mayor' });
    const settlement = politicalTown({ legit: 55 });
    const seed = findSeed(TRADITION_OUTCOME.TRIUMPH, rec, settlement);
    const out = runTick({ settlement, recs: [rec], rngSeed: seed });
    expect(out.ledger[0].lastOutcome).toBe(TRADITION_OUTCOME.TRIUMPH);
    expect(out.updated.powerStructure.publicLegitimacy.score).toBe(58); // 55 + 3
  });
  it('a FACTION-owned triumph lands HALF (+2) legitimacy and NAMES the owner in the news', () => {
    const rec = makeRec({ id: 'fac.0', scaleBand: 4, ownerKind: 'faction', ownerKey: 'fac.guild', ownerLabel: "Merchants' Guild" });
    const settlement = politicalTown({ legit: 55 });
    const seed = findSeed(TRADITION_OUTCOME.TRIUMPH, rec, settlement);
    const out = runTick({ settlement, recs: [rec], rngSeed: seed });
    expect(out.ledger[0].lastOutcome).toBe(TRADITION_OUTCOME.TRIUMPH);
    expect(out.updated.powerStructure.publicLegitimacy.score).toBe(57); // 55 + halfWeight(3)=2
    expect(out.news[0].summary).toContain("Merchants' Guild");
  });
  it('a FACTION-owned failure lands HALF (−2) legitimacy', () => {
    const rec = makeRec({ id: 'fac.1', scaleBand: 4, ownerKind: 'faction', ownerKey: 'fac.guild', ownerLabel: "Merchants' Guild" });
    const settlement = politicalTown({ legit: 55 });
    const seed = findSeed(TRADITION_OUTCOME.FAILURE, rec, settlement);
    const out = runTick({ settlement, recs: [rec], rngSeed: seed });
    expect(out.ledger[0].lastOutcome).toBe(TRADITION_OUTCOME.FAILURE);
    expect(out.updated.powerStructure.publicLegitimacy.score).toBe(53); // 55 + halfWeight(-3)=-2
  });
});

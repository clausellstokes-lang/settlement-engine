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
  advancePolitics, assignOwnership, factionOwnerKey, institutionOwnerKey, halfWeightHit, routedLegitimacyHit,
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

// ── T3-b: reassignment checkpoints + §7 mutations ────────────────────────────────
const WS = { rngSeed: 's' };
const advance = (recs, settlement, year, extra = {}) =>
  advancePolitics({ recs, settlement, worldState: { ...WS, ...extra }, sid: SID, year, minted: false });

/** The founding-core seat record (index 0), owned by the OLD seat. */
function seatCore(oldSeatName = 'The Old Council') {
  return makeRec({
    id: 't.core', coreMotif: { element: 'founding', act: 'feast' }, scaleBand: 4,
    ownerKind: 'seat', ownerKey: factionOwnerKey({ faction: oldSeatName }), ownerLabel: oldSeatName,
  });
}
/** A settlement whose seat now sits with `governing`, after a transfer of the given cause. */
function afterTransfer(o = {}) {
  return {
    _seed: 'coup-seed', tier: o.tier || 'city', population: o.population ?? 12000,
    config: o.config || {}, institutions: o.institutions || [],
    economicState: { prosperity: 'Comfortable' },
    powerStructure: {
      publicLegitimacy: { score: 40 },
      governingName: o.governing || 'The New Junta',
      factions: o.factions || [{ faction: o.governing || 'The New Junta', isGoverning: true, category: 'military' }],
      previousGovernments: o.previousGovernments || [{ label: 'The Old Council', cause: o.cause || 'coup', tick: 5 }],
    },
  };
}

describe('T3-b §6 reassignment — a power transfer re-anchors the seat', () => {
  it('a seat-owned record FOLLOWS the new seat + logs a reassignment naming the cause', () => {
    const recs = [seatCore()];
    const { recs: out, changed } = advance(recs, afterTransfer({ governing: 'The New Junta', cause: 'coup' }), 30);
    expect(changed).toBe(true);
    expect(out[0].ownerKey).toBe(factionOwnerKey({ faction: 'The New Junta' }));
    expect(out[0].ownerKind).toBe('seat');
    expect(out[0].ownerLabel).toBe('The New Junta');
    const log = out[0].mutationLog;
    expect(log[log.length - 1].kind).toBe('reassignment');
    expect(log[log.length - 1].cause).toContain('coup');
    // §7 re-dress: the expression changed, the CORE MOTIF + NAME did not.
    expect(out[0].coreMotif).toEqual(recs[0].coreMotif);
    expect(out[0].name).toBe(recs[0].name);
  });

  it('the ascendant regime may CLAIM a faction-owned record (seeded); the seat rec signals the change', () => {
    const fair = makeRec({ id: 't.fair', coreMotif: { element: 'market', act: 'fair' }, ownerKind: 'faction', ownerKey: 'fac.merchants', ownerLabel: 'Guild' });
    const settlement = afterTransfer({ governing: 'The New Junta' });
    // Search a year where the claim roll fires (seeded ~35%).
    let claimed = null;
    for (let y = 10; y < 220 && !claimed; y += 1) {
      const { recs: out } = advance([seatCore(), fair], settlement, y);
      if (out[1].ownerKind === 'seat') claimed = out[1];
    }
    expect(claimed, 'a claim should occur within 210 years').not.toBeNull();
    expect(claimed.ownerKey).toBe(factionOwnerKey({ faction: 'The New Junta' }));
    expect(claimed.mutationLog[claimed.mutationLog.length - 1].kind).toBe('reassignment');
  });

  it('a vanished institution ORPHANS its record to the seat', () => {
    const rite = makeRec({ id: 't.rite', coreMotif: { element: 'the-dead', act: 'offering' }, ownerKind: 'institution', ownerKey: institutionOwnerKey('Old Shrine'), ownerLabel: 'Old Shrine' });
    // Roster no longer carries the shrine; the seat holds (no transfer ⇒ core stays put).
    const settlement = afterTransfer({ governing: 'The Old Council', previousGovernments: [], institutions: [{ name: 'Town Hall', category: 'civic' }] });
    const { recs: out, changed } = advance([seatCore('The Old Council'), rite], settlement, 30);
    expect(changed).toBe(true);
    expect(out[1].ownerKind).toBe('seat');
    expect(out[1].ownerKey).toBe(factionOwnerKey({ faction: 'The Old Council' }));
    expect(out[1].mutationLog[out[1].mutationLog.length - 1].cause).toContain('keeper is gone');
  });
});

describe('T3-b §7 re-dedication — a new patron re-dedicates devotional records', () => {
  const settlement = () => ({
    _seed: 'faith', tier: 'city', population: 12000,
    config: { primaryDeitySnapshot: { _deityRef: 'deity.new' } },
    institutions: [], economicState: { prosperity: 'Comfortable' },
    powerStructure: { publicLegitimacy: { score: 55 }, factions: [] },
  });
  it('a devotional record follows a KNOWN new patron', () => {
    const rite = makeRec({ id: 't.rite', coreMotif: { element: 'stars', act: 'vigil' }, deityRef: 'deity.old' });
    const { recs: out, changed } = advance([rite], settlement(), 40);
    expect(changed).toBe(true);
    expect(out[0].deityRef).toBe('deity.new');
    expect(out[0].mutationLog[out[0].mutationLog.length - 1].kind).toBe('rededication');
  });
  it('an ABSENT patron never re-dedicates (a valid dedication is not erased)', () => {
    const rite = makeRec({ id: 't.rite', coreMotif: { element: 'stars', act: 'vigil' }, deityRef: 'deity.old' });
    const noPatron = { ...settlement(), config: {} };
    const { recs: out, changed } = advance([rite], noPatron, 40);
    expect(changed).toBe(false);
    expect(out[0].deityRef).toBe('deity.old');
  });
});

describe('T3-b §7 scale-up — a real tier crossing lifts grandeur one band', () => {
  it('a settlement that outgrew its records steps every scaleBand up one, logging scale-up', () => {
    const core = makeRec({ id: 't.core', coreMotif: { element: 'founding', act: 'feast' }, scaleBand: 3 }); // sensor: town-scale
    const add = makeRec({ id: 't.add', coreMotif: { element: 'harvest', act: 'feast' }, scaleBand: 2 });
    const cityNow = { _seed: 'grow', tier: 'city', population: 12000, config: {}, institutions: [], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] } };
    const { recs: out, changed } = advance([core, add], cityNow, 40); // curTier city = 4 > core scaleBand 3
    expect(changed).toBe(true);
    expect(out[0].scaleBand).toBe(4); // 3 → 4 (re-synced to the tier)
    expect(out[1].scaleBand).toBe(3); // 2 → 3 (steps up alongside, stays below the core)
    expect(out[0].mutationLog[out[0].mutationLog.length - 1].kind).toBe('scale-up');
  });
});

describe('T3-b §6 fabric turn — a district-anchored record re-anchors on the quarter turning', () => {
  it('a fair record re-anchors when the fabric leader turns; the core carries the sensor', () => {
    const core = { ...makeRec({ id: 't.core', coreMotif: { element: 'founding', act: 'feast' }, scaleBand: 4, ownerKind: 'seat' }), fabricLed: 'temple' };
    const fair = makeRec({ id: 't.fair', coreMotif: { element: 'market', act: 'fair' }, scaleBand: 4, ownerKind: 'faction', ownerKey: 'fac.g', ownerLabel: 'Guild' });
    const settlement = { _seed: 'fab', tier: 'city', population: 12000, config: {}, institutions: [], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] } };
    const world = { rngSeed: 's', spatialLedgers: { urbanFabric: { [SID]: { led: 'market' } } } };
    const { recs: out, changed } = advancePolitics({ recs: [core, fair], settlement, worldState: world, sid: SID, year: 40, minted: false });
    expect(changed).toBe(true);
    expect(out[1].mutationLog[out[1].mutationLog.length - 1].kind).toBe('reanchor'); // the fair re-anchored
    expect(out[0].fabricLed).toBe('market'); // the core's sensor refreshed to the new leader
    expect(out[0].mutationLog.some((m) => m.kind === 'reanchor')).toBe(false); // the core (not a quarter) never re-anchors
  });
});

describe('T3-b §7 generational drift + hysteresis', () => {
  const quietTown = { _seed: 'quiet', tier: 'city', population: 12000, config: {}, institutions: [], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] } };
  it('drift eventually reshapes a record (~30-year cadence) and re-dresses its expression', () => {
    const rec = makeRec({ id: 't.drift', coreMotif: { element: 'harvest', act: 'feast' }, scaleBand: 4 });
    let drifted = null;
    for (let y = 8; y < 120 && !drifted; y += 1) {
      const { recs: out } = advance([rec], quietTown, y);
      if (out[0].mutationLog.some((m) => m.kind === 'drift')) drifted = { y, rec: out[0] };
    }
    expect(drifted, 'a drift should land within the first century').not.toBeNull();
    expect(JSON.stringify(drifted.rec.expression)).not.toBe(JSON.stringify(rec.expression));
    expect(drifted.rec.coreMotif).toEqual(rec.coreMotif); // motif immutable
  });
  it('hysteresis blocks a second SLOW mutation within 8 years', () => {
    const rec = makeRec({ id: 't.drift', coreMotif: { element: 'harvest', act: 'feast' }, mutationLog: [{ year: 40, kind: 'drift', cause: 'x' }] });
    // A year that would be drift-due but sits within 8 years of the logged mutation.
    let blocked = true;
    for (let y = 41; y < 48; y += 1) {
      const { changed } = advance([rec], quietTown, y);
      if (changed) blocked = false;
    }
    expect(blocked).toBe(true);
  });
});

describe('T3-b idempotency + cap', () => {
  it('a quiet settlement produces NO mutation (same ref, changed=false)', () => {
    const core = seatCore('The Council');
    const settlement = { _seed: 'q', tier: 'city', population: 12000, config: {}, institutions: [], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, governingName: 'The Council', factions: [{ faction: 'The Council', isGoverning: true, category: 'government' }], previousGovernments: [] } };
    const recs = [core];
    const { recs: out, changed } = advance(recs, settlement, 5); // year < drift-min, owner matches seat
    expect(changed).toBe(false);
    expect(out).toBe(recs); // byte-stable carry (same array ref)
  });
  it('CAP: a record eligible for two checkpoints logs exactly ONE mutation this tick', () => {
    // A seat-owned record on a seat change that is ALSO drift-eligible ⇒ reassignment wins, once.
    const core = seatCore('The Old Council');
    const settlement = afterTransfer({ governing: 'The New Junta', cause: 'conquest' });
    // Find a year that is both a transfer tick and drift-due — reassignment (structural) precedes.
    const { recs: out } = advance([core], settlement, 60);
    const added = out[0].mutationLog.filter((m) => m.year === 60);
    expect(added.length).toBe(1);
    expect(added[0].kind).toBe('reassignment');
  });
});

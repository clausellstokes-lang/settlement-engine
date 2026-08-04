/**
 * tests/domain/settlementPoliticsPins.test.js — W-DOCTRINE-4 SETTLEMENT POLITICS
 * mechanistic pins (DESIGN_SETTLEMENT_POLITICS §7). Drives the mover directly (the
 * corruptionWebPins template) so each behavior is isolated and deterministic.
 *
 * The §7 pin set: byte-identity dormant; cap enforcement; the glue typology twin
 * (succession dissolves people-held NOT seat-held); exposure shatters compromise glue;
 * THE LEADER-RIVALRY BLOCK (interests-align + leaders-hostile ⇒ no formation; warm ⇒
 * forms); differential-strain → revanchism; ruling-bloc loading clamped + receipted; the
 * divided-court→corruption-cheap consolidation read.
 */
import { describe, it, expect } from 'vitest';
import {
  advanceSettlementPolitics,
  settlementPoliticsActive,
  settlementBlocs,
  rulingBlocOf,
  coalitionConsolidation01,
  blocDecisionFactor,
  factionRevanchism01,
  leaderAlignmentKinship,
  SETTLEMENT_POLITICS_TUNING,
} from '../../src/domain/worldPulse/settlementPolitics.js';
import { recruitmentWeight } from '../../src/domain/worldPulse/corruptionWeb.js';

// A stub rng whose forks always draw `u` — pass 0.01 to FIRE the E0 formation gate
// deterministically, 0.99 to always DEFER.
const rngThatDraws = (u) => ({ fork: () => ({ random: () => u }) });

/** Build a faction state entry. */
function fac(settlementId, name, archetype, leaderNpcId, leaderName, extra = {}) {
  return {
    settlementId, name, archetype,
    internalSeats: { leader_champion: leaderNpcId ? { npcId: leaderNpcId, name: leaderName, dotRank: 3 } : null },
    rivals: [], memberNpcIds: leaderNpcId ? [leaderNpcId] : [], captureState: 'none',
    ...extra,
  };
}

/** Build a minimal worldState + snapshot for one settlement `S1`. */
function world({ factions, rosterFactions, relationships = [], npcStates = {}, rules = {}, treaties = null }) {
  const factionStates = {};
  for (const f of factions) factionStates[`S1:${stablePart(f.name)}`] = f;
  const worldState = {
    simulationRules: { settlementPoliticsEnabled: true, factionCompetitionEnabled: true, ...rules },
    factionStates,
    npcStates,
    ...(treaties ? { spatialLedgers: { treaties } } : {}),
  };
  const snapshot = {
    settlements: [{
      id: 'S1',
      settlement: { powerStructure: { factions: rosterFactions }, relationships },
    }],
  };
  return { worldState, snapshot };
}

// Local stablePart mirror (the module's slug) so fixture keys match the mover's.
function stablePart(value) {
  return String(value || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80) || 'unknown';
}

// Drive N ticks, threading worldState forward (the pulse loop, in miniature).
function drive(worldState, snapshot, ticks, u = 0.01) {
  let ws = worldState;
  const allReceipts = [];
  for (let t = 0; t < ticks; t += 1) {
    // Snapshot must reflect the advancing worldState's factionStates for the roster join,
    // but the roster/relationships are static in these fixtures.
    const res = advanceSettlementPolitics({ snapshot, worldState: ws, rng: rngThatDraws(u), tick: t });
    ws = res.worldState;
    allReceipts.push(...res.receipts);
  }
  return { worldState: ws, receipts: allReceipts };
}

const MERCHANT_CRAFT = () => ({
  factions: [
    fac('S1', 'Merchant League', 'merchant', 'S1:npc_1', 'Alda'),
    fac('S1', 'Craft Guild', 'craft', 'S1:npc_2', 'Boro'),
  ],
  rosterFactions: [
    { faction: 'Merchant League', power: 40, isGoverning: true },
    { faction: 'Craft Guild', power: 35 },
  ],
});

describe('settlement politics — dormancy (byte-identity)', () => {
  it('gate absent ⇒ the mover is an immediate no-op (no fork, no ledger, byte-identical)', () => {
    const { worldState, snapshot } = world({ ...MERCHANT_CRAFT(), rules: { settlementPoliticsEnabled: false } });
    const before = JSON.stringify(worldState);
    const res = advanceSettlementPolitics({ worldState, snapshot, rng: rngThatDraws(0.01), tick: 0 });
    expect(res.changed).toBe(false);
    expect(res.worldState).toBe(worldState); // same identity
    expect(JSON.stringify(res.worldState)).toBe(before);
    expect(res.worldState.politicsLedgers).toBeUndefined();
  });

  it('flag on but faction substrate off ⇒ still dormant', () => {
    const { worldState, snapshot } = world({ ...MERCHANT_CRAFT(), rules: { factionCompetitionEnabled: false } });
    expect(settlementPoliticsActive(worldState)).toBe(false);
    const res = advanceSettlementPolitics({ worldState, snapshot, rng: rngThatDraws(0.01), tick: 0 });
    expect(res.changed).toBe(false);
    expect(res.worldState.politicsLedgers).toBeUndefined();
  });
});

describe('settlement politics — formation (who CAN × who DOES)', () => {
  it('two structurally-aligned factions with warm/neutral leaders coalesce (lit path is non-vacuous)', () => {
    const { worldState, snapshot } = world(MERCHANT_CRAFT());
    const { worldState: ws, receipts } = drive(worldState, snapshot, 1, 0.01);
    const blocs = settlementBlocs(ws, 'S1');
    expect(blocs.length).toBe(1);
    expect(blocs[0].members.sort()).toEqual(['Craft Guild', 'Merchant League']);
    expect(receipts.some((r) => r.kind === 'formed')).toBe(true);
    // end derives from member interests (merchant/craft → commerce).
    expect(blocs[0].end).toBe('commerce');
    // seat-held concession glue by default (no warm tie, no leash, no threat).
    expect(blocs[0].glue[0].type).toBe('concession');
  });

  it('a low draw defers (E0 tempo): u ≈ 1 never forms', () => {
    const { worldState, snapshot } = world(MERCHANT_CRAFT());
    const { worldState: ws } = drive(worldState, snapshot, 20, 0.999);
    expect(settlementBlocs(ws, 'S1').length).toBe(0);
  });
});

describe('settlement politics — THE LEADER-RIVALRY BLOCK (the load-bearing pin)', () => {
  it('interests align + leaders bitterly hostile ⇒ NO bloc forms, ever (hard block)', () => {
    const base = MERCHANT_CRAFT();
    const { worldState, snapshot } = world({
      ...base,
      relationships: [{ npc1Id: 'npc_1', npc2Id: 'npc_2', type: 'rival', strength: 'bitter' }],
    });
    const { worldState: ws, receipts } = drive(worldState, snapshot, 30, 0.01);
    expect(settlementBlocs(ws, 'S1').length).toBe(0);
    // the DM-usable deferral is surfaced ("they need each other …").
    expect(receipts.some((r) => r.kind === 'deferred' && /need each other/.test(r.detail))).toBe(true);
  });

  it('NEGATIVE CONTROL: same interests, WARM leaders ⇒ forms (and on patronage glue)', () => {
    const base = MERCHANT_CRAFT();
    const { worldState, snapshot } = world({
      ...base,
      relationships: [{ npc1Id: 'npc_1', npc2Id: 'npc_2', type: 'ally', strength: 'close' }],
    });
    const { worldState: ws } = drive(worldState, snapshot, 1, 0.01);
    const blocs = settlementBlocs(ws, 'S1');
    expect(blocs.length).toBe(1);
    expect(blocs[0].glue[0].type).toBe('patronage'); // people-held (warm tie is the binding).
  });

  it('a live dynamic rivalry (rivalryTargets) also blocks', () => {
    const base = MERCHANT_CRAFT();
    const { worldState, snapshot } = world({
      ...base,
      npcStates: { 'S1:npc_1': { rivalryTargets: ['S1:npc_2'] } },
    });
    const { worldState: ws } = drive(worldState, snapshot, 30, 0.01);
    expect(settlementBlocs(ws, 'S1').length).toBe(0);
  });
});

describe('settlement politics — glue typology + succession twin pin', () => {
  it('succession dissolves a PEOPLE-HELD (patronage) bloc but NOT a SEAT-HELD (concession) one', () => {
    // People-held: warm tie ⇒ patronage. Seat-held: neutral ⇒ concession.
    for (const [rel, glueType, shouldDissolve] of [
      [[{ npc1Id: 'npc_1', npc2Id: 'npc_2', type: 'ally', strength: 'close' }], 'patronage', true],
      [[], 'concession', false],
    ]) {
      const base = MERCHANT_CRAFT();
      const { worldState, snapshot } = world({ ...base, relationships: rel });
      // Form the bloc, then hold it past the dwell window.
      let { worldState: ws } = drive(worldState, snapshot, SETTLEMENT_POLITICS_TUNING.MIN_DWELL_TICKS + 2, 0.01);
      expect(settlementBlocs(ws, 'S1')[0].glue[0].type).toBe(glueType);
      // Now the merchant leader's SEAT changes hands (npc_1 → npc_9): a succession event.
      const snap2 = JSON.parse(JSON.stringify(snapshot));
      ws = JSON.parse(JSON.stringify(ws));
      ws.factionStates['S1:merchant_league'].internalSeats.leader_champion = { npcId: 'S1:npc_9', name: 'Cael', dotRank: 3 };
      const res = advanceSettlementPolitics({ worldState: ws, snapshot: snap2, rng: rngThatDraws(0.99), tick: 50 });
      const dissolved = settlementBlocs(res.worldState, 'S1').length === 0;
      expect(dissolved, `${glueType} succession`).toBe(shouldDissolve);
    }
  });

  it('a corrupt seat-holder makes the bloc COVERT on compromise glue; exposure shatters it + fires scandal', () => {
    const base = MERCHANT_CRAFT();
    const { worldState, snapshot } = world({
      ...base,
      npcStates: { 'S1:npc_1': { corruption: true, corruptionLeash: { covert: true, patron: 'S2' } } },
    });
    let { worldState: ws } = drive(worldState, snapshot, SETTLEMENT_POLITICS_TUNING.MIN_DWELL_TICKS + 2, 0.01);
    const bloc = settlementBlocs(ws, 'S1')[0];
    expect(bloc.glue[0].type).toBe('compromise');
    expect(bloc.covert).toBe(true);
    // Reveal the leash → the next tick shatters the bloc with an 'exposed' receipt.
    ws = JSON.parse(JSON.stringify(ws));
    ws.npcStates['S1:npc_1'].corruptionLeash = { covert: false, revealed: true };
    const res = advanceSettlementPolitics({ worldState: ws, snapshot, rng: rngThatDraws(0.99), tick: 60 });
    expect(settlementBlocs(res.worldState, 'S1').length).toBe(0);
    expect(res.receipts.some((r) => r.kind === 'exposed')).toBe(true);
  });
});

describe('settlement politics — differential strain → revanchism', () => {
  it('a treaty burden climbs the burdened (non-governing economic) member\'s strain → revanchism rises', () => {
    // Governing = a noble faction (signs the peace); the merchant faction bears the tribute.
    const factions = [
      fac('S1', 'Noble House', 'noble', 'S1:npc_1', 'Alda'),
      fac('S1', 'Merchant League', 'merchant', 'S1:npc_2', 'Boro'),
    ];
    const rosterFactions = [
      { faction: 'Noble House', power: 45, isGoverning: true },
      { faction: 'Merchant League', power: 40 },
    ];
    // THE RECORD CARRIES BOTH HALVES OF ITS PAIR, as every mint writes it (peaceTerms'
    // treaty builder sets `victorId` and `loserId` together). The fixture named only the
    // loser until 2026-08-04; the burden read now resolves the bound party through
    // `treatyOrientationOf` (CR-WR10-G), and a half-named record is deliberately
    // UNRESOLVED there — `unknown` is a real verdict, not a shrug — so an incomplete
    // fixture would have been proving the burden road on a document the engine never
    // mints.
    const treaties = { 'S1>S2': { victorId: 'S2', loserId: 'S1', terms: [{ type: 'tribute', burden01: 0.9 }] } };
    const { worldState, snapshot } = world({ factions, rosterFactions, treaties });
    // Form the bloc, then let strain accrue under the burden.
    const { worldState: ws } = drive(worldState, snapshot, 25, 0.01);
    const blocs = settlementBlocs(ws, 'S1');
    expect(blocs.length).toBe(1);
    expect(blocs[0].strain).toBeGreaterThan(0.2); // the burden climbed the strain.
    expect(factionRevanchism01(ws, 'S1', 'Merchant League')).toBeGreaterThan(0.2);
  });

  it('A SALE BURDENS ITS BUYER, and the seller it pays walks free (CR-WR10-G)', () => {
    // THE SAME LADDER, THE OTHER INSTRUMENT. A WR-10 sale treaty carries no victor and no
    // loser; the party its terms bind is the BUYER, which is what makes the consideration
    // a price rather than a confiscation. Read off `loserId` — the spelling this file's
    // war fixture uses, and the one the burden read carried until 2026-08-04 — a bought
    // court's tribute produced the empty string and the strain never accrued: a silence,
    // not an error, and the exact shape of defect CR-WR10-G exists to end.
    const factions = [
      fac('S1', 'Noble House', 'noble', 'S1:npc_1', 'Alda'),
      fac('S1', 'Merchant League', 'merchant', 'S1:npc_2', 'Boro'),
    ];
    const rosterFactions = [
      { faction: 'Noble House', power: 45, isGoverning: true },
      { faction: 'Merchant League', power: 40 },
    ];
    const sale = { 'S1>S2': { sellerId: 'S2', buyerId: 'S1', terms: [{ type: 'tribute', burden01: 0.9 }] } };
    const bought = world({ factions, rosterFactions, treaties: sale });
    const { worldState: ws } = drive(bought.worldState, bought.snapshot, 25, 0.01);
    expect(settlementBlocs(ws, 'S1')[0].strain, 'the buyer bears what it agreed to pay').toBeGreaterThan(0.2);

    // THE MIRROR, on the identical fixture: with S1 as the SELLER it is owed the tribute
    // rather than bound by it, so no strain accrues. Same terms, same factions, same
    // ticks — only the orientation moves, which is what makes the pin above a direction
    // and not a wealth measurement.
    const owed = { 'S1>S2': { sellerId: 'S1', buyerId: 'S2', terms: [{ type: 'tribute', burden01: 0.9 }] } };
    const paid = world({ factions, rosterFactions, treaties: owed });
    const { worldState: ws2 } = drive(paid.worldState, paid.snapshot, 25, 0.01);
    expect(settlementBlocs(ws2, 'S1')[0].strain, 'the seller bears none of it').toBeLessThanOrEqual(0.2);
  });
});

describe('settlement politics — ruling-bloc loading (clamped + receipted) + cross-seam', () => {
  it('rulingBlocOf derives the governing bloc; consolidation + decision factor are clamped', () => {
    const { worldState, snapshot } = world(MERCHANT_CRAFT());
    const { worldState: ws } = drive(worldState, snapshot, 1, 0.01);
    const item = snapshot.settlements[0];
    const ruling = rulingBlocOf(ws, 'S1', item);
    expect(ruling).not.toBeNull();
    expect(ruling.consolidation).toBeCloseTo(1, 5); // both factions in one bloc ⇒ full court.
    const cons = coalitionConsolidation01(ws, 'S1', item);
    expect(cons).toBeGreaterThan(SETTLEMENT_POLITICS_TUNING.RULING_CONSOLIDATION_FLOOR);
    // Decision factor stays inside the ±SPAN clamp.
    const dep = blocDecisionFactor(ws, 'S1', item, 'deploy');
    const span = SETTLEMENT_POLITICS_TUNING.DECISION_LOAD_SPAN;
    expect(dep).toBeGreaterThanOrEqual(1 - span);
    expect(dep).toBeLessThanOrEqual(1 + span);
  });

  it('the load is DIRECTIONAL: a revanchist seats-bloc lifts deploy; a commerce bloc damps it', () => {
    const item = { id: 'S1', settlement: { powerStructure: { factions: [
      { faction: 'Noble House', power: 60, isGoverning: true },
      { faction: 'Merchant League', power: 40 },
    ] } } };
    const mkWorld = (end, strain) => ({
      simulationRules: { settlementPoliticsEnabled: true, factionCompetitionEnabled: true },
      politicsLedgers: { S1: { blocs: [{
        id: 'merchant_league+noble_house', members: ['Merchant League', 'Noble House'],
        glue: [{ type: 'concession', detail: '' }], end, strain, sinceTick: 0,
      }] } },
    });
    // A seats-end bloc under revanchist strain lifts the deploy weight above 1.
    expect(blocDecisionFactor(mkWorld('seats', 0.8), 'S1', item, 'deploy')).toBeGreaterThan(1);
    // A commerce-end bloc damps deploy below 1 (the guild does not want a war).
    expect(blocDecisionFactor(mkWorld('commerce', 0), 'S1', item, 'deploy')).toBeLessThan(1);
  });

  it('a divided court reads 0 consolidation (cheap to corrupt); dormant reads 0', () => {
    // No bloc yet ⇒ divided court.
    const { worldState, snapshot } = world(MERCHANT_CRAFT());
    const item = snapshot.settlements[0];
    expect(coalitionConsolidation01(worldState, 'S1', item)).toBe(0);
    // Dormant world reads neutral too.
    expect(coalitionConsolidation01({ simulationRules: {} }, 'S1', item)).toBe(0);
    expect(blocDecisionFactor({ simulationRules: {} }, 'S1', item, 'deploy')).toBe(1);
  });
});

describe('settlement politics — conspiracies (autarchies suppress overt blocs, breed covert)', () => {
  // A noble house governs (→ autocrat). Two opposition factions (merchant + craft) align —
  // under the autarch they cannot organise in the open, so they form a COVERT conspiracy.
  function autarchyWorld() {
    return world({
      factions: [
        fac('S1', 'Noble House', 'noble', 'S1:npc_1', 'Alda'),
        fac('S1', 'Merchant League', 'merchant', 'S1:npc_2', 'Boro'),
        fac('S1', 'Craft Guild', 'craft', 'S1:npc_3', 'Cael'),
      ],
      rosterFactions: [
        { faction: 'Noble House', power: 60, isGoverning: true },
        { faction: 'Merchant League', power: 30 },
        { faction: 'Craft Guild', power: 28 },
      ],
    });
  }

  it('opposition under an autarch forms a COVERT conspiracy (not an overt bloc)', () => {
    const { worldState, snapshot } = autarchyWorld();
    const res = advanceSettlementPolitics({ worldState, snapshot, rng: rngThatDraws(0.01), tick: 0 });
    const blocs = settlementBlocs(res.worldState, 'S1');
    expect(blocs.length).toBe(1);
    expect(blocs[0].members.sort()).toEqual(['Craft Guild', 'Merchant League']); // excludes the governing noble.
    expect(blocs[0].covert).toBe(true);
    expect(res.receipts.some((r) => r.kind === 'formed' && /conspire/.test(r.detail))).toBe(true);
  });

  it('a covert conspiracy is DISCOVERED over time (the covert→revealed exposure path)', () => {
    const { worldState, snapshot } = autarchyWorld();
    // Form the conspiracy, then drive on — discovery fires an 'exposed' receipt.
    const { receipts } = drive(worldState, snapshot, 12, 0.05);
    expect(receipts.some((r) => r.kind === 'exposed' && /uncovered|conspiracy/.test(r.detail))).toBe(true);
  });
});

describe('settlement politics — outbidding (seat-held concession glue is a market)', () => {
  it('a richer non-member suitor OUTBIDS a concession member, flipping the seat (receipted)', () => {
    // A weak merchant+craft concession forms; a much richer TradeHouse (merchant) then
    // outbids the craft guild's seat — the concession is a market.
    const { worldState, snapshot } = world({
      factions: [
        fac('S1', 'Merchant League', 'merchant', 'S1:npc_1', 'Alda'),
        fac('S1', 'Craft Guild', 'craft', 'S1:npc_2', 'Boro'),
        fac('S1', 'Trade House', 'merchant', 'S1:npc_3', 'Cael'),
      ],
      rosterFactions: [
        { faction: 'Merchant League', power: 30, isGoverning: true },
        { faction: 'Craft Guild', power: 28 },
        { faction: 'Trade House', power: 60 },
      ],
    });
    const { receipts } = drive(worldState, snapshot, SETTLEMENT_POLITICS_TUNING.MIN_DWELL_TICKS + 4, 0.01);
    expect(receipts.some((r) => /outbid/.test(r.detail))).toBe(true);
  });
});

describe('settlement politics — the divided-court → corruption-cheap CROSS-PIN', () => {
  // The two designs are one market (§3): a consolidated ruling coalition raises the
  // corruption patron's recruitment price; a divided court is cheap.
  function corruptionWorld(withBloc) {
    const targetItem = {
      id: 'S1',
      settlement: { powerStructure: { factions: [
        { faction: 'Merchant League', power: 44, isGoverning: true },
        { faction: 'Craft Guild', power: 40 },
      ] } },
    };
    const patronItem = { id: 'S2', settlement: { powerStructure: { factions: [] }, economicState: { prosperity: 'Wealthy' } } };
    const snapshot = {
      settlements: [targetItem, patronItem],
      byId: new Map([['S1', targetItem], ['S2', patronItem]]),
      regionalGraph: { edges: [{ from: 'S2', to: 'S1', relationshipType: 'hostile' }], channels: [] },
    };
    const worldState = {
      spatialCanonVersion: 1,
      simulationRules: { corruptionWebEnabled: true, settlementPoliticsEnabled: true, factionCompetitionEnabled: true, infoMode: 'full' },
      ...(withBloc ? { politicsLedgers: { S1: { blocs: [{
        id: 'craft_guild+merchant_league', members: ['Craft Guild', 'Merchant League'],
        glue: [{ type: 'concession', detail: '' }], end: 'commerce', strain: 0, sinceTick: 0,
      }] } } } : {}),
    };
    return { snapshot, worldState };
  }

  it('a consolidated coalition raises the recruitment price below a divided court\'s', () => {
    const divided = corruptionWorld(false);
    const consolidated = corruptionWorld(true);
    const wDivided = recruitmentWeight(divided.snapshot, divided.worldState, new Set(), 'S2', 'S1').weight;
    const wConsolidated = recruitmentWeight(consolidated.snapshot, consolidated.worldState, new Set(), 'S2', 'S1').weight;
    expect(wDivided).toBeGreaterThan(0);
    expect(wConsolidated).toBeLessThan(wDivided); // the coalition raised the patron's price.
  });
});

describe('settlement politics — r2 politics-psychology-1: leader alignment kinship resolves from the categorical string', () => {
  // npcStates carry a categorical alignment STRING (npcAgency writes pick(ALIGNMENTS) /
  // `corrupted_${…}`). The prior alignmentAxes ran asObject('lawful_good') → {} → NaN → null, so
  // the §B quadrant gate collapsed to a constant. These pin the two poles the finding names.
  it('two lawful_good leaders → kinship 1 (kindred); lawful_good vs chaotic_evil → 0 (opposite)', () => {
    const kindred = leaderAlignmentKinship({ x: { alignment: 'lawful_good' }, y: { alignment: 'lawful_good' } }, 'x', 'y');
    expect(kindred).toBe(1);
    const opposite = leaderAlignmentKinship({ x: { alignment: 'lawful_good' }, y: { alignment: 'chaotic_evil' } }, 'x', 'y');
    expect(opposite).toBe(0);
  });

  it('the axes decompose independently (law vs good) and the corrupted_ prefix rides along', () => {
    // lawful_good vs lawful_evil: same law (1), opposite good (1 vs 0) ⇒ manhattan 1/2 ⇒ 0.5.
    expect(leaderAlignmentKinship({ x: { alignment: 'lawful_good' }, y: { alignment: 'lawful_evil' } }, 'x', 'y')).toBe(0.5);
    // true_neutral is the midpoint on both axes.
    expect(leaderAlignmentKinship({ x: { alignment: 'true_neutral' }, y: { alignment: 'true_neutral' } }, 'x', 'y')).toBe(1);
    // corrupted_lawful_good still reads as lawful_good on the base axes ⇒ kindred with a plain one.
    expect(leaderAlignmentKinship({ x: { alignment: 'corrupted_lawful_good' }, y: { alignment: 'lawful_good' } }, 'x', 'y')).toBe(1);
  });

  it('missing leaders / absent alignment ⇒ null (the quadrant defaults neutral, no crash)', () => {
    expect(leaderAlignmentKinship({ x: { alignment: 'lawful_good' } }, 'x', null)).toBe(null);
    expect(leaderAlignmentKinship({ x: {}, y: { alignment: 'lawful_good' } }, 'x', 'y')).toBe(null);
  });
});

describe('settlement politics — r2 politics-psychology-2: the external-threat rally reads real war sources', () => {
  // settlementUnderThreat now reads a live war_front INTO the settlement (and worldState.warPosture),
  // not six settlement fields no engine path writes. A besieged court closes ranks: the bloc that
  // forms binds on THREAT glue with a SURVIVAL end, instead of the peacetime concession/commerce.
  it('a live war_front pointing at the settlement ⇒ a threat-glue / survival bloc forms', () => {
    const { worldState, snapshot } = world(MERCHANT_CRAFT());
    // A bare confirmed war_front S2 → S1 (a live siege; not a hostile-relationship mint).
    snapshot.regionalGraph = { channels: [{ type: 'war_front', status: 'confirmed', from: 'S2', to: 'S1' }] };
    const { worldState: ws } = drive(worldState, snapshot, 1, 0.01);
    const blocs = settlementBlocs(ws, 'S1');
    expect(blocs.length).toBe(1);
    expect(blocs[0].glue[0].type, 'a common danger at the walls binds a threat bloc').toBe('threat');
    expect(blocs[0].end, 'the external threat overrides the end to survival').toBe('survival');
  });

  it('CONTROL: no war_front ⇒ the ordinary peacetime bloc (concession / commerce), proving non-vacuity', () => {
    const { worldState, snapshot } = world(MERCHANT_CRAFT());
    snapshot.regionalGraph = { channels: [] };
    const { worldState: ws } = drive(worldState, snapshot, 1, 0.01);
    const blocs = settlementBlocs(ws, 'S1');
    expect(blocs.length).toBe(1);
    expect(blocs[0].glue[0].type).toBe('concession');
    expect(blocs[0].end).toBe('commerce');
  });

  it('a hostile-RELATIONSHIP-minted front is NOT a siege (provenance gate) ⇒ no rally', () => {
    const { worldState, snapshot } = world(MERCHANT_CRAFT());
    // A relationship-minted front (evidence source 'relationship_label', no war-layer tag) is a
    // pure hostility bundle, not a mobilized siege ⇒ isLiveWarFront/warFrontsInto reject it.
    snapshot.regionalGraph = { channels: [{
      type: 'war_front', status: 'confirmed', from: 'S2', to: 'S1',
      evidence: [{ source: 'relationship_label' }],
    }] };
    const { worldState: ws } = drive(worldState, snapshot, 1, 0.01);
    const blocs = settlementBlocs(ws, 'S1');
    expect(blocs.length).toBe(1);
    expect(blocs[0].glue[0].type, 'a mere hostile relationship is not banners at the walls').toBe('concession');
  });
});

describe('settlement politics — depth cap (≤3 blocs)', () => {
  it('a fourth bloc cannot form; a deferral is surfaced at the cap', () => {
    // Eight mutually-aligned factions ⇒ 4 possible pairs, but only 3 blocs may form.
    const names = ['Alpha Guild', 'Beta Guild', 'Gamma Guild', 'Delta Guild', 'Epsilon Guild', 'Zeta Guild', 'Eta Guild', 'Theta Guild'];
    const factions = names.map((n, i) => fac('S1', n, 'craft', `S1:npc_${i + 1}`, `L${i}`));
    const rosterFactions = names.map((n, i) => ({ faction: n, power: 20 - i, isGoverning: i === 0 }));
    const { worldState, snapshot } = world({ factions, rosterFactions });
    const { worldState: ws, receipts } = drive(worldState, snapshot, 40, 0.01);
    expect(settlementBlocs(ws, 'S1').length).toBeLessThanOrEqual(SETTLEMENT_POLITICS_TUNING.MAX_BLOCS_PER_SETTLEMENT);
    expect(receipts.some((r) => r.kind === 'deferred' && /cap/.test(r.detail))).toBe(true);
  });
});

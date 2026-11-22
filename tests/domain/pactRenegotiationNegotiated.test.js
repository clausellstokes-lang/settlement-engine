/**
 * tests/domain/pactRenegotiationNegotiated.test.js — GR-RENEWAL U2: RENEGOTIATION FOR A
 * NEGOTIATED PACT (GR-5c-b; the lane brief BUILD-FP-GR-renewal-lane.md, from READ 3's
 * renegotiation row: "signatureLeadOf returns null unless orientation.kind === 'wartime' ... 0
 * pact_renegotiated").
 *
 * GR-5c measures a court's swing against the lead RECORDED AT THE SIGNING, and only the war door
 * recorded one, so no peace made in peace could ever be renegotiated. The formation door now
 * records the negotiated pact's own lead at its mint (the first party's believed lead over its
 * second, from the same two reads the swing is later measured with), and `signatureLeadOf` reads
 * it from either side, the war door's convention with the first party in the victor's place.
 *
 * READ DIRECTLY, NOT THROUGH treatyOrientationOf: a sibling lane (TREATY-VOICE) is adding a
 * `negotiated` orientation kind in its own worktree; this arm reads the record's provenance and
 * parties itself, so it holds whichever lands first.
 *
 * The new symbols are read through NAMESPACE imports, so the red-first plant of the pre-change
 * sources reds each arm by title instead of failing the file at link time.
 */
import { describe, expect, it } from 'vitest';

import * as renewal from '../../src/domain/worldPulse/pactRenewal.js';
import * as formation from '../../src/domain/worldPulse/pactFormation.js';
import { applyRealmVerbOrder, buildRealmVerbOutcome } from '../../src/domain/worldPulse/realmVerbExecution.js';
import { pactProposalsOf } from '../../src/domain/worldPulse/pactProposals.js';
import { treatyLedgerOf } from '../../src/domain/worldPulse/treatyEnforcement.js';
import { strengthOfBand } from '../../src/domain/worldPulse/beliefMap.js';
import { settlementStrength } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { treatyPairKey } from '../../src/domain/worldPulse/peaceTermsPrimitives.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { A_ECONOMY, B_ECONOMY, SEAT, pactWorld } from '../helpers/pactFixture.js';

const SIGN_TICK = 0;
const YEAR = CURRENT_TREATY_TICKS_PER_YEAR;
/** The instrument's first year-turn: the day its court may raise a demand of its own. */
const TURN = SIGN_TICK + YEAR;
const LIT = Object.freeze({ treatyRenewalEnabled: true, oathHolderEnabled: true });
const npc = (id, name, seat) => ({ id, name, factionAffiliation: seat, role: 'official' });
const court = (id, economicState, roster) => ({
  id, name: id,
  settlement: {
    id, name: id, economicState: { ...economicState },
    powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' }, factions: [{ faction: `${id} seat`, category: 'military', power: 78, isGoverning: true }], conflicts: [] },
    npcs: roster.map((row) => ({ ...row })),
  },
});
const snapshotOf = () => ({
  settlements: [court('A', A_ECONOMY, [npc('npc_a1', 'Aldric Thorne', 'A seat')]), court('B', B_ECONOMY, [npc('npc_b1', 'Bregan Holt', 'B seat')])],
  regionalGraph: { edges: [{ from: 'A', to: 'B' }] },
});
const settlementOf = (id) => snapshotOf().settlements.find((item) => item.id === id)?.settlement ?? null;
/** A picture: the belief map's banded strength, and the trade bands only when a crossing is wanted. */
const picture = (strengthBand, scarcityBands = null) => ({
  readiness: 0, strengthBand, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 0.9, lastUpdateTick: 0,
  ...(scarcityBands ? { scarcityBands } : {}),
});
/** Each court's picture of the other; `null` means no picture at all. Without `trade` the pictures
 *  carry strength alone, so no occasion crosses and the stage's only act is the one under test. */
function beliefsOf({ aSeesB = 2, bSeesA = 2, trade = false } = {}) {
  return {
    A: { [SEAT]: aSeesB === null ? {} : { B: picture(aSeesB, trade ? { food: 'plentiful', raw_material: 'scant' } : null) } },
    B: { [SEAT]: bSeesA === null ? {} : { A: picture(bSeesA, trade ? { food: 'scant', raw_material: 'plentiful' } : null) } },
  };
}
/** The world with one court's picture of another moved to `band`, everything else as it stands. */
function withPicture(world, observer, subject, band) {
  const maps = world.spatialLedgers.beliefMaps;
  return {
    ...world,
    spatialLedgers: {
      ...world.spatialLedgers,
      beliefMaps: { ...maps, [observer]: { [SEAT]: { ...maps[observer][SEAT], [subject]: { ...maps[observer][SEAT][subject], strengthBand: band } } } },
    },
  };
}
/** Each court's own strength AT THE SIGNING, as the stage injects it (knowledge, not belief). */
const AT_SIGNING = Object.freeze({ A: 0.6, B: 0.5 });
const reading = (table) => (id) => table[id] ?? 0;
/** A reciprocal trade pact, one clause owed each way, signed through the REAL formation door. */
function signedWorld({ rules = LIT, beliefs = beliefsOf(), strengthFor = reading(AT_SIGNING), tick = TURN } = {}) {
  const world = pactWorld({ flag: true, rules, beliefs });
  const sheet = formation.draftPactSheet({ trigger: 'trade_demand', fromId: 'A', toId: 'B', reciprocal: true, tick: SIGN_TICK, score01: 0 });
  const signed = formation.signPactProposal({
    worldState: world, proposal: { from: 'A', to: 'B', trigger: 'trade_demand', sheet: { terms: sheet.terms } },
    tick: SIGN_TICK, settlementOf, strengthFor,
  });
  return { ...signed.worldState, tick };
}
const instrumentOf = (world) => Object.values(treatyLedgerOf(world) || {})[0];
const T = () => renewal.RENEGOTIATION_TUNING;
const stage = (world, tick, strengthFor) => formation.advancePeacetimePacts({ snapshot: snapshotOf(), worldState: { ...world, tick }, tick, strengthFor });
const demandsOf = (world) => pactProposalsOf(world).filter((r) => r.trigger === 'renegotiation');

describe('GR-RENEWAL U2 — renegotiation for a negotiated pact: the lead recorded at a peacetime signing, read from either side', () => {
  it('U2-A1: the formation door records the first party\'s believed lead at a negotiated mint, lit and pictured only', () => {
    const treaty = instrumentOf(signedWorld());
    // A's own strength less A's OWN picture of B, the two reads the swing is later measured with.
    expect(treaty.believedMarginAtSignature).toBe(Math.round((AT_SIGNING.A - strengthOfBand(2)) * 10000) / 10000);
    expect(treaty.parties).toEqual(['A', 'B']);
    expect(treaty.provenance).toBe('negotiated');
    // THE PICTURE, NEVER THE TRUTH: A pictures B a band stronger than B's own strength, and the
    // record is A's picture's lead, not the lead the truth would give.
    expect(strengthOfBand(3)).toBeGreaterThan(AT_SIGNING.B);
    expect(instrumentOf(signedWorld({ beliefs: beliefsOf({ aSeesB: 3 }) })).believedMarginAtSignature)
      .toBe(Math.round((AT_SIGNING.A - strengthOfBand(3)) * 10000) / 10000);
    // Written only when the layer is lit, a strength reader was handed in, and A holds a picture of B.
    const absentIn = (world) => Object.hasOwn(instrumentOf(world), 'believedMarginAtSignature');
    // anchored: the lit, pictured signing above carries the key; each world below changes one input.
    expect(absentIn(signedWorld({ rules: { oathHolderEnabled: true } })), 'the layer absent').toBe(false);
    expect(absentIn(signedWorld({ rules: { oathHolderEnabled: true, treatyRenewalEnabled: false } })), 'the layer false').toBe(false);
    expect(absentIn(signedWorld({ beliefs: beliefsOf({ aSeesB: null }) })), 'A holds no picture of B').toBe(false);
    expect(absentIn(signedWorld({ strengthFor: null })), 'no strength reader').toBe(false);
    // THE STAGE HANDS ITS OWN READER IN: an organic mint through the answer step records the lead.
    const fresh = pactWorld({ flag: true, rules: LIT, beliefs: beliefsOf({ trade: true }) });
    const opened = stage(fresh, 10, reading(AT_SIGNING));
    const row = pactProposalsOf(opened.worldState)[0];
    const minted = stage(opened.worldState, row.answerDueTick, reading(AT_SIGNING));
    const organic = instrumentOf(minted.worldState);
    expect(organic.lineage.map((entry) => entry.act)).toEqual(['formed']);
    expect(organic.believedMarginAtSignature).toBe(Math.round((AT_SIGNING.A - strengthOfBand(2)) * 10000) / 10000);
  });

  it('U2-A2: a negotiated pact whose believed lead moved past the band demands new terms on its anniversary', () => {
    const world = signedWorld();
    // A has grown: its lead over B (as A pictures B) is now far past the one it signed at.
    const now = { A: 0.9, B: 0.5 };
    const swing = renewal.renegotiationSwingOf({ worldState: world, treaty: instrumentOf(world), demanderId: 'A', counterpartId: 'B', selfStrength01: now.A });
    expect(swing).toBeCloseTo((now.A - strengthOfBand(2)) - instrumentOf(world).believedMarginAtSignature, 12);
    expect(swing).toBeGreaterThanOrEqual(T().DEMAND_SWING);
    const asked = stage(world, TURN, reading(now));
    const rows = demandsOf(asked.worldState);
    expect(rows.map((r) => [r.from, r.to, r.trigger, r.state, r.openedTick])).toEqual([['A', 'B', 'renegotiation', 'open', TURN]]);
    // The demand lightens only the clause A OWES (the one that runs to B), by the swing inside the cap.
    const owed = instrumentOf(world).terms.filter((t) => t.beneficiary === 'B');
    const ask = Math.min(T().ASK_CAP, swing);
    expect(rows[0].sheet.terms.map((t) => [t.type, t.beneficiary, t.magnitude, t.expiresTick]))
      .toEqual(owed.map((t) => [t.type, 'B', Math.round(t.magnitude * (1 - ask) * 10000) / 10000, t.expiresTick]));
    // Not before the anniversary, and not inside the band: A signed at the lead it holds now.
    // anchored: the same world opens the demand at TURN above; one week earlier is the only change.
    expect(demandsOf(stage(world, TURN - 1, reading(now)).worldState)).toEqual([]);
    // anchored: the same world at the same year-turn opens the demand above; A's strength back at its signing value is the only change.
    expect(demandsOf(stage(world, TURN, reading(AT_SIGNING)).worldState)).toEqual([]);
  });

  it('U2-A3: the lead is read from either side: the first party\'s own lead, the second party\'s deficit', () => {
    const world = signedWorld({ beliefs: beliefsOf({ aSeesB: 2, bSeesA: 1 }) });
    const treaty = instrumentOf(world);
    const margin = treaty.believedMarginAtSignature;
    const swingOf = (demanderId, counterpartId, own) => renewal.renegotiationSwingOf({ worldState: world, treaty, demanderId, counterpartId, selfStrength01: own });
    // B pictures A a band weaker than A pictures B; B's swing is measured against A's recorded lead, negated.
    expect(swingOf('B', 'A', 0.9)).toBeCloseTo(0.9 - strengthOfBand(1) + margin, 12);
    expect(swingOf('A', 'B', 0.9)).toBeCloseTo(0.9 - strengthOfBand(2) - margin, 12);
    // B's demand opens on the anniversary when its own swing is past the band.
    const asked = stage(world, TURN, reading({ A: AT_SIGNING.A, B: 0.9 }));
    expect(demandsOf(asked.worldState).map((r) => [r.from, r.to])).toEqual([['B', 'A']]);
    // A court that is neither party reads no lead.
    expect(swingOf('Z', 'A', 0.9)).toBe(null);
  });

  it('U2-A4: a war\'s end and a sale read exactly as before', () => {
    // THE WAR DOOR: the victor reads its recorded lead and the bound party its deficit, unchanged.
    const war = {
      parties: ['V', 'L'], victorId: 'V', loserId: 'L', mintedTick: SIGN_TICK, believedMarginAtSignature: 0.3,
      treatyTicksPerYear: YEAR, terms: [], complianceState: 'honored',
    };
    const warWorld = pactWorld({
      flag: true, rules: LIT,
      beliefs: { L: { [SEAT]: { V: picture(2) } }, V: { [SEAT]: { L: picture(4) } } },
      treaties: { [treatyPairKey('V', 'L')]: war },
    });
    const swingOf = (treaty, demanderId, counterpartId) => renewal.renegotiationSwingOf({ worldState: warWorld, treaty, demanderId, counterpartId, selfStrength01: 0.6 });
    expect(swingOf(war, 'L', 'V')).toBeCloseTo(0.6 - strengthOfBand(2) + 0.3, 12);
    expect(swingOf(war, 'V', 'L')).toBeCloseTo(0.6 - strengthOfBand(4) - 0.3, 12);
    // A war record that names a provenance still reads through its war orientation.
    expect(swingOf({ ...war, provenance: 'negotiated' }, 'L', 'V')).toBeCloseTo(0.6 - strengthOfBand(2) + 0.3, 12);
    // A SALE records who sold and who bought, and no swing is read from it, margin or not.
    const sale = { parties: ['L', 'V'], sellerId: 'L', buyerId: 'V', mintedTick: SIGN_TICK, believedMarginAtSignature: 0.3, terms: [] };
    // anchored: the war record one assertion above reads a swing for the same court; the sale is the only change.
    expect(swingOf(sale, 'L', 'V')).toBe(null);
    // A NEGOTIATED record that recorded no lead (every one signed before this unit) is renewed, never renegotiated.
    const { believedMarginAtSignature: _none, ...unrecorded } = instrumentOf(signedWorld());
    // anchored: the same negotiated record with its lead reads a swing in U2-A2; the missing lead is the only change.
    expect(renewal.renegotiationSwingOf({ worldState: signedWorld(), treaty: unrecorded, demanderId: 'A', counterpartId: 'B', selfStrength01: 0.9 })).toBe(null);
  });

  it('U2-A5: the DM\'s verb may now ask new terms of a negotiated pact past the band, and is refused inside it', () => {
    const snapshot = { settlements: snapshotOf().settlements };
    const args = { fromId: 'A', toId: 'B', termType: 'renegotiation' };
    // Off the tick the verb reads the asking court's own strength through the no-pressure derivation.
    const own = settlementStrength({ settlement: snapshot.settlements[0].settlement }, {});
    const signed = signedWorld({ tick: 30 });
    const margin = instrumentOf(signed).believedMarginAtSignature;
    // INSIDE THE BAND: A's picture of B has not moved since the signing.
    expect(own - strengthOfBand(2) - margin).toBeLessThan(T().DEMAND_SWING);
    const inside = buildRealmVerbOutcome({ verb: 'PROPOSE_PACT', args, worldState: signed, snapshot, tick: 30 });
    expect([inside.ok, inside.code]).toEqual([false, 'invalid_term_sheet']);
    // PAST THE BAND: A now pictures B two bands weaker than when it signed.
    const moved = withPicture(signed, 'A', 'B', 0);
    expect(own - strengthOfBand(0) - margin).toBeGreaterThanOrEqual(T().DEMAND_SWING);
    const built = buildRealmVerbOutcome({ verb: 'PROPOSE_PACT', args, worldState: moved, snapshot, tick: 30 });
    expect(built.ok).toBe(true);
    const applied = applyRealmVerbOrder({ state: moved, snapshot, settlementUpdates: new Map(), outcome: built.outcome, tick: 30, now: null });
    expect(demandsOf(applied.worldState).map((r) => [r.from, r.to, r.openedTick])).toEqual([['A', 'B', 30]]);
  });

  it('U2-A6: lifecycle: the recorded lead JSON round-trips, an amendment never rewrites it, and a renegotiated record keeps it', () => {
    const world = signedWorld();
    const treaty = instrumentOf(world);
    expect(JSON.parse(JSON.stringify(treaty))).toEqual(treaty);
    // An amendment in peace adds a clause and leaves the signing's lead exactly as recorded.
    const amended = formation.signPactProposal({
      worldState: world,
      proposal: { from: 'B', to: 'A', trigger: 'migration_pressure', sheet: { terms: formation.draftPactSheet({ trigger: 'migration_pressure', fromId: 'B', toId: 'A', reciprocal: false, tick: 20, score01: 0 }).terms } },
      tick: 20, settlementOf, strengthFor: reading({ A: 0.1, B: 0.9 }),
    });
    expect(amended.amended).toBe(true);
    expect(instrumentOf(amended.worldState).believedMarginAtSignature).toBe(treaty.believedMarginAtSignature);
    // A renegotiated record keeps the lead it was signed at (one renegotiation per instrument reads the lineage).
    const asked = stage(world, TURN, reading({ A: 0.9, B: 0.5 }));
    const row = demandsOf(asked.worldState)[0];
    const settled = renewal.settleRenewalProposal({
      worldState: asked.worldState, proposal: row, answer: { verdict: 'signed', receipt: '', offer01: 1, reserve01: 0 },
      tick: row.answerDueTick, settlementOf, snapshot: snapshotOf(),
    });
    const renegotiated = Object.values(settled.ledger)[0];
    expect(renegotiated.lineage.map((entry) => entry.act)).toEqual(['formed', 'renegotiated']);
    expect(renegotiated.believedMarginAtSignature).toBe(treaty.believedMarginAtSignature);
  });
});

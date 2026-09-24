/**
 * treatyVoiceCure.test.js — CURE LANE TREATY-VOICE (FP, 2026-09-24, from EXPERIENCE READ 3).
 *
 * READ 3 watched five pacts signed in peace and then heard nothing more of them: two
 * lapses and three default crossings minted zero `treaty_*` news, because the one
 * orientation reader had no answer for an instrument no war ended. Every pin below drives
 * the REAL drafter, the REAL signer and the REAL treaty mover; no record here mirrors the
 * reader it measures.
 *
 * U1 — THE NEGOTIATED ARM (FPQ-36, the owner's decision of 09-24: the court names ride a
 * new saved key on the signed record; the beats need a fourth orientation kind because the
 * detection beat's only channel from the record is the orientation itself).
 */
import { describe, it, expect } from 'vitest';

import { treatyOrientationOf } from '../../src/domain/worldPulse/treatyOrientation.js';
import { draftPactSheet, signPactProposal } from '../../src/domain/worldPulse/pactFormation.js';
import { advanceTreaties, treatyPairKey, TERM_CATALOG } from '../../src/domain/worldPulse/peaceTerms.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const VOICE_LIT = { warLayerEnabled: true, peaceEngineEnabled: true, treatyLifecycleVoiceEnabled: true };
const VOICE_DARK = { warLayerEnabled: true, peaceEngineEnabled: true };

/** The two courts' reader names. The ids are slugs on purpose: a beat that printed an id
 *  where a town belongs would show here as a slug, never as a name. */
const COURT_NAMES = Object.freeze({ alder: 'Alderbury', birch: 'Birchmoor' });
const PACT_KEY = treatyPairKey('alder', 'birch');

function item(id) {
  const name = COURT_NAMES[id];
  return {
    id,
    name,
    settlement: {
      name, tier: 'town', population: 1800,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: [{ name: 'State Granary', type: 'economic' }],
      economicState: {
        prosperity: 'Prosperous', primaryExports: [], primaryImports: [],
        foodSecurity: { storageMonths: 6, dailyNeed: 100, dailyProduction: 100, deficitPct: 0, surplusPct: 0, resilienceScore: 50 },
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: 'military seat', category: 'military', power: 78, isGoverning: true }],
        conflicts: [],
      },
      npcs: [], activeConditions: [],
    },
  };
}

const SNAPSHOT = {
  byId: new Map([['alder', item('alder')], ['birch', item('birch')]]),
  regionalGraph: { edges: [] },
};

/** Alderbury asks, Birchmoor answers. A one-sided trade clause runs TO the asker, so
 *  Birchmoor is the court that owes it and Alderbury the court that is owed. */
function mintPact({ named = true, signTick = 10 } = {}) {
  const sheet = draftPactSheet({ trigger: 'trade_demand', fromId: 'alder', toId: 'birch', reciprocal: false, tick: signTick - 4 });
  return signPactProposal({
    worldState: {
      rngSeed: 'treaty-voice', simulationRules: { pactFormationEnabled: true },
      relationshipStates: {}, spatialLedgers: {},
    },
    proposal: { from: 'alder', to: 'birch', sheet },
    tick: signTick,
    ...(named ? { settlementOf: (id) => ({ name: COURT_NAMES[id] }) } : {}),
  });
}

const pactOf = (signed) => getSpatialLedger(signed.worldState, 'treaties')[PACT_KEY];
const lastExpiry = (record) => Math.max(...record.terms.map((term) => Number(term.expiresTick)));

function worldWith(record, { tick, rules = VOICE_LIT }) {
  return { tick, simulationRules: { ...rules }, spatialLedgers: { treaties: { [PACT_KEY]: record } } };
}

const advance = (worldState, tick, pIndex = {}) => advanceTreaties({ snapshot: SNAPSHOT, worldState, pIndex, tick });
const entriesOf = (out, kind) => out.newsEntries.filter((entry) => entry.kind === kind);

/** The court that owes the one-sided clause, starved below the default floor. */
const OBLIGOR_STARVED = { bySettlement: { birch: [{ type: 'economy', severity: 0.98 }, { type: 'food', severity: 0.98 }] } };

describe('TREATY-VOICE U1 — the signed record names its courts (the saved key)', () => {
  it('a pact signed between two named courts carries both names, keyed by court', () => {
    const record = pactOf(mintPact());
    expect(record.parties).toEqual(['alder', 'birch']);
    expect(record.partyNames).toEqual({ alder: 'Alderbury', birch: 'Birchmoor' });
  });

  it('a signature whose courts resolve no reader name writes no key at all (drop-when-absent)', () => {
    const nameless = pactOf(mintPact({ named: false }));
    expectAbsentWithAnchor(
      Object.keys(nameless), 'partyNames', 'parties',
      'the named sibling one test up carries the key, so its absence here is the guard, not a missing mint',
    );
  });
});

describe('TREATY-VOICE U1 — the negotiated orientation', () => {
  it('a named negotiated pact reads as its own kind, with no treaty-level direction', () => {
    const o = treatyOrientationOf(pactOf(mintPact()));
    expect(o.kind).toBe('negotiated');
    // NO DIRECTION: a negotiated instrument's clauses point their own ways (termObligationOf),
    // so the treaty-level role slots stay empty and every direction consumer is unmoved.
    expect(o.resolved).toBe(false);
    expect([o.giverId, o.receiverId, o.obligorId, o.obligeeId,
      o.giverName, o.receiverName, o.obligorName, o.obligeeName]).toEqual(['', '', '', '', '', '', '', '']);
    expect(o.parties).toEqual(['alder', 'birch']);
    expect(o.partyNames).toEqual(['Alderbury', 'Birchmoor']);
  });

  it('a pact that names neither court stays exactly the unresolved answer', () => {
    expect(treatyOrientationOf(pactOf(mintPact({ named: false })))).toEqual(treatyOrientationOf({}));
    // anchored: the named record one test up resolves to `negotiated`, so this is the fail-closed arm
    expect(treatyOrientationOf(pactOf(mintPact({ named: false }))).kind).not.toBe('negotiated');
  });

  it('a war-ending treaty and a sale read byte-identically to the answers they always gave', () => {
    const war = {
      parties: ['victor', 'loser'], victorId: 'victor', loserId: 'loser',
      victorName: 'Ashford', loserName: 'Irontown', terms: [],
      partyNames: { victor: 'Ashford', loser: 'Irontown' },
    };
    expect(JSON.stringify(treatyOrientationOf(war))).toBe(
      '{"kind":"wartime","resolved":true,"giverId":"loser","receiverId":"victor","obligorId":"loser",'
      + '"obligeeId":"victor","giverName":"Irontown","receiverName":"Ashford","obligorName":"Irontown",'
      + '"obligeeName":"Ashford"}',
    );
    const sale = {
      parties: ['buyer', 'seller'], sellerId: 'seller', buyerId: 'buyer',
      sellerName: 'Seller Court', buyerName: 'Buyer Court', terms: [],
    };
    expect(JSON.stringify(treatyOrientationOf(sale))).toBe(
      '{"kind":"sale","resolved":true,"giverId":"seller","receiverId":"buyer","obligorId":"buyer",'
      + '"obligeeId":"seller","giverName":"Seller Court","receiverName":"Buyer Court","obligorName":"Buyer Court",'
      + '"obligeeName":"Seller Court"}',
    );
  });
});

describe('TREATY-VOICE U1 — the negotiated pact speaks at its lapse and at its default', () => {
  it('a negotiated pact that runs its term mints its lapse beat, naming both courts', () => {
    const record = pactOf(mintPact());
    const tick = lastExpiry(record);
    const beats = entriesOf(advance(worldWith(record, { tick }), tick), 'treaty_lapsed');
    expect(beats).toHaveLength(1);
    expect(beats[0].settlementNames).toEqual(['Alderbury', 'Birchmoor']);
    expect(beats[0].settlementIds).toEqual(['alder', 'birch']);
    expect(beats[0].headline).toBe('The pact between Alderbury and Birchmoor has run out');
    expect(beats[0].ending).toBe('ran_its_term');
    // anchored: the two names are asserted above, so a slug in the prose is a real fault
    expect(`${beats[0].headline} ${beats[0].summary}`).not.toMatch(/\balder\b|\bbirch\b|undefined/);
    // …and the flag still governs it: the same lapse in a dark world is silent.
    const dark = entriesOf(advance(worldWith(record, { tick, rules: VOICE_DARK }), tick), 'treaty_lapsed');
    expect(dark.length, 'the lit run above minted exactly one').toBe(0);
  });

  it('a default crossing on a negotiated clause names the court owed and the court that owes', () => {
    const record = pactOf(mintPact());
    const tick = 20;
    const out = advance(worldWith(record, { tick }), tick, OBLIGOR_STARVED);
    const stored = getSpatialLedger(out.worldState, 'treaties')[PACT_KEY];
    expect(stored.complianceState, 'the starved obligor really did fall out of honored').not.toBe('honored');
    const beats = entriesOf(out, 'treaty_default_detected');
    expect(beats).toHaveLength(1);
    // THE CLAUSE'S OWN DIRECTION: the clause runs to Alderbury, so Birchmoor is the one
    // named short, never an order read off the party list.
    expect(beats[0].settlementIds).toEqual(['alder', 'birch']);
    expect(beats[0].settlementNames).toEqual(['Alderbury', 'Birchmoor']);
    expect(beats[0].headline).toBe(stored.complianceState === 'defaulted'
      ? "Alderbury's court enters Birchmoor in default"
      : "Alderbury finds Birchmoor's deliveries running short");
    expect(beats[0].observedState).toBe(stored.complianceState);
  });

  it('a pact on its FIRST observation is a level, not a crossing: nothing is entered the week it is signed', () => {
    const record = pactOf(mintPact({ signTick: 20 }));
    const out = advance(worldWith(record, { tick: 20 }), 20, OBLIGOR_STARVED);
    const stored = getSpatialLedger(out.worldState, 'treaties')[PACT_KEY];
    expect(stored.complianceState, 'the same starved obligor really is out of honored at its first reading').not.toBe('honored');
    // anchored: the sibling above, signed at ten and read at twenty, mints exactly one such beat
    expect(entriesOf(out, 'treaty_default_detected').map((entry) => entry.id)).not.toContain('wizard_news.20.treaty_default_detected.alder.birch');
    expect(entriesOf(out, 'treaty_default_detected').length, 'and no other default beat either').toBe(0);
  });

  it('a clause that runs the OTHER way names the courts the other way round', () => {
    const signed = signPactProposal({
      worldState: { rngSeed: 'treaty-voice', simulationRules: { pactFormationEnabled: true }, relationshipStates: {}, spatialLedgers: {} },
      proposal: { from: 'birch', to: 'alder', sheet: draftPactSheet({ trigger: 'trade_demand', fromId: 'birch', toId: 'alder', reciprocal: false, tick: 6 }) },
      tick: 10,
      settlementOf: (id) => ({ name: COURT_NAMES[id] }),
    });
    const record = pactOf(signed);
    expect(record.terms.map((term) => term.beneficiary)).toEqual(['birch']);
    const alderStarved = { bySettlement: { alder: OBLIGOR_STARVED.bySettlement.birch } };
    const beats = entriesOf(advance(worldWith(record, { tick: 20 }), 20, alderStarved), 'treaty_default_detected');
    expect(beats).toHaveLength(1);
    expect(beats[0].settlementNames).toEqual(['Birchmoor', 'Alderbury']);
  });

  it('the stream term the pact carries is a real catalogue clause (the fixture is not vacuous)', () => {
    const record = pactOf(mintPact());
    expect(record.terms.map((term) => term.type)).toEqual(['resource_share']);
    expect(TERM_CATALOG.resource_share.family).toBe('economic');
  });
});

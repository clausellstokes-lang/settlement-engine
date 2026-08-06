/**
 * pactFormation.test.js — GR-2's pin set, driven through the real stage.
 *
 * The volume names these pins and says NEGATIVE HARDEST, so most of what follows asserts
 * what a refusal does NOT do: no grievance, no casus, no second instrument, no ratchet in
 * either direction. Each one runs the stage end to end rather than calling an internal,
 * because the failure these exist to catch is a stage that stopped calling the thing that
 * was proved in isolation.
 *
 * THE FIXTURE IS DELIBERATELY THE SAME ONE THE DORMANCY FENCE USES. A fence run against a
 * quieter world than the pins is a fence proving that nothing happened where nothing was
 * going to.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  PACT_DRAFT_LENS,
  PACT_FORMATION_TUNING,
  advancePeacetimePacts,
  answerPactProposal,
  draftPactSheet,
  reserveFor,
} from '../../src/domain/worldPulse/pactFormation.js';
import { pactProposalsOf } from '../../src/domain/worldPulse/pactProposals.js';
import { lineageOf, provenanceOf } from '../../src/domain/worldPulse/pactAmendment.js';
import { treatyBlocksWar, treatyLedgerOf } from '../../src/domain/worldPulse/treatyEnforcement.js';
import { mintSovereigntySaleTreaties } from '../../src/domain/worldPulse/peaceTermsSale.js';
import { repudiableTreatyPairs } from '../../src/domain/worldPulse/treatyBreach.js';
import { PACT_TRIGGERS_PRODUCED } from '../../src/domain/worldPulse/pactTriggers.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { hopWeeks } from '../../src/domain/spatial/distanceRead.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import {
  DUE_TICK, OPEN_TICK, SEAT, pactBeliefs, pactSnapshot, pactWorld, relKey,
} from '../helpers/pactFixture.js';

const F = PACT_FORMATION_TUNING;

/** Open at OPEN_TICK, then answer at DUE_TICK. Returns both passes. */
function openThenAnswer(worldState, snapshot = pactSnapshot()) {
  const first = advancePeacetimePacts({ snapshot, worldState, settlementUpdates: [], tick: OPEN_TICK });
  const second = advancePeacetimePacts({
    snapshot, worldState: first.worldState, settlementUpdates: [], tick: DUE_TICK,
  });
  return { first, second };
}

const endingOf = (pass) => pass.receipts.find((r) => r.ending)?.ending;
const receiptOf = (pass, kind) => pass.receipts.find((r) => r.kind === kind);

describe('THE LIT WALKTHROUGH, SPELLED OUT', () => {
  test('a world whose rules literally say `pactFormationEnabled: true` forms a pact', () => {
    // ⚠ THE FLAG IS SPELLED AS A LITERAL HERE ON PURPOSE, and this is the only place in
    // the battery that does it. Everything else builds the world through `pactWorld`,
    // which composes the key dynamically so the ABSENT-vs-FALSE differential can drive a
    // truthy imposter through the same builder — and a dynamically composed key is
    // INVISIBLE to `tests/property/mechanismLitCoverage.test.js`, whose flag scanner looks
    // for `<flag>: true` in the test corpus. Without this test the walker would record the
    // flag as having no lit walkthrough at all, which would have been false — the fence
    // and every pin below light it — but unfalsifiably so. So the coverage is made
    // VISIBLE rather than argued into a registry exemption.
    const worldState = {
      ...pactWorld({}),
      simulationRules: { pactFormationEnabled: true },
    };
    const { second } = openThenAnswer(worldState);
    expect(endingOf(second)).toBe('signed');
    expect(Object.keys(treatyLedgerOf(second.worldState))).toEqual(['A>B']);
  });
});

describe('THE PROPOSAL — a crossing, priced and carried', () => {
  test('a believed demand opens a proposal with its transport mode on the record', () => {
    const { first } = openThenAnswer(pactWorld({ flag: true }));
    const rows = pactProposalsOf(first.worldState);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ from: 'A', to: 'B', trigger: 'trade_demand', state: 'open' });
    // THE TRANSPORT-MODE PIN (§3's cross-program disclosure): present on the record and on
    // the receipt built from it, in BOTH spine states.
    expect(rows[0].transport).toBe('abstract');
    expect(receiptOf(first, 'pact_proposed').transport).toBe('abstract');
  });

  test('with the errand spine LIT the same crossing travels by ENVOY', () => {
    const { first } = openThenAnswer(pactWorld({ flag: true, rules: { errandSpineEnabled: true } }));
    const rows = pactProposalsOf(first.worldState);
    expect(rows[0].transport).toBe('envoy');
    expect(receiptOf(first, 'pact_proposed').transport).toBe('envoy');
    // THE TRANSPORT-AGREEMENT BAND (§6 seam 3): the clock is the ROADS', so lighting the
    // spine changes WHO carries the word and never HOW LONG it takes.
    const dark = pactProposalsOf(openThenAnswer(pactWorld({ flag: true })).first.worldState);
    expect(rows[0].answerDueTick).toBe(dark[0].answerDueTick);
  });
});

describe('THE ANSWER — a two-sided conjunction, both arms load-bearing', () => {
  test('SIGNED: the offer clears the reserve and the reliance can be carried', () => {
    const { second } = openThenAnswer(pactWorld({ flag: true }));
    expect(endingOf(second)).toBe('signed');
    const ledger = treatyLedgerOf(second.worldState);
    expect(Object.keys(ledger)).toEqual(['A>B']);
    expect(provenanceOf(ledger['A>B'])).toBe('negotiated');
  });

  test('THE RECIPROCAL SHEET is ONE instrument carrying two opposed beneficiaries', () => {
    const { second } = openThenAnswer(pactWorld({ flag: true }));
    const treaty = treatyLedgerOf(second.worldState)['A>B'];
    expect(treaty.terms).toHaveLength(2);
    expect(treaty.terms.map((t) => t.beneficiary).sort()).toEqual(['A', 'B']);
    expect(new Set(treaty.terms.map((t) => t.family))).toEqual(new Set(['economic']));
    // ONE lineage act, and its term ids are DISTINCT — the reciprocal-id defect's pin.
    const history = lineageOf(treaty);
    expect(history).toHaveLength(1);
    expect(new Set(history[0].termIds).size).toBe(2);
  });

  test('THE INSTRUMENT RUNS FROM THE SIGNATURE, not from the asking', () => {
    const { second } = openThenAnswer(pactWorld({ flag: true }));
    const treaty = treatyLedgerOf(second.worldState)['A>B'];
    expect(treaty.mintedTick).toBe(DUE_TICK);
    for (const term of treaty.terms) {
      expect(term.mintedTick).toBe(DUE_TICK);
      // …and the SPAN the catalog gave it is preserved exactly, not truncated by the wait.
      expect(term.expiresTick - term.mintedTick).toBe(208);
    }
  });

  test('NO OVERLAP: the value arm alone fails, and the feed carries nothing louder', () => {
    // A one-sided demand: B believes it needs nothing from A, so B's own reserve is never
    // met and the two-sided conjunction fails on arm ONE.
    const oneSided = pactWorld({
      flag: true,
      beliefs: pactBeliefs({ bSeesA: { scarcityBands: { raw_material: 'scant' } } }),
    });
    const { second } = openThenAnswer(oneSided);
    expect(endingOf(second)).toBe('no_overlap');
    expect(treatyLedgerOf(second.worldState)).toBeFalsy();
    // The proposal record carries the receipt, and nothing mints a news kind for it.
    expect(receiptOf(second, 'pact_no_overlap').receipt).toContain('did not reach what this court asked');
    expect(second.newsEntries).toHaveLength(0);
  });

  test('THE DEPENDENCY FEAR: the counterforce WINS on the demand\'s own evidence', () => {
    // ONE fixture, run twice, differing ONLY in the pair's existing reliance axes. The
    // demand that signed above is refused here — by the same numbers that invited it.
    const bound = pactWorld({ flag: true, relationship: { dependency: 0.95, leverage: 0.05 } });
    const { second } = openThenAnswer(bound);
    expect(endingOf(second)).toBe('refused');
    expect(treatyLedgerOf(second.worldState)).toBeFalsy();
    expect(receiptOf(second, 'pact_refused').receipt)
      .toContain('leans on this neighbour further than it can lean back');
  });

  test('THE SERIAL DISAVOWER is refused where a clean lineage is accepted', () => {
    // GR-4's charge, consumed HERE. A negative credibility score on the PROPOSER raises the
    // responder's reserve; the clean lineage pays nothing at all.
    const clean = openThenAnswer(pactWorld({ flag: true, credibility: { A: { score: 0 } } }));
    expect(endingOf(clean.second)).toBe('signed');
    const disavowed = openThenAnswer(pactWorld({
      flag: true, credibility: { A: { score: -1, lastUpdateTick: OPEN_TICK } },
    }));
    expect(endingOf(disavowed.second)).toBe('no_overlap');
    expect(receiptOf(disavowed.second, 'pact_no_overlap').receipt)
      .toContain('will not treat with this court on its word alone');
    // CLEAN-BY-ABSENCE: a world with no credibility ledger at all reads exactly like a
    // world whose courts have never lied — the §3 declared degraded arm.
    expect(reserveFor({ worldState: pactWorld({ flag: true }), responderId: 'B', proposerId: 'A', tick: 20 }).reserve01)
      .toBe(reserveFor({ worldState: pactWorld({ flag: true, credibility: { A: { score: 0 } } }), responderId: 'B', proposerId: 'A', tick: 20 }).reserve01);
  });
});

describe('THE REFUSAL, REMEMBERED — and what it deliberately does not do', () => {
  test('a refusal mints NO grievance and NO casus — a banded trust delta and a memory', () => {
    const bound = pactWorld({ flag: true, relationship: { dependency: 0.95, leverage: 0.05 } });
    const { second } = openThenAnswer(bound);
    const relation = second.worldState.relationshipStates[relKey('A', 'B')];
    // The memory exists…
    const points = relation.turningPoints;
    expect(points).toHaveLength(1);
    expect(points[0].kind).toBe('pact_refused');
    // …the trust moved by exactly the banded delta…
    expect(relation.trust).toBeCloseTo(0.6 + F.REFUSAL_TRUST_DELTA, 10);
    // …and NOTHING else was touched. No grievance ledger, no casus, no incident.
    expect(relation.recentIncidents).toBeUndefined();
    expect(second.worldState.grievances).toBeUndefined();
    expect(second.worldState.casusBelli).toBeUndefined();
    expect(second.newsEntries).toHaveLength(0);
  });

  test('THE SPAM BOUND: a remembered refusal silences the pair for the cooldown', () => {
    const bound = pactWorld({ flag: true, relationship: { dependency: 0.95, leverage: 0.05 } });
    const { second } = openThenAnswer(bound);
    // Immediately after the refusal the pair is quiet …
    const soon = advancePeacetimePacts({
      snapshot: pactSnapshot(), worldState: second.worldState, settlementUpdates: [], tick: DUE_TICK + 1,
    });
    expect(pactProposalsOf(soon.worldState)).toHaveLength(0);
    // … and it is the COOLDOWN doing it, not a permanent bar: past the band it may ask again.
    const later = advancePeacetimePacts({
      snapshot: pactSnapshot(),
      worldState: second.worldState,
      settlementUpdates: [],
      tick: DUE_TICK + F.REFUSAL_COOLDOWN_TICKS + 1,
    });
    expect(pactProposalsOf(later.worldState).length).toBeGreaterThan(0);
  });
});

describe('THE POSTURE — same evidence, two courts, two outcomes, both receipted', () => {
  test('a bold court accepts what a cautious court refuses, and both say why', () => {
    // A PARTIAL reciprocal demand: B believes A merely `sufficient` in what B lacks, so the
    // offer lands BETWEEN the two reserves. That is what makes this a discriminator rather
    // than a fixture both postures would answer the same way.
    const withAppetite = (stock01) => pactWorld({
      flag: true,
      beliefs: pactBeliefs({ bSeesA: { scarcityBands: { raw_material: 'sufficient' } } }),
      rules: { strategicPostureEnabled: true },
      dispositionStats: { B: { appetite: { stock01, present: true } } },
    });
    const cautious = openThenAnswer(withAppetite(0));
    const bold = openThenAnswer(withAppetite(1));
    expect(endingOf(cautious.second)).toBe('no_overlap');
    expect(endingOf(bold.second)).toBe('signed');
    // OUT-OF-POSTURE IS PRICED, NEVER FORBIDDEN: the receipt names its evidence either way.
    for (const pass of [cautious.second, bold.second]) {
      expect(pass.receipts.find((r) => r.ending).receipt).toContain("court's posture reads");
    }
    expect(F.OUT_OF_POSTURE_PRICE01).toBeGreaterThan(0);
  });
});

describe('THE STANDALONE NAP — the sentence the survey said could not be written', () => {
  const threatWorld = () => pactWorld({
    flag: true,
    beliefs: {
      // `strengthBand` is an INTEGER rung (0..4), never a word — the read bands it and a
      // word would silently read as the neutral rung.
      A: { [SEAT]: { B: {}, C: { strengthBand: 4 }, D: { strengthBand: 4 }, E: { strengthBand: 4 } } },
      B: { [SEAT]: { A: {} } },
    },
    relationshipStates: {
      [relKey('A', 'B')]: { relationshipType: 'trade_partner', trust: 0.6 },
      [relKey('A', 'C')]: { relationshipType: 'hostile' },
      [relKey('C', 'D')]: { relationshipType: 'allied', pactStrength: 0.9 },
      [relKey('C', 'E')]: { relationshipType: 'allied', pactStrength: 0.9 },
    },
  });

  test('a shared threat drafts ONE symmetric non-aggression clause', () => {
    const { first } = openThenAnswer(threatWorld(), pactSnapshot({ withThreat: true }));
    const nap = pactProposalsOf(first.worldState).find((p) => p.trigger === 'shared_threat');
    expect(nap).toBeTruthy();
    expect(nap.sheet.terms).toHaveLength(1);
    expect(nap.sheet.terms[0]).toMatchObject({
      type: 'non_aggression', family: 'security', beneficiary: 'both',
    });
  });

  test('NAP SYMMETRY: a peacetime pact blocks BOTH openers and stays repudiable at cost', () => {
    // The artifact is the same artifact, so the war-block read and the repudiation gate
    // are the ones the war settlement already had — asserted through THEIR readers, not
    // re-implemented here.
    const signed = openThenAnswer(pactWorld({
      flag: true, rules: { warLayerEnabled: true, peaceEngineEnabled: true },
    })).second.worldState;
    const ledger = treatyLedgerOf(signed);
    const withNap = {
      ...signed,
      spatialLedgers: {
        ...signed.spatialLedgers,
        treaties: {
          'A>B': {
            ...ledger['A>B'],
            terms: [{
              type: 'non_aggression', family: 'security', beneficiary: 'both',
              magnitude: 1, mintedTick: DUE_TICK, expiresTick: DUE_TICK + 400,
              complianceState: 'honored', trueState: 'honored', burden01: 0,
            }],
          },
        },
      },
    };
    expect(treatyBlocksWar(withNap, 'A', 'B', DUE_TICK + 1)).toBeTruthy();
    expect(treatyBlocksWar(withNap, 'B', 'A', DUE_TICK + 1)).toBeTruthy();
    // Through WR-0c's OWN exported composer — the surface the realm verb actually offers
    // from — rather than a module-private predicate, so this pin tracks what a DM can do.
    const repudiable = repudiableTreatyPairs(withNap, DUE_TICK + 1);
    expect(repudiable.map((p) => [p.fromId, p.toId].sort().join('|'))).toContain('A|B');
  });
});

describe('THE DRAFT LENS — and the tombstone tripwire under it', () => {
  test('every PRODUCED trigger is in the lens, and two rows are deliberately empty', () => {
    expect(Object.keys(PACT_DRAFT_LENS).sort()).toEqual([
      'faith_communion', 'migration_pressure', 'renewal', 'shared_threat', 'trade_demand',
    ]);
    expect(PACT_DRAFT_LENS.trade_demand).toBe('resource_share');
    expect(PACT_DRAFT_LENS.shared_threat).toBe('non_aggression');
  });

  test('⚠ TRIPWIRE — faith and population rows are EMPTY until GR-3 mints their families', () => {
    // THIS TEST IS AN INSTRUCTION, and it reds by recorded design the day GR-3 lands. When
    // it does: widen PACT_DRAFT_LENS in the SAME commit as the catalog rows, and move the
    // reachability obligation for those two triggers onto that commit. Do not delete this
    // block without doing that — the orphan-vocabulary law is what it enforces.
    expect(PACT_DRAFT_LENS.faith_communion).toBe('');
    expect(PACT_DRAFT_LENS.migration_pressure).toBe('');
    expect(PACT_DRAFT_LENS.renewal).toBe('');
    // A trigger with no draftable family is REFUSED VISIBLY, never silently dropped.
    const drafted = draftPactSheet({
      trigger: 'faith_communion', fromId: 'A', toId: 'B', reciprocal: false, tick: 10,
    });
    expect(drafted.terms).toHaveLength(0);
    expect(drafted.refusal).toBe('no_draftable_family');
  });

  test('FOUR-TRIGGER REACHABILITY: every produced trigger has a live scorer', () => {
    // The vocabulary tombstone is pinned in pactTriggers.test.js; this half asserts the
    // lens is TOTAL over the produced set, so a fifth trigger cannot arrive without a row.
    for (const trigger of PACT_TRIGGERS_PRODUCED) {
      expect(Object.prototype.hasOwnProperty.call(PACT_DRAFT_LENS, trigger)).toBe(true);
    }
  });
});

describe('THE SALE-COEXISTENCE PIN — one record at the pair key, and the sale door unchanged', () => {
  test('a pair holding a live sale deed signs a pact, and the deed GROWS a clause', () => {
    const sale = mintSovereigntySaleTreaties({
      sales: [{ assetId: 'holding', sellerId: 'A', buyerId: 'B', components: [] }],
      worldState: pactWorld({ flag: true }),
      tick: 1,
    });
    expect(sale.minted).toBe(true);
    const before = treatyLedgerOf(sale.worldState);
    expect(Object.keys(before)).toHaveLength(1);

    const { second } = openThenAnswer(sale.worldState);
    expect(endingOf(second)).toBe('signed');
    const after = treatyLedgerOf(second.worldState);
    // ONE record at the pair key (V-1) — the formation AMENDED rather than competing.
    expect(Object.keys(after)).toEqual(Object.keys(before));
    const treaty = after[Object.keys(after)[0]];
    expect(treaty.terms.some((t) => t.type === 'sovereignty_transfer')).toBe(true);
    expect(treaty.terms.some((t) => t.type === 'resource_share')).toBe(true);
    // The deed's ORIGIN is unchanged — an amendment does not rewrite how it came to be.
    expect(lineageOf(treaty).at(-1).act).toBe('amended');
    expect(receiptOf(second, 'pact_signed').amended).toBe(true);
  });

  test('§7 Q4 FENCED BASELINE: the sale door still REFUSES a bound pair, in its own word', () => {
    const first = mintSovereigntySaleTreaties({
      sales: [{ assetId: 'holding', sellerId: 'A', buyerId: 'B', components: [] }],
      worldState: pactWorld({ flag: true }),
      tick: 1,
    });
    const second = mintSovereigntySaleTreaties({
      sales: [{ assetId: 'other', sellerId: 'A', buyerId: 'B', components: [] }],
      worldState: first.worldState,
      tick: 2,
    });
    // Unchanged by GR-2, and pinned so the recorded post-GR-2 harmonization starts from a
    // measured baseline rather than from a memory of one.
    expect(second.minted).toBe(false);
    expect(second.refusal).toBe('pair_already_bound');
    expect(second.worldState).toBe(first.worldState);
  });
});

describe('THE WAR-OVERTAKEN CLOSURE, through the stage', () => {
  test('a war between courts who signed in peace ends what they wrote, exactly once', () => {
    const signed = openThenAnswer(pactWorld({ flag: true })).second.worldState;
    const atWar = {
      ...signed,
      relationshipStates: {
        [relKey('A', 'B')]: { ...signed.relationshipStates[relKey('A', 'B')], relationshipType: 'hostile' },
      },
    };
    const pass = advancePeacetimePacts({
      snapshot: pactSnapshot(), worldState: atWar, settlementUpdates: [], tick: DUE_TICK + 5,
    });
    const closure = receiptOf(pass, 'pact_broken_by_war');
    expect(closure).toBeTruthy();
    expect(closure.ending).toBe('broken_by_war');
    expect(closure.closed).toHaveLength(2);
    // EXACTLY ONCE: the next tick finds nothing left to close.
    const again = advancePeacetimePacts({
      snapshot: pactSnapshot(), worldState: pass.worldState, settlementUpdates: [], tick: DUE_TICK + 6,
    });
    expect(receiptOf(again, 'pact_broken_by_war')).toBeUndefined();
  });
});

describe('WHAT THIS WAVE DELIBERATELY DOES NOT MINT', () => {
  test('ZERO news kinds, in every arm — a tripwire for GR-3', () => {
    // Recorded design (see the module header): the Herald sentences land with GR-3, which
    // mints the families they announce. This reds the day a beat is added here, which is
    // the instruction to land the five Herald joins in that same commit.
    for (const world of [
      pactWorld({ flag: true }),
      pactWorld({ flag: true, relationship: { dependency: 0.95, leverage: 0.05 } }),
    ]) {
      const { first, second } = openThenAnswer(world);
      expect(first.newsEntries).toEqual([]);
      expect(second.newsEntries).toEqual([]);
    }
  });

  test('every receipt names its ending from the CLOSED formation vocabulary', () => {
    const { first, second } = openThenAnswer(pactWorld({ flag: true }));
    for (const receipt of [...first.receipts, ...second.receipts]) {
      expect(typeof receipt.receipt).toBe('string');
      expect(receipt.receipt.length).toBeGreaterThan(0);
      if (receipt.ending) {
        expect(['broken_by_war', 'expired_unanswered', 'no_overlap', 'refused', 'signed'])
          .toContain(receipt.ending);
      }
    }
  });
});

describe('THE ANSWER, driven directly — so both arms are provably separable', () => {
  const proposal = {
    id: 'pact.10.a.b.trade_demand',
    from: 'A',
    to: 'B',
    trigger: 'trade_demand',
    sheet: { terms: [{ type: 'resource_share', family: 'economic', beneficiary: 'A', magnitude: 0.25 }] },
    openedTick: OPEN_TICK,
    answerDueTick: DUE_TICK,
    state: 'open',
    transport: 'abstract',
  };

  test('arm ONE alone decides `no_overlap`; arm TWO alone decides `refused`', () => {
    const value = answerPactProposal({
      worldState: pactWorld({ flag: true }), proposal, responderDemand01: 0, tick: DUE_TICK,
    });
    expect(value.verdict).toBe('no_overlap');
    const reliance = answerPactProposal({
      worldState: pactWorld({ flag: true, relationship: { dependency: 0.95, leverage: 0.05 } }),
      proposal,
      responderDemand01: 1,
      tick: DUE_TICK,
    });
    expect(reliance.verdict).toBe('refused');
    // …and with BOTH arms satisfied it signs. Three outcomes, three causes, no overlap.
    const both = answerPactProposal({
      worldState: pactWorld({ flag: true }), proposal, responderDemand01: 1, tick: DUE_TICK,
    });
    expect(both.verdict).toBe('signed');
  });
});

describe('THE STAGE READS THE ROADS — a non-null digest reaches the row', () => {
  /**
   * THE CONTROLLED COMPARISON (WR-10's `realmDigest` idiom, and it is load-bearing here for
   * the same reason it was there): `hopWeeks` normalizes through the digest's OWN
   * `weeksPerCost` calibration, derived from the placements the digest was built with — so
   * "move the two courts further apart" in a THREE-seat realm produces a SHORTER march, not
   * a longer one. Both realms below carry the SAME forty placements and differ only in
   * which seats A and B occupy.
   * @param {number} aSeat @param {number} bSeat
   */
  const seatedRealm = (aSeat, bSeat) => {
    const pack = makeGridPack({ cols: 48, rows: 36 });
    const seats = placeSettlements(pack, 40);
    const placements = seats.map((seat, i) => ({
      id: i === aSeat ? 'A' : i === bSeat ? 'B' : `filler${String(i).padStart(3, '0')}`,
      cellId: seat.cellId,
    }));
    return buildSpatialDigest({ pack, placements });
  };

  test('a FAR pair is owed its answer LATER than a NEAR one, by the real road', () => {
    // The stage's own dark arm was the only one any test drove: every existing pin passes
    // `digest` as undefined, so the whole measured branch of `answerDueTickFor` was
    // unreachable from the stage. This is that branch, driven through the real stage.
    const near = seatedRealm(0, 1);
    const far = seatedRealm(0, 39);
    // ANTI-VACUITY: the two realms really do price the same pair differently, so a null
    // read on either side would red HERE rather than silently collapsing the comparison.
    expect(hopWeeks(near, 'A', 'B')).toBe(1);
    expect(hopWeeks(far, 'A', 'B')).toBe(7);

    const openWith = (digest) => advancePeacetimePacts({
      snapshot: pactSnapshot(), worldState: pactWorld({ flag: true }),
      settlementUpdates: [], tick: OPEN_TICK, digest,
    });
    const nearRow = pactProposalsOf(openWith(near).worldState)[0];
    const farRow = pactProposalsOf(openWith(far).worldState)[0];
    expect(nearRow.openedTick).toBe(OPEN_TICK);
    expect(farRow.openedTick).toBe(OPEN_TICK);
    // Two legs plus the deliberation, on each realm's own measured road.
    expect(nearRow.answerDueTick - OPEN_TICK).toBe(4);
    expect(farRow.answerDueTick - OPEN_TICK).toBe(16);
    expect(farRow.answerDueTick).toBeGreaterThan(nearRow.answerDueTick);
    // …and the unmeasurable world (no digest at all) still floors where it always did, so
    // wiring the road in did not move the aspatial campaign's clock.
    const aspatialRow = pactProposalsOf(openWith(undefined).worldState)[0];
    expect(aspatialRow.answerDueTick).toBe(DUE_TICK);
  });
});

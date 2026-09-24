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
 * ── SHIFT RECORD ─────────────────────────────────────────────────────────────────────────
 * A behaviour move this suite pins is written here, or it is an undeclared shift.
 *
 * 2026-08-30 — FIRST RECORD (lane T7 · HYGIENE, car TE-UNITS-1). ⚠⚠ A DELIBERATE, DECLARED
 *   PRODUCTION SHIFT, authorized at ODQ §763.2 and diagnosed at §759.2 (PACT-STRENGTH-ZERO).
 *
 *   CAUSE, in one sentence: `advancePeacetimePacts`'s DEFAULT strength reader consumed
 *   `settlement.militaryStrength`, a field NO production code has ever written — the only
 *   writer anywhere in the repo was `tests/helpers/pactFixture.js` — and the sole production
 *   caller (`settlementLifecycleKernel.js`) injects no `strengthFor`, so every court in every
 *   live world priced at exactly 0.
 *
 *   WHAT MOVES, and it is a single mechanism: the strength reader feeds NOTHING but
 *   `readAllianceWebRisk` (via `crossingsFor`, and only when a hostile third party exists),
 *   whose `band` is read by `scoreSharedThreat`, whose FLOOR BAND is `'quiet'`
 *   (`pactTriggers.js:89`) — and a floor band returns NO_CROSSING. So with every strength at
 *   0 the `shared_threat` trigger was STRUCTURALLY UNREACHABLE in production. The three other
 *   triggers (trade demand, faith communion, migration pressure) never read strength at all
 *   and are byte-unaffected. Nothing persisted changes shape; no golden covers this lane.
 *
 *   MEASURED, on 150 REAL settlements from `generateSettlementPipeline` (6 tiers × 5 cultures
 *   × 5 terrains), with the enemy-ally rows built by the estate's own `canonicalAllianceRows`:
 *     · OLD reader `settlement.militaryStrength` — n=150, min 0, median 0, max 0, NONZERO 0.
 *       Not one generated settlement carries the field.
 *     · NEW reader `settlementStrength(item, buildPressureSummary(pressureIdx, id))` —
 *       n=150, min 0.4800, median 0.7757, max 0.9997, nonzero 150. With EVERY pressure
 *       saturated at 1.0 (the honest floor, since each pressure term only subtracts):
 *       min 0.0400, median 0.3357, max 0.5597.
 *     · Web band over 75 enemy-ally pairs: OLD `{quiet: 75}` → NEW
 *       `{decisive: 37, pressing: 34, present: 4}` — `quiet` 75/75 → 0/75.
 *   ⇒ The shared-threat pact goes from never-drafted to draftable. That is the cure, not a
 *   side effect: the lane was shipping one of its four triggers dead.
 *
 *   THE FIXTURE MOVED WITH IT, and had to: `pactFixture.pactSnapshot`'s armed courts D and E
 *   are now `{ tier: 'metropolis', population: 60000 }` (≈0.99 through the real derivation)
 *   in place of the literal `{ militaryStrength: 0.95 }` this file was the world's only
 *   writer of. CONTROL EXECUTED: with `armed = {}` the shared-threat rung drops from the
 *   composable pair to the bare NAP and this suite REDS — the arm is not vacuous.
 *
 * 2026-09-24 — SECOND RECORD (cure lane LIT1b-pre, unit U1, FPQ-35). ⚠ A DECLARED LIT-PATH SHIFT,
 *   in the dependency map's D2 row. CAUSE, in one sentence: every relationship read in this stage
 *   minted `rel.<a>.<b>` from a bare pair, while every relationship writer keys its record by the
 *   regional edge's id (`edge.<a>.<b>`), so in a live world the stage found NO record: the hostility
 *   read, the refusal memory, the cooldown, the war-overtaken closure and the reliance axes were
 *   all dead, and shared_threat could never find its threat. WHAT MOVES: lit, a pair joined by an
 *   edge is now read through `edgeKeyBetween`, so those five reads see the live record; dark,
 *   nothing (the stage returns before any read). THE FIXTURE MOVED WITH IT: `pactSnapshot` now
 *   declares the edge of every pair whose record it writes (id-less, so the fixture's records keep
 *   their keys and every earlier arm reads what it read before), and the FPQ-35 block below drives
 *   the production shape: ids minted by the region graph's normalizer, records by the plane's writer.
 *
 * 2026-09-24 — THIRD RECORD (cure lane LIT1b-pre, unit U2, FPQ-27). ⚠ A DECLARED LIT-PATH SHIFT, the
 *   map's D1 row. CAUSE, in one sentence: a court's own devotion was read off
 *   `settlement.religionState`, which nothing in src writes, so the faith_communion occasion's self
 *   leg was always empty. WHAT MOVES: the self leg now reads the court's own record at
 *   `worldState.religionStates[id]` (the faith subsystem's), so faith_communion can cross wherever a
 *   court keeps a faith AND believes a neighbour's devotion. The believed leg is written only by
 *   SP-B's devotion family, lit in no preset, so no preset world moves; dark, nothing moves.
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
  pactSignedBeat,
  reserveFor,
} from '../../src/domain/worldPulse/pactFormation.js';
import { grammarReceipt } from '../../src/domain/worldPulse/grammarNews.js';
import { appendWizardNewsEntries, ensureWizardNewsFeed } from '../../src/domain/region/wizardNews.js';
import { DECREE_CAUSE } from '../../src/domain/worldPulse/decreeHook.js';
import { pactProposalsOf } from '../../src/domain/worldPulse/pactProposals.js';
import { lineageOf, provenanceOf, termIdOf } from '../../src/domain/worldPulse/pactAmendment.js';
import { treatyBlocksWar, treatyLedgerOf } from '../../src/domain/worldPulse/treatyEnforcement.js';
import { mintSovereigntySaleTreaties } from '../../src/domain/worldPulse/peaceTermsSale.js';
import { repudiableTreatyPairs } from '../../src/domain/worldPulse/treatyBreach.js';
import { PACT_TRIGGERS_PRODUCED } from '../../src/domain/worldPulse/pactTriggers.js';
import { TERM_CATALOG, orderTermsByAsk } from '../../src/domain/worldPulse/peaceTermsCatalog.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { hopWeeks } from '../../src/domain/spatial/distanceRead.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { edgeIdFor, ensureRegionalGraph } from '../../src/domain/region/graph.js';
import { ensureRelationshipStatesForGraph } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { ensureRelationshipState, relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipState.js';
import { ensureReligionState } from '../../src/domain/worldPulse/religionState.js';
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

/** The fixture's courts, NAMED (LIT1b-pre U4). The fixture spells each court's name as its id,
 *  and the signing beat is minted only when both courts resolve to a real name, so every arm that
 *  means to hear the Herald drives this snapshot. */
const COURT_NAMES = Object.freeze({ A: 'Ashford', B: 'Irontown', C: 'Crowmere', D: 'Dunmoor', E: 'Elmstead' });
/** @param {{withThreat?: boolean}} [args] */
const namedSnapshot = (args) => {
  const base = pactSnapshot(args);
  return {
    ...base,
    settlements: base.settlements.map((item) => ({
      ...item, name: COURT_NAMES[item.id], settlement: { ...item.settlement, name: COURT_NAMES[item.id] },
    })),
  };
};

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

  test('a shared threat drafts SYMMETRIC security clauses, and the rung says how many', () => {
    // ⚠ AN INTENDED LIT-PATH SHIFT, MEASURED. This fixture's web reads `decisive` and its
    // crossing scores well above the 0.75 rung, so the occasion now earns the composable
    // pair rather than the bare NAP it drafted when the lens held one type per trigger.
    // Both clauses are SECURITY, so both are `both` — mutual, with nothing handed over.
    const { first } = openThenAnswer(threatWorld(), pactSnapshot({ withThreat: true }));
    const nap = pactProposalsOf(first.worldState).find((p) => p.trigger === 'shared_threat');
    expect(nap).toBeTruthy();
    expect(nap.sheet.terms.map((t) => t.type)).toEqual(['non_aggression', 'mutual_defense']);
    for (const term of nap.sheet.terms) {
      expect(term).toMatchObject({ family: 'security', beneficiary: 'both' });
    }
    // …and the LOWER rung is still reachable from this same drafter, so the pair above is
    // the score's doing rather than a ladder that lost its first step.
    expect(draftPactSheet({
      trigger: 'shared_threat', fromId: 'A', toId: 'B', reciprocal: false, tick: 10, score01: 0.5,
    }).terms.map((t) => t.type)).toEqual(['non_aggression']);
  });

  test('THE §759.2 REGRESSION ARM: production-shaped courts price the web, and a zero reader kills it', () => {
    // THE DEFECT THIS EXISTS TO CATCH is a lane whose DEFAULT strength reader consumes a
    // field only a test fixture writes. So the world here is shaped the way the GENERATOR
    // shapes settlements — tier and population, never `militaryStrength` — and the arm
    // asserts the shared-threat occasion still crosses. Under the old default every court
    // read 0, the web banded `quiet`, `scoreSharedThreat` returned NO_CROSSING, and this
    // test would have been RED on the day the defect shipped.
    const base = pactSnapshot({ withThreat: true });
    const production = {
      ...base,
      settlements: base.settlements.map((it) => {
        const { militaryStrength: _fixtureOnlyField, ...settlement } = it.settlement;
        return { ...it, settlement: { ...settlement, tier: 'city', population: 12000 } };
      }),
    };
    // The premise, asserted rather than assumed: not one court carries the fixture-only field.
    expect(production.settlements.some((it) => 'militaryStrength' in it.settlement)).toBe(false);
    const { first } = openThenAnswer(threatWorld(), production);
    expect(pactProposalsOf(first.worldState).some((p) => p.trigger === 'shared_threat')).toBe(true);

    // ANTI-VACUITY, and it is the whole point: inject the OLD production reality — every
    // strength 0 — into the same world and the occasion disappears. The assertion above is
    // therefore the strength read's doing and not the fixture's beliefs.
    const zeroed = advancePeacetimePacts({
      snapshot: production, worldState: threatWorld(), settlementUpdates: [],
      tick: OPEN_TICK, strengthFor: () => 0,
    });
    expect(pactProposalsOf(zeroed.worldState).some((p) => p.trigger === 'shared_threat')).toBe(false);
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

describe('THE DRAFT LENS — the rung ladders, and what an occasion has earned', () => {
  /** One sheet, drafted through the REAL producer. Everything below reads the emitted
   *  rows rather than the table, so the ladder and the selection are pinned jointly. */
  const draft = (trigger, score01, reciprocal = false) => draftPactSheet({
    trigger, fromId: 'A', toId: 'B', reciprocal, tick: 10, score01,
  });
  const typesOf = (sheet) => sheet.terms.map((term) => String(term.type));

  test('every PRODUCED trigger is in the lens, and every ladder is frozen authored data', () => {
    // The tombstone this block replaces said faith, population and renewal were EMPTY
    // until their families landed. Three of those four rows are now producers; `renewal`
    // stays empty and is GR-5's, so the tripwire survives as a single named row rather
    // than as a paragraph — the orphan-vocabulary law is what it still enforces.
    expect(Object.keys(PACT_DRAFT_LENS).sort()).toEqual([
      'faith_communion', 'migration_pressure', 'renewal', 'shared_threat', 'trade_demand',
    ]);
    expect(PACT_DRAFT_LENS.renewal).toEqual([]);
    for (const [trigger, ladder] of Object.entries(PACT_DRAFT_LENS)) {
      expect(Object.isFrozen(ladder), trigger).toBe(true);
      for (const rung of ladder) {
        expect(Object.isFrozen(rung), trigger).toBe(true);
        expect(Object.isFrozen(rung.terms), trigger).toBe(true);
        expect(typeof rung.min, trigger).toBe('number');
      }
      // Every produced ladder starts at zero, which is what preserves "a crossed trigger
      // always drafts" — the behaviour this file has asserted since GR-2.
      if (ladder.length) expect(ladder[0].min, trigger).toBe(0);
    }
  });

  test('A1 — at score ZERO each produced ladder writes its lightest term, and refuses nothing', () => {
    expect(typesOf(draft('faith_communion', 0))).toEqual(['shared_rite']);
    expect(typesOf(draft('migration_pressure', 0))).toEqual(['migration_right']);
    expect(typesOf(draft('shared_threat', 0))).toEqual(['non_aggression']);
    expect(typesOf(draft('trade_demand', 0))).toEqual(['resource_share']);
    for (const trigger of ['faith_communion', 'migration_pressure', 'shared_threat', 'trade_demand']) {
      expect(draft(trigger, 0).refusal, trigger).toBe('');
    }
  });

  test('A2 — THE BOUNDARY TABLE exactly: inclusive at `min`, highest rung wins, never a union', () => {
    /** @type {Array<[string, number, string[]]>} */
    const TABLE = [
      ['faith_communion', 0, ['shared_rite']],
      ['faith_communion', 0.44999, ['shared_rite']],
      ['faith_communion', 0.45, ['pilgrimage_right', 'tolerance_guarantee']],
      ['faith_communion', 0.7, ['missionary_access']],
      ['faith_communion', 0.9, ['temple_restitution']],
      ['faith_communion', 1, ['temple_restitution']],
      ['migration_pressure', 0, ['migration_right']],
      ['migration_pressure', 0.6, ['labor_compact']],
      ['migration_pressure', 0.85, ['settlement_provision']],
      ['shared_threat', 0.74999, ['non_aggression']],
      ['shared_threat', 0.75, ['non_aggression', 'mutual_defense']],
      ['trade_demand', 0, ['resource_share']],
      ['trade_demand', 1, ['resource_share']],
    ];
    for (const [trigger, score01, expected] of TABLE) {
      expect(typesOf(draft(trigger, score01)), `${trigger} @ ${score01}`).toEqual(expected);
    }
    // NON-CUMULATIVE is the load-bearing half of the selection: a rung's list is the WHOLE
    // output. An accumulating ladder would give the top faith rung all five faith terms.
    expect(draft('faith_communion', 1).terms).toHaveLength(1);
    // `renewal` is GR-5's empty ladder, and the refusal it produces is PRESERVED, not
    // removed — a trigger with no draftable family is still refused VISIBLY.
    expect(draft('renewal', 1).terms).toEqual([]);
    expect(draft('renewal', 1).refusal).toBe('no_draftable_family');
    // …and so is a trigger the lens never heard of.
    expect(draft('a_trigger_that_never_landed', 1).refusal).toBe('no_draftable_family');
  });

  test('A4 — a malformed score is rung ZERO and an out-of-range one clamps; nothing throws', () => {
    for (const score01 of [NaN, Infinity, -Infinity, undefined, null, 'x', {}, -5]) {
      expect(typesOf(draft('faith_communion', score01)), String(score01)).toEqual(['shared_rite']);
    }
    // Above the ladder it clamps to 1 rather than falling off the top rung.
    expect(typesOf(draft('faith_communion', 5))).toEqual(['temple_restitution']);
    // ANTI-VACUITY: the same drafter really does move off rung 0 for a live score, so the
    // eight rows above are a measurement rather than a function that always answers first.
    expect(typesOf(draft('faith_communion', 0.7))).toEqual(['missionary_access']);
  });

  test('A6 — beneficiary expansion is PER TERM after selection, and it sets the direction', () => {
    // Non-security, one-sided: the PROPOSER is the beneficiary of what it asks for.
    expect(draft('faith_communion', 0.45).terms.map((t) => [t.type, t.beneficiary])).toEqual([
      ['pilgrimage_right', 'A'], ['tolerance_guarantee', 'A'],
    ]);
    // Reciprocal is TWO one-sided terms per type, mirrored — never one symmetric term.
    expect(draft('faith_communion', 0.45, true).terms.map((t) => [t.type, t.beneficiary])).toEqual([
      ['pilgrimage_right', 'A'], ['pilgrimage_right', 'B'],
      ['tolerance_guarantee', 'A'], ['tolerance_guarantee', 'B'],
    ]);
    // Security is SYMMETRIC — `both` — and that is MUTUAL, which is a different fact from
    // reciprocal: both courts hold it and nothing is handed over. Reciprocity cannot
    // change it, so the same rung answers identically with `reciprocal` either way.
    for (const reciprocal of [false, true]) {
      expect(draft('shared_threat', 0.75, reciprocal).terms.map((t) => [t.type, t.beneficiary]))
        .toEqual([['non_aggression', 'both'], ['mutual_defense', 'both']]);
    }
    // Term identity stays unique across the expansion — the reciprocal-id defect's pin.
    expect(new Set(draft('faith_communion', 0.45, true).terms.map(termIdOf)).size).toBe(4);
    // §6.7 THE DIRECTION, read off the EMITTED rows and never restated from the ruling:
    // the party a clause runs TO is owed it, and the OTHER party is the one promising.
    for (const term of draft('faith_communion', 0.45, true).terms) {
      const promiser = term.beneficiary === 'A' ? 'B' : 'A';
      expect(String(term.receipt), String(term.type)).toContain(`${promiser} promises `);
      expect(String(term.receipt), String(term.type)).toContain(` to ${term.beneficiary} for `);
    }
    // NEITHER transfer term is ever emitted symmetric, which is what makes the ruling
    // total over everything these frozen ladders can emit: a mutual clause has no
    // transfer direction to lose, and no `executor: 'transfer'` row can reach `both`.
    const transfers = [draft('faith_communion', 0.9, true), draft('migration_pressure', 0.85, true)];
    for (const sheet of transfers) {
      expect(sheet.terms.length).toBeGreaterThan(0);
      for (const term of sheet.terms) {
        expect(TERM_CATALOG[String(term.type)].executor, String(term.type)).toBe('transfer');
        expect(term.beneficiary, String(term.type)).not.toBe('both');
      }
    }
  });

  test('A7 — the drafted order IS `orderTermsByAsk`\'s own output, derived and never restated', () => {
    // GR-3a shipped this primitive exported and consumed by nothing. This is its intended
    // consumer, and the pin drives the PRIMITIVE rather than repeating the order it
    // produces, so a catalog retune moves the draft and this assertion together.
    const drafted = (trigger, score01) => [...new Set(
      draft(trigger, score01).terms.map((term) => String(term.type)),
    )];
    expect(drafted('faith_communion', 0.45))
      .toEqual([...orderTermsByAsk(['tolerance_guarantee', 'pilgrimage_right'])]);
    expect(drafted('shared_threat', 0.75))
      .toEqual([...orderTermsByAsk(['mutual_defense', 'non_aggression'])]);
    // ANTI-VACUITY: both inputs above are handed to the primitive in the WRONG order, so
    // a draft that never consulted it would disagree here rather than coincide.
    expect([...orderTermsByAsk(['tolerance_guarantee', 'pilgrimage_right'])])
      .toEqual(['pilgrimage_right', 'tolerance_guarantee']);
    expect([...orderTermsByAsk(['mutual_defense', 'non_aggression'])])
      .toEqual(['non_aggression', 'mutual_defense']);
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

describe('FPQ-35 — THE RELATIONSHIP KEYS: the stage reads the record the relationship plane keeps', () => {
  /**
   * THE PRODUCTION SHAPE, end to end. The graph is normalized by the region graph's own builder,
   * which mints every edge id (`edgeIdFor`), and the records are written by the relationship
   * plane's own writer (`ensureRelationshipStatesForGraph`), so each record sits at the edge's id
   * and at no key a bare pair could spell. Before FPQ-35 the stage looked for `rel.<a>.<b>` and
   * found nothing here: no hostility, no refusal memory, no cooldown, no reliance axes.
   * @param {{edges?: Array<Record<string, unknown>>, states?: Record<string, Record<string, unknown>>,
   *   beliefs?: unknown, withThreat?: boolean}} [args]
   */
  const liveRealm = ({ edges, states = {}, beliefs, withThreat = false } = {}) => {
    const graph = ensureRegionalGraph({
      edges: edges || [{ from: 'A', to: 'B', relationshipType: 'trade_partner' }],
    }, { now: null });
    const keyOf = (from, to) => String(relationshipKeyFromEdge(
      graph.edges.find((edge) => edge.from === from && edge.to === to)));
    const existing = Object.fromEntries(Object.entries(states).map(([pair, state]) => {
      const [from, to] = pair.split('>');
      return [keyOf(from, to), state];
    }));
    return {
      keyOf,
      snapshot: { ...pactSnapshot({ withThreat }), regionalGraph: graph },
      worldState: {
        ...pactWorld({ flag: true, ...(beliefs ? { beliefs } : {}) }),
        relationshipStates: ensureRelationshipStatesForGraph(graph, existing),
      },
    };
  };

  test('THE PREMISE: the plane keys a record by its edge id, which no bare pair spells', () => {
    const { keyOf, worldState } = liveRealm();
    expect(keyOf('A', 'B')).toBe(edgeIdFor('A', 'B'));
    // anchored: the key is pinned to the edge id one line above, so this reads a real key.
    expect(keyOf('A', 'B')).not.toBe(relKey('A', 'B'));
    expect(Object.keys(worldState.relationshipStates)).toEqual([keyOf('A', 'B')]);
  });

  test('the RELIANCE AXES and the REFUSAL MEMORY are read from, and written to, that record', () => {
    // The reliance axes decide this answer: at the neutral defaults the same sheet SIGNS (the
    // walkthrough above), so the refusal is the proof the record was read.
    const { keyOf, snapshot, worldState } = liveRealm({
      states: { 'A>B': { relationshipType: 'trade_partner', trust: 0.6, dependency: 0.95, leverage: 0.05 } },
    });
    const { second } = openThenAnswer(worldState, snapshot);
    expect(endingOf(second)).toBe('refused');
    const relation = second.worldState.relationshipStates[keyOf('A', 'B')];
    expect(relation.turningPoints.map((point) => point.kind)).toEqual(['pact_refused']);
    expect(relation.trust).toBeCloseTo(0.6 + F.REFUSAL_TRUST_DELTA, 10);
    // The memory lands on the ONE record the writer keeps: no second key is minted beside it.
    expect(Object.keys(second.worldState.relationshipStates)).toEqual([keyOf('A', 'B')]);
    // THE COOLDOWN reads the same record, so the pair is silent on the next tick.
    const soon = advancePeacetimePacts({
      snapshot, worldState: second.worldState, settlementUpdates: [], tick: DUE_TICK + 1,
    });
    // anchored: the refusal's turning point is pinned on this record above, so no row here is the cooldown.
    expect(pactProposalsOf(soon.worldState)).toHaveLength(0);
  });

  test('A WAR ON A LIVE EDGE closes what the pair signed in peace, exactly once', () => {
    const { keyOf, snapshot, worldState } = liveRealm({
      states: { 'A>B': { relationshipType: 'trade_partner', trust: 0.6 } },
    });
    const signed = openThenAnswer(worldState, snapshot).second.worldState;
    expect(Object.keys(treatyLedgerOf(signed))).toEqual(['A>B']);
    const key = keyOf('A', 'B');
    const atWar = {
      ...signed,
      relationshipStates: {
        ...signed.relationshipStates,
        [key]: ensureRelationshipState(snapshot.regionalGraph.edges[0], {
          ...signed.relationshipStates[key], relationshipType: 'hostile',
        }),
      },
    };
    const pass = advancePeacetimePacts({ snapshot, worldState: atWar, settlementUpdates: [], tick: DUE_TICK + 5 });
    const closure = receiptOf(pass, 'pact_broken_by_war');
    expect(closure).toMatchObject({ ending: 'broken_by_war', fromId: 'A', toId: 'B' });
    expect(closure.closed).toHaveLength(2);
    const again = advancePeacetimePacts({
      snapshot, worldState: pass.worldState, settlementUpdates: [], tick: DUE_TICK + 6,
    });
    // anchored: the closure receipt is pinned present one tick earlier, so its absence here is exactly-once.
    expect(receiptOf(again, 'pact_broken_by_war')).toBeUndefined();
  });

  test('A HOSTILE THIRD COURT on a live edge is the shared threat the pair treats about', () => {
    const { snapshot, worldState } = liveRealm({
      withThreat: true,
      edges: [
        { from: 'A', to: 'B', relationshipType: 'trade_partner' },
        { from: 'A', to: 'C', relationshipType: 'hostile' },
        { from: 'C', to: 'D', relationshipType: 'allied' },
        { from: 'C', to: 'E', relationshipType: 'allied' },
      ],
      states: {
        'C>D': { relationshipType: 'allied', pactStrength: 0.9 },
        'C>E': { relationshipType: 'allied', pactStrength: 0.9 },
      },
      beliefs: {
        A: { [SEAT]: { B: {}, C: { strengthBand: 4 }, D: { strengthBand: 4 }, E: { strengthBand: 4 } } },
        B: { [SEAT]: { A: {} } },
      },
    });
    const first = advancePeacetimePacts({ snapshot, worldState, settlementUpdates: [], tick: OPEN_TICK });
    const threat = pactProposalsOf(first.worldState).find((row) => row.trigger === 'shared_threat');
    expect(threat).toMatchObject({ from: 'A', to: 'B' });
    expect(receiptOf(first, 'pact_proposed').receipt).toContain('Both courts reckon the web around C');
  });
});

describe('FPQ-27 — THE COURT\'S DEVOTION: read where the faith subsystem keeps it', () => {
  /**
   * A COURT WITH A LIT CREED: its patron seated in its own config, and its religion state
   * seeded by the faith subsystem's own seeder (`ensureReligionState`, the constructor
   * `advanceReligionStates` builds every record with) and filed where that writer files it,
   * `worldState.religionStates[id]`. An ascendant patron reads `devout`.
   * @param {string} id
   */
  const litCreed = (id) => ensureReligionState(null, {
    id, name: id, config: { primaryDeitySnapshot: { name: 'The Dawn Warden', _deityRef: 'deity.dawn' } },
  }, 'town');
  /** A believes B `faithful` and nothing else, so the faith occasion is the only one A can find. */
  const faithWorld = (religionStates) => ({
    ...pactWorld({ flag: true, beliefs: pactBeliefs({ aSeesB: { devotionBand: 'faithful' }, bSeesA: {} }) }),
    ...(religionStates ? { religionStates } : {}),
  });
  const openOn = (worldState, settlementUpdates = []) => advancePeacetimePacts({
    snapshot: pactSnapshot(), worldState, settlementUpdates, tick: OPEN_TICK,
  });

  test('a court with a lit creed reports its devotion, and the faith communion crosses on it', () => {
    const first = openOn(faithWorld({ A: litCreed('A') }));
    const communion = pactProposalsOf(first.worldState).find((row) => row.trigger === 'faith_communion');
    expect(communion).toMatchObject({ from: 'A', to: 'B', state: 'open' });
    expect(receiptOf(first, 'pact_proposed').receipt)
      .toContain('Both courts are believed to keep the rites: devout here, faithful there.');
    // ANTI-VACUITY: the belief alone crosses nothing. Without the court's own record the self
    // leg is empty, so the occasion above is the religion state's doing.
    const faithless = openOn(faithWorld(null));
    // anchored: the same world with the creed opens a faith_communion row two assertions above.
    expect(pactProposalsOf(faithless.worldState).map((row) => row.trigger)).toEqual([]);
  });

  test('THE DEAD FIELD IS NOT A SOURCE: the same creed on `settlement.religionState` crosses nothing', () => {
    // The key the stage used to read. Nothing in src writes it; a creed put there by hand is
    // exactly the record no live world can carry, and the stage must not see it.
    const dead = openOn(faithWorld(null), [
      { saveId: 'A', settlement: { ...pactSnapshot().settlements[0].settlement, religionState: litCreed('A') } },
    ]);
    // anchored: the lit-creed world opens a faith_communion row in the test above.
    expect(pactProposalsOf(dead.worldState).map((row) => row.trigger)).toEqual([]);
  });
});

describe('LIT1b-pre U4 — THE SIGNING BEAT: a pact signed in peace is announced once, naming both courts', () => {
  test('a signed pact yields EXACTLY ONE Herald item, naming both courts, on the treaty desk', () => {
    const { first, second } = openThenAnswer(pactWorld({ flag: true }), namedSnapshot());
    expect(endingOf(second)).toBe('signed');
    // anchored: the answer pass below mints its one beat, so the opening pass's empty list is real.
    expect(first.newsEntries).toEqual([]);
    expect(second.newsEntries).toHaveLength(1);
    const [beat] = second.newsEntries;
    expect(beat).toMatchObject({
      kind: 'signed', impactKind: 'signed', significance: 'major', section: 'trade', audience: 'public',
      settlementIds: ['A', 'B'], settlementNames: ['Ashford', 'Irontown'], parties: ['A', 'B'],
      ending: 'signed', tick: DUE_TICK,
      severity: F.SIGNING_BEAT_SEVERITY01, score: F.SIGNING_BEAT_SCORE,
    });
    expect(beat.id).toBe(`wizard_news.${DUE_TICK}.signed.a.b`);
    expect(beat.headline).toBe('Ashford and Irontown have set their names to terms, in peace');
    // The summary is the annex block's own sentence, picked by the one grammar picker on the
    // proposal's own id under the reciprocal grain-for-ore sheet's context.
    const [row] = pactProposalsOf(first.worldState);
    expect(beat.summary).toBe(grammarReceipt(
      'signed', String(row.id), { settlement: 'Ashford', counterpart: 'Irontown' }, 'both_gain_goods').line);
  });

  test('THE HONEST FAMILIES: a one-sided grant never says both took something, and no wagons roll without goods', () => {
    /** Every family the real builder draws for one clause set, over many proposal ids. */
    const familiesFor = (terms) => [...new Set(Array.from({ length: 400 }, (_, index) => pactSignedBeat({
      tick: 20,
      proposal: { id: `pact.20.a.b.seed${index}`, from: 'A', to: 'B', trigger: 'faith_communion', transport: 'abstract' },
      terms, fromName: 'Ashford', toName: 'Irontown',
    })?.familyId))].sort();
    expect(familiesFor([{ type: 'pilgrimage_right', beneficiary: 'A' }])).toEqual(['signed.3']);
    expect(familiesFor([{ type: 'non_aggression', beneficiary: 'both' }])).toEqual(['signed.3', 'signed.4']);
    expect(familiesFor([{ type: 'resource_share', beneficiary: 'A' }])).toEqual(['signed.3', 'signed.5']);
    expect(familiesFor([
      { type: 'resource_share', beneficiary: 'A' }, { type: 'resource_share', beneficiary: 'B' },
    ])).toEqual(['signed.3', 'signed.4', 'signed.5']);
  });

  test('NO NAME, NO BEAT: a court known only by its id is never printed as one', () => {
    // The fixture spells each court's name as its id, so this signature has no name to print.
    const { second } = openThenAnswer(pactWorld({ flag: true }));
    expect(endingOf(second)).toBe('signed');
    // anchored: the named run of this same signature mints its one beat in the first test of this block.
    expect(second.newsEntries).toEqual([]);
    expect(pactSignedBeat({
      tick: 20, proposal: { id: 'pact.20.a.b.trade_demand', from: 'A', to: 'B' }, terms: [], fromName: 'Ashford', toName: '',
    })).toBeNull();
  });

  test('THE CAUSE ROW: absent on the engine road, carried verbatim when a decree caused the signing', () => {
    const { second } = openThenAnswer(pactWorld({ flag: true }), namedSnapshot());
    expect(Object.prototype.hasOwnProperty.call(second.newsEntries[0], 'cause')).toBe(false);
    const caused = pactSignedBeat({
      tick: 20,
      proposal: { id: 'pact.20.a.b.trade_demand', from: 'A', to: 'B', trigger: 'trade_demand', transport: 'abstract' },
      terms: [{ type: 'resource_share', beneficiary: 'A' }], fromName: 'Ashford', toName: 'Irontown', cause: DECREE_CAUSE,
    });
    expect(caused.cause).toBe('table');
  });

  test('AN AMENDMENT SPEAKS THROUGH THE SAME BEAT: a clause written into a standing deed is announced once', () => {
    const sale = mintSovereigntySaleTreaties({
      sales: [{ assetId: 'holding', sellerId: 'A', buyerId: 'B', components: [] }],
      worldState: pactWorld({ flag: true }),
      tick: 1,
    });
    const { second } = openThenAnswer(sale.worldState, namedSnapshot());
    expect(receiptOf(second, 'pact_signed').amended).toBe(true);
    expect(second.newsEntries.map((entry) => entry.kind)).toEqual(['signed']);
  });

  test('THE PERSISTED FEED KEEPS IT: appended, saved and reloaded, the beat keeps its words, names and desk', () => {
    // The lifecycle path a news item actually lives on: the wizard-news normalizer is an
    // ALLOWLIST rebuilder run on every append and every load, so a field it does not name dies
    // there. Everything a reader meets survives the round trip.
    const { second } = openThenAnswer(pactWorld({ flag: true }), namedSnapshot());
    const [beat] = second.newsEntries;
    const now = '2026-09-24T00:00:00.000Z';
    const saved = JSON.parse(JSON.stringify(appendWizardNewsEntries(ensureWizardNewsFeed({}, { now }), [beat], { now })));
    const reloaded = ensureWizardNewsFeed(saved, { now }).entries.find((entry) => entry.id === beat.id);
    expect(reloaded).toMatchObject({
      kind: 'signed', impactKind: 'signed', summary: beat.summary, headline: beat.headline,
      settlementIds: ['A', 'B'], settlementNames: ['Ashford', 'Irontown'], section: 'trade',
      significance: 'major', severity: F.SIGNING_BEAT_SEVERITY01, score: F.SIGNING_BEAT_SCORE, familyId: beat.familyId,
    });
  });

  test('DARK, NOTHING: the same named signature with the layer dark mints no item', () => {
    for (const flag of [undefined, false]) {
      const { first, second } = openThenAnswer(pactWorld({ flag }), namedSnapshot());
      // anchored: the lit run of this same named world mints one beat in the first test of this block.
      expect([...first.newsEntries, ...second.newsEntries]).toEqual([]);
    }
  });
});

describe('WHAT THIS STAGE MINTS: ONE KIND, AND ONLY ON A SIGNATURE', () => {
  test('ONE news kind, the signing beat, and nothing on any other arm (the tripwire for the rest)', () => {
    // Recorded design (see the module header): GR-2 minted nothing and pinned it; LIT1b-pre U4
    // lands the signing beat with its five joins. This reds the day a second kind is added here,
    // which is the instruction to land ITS five joins in that same commit. The courts are NAMED,
    // or the signing arm would be silent for want of a name and this pin would see nothing.
    const snapshot = namedSnapshot();
    const signedArm = openThenAnswer(pactWorld({ flag: true }), snapshot);
    expect([...signedArm.first.newsEntries, ...signedArm.second.newsEntries].map((entry) => entry.kind))
      .toEqual(['signed']);
    const refusedArm = openThenAnswer(
      pactWorld({ flag: true, relationship: { dependency: 0.95, leverage: 0.05 } }), snapshot,
    );
    expect(endingOf(refusedArm.second)).toBe('refused');
    // anchored: the signing arm above mints its one beat, so the empty list here is the refusal's silence.
    expect([...refusedArm.first.newsEntries, ...refusedArm.second.newsEntries]).toEqual([]);
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

  // The pair's edge rides with the world: the record the reliance arm reads is found through it (FPQ-35).
  const { edges } = pactSnapshot().regionalGraph;

  test('arm ONE alone decides `no_overlap`; arm TWO alone decides `refused`', () => {
    const value = answerPactProposal({
      worldState: pactWorld({ flag: true }), proposal, responderDemand01: 0, tick: DUE_TICK, edges,
    });
    expect(value.verdict).toBe('no_overlap');
    const reliance = answerPactProposal({
      worldState: pactWorld({ flag: true, relationship: { dependency: 0.95, leverage: 0.05 } }),
      proposal,
      responderDemand01: 1,
      tick: DUE_TICK,
      edges,
    });
    expect(reliance.verdict).toBe('refused');
    // …and with BOTH arms satisfied it signs. Three outcomes, three causes, no overlap.
    const both = answerPactProposal({
      worldState: pactWorld({ flag: true }), proposal, responderDemand01: 1, tick: DUE_TICK, edges,
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

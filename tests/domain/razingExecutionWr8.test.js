/**
 * razingExecutionWr8.test.js — WR-8 amendments R + R2: THE RAZING, WIRED.
 *
 * `razingWr8.test.js` pins the LAW — the gates, the conserved arithmetic, the
 * unreachability walks. This file pins the ASSEMBLY: that the composer hands the
 * law facts it did not invent, that it reaches the belief stage in the one
 * direction CR-WR8-G permits, and that what it plans lands in the estates'
 * OWN mechanisms rather than in a second writer beside them.
 *
 * FOUR OF THESE PINS RUN THE REAL DOWNSTREAM ESTATE rather than comparing
 * strings, because every one of them is a claim about what another module will
 * do with what this one produced:
 *   - the institution stamp is fed to K1's OWN cause-presence table
 *     (`INSTITUTION_CAUSE_SIGNAL.damage` via `liveCausesFor`), so "the stamp
 *     lands on the cause K1 reads" is executed rather than asserted;
 *   - the shell band is graded by K1's OWN `deriveInstitutionStatus`, so
 *     R-WZ-2's "capacity-zero, not K1's shell" is a measured capacity01 rather
 *     than a claim about a word;
 *   - the extremity composite is assembled from a REAL relationship state and a
 *     REAL warReasons ledger, because the whole substrate audit was about what
 *     those two make reachable;
 *   - the direction law is proved by reading BOTH sides' source, because a pin
 *     that only checked "the writer imports a reader" stays green through the
 *     exact inversion it exists to forbid.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

import {
  RAZING_EXECUTION_TUNING,
  RAZING_IMPAIRMENT_TYPE,
  razingBeliefReceipts,
  razingDecisionFor,
  razingExtremityFor,
  razingInstitutionStamps,
  razingPairRelationship,
  razingPlanFor,
  razingSeverityFrom,
} from '../../src/domain/worldPulse/razingExecution.js';
import { RAZING_TUNING, razingGate, readRelationshipExtremity } from '../../src/domain/worldPulse/razing.js';
import {
  INSTITUTION_STATUS_TUNING,
  deriveInstitutionStatus,
} from '../../src/domain/worldPulse/institutionStatusModel.js';
import {
  liveCausesFor,
  readInstitutionCauseContext,
} from '../../src/domain/worldPulse/institutionStatusLifecycle.js';
import { CONQUEST_REQUIRED_RULES } from '../../src/domain/worldPulse/conquestDoctrineStage.js';
import { REASON_TUNING, aggregateReasons01 } from '../../src/domain/worldPulse/warReasons.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SOURCE = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');
/**
 * The source with COMMENTS STRIPPED. A determinism scan must read what the
 * module DOES, not what it says about itself: this file's own docstring
 * promises "no rng, no wall-clock", and a scan over raw source reds on the
 * promise. Stripping first is what makes the claim about the code.
 */
const CODE = (rel) => SOURCE(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const EXECUTION_SOURCE = 'src/domain/worldPulse/razingExecution.js';

/** Every prerequisite flag true — WR-8 lights LAST, behind all seven. */
const LIT_RULES = Object.fromEntries(CONQUEST_REQUIRED_RULES.map((key) => [key, true]));

/**
 * A world in which Karrow's border with Thornwall is openly hostile, the
 * resentment is above hostility's own floor, and a live grievance stands.
 * @param {{ resentment?: number, type?: string, grievance?: number }} [over]
 */
function extremeWorld(over = {}) {
  const resentment = over.resentment ?? 0.9;
  const relationshipType = over.type ?? 'hostile';
  const grievance = over.grievance ?? 0.9;
  const worldState = {
    simulationRules: { ...LIT_RULES },
    tick: 40,
    relationshipStates: {
      'rel.Karrow.Thornwall': { relationshipType, resentment, trust: 0.05, fear: 0.4 },
    },
    spatialLedgers: {
      warReasons: {
        'Karrow>Thornwall': {
          // ⚠️ TWO CAUSES, NOT ONE, AND THAT IS A MEASURED FACT ABOUT THE BAND
          // rather than a fixture convenience — see the reachability-floor pin
          // below. `aggregateReasons01` divides by AGGREGATE_SATURATION 2.5, so
          // one maximal cause aggregates to 0.4 and CANNOT clear the 0.6
          // adequacy band. A razing needs a quarrel with more than one live
          // grievance behind it.
          reasons: {
            grievance: { type: 'grievance', score: grievance, tick: 40, receipt: 'blood is owed' },
            revanchism: { type: 'revanchism', score: grievance, tick: 40, receipt: 'and owed a long time' },
          },
        },
      },
    },
  };
  const snapshot = {
    regionalGraph: {
      edges: [{ id: 'rel.Karrow.Thornwall', from: 'Karrow', to: 'Thornwall', relationshipType }],
    },
  };
  return { worldState, snapshot };
}

describe('CR-WR8-G — the direction law: the writer reads beliefs, and beliefs never read the writer', () => {
  // THE ARROW, NOT THE EDGE. The ruling permits exactly one direction, and the
  // failure it guards against is the INVERSION — a belief module importing the
  // razing writer would have acquired a road to the world's truth through the
  // back door, which is precisely what K3 exists to prevent. A pin asserting
  // only that the writer imports a reader would survive that inversion intact.
  const BELIEF_ESTATE = Object.freeze([
    'src/domain/worldPulse/conquestFeasibility.js',
    'src/domain/worldPulse/conquestIntent.js',
    'src/domain/worldPulse/conquestDoctrineStage.js',
    'src/domain/worldPulse/beliefMap.js',
    'src/domain/worldPulse/negotiationPictures.js',
    'src/domain/worldPulse/envoyNegotiationPictureBuilder.js',
  ]);

  test('the writer imports the belief READERS the amendment\'s receipts require', () => {
    const source = SOURCE(EXECUTION_SOURCE);
    // A non-empty, member-checked set — the recorded cure for the
    // filename-anchored pin that goes vacuous on relocation.
    for (const symbol of ['readConquestFeasibilityFor', 'readConquestIntentFor', 'conquestMercyReceipt', 'mistakenFeasibilityReceipt']) {
      expect(source).toContain(symbol);
    }
    expect(source.length).toBeGreaterThan(2000);
  });

  test('NEGATIVE CONTROL — no belief or negotiation module imports the razing writer', () => {
    expect(BELIEF_ESTATE.length).toBeGreaterThan(0);
    for (const rel of BELIEF_ESTATE) {
      const source = SOURCE(rel);
      // THE ANCHOR IS `export`, and it travels the same path as the thing being
      // refused: a member that was renamed, emptied or deleted stops carrying an
      // export, so the absence below can no longer pass because the file went
      // away. A raw length check would not catch a file replaced by a stub.
      expectAbsentWithAnchor(source, 'razingExecution', 'export', `${rel} imports the razing writer`);
      expectAbsentWithAnchor(source, "from './razing.js'", 'export', `${rel} imports the razing law`);
    }
  });
});

describe('dormancy — a dark world never reaches the law, and says why', () => {
  test('the doctrine dark ⇒ no decision, no plan, no receipts', () => {
    const decision = razingDecisionFor({
      worldState: {}, snapshot: {}, razerId: 'Karrow', victimId: 'Thornwall', tick: 40, siegeWon: true,
    });
    expect(decision.active).toBe(false);
    expect(decision.verdict.permitted).toBe(false);
    expect(razingPlanFor({ verdict: decision.verdict })).toBeNull();
    const receipts = razingBeliefReceipts({
      worldState: {}, snapshot: {}, observerId: 'Karrow', rivalId: 'Thornwall',
    });
    expect(receipts).toEqual({ feasibility: null, intent: null, mercy: null, mistaken: null });
  });

  test('NEGATIVE CONTROL — one missing prerequisite flag is still dark', () => {
    for (const missing of CONQUEST_REQUIRED_RULES) {
      const rules = { ...LIT_RULES, [missing]: false };
      const { snapshot } = extremeWorld();
      const decision = razingDecisionFor({
        worldState: { simulationRules: rules }, snapshot,
        razerId: 'Karrow', victimId: 'Thornwall', tick: 40, siegeWon: true,
      });
      expect(decision.active).toBe(false);
    }
  });
});

describe('the extremity composite, assembled from real substrate', () => {
  test('a hostile edge, a hot axis and a live grievance clear all three conjuncts', () => {
    const { worldState, snapshot } = extremeWorld();
    const read = razingExtremityFor({
      worldState, snapshot, partyId: 'Karrow', counterpartId: 'Thornwall',
    });
    expect(read.edgeTypeMet).toBe(true);
    expect(read.resentmentMet).toBe(true);
    expect(read.grievanceMet).toBe(true);
    expect(read.extreme).toBe(true);
  });

  test('NEGATIVE CONTROL — each conjunct alone breaks the composite, and names itself', () => {
    const cases = [
      [{ type: 'rival' }, 'edge_type'],
      [{ resentment: RAZING_TUNING.HOSTILE_RESENTMENT_BASELINE - 0.01 }, 'resentment'],
      [{ grievance: 0 }, 'live_grievance'],
    ];
    for (const [over, expectedMissing] of cases) {
      const { worldState, snapshot } = extremeWorld(/** @type {object} */ (over));
      const read = razingExtremityFor({
        worldState, snapshot, partyId: 'Karrow', counterpartId: 'Thornwall',
      });
      expect(read.extreme).toBe(false);
      expect(read.missing).toContain(expectedMissing);
    }
  });

  test('THE GRIEVANCE FLOOR IS TWO CAUSES, MEASURED — the ubiquity brake CR-WR8-B wanted', () => {
    // A LOAD-BEARING ARITHMETIC FACT, discovered by this pin failing on its
    // first run and recorded rather than tuned away. `aggregateReasons01` is
    // sum(scores) / AGGREGATE_SATURATION 2.5, and the extremity composite's
    // live-grievance conjunct is the LICENSE_ADEQUACY band 0.6. So a single
    // cause at its MAXIMUM aggregates to 0.4 and cannot clear the band, however
    // hot it is: a razing requires a quarrel with at least two strong live
    // causes stacked behind it. That is exactly the brake CR-WR8-B named ("the
    // live-grievance conjunct breaks ubiquity"), and it is stronger than the
    // ruling's own text promised. Nothing here is tuned to make the fixture
    // pass — the fixture was corrected to the world.
    expect(REASON_TUNING.AGGREGATE_SATURATION).toBe(2.5);
    expect(RAZING_TUNING.LICENSE_ADEQUACY_01).toBe(0.6);
    const oneMaxedCause = aggregateReasons01({
      reasons: { grievance: { type: 'grievance', score: 1 } },
    });
    expect(oneMaxedCause).toBeLessThan(RAZING_TUNING.LICENSE_ADEQUACY_01);
    const twoMaxedCauses = aggregateReasons01({
      reasons: { grievance: { type: 'grievance', score: 1 }, revanchism: { type: 'revanchism', score: 1 } },
    });
    expect(twoMaxedCauses).toBeGreaterThanOrEqual(RAZING_TUNING.LICENSE_ADEQUACY_01);
    // And the composite agrees, end to end, on a world built each way.
    const single = extremeWorld();
    single.worldState.spatialLedgers.warReasons['Karrow>Thornwall'] = {
      reasons: { grievance: { type: 'grievance', score: 1 } },
    };
    expect(razingExtremityFor({
      worldState: single.worldState, snapshot: single.snapshot,
      partyId: 'Karrow', counterpartId: 'Thornwall',
    }).grievanceMet).toBe(false);
  });

  test('CR-WR8-A — a stranger has no edge, so no razing can mint one to reach', () => {
    const { worldState, snapshot } = extremeWorld();
    // A court the regional graph never gave Karrow an edge with.
    expect(razingPairRelationship(snapshot, worldState, 'Karrow', 'Elsewhere')).toBeNull();
    const read = razingExtremityFor({
      worldState, snapshot, partyId: 'Karrow', counterpartId: 'Elsewhere',
    });
    expect(read.extreme).toBe(false);
    expect(read.missing).toContain('edge_type');
  });

  test('ONE assembler serves BOTH directions — the razer\'s gate and the holder\'s coupling', () => {
    const { worldState, snapshot } = extremeWorld();
    const forward = razingExtremityFor({
      worldState, snapshot, partyId: 'Karrow', counterpartId: 'Thornwall',
    });
    const reverse = razingExtremityFor({
      worldState, snapshot, partyId: 'Thornwall', counterpartId: 'Karrow',
    });
    // The EDGE is shared, so the type conjunct agrees; the GRIEVANCE is directed,
    // so the reverse direction has none on this fixture. That asymmetry is the
    // design — a grievance is held BY somebody AGAINST somebody.
    expect(forward.edgeTypeMet).toBe(true);
    expect(reverse.edgeTypeMet).toBe(true);
    expect(forward.grievanceMet).toBe(true);
    expect(reverse.grievanceMet).toBe(false);
  });
});

describe('R-WZ-3 — severity is derived from the quarrel and forks no stream', () => {
  test('the signature cannot see an rng, and the same world answers the same twice', () => {
    expect(razingSeverityFrom.length).toBeLessThanOrEqual(2);
    const measured = { resentment01: 0.86, grievance01: 0.62 };
    const a = razingSeverityFrom({ extreme: true }, measured);
    const b = razingSeverityFrom({ extreme: true }, measured);
    expect(a).toEqual(b);
    // ⚠️ ANCHORED, AND OVER CODE RATHER THAN PROSE. Both traps bit on the first
    // run and both are recorded here: an unanchored `toContain('rng')` matches
    // inside the word "burning", and even the anchored form matches this
    // module's own docstring promise "no rng, no wall-clock". A determinism scan
    // reads what the code does.
    const code = CODE(EXECUTION_SOURCE);
    // THE LIVENESS ANCHOR for all three scans below: the stripped code still
    // contains the function under test. A comment-strip bug, a rename or a
    // relocation empties `code` and reds HERE rather than passing three
    // absence checks against an empty string.
    expect(code).toContain('export function razingSeverityFrom');
    // anchored: the line above proves `code` is the live module body, so an empty or drifted read reds first
    expect(code).not.toMatch(/\brng\b/);
    // anchored: same `code` subject, anchored by the export assertion three lines up
    expect(code).not.toMatch(/\.fork\(/);
    // anchored: same `code` subject, anchored by the export assertion five lines up
    expect(code).not.toMatch(/Math\.random|Date\.now/);
  });

  test('monotone in BOTH axes, and bounded by the two ends of its own band', () => {
    const base = RAZING_TUNING.HOSTILE_RESENTMENT_BASELINE;
    const coldest = razingSeverityFrom({ extreme: true }, { resentment01: base, grievance01: 0 });
    const hottest = razingSeverityFrom({ extreme: true }, { resentment01: 1, grievance01: 1 });
    expect(coldest.severity01).toBeCloseTo(RAZING_EXECUTION_TUNING.SEVERITY_FLOOR, 6);
    expect(hottest.severity01).toBeCloseTo(1, 6);
    let prior = -1;
    for (const r of [base, 0.85, 0.9, 0.95, 1]) {
      const s = razingSeverityFrom({ extreme: true }, { resentment01: r, grievance01: 0.5 }).severity01;
      expect(s).toBeGreaterThan(prior);
      prior = s;
    }
    prior = -1;
    for (const g of [0, 0.25, 0.5, 0.75, 1]) {
      const s = razingSeverityFrom({ extreme: true }, { resentment01: 0.9, grievance01: g }).severity01;
      expect(s).toBeGreaterThan(prior);
      prior = s;
    }
  });
});

describe('R-WZ-1 — the institution status FOLLOWS THE TRUTH (K1 grades what the razing stamped)', () => {
  /** The stamp, run through K1's own cause-presence read. */
  function k1CausesFor(stamped) {
    const institution = {
      name: stamped.name,
      status: 'active',
      impairments: stamped.impairment ? [stamped.impairment] : [],
    };
    const ctx = readInstitutionCauseContext({
      institution, settlement: { institutions: [institution] }, worldState: {}, cid: 'Thornwall',
    });
    return { institution, causes: liveCausesFor(ctx).map((c) => c.cause) };
  }

  test('every non-protected institution gets a stamp K1 reads as its `damage` cause', () => {
    const stamps = razingInstitutionStamps(
      [{ id: 'temple' }, { id: 'mill' }, { id: 'granary', protectedFromSack: true }],
      0.7,
      { causeRef: 'razing:Karrow:Thornwall:40', sinceTick: 40 },
    );
    expect(stamps.map((s) => s.id)).toEqual(['granary', 'mill', 'temple']); // codepoint-sorted
    for (const stamped of stamps.filter((s) => !s.protected)) {
      expect(stamped.impairment?.type).toBe(RAZING_IMPAIRMENT_TYPE);
      expect(k1CausesFor(stamped).causes).toContain('damage');
    }
  });

  test('NEGATIVE CONTROL — a PROTECTED institution is reported, unstamped, and reads no cause', () => {
    const [granary] = razingInstitutionStamps([{ id: 'granary', protectedFromSack: true }], 1, {});
    expect(granary.protected).toBe(true);
    expect(granary.status).toBe('intact');
    expect(granary.impairment).toBeNull();
    expect(k1CausesFor(granary).causes).toEqual([]);
  });

  test('NEGATIVE CONTROL — the stamp type is the ONLY one K1 reads as damage', () => {
    // If a future edit changed RAZING_IMPAIRMENT_TYPE to anything else, the
    // stamp would land and grade NOTHING — the silent-no-op class. Prove the
    // dependence by feeding K1 a deliberately wrong type.
    const [stamped] = razingInstitutionStamps([{ id: 'temple' }], 0.7, {});
    const wrong = { ...stamped, impairment: { ...stamped.impairment, type: 'not_capacity' } };
    // ANCHORED BY ITS OWN TWIN: the correctly-typed stamp DOES raise `damage`
    // through the very same reader, so "the wrong type raises nothing" measures
    // the type dependence rather than a K1 reader that stopped working.
    expect(k1CausesFor(stamped).causes).toContain('damage');
    // anchored: the same reader is proved live on the line above
    expect(k1CausesFor(wrong).causes).not.toContain('damage');
  });
});

describe('R-WZ-2 — the razing\'s shell is capacity-zero, NOT K1\'s unfunded shell', () => {
  test('above the shell band K1 grades capacity01 EXACTLY zero, through severity alone', () => {
    const severity = RAZING_EXECUTION_TUNING.SHELL_BAND + 0.05;
    const [stamped] = razingInstitutionStamps([{ id: 'temple' }], severity, { sinceTick: 40 });
    expect(stamped.status).toBe('shell');
    expect(stamped.impairment?.severity).toBe(INSTITUTION_STATUS_TUNING.MAX_SEVERITY);
    const verdict = deriveInstitutionStatus({
      institution: { name: 'temple', status: 'active' },
      record: { impairments: { damage: { cause: 'damage', causeRef: 'razing', sinceTick: 40 } } },
    });
    // K1's own grading of a full-severity damage cause: impaired, and producing
    // nothing. The word `shell` in K1 means the money stopped, and this is not
    // that — which is the whole of R-WZ-2.
    expect(verdict?.shell).toBe(false);
    expect(verdict?.status).toBe('impaired');
    const full = deriveInstitutionStatus({
      institution: { name: 'temple', status: 'active' },
      record: {
        impairments: {
          damage: {
            cause: 'damage', causeRef: 'razing', sinceTick: 40,
            dmSeverity: INSTITUTION_STATUS_TUNING.MAX_SEVERITY,
          },
        },
      },
    });
    expect(full?.capacity01).toBe(0);
  });

  test('NEGATIVE CONTROL — the razing NEVER sets K1\'s economic-close flag', () => {
    const stamps = razingInstitutionStamps([{ id: 'temple' }, { id: 'mill' }], 1, {});
    const serialized = JSON.stringify(stamps);
    // THE ANCHOR IS `capacity` — the stamp field the razing DOES write, on the
    // same objects, through the same call. If the producer ever returned an
    // empty census the anchor vanishes and this reds, instead of the two
    // absences below passing because there was nothing to look at.
    expectAbsentWithAnchor(serialized, '_worldPulseEconomyClosed', 'capacity', 'the razing stamps K1 economic close');
    expectAbsentWithAnchor(serialized, 'remnant', 'capacity', 'the razing stamps K1 shell status');
    expectAbsentWithAnchor(SOURCE(EXECUTION_SOURCE), '_worldPulseEconomyClosed: ', 'razingInstitutionStamps', 'the writer sets the economic-close flag');
  });

  test('below the shell band the stamp is K1\'s OWN damage default, not a number this file picked', () => {
    const [stamped] = razingInstitutionStamps([{ id: 'temple' }], RAZING_EXECUTION_TUNING.SHELL_BAND, {});
    expect(stamped.status).toBe('impaired');
    expect(stamped.impairment?.severity).toBe(INSTITUTION_STATUS_TUNING.defaultSeverity.damage);
  });
});

describe('the plan — conserved, occupation-free, tier-free', () => {
  const PERMITTED = razingGate({
    siegeWon: true,
    extremity: readRelationshipExtremity({ edgeType: 'hostile', resentment01: 0.9, grievance01: 0.8 }),
    alignmentBand: 'malicious',
    actorId: 'Karrow',
    victimId: 'Thornwall',
  });

  test('the sack conserves to the person, on every population in a walked range', () => {
    expect(PERMITTED.permitted).toBe(true);
    for (const population of [41, 90, 300, 1200, 5000, 20000]) {
      for (const severity of [0.35, 0.5, 0.735, 1]) {
        const plan = razingPlanFor({
          verdict: PERMITTED, severity01: severity, population, namedCastCount: 7,
          institutions: [{ id: 'temple' }], movableWealth: 900,
          razerName: 'Karrow', victimName: 'Thornwall', tick: 40,
        });
        const s = plan.sack;
        expect(s.deaths + s.escapees + s.namedRoaming + s.survivors).toBe(s.population);
        expect(s.namedRoaming).toBeLessThanOrEqual(7); // named cast is never engine-killed
      }
    }
  });

  test('LAW 6 — the victor leaves: no occupation, no garrison, no terms, and no tribute', () => {
    const plan = razingPlanFor({
      verdict: PERMITTED, severity01: 0.7, population: 1200, institutions: [],
      movableWealth: 900, razerName: 'Karrow', victimName: 'Thornwall',
    });
    expect(plan.departure.occupation).toBeNull();
    expect(plan.departure.garrison).toBeNull();
    expect(plan.departure.terms).toBeNull();
    expect(plan.spoils.tributePerYear).toBe(0);
    expect(plan.receipt).toContain('rode home');
  });

  test('CR-WR8-F — nothing in the plan names, computes or targets a tier', () => {
    const plan = razingPlanFor({
      verdict: PERMITTED, severity01: 0.7, population: 1200, institutions: [{ id: 'temple' }],
      movableWealth: 900, razerName: 'Karrow', victimName: 'Thornwall',
    });
    const serialized = JSON.stringify(plan);
    // ⚠️ WORD-ANCHORED. A bare `toContain('city')` matches inside "capacity" —
    // the stamp field this very plan carries — and would red on the correct
    // output. The rung words are matched as words or not at all.
    // THE LIVENESS ANCHOR: the plan really is a populated plan. `severity01` and
    // the sack's own count are things this plan MUST carry, so a producer that
    // started returning an empty object reds here rather than sailing through
    // six absence checks.
    expect(serialized).toContain('severity01');
    expect(plan.sack.population).toBeGreaterThan(0);
    for (const word of ['tier', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      // anchored: the two assertions above prove `serialized` is a full plan, not an empty subject
      expect(serialized).not.toMatch(new RegExp(`\\b${word}\\b`, 'i'));
    }
    expectAbsentWithAnchor(SOURCE(EXECUTION_SOURCE), 'popToTier', 'razingPlanFor', 'the plan reaches the tier chooser');
  });

  test('NEGATIVE CONTROL — a refused verdict yields no plan at all', () => {
    const refused = razingGate({
      siegeWon: true,
      extremity: readRelationshipExtremity({ edgeType: 'rival', resentment01: 0.5, grievance01: 0.1 }),
      alignmentBand: 'malicious',
    });
    expect(refused.permitted).toBe(false);
    expect(razingPlanFor({ verdict: refused, severity01: 1, population: 5000 })).toBeNull();
  });

  test('LAW 7 — a remnant at the skeleton floor loses nobody and yields nothing, twice over', () => {
    const plan = razingPlanFor({
      verdict: PERMITTED, severity01: 1, population: RAZING_TUNING.SKELETON_FLOOR,
      institutions: [], movableWealth: 100000, razerName: 'Karrow', victimName: 'Thornwall',
    });
    expect(plan.sack.losses).toBe(0);
    expect(plan.sack.nothingLeft).toBe(true);
    expect(plan.spoils.plunder).toBe(0);
  });
});

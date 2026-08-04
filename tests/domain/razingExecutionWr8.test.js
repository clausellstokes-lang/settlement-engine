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
  strongestLiveGrievance01,
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
          // TWO CAUSES, and under CR-WR8-B-CLARIFIED that is now a fixture
          // choice rather than a requirement: the conjunct reads the STRONGEST
          // SINGLE LIVE cause, so either of these clears the band alone. The
          // pair is kept because a real quarrel usually has more than one thing
          // wrong with it, and the single-cause reachability is pinned
          // separately below.
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

/**
 * ⚠️⚠️ A FULLY LIT WORLD — the fixture WZ-1 did not have, and whose absence left
 * three whole paths of this module unexecuted.
 *
 * `extremeWorld` above is enough to assemble an extremity, but not enough to
 * reach `razingDecisionFor`'s ACTIVE branch (which needs a real snapshot member
 * to read a nature off) or `razingBeliefReceipts`' body (which needs a fogged
 * world with a real belief record and a derivable pressure index). Every pin in
 * this file before this one exercised the DARK arm, so mutants living past the
 * dormancy gate survived. This fixture is the cure, and it is built out of the
 * same parts the belief estate's own tests use — a real `byId` Map, a real
 * regional graph, a real belief seat — because a hand-rolled belief row would
 * prove nothing about the pipeline.
 *
 * `infoMode: 'unreliable'` is load-bearing: the belief layer is dormant by
 * design in an omniscient world, so a fogged world is the only world in which
 * the receipts have anything to read.
 *
 * @param {{ patron?: string, warExhaustion?: Record<string, number>,
 *   licenses?: Record<string, unknown>, rivalFaith?: string }} [over]
 */
function litRazingWorld(over = {}) {
  const patron = over.patron ?? 'evil';
  const rivalFaith = over.rivalFaith ?? 'The Iron Maw';
  const worldState = {
    simulationRules: { ...LIT_RULES, infoMode: 'unreliable' },
    spatialCanonVersion: 1,
    tick: 40,
    warExhaustion: over.warExhaustion ?? {},
    // WR-2's ledger gives the court its temper; without it the INTENT half is
    // unreadable and the mercy receipt can never be reached either way.
    dispositionStats: { Karrow: { channels: { martial: { stock01: 0.9 } } } },
    relationshipStates: {
      'rel.Karrow.Thornwall': { relationshipType: 'hostile', resentment: 0.9, trust: 0.05, fear: 0.4 },
    },
    spatialLedgers: {
      warReasons: {
        'Karrow>Thornwall': {
          reasons: {
            grievance: { type: 'grievance', score: 0.9, tick: 40, receipt: 'blood is owed' },
            revanchism: { type: 'revanchism', score: 0.9, tick: 40, receipt: 'and owed a long time' },
          },
        },
      },
      beliefMaps: {
        Karrow: {
          seat: {
            Thornwall: { strengthBand: 0, allianceLabel: 'hostile', faithLabel: rivalFaith, confidence01: 1 },
            Karrow: { strengthBand: 4, allianceLabel: 'self', confidence01: 1 },
          },
        },
      },
      ...(over.licenses ? { vengeanceLicenses: over.licenses } : {}),
    },
  };
  const byId = new Map([
    ['Karrow', {
      id: 'Karrow',
      settlement: {
        name: 'Karrow', tier: 'city', population: 45000,
        economicState: { foodSecurity: { storageMonths: 9, resilienceScore: 70 } },
        config: { primaryDeitySnapshot: { name: patron === 'evil' ? 'The Iron Maw' : 'The Open Hand', alignmentAxis: patron } },
      },
    }],
    ['Thornwall', {
      id: 'Thornwall',
      settlement: {
        name: 'Thornwall', tier: 'village', population: 1200,
        config: { primaryDeitySnapshot: { name: rivalFaith, alignmentAxis: rivalFaith === 'The Iron Maw' ? 'evil' : 'good' } },
      },
    }],
  ]);
  const snapshot = {
    settlements: [...byId.values()],
    byId,
    worldState,
    regionalGraph: {
      edges: [{ id: 'rel.Karrow.Thornwall', from: 'Karrow', to: 'Thornwall', relationshipType: 'hostile', type: 'hostile' }],
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

  test('CR-WR8-B-CLARIFIED — ONE maxed cause reaches the band, and the retired floor is proved retired', () => {
    // ⚠️ THIS PIN REPLACES ITS OWN PREDECESSOR, AND THE PREDECESSOR WAS RIGHT
    // ABOUT THE ARITHMETIC AND WRONG ABOUT THE LAW. WZ-1 measured that
    // `aggregateReasons01` is Σ(scores) / AGGREGATE_SATURATION 2.5 against an
    // adequacy band of 0.6, so ONE cause at its maximum aggregated to 0.4 and a
    // razing silently needed TWO strong live causes — and pinned that floor as
    // if it were the ruling. CR-WR8-B's own text says "a LIVE grievance",
    // singular. The floor was a divisor's side effect; the chair retired it.
    //
    // THE OLD ARITHMETIC IS ASSERTED HERE ON PURPOSE, as the negative control
    // for the change: if the composite ever went back to the aggregate, the
    // single-cause world below would stop clearing the band and this reds.
    expect(REASON_TUNING.AGGREGATE_SATURATION).toBe(2.5);
    expect(RAZING_TUNING.LICENSE_ADEQUACY_01).toBe(0.6);
    expect(aggregateReasons01({ reasons: { grievance: { type: 'grievance', score: 1 } } }))
      .toBeLessThan(RAZING_TUNING.LICENSE_ADEQUACY_01);

    // ONE maxed cause, and the composite now reaches the extreme on it.
    const single = extremeWorld();
    single.worldState.spatialLedgers.warReasons['Karrow>Thornwall'] = {
      reasons: { grievance: { type: 'grievance', score: 1, tick: 40, receipt: 'they burned Marrowfen' } },
    };
    const reached = razingExtremityFor({
      worldState: single.worldState, snapshot: single.snapshot,
      partyId: 'Karrow', counterpartId: 'Thornwall',
    });
    expect(strongestLiveGrievance01(single.worldState, 'Karrow', 'Thornwall')).toBe(1);
    expect(reached.grievanceMet).toBe(true);
    expect(reached.extreme).toBe(true);
  });

  test('NEGATIVE CONTROL — the ubiquity brake survives: a PILE of weak causes never sums onto the extreme', () => {
    // The brake is now about how bad the worst thing is, not how many things
    // there are. Six live causes whose aggregate would clear the old band
    // COMFORTABLY still leave the conjunct unmet, because the maximum of a set
    // of weak causes is weak. This is the arm that keeps a razing rare.
    const weak = extremeWorld();
    /** @type {Record<string, { type: string, score: number, tick: number }>} */
    const reasons = {};
    for (const [i, type] of ['grievance', 'revanchism', 'resource_envy', 'legitimacy_hunger', 'containment', 'succession'].entries()) {
      reasons[type] = { type, score: 0.5, tick: 40 + i };
    }
    weak.worldState.spatialLedgers.warReasons['Karrow>Thornwall'] = { reasons };
    // The aggregate the RETIRED reading would have used clears the band easily…
    expect(aggregateReasons01({ reasons })).toBeGreaterThanOrEqual(RAZING_TUNING.LICENSE_ADEQUACY_01);
    // …and the shipped reading still refuses, because no single cause is strong.
    expect(strongestLiveGrievance01(weak.worldState, 'Karrow', 'Thornwall')).toBe(0.5);
    const read = razingExtremityFor({
      worldState: weak.worldState, snapshot: weak.snapshot,
      partyId: 'Karrow', counterpartId: 'Thornwall',
    });
    expect(read.grievanceMet).toBe(false);
    expect(read.missing).toContain('live_grievance');
  });

  test('NEGATIVE CONTROL — a cause under the war layer\'s OWN liveness floor is not a grievance at all', () => {
    const dead = extremeWorld();
    dead.worldState.spatialLedgers.warReasons['Karrow>Thornwall'] = {
      reasons: { grievance: { type: 'grievance', score: REASON_TUNING.MIN_SCORE - 0.01, tick: 40 } },
    };
    expect(strongestLiveGrievance01(dead.worldState, 'Karrow', 'Thornwall')).toBe(0);
    // ANCHORED BY ITS OWN TWIN: the same reader on the same world returns the
    // real score when the cause IS live, so "zero" measures the liveness floor
    // rather than a reader that stopped reading.
    dead.worldState.spatialLedgers.warReasons['Karrow>Thornwall'] = {
      reasons: { grievance: { type: 'grievance', score: REASON_TUNING.MIN_SCORE, tick: 40 } },
    };
    expect(strongestLiveGrievance01(dead.worldState, 'Karrow', 'Thornwall')).toBe(REASON_TUNING.MIN_SCORE);
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

describe('R-WZ-2-REVISED — shell-as-strongest-damage: the word lives in the receipt, not in a number K1 never reads', () => {
  test('⚠️ THE SEAM, EXECUTED — K1 grades BOTH bands identically, and the shell distinction is the receipt', () => {
    // WZ-1 recorded that the shell band "stamps K1's MAX_SEVERITY and the
    // institution grades impaired with capacity01 0". THAT WAS FALSE, and this
    // pin is the correction executed rather than asserted. K1's `damage` cause
    // fires on a TYPE (`impairmentTypes.has('capacity')`) and then grades at its
    // OWN default for the cause; the number this writer puts in the stamp
    // reaches that grading through no path at all. Carrying a razing's severity
    // would mean writing `dmSeverity` onto a PERSISTED status record — an
    // owner-gated persistence-shape change, recorded and not taken.
    const shellSeverity = RAZING_EXECUTION_TUNING.SHELL_BAND + 0.05;
    const [shell] = razingInstitutionStamps([{ id: 'temple' }], shellSeverity, { sinceTick: 40 });
    const [impaired] = razingInstitutionStamps([{ id: 'temple' }], RAZING_EXECUTION_TUNING.SHELL_BAND, { sinceTick: 40 });
    // The law leaf still says the two words…
    expect(shell.status).toBe('shell');
    expect(impaired.status).toBe('impaired');
    // …and the MECHANISM is one mechanism, at K1's own number, both bands.
    expect(shell.impairment?.severity).toBe(INSTITUTION_STATUS_TUNING.defaultSeverity.damage);
    expect(impaired.impairment?.severity).toBe(shell.impairment?.severity);
    expect(shell.impairment?.type).toBe(impaired.impairment?.type);
    // THE DISTINCTION THE AMENDMENT ASKED FOR, in the receipt, on the row.
    expect(shell.receipt).toContain('burned to a shell');
    // The impaired row gets its OWN liveness anchor rather than borrowing the
    // shell row's: they are different objects, and an anchor on a sibling proves
    // nothing about a producer that started returning an empty receipt here.
    expect(impaired.receipt).toContain('damaged');
    // anchored: the line above proves this row carries a real receipt
    expect(impaired.receipt).not.toContain('shell');
  });

  test('K1\'s OWN grading of the stamp, run through K1 — impaired, and never K1\'s unfunded shell', () => {
    const verdict = deriveInstitutionStatus({
      institution: { name: 'temple', status: 'active' },
      record: { impairments: { damage: { cause: 'damage', causeRef: 'razing', sinceTick: 40 } } },
    });
    // The word `shell` in K1 means the money stopped, and this is not that —
    // which is the whole of R-WZ-2, and survives the revision unchanged.
    expect(verdict?.shell).toBe(false);
    expect(verdict?.status).toBe('impaired');
    expect(verdict?.capacity01).toBeGreaterThan(0);
  });

  test('NEGATIVE CONTROL — capacity01 0 is reachable ONLY through the owner-gated dmSeverity path', () => {
    // The arm NOT taken, executed so the owner decision is priced rather than
    // described: K1 does reach "temporarily zero", and the only door is a
    // persisted `dmSeverity` override on the status record.
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
    // And the razing writes no such field anywhere. ⚠️ OVER CODE, NOT SOURCE:
    // the module header now EXPLAINS the owner-gated `dmSeverity` path in prose,
    // and a scan over raw source reds on the explanation. The same trap the
    // determinism scan above records, bitten a second time and cured the same
    // way — a scan reads what the code does.
    expectAbsentWithAnchor(
      CODE(EXECUTION_SOURCE), 'dmSeverity', 'razingInstitutionStamps',
      'the razing writes a DM severity override onto a persisted status record',
    );
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

  test('the stamp severity is K1\'s OWN damage default at EVERY severity, not a number this file picked', () => {
    // Walked rather than sampled, because "one number, both bands" is exactly
    // the kind of claim a single-point pin lets a future fork slip past.
    for (const severity of [0, 0.35, RAZING_EXECUTION_TUNING.SHELL_BAND, RAZING_EXECUTION_TUNING.SHELL_BAND + 0.01, 0.9, 1]) {
      const [stamped] = razingInstitutionStamps([{ id: 'temple' }], severity, {});
      expect(stamped.impairment?.severity).toBe(INSTITUTION_STATUS_TUNING.defaultSeverity.damage);
    }
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

// ─────────────────────────────────────────────────────────────────────────────
// THE THREE PATHS WZ-1 LEFT UNEXECUTED. Every pin above this line drove the
// DARK arm or a hand-built argument list, so three whole stretches of this
// module were reachable only in principle: the decision's ACTIVE branch, the
// belief receipts' body, and the edge-flip call with anything in it. Each is
// driven here through the real substrate, and each carries the mutant that
// proves it is now covered.
// ─────────────────────────────────────────────────────────────────────────────

describe('THE ACTIVE DECISION PATH — the law is reached through the real gate, on both roads', () => {
  test('INITIATION — a wicked court at the extreme, with its nature read off the world', () => {
    const { worldState, snapshot } = litRazingWorld({ warExhaustion: { Karrow: 1 } });
    const decision = razingDecisionFor({
      worldState, snapshot, razerId: 'Karrow', victimId: 'Thornwall', tick: 40, siegeWon: true,
    });
    expect(decision.active).toBe(true);
    // ⚠️ THE BAND IS DERIVED, NOT HANDED IN. `ownNatureBandFor` runs the real
    // alignment read over the real snapshot member, so this asserts the wiring
    // and not a literal — a mutant that pinned the band to a constant reds here.
    expect(decision.alignmentBand).toBe('malicious');
    expect(decision.verdict.permitted).toBe(true);
    expect(decision.verdict.road).toBe('initiation');
    expect(decision.verdict.refusal).toBeNull();
    expect(decision.extremity.extreme).toBe(true);
    // An evil court takes the initiation road even where a license exists — R2's
    // moral economy counts the two separately (razing.js's own note).
    expect(decision.licenseHeld).toBe(false);
    expect(decision.licenseId).toBeNull();
  });

  test('VENGEANCE — a BALANCED court burns because it holds a live license, read through the validator', () => {
    const { worldState, snapshot } = litRazingWorld({
      patron: 'good',
      licenses: {
        'vengeance_license.Thornwall.Marrowfen.12': {
          id: 'vengeance_license.Thornwall.Marrowfen.12',
          razerId: 'Thornwall', victimId: 'Marrowfen', heldSince: 12,
          holders: ['Karrow'],
          consumedBy: null, consumedAtTick: null, extinguishedAtTick: null,
        },
      },
    });
    const decision = razingDecisionFor({
      worldState, snapshot, razerId: 'Karrow', victimId: 'Thornwall', tick: 40, siegeWon: true,
    });
    expect(decision.active).toBe(true);
    expect(decision.alignmentBand).toBe('balanced'); // NOT malicious — the license is doing the work
    expect(decision.verdict.road).toBe('vengeance');
    expect(decision.licenseHeld).toBe(true);
    expect(decision.licenseId).toBe('vengeance_license.Thornwall.Marrowfen.12');
  });

  test('NEGATIVE CONTROL — a FORGED license arms nobody, and the same court is refused', () => {
    // The validator is the gate, and this proves the ACTIVE path consults it:
    // the razer is named as its own holder, which `validateVengeanceLicense`
    // refuses ("a razer cannot hold the right of vengeance for its own
    // atrocity"), so the read returns null and the balanced court is refused.
    const { worldState, snapshot } = litRazingWorld({
      patron: 'good',
      licenses: {
        'vengeance_license.Thornwall.Marrowfen.12': {
          id: 'vengeance_license.Thornwall.Marrowfen.12',
          razerId: 'Thornwall', victimId: 'Marrowfen', heldSince: 12,
          holders: ['Thornwall'],
          consumedBy: null, consumedAtTick: null, extinguishedAtTick: null,
        },
      },
    });
    const decision = razingDecisionFor({
      worldState, snapshot, razerId: 'Karrow', victimId: 'Thornwall', tick: 40, siegeWon: true,
    });
    expect(decision.active).toBe(true);
    expect(decision.licenseHeld).toBe(false);
    expect(decision.verdict.permitted).toBe(false);
    expect(decision.verdict.refusal).toBe('alignment_forbids_initiation');
  });

  test('NEGATIVE CONTROL — the same lit world, no won siege: the ACTIVE path still refuses first on the siege', () => {
    const { worldState, snapshot } = litRazingWorld({ warExhaustion: { Karrow: 1 } });
    const decision = razingDecisionFor({
      worldState, snapshot, razerId: 'Karrow', victimId: 'Thornwall', tick: 40, siegeWon: false,
    });
    // active TRUE and permitted FALSE is the pair that distinguishes "the world
    // is lit and the law said no" from "the world is dark and nobody asked".
    expect(decision.active).toBe(true);
    expect(decision.verdict.refusal).toBe('no_siege');
  });
});

describe('CR-WR8-G, EXECUTED — the belief receipts are produced, not merely permitted', () => {
  test('THE MISTAKEN-FEASIBILITY ARC — a court that believed a conquest in reach, and was wrong', () => {
    const { worldState, snapshot } = litRazingWorld({ warExhaustion: { Karrow: 1 } });
    const receipts = razingBeliefReceipts({
      worldState, snapshot, observerId: 'Karrow', rivalId: 'Thornwall',
      conquestSucceeded: false, wasConquered: false,
    });
    // The two READS are real reads off the belief stage — the whole point of the
    // direction ruling, and until now nothing executed them.
    expect(receipts.feasibility?.known).toBe(true);
    expect(receipts.feasibility?.conquestReachBand).toBe('within_reach');
    expect(receipts.intent?.known).toBe(true);
    expect(receipts.mistaken?.mistaken).toBe(true);
    expect(receipts.mistaken?.direction).toBe('overreached');
    // A victor that razed is not merciful, and the receipt says so by absence.
    expect(receipts.mercy).toBeNull();
  });

  test('NEGATIVE CONTROL — the SAME belief, a conquest that DID land: no mistake to report', () => {
    const { worldState, snapshot } = litRazingWorld({ warExhaustion: { Karrow: 1 } });
    const receipts = razingBeliefReceipts({
      worldState, snapshot, observerId: 'Karrow', rivalId: 'Thornwall',
      conquestSucceeded: true, wasConquered: false,
    });
    expect(receipts.feasibility?.known).toBe(true); // the anchor: the read still works
    expect(receipts.mistaken?.mistaken).toBe(false);
    expect(receipts.mistaken?.direction).toBe('none');
  });

  test('THE MERCY ARC — a good court that could have taken everything and did not', () => {
    // The other half of CR-WR8-G's justification, and the half a razing pin
    // could never reach from a razer's own fixture: mercy is the CONQUEST's
    // opposite, so it needs a court whose conscience refuses the decent.
    const { worldState, snapshot } = litRazingWorld({ patron: 'good', rivalFaith: 'The Open Hand' });
    const receipts = razingBeliefReceipts({
      worldState, snapshot, observerId: 'Karrow', rivalId: 'Thornwall',
      conquestSucceeded: false, wasConquered: false,
    });
    expect(receipts.feasibility?.conquestReachBand).toBe('within_reach');
    expect(receipts.intent?.intent).toBe('terms');
    expect(receipts.intent?.moralVerdict).toBe('refused_the_decent');
    expect(receipts.mercy?.merciful).toBe(true);
    expect(receipts.mercy?.receipt).toContain('could have taken everything');
  });
});

describe('LAW 5, EXECUTED — the edge flips are driven with real holder edges', () => {
  const PERMITTED_PLAN = () => razingPlanFor({
    verdict: razingGate({
      siegeWon: true,
      extremity: readRelationshipExtremity({ edgeType: 'hostile', resentment01: 0.9, grievance01: 0.8 }),
      alignmentBand: 'malicious', actorId: 'Karrow', victimId: 'Thornwall',
    }),
    severity01: 0.7, population: 1200, namedCastCount: 3,
    institutions: [{ id: 'temple' }], movableWealth: 900,
    razerName: 'Karrow', victimName: 'Thornwall', tick: 40,
    holderEdges: [
      { holderId: 'Everdeep', edgeType: 'cordial', adequacyToVictim01: 0.9 },
      { holderId: 'Marrowfen', edgeType: 'hostile', adequacyToVictim01: 0.8 },
      { holderId: 'Stranger', edgeType: 'cordial', adequacyToVictim01: 0.1 },
    ],
  });

  test('all three dispositions are reached at once — flipped, already hostile, and not victim-adequate', () => {
    // ⚠️ EVERY PIN BEFORE THIS ONE PASSED AN EMPTY `holderEdges`, so the whole
    // call returned `{ flipped: [], unchanged: [] }` and any mutant inside it
    // survived. Three edges, three outcomes, one call.
    const { edges } = PERMITTED_PLAN();
    expect(edges.flipped).toEqual([{ holderId: 'Everdeep', fromType: 'cordial', toType: 'hostile' }]);
    expect(edges.unchanged).toEqual([
      { holderId: 'Marrowfen', type: 'hostile', why: 'already_hostile' },
      { holderId: 'Stranger', type: 'cordial', why: 'not_victim_adequate' },
    ]);
  });

  test('CR-WR8-A — the plan mints NO edge to a holder the razer never shared one with', () => {
    const { edges } = PERMITTED_PLAN();
    const named = [...edges.flipped.map((e) => e.holderId), ...edges.unchanged.map((e) => e.holderId)];
    // THE ANCHOR: the call really did produce a populated census, so the absence
    // below measures the mint refusal rather than an empty subject.
    expect(named).toHaveLength(3);
    // anchored: the length assertion one line up proves the census is populated, so this measures the mint refusal
    expect(named).not.toContain('Nowhere');
  });
});

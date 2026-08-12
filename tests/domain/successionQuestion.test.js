/**
 * successionQuestion.test.js — GR-4a's acceptance battery (C1–C7).
 *
 * THE CLOSED DENOMINATOR, and it is closed: seven cases, no eighth. C8 (the privacy
 * boundary) is OMITTED rather than replaced — GR-4a mints no beat and no audience
 * projection, so there is no belief posture to bound; that question belongs to the
 * slice that gives the answer a voice.
 *
 * ⚠ STRAIGHT-LINE REGISTRATION ONLY. A `test(`/`it(` registered inside a loop is
 * TEST_UNREGISTERED to the estate's lighting census and PARKS THE WHOLE FILE, losing
 * every other title in it; `.each()` parks the same way. Every case below is
 * registered at the top level of its describe, and every loop lives INSIDE an `it`.
 *
 * ⚠ THE FIXTURE IS ADVERSARIAL, and C3/C4 are DIFFERENTIALS rather than absolutes for
 * a measured reason. The treaty mover's ordinary compliance walk legitimately rewrites
 * this ledger every tick — it re-scores each live term and re-stamps its burden — so
 * "the ledger did not change" is FALSE on any fixture the mover can actually see, and
 * a pin asserting it would either be vacuous (a fixture the mover ignores) or wrong.
 * The honest claim is the one GR-1's own dormancy fence makes: the lit run and the
 * dark run of the SAME drive produce byte-identical ledgers when the answer is HONOR,
 * and diverge when it is DISAVOW. Both directions are asserted, so neither can drift.
 */
import { describe, expect, it } from 'vitest';

import {
  advanceTreaties, treatyPairKey, treatyBlocksWar, TERM_CATALOG,
} from '../../src/domain/worldPulse/peaceTerms.js';
import {
  answerSuccessionQuestions, repudiableTreatyPairs, repudiateTreaty,
  SUCCESSION_REPUDIATION_TYPE, TREATY_REPUDIATION_TYPE,
} from '../../src/domain/worldPulse/treatyBreach.js';
import { BREACH_TYPES, isRepudiationBreach } from '../../src/domain/worldPulse/treatyBreachTypes.js';
import {
  isSuccessionDisavowable, successionAnswerFor, successionQuestionsForTick,
} from '../../src/domain/worldPulse/treatySuccession.js';
import { PACT_ENDINGS, PACT_LINEAGE_ACTS, lineageOf } from '../../src/domain/worldPulse/pactAmendment.js';
import { treatyDispositionDeltas } from '../../src/domain/worldPulse/treatyDisposition.js';
import { treatyOrientationOf } from '../../src/domain/worldPulse/treatyOrientation.js';
import { scoreTreatyDefault } from '../../src/domain/worldPulse/warReasons.js';
import { renderTreatiesForSettlement } from '../../src/domain/display/treatyDocument.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const WAR = { warLayerEnabled: true, peaceEngineEnabled: true };
const TICK = 20;
const KEY = treatyPairKey('crown', 'march');
const FALLEN = 'npc_old';

function term(type, patch = {}) {
  const spec = TERM_CATALOG[type];
  const t = {
    type, family: spec.family, magnitude: 0.4, mintedTick: 0, expiresTick: 60,
    weightSpent: spec.weight, complianceState: 'honored', trueState: 'honored', burden01: 0,
    receipt: `${type} term`, ...patch,
  };
  if (spec.stream) { t.deliveredToVictor = t.deliveredToVictor ?? 0; t.extractedFromLoser = t.extractedFromLoser ?? 0; }
  if (spec.executor === 'seam') t.seam = true;
  return t;
}

/**
 * A world where `march`'s seat changed hands THIS tick and the fallen holder's name is
 * on the parchment. `burden01` is the dial C2/C3 turn: it is the instrument's own
 * measured weight, which is what the band is read against.
 */
function world({ burden01 = 0.9, rules = {}, cause = 'coup', terms = null, sworn = true, rows = null } = {}) {
  const treaty = {
    parties: ['crown', 'march'], victorId: 'crown', loserId: 'march', mintedTick: 0,
    believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1,
    complianceState: 'honored', receipts: ['pin'],
    terms: terms || [term('tribute', { burden01 })],
    ...(sworn ? { sworn: { march: { npcId: FALLEN, name: 'Old March', swornTick: 2 } } } : {}),
  };
  return {
    tick: TICK,
    simulationRules: { ...WAR, ...rules },
    calendar: { elapsedWeeks: 30 },
    deployments: {},
    relationshipStates: {},
    spatialLedgers: {
      treaties: { [KEY]: treaty },
      npcLadder: {
        march: {
          factions: {},
          npcs: {},
          seatTransitions: rows || [{
            id: 'st.march.1', fromRulerId: FALLEN, toRulerId: 'npc_new', cause, tick: TICK,
          }],
        },
      },
    },
  };
}

const ITEMS = [
  { id: 'crown', name: 'Crown', settlement: { name: 'crown', tier: 'city', population: 60000, npcs: [], activeConditions: [] } },
  { id: 'march', name: 'March', settlement: { name: 'march', tier: 'village', population: 280, npcs: [], activeConditions: [] } },
];

/** Drive the real mover at the real mount, at `tick`. */
function advance(worldState, tick = TICK) {
  return advanceTreaties({
    snapshot: { settlements: ITEMS, byId: new Map(ITEMS.map((i) => [i.id, i])), regionalGraph: { edges: [] } },
    worldState,
    settlementUpdates: [],
    graph: { edges: [] },
    pIndex: null,
    tick,
    now: '2026-01-01T00:00:00.000Z',
  });
}

const ledgerJson = (result) => JSON.stringify(getSpatialLedger(result.worldState, 'treaties') || null);
const recordOf = (result) => (getSpatialLedger(result.worldState, 'treaties') || {})[KEY];
const LIT = { oathHolderEnabled: true };

// ── C1) THE REFACTOR IS A NO-OP ─────────────────────────────────────────────────
//
// The shared shell was extracted from `repudiateTreaty`'s body. The claim is not that
// the tests still pass; it is that the RECORD is byte-identical. This literal was
// captured by EXECUTING the pre-refactor engine at a9a10e6d on the peaceTerms.test.js
// WR-0c fixture, so the equality below compares the factored engine against the one
// that shipped rather than against a hand-transcribed expectation.
const PRE_REFACTOR_REPUDIATION_RECORD = '{"parties":["iron","weak"],"victorId":"iron","loserId":"weak","mintedTick":0,"believedMarginAtSignature":0.35,"budgetGranted":3,"budgetSpent":1,"complianceState":"defaulted","terms":[{"type":"non_aggression","family":"security","magnitude":0.4,"mintedTick":0,"expiresTick":10,"weightSpent":0.4,"complianceState":"defaulted","trueState":"defaulted","burden01":0,"receipt":"non_aggression term","repudiatedComplianceState":"honored","repudiatedTrueState":"honored","repudiatedExpiresTick":40,"repudiatedTick":10},{"type":"tribute","family":"economic","magnitude":0.4,"mintedTick":0,"expiresTick":10,"weightSpent":1,"complianceState":"defaulted","trueState":"defaulted","burden01":0,"receipt":"tribute term","deliveredToVictor":2,"extractedFromLoser":3,"repudiatedComplianceState":"honored","repudiatedTrueState":"honored","repudiatedExpiresTick":30,"repudiatedTick":10},{"type":"demilitarization","family":"security","magnitude":0.6,"mintedTick":0,"expiresTick":10,"weightSpent":0.9,"complianceState":"defaulted","trueState":"defaulted","burden01":0,"receipt":"demilitarization term","repudiatedComplianceState":"honored","repudiatedTrueState":"honored","repudiatedExpiresTick":35,"repudiatedTick":10},{"type":"occupation_continuation","family":"territorial","magnitude":0.4,"mintedTick":0,"expiresTick":10,"weightSpent":1.1,"complianceState":"defaulted","trueState":"defaulted","burden01":0,"receipt":"occupation_continuation term","repudiatedComplianceState":"honored","repudiatedTrueState":"honored","repudiatedExpiresTick":25,"repudiatedTick":10}],"receipts":["pin","The pact was repudiated openly; every promise under it ceased at once."],"defaultedBy":"iron","defaultSeverity01":1,"breachType":"repudiation","repudiatedTick":10,"breachExpiresTick":40}';

// ⚠ THE KEY ORDER OF THIS LITERAL IS PART OF THE FIXTURE. The shell rebuilds the record
// with `...treaty`, so the source's own insertion order survives into the output — and
// the golden above was captured on `peaceTerms.test.js`'s `treatyOf`, where `terms`
// precedes `receipts`. Reordering these two lines reds the equality, which is the
// equality doing its job rather than a brittleness to work around.
function wr0cWorld() {
  const treaty = {
    parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak', mintedTick: 0,
    believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1,
    complianceState: 'honored',
    terms: [
      term('non_aggression', { expiresTick: 40 }),
      term('tribute', { expiresTick: 30, deliveredToVictor: 2, extractedFromLoser: 3 }),
      term('demilitarization', { expiresTick: 35, magnitude: 0.6 }),
      term('occupation_continuation', { expiresTick: 25 }),
    ],
    receipts: ['pin'],
  };
  return {
    tick: 10, simulationRules: { ...WAR }, calendar: { elapsedWeeks: 30 }, deployments: {},
    relationshipStates: {}, spatialLedgers: { treaties: { [treatyPairKey('iron', 'weak')]: treaty } },
  };
}

describe('C1 — the J-GR-16 factoring is a NO-OP, and the vocabulary is a strict superset', () => {
  it('the shared shell reproduces the pre-refactor repudiation record byte for byte', () => {
    const breached = repudiateTreaty(wr0cWorld(), { fromId: 'iron', toId: 'weak', tick: 10 });
    expect(breached.ok).toBe(true);
    const record = getSpatialLedger(breached.worldState, 'treaties')[treatyPairKey('iron', 'weak')];
    expect(JSON.stringify(record)).toBe(PRE_REFACTOR_REPUDIATION_RECORD);
  });

  it('the DM verb\'s own gate and composer surface did not move', () => {
    const source = wr0cWorld();
    // isRepudiableTreaty is module-private; repudiableTreatyPairs is its only observable
    // surface, and it answers for BOTH of the predicate's live conditions at once.
    expect(repudiableTreatyPairs(source, 10)).toEqual([
      { fromId: 'iron', toId: 'weak' }, { fromId: 'weak', toId: 'iron' },
    ]);
    const breached = repudiateTreaty(source, { fromId: 'iron', toId: 'weak', tick: 10 });
    expect(repudiableTreatyPairs(breached.worldState, 10)).toEqual([]);
    const repeated = repudiateTreaty(breached.worldState, { fromId: 'iron', toId: 'weak', tick: 10 });
    expect(repeated.ok).toBe(false);
    expect(repeated.code).toBe('treaty_breach_no_live_nap');
    expect(repeated.worldState).toBe(breached.worldState);
  });

  it('the frozen vocabulary keeps `repudiation` FIRST, so every current record answers as before', () => {
    expect([...BREACH_TYPES]).toEqual(['repudiation', 'succession_repudiation']);
    expect(BREACH_TYPES[0]).toBe(TREATY_REPUDIATION_TYPE);
    expect(BREACH_TYPES[1]).toBe(SUCCESSION_REPUDIATION_TYPE);
    expect(Object.isFrozen(BREACH_TYPES)).toBe(true);
  });

  it('the predicate is TOTAL and agrees with the literal it replaced on every current shape', () => {
    // The loop is INSIDE the it(), which is what keeps this file out of the parked set.
    const shapes = [null, undefined, 0, '', 'repudiation', [], {}, { breachType: null },
      { breachType: '' }, { breachType: false }, { breachType: 'repudiation' },
      { breachType: 'defaulted' }, { breachType: 'hollowed_quiet' }];
    for (const shape of shapes) {
      const legacy = String(/** @type {{breachType?:unknown}} */ (shape || {}).breachType || '') === 'repudiation';
      expect(isRepudiationBreach(shape), `shape ${JSON.stringify(shape)}`).toBe(legacy);
    }
    // …and the one value that is NEW answers true, which is the whole point of the cure.
    expect(isRepudiationBreach({ breachType: SUCCESSION_REPUDIATION_TYPE })).toBe(true);
  });
});

// ── C2) THE MAIN REACHABLE BEHAVIOR ─────────────────────────────────────────────

describe('C2 — a coup-born seat disavows past the band', () => {
  it('the treaty takes a banded, graded succession breach with full provenance and an ending', () => {
    const out = advance(world({ rules: LIT, cause: 'coup', burden01: 0.9 }));
    expect(out.changed).toBe(true);
    const record = recordOf(out);
    expect(record.breachType).toBe(SUCCESSION_REPUDIATION_TYPE);
    expect(record.defaultedBy).toBe('march');
    expect(record.complianceState).toBe('defaulted');
    expect(record.defaultSeverity01).toBe(0.35);
    expect(record.defaultSeverity01).toBeLessThan(1);
    expect(record.breachExpiresTick).toBe(60);
    const [clause] = record.terms;
    expect(clause.complianceState).toBe('defaulted');
    expect(clause.trueState).toBe('defaulted');
    expect(clause.expiresTick).toBe(TICK);
    expect(clause.repudiatedComplianceState).toBe('honored');
    expect(clause.repudiatedTrueState).toBe('honored');
    expect(clause.repudiatedExpiresTick).toBe(60);
    expect(clause.repudiatedTick).toBe(TICK);
    const ending = lineageOf(record).at(-1);
    expect(ending).toMatchObject({ act: 'disavowed_by_succession', tick: TICK, ending: 'disavowed_by_succession' });
  });

  it('a LINEAL heir pays MORE than a seat that seized the chair, and both stay below 1', () => {
    const lineal = recordOf(advance(world({ rules: LIT, cause: 'succession', burden01: 0.9 })));
    const seized = recordOf(advance(world({ rules: LIT, cause: 'coup', burden01: 0.9 })));
    expect(lineal.defaultSeverity01).toBe(0.75);
    expect(seized.defaultSeverity01).toBe(0.35);
    expect(lineal.defaultSeverity01).toBeGreaterThan(seized.defaultSeverity01);
    expect(lineal.defaultSeverity01).toBeLessThan(1);
  });

  it('every cause the row can really carry is graded, and an unknown one takes the default arm', () => {
    const graded = ['coup', 'challenge', 'succession', 'vacancy', 'government_change', 'a_cause_nobody_mints']
      .map((cause) => successionAnswerFor({ cause, pressure01: 0.9 }));
    for (const answer of graded) {
      expect(answer.answer).toBe('disavow');
      expect(answer.severity01).toBeGreaterThan(0);
      expect(answer.severity01).toBeLessThan(1);
      expect(['lineal', 'coup_born']).toContain(answer.kind);
    }
    expect(graded.map((a) => a.kind)).toEqual([
      'coup_born', 'coup_born', 'lineal', 'lineal', 'coup_born', 'coup_born',
    ]);
  });
});

// ── C3) THE SILENCE-HONORS NEGATIVE ─────────────────────────────────────────────

describe('C3 — below the band the world is byte-identical to one that never asked', () => {
  it('the question IS asked and answered HONOR, and the lit ledger equals the dark ledger', () => {
    // NON-VACUITY FIRST: the question really opened on this fixture. Without this the
    // equality below could be measuring a trigger that simply never fired.
    const questions = successionQuestionsForTick(world({ rules: LIT, burden01: 0.2 }), TICK);
    expect(questions).toHaveLength(1);
    expect(questions[0].answer).toBe('honor');
    expect(questions[0].pressure01).toBe(0.2);

    const lit = advance(world({ rules: LIT, burden01: 0.2 }));
    const dark = advance(world({ burden01: 0.2 }));
    expect(ledgerJson(lit)).toBe(ledgerJson(dark));
  });

  it('HONOR writes nothing at all — no breach, no ending, no key', () => {
    const lit = advance(world({ rules: LIT, burden01: 0.2 }));
    const record = recordOf(lit);
    expect(record.breachType).toBeUndefined();
    expect(record.defaultedBy).toBeUndefined();
    expect(record.breachExpiresTick).toBeUndefined();
    expect(lineageOf(record).map((entry) => entry.act)).toEqual(['formed']);
    // The instrument is still THERE (the anchor) and only the breach is missing, so this
    // measures the band rather than a ledger that drifted away under the test.
    expectAbsentWithAnchor(
      ledgerJson(lit), 'succession_repudiation', KEY,
      'below the band the instrument stands and no breach is written',
    );
  });

  it('the answer returns the caller\'s own state reference when nothing is disavowed', () => {
    const below = world({ rules: LIT, burden01: 0.2 });
    expect(answerSuccessionQuestions(below, TICK)).toBe(below);
  });
});

// ── C4) ABSENT / DISABLED — THE DORMANCY FENCE ──────────────────────────────────

describe('C4 — absent and explicit-false are one answer, and the fence can see', () => {
  it('a succession over a stamped treaty moves nothing while the flag is absent', () => {
    const dark = advance(world({ burden01: 0.9 }));
    expectAbsentWithAnchor(
      ledgerJson(dark), 'succession_repudiation', KEY,
      'dark, the instrument stands untouched over a fixture the lit control does break',
    );
    expect(answerSuccessionQuestions(world({ burden01: 0.9 }), TICK)).toBeTruthy();
  });

  it('ABSENT and EXPLICIT FALSE are byte-identical over the whole ledger', () => {
    const absent = advance(world({ burden01: 0.9 }));
    const explicitFalse = advance(world({ rules: { oathHolderEnabled: false }, burden01: 0.9 }));
    expect(ledgerJson(explicitFalse)).toBe(ledgerJson(absent));
  });

  it('THE LIT-MUTANT CONTROL — the same drive lit DOES diverge, so the two zeros above mean dormancy', () => {
    const absent = advance(world({ burden01: 0.9 }));
    const lit = advance(world({ rules: LIT, burden01: 0.9 }));
    expect(ledgerJson(lit)).not.toBe(ledgerJson(absent));
    expect(ledgerJson(lit)).toContain('succession_repudiation');
    expectAbsentWithAnchor(
      ledgerJson(absent), 'succession_repudiation', 'crown>march',
      'the dark ledger still holds the instrument, and only the breach is missing',
    );
  });

  it('the pure derivation is never even reached while dark — the gate is at the writer', () => {
    // The leaf is UNGATED by design (it is a pure read), so the claim being made here is
    // about the WRITER's gate: dark, it refuses before the leaf can look at a stamp. The
    // call-path proof lives in the dormancy fence's swornPartiesOf counter; this is its
    // state-side twin.
    const dark = world({ burden01: 0.9 });
    expect(answerSuccessionQuestions(dark, TICK)).toBe(dark);
    expect(successionQuestionsForTick(dark, TICK)).toHaveLength(1);
  });
});

// ── C5) THE TRIBUTE-ONLY DISAVOWAL — the two gates are provably separate ────────

describe('C5 — a tribute-only instrument disavows, and the DM verb still cannot see it', () => {
  it('the succession predicate answers YES where repudiableTreatyPairs is empty', () => {
    const source = world({ rules: LIT, burden01: 0.9, terms: [term('tribute', { burden01: 0.9 })] });
    const treaty = getSpatialLedger(source, 'treaties')[KEY];
    // The DM verb requires a live non_aggression term. This instrument has none, so the
    // open-repudiation road is structurally shut — and that is J-GR-16's whole claim.
    expect(repudiableTreatyPairs(source, TICK)).toEqual([]);
    expect(isSuccessionDisavowable(treaty, 'march', FALLEN, TICK)).toBe(true);
    const out = advance(source);
    expect(recordOf(out).breachType).toBe(SUCCESSION_REPUDIATION_TYPE);
    // …and the composer surface is STILL empty afterwards: the succession road did not
    // widen the verb's reach, it ran beside it.
    expect(repudiableTreatyPairs(out.worldState, TICK)).toEqual([]);
  });

  it('the predicate refuses a treaty whose stamp names somebody else, or nobody', () => {
    const treaty = getSpatialLedger(world({ rules: LIT }), 'treaties')[KEY];
    expect(isSuccessionDisavowable(treaty, 'march', 'npc_someone_else', TICK)).toBe(false);
    expect(isSuccessionDisavowable(treaty, 'crown', FALLEN, TICK)).toBe(false);
    const unstamped = getSpatialLedger(world({ rules: LIT, sworn: false }), 'treaties')[KEY];
    expect(isSuccessionDisavowable(unstamped, 'march', FALLEN, TICK)).toBe(false);
    // A legacy instrument opens no question and needs no backfill — held by the data
    // shape rather than by a branch.
    expect(successionQuestionsForTick(world({ rules: LIT, sworn: false }), TICK)).toEqual([]);
  });
});

// ── C6) WRITER → READER, AND THE INHERITED DOSSIER ROUND TRIP ───────────────────

describe('C6 — the readers see the disavowal, and the dossier already speaks it', () => {
  it('war-blocking lifts, the casus scores the GRADED severity, and no held-win is minted', () => {
    const out = advance(world({ rules: LIT, cause: 'coup', burden01: 0.9 }));
    const record = recordOf(out);
    expect(treatyBlocksWar(out.worldState, 'crown', 'march', TICK)).toBe(false);
    // Not 1.0 — the grade survives all the way to the scorer, which is the reason the
    // shell guard reads the recorded weight instead of re-stamping it.
    expect(scoreTreatyDefault({ treaties: [record], fromId: 'crown', toId: 'march' }, 'seed').score).toBe(0.35);
    expect(treatyDispositionDeltas({
      enabled: true, outcome: 'held', treaty: record, previousCompliance: 'honored',
    })).toEqual([]);
  });

  it('the disposition adapter DOES still reward a clean treaty — the cure is not a blanket mute', () => {
    const clean = getSpatialLedger(world({ rules: LIT }), 'treaties')[KEY];
    expect(treatyDispositionDeltas({
      enabled: true, outcome: 'held', treaty: clean, previousCompliance: 'honored',
    }).map((delta) => delta.id)).toEqual(['crown', 'march']);
  });

  it('renderTreatiesForSettlement speaks the broken shell in house voice, with no display edit', () => {
    const out = advance(world({ rules: LIT, cause: 'coup', burden01: 0.9 }));
    const [doc] = renderTreatiesForSettlement(out.worldState, 'crown');
    expect(doc.complianceState).toBe('defaulted');
    const [line] = doc.termLines;
    expect(line.complianceState).toBe('defaulted');
    expect(line.strainLine).toBe('The promised wagons no longer come; the tribute has stopped, and the oath lies broken here.');
  });
});

// ── C7) DUPLICATE / IDEMPOTENT + THE LIFECYCLE ROUND TRIP ───────────────────────

describe('C7 — answered once, and the shell survives to its own horizon', () => {
  it('re-running the same tick writes nothing further and returns the same state reference', () => {
    const out = advance(world({ rules: LIT, burden01: 0.9 }));
    const again = advance(out.worldState);
    expect(again.changed).toBe(false);
    expect(again.worldState).toBe(out.worldState);
    expect(ledgerJson(again)).toBe(ledgerJson(out));
  });

  it('a broken shell is refused by the predicate that broke it', () => {
    const out = advance(world({ rules: LIT, burden01: 0.9 }));
    const record = recordOf(out);
    expect(isRepudiationBreach(record)).toBe(true);
    expect(isSuccessionDisavowable(record, 'march', FALLEN, TICK)).toBe(false);
  });

  it('the graded severity survives a JSON round trip and the shell prunes at its ORIGINAL horizon', () => {
    const out = advance(world({ rules: LIT, burden01: 0.9 }));
    const reloaded = JSON.parse(JSON.stringify(out.worldState));
    const record = getSpatialLedger(reloaded, 'treaties')[KEY];
    expect(record.defaultSeverity01).toBe(0.35);
    expect(record.breachType).toBe(SUCCESSION_REPUDIATION_TYPE);
    expect(treatyOrientationOf(record)).toMatchObject({ resolved: true, obligorId: 'march', obligeeId: 'crown' });

    // One tick short of the horizon the shell is still legible AND still graded — the
    // arm that would have re-stamped it to 1.0 is the one this pin exists to hold down.
    const held = advance(reloaded, 59);
    expect(getSpatialLedger(held.worldState, 'treaties')[KEY].defaultSeverity01).toBe(0.35);
    // At the horizon it is spent history and is dropped.
    const spent = advance(reloaded, 60);
    expect(getSpatialLedger(spent.worldState, 'treaties')).toBeUndefined();
  });

  it('the closed lineage vocabularies carry the new ending, codepoint-ordered and frozen', () => {
    expect(PACT_ENDINGS).toContain('disavowed_by_succession');
    expect(PACT_LINEAGE_ACTS).toContain('disavowed_by_succession');
    expect([...PACT_ENDINGS]).toEqual([...PACT_ENDINGS].slice().sort());
    expect([...PACT_LINEAGE_ACTS]).toEqual([...PACT_LINEAGE_ACTS].slice().sort());
  });
});

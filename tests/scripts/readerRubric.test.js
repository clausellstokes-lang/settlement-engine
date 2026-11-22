/**
 * readerRubric.test.js — the reader rubric is a closed, typed, checkable instrument.
 *
 * EVERY ARM DRIVES THE VALIDATOR TO A REFUSAL BY NAME, and asserts the sibling refusals are
 * SILENT, so a plant convicts one rule rather than the file. An arm that only asserted
 * `ok === false` would pass on the wrong refusal firing.
 *
 * NO `it.each` AND NO GENERATED TITLES: the each-family park ceiling has zero headroom, so
 * every arm is a plain `it` with its loop inside.
 */
import { describe, it, expect } from 'vitest';
import {
  READER_SYSTEMS, READER_RUBRIC, VISIBILITY, LEGIBILITY, REGISTER, COHERENCE,
  CONTRADICTION_CLASSES, CAR_CLASSES, LANE_MINTABLE_CAR_CLASSES,
  MECHANICAL_REGISTER_MEMBERS, readerCitationKind, citationNeedsTick,
  mechanicalRegisterOf, requiredQuestionIdsFor, visibilityHistogram,
  validateReaderReport, validateBacklogRow,
} from '../../scripts/review/readerRubric.mjs';

/** Codes the report validator can emit, so an arm can assert its siblings are silent. */
const codesOf = (out) => out.refusals.map((r) => r.code);

/** A complete, clean report for one system — the positive control every arm perturbs. */
function cleanReport(system = 'capacity') {
  return {
    system,
    posture: 'launch',
    answers: requiredQuestionIdsFor(system).map((questionId) => ({
      questionId,
      visibility: 'shown',
      legibility: 'addressed',
      coherence: 'coherent',
      register: ['in_voice'],
      citations: [{ doc: 'herald', locator: 'y12#3', text: 'The granaries are the wall.' }],
    })),
  };
}

describe('the reader rubric is a closed, typed, checkable instrument', () => {
  it('every rubric question has a unique id, a known system and a record home, and the set is frozen', () => {
    const ids = READER_RUBRIC.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(Object.isFrozen(READER_RUBRIC)).toBe(true);
    for (const question of READER_RUBRIC) {
      expect(READER_SYSTEMS).toContain(question.system);
      expect(typeof question.recordHome).toBe('string');
      expect(question.recordHome.length).toBeGreaterThan(0);
      expect(Object.isFrozen(question)).toBe(true);
    }
    // Every system is actually seated: a system with no question could never be scored.
    for (const system of READER_SYSTEMS) {
      expect(requiredQuestionIdsFor(system).length).toBeGreaterThan(0);
    }
  });

  it('the five closed axes are frozen and an unknown vocabulary word is refused by name', () => {
    for (const axis of [VISIBILITY, LEGIBILITY, REGISTER, COHERENCE, CONTRADICTION_CLASSES, CAR_CLASSES]) {
      expect(Object.isFrozen(axis)).toBe(true);
    }
    const report = cleanReport();
    report.answers[0].visibility = 'kinda';
    const out = validateReaderReport(report, {}, () => true);
    expect(codesOf(out)).toContain('unknown_vocabulary');
    expect(out.refusals.find((r) => r.code === 'unknown_vocabulary').detail).toBe('visibility: kinda');
    expect(out.ok).toBe(false);
  });

  it('an answer with no citation is refused, and an unresolvable locator is refused', () => {
    const bare = cleanReport();
    bare.answers[0].citations = [];
    expect(codesOf(validateReaderReport(bare, {}, () => true))).toContain('citation_required');

    const unresolvable = cleanReport();
    const out = validateReaderReport(unresolvable, {}, () => null);
    expect(codesOf(out)).toContain('citation_unresolvable');
    // The clean report resolves: the refusal is the resolver's word, not the shape's.
    expect(validateReaderReport(cleanReport(), {}, () => true).ok).toBe(true);
  });

  it('the citation kind is derived from the document id, and a view model is never a surface', () => {
    expect(readerCitationKind('herald')).toBe('surface');
    expect(readerCitationKind('campaign-pdf')).toBe('surface');
    expect(readerCitationKind('dossier-soak-a.pdf')).toBe('surface');
    expect(readerCitationKind('letter-y12')).toBe('surface');
    // A rendered view MODEL is the data behind the page, not the page.
    expect(readerCitationKind('dossier-soak-a.vm')).toBe('record');
    expect(readerCitationKind('world-y30')).toBe('record');
    expect(readerCitationKind('npc-soak-a')).toBe('record');
    expect(readerCitationKind('faith-soak-b')).toBe('record');
  });

  it('a shown answer whose only citations are record documents is refused as surface_citation_required', () => {
    const report = cleanReport();
    report.answers[0].citations = [{ doc: 'world-y30', locator: 'settlements.0', text: 'ok' }];
    const out = validateReaderReport(report, {}, () => true);
    expect(codesOf(out)).toContain('surface_citation_required');
    expect(out.refusals.find((r) => r.code === 'surface_citation_required').detail)
      .toBe('a model dump is not a surface');
    // The same citation on an INVISIBLE answer is exactly right. Asserted as the WHOLE
    // refusal set rather than the absence of one code, so the arm cannot pass vacuously on
    // a validator that returned nothing for an unrelated reason.
    const invisible = cleanReport();
    invisible.answers[0].visibility = 'invisible';
    invisible.answers[0].citations = [{ doc: 'world-y30', locator: 'settlements.0', text: 'ok' }];
    expect(validateReaderReport(invisible, {}, () => true).refusals).toEqual([]);
  });

  it('an answer claiming a fact is written but unseen must cite the record that proves it exists', () => {
    const report = cleanReport();
    report.answers[0].visibility = 'invisible';
    // Only a surface citation: nothing proves the fact was ever written.
    const out = validateReaderReport(report, {}, () => true);
    expect(codesOf(out)).toContain('record_citation_required');
    expect(out.refusals.find((r) => r.code === 'record_citation_required').detail)
      .toContain('outlook');
    // Every written-but-unseen value carries the same duty.
    for (const visibility of ['shown_then_retired', 'dark_by_flag', 'dark_in_default_preset', 'dark_by_entitlement']) {
      const each = cleanReport();
      each.answers[0].visibility = visibility;
      expect(codesOf(validateReaderReport(each, {}, () => true))).toContain('record_citation_required');
    }
  });

  it('a report that omits one of its system questions is refused as question_missing', () => {
    // THE FAILURE THIS CLOSES: a panel that never asks a question scores nothing against
    // it, so an unlooked-at system reads exactly like a defect-free one.
    const report = cleanReport();
    const dropped = report.answers.pop();
    const out = validateReaderReport(report, {}, () => true);
    expect(codesOf(out)).toContain('question_missing');
    expect(out.refusals.find((r) => r.code === 'question_missing').answerId).toBe(dropped.questionId);
    // Answering one twice is refused too — a duplicate is not an answer.
    const twice = cleanReport();
    twice.answers.push({ ...twice.answers[0] });
    const twiceOut = validateReaderReport(twice, {}, () => true);
    expect(codesOf(twiceOut)).toContain('question_missing');
    expect(twiceOut.refusals.find((r) => r.code === 'question_missing').detail)
      .toContain('answered 2 times');
    // Q-ADR-1 is asked of every system, not only its own.
    expect(requiredQuestionIdsFor('faith')).toContain('Q-ADR-1');
    expect(requiredQuestionIdsFor('settlement_fact').filter((id) => id === 'Q-ADR-1').length).toBe(1);
  });

  it('a news chronicle or letter citation with no tick is refused as tick_required', () => {
    expect(citationNeedsTick('news')).toBe(true);
    expect(citationNeedsTick('chronicle-advance')).toBe(true);
    expect(citationNeedsTick('letter-y07')).toBe(true);
    expect(citationNeedsTick('herald')).toBe(false);
    const report = cleanReport();
    report.answers[0].citations = [{ doc: 'news', locator: 'entries.4', text: 'The fields are full.' }];
    expect(codesOf(validateReaderReport(report, {}, () => true))).toContain('tick_required');
    // Asserted as the WHOLE refusal set, so the arm cannot pass vacuously.
    const ticked = cleanReport();
    ticked.answers[0].citations = [{ doc: 'news', locator: 'entries.4', tick: 312, text: 'The fields are full.' }];
    expect(validateReaderReport(ticked, {}, () => true).refusals).toEqual([]);
  });

  it('the mechanical register members are machine-checked over the cited surface string, both directions', () => {
    expect([...MECHANICAL_REGISTER_MEMBERS]).toEqual([
      'em_dash', 'exclamation', 'digit_in_prose', 'feature_flag_language', 'engine_token',
    ]);
    expect(mechanicalRegisterOf('The granaries are the wall.')).toEqual([]);
    expect(mechanicalRegisterOf('The fields are full — and how!')).toEqual(['em_dash', 'exclamation']);
    expect(mechanicalRegisterOf('population_crowding fired')).toContain('engine_token');
    expect(mechanicalRegisterOf('demographicsEnabled is on')).toContain('feature_flag_language');
    expect(mechanicalRegisterOf('It holds 1200 souls')).toContain('digit_in_prose');

    // A reader who MISSES a tell is corrected.
    const missed = cleanReport();
    missed.answers[0].citations[0].text = 'The fields are full!';
    const missedOut = validateReaderReport(missed, {}, () => true);
    expect(codesOf(missedOut)).toContain('register_violation');
    expect(missedOut.refusals.find((r) => r.code === 'register_violation').detail)
      .toContain('carries exclamation, undeclared');

    // A reader who CLAIMS a tell that is not there is corrected too.
    const claimed = cleanReport();
    claimed.answers[0].register = ['in_voice', 'em_dash'];
    const claimedOut = validateReaderReport(claimed, {}, () => true);
    expect(codesOf(claimedOut)).toContain('register_violation');
    expect(claimedOut.refusals.find((r) => r.code === 'register_violation').detail)
      .toContain('does not carry em_dash, declared');
  });

  it('a contradiction with no class is refused, and a complete report over the whole rubric passes clean', () => {
    const report = cleanReport();
    report.answers[0].coherence = 'contradiction';
    expect(codesOf(validateReaderReport(report, {}, () => true))).toContain('contradiction_class_required');
    const classed = cleanReport();
    classed.answers[0].coherence = 'contradiction';
    classed.answers[0].contradictionClass = 'at_war_trading_normally';
    expect(validateReaderReport(classed, {}, () => true).ok).toBe(true);

    // The positive control: every system's full rubric passes with ZERO refusals.
    for (const system of READER_SYSTEMS) {
      const out = validateReaderReport(cleanReport(system), {}, () => true);
      expect(out.refusals).toEqual([]);
      expect(out.ok).toBe(true);
    }
    // The histogram counts what the report actually said, per system.
    const histogram = visibilityHistogram([cleanReport('faith')]);
    expect(histogram.faith.shown).toBe(requiredQuestionIdsFor('faith').length);
    expect(histogram.faith.invisible).toBe(0);
    expect(Object.keys(histogram).sort()).toEqual([...READER_SYSTEMS].sort());
  });

  it('the lane-mintable car classes are exactly WIRING PROSE_RENDER and DISPLAY, and a persisted writer is refused', () => {
    expect([...LANE_MINTABLE_CAR_CLASSES]).toEqual(['WIRING', 'PROSE_RENDER', 'DISPLAY']);
    expect(CAR_CLASSES).toContain('ENGINE_OWNER');
    expect(CAR_CLASSES).toContain('PROSE_PERSISTED');
    expect(validateBacklogRow({ carClass: 'NOT_A_CLASS' }).ok).toBe(false);

    // The split is decided by WHERE THE STRING LIVES, never by the symptom.
    for (const prefix of ['src/domain/worldPulse/', 'src/domain/region/', 'src/domain/spatial/']) {
      const out = validateBacklogRow({ id: 'r1', carClass: 'PROSE_RENDER', writerPath: `${prefix}wizardNews.js` });
      expect(out.ok).toBe(false);
      expect(out.refusals.some((r) => r.detail.includes('PROSE_PERSISTED'))).toBe(true);
    }
    // A display leaf is exactly where a lane MAY mint.
    expect(validateBacklogRow({ id: 'r2', carClass: 'PROSE_RENDER', writerPath: 'src/domain/display/demographicReading.js' }).ok).toBe(true);
  });

  it('a backlog row that moved goldens or world documents without a record or owner row is refused', () => {
    expect(validateBacklogRow({ id: 'g1', carClass: 'DISPLAY', goldensMoved: ['k1', 'k2'] }).ok).toBe(false);
    expect(validateBacklogRow({ id: 'g2', carClass: 'DISPLAY', goldensMoved: ['k1'], shiftRecord: 'A' }).ok).toBe(true);
    expect(validateBacklogRow({ id: 'g3', carClass: 'WIRING', outputMoving: true }).ok).toBe(false);
    expect(validateBacklogRow({ id: 'g4', carClass: 'WIRING', outputMoving: true, ownerRow: 'RR-2' }).ok).toBe(true);
    // An owner class may never be minted without the owner's row, even moving nothing.
    expect(validateBacklogRow({ id: 'g5', carClass: 'ENGINE_OWNER' }).ok).toBe(false);
    expect(validateBacklogRow({ id: 'g6', carClass: 'ENGINE_OWNER', ownerRow: 'RR-9' }).ok).toBe(true);
    expect(validateBacklogRow({ id: 'g7', carClass: 'LIGHTING_DESK' }).ok).toBe(false);
  });
});

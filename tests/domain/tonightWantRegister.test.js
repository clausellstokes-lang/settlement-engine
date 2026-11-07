/**
 * Lane R11 (the chair's ruling, 2026-11-04): THE ONE SHAPE RULE for a want a DM is handed after
 * "Wants to" (`tonightSheet.js :: isVoiceableWant` / `wantRegisterFault`). The quoted abstract
 * lines are the registry goals the sixty-settlement read found on the Tonight sheet
 * (docs/READER_R11_TONIGHT_WANTS_2026-11-04.md §1); the concrete ones are the house register
 * (F13's CAST_WANTS, the record's own role goals).
 */
import { describe, expect, it } from 'vitest';
import { CAST_WANTS, WANT_MAX_WORDS, isVoiceableWant, wantRegisterFault } from '../../src/domain/summary/tonightSheet.js';

// LANDING-R2 seat E: the three tables run as plain parameterless tests, each line labelled
// (the lighting census credits a table read inside the body, never an `each` callback).
describe('R11 · the voiceable shape rule', () => {
  it('the eight abstract registry goals are not voiceable: abstract-register', () => {
    for (const line of [
      'Convert governance instability into a restoration of prerogatives that formal governance had constrained.',
      'Build pastoral standing and institutional credibility through consistent service in a context where the dominant institution sets the standard.',
      'Use current stability to address structural vulnerabilities before conditions change.',
      'Maintain traditional standing within the constraints that stable institutional competition creates.',
      "Advance the faction's institutional standing through the credibility that comes from competent administration of current responsibilities.",
      'Restore enough perceived legitimacy to make the governing role functional, or identify an exit before the gap between title and authority becomes irreversible.',
      'Profit from the shortage through parallel distribution without triggering a response that uses the public interest as justification.',
      'Manage the supply situation in a way that preserves commercial relationships and reputation beyond this crisis.',
    ]) {
      expect(isVoiceableWant(line), `abstract: ${line}`).toBe(false);
      expect(wantRegisterFault(line[0].toLowerCase() + line.slice(1)), `abstract: ${line}`).toBe('abstract-register');
    }
  });

  it('the three sentences are not wants: sentence-not-a-want', () => {
    for (const line of [
      'Was approached before the betrayal and said no.',
      'The supplies they declared destroyed in a fire are in a cellar.',
      'Has been making personal side payments to the creditor\'s representative.',
    ]) {
      expect(wantRegisterFault(line), `a sentence, not a want: ${line}`).toBe('sentence-not-a-want');
      expect(isVoiceableWant(line), `a sentence, not a want: ${line}`).toBe(false);
    }
  });

  it('the four concrete wants are voiceable', () => {
    for (const line of [
      'Get the old toll right back before the council notices.',
      'Keep the chapel full while the hall empties.',
      'identify who among their junior clergy is accepting bribes from merchants.',
      'cover up a minor corruption scandal before the regional lord hears of it.',
    ]) {
      expect(isVoiceableWant(line), `voiceable: ${line}`).toBe(true);
    }
  });

  it('every CAST_WANTS line is voiceable (the register the rule is written to)', () => {
    for (const line of Object.values(CAST_WANTS).flat()) expect(isVoiceableWant(line), line).toBe(true);
  });

  it(`more than ${WANT_MAX_WORDS} words is not voiceable, however concrete`, () => {
    const long = 'get the miller and the smith and the carter and the cooper to the hall tonight before the bell rings twice';
    expect(long.split(' ').length).toBeGreaterThan(WANT_MAX_WORDS);
    expect(isVoiceableWant(long)).toBe(false);
  });
});

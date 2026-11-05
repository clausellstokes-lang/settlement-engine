/**
 * Lane R11, unit 4 (the chair's ruling 1, 2026-11-04): THE SHEET PREFERS THE CONCRETE. A person is
 * voiced with the most concrete of (a) the crisis cast's role want, (b) their own goal ONLY when it
 * passes the voiceable shape rule, (c) their secret, (d) their temperament — one choice
 * (`tonightSheet.js :: voicedLineOf`) read by the Tonight sheet and the Quick Guide.
 *
 * Seeds: the three settlements of the sixty whose sheet still printed an abstract want after the
 * registry rewrite (unit 3): soak1k-20 and -57 (a cleric's role goal "preserve the institution's
 * position through the transition…") and soak1k-26 (the seat's "end the revolt without either full
 * suppression or formal negotiation: both options set precedents…", 22 words).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { composeTonightSheet, isVoiceableWant, printsAsWant, voicedLineOf } from '../../src/domain/summary/tonightSheet.js';
import { composeSettlementQuickGuide } from '../../src/domain/summary/settlementQuickGuide.js';
import { crisisCastSenseFindings } from '../../src/domain/coherence/crisisFactFindings.js';

const SEEDS = [20, 26, 55, 57];
/** @type {Record<number, any>} */
const born = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of SEEDS) born[i] = birth(i).settlement;
}, 300_000);

describe('R11 · the Tonight sheet prefers the concrete', () => {
  it.each(SEEDS)('soak1k-%i: every line printed after "Wants to" is voiceable (an empty line prints nothing)', (i) => {
    const sheet = composeTonightSheet(born[i]);
    expect(sheet.people.length).toBeGreaterThan(0);
    for (const p of sheet.people) {
      if (printsAsWant(p) && !p.sameAs && p.line) expect(isVoiceableWant(p.line), `${p.name}: ${p.line}`).toBe(true);
    }
  });

  it('soak1k-26: the seat (the revolt\'s target) with an abstract goal, the crisis secret withheld and no temperament on the record is voiced with nothing, never the abstract goal', () => {
    const seat = composeTonightSheet(born[26]).people.find((p) => p.why === 'seat');
    expect(seat).toMatchObject({ name: 'Rhiannon Sullivan', says: 'want', line: '' });
  });

  it.each([26, 55])('soak1k-%i: a crisis target whose own line falls back never voices that crisis\'s secret (F13 target_runs_plot)', (i) => {
    expect(crisisCastSenseFindings(born[i]).filter((f) => f.detail.startsWith('target_runs_plot'))).toEqual([]);
  });

  it.each(SEEDS)('soak1k-%i: the Quick Guide reads the same choice', (i) => {
    for (const p of composeSettlementQuickGuide(born[i]).importantPeople) {
      const m = p.detail.match(/^Wants to (.*)$/);
      if (m) expect(isVoiceableWant(m[1]), `${p.name}: ${p.detail}`).toBe(true);
    }
  });
});

describe('R11 · voicedLineOf, the one choice', () => {
  const abstract = "Preserve the institution's position through the transition without abandoning the congregation";
  it('a voiceable goal is the want', () => {
    expect(voicedLineOf({ goal: { short: 'Get the old toll right back before the council notices' }, secret: { what: 'Owes the miller.' } }))
      .toEqual({ says: 'want', text: 'get the old toll right back before the council notices.' });
  });
  it('an abstract goal gives way to the secret', () => {
    expect(voicedLineOf({ goal: { short: abstract }, secret: { what: 'Owes the miller a year of rent.' }, personality: { dominant: 'Proud' } }))
      .toEqual({ says: 'secret', text: 'Owes the miller a year of rent.' });
  });
  it('then to the temperament', () => {
    expect(voicedLineOf({ goal: { short: abstract }, personality: { dominant: 'Proud and watchful' } }))
      .toEqual({ says: 'temperament', text: 'Proud and watchful' });
  });
  it('a withheld secret gives way to the temperament', () => {
    expect(voicedLineOf({ goal: { short: abstract }, secret: { what: 'Knows who ordered it.' }, personality: { dominant: 'Proud' } }, { withholdSecret: true }))
      .toEqual({ says: 'temperament', text: 'Proud' });
  });
  it('and to nothing, never to the abstract goal', () => {
    expect(voicedLineOf({ goal: { short: abstract } })).toEqual({ says: 'want', text: '' });
  });
  it('the Quick Guide words each kind its own way', () => {
    const guide = (npc) => composeSettlementQuickGuide({ name: 'Testholm', tier: 'village', population: 400, npcs: [{ name: 'Ada', role: 'Elder', power: 9, ...npc }] }).importantPeople[0].detail;
    expect(guide({ goal: { short: abstract }, secret: { what: 'Owes the miller a year of rent' } })).toBe('Secret: owes the miller a year of rent.');
    expect(guide({ goal: { short: abstract }, personality: { dominant: 'Proud and watchful' } })).toBe('Proud and watchful.');
    expect(guide({ goal: { short: 'Get the old toll right back' } })).toBe('Wants to get the old toll right back.');
    expect(guide({ goal: { short: abstract } })).toBe('No immediate agenda is recorded.');
  });
});

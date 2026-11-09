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
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SEEDS = [20, 26, 55, 57];
// RE-KEYED BY IDENTITY (MERGE-CAR-2, 2026-11-08): the people car re-deals the seat card, so soak1k-26's seat is
// Morrigan MacDonald at the composed tip, with a voiceable goal ("get the seat obeyed again …") — the empty-seat
// case no longer arises there. The case pinned — the seat is the crisis's TARGET, its goal abstract, its own
// crisis secret withheld, no temperament: voiced with nothing — measured over soak1k-0..2499 at the tip: 13 empty
// seat lines, two of them exactly this case (soak1k-868, insurgency; -1968); the first is pinned. Was soak1k-26,
// Rhiannon Sullivan (the revolt's target).
const EMPTY_SEAT_SEED = 868;
/** @type {Record<number, any>} */
const born = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of [...SEEDS, EMPTY_SEAT_SEED]) born[i] = birth(i).settlement;
}, 300_000);

describe('R11 · the Tonight sheet prefers the concrete', () => {
  // LANDING-R2 seat E: the three seed tables run as plain parameterless tests, every seed collected.
  it('soak1k-20, -26, -55, -57: every line printed after "Wants to" is voiceable (an empty line prints nothing)', () => {
    const failures = collectSeedFailures(SEEDS, (i) => {
      const sheet = composeTonightSheet(born[i]);
      expect(sheet.people.length, `soak1k-${i}`).toBeGreaterThan(0);
      for (const p of sheet.people) {
        if (printsAsWant(p) && !p.sameAs && p.line) expect(isVoiceableWant(p.line), `soak1k-${i} ${p.name}: ${p.line}`).toBe(true);
      }
    });
    expectNoSeedFailures(failures, 'every printed want is voiceable');
  });

  it('soak1k-868: the seat (the insurgency\'s target) with an abstract goal, the crisis secret withheld and no temperament on the record is voiced with nothing, never the abstract goal', () => {
    const seat = composeTonightSheet(born[EMPTY_SEAT_SEED]).people.find((p) => p.why === 'seat');
    // RE-KEYED 2026-11-09 (STYLE-2 SW-7, fb712a8d7 — no secret frame twice in one dossier): the frame-keyed refusal
    // leaves one CRIME_KNOWLEDGE draw unrolled earlier in this roster, so the seat now holds a concrete secret of its own
    // and the sheet voices THAT (the concrete first). Was { says: 'want', line: '' }. The law of this arm holds: the
    // abstract goal is never what the seat says. The "voiced with nothing" branch lost its natural witness on this
    // seed; it is named in the SW-7 record's "What stays" for a planted one.
    expect(seat).toMatchObject({ name: 'Slavica Smirnov', says: 'secret', line: "Runs a protection scheme targeting the very merchants they're supposed to serve." });
    const card = born[EMPTY_SEAT_SEED].npcs.find((n) => n.name === 'Slavica Smirnov');
    expect(seat.line).not.toBe(String(card?.goal?.short ?? '').trim());
  });

  it('soak1k-26 and -55: a crisis target whose own line falls back never voices that crisis\'s secret (F13 target_runs_plot)', () => {
    const failures = collectSeedFailures([26, 55], (i) => {
      expect(crisisCastSenseFindings(born[i]).filter((f) => f.detail.startsWith('target_runs_plot')), `soak1k-${i}`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'no fallen-back crisis target voices the crisis secret');
  });

  it('soak1k-20, -26, -55, -57: the Quick Guide reads the same choice', () => {
    const failures = collectSeedFailures(SEEDS, (i) => {
      for (const p of composeSettlementQuickGuide(born[i]).importantPeople) {
        const m = p.detail.match(/^Wants to (.*)$/);
        if (m) expect(isVoiceableWant(m[1]), `soak1k-${i} ${p.name}: ${p.detail}`).toBe(true);
      }
    });
    expectNoSeedFailures(failures, 'the Quick Guide voices only voiceable wants');
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

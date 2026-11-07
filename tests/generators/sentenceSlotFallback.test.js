/**
 * tests/generators/sentenceSlotFallback.test.js — F11 unit 1, LOWERCASE-SOMEONE
 * (docs/SOAK_10000_RUNG2_2026-11-04.md §2, the 12 certification failures).
 *
 * npcGenerator.js :: generateCrimeLevel fills a stress secret's `{npc}` slot with the other NPC's
 * name, or 'someone' when the roster holds one NPC. The stakes templates in
 * src/data/stressInstitutionEffects.js open sentences on `{npc}`, so a one-person thorp printed
 * "…attend. someone has not yet understood…" and the receipt's narrative_quality check failed
 * the settlement. A fallback that opens a sentence is now sentence-cased at the fill
 * (narrativeProse.js :: fillSentenceSlots); a held name is unchanged.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { fillSentenceSlots, opensSentence } from '../../src/generators/narrativeProse.js';
import { genSuccessionNarr } from '../../src/generators/power/settlementNarrative.js';

/** @param {any} s */
const narrativeQuality = (s) => (s.generationCoherenceReceipt?.checks || []).find((/** @type {any} */ c) => c?.id === 'narrative_quality');

describe('fillSentenceSlots', () => {
  it('sentence-cases a fallback only where its slot opens a sentence', () => {
    const t = '{npc} saw them. {npc} has not understood what {npc} saw';
    expect(fillSentenceSlots(t, {}, { npc: 'someone' })).toBe('Someone saw them. Someone has not understood what someone saw');
    expect(fillSentenceSlots(t, { npc: 'Ada Lark' }, { npc: 'someone' })).toBe('Ada Lark saw them. Ada Lark has not understood what Ada Lark saw');
    expect(fillSentenceSlots('Ask {npc}! {npc}? {who}', {}, { npc: 'someone' })).toBe('Ask someone! Someone? {who}');
  });
  it('capitalises a lower-case held phrase that opens a sentence (the tier wording for an absent governing faction)', () => {
    expect(fillSentenceSlots('{faction} suspects it. The night is close. {faction} still believes', { faction: 'the village elders' }))
      .toBe('The village elders suspects it. The night is close. The village elders still believes');
    expect(fillSentenceSlots('They told {faction}.', { faction: 'the council' })).toBe('They told the council.');
  });
  it('reads a sentence start as the string start or a terminal mark and space', () => {
    expect(opensSentence('x', 0)).toBe(true);
    expect(opensSentence('Done. x', 6)).toBe(true);
    expect(opensSentence('with x', 5)).toBe(false);
  });
});

describe('the audited generation-time fallbacks (unit 1b)', () => {
  it('power/settlementNarrative.js :: genSuccessionNarr opens the surplus sentence on a capital when no faction is named', () => {
    const lines = genSuccessionNarr({ name: 'Ashby', prosperity: 'Wealthy', viabilityIssues: [] });
    expect(lines).toContain('Ashby is prosperous enough that the real conflicts are about who controls the surplus. The dominant faction has the most and wants more.');
  });
});

describe('the one-NPC thorps of rung 2', () => {
  beforeAll(async () => { await ensureLaws(); });
  // CENSUS-4b (the chair's answer 3, re-keyed by cause, not re-recorded): in a one-NPC thorp the
  // `{npc}` secret (it declares `other npc`) is REFUSED by its declaration, and the slot prints what
  // the gate resolves to — the recently-betrayed pool's admitted line by hash argmax — never a
  // "Someone" fallback.
  // The admitted line re-keyed by cause: "They were the betrayer, …" -> "Has the actual evidence of who committed
  // the betrayal, …" at 24ca3ee49 (census-1i unit 5, R-AT's wider audit: the ten keyless or constant-key
  // drawDeclared callers keyed on the settlement, so the argmax's tie-break reads this settlement's identity).
  // Measured: the old line at 24ca3ee49^ (60101f360), the new at 24ca3ee49 and at the tip; narrative_quality
  // passes at both.
  it('soak1k-1248: the {npc} secret is refused; the slot prints the gate\'s resolution and narrative_quality passes', () => {
    const s = birth(1248).settlement;
    expect(s.npcs).toHaveLength(1);
    expect(s.npcs[0].secret).toEqual({
      what: 'Has the actual evidence of who committed the betrayal. They found it accidentally and immediately hid it',
      stakes: 'The evidence also implicates Feudal Stewardship, which means the fallout would be much larger than anyone currently expects',
    });
    expect(JSON.stringify(s.npcs[0].secret)).not.toMatch(/\bSomeone\b/);
    expect(narrativeQuality(s)?.findings).toEqual([]);
  });
  it('the other eleven seeds clear narrative_quality', () => {
    const failing = [1896, 4428, 6024, 6552, 7944, 1218, 2742, 3054, 3366, 7422, 8334]
      .filter((i) => (narrativeQuality(birth(i).settlement)?.findings || []).length > 0)
      .map((i) => `soak1k-${i}`);
    expect(failing).toEqual([]);
  });
});

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

/** @param {any} s */
const narrativeQuality = (s) => (s.generationCoherenceReceipt?.checks || []).find((/** @type {any} */ c) => c?.id === 'narrative_quality');

describe('fillSentenceSlots', () => {
  it('sentence-cases a fallback only where its slot opens a sentence', () => {
    const t = '{npc} saw them. {npc} has not understood what {npc} saw';
    expect(fillSentenceSlots(t, {}, { npc: 'someone' })).toBe('Someone saw them. Someone has not understood what someone saw');
    expect(fillSentenceSlots(t, { npc: 'Ada Lark' }, { npc: 'someone' })).toBe('Ada Lark saw them. Ada Lark has not understood what Ada Lark saw');
    expect(fillSentenceSlots('Ask {npc}! {npc}? {who}', {}, { npc: 'someone' })).toBe('Ask someone! Someone? {who}');
  });
  it('reads a sentence start as the string start or a terminal mark and space', () => {
    expect(opensSentence('x', 0)).toBe(true);
    expect(opensSentence('Done. x', 6)).toBe(true);
    expect(opensSentence('with x', 5)).toBe(false);
  });
});

describe('the one-NPC thorps of rung 2', () => {
  beforeAll(async () => { await ensureLaws(); });
  it('soak1k-1248: the secret opens on "Someone" and narrative_quality passes', () => {
    const s = birth(1248).settlement;
    expect(s.npcs).toHaveLength(1);
    expect(s.npcs[0].secret.stakes).toBe('Someone saw them at a meeting they claimed not to attend. Someone has not yet understood what they saw');
    expect(narrativeQuality(s)?.findings).toEqual([]);
  });
  it('the other eleven seeds clear narrative_quality', () => {
    const failing = [1896, 4428, 6024, 6552, 7944, 1218, 2742, 3054, 3366, 7422, 8334]
      .filter((i) => (narrativeQuality(birth(i).settlement)?.findings || []).length > 0)
      .map((i) => `soak1k-${i}`);
    expect(failing).toEqual([]);
  });
});

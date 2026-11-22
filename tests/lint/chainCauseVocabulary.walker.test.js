/**
 * chainCauseVocabulary.walker.test.js — ONE WORD FOR ONE CAUSE (FRAME-8 · F3; the chair's ruling 45 of 2026-11-20, 17:12
 * UTC, vetoable by the owner: "a walker holds the inline expressions in `EconomicsTab.jsx`, `SupplyChainsPanel.jsx` and the
 * two PDF sections to the reader's one vocabulary (the same word for the same chain); this lane touches none of those four
 * files; FOLDING THEM ONTO THE READER IS A JOIN UNIT").
 *
 * The Tonight sheet's Supply row reads a chain's cause through `src/domain/display/chainCauseShown.js :: chainCauseOf`
 * (the record's own `resourceCondition`, where it is one of `CHAIN_CAUSE_WORDS`). Four print surfaces still write the
 * cause INLINE beside the chain's source, each a ternary on the chain's ground flag (`resourceDepleted`, or a `depleted`
 * prop handed down from it) yielding " (<word>)". This walker reads each of the four, finds every such expression, and
 * fails where one is missing (the walker would be blind) or where its word is not in the reader's vocabulary. A house's
 * " (missing)" marker is a ternary on the house (`present`), not on the ground, and is not a cause.
 *
 * The reader itself is held here too: its vocabulary, and its answer for every value the chain model writes.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { CHAIN_CAUSE_WORDS, chainCauseOf } from '../../src/domain/display/chainCauseShown.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The four surfaces that write a chain's cause inline (the join folds them onto the reader). */
const INLINE_SITES = Object.freeze([
  'src/components/new/tabs/EconomicsTab.jsx',
  'src/components/new/SupplyChainsPanel.jsx',
  'src/pdf/sections/SupplyChainFlow.jsx',
  'src/pdf/sections/Services.jsx',
]);

/** A ternary on a chain's ground flag yielding a parenthesised word: `….resourceDepleted ? ' (depleted)' : ''`. */
const INLINE_CAUSE = /\b(?:resourceDepleted|depleted|resourceCondition)\b\s*\?\s*(['"`])\s\(([^)]*)\)\1/g;

/** @param {string} src @returns {string[]} every inline cause word of a source */
const inlineCauseWords = (src) => [...src.matchAll(INLINE_CAUSE)].map((m) => m[2]);

describe('the chain cause reader', () => {
  test('its vocabulary is the record\'s own word for a spent ground, frozen', () => {
    expect(Object.isFrozen(CHAIN_CAUSE_WORDS)).toBe(true);
    expect([...CHAIN_CAUSE_WORDS]).toEqual(['depleted']);
  });

  test('it returns the record\'s own value where that value is a cause, and nothing else', () => {
    expect(chainCauseOf({ resourceCondition: 'depleted' })).toBe('depleted');
    for (const condition of ['available', 'absent', '', 'Depleted', undefined, null, 3]) {
      expect(chainCauseOf({ resourceCondition: condition }), String(condition)).toBe(null);
    }
    for (const chain of [null, undefined, 'depleted', {}]) expect(chainCauseOf(chain), String(chain)).toBe(null);
  });
});

describe('the four inline sites speak the reader\'s one vocabulary', () => {
  test('the pattern is live: it sees a cause on the ground flag, and no house marker', () => {
    expect(inlineCauseWords("{chain.resourceDepleted ? ' (exhausted)' : ''}")).toEqual(['exhausted']);
    expect(inlineCauseWords("{label}{depleted ? ' (depleted)' : ''}")).toEqual(['depleted']);
    expect(inlineCauseWords("{inst.present ? '' : ' (missing)'}")).toEqual([]);
  });

  test.each(INLINE_SITES)('%s: every inline cause word is one of CHAIN_CAUSE_WORDS', (rel) => {
    const words = inlineCauseWords(readFileSync(join(ROOT, rel), 'utf8'));
    expect(words.length, `${rel}: the walker sees its inline cause`).toBeGreaterThan(0);
    for (const word of words) expect(CHAIN_CAUSE_WORDS, `${rel}: " (${word})"`).toContain(word);
  });
});

/**
 * tests/domain/facts/colourMark.test.js — CENSUS-1g unit 1 (R-AO): THE PER-LINE `colour` MARK.
 *
 * A mixed pool's read-but-presumes-nothing line is marked `colour` — the annex tag slot
 * (`[angle · colour]`, `[colour]` in a canonical slot) or a table row `{ text, colour: true }`.
 * The projector and the undeclared register count it as declared ("read; presumes nothing");
 * the draw, the kernel and the ledger read it as silence, so it moves no birth. `colour` beside
 * an atom is an error.
 *
 * @enforced-by npx vitest run tests/domain/facts/colourMark.test.js
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COLOUR_MARK, isColourLine, parseAtom, declarationOf, EMPTY_DECLARATION } from '../../../src/domain/facts/factVocabulary.js';
import { colourConflicts, statePoolCounts, undeclaredRows, variantColour, variantDeclares } from '../../../src/domain/facts/declarationRegisters.js';
import { drawDeclared } from '../../../src/domain/facts/drawDeclared.js';
import { eligibleVariants, variantFactDeclaration } from '../../../src/domain/display/stateProse/stateProseKernel.js';

const SRC = readFileSync(new URL('../../../scripts/lib/dossier-annex-parse.mjs', import.meta.url), 'utf8');

describe('the colour mark is no atom (the kernel and the draw read it as silence)', () => {
  it('is spelled `colour` and parses as no atom', () => {
    expect(COLOUR_MARK).toBe('colour');
    expect(parseAtom('colour')).toBeNull();
  });
  it('a state variant marked colour declares no fact atom and is admitted as a bare one is', () => {
    const marked = { angle: 'street', marks: ['colour'], text: 'a', slots: [], vid: 1 };
    const bare = { angle: 'street', text: 'b', slots: [], vid: 2 };
    expect(variantFactDeclaration(marked)).toBe(EMPTY_DECLARATION);
    expect(eligibleVariants([marked, bare], { facts: null })).toEqual([marked, bare]);
  });
  it('a table row `{ text, colour: true }` declares nothing and draws as its bare string does', () => {
    expect(declarationOf({ text: 'x', colour: true })).toBe(EMPTY_DECLARATION);
    const pool = Object.freeze([{ text: 'x', colour: true }, 'y', 'z']);
    for (let i = 0; i < 3; i++) {
      const r = drawDeclared(pool, { draw: (p) => p[i], facts: null });
      expect(r.resolvedBy).toBe('drawn');
      expect(r.text).toBe(['x', 'y', 'z'][i]);
    }
  });
});

describe('the register and the projector count it as declared', () => {
  it('a mixed pool\'s colour line leaves the undeclared register; a bare one stays', () => {
    const leaf = { B: { pools: { mixed: [{ marks: ['market'] }, { marks: ['colour'] }, { marks: [] }] }, poolMeta: {} } };
    const counts = statePoolCounts([leaf]);
    expect(counts['B::mixed']).toMatchObject({ lines: 3, declaring: 1, colourLines: 1, undeclared: 1 });
    expect(undeclaredRows(counts)).toEqual({ 'B::mixed': 1 });
    expect(variantColour({ marks: ['dm-only', 'colour'] })).toBe(true);
    expect(variantDeclares({ marks: ['colour'] })).toBe(false);
  });
  it('isColourLine reads a marked table row', () => {
    expect(isColourLine({ text: 'x', colour: true })).toBe(true);
    expect(isColourLine({ text: 'x' })).toBe(false);
    expect(isColourLine('x')).toBe(false);
  });
});

describe('a colour line declares nothing else', () => {
  it('colour beside an atom or a fact mark word conflicts; beside the audience mark or a state word it does not', () => {
    expect(colourConflicts(['colour', 'market'])).toEqual(['market']);
    expect(colourConflicts(['colour', 'no hunger'])).toEqual(['no hunger']);
    expect(colourConflicts(['colour', 'walls'])).toEqual(['walls']);
    expect(colourConflicts(['dm-only', 'colour', 'major'])).toEqual([]);
    expect(colourConflicts(['market'])).toEqual([]);
  });
  it('a table row marked colour that declares throws', () => {
    expect(() => isColourLine({ text: 'x', colour: true, needs: ['market'] })).toThrow(/declares nothing else/);
    expect(() => isColourLine({ text: 'x', colour: true, twinOf: 'y' })).toThrow(/declares nothing else/);
  });
  it('the projector refuses colour beside an atom in a numbered row and in a canonical slot', () => {
    expect(SRC).toMatch(/function assertStateMarks\(marks, where\) \{\n\s+assertColourAlone\(marks, where\);/);
    expect(SRC).toMatch(/assertColourAlone\(slot, /);
    expect(SRC).toMatch(/m === COLOUR_MARK/);
  });
});

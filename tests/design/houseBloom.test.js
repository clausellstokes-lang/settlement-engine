/**
 * houseBloom.test.js — THE SHARED GLOW TOKEN'S SIX ARMS.
 *
 * Design section 20.1 lifts the arrow's hover glow to ONE shared recipe home beside the
 * rail's gold, and both the arrow and (from EM-D0c) the editor read it. This file is the
 * proof that the lift MOVED the recipe and did not MULTIPLY it: the value is unchanged
 * character for character, and exactly one leaf under src/ still spells it.
 *
 * ⭐ THE OTHER HALF OF THE PROOF IS DELIBERATELY NOT HERE. The arrow's pixels are pinned
 * by tests/components/arrowHeader.test.jsx, which this change does not edit at all — a pin
 * that cannot be touched, asserting a value that must not move, is stronger evidence than
 * any pin this file could write for itself.
 *
 * ⛔ ARMS 3 AND 5 CARRY BARE NEGATIVES. Each such site carries its anchoring marker on its
 * OWN line, and each is preceded by a positive liveness assertion, so a slice that came
 * back empty or a value that came back blank cannot read as a pass.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { PARCH_100, houseBloom } from '../../src/components/theme.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = join(ROOT, 'src');

/** The recipe's opening literal, the thing a SECOND home would have to spell. */
const NEEDLE = 'radial-gradient(closest-side';

/** Every authored .js/.jsx leaf under src/, READ FROM THE TREE and never transcribed. */
function sourceLeaves(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) sourceLeaves(abs, found);
    else if (/\.jsx?$/.test(entry.name)) found.push(abs);
  }
  return found;
}

const rel = (abs) => relative(ROOT, abs).split(sep).join('/');

const LEAVES = sourceLeaves(SRC);
const DENOMINATOR = LEAVES.map(rel);
const HOMES = LEAVES.filter((abs) => readFileSync(abs, 'utf8').includes(NEEDLE)).map(rel).sort();

/** houseBloom's OWN source text, sliced from the file on disk — never from its value. */
const THEME_TEXT = readFileSync(join(SRC, 'components', 'theme.js'), 'utf8');
const RECIPE_AT = THEME_TEXT.indexOf('export function houseBloom');
const RECIPE_TEXT = THEME_TEXT.slice(RECIPE_AT, THEME_TEXT.indexOf('\n}', RECIPE_AT) + 2);

describe('houseBloom: the house bloom has one recipe home and the arrow reads it', () => {
  it('spells the arrow glow character for character, from the same interpolation', () => {
    expect(houseBloom(PARCH_100)).toBe(
      `radial-gradient(closest-side, color-mix(in srgb, ${PARCH_100} 34%, transparent), transparent)`,
    );
  });

  it('is the ONE home: exactly one leaf under src spells the radial recipe', () => {
    expect(HOMES).toEqual(['src/components/theme.js']);
  });

  it('mints no new hex and no translucent literal', () => {
    expect(RECIPE_TEXT).toContain('color-mix(in srgb');
    expect(RECIPE_TEXT).not.toMatch(/#[0-9a-fA-F]{3,8}\b/); // anchored: the line above proves RECIPE_TEXT is the real sliced recipe, so an empty slice cannot pass
    expect(RECIPE_TEXT).not.toContain('rgba('); // anchored: the same non-empty, color-mix-bearing slice is the subject here
  });

  it('reads its argument, so a body returning a constant is convicted', () => {
    expect(houseBloom('red')).not.toBe(houseBloom('blue'));
    expect(houseBloom('red')).toContain('red');
    expect(houseBloom('blue')).toContain('blue');
  });

  it('is LIGHT and never elevation: a background value, never a shadow', () => {
    const value = houseBloom(PARCH_100);
    expect(value).toContain('radial-gradient');
    expect(value).not.toMatch(/\d+px/); // anchored: the line above proves `value` is the real recipe output, so a blank string cannot pass
    expect(value).not.toContain('shadow'); // anchored: the same non-empty, radial-gradient-bearing value is the subject here
  });

  it('scanned a real tree: the denominator is non-empty and holds the arrow control', () => {
    expect(DENOMINATOR.length).toBeGreaterThan(0);
    expect(DENOMINATOR).toContain('src/components/nav/ArrowControl.jsx');
  });
});

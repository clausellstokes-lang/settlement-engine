/**
 * tests/lint/voicesLinesImporters.test.js — A SAID LINE NEVER PRINTS AS THE SURVEYOR'S (S-G1; the chair's ruling G1-2 (3),
 * the guard that pays for the voice scope of the presumption-classes walker).
 *
 * The voices' lines are quoted speech: they print only inside the one quote slot, signed. So the two data modules are
 * imported by the voices plan ALONE (`src/domain/voices/voicePlan.js`): no other file under `src/` names them, statically
 * or by a dynamic import, so no other composer can print a said line in the surveyor's voice. (Its twin, a render test that
 * every printed said text sits inside the slot with its signature, is `tests/components/voicesOnlyInTheSlot.test.jsx`.)
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const PLAN = 'src/domain/voices/voicePlan.js';

/** @param {string} dir @param {string[]} [out] @returns {string[]} */
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx|mjs|ts|tsx)$/.test(e)) out.push(p);
  }
  return out;
}
const NAMES = /voices\/(saidLines|liarLines)(\.js)?['"]/;

describe('the voices\' lines are read by the plan alone', () => {
  const files = walk(SRC).map((f) => relative(ROOT, f).replace(/\\/g, '/'));
  const naming = files.filter((f) => !f.startsWith('src/data/voices/') && NAMES.test(readFileSync(join(ROOT, f), 'utf8')));

  it('guard-the-guard: the walk read src/ and found the plan naming them', () => {
    expect(files.length).toBeGreaterThan(500);
    expect(naming).toContain(PLAN);
  });

  it('no file under src/ but the plan names the said or the liar lines', () => {
    expect(naming).toEqual([PLAN]);
  });
});

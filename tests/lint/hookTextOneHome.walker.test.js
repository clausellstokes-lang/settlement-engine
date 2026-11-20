/**
 * hookTextOneHome.walker.test.js — A HOOK'S TEXT HAS ONE HOME (BUILD-THEMES (i), DEPTH-3, 2026-11-20).
 *
 * THE CLASS: a second copy of an authored hook's text in another module. `src/domain/hookThemes.js` once keyed its
 * theme table by each `NPC_FACTION_LOYALTY` line's FULL TEXT, so every line shipped twice: once in
 * `src/data/npcData.js` (the worker and a lazy data chunk) and once in the eager engine-core chunk, at first paint,
 * where no surface needs the sentence (about 12,400 bytes minified, and each tranche added more). The theme now lives
 * beside its line (`npcData.js :: NPC_FACTION_LOYALTY_THEMES`, index-aligned) and first paint holds only a digest of
 * hashes. This walker removes the habitat: NO line's text, and no FOLD of it (`hookThemeKey`: lowercased,
 * whitespace-collapsed, edge punctuation stripped), occurs in more than one module under src/. Any module: a second
 * table, a lookup keyed by prose, a copied list.
 *
 * HOW IT READS A MODULE: the file's bytes with quote escapes undone (`\'` -> `'`), lowercased and
 * whitespace-collapsed, searched for each line's fold (the fold is a substring of the text so lowered, so one search
 * finds the text and the fold both). Its liveness: every line is found in npcData.js, its one home.
 */
import { describe, expect, test } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { NPC_FACTION_LOYALTY } from '../../src/data/npcData.js';
import { lineText } from '../../src/domain/facts/drawDeclared.js';
import { hookThemeKey } from '../../src/domain/hookThemes.js';

const ROOT = process.cwd();
const HOME = 'src/data/npcData.js';

/** @param {string} dir @param {string[]} out @returns {string[]} */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(m?js|jsx|ts|tsx|json)$/.test(name)) out.push(p);
  }
  return out;
}

const modules = walk(join(ROOT, 'src')).map((p) => ({
  file: relative(ROOT, p).split('\\').join('/'),
  body: readFileSync(p, 'utf8').replace(/\\(['"`])/g, '$1').toLowerCase().replace(/\s+/g, ' '),
}));
const lines = Object.values(NPC_FACTION_LOYALTY).flat().map(lineText);

describe('a hook line\'s text has one home under src/', () => {
  test('liveness: the walk reads the tree, and every line is found in its home', () => {
    expect(modules.length).toBeGreaterThan(1000);
    expect(modules.some((m) => m.file === HOME)).toBe(true);
    expect(lines.length).toBeGreaterThanOrEqual(270);
    const home = modules.find((m) => m.file === HOME)?.body || '';
    expect(lines.filter((t) => !home.includes(hookThemeKey(t))), 'line(s) not found in npcData.js').toEqual([]);
  });

  test('no NPC_FACTION_LOYALTY line\'s text or fold occurs in more than one module', () => {
    /** @type {Map<string, number>} */ const elsewhere = new Map();
    const twice = [];
    for (const t of lines) {
      const key = hookThemeKey(t);
      const homes = modules.filter((m) => m.body.includes(key)).map((m) => m.file);
      if (homes.length > 1) {
        twice.push(t);
        for (const f of homes) if (f !== HOME) elsewhere.set(f, (elsewhere.get(f) || 0) + 1);
      }
    }
    expect(
      [...elsewhere].map(([f, n]) => `${f}: ${n} line(s)`),
      `\n${twice.length} hook line(s) occur in a second module. A theme, a key or a table keyed by the line belongs`
      + ` beside the line in ${HOME} (index-aligned), or as a hash (src/domain/hookThemes.js :: THEME_DIGEST, by its door`
      + ` scripts/hook-theme-digest.mjs); never as a second copy of the text.\n`,
    ).toEqual([]);
  });
});

/**
 * tests/domain/summary/tonightSheetAudience.test.js — EVERY READER OF THE TONIGHT SHEET STATES ITS AUDIENCE (FRAME-5 ·
 * CF12, the chair's ruling of 2026-11-20, 11:25 UTC; FRAME-2 · B3's gate: `composeTonightSheet(settlement, { audience })`
 * draws the frame for the owner only, and a missing audience fails closed).
 *
 * A source walker over `src/` finds every production call of `composeTonightSheet` (code only: a comment or a string that
 * names it is not a call) and requires its second argument to say who reads the sheet (`audience`). At the base
 * (8991b83b2) two calls passed none: the Foundry crisis page's printed facts (foundry/journalPages.js) and the crisis
 * cast check (domain/coherence/crisisFactFindings.js). Modelled on U0's walker for `composeCrisisPage`
 * (tests/domain/crisis/crisisPageAudience.test.js).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { codeOnly } from '../../helpers/codeOnlySource.js';

/** The top-level arguments of a call, from the source after its opening parenthesis. @param {string} src @param {number} from */
function argsOf(src, from) {
  /** @type {string[]} */
  const args = [];
  let depth = 0; let start = from; let at = from;
  for (; at < src.length; at++) {
    const c = src[at];
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') { if (depth === 0) break; depth--; }
    else if (c === ',' && depth === 0) { args.push(src.slice(start, at)); start = at + 1; }
  }
  args.push(src.slice(start, at));
  return args.map((a) => a.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

describe('CF12: every production call of composeTonightSheet states its audience', () => {
  test('the walker finds every call, and each passes an explicit audience', () => {
    /** @type {Array<{ file: string, line: number, args: string[] }>} */
    const calls = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) { walk(p); continue; }
        if (!/\.(?:js|jsx|mjs)$/.test(name)) continue;
        const raw = readFileSync(p, 'utf8');
        if (!raw.includes('composeTonightSheet')) continue;
        const src = codeOnly(raw);
        for (const m of src.matchAll(/\bcomposeTonightSheet\s*\(/g)) {
          if (/function\s+$/.test(src.slice(Math.max(0, m.index - 12), m.index))) continue; // the definition itself
          calls.push({ file: p.replace(/\\/g, '/'), line: src.slice(0, m.index).split('\n').length, args: argsOf(src, m.index + m[0].length) });
        }
      }
    };
    walk('src');
    // non-vacuity: the sheet's own readers (the Table View, Session Mode, the PDF chapter, the journal's two pages, the
    // crisis page, the crisis cast check) are all found
    const files = new Set(calls.map((c) => c.file));
    for (const f of ['src/components/TableView.jsx', 'src/components/session/SessionMode.jsx', 'src/pdf/sections/TonightAtTheTable.jsx',
      'src/foundry/journalPages.js', 'src/domain/crisis/crisisPage.js', 'src/domain/coherence/crisisFactFindings.js']) {
      expect(files.has(f), `the walker finds ${f}`).toBe(true);
    }
    const bare = calls.filter((c) => c.args.length < 2 || !/\baudience\b/.test(c.args[1]))
      .map((c) => `${c.file}:${c.line} composeTonightSheet(${c.args.join(', ')})`);
    expect(bare, 'calls of composeTonightSheet that do not say who reads the sheet').toEqual([]);
  });
});

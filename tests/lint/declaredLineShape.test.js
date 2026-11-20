/**
 * FIX-HOOK-OBJECT (2026-11-09; `docs/chair/2026-11-09/FIX-HOOK-OBJECT-2026-11-09.md`): A DECLARED
 * LINE'S `text` IS A STRING OR A FUNCTION, AND THE ONE READER GIVES IT BACK EITHER WAY.
 *
 * The defect: soak1k-10 (Olympambelos) printed "[object Object]" as a Plot Hooks line, on the
 * screen, in the PDF and in the Foundry journal. `hookLines.js :: PROPERTY_LINES[0]` is the
 * declared form `{ text: (a, b, issue) => …, needs }` around a template, and
 * `drawDeclared.js :: lineText` unwrapped `.text` only when it was a string, so it handed back
 * the row and the caller stringified it. The class: a declared line whose `text` the reader does
 * not unwrap. Two arms hold it shut:
 *
 *  1. THE SHAPE: every declared line (a plain object with its own `text` and a declaration —
 *     `needs`, `excludes`, `crisis`, `twinOf` or `colour`) reachable from the exports of every
 *     `src` module that writes a declaration carries a `text` that is a string or a function and
 *     nothing else. The baseline of violations is ZERO and only shrinks.
 *  2. THE READER: `lineText` of a declared line gives back its `text` whether it is a string or
 *     a function, so a caller that branches on `typeof v === 'function'` reads the template.
 *
 * Scope, said plainly: the walk reaches the pools a module EXPORTS (directly or nested); a pool a
 * module keeps private is out of its reach, and the module list is the `git grep` of declaration
 * keys below, so a new declaring module is walked the day it lands.
 */
import { execSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { lineText } from '../../src/domain/facts/drawDeclared.js';

const DECLARATION_KEYS = Object.freeze(['needs', 'excludes', 'crisis', 'twinOf', 'colour']);

/** The violations the estate carries today, by `module :: path`. ZERO; it only shrinks. */
const BASELINE = Object.freeze([]);

/** @param {unknown} v @returns {boolean} a declared line: a plain object with its own `text` and a declaration */
export function isDeclaredLine(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const proto = Object.getPrototypeOf(v);
  if (proto !== Object.prototype && proto !== null) return false;
  return Object.prototype.hasOwnProperty.call(v, 'text') && DECLARATION_KEYS.some((k) => Object.prototype.hasOwnProperty.call(v, k));
}

/**
 * Every declared line reachable from `root`, with its path and whether its text is lawful.
 * @param {unknown} root @param {string} at
 * @returns {{ path: string, ok: boolean, type: string }[]}
 */
export function walkDeclared(root, at) {
  /** @type {{ path: string, ok: boolean, type: string }[]} */
  const out = [];
  const seen = new WeakSet();
  /** @param {unknown} v @param {string} path @param {number} depth */
  const visit = (v, path, depth) => {
    if (!v || typeof v !== 'object' || depth > 12) return;
    if (seen.has(v)) return;
    seen.add(v);
    if (isDeclaredLine(v)) {
      const t = /** @type {{ text: unknown }} */ (v).text;
      const type = t === null ? 'null' : Array.isArray(t) ? 'array' : typeof t;
      out.push({ path, ok: type === 'string' || type === 'function', type });
      return;
    }
    const proto = Object.getPrototypeOf(v);
    if (!Array.isArray(v) && proto !== Object.prototype && proto !== null) return; // a Map, a class instance: not a pool table
    for (const [k, child] of Object.entries(v)) visit(child, `${path}.${k}`, depth + 1);
  };
  visit(root, at, 0);
  return out;
}

const MODULES = execSync(
  "git grep -lE \"\\b(twinOf|needs|excludes|crisis|colour): *[\\[\\\"'tf]\" -- 'src/*.js' 'src/*.jsx'",
  { encoding: 'utf8' },
).trim().split('\n').filter(Boolean).sort();

describe('declared line shape (FIX-HOOK-OBJECT, 2026-11-09)', () => {
  it('the walker flags a planted bad shape and passes the two lawful ones (red-first, anti-vacuity)', () => {
    const planted = {
      POOL: [
        { text: 'a line', needs: ['market'] },
        { text: (/** @type {string} */ n) => `${n} line`, excludes: ['crisis: famine'] },
        { text: { text: 'nested' }, needs: ['market'] },
        { text: 42, crisis: ['any'] },
        { text: ['a', 'b'], twinOf: 'a line' },
      ],
    };
    const rows = walkDeclared(planted, 'planted');
    expect(rows.map((r) => [r.path, r.ok, r.type])).toEqual([
      ['planted.POOL.0', true, 'string'],
      ['planted.POOL.1', true, 'function'],
      ['planted.POOL.2', false, 'object'],
      ['planted.POOL.3', false, 'number'],
      ['planted.POOL.4', false, 'array'],
    ]);
  });

  it('every declared line the declaring modules export carries a string or function text (baseline zero, only shrinks)', async () => {
    expect(MODULES.length).toBeGreaterThan(40);
    /** @type {{ path: string, ok: boolean, type: string }[]} */
    const rows = [];
    for (const file of MODULES) {
      const mod = await import(/* @vite-ignore */ `../../${file}`);
      rows.push(...walkDeclared(mod, file));
    }
    // The walk reaches the pools the census declared, the hook pool among them (anti-vacuity).
    expect(rows.length).toBeGreaterThan(500);
    expect(rows.some((r) => r.path.startsWith('src/domain/dossier/hookLines.js.HOOK_LINE_POOLS.conflict.property.0') && r.type === 'function')).toBe(true);
    const bad = rows.filter((r) => !r.ok).map((r) => `${r.path} :: ${r.type}`).sort();
    expect(bad.filter((b) => !BASELINE.includes(b))).toEqual([]);
    expect(BASELINE.filter((b) => !bad.includes(b))).toEqual([]); // a cured row leaves the baseline the same commit
  }, 120_000);

  it('lineText gives back a declared line\'s text whether it is a string or a function', () => {
    const template = (/** @type {string} */ a) => `${a} has posted guards.`;
    expect(lineText({ text: template, needs: ['guardPresence'] })).toBe(template);
    expect(lineText({ text: 'a line', needs: ['market'] })).toBe('a line');
    expect(lineText(template)).toBe(template);
    expect(lineText('a line')).toBe('a line');
    expect(lineText(null)).toBe(null);
  });
});

/**
 * tests/build/fixDuplicateKeysOverlap.test.js — `npm run fix:data` splice safety.
 *
 * The bug this pins: processFile collected removal byte-ranges from a nested
 * AST walk and spliced them with absolute ORIGINAL-source offsets against a
 * mutating output string. Two overlap shapes corrupted surviving source:
 *
 *   1. Containment — a removed duplicate property whose value object itself
 *      contains duplicate keys yields a removal range nested inside another
 *      removal range (verified pre-fix: the surviving key `outer` was
 *      rewritten to `ter`).
 *   2. Identical ranges — one property flagged by BOTH the exact-duplicate
 *      pass and the casing-collision pass gets spliced twice.
 *
 * The fix collapses identical ranges and drops ranges contained within
 * another surviving range before splicing. These tests run the REAL
 * processFile against fixture files and assert the output still parses and
 * evaluates to the later-wins object the engine was already using.
 */
import { describe, it, expect, afterAll } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'acorn';
import { processFile } from '../../scripts/fix-duplicate-keys.js';

const dir = mkdtempSync(join(tmpdir(), 'fix-dup-keys-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

let n = 0;
async function fixAndLoad(source) {
  const file = join(dir, `fixture${n++}.js`);
  writeFileSync(file, source, 'utf8');
  const res = processFile(file, false);
  expect(res.parseError).toBeUndefined();
  const out = readFileSync(file, 'utf8');
  // The rewritten file must still be valid JS…
  expect(() => parse(out, { ecmaVersion: 'latest', sourceType: 'module' })).not.toThrow();
  // …and must load. Import the actual written file so we test real semantics.
  const mod = await import(pathToFileURL(file).href);
  return { res, out, data: mod.data };
}

describe('fix-duplicate-keys overlapping-removal safety', () => {
  it('does not corrupt source when a removed duplicate property itself contains duplicates', async () => {
    const { res, out, data } = await fixAndLoad(
      [
        'export const data = {',
        '  outer: {',
        '    inner: 1,',
        '    inner: 2,',
        '  },',
        '  outer: {',
        '    keep: true,',
        '  },',
        '};',
        '',
      ].join('\n'),
    );
    // The nested `inner` removal is subsumed by the containing `outer`
    // removal — exactly ONE splice, and the surviving key is intact:
    // pre-fix the overlapping splices mangled it (the key token vanished
    // and the output no longer parsed). Whitespace is deliberately NOT
    // pinned — the splicer's indentation handling is not under test here.
    expect(res.removed).toBe(1);
    expect(out.match(/\bouter\b/g)).toHaveLength(1);
    expect(data).toEqual({ outer: { keep: true } });
  });

  it('does not double-splice a property flagged by both the exact and casing passes', async () => {
    const { res, data } = await fixAndLoad(
      [
        'export const data = {',
        '  Foo: 1,',
        '  foo: 2,',
        '  foo: 3,',
        '};',
        '',
      ].join('\n'),
    );
    // `foo: 2` is flagged twice (casing collision with `Foo`, then exact
    // duplicate of `foo: 3`); pre-fix the identical range spliced twice and
    // ate surviving bytes. Post-fix: two distinct splices, first-cased key
    // survives per the script's documented casing policy.
    expect(res.removed).toBe(2);
    expect(data).toEqual({ Foo: 1 });
  });

  it('still removes a plain earlier duplicate (regression guard)', async () => {
    const { res, data } = await fixAndLoad(
      [
        'export const data = {',
        '  a: 1,',
        '  a: 2,',
        '  b: 3,',
        '};',
        '',
      ].join('\n'),
    );
    expect(res.removed).toBe(1);
    expect(res.dropped).toHaveLength(1);
    expect(res.dropped[0]).toMatchObject({ key: 'a', kind: 'exact' });
    expect(data).toEqual({ a: 2, b: 3 });
  });
});

/**
 * swatchResolves.test.js — A+ design-a11y safety net for the exact-value
 * `swatch` escape hatch (src/design/tokens.js).
 *
 * `swatch` is the sanctioned, zero-visual-change way to satisfy no-raw-color /
 * no-forked-color-const: a raw hex `color: '#c49a3c'` becomes `swatch['#C49A3C']`
 * (or a named key like swatch.mutedBrown). It is now referenced across the
 * dossier, the decomposed panels, and the event composer. The failure mode is
 * SILENT and gate-invisible: a typo'd or missing key resolves to `undefined`,
 * React drops the style prop, and the color just disappears with NO build/test
 * error. This pin closes that gap: every `swatch[...]` / `swatch.key` reference
 * in src/** must resolve to a defined swatch entry, or the gate goes red.
 *
 * It also makes the deferred forked-color burndown codemod safe — any swatch
 * reference it introduces with a bad key fails here immediately.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, it, expect } from 'vitest';
import { swatch } from '../../src/design/tokens.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|tsx?)$/.test(e)) out.push(p);
  }
  return out;
}

// swatch['#hex'] / swatch["#hex"] — the bracket form (keys are hex strings)
const BRACKET = /\bswatch\[\s*['"]([^'"]+)['"]\s*\]/g;
// swatch.foo — the named-key form (e.g. swatch.mutedBrown). Excludes the freeze
// definition usages (Object.freeze etc. are not member access on the export).
const DOT = /\bswatch\.([A-Za-z_$][\w$]*)/g;

// The definition file legitimately holds the literal hexes; don't scan it.
const DEFINITION = join(SRC, 'design', 'tokens.js');

describe('swatch references all resolve (A+ exact-value escape-hatch safety)', () => {
  const files = walk(SRC).filter((f) => f !== DEFINITION);
  const unresolved = [];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    for (const re of [BRACKET, DOT]) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(src))) {
        const key = m[1];
        // Skip obvious non-key dot access (methods on the frozen object would be
        // a bug anyway; swatch has no methods, so any dot key must be a swatch key).
        if (!(key in swatch)) {
          unresolved.push(`${relative(ROOT, f)}: swatch reference "${key}" is not a defined swatch key`);
        }
      }
    }
  }

  it('every swatch[...] / swatch.key reference in src resolves to a defined entry', () => {
    expect(unresolved, `\nUnresolved swatch references (would render as undefined → invisible color):\n${unresolved.join('\n')}\n`).toEqual([]);
  });

  it('scans a non-trivial number of swatch references (the scan is wired, not matching nothing)', () => {
    let count = 0;
    for (const f of walk(SRC).filter((x) => x !== DEFINITION)) {
      const src = readFileSync(f, 'utf8');
      BRACKET.lastIndex = 0; DOT.lastIndex = 0;
      count += (src.match(BRACKET) || []).length + (src.match(DOT) || []).length;
    }
    expect(count).toBeGreaterThanOrEqual(5);
  });
});

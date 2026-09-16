/**
 * significanceVocabulary.test.js — the wizard-news significance vocabulary guard
 * (content-immersion-r2-6).
 *
 * SP-6a defines exactly three real tiers: MAJOR ('major'), NOTABLE ('notable'), and
 * ROUTINE ('routine'). Wizard News preserves all three and ranks them 2/1/0; the
 * rumor seed gate remains a separate salience decision. A 'minor' or 'moderate'
 * literal is DEAD vocabulary: it is not a member of the pacing governor's family.
 * This walker keeps those aliases from creeping back — it source-scans every
 * `significance:` mint literal in src/domain and asserts membership in SP-6a.
 *
 * Ternary / `|| default` forms are covered (both branches are scanned); mints that use
 * the WIZARD_NEWS_SIGNIFICANCE.* constants carry no string literal and are simply skipped.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DOMAIN = join(ROOT, 'src', 'domain');
const ALLOWED = new Set(['major', 'notable', 'routine']);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(e) && !/\.test\./.test(e)) out.push(p);
  }
  return out;
}

// The value expression of a `significance:` object property = from the colon to the
// first top-level comma or newline (significance values never contain a comma). Any
// lowercase string literal inside it is a significance tier.
const SIG_VALUE_RE = /significance:\s*([^,\n]+)/g;
const LITERAL_RE = /['"]([a-z_]+)['"]/g;

describe('wizard-news significance vocabulary (content-immersion-r2-6)', () => {
  test('every minted significance literal is an SP-6a tier (routine | notable | major)', () => {
    const offenders = [];
    for (const abs of walk(DOMAIN)) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      const src = readFileSync(abs, 'utf8');
      for (const m of src.matchAll(SIG_VALUE_RE)) {
        for (const lit of m[1].matchAll(LITERAL_RE)) {
          if (!ALLOWED.has(lit[1])) offenders.push(`${rel}: significance '${lit[1]}' — only 'routine'/'notable'/'major' are SP-6a tiers`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  test('the scan is non-vacuous (it actually sees significance mints)', () => {
    let count = 0;
    for (const abs of walk(DOMAIN)) {
      for (const m of readFileSync(abs, 'utf8').matchAll(SIG_VALUE_RE)) {
        if ([...m[1].matchAll(LITERAL_RE)].length) count += 1;
      }
    }
    expect(count).toBeGreaterThan(5);
  });
});

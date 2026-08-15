/**
 * slugifyIdiomBaseline.test.js — code-quality-5 source-scan ratchet.
 *
 * There is now ONE slugify primitive: src/kernel/slugify.js. The review named 8
 * slugify VARIANTS (the exported/named functions), several identity-bearing; all 8
 * are migrated to the kernel primitive and parity-proven byte-identical
 * (tests/kernel/slugify.parity.test.js). But the slug IDIOM — collapse runs of
 * non-alphanumerics to a single [-_] separator, then edge-trim — is hand-inlined
 * in ~37 MORE places the review did not enumerate, several of them ALSO
 * identity-bearing (`institution.<slug>` in six generator steps, faction/npc/PDF
 * slugs). This ratchet freezes that class shrink-only and blocks any NEW inline
 * slug builder: new code must import the kernel primitive.
 *
 * Honest + monotone, like the forked-color / clamp ratchets:
 *   - the baseline must EXACTLY equal the files that still inline a slug builder
 *     (a NEW one fails; a migrated one must be removed from the baseline);
 *   - it can never grow past its committed ceiling.
 * Migrating an inlined site to the kernel primitive → delete its entry + lower the
 * ceiling. Migrate only with a per-site parity proof: many inline copies use
 * `[^a-zA-Z0-9]+ … .toLowerCase()` (strip-then-lower) which diverges from the
 * kernel's lower-then-strip on exotic Unicode, so they are NOT blindly equivalent.
 *
 * CANNOT-CATCH (documented evasion gaps): the scan matches the specific idiom
 * `[^a-z(A-Z)?0-9]+/g(i), '<-|_>'`. It does NOT catch a slug built with a different
 * character class (`[^\w]`, reordered ranges), a different separator, or a helper
 * that strips to '' then re-joins. Those residuals are covered by code review, not
 * this guard.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const KERNEL_HOME = 'src/kernel/slugify.js'; // the sanctioned home — exempt
const BASELINE_CEILING = 36; // committed max — lower it as copies migrate; never raise it

// The slug BUILDER idiom: collapse non-alphanumerics to a single [-_] separator.
// Deliberately excludes strip-to-'' normalization (`[^a-z0-9]/g, ''`), which is
// not a slug.
const SLUG_RE = /\[\^a-z(?:A-Z)?0-9\]\+\/gi?\s*,\s*['"`][-_]['"`]/;

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?)$/.test(e)) out.push(p);
  }
  return out;
}

const currentIdiomFiles = walk(join(ROOT, 'src'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .filter((rel) => rel !== KERNEL_HOME)
  .filter((rel) => SLUG_RE.test(stripComments(readFileSync(join(ROOT, rel), 'utf8'))))
  .sort();

const baseline = JSON.parse(
  readFileSync(join(ROOT, 'scripts/.slugify-idiom-baseline.json'), 'utf8'),
).sort();

describe('slugify idiom baseline ratchet (code-quality-5)', () => {
  test('baseline exactly matches the files that still inline a slug builder', () => {
    expect(baseline).toEqual(currentIdiomFiles);
  });

  test('baseline never grows past its committed ceiling', () => {
    expect(baseline.length).toBeLessThanOrEqual(BASELINE_CEILING);
  });
});

/**
 * pdfEntropyGuard.test.js — Cycle-3 Wave 6 determinism guard (M21).
 *
 * The paid PDF export is a same-seed deliverable: the SAME viewmodel must render the
 * SAME document every time (react-pdf bytes are non-deterministic, but every VALUE the
 * tree carries — field names, ids, labels — must be a pure function of the viewmodel).
 * M21 was the counter-example: Editable.safeName fell back to `f_${Math.random()...}`
 * for a falsy field name, so a form field's id churned on every render.
 *
 * This is the SECOND layer of the two-layer determinism model (mirrors
 * localeCompareGuard): eslint.config.js bans the entropy class in src/pdf, and this
 * source scan backs the ban up so a regression reds even if lint is skipped, AND pins
 * the eslint block itself so the two never drift apart.
 *
 * SCOPE — RANDOMNESS/ENTROPY only. Math.random + crypto.randomUUID/getRandomValues are
 * banned (no legitimate site — a same-seed document may never contain a random draw).
 * WALL-CLOCK (Date.now / new Date) is NOT scanned here: the generation-date stamp
 * (Cover) and user event timestamps (Timeline) are the ledgered src/pdf boundary reads
 * (TEMPORAL_AUDIT.md §1, enforced by determinismBanCoverage.test.js's pdf layer). The
 * allowlist is BORN EMPTY — M21 was cured (deterministic FNV-1a fallback), not waived.
 *
 * NOTE — src/pdf/lib is INCLUDED in this scan. It is a recorded blind spot of BOTH
 * proseLeak voice tiers; the entropy sweep covers the whole src/pdf subtree so a random
 * draw there is caught even though the voice gates do not reach it.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PDF_ROOT = join(ROOT, 'src', 'pdf');

// The randomness/entropy call class (NOT wall-clock — see the header scope note).
const ENTROPY_RES = [
  { name: 'Math.random()', re: /\bMath\s*\.\s*random\s*\(/ },
  { name: 'crypto.randomUUID()', re: /\.\s*randomUUID\s*\(/ },
  { name: 'crypto.getRandomValues()', re: /\.\s*getRandomValues\s*\(/ },
];

// Born-empty allowlist. A proven-legitimate entropy site would be added here as a
// `"<relpath>: <token>"` entry WITH a recorded decision — but the same-seed PDF
// contract means there should never be one. Kept explicit so any future waiver is
// a deliberate, reviewed act rather than a silent scan-skip.
const ALLOW = new Set([]);

function walkJs(dir, acc) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkJs(full, acc);
    else if (name.endsWith('.js') || name.endsWith('.jsx')) acc.push(full);
  }
  return acc;
}

describe('pdf entropy guard (M21 — same-seed PDF determinism)', () => {
  const files = walkJs(PDF_ROOT, []);

  test('the scan is non-vacuous (walks the whole src/pdf subtree incl. lib/)', () => {
    const rels = files.map((f) => relative(ROOT, f));
    expect(files.length).toBeGreaterThan(20);
    // lib/ is the recorded voice blind spot — assert it is in the swept set.
    expect(rels.some((r) => r.startsWith('src/pdf/lib/'))).toBe(true);
  });

  test('src/pdf contains ZERO randomness/entropy calls (Math.random / crypto.random*)', () => {
    const offenders = [];
    for (const file of files) {
      const rel = relative(ROOT, file);
      const src = readFileSync(file, 'utf8');
      for (const { name, re } of ENTROPY_RES) {
        if (re.test(src) && !ALLOW.has(`${rel}: ${name}`)) offenders.push(`${rel}: ${name}`);
      }
    }
    expect(
      offenders,
      `entropy draw(s) in the same-seed PDF export — replace with a deterministic ` +
        `FNV-1a hash of the stable inputs the call site has (see Editable.safeName):\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });

  test('the entropy allowlist is born empty (M21 was cured, not waived)', () => {
    expect([...ALLOW]).toEqual([]);
  });

  test('guard-the-guard: the entropy detectors actually fire', () => {
    // A silently-broken regex must red HERE, not pass on a real leak.
    expect(ENTROPY_RES[0].re.test('const x = Math.random();')).toBe(true);
    expect(ENTROPY_RES[0].re.test('const x = Math . random ( )')).toBe(true);
    expect(ENTROPY_RES[1].re.test('crypto.randomUUID()')).toBe(true);
    expect(ENTROPY_RES[2].re.test('globalThis.crypto.getRandomValues(buf)')).toBe(true);
    // The cured deterministic fallback (fnv1a32 + Math.imul) must NOT trip.
    expect(ENTROPY_RES.some(({ re }) => re.test('h = Math.imul(h, 0x01000193);'))).toBe(false);
    expect(ENTROPY_RES.some(({ re }) => re.test('return `fld_${fnv1a32(seed).toString(36)}`;'))).toBe(false);
  });

  test('eslint.config.js wires the src/pdf entropy + collation ban (no drift)', () => {
    const cfg = readFileSync(join(ROOT, 'eslint.config.js'), 'utf8');
    // The single src/pdf determinism block carries all four selectors.
    expect(cfg).toContain("files: ['src/pdf/**/*.{js,jsx}']");
    expect(cfg).toContain("selector: \"CallExpression[callee.object.name='Math'][callee.property.name='random']\"");
    expect(cfg).toContain("selector: \"CallExpression[callee.property.name='randomUUID']\"");
    expect(cfg).toContain("selector: \"CallExpression[callee.property.name='getRandomValues']\"");
    // Collation stays banned in the same block.
    expect(cfg).toContain("selector: \"CallExpression[callee.property.name='localeCompare']\"");
    // WALL-CLOCK must NOT be banned in the pdf block (ledgered allowance). The pdf
    // block is the last `files: ['src/pdf/**/*.{js,jsx}']` no-restricted-syntax block;
    // assert no new-Date ban selector appears anywhere in the config's pdf context by
    // confirming the ledger comment is present (kept in lockstep with the block).
    expect(cfg).toContain('WALL-CLOCK IS INTENTIONALLY NOT BANNED');
  });
});

/**
 * tests/data/spatialDataTokenIntegrity.test.js
 *
 * The 'SEVERITY' → 'it' template-token fix was missed in spatialData.js: a
 * garbled user-facing string shipped for the landlocked-navy access violation
 * ("This settlement is landlocked — SEVERITY can have river patrols but not a
 * navy."). This guards the corrected copy AND scans every data/generator source
 * so no bare 'SEVERITY' token leaks back into a user-facing string literal.
 *
 * Note: economicGenerator/helpers legitimately import and use the SEVERITY enum
 * (SEVERITY.CRITICAL …) as a BARE identifier — never inside a quoted string — so
 * the scan only flags quoted occurrences.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { describe, it, expect } from 'vitest';

import { GATE_FEATURES } from '../../src/data/spatialData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ── 1. The specific corrected string ──────────────────────────────────────────

describe('landlocked-navy access violation copy', () => {
  const reason = GATE_FEATURES['Navy (if coastal)'].accessViolationReason;

  it('reads cleanly, with no leaked SEVERITY token', () => {
    expect(reason).toBe(
      'A navy requires coastal or ocean access. This settlement is landlocked — it can have river patrols but not a navy.',
    );
    expect(reason).not.toContain('SEVERITY');
  });
});

// ── 2. No bare quoted SEVERITY token anywhere in data/generators ───────────────

// Strip comments so the scan inspects real CODE only.
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

// A quoted (single | double | template) string literal on one line containing
// the bare token SEVERITY. The inner class excludes newlines + quote chars so a
// match is genuinely one string literal, not a span across code.
const quotedSeverity = /(['"`])[^'"`\n]*\bSEVERITY\b[^'"`\n]*\1/;

/** Recursively collect *.js files under a directory. */
function collectJs(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectJs(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

describe('no leaked quoted SEVERITY template token in data/generators', () => {
  const files = [
    ...collectJs(resolve(ROOT, 'src/data')),
    ...collectJs(resolve(ROOT, 'src/generators')),
  ];

  it('scans a non-trivial number of source files', () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it('no source ships a quoted SEVERITY string', () => {
    const offenders = files.filter((f) => quotedSeverity.test(stripComments(readFileSync(f, 'utf8'))));
    expect(
      offenders.map((f) => f.replace(ROOT + '/', '')),
      `files with a leaked quoted SEVERITY token: ${offenders.join(', ')}`,
    ).toEqual([]);
  });
});

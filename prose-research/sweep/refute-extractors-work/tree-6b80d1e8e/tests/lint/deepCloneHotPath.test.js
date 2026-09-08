/**
 * deepCloneHotPath.test.js — A+ P3.1 (clone-seam centralization).
 *
 * The hot-path deep clone is centralized in src/domain/clone.js (deepClone), which
 * uses structuredClone with a JSON fallback. Bare JSON.parse(JSON.stringify) on the
 * store/domain hot paths is slower and lossy (drops undefined-valued keys, coerces
 * Dates to strings), so it must not appear anywhere under src/store/** or
 * src/domain/** EXCEPT src/domain/clone.js (the sole sanctioned clone seam, whose
 * JSON fallback legitimately holds the pattern).
 *
 * This is the source-scan guard: it survives even if ESLint is skipped (the eslint
 * no-restricted-syntax selectors are the primary enforcement) and is deliberately
 * dependency-light — it only reads files from disk and scans the text. Comments are
 * stripped before scanning so the doc-comment mentions in clone.js (and anywhere
 * else) never produce a false positive.
 *
 * @enforced-by this test + eslint.config.js (src/store/** and src/domain/** no-restricted-syntax)
 */

import { describe, test, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = process.cwd();
const STORE_DIR = resolve(ROOT, 'src', 'store');
const DOMAIN_DIR = resolve(ROOT, 'src', 'domain');
const CLONE_SEAM = resolve(DOMAIN_DIR, 'clone.js');

/** Recursively collect every .js / .jsx file under a directory. */
function jsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...jsFiles(full));
    } else if (/\.(js|jsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Strip line and block comments so a JSON.parse(JSON.stringify) mention inside a
 * doc comment is never counted as a code occurrence. String literals are left
 * intact — a JSON-clone never lives inside a string, and the pattern we match is a
 * chained call expression, not a substring of a string.
 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ') // block comments
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1'); // line comments (avoid eating "http://")
}

// Matches the bare chained call `JSON.parse(JSON.stringify(...` with arbitrary
// whitespace between tokens — the exact pattern the eslint selector bans.
const BARE_JSON_CLONE = /JSON\s*\.\s*parse\s*\(\s*JSON\s*\.\s*stringify\s*\(/;

describe('deep-clone hot path (no bare JSON.parse(JSON.stringify) in store/domain)', () => {
  const files = [...jsFiles(STORE_DIR), ...jsFiles(DOMAIN_DIR)];

  test('there are files to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  test('src/domain/clone.js exists and exports deepClone', () => {
    expect(existsSync(CLONE_SEAM)).toBe(true);
    const src = readFileSync(CLONE_SEAM, 'utf-8');
    expect(/export\s+function\s+deepClone\b/.test(src)).toBe(true);
  });

  test('no bare JSON.parse(JSON.stringify) in src/store or src/domain (except clone.js)', () => {
    const offenders = [];
    for (const file of files) {
      if (file === CLONE_SEAM) continue; // the sole sanctioned clone seam
      const code = stripComments(readFileSync(file, 'utf-8'));
      if (BARE_JSON_CLONE.test(code)) {
        offenders.push(file.replace(ROOT + '/', ''));
      }
    }
    expect(offenders).toEqual([]);
  });
});

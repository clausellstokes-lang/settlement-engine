/**
 * supabaseJsPinned.test.js — every edge function that imports
 * @supabase/supabase-js must pin it to an EXACT version.
 *
 * The floating `@supabase/supabase-js@2` (major-only) specifier lets esm.sh
 * resolve to whatever the newest 2.x happens to be at build time, so two
 * deploys of the same function can silently ship different client versions —
 * a supply-chain / reproducibility hazard on a live money + auth surface.
 * The earlier hardening waves pinned every importer to an exact version
 * (@2.108.2). This guard walks every supabase/functions/**\/*.ts source and
 * asserts each @supabase/supabase-js import carries an exact @X.Y.Z version,
 * failing loudly with the offending file + specifier so no function can
 * regress back to the floating form.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FUNCTIONS_DIR = join(ROOT, 'supabase/functions');

/** Recursively collect every .ts source under supabase/functions (skip tests). */
function collectTsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectTsFiles(full));
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')) {
      out.push(full);
    }
  }
  return out;
}

// Any import of @supabase/supabase-js, capturing the version tail after the @.
const IMPORT_RE = /@supabase\/supabase-js@([^'"\s]*)/g;
// Exact pin: @X.Y.Z (three numeric segments).
const EXACT_RE = /^\d+\.\d+\.\d+$/;

describe('every edge function pins @supabase/supabase-js to an exact version', () => {
  const tsFiles = collectTsFiles(FUNCTIONS_DIR);

  it('no source floats @supabase/supabase-js on a major-only specifier', () => {
    const offenders = [];
    for (const file of tsFiles) {
      const src = readFileSync(file, 'utf8');
      const specifiers = [];
      for (const m of src.matchAll(IMPORT_RE)) {
        if (!EXACT_RE.test(m[1])) specifiers.push(`@supabase/supabase-js@${m[1]}`);
      }
      if (specifiers.length) {
        offenders.push(`${file.slice(ROOT.length + 1)}: ${specifiers.join(', ')}`);
      }
    }
    expect(
      offenders,
      `edge functions must pin @supabase/supabase-js to an exact @X.Y.Z version; floating imports found:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });

  // Regression guard for the close-edge-pins wave: these six functions floated
  // on the major-only @2 specifier. Assert each now carries the exact pin so a
  // future edit can't silently drop one back to floating.
  it.each([
    'analytics-export',
    'generate-chronicle',
    'ingest-events',
    'log-client-error',
    'send-email',
    'verify-single-dossier',
  ])('%s pins @supabase/supabase-js to @2.108.2', (fn) => {
    const src = readFileSync(join(FUNCTIONS_DIR, fn, 'index.ts'), 'utf8');
    const matches = [...src.matchAll(IMPORT_RE)];
    expect(matches.length).toBeGreaterThan(0);
    for (const m of matches) {
      expect(m[1]).toBe('2.108.2');
    }
  });
});

/**
 * docCounts.test.js — operational-doc count ratchet.
 *
 * DEPLOY.md and ARCHITECTURE.md state counts (how many DB migrations, how many
 * edge functions) that drift every release. A stale count here is not cosmetic:
 * a by-the-book operator who trusts "runs through 046 / 10 functions total"
 * UNDER-APPLIES the later SECURITY migrations and under-deploys a function —
 * exactly the failure this guard exists to make impossible.
 *
 * Cohesive with the project's "claims carry enforcement" meta-pin
 * (tests/docs/enforcement-claims.test.js): a hardcoded number in a doc is a
 * claim, so it must be machine-checked against the filesystem it describes.
 * Every assertion derives truth from the repo (count the files), then fails if
 * the prose states a DIFFERENT number — so these can never silently rot again.
 *
 * @see ARCHITECTURE.md, docs/DEPLOY.md  (the docs this guard pins)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');
const read = (rel) => readFileSync(resolve(repo, rel), 'utf8');

// ── Filesystem truth (the numbers the docs claim to describe) ─────────────────

/** Every applied DB migration is a NNN_*.sql file in supabase/migrations/. */
const migrationFiles = readdirSync(resolve(repo, 'supabase/migrations'))
  .filter((f) => /^\d+_.*\.sql$/.test(f))
  .sort();
const MIGRATION_COUNT = migrationFiles.length;

/**
 * A deployable edge function is a directory under supabase/functions/ that has
 * an index.ts. `_shared/` is a helper bundle, not a function, so it has none.
 */
const functionDirs = readdirSync(resolve(repo, 'supabase/functions'), { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name !== '_shared')
  .map((e) => e.name)
  .filter((name) => {
    try {
      readFileSync(resolve(repo, 'supabase/functions', name, 'index.ts'));
      return true;
    } catch {
      return false;
    }
  })
  .sort();
const FUNCTION_COUNT = functionDirs.length;

const deployMd = read('docs/DEPLOY.md');
const archMd = read('ARCHITECTURE.md');

/**
 * Pull every standalone integer that prose attaches to a noun (e.g.
 * "11 functions", "migrations/** (61)"), so a wrong count is caught no matter
 * the phrasing. Returns the set of integers tied to that noun anywhere in `doc`.
 * @param {string} doc
 * @param {RegExp} re a regex with ONE capture group = the integer
 * @returns {number[]}
 */
function statedCounts(doc, re) {
  return [...doc.matchAll(re)].map((m) => Number(m[1]));
}

describe('operational-doc counts match the filesystem', () => {
  it('sanity: the filesystem has the migrations + functions we expect', () => {
    // If these baselines ever look wrong, the repo changed — update the docs,
    // not this guard. The point is the docs must equal whatever this is.
    expect(MIGRATION_COUNT).toBeGreaterThanOrEqual(61);
    expect(FUNCTION_COUNT).toBeGreaterThanOrEqual(11);
    expect(migrationFiles[0]).toMatch(/^001_/);
  });

  it('ARCHITECTURE.md states the real migration count', () => {
    // e.g. "migrations/** (61)"
    const claims = statedCounts(archMd, /migrations\/\*\*\s*\((\d+)\)/g);
    expect(claims, 'ARCHITECTURE.md should state the migration count as "migrations/** (N)"').not.toHaveLength(0);
    for (const n of claims) expect(n).toBe(MIGRATION_COUNT);
  });

  it('ARCHITECTURE.md states the real edge-function count', () => {
    // e.g. "functions/** (11 Deno edge functions ...)"
    const claims = statedCounts(archMd, /functions\/\*\*\s*\((\d+)\s+Deno/g);
    expect(claims, 'ARCHITECTURE.md should state the edge-function count near "functions/**"').not.toHaveLength(0);
    for (const n of claims) expect(n).toBe(FUNCTION_COUNT);
  });

  it('DEPLOY.md states the real edge-function count ("N functions total")', () => {
    const claims = statedCounts(deployMd, /(\d+)\s+functions total/g);
    expect(claims, 'DEPLOY.md should say "N functions total"').not.toHaveLength(0);
    for (const n of claims) expect(n).toBe(FUNCTION_COUNT);
  });

  it('DEPLOY.md deploy block lists EVERY edge function (none silently omitted)', () => {
    // A new function dir that nobody adds a deploy line for is the exact
    // "feature missing in prod" failure mode the doc warns about.
    const deployed = new Set(
      [...deployMd.matchAll(/functions deploy ([a-z0-9-]+)/g)].map((m) => m[1]),
    );
    const missing = functionDirs.filter((fn) => !deployed.has(fn));
    expect(missing, `DEPLOY.md is missing a deploy line for: ${missing.join(', ')}`).toEqual([]);
    // ...and it must not invent a deploy line for a function that doesn't exist.
    const onDisk = new Set(functionDirs);
    const phantom = [...deployed].filter((fn) => !onDisk.has(fn));
    expect(phantom, `DEPLOY.md deploys a non-existent function: ${phantom.join(', ')}`).toEqual([]);
  });
});

describe('operational-doc safety: no regression to dangerous stale guidance', () => {
  it('DEPLOY.md does not pin a "runs through 0XX" migration number that rots into under-applying', () => {
    // The original rot was "runs through 046_..." — phrasing that tells an
    // operator to stop early. Forbid the whole "through <NNN>" / "through `0..`"
    // shape so the lexical-order instruction can't silently regress.
    expect(deployMd).not.toMatch(/runs through\s+`?0?\d{2,3}_/i);
    // Independent second layer: forbid any "through 0NN" (with or without an
    // underscore/backtick) and the "0NN → 0NN" range form that told operators
    // to stop at a fixed migration. Both are how the original rot was phrased.
    expect(deployMd).not.toMatch(/through\s+`?0\d{2}`?\b/);
    expect(deployMd).not.toMatch(/0\d{2}\s*(?:→|->|—)\s*`?0\d{2}/);
  });

  it('DEPLOY.md does not hardcode the OLD "10 functions total" undercount', () => {
    expect(deployMd).not.toMatch(/\b10 functions total\b/);
  });

  it('DEPLOY.md tells the operator to apply migrations in lexical order', () => {
    expect(deployMd).toMatch(/supabase\/migrations\//);
    expect(deployMd).toMatch(/lexical order/i);
  });

  it('DEPLOY.md explicitly names the account-status SECURITY migrations as MUST-apply', () => {
    // 057/059/060 enforce account-status writes/RLS; 058 scopes config reads;
    // 061 locks moderation columns. All exist on disk and must be called out so
    // a by-the-book operator cannot under-apply the trust-boundary set.
    for (const num of ['057', '058', '059', '060', '061']) {
      expect(
        migrationFiles.some((f) => f.startsWith(`${num}_`)),
        `migration ${num} should exist on disk`,
      ).toBe(true);
      expect(deployMd, `DEPLOY.md must call out migration ${num}`).toMatch(new RegExp(`\\b${num}\\b`));
    }
    expect(deployMd, 'DEPLOY.md must flag the security set as mandatory').toMatch(/MUST APPLY/i);
  });
});

describe('ARCHITECTURE.md: OutputContainer is JSX, not raw React.createElement', () => {
  it('does not claim OutputContainer is (present-tense) written in raw React.createElement', () => {
    // grep confirms 0 createElement in OutputContainer.jsx — the doc used to say
    // the opposite, which would mislead anyone editing the highest-stakes view.
    const oc = read('src/components/OutputContainer.jsx');
    expect(oc).not.toMatch(/createElement/);
    // The doc must not resurrect the stale claim that it is CURRENTLY written in
    // raw createElement. (A past-tense "was refactored out of createElement" note
    // is fine — we only forbid the present-tense assertion of the dead state.)
    const ocClaim = archMd.match(/OutputContainer\.jsx[^]*?(?=\n- |\n\n|$)/);
    expect(ocClaim, 'ARCHITECTURE.md should mention OutputContainer.jsx').toBeTruthy();
    expect(ocClaim[0]).not.toMatch(/is written in\s+(?:raw\s+)?`?React\.createElement/i);
    expect(ocClaim[0]).not.toMatch(/written in\s+raw\s*\n?\s*`?React\.createElement/i);
    // And it should affirmatively say the view is JSX now.
    expect(ocClaim[0]).toMatch(/JSX/);
  });
});

describe('ARCHITECTURE.md: build-tool version matches package.json', () => {
  it('states the real Vite major version', () => {
    const pkg = JSON.parse(read('package.json'));
    const viteRange = pkg.devDependencies?.vite || pkg.dependencies?.vite || '';
    const major = viteRange.match(/(\d+)/)?.[1];
    expect(major, 'package.json should pin a vite version').toBeTruthy();
    const claimed = archMd.match(/Vite\s+(\d+)/);
    expect(claimed, 'ARCHITECTURE.md should state "Vite <major>"').toBeTruthy();
    expect(claimed[1]).toBe(major);
  });
});

describe('.env.example documents the client error-reporter sink', () => {
  it('mentions VITE_ERROR_REPORT_URL (no-op without it)', () => {
    const env = read('.env.example');
    expect(env).toMatch(/VITE_ERROR_REPORT_URL/);
    // The variable is actually read by the reporter — guard against documenting a
    // name the code never consumes.
    const reporter = read('src/lib/errorReporter.js');
    expect(reporter).toMatch(/VITE_ERROR_REPORT_URL/);
  });
});

describe('product copy: PDF export is unlimited, not a monthly cap', () => {
  it('canExport() is a boolean gate (no per-period quota in the implemented model)', () => {
    // Source of truth: TIER_GATE.export is a boolean; canExport returns it.
    // There is NO monthly export counter anywhere, so copy claiming "3 exports a
    // month" contradicts the implementation.
    const authSlice = read('src/store/authSlice.js');
    expect(authSlice).toMatch(/canExport:\s*\(\)\s*=>/);
    expect(authSlice).toMatch(/export:\s*true/); // a tier whose gate is unlimited-export
  });

  for (const file of ['src/copy/en.js', 'src/copy/strings.js']) {
    it(`${file} does not claim a monthly export quota`, () => {
      const copy = read(file);
      expect(copy, `${file} must not contradict unlimited canExport()`).not.toMatch(/\d+\s+exports?\s+a\s+month/i);
      expect(copy).not.toMatch(/exports?\s*\/\s*month/i);
    });
  }
});

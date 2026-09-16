/**
 * edgeSharedBundleReproducibility.test.js — THE COMMITTED-TREE REPRODUCIBILITY PIN
 * for the edge-shared bundles (chair ruling CR-EB-2 (c), lane BT2).
 *
 * WHY THIS EXISTS — the dirty-build class, observed live.
 *
 * The five *.freshness.test.js suites each re-hash their bundle's recorded
 * meta.inputs OFF THE WORKING TREE and assert the result equals the recorded
 * sourceHash. That check has a blind spot precisely the width of "uncommitted":
 * a bundle built while the tree carried unstaged edits records a hash of those
 * edits, and the freshness suite — which reads the very same dirty files —
 * agrees with it and goes green. The artifact then lands in a commit whose tree
 * cannot reproduce it. Nothing in the gate notices, and the deploy truth becomes
 * a binary that no checkout can regenerate.
 *
 * This is not hypothetical. On 2026-08-02 three bundles (aiGroundingBundle,
 * aiCharterBundle, aiOutputSchemaBundle) were built from a dirty tree and
 * committed. A walk of the preceding 60 commits found their recorded
 * sourceHashes resolving at NO commit whatsoever, while their two siblings
 * (analyticsEventsBundle, intentAtlasBundle) resolved cleanly. The incident is
 * recorded in the CR-EB-2 rebuild commit; this pin is its structural cure.
 *
 * WHAT IT ASSERTS — the same builder recipe, evaluated against the INDEX rather
 * than the working tree. `git show :<path>` yields staged content, which equals
 * HEAD content for any path with nothing staged. So:
 *
 *   - a bundle built from committed content              → GREEN (index == HEAD)
 *   - a bundle built together with its inputs, both staged → GREEN (the honest
 *     way to land an input change and its artifact in one commit)
 *   - a bundle built from UNSTAGED edits                  → RED (the class above)
 *
 * The pin is deliberately ORTHOGONAL to freshness, not a duplicate of it.
 * Freshness answers "does this artifact match the files on disk right now";
 * this answers "does this artifact match a tree anyone else can check out".
 * Both must be green at commit time; only this one can see the dirty-build class.
 *
 * NON-VACUITY. Three separate guards, because an assertion over an empty set is
 * the failure mode this repo has been bitten by before (a filename-anchored
 * source pin that survived a relocation while guarding nothing):
 *   1. the meta set is discovered from scripts/build-edge-shared.mjs ENTRIES and
 *      must be non-empty and must match the metas actually in tree, both ways —
 *      so a sixth entry cannot be added without a meta landing, and a meta
 *      cannot be deleted while the pin reports success over the remainder;
 *   2. the builder's hashing recipe is pinned in source, so a change to how
 *      sourceHash is computed forces this file to be updated rather than
 *      silently diverging into a check of nothing;
 *   3. an executed negative control proves a doctored sourceHash reds.
 */
import { describe, expect, test } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SHARED_DIR = join(ROOT, 'supabase', 'functions', '_shared');
const BUILDER_REL = 'scripts/build-edge-shared.mjs';

const git = (args, opts = {}) =>
  execFileSync('git', args, { cwd: ROOT, maxBuffer: 512 * 1024 * 1024, ...opts });

// ── Discover the entry table from the builder itself ─────────────────────────
// Hand-keying the five meta filenames here would rot the moment a sixth entry
// landed; parsing ENTRIES makes the roster derived rather than remembered.
const builderSrc = readFileSync(join(ROOT, BUILDER_REL), 'utf8');
const ENTRY_METAS = [...builderSrc.matchAll(/meta:\s*'([^']+\.meta\.json)'/g)].map((m) => m[1]);
const ENTRY_OUTS = [...builderSrc.matchAll(/out:\s*'([^']+\.js)'/g)].map((m) => m[1]);

/**
 * Read many paths out of the git INDEX in one `git cat-file --batch` process.
 * Returns a Map of path → utf8 content. Paths git does not track are absent.
 */
function readIndexContents(paths) {
  const out = new Map();
  if (paths.length === 0) return out;
  const stdout = git(['cat-file', '--batch'], { input: paths.map((p) => `:${p}`).join('\n') + '\n' });
  let off = 0;
  for (const p of paths) {
    const nl = stdout.indexOf('\n', off);
    const header = stdout.slice(off, nl).toString('utf8');
    off = nl + 1;
    if (/ missing$/.test(header) || /^[^ ]+ missing/.test(header)) continue;
    const size = Number(header.split(' ')[2]);
    out.set(p, stdout.slice(off, off + size).toString('utf8'));
    off += size + 1; // trailing newline git appends after each object
  }
  return out;
}

/** The builder's recipe, re-spelled. Pinned against drift by the source test below. */
function builderHash(parts) {
  return createHash('sha256').update(parts.join('\n')).digest('hex').slice(0, 16);
}

const metas = ENTRY_METAS.map((name) => ({
  name,
  path: join(SHARED_DIR, name),
  exists: existsSync(join(SHARED_DIR, name)),
})).map((m) => ({ ...m, json: m.exists ? JSON.parse(readFileSync(m.path, 'utf8')) : null }));

describe('edge-shared bundles — guard the guard (this pin is not vacuous)', () => {
  test('the builder declares a non-empty entry table, and every declared meta is in tree', () => {
    expect(builderSrc.length, `${BUILDER_REL} read as empty — the roster below would be vacuous`)
      .toBeGreaterThan(500);
    expect(ENTRY_METAS.length, 'parsed NO meta entries out of the builder ENTRIES table').toBeGreaterThanOrEqual(5);
    expect(ENTRY_METAS.length).toBe(ENTRY_OUTS.length);
    const missing = metas.filter((m) => !m.exists).map((m) => m.name);
    expect(missing, 'builder declares a bundle whose sidecar meta is not committed').toEqual([]);
  });

  test('every *.meta.json in _shared is claimed by a builder entry (no orphan artifacts)', () => {
    const inTree = git(['ls-files', 'supabase/functions/_shared/*.meta.json'])
      .toString('utf8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((p) => p.split('/').pop());
    expect(inTree.length).toBeGreaterThanOrEqual(5);
    expect([...inTree].sort(), 'a committed meta no builder entry produces — it can never be refreshed')
      .toEqual([...ENTRY_METAS].sort());
  });

  test('the builder still computes sourceHash the way this pin re-spells it', () => {
    // If any of these three drift, builderHash() above is measuring something
    // else and every assertion below would compare two wrong numbers happily.
    expect(builderSrc).toMatch(/createHash\('sha256'\)/);
    expect(builderSrc).toMatch(/\.digest\('hex'\)\.slice\(0,\s*16\)/);
    expect(builderSrc).toMatch(/inputPaths\.map\(p => `\$\{p\}:\$\{readFileSync\(join\(ROOT, p\), 'utf8'\)\}`\)\.join\('\\n'\)/);
  });
});

describe('edge-shared bundles reproduce AT THE COMMITTED TREE (the dirty-build class)', () => {
  for (const m of metas) {
    describe(m.name, () => {
      test('records a sourceHash, an entry, and a non-empty input list', () => {
        expect(typeof m.json.sourceHash).toBe('string');
        expect(m.json.sourceHash).toMatch(/^[0-9a-f]{16}$/);
        expect(Array.isArray(m.json.inputs)).toBe(true);
        expect(m.json.inputs.length).toBeGreaterThan(0);
        expect(m.json.inputs).toContain(m.json.entry);
      });

      test('every input outside node_modules/ is git-TRACKED (nothing falls through to disk)', () => {
        // The index lookup below falls back to disk for node_modules inputs,
        // which are lockfile-pinned and not a vector for the dirty-build class.
        // A src/ input that stopped being tracked would silently take that same
        // fallback and re-open the hole, so it is named as an error here.
        const srcInputs = m.json.inputs.filter((p) => !p.startsWith('node_modules/'));
        expect(srcInputs.length).toBeGreaterThan(0);
        const indexed = readIndexContents(srcInputs);
        const untracked = srcInputs.filter((p) => !indexed.has(p));
        expect(untracked, 'bundled input(s) not in the git index — the recorded hash cannot be reproduced from a checkout')
          .toEqual([]);
      });

      test('the recorded sourceHash equals the builder hash over INDEX content', () => {
        const indexed = readIndexContents(m.json.inputs.filter((p) => !p.startsWith('node_modules/')));
        const parts = m.json.inputs.map((p) =>
          `${p}:${indexed.has(p) ? indexed.get(p) : readFileSync(join(ROOT, p), 'utf8')}`,
        );
        expect(
          builderHash(parts),
          [
            `${m.name} was built from content that is neither committed nor staged.`,
            'This is the DIRTY-BUILD class: the freshness suite agrees with it because',
            'it reads the same dirty working tree, but no checkout can reproduce the',
            'artifact. Cure: commit or stage every changed input, re-run',
            '`npm run build:edge-shared`, and commit the bundle with its inputs.',
          ].join('\n'),
        ).toBe(m.json.sourceHash);
      });

      test('NEGATIVE CONTROL: a doctored sourceHash does not satisfy the same check', () => {
        // Proves the assertion above has teeth rather than comparing a value to
        // itself. Doctors one nibble of the recorded hash in memory only.
        const doctored = m.json.sourceHash.replace(/^./, (c) => (c === '0' ? '1' : '0'));
        expect(doctored).not.toBe(m.json.sourceHash);
        const indexed = readIndexContents(m.json.inputs.filter((p) => !p.startsWith('node_modules/')));
        const parts = m.json.inputs.map((p) =>
          `${p}:${indexed.has(p) ? indexed.get(p) : readFileSync(join(ROOT, p), 'utf8')}`,
        );
        expect(builderHash(parts)).not.toBe(doctored);
      });
    });
  }
});

describe('edge-shared bundles were built from ONE tree in ONE run (CR-EB-2 (b))', () => {
  test('every meta records a parseable generatedAt', () => {
    for (const m of metas) {
      expect(Number.isFinite(Date.parse(m.json.generatedAt)), `${m.name} generatedAt unparseable`).toBe(true);
    }
  });

  test('all bundles share a single build window — no stale siblings left behind', () => {
    // The 2026-08-02 incident shipped a mixed set: some artifacts rebuilt, some
    // left at an older run. Ruling (b) requires all five to rebuild together, so
    // a spread wider than one builder invocation is the tell that a partial
    // rebuild landed. The builder walks five entries in well under a minute.
    const stamps = metas.map((m) => Date.parse(m.json.generatedAt));
    const spreadMs = Math.max(...stamps) - Math.min(...stamps);
    expect(
      spreadMs,
      `generatedAt spread is ${(spreadMs / 1000).toFixed(1)}s across the bundles — some were not rebuilt with the rest. Re-run: npm run build:edge-shared`,
    ).toBeLessThanOrEqual(10 * 60 * 1000);
  });
});

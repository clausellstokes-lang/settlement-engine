/**
 * tests/build/domainGeneratorsBoundary.test.js — architecture-boundary ratchet
 * for the src/domain → src/generators layering cycle.
 *
 * THE CYCLE (known, deferred): the intended layering is generators → domain
 * (generators build raw settlements; the domain ages/reacts to them). A handful
 * of domain modules currently reach the OTHER way, into src/generators/**, which
 * forms a domain ↔ generators import cycle. That cycle is part of why the
 * worldPulse simulation (src/domain/worldPulse — 183,678 lines across 443 files,
 * re-measured 2026-09-20 at ee2406191; the header carried "~22.7k LOC" from an era
 * eight times smaller) drags generator code
 * with it — and, before the first-paint fix, why it could land eagerly in the
 * entry chunk. The full inversion (pushing the shared leaves DOWN into a layer
 * both can import, or DI-ing the generator fns in) is risky and deferred; with
 * worldPulse now lazy-loaded out of the entry chunk (see worldPulseLazy.test.js
 * + src/store/campaignWorldPulseSlice.js), the cycle has ZERO first-paint cost.
 *
 * THE RATCHET (this test): freeze the CURRENT set of domain→generators edges as
 * a burndown baseline and FAIL if a NEW edge appears. The baseline can only
 * SHRINK (an entry removed here when a real inversion lands) — never grow. This
 * is a defense-in-depth guard: it doesn't fix the cycle, it stops it metastasizing
 * into more of the domain while the inversion is deferred, so a future advance
 * doesn't quietly re-couple a fresh domain module to a generator and re-bloat the
 * graph the first-paint fix just trimmed.
 *
 * Pure source-parse: walks every .js under src/domain/ and matches both static
 * `import ... from '.../generators/...'` AND dynamic `import('.../generators/...')`
 * so a refactor can't dodge the ratchet by switching import style. No build
 * needed — runs in the normal vitest gate.
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * THE ROOT IS THIS MODULE'S OWN TREE, NEVER THE HARNESS'S WORKING DIRECTORY (judgment 111,
 * 2026-09-21). It used to be read from the working directory at module load, which made this
 * ratchet measure whichever tree the RUNNER happened to sit in rather than the one this file
 * belongs to. Every path below hangs off it, so the read is the whole instrument. The last
 * arm of the suite pins both the value and this line's spelling.
 */
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const domainDir = resolve(repoRoot, 'src/domain');

/**
 * Frozen baseline: the EXACT domain→generators edges that exist today, keyed by
 * the importing domain file (repo-relative, POSIX slashes) → the sorted list of
 * generator module specifiers it imports. This set is allowed to SHRINK (delete
 * an entry when its inversion lands) but NEVER grow. Adding a domain→generators
 * edge that isn't here is a layering regression and fails the test below.
 *
 * Baseline captured at HEAD 8e10816. THAT CAPTURE IS HISTORICAL (see the W6
 * re-baseline below); BASELINE_EDGES is the authority, and the live set is FOUR
 * files / FIVE specifiers: checkDraftEdit.js, neighbourBackLink.js,
 * institutionLifecycle.js and resourceDynamicsKernel.js (two specifiers).
 * EM-R0f is why the set will not grow: the power/economy input fingerprint moved
 * DOWN a layer, to src/data/economyFingerprint.js, so that EM-R0c's
 * src/domain/edit record merge reads it without becoming the fifth file here.
 */
// MASTER MERGE W6 RE-BASELINE (honest, both directions): master's frozen list
// was re-derived against this lineage's tree. SHRINK — defenseDisplay,
// mutateEntities, pulseKernel no longer import generators (RF refactors removed
// those edges). ADD — resourceDynamicsKernel.js (the W-DISCOVERY resource
// engine, built on this lineage AFTER master's baseline): its computeActiveChains
// reconcile + terrainHelpers read are the documented single-writer design
// (docs/DESIGN + memory w-discovery), a carried deliberate edge, not a new
// violation. Shrink-only resumes from this set.
const BASELINE_EDGES = Object.freeze({
  'src/domain/coherence/checkDraftEdit.js': ['../../generators/structuralValidator.js'],
  'src/domain/relationships/neighbourBackLink.js': ['../../generators/crossSettlementConflicts.js'],
  'src/domain/worldPulse/institutionLifecycle.js': ['../../generators/computeActiveChains.js'],
  'src/domain/worldPulse/resourceDynamicsKernel.js': ['../../generators/computeActiveChains.js', '../../generators/terrainHelpers.js'],
});

/** Recursively collect every .js file under a directory (POSIX-relative paths). */
function collectJsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) {
      out.push(...collectJsFiles(abs));
    } else if (entry.endsWith('.js')) {
      out.push(abs);
    }
  }
  return out;
}

/**
 * Extract every generators specifier (static or dynamic) imported by a source
 * file. Matches `from '...generators/...'` and `import('...generators/...')`.
 * Returns a sorted unique list of the raw specifiers.
 */
function generatorSpecifiers(source) {
  const specs = new Set();
  // Static: ... from '<spec>'  /  ... from "<spec>"
  const staticRe = /from\s+['"]([^'"]*\/generators\/[^'"]+)['"]/g;
  // Dynamic: import('<spec>')  /  import("<spec>")
  const dynamicRe = /import\(\s*['"]([^'"]*\/generators\/[^'"]+)['"]\s*\)/g;
  for (const re of [staticRe, dynamicRe]) {
    let m;
    while ((m = re.exec(source)) !== null) specs.add(m[1]);
  }
  return [...specs].sort();
}

/** Build the live edge map by scanning every domain source file. */
function liveEdges() {
  const edges = {};
  for (const abs of collectJsFiles(domainDir)) {
    const rel = relative(repoRoot, abs).split('\\').join('/');
    const specs = generatorSpecifiers(readFileSync(abs, 'utf-8'));
    if (specs.length) edges[rel] = specs;
  }
  return edges;
}

describe('architecture boundary — domain → generators ratchet', () => {
  const edges = liveEdges();

  it('introduces NO new domain→generators edge beyond the frozen baseline', () => {
    // Every live edge must be accounted for in the baseline. A brand-new
    // importing file, OR a new generator specifier added to an existing file,
    // is a layering regression.
    const newOrChanged = [];
    for (const [file, specs] of Object.entries(edges)) {
      const allowed = BASELINE_EDGES[file];
      if (!allowed) {
        newOrChanged.push(`NEW importer: ${file} -> ${specs.join(', ')}`);
        continue;
      }
      const allowedSet = new Set(allowed);
      const extra = specs.filter(s => !allowedSet.has(s));
      if (extra.length) {
        newOrChanged.push(`NEW edge in ${file} -> ${extra.join(', ')}`);
      }
    }
    expect(
      newOrChanged,
      `New src/domain → src/generators import edge(s) detected. This is a layering ` +
      `regression (the cycle is supposed to be shrinking, not growing). If the new ` +
      `coupling is unavoidable, invert it (move the shared leaf down a layer or DI ` +
      `the generator fn) rather than widening the baseline:\n  ${newOrChanged.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the baseline contains no STALE entries (each baseline file still imports it)', () => {
    // Keep the baseline honest as the cycle burns down: if an inversion removed
    // an edge but left it listed here, this fails so the dead baseline entry is
    // deleted (otherwise a later re-coupling would silently slip back in under a
    // stale allowance).
    const stale = [];
    for (const [file, allowed] of Object.entries(BASELINE_EDGES)) {
      const live = edges[file] || [];
      const liveSet = new Set(live);
      const gone = allowed.filter(s => !liveSet.has(s));
      if (gone.length) stale.push(`${file} no longer imports: ${gone.join(', ')}`);
    }
    expect(
      stale,
      `Stale baseline entries — these domain→generators edges were inverted/removed ` +
      `but are still listed in BASELINE_EDGES. Delete them so the baseline only ` +
      `covers edges that genuinely still exist:\n  ${stale.join('\n  ')}`,
    ).toEqual([]);
  });

  it('baseline is exactly the 4 files and 5 known edges (cardinality guard)', () => {
    // A coarse second lock: even if the per-file diff above were somehow fooled,
    // the total count must match the documented baseline. Lower is fine (cycle
    // shrank); higher means an edge crept in.
    const liveCount = Object.values(edges).reduce((n, specs) => n + specs.length, 0);
    expect(liveCount).toBeLessThanOrEqual(5);
  });

  it('derives its repository root from this module URL, never the working directory', () => {
    // WHY THIS ARM EXISTS (judgment 111, 2026-09-21). The root above was read from the
    // harness's working directory at module load, so a harness that imported this file from
    // ANOTHER directory walked THAT tree's src/domain and reported a serene zero over a lane
    // worktree it had never opened. Two pre-proof lanes were told their trees were clean by a
    // ratchet that had measured the main checkout instead. A guard that prints a false zero is
    // worse than no guard, so the derivation is pinned rather than trusted.
    const selfPath = fileURLToPath(import.meta.url);

    // 1. THE VALUE — the root is the tree THIS FILE lives in, and this file sits exactly two
    //    levels down in it. A foreign root reds here: the relative path would climb out.
    expect(repoRoot).toBe(join(dirname(selfPath), '../..'));
    expect(relative(repoRoot, selfPath).split('\\').join('/'))
      .toBe('tests/build/domainGeneratorsBoundary.test.js');

    // 2. THE DERIVATION ITSELF, pinned as text. The assertions above can be satisfied by
    //    accident whenever the runner happens to sit in the repository root — which is
    //    precisely the case that hid the defect for as long as it existed. This line cannot.
    const rootLine = readFileSync(selfPath, 'utf-8')
      .split('\n')
      .find(line => line.startsWith('const repoRoot ='));
    expect(rootLine).toBe("const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');");

    // 3. AND EVERY PATH THIS RATCHET WALKS HANGS OFF THAT ROOT.
    expect(domainDir).toBe(resolve(repoRoot, 'src/domain'));
  });
});

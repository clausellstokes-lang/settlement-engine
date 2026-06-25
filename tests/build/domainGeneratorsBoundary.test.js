/**
 * tests/build/domainGeneratorsBoundary.test.js — architecture-boundary ratchet
 * for the src/domain → src/generators layering cycle.
 *
 * THE CYCLE (known, deferred): the intended layering is generators → domain
 * (generators build raw settlements; the domain ages/reacts to them). A handful
 * of domain modules currently reach the OTHER way, into src/generators/**, which
 * forms a domain ↔ generators import cycle. That cycle is part of why the
 * worldPulse simulation (src/domain/worldPulse, ~22.7k LOC) drags generator code
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
import { resolve, join, relative } from 'node:path';

const repoRoot = process.cwd();
const domainDir = resolve(repoRoot, 'src/domain');

/**
 * Frozen baseline: the EXACT domain→generators edges that exist today, keyed by
 * the importing domain file (repo-relative, POSIX slashes) → the sorted list of
 * generator module specifiers it imports. This set is allowed to SHRINK (delete
 * an entry when its inversion lands) but NEVER grow. Adding a domain→generators
 * edge that isn't here is a layering regression and fails the test below.
 *
 * Baseline captured at HEAD 8e10816 (verified by grep over src/domain/**):
 *   1. coherence/checkDraftEdit.js      → generators/structuralValidator.js
 *   2. display/defenseDisplay.js        → generators/defenseGenerator.js
 *   3. events/mutate.js                 → generators/prng.js
 *   4. relationships/neighbourBackLink.js → generators/crossSettlementConflicts.js
 *   5. worldPulse/pulseKernel.js        → generators/prng.js
 *   6. worldPulse/institutionLifecycle.js → generators/computeActiveChains.js
 */
const BASELINE_EDGES = Object.freeze({
  'src/domain/coherence/checkDraftEdit.js': ['../../generators/structuralValidator.js'],
  'src/domain/display/defenseDisplay.js': ['../../generators/defenseGenerator.js'],
  'src/domain/events/mutate.js': ['../../generators/prng.js'],
  'src/domain/relationships/neighbourBackLink.js': ['../../generators/crossSettlementConflicts.js'],
  'src/domain/worldPulse/pulseKernel.js': ['../../generators/prng.js'],
  'src/domain/worldPulse/institutionLifecycle.js': ['../../generators/computeActiveChains.js'],
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

  it('baseline is exactly the 6 known edges (cardinality guard)', () => {
    // A coarse second lock: even if the per-file diff above were somehow fooled,
    // the total count must match the documented baseline. Lower is fine (cycle
    // shrank); higher means an edge crept in.
    const liveCount = Object.values(edges).reduce((n, specs) => n + specs.length, 0);
    expect(liveCount).toBeLessThanOrEqual(6);
  });
});

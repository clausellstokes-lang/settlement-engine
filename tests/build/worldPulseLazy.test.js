/**
 * tests/build/worldPulseLazy.test.js — first-paint lazy-load contract for the
 * worldPulse simulation, mirroring vendorPdfLazy.test.js's source-level checks.
 *
 * THE PROBLEM: the worldPulse domain barrel (src/domain/worldPulse/index.js) is
 * ~22.7k LOC of campaign simulation. campaignWorldPulseSlice.js used to STATICALLY
 * `import { ... } from '../domain/worldPulse/index.js'`, which — because every
 * store slice is composed into store/index.js, the app's entry graph — dragged
 * the whole simulation into the eager first-paint entry chunk even though a user
 * only touches it when they advance a campaign's world clock.
 *
 * THE FIX (this lane): convert the slice to a MEMOIZED dynamic import mirroring
 * settlementSlice.loadEngine() — the heavy simulation entry points
 * (advance/preview/apply-proposal/party-impact) load via `await loadWorldPulse()`,
 * and the light, sync schema helpers (ensureWorldState / canonizeWorldState /
 * updateProposalStatus / normalizeSimulationRules) are imported STATICALLY from
 * their leaf modules (worldState.js / simulationRules.js, which carry no heavy
 * transitive deps) so getCampaignWorldState can stay synchronous (aiSlice reads
 * its result synchronously).
 *
 * These are pure source-parse contracts (no build needed) so they survive
 * source-level refactors: if someone re-adds a top-level barrel import, or makes
 * getCampaignWorldState async, the gate fails here.
 *
 * KNOWN CROSS-LANE GAP (documented, NOT asserted as fixed): worldPulse/index.js
 * is ALSO statically imported by FOUR other store files reachable from
 * store/index.js — aiSlice.js, campaignSlice.js, campaignRegionalSlice.js, and
 * campaignPulseHelpers.js. So this lane alone does NOT yet remove worldPulse from
 * the entry chunk; those importers must also be inverted/lazied (tracked as a
 * cross-lane follow-up). This test pins the in-lane invariant precisely (the
 * SLICE no longer pulls the barrel statically) and ENUMERATES the remaining
 * static importers as a burndown baseline so the cleanup can be driven to zero
 * without this test silently passing on a half-done state.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = process.cwd();
const read = (rel) => readFileSync(resolve(repoRoot, rel), 'utf-8');

/**
 * Strip block + line comments so docblocks that MENTION 'worldPulse/index.js'
 * (this file's own header, and the slice's header) don't masquerade as imports.
 * Crude but sufficient for import-graph assertions over our own source.
 */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')   // block comments
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1'); // line comments (keep '://' in urls)
}

const SLICE = 'src/store/campaignWorldPulseSlice.js';

describe('first-paint — worldPulse simulation is lazy in campaignWorldPulseSlice', () => {
  const sliceSrc = read(SLICE);
  const sliceCode = stripComments(sliceSrc);

  it('has NO top-level static import of the worldPulse barrel (index.js)', () => {
    // A `... from '.../worldPulse/index.js'` (or '.../worldPulse' bare) at module
    // scope would force the whole simulation into this slice's chunk graph.
    expect(sliceCode).not.toMatch(/from\s+['"][^'"]*\/worldPulse\/index\.js['"]/);
    expect(sliceCode).not.toMatch(/from\s+['"][^'"]*\/domain\/worldPulse['"]/);
  });

  it('loads the worldPulse barrel via a DYNAMIC import()', () => {
    // The lazy boundary: import('../domain/worldPulse/index.js') inside a fn body.
    expect(sliceCode).toMatch(/import\(\s*['"][^'"]*\/worldPulse\/index\.js['"]\s*\)/);
  });

  it('memoizes the dynamic import (resolves once, shared by every action)', () => {
    // Mirrors settlementSlice.loadEngine(): a module-level promise cache so the
    // first heavy action pays the import and the rest reuse it.
    expect(sliceCode).toMatch(/function\s+loadWorldPulse\s*\(/);
    expect(sliceCode).toMatch(/_worldPulsePromise\s*\?\?=/);
  });

  it('keeps the light schema helpers STATIC (from leaf modules, not the barrel)', () => {
    // ensureWorldState/canonizeWorldState/updateProposalStatus come from
    // worldState.js; normalizeSimulationRules from simulationRules.js. Static +
    // sync is REQUIRED so getCampaignWorldState can stay synchronous.
    expect(sliceCode).toMatch(/from\s+['"][^'"]*\/worldPulse\/worldState\.js['"]/);
    expect(sliceCode).toMatch(/from\s+['"][^'"]*\/worldPulse\/simulationRules\.js['"]/);
  });

  it('getCampaignWorldState stays SYNCHRONOUS (sync consumers read its result inline)', () => {
    // Store consumers call state.getCampaignWorldState?.(id) and use the result
    // IMMEDIATELY (not awaited). If it became async it would return a Promise and
    // silently break those consumers — so guard the sync contract here.
    expect(sliceCode).toMatch(/getCampaignWorldState:\s*\(campaignId\)\s*=>/);
    expect(sliceCode).not.toMatch(/getCampaignWorldState:\s*async/);
  });

  it('every action that runs the simulation awaits loadWorldPulse() before its set()', () => {
    // The five heavy actions must each destructure the loaded module via await.
    // (advance + resolveIntervalMajors await before their producer; the rest await
    // before their set() producer, since Immer producers can't be async.) Count the
    // awaited loads. resolveIntervalMajors (Stage 3 resume) is the 5th.
    const awaitedLoads = (sliceCode.match(/await\s+loadWorldPulse\(\)/g) || []).length;
    expect(awaitedLoads).toBe(5);
    // And there must be NO leftover reference to a top-level heavy binding — every
    // domain* heavy fn must be obtained from a loadWorldPulse() destructure.
    for (const fn of ['advanceCampaignWorld', 'applyPartyImpact', 'applyWorldPulseProposal', 'previewCampaignWorldPulse']) {
      // The destructured local alias is `... as domainX` / `X: domainX` from the load.
      const loadedHere = new RegExp(`${fn}:\\s*domain[A-Za-z]*\\s*}\\s*=\\s*await\\s+loadWorldPulse`);
      expect(sliceCode, `${fn} must be obtained via await loadWorldPulse()`).toMatch(loadedHere);
    }
  });
});

// ── Cross-lane burndown baseline ────────────────────────────────────────────
// Enumerate the store files that STILL statically import the worldPulse barrel
// (reachable from store/index.js). This lane removed campaignWorldPulseSlice.js
// from that list; the remaining four are the cross-lane follow-up. The test
// FAILS if a NEW static barrel importer appears in src/store (the list may only
// shrink as the cleanup lands) — so the burndown can't quietly regress and the
// slice can't quietly re-acquire the edge.
describe('first-paint — worldPulse barrel static-importer burndown (src/store)', () => {
  // Files allowed to STILL statically import '../domain/worldPulse/index.js'.
  // Baseline at HEAD 8e10816 AFTER this lane's fix. Drive this to [] by lazying
  // / inverting each one; this slice is intentionally ABSENT.
  const ALLOWED_STATIC_BARREL_IMPORTERS = Object.freeze([
    'src/store/campaignSlice.js',
    'src/store/campaignRegionalSlice.js',
    'src/store/campaignPulseHelpers.js',
  ]);

  // The full set of store files we scan for a static barrel import.
  const STORE_FILES = Object.freeze([
    'src/store/aiSlice.js',
    'src/store/campaignSlice.js',
    'src/store/campaignRegionalSlice.js',
    'src/store/campaignPulseHelpers.js',
    'src/store/campaignWorldPulseSlice.js',
    'src/store/settlementSlice.js',
    'src/store/neighbourSlice.js',
    'src/store/mapSlice.js',
    'src/store/index.js',
  ]);

  const BARREL_IMPORT = /from\s+['"][^'"]*\/domain\/worldPulse\/index\.js['"]/;

  it('campaignWorldPulseSlice.js is NOT among the static barrel importers', () => {
    expect(ALLOWED_STATIC_BARREL_IMPORTERS).not.toContain(SLICE);
    expect(stripComments(read(SLICE))).not.toMatch(BARREL_IMPORT);
  });

  it('no NEW store file statically imports the worldPulse barrel (list may only shrink)', () => {
    const offenders = [];
    for (const file of STORE_FILES) {
      const code = stripComments(read(file));
      if (BARREL_IMPORT.test(code) && !ALLOWED_STATIC_BARREL_IMPORTERS.includes(file)) {
        offenders.push(file);
      }
    }
    expect(
      offenders,
      `New static import of src/domain/worldPulse/index.js from store file(s). The ` +
      `barrel pulls ~22.7k LOC into the entry chunk; use a memoized dynamic import ` +
      `(see campaignWorldPulseSlice.loadWorldPulse) or import the needed leaf module ` +
      `directly:\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the burndown baseline is honest (each allowed file still imports the barrel)', () => {
    // If an allowed importer was inverted but left in the list, fail so it gets
    // removed (otherwise the list never reaches [] and a regression could hide).
    const stale = ALLOWED_STATIC_BARREL_IMPORTERS.filter(
      file => !BARREL_IMPORT.test(stripComments(read(file))),
    );
    expect(
      stale,
      `Stale burndown entries — these files no longer statically import the worldPulse ` +
      `barrel; remove them from ALLOWED_STATIC_BARREL_IMPORTERS:\n  ${stale.join('\n  ')}`,
    ).toEqual([]);
  });
});

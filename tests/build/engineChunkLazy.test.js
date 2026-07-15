/**
 * tests/build/engineChunkLazy.test.js — engine chunk first-paint contract.
 *
 * The generation engine (all of src/generators/* — economicGenerator,
 * powerGenerator, npcGenerator, …) is bundled into one "engine-*" chunk
 * (~655 kB raw / ~212 kB gz). It must not weigh on first paint: settlement
 * generation is a deliberate user action (loadEngine() dynamic import), so the
 * heavy generators should download on first generate, not first paint.
 *
 * Contracts pinned here (all currently TRUE — regressions of these are caught):
 *   1. The engine stack is its own chunk, within a sane size band.
 *   2. The engine chunk is excluded from <link rel="modulepreload"> (the vite
 *      modulePreload.resolveDependencies filter) so the browser doesn't pre-fetch
 *      it on first paint.
 *   3. settlementSlice reaches the heavy generators via dynamic import()
 *      (loadEngine), not a top-level static import.
 *
 * KNOWN GAP (NOT yet pinned — deliberate): the entry chunk STILL carries one
 * static `import … from "./engine-*.js"` because ~11 leaf utilities in
 * src/generators/ (prng, terrainHelpers, priorityHelpers, helpers, aiLayer,
 * defenseGenerator, structuralValidator, computeActiveChains, servicesGenerator,
 * crossSettlementConflicts, steps/stepMetadata) are imported statically by the
 * domain/store/component layers. Because circular imports keep all of
 * src/generators/* in ONE chunk, pulling any leaf drags the whole engine eagerly
 * — defeating loadEngine's intent. Severing that needs relocating those leaves
 * out of the engine chunk (a data↔engine restructure). Until then we do NOT
 * assert engine-absence from the entry's static graph (it would fail); we lock in
 * the mitigations above so the situation can only improve, not regress.
 *
 * Anti-vacuity (mirrors vendorPdfLazy): the dist/ suite is runIf(distExists) and
 * silently no-ops pre-build; CI re-runs with VERIFY_DIST=1, where a missing dist/
 * is a HARD failure.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
const requireDist = process.env.VERIFY_DIST === '1';

describe.runIf(requireDist)('engine chunk dist verification is not vacuously skipped', () => {
  it('dist/ + dist/assets exist when VERIFY_DIST=1 (a skipped post-build contract is green-on-nothing)', () => {
    expect(distExists, 'VERIFY_DIST=1 but dist/assets is absent — run `npm run build` first').toBe(true);
  });
});

describe.runIf(distExists)('engine chunk — first-paint contract', () => {
  it('engine is its own chunk in dist/assets/', () => {
    const engine = readdirSync(assetsDir).filter(f => /^engine-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(engine.length).toBeGreaterThan(0);
  });

  it('engine chunk is within a sane size band (catches both a merge-into-hot-chunk and runaway growth)', () => {
    const engine = readdirSync(assetsDir).find(f => /^engine-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(engine).toBeDefined();
    const size = statSync(join(assetsDir, engine)).size;
    expect(size).toBeGreaterThan(200_000);   // < this → engine likely merged into a hot chunk
    expect(size).toBeLessThan(1_400_000);     // > this → a heavy dep snuck into the engine
  });

  it('index.html does NOT modulepreload the engine chunk (the real first-paint mitigation)', () => {
    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    const preloadRe = /<link\s+rel="modulepreload"[^>]*href="[^"]*engine-[^"]*"/g;
    expect(html.match(preloadRe) || []).toHaveLength(0);
  });
});

describe('engine chunk — source uses dynamic import for the heavy generators', () => {
  it('settlementSlice loadEngine() dynamic-imports generateSettlementPipeline (not a static top-level import)', () => {
    const src = readFileSync(resolve(process.cwd(), 'src/store/settlementSlice.js'), 'utf-8');
    expect(src).toMatch(/import\(['"][^'"]*generateSettlementPipeline[^'"]*['"]\)/);
    expect(src).not.toMatch(/^import\s.*from\s+['"][^'"]*generators\/generateSettlementPipeline[^'"]*['"]/m);
  });
});

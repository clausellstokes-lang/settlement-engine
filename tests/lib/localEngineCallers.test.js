/**
 * THE LOCAL ENGINE'S CALLERS GO THROUGH ITS ONE SEAM (ENGINE-3 unit 2).
 *
 * A build made with VITE_ENGINE_REMOTE='true' leaves `src/lib/localEngine.js` out
 * (`vite.config.js :: engineAbsentWhenRemote`; tests/build/engineAbsentWhenRemote.test.js),
 * so every main-thread module that reaches the local engine must reach it THROUGH the seam
 * or carry a stated reason it cannot. Flag off, the seam is a pass-through: it hands back the
 * very module namespaces a direct import does, and sixty settlements hashed through it equal
 * sixty hashed through the direct import.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Modules under src/store, src/components and src/lib that still name a local-engine module
 * directly, each with the reason it does. The flagged build's backstop (the pipeline entry
 * resolves to the absent twin too) covers it, which the dist arm of
 * tests/build/engineAbsentWhenRemote.test.js proves.
 */
const DIRECT_REACHERS = Object.freeze({
  // SYNCHRONOUS by design (an injectable `engine` defaulting to a static import); its callers
  // already reach it lazily.
  'src/lib/instantWorld/composeInstantWorld.js': ['../../generators/generateSettlementPipeline.js'],
});

const LOCAL_ENGINE_SPECIFIER = /(['"])((?:\.\.?\/)+(?:generators\/generateSettlementPipeline|generators\/pipeline|workers\/generationRequest)\.js)\1/g;

/** @param {string} dir @param {string[]} out */
function walk(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(js|jsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** Strip comments so a prose mention of a path is not an import. */
const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

describe('the local engine is reached through its one seam', () => {
  it('no store, component or lib module names a local-engine module, but the seam and the stated direct reachers', () => {
    const files = ['src/store', 'src/components', 'src/lib'].flatMap((dir) => walk(join(ROOT, dir), []));
    expect(files.length).toBeGreaterThan(300); // the walk is not vacuous
    /** @type {Record<string, string[]>} */
    const found = {};
    for (const file of files) {
      const rel = file.slice(ROOT.length + 1);
      if (rel === 'src/lib/localEngine.js' || rel === 'src/lib/localPipeline.js') continue;
      const specs = [...stripComments(readFileSync(file, 'utf8')).matchAll(LOCAL_ENGINE_SPECIFIER)].map((m) => m[2]);
      if (specs.length > 0) found[rel] = specs;
    }
    expect(found).toEqual(DIRECT_REACHERS);
  });

  it('the seam\'s two doors name exactly the three engine modules between them', () => {
    const specs = (rel) => [...stripComments(readFileSync(join(ROOT, rel), 'utf8')).matchAll(LOCAL_ENGINE_SPECIFIER)].map((m) => m[2]).sort();
    expect(specs('src/lib/localEngine.js')).toEqual(['../workers/generationRequest.js']);
    expect(specs('src/lib/localPipeline.js')).toEqual(['../generators/generateSettlementPipeline.js', '../generators/pipeline.js']);
  });

  it('the re-pointed callers reach the pipeline door by dynamic import() only (no static edge to split it out)', () => {
    // settlementRegenAction.js: the slice's regeneration bag, lifted with regenSection (ENGINE-5 unit 1).
    const callers = ['src/store/settlementRederiveAction.js', 'src/components/surveyor/ConstructionPanel.jsx', 'src/store/campaignContentBindingSession.js', 'src/store/settlementRegenAction.js'];
    for (const rel of callers) {
      const code = stripComments(readFileSync(join(ROOT, rel), 'utf8'));
      expect(code, rel).toMatch(/import\((['"])(?:\.\.\/)+lib\/localPipeline\.js\1\)/);
      // anchored: the dynamic import is proven present on the line above.
      expect(code, rel).not.toMatch(/^import\s[^;]*localPipeline/m);
    }
  });
});

describe('flag off, the seam is a pass-through', () => {
  it('each loader hands back the namespace the direct import does', async () => {
    const seam = await import('../../src/lib/localEngine.js');
    const door = await import('../../src/lib/localPipeline.js');
    expect(seam.LOCAL_ENGINE_PRESENT).toBe(true);
    expect(await door.loadLocalPipeline()).toBe(await import('../../src/generators/generateSettlementPipeline.js'));
    expect(await door.loadPipelineRegistry()).toBe(await import('../../src/generators/pipeline.js'));
    expect(await seam.loadGenerationCore()).toBe(await import('../../src/workers/generationRequest.js'));
  });

  it('sixty settlements hashed through the seam equal sixty hashed through the direct import', async () => {
    const { loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    await loadGenerationLawPayloads();
    const direct = await import('../../src/generators/generateSettlementPipeline.js');
    const { loadLocalPipeline } = await import('../../src/lib/localPipeline.js');
    const viaSeam = await loadLocalPipeline();
    const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city'];
    const hashOf = (pipe) => {
      const h = createHash('sha256');
      for (let i = 0; i < 60; i++) {
        // ConstructionPanel's and the binding session's call shape: (config, null, { seed }).
        const config = { settType: TIERS[i % TIERS.length], culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized' };
        h.update(JSON.stringify(pipe.generateSettlementPipeline(config, null, { seed: `engine3-seam-${i}` })));
      }
      return h.digest('hex');
    };
    const seamHash = hashOf(viaSeam);
    expect(seamHash).toMatch(/^[0-9a-f]{64}$/);
    expect(seamHash).toBe(hashOf(direct));
  }, 300_000);
});

describe('flag on, a re-pointed caller refuses with the typed code', () => {
  afterEach(() => {
    vi.doUnmock('../../src/lib/localPipeline.js');
    vi.resetModules();
  });

  it('the re-derivation rejects with engine_local_absent when the seam is the absent twin', async () => {
    vi.resetModules();
    vi.doMock('../../src/lib/localPipeline.js', () => import('../../src/lib/localEngine.absent.js'));
    const { regenerateWithLayer } = await import('../../src/store/settlementRederiveAction.js');
    await expect(regenerateWithLayer({ seed: 'x' }, {}, null, [])).rejects.toMatchObject({ code: 'engine_local_absent' });
  });
});

/**
 * THE PROTECTION STEP — a build made with VITE_ENGINE_REMOTE='true' carries no generator
 * (docs/DESIGN_ENGINE_SERVICE.md "The client switch" (5); ENGINE-3 unit 1).
 *
 * The local engine's one seam (src/lib/localEngine.js) and the pipeline entry resolve to
 * src/lib/localEngine.absent.js in a flagged build (`vite.config.js ::
 * engineAbsentWhenRemote`). The SOURCE arms below always run and pin the mechanism; the
 * DIST arms read a flagged build made with
 *
 *   VITE_ENGINE_REMOTE=true npx vite build --outDir node_modules/.cache/engine-remote-dist --emptyOutDir
 *
 * (override the directory with ENGINE_REMOTE_DIST). They are `describe.runIf` in the
 * estate's idiom; VERIFY_ENGINE_REMOTE_DIST=1 turns a missing flagged dist into a hard
 * failure. The world pulse is deliberately NOT asserted absent: it stays in the browser
 * for this program (the chair's ruling, 2026-11-04).
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { engineAbsentWhenRemote, engineRemoteBuild } from '../../vite.config.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');
const ABSENT = join(SRC, 'lib/localEngine.absent.js');
const REMOTE_DIST = resolve(ROOT, process.env.ENGINE_REMOTE_DIST || 'node_modules/.cache/engine-remote-dist');
const REMOTE_ASSETS = join(REMOTE_DIST, 'assets');
const REMOTE_DIST_EXISTS = existsSync(join(REMOTE_DIST, 'index.html')) && existsSync(REMOTE_ASSETS);
const REQUIRE_REMOTE_DIST = process.env.VERIFY_ENGINE_REMOTE_DIST === '1';

/** The generation core's own refusal text — present in the core, nowhere else. */
const CORE_NEEDLE = 'Unknown generation op';
/** The pipeline step registry's own refusals (src/generators/pipeline.js). */
const REGISTRY_NEEDLES = Object.freeze([
  'Circular dependency in pipeline at step',
  'Unknown pipeline step',
  'Pipeline pins: options.pins must be a plain object',
]);

const source = (rel) => readFileSync(join(ROOT, rel), 'utf8');
/** @param {string} code */
const exportNames = (code) => [
  ...[...code.matchAll(/^export\s+(?:async\s+)?(?:function|const|let)\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]),
  // the twin's string export names (`refuse as 'name'`), see localEngine.absent.js
  ...[...code.matchAll(/^\s+[A-Za-z_$][\w$]* as '([A-Za-z_$][\w$]*)',?$/gm)].map((m) => m[1]),
].sort();

/**
 * Drive the plugin's resolveId with a resolver that resolves relative specifiers by path.
 * @param {boolean} on
 * @param {string} spec
 * @param {string} importerRel
 */
async function resolveWith(on, spec, importerRel) {
  const plugin = /** @type {any} */ (engineAbsentWhenRemote(on));
  const importer = join(ROOT, importerRel);
  const ctx = { resolve: async (s, imp) => ({ id: resolve(dirname(imp), s.endsWith('.js') ? s : `${s}.js`) }) };
  return plugin.resolveId.call(ctx, spec, importer, {});
}

describe('the protection step — the mechanism', () => {
  it('a flagged build resolves the seam\'s two doors and the pipeline entry to the absent twin, and nothing else', async () => {
    expect(await resolveWith(true, './localEngine.js', 'src/lib/generationClient.js')).toBe(ABSENT);
    expect(await resolveWith(true, '../lib/localEngine.js', 'src/store/settlementGenerateAction.js')).toBe(ABSENT);
    expect(await resolveWith(true, '../lib/localPipeline.js', 'src/store/settlementRederiveAction.js')).toBe(ABSENT);
    expect(await resolveWith(true, '../generators/generateSettlementPipeline.js', 'src/store/settlementSlice.js')).toBe(ABSENT);
    expect(await resolveWith(true, '../generators/generateSettlementPipeline.js', 'src/workers/customContentPreview.worker.js')).toBe(ABSENT);
    // anchored: the five positive resolutions above prove the plugin acts on a flagged build, so these nulls are the plugin declining, not a plugin that never runs.
    expect(await resolveWith(true, './generationProtocol.js', 'src/lib/generationClient.js')).toBeNull();
    expect(await resolveWith(true, '../domain/worldPulse/applyWorldPulse.js', 'src/store/campaignWorldPulseSlice.js')).toBeNull();
  });

  it('an unflagged build resolves nothing (the build is the build it was)', async () => {
    // anchored: the arm above proves these exact specifiers ARE redirected when the flag is on.
    expect(await resolveWith(false, './localEngine.js', 'src/lib/generationClient.js')).toBeNull();
    expect(await resolveWith(false, '../lib/localPipeline.js', 'src/store/settlementRederiveAction.js')).toBeNull();
    expect(await resolveWith(false, '../generators/generateSettlementPipeline.js', 'src/store/settlementSlice.js')).toBeNull();
  });

  it('the build flag opens on exactly "true", like the client reads it', () => {
    const before = process.env.VITE_ENGINE_REMOTE;
    try {
      const reads = {};
      for (const value of ['true', 'TRUE', '1', 'yes', 'false', '']) {
        process.env.VITE_ENGINE_REMOTE = value;
        reads[value] = engineRemoteBuild('production');
      }
      delete process.env.VITE_ENGINE_REMOTE;
      reads.unset = engineRemoteBuild('production');
      expect(reads).toEqual({ true: true, TRUE: false, 1: false, yes: false, false: false, '': false, unset: false });
    } finally {
      if (before === undefined) delete process.env.VITE_ENGINE_REMOTE;
      else process.env.VITE_ENGINE_REMOTE = before;
    }
  });

  it('the absent twin carries the seam\'s two doors\' and the pipeline entry\'s whole export surface, and imports nothing', () => {
    const twin = source('src/lib/localEngine.absent.js');
    const twinNames = new Set(exportNames(twin));
    const owed = [
      ...exportNames(source('src/lib/localEngine.js')),
      ...exportNames(source('src/lib/localPipeline.js')),
      ...exportNames(source('src/generators/generateSettlementPipeline.js')),
    ];
    expect(owed.length).toBeGreaterThanOrEqual(10); // all three surfaces were read
    expect(owed.filter((name) => !twinNames.has(name))).toEqual([]);
    expect(twin).toContain("ENGINE_LOCAL_ABSENT_CODE = 'engine_local_absent'");
    // anchored: the file was read (the export surface above is non-empty); it must reach nothing.
    expect(twin).not.toMatch(/^\s*import\s/m);
    expect(twin).not.toMatch(/\bimport\s*\(/); // anchored: the same file read as the line above, its export surface proven non-empty; no dynamic import either.
  });

  it('the seam is the one src module that constructs the generation worker', () => {
    const files = [];
    const walk = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(js|jsx)$/.test(entry.name)) files.push(full);
      }
    };
    walk(SRC);
    expect(files.length).toBeGreaterThan(500); // the walk is not vacuous
    const constructors = files
      .filter((file) => /new URL\(\s*['"][./]*workers\/generation\.worker\.js['"]/.test(readFileSync(file, 'utf8')))
      .map((file) => file.slice(ROOT.length + 1));
    expect(constructors).toEqual(['src/lib/localEngine.js']);
  });
});

describe('the protection step — the flagged dist', () => {
  it('when VERIFY_ENGINE_REMOTE_DIST=1, the flagged dist exists (verify, not skip)', () => {
    expect(
      !REQUIRE_REMOTE_DIST || REMOTE_DIST_EXISTS,
      `VERIFY_ENGINE_REMOTE_DIST=1 but ${REMOTE_DIST} holds no build; make it with VITE_ENGINE_REMOTE=true npx vite build --outDir ${REMOTE_DIST} --emptyOutDir`,
    ).toBe(true);
  });

  describe.runIf(REMOTE_DIST_EXISTS)('read from the build', () => {
    const assets = REMOTE_DIST_EXISTS ? readdirSync(REMOTE_ASSETS) : [];
    const scripts = assets.filter((file) => /\.m?js$/.test(file));
    const carriers = (needle) => scripts.filter((file) => readFileSync(join(REMOTE_ASSETS, file), 'utf8').includes(needle));

    it('it is a real build that took the absent twin', () => {
      expect(scripts.length).toBeGreaterThan(100);
      expect(carriers('engine_local_absent').length).toBeGreaterThan(0);
    });

    it('no generation worker bundle is emitted', () => {
      // anchored: the arm above proves the asset list is a real, non-empty build.
      expect(assets.filter((file) => /^generation\.worker-.*\.js$/.test(file))).toEqual([]);
    });

    it('no chunk carries the generation core', () => {
      // anchored: the first arm proves `carriers` reads real chunks (it finds the twin's code).
      expect(carriers(CORE_NEEDLE)).toEqual([]);
    });

    it('no chunk carries the pipeline\'s step registry (unit 2: the re-derivation reaches it through the seam)', () => {
      // anchored: the first arm proves `carriers` reads real chunks; the three needles are the
      // registry's own refusals in src/generators/pipeline.js, carried by the engine chunk, the
      // generation worker and the preview worker in an unflagged build.
      expect(Object.fromEntries(REGISTRY_NEEDLES.map((needle) => [needle, carriers(needle)])))
        .toEqual(Object.fromEntries(REGISTRY_NEEDLES.map((needle) => [needle, []])));
    });
  });
});

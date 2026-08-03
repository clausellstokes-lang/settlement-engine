/**
 * tests/build/bootSmoke.test.js — the gate that runs scripts/boot-smoke.mjs.
 *
 * THE HOLE THIS CLOSES. Every other pin in tests/build/ reads dist/ as TEXT — chunk
 * names, byte sizes, `<link rel=modulepreload>` tags, which module ended up in which
 * chunk. Not one of them ever EVALUATES the bundle. So from a80c0be4 until lane BT
 * (2026-08-03) the shipped dist threw `Cannot access 'Ot' before initialization` out of
 * the entry chunk — 347 of 471 chunks dead, the app never mounting — while `npm run
 * build` exited 0, `postbuild` prerendered happily (it is Node-side over the route table),
 * and the whole vitest suite passed against `src/`. Reading a file proves nothing about
 * whether it runs. scripts/boot-smoke.mjs runs it; this file is how the estate's gate
 * asks it to.
 *
 * WHY A CHILD PROCESS. The script installs a jsdom-backed BROWSER environment over the
 * globals and replaces `process` with a browser-shaped shim (a bundled UMD dependency
 * that can read `process.versions.node` takes its Node branch and dereferences a `Buffer`
 * no browser bundle carries). Doing that inside a vitest worker would corrupt the runner.
 * It also imports all 471 chunks into one module registry, which must not leak into other
 * test files. So: spawn it, assert on its exit code, and print its own report on failure.
 *
 * WHY THE PURE-FUNCTION PINS BELOW. The dist stages can only speak after `npm run build`,
 * and they are `runIf(distExists)` per the tests/build convention — which means on a
 * pre-build run this file would otherwise assert NOTHING. The cycle finder, the static-
 * import parser and the entry resolver are therefore exercised directly, each with a
 * NEGATIVE CONTROL, so the machinery cannot pass by never detecting anything. The
 * incident's own 5-chunk cycle is frozen below as a synthetic graph: if `findChunkCycles`
 * ever stops seeing that shape, this reds with no build required.
 *
 * Anti-vacuity (the tests/build convention, mirrored from vendorPdfLazy/engineChunkLazy):
 * the dist stages silently no-op pre-build; under VERIFY_DIST=1 a missing dist/ is a HARD
 * failure, and `npm run check` runs `verify:dist` with that flag set.
 */

import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MIN_CHUNKS,
  entryChunkFromHtml,
  findChunkCycles,
  staticImportSpecifiers,
} from '../../scripts/boot-smoke.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
// BOOT_SMOKE_DIST points the gate at a build directory other than ./dist. It exists so
// this wrapper's RED path is provable: pointing it at a preserved broken build must fail
// the gate. Unset — always, in CI and in `npm run check` — it is plain ./dist.
const distDir = resolve(process.env.BOOT_SMOKE_DIST || join(ROOT, 'dist'));
const distExists = existsSync(distDir) && existsSync(join(distDir, 'assets'));
const requireDist = process.env.VERIFY_DIST === '1';

describe.runIf(requireDist)('boot smoke is not vacuously skipped', () => {
  it('dist/ + dist/assets exist when VERIFY_DIST=1 (a skipped boot gate is green-on-nothing)', () => {
    expect(distExists, 'VERIFY_DIST=1 but dist/assets is absent — run `npm run build` first').toBe(true);
  });
});

describe.runIf(distExists)('the built bundle boots', () => {
  it('scripts/boot-smoke.mjs passes against dist/ (acyclic chunk graph · every chunk initialises · the shell mounts)', () => {
    let report;
    try {
      report = execFileSync(
        process.execPath,
        ['--max-old-space-size=6144', join(ROOT, 'scripts', 'boot-smoke.mjs'), '--dist', distDir],
        { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 300_000 },
      );
    } catch (error) {
      const output = `${error.stdout || ''}${error.stderr || ''}`;
      throw new Error(
        'THE SHIPPED BUNDLE DOES NOT BOOT. `npm run build` exiting 0 does not mean the\n'
        + 'output evaluates: a chunk-level import cycle leaves ESM with no safe evaluation\n'
        + 'order, and a module-scope read of an imported const across it throws\n'
        + '"Cannot access X before initialization" before React ever renders. Read the\n'
        + 'stage report below — stage 1 names the cycle, stage 2 the throwing chunk and\n'
        + `line, stage 3 whether the shell mounted at all.\n\n${output}`,
        { cause: error },
      );
    }
    expect(report).toContain('PASS — the built bundle boots.');
  }, 320_000);
});

// ── The machinery itself — provable without a build ─────────────────────────

describe('the cycle finder cannot pass by detecting nothing', () => {
  // FROZEN: the exact chunk cycle that made dist un-bootable from a80c0be4 (lane BT).
  // engine-core reached into the LAZY engine chunk for magicFilter's two arcane
  // vocabularies, and engine reached back into engine-core for FACTION_ARCHETYPES.
  const INCIDENT_GRAPH = {
    'engine-core.js': ['engine.js', 'data.js', 'kernel.js'],
    'engine.js': ['engine-core.js', 'custom-registry.js', 'custom-schema.js', 'engine-core-lazy.js'],
    'custom-registry.js': ['custom-schema.js', 'engine-core.js'],
    'custom-schema.js': ['engine-core.js'],
    'engine-core-lazy.js': ['engine-core.js', 'custom-schema.js'],
    'data.js': [],
    'kernel.js': [],
    'index.js': ['engine-core.js', 'vendor-react.js'],
    'vendor-react.js': [],
  };

  it('finds the incident cycle (the 5 chunks that made dist un-bootable)', () => {
    const cycles = findChunkCycles(new Map(Object.entries(INCIDENT_GRAPH)));
    expect(cycles).toHaveLength(1);
    expect(cycles[0].sort()).toEqual([
      'custom-registry.js', 'custom-schema.js', 'engine-core-lazy.js',
      'engine-core.js', 'engine.js',
    ]);
  });

  it('reports nothing on the SAME graph with the one back-edge removed (the fix\'s shape)', () => {
    const fixed = { ...INCIDENT_GRAPH, 'engine-core.js': ['data.js', 'kernel.js'] };
    expect(findChunkCycles(new Map(Object.entries(fixed)))).toEqual([]);
  });

  it('finds a minimal two-node cycle, and clears a diamond that only looks like one', () => {
    expect(findChunkCycles(new Map([['a.js', ['b.js']], ['b.js', ['a.js']]]))).toHaveLength(1);
    // a → b → d, a → c → d. Shared descendant, no cycle.
    expect(findChunkCycles(new Map([
      ['a.js', ['b.js', 'c.js']], ['b.js', ['d.js']], ['c.js', ['d.js']], ['d.js', []],
    ]))).toEqual([]);
  });
});

describe('the static-import parser reads evaluation edges only', () => {
  it('counts static import / export-from, and NOT dynamic import()', () => {
    const source = [
      'import{a as x}from"./engine-core.js";',
      'import"./side-effect.js";',
      'import*as ns from"./ns.js";',
      'export{y}from"./reexport.js";',
      'export*from"./star.js";',
      'const load=()=>import("./lazy-leaf.js");',
      'function f(){return import("./another-lazy.js")}',
      'console.log(load,ns,x,f);',
    ].join('');
    const specs = staticImportSpecifiers(source);
    expect(specs).toEqual([
      './engine-core.js', './side-effect.js', './ns.js', './reexport.js', './star.js',
    ]);
    // The negative control that matters: a dynamic import is a LAZY boundary and imposes
    // no evaluation order, so counting it would report cycles that cannot break a boot.
    expect(specs).not.toContain('./lazy-leaf.js');
    expect(specs).not.toContain('./another-lazy.js');
  });
});

describe('the entry chunk is resolved from index.html, never guessed', () => {
  it('reads the module script tag', () => {
    const html = '<html><head><script type="module" crossorigin src="/assets/index-ABC123.js"></script>'
      + '<script type="application/ld+json">{}</script></head><body></body></html>';
    expect(entryChunkFromHtml(html)).toBe('index-ABC123.js');
  });

  it('throws rather than silently skipping when there is no module script', () => {
    expect(() => entryChunkFromHtml('<html><body><div id="root"></div></body></html>'))
      .toThrow(/no <script type="module"/);
  });

  it('keeps a non-trivial chunk floor so a partial build cannot green the gate', () => {
    expect(MIN_CHUNKS).toBeGreaterThanOrEqual(50);
  });
});

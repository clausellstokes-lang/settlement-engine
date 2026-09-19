/**
 * stepPresentationEngineFence.walker.test.js — THE RAIL'S WORDS STAY ON THE MAIN THREAD.
 *
 * `src/generators/steps/stepMetadata.js` holds two tables: `STEP_METADATA`, whose
 * `summary(ctx)` closures run INSIDE the generation worker, and `STEP_PRESENTATION`, the
 * 22 labels and 22 descriptions the Pipeline Rail prints. They were one table until the
 * worker-headroom car (2026-09-18) split them, because the worker reads
 * `metaForStep(name).summary` and nothing else — the packet it emits is
 * `{ id, index, summary }` — while the words rode into `dist/assets/generation.worker-*.js`
 * anyway, 2.9 kB of copy for a thread that never renders.
 *
 * ⛔ THE LAW IS WRITTEN IN THAT FILE AND, UNTIL THIS WALKER, NOTHING WALKED IT. A single
 * engine-side import puts all 2.9 kB back, silently: the bundle grows, the split reads as
 * maintained, and the only instrument that would notice is the byte ceiling in
 * tests/build/generationWorkerLazy.test.js — which is DIST-GATED, so it is mute on every
 * run that does not build, and which reports "over by N bytes" rather than naming the
 * module that did it. A prose law with no walker is the class this estate calls a promise.
 *
 * So the fence is a SOURCE-LEVEL scan, running on every plain suite: the only readers of
 * `STEP_PRESENTATION` outside its own module are under `src/components/`.
 *
 * ⚠ ANCHORED BOTH WAYS. A scan that finds nothing passes for two very different reasons —
 * the law holds, or the walk is broken and reads no files at all. So the arms below assert
 * that the sweep really read the engine trees (a file count floor plus a sentinel symbol
 * that IS there), and that `PipelineRail.jsx` is found as a live reader, before they assert
 * any absence.
 *
 * @enforced-by this test
 */

import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * THE TWO NAMES THE FENCE HOLDS, and it takes both on purpose. `STEP_PRESENTATION` is the
 * table; `presentationForStep` is the accessor, and the accessor is the LIVE DOOR — the rail
 * itself goes through it and never names the table, so a fence on the table alone would have
 * watched a name nothing in the tree uses while the real import path stood open.
 */
const SYMBOLS = ['STEP_PRESENTATION', 'presentationForStep'];

/** Where it is minted, and the one file allowed to name it outside the UI. */
const HOME = 'src/generators/steps/stepMetadata.js';

/**
 * The trees that become the generation worker's bundle. `src/domain` is deliberately NOT
 * here: the worker reaches only part of it, so a whole-tree ban would over-claim, and the
 * rail has no business in any of these five either way.
 */
const ENGINE_DIRS = ['src/generators', 'src/workers', 'src/lib', 'src/kernel', 'src/data'];

/** A symbol that IS in the engine trees, so "found nothing" cannot pass for the wrong reason. */
const SENTINEL = 'metaForStep';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.jsx?$/.test(entry)) out.push(p);
  }
  return out;
}

const rel = (p) => relative(ROOT, p).split('\\').join('/');

/** Every .js/.jsx file under `src/`, read once. */
const SOURCES = walk(join(ROOT, 'src')).map((p) => ({ path: rel(p), code: readFileSync(p, 'utf8') }));

const namesSymbol = (file) => SYMBOLS.some((symbol) => file.code.includes(symbol));

describe('the rail\'s words never cross into the generation worker (STEP_PRESENTATION fence)', () => {
  it('the walk really reads the engine trees, so an absence below means something', () => {
    // ANCHOR 1: the sweep found files at all, in every tree it claims to cover.
    for (const dir of ENGINE_DIRS) {
      const seen = SOURCES.filter((f) => f.path.startsWith(`${dir}/`));
      expect(seen.length, `${dir} contributed no files to the walk`).toBeGreaterThan(0);
    }
    expect(SOURCES.length, 'the src walk is implausibly small').toBeGreaterThan(500);
    // ANCHOR 2: a symbol that IS in the engine trees is found there, so the matcher works.
    const sentinelHits = SOURCES
      .filter((f) => ENGINE_DIRS.some((d) => f.path.startsWith(`${d}/`)) && f.code.includes(SENTINEL))
      .map((f) => f.path);
    expect(sentinelHits, `the sentinel ${SENTINEL} vanished from the engine trees`)
      .toContain('src/workers/generationRequest.js');
  });

  it('PipelineRail is a live reader, so the fence is guarding something that exists', () => {
    // ANCHOR 3: if the table had been deleted or renamed, every absence arm below would
    // pass vacuously. The rail must still read it, by name, on the main thread.
    const rail = SOURCES.find((f) => f.path === 'src/components/PipelineRail.jsx');
    expect(rail, 'src/components/PipelineRail.jsx is gone').toBeTruthy();
    expect(rail.code, 'PipelineRail no longer reaches stepMetadata.js').toContain('stepMetadata.js');
    expect(rail.code, 'PipelineRail no longer resolves a step\'s words').toContain('presentationForStep');
    const home = SOURCES.find((f) => f.path === HOME);
    expect(home, `${HOME} is gone`).toBeTruthy();
    expect(home.code, `${HOME} no longer mints the table`).toContain('export const STEP_PRESENTATION = ');
    expect(home.code, `${HOME} no longer exports the accessor`)
      .toContain('export function presentationForStep(');
  });

  it('no module in the engine trees names the table or its accessor', () => {
    const offenders = SOURCES
      .filter((f) => ENGINE_DIRS.some((d) => f.path.startsWith(`${d}/`)))
      .filter((f) => f.path !== HOME)
      .filter(namesSymbol)
      .map((f) => f.path);
    expect(
      offenders,
      `${offenders.join(', ')} reaches ${SYMBOLS.join(' or ')}. Those trees become the worker's `
      + 'bundle, and one reference there puts all 22 labels and 22 descriptions (2.9 kB) back '
      + 'into it for a thread that renders nothing. The worker reads meta.summary and emits '
      + '{ id, index, summary }; map the id to its words on the main thread, where the rail is.',
    ).toEqual([]);
  });

  it('every reader outside stepMetadata.js is a component, and today that is the rail alone', () => {
    // The stronger statement, and the one that survives a new tree appearing under src/:
    // the ban above names five directories, this arm names the one that is ALLOWED.
    const readers = SOURCES.filter((f) => f.path !== HOME).filter(namesSymbol).map((f) => f.path);
    // ⭐ EXACT, NOT A SUBSET. The rail is the only reason either name exists, and a second
    // reader is a design question (two surfaces printing the pipeline) rather than a typo —
    // it should red here and be admitted deliberately, not arrive unannounced.
    expect(
      readers,
      'the readers of the rail\'s words moved. One of them is the rail; a new one needs a reason.',
    ).toEqual(['src/components/PipelineRail.jsx']);
    const nonComponents = readers.filter((path) => !path.startsWith('src/components/'));
    expect(
      nonComponents,
      `${nonComponents.join(', ')} reads the rail's words from outside src/components/. They are `
      + 'main-thread presentation; a reader anywhere else is either a byte regression in the '
      + 'generation worker or a surface that should be taking presentationForStep() instead.',
    ).toEqual([]);
  });
});

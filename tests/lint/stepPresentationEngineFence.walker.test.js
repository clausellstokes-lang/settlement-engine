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
 * ⛔ AND IT REFUSES THE WHOLESALE FORMS, BECAUSE A NAME-GREP ALONE IS NOT A FENCE. Review 12
 * (2026-09-18) found the hole while the tree was still clean of it: an engine module can take
 * BOTH tables without ever writing either name -
 *
 *     export * from './stepMetadata.js';                  // a barrel re-export
 *     import * as stepMeta from './stepMetadata.js';      // a namespace import
 *     const stepMeta = await import('./stepMetadata.js'); // the same namespace, lazily
 *
 * A namespace object is a reference to every export, so rollup keeps `STEP_PRESENTATION` and
 * the 2.9 kB returns with the symbol arms still green. The third form is here with the other
 * two on purpose: it splits rather than inlines, so it would not move the bundle ceiling at
 * all - which makes it the QUIETEST of the three, and a new worker lazy edge is a byte decision
 * of its own (the WORKER_LAZY_EDGES table in tests/build/generationWorkerLazy.test.js is frozen
 * at one row and says so).
 *
 * ⛔ AND THE SPECIFIER IS NOT ALWAYS A QUOTED STRING, which review 13 (2026-09-18) probed and
 * the first cut of these arms missed. Two more shapes read past a quote-anchored matcher:
 *
 *     await import(`./stepMetadata.js`);   // a BACKTICK specifier, no substitution
 *     await import(specifier);             // a COMPUTED specifier, resolvable only at runtime
 *
 * The first is now matched like its quoted twins. The second cannot be: no grep can say what
 * `specifier` holds. So it is met with a MEASUREMENT instead of a matcher - the engine dirs
 * carry 24 dynamic imports and EVERY ONE of them is a plain string literal, so the population
 * of computed specifiers there is ZERO and is frozen at zero below.
 *
 * ⚠ THAT FLOOR IS A REGISTER, NOT A NEW PROHIBITION, and the distinction is deliberate: this
 * lane found no walker governing computed specifiers anywhere in src/, so banning them outright
 * across five directories is not a fence's call to make. What the arm says is narrower and true:
 * today there are none, one would be the only shape that could reach this module invisibly, and
 * the first to land must be named and read rather than arrive unannounced.
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

/**
 * THE WHOLESALE FORMS, which take every export at once and name none of them.
 * Each is anchored on the module's own path so an unrelated `export *` is not caught.
 */
const HOME_SPECIFIER = /['"`][^'"`]*stepMetadata\.js['"`]/.source;
const STAR_REEXPORT = new RegExp(`export\\s*\\*(?:\\s+as\\s+\\w+)?\\s*from\\s*${HOME_SPECIFIER}`);
const NAMESPACE_IMPORT = new RegExp(
  `import\\s*\\*\\s*as\\s+\\w+\\s*from\\s*${HOME_SPECIFIER}`
  + `|\\bimport\\s*\\(\\s*${HOME_SPECIFIER}\\s*\\)`,
);

/** A dynamic import whose whole specifier is a plain string literal, backticks included. */
const LITERAL_DYNAMIC = /^\s*import\s*\(\s*(?:'[^']*'|"[^"]*"|`[^`$\\]*`)\s*[,)]/;
/** Every `import(` opening, opaque ones included — the idiom the dist ceiling test uses. */
const DYNAMIC_OPENING = /\bimport\s*\(/g;

/** Source with comments stripped, so a matcher never answers to a code sample in prose. */
const bodyOf = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/**
 * Dynamic imports in `code` whose specifier is NOT a plain string literal.
 * @returns {string[]} the opening of each offending call, for the failure message
 */
function computedDynamicImports(code) {
  const body = bodyOf(code);
  const out = [];
  for (const match of body.matchAll(DYNAMIC_OPENING)) {
    const tail = body.slice(match.index, match.index + 240);
    if (!LITERAL_DYNAMIC.test(tail)) out.push(tail.split('\n')[0].trim().slice(0, 100));
  }
  return out;
}

/** Files in the engine trees, minus the module the tables live in. */
const engineFiles = () => SOURCES
  .filter((f) => ENGINE_DIRS.some((d) => f.path.startsWith(`${d}/`)))
  .filter((f) => f.path !== HOME);

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

  it('no module in the engine trees RE-EXPORTS stepMetadata.js wholesale', () => {
    // ANCHOR: the matcher fires on the shape it claims to refuse, so an empty result below
    // is the law holding rather than a regex that matches nothing.
    expect(STAR_REEXPORT.test("export * from './stepMetadata.js';"), 'the matcher is dead').toBe(true);
    expect(STAR_REEXPORT.test("export * as steps from '../generators/steps/stepMetadata.js';"))
      .toBe(true);
    // ...and it is ANCHORED ON THIS MODULE, so an unrelated barrel line is not swept up.
    expect(STAR_REEXPORT.test("export * from './pipeline.js';"), 'the matcher is too broad')
      .toBe(false);

    const offenders = engineFiles().filter((f) => STAR_REEXPORT.test(f.code)).map((f) => f.path);
    expect(
      offenders,
      `${offenders.join(', ')} re-exports stepMetadata.js with \`export *\`. A star re-export `
      + 'carries STEP_PRESENTATION into the generation worker without naming it, so the symbol '
      + 'arms above stay green while the 2.9 kB comes back. Re-export the two names the engine '
      + 'uses (metaForStep, STEP_METADATA) instead of the module.',
    ).toEqual([]);
  });

  it('no module in the engine trees takes stepMetadata.js as a NAMESPACE', () => {
    // ANCHOR: both namespace shapes, static and dynamic, match; an unrelated module does not.
    expect(NAMESPACE_IMPORT.test("import * as m from './stepMetadata.js';"), 'static form')
      .toBe(true);
    expect(NAMESPACE_IMPORT.test("const m = await import('../generators/steps/stepMetadata.js');"),
      'dynamic form').toBe(true);
    expect(NAMESPACE_IMPORT.test("import * as m from './pipeline.js';"), 'too broad').toBe(false);

    const offenders = engineFiles().filter((f) => NAMESPACE_IMPORT.test(f.code)).map((f) => f.path);
    expect(
      offenders,
      `${offenders.join(', ')} takes stepMetadata.js as a namespace object. A namespace is a `
      + 'reference to EVERY export, so rollup keeps STEP_PRESENTATION and the rail\'s words ride '
      + 'into the worker unnamed. Import the bindings the engine actually uses.',
    ).toEqual([]);
  });

  it('no dynamic import in the engine trees has a COMPUTED specifier', () => {
    // ANCHOR BOTH WAYS. The three literal shapes are accepted and the two opaque ones are
    // refused, so neither an empty result nor a full one can come from a dead matcher.
    expect(computedDynamicImports("await import('./a.js');"), 'single quotes').toEqual([]);
    expect(computedDynamicImports('await import("./a.js");'), 'double quotes').toEqual([]);
    expect(computedDynamicImports('await import(`./a.js`);'), 'backticks').toEqual([]);
    expect(computedDynamicImports('await import(spec);'), 'a variable').toHaveLength(1);
    expect(computedDynamicImports('await import(`./${name}.js`);'), 'a substitution')
      .toHaveLength(1);
    // ...and it does not answer to a code sample sitting in a comment.
    expect(computedDynamicImports('// await import(spec);\nconst x = 1;'), 'prose').toEqual([]);

    // ANCHOR ON THE POPULATION: the sweep must still SEE the literal dynamic imports it is
    // measuring against, or "zero computed" would be true of a walk that read nothing.
    const literalSites = engineFiles()
      .concat(SOURCES.filter((f) => f.path === HOME))
      .reduce((n, f) => n + (bodyOf(f.code).match(DYNAMIC_OPENING) || []).length, 0);
    expect(literalSites, 'the engine dirs lost their dynamic imports, so this arm measures nothing')
      .toBeGreaterThanOrEqual(20);

    const offenders = engineFiles()
      .flatMap((f) => computedDynamicImports(f.code).map((site) => `${f.path}: ${site}`));
    expect(
      offenders,
      `${offenders.join(' | ')} — a dynamic import whose specifier is computed. THIS IS A `
      + 'REGISTER, NOT A BAN: the engine dirs carry no computed specifier today, and one is the '
      + 'only shape that could pull stepMetadata.js (and STEP_PRESENTATION with it) into the '
      + 'generation worker without any grep in this file being able to say so. Name it here with '
      + 'a reason and confirm it cannot resolve stepMetadata.js.',
    ).toEqual([]);
  });

  it('every reader outside stepMetadata.js is a component, and today that is the rail alone', () => {
    // The stronger statement, and the one that survives a new tree appearing under src/:
    // the ban above names five directories, this arm names the one that is ALLOWED.
    const readers = SOURCES
      .filter((f) => f.path !== HOME)
      .filter((f) => namesSymbol(f) || STAR_REEXPORT.test(f.code) || NAMESPACE_IMPORT.test(f.code))
      .map((f) => f.path);
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

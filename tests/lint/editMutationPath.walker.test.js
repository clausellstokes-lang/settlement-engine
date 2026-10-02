/**
 * editMutationPath.walker.test.js — THE ONE-MUTATION-PATH WALKER (EM-C4a, cases A4 and A5).
 *
 * THE LAW (design 2.3): "Ops apply only through the existing store writers via the lazy
 * application-command boundary the Surveyor already uses; THERE IS NO SECOND PATH."
 * Runtime cannot enforce that: a component that imported `makeOp` and reached a writer
 * directly would work perfectly and would be a second mutation path forever. This
 * walker is that missing gate.
 *
 * THE PREDICATE. Every `src/` module that STATICALLY imports `makeOp`, `validateOp` or
 * `OP_TYPES` from `src/domain/edit/operations.js`, or `applyEdit` from
 * `src/domain/edit/dmLayer.js`, must be a DECLARED member of the edit path (the
 * adapter, the lazy runtime, the store leaf) or a DECLARED read-only consumer.
 * Anything else is convicted BY NAME.
 *
 * ⛔ THE WATCHED SYMBOLS ARE JOINED TO THEIR PRODUCERS, never merely spelled here: each
 * one is asserted to be a real export of the module it names
 * (tests/lint/contractTestAntiVacuity.walker.test.js Rule 2), so a renamed export
 * cannot leave this walker watching a word that no longer exists.
 *
 * ⛔ A DYNAMIC IMPORT IS NOT AN EDGE. The lazy boundary is the design's own seam and
 * the first-paint budget depends on it, so `await import(...)` is deliberately not
 * convicted — P4 below is the control that keeps that deliberate.
 *
 * CANNOT-CATCH (declared costs of a source gate):
 *   1. A writer that reaches the layer through more than one re-export hop. One hop is
 *      resolved; a second degrades to an unresolved specifier, which is loud rather
 *      than silent.
 *   2. A module that mutates the settlement record WITHOUT naming either producer.
 *      That is the pre-existing estate's problem and operationRegistry's census, not
 *      this walker's.
 *   3. A kind assembled at runtime by string concatenation, which nothing in src/ does.
 *
 * @enforced-by this test
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import * as dmLayer from '../../src/domain/edit/dmLayer.js';
import * as operations from '../../src/domain/edit/operations.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC_DIR = join(REPO_ROOT, 'src');

/** The two producers of the op boundary, and the symbols that REACH a mutation. */
const WATCHED = Object.freeze({
  'src/domain/edit/operations.js': Object.freeze(['makeOp', 'validateOp', 'OP_TYPES']),
  'src/domain/edit/dmLayer.js': Object.freeze(['applyEdit']),
});

/** The live modules behind those names, so the roster cannot watch a dead word. */
const PRODUCER_MODULES = Object.freeze({
  'src/domain/edit/operations.js': operations,
  'src/domain/edit/dmLayer.js': dmLayer,
});

/**
 * THE DECLARED EDIT PATH, frozen. This is a review gate, not a ban: a fourth member is
 * legal, but adding it here is the moment someone checks whether the new file can reach
 * a store writer outside the one application-command boundary.
 */
const EDIT_PATH = Object.freeze([
  'src/application/commands/adapters/plainEditApply.js',
  'src/application/commands/plainEditRuntime.js',
  'src/store/editSlice.js',
]);

/** Declared READ-ONLY consumers: a module that reads the vocabulary and writes nothing.
 *  EMPTY today, and an addition here is a declaration that the module never mutates. */
const READ_ONLY_CONSUMERS = Object.freeze([]);

/** The store leaf's import list. ⭐ EM-C4b WIDENS IT IN PLACE, BY ADDITION AND NEVER BY
 *  DELETION: the registry half reaches EM-C1's pure verbs and EM-C2's engine, and both edges
 *  are STATIC because `selectGuards` is a synchronous memoized read that an `await` cannot
 *  serve. Neither costs a first-paint byte — this leaf is in no eager closure, which its own
 *  membership probe proves by importing the exported set. The command runtime the judgment-264
 *  binder reaches is NOT here and must not be: that edge is DYNAMIC, the estate's own store
 *  idiom, and the list stays EXACT in both directions so a rename helper, a component, a
 *  generator or a second cascade would show up HERE first. */
const EDIT_SLICE_IMPORTS = Object.freeze([
  '../domain/campaign/canon.js',
  '../domain/edit/dmLayer.js',
  '../domain/edit/fieldDeclarations.js',
  '../domain/edit/guards.js',
  '../domain/edit/operations.js',
  '../domain/edit/registry.js',
]);

/** Every .js/.jsx under src/, repo-relative with forward slashes. */
function sourceFiles() {
  const found = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.jsx?$/.test(entry.name)) found.push(relative(REPO_ROOT, full).split('\\').join('/'));
    }
  })(SRC_DIR);
  return found.sort();
}

/** The scanned tree as {path -> source}. */
function readTree() {
  return new Map(sourceFiles().map((rel) => [rel, readFileSync(join(REPO_ROOT, rel), 'utf8')]));
}

/**
 * STATIC named-import edges only. `await import(...)` carries no `from` clause and is
 * therefore invisible to this reader BY CONSTRUCTION, which is the lazy boundary.
 * @param {string} rel @param {string} source
 * @returns {{module: string, names: string[]}[]} module paths repo-relative
 */
function staticNamedEdges(rel, source) {
  return [...source.matchAll(/^import\s*\{([^}]*)\}\s*from\s*'(\.[^']+)';$/gm)].map((hit) => ({
    module: posix.normalize(posix.join(posix.dirname(rel), hit[2])),
    names: hit[1].split(',').map((name) => name.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean),
  }));
}

/**
 * THE PREDICATE, as a pure function of a tree, so the plants below drive the very code
 * the live arm drives.
 * @param {Map<string, string>} tree
 * @returns {string[]} `file -> module#symbol`, sorted
 */
function mutationPathOffenders(tree) {
  return [...tree.entries()]
    .filter(([rel]) => !EDIT_PATH.includes(rel) && !READ_ONLY_CONSUMERS.includes(rel))
    .flatMap(([rel, source]) => staticNamedEdges(rel, source)
      .filter((edge) => Object.hasOwn(WATCHED, edge.module))
      .flatMap((edge) => edge.names
        .filter((name) => WATCHED[edge.module].includes(name))
        .map((name) => `${rel} -> ${edge.module}#${name}`)))
    .sort();
}

/**
 * The eager-membership reader A5's mutant drives: which files of a tree STATICALLY
 * import `target` while the supplied predicate calls them eager.
 * @param {string} target @param {Map<string,string>} tree @param {(rel:string)=>boolean} isEager
 */
function eagerStaticImportersOf(target, tree, isEager) {
  return [...tree.entries()]
    .filter(([rel]) => isEager(rel))
    .filter(([rel, source]) => staticNamedEdges(rel, source).some((edge) => edge.module === target))
    .map(([rel]) => rel)
    .sort();
}

describe('EM-C4a — ONE MUTATION PATH (no second writer of a settlement edit)', () => {
  it('A4 — every watched symbol is a REAL export of the producer this walker names', () => {
    const missing = Object.entries(WATCHED).flatMap(([module, names]) => names
      .filter((name) => PRODUCER_MODULES[module][name] === undefined)
      .map((name) => `${module}#${name}`));
    // anchored: the same read finds the four symbols that ARE there, so an emptied
    // roster cannot make this arm pass by watching nothing at all.
    expect(Object.values(WATCHED).flat().length).toBe(4);
    expect(missing).toEqual([]);
  });

  it('A4 — P5 anti-vacuity: the scanned denominator is non-empty and contains the real adapter', () => {
    const tree = readTree();
    expect(tree.size).toBeGreaterThanOrEqual(200);
    expect(tree.has('src/application/commands/adapters/plainEditApply.js')).toBe(true);
    expect(tree.has('src/store/editSlice.js')).toBe(true);
    expect(tree.has('src/application/commands/plainEditRuntime.js')).toBe(true);
  });

  it('A4 — P1 and P2: a planted second writer in the store and in a component are both convicted by name', () => {
    const planted = new Map([
      ['src/store/__plantedSecondWriter.js', "import { applyEdit } from '../domain/edit/dmLayer.js';\nexport const x = applyEdit;\n"],
      ['src/components/__plantedPencil.jsx', "import { makeOp } from '../domain/edit/operations.js';\nexport const y = makeOp;\n"],
    ]);
    expect(mutationPathOffenders(planted)).toEqual([
      'src/components/__plantedPencil.jsx -> src/domain/edit/operations.js#makeOp',
      'src/store/__plantedSecondWriter.js -> src/domain/edit/dmLayer.js#applyEdit',
    ]);
  });

  it('A4 — P3 and P4: the real adapter and a DYNAMIC import of the layer are cleared', () => {
    const adapter = 'src/application/commands/adapters/plainEditApply.js';
    const runtime = 'src/application/commands/plainEditRuntime.js';
    const cleared = new Map([
      [adapter, readFileSync(join(REPO_ROOT, adapter), 'utf8')],
      [runtime, "const m = await import('../domain/edit/dmLayer.js');\nexport const z = m;\n"],
      // The same lazy edge from an UNDECLARED path: not convicted either, because it is
      // the DYNAMIC form that is cleared and not merely the declared membership.
      ['src/store/__plantedLazyReader.js', "const m = await import('../domain/edit/dmLayer.js');\nexport const w = m;\n"],
    ]);
    expect(mutationPathOffenders(cleared)).toEqual([]);
    // anchored: the same reader, driven over the same undeclared path with the STATIC
    // form, does convict - so the clearance above measures the lazy boundary and not a
    // scanner that sees nothing.
    const staticForm = new Map([
      ['src/store/__plantedLazyReader.js', "import { applyEdit } from '../domain/edit/dmLayer.js';\nexport const w = applyEdit;\n"],
    ]);
    expect(mutationPathOffenders(staticForm))
      .toEqual(['src/store/__plantedLazyReader.js -> src/domain/edit/dmLayer.js#applyEdit']);
  });

  it('A4 — THE LIVE TREE: no src/ module outside the declared edit path reaches an op or the layer', () => {
    const offenders = mutationPathOffenders(readTree());
    // A module convicted here is a SECOND MUTATION PATH. Route it through the one
    // application-command boundary, or declare it a read-only consumer above and say
    // in the same breath why it can never write. Widening WATCHED is not a legal move.
    expect(
      offenders,
      `\nsrc/ modules reaching the op boundary outside the declared edit path:\n  ${offenders.join('\n  ')}\n`,
    ).toEqual([]);
  });

  it('A5 — the store leaf imports EXACTLY the six declared modules, so neither the cascade branch nor the registry half adds an unlisted import edge', () => {
    const source = readFileSync(join(REPO_ROOT, 'src/store/editSlice.js'), 'utf8');
    const specifiers = [...source.matchAll(/^import[\s\S]*?from '([^']+)';$/gm)].map((hit) => hit[1]).sort();
    // A rename helper, a component or a second cascade would show up HERE first: the
    // free-cascade branch resolves its writer off `get()` BY NAME, which is what keeps
    // the first-paint claim true by construction rather than by measurement luck.
    expect(specifiers).toEqual([...EDIT_SLICE_IMPORTS]);
  });

  it('A5 — MUTANT: a fabricated EAGER static importer of the store leaf is caught, and a DYNAMIC one is not', () => {
    const target = 'src/store/editSlice.js';
    const fabricated = new Map([
      [target, 'export const applyPlainEditToDraft = () => null;\n'],
      ['src/fake/eagerOffender.js', "import { applyPlainEditToDraft } from '../store/editSlice.js';\nexport const a = applyPlainEditToDraft;\n"],
      ['src/fake/lazyConsumer.js', "const m = await import('../store/editSlice.js');\nexport const b = m;\n"],
    ]);
    // Both fabricated consumers are called EAGER, so the only thing that separates them
    // is the form of the edge - which is exactly what vite.config.js's own graph walks
    // ("a dynamic import stays a lazy boundary", its comment).
    expect(eagerStaticImportersOf(target, fabricated, (rel) => rel.startsWith('src/fake/')))
      .toEqual(['src/fake/eagerOffender.js']);
  });
});

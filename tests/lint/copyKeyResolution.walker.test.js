/**
 * copyKeyResolution.walker.test.js — EVERY LITERAL COPY KEY NAMED IN src/ STILL
 * RESOLVES.
 *
 * THE CLASS. `t()` returns the KEY STRING when it cannot resolve one (copy/index.js:
 * "a typo renders the harmless key text rather than taking down the page"). That is
 * the right call at runtime and it means a DELETED key and a LIVE key are the same
 * to every instrument in this repo: nothing throws, nothing reds, and the dotted path
 * ships to a reader. It shipped on 2026-09-19 — the Create page's Founder card
 * printed `pricing.tiers.founder.priceLabel` and `pricing.tiers.founder.priceSub` in
 * its price slot for as long as the keys had been deleted (ODQ §934.22 item 1).
 *
 * THE WALK. Parse every source file under src/, resolve the LOCAL names bound to the
 * copy accessors by their imports — `t`/`tx`/`tOptional` from copy/index.js, `tp`
 * from copy/pricingPage.js, `tl` from copy/landing.js — and for every call of one of
 * them with a STRING-LITERAL first argument, resolve that key against the table the
 * accessor actually reads. A key that resolves to `undefined` is a violation.
 *
 * ⛔ IMPORT-BOUND, NOT NAME-MATCHED, AND THAT IS THE WHOLE DIFFERENCE BETWEEN THIS
 * AND A grep. `t` is one character: it is a reduce accumulator, a loop variable, a
 * tuple element and a destructured prop all over this tree, and a walker that matched
 * on the spelling would report a hundred phantom keys and be turned off within a
 * week. Only a call whose callee is a name this file IMPORTED from a copy module
 * counts, and the local spelling is taken from the import (an `as` rename is
 * followed). A file that shadows the imported name with a local binding is dropped
 * from that name's scan rather than guessed at.
 *
 * ⚠ WHAT IT CANNOT SEE, SAID PLAINLY. A key built from a template
 * (`pricing.tiers.${tier.key}.priceLabel`) has no literal to resolve, and the defect
 * above was exactly that shape. Those are COUNTED and held to a floor — so the walk
 * cannot silently stop finding them — but they are not asserted, because their value
 * is not in the source. The instrument that catches a dynamic key is the RENDER
 * scan, tests/components/copyRawKeyRender.test.jsx, which reads text nodes and
 * refuses a dotted path at a reader. The two are siblings and neither subsumes the
 * other.
 *
 * ⚠ AND `tOptional` IS EXEMPT BY CONSTRUCTION. Its contract is that absence is a
 * legitimate answer (copy/index.js), so an unresolvable key there is not a defect —
 * it is the feature. Its call sites are counted, never asserted.
 */

import { describe, expect, test } from 'vitest';
import { parse } from 'espree';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { en } from '../../src/copy/index.js';
import { pricingPage } from '../../src/copy/pricingPage.js';
import { landing } from '../../src/copy/landing.js';

/** The repo root under vitest. NOT `import.meta.url` — a jsdom env rewrites it to /@fs/…. */
const ROOT = process.cwd();

/**
 * The accessors, keyed by the module they come from and the exported name, each with
 * the table it reads. `tOptional` carries `table: null` — counted, never asserted.
 */
const ACCESSORS = Object.freeze({
  'copy/index.js': {
    t: { table: en, asserted: true },
    tx: { table: en, asserted: true },
    tOptional: { table: en, asserted: false },
  },
  'copy/pricingPage.js': { tp: { table: pricingPage, asserted: true } },
  'copy/landing.js': { tl: { table: landing, asserted: true } },
});

/**
 * Does this import specifier name one of the copy modules above?
 *
 * Matched on the `copy/<file>` TAIL only. A bare `./index.js` is deliberately NOT
 * admitted: it is the commonest specifier in the tree and mapping it here would hand
 * every barrel import in src/ the copy registry's tables.
 */
function copyModuleOf(source) {
  for (const mod of Object.keys(ACCESSORS)) {
    if (source === `../${mod}` || source.endsWith(`/${mod}`)) return mod;
  }
  return null;
}

/** Resolve a dotted key against a nested table. copy/index.js `resolve`, restated. */
function resolveKey(table, dotted) {
  let cur = table;
  for (const part of dotted.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[part];
  }
  return cur;
}

/** Every .js/.jsx under `dir`. */
function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSource(p, out);
    else if (/\.jsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

function parseSource(src) {
  return parse(src, { ecmaVersion: 2024, sourceType: 'module', loc: true, ecmaFeatures: { jsx: true } });
}

/** Depth-first, `parent` threaded on the way down (the phone-floor census's walk). */
function eachNode(ast, visit) {
  const stack = [{ node: ast, parent: null }];
  while (stack.length) {
    const { node, parent } = stack.pop();
    if (!node || typeof node.type !== 'string') continue;
    node.parent = parent;
    visit(node);
    for (const key in node) {
      if (key === 'loc' || key === 'range' || key === 'parent') continue;
      const v = node[key];
      if (Array.isArray(v)) {
        for (const child of v) if (child && typeof child.type === 'string') stack.push({ node: child, parent: node });
      } else if (v && typeof v.type === 'string') {
        stack.push({ node: v, parent: node });
      }
    }
  }
}

/**
 * The copy accessors this file imported, as localName → { table, asserted, exported }.
 * A local name the file ALSO declares itself (`const t = …`, a parameter named `t`) is
 * dropped: the calls would be that binding's, not the registry's.
 */
function accessorsBoundIn(ast, src) {
  /** @type {Map<string, {table: any, asserted: boolean, exported: string}>} */
  const bound = new Map();
  for (const node of ast.body) {
    if (node.type !== 'ImportDeclaration') continue;
    const mod = copyModuleOf(String(node.source.value));
    if (!mod) continue;
    for (const spec of node.specifiers) {
      if (spec.type !== 'ImportSpecifier') continue;
      const exported = spec.imported?.name;
      const entry = ACCESSORS[mod]?.[exported];
      if (entry) bound.set(spec.local.name, { ...entry, exported });
    }
  }
  // Shadowing guard — cheap and deliberately conservative: any other binding of the
  // same spelling anywhere in the file retires it from the scan.
  for (const local of [...bound.keys()]) {
    const shadow = new RegExp(
      `(?:const|let|var|function)\\s+${local}\\b|\\b${local}\\s*=>|\\(\\s*${local}\\s*[,)]`,
    );
    if (shadow.test(src)) bound.delete(local);
  }
  return bound;
}

/**
 * Scan one source file.
 * @returns {{ unresolved: string[], literals: number, dynamic: number, optional: number }}
 */
export function scanCopyKeys(src, rel) {
  const found = { unresolved: [], literals: 0, dynamic: 0, optional: 0 };
  let ast;
  // A parse failure THROWS: a scanner that silently drops what it cannot read is the
  // vacuity this walk exists against.
  try { ast = parseSource(src); } catch (e) {
    throw new Error(`${rel} did not parse: ${e.message}`, { cause: e });
  }
  const bound = accessorsBoundIn(ast, src);
  if (bound.size === 0) return found;

  eachNode(ast, (node) => {
    if (node.type !== 'CallExpression' || node.callee?.type !== 'Identifier') return;
    const entry = bound.get(node.callee.name);
    if (!entry) return;
    const arg = node.arguments[0];
    if (!arg) return;
    if (arg.type !== 'Literal' || typeof arg.value !== 'string') {
      found.dynamic += 1;                                    // a template key: not in the source
      return;
    }
    if (!entry.asserted) { found.optional += 1; return; }    // absence is the contract
    found.literals += 1;
    if (resolveKey(entry.table, arg.value) === undefined) {
      found.unresolved.push(`${rel}:${arg.loc.start.line}  ${entry.exported}('${arg.value}')`);
    }
  });
  return found;
}

function scanTree() {
  const all = { unresolved: [], literals: 0, dynamic: 0, optional: 0, files: 0 };
  for (const abs of walkSource(join(ROOT, 'src')).sort()) {
    const rel = relative(ROOT, abs).replace(/\\/g, '/');
    const one = scanCopyKeys(readFileSync(abs, 'utf8'), rel);
    all.unresolved.push(...one.unresolved);
    all.literals += one.literals;
    all.dynamic += one.dynamic;
    all.optional += one.optional;
    all.files += 1;
  }
  return all;
}

const SCAN = scanTree();

describe('THE COPY REGISTRY — every literal key a component names still resolves', () => {
  test('the walk is live: it parsed the tree and found keys to resolve', () => {
    // ⛔ ANTI-VACUITY. The assertion below is `toEqual([])`, which a scanner that
    // stopped finding calls also satisfies. These floors are the MEASUREMENT at
    // landing (2026-09-19: 2,230 source files, 539 literal keys resolved, 40 built
    // from templates), tightened toward reality and never relaxed to admit a
    // regression. Seven files are dropped by the shadowing guard, which is why the
    // literal floor sits under the count rather than on it.
    expect(SCAN.files, 'the src tree is empty — has it moved?').toBeGreaterThanOrEqual(2200);
    expect(SCAN.literals, 'the walk resolved almost no literal keys — the import binding broke')
      .toBeGreaterThanOrEqual(520);
    expect(SCAN.dynamic, 'the walk saw no template-built keys — it used to see dozens')
      .toBeGreaterThanOrEqual(35);
  });

  test('no source file names a copy key the registry cannot answer', () => {
    expect(
      SCAN.unresolved,
      `\n${SCAN.unresolved.length} copy key(s) named in src/ resolve to nothing. `
      + '`t()` renders the KEY at the reader when it cannot resolve one, so each of these '
      + 'is a dotted path waiting to appear on a page.\n'
      + 'Either restore the key in its registry, or — when the key was deleted by a ruling '
      + 'and its absence is the fact — read it through `tOptional()` and give the surface '
      + 'real words for the empty case:\n'
      + `${SCAN.unresolved.join('\n')}\n`,
    ).toEqual([]);
  });

  test('the detectors discriminate, and the bindings are really followed (executed controls)', () => {
    // Each control is a source string this file parses for real.
    const live = scanCopyKeys(
      "import { t } from '../copy/index.js';\nexport const A = () => t('common.save');\n", 'control.js',
    );
    expect(live.unresolved, 'a key that DOES resolve is reported as missing').toEqual([]);
    expect(live.literals, 'a resolving key was not counted').toBe(1);

    const dead = scanCopyKeys(
      "import { t } from '../copy/index.js';\nexport const A = () => t('pricing.tiers.founder.priceLabel');\n",
      'control.js',
    );
    expect(dead.unresolved.length, 'a DELETED key is no longer caught').toBe(1);

    const renamed = scanCopyKeys(
      "import { t as copy } from '../copy/index.js';\nexport const A = () => copy('nope.not.here');\n",
      'control.js',
    );
    expect(renamed.unresolved.length, 'an `as` rename is no longer followed').toBe(1);

    const unimported = scanCopyKeys(
      "export const A = (rows) => rows.reduce((acc, t) => t('nope.not.here'), 0);\n", 'control.js',
    );
    expect(unimported.unresolved, 'a local `t` that is not the registry is being scanned').toEqual([]);

    const optional = scanCopyKeys(
      "import { tOptional } from '../copy/index.js';\nexport const A = () => tOptional('gone.by.ruling');\n",
      'control.js',
    );
    expect(optional.unresolved, 'tOptional is asserted, but absence is its contract').toEqual([]);
    expect(optional.optional, 'a tOptional call was not counted').toBe(1);

    const templated = scanCopyKeys(
      'import { t } from \'../copy/index.js\';\nexport const A = (k) => t(`pricing.tiers.${k}.priceLabel`);\n',
      'control.js',
    );
    expect(templated.unresolved, 'a template key is being resolved from source').toEqual([]);
    expect(templated.dynamic, 'a template key was not counted as dynamic').toBe(1);

    const otherTable = scanCopyKeys(
      "import { tp } from '../copy/pricingPage.js';\nexport const A = () => tp('band1.noHiddenFees');\n",
      'control.js',
    );
    expect(otherTable.unresolved, 'tp is being resolved against the wrong table').toEqual([]);
    expect(otherTable.literals).toBe(1);
  });
});

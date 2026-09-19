/**
 * tests/helpers/routeClosure.js — THE SOURCE IMPORT WALKER, AND THE ROUTE→SOURCE
 * DERIVATION BUILT ON IT.
 *
 * ⛔ ONE WALKER. Three copies of "read a file, pull its specifiers, resolve them
 * relative, crawl" had already accumulated across tests/build and one census, and
 * a fourth was about to be written for the phone floors. They are the same walk
 * asked two different questions, so the question moved into a flag and the walk
 * moved here:
 *
 *   FOLLOW_STATIC   `import x from './y'` and `export … from './y'` only.
 *                   The first-paint proofs ask this one: a dynamic edge is
 *                   exactly what keeps a module OUT of the entry closure, so
 *                   following it would make those tests claim the opposite of
 *                   what they mean.
 *   FOLLOW_ALL      the static edges PLUS `import('./y')`.
 *                   A reader-facing census asks this one: a surface behind a
 *                   lazy boundary is still that route's surface. The dossier's
 *                   eighteen tab panels, the Realm's map pane and the workbench
 *                   all hang off `import()`, and a walk that stopped at the
 *                   first dynamic edge would measure the shell and call the
 *                   estate covered.
 *
 * ⭐ THE ROUTE DERIVATION. `src/lib/routes.js` owns the path↔view table and
 * `src/AppViews.jsx` owns view→component; between them they are the router, and
 * `routeClosures()` reads BOTH rather than restating either. A route added to
 * ROUTES therefore arrives in every census built on this helper already carrying
 * its component subtree — which is the whole point, because a hand-listed view
 * registry is how /create and the header nav were never measured.
 *
 * ⚠ EVERY ROOT IS REACHED THROUGH A DYNAMIC EDGE. AppViews declares each page as
 * `lazy(() => import('./components/X.jsx'))`, so the derivation must already read
 * one `import()` to find a root at all. That is why FOLLOW_ALL is not a liberty
 * taken with the closure but the same rule applied consistently one level down.
 *
 * Pure module: no describe/test here (a test file's exports re-register its
 * suites in every importer — see tests/helpers/dormancyOracle.js for that
 * incident).
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { parse } from 'espree';

/** Static edges only — what a first-paint closure may follow. */
export const FOLLOW_STATIC = 'static';
/** Static edges plus `import()` — what a rendered-surface census must follow. */
export const FOLLOW_ALL = 'all';

/**
 * The module specifiers one source file imports.
 *
 * Comments are stripped first, so a specifier named in a docblock (this repo's
 * docblocks quote import paths constantly) is never mistaken for an edge.
 *
 * @param {string} code
 * @param {typeof FOLLOW_STATIC|typeof FOLLOW_ALL} [follow=FOLLOW_STATIC]
 * @returns {string[]}
 */
export function moduleSpecifiers(code, follow = FOLLOW_STATIC) {
  const stripped = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const specs = new Set();
  for (const m of stripped.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.add(m[1]);
  for (const m of stripped.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.add(m[1]);
  if (follow === FOLLOW_ALL) {
    for (const m of stripped.matchAll(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) specs.add(m[1]);
  }
  return [...specs];
}

/**
 * Resolve a RELATIVE specifier to a real source file, or null.
 *
 * Bare specifiers (`react`, `lucide-react`) resolve to null on purpose: every
 * caller here is asking about this repo's own tree.
 *
 * @param {string} fromFile absolute path of the importer
 * @param {string} spec
 * @returns {string|null}
 */
export function resolveRelative(fromFile, spec) {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), spec);
  for (const candidate of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile() && /\.jsx?$/.test(candidate)) return candidate;
  }
  return null;
}

/**
 * Everything `entries` reach over the chosen edge kind, entries included.
 *
 * @param {string[]} entries absolute paths
 * @param {typeof FOLLOW_STATIC|typeof FOLLOW_ALL} [follow=FOLLOW_STATIC]
 * @returns {{ seen: Set<string>, parent: Map<string, string> }} `parent` carries
 *   the edge that first reached each file, so a caller can name the chain.
 */
export function importClosure(entries, follow = FOLLOW_STATIC) {
  const seen = new Set(entries);
  const parent = new Map();
  const queue = [...entries];
  while (queue.length) {
    const file = queue.shift();
    for (const spec of moduleSpecifiers(readFileSync(file, 'utf8'), follow)) {
      const dep = resolveRelative(file, spec);
      if (!dep || seen.has(dep)) continue;
      seen.add(dep);
      parent.set(dep, file);
      queue.push(dep);
    }
  }
  return { seen, parent };
}

/** Render `file`'s chain back to its entry, for a failure message that names the edge. */
export function chainTo(parent, file, root) {
  const chain = [];
  for (let cur = file; cur; cur = parent.get(cur)) chain.push(relative(root, cur).replace(/\\/g, '/'));
  return chain.reverse().join(' -> ');
}

const PARSE_OPTIONS = Object.freeze({
  ecmaVersion: 2024, sourceType: 'module', loc: true, range: true, ecmaFeatures: { jsx: true },
});

/** Depth-first over every AST node, with a `parent` link threaded on the way down. */
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
 * view id → the page component file(s) AppViews renders for it.
 *
 * Read from the AST rather than by regex: the table is a chain of
 * `{view === 'x' && <Page …/>}` expressions, some of them wrapped in a ternary
 * (the guarded views) or a context provider (the Realm), and a line-window regex
 * mis-attributed neighbours across those shapes.
 *
 * A view with NO entry here is a route that renders nothing — the retired
 * redirect surfaces (`/about`, `/how-to`, `/workshop`, `/compare*`), which App's
 * redirect effect forwards. They are absent rather than empty, and the caller
 * decides what that means.
 *
 * @param {string} root repo root
 * @returns {Map<string, string[]>} view id → absolute component paths
 */
export function viewComponents(root) {
  const appViews = join(root, 'src/AppViews.jsx');
  const ast = parse(readFileSync(appViews, 'utf8'), PARSE_OPTIONS);

  /** local name → the specifier its `lazy(() => import(…))` names. */
  const lazyNames = new Map();
  eachNode(ast, (n) => {
    if (n.type !== 'VariableDeclarator' || n.id?.type !== 'Identifier') return;
    if (n.init?.type !== 'CallExpression') return;
    if (!/^(campaignLazy|lazy)$/.test(n.init.callee?.name || '')) return;
    const body = n.init.arguments[0]?.body;
    if (body?.type === 'ImportExpression' && body.source?.type === 'Literal') {
      lazyNames.set(n.id.name, body.source.value);
    }
  });

  const byView = new Map();
  eachNode(ast, (n) => {
    // Only the table's own rows: a container sitting directly in the returned
    // fragment. Nesting deeper would re-attribute a page's internals to the view.
    if (n.type !== 'JSXExpressionContainer' || n.parent?.type !== 'JSXFragment') return;
    if (n.expression?.type !== 'LogicalExpression') return;
    const views = new Set();
    const specs = new Set();
    eachNode(n.expression, (x) => {
      if (x.type === 'BinaryExpression' && x.operator === '===' && x.left?.name === 'view'
          && x.right?.type === 'Literal') views.add(x.right.value);
      if (x.type === 'JSXOpeningElement' && x.name?.type === 'JSXIdentifier' && lazyNames.has(x.name.name)) {
        specs.add(lazyNames.get(x.name.name));
      }
    });
    for (const view of views) {
      if (!byView.has(view)) byView.set(view, new Set());
      for (const spec of specs) {
        const abs = resolveRelative(appViews, spec);
        if (abs) byView.get(view).add(abs);
      }
    }
  });
  return new Map([...byView].map(([view, set]) => [view, [...set].sort()]));
}

/**
 * Every route the router declares, with the source files its page can reach.
 *
 * @param {string} root repo root
 * @param {typeof FOLLOW_STATIC|typeof FOLLOW_ALL} [follow=FOLLOW_ALL]
 * @returns {Promise<{path: string, view: string, roots: string[], files: string[]}[]>}
 *   `roots` and `files` are repo-relative, POSIX-separated and sorted, so a
 *   caller's output is stable across machines.
 */
export async function routeClosures(root, follow = FOLLOW_ALL) {
  const { ROUTES } = await import(join(root, 'src/lib/routes.js'));
  const byView = viewComponents(root);
  const rel = (abs) => relative(root, abs).replace(/\\/g, '/');
  return ROUTES.map((route) => {
    const roots = byView.get(route.view) || [];
    const { seen } = roots.length ? importClosure(roots, follow) : { seen: new Set() };
    return {
      path: route.path,
      view: route.view,
      roots: roots.map(rel).sort(),
      files: [...seen].map(rel).sort(),
    };
  });
}

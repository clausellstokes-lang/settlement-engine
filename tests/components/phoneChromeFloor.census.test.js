/**
 * phoneChromeFloor.census.test.js — THE PHONE FLOORS AS A FACT ABOUT THE SOURCE,
 * NOT ABOUT ONE FIXTURE SEED'S STRING LENGTHS.
 *
 * `dossierPhoneFloorAllViews` renders the real dossier and measures what a reader
 * is given, which is the right instrument and the only one that can see a
 * computed size. It has one structural limit, and review 13 named it: it measures
 * a line ONLY once that line's own text reaches MIN_CHARS (45), because below
 * that a four-character badge is glanced at rather than read. So whether a 10px
 * trait row is a violation is decided by how long the generator happened to make
 * THIS settlement's traits. Nothing about the source decides it.
 *
 * At the census's first run that was not a hypothetical: 456 inline `fontSize`
 * literals below the chrome floor sat in src/components/new, every one of them a
 * violation waiting for a seed that made its line long enough, and the rendered
 * walk was green over all eighteen views.
 *
 * ⭐ SO THIS ARM READS SOURCE AND NOTHING ELSE. It cannot see a computed size and
 * does not try to; it asserts the WIRING, which is content-independent by
 * construction:
 *
 *   every `fontSize` whose literal is below the phone chrome floor must pass
 *   through `chromeFontSize` or `proseFontSize`, or carry a `// phone-floor:`
 *   ruling on its own line or the one above.
 *
 * The two arms are not redundant and neither subsumes the other. The rendered
 * walk sees a size this one cannot compute (a stylesheet, a cascade, a prop); this
 * one sees a surface the walk never mounts — WarTab's treaty stamps rendered at
 * SEVEN PIXELS for the life of that file and no instrument in this repo could say
 * so, because War is not one of the eighteen views.
 *
 * ⛔ THE BOUNDARY IS src/components/new AND IT IS A RULING, NOT AN ACCIDENT. That
 * tree is where every one of the eighteen views renders its panel content from,
 * so the static census and the rendered walk are about one surface. The
 * directories the dossier's own module graph also reaches are named in
 * `OUTSIDE_THE_CENSUS` below, each with the reason it is out — and that list is
 * ASSERTED against the graph, so a new component directory joining the dossier
 * reds here and takes a ruling rather than slipping in unmeasured.
 *
 * ⚠ NO TOKEN TABLE IS RESTATED HERE. `FS` comes from src/design/tokens.js and the
 * floor from src/design/proseScale.js, so "below the floor" is derived from the
 * two modules that define it. A hand-copied table is the drift this file would
 * otherwise become: add `FS['11.75']` tomorrow and a restated list would go on
 * passing while the new step shipped bare.
 */

import { describe, expect, test } from 'vitest';
import { parse } from 'espree';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

import { legacy } from '../../src/design/tokens.js';
import { PHONE_CHROME_FLOOR } from '../../src/design/proseScale.js';

// The repo root under vitest. NOT `import.meta.url`: a jsdom environment rewrites
// it to a `/@fs/…` dev-server path, which readdirSync cannot open — the same trap
// the InstitutionLink census documents.
const ROOT = process.cwd();

/** The one tree this census governs (see the boundary ruling above). */
const CENSUS_TREE = 'src/components/new';

/** The acceptance test whose surface this file is the source-side twin of. */
const ACCEPTANCE_TEST = 'tests/components/dossierPhoneFloorAllViews.test.jsx';

/** The two helpers a sub-floor size may pass through. */
const HELPERS = new Set(['chromeFontSize', 'proseFontSize']);

/** The declared ruling that takes a site out of the census, on its line or the one above. */
const RULING = /\/\/\s*phone-floor:/;

/**
 * ⛔ EVERY OTHER DIRECTORY THE DOSSIER'S GRAPH REACHES, AND WHY IT IS OUT.
 *
 * Asserted against the real import graph below, so this is a ruling that reds
 * when it stops being true rather than a comment that quietly rots.
 */
const OUTSIDE_THE_CENSUS = Object.freeze({
  'src/components/':
    'the dossier shell and its siblings — the container, the strip, the table view; '
    + 'chrome AROUND a panel rather than inside one, and not what the rendered walk scans',
  'src/components/dossier/':
    'the workbench, the drawers, the action band and the session notices — they frame the '
    + 'dossier, and none of them renders inside a #sf-panel-*',
  'src/components/primitives/':
    'leaves shared with the landing, auth and gallery, where the phone floors are not the '
    + 'ruling in force; flooring them here would move surfaces this census has no order about',
  'src/components/settlement/': 'the deity, faith and version panels of the settlement editor, not the dossier read',
  'src/components/settlements/': 'the saved-settlement list',
  'src/components/gallery/': 'the gallery share surfaces',
  'src/components/map/': 'the map pane and its own controls',
  'src/components/brand/': 'the brand mark',
  'src/components/perimeter/': 'the page perimeter (header/footer)',
});

// ── the walk ─────────────────────────────────────────────────────────────────

/** Every `.js`/`.jsx` source file under `dir`, tests excluded. */
function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSource(p, out);
    else if (/\.jsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

/** espree with the settings eslint.config.js itself uses, so what parses here parses there. */
function parseSource(src) {
  return parse(src, {
    ecmaVersion: 2024, sourceType: 'module', loc: true, ecmaFeatures: { jsx: true },
  });
}

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

// ── the rule ─────────────────────────────────────────────────────────────────

/** The FS keys that render below the chrome floor — DERIVED from the two modules that own them. */
const SUB_FLOOR_KEYS = new Set(
  Object.entries(legacy.FS).filter(([, px]) => px < PHONE_CHROME_FLOOR).map(([key]) => key),
);

/**
 * The px a `fontSize` VALUE node renders at when it is a literal, or null when it
 * is anything else (a helper call, a ternary, a prop, an identifier). Only a
 * literal can be judged from source, and only a literal is claimed.
 */
function literalPx(node) {
  if (!node) return null;
  if (node.type === 'MemberExpression' && node.object?.type === 'Identifier' && node.object.name === 'FS') {
    const key = node.computed
      ? (node.property?.type === 'Literal' ? String(node.property.value) : null)
      : node.property?.name;
    return key != null && SUB_FLOOR_KEYS.has(key) ? legacy.FS[key] : null;
  }
  if (node.type === 'Literal' && typeof node.value === 'number') {
    return node.value < PHONE_CHROME_FLOOR ? node.value : null;
  }
  return null;
}

/** True when a `// phone-floor:` ruling sits on this line or the one above it. */
function ruledAt(lines, line) {
  return RULING.test(lines[line - 1] || '') || RULING.test(lines[line - 2] || '');
}

const propOf = (obj, name) => obj.properties?.find(
  (p) => p.type === 'Property' && !p.computed && (p.key?.name ?? p.key?.value) === name,
);
const numOf = (node) => (node?.type === 'Literal' && typeof node.value === 'number' ? node.value : null);

/**
 * ⭐ THE RENDERED ARM'S OWN PREDICATE, READ OFF THE SOURCE STYLE OBJECT.
 *
 * `dossierPhoneFloorAllViews.isChrome` judges a rendered element by case,
 * tracking, weight, or being an inline padded grounded pill. A line that
 * predicate calls PROSE takes the 14px floor there — so a source that wrapped it
 * in `chromeFontSize` has written 12 where the walk demands 14, and reds only
 * once that line grows past 45 characters. Thirty-seven sites were in exactly
 * that state when this arm first ran.
 *
 * It is a HEURISTIC over source and it says so: it is the reason a site may carry
 * a `// phone-floor:` ruling, which this arm honours exactly as the census does.
 */
function proseShaped(styleObj, elementName) {
  if (!styleObj || styleObj.type !== 'ObjectExpression') return false;
  if (propOf(styleObj, 'textTransform')?.value?.value === 'uppercase') return false;
  if (propOf(styleObj, 'letterSpacing')) return false;
  const weight = numOf(propOf(styleObj, 'fontWeight')?.value);
  if (weight != null && weight >= 700) return false;
  const padded = !!propOf(styleObj, 'padding') || !!propOf(styleObj, 'paddingLeft');
  const grounded = !!propOf(styleObj, 'background') || !!propOf(styleObj, 'backgroundColor') || !!propOf(styleObj, 'border');
  if (padded && grounded) return false;                      // the pill
  const lineHeight = numOf(propOf(styleObj, 'lineHeight')?.value);
  return (lineHeight != null && lineHeight >= 1.4) || elementName === 'p' || elementName === 'ProseBlock';
}

/** The JSX element a node sits inside, by name, or null at the top of the tree. */
function enclosingElement(node) {
  for (let n = node.parent; n; n = n.parent) {
    if (n.type === 'JSXOpeningElement') {
      const name = n.name;
      return name?.type === 'JSXIdentifier' ? name.name : null;
    }
  }
  return null;
}

/**
 * Is `name` bound anywhere in the scope chain above `node`?
 *
 * Hand-rolled rather than pulled from eslint-scope, which is transitive: espree
 * is the direct dependency this repo's walkers already stand on. It answers the
 * one question asked of it — a function parameter (through any destructuring
 * shape), or a declaration in an enclosing body.
 */
function bindsIdentifier(node, name) {
  const inPattern = (pattern) => {
    if (!pattern) return false;
    switch (pattern.type) {
      case 'Identifier': return pattern.name === name;
      case 'AssignmentPattern': return inPattern(pattern.left);
      case 'RestElement': return inPattern(pattern.argument);
      case 'ArrayPattern': return pattern.elements.some(inPattern);
      case 'ObjectPattern': return pattern.properties.some(
        (p) => (p.type === 'RestElement' ? inPattern(p.argument) : inPattern(p.value)),
      );
      default: return false;
    }
  };
  const declares = (statements) => (statements || []).some((s) => {
    if (s.type === 'VariableDeclaration') return s.declarations.some((d) => inPattern(d.id));
    if (s.type === 'FunctionDeclaration' || s.type === 'ClassDeclaration') return s.id?.name === name;
    if (s.type === 'ImportDeclaration') return s.specifiers.some((sp) => sp.local?.name === name);
    return false;
  });
  for (let n = node.parent; n; n = n.parent) {
    if (/Function(Declaration|Expression)$|ArrowFunctionExpression/.test(n.type) && n.params?.some(inPattern)) return true;
    if (Array.isArray(n.body) && declares(n.body)) return true;
    if (n.type === 'Program' && declares(n.body)) return true;
  }
  return false;
}

/**
 * Every `fontSize` property in one source file, judged.
 * @returns {{bare: any[], chrome: any[], prose: any[], ruled: any[], misclassified: any[], outOfScope: any[]}}
 */
export function censusOfSource(src, rel) {
  const lines = src.split('\n');
  const found = { bare: [], chrome: [], prose: [], ruled: [], misclassified: [], outOfScope: [] };
  let ast;
  // A parse failure THROWS rather than skipping the file: a scanner that
  // silently drops what it cannot read is the vacuity this census exists against.
  try { ast = parseSource(src); } catch (e) { throw new Error(`${rel} did not parse: ${e.message}`, { cause: e }); }

  eachNode(ast, (node) => {
    if (node.type !== 'Property' || node.computed) return;
    if ((node.key?.name ?? node.key?.value) !== 'fontSize') return;
    const value = node.value;
    const line = value.loc.start.line;
    const where = `${rel}:${line}`;
    const snippet = (lines[line - 1] || '').trim().slice(0, 100);

    if (value.type === 'CallExpression' && value.callee?.type === 'Identifier' && HELPERS.has(value.callee.name)) {
      const px = literalPx(value.arguments[0]);
      if (px == null) return;                                // a helper over a non-literal: nothing to claim
      const helper = value.callee.name;
      found[helper === 'chromeFontSize' ? 'chrome' : 'prose'].push({ where, px, snippet });

      // The viewport flag must be a real binding, or this site throws on first
      // render. The chain is walked from the PROPERTY, not from its value: this
      // walk threads `parent` as it pops, so a node's own link is set and its
      // not-yet-popped children's are not — reading the chain from `value` found
      // `undefined` at step one and called all 551 sites unbound.
      const flag = value.arguments[1];
      if (flag?.type === 'Identifier' && !bindsIdentifier(node, flag.name)) {
        found.outOfScope.push(`${where}  \`${flag.name}\` is not bound in any enclosing scope  ::  ${snippet}`);
      }

      if (helper === 'chromeFontSize' && !ruledAt(lines, line)
          && proseShaped(node.parent, enclosingElement(node))) {
        found.misclassified.push(`${where}  ${px}px  ::  ${snippet}`);
      }
      return;
    }

    const px = literalPx(value);
    if (px == null) return;
    if (ruledAt(lines, line)) found.ruled.push(`${where}  ${px}px  ::  ${snippet}`);
    else found.bare.push(`${where}  ${px}px  ::  ${snippet}`);
  });
  return found;
}

function censusOfTree() {
  const all = { bare: [], chrome: [], prose: [], ruled: [], misclassified: [], outOfScope: [] };
  const files = walkSource(join(ROOT, CENSUS_TREE));
  for (const abs of files.sort()) {
    const rel = relative(ROOT, abs).replace(/\\/g, '/');
    const one = censusOfSource(readFileSync(abs, 'utf8'), rel);
    for (const key of Object.keys(all)) all[key].push(...one[key]);
  }
  return { ...all, files: files.length };
}

const CENSUS = censusOfTree();

// ── the graph, for the boundary ruling ───────────────────────────────────────

function resolveSpecifier(fromFile, spec) {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), spec);
  for (const candidate of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile() && /\.jsx?$/.test(candidate)) return candidate;
  }
  return null;
}

/** Every file the acceptance test's OWN src imports reach, statically. */
function dossierGraph() {
  const testAbs = join(ROOT, ACCEPTANCE_TEST);
  const testSrc = readFileSync(testAbs, 'utf8');
  const seen = new Set();
  const crawl = (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    for (const m of readFileSync(file, 'utf8').matchAll(/(?:from\s+|import\s*\(\s*)['"]([^'"]+)['"]/g)) {
      const target = resolveSpecifier(file, m[1]);
      if (target) crawl(target);
    }
  };
  let roots = 0;
  for (const m of testSrc.matchAll(/(?:from\s+|vi\.mock\(\s*)['"](\.\.\/\.\.\/src\/[^'"]+)['"]/g)) {
    const target = resolveSpecifier(testAbs, m[1]);
    if (target) { roots += 1; crawl(target); }
  }
  const components = [...seen]
    .map((f) => relative(ROOT, f).replace(/\\/g, '/'))
    .filter((r) => r.startsWith('src/components/'));
  return { roots, components };
}

describe('THE PHONE CHROME FLOOR — a census of the source, not of one seed', () => {
  test('the walk is live: it parsed the tree and found sub-floor sizes to judge', () => {
    // ⛔ ANTI-VACUITY, and it is the failure mode a source scanner dies of. A
    // moved tree, a renamed token module or a parser that started throwing all
    // produce an empty walk, and every assertion below passes on nothing. These
    // floors are the measurement at landing, tightened toward reality and never
    // relaxed to admit a budget: 45 files, 551 sub-floor sizes, 10 sub-floor
    // FS keys (pico nano micro xxs xs 7.5 8.5 9.5 10.5 11.5).
    expect(CENSUS.files, 'the census tree is empty — has src/components/new moved?')
      .toBeGreaterThanOrEqual(45);
    expect(SUB_FLOOR_KEYS.size, 'no FS token reads below the chrome floor — the token table or the floor moved')
      .toBeGreaterThanOrEqual(10);
    expect(
      CENSUS.chrome.length + CENSUS.prose.length + CENSUS.bare.length + CENSUS.ruled.length,
      'the walk judged almost no sub-floor sizes — the `fontSize` shape it looks for has changed',
    ).toBeGreaterThanOrEqual(500);
  });

  test('every sub-floor size passes through a helper or carries a written ruling', () => {
    expect(
      CENSUS.bare,
      `\n${CENSUS.bare.length} inline fontSize literal(s) below the ${PHONE_CHROME_FLOOR}px phone chrome floor `
      + 'render at their desktop step on a 375px screen.\n'
      + 'Wrap the size in chromeFontSize(<the FS token>, mobile) — or proseFontSize(...) when the line '
      + 'is a passage — binding `mobile` once per component with useIsMobile() ABOVE any early return.\n'
      + 'If a site genuinely must stay smaller (a box it would overflow), write the reason on its line '
      + 'or the one above as `// phone-floor: <why>`; that is a ruling and a reviewer reads it:\n'
      + `${CENSUS.bare.join('\n')}\n`,
    ).toEqual([]);
  });

  test('every helper call\'s viewport flag is really bound where it is used', () => {
    // A wrapper over an unbound identifier is not a smaller failure than a bare
    // size — it is a ReferenceError on first render, and the sweep that wrote it
    // would have looked exactly as green as a correct one.
    expect(
      CENSUS.outOfScope,
      `\n${CENSUS.outOfScope.length} helper call(s) read a viewport flag that no enclosing scope binds. `
      + 'Bind it with `const mobile = useIsMobile();` in the component that renders the line, above any '
      + 'early return, or pass it in as an argument when the reader is a plain helper rather than a '
      + 'component:\n'
      + `${CENSUS.outOfScope.join('\n')}\n`,
    ).toEqual([]);
  });

  test('no line the rendered walk would call PROSE sits on the chrome helper', () => {
    expect(
      CENSUS.misclassified,
      `\n${CENSUS.misclassified.length} site(s) take the ${PHONE_CHROME_FLOOR}px chrome floor while carrying the shape `
      + `dossierPhoneFloorAllViews classifies as PROSE, whose floor is higher. Written this way the line `
      + 'renders below what the rendered walk demands and reds only once its text passes 45 characters.\n'
      + 'Move it to proseFontSize(...), or record why it is furniture as `// phone-floor: <why>`:\n'
      + `${CENSUS.misclassified.join('\n')}\n`,
    ).toEqual([]);
  });

  test('the detectors discriminate, and the written ruling is honoured (executed controls)', () => {
    // ⛔ WITHOUT THIS, EVERY GREEN ABOVE IS UNREADABLE. Three of the four arms
    // assert an EMPTY list, which is what a detector that has stopped detecting
    // also produces. Each control is a source string this file parses for real.
    const bare = censusOfSource(
      'export const A = () => <div style={{ fontSize: FS.xxs }}>x</div>;', 'control.jsx',
    );
    expect(bare.bare.length, 'a bare sub-floor size is no longer caught').toBe(1);

    const ruled = censusOfSource(
      '// phone-floor: the numeral is painted inside an 18px bar\n'
      + 'export const A = () => <div style={{ fontSize: FS.xxs }}>x</div>;', 'control.jsx',
    );
    expect(ruled.bare, 'a written ruling no longer exempts its site').toEqual([]);
    expect(ruled.ruled.length, 'a written ruling is no longer counted as one').toBe(1);

    const wrapped = censusOfSource(
      'export const A = ({ mobile }) => <div style={{ fontSize: chromeFontSize(FS.xxs, mobile) }}>x</div>;',
      'control.jsx',
    );
    expect(wrapped.bare, 'a wrapped site is reported as bare').toEqual([]);
    expect(wrapped.outOfScope, 'a flag bound as a destructured prop is read as unbound').toEqual([]);
    expect(wrapped.chrome.length).toBe(1);

    const unbound = censusOfSource(
      'export const A = () => <div style={{ fontSize: chromeFontSize(FS.xxs, mobile) }}>x</div>;',
      'control.jsx',
    );
    expect(unbound.outOfScope.length, 'an unbound viewport flag is no longer caught').toBe(1);

    const overFloor = censusOfSource(
      'export const A = () => <div style={{ fontSize: FS.lg }}>x</div>;', 'control.jsx',
    );
    expect(overFloor.bare, 'a size ABOVE the floor is reported — the census has stopped being a floor').toEqual([]);

    const proseOnChrome = censusOfSource(
      'export const A = ({ mobile }) => <p style={{ fontSize: chromeFontSize(FS.xs, mobile), lineHeight: 1.5 }}>x</p>;',
      'control.jsx',
    );
    expect(proseOnChrome.misclassified.length, 'a prose-shaped line on the chrome helper is no longer caught').toBe(1);

    const pill = censusOfSource(
      'export const A = ({ mobile }) => <span style={{ fontSize: chromeFontSize(FS.xs, mobile), '
      + 'lineHeight: 1.5, padding: 2, background: g }}>x</span>;',
      'control.jsx',
    );
    expect(pill.misclassified, 'a padded, grounded pill is misread as prose').toEqual([]);
  });

  test('the boundary holds: the dossier reaches no component directory this census has not ruled on', () => {
    const { roots, components } = dossierGraph();
    // ANTI-VACUITY: a graph that resolved nothing would make the ruling below empty.
    expect(roots, `${ACCEPTANCE_TEST} exposed no src import to crawl from`).toBeGreaterThan(0);
    expect(
      components.filter((r) => r.startsWith(`${CENSUS_TREE}/`)).length,
      'the acceptance test reaches nothing inside the census tree — the two instruments have come apart',
    ).toBeGreaterThanOrEqual(40);

    const outside = [...new Set(
      components.filter((r) => !r.startsWith(`${CENSUS_TREE}/`)).map((r) => `${r.slice(0, r.lastIndexOf('/'))}/`),
    )].sort();
    expect(
      outside.filter((d) => !(d in OUTSIDE_THE_CENSUS)),
      '\nThe dossier now reaches component director(ies) this census has never ruled on. Either they '
      + 'render inside a tab panel — in which case they belong in the census and CENSUS_TREE must grow '
      + 'to reach them — or they are chrome around it, in which case add them to OUTSIDE_THE_CENSUS with '
      + 'the reason:\n',
    ).toEqual([]);
    expect(
      Object.keys(OUTSIDE_THE_CENSUS).filter((d) => !outside.includes(d)),
      'OUTSIDE_THE_CENSUS names a directory the dossier no longer reaches — delete the stale ruling',
    ).toEqual([]);
  });
});

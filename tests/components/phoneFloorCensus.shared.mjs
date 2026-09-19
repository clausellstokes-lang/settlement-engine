/**
 * phoneFloorCensus.shared.mjs — THE PHONE-FLOOR SOURCE RULE, ONCE, FOR EVERY CENSUS
 * THAT APPLIES IT.
 *
 * The rule was written for the dossier (tests/components/phoneChromeFloor.census.test.js)
 * and stated there in full; this file is that file's scanner, lifted out unchanged so a
 * SECOND surface can be held to the SAME rule instead of to a copy of it
 * (tests/components/publicChromeFloor.census.test.js, which governs the phone's bottom
 * nav and the Create page — ODQ §934.22 item 2).
 *
 * ⛔ WHY A LIFT AND NOT A SECOND COPY. The rule is eleven interlocking judgments — what
 * counts as a sub-floor literal, which helpers absolve one, what a written ruling looks
 * like, when a site is prose-shaped, whether a viewport flag is really bound. A copy of
 * that would agree with the original on the day it was made and drift by the month. The
 * dossier census keeps every one of its own arms, its tree, its boundary ruling and its
 * baselines; only the SCANNER lives here.
 *
 * ⚠ NO TOKEN TABLE IS RESTATED. `legacy.FS` comes from src/design/tokens.js and the floor
 * from src/design/proseScale.js, so "below the floor" is derived from the two modules that
 * define it — add a step tomorrow and both censuses see it.
 *
 * Deliberately NOT a `.test.js`: it asserts nothing. Its correctness is proved by the
 * executed controls in each census that imports it, which parse real source strings
 * through `censusOfSource` and check both directions.
 */

import { parse } from 'espree';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { legacy } from '../../src/design/tokens.js';
import { PHONE_CHROME_FLOOR } from '../../src/design/proseScale.js';

/** The two helpers a sub-floor size may pass through. */
export const HELPERS = new Set(['chromeFontSize', 'proseFontSize']);

/** The declared ruling that takes a site out of a census, on its line or the one above. */
export const RULING = /\/\/\s*phone-floor:/;

/** The FS keys that render below the chrome floor — DERIVED from the two modules that own them. */
export const SUB_FLOOR_KEYS = new Set(
  Object.entries(legacy.FS).filter(([, px]) => px < PHONE_CHROME_FLOOR).map(([key]) => key),
);

/** Every `.js`/`.jsx` source file under `dir`, tests excluded. */
export function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSource(p, out);
    else if (/\.jsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

/** espree with the settings eslint.config.js itself uses, so what parses here parses there. */
export function parseSource(src) {
  return parse(src, {
    ecmaVersion: 2024, sourceType: 'module', loc: true, ecmaFeatures: { jsx: true },
  });
}

/** Depth-first over every AST node, with a `parent` link threaded on the way down. */
export function eachNode(ast, visit) {
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
 * The px a `fontSize` VALUE node renders at when it is a literal, or null when it
 * is anything else (a helper call, a ternary, a prop, an identifier). Only a
 * literal can be judged from source, and only a literal is claimed.
 */
export function literalPx(node) {
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
export function ruledAt(lines, line) {
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
export function proseShaped(styleObj, elementName) {
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
export function enclosingElement(node) {
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
export function bindsIdentifier(node, name) {
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

/** An empty census tally, for accumulating across files. */
export const emptyCensus = () => ({
  bare: [], chrome: [], prose: [], ruled: [], misclassified: [], outOfScope: [],
});

export { PHONE_CHROME_FLOOR };

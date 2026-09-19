/**
 * styleShorthandLonghand.walker.test.js — THE REACT SHORTHAND/LONGHAND WARNING CLASS,
 * CLOSED AT THE SOURCE.
 *
 * ── THE CLASS ──────────────────────────────────────────────────────────────────
 * React applies an inline `style` object property by property. When a re-render
 * changes a SHORTHAND (`border`) in an object that ALSO sets one of its LONGHANDS
 * (`borderLeft`), the order the two are written in decides the result, and React
 * cannot know which the author meant — so it warns, once per property per element:
 *
 *     Updating a style property during rerender (border) when a conflicting
 *     property is set (borderLeft) can lead to styling bugs.
 *
 * It is not cosmetic. The shorthand RESETS every longhand it covers, so on the
 * render where `border` changes, the `borderLeft: 3px solid …` accent the card was
 * drawn with is silently flattened to the shorthand's 1px — the exact accent the
 * author put there to carry meaning. Which of the two wins depends on property
 * ORDER in the object literal, which is invisible at the call site.
 *
 * Twenty-four of these sat unattributed in the console during the 2026-09-19 browser
 * walk (ODQ §934.22 item 4a). Nobody could say which component emitted them, because
 * React's message names the PROPERTY, never the element.
 *
 * ── THE WALK ───────────────────────────────────────────────────────────────────
 * Every `.js`/`.jsx` under src/ is parsed with espree (a parse failure THROWS — a
 * scanner that silently drops what it cannot read is a vacuous green). A SITE is an
 * object literal that names a shorthand from FAMILIES below AND at least one of that
 * shorthand's longhands.
 *
 * ⭐ ONLY A VARYING SHORTHAND IS A VIOLATION, AND THAT IS THE WARNING'S OWN RULE.
 * React warns on UPDATE, when the value it is about to write differs from the one it
 * wrote last. A shorthand whose value is a constant — `border: 'none'` beside
 * `borderTop`, the commonest pairing in this tree — never updates and never warns;
 * reporting it would bury the real class under scores of harmless rows and the
 * walker would be switched off. "Varies" is read structurally: the shorthand's value
 * expression contains a conditional (`a ? b : c`) or a logical (`a && b`, `a || b`).
 * That is the shape every one of the eighteen live sites had.
 *
 * ── THE OWED REGISTER ──────────────────────────────────────────────────────────
 * Twelve of the eighteen live sites are in files this lane may not edit — ten in the
 * dossier tabs and one in a PDF section, each owned by a concurrent lane. They are
 * frozen in `OWED` by FILE and COUNT (never by line: line numbers churn under every
 * unrelated edit and would make this a nuisance gate). The register is EXACT IN BOTH
 * DIRECTIONS: a new site in a listed file reds, and a CURED one reds too, demanding
 * the row be lowered so the win is banked. Every other file in src/ is held at zero.
 *
 * @enforced-by itself (the executed controls below prove the detector both ways)
 */

import { describe, expect, test } from 'vitest';
import { parse } from 'espree';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

/**
 * The CSS shorthands React warns about, each with the longhands it covers, in the
 * camelCase spelling an inline style object uses. Not the whole CSS surface — the
 * families a component in this tree actually writes both halves of.
 */
const FAMILIES = Object.freeze({
  border: ['borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'borderWidth', 'borderStyle', 'borderColor'],
  borderRadius: ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'],
  margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
  padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
  background: ['backgroundColor', 'backgroundImage', 'backgroundPosition', 'backgroundSize', 'backgroundRepeat', 'backgroundAttachment'],
  font: ['fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'lineHeight', 'fontFamily'],
  flex: ['flexGrow', 'flexShrink', 'flexBasis'],
  gap: ['rowGap', 'columnGap'],
  overflow: ['overflowX', 'overflowY'],
  outline: ['outlineWidth', 'outlineStyle', 'outlineColor'],
  transition: ['transitionProperty', 'transitionDuration', 'transitionTimingFunction', 'transitionDelay'],
});

/**
 * ⛔ THE OWED REGISTER — file → number of live sites, for the files this walker's
 * author was not permitted to edit (ODQ §934.22 lane boundary: the dossier tabs are
 * lanes 25–27's, the PDF sections are lane 26's). Each row is a DEBT, not a licence.
 * Exact in both directions; drive every row to zero and delete it.
 */
const OWED = Object.freeze({
  'src/components/new/tabs/DailyLifeTab.jsx': 1,
  'src/components/new/tabs/DefenseTab.jsx': 2,
  'src/components/new/tabs/EconomicsTab.jsx': 1,
  'src/components/new/tabs/HistoryTab.jsx': 1,
  'src/components/new/tabs/OverviewTab.jsx': 1,
  'src/components/new/tabs/PowerTab.jsx': 1,
  'src/components/new/tabs/ServicesTab.jsx': 1,
  'src/components/new/tabs/SubstrateTab.jsx': 1,
  'src/components/new/tabs/ViabilityTab.jsx': 2,
  'src/pdf/sections/Institutions.jsx': 1,
});

function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSource(p, out);
    else if (/\.jsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

function eachNode(ast, visit) {
  const stack = [ast];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node.type !== 'string') continue;
    visit(node);
    for (const key in node) {
      if (key === 'loc' || key === 'range') continue;
      const v = node[key];
      if (Array.isArray(v)) {
        for (const child of v) if (child && typeof child.type === 'string') stack.push(child);
      } else if (v && typeof v.type === 'string') {
        stack.push(v);
      }
    }
  }
}

/**
 * Does this value expression produce a DIFFERENT string on a different render?
 * Read structurally: a conditional or a logical anywhere inside it. A bare
 * identifier or template that happens to hold a constant is NOT claimed — React
 * would not warn on it, and claiming it would make this walker noise.
 */
function varies(node) {
  let found = false;
  eachNode(node, (n) => {
    if (n.type === 'ConditionalExpression' || n.type === 'LogicalExpression') found = true;
  });
  return found;
}

/**
 * Scan one source file for the class.
 * @returns {{ sites: string[], pairs: number }} sites = violations; pairs = every
 *   shorthand/longhand co-occurrence, varying or not (the liveness denominator).
 */
export function scanShorthandClashes(src, rel) {
  const found = { sites: [], pairs: 0 };
  let ast;
  try {
    ast = parse(src, { ecmaVersion: 2024, sourceType: 'module', loc: true, ecmaFeatures: { jsx: true } });
  } catch (e) {
    throw new Error(`${rel} did not parse: ${e.message}`, { cause: e });
  }
  const lines = src.split('\n');

  eachNode(ast, (node) => {
    if (node.type !== 'ObjectExpression') return;
    /** @type {Map<string, any>} */
    const props = new Map();
    for (const p of node.properties) {
      if (p.type !== 'Property' || p.computed) continue;
      const key = p.key?.name ?? p.key?.value;
      if (typeof key === 'string') props.set(key, p);
    }
    for (const [shorthand, longhands] of Object.entries(FAMILIES)) {
      const shortProp = props.get(shorthand);
      if (!shortProp) continue;
      const clashing = longhands.filter((l) => props.has(l));
      if (!clashing.length) continue;
      found.pairs += 1;
      if (!varies(shortProp.value)) continue;
      const line = shortProp.key.loc.start.line;
      found.sites.push(
        `${rel}:${line}  \`${shorthand}\` changes across renders beside \`${clashing.join('`, `')}\``
        + `  ::  ${(lines[line - 1] || '').trim().slice(0, 100)}`,
      );
    }
  });
  return found;
}

function scanTree() {
  /** @type {Map<string, string[]>} */
  const byFile = new Map();
  let pairs = 0;
  let files = 0;
  for (const abs of walkSource(join(ROOT, 'src')).sort()) {
    const rel = relative(ROOT, abs).replace(/\\/g, '/');
    const one = scanShorthandClashes(readFileSync(abs, 'utf8'), rel);
    files += 1;
    pairs += one.pairs;
    if (one.sites.length) byFile.set(rel, one.sites);
  }
  return { byFile, pairs, files };
}

const SCAN = scanTree();

describe('THE SHORTHAND/LONGHAND CLASS — a varying shorthand never sits beside its longhand', () => {
  test('the walk is live: it parsed the tree and found co-occurrences to judge', () => {
    // ⛔ ANTI-VACUITY. Both assertions below are satisfied by a scanner that found
    // nothing, which is what a moved tree or a broken parser produces. These floors
    // are the measurement at landing (2026-09-19: 2,230 files, 233 shorthand/longhand
    // co-occurrences), tightened toward reality and never relaxed.
    expect(SCAN.files, 'the src tree is empty — has it moved?').toBeGreaterThanOrEqual(2200);
    expect(SCAN.pairs, 'the walk found almost no shorthand/longhand pairs — the shape it looks for changed')
      .toBeGreaterThanOrEqual(200);
  });

  test('no file outside the owed register writes a varying shorthand beside a longhand', () => {
    const unlisted = [...SCAN.byFile.entries()]
      .filter(([rel]) => !(rel in OWED))
      .flatMap(([, sites]) => sites);
    expect(
      unlisted,
      `\n${unlisted.length} inline style object(s) change a SHORTHAND across renders while also setting one `
      + 'of its LONGHANDS. React warns on every such update, and on the render where the shorthand '
      + 'changes it silently resets the longhand beside it — the accent border, the one-sided margin, '
      + 'whatever the longhand was carrying.\n'
      + 'Write LONGHANDS ONLY: replace `border: <varies>` with the three or four sides it actually '
      + 'means, keeping the accent side as its own value:\n'
      + `${unlisted.join('\n')}\n`,
    ).toEqual([]);
  });

  test('the owed register is exact in both directions (shrink-only)', () => {
    const live = Object.fromEntries(
      [...SCAN.byFile.entries()].filter(([rel]) => rel in OWED).map(([rel, sites]) => [rel, sites.length]),
    );
    expect(
      live,
      '\nThe OWED register no longer matches the tree.\n'
      + 'MORE than a row claims → a new instance of the class landed in a file that already owed one; '
      + 'cure it rather than raising the row.\n'
      + 'FEWER (or a row missing entirely) → the debt was paid. LOWER the row, or delete it, in the '
      + 'same commit, so the win is banked instead of becoming spare budget.\n',
    ).toEqual(OWED);
  });

  test('the detector discriminates (executed controls)', () => {
    const varying = scanShorthandClashes(
      'export const A = ({ hot }) => <div style={{ border: `1px solid ${hot ? R : B}`, borderLeft: "3px solid red" }} />;',
      'control.jsx',
    );
    expect(varying.sites.length, 'a varying shorthand beside a longhand is no longer caught').toBe(1);

    const constant = scanShorthandClashes(
      'export const A = () => <div style={{ border: "none", borderTop: "1px solid red" }} />;', 'control.jsx',
    );
    expect(constant.sites, 'a CONSTANT shorthand is reported — React never warns on one').toEqual([]);
    expect(constant.pairs, 'a constant pair was not counted in the denominator').toBe(1);

    const unrelated = scanShorthandClashes(
      'export const A = ({ hot }) => <div style={{ border: hot ? "a" : "b", color: "red" }} />;', 'control.jsx',
    );
    expect(unrelated.sites, 'a shorthand with no longhand beside it is reported').toEqual([]);
    expect(unrelated.pairs).toBe(0);

    const longhandsOnly = scanShorthandClashes(
      'export const A = ({ hot }) => <div style={{ borderTop: hot ? "a" : "b", borderLeft: "c" }} />;', 'control.jsx',
    );
    expect(longhandsOnly.sites, 'the cure (longhands only) is reported as a violation').toEqual([]);

    const logical = scanShorthandClashes(
      'export const A = ({ hot }) => <div style={{ padding: hot && "4px", paddingLeft: 8 }} />;', 'control.jsx',
    );
    expect(logical.sites.length, 'a LOGICAL shorthand value is no longer read as varying').toBe(1);

    const otherFamily = scanShorthandClashes(
      'export const A = ({ hot }) => <div style={{ font: hot ? "a" : "b", fontSize: 12 }} />;', 'control.jsx',
    );
    expect(otherFamily.sites.length, 'only the border family is detected').toBe(1);
  });
});

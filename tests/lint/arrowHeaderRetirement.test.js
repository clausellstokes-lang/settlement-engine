/**
 * tests/lint/arrowHeaderRetirement.test.js: THE RETIRED HEADER STAYS RETIRED, and the
 * painted arrow's lengths keep ONE writer.
 *
 * THE OWNER'S ORDERS (2026-09-16): "Replace the arrow ribbon entirely with the following
 * image". The procedural ribbon (NavRibbon, FletchBand, ShaftWrap, ShaftNock, NavDivider),
 * its gilded lockup (Lockup, GildedWordmark, WaxSeal, SealImpression), the war-arrow token
 * block in components/theme.js and the fixed header heights (CHROME.headerDesktop,
 * headerMobile, scrollPadDesktop, mapShellOffset) all left in one change. Nothing else
 * would notice one coming back: there is no dead-export walker, and a stale consumer of a
 * deleted CHROME height does not throw, it computes `NaNpx` or `undefinedpx` and the sticky
 * bar it positions silently lands under the painting.
 *
 * THE WALK: every .js/.jsx file under src/ is TOKENIZED with espree (comments are not
 * tokens, so a note that records the retirement is not a consumer). The file set must be
 * non-empty and parse cleanly.
 *   (a) no identifier spells a retired module or token, and no `CHROME.<retired height>`
 *       member read survives;
 *   (b) no import path names a retired module, and the retired files are absent (their
 *       surviving siblings present);
 *   (c) no source or stylesheet names the retired `.sf-shaft-wrap` class;
 *   (d) THE ONE WRITER: exactly one src file calls setProperty with the painted lengths
 *       (components/nav/ArrowHeader.jsx), and no stylesheet declares them.
 * Each detector is exercised on a planted fixture first, so a broken detector reds here.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { tokenize } from 'espree';
import { describe, expect, test } from 'vitest';

import * as theme from '../../src/components/theme.js';
import { ARROW_VARS } from '../../src/lib/chromeInsets.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

/** The retired modules, by file. */
const RETIRED_FILES = Object.freeze([
  'src/components/nav/NavRibbon.jsx',
  'src/components/nav/FletchBand.jsx',
  'src/components/nav/ShaftWrap.jsx',
  'src/components/nav/ShaftNock.jsx',
  'src/components/nav/NavDivider.jsx',
  'src/components/brand/Lockup.jsx',
  'src/components/brand/GildedWordmark.jsx',
  'src/components/brand/WaxSeal.jsx',
  'src/components/brand/SealImpression.jsx',
]);
const RETIRED_MODULES = RETIRED_FILES.map((f) => f.split('/').pop().replace('.jsx', ''));

/** The retired fixed header heights, as members of CHROME. */
const RETIRED_CHROME = Object.freeze(['headerDesktop', 'headerMobile', 'scrollPadDesktop', 'mapShellOffset']);

/** The war-arrow token block's exports (removed from components/theme.js in the same change). */
const RETIRED_TOKENS = Object.freeze([
  'IDENTITY_EXTENSION', 'SHAFT_SHEEN', 'SHAFT', 'SHAFT_BODY', 'SHAFT_EDGE', 'SHAFT_RIM', 'HEADER_RIDERS',
  'LABEL_BOX', 'SHAFT_STOPS', 'SHAFT_CYLINDER', 'cylinderToneAt', 'riderFloorTone', 'riderGrainShare',
  'GRAIN_AMP', 'SHAFT_GRAIN_TEXTURE', 'GROWTH_AMP', 'SHAFT_GROWTH_TEXTURE', 'PORE_AMP', 'SHAFT_PORE_TEXTURE',
  'SHAFT_GRAIN_LAYERS', 'SHAFT_RULE', 'SHAFT_SAGE', 'SHAFT_STEEL', 'FLETCH_LEAD', 'FLETCH_VANE', 'FLETCH_TIP',
  'FLETCH_BARB', 'FLETCH_SHEEN', 'FLETCH_SHEEN_LIFT', 'FLETCH_RACHIS', 'FLETCH_SPLIT_LIT', 'FLETCH_SEAM',
  'WRAP', 'WRAP_GLOSS', 'WRAP_EDGE', 'WRAP_BARREL', 'WRAP_TURN', 'FLETCH_SHADOW', 'PLATE_KEYLINE', 'GILT',
  'GILT_LIGHT', 'BOLE', 'BOLE_DEEP', 'BOLE_PAD', 'GILD', 'PLATE_LIGHT_DEG', 'LIGHT_UNIT', 'lightOffset',
  'shadowOffset', 'dropShadow', 'contactShadow', 'lightArc', 'SEAL_WAX', 'SEAL_RIM', 'SEAL_GLINT', 'SEAL_FIT',
  'sealSidebearingEm', 'SEAL_LADDER', 'sealRegister', 'FLETCH', 'FLETCH_BARB_DEG', 'FLETCH_HANG',
]);

/** The one writer of the painted lengths. */
const WRITER = 'src/components/nav/ArrowHeader.jsx';
/** The identifiers that name the painted lengths (lib/chromeInsets.js). */
const LENGTH_NAMES = Object.freeze([
  'HEADER_HEIGHT_VAR', 'ARROW_HANG_VAR', 'ARROW_CLEAR_VAR', 'ARROW_BARB_CLEAR_VAR', 'BOTTOM_NAV_H_VAR', 'ARROW_VARS',
]);

function* walk(dir, re) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p, re);
    else if (re.test(name)) yield p;
  }
}

const tokens = (code) => tokenize(code, { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } });

/**
 * One source text's findings.
 * @param {string} code
 */
function scanSource(code) {
  const toks = tokens(code);
  const idents = new Set();
  const retired = [];
  const imports = [];
  let setsProperty = false;
  let namesLength = false;
  toks.forEach((t, i) => {
    if (t.type === 'Identifier' || t.type === 'JSXIdentifier') {
      idents.add(t.value);
      if (RETIRED_TOKENS.includes(t.value) || RETIRED_MODULES.includes(t.value)) retired.push(t.value);
      if (t.value === 'setProperty') setsProperty = true;
      if (LENGTH_NAMES.includes(t.value)) namesLength = true;
      const prev = toks[i - 1];
      const owner = toks[i - 2];
      if (RETIRED_CHROME.includes(t.value) && prev?.value === '.' && owner?.value === 'CHROME') retired.push(`CHROME.${t.value}`);
    }
    if (t.type === 'String' || t.type === 'Template') {
      if (/--sf-(header-h|arrow-hang|arrow-clear|arrow-barb-clear|bottom-nav-h)\b/.test(t.value)) namesLength = true;
      if (toks[i - 1]?.value === 'from' || (toks[i - 1]?.value === '(' && toks[i - 2]?.value === 'import')) {
        const path = t.value.slice(1, -1);
        if (RETIRED_MODULES.some((m) => new RegExp(`/${m}(\\.jsx)?$`).test(path))) imports.push(path);
      }
    }
  });
  return { retired, imports, writesLength: setsProperty && namesLength, idents };
}

const sourceFiles = [...walk(SRC, /\.(js|jsx)$/)].map((p) => relative(ROOT, p).split('\\').join('/')).sort();
const styleFiles = [...walk(SRC, /\.css$/)].map((p) => relative(ROOT, p).split('\\').join('/')).sort();
const scanned = sourceFiles.map((rel) => ({ rel, code: readFileSync(join(ROOT, rel), 'utf8') }));

describe('the detectors fire on planted fixtures', () => {
  test('a CHROME height read, a retired token and a retired import are all caught; comments are not', () => {
    const planted = [
      "import Lockup from './components/brand/Lockup.jsx';",
      "const top = CHROME.headerDesktop; const bg = SHAFT_GRAIN_LAYERS;",
      '// CHROME.headerDesktop and NavRibbon, named in a comment, are history, not consumers',
    ].join('\n');
    const found = scanSource(planted);
    expect(found.retired.sort()).toEqual(['CHROME.headerDesktop', 'Lockup', 'SHAFT_GRAIN_LAYERS']);
    expect(found.imports).toEqual(['./components/brand/Lockup.jsx']);
    const quiet = scanSource('// CHROME.headerDesktop, NavRibbon\nconst x = CHROME.toolbarHeight;');
    expect(quiet.retired).toEqual([]);
    expect(quiet.idents.has('toolbarHeight'), 'presence control: the tokenizer saw the live member').toBe(true);
  });

  test('a writer is a file that sets a property AND names a painted length', () => {
    expect(scanSource("root.setProperty(HEADER_HEIGHT_VAR, '1px');").writesLength).toBe(true);
    expect(scanSource("root.setProperty('--sf-bottom-nav-h', '0px');").writesLength).toBe(true);
    expect(scanSource("root.setProperty(FOOTER_INSET_VAR, '1px');").writesLength).toBe(false);
    expect(scanSource("const top = `calc(var(--sf-header-h) + 8px)`;").writesLength, 'a reader is not a writer').toBe(false);
  });
});

describe('the retired header stays retired', () => {
  test('the walk is not vacuous: the whole src tree tokenized', () => {
    expect(sourceFiles.length).toBeGreaterThan(1000);
    const failures = [];
    for (const { rel, code } of scanned) {
      try { tokens(code); } catch (err) { failures.push(`${rel}: ${err.message}`); }
    }
    expect(failures).toEqual([]);
  });

  test('(a) no src file consumes a retired module, token or CHROME height', () => {
    const consumers = scanned
      .map(({ rel, code }) => ({ rel, hits: scanSource(code).retired }))
      .filter((row) => row.hits.length)
      .map((row) => `${row.rel}: ${[...new Set(row.hits)].join(', ')}`);
    expect(consumers).toEqual([]);
  });

  test('(a) theme.js exports none of the retired names (anchored on its live chrome vocabulary)', () => {
    const exported = Object.keys(theme);
    for (const name of RETIRED_TOKENS) {
      expectAbsentWithAnchor(exported, name, 'CHROME', `theme.js still exports ${name}`);
    }
    for (const member of RETIRED_CHROME) {
      expectAbsentWithAnchor(Object.keys(theme.CHROME), member, 'toolbarHeight', `CHROME.${member} came back`);
    }
  });

  test('(b) no import names a retired module, and the retired files are gone while their siblings stay', () => {
    const importers = scanned.flatMap(({ rel, code }) => scanSource(code).imports.map((p) => `${rel} -> ${p}`));
    expect(importers).toEqual([]);
    expect(existsSync(join(ROOT, 'src/components/nav/NavFlowArrow.jsx')), 'presence control: the bar\'s chevron survives').toBe(true);
    expect(existsSync(join(ROOT, 'src/components/brand/HouseDevice.jsx')), 'presence control: the footer\'s device survives').toBe(true);
    expect(RETIRED_FILES.filter((f) => existsSync(join(ROOT, f)))).toEqual([]);
  });

  test('(c) nothing names the retired .sf-shaft-wrap class', () => {
    const readers = [...sourceFiles, ...styleFiles].filter((rel) => readFileSync(join(ROOT, rel), 'utf8').includes('sf-shaft-wrap'));
    expect(styleFiles.length, 'presence control: the stylesheets were walked').toBeGreaterThan(1);
    expect(readers).toEqual([]);
  });
});

describe('(d) THE ONE WRITER of the painted lengths', () => {
  test('exactly one src file writes them, and it is ArrowHeader', () => {
    const writers = scanned.filter(({ code }) => scanSource(code).writesLength).map(({ rel }) => rel);
    expect(writers).toEqual([WRITER]);
    expect(ARROW_VARS).toEqual(['--sf-header-h', '--sf-arrow-hang', '--sf-arrow-clear', '--sf-arrow-barb-clear', '--sf-bottom-nav-h']);
  });

  test('no stylesheet declares a painted length (they are read, never set, in CSS)', () => {
    const declaring = styleFiles.filter((rel) => {
      const css = readFileSync(join(ROOT, rel), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      return ARROW_VARS.some((name) => new RegExp(`${name}\\s*:`).test(css));
    });
    expect(declaring).toEqual([]);
  });
});

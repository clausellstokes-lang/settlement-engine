/**
 * fontGlyphCoverage.test.js — build gate against PDF "tofu".
 *
 * The dossier PDF embeds exactly eight TTFs (public/fonts: Lora ×4 +
 * Nunito ×4). ⛔ CORRECTED 2026-09-01 — @react-pdf does NOT render an
 * uncovered codepoint as a blank .notdef box. It substitutes a
 * NON-EMBEDDED base-14 Helvetica and truncates to the low byte, so 影
 * prints "q", → prints "’", ⚠ prints nothing. Sections had shipped such
 * literals — so paying customers printed WRONG LETTERS, not boxes.
 *
 * This test is the durable guard. It:
 *   1. Loads the real embedded TTFs with fontkit and builds the set of
 *      codepoints covered by ALL of them (intersection — a glyph is only
 *      safe if every weight/style can draw it, since @react-pdf picks the
 *      face from fontWeight/fontStyle at render time).
 *   2. Parses EVERY .js/.jsx file under src/pdf/ with @babel/parser and
 *      walks only the RENDERED string sources — StringLiteral values,
 *      template-literal static quasis, and JSXText. Comments are AST
 *      trivia, not these node types, so arrow glyphs in doc comments are
 *      correctly ignored.
 *   3. Fails if any such string contains a codepoint that is neither plain
 *      ASCII nor covered by the embedded fonts.
 *
 * ⭐ CORPUS WIDENED 2026-09-01, 23 -> 49 FILES (car C). It read only
 * src/pdf/sections/**\/*.jsx — 23 of the 49 .js/.jsx files under src/pdf/ —
 * so the primitives every section renders THROUGH (Dense, Pill, ProseText,
 * PageChrome …), the whole lib/ view-model layer and theme.js were unguarded.
 * Measured at the widening: 0 offenders in all 49. That is a real 0, not an
 * empty scan: plant a `→` in any string literal in any of the 26 newly added
 * files and the arm for that file reds by name.
 *
 * ⚠ WHY THIS SCANNER AND NOT sectionGlyphTofu.test.js, which the same car was
 * chartered to widen. That one is line-level: it excludes a line only when the
 * line STARTS with a comment marker, so it is blind to `{/* … *\/}` JSX comments
 * AND to trailing `// …` comments. Widening it to these 26 files yields exactly
 * 3 hits, all three of them trailing comments describing regexes (format.js:103,
 * :104, viewModelBodySlices.js:66) — noise, not defects. Curing that needs a
 * comment stripper, and the estate's shared one (tests/helpers/codeOnlySource.js)
 * is WRONG here: `codeOnly` blanks string CONTENTS as well as comments, which is
 * exactly what a glyph scan must read — adopting it would make this gate green and
 * blind. An AST walk gets comment-correctness for free, and its ASCII-or-covered
 * predicate is strictly stronger than a 7-glyph deny-list. So the 26 files are
 * guarded HERE, and sectionGlyphTofu stays a fast belt-and-braces pass over
 * sections/ — deliberately not widened, recorded so it is not re-found as a gap.
 *
 * ⛔ AND NEITHER SCANNER IS A SUBSTITUTE FOR renderedFontEmbedding.test.js. A
 * source scan can only ever see a LITERAL; it cannot see a string composed at
 * render time, or one arriving from generated data or user-authored custom
 * content. That is the render-level arm's job.
 *
 * SupplyChainFlow.jsx documents the ASCII-only convention this enforces.
 * If you need a symbol the fonts lack, either pick an embedded equivalent
 * (see the covered set this test builds) or embed a font that has it.
 */

import { describe, test, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';

// fontkit 2.x is ESM-with-named-exports (no default); grab create() through a
// namespace import so this resolves under whichever build condition Vitest
// picks. create(buffer) avoids the fs-backed openSync (absent from the browser
// build) — we read the TTF ourselves.
const create = fontkit.create || fontkit.default?.create;
// @babel/traverse is CJS; its default export is on `.default` under ESM.
const traverse = _traverse.default || _traverse;

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FONT_DIR = path.join(REPO_ROOT, 'public', 'fonts');
const PDF_DIR = path.join(REPO_ROOT, 'src', 'pdf');

// ── Covered-codepoint set (intersection across every embedded face) ──────────
function buildCoveredCodepoints() {
  const ttfs = fs.readdirSync(FONT_DIR).filter((f) => f.toLowerCase().endsWith('.ttf'));
  expect(ttfs.length).toBeGreaterThan(0);
  let covered = null;
  for (const file of ttfs) {
    const font = create(fs.readFileSync(path.join(FONT_DIR, file)));
    const set = new Set(font.characterSet);
    covered = covered === null ? set : new Set([...covered].filter((cp) => set.has(cp)));
  }
  return covered;
}

// ── Source string collection (rendered strings only, comments excluded) ──────
// .js as well as .jsx: the view-model layer under lib/ composes most of the
// strings the sections merely place, so a jsx-only corpus guarded the placement
// and not the text.
function listSourceFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listSourceFiles(full));
    else if (entry.isFile() && /\.jsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

function collectRenderedStrings(code) {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  const strings = [];
  traverse(ast, {
    StringLiteral({ node }) {
      strings.push({ value: node.value, line: node.loc?.start.line });
    },
    JSXText({ node }) {
      strings.push({ value: node.value, line: node.loc?.start.line });
    },
    TemplateLiteral({ node }) {
      for (const quasi of node.quasis) {
        strings.push({ value: quasi.value.cooked ?? quasi.value.raw, line: quasi.loc?.start.line });
      }
    },
  });
  return strings;
}

const toHex = (cp) => 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');

describe('PDF source: every rendered glyph is embeddable (no substitution)', () => {
  const covered = buildCoveredCodepoints();
  const files = listSourceFiles(PDF_DIR);

  test('embedded fonts exist and cover the ASCII replacements + markers we rely on', () => {
    // Sanity: the set is real, and the specific ASCII/embedded glyphs the
    // sections were migrated to all resolve — so a future font swap that
    // dropped them would fail loud here.
    for (const ch of ['-', '<', '>', '*', '(', ')', '!', '»', '·', '•', '—', '–']) {
      expect.soft(covered.has(ch.codePointAt(0)), `expected font coverage for "${ch}"`).toBe(true);
    }
  });

  test('the whole src/pdf tree is being scanned, not just sections/', () => {
    // 49 files at the widening. The floor is deliberately just under it: a
    // corpus that SHRANK is the failure this arm exists to catch, and a
    // 20-file floor could not have noticed 26 files going missing.
    expect(files.length).toBeGreaterThanOrEqual(45);
    // and the widening is real — sections/ alone can never satisfy the floor
    expect(files.some((f) => !f.includes(`${path.sep}sections${path.sep}`))).toBe(true);
  });

  test.each(files.map((f) => [path.relative(REPO_ROOT, f), f]))(
    '%s renders no non-embeddable codepoint',
    (_rel, file) => {
      const code = fs.readFileSync(file, 'utf8');
      const strings = collectRenderedStrings(code);
      const offenders = [];
      for (const { value, line } of strings) {
        for (const ch of value) {
          const cp = ch.codePointAt(0);
          // Allow all ASCII (control + printable) and anything every
          // embedded font can draw.
          if (cp < 0x80 || covered.has(cp)) continue;
          offenders.push(`line ${line}: ${toHex(cp)} (${JSON.stringify(ch)}) in ${JSON.stringify(value.trim().slice(0, 60))}`);
        }
      }
      // NOT a tofu box: react-pdf substitutes a non-embedded Helvetica and
      // truncates to the low byte, so the customer prints a plausible WRONG
      // letter (→ prints "'", 影 prints "q", ⚠ prints nothing at all).
      expect(offenders, `Non-embeddable glyph(s) would print as the WRONG letter:\n  ${offenders.join('\n  ')}`).toEqual([]);
    },
  );
});

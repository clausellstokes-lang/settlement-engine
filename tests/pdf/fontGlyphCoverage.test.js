/**
 * fontGlyphCoverage.test.js — build gate against PDF "tofu".
 *
 * The dossier PDF embeds exactly eight TTFs (public/fonts: Lora ×4 +
 * Nunito ×4). @react-pdf renders any codepoint the active font lacks as
 * a blank .notdef box ("tofu"). Several sections had shipped literal
 * glyphs absent from every embedded font — arrows (→ ← ↔), a lightning
 * bolt (↯), a four-point star (✦), a warning sign (⚠) — so paying
 * customers printed empty boxes.
 *
 * This test is the durable guard. It:
 *   1. Loads the real embedded TTFs with fontkit and builds the set of
 *      codepoints covered by ALL of them (intersection — a glyph is only
 *      safe if every weight/style can draw it, since @react-pdf picks the
 *      face from fontWeight/fontStyle at render time).
 *   2. Parses every src/pdf/sections/**\/*.jsx file with @babel/parser and
 *      walks only the RENDERED string sources — StringLiteral values,
 *      template-literal static quasis, and JSXText. Comments are AST
 *      trivia, not these node types, so arrow glyphs in doc comments are
 *      correctly ignored.
 *   3. Fails if any such string contains a codepoint that is neither plain
 *      ASCII nor covered by the embedded fonts.
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
const SECTIONS_DIR = path.join(REPO_ROOT, 'src', 'pdf', 'sections');

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
function listJsxFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsxFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.jsx')) out.push(full);
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

describe('PDF sections: every rendered glyph is embeddable (no tofu)', () => {
  const covered = buildCoveredCodepoints();
  const files = listJsxFiles(SECTIONS_DIR);

  test('embedded fonts exist and cover the ASCII replacements + markers we rely on', () => {
    // Sanity: the set is real, and the specific ASCII/embedded glyphs the
    // sections were migrated to all resolve — so a future font swap that
    // dropped them would fail loud here.
    for (const ch of ['-', '<', '>', '*', '(', ')', '!', '»', '·', '•', '—', '–']) {
      expect.soft(covered.has(ch.codePointAt(0)), `expected font coverage for "${ch}"`).toBe(true);
    }
  });

  test('at least the known PDF section files are being scanned', () => {
    expect(files.length).toBeGreaterThanOrEqual(20);
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
      expect(offenders, `Non-embeddable glyph(s) would print as tofu:\n  ${offenders.join('\n  ')}`).toEqual([]);
    },
  );
});

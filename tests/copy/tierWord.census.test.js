/**
 * tierWord.census.test.js — ONE WORD FOR ONE RUNG, ON EVERY READER-FACING SURFACE.
 *
 * ── WHAT THE WALK FOUND (ODQ §934.63 F14) ────────────────────────────────────────────
 * The anonymous public-path walk met the smallest settlement size under two spellings
 * inside one visit: the tier refusal said **"thorpe"**, `/compendium/tier-thorp` rendered
 * **"Thorp"**, and the gallery's TIER chip read **"Thorp"**. The review flagged it as a
 * DECLARED split — "src/config/tierFacts.js:106 declares 'thorpe' deliberate" — and asked
 * for a ruling rather than a silent edit.
 *
 * ── READING THE DECLARATION, WHICH SAYS THE OPPOSITE ─────────────────────────────────
 * It does not declare a split. `src/config/tierFacts.js`, above `SIZE_LABEL`:
 *
 *   "⚠ `thorp` READS AS 'Thorpe' (2026-09-19). The wizard's own size list has always said
 *    so (copy/en.js `generate.sizes.thorp`), and this table said 'Thorp' — two spellings
 *    of one rung, one of them on the refusal sentences lane 28 wired. The reader-facing
 *    label is the wizard's, so the two now agree; the TOKEN is untouched."
 *
 * That is a declaration that the two spellings were UNIFIED, and that exactly one thing
 * stays lower-case and abbreviated: the machine TOKEN `thorp`, which is an id in routes,
 * save data, the tier ladder and every generator. The distinction is real and it is
 * TOKEN vs LABEL — never label vs label. So the chair's rule applies without an exception:
 * ONE reader-facing word, and it is `SIZE_LABEL.thorp`.
 *
 * ── WHAT THIS FILE PINS, AND WHY IT IS A SOURCE CENSUS ───────────────────────────────
 * The word did not drift because anybody disagreed; it drifted because FOUR tables spelled
 * it independently and nothing compared them. A test that imported three of them would go
 * on passing the day a fifth was written, which is the failure that produced the finding.
 * So the census DERIVES the population: it parses every module under `src/` and finds every
 * object literal that maps the tier tokens to strings — a tier-label table by shape, not by
 * name — and holds each one's `thorp` to the one word.
 *
 * ── AND THE SURFACES THAT CASE THE TOKEN INSTEAD OF READING A LABEL ──────────────────
 * Two reader-facing surfaces do not use a table at all: they take the raw token and
 * capitalise it, which can only ever produce "Thorp". They are REGISTERED below rather
 * than cured here, because each needs an authority this lane does not hold — the
 * compendium's label is baked into a byte-pinned generated artifact. The register is
 * shrink-only in the floor censuses' idiom: a third such surface REDS.
 *
 * @enforced-by itself (the census parses the shipped source; the register is executed)
 */

import { describe, expect, test } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { parse } from 'espree';

import { SIZE_LABEL, SIZE_LADDER } from '../../src/config/tierFacts.js';
import { COMPENDIUM_DATA } from '../../src/domain/compendium/generated/compendiumData.generated.js';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

/** The one word, derived rather than restated — the whole point of the file. */
const THE_WORD = SIZE_LABEL.thorp;

/**
 * ⭐ WHAT MAKES AN OBJECT A TIER-**LABEL** TABLE, AND WHY IT IS NOT "KEYED BY THE TOKENS".
 *
 * Keys alone are far too loose, and the first run of this census proved it: twelve objects
 * in `src/` are keyed by the six tier tokens, and seven of them map a tier to something
 * that is not its name — the wizard's size HINTS, the search index's KEYWORDS, a density
 * band word, a prose overlay, a stock-image slug. Holding any of those to "Thorpe" would
 * be nonsense, and exempting them by path would be the hand-kept list this census exists
 * against.
 *
 * So the predicate is CONTENT-DERIVED and self-checking: an object is a label table when
 * at least MIN_AGREE of its rungs OTHER than `thorp` already spell that rung exactly as
 * `SIZE_LABEL` does. A table that agrees about Hamlet, Village, Town, City and Metropolis
 * and disagrees about Thorpe is precisely the drift F14 found; a table that agrees about
 * none of them is not naming tiers at all. Exact case, deliberately — a lower-case
 * `{ hamlet: 'hamlet' }` map is a slug table, not a reader's words.
 */
const MIN_AGREE = 3;

/** Depth-first over every AST node, a local walk so this census owns its own scanner. */
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
      } else if (v && typeof v.type === 'string') stack.push(v);
    }
  }
}

/** Every `.js`/`.jsx` under src/, tests and generated artifacts excluded. */
function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSource(p, out);
    else if (/\.jsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

/**
 * Every tier-label table in one module, as `{ where, thorp, rungs }`.
 * @param {string} src
 * @param {string} rel
 */
function tablesIn(src, rel) {
  const found = [];
  let ast;
  // A parse failure THROWS rather than skipping: a scanner that silently drops what it
  // cannot read is the vacuity this census exists against. espree with the settings
  // eslint.config.js itself uses, so what parses here parses there.
  try {
    ast = parse(src, { ecmaVersion: 2024, sourceType: 'module', loc: true, ecmaFeatures: { jsx: true } });
  } catch (e) { throw new Error(`${rel} did not parse: ${e.message}`, { cause: e }); }
  eachNode(ast, (node) => {
    if (node.type !== 'ObjectExpression') return;
    /** @type {Record<string, string>} */
    const rungs = {};
    for (const p of node.properties) {
      if (p.type !== 'Property' || p.computed) continue;
      const key = p.key?.name ?? p.key?.value;
      if (!SIZE_LADDER.includes(key) && key !== 'capital') continue;
      if (p.value?.type === 'Literal' && typeof p.value.value === 'string') rungs[key] = p.value.value;
    }
    const agree = Object.entries(rungs).filter(([k, v]) => k !== 'thorp' && v === (SIZE_LABEL[k] ?? null)).length;
    if (agree < MIN_AGREE) return;
    found.push({
      where: `${rel}:${node.loc.start.line}`,
      thorp: rungs.thorp ?? null,
      rungs: Object.keys(rungs).length,
    });
  });
  return found;
}

const FILES = walkSource(SRC).map((p) => relative(ROOT, p).replace(/\\/g, '/')).sort();
const TABLES = FILES.flatMap((rel) => tablesIn(readFileSync(join(ROOT, rel), 'utf8'), rel));

/**
 * ⛔ THE REGISTER — the reader-facing surfaces that derive the word by CASING THE TOKEN
 * rather than reading a label, with the authority each one needs.
 *
 * `owner` is a handover, not a verdict, exactly as it is in the phone-floor censuses: the
 * row says who must act, and the arm below refuses a register that has GROWN. When a row
 * is cured it is deleted, and when the last one goes the register goes with it.
 */
const TOKEN_CASED = Object.freeze({
  'the Compendium tier entries': Object.freeze({
    site: 'scripts/generate-compendium-data.mjs `tiers: TIER_ORDER.map(id => ({ label: titleCase(id) }))`',
    reads: '/compendium (the Tiers tab, and `/compendium/tier-thorp`), via COMPENDIUM_DATA.tiers[].label',
    owner: 'the chair: the label is baked into src/domain/compendium/generated/compendiumData.generated.js, '
      + 'which tests/docs/compendiumDataFreshness.test.js pins BYTE-IDENTICAL. Curing it means editing the '
      + 'generator to read SIZE_LABEL and regenerating a pinned artifact, which is a record change and '
      + 'outside a display-only lane.',
  }),
  'the gallery facet chips': Object.freeze({
    site: "src/components/gallery/GallerySidebar.jsx + GalleryCard.jsx + GalleryDetail.jsx, `textTransform: 'capitalize'` over galleryUtils.TIER_OPTIONS",
    reads: '/gallery (the TIER filter chips and the card/detail meta rows)',
    owner: 'the chair: the same CSS capitalises every facet value the gallery draws (terrain, status, tags), '
      + 'not only the tier, so re-pointing the tier at SIZE_LABEL is a change to how the gallery names ALL '
      + 'its facets and wants one decision rather than one word.',
  }),
});

describe('THE TIER WORD — one spelling for one rung', () => {
  test('the walk is live: it read src/, found tier tables, and has a word to hold them to', () => {
    // ⛔ ANTI-VACUITY. Two arms below assert over a derived list, which an empty walk also
    // satisfies — and an empty walk is exactly what a moved tree or a broken parse gives.
    expect(FILES.length, 'the census read no source files — has src/ moved?').toBeGreaterThanOrEqual(500);
    expect(
      TABLES.length,
      'the census found no tier-label table at all — the shape it looks for has changed',
    ).toBeGreaterThanOrEqual(5);
    expect(SIZE_LADDER.length, 'the tier ladder is empty').toBe(6);
    expect(THE_WORD, 'SIZE_LABEL no longer spells the smallest rung').toBe('Thorpe');

    // ⛔ THE DETECTOR DISCRIMINATES, EXECUTED ON REAL SOURCE STRINGS. Without this the arm
    // below asserts an empty list, which a predicate that had stopped predicating also
    // produces. Each control is one of the shapes the first run actually met in `src/`.
    const convicted = tablesIn("export const A = { thorp: 'Thorp', hamlet: 'Hamlet', village: 'Village', town: 'Town' };", 'c.js');
    expect(convicted.length, 'a table agreeing on three rungs is no longer read as a label table').toBe(1);
    expect(convicted[0].thorp, 'the convicting value is not carried out of the scan').toBe('Thorp');
    expect(
      tablesIn("export const A = { thorp: 'a few households', hamlet: 'a handful', village: 'c', town: 'd' };", 'c.js'),
      "the wizard's size HINTS are read as a label table",
    ).toEqual([]);
    expect(
      tablesIn("export const A = { thorp: 'thorp', hamlet: 'hamlet', village: 'village', town: 'town' };", 'c.js'),
      'a lower-case SLUG map is read as a reader-facing label table',
    ).toEqual([]);
    expect(
      tablesIn('export const A = { thorp: 1, hamlet: 2, village: 3, town: 4 };', 'c.js'),
      'a numeric tier map is read as a label table',
    ).toEqual([]);
  });

  test('every tier-label table in src/ spells the smallest rung the one way', () => {
    const wrong = TABLES.filter((t) => t.thorp !== null && t.thorp !== THE_WORD)
      .map((t) => `  ${t.where}  ${t.rungs} rungs, thorp = "${t.thorp}"`);
    expect(
      wrong,
      `\nA tier-label table spells the smallest rung something other than "${THE_WORD}".\n`
      + 'ODQ §934.63 F14: one word on every reader-facing surface. The TOKEN stays `thorp` — it is an id in '
      + 'routes, saves, the ladder and every generator, and nothing here asks you to rename it. What a '
      + 'READER is shown comes from config/tierFacts.js SIZE_LABEL and from copy/en.js `generate.sizes`, '
      + 'and those two agree.\n'
      + 'If a surface genuinely needs a different word, it needs a ruling, not an edit: the last time two '
      + 'spellings shipped, a visitor met both inside one visit.\n'
      + `${wrong.join('\n')}\n`,
    ).toEqual([]);
  });

  test('the estate has MORE than one such table, so the arm above is comparing something', () => {
    // If the tree ever collapses to a single table this file has done its job and should
    // be re-read rather than kept as a green that means nothing.
    const withThorp = TABLES.filter((t) => t.thorp !== null);
    expect(withThorp.length, 'only one tier-label table names thorp — re-read this census').toBeGreaterThanOrEqual(5);
    // And they really are in different layers, which is why a shared import was not the cure.
    const layers = new Set(withThorp.map((t) => t.where.split('/').slice(0, 2).join('/')));
    expect(layers.size, 'every tier table now lives in one layer — fold them into one export instead')
      .toBeGreaterThanOrEqual(2);
  });

  test('THE REGISTER: the token-cased surfaces are named, executed, and may only shrink', () => {
    const rows = Object.entries(TOKEN_CASED);
    expect(
      rows.length,
      '\nA reader-facing surface is deriving the tier word by capitalising the TOKEN. That can only ever '
      + 'produce "Thorp", which is the split ODQ §934.63 F14 recorded. Point it at config/tierFacts.js '
      + 'SIZE_LABEL — or, if it truly needs an authority this register does not have, say which and why.\n',
    ).toBeLessThanOrEqual(2);
    for (const [name, row] of rows) {
      expect(row.owner.length, `"${name}" names no authority`).toBeGreaterThan(60);
      expect(row.reads.length, `"${name}" does not say what a reader sees`).toBeGreaterThan(10);
    }
    // ⛔ LIVE, not asserted: the compendium row's claim is re-derived from the shipped
    // artifact on every run. The day it stops saying "Thorp" the row has been cured and
    // must be deleted rather than left standing as coverage of nothing.
    const tier = COMPENDIUM_DATA.tiers.find((t) => t.id === 'thorp');
    expect(tier, 'the compendium artifact no longer carries the thorp rung').toBeTruthy();
    expect(
      tier.label,
      `the Compendium now spells the rung "${tier.label}" — if that is "${THE_WORD}", DELETE the register `
      + 'row, because the handover it describes is done',
    ).toBe('Thorp');
  });
});

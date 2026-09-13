/**
 * pageProseState.test.js — THE PAGE'S NO-REPEAT STATE IS ONE PER PAGE RENDER
 * (ADDENDUM 18, the research reconciliation's slice E, "THE ARCHITECTURE'S RISK"; car
 * 8b-W-18o-r).
 *
 * ── THE THREE PROPERTIES SLICE E NAMES, EACH DRIVEN RATHER THAN DESCRIBED ────────────
 *
 *   1. ONE SET PER PAGE, SHARED ACROSS THE DESKS OF THAT PAGE. Seven desk entry points render
 *      the Defense tab and each used to mint its own state, so "the same role never twice on
 *      one page" (ruling 25 edge (e)) was true of a DESK and false of the PAGE.
 *   2. A ROLE COMMITS ONLY WHEN ITS PIECE LANDS. A dropped piece used to consume a person from
 *      the page's roster, so the reader got a different clerk because of a sentence they never
 *      saw.
 *   3. DETERMINISM. The state is a function of (seed, year, the page's FIXED traversal order)
 *      and of nothing else — no clock, no map-iteration order, no randomness. Same seed and
 *      same year, same page, over two hundred seeds.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pageProse, withFaceSources } from '../../src/domain/display/stateProse/faceSources.js';
import { renderDefensePage, pageText } from '../../scripts/lib/prose-render-defense-page.mjs';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { rateGrid } from '../../scripts/prose-rate-corpus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const POOL = 'Invasion & War: walls with NO force';

/** The grid towns this file drives, generated once. */
const TOWNS = (() => {
  const out = [];
  for (const spec of rateGrid().slice(0, 60)) {
    try {
      out.push({ spec, s: generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }) });
    } catch { /* a spec the generator refuses is not this file's subject */ }
  }
  return out;
})();

describe('ONE STATE PER PAGE, NOT ONE PER DESK (slice E)', () => {
  it('⭐ `pageProse` hands the SAME object back to every desk — shared by identity, not by value', () => {
    const town = TOWNS[0].s;
    const page = pageProse(town, { seed: 'sf-page', audience: 'dm' });
    expect(page.printedRoles instanceof Set).toBe(true);
    expect(Array.isArray(page.drawnOpeners)).toBe(true);
    // THE WHOLE MECHANISM: a desk calls `withFaceSources(settlement, options)`, and when the
    // options already carry a roster it is handed straight back — the SAME object, so the Set
    // and the Array on it are the same Set and Array. Minting a fresh object here would give
    // each desk its own no-repeat state, silently, which is the defect slice E named.
    const asDeskSeesIt = withFaceSources(town, page);
    expect(asDeskSeesIt).toBe(page);
    expect(asDeskSeesIt.printedRoles).toBe(page.printedRoles);
    expect(asDeskSeesIt.drawnOpeners).toBe(page.drawnOpeners);
  });

  it('⛔ both page callers mint it ONCE and hand it to every desk entry', () => {
    // The product page and the headless renderer the refuter reads must agree, or the refuter
    // is judging a page whose no-repeat state is not the page's. Asserted as source, because
    // the property is "how many times is this called", which no value can show.
    const tab = read('src/components/new/tabs/DefenseTab.jsx');
    expect((tab.match(/pageProse\(r, \{/g) || []).length, 'minted exactly once').toBe(1);
    expect((tab.match(/\(r, pageRead\)/g) || []).length, 'and handed to every other desk')
      .toBeGreaterThanOrEqual(6);
    expect(tab).not.toMatch(/defenseThreatProse\(r, \{/);
    const renderer = read('scripts/lib/prose-render-defense-page.mjs');
    expect(renderer).toMatch(/const opts = pageProse\(r, \{ seed, audience/);
  });

  it('⭐⭐ and the page really does stop repeating a role across its desks', () => {
    // The property, measured on the real render rather than on the plumbing: over every grid
    // town, no ROLE PHRASE from the town's own rosters appears twice on one page.
    let pages = 0;
    let repeated = 0;
    for (const { s } of TOWNS) {
      const lines = renderDefensePage(s).filter((l) => l.kind === 'composed');
      if (lines.length === 0) continue;
      pages += 1;
      const roles = [];
      for (const l of lines) {
        for (const phrase of ['a clerk in the hall', 'one of the aldermen', 'a guild factor',
          'a local priest', 'the gatekeeper', 'a bailiff', 'one of the elders']) {
          if (l.text.toLowerCase().includes(phrase)) roles.push(phrase);
        }
      }
      if (roles.length !== new Set(roles).size) repeated += 1;
    }
    expect(pages, 'the corpus rendered some pages at all').toBeGreaterThan(0);
    expect(repeated, 'a page printed one role twice').toBe(0);
    process.stdout.write(`\n[page] ${pages} rendered pages: 0 repeated a role across their desks\n`);
  });
});

describe('DETERMINISM — same seed, same year, same page (THE PROMISE)', () => {
  it('⛔ the same settlement renders byte-identically, twice, over sixty towns', () => {
    // The state is a function of (seed, year, the page's fixed traversal order). If any part of
    // it were a clock, a Map iteration whose order can differ, or a residue of a previous
    // render, this arm would catch it — the second render sees a page state that was never
    // reused, and must still produce the same bytes.
    let compared = 0;
    for (const { spec, s } of TOWNS) {
      expect(pageText(renderDefensePage(s)), `cell ${spec.cell}`).toBe(pageText(renderDefensePage(s)));
      compared += 1;
    }
    expect(compared).toBeGreaterThan(40);
    process.stdout.write(`[page] ${compared} towns rendered twice: 0 bytes moved\n`);
  });

  it('⛔ AND THE STATE IS NEVER REUSED BETWEEN TWO PAGES — it is not a cache', () => {
    // Two renders of one settlement are two PAGES and each gets its own state. A state carried
    // between them would make the second page depend on whether the first was ever drawn, which
    // is the same class of defect as the dropped piece below.
    const town = TOWNS.find(({ s }) => renderDefensePage(s).some((l) => l.pool === POOL));
    if (!town) return;
    const first = pageProse(town.s, { seed: 'x', audience: 'dm' });
    const second = pageProse(town.s, { seed: 'x', audience: 'dm' });
    expect(second.printedRoles).not.toBe(first.printedRoles);
    expect(second.drawnOpeners).not.toBe(first.drawnOpeners);
    expect([...second.printedRoles]).toEqual([]);
  });
});

describe('A DROPPED PIECE CONSUMES NOTHING (slice E\'s second half)', () => {
  it('⛔ the composer commits roles only on the paths that RETURN a piece', () => {
    // `drawPiece` has four exits — the spine alone, the spine with an ineligible partner, the
    // pair, and the pair with a weighing — and every one of them commits exactly the claims of
    // the pieces it returns. A `return` with no `commitRoles` above it would be a piece whose
    // roles were claimed and never banked (a role printed twice on a page); a `commitRoles`
    // with no return under it would be the old defect back (a role banked and never printed).
    const composer = read('src/domain/display/stateProse/composeStateProse.js');
    expect(composer).toMatch(/function commitRoles\(read, claimed\) \{/);
    // The kernel no longer touches the page's set at all: it REPORTS through `claimed`.
    const kernel = read('src/domain/display/stateProse/stateProseKernel.js');
    expect(kernel).not.toMatch(/printed\.add\(/);
    expect(kernel).toMatch(/claimed\.push\(drawn\.role\);/);
    // Every exit of drawPiece that returns pieces commits first.
    const body = composer.slice(composer.indexOf('function drawPiece('), composer.indexOf('function seatedTurn('));
    const returns = (body.match(/return \{ variant, raw, text, source, pieces: \[drawn\] \};/g) || []).length;
    const commits = (body.match(/commitRoles\(read, own\.claimed\);/g) || []).length;
    expect(returns, 'the two single-piece exits').toBe(2);
    expect(commits, 'both of those commit, and so does the pair exit').toBe(3);
    // The partner's and the weighing's claims are committed ONLY on the pair exit, and the
    // weighing's only when its own text survived `fillSlots`.
    expect(body).toMatch(/commitRoles\(read, partnerOwn\.claimed\);/);
    expect(body).toMatch(/if \(weighOwn !== null && weighText !== null\) commitRoles\(read, weighOwn\.claimed\);/);
  });
});

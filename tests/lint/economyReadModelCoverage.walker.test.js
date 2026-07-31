/**
 * economyReadModelCoverage.walker.test.js — Wave R-4 STRUCTURAL PREVENTION for
 * the economy stale-derivation window (docs/CAPABILITY_REMEDIATION_PLAN.md).
 *
 * THE CLASS THIS KILLS. applyEvent mutates institutions / resources / trade
 * config, but reconcileSettlementChange runs no economy pass, so the derived
 * economy read-models (economicState, prosperity, activeChains,
 * availableServices) keep their generation-time values until the next full
 * rebuild. Wave R-3 declared that honestly on three tabs — and the R-3
 * verification then MEASURED four more live surfaces reading the same stale
 * models with no caveat at all. The bug was not the three tabs; it was that
 * "which surfaces read the economy" lived in nobody's head and nothing failed
 * when a new one landed.
 *
 * THE GUARANTEE. This is a fail-closed source-scan census (the E-B walker
 * pattern). Every file under src/components and src/pdf that reads an economy
 * read-model must be classified into EXACTLY ONE of four buckets, and the
 * union of the four lists must EQUAL the scanned census — both directions:
 *   - an UNCLASSIFIED new reader reds ("a new reader cannot land uncovered");
 *   - a STALE entry whose file no longer reads the economy reds too, so the
 *     lists can never rot into decoration.
 *
 * THE FOUR BUCKETS (the same taxonomy the prose of
 * src/domain/display/economyFreshness.js tells; this file is the authority and
 * the docblock parity is pinned below):
 *   COVERED         — renders the shared note leaf
 *                     src/components/new/EconomyFreshnessNote.jsx.
 *   FRAMED          — carries the standing "as judged at the first survey"
 *                     whole-tab framing instead; the event note would
 *                     double-caveat one tab.
 *   PRINT_DEFERRED  — src/pdf only. A printed dossier is a snapshot by nature
 *                     and the print voice is owner-parked; standing deferral.
 *   FROZEN_DEFERRED — reaches an economy read-model but owns no user-facing
 *                     freshness claim. Each entry carries its written reason.
 *
 * SINGLE HOME. The two sentences are minted once (economyFreshness.js) and
 * rendered once (EconomyFreshnessNote.jsx). Both are pinned here, so the
 * "fourth hand-copied string" that R-3 refused to write cannot be written by
 * anyone later either.
 *
 * KNOWN BLIND SPOTS (deliberate, so nobody re-discovers them as findings):
 *   - The scan is textual, so a COMMENT naming a read-model classifies its
 *     file. That over-classifies, never under-classifies; fail-closed is the
 *     safe direction.
 *   - A surface that reaches an economy read-model only through a helper it
 *     imports (DailyLifeTab via new/dailyLifeLogic.js) is invisible to the
 *     pattern; the helper is classified, the tab is not. Recorded in
 *     economyFreshness.js under NOT COVERED BY DESIGN.
 */

import { describe, expect, test } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const SCAN_ROOTS = ['src/components', 'src/pdf'];

const NOTE_LEAF = 'src/components/new/EconomyFreshnessNote.jsx';
const DETECTOR = 'src/domain/display/economyFreshness.js';

/**
 * What counts as reading a derived economy read-model. `prosperity` needs a
 * code-shaped context (property access, object key, the label helper) because
 * the bare word is ordinary product prose in help copy and compendium text.
 */
const READ_PATTERNS = [
  ['quickGuide', /\bcomposeSettlementQuickGuide\b/],
  // The OTHER composer over the economy read-models: tonightAtTheTable folds
  // economicState.prosperity into its scene lines, so a surface that reaches
  // the models only through it is still an economy reader (R-4 verify probe:
  // src/pdf/SettlementPDF.jsx and src/pdf/variants.js sat in exactly that hole).
  ['tonightAtTheTable', /\btonightAtTheTable\b/],
  ['economicState', /\beconomicState\b/],
  ['activeChains', /\bactiveChains\b/],
  ['availableServices', /\bavailableServices\b/],
  ['prosperity', /\.prosperity\b|\bprosperity\s*:|\bprosperityLabel\b|\[['"]prosperity['"]\]/],
];

// ── The four frozen classifications ──────────────────────────────────────────

/** Renders the shared note leaf. */
const COVERED = [
  'src/components/TableView.jsx',
  'src/components/new/SummaryTab.jsx',
  'src/components/new/SummaryTabV2.jsx',
  'src/components/new/tabs/EconomicsTab.jsx',
  'src/components/new/tabs/ServicesTab.jsx',
  'src/components/session/SessionMode.jsx',
];

/** Carries the standing first-survey framing instead. */
const FRAMED = [
  'src/components/new/tabs/DefenseTab.jsx',
  'src/components/new/tabs/OverviewTab.jsx',
  'src/components/new/tabs/ViabilityTab.jsx',
];

/** The standing print deferral — every economy reader under src/pdf. */
const PRINT_DEFERRED = [
  'src/pdf/SettlementPDF.jsx',
  'src/pdf/lib/headlines.js',
  'src/pdf/lib/liveWorld.js',
  'src/pdf/lib/viewModel.js',
  'src/pdf/sections/Cover.jsx',
  'src/pdf/sections/EconomicsTrade.jsx',
  'src/pdf/sections/IdentityDailyLife.jsx',
  'src/pdf/sections/Overview.jsx',
  'src/pdf/sections/Services.jsx',
  'src/pdf/sections/SupplyChainFlow.jsx',
  'src/pdf/sections/TonightAtTheTable.jsx',
  'src/pdf/variants.js',
];

/** Reaches a read-model, owns no freshness claim. Reason is mandatory. */
const FROZEN_DEFERRED = {
  'src/components/map/heraldRegister.js':
    'Gazetteer register rows: prosperity is banded into ONE word inside a glance sentence ("A prosperous town, at peace") — a register makes no freshness claim, and every row entity-links straight into the settlement dossier where the COVERED surfaces own the note. A second note per roster row would be noise, not honesty.',
  'src/components/OutputContainer.jsx':
    'Routing only: hands s.availableServices to ServicesTab as a prop. The covered child owns the note; a second one here would double it.',
  'src/components/ShareToGallery.jsx':
    'Writes a gallery FACET (facetProsperity) onto a published record. Not a reader-facing economy display, and the published snapshot is a snapshot by definition.',
  'src/components/dossier/EngineSections.jsx':
    'Dead code: zero importers in src (verified by import census). Classified rather than cured; retire-vs-wire is the owner queue.',
  'src/components/dossier/proseFieldLabels.js':
    'Pure frozen label vocabulary (zero imports, no render surface) extracted from WorkbenchProseEditor: the economicState mentions are path string literals naming AUTHORED safetyProfile prose fields, and each such label itself already says "as first surveyed". The editor now reaches these paths only through this map, so it left the census (the documented helper shape).',
  'src/components/gallery/GallerySidebar.jsx':
    'Gallery filter chips over published rows (filters.prosperity), not a live settlement read-model.',
  'src/components/gallery/galleryUtils.js':
    'Gallery facet vocabulary; the economicState.prosperity mention is a comment naming the label source.',
  'src/components/new/SupplyChainsPanel.jsx':
    'Child of a covered surface: mounted only inside EconomicsTab (and ChainRow inside SupplyChainsManager). The host tab carries the note above it.',
  'src/components/new/dailyLifeLogic.js':
    'Derived-prose selection only: reads prosperity band + activeChains to CHOOSE descriptive paragraphs for DailyLifeTab, never to print a tally or a count.',
  'src/components/new/tabHelpers.js':
    'Pure helper (computeChainSets / computeChainDepthMap) with no render surface of its own; its callers are classified.',
};

// ── The census ───────────────────────────────────────────────────────────────

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walk(abs, out);
    else if (/\.(js|jsx)$/.test(entry) && !/\.test\./.test(entry)) out.push(abs);
  }
  return out;
}

/** @returns {Map<string, string[]>} rel path → which read-model patterns hit */
function censusEconomyReaders() {
  const found = new Map();
  for (const root of SCAN_ROOTS) {
    for (const abs of walk(join(ROOT, root))) {
      const src = readFileSync(abs, 'utf8');
      const hits = READ_PATTERNS.filter(([, re]) => re.test(src)).map(([name]) => name);
      if (hits.length) found.set(relative(ROOT, abs).replace(/\\/g, '/'), hits);
    }
  }
  return found;
}

const census = censusEconomyReaders();
const classified = [
  ...COVERED,
  ...FRAMED,
  ...PRINT_DEFERRED,
  ...Object.keys(FROZEN_DEFERRED),
];

describe('economy read-model census — fail closed on an unclassified reader', () => {
  test('guard-the-guard: the scan is not vacuous and the patterns really fire', () => {
    // If the walker or the regexes silently broke, every assertion below would
    // pass over an empty set. Today the census is 30 files.
    expect(census.size).toBeGreaterThanOrEqual(25);
    // Each pattern must be earning its place — a dead pattern is a blind spot.
    for (const [name] of READ_PATTERNS) {
      const hitters = [...census.values()].filter((hits) => hits.includes(name));
      expect(hitters.length, `read-model pattern "${name}" matched NOTHING — it is a dead detector`).toBeGreaterThan(0);
    }
  });

  test('EXACT SET: every economy reader is classified, and no classification is stale', () => {
    const unclassified = [...census.keys()].filter((rel) => !classified.includes(rel));
    expect(
      unclassified,
      '\nNEW economy read-model reader(s) with no classification. A surface that renders '
      + 'economicState / prosperity / activeChains / availableServices (or the quick guide, '
      + 'whose "How it lives" truth folds them) must be placed in exactly one bucket in '
      + 'tests/lint/economyReadModelCoverage.walker.test.js:\n'
      + '  COVERED         — render <EconomyFreshnessNote> (the usual answer for a new live surface)\n'
      + '  FRAMED          — the tab already carries the first-survey framing sentence\n'
      + '  PRINT_DEFERRED  — it is a src/pdf chapter (standing print deferral)\n'
      + '  FROZEN_DEFERRED — it owns no freshness claim; write the reason\n'
      + `Unclassified:\n${unclassified.join('\n')}\n`,
    ).toEqual([]);

    const stale = classified.filter((rel) => !census.has(rel));
    expect(
      stale,
      `\nClassified file(s) that no longer read an economy read-model — delete their entries `
      + `so the lists stay honest:\n${stale.join('\n')}\n`,
    ).toEqual([]);
  });

  test('the four buckets are disjoint (one file, one classification)', () => {
    const seen = new Set();
    const doubled = classified.filter((rel) => (seen.has(rel) ? true : (seen.add(rel), false)));
    expect(doubled, `file(s) claimed by two buckets:\n${doubled.join('\n')}`).toEqual([]);
  });
});

describe('each bucket means what it says', () => {
  test('COVERED surfaces really render the shared note leaf', () => {
    for (const rel of COVERED) {
      const src = read(rel);
      expect(
        /import\s+EconomyFreshnessNote\s+from\s+['"][^'"]*EconomyFreshnessNote\.jsx['"]/.test(src),
        `${rel} is classified COVERED but does not import the shared note leaf`,
      ).toBe(true);
      expect(
        /<EconomyFreshnessNote\b/.test(src),
        `${rel} imports the note leaf but never renders it`,
      ).toBe(true);
      // The variant is explicit at every site: 'catalog' for the services
      // catalog, 'tallies' everywhere figures are counted. An implicit default
      // would make the wrong noun silent.
      expect(
        /<EconomyFreshnessNote[\s\S]{0,240}?variant="(tallies|catalog)"/.test(src),
        `${rel} renders the note without an explicit variant`,
      ).toBe(true);
    }
  });

  test('FRAMED tabs really carry the first-survey framing', () => {
    for (const rel of FRAMED) {
      expect(
        read(rel).includes('at the first survey'),
        `${rel} is classified FRAMED but carries no first-survey framing sentence`,
      ).toBe(true);
    }
    // ...and they must NOT also carry the event note (that is the double-caveat
    // this bucket exists to prevent).
    for (const rel of FRAMED) {
      expect(
        read(rel).includes('EconomyFreshnessNote'),
        `${rel} is FRAMED yet also renders the event note — pick one caveat`,
      ).toBe(false);
    }
  });

  test('PRINT_DEFERRED is exactly the src/pdf half of the census', () => {
    const pdfReaders = [...census.keys()].filter((rel) => rel.startsWith('src/pdf/')).sort();
    expect(PRINT_DEFERRED.slice().sort()).toEqual(pdfReaders);
  });

  test('every FROZEN_DEFERRED entry carries a real written reason', () => {
    for (const [rel, reason] of Object.entries(FROZEN_DEFERRED)) {
      expect(typeof reason === 'string' && reason.trim().length >= 40, `${rel}: reason too thin`).toBe(true);
    }
    // A frozen deferral that quietly grew a note is a lie in the other
    // direction — promote it to COVERED instead of leaving the list wrong.
    for (const rel of Object.keys(FROZEN_DEFERRED)) {
      expect(
        read(rel).includes('<EconomyFreshnessNote'),
        `${rel} is FROZEN_DEFERRED but now renders the note — move it to COVERED`,
      ).toBe(false);
    }
  });
});

describe('the sentence and the paragraph each have exactly ONE home', () => {
  test('the freshness sentence is minted only in the detector module', () => {
    const NEEDLE = 'last survey may not be fully counted';
    const minting = walk(join(ROOT, 'src'))
      .map((abs) => relative(ROOT, abs).replace(/\\/g, '/'))
      .filter((rel) => read(rel).includes(NEEDLE));
    expect(
      minting,
      '\nThe freshness sentence must exist in exactly one file '
      + `(${DETECTOR}). A second copy is the hand-copy drift class Wave R-4 removed; `
      + `import ECONOMY_FRESHNESS_SENTENCES instead:\n${minting.join('\n')}\n`,
    ).toEqual([DETECTOR]);
  });

  test('the detector is consumed only by the one note leaf', () => {
    const consumers = walk(join(ROOT, 'src'))
      .map((abs) => relative(ROOT, abs).replace(/\\/g, '/'))
      .filter((rel) => rel !== DETECTOR)
      .filter((rel) => /from\s+['"][^'"]*display\/economyFreshness\.js['"]/.test(read(rel)));
    expect(
      consumers,
      '\nOnly the shared note leaf may consume the freshness detector — a surface that calls '
      + 'economyShiftSinceSurvey directly is hand-rolling the paragraph again:\n'
      + `${consumers.join('\n')}\n`,
    ).toEqual([NOTE_LEAF]);
  });

  test('the note leaf renders the sentence conditionally, never as ambient chrome', () => {
    const src = read(NOTE_LEAF);
    // Fresh settlement ⇒ no element at all, which is what keeps every host
    // byte-identical in the un-shifted world.
    expect(/if\s*\(!text\)\s*return null;/.test(src)).toBe(true);
    expect(src.includes('economyFreshnessNote(settlement, variant)')).toBe(true);
  });
});

describe('the prose taxonomy and this walker cannot drift apart', () => {
  test('economyFreshness.js names every COVERED and FRAMED surface', () => {
    const doc = read(DETECTOR);
    for (const rel of [...COVERED, ...FRAMED]) {
      const base = rel.split('/').pop();
      expect(
        doc.includes(base),
        `${DETECTOR} tells the classification story but never names ${base} — update its docblock`,
      ).toBe(true);
    }
  });

  test('economyFreshness.js points at this walker as the authority', () => {
    expect(read(DETECTOR)).toContain('tests/lint/economyReadModelCoverage.walker.test.js');
  });
});

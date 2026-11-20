/** @vitest-environment jsdom */
/**
 * TAIL-CRISIS-7 · K26 (the chair's ruling of 2026-11-15 04:08 UTC): A POWER NAMED IN A STAKE ROW TAKES ITS FORM FROM THE
 * ONE LEAF WHERE THE ROW IS A SENTENCE (`domain/display/powerSentenceName.js`). The row "<power> split · <reason>" is a
 * sentence on the Crisis tab, the PDF's Crisis sections and the journal's Crisis page, and the three printed the roster's
 * label raw: "Military/Guard split", "Third Bloc (Neutrals) split", "Crown Creditors (Noble Coalition) split". Measured on
 * the census's 720 at e4799144c: 125 such rows in 122 towns (Military/Guard 116: loses 45, at odds 26, split 24, gains 21;
 * Third Bloc (Neutrals) 4; Crown Creditors (Noble Coalition) 2; the two Noble Claimant lines 1 each; Monster Hunters /
 * Adventurers 1). Each surface now prints the leaf's prose form; the tab's door still opens the power; a power whose label
 * is already a name prints as before (the KEEP half, in the same rows of the same towns).
 *
 * THIS FILE REDS WHEN a surface prints a stake row under a label the leaf re-forms, or stops printing the re-formed row,
 * or re-forms a power whose label is already a name. The births are the census's own (r2s-<crisis>-<size>-<i>).
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { composeCrisisPage, CRISIS_PAGE_COPY } from '../../src/domain/crisis/crisisPage.js';
import { stakeLines } from '../../src/pdf/lib/crisisPrint.js';
import { PROSE_FORMS, powerSentenceName } from '../../src/domain/display/powerSentenceName.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { CrisisSections } from '../../src/pdf/sections/CrisisSections.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

window.matchMedia = window.matchMedia || vi.fn((query) => ({ media: query, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
const cfgFor = (seed) => {
  const m = /^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  if (!m) throw new Error(seed);
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
};

/** The census towns, one per label and stake the leaf re-forms (each the first crisis town of its kind on the 720). */
const SEEDS = [
  'r2s-under_siege-village-3', // Military/Guard split
  'r2s-occupied-city-2', // Military/Guard loses
  'r2s-famine-village-1', // Military/Guard gains
  'r2s-politically_fractured-town-2', // Military/Guard is already at odds
  'r2s-politically_fractured-town-3', // Third Bloc (Neutrals) split
  'r2s-indebted-metropolis-3', // Crown Creditors (Noble Coalition) split
  'r2s-monster_pressure-metropolis-2', // Monster Hunters / Adventurers loses
];

/** @type {Record<string, any>} */
const born = {};
/** @type {Record<string, string[]>} the tab's stake rows per town, rendered once */
const tabOf = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  const { default: CrisisTab } = await import('../../src/components/new/tabs/CrisisTab.jsx');
  await Promise.all(SEEDS.map(async (seed) => {
    born[seed] = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
  }));
  // one render at a time (the DOM is shared): each town's tab, read and cleaned up before the next
  SEEDS.reduce((_, seed) => {
    cleanup();
    const { container } = render(<CrisisTab settlement={born[seed]} />);
    tabOf[seed] = [...container.querySelectorAll('[data-testid="crisis-stake"]')].map((p) => (p.textContent || '').replace(/\s+/g, ' ').trim());
    return null;
  }, null);
  cleanup();
}, 300_000);

/** The town's printed stake rows, as the composer and the print rule give them. @param {any} s */
const rowsOf = (s) => composeCrisisPage(s).flatMap((sec) => stakeLines(sec.stakes).rows);
/** Every string child of a React element tree (the PDF section renders no DOM). @param {any} node @returns {string[]} */
const strings = (node) => {
  if (node == null || typeof node === 'boolean') return [];
  if (typeof node === 'string' || typeof node === 'number') return [String(node)];
  if (Array.isArray(node)) return node.flatMap(strings);
  if (typeof node.type === 'function' && node.type.name !== 'Line' && node.type.name !== 'Label') return strings(node.type(node.props));
  return strings(node.props?.children);
};
/** The journal's Crisis page lines. @param {any} s */
const journalLines = (s) => {
  const page = buildJournalPages(buildViewModel({ settlement: s }), { settlement: s }).find((p) => p.name === CRISIS_PAGE_COPY.tab);
  const entity = { '&#39;': "'", '&quot;': '"', '&lt;': '<', '&gt;': '>', '&amp;': '&' };
  return String(page?.markdown || '').replace(/\\([\\`*_{}[\]()#+\-.!|>~<])/g, '$1').replace(/&#39;|&quot;|&lt;|&gt;|&amp;/g, (e) => entity[e]).split('\n');
};

describe('K26: a stake row names its power by the one leaf, on the tab, the PDF and the journal', () => {
  it('each census town: the re-formed label prints as the leaf says, never raw; a power already named prints its own name', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const s = born[seed];
      const rows = rowsOf(s);
      const reformed = rows.find((k) => Object.hasOwn(PROSE_FORMS, k.factionId));
      const plain = rows.find((k) => !Object.hasOwn(PROSE_FORMS, k.factionId));
      const tab = tabOf[seed];
      expect(reformed, `${seed}: the town holds the stake row the table names`).toBeDefined();
      const word = CRISIS_PAGE_COPY.stake[reformed.stake];
      const said = powerSentenceName(reformed.factionId);
      // the tab: "<name> <word> · <reason>"
      expectAbsentWithAnchor(tab, `${reformed.factionId} ${word} · ${reformed.reason}`, `${said} ${word} · ${reformed.reason}`, `${seed} tab`);
      // the PDF: one Line per row, "<name> <word> · <reason>"
      const pdf = strings(CrisisSections({ settlement: s }));
      expectAbsentWithAnchor(pdf, `${reformed.factionId} ${word} · ${reformed.reason}`, `${said} ${word} · ${reformed.reason}`, `${seed} pdf`);
      // the journal: "- **<name>** <word>: <reason>."
      const journal = journalLines(s);
      expectAbsentWithAnchor(journal, `- **${reformed.factionId}** ${word}: ${reformed.reason}.`, `- **${said}** ${word}: ${reformed.reason}.`, `${seed} journal`);
      // KEEP: where the same town prints a power already named, it prints under its own name on all three
      if (plain) {
        const keep = `${plain.factionId} ${CRISIS_PAGE_COPY.stake[plain.stake]} · ${plain.reason}`;
        expect(tab, `${seed} tab keeps ${plain.factionId}`).toContain(keep);
        expect(pdf, `${seed} pdf keeps ${plain.factionId}`).toContain(keep);
        expect(journal, `${seed} journal keeps ${plain.factionId}`).toContain(`- **${plain.factionId}** ${CRISIS_PAGE_COPY.stake[plain.stake]}: ${plain.reason}.`);
      }
    });
    expectNoSeedFailures(failures, 'each town prints its re-formed stake row by the leaf on every surface');
  }, 300_000);
});

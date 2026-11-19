/** @vitest-environment jsdom */
/**
 * seamPdfReadsTheTabs.test.jsx — SEAM-PDF (BRIEF-BAR6-SEAM, 2026-11-17): THE PDF AND THE JOURNAL READ WHAT THE TABS READ.
 *
 * Measured by the seat's probe over the 150 and the 720 at cfc2b680a (base) and its tip: (1) 7 marked operations in 7 towns
 * of the 150 and 4 in 4 of the 720 printed bare, 0 after; (3) 2 towns of the 150 and 8 of the 720 printed the stored label, 0 after.
 * Over a fixed sample of towns, the PDF's text and the tab's reading agree:
 *   (1) each criminal operation the Defense block lists prints the mark its own house's card prints, through the Defense
 *       tab's one reader (`defenseDisplay.js :: criminalOpMark`), before its note (BAR6-CRIME's 8e.crime, C8633);
 *   (3) the economy's complexity label prints as the Economics tab prints it (`labelBands.js :: complexityLabelShown`) in
 *       the Economics chapter, the daily-life anchor and the journal (BAR6-ECON's C88465).
 * Item (2), the Outlook's "critically impaired by siege" list, is LEFT by name in the seat's hand-back (its helper is
 * private to `ViabilityTab.jsx`): no arm here.
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});

import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { criminalOpMark } from '../../src/domain/display/defenseDisplay.js';
import { complexityLabelShown } from '../../src/domain/display/labelBands.js';
import { institutionHouseLabel } from '../../src/domain/display/institutionDisplayName.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's births (r2r-/r2s-) and the wide read's (bar0-), as their instruments born them. @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-rand-\\d+$`)));
  return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
};
/** @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};

/** Towns of the 150 and the 720 where an operation's house is marked (1). */
const OPS_SAMPLE = ['bar0-city-under_siege+famine-rand-34', 'r2s-under_siege-metropolis-0', 'r2r-metropolis-14'];
/** Towns where the tab's complexity label is the twin (3). */
const COMPLEXITY_SAMPLE = ['bar0-hamlet-calm-rand-40', 'r2r-hamlet-47', 'r2s-plague_onset-thorp-3'];
/** Towns where neither applies: the readings still agree (nothing printed that the tab does not print). */
const PLAIN_SAMPLE = ['bar0-city-wartime-rand-28', 'bar0-metropolis-calm-rand-27', 'bar0-village-calm-rand-31', 'r2r-town-5'];

/** @type {Map<string, { t: any, vm: any }>} */
const towns = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...new Set([...OPS_SAMPLE, ...COMPLEXITY_SAMPLE, ...PLAIN_SAMPLE])]) {
    const t = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
    towns.set(seed, { t, vm: buildViewModel({ settlement: t }) });
  }
}, 600000);
/** @param {string} seed */
const props = (seed) => { const { t, vm } = /** @type {{ t: any, vm: any }} */ (towns.get(seed)); return { settlement: t, narrativeMode: false, vm, stateProse: null }; };

describe('SEAM-PDF (1): the PDF\'s criminal operations print the Defense tab\'s mark', () => {
  test('every OPS town and every plain town prints the Defense tab mark', () => {
    expectNoSeedFailures(collectSeedFailures([...OPS_SAMPLE, ...PLAIN_SAMPLE], (seed) => {
      const { t, vm } = /** @type {{ t: any, vm: any }} */ (towns.get(seed));
      const names = t?.economicState?.safetyProfile?.criminalInstitutions || [];
      const text = leaves(DefenseSecurity(props(seed)));
      expect(vm.defense.criminalOps.map((/** @type {any} */ o) => o.name)).toEqual(names);
      names.forEach((/** @type {string} */ name, /** @type {number} */ i) => {
        const mark = criminalOpMark(t, name);
        expect(vm.defense.criminalOps[i].mark).toBe(mark);
        // the mark the tab prints follows the operation's name, as the tab says it; a house with no mark prints none
        const at = text.indexOf(institutionHouseLabel(name));
        expect(at).toBeGreaterThanOrEqual(0);
        if (mark) expect(text[at + 1]).toBe(mark);
      });
    }), 'every town prints the Defense tab mark');
  });
  test('the sample is not vacuous: every OPS town holds an operation the tab marks', () => {
    expectNoSeedFailures(collectSeedFailures(OPS_SAMPLE, (seed) => {
      const { t } = /** @type {{ t: any }} */ (towns.get(seed));
      expect((t.economicState.safetyProfile.criminalInstitutions || []).some((/** @type {string} */ n) => criminalOpMark(t, n))).toBe(true);
    }), 'every OPS town holds an operation the tab marks');
  });
});

describe('SEAM-PDF (3): the PDF and the journal print the Economics tab\'s complexity label', () => {
  test('every COMPLEXITY town and every plain town prints the Economics tab label', () => {
    expectNoSeedFailures(collectSeedFailures([...COMPLEXITY_SAMPLE, ...PLAIN_SAMPLE], (seed) => {
      const { t, vm } = /** @type {{ t: any, vm: any }} */ (towns.get(seed));
      const ec = t.economicState;
      const shown = complexityLabelShown(ec) || null;
      expect(vm.economics.economicComplexity).toBe(shown);
      expect(vm.identity.anchor.complexity).toBe(shown);
      if (shown !== (ec.economicComplexity || null)) {
        const stored = String(ec.economicComplexity).toLowerCase();
        for (const [where, text] of /** @type {Array<[string, string]>} */ ([
          ['economics', leaves(EconomicsTrade(props(seed))).join('\n')],
          ['daily life', leaves(IdentityDailyLife(props(seed))).join('\n')],
          ['journal', JSON.stringify(buildJournalPages(vm, { settlement: t }))],
        ])) {
          expect(text.toLowerCase(), where).toContain(String(shown).toLowerCase());
          // the tab's label prints (the anchor) and the stored label does not
          expectAbsentWithAnchor(text.toLowerCase(), stored, String(shown).toLowerCase(), where);
        }
      }
    }), 'every town prints the Economics tab label');
  });
  test('the sample is not vacuous: every COMPLEXITY town\'s tab prints the twin', () => {
    expectNoSeedFailures(collectSeedFailures(COMPLEXITY_SAMPLE, (seed) => {
      const { t } = /** @type {{ t: any }} */ (towns.get(seed));
      expect(complexityLabelShown(t.economicState)).not.toBe(t.economicState.economicComplexity);
    }), 'every COMPLEXITY town\'s tab prints the twin');
  });
});

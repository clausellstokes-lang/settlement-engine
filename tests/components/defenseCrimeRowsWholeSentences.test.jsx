/** @vitest-environment jsdom */
/**
 * R3-TABS (round three's cut #1274 #1389 HIGH, #718 #817 #1174 #1082 MED; the chair's ruling of 2026-11-13: the
 * page never cuts a sentence in the middle). The Defense tab's "Active crime patterns" rows cut each pattern's
 * description with `truncateAtWord(desc, 200)` and printed "The settlement's gates and walls are…". Measured at
 * the parent on 884 births: 339 of 1,657 rows ran past 200 characters and were cut mid-sentence; every one has a
 * sentence end within 200. A row now prints its whole sentences up to that length, and the whole text where no
 * sentence ends within it.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { DefenseTab, wholeSentencesWithin } from '../../src/components/new/tabs/DefenseTab.jsx';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

function appBirth(seed) {
  const m = seed.match(/^[a-z0-9]+-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}
// The reader's towns of the six rows, the smallest and the largest size, a siege among them.
const SEEDS = ['rr2s-metropolis-wartime-rand-1', 'rr2s-metropolis-plague_onset-port-1', 'rr2s-metropolis-calm-rand-1',
  'rr2s-city-calm-rand-1', 'rr2s-city-famine-rand-1', 'rr2s-city-occupied-rand-1', 'rr2s-thorp-calm-rand-1', 'rr2s-town-under_siege-rand-1'];
const TABS = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) {
    const s = appBirth(seed);
    const { container } = render(<DefenseTab settlement={s} />);
    for (let p = 0; p < 4; p += 1) for (const b of [...container.querySelectorAll('[aria-expanded="false"]')]) fireEvent.click(b);
    const types = new Set((s.economicState?.safetyProfile?.crimeTypes || []).map((ct) => ct.type));
    const rows = [...container.querySelectorAll('div')].filter((d) => d.children.length === 2 && types.has(d.children[0].textContent))
      .map((d) => d.children[1].textContent);
    TABS.push({ seed, rows });
    cleanup();
  }
}, 300000);
afterEach(cleanup);

describe('a crime-pattern row prints whole sentences', () => {
  test('the helper ends at a sentence end, or keeps the whole text', () => {
    expect(wholeSentencesWithin('One two. Three four five six.', 12)).toBe('One two.');
    expect(wholeSentencesWithin('A long sentence with no end inside the limit', 10)).toBe('A long sentence with no end inside the limit');
    expect(wholeSentencesWithin('Short.', 200)).toBe('Short.');
  });
  test('no row on the tab is cut in the middle of a sentence', () => {
    expect(TABS.reduce((n, t) => n + t.rows.length, 0), 'too few crime rows to read').toBeGreaterThan(8);
    const failures = collectSeedFailures(TABS, ({ rows }) => {
      const cut = rows.filter((r) => /…$/.test(r) || !/[.!?]["')\]]?$/.test(r.trim()));
      if (cut.length) throw new Error(cut.join(' | '));
    });
    expectNoSeedFailures(failures, 'every row ends on a sentence');
  });
});

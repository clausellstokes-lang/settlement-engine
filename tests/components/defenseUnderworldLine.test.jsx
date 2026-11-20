/** @vitest-environment jsdom */
/**
 * R3-TABS (round three's cut #816; the chair's ruling (c): a line that disagrees with another home on the
 * same page reads the home the record bears out, or leaves). The Defense tab's criminal faction line read
 * "Underworld: Thieves' Guild · Minor" from the faction's stored `powerLabel`, while the Power tab prints the
 * same faction's strength as its figure (18), which the generators' own ladder bands Significant
 * (factionDynamics.js, economyReconciliation.js: 18 and over). The stored label is stale against its own
 * figure on 1,105 of 3,247 factions of 884 births at aac79b808 (48 of the 150 criminal factions), so the
 * tab cannot read it; the faction's strength is the Power tab's (T2-20), and the line names the faction.
 *
 * RED-FIRST at aac79b808: the reader's rr2s-city-famine-rand-1 and rr2s-metropolis-calm-rand-1 print
 * "Underworld: Thieves' Guild · Minor" (power 18); after the cure, "Underworld: Thieves' Guild".
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

function appBirth(seed) {
  const m = seed.match(/^[a-z0-9]+-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  const cfg = birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true });
  return generateSettlementPipeline(cfg, null, { seed, customContent: {} });
}
const SEEDS = ['rr2s-city-famine-rand-1', 'rr2s-metropolis-calm-rand-1', 'rr2s-city-calm-rand-1'];

const TABS = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) {
    const s = appBirth(seed);
    const { container } = render(<DefenseTab settlement={s} />);
    for (let p = 0; p < 4; p += 1) for (const b of [...container.querySelectorAll('[aria-expanded="false"]')]) fireEvent.click(b);
    const lines = [...container.querySelectorAll('div')].map((d) => d.textContent.trim()).filter((t) => /^Underworld:/.test(t) && !t.includes('\n'));
    TABS.push({ seed, crim: s.powerStructure?.factions?.find((f) => f.category === 'criminal'), lines });
    cleanup();
  }
}, 300000);
afterEach(cleanup);

describe('the Underworld line names the faction and leaves its strength to the Power tab', () => {
  test('the premise: a criminal faction whose stored label is off its own figure', () => {
    const famine = TABS.find((t) => t.seed === 'rr2s-city-famine-rand-1');
    expect(famine.crim?.power).toBe(18);
    expect(famine.crim?.powerLabel).toBe('Minor');
  });
  test('each line is the faction by name, with no band', () => {
    const failures = collectSeedFailures(TABS, ({ crim, lines }) => {
      const line = lines.find((l) => l.length < 120);
      if (line !== `Underworld: ${crim.faction}`) throw new Error(`${line}`);
    });
    expectNoSeedFailures(failures, 'the Underworld line names the faction alone');
  });
});

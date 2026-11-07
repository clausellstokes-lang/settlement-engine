/** @vitest-environment jsdom */
/**
 * X-50 on the Services tab (the owner, 2026-11-03: BOILERPLATE ONCE; the soak dry
 * run, docs/SOAK_1000_2026-11-03.md §2 row 14 and §4b R2).
 *
 * Services: every impaired row printed its dependency's impact sentence, and generation gives
 * every dependency of a settlement one impact (economicState.js :: generateEconomicState), so
 * "No trade access: running on existing stockpiles only." printed once per severed chain. Each
 * distinct impact now prints once, on the first row that carries it, followed by the chains it
 * covers; every row keeps its own "Needs {resource}" (TRIM-2's Economics pattern).
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { serviceImpactReason } from '../../src/components/new/serviceComponents.jsx';
import { computeChainSets } from '../../src/components/new/tabHelpers.js';

const TIERS = ['village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'mediterranean', 'norse', 'celtic', 'slavic'];
const ISOLATED = Array.from({ length: 12 }, (_, i) => ({
  seed: `services-once-iso-${i}`,
  config: { settType: TIERS[i % TIERS.length], culture: CULTURES[i % CULTURES.length], tradeRouteAccess: 'isolated' },
}));
const SIEGED = Array.from({ length: 8 }, (_, i) => ({
  seed: `services-once-siege-${i}`,
  config: { settType: TIERS[i % TIERS.length], culture: CULTURES[i % CULTURES.length], stressTypes: ['under_siege'] },
}));

/** @param {string} hay @param {string} needle */
const countOf = (hay, needle) => hay.split(needle).length - 1;

const SERVICES = [];
beforeAll(() => {
  for (const { seed, config } of [...ISOLATED, ...SIEGED]) {
    const s = generateSettlementPipeline(config, null, { seed, customContent: {} });
    const { container } = render(<ServicesTab services={s.availableServices} settlement={s} />);
    const impacts = [...new Set((s.economicState?.tradeDependencies || []).map((d) => d.impact).filter(Boolean))];
    // the need line of every impaired row, in render order: "Needs {resource}" + optional impact
    const needLines = [...container.querySelectorAll('[data-testid="service-row"] p')]
      .map((p) => (p.textContent || '').replace(/\s+/g, ' ').trim())
      .filter((t) => t.startsWith('Needs '));
    // the rows that carry a dependency reason, by the row's own reader: each must print its need
    const sets = computeChainSets(s);
    const reasonRows = Object.values(s.availableServices || {}).flat()
      .filter((svc) => serviceImpactReason(svc, sets)).length;
    SERVICES.push({ seed, text: container.textContent || '', impacts, needLines, reasonRows });
    cleanup();
  }
}, 600000);
afterEach(cleanup);

describe('X-50: the Services impact line prints once, followed by the chains it covers', () => {
  test('a Services tab with two or more severed chains prints each impact once, with every chain named after it', () => {
    const offenders = [];
    let multi = 0;
    for (const { seed, text, impacts, needLines } of SERVICES) {
      for (const impact of impacts) {
        const carriers = needLines.filter((l) => l.includes(impact) || !impacts.some((x) => l.includes(x)));
        if (carriers.length < 2) continue;
        multi += 1;
        const n = countOf(text, impact);
        if (n !== 1) { offenders.push(`${seed}: printed ${n}x: ${impact}`); continue; }
        // every severed chain the line covers is named after it, on the one row that prints it
        const chains = [...new Set(carriers.map((l) => l.slice('Needs '.length).split(impact)[0].trim()))];
        const head = needLines.find((l) => l.includes(impact)) || '';
        const after = head.slice(head.indexOf(impact) + impact.length);
        const missing = chains.filter((c) => !after.includes(c));
        if (missing.length) offenders.push(`${seed}: the line names no ${missing.join(', ')} after it: ${head}`);
      }
    }
    expect(multi, 'no rendered Services tab had two rows under one impact').toBeGreaterThan(5);
    expect(offenders, offenders.slice(0, 40).join('\n')).toEqual([]);
  });

  test('every impaired row keeps its own need', () => {
    const short = SERVICES.filter(({ needLines, reasonRows }) => needLines.length !== reasonRows)
      .map(({ seed, needLines, reasonRows }) => `${seed}: ${needLines.length} need lines for ${reasonRows} rows`);
    expect(SERVICES.reduce((n, x) => n + x.reasonRows, 0), 'almost no impaired row carried a reason').toBeGreaterThan(100);
    expect(short, short.join('\n')).toEqual([]);
  });
});

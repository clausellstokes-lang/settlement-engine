/** @vitest-environment jsdom */
/**
 * X-50 on the Defense tab (the owner, 2026-11-03: BOILERPLATE ONCE; the soak dry run,
 * docs/SOAK_1000_2026-11-03.md §2 row 14). A slave revolt's public-order description and its
 * "revolt violence" crime pattern open on the same sentence ("Active armed conflict between
 * revolt participants and security forces in contested districts."). It prints once, in the
 * public-order paragraph; the crime pattern keeps its name and the rest of its description.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';

const TIERS = ['village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'mediterranean', 'norse', 'celtic', 'slavic'];
const REVOLT = Array.from({ length: 8 }, (_, i) => ({
  seed: `services-once-revolt-${i}`,
  config: { settType: TIERS[i % TIERS.length], culture: CULTURES[i % CULTURES.length], stressTypes: ['slave_revolt'] },
}));

const REVOLT_LINE = 'Active armed conflict between revolt participants and security forces in contested districts.';

/** @param {string} hay @param {string} needle */
const countOf = (hay, needle) => hay.split(needle).length - 1;

/** Open every closed disclosure, so a line inside a fold is read too. */
function expandAll(container) {
  for (let pass = 0; pass < 4; pass += 1) {
    const shut = [...container.querySelectorAll('[aria-expanded="false"]')];
    if (shut.length === 0) return;
    for (const b of shut) fireEvent.click(b);
  }
}

const DEFENSE = [];
beforeAll(() => {
  for (const { seed, config } of REVOLT) {
    const s = generateSettlementPipeline(config, null, { seed, customContent: {} });
    const { container } = render(<DefenseTab settlement={s} />);
    expandAll(container);
    for (const dialog of [...container.querySelectorAll('[role="dialog"]')]) dialog.remove();
    const crimeTypes = (s.economicState?.safetyProfile?.crimeTypes || []).map((ct) => ct.type);
    DEFENSE.push({ seed, text: container.textContent || '', crimeTypes });
    cleanup();
  }
}, 600000);
afterEach(cleanup);

describe('X-50: the Defense revolt line prints once', () => {
  test('a slave revolt prints its armed-conflict line once on the Defense tab, and its crime pattern keeps its name', () => {
    const offenders = [];
    let seen = 0;
    for (const { seed, text, crimeTypes } of DEFENSE) {
      const n = countOf(text, REVOLT_LINE);
      if (n === 0) continue;
      seen += 1;
      if (n !== 1) offenders.push(`${seed}: printed ${n}x`);
      if (crimeTypes.includes('revolt violence') && !/revolt violence/i.test(text)) offenders.push(`${seed}: the revolt violence pattern lost its name`);
    }
    expect(seen, 'no rendered Defense tab carried the revolt line').toBeGreaterThan(3);
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

/** @vitest-environment jsdom */
/**
 * R2-CODE-B item 1 — THE PAGE STATES FACTS AND NEVER THE MACHINERY (the cold list REVIEW-W2A-3,
 * f385d487b: MEDIUM #249 #251 #430 #550 #607 #690 #692 #693 "Night patrol Vulnerable2-order chain";
 * #865 "Needs Timber … · covers Timber, Trade access + grain, Iron"; #85 #246 "(arcane underground)",
 * "(smuggling)" printed as a row's provider line).
 *
 * A Services row prints its name, its status in a word (Impaired / Reduced / Vulnerable), its
 * description, the house that offers it, and its own need. It never prints the chain depth the
 * model computed, the list of dependency keys an impact sentence was grouped over, or a stress or
 * crime tag standing in the provider slot (institutionRename.js :: SERVICE_PROVENANCE_SENTINELS).
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { ServiceItem } from '../../src/components/new/serviceComponents.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { SERVICE_PROVENANCE_SENTINELS } from '../../src/domain/institutionRename.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

afterEach(cleanup);

const SENTINEL_LINE = new RegExp(`^(?:${SERVICE_PROVENANCE_SENTINELS.map((w) => w.replace(/[()]/g, '\\$&')).join('|')})$`);

/** @param {HTMLElement} el @returns {string[]} the row's block lines */
const blockLines = (el) => [...el.querySelectorAll('div,p')].map((n) => (n.textContent || '').replace(/\s+/g, ' ').trim());

describe('a service row prints facts, never the machinery', () => {
  test('an impaired row on a two-order chain prints its status and its need, and no chain-depth chip', () => {
    const svc = { name: 'Night patrol', desc: 'Watchmen walk the streets after dark.', institution: 'Town watch' };
    const { container } = render(<ServiceItem svc={svc} impaired={new Set(['Night patrol'])} chainDepth={2}
      depReasons={new Map([['Night patrol', { resource: 'Timber', impact: 'Supply route severed.', inst: 'Town watch' }]])} />);
    const text = container.textContent || '';
    expect(text).toContain('Impaired');
    expect(text).toContain('Needs Timber');
    // anchored: the same text holds the row's status and need, asserted present just above
    expect(text).not.toMatch(/order chain/);
  });

  test('the row that prints a shared impact prints no "covers" list of dependency keys after it', () => {
    const svc = { name: 'Law enforcement', institution: 'Town watch' };
    const { container } = render(<ServiceItem svc={svc} impaired={new Set(['Law enforcement'])} impactCovers={['Timber', 'Trade access + grain', 'Iron']}
      depReasons={new Map([['Law enforcement', { resource: 'Timber', impact: 'Supply route severed.', inst: 'Town watch' }]])} />);
    const text = container.textContent || '';
    expect(text).toContain('Supply route severed.');
    // anchored: the same text holds the impact sentence, asserted present just above
    expect(text).not.toMatch(/covers/);
  });

  test.each(SERVICE_PROVENANCE_SENTINELS)('a row whose provider slot holds %s prints no provider line', (tag) => {
    const svc = { name: 'Contraband transport', desc: 'Goods move past checkpoints.', institution: tag };
    const { container } = render(<ServiceItem svc={svc} isCriminal />);
    expect(container.textContent).toContain('Contraband transport');
    // anchored: the row's own name is asserted present on the line above, in the same render
    expect(blockLines(container)).not.toContain(tag);
  });

  test('a row whose provider is a house still names the house', () => {
    const { container } = render(<ServiceItem svc={{ name: 'Fresh bread', institution: 'Bakers (5-15)' }} />);
    expect(container.textContent).toContain('Bakers');
  });
});

describe('the Services tab of generated towns', () => {
  const SEEDS = ['r2b-svc-siege-0', 'r2b-svc-siege-1', 'r2b-svc-city-2', 'r2b-svc-metro-3'];
  const CONFIGS = [
    { settType: 'city', stressTypes: ['under_siege'], magicExists: true, priorityCriminal: 80 },
    { settType: 'metropolis', stressTypes: ['under_siege'], magicExists: true, priorityCriminal: 80 },
    { settType: 'city', tradeRouteAccess: 'isolated', magicExists: true, priorityCriminal: 90, priorityMagic: 90 },
    { settType: 'metropolis', tradeRouteAccess: 'isolated', magicExists: true, priorityCriminal: 90, priorityMagic: 90 },
  ];
  /** @type {{ seed: string, lines: string[], rows: number, sentinelRows: number }[]} */
  const TABS = [];
  beforeAll(() => {
    SEEDS.forEach((seed, i) => {
      const s = generateSettlementPipeline(CONFIGS[i], null, { seed, customContent: {} });
      const { container } = render(<ServicesTab services={s.availableServices} settlement={s} />);
      const sentinelRows = Object.values(s.availableServices || {}).flat()
        .filter((svc) => svc && typeof svc === 'object' && SERVICE_PROVENANCE_SENTINELS.includes(svc.institution)).length;
      TABS.push({ seed, lines: blockLines(container), rows: container.querySelectorAll('[data-testid="service-row"]').length, sentinelRows });
      cleanup();
    });
  }, 300000);

  test('no line carries a chain depth, a covers list, or a provenance tag', () => {
    expect(TABS.reduce((n, t) => n + t.rows, 0)).toBeGreaterThan(40);
    expect(TABS.reduce((n, t) => n + t.sentinelRows, 0), 'no generated row carried a provenance tag').toBeGreaterThan(0);
    const offenders = TABS.flatMap(({ seed, lines }) => lines
      .filter((l) => /\d-order chain|· covers /.test(l) || SENTINEL_LINE.test(l)).map((l) => `${seed}: ${l}`));
    expect([...new Set(offenders)], offenders.slice(0, 20).join('\n')).toEqual([]);
  });
});

/** @vitest-environment jsdom */
/**
 * overviewIdentityRow.test.jsx — THE PHONE FIX OF 2026-11-01 (the owner: "fix the friction on
 * the phone"; ODQ §934.103, X-34). The Overview's identity facts each carry their own
 * separator inside an unbreakable span, so the row wraps between facts and never ends a
 * line on a dangling dot or splits "133 years old".
 */
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

afterEach(() => cleanup());

describe('Overview — the identity facts wrap as units', () => {
  const town = generateSettlementPipeline({ settType: 'town', tradeRouteAccess: 'road' }, null, { seed: 'trim-overview', customContent: {} });
  it('every fact carries its own separator; no span is a bare dot', () => {
    const { container } = render(<OverviewTab settlement={town} narrativeNote={null} />);
    const facts = screen.getAllByTestId('overview-identity-fact');
    expect(facts.length).toBeGreaterThanOrEqual(2);
    for (const fact of facts) {
      expect(fact.textContent.startsWith('· ')).toBe(true);
      expect(fact.style.whiteSpace).toBe('nowrap');
    }
    const row = screen.getByTestId('overview-identity-row');
    expect(row.contains(facts[0])).toBe(true);
    // The old row interleaved bare "·" spans between the facts, and a line could end on one.
    // Now every dot lives INSIDE a fact's unbreakable span: no direct child of the row is a dot.
    const bareDots = [...row.children].filter(el => el.textContent.trim() === '·');
    expect(bareDots).toHaveLength(0); // anchored: the facts above sit in this row and carry the dot inside them
    for (const dot of [...row.querySelectorAll('span')].filter(s => s.textContent.trim() === '·')) {
      expect(facts.some(f => f.contains(dot))).toBe(true);
    }
    void container;
  });

  // X-46 THE HISTORICAL SCALE, car 1 (ODQ §934.104): the record counts households beside its
  // residents, and the strip prints the count right after the population fact.
  it('the households fact follows the population fact', () => {
    render(<OverviewTab settlement={town} narrativeNote={null} />);
    const facts = screen.getAllByTestId('overview-identity-fact').map(f => f.textContent);
    const at = facts.findIndex(text => text.endsWith(' pop.'));
    expect(at).toBeGreaterThanOrEqual(0);
    expect(facts[at + 1]).toBe(`· ${town.households.toLocaleString('en-US')} households`);
  });

  it('a record saved before households existed prints no households fact', () => {
    const { households: _dropped, ...older } = town;
    render(<OverviewTab settlement={older} narrativeNote={null} />);
    const facts = screen.getAllByTestId('overview-identity-fact').map(f => f.textContent);
    expect(facts.filter(text => text.includes('household'))).toEqual([]); // anchored: the strip above still renders its other facts
    expect(facts.length).toBeGreaterThanOrEqual(1);
  });
});

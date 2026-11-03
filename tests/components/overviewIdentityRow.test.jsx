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
});

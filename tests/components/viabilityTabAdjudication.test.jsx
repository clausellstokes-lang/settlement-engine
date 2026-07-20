/** @vitest-environment jsdom */
/**
 * viabilityTabAdjudication.test.jsx — the web/PDF anti-drift pin ([pdf-6]).
 *
 * The Viability tab must route each engine issue through the ONE shared
 * adjudicator (isViabilityItem) so it cannot diverge from the PDF's
 * viabilitySlice. Before the fix the tab's `otherIssues` filter omitted the
 * CATEGORY exclusion entirely, so a non-critical issue in an excluded category
 * (e.g. 'Resource Access') appeared on the web tab while the PDF excluded it.
 * These pins lock the convergence: excluded-category items are routed away on
 * both surfaces; a genuine viability issue still shows.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ViabilityTab } from '../../src/components/new/tabs/ViabilityTab.jsx';

afterEach(cleanup);

function settlementWith(viability) {
  return { name: 'Testholt', economicViability: { metrics: {}, ...viability } };
}

describe('ViabilityTab routes issues through the shared adjudicator', () => {
  it('excludes an issue in a routed-away category from the Issues section', () => {
    render(<ViabilityTab settlement={settlementWith({
      viable: false,
      summary: 'NOT VIABLE: test',
      issues: [
        { severity: 'high', type: 'logic_violation', title: 'Kept Structural Issue', description: 'a genuine viability problem' },
        { severity: 'high', type: 'logic_violation', category: 'Resource Access', title: 'Routed To Economics', description: 'belongs on the Economics surface' },
      ],
      warnings: [],
    })} />);

    // The genuine viability issue shows; the excluded-category one is routed away.
    expect(screen.getByText('Kept Structural Issue')).toBeTruthy();
    expect(screen.queryByText('Routed To Economics')).toBeNull();
    // Exactly one issue survived the adjudication.
    expect(screen.getByText('Issues (1)')).toBeTruthy();
  });

  it('excludes a routed-away category from the Warnings section too', () => {
    render(<ViabilityTab settlement={settlementWith({
      viable: true,
      summary: 'VIABLE: test',
      issues: [],
      warnings: [
        { severity: 'warning', category: 'Structural', title: 'Kept Warning', description: 'a genuine warning' },
        { severity: 'warning', category: 'Water Dependency', title: 'Routed Warning', description: 'belongs on Resources' },
      ],
    })} />);

    // Exactly one warning survives adjudication; expand the (default-collapsed)
    // section to confirm which one.
    expect(screen.getByText('Warnings (1)')).toBeTruthy();
    fireEvent.click(screen.getByText('Warnings (1)'));
    expect(screen.getByText('Kept Warning')).toBeTruthy();
    expect(screen.queryByText('Routed Warning')).toBeNull();
  });
});

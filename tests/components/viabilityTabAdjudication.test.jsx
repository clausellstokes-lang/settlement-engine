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
import { ViabilityTab, trimViabilitySummary } from '../../src/components/new/tabs/ViabilityTab.jsx';
import VersionsTab from '../../src/components/settlement/VersionsTab.jsx';

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

describe('the generation receipt lives on the Versions tab (UX consolidation, T2-14)', () => {
  it('surfaces formal judgment support and review evidence on Versions, and no longer on Outlook', () => {
    const settlement = settlementWith({
      viable: true,
      summary: 'VIABLE: test',
      issues: [],
      warnings: [],
    });
    settlement.generationCoherenceReceipt = {
      status: 'needs_review',
      cultureProfile: 'germanic',
      contentProfile: 'grounded',
      checks: [],
      repairs: [],
      authoredTensions: [],
      judgments: [
        {
          id: 'hard_structural_validity',
          label: 'Hard structural validity',
          status: 'pass',
          summary: 'Final references resolve.',
        },
        {
          id: 'cross_system_semantic_agreement',
          label: 'Cross-system semantic agreement',
          status: 'needs_review',
          summary: 'Faction power is not conserved.',
        },
      ],
    };

    const versions = render(<VersionsTab save={{ id: 'save-1', settlement }} />);
    expect(screen.getByText(
      'Formal judgments: 1/2 supported · 1 needs review',
    )).toBeTruthy();
    // THE BLOCK LAW (X-16 rung 5, BUILD-W2-BLOCKLAW U6): the receipt is reference, so it
    // follows the page's own body (the timeline, or its gate) and is never its first block.
    const receipt = screen.getByTestId('generation-receipt');
    expect(versions.container.firstElementChild).not.toBe(receipt);
    expect(versions.container.lastElementChild).toBe(receipt);
    expect(screen.getByText(
      /Cross-system semantic agreement: Faction power is not conserved/,
    )).toBeTruthy();
    expect(screen.getByText('Generation receipt: needs review')).toBeTruthy();
    cleanup();

    const { container } = render(<ViabilityTab settlement={settlement} />);
    expect(container.textContent).toContain('Judged at the first survey; not re-run since.');
    expect(container.textContent).not.toContain('Generation receipt'); // anchored: toContain the vintage label on this render
    expect(container.textContent).not.toContain('Formal judgments'); // anchored: same render
  });
});

describe('UX consolidation — the Outlook page says each fact once (RULINGS-T2 T2-11..T2-16)', () => {
  it('T2-11: one vintage label, no coaching caption', () => {
    const { container } = render(<ViabilityTab settlement={settlementWith({ viable: true, summary: 'VIABLE: fine', issues: [], warnings: [] })} />);
    const text = container.textContent;
    expect(text).toContain('Judged at the first survey; not re-run since.');
    expect(text.match(/first survey/gi)).toHaveLength(1);
    expect(text).not.toContain('This tab checks whether'); // anchored: toContain the label above, same render
    expect(text).not.toContain('economically optimised'); // anchored: same render
  });

  it('T2-12: the summary drops the plot-hook count and the dependency clause, in both spellings', () => {
    expect(trimViabilitySummary('Settlement can survive but has 4 operational dependencies that require active management. 1 plot hooks available.'))
      .toBe('Settlement can survive.');
    expect(trimViabilitySummary('the settlement can function, but its survival depends on 3 stable trade dependencies and protected routes.'))
      .toBe('the settlement can function.');
    expect(trimViabilitySummary('Settlement is economically self-sufficient and historically plausible.'))
      .toBe('Settlement is economically self-sufficient and historically plausible.');
    const { container } = render(<ViabilityTab settlement={settlementWith({
      viable: true, issues: [], warnings: [], dependencies: [{}, {}],
      summary: '✓ VIABLE: Settlement can survive but has 2 operational dependencies that require active management. 3 plot hooks available.',
    })} />);
    expect(container.textContent).toContain('can function');
    expect(container.textContent).not.toMatch(/plot hooks available|operational dependenc|stable trade dependenc/); // anchored: toContain('can function') on this render
  });

  it('T2-15: the magic-dependence block left the Outlook page (it frames the Magic tab\'s roles)', () => {
    const settlement = settlementWith({ viable: true, summary: 'VIABLE: fine', issues: [], warnings: [] });
    settlement.defenseProfile = { magicDependency: true };
    settlement.economicState = { activeChains: [{ label: 'Grain', magicNote: 'Druids keep the blight off.' }] };
    const { container } = render(<ViabilityTab settlement={settlement} />);
    expect(container.textContent).toContain('Judged at the first survey; not re-run since.');
    expect(container.textContent).not.toContain('Druids keep the blight off.'); // anchored: the vintage label is asserted on this render
    expect(container.textContent).not.toMatch(/Magic Dependency|Reliance on magic/); // anchored: same render
  });

  it('T2-16: no coaching intros on By-Design or Active Stress; Trade Dependencies leaves the Warnings', () => {
    const { container } = render(<ViabilityTab settlement={settlementWith({
      viable: true, summary: 'VIABLE: fine',
      issues: [
        { severity: 'by_design', institution: 'Grand Library', reason: 'A library above its tier.' },
        { type: 'stress_consequence', title: 'Siege cuts the road', description: 'Carts no longer arrive.' },
      ],
      warnings: [
        { severity: 'note', title: 'Trade Dependencies', description: '4 institutions depend on imported materials (iron).' },
        { severity: 'warning', title: 'Banking Gap', description: 'No moneylender.' },
      ],
    })} />);
    for (const title of [/By-Design Contradictions/, /Warnings \(1\)/]) fireEvent.click(screen.getByText(title));
    const text = container.textContent;
    expect(text).toContain('A library above its tier.');
    expect(text).toContain('Carts no longer arrive.');
    // THE BLOCK LAW (X-16 rung 5, BUILD-W2-BLOCKLAW U4): the collapsed By-Design reference
    // follows the open Active Stress facts.
    expect(text.indexOf('By-Design Contradictions')).toBeGreaterThan(text.indexOf('Active Stress Effects'));
    expect(text).toContain('No moneylender.');
    expect(text).not.toContain('plot seeds, not problems to fix'); // anchored: the by-design reason is on this render
    expect(text).not.toContain('working as intended'); // anchored: the stress description is on this render
    expect(text).not.toContain('depend on imported materials'); // anchored: the Banking Gap warning is on this render
  });
});

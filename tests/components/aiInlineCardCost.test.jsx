/** @vitest-environment jsdom */
/**
 * aiInlineCardCost.test.jsx — the inline AI card is a PLAIN EXPLAINER, not a
 * paid CTA. The single paid "run narrative" action lives in the dossier header
 * (DossierNarrativeButtons); this card must not render a second, competing
 * paid button for the same narrative layer.
 *
 * Two regression guards:
 *   1. Cost honesty: when the card names the narrative price it must quote the
 *      SAME authoritative cost the header button quotes — getCost('narrative'),
 *      the single client source of truth — never a hard-coded "1 credit".
 *   2. Dedupe: the card renders NO action button, so an un-narrated saved
 *      settlement shows exactly one paid run-narrative CTA (the header), not two.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import AIInlineCard from '../../src/components/settlement/AIInlineCard.jsx';
import { useStore } from '../../src/store/index.js';

afterEach(cleanup);

describe('AIInlineCard — explainer, not a duplicate paid CTA', () => {
  it('quotes getCost("narrative"), never a hard-coded "1 credit"', () => {
    // Ensure no narrative layer exists yet, so the explainer renders.
    useStore.setState({ aiSettlement: null, aiDailyLife: null, aiLoading: false, aiError: null });
    const cost = useStore.getState().getCost('narrative');
    // Sanity: the real narrative cost is plural (3 standard), proving the
    // card is no longer stuck on the old singular "1 credit" copy.
    expect(cost).toBeGreaterThan(1);

    const { container } = render(
      <AIInlineCard settlement={{ id: 's1', name: 'Testford' }} />,
    );

    // The cost is interpolated mid-sentence, so it spans multiple text nodes;
    // assert against the normalized full-card text rather than a single node.
    const text = container.textContent.replace(/\s+/g, ' ');
    expect(text).toContain(`${cost} credits`);
    expect(text).not.toContain('1 credit)');
  });

  it('renders no paid action button (header DossierNarrativeButtons owns the single CTA)', () => {
    useStore.setState({ aiSettlement: null, aiDailyLife: null, aiLoading: false, aiError: null });

    render(<AIInlineCard settlement={{ id: 's1', name: 'Testford' }} />);

    // The only interactive control left is the "Dismiss this suggestion" close
    // affordance. There must be NO "Run the Narrative Layer" / "Generate
    // Narrative" / "Retry" button competing with the dossier-header CTA.
    const buttons = screen.queryAllByRole('button');
    const labels = buttons.map(b => (b.textContent || b.getAttribute('aria-label') || '').trim());
    const paidish = labels.filter(l => /narrative|run the|generate|retry|polish/i.test(l));
    expect(paidish).toEqual([]);
    // It still points the GM at the header action by name.
    expect(screen.getByText(/Generate Narrative/i)).toBeTruthy();
  });
});

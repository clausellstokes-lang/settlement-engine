/** @vitest-environment jsdom */
/**
 * aiInlineCardCost.test.jsx — the inline polish card must quote the SAME
 * authoritative narrative cost the dossier's primary "Generate Narrative"
 * button quotes, since both run the identical narrative layer.
 *
 * Regression guard: the card used to hard-code "1 credit" while the button
 * (and the server's spend_credits gate) charge the real schedule cost. That
 * mismatch told the user one number and billed another. The card now reads
 * the cost from getCost('narrative'), the single client source of truth.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import AIInlineCard from '../../src/components/settlement/AIInlineCard.jsx';
import { useStore } from '../../src/store/index.js';

afterEach(cleanup);

describe('AIInlineCard — credit cost is authoritative', () => {
  it('quotes getCost("narrative"), never a hard-coded "1 credit"', () => {
    // Ensure no narrative layer exists yet, so the polish CTA renders.
    useStore.setState({ aiSettlement: null, aiDailyLife: null, aiLoading: false, aiError: null });
    const cost = useStore.getState().getCost('narrative');
    // Sanity: the real narrative cost is plural (3 standard), proving the
    // card is no longer stuck on the old singular "1 credit" copy.
    expect(cost).toBeGreaterThan(1);

    const { container } = render(
      <AIInlineCard settlement={{ id: 's1', name: 'Testford' }} onPolish={() => {}} />,
    );

    // The cost is interpolated mid-sentence, so it spans multiple text nodes;
    // assert against the normalized full-card text rather than a single node.
    const text = container.textContent.replace(/\s+/g, ' ');
    expect(text).toContain(`Costs ${cost} credits`);
    expect(text).not.toContain('Costs 1 credit,');
  });
});

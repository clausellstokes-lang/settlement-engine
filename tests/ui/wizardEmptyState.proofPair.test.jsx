/**
 * @vitest-environment jsdom
 *
 * tests/ui/wizardEmptyState.proofPair.test.jsx — anon-Create tidying lock-in.
 *
 * Two changes are pinned here:
 *   1. The redundant "Want full control? … unlock Basic & Advanced generation"
 *      sign-in banner was removed (it duplicated HomeHero's sign-in messaging).
 *      The test asserts that copy never renders.
 *   2. The two anon proof cards (HomeSampleDossier + RegionWakeReplay) now sit
 *      inside a single .sf-proof-pair wrapper so they lay out side by side on
 *      wider screens and stack on narrow ones, instead of two full-width
 *      stacked cards. The test asserts the wrapper exists and contains BOTH
 *      cards.
 *
 * The two lazy cards and HomeHero are stubbed — this test is about
 * WizardEmptyState's own layout/copy, not the cards' internals.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';

afterEach(cleanup);

vi.mock('../../src/components/HomeHero.jsx', () => ({
  default: () => <div data-testid="home-hero" />,
}));

vi.mock('../../src/components/home/HomeSampleDossier.jsx', () => ({
  default: () => <div data-testid="sample-dossier" />,
}));

vi.mock('../../src/components/home/RegionWakeReplay.jsx', () => ({
  default: () => <div data-testid="region-wake-replay" />,
}));

describe('WizardEmptyState — anon-Create tidying', () => {
  test('drops the redundant sign-in banner and pairs the two proof cards', async () => {
    const { WizardEmptyState } = await import(
      '../../src/components/generate/WizardEmptyState.jsx'
    );

    const { container } = render(
      <WizardEmptyState
        showHomeHero
        showModePicker={false}
        setWizardMode={() => {}}
        onSignIn={() => {}}
        onNavigate={() => {}}
      />
    );

    // Both proof cards mount inside the single responsive pair wrapper.
    await waitFor(() => {
      expect(screen.getByTestId('sample-dossier')).toBeTruthy();
      expect(screen.getByTestId('region-wake-replay')).toBeTruthy();
    });

    const pair = container.querySelector('.sf-proof-pair');
    expect(pair).not.toBeNull();
    expect(pair.querySelector('[data-testid="sample-dossier"]')).not.toBeNull();
    expect(pair.querySelector('[data-testid="region-wake-replay"]')).not.toBeNull();

    // The removed redundant banner copy must not render anywhere.
    expect(screen.queryByText(/unlock Basic/i)).toBeNull();
    expect(container.textContent).not.toMatch(/unlock Basic/i);
  });
});

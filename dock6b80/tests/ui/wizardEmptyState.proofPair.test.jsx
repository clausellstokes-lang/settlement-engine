/**
 * @vitest-environment jsdom
 *
 * tests/ui/wizardEmptyState.proofPair.test.jsx — CREATE-PAGE DEMOTION (Walk W1,
 * owner order 2026-07-21, ledger).
 *
 * The two anon proof cards (HomeSampleDossier "Hightower's Reach" + RegionWakeReplay
 * "watch a region wake up") were REMOVED from the Create page — that job moved to the
 * landing/welcome page. This pins that neither card, nor the old .sf-proof-pair
 * wrapper, renders on Create, and that the previously-removed redundant "unlock Basic"
 * sign-in banner still never renders.
 *
 * HomeHero is stubbed. The two proof modules are also stubbed so that IF the
 * component still imported them, they WOULD surface here — the absence assertions
 * therefore prove the mounts are gone, not merely that a module failed to load.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, within, cleanup } from '@testing-library/react';

afterEach(cleanup);

vi.mock('../../src/components/HomeHero.jsx', () => ({
  default: () => <div data-testid="home-hero" />,
}));

vi.mock('../../src/components/home/HomeSampleDossier.jsx', () => ({
  default: ({ compact }) => (
    <div data-testid="sample-dossier" data-compact={String(!!compact)} />
  ),
}));

vi.mock('../../src/components/home/RegionWakeReplay.jsx', () => ({
  default: ({ compact }) => (
    <div data-testid="region-wake-replay" data-compact={String(!!compact)} />
  ),
}));

describe('WizardEmptyState — Create-page demotion', () => {
  test('renders the hero but neither proof card nor the proof-pair wrapper', async () => {
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

    expect(screen.getByTestId('home-hero')).toBeTruthy();

    // Give any (now-removed) lazy chunk a tick; the proof cards must never appear.
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.queryByTestId('sample-dossier')).toBeNull();
    expect(screen.queryByTestId('region-wake-replay')).toBeNull();
    expect(container.querySelector('.sf-proof-pair')).toBeNull();

    // The old redundant banner copy must still not render.
    expect(container.textContent).not.toMatch(/unlock Basic/i);
  });

  test('the signed-in landing merges both cards into ONE, split by a gold divider (order 15)', async () => {
    const { WizardEmptyState } = await import(
      '../../src/components/generate/WizardEmptyState.jsx'
    );
    const { container } = render(
      <WizardEmptyState
        showHomeHero
        showModePicker
        setWizardMode={() => {}}
        onSignIn={() => {}}
        onNavigate={() => {}}
      />
    );
    // ONE card (the merged Create section) holds BOTH the instant-generator hero
    // and the "Want full control?" mode picker where two cards used to stack.
    const card = container.querySelector('section[aria-label="Create a settlement"]');
    expect(card).toBeTruthy();
    expect(within(card).getByTestId('home-hero')).toBeTruthy();
    expect(within(card).getByText('Want full control?')).toBeTruthy();
    // A divider sits between the two sections…
    expect(card.querySelector('hr')).toBeTruthy();
    // …and the old SEPARATE mode-picker card is gone.
    expect(container.querySelector('section[aria-label="Generation modes"]')).toBeNull();
  });
});

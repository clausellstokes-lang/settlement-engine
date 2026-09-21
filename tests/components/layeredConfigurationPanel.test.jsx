/** @vitest-environment jsdom */
/**
 * layeredConfigurationPanel.test.jsx — the Create reorg (UX overhaul Phase 6).
 * Pins:
 *   • Foundations renders ALWAYS; Fine-tune / Deep-constraints are collapsibles.
 *   • The 17-archetype "Character" preset is a top-level Tier-1 card (out of
 *     SliderPanel).
 *   • Each Deep-constraints section keeps its wizard STEP ID and fires
 *     wizard_step_viewed when opened (funnel analytics continuity).
 *   • The premium "Place in Region" close-out card renders.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

const trackMock = vi.fn();
vi.mock('../../src/lib/analytics.js', () => ({
  track: (...a) => trackMock(...a),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Stub the heavy content panels to bare markers. ConfigurationPanel echoes its
// showFineTune prop so the Basic/Advanced gating is assertable.
vi.mock('../../src/components/ConfigurationPanel.jsx', () => ({ default: ({ showFineTune }) => <div data-testid="configuration-panel" data-fine-tune={String(showFineTune)}>foundations</div> }));
vi.mock('../../src/components/InstitutionalGrid.jsx', () => ({ default: () => <div data-testid="institutions-panel" /> }));
vi.mock('../../src/components/ServicesTogglePanel.jsx', () => ({ default: () => <div data-testid="services-panel" /> }));
vi.mock('../../src/components/TradeDynamicsPanel.jsx', () => ({ default: () => <div data-testid="trade-panel" /> }));
// CharacterPresetCard + PlaceInRegionCard read the store; render real wrappers
// over a store mock so the cards mount. CharacterPresetCard echoes its `advanced`
// prop so the mobile-defer (Advanced chips/sliders -> Basic chip-only) is assertable.
vi.mock('../../src/components/generate/CharacterPresetCard.jsx', () => ({ default: ({ advanced }) => <div data-testid="character-preset-card" data-advanced={String(advanced)} /> }));
vi.mock('../../src/components/generate/PlaceInRegionCard.jsx', () => ({ default: () => <div data-testid="place-in-region-card" /> }));

// useIsMobile is a controllable mock: __mobileFlag drives the reactive flag so a
// single suite can exercise both the desktop (default false) and mobile branches.
let __mobileFlag = false;
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => __mobileFlag }));

import LayeredConfigurationPanel from '../../src/components/generate/LayeredConfigurationPanel.jsx';
import { FORK_SEED_MAX, forkIdentity } from '../../src/lib/anonForkSalt.js';
import { SAMPLE_SETTLEMENTS, forkSeedFor } from '../../src/data/sampleSettlements.js';
import { generateSeed } from '../../src/kernel/prng.js';

describe('LayeredConfigurationPanel — Create reorg', () => {
  beforeEach(() => { trackMock.mockClear(); __mobileFlag = false; });
  afterEach(cleanup);

  it('renders Foundations always, the Character card top-level, and Place in Region', () => {
    render(<LayeredConfigurationPanel />);
    expect(screen.getByTestId('layered-configuration-panel')).toBeTruthy();
    // Foundations (the ConfigurationPanel) is always mounted.
    expect(screen.getByTestId('configuration-panel')).toBeTruthy();
    // Character preset promoted to a top-level card.
    expect(screen.getByTestId('character-preset-card')).toBeTruthy();
    // Place in Region close-out.
    expect(screen.getByTestId('place-in-region-card')).toBeTruthy();
  });

  it('Deep-constraints panels are collapsed by default, expand on click', () => {
    render(<LayeredConfigurationPanel />);
    // Not rendered until opened.
    expect(screen.queryByTestId('institutions-panel')).toBeNull();
    fireEvent.click(screen.getByText('Institutions'));
    expect(screen.getByTestId('institutions-panel')).toBeTruthy();
  });

  it('reports config step on mount and the deep section step ids on open', () => {
    render(<LayeredConfigurationPanel />);
    const stepViews = () => trackMock.mock.calls.filter(([ev]) => ev === 'WIZARD_STEP_VIEWED');
    expect(stepViews().some(([, p]) => p.step_id === 'config')).toBe(true);

    fireEvent.click(screen.getByText('Available Services'));
    expect(stepViews().some(([, p]) => p.step_id === 'services')).toBe(true);

    fireEvent.click(screen.getByText('Trade Dynamics'));
    expect(stepViews().some(([, p]) => p.step_id === 'trade')).toBe(true);
  });

  // ⭐ THE ADDRESS HAS A DECLARED LENGTH (owner-signed, ODQ §934.72).
  // SeedField carried NO `maxLength` at all, which is how a signed-in fork seed
  // reached ~48 characters with nothing noticing: §7a row 1 calls a fork seed "the
  // address … typeable in the `SeedField`", and the pin that was supposed to hold
  // that had no field limit to read. The limit is DERIVED in lib/anonForkSalt.js
  // from the card seeds plus the fork suffix, so this arm asserts the two agree by
  // construction — a literal here would just be the second spelling that drifts.
  it('the exact-seed field declares the fork address ceiling as its maxLength', () => {
    render(<LayeredConfigurationPanel mode="advanced" />);
    const field = screen.getByLabelText('Exact seed');
    // Guard-the-guard: an absent attribute reads -1 in jsdom, so assert the field
    // really carries one before comparing it to anything.
    expect(field.maxLength, 'the exact-seed field declares no maxLength').toBeGreaterThan(0);
    expect(field.maxLength).toBe(FORK_SEED_MAX);
  });

  it('that ceiling admits every seed the product can hand the reader back', () => {
    // The field may never clip a seed the engine itself minted or forked, which is
    // the failure a bare number in the JSX would have shipped unnoticed.
    for (const sample of SAMPLE_SETTLEMENTS) {
      for (const who of [null, '7c9e6679-7425-40de-944b-e07fc1f90ae7']) {
        const seed = forkSeedFor(sample, forkIdentity(who));
        expect(seed.length, `${sample.id} would be clipped by the field`)
          .toBeLessThanOrEqual(FORK_SEED_MAX);
      }
    }
    expect(generateSeed().length).toBeLessThanOrEqual(FORK_SEED_MAX);
  });

  it('can suppress the Place in Region card', () => {
    render(<LayeredConfigurationPanel showPlaceInRegion={false} />);
    expect(screen.queryByTestId('place-in-region-card')).toBeNull();
  });

  it('advanced mode (default) exposes Fine-tune, Deep constraints, and Place in Region', () => {
    render(<LayeredConfigurationPanel mode="advanced" />);
    expect(screen.getByTestId('configuration-panel').getAttribute('data-fine-tune')).toBe('true');
    // Deep-constraints group now leads with a keyword-first scent header (P1),
    // not the muted "Deep constraints" micro-cap.
    expect(screen.getByText(/Institutions, services & trade/)).toBeTruthy();
    expect(screen.getByText('Institutions')).toBeTruthy();
    expect(screen.getByText('Available Services')).toBeTruthy();
    expect(screen.getByText('Trade Dynamics')).toBeTruthy();
    expect(screen.getByTestId('place-in-region-card')).toBeTruthy();
  });

  it('basic mode stops at Character + Foundations — no Fine-tune, Deep constraints, or Place in Region', () => {
    render(<LayeredConfigurationPanel mode="basic" />);
    // Character + Foundations still present.
    expect(screen.getByTestId('character-preset-card')).toBeTruthy();
    expect(screen.getByTestId('configuration-panel')).toBeTruthy();
    // Foundations renders WITHOUT the Fine-tune block.
    expect(screen.getByTestId('configuration-panel').getAttribute('data-fine-tune')).toBe('false');
    // No Deep constraints (Institutions/Services/Trade) and no Place in Region.
    expect(screen.queryByText('Deep constraints')).toBeNull();
    expect(screen.queryByText('Institutions')).toBeNull();
    expect(screen.queryByText('Available Services')).toBeNull();
    expect(screen.queryByText('Trade Dynamics')).toBeNull();
    expect(screen.queryByTestId('place-in-region-card')).toBeNull();
  });

  // ── Mobile pass (Phase 5) ────────────────────────────────────────────────
  // On a phone, Advanced is a desktop authoring console: the hard-constraint
  // editors (Institutions / Services / Trade), the Fine-tune dials, the Advanced
  // slider/Custom character surface, and Place in Region all defer to desktop.
  // The Basic authoring path stays fully usable (Character chips + Foundations +
  // name + Generate). Desktop must stay byte-identical — the assertions above run
  // with the flag off and are untouched.
  describe('mobile defers the Advanced console (keeps Basic authoring)', () => {
    beforeEach(() => { __mobileFlag = true; });

    it('gates Deep constraints behind a calm desktop notice and drops the raw editors', () => {
      render(<LayeredConfigurationPanel mode="advanced" />);
      // The "best on desktop" gate stands in for the constraint console.
      expect(screen.getByTestId('deep-constraints-mobile-gate')).toBeTruthy();
      expect(screen.getByText(/best set on desktop/i)).toBeTruthy();
      // The raw constraint editors and their disclosure headers are gone.
      expect(screen.queryByText('Institutions')).toBeNull();
      expect(screen.queryByText('Available Services')).toBeNull();
      expect(screen.queryByText('Trade Dynamics')).toBeNull();
      expect(screen.queryByTestId('place-in-region-card')).toBeNull();
    });

    it('keeps the Basic authoring path: Character chips + Foundations without Fine-tune', () => {
      render(<LayeredConfigurationPanel mode="advanced" />);
      // Character + Foundations still mount so the phone can author + generate.
      expect(screen.getByTestId('character-preset-card')).toBeTruthy();
      expect(screen.getByTestId('configuration-panel')).toBeTruthy();
      // Advanced slider/Custom character surface and the Fine-tune dials defer:
      // both fall back to the Basic (non-advanced) shape on mobile.
      expect(screen.getByTestId('character-preset-card').getAttribute('data-advanced')).toBe('false');
      expect(screen.getByTestId('configuration-panel').getAttribute('data-fine-tune')).toBe('false');
    });

    it('Basic mode on mobile is unchanged — no gate, since there is nothing deferred', () => {
      render(<LayeredConfigurationPanel mode="basic" />);
      expect(screen.queryByTestId('deep-constraints-mobile-gate')).toBeNull();
      expect(screen.getByTestId('character-preset-card').getAttribute('data-advanced')).toBe('false');
      expect(screen.getByTestId('configuration-panel').getAttribute('data-fine-tune')).toBe('false');
    });
  });
});

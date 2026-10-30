/**
 * @vitest-environment jsdom
 *
 * tests/ui/aboutManifesto.test.jsx — the About trust page render suite.
 *
 * Asserts the six-band trust page renders, and — the load-bearing part — that its
 * engine counts render FROM the generated drift-contract artifact, never as hand-
 * typed literals. If a registry changes and the artifact is regenerated, the number
 * on the page moves with it; a hand-typed number would fail this.
 *
 * THE ABOUT SPLIT (docs/DESIGN_ABOUT_PAGES.md) made the manifesto the BODY of a real
 * page rather than a collapsible's contents, and promoted the hero headline into that
 * page's standard PageHeader (one h1 per page). These tests therefore mount the PAGE
 * — components/about/AboutWhatThisIs.jsx — which is a strict widening: every previous
 * assertion still holds, plus the header and the positioning-ladder section that
 * crossed the split. Structural coverage of the split itself lives in
 * tests/components/aboutSplit.test.jsx.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { fixture as landingFixture } from '../../src/components/home/landingFixture.js';
import { GENERATION_INTENT_SAMPLE_FORK } from '../../src/lib/generationIntent.js';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';

afterEach(cleanup);

// ForgeExactDemo reads a few store selectors; a minimal anon mock keeps mount quiet.
const storeState = { auth: { tier: 'anon' } };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

describe('About manifesto — the trust page', () => {
  it('renders the six bands: hero, covenant, mechanism, AI, close', async () => {
    const AboutPage = (await import('../../src/components/about/AboutWhatThisIs.jsx')).default;
    const { container } = render(<AboutPage />);
    const text = container.textContent;
    // The hero headline now renders through the shared PageHeader (design §2/§3).
    expect(text).toContain('A settlement that remembers what your players did to it.');
    expect(text).toContain('The covenant');
    expect(text.toLowerCase()).toContain('one tick, in dependency order');
    expect(text).toContain('Caged by mechanism, not by promise');
    expect(text).toContain('Examine it thoroughly');
  });

  it('the AI boundary is told as the read / propose / write architecture', async () => {
    const AboutPage = (await import('../../src/components/about/AboutWhatThisIs.jsx')).default;
    const { container } = render(<AboutPage />);
    const text = container.textContent.toLowerCase();
    expect(text).toContain('reads');
    expect(text).toContain('proposes');
    expect(text).toContain('writes');
    // Links to the op registry as the proof surface.
    const opLink = [...container.querySelectorAll('a')].some((a) => a.getAttribute('href') === '/compendium?tab=operations');
    expect(opLink, 'About must link to the operation registry').toBe(true);
  });

  it('renders engine counts FROM the drift-contract artifact (never hand-typed)', async () => {
    const AboutPage = (await import('../../src/components/about/AboutWhatThisIs.jsx')).default;
    const { container } = render(<AboutPage />);
    const text = container.textContent;
    // The causal-variable count (16), the pressure count (9), and the op count (164)
    // must each match the generated artifact — proving they came from source.
    expect(text).toContain(String(CD.causal.variableCount));
    expect(text).toContain(String(CD.pressures.count));
    expect(text).toContain(String(CD.operations.count));
    // The demo world is the frozen landing fixture's town, by construction.
    expect(text).toContain(CD.meta.demoWorld.name);
    expect(text).toContain(CD.meta.demoWorld.seed);
  });

  it('carries the positioning ladder that crossed the split (every /compare* link lands here)', async () => {
    const AboutPage = (await import('../../src/components/about/AboutWhatThisIs.jsx')).default;
    const { container } = render(<AboutPage />);
    expect(container.textContent).toContain('How SettlementForge compares');
  });
});

// ⛔ "FORGE THIS EXACT TOWN" IS A CURATED REPLAY (chair ruling, 2026-10-30). It replays the
// lf-033 fixture (Cnocby, a village) and asks as a curated fork, so a signed-out visitor is
// handed the identical town rather than a Town clamp or a floor refusal; the lane half of
// the pin (the fixture's own config reaching the engine) lives in tests/ui/anonPreGenLocked.
describe('About: the exact-town replay', () => {
  it('replays the fixture seed as a curated fork', async () => {
    const generateSettlement = vi.fn(async () => null);
    Object.assign(storeState, {
      generateSettlement, updateConfig: vi.fn(), setWizardMode: vi.fn(),
      setRandomSliderMode: vi.fn(), clearNeighbour: vi.fn(), clearRefusal: vi.fn(), lastRefusal: null,
    });
    const AboutPage = (await import('../../src/components/about/AboutWhatThisIs.jsx')).default;
    const { getByRole } = render(<AboutPage />);
    fireEvent.click(getByRole('button', { name: 'Forge this exact town' }));
    await waitFor(() => expect(generateSettlement).toHaveBeenCalledTimes(1));
    expect(generateSettlement).toHaveBeenCalledWith(landingFixture.seed, { intent: GENERATION_INTENT_SAMPLE_FORK });
  });
});

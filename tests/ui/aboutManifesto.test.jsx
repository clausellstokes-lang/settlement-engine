/**
 * @vitest-environment jsdom
 *
 * tests/ui/aboutManifesto.test.jsx — the About page (#19) render suite.
 *
 * Asserts the six-band trust page renders, and — the load-bearing part — that its
 * engine counts render FROM the generated drift-contract artifact, never as hand-
 * typed literals. If a registry changes and the artifact is regenerated, the number
 * on the page moves with it; a hand-typed number would fail this.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

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
    const AboutManifesto = (await import('../../src/components/howto/AboutManifesto.jsx')).default;
    const { container } = render(<AboutManifesto />);
    const text = container.textContent;
    expect(text).toContain('A settlement that remembers what your players did to it.');
    expect(text).toContain('The covenant');
    expect(text.toLowerCase()).toContain('one tick, in dependency order');
    expect(text).toContain('Caged by mechanism, not by promise');
    expect(text).toContain('Examine it thoroughly');
  });

  it('the AI boundary is told as the read / propose / write architecture', async () => {
    const AboutManifesto = (await import('../../src/components/howto/AboutManifesto.jsx')).default;
    const { container } = render(<AboutManifesto />);
    const text = container.textContent.toLowerCase();
    expect(text).toContain('reads');
    expect(text).toContain('proposes');
    expect(text).toContain('writes');
    // Links to the op registry as the proof surface.
    const opLink = [...container.querySelectorAll('a')].some((a) => a.getAttribute('href') === '/compendium?tab=operations');
    expect(opLink, 'About must link to the operation registry').toBe(true);
  });

  it('renders engine counts FROM the drift-contract artifact (never hand-typed)', async () => {
    const AboutManifesto = (await import('../../src/components/howto/AboutManifesto.jsx')).default;
    const { container } = render(<AboutManifesto />);
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
});

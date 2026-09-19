/** @vitest-environment jsdom */
/**
 * foundingWorldsForkRefusal.test.jsx — THE SURFACE THE WALK CLICKED.
 *
 * ── WHAT WAS REPORTED (ODQ §934.22 item 3, 2026-09-19) ─────────────────────────
 * 'Fork this sample' on Mossgate — a Town, a size an anonymous visitor is entitled
 * to — produced NOTHING. No settlement, no toast, no `role=alert`, not one console
 * line. The visitor had spent the anonymous daily allowance earlier in the session,
 * and the strip's whole answer to that was `onNavigate('generate')`. The strip
 * renders ON /create, so the feedback was a navigation to the page they were already
 * looking at.
 *
 * ── AND WHAT THE OWNER THEN RULED (ODQ §934.24) ────────────────────────────────
 * (b) A fork of a curated sample is a CURATED SEED, not a free generation: it is
 *     exempt from the daily cap and does not spend it. The tier gate still applies.
 * (c) No gate refuses silently: the lane records a registered reason and the surface
 *     renders it through primitives/RefusalNotice.jsx, where the reader clicked.
 *
 * So the reviewed click — Mossgate under an exhausted cap — must now LAND A
 * SETTLEMENT, and the refusal machinery must still speak for the gates that remain.
 *
 * ⛔ THE INTENT IS ASSERTED AT THE CALL, AND THAT IS THE POINT OF THE PIN. The
 * exemption must ride the ARGUMENT, never the persisted config: the fork already
 * stamps `_forkedFromSample` into `config`, and config is persisted, so an exemption
 * read from there would outlive the fork that earned it and quietly un-cap that
 * browser — the exact shape of the 2026-09-16 production bug.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { GENERATION_INTENT_SAMPLE_FORK } from '../../src/lib/generationIntent.js';
import { REFUSAL_REASONS, refusalOf } from '../../src/lib/refusalReasons.js';
import { TIER_GATE } from '../../src/store/authSlice.js';
import { ANON_MAX_TIER } from '../../src/config/tierFacts.js';

const store = {
  generateSettlement: vi.fn(),
  updateConfig: vi.fn(),
  auth: { tier: 'anon', user: null },
  lastRefusal: null,
  clearRefusal: vi.fn(),
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(store); }
  useStore.getState = () => store;
  useStore.subscribe = () => () => {};
  return { useStore };
});

function installMatchMedia() {
  window.matchMedia = vi.fn((q) => ({
    media: q, matches: false,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
}

beforeEach(() => {
  window.localStorage.clear();
  installMatchMedia();
  store.generateSettlement = vi.fn(async () => ({ name: 'Forged', tier: 'town' }));
  store.updateConfig = vi.fn();
  store.auth = { tier: 'anon', user: null };
  store.lastRefusal = null;
  store.clearRefusal = vi.fn(() => { store.lastRefusal = null; });
});
afterEach(() => { cleanup(); window.localStorage.clear(); vi.restoreAllMocks(); });

async function mount(onNavigate = vi.fn()) {
  vi.resetModules();
  const FoundingWorlds = (await import('../../src/components/generate/FoundingWorlds.jsx')).default;
  const { SAMPLE_SETTLEMENTS } = await import('../../src/data/sampleSettlements.js');
  render(<FoundingWorlds onNavigate={onNavigate} />);
  return { onNavigate, samples: SAMPLE_SETTLEMENTS };
}

const forkButtons = () => screen.getAllByRole('button', { name: /Fork this sample/i });

describe("'Fork this sample' — the reviewed click, under the owner's rulings", () => {
  test('the fixture is the reviewed one: a Town sample, and a City above the anon ceiling', async () => {
    // ANTI-VACUITY for everything below, which means nothing if the trio changed.
    const { samples } = await mount();
    expect(samples.find((s) => s.tier === ANON_MAX_TIER), `no sample at the anon ceiling (${ANON_MAX_TIER})`).toBeTruthy();
    expect(samples.find((s) => s.tier === 'city'), 'no sample above the anon ceiling').toBeTruthy();
    expect(TIER_GATE.anon.maxTier, 'the anon gate moved — re-read this fixture').toBe(ANON_MAX_TIER);
  });

  test('THE REVIEWED CLICK: the fork asks for the sample-fork intent, and lands', async () => {
    const { onNavigate, samples } = await mount();
    const mossgate = samples.findIndex((s) => s.tier === ANON_MAX_TIER);

    fireEvent.click(forkButtons()[mossgate]);

    await waitFor(() => expect(store.generateSettlement).toHaveBeenCalledTimes(1));
    const [seed, options] = store.generateSettlement.mock.calls[0];
    expect(typeof seed, 'the seed is still the generation ARGUMENT').toBe('string');
    expect(options, 'the fork did not declare its intent — it would be capped like any generation')
      .toEqual({ intent: GENERATION_INTENT_SAMPLE_FORK });
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('generate'));
    expect(screen.queryByRole('alert'), 'a successful fork raised a notice').toBeNull();
  });

  test('the intent never rides the PERSISTED config (the sticky-exemption trap)', async () => {
    const { samples } = await mount();
    fireEvent.click(forkButtons()[0]);
    await waitFor(() => expect(store.updateConfig).toHaveBeenCalled());
    const patch = store.updateConfig.mock.calls.at(-1)[0];
    expect(Object.hasOwn(patch, 'seed'), 'the seed is back in the persisted config').toBe(false);
    expect(Object.hasOwn(patch, 'intent'), 'the INTENT is in the persisted config — it would outlive the fork').toBe(false);
    // The card's own provenance marker stays; it is not what grants the exemption.
    expect(patch._forkedFromSample).toBe(samples[0].id);
  });

  test('A REFUSAL IS SAID, AND IT DOES NOT NAVIGATE', async () => {
    // The lane refused (here: the tier gate, the one a fork is still bound by) and
    // recorded why. The surface renders it and stays put.
    store.generateSettlement = vi.fn(async () => {
      store.lastRefusal = refusalOf(REFUSAL_REASONS.TIER, { size: 'City', max: 'Town' });
      return null;
    });
    const { onNavigate, samples } = await mount();
    const blackCrag = samples.findIndex((s) => s.tier === 'city');

    fireEvent.click(forkButtons()[blackCrag]);

    await waitFor(() => expect(store.generateSettlement).toHaveBeenCalled());
    const alert = await screen.findByRole('alert');
    const said = alert.textContent || '';
    expect(said, `the notice does not name the size: "${said}"`).toContain('City');
    expect(said, `the notice does not name the ceiling: "${said}"`).toContain('Town');
    expect(said, `the notice offers no door: "${said}"`).toMatch(/sign in/i);
    expect(onNavigate, 'a refusal navigated away from its own notice').not.toHaveBeenCalled();
  });

  test('A THROW is caught, and the lane\'s recorded reason is what the reader gets', async () => {
    store.generateSettlement = vi.fn(async () => {
      store.lastRefusal = refusalOf(REFUSAL_REASONS.GENERATION_FAILED);
      throw new Error('engine exploded');
    });
    const { onNavigate } = await mount();

    fireEvent.click(forkButtons()[0]);

    const alert = await screen.findByRole('alert');
    expect((alert.textContent || '').length, 'the notice is empty').toBeGreaterThan(20);
    expect(onNavigate).not.toHaveBeenCalled();
    // …and no unhandled rejection: the handler catches, which it did not used to.
    await waitFor(() => expect(store.generateSettlement).toHaveBeenCalled());
  });

  test('a fresh click clears the previous refusal before it starts', async () => {
    store.lastRefusal = refusalOf(REFUSAL_REASONS.TIER, { size: 'City', max: 'Town' });
    await mount();
    expect(screen.getByRole('alert')).toBeTruthy();
    fireEvent.click(forkButtons()[0]);
    expect(store.clearRefusal, 'a stale accusation survives the next click').toHaveBeenCalled();
  });
});

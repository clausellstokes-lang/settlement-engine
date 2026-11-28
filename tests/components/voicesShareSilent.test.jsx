/** @vitest-environment jsdom */
/**
 * tests/components/voicesShareSilent.test.jsx — THE SHARED PAGE SHOWS NO QUOTE (S-G1; the chair's ruling E28 point 12:
 * "the plan is empty for a reader's audience on a share … A TEST HOLDS IT, with a plant").
 *
 * THE PLANT: a born village whose OWNER's page, rendered through the real OutputContainer and walked (every group,
 * sub-tab and disclosure: the page census's own walk), prints its quotes. Its SHARED page (`toPublicSafe` →
 * `projectShareVeil`, rendered read-only as PublicDossierView renders it) prints none of them and no signature, under
 * every veil marker: a share before the veil (unmarked), a marked share with no delta, and a marked share hiding a
 * person's card. The PLAYER VIEW inside the owner's app prints none either.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { storeFor, walkDossier } from './pageCensusWalk.shared.mjs';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (/** @type {(s: any) => any} */ selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import OutputContainer from '../../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { VEIL_OVERRIDE_KEY, projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { loadVoices } from '../../src/components/primitives/CardVoice.jsx';

const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });
afterEach(cleanup);

/** @type {any} */ let town;
/** @type {string[]} */ let quoteTexts = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  const born = generateSettlementPipeline(birthConfig({ settType: 'village' }), null, { seed: 'dp-village-5', customContent: {} });
  town = withPublicProse(born, composePublicProse(born));
  const voices = await loadVoices();
  quoteTexts = [...voices.voicePlanOf(town, { audience: 'owner' }).quotes.values()].map((q) => `“${q.text}”`);
}, 120_000);

/** The page as the walk reads it, one string. @param {React.ReactElement} el @param {any} s */
async function pageOf(el, s) {
  mocks.store = storeFor(s, vi.fn);
  const { container, unmount } = render(el);
  const views = await walkDossier(container, { fireEvent, waitFor, expect });
  unmount();
  return Object.values(views).flat().join('\n');
}

describe('the shared page and the player view print no quote; the owner\'s page prints them (the plant)', () => {
  it('THE PLANT: the owner\'s page prints its quotes', async () => {
    expect(quoteTexts.length, 'the plant town has quotes').toBeGreaterThan(0);
    const page = await pageOf(<OutputContainer settlement={town} />, town);
    const printed = quoteTexts.filter((q) => page.includes(q));
    expect(printed.length, 'the owner\'s walked page prints the plan\'s quotes').toBeGreaterThan(0);
  }, 180_000);

  const someNpc = () => town.npcs[0].id;
  const MARKERS = /** @type {const} */ ([
    ['an unmarked share (before the veil)', () => null],
    ['a marked share, no delta', () => ({ [VEIL_OVERRIDE_KEY]: { deltas: [] } })],
    ['a marked share hiding a person\'s card', () => ({ [VEIL_OVERRIDE_KEY]: { deltas: [] }, [someNpc()]: { revealDm: false } })],
  ]);
  for (const [name, overrides] of MARKERS) {
    it(`the shared page, ${name}: no quote, no signature`, async () => {
      const shared = projectShareVeil(toPublicSafe(town), overrides());
      const page = await pageOf(<OutputContainer settlement={shared} readOnly playerView />, shared);
      expect(quoteTexts.filter((q) => page.includes(q))).toEqual([]);
      expect(page).not.toMatch(/” — /);
    }, 180_000);
  }

  it('the player view inside the owner\'s app: no quote', async () => {
    const page = await pageOf(<OutputContainer settlement={town} saveId="save-1" playerView />, town);
    expect(quoteTexts.filter((q) => page.includes(q))).toEqual([]);
    expect(page).not.toMatch(/” — /);
  }, 180_000);
});

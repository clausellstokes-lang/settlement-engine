/** @vitest-environment jsdom */
/**
 * tests/components/cardVoiceSession.test.jsx — THE SESSION VIEW'S PERSON CARD (S-G1; VOICES-CARDS' F, "Session (1)"): a
 * person the session view carries shows the SAME quote the dossier's person card does (the one plan), and the liar's line
 * is never shown there (the screen may face the table).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('../../src/store/index.js', () => {
  const data = { auth: { tier: 'anon' }, isElevated: () => false, setPurchaseModalOpen: () => {}, setActivePricingMoment: () => {},
    phase: 'draft', systemState: null, eventLog: [], campaigns: [], savedSettlements: [] };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  useStore.subscribe = () => () => {};
  return { useStore, default: useStore };
});

import SessionMode from '../../src/components/session/SessionMode.jsx';
import { loadVoices } from '../../src/components/primitives/CardVoice.jsx';

afterEach(cleanup);

/** @type {Map<string, any>} */ const towns = new Map();
/** @type {Awaited<ReturnType<typeof loadVoices>>} */ let voices;
beforeAll(async () => {
  const pipe = await import('../../src/generators/generateSettlementPipeline.js');
  const dens = await import('../../src/domain/density/densityCreateBoundary.js');
  await dens.loadGenerationLawPayloads();
  for (const [seed, settType] of [['dp-city-59', 'city'], ['dp-town-40', 'town'], ['dp-village-5', 'village']]) {
    towns.set(seed, pipe.generateSettlementPipeline(dens.birthConfig({ settType }), null, { seed, customContent: {} }));
  }
  voices = await loadVoices();
}, 120_000);

describe('the session view\'s person cards', () => {
  it('carry the dossier\'s quote for each person they show, and never the liar\'s', async () => {
    let shown = 0;
    for (const [seed, s] of towns) {
      const plan = voices.voicePlanOf(s, { audience: 'owner' });
      const { container, unmount } = render(<SessionMode settlement={s} onClose={() => {}} />);
      const section = /** @type {HTMLElement} */ (container.querySelector('#sf-session-npcs'));
      if (!section) { unmount(); continue; }
      const names = [...section.querySelectorAll('span')].map((n) => n.textContent);
      const want = s.npcs.filter((n) => names.includes(n.name)).map((n) => voices.quoteFor(plan, 'person', n.id)).filter((q) => q && !q.liar);
      await waitFor(() => expect(section.querySelectorAll('[data-testid="card-voice"]').length, seed).toBe(want.length));
      const got = [...section.querySelectorAll('[data-testid="card-voice"]')].map((n) => n.getAttribute('data-voice-line')).sort();
      expect(got, seed).toEqual(want.map((q) => q.lineId).sort());
      expect(section.querySelector('[data-testid="card-voice-dm"]')).toBeNull();
      shown += want.length;
      unmount();
    }
    expect(shown, 'some person the session view shows speaks (the test has teeth)').toBeGreaterThan(0);
  }, 120_000);
});

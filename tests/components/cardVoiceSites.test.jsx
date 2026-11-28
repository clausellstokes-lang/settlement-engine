/** @vitest-environment jsdom */
/**
 * tests/components/cardVoiceSites.test.jsx — THE SCREEN'S PRINT SITES (S-G1; VOICES-CARDS' F, "Screen (6)"; the chair's
 * rulings E28 points 4 and 5).
 *
 * Over two born towns of C (a city with a crisis-free page and a liar; a village under a famine), each tab that carries a
 * card kind is rendered as the owner's page renders it, inside the dossier's one audience: every card the plan quotes
 * shows its quote, once, on its own card, and no other card shows one. A seat power's quote sits on the roster row
 * (`FactionRow`) alone; a tension's on the History card alone.
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import React from 'react';
import { VoicesAudience, loadVoices } from '../../src/components/primitives/CardVoice.jsx';
import InstitutionsTab from '../../src/components/new/tabs/InstitutionsTab.jsx';
import HistoryTab from '../../src/components/new/tabs/HistoryTab.jsx';
import TraditionsTab from '../../src/components/new/tabs/TraditionsTab.jsx';
import CrisisTab from '../../src/components/new/tabs/CrisisTab.jsx';
import NPCsTab from '../../src/components/new/tabs/NPCsTab.jsx';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';

afterEach(cleanup);

/** @type {Map<string, Record<string, any>>} */ const towns = new Map();
/** @type {Awaited<ReturnType<typeof loadVoices>>} */ let voices;
beforeAll(async () => {
  const pipe = await import('../../src/generators/generateSettlementPipeline.js');
  const dens = await import('../../src/domain/density/densityCreateBoundary.js');
  await dens.loadGenerationLawPayloads();
  for (const [seed, settType] of [['dp-city-59', 'city'], ['dp-village-5', 'village']]) {
    towns.set(seed, pipe.generateSettlementPipeline(dens.birthConfig({ settType }), null, { seed, customContent: {} }));
  }
  voices = await loadVoices();
}, 120_000);

const TABS = /** @type {const} */ ([
  ['institutions', (/** @type {any} */ s) => <InstitutionsTab settlement={s} />],
  ['power', (/** @type {any} */ s) => <PowerTab powerStructure={s.powerStructure} settlement={s} />],
  ['npcs', (/** @type {any} */ s) => <NPCsTab npcs={s.npcs} settlement={s} />],
  ['traditions', (/** @type {any} */ s) => <TraditionsTab settlement={s} />],
  ['history', (/** @type {any} */ s) => <HistoryTab settlement={s} />],
  ['crisis', (/** @type {any} */ s) => <CrisisTab settlement={s} />],
]);

describe('every quoted card of a tab shows its one quote, and no other card does', () => {
  for (const [tab, el] of TABS) {
    it(`the ${tab} tab`, async () => {
      for (const [seed, s] of towns) {
        const plan = voices.voicePlanOf(s, { audience: 'owner' });
        const want = [...plan.quotes.values()].filter((q) => q.tab === tab).map((q) => q.lineId).sort();
        const { container, unmount } = render(<VoicesAudience value={{ audience: 'owner', settlement: s }}>{el(s)}</VoicesAudience>);
        await waitFor(() => expect(container.querySelectorAll('[data-testid="card-voice"]').length, `${seed} ${tab}`).toBe(want.length));
        const got = [...container.querySelectorAll('[data-testid="card-voice"]')].map((n) => /** @type {string} */ (n.getAttribute('data-voice-line'))).sort();
        expect(got, `${seed} ${tab}`).toEqual(want);
        unmount();
      }
    }, 60_000);
  }

  it('found quotes on at least four of the six tabs across the two towns (the test has teeth)', () => {
    const tabs = new Set([...towns.values()].flatMap((s) => [...voices.voicePlanOf(s, { audience: 'owner' }).quotes.values()].map((q) => q.tab)));
    expect(tabs.size).toBeGreaterThanOrEqual(4);
  });
});

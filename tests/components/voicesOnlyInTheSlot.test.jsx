/** @vitest-environment jsdom */
/**
 * tests/components/voicesOnlyInTheSlot.test.jsx — EVERY PRINTED SAID TEXT SITS INSIDE THE QUOTE SLOT, SIGNED (S-G1; the chair's
 * ruling G1-2 (3), the render half of the guard that pays for the presumption-classes walker's voice scope).
 *
 * Over two born towns of C, the six tabs that carry a card kind are rendered as the owner's page renders them: wherever a
 * said or liar line's words print (any version of four words or more, or the plan's own filled text), they print inside
 * `[data-testid="card-voice"]` beside its signature, never as a line of the surveyor's.
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
import { SAID_LINES } from '../../src/data/voices/saidLines.js';
import { LIAR_LINES } from '../../src/data/voices/liarLines.js';

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
/** Every version's words with no slot, of four words or more (a shorter remark could be anyone's words). */
const VERSION_TEXTS = [...Object.values(SAID_LINES).flat(), ...Object.values(LIAR_LINES).flat()]
  .flatMap((l) => Object.values(l.versions).map((v) => v.text))
  .filter((t) => !/[{}]/.test(t) && t.split(/\s+/).length >= 4);

describe('a said line prints only inside the slot, signed', () => {
  it('on every tab of the two towns', async () => {
    let seen = 0;
    for (const [seed, s] of towns) {
      const quotes = [...voices.voicePlanOf(s, { audience: 'owner' }).quotes.values()];
      const texts = [...new Set([...VERSION_TEXTS, ...quotes.map((q) => q.text)])];
      for (const [tab, el] of TABS) {
        const { container, unmount } = render(<VoicesAudience value={{ audience: 'owner', settlement: s }}>{el(s)}</VoicesAudience>);
        const want = quotes.filter((q) => q.tab === tab).length;
        await waitFor(() => expect(container.querySelectorAll('[data-testid="card-voice"]').length).toBe(want));
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const t = n.textContent || '';
          if (!texts.some((x) => t.includes(x))) continue;
          seen += 1;
          const slot = /** @type {Element} */ (n.parentElement).closest('[data-testid="card-voice"]');
          expect(slot, `${seed}: "${t}" printed outside the quote slot`).not.toBeNull();
          expect(slot?.querySelector('[data-testid="card-voice-by"]'), `${seed}: "${t}" printed unsigned`).not.toBeNull();
        }
        unmount();
      }
    }
    expect(seen, 'the walk met said texts (the test has teeth)').toBeGreaterThan(5);
  }, 120_000);
});

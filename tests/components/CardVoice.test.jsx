/** @vitest-environment jsdom */
/**
 * tests/components/CardVoice.test.jsx — THE ONE QUOTE SLOT (S-G1; the chair's rulings E28 points 5, 11, 12).
 *
 * Over one born city of C that holds a person with a criminal tie: on the owner's page a card that speaks shows its one
 * quote and signature; a silent card mounts NO node (no reserved height); a page with no audience given, a reader's
 * page and the player view show nothing; the liar's card shows the DM mark and the note on the owner's screen, and
 * nothing where the surface may not show the mark.
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import CardVoice, { VoicesAudience, loadVoices } from '../../src/components/primitives/CardVoice.jsx';

afterEach(cleanup);

/** @type {Record<string, any>} */ let town;
/** @type {Awaited<ReturnType<typeof loadVoices>>} */ let voices;
beforeAll(async () => {
  const pipe = await import('../../src/generators/generateSettlementPipeline.js');
  const dens = await import('../../src/domain/density/densityCreateBoundary.js');
  await dens.loadGenerationLawPayloads();
  town = pipe.generateSettlementPipeline(dens.birthConfig({ settType: 'city' }), null, { seed: 'dp-city-59', customContent: {} });
  voices = await loadVoices();
}, 120_000);

const owner = { audience: 'owner' };
/** @param {React.ReactElement} el @param {{ audience: string } | null} [value] */
const mount = (el, value = owner) => render(value ? <VoicesAudience value={value}>{el}</VoicesAudience> : el);

describe('CardVoice', () => {
  it('shows a speaking card\'s one quote, signed, on the owner\'s page', async () => {
    const plan = voices.voicePlanOf(town, { audience: 'owner' });
    const q = [...plan.quotes.values()].find((x) => !x.liar);
    mount(<CardVoice settlement={town} kind={q.kind} id={q.id} />);
    const node = await screen.findByTestId('card-voice');
    expect(node.getAttribute('data-voice-line')).toBe(q.lineId);
    expect(node.textContent).toBe(`“${q.text}” — ${q.speaker.name}, ${q.speaker.role}`);
    expect(screen.getAllByTestId('card-voice')).toHaveLength(1);
  });

  it('mounts no node at all for a silent card', async () => {
    const plan = voices.voicePlanOf(town, { audience: 'owner' });
    const silent = plan.cards.find((c) => !plan.quotes.has(`${c.kind}:${c.id}`));
    const { container } = mount(<div data-testid="host"><CardVoice settlement={town} kind={silent.kind} id={silent.id} /></div>);
    await loadVoices();
    expect(container.querySelector('[data-testid="host"]').childNodes).toHaveLength(0);
  });

  it('speaks to no one where no audience is given, on a reader\'s page, or in the player view (fail-closed)', async () => {
    const q = [...voices.voicePlanOf(town, { audience: 'owner' }).quotes.values()][0];
    for (const value of [null, { audience: 'reader' }, { audience: 'player' }]) {
      const { container, unmount } = mount(<div data-testid="host"><CardVoice settlement={town} kind={q.kind} id={q.id} /></div>, value);
      await loadVoices();
      expect(container.querySelector('[data-testid="card-voice"]'), JSON.stringify(value)).toBeNull();
      unmount();
    }
  });

  it('marks the liar\'s quote for the DM, with the note, on the owner\'s screen; shows nothing where the mark may not go', async () => {
    const liar = [...voices.voicePlanOf(town, { audience: 'owner' }).quotes.values()].find((x) => x.liar);
    expect(liar, 'the city holds a liar').toBeTruthy();
    const { unmount } = mount(<CardVoice settlement={town} kind={liar.kind} id={liar.id} />);
    const dm = await screen.findByTestId('card-voice-dm');
    expect(dm.getAttribute('data-layer')).toBe('dm');
    expect(dm.textContent).toBe(`DM In truth, ${liar.liar.inTruth}.`);
    unmount();
    const { container } = mount(<div data-testid="host"><CardVoice settlement={town} kind={liar.kind} id={liar.id} dm={false} /></div>);
    await loadVoices();
    expect(container.querySelector('[data-testid="card-voice"]')).toBeNull();
  });
});

/**
 * @vitest-environment jsdom
 *
 * tests/components/scribeRedrawButton.test.jsx — THE ONE AI BUTTON THE DOSSIER KEEPS
 * (design §5c rule 1; ruling 16; the owner 2026-09-14 ~06:5x).
 *
 * ⛔ THE ARM THAT MATTERS MOST IS THE DARK ONE. Every byte of the Scribe is behind `FLAGS.scribe`
 * and the flag ships false, so the first pin below is that a reader of today's product sees NOTHING
 * from this file. The rest pin the three conditions that keep a BILLED control off a page that
 * cannot pay for what it renders: no durable home, no reader who owns the dossier, no survey to
 * redraw.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';

afterEach(cleanup);

const { storeRef, redrawCalls, registerCalls } = vi.hoisted(() => ({
  storeRef: { current: {} },
  redrawCalls: [],
  registerCalls: { n: 0 },
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: Object.assign(
    (selector) => selector(storeRef.current),
    { getState: () => storeRef.current },
  ),
}));
vi.mock('../../src/hooks/useLivePricing.js', () => ({
  useLiveAiCostResolver: () => (feature) => (feature === 'dossierProse' ? 5 : 0),
}));
vi.mock('../../src/store/scribeOpenTrigger.js', () => ({
  runScribeRedraw: async (args) => { redrawCalls.push(args); return { sent: true }; },
}));
vi.mock('../../src/store/scribeTransport.js', () => ({
  registerScribeTransport: () => { registerCalls.n += 1; },
}));

import { setFlagOverride } from '../../src/lib/flags.js';
import { landBlock } from '../../src/lib/scribeArtefact.js';
import ScribeRedrawButton from '../../src/components/dossier/ScribeRedrawButton.jsx';

const SEED = 'seed-ashford';
const scribedTown = () => ({
  id: 'ashford',
  _seed: SEED,
  prose: landBlock(null, {
    advanceSeq: 2,
    blockId: 'DS-DEF-2',
    pools: { 'FAMILY: acute crisis': [{ vid: 3, spine: 'The watch keeps a short roll.', faces: [], notebook: [] }] },
    renderedFor: SEED,
    renderedAt: '2026-09-14T00:00:00.000Z',
    version: { engine: 'gen-1/sim-1' },
  }),
});

function seat({ settlement = scribedTown(), guidance = '' } = {}) {
  storeRef.current = {
    settlement,
    getCampaignForSettlement: () => ({ id: 'camp-1' }),
    savedSettlements: [{ id: 'ashford', aiData: { dossierNotes: { aiGuidance: guidance } } }],
  };
}

afterEach(() => {
  setFlagOverride('scribe', undefined);
  redrawCalls.length = 0;
  registerCalls.n = 0;
});

describe('⛔ DARK BY DEFAULT — the shipped product shows nothing from this file', () => {
  test('with no override at all (the shipped default) the button does not render', () => {
    seat();
    const { container } = render(<ScribeRedrawButton saveId="ashford" />);
    expect(container.querySelector('button')).toBe(null);
  });

  test('with the flag explicitly dark it still does not render', () => {
    setFlagOverride('scribe', false);
    seat();
    const { container } = render(<ScribeRedrawButton saveId="ashford" />);
    expect(container.querySelector('button')).toBe(null);
  });
});

describe('LIT — and still refused wherever a render could not be kept or should not be offered', () => {
  test('it names the cost from the live resolver, not from a second copy of the table', () => {
    setFlagOverride('scribe', true);
    seat();
    render(<ScribeRedrawButton saveId="ashford" />);
    expect(screen.getByRole('button').textContent).toMatch(/Redraw the survey \(5 credits\)/);
  });

  test('no durable home, no button: a redraw is billed and an unsaved town cannot keep it', () => {
    setFlagOverride('scribe', true);
    seat();
    const { container } = render(<ScribeRedrawButton saveId={null} />);
    expect(container.querySelector('button')).toBe(null);
  });

  test('never on the player page and never on the public projection', () => {
    setFlagOverride('scribe', true);
    seat();
    expect(render(<ScribeRedrawButton saveId="ashford" playerView />).container.querySelector('button')).toBe(null);
    cleanup();
    expect(render(<ScribeRedrawButton saveId="ashford" publicDossier />).container.querySelector('button')).toBe(null);
  });

  test('a town with no survey yet has nothing to redraw, so the OPEN renders it and this does not', () => {
    setFlagOverride('scribe', true);
    seat({ settlement: { id: 'ashford', _seed: SEED } });
    const { container } = render(<ScribeRedrawButton saveId="ashford" />);
    expect(container.querySelector('button')).toBe(null);
  });
});

describe('THE PRESS', () => {
  test('registers the transport and asks the trigger for a redraw, carrying the LIVE instructions box', async () => {
    setFlagOverride('scribe', true);
    seat({ guidance: '  keep the watch out of it  ' });
    render(<ScribeRedrawButton saveId="ashford" />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(redrawCalls).toHaveLength(1));
    expect(registerCalls.n).toBe(1);
    expect(redrawCalls[0]).toMatchObject({
      saveId: 'ashford', campaignId: 'camp-1', flagOn: true, guidance: 'keep the watch out of it',
    });
  });
});

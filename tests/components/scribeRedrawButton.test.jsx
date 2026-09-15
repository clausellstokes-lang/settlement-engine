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
import {
  SCRIBE_REDRAW_LIMIT, currentAdvanceSeq, landBlock, retireCurrent,
} from '../../src/lib/scribeArtefact.js';
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
    expect(screen.getByRole('button').textContent).toMatch(/Redraw the survey \(5 credits per render\)/);
  });

  test('⭐⭐ THE PRICE NAMES ITS UNIT (W5b): per RENDER, not per tab and not per anything', () => {
    // A render is one call per dossier tab, and until migration 203's render session every one of
    // them charged — so this label said five credits and the bill said thirty-five. The number is
    // true now, and the unit is on the label because a price with no unit is where that hid.
    setFlagOverride('scribe', true);
    seat();
    render(<ScribeRedrawButton saveId="ashford" />);
    const button = screen.getByRole('button');
    expect(button.textContent).toContain('per render');
    expect(button.getAttribute('title')).toMatch(/One render covers every tab of the dossier/);
    expect(button.getAttribute('title')).toMatch(/charged once/);
    // ⛔ THE E2 RATCHET: no em dash in anything this control renders.
    // anchored: the two title assertions above prove the string is present and populated.
    expect(`${button.textContent} ${button.getAttribute('title')}`).not.toContain('—');
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

describe('⭐⭐ THE CAP (W5b car 3) — the control stays, goes dead, and says why', () => {
  /** N redraws already spent on this epoch: N `redone` entries in the past lane. */
  const redrawn = (n) => {
    let prose = scribedTown().prose;
    for (let i = 0; i < n; i += 1) {
      const seq = currentAdvanceSeq(prose);
      prose = landBlock(retireCurrent(prose, { state: 'redone', at: `t${i}`, nonce: `redo:${i}` }), {
        advanceSeq: seq,
        blockId: 'DS-DEF-2',
        pools: { 'FAMILY: acute crisis': [{ vid: 3, spine: `Draw ${i}.`, faces: [], notebook: [] }] },
        renderedFor: SEED,
        renderedAt: `t${i}b`,
        version: { engine: 'gen-1/sim-1' },
      });
    }
    return { id: 'ashford', _seed: SEED, prose };
  };

  test('under the cap it says how many are left, and it still presses', async () => {
    setFlagOverride('scribe', true);
    seat({ settlement: redrawn(1) });
    render(<ScribeRedrawButton saveId="ashford" />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('title')).toContain(`${SCRIBE_REDRAW_LIMIT - 1} of ${SCRIBE_REDRAW_LIMIT} redraws left`);
    expect(button.disabled).toBe(false);
    fireEvent.click(button);
    await waitFor(() => expect(redrawCalls).toHaveLength(1));
  });

  test('⛔ AT THE CAP IT IS PRESENT, DISABLED, AND PRESSING IT ASKS FOR NOTHING', async () => {
    // Hiding it would be a control that vanishes for a reason the reader cannot see; leaving it
    // live would be a press the trigger refuses in silence and the reader repeats.
    setFlagOverride('scribe', true);
    seat({ settlement: redrawn(SCRIBE_REDRAW_LIMIT) });
    render(<ScribeRedrawButton saveId="ashford" />);
    const button = screen.getByRole('button');
    expect(button.textContent).toContain('Redrawn as often as this epoch allows');
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('title')).toContain(`redrawn ${SCRIBE_REDRAW_LIMIT} times for this epoch`);
    // It says what makes it possible again, and that nothing was lost.
    expect(button.getAttribute('title')).toContain('Advance the world');
    expect(button.getAttribute('title')).toContain('kept and stays readable');
    // anchored: the three title assertions above prove the string is present and populated.
    expect(button.getAttribute('title')).not.toContain('—');
    fireEvent.click(button);
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    expect(redrawCalls).toHaveLength(0);
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

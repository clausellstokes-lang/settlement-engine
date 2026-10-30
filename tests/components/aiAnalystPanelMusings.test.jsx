/**
 * @vitest-environment jsdom
 *
 * aiAnalystPanelMusings.test.jsx — §3b TWO-VOICES presentation contract.
 *
 * The pure register split (claims vs musings, register purity) is pinned in
 * tests/domain/aiAnalyst.test.js. This file pins the PRESENTATION: an analyst reply
 * renders the two registers as VISIBLY DISTINCT blocks — the cited report (answer +
 * "Cited n/m" receipts) and the uncited MUSING register, plainly marked as a suggestion
 * and never carrying a citation.
 *
 * RETARGET (X-22, the owner, 2026-10-30): the analyst is no longer a docked panel with
 * its own box, Ask button, audience toggle and thumbs; its reply is a MESSAGE in the
 * door's one log (AiAnalystPanel.jsx's default export, AnalystReply). The two-voices
 * contract is unchanged; the scaffolding moved from typing into a panel to rendering
 * the reply the door hands it. The end-to-end ask (router → transport → reply in the
 * log) is pinned in tests/components/surveyorDoor.test.jsx.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';

afterEach(() => { cleanup(); });

// The reply reads nothing from the store (useAnalyst does, and is not called here).
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector({}) }));

import AnalystReply, { costLineFor, PLAYER_SAFE_LABEL } from '../../src/components/AiAnalystPanel.jsx';

const WITH_MUSINGS = {
  answer: 'Thornwall leads a commerce sphere. [faction:x]',
  claims: [{ text: 'Thornwall leads a commerce sphere.', source: 'faction:x', sourced: true, label: 'Spheres of influence' }],
  musings: [{ text: 'You could stage a betrayal at the next council — want that drafted?' }],
  citationCoverage: 1,
  registerPurity: 1,
  audience: 'dm',
  byok: false,
};

describe('AnalystReply — the two-voices registers (§3b)', () => {
  it('renders the cited report AND a distinct, clearly-labelled musing register', () => {
    render(<AnalystReply result={WITH_MUSINGS} />);

    // the MUSING register renders as its own block, marked as a suggestion (not the record)
    const musings = screen.getByTestId('analyst-musings');
    expect(musings.textContent).toMatch(/suggestions, not the record/i);
    expect(musings.textContent).toContain('stage a betrayal at the next council');

    // the cited report register renders separately (answer + the Cited n/m receipt line)
    expect(screen.getByText(/Thornwall leads a commerce sphere\./)).toBeTruthy();
    expect(screen.getByText(/Cited 1\/1/)).toBeTruthy();
    expect(screen.getByText(/Spheres of influence/)).toBeTruthy();

    // BY CONSTRUCTION: the musing text lives ONLY in the musing block, never inside a
    // cited receipt — the registers cannot blur in the UI.
    expect(musings.querySelector('span')?.textContent).not.toContain('betrayal');
  });

  it('no musings ⇒ no musing block (the register is absent, not empty chrome)', () => {
    render(<AnalystReply result={{
      answer: 'The engine does not record this. (the engine does not record this)',
      claims: [{ text: 'The engine does not record this.', source: null, sourced: false, label: 'the engine does not record this' }],
      musings: [],
      audience: 'dm',
      byok: false,
    }} />);
    expect(screen.getByText(/Cited 0\/1/)).toBeTruthy();
    expect(screen.queryByTestId('analyst-musings')).toBeNull();
  });
});

describe('AnalystReply — X-22: a message, not a panel', () => {
  it('carries no control: no thumbs, no Ask, no audience toggle (the anchor: the reply rendered)', () => {
    render(<AnalystReply result={WITH_MUSINGS} costLine={costLineFor(3, 7)} />);
    const reply = screen.getByTestId('analyst-reply');
    expect(reply.textContent).toContain('Thornwall');
    expect(within(reply).queryAllByRole('button')).toEqual([]);
    expect(within(reply).queryAllByRole('radio')).toEqual([]);
    expect(within(reply).queryAllByRole('textbox')).toEqual([]);
  });

  it('a player-safe reply is labelled; a DM reply is not', () => {
    const { unmount } = render(<AnalystReply result={{ ...WITH_MUSINGS, audience: 'player' }} />);
    expect(screen.getByTestId('analyst-audience').textContent).toBe(PLAYER_SAFE_LABEL);
    unmount();
    render(<AnalystReply result={WITH_MUSINGS} />);
    expect(screen.getByTestId('analyst-reply').getAttribute('data-audience')).toBe('dm');
    expect(screen.queryByTestId('analyst-audience')).toBeNull();
  });

  it('the cost is one muted line when the door passes it, and absent otherwise', () => {
    const { unmount } = render(<AnalystReply result={WITH_MUSINGS} costLine={costLineFor(3, 7)} />);
    expect(screen.getByTestId('surveyor-cost').textContent).toBe('3 credits per answer · 7 left');
    unmount();
    render(<AnalystReply result={WITH_MUSINGS} />);
    expect(screen.queryByTestId('surveyor-cost')).toBeNull();
    expect(costLineFor(1, undefined)).toBe('1 credit per answer');
    expect(costLineFor(5, 2, 'recap')).toBe('5 credits per recap · 2 left');
  });

  it('an unavailable analyst is one plain line in the log', () => {
    render(<AnalystReply result={{ error: 'The analyst is unavailable right now.' }} />);
    expect(screen.getByTestId('analyst-error').textContent).toBe('The analyst is unavailable right now.');
  });
});

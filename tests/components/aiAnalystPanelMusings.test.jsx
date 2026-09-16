/**
 * @vitest-environment jsdom
 *
 * aiAnalystPanelMusings.test.jsx — §3b TWO-VOICES panel contract.
 *
 * The pure register split (claims vs musings, register purity) is pinned in
 * tests/domain/aiAnalyst.test.js. This file pins the PRESENTATION: the panel
 * renders the two registers as VISIBLY DISTINCT blocks — the cited report (answer
 * + "Cited n/m" citations) and the uncited MUSING register, plainly marked as a
 * suggestion and never carrying a citation. The register can never blur in the UI
 * because the answer contract hands the client two separate arrays.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const { storeRef, askRef } = vi.hoisted(() => ({
  storeRef: { current: {} },
  askRef: { fn: null },
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeRef.current),
}));
// The lazy transport target of the panel's ask() — intercept so no network is touched.
vi.mock('../../src/lib/aiAnalyst.js', () => ({
  askAnalyst: (...a) => askRef.fn(...a),
  recordAnalystFeedback: vi.fn(),
}));

import AiAnalystPanel from '../../src/components/AiAnalystPanel.jsx';

// RETARGET (C13, THE ONE DOOR): the panel's self-owned launcher is retired — the
// SurveyorDoor routes here and controls `open`. The two-voices contract this file
// pins is unchanged; only the opening scaffolding moved to the controlled prop.
function openAndAsk() {
  render(<AiAnalystPanel open />);
  fireEvent.change(screen.getByLabelText(/your question for the campaign analyst/i), {
    target: { value: 'who rules the region?' },
  });
  fireEvent.click(screen.getByRole('button', { name: /^ask$/i }));
}

describe('AiAnalystPanel — the two-voices registers (§3b)', () => {
  it('renders the cited report AND a distinct, clearly-labelled musing register', async () => {
    storeRef.current = { settlement: null, savedSettlements: [], campaigns: [], activeCampaignId: null };
    askRef.fn = vi.fn(async () => ({
      answer: 'Thornwall leads a commerce sphere. [faction:x]',
      claims: [{ text: 'Thornwall leads a commerce sphere.', source: 'faction:x', sourced: true, label: 'Spheres of influence' }],
      musings: [{ text: 'You could stage a betrayal at the next council — want that drafted?' }],
      citationCoverage: 1,
      registerPurity: 1,
      audience: 'dm',
      byok: false,
    }));

    openAndAsk();

    // the MUSING register renders as its own block, marked as a suggestion (not the record)
    const musings = await waitFor(() => screen.getByTestId('analyst-musings'));
    expect(musings.textContent).toMatch(/suggestions, not the record/i);
    expect(musings.textContent).toContain('stage a betrayal at the next council');

    // the cited report register renders separately (answer + the Cited n/m receipt line)
    expect(screen.getByText(/Thornwall leads a commerce sphere\./)).toBeTruthy();
    expect(screen.getByText(/Cited 1\/1/)).toBeTruthy();

    // BY CONSTRUCTION: the musing text lives ONLY in the musing block, never inside a
    // cited receipt — the registers cannot blur in the UI.
    expect(musings.querySelector('span')?.textContent).not.toContain('betrayal');
  });

  it('no musings ⇒ no musing block (the register is absent, not empty chrome)', async () => {
    storeRef.current = { settlement: null, savedSettlements: [], campaigns: [], activeCampaignId: null };
    askRef.fn = vi.fn(async () => ({
      answer: 'The engine does not record this. (the engine does not record this)',
      claims: [{ text: 'The engine does not record this.', source: null, sourced: false, label: 'the engine does not record this' }],
      musings: [],
      citationCoverage: 1,
      registerPurity: 1,
      audience: 'dm',
      byok: false,
    }));

    openAndAsk();

    await waitFor(() => screen.getByText(/Cited 0\/1/));
    expect(screen.queryByTestId('analyst-musings')).toBeNull();
  });
});

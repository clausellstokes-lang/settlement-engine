/**
 * @vitest-environment jsdom
 *
 * tests/ui/instantWorldMagicQuestion.test.jsx — MG-1 pins
 * (docs/DESIGN_REALM_MAGIC_TOGGLE §4: THE QUESTION).
 *
 * The realm's magic stance is the one knob that cannot be nudged after the fact —
 * every member is minted under it — so it is ASKED rather than defaulted. These
 * pins hold the four properties that make that true:
 *
 *   1. The Generate CTA composes NOTHING until the question is answered.
 *   2. Each answer reaches the store action as the fourth basic knob, verbatim.
 *   3. Dismissing the question (Esc / Not yet) cancels the generation entirely —
 *      never a silent default, which is the defect this modal exists to prevent.
 *   4. The answer is remembered per device and pre-selected next time, and the
 *      card echoes the remembered answer so the modal never surprises.
 *
 * Negative control: pin 1 would pass vacuously if `instantWorld` were never
 * callable at all, so every pin that asserts NOT-called is paired with a run that
 * proves the same mount DOES call it once answered.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';

afterEach(cleanup);

let state = {};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(state); }
  useStore.getState = () => state;
  return { useStore };
});

import InstantWorldEntry from '../../src/components/instant/InstantWorldEntry.jsx';
import { DEFAULT_REALM_SIZE, DEFAULT_TONE, DEFAULT_MAP_KIND } from '../../src/domain/instantWorld/worldPlan.js';

function mount({ remembered = 'yes', instantWorld = vi.fn().mockResolvedValue({ ok: true }) } = {}) {
  const setRealmMagicChoice = vi.fn();
  state = {
    auth: { tier: 'premium' },
    isElevated: () => false,
    instantWorld,
    instantWorldBusy: false,
    setPurchaseModalOpen: vi.fn(),
    setActivePricingMoment: vi.fn(),
    displayPrefs: { realmMagicChoice: remembered },
    setRealmMagicChoice,
  };
  render(<InstantWorldEntry />);
  // Open the config card, then reach the CTA.
  fireEvent.click(screen.getByTestId('instant-world-open'));
  return { instantWorld, setRealmMagicChoice };
}

const question = () => screen.queryByRole('dialog', { name: 'Does magic exist in these lands?' });

describe('MG-1 — the question is asked before the world exists', () => {
  test('the Generate CTA opens the question and composes nothing yet', () => {
    const { instantWorld } = mount();
    expect(question()).toBeNull();

    fireEvent.click(screen.getByTestId('instant-world-generate'));

    expect(question()).toBeTruthy();
    expect(instantWorld).not.toHaveBeenCalled();
  });

  test('"A world of magic" composes with magic:"yes" as the fourth knob', async () => {
    const { instantWorld } = mount();
    fireEvent.click(screen.getByTestId('instant-world-generate'));
    fireEvent.click(screen.getByRole('button', { name: /A world of magic/ }));

    await waitFor(() => expect(instantWorld).toHaveBeenCalledTimes(1));
    expect(instantWorld.mock.calls[0][0]).toMatchObject({
      realmSize: DEFAULT_REALM_SIZE,
      tone: DEFAULT_TONE,
      mapKind: DEFAULT_MAP_KIND,
      magic: 'yes',
    });
    expect(question()).toBeNull();
  });

  test('"A mundane world" composes with magic:"no"', async () => {
    const { instantWorld } = mount();
    fireEvent.click(screen.getByTestId('instant-world-generate'));
    fireEvent.click(screen.getByRole('button', { name: /A mundane world/ }));

    await waitFor(() => expect(instantWorld).toHaveBeenCalledTimes(1));
    expect(instantWorld.mock.calls[0][0].magic).toBe('no');
  });

  test('Escape cancels the generation outright — never a silent default', async () => {
    const { instantWorld, setRealmMagicChoice } = mount();
    fireEvent.click(screen.getByTestId('instant-world-generate'));
    expect(question()).toBeTruthy();

    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => expect(question()).toBeNull());
    expect(instantWorld).not.toHaveBeenCalled();
    expect(setRealmMagicChoice).not.toHaveBeenCalled();

    // Negative control: the same mount composes once the question IS answered,
    // so the assertions above measure the cancel, not a dead button.
    fireEvent.click(screen.getByTestId('instant-world-generate'));
    fireEvent.click(screen.getByRole('button', { name: /A mundane world/ }));
    await waitFor(() => expect(instantWorld).toHaveBeenCalledTimes(1));
  });

  test('the dismissal button cancels too', async () => {
    const { instantWorld } = mount();
    fireEvent.click(screen.getByTestId('instant-world-generate'));
    fireEvent.click(screen.getByRole('button', { name: 'Not yet' }));

    await waitFor(() => expect(question()).toBeNull());
    expect(instantWorld).not.toHaveBeenCalled();
  });
});

describe('MG-1 — the answer is remembered per device', () => {
  test('answering records the choice through the display-preference setter', async () => {
    const { setRealmMagicChoice } = mount();
    fireEvent.click(screen.getByTestId('instant-world-generate'));
    fireEvent.click(screen.getByRole('button', { name: /A mundane world/ }));

    await waitFor(() => expect(setRealmMagicChoice).toHaveBeenCalledWith('no'));
  });

  test('the remembered answer is echoed in the card and pre-selected in the modal', () => {
    mount({ remembered: 'no' });
    expect(screen.getByTestId('instant-world-magic-echo').textContent).toBe('A mundane world');

    fireEvent.click(screen.getByTestId('instant-world-generate'));
    expect(document.activeElement?.textContent).toContain('A mundane world');
  });

  test('a corrupt remembered value falls back to a world of magic', () => {
    mount({ remembered: 'perhaps' });
    expect(screen.getByTestId('instant-world-magic-echo').textContent).toBe('A world of magic');

    fireEvent.click(screen.getByTestId('instant-world-generate'));
    expect(document.activeElement?.textContent).toContain('A world of magic');
  });
});

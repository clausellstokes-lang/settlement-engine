/**
 * @vitest-environment jsdom
 *
 * SuccessorPrompt does NOT fire a pricing moment on "Appoint someone new"
 * (finding components-dossier-library-5, W-R2-TRUST).
 *
 * THE BUG THIS CATCHES: pickNew() fired triggerPricingMoment('first_canon_export')
 * — export-themed copy at a succession moment, a purchase modal thrown on top of
 * the composer the DM was just scrolled to, AND it burned the 24h cooldown for
 * the REAL first-canon-export moment. pricingMoments' own doctrine is "don't ask
 * before they understand the value"; the composer flow IS the value moment.
 *
 * THE PIN: clicking "Appoint someone new" stages the ADD_NPC composer intent and
 * dismisses the prompt, but never opens the purchase modal.
 *
 * ── THE DEFERRED SCROLL IS PART OF THE PIN (CURE-T, 2026-09-20) ────────────────
 * pickNew dismisses the dialog and THEN, 100ms later, scrolls the DM onto the
 * composer: the timer is MEANT to outlive the dialog, so nothing clears it on
 * unmount. Left unflushed it fires after this test ends — and on PR #54's slower
 * CI runner, under v8 coverage, it fired after jsdom had been torn down, where
 * `document` is not a defined global. The async `ReferenceError: document is not
 * defined` failed the whole `Coverage floors (money / security)` job with all
 * 4,284 tests green (run 106198859179, SuccessorPrompt.jsx:110:22).
 *
 * So this file runs on FAKE TIMERS, flushes every timer INSIDE the test, and asserts
 * what each one does — the behaviour that leaked is now a pinned behaviour rather
 * than a race. The afterEach below asserts ZERO pending timers: a future click whose
 * timer nobody flushes reds HERE, by name, instead of reappearing as an unhandled
 * error in an unrelated CI job an hour later.
 *
 * THE MOUNT DEFERS ONE TIMER TOO, AND IT IS jsdom's, NOT THE PRODUCT'S. The dialog's
 * focus trap focuses the house exit on mount; jsdom's `focus()` ends in
 * `getSelection().collapse(this, 0)` (living/nodes/HTMLOrSVGElement-impl.js:73), and
 * `Selection-impl.js:349` fires `selectionchange` through `setTimeout(…, 0)` because
 * a browser fires it asynchronously. Measured in plain node, not reasoned. Narrowing
 * `toFake` would not help: it is a `setTimeout`, the same API the product's scroll
 * timer uses. So the mount's timer is flushed here as well, and the focus move it
 * accompanies — the promise `aria-modal` makes — is asserted rather than ignored.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

beforeEach(() => { vi.useFakeTimers(); });

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  // Measured BEFORE real timers are restored (uninstalling discards the queue), and
  // asserted after, so a red here never leaves fake timers installed.
  const pendingTimers = vi.getTimerCount();
  vi.useRealTimers();
  expect(pendingTimers).toBe(0);
});

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  return { useStore };
});

import SuccessorPrompt from '../../src/components/settlement/SuccessorPrompt.jsx';

describe('SuccessorPrompt — no borrowed pricing moment', () => {
  test('"Appoint someone new" stages ADD_NPC and dismisses without opening the purchase modal', () => {
    const stageComposerIntent = vi.fn();
    const dismiss = vi.fn();
    const setPurchaseModalOpen = vi.fn();
    storeRef.current = {
      pendingSuccession: {
        outgoingNpcName: 'Aldric',
        outgoingRole: 'Guildmaster',
        suggestedSuccessorIds: [],
        linkedInstitutionIds: ['inst-1'],
      },
      settlement: { name: 'Testburg', npcs: [], institutions: [{ id: 'inst-1', name: 'The Guild' }] },
      stageComposerIntent,
      dismissPendingSuccession: dismiss,
      auth: { tier: 'wanderer' },
      setPurchaseModalOpen,
    };

    // The composer the prompt scrolls to. jsdom implements no scrollIntoView at all,
    // so the spy is both the stand-in and the assertion surface.
    const composerAnchor = document.createElement('div');
    composerAnchor.setAttribute('data-anchor', 'event-composer');
    composerAnchor.scrollIntoView = vi.fn();
    document.body.appendChild(composerAnchor);

    render(<SuccessorPrompt />);

    // The mount's own deferred work (jsdom's selectionchange, armed by the focus trap)
    // is flushed here, and the focus move it rides on is pinned: aria-modal promises
    // the background is inert, so focus must be INSIDE the dialog, on its first
    // focusable — the house exit. After this the count is 0, so every pending timer
    // from here on belongs to a click.
    vi.runOnlyPendingTimers();
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' }));
    expect(vi.getTimerCount()).toBe(0);

    fireEvent.click(screen.getByRole('button', { name: /appoint someone new/i }));

    expect(stageComposerIntent).toHaveBeenCalledTimes(1);
    expect(stageComposerIntent.mock.calls[0][0]).toMatchObject({ type: 'ADD_NPC' });
    expect(dismiss).toHaveBeenCalledTimes(1);
    // The load-bearing assertion: no purchase modal interrupts the composer flow.
    expect(setPurchaseModalOpen).not.toHaveBeenCalled();

    // The click armed exactly one deferred scroll, and it survives the dismissal by
    // design. Run it here and pin what it does.
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(100);
    expect(composerAnchor.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(composerAnchor.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    // And the doctrine holds on the far side of the timer too: a pricing moment fired
    // from inside the deferred callback would have been invisible to the pin above.
    expect(setPurchaseModalOpen).not.toHaveBeenCalled();

    // The composer is not always on the page. With the anchor gone the same deferred
    // callback must be a silent no-op: it still queries, it throws nothing, and it
    // scrolls nothing (the spy's count stays at the one call it already has).
    composerAnchor.remove();
    fireEvent.click(screen.getByRole('button', { name: /appoint someone new/i }));
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(100);
    expect(composerAnchor.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(setPurchaseModalOpen).not.toHaveBeenCalled();
  });
});

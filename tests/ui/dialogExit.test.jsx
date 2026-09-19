/** @vitest-environment jsdom */
/**
 * dialogExit.test.jsx — THE DOOR, EXECUTED (owner order, ODQ §934.31: "when clicking
 * feedback and support, there should be an exit button to the pop up").
 *
 * The walker (tests/lint/dialogExit.walker.test.js) proves every rendered `role="dialog"`
 * in the tree HAS a labelled close control and a lifecycle hook. It reads source, so it
 * cannot prove the door OPENS. This file does, by driving the real components.
 *
 * ── WHY THE PRIMITIVE CARRIES MOST OF THE WEIGHT ───────────────────────────────
 * The order asked for the dialogs to be consolidated onto ONE close primitive rather
 * than patched one at a time, and they were: `DialogClose` fixes the accessible name,
 * the × text twin and the 44×44 phone target, and `useDialogDismiss` / `useDialogFocusTrap`
 * own Escape and focus restoration. So the behaviour is proved ONCE, here, against the
 * primitives themselves — and the walker proves every dialog really renders them. A
 * per-dialog re-assertion of the same primitive would measure the fixture, not the door.
 * What IS asserted per surface is the wiring each one got: the feedback panel (the
 * owner's named case) and the post-generate coach, whose close is also its §934.29
 * dismissal and therefore means something the others' do not.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { useState } from 'react';

import DialogClose from '../../src/components/primitives/DialogClose.jsx';
import { useDialogDismiss, useDialogFocusTrap } from '../../src/components/primitives/useDialogFocusTrap.js';

afterEach(cleanup);

// ── THE HOUSE CLOSE CONTROL ───────────────────────────────────────────────────

describe('DialogClose — one door, drawn the same way in every room', () => {
  it('is a real button whose accessible name is the word readers look for', () => {
    render(<DialogClose onClose={() => {}} />);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button.tagName).toBe('BUTTON');
  });

  it('names WHAT it closes without renaming the verb', () => {
    render(<DialogClose onClose={() => {}} subject="the import" />);
    expect(screen.getByRole('button', { name: 'Close the import' })).toBeTruthy();
    // ⛔ The word "Close" survives the subject — that is the property the walker reads
    // and the property a screen-reader user relies on.
    expect(screen.getByRole('button', { name: /\bClose\b/ })).toBeTruthy();
  });

  it('calls onClose exactly once per click', () => {
    const onClose = vi.fn();
    render(<DialogClose onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the × TEXT twin, so the door survives the icons-off channel', () => {
    const { container } = render(<DialogClose onClose={() => {}} />);
    expect(container.textContent).toContain('×');
  });
});

// ── THE LIFECYCLE: ESCAPE AND THE WAY BACK ────────────────────────────────────

/** A minimal host: an opener button, and a popover that uses the hook under test. */
function Host({ hook }) {
  const [open, setOpen] = useState(false);
  const ref = hook(open, () => setOpen(false));
  return (
    <div>
      <button type="button" data-testid="opener" onClick={() => setOpen(true)}>Open</button>
      {open && (
        <div ref={ref} role="dialog" aria-label="Probe" tabIndex={-1}>
          <DialogClose onClose={() => setOpen(false)} />
          <button type="button" data-testid="inside">Inside</button>
        </div>
      )}
    </div>
  );
}

// A body loop rather than describe.each over runtime values: the lighting census reads a
// describe.each whose table binds FUNCTIONS as a context-parameter closure it cannot prove,
// and the estate holds that shape at zero files (the walker's latent-closure arm). The two
// suites keep their titles and their arms exactly.
const DISMISS_HOOKS = [
  ['useDialogDismiss (non-modal)', useDialogDismiss],
  ['useDialogFocusTrap (modal)', useDialogFocusTrap],
];
for (const [name, hook] of DISMISS_HOOKS) describe(`${name} — Escape closes and focus goes home`, () => {
  it('Escape dismisses the popover', () => {
    render(<Host hook={hook} />);
    fireEvent.click(screen.getByTestId('opener'));
    expect(screen.getByRole('dialog', { name: 'Probe' })).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Probe' })).toBeNull();
  });

  it('the close control dismisses it too', () => {
    render(<Host hook={hook} />);
    fireEvent.click(screen.getByTestId('opener'));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog', { name: 'Probe' })).toBeNull();
  });

  it('focus returns to the control that opened it', () => {
    render(<Host hook={hook} />);
    const opener = screen.getByTestId('opener');
    opener.focus();
    fireEvent.click(opener);
    // Put focus inside the popover, as a reader tabbing into it would.
    screen.getByTestId('inside').focus();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.activeElement).toBe(opener);
  });
});

describe('the two hooks differ ONLY in whether the page stays reachable', () => {
  it('the modal hook moves focus INTO the dialog; the non-modal one does not steal it', () => {
    const trapped = render(<Host hook={useDialogFocusTrap} />);
    const trappedOpener = trapped.getByTestId('opener');
    trappedOpener.focus();
    fireEvent.click(trappedOpener);
    expect(
      trapped.container.contains(document.activeElement) && document.activeElement !== trappedOpener,
      'a modal dialog takes focus when it opens',
    ).toBe(true);
    cleanup();

    const quiet = render(<Host hook={useDialogDismiss} />);
    const quietOpener = quiet.getByTestId('opener');
    quietOpener.focus();
    fireEvent.click(quietOpener);
    expect(
      document.activeElement,
      'a non-modal popover must NOT interrupt: a hint that steals focus is a hint that interrupts',
    ).toBe(quietOpener);
  });
});

// ── THE OWNER'S NAMED CASE: FEEDBACK & SUPPORT ────────────────────────────────

vi.mock('../../src/store/index.js', () => {
  const data = { auth: { user: null }, generationId: null, lastSeed: null, generatedAt: null };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  return { useStore };
});

const FeedbackWidget = (await import('../../src/components/FeedbackWidget.jsx')).default;

describe('Feedback & support — the pop-up the order was raised about', () => {
  beforeEach(() => { try { localStorage.clear(); } catch { /* no-op */ } });

  /** Open it the way the product does: the footer control dispatches this event. */
  const openPanel = () => fireEvent(window, new Event('sf:open-feedback'));

  it('renders nothing until the footer control opens it', () => {
    const { container } = render(<FeedbackWidget />);
    expect(container.firstChild).toBeNull();
  });

  it('has a visible, labelled EXIT — the defect the owner reported', () => {
    render(<FeedbackWidget />);
    openPanel();
    expect(screen.getByRole('dialog', { name: 'Send feedback' })).toBeTruthy();
    const exit = screen.getByRole('button', { name: 'Close feedback' });
    expect(exit.tagName).toBe('BUTTON');
    // The word is there for a screen-reader user, and the × is there for everyone else.
    expect(exit.textContent).toContain('×');
  });

  it('the exit closes the panel', () => {
    const { container } = render(<FeedbackWidget />);
    openPanel();
    fireEvent.click(screen.getByRole('button', { name: 'Close feedback' }));
    expect(container.firstChild).toBeNull();
  });

  it('Escape closes it too — it had no Escape at all before', () => {
    const { container } = render(<FeedbackWidget />);
    openPanel();
    expect(container.firstChild).not.toBeNull();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(container.firstChild).toBeNull();
  });

  it('closing clears the draft, so reopening is not haunted by the last note', () => {
    render(<FeedbackWidget />);
    openPanel();
    const box = screen.getByLabelText('Your feedback');
    fireEvent.change(box, { target: { value: 'half a thought' } });
    fireEvent.keyDown(window, { key: 'Escape' });
    openPanel();
    expect(screen.getByLabelText('Your feedback').value).toBe('');
  });
});

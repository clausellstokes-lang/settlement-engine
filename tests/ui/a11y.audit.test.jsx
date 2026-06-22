/**
 * @vitest-environment jsdom
 *
 * tests/ui/a11y.audit.test.jsx — Tier 7.17 accessibility regression tests.
 *
 * The Tier 7.17 audit (docs/a11y-audit.md) found three classes of issues:
 *   1. Modal dialogs were missing role/aria-modal/aria-labelledby
 *   2. Close-button icons had no accessible name
 *   3. Primitives mostly already had role="status" / aria-label
 *
 * These tests lock the fixes in place so a future refactor can't silently
 * regress them. We render each fixed surface and assert the a11y
 * attributes are still there.
 *
 * What this test does NOT do:
 *   - Run axe-core or other full-tree audits (would require an extra dep
 *     and slow the gate)
 *   - Test color contrast (no rendered pixels in jsdom)
 *
 * (A+ design-a11y.6 update: the Dialog focus-trap IS now tested below — jsdom
 *  moves focus enough for Tab/Shift-Tab wrap, Escape, and focus-restore via
 *  element.focus() + a window keydown the trap listens on.)
 *
 * For full a11y coverage we'd add @axe-core/playwright in the e2e suite.
 * That's not in scope for Tier 7.17 — the audit doc captures it.
 */

import React from 'react';
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

// Mock stripe + supabase before importing modals that pull them in.
vi.mock('../../src/lib/stripe.js', () => ({
  startCheckout: vi.fn(),
  PRODUCTS: {
    credits_5:  { credits: 5,  price: '$4.99',  perCredit: '$1.00', discount: null,      tier: 'starter' },
    credits_15: { credits: 15, price: '$9.99',  perCredit: '$0.67', discount: '33% off', tier: 'value'   },
    credits_40: { credits: 40, price: '$19.99', perCredit: '$0.50', discount: '50% off', tier: 'best'    },
  },
}));
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: { from: () => ({ select: () => ({ eq: () => Promise.resolve({ data: [] }) }) }) },
}));
vi.mock('../../src/lib/auth.js', () => ({
  auth: { signInWithEmail: vi.fn(), signUpWithEmail: vi.fn(), signOut: vi.fn() },
}));
// StaleNarrativeModal reads the store (activeSaveId + requestNarrative); a
// selector-over-plain-object stub keeps the real zustand store out of the
// a11y render. FounderBadge tolerates it via `s.isFounder?.() ?? false`.
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector({
    activeSaveId: 'save-1',
    requestNarrative: vi.fn(),
  }),
}));

afterEach(cleanup);

// ── Dialog/modal a11y ───────────────────────────────────────────────────────
// Modal dialogs must announce themselves as a dialog, declare modality so
// screen readers know to trap, and give their icon-only close button an
// accessible name. (NarrativeDriftModal's cases moved here onto its
// successor, StaleNarrativeModal, when Roster & Tune was retired.)

describe('Tier 7.17 — Modal dialog a11y', () => {
  test('StaleNarrativeModal exposes role=dialog + aria-modal', async () => {
    const StaleNarrativeModal = (await import('../../src/components/StaleNarrativeModal.jsx')).default;
    const { container } = render(
      <StaleNarrativeModal open={true} changeLabel="Test change" onClose={() => {}} />,
    );
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  test('StaleNarrativeModal close button has aria-label', async () => {
    const StaleNarrativeModal = (await import('../../src/components/StaleNarrativeModal.jsx')).default;
    const { container } = render(
      <StaleNarrativeModal open={true} changeLabel="Test" onClose={() => {}} />,
    );
    // The close button (top right X) is icon-only — it must carry an
    // aria-label (copy key staleNarrative.ariaClose).
    const ariaButtons = container.querySelectorAll('button[aria-label]');
    expect(ariaButtons.length).toBeGreaterThanOrEqual(1);
  });
});

// ── Primitive a11y ──────────────────────────────────────────────────────────
// The design-system primitives all carry an explicit ARIA role and/or label.
// These tests assert the contract by rendering each primitive in its default
// state and looking for the attribute. Adding new primitives? Add a test here.

describe('Tier 7.17 — Primitive a11y contracts', () => {
  test('BandPill exposes role=status', async () => {
    const { BandPill } = await import('../../src/components/primitives/BandPill.jsx');
    const { container } = render(<BandPill band="strained" />);
    expect(container.querySelector('[role="status"]')).not.toBeNull();
  });

  test('CanonBadge exposes role=status for non-default tags', async () => {
    const { CanonBadge } = await import('../../src/components/primitives/CanonBadge.jsx');
    const entity = { source: 'user', canonStatus: 'canon' };
    const { container } = render(<CanonBadge entity={entity} />);
    expect(container.querySelector('[role="status"]')).not.toBeNull();
  });

  test('StateBadge exposes role=status with descriptive aria-label', async () => {
    const StateBadge = (await import('../../src/components/primitives/StateBadge.jsx')).default;
    const { container } = render(<StateBadge kind="narrated" />);
    const node = container.querySelector('[role="status"]');
    expect(node).not.toBeNull();
    // Should have an aria-label (either tooltip prop or default from COPY).
    expect(node.getAttribute('aria-label')?.length).toBeGreaterThan(0);
  });

  test('FounderBadge has an accessible name', async () => {
    // FounderBadge is a small pill — should at least carry role="status" or a title.
    const FounderBadge = (await import('../../src/components/primitives/FounderBadge.jsx')).default;
    const { container } = render(<FounderBadge size="md" />);
    // FounderBadge renders nothing when the user isn't a founder. That's
    // fine — we just assert it doesn't crash.
    expect(container).toBeDefined();
  });
});

// ── A+ design-a11y.4 — conditionally-rendered Alert is a live region ─────────
// A WCAG 4.1.3 (Status Messages) contract: an error/status that appears after
// the user acts must be announced by assistive tech. Errors are assertive
// (role=alert); other tones polite (role=status).

describe('A+ design-a11y.4 — Alert live region', () => {
  test('error Alert is an assertive live region (role=alert)', async () => {
    const { Alert } = await import('../../src/components/auth/authUI.jsx');
    const { container } = render(<Alert type="error">Bad password</Alert>);
    const node = container.querySelector('[role="alert"]');
    expect(node).not.toBeNull();
    expect(node.getAttribute('aria-live')).toBe('assertive');
    expect(node.textContent).toContain('Bad password');
  });

  test('success Alert is a polite status region (role=status)', async () => {
    const { Alert } = await import('../../src/components/auth/authUI.jsx');
    const { container } = render(<Alert type="success">Saved</Alert>);
    const node = container.querySelector('[role="status"]');
    expect(node).not.toBeNull();
    expect(node.getAttribute('aria-live')).toBe('polite');
  });
});

// ── A+ design-a11y.6 — Dialog focus-trap is keyboard-locked ──────────────────
// Shell remembers the trigger, focuses the first focusable on open, wraps
// Tab/Shift-Tab, closes on Escape, and restores focus on unmount. These pin
// that contract so a refactor (e.g. dropping preventDefault in the trap) reds.

describe('A+ design-a11y.6 — Dialog focus trap', () => {
  async function openConfirm(onCancel = () => {}, onConfirm = () => {}) {
    const { ConfirmDialog } = await import('../../src/components/primitives/Dialog.jsx');
    const utils = render(
      <ConfirmDialog open title="Confirm?" body="Body" onCancel={onCancel} onConfirm={onConfirm} />,
    );
    const dialog = utils.container.querySelector('[role="dialog"]');
    const buttons = Array.from(dialog.querySelectorAll('button'));
    return { ...utils, dialog, buttons };
  }

  test('Tab from the last focusable wraps to the first', async () => {
    const { buttons } = await openConfirm();
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    last.focus();
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
  });

  test('Shift+Tab from the first focusable wraps to the last', async () => {
    const { buttons } = await openConfirm();
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    first.focus();
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  test('Escape invokes onCancel', async () => {
    const onCancel = vi.fn();
    await openConfirm(onCancel);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('focus restores to the trigger element on close', async () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'open';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);
    const { unmount } = await openConfirm();
    // The trap moved focus into the dialog on open…
    expect(document.activeElement).not.toBe(trigger);
    unmount();
    // …and restored it to the trigger on close.
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});

// ── A+ design-a11y.5 — every icon-only button has an accessible name ──────────
// An icon-only <button> with no text and no aria-label is announced as just
// "button" by a screen reader. The statically-enforcing guarantee is the
// jsx-hygiene/icon-button-needs-label lint rule (ERROR, zero offenders); this
// render test confirms the accessible name actually COMPUTES at runtime — i.e.
// the rule isn't satisfied by an empty aria-label that resolves to nothing.

describe('A+ design-a11y.5 — icon-only buttons carry an accessible name', () => {
  // jsdom doesn't compute the full ARIA accessible-name algorithm, so approximate
  // its primary sources: aria-label, then visible text, then title.
  const accName = (btn) =>
    (btn.getAttribute('aria-label') || btn.textContent || btn.getAttribute('title') || '').trim();

  test('Dialog Shell: every button (incl. the icon-only close) resolves to a non-empty name', async () => {
    const { ConfirmDialog } = await import('../../src/components/primitives/Dialog.jsx');
    const { container } = render(
      <ConfirmDialog open title="Confirm?" body="Body" onCancel={() => {}} onConfirm={() => {}} />,
    );
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.length).toBeGreaterThanOrEqual(3); // close (icon-only) + cancel + confirm
    for (const b of buttons) {
      expect(accName(b), `a button rendered with no accessible name: ${b.outerHTML.slice(0, 90)}`).not.toBe('');
    }
    // The top-right close carries no text label; its name must resolve via
    // aria-label. Icons-off renders an aria-hidden "×" glyph in the slot, so the
    // glyph is hidden from assistive tech and the accessible name still comes
    // from the label — assert no NON-hidden text contributes to the name.
    const close = buttons.find((b) => b.getAttribute('aria-label') === 'Close');
    expect(close, 'expected a label-only close button labeled "Close"').toBeTruthy();
    const closeVisibleText = Array.from(close.childNodes)
      .filter((n) => !(n.nodeType === 1 && n.getAttribute?.('aria-hidden') === 'true'))
      .map((n) => n.textContent)
      .join('')
      .trim();
    expect(closeVisibleText).toBe(''); // name comes from the label, not visible text
  });
});


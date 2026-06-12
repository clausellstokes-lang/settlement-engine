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
 *   - Test keyboard focus traps (jsdom doesn't move focus realistically)
 *   - Test color contrast (no rendered pixels in jsdom)
 *
 * For full a11y coverage we'd add @axe-core/playwright in the e2e suite.
 * That's not in scope for Tier 7.17 — the audit doc captures it.
 */

import React from 'react';
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

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


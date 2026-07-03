/** @vitest-environment jsdom */
/**
 * dossierLadderModal.test.jsx — the anonymous pre-checkout ladder popup (108).
 *
 * Three rungs, each routing to its own handler, plus a Cancel:
 *   1. Create a free account  → onCreateAccount
 *   2. Consider Cartographer  → onCartographer
 *   3. One-time download      → onOneTime  (the ONLY rung the copy presents as
 *      one-time; the popup must never promise the retro auto-upgrade)
 *   Cancel / Escape           → onClose
 *
 * Also asserts house-dialog a11y (role=dialog, aria-modal, labelled title).
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import DossierLadderModal from '../../src/components/dossier/DossierLadderModal.jsx';
import { t } from '../../src/copy/index.js';
import { SINGLE_DOSSIER } from '../../src/config/pricing.js';

function setup(overrides = {}) {
  const handlers = {
    onClose: vi.fn(),
    onCreateAccount: vi.fn(),
    onCartographer: vi.fn(),
    onOneTime: vi.fn(),
    ...overrides,
  };
  render(<DossierLadderModal {...handlers} />);
  return handlers;
}

afterEach(cleanup);

describe('DossierLadderModal — three routes', () => {
  test('renders a labelled modal dialog', () => {
    setup();
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText(t('dossierExport.ladder.title'))).toBeTruthy();
  });

  test('the create-account rung routes to onCreateAccount', () => {
    const h = setup();
    fireEvent.click(screen.getByText(t('dossierExport.ladder.account.label')));
    expect(h.onCreateAccount).toHaveBeenCalledTimes(1);
    expect(h.onOneTime).not.toHaveBeenCalled();
  });

  test('the Cartographer rung routes to onCartographer', () => {
    const h = setup();
    fireEvent.click(screen.getByText(t('dossierExport.ladder.cartographer.label')));
    expect(h.onCartographer).toHaveBeenCalledTimes(1);
  });

  test('the one-time rung routes to onOneTime', () => {
    const h = setup();
    fireEvent.click(screen.getByText(t('dossierExport.ladder.oneTime.label')));
    expect(h.onOneTime).toHaveBeenCalledTimes(1);
  });

  test('Cancel closes the popup', () => {
    const h = setup();
    fireEvent.click(screen.getByRole('button', { name: t('dossierExport.ladder.cancel') }));
    expect(h.onClose).toHaveBeenCalledTimes(1);
  });

  test('does NOT promise the retro auto-upgrade on the one-time rung', () => {
    setup();
    // The one-time rung's copy must read as a plain one-time download — no
    // "keep re-downloading" / "yours forever" language leaking the grace.
    const oneTime = screen.getByText(t('dossierExport.ladder.oneTime.description', { price: SINGLE_DOSSIER.priceLabel }));
    expect(oneTime.textContent.toLowerCase()).not.toMatch(/re-download|forever|keep re/);
    expect(oneTime.textContent.toLowerCase()).toContain('once');
  });
});

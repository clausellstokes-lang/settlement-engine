/** @vitest-environment jsdom */
/**
 * exportGalleryException.test.jsx - THE GALLERY KEEPS ITS EXPORT.
 *
 * THE OWNER (2026-11-03): "Oh and export (outside of gallery) buttons are not to work are to say
 * available at launch and have the purple gold combination as well."
 *
 * The only export the gallery carries is ShareToGallery's "Export to gallery" (the public
 * gallery dossier itself, PublicDossierView, renders no export, download or PDF control). For a
 * NON-STAFF account in a CLOSED build it stays enabled, wears no launch skin and no pill, and
 * publishes; and the gate's own gallery answer (LaunchGatedExport `gallery`) is open.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';

const { storeRef, published } = vi.hoisted(() => ({ storeRef: { current: {} }, published: { ids: [] } }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  useStore.subscribe = () => () => {};
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true, supabase: null }));
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn(), paidAction: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));
vi.mock('../../src/lib/gallery.js', () => ({
  publishSettlement: vi.fn(async (id) => { published.ids.push(id); return 'slug'; }),
  unpublishSettlement: vi.fn(),
  updateGalleryMetadata: vi.fn(async (_id, metadata) => metadata),
}));

import { purchasesOpen } from '../../src/lib/launchGate.js';
import ShareToGallery from '../../src/components/ShareToGallery.jsx';
import Button from '../../src/components/primitives/Button.jsx';
import LaunchGatedExport from '../../src/components/primitives/LaunchGatedExport.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); published.ids.length = 0; });

const NON_STAFF = () => ({
  auth: { tier: 'premium', user: { id: 'u1' } },
  isElevated: () => false, canExport: () => true,
  savedSettlements: [], campaigns: [], updateSavedSettlement: vi.fn(),
});

describe('the gallery export, NON-STAFF, before launch', () => {
  it('the build under test is closed (so the arms below are not vacuous)', () => {
    expect(purchasesOpen()).toBe(false);
  });

  it('"Export to gallery" stays enabled, unskinned and unpilled, and publishes', async () => {
    storeRef.current = NON_STAFF();
    render(<ShareToGallery saveId="s1" campaignState={{ phase: 'canon', eventLog: [], locks: {} }} settlement={{ id: 's1', name: 'Stoneford', npcs: [] }} />);
    const control = screen.getByRole('button', { name: /Export to gallery/ });
    expect(control.disabled).toBe(false);
    expect(control.getAttribute('data-skin')).toBeNull();
    expect(control.getAttribute('aria-describedby')).toBeNull();
    expect(control.closest('[data-launch-gate]')).toBeNull();
    expect(control.textContent).not.toContain('Available at launch'); // anchored: getByRole found this control by its live name above
    fireEvent.click(control);
    await act(async () => {});
    expect(screen.queryByRole('dialog', { name: 'Available at launch' })).toBeNull();
    expect(published.ids).toEqual(['s1']);
  });

  it('the gate answers open for a gallery export: the control renders as given and fires', () => {
    storeRef.current = NON_STAFF();
    const onClick = vi.fn();
    render(<LaunchGatedExport gallery><Button onClick={onClick}>Export</Button></LaunchGatedExport>);
    const control = screen.getByRole('button', { name: 'Export' });
    expect(control.getAttribute('data-skin')).toBeNull();
    fireEvent.click(control);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('the same control outside the gallery is gated (the positive control)', () => {
    storeRef.current = NON_STAFF();
    const onClick = vi.fn();
    render(<LaunchGatedExport><Button onClick={onClick}>Export</Button></LaunchGatedExport>);
    const control = screen.getByRole('button', { name: 'Export' });
    expect(control.getAttribute('data-skin')).toBe('launch');
    fireEvent.click(control);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Available at launch' })).toBeTruthy();
  });
});

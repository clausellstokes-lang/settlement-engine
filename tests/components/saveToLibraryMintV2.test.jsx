/**
 * @vitest-environment jsdom
 *
 * saveToLibraryMintV2.test.jsx — V2 DEFAULT-MINT WIRING (create chokepoint 1/3).
 *
 * THE PINS (the ruled default): a newly-saved settlement mints layout v2 onto its fresh
 * blob (new-mint carries v2); a settlement that ALREADY carries a mapEdits container is
 * preserved verbatim (non-clobbering — an existing edit is never overwritten, and an
 * EXISTING save is byte-identical because it never re-enters this path with no container).
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const { saveRef } = vi.hoisted(() => ({ saveRef: { fn: null } }));

vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector({ setActiveSaveId: vi.fn() }) }));
vi.mock('../../src/lib/saves.js', () => ({ saves: { save: (...a) => saveRef.fn(...a) } }));
vi.mock('../../src/lib/pendingSaveDraft.js', () => ({ writeDraft: vi.fn(), clearDraft: vi.fn() }));
vi.mock('../../src/store/saveMoments.js', () => ({ recordSaveMomentForActiveSave: vi.fn() }));

import { SaveToLibraryButton } from '../../src/components/generate/SaveToLibraryButton.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('SaveToLibraryButton — v2 default-mint', () => {
  test('a fresh settlement (no mapEdits) is saved with layout v2 minted', async () => {
    let captured = null;
    saveRef.fn = vi.fn(async (p) => { captured = p; return 'save-1'; });
    render(<SaveToLibraryButton settlement={{ name: 'Newburg', tier: 'town' }} canSave isMobile={false} onSignIn={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /save to library/i }));
    await waitFor(() => expect(saveRef.fn).toHaveBeenCalledTimes(1));
    expect(captured.settlement.mapEdits).toEqual({ layoutLawVersion: 2 });
    expect(captured.name).toBe('Newburg');
  });

  test('a settlement that ALREADY carries mapEdits is preserved verbatim (non-clobbering)', async () => {
    let captured = null;
    saveRef.fn = vi.fn(async (p) => { captured = p; return 'save-2'; });
    const existing = { styleLens: 'vtt' }; // a user edit already on the blob
    render(<SaveToLibraryButton settlement={{ name: 'Oldburg', tier: 'town', mapEdits: existing }} canSave isMobile={false} onSignIn={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /save to library/i }));
    await waitFor(() => expect(saveRef.fn).toHaveBeenCalledTimes(1));
    // The existing container is untouched — no forced v2 over a settlement that already edited.
    expect(captured.settlement.mapEdits).toBe(existing);
    expect(captured.settlement.mapEdits).toEqual({ styleLens: 'vtt' });
  });
});

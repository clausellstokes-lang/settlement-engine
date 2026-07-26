/**
 * @vitest-environment jsdom
 *
 * tests/ui/libraryLivingSurface.test.jsx — W4a "Library living surface" lock-in.
 *
 * Pins the load-bearing contracts of the Library living-surface adoption so a
 * future refactor can't silently drift them:
 *   1. Advance-time is PREMIUM-gated — a non-premium CampaignFolder never renders
 *      a working Advance button; premium's button is disabled until canonized.
 *   2. Bulk-select actions — the extracted hook canonizes only active drafts and
 *      the BulkActionBar hides the campaign actions from free tier.
 *   3. SaveQuotaMeter reads the REAL cap passed in (never a hardcoded 3).
 *   4. Living-world signals are DORMANCY-QUIET — a peaceful, deity-free,
 *      non-campaign settlement produces no signal row and no health pip.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, renderHook, act, fireEvent } from '@testing-library/react';

afterEach(cleanup);

// Store mock — only CampaignFolder (isAdvanceInFlight) + SettlementCard
// (isSettlementClockBound) read the store in this file. Both return benign
// defaults so the components render deterministically.
const storeState = {
  isAdvanceInFlight: () => false,
  isSettlementClockBound: () => false,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

// ── 1. Advance-time premium gate ───────────────────────────────────────────
describe('CampaignFolder — advance-time is premium-gated', () => {
  const baseCampaign = { id: 'c1', name: 'The Reach', settlementIds: [], collapsed: false };
  const noop = () => {};
  const folderProps = {
    settlements: [], allModifiers: new Map(), onViewSettlement: noop,
    deleteId: null, setDeleteId: noop, deleteConfirmed: noop, campaigns: [],
    addToCampaign: noop, removeFromCampaign: noop, onDeleteCampaign: noop,
    onRenameCampaign: noop, toggleCollapsed: noop, onReactivate: noop,
    canReactivate: false, reactivatingId: null, onAdvanceTime: noop,
    onCanonize: noop, onCreateCampaign: noop, onNavigate: noop,
  };

  test('free tier (canManageCampaigns=false) renders NO advance button', async () => {
    const { CampaignFolder } = await import('../../src/components/settlements/CampaignFolder.jsx');
    render(<CampaignFolder {...folderProps} campaign={baseCampaign} canManageCampaigns={false} worldCanonized={false} />);
    // The non-premium folder collapses to the retained/upgrade stub — no controls.
    expect(screen.queryByRole('button', { name: /advance time/i })).toBeNull();
    expect(screen.queryByText(/Advance Time/i)).toBeNull();
  });

  test('premium but not canonized → advance button present and DISABLED', async () => {
    const { CampaignFolder } = await import('../../src/components/settlements/CampaignFolder.jsx');
    render(<CampaignFolder {...folderProps} campaign={baseCampaign} canManageCampaigns worldCanonized={false} />);
    const btn = screen.getByRole('button', { name: /advance time/i });
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(true);
  });

  test('premium + canonized + a member → advance button ENABLED', async () => {
    const { CampaignFolder } = await import('../../src/components/settlements/CampaignFolder.jsx');
    const member = { id: 's1', name: 'Hearthfell', tier: 'town', settlement: { name: 'Hearthfell', config: {}, npcs: [], factions: [], neighbourNetwork: [] } };
    render(
      <CampaignFolder
        {...folderProps}
        settlements={[member]}
        campaign={{ ...baseCampaign, settlementIds: ['s1'] }}
        canManageCampaigns
        worldCanonized
      />,
    );
    const btn = screen.getByRole('button', { name: /advance time/i });
    expect(btn.disabled).toBe(false);
  });
});

// ── 2. Bulk-select actions ─────────────────────────────────────────────────
describe('useLibraryBulkSelect — canonize gates to active drafts', () => {
  test('canonizeBulk canonizes ONLY active drafts among the selection', async () => {
    const { useLibraryBulkSelect } = await import('../../src/hooks/useLibraryBulkSelect.js');
    const canonizeSavedSettlement = vi.fn();
    const saves = [
      { id: 'draft1', campaignState: { phase: 'draft' } },
      { id: 'canon1', campaignState: { phase: 'canon' } },
    ];
    const { result } = renderHook(() => useLibraryBulkSelect({
      saves,
      addToCampaign: vi.fn(),
      canonizeSavedSettlement,
      bulkDeleteConfirmed: vi.fn(),
      isActive: () => true,
      isDraft: (s) => s.campaignState?.phase === 'draft',
    }));

    act(() => { result.current.toggleSelect('draft1'); });
    act(() => { result.current.toggleSelect('canon1'); });
    expect(result.current.selectedIds.size).toBe(2);

    act(() => { result.current.canonizeBulk(); });
    expect(canonizeSavedSettlement).toHaveBeenCalledTimes(1);
    expect(canonizeSavedSettlement).toHaveBeenCalledWith('draft1');
    // clear() ran after the bulk op.
    expect(result.current.selectedIds.size).toBe(0);
  });

  test('bulk re-home preflights every selected id and refuses without a partial move', async () => {
    const { useLibraryBulkSelect } = await import('../../src/hooks/useLibraryBulkSelect.js');
    const addToCampaign = vi.fn();
    const getCampaignMembershipBlock = vi.fn((_campaignId, saveId) =>
      saveId === 'busy' ? { ok: false, reason: 'advance_in_flight' } : null);
    const { result } = renderHook(() => useLibraryBulkSelect({
      saves: [{ id: 'safe' }, { id: 'busy' }],
      addToCampaign,
      canonizeSavedSettlement: vi.fn(),
      bulkDeleteConfirmed: vi.fn(),
      getCampaignMembershipBlock,
      isActive: () => true,
      isDraft: () => true,
    }));
    act(() => {
      result.current.toggleSelect('safe');
      result.current.toggleSelect('busy');
    });

    let refusal;
    act(() => {
      refusal = result.current.addToCampaignBulk('camp-1');
    });
    expect(refusal).toEqual({ ok: false, reason: 'advance_in_flight' });
    expect(addToCampaign).not.toHaveBeenCalled();
    expect(result.current.selectedIds.size).toBe(2);
  });

  test('selection keys normalize numeric save ids at the hook boundary', async () => {
    const { useLibraryBulkSelect } = await import('../../src/hooks/useLibraryBulkSelect.js');
    const canonizeSavedSettlement = vi.fn();
    const { result } = renderHook(() => useLibraryBulkSelect({
      saves: [{ id: 7 }],
      addToCampaign: vi.fn(),
      canonizeSavedSettlement,
      bulkDeleteConfirmed: vi.fn(),
      isActive: () => true,
      isDraft: () => true,
    }));

    act(() => {
      result.current.toggleSelect(7);
    });
    expect([...result.current.selectedIds]).toEqual(['7']);
    act(() => {
      result.current.canonizeBulk();
    });
    expect(canonizeSavedSettlement).toHaveBeenCalledWith('7');
  });
});

describe('BulkActionBar — free tier hides the campaign actions', () => {
  const makeBulk = () => ({
    selectedIds: new Set(['a', 'b']),
    exportError: '', deleteConfirm: false,
    setDeleteConfirm: () => {}, clear: () => {},
    addToCampaignBulk: () => {}, canonizeBulk: () => {},
    exportBulk: () => {}, confirmDelete: () => {},
  });

  test('canManageCampaigns=false → no Add-to-campaign / Canonize, but Export + Delete + count', async () => {
    const BulkActionBar = (await import('../../src/components/settlements/BulkActionBar.jsx')).default;
    render(<BulkActionBar bulk={makeBulk()} campaigns={[]} canManageCampaigns={false} />);
    expect(screen.getByText('2 selected')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /add to campaign/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /canonize/i })).toBeNull();
    expect(screen.getByRole('button', { name: /export/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /delete/i })).toBeTruthy();
  });

  test('canManageCampaigns=true → Add-to-campaign + Canonize present', async () => {
    const BulkActionBar = (await import('../../src/components/settlements/BulkActionBar.jsx')).default;
    render(<BulkActionBar bulk={makeBulk()} campaigns={[{ id: 'c1', name: 'Reach' }]} canManageCampaigns />);
    expect(screen.getByRole('button', { name: /add to campaign/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /canonize/i })).toBeTruthy();
  });

  test('a blocked bulk target is visibly disabled', async () => {
    const BulkActionBar = (await import('../../src/components/settlements/BulkActionBar.jsx')).default;
    const bulk = { ...makeBulk(), getAddToCampaignBlock: () => ({ reason: 'advance_in_flight' }) };
    render(<BulkActionBar bulk={bulk} campaigns={[{ id: 'c1', name: 'Reach' }]} canManageCampaigns />);
    fireEvent.click(screen.getByRole('button', { name: /add to campaign/i }));
    expect(screen.getByRole('menuitem', { name: /Reach/i }).disabled).toBe(true);
  });
});

// ── 3. SaveQuotaMeter reads the real cap ───────────────────────────────────
describe('SaveQuotaMeter — reads the cap passed in, never hardcodes 3', async () => {
  const { default: SaveQuotaMeter, PREMIUM_PITCH } = await import('../../src/components/settlements/SaveQuotaMeter.jsx');

  test('free at cap → "0 of 3", "at cap", progressbar max mirrors the prop', () => {
    const { container } = render(<SaveQuotaMeter tier="free" used={3} max={3} />);
    expect(screen.getByText(/0 of 3 saves/i)).toBeTruthy();
    expect(screen.getByText(/at cap/i)).toBeTruthy();
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar.getAttribute('aria-valuemax')).toBe('3');
    expect(bar.getAttribute('aria-valuenow')).toBe('3');
  });

  test('free with a DIFFERENT cap (5) → the meter reflects 5, not a hardcoded 3', () => {
    const { container } = render(<SaveQuotaMeter tier="free" used={1} max={5} />);
    expect(screen.getByText(/4 of 5 saves/i)).toBeTruthy();
    expect(container.querySelector('[role="progressbar"]').getAttribute('aria-valuemax')).toBe('5');
  });

  test('premium → "Unlimited saves", no meter', () => {
    const { container } = render(<SaveQuotaMeter tier="premium" used={12} max={Infinity} />);
    expect(screen.getByText(/Unlimited saves/i)).toBeTruthy();
    expect(container.querySelector('[role="progressbar"]')).toBeNull();
  });

  test('anon → "Sign in to save"', () => {
    render(<SaveQuotaMeter tier="anon" used={0} max={0} />);
    expect(screen.getByText(/Sign in to save/i)).toBeTruthy();
  });

  test('the premium pitch names the SIMULATION, never a size cap', () => {
    expect(PREMIUM_PITCH).toMatch(/advance time|campaign|simulation|pantheon/i);
    expect(PREMIUM_PITCH).not.toMatch(/metropolis|larger|bigger size/i);
  });
});

// ── 4. Living-world signals are dormancy-quiet ─────────────────────────────
describe('living-world signals — dormancy-quiet', async () => {
  const { settlementSignals, healthPip } = await import('../../src/components/settlements/livingWorldSignals.js');
  const LivingWorldSignalRow = (await import('../../src/components/settlements/LivingWorldSignalRow.jsx')).default;

  test('a peaceful, deity-free, non-campaign settlement → hasLiveWorld false, no war/faith', () => {
    const sig = settlementSignals({ settlement: { name: 'Quietvale', config: {}, npcs: [], factions: [] }, settlementId: 'q1' });
    expect(sig.hasLiveWorld).toBe(false);
    expect(sig.war).toBeNull();
    expect(sig.faith).toBeNull();
  });

  test('LivingWorldSignalRow renders NOTHING for a dormant model', () => {
    const sig = settlementSignals({ settlement: { name: 'Quietvale', config: {} }, settlementId: 'q1' });
    const { container } = render(<LivingWorldSignalRow model={sig} />);
    expect(container.firstChild).toBeNull();
  });

  test('an assigned deity opens the row (faith pip)', () => {
    const sig = settlementSignals({
      settlement: { name: 'Solhaven', config: { primaryDeitySnapshot: { name: 'Sol', alignmentAxis: 'good', rankAxis: 'major' } } },
      settlementId: 's1',
    });
    expect(sig.hasLiveWorld).toBe(true);
    expect(sig.faith?.name).toBe('Sol');
    const { container } = render(<LivingWorldSignalRow model={sig} />);
    expect(container.firstChild).not.toBeNull();
    expect(screen.getByText(/Sol/)).toBeTruthy();
  });

  test('healthPip is null-safe (no settlement → null)', () => {
    expect(healthPip(null)).toBeNull();
  });
});

/** @vitest-environment jsdom */
/**
 * useLaunchTones.test.jsx — the container's launch-tone hook (THE OWNER, 2026-11-01, ODQ
 * §934.103). The campaign-less case answers synchronously (no war chunk); an owning
 * campaign resolves War through WarTab's own predicate after first paint.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor, cleanup } from '@testing-library/react';

const storeState = { campaigns: [] };
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeState),
}));

import useLaunchTones from '../../src/components/dossier/useLaunchTones.js';

const town = { id: 'town-1', name: 'Xindao', config: {}, relationships: [] };
afterEach(() => { cleanup(); storeState.campaigns = []; });

describe('useLaunchTones', () => {
  it('a settlement no campaign owns: every teaser tab is toned, synchronously', () => {
    const { result } = renderHook(() => useLaunchTones({ settlement: town }));
    expect(result.current).toEqual({ war: true, rumors: true, faith: true });
  });

  it('a deity embed lights Faith; a rumor ledger on an owning campaign lights Rumors', () => {
    storeState.campaigns = [{ id: 'c1', settlementIds: ['town-1'], worldState: { spatialLedgers: { rumorLedgers: {} } } }];
    const withDeity = { ...town, config: { primaryDeitySnapshot: { name: 'Sunlord Aurelian' } } };
    const { result } = renderHook(() => useLaunchTones({ settlement: withDeity }));
    expect(result.current.rumors).toBe(false);
    expect(result.current.faith).toBe(false);
  });

  it('an owning campaign with no war picture resolves War to a teaser through the war chunk', async () => {
    storeState.campaigns = [{ id: 'c1', settlementIds: ['town-1'], worldState: {} }];
    const { result } = renderHook(() => useLaunchTones({ settlement: town }));
    // before the chunk answers the strip keeps the live colour (no false purple)
    expect(result.current.war).toBe(false);
    await waitFor(() => expect(result.current.war).toBe(true), { timeout: 15000 });
  }, 20000);
});

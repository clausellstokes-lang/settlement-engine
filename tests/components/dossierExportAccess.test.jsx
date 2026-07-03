/** @vitest-environment jsdom */
/**
 * dossierExportAccess.test.jsx — the PDF-export ladder gate (migration 108).
 *
 * Two layers:
 *   1. resolveExportAccess — the pure decision table (no React), the source of
 *      truth for every export surface's allow/deny + reason.
 *   2. useDossierExportAccess — the React hook wrapping it, which additionally
 *      fetches the durable-right flag for a free account's SAVED dossier once.
 *
 * The decision table (the contract every surface routes through):
 *   Cartographer / Founder / elevated → allowed, reason 'tier'
 *   anonymous                          → denied,  reason 'anon'
 *   free + no saveId                   → denied,  reason 'unsaved'
 *   free + saveId + entitled           → allowed, reason 'entitled'
 *   free + saveId + not entitled       → denied,  reason 'unpurchased'
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import {
  resolveExportAccess,
  useDossierExportAccess,
} from '../../src/hooks/useDossierExportAccess.js';

// ── 1. Pure decision table ──────────────────────────────────────────────────
describe('resolveExportAccess decision table', () => {
  test('Cartographer (premium) exports every dossier as a tier feature', () => {
    expect(resolveExportAccess({ tier: 'premium', isElevated: false, saveId: null, entitled: false }))
      .toEqual({ allowed: true, reason: 'tier' });
    expect(resolveExportAccess({ tier: 'premium', isElevated: false, saveId: 's1', entitled: false }))
      .toEqual({ allowed: true, reason: 'tier' });
  });

  test('Founder exports every dossier as a tier feature', () => {
    expect(resolveExportAccess({ tier: 'founder', isElevated: false, saveId: 's1', entitled: false }))
      .toEqual({ allowed: true, reason: 'tier' });
  });

  test('an elevated role clears the gate regardless of tier', () => {
    expect(resolveExportAccess({ tier: 'free', isElevated: true, saveId: null, entitled: false }))
      .toEqual({ allowed: true, reason: 'tier' });
    expect(resolveExportAccess({ tier: 'anon', isElevated: true, saveId: null, entitled: false }))
      .toEqual({ allowed: true, reason: 'tier' });
  });

  test('anonymous is denied with reason anon (before any save check)', () => {
    expect(resolveExportAccess({ tier: 'anon', isElevated: false, saveId: null, entitled: false }))
      .toEqual({ allowed: false, reason: 'anon' });
  });

  test('free account with an UNSAVED draft is denied with reason unsaved', () => {
    expect(resolveExportAccess({ tier: 'free', isElevated: false, saveId: null, entitled: false }))
      .toEqual({ allowed: false, reason: 'unsaved' });
  });

  test('free account holding the durable right on the save is allowed (entitled)', () => {
    expect(resolveExportAccess({ tier: 'free', isElevated: false, saveId: 's1', entitled: true }))
      .toEqual({ allowed: true, reason: 'entitled' });
  });

  test('free account on a saved dossier with no right is denied (unpurchased)', () => {
    expect(resolveExportAccess({ tier: 'free', isElevated: false, saveId: 's1', entitled: false }))
      .toEqual({ allowed: false, reason: 'unpurchased' });
  });
});

// ── 2. The hook: fetches the durable-right flag once for a free saved dossier ─
const storeState = {
  auth: { tier: 'free' },
  isElevated: () => false,
  dossierEntitlements: {},
  refreshDossierEntitlement: vi.fn(() => Promise.resolve(false)),
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  return { useStore };
});

function Probe({ saveId }) {
  const access = useDossierExportAccess(saveId);
  return <span data-testid="access">{`${access.allowed}:${access.reason}`}</span>;
}

afterEach(() => {
  cleanup();
  storeState.auth = { tier: 'free' };
  storeState.isElevated = () => false;
  storeState.dossierEntitlements = {};
  storeState.refreshDossierEntitlement = vi.fn(() => Promise.resolve(false));
});

describe('useDossierExportAccess (React hook)', () => {
  test('fetches the durable-right flag once for a free account with a saved, uncached dossier', () => {
    const { getByTestId } = render(<Probe saveId="s1" />);
    // Uncached → the effect kicks a refresh; the initial read is unpurchased.
    expect(getByTestId('access').textContent).toBe('false:unpurchased');
    expect(storeState.refreshDossierEntitlement).toHaveBeenCalledWith('s1');
  });

  test('reads a cached durable right as entitled and does NOT refetch', () => {
    storeState.dossierEntitlements = { s1: true };
    const { getByTestId } = render(<Probe saveId="s1" />);
    expect(getByTestId('access').textContent).toBe('true:entitled');
    expect(storeState.refreshDossierEntitlement).not.toHaveBeenCalled();
  });

  test('does not fetch for an unsaved draft (no save id)', () => {
    const { getByTestId } = render(<Probe saveId={null} />);
    expect(getByTestId('access').textContent).toBe('false:unsaved');
    expect(storeState.refreshDossierEntitlement).not.toHaveBeenCalled();
  });

  test('does not fetch for a Cartographer (tier grants export outright)', () => {
    storeState.auth = { tier: 'premium' };
    const { getByTestId } = render(<Probe saveId="s1" />);
    expect(getByTestId('access').textContent).toBe('true:tier');
    expect(storeState.refreshDossierEntitlement).not.toHaveBeenCalled();
  });
});

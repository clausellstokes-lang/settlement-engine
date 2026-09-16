/** @vitest-environment jsdom */
/**
 * tests/ui/oracleRemoved.test.jsx — regression pins for THE ORACLE REMOVAL
 * (owner order 2026-07-22: "remove it completely — that role is already taken by
 * the AI we already built" [the Surveyor Workshop]).
 *
 * The Oracle had TWO mount points: the Realm Inspector's "The Oracle" door and the
 * DM Screen's DM-only "The Oracle" card. BOTH are gone, and the OraclePanel
 * component / domain oracle behind them is deleted. These assertions fail if
 * either surface (or the panel) is ever reintroduced.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);

// Store mock — both RealmInspector and DmScreen read through the store selector.
const storeState = {
  savedSettlements: [{ id: 's1', name: 'Ashford' }],
  selectedSettlementId: 's1',
  settlement: { name: 'Ashford', tier: 'Village', population: 800, institutions: [], npcs: [] },
  campaigns: [],
  activeCampaignId: null,
  setActivePricingMoment: vi.fn(),
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

// The DM Screen's other panels are out of scope for this pin — stub them so the
// render exercises only DmScreen's OWN structure (where the Oracle card lived).
vi.mock('../../src/components/tableLedger/TableLedgerPanel.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/auspice/AuspicePanel.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/temperament/TemperamentPicker.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/ChroniclersLetterPanel.jsx', () => ({ default: () => null }));

import { REALM_INSPECTOR_SECTIONS } from '../../src/components/map/RealmInspector.jsx';
import DmScreen from '../../src/components/screen/DmScreen.jsx';

describe('Oracle removal — no oracle door in the Realm Inspector', () => {
  test('REALM_INSPECTOR_SECTIONS offers no oracle section', () => {
    expect(REALM_INSPECTOR_SECTIONS.some((s) => s.id === 'oracle')).toBe(false);
    expect(REALM_INSPECTOR_SECTIONS.some((s) => s.label === 'The Oracle')).toBe(false);
  });
});

describe('Oracle removal — no oracle card on the DM Screen', () => {
  test('DmScreen mounts its surviving tools but renders no "The Oracle" card', () => {
    render(<DmScreen />);
    // The DM Screen still stands (the dossier grid renders)...
    expect(screen.getByText('Dossier')).toBeTruthy();
    // ...but the Oracle card and its panel are gone (default face is DM, where it lived).
    expect(screen.queryByText('The Oracle')).toBeNull();
    expect(screen.queryByTestId('oracle-answer')).toBeNull();
  });
});

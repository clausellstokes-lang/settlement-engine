/**
 * @vitest-environment jsdom
 *
 * tests/ui/servicesTogglePanelKey.test.jsx
 *
 * Regression net for the service force/exclude toggle-key contract.
 *
 * Multiple generated institutions can fuzzy-match the SAME catalog service
 * key (svcKey) and get grouped under one row in ServicesTogglePanel — e.g.
 * both "Grand Market" and "Market" resolve to the INSTITUTION_SERVICES key
 * "Market". The generator (getServicesForInstitution) resolves each
 * institution's override against `${resolvedKey}_service_${name}` (its
 * keyToggleKey, where resolvedKey === svcKey) OR its own instance name.
 *
 * The bug: the panel wrote toggles keyed by the FIRST grouped display name
 * (`catalogNames[0]_service_...`). When catalogNames[0] differed from the
 * svcKey, that key matched neither the other institutions' instToggleKey nor
 * the shared keyToggleKey, so the toggle silently didn't apply to any
 * institution except (coincidentally) one whose instance name equalled
 * catalogNames[0].
 *
 * The fix: write toggles keyed by svcKey (the catalog key), which the
 * generator resolves for EVERY grouped institution via keyToggleKey.
 *
 * This test seeds a catalog whose first-inserted institution name
 * ("Grand Market") differs from its svcKey ("Market"), drives the force-all
 * bulk write, and asserts every written key is prefixed by the svcKey — not
 * the leading display name. Before the fix it would be keyed "Grand Market_*"
 * and fail.
 */

import { describe, test, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

// Seed catalog: two institutions that both fuzzy-match the "Market" service
// key, with the NON-svcKey name inserted first so catalogNames[0] ("Grand
// Market") differs from the svcKey ("Market"). This is the exact shape that
// exposed the bug.
const MOCK_CATALOG = {
  Commerce: {
    'Grand Market': {},
    Market: {},
  },
};

vi.mock('../../src/store/selectors.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    selectTierForGrid: () => 'City',
    selectCurrentCatalog: () => MOCK_CATALOG,
  };
});

import { useStore } from '../../src/store/index.js';
import ServicesTogglePanel from '../../src/components/ServicesTogglePanel.jsx';

afterEach(cleanup);
beforeEach(() => {
  useStore.getState().setServiceToggles({});
});

describe('ServicesTogglePanel toggle-key contract', () => {
  test('force-all writes toggles keyed by svcKey, not the leading display name', () => {
    render(<ServicesTogglePanel />);

    // ControlsStrip exposes a force-all control; click it to drive bulkForce.
    const forceBtn = screen.getByRole('button', { name: /force all/i });
    fireEvent.click(forceBtn);

    const toggles = useStore.getState().servicesToggles;
    const keys = Object.keys(toggles);

    // Something was written.
    expect(keys.length).toBeGreaterThan(0);

    // Every written key is prefixed by the svcKey "Market_service_", which the
    // generator's keyToggleKey (`${resolvedKey}_service_...`) resolves for BOTH
    // "Grand Market" and "Market" institutions.
    for (const k of keys) {
      expect(k.startsWith('Market_service_')).toBe(true);
    }

    // Regression guard: NOT keyed by the leading display name (the old bug),
    // which would have keyed everything under "Grand Market_service_..." and
    // never applied to the "Market" institution.
    expect(keys.some((k) => k.startsWith('Grand Market_service_'))).toBe(false);

    // And every value is the forced object shape.
    for (const v of Object.values(toggles)) {
      expect(v).toMatchObject({ allow: true, force: true, forceExclude: false });
    }
  });
});

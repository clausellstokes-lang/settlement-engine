/**
 * @vitest-environment jsdom
 *
 * magicSupplyBlue.test.jsx — magic actively covering a supply gap reads BLUE
 * (not purple) across the supply-chain surfaces, matching the service-level
 * "Magical Infrastructure" tag.
 *
 * Regression pin: `magically_sustained` chains used to render purple (#5a2a8a),
 * which read as an exotic/warning state rather than "supplied, not impaired", and
 * clashed with the blue magic tag. They now share the info-blue token; Import nodes
 * were moved OFF blue so blue means "magic covering a gap" unambiguously in the
 * diagram. The ✦ marker is retained (channel redundancy + the no-physical-fallback
 * fragility signal).
 */
import { describe, test, expect } from 'vitest';

import { STATUS } from '../../src/components/new/SupplyChainsPanel.jsx';
import { FLOW_STATUS } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { swatch } from '../../src/components/theme.js';

describe('magic-sustained supply reads blue, not purple', () => {
  test('SupplyChainsPanel STATUS.magically_sustained is the info-blue (matching the tag)', () => {
    expect(STATUS.magically_sustained.color).toBe(swatch.info);
    expect(STATUS.magically_sustained.bg).toBe(swatch.infoBg);
    expect(STATUS.magically_sustained.color).not.toBe(swatch.magic); // no longer purple
    expect(STATUS.magically_sustained.dot).toBe('✦'); // marker kept
  });

  test('EconomicsTab FLOW_STATUS.magically_sustained is the info-blue too', () => {
    expect(FLOW_STATUS.magically_sustained.color).toBe(swatch.info);
    expect(FLOW_STATUS.magically_sustained.bg).toBe(swatch.infoBg);
    expect(FLOW_STATUS.magically_sustained.color).not.toBe(swatch.magic);
    expect(FLOW_STATUS.magically_sustained.label).toMatch(/✦/);
  });

  test('both surfaces agree on the magic colour (one language across the dossier)', () => {
    expect(STATUS.magically_sustained.color).toBe(FLOW_STATUS.magically_sustained.color);
  });
});

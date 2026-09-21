/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumMapCalamity.test.jsx — Compendium-completion Wave K pin (its calamity half).
 *
 * The calamity severity rows read 'scale x0.7 . k-factor 0.5' with neither term explained.
 * This pins the explanation.
 *
 * Wave K's map half (the lens readings, the Illustrated lens note and the district
 * wealth/safety bands, all rendered on the Map Lenses hub) left with that hub: the owner
 * ordered the map lenses and interior pages removed from the Compendium on 2026-09-16
 * (docs/FIRST_CONTACT_BACKLOG.md), so its arms and data blocks are gone and only the
 * calamity arm remains here. The file keeps its name so every register that names it
 * stays valid.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import { CalamityHub } from '../../src/components/compendium/CatalogHubs.jsx';

afterEach(cleanup);

describe('compendium calamity (Wave K)', () => {
  test('the Calamity hub explains scale and k-factor', () => {
    const { container: calC } = render(<CalamityHub />);
    const calText = (calC.textContent || '').toLowerCase();
    expect(calText.includes('scale multiplies')).toBe(true);
    expect(calText.includes('k-factor')).toBe(true);
  });
});

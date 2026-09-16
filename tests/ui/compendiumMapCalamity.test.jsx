/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumMapCalamity.test.jsx — Compendium-completion Wave K pin.
 *
 * Map lenses were bare label+id with no description and omitted the pickable Illustrated
 * lens; the settlement-map district wealth/safety bands were defined nowhere; and the
 * calamity severity rows read 'scale x0.7 . k-factor 0.5' with neither term explained.
 * This pins the additions and binds the district vocabulary to qualitativeBands.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { LensesHub, CalamityHub } from '../../src/components/compendium/CatalogHubs.jsx';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

afterEach(cleanup);

describe('compendium map lenses + districts + calamity', () => {
  test('every lens has a reading and the Illustrated 6th lens is noted', () => {
    for (const l of CD.lenses.entries) expect(l.reading && l.reading.trim().length, `${l.id} reading`).toBeGreaterThan(0);
    expect(CD.lenses.illustratedNote.toLowerCase()).toContain('illustrated');
  });

  test('district wealth/safety bands are the real qualitativeBands labels', () => {
    expect(CD.districts.wealth.length).toBe(6);
    expect(CD.districts.safety.length).toBe(5);
    expect(CD.districts.categories.length).toBeGreaterThanOrEqual(11);
    const src = readFileSync(join(ROOT, 'src/domain/qualitativeBands.js'), 'utf8').toLowerCase();
    for (const d of [...CD.districts.wealth, ...CD.districts.safety]) {
      expect(src.includes(d.label.toLowerCase()), `qualitativeBands no longer stamps district band "${d.label}"`).toBe(true);
    }
    // The prosperity-word collision is disarmed in the note.
    expect(CD.districts.note.toLowerCase()).toContain('prosperity');
  });

  test('the Lenses hub renders lens readings + district bands; Calamity explains scale/k-factor', () => {
    const { container: lensC } = render(<LensesHub />);
    const lensText = lensC.textContent || '';
    for (const l of CD.lenses.entries) expect(lensText.includes(l.reading), `Lenses hub missing reading for "${l.id}"`).toBe(true);
    for (const d of CD.districts.wealth) expect(lensText.includes(d.label), `Lenses hub missing district "${d.label}"`).toBe(true);

    const { container: calC } = render(<CalamityHub />);
    const calText = (calC.textContent || '').toLowerCase();
    expect(calText.includes('scale multiplies')).toBe(true);
    expect(calText.includes('k-factor')).toBe(true);
  });
});

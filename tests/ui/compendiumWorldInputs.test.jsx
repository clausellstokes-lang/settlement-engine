/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumWorldInputs.test.jsx — Compendium-completion Wave D pin.
 *
 * THE GAP: the config Terrain and Culture pickers each carry a HelpPopover whose
 * "Read full reference" deep-links to /compendium#terrain and #cultures, but NO tab
 * stamped those ids and no section defined the vocabulary — the lifelines landed on a
 * page that said nothing. This pins the fix:
 *   1. CD.terrain covers every DISASTER_TYPE_BY_TERRAIN terrain, each with a reading.
 *   2. CD.cultures.values id set is a SUPERSET of the generator's own CULTURES (a
 *      drift guard: authored inline in the gen script to avoid importing resolveConfig).
 *   3. The Tiers tab stamps id="terrain" and renders every terrain + reading; the
 *      Arcane tab stamps id="cultures" and renders every culture label + the note.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { TiersTab, ArcaneTab } from '../../src/components/compendium/CatalogTabs.jsx';
import { CULTURES } from '../../src/generators/steps/resolveConfig.js';
import { DISASTER_TYPE_BY_TERRAIN } from '../../src/domain/spatial/calamity.js';

afterEach(cleanup);

describe('compendium world inputs — terrain', () => {
  test('CD.terrain covers every terrain with a reading', () => {
    const ids = CD.terrain.map((t) => t.id).sort();
    expect(ids).toEqual(Object.keys(DISASTER_TYPE_BY_TERRAIN).sort());
    for (const t of CD.terrain) expect(t.reading.trim().length, `${t.id} reading`).toBeGreaterThan(0);
  });

  test('the Tiers tab stamps id="terrain" and renders every terrain + reading', () => {
    const { container } = render(<TiersTab />);
    expect(container.querySelector('#terrain'), 'id="terrain" anchor').toBeTruthy();
    const text = container.textContent || '';
    for (const t of CD.terrain) {
      expect(text.toLowerCase().includes(t.id), `Tiers tab missing terrain "${t.id}"`).toBe(true);
      expect(text.includes(t.reading), `Tiers tab missing reading for "${t.id}"`).toBe(true);
    }
  });
});

describe('compendium world inputs — cultures', () => {
  test('CD.cultures.values is a superset of the generator CULTURES (drift guard)', () => {
    const ids = new Set(CD.cultures.values.map((c) => c.id));
    for (const c of CULTURES) expect(ids.has(c), `culture "${c}" missing from the compendium list`).toBe(true);
    expect(CD.cultures.note.trim().length).toBeGreaterThan(0);
  });

  test('the Arcane tab stamps id="cultures" and renders every culture label + the note', () => {
    const { container } = render(<ArcaneTab />);
    expect(container.querySelector('#cultures'), 'id="cultures" anchor').toBeTruthy();
    const text = container.textContent || '';
    expect(text.includes(CD.cultures.note)).toBe(true);
    for (const c of CD.cultures.values) expect(text.includes(c.label), `Arcane tab missing culture "${c.label}"`).toBe(true);
  });
});

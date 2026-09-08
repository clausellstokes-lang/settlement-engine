/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumPower.test.jsx — Compendium-completion Wave I pin (power family).
 *
 * The Power tab hung "Faction power = institutional base x public legitimacy" on a
 * legitimacy vocabulary it never defined, named no faction archetypes despite the tab
 * name, and defined no governance-stability vocabulary. This pins the additions:
 *   1. The Public Legitimacy ladder is bound to the factionDynamics band labels.
 *   2. CD.factionArchetypes covers every FACTION_ARCHETYPES value with a label + reading.
 *   3. The Power tab renders the legitimacy ladder, the faction archetypes, and the
 *      governance-stability labels.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { PowerTab_ } from '../../src/components/compendium/CatalogTabs.jsx';
import { FACTION_ARCHETYPES } from '../../src/domain/factionArchetypes.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

afterEach(cleanup);

describe('compendium power — legitimacy, factions, governance', () => {
  test('the Public Legitimacy ladder rung names are the real factionDynamics labels', () => {
    const ladder = CD.bandLadders.find((l) => l.id === 'legitimacy');
    expect(ladder, 'legitimacy ladder present').toBeTruthy();
    expect(ladder.levels.map((x) => x.name)).toEqual([
      'Endorsed', 'Approved', 'Tolerated', 'Contested', 'Legitimacy Crisis',
    ]);
    const src = readFileSync(join(ROOT, 'src/generators/factionDynamics.js'), 'utf8');
    for (const { name } of ladder.levels) {
      expect(src.includes(`'${name}'`), `factionDynamics no longer stamps legitimacy label "${name}"`).toBe(true);
    }
  });

  test('CD.factionArchetypes covers every FACTION_ARCHETYPES value with a label + reading', () => {
    const ids = new Set(CD.factionArchetypes.map((f) => f.id));
    for (const id of Object.values(FACTION_ARCHETYPES)) {
      expect(ids.has(id), `faction archetype "${id}" missing from the compendium`).toBe(true);
    }
    for (const f of CD.factionArchetypes) {
      expect(f.label && f.label.trim().length, `${f.id} label`).toBeGreaterThan(0);
      expect(f.reading && f.reading.trim().length, `${f.id} reading`).toBeGreaterThan(0);
    }
    expect(CD.governance.labels.length).toBeGreaterThanOrEqual(6);
    expect(CD.governance.note.trim().length).toBeGreaterThan(0);
  });

  test('the Power tab renders the ladder, the faction archetypes, and the governance labels', () => {
    const { container } = render(<PowerTab_ />);
    const text = container.textContent || '';
    expect(text.includes('Public Legitimacy')).toBe(true);
    expect(text.includes('Endorsed')).toBe(true);
    for (const f of CD.factionArchetypes) expect(text.includes(f.label), `Power tab missing faction "${f.label}"`).toBe(true);
    for (const g of CD.governance.labels) expect(text.includes(g.label), `Power tab missing governance "${g.label}"`).toBe(true);
  });
});

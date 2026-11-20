/**
 * @vitest-environment jsdom
 *
 * tests/ui/regenerationDeltaBrokenNames.test.jsx — THE "BROKEN DEPENDENCIES"
 * ROW NAMES THINGS, NEVER PRINTS THEIR INTERNAL IDS.
 *
 * After a reroll the delta card's warning row printed `brokenDependencies`
 * raw — internal ids such as `hook.…` and `faction.…` — where a reader needs
 * the thing's name (VISIBLE-BUGS item 4, 2026-11-12; measured on 20 town
 * reroll pairs: 1,148 entries, every one an id). The row now prints the
 * catalog label this card prints for the same entry elsewhere, and where
 * there is none, the entry's kind in words.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

import { RegenerationDeltaCard } from '../../src/components/primitives/RegenerationDeltaCard.jsx';
import { deriveRegenerationDelta } from '../../src/domain/regenerationDelta.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

afterEach(cleanup);

/** A dotted internal id: a lower-case key, a dot, then an id body with no spaces. */
const DOTTED_ID = /(^|[\s·:])[a-z][A-Za-z_]*\.[A-Za-z0-9_][\w.-]*(?=$|[\s·])/;

describe('RegenerationDeltaCard — broken dependencies are named, not id-printed', () => {
  test('a real reroll: no removed id reaches the row, and each label does', () => {
    const cfg = { ...DEFAULT_CONFIG, settType: 'town' };
    const before = generateSettlementPipeline(cfg, null, { seed: 'vb4-guard', customContent: {} });
    const after = generateSettlementPipeline(cfg, null, { seed: 'vb4-guard-r', customContent: {} });
    const delta = deriveRegenerationDelta(before, after);
    expect(delta.brokenDependencies.length).toBeGreaterThan(0);
    render(<RegenerationDeltaCard delta={delta} />);
    const text = screen.getByRole('alert').textContent;
    const leaked = delta.brokenDependencies.filter((id) => text.includes(id));
    expect(leaked).toEqual([]);
    const someLabel = delta.removedEntities.find((e) => e.label && e.label !== e.id)?.label;
    expect(text).toContain(someLabel);
  });

  test('an entry with no usable label reads as its kind in words', () => {
    const delta = {
      brokenDependencies: ['hook.h_17', 'faction.silver', 'supplyChain.iron', 'mystery.x9'],
      removedEntities: [
        { type: 'hook', id: 'hook.h_17' },
        { type: 'faction', id: 'faction.silver', label: 'faction.silver' },
      ],
    };
    render(<RegenerationDeltaCard delta={delta} />);
    const text = screen.getByRole('alert').textContent;
    // anchored: the row is rendered (getByRole throws otherwise) and the exact toBe below pins its whole text
    expect(text).not.toMatch(DOTTED_ID);
    expect(text).toBe('Broken dependencies: a hook · a faction · a supply chain · a removed entry');
  });
});

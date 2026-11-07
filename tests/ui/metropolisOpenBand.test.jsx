/**
 * @vitest-environment jsdom
 *
 * tests/ui/metropolisOpenBand.test.jsx — X-46 car 1b (the owner, 2026-11-04: "it should not have
 * a cap"). Every reader of POPULATION_RANGES prints the metropolis as "15,000+": the metropolis
 * row's `max` is the BODY of the tailed roll, never a ceiling. And the DM's forced promotion into
 * the top tier never clamps a population down to that body edge.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import { TiersTab } from '../../src/components/compendium/CatalogTabs.jsx';
import { COMPENDIUM_INDEX } from '../../src/domain/compendium/searchIndex.js';
import { shiftTier } from '../../src/domain/events/mutateEntities.js';

afterEach(cleanup);

describe('the metropolis band reads open on every surface', () => {
  test('the compendium tiers tab prints 15,000+ and no ceiling', () => {
    const { container } = render(<TiersTab />);
    const text = container.textContent || '';
    expect(text).toContain('15,000+ pop.');
    expect(text).not.toContain('60,000'); // anchored: the line above pins the 15,000+ label in this same text
    expect(text).not.toContain('50,000'); // anchored: two lines up pins the 15,000+ label in this same text
  });

  test('the compendium search keywords carry 15000+ for the metropolis, not a ceiling', () => {
    const row = COMPENDIUM_INDEX.find(e => e.id === 'tier-metropolis');
    expect(row?.keywords).toContain('15000+');
    expect(row?.keywords).not.toContain('60000'); // anchored: the line above pins 15000+ in these keywords
    expect(row?.keywords).not.toContain('50000'); // anchored: two lines up pins 15000+ in these keywords
  });
});

describe('the forced promotion into the top tier is unclamped', () => {
  test('a city of 250,000 promoted keeps its 250,000; a city of 9,000 rises to the floor 15,000', () => {
    const big = shiftTier({ id: 's1', tier: 'city', population: 250000, institutions: [] }, { payload: { direction: 'promotion' } });
    const small = shiftTier({ id: 's2', tier: 'city', population: 9000, institutions: [] }, { payload: { direction: 'promotion' } });
    const read = (r) => r?.settlement?.population ?? r?.population;
    expect(read(big)).toBe(250000);
    expect(read(small)).toBe(15000);
  });
});

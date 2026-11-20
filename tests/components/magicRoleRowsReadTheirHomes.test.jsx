/** @vitest-environment jsdom */
/**
 * magicRoleRowsReadTheirHomes.test.jsx — W2-C-LEAVES-SIDE item 7 (2026-11-13; ROUND-3-CUT #1086, MED): "Economic role:
 * absent" on the Magic tab of rr2s-city-occupied-rand-1 beside an alchemical export ("Alchemical trade (potions,
 * reagents)") and an Alchemist quarter. The chair's ruling: a role row reads the home that speaks of that role (the
 * economy's exports and income for the economic role; the defence's tradition, facts/magic.js :: defenceHoldsArcane,
 * for the military role); "absent" is never printed where that home shows the role; where the row cannot be made true
 * it is left out.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveMagicPosture } from '../../src/domain/display/dossierViewModel.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** The reader's own shape (REVIEW-R2-STAGES render.rr2s.jsx :: cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rr2s-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @param {any} s */
const rows = (s) => { const { container } = render(<MagicTab settlement={s} />); return [...container.querySelectorAll('[data-role-line]')].map((n) => n.textContent); };

afterEach(cleanup);

describe('the Magic tab\'s role rows read the homes that speak of each role (#1086, #1394)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: "absent" is left out beside the economy\'s alchemy, and beside the defence\'s own arcane tradition', () => {
    const base = { name: 'Spireholt', population: 4000, config: { magicExists: true, magicLevel: 'low' }, institutions: [], powerStructure: { factions: [] } };
    const plain = rows({ ...base, economicState: {} });
    expect(plain, 'anchored: the four rows print').toContain('Economic role: absent');
    expect(plain).toContain('Military role: absent');
    const sold = rows({ ...base, economicState: { primaryExports: ['Alchemical trade (potions, reagents)'] } });
    expectAbsentWithAnchor(sold, 'Economic role: absent', 'Military role: absent', 'an alchemical export');
    expectAbsentWithAnchor(rows({ ...base, economicState: { incomeSources: [{ source: 'Apothecary & Alchemy' }] } }), 'Economic role: absent', 'Military role: absent', 'an alchemy income');
    expectAbsentWithAnchor(rows({ ...base, economicState: {}, defenseProfile: { traditions: { hasArcane: true } } }), 'Military role: absent', 'Economic role: absent', 'the defence\'s arcane tradition');
  });

  test('the reader\'s town: rr2s-city-occupied-rand-1 sells alchemy and prints no "Economic role: absent"; a hamlet that sells none keeps it', () => {
    const s = birthApp('rr2s-city-occupied-rand-1');
    expect(deriveMagicPosture(s).roles.economic, 'anchored: the profile says absent').toBe('absent');
    expect(s.economicState.primaryExports, 'anchored: the export').toContain('Alchemical trade (potions, reagents)');
    const shown = rows(s);
    expect(shown.length, 'the other rows stand').toBe(3);
    expect(shown.some((l) => /^Economic role/.test(String(l)))).toBe(false);
    expect(rows(birthApp('rr2s-hamlet-calm-rand-1'))).toContain('Economic role: absent');
  }, 60000);
});

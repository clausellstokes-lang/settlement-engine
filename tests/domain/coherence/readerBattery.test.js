/**
 * readerBattery.test.js — the READER battery's ten checks (lane READER-INSTRUMENTS, 2026-11-04).
 *
 * Each check is held on a short hand-built rendered text (the line shapes the soak's 60-settlement
 * sample prints, artifacts/reader-base/sample at 64aeda87) and a record holding only what the check
 * consults: one arm where the fault is on the page, one negative control where it is not.
 */
import { describe, expect, test } from 'vitest';

import { institutionalCatalog } from '../../../src/data/institutionalCatalog.js';
import * as R from '../../../src/domain/coherence/readerBattery.js';

/** @param {Record<string, unknown>} over */
const rec = (over = {}) => ({ name: 'Testholm', tier: 'town', config: { terrainType: 'plains', tradeRouteAccess: 'road' }, institutions: [], npcs: [], ...over });

// ── 1. validation-on-page
describe('reader:validation-on-page', () => {
  const overview = 'Structural Issues\nRiver Fisheries: River fisheries require river access.\nAncient Grove: Ancient Grove is not compatible with port access.';
  test('the validator lines on the page fire; on a riverside terrain the requires-river line is its own sub-case', () => {
    const s = rec({ config: { terrainType: 'riverside', tradeRouteAccess: 'port' } });
    const rows = R.validationOnPageFindings(s, { overview, resources: 'Gaps & Opportunities ▲\nStone: Stone quarry exists but lacks access to stone' });
    expect(rows.map((r) => r.detail.split(']')[0])).toEqual(['[structural', '[requires-on-water', '[gaps']);
    expect(rows[1].quote).toBe('River Fisheries: River fisheries require river access.');
  });
  test('the stated count of critical issues against the Critical Issues listed', () => {
    const viability = '✗ Not viable\n2 critical issues prevent settlement survival.\nCritical Issues (1) ▲\nFood production';
    expect(R.validationOnPageFindings(rec(), { viability }).map((r) => r.detail)).toEqual(['[viability-count] states 2, lists Critical Issues (1)']);
    expect(R.validationOnPageFindings(rec(), { viability: '1 critical issue prevents settlement survival.\nStructural Crises (7) ▲' })[0].detail).toBe('[viability-count] states 1, lists Critical Issues (0)');
  });
  test('negative control: a viable page with no validator line is silent', () => {
    expect(R.validationOnPageFindings(rec(), { overview: 'The place\nThe water was here before the town.', viability: '✓ Viable\nCritical Issues (1) ▲' })).toEqual([]);
    expect(R.validationOnPageFindings(rec(), { viability: '1 critical issue prevents settlement survival.\nCritical Issues (1) ▲' })).toEqual([]);
  });
});

// ── 2. scale-lists
describe('reader:scale-lists', () => {
  const economics = 'Trade Profile ▲\nExports\nNo significant exports.\nImports\nIncense and votive candles Camel herds Fine textiles Luxury goods Spices\nTerrain cannot produce';
  test('(a) a hamlet importing luxury-class goods', () => {
    const rows = R.scaleListsFindings(rec({ tier: 'hamlet' }), { economics });
    expect(rows).toHaveLength(1);
    expect(rows[0].detail).toBe('[luxury-imports] hamlet: camel herds, fine textiles, luxury goods, spices');
  });
  test('(a) negative control: the same list in a city, and a hamlet importing salt', () => {
    expect(R.scaleListsFindings(rec({ tier: 'city' }), { economics })).toEqual([]);
    expect(R.scaleListsFindings(rec({ tier: 'hamlet' }), { economics: 'Imports\nSalt Iron tools' })).toEqual([]);
  });
  test('(b) a resource-trade strength with no house behind it; a house behind it is silent', () => {
    const resources = 'Terrain\nMountains\nEconomic strengths\n✓ Gemcutting ✓ Metalworking ✓ Mining ✓ Stoneworking\nResource Exploitation ▲';
    const rows = R.scaleListsFindings(rec({ institutions: [{ name: 'Blacksmiths (3-10)' }, { name: 'Stone quarry' }] }), { resources });
    expect(rows.map((r) => r.detail)).toEqual(['[strength-no-house] Gemcutting, Mining']);
    expect(R.scaleListsFindings(rec({ institutions: [{ name: 'Mine' }, { name: 'Jeweller' }, { name: 'Blacksmith' }, { name: 'Stone quarry' }] }), { resources })).toEqual([]);
  });
  test('(b) every house pattern names a house the catalogue holds', () => {
    const names = Object.values(institutionalCatalog).flatMap((shelves) => Object.values(shelves).flatMap((rows) => Object.keys(rows)));
    for (const [strength, re] of Object.entries(R.STRENGTH_HOUSES)) expect(names.some((n) => re.test(n)), strength).toBe(true);
  });
  test('(c) the Exports count is a distribution, not a finding', () => {
    expect(R.readerDistributions({ economicState: { primaryExports: ['Raw wool', 'Live sheep'] } })).toEqual({ exports: 2 });
    expect(R.readerDistributions({})).toEqual({ exports: 0 });
  });
});

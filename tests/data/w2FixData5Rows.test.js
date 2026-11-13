/**
 * W2-FIX-DATA-5 (2026-11-13): round three's remaining rows on the data lane's files (ROUND-3-CUT, lane/round-3-cut-2026-11-13
 * at 892904c1d, `ROUND-3-CUT.json`), each reproduced false at ac76a8e40 in the reader's own town, born in the app's shape
 * (REVIEW-R2-STAGES' renderer: DEFAULT_CONFIG, the stress panel with Random off, `_randomizePriorities`), one arm per cause.
 *
 * THIS FILE REDS WHEN a town prints one of those lines again where its record makes it false, or when what prints in its
 * place is not the line true there.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** A ROUND-3 town (REVIEW-R2-STAGES, `rr2s-<size>-<calm|crises>-<rand|route>-<i>`), as its renderer births it. */
const bornRr2s = (/** @type {string} */ seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rr2s-(\w+?)-([a-z_+]+)-([a-z_]+)-(\d+)$/));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};
const servicesOf = (/** @type {any} */ s) => /** @type {any[]} */ (Object.values(s.availableServices || {}).flat());
const named = (/** @type {any} */ s, /** @type {string} */ name) => (s.institutions || []).find((/** @type {any} */ i) => i.name === name);

describe('W2-FIX-DATA-5: round three\'s rows in the data lane\'s files', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 60_000);

  test('#17: a thorp whose people go to a neighbour\'s parish church: its burial ground does not say no clergy is near (rr2s-thorp-calm-rand-1)', () => {
    const town = bornRr2s('rr2s-thorp-calm-rand-1');
    expect(named(town, 'Access to parish church'), 'the thorp holds the access').toBeTruthy();
    const rites = servicesOf(town).filter((v) => v.institution === 'Access to parish church' && v.name === 'Last rites').map((v) => String(v.desc));
    expect(rites, 'the service says the parish priest comes').toEqual(['Funeral rites, said by the parish priest, who comes or is sent for.']);
    const burial = String(named(town, 'Burial ground')?.desc);
    expect(burial).not.toMatch(/No clergy|nobody else to say them/);
    expect(burial).toMatch(/\ba priest\b/i);
  }, 60_000);
});

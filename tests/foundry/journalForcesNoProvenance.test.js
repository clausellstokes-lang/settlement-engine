/**
 * journalForcesNoProvenance.test.js — EXPORTS-B24 · B4 (the chair's ruling on EXPORTS-MEASURE-1 B4, candidate B):
 * THE JOURNAL'S ARMED FORCES BULLETS PRINT NO PROVENANCE KEY.
 *
 * `journalPages.js :: defensePage` printed each force as "name: desc (source)", the source being the generator's
 * provenance key ("(required)", "(generated)", "(coherence_repair)", "(cascade)", "(faction_boost)", "(forced)"): 480
 * of the census's 720 towns (EXPORTS-MEASURE-1 B4, FAST over the dumps). The PDF's force rows print no provenance
 * (`DefenseSecurity.jsx`: "the generator's provenance is not a fact of the town"), nor do the tab's force cards. The
 * journal now prints the force and its description, and no bracket. Births in the app's own shape (the census's 720,
 * SECOND-WAVE-CENSUS/births.mjs): the smallest size (an occupation, r2r-thorp-1), a siege, a famine, the largest size.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages, esc } from '../../src/foundry/journalPages.js';
import { institutionHouseLabel } from '../../src/domain/display/institutionDisplayName.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's 720 (r2r-<size>-N; r2s-<stress>-<size>-N). @param {string} seed */
const birth720 = (seed) => {
  const r = seed.match(/^r2r-(\w+)-\d+$/);
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [s?.[1]], selectedStressesRandom: false, settType: s?.[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** The provenance keys the generator writes on a force (`source`). */
const PROVENANCE = /\\?\((?:required|generated|coherence_repair|cascade|faction_boost|forced)\\?\)\s*$/; // as escaped for markdown too
/** @param {any} town */
const forceBullets = (town) => {
  const md = buildJournalPages(buildViewModel({ settlement: town }), { settlement: town }).find((p) => p.name === 'Defense & Security')?.markdown || '';
  const sec = md.split('## Armed forces')[1] || '';
  return sec.split('\n## ')[0].split('\n').filter((l) => l.startsWith('- '));
};
/** @param {any} town */
const forcesOf = (town) => {
  const af = buildViewModel({ settlement: town }).defense.armedForces || {};
  return ['fortifications', 'standing', 'contracted', 'charter', 'arcane'].flatMap((k) => af[k] || []);
};

describe('the journal\'s Armed forces bullets print no provenance key (EXPORTS-B24 · B4)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test.each(['r2r-thorp-1', 'r2s-under_siege-town-0', 'r2s-famine-city-0', 'r2r-metropolis-0'])('%s: no bullet ends in a provenance key; every force still prints', (seed) => {
    const town = birth720(seed);
    const forces = forcesOf(town);
    expect(forces.some((f) => typeof f === 'object' && f?.source), 'anchored: the record carries a provenance key on a force').toBe(true);
    const bullets = forceBullets(town);
    expect(bullets.filter((l) => PROVENANCE.test(l))).toEqual([]);
    expect(bullets.length, 'the guard: one bullet a force').toBe(forces.length);
    expect(forces.some((f) => typeof f === 'object' && f?.desc), 'anchored: a force with a description').toBe(true);
    // the guard: each bullet is the force's label and its description, as the PDF's force row prints them
    expect(bullets).toEqual(forces.map((f) => `- ${esc(typeof f === 'string' ? institutionHouseLabel(f) : `${institutionHouseLabel(f.name || '')}${f.desc ? `: ${f.desc}` : ''}`)}`));
  }, 180000);
});

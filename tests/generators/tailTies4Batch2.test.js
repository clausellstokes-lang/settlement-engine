/**
 * tests/generators/tailTies4Batch2.test.js — TAIL-TIES-4 batch 2 (the chair's ruling (T19) of 2026-11-15, vetoable by the owner):
 * THE ROLE-BASED TIE LINES, decided (B). A tie of `npcData.js :: STRESS_ECONOMIC_EFFECTS` names its military end by the
 * archetype's category alone, and no leaf in the tree tells that card's office from its house (the defence buckets,
 * `defenseInstitutionBuckets.js :: partitionDefenseInstitutions`, class a Warden's Lodge, Hired blades and a Free company
 * hall in no bucket and a castellan's Citadel as walls), so the lines of mil_crim_corruption, mil_crim_suppression and
 * econ_mil_contract that gave that card arrests, patrols, raids, warrants, a watch, a superior or a hired company are reworded
 * to what any card under arms bears (its people, where they go, whom they leave alone): for the owner's veto. No tie is
 * re-drawn: the archetype, the target and the drawn index stand, so the same tie prints the reworded line.
 * NOT pairs: each printed at 2f2f9f12d (the 720 census) on a card whose house holds no such office (named).
 * INSTEAD: the reworded line prints on the same tie. KEEP: a line of the same archetype, unchanged, still prints.
 *
 * @enforced-by npx vitest run tests/generators/tailTies4Batch2.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The reader's births (`births.mjs :: cfgFor`), verbatim. @param {string} seed @returns {any} */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} });
  const r2s = /^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed); // the census's r2s arm (seedcfg.mjs), verbatim
  if (r2s) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [r2s[1]], selectedStressesRandom: false, settType: r2s[2] }), null, { seed, customContent: {} });
  const m = /** @type {RegExpExecArray} */ (/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};

/** @type {Map<string, any>} */ const births = new Map();
const of = (/** @type {string} */ seed) => { if (!births.has(seed)) births.set(seed, born(seed)); return births.get(seed); };
/** every tie's text in the town @param {string} seed @returns {string[]} */
const ties = (seed) => (of(seed).relationships || []).map((/** @type {any} */ r) => `${r.description || ''} ${r.tension || ''}`);

/** [seed, the old line, the house of the card it named, the reworded line on the same tie] */
const NOT = [
  ['r2r-city-17', 'in exchange for patrol schedules and advance notice of raids', 'Mercenary quarter', "people will be, and when. Both maintain"],
  ['r2r-city-19', "arrest record looks good because", "Veteran's lodge", "crew is working, and"],
  ['r2r-city-24', 'keeps certain doors unwatched in return', 'Citadel', "looks the other way when"],
  ['r2r-city-14', 'are never searched on', 'Hired blades', 'are never troubled by anyone who answers to'],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2r-city-45's and r2r-city-1's ties lit draw other lines; the lowest r2r-city whose tie draws each reworded
  // line is city-20 (20 23 26 59 80 87 of 200) and city-35 (35 39 40 42 64 73 of 200), the house the one its military end holds
  ['r2r-city-20', 'needs a prisoner released', 'Professional city watch', 'needs a blind eye,'],
  ['r2r-city-17', 'commands the patrols and', "Veteran's lodge", "people go, and"],
  ['r2r-city-17', 'awkward questions about how few arrests are made', 'Mercenary quarter', "people never meet any trouble"],
  ['r2r-town-26', 'arrest records against the coin', "Warden's Lodge", 'against what'],
  ['r2r-city-35', 'is fought in raids, informants, and paperwork', 'Professional city watch', 'is fought with informants, threats and favours called in'],
  ['r2r-city-39', "command reports to", 'Garrison', "Someone among"],
  ['r2r-metropolis-12', 'operation street by street', 'Citadel', "operation out street by street"],
  ['r2r-metropolis-12', 'ordered to stand down against', 'Citadel', 'cannot refuse. Nobody has said why.'],
  ['r2s-wartime-town-3', "company after the last caravan was lost", 'Town watch', "people after the last caravan was lost"],
  ['r2s-wartime-town-3', "company under the watch's command", 'Town watch', "people answerable to the council alone"],
  ['r2s-famine-city-1', "colours on the road", 'Garrison', "colours and take"],
  ['r2s-famine-city-1', "company was killed protecting", 'Garrison', "people was killed protecting"],
  ['r2r-city-13', 'company has taken on a second client', 'Garrison', 'has learned who.'],
  ['r2r-city-13', 'company guards', 'Professional city watch', "people guard"],
];
/** [seed, a line of the same archetype, unchanged] */
const KEEP = [
  ['r2r-town-39', 'has made dismantling'], ['r2r-metropolis-12', 'The contract is up for renewal'], ['r2r-city-19', 'silver pays for the favour'],
];

describe('TAIL-TIES-4 batch 2: a tie gives its military end no office its house does not hold (T19, decided (B))', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('NOT: the line that gave the card an office no longer prints; INSTEAD: the same tie prints the reworded line', () => {
    const failures = collectSeedFailures(NOT, ([seed, old, house, now]) => {
      expect(ties(seed).filter((t) => t.includes(old)), `${seed}: ${old} (${house})`).toEqual([]);
      expect(ties(seed).some((t) => t.includes(now)), `${seed}: instead, ${now}`).toBe(true);
    });
    expectNoSeedFailures(failures, 'NOT: every old office line is gone and its tie prints the reworded line');
  });

  it('KEEP: the archetype\'s unchanged lines still print', () => {
    const failures = collectSeedFailures(KEEP, ([seed, line]) => {
      expect(ties(seed).some((t) => t.includes(line)), `${seed}: ${line}`).toBe(true);
    });
    expectNoSeedFailures(failures, "KEEP: every archetype's unchanged line still prints");
  });
});

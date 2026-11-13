/**
 * safetyLinesSayTheRecord.test.js — UPKEEP-8, step 3 (2026-11-13): the safety profile's lines say only what the record
 * holds. The round-three cut's #459 #713 #1201 #1080 #1173 #1377, the increment's #ww-516 and #ww-275, and the
 * measuring seat's census in safetyProfile.js (CENSUS-2: a court named where no courthouse stands; a size word in a
 * small place). THE GUARDS are the readers' own towns, born in the readers' shape: in each, the cured line must not
 * print, and its twin does. THE LAW runs over births of every size and of the crises the lines print under.
 * Red at the lane's base (995293e81).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** The readers' shapes: rr2s-<size>-<crisis|calm>-<rand|port>-<i>, rww-<size>-<crisis|calm>-<i>, rv2-<crisis|calm>-<size>-<i>. */
function cfgFor(seed) {
  let m = /^rv2-([a-z_+]+)-(\w+)-\d+$/.exec(seed);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, settType: m[2], selectedStresses: m[1] === 'calm' ? [] : m[1].split('+'), selectedStressesRandom: false });
  m = /^(rr2s|rww)-(\w+?)-([a-z_+]+?)(?:-(rand|port))?-(\d+)$/.exec(seed);
  return birthConfig({ ...DEFAULT_CONFIG, ...(m[4] === 'port' ? { tradeRouteAccess: 'port' } : {}), settType: m[2],
    selectedStressesRandom: false, selectedStresses: m[3] === 'calm' ? [] : m[3].split('+'), _randomizePriorities: true });
}
const birth = (seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
const linesOf = (s) => { const sp = s.economicState.safetyProfile; return [sp.safetyDesc, sp.guardEffectivenessDesc, sp.economicDragDesc, ...(sp.crimeTypes || []).map((c) => c.desc)].map(String); };
const SMALL = ['thorp', 'hamlet', 'village'];

describe('the readers\' towns: the cured line does not print, its twin does', () => {
  const ROWS = [
    ['rv2-under_siege-town-0', /maintains standard patrol|walks the usual rounds|patrols on a regular round|on the rounds most hours/, /keeps what rounds it can while the supplies it needs are cut off/], // #459
    ['rr2s-city-calm-rand-1', /exists on paper\. Chronically underpaid/, /^Some of the garrison and city watch take bribes from whoever has coin\./], // #713
    ['rr2s-metropolis-calm-rand-1', /exists on paper\. Chronically underpaid/, /^Some of the garrison and city watch take bribes from whoever has coin\./], // #1201
    ['rr2s-city-occupied-rand-1', /largely a formality/, /keep their own mercenary companies beside the/], // #1080
    ['rr2s-metropolis-calm-rand-1', /^Hunger-driven theft/, /^Theft of food, livestock, and stored goods by people with too little/], // #1173
    ['rr2s-metropolis-plague_onset-port-1', /does little harm/, /^Some goods change hands here without a licence or a duty paid\.$/], // #1377
    ['rww-town-under_siege-1', /^Territorial gangs control specific districts/, /^A street gang controls part of the place/], // #ww-516
    ['rww-thorp-under_siege-1', /military command has taken charge/, /^Those holding the place keep order/], // #ww-275
  ];
  test("each reader's town: its twin prints and the cured line does not", () => {
    for (const [seed, cured, twin] of ROWS) {
      const lines = linesOf(birth(seed));
      expect(lines.some((t) => twin.test(t)), lines.join(' | ')).toBe(true);
      expect(lines.some((t) => cured.test(t))).toBe(false); // anchored: the twin was asserted present on the line above
    }
  });
});

describe('the law, over births of every size', () => {
  const seeds = ['thorp', 'hamlet', 'village', 'town', 'city'].flatMap((t) => [0, 1, 2, 3].map((i) => `rv2-calm-${t}-${i}`))
    .concat(['under_siege', 'slave_revolt', 'insurgency', 'politically_fractured'].flatMap((c) => ['thorp', 'village', 'town'].map((t) => `rww-${t}-${c}-1`)));
  test('no court named without a courthouse, no district or military command in a small place, no "little harm" beside organised crime', () => {
    let read = 0;
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const s = birth(seed); const courthouse = defenseFactsOf(s).hasCourthouse;
      for (const t of linesOf(s)) {
        read++;
        if (/\b(?:the|a) court\b|only a court|working court|functioning court/.test(t) && !/without (?:a |a working )?court|with no court/.test(t)) expect(courthouse, `${seed}: ${t}`).toBe(true);
        if (SMALL.includes(s.tier)) expect(/\bdistricts?\b|military command/.test(t), `${seed} ${s.tier}: ${t}`).toBe(false);
        if (/does little harm/.test(t)) expect(factsOf({ institutions: s.institutions }).crime, `${seed}: ${t}`).not.toBe('organized'); // anchored: `read` counts the lines read, asserted below
      }
    }));
    expect(read, 'the lines were read').toBeGreaterThan(seeds.length);
  });
});

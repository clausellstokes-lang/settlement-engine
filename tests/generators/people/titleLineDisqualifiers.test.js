/**
 * titleLineDisqualifiers.test.js — COHERENCE-POWERS-7 (the cold list REVIEW-W2A-3, MEDIUM #478 #488 #489 #534 #719 #1026
 * #1071): A FACE'S TITLE LINE PRESUMES NO WATER AND NO CONTENT ITS TOWN LACKS. The title table's lines (data/people/
 * titleSecretsPresentations.js) promise "no fact but the face's own house and its trade", but a fishmonger, a chandler
 * and a boatwright stand where their trade's water does not: "Talks about the boats, the catch" in a plains city,
 * "knows what every ship and household in the area has been buying" in hill and plains towns, "Has been buying stolen
 * ship's stores" with no port, "taking timber from the river's driftwood" in a coastal village with no river; and the
 * foundling home's "selling some of the foundlings to families who pay" where the content settings forbid trading in
 * people. Each such line declares its disqualifier beside the table (TITLE_LINE_DECLARATIONS: the water home's atoms, a
 * governed content topic); a refused draw takes the title's next admitted line, draw-free (people/poolMap.js ::
 * settleTitleLines, at the face's birth in people/representatives.js).
 *
 * Before the cure, at the lane's base 714381934: 223 such lines in 165 towns of the census's 720 and the reviewer's 20.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { waterOf } from '../../../src/domain/facts/water.js';
import { TITLE_LINE_DECLARATIONS, TITLE_PRESENTATIONS, TITLE_SECRETS } from '../../../src/data/people/titleSecretsPresentations.js';

/** @param {string} seed */
function born(seed) {
  const m = seed.match(/^rw3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-\d+$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}
const FOUNDLINGS = 'Has been selling some of the foundlings to families who pay, without any record';

describe('COHERENCE-POWERS-7 · the title table\'s declarations', () => {
  it('every declared line is a line of the table, and every declared title keeps an undeclared line of each kind', () => {
    const secrets = Object.values(TITLE_SECRETS).flat().map((r) => r.secret);
    const impressions = Object.values(TITLE_PRESENTATIONS).flat().map((r) => r.impression);
    for (const t of Object.keys(TITLE_LINE_DECLARATIONS.secret)) expect(secrets).toContain(t);
    for (const t of Object.keys(TITLE_LINE_DECLARATIONS.presentation)) expect(impressions).toContain(t);
    for (const title of ['the fishmonger', 'the chandler', 'the boatwright', 'the foundling-mother']) {
      expect(TITLE_SECRETS[title].some((r) => !TITLE_LINE_DECLARATIONS.secret[r.secret]), title).toBe(true);
      expect(TITLE_PRESENTATIONS[title].some((r) => !TITLE_LINE_DECLARATIONS.presentation[r.impression]), title).toBe(true);
    }
  });
});

describe('COHERENCE-POWERS-7 · the reviewer\'s towns read no title line their record refuses', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('every reviewer\'s town reads no title line its record refuses', () => {
    expectNoSeedFailures(collectSeedFailures(['rw3-metropolis-calm-1', 'rw3-village-famine-1', 'rw3-city-wartime-1', 'rw3-town-under_siege-1', 'rw3-town-occupied-1'], (seed) => {
    const s = born(seed);
    const water = waterOf(s);
    const refused = [];
    for (const c of s.npcs) {
      for (const [d, text] of [[TITLE_LINE_DECLARATIONS.secret[c.secret?.what], c.secret?.what], [TITLE_LINE_DECLARATIONS.presentation[c.presentation?.impression], c.presentation?.impression]]) {
        if (!d) continue;
        if ((d.needs || []).some((a) => !water[a])) refused.push(`${c.title}: ${text}`);
        if (d.topic && text === FOUNDLINGS && s.config.contentBoundaries?.human_trafficking !== true) refused.push(`${c.title}: ${text}`);
      }
    }
    expect(refused).toEqual([]);
  }), 'every reviewer\'s town reads no title line its record refuses');
  }, 300_000);
});

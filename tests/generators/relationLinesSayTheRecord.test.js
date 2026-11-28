/**
 * relationLinesSayTheRecord.test.js — TAIL-POWERS-B batch 1 (READ-ALL worklist POWERS; the chair's rulings P1 and P3, the
 * brief's agreement law): THE WEB'S RELATION LINES AND THE HALL'S TOLERANCE LINE SAY NO MORE THAN THE RECORD HOLDS.
 * - a power named in a relation line takes its prose form (powerSentenceName: "The Guard", not "Military/Guard") and the
 *   verb its number ("Religious Authorities tell", "Merchant Guilds work");
 * - the guard row at "about as strong" asks for the force's agreement, not "the commander's" (a War Council has none);
 * - the faith's dependent row says the hall holds the seat, not that it "keeps order" (a siege, a famine, an insurgency or
 *   an occupation denies the order), and names whose rule the faith calls ordained;
 * - the faith's tense row says the two do not agree, not that they "keep quarrelling" (a quarrel the record may not hold);
 * - the merchants' competitive row does not say the taxes are bargained under an occupation (the occupier orders the levy);
 * - a Suppressed noble power takes the subordinate row (P1: it neither bargains nor holds a veto);
 * - the guard's tolerance of the thieves says "yet" where the row is escalating (batch 3, P13(2): the hall's truce row is
 *   'stable', so its own line stands);
 * - the hall's equilibrium line (climate alone) claims the tolerance, not that the two "leave each other alone".
 * RED AT THE BASE (40238d3ab): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { computeFactionRelationships, criminalMilitaryRelation } from '../../src/generators/factionDynamics.js';
import { CAPTURE_LINES } from '../../src/data/people/dmPowerLines.js';
import { dmPowerViewOf } from '../../src/domain/people/patronage.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const P = (/** @type {string} */ faction, /** @type {number} */ power, gov = false) => ({ faction, power, isGoverning: gov, category: gov ? 'government' : '' });
const LEG = { isLegitimacyCrisis: false, isContested: false, isEndorsed: false };
const rels = (/** @type {any[]} */ f, stress = /** @type {string[]} */ ([])) => computeFactionRelationships(f, 'city', { economyOutput: 50, safetyRatio: 1 }, LEG, stress, null).map((r) => r.narrative).join(' ');

/** [what, the narratives, must NOT print, prints instead] */
const UNIT = /** @type {Array<[string, () => string, string, string]>} */ ([
  ['the guard row names The Guard', () => rels([P('Elder Council', 40, true), P('Military/Guard', 26)]), 'Military/Guard carries', 'the Guard carries them out'], // NAMES-1 (CN1): the article
  ['about as strong: the force, not a commander', () => rels([P('Elder Council', 30, true), P('Military/Guard', 30)]), "the commander's agreement", "asks for the Guard's agreement"], // NAMES-1 (CN1): the article
  ['the faith: the seat, not order; the verb agrees', () => rels([P('Elder Council', 40, true), P('Religious Authorities', 25)]), 'keeps order and collects', "the Religious Authorities tell people that the Elder Council's rule is right and ordained"], // NAMES-1 (CN1): the article
  ['the faith ahead: no quarrel claimed', () => rels([P('Elder Council', 30, true), P('Religious Authorities', 45)]), 'keep quarrelling', 'the two do not agree on who decides what'],
  ['the merchants under the rules: the verb agrees', () => rels([P('Elder Council', 40, true), P('Merchant Guilds', 10)]), 'Merchant Guilds works', 'The Merchant Guilds work under the rules the Elder Council sets, and pay for a hearing'], // NAMES-1 (CN1): the article
  ['under an occupation no bargained taxes', () => rels([P('Elder Council', 30, true), P('Merchant Guilds', 50)], ['occupied']), 'taxes are bargained over', 'run by the Merchant Guilds more than by the Elder Council.'], // NAMES-1 (CN1): the article
  ['a Suppressed noble power does not bargain', () => rels([P('Elder Council', 12, true), P('Noble Houses', 8)]), 'keep enough rights of their own', 'Noble Houses still have their titles'],
  ['the guard and the thieves when contested', () => criminalMilitaryRelation(P("Thieves' Guild", 20), P('Military/Guard', 25), 'equilibrium', { isContested: true }).narrative, 'Neither pushes the other', 'Neither has yet pushed the other hard enough'],
  ['the hall at equilibrium, the climate alone', () => CAPTURE_LINES.equilibrium[0]({ ruler: 'Guild Council', agents: [], rulerCriminal: false, underworld: "Thieves' Guild" }), 'leave each other alone', "the Guild Council has not set out to stamp the Thieves' Guild out"], // NAMES-1 (CN1): the article
  // KEEP (green before and after): the same rows in the state that bears the old words
  ['KEEP: merchants competitive, no occupation', () => rels([P('Elder Council', 30, true), P('Merchant Guilds', 50)]), 'Merchant Guilds works', 'taxes are bargained over, not ordered'],
  ['KEEP: a Minor noble power bargains', () => rels([P('Elder Council', 30, true), P('Noble Houses', 20)]), 'Noble Houses hold old rights', 'keep enough rights of their own'],
  ['KEEP: the guard and the thieves, not contested', () => criminalMilitaryRelation(P("Thieves' Guild", 20), P('Military/Guard', 25), 'equilibrium', LEG).narrative, 'has yet pushed', 'Neither pushes the other hard enough to start a fight.'],
]);

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
/** [census town, must NOT print, prints instead] (the town the reader read, or a town of the 720 that printed it at the base) */
const BIRTHS = /** @type {Array<[string, string, string]>} */ ([
  ['r2r-hamlet-3', "Headman's Authority gives the orders and Military/Guard carries them out", "The Headman's Authority gives the orders and the Guard carries them out"], // NAMES-1 (CN1): the article
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit; the seat lane's U6 and fortune's figures): r2r-hamlet-5's guard row
  // lit is the dependent row ("each needs the other to stay strong"); the lowest r2r-hamlet whose guard row stands at
  // "about as strong" is hamlet-10 (10 27 115 of 200)
  ['r2r-hamlet-10', "the commander's agreement", 'is now about as strong as'],
  // RE-KEYED BY IDENTITY 2026-11-15 (TAIL-POWERS-B-4, P31 (5), a declared move): under an occupation no taxes are said
  ['r2s-occupied-town-2', 'keeps order and collects the taxes', 'The Guild Council holds the seat; the Religious Authorities tell people'], // NAMES-1 (CN1): the article
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit; the seat lane's U6 and fortune's figures): r2r-metropolis-39's roster
  // lit holds no Noble Houses; the lowest r2r-metropolis whose Suppressed Noble Houses hold a row with
  // the seat is metropolis-2 (2 12 14 32 of 200)
  ['r2r-metropolis-2', 'Noble Houses live under the rule of', 'Noble Houses still have their titles'],
]);
/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const [seed] of BIRTHS) births[seed] = born(seed);
}, 240000);

describe('TAIL-POWERS-B batch 1 · the relation lines say what the record holds', () => {
  for (const [what, line, refused, instead] of UNIT) {
    it(what, () => {
      const text = line();
      expect(text, `prints instead: ${instead}`).toContain(instead);
      expectAbsentWithAnchor(text, refused, instead, what);
    });
  }
  for (const [seed, refused, instead] of BIRTHS) {
    it(`${seed}: not "${refused}"`, () => {
      const s = births[seed];
      const text = [...(s.powerStructure.factionRelationships || []).map((/** @type {any} */ r) => r.narrative), dmPowerViewOf(s)?.hall?.line || ''].join(' ');
      expect(text, `prints instead: ${instead}`).toContain(instead);
      expectAbsentWithAnchor(text, refused, instead, seed);
    });
  }
});

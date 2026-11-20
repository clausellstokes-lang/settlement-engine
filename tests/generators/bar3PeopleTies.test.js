/**
 * bar3PeopleTies.test.js — BAR3-PEOPLE batch 1 (REVIEW-BAR-3 and the wide read, the TIES worklists; the chair's directions
 * P1 and P5 of 2026-11-15, vetoable by the owner), on births:
 *   A VOTE IS CAST ONLY FROM A SEAT (P5: C36622, C27108, C46504): a tie line that gives a card a vote (or the two a vote in
 *   one body) prints only where the roster seats that card (any membership of a power) or seats the two in one power
 *   (`sharedPower.js :: sharesPower`); elsewhere THE LINE TAKES ITS TWIN, the same beat with no vote. A TRADE TAUGHT IS A
 *   TRADE SHARED (C22325): the mentor's "taught them the trade" lines take their twin where the pair shares no trade. THE
 *   CREDITOR MAY HOLD THE SEAT (P1: C31676, C44190): no ruin claimed. THE COUNT AND THE FRIENDSHIP (C13310, C25432): the
 *   tie's one state. UNDER A SIEGE (P1: C4099, C0062, C21976): no carts on the roads, no imports, no coaches leave
 *   (declarations; the 720 hold no siege town that prints them). THE DRAW IS NOT MOVED: the same index for the same pair.
 * RED AT THE BASE (59185b62a): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';
import { TITLE_LINE_DECLARATIONS } from '../../src/data/people/titleSecretsPresentations.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape (r2r-) @param {string} seed */
function born(seed) {
  const m = seed.match(/^r2r-(\w+)-\d+$/);
  if (!m) throw new Error(`no shape for ${seed}`);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
}

/** [town, the line that must not print, what prints in its place] */
const ROWS = /** @type {Array<[string, string, string]>} */ ([
  ['r2r-hamlet-10', 'Antonia Nero has asked Macer Varro for a vote against', "Antonia Nero has asked Macer Varro for a favour against his own interests. It is the first payment Antonia Nero has asked for."], // NAMES-1 (CN2): the second mention a pronoun,
  ['r2r-village-0', 'Mord Bjarnarson and Dag Magnusson sit on opposite sides of most questions and vote together', 'Mord Bjarnarson and Dag Magnusson take opposite sides of most questions and stand together on the few that touch their shared interests.'],
  ['r2r-hamlet-36', 'Ghalia al-Jabbar voted against Ziyad al-Hassan on a small matter', 'Ghalia al-Jabbar spoke against Ziyad al-Hassan on a small matter last week.'],
  ['r2r-hamlet-14', 'Muluc Balam took Chan Chan in as an apprentice and taught them the trade', 'Muluc Balam took Chan Chan under their wing early and taught them the customs, the clients, and the names worth knowing.'],
  ['r2r-hamlet-3', 'Guta Müller has fallen on hard times', "Guta Müller has begun to count the debt Sabine Schröder owes among the boat-master's assets, and has had it written down before witnesses."], // NAMES-1 (CN2): two women, the role,
  ['r2r-thorp-0', 'Cuauhtli Ahau has asked Cosij Chan for a second favour before repaying the first.', 'Cuauhtli Ahau has asked Cosij Chan for a second favour before repaying the first, which would put the camp foreman two favours ahead.'], // NAMES-1 (CN2): two men, the role,
  ['r2r-hamlet-12', 'The friendship is warm and public', 'Tornikes Dalassenos and Glykeria Doukas are allies because each has reckoned what the other would cost as an enemy. The friendship is courteous, and it lasts only while that reckoning holds.'],
]);
/** KEEP: [town, a true line that must still print] */
const KEEP = /** @type {Array<[string, string]>} */ ([
  ['r2r-hamlet-42', "Ai Li has asked Rong Liu for a vote against the head shepherd's own interests."], // the voter is seated; NAMES-1 (CN2): the role
  ['r2r-hamlet-26', 'Anastasia Borisov and Egor Petrov sit on opposite sides of most questions and vote together'], // one power in common
  ['r2r-hamlet-5', 'Panteleimon Akropolites voted against Dionysios Chomatenos on a small matter last week.'], // one power in common
  ['r2r-town-14', 'Hassan al-Basri took Badr ibn Khaldun in as an apprentice and taught them the trade'], // the pair shares a trade
]);

/** @type {Record<string, string>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...ROWS.map((r) => r[0]), ...KEEP.map((r) => r[0])])) {
    const s = born(seed);
    towns[seed] = JSON.stringify({ relationships: s.relationships, rumour: s.prominentRelationship ?? null });
  }
}, 600000);

/** a pool line by its text @param {any} kind @param {'desc'|'tension'} part @param {string} text */
const lineOf = (kind, part, text) => kind[part].lines.find((/** @type {any} */ l) => typeof l === 'object' && String(l.line).includes(text));

describe('BAR3-PEOPLE · a vote from a seat, a trade taught shared, the tie\'s one state (P1, P5)', () => {
  for (const [seed, refused, instead] of ROWS) {
    it(`${seed}: not "${refused.slice(0, 48)}…"; what prints instead`, () => {
      expectAbsentWithAnchor(towns[seed], refused, instead, `${seed}: the refused claim; its twin in the same slot`);
      expect(towns[seed]).toContain(instead);
    });
  }
  for (const [seed, kept] of KEEP) {
    it(`KEEP ${seed}: "${kept.slice(0, 48)}…" still prints`, () => {
      expect(towns[seed]).toContain(kept);
    });
  }
  it('under a siege: the carts, the imports, the seasons and the coaches are refused by declaration (P1)', () => {
    const blur = STRESS_ECONOMIC_EFFECTS.econ_crim_blur;
    for (const [part, text] of /** @type {Array<['desc'|'tension', string]>} */ ([['desc', 'carts moving on roads'], ['desc', 'signs the import papers'], ['tension', 'The seasons keep being profitable']])) {
      expect(lineOf(blur, part, text)?.excludes, text).toContain('crisis: under_siege');
    }
    for (const text of ['Tells a band on the road which coaches carry money and when they leave', 'Changes tired horses for fresh ones and sells the good ones on, giving travellers the worst of the stable']) {
      expect(TITLE_LINE_DECLARATIONS.secret[text]?.excludes, text).toContain('crisis: under_siege');
    }
    // the coaching-inn keeper keeps one secret a siege admits
    expect(TITLE_LINE_DECLARATIONS.secret['Keeps a room for a guest who never signs the book and whose visitors come and go at night']).toBeUndefined();
  });
});

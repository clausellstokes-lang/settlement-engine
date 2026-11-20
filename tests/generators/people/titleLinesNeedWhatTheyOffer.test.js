/**
 * titleLinesNeedWhatTheyOffer.test.js — TAIL-POWERS batch 1 (READ-ALL worklist POWERS; the chair's ruling P2 of 2026-11-14):
 * A TITLE LINE THAT OFFERS A MEAL, BREAD, A ROOM, THE HUNTING, THE GAMES, THE POST OR A TRADE OUT OF TOWN NEEDS WHAT IT OFFERS.
 * The innkeeper's meal and the gossip of the road, the baker's ordinary bread trade, the boat-headman's meal of fish are not
 * dealt under a famine (no line offers the food that failed); the innkeeper's room and road, the boat-headman's boats, the
 * bowyer's and the master of the hunt's best places to hunt, the lanista's invitation to the next games, the postmaster's
 * riders that leave, the master of granaries' grain sold to another market and the mine captain's ore sold to a smelter
 * elsewhere are not dealt under a siege (nothing comes in or goes out by road, gate or water); the games not under a plague
 * either. The master of the hunt's game "sold in the market" needs a market. Each line declares the state that refuses it
 * beside the title table (data/people/titleSecretsPresentations.js :: TITLE_LINE_DECLARATIONS, read by
 * people/poolMap.js :: settleTitleLines); a refused line takes the title's next admitted line, draw-free. The brewer's
 * secret no longer names "the bakers" a village may not have.
 * RED AT THE BASE (bcad1a358): every refused pair below; KEEP pairs (the same line in the state that bears it) green before
 * and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { birthFactsOf } from '../../../src/domain/facts/factsOf.js';
import { TITLE_PRESENTATIONS, TITLE_SECRETS } from '../../../src/data/people/titleSecretsPresentations.js';
import { settleTitleLines } from '../../../src/generators/people/poolMap.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced[2], selectedStresses: [forced[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
const MARKET = [{ name: 'Weekly market', category: 'Economy' }];
const townOf = (/** @type {string[]} */ stressTypes, institutions = MARKET) => ({ facts: birthFactsOf({ institutions, config: { stressTypes }, tier: 'town' }, null), boundaries: { slavery: true, human_trafficking: true }, held: null });
const pres = (/** @type {string} */ title, /** @type {number} */ i) => TITLE_PRESENTATIONS[title][i];
const sec = (/** @type {string} */ title, /** @type {number} */ i) => TITLE_SECRETS[title][i];

/** [title, presentation index drawn, crises, presentation index that must print] */
const PRESENTATIONS = /** @type {Array<[string, number, string[], number]>} */ ([
  // refused (red at the base): the line the crisis makes false -> the title's next admitted line
  ['the innkeeper', 0, ['famine'], 1], ['the innkeeper', 0, ['under_siege'], 1], ['the innkeeper', 2, ['famine'], 1], ['the innkeeper', 2, ['under_siege'], 1],
  ['the master baker', 0, ['famine'], 2], ['the master baker', 1, ['famine'], 2],
  ['the boat-headman', 0, ['famine'], 1], ['the boat-headman', 0, ['under_siege'], 1],
  ['the bowyer', 2, ['under_siege'], 0], ['the master of the hunt', 0, ['under_siege'], 1],
  ['the lanista', 2, ['under_siege'], 0], ['the lanista', 2, ['plague_onset'], 0],
  ['the postmaster', 0, ['under_siege'], 1], ['the postmaster', 2, ['under_siege'], 1],
  // KEEP (green before and after): the same lines where nothing makes them false
  ['the innkeeper', 0, [], 0], ['the innkeeper', 2, ['occupied'], 2], ['the master baker', 0, ['under_siege'], 0], ['the master baker', 1, [], 1],
  ['the boat-headman', 0, ['plague_onset'], 0], ['the bowyer', 2, ['famine'], 2], ['the master of the hunt', 0, [], 0],
  ['the lanista', 2, ['occupied'], 2], ['the postmaster', 0, ['famine'], 0], ['the postmaster', 2, [], 2],
]);
/** [title, secret index drawn, crises, institutions, secret index that must print] */
const SECRETS = /** @type {Array<[string, number, string[], unknown[], number]>} */ ([
  ['the master of granaries', 0, ['under_siege'], MARKET, 1], ['the mine captain', 1, ['under_siege'], MARKET, 2],
  ['the master of the hunt', 0, [], [], 1],
  ['the master of granaries', 0, ['famine'], MARKET, 0], ['the mine captain', 1, [], MARKET, 1], ['the master of the hunt', 0, [], MARKET, 0],
]);

describe('TAIL-POWERS batch 1 · a title line needs what it offers (P2): the declarations, settled draw-free', () => {
  it('a presentation the crisis makes false takes the next admitted line; the same line is kept where nothing refuses it', () => {
    for (const [title, from, crises, to] of PRESENTATIONS) {
      const card = { presentation: { ...pres(title, from) } };
      expect(settleTitleLines(card, title, townOf(crises)).presentation.behaviour, `${title} #${from} under ${crises.join('+') || 'calm'}`).toBe(pres(title, to).behaviour);
    }
  });
  it('a secret the crisis or the missing market makes false takes the next admitted secret; kept where it is true', () => {
    for (const [title, from, crises, houses, to] of SECRETS) {
      const card = { secret: { what: sec(title, from).secret, stakes: sec(title, from).stakes } };
      expect(settleTitleLines(card, title, townOf(crises, houses)).secret.what, `${title} secret #${from} under ${crises.join('+') || 'calm'}`).toBe(sec(title, to).secret);
    }
  });
  it('the brewer\'s grain secret names no bakers a town may not have', () => {
    expectAbsentWithAnchor(TITLE_SECRETS['the brewer'].map((r) => r.secret).join(' '), 'bakers', 'Buys up grain that was meant for bread', "the brewer's secrets");
    expect(TITLE_SECRETS['the brewer'][1].secret).toBe('Buys up grain that was meant for bread in the lean months, at a price no household can match');
  });
});

describe('TAIL-POWERS batch 1 · the towns read: what each prints instead (births)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** seed -> [title, the line that must NOT print (the false one), the line that prints instead] */
  const TOWNS = /** @type {Record<string, [string, string, string]>} */ ({
    "r2s-under_siege-town-0": [
        "the bowyer",
        "Talks about the woods, the game and where the hunting has been best; easy to fall into talk with.",
        "Asks what the bow is for before agreeing to make it, and remembers the answer."
    ],
    "r2s-under_siege-hamlet-0": [
        "the innkeeper",
        "Offers a seat, a meal and the gossip of the road before you have taken your coat off.",
        "Friendly while the coin lasts; asks for payment up front from anyone they have not seen before."
    ],
    "r2r-city-44": [
        "the innkeeper",
        "Gives a room and a meal, and keeps an eye on who you sit with and how long you stay.",
        "Friendly while the coin lasts; asks for payment up front from anyone they have not seen before."
    ],
    "r2s-famine-city-2": [
        "the master baker",
        "Sells what is baked; special orders by the day before, paid on collection.",
        "Polite and brief; does not give credit to anyone they do not know."
    ],
    "r2s-famine-metropolis-0": [
        "the master baker",
        "Talks while serving; knows every household by the bread it buys.",
        "Polite and brief; does not give credit to anyone they do not know."
    ],
    "r2r-thorp-58": [
        "the boat-headman",
        "Talks about the catch, the weather and the boats; quick to offer a meal of fish.",
        "Answers about the fishing; asks why you have come to the landing."
    ],
    "r2r-metropolis-14": [
        "the postmaster",
        "Takes letters at the posted rate; urgent ones cost more and leave sooner.",
        "Polite, but asks for the name and lodgings of anyone collecting a letter."
    ],
    "r2s-under_siege-metropolis-0": [
        "the postmaster",
        "Talks about the roads and the riders' news; knows who has been writing to whom.",
        "Polite, but asks for the name and lodgings of anyone collecting a letter."
    ],
    "r2s-under_siege-city-1": [
        "the master of granaries",
        "Has been selling grain from the stores to merchants in another market and writing it down as spoiled",
        "Lets the rats in one store go untreated, so the losses can be blamed on them"
    ],
    "r2s-under_siege-metropolis-3": [
        "the mine captain",
        "Has kept back from the tally what ore the workings still give, and sold it to a smelter elsewhere",
        "Covered up a cave-in that killed three men by sealing the gallery and reporting them as run off"
    ],
    "r2s-politically_fractured-hamlet-0": [
        "the master of the hunt",
        "Has been hunting on land that belongs to someone else and selling the game in the market",
        "Lost a hunter to a beast last season and said the hunter had gone off alone"
    ],
    "r2r-hamlet-25": [
        "the innkeeper",
        null,
        "Offers a seat, a meal and the gossip of the road before you have taken your coat off."
    ],
    "r2r-town-2": [
        "the master baker",
        null,
        "Talks while serving; knows every household by the bread it buys."
    ],
    "r2r-village-6": [
        "the master of the hunt",
        null,
        "Has been hunting on land that belongs to someone else and selling the game in the market"
    ],
    "r2s-occupied-metropolis-2": [
        "the lanista",
        null,
        "Shows off the training yard and invites you to the next games."
    ],
    "r2s-under_siege-city-2": [
        "the lanista",
        "Shows off the training yard and invites you to the next games.",
        "Answers questions about the school and the games; nothing about the fighters' pasts."
    ]
});
  it('every false town prints its admitted line; every keep town keeps its line', () => {
    expectNoSeedFailures(collectSeedFailures(Object.keys(TOWNS), (seed) => {
      const [title, gone, kept] = TOWNS[seed];
      const lines = born(seed).npcs.filter((c) => c.title === title).flatMap((c) => [c.presentation?.behaviour, c.secret?.what]);
      if (gone) expectAbsentWithAnchor(lines, gone, kept, `${seed}: ${title} no longer deals "${gone}"`);
      expect(lines, `${seed}: ${title} deals "${kept}"`).toContain(kept);
    }), 'every town of the batch prints the line its state admits');
  }, 600_000);
});

/**
 * standingReadsTheNamedPower.test.js — TAIL-POWERS batch 2 (READ-ALL worklist POWERS; the chair's rulings P1 and P4 of
 * 2026-11-14): A POWER'S STANDING IN A SENTENCE READS THE POWER'S OWN STRENGTH, and THE SEAT'S LINE READS THE RECORD'S
 * LEGITIMACY. "Mages ... hold real influence" is not printed of a Minor or Suppressed arcane power; "The craft guilds are
 * close behind, contesting every ... decision" and "Running close behind the merchant guilds in a sustained dispute" not of
 * a Minor or Suppressed craft guild; "a consistent civic presence" not of a Suppressed merchant power; "a persistent civic
 * voice that merchant houses must negotiate with" not of a Minor or Suppressed craft guild, "a reliable secondary presence"
 * not of a Suppressed one; "people follow them out of respect" and "Respected elders guide" not beside a legitimacy crisis.
 * Each prints the line true at its label or in that state (power/claimStanding.js :: settleClaimsToLabel;
 * power/factionStanding.js :: annotateFactionStanding). RED AT THE BASE (bcad1a358) on every cured pair; KEEP pairs green.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { generateSettlementPipeline as bornVoiced } from '../../../src/generators/generateSettlementPipeline.js';
import { todayOf } from './powerLinesToday.js'; // PEOPLE-2 B2: re-keyed by identity, each voiced power line read back to the line it voices
/** @param {Parameters<typeof bornVoiced>} a */ const generateSettlementPipeline = (...a) => todayOf(bornVoiced(...a));
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { settleClaimsToLabel } from '../../../src/generators/power/claimStanding.js';
import { annotateFactionStanding } from '../../../src/generators/power/factionStanding.js';

const REAL_INFLUENCE = 'Mages and arcane practitioners hold real influence through monopoly on magical services and the latent fear their capabilities inspire.';
const ADVISORY = 'Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented.';
const GENUINE = 'Wizard towers and mage guilds hold genuine political weight; their services are structurally irreplaceable and they know it.';
const LOCAL = 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.';
const MARGINS = 'Merchants with local reach; they trade here, but have little say in how the place is run.';
const PERSISTENT = 'Well-organised craft guilds with established trade monopolies; a persistent civic voice that merchant houses must negotiate with, not ignore.';
const SECONDARY = 'Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life.';
const SECONDARY_TWIN = 'The trades regulate their own production and apprenticeships; a reliable secondary presence in civic life.';
const CRAFT_MARGINS = 'The trades regulate their own production and apprenticeships, but carry little weight beyond the workshops.';
const ELDERS = 'The oldest heads of the community decide things together; people follow them out of respect and custom, not law.';
const ELDERS_TWIN = 'The oldest heads of the community still decide things together, but fewer and fewer people accept their word.';
const RESPECTED = 'Respected elders guide the community; authority is moral and traditional rather than formal.';
const RESPECTED_TWIN = 'Elders guide the community by custom, not by formal authority, but fewer and fewer people accept their word.';
const CLOSE = 'The craft guilds are close behind, contesting every pricing and quality-standard decision they try to push through council.';
const OUTPACED = 'The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not.';
const RUNNING = 'Running close behind the merchant guilds in a sustained dispute over who sets the terms for finished goods.';
const OUTVOTED = 'The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal.';

/** [the line born, its label, the legitimacy crisis?, governing?, the line that must print] */
const CLAIMS = /** @type {Array<[string, string, boolean, boolean, string]>} */ ([
  // cured (red at the base)
  [REAL_INFLUENCE, 'Minor', false, false, ADVISORY], [REAL_INFLUENCE, 'Suppressed', false, false, ADVISORY], [GENUINE, 'Minor', false, false, ADVISORY],
  [LOCAL, 'Suppressed', false, false, MARGINS], [PERSISTENT, 'Minor', false, false, SECONDARY_TWIN], [PERSISTENT, 'Suppressed', false, false, CRAFT_MARGINS],
  [SECONDARY, 'Suppressed', false, false, CRAFT_MARGINS], [ELDERS, 'Dominant', true, true, ELDERS_TWIN], [RESPECTED, 'Strong', true, true, RESPECTED_TWIN],
  // KEEP (green before and after)
  [REAL_INFLUENCE, 'Significant', false, false, REAL_INFLUENCE], [LOCAL, 'Minor', false, false, LOCAL], [PERSISTENT, 'Significant', false, false, PERSISTENT],
  [SECONDARY, 'Minor', false, false, SECONDARY], [ELDERS, 'Dominant', false, true, ELDERS], [RESPECTED, 'Strong', false, true, RESPECTED],
  [GENUINE, 'Suppressed', false, false, ADVISORY],
]);

describe('TAIL-POWERS batch 2 · a standing sentence reads the strength of the power it names (P1) and the seat its legitimacy (P4)', () => {
  it('the claim table: each line at its label and in its state', () => {
    for (const [desc, label, crisis, governing, want] of CLAIMS) {
      const roster = [{ faction: governing ? 'Elder Council' : 'Some Power', desc, powerLabel: label, power: 20, isGoverning: governing }];
      settleClaimsToLabel(roster, 'city', [], { isLegitimacyCrisis: crisis });
      expect(roster[0].desc, `${desc.slice(0, 40)} at ${label}${crisis ? ' under a legitimacy crisis' : ''}`).toBe(want);
    }
  });
  it('the merchant and craft standing: "close behind" and "running close behind" only of a craft guild above Minor', () => {
    /** [merchant power, craft power, the merchant card's craft note, the craft card's merchant note] */
    const ROWS = /** @type {Array<[number, number, string, string]>} */ ([
      [16, 10, OUTPACED, OUTVOTED], [17, 12, OUTPACED, OUTVOTED], // cured: the craft guild Minor or Suppressed
      [26, 20, CLOSE, RUNNING], [24, 18, CLOSE, RUNNING], // KEEP: a Significant craft guild close behind
      [30, 12, OUTPACED, OUTVOTED], // KEEP: outpaced and outvoted as before
    ]);
    for (const [m, c, onMerchant, onCraft] of ROWS) {
      const roster = [{ faction: 'Ruling Council', power: 100 - m - c, isGoverning: true, desc: '' }, { faction: 'Merchant Guilds', power: m, desc: '' }, { faction: 'Craft Guilds', power: c, desc: '' }]
        .sort((a, b) => b.power - a.power);
      annotateFactionStanding(roster);
      expect(roster.find((f) => f.faction === 'Merchant Guilds').desc, `merchants ${m} / craft ${c}`).toContain(onMerchant);
      expect(roster.find((f) => f.faction === 'Craft Guilds').desc, `craft ${c} / merchants ${m}`).toContain(onCraft);
    }
  });
});

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced[2], selectedStresses: [forced[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

describe('TAIL-POWERS batch 2 · the towns read: what each prints instead (births)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** seed -> [the line that must NOT print on any power card, the line that prints instead] */
  const TOWNS = /** @type {Record<string, [string | null, string]>} */ ({
    "r2r-city-11": [
        "Mages and arcane practitioners hold real influence through monopoly on magical services and the latent fear their capabilities inspire.",
        "Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented."
    ],
    "r2r-city-15": [
        "Mages and arcane practitioners hold real influence through monopoly on magical services and the latent fear their capabilities inspire.",
        "Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented."
    ],
    "r2r-city-1": [
        "The craft guilds are close behind, contesting every pricing and quality-standard decision they try to push through council.",
        "The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not."
    ],
    "r2r-city-12": [
        "The craft guilds are close behind, contesting every pricing and quality-standard decision they try to push through council.",
        "The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not."
    ],
    "r2r-city-16": [
        "Running close behind the merchant guilds in a sustained dispute over who sets the terms for finished goods.",
        "The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal."
    ],
    "r2r-city-21": [
        "Running close behind the merchant guilds in a sustained dispute over who sets the terms for finished goods.",
        "The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal."
    ],
    "r2r-city-36": [
        "Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.",
        "Merchants with local reach; they trade here, but have little say in how the place is run."
    ],
    "r2r-city-38": [
        "Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.",
        "Merchants with local reach; they trade here, but have little say in how the place is run."
    ],
    "r2r-city-30": [
        "Well-organised craft guilds with established trade monopolies; a persistent civic voice that merchant houses must negotiate with, not ignore.",
        "The trades regulate their own production and apprenticeships; a reliable secondary presence in civic life."
    ],
    "r2r-city-32": [
        "Well-organised craft guilds with established trade monopolies; a persistent civic voice that merchant houses must negotiate with, not ignore.",
        "The trades regulate their own production and apprenticeships; a reliable secondary presence in civic life."
    ],
    "r2r-city-10": [
        "Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life.",
        "The trades regulate their own production and apprenticeships, but carry little weight beyond the workshops."
    ],
    "r2r-city-22": [
        "Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life.",
        "The trades regulate their own production and apprenticeships, but carry little weight beyond the workshops."
    ],
    "r2r-hamlet-16": [
        "The oldest heads of the community decide things together; people follow them out of respect and custom, not law.",
        "The oldest heads of the community still decide things together, but fewer and fewer people accept their word."
    ],
    "r2r-hamlet-17": [
        "The oldest heads of the community decide things together; people follow them out of respect and custom, not law.",
        "The oldest heads of the community still decide things together, but fewer and fewer people accept their word."
    ],
    "r2r-thorp-19": [
        "Respected elders guide the community; authority is moral and traditional rather than formal.",
        "Elders guide the community by custom, not by formal authority, but fewer and fewer people accept their word."
    ],
    "r2r-thorp-25": [
        "Respected elders guide the community; authority is moral and traditional rather than formal.",
        "Elders guide the community by custom, not by formal authority, but fewer and fewer people accept their word."
    ],
    "r2r-hamlet-25": [
        null,
        "The oldest heads of the community decide things together; people follow them out of respect and custom, not law."
    ],
    "r2r-city-0": [
        null,
        "Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice."
    ],
    "r2r-city-31": [
        null,
        "Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life."
    ]
});
  it('every false town prints its true line; every keep town keeps its line', () => {
    expectNoSeedFailures(collectSeedFailures(Object.keys(TOWNS), (seed) => {
      const [gone, kept] = TOWNS[seed];
      const text = born(seed).powerStructure.factions.map((f) => f.desc).join(' ');
      if (gone) expectAbsentWithAnchor(text, gone, kept, `${seed}: "${gone.slice(0, 50)}" no longer prints`);
      expect(text, `${seed}: "${kept.slice(0, 50)}" prints`).toContain(kept);
    }), 'every town of the batch prints the line its state admits');
  }, 600_000);
});

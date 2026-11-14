/**
 * claimRungsCommanding.test.js — POWERS-12 (REVIEW-POWERS-3 M1): THE FIVE COMMANDING CLAIMS THE CLAIM TABLE DID NOT
 * COVER TAKE THEIR LADDER'S RUNG BESIDE A MINOR OR SUPPRESSED LABEL.
 * power/claimStanding.js :: settleClaimsToLabel replaced a commanding claim its final label denies with its ladder's
 * rung; five claims the ladder prints were not in its table and still printed beside Minor or Suppressed (122 towns of
 * the census's 720 at ec72918d4 and at b889007c8: the Major church 40, the ruling class and the merchant class "the
 * same people" 26, great families "structurally embedded in governance" 22, militarised nobles 18, the standing army
 * 16). Each now takes the rung its ladder prints for a power of that weight:
 *  - the Major church (city and metropolis, both variants): "Clergy are present but operate at the margins ...";
 *  - "the same people" (printed only where a merchant power governs): the merchants' rung;
 *  - the great families and the militarised nobles: the ladder's lowest rung at both labels (the noble Minor rung reads
 *    the roster before the density law's fold, which can drop the merchant power it would name);
 *  - the standing army: the city watch's rungs, ONLY where the roster holds a watch (the rung names one); with none,
 *    no rung is true and the claim is left as it is.
 * No draw: the rungs are fixed lines chosen by the roster. Every expected word is a literal.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { settleClaimsToLabel } from '../../../src/generators/power/claimStanding.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const CHURCH_HOSPITAL = 'Major church institutions hold structural influence. Land grants, hospital networks, and moral authority give them leverage across multiple civic domains.';
const CHURCH_CHARITY = 'Major church institutions hold structural influence. Land grants, charity, and moral authority give them leverage across multiple civic domains.';
const MARGINS = 'Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.';
const SAME_PEOPLE = 'The ruling class and the merchant class are the same people; commercial decisions are political decisions and civic access is purchased.';
const LOCAL = 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.';
const GREAT = 'Hereditary great families with land grants, court appointments, and dynastic marriage networks; structurally embedded in governance even when not formally in power.';
const MILITARISED = "Militarised noble families whose landholdings double as fortified estates; they provide the settlement's heavy cavalry and expect political weight in return.";
const LESSER = 'Minor landed families with limited political reach; present in civic life but rarely decisive.';
const ARMY = 'Standing army with genuine political weight; command appointments are patronage, and the council knows it.';
const WELL_FUNDED = 'Well-funded city watch; it keeps order reliably and is growing more sure of its own authority.';
const CITY_WATCH = 'City watch; law enforcement and external defence, stretched between multiple responsibilities.';
const CODA = ' Operationally distinct from the command council: these are the soldiers and watchmen, not the officers who govern.';

/** @param {string} seat @param {Array<[string, number, string, string?]>} rows name, power, label, desc */
function roster(seat, rows) {
  return [{ faction: seat, power: 40, powerLabel: 'Strong', isGoverning: true, desc: 'x' },
    ...rows.map(([faction, power, powerLabel, desc]) => ({ faction, power, powerLabel, desc: desc || 'x' }))];
}
const descOf = (/** @type {any[]} */ f, /** @type {string} */ name) => f.find((x) => x.faction === name).desc;

describe('POWERS-12 · the five commanding claims take their rung beside Minor or Suppressed (M1)', () => {
  it('the Major church, both variants, reads the margins rung at Minor and at Suppressed', () => {
    for (const [desc, label] of [[CHURCH_HOSPITAL, 'Minor'], [CHURCH_CHARITY, 'Minor'], [CHURCH_HOSPITAL, 'Suppressed'], [CHURCH_CHARITY, 'Suppressed']]) {
      for (const tier of ['city', 'metropolis']) {
        const f = roster('Town Council', [['Religious Authorities', 18, label, desc]]);
        settleClaimsToLabel(f, tier);
        expect(descOf(f, 'Religious Authorities'), `${tier} ${label}`).toBe(MARGINS);
      }
    }
  });
  it('"the same people" (a merchant power governs) reads the merchants\' rung', () => {
    for (const label of ['Minor', 'Suppressed']) {
      const f = roster('Merchant oligarchy', [['Merchant Guilds', 14, label, SAME_PEOPLE]]);
      settleClaimsToLabel(f, 'city');
      expect(descOf(f, 'Merchant Guilds'), label).toBe(LOCAL);
    }
  });
  it('the great families and the militarised nobles read the lowest rung at Minor and at Suppressed, whatever the roster', () => {
    for (const [desc, tier] of [[GREAT, 'metropolis'], [MILITARISED, 'town'], [MILITARISED, 'city']]) {
      for (const label of ['Minor', 'Suppressed']) {
        // a merchant power beside them (the fold may drop it after the call): the rung names no merchant capital
        const f = roster('Royal Authority', [['Noble Families', 12, label, desc], ['Merchant Guilds', 20, 'Suppressed']]);
        settleClaimsToLabel(f, tier);
        expect(descOf(f, 'Noble Families'), `${tier} ${label}`).toBe(LESSER); // the exact rung: it names no merchant capital
      }
    }
  });
  it('the standing army reads the city watch\'s rungs only where the roster holds a watch; its coda is kept', () => {
    const watched = ['professional city watch', 'market square'];
    const minor = roster('Military Council', [['Military/Guard', 12, 'Minor', ARMY + CODA]]);
    settleClaimsToLabel(minor, 'city', watched);
    expect(descOf(minor, 'Military/Guard')).toBe(WELL_FUNDED + CODA);
    const supp = roster('Town Council', [['Military/Guard', 6, 'Suppressed', ARMY]]);
    settleClaimsToLabel(supp, 'metropolis', ['city watch']);
    expect(descOf(supp, 'Military/Guard')).toBe(CITY_WATCH);
    // no watch stands: no rung is true, the claim is left (a watchtower is no watch)
    const none = roster('Town Council', [['Military/Guard', 12, 'Minor', ARMY]]);
    settleClaimsToLabel(none, 'city', ['garrison', 'watchtower']);
    expect(descOf(none, 'Military/Guard')).toBe(ARMY);
  });
});

describe('POWERS-12 · the guard towns (the census\'s 720 shape)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  /** @param {string} tier @param {string} seed @param {string} [stress] */
  const born = (tier, seed, stress) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: tier,
    ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
  const CLAIMS = ['Major church institutions hold structural influence.', SAME_PEOPLE, GREAT, MILITARISED, ARMY];
  /** @type {Array<[string, string, string | undefined, string, string]>} seed, tier, stress, power, the rung it reads */
  const TOWNS = [
    ['r2s-under_siege-city-2', 'city', 'under_siege', 'Religious Authorities', MARGINS],
    ['r2s-famine-town-1', 'town', 'famine', 'Merchant Guilds', LOCAL],
    ['r2s-under_siege-metropolis-0', 'metropolis', 'under_siege', 'Noble Houses', LESSER],
    ['r2s-indebted-town-0', 'town', 'indebted', 'Landed Gentry', LESSER],
    ['r2r-metropolis-36', 'metropolis', undefined, 'Military/Guard', WELL_FUNDED],
  ];
  it('one town of each claim\'s cells reads its rung where the claim printed, and no power of the five prints a claim beside Minor or Suppressed', () => {
    expectNoSeedFailures(collectSeedFailures(TOWNS, ([seed, tier, stress, power, rung]) => {
      const factions = born(tier, seed, stress).powerStructure.factions;
      expect(String(factions.find((f) => f.faction === power)?.desc).startsWith(rung), `${seed} ${power}`).toBe(true);
      const claimed = factions.filter((f) => (f.powerLabel === 'Minor' || f.powerLabel === 'Suppressed')
        && CLAIMS.some((claim) => String(f.desc).startsWith(claim))).map((f) => f.faction);
      expect(claimed, `${seed}: a claim beside Minor or Suppressed`).toEqual([]);
    }), 'the five guard towns');
  }, 240_000);
});

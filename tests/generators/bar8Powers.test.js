// THE GUARD OF BAR8-K-POWERS (BRIEF-BAR8, the seat's section, 2026-11-17): A POWER'S OWN WORDS ARE TRUE OF THAT POWER AND
// OF THE PLACE. The four rules of BAR8-AUDIT-K's hand-back (`docs/chair/2026-11-17/bar8/AUDIT/BAR8-AUDIT-K-HANDBACK.md`), each
// held here over fixed seeds (the towns its instances printed in at the base: the seventh read's control first, then the
// census's), with a negative beside each positive:
//   13g  where the guild has bought the seat (the record's relation rows say "corrupted"), no power's card calls the tie to
//        the guild a war of arrests (C21547); where the tie is a contest (adversarial), the card still says so;
//   14a  a rival minted on a doubled niche does not print its host's one-body description (C14226); a description general
//        to its kind ("Clergy are present but operate at the margins") is still the rival's as the host's;
//   14d  the Elected Reeve's line names a noble only where one stands (C44634); with a noble house, it still does;
//   15b  the stock grazing quarrel is not the quarrel of a place with no grazing (C31732); a place with a foraging or a
//        hunting ground (C30951, C31349) and a hamlet with common grazing (C16138) keep it.
// THE DETECTORS are the auditor's own patterns (`tests/helpers/pageLaws/law13K.mjs`, `law14K.mjs`, `law15K.mjs`) read on the
// record; none reads the table the cure changed. The counts before and after over the thirty, the 150 and the 720 are in
// docs/chair/2026-11-17/bar8/BAR8-K-POWERS-HANDBACK.md.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generatePowerStructure } from '../../src/generators/power/rulingStructure.js';

/** The towns the base printed each rule in, and the negatives beside them. */
const TOWNS = Object.freeze({
  'bar0-metropolis-calm-rand-45': ['13g'], // C21547: Shadow Senate, the guild has bought key people
  'r2r-city-14': ['13g'], // Corrupt City Council
  'r2s-wartime-city-2': ['13g'],
  // 13G (the ninth chair's N97, 2026-11-23, CLOSE-6): r2r-city-5, the old negative, born lit: its relation rows read bought
  // (a rank-1 agent of the hall, `hallCapture.js :: hallCaptureOf`'s agent rung) while the governing power is no criminal
  'r2r-city-5': ['13g'],
  // NEGATIVE: the hall hunts the guild (adversarial): the war of arrests is the tie. RE-PICKED BY THE PREMISE (the flip,
  // 2026-11-23, CLOSE-5 F-SEAT): r2r-city-5's tie reads bought lit; r2r-city-16 is the lowest r2r-city of 200 lit whose
  // relation rows hold an adversarial capture and none bought (the premise's own predicate, never the war's words)
  'r2r-city-16': ['13g-'],
  'bar0-city-wartime-rand-47': ['14a'], // C14226: the War Council's "Crown-appointed emergency body"
  'bar0-city-under_siege+famine-rand-46': ['14a'], // the siege's "Emergency committee"
  'r2s-famine-metropolis-2': ['14a'], // "Organised criminal network controls the black market"
  'r2s-occupied-city-0': ['14a'], // "External administrative body"
  'bar0-city-under_siege+famine-rand-45': ['14a'], // "City watch; ..." on a second military power (WEAK)
  'bar0-city-wartime-rand-46': ['14a-'], // NEGATIVE: "Clergy are present ..." is the rival's as the host's
  'bar0-village-famine-rand-46': ['14d'], // C44634
  'bar0-village-calm-rand-46': ['14d'],
  'r2r-village-45': ['14d'], // the noble power seated at the draw is not kept by the roster's trim
  'bar0-thorp-calm-rand-47': ['15b'], // C31732: harbour, ship timber, ruins
  'r2r-thorp-3': ['15b'], // marshlands, hot springs, a quarry
  'r2r-thorp-53': ['15b'], // fishing grounds, salt flats
  'bar0-thorp-calm-rand-45': ['15b-'], // NEGATIVE C30951: a foraging or a hunting ground
  'bar0-thorp-calm-rand-46': ['15b-'], // NEGATIVE C31349
  'bar0-hamlet-calm-rand-45': ['15b-'], // NEGATIVE C16138: common grazing
});

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** PAGE-COPY seedcfg.mjs's arms (the census's r2r-/r2s- and the bar's bar0-), verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (m) {
    const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    return { ...dials, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true };
  }
  throw new Error(`a guard seed is a census or a read seed: ${seed}`);
}

// the auditor's patterns (law13K.mjs 13g, law14K.mjs 14a and 14d, law15K.mjs 15b)
const WAR_OF_ARRESTS = /\bA slow war with the guild\b|\bthe guild can make every investigation costly\b|\bcan arrest their people\b|\benough to keep it down but not to stamp it out\b/i;
const ONE_BODY = /\b(body|committee|council|appointed|chartered|elected|watch|whoever controls|reserves|authority over)\b/i;
const NOBLE_OVERSIGHT = /\bunder noble oversight\b/i;
const GRAZING_QUARREL = /\bdispute over grazing rights\b|\bgrazing rights and water\b/i;

/** @param {any} town @returns {any[]} */
const powersOf = (town) => (Array.isArray(town?.powerStructure?.factions) ? town.powerStructure.factions : []);
/** @param {any} town @returns {boolean} the record's relation rows say the guild has bought the seat or the force */
const tieBought = (town) => (town?.powerStructure?.factionRelationships || []).some((/** @type {any} */ r) => r?.captureState !== undefined && r?.type === 'corrupted');
/** 14a on the record: a minted rival whose description is its host's, word for word, where that names one body. @param {any} town */
const copiedOneBody = (town) => {
  const fs = powersOf(town);
  return fs.filter((f) => f.contestsNiche).map((rival) => ({ rival, host: fs.find((h) => h !== rival && (h.faction === rival.contestsNiche || h.name === rival.contestsNiche)) }))
    .filter(({ rival, host }) => host && String(host.desc || '').trim() && String(rival.desc).trim() === String(host.desc).trim());
};

/** @type {Map<string, any>} */
const BORN = new Map();
beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of Object.keys(TOWNS)) BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
}, 600000);

/** @param {string} rule @returns {Array<[string, any]>} */
const townsOf = (rule) => [...BORN].filter(([seed]) => TOWNS[/** @type {keyof typeof TOWNS} */ (seed)].includes(rule));

describe('BAR8-K-POWERS: a power\'s own words are true of that power and of the place', () => {
  it('13g: where the guild has bought the seat, no card calls the tie a war of arrests', () => {
    const towns = townsOf('13g');
    const failures = collectSeedFailures(towns.map(([seed, town]) => ({ seed, town })), ({ seed, town }) => {
      expect(tieBought(town), `${seed}: the record still says the guild has bought the seat (the control is live)`).toBe(true);
      expect(powersOf(town).filter((f) => WAR_OF_ARRESTS.test(String(f.desc || ''))).map((f) => `${seed}: ${f.faction}: ${f.desc}`)).toEqual([]);
    });
    expectNoSeedFailures(failures, 'no war of arrests beside a bought seat');
    // NEGATIVE beside it: a hall that hunts the guild keeps the contest of arrests on its cards
    const [[seed, hunted]] = townsOf('13g-');
    expect(tieBought(hunted), `${seed}: an adversarial tie`).toBe(false);
    expect(powersOf(hunted).some((f) => WAR_OF_ARRESTS.test(String(f.desc || ''))), `${seed}: the contest of arrests still prints where it is the tie`).toBe(true);
  });

  // 13G (the ninth chair's N97, 2026-11-23, CLOSE-6; the measure `close-6/reports/LIT-13G.md`): THE CARD'S GATE READS WHAT
  // THE TIE READS, over the census's 900 births (`dp-<size>-<i>`, 150 a size, the product's `birthConfig`): rule (A), every
  // birth whose own relation rows read bought (`tieBought`) has no card matching WAR_OF_ARRESTS. Born LIT (the product's
  // birth) and the same arm DARK (both laws forced to 1 in its own config, COMMON-RULES 14 (c)), offenders listed by seed.
  // THE TOOTH: a real birth's adversarial tie turned bought beside its war card, re-annotated through the real function
  // (`annotateFactionStanding`, the power step's write, which reads no row), is caught by the same checker.
  /** @param {string} seed @param {any} town @returns {string[]} rule (A)'s offenders on one birth */
  const warBesideBought = (seed, town) => (tieBought(town) ? powersOf(town).filter((f) => WAR_OF_ARRESTS.test(String(f.desc || ''))).map((f) => `${seed}: ${f.faction}: ${(String(f.desc).match(WAR_OF_ARRESTS) || [''])[0]}`) : []);
  it('13g (the 900): where the record\'s own relation row reads bought, no card prints a war of arrests, lit and dark', async () => {
    const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { annotateFactionStanding } = await import('../../src/generators/power/factionStanding.js');
    const { tieReadsBought } = await import('../../src/generators/factionDynamics.js'); // the cure's one reading, held against the judge's own `tieBought`
    // THE TOOTH first (the checker is live): r2r-city-16's adversarial tie, its capture row's type set to bought
    const [[toothSeed, hunted]] = townsOf('13g-');
    const planted = structuredClone(hunted);
    const row = planted.powerStructure.factionRelationships.find((/** @type {any} */ r) => r?.captureState !== undefined);
    expect(row, `${toothSeed}: premise: a capture row to plant`).toBeTruthy();
    row.type = 'corrupted';
    for (const f of planted.powerStructure.factions) f.desc = '';
    annotateFactionStanding(planted.powerStructure.factions);
    expect(warBesideBought(toothSeed, planted).length, `${toothSeed}: the planted bought row beside a war card is caught`).toBeGreaterThan(0);
    /** @type {{ lit: string[], dark: string[], disagree: string[] }} */
    const offenders = { lit: [], dark: [], disagree: [] };
    /** @param {string} seed @param {any} town @returns {string[]} the judge (`tieBought`, the test's own) and the cure's predicate disagree */
    const disagree = (seed, town) => (tieBought(town) === tieReadsBought(town?.powerStructure?.factionRelationships) ? [] : [`${seed}: tieBought ${tieBought(town)}`]);
    const LAW_1 = { _seatLawVersion: 1, _fortuneLawVersion: 1 }; // DARK: both laws forced to 1 on the config birthConfig returns (it clamps an incoming marker off)
    for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let i = 0; i < 150; i++) {
        const seed = `dp-${settType}-${i}`;
        const lit = generateSettlementPipeline(boundary.birthConfig({ settType }), null, { seed, customContent: {} });
        const dark = generateSettlementPipeline({ ...boundary.birthConfig({ settType }), ...LAW_1 }, null, { seed, customContent: {} });
        offenders.lit.push(...warBesideBought(seed, lit));
        offenders.dark.push(...warBesideBought(seed, dark));
        offenders.disagree.push(...disagree(`${seed} lit`, lit), ...disagree(`${seed} dark`, dark));
      }
    }
    expect(offenders, 'no war of arrests beside a bought tie on any of the 900, lit or dark; the judge and the cure\'s reading agree on every birth').toEqual({ lit: [], dark: [], disagree: [] });
  }, 510_000); // its own budget, carrying the measured figure (13G, CLOSE-6, 2026-11-23): 276.1 s lit alone at 8f882d0f0 (both corpora, 1,800 births); about 508.0 s on a CI runner (x 1.84, the measured factor), rounded up

  it('14a: a minted rival does not print its host\'s one-body description', () => {
    const towns = townsOf('14a');
    const failures = collectSeedFailures(towns.map(([seed, town]) => ({ seed, town })), ({ seed, town }) => {
      expect(powersOf(town).some((f) => f.contestsNiche), `${seed}: a rival is still minted on a doubled niche (the control is live)`).toBe(true);
      expect(copiedOneBody(town).filter(({ host }) => ONE_BODY.test(String(host.desc))).map(({ rival, host }) => `${seed}: ${rival.faction} prints ${host.faction}'s "${host.desc}"`)).toEqual([]);
    });
    expectNoSeedFailures(failures, 'no one-body description on a second body');
    // NEGATIVE beside it: a description general to its kind is still the rival's as the host's
    const [[seed, clergy]] = townsOf('14a-');
    expect(copiedOneBody(clergy).map(({ host }) => String(host.desc)).filter((d) => /^Clergy are present but operate at the margins/.test(d)).length, `${seed}: the general line is still shared`).toBe(1);
  });

  // BAR8-K-WATCH-2 (the chair's BR30 (2), vetoable wording): the occupation's twin said "a second body sent in from outside",
  // which the record does not hold (the rival is the density law's second claimant on the niche); it reads as its siblings do
  it('14a (BR30): the occupation\'s rival is a rival bloc, not a second body sent in from outside', () => {
    const [[seed, town]] = townsOf('14a').filter(([s]) => s === 'r2s-occupied-city-0');
    const host = powersOf(town).find((f) => /^External administrative body; all significant decisions require approval or reversal\./.test(String(f.desc || '')));
    expect(host, `${seed}: premise: the occupation's administrative body holds a niche`).toBeTruthy();
    const rival = powersOf(town).find((f) => f.contestsNiche && f.contestsNiche === host.faction);
    expect(rival?.faction, `${seed}: premise: the density law mints its rival`).toBe('The Shield Compact');
    expect(String(rival.desc)).toBe("A rival bloc that wants a say over the decisions made here, and disputes the outside administration's hold on them.");
    expectAbsentWithAnchor(powersOf(town).map((f) => String(f.desc || '')).join('\n'), 'A second body sent in from outside', 'A rival bloc that wants a say over the decisions made here', `${seed}: the old twin is gone from every card`);
  });

  it('14d: the Elected Reeve answers to a noble only where one stands', () => {
    const towns = townsOf('14d');
    const failures = collectSeedFailures(towns.map(([seed, town]) => ({ seed, town })), ({ seed, town }) => {
      const reeve = powersOf(town).find((f) => f.isGoverning && f.faction === 'Elected Reeve');
      expect(reeve, `${seed}: the Elected Reeve still governs (the control is live)`).toBeTruthy();
      const noble = powersOf(town).some((f) => f.category === 'noble') || (town.institutions || []).some((/** @type {any} */ i) => /\b(manor|noble|lord|castle|keep|estate)\b/i.test(String(i?.name || '')));
      expect(noble, `${seed}: no noble on the record`).toBe(false);
      expect(NOBLE_OVERSIGHT.test(String(reeve?.desc || '')) ? `${seed}: ${reeve.desc}` : null).toBe(null);
      expect(String(reeve?.desc || ''), `${seed}: the reeve's line is still the reeve's`).toMatch(/\belected\b.* manages labour and mediates disputes/);
    });
    expectNoSeedFailures(failures, 'no noble oversight where no noble stands');
    // NEGATIVE beside it (a constructed record, N7): a village whose roster holds a lord's manor keeps the noble's oversight
    const config = { settType: 'village', priorities: { military: 30, economy: 30, religion: 30, criminal: 10, magic: 10 } };
    const houses = [{ name: 'Village reeve', category: 'Government' }, { name: 'Parish church', category: 'Religious' }];
    const withLord = generatePowerStructure('village', {}, null, config, [...houses, { name: "Lord's manor", category: 'Government' }], {});
    expect(String(withLord.factions.find((/** @type {any} */ f) => f.faction === 'Elected Reeve')?.desc)).toMatch(NOBLE_OVERSIGHT);
    const free = generatePowerStructure('village', {}, null, config, houses, {});
    expectAbsentWithAnchor(String(free.factions.find((/** @type {any} */ f) => f.faction === 'Elected Reeve')?.desc), 'under noble oversight', 'manages labour and mediates disputes', 'the free village\'s reeve: no noble, the reeve\'s own line');
  });

  it('15b: no grazing quarrel where nothing grazes; the places that graze keep it', () => {
    const towns = townsOf('15b');
    const failures = collectSeedFailures(towns.map(([seed, town]) => ({ seed, town })), ({ seed, town }) => {
      const grounds = (town.config?.nearbyResources || []).map(String);
      expect(grounds.some((g) => /forag|hunt|grass|pasture|meadow|plain|steppe|farm|fertile|grain|orchard|mill|herb|grove|forest|wood(?!.*ship)/i.test(g)), `${seed}: no ground of the land (the control is live)`).toBe(false);
      expect(town.economicState?.foodSecurity?.chains?.['Pastoral & livestock'] === true, `${seed}: no pastoral chain`).toBe(false);
      const quarrel = String(town.powerStructure?.recentConflict || '');
      expect(GRAZING_QUARREL.test(quarrel) ? `${seed}: ${quarrel}` : null).toBe(null);
      expect(quarrel, `${seed}: the cascade's last quarrel still prints, over the place's own ground or water`).toMatch(/^A dispute over (rights on .+ and access to water|water access) has run for two seasons/);
    });
    expectNoSeedFailures(failures, 'no grazing quarrel in a place with no grazing');
    // NEGATIVE beside it, RESTATED by the tenth chair's RULING G13 (WORDS-2 E3): a foraging or hunting thorp or a hamlet with
    // common grazing kept the stock line under BR15; G13 keeps the grazing quarrel only where herding is what the place lives
    // by (its leading home food source, `foodRecord.foodSources[0]`, is the herds). Each such town keeps it exactly there.
    const kept = townsOf('15b-').map(([seed, town]) => {
      const herds = town.economicState?.foodSecurity?.foodRecord?.foodSources?.[0] === 'livestock';
      return `${seed}: ${GRAZING_QUARREL.test(String(town.powerStructure?.recentConflict || '')) === herds ? 'as G13' : 'NOT as G13'}`;
    });
    expect(kept.length, 'the negative towns are live').toBeGreaterThan(0);
    expect(kept.filter((k) => k.endsWith('NOT as G13'))).toEqual([]);
  });
});

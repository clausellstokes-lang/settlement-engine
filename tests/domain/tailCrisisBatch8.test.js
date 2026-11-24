/**
 * TAIL-CRISIS batch 8 (TAIL-CRISIS-6, the chair's rulings K24 and K25 of 2026-11-15, vetoable by the owner): A POWER THE
 * CRISIS ITSELF RAISED HAS THE STAKE ITS NAME SAYS. The famine's Grain Holders, the plague's Quarantine Council and the
 * betrayal's Inquiry (K24), and every other power a crisis raises or writes into (K25 (a)), were stored as untouched by their
 * own crisis ("has no stake yet · it could side with either camp"). A declared move of stored text (granted): each keeps the
 * waverer's `split` (K22's form: no cast role moves) and its reason says what its own record holds (`crisisCast.js ::
 * RAISED_BY_CRISIS`, read by the description the crisis gave it, so a name re-drawn at the label close keeps its stake: "The
 * Establishment" and "The Administrative Circle" below).
 *
 * One collected test on births of the census's own seeds (CENSUS-3 seedcfg.mjs, the r2s- arm, copied): each FALSE pair a
 * (seed, power, stored reason) red at aa78d1ec9 ("it could side with either camp"), with what is stored in its place; each
 * KEEP pair a true sibling, green at both.
 */
import fs from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import * as cast from '../../src/domain/crisis/crisisCast.js';

/** Read through the namespace, so the pairs run (and red) at a base that has no table. @type {Record<string, string>} */
const STAKE_REASONS = /** @type {any} */ (cast).STAKE_REASONS;
/** @type {ReadonlyArray<readonly [string, string, string, boolean?]>} */
const RAISED_BY_CRISIS = /** @type {any} */ (cast).RAISED_BY_CRISIS || [];

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** @type {Map<string, any>} */
const born = new Map();
/** @type {(seed: string) => any} */
let birth;

beforeAll(async () => {
  const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  await loadGenerationLawPayloads();
  birth = (seed) => {
    if (born.has(seed)) return born.get(seed);
    const m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
    if (!m) throw new Error(`no configuration for ${seed}`);
    const cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
    const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    born.set(seed, s);
    return s;
  };
}, 240000);

/** The stored stake of a power in the town's crisis of a kind. @param {any} s @param {string} kind @param {string} power */
const stakeOf = (s, kind, power) => ([].concat(s.stress || []).find((/** @type {any} */ e) => e?.type === kind)?.cast?.stakes || [])
  .find((/** @type {any} */ k) => k.factionId === power);

/** [seed, kind, power, the reason now stored] where the crisis's own power was stored as untouched (the census's r2s- arm). */
const FALSE = /** @type {Array<[string, string, string, string]>} */ ([
  ["r2s-famine-village-2", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-town-2", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-city-1", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-city-2", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-city-3", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-metropolis-0", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-metropolis-2", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-metropolis-3", "famine", "Grain Holders", "holdsFood"],
  ["r2s-recently_betrayed-village-0", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-village-2", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-town-2", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-town-3", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-city-0", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-metropolis-1", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-metropolis-2", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-metropolis-3", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-plague_onset-town-1", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-city-0", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-city-1", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-city-2", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-metropolis-0", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-metropolis-0", "plague_onset", "The Establishment", "chargedWithSickness"],
  ["r2s-plague_onset-metropolis-1", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-metropolis-1", "plague_onset", "The Administrative Circle", "chargedWithSickness"],
  ["r2s-plague_onset-metropolis-2", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2s-plague_onset-metropolis-3 lit stores no stake for a Quarantine
  // Council; the lowest r2s-plague_onset-metropolis not above whose Quarantine Council stores the split is metropolis-4
  ["r2s-plague_onset-metropolis-4", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-occupied-metropolis-1", "occupied", "Noble Houses", "termsWithOccupier"],
  ["r2s-politically_fractured-town-0", "politically_fractured", "The Independent Bloc", "claimsToGovern"],
  ["r2s-politically_fractured-town-3", "politically_fractured", "Third Bloc (Neutrals)", "courted"],
  ["r2s-indebted-village-0", "indebted", "Creditor's Representative", "creditorAgent"],
  ["r2s-indebted-metropolis-3", "indebted", "Noble Houses", "someHoldDebt"],
  ["r2s-indebted-metropolis-3", "indebted", "Crown Creditors (Noble Coalition)", "holdsDebt"],
  ["r2s-infiltrated-village-0", "infiltrated", "The Independent Bloc", "infiltrator"],
  ["r2s-succession_void-village-0", "succession_void", "The Highborn Circle", "claimsSuccession"],
  ["r2s-succession_void-town-3", "succession_void", "Landed Gentry", "claimantsNeedIt"],
  ["r2s-insurgency-town-0", "insurgency", "Reform Movement", "leadsChallenge"],
  ["r2s-slave_revolt-city-1", "slave_revolt", "Merchant Guilds", "revoltCutsLabour"],
  ["r2s-slave_revolt-metropolis-0", "slave_revolt", "Abolitionist Network", "aidsRevolt"],
  ["r2s-slave_revolt-metropolis-0", "slave_revolt", "The Independent Bloc", "leadsRevolt"],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2s-slave_revolt-metropolis-2's church lit gains while the seat
  // struggles (gainsChurch: the seat is contested); the lowest r2s-slave_revolt-metropolis whose Religious Authorities store the
  // split is metropolis-69 (69 90 115 155 158 176 of 200)
  ["r2s-slave_revolt-metropolis-69", "slave_revolt", "Religious Authorities", "pressedToJudge"],
  ["r2s-wartime-village-0", "wartime", "Merchant Guilds", "warCostsIt"],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2s-wartime-city-0's church lit gains while the seat struggles; the
  // lowest r2s-wartime-city whose Religious Authorities store the split is city-6 (6 12 13 20 36 53 59 68 of 200)
  ["r2s-wartime-city-6", "wartime", "Religious Authorities", "warNeedsIt"],
  ["r2s-wartime-city-1", "wartime", "Merchant Guilds", "warDivides"],
  ["r2s-mass_migration-hamlet-0", "mass_migration", "Newcomers' Settlement", "speaksForNewcomers"],
  ["r2s-mass_migration-town-1", "mass_migration", "Merchant Guilds", "guildsThreatened"],
]);

describe('a power the crisis itself raised is never stored as untouched by it', () => {
  // a plain parameterless loop in place of the parked `it.each` (TAIL-CLOSE-TESTS-C): the same cases and assertions
  for (const [seed, kind, power, key] of FALSE) {
    it(`${seed} (${kind}): ${power} stores its own stake, keeping the waverer's split (red at aa78d1ec9: "it could side with either camp")`, () => {
      const k = stakeOf(birth(seed), kind, power);
      expect(k).toEqual({ factionId: power, stake: 'split', reason: STAKE_REASONS[key] });
      // anchored: the line above pins the stored stake whole, so its reason is live
      expect(k?.reason).not.toBe('it could side with either camp');
    });
  }
  it('KEEPS a power the crisis did not raise as untouched (r2s-slave_revolt-metropolis-0, Arcane Orders)', () => {
    expect(stakeOf(birth('r2s-slave_revolt-metropolis-0'), 'slave_revolt', 'Arcane Orders')?.reason).toBe('it could side with either camp');
  });
  it('KEEPS the slave revolt\'s leadership on its K22 row (r2s-slave_revolt-town-0)', () => {
    expect(stakeOf(birth('r2s-slave_revolt-town-0'), 'slave_revolt', 'Revolt Leadership')?.reason).toBe('it leads the revolt, and rises or falls with it');
  });
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2s-mass_migration-city-2's Thieves' Guild lit gains from the disorder (gainsCrime); the lowest
  // r2s-mass_migration-city whose Thieves' Guild carries the crisis's merchant sentence and stores the split is city-70 (70 228
  // 385 of 400)
  it('KEEPS a criminal power the crisis\'s merchant sentence was written onto by its name as untouched (r2s-mass_migration-city-70, Thieves\' Guild)', () => {
    expect(stakeOf(birth('r2s-mass_migration-city-70'), 'mass_migration', "Thieves' Guild")?.reason).toBe('it could side with either camp');
  });

  it('each row names the roster\'s own description, written under the kind it names (stressFactions.js)', () => {
    const src = fs.readFileSync(new URL('../../src/generators/power/stressFactions.js', import.meta.url), 'utf8');
    expect(RAISED_BY_CRISIS.length).toBeGreaterThan(0);
    for (const [kind, opening, key] of RAISED_BY_CRISIS) {
      const segments = src.split(/(?=\bke\(')/).filter((seg) => seg.startsWith(`ke('${kind}')`));
      expect(segments.length, kind).toBeGreaterThan(0);
      expect(segments.some((seg) => seg.includes(opening)), `${kind}: ${opening}`).toBe(true);
      expect(typeof STAKE_REASONS[key], key).toBe('string');
    }
  });
});

/**
 * K25 (c): A POWER THE CRISIS HAS TRULY NOT TOUCHED TAKES NO ROW. "<power> has no stake yet" claims a future nobody knows;
 * silence is true (`crisisPage.js :: composeCrisisPage`, display only; the record keeps the waverer's split). Each pair a
 * (seed, power) whose row printed "has/have no stake yet" at aa78d1ec9 (red there), and prints no row now; the section's other
 * rows still print (KEEP). The crisis page, the PDF and the Foundry journal all read this one composition.
 */
describe('a power the crisis has not touched prints no stake row', () => {
  /** @type {Array<[string, string, string]>} */
  const SILENT = [
    ['r2s-under_siege-town-2', 'under_siege', 'Landed Gentry'], ['r2s-under_siege-city-0', 'under_siege', 'Arcane Orders'],
    ['r2s-under_siege-metropolis-0', 'under_siege', 'Noble Houses'], ['r2s-under_siege-metropolis-2', 'under_siege', 'The Highborn Circle'],
    ['r2s-famine-city-0', 'famine', 'The Landed Bloc'], ['r2s-famine-city-1', 'famine', 'Merchant Guilds'],
    // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2s-indebted-city-3's Military/Guard lit stores no stake; the lowest r2s-indebted-city after -1 whose
    // Military/Guard stores the untouched split and holds no quarrel of its own is city-7 (city-0's prints its quarrel with the seat)
    ['r2s-indebted-city-1', 'indebted', 'Military/Guard'], ['r2s-indebted-city-7', 'indebted', 'Military/Guard'],
  ];
  /** @param {string} seed @param {string} kind */
  const rowsOf = async (seed, kind) => {
    const { composeCrisisPage } = await import('../../src/domain/crisis/crisisPage.js');
    return composeCrisisPage(birth(seed)).find((sec) => sec.type === kind)?.stakes || [];
  };
  // a plain parameterless loop in place of the parked `it.each` (TAIL-CLOSE-TESTS-C): the same cases and assertions
  for (const [seed, kind, power] of SILENT) {
    it(`${seed} (${kind}): ${power} prints no row (red at aa78d1ec9: "has no stake yet"); the record keeps its split`, async () => {
      const rows = await rowsOf(seed, kind);
      // TAIL-CLOSE-TESTS-C: the liveness anchor: the section's other rows still print (the header's KEEP), so its rows are read
      expect(rows.length, `${seed}: the ${kind} section prints its other rows`).toBeGreaterThan(0);
      // anchored: the line above shows the section's rows are live
      expect(rows.map((k) => k.factionId)).not.toContain(power);
      expect(rows.some((k) => /^untouched/.test(k.stake))).toBe(false);
      expect(stakeOf(birth(seed), kind, power)).toEqual({ factionId: power, stake: 'split', reason: 'it could side with either camp' });
    });
  }
  it('KEEPS the section\'s other rows (r2s-famine-city-1: the losing seat, the gaining crime, the quarrel)', async () => {
    const rows = (await rowsOf('r2s-famine-city-1', 'famine')).map((k) => `${k.factionId} ${k.stake}`);
    expect(rows).toEqual(expect.arrayContaining(['Merchant Guild Council loses', "Thieves' Guild gains", 'The Commercial Circle atOdds']));
  });
});

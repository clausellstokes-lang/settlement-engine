/**
 * upkeepHired.test.js — COHERENCE-UPKEEP (the chair's ruling of 2026-11-12 on item 4, ruling 2):
 * a hired force stands in for a standing one "to an appropriate but lesser degree" (the owner).
 *
 * THE INVARIANT, pinned by counterfactual on the pure score: FOR EVERY PLACE WITH HIRED FORCE AND
 * NO STANDING FORCE, ITS MILITARY SCORE IS NOT ABOVE WHAT THE SAME PLACE SCORES WITH A WATCH IN
 * THE HIRED FORCE'S STEAD. The counterfactual is the same born record handed back to the one
 * defence writer (`generateDefenseProfile`, pure in the record) with its hired institutions
 * (the company, the charter hall) replaced by a watch of its tier.
 *
 * The seeds are the lane corpus's five hired-only places (`agree-village-28, -30, -40, -43,
 * -45`). The red seed is agree-village-45: a Poor village whose only force is a charter hall,
 * scoring military 97 at the base.
 */
import { describe, expect, test, beforeAll } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateDefenseProfile } from '../../src/generators/defenseGenerator.js';
import { getInstFlags } from '../../src/generators/priorityHelpers.js';
import { generateAvailableServices } from '../../src/generators/servicesGenerator.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { deriveMagicProfile, magicAvailabilityBands } from '../../src/domain/magicProfile.js';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';
import { SAFETY_LINE_SIBLINGS, keptGuardLine, generateSafetyProfile } from '../../src/generators/safetyProfile.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SEEDS = ['agree-village-28', 'agree-village-30', 'agree-village-40', 'agree-village-43', 'agree-village-45'];
const HIRED = /mercenar|free company|adventurers'|hireling hall/i;
/** The flags the one defence writer reads. @param {any} s */
const forcesOf = (s) => getInstFlags(s.config, s.institutions).inst;
const WATCH_OF = { village: 'Village watch', town: 'Town watch', city: 'City watch', metropolis: 'City watch' };

/** @param {string} seed */
const born = (seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed });

/** The same record with a watch in the hired force's stead. @param {any} s */
function withWatchInstead(s) {
  const institutions = s.institutions.filter((i) => !HIRED.test(i.name));
  institutions.push({ name: WATCH_OF[s.tier] || 'Town watch', category: 'Defense' });
  return { ...s, institutions };
}

describe('a hired force stands in for a standing one, to a lesser degree', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the counterfactual is a watch and no hired force (anchored)', () => {
    const s = born('agree-village-45');
    const home = forcesOf(s);
    expect(home.hasCharterHall || home.hasMercenary).toBe(true);
    expect(home.hasGarrison || home.hasWatch || home.hasMilitia).toBe(false);
    const cf = forcesOf(withWatchInstead(s));
    expect(cf.hasWatch).toBe(true);
    expect(cf.hasCharterHall || cf.hasMercenary).toBe(false);
  });

  test.each(SEEDS)('RED-FIRST %s: military with hired force only is not above the same place with a watch instead', (seed) => {
    const s = born(seed);
    const home = forcesOf(s);
    expect(home.hasCharterHall || home.hasMercenary, 'the seed holds a hired force').toBe(true);
    expect(home.hasGarrison || home.hasWatch || home.hasMilitia, 'and no standing force').toBe(false);
    const hired = generateDefenseProfile(s).scores.military;
    const watch = generateDefenseProfile(withWatchInstead(s)).scores.military;
    expect(hired, `${seed}: hired-only ${hired} against a watch's ${watch}`).toBeLessThanOrEqual(watch);
  });
});

/**
 * THE FIVE GATES (ruling 3, alternative B): the wage-and-works gates (military, monster, internal,
 * economic, disaster) read the one home, `keepOf(prosperity).funded`, with today's floors kept and
 * the identity at Comfortable and above. The seeds are two where the label and the output disagree
 * at the base: agree-village-16 is Comfortable with output 16, agree-village-5 Struggling with 57.
 */
describe('the five upkeep gates read the prosperity label, not the output', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const FLOORS = { military: 0.6, monster: 0.7, internal: 0.65, economic: 0.45, disaster: 0.55 };

  test('RED-FIRST agree-village-16 (Comfortable, output 16): every gate is the identity', () => {
    const s = born('agree-village-16');
    expect(s.economicState.prosperity).toBe('Comfortable');
    const gates = generateDefenseProfile(s).economicGates;
    expect(Object.keys(gates).length, 'anchored: the record carries its gates').toBeGreaterThan(2);
    for (const [gate, value] of Object.entries(gates)) expect(value, gate).toBe(1);
  });

  test('RED-FIRST agree-village-5 (Struggling, output 57): every gate stands at its floor', () => {
    const s = born('agree-village-5');
    expect(s.economicState.prosperity).toBe('Struggling');
    const gates = generateDefenseProfile(s).economicGates;
    expect(Object.keys(gates).length, 'anchored: the record carries its gates').toBeGreaterThan(2);
    for (const [gate, value] of Object.entries(gates)) expect(value, gate).toBe(FLOORS[gate]);
  });
});

/**
 * SERVICES (ruling 4): what is bought keeps `0.7 + 0.3 × keep` of its demand (healing, lodging,
 * food, equipment, transport, and the commercial services, whose read moves home), by a draw-free
 * roll, and a standing institution keeps at least one row. The pin rolls one Struggling town's
 * own roster twice under the same seed, read as Struggling and as Wealthy.
 */
describe('services are kept as far as the place can pay', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {any} s @param {string} prosperity */
  const rollAs = (s, prosperity) => {
    const prev = setActiveRng(createPRNG(`${s.config?.seed || 'upkeep'}:services`));
    try {
      return generateAvailableServices(s.tier, s.institutions, s.config?.servicesToggles || {}, { ...s.config, _prosperity: prosperity, _seed: 'agree-town-0' }, null);
    } finally { clearActiveRng(prev); }
  };
  const rows = (svc) => Object.values(svc).reduce((n, list) => n + (Array.isArray(list) ? list.length : 0), 0);

  test('RED-FIRST agree-town-0 (Struggling): fewer bought rows than the same roster read as Wealthy, and every institution that offers rows keeps one', () => {
    const s = born('agree-town-0');
    const poor = rollAs(s, 'Struggling');
    const rich = rollAs(s, 'Wealthy');
    expect(rows(rich), 'anchored: the roster offers services').toBeGreaterThan(10);
    expect(rows(poor)).toBeLessThan(rows(rich));
    const providers = (svc) => new Set(Object.values(svc).flat().map((r) => r.institution || r.providedBy || r.source).filter(Boolean));
    for (const name of providers(rich)) expect(providers(poor).has(name), `${name} keeps a row`).toBe(true);
    // THE CHAIR'S INVARIANT (ruling (A), condition 2): the rule only takes away — every row the
    // Struggling read holds, the full read holds too (the step's seeded stream does not move).
    const keys = (svc) => new Set(Object.entries(svc).flatMap(([cat, list]) => list.map((r) => `${cat}|${r.institution}|${r.name}`)));
    const full = keys(rich);
    expect([...keys(poor)].filter((k) => !full.has(k)), 'rows added by the upkeep rule').toEqual([]);
  });
});

/**
 * MAGIC (ruling 5): availability steps down one band where the place keeps too little to buy it
 * (`keep.bought` under the scale table's magic line), unless the world's magic is pervasive.
 */
describe('magic is as available as the place can buy', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {any} s @param {string} prosperity @param {string} [magicLevel] */
  const readAs = (s, prosperity, magicLevel) => deriveMagicProfile({
    ...s, economicState: { ...s.economicState, prosperity },
    config: magicLevel ? { ...s.config, magicLevel } : s.config,
  }).availability;
  const bands = magicAvailabilityBands();

  test('RED-FIRST agree-village-0: read as Struggling, one band below the same record read as Wealthy', () => {
    const s = born('agree-village-0');
    const rich = readAs(s, 'Wealthy');
    expect(bands.indexOf(rich), 'anchored: the record has magic to buy').toBeGreaterThan(1);
    expect(bands.indexOf(readAs(s, 'Struggling'))).toBe(bands.indexOf(rich) - 1);
    expect(readAs(s, 'Moderate'), 'a Moderate place buys what it buys today').toBe(rich);
  });

  test('a pervasive world does not move', () => {
    const s = born('agree-village-0');
    expect(readAs(s, 'Struggling', 'pervasive')).toBe(readAs(s, 'Wealthy', 'pervasive'));
  });
});

/**
 * STORES (ruling 6): what a place lays by is what it can buy, at the stores' writer, after
 * prosperity: the full granary keeps `boughtShare('stores', keep)` of its months, the storage
 * note and the resilience follow the kept months, and the band does not move.
 */
describe('stores are what the place can lay by', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {any} s @param {number} share */
  const storesAt = (s, share) => {
    const prev = setActiveRng(createPRNG('upkeep:stores'));
    try {
      return generateFoodSecurity(s.tier, s.institutions, { ...s.config, tradeRouteAccess: s.config.tradeRouteAccess, _storesShare: share });
    } finally { clearActiveRng(prev); }
  };

  test('RED-FIRST agree-town-0: at a Struggling share the writer lays by fewer months, its note and resilience follow, its band holds', () => {
    const s = born('agree-town-0');
    const full = storesAt(s, 1);
    const kept = storesAt(s, 0.82);
    expect(full.storageMonths, 'anchored: the town lays something by').toBeGreaterThan(1);
    expect(kept.storageMonths).toBeLessThan(full.storageMonths);
    expect(kept.foodRecord.storageMonths).toBe(kept.storageMonths);
    expect(kept.resilienceScore).toBeLessThanOrEqual(full.resilienceScore);
    expect(kept.label).toBe(full.label);
    if (kept.storageMonths >= 4) expect(kept.storageNote).toContain(String(kept.storageMonths));
  });

  test('the born record lays by at its own label\'s share (agree-town-0, Struggling, below its full granary)', () => {
    const s = born('agree-town-0');
    expect(s.economicState.prosperity).toBe('Struggling');
    const fs = s.economicState.foodSecurity;
    expect(fs.foodRecord.storageMonths).toBe(fs.storageMonths);
  });
});

/**
 * THE PAGE (ruling 7): the hired force's lines in the guard assessment say what the place can pay,
 * declared in SAFETY_LINE_SIBLINGS by the `mercenary` and `prosperity` atoms, each with its twin
 * (today's line). Found here by their declared atoms, never by a literal sentence.
 */
describe('the guard assessment says what the place can pay for its hired force', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** The declared originals whose needs name the prosperity atom. */
  const upkeepLines = () => Object.values(SAFETY_LINE_SIBLINGS)
    .map((set) => set[0])
    .filter((line) => line.needs.some((atom) => atom.startsWith('prosperity:')));

  test('RED-FIRST: the hired lines are declared, each with its twin, by the prosperity atom', () => {
    const lines = upkeepLines();
    expect(lines.length).toBeGreaterThanOrEqual(3);
    for (const line of lines) {
      const set = Object.values(SAFETY_LINE_SIBLINGS).find((x) => x[0] === line);
      expect(set.length, `${line.text} carries its twin`).toBe(2);
    }
  });

  test('a hired company and no standing guard: the paid line at Moderate, the short line at Poor, today\'s line unanswered', () => {
    const roster = [{ name: 'Mercenary company', category: 'Defense' }, { name: 'Town hall', category: 'Government' }];
    const today = generateSafetyProfile({ priorityMilitary: 60, priorityEconomy: 60 }, 'town', roster).guardEffectivenessDesc;
    const lineOf = (atom) => upkeepLines().find((line) => line.needs.includes(atom));
    expect(keptGuardLine(today, roster, 'Moderate').startsWith(lineOf('prosperity: ≥ moderate').text)).toBe(true);
    expect(keptGuardLine(today, roster, 'Poor').startsWith(lineOf('prosperity: ≤ poor').text)).toBe(true);
    expect(keptGuardLine(today, roster, 'Wealthy').startsWith(lineOf('prosperity: ≥ moderate').text)).toBe(true);
    const twin = Object.values(SAFETY_LINE_SIBLINGS).find((set) => set[0] === lineOf('prosperity: ≤ poor'))[1].text;
    expect(today.startsWith(twin), 'anchored: the safety writer printed today\'s lead').toBe(true);
  });

  test('RED-FIRST agree-village-40 (Poor, a charter hall and no standing guard): the guard line is the purse-bound charter line', () => {
    const s = born('agree-village-40');
    expect(s.economicState.prosperity).toBe('Poor');
    const charter = upkeepLines().filter((line) => /charter hall/.test(line.text));
    expect(charter.length, 'anchored: the charter line is declared').toBe(1);
    expect(s.economicState.safetyProfile.guardEffectivenessDesc).toContain(charter[0].text);
  });
});

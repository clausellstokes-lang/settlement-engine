/**
 * tests/generators/informantNoThievesGuild.test.js — R2-CODE-A item 7 (the cold list REVIEW-W2A-3,
 * HIGH #128, #720, MEDIUM #311): "Secret: On the payroll of the thieves' guild as a silent informant"
 * printed in towns whose crime is a smuggling network, a street gang or a fence, and no thieves'
 * guild. The sanitiser in `npcGenerator.js :: mergeNPCLists` rewrote the guild only where no crime
 * stood at all (F4: "a powerful outside interest"); where crime stands without a thieves' guild it
 * now speaks of "the local underworld" (R2-CODE-A-5: never a criminal power's name, which a user can
 * hide by hand; record 331). No draw.
 * R2-CODE-A-7 (the hand-back's step 1 item 4; the chair's ruling): beside that rule, a secret names merchants or a market
 * only where the roster holds a market (`domain/facts/market.js :: hasMarketInstitution`): "a protection scheme
 * targeting the very merchants" (and its stakes' "the merchants have been keeping records") speaks of the town's
 * households instead. "before it goes to market" is the presumed-things register's ruled figure (to sale). No draw.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { crimeSignalOf } from '../../src/domain/crimeSignal.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { mergeNPCLists } from '../../src/generators/npcGenerator.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';

describe('the cold list\'s towns with crime and no thieves\' guild, born as the app births them', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  // At e969a75b7 the informant prints in the siege metropolis; the other two (#128, #720 on the reviewer's tree) are dealt
  // other secrets here, and stay guarded against the guild.
  it.each([['rw3-metropolis-politically_fractured-1', false], ['rw3-metropolis-under_siege-1', true], ['rw3-city-wartime-1', false]])('%s: no secret names a thieves\' guild the town lacks', (seed, informant) => {
    const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
    const signal = crimeSignalOf({ seats: s.powerStructure?.factions, estate: s.institutions });
    const names = [...signal.factions, ...signal.houses, ...(s.powerStructure?.factions || []).map((/** @type {any} */ f) => f.faction)];
    expect(names.some((n) => /thie|criminal guild/i.test(String(n)))).toBe(false);
    const secrets = (s.npcs || []).map((/** @type {any} */ n) => String(n?.secret?.what || ''));
    expect(secrets.filter((t) => /thieves['’]? guild/i.test(t))).toEqual([]);
    if (informant) expect(secrets.some((t) => /^On the payroll of (?:the local underworld|a powerful outside interest) as a silent informant$/.test(t))).toBe(true);
  });
});

describe('a secret names merchants only where the roster holds a market (R2-CODE-A-7)', () => {
  const cards = () => [
    { role: 'the priest', secret: { what: "Runs a protection scheme targeting the very merchants they're supposed to serve", stakes: 'Civil and criminal liability; the merchants have been keeping records' } },
    { role: 'the dairy farmer', secret: { what: 'Waters the milk before it goes to market and has done so for years', stakes: 'x' } },
    { role: 'the master of the hunt', secret: { what: 'Has been hunting on land that belongs to someone else and selling the game in the market', stakes: 'x' } },
  ];
  const powers = [{ faction: 'Elder Council', isGoverning: true, category: 'government', power: 10 }];
  /** @param {unknown[]} inst @param {string} tier @returns {any[]} */
  const merged = (inst, tier) => { const prev = setActiveRng(createPRNG('marketSecrets')); try { return mergeNPCLists(cards(), powers, inst, tier, {}); } finally { clearActiveRng(prev); } };
  it('with no market the protection scheme speaks of the households; the figure "goes to market" stands', () => {
    const out = merged([{ name: 'Access to parish church' }], 'hamlet');
    expect(out.map((/** @type {any} */ n) => `${n.secret.what} | ${n.secret.stakes}`).filter((t) => /merchant/i.test(t))).toEqual([]);
    expect(out.slice(1).map((/** @type {any} */ n) => n.secret)).toEqual(cards().slice(1).map((c) => c.secret));
    expect(out[0].secret.what).toBe("Runs a protection scheme targeting the very households they're supposed to serve");
  });
  it('with a market they stand as dealt', () => {
    const out = merged([{ name: 'Weekly market' }], 'village');
    expect(out.map((/** @type {any} */ n) => n.secret)).toEqual(cards().map((c) => c.secret));
  });
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  /** @param {string} seed */
  const born = (seed) => {
    const r = seed.match(/^r2r-(\w+)-\d+$/); const m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
    const cfg = r ? { ...DEFAULT_CONFIG, ...dials, settType: r[1] } : { ...DEFAULT_CONFIG, ...dials, selectedStresses: [/** @type {RegExpMatchArray} */ (m)[1]], selectedStressesRandom: false, settType: /** @type {RegExpMatchArray} */ (m)[2] };
    return /** @type {any} */ (generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }));
  };
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it.each(['r2r-village-12'])('guard town %s (no market): no secret names merchants', (seed) => {
    const s = born(seed);
    expect((s.npcs || []).map((/** @type {any} */ n) => `${n?.secret?.what || ''} | ${n?.secret?.stakes || ''}`).filter((t) => /merchant/i.test(t))).toEqual([]);
  });
  it('the plague quarantine secret\'s merchant (`market`, R2-CODE-A-7 item 5): guard town r2s-plague_onset-village-0 (no market); r2s-plague_onset-town-0 keeps it', () => {
    /** @param {string} seed */ const quarantine = (seed) => (born(seed).npcs || []).some((/** @type {any} */ n) => /shipments from a specific merchant/.test(n?.secret?.what || ''));
    expect(quarantine('r2s-plague_onset-village-0')).toBe(false);
    expect(quarantine('r2s-plague_onset-town-0')).toBe(true);
  });
  it('r2s-under_siege-village-0 (a market) keeps the protection scheme on its merchants', () => {
    expect((born('r2s-under_siege-village-0').npcs || []).some((/** @type {any} */ n) => /targeting the very merchants/.test(n?.secret?.what || ''))).toBe(true);
  });
});

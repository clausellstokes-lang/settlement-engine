/**
 * tests/generators/rosterUnderworldNoName.test.js — R2-CODE-A-5, the chair's ruling of 2026-11-13 23:57 UTC (a ROSTER
 * card's "On the payroll of the thieves' guild as a silent informant" in towns that have crime and no thieves' guild).
 * RULED: a secret names a thieves' guild only where a house or a power of that name stands; where the town's crime is
 * another house, the secret speaks of the town's own underworld in words true of it ("the local underworld", the
 * powers lane's `crimeSignal.js :: withTownsOwnUnderworld` word for word), or is not dealt. The roster's sanitiser
 * (`npcGenerator.js :: mergeNPCLists`, item 7) named a criminal power where one stood ("the Shadow Compact"): a power
 * can be hidden by hand, and a name a user can hide is never written into a stored, composed sentence (record 331).
 *   A1 a named criminal power and no guild: the local underworld, never the power's name;
 *   A2 a thieves' guild house: the line stands; no crime at all: F4's "a powerful outside interest";
 *   A3 the reader's town r2r-town-26 (a fence, no guild), born as the census births it: the tavern keeper's secret
 *      speaks of the local underworld; the guard town r2r-town-35 (a Thieves' Guild power) keeps its guild.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { mergeNPCLists } from '../../src/generators/npcGenerator.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';

const INFORMANT = "On the payroll of the thieves' guild as a silent informant";
const card = () => ({ name: 'Sophronios Chomatenos', role: 'tavern keeper', secret: { what: INFORMANT, stakes: 'Exposure would cost them their post and likely their safety' } });
const secretIn = (/** @type {any[]} */ factions, /** @type {any[]} */ institutions) => {
  const prev = setActiveRng(createPRNG('roster-underworld'));
  try { return mergeNPCLists([card()], factions, institutions, 'town', {})[0].secret.what; } finally { clearActiveRng(prev); }
};
const COUNCIL = { faction: 'Town Council', category: 'government', isGoverning: true, power: 40 };

describe("the roster's informant names only the underworld the town has", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('A1: a named criminal power and no thieves\' guild — the local underworld, never the power\'s name', () => {
    const what = secretIn([COUNCIL, { faction: 'The Shadow Compact', category: 'criminal', power: 20 }], [{ name: 'Fence (word of mouth)', category: 'Criminal' }]);
    expect(what).toBe('On the payroll of the local underworld as a silent informant');
    expect(what).not.toMatch(/Shadow Compact/);
  });

  it('A2: a thieves\' guild house keeps the line; no crime at all reads a powerful outside interest', () => {
    expect(secretIn([COUNCIL], [{ name: "Thieves' guild chapter", category: 'Criminal' }])).toBe(INFORMANT);
    expect(secretIn([COUNCIL], [{ name: 'Market square', category: 'Economy' }])).toBe('On the payroll of a powerful outside interest as a silent informant');
  });

  const CENSUS_DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const born = (/** @type {string} */ seed) => /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...CENSUS_DIALS, settType: 'town' }), null, { seed, customContent: {} }));

  it('A3: the reader\'s town (a fence, no guild) speaks of the local underworld; a guild town keeps its guild', () => {
    const reader = born('r2r-town-26');
    expect(reader.npcs.find((/** @type {any} */ n) => n.role === 'the tavern keeper')?.secret?.what).toBe('On the payroll of the local underworld as a silent informant');
    expect(reader.npcs.map((/** @type {any} */ n) => String(n.secret?.what || '')).filter((t) => /thieves['’]? guild/i.test(t))).toEqual([]);
    const guild = born('r2r-town-35');
    expect(guild.npcs.some((/** @type {any} */ n) => n.secret?.what === INFORMANT)).toBe(true);
  });
});

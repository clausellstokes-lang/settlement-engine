/**
 * mintedFaceUnderworld.test.js — COHERENCE-POWERS-7 (the brief's leftover 1, from R2-CODE-A item 7): A MINTED FACE'S
 * SECRET NAMES NO THIEVES' GUILD THE TOWN LACKS. The roster's cards are rewritten by `npcGenerator.js :: mergeNPCLists`;
 * a face minted later, at the seam (`people/castPowers.js :: landMemberships`: a noble body's lord, a bloc's speaker, a
 * claimant), drew its secret after that pass and kept "On the payroll of the thieves' guild as a silent informant" in a
 * town whose crime is a smuggling network or rival gangs. The cure is one rule in the crime signal's home
 * (`domain/crimeSignal.js :: withTownsOwnUnderworld`), run on the minted face after its draw: no crime at all, F4's
 * "a powerful outside interest"; crime with no thieves' or criminal guild, "the local underworld". A criminal power's
 * NAME is never written in (a power can be hidden by hand; record 331's law).
 *
 * Before the cure, at the lane's base 714381934 (the census's 720 births, app shape): four minted faces carry the line —
 * r2r-metropolis-39 (the lord of Noble Houses), r2s-politically_fractured-city-1 (the bloc's speaker),
 * r2s-indebted-city-0 and r2s-succession_void-city-2 (the lord of The Peerage). Every expected word is a literal.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { withTownsOwnUnderworld } from '../../../src/domain/crimeSignal.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
/** The census's seed shapes: r2r-<size>-<i> calm, r2s-<crisis>-<size>-<i> forced. @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced[2], selectedStresses: [forced[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
const GUILD = /thie(?:f|ves)['’]?\s+guild|criminal guild/i;
/** Whether the town has a thieves' or criminal guild among its powers or houses. @param {any} s */
const hasGuild = (s) => [...(s.powerStructure?.factions || []).map((f) => f.faction), ...(s.institutions || []).map((i) => i.name)]
  .some((n) => /thie|criminal guild/i.test(String(n || '')));
/** The minted faces (the seam's ids). @param {any} s */
const minted = (s) => (s.npcs || []).filter((c) => c?.institution?.kind === 'power');

describe('COHERENCE-POWERS-7 leftover 1 · the rule, in its home', () => {
  const LINE = "On the payroll of the thieves' guild as a silent informant";
  it('no crime at all: F4\'s "a powerful outside interest"', () => {
    expect(withTownsOwnUnderworld(LINE, { present: false, factions: [], houses: [] }, null))
      .toBe('On the payroll of a powerful outside interest as a silent informant');
  });
  it('crime with no thieves\' guild: "the local underworld", and never a criminal power\'s name', () => {
    expect(withTownsOwnUnderworld(LINE, { present: true, factions: ['The Black Circle'], houses: ['Smuggling network'] }, 'The Black Circle'))
      .toBe('On the payroll of the local underworld as a silent informant');
    expect(withTownsOwnUnderworld("Is on the thieves' guild payroll", { present: true, factions: [], houses: ['Rival gangs'] }, null))
      .toBe('Is on the payroll of the local underworld');
  });
  it('a town with a thieves\' guild keeps the line; a line with no guild is untouched', () => {
    expect(withTownsOwnUnderworld(LINE, { present: true, factions: [], houses: ["Thieves' guild chapter"] }, null)).toBe(LINE);
    expect(withTownsOwnUnderworld(LINE, { present: true, factions: ["Thieves' Guild"], houses: [] }, "Thieves' Guild")).toBe(LINE);
    expect(withTownsOwnUnderworld('Owes the miller', { present: false, factions: [], houses: [] }, null)).toBe('Owes the miller');
  });
});

describe('COHERENCE-POWERS-7 leftover 1 · the four minted faces of the census\'s 720', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('every minted face of the four towns reads "the local underworld", and no minted face names a guild the town lacks', () => {
    expectNoSeedFailures(collectSeedFailures([
    ['r2r-metropolis-39', 'the lord'],
    ['r2s-politically_fractured-city-1', "the bloc's speaker"],
    ['r2s-indebted-city-0', 'the lord'],
    ['r2s-succession_void-city-2', 'the lord'],
  ], ([seed, title]) => {
    const s = born(seed);
    expect(hasGuild(s)).toBe(false);
    const faces = minted(s);
    expect(faces.filter((c) => GUILD.test(String(c.secret?.what || ''))).map((c) => `${c.title}: ${c.secret.what}`)).toEqual([]);
    expect(faces.filter((c) => c.title === title).map((c) => c.secret?.what))
      .toContain('On the payroll of the local underworld as a silent informant');
  }), 'every minted face of the four towns reads "the local underworld", and no minted face names a guild the town lacks');
  }, 240_000);
});

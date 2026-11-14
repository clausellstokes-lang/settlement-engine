/**
 * tests/generators/informantNoThievesGuild.test.js — R2-CODE-A item 7 (the cold list REVIEW-W2A-3,
 * HIGH #128, #720, MEDIUM #311): "Secret: On the payroll of the thieves' guild as a silent informant"
 * printed in towns whose crime is a smuggling network, a street gang or a fence, and no thieves'
 * guild. The sanitiser in `npcGenerator.js :: mergeNPCLists` rewrote the guild only where no crime
 * stood at all (F4: "a powerful outside interest"); where crime stands without a thieves' guild it
 * now speaks of "the local underworld" (R2-CODE-A-5: never a criminal power's name, which a user can
 * hide by hand; record 331). No draw.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { crimeSignalOf } from '../../src/domain/crimeSignal.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

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

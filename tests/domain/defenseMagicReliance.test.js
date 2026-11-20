/**
 * Lane DEFENSE-2 (2026-11-03): the Defense tab and the defence record read the ONE magic reliance
 * reading and the ONE practitioner census (lane MAGIC's `src/domain/magicReliance.js`).
 *
 * Before: the Arcane Support row asked a roster regex (`compound.inst.hasMagicInst`), so a village
 * whose Magic tab read "integral" with a practising house printed "No arcane practitioners on the
 * rolls"; the row printed in worlds where magic does not work; and the DS-DEF-9 reliance sentence
 * keyed on `defenseProfile.magicDependency`, a flag the generator raised only in a siege, famine or
 * plague. (The stored flag itself: tests/domain/defenseMagicDependencyRecord.test.js.)
 *
 * The seeds are born the way the app births a place: `birthConfig({ ...DEFAULT_CONFIG, ... })`
 * after `loadGenerationLawPayloads()`.
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveMagicReliance, magicPractitioners } from '../../src/domain/magicReliance.js';
import { deriveSupportingCapabilities } from '../../src/domain/display/defenseDisplay.js';
import { defenseMagicDependencyProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** @param {string} tier @param {string} seed @param {object} [over] */
const born = (tier, seed, over = {}) =>
  generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier, ...over }), null, { seed });

/** @param {any} s */
const arcaneRow = (s) => deriveSupportingCapabilities(s).find((c) => c.label === 'Arcane Support');

/** @param {any} s */
const reliesOnMagic = (s) => ['relied-upon', 'integral'].includes(deriveMagicReliance(s).reading);

beforeAll(async () => {
  await loadGenerationLawPayloads();
});

describe('the Arcane Support row reads the practitioner census', () => {
  // ⭐ RE-KEYED BY IDENTITY (LANDING-7 lane D, 2026-11-06). The seeds below were 66-0 and 30-2.
  // 66-0's practitioner was its 'Healer (divine, 1st level)' house; the X-46-3 institution budget
  // (compose 90dc22f18) no longer seats it (34 → 14 houses at 190 souls), so the census found no
  // one. 30-2 had no practising house; the RUNG1B-F1 defence-words compose (5e9ffb220) re-rolled
  // its roster and it now seats that same healer, which the census counts. The first seed of each
  // family meeting the arm's own premise, measured over 66-0..11 and 30-0..7: 66-10 (the same
  // divine-healer practitioner) and 30-0 (none). The readings are unchanged.
  it('a village that practises (seed d2-magic-village-66-10) is Present, and its practitioner is named', () => {
    const s = born('village', 'd2-magic-village-66-10', { magicExists: true, priorityMagic: 66 });
    const practitioners = magicPractitioners(s);
    expect(practitioners.length, 'the census finds a practitioner here').toBeGreaterThan(0);
    // RE-KEYED BY IDENTITY (W2-C-LEAVES-3, the chair's ruling record 369 G5): the row is a claim about the DEFENCE and
    // prints only where the defence profile's own arcane tradition holds too. This village's does not, so no row; with
    // the tradition held, the census's practitioner is Present and named, as before.
    expect(s.defenseProfile.traditions.hasArcane, 'anchored: the defence holds no arcane tradition here').toBe(false);
    expect(arcaneRow(s), 'no row: the defence\'s own tradition does not hold').toBeUndefined();
    const row = arcaneRow({ ...s, defenseProfile: { ...s.defenseProfile, traditions: { ...s.defenseProfile.traditions, hasArcane: true } } });
    expect(row?.status, 'Arcane Support status').toBe('Present');
    expect(row?.note, 'the note names the first practitioner').toContain(practitioners[0]);
  });

  it('a practising person counts: a Hedge Witch on the rolls of a village with no arcane house', () => {
    const s = born('village', 'd2-magic-village-30-0', { magicExists: true, priorityMagic: 30 });
    expect(magicPractitioners(s), 'no practitioner before the witch is added').toEqual([]);
    expect(arcaneRow(s)?.note, 'the no-practitioner note before').toMatch(/^No arcane practitioners on the rolls/);
    const npcs = [...(s.npcs || []), { name: 'Wenna Holt', role: 'Hedge Witch', status: 'active' }];
    // RE-KEYED BY IDENTITY (record 369 G5): the defence's own arcane tradition is held here too, so the census decides.
    const row = arcaneRow({ ...s, npcs, defenseProfile: { ...s.defenseProfile, traditions: { ...s.defenseProfile.traditions, hasArcane: true } } });
    expect(row?.status, 'status with the witch on the rolls').toBe('Present');
    expect(row?.note, 'the note names her').toContain('Wenna Holt');
  });

  it('where magic does not work there is no Arcane Support row at all', () => {
    const s = born('town', 'd2-nomagic-town-0', { magicExists: false, priorityMagic: 0 });
    expectAbsentWithAnchor(deriveSupportingCapabilities(s).map((c) => c.label), 'Arcane Support', 'Medical Readiness', 'the capability rows');
  });
});

describe('the DS-DEF-9 reliance sentence keys on the reliance reading', () => {
  it('a town that relies on magic (seed d2-magic-town-30-0) reads the same whatever the stored flag says', () => {
    const s = born('town', 'd2-magic-town-30-0', { magicExists: true, priorityMagic: 30 });
    expect(reliesOnMagic(s), 'the reading relies on magic').toBe(true);
    const opts = { seed: 'd2', audience: 'dm', tierNoun: 'town' };
    const withFlag = (flag) => defenseMagicDependencyProse(
      { ...s, defenseProfile: { ...s.defenseProfile, magicDependency: flag } }, opts);
    expect(withFlag(false), 'flag false reads as flag true').toEqual(withFlag(true));
    expect(withFlag(true).arcaneReliance, 'and the sentence is drawn').not.toBe(null);
  });
});

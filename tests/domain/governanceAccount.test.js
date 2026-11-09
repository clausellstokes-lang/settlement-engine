/**
 * governanceAccount.test.js — OWNER-WORDS-DOSSIER item 3 (the owner, 2026-11-09: "The governance
 * description itself seemed disconnected and not to our standard wouldn't you agree?"). The Power tab's
 * governance block is ONE composed paragraph read off the record: the seat by name and title, the
 * legitimacy band with its named causes, the powers that have broken with the ruler NAMED, the
 * consequence in plain words, and the generator's vignette only where no estranged power is named.
 */
import { describe, it, expect } from 'vitest';
import {
  governanceAccountOf, estrangedPowersOf, legitimacyCausesOf, powerNameInProse, pluralPowerName,
} from '../../src/domain/display/governanceAccount.js';
import { buildGovernanceLabels } from '../../src/generators/power/governanceNarrative.js';

const COUNCIL = 'Corrupt Council';
const SEAT = {
  id: 'npc_seat', name: 'Boleslav Davydov', role: 'the first councillor', category: 'government',
  memberships: [{ power: COUNCIL, rank: 1 }],
};

/** A planted record: the council governs; its ties to the other powers are the case's own. */
function planted({ relationships = [], recentConflict = null, label = 'Legitimacy Crisis', breakdown = { prosperity: -20, safety: -12, defense: -1, food: 0 } } = {}) {
  return {
    id: 'settlement.polaovo', name: 'Polaovo', tier: 'town', npcs: [SEAT],
    powerStructure: {
      governingName: COUNCIL,
      factions: [
        { faction: COUNCIL, power: 30, category: 'criminal', isGoverning: true },
        { faction: "Thieves' Guild", power: 25, category: 'criminal' },
        { faction: 'Religious Authorities', power: 20, category: 'religious' },
        { faction: 'Merchant Guilds', power: 25, category: 'economy' },
      ],
      factionRelationships: relationships,
      publicLegitimacy: { score: 16, label, breakdown, governanceFractured: label === 'Legitimacy Crisis' },
      stability: 'Fractured — no stable governing authority',
      recentConflict,
    },
  };
}

const FRACTURED_VIGNETTE = (() => buildGovernanceLabels({
  factions: [{ faction: COUNCIL, power: 30, isGoverning: true }],
  config: {}, stressFlags: {}, instFlags: {}, neighbourRelationship: null,
  instNames: ['town council hall', 'guild hall'], priorities: {}, tier: 'town',
  governingFaction: COUNCIL, hasNobleInstitution: false,
  stressTypes: ['politically_fractured'], fallbackStressType: null,
}).recentConflict)();

describe('the composed governance paragraph', () => {
  it('a record with two estranged powers NAMES them, the seat first, the causes before the band', () => {
    const s = planted({
      relationships: [
        { pair: [COUNCIL, "Thieves' Guild"], type: 'corrupted', captureState: 'corrupted' },
        { pair: [COUNCIL, 'Religious Authorities'], type: 'tense' },
        { pair: [COUNCIL, 'Merchant Guilds'], type: 'dependent' },
      ],
      recentConflict: FRACTURED_VIGNETTE,
    });
    const g = governanceAccountOf(s);
    expect(g.estranged.map((e) => e.name)).toEqual(["Thieves' Guild", 'Religious Authorities']);
    expect(g.fallback, 'the vignette is the fallback only where no estranged power is named').toBe(false);
    expect(g.text).toBe(
      'Polaovo is governed by the Corrupt Council, and Boleslav Davydov, the first councillor, holds its seat. '
      + 'Poverty and crime have cost the Corrupt Council its standing, and few in Polaovo still accept its right to rule. '
      + "The Thieves' Guild has bought people inside the hall. "
      + 'The Religious Authorities are at odds with it. '
      + 'The hall still sits, but its arrests and its offices are no longer its own to give.',
    );
    expect(g.text.startsWith('Polaovo is governed by the Corrupt Council, and Boleslav Davydov')).toBe(true);
    expect(g.text).not.toMatch(/faction/i);
    expect(g.text).not.toMatch(/two of the|the gap widens|does not occupy|rather than being overthrown/i);
  });

  it('a record that names no estranged power takes the vignette as the fallback', () => {
    const g = governanceAccountOf(planted({
      relationships: [{ pair: [COUNCIL, 'Merchant Guilds'], type: 'dependent' }],
      recentConflict: FRACTURED_VIGNETTE,
    }));
    expect(g.estranged).toEqual([]);
    expect(g.fallback).toBe(true);
    expect(g.text.endsWith(FRACTURED_VIGNETTE)).toBe(true);
  });

  it('a vacant seat and an unrecorded one are said plainly; no governing power is silence', () => {
    const vacant = planted();
    vacant.powerStructure.factions[0].modifiers = ['vacant'];
    expect(governanceAccountOf(vacant).text.startsWith('Polaovo is governed by the Corrupt Council, but its seat stands empty.')).toBe(true);
    const unrecorded = { ...planted(), npcs: [] };
    expect(governanceAccountOf(unrecorded).text.startsWith('Polaovo is governed by the Corrupt Council, and the record names no one in its seat.')).toBe(true);
    expect(governanceAccountOf({ name: 'Nowhere', powerStructure: { factions: [] } })).toBeNull();
    expect(governanceAccountOf(null)).toBeNull();
  });

  it('the band reads its own direction: adverse causes for the low bands, favourable for the high', () => {
    expect(legitimacyCausesOf({ prosperity: -20, safety: -12, defense: -1, food: 0 }, true)).toEqual(['poverty', 'crime']);
    expect(legitimacyCausesOf({ prosperity: 8, safety: 3, defense: 9, food: -2 }, false)).toEqual(['strong defences', 'prosperity']);
    expect(legitimacyCausesOf({ prosperity: 0, safety: 0 }, true)).toEqual([]);
    const endorsed = governanceAccountOf(planted({ label: 'Endorsed', breakdown: { prosperity: 10, safety: 5, defense: 0, food: 0 } }));
    expect(endorsed.text).toContain('Prosperity and safety have won the Corrupt Council the backing of Polaovo.');
    const tolerated = governanceAccountOf(planted({ label: 'Tolerated', breakdown: { prosperity: 0, safety: -4, defense: 0, food: 0 } }));
    expect(tolerated.text).toContain('Crime keeps Polaovo from more than tolerating the Corrupt Council.');
  });

  it('names read as prose carries them, and agree with their verbs', () => {
    expect(powerNameInProse('Merchant Guilds (dominant)')).toBe('the Merchant Guilds');
    expect(powerNameInProse('The Highborn Circle')).toBe('the Highborn Circle');
    expect(powerNameInProse("Thieves' Guild", true)).toBe("The Thieves' Guild");
    expect(pluralPowerName('Religious Authorities')).toBe(true);
    expect(pluralPowerName('Noble Houses')).toBe(true);
    expect(pluralPowerName("Thieves' Guild")).toBe(false);
    expect(pluralPowerName('Landed Gentry')).toBe(false);
    expect(pluralPowerName('Military/Guard')).toBe(false);
  });

  it('one entry per power, its gravest tie kept; ties not with the ruler are not estrangement', () => {
    const s = planted({
      relationships: [
        { pair: [COUNCIL, "Thieves' Guild"], type: 'tense' },
        { pair: ["Thieves' Guild", COUNCIL], type: 'corrupted', captureState: 'capture' },
        { pair: ['Merchant Guilds', 'Religious Authorities'], type: 'competitive' },
      ],
    });
    expect(estrangedPowersOf(s, COUNCIL)).toEqual([{ name: "Thieves' Guild", tie: 'capture' }]);
  });
});

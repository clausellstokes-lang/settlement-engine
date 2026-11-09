/**
 * governanceAccount.test.js — OWNER-WORDS-DOSSIER item 3 (the owner, 2026-11-09: "The governance
 * description itself seemed disconnected and not to our standard wouldn't you agree?"). The Power tab's
 * governance block is ONE composed paragraph read off the record: the seat by name and title, the
 * legitimacy band with its named causes, the powers that have broken with the ruler NAMED, the
 * consequence in plain words, and the generator's vignette only where no estranged power is named.
 */
import { describe, it, expect } from 'vitest';
import {
  governanceAccountOf, estrangedPowersOf, legitimacyCausesOf, powerNameInProse, pluralPowerName, arrangementOf,
} from '../../src/domain/display/governanceAccount.js';
import { buildGovernanceLabels } from '../../src/generators/power/governanceNarrative.js';
import { applyStressEventFactions } from '../../src/generators/power/stressFactions.js';

const COUNCIL = 'Corrupt Council';
const SEAT = {
  id: 'npc_seat', name: 'Boleslav Davydov', role: 'the first councillor', category: 'government',
  memberships: [{ power: COUNCIL, rank: 1 }],
};

/** A planted record: the council governs; its ties to the other powers are the case's own. */
function planted({ relationships = [], recentConflict = null, label = 'Legitimacy Crisis', breakdown = { prosperity: -20, safety: -12, defense: -1, food: 0 }, stress = [] } = {}) {
  return {
    id: 'settlement.polaovo', name: 'Polaovo', tier: 'town', npcs: [SEAT], stress: stress.map((type) => ({ type })),
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

const FAMINE_VIGNETTE = 'Food is short, and every quarrel in the settlement has grown sharper for it. Those with stocks are not advertising the fact. Those without are watching those with.';
const TWO_ESTRANGED = [
  { pair: [COUNCIL, "Thieves' Guild"], type: 'corrupted', captureState: 'corrupted' },
  { pair: [COUNCIL, 'Religious Authorities'], type: 'tense' },
];

describe('the stress vignette is the event sentence (the chair\'s ruling on the STOP, 2026-11-09)', () => {
  it('a famine town with two estranged powers prints the names AND the famine vignette, the vignette last', () => {
    const g = governanceAccountOf(planted({ relationships: TWO_ESTRANGED, recentConflict: FAMINE_VIGNETTE, stress: ['famine'] }));
    expect(g.text).toContain("The Thieves' Guild");
    expect(g.text).toContain('Religious Authorities');
    expect(g.text.endsWith(FAMINE_VIGNETTE)).toBe(true);
  });

  it('a fractured town with names prints the names and NOT the fractured line', () => {
    const g = governanceAccountOf(planted({ relationships: TWO_ESTRANGED, recentConflict: FRACTURED_VIGNETTE, stress: ['politically_fractured'] }));
    expect(g.text).toContain("The Thieves' Guild");
    expect(g.text).not.toContain(FRACTURED_VIGNETTE.slice(0, 30));
  });

  it('a fractured town under a graver stress closes on THAT stress\'s vignette (the vignette is the primary stress\'s)', () => {
    const g = governanceAccountOf(planted({ relationships: TWO_ESTRANGED, recentConflict: FAMINE_VIGNETTE, stress: ['politically_fractured', 'famine'] }));
    expect(g.text.endsWith(FAMINE_VIGNETTE)).toBe(true);
  });
});

describe('the chair\'s conditions (b) and (c), 2026-11-09', () => {
  it('(b) a vacant seat is the FIRST fact, and what fills the gap follows from the record', () => {
    const vacant = planted();
    vacant.powerStructure.factions[0].modifiers = ['vacant'];
    const g = governanceAccountOf(vacant);
    expect(g.text.startsWith('No one holds the seat at Polaovo. Until it is filled, the Corrupt Council governs without a head.')).toBe(true);
    vacant.powerStructure.factions.push({ faction: 'Noble Claimant Ivo', power: 10 }, { faction: 'Noble Claimant Mira', power: 9 });
    expect(governanceAccountOf(vacant).text.startsWith('No one holds the seat at Polaovo. Noble Claimant Ivo and Noble Claimant Mira contend for it.')).toBe(true);
  });

  it('(c) a fractured town NAMES the blocs the stress added, even with no relationship row, and drops the fractured line', () => {
    // The blocs as the generator itself adds them (stressFactions.js :: applyStressEventFactions).
    const factions = [{ faction: COUNCIL, power: 50, isGoverning: true, category: 'government' }];
    applyStressEventFactions(factions, (t) => t === 'politically_fractured', COUNCIL, false, {}, [], []);
    const blocs = factions.filter((f) => !f.isGoverning).map((f) => f.faction);
    expect(blocs.length, 'fixture premise: the stress added its blocs').toBeGreaterThanOrEqual(2);
    const s = planted({ recentConflict: FRACTURED_VIGNETTE, stress: ['politically_fractured'] });
    s.powerStructure.factions = factions;
    const g = governanceAccountOf(s);
    for (const name of blocs) expect(g.text).toContain(powerNameInProse(name, true).replace(/^The /, ''));
    expect(g.text).toContain('the right to rule by other means');
    expect(g.text).toContain('Each side makes its own decisions now, and the others overturn them within days.');
    expect(g.text, 'the fractured line is replaced by the names').not.toContain(FRACTURED_VIGNETTE.slice(0, 30));
    expect(g.fallback).toBe(false);
  });

  it('(c) the royal pair is named too', () => {
    const factions = [{ faction: 'Royal Authority', power: 50, isGoverning: true, category: 'government' }];
    applyStressEventFactions(factions, (t) => t === 'politically_fractured', 'Royal Authority', false, {}, [], []);
    const s = planted({ stress: ['politically_fractured'] });
    s.powerStructure.factions = factions;
    s.npcs = [];
    const g = governanceAccountOf(s);
    expect(g.text).toContain('The Loyalist Noble Bloc backs the crown for as long as its favours last.');
    expect(g.text).toContain('The Reform Noble Bloc wants the old obligations renegotiated, and no longer cooperates.');
  });
});

describe('the chair\'s condition (e), 2026-11-09: seed-chosen arrangements of the same facts', () => {
  const seeded = (seed) => {
    const s = planted({ relationships: TWO_ESTRANGED });
    s._seed = seed;
    return governanceAccountOf(s).text;
  };
  it('one seed reads one arrangement, every time', () => {
    expect(seeded('alpha')).toBe(seeded('alpha'));
    expect(arrangementOf('alpha', 'seat', 3)).toBe(arrangementOf('alpha', 'seat', 3));
  });
  it('across seeds the frames vary, and every arrangement carries the same facts', () => {
    const texts = new Set();
    for (let i = 0; i < 40; i += 1) {
      const t = seeded(`seed-${i}`);
      texts.add(t);
      for (const fact of ['Polaovo', 'Corrupt Council', 'Boleslav Davydov', 'the first councillor', 'poverty', 'crime', "Thieves' Guild", 'Religious Authorities', 'arrests', 'offices']) {
        expect(t.toLowerCase(), `seed-${i} lost "${fact}"`).toContain(fact.toLowerCase());
      }
    }
    expect(texts.size, 'the seed chooses among arrangements').toBeGreaterThan(4);
  });
});

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
      // Re-keyed by condition (e), 2026-11-09: the arrangement this record's seed chooses (identity, not wording loosened).
      'Polaovo is governed by the Corrupt Council, and Boleslav Davydov, the first councillor, holds its seat. '
      + "Few in Polaovo still accept the Corrupt Council's right to rule, now that poverty and crime have cost it its standing. "
      + "The Thieves' Guild has bought people inside the hall. "
      + 'The hall is at odds with the Religious Authorities. '
      + "Its arrests and its offices are no longer the hall's own to give, though it still sits.",
    );
    expect(g.text.startsWith('Polaovo is governed by the Corrupt Council, and Boleslav Davydov')).toBe(true);
    expect(g.text).not.toMatch(/faction/i);
    expect(g.text).not.toMatch(/two of the|the gap widens|does not occupy|rather than being overthrown/i);
  });

  it('a record that names no estranged power takes the vignette as the fallback, and it says "powers"', () => {
    const g = governanceAccountOf(planted({
      relationships: [{ pair: [COUNCIL, 'Merchant Guilds'], type: 'dependent' }],
      recentConflict: FRACTURED_VIGNETTE,
    }));
    expect(g.estranged).toEqual([]);
    expect(g.fallback).toBe(true);
    expect(g.text.endsWith(FRACTURED_VIGNETTE)).toBe(true);
    // OWNER-WORDS-DOSSIER item 3b: the generator's vignettes retire the word "faction" for "power".
    expect(g.text).toMatch(/\bpowers\b/);
    expect(g.text).not.toMatch(/faction/i);
  });

  it('no governance vignette the generator can write carries the retired word', () => {
    const base = {
      factions: [{ faction: COUNCIL, power: 30, isGoverning: true }], config: {}, stressFlags: {}, instFlags: {},
      neighbourRelationship: null, priorities: {}, tier: 'town', hasNobleInstitution: false, fallbackStressType: null,
    };
    const cases = [
      { instNames: ['town council hall'], governingFaction: COUNCIL, stressTypes: ['politically_fractured'] },
      { instNames: [], governingFaction: COUNCIL, stressTypes: ['politically_fractured'] },
      { instNames: [], governingFaction: 'Royal Authority', stressTypes: ['succession_void'] },
      { instNames: ['town council hall'], governingFaction: COUNCIL, stressTypes: ['succession_void'] },
    ];
    for (const c of cases) {
      const { recentConflict } = buildGovernanceLabels({ ...base, ...c });
      expect(recentConflict, `${c.stressTypes[0]} drew a vignette`).toBeTruthy();
      expect(recentConflict, `${c.stressTypes[0]} / ${c.governingFaction}`).not.toMatch(/faction/i);
    }
  });

  it('a vacant seat and an unrecorded one are said plainly; no governing power is silence', () => {
    const vacant = planted();
    vacant.powerStructure.factions[0].modifiers = ['vacant'];
    expect(governanceAccountOf(vacant).text.startsWith('No one holds the seat at Polaovo.')).toBe(true); // re-keyed by condition (b), 2026-11-09
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

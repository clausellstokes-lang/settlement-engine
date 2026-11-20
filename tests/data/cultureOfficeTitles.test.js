/**
 * cultureOfficeTitles.test.js — TITLES-1 (the seventh chair's CT1–CT6, 2026-11-20): the table of an office's title by
 * family, size and culture (src/data/cultureOfficeTitles.js) and its resolvers. Every expected word a literal.
 * The three laws each have a planted red on record (TITLES-1-HANDBACK.md): a crown word in a council's cell, a missing
 * cell that does not fall back, a sacred word in a criminal cell.
 */
import { describe, expect, it } from 'vitest';
import {
  BASE_OFFICE_TITLES, CRIME_BOSSES_HEADING, crimeBossesHeading, CULTURE_OFFICE_TITLES, CULTURE_OFFICE_WORDS,
  GOVERNMENT_FAMILY, OFFICE_FAMILIES, OFFICE_TIERS, officeFamilyOfForm, officeTitleIn, officeTitleOf, officeWordInfo,
  TODAY_FAMILIES, todayOfficeTitle,
} from '../../src/data/cultureOfficeTitles.js';
import { OFFICE_TITLES } from '../../src/data/officeTitles.js';
import { CULTURE_PROFILE_KEYS } from '../../src/data/cultureProfiles.js';
import { APPOINTED_GOVERNMENTS, officeTitleFor } from '../../src/generators/people/representatives.js';
import { GOVERNMENT_PREFERENCES } from '../../src/domain/rulingPower.js';
import { SEX_NAMED_WORDS } from '../helpers/peopleKinds.js';

/** Every cell of the table, with where it sits. */
const CELLS = [
  ...Object.entries(BASE_OFFICE_TITLES).flatMap(([family, rungs]) => Object.entries(rungs).map(([tier, cell]) => ({ culture: 'base', family, tier, cell }))),
  ...Object.entries(CULTURE_OFFICE_TITLES).flatMap(([culture, rows]) => Object.entries(rows).flatMap(([family, rungs]) =>
    Object.entries(rungs).map(([tier, cell]) => ({ culture, family, tier, cell })))),
];
/** @param {any} cell */
const formsOf = (cell) => (typeof cell === 'string' ? [cell] : [cell.male, cell.female]);

/** CT3: the crown words (a sovereign's, in every culture's own word) — held by the sovereign row alone. */
const CROWN = /\b(king|queen|emperor|empress|kaiser|kaiserin|könig|königin|graf|gräfin|tsar|tsaritsa|knyaz|knyaginya|sultan|sultana|emir|emira|khan|khatun|khagan|rex|regina|imperator|imperatrix|princeps|raja|rani|maharaja|maharani|samrat|samrajni|basileus|basilissa|tlatoani|daimyo|shogun|monarch|lord|lady|caliph)\b/i;

/** CT4: a living or revived faith's sacred or prophetic title (the chair: a revived faith counts as living). */
const SACRED = /\b(caliph|imam|mufti|ayatollah|mullah|sheikh al-islam|pope|pontifex|flamen|cardinal|bishop|archbishop|patriarch|eparch|exarch|rabbi|lama|guru|purohit|brahmin|pandit|godi|goði|gydja|gyðja|volva|völva|druid|hierophant|shaman|volkhv|prophet|messiah|mahdi|saint|abbot|abbess|priest|priestess|tlamacazqui|onmyoji)\b/i;

/** Every government name the engine writes: today's table, the appointed ten, the coup path's, the generator's rest. */
const ENGINE_NAMES = [...new Set([
  ...Object.keys(OFFICE_TITLES), ...APPOINTED_GOVERNMENTS,
  ...Object.values(GOVERNMENT_PREFERENCES).flatMap((row) => Object.values(row)),
  'Mixed Council', 'Corrupt Oligarchy', 'Shadowed Council', 'Democratic assembly', 'City-State Council', 'Garrison Command',
])];

describe('TITLES-1 · the table\'s shape', () => {
  it('every culture is a culture the engine names, every family one of the thirteen, every size one of the six', () => {
    for (const culture of Object.keys(CULTURE_OFFICE_TITLES)) expect(CULTURE_PROFILE_KEYS).toContain(culture);
    expect(Object.keys(CULTURE_OFFICE_TITLES).sort()).toEqual([...CULTURE_PROFILE_KEYS].sort());
    for (const { family, tier } of CELLS) {
      expect(OFFICE_FAMILIES).toContain(family);
      expect(OFFICE_TIERS).toContain(tier);
    }
    expect(OFFICE_FAMILIES).toHaveLength(13);
    expect(CELLS.length).toBeGreaterThan(150);
  });

  it('every cell is a plain word a DM can say: a non-empty trimmed string, or a pair of two different ones', () => {
    for (const { cell } of CELLS) {
      for (const form of formsOf(cell)) {
        expect(typeof form).toBe('string');
        expect(form).toBe(form.trim());
        expect(form.length).toBeGreaterThan(1);
        expect(form.split(/\s+/).length).toBeLessThanOrEqual(4);
      }
      if (typeof cell !== 'string') expect(cell.male).not.toBe(cell.female);
    }
  });

  it('no culture holds a faith row (CT4) or a criminal row (the chair\'s hold pending the owner)', () => {
    expect(Object.keys(CULTURE_OFFICE_TITLES)).toHaveLength(11);
    for (const rows of Object.values(CULTURE_OFFICE_TITLES)) {
      expect(Object.keys(rows)).toContain('sovereign');
      expect(Object.keys(rows)).not.toContain('faith'); // anchored: the same keys hold 'sovereign' (asserted above), for all eleven cultures
      expect(Object.keys(rows)).not.toContain('underboss'); // anchored: the same keys hold 'sovereign' (asserted above), for all eleven cultures
      expect(Object.keys(rows)).not.toContain('crime_boss'); // anchored: the same keys hold 'sovereign' (asserted above), for all eleven cultures
    }
  });
});

describe('TITLES-1 · CT2, every name the engine writes has its family', () => {
  it('the fifty-eight names, each in one family; no name falls through', () => {
    expect(Object.keys(GOVERNMENT_FAMILY)).toHaveLength(58);
    for (const name of ENGINE_NAMES) expect(officeFamilyOfForm(name), name).not.toBeNull();
    for (const family of Object.values(GOVERNMENT_FAMILY)) expect(OFFICE_FAMILIES).toContain(family);
    expect(officeFamilyOfForm('Town Mayor')).toBe('headman');
    expect(officeFamilyOfForm('Royal Authority')).toBe('appointed');
    expect(officeFamilyOfForm('City-State Council')).toBe('council');
    expect(officeFamilyOfForm('Grand Merchant Senate')).toBe('merchant');
    expect(officeFamilyOfForm("Guildmasters' Moot")).toBe('guild');
    expect(officeFamilyOfForm('Shadow Senate')).toBe('underboss');
    expect(officeFamilyOfForm('A DM\'s Own Seat')).toBeNull();
  });
  it('no name maps to the sovereign family: the seat\'s form decides it, never its name', () => {
    expect(Object.values(GOVERNMENT_FAMILY)).toContain('headman');
    expect(Object.values(GOVERNMENT_FAMILY)).not.toContain('sovereign'); // anchored: the same values hold 'headman' (the line above) and all 58 names (the test above)
  });
});

describe('TITLES-1 · CT3, a crown word belongs to the ruler who answers to no one', () => {
  it('every cell holding a crown word sits in the sovereign row', () => {
    const misplaced = CELLS.filter(({ family, cell }) => family !== 'sovereign' && formsOf(cell).some((f) => CROWN.test(f)));
    expect(misplaced.map(({ culture, family, tier, cell }) => `${culture}.${family}.${tier} ${JSON.stringify(cell)}`)).toEqual([]);
  });
  it('the sovereign switch is read for the headman alone: a council\'s first or a ruler sent by another never takes it', () => {
    expect(officeTitleOf({ family: 'headman', tier: 'city', culture: 'norse', sovereign: true, sex: 'male' })).toBe('King');
    expect(officeTitleOf({ family: 'headman', tier: 'city', culture: 'norse', sovereign: false })).toBe('Jarl');
    expect(officeTitleOf({ family: 'council', tier: 'city', culture: 'norse', sovereign: true })).toBe('Lawspeaker');
    expect(officeTitleOf({ family: 'appointed', tier: 'city', culture: 'norse', sovereign: true })).toBe('Jarl');
    expect(officeTitleOf({ family: 'appointed', tier: 'city', culture: 'latin', sovereign: true })).toBe('Legate');
  });
  it('the owner\'s ladder: a jarl at a village or town, a king at a city, two steps above a jarl at a metropolis', () => {
    const norse = (tier) => officeTitleOf({ family: 'sovereign', tier, culture: 'norse', sex: 'male' });
    expect(['village', 'town', 'city', 'metropolis'].map(norse)).toEqual(['Jarl', 'Jarl', 'King', 'High King']);
    expect(officeTitleOf({ family: 'sovereign', tier: 'metropolis', culture: 'germanic', sex: 'female' })).toBe('Kaiserin');
    expect(officeTitleOf({ family: 'sovereign', tier: 'metropolis', culture: 'mixed', sex: 'male' })).toBe('Emperor');
  });
});

describe('TITLES-1 · CT1, a cell the table does not hold falls back to today\'s title, never a blank', () => {
  const cultures = [...CULTURE_PROFILE_KEYS, 'mixed', null, 'random_culture'];
  it('for the nine families with a title today: the culture\'s word where it has one, else officeTitleFor\'s byte for byte', () => {
    let fellBack = 0;
    for (const culture of cultures) {
      for (const [name, family] of Object.entries(GOVERNMENT_FAMILY)) {
        if (!TODAY_FAMILIES.includes(family)) continue;
        for (const tier of OFFICE_TIERS) {
          const got = officeTitleIn({ family, tier, culture, government: name });
          expect(got.length).toBeGreaterThan(0);
          const own = culture && Object.hasOwn(CULTURE_OFFICE_TITLES, culture) ? CULTURE_OFFICE_TITLES[culture][family]?.[tier] : undefined;
          if (own) expect(got).toBe(typeof own === 'string' ? own : own.male);
          else { expect(got, `${culture} ${name} ${tier}`).toBe(officeTitleFor(name, tier)); fellBack += 1; }
        }
      }
    }
    expect(fellBack).toBeGreaterThan(1000);
  });
  it('the null of the cell read is today\'s, and only for the families that have a title today', () => {
    expect(officeTitleOf({ family: 'faith', tier: 'city', culture: 'arabic' })).toBeNull();
    expect(officeTitleIn({ family: 'faith', tier: 'city', culture: 'arabic', government: 'Ecclesiastical Council' })).toBe('Lord Warden');
    expect(officeTitleIn({ family: 'merchant', tier: 'metropolis', culture: 'norse', government: 'Grand Merchant Senate' })).toBe('Doge');
    expect(officeTitleIn({ family: 'elders', tier: 'hamlet', culture: 'latin', government: null })).toBe('Elder');
    for (const family of ['sovereign', 'appointed', 'underboss', 'crime_boss']) {
      for (const culture of cultures) for (const tier of OFFICE_TIERS) expect(officeTitleOf({ family, tier, culture })).not.toBeNull();
    }
    expect(officeTitleOf({ family: 'no such family', tier: 'town', culture: 'norse' })).toBeNull();
    expect(officeTitleIn({ family: 'no such family', tier: 'town', culture: 'norse', government: 'Town Mayor' })).toBe('Mayor');
    expect(todayOfficeTitle('Not A Government', 'nowhere')).toBe('Mayor');
  });
  it('a culture without a word reads the base ladder, never another culture\'s word', () => {
    expect(officeTitleOf({ family: 'appointed', tier: 'town', culture: 'norse' })).toBe('Governor');
    expect(officeTitleOf({ family: 'sovereign', tier: 'hamlet', culture: 'arabic' })).toBe('Chieftain');
    expect(officeTitleOf({ family: 'sovereign', tier: 'town', culture: 'east_asian' })).toBe('Daimyo');
    expect(officeTitleOf({ family: 'sovereign', tier: 'metropolis', culture: 'east_asian', sex: 'female' })).toBe('Empress');
  });
});

describe('TITLES-1 · CT4, the words', () => {
  it('no cell holds a living or revived faith\'s sacred title; the criminal side least of all', () => {
    const sacred = CELLS.filter(({ cell }) => formsOf(cell).some((f) => SACRED.test(f)));
    expect(sacred.map(({ culture, family, tier, cell }) => `${culture}.${family}.${tier} ${JSON.stringify(cell)}`)).toEqual([]);
    const criminal = CELLS.filter(({ family }) => family === 'underboss' || family === 'crime_boss');
    expect(criminal.length).toBe(12);
  });
  it('a single word names no sex; a pair\'s two forms name their own sex only (the sex walker\'s own lists)', () => {
    const tokens = (/** @type {string} */ t) => t.toLowerCase().split(/[^a-zäöüß'-]+/).flatMap((w) => [w, ...w.split('-')]).filter(Boolean);
    expect(tokens('Lord / Lady')).toEqual(expect.arrayContaining(['lord', 'lady']));
    expect(tokens('Boat-headman')).toContain('headman');
    expect(SEX_NAMED_WORDS.male).toContain('king');
    expect(SEX_NAMED_WORDS.female).toContain('queen');
    for (const { culture, family, tier, cell } of CELLS) {
      const where = `${culture}.${family}.${tier}`;
      if (typeof cell === 'string') {
        // anchored: tokens() is proved to split a title into its words, and both word lists are proved non-empty, above the loop
        for (const w of [...SEX_NAMED_WORDS.male, ...SEX_NAMED_WORDS.female]) expect(tokens(cell), where).not.toContain(w);
      } else {
        expect(tokens(cell.male).length, where).toBeGreaterThan(0);
        // anchored: the male form is proved to hold words (the line above); tokens() and the lists are proved above the loop
        for (const w of SEX_NAMED_WORDS.female) expect(tokens(cell.male), where).not.toContain(w);
        // anchored: the female form is a non-empty string (the shape test) and tokens() is proved above the loop
        for (const w of SEX_NAMED_WORDS.male) expect(tokens(cell.female), where).not.toContain(w);
      }
    }
  });
  it('the holder\'s form: a woman the female word, a man or an unstated sex the male', () => {
    expect(officeTitleOf({ family: 'sovereign', tier: 'metropolis', culture: 'arabic', sex: 'female' })).toBe('Sultana');
    expect(officeTitleOf({ family: 'sovereign', tier: 'metropolis', culture: 'arabic', sex: 'male' })).toBe('Sultan');
    expect(officeTitleOf({ family: 'sovereign', tier: 'metropolis', culture: 'arabic' })).toBe('Sultan');
    expect(officeTitleOf({ family: 'elders', tier: 'village', culture: 'arabic', sex: 'female' })).toBe('Sheikha');
    expect(officeTitleOf({ family: 'headman', tier: 'village', culture: 'norse', sex: 'female' })).toBe('Jarl');
  });
});

describe('TITLES-1 · the criminal side, by size and the same in every culture', () => {
  it('the underboss, each crime boss, and the group card\'s heading', () => {
    for (const culture of [...CULTURE_PROFILE_KEYS, 'mixed']) {
      expect(OFFICE_TIERS.map((tier) => officeTitleOf({ family: 'underboss', tier, culture })))
        .toEqual(['Ringleader', 'Ringleader', 'Underboss', 'Underboss', 'Underboss', 'Underboss']);
      expect(OFFICE_TIERS.map((tier) => officeTitleOf({ family: 'crime_boss', tier, culture }))).toEqual(Array(6).fill('Crime Boss'));
    }
    expect(crimeBossesHeading()).toBe('Crime Bosses');
    expect(CRIME_BOSSES_HEADING).toBe('Crime Bosses');
  });
});

describe('TITLES-1 · officeWordInfo, the reverse read for the readers that match an office by its word', () => {
  it('a crown word, a lord\'s word two rows share, today\'s words, and a word no table writes', () => {
    expect(officeWordInfo('King')).toEqual({ families: ['headman'], sovereign: true, crown: true, sex: 'male' });
    expect(officeWordInfo('kaiserin')).toEqual({ families: ['headman'], sovereign: true, crown: true, sex: 'female' });
    expect(officeWordInfo('Jarl')).toEqual({ families: ['appointed', 'headman'], sovereign: true, crown: false, sex: null });
    expect(officeWordInfo('Lawspeaker')).toEqual({ families: ['assembly', 'council'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('Mayor')).toEqual({ families: ['council', 'headman'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('Doge')).toEqual({ families: ['merchant'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('Monarch')).toEqual({ families: [], sovereign: false, crown: true, sex: null });
    expect(officeWordInfo(' Underboss ')).toEqual({ families: ['underboss'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('Baker')).toBeNull();
    expect(officeWordInfo('')).toBeNull();
    expect(officeWordInfo(undefined)).toBeNull();
  });
  it('every word the table writes is read back, in its family', () => {
    for (const row of CULTURE_OFFICE_WORDS) {
      const info = officeWordInfo(row.word);
      expect(info, row.word).not.toBeNull();
      expect(info?.families).toContain(row.family);
    }
  });
});

describe('TITLES-2 · the cells filled by research (each word\'s gloss and source: TITLES-2-HANDBACK.md)', () => {
  /** culture, family, the six sizes smallest first (null: the fallback), each a literal; a pair is read as its male form */
  const PINNED = [
    ['germanic', 'guild', [null, null, null, 'Zunftmeister', 'Zunftmeister', 'Zunftmeister']],
    ['germanic', 'military', [null, null, null, null, 'Marschall', 'Marschall']],
    ['latin', 'appointed', ['Vilicus', 'Vilicus', 'Vilicus', 'Procurator', 'Legate', 'Proconsul']],
    ['latin', 'headman', [null, null, null, 'Praetor', 'Praetor', 'Praetor']],
    ['celtic', 'appointed', ['Maer', 'Maer', 'Maer', 'Maer', null, null]],
    ['celtic', 'military', [null, null, 'Penteulu', 'Penteulu', 'Penteulu', 'Penteulu']],
    ['arabic', 'council', [null, null, null, "Ra'is", "Ra'is", "Ra'is"]],
    ['arabic', 'military', [null, null, 'Qaid', 'Qaid', 'Amir al-Juyush', 'Amir al-Juyush']],
    ['norse', 'military', [null, null, 'Hersir', 'Hersir', 'Stallari', 'Stallari']],
    ['slavic', 'appointed', ['Tiun', 'Tiun', 'Tiun', 'Namestnik', 'Namestnik', 'Namestnik']],
    ['slavic', 'council', [null, null, null, 'Golova', 'Golova', 'Golova']],
    ['slavic', 'merchant', [null, null, null, 'Gost', 'Gost', 'Gost']],
    ['east_asian', 'headman', ['Nanushi', 'Nanushi', 'Nanushi', 'Toshiyori', 'Toshiyori', 'Toshiyori']],
    ['east_asian', 'council', [null, null, null, 'Toshiyori', 'Toshiyori', 'Tairo']],
    ['east_asian', 'elders', [null, null, null, 'Toshiyori', 'Toshiyori', 'Toshiyori']],
    ['east_asian', 'military', [null, null, 'Kumigashira', 'Obangashira', 'Obangashira', 'Obangashira']],
    ['mesoamerican', 'military', [null, null, null, 'Tlacateccatl', 'Tlacateccatl', 'Tlacateccatl']],
    ['south_asian', 'elders', ['Sarpanch', 'Sarpanch', 'Sarpanch', 'Sarpanch', null, null]],
    ['south_asian', 'guild', [null, null, null, 'Jetthaka', 'Jetthaka', 'Jetthaka']],
    ['steppe', 'headman', [null, null, 'Beg', 'Beg', 'Beg', 'Beg']],
    ['steppe', 'council', [null, null, null, 'Biy', 'Biy', 'Biy']],
    ['steppe', 'elders', ['Biy', 'Biy', 'Biy', 'Biy', 'Biy', 'Biy']],
  ];

  it('each filled row reads its words at its sizes, and a size left open reads the fallback (today\'s title or the base ladder)', () => {
    expect(PINNED).toHaveLength(22);
    for (const [culture, family, rungs] of PINNED) {
      OFFICE_TIERS.forEach((tier, i) => {
        const got = officeTitleOf({ family, tier, culture, sex: 'male' });
        if (rungs[i] !== null) expect(got, `${culture}.${family}.${tier}`).toBe(rungs[i]);
        else if (TODAY_FAMILIES.includes(family)) expect(got, `${culture}.${family}.${tier}`).toBeNull();
        else expect(got, `${culture}.${family}.${tier}`).toBe(officeTitleOf({ family, tier, culture: null, sex: 'male' }));
      });
    }
    expect(officeTitleIn({ family: 'military', tier: 'town', culture: 'germanic', government: 'Militia Command' })).toBe('Captain of the Muster');
    expect(officeTitleIn({ family: 'appointed', tier: 'city', culture: 'celtic' })).toBe('Governor');
  });

  it('the forms by sex, and the reverse read of the new words for SEAT-1', () => {
    expect(officeTitleOf({ family: 'appointed', tier: 'hamlet', culture: 'latin', sex: 'female' })).toBe('Vilica');
    expect(officeTitleOf({ family: 'headman', tier: 'town', culture: 'steppe', sex: 'female' })).toBe('Begim');
    expect(officeTitleOf({ family: 'headman', tier: 'town', culture: 'steppe' })).toBe('Beg');
    expect(officeTitleOf({ family: 'headman', tier: 'city', culture: 'steppe', sovereign: true, sex: 'female' })).toBe('Khatun');
    expect(officeWordInfo("Ra'is")).toEqual({ families: ['council', 'headman'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('Toshiyori')).toEqual({ families: ['council', 'elders', 'headman'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('Biy')).toEqual({ families: ['council', 'elders'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('Begim')).toEqual({ families: ['headman'], sovereign: false, crown: false, sex: 'female' });
    expect(officeWordInfo('Vilicus')).toEqual({ families: ['appointed'], sovereign: false, crown: false, sex: 'male' });
    expect(officeWordInfo('Amir al-Juyush')).toEqual({ families: ['military'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('praetor')).toEqual({ families: ['headman'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('Podestà')).toBeNull();
  });
});

describe('TITLES-3 · the small places\' elders and headman (each word\'s gloss and source: TITLES-3-HANDBACK.md)', () => {
  /** culture, family, the six sizes smallest first (null: the fallback), each a literal; a pair is read as its male form */
  const PINNED = [
    ['germanic', 'headman', ['Bauermeister', 'Bauermeister', 'Schultheiss', 'Burgomaster', 'Burgomaster', 'Burgomaster']],
    ['greek', 'headman', ['Komarch', 'Komarch', 'Demarch', 'Demarch', 'Demarch', 'Demarch']],
    ['celtic', 'headman', ['Pencenedl', 'Pencenedl', 'Chieftain', 'Chieftain', null, null]],
    ['mesoamerican', 'headman', ['Calpullec', 'Calpullec', 'Calpullec', 'Calpullec', null, null]],
    ['mesoamerican', 'elders', ['Huehue', 'Huehue', 'Huehue', 'Huehue', null, null]],
  ];
  /** the target cells left on the fallback on purpose (TITLES-3-HANDBACK.md §3 says what would settle each) */
  const LEFT = [
    ...['germanic', 'latin', 'celtic', 'norse', 'greek'].flatMap((culture) =>
      ['thorp', 'hamlet', 'village', 'town'].map((tier) => [culture, 'elders', tier])),
    ['norse', 'headman', 'thorp'], ['norse', 'headman', 'hamlet'],
    ['latin', 'headman', 'thorp'], ['latin', 'headman', 'hamlet'], ['latin', 'headman', 'village'],
    ['mesoamerican', 'council', 'town'],
  ];

  it('each filled row reads its words at its sizes; each target cell left open reads today\'s title', () => {
    expect(PINNED).toHaveLength(5);
    for (const [culture, family, rungs] of PINNED) {
      OFFICE_TIERS.forEach((tier, i) => {
        const got = officeTitleOf({ family, tier, culture, sex: 'male' });
        if (rungs[i] !== null) expect(got, `${culture}.${family}.${tier}`).toBe(rungs[i]);
        else expect(got, `${culture}.${family}.${tier}`).toBeNull();
      });
    }
    expect(LEFT).toHaveLength(26);
    for (const [culture, family, tier] of LEFT) expect(officeTitleOf({ family, tier, culture }), `${culture}.${family}.${tier}`).toBeNull();
    expect(officeTitleIn({ family: 'elders', tier: 'hamlet', culture: 'norse', government: 'Elder Council' })).toBe('Elder');
    expect(officeTitleIn({ family: 'headman', tier: 'thorp', culture: 'norse', government: "Headman's Authority" })).toBe('Headman');
    expect(officeTitleIn({ family: 'headman', tier: 'hamlet', culture: 'greek', government: 'Elected Reeve' })).toBe('Komarch');
    expect(officeTitleIn({ family: 'elders', tier: 'thorp', culture: 'mesoamerican', government: 'Household Council' })).toBe('Huehue');
  });

  it('the forms by sex, and the reverse read of the new words for SEAT-1', () => {
    expect(officeTitleOf({ family: 'elders', tier: 'village', culture: 'mesoamerican', sex: 'female' })).toBe('Ilama');
    expect(officeTitleOf({ family: 'elders', tier: 'village', culture: 'mesoamerican' })).toBe('Huehue');
    expect(officeTitleOf({ family: 'headman', tier: 'hamlet', culture: 'germanic', sex: 'female' })).toBe('Bauermeister');
    expect(officeTitleOf({ family: 'headman', tier: 'hamlet', culture: 'greek', sovereign: true })).toBe('Chieftain');
    expect(officeWordInfo('Huehue')).toEqual({ families: ['elders'], sovereign: false, crown: false, sex: 'male' });
    expect(officeWordInfo('Ilama')).toEqual({ families: ['elders'], sovereign: false, crown: false, sex: 'female' });
    expect(officeWordInfo('Calpullec')).toEqual({ families: ['headman'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('komarch')).toEqual({ families: ['headman'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('Bauermeister')).toEqual({ families: ['headman'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('Pencenedl')).toEqual({ families: ['headman'], sovereign: false, crown: false, sex: null });
    expect(officeWordInfo('Geron')).toBeNull();
  });
});

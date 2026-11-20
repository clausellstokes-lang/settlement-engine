/**
 * data/cultureOfficeTitles.js — WHAT THIS OFFICE IS CALLED HERE: an office's title by its FAMILY, the place's SIZE and its
 * CULTURE (TITLES-1, the seventh chair's rulings CT1–CT6 of 2026-11-20 on the owner's word of the same day, vetoable by
 * the owner: "for all of the titles that you have made for official and criminal, there needs to be appropriate
 * variations according to both tier and culture. Like a jarl instead of a mayor for one example for a village or town,
 * that upgrades to a king or emperor for a city or metropolis"). The proposal, the sample page and every cell's reason:
 * docs/chair/2026-11-20/content/titles/TITLES-1-PROPOSAL.md and TITLES-1-HANDBACK.md.
 *
 * NEW FILE, NO READER EDITED (CT1): today's table (data/officeTitles.js) is read, never changed. SEAT-1 calls this
 * resolver under its own birth law, so a saved town keeps the title it was born with.
 *
 * THE LAWS OF THE CELLS (CT3, CT4):
 *   • A crown word (a king, an emperor, each culture's own) sits ONLY in the `sovereign` row, the single ruler who
 *     answers to no one, and only from the size where it reads true. A council's first takes its council word; a ruler
 *     sent by another stays a governor in that culture's word.
 *   • No living or revived faith's sacred or prophetic title, anywhere (the chair: a revived faith counts as living), so
 *     every culture's `faith` row is left to today's title; never a sacred word on the criminal side.
 *   • A word that names a sex is a pair `{ male, female }`; a single word fits any holder.
 *   • A cell this table does not hold FALLS BACK: to today's title for the nine families that have one today, to the
 *     BASE ladder for the four that do not. Never a blank, never another culture's word.
 *   • The criminal side varies by SIZE and not by culture until the owner rules (the chair, 2026-11-20).
 * TITLES-2 (the same day, the second pass) filled the commonest fallback cells with words read in a named source; every
 * word's gloss and source: docs/chair/2026-11-20/content/titles/TITLES-2-HANDBACK.md. A cell marked "TITLES-2" is its.
 * TITLES-3 (the same day, the third pass) filled the small places' elders and headman where a culture has a sourced
 * small word; every word's gloss, say-it hint and source: docs/chair/2026-11-20/content/titles/TITLES-3-HANDBACK.md.
 * Pure data and its resolvers; no draw.
 */

import { CIVIC_OFFICE_BY_SIZE, OFFICE_TITLES } from './officeTitles.js';

/** @typedef {string | Readonly<{ male: string, female: string }>} OfficeCell */
/** @typedef {Readonly<Partial<Record<string, OfficeCell>>>} OfficeLadder tier → cell; an absent tier falls back */
/** @typedef {'thorp' | 'hamlet' | 'village' | 'town' | 'city' | 'metropolis'} OfficeTier */

/** The six sizes, smallest first. @type {ReadonlyArray<OfficeTier>} */
export const OFFICE_TIERS = Object.freeze(/** @type {OfficeTier[]} */ (['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']));

/**
 * The thirteen office families (the heading of the group card is the fourteenth row, CRIME_BOSSES_HEADING):
 *   sovereign   the single ruler who answers to no one (SEAT-1 assigns it by the seat's form: no government name means it)
 *   appointed   the single ruler SENT by another (a governor, a steward)
 *   headman     the single head the place puts up itself, who may stand under a crown (a mayor, a reeve, a headman)
 *   council     the first of a council          assembly   the speaker of an assembly
 *   elders      the first of the elders         merchant   the first of a merchant seat
 *   guild       the first of a craft-guild seat faith      the first of a faith's seat
 *   military    the first of a military seat    arcane     the first of an arcane seat
 *   underboss   the single figure behind a seat criminals have captured (the owner's word)
 *   crime_boss  each of the top three on the group card, where a group holds it
 * @type {ReadonlyArray<string>}
 */
export const OFFICE_FAMILIES = Object.freeze(['sovereign', 'appointed', 'headman', 'council', 'assembly', 'elders',
  'merchant', 'guild', 'faith', 'military', 'arcane', 'underboss', 'crime_boss']);

/** The families with a title today: a cell this table does not hold reads today's (officeTitles.js). */
export const TODAY_FAMILIES = Object.freeze(['headman', 'council', 'assembly', 'elders', 'merchant', 'guild', 'faith', 'military', 'arcane']);

/** The heading of the criminals' group card, in every culture and at every size (the owner's word, 2026-11-20). */
export const CRIME_BOSSES_HEADING = 'Crime Bosses';

/** Both forms of a word that names a sex. @param {string} male @param {string} female @returns {OfficeCell} */
const pair = (male, female) => Object.freeze({ male, female });

/**
 * A ladder from the six sizes, smallest first; `null` leaves that size to the fallback.
 * @param {...(OfficeCell | null)} cells thorp, hamlet, village, town, city, metropolis @returns {OfficeLadder}
 */
const ladder = (...cells) => {
  /** @type {Record<string, OfficeCell>} */
  const out = {};
  OFFICE_TIERS.forEach((tier, i) => { const cell = cells[i]; if (cell) out[tier] = cell; });
  return Object.freeze(out);
};

/**
 * EVERY GOVERNMENT NAME THE ENGINE WRITES, BY FAMILY (58: the 39 of officeTitles.js :: OFFICE_TITLES; the ten of
 * representatives.js :: APPOINTED_GOVERNMENTS; the criminal five; the three assemblies and the mixed council of
 * rulingStructure.js and rulingPower.js :: GOVERNMENT_PREFERENCES). A criminal name maps to `underboss`: SEAT-1 shows
 * the group card (CRIME_BOSSES_HEADING) instead where more than one person holds the seat.
 * @type {Readonly<Record<string, string>>}
 */
export const GOVERNMENT_FAMILY = Object.freeze({
  // appointed: sent by another
  'Royal Authority': 'appointed', 'Noble Governorship': 'appointed', 'Ducal Governorship': 'appointed',
  'Feudal Stewardship': 'appointed', 'Feudal Appointee': 'appointed', 'Noble Regency': 'appointed',
  'Foreign Stewardship': 'appointed', 'Foreign Administration': 'appointed', 'Occupation Authority': 'appointed',
  'Martial Administration': 'appointed',
  // headman: the place's own single head
  'Town Mayor': 'headman', 'Elected Reeve': 'headman', "Headman's Authority": 'headman',
  // council
  'Town Council': 'council', 'City Council': 'council', 'Grand Council': 'council', 'City-State Council': 'council',
  'Mixed Council': 'council',
  // assembly
  'Democratic assembly': 'assembly', 'Commons Assembly': 'assembly', "Workers' Assembly": 'assembly',
  'Grand Commons Assembly': 'assembly',
  // elders
  'Elder Council': 'elders', 'Free Elder Council': 'elders', 'Elder Consensus': 'elders', 'Household Council': 'elders',
  // merchant
  'Merchant Council': 'merchant', 'Merchant City Council': 'merchant', 'Grand Merchant Senate': 'merchant',
  'Merchant oligarchy': 'merchant', 'Grand Merchant Oligarchy': 'merchant', 'Merchant Guild Council': 'merchant',
  'Grand Guild Consortium': 'merchant',
  // guild
  'Guild Council': 'guild', 'Guild Authority': 'guild', 'Grand Guild Council': 'guild', "Guildmasters' Moot": 'guild',
  'Guildhall Council': 'guild', 'Grand Guild Assembly': 'guild',
  // faith
  'Priestly Guidance': 'faith', 'Church Council': 'faith', 'Ecclesiastical Council': 'faith',
  'Theocratic Council': 'faith', 'High Theocratic Council': 'faith',
  // military
  'Militia Command': 'military', 'Military Council': 'military', 'Military City Council': 'military',
  'Grand Military Council': 'military', 'Garrison Command': 'military',
  // arcane
  'Circle of Adepts': 'arcane', 'Arcane Council': 'arcane', 'Arcane Senate': 'arcane', 'Grand Arcane Council': 'arcane',
  // criminal: a captured seat
  'Corrupt Council': 'underboss', 'Corrupt City Council': 'underboss', 'Shadow Senate': 'underboss',
  'Corrupt Oligarchy': 'underboss', 'Shadowed Council': 'underboss',
});

/**
 * THE BASE LADDERS, for the four families with no title today (any culture without its own word reads these).
 * @type {Readonly<Record<string, OfficeLadder>>}
 */
export const BASE_OFFICE_TITLES = Object.freeze({
  sovereign: ladder('Chieftain', 'Chieftain', 'Chieftain', pair('Lord', 'Lady'), pair('King', 'Queen'), pair('Emperor', 'Empress')),
  appointed: ladder('Steward', 'Steward', 'Steward', 'Governor', 'Governor', 'Governor'),
  underboss: ladder('Ringleader', 'Ringleader', 'Underboss', 'Underboss', 'Underboss', 'Underboss'),
  crime_boss: ladder('Crime Boss', 'Crime Boss', 'Crime Boss', 'Crime Boss', 'Crime Boss', 'Crime Boss'),
});

/**
 * THE CULTURES' OWN WORDS: culture → family → size → cell. An absent family or size falls back. Every culture's `faith`
 * row is absent (CT4) and no culture holds a criminal row (the chair's hold, pending the owner).
 * @type {Readonly<Record<string, Readonly<Record<string, OfficeLadder>>>>}
 */
export const CULTURE_OFFICE_TITLES = Object.freeze({
  germanic: Object.freeze({
    sovereign: ladder(null, null, null, pair('Graf', 'Gräfin'), pair('König', 'Königin'), pair('Kaiser', 'Kaiserin')),
    appointed: ladder('Vogt', 'Vogt', 'Vogt', 'Vogt', 'Landvogt', 'Statthalter'),
    headman: ladder('Bauermeister', 'Bauermeister', 'Schultheiss', 'Burgomaster', 'Burgomaster', 'Burgomaster'), // TITLES-3 at thorp and hamlet: the village's head
    council: ladder(null, null, null, 'Burgomaster', 'Burgomaster', 'Burgomaster'),
    guild: ladder(null, null, null, 'Zunftmeister', 'Zunftmeister', 'Zunftmeister'), // TITLES-2: the guild's master
    military: ladder(null, null, null, null, 'Marschall', 'Marschall'), // TITLES-2: the army's marshal
  }),
  latin: Object.freeze({
    sovereign: ladder(null, null, null, 'Princeps', pair('Rex', 'Regina'), pair('Imperator', 'Imperatrix')),
    appointed: ladder(pair('Vilicus', 'Vilica'), pair('Vilicus', 'Vilica'), pair('Vilicus', 'Vilica'), 'Procurator', 'Legate', 'Proconsul'), // TITLES-2 below town: the estate's bailiff
    headman: ladder(null, null, null, 'Praetor', 'Praetor', 'Praetor'), // TITLES-2: the town's chief magistrate
    council: ladder(null, null, null, 'Consul', 'Consul', 'First Consul'),
    assembly: ladder(null, null, null, 'Tribune of the People', 'Tribune of the People', 'Tribune of the People'),
    military: ladder(null, null, 'Decurion', 'Centurion', 'Dux', 'Dux'),
    arcane: ladder(null, null, 'Magister', 'Magister', 'Archmagister', 'Archmagister'),
  }),
  celtic: Object.freeze({
    sovereign: ladder(null, null, null, 'Chieftain', pair('King', 'Queen'), pair('High King', 'High Queen')),
    appointed: ladder('Maer', 'Maer', 'Maer', 'Maer', null, null), // TITLES-2: the king's reeve
    headman: ladder('Pencenedl', 'Pencenedl', 'Chieftain', 'Chieftain', null, null), // TITLES-3 at thorp and hamlet: head of the kindred
    council: ladder(null, null, null, 'Vergobret', 'Vergobret', 'Vergobret'),
    military: ladder(null, null, 'Penteulu', 'Penteulu', 'Penteulu', 'Penteulu'), // TITLES-2: captain of the warband
  }),
  arabic: Object.freeze({
    sovereign: ladder(null, null, pair('Sheikh', 'Sheikha'), pair('Sheikh', 'Sheikha'), pair('Emir', 'Emira'), pair('Sultan', 'Sultana')),
    appointed: ladder(null, null, null, null, 'Wali', 'Wali'),
    headman: ladder('Mukhtar', 'Mukhtar', 'Mukhtar', "Ra'is", "Ra'is", "Ra'is"),
    council: ladder(null, null, null, "Ra'is", "Ra'is", "Ra'is"), // TITLES-2: head of the notables
    elders: ladder(pair('Sheikh', 'Sheikha'), pair('Sheikh', 'Sheikha'), pair('Sheikh', 'Sheikha'), pair('Sheikh', 'Sheikha'), pair('Sheikh', 'Sheikha'), pair('Sheikh', 'Sheikha')),
    merchant: ladder(null, null, null, 'Shahbandar', 'Shahbandar', 'Shahbandar'),
    military: ladder(null, null, 'Qaid', 'Qaid', 'Amir al-Juyush', 'Amir al-Juyush'), // TITLES-2 at city and up: commander of the armies
  }),
  norse: Object.freeze({
    sovereign: ladder(null, null, 'Jarl', 'Jarl', pair('King', 'Queen'), pair('High King', 'High Queen')),
    appointed: ladder(null, null, null, null, 'Jarl', 'Jarl'),
    headman: ladder(null, null, 'Jarl', 'Jarl', 'Jarl', 'Jarl'),
    council: ladder(null, null, 'Lawspeaker', 'Lawspeaker', 'Lawspeaker', 'Lawspeaker'),
    assembly: ladder(null, null, 'Lawspeaker', 'Lawspeaker', 'Lawspeaker', 'Lawspeaker'),
    military: ladder(null, null, 'Hersir', 'Hersir', 'Stallari', 'Stallari'), // TITLES-2 at city and up: the king's marshal
  }),
  slavic: Object.freeze({
    sovereign: ladder(null, null, null, pair('Knyaz', 'Knyaginya'), pair('Grand Knyaz', 'Grand Knyaginya'), pair('Tsar', 'Tsaritsa')),
    appointed: ladder('Tiun', 'Tiun', 'Tiun', 'Namestnik', 'Namestnik', 'Namestnik'), // TITLES-2 below town: the prince's steward
    headman: ladder('Starosta', 'Starosta', 'Starosta', 'Posadnik', 'Posadnik', 'Posadnik'),
    council: ladder(null, null, null, 'Golova', 'Golova', 'Golova'), // TITLES-2: the city's head
    elders: ladder('Starosta', 'Starosta', 'Starosta', 'Starosta', 'Starosta', 'Starosta'),
    merchant: ladder(null, null, null, 'Gost', 'Gost', 'Gost'), // TITLES-2: first of the great merchants
    military: ladder(null, null, 'Voivode', 'Voivode', 'Voivode', 'Voivode'),
  }),
  east_asian: Object.freeze({
    sovereign: ladder(null, null, null, 'Daimyo', 'Daimyo', null),
    appointed: ladder(null, null, 'Daikan', 'Bugyo', 'Bugyo', 'Bugyo'),
    headman: ladder('Nanushi', 'Nanushi', 'Nanushi', 'Toshiyori', 'Toshiyori', 'Toshiyori'), // TITLES-2 at town and up: the town elder
    council: ladder(null, null, null, 'Toshiyori', 'Toshiyori', 'Tairo'), // TITLES-2: the town elder; the great elder
    elders: ladder(null, null, null, 'Toshiyori', 'Toshiyori', 'Toshiyori'), // TITLES-2: the town elder (Otona below town struck by the chair: shrine-parish origin)
    military: ladder(null, null, 'Kumigashira', 'Obangashira', 'Obangashira', 'Obangashira'), // TITLES-2: the squad's leader; captain of the guard
  }),
  mesoamerican: Object.freeze({
    sovereign: ladder(null, null, null, 'Tlatoani', 'Tlatoani', 'Huey Tlatoani'),
    appointed: ladder(null, null, 'Calpixqui', 'Calpixqui', 'Calpixqui', 'Calpixqui'),
    headman: ladder('Calpullec', 'Calpullec', 'Calpullec', 'Calpullec', null, null), // TITLES-3: the calpulli's own head
    elders: ladder(pair('Huehue', 'Ilama'), pair('Huehue', 'Ilama'), pair('Huehue', 'Ilama'), pair('Huehue', 'Ilama'), null, null), // TITLES-3: the old man, the old woman
    military: ladder(null, null, null, 'Tlacateccatl', 'Tlacateccatl', 'Tlacateccatl'), // TITLES-2: the army's general
  }),
  south_asian: Object.freeze({
    sovereign: ladder(null, null, null, pair('Raja', 'Rani'), pair('Maharaja', 'Maharani'), pair('Samrat', 'Samrajni')),
    appointed: ladder(null, null, null, 'Faujdar', 'Subahdar', 'Subahdar'),
    headman: ladder('Mukhiya', 'Mukhiya', 'Mukhiya', null, null, null),
    council: ladder(null, null, 'Sarpanch', 'Sarpanch', null, null),
    elders: ladder('Sarpanch', 'Sarpanch', 'Sarpanch', 'Sarpanch', null, null), // TITLES-2: head of the panchayat
    assembly: ladder(null, null, 'Sabhapati', 'Sabhapati', 'Sabhapati', 'Sabhapati'),
    merchant: ladder(null, null, null, 'Nagarsheth', 'Nagarsheth', 'Nagarsheth'),
    guild: ladder(null, null, null, 'Jetthaka', 'Jetthaka', 'Jetthaka'), // TITLES-2: the craft guild's chief
    military: ladder(null, null, null, 'Senapati', 'Senapati', 'Senapati'),
  }),
  steppe: Object.freeze({
    sovereign: ladder(null, null, null, pair('Khan', 'Khatun'), pair('Khan', 'Khatun'), pair('Khagan', 'Khatun')),
    appointed: ladder(null, null, null, 'Darughachi', 'Darughachi', 'Darughachi'),
    headman: ladder(null, null, pair('Beg', 'Begim'), pair('Beg', 'Begim'), pair('Beg', 'Begim'), pair('Beg', 'Begim')), // TITLES-2: the clan's chief
    council: ladder(null, null, null, 'Biy', 'Biy', 'Biy'), // TITLES-2: the elected judge-elder
    elders: ladder('Biy', 'Biy', 'Biy', 'Biy', 'Biy', 'Biy'), // TITLES-2: the elected judge-elder
    military: ladder(null, null, 'Noyan', 'Noyan', 'Noyan', 'Noyan'),
  }),
  greek: Object.freeze({
    sovereign: ladder(null, null, null, pair('Basileus', 'Basilissa'), pair('Basileus', 'Basilissa'), null),
    appointed: ladder(null, null, null, 'Harmost', 'Harmost', 'Harmost'),
    headman: ladder('Komarch', 'Komarch', 'Demarch', 'Demarch', 'Demarch', 'Demarch'), // TITLES-3 at thorp and hamlet: the village's chief
    council: ladder(null, null, null, 'Archon', 'Archon', 'Archon'),
    assembly: ladder(null, null, null, 'Epistates', 'Epistates', 'Epistates'),
    military: ladder(null, null, null, 'Polemarch', 'Polemarch', 'Polemarch'),
  }),
});

/** @param {Readonly<Record<string, any>>} table @param {unknown} key @returns {any} */
const own = (table, key) => (typeof key === 'string' && Object.hasOwn(table, key) ? table[key] : null);

/** The holder's form of a cell (the masculine where the holder's sex is not stated, as faceHonorifics.js reads).
 * @param {OfficeCell} cell @param {unknown} sex @returns {string} */
const formOf = (cell, sex) => (typeof cell === 'string' ? cell : sex === 'female' ? cell.female : cell.male);

/**
 * The family a government's name falls into, or null for a name the engine does not write (a DM's own).
 * @param {unknown} form the government's (the governing power's) name @returns {string | null}
 */
export function officeFamilyOfForm(form) {
  return own(GOVERNMENT_FAMILY, typeof form === 'string' ? form.trim() : form);
}

/**
 * THE CELL, OR NULL (SEAT-1's call): the culture's word for the office, else the base ladder's for the four families
 * with no title today; NULL where the family has a title today and this culture holds no word for it (the caller keeps
 * today's), and for an unknown family. `sovereign` is read only for `headman` (CT3: a council's first or a ruler sent by
 * another never takes a crown word); `family: 'sovereign'` is the same row.
 * @param {{ family: string, tier: string, culture?: string | null, sovereign?: boolean, sex?: string | null }} args
 * @returns {string | null}
 */
export function officeTitleOf({ family, tier, culture = null, sovereign = false, sex = null }) {
  const key = family === 'headman' && sovereign === true ? 'sovereign' : family;
  if (!OFFICE_FAMILIES.includes(key)) return null;
  const rows = own(CULTURE_OFFICE_TITLES, culture);
  const cell = (rows && own(own(rows, key) || {}, tier)) || own(own(BASE_OFFICE_TITLES, key) || {}, tier);
  return cell ? formOf(cell, sex) : null;
}

/**
 * Today's title for a government at a size (the expression representatives.js :: officeTitleFor holds, read here
 * so the fallback is today's byte for byte). @param {string | null} government @param {string} tier @returns {string}
 */
export const todayOfficeTitle = (government, tier) =>
  own(OFFICE_TITLES, government) || own(CIVIC_OFFICE_BY_SIZE, tier) || 'Mayor';

/**
 * THE TITLE, NEVER BLANK (the chair's CT1): the culture's word, else the base ladder's, else today's title for the
 * government at that size.
 * @param {{ family: string, tier: string, culture?: string | null, government?: string | null, sovereign?: boolean,
 *   sex?: string | null }} args @returns {string}
 */
export function officeTitleIn({ family, tier, culture = null, government = null, sovereign = false, sex = null }) {
  return officeTitleOf({ family, tier, culture, sovereign, sex }) ?? todayOfficeTitle(government, tier);
}

/** The criminals' group card's heading (the owner's word; the same in every culture until the owner rules). */
export const crimeBossesHeading = () => CRIME_BOSSES_HEADING;

/**
 * EVERY WORD THIS TABLE CAN WRITE, once per (word, family, sovereign, sex): a sibling of officeTitles.js ::
 * OFFICE_WORDS for the readers that match an office by its word (SEAT-1's census).
 * @type {ReadonlyArray<Readonly<{ word: string, family: string, sovereign: boolean, sex: 'male' | 'female' | null }>>}
 */
export const CULTURE_OFFICE_WORDS = Object.freeze((() => {
  /** @type {Map<string, Readonly<{ word: string, family: string, sovereign: boolean, sex: 'male' | 'female' | null }>>} */
  const out = new Map();
  /** @param {string} family @param {OfficeLadder} rungs */
  const add = (family, rungs) => {
    for (const cell of Object.values(rungs)) {
      if (!cell) continue;
      const forms = typeof cell === 'string' ? [[cell, null]] : [[cell.male, 'male'], [cell.female, 'female']];
      for (const [word, sex] of forms) {
        const row = Object.freeze({ word: String(word), family: family === 'sovereign' ? 'headman' : family, sovereign: family === 'sovereign',
          sex: /** @type {'male' | 'female' | null} */ (sex) });
        out.set(`${row.word}\t${row.family}\t${row.sovereign}\t${row.sex}`, row);
      }
    }
  };
  for (const [family, rungs] of Object.entries(BASE_OFFICE_TITLES)) add(family, rungs);
  for (const rows of Object.values(CULTURE_OFFICE_TITLES)) for (const [family, rungs] of Object.entries(rows)) add(family, rungs);
  return [...out.values()];
})());

/** Today's crown words (domain/people/cardPowers.js :: CROWN_OFFICES): an empty crown is kept by a regent. */
const TODAY_CROWN_WORDS = Object.freeze(['King', 'Queen', 'Monarch']);

/**
 * WHAT A WORD IS, AS AN OFFICE (SEAT-1's reverse read), over every word this table writes and every word today's
 * table writes (officeTitles.js): its families; `sovereign`, a crown word of the sovereign row; `crown`, a word whose
 * empty seat is kept by a regent (a sovereign word no other row also writes, or today's King, Queen, Monarch); `sex`,
 * the sex the word names (null for a word that fits any holder). Null for a word no table writes. Matched trimmed and
 * without regard to case.
 * @param {unknown} word
 * @returns {{ families: string[], sovereign: boolean, crown: boolean, sex: 'male' | 'female' | null } | null}
 */
export function officeWordInfo(word) {
  const w = typeof word === 'string' ? word.trim().toLowerCase() : '';
  if (!w) return null;
  const rows = CULTURE_OFFICE_WORDS.filter((r) => r.word.toLowerCase() === w);
  /** @type {Set<string>} */
  const families = new Set(rows.map((r) => r.family));
  for (const [name, title] of Object.entries(OFFICE_TITLES)) if (title.toLowerCase() === w) families.add(own(GOVERNMENT_FAMILY, name) || 'headman');
  for (const title of Object.values(CIVIC_OFFICE_BY_SIZE)) if (title.toLowerCase() === w) families.add('headman');
  const todayCrown = TODAY_CROWN_WORDS.some((c) => c.toLowerCase() === w);
  if (!families.size && !todayCrown) return null;
  const sovereign = rows.some((r) => r.sovereign);
  const crown = todayCrown || (sovereign && rows.every((r) => r.sovereign));
  const sexes = new Set(rows.map((r) => r.sex));
  const sex = sexes.size === 1 ? [...sexes][0] : todayCrown ? (w === 'queen' ? 'female' : w === 'king' ? 'male' : null) : null;
  return { families: [...families].sort(), sovereign, crown, sex };
}

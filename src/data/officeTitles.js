/**
 * data/officeTitles.js — THE LEADER'S OFFICE TITLES (COHERENCE-POWERS; the table the chair ruled on 2026-11-11, vetoable
 * by the owner). Moved verbatim out of generators/people/representatives.js (COHERENCE-POWERS-3, F10), so the card's
 * honorific row reads the same table the leader's office is written from.
 */

/**
 * THE LEADER'S OFFICE TITLE (COHERENCE-POWERS; the table the chair ruled on 2026-11-11, vetoable by the
 * owner): the title a dual-hat leader carries beside its house's, written to the card's `role` (its
 * `title` stays its house's). Titles fit the government and the size; none is mandated. A government the
 * table does not name takes the size's civic title.
 */
export const OFFICE_TITLES = Object.freeze({
  'Elder Council': 'Elder', 'Free Elder Council': 'Elder', 'Elder Consensus': 'Elder', 'Household Council': 'Household Elder',
  "Headman's Authority": 'Headman', 'Elected Reeve': 'Reeve', 'Priestly Guidance': 'Elder Priest',
  'Town Mayor': 'Mayor', 'Town Council': 'Mayor', 'City Council': 'Lord Mayor', 'Grand Council': 'Lord Mayor',
  'Democratic assembly': 'Speaker of the Assembly', 'City-State Council': 'First Councillor',
  'Church Council': 'Warden of the Council', 'Ecclesiastical Council': 'Lord Warden', 'Theocratic Council': 'Lord Warden',
  'High Theocratic Council': 'Lord Protector of the Faith',
  'Militia Command': 'Captain of the Muster', 'Military Council': 'Captain-Mayor', 'Military City Council': 'Lord Marshal',
  'Grand Military Council': 'Lord Marshal', 'Garrison Command': 'Lord Marshal',
  'Merchant Council': 'Burgomaster', 'Merchant City Council': 'Lord Burgomaster', 'Grand Merchant Senate': 'Doge',
  'Merchant oligarchy': 'First Magnate', 'Grand Merchant Oligarchy': 'First Magnate',
  'Guild Council': 'Alderman', 'Guild Authority': 'Lord Alderman', 'Grand Guild Council': 'Lord Alderman',
  'Merchant Guild Council': 'Master of the Guilds', 'Grand Guild Consortium': 'Master of the Guilds',
  "Guildmasters' Moot": 'Alderman', 'Guildhall Council': 'Alderman', 'Grand Guild Assembly': 'Lord Alderman',
  'Circle of Adepts': 'First Adept', 'Arcane Council': 'Archmage of the Council', 'Arcane Senate': 'Archmage of the Senate',
  'Grand Arcane Council': 'Archmage of the Council',
});
export const CIVIC_OFFICE_BY_SIZE = Object.freeze({ thorp: 'Elder', hamlet: 'Elder', village: 'Elder', town: 'Mayor', city: 'Lord Mayor', metropolis: 'Lord Mayor' });

/** Every word the table can write as an office (the governments' titles and the sizes' civic titles). */
/** @type {ReadonlyArray<string>} */
export const OFFICE_WORDS = Object.freeze([...new Set([...Object.values(OFFICE_TITLES), ...Object.values(CIVIC_OFFICE_BY_SIZE)])]);

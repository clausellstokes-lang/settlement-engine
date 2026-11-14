/**
 * tests/helpers/dualHatOracle.js — THE DUAL HAT, AS THE TESTS READ IT, INDEPENDENTLY (COHERENCE-POWERS-3, F9;
 * REVIEW-POWERS F9: four pins re-keyed by computing the expected role with the implementation's own `dualHatHouseOf` /
 * `officeTitleFor`, so a wrong rule would move the expectation with the code). Here the office titles are LITERALS (the
 * table the chair ruled on 2026-11-11, copied as words), and the leader's house is re-stated from the catalogue's own
 * primitives (the face, the shelf, the backing row's shares and weight), never from generators/people/representatives.js.
 */
import { backingRowFor } from '../../src/data/institutionBacking.js';
import { FACE_SEAT, faceOfInstitution, familyOfInstitution, isFabricInstitution } from '../../src/data/institutionalCatalog.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';

/** The ruled office titles, as literals. */
export const OFFICE_LITERALS = Object.freeze({
  'Elder Council': 'Elder',
  'Free Elder Council': 'Elder',
  'Elder Consensus': 'Elder',
  'Household Council': 'Household Elder',
  "Headman's Authority": 'Headman',
  'Elected Reeve': 'Reeve',
  'Priestly Guidance': 'Elder Priest',
  'Town Mayor': 'Mayor',
  'Town Council': 'Mayor',
  'City Council': 'Lord Mayor',
  'Grand Council': 'Lord Mayor',
  'Democratic assembly': 'Speaker of the Assembly',
  'City-State Council': 'First Councillor',
  'Church Council': 'Warden of the Council',
  'Ecclesiastical Council': 'Lord Warden',
  'Theocratic Council': 'Lord Warden',
  'High Theocratic Council': 'Lord Protector of the Faith',
  'Militia Command': 'Captain of the Muster',
  'Military Council': 'Captain-Mayor',
  'Military City Council': 'Lord Marshal',
  'Grand Military Council': 'Lord Marshal',
  'Garrison Command': 'Lord Marshal',
  'Merchant Council': 'Burgomaster',
  'Merchant City Council': 'Lord Burgomaster',
  'Grand Merchant Senate': 'Doge',
  'Merchant oligarchy': 'First Magnate',
  'Grand Merchant Oligarchy': 'First Magnate',
  'Guild Council': 'Alderman',
  'Guild Authority': 'Lord Alderman',
  'Grand Guild Council': 'Lord Alderman',
  'Merchant Guild Council': 'Master of the Guilds',
  'Grand Guild Consortium': 'Master of the Guilds',
  "Guildmasters' Moot": 'Alderman',
  'Guildhall Council': 'Alderman',
  'Grand Guild Assembly': 'Lord Alderman',
  'Circle of Adepts': 'First Adept',
  'Arcane Council': 'Archmage of the Council',
  'Arcane Senate': 'Archmage of the Senate',
  'Grand Arcane Council': 'Archmage of the Council',
});
/** The size's civic title where the government is not named. */
export const CIVIC_LITERALS = Object.freeze({ thorp: 'Elder', hamlet: 'Elder', village: 'Elder', town: 'Mayor', city: 'Lord Mayor', metropolis: 'Lord Mayor' });
/** The governments that send their own man (one hat). */
export const APPOINTED_LITERALS = Object.freeze(['Feudal Stewardship', 'Feudal Appointee', 'Noble Governorship', 'Ducal Governorship',
  'Royal Authority', 'Noble Regency', 'Foreign Stewardship', 'Foreign Administration', 'Occupation Authority', 'Martial Administration']);
const RULER_KINDS = Object.freeze(['religious', 'military', 'merchant', 'arcane', 'noble', 'craft']);
const CIVIC_KINDS = Object.freeze(['craft', 'merchant', 'noble']);

/** @param {string} government @param {string} tier @returns {string} the office the leader holds, as a literal */
export const officeLiteralOf = (government, tier) => OFFICE_LITERALS[government] || CIVIC_LITERALS[tier] || 'Mayor';

/** A house's kind: 'government' for a hall or a Government-shelf house, else its backing row's largest share. */
export function kindOfHouse(house) {
  if (faceOfInstitution(house) === FACE_SEAT || familyOfInstitution(house)?.shelf === 'Government') return 'government';
  const row = backingRowFor(house?.name);
  return row ? Object.entries(row.shares).sort((x, y) => y[1] - x[1])[0][0] : null;
}

/**
 * The house the governing power's leader comes from, re-stated: none where the government sends its own man or is
 * criminal; a ruler of a kind, its heaviest open face-bearing house of that kind; a civic ruler, its heaviest trade or
 * landed house, else its heaviest open house of any other kind. Ties by roster order.
 * @param {Array<Record<string, any>>} institutions @param {string} government @param {string | null} rulerKind
 * @returns {string | null} the house's roster name
 */
export function leaderHouseOf(institutions, government, rulerKind) {
  if (!government || APPOINTED_LITERALS.includes(government) || rulerKind === 'criminal') return null;
  const open = (institutions || []).filter((h) => h && !isFabricInstitution(h) && !isHideableHouse(h)
    && typeof faceOfInstitution(h) === 'string' && faceOfInstitution(h) !== FACE_SEAT);
  const heaviest = (fits) => {
    let best = null;
    for (const h of open) {
      if (!fits(String(kindOfHouse(h)))) continue;
      const w = backingRowFor(h.name)?.weight ?? 1;
      if (!best || w > best.w) best = { h, w };
    }
    return best ? String(best.h.name) : null;
  };
  if (RULER_KINDS.includes(rulerKind)) return heaviest((k) => k === rulerKind);
  return heaviest((k) => CIVIC_KINDS.includes(k)) || heaviest((k) => k !== 'government' && k !== 'null');
}

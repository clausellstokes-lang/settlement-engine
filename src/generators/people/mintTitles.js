/**
 * people/mintTitles.js — THE TWO MINTS' TITLE TABLES (the people car, PEOPLE-1 CAST, 2026-11-07;
 * the chair's rulings R-P2 and R-P4 in docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md §1).
 *
 * Two representatives are born of a POWER rather than a house:
 *   THE SEAT MINT (R-P2) — where the roster carries no Government-shelf house and no hall or
 *     palace (measured: 23/167 thorps, 83/167 hamlets, 97/167 villages; never above the village
 *     without a hall), the seat's face is minted from the governing power under the power's own
 *     title, keyed by the power's name.
 *   THE `other` MINT (R-P4) — a stress-born power with no archetype row (Revolt Leadership, the
 *     Creditor's Representative, …) mints one face from its stressor under a title keyed by the
 *     power's name. Recruiting from the default-share faces is REFUSED (a creditor's
 *     representative is a person, not a borrowed baker).
 * Both tables carry the chair's fallback, "the head of <power name>"; the lane extends them from
 * the measured names so that the fallback fires on none of the soak 1,000 (the instrument
 * docs/chair/2026-11-07/people-1/ counts every firing; the record lists the table as it ended).
 *
 * Each row: title · the role and category the card's pools are reached through (people/poolMap.js
 * explains the two keys) · the cultural-title key. Pure data, no draw.
 */

/** @typedef {{ title: string, role: string, category: string, titleKey: string }} MintRow */

const row = (title, role, category, titleKey) => Object.freeze({ title, role, category, titleKey });

/**
 * R-P2 — the seat mint, keyed by the governing power's name. The chair's twenty-one rows first,
 * then the names PEOPLE-0 §2 measured on the 1,000 that the chair's table did not reach.
 * The role is NOT read from here: the seat's role is the tier's (poolMap.js :: seatPoolFor), so
 * the seat read finds the minted seat as it finds a housed one.
 * @type {Readonly<Record<string, string>>}
 */
export const SEAT_MINT_TITLES = Object.freeze({
  // the chair's table (R-P2)
  'Elder Council': 'the eldest',
  "Headman's Authority": 'the headman',
  'Household Council': 'the household elder',
  'Feudal Stewardship': 'the steward',
  'City-State Council': 'the first councillor',
  'Royal Authority': 'the royal governor',
  'Military/Guard': 'the commander',
  'War Council': 'the war-leader',
  'Occupation Authority': 'the occupying governor',
  'Religious Authorities': 'the high priest',
  'Priestly Guidance': 'the elder priest',
  "Thieves' Guild": 'the guildmaster',
  'Corrupt Council': "the council's fixer",
  'Merchant Guilds': 'the guild master',
  'Craft Guilds': 'the craft-guild master',
  'Grain Holders': 'the grain factor',
  'Merchant oligarchy': 'the first magnate',
  'Noble Houses': 'the lord',
  'Noble Families': 'the lord',
  'The Highborn Circle': "the circle's first",
  'Arcane Orders': 'the magister',
  'Arcane Council': "the council's archmage",
});

/** R-P2's fallback, and R-P4's: "the head of <power name>". @param {string} power */
export const headOf = (power) => `the head of ${power}`;

/**
 * R-P4 — the `other` mint, keyed by the power's name: the chair's five rows, then the measured
 * names. The role and category reach the pools (M-4: no new prose).
 * @type {Readonly<Record<string, MintRow>>}
 */
export const OTHER_MINT_ROWS = Object.freeze({
  // the chair's table (R-P4)
  'Revolt Leadership': row("the revolt's leader", 'Revolt Leader', 'other', 'lord'),
  "Creditor's Representative": row("the creditor's agent", 'Moneylender', 'economy', 'banker'),
  'Reformist Faction': row('the reformer', 'Council Member', 'government', 'council'),
  'Investigation Faction': row('the investigator', 'Chief Magistrate', 'government', 'magistrate'),
  'The Independent Bloc': row("the bloc's speaker", 'Council Member', 'government', 'council'),
  // the names the soak 1,000 measured beyond the chair's five (PEOPLE-1, the instrument's
  // "Other mints fired" row at the lane's first measurement: 14 · 10 · 10 · 6 · 4 · 4 · 2 firings)
  "Newcomers' Settlement": row("the newcomers' spokesman", 'Spokesman', 'other', 'elder'),
  'The Free Alliance': row("the alliance's convenor", 'Council Member', 'government', 'council'),
  'The Common Interest': row("the commoners' tribune", 'Council Member', 'government', 'council'),
  'Third Bloc (Neutrals)': row("the neutrals' broker", 'Council Member', 'government', 'council'),
  'Peace Faction': row('the peacemaker', 'Council Member', 'government', 'council'),
  'Abolitionist Network': row('the abolitionist', 'Street Preacher', 'other', 'priest'),
  "Journeymen's League": row("the journeymen's warden", 'Journeyman Overseer', 'other', 'overseer'),
  // a power whose archetype the backing catalogue has no row for (occupation): no house can
  // back it, so it mints like a stress-born power (4 firings on the 1,000)
  'Occupation Authority': row('the occupying governor', 'Governor', 'government', 'mayor'),
});

/** The row an `other` power the table does not name takes: the fallback title, the generic pools. */
const OTHER_FALLBACK = Object.freeze({ role: 'Faction Leader', category: 'other', titleKey: 'lord' });

/**
 * The seat mint's title for a governing power, and whether the fallback fired.
 * @param {string} power the governing power's display name
 * @returns {{ title: string, fallback: boolean }}
 */
export function seatMintTitleFor(power) {
  const name = String(power || '').trim();
  const title = SEAT_MINT_TITLES[name];
  return title ? { title, fallback: false } : { title: headOf(name || 'the seat'), fallback: true };
}

/**
 * The `other` mint's row for a power, and whether the fallback fired.
 * @param {string} power the power's display name
 * @returns {MintRow & { fallback: boolean }}
 */
export function otherMintRowFor(power) {
  const name = String(power || '').trim();
  const found = OTHER_MINT_ROWS[name];
  if (found) return { ...found, fallback: false };
  return { title: headOf(name || 'the power'), ...OTHER_FALLBACK, fallback: true };
}

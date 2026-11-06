/**
 * domain/roles/roleClass.js — THE ROLE-CLASS RULE, ONE HOME (CENSUS-4; the chair's rulings Q1 and
 * unit 12 of 2026-11-04, the tie rule R3, and faction-role-fit R12).
 *
 * Moved verbatim from `coherence/readerBattery.js` (where `reader:relation-types` measured it), so
 * the GENERATOR's tie step and the INSTRUMENT read one rule:
 *   ROLE_CLASS / classOfRole   every generated role → one of nine classes
 *   holdsOffice                a seat, a command, a senior see, a guild's head
 *   shareTradeOrOffice         the strict first reading (`[~strict]`)
 *   exemptedVerdict            THE EXEMPTED RULE: does a tie kind presume a relation these two lack
 *   seatFactions               the factions that hold or contest the seat (one office)
 * and, beside them, what a tie KIND presumes (`TIE_PRESUMES`) and the role-free kinds a refused
 * kind resolves to (`ROLE_FREE_TIE_KEYS`, `resolveTieKey`), drawn by hash after the roll so no
 * roll is added or removed (the design's §3.3 resolve-after rule for R and H draws).
 *
 * Pure: no randomness, no clock.
 */
import { POWER_ROLES_BY_CATEGORY } from '../../data/historyData.js';
import { NOBLE_ROLES } from '../../data/nobleRoles.js';
import { fnv1a32 } from '../../kernel/proseHash.js';

/**
 * One party to a tie: its role, and the NPC (its faction affiliation is read for the faction and
 * seat exemptions).
 * @typedef {{ role: string, npc: { factionAffiliation?: unknown } | null | undefined }} TieParty
 */
/** @typedef {{ faction?: unknown, name?: unknown, isGoverning?: unknown, contestsNiche?: unknown }} SeatFaction */

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : v == null ? '' : String(v));

/**
 * THE ROLE→CLASS MAP: every role the NPC generator draws (`historyData.js ::
 * POWER_ROLES_BY_CATEGORY`, the noble roles of `factionRoleCatalog.js :: NOBLE_ROLES`) to one of
 * nine classes. Category → class: government → office (its noble roles → noble), religious →
 * clergy, crafts → trade, military → military, economy → merchant, criminal → criminal, magic →
 * arcane; `other` is classed one by one below (a role with no shared trade or office stays
 * `other` and is not judged). A role the map does not know is `other`.
 */
const CATEGORY_CLASS = Object.freeze({ government: 'office', religious: 'clergy', crafts: 'trade', military: 'military', economy: 'merchant', criminal: 'criminal', magic: 'arcane', other: 'other' });
const ROLE_OVERRIDES = Object.freeze({
  // economy roles that are a craft, not a counting-house
  'Master Craftsman': 'trade', 'Master Shipwright': 'trade',
  // `other`, classed one by one
  'Miller': 'trade', 'Blacksmith': 'trade', 'Shepherd': 'trade', 'Woodcutter': 'trade', 'Widowed Farmer': 'trade',
  'Fisherman': 'trade', 'Apothecary': 'trade', 'Master Builder': 'trade', 'Innkeeper': 'trade', 'Tavern Owner': 'trade',
  'Gravedigger': 'trade', 'Rat Catcher': 'trade', 'Cartographer': 'trade', 'Midwife': 'trade', 'Healer': 'trade',
  'Dockworker/Stevedore': 'trade',
  'Village Priest': 'clergy', 'Street Preacher': 'clergy',
  'Hedge Witch': 'arcane',
  'Elder': 'office', 'Disgraced Official': 'office',
  'Mercenary-for-Hire': 'military', 'Wounded Soldier': 'military',
  'Debt-Ridden Noble': 'noble',
  'Wandering Peddler': 'merchant', 'Debt Collector': 'merchant',
  // faction-pool titles (`factionRoles.js :: FACTION_ROLES`)
  'High Priestess': 'clergy', 'Watch Captain': 'military', 'Guildmaster': 'merchant', 'Senior Trader': 'merchant',
  'Kingpin': 'criminal', 'Lieutenant': 'criminal', 'Lord Mayor': 'office', 'Archmagister': 'arcane',
});

/** @returns {Readonly<Record<string,string>>} role → class */
function buildRoleClass() {
  /** @type {Record<string,string>} */
  const map = {};
  const nobles = new Set(NOBLE_ROLES.map((r) => r.role));
  for (const [category, roles] of Object.entries(POWER_ROLES_BY_CATEGORY)) {
    const list = Array.isArray(roles) ? roles : Object.values(roles).flat();
    for (const r of list) {
      const role = typeof r === 'string' ? r : str(r?.role);
      if (!role) continue;
      map[role] = nobles.has(role) ? 'noble' : (CATEGORY_CLASS[/** @type {keyof typeof CATEGORY_CLASS} */ (category)] ?? 'other');
    }
  }
  return Object.freeze({ ...map, ...ROLE_OVERRIDES });
}
export const ROLE_CLASS = buildRoleClass();

/** @param {string} role */
export const classOfRole = (role) => ROLE_CLASS[role] ?? 'other';

/** Classes that share an office or a trade between them (a governance seat; a counting-house and its craft). */
const FAMILY = Object.freeze({ office: 'governance', noble: 'governance', clergy: 'faith', military: 'arms', arcane: 'arcane', criminal: 'crime', merchant: 'commerce', trade: 'commerce', other: 'other' });
/** A craft role that names no one trade (it sits beside any craft). */
const GENERIC_CRAFT = /^(?:Master Craftsman|Guild Warden|Journeyman Overseer|Craft Guild Representative|Guild Master|Guildmaster)$/;
/** @param {string} role the trade a trade role names ("Master Blacksmith" → "blacksmith") */
const tradeOf = (role) => role.replace(/^(?:Master|Head) /, '').toLowerCase();
/** Holds an office: a seat of government or rank, a command, a senior see, a guild's head. */
const HOLDS_OFFICE = /Captain|Commander|Chief|Warden|Marshal|Master of Arms|Quartermaster|High Priest|Archbishop|Abbot|Inquisitor|Head of the Faithful|Guild ?[Mm]aster|Market Overseer|Magister|Archmage/;
/** @param {string} role */
export const holdsOffice = (role) => ['office', 'noble'].includes(classOfRole(role)) || HOLDS_OFFICE.test(role);

/**
 * Do two roles share a trade or an office? Unknown (`other`) roles are not judged.
 * @param {string} a @param {string} b @returns {boolean|null} null = not judged
 */
export function shareTradeOrOffice(a, b) {
  const ca = classOfRole(a); const cb = classOfRole(b);
  if (ca === 'other' || cb === 'other') return null;
  if (FAMILY[/** @type {keyof typeof FAMILY} */ (ca)] !== FAMILY[/** @type {keyof typeof FAMILY} */ (cb)]) return false;
  if (ca === 'trade' && cb === 'trade' && !GENERIC_CRAFT.test(a) && !GENERIC_CRAFT.test(b)) return tradeOf(a) === tradeOf(b);
  return true;
}

export const PRESUMING_KINDS = /** @type {const} */ (['Mentor and Successor', 'Professional Rivalry', 'Jurisdictional Tension']);

/** The seat's holder: the tier's head role (`npcGenerator.js :: TIER_MANDATORY_ROLES`: Elder, Mayor, Governor) and the Lord Mayor. */
const SEAT_ROLE = /^(?:Elder|Mayor|Lord Mayor|Governor)$/;
/** Classes that share (the chair's ruling Q1): the same class, or noble with office. */
const classesShare = (/** @type {string} */ ca, /** @type {string} */ cb) => ca === cb || (ca === 'noble' && cb === 'office') || (ca === 'office' && cb === 'noble');

/**
 * The factions that hold or contest the seat, which count as ONE office (the chair's ruling Q1):
 * the governing faction and every faction whose `contestsNiche` names it.
 * @param {{ powerStructure?: { governingName?: unknown, factions?: unknown } | null } | null | undefined} s
 * @returns {Set<string>}
 */
export function seatFactions(s) {
  const ps = s?.powerStructure ?? {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const governing = new Set([str(ps.governingName), ...factions.filter((/** @type {SeatFaction} */ f) => f?.isGoverning).map((/** @type {SeatFaction} */ f) => str(f.faction ?? f.name))].filter(Boolean));
  for (const f of factions) if (governing.has(str(f?.contestsNiche))) governing.add(str(f.faction ?? f.name));
  return governing;
}

/**
 * THE EXEMPTED RULE (the chair's ruling Q1, 2026-11-04, verbatim): "two roles share a class when
 * they are in the same class of your map, OR when both are members of the same faction (the
 * faction that holds or contests the seat counts as one office), OR when one holds the seat and
 * the other sits in the body that holds it. Clergy↔clergy, arcane↔arcane, military↔military,
 * criminal↔criminal, merchant↔merchant, noble↔office share. Professional Rivalry needs a shared
 * trade or a shared market (two merchants, two craft masters), else fires. Jurisdictional Tension
 * needs two office-holders (any two offices), else fires."
 * Unit 12 (the chair's ruling, 2026-11-04): "Professional Rivalry PASSES between two
 * office-holders, between noble and office, and between noble and noble … it also passes within
 * one class … same trade, shared market. It FIRES only across unrelated classes" and "the faction
 * and seat exemptions apply to Professional Rivalry too". Jurisdictional Tension stays (two
 * offices). Read here: merchant with trade is a shared market; `other` roles stay unjudged.
 * @param {string} kind @param {TieParty} a @param {TieParty} b @param {Set<string>} seat
 * @returns {{ fires: boolean|null, why: string }} null = not judged
 */
export function exemptedVerdict(kind, a, b, seat) {
  const ca = classOfRole(a.role); const cb = classOfRole(b.role);
  if (kind === 'Jurisdictional Tension') return { fires: !(holdsOffice(a.role) && holdsOffice(b.role)), why: 'two office-holders' };
  if (ca === 'other' || cb === 'other') return { fires: null, why: '' };
  if (kind === 'Professional Rivalry') {
    // Unit 12 (the chair's ruling): rivals for standing (two offices, noble and office, noble and
    // noble), one class, a shared trade or a shared market (merchant and trade read as the market).
    if (ca === cb) return { fires: false, why: 'same class' };
    if (['office', 'noble'].includes(ca) && ['office', 'noble'].includes(cb)) return { fires: false, why: 'rivals for standing' };
    if (['merchant', 'trade'].includes(ca) && ['merchant', 'trade'].includes(cb)) return { fires: false, why: 'a shared market' };
  } else if (classesShare(ca, cb)) return { fires: false, why: 'same class' };
  const fa = str(a.npc?.factionAffiliation); const fb = str(b.npc?.factionAffiliation);
  if (fa && fa === fb) return { fires: false, why: 'same faction' };
  if (fa && fb && seat.has(fa) && seat.has(fb)) return { fires: false, why: 'the seat\'s factions, one office' };
  if ((SEAT_ROLE.test(a.role) && seat.has(fb)) || (SEAT_ROLE.test(b.role) && seat.has(fa))) return { fires: false, why: 'seat and its body' };
  return { fires: true, why: '' };
}

/**
 * THE TIE RULE (R3): what each presuming tie kind needs between its two parties, by the archetype
 * key (`npcData.js :: STRESS_ECONOMIC_EFFECTS`) and its label. Every other kind presumes nothing
 * about the two roles.
 */
export const TIE_PRESUMES = Object.freeze({
  mentor_legacy: Object.freeze({ label: 'Mentor and Successor', needs: 'shared trade or office' }),
  peer_rivalry: Object.freeze({ label: 'Professional Rivalry', needs: 'shared trade or market' }),
  gov_mil_friction: Object.freeze({ label: 'Jurisdictional Tension', needs: 'two offices' }),
});

/** The role-free kinds a refused kind resolves to: debt, leverage, respect, family, unresolved history. */
export const ROLE_FREE_TIE_KEYS = Object.freeze(['old_debt', 'mutual_leverage', 'genuine_respect', 'family_complication', 'bitter_history']);

/**
 * Each presuming kind resolves within its own POLARITY, so a refused tie keeps what it does on
 * the page and in the record: a rivalry (type `rival`, which seeds a conflict) becomes Unresolved
 * History (`enemy`, which seeds one too); a Jurisdictional Tension (`political`) becomes Mutual
 * Leverage (`political`); a Mentor and Successor (a bond) becomes respect, a debt or family.
 */
export const ROLE_FREE_BY_KIND = Object.freeze({
  peer_rivalry: Object.freeze(['bitter_history']),
  gov_mil_friction: Object.freeze(['mutual_leverage']),
  mentor_legacy: Object.freeze(['genuine_respect', 'old_debt', 'family_complication']),
});

/**
 * Does the tie kind's presumption fail between these two? (`exemptedVerdict(...).fires === true`;
 * an unjudged pair, an `other` role, is never refused.)
 * @param {string} archetypeKey @param {TieParty} a @param {TieParty} b
 * @param {Set<string>} [seat]
 * @returns {boolean}
 */
export function tieRefused(archetypeKey, a, b, seat = new Set()) {
  const presumes = /** @type {Record<string, {label: string}>} */ (TIE_PRESUMES)[archetypeKey];
  if (!presumes) return false;
  return exemptedVerdict(presumes.label, a, b, seat).fires === true;
}

/**
 * THE RESOLVE-AFTER RULE for a tie kind: the drawn key when its presumption holds, else the
 * role-free kind of the same polarity (`ROLE_FREE_BY_KIND`) with the greatest `fnv1a32(key::pair)` — a hash, never a roll, so the stream
 * is untouched and only a refused tie moves.
 * @param {string} archetypeKey the drawn kind
 * @param {TieParty} a @param {TieParty} b
 * @param {string} pairKey a stable key of the directed pair (e.g. "<idA>><idB>")
 * @param {Set<string>} [seat]
 * @returns {{ key: string, refused: boolean }}
 */
export function resolveTieKey(archetypeKey, a, b, pairKey, seat = new Set()) {
  if (!tieRefused(archetypeKey, a, b, seat)) return { key: archetypeKey, refused: false };
  const candidates = /** @type {Record<string, ReadonlyArray<string>>} */ (ROLE_FREE_BY_KIND)[archetypeKey] ?? ROLE_FREE_TIE_KEYS;
  let best = candidates[0]; let bestScore = -1;
  for (const key of candidates) {
    const score = fnv1a32(`${key}::${pairKey}`);
    if (score > bestScore) { best = key; bestScore = score; }
  }
  return { key: best, refused: true };
}

/**
 * FACTION-ROLE-FIT (R12, the chair's ruling of 2026-11-04): the role classes a faction of each
 * kind may seat. A religious faction seats clergy; a noble faction nobles or office-holders; a
 * military (guard) faction military roles; a criminal faction criminals. Every other kind
 * (government, economy, crafts, magic, other) seats any class, and an unjudged role (`other`)
 * fits anywhere, as in the tie rule. So a Wandering Peddler is never a Religious Authority, and a
 * priest is never the Military/Guard's instigator.
 */
export const FACTION_ROLE_FIT = Object.freeze({
  religious: Object.freeze(['clergy']),
  noble: Object.freeze(['noble', 'office']),
  military: Object.freeze(['military']),
  criminal: Object.freeze(['criminal']),
});

/**
 * A faction that holds or contests the SEAT is an office (the chair's ruling Q1), so it also seats
 * office-holders and nobles whatever its kind: the Elder who holds a Priestly Guidance's seat,
 * the Mayor at the head of a Grand Military Council.
 * @param {unknown} category a power faction's category
 * @param {unknown} role an NPC's role
 * @param {{ seat?: boolean }} [options] `seat`: the faction holds or contests the seat (`seatFactions`)
 * @returns {boolean}
 */
export function factionRoleFits(category, role, options = {}) {
  const fit = /** @type {Record<string, ReadonlyArray<string>>} */ (FACTION_ROLE_FIT)[str(category)];
  if (!fit) return true;
  const c = classOfRole(str(role));
  return c === 'other' || fit.includes(c) || (options.seat === true && (c === 'office' || c === 'noble'));
}

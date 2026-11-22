/**
 * people/poolMap.js — THE POOL MAP: a face's title and shelf → the role and category its card
 * draws its personality, goal, secret, hook and presentation pools from (the people car,
 * PEOPLE-1 CAST, 2026-11-07; the chair's method ruling M-4 in
 * docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md §2).
 *
 * THE CAR AUTHORS NO PROSE. Today's pools (data/npcData.js) are keyed two ways: the goal pool by
 * ROLE (NPC_FACTION_GOALS: 'Mayor', 'Guard Captain', 'Guild Master', … twenty-four roles) and the
 * secret, hook, presentation and wants pools by CATEGORY (government · military · religious ·
 * economy · criminal · magic · other). A representative is born of a HOUSE under a TITLE ("the
 * miller"), so this ONE table maps every title the registry declares
 * (src/data/institutionalCatalog.js :: face) to a role and a category that reach those pools —
 * the role from data/historyData.js :: POWER_ROLES_BY_CATEGORY where the catalogue has one (so
 * every reader that keys on a role string — the seat read, the crisis cast's role regexes, the
 * ladder's role regex, roleToCategory — keeps its meaning), a plain descriptive role where it has
 * none; the category one of the seven pool keys, never a key the pools lack.
 *
 * A FALLBACK is a title whose role has no goal pool of its own (the card draws the category's
 * secrets as its goal, exactly as most of today's roles do) — `poolFor` says so, and the lane's
 * record lists every one for the writing wave (W4 PEOPLE), which authors for the new cards
 * afterwards (the owner: "Do the writing lanes after these changes as well.").
 *
 * M-1b (the owner's word of 2026-11-07, 07:1x UTC, PEOPLE-RULINGS §2): the faction roles dissolve;
 * a representative's ROLE is its institution's title and its standing in each power its rank.
 * The role this map names is therefore ONLY the key the card's pools are drawn through — it is
 * never written onto the card (people/representatives.js writes `role = title`); the old role
 * vocabulary survives here until the writing wave authors pools by title.
 *
 * THE SEAT is the one title the tier decides: the governing house's face (and the seat MINT where
 * no house carries it) takes the seat role the seat read expects (domain/dossier/seatHolder.js ::
 * TIER_HEAD — Elder below the village, Mayor to the city, Governor at the metropolis), whatever
 * its house's title says, so the seat is found by the readers that look for it today.
 *
 * Pure data and two pure lookups. No draw, no rng.
 */

import { NPC_FACTION_GOALS, NPC_FACTION_LOYALTY } from '../../data/npcData.js';
import { TITLE_PRESENTATIONS, TITLE_SECRETS } from '../../data/people/titleSecretsPresentations.js';

/** The seven categories the pools are keyed by. */
export const POOL_CATEGORIES = Object.freeze(['government', 'military', 'religious', 'economy', 'criminal', 'magic', 'other']);

/** The seat's role by tier — the mirror of seatHolder.js :: TIER_HEAD, which reads it back. */
export const SEAT_ROLE_BY_TIER = Object.freeze({
  thorp: 'Elder', hamlet: 'Elder', village: 'Mayor', town: 'Mayor', city: 'Mayor', metropolis: 'Governor',
});

/** @typedef {{ role: string, category: string, titleKey: string }} PoolRow */

/**
 * title → [role, category, the cultural-title key of data/namingData.js titles].
 * Grouped by the shelf the title's family sits on; the lookup is by title alone (a title is
 * unique across shelves — tests/lint/faceRegistry.walker.test.js counts them).
 * @type {Readonly<Record<string, readonly [string, string, string]>>}
 */
export const POOL_BY_TITLE = Object.freeze({
  // ── Economy ──────────────────────────────────────────────────────────────────────────────
  'the fishmonger': ['Fishmonger', 'economy', 'merchant'],
  'the master fishmonger': ['Fishmonger', 'economy', 'merchant'], // Fish market (the owner's amendment, 07:3x UTC)
  'the head shepherd': ['Shepherd', 'other', 'owner'],
  'the dairy farmer': ['Dairy Farmer', 'other', 'owner'],
  'the beekeeper': ['Beekeeper', 'other', 'owner'],
  'the wildfowler': ['Wildfowler', 'other', 'owner'],
  'the camp foreman': ['Woodcutter', 'other', 'overseer'],
  'the collier': ['Charcoal Burner', 'other', 'owner'],
  'the peat-reeve': ['Peat Reeve', 'other', 'overseer'],
  'the mine captain': ['Mine Captain', 'economy', 'overseer'],
  'the quarry master': ['Quarry Master', 'economy', 'master'],
  'the salt master': ['Salt Master', 'economy', 'master'],
  'the master of the hunt': ['Master of the Hunt', 'other', 'master'],
  'the exchange master': ['Wealthiest Merchant', 'economy', 'merchant'],
  'the guild master': ['Guild Master', 'economy', 'guild'],
  'the banker': ['Moneylender', 'economy', 'banker'],
  'the pawnbroker': ['Pawnbroker', 'economy', 'merchant'],
  'the innkeeper': ['Innkeeper', 'other', 'owner'],
  'the alewife': ['Tavern Owner', 'other', 'owner'],
  'the coaching-inn keeper': ['Coaching Inn Keeper', 'other', 'owner'],
  'the caravanserai keeper': ['Caravanserai Keeper', 'economy', 'owner'],
  'the caravan master': ['Caravan Master', 'economy', 'merchant'],
  "the carriers' master": ["Carriers' Master", 'economy', 'overseer'],
  'the horse-coper': ['Horse Trader', 'economy', 'merchant'],
  'the beast trainer': ['Beast Trainer', 'other', 'master'],
  'the postmaster': ['Postmaster', 'government', 'clerk'],
  'the ferryman': ['Ferryman', 'other', 'agent'],
  'the boatwright': ['Boatwright', 'other', 'master'],
  'the master shipwright': ['Master Shipwright', 'economy', 'master'],
  'the barge master': ['Barge Master', 'economy', 'merchant'],
  'the harbour master': ['Harbor Master', 'government', 'harbor_master'],
  'the toll-keeper': ['Toll Keeper', 'government', 'overseer'],
  'the customs collector': ['Customs Inspector', 'government', 'overseer'],
  'the granary reeve': ['Granary Reeve', 'government', 'overseer'],
  'the bath-keeper': ['Bath Keeper', 'other', 'owner'],
  'the slaver': ['Slaver', 'economy', 'merchant'],
  'the slave-market master': ['Slave Market Master', 'economy', 'merchant'],
  'the auctioneer': ['Auctioneer', 'economy', 'merchant'],
  'the assayer': ['Assayer', 'government', 'clerk'],
  'the mint master': ['Master of Coin', 'government', 'guild_master'],
  'the watcher': ['Spy/Informant', 'criminal', 'contact'],
  'the chronicler': ['Bard/Chronicler', 'other', 'sage'],
  // the revised census's rows (PEOPLE-FACE-CENSUS, 2026-11-07): the senior forms and the rows that returned to FACE
  'the boat-headman': ['Fisherman', 'other', 'agent'],
  'the master furrier': ['Trade Factor', 'economy', 'merchant'],
  'the senior guild master': ['Guild Master', 'economy', 'guild'],
  'the tavern keeper': ['Tavern Owner', 'other', 'owner'],
  'the waystation keeper': ['Innkeeper', 'other', 'owner'],
  "the post's master": ['Caravan Master', 'economy', 'merchant'],
  "the exchange's steward": ['Trade Factor', 'economy', 'merchant'],
  'the stable keeper': ['Horse Trader', 'economy', 'merchant'],
  'the stable master': ['Horse Trader', 'economy', 'merchant'],
  'the beast master': ['Beast Trainer', 'other', 'master'],
  'the wharfinger': ['Dockworker/Stevedore', 'other', 'agent'],
  'the master of granaries': ['Grain Factor', 'economy', 'merchant'],
  'the warehouse factor': ['Warehouse Master', 'economy', 'overseer'],
  'the luxury merchant': ['Wealthiest Merchant', 'economy', 'merchant'],
  'the outfitter': ['Trade Factor', 'economy', 'merchant'],
  'the sage': ['Sage/Scholar', 'other', 'sage'],
  // ── Crafts ───────────────────────────────────────────────────────────────────────────────
  'the miller': ['Miller', 'other', 'owner'],
  'the maltster': ['Maltster', 'other', 'master'],
  'the smith': ['Master Blacksmith', 'other', 'master'],
  'the master metalworker': ['Master Metalworker', 'other', 'master'],
  'the jeweller': ['Jeweller', 'other', 'master'],
  'the carpenter': ['Master Carpenter', 'other', 'master'],
  'the thatcher': ['Thatcher', 'other', 'master'],
  'the cooper': ['Cooper', 'other', 'master'],
  'the apothecary': ['Apothecary', 'other', 'healer'],
  'the bowyer': ['Bowyer', 'other', 'master'],
  'the sawyer': ['Sawyer', 'other', 'master'],
  'the brewer': ['Head Brewer', 'other', 'guild'],
  'the vintner': ['Vintner', 'economy', 'merchant'],
  'the tanner': ['Tanner', 'other', 'master'],
  'the master tanner': ['Master Tanner', 'other', 'master'],
  'the fuller': ['Fuller', 'other', 'master'],
  'the dyer': ['Dyer', 'other', 'master'],
  'the master weaver': ['Master Weaver', 'other', 'master'],
  'the potter': ['Master Potter', 'other', 'master'],
  'the brickmaker': ['Brickmaker', 'other', 'master'],
  'the cobbler': ['Cobbler', 'other', 'master'],
  'the tailor': ['Tailor', 'other', 'master'],
  'the master butcher': ['Master Butcher', 'other', 'master'],
  'the master baker': ['Master Baker', 'other', 'master'],
  'the smelt master': ['Smelt Master', 'other', 'master'],
  'the chandler': ['Chandler', 'other', 'master'],
  'the glassmaker': ['Master Glassblower', 'other', 'master'],
  'the ropemaker': ['Ropemaker', 'other', 'master'],
  'the midwife': ['Midwife', 'other', 'healer'],
  'the woodcarver': ['Woodcarver', 'other', 'master'],
  'the scribe': ['Notary/Scrivener', 'government', 'clerk'],
  'the printer': ['Printer', 'other', 'master'],
  'the cartographer': ['Cartographer', 'other', 'clerk'],
  'the craft-guild master': ['Guild Master', 'economy', 'guild'],
  'the alchemist': ['Alchemist', 'magic', 'alchemist'],
  'the master smith': ['Master Blacksmith', 'other', 'master'],
  'the master carpenter': ['Master Carpenter', 'other', 'master'],
  'the senior craft-guild master': ['Guild Master', 'economy', 'guild'],
  // ── Religious ────────────────────────────────────────────────────────────────────────────
  'the shrine-keeper': ['Shrine Keeper', 'religious', 'priest'],
  'the priest': ['Priest', 'religious', 'priest'],
  'the abbot': ['Abbot/Abbess', 'religious', 'priest'],
  'the bishop': ['High Priest', 'religious', 'priest'],
  'the hospitaller': ['Temple Healer', 'religious', 'healer'],
  'the almoner': ['Almoner', 'religious', 'priest'],
  'the foundling-mother': ['Foundling Mother', 'religious', 'priest'],
  'the archdruid': ['Druid Elder', 'religious', 'druid'],
  'the grove elder': ['Grove Elder', 'religious', 'druid'],
  'the dean': ['High Priest', 'religious', 'priest'],
  'the senior abbot': ['Abbot/Abbess', 'religious', 'priest'],
  "the hospital's master": ['Temple Healer', 'religious', 'healer'],
  // ── Government (a seat house's face takes the tier's seat role; these are the non-seat rows) ──
  'the eldest': ['Elder', 'government', 'elder'],
  'the eldest householder': ['Elder', 'government', 'elder'],
  'the reeve': ['Reeve', 'government', 'overseer'],
  'the household elder': ['Elder', 'government', 'elder'],
  'the steward': ['House Steward', 'government', 'steward'],
  'the headman': ['Headman', 'government', 'elder'],
  'the chief administrator': ['Chief Administrator', 'government', 'clerk'],
  'the village elder': ['Elder', 'government', 'elder'],
  'the mayor': ['Mayor', 'government', 'mayor'],
  'the consortium speaker': ['Council Member', 'government', 'council'],
  'the first magnate': ['Alderman', 'government', 'council'],
  'the doge': ['Governor', 'government', 'mayor'],
  'the speaker of the assembly': ['Council Member', 'government', 'council'],
  'the monarch': ['Duke/Duchess', 'government', 'noble'],
  'the crier': ['Herald/Town Crier', 'government', 'clerk'],
  "the lord's appointee": ['House Steward', 'government', 'steward'],
  'the governor': ['Royal Envoy', 'government', 'advisor'],
  'the first councillor': ['Council Member', 'government', 'council'],
  // ── Infrastructure ───────────────────────────────────────────────────────────────────────
  'the magistrate': ['Chief Magistrate', 'government', 'magistrate'],
  'the gaoler': ['Prison Warden', 'government', 'warden'],
  'the workhouse master': ['Workhouse Master', 'government', 'overseer'],
  'the librarian': ['Librarian', 'other', 'sage'],
  'the chief magistrate': ['Chief Magistrate', 'government', 'magistrate'],
  'the prison warden': ['Prison Warden', 'government', 'warden'],
  // ── Defense ──────────────────────────────────────────────────────────────────────────────
  'the captain of the watch': ['Guard Captain', 'military', 'guard'],
  'the watch sergeant': ['Watch Sergeant', 'military', 'guard'],
  'the garrison commander': ['Garrison Commander', 'military', 'guard'],
  'the castellan': ['Castellan', 'military', 'captain'],
  'the company captain': ['Mercenary Captain', 'military', 'captain'],
  'the lodge master': ['Veteran Soldier', 'military', 'guard'],
  'the warden': ['Border Warden', 'military', 'warden'],
  'the militia captain': ['Guard Captain', 'military', 'guard'],
  'the watch captain': ['Guard Captain', 'military', 'guard'],
  'the watch commander': ['City Watch Chief', 'military', 'guard'],
  // ── Magic ────────────────────────────────────────────────────────────────────────────────
  'the wizard': ['Tower Wizard', 'magic', 'wizard'],
  'the guild archmage': ['Guild Archmage', 'magic', 'archmage'],
  'the chancellor': ['Grand Magister', 'magic', 'archmage'],
  'the enchanter': ['Enchanter', 'magic', 'wizard'],
  'the scroll scribe': ['Scroll Scribe', 'magic', 'clerk'],
  'the circle-keeper': ['Circle Keeper', 'magic', 'wizard'],
  'the healer': ['Healer', 'other', 'healer'],
  'the envoy': ['Foreign Ambassador', 'government', 'council'],
  'the hedge wizard': ['Hedge Wizard', 'magic', 'wizard'],
  // ── Adventuring ──────────────────────────────────────────────────────────────────────────
  'the charter master': ['Charter Master', 'other', 'master'],
  'the hiring master': ['Hiring Master', 'economy', 'overseer'],
  'the blade captain': ['Mercenary Captain', 'military', 'captain'],
  'the senior charter master': ['Charter Master', 'other', 'master'],
  // ── Criminal ─────────────────────────────────────────────────────────────────────────────
  'the fence': ['Local Fence', 'criminal', 'fence'],
  'the outlaw host': ['Bandit Contact', 'criminal', 'contact'],
  'the bandit contact': ['Bandit Contact', 'criminal', 'contact'],
  'the smuggler': ['Smuggler', 'criminal', 'smuggler'],
  'the gang boss': ['Gang Leader', 'criminal', 'lord'],
  'the guildmaster of thieves': ['Thieves Guild Master', 'criminal', 'guild_master'],
  'the front man': ['Racketeer', 'criminal', 'contact'],
  "the network's spider": ['Underground Broker', 'criminal', 'merchant'],
  'the undercity boss': ['Crime Lord', 'criminal', 'lord'],
  'the rookery boss': ['Gang Leader', 'criminal', 'lord'],
  'the whisper broker': ['Spy/Informant', 'criminal', 'contact'],
  'the black marketeer': ['Black Market Fence', 'criminal', 'fence'],
  'the killer': ['Contract Killer', 'criminal', 'contact'],
  "the guild's master": ['Assassin Guildmaster', 'criminal', 'master'],
  'the ringleader': ['Kidnapper', 'criminal', 'contact'],
  'the trafficker': ['Trafficker', 'criminal', 'merchant'],
  "the network's head": ['Smuggler Chief', 'criminal', 'smuggler'],
  // ── Entertainment ────────────────────────────────────────────────────────────────────────
  'the musician': ['Travelling Performer', 'other', 'bard'],
  'the theatre manager': ['Theatre Manager', 'other', 'owner'],
  'the impresario': ['Impresario', 'other', 'owner'],
  'the college master': ['Bard/Chronicler', 'other', 'sage'],
  'the house boss': ['Gambling Boss', 'criminal', 'owner'],
  'the madam': ['Madam', 'criminal', 'owner'],
  'the pit boss': ['Pit Boss', 'criminal', 'owner'],
  'the lanista': ['Lanista', 'military', 'master'],
  'the arena master': ['Arena Master', 'government', 'overseer'],
  'the fortune teller': ['Fortune Teller', 'other', 'sage'],
  'the troupe leader': ['Travelling Performer', 'other', 'bard'],
  'the district madam': ['Madam', 'criminal', 'owner'],
  // ── Exotic ───────────────────────────────────────────────────────────────────────────────
  'the planar factor': ['Planar Factor', 'economy', 'merchant'],
  'the dragon': ['Dragon', 'other', 'noble'],
  'the golem-master': ['Artificer', 'magic', 'master'],
  'the necromancer-overseer': ['Necromancer', 'magic', 'sorcerer'],
  'the dream-keeper': ['Dream Keeper', 'magic', 'wizard'],
  'the skydock master': ['Skydock Master', 'economy', 'harbor_master'],
  'the message-master': ['Message Master', 'government', 'clerk'],
});

/** A title the map does not hold (a stranger's house, a future family) draws by its SHELF. */
export const POOL_BY_SHELF = Object.freeze({
  Economy: ['Trade Factor', 'economy', 'merchant'],
  Crafts: ['Master Craftsman', 'other', 'master'],
  Religious: ['Priest', 'religious', 'priest'],
  Government: ['Council Member', 'government', 'council'],
  Infrastructure: ['City Clerk', 'government', 'clerk'],
  Defense: ['Guard Captain', 'military', 'guard'],
  Magic: ['Hedge Wizard', 'magic', 'wizard'],
  Adventuring: ['Retired Adventurer', 'other', 'owner'],
  Criminal: ['Racketeer', 'criminal', 'contact'],
  Entertainment: ['Travelling Performer', 'other', 'bard'],
  Exotic: ['Sage/Scholar', 'other', 'sage'],
});

/** The one row a title with no map row and no known shelf draws. */
const ANY_HOUSE = Object.freeze(['Local Figure', 'other', 'owner']);

/**
 * Does this role have a goal pool of its own? (NPC_FACTION_GOALS is keyed by role; a role it does
 * not hold draws its category's secrets as its goal — today's path for most roles too.)
 * @param {string} role @returns {boolean}
 */
export function roleHasGoalPool(role) {
  return Array.isArray(NPC_FACTION_GOALS[role]) && NPC_FACTION_GOALS[role].length > 0;
}

/**
 * The pool row for a face: by its title, else by its shelf, else the one generic row.
 * `fallback` is true when the role has no goal pool of its own (the category's pool serves), or
 * when the title itself has no row (the shelf served) — the writing wave's list.
 * @param {string | null | undefined} title the face's title ("the miller")
 * @param {string | null | undefined} shelf the family's shelf ('Crafts')
 * @returns {PoolRow & { fallback: boolean, via: 'title' | 'shelf' | 'generic' }}
 */
export function poolFor(title, shelf) {
  const byTitle = title ? POOL_BY_TITLE[title] : undefined;
  const byShelf = shelf ? POOL_BY_SHELF[shelf] : undefined;
  const row = byTitle || byShelf || ANY_HOUSE;
  const via = byTitle ? 'title' : byShelf ? 'shelf' : 'generic';
  return { role: row[0], category: row[1], titleKey: row[2], fallback: via !== 'title' || !roleHasGoalPool(row[0]), via };
}

/**
 * THE POWER BANDS (COHERENCE-POWERS-5, N2): the three bands a role's keywords place it in (npcGenerator.js ::
 * powerBandOfRole), each the card's `influence` word and its `power` span on the 1-10 scale the card and the PDF print —
 * the spans `generateNPCPowerLevel` has always drawn within (high 8-10, moderate 4-7, low 1-3), lowest first.
 */
export const POWER_BANDS = Object.freeze({
  low: Object.freeze({ level: 'low', floor: 1, span: 3, order: 0 }),
  moderate: Object.freeze({ level: 'moderate', floor: 4, span: 4, order: 1 }),
  high: Object.freeze({ level: 'high', floor: 8, span: 3, order: 2 }),
});

/**
 * The seat's pool row at a tier: the tier's seat role, the government pools.
 * @param {string | null | undefined} tier
 * @returns {PoolRow & { fallback: boolean, via: 'seat' }}
 */
export function seatPoolFor(tier) {
  const role = SEAT_ROLE_BY_TIER[String(tier || '').toLowerCase()] || 'Mayor';
  return { role, category: 'government', titleKey: role === 'Elder' ? 'elder' : 'mayor', fallback: !roleHasGoalPool(role), via: 'seat' };
}

// ── THE PERSON HOOK'S POOL (PEOPLE-3 HOOKS, 2026-11-07) ────────────────────────────────────
// The owner: "one plot hook per NPC rather than multiple". The NPC hook pool
// (data/npcData.js :: NPC_FACTION_LOYALTY — one list per category, plus the small settlement's)
// was keyed by the NPC's role CATEGORY; it is RE-HOMED here: keyed by the face's TITLE (its row
// in POOL_BY_TITLE), else by its family's SHELF (POOL_BY_SHELF), so a card draws the hook pool
// of the house it stands for. No new prose (M-4): the pools are today's; a card that reaches its
// pool only through the shelf or the generic row is a FALLBACK, listed for the writing wave
// (W7 HOOKS), which authors hooks by title afterwards.

/** The hook pools a face can be keyed to: the category lists of NPC_FACTION_LOYALTY. */
export const HOOK_POOLS = Object.freeze(POOL_CATEGORIES.filter((c) => Array.isArray(NPC_FACTION_LOYALTY[c]) && NPC_FACTION_LOYALTY[c].length > 0));

/**
 * The person hook's pool for a face: by its title, else by its shelf, else the generic row; the
 * seat (`seat: true`) draws the government pool whatever its house's title says, as its card does.
 * @param {string | null | undefined} title @param {string | null | undefined} shelf
 * @param {{ seat?: boolean, category?: string | null }} [options] `category`: a minted face's own
 *   row category (people/mintTitles.js), which keys its pool the way a title does
 * @returns {{ pool: string, via: 'title' | 'shelf' | 'generic' | 'seat' | 'mint', fallback: boolean }}
 */
export function hookPoolFor(title, shelf, options = {}) {
  if (options.seat) return { pool: 'government', via: 'seat', fallback: false };
  if (options.category) {
    const pool = HOOK_POOLS.includes(options.category) ? options.category : 'other';
    return { pool, via: 'mint', fallback: pool !== options.category };
  }
  const { category, via } = poolFor(title, shelf);
  const pool = HOOK_POOLS.includes(category) ? category : 'other';
  return { pool, via, fallback: via !== 'title' || pool !== category };
}

// ── ITEM 15: THE SECRET AND THE PRESENTATION BY TITLE (the allegiance train, car 4, ALLEGIANCE-CAR4, 2026-11-09;
// the design §6.5, the chair's ruling J-16; the writers' records WRITE_PEOPLE_2026-11-08.md and
// WRITE_PEOPLE_3_2026-11-08.md) ──────────────────────────────────────────────────────────────────────────────────
// The 147 fallback titles' lines (data/people/titleSecretsPresentations.js) are reached HERE, by the face's title: a
// title the table holds draws its secret and its presentation from its own three; every other title — the house
// titles that hold their own pools, the mints' titles, a stranger's house — keeps its CATEGORY pool, as today. NO GOAL
// BY TITLE (J-16): the goal is the goal families' (people/goals.js), which read the house and its record, never this.

/**
 * The secret and presentation lines a face's title holds, or null for a title the table does not write.
 * @param {string | null | undefined} title the face's title ("the miller")
 * @returns {{ secrets: ReadonlyArray<Readonly<{ secret: string, stakes: string }>>, presentations: ReadonlyArray<Readonly<{ impression: string, disposition: string, behaviour: string }>> } | null}
 */
export function titleLinesFor(title) {
  const key = typeof title === 'string' ? title : '';
  if (!key || !Object.prototype.hasOwnProperty.call(TITLE_SECRETS, key)) return null;
  return { secrets: TITLE_SECRETS[key], presentations: TITLE_PRESENTATIONS[key] || [] };
}

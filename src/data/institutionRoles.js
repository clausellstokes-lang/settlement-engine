/**
 * data/institutionRoles.js — WHO SPEAKS FOR A ROW (ADDENDUM 18 ruling 25; car 8b-W-18l).
 *
 * THE OWNER'S WORD, 2026-09-13 ~09:2x: *"we do not objectively say the religious authorities
 * or royals or the hall but instead roles and titles that reference them such as 'a subject of
 * the king,' 'a local priest said,' 'dock workers' as they pertain to each power and tier where
 * appropriate and a wide variety of options to just plug in on a roll."*
 *
 * WHAT THIS IS. The SOURCE TAG on a face (`hall`, `guild`, `watch` …) stays the machine's
 * word: it is the draw's filter and the refuter's seat, and the reader never sees it. What the
 * PAGE PRINTS for that source is a ROLE drawn at render, seeded, out of this table — keyed on
 * the town's OWN CATALOGUE ROWS, because ruling 21.1 is that a source speaks through the rows
 * that back it. A `Town hall` row lends 'a clerk in the hall'; a `Craft guilds (5-15)` row
 * lends 'a guild factor'; a `Docks/port facilities` row lends 'dock workers'.
 *
 * ── THE FOUR RULES THIS TABLE OBEYS ──────────────────────────────────────────────────
 * 1. A ROLE EXISTS ONLY WHERE ITS ROW DOES (ruling 25 edge (b)). This file is keyed on the
 *    catalogue row and nothing else, so a role cannot outlive the institution that lends it:
 *    `faceSources.js` `rolesOf` walks the town's LIVE rows and collects only what they carry.
 * 2. NO MINTED PROPER NAME, EVER. Every role here is a common-noun phrase or an OFFICE TITLE.
 *    The engine mints and owns a person's name and a person's fate (THE PROMISE, and product
 *    scope: never a NAMED character's fate), and a title as a speaker fixes neither. 'the
 *    mayor' is lawful; 'Mayor Aldric' is not, and the pin in the suite is a regex over every
 *    entry, not a habit.
 * 3. AN `office: true` ROLE JOINS THE ROLL ONLY WHERE THE TOWN'S ROSTER PRINTS THAT OFFICE
 *    (ruling 25 edge (a), the owner overruling the chair: *"I would say that its both … Where
 *    a role exists in the dossier add it to the pool with the licensed"*). The indefinite roles
 *    are licensed wherever the row resolves; the named offices are gated on `officesOf`, the
 *    same reader the institution table uses, so an office the roster does not print is never
 *    spoken. The office strings are the NPC generator's own (`TIER_MANDATORY_ROLES` and
 *    `STRESS_MANDATORY_ROLES`, src/generators/npcGenerator.js), matched case-insensitively.
 * 4. NUMBER IS DECLARED, NOT GUESSED. Each entry carries `n: 'sg'` or `n: 'pl'`, and the
 *    `{v:…}` verb slot beside the role reads it. 'dock workers say', 'a wherryman says'.
 * 5. A ROW THAT LENDS TWO SOURCES SPLITS ITS ROLES BETWEEN THEM (`for`). ⛔ FOUND BY RENDERING
 *    THE FIRST RE-CUT POOL, not by reasoning: `Town hall` and `City hall` are the only two rows
 *    that lend TWO source words — `hall` AND `court`, because `COURT_NAMES` seats the court
 *    wherever the town's meeting hall is (`faceSources.js`, verbatim from the generator's
 *    `hasCourtSystem`). Without a split, a `[court]` face drew 'a clerk in the hall' and the
 *    court spoke in the hall's voice. An entry may therefore declare `for: ['court']`; an
 *    entry with no `for` goes to every source its row lends, which is every other row here.
 *
 * ── ⛔ THE REALM ROLES ARE NOT HERE, AND THE REASON IS RECORDED ───────────────────────
 * Ruling 25 licenses a realm role ('a subject of the king', 'a crown tenant') ONLY where the
 * engine records that form of rule, *"setting-agnostic: never a king the engine did not make"*.
 * Searched, 2026-09-13: `src/generators/power/rulingStructure.js` records NO form of rule at
 * all (no `monarchy`, no `lordship`), and the only occurrence anywhere in the domain is
 * `src/domain/causalState.js:846`, a REGEX over a government-type string used to lift law and
 * order — a classifier, not a recorded field, and it fires on eleven other forms besides.
 * So no free-standing realm role is admitted. What IS recorded is the LORDSHIP CLASS ROW
 * (`src/domain/factionBacking.js` INSTITUTION_CLASSES.lordship): `Lord's reeve`, `Lord's
 * steward`, `Lord's appointee`, `Noble governor`, `Royal seat`, `Palace/government complex`.
 * Those rows are the engine's own record that somebody holds the town from outside it, and
 * the realm-flavoured roles ride THOSE ROWS and nothing else — which is rule 1 above applied
 * strictly, and is stricter than the ruling requires. Reported OPEN to the chair.
 *
 * ⚠ CUSTOM CONTENT MAY NOT DECLARE ROLES TODAY. Ruling 25 says *"custom content may add roles
 * to its rows"*, and the natural home is a `roles` field on the custom-content manifest
 * (schema/custom-content.manifest.json). THAT FIELD IS NOT ADDED HERE: the manifest generator
 * REWRITES migration 185's frozen block from the manifest, so a new manifest field rewrites a
 * frozen migration — an OWNER-GATED persistence surface. See the TODO at CUSTOM_ROLE_FIELD
 * below. A custom row therefore falls back to its source's roster like any row this table does
 * not name, which is lawful and merely less specific.
 *
 * PURE DATA. No imports, no clock, no RNG.
 *
 * @enforced-by tests/domain/institutionRoles.test.js
 */

/**
 * ⛔ OWNER-GATED, NOT IMPLEMENTED (car 8b-W-18l). The custom-content manifest field that would
 * let a custom institution row declare its own speakers, named here so the next seat does not
 * have to rediscover which surface it is:
 *
 *   TODO(owner-gated): `roles` on the institution rows of `schema/custom-content.manifest.json`.
 *   Adding it makes the manifest generator rewrite MIGRATION 185's FROZEN BLOCK, which is a
 *   persistence-shape change and the owner's call, not the chair's. Until it is signed, a
 *   custom row draws from its source's fallback roster (`SOURCE_FALLBACK_ROLES`).
 *
 * @type {string}
 */
export const CUSTOM_ROLE_FIELD = 'roles';

/**
 * @typedef {object} RoleEntry
 * @property {string} role the phrase the page prints — a common-noun phrase or an office title
 * @property {'sg'|'pl'} n grammatical number, which the `{v:…}` slot beside it reads
 * @property {true} [office] an OFFICE TITLE: admitted only where the town's roster prints it
 * @property {ReadonlyArray<string>} [for] the source words this entry speaks for, where its row
 *   lends more than one; absent means every source the row lends
 */

/**
 * ⭐ THE TABLE, BY CATALOGUE ROW NAME (`src/data/institutionalCatalog.js`).
 *
 * A row absent from this table lends no role of its own and its source falls back to
 * `SOURCE_FALLBACK_ROLES`, so the table may grow a row at a time and never goes total-or-broken.
 *
 * @type {Readonly<Record<string, ReadonlyArray<RoleEntry>>>}
 */
export const INSTITUTION_ROLES = Object.freeze({
  // ── THE HALL ────────────────────────────────────────────────────────────────────────
  // ⛔ THE TWO SPLIT ROWS. A meeting hall seats BOTH the `hall` and the `court` (the
  // generator's own `hasCourtSystem` reading), so every entry here declares which of the two
  // it speaks for. Without this a `[court]` face drew 'a clerk in the hall' — found by
  // rendering the first re-cut pool.
  'Town hall': Object.freeze([
    { role: 'a clerk in the hall', n: 'sg', for: ['hall'] },
    { role: 'one of the aldermen', n: 'sg', for: ['hall'] },
    { role: "the hall's doorkeeper", n: 'sg', for: ['hall'] },
    { role: 'the clerks who keep the hall', n: 'pl', for: ['hall'] },
    { role: 'a man who sits on the council', n: 'sg', for: ['hall'] },
    { role: 'the mayor', n: 'sg', office: true, for: ['hall'] },
    { role: 'a bailiff', n: 'sg', for: ['court'] },
    { role: 'a clerk of the court', n: 'sg', for: ['court'] },
    { role: 'one who waits on the court day', n: 'sg', for: ['court'] },
    { role: 'the officers of the court', n: 'pl', for: ['court'] },
    { role: 'the chief magistrate', n: 'sg', office: true, for: ['court'] },
  ]),
  'City hall': Object.freeze([
    { role: 'a clerk in the hall', n: 'sg', for: ['hall'] },
    { role: 'one of the aldermen', n: 'sg', for: ['hall'] },
    { role: "a secretary of the city's offices", n: 'sg', for: ['hall'] },
    { role: 'the under-clerks of the hall', n: 'pl', for: ['hall'] },
    { role: 'a woman who keeps the hall books', n: 'sg', for: ['hall'] },
    { role: 'the mayor', n: 'sg', office: true, for: ['hall'] },
    { role: 'the governor', n: 'sg', office: true, for: ['hall'] },
    { role: 'a bailiff', n: 'sg', for: ['court'] },
    { role: 'a clerk of the court', n: 'sg', for: ['court'] },
    { role: 'the officers of the court', n: 'pl', for: ['court'] },
    { role: 'the chief magistrate', n: 'sg', office: true, for: ['court'] },
  ]),
  'Mayor and council': Object.freeze([
    { role: 'one of the council', n: 'sg' },
    { role: "the council's clerk", n: 'sg' },
    { role: 'the men who sit on the council', n: 'pl' },
    { role: 'the mayor', n: 'sg', office: true },
    { role: 'a council member', n: 'sg', office: true },
  ]),
  'Town council': Object.freeze([
    { role: 'one of the council', n: 'sg' },
    { role: "the council's clerk", n: 'sg' },
    { role: 'a man who sits at the council table', n: 'sg' },
    { role: 'the council', n: 'pl' },
    { role: 'a council member', n: 'sg', office: true },
  ]),
  'City administration': Object.freeze([
    { role: 'a clerk of the administration', n: 'sg' },
    { role: 'one of the city officers', n: 'sg' },
    { role: 'the offices that keep the city', n: 'pl' },
    { role: 'the governor', n: 'sg', office: true },
  ]),
  'City-state government': Object.freeze([
    { role: 'an officer of the state', n: 'sg' },
    { role: 'one of the magistrates', n: 'sg' },
    { role: "the state's clerks", n: 'pl' },
    { role: 'the governor', n: 'sg', office: true },
  ]),

  // ── THE ELDERS (the tiers below town keep the record of custom) ──────────────────────
  'Informal elder consensus': Object.freeze([
    { role: 'one of the elders', n: 'sg' },
    { role: 'the eldest of the holdings', n: 'sg' },
    { role: 'the older heads here', n: 'pl' },
    { role: 'the elder', n: 'sg', office: true },
  ]),
  'Head-of-household consensus': Object.freeze([
    { role: 'one of the household heads', n: 'sg' },
    { role: 'the heads of the households', n: 'pl' },
    { role: 'a woman who speaks for her household', n: 'sg' },
    { role: 'the elder', n: 'sg', office: true },
  ]),
  'Household elder': Object.freeze([
    { role: 'the household everyone goes to', n: 'sg' },
    { role: 'one of the elders', n: 'sg' },
    { role: 'the older heads here', n: 'pl' },
    { role: 'the elder', n: 'sg', office: true },
  ]),
  'Village elder': Object.freeze([
    { role: 'one of the elders', n: 'sg' },
    { role: 'the elders of the place', n: 'pl' },
    { role: 'a woman old enough to remember the custom', n: 'sg' },
    { role: 'the elder', n: 'sg', office: true },
  ]),
  'Village headman': Object.freeze([
    { role: 'the headman', n: 'sg' },
    { role: "the headman's people", n: 'pl' },
    { role: 'one of the elders', n: 'sg' },
  ]),
  'Village reeve': Object.freeze([
    { role: 'the reeve', n: 'sg' },
    { role: "the reeve's man", n: 'sg' },
    { role: 'one of the elders', n: 'sg' },
  ]),

  // ── THE LORDSHIP ROWS — the engine's own record that the town is held from outside it.
  // The realm-flavoured roles ride HERE and nowhere else (see the header note).
  "Lord's reeve": Object.freeze([
    { role: "the lord's reeve", n: 'sg' },
    { role: "a man of the lord's household", n: 'sg' },
    { role: 'a tenant who owes the lord work', n: 'sg' },
    { role: "the reeve's people", n: 'pl' },
  ]),
  "Lord's steward": Object.freeze([
    { role: "the lord's steward", n: 'sg' },
    { role: "a clerk of the lord's office", n: 'sg' },
    { role: 'a tenant of the estate', n: 'sg' },
    { role: "the steward's people", n: 'pl' },
  ]),
  "Lord's appointee": Object.freeze([
    { role: "the lord's appointee", n: 'sg' },
    { role: "a man who holds his place from the lord", n: 'sg' },
    { role: 'a tenant who owes the lord work', n: 'sg' },
  ]),
  'Noble governor': Object.freeze([
    { role: "the governor's secretary", n: 'sg' },
    { role: 'an officer of the governor', n: 'sg' },
    { role: 'a subject of the crown', n: 'sg' },
    { role: "the governor's household", n: 'pl' },
    { role: 'the governor', n: 'sg', office: true },
  ]),
  'Royal seat': Object.freeze([
    { role: 'a clerk of the seat', n: 'sg' },
    { role: 'a subject of the crown', n: 'sg' },
    { role: 'a crown tenant', n: 'sg' },
    { role: 'the household of the seat', n: 'pl' },
  ]),
  'Palace/government complex': Object.freeze([
    { role: 'a secretary in the complex', n: 'sg' },
    { role: 'one of the crown clerks', n: 'sg' },
    { role: 'a subject of the crown', n: 'sg' },
    { role: 'the offices of the complex', n: 'pl' },
    { role: 'the governor', n: 'sg', office: true },
  ]),

  // ── THE REGISTER (a house of faith that STANDS HERE) ────────────────────────────────
  'Parish church': Object.freeze([
    { role: 'a local priest', n: 'sg' },
    { role: "the chapel's warden", n: 'sg' },
    { role: 'one of the congregation', n: 'sg' },
    { role: 'the people who keep the register', n: 'pl' },
    { role: 'a woman who sings in the choir', n: 'sg' },
    { role: 'the parish priest', n: 'sg', office: true },
  ]),
  'Parish churches (2-5)': Object.freeze([
    { role: 'a local priest', n: 'sg' },
    { role: 'a warden of one of the parishes', n: 'sg' },
    { role: 'one of the congregation', n: 'sg' },
    { role: 'the parish clerks', n: 'pl' },
    { role: 'the parish priest', n: 'sg', office: true },
    { role: 'the high priest', n: 'sg', office: true },
  ]),
  'Parish churches (10-30)': Object.freeze([
    { role: 'a priest of one of the parishes', n: 'sg' },
    { role: 'a parish warden', n: 'sg' },
    { role: 'one of the congregation', n: 'sg' },
    { role: 'the parish clerks', n: 'pl' },
    { role: 'the high priest', n: 'sg', office: true },
  ]),
  'Parish churches (50-100+)': Object.freeze([
    { role: 'a priest of one of the parishes', n: 'sg' },
    { role: 'a parish warden', n: 'sg' },
    { role: 'the clerks of the parishes', n: 'pl' },
    { role: 'a woman who keeps a parish door', n: 'sg' },
    { role: 'the high priest', n: 'sg', office: true },
  ]),
  'Cathedral (10,000+ only)': Object.freeze([
    { role: 'a canon', n: 'sg' },
    { role: 'a cathedral clerk', n: 'sg' },
    { role: 'one of the vergers', n: 'sg' },
    { role: 'the cathedral chapter', n: 'pl' },
    { role: 'the high priest', n: 'sg', office: true },
  ]),
  'Great cathedral': Object.freeze([
    { role: 'a canon', n: 'sg' },
    { role: 'a cathedral clerk', n: 'sg' },
    { role: 'one of the vergers', n: 'sg' },
    { role: 'the cathedral chapter', n: 'pl' },
    { role: 'the high priest', n: 'sg', office: true },
  ]),
  'Monastery or friary': Object.freeze([
    { role: 'one of the brothers', n: 'sg' },
    { role: "the house's almoner", n: 'sg' },
    { role: 'the brothers of the house', n: 'pl' },
    { role: 'a lay servant of the house', n: 'sg' },
  ]),
  'Multiple monasteries': Object.freeze([
    { role: 'one of the brothers', n: 'sg' },
    { role: 'an almoner of one of the houses', n: 'sg' },
    { role: 'the religious houses', n: 'pl' },
    { role: 'a lay servant of one of the houses', n: 'sg' },
  ]),
  'Major monasteries (5-10)': Object.freeze([
    { role: 'one of the brothers', n: 'sg' },
    { role: 'an almoner of one of the houses', n: 'sg' },
    { role: 'the religious houses', n: 'pl' },
    { role: 'a clerk of the houses', n: 'sg' },
  ]),

  // ── THE GUILDS ──────────────────────────────────────────────────────────────────────
  'Craft guilds (5-15)': Object.freeze([
    { role: 'a guild factor', n: 'sg' },
    { role: 'a journeyman', n: 'sg' },
    { role: "the dyers' warden", n: 'sg' },
    { role: 'the guilds of the town', n: 'pl' },
    { role: 'a master of one of the crafts', n: 'sg' },
    { role: 'the guild master', n: 'sg', office: true },
  ]),
  'Craft guilds (30-80)': Object.freeze([
    { role: 'a guild factor', n: 'sg' },
    { role: 'a journeyman', n: 'sg' },
    { role: "a warden of one of the guilds", n: 'sg' },
    { role: 'the guilds of the town', n: 'pl' },
    { role: 'an apprentice out of his time', n: 'sg' },
    { role: 'the guild master', n: 'sg', office: true },
  ]),
  'Craft guilds (100-150+)': Object.freeze([
    { role: 'a guild factor', n: 'sg' },
    { role: 'a journeyman', n: 'sg' },
    { role: 'a warden of one of the guilds', n: 'sg' },
    { role: 'the guilds of the city', n: 'pl' },
    { role: 'a clerk of the guild hall', n: 'sg' },
    { role: 'the guild master', n: 'sg', office: true },
  ]),

  // ── THE TAVERN ──────────────────────────────────────────────────────────────────────
  Alehouse: Object.freeze([
    { role: 'a carter at the alehouse', n: 'sg' },
    { role: 'the potboy', n: 'sg' },
    { role: 'a woman at the long table', n: 'sg' },
    { role: 'the drinkers at the alehouse', n: 'pl' },
  ]),
  'Ale house': Object.freeze([
    { role: 'a carter at the alehouse', n: 'sg' },
    { role: 'the potboy', n: 'sg' },
    { role: 'a woman at the long table', n: 'sg' },
    { role: 'the drinkers at the alehouse', n: 'pl' },
  ]),
  'Taverns (5-20)': Object.freeze([
    { role: 'a carter at the tavern', n: 'sg' },
    { role: 'the potboy', n: 'sg' },
    { role: 'a woman at the long table', n: 'sg' },
    { role: 'the drinkers at the tavern', n: 'pl' },
    { role: 'a tavern keeper', n: 'sg' },
    { role: 'a man who drinks where the carters drink', n: 'sg' },
  ]),
  'Inns and taverns (district)': Object.freeze([
    { role: 'a carter at one of the taverns', n: 'sg' },
    { role: 'a potboy of the district', n: 'sg' },
    { role: 'a woman at the long table', n: 'sg' },
    { role: 'the drinkers of the district', n: 'pl' },
    { role: 'an innkeeper', n: 'sg' },
    { role: 'a man who drinks where the carters drink', n: 'sg' },
  ]),
  'Coaching inn': Object.freeze([
    { role: 'the ostler', n: 'sg' },
    { role: 'a driver off the coach', n: 'sg' },
    { role: 'the inn servants', n: 'pl' },
    { role: 'an innkeeper', n: 'sg' },
  ]),
  "Travelers' inn": Object.freeze([
    { role: 'the ostler', n: 'sg' },
    { role: 'a guest at the inn', n: 'sg' },
    { role: 'the inn servants', n: 'pl' },
    { role: 'an innkeeper', n: 'sg' },
  ]),
  'Wayside inn': Object.freeze([
    { role: 'the ostler', n: 'sg' },
    { role: 'a guest at the inn', n: 'sg' },
    { role: 'the inn servants', n: 'pl' },
    { role: 'an innkeeper', n: 'sg' },
  ]),
  'Inn (multiple)': Object.freeze([
    { role: 'the ostler at one of the inns', n: 'sg' },
    { role: 'a guest at one of the inns', n: 'sg' },
    { role: 'the inn servants', n: 'pl' },
    { role: 'an innkeeper', n: 'sg' },
  ]),

  // ── THE MARKET ──────────────────────────────────────────────────────────────────────
  'Periodic market': Object.freeze([
    { role: 'a stallholder', n: 'sg' },
    { role: 'a woman who sells at the market', n: 'sg' },
    { role: 'the people who bring goods in', n: 'pl' },
    { role: 'a buyer off the road', n: 'sg' },
  ]),
  'Weekly market': Object.freeze([
    { role: 'a stallholder', n: 'sg' },
    { role: 'the market clerk', n: 'sg' },
    { role: 'a woman who sells at the market', n: 'sg' },
    { role: 'the stallholders', n: 'pl' },
    { role: 'a buyer off the road', n: 'sg' },
  ]),
  'Market square': Object.freeze([
    { role: 'a stallholder', n: 'sg' },
    { role: 'the market clerk', n: 'sg' },
    { role: 'a porter in the square', n: 'sg' },
    { role: 'the stallholders', n: 'pl' },
    { role: 'a woman who sells at the market', n: 'sg' },
  ]),
  'Multiple market squares': Object.freeze([
    { role: 'a stallholder', n: 'sg' },
    { role: 'a clerk of one of the markets', n: 'sg' },
    { role: 'a porter in the square', n: 'sg' },
    { role: 'the stallholders', n: 'pl' },
  ]),
  'Daily markets': Object.freeze([
    { role: 'a stallholder', n: 'sg' },
    { role: 'a market clerk', n: 'sg' },
    { role: 'a porter in the square', n: 'sg' },
    { role: 'the stallholders', n: 'pl' },
  ]),
  'District markets (5-10)': Object.freeze([
    { role: 'a stallholder', n: 'sg' },
    { role: 'a clerk of one of the markets', n: 'sg' },
    { role: 'the stallholders of the district', n: 'pl' },
    { role: 'a porter in the square', n: 'sg' },
  ]),
  'Annual fair': Object.freeze([
    { role: 'a trader come in for the fair', n: 'sg' },
    { role: 'the fair clerk', n: 'sg' },
    { role: 'the traders at the fair', n: 'pl' },
  ]),
  'Major annual fairs': Object.freeze([
    { role: 'a trader come in for the fair', n: 'sg' },
    { role: 'a clerk of the fair', n: 'sg' },
    { role: 'the traders at the fairs', n: 'pl' },
  ]),
  'Fish market': Object.freeze([
    { role: 'a fish seller', n: 'sg' },
    { role: 'the women who gut the catch', n: 'pl' },
    { role: 'a buyer at the fish market', n: 'sg' },
  ]),
  'International trade center': Object.freeze([
    { role: 'a factor of one of the houses', n: 'sg' },
    { role: 'a clerk of the trade offices', n: 'sg' },
    { role: 'the factors who keep offices here', n: 'pl' },
    { role: 'the wealthiest merchant', n: 'sg', office: true },
  ]),
  "Caravan masters' exchange": Object.freeze([
    { role: 'a caravan master', n: 'sg' },
    { role: 'a clerk of the exchange', n: 'sg' },
    { role: 'the caravan masters', n: 'pl' },
  ]),
  'Black market': Object.freeze([
    { role: 'a seller who does not give a name', n: 'sg' },
    { role: 'a buyer who came after dark', n: 'sg' },
    { role: 'the people who deal there', n: 'pl' },
  ]),
  'Black market bazaar': Object.freeze([
    { role: 'a seller who does not give a name', n: 'sg' },
    { role: 'a buyer who came after dark', n: 'sg' },
    { role: 'the people who deal there', n: 'pl' },
  ]),
  'Whisper market': Object.freeze([
    { role: 'a seller who does not give a name', n: 'sg' },
    { role: 'a broker of the whisper market', n: 'sg' },
    { role: 'the people who deal there', n: 'pl' },
  ]),
  'Slave market': Object.freeze([
    { role: 'a clerk of the market', n: 'sg' },
    { role: 'a buyer at the block', n: 'sg' },
    { role: 'the people who work the yard', n: 'pl' },
  ]),
  'Slave market district': Object.freeze([
    { role: 'a clerk of the market', n: 'sg' },
    { role: 'a buyer at the block', n: 'sg' },
    { role: 'the people who work the yard', n: 'pl' },
  ]),

  // ── THE COURT ───────────────────────────────────────────────────────────────────────
  Courthouse: Object.freeze([
    { role: 'a bailiff', n: 'sg' },
    { role: 'a clerk of the court', n: 'sg' },
    { role: 'one who waits on the court', n: 'sg' },
    { role: 'the officers of the court', n: 'pl' },
    { role: 'a woman who brought a matter to the court', n: 'sg' },
    { role: 'the chief magistrate', n: 'sg', office: true },
  ]),
  'Multiple courthouses': Object.freeze([
    { role: 'a bailiff', n: 'sg' },
    { role: 'a clerk of one of the courts', n: 'sg' },
    { role: 'the officers of the courts', n: 'pl' },
    { role: 'the chief magistrate', n: 'sg', office: true },
  ]),
  'Multiple court buildings': Object.freeze([
    { role: 'a bailiff', n: 'sg' },
    { role: 'a clerk of one of the courts', n: 'sg' },
    { role: 'the officers of the courts', n: 'pl' },
    { role: 'the chief magistrate', n: 'sg', office: true },
  ]),
  'Democratic assembly': Object.freeze([
    { role: 'one who speaks at the assembly', n: 'sg' },
    { role: "the assembly's clerk", n: 'sg' },
    { role: 'the men who sit in the assembly', n: 'pl' },
    { role: 'the chief magistrate', n: 'sg', office: true },
  ]),

  // ── THE GATE AND THE WORKS ──────────────────────────────────────────────────────────
  'Gates (if walled)': Object.freeze([
    { role: 'the gatekeeper', n: 'sg' },
    { role: 'a man on the gate', n: 'sg' },
    { role: 'whoever keeps the toll book', n: 'sg' },
    { role: 'the men who hold the way in', n: 'pl' },
  ]),
  'Town walls': Object.freeze([
    { role: 'the gatekeeper', n: 'sg' },
    { role: 'a man on the gate', n: 'sg' },
    { role: 'whoever keeps the toll book', n: 'sg' },
    { role: 'the men who hold the way in', n: 'pl' },
    { role: 'a woman who sweeps the gatehouse', n: 'sg' },
  ]),
  'City walls and gates': Object.freeze([
    { role: 'a gatekeeper', n: 'sg' },
    { role: 'a man on one of the gates', n: 'sg' },
    { role: 'whoever keeps the toll book', n: 'sg' },
    { role: 'the men who hold the ways in', n: 'pl' },
    { role: 'a serjeant on the wall', n: 'sg' },
  ]),
  'Massive walls and fortifications': Object.freeze([
    { role: 'a gatekeeper', n: 'sg' },
    { role: 'a man on one of the gates', n: 'sg' },
    { role: 'the men who hold the ways in', n: 'pl' },
  ]),
  Palisade: Object.freeze([
    { role: 'whoever is on the gap tonight', n: 'sg' },
    { role: 'a man at the stakes', n: 'sg' },
    { role: 'the people who keep the line', n: 'pl' },
  ]),
  'Palisade or earthworks': Object.freeze([
    { role: 'whoever is on the gap tonight', n: 'sg' },
    { role: 'a man at the bank', n: 'sg' },
    { role: 'the people who keep the line', n: 'pl' },
  ]),

  // ── THE WATCH ───────────────────────────────────────────────────────────────────────
  'Town watch': Object.freeze([
    { role: 'one of the watch', n: 'sg' },
    { role: 'a night patrolman', n: 'sg' },
    { role: 'the watch', n: 'pl' },
    { role: 'a man who walks the circuit', n: 'sg' },
    { role: 'the guard captain', n: 'sg', office: true },
  ]),
  'Professional city watch': Object.freeze([
    { role: 'one of the watch', n: 'sg' },
    { role: 'a night patrolman', n: 'sg' },
    { role: 'the watch', n: 'pl' },
    { role: 'a serjeant of the watch', n: 'sg' },
    { role: 'the guard captain', n: 'sg', office: true },
    { role: 'the city watch chief', n: 'sg', office: true },
  ]),

  // ── THE MUSTER ──────────────────────────────────────────────────────────────────────
  'Citizen militia': Object.freeze([
    { role: 'one who turns out with the muster', n: 'sg' },
    { role: 'a man on the muster roll', n: 'sg' },
    { role: 'the people who turn out', n: 'pl' },
    { role: 'a woman who keeps a bill behind her door', n: 'sg' },
  ]),
  'Household levy': Object.freeze([
    { role: 'a man of the levy', n: 'sg' },
    { role: 'the households that owe the levy', n: 'pl' },
    { role: 'one who turns out with the muster', n: 'sg' },
  ]),

  // ── THE GARRISON ────────────────────────────────────────────────────────────────────
  Garrison: Object.freeze([
    { role: 'a soldier of the garrison', n: 'sg' },
    { role: 'a serjeant of the garrison', n: 'sg' },
    { role: 'the garrison', n: 'pl' },
    { role: 'a man who draws the wage', n: 'sg' },
    { role: 'the garrison commander', n: 'sg', office: true },
  ]),
  'Multiple garrisons': Object.freeze([
    { role: 'a soldier of one of the garrisons', n: 'sg' },
    { role: 'a serjeant of the garrison', n: 'sg' },
    { role: 'the garrisons', n: 'pl' },
    { role: 'the garrison commander', n: 'sg', office: true },
  ]),
  Barracks: Object.freeze([
    { role: 'a soldier out of the barracks', n: 'sg' },
    { role: 'a serjeant of the barracks', n: 'sg' },
    { role: 'the men in the barracks', n: 'pl' },
    { role: 'the garrison commander', n: 'sg', office: true },
  ]),

  // ── ⚠⚠ THREE SEATING GAPS FOUND BY WRITING THIS TABLE, REPORTED AND NOT FIXED HERE ──
  // Writing a row-keyed table forced every row through `sourcesOfRowName`, and three rows
  // that plainly SHOULD seat a source do not. All three are car 8b-W-18c's keyword lists, not
  // this car's, and changing one moves `sourcesOf` — which moves the face draw on any town
  // that holds the row, which is a DECLARED TEXT SHIFT and a car of its own. So they are
  // named here, pinned as unreachable in the suite, and reported OPEN:
  //
  //   `Multiple monasteries` and `Major monasteries (5-10)` seat NO `register`, because
  //     `REGISTER_NAMES` spells `monastery` and the plural rows read `monasteries`.
  //     `factionBacking.js`'s own faith_house keywords spell the stem `monaster`, so the two
  //     readers of the same fact already disagree. The one-word fix is the stem.
  //   `Ale house` seats NO `tavern`, because `TAVERN_NAMES` spells `alehouse` and the
  //     catalogue carries BOTH `Alehouse` and `Ale house` as separate rows.
  //
  // ── ⚠ AND THE ROWS THE BRIEF NAMES WHOSE SOURCE DOES NOT EXIST AT ALL ───────────────
  // `faceSources.js` `sourcesOf` seats twelve sources, and NEITHER a dock row NOR a burial
  // row lends any of them: there is no `docks` source and no `ground` source in the kernel's
  // closed `FACE_SOURCES`. Their roles are written here because ruling 25 names both by
  // example ('dock workers', 'a wherryman') and because the table is the durable instrument —
  // but they are UNREACHABLE until a car seats a source for them, and the suite asserts that
  // unreachability BY NAME rather than letting a dead entry look live. Reported OPEN.
  'Docks/port facilities': Object.freeze([
    { role: 'dock workers', n: 'pl' },
    { role: 'a wherryman', n: 'sg' },
    { role: 'a porter off the quay', n: 'sg' },
    { role: 'the men who work the quay', n: 'pl' },
    { role: 'the harbour master', n: 'sg', office: true },
  ]),
  "Harbour master's office": Object.freeze([
    { role: 'a clerk of the harbour office', n: 'sg' },
    { role: 'dock workers', n: 'pl' },
    { role: 'the harbour master', n: 'sg', office: true },
  ]),
  'Burial ground': Object.freeze([
    { role: 'whoever knew the dead best', n: 'sg' },
    { role: 'the households that keep the ground clear', n: 'pl' },
    { role: 'a man who digs there', n: 'sg' },
    { role: 'a woman who goes out to the markers', n: 'sg' },
  ]),
  'Parish burial grounds': Object.freeze([
    { role: 'the sexton', n: 'sg' },
    { role: 'a man who digs there', n: 'sg' },
    { role: 'the people who keep the ground', n: 'pl' },
  ]),
  'Burial grounds and charnel house': Object.freeze([
    { role: 'the sexton', n: 'sg' },
    { role: 'a keeper of the charnel house', n: 'sg' },
    { role: 'the people who keep the ground', n: 'pl' },
  ]),
});

/**
 * ⭐ THE ROSTER A SOURCE FALLS BACK TO when no live row of its class carries an entry above —
 * a custom row, a catalogue row this table has not grown yet, or a source seated by something
 * other than a row at all (the `stranger`, who has no institution, and the `elders`, seated by
 * TIER and not by a row).
 *
 * ⛔ NOT AN OBJECT KEYED ON A SOURCE WORD. The wiring census reads an object-literal key under
 * `src/domain/**` as a WRITE of world state, and `watch`, `court`, `market` and `garrison` are
 * fields the desks READ. This file is under `src/data/`, outside that sweep — but the roster is
 * an ARRAY OF ENTRIES anyway, so that a later move of this table into the domain cannot mint
 * four false producers by accident. The same discipline `faceSources.js` records at its head.
 *
 * ⭐ THE ROADS ROSTER (ruling 25: the stranger 'a traveller' · 'a pedlar' · 'a drover') is the
 * `stranger` entry: universal, because the roads are.
 *
 * @type {ReadonlyArray<{source: string, roles: ReadonlyArray<RoleEntry>}>}
 */
export const SOURCE_FALLBACK_ROLES = Object.freeze([
  Object.freeze({
    source: 'stranger',
    roles: Object.freeze([
      { role: 'a traveller', n: 'sg' },
      { role: 'a pedlar', n: 'sg' },
      { role: 'a drover', n: 'sg' },
      { role: 'a carter', n: 'sg' },
      { role: 'a pilgrim', n: 'sg' },
      { role: 'a rider who stopped a night', n: 'sg' },
      { role: 'people passing through', n: 'pl' },
      { role: 'a messenger off the road', n: 'sg' },
    ]),
  }),
  Object.freeze({
    source: 'elders',
    roles: Object.freeze([
      { role: 'one of the elders', n: 'sg' },
      { role: 'the older heads here', n: 'pl' },
      { role: 'a woman old enough to remember the custom', n: 'sg' },
      { role: 'the households that keep the custom', n: 'pl' },
    ]),
  }),
  Object.freeze({
    source: 'hall',
    roles: Object.freeze([
      { role: 'a clerk in the hall', n: 'sg' },
      { role: 'one of the aldermen', n: 'sg' },
      { role: 'the clerks who keep the hall', n: 'pl' },
    ]),
  }),
  Object.freeze({
    source: 'tavern',
    roles: Object.freeze([
      { role: 'a carter at the tavern', n: 'sg' },
      { role: 'a woman at the long table', n: 'sg' },
      { role: 'the drinkers at the tavern', n: 'pl' },
    ]),
  }),
  Object.freeze({
    source: 'guild',
    roles: Object.freeze([
      { role: 'a guild factor', n: 'sg' },
      { role: 'a journeyman', n: 'sg' },
      { role: 'the guilds of the town', n: 'pl' },
    ]),
  }),
  Object.freeze({
    source: 'register',
    roles: Object.freeze([
      { role: 'a local priest', n: 'sg' },
      { role: 'one of the congregation', n: 'sg' },
      { role: 'the people who keep the register', n: 'pl' },
    ]),
  }),
  Object.freeze({
    source: 'muster',
    roles: Object.freeze([
      { role: 'one who turns out with the muster', n: 'sg' },
      { role: 'a man on the muster roll', n: 'sg' },
      { role: 'the people who turn out', n: 'pl' },
    ]),
  }),
  Object.freeze({
    source: 'watch',
    roles: Object.freeze([
      { role: 'one of the watch', n: 'sg' },
      { role: 'a night patrolman', n: 'sg' },
      { role: 'the watch', n: 'pl' },
    ]),
  }),
  Object.freeze({
    source: 'garrison',
    roles: Object.freeze([
      { role: 'a soldier of the garrison', n: 'sg' },
      { role: 'a serjeant of the garrison', n: 'sg' },
      { role: 'the garrison', n: 'pl' },
    ]),
  }),
  Object.freeze({
    source: 'gate',
    roles: Object.freeze([
      { role: 'the gatekeeper', n: 'sg' },
      { role: 'whoever keeps the toll book', n: 'sg' },
      { role: 'the men who hold the way in', n: 'pl' },
    ]),
  }),
  Object.freeze({
    source: 'market',
    roles: Object.freeze([
      { role: 'a stallholder', n: 'sg' },
      { role: 'the market clerk', n: 'sg' },
      { role: 'the stallholders', n: 'pl' },
    ]),
  }),
  Object.freeze({
    source: 'court',
    roles: Object.freeze([
      { role: 'a bailiff', n: 'sg' },
      { role: 'a clerk of the court', n: 'sg' },
      { role: 'the officers of the court', n: 'pl' },
    ]),
  }),
]);

/**
 * ⭐⭐ THE PUBLIC'S ROSTER, BY TIER (ADDENDUM 18 ruling 28, the owner's; car 8b-W-18n).
 *
 * THE OWNER'S WORD, 2026-09-13 ~10:5x: *"the public observes. the general public of the town
 * owed to no singular group"*. The public is seated by NO institution row and by no tier gate —
 * it resolves on every town, as the stranger does — but WHAT IT IS CALLED follows the tier,
 * because "the townsfolk" is not a word for nine households and "the whole thorp" is not a word
 * for a city. Ruling 28 edge (f) names the shape: *"tier-fitting plurals … never a singular and
 * never an office"*.
 *
 * ── THE THREE RULES THIS TABLE OBEYS, EACH PINNED ────────────────────────────────────
 * 1. PLURAL ONLY. Every entry carries `n: 'pl'`. A singular public would be one person with an
 *    opinion, which is a SOURCE with a stake — the tavern, the elders, a household — and ruling
 *    28 edge (e) holds those apart from the public by name. The pin is a scan of the table.
 * 2. NEVER AN OFFICE. No entry carries `office: true`, and none may: an office is a power's
 *    seat and the public is owed to no power. The pin refuses the key outright.
 * 3. THE TOWN NEVER NAMES ITSELF (ruling 12). 'the people of the town', never '{settlement}'.
 *
 * ⛔ AN ARRAY OF ROWS, NEVER AN OBJECT KEYED ON A TIER, and never one keyed on `public` — the
 * discipline `SOURCE_FALLBACK_ROLES` records above, kept here so a later move of this table
 * into `src/domain/**` cannot mint a false producer.
 *
 * ⛔ A TIER THIS TABLE DOES NOT NAME FALLS BACK TO THE LAST ROW, which is the town-and-above
 * roster: total by construction, because `tiers: null` matches everything and sits last.
 *
 * @type {ReadonlyArray<{tiers: ReadonlyArray<string>|null, roles: ReadonlyArray<RoleEntry>}>}
 */
export const PUBLIC_ROLES_BY_TIER = Object.freeze([
  Object.freeze({
    tiers: Object.freeze(['thorp']),
    roles: Object.freeze([
      { role: 'the whole thorp', n: 'pl' },
      { role: 'every household here', n: 'pl' },
      { role: 'anyone here', n: 'pl' },
      { role: 'the people of the place', n: 'pl' },
    ]),
  }),
  Object.freeze({
    tiers: Object.freeze(['hamlet']),
    roles: Object.freeze([
      { role: 'the whole hamlet', n: 'pl' },
      { role: 'every household here', n: 'pl' },
      { role: 'anyone in the hamlet', n: 'pl' },
      { role: 'the people of the place', n: 'pl' },
    ]),
  }),
  Object.freeze({
    tiers: Object.freeze(['village']),
    roles: Object.freeze([
      { role: 'the whole village', n: 'pl' },
      { role: 'anyone in the village', n: 'pl' },
      { role: 'every household here', n: 'pl' },
      { role: 'the people of the village', n: 'pl' },
    ]),
  }),
  Object.freeze({
    tiers: null,
    roles: Object.freeze([
      { role: 'the townsfolk', n: 'pl' },
      { role: 'the people of the town', n: 'pl' },
      { role: 'anyone in the town', n: 'pl' },
      { role: 'every household here', n: 'pl' },
    ]),
  }),
]);

/**
 * ⭐ EVERY OFFICE STRING THE NPC ROSTER CAN PRINT, and the office phrase this table spells for
 * it. An `office: true` role above is admitted on a town ONLY when one of these strings is in
 * the town's own printed roster (`officesOf`, src/domain/institutions/institutionTable.js).
 *
 * The left column is the generator's own vocabulary, verbatim from
 * `src/generators/npcGenerator.js` `TIER_MANDATORY_ROLES` / `STRESS_MANDATORY_ROLES`; the right
 * is the lowercase title this table prints for it. A `office: true` entry above whose phrase is
 * absent from this map is a defect the suite names, because it would be an office nothing can
 * ever license.
 *
 * @type {ReadonlyArray<{roster: string, title: string}>}
 */
export const ROSTER_OFFICE_TITLES = Object.freeze([
  Object.freeze({ roster: 'Mayor', title: 'the mayor' }),
  Object.freeze({ roster: 'Governor', title: 'the governor' }),
  Object.freeze({ roster: 'Elder', title: 'the elder' }),
  Object.freeze({ roster: 'Parish Priest', title: 'the parish priest' }),
  Object.freeze({ roster: 'High Priest', title: 'the high priest' }),
  Object.freeze({ roster: 'Guard Captain', title: 'the guard captain' }),
  Object.freeze({ roster: 'City Watch Chief', title: 'the city watch chief' }),
  Object.freeze({ roster: 'Garrison Commander', title: 'the garrison commander' }),
  Object.freeze({ roster: 'Guild Master', title: 'the guild master' }),
  Object.freeze({ roster: 'Wealthiest Merchant', title: 'the wealthiest merchant' }),
  Object.freeze({ roster: 'Chief Magistrate', title: 'the chief magistrate' }),
  Object.freeze({ roster: 'Council Member', title: 'a council member' }),
  Object.freeze({ roster: 'Harbour Master', title: 'the harbour master' }),
  Object.freeze({ roster: 'Harbor Master', title: 'the harbour master' }),
]);

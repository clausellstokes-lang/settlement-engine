/**
 * domain/facts/factVocabulary.js — THE CLOSED ATOM VOCABULARY (CENSUS-1b wave 1, item 1;
 * `docs/DESIGN_POOL_CENSUS.md` §1, §3.1, §3.2).
 *
 * A pool line or a table row DECLARES the atomic facts it presumes — never a combination: "a
 * walled market town" is three atoms, `walls`, `market` and `tier: ≥ town`. Every atom word is
 * written ONCE, here, beside its dimension's polarity, and every atom is answered by ONE reader
 * over `factsOf(record)` (`./factsOf.js`, CENSUS-1's fourteen homes). The draw function
 * (`./drawDeclared.js`) and the birth self-check (`cert:false-presumption`) both ask
 * `atomHolds` / `declarationAdmits` below, so a line is refused and re-asserted by the same rule.
 *
 * THE THREE SHAPES (one per dimension, §3.2; never written on a line):
 *   presence  a boolean fact. A line `needs` it (the record must hold it) or `excludes` it (the
 *             record must not: the twin's side). Silence is neutral. In the annex tag slot and
 *             a registry's `tags`, `X` reads as needs and `no X` as excludes (the kernel's
 *             `walls` / `no walls`). A KEYED presence atom names a value: `institution: mill`,
 *             `ruler: lord`, `terrain: hills`, `route: port`, `war: front`, `migration: exodus`.
 *   band      an ordered fact with ONE comparator per dimension: `tier: ≥ town`,
 *             `stores: < 3`, `population: small`. The operators are ≥ > ≤ < = (ASCII >= <= too);
 *             a bare value means `=`. Silence means every band.
 *   crisis    THE INVERSE DEFAULT. Values: the crisis record's kinds (`CRISIS_KIND_WORDS`,
 *             `factsOf(record).crisis`), F12's families as named GROUPS (`threat`, `hunger`,
 *             `succession`, `unrest`; expanded through the crisis-kind home's ONE kind → family
 *             map, `familyActiveIn`), `calm` (no active crisis) and `any` (every condition).
 *             Within the dimension the values are a disjunction (`crisis: under_siege, wartime`):
 *             at least one must be active (R-H, 2026-11-05) — under several active crises a
 *             line needs ONE of its values on, and its `excludes: crisis: F` refuses it if any
 *             active crisis is in F.
 *             Silence is neutral EXCEPT in a pool that opted in with `{crisis-scoped}` (the
 *             chair's ruling 4; the grow-only register), where silence reads as `calm`.
 * A line's atoms across dimensions are a CONJUNCTION.
 *
 * FAIL-CLOSED (§3.3). An atom whose dimension has no reader yet (`reader: null`) cannot be
 * declared: `assertDeclarable` throws, and the census walker reds. Its NAME is listed anyway, so
 * the lanes annotating lines against §1 meet one spelling (CENSUS-2/3/4 annotate in parallel).
 * Climate and season have no record field and so no atom at all (the chair's ruling 8): a line
 * that presumes one is listed in the undeclared register under "needs a field".
 * `walls` means the PERIMETER only (ruling 3): a building's own walls declare nothing.
 *
 * ⚠ IMPORT-FREE ON PURPOSE. The kernel (`display/stateProse/stateProseKernel.js`) is a display
 * leaf that imports nothing; its `STATE_MARK_DIMENSIONS` is a re-export of this module's mark
 * half, so this module imports nothing either. The crisis kinds and the tier ladder are spelled
 * here and held equal to `data/stressTypes.js :: STRESS_TYPE_MAP` and `data/constants.js ::
 * TIER_ORDER` by `tests/domain/facts/factVocabulary.test.js`. Readers are functions over the
 * `factsOf` object a caller hands in, so no fact module is imported here.
 *
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/facts/factVocabulary.test.js
 * @enforced-by tests/data/dossierStateProseProjection.contract.test.js
 */

// ── THE MARK HALF (the kernel's channel) ─────────────────────────────────────────────────────

/**
 * The second STATE dimensions and FACT dimensions the kernel's `marks` channel carries: the
 * three demoted state keys (`severity`, `deficit`, `anchor`), F10's `walls` and F12's five crisis
 * families. Moved here VERBATIM from `stateProseKernel.js` (CENSUS-1b wave 1); the kernel
 * re-exports it, so the contract test that refuses an unknown mark word refuses an unknown atom.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const STATE_MARK_DIMENSIONS = Object.freeze({
  severity: Object.freeze(['minor', 'major', 'catastrophic']),
  deficit: Object.freeze(['deficit', 'no deficit']),
  anchor: Object.freeze(['anchored', 'not anchored']),
  walls: Object.freeze(['walls', 'no walls']),
  threat: Object.freeze(['threat', 'no threat']),
  hunger: Object.freeze(['hunger', 'no hunger']),
  succession: Object.freeze(['succession open', 'succession settled']),
  unrest: Object.freeze(['unrest', 'no unrest']),
  crisis: Object.freeze(['crisis', 'no crisis']),
});

/**
 * The kernel's FACT mark dimensions, each onto this vocabulary's dimensions (wave 1: `walls`;
 * wave 2, CENSUS-1i unit 8, R-O: F12's five crisis families). A variant marked with the
 * dimension's first word declares the atom on its `needs` side (a family: the crisis dimension's
 * GROUP value, `crisis: threat`; the bare `crisis` family: "a crisis is active"), one marked with
 * its second word on its `excludes` side (`no walls`, `no crisis: threat`, `no crisis`). The
 * kernel's eligibility still reads the caller's answered dimension (law 5: `wallsAnswered`,
 * `crisisAnswered`) — this mapping is what the ledger notes and the birth self-check re-asserts
 * against the final record, through the same reader every declared line uses (`familyActiveIn`
 * via `factsOf(record).crisis`). The three demoted state keys are a desk's own reading, not facts.
 * @type {Readonly<Record<string, string>>}
 */
export const MARK_DIMENSION_ATOM = Object.freeze({
  walls: 'walls',
  threat: 'crisis: threat',
  hunger: 'crisis: hunger',
  succession: 'crisis: succession',
  unrest: 'crisis: unrest',
  crisis: 'crisis',
});

/**
 * The declaration a kernel variant's marks carry, in this vocabulary (`walls` → needs walls,
 * `no walls` → excludes walls; `threat` → crisis: threat, `no threat` → excludes crisis: threat;
 * `crisis` → needs crisis, `no crisis` → excludes crisis). The demoted state keys declare nothing.
 * A family's positive mark is a crisis GROUP value; no shipped variant carries two (the vocabulary
 * test holds that), so the dimension's disjunction never widens a variant's two-dimension law 5.
 * @param {ReadonlyArray<unknown> | null | undefined} marks
 * @returns {Readonly<Declaration>}
 */
export function declarationOfMarks(marks) {
  /** @type {string[]} */ const needs = []; /** @type {string[]} */ const excludes = []; /** @type {string[]} */ const crisis = [];
  for (const [dimension, atom] of Object.entries(MARK_DIMENSION_ATOM)) {
    const [on, off] = STATE_MARK_DIMENSIONS[dimension];
    if ((marks || []).includes(on)) {
      if (atom.startsWith('crisis: ')) crisis.push(atom.slice('crisis: '.length));
      else needs.push(atom);
    }
    if ((marks || []).includes(off)) excludes.push(atom);
  }
  return needs.length || excludes.length || crisis.length
    ? Object.freeze({ needs: Object.freeze(needs), excludes: Object.freeze(excludes), crisis: Object.freeze(crisis) })
    : EMPTY_DECLARATION;
}

// ── THE SPELLED LADDERS (held equal to their data homes by the vocabulary test) ─────────────

/** The crisis record's kinds — `STRESS_TYPE_MAP`'s keys, in its order. */
export const CRISIS_KIND_WORDS = Object.freeze([
  'under_siege', 'famine', 'occupied', 'politically_fractured', 'indebted', 'recently_betrayed',
  'infiltrated', 'plague_onset', 'succession_void', 'monster_pressure', 'insurgency',
  'religious_conversion', 'slave_revolt', 'wartime', 'mass_migration',
]);

/** F12's families as declarable GROUPS (ruling 2), each expanded by the crisis-kind home. */
export const CRISIS_GROUP_WORDS = Object.freeze(['threat', 'hunger', 'succession', 'unrest']);

/**
 * family → its kinds: `crisisKind.js :: CRISIS_FAMILIES`' types, spelled here (held equal by the
 * vocabulary test). `hunger` is also on under ANY crisis while the food record reads a deficit
 * (`familyActiveIn`), which `crisisAdmits` honours through `facts.crisis.families`.
 */
export const CRISIS_FAMILY_KINDS = Object.freeze({
  threat: Object.freeze(['under_siege', 'occupied', 'monster_pressure']),
  hunger: Object.freeze(['famine', 'under_siege']),
  succession: Object.freeze(['succession_void', 'politically_fractured']),
  unrest: Object.freeze(['insurgency', 'slave_revolt', 'wartime']),
});

/** The short spellings the vocabulary rulings' table writes (`crisis: siege, famine`) → the record's kinds. */
/** @type {Readonly<Record<string, string>>} */
export const CRISIS_KIND_ALIASES = Object.freeze({
  siege: 'under_siege', occupation: 'occupied', plague: 'plague_onset', war: 'wartime', migration: 'mass_migration', debt: 'indebted',
});

/** The tier ladder, `TIER_ORDER`. */
export const TIER_WORDS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

/** The population bands (`facts/populationBand.js :: POPULATION_BANDS`). */
export const POPULATION_WORDS = Object.freeze(['small', 'middling', 'large']);

/** The magic level bands (`magicLedger.js`). */
export const MAGIC_LEVEL_WORDS = Object.freeze(['none', 'low', 'medium', 'high']);

/** The food record's bands (`data/bandLadders.js :: FOOD_SECURITY_BANDS` keys), scarce → plenty. */
export const FOOD_BAND_WORDS = Object.freeze(['famine', 'deficit', 'importDependent', 'pressured', 'secure', 'surplus']);

/** The ruler kinds (`facts/rulerKind.js :: RULER_KINDS`). */
export const RULER_WORDS = Object.freeze(['elder', 'lord', 'priest', 'mayor', 'occupier', 'council']);

/** The war states (`facts/warState.js :: WAR_STATES`). */
export const WAR_WORDS = Object.freeze(['front', 'aggressor', 'at war', 'peace']);

/** The migration directions (`crisis/migrationDirection.js`). */
export const MIGRATION_WORDS = Object.freeze(['influx', 'exodus']);

/** The institution kinds (`facts/institutions.js :: INSTITUTION_KINDS`). */
export const INSTITUTION_WORDS = Object.freeze([
  'hospital', 'healer', 'monastery', 'mill', 'smith', 'bathhouse', 'docks', 'quarry', 'mine',
  'tavern', 'school', 'temple', 'granary', 'bank',
]);

/** The terrain classes (`steps/resolveConfig.js`). */
export const TERRAIN_WORDS = Object.freeze(['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert']);

/** The culture keys (`cultureProfiles.js :: CULTURE_PROFILE_KEYS`; CENSUS-3b, ruling R-E). */
export const CULTURE_WORDS = Object.freeze([
  'germanic', 'latin', 'celtic', 'arabic', 'norse', 'slavic', 'east_asian', 'mesoamerican', 'south_asian', 'steppe', 'greek',
]);

/** The criminal structure, none → organized (`defenseDisplay.js :: deriveCriminalStructure`'s keys). */
export const CRIME_WORDS = Object.freeze(['none', 'diffuse', 'semi-organized', 'organized']);

/** The prosperity ladder (`prosperityRank.js :: PROSPERITY_LABELS`, below it the generator's own bottom rung `Subsistence`), lower-cased. */
export const PROSPERITY_WORDS = Object.freeze(['subsistence', 'struggling', 'poor', 'moderate', 'comfortable', 'prosperous', 'wealthy']);

/** The food record's sources (`foodGenerator.js`), the four the vocabulary names as atoms. */
const FOOD_SOURCE_ATOMS = Object.freeze(['fish', 'grain', 'game', 'livestock']);

/** The trade-route kinds (`tradeRouteSemantics.js`). */
export const ROUTE_WORDS = Object.freeze(['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass']);

// ── THE DIMENSIONS ───────────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} FactsLike the object `factsOf(record)` returns (or a test double)
 * @property {Readonly<import('./crisisKind.js').CrisisFacts>} [crisis] @property {number|null} [storesMonths]
 * @property {Readonly<import('./defence.js').DefenceFacts>} [defence]
 * @property {ReturnType<typeof import('./water.js').waterOfKind>} [water] @property {boolean} [market]
 * @property {ReturnType<typeof import('./famine.js').famineOf>} [famine]
 * @property {ReturnType<typeof import('./magic.js').magicOf>} [magic]
 * @property {string|null} [rulerKind] @property {ReturnType<typeof import('./migration.js').migrationOf>} [migration]
 * @property {string} [warState]
 * @property {(kind: string) => boolean|undefined} [hasInstitution] @property {string|null} [populationBand]
 * @property {string} [terrain] @property {string} [route] @property {string} [tier]
 * @property {(npc: unknown) => boolean|undefined} [hasOtherNpc]
 * @property {boolean} [soldiers] @property {boolean} [commander]
 * @property {Readonly<import('../dossier/faithReading.js').FaithReading>} [faith] @property {boolean} [guardPresence]
 * @property {boolean} [guild] @property {boolean} [sacredHouse]
 * @property {ReadonlyArray<string>} [foodSources] @property {ReadonlyArray<unknown>} [imports]
 * @property {ReadonlyArray<unknown>} [exports] @property {string|null} [culture] @property {string} [crime]
 * @property {string} [prosperity]
 */
/**
 * @typedef {object} Dimension
 * @property {'presence'|'band'|'crisis'} shape
 * @property {ReadonlyArray<string>} [keys] a keyed presence dimension's legal keys (`institution: <key>`)
 * @property {ReadonlyArray<string>} [order] a band's ladder, low → high; absent for a numeric band
 * @property {boolean} [numeric] a band whose values are numbers (`stores`, months)
 * @property {string} home the fact home that answers it (`factsOf(record).<home>`), or '' when none
 * @property {((facts: FactsLike, key: string|null, ctx: Record<string, unknown>) => unknown) | null} reader
 *   the ONE reader; `null` = no home yet, so the atom cannot be declared
 * @property {string} [needsContext] the ctx field the reader needs (a per-line fact: `npc`)
 */

/** @param {unknown} v @returns {boolean|undefined} a boolean, or undefined when the fact is unanswered */
const bool = (v) => (typeof v === 'boolean' ? v : undefined);

/**
 * One dimension, frozen; the JSDoc parameter types each reader (`FactsLike`, key, ctx).
 * @param {Dimension} d @returns {Readonly<Dimension>}
 */
const dim = (d) => Object.freeze(d);

/**
 * THE VOCABULARY. Atom names are EXACTLY the design's §1 table and §3.2 lists.
 * @type {Readonly<Record<string, Readonly<Dimension>>>}
 */
export const FACT_DIMENSIONS = Object.freeze({
  // ── presence: defence (fact 3; `facts/defence.js`) ──
  walls: dim({ shape: 'presence', home: 'defence', reader: (f) => bool(f.defence?.walls) }),
  palisade: dim({ shape: 'presence', home: 'defence', reader: (f) => bool(f.defence?.palisade) }),
  gate: dim({ shape: 'presence', home: 'defence', reader: (f) => bool(f.defence?.gate) }),
  watch: dim({ shape: 'presence', home: 'defence', reader: (f) => bool(f.defence?.watch) }),
  militia: dim({ shape: 'presence', home: 'defence', reader: (f) => bool(f.defence?.militia) }),
  garrison: dim({ shape: 'presence', home: 'defence', reader: (f) => bool(f.defence?.garrison) }),
  hospital: dim({ shape: 'presence', home: 'defence', reader: (f) => bool(f.defence?.hospital) }),
  healer: dim({ shape: 'presence', home: 'defence', reader: (f) => bool(f.defence?.healer) }),
  // the rulings §2's delegated getters CENSUS-1c owns (R-E): `soldiers` = a garrison or a hired
  // company (the twin table's and `forceWordsOf`'s meaning); `commander` = a garrison stands, so
  // someone commands it (`hasCommander`); `mercenary` = a hired company.
  soldiers: dim({ shape: 'presence', home: 'soldiers', reader: (f) => bool(f.soldiers) }),
  commander: dim({ shape: 'presence', home: 'commander', reader: (f) => bool(f.commander) }),
  mercenary: dim({ shape: 'presence', home: 'defence', reader: (f) => bool(f.defence?.mercenary) }),
  // THE ONE COMPOSITE (the vocabulary rulings §3): watch ∨ garrison ∨ militia ∨ hired company,
  // defined once in `factsOf` (`guardPresence`); a line never composes atoms itself.
  guardPresence: dim({ shape: 'presence', home: 'guardPresence', reader: (f) => bool(f.guardPresence) }),
  // ── presence: market (fact 5), water (fact 4), magic (fact 7) ──
  market: dim({ shape: 'presence', home: 'market', reader: (f) => bool(f.market) }),
  navigable: dim({ shape: 'presence', home: 'water', reader: (f) => bool(f.water?.navigable) }),
  coast: dim({ shape: 'presence', home: 'water', reader: (f) => bool(f.water?.coast) }),
  river: dim({ shape: 'presence', home: 'water', reader: (f) => bool(f.water?.river) }),
  // the rulings §4: the water atoms are the readers' values; `lake` is dropped (no record field
  // carries a lake: the terrain classes have none); `port` is the trade-route reader's.
  port: dim({ shape: 'presence', home: 'route', reader: (f) => (typeof f.route === 'string' ? f.route === 'port' : undefined) }),
  magic: dim({ shape: 'presence', home: 'magic', reader: (f) => bool(f.magic?.functions) }),
  // ── presence: institutions (fact 11; `facts/institutions.js`) ──
  temple: dim({ shape: 'presence', home: 'hasInstitution', reader: (f) => (typeof f.hasInstitution === 'function' ? f.hasInstitution('temple') : undefined) }),
  docks: dim({ shape: 'presence', home: 'hasInstitution', reader: (f) => (typeof f.hasInstitution === 'function' ? f.hasInstitution('docks') : undefined) }),
  // R-AE (CENSUS-1f, 2026-11-05): ONE composite, defined once because more than one spatial line
  // needs it — a sacred house of any kind the roster names (`factsOf.js :: sacredHouse`: temple ∨
  // monastery); `temple` stays narrow. A line never composes atoms itself.
  sacredHouse: dim({ shape: 'presence', home: 'sacredHouse', reader: (f) => bool(f.sacredHouse) }),
  institution: dim({ shape: 'presence', home: 'hasInstitution', keys: INSTITUTION_WORDS,
    reader: (f, key) => (typeof f.hasInstitution === 'function' && key ? f.hasInstitution(key) : undefined) }),
  // ── presence: the rest of §1 / §3.2, homed or not ──
  // CENSUS-4b (the chair's answer 4): ONE composite — a live guild-type institution ∨ a guild power
  // (`facts/guild.js :: guildOf`); a criminal guild is `organised crime`'s, never this.
  guild: dim({ shape: 'presence', home: 'guild', reader: (f) => bool(f.guild) }),
  famine: dim({ shape: 'presence', home: 'famine', reader: (f) => bool(f.famine?.famine) }),
  starving: dim({ shape: 'presence', home: 'famine', reader: (f) => bool(f.famine?.starvingAllowed) }),
  'other npc': dim({ shape: 'presence', home: 'hasOtherNpc', needsContext: 'npc',
    reader: (f, _key, ctx) => (typeof f.hasOtherNpc === 'function' && ctx && 'npc' in ctx ? f.hasOtherNpc(ctx.npc) : undefined) }),
  // `priest` = a senior cleric stands among the named people (`faithReadingOf(record).seniorCleric`;
  // the rulings §2, CENSUS-1c).
  priest: dim({ shape: 'presence', home: 'faith', reader: (f) => (f.faith && typeof f.faith === 'object' ? f.faith.seniorCleric != null : undefined) }),
  // R-AE (CENSUS-1h, the chair's 08:3x item on CENSUS-5d): ONE composite `clergy` = a named senior
  // cleric (`priest`) ∨ a sacred house (`sacredHouse`), defined once because two DS-FTH lines need
  // it (CENSUS-5e declares them). True if either holds; false only when both are answered false.
  clergy: dim({ shape: 'presence', home: 'faith', reader: (f) => {
    const cleric = f.faith && typeof f.faith === 'object' ? f.faith.seniorCleric != null : undefined;
    const house = bool(f.sacredHouse);
    if (cleric === true || house === true) return true;
    return cleric === false && house === false ? false : undefined;
  } }),
  // CENSUS-3b unit 1 (ruling R-E): the delegated getters. Organised crime = a structure at
  // `semi-organized` or above (routes and territory, or a hierarchy); a diffuse presence is not one.
  'organised crime': dim({ shape: 'presence', home: 'crime',
    reader: (/** @type {FactsLike} */ f) => (typeof f.crime === 'string' ? CRIME_WORDS.indexOf(f.crime) >= CRIME_WORDS.indexOf('semi-organized') : undefined) }),
  ...Object.fromEntries(FOOD_SOURCE_ATOMS.map((src) => [src, dim({ shape: 'presence', home: 'foodSources',
    reader: (/** @type {FactsLike} */ f) => (Array.isArray(f.foodSources) ? f.foodSources.includes(src) : undefined) })])),
  imports: dim({ shape: 'presence', home: 'imports', reader: (/** @type {FactsLike} */ f) => (Array.isArray(f.imports) ? f.imports.length > 0 : undefined) }),
  exports: dim({ shape: 'presence', home: 'exports', reader: (/** @type {FactsLike} */ f) => (Array.isArray(f.exports) ? f.exports.length > 0 : undefined) }),
  culture: dim({ shape: 'presence', home: 'culture', keys: CULTURE_WORDS,
    reader: (/** @type {FactsLike} */ f, /** @type {string|null} */ key) => (f.culture === undefined ? undefined : f.culture === key) }),
  // ── keyed presence: one value of a categorical fact ──
  ruler: dim({ shape: 'presence', home: 'rulerKind', keys: RULER_WORDS,
    reader: (f, key) => (f.rulerKind === undefined ? undefined : f.rulerKind === key) }),
  war: dim({ shape: 'presence', home: 'warState', keys: WAR_WORDS,
    reader: (f, key) => (typeof f.warState === 'string' ? f.warState === key : undefined) }),
  migration: dim({ shape: 'presence', home: 'migration', keys: MIGRATION_WORDS,
    reader: (f, key) => (f.migration ? f.migration.active === true && f.migration.direction === key : undefined) }),
  terrain: dim({ shape: 'presence', home: 'terrain', keys: TERRAIN_WORDS,
    reader: (f, key) => (typeof f.terrain === 'string' ? f.terrain === key : undefined) }),
  route: dim({ shape: 'presence', home: 'route', keys: ROUTE_WORDS,
    reader: (f, key) => (typeof f.route === 'string' ? f.route === key : undefined) }),
  // ── bands: one comparator each ──
  tier: dim({ shape: 'band', home: 'tier', order: TIER_WORDS, reader: (f) => f.tier }),
  population: dim({ shape: 'band', home: 'populationBand', order: POPULATION_WORDS, reader: (f) => f.populationBand }),
  'magic level': dim({ shape: 'band', home: 'magic', order: MAGIC_LEVEL_WORDS, reader: (f) => f.magic?.level }),
  food: dim({ shape: 'band', home: 'famine', order: FOOD_BAND_WORDS, reader: (f) => f.famine?.band }),
  stores: dim({ shape: 'band', home: 'storesMonths', numeric: true, reader: (f) => f.storesMonths }),
  prosperity: dim({ shape: 'band', home: 'prosperity', order: PROSPERITY_WORDS, reader: (/** @type {FactsLike} */ f) => f.prosperity }),
  crime: dim({ shape: 'band', home: 'crime', order: CRIME_WORDS, reader: (/** @type {FactsLike} */ f) => f.crime }),
  // ── the crisis dimension (the inverse default) ──
  crisis: dim({ shape: 'crisis', home: 'crisis', reader: (f) => f.crisis }),
});

/** The crisis dimension's legal values. */
export const CRISIS_VALUES = Object.freeze([...CRISIS_KIND_WORDS, ...CRISIS_GROUP_WORDS, 'calm', 'any']);

/** The pool-level rulings a heading or table may carry (never a line). */
export const POOL_RULINGS = Object.freeze(['crisis-scoped', 'colour']);

/**
 * THE PER-LINE COLOUR MARK (R-AO, CENSUS-1g unit 1). `{colour}` on a pool says every line presumes
 * nothing; a MIXED pool's read-but-presumes-nothing line says it alone: the annex tag slot carries
 * `colour` (`[angle · colour]`, or `[colour]` in a canonical row's slot) and a table row carries
 * `{ text, colour: true }`. It is a no-atom declaration — "read; presumes nothing" — which the
 * projector and the undeclared register count as declared; the draw, the kernel and the ledger
 * read it as silence (it is no atom: `parseAtom('colour')` is null), so it moves no birth. A colour
 * line declares nothing else: `colour` beside an atom is an error.
 */
export const COLOUR_MARK = 'colour';

/**
 * Is this table row marked colour (`{ text, colour: true }`)? Throws on a row that is marked
 * colour AND declares (or is a twin): a colour line declares nothing else.
 * @param {unknown} line
 * @returns {boolean}
 */
export function isColourLine(line) {
  if (!line || typeof line !== 'object' || /** @type {{colour?: unknown}} */ (line).colour !== true) return false;
  const o = /** @type {Record<string, unknown>} */ (line);
  if (declares(declarationOf(o)) || typeof o.twinOf === 'string') {
    throw new Error(`factVocabulary: the row '${String(o.text)}' is marked colour and declares: a colour line declares nothing else (R-AO)`);
  }
  return true;
}

const BAND_OPS = Object.freeze(['≥', '>', '≤', '<', '=']);
/** @param {string} op @returns {string} */
const normOp = (op) => ({ '>=': '≥', '<=': '≤', '==': '=' })[op] || op;

// ── PARSING ──────────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} Atom
 * @property {string} raw the atom as written
 * @property {string} dimension
 * @property {string|null} key a keyed presence atom's value (`institution: mill` → `mill`)
 * @property {string|null} op a band's operator
 * @property {string|number|null} value a band's operand
 * @property {ReadonlyArray<string>|null} values the crisis dimension's values
 */

/**
 * Parse one atom word, or return null when it is not in the vocabulary. Never throws.
 * @param {unknown} word
 * @returns {Readonly<Atom> | null}
 */
export function parseAtom(word) {
  if (typeof word !== 'string') return null;
  const raw = word.trim();
  if (!raw) return null;
  const colon = raw.indexOf(':');
  const written = (colon < 0 ? raw : raw.slice(0, colon)).trim();
  const head = FACT_DIMENSIONS[written] ? written : written.toLowerCase();
  const tail = colon < 0 ? '' : raw.slice(colon + 1).trim();
  const dim = FACT_DIMENSIONS[head];
  if (!dim) return null;
  if (dim.shape === 'crisis') {
    // bare `crisis` (in needs / excludes): "a crisis is active" (the rulings §1)
    if (colon < 0) return Object.freeze({ raw, dimension: head, key: null, op: null, value: null, values: null });
    const values = tail.split(',').map((v) => v.trim()).filter(Boolean).map((v) => CRISIS_KIND_ALIASES[v] || v);
    if (!values.length || !values.every((v) => CRISIS_VALUES.includes(v))) return null;
    return Object.freeze({ raw, dimension: head, key: null, op: null, value: null, values: Object.freeze(values) });
  }
  if (dim.shape === 'presence') {
    if (dim.keys) {
      if (!dim.keys.includes(tail)) return null;
      return Object.freeze({ raw, dimension: head, key: tail, op: null, value: null, values: null });
    }
    if (colon >= 0) return null;
    return Object.freeze({ raw, dimension: head, key: null, op: null, value: null, values: null });
  }
  // band
  const m = /^(>=|<=|==|≥|≤|>|<|=)?\s*(.+)$/.exec(tail);
  if (!m) return null;
  const op = normOp(m[1] || '=');
  if (!BAND_OPS.includes(op)) return null;
  const operand = m[2].replace(/\s*months?$/i, '').trim();
  if (dim.numeric) {
    const n = Number(operand);
    if (!Number.isFinite(n)) return null;
    return Object.freeze({ raw, dimension: head, key: null, op, value: n, values: null });
  }
  if (!dim.order || !dim.order.includes(operand)) return null;
  return Object.freeze({ raw, dimension: head, key: null, op, value: operand, values: null });
}

/** @param {unknown} word @returns {boolean} */
export const isKnownAtom = (word) => parseAtom(word) !== null;

/**
 * Throw unless the atom is in the vocabulary AND its dimension has a reader (§3.3: a dimension
 * with no reader yet cannot be declared).
 * @param {unknown} word
 * @returns {Readonly<Atom>}
 */
export function assertDeclarable(word) {
  const atom = parseAtom(word);
  if (!atom) throw new Error(`factVocabulary: '${String(word)}' is not an atom of the vocabulary`);
  if (FACT_DIMENSIONS[atom.dimension].reader === null) {
    throw new Error(`factVocabulary: '${atom.raw}' has no reader yet (no fact home): it cannot be declared`);
  }
  return atom;
}

// ── DECLARATIONS ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} Declaration
 * @property {ReadonlyArray<string>} needs presence and band atoms the record must hold
 * @property {ReadonlyArray<string>} excludes presence atoms the record must not hold
 * @property {ReadonlyArray<string>} crisis the crisis dimension's values (a disjunction)
 */

/** @type {Readonly<Declaration>} */
export const EMPTY_DECLARATION = Object.freeze({ needs: Object.freeze([]), excludes: Object.freeze([]), crisis: Object.freeze([]) });

/** @param {unknown} v @returns {string[]} */
const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : typeof v === 'string' ? [v] : []);

/**
 * Fold a tag list (the annex slot, a registry's `tags`) into a declaration: `X` → needs,
 * `no X` → excludes, `crisis: …` → crisis. Words that are not atoms are not declarations (the
 * annex slot also carries angles, `dm-only` and grammar marks) and are skipped HERE; the census
 * walker is what refuses an unknown word in a declaration field.
 * @param {ReadonlyArray<unknown>} tags
 * @returns {Readonly<Declaration>}
 */
export function declarationOfTags(tags) {
  /** @type {string[]} */ const needs = []; /** @type {string[]} */ const excludes = []; /** @type {string[]} */ const crisis = [];
  for (const t of list(tags)) {
    const w = t.trim();
    const neg = /^no\s+(.+)$/i.exec(w);
    const atom = parseAtom(neg ? neg[1] : w);
    if (!atom) continue;
    if (atom.dimension === 'crisis' && atom.values && !neg) crisis.push(...atom.values);
    else if (atom.dimension === 'crisis' && neg) excludes.push(atom.raw);
    else if (neg && FACT_DIMENSIONS[atom.dimension].shape === 'presence') excludes.push(atom.raw);
    else if (!neg) needs.push(atom.raw);
  }
  return needs.length || excludes.length || crisis.length
    ? Object.freeze({ needs: Object.freeze(needs), excludes: Object.freeze(excludes), crisis: Object.freeze(crisis) })
    : EMPTY_DECLARATION;
}

/**
 * The declaration a pool line carries. A bare string declares nothing; an object's sibling
 * column `{ text, needs?, excludes?, crisis? }` is read; a registry entry's `tags` is read only
 * when the site says the table is tagged (`{ tagged: true }`), because unrelated tables carry a
 * `tags` field of their own (the institution catalogue's `market`, `guild`).
 * @param {unknown} line
 * @param {{ tagged?: boolean }} [options]
 * @returns {Readonly<Declaration>}
 */
export function declarationOf(line, options = {}) {
  if (!line || typeof line !== 'object') return EMPTY_DECLARATION;
  const o = /** @type {Record<string, unknown>} */ (line);
  const needs = list(o.needs); const excludes = list(o.excludes);
  /** @type {string[]} */ const crisis = [];
  for (const c of list(o.crisis)) crisis.push(...c.replace(/^crisis:\s*/i, '').split(',').map((v) => v.trim()).filter(Boolean).map((v) => CRISIS_KIND_ALIASES[v] || v));
  let decl = needs.length || excludes.length || crisis.length
    ? Object.freeze({ needs: Object.freeze(needs), excludes: Object.freeze(excludes), crisis: Object.freeze(crisis) })
    : EMPTY_DECLARATION;
  if (options.tagged && Array.isArray(o.tags)) {
    const t = declarationOfTags(o.tags);
    if (t !== EMPTY_DECLARATION) {
      decl = Object.freeze({
        needs: Object.freeze([...decl.needs, ...t.needs]),
        excludes: Object.freeze([...decl.excludes, ...t.excludes]),
        crisis: Object.freeze([...decl.crisis, ...t.crisis]),
      });
    }
  }
  return decl;
}

/** @param {Readonly<Declaration>} d @returns {boolean} */
export const declares = (d) => d.needs.length > 0 || d.excludes.length > 0 || d.crisis.length > 0;

/**
 * Every atom a declaration names, as written (`no X` for an exclusion, `crisis: a, b` for the
 * crisis disjunction) — the ledger's and the census's spelling.
 * @param {Readonly<Declaration>} d
 * @returns {string[]}
 */
export function atomsOf(d) {
  return [...d.needs, ...d.excludes.map((a) => `no ${a}`), ...(d.crisis.length ? [`crisis: ${d.crisis.join(', ')}`] : [])];
}

// ── ANSWERS ──────────────────────────────────────────────────────────────────────────────────

/**
 * Does the record hold this presence or band atom? `undefined` = UNANSWERED (no facts, a
 * reader that returned nothing, a context atom without its context, a dimension with no home):
 * the caller treats it as a refusal (fail-closed), never as "absent".
 * @param {string} word
 * @param {FactsLike|null|undefined} facts
 * @param {Record<string, unknown>} [ctx]
 * @returns {boolean|undefined}
 */
export function atomHolds(word, facts, ctx = {}) {
  const atom = parseAtom(word);
  if (!atom || !facts) return undefined;
  if (atom.dimension === 'crisis') {
    const c = /** @type {FactsLike} */ (facts).crisis;
    if (!c || typeof c.has !== 'function') return undefined;
    if (!atom.values) return c.active === true; // `crisis`: a crisis is active
    return atom.values.some((v) => v === 'any' ? c.active === true : v === 'calm' ? c.active !== true : c.has(v));
  }
  const dim = FACT_DIMENSIONS[atom.dimension];
  if (!dim.reader) return undefined;
  const answer = dim.reader(facts, atom.key, ctx);
  if (dim.shape === 'presence') return typeof answer === 'boolean' ? answer : undefined;
  // band
  if (dim.numeric) {
    if (typeof answer !== 'number' || !Number.isFinite(answer)) return undefined;
    return compare(answer, /** @type {number} */ (atom.value), /** @type {string} */ (atom.op));
  }
  const order = /** @type {ReadonlyArray<string>} */ (dim.order);
  const have = order.indexOf(String(answer));
  if (have < 0) return undefined;
  return compare(have, order.indexOf(String(atom.value)), /** @type {string} */ (atom.op));
}

/** @param {number} a @param {number} b @param {string} op @returns {boolean} */
function compare(a, b, op) {
  switch (op) {
    case '≥': return a >= b;
    case '>': return a > b;
    case '≤': return a <= b;
    case '<': return a < b;
    default: return a === b;
  }
}

/**
 * Does the record admit this crisis declaration? `values` empty = silence: neutral, unless the
 * pool is crisis-scoped (then silence reads `calm`). `undefined` = unanswered.
 *
 * THE DISJUNCTION (R-H, the chair's correction of the vocabulary rulings §1, 2026-11-05; CENSUS-2b
 * caught the contradiction): a line declaring `crisis: [values]` is admitted when AT LEAST ONE
 * declared kind or family is active — `c.has` answers both, and `hunger` is on by a food-record
 * deficit too (`crisisKind.js :: familyActiveIn`). `calm` holds only with no crisis active; `any`
 * everywhere. So `crisis: K` is a presence requirement in every pool (R-I). The calm a line
 * asserts about one family is its `excludes: crisis: F`, read against EVERY active crisis by
 * `atomHolds` in `declarationAdmits`, never by this function. The conjunction this replaces
 * refused a famine line under famine + siege and muted a siege-keyed heading under a famine.
 * @param {ReadonlyArray<string>} values
 * @param {FactsLike|null|undefined} facts
 * @param {{ crisisScoped?: boolean }} [options]
 * @returns {boolean|undefined}
 */
export function crisisAdmits(values, facts, options = {}) {
  const vs = values.length ? values : options.crisisScoped ? ['calm'] : [];
  if (!vs.length) return true;
  if (vs.includes('any')) return true;
  const c = facts?.crisis;
  if (!c || typeof c.has !== 'function') return undefined;
  if (!c.active) return vs.includes('calm');
  return vs.some((v) => v !== 'calm' && c.has(v));
}

/**
 * THE ONE RULE. Is this declaration admitted by this record? `refused` names every atom the
 * record contradicts or that is unanswered (fail-closed), in the declaration's own spelling.
 * @param {Readonly<Declaration>} decl
 * @param {FactsLike|null|undefined} facts
 * @param {{ crisisScoped?: boolean, ctx?: Record<string, unknown> }} [options]
 * @returns {{ admitted: boolean, refused: string[] }}
 */
export function declarationAdmits(decl, facts, options = {}) {
  /** @type {string[]} */ const refused = [];
  for (const a of decl.needs) if (atomHolds(a, facts, options.ctx) !== true) refused.push(a);
  for (const a of decl.excludes) if (atomHolds(a, facts, options.ctx) !== false) refused.push(`no ${a}`);
  if (crisisAdmits(decl.crisis, facts, options) !== true) refused.push(decl.crisis.length ? `crisis: ${decl.crisis.join(', ')}` : 'crisis: calm');
  return { admitted: refused.length === 0, refused };
}

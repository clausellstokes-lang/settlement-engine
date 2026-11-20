/**
 * domain/display/institutionDisplayName.js — THE INSTITUTION LABEL SEAM.
 *
 * ── WHAT THE OWNER ASKED FOR, AND WHAT THE CENSUS SAID ───────────────────────────
 * The owner's 2026-09-18 site walk found the roster printing 'Parish church' — a
 * word out of ONE setting's Christendom on a product whose scope law is
 * SETTING-AGNOSTIC. The obvious cure is to rename the catalogue entry. The census
 * refused it: the institution catalogue HAS NO id/label SPLIT. The entry KEY *is*
 * the name; `assembleInstitutions` persists that key as `name`; and ~158 sites key
 * on it by substring (`name.includes('parish church')`) across six generators, the
 * ladders, subsumption, the supply chains and the service tables. Renaming the key
 * would be a schema migration that silently re-points every one of those matchers,
 * move every golden, and strand every saved world on the old spelling.
 *
 * So ODQ §934.13 re-ruled it: A DISPLAY SEAM, NOT A SCHEMA SPLIT. The key stays the
 * identifier it already is, generated output stays BYTE-IDENTICAL, and ONE seam
 * renders the setting-neutral label everywhere a reader sees it.
 *
 * ⛔ THE LINE THIS MODULE DRAWS, AND WHY BOTH SIDES OF IT MATTER.
 *   - A PRINT goes through the seam. Anything a reader's eye lands on: the roster
 *     pill, the profile card, the service row, the compendium entry, the PDF card.
 *   - A MATCH DOES NOT. `impaired.has(name)`, `depReasons.get(name)`,
 *     `instNames.some(n => n.includes(...))`, `resolveInstitutionByName`, the
 *     supply-chain `present` predicate and every generator keyword test read the
 *     RAW key. Threading the seam into a matcher would break the lookup against
 *     data the engine and every saved world still spell the old way.
 * A call site that holds ONE binding for both jobs must keep the raw one and add a
 * display one beside it — never reassign. That is the single way this seam can be
 * mis-installed, which is why it is stated here rather than left to the diff.
 *
 * ⛔ SAVED WORLDS ARE COVERED BY CONSTRUCTION. A world generated before this car
 * carries `'Parish church'` inside its persisted institution objects, and it always
 * will — the seam maps at READ time, so the old spelling in storage renders the new
 * label without a migration, a backfill or a version bump. Pinned by a fixture.
 *
 * WHY HERE. `domain/display/*` is the layer BOTH surfaces already share: `src/pdf`
 * reads a dozen of its modules and may not reach into `src/components` (the paid
 * document renders in its own worker off its own theme). A seam that only the
 * screen could call would have let the document keep printing the old word — the
 * exact two-spellings-of-one-word failure `labelCase.js` was cut to end.
 *
 * ⛔ IT IMPORTS NOTHING, DELIBERATELY. Like `institutionVocabulary.js` beside it,
 * this is a pure headless leaf. It does NOT import the catalogue: `vite.config`
 * routes every `src/data/*` file into the EAGER first-paint chunk, and a seam that
 * every tab calls would drag the whole institution catalogue into first paint. The
 * catalogue is therefore not the runtime source of the enumeration — it is the
 * TEST's, which re-derives the parish-church family from
 * `src/data/institutionalCatalog.js` and reds if a variant appears that this map
 * does not cover. The enumeration cannot silently fall behind the catalogue.
 *
 * ⛔ CASE IS NOT THIS MODULE'S JOB. The labels below are authored in the case a
 * reader should see. Sites that already run a label through the ladder
 * (`labelCase.js`'s `tokenCase`/`statusCase`, the PDF's `humanize`/`cap`) keep
 * doing so — `humanize` returns any string containing whitespace unchanged, so it
 * composes with these labels rather than title-casing them.
 */

/**
 * THE PARISH-CHURCH FAMILY → THE SETTING-NEUTRAL LABEL.
 *
 * Six catalogue keys, enumerated from `src/data/institutionalCatalog.js` and
 * `src/data/institutionServices.js`: the base entry, its three scale variants, the
 * no-church-of-its-own SERVICE at thorp/hamlet, and the town's burial ground.
 * Neither 'House of worship' nor 'Burial grounds' collides with an existing
 * catalogue label (checked across the whole catalogue).
 *
 * ⛔ THE RULE IS NOW THE WHOLE WORD, NOT THE CHURCH FAMILY. The first cut mapped
 * only the keys matching /parish/ AND /church/, and reported 'Parish burial
 * grounds' to the chair as an adjacent finding rather than folding it in — a
 * burial ground is not a house of worship, and inventing its label was not the
 * lane's call. The chair ruled it: it takes 'Burial grounds'. So the pin is now the
 * stronger and simpler one — NO CATALOGUE KEY CONTAINING 'parish' MAY REACH A
 * READER — and the test enumerates /parish/i over the whole catalogue.
 *
 * ⚠ 'Burial grounds' SITS ONE LETTER FROM 'Burial ground', the thorp/hamlet rung of
 * the same ladder. They can never appear together in a settlement: the burial rungs
 * are one-per-tier (thorp+hamlet 'Burial ground', village Graveyard, town here, city
 * 'Burial grounds and charnel house', metropolis 'Cemetery network'), which the test
 * pins from the catalogue rather than asserting here. The Compendium's cross-tier
 * browse is the one surface that shows both, where the category and the entry's own
 * description distinguish them.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const INSTITUTION_DISPLAY_NAMES = Object.freeze({
  'Parish church':              'House of worship',
  'Parish churches (2-5)':      'Houses of worship (2-5)',
  'Parish churches (10-30)':    'Houses of worship (10-30)',
  'Parish churches (50-100+)':  'Houses of worship (50-100+)',
  'Access to parish church':    'Access to a house of worship',
  'Parish burial grounds':      'Burial grounds',
  // THE URBAN BAND (2026-09-30). These trades now carry ONE identity key from town to
  // metropolis (the registry's cumulative law), and the key's count was only ever true of a
  // town. The key stays the identifier every table joins on; the reader sees the trade.
  'Bakers (5-15)':              'Bakers',
  'Butchers (3-8)':             'Butchers',
  'Carpenters (5-15)':          'Carpenters',
  'Blacksmiths (3-10)':         'Blacksmiths',
  'Mills (2-5)':                'Mills',
  // The parentheticals below were CONDITIONS, and the registry now enforces both
  // (`minPopulation: 10000`; `requiresAny: ['Town walls']`), so a reader needs the noun only.
  'Cathedral (10,000+ only)':   'Cathedral',
  'Gates (if walled)':          'Town gates',
  // SW-8 RENAME-POWERS (2026-11-09, the owner's map row A12): the retired word left the reader's
  // page. The key stays the identifier every table joins on; a saved world renders the new label
  // at read, by this seam's own law (the chair's acceptance of the plan, 05:4x).
  'Multiple criminal factions': 'Rival gangs',
});

/** Case-insensitive index, mirroring `identityForInstitution`'s tolerance. */
const DISPLAY_BY_LOWER = new Map(
  Object.entries(INSTITUTION_DISPLAY_NAMES).map(([key, label]) => [key.toLowerCase(), label]),
);

/**
 * The label a reader should see for an institution or a service.
 *
 * Accepts either the raw catalogue/persisted NAME or an institution-shaped object
 * (`{ name }`, falling back to `{ label }` for the few slices that carry one).
 * Anything the map does not cover passes through UNCHANGED, so this is safe to
 * install at a site that renders arbitrary institutions — including the user's own
 * custom content, which must never be reworded.
 *
 * @param {unknown} instOrName an institution object, or its raw name
 * @returns {string} the display label, or the raw name unchanged, or '' for nothing
 */
export function institutionDisplayName(instOrName) {
  const raw = typeof instOrName === 'string'
    ? instOrName
    : (instOrName && typeof instOrName === 'object'
      // `name` is the only key an institution carries for its title; a `label` fallback was a
      // read of a key no writer produces (the observed-shape ratchet convicted it), so it is gone.
      ? /** @type {{ name?: unknown }} */ (instOrName).name
      : null);
  if (typeof raw !== 'string' || !raw) return '';
  if (Object.prototype.hasOwnProperty.call(INSTITUTION_DISPLAY_NAMES, raw)) {
    return INSTITUTION_DISPLAY_NAMES[raw];
  }
  return DISPLAY_BY_LOWER.get(raw.toLowerCase()) ?? raw;
}

/**
 * THE CATALOGUE'S MACHINERY IN A NAME (R2-CODE-B item 1, the cold list REVIEW-W2A-3: "Merchant guilds
 * (15-40) · member of Merchant Guilds", "Dream parlors (high magic) · member of Arcane Orders", "Craft
 * guilds (5-15) · Bowyers & fletchers (guild)"). A trailing bracket that holds a COUNT RANGE (a
 * digit-led "(15-40)", "(100-150+)", "(10,000+ only)") or the CONDITION the registry gates the row on
 * ("(high magic)", "(if walled)") is how the catalogue sorts its rows, not a fact a reader is told.
 * A bracket that describes the house ("(part-time)", "(guild)", "(district)") stays.
 *
 * ROUND THREE, ruling (a) (the chair, 2026-11-13; ROUND-3-CUT §7 (a)): the same strip covers the
 * household ranges and floors ("(75-650 households)", "(3500+ households)": digit-led) and the
 * display-name table's own ranges ("Houses of worship (10-30)", stripped after the table maps).
 */
// R2-CODE-B-12, the chair's ruling (m) (NOLANE-HANDBACK's "Fence (word of mouth)", 24 towns on the joined 720): the
// catalogue's other GRADES, measured by script over every bracketed name the 1,536 births hold: how the house is found
// ("(word of mouth)"), its scale ("(commercial)"), its strength ("(powerful)") and a spell level ("(divine, 1st
// level)"). None is the house's own name (no town holds the bare name beside it). The in-world qualifiers stay:
// (official), (established), (part-time), (resident), (guild), (district), (open cast), (red light district).
const CATALOGUE_MACHINERY_BRACKET = /\s*\((?:\d[^)]*|high magic|if walled|word of mouth|commercial|powerful|[a-z]+, \d+(?:st|nd|rd|th) level)\)\s*$/i;

/**
 * A COUNT WORD IS A PLURAL, NEVER A PARENTHESIS (ruling (a)): the catalogue's one count word,
 * "Inn (multiple)", reads as the plain plural of its house. Keyed by the catalogue name; read only by
 * the house label below, so `institutionDisplayName` (which generators read into stored sentences)
 * and every record keep their bytes.
 * @type {Readonly<Record<string, string>>}
 */
export const HOUSE_LABEL_PLURALS = Object.freeze({
  'Inn (multiple)': 'Inns',
});
const PLURAL_BY_LOWER = new Map(
  Object.entries(HOUSE_LABEL_PLURALS).map(([key, label]) => [key.toLowerCase(), label]),
);

/**
 * THE HOUSE'S LABEL: the one display leaf every surface reads when it prints a house (the roster, the
 * Services, the Power and Crisis tabs, the Outlook, the NPC cards, the chain cards, the PDF and the
 * Foundry journal): the seam's display label, without the catalogue's count range, household range or
 * floor, population gate or gating condition, and with a count word carried by a plural. The in-world
 * qualifiers stay as part of the name ("(part-time)", "(established)", "(open cast)", "(guild)",
 * "(district)", "(resident)"). Display only: the catalogue's names, the record and every key keep the
 * raw spelling (a MATCH reads the raw name, by this module's law). A custom house ('Stormwatch Keep')
 * carries no such bracket and passes through unchanged.
 * @param {unknown} instOrName an institution object, or its raw name
 * @returns {string}
 */
export function institutionHouseLabel(instOrName) {
  const label = institutionDisplayName(instOrName);
  const plural = PLURAL_BY_LOWER.get(label.toLowerCase());
  if (plural) return plural;
  const bare = label.replace(CATALOGUE_MACHINERY_BRACKET, '').trim();
  return bare || label;
}

/**
 * A STORED SENTENCE THAT NAMES A HOUSE, read with the house's label (ruling (a); the Outlook's
 * "5 institutions critically impaired by siege: Taverns (5-20), …", written at birth by
 * generators/economy/viability.js and kept in the record). The record keeps its bytes (a saved world
 * reads the same way); at read, every name of a house the settlement holds, in its raw or its
 * display spelling, is replaced by the house's label wherever it stands whole in the sentence.
 * Longest names first, so "Parish churches (2-5)" is read before any shorter name inside it. A name
 * with no machinery in it is not touched. Pure: no draw, no write.
 * @param {unknown} text the stored sentence
 * @param {ReadonlyArray<unknown>} houses the settlement's institutions (objects or raw names)
 * @returns {string}
 */
export function houseLabelsInText(text, houses) {
  let out = typeof text === 'string' ? text : '';
  if (!out) return out;
  /** @type {Map<string, string>} */
  const swaps = new Map();
  for (const h of Array.isArray(houses) ? houses : []) {
    const raw = typeof h === 'string' ? h : (h && typeof h === 'object' ? /** @type {{ name?: unknown }} */ (h).name : null);
    if (typeof raw !== 'string' || !raw) continue;
    const label = institutionHouseLabel(raw);
    for (const spelled of [raw, institutionDisplayName(raw)]) {
      if (spelled && spelled !== label && !swaps.has(spelled)) swaps.set(spelled, label);
    }
  }
  for (const [spelled, label] of [...swaps].sort((a, b) => b[0].length - a[0].length)) {
    if (out.includes(spelled)) out = out.split(spelled).join(label);
  }
  return out;
}

export default institutionDisplayName;

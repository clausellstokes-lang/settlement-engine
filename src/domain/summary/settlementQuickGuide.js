/**
 * settlementQuickGuide.js — one deterministic, compact settlement read-model.
 *
 * The generated dossier is intentionally deep. That depth is useful while
 * preparing, but a GM also needs a reliable first screen: one identity sentence,
 * three defining truths, one immediate pressure, three important people, and one
 * entry point. This composer selects those facts from canonical generator output
 * without inventing a second settlement model or persisting derived prose.
 *
 * The result is shared by Summary, Table View, Session Mode, and the PDF. Keeping
 * selection here prevents four presentation layers from quietly disagreeing
 * about who matters, what is urgent, or where play begins.
 */

import { collectPlotHooks } from '../dossier/plotHooks.js';
import { formatCount } from '../formatNumber.js';

const INFLUENCE_RANK = Object.freeze({
  high: 0,
  moderate: 1,
  low: 2,
});

/**
 * @typedef {Object} QuickGuideFact
 * @property {string} id
 * @property {string} label
 * @property {string} text
 * @property {string} sourcePath
 */

/**
 * @typedef {Object} QuickGuidePerson
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} detail
 * @property {string} sourcePath
 */

/**
 * Narrow source shapes for this read-model. Values remain `unknown` at the
 * persistence boundary and are normalized by cleanText/finiteNumber; the guide
 * does not assume that legacy saves are already schema-perfect.
 *
 * @typedef {Object} QuickGuideFaction
 * @property {unknown} [faction]
 * @property {unknown} [isGoverning]
 *
 * @typedef {Object} QuickGuideStress
 * @property {unknown} [summary]
 * @property {unknown} [description]
 * @property {unknown} [crisisHook]
 * @property {unknown} [label]
 * @property {unknown} [type]
 *
 * @typedef {Object} QuickGuideConflict
 * @property {unknown} [desc]
 * @property {unknown} [description]
 * @property {unknown} [issue]
 * @property {unknown} [tension]
 * @property {unknown} [stakes]
 *
 * @typedef {Object} QuickGuideNpc
 * @property {unknown} [id]
 * @property {unknown} [name]
 * @property {unknown} [role]
 * @property {unknown} [title]
 * @property {unknown} [power]
 * @property {unknown} [influence]
 * @property {string | { short?: unknown, long?: unknown } | null} [goal]
 * @property {string | { tell?: unknown, dominant?: unknown } | null} [personality]
 * @property {string | { what?: unknown } | null} [secret]
 *
 * @typedef {Object} QuickGuideTension
 * @property {unknown} [description]
 * @property {unknown[]} [plotHooks]
 *
 * @typedef {Object} SettlementQuickGuideSource
 * @property {unknown} [name]
 * @property {unknown} [tier]
 * @property {unknown} [population]
 * @property {{ key?: unknown, label?: unknown }} [culturalIdentity]
 * @property {{ label?: unknown }} [culture]
 * @property {unknown} [settlementReason]
 * @property {{
 *   historicalCharacter?: unknown,
 *   founding?: { reason?: unknown },
 *   currentTensions?: QuickGuideTension[],
 * }} [history]
 * @property {{
 *   factions?: QuickGuideFaction[],
 *   governingName?: unknown,
 *   government?: unknown,
 *   stability?: unknown,
 * }} [powerStructure]
 * @property {{
 *   prosperity?: string | { tier?: unknown } | null,
 *   foodSecurity?: { label?: unknown },
 *   primaryExports?: unknown,
 *   situationDesc?: unknown,
 * }} [economicState]
 * @property {unknown} [pressureSentence]
 * @property {QuickGuideStress[]} [stressors]
 * @property {QuickGuideStress[]} [stress]
 * @property {QuickGuideConflict[]} [conflicts]
 * @property {QuickGuideNpc[]} [npcs]
 */

/**
 * @typedef {Object} SettlementQuickGuide
 * @property {1} version
 * @property {string} identitySentence
 * @property {QuickGuideFact[]} definingTruths
 * @property {QuickGuideFact} immediatePressure
 * @property {QuickGuidePerson[]} importantPeople
 * @property {QuickGuideFact} entryPoint
 */

/**
 * Compose the deliberately small 1 / 3 / 1 / 3 / 1 settlement guide.
 *
 * Complete generated settlements produce all three truths and all three people.
 * Sparse or legacy records remain honest: missing people are not fabricated, and
 * missing pressure or hook data is called out explicitly.
 *
 * @param {SettlementQuickGuideSource | null | undefined} settlement
 * @returns {SettlementQuickGuide}
 */
export function composeSettlementQuickGuide(settlement) {
  const source = settlement && typeof settlement === 'object' ? settlement : {};

  return {
    version: 1,
    identitySentence: composeIdentity(source),
    definingTruths: [
      composeFoundationTruth(source),
      composeAuthorityTruth(source),
      composeMaterialTruth(source),
    ],
    immediatePressure: composePressure(source),
    importantPeople: selectImportantPeople(source),
    entryPoint: composeEntryPoint(source),
  };
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {string}
 */
function composeIdentity(settlement) {
  const name = cleanText(settlement.name) || 'This settlement';
  const tier = cleanText(settlement.tier) || 'settlement';
  const population = finiteNumber(settlement.population);
  const cultureLabel = cleanText(
    settlement.culturalIdentity?.label
      || settlement.culture?.label,
  );
  const cultureKey = cleanText(settlement.culturalIdentity?.key);

  const descriptors = [
    cultureLabel,
    tier.toLowerCase(),
  ].filter(Boolean).join(' ');
  const populationPhrase = population == null
    ? ''
    : ` of ${formatCount(population)} ${population === 1 ? 'person' : 'people'}`;

  const article = articleFor(descriptors);

  const phrase = scopePhrase(cultureKey);
  if (phrase) {
    return sentence(`${name} is ${article} ${descriptors}${populationPhrase}, ${phrase}`);
  }

  const historicalCharacter = cleanText(settlement.history?.historicalCharacter);
  if (historicalCharacter) {
    return sentence(
      `${name} is ${article} ${descriptors}${populationPhrase}, ${lowerLead(firstSentence(historicalCharacter))}`,
    );
  }

  return sentence(`${name} is ${article} ${descriptors}${populationPhrase}`);
}

/**
 * THE ARTICLE THE IDENTITY SENTENCE TAKES, per LEAD WORD.
 *
 * ⚠ IT WAS HARDCODED 'a', so every Arabic-inspired and East-Asian-inspired settlement
 * read "is a Arabic-inspired village" on the DM's first screen. ⚠ AND THE OBVIOUS
 * REPAIR IS ALSO WRONG: `/^[aeiou]/` gives "an European" and "an one-street hamlet",
 * because English takes the article from the SOUND and not from the letter.
 *
 * So the words the product actually mints are listed, and nothing is inferred for
 * them: the eleven authored culture labels and the six tiers. The rule below is a
 * fallback for a label this file did not write - a legacy save, a custom identity -
 * where being right most of the time is the best available and being wrong is no
 * worse than the hardcoded article it replaces.
 *
 * @type {Readonly<Record<string, 'a' | 'an'>>}
 */
const ARTICLE_BY_LEAD = Object.freeze({
  'Germanic-inspired': 'a',
  'Latin-inspired': 'a',
  'Celtic-inspired': 'a',
  'Arabic-inspired': 'an',
  'Norse-inspired': 'a',
  'Slavic-inspired': 'a',
  'East-Asian-inspired': 'an',
  'Mesoamerican-inspired': 'a',
  'South-Asian-inspired': 'a',
  'Steppe-inspired': 'a',
  'Greek-inspired': 'a',
  thorp: 'a',
  hamlet: 'a',
  village: 'a',
  town: 'a',
  city: 'a',
  metropolis: 'a',
  settlement: 'a',
});

/**
 * ⛔ WHOLE WORDS, NOT PREFIXES. The first spelling of this rule matched `/^(?:eu|one|uni|…)/`
 * and over-fired on every word that merely STARTS that way: "a uninhabited hamlet",
 * "a unimportant village", "a Oneiric-inspired town". A prefix cannot tell `unified`
 * (/juː/, takes 'a') from `uninhabited` (/ʌ/, takes 'an'), because the distinction is
 * the vowel that follows, not the letters that open. Both lists are therefore keyed on
 * the lead's first WORD and are kept as short as the defect allows.
 */
/**
 * ⭐⭐ THE RULE IS INVERTED FROM HERE ON (review 10, 2026-09-18), and the measurement is the
 * whole argument. The previous cut asked "does this look like a consonant-sound word?" with a
 * `uni-` PREFIX behind an eighteen-word exception set — a NEGATIVE list against an open class.
 * Measured against a dictionary: 538 of 542 `un` + vowel words came out wrong ("a uninspired",
 * "a unintended", "a unimaginable"), because the exception set can only ever name the handful
 * somebody thought of, and `un-` is the most productive negating prefix in English.
 *
 * So the polarity is reversed. `an` is now the DEFAULT for a written vowel, which is right for
 * the whole open `un-` class at once, and the words that break it are POSITIVE lists that can
 * only shrink the answer where somebody has actually looked. A missing entry now costs one
 * wrong article on one unusual word instead of an entire word class.
 */

/**
 * Whole words that open with a written vowel and a CONSONANT sound — exact spellings the
 * stems below cannot safely reach, because their own prefix is shared with a word that takes
 * the other article ("one" against "oneiric", "ewe" against "ewer" is fine but "ew" is not).
 */
const CONSONANT_SOUND_WORDS = new Set([
  'one', 'ones', 'oneself', 'once', 'ewe', 'ewer', 'ouija',
]);

/**
 * ⭐ THE POSITIVE LIST, AS STEMS — every written-vowel opening that is really said with a
 * consonant, enumerated rather than guessed. Each stem is chosen so that NO word starting
 * with it takes 'an': `unit` reaches unit/unite/unity/united/unitary, `univ` reaches
 * universe/universal/university/univalent/univocal, `use` reaches use/used/useful/user, and
 * none of them can be reached by `un` + a vowel-initial word.
 *
 * ⛔ WHY THERE IS NO BARE `uni` STEM, WHICH IS THE WHOLE LESSON. `uni` cannot tell `uniform`
 * (/juː/) from `uninspired` (/ʌn/ + `inspired`), because the sound is decided by what FOLLOWS
 * and both are followed by a consonant letter. The old spelling kept the bare prefix and tried
 * to subtract the exceptions; this one never admits the ambiguous prefix in the first place.
 * A `uni-` word the list misses falls to 'an', which is wrong for that ONE word rather than
 * for the five hundred the prefix was swallowing.
 *
 * `ur[aeio]` is the /jʊər/ family — urine, uranium, urea, ureter, urology — and it requires the
 * vowel, so `urn`, `urban` and `urge` are untouched and still take 'an'/'a' by the rules below.
 */
const CONSONANT_SOUND_STEMS =
  /^(?:eu|ewe|ouija|ubiq|ufo|uku|unanim|unicam|unicel|unico(?:de|rn)|unicycl|unifi|unifor|unify|unilater|unilingu|unio|uniqu|unisex|unison|unit|univ|ur[aeio]|usa|use|usu|ute|util|utop)/;

/**
 * The other positive list: written CONSONANTS that open with a vowel sound, so they take 'an'.
 * The silent h, plus the American `herb`. Exact words, never a stem — `her`, `herd`, `Herbert`
 * and `honeycomb` all open with the ordinary consonant and must not be caught.
 */
const VOWEL_SOUND_WORDS = new Set([
  'heir', 'heiress', 'heirloom', 'honest', 'honesty', 'honestly',
  'honour', 'honor', 'honourable', 'honorable', 'honorary', 'honorific',
  'hour', 'hourglass', 'hourly', 'herb', 'herbs', 'herbal', 'herbalist', 'herbaceous',
]);

/**
 * ⭐ AN INITIALISM IS READ LETTER BY LETTER, so its article answers to the NAME of its first
 * letter and not to the letter itself. Nine of the twenty-six were wrong before this existed:
 * "a FMG" (ef), "an URL" (you), "a SOS" (es). These twelve letter names open with a vowel
 * sound — ay, ee, ef, aitch, eye, el, em, en, oh, ar, es, ex — and every other letter, `U`
 * included, opens with a consonant one.
 */
const LETTER_NAME_TAKES_AN = new Set(['A', 'E', 'F', 'H', 'I', 'L', 'M', 'N', 'O', 'R', 'S', 'X']);

/**
 * The authored map, read again without regard to case.
 *
 * ⚠ IT IS A SECOND LOOKUP AND NOT A REPLACEMENT. The exact read above stays first so authored
 * copy is decided byte-for-byte as it always was; this one catches the same authored words in
 * a custom label's own casing — `METROPOLIS`, `Village`, `ARABIC-INSPIRED` — which would
 * otherwise fall through to the initialism rule and be spelled out letter by letter.
 * @type {Readonly<Record<string, 'a' | 'an'>>}
 */
const ARTICLE_BY_LEAD_LOWER = Object.freeze(Object.fromEntries(
  Object.entries(ARTICLE_BY_LEAD).map(([lead, article]) => [lead.toLowerCase(), article]),
));

/**
 * The article the identity sentence takes, decided in six steps: the words the product mints
 * (exactly, then in any casing), the two sound lists, the letter name of an initialism, and
 * finally the written vowel — which now means 'an'.
 *
 * ⚠ THE ONE CLASS IT STILL GETS WRONG, said plainly rather than left to be discovered: an
 * ORDINARY WORD written in full capitals and absent from both sound lists is read as an
 * initialism, so a custom label of "MARKET TOWN" is decided on the name of `M` and comes out
 * "an MARKET TOWN". The two sound lists and the authored map are consulted FIRST precisely to
 * keep the common cases out of that branch (`HONEST`, `HOUR`, `EUROPEAN`, `USA`, `VILLAGE` and
 * every authored culture label are all decided before the letter name is ever asked for), and
 * the alternative — dropping the letter-name rule — is nine wrong articles across the
 * twenty-six single letters and every acronym the product will ever be handed.
 *
 * @param {string} descriptors
 * @returns {'a' | 'an'}
 */
function articleFor(descriptors) {
  const lead = descriptors.split(' ')[0] || '';
  // ⛔ `Object.hasOwn`, NEVER A BARE LOOKUP. `descriptors` carries a user-derived
  // `culturalIdentity.label`, and a plain-object read of it returns Object.prototype's
  // members for a label leading with `constructor`, `toString`, `valueOf` or
  // `hasOwnProperty` - each of them TRUTHY, so the function itself was returned and
  // printed: "X is function Object() { [native code] } constructor village of 9 people."
  if (Object.hasOwn(ARTICLE_BY_LEAD, lead)) return ARTICLE_BY_LEAD[lead];
  const leadLower = lead.toLowerCase();
  if (Object.hasOwn(ARTICLE_BY_LEAD_LOWER, leadLower)) return ARTICLE_BY_LEAD_LOWER[leadLower];
  // ⚠ ANCHORED. An unanchored `/[a-z]+/` takes the first letter-run ANYWHERE in the
  // lead, so "8-Isle" was decided on `Isle` and came out "an 8-Isle" - the article has
  // to answer to the character the reader actually says first.
  const raw = lead.match(/^[^a-z]*([a-z]+)/i)?.[1] || '';
  const word = raw.toLowerCase();
  if (VOWEL_SOUND_WORDS.has(word)) return 'an';
  if (CONSONANT_SOUND_WORDS.has(word) || CONSONANT_SOUND_STEMS.test(word)) return 'a';
  // THE INITIALISM, decided on the first letter's NAME. A run written entirely in capitals
  // that neither sound list claims is spelled out by a reader, so `FMG` is "ef-em-gee".
  if (/^[A-Z]+$/.test(raw)) return LETTER_NAME_TAKES_AN.has(raw[0]) ? 'an' : 'a';
  // THE DEFAULT, AND THE INVERSION: a written vowel takes 'an' unless something above knew
  // better. This is the line that gets the whole open `un-` class right.
  return /^[aeiou]/.test(word) ? 'an' : 'a';
}

/**
 * THE ELEVEN AUTHORED CULTURE PROFILES, each with the phrase the identity sentence
 * carries — KEYED ON THE PROFILE'S IDENTITY (`culturalIdentity.key`), never on its
 * authored prose.
 *
 * A culture profile's `scope` (src/data/cultureProfiles.js) is authored as
 * `<article> <terms> design grammar.`, and the guide used to read the whole string
 * out - "expressed through civic-ritual plaza, tribute, market-and-waterworks design
 * grammar" - which puts the engine's own filing word in front of a reader.
 *
 * ⚠ LIFTING THE TERMS MECHANICALLY IS WHAT THIS REPLACES, AND WHY. Four of the
 * eleven profiles carry ADJECTIVE STACKS in their scope, not noun lists: germanic,
 * norse, east_asian and steppe all modify the head noun the parse was throwing away,
 * so "built around a timber-and-stone and guild-and-estate" came out a dangling
 * modifier. A derived rule cannot tell the two shapes apart, and the shapes are a
 * property of authored copy rather than of the grammar. So the phrase is AUTHORED
 * per profile, once, here - display only.
 *
 * ⛔ AND IT IS KEYED ON THE PROFILE KEY BECAUSE A CORPUS SENTENCE MAY BE MINTED IN
 * EXACTLY ONE SOURCE MODULE (FP-G16, tests/build/cultureProfilesLazy.test.js). This
 * map used to be keyed on the authored scope STRING, which made this file a SECOND
 * mint of the corpus's fingerprint and read the law red. The key is the same identity
 * `domain/resolveCulture.js` reads, `generators/steps/assembleSettlement.js` stamps on
 * the settlement root and `pdf/lib/generationContracts.js` projects; `materializeOne`
 * writes it on EVERY materialized identity beside the scope it replaces, so the read
 * is output-identical to the scope read and no persisted shape changed.
 *
 * ⚠ THE PROPERTY THE STRING KEY BOUGHT IS NOT LOST, IT MOVED. A reworded scope no
 * longer falls out of this map by itself, so tests/domain/settlementQuickGuide.test.js
 * holds the key set BOTH WAYS against the corpus and a digest of each authored scope:
 * reword one and the pin reds, naming the profile whose paraphrase below must be
 * re-read before the digest is re-recorded.
 *
 * ⚠ AND A RECORD WITH NO `key` AT ALL TAKES THE SAME DOOR, WHICH IS THE POINT OF PUTTING
 * THE FALL-THROUGH BELOW A MISSING LOOKUP RATHER THAN BESIDE IT. No writer produces one -
 * `materializeOne` stamps `key` on every identity it makes - but an imported or
 * hand-edited save is not this leaf's to trust, and the answer for it must be a WHOLE
 * SENTENCE. Measured, on a record carrying `label` and `scope` and no `key`: with a
 * historical character it reads "… of 400 people, founded at a ford and never moved.",
 * and without one it stops at the population, which is the same terminal form a
 * settlement carrying no culture at all has always taken. Both are pinned in
 * tests/domain/settlementQuickGuide.test.js.
 *
 * ⛔ THE MIXED PROFILE IS DELIBERATELY ABSENT. `materializeCulturalIdentity`
 * synthesises it at generation time under `key: 'mixed'` - it is not in the corpus -
 * and its scope is a sentence about blending rather than a term list, while its
 * `label` already says "Germanic-inspired + Latin-inspired", so the blend is on the
 * page either way. An unmapped key yields '' and the identity sentence falls through
 * to the historical-character form it already uses for a settlement carrying no
 * culture at all.
 *
 * The map is NOT derived from CULTURE_PROFILES here on purpose: this module is a
 * headless leaf and src/data/cultureProfiles.js is lazily chunked away from the
 * first paint (tests/build/cultureProfilesLazy.test.js). The coverage pin lives in
 * tests/domain/settlementQuickGuide.test.js, which imports the corpus and asserts
 * every authored profile but the blend has a phrase here.
 *
 * @type {Readonly<Record<string, string>>}
 */
const SCOPE_PHRASE = Object.freeze({
  germanic: 'built in timber and stone, and run by guild and estate',
  latin: 'built in masonry around a civic square, and run by patronage and law',
  celtic: 'built around kin districts and an assembly ground, on pasture and earthwork',
  arabic: 'built around courtyards and waterworks, on endowed institutions and the caravan road',
  norse: 'built around the hall and the water, on assembly and what the season allows',
  slavic: 'built in timber compounds on common land, between river and forest',
  east_asian: 'built in wards and courtyards, ordered by bureau and lineage',
  mesoamerican: 'built around a civic-ritual plaza, tribute, and market-and-waterworks',
  south_asian: 'built around the tank and the bazaar, in quarters by trade, under temple and guild',
  steppe: 'built for a pastoral life half-settled and half-moving, held by clan and caravan',
  greek: 'built around the agora and the harbour, on hillside ground and civic association',
});

/**
 * ⛔ `Object.hasOwn`, NEVER A BARE LOOKUP - the hazard `articleFor` above carries,
 * on the same kind of string. The key comes off a PERSISTED record, so a save
 * carrying `key: 'constructor'` (or `toString`, `valueOf`, `hasOwnProperty`) reads
 * Object.prototype's member through a bare index, and every one of them is TRUTHY:
 * the function itself would be printed into the reader's first sentence.
 *
 * @param {string} cultureKey
 * @returns {string}
 */
function scopePhrase(cultureKey) {
  return Object.hasOwn(SCOPE_PHRASE, cultureKey) ? SCOPE_PHRASE[cultureKey] : '';
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeFoundationTruth(settlement) {
  const statedReason = firstText(settlement.settlementReason);
  const foundingReason = cleanText(settlement.history?.founding?.reason);
  const text = statedReason || foundingReason;

  return fact(
    'foundation',
    'Why it exists',
    text ? sentence(text) : 'Its founding purpose is not recorded.',
    statedReason ? 'settlementReason[0]' : (foundingReason
      ? 'history.founding.reason'
      : 'settlementReason'),
  );
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeAuthorityTruth(settlement) {
  const factions = Array.isArray(settlement.powerStructure?.factions)
    ? settlement.powerStructure.factions
    : [];
  const governing = cleanText(
    settlement.powerStructure?.governingName
      || settlement.powerStructure?.government
      || factions.find((faction) => faction?.isGoverning)?.faction,
  );
  const stability = cleanText(settlement.powerStructure?.stability);

  let text = 'No governing authority is recorded.';
  if (governing && stability) {
    text = `${governing} governs; the balance of power is ${stability.toLowerCase()}.`;
  } else if (governing) {
    text = `${governing} governs.`;
  } else if (stability) {
    text = `The balance of power is ${stability.toLowerCase()}.`;
  }

  return fact(
    'authority',
    'Who holds power',
    text,
    governing
      ? 'powerStructure.governingName'
      : 'powerStructure.stability',
  );
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeMaterialTruth(settlement) {
  const economy = settlement.economicState || {};
  const prosperity = cleanText(
    typeof economy.prosperity === 'object'
      ? economy.prosperity?.tier
      : economy.prosperity,
  );
  const food = cleanText(economy.foodSecurity?.label);
  const topExport = cleanText(firstText(economy.primaryExports));
  const situation = cleanText(economy.situationDesc);

  // The three fields were spliced in as bare labels and joined with "and", which
  // printed the generator's own vocabulary at the reader: "Struggling economy and
  // deficit — active famine food security." Each field becomes a clause of an
  // actual sentence instead. The fields, their precedence and the source path are
  // unchanged — only the rendering.
  const clauses = [];
  if (prosperity) clauses.push(`the economy is ${prosperity.toLowerCase()}`);
  if (food) clauses.push(foodSecurityClause(food));

  let text = clauses.length ? upperLead(clauses.join('; ')) : '';
  if (topExport) {
    const exportClause = `Its leading export is ${lowerLead(topExport)}`;
    text = text ? `${sentence(text)} ${exportClause}` : exportClause;
  }

  return fact(
    'material_life',
    'How it lives',
    text
      ? sentence(text)
      : (situation ? sentence(situation) : 'Its material condition is not yet recorded.'),
    text
      ? 'economicState.prosperity|foodSecurity|primaryExports'
      : 'economicState.situationDesc',
  );
}

/**
 * THE SIX LABELS `generateFoodSecurity` CAN EMIT (src/generators/foodGenerator.js),
 * each as the clause a sentence can carry. Keyed by the label lowercased with its
 * dash normalized, so a legacy save's hyphen cannot miss the famine row. A label
 * outside the ladder names itself rather than vanishing.
 *
 * @type {Readonly<Record<string, string>>}
 */
const FOOD_SECURITY_CLAUSE = Object.freeze({
  'deficit - active famine': 'food is in deficit and famine is active',
  deficit: 'food is in deficit',
  'import-dependent': 'the food supply depends on imports',
  pressured: 'the food supply is under pressure',
  surplus: 'there is food to spare',
  secure: 'the food supply is secure',
});

/** @param {string} label @returns {string} */
function foodSecurityClause(label) {
  const key = label.toLowerCase().replace(/[\u2013\u2014]/g, '-');
  return FOOD_SECURITY_CLAUSE[key] || `the food supply is ${label.toLowerCase()}`;
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composePressure(settlement) {
  const direct = cleanText(settlement.pressureSentence);
  if (direct) {
    return fact(
      'immediate_pressure',
      'What is urgent',
      sentence(direct),
      'pressureSentence',
    );
  }

  const stressors = Array.isArray(settlement.stressors)
    ? settlement.stressors
    : (Array.isArray(settlement.stress) ? settlement.stress : []);
  const stress = stressors.find(Boolean);
  const stressText = cleanText(
    stress?.summary
      || stress?.description
      || stress?.crisisHook
      || stress?.label
      || stress?.type,
  );
  if (stressText) {
    return fact(
      'immediate_pressure',
      'What is urgent',
      sentence(stressText),
      'stressors[0]',
    );
  }

  const conflicts = Array.isArray(settlement.conflicts)
    ? settlement.conflicts
    : [];
  const conflict = conflicts.find(Boolean);
  const conflictText = cleanText(
    conflict?.desc
      || conflict?.description
      || conflict?.issue
      || conflict?.tension
      || conflict?.stakes,
  );

  return fact(
    'immediate_pressure',
    'What is urgent',
    conflictText
      ? sentence(conflictText)
      : 'No immediate pressure is currently recorded.',
    conflictText ? 'conflicts[0]' : 'pressureSentence',
  );
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuidePerson[]}
 */
function selectImportantPeople(settlement) {
  const npcs = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  return npcs
    .map((npc, index) => ({ npc, index }))
    .filter(({ npc }) => npc && typeof npc === 'object')
    .sort((left, right) => {
      const powerDelta = numericPower(right.npc) - numericPower(left.npc);
      if (powerDelta !== 0) return powerDelta;

      const influenceDelta = influenceRank(left.npc) - influenceRank(right.npc);
      return influenceDelta !== 0 ? influenceDelta : left.index - right.index;
    })
    .slice(0, 3)
    .map(({ npc, index }) => ({
      id: cleanText(npc.id) || `npc-${index + 1}`,
      name: cleanText(npc.name) || 'Unnamed person',
      role: cleanText(npc.role || npc.title) || 'Notable local',
      detail: personDetail(npc),
      sourcePath: `npcs[${index}]`,
    }));
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeEntryPoint(settlement) {
  const hook = collectPlotHooks(
    /** @type {Parameters<typeof collectPlotHooks>[0]} */ (settlement),
  )[0];
  if (hook?.text) {
    return fact(
      'entry_point',
      'Where play begins',
      sentence(hook.text),
      `plotHooks:${hook.category || 'unknown'}`,
    );
  }

  const tension = settlement.history?.currentTensions?.find?.(Boolean);
  const tensionText = cleanText(tension?.description || tension?.plotHooks?.[0]);
  return fact(
    'entry_point',
    'Where play begins',
    tensionText
      ? sentence(tensionText)
      : 'No immediate entry point is currently recorded.',
    tensionText
      ? 'history.currentTensions[0]'
      : 'plotHooks',
  );
}

/**
 * @param {QuickGuideNpc} npc
 * @returns {string}
 */
function personDetail(npc) {
  const goal = cleanText(
    typeof npc.goal === 'object'
      ? (npc.goal?.short || npc.goal?.long)
      : npc.goal,
  );
  if (goal) return sentence(`Wants to ${lowerLead(stripInfinitive(goal))}`);

  const tell = cleanText(
    typeof npc.personality === 'object'
      ? (npc.personality?.tell || npc.personality?.dominant)
      : npc.personality,
  );
  if (tell) return sentence(tell);

  const secret = cleanText(
    typeof npc.secret === 'object'
      ? npc.secret?.what
      : npc.secret,
  );
  if (secret) return sentence(`Secret: ${lowerLead(secret)}`);

  return 'No immediate agenda is recorded.';
}

/**
 * @param {string} id
 * @param {string} label
 * @param {string} text
 * @param {string} sourcePath
 * @returns {QuickGuideFact}
 */
function fact(id, label, text, sourcePath) {
  return { id, label, text, sourcePath };
}

/** @param {unknown} value @returns {string} */
function cleanText(value) {
  return typeof value === 'string'
    ? value.replace(/\s+/g, ' ').trim()
    : '';
}

/** @param {unknown} value @returns {string} */
function firstText(value) {
  if (Array.isArray(value)) {
    return cleanText(value.find((entry) => cleanText(entry)));
  }
  return cleanText(value);
}

/** @param {unknown} value @returns {number | null} */
function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

/** @param {QuickGuideNpc} npc @returns {number} */
function numericPower(npc) {
  const power = Number(npc?.power);
  return Number.isFinite(power) ? power : 0;
}

/** @param {QuickGuideNpc} npc @returns {number} */
function influenceRank(npc) {
  const influence = cleanText(npc.influence);
  if (influence === 'high' || influence === 'moderate' || influence === 'low') {
    return INFLUENCE_RANK[influence];
  }
  return 3;
}

/** @param {string} value @returns {string} */
function lowerLead(value) {
  return value ? value[0].toLowerCase() + value.slice(1) : '';
}

/** @param {string} value @returns {string} */
function upperLead(value) {
  return value ? value[0].toUpperCase() + value.slice(1) : '';
}

/** @param {string} value @returns {string} */
function stripInfinitive(value) {
  return value.replace(/^to\s+/i, '');
}

/** @param {string} value @returns {string} */
function firstSentence(value) {
  const match = cleanText(value).match(/^.*?[.!?](?:\s|$)/);
  return (match ? match[0] : cleanText(value)).replace(/[.!?]+$/, '');
}

/** @param {string} value @returns {string} */
function sentence(value) {
  const text = cleanText(value);
  if (!text) return '';
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

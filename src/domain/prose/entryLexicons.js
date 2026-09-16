/**
 * domain/prose/entryLexicons.js — THE PUBLISHED LEXICONS of the same-entry walker.
 *
 * WHY THEY LIVE APART FROM THE WALKER. FINITE SEMANTICS (the estate's law) splits every
 * arm in two: a regex is the DETECTOR of a candidate noun or predicate, and a typed TABLE
 * is the JUDGE of whether the world holds it. A detector that is not published is a
 * detector nobody can argue with — the "no model's judgment gates" rule (fault 32) applies
 * to word lists as much as to models. So every word list the walker keys on is exported
 * from this leaf, named, and countable; a reviewer can read the whole vocabulary in one
 * file and a receipt can print its size.
 *
 * NOTHING HERE JUDGES. A member of `EXEMPTION_LEMMAS` is not a fault; it is a sentence
 * worth asking the institution table about. Every verdict is `entryWalker.js`'s, and every
 * verdict names the column it consulted.
 *
 * PURE, HEADLESS, IMPORT-FREE. No settlement, no clock, no RNG, no I/O. Nothing here runs
 * at the draw: `stateProseKernel.drawVariant` neither imports this file nor is imported by
 * it (THE PROMISE — an installed world's draws do not move because a lint walker landed).
 */

/**
 * The closed quantity vocabulary, TRANSCRIBED FROM `worldPulse/demographicsHerald.js`'s
 * `QUANTITY_BANDS` plus the zero word `quantityWords` returns.
 *
 * ⚠ THIS IS A TRANSCRIPTION AND THE WALKER PINS IT. Importing `demographicsHerald.js`
 * would drag a worldPulse module (and its `HERALD_TUNING` owner numbers) into a display
 * lint leaf for seven strings. The cost of the copy is drift; the cure for the drift is
 * `tests/lint/proseEntryContradiction.walker.test.js`, which imports the real
 * `QUANTITY_BANDS` and asserts this list is exactly its phrases plus `nobody`. A copy with
 * a pin is one home with two spellings; a copy without one is the hand-copy drift class.
 * @type {ReadonlyArray<string>}
 */
export const BAND_PHRASES = Object.freeze([
  'nobody',
  'a few souls',
  'a dozen or so',
  'dozens',
  'a hundred or so',
  'several hundred',
  'many hundreds',
  'thousands',
]);

/**
 * Authored magnitude words that are NOT a figure: they band or hedge a quantity without
 * naming one. `check-pair.mjs:39`'s `COUNT` set is the source; the members that are
 * TOTALITIES (`all`, `every`, `none`, `most`) are deliberately absent here and live in
 * `QUANTIFIERS` instead, because a totality is judged against a column's `closed` flag and
 * a magnitude is judged against the band vocabulary. One word, one arm.
 * @type {ReadonlyArray<string>}
 */
export const AUTHORED_MAGNITUDES = Object.freeze([
  'no one', 'a handful', 'a score', 'scores', 'a dozen', 'half', 'several', 'some', 'many',
  'a few', 'a couple', 'countless', 'numerous',
]);

/**
 * The count NOUNS a band word may govern. A band moved from one of these to another is a
 * claim change even when the band word is unchanged (U11 #4: souls → households).
 * @type {ReadonlyArray<string>}
 */
export const COUNT_NOUNS = Object.freeze([
  'souls', 'soul', 'people', 'person', 'persons', 'households', 'household', 'families',
  'family', 'hands', 'mouths', 'heads', 'inhabitants', 'residents', 'men', 'women',
  'children', 'freemen', 'villagers', 'townsfolk', 'houses', 'hearths',
]);

/**
 * Cardinal number words. A run of these is a FIGURE — the thing `QUANTITY_BANDS` exists to
 * keep out of the record (A4/U11; no digits in dossier-state prose, PROSE_INVENTORY §7.8).
 * `one` is EXCLUDED from the run detector by construction and handled separately: it is a
 * pronoun and an article far more often than a count ("one of the two accounts"), and a
 * detector that reds on it reds on half the estate.
 * @type {ReadonlyArray<string>}
 */
export const CARDINAL_WORDS = Object.freeze([
  'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
  'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
  'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty',
  'ninety', 'hundred', 'thousand', 'million',
]);

/**
 * Totality words. Each is judged against the `closed` flag of the COLUMN its governed noun
 * resolves to (CLERK-LAWS §1.3 row 7; §1.4's lesson in one line — a row licenses a noun and
 * a predicate, only a CLOSED column licenses a quantifier).
 *
 * ⛔ `nobody` AND `no one` ARE DELIBERATELY ABSENT. Both are the value `quantityWords(0)`
 * returns, so on a settlement whose count is zero they are the BAND, not a totality, and a
 * walker that reds on them reds on the licensed rendering of a typed field.
 * @type {ReadonlyArray<string>}
 */
export const QUANTIFIERS = Object.freeze([
  'every', 'all', 'each', 'only', 'none', 'everyone', 'everybody', 'everything',
  'any', 'no', 'whole', 'entire', 'without exception', 'to a man', 'universally',
]);

/**
 * Duty PREDICATES — what an office or an institution DOES to a count (CLERK-LAWS §1.3 rows
 * 2 and 3; §2.2 class C2).
 *
 * ⚠ INFLECTED FORMS ONLY, AND THE REASON IS A MEASURED FALSE POSITIVE. Every one of these
 * stems is also a common NOUN in this estate — a muster, a toll, a tithe, the tax, the
 * count — and a first cut that matched bare stems failed the NL-4 gender fixture's PASS
 * arm on the phrase "since the last muster": a duty fault reported on an event noun. A duty
 * is a predicate, so the detector wants a predicate's shape. Bare stems live in
 * `DUTY_STEM_NOUNS` and raise a NOTE, never a FAIL.
 * @type {ReadonlyArray<string>}
 */
export const DUTY_PREDICATES = Object.freeze([
  'counts', 'counted', 'counting',
  'collects', 'collected', 'collecting',
  'levies', 'levied', 'levying',
  'registers', 'registered', 'registering',
  'tithes', 'tithed', 'tithing',
  'taxes', 'taxed', 'taxing',
  'tolled',
  'assesses', 'assessed', 'assessing',
  'musters', 'mustered', 'mustering',
  'enrols', 'enrolled', 'enrolling', 'enrolls',
  'reckons', 'reckoned',
]);

/**
 * The same lemmas as BARE STEMS, which in this estate read as nouns far more often than as
 * predicates. A hit raises a NOTE naming the ambiguity, never a FAIL.
 * @type {ReadonlyArray<string>}
 */
export const DUTY_STEM_NOUNS = Object.freeze([
  'count', 'collect', 'levy', 'register', 'tithe', 'tax', 'toll', 'assess', 'muster',
  'enrol', 'enroll', 'reckon',
]);

/**
 * Exemption predicates. The `whoIsExempt` column is NULL on every settlement the product
 * can generate today (CLERK-LAWS §1.2, measured at 3b1c0eaa5), so every member of this set
 * is an assertion with no column behind it until an exemption writer lands — which is an
 * owner-gated schema act (§4). The one typed exemption FAMILY the world holds is a treaty
 * TOLL term between settlements, and it is a route's exemption from a toll, never a
 * person's exemption from a count.
 * @type {ReadonlyArray<string>}
 */
export const EXEMPTION_LEMMAS = Object.freeze([
  'exempt', 'exempts', 'exempted', 'exemption', 'exemptions',
  'not counted', 'uncounted', 'untaxed', 'untithed',
  'does not count', 'do not count', 'never counts', 'never count',
  'free of the toll', 'free of the levy', 'free of the tithe',
]);

/**
 * Exemption lemmas that are AMBIGUOUS in ordinary prose and fire only beside a duty word.
 *
 * ⚠ MEASURED, NOT GUESSED. A first cut put `spared` in the unambiguous set and the corpus
 * run returned three findings on sentences about weather and terrain — "the high ground
 * spares it", "has been spared the memorable" — none of which asserts an exemption from
 * anything. FINITE SEMANTICS says the regex detects and the TABLE judges; here the regex was
 * not even detecting the right thing. An exemption is an exemption FROM A DUTY, so the
 * ambiguous lemma needs the duty in the same entry.
 * @type {ReadonlyArray<string>}
 */
export const AMBIGUOUS_EXEMPTION_LEMMAS = Object.freeze([
  'spared', 'spares', 'excused', 'excuses',
  'immune', 'immunity', 'immunities',
  'pays nothing', 'pay nothing', 'takes nothing', 'take nothing',
  'free of',
]);

/** The duty context an ambiguous exemption lemma needs before it is an exemption at all. */
export const DUTY_CONTEXT_WORDS = Object.freeze([
  'tithe', 'tithes', 'levy', 'levies', 'tax', 'taxes', 'toll', 'tolls', 'due', 'dues',
  'roll', 'rolls', 'register', 'count', 'counts', 'muster', 'rent', 'rents', 'custom',
  'customs', 'duty', 'duties',
]);

/**
 * SUPPLY-CHAIN and ROUTE claims. A goods sentence that names a PROCESSING step or a route
 * DIRECTION asserts a fact the state field does not hold: `resources[].flow` licenses a flow
 * WORD, a route field licenses the route, and a processing claim needs a `supplyChainState`
 * chain row (CLERK-LAWS §1.4's third row — "salted" and "upriver" are exactly this).
 *
 * ⚠ THE CHANNEL IS **WITHHELD**, NOT FAIL, AND THAT IS DELIBERATE. Whether a given town's
 * chain row licenses the step is a per-settlement read no corpus-wide ground carries, so the
 * walker names the field it wanted and hands the item to the refuter (§2.4's own expected
 * verdict for the Brackwater fixture's second sentence).
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const SUPPLY_CLAIM_LEXICONS = Object.freeze({
  /** a processing step: the good was WORKED before it moved */
  processing: Object.freeze([
    'salted', 'smoked', 'cured', 'dried', 'milled', 'tanned', 'brewed', 'forged',
    'woven', 'fulled', 'malted', 'pressed', 'refined', 'smelted',
  ]),
  /** a route direction or mode */
  route: Object.freeze([
    'upriver', 'downriver', 'upstream', 'downstream', 'overland', 'inland',
    'by road', 'by river', 'by sea', 'over the pass', 'along the coast',
  ]),
});

/**
 * Candidate OFFICE nouns — the detector half of C2's first limb. The JUDGE is the table's
 * `office` column, whose values are the settlement's own role nouns; a noun on this list
 * that the column does not hold is an office the world does not have.
 *
 * `bailiff` heads the list because it is the Brackwater lesson's own noun and has ZERO hits
 * anywhere in `src` or `docs/content` at 3b1c0eaa5 (CLERK-LAWS §1.2, re-measured by this
 * lane). `reeve` is here as a noun the estate holds only as part of an institution NAME.
 * @type {ReadonlyArray<string>}
 */
export const OFFICE_NOUN_CANDIDATES = Object.freeze([
  'bailiff', 'reeve', 'sheriff', 'constable', 'magistrate', 'beadle', 'sergeant',
  'steward', 'chamberlain', 'seneschal', 'castellan', 'warden', 'provost',
  'mayor', 'burgess', 'alderman', 'councillor', 'governor', 'prefect',
  // ⛔ `prior` IS DELIBERATELY ABSENT. It is an office (a monastic one) and an adjective,
  // and in this estate it is the adjective every time — "each prior government" was the
  // arm's one false finding over the whole dossier corpus. A detector that fires on an
  // adjective makes the table's judgment meaningless.
  'priest', 'priestess', 'abbot', 'abbess', 'bishop', 'chaplain',
  'guildmaster', 'guild master', 'master of the guild',
  'captain', 'watch captain', 'archmagister', 'court advisor', 'house steward',
  'tax collector', 'toll keeper', 'gatekeeper', 'clerk of the rolls',
]);

/**
 * Relation predicates — C6's detector. A relation between two institutions, or between an
 * institution and a faction, is named only where a JOIN FIELD holds it (`factionSource`,
 * `linkToInst`, `institutionLink`, the backing-category rule, `controlsInstitutionIds`).
 * Two names on one roll are two names (best-ai.md §26 — fault 26, the Brackwater sentence's
 * own fault per NL-4).
 * @type {ReadonlyArray<string>}
 */
export const RELATION_LEMMAS = Object.freeze([
  'backed by', 'backs the', 'answers to', 'answerable to', 'in the pay of',
  'under the protection of', 'beholden to', 'controlled by', 'controls the',
  'allied with', 'in alliance with', 'sworn to', 'owes fealty', 'reports to',
  'at the behest of', 'on behalf of', 'in the service of', 'serves the',
  'hand in glove', 'in league with',
]);

/**
 * C3's LEXICAL half — the four word classes that assert something a STATE-only field cannot
 * hold (R-DST-B; U12 #14, #19, #34, #37). The SEMANTIC half ("is this clause historical?")
 * is not mechanisable and is WITHHELD to the refuter per A6.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const PROVENANCE_LEXICONS = Object.freeze({
  /** A capacity claim: what the place COULD hold, not what it holds. */
  capacity: Object.freeze([
    'can house', 'could house', 'can hold', 'could hold', 'has room for',
    'room enough for', 'capacity for', 'can feed', 'could feed', 'can shelter',
  ]),
  /** A spatial configuration claim on a field that holds no geometry. */
  spatial: Object.freeze([
    'arranged around', 'laid out around', 'clustered around', 'ringed by',
    'set back from', 'built along', 'strung along', 'terraced above',
    'on the far bank', 'across the square from',
  ]),
  /** An ACTOR verb: somebody DID this, on a field that names no actor. */
  actor: Object.freeze([
    'ordered', 'decreed', 'commanded', 'appointed', 'dismissed', 'banished',
    'founded', 'razed', 'rebuilt', 'burned', 'seized', 'granted', 'revoked',
  ]),
  /** A dated claim: a year, a reign, a numbered anniversary. */
  dated: Object.freeze([
    'in the year', 'years ago', 'a year ago', 'in the reign of', 'since the year',
  ]),
});

/**
 * The SMALL-PARTICULARS ALLOWANCE (R-DA-09, D11, CL-3) as a WHITELIST OF KINDS, never a
 * tolerance number. Two records of one town may differ in these and neither is corrected —
 * Wolfe 41's device, which the checker must not erase. Anything NOT on this list that
 * differs across siblings in a typed fact is C5's fault.
 * @type {ReadonlyArray<string>}
 */
export const SMALL_PARTICULARS = Object.freeze([
  'name form', 'date shape', 'wording', 'word order', 'standpoint', 'sentence count',
  'which particular is chosen', 'punctuation',
]);

/**
 * Equivalence classes over the band vocabulary. Two siblings using different members of one
 * class do NOT contradict (they are the same value differently worded — a small particular);
 * two using members of different classes do.
 * @type {ReadonlyArray<ReadonlyArray<string>>}
 */
export const BAND_EQUIVALENCE = Object.freeze([
  Object.freeze(['nobody', 'no one', 'none', 'not one']),
  Object.freeze(['a few souls', 'a few', 'a handful']),
  Object.freeze(['a dozen or so', 'a dozen']),
  Object.freeze(['dozens', 'scores', 'a score']),
  Object.freeze(['a hundred or so']),
  Object.freeze(['several hundred']),
  Object.freeze(['many hundreds']),
  Object.freeze(['thousands']),
]);

/**
 * The CONTRAST shapes — `check-pair.mjs:60`'s regex EXTENDED by the two shapes the taste
 * sample's refutations found it blind to (SITTING §J gap (c)): `never X so much as Y`, and a
 * trailing coordinate negation (`…, and not Y`).
 * @type {RegExp}
 */
export const CONTRAST_SHAPES = /\brather than\b|\bnot [^.,;]{1,40}, but\b|\bnot [^.,;]{1,40} but\b|, not [a-z][^.,;]{0,40}[.;]|\bnot [^.,;]{1,30}, (it|this|that) is\b|\bless [^.,;]{1,30} than\b|\bnever [^.,;]{1,40} so much as\b|\b(and|or) not [a-z][^.,;]{0,40}[.;]/g;

/**
 * The four CLOSE KINDS a record's last clause may land on (R-DA-04's "vary the kind of
 * close"; NL-7, H-9, CL-10, CC-13). The arm reports the DISTRIBUTION across a pool; a pool
 * whose every variant closes in one kind is the finding.
 * @type {Readonly<Record<string, RegExp>>}
 */
export const CLOSE_KINDS = Object.freeze({
  /** lands on a civic thing the field names */
  civicNoun: /\b(hall|granary|toll|bar|gate|wall|walls|market|mill|quay|wharf|road|bridge|temple|shrine|barracks|watch|muster|rolls|register|ledger|court|keep|citadel|warehouse|forge|smithy|dock|well|square)\b[^a-z]*$/i,
  /** lands on a standing fact of the record */
  standingFact: /\b(stands|remains|holds|keeps|is|are|was|were|has|have)\b[^.]*$/i,
  /** lands on a pronoun — the shape R-DA-04 and check-pair:129 both refuse */
  pronoun: /\b(it|them|there|this|that|one)\s*[.]?$/i,
  /** lands on an abstraction — the shape R-DA-15's direction moves away from */
  abstraction: /\b(reason|reasons|matter|question|kind|sort|thing|fact|record|arrangement|habit|custom|practice|order|business)\s*[.]?$/i,
});

/** Bare-relative adjacency (SITTING §J gap (g)): `name what`, `title what`. @type {RegExp} */
export const BARE_RELATIVE = /\b(name|names|title|titles|call|calls|called)\s+(what|who|whom|which)\b/gi;

/**
 * A specificational copula — "X is what Y calls itself", "the {seat} is the government".
 * The exhaustivity arm (SITTING §J gap (i)) reads it against `closed(column)`: an inverted
 * or specificational copula entails that the subject is the ONLY value of its column.
 * @type {RegExp}
 */
export const SPECIFICATIONAL_COPULA = /\b(is|are|was|were)\s+(what|who|the only|the one)\b|^\s*the\s+[a-z{][^.]{0,60}\bis\s+the\s+[a-z{]/i;

/** A citation of a record whose CONTENT, not existence, licenses the predicate (fault 25). @type {RegExp} */
export const RECORD_CITATION = /\b(the (rolls|register|registers|ledger|ledgers|records?|rolls?|books?|charter|charters|writ|writs|roll)) (say|says|show|shows|hold|holds|carry|carries|name|names|record|records|have|has)\b/gi;

/** A bare future indicative — STATE never FATE (`check-pair.mjs:123`, estate-wide A2). @type {RegExp} */
export const FUTURE_INDICATIVE = /\b(will|shall)\b/i;

/**
 * domain/facts/registeredWords.js — THE REGISTERED WORDS and THEIR MATCHER, written once (W2-B-DECLARE,
 * 2026-11-12; the chair's records 288, 290 and 294: "a line that uses a registered word must carry that
 * word's disqualifier"; the procedure §3.2 and §5.4).
 *
 * A line that names a THING presumes the town has it; a line that names a STATE presumes it is in force; a
 * SIZE word presumes a place of that size; a COUNT presumes there are that many. Each registered word is
 * written ONCE here, beside:
 *   `atoms`   the vocabulary atoms (`factVocabulary.js :: FACT_DIMENSIONS`) whose declaration on a line
 *             answers for it — its DISQUALIFIER: a line declaring one of them is refused where the town
 *             makes the word false. A word ending in ':' stands for any band of that dimension
 *             (`population:`); an empty list means the vocabulary has no atom yet (the word's `leaf`
 *             names the home its atom will read);
 *   `absent`  true when the town makes the word false, read from the vocabulary's own readers
 *             (`factsOf`), the live roster's names, or the record's own field where no reader exists yet;
 *   `leaf`    the home that answers it; `layer` P, S or T (the layer map's record 292).
 *
 * THE MATCHER (`thingsNamedIn`, `thingsDeniedIn`, `negates`, `deniesExistence`, `sentencesOf`) is the
 * presumed-things walker's own, moved here VERBATIM from its rule book (`tests/lint/presumedThings.shared.mjs`,
 * which re-exports it), so the walker's source arm, its printed arm and the page arm
 * (`coherence/vocabularyPageFindings.js`) read one matcher. A word read in another sense is a row with its
 * reason in the reader's register; the matcher is never loosened to pass a line.
 *
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/lint/presumedThings.walker.test.js
 * @enforced-by tests/domain/coherence/vocabularyPageFindings.test.js
 */
import { INSTITUTION_SERVICES } from '../../data/institutionServices.js';
import { institutionalCatalog } from '../../data/institutionalCatalog.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { magicPractitioners } from '../magicReliance.js';
import { dmPowerViewOf } from '../people/patronage.js';
import { CRISIS_FAMILY_KINDS, CRISIS_KIND_ALIASES, CRISIS_KIND_WORDS, FACT_DIMENSIONS, parseAtom } from './factVocabulary.js';

/**
 * The facts a rule reads: `factsOf(record)`'s own frozen reading.
 * @typedef {ReturnType<typeof import('./factsOf.js').factsOf>} WordFacts
 */

/**
 * The fields of the record a rule reads where no fact reader exists yet (the powers' list, the food record's
 * two figures), and the record `magicPractitioners` reads.
 * @typedef {import('../magicReliance.js').MagicRelianceSource & {
 *   powerStructure?: { factions?: unknown } | null,
 *   economicState?: { foodSecurity?: { foodRecord?: { growsMoreThanEats?: unknown, normalImportPct?: unknown } | null } | null } | null,
 * }} WordRecord
 */

/**
 * @typedef {object} RegisteredWord
 * @property {RegExp} words the words that name it
 * @property {ReadonlyArray<string>} atoms THE WORD'S TRUTH, as presence atoms: the word is true where ANY of them holds
 *   (W2-B-DECLARE second seat, F3: a declaration answers the word only if it IMPLIES it — `declarationImplies`)
 * @property {ReadonlyArray<string>} [sufficient] presence atoms that each imply the word without being its definition
 *   (`commander` implies a garrison); read on the naming side only
 * @property {Readonly<Record<string, ReadonlyArray<string>>>} [bands] a band dimension → the bands in which the word is
 *   true (`quarters`: population middling or large); a band declaration answers only if every band it admits is here
 * @property {ReadonlyArray<string>} [kinds] crisis kinds: the word is true where one of them is in force
 * @property {ReadonlyArray<string>} [notKinds] crisis kinds: the word is true where NONE of them is in force (open trade)
 * @property {(facts: WordFacts, names: string[], record?: WordRecord | null, sentence?: string) => boolean} absent true when the town makes it false
 * @property {(facts: WordFacts, names: string[], record?: WordRecord | null, sentence?: string) => boolean} [presentForDenial] a narrower test for a denial
 * @property {boolean} [denialOnly] read on the denial side only
 * @property {'thing'|'state'|'size'|'count'|'value'} [kind]
 * @property {string} [leaf] the home that answers it
 * @property {'P'|'S'|'T'} [layer]
 * @property {boolean} [person] a person or a body of people: one who visits ("comes through") is not named as standing here
 * @property {RegExp} [context] the word names only in a sentence of this context (a famine to come: a sentence of food)
 * @property {string} [pageWithdrawn] WITHDRAWN FROM THE PAGE LIST, with its reason (the third seat's precision read: a
 *   family wrong more than one time in ten that no word or leaf narrows surely); the walker's source arm still reads it
 * @property {RegExp} [pageKept] a NARROW phrase family of a withdrawn word that stays on the page list (F7 of REVIEW-W2B's
 *   second read: each read nine or more in ten); a naming sentence of the word that matches it is a finding again
 */

/**
 * THE HOUSES THAT TRY DISPUTES (the chair's correction of 2026-11-12, measured by COHERENCE-AGREE-2):
 * a court is a house whose OWN catalogued service tries disputes under the public law, read from its
 * service rows, never from its name alone — the Town hall's "Dispute arbitration: Bring commercial and
 * civil disputes before a magistrate", the City hall's "Appeals court", the Town council's "Dispute
 * adjudication", the City administration's "Courts and adjudication", a Courthouse's "Civil disputes" and
 * "Criminal trials", the court buildings' "Appeals", Mayor and council's "Legal appeals", a city-state's
 * "Civic law enforcement". A headman's, elder's or reeve's mediation, a guild's arbitration and a church's
 * court are not the town's court.
 */
const COURT_SERVICE = /^(?:civil disputes|criminal trials|dispute arbitration|dispute adjudication|courts and adjudication|appeals(?: court)?|legal appeals|civic law enforcement)$/i;
export const COURT_HOUSES = Object.freeze(new Set(Object.entries(INSTITUTION_SERVICES)
  .filter(([, rows]) => Object.keys(rows || {}).some((service) => COURT_SERVICE.test(service)))
  .map(([name]) => name.toLowerCase())));

/**
 * THE FAMILIES WITHDRAWN FROM THE PAGE LIST (W2-B-DECLARE third seat, item 1: the precision read of sixty findings on the
 * census's 720). Neither is narrowed surely by its words or its leaf, so each leaves the page list; the walker's source
 * arm still reads them (a line naming them declares).
 */
const PAGE_WITHDRAWN = Object.freeze({
  thing: 'the precision read, 2 of 8 true after the narrowing by words: a hand-written thing on the page is mostly a '
    + 'standing house\'s catalogue description or service ("Levies … by road or harbour", "garrison duty and escorts"), '
    + 'an origin in the past, or two homes that disagree; arm 2 of the walker reads the printed record for these words',
  state: 'the precision read, 1 of 6 and then 3 of 8 true (one of them pattern 20): a crisis word on the page is mostly '
    + 'the past ("The uprising was funded …", "The pestilence lingered …"), a heading or a purpose; no word family reads '
    + 'its tense surely',
  house: 'the precision read, 0 of 6 true: a house word on the page is mostly a person\'s title where the trade stands '
    + '("the master fishmonger" beside a fish market), a requirement list, or a standing house\'s catalogue description '
    + 'naming its neighbours ("between mine and smithy"); no word or leaf narrows it surely',
  resource: 'the precision read, 0 of 6 true: a resource label on the page is a chain\'s input or import, or a depleted '
    + 'resource the line itself marks "(depleted)"; the leaf (the town\'s own country) is not what those lines claim',
});

/**
 * THE THINGS (the presumed-things walker's sixteen, moved verbatim). `words`: the words that name it (a
 * building's own walls are not the perimeter, ruling 3; a moneylender is a person, not a house). `atoms`:
 * the vocabulary atoms whose declaration answers for it (a line declaring any of them, on either side,
 * declares the thing). `absent(facts, names)`: true when the record lacks it — the vocabulary's own readers
 * where an atom exists; the live roster's names (`liveInstitutionNames`) where the vocabulary has no atom yet.
 * @type {Readonly<Record<string, RegisteredWord>>}
 */
export const THINGS = Object.freeze({
  walls: {
    words: /\b(?:town|city) walls\b|\bthe walls\b|\bwalls and gates\b|\bramparts?\b|\bbattlements\b/i,
    atoms: ['walls', 'palisade'],
    absent: (f) => !f.defence.walls && !f.defence.palisade,
  },
  garrison: {
    words: /\bgarrison(?:s|ed)?\b|\bbarracks\b/i,
    atoms: ['garrison'], sufficient: ['commander'],
    absent: (f) => !f.defence.garrison,
  },
  militia: { words: /\bmilitias?\b/i, atoms: ['militia'], absent: (f) => !f.defence.militia },
  watch: {
    words: /\b(?:town|city|night|village) watch\b|\bwatchm[ae]n\b|\bthe watch\b|\bwatch captain\b|\bwatch rota\b/i,
    atoms: ['watch'],
    absent: (f) => !f.defence.watch,
  },
  mercenary: {
    words: /\bmercenar(?:y|ies)\b|\bsellswords?\b|\bfree compan(?:y|ies)\b/i,
    atoms: ['mercenary'],
    absent: (f) => !f.defence.mercenary,
  },
  docks: {
    words: /\bdocks?\b|\bharbou?rs?\b|\bquays?\b|\bwharf\b|\bwharves\b|\bdockside\b|\bdockworkers?\b|\bdockhands?\b/i,
    atoms: ['navigable', 'docks', 'institution: docks'], sufficient: ['coast', 'river', 'port', 'route: port', 'route: river'],
    absent: (f) => !f.water.navigable && !f.hasInstitution('docks'),
    presentForDenial: (f) => f.hasInstitution('docks'),
  },
  granary: { words: /\bgranar(?:y|ies)\b/i, atoms: ['institution: granary'], absent: (f) => !f.hasInstitution('granary') },
  mill: { words: /\bmill(?:s|er|ers)?\b/i, atoms: ['institution: mill'], absent: (f) => !f.hasInstitution('mill') },
  market: {
    words: /(?<!\bblack |\bwhisper )\bmarket(?:place|s| square| day| days| cross)?\b/i,
    atoms: ['market'],
    absent: (f) => !f.market,
  },
  // F4 (the third seat; REVIEW-W2B: "two homes answer 'is there a church'"): ONE home, the faith reading
  // (`faithReading.js :: faithReadingOf`, `hasChurch`: a temple, chapel, parish church, cathedral or monastery stands
  // here; a wayside shrine is NOT a church). "Access to (the) parish church" names a church ELSEWHERE (the roster's
  // access row; the faith reading's `accessOnly`): excluded by its words; a line declaring `church access` is answered.
  temple: {
    // F8 of the second read: "the church's name" (an invitation to name it) puts no church in the town
    words: /\btemples?\b|(?<!\baccess to (?:the |a )?(?:parish |nearby |neighbouring )?)\bchurch(?:es)?\b(?!['’]s name\b)|\bchapels?\b|\bcathedrals?\b|\babbey\b/i,
    atoms: ['church'], sufficient: ['church access', 'institution: monastery'],
    leaf: 'faithReading.js :: faithReadingOf (hasChurch: a wayside shrine is not a church)',
    absent: (f) => f?.faith?.hasChurch !== true,
  },
  // F4: a shrine's words read the sacred house (`factsOf.js :: sacredHouse`: any temple or monastery of the roster, a
  // wayside shrine among them), as `temple` read them all before the split
  shrine: {
    words: /\bshrines?\b/i,
    atoms: ['sacredHouse'], sufficient: ['temple', 'institution: temple', 'institution: monastery', 'church'],
    leaf: 'factsOf.js :: sacredHouse',
    absent: (f) => !f.sacredHouse,
  },
  prison: {
    words: /\bprisons?\b|\bgaols?\b|\bjails?\b/i,
    atoms: ['prison'],
    leaf: 'institutions.js :: liveInstitutionNames, by name; defence.js answers its atom: one home owed (W2-A-LEAVES)',
    absent: (_f, names) => !names.some((n) => /prison|gaol|jail|stocks/i.test(n)),
  },
  court: {
    words: /\bcourthouses?\b|\bcourts? of law\b|\blaw ?courts?\b/i,
    atoms: ['court'],
    leaf: 'institutions.js :: liveInstitutionNames and COURT_HOUSES; defence.js answers its atom: one home owed (W2-A-LEAVES)',
    absent: (_f, names) => !names.some((n) => /court/i.test(n) || COURT_HOUSES.has(n.toLowerCase())),
  },
  bank: {
    words: /\bbankers?\b|\bbanking\b|\bmoney.?changers?\b|\bcounting.?houses?\b/i,
    atoms: ['institution: bank'],
    absent: (f) => !f.hasInstitution('bank'),
  },
  guildhall: { words: /\bguild ?halls?\b/i, atoms: ['guild'], absent: (f) => !f.guild },
  war: {
    words: /\bthe war\b|\bwartime\b|\bat war\b|\bthe armies\b/i,
    atoms: ['war: front', 'war: aggressor', 'war: at war'], kinds: ['wartime', 'under_siege', 'occupied'],
    absent: (f) => f.warState === 'peace' && !f.crisis?.has?.('wartime') && !f.crisis?.has?.('under_siege') && !f.crisis?.has?.('occupied'),
  },
  // THE LAW (the chair's ruling A of 2026-11-11, "denials"): read on the DENIAL side only
  // (`denialOnly`), because every town has some law and naming it presumes nothing; denying it
  // ("No law, bring coin", "There is no official recourse here") presumes there is none. The town
  // has law where a peace-keeping house stands (the vocabulary's watch or garrison) or a house
  // that judges (a court, a council, a hall, a headman, a magistrate). "No law permits" is the
  // law of anywhere, not of this town.
  law: {
    words: /\bofficial recourse\b|\blaw\b(?! permits| enforcement)/i,
    atoms: ['watch', 'garrison'],
    absent: (f, names) => !f.defence.watch && !f.defence.garrison
      && !names.some((n) => /court|council|\bhall\b|headman|magistrat|reeve|justiciar|sheriff/i.test(n)),
    denialOnly: true,
  },
  // F6 (the third seat; REVIEW-W2B: "a headman is not law enforcement"): LAW ENFORCEMENT is a peace-keeping force alone
  // (the vocabulary's watch or garrison), split from the law, which a house that judges also keeps; denial side only
  lawEnforcement: {
    words: /\blaw enforcement\b/i,
    atoms: ['watch', 'garrison'],
    leaf: 'defence.js :: defenceOf (watch, garrison)',
    absent: (f) => !f.defence.watch && !f.defence.garrison,
    denialOnly: true,
  },
});

export const THING_IDS = Object.freeze(Object.keys(THINGS));
for (const w of Object.values(THINGS)) w.pageWithdrawn = PAGE_WITHDRAWN.thing;

/** @param {WordFacts} f @param {string} kind @returns {boolean} is this crisis kind in force (`factsOf(record).crisis`) */
const inForce = (f, kind) => f?.crisis?.has?.(kind) === true;

/** The number words a count reads (F13, the third seat: to twelve, "a dozen" and digits). @type {Readonly<Record<string, number>>} */
const NUMBER_WORDS = Object.freeze({
  both: 2, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, 'a dozen': 12,
});
/** The count words as a pattern group's body (a digit run of one or two figures counts too). */
const COUNT = 'two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|a dozen|\\d{1,2}';
/** @param {string} word @returns {number | null} */
const countOf = (word) => (/^\d+$/.test(word) ? Number(word) : NUMBER_WORDS[word.toLowerCase().replace(/\s+/g, ' ')] ?? null);

/**
 * The number a count word states in a sentence, or null.
 * @param {RegExp} words @param {string | undefined} sentence @returns {number | null}
 */
function statedCount(words, sentence) {
  const m = new RegExp(words.source, 'i').exec(String(sentence ?? ''));
  if (!m) return null;
  const word = m.slice(1).find((g) => typeof g === 'string' && g) || '';
  return countOf(word);
}

/** @param {WordRecord | null | undefined} record @returns {number} the powers the record holds (`powerStructure.factions`) */
const powerCount = (record) => (Array.isArray(record?.powerStructure?.factions) ? record.powerStructure.factions.length : 0);

/** The houses a count of houses reads, each by the thing whose words name it. */
const COUNTED_HOUSES = /** @type {Readonly<Record<string, string>>} */ (Object.freeze({
  temples: 'temple', churches: 'temple', chapels: 'temple', shrines: 'shrine', mills: 'mill', markets: 'market', granaries: 'granary', guildhalls: 'guildhall',
  guilds: 'guilds',
}));
/** F13: guilds are a counted noun, read off the roster's guild rows (a guild hall's words name a building, not a guild). */
const GUILD_ROW = /\bguilds?\b/i;
/**
 * F6 (the third seat; REVIEW-W2B: "read a range row's own count") and F9 of the second read ("a range row counts at its
 * minimum, so a number inside the range is called false"): a roster row holds AT MOST its range's maximum — "Parish
 * churches (2-5)" five, "Craft guilds (5-15)" fifteen; an open range ("50-100+", "5+") has no maximum; a row without a
 * range one. A count is false only above the sum of these.
 * @param {string} name @returns {number}
 */
const rowCount = (name) => {
  const m = /\((\d+)\s*(?:(?:-|–)\s*(\d+)\s*(\+)?|(\+))\s*\)/.exec(name);
  if (!m) return 1;
  return m[3] || m[4] ? Infinity : Number(m[2]);
};

/**
 * THE NEW WORDS: STATES, SIZES AND COUNTS (the chair's record 288, ruling 1, B (ii): "states, sizes and counts
 * become registered things beside the sixteen houses"). The same shape as THINGS; `kind` and `leaf` say what
 * each reads. The state words assert the crisis IS in force; the size words a place large enough to have
 * quarters; a count that the town holds at least that many.
 * @type {Readonly<Record<string, RegisteredWord>>}
 */
const NEW_WORDS_OPEN = /** @type {Record<string, RegisteredWord>} */ ({
  siege: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js :: crisisFactsOf (under_siege)',
    words: /\bunder siege\b|\bbesieged\b|\bsiege lines?\b|\bblockaded\b|\bthe siege\b|\bbesieg(?:ers|ing)\b/i,
    atoms: [], kinds: ['under_siege'],
    absent: (f) => !inForce(f, 'under_siege'),
  },
  famine: {
    kind: 'state', layer: 'P', leaf: 'famine.js :: famineOf · crisisKind.js (famine)',
    words: /\bfamine\b|\bthe hunger\b/i,
    atoms: ['famine'], kinds: ['famine'], bands: { food: ['famine'] },
    absent: (f) => !inForce(f, 'famine') && f?.famine?.famine !== true,
  },
  // F3 (the second seat): "starving" is its own word, read by its own atom (`famine.js :: famineOf`, starvingAllowed:
  // the food record's band is deficit or famine), so a declaration of it implies it
  starving: {
    kind: 'state', layer: 'P', leaf: 'famine.js :: famineOf (starvingAllowed) · crisisKind.js (famine)',
    words: /\bstarv(?:ing|ation)\b/i,
    atoms: ['starving'], kinds: ['famine'], bands: { food: ['famine', 'deficit'] },
    absent: (f) => !inForce(f, 'famine') && !(f?.famine?.known === true && f?.famine?.starvingAllowed === true),
  },
  plague: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js (plague_onset)',
    words: /\bplague\b|\bpestilence\b|\bepidemic\b/i,
    atoms: [], kinds: ['plague_onset'],
    absent: (f) => !inForce(f, 'plague_onset'),
  },
  occupation: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js (occupied) · rulerKind.js (occupier)',
    words: /\b(?:the|foreign|under) occupation\b|\boccupiers?\b|\boccupying (?:force|army|power|garrison)s?\b/i,
    atoms: ['ruler: occupier'], kinds: ['occupied'],
    absent: (f) => !inForce(f, 'occupied') && f?.rulerKind !== 'occupier',
  },
  revolt: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js (insurgency, slave_revolt)',
    words: /\binsurgen(?:cy|ts?)\b|\brebellion\b|\buprising\b|\bslave revolt\b/i,
    atoms: [], kinds: ['insurgency', 'slave_revolt'],
    absent: (f) => !inForce(f, 'insurgency') && !inForce(f, 'slave_revolt'),
  },
  refugees: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js (mass_migration) · migration.js :: migrationOf',
    words: /\brefugees?\b/i,
    atoms: ['migration: influx'], kinds: ['mass_migration'],
    absent: (f) => !inForce(f, 'mass_migration') && !(f?.migration?.active === true && f?.migration?.direction === 'influx'),
  },
  succession: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js (succession_void, politically_fractured)',
    words: /\bsuccession (?:crisis|struggle|void|dispute)\b|\bthe (?:empty|vacant) (?:seat|throne|chair)\b/i,
    atoms: [], kinds: ['succession_void', 'politically_fractured'],
    absent: (f) => !inForce(f, 'succession_void') && !inForce(f, 'politically_fractured'),
  },
  quarters: {
    kind: 'size', layer: 'P', leaf: 'populationBand.js :: populationBandOf',
    words: /\bdistricts?\b|\b(?:poor|poorer|poorest|rich|richer|wealthy|merchant|merchants'|craft|crafts|artisan|artisans'|foreign|old|new|temple|harbour|dock|river|eastern|western|northern|southern|outer|inner|lower|upper|noble|guild|market|slum|working)\s+quarters?\b|\burban\b|\bmetropolitan\b|\bneighbou?rhoods\b|\bslums?\b|\btenements?\b/i,
    atoms: [], bands: { population: ['middling', 'large'] },
    absent: (f) => f?.populationBand === 'small',
  },
  powersCount: {
    kind: 'count', layer: 'S', leaf: 'the record :: powerStructure.factions (a count dimension waits for factsOf)',
    words: new RegExp(`\\b(${COUNT})\\s+(?:rival\\s+|great\\s+|competing\\s+|ruling\\s+|leading\\s+|standing\\s+)?(?:powers|factions)\\b|\\b(both) (?:powers|factions)\\b`, 'i'),
    atoms: [],
    absent: (_f, _names, record, sentence) => { const n = statedCount(NEW_WORDS.powersCount.words, sentence); return n !== null && powerCount(record) < n; },
  },
  // F2 (the third seat; REVIEW-W2B: "pattern 16a uses the wrong leaf"): "The ruling three of {ruler}" heads the RULER'S
  // OWN FACES — the panel lists `dmPowerViewOf(...).rulingThree` under it — not the number of powers
  rulingFaces: {
    kind: 'count', layer: 'S', leaf: 'patronage.js :: dmPowerViewOf (rulingThree: the ruler\'s ranked faces)',
    words: new RegExp(`\\bthe ruling (${COUNT})\\b`, 'i'),
    atoms: [],
    absent: (_f, _names, record, sentence) => {
      const n = statedCount(NEW_WORDS.rulingFaces.words, sentence);
      return n !== null && (dmPowerViewOf(record)?.rulingThree.length ?? 0) < n;
    },
  },
  housesCount: {
    kind: 'count', layer: 'P', leaf: 'institutions.js :: liveInstitutionNames',
    words: new RegExp(`\\b(${COUNT})\\s+(?:\\w+\\s+)?(temples|churches|chapels|shrines|mills|markets|granaries|guildhalls|guilds)\\b`, 'i'),
    atoms: [],
    absent: (_f, names, _record, sentence) => {
      const m = new RegExp(NEW_WORDS.housesCount.words.source, 'i').exec(String(sentence ?? ''));
      if (!m) return false;
      const n = countOf(m[1]); const key = COUNTED_HOUSES[m[2].toLowerCase()];
      const re = key === 'guilds' ? GUILD_ROW : THINGS[key]?.words;
      if (n === null || !re) return false;
      return names.filter((name) => re.test(name)).reduce((sum, name) => sum + rowCount(name), 0) < n;
    },
  },
  // ── THE WORDS OF THE HAND CURES (W2-B-DECLARE item 4; record 288, ruling 2: "EVERY HAND CURE REGISTERS ITS
  // WORDS", with the leaf they must read), so the next line that uses them must declare. ──
  // F4: one home with `temple` — the faith reading; a wayside shrine is no religious house (pattern 8: DS-ECO-12's lines
  // in a shrine-only town)
  religiousHouses: {
    kind: 'thing', layer: 'P', leaf: 'faithReading.js :: faithReadingOf (hasChurch; pattern 8)',
    words: /\breligious houses?\b|\bhouses? of worship\b/i,
    atoms: ['church'], sufficient: ['institution: monastery'],
    absent: (f) => f?.faith?.hasChurch !== true,
  },
  practitioner: {
    kind: 'thing', layer: 'T', person: true, leaf: 'magicReliance.js :: magicPractitioners (NEW-2, 3; its atom waits for a factsOf reader)',
    words: /\bpractitioners?\b|\bpeople who work magic\b/i,
    atoms: [],
    absent: (_f, _names, record) => !!record && magicPractitioners(record).length === 0,
  },
  onlyJust: {
    kind: 'value', layer: 'S', leaf: 'foodBalance.js :: deriveFoodRecord (growsMoreThanEats; pattern 1a; its atom waits for a factsOf reader)',
    words: /\bfed, but only just\b/i,
    atoms: [],
    absent: (_f, _names, record) => record?.economicState?.foodSecurity?.foodRecord?.growsMoreThanEats === true,
  },
  smallMargin: {
    kind: 'value', layer: 'S', leaf: 'foodBalance.js :: deriveFoodRecord (normalImportPct; pattern 1b; its atom waits for a factsOf reader)',
    words: /\bwith a small margin\b/i,
    atoms: [],
    absent: (_f, _names, record) => Number(record?.economicState?.foodSecurity?.foodRecord?.normalImportPct) >= 25,
  },
  almostLevel: {
    kind: 'value', layer: 'S', leaf: 'the record :: powerStructure.factions[].power (pattern 4; the leader\'s lead is W2-A-LEAVES\'s leaf)',
    words: /\b(?:stand|stands|are) almost level\b/i,
    atoms: [],
    absent: (_f, _names, record) => {
      /** @type {ReadonlyArray<{ power?: unknown }>} */ const factions = Array.isArray(record?.powerStructure?.factions) ? record.powerStructure.factions : [];
      const p = factions.map((x) => Number(x?.power)).filter(Number.isFinite).sort((a, b) => b - a);
      return p.length >= 3 && p[0] - p[2] > 10;
    },
  },
});
export const NEW_WORDS = NEW_WORDS_OPEN;
// the crisis states (not the words of normal times, which read a crisis's absence: `notKinds`) leave the page list
for (const w of Object.values(NEW_WORDS_OPEN)) if (w.kind === 'state') w.pageWithdrawn = PAGE_WITHDRAWN.state;

// ── THE GENERATED VOCABULARY (W2-B-DECLARE second seat, F1: "the vocabulary is generated, not listed") ─────────

/** A roster row that names a house ELSEWHERE, or the dwellings: it does not put the house in the town. */
const NOT_HERE = /^access to\b|\bexternal\b|^dwellings\b|^housing\b/i;

/** The powers' names (`powerStructure.factions[].faction`). @param {WordRecord | null | undefined} record @returns {string[]} */
const powerNames = (record) => (Array.isArray(record?.powerStructure?.factions) ? record.powerStructure.factions : [])
  .map((/** @type {{ faction?: unknown, name?: unknown }} */ x) => String(x?.faction ?? x?.name ?? '')).filter(Boolean);

/** The live roster has a row whose name matches. @param {string[]} names @param {RegExp} re */
const rosterHas = (names, re) => names.some((n) => !NOT_HERE.test(n) && re.test(n));

/** A catalogue name's QUALIFIERS: they size or place a house, they do not name it. */
const QUALIFIER = new Set(('multiple major minor small large massive great grand local free daily weekly annual periodic resident '
  + 'traveling travelling village town city official established commercial part-time public international advanced '
  + 'professional specialized high magic the and of or if only').split(' '));
/** A catalogue name's CONTAINERS: the building or body that holds the house the word before it names. */
const CONTAINER = new Set(('shop shops quarter quarters district districts hall halls house houses works yard post office network '
  + 'system systems complex camp collective community lodge exchange circle tower college company facilities facility ring '
  + 'center centre operation operations chapter infrastructure source sources ground grounds land').split(' '));
/** Single words that are no house of their own, and the shelf's general nouns. */
const NOT_A_HOUSE = new Set(('dwellings housing households water farming farmland subsistence grazing burial cemetery graveyard '
  + 'consensus elder elders head-of-household governance government administration council assembly oligarchy appointee '
  + 'governor seat embassy roster informal criminal underground noble royal democratic planar dream golem undead luxury goods '
  + 'listening human front fortune charlatan supply delving black whisper red light bazaar contract trade custom message '
  + 'dragon dream stable salt fence fair mint printing').split(' '));
/** The heads the hand-written words and the role families own (a market, the walls, the watch, a priest, a smith …): one home each. */
const HAND_WRITTEN_HEAD = /^(?:watch|walls?|gates?|palisade|earthworks?|monaster(?:y|ies)|friar(?:y|ies)|court|market|mill|temple|church|granar(?:y|ies)|bank|prison|garrison|militia|docks?|port|harbou?r|priests?|(?:black)?smiths?|healers?|hospitals?|masons?)$/;

/** A phrase's family pattern: its words, the last one with its plural (`tanner` → tanners). @param {string[]} words */
const phrasePattern = (words) => {
  const esc = (/** @type {string} */ w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const last = words[words.length - 1].replace(/'s$|s'$|'$/, '').replace(/ies$/, 'y').replace(/(?<!s)s$/, '');
  const body = [...words.slice(0, -1).map((w) => esc(w).replace(/'s$|s'$/, "(?:'s|s'|s)?")), esc(last).replace(/y$/, '(?:y|ies)')].join('\\s+');
  return { key: [...words.slice(0, -1), last].join(' '), re: new RegExp(`\\b${body}(?:s|es|'s|s')?\\b`, 'i') };
};


/**
 * THE HOUSES, generated from the institution catalogue (`data/institutionalCatalog.js :: institutionalCatalog`, every
 * tier and shelf): each house's HEAD PHRASE is a family — its name less its qualifiers and its container, at most its
 * last two words (`Alchemist shop`, `Alchemist quarter` → `alchemist`; `Mages' guild` → `mages' guild`; `Pack animal
 * trader` → `animal trader`). A phrase a hand-written word already registers (a market, a temple, the watch …) is that
 * word's, one home each. The ONE leaf: the live roster names a house of the family here (`institutions.js ::
 * liveInstitutionNames`; an access row or an external house is not here). The atom (`house: <phrase>`) waits for its
 * `factsOf` getter.
 * @type {Record<string, RegisteredWord>}
 */
const HOUSE_FAMILIES = (() => {
  /** @type {Set<string>} */ const names = new Set();
  for (const tier of Object.values(institutionalCatalog)) for (const shelf of Object.values(tier || {})) for (const n of Object.keys(shelf || {})) names.add(n);
  const registered = [...Object.values(THINGS), ...Object.values(NEW_WORDS)].map((w) => w.words);
  /** @type {Map<string, RegExp>} */ const families = new Map();
  for (const name of names) {
    if (NOT_HERE.test(name)) continue;
    let words = name.toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[/&,]/g, ' ').split(/\s+/).filter(Boolean).filter((w) => !QUALIFIER.has(w));
    while (words.length > 1 && CONTAINER.has(words[words.length - 1]) && !/'s$|s'$/.test(words[words.length - 2])) words = words.slice(0, -1);
    words = words.slice(-2);
    if (!words.length || words.every((w) => NOT_A_HOUSE.has(w.replace(/'s$|s'$|s$/, '')) || NOT_A_HOUSE.has(w))) continue;
    if (words.length === 1 && (NOT_A_HOUSE.has(words[0]) || CONTAINER.has(words[0]) || words[0].length < 4)) continue;
    if (words.some((w) => HAND_WRITTEN_HEAD.test(w))) continue;
    const { key, re } = phrasePattern(words);
    if (registered.some((r) => r.test(words.join(' ')))) continue;
    if (!families.has(key)) families.set(key, re);
  }
  /** @type {Record<string, RegisteredWord>} */ const out = {};
  for (const [key, re] of families) {
    // the leaf reads the house's STEM, so a brewer is answered by a brewery and a smith by a blacksmith, and a power of
    // that name counts as the house (a Thieves' Guild on the powers' roster)
    const stem = new RegExp(key.split(' ').map((w) => w.replace(/'s$|s'$/, '').replace(/(?:ery|ers|er|ry|y)$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\S*\\s+'), 'i');
    out[`house: ${key}`] = {
      kind: 'thing', layer: 'P', leaf: `institutions.js :: liveInstitutionNames, or a power of the name (a house named ${key}); its atom \`house: ${key}\` waits for a factsOf getter`,
      words: re, atoms: [], absent: (_f, rosterNames, record) => !rosterHas(rosterNames, stem) && !powerNames(record).some((n) => stem.test(n)),
      pageWithdrawn: PAGE_WITHDRAWN.house,
    };
  }
  return out;
})();

/**
 * THE RESOURCES, generated from the resource catalogue (`data/resourceData.js :: RESOURCE_DATA`): each resource's label
 * is a family (`Iron Deposits` → "iron deposits", "iron ore deposits"). The ONE leaf: the town's own country holds it —
 * named in the record's `config.nearbyResources` and not in `config.nearbyResourcesDepleted`. Its atom waits.
 * @type {Record<string, RegisteredWord>}
 */
const RESOURCE_FAMILIES = Object.fromEntries(Object.entries(RESOURCE_DATA).map(([key, r]) => {
  const label = String(/** @type {{ label?: unknown }} */ (r)?.label || key.replace(/_/g, ' ')).toLowerCase();
  const words = label.split(' ').map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const deposits = words.length === 2 && words[1] === 'deposits' ? `|\\b${words[0]} ore deposits\\b` : '';
  const re = new RegExp(`\\b${words.join('\\s+')}\\b${deposits}`, 'i');
  /** @type {RegisteredWord} */ const w = {
    kind: 'thing', layer: 'P', leaf: `the record :: config.nearbyResources (${key}), less config.nearbyResourcesDepleted; its atom waits`,
    words: re, atoms: [], pageWithdrawn: PAGE_WITHDRAWN.resource,
    absent: (_f, _n, record) => {
      const cfg = /** @type {{ config?: { nearbyResources?: unknown, nearbyResourcesDepleted?: unknown } } | null | undefined} */ (record)?.config;
      const near = Array.isArray(cfg?.nearbyResources) ? cfg.nearbyResources : [];
      const gone = Array.isArray(cfg?.nearbyResourcesDepleted) ? cfg.nearbyResourcesDepleted : [];
      return !!record && (!near.includes(key) || gone.includes(key));
    },
  };
  return [`resource: ${key}`, w];
}));

/**
 * THE ROLES, THE STAFF AND THE FORCES (the brief's own list: a priest, a guard captain, a notary, alchemists, a military
 * command): a person or a body who stands only where a house or a force does, each with the leaf of that house or force.
 * @type {Record<string, RegisteredWord>}
 */
const ROLE_FAMILIES = /** @type {Record<string, RegisteredWord>} */ ({
  clergy: {
    kind: 'thing', layer: 'P', leaf: 'faithReading.js :: faithReadingOf (hasChurch; seniorCleric)',
    words: /\bpriests?\b|\bclergy\b|\bclerics?\b|\bvicars?\b|\bchaplains?\b/i,
    atoms: ['church', 'priest'],
    absent: (f) => !(f?.faith?.hasChurch === true || (f?.faith && f.faith.seniorCleric != null)),
  },
  armedForce: {
    kind: 'thing', layer: 'P', leaf: 'factsOf.js :: guardPresence (watch ∨ garrison ∨ militia ∨ hired company)',
    words: /\bthe military\b|\bmilitary command\b|\bsoldiers\b|\btroops\b|\bdefenders\b|\bguardsmen\b|\bthe guards?\b/i,
    atoms: ['guardPresence'], sufficient: ['watch', 'garrison', 'militia', 'mercenary', 'soldiers', 'commander'],
    absent: (f) => !f?.guardPresence,
  },
  guardCaptain: {
    kind: 'thing', layer: 'P', leaf: 'defence.js :: defenceOf (watch, garrison)',
    words: /\bguard captains?\b|\bcaptain of the (?:guard|watch)\b|\bwatch captains?\b/i,
    atoms: ['watch', 'garrison'],
    absent: (f) => !f?.defence?.watch && !f?.defence?.garrison,
  },
  notary: {
    kind: 'thing', layer: 'P', leaf: 'institutions.js :: liveInstitutionNames (a house that writes or tries the law: a scribe, a court, a hall)',
    words: /\bnotar(?:y|ies|y's)\b|\blawyers?\b|\badvocates?\b/i,
    atoms: [],
    absent: (_f, names) => !rosterHas(names, /scribe|notary|court|town hall|city hall|chancery|administration|government|guild/i),
  },
  smith: {
    kind: 'thing', layer: 'P', leaf: 'institutions.js :: liveInstitutionNames (a smith or metalworker); its atom `institution: smith` reads the kind',
    words: /\bsmith(?:s|y|ies)?\b|\bforges?\b/i,
    atoms: ['institution: smith'],
    absent: (f) => !(typeof f?.hasInstitution === 'function' && f.hasInstitution('smith')),
  },
  mason: {
    kind: 'thing', layer: 'P', leaf: 'institutions.js :: liveInstitutionNames (a quarry or a mason); its atom `institution: quarry` reads the kind',
    words: /\b(?:stone)?masons?\b/i,
    atoms: ['institution: quarry'],
    absent: (f, names) => !(typeof f?.hasInstitution === 'function' && f.hasInstitution('quarry')) && !rosterHas(names, /mason|brick/i),
  },
  physician: {
    kind: 'thing', layer: 'P', leaf: 'defence.js :: defenceOf (hospital, healer)',
    words: /\bphysicians?\b|\bdoctors?\b/i,
    atoms: ['hospital', 'healer'],
    absent: (f) => !f?.defence?.hospital && !f?.defence?.healer,
  },
  armoury: {
    kind: 'thing', layer: 'P', leaf: 'defence.js :: defenceOf (garrison, militia: a force keeps the arms)',
    words: /\barmou?r(?:y|ies)\b/i,
    atoms: ['garrison', 'militia'],
    absent: (f) => !f?.defence?.garrison && !f?.defence?.militia,
  },
  prisoner: {
    kind: 'thing', layer: 'P', leaf: 'defence.js :: defenceOf (prison)',
    words: /\bprisoners?\b|\bin (?:their|its|his|her) custody\b/i,
    atoms: ['prison'],
    absent: (f) => !f?.defence?.prison,
  },
});
/**
 * A person among the town's people holds the role: some card's `role` or `title` uses the role's words ("the elder
 * priest"). @param {WordRecord | null | undefined} record @param {RegExp} words
 */
const peopleHold = (record, words) => (Array.isArray(/** @type {{ npcs?: unknown }} */ (record)?.npcs) ? /** @type {unknown[]} */ (/** @type {{ npcs: unknown[] }} */ (record).npcs) : [])
  .some((c) => { const card = /** @type {{ role?: unknown, title?: unknown }} */ (c); return words.test(String(card?.role ?? '')) || words.test(String(card?.title ?? '')); });
// THE LEAF OF A ROLE (the third seat, item 1: the precision read): the role is false only where its house or force is
// absent AND no one among the town's people holds it — "the elder priest" on the relationships page is a person who stands
for (const w of Object.values(ROLE_FAMILIES)) {
  const houseAbsent = w.absent;
  w.person = true;
  w.absent = (f, names, record, sentence) => houseAbsent(f, names, record, sentence) && !peopleHold(record, w.words);
  w.leaf = `${w.leaf}; or a person among the town's people who holds the role (npcs[].role, npcs[].title)`;
}

/**
 * THE WORDS OF NORMAL TIMES AND OF SIZE (the review's named families): open trade, which a siege in force makes false;
 * a famine written as a risk to come, which a famine in force makes false; the size nouns of a large place.
 * @type {Record<string, RegisteredWord>}
 */
const STATE_FAMILIES = {
  openTrade: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js :: crisisFactsOf (no under_siege in force)',
    words: /\b(?:carts?|wagons?|caravans?|coaches|barges|boats|importers?)\s+(?:bring|brings|come|comes|arrive|arrives|carry|carries|feed|feeds|go out|leave|leaves)\b|\bthrough-traffic\b|\btraffic\b|\b(?:what|everything|goods|trade|caravans?|plenty|more|much|little|travell?ers?|traders?|merchants?)\s+(?:that\s+)?passes through\b|\bpasses through (?:it|here|\{settlement\}|the (?:town|village|hamlet|city|settlement|gates?|square))\b|\bbrought in by (?:cart|road|boat|barge)\b/i,
    atoms: [], notKinds: ['under_siege'],
    absent: (f) => inForce(f, 'under_siege'),
  },
  famineToCome: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js :: crisisFactsOf (no famine in force)',
    words: /\b(?:a|one|any) (?:bad|poor|hard|lean|failed) (?:year|season|harvest)s?\b[^.;]{0,48}\b(?:would|could|will)\b|\bwould (?:bring|mean) (?:real )?hunger\b|\bif the harvests? (?:fail|fails|failed)\b/i,
    // the precision read: "a bad year in any one of them would hurt" is a trade's year, not a harvest's
    context: /\b(?:harvests?|herds?|flocks?|crops?|grain|hunger|hungry|food|fields?|stores|famine)\b/i,
    atoms: [], notKinds: ['famine'],
    absent: (f) => inForce(f, 'famine'),
  },
  streets: {
    // F2 of REVIEW-W2B's second read: a village (to ~350 people, the `small` band) has streets; a thorp or a hamlet has
    // none to speak of. False only there, by the tier.
    kind: 'size', layer: 'P', leaf: 'the record :: tier (factsOf(record).tier)',
    words: /\bstreets\b|\bthe agora\b|\b(?:a|the) (?:civic|town|market) square\b|\bin masonry\b|\bin quarters\b|\bneighbou?rhoods?\b|\bsuburbs\b/i,
    atoms: [], bands: { tier: ['village', 'town', 'city', 'metropolis'] },
    absent: (f) => f?.tier === 'thorp' || f?.tier === 'hamlet',
  },
};

/** The generated families, joined to the new words (the walker's source arm and the page check read them all). */
Object.assign(NEW_WORDS_OPEN, HOUSE_FAMILIES, RESOURCE_FAMILIES, ROLE_FAMILIES, STATE_FAMILIES);

/**
 * THE NARROW FAMILIES KEPT ON THE PAGE LIST (F7 of REVIEW-W2B's second read: "the withdrawal took four HIGH cold lines
 * that narrower families keep at ten in ten"). Each is a phrase of a withdrawn word, read with that word's own leaf (one
 * home): the market phrase by `market` (factsOf(record).market), the alchemist phrase by `house: alchemist` (the live
 * roster). The reviewer read each ten in ten on the census's 720; this lane's fourth seat read ten more of each on its own
 * draw (the hand-back, part four). The bare words stay withdrawn: of ten bare alchemist hits about five are true.
 */
const PAGE_KEPT = Object.freeze({
  market: /\bmarket (?:levies|dues|day|wardens|tolls)\b|\bcome to market\b|\bthe market (?:still )?opens\b|\bat (?:the|its) market\b/i,
  'house: alchemist': /\b(?:the local|its|from its|comes from its|the town's) alchemists?\b/i,
});
/** @type {RegisteredWord} */ (THINGS.market).pageKept = PAGE_KEPT.market;
NEW_WORDS_OPEN['house: alchemist'].pageKept = PAGE_KEPT['house: alchemist'];

/**
 * Is a NAMING sentence of the word on the page list: the word is not withdrawn, or the sentence is one of its kept narrow
 * families? @param {RegisteredWord} w @param {string} sentence
 */
export const onPageList = (w, sentence) => !w.pageWithdrawn || (!!w.pageKept && w.pageKept.test(sentence));
Object.freeze(NEW_WORDS_OPEN);

export const NEW_WORD_IDS = Object.freeze(Object.keys(NEW_WORDS));

/** The size of the vocabulary and where each part is generated from (the hand-back reads it). */
export const VOCABULARY_SIZE = Object.freeze({
  written: Object.keys(THINGS).length + Object.keys(NEW_WORDS).length - Object.keys(HOUSE_FAMILIES).length - Object.keys(RESOURCE_FAMILIES).length - Object.keys(ROLE_FAMILIES).length - Object.keys(STATE_FAMILIES).length,
  houses: Object.keys(HOUSE_FAMILIES).length, resources: Object.keys(RESOURCE_FAMILIES).length,
  roles: Object.keys(ROLE_FAMILIES).length, states: Object.keys(STATE_FAMILIES).length,
});

/** Every registered word: the things and the new words. @type {Readonly<Record<string, RegisteredWord>>} */
export const REGISTERED_WORDS = Object.freeze({ ...THINGS, ...NEW_WORDS });

// ── A DECLARATION THAT IMPLIES THE WORD (W2-B-DECLARE second seat, F3) ─────────────────────────────────────────

/**
 * A declaration as the walker reads it around a line: the generator door's own shape (`factVocabulary.js ::
 * Declaration`) — `needs` (presence and band atoms, and crisis atoms written `crisis: …`), `excludes`, `crisis`
 * (the crisis dimension's values, a disjunction).
 * @typedef {{ needs: ReadonlyArray<string>, excludes: ReadonlyArray<string>, crisis: ReadonlyArray<string> }} WordDeclaration
 */

/** Two atoms name the same fact (`temple` and `institution: temple` stay two spellings). @param {string} a @param {string} b */
const sameAtom = (a, b) => {
  const x = parseAtom(a); const y = parseAtom(b);
  return !!x && !!y && x.dimension === y.dimension && x.key === y.key && x.op === null && y.op === null;
};

/**
 * The crisis kinds a crisis value can mean, or null when it can mean more than the kinds (`any`; `hunger`, which is
 * also on under any crisis while the food record reads a deficit). `calm` means none.
 * @param {string} v @returns {ReadonlyArray<string> | null}
 */
function kindsOfValue(v) {
  const k = CRISIS_KIND_ALIASES[v] || v;
  if (k === 'calm') return [];
  if (k === 'any' || k === 'hunger') return null;
  /** @type {Readonly<Record<string, ReadonlyArray<string>>>} */ const families = CRISIS_FAMILY_KINDS;
  if (Object.hasOwn(families, k)) return families[k];
  return CRISIS_KIND_WORDS.includes(k) ? [k] : null;
}

/** The crisis disjunction a declaration REQUIRES (its `crisis` values and any `crisis: …` atom on its needs). @param {WordDeclaration} d */
function requiredCrisis(d) {
  /** @type {string[]} */ const out = [...d.crisis];
  for (const a of d.needs) { const atom = parseAtom(a); if (atom?.dimension === 'crisis') out.push(...(atom.values || ['any'])); }
  return out;
}

/** The crisis kinds a declaration's `excludes` forbids (`crisis` bare: every kind). @param {WordDeclaration} d */
function forbiddenKinds(d) {
  const out = new Set();
  for (const a of d.excludes) {
    const atom = parseAtom(a);
    if (atom?.dimension !== 'crisis') continue;
    for (const v of atom.values || CRISIS_KIND_WORDS) for (const k of kindsOfValue(v) || []) out.add(k);
  }
  return out;
}

/** The bands a band atom admits on its dimension's ladder. @param {string} a @returns {{ dimension: string, admitted: string[] } | null} */
function bandsAdmitted(a) {
  const atom = parseAtom(a);
  const order = atom && FACT_DIMENSIONS[atom.dimension]?.order;
  if (!atom || !order || atom.op === null) return null;
  const at = order.indexOf(String(atom.value));
  const keep = (/** @type {number} */ i) => ({ '≥': i >= at, '>': i > at, '≤': i <= at, '<': i < at }[/** @type {string} */ (atom.op)] ?? i === at);
  return { dimension: atom.dimension, admitted: order.filter((_, i) => keep(i)) };
}

/**
 * THE RULE THE WALKER ASKS (the chair's brief to the second seat, F3: "require the declaration to IMPLY the word: the
 * positive condition, or its negation where the line denies; for a banded value, only the bands in which the word is
 * true"). The word's truth is the disjunction of its `atoms`, its `kinds` in force and its `bands`, or — for a word of
 * normal times — that none of its `notKinds` is in force.
 *   naming   the declaration admits the line only where the word is TRUE: it needs one of the word's atoms (or a
 *            sufficient one, by its .sufficient field), or a band of a dimension whose every admitted band is a true band, or a crisis whose
 *            every value means only the word's kinds; a word of normal times is answered by an exclusion of its kinds
 *            or by `calm`.
 *   denies   the declaration admits the line only where the word is FALSE: every atom excluded, every kind excluded,
 *            each band dimension held to bands where it is false; a word of normal times by a crisis that means only
 *            its kinds.
 * A word with no truth written (a count, whose atom waits) is implied by nothing. Never `crisis: threat` for a siege,
 * never a small population for quarters, never a thing's own negation for the thing.
 * @param {string} id a registered word's id
 * @param {WordDeclaration} decl
 * @param {'names'|'denies'} side
 * @returns {boolean}
 */
export function declarationImplies(id, decl, side) {
  const w = REGISTERED_WORDS[id];
  if (!w) return false;
  const atoms = w.atoms || []; const kinds = w.kinds || []; const bands = Object.entries(w.bands || {}); const notKinds = w.notKinds || [];
  const req = requiredCrisis(decl); const forbidden = forbiddenKinds(decl);
  const reqKinds = req.length ? req.map(kindsOfValue) : null;
  const reqWithin = (/** @type {ReadonlyArray<string>} */ set) => !!reqKinds && reqKinds.every((ks) => ks !== null && ks.length > 0 && ks.every((k) => set.includes(k)));
  const reqCalm = !!reqKinds && reqKinds.every((ks) => ks !== null && ks.length === 0);
  const bandHeld = (/** @type {(admitted: string[], trueBands: ReadonlyArray<string>) => boolean} */ ok) => bands.some(([dim, trueBands]) =>
    decl.needs.some((a) => { const b = bandsAdmitted(a); return !!b && b.dimension === dim && ok(b.admitted, trueBands); }));
  if (side === 'names') {
    if (decl.needs.some((a) => [...atoms, ...(w.sufficient || [])].some((x) => sameAtom(a, x)))) return true;
    if (bandHeld((admitted, t) => admitted.length > 0 && admitted.every((b) => t.includes(b)))) return true;
    if (kinds.length && reqWithin(kinds)) return true;
    if (notKinds.length && (notKinds.every((k) => forbidden.has(k)) || reqCalm)) return true;
    return false;
  }
  if (notKinds.length) return reqWithin(notKinds);
  if (!atoms.length && !kinds.length && !bands.length) return false;
  const atomsOff = atoms.every((x) => decl.excludes.some((a) => sameAtom(a, x)));
  const kindsOff = kinds.every((k) => forbidden.has(k)) || (kinds.length > 0 && reqCalm);
  const bandsOff = bands.every(([dim, t]) => decl.needs.some((a) => { const b = bandsAdmitted(a); return !!b && b.dimension === dim && b.admitted.every((x) => !t.includes(x)); }));
  return atomsOff && kindsOff && bandsOff;
}

/**
 * A NEGATION the sentence itself states ("no militia could handle", "without courts or prison"):
 * the line names the thing to say it is not there. Read the same way by both arms.
 * @param {string} sentence @param {RegExp} words
 */
export function negates(sentence, words) {
  const m = new RegExp(words.source, 'ig');
  for (const hit of sentence.matchAll(m)) {
    const at = hit.index ?? 0;
    const before = sentence.slice(Math.max(0, at - 48), at);
    const after = sentence.slice(at + hit[0].length, at + hit[0].length + 24);
    const denied = /\b(?:no|not|without|nor|lacks?|lacking|beyond any|than any)\s+(?:[\w'-]+,?\s+(?:or\s+|and\s+)?){0,3}$/i.test(before)
      || /^\s+(?:cannot|could not|can't|couldn't)\b/i.test(after);
    if (!denied) return false;
  }
  return true;
}

// ── THE SENSES THAT NAME NOTHING HERE (W2-B-DECLARE third seat, item 1: the precision read) ──────────────────────
// Each is a WORD FAMILY around a hit, never a quoted line; a hit in one of these senses names nothing in this town.
/** ELSEWHERE: a thing reached outside the town ("access to external mill", "walk to the next village's parish church"). */
const ELSEWHERE_BEFORE = /\b(?:access to|external|travel(?:s|led)? to|walk(?:s|ed)? to|miles to|nearest|neighbouring|next (?:village|town|parish)['’]?s?)\s+(?:[\w'’/-]+\s+){0,4}$/i;
const ELSEWHERE_AFTER = /^\s+(?:outside|elsewhere|over the hill)\b/i;
/** NOT A CLAIM: a requirement or input list ("Needs: …", "Requires …", "Draws on: …"), a suggestion to add, an
 *  instruction to raise; and a PERSON (a role, a practitioner: `person`) who VISITS ("a priest comes through"). */
const NOT_A_CLAIM_BEFORE = /(?:^|[.:;→]\s*)(?:needs|requires|draws on)\b:?\s*(?:[\w'’,/-]+\s+){0,6}$|\b(?:add|raise)\s+(?:[\w'’-]+\s+){0,3}$/i;
/** AN EXAMPLE: a hit inside a parenthesised LIST of examples, one with a comma ("(a resource, a prisoner, a decision)"). */
const EXAMPLE_BEFORE = /\((?:[^()]*,\s*)?(?:an?\s+|the\s+)?$/;
const VISITING_AFTER = /^\s+(?:comes?|passing|passes|visits?|calls?)\s+(?:through|by)\b/i;
/**
 * Does the sentence NAME the word here: some hit that no negation denies (`negates`) and that stands in none of the
 * senses above (and, for a word with a `context`, a sentence of that context)? @param {string} sentence
 * @param {RegisteredWord} w
 */
export function namedHere(sentence, w) {
  if (w.context && !w.context.test(sentence)) return false;
  const thing = (w.kind ?? 'thing') === 'thing'; // the elsewhere senses are a house's, a person's or a thing's, never a size's
  for (const hit of sentence.matchAll(new RegExp(w.words.source, 'ig'))) {
    const at = hit.index ?? 0;
    const before = sentence.slice(0, at); const after = sentence.slice(at + hit[0].length);
    const near = before.slice(-48);
    if (/\b(?:no|not|without|nor|lacks?|lacking|beyond any|than any)\s+(?:[\w'-]+,?\s+(?:or\s+|and\s+)?){0,3}$/i.test(near)
      || /^\s+(?:cannot|could not|can't|couldn't)\b/i.test(after.slice(0, 24))) continue;
    if (thing && (ELSEWHERE_BEFORE.test(before.slice(-64)) || ELSEWHERE_AFTER.test(after))) continue;
    if (NOT_A_CLAIM_BEFORE.test(before.slice(-96)) || (w.person && VISITING_AFTER.test(after))) continue;
    const opened = before.slice(-48).match(EXAMPLE_BEFORE); const closed = after.match(/^([^()]*)\)/);
    if (opened && closed && (opened[0].includes(',') || closed[1].includes(','))) continue;
    return true;
  }
  return false;
}

/** The sentences of a printed text (a semicolon closes one, as the scan of the critique read them). @param {unknown} text */
export const sentencesOf = (text) => String(text).split(/(?<=[.!?;])\s+/).map((s) => s.trim()).filter(Boolean);

/** The things a sentence names and does not negate. @param {string} sentence */
export function thingsNamedIn(sentence) {
  return THING_IDS.filter((id) => !THINGS[id].denialOnly && THINGS[id].words.test(sentence) && namedHere(sentence, THINGS[id]));
}

/**
 * A DENIAL OF EXISTENCE: some use of the thing's words is "no X", "without (a, any) X", "lacks
 * (a) X", with at most one plain qualifier between ("no public law", "no official recourse").
 * Narrower than `negates` on purpose: "not a prison" denies an identity, "no single barracks"
 * a size, "the watch cannot" an ability, "would not call the law" a choice, and "no market dues"
 * a market's toll; none says the thing is not there. @param {string} sentence @param {RegExp} words
 */
export function deniesExistence(sentence, words) {
  const m = new RegExp(words.source, 'ig');
  for (const hit of sentence.matchAll(m)) {
    const at = hit.index ?? 0;
    const before = sentence.slice(Math.max(0, at - 32), at);
    const after = sentence.slice(at + hit[0].length, at + hit[0].length + 16);
    if (/^\s+(?:dues|tolls?|fees?|rights?|prices?|value|permits)\b/i.test(after)) continue;
    if (/\b(?:no|without(?:\s+(?:an?|any))?|lacks?(?:\s+(?:an?|any))?|lacking(?:\s+(?:an?|any))?)\s+(?:(?:public|official|lawful|legal|real|proper|working|standing|organised|organized)\s+)?$/i.test(before)) return true;
  }
  return false;
}

/**
 * The things a sentence DENIES: such a line presumes the thing's ABSENCE (the chair's ruling A of
 * 2026-11-11). @param {string} sentence
 */
export function thingsDeniedIn(sentence) {
  return THING_IDS.filter((id) => THINGS[id].words.test(sentence) && deniesExistence(sentence, THINGS[id].words));
}

/**
 * Does the town HAVE the thing, for a denial? The thing's own reader, except where the denial names
 * a narrower thing than the presumption does: "no wharf of its own" denies the dock HOUSE, which a
 * navigable town may lack. @param {string} thing @param {WordFacts} facts @param {string[]} names
 */
export function presentForDenial(thing, facts, names) {
  const t = THINGS[thing];
  return t.presentForDenial ? !!t.presentForDenial(facts, names) : !t.absent(facts, names);
}

/**
 * The NEW words a sentence names and does not negate (`NEW_WORDS`; the same matcher as `thingsNamedIn`).
 * @param {string} sentence
 */
export function newWordsNamedIn(sentence) {
  return NEW_WORD_IDS.filter((id) => NEW_WORDS[id].words.test(sentence) && namedHere(sentence, NEW_WORDS[id]));
}

/** The NEW words a sentence DENIES ("no famine", "without refugees"). @param {string} sentence */
export function newWordsDeniedIn(sentence) {
  return NEW_WORD_IDS.filter((id) => NEW_WORDS[id].kind === 'state' && NEW_WORDS[id].words.test(sentence) && deniesExistence(sentence, NEW_WORDS[id].words));
}

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

/**
 * @typedef {object} RegisteredWord
 * @property {RegExp} words the words that name it
 * @property {ReadonlyArray<string>} atoms the atoms whose declaration answers for it (its disqualifier)
 * @property {(facts: any, names: string[], record?: any, sentence?: string) => boolean} absent true when the town makes it false
 * @property {(facts: any, names: string[], record?: any, sentence?: string) => boolean} [presentForDenial] a narrower test for a denial
 * @property {boolean} [denialOnly] read on the denial side only
 * @property {'thing'|'state'|'size'|'count'} [kind]
 * @property {string} [leaf] the home that answers it
 * @property {'P'|'S'|'T'} [layer]
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
    atoms: ['walls', 'palisade', 'gate'],
    absent: (f) => !f.defence.walls && !f.defence.palisade,
  },
  garrison: {
    words: /\bgarrison(?:s|ed)?\b|\bbarracks\b/i,
    atoms: ['garrison', 'soldiers', 'commander'],
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
    atoms: ['mercenary', 'soldiers'],
    absent: (f) => !f.defence.mercenary,
  },
  docks: {
    words: /\bdocks?\b|\bharbou?rs?\b|\bquays?\b|\bwharf\b|\bwharves\b|\bdockside\b|\bdockworkers?\b|\bdockhands?\b/i,
    atoms: ['docks', 'navigable', 'coast', 'river', 'port', 'institution: docks', 'route: port', 'route: river'],
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
  temple: {
    words: /\btemples?\b|\bchurch(?:es)?\b|\bchapels?\b|\bshrines?\b|\bcathedrals?\b|\babbey\b/i,
    atoms: ['temple', 'sacredHouse', 'clergy', 'priest', 'institution: temple', 'institution: monastery'],
    absent: (f) => !f.sacredHouse,
  },
  prison: {
    words: /\bprisons?\b|\bgaols?\b|\bjails?\b/i,
    atoms: [],
    absent: (_f, names) => !names.some((n) => /prison|gaol|jail|stocks/i.test(n)),
  },
  court: {
    words: /\bcourthouses?\b|\bcourts? of law\b|\blaw ?courts?\b/i,
    atoms: [],
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
    atoms: ['war: front', 'war: aggressor', 'war: at war', 'war: peace', 'crisis: wartime', 'crisis: under_siege', 'crisis: occupied'],
    absent: (f) => f.warState === 'peace' && !f.crisis?.has?.('wartime') && !f.crisis?.has?.('under_siege') && !f.crisis?.has?.('occupied'),
  },
  // THE LAW (the chair's ruling A of 2026-11-11, "denials"): read on the DENIAL side only
  // (`denialOnly`), because every town has some law and naming it presumes nothing; denying it
  // ("No law, bring coin", "There is no official recourse here") presumes there is none. The town
  // has law where a peace-keeping house stands (the vocabulary's watch or garrison) or a house
  // that judges (a court, a council, a hall, a headman, a magistrate). "No law permits" is the
  // law of anywhere, not of this town.
  law: {
    words: /\blaw enforcement\b|\bofficial recourse\b|\blaw\b(?! permits)/i,
    atoms: ['watch', 'garrison', 'guardPresence'],
    absent: (f, names) => !f.defence.watch && !f.defence.garrison
      && !names.some((n) => /court|council|\bhall\b|headman|magistrat|reeve|justiciar|sheriff/i.test(n)),
    denialOnly: true,
  },
});

export const THING_IDS = Object.freeze(Object.keys(THINGS));

/** @param {any} f @param {string} kind @returns {boolean} is this crisis kind in force (`factsOf(record).crisis`) */
const inForce = (f, kind) => f?.crisis?.has?.(kind) === true;

/** The number words a count reads. @type {Readonly<Record<string, number>>} */
const NUMBER_WORDS = Object.freeze({ both: 2, two: 2, three: 3, four: 4, five: 5, six: 6 });

/**
 * The number a count word states in a sentence, or null.
 * @param {RegExp} words @param {string | undefined} sentence @returns {number | null}
 */
function statedCount(words, sentence) {
  const m = new RegExp(words.source, 'i').exec(String(sentence ?? ''));
  if (!m) return null;
  const word = m.slice(1).find((g) => typeof g === 'string' && g) || '';
  return NUMBER_WORDS[word.toLowerCase()] ?? null;
}

/** @param {any} record @returns {number} the powers the record holds (`powerStructure.factions`) */
const powerCount = (record) => (Array.isArray(record?.powerStructure?.factions) ? record.powerStructure.factions.length : 0);

/** The houses a count of houses reads, each by the thing whose words name it. */
const COUNTED_HOUSES = /** @type {Readonly<Record<string, string>>} */ (Object.freeze({
  temples: 'temple', churches: 'temple', chapels: 'temple', shrines: 'temple', mills: 'mill', markets: 'market', granaries: 'granary', guildhalls: 'guildhall',
}));

/**
 * THE NEW WORDS: STATES, SIZES AND COUNTS (the chair's record 288, ruling 1, B (ii): "states, sizes and counts
 * become registered things beside the sixteen houses"). The same shape as THINGS; `kind` and `leaf` say what
 * each reads. The state words assert the crisis IS in force; the size words a place large enough to have
 * quarters; a count that the town holds at least that many.
 * @type {Readonly<Record<string, RegisteredWord>>}
 */
export const NEW_WORDS = Object.freeze({
  siege: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js :: crisisFactsOf (under_siege)',
    words: /\bunder siege\b|\bbesieged\b|\bsiege lines?\b|\bblockaded\b/i,
    atoms: ['crisis: under_siege', 'crisis: threat', 'crisis: hunger'],
    absent: (f) => !inForce(f, 'under_siege'),
  },
  famine: {
    kind: 'state', layer: 'P', leaf: 'famine.js :: famineOf · crisisKind.js (famine)',
    words: /\bfamine\b|\bstarv(?:ing|ation)\b/i,
    atoms: ['crisis: famine', 'crisis: hunger', 'famine', 'starving', 'food:'],
    absent: (f) => !inForce(f, 'famine') && f?.famine?.famine !== true && !(f?.famine?.known === true && f?.famine?.starvingAllowed === true),
  },
  plague: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js (plague_onset)',
    words: /\bplague\b|\bpestilence\b|\bepidemic\b/i,
    atoms: ['crisis: plague_onset'],
    absent: (f) => !inForce(f, 'plague_onset'),
  },
  occupation: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js (occupied) · rulerKind.js (occupier)',
    words: /\b(?:the|foreign|under) occupation\b|\boccupiers?\b|\boccupying (?:force|army|power|garrison)s?\b/i,
    atoms: ['crisis: occupied', 'crisis: threat', 'ruler: occupier'],
    absent: (f) => !inForce(f, 'occupied') && f?.rulerKind !== 'occupier',
  },
  revolt: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js (insurgency, slave_revolt)',
    words: /\binsurgen(?:cy|ts?)\b|\brebellion\b|\buprising\b|\bslave revolt\b/i,
    atoms: ['crisis: insurgency', 'crisis: slave_revolt', 'crisis: unrest'],
    absent: (f) => !inForce(f, 'insurgency') && !inForce(f, 'slave_revolt'),
  },
  refugees: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js (mass_migration) · migration.js :: migrationOf',
    words: /\brefugees?\b/i,
    atoms: ['crisis: mass_migration', 'migration: influx'],
    absent: (f) => !inForce(f, 'mass_migration') && !(f?.migration?.active === true && f?.migration?.direction === 'influx'),
  },
  succession: {
    kind: 'state', layer: 'P', leaf: 'crisisKind.js (succession_void, politically_fractured)',
    words: /\bsuccession (?:crisis|struggle|void|dispute)\b|\bthe (?:empty|vacant) (?:seat|throne|chair)\b/i,
    atoms: ['crisis: succession_void', 'crisis: politically_fractured', 'crisis: succession'],
    absent: (f) => !inForce(f, 'succession_void') && !inForce(f, 'politically_fractured'),
  },
  quarters: {
    kind: 'size', layer: 'P', leaf: 'populationBand.js :: populationBandOf',
    words: /\bdistricts?\b|\b(?:poor|poorer|poorest|rich|richer|wealthy|merchant|merchants'|craft|crafts|artisan|artisans'|foreign|old|new|temple|harbour|dock|river|eastern|western|northern|southern|outer|inner|lower|upper|noble|guild|market|slum|working)\s+quarters?\b|\burban\b|\bmetropolitan\b|\bneighbou?rhoods\b|\bslums?\b|\btenements?\b/i,
    atoms: ['population:', 'tier:'],
    absent: (f) => f?.populationBand === 'small',
  },
  powersCount: {
    kind: 'count', layer: 'S', leaf: 'the record :: powerStructure.factions (a count dimension waits for factsOf)',
    words: /\b(two|three|four|five|six)\s+(?:rival\s+|great\s+|competing\s+|ruling\s+|leading\s+|standing\s+)?(?:powers|factions)\b|\bthe ruling (two|three|four|five)\b|\b(both) (?:powers|factions)\b/i,
    atoms: [],
    absent: (_f, _names, record, sentence) => { const n = statedCount(NEW_WORDS.powersCount.words, sentence); return n !== null && powerCount(record) < n; },
  },
  housesCount: {
    kind: 'count', layer: 'P', leaf: 'institutions.js :: liveInstitutionNames',
    words: /\b(two|three|four|five|six)\s+(?:\w+\s+)?(temples|churches|chapels|shrines|mills|markets|granaries|guildhalls)\b/i,
    atoms: [],
    absent: (_f, names, _record, sentence) => {
      const m = new RegExp(NEW_WORDS.housesCount.words.source, 'i').exec(String(sentence ?? ''));
      if (!m) return false;
      const n = NUMBER_WORDS[m[1].toLowerCase()]; const thing = THINGS[COUNTED_HOUSES[m[2].toLowerCase()]];
      return !!thing && names.filter((name) => thing.words.test(name)).length < n;
    },
  },
});

export const NEW_WORD_IDS = Object.freeze(Object.keys(NEW_WORDS));

/** Every registered word: the things and the new words. @type {Readonly<Record<string, RegisteredWord>>} */
export const REGISTERED_WORDS = Object.freeze({ ...THINGS, ...NEW_WORDS });

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

/** The sentences of a printed text (a semicolon closes one, as the scan of the critique read them). @param {unknown} text */
export const sentencesOf = (text) => String(text).split(/(?<=[.!?;])\s+/).map((s) => s.trim()).filter(Boolean);

/** The things a sentence names and does not negate. @param {string} sentence */
export function thingsNamedIn(sentence) {
  return THING_IDS.filter((id) => !THINGS[id].denialOnly && THINGS[id].words.test(sentence) && !negates(sentence, THINGS[id].words));
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
 * navigable town may lack. @param {string} thing @param {any} facts @param {string[]} names
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
  return NEW_WORD_IDS.filter((id) => NEW_WORDS[id].words.test(sentence) && !negates(sentence, NEW_WORDS[id].words));
}

/** The NEW words a sentence DENIES ("no famine", "without refugees"). @param {string} sentence */
export function newWordsDeniedIn(sentence) {
  return NEW_WORD_IDS.filter((id) => NEW_WORDS[id].kind === 'state' && NEW_WORDS[id].words.test(sentence) && deniesExistence(sentence, NEW_WORDS[id].words));
}

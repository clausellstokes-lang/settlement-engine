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
import { magicPractitioners } from '../magicReliance.js';
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
  temple: {
    words: /\btemples?\b|\bchurch(?:es)?\b|\bchapels?\b|\bshrines?\b|\bcathedrals?\b|\babbey\b/i,
    atoms: ['sacredHouse'], sufficient: ['temple', 'institution: temple', 'institution: monastery'],
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
    words: /\blaw enforcement\b|\bofficial recourse\b|\blaw\b(?! permits)/i,
    atoms: ['watch', 'garrison'],
    absent: (f, names) => !f.defence.watch && !f.defence.garrison
      && !names.some((n) => /court|council|\bhall\b|headman|magistrat|reeve|justiciar|sheriff/i.test(n)),
    denialOnly: true,
  },
});

export const THING_IDS = Object.freeze(Object.keys(THINGS));

/** @param {WordFacts} f @param {string} kind @returns {boolean} is this crisis kind in force (`factsOf(record).crisis`) */
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

/** @param {WordRecord | null | undefined} record @returns {number} the powers the record holds (`powerStructure.factions`) */
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
    atoms: [], kinds: ['under_siege'],
    absent: (f) => !inForce(f, 'under_siege'),
  },
  famine: {
    kind: 'state', layer: 'P', leaf: 'famine.js :: famineOf · crisisKind.js (famine)',
    words: /\bfamine\b/i,
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
  // ── THE WORDS OF THE HAND CURES (W2-B-DECLARE item 4; record 288, ruling 2: "EVERY HAND CURE REGISTERS ITS
  // WORDS", with the leaf they must read), so the next line that uses them must declare. ──
  religiousHouses: {
    kind: 'thing', layer: 'P', leaf: 'factsOf.js :: sacredHouse (pattern 8)',
    words: /\breligious houses?\b|\bhouses? of worship\b/i,
    atoms: ['sacredHouse'], sufficient: ['temple', 'institution: temple', 'institution: monastery'],
    absent: (f) => f?.sacredHouse !== true,
  },
  practitioner: {
    kind: 'thing', layer: 'T', leaf: 'magicReliance.js :: magicPractitioners (NEW-2, 3; its atom waits for a factsOf reader)',
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

export const NEW_WORD_IDS = Object.freeze(Object.keys(NEW_WORDS));

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
 *            `sufficient` one), or a band of a dimension whose every admitted band is a true band, or a crisis whose
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
  return NEW_WORD_IDS.filter((id) => NEW_WORDS[id].words.test(sentence) && !negates(sentence, NEW_WORDS[id].words));
}

/** The NEW words a sentence DENIES ("no famine", "without refugees"). @param {string} sentence */
export function newWordsDeniedIn(sentence) {
  return NEW_WORD_IDS.filter((id) => NEW_WORDS[id].kind === 'state' && NEW_WORDS[id].words.test(sentence) && deniesExistence(sentence, NEW_WORDS[id].words));
}

/**
 * domain/summary/tonightSheet.js — THE ONE TONIGHT SHEET (X-51, the owner 2026-11-03: "There
 * should be one consolidated dub it tonight sheet").
 *
 * The Quick Guide and "Tonight at the Table" were two sheets of one job, printed side by side on
 * the Table View and Session Mode and a third way in the print chapter. They are one page now,
 * composed here once and rendered by one screen component (components/TonightSheet.jsx), one
 * print chapter (pdf/sections/TonightAtTheTable.jsx) and the Foundry journal's page.
 *
 * The page opens on the ACTIVE CRISIS, naming its person from the crisis record's cast
 * (docs/DESIGN_CRISIS_TAB.md: the instigator for a social or engineered kind, the one who bears
 * the brunt for a natural or external one; the worst crisis first, a second crisis's person only
 * when different), then gives:
 *   - the three people to voice: the cast's first, in the fixed order instigator or brunt, lever,
 *     exploiter or defender; where the cast is short, the seat-holder (the ruling chain's named
 *     NPC, on derivePowerStrata's ruler), the NPC whose secret was drawn from the crisis's own
 *     pool, and the senior cleric;
 *   - the two facts the players test first: food (the band and the stores, from the one food
 *     record) and defence (defenseFactsOf);
 *   - the hooks, as the record holds them, highest priority first.
 *
 * ⛔ NOTHING IS INVENTED. Every string is a record value, a TONIGHT_COPY label or a crisis's official
 * vantage (crisis/crisisSummaryVantage.js). An absent person is absent; an absent fact is absent.
 * Pure: same settlement in, same sheet out. Lazy-only: its consumers are the Table View,
 * Session Mode, the PDF and the journal, none of which is first paint.
 */

import { collectPlotHooks } from '../dossier/plotHooks.js';
import { rulingChainOf } from '../dossier/powerStrata.js';
import { HELD_STORES_WORDS, defenseFactsOf } from '../defense/defenseFacts.js';
import { institutionDisplayName } from '../display/institutionDisplayName.js';
import { FOOD_SECURITY_BANDS } from '../../data/bandLadders.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../data/stressInstitutionEffects.js';
import { CRISIS_ROLE_LABEL, castHash, effectiveCastOf } from '../crisis/crisisCast.js';
import { crisisSummaryForSurface } from '../crisis/crisisSummaryVantage.js';
import { CRISIS_NOUN, LINE_ROLE_CLAUSE } from '../crisis/crisisHooks.js';
import { powerNameInProse } from '../display/governanceAccount.js';
import { firstRankMembershipOf, powerOrderOf } from '../people/membership.js';
import { isSeatVacant, keeperFormOf, seatKeeperOf } from '../people/seatKeeper.js';

/**
 * THE ONE COPY CONSTANT for the sheet, on every surface that prints it.
 */
export const TONIGHT_COPY = Object.freeze({
  title: 'Tonight',
  crisis: 'Active crisis',
  urgent: 'What is urgent',
  people: 'People to voice',
  facts: 'What the players test first',
  hooks: 'Hooks',
  food: 'Food',
  defence: 'Defence',
  seat: 'Holds the seat',
  secret: 'Secret',
  cleric: 'Senior cleric',
  wants: 'Wants to',
  wantsSame: 'Wants the same as',
  open: 'Open Tonight',
  close: 'Close Tonight',
});

/**
 * WHAT A CAST ROLE WANTS (lane RUNG2-F13, 2026-11-04; the chair's ruling on rung 2 §3c): a person
 * voiced from the crisis cast wants what the ROLE wants, read after "Wants to". An instigator's
 * want fits an instigator, never the want of the people answering the crisis ("identify the
 * infiltrator", soak1k-1805); the seat-holder's want stays the seat's (the NPC's own goal). One
 * line per person, chosen by `castHash` over the person, the crisis and the role: no draw.
 * ROUND THREE (the chair's ruling): these lines are voiced ONLY for a cast person whose card carries no goal of its own
 * (`castWantOf`); a person with a goal wants what their card says they want.
 */
export const CAST_WANTS = Object.freeze(/** @type {Record<string, ReadonlyArray<string>>} */ ({
  // SW-6 CRISIS-SURFACES (STYLE-RULINGS-2 B3, A·T3; W4 PEOPLE #40, granted by the chair 12:5x): the wants read
  // the crisis's scarce good ({scarce}), its noun ({noun}) and the person's own house ({people}: "the people of
  // the Elder Council"; {house}: "the Elder Council"), filled by `castWantOf`; the struck tic "thanked rather
  // than blamed" is gone.
  instigator: Object.freeze([
    'keep the pressure on until the seat gives way, and keep their own hand out of sight.',
    'use this crisis to take the seat for themselves.',
    'be the one people turn to when the seat fails.',
  ]),
  brunt: Object.freeze([
    'get {people} a fair share of {scarce} before it runs out.',
    'be heard by the seat before the {noun} takes what {people} have left.',
    'hold {people} together through the {noun}, and remember who helped.',
  ]),
  lever: Object.freeze([
    'decide who gets the {scarce}, and not be blamed by those who go without.',
    'keep {house} working through the {noun}, whatever it costs them.',
    'share out the {scarce} without being crushed between those who want it.',
  ]),
  exploiter: Object.freeze([
    'sell {scarce} dear while others go without.',
    'come out of the {noun} richer than they went in, without anyone tracing how.',
  ]),
  defender: Object.freeze([
    'hold the line through the {noun} with fewer hands than the line needs.',
    'keep {house} standing long enough for someone else to end the {noun}.',
  ]),
}));

/** What each natural kind makes scarce, in one plain noun (the kind is read; nothing else). */
const SCARCE_OF_KIND = Object.freeze(/** @type {Record<string, string>} */ ({
  famine: 'food', plague_onset: 'medicine', mass_migration: 'shelter', monster_pressure: 'guards',
  under_siege: 'food', wartime: 'arms',
}));

/**
 * The role wants that say the seat is still held (it can still "give way", it can still "fail"): false where the seat
 * stands empty (the increment's #303, rpf-city-succession_void+politically_fractured-13: "keep the pressure on until the
 * seat gives way" where the seat has given way). Read by reference to the pool, so the pool's words stay its own.
 */
const CAST_WANTS_HELD_SEAT = new Set([CAST_WANTS.instigator[0], CAST_WANTS.instigator[2]]);

/**
 * Is this role want true of the person and the town (ROUND THREE, the chair's ruling on the increment's #176 #303
 * #856)? A line that names the person's house needs one (never "their house" for a person with none); a line that
 * says the seat is held needs a held seat; a line whose crisis noun takes a singular verb needs a singular noun
 * ("the raids takes"). @param {string} line @param {string} house @param {string} noun @param {{ seatEmpty?: boolean }} facts
 * @returns {boolean}
 */
function castWantAdmits(line, house, noun, facts) {
  if (/\{house\}/.test(line) && !house) return false;
  if (CAST_WANTS_HELD_SEAT.has(line) && facts.seatEmpty) return false;
  if (/\{noun\} takes/.test(line) && /s$/.test(noun)) return false;
  return true;
}

/**
 * The want a cast person WITH NO GOAL OF THEIR OWN voices (ROUND THREE, the chair's ruling: one home for what a person
 * wants is the person's own goal, as the card prints it; the role's line only where the card carries none, and only
 * where it is true of that person in that crisis): the role's own pool, one line by `castHash` over the person, the
 * crisis and the role (no draw); a line the town makes false (`castWantAdmits`) resolves draw-free to the pool's next
 * admitted line; '' where none is admitted. Filled with the crisis's scarce good and noun and the person's own house
 * (their first-rank power; '' when they hold none). A role with no pool (never voiced today) falls back to `ownWant`.
 * @param {string} role @param {string} personId @param {string} crisis @param {string} ownWant @param {string} [house]
 * @param {{ seatEmpty?: boolean }} [facts] the town's facts a line is read against (`seatEmpty`: people/seatKeeper.js :: isSeatVacant)
 * @returns {string}
 */
export function castWantOf(role, personId, crisis, ownWant, house = '', facts = {}) {
  const pool = /** @type {Record<string, ReadonlyArray<string>>} */ (CAST_WANTS)[role];
  if (!pool || pool.length === 0) return ownWant;
  const noun = /** @type {Record<string, string>} */ (CRISIS_NOUN)[crisis] || 'crisis';
  const start = Math.floor(castHash(personId, crisis, role) * pool.length);
  const line = pool.map((_, k) => pool[(start + k) % pool.length]).find((l) => castWantAdmits(l, house, noun, facts));
  if (!line) return '';
  const named = house ? powerNameInProse(house) : '';
  return line
    .replace(/\{people\}/g, named ? `the people of ${named}` : 'their own people')
    .replace(/\{house\}/g, named)
    .replace(/\{scarce\}/g, SCARCE_OF_KIND[crisis] || 'help')
    .replace(/\{noun\}/g, noun);
}

/**
 * Does the card carry a goal of its own (the goal the card prints after "Wants")? @param {TonightNpc} npc @returns {boolean}
 */
export function hasOwnGoal(npc) {
  return !!clean(typeof npc?.goal === 'object' && npc.goal ? (npc.goal.short || npc.goal.long) : npc?.goal);
}

/**
 * THE VOICEABLE REGISTER (lane R11, the chair's ruling 2026-11-04): ONE home for the shape a want
 * must have before a DM is handed it after "Wants to". Measured from the registry's goal strings
 * (npcStructure.js) and the sixty-settlement read (docs/READER_R11_TONIGHT_WANTS_2026-11-04.md):
 * a voiceable want begins with a verb a person can act on tonight, is at most eighteen words,
 * and carries none of the management-prose words below. A line that opens on a subject or an
 * auxiliary ("Was approached…", "The supplies…") is a sentence, not a want.
 */
export const WANT_MAX_WORDS = 18;
/** Lead verbs that name a strategy, not an act (the chair's seven, plus the measured ones). */
export const ABSTRACT_LEAD_VERBS = Object.freeze([
  'convert', 'build', 'maintain', 'advance', 'consolidate', 'leverage', 'position',
  'demonstrate', 'navigate', 'sustain', 'formalize', 'formalise', 'deploy', 'redirect',
  'stabilise', 'stabilize', 'establish', 'cultivate', 'optimise', 'optimize',
]);
/** Words that open a sentence, never a want: subjects, articles, auxiliaries. */
const NOT_A_VERB = new Set(['is', 'was', 'are', 'were', 'has', 'had', 'have', 'knows', 'knew', 'they', 'their', 'them', 'he', 'she', 'his', 'her', 'it', 'its', 'the', 'a', 'an', 'this', 'that', 'these', 'those', 'nobody', 'someone', 'everyone']);
/** The abstract register: words a DM cannot say aloud as a person's want (measured; one place). */
export const ABSTRACT_REGISTER_WORDS = Object.freeze([
  'governance', 'prerogative', 'prerogatives', 'institutional', 'institution', "institution's", 'institutions',
  'credibility', 'legitimacy', 'traditional standing', "'s standing", 'standing within', 'standing through', 'context', 'framework', 'relative', 'dominant interest',
  'contingent', 'civic structures', 'civic role', 'structural', 'vulnerabilities', 'viability', 'viable',
  'operational', 'apparatus', 'indispensable', 'indispensability', 'alignment', 'accountability',
  'capacity', 'reconsolidation', 'reconsolidates', 'relevance', 'autonomy', 'neutrality', 'visibility',
  'infrastructure', 'constraints', 'niche', 'perceived', 'precedents', 'current stability',
  'conditions change', 'economic conditions', 'political contest', 'political distraction',
  'the power\'s position', 'commercial interests', 'commercial standing', 'commercial position',
  'arcane standing', 'pastoral standing', 'pastoral function', 'welfare capacity', 'responsibilities',
  'supply situation', 'commercial relationships', 'distribution network', 'parallel distribution',
  'justification', 'triggering a response', 'consolidate', 'consolidates', 'consolidating',
]);
// The word-boundary guards as REGEX literals, not string literals: the same source characters,
// and no `!` in a string the voice-mechanics ratchet reads as copy (tests/copy/voiceMechanics).
const NOT_AFTER_A_WORD = /(?<![\w'])/.source;
const NOT_BEFORE_A_WORD = /(?![\w])/.source;
const ABSTRACT_WORD_RE = new RegExp(ABSTRACT_REGISTER_WORDS
  .map((w) => `${/^\w/.test(w) ? NOT_AFTER_A_WORD : ''}${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${NOT_BEFORE_A_WORD}`)
  .join('|'), 'i');

/**
 * Why a want is not voiceable, or '' when it is. Reads the want as the sheet prints it after
 * "Wants to" (a leading "to" is dropped). `sentence-not-a-want`: it opens on a capital or on a
 * subject / auxiliary; `abstract-register`: an abstract lead verb, an abstract word, or more
 * than eighteen words.
 * @param {unknown} text @returns {'' | 'sentence-not-a-want' | 'abstract-register'}
 */
export function wantRegisterFault(text) {
  const words = clean(text).replace(/^to\s+/i, '');
  if (!words) return '';
  const lead = (words.match(/^[\w'’-]+/) || [''])[0];
  if (/^[A-Z]/.test(lead) || NOT_A_VERB.has(lead.toLowerCase())) return 'sentence-not-a-want';
  if (ABSTRACT_LEAD_VERBS.includes(lead.toLowerCase())) return 'abstract-register';
  if (words.split(/\s+/).length > WANT_MAX_WORDS) return 'abstract-register';
  if (ABSTRACT_WORD_RE.test(words)) return 'abstract-register';
  return '';
}

/**
 * THE ONE SHAPE RULE: can a DM say this want aloud tonight? (Read on the lower-led want.)
 * @param {unknown} text @returns {boolean}
 */
export function isVoiceableWant(text) {
  const words = clean(text).replace(/^to\s+/i, '');
  return !!words && wantRegisterFault(words[0].toLowerCase() + words.slice(1)) === '';
}

/** How many hooks the sheet carries. */
const HOOK_COUNT = 3;

/**
 * @typedef {Object} TonightCrisis
 * @property {string} type          the crisis's own label (e.g. 'Under Siege'), every active one joined
 * @property {string} place         the settlement's name
 * @property {string | null} person the worst crisis's named person (the cast's); null where no cast names one
 * @property {Array<{ name: string, role: string, roleLabel: string, crisis: string, kind?: string }>} persons every crisis's person, worst first, each once
 * @property {string} line          the one line the sheet opens on
 *
 * @typedef {Object} TonightPerson
 * @property {string} name
 * @property {string} role
 * @property {'seat'|'secret'|'cleric'|'cast'} why
 * @property {string=} castLabel    the cast's role label, for a person drawn from the crisis cast
 * @property {string=} castId       the cast row's id, for a person drawn from the crisis cast (the want's key)
 * @property {string=} castKind     the crisis kind the person was cast in (the want's fill)
 * @property {string} line          the record's sentence for this person: the crisis secret, or what they want
 * @property {'want'|'secret'|'temperament'} says what `line` is: a want prints after "Wants to"; a
 *                                  secret or a temperament prints as it stands (`printsAsWant`)
 * @property {string=} sameAs       set when an earlier person on the sheet wants the same: that person's
 *                                  name. The want prints once, on the first; this one reads
 *                                  "Wants the same as {sameAs}." (X-50, F2 REPEAT-ONCE)
 * @property {string} sourcePath
 *
 * @typedef {Object} TonightFact
 * @property {'food'|'defence'} id
 * @property {string} label
 * @property {string} text
 * @property {string} sourcePath
 *
 * @typedef {Object} TonightHook
 * @property {string} text
 * @property {string} source
 *
 * @typedef {Object} TonightSheet
 * @property {TonightCrisis | null} crisis
 * @property {string} opening       the first line: the crisis line, or the pressure sentence with no crisis
 * @property {TonightPerson[]} people
 * @property {TonightFact[]} facts
 * @property {TonightHook[]} hooks
 */

/**
 * @typedef {Object} TonightNpc
 * @property {unknown} [id]
 * @property {unknown} [name]
 * @property {unknown} [role]
 * @property {unknown} [title]
 * @property {unknown} [category]
 * @property {unknown} [power]
 * @property {unknown} [ousted]
 * @property {{ short?: unknown, long?: unknown } | string | null} [goal]
 * @property {{ what?: unknown } | string | null} [secret]
 *
 * @typedef {Object} TonightStress
 * @property {unknown} [type]
 * @property {unknown} [label]
 * @property {unknown} [summary]
 * @property {unknown} [direction]
 * @property {import('../crisis/crisisCast.js').CrisisCast} [cast]
 * @property {Record<string, { value?: unknown }>} [_userEdits]
 *
 * @typedef {Object} TonightSource
 * @property {unknown} [name]
 * @property {TonightStress | TonightStress[] | null} [stress]
 * @property {unknown} [pressureSentence]
 * @property {TonightNpc[]} [npcs]
 * @property {{ foodSecurity?: { foodRecord?: { band?: unknown, storageMonths?: unknown, hasGranary?: unknown } | null } | null }} [economicState]
 */

/**
 * Compose the one Tonight sheet.
 * @param {TonightSource | null | undefined} settlement
 * @returns {TonightSheet}
 */
export function composeTonightSheet(settlement) {
  const source = settlement && typeof settlement === 'object' ? settlement : {};
  const crisis = crisisOf(source);
  return {
    crisis,
    opening: crisis ? crisis.line : sentence(clean(source.pressureSentence)),
    people: peopleOf(source),
    facts: [foodFact(source), defenceFact(source)].filter(/** @returns {f is TonightFact} */ (f) => f !== null),
    hooks: hooksOf(source),
  };
}

/** @param {TonightSource} source @returns {TonightStress[]} */
function stressesOf(source) {
  const raw = source.stress;
  const list = Array.isArray(raw) ? raw : (raw ? [raw] : []);
  return list.filter((s) => !!s && typeof s === 'object');
}

/** The roles whose holder is the crisis's person on the opening line, by nature, in preference order. */
const LINE_ROLES = Object.freeze(/** @type {Record<string, import('../crisis/crisisCast.js').CrisisRole[]>} */ ({
  social: ['instigator', 'target'],
  engineered: ['instigator', 'target'],
  natural: ['brunt', 'lever'],
  external: ['brunt', 'defender', 'face', 'treater'],
}));

/** The three people to voice from the cast, slot by slot (the design's fixed order). */
const VOICE_SLOTS = Object.freeze(/** @type {import('../crisis/crisisCast.js').CrisisRole[][]} */ ([
  ['instigator', 'brunt'],
  ['lever'],
  ['exploiter', 'defender'],
]));

/**
 * Every active crisis's cast as the page shows it (the DM's word where the DM spoke), worst
 * first: the cast's own casting order, which is the engine's severity ranking.
 * @param {TonightSource} source
 * @returns {Array<{ label: string, kind: string, cast: import('../crisis/crisisCast.js').CrisisCast }>}
 */
function castsOf(source) {
  return stressesOf(source)
    .map((s, at) => ({ s, at, cast: effectiveCastOf(/** @type {Parameters<typeof effectiveCastOf>[0]} */ (source), s).cast }))
    .filter((x) => !!x.cast)
    .sort((a, b) => ((a.s.cast?.rank || 0) - (b.s.cast?.rank || 0)) || (a.at - b.at))
    .map((x) => ({ label: clean(x.s.label) || clean(x.s.type), kind: clean(x.s.type), cast: /** @type {import('../crisis/crisisCast.js').CrisisCast} */ (x.cast) }));
}

/**
 * The crisis in one line: its label (every active one), the settlement's name, and each
 * crisis's person from its cast (the worst crisis's first; a later crisis's only when it is a
 * different person). A cast that names no person adds no name.
 * @param {TonightSource} source @returns {TonightCrisis | null}
 */
function crisisOf(source) {
  const labels = stressesOf(source).map((s) => clean(s.label) || clean(s.type)).filter(Boolean);
  if (labels.length === 0) return null;
  const type = labels.join(' and ');
  const place = clean(source.name);
  /** @type {Array<{ name: string, role: string, roleLabel: string, crisis: string, kind: string }>} */
  const persons = [];
  for (const { label, kind, cast } of castsOf(source)) {
    for (const role of LINE_ROLES[cast.nature] || []) {
      const row = cast.roles.find((r) => r.role === role && r.kind === 'npc' && clean(r.name));
      if (!row) continue;
      if (!persons.some((p) => p.name === clean(row.name))) persons.push({ name: clean(row.name), role, roleLabel: CRISIS_ROLE_LABEL[role], crisis: label, kind });
      break;
    }
  }
  // #29 / #38 (STYLE-RULINGS §1(c), WAVE-RULINGS item 2; W4 PEOPLE second seat 2026-11-07): Tonight's card
  // carries the OFFICIAL vantage of the worst crisis's summary (what those in charge must decide), between
  // the label and the people; the crisis page keeps the full text. The place is named in that sentence, so
  // the head is the label alone. A crisis with no vantage line (an authored custom kind) keeps the old head.
  const lead = leadStressOf(source);
  const official = lead && place ? crisisSummaryForSurface(lead, place, 'tonight') : null;
  const said = official && official !== clean(lead?.summary) ? official : null;
  const head = said ? `${type}. ${said}` : place ? `${place}: ${type}` : type;
  const tail = castTail(persons);
  const line = tail ? `${said ? head : `${head}.`} ${tail}` : head;
  return { type, place, person: persons[0]?.name || null, persons, line };
}

/**
 * THE CAST TAIL (SW-6 CRISIS-SURFACES; STYLE-RULINGS-2 A1 R4, W4 PEOPLE row 271): who the crisis lands on, in
 * the hooks' own clauses (`crisisHooks.js :: LINE_ROLE_CLAUSE`), never the cast's role tag printed as prose
 * ("Macrina Denter (bears the brunt); Hortensia Denter (bears the brunt)."). Each person is attributed to their
 * own crisis only where the sheet carries more than one (each person was read off that crisis's cast).
 * @param {Array<{ name: string, role: string, kind?: string }>} persons
 * @returns {string}
 */
function castTail(persons) {
  if (!persons.length) return '';
  const several = new Set(persons.map((p) => p.kind || '')).size > 1;
  /** @param {{ kind?: string }} p */
  const nounOf = (p) => CRISIS_NOUN[/** @type {keyof typeof CRISIS_NOUN} */ (p.kind || '')] || 'crisis';
  if (persons.every((p) => p.role === 'brunt')) {
    return several
      ? `The worst of it falls on ${persons.map((p) => `${p.name} in the ${nounOf(p)}`).join(' and on ')}.`
      : `The worst of it falls on ${listOf(persons.map((p) => p.name))}.`;
  }
  const parts = persons.map((p) => {
    const clause = /** @type {Record<string, (h: string) => string>} */ (LINE_ROLE_CLAUSE)[p.role];
    const said = clause ? clause(p.name) : p.name;
    return several ? `in the ${nounOf(p)}, ${said}` : said;
  });
  return sentence(parts.join('; '));
}

/** @param {string[]} names @returns {string} "A", "A and B", "A, B and C" */
function listOf(names) {
  return names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/**
 * The worst active crisis, as castsOf orders them (the cast's rank, then the record's order).
 * @param {TonightSource} source @returns {TonightStress | null}
 */
function leadStressOf(source) {
  const ranked = stressesOf(source)
    .map((s, at) => ({ s, at }))
    .sort((a, b) => ((a.s.cast?.rank || 0) - (b.s.cast?.rank || 0)) || (a.at - b.at));
  return ranked.length ? ranked[0].s : null;
}

/** @param {TonightNpc} npc @returns {number} */
function powerOf(npc) {
  const n = Number(npc?.power);
  return Number.isFinite(n) ? n : 0;
}

/** @param {TonightNpc} npc @returns {string} */
function secretOf(npc) {
  return clean(typeof npc.secret === 'object' && npc.secret ? npc.secret.what : npc.secret);
}

/** @param {TonightNpc} npc @returns {string} */
function wantOf(npc) {
  const goal = clean(typeof npc.goal === 'object' && npc.goal ? (npc.goal.short || npc.goal.long) : npc.goal);
  if (!goal) return '';
  // read after the label "Wants to": the goal's own words, lower-led, closed once
  const words = goal.replace(/^to\s+/i, '');
  const lower = words[0].toLowerCase() + words.slice(1);
  return /[.!?]$/.test(lower) ? lower : `${lower}.`;
}

/** @param {TonightNpc} npc @returns {string} the temperament (X-48: never the nervous habit) */
function temperamentOf(npc) {
  const p = /** @type {{ personality?: unknown }} */ (npc).personality;
  return clean(typeof p === 'object' && p ? /** @type {{ dominant?: unknown }} */ (p).dominant : p);
}

/**
 * THE ONE CHOICE of what a person is voiced with (lane R11, the chair's ruling 2026-11-04), read
 * by the Tonight sheet and the Quick Guide (`settlementQuickGuide.js :: personDetail`): the most
 * concrete of (b) the person's own goal, only when it passes the voiceable shape rule
 * (`isVoiceableWant`); (c) their secret; (d) their temperament. (a), the crisis cast's role want
 * (CAST_WANTS), is the sheet's own and is voiced only for a cast person with no goal (ROUND THREE). `text` is the want lower-led and closed
 * (read after "Wants to"), or the secret / temperament as the record holds it; '' when the record
 * holds none of the three. `withholdSecret` skips (c) for a person who may not voice the secret
 * they keep (a crisis's TARGET keeping that crisis's own secret, F13's `target_runs_plot`).
 * @param {TonightNpc} npc @param {{ withholdSecret?: boolean }} [options]
 * @returns {{ says: 'want'|'secret'|'temperament', text: string }}
 */
export function voicedLineOf(npc, options = {}) {
  const goal = clean(typeof npc?.goal === 'object' && npc.goal ? (npc.goal.short || npc.goal.long) : npc?.goal);
  if (goal && isVoiceableWant(goal)) return { says: 'want', text: wantOf(npc) };
  const secret = npc && !options.withholdSecret ? secretOf(npc) : '';
  if (secret) return { says: 'secret', text: secret };
  const temper = npc ? temperamentOf(npc) : '';
  if (temper) return { says: 'temperament', text: temper };
  return { says: 'want', text: '' };
}

/**
 * A person's own line on the sheet (the seat-holder, the senior cleric): `voicedLineOf`, the
 * secret and the temperament closed as sentences.
 * @param {TonightNpc} npc @param {{ withholdSecret?: boolean }} [options]
 * @returns {{ says: 'want'|'secret'|'temperament', line: string }}
 */
function ownLineOf(npc, options) {
  const { says, text } = voicedLineOf(npc, options);
  return { says, line: says === 'want' ? text : sentence(text) };
}

/** @param {string} text @returns {RegExp} */
function templatePattern(text) {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-z]+\\\}/g, '.+?');
  return new RegExp(`^${escaped}$`);
}

/**
 * The secrets the crisis's own pool can draw (stressInstitutionEffects.js), as patterns over the
 * filled text. An NPC whose secret matches one carries a secret tied to the crisis.
 * @param {TonightSource} source @returns {RegExp[]}
 */
function crisisSecretPatterns(source) {
  /** @type {Record<string, ReadonlyArray<{ secret: string }>>} */
  const pools = STRESS_INSTITUTION_EFFECTS;
  return stressesOf(source).flatMap((s) => {
    const type = clean(s.type);
    return type && Object.hasOwn(pools, type) ? pools[type].map((e) => templatePattern(e.secret)) : [];
  });
}

/**
 * The three people to voice, each once, in the order seat, secret, cleric.
 * @param {TonightSource} source @returns {TonightPerson[]}
 */
function peopleOf(source) {
  const npcs = (Array.isArray(source.npcs) ? source.npcs : [])
    .map((npc, index) => ({ npc, index }))
    .filter(({ npc }) => !!npc && typeof npc === 'object' && clean(npc.name) && !npc.ousted)
    .sort((a, b) => (powerOf(b.npc) - powerOf(a.npc)) || (a.index - b.index));
  /** @type {TonightPerson[]} */
  const out = [];
  // R2-CODE-B round 3 (the increment's #pf-84 #pf-720, the chair's ruling): the keeper of an EMPTY seat is styled as the
  // Power tab styles it ("Acting First Magnate"), from the one home the powers lane holds (people/seatKeeper.js), never by
  // the bare title of the office no one holds.
  const emptySeatKeeper = seatKeeperOf(source);
  const emptySeatForm = emptySeatKeeper ? keeperFormOf(source) : '';
  /** @param {TonightNpc} npc @returns {string} */
  const roleOf = (npc) => (emptySeatKeeper && emptySeatForm && emptySeatKeeper.id && emptySeatKeeper.id === npc.id ? emptySeatForm : clean(npc.role || npc.title));
  /** @param {{ npc: TonightNpc, index: number }} row @param {'seat'|'secret'|'cleric'|'cast'} why @param {string} line @param {string} [castLabel] @param {'want'|'secret'|'temperament'} [says] @param {{ castId: string, castKind: string }} [castOf] */
  const add = (row, why, line, castLabel, says = why === 'secret' ? 'secret' : 'want', castOf = undefined) => {
    const name = clean(row.npc.name);
    const at = out.findIndex((p) => p.name === name);
    if (at >= 0) {
      // the seat-holder who also holds the crisis secret is voiced once, with the secret — AS a
      // secret (R11 / R7): it prints under the label "Secret:" (`secretLeadOf`), never after
      // "Wants to" (the seam "Wants to Has been making personal side payments…", soak1k-22).
      if (why === 'secret') out[at] = { ...out[at], line, says: 'secret' };
      return;
    }
    if (out.length >= VOICE_SLOTS.length) return; // three people; the fallbacks only where the cast is short
    out.push({ name, role: roleOf(row.npc), why, ...(castLabel ? { castLabel } : {}), ...(castOf || {}), line, says, sourcePath: `npcs[${row.index}]` });
  };

  const casts = castsOf(source);
  const patterns = crisisSecretPatterns(source);
  // RUNG2-F13 (soak1k-4200): a crisis's TARGET never voices the crisis's own secret — the target
  // and the plot's insider are opposed roles; the next keeper is voiced instead. Nor does a person
  // already voiced from the cast (soak1k-3005): their line is their own, never overwritten.
  const targets = new Set(casts.flatMap(({ cast }) => cast.roles.filter((r) => r.role === 'target' && r.kind === 'npc').map((r) => r.id)));
  // R11: the same holds when a target's OWN line falls back to their secret (soak1k-26, -55).
  /** @param {TonightNpc} npc */
  const withholdSecret = (npc) => targets.has(clean(/** @type {{ id?: unknown }} */ (npc).id) || clean(npc.name))
    && patterns.some((re) => re.test(secretOf(npc)));

  // THE CAST FIRST (docs/DESIGN_CRISIS_TAB.md): slot by slot, the worst crisis's holder first.
  // ROUND THREE (the chair's ruling on the increment's #176 #303 #856: "Wants to hold the line through the war with fewer
  // hands …" over Narantuya Tanghud's own "Find one person willing to speak against Dogshin Kipchak …"): ONE home for what a
  // person wants, the person's own goal as the card prints it. A cast person is voiced as every other person is
  // (`voicedLineOf`: their goal where it is voiceable, else their secret, else their temperament); the role's line
  // (CAST_WANTS) only for a person whose card carries no goal, and only where the town leaves it true (`castWantOf`).
  const order = powerOrderOf(/** @type {never} */ (source));
  const seatEmpty = isSeatVacant(source);
  for (const slot of VOICE_SLOTS) {
    let filled = false;
    for (const { cast, kind } of casts) {
      for (const role of slot) {
        const row = cast.roles.find((r) => r.role === role && r.kind === 'npc');
        const hit = row ? npcs.find(({ npc }) => (clean(/** @type {{ id?: unknown }} */ (npc).id) || clean(npc.name)) === row.id) : undefined;
        if (hit && row && !out.some((p) => p.name === clean(hit.npc.name))) {
          const roleWant = hasOwnGoal(hit.npc) ? '' : castWantOf(role, row.id, kind, '', clean(firstRankMembershipOf(/** @type {never} */ (hit.npc), order)?.power), { seatEmpty });
          const own = roleWant ? { says: /** @type {'want'} */ ('want'), line: roleWant } : ownLineOf(hit.npc, { withholdSecret: withholdSecret(hit.npc) });
          add(hit, 'cast', own.line, CRISIS_ROLE_LABEL[role], own.says, { castId: row.id, castKind: kind });
          filled = true; break;
        }
      }
      if (filled) break;
    }
  }

  const seatName = rulingChainOf(/** @type {Parameters<typeof rulingChainOf>[0]} */ (source)).npc?.name || '';
  const seat = seatName ? npcs.find(({ npc }) => clean(npc.name) === seatName) : undefined;
  if (seat) { const own = ownLineOf(seat.npc, { withholdSecret: withholdSecret(seat.npc) }); add(seat, 'seat', own.line, undefined, own.says); }

  const keeper = patterns.length
    ? npcs.find(({ npc }) => {
      const s = secretOf(npc);
      const castVoiced = out.some((p) => p.why === 'cast' && p.name === clean(npc.name));
      return !!s && !castVoiced && !targets.has(clean(/** @type {{ id?: unknown }} */ (npc).id) || clean(npc.name)) && patterns.some((re) => re.test(s));
    })
    : undefined;
  if (keeper) add(keeper, 'secret', sentence(secretOf(keeper.npc)));

  const cleric = npcs.find(({ npc }) => npc.category === 'religious' && !out.some((p) => p.name === clean(npc.name)));
  if (cleric) { const own = ownLineOf(cleric.npc, { withholdSecret: withholdSecret(cleric.npc) }); add(cleric, 'cleric', own.line, undefined, own.says); }
  return wantsOnce(out);
}

/**
 * Does this person's line print after "Wants to"? Only a want does; a secret (the crisis secret's
 * keeper, or the seat-holder who keeps it) and a temperament print as they stand. ONE home for
 * the three renderers (components/TonightSheet.jsx, pdf/sections/TonightAtTheTable.jsx,
 * foundry/journalPages.js). A hand-built person with no `says` reads by its `why`.
 * @param {{ why?: string, says?: string }} p @returns {boolean}
 */
export function printsAsWant(p) {
  return p.why !== 'secret' && (p.says === undefined || p.says === 'want');
}

/**
 * The label a renderer prints before a secret on a row whose own label is not "Secret" (the
 * seat-holder who keeps the crisis secret): "Secret:". Empty for every other row. A label from
 * TONIGHT_COPY, never a string on the record (the sheet's NOTHING-IS-INVENTED rule).
 * @param {{ why?: string, says?: string }} p @returns {string}
 */
export function secretLeadOf(p) {
  return p.says === 'secret' && p.why !== 'secret' ? `${TONIGHT_COPY.secret}:` : '';
}

/**
 * ONE WANT, ONE HOME (X-50, F2 REPEAT-ONCE): two people on the sheet can carry the same want
 * (two NPCs given one structural goal, npcStructure.js). The first prints it; a later one names
 * the first instead of repeating the sentence. A secret line is never folded.
 * @param {TonightPerson[]} people @returns {TonightPerson[]}
 */
function wantsOnce(people) {
  /** @type {Map<string, string>} */
  const firstBy = new Map();
  return people.map((p) => {
    if (!printsAsWant(p) || !p.line) return p;
    const first = firstBy.get(p.line);
    if (first === undefined) { firstBy.set(p.line, p.name); return p; }
    return { ...p, sameAs: first };
  });
}

/** The days a month of stores is read as (the food record counts stores in months): a year of
 *  1461 days in four, over 48 months. */
export const DAYS_PER_MONTH = 1461 / 48;

/**
 * THE SPAN OF THE STORES IN WORDS — ONE HOME (R2-CODE-B item 3; the cold list REVIEW-W2A-3 #149
 * #856 #872: "No granary; a few weeks in the larder." and "a granary, a few weeks of grain" where
 * the record holds `storageMonths` 0.1, about three days). Every span under a month was "a few
 * weeks". It is now true at days, weeks and months, read from the record's months: under a day,
 * "less than a day"; up to ten days, "about N days"; under a month, "about N weeks"; from a month,
 * the months as before ("about a month", "N months"). Any line that speaks of the stores' span in
 * words reads this (the Defence tab's food endurance line is owed the same switch:
 * defenseDisplay.js :: monthsInWords, the third leaves seat's file).
 * @param {number} months the record's `storageMonths` @returns {string} '' for no stores
 */
export function storesSpanWords(months) {
  if (!Number.isFinite(months) || months <= 0) return '';
  if (months >= 1) {
    const whole = Math.round(months);
    return whole <= 1 ? 'about a month' : `${numberWord(whole)} months`;
  }
  const days = months * DAYS_PER_MONTH;
  if (days < 1) return 'less than a day';
  const d = Math.round(days);
  if (d <= 1) return 'about a day';
  if (d <= 10) return `about ${numberWord(d)} days`;
  return `about ${numberWord(Math.max(2, Math.round(days / 7)))} weeks`;
}

/**
 * The stores in plain words, from the one food record: the span in store and the granary.
 * The same words as the Economics tab's stores row.
 * @param {{ storageMonths?: unknown, hasGranary?: unknown, storesHeld?: unknown }} record @returns {string}
 */
export function foodStoresWords(record) {
  const months = Number(record?.storageMonths);
  if (!Number.isFinite(months) || months <= 0) return '';
  const span = storesSpanWords(months);
  // RUNG2-F13: under an active famine a granary still holding six months or more is HELD — the
  // record says so (foodRecord.storesHeld), and so does the line.
  if (record.hasGranary === true && record.storesHeld === true) return `Stores: a granary of ${span} that ${HELD_STORES_WORDS}.`;
  if (record.hasGranary === true) return `Stores: a granary, ${span} of grain.`;
  return months < 1 ? `No granary; ${span} in the larder.` : `No granary; ${span} in household stores.`;
}

/** @param {number} n @returns {string} */
function numberWord(n) {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  return n >= 0 && n < words.length ? words[n] : String(n);
}

/** @param {TonightSource} source @returns {TonightFact | null} */
function foodFact(source) {
  const record = source.economicState?.foodSecurity?.foodRecord;
  if (!record || typeof record !== 'object') return null;
  const band = clean(record.band);
  /** @type {Record<string, { label: string }>} */
  const bands = FOOD_SECURITY_BANDS;
  const bandText = band && Object.hasOwn(bands, band) ? `${bands[band].label}.` : '';
  const text = [bandText, foodStoresWords(record)].filter(Boolean).join(' ');
  return text ? { id: 'food', label: TONIGHT_COPY.food, text, sourcePath: 'economicState.foodSecurity.foodRecord' } : null;
}

/** @param {TonightSource} source @returns {TonightFact} */
function defenceFact(source) {
  const facts = defenseFactsOf(/** @type {Parameters<typeof defenseFactsOf>[0]} */ (source));
  const names = facts.defenceNames.map((n) => institutionDisplayName(n)).filter(Boolean);
  const text = names.length ? `${names.join(', ')}.` : 'No walls and no standing force.';
  return { id: 'defence', label: TONIGHT_COPY.defence, text, sourcePath: 'defenseFactsOf' };
}

/** @param {TonightSource} source @returns {TonightHook[]} */
function hooksOf(source) {
  return [...collectPlotHooks(/** @type {Parameters<typeof collectPlotHooks>[0]} */ (source))]
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, HOOK_COUNT)
    .map((h) => ({ text: sentence(clean(h.text)), source: clean(h.source) }))
    .filter((h) => h.text);
}

/** @param {unknown} value @returns {string} */
function clean(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

/** @param {string} text @returns {string} */
function sentence(text) {
  if (!text) return '';
  const lead = text[0].toUpperCase() + text.slice(1);
  return /[.!?]$/.test(lead) ? lead : `${lead}.`;
}

/**
 * traditionDescriptionFrames.walker.test.js — TRAD-1 (the seventh chair, 2026-11-20; rulings CTR2 and CTR6).
 *
 * THE CLOSED SET. A tradition's description (`domain/traditions/traditionDescription.js`) is composed ONLY from the
 * frames and fit rows of `data/traditionDescriptionTable.js`. This walker holds that set four ways:
 *   1. THE COUNT: every authored template string is enumerated and the count is pinned; a new frame moves the pin
 *      on purpose or reds.
 *   2. THE CAUSE LAW (CTR2): a word that asserts a cause ("since", "because", "in memory of", "founded", "after",
 *      "to mark") stands only in a CAUSE frame; every other authored string is scanned for it.
 *   3. THE LEVEL LAW (CTR6, the owner's calm rule): no authored string dramatises; a closed lexicon of drama words is
 *      scanned over every frame, gloss, lead and prose form.
 *   4. THE BORN POOL: every sentence the leaf composes for 24 born towns (four a tier, six cultures) matches one of
 *      the frames, and no composed sentence carries a drama word once the record's own names are masked.
 * Plus: THE TABLE HOLDS NO HIDEABLE HOUSE (no rite is ever given to a house the gallery veil may hide whole).
 *
 * RED FIRST, IN MEMORY: each law's predicate is driven over a PLANTED string and must name it (a drama word in a
 * lead; a cause word in a keeper frame; a sentence no frame produces), so no arm can pass by refusing nothing.
 *
 * CTR10 FINISHED (TRAD-4 unit 5, 2026-11-20): EVERY LINE A DECLARED LINE (a frozen `line()` row whose declaration is
 * atoms of the closed vocabulary, a twin, or the colour mark "presumes nothing": the house's rule,
 * tests/lint/declaredLineShape.test.js :: isDeclaredLine); THE FLOORS, counted off the table's own exports (twins not
 * counted); THE CRISIS DIMENSION (every excluded line of a crisis-scoped pool has its twin, and the exclusions are the
 * ones named); THE OUTCOME LAW (no line says what became of the rite this year); THE KINDS' TOTALITY, by a planted type.
 */
import { describe, it, expect } from 'vitest';
import {
  ACT_LEADS, ELEMENT_GLOSS, HOUSE_FRAMES, POWER_FRAMES, OWNER_FRAMES, CAUSE_FRAMES, ECONOMY_FRAMES, KEEPER_HOUSES, ECONOMY_FIT,
  POWER_FRAME_VERBS, DEAD_EVENT_TYPES, DEAD_EVENT_PHRASES, CRISIS_SCOPED_ACTS, CRISIS_SCOPED_ELEMENTS,
} from '../../src/data/traditionDescriptionTable.js';
import { assertDeclarable, isColourLine, declarationOf, atomsOf, CRISIS_FAMILY_KINDS } from '../../src/domain/facts/factVocabulary.js';
import * as TABLE from '../../src/data/traditionDescriptionTable.js';
import { describeTradition } from '../../src/domain/traditions/traditionDescription.js';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';

// "goes back" (TRAD-4 unit 11): the chair's third founding line asserts its cause by it ("It goes back {age} years, to the
// founding of {town} by {foundedBy}."), with no other cause word; read as one, it is barred from every non-cause frame too.
const CAUSE_WORDS = /\b(since|because|in memory of|founded|founding by|goes back|after|to mark|owing to|thanks to)\b/i;
const DRAMA_WORDS = /\b(blood\w*|grim\w*|dread\w*|fear\w*|feud\w*|war\b|wars|curse\w*|doom\w*|troubl\w*|strife|terror\w*|haunt\w*|vengeance|bitter\w*|dark\w*|sinister|violen\w*|massacre\w*|slaughter\w*|tragic\w*|tragedy|sorrow\w*|grief|griev\w*|desperat\w*|ruin\w*|menac\w*|ominous|uneasy|tension\w*|secret\w*|rival\w*)\b/i;

/** A line's text: a declared row's `text` (a bare string is itself, and is named undeclared by `undeclaredIn`). */
const textOf = (l) => (typeof l === 'string' ? l : l.text);

/**
 * Every authored line of the table AS THE TABLE HOLDS IT (a row, or a bare string), by its home, in its pool: S1's leads
 * and glosses, and the five frame tables (house, power, owner, cause, economy). `pool` is the leaf's pool id.
 */
function rows() {
  /** @type {Array<{ home: string, pool: string, line: unknown, cause: boolean }>} */
  const out = [];
  const table = (home, pools, cause = false) => {
    for (const [k, pool] of Object.entries(pools)) pool.forEach((line, i) => out.push({ home: `${home}.${k}.${i}`, pool: `${home}.${k}`, line, cause }));
  };
  table('lead', ACT_LEADS);
  table('gloss', ELEMENT_GLOSS);
  table('house', HOUSE_FRAMES);
  table('power', POWER_FRAMES);
  OWNER_FRAMES.forEach((line, i) => out.push({ home: `owner.${i}`, pool: 'owner', line, cause: false }));
  table('cause', CAUSE_FRAMES, true);
  table('economy', ECONOMY_FRAMES);
  // the keeper's "too" wordings (TRAD-4 unit 10, the chair's 17:55 ruling): reached only by the rotation, never a pick
  table('too', TABLE.KEEPER_FRAMES_TOO || {});
  // a held element's "also" gloss (TRAD-5 unit 13, the chair's 21:03 approval): reached only by a later rite, never a pick
  table('also', TABLE.ELEMENT_GLOSS_ALSO || {});
  return out;
}

/** Every authored template string, by its home. */
function templates() {
  return rows().map((r) => ({ home: r.home, text: textOf(r.line), cause: r.cause }));
}

/** Every authored prose FORM a frame's slot may take from the table itself (the income prose; the reader's event kinds). */
function proseForms() {
  return [...Object.values(ECONOMY_FIT).flatMap((rows) => rows.map((r) => r.prose)), ...Object.values(TABLE.DEAD_EVENT_PHRASES || {})];
}

/** The cause law's predicate: the homes of non-cause strings carrying a cause word. */
const causeViolations = (list) => list.filter((t) => !t.cause && CAUSE_WORDS.test(t.text)).map((t) => t.home);
/** The level law's predicate. */
const dramaViolations = (strings) => strings.filter((s) => DRAMA_WORDS.test(s));

/** A frame as a whole-sentence matcher: each {slot} matches any run of text. */
const frameRe = (t) => new RegExp(`^${t.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{\w+\}/g, '.+?')}$`);

/** Every gloss S1 may print after "that": the element's own, and a held element's "also" line (TRAD-5 unit 13). */
const allGlosses = () => [...Object.values(ELEMENT_GLOSS), ...Object.values(TABLE.ELEMENT_GLOSS_ALSO || {})].flat().map(textOf);

/** Every sentence shape the leaf may produce: S1 (lead × gloss, or the lead alone) and every S2/S3 frame. */
function sentenceMatchers() {
  const res = [];
  const leads = Object.values(ACT_LEADS).flat().map((l) => l.text);
  const glosses = allGlosses();
  for (const lead of leads) {
    res.push(frameRe(`${lead}.`));
    for (const gloss of glosses) res.push(frameRe(`${lead} that ${gloss}.`));
  }
  for (const t of templates()) if (!['gloss.', 'lead.', 'also.'].some((h) => t.home.startsWith(h))) res.push(frameRe(t.text));
  return res;
}
/** The sentences of a composed text no frame produces. */
const strayIn = (text, matchers) => text.split(/(?<=\.)\s+(?=[A-Z])/).filter((s) => s && !matchers.some((re) => re.test(s)));

describe('traditionDescriptionFrames — the closed set', () => {
  it('THE COUNT: the authored template strings number exactly the pin (a new frame moves it on purpose)', () => {
    // 92 → 125 (TRAD-4 unit 5): every gloss pool raised to three lines, and harvest's two new thanks lines' twins
    // 125 → 143 (TRAD-4 unit 10, the chair's 17:55 ruling): two "too" wordings for each of the nine keeper frame kinds
    // 143 → 159 (TRAD-5 unit 13, the chair's 21:03 approval): one "also" gloss for each of the sixteen elements
    expect(templates().length).toBe(159);
  });

  it('every frame slot is one of the slots the leaf fills', () => {
    const SLOTS = new Set(['house', 'House', 'person', 'title', 'power', 'Power', 'owner', 'Owner', 'town', 'Town', 'age', 'foundedBy', 'event', 'when', 'income', 'Income', 'is', 'brings', ...Object.keys(POWER_FRAME_VERBS)]);
    for (const t of templates()) for (const m of t.text.matchAll(/\{(\w+)\}/g)) expect(SLOTS.has(m[1]), `${t.home}: {${m[1]}}`).toBe(true);
  });
});

/** A frame whose subject is the power: its verb must be a POWER_FRAME_VERBS slot (the power's number chooses it). */
const POWER_SUBJECT = /\{Power\}\s+(\S+)/;
const bareVerbAfterPower = (list) => list.filter((t) => {
  const m = POWER_SUBJECT.exec(t.text);
  return m && !(/^\{(\w+)\}$/.test(m[1]) && Object.hasOwn(POWER_FRAME_VERBS, m[1].slice(1, -1)));
}).map((t) => t.home);

describe('traditionDescriptionFrames — a power\'s verb takes its number (the chair\'s ruling of 2026-11-20)', () => {
  it('every frame whose subject is {Power} hands its verb as a POWER_FRAME_VERBS slot (powerSentenceName.js :: powerVerb)', () => {
    expect(templates().filter((t) => POWER_SUBJECT.test(t.text)).length).toBeGreaterThan(0);
    expect(bareVerbAfterPower(templates())).toEqual([]);
  });

  it('RED FIRST: a bare verb planted after {Power} is named', () => {
    expect(bareVerbAfterPower([{ home: 'power.seat.planted', text: '{Power} keeps it.' }, { home: 'power.seat.ok', text: '{Power} {keeps} it.' }]))
      .toEqual(['power.seat.planted']);
  });
});

describe('traditionDescriptionFrames — the cause law (CTR2)', () => {
  it('a cause word stands only in a CAUSE frame', () => {
    expect(causeViolations(templates())).toEqual([]);
  });

  it('every CAUSE frame does assert its cause (the law cannot pass on an empty cause set)', () => {
    const causes = templates().filter((t) => t.cause);
    expect(causes.length).toBeGreaterThan(0);
    for (const t of causes) expect(CAUSE_WORDS.test(t.text), t.home).toBe(true);
  });

  it('RED FIRST: a cause word planted in a keeper frame is named', () => {
    const planted = [...templates(), { home: 'house.body.planted', text: 'It is kept by {house} because of {event}.', cause: false }];
    expect(causeViolations(planted)).toEqual(['house.body.planted']);
  });
});

/**
 * THE FOUNDER PHRASE ENDS THE SENTENCE (TRAD-4 unit 11; the chair, 18:16 UTC): a founder phrase may end on a verb ("a
 * single extended family who came and never left"), so no age may follow it ("…never left, 120 years ago" reads as
 * "never left 120 years ago"). The founding lines whose `{foundedBy}` is not their one last slot with only the full stop
 * after it, by text.
 * @param {ReadonlyArray<unknown>} lines
 */
const founderNotLast = (lines) => lines.map(textOf).filter((t) => (t.match(/\{foundedBy\}/g) || []).length !== 1 || !/\{foundedBy\}\.$/.test(t));

describe('traditionDescriptionFrames — the founder phrase ends the founding sentence (TRAD-4 unit 11)', () => {
  it('every founding line (CAUSE_FRAMES.founding) ends on {foundedBy}: its last slot, the full stop the only thing after it', () => {
    expect(CAUSE_FRAMES.founding.length).toBe(3); // not vacuous: the three founding lines
    expect(founderNotLast(CAUSE_FRAMES.founding)).toEqual([]);
  });

  it('the reader\'s founding (CAUSE_FRAMES.foundingBare, which never reads {foundedBy}) is untouched: its three lines, verbatim', () => {
    expect(CAUSE_FRAMES.foundingBare.map(textOf)).toEqual([
      'It has been kept since {town} was founded, {age} years ago.',
      '{Town} has kept it since its founding, {age} years ago.',
      'It goes back to the founding of {town}, {age} years ago, and has been kept since.',
    ]);
  });

  it('RED FIRST: a founding line planted with the age after the founder phrase is named; one ending on it is not', () => {
    expect(founderNotLast([
      'It has been kept since {town} was founded by {foundedBy}, {age} years ago.',
      'It goes back {age} years, to the founding of {town} by {foundedBy}.',
      'It was founded by {foundedBy} and {foundedBy}.',
    ])).toEqual(['It has been kept since {town} was founded by {foundedBy}, {age} years ago.', 'It was founded by {foundedBy} and {foundedBy}.']);
  });
});

describe('traditionDescriptionFrames — the level law (CTR6, the owner\'s calm rule)', () => {
  it('no authored frame, gloss, lead or prose form dramatises', () => {
    expect(dramaViolations([...templates().map((t) => t.text), ...proseForms()])).toEqual([]);
  });

  it('RED FIRST: a drama word planted in a lead is named', () => {
    expect(dramaViolations(['A common feast', 'A grim feast', 'A vigil'])).toEqual(['A grim feast']);
    expect(dramaViolations(['A common feast'])).toEqual([]); // the anchor: the same predicate passes a calm lead
  });
});

/**
 * THE KINDS' TOTALITY: the kinds that lack a phrase, and the phrases that name no kind (each list empty when the two
 * tables agree). @param {ReadonlyArray<string>} types @param {Readonly<Record<string, string>>} phrases
 */
const kindsOutOfStep = (types, phrases) => ({
  noPhrase: types.filter((t) => typeof phrases[t] !== 'string' || !phrases[t]),
  noKind: Object.keys(phrases).filter((k) => !types.includes(k)),
});

describe('traditionDescriptionFrames — the reader\'s event kinds (TRAD-3 unit 4, the chair\'s item 3)', () => {
  it('every event kind a rite of the dead may be kept in memory of has one authored phrase, and nothing else does', () => {
    expect(Object.keys(TABLE.DEAD_EVENT_PHRASES || {}).sort()).toEqual([...DEAD_EVENT_TYPES].sort());
    expect(kindsOutOfStep(DEAD_EVENT_TYPES, DEAD_EVENT_PHRASES)).toEqual({ noPhrase: [], noKind: [] });
  });

  it('RED FIRST (TRAD-4 unit 5, the chair 13:32): a type planted into DEAD_EVENT_TYPES with no phrase is named; a phrase with no kind is named', () => {
    expect(kindsOutOfStep([...DEAD_EVENT_TYPES, 'popular_uprising'], DEAD_EVENT_PHRASES)).toEqual({ noPhrase: ['popular_uprising'], noKind: [] });
    expect(kindsOutOfStep(DEAD_EVENT_TYPES.slice(1), DEAD_EVENT_PHRASES)).toEqual({ noPhrase: [], noKind: [DEAD_EVENT_TYPES[0]] });
  });

  it('each phrase is a plain lower-case noun phrase with its article: no drama word, no cause word, no slot', () => {
    const phrases = Object.values(TABLE.DEAD_EVENT_PHRASES || {});
    expect(phrases.length).toBe(DEAD_EVENT_TYPES.length);
    for (const p of phrases) {
      expect(p, p).toMatch(/^the [a-z]+(?: [a-z]+)*$/);
      expect(DRAMA_WORDS.test(p) || CAUSE_WORDS.test(p) || /\{/.test(p), p).toBe(false);
    }
  });
});

/** The house's declaration keys (tests/lint/declaredLineShape.test.js :: isDeclaredLine): atoms, a twin, or colour. */
const DECLARATION_KEYS = Object.freeze(['needs', 'excludes', 'crisis', 'twinOf', 'colour']);
/**
 * THE UNDECLARED-LINE PREDICATE: the homes of rows that are not a frozen `line()` row with a string `text` and a
 * declaration (a bare string is the case it was written for).
 */
const undeclaredIn = (list) => list.filter(({ line }) => !(line && typeof line === 'object' && !Array.isArray(line)
  && Object.isFrozen(line) && typeof line.text === 'string' && DECLARATION_KEYS.some((k) => Object.hasOwn(line, k)))).map((r) => r.home);

describe('traditionDescriptionFrames — EVERY LINE A DECLARED LINE (CTR10; TRAD-4 unit 5 item 1)', () => {
  it('every authored line of the table (leads, glosses and the five frame tables) is a declared row', () => {
    expect(rows().length).toBe(templates().length);
    expect(undeclaredIn(rows())).toEqual([]);
  });

  it('every declared atom is an atom of the closed vocabulary with a reader (assertDeclarable); a colour line declares nothing else (isColourLine)', () => {
    const bad = [];
    for (const { home, line } of rows()) {
      if (!line || typeof line !== 'object') continue; // named by the arm above
      try {
        isColourLine(line);
        for (const a of [...(line.needs || []), ...(line.excludes || [])]) assertDeclarable(a);
        for (const c of line.crisis || []) assertDeclarable(`crisis: ${c}`);
      } catch (e) { bad.push(`${home}: ${e.message}`); }
    }
    expect(bad).toEqual([]);
  });

  it('a twin names a line of its own pool, and is reached only from it', () => {
    const stray = [];
    for (const r of rows()) {
      const twinOf = r.line && typeof r.line === 'object' ? r.line.twinOf : undefined;
      if (typeof twinOf !== 'string') continue;
      const original = rows().find((o) => o.pool === r.pool && o !== r && textOf(o.line) === twinOf && !o.line.twinOf);
      if (!original) stray.push(r.home);
    }
    expect(stray).toEqual([]);
  });

  it('RED FIRST: a bare string planted in a frame table is named undeclared; so is a row with no declaration', () => {
    const planted = [...rows(), { home: 'house.body.planted', line: 'It is kept by {house}.' }, { home: 'owner.planted', line: Object.freeze({ text: 'It is kept now by {owner}.' }) }];
    expect(undeclaredIn(planted)).toEqual(['house.body.planted', 'owner.planted']);
  });
});

/** The non-twin lines of a pool (a twin is reached only by resolution: it is not a line of the draw). */
const drawable = (pool) => pool.filter((l) => !(l && typeof l === 'object' && typeof l.twinOf === 'string'));
/** THE FLOORS (CTR10; TRAD-4 unit 5 item 2): every pool the leaf draws, by its slot, with its floor. */
function floors() {
  /** @type {Array<{ slot: string, size: number, floor: number }>} */
  const out = [];
  const each = (home, pools, floor) => { for (const [k, pool] of Object.entries(pools)) out.push({ slot: `${home}.${k}`, size: drawable(pool).length, floor }); };
  each('lead', ACT_LEADS, 4);
  each('gloss', ELEMENT_GLOSS, 3);
  each('house', HOUSE_FRAMES, 3);
  each('power', POWER_FRAMES, 3);
  out.push({ slot: 'owner', size: drawable(OWNER_FRAMES).length, floor: 3 });
  each('cause', CAUSE_FRAMES, 3);
  each('economy', ECONOMY_FRAMES, 3);
  return out;
}
/** The slots below their floor, by name and size. */
const belowFloor = (list) => list.filter((f) => f.size < f.floor).map((f) => `${f.slot}: ${f.size} < ${f.floor}`);

describe('traditionDescriptionFrames — THE FLOORS, counted off the table\'s own exports (TRAD-4 unit 5 item 2)', () => {
  it('S1: four leads an act; every gloss pool three; every keeper frame kind three; the founding causes (both) and the dead\'s three; every economy band three (twins not counted)', () => {
    const slots = floors().map((f) => f.slot);
    // the floor list covers every pool the leaf draws (no pool escapes it by being absent)
    for (const s of ['cause.founding', 'cause.foundingBare', 'cause.dead', 'economy.chief', 'economy.lesser', 'economy.only', 'owner',
      'house.body', 'house.bodyPerson', 'house.place', 'house.placePerson', 'house.placePower', 'power.seat', 'power.religious', 'power.merchantry']) {
      expect(slots, s).toContain(s);
    }
    expect(slots.filter((s) => s.startsWith('lead.')).length).toBe(6);
    expect(slots.filter((s) => s.startsWith('gloss.')).length).toBe(16);
    expect(belowFloor(floors())).toEqual([]);
  });

  it('RED FIRST: a pool planted below its floor is named with its size', () => {
    expect(belowFloor([...floors(), { slot: 'gloss.planted', size: 2, floor: 3 }])).toEqual(['gloss.planted: 2 < 3']);
  });
});

/** The crisis atoms a line excludes (`excludes: crisis: F`), as written. */
const crisisExclusions = (line) => (line && typeof line === 'object' ? (line.excludes || []).filter((a) => /^crisis\b/.test(a)) : []);
/** For each crisis-scoped pool: the excluded lines, each with its atoms and its twin's text (null: no twin). */
function crisisMap(scoped) {
  /** @type {Record<string, Array<{ text: string, excludes: string[], twin: string|null, twinAny: boolean }>>} */
  const out = {};
  for (const [pool, lines] of scoped) {
    out[pool] = drawable(lines).filter((l) => crisisExclusions(l).length).map((l) => {
      const twin = lines.find((t) => t && typeof t === 'object' && t.twinOf === l.text);
      return { text: l.text, excludes: crisisExclusions(l), twin: twin ? twin.text : null, twinAny: !!twin && atomsOf(declarationOf(twin)).join() === 'crisis: any' };
    });
  }
  return out;
}
const SCOPED = () => [...CRISIS_SCOPED_ACTS.map((a) => [`lead.${a}`, ACT_LEADS[a]]), ...CRISIS_SCOPED_ELEMENTS.map((e) => [`gloss.${e}`, ELEMENT_GLOSS[e]])];
/** The excluded lines of a crisis-scoped pool that do not resolve to a twin saying only what is kept (`crisis: any`). */
const untwinned = (map) => Object.entries(map).flatMap(([pool, list]) => list.filter((x) => !x.twin || !x.twinAny).map((x) => `${pool}: ${x.text}`));
/** The lines of a crisis-scoped pool that are silent on the crisis (silence there reads as calm: a line says its stance). */
const silentIn = (scoped) => scoped.flatMap(([pool, lines]) => lines.filter((l) => !(l && typeof l === 'object' && ((l.crisis || []).length || crisisExclusions(l).length))).map((l) => `${pool}: ${textOf(l)}`));

describe('traditionDescriptionFrames — THE CRISIS DIMENSION (CTR10; TRAD-4 unit 5 item 3)', () => {
  it('the crisis-scoped pools are the feast and fair leads and the harvest gloss, and the families that exclude their lines are the ones named', () => {
    expect(SCOPED().map(([p]) => p)).toEqual(['lead.feast', 'lead.fair', 'gloss.harvest']);
    const map = crisisMap(SCOPED());
    const families = Object.fromEntries(Object.entries(map).map(([p, list]) => [p, [...new Set(list.flatMap((x) => x.excludes))]]));
    // hunger: a feast eaten in common, and thanks given for the harvest, contradict a famine or a siege's want (and any
    // crisis while the food record reads a deficit); threat: a fair of stalls and of traders from outside contradicts a
    // siege, an occupation or the beasts at the door. Each family's kinds are the vocabulary's own (CRISIS_FAMILY_KINDS).
    // Declaring no crisis value in a crisis-scoped pool, each excluded line is ALSO refused under any other active crisis
    // (silence reads calm) and resolves to its twin: the family names the contradiction, not the whole of the refusal.
    expect(families).toEqual({ 'lead.feast': ['crisis: hunger'], 'lead.fair': ['crisis: threat'], 'gloss.harvest': ['crisis: hunger'] });
    expect([...CRISIS_FAMILY_KINDS.hunger]).toEqual(['famine', 'under_siege']);
    expect([...CRISIS_FAMILY_KINDS.threat]).toEqual(['under_siege', 'occupied', 'monster_pressure']);
    for (const [p, list] of Object.entries(map)) expect(list.length, p).toBeGreaterThan(0);
  });

  it('every excluded line resolves to a TWIN that says only what is kept (crisis: any), and no line of a scoped pool is silent', () => {
    expect(untwinned(crisisMap(SCOPED()))).toEqual([]);
    expect(silentIn(SCOPED())).toEqual([]);
  });

  it('RED FIRST: an excluded line planted with no twin is named; a silent line planted in a scoped pool is named', () => {
    const planted = [...SCOPED(), ['lead.planted', [Object.freeze({ text: 'A feast of plenty', excludes: ['crisis: hunger'] }), Object.freeze({ text: 'A plain feast', colour: true })]]];
    expect(untwinned(crisisMap(planted))).toEqual(['lead.planted: A feast of plenty']);
    expect(silentIn(planted)).toEqual(['lead.planted: A plain feast']);
  });
});

/** A form of "keep" (kept, keep, keeps), counted by occurrence. */
const KEEP_FORMS = /\b(kept|keep|keeps)\b/gi;
/**
 * THE FIRST SENTENCE SAYS "KEPT" ONCE (TRAD-4 unit 9, unit 6's finding): every lead × every gloss the table can join
 * (twins included on both sides, since a twin is printed), named "lead × gloss" where the joined sentence holds a form
 * of "keep" more than once ("A feast day kept by custom that is kept for what the fields give.").
 * @param {ReadonlyArray<string>} leads @param {ReadonlyArray<string>} glosses
 */
const keptTwice = (leads, glosses) => leads.flatMap((lead) => glosses
  .filter((gloss) => (`${lead} that ${gloss}.`.match(KEEP_FORMS) || []).length > 1)
  .map((gloss) => `${lead} × ${gloss}`));

describe('traditionDescriptionFrames — no first sentence says "kept" twice (TRAD-4 unit 9)', () => {
  it('no lead joined to any gloss (every act\'s pool and every element\'s pool, twins included, and every "also" gloss) holds a form of "keep" more than once', () => {
    const leads = Object.values(ACT_LEADS).flat().map(textOf);
    const glosses = allGlosses();
    expect(leads.length * glosses.length).toBeGreaterThan(0);
    expect(keptTwice(leads, glosses)).toEqual([]);
  });

  it('RED FIRST: a clashing pair planted is named; a lead or gloss with one "kept" alone is not', () => {
    expect(keptTwice(['A feast day kept by custom', 'A vigil'], ['is kept for what the fields give', 'honours the river', 'keeps faith with the old ways']))
      .toEqual(['A feast day kept by custom × is kept for what the fields give', 'A feast day kept by custom × keeps faith with the old ways']);
    expect(keptTwice(['A vigil'], ['is kept under the stars'])).toEqual([]);
  });
});

/** THE OUTCOME LAW: a word that says what became of a rite this year (the simulation's own record, `lastOutcome`). */
const OUTCOME_WORDS = /\b(this year|last year|this season|triumph\w*|failure|failed|cancel\w*|set aside|troubled|well kept|modestly|was held|was kept|went well|went badly|lapsed|abandoned|no longer|not held)\b/i;
const outcomeViolations = (strings) => strings.filter((s) => OUTCOME_WORDS.test(s));

describe('traditionDescriptionFrames — the text never says what became of the rite this year (TRAD-4 unit 5 item 3)', () => {
  it('no authored line or prose form states an outcome', () => {
    expect(outcomeViolations([...templates().map((t) => t.text), ...proseForms()])).toEqual([]);
  });

  it('RED FIRST: an outcome planted in a frame is named', () => {
    expect(outcomeViolations(['It is kept by {house}.', 'It was a triumph this year.', 'It was set aside.'])).toEqual(['It was a triumph this year.', 'It was set aside.']);
  });
});

describe('traditionDescriptionFrames — the table holds no hideable house', () => {
  it('no keeper row matches any catalogue house the gallery veil may hide whole (criminal, clandestine, illegal brokerage)', () => {
    const hideable = [];
    for (const [tier, cats] of Object.entries(institutionalCatalog)) {
      for (const [category, rows] of Object.entries(cats)) {
        for (const [name, row] of Object.entries(rows)) {
          if (isHideableHouse({ name, category, ...row })) hideable.push(`${tier}:${name}`);
        }
      }
    }
    expect(hideable.length).toBeGreaterThan(0); // the scan reads a real catalogue
    const ids = new Set([...Object.values(KEEPER_HOUSES.element), ...Object.values(KEEPER_HOUSES.act)].flat().flatMap((r) => r.ids));
    const hits = hideable.filter((h) => ids.has(catalogIdForName(h.split(':').slice(1).join(':'))));
    expect(hits).toEqual([]);
  });
});

describe('traditionDescriptionFrames — the born pool: every composed sentence is a frame', () => {
  const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const CULTURES = ['germanic', 'norse', 'latin', 'arabic', 'east_asian', 'south_asian'];
  const towns = TIERS.flatMap((settType, i) => [0, 1, 2, 3].map((j) => generateSettlementPipeline(
    { settType, culture: CULTURES[(i + j) % CULTURES.length], terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized' },
    null, { seed: `trad-walker-${settType}-${j}`, customContent: {} },
  )));
  const matchers = sentenceMatchers();

  it('24 born towns: every sentence of every description, for the owner and for the reader, is one of the frames', () => {
    let described = 0;
    const stray = [];
    for (const t of towns) {
      for (const rec of deriveFoundingTraditions(t)) {
        for (const audience of ['owner', 'reader']) {
          const d = describeTradition(rec, t, { audience });
          if (!d) continue;
          described += 1;
          stray.push(...strayIn(d.text, matchers).map((s) => `${t.name} (${audience}): ${s}`));
        }
      }
    }
    expect(described).toBeGreaterThan(100);
    expect(stray).toEqual([]);
  }, 60000);

  it('no composed description dramatises, once the record\'s own names are masked', () => {
    const loud = [];
    for (const t of towns) {
      for (const rec of deriveFoundingTraditions(t)) {
        const d = describeTradition(rec, t, { audience: 'owner' });
        if (!d) continue;
        let text = d.text.split(String(t.name)).join('');
        for (const n of [...d.named.houses, ...d.named.persons, ...d.named.powers, ...d.named.events]) text = text.split(n).join('');
        const fd = t.history?.founding?.foundedBy;
        if (typeof fd === 'string') text = text.split(fd).join('');
        if (DRAMA_WORDS.test(text)) loud.push(`${t.name}: ${d.text}`);
      }
    }
    expect(loud).toEqual([]);
  }, 60000);

  it('RED FIRST: a sentence no frame produces is named stray', () => {
    expect(strayIn('A common feast that honours the river. The river runs red with old grudges.', matchers))
      .toEqual(['The river runs red with old grudges.']);
  });
});

/**
 * THE KEEPER'S "TOO" WORDINGS (TRAD-4 unit 10; the chair, 17:55 UTC; TRAD-4's law): KEEPER_FRAMES_TOO holds, for every
 * keeper frame kind (each kind of HOUSE_FRAMES and POWER_FRAMES, and the owner), a fourth and a fifth wording, reached
 * ONLY by the rotation (traditionDescription.js :: drawTurn) after the kind's three frames are taken: never a pick. So
 * none may stand in a pool the pick reaches (HOUSE_FRAMES, POWER_FRAMES, OWNER_FRAMES). Each names its keeper (the
 * house, the power, or the owner; a place power both) and drops the presider's clause; none makes a house the subject of
 * a verb; each says it is "too" or "as well".
 */
const TOO = () => /** @type {Record<string, ReadonlyArray<{ text: string }>>} */ (TABLE.KEEPER_FRAMES_TOO || {});
/** The pools the pick reaches, by kind (the keeper frames). */
const PICKED = () => ({ ...HOUSE_FRAMES, ...POWER_FRAMES, owner: OWNER_FRAMES });
/** The "too" lines a pick could reach: any whose text stands in a picked pool. */
const tooInReach = (too, picked) => Object.entries(too).flatMap(([k, lines]) => lines
  .filter((l) => Object.values(picked).some((pool) => pool.some((p) => textOf(p) === l.text))).map((l) => `${k}: ${l.text}`));

describe('traditionDescriptionFrames — the keeper\'s "too" wordings are never a pick (TRAD-4 unit 10)', () => {
  it('every keeper frame kind has exactly two, and the table holds no other kind', () => {
    expect(Object.keys(TOO()).sort()).toEqual(Object.keys(PICKED()).sort());
    for (const [k, lines] of Object.entries(TOO())) expect(lines.length, k).toBe(2);
  });

  it('none stands in a pool the pick reaches', () => {
    expect(Object.keys(TOO()).length).toBeGreaterThan(0); // not vacuous
    expect(tooInReach(TOO(), PICKED())).toEqual([]);
  });

  it('RED FIRST: a "too" line planted into a picked pool is named', () => {
    const planted = { ...PICKED(), seat: [...POWER_FRAMES.seat, TOO().seat[0]] };
    expect(tooInReach(TOO(), planted)).toEqual([`seat: ${TOO().seat[0].text}`]);
  });

  it('each names its keeper, drops the presider (no {person}, no {title}), says "too" or "as well", and makes no house a subject', () => {
    const KEEPER = { owner: /\{owner\}/, seat: /\{power\}|\{Power\}/, religious: /\{power\}|\{Power\}/, merchantry: /\{power\}|\{Power\}/ };
    const bad = [];
    for (const [k, lines] of Object.entries(TOO())) {
      for (const l of lines) {
        const keeperRe = KEEPER[k] || /\{house\}/;
        if (!keeperRe.test(l.text)) bad.push(`${k}: no keeper: ${l.text}`);
        if (k === 'placePower' && !/\{power\}/.test(l.text)) bad.push(`${k}: no power: ${l.text}`);
        if (/\{person\}|\{title\}/.test(l.text)) bad.push(`${k}: a presider: ${l.text}`);
        if (!/\btoo\b|\bas well\b/.test(l.text)) bad.push(`${k}: not "too": ${l.text}`);
        if (/^\{[Hh]ouse\}/.test(l.text)) bad.push(`${k}: a house as subject: ${l.text}`);
      }
    }
    expect(bad).toEqual([]);
  });
});

/**
 * A HELD ELEMENT'S "ALSO" GLOSS (TRAD-5 unit 13; the chair's ruling (B) of 20:56 UTC and approval of 21:03 UTC, the sixteen
 * lines of docs/chair/2026-11-20/content/traditions/TRAD-5-U13-ALSO-GLOSSES.md verbatim): ELEMENT_GLOSS_ALSO holds, for every
 * element of ELEMENT_GLOSS, ONE line, read only by a rite whose element an earlier rite of the audience's own shown set
 * already holds (traditionDescription.js :: compose): never a pick (the KEEPER_FRAMES_TOO pattern), so none may stand in a
 * gloss pool. Each is one of its element's present lines with "also" before it, declaring exactly what that line declares
 * (it presumes nothing its element's lines do not); and none holds a drama, cause, outcome or keep word, "the town"/"a
 * town", or a slot (no name can enter it).
 */
const ALSO = () => /** @type {Record<string, ReadonlyArray<{ text: string }>>} */ (TABLE.ELEMENT_GLOSS_ALSO || {});
/** The "also" lines a pick could reach: any whose text stands in a gloss pool. */
const alsoInReach = (also, glosses) => Object.entries(also).flatMap(([k, lines]) => lines
  .filter((l) => Object.values(glosses).some((pool) => pool.some((g) => textOf(g) === l.text))).map((l) => `${k}: ${l.text}`));
/** The "also" lines that are not "also " + a present line of their own element, declared as that line is. */
const alsoAstray = (also, glosses) => Object.entries(also).flatMap(([k, lines]) => lines.filter((l) => {
  const source = (glosses[k] || []).find((g) => `also ${textOf(g)}` === l.text);
  return !source || JSON.stringify(atomsOf(declarationOf(l))) !== JSON.stringify(atomsOf(declarationOf(source))) || isColourLine(l) !== isColourLine(source);
}).map((l) => `${k}: ${l.text}`));
/** The lines holding a word no "also" gloss may hold. */
const alsoLoud = (texts) => texts.filter((t) => DRAMA_WORDS.test(t) || CAUSE_WORDS.test(t) || OUTCOME_WORDS.test(t)
  || /\b(kept|keep|keeps)\b/i.test(t) || /\b(the|a) town\b/i.test(t) || /\{/.test(t));

describe('traditionDescriptionFrames — a held element\'s "also" gloss is never a pick (TRAD-5 unit 13)', () => {
  it('the sixteen: one line for each element of ELEMENT_GLOSS, in its order, and no other key', () => {
    expect(Object.keys(ALSO())).toEqual(Object.keys(ELEMENT_GLOSS));
    for (const [k, lines] of Object.entries(ALSO())) expect(lines.length, k).toBe(1);
    expect(Object.values(ALSO()).flat().map(textOf)).toEqual([
      'also marks the founding', 'also honours the first boats to come ashore', 'also honours the charter',
      'also honours hearth and household', 'also marks the gathering of the harvest', 'also honours the river',
      'also honours the standing stones', 'also remembers the dead', 'also blesses the fields', 'also honours the forge',
      'also honours the market', 'also honours the hunt', 'also marks midsummer', 'also honours the tide',
      'also marks the coming of spring', 'also honours the stars',
    ]);
  });

  it('each is declared (a frozen line row), and is one of its element\'s present lines with "also" before it, declaring what that line declares', () => {
    const also = rows().filter((r) => r.home.startsWith('also.'));
    expect(also.length).toBe(16);
    expect(undeclaredIn(also)).toEqual([]);
    expect(alsoAstray(ALSO(), ELEMENT_GLOSS)).toEqual([]);
  });

  it('harvest\'s line, in its crisis-scoped pool, says its stance (crisis: any) and needs no twin', () => {
    const scoped = CRISIS_SCOPED_ELEMENTS.map((e) => [`also.${e}`, ALSO()[e] || []]);
    expect(scoped.map(([p, lines]) => [p, lines.length])).toEqual([['also.harvest', 1]]);
    expect(silentIn(scoped)).toEqual([]);
    expect(untwinned(crisisMap(scoped))).toEqual([]);
    expect(atomsOf(declarationOf(ALSO().harvest[0]))).toEqual(['crisis: any']);
  });

  it('none stands in a pool the pick reaches (ELEMENT_GLOSS)', () => {
    expect(Object.keys(ALSO()).length).toBeGreaterThan(0); // not vacuous
    expect(alsoInReach(ALSO(), ELEMENT_GLOSS)).toEqual([]);
  });

  it('none holds a drama, cause, outcome or keep word, "the town"/"a town", or a slot', () => {
    expect(Object.values(ALSO()).flat().length).toBe(16); // not vacuous
    expect(alsoLoud(Object.values(ALSO()).flat().map(textOf))).toEqual([]);
  });

  it('RED FIRST: an "also" line planted into a gloss pool, one that adds to its source, one declared wider than its source, and a loud one are each named', () => {
    const planted = { ...ELEMENT_GLOSS, river: [...ELEMENT_GLOSS.river, Object.freeze({ text: 'also honours the river', needs: ['river'] })] };
    expect(alsoInReach({ river: [{ text: 'also honours the river' }] }, planted)).toEqual(['river: also honours the river']);
    expect(alsoAstray({ river: [Object.freeze({ text: 'also honours the river and the ford', needs: ['river'] })] }, ELEMENT_GLOSS)).toEqual(['river: also honours the river and the ford']);
    expect(alsoAstray({ hunt: [Object.freeze({ text: 'also honours the hunt', needs: ['river'] })] }, ELEMENT_GLOSS)).toEqual(['hunt: also honours the hunt']);
    expect(alsoLoud(['also honours the hunt', 'also keeps the old feud', 'also honours a town'])).toEqual(['also keeps the old feud', 'also honours a town']);
  });
});

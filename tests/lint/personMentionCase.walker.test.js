/**
 * personMentionCase.walker.test.js — A LATER MENTION'S PRONOUN TAKES ITS CASE FROM A CLASSED FOLLOWER (PRONOUN, CLOSE-2
 * unit 3c, the chair's E117).
 *
 * ── THE CLASS ─────────────────────────────────────────────────────────────────────────────────────────────────────
 * `data/people/personMention.js :: secondMentions` turns a person's later mention in one sentence into a pronoun. It read
 * the subject only at a clause's head (the sentence's start, a stop mark, a listed opener), so a later mention that is
 * the subject of a clause with NO opener took the object: "Haruto Chen has asked Akemi Yang to back a candidate her
 * distrusts." Measured on the line's tip c1144ba18 over every template of the leaf's two callers (the ties,
 * `npcData.js :: STRESS_ECONOMIC_EFFECTS` and `HANDLER_TIE_ARCHETYPES`; the wants, `goalFamilies.js ::
 * GOAL_FAMILY_LINES` and `GOAL_RESERVE_LINES`): 132 later mentions, 24 of them a subject printed as the object.
 *
 * ── THE ARMS (every template with a person's slot, walked from the tables themselves, never a list) ───────────────────
 *   CLASSED   every later mention's follower is in a class (`SUBJECT_FOLLOWERS`, `OBJECT_FOLLOWERS`, or, for a follower
 *             both hold, `FOLLOWER_BY_BEFORE` with the word before it): a follower in neither is RED, "class it:
 *             <template> <follower>", so no new template can print the fault unseen;
 *   PRINTED   both genders (the first card a woman and the second a man, then the other way round): the leaf prints at
 *             each later mention the pronoun of its follower's class, the possessive before "'s" (a `THEY_BOUND` mention
 *             the next rung, here its role);
 *   THEY      (PRONOUN-THEY, CLOSE-4, the ninth chair's ruling (A) of 2026-11-23, amending its ruling of 01:55) every
 *             later mention whose clause (to the next . ; : ! ?) carries a they-form is classed BY HAND, by its template
 *             id: `THEY_BOUND` (the they-form binds the mention's own person, singular they: the mention skips the
 *             pronoun and takes the leaf's next rung, with this walk's cards the ROLE, its tail in the leaf's
 *             `NO_PRONOUN_TAILS`) or `THEY_OTHER` (it binds someone else: the pronoun stands); unclassed is RED, "class
 *             it (they): <template id> <tail>". Measured on f5fa6316a (`close-4/THEY-MEASURE.txt` on
 *             `lane/close-4-2026-11-23`): 8 later mentions in 7 templates, 2 bound, 6 other.
 * A want's person slots are all filled with ONE person (`goals.js :: personCardsOf` hands two slots of one name as one
 * card), so every person slot after the first in a sentence is walked as a later mention.
 * Each detector is proven to catch a planted case (the CONTROLS) before it is read on the tables.
 * @enforcement-walker
 */
import { describe, expect, it } from 'vitest';
import { FOLLOWER_BY_BEFORE, NO_PRONOUN_TAILS, OBJECT_FOLLOWERS, OBJECT_STOP_MARK, SUBJECT_FOLLOWERS, followerAt, secondMentions, wordBeforeAt } from '../../src/data/people/personMention.js';
import { HANDLER_TIE_ARCHETYPES, STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';
import { GOAL_FAMILY_LINES, GOAL_RESERVE_LINES } from '../../src/data/people/goalFamilies.js';

const R = 'Rhona Ashby'; const S = 'Silas Brent';
const FORMS = /** @type {const} */ ({ female: { subject: 'she', object: 'her', possessive: 'her' }, male: { subject: 'he', object: 'him', possessive: 'his' } });
const PERSON_SLOTS = ['above', 'below', 'other', 'handler', 'agent', 'target'];
const FORCE = { body: 'garrison', members: 'soldiers', member: 'soldier' };
// the leaf's own sentence split (personMention.js :: secondMentions)
const SPLIT = /((?<=[.!?…]["”')]?)\s+(?=["“'(]?\p{Lu}))/u;
/** @param {string} s */
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** a they-form (the measure's own pattern) */
const THEY = /\b(themselves|themself|theirs|their|them|they)\b/i;

/**
 * THE THEY TABLES (PRONOUN-THEY), classed by hand from the measure, by template id and the mention ('r' the first card,
 * 's' the second). BOUND: the they-form binds the mention's own person (the mention takes the next rung: the role).
 * @type {ReadonlyArray<{ id: string, who: 'r' | 's' }>}
 */
const THEY_BOUND = [
  { id: 'STRESS_ECONOMIC_EFFECTS.mutual_leverage.tension[12].line', who: 's' }, // "… would rather keep to themselves."
  { id: 'STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[8].line', who: 's' }, // "… cannot finish theirs without …"
];
/** OTHER: the they-form binds someone else (the pronoun stands), each with its five-word reason @type {ReadonlyArray<{ id: string, who: 'r' | 's', why: string }>} */
const THEY_OTHER = [
  { id: 'STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.desc[1].line', who: 'r', why: 'they binds her people, plural' },
  { id: 'STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.desc[5].line', who: 'r', why: 'them binds her people, plural' },
  { id: 'STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.desc[7].line', who: 'r', why: 'their binds her people, plural' },
  { id: 'STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[1].line', who: 's', why: 'them binds the pair together' },
  { id: 'STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[1].line', who: 'r', why: 'them binds the pair together' },
  { id: 'STRESS_ECONOMIC_EFFECTS.genuine_respect.desc[3].line', who: 's', why: 'them binds the difficult cases' },
];
/** @param {string} id @param {string} who */
const isBound = (id, who) => THEY_BOUND.some((t) => t.id === id && t.who === who);
/** @param {string} n a printed name @returns {'r' | 's'} */
const whoOf = (n) => (n === S ? 's' : 'r');
/** a card's role in this walk ("the silas"), distinct for each name @param {string} n */
const roleOf = (n) => `the ${n.split(' ')[0].toLowerCase()}`;

/**
 * The class of a later mention's follower: 'subject', 'object', or null (unclassed). @param {string} sentence
 * @param {number} start @param {number} end @returns {{ follower: string, kase: 'subject' | 'object' | null }}
 */
function classOf(sentence, start, end) {
  const follower = followerAt(sentence, end);
  if (Object.hasOwn(FOLLOWER_BY_BEFORE, follower)) {
    const before = wordBeforeAt(sentence, start);
    const byBefore = FOLLOWER_BY_BEFORE[follower];
    return { follower: `${before} ${follower}`, kase: Object.hasOwn(byBefore, before) ? byBefore[before] : null };
  }
  // the stop marks are the leaf's one regex literal (PRONOUN-2, CLOSE-5), read beside the Set's words as the leaf reads them
  return { follower, kase: SUBJECT_FOLLOWERS.has(follower) ? 'subject' : OBJECT_STOP_MARK.test(follower) || OBJECT_FOLLOWERS.has(follower) ? 'object' : null };
}

/**
 * Every later mention of `names` in a text, sentence by sentence, with its case and the text the leaf must print; and
 * every later mention whose clause carries a they-form (`they`: the mention, its tail to the they-form, the text after it).
 * @param {string} text @param {Record<string, 'female' | 'male'>} genders @param {string} [id] the template id (a
 *   `THEY_BOUND` mention takes its role in the expected text: the next rung, the pronoun skipped)
 * @returns {{ mentions: Array<{ follower: string, kase: string | null }>, expected: string, they: Array<{ who: 'r' | 's', tail: string, after: string }> }}
 */
function laterMentions(text, genders, id = '') {
  /** @type {Array<{ follower: string, kase: string | null }>} */ const mentions = [];
  /** @type {Array<{ who: 'r' | 's', tail: string, after: string }>} */ const they = [];
  const names = Object.keys(genders).sort((a, b) => b.length - a.length);
  const parts = text.split(SPLIT).map((part, i) => {
    if (i % 2 === 1) return part;
    /** @type {Array<{ n: string, start: number, end: number }>} */ const hits = [];
    for (const n of names) {
      const re = new RegExp(`(?<![\\p{L}\\p{N}])${esc(n)}(?![\\p{L}\\p{N}])`, 'gu');
      for (let m = re.exec(part); m; m = re.exec(part)) {
        const start = m.index; const end = start + n.length;
        if (!hits.some((h) => start < h.end && end > h.start)) hits.push({ n, start, end });
      }
    }
    hits.sort((a, b) => a.start - b.start);
    const seen = new Set(); let out = ''; let at = 0;
    for (const h of hits) {
      if (!seen.has(h.n)) { seen.add(h.n); continue; }
      const after = part.slice(h.end);
      const clause = after.split(/[.;:!?]/)[0]; const t = THEY.exec(clause);
      if (t) they.push({ who: whoOf(h.n), tail: clause.slice(0, t.index + t[0].length).trim(), after: after.trimStart() });
      if (t && isBound(id, whoOf(h.n))) { out += part.slice(at, h.start) + roleOf(h.n); at = h.end; continue; }
      const forms = FORMS[genders[h.n]];
      if (/^['’]s(?![\p{L}\p{N}])/u.test(part.slice(h.end))) { out += part.slice(at, h.start) + forms.possessive; at = h.end + 2; continue; }
      const c = classOf(part, h.start, h.end);
      mentions.push(c);
      out += part.slice(at, h.start) + (c.kase === 'subject' ? forms.subject : forms.object);
      at = h.end;
    }
    return out + part.slice(at);
  });
  return { mentions, expected: parts.join(''), they };
}

/**
 * The walk's two detectors over one template text: an unclassed follower; a printed pronoun off its class.
 * @param {string} id @param {string} template the template as a reader of the table writes it @param {string} text
 * @param {Array<Record<string, 'female' | 'male'>>} castings @param {(g: Record<string, 'female' | 'male'>) => any[]} cardsOf
 * @returns {{ mentions: number, unclassed: string[], misprinted: string[] }}
 */
function judge(id, template, text, castings, cardsOf) {
  /** @type {string[]} */ const unclassed = []; /** @type {string[]} */ const misprinted = [];
  let mentions = 0;
  castings.forEach((genders, i) => {
    const { mentions: ms, expected } = laterMentions(text, genders, id);
    if (i === 0) { mentions += ms.length; for (const m of ms) if (!m.kase) unclassed.push(`class it: ${template} ${m.follower}`); }
    const printed = secondMentions(text, cardsOf(genders));
    if (printed !== expected) misprinted.push(`${id} (${Object.values(genders).join('/')}): ${printed}  ≠  ${expected}`);
  });
  return { mentions, unclassed, misprinted };
}

/**
 * THE THEY ARM over one template text: an unclassed they-form mention; a `THEY_BOUND` mention not printed by the next
 * rung (its role), or its tail not in `NO_PRONOUN_TAILS`. @param {string} id @param {string} text
 * @param {Array<Record<string, 'female' | 'male'>>} castings @param {(g: Record<string, 'female' | 'male'>) => any[]} cardsOf
 * @param {(t: string, cards: any[]) => string} [leaf] the leaf read (a CONTROL plants another)
 * @returns {{ met: string[], unclassed: string[], unbound: string[] }}
 */
function judgeThey(id, text, castings, cardsOf, leaf = secondMentions) {
  /** @type {string[]} */ const met = []; /** @type {string[]} */ const unclassed = []; /** @type {string[]} */ const unbound = [];
  for (const { who, tail, after } of laterMentions(text, castings[0], id).they) {
    met.push(`${id} ${who}`);
    const classed = isBound(id, who) || THEY_OTHER.some((t) => t.id === id && t.who === who);
    if (!classed) { unclassed.push(`class it (they): ${id} ${tail}`); continue; }
    if (!isBound(id, who)) continue;
    const role = roleOf(who === 's' ? S : R);
    if (![...NO_PRONOUN_TAILS].some((k) => after.startsWith(k))) unbound.push(`${id}: the tail is not in NO_PRONOUN_TAILS: ${tail}`);
    for (const genders of castings) {
      const printed = leaf(text, cardsOf(genders));
      if (!printed.includes(`${role} ${tail}`)) unbound.push(`${id} (${Object.values(genders).join('/')}): ${printed}  — not "${role} ${tail}"`);
    }
  }
  return { met, unclassed, unbound };
}

/** the ties: each line (and twin) of each kind's desc and tension, drawn and reserve (`pairProse`'s own `lines`) */
function tieTemplates() {
  /** @type {Array<{ id: string, text: string }>} */ const out = [];
  for (const [tableName, table] of /** @type {Array<[string, Record<string, any>]>} */ ([['STRESS_ECONOMIC_EFFECTS', STRESS_ECONOMIC_EFFECTS], ['HANDLER_TIE_ARCHETYPES', HANDLER_TIE_ARCHETYPES]])) {
    for (const [key, row] of Object.entries(table)) for (const field of ['desc', 'tension']) {
      (row[field]?.lines || []).forEach((/** @type {any} */ v, /** @type {number} */ i) => {
        for (const [which, fn] of /** @type {Array<[string, any]>} */ ([['line', typeof v === 'function' ? v : v?.line], ['twin', v?.twin]])) {
          if (typeof fn === 'function') out.push({ id: `${tableName}.${key}.${field}[${i}].${which}`, text: fn({ name: R }, { name: S }, FORCE) });
        }
      });
    }
  }
  return out;
}

/** the wants: every line of every cell, drawn and reserve, that names a person's slot */
function wantTemplates() {
  /** @type {Array<{ id: string, template: string }>} */ const out = [];
  /** @param {any} node @param {string} path */
  const walk = (node, path) => {
    if (Array.isArray(node)) { node.forEach((n, i) => walk(n, `${path}[${i}]`)); return; }
    const tpl = typeof node === 'string' ? node : typeof node?.line === 'string' ? node.line : typeof node?.text === 'string' ? node.text : null;
    if (tpl !== null) { if (PERSON_SLOTS.some((k) => tpl.includes(`{${k}}`))) out.push({ id: path, template: tpl }); return; }
    if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
  };
  walk(GOAL_FAMILY_LINES, 'GOAL_FAMILY_LINES'); walk(GOAL_RESERVE_LINES, 'GOAL_RESERVE_LINES');
  return out;
}
/** a want's line as `goals.js :: cellCandidates` fills it: every person slot ONE person, every other slot a word @param {string} tpl */
const fillWant = (tpl) => { const t = tpl.replace(/\{(\w+)(?:\|[^}]*)?\}/g, (_w, k) => (PERSON_SLOTS.includes(k) ? R : 'Xpower')); return t[0].toUpperCase() + t.slice(1); };

const PAIR = /** @type {Array<Record<string, 'female' | 'male'>>} */ ([{ [R]: 'female', [S]: 'male' }, { [R]: 'male', [S]: 'female' }]);
const ONE = /** @type {Array<Record<string, 'female' | 'male'>>} */ ([{ [R]: 'female' }, { [R]: 'male' }]);
/** @param {Record<string, 'female' | 'male'>} g */
const cardsFor = (g) => Object.entries(g).map(([name, gender]) => ({ name, gender, role: roleOf(name) }));

describe('the CONTROLS: each detector catches its planted case', () => {
  it('CLASSED: a follower in neither class is red, named with its template', () => {
    const planted = `${S} has asked ${R} for a word ${R} hesitates to give.`;
    expect(judge('planted', '{s} has asked {r} for a word {r} hesitates to give.', planted, PAIR, cardsFor).unclassed)
      .toEqual(['class it: {s} has asked {r} for a word {r} hesitates to give. hesitates']);
    const ambiguous = `${S} has asked ${R} for a word ${R} would never give.`;
    expect(judge('planted', 'a word {r} would', ambiguous, PAIR, cardsFor).unclassed).toEqual(['class it: a word {r} would word would']);
    // PRONOUN-2 (CLOSE-5): each of the six stop marks is classed object (the leaf's `OBJECT_STOP_MARK`), and only those six
    for (const mark of [',', '.', ';', ':', '!', '?']) expect(classOf(`${R}${mark}`, 0, R.length)).toEqual({ follower: mark, kase: 'object' });
    for (const mark of ['—', '…', '"', ')']) expect(classOf(`${R}${mark}`, 0, R.length)).toEqual({ follower: mark, kase: null });
  });
  it('PRINTED: a leaf that prints the object where the class is the subject is red, both genders', () => {
    const text = `${S} has asked ${R} to back a candidate ${R} distrusts.`;
    expect(judge('found', '', text, PAIR, cardsFor).misprinted).toEqual([]);
    const objectLeaf = (/** @type {string} */ t, /** @type {any[]} */ cards) => secondMentions(t, cards).replace(/\b(she|he) distrusts/, (_w, p) => `${p === 'she' ? 'her' : 'him'} distrusts`);
    const { expected } = laterMentions(text, PAIR[0]);
    expect(objectLeaf(text, cardsFor(PAIR[0]))).not.toBe(expected);
    expect(expected).toBe(`${S} has asked ${R} to back a candidate she distrusts.`);
  });
  it('THEY: an unclassed later mention with a they-form in its clause is red, named with its template id and tail', () => {
    const planted = `${S} has asked ${R} for a favour ${R} would rather hide themselves.`;
    expect(judgeThey('planted', planted, PAIR, cardsFor).unclassed).toEqual(['class it (they): planted would rather hide themselves']);
  });
  it('THEY: a leaf with the tail set emptied prints the pronoun at a THEY_BOUND mention, and that is red', () => {
    const id = THEY_BOUND[0].id;
    const text = `${R} has asked ${S} for an introduction ${S} would rather keep to themselves.`;
    expect(judgeThey(id, text, PAIR, cardsFor).unbound).toEqual([]);
    // the leaf as if `NO_PRONOUN_TAILS` were empty: each listed tail's last letter masked, so no tail is met, then restored
    const MASK = '\uE000';
    const emptiedLeaf = (/** @type {string} */ t, /** @type {any[]} */ cards) => {
      let masked = t; for (const k of NO_PRONOUN_TAILS) masked = masked.replaceAll(k, k.slice(0, -1) + MASK);
      let out = secondMentions(masked, cards); for (const k of NO_PRONOUN_TAILS) out = out.replaceAll(k.slice(0, -1) + MASK, k);
      return out;
    };
    expect(emptiedLeaf(text, cardsFor(PAIR[0]))).toBe(`${R} has asked ${S} for an introduction he would rather keep to themselves.`);
    expect(judgeThey(id, text, PAIR, cardsFor, emptiedLeaf).unbound).toHaveLength(2);
  });
});

describe('every template with a person\'s slot (the ties and the wants)', () => {
  it('the walk reads the tables: ties and wants, with later mentions in both', () => {
    const ties = tieTemplates(); const wants = wantTemplates();
    expect(ties.length).toBeGreaterThan(300);
    expect(wants.length).toBeGreaterThan(100);
    const tieMentions = ties.reduce((n, t) => n + laterMentions(t.text, PAIR[0]).mentions.length, 0);
    const wantMentions = wants.reduce((n, w) => n + laterMentions(fillWant(w.template), ONE[0]).mentions.length, 0);
    expect(tieMentions).toBeGreaterThan(0);
    expect(wantMentions).toBeGreaterThan(0);
  });

  it('CLASSED + PRINTED: the ties (npcData.js :: STRESS_ECONOMIC_EFFECTS, HANDLER_TIE_ARCHETYPES)', () => {
    /** @type {string[]} */ const unclassed = []; /** @type {string[]} */ const misprinted = [];
    for (const { id, text } of tieTemplates()) {
      const j = judge(id, text.replaceAll(R, '{r}').replaceAll(S, '{s}'), text, PAIR, cardsFor);
      unclassed.push(...j.unclassed); misprinted.push(...j.misprinted);
    }
    expect(unclassed).toEqual([]);
    expect(misprinted).toEqual([]);
  });

  it('THEY: every later mention with a they-form in its clause is classed by template id; a THEY_BOUND mention takes the next rung, not the pronoun (ties and wants, both genders)', () => {
    /** @type {string[]} */ const met = []; /** @type {string[]} */ const unclassed = []; /** @type {string[]} */ const unbound = [];
    const walked = [
      ...tieTemplates().map(({ id, text }) => judgeThey(id, text, PAIR, cardsFor)),
      ...wantTemplates().map(({ id, template }) => judgeThey(id, fillWant(template), ONE, cardsFor)),
    ];
    for (const j of walked) { met.push(...j.met); unclassed.push(...j.unclassed); unbound.push(...j.unbound); }
    expect(unclassed).toEqual([]);
    expect(unbound).toEqual([]);
    // every hand-classed row is met by the walk (a table row no template carries is stale)
    expect([...THEY_BOUND, ...THEY_OTHER].map((t) => `${t.id} ${t.who}`).sort()).toEqual([...met].sort());
    expect(met).toHaveLength(8);
  });

  it('CLASSED + PRINTED: the wants (goalFamilies.js :: GOAL_FAMILY_LINES, GOAL_RESERVE_LINES)', () => {
    /** @type {string[]} */ const unclassed = []; /** @type {string[]} */ const misprinted = [];
    for (const { id, template } of wantTemplates()) {
      const j = judge(id, template, fillWant(template), ONE, cardsFor);
      unclassed.push(...j.unclassed); misprinted.push(...j.misprinted);
    }
    expect(unclassed).toEqual([]);
    expect(misprinted).toEqual([]);
  });
});

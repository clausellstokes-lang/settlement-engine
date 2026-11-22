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
 *             each later mention the pronoun of its follower's class, the possessive before "'s".
 * A want's person slots are all filled with ONE person (`goals.js :: personCardsOf` hands two slots of one name as one
 * card), so every person slot after the first in a sentence is walked as a later mention.
 * Each detector is proven to catch a planted case (the CONTROLS) before it is read on the tables.
 * @enforcement-walker
 */
import { describe, expect, it } from 'vitest';
import { FOLLOWER_BY_BEFORE, OBJECT_FOLLOWERS, SUBJECT_FOLLOWERS, followerAt, secondMentions, wordBeforeAt } from '../../src/data/people/personMention.js';
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
  return { follower, kase: SUBJECT_FOLLOWERS.has(follower) ? 'subject' : OBJECT_FOLLOWERS.has(follower) ? 'object' : null };
}

/**
 * Every later mention of `names` in a text, sentence by sentence, with its case and the text the leaf must print.
 * @param {string} text @param {Record<string, 'female' | 'male'>} genders
 * @returns {{ mentions: Array<{ follower: string, kase: string | null }>, expected: string }}
 */
function laterMentions(text, genders) {
  /** @type {Array<{ follower: string, kase: string | null }>} */ const mentions = [];
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
      const forms = FORMS[genders[h.n]];
      if (/^['’]s(?![\p{L}\p{N}])/u.test(part.slice(h.end))) { out += part.slice(at, h.start) + forms.possessive; at = h.end + 2; continue; }
      const c = classOf(part, h.start, h.end);
      mentions.push(c);
      out += part.slice(at, h.start) + (c.kase === 'subject' ? forms.subject : forms.object);
      at = h.end;
    }
    return out + part.slice(at);
  });
  return { mentions, expected: parts.join('') };
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
    const { mentions: ms, expected } = laterMentions(text, genders);
    if (i === 0) { mentions += ms.length; for (const m of ms) if (!m.kase) unclassed.push(`class it: ${template} ${m.follower}`); }
    const printed = secondMentions(text, cardsOf(genders));
    if (printed !== expected) misprinted.push(`${id} (${Object.values(genders).join('/')}): ${printed}  ≠  ${expected}`);
  });
  return { mentions, unclassed, misprinted };
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
const cardsFor = (g) => Object.entries(g).map(([name, gender]) => ({ name, gender, role: `the ${name.split(' ')[0].toLowerCase()}` }));

describe('the CONTROLS: each detector catches its planted case', () => {
  it('CLASSED: a follower in neither class is red, named with its template', () => {
    const planted = `${S} has asked ${R} for a word ${R} hesitates to give.`;
    expect(judge('planted', '{s} has asked {r} for a word {r} hesitates to give.', planted, PAIR, cardsFor).unclassed)
      .toEqual(['class it: {s} has asked {r} for a word {r} hesitates to give. hesitates']);
    const ambiguous = `${S} has asked ${R} for a word ${R} would never give.`;
    expect(judge('planted', 'a word {r} would', ambiguous, PAIR, cardsFor).unclassed).toEqual(['class it: a word {r} would word would']);
  });
  it('PRINTED: a leaf that prints the object where the class is the subject is red, both genders', () => {
    const text = `${S} has asked ${R} to back a candidate ${R} distrusts.`;
    expect(judge('found', '', text, PAIR, cardsFor).misprinted).toEqual([]);
    const objectLeaf = (/** @type {string} */ t, /** @type {any[]} */ cards) => secondMentions(t, cards).replace(/\b(she|he) distrusts/, (_w, p) => `${p === 'she' ? 'her' : 'him'} distrusts`);
    const { expected } = laterMentions(text, PAIR[0]);
    expect(objectLeaf(text, cardsFor(PAIR[0]))).not.toBe(expected);
    expect(expected).toBe(`${S} has asked ${R} to back a candidate she distrusts.`);
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

/**
 * tests/generators/tieLinePronouns.test.js — GOALS-4 builder 11 (the chair's rulings of 2026-11-20 20:13 and 20:27 UTC):
 * A TIE LINE'S SECOND MENTION NEVER LEAVES AN OBJECT PRONOUN AS A VERB'S SUBJECT. NAMES-1 (`data/people/personMention.js ::
 * secondMentions`) writes a card's later mention in one sentence as a pronoun where the two cards differ in gender; a line
 * that names a card a second time as the SUBJECT of a relative clause after a noun ("an introduction <B> would rather
 * keep to themselves") took the object form there ("an introduction him would rather keep to themselves"), and its
 * "themselves" was left standing for a name that is now a pronoun.
 *
 * Every tie line of the eighteen archetypes in `STRESS_ECONOMIC_EFFECTS` (`npcData.js`) is rendered, head and reserve,
 * both fields, every index up to `size`, through the pool's own call (`archetype.desc(r, s, i)`), for a pair of each sex
 * (male/male, male/female, female/male, female/female). Two assertions:
 *   (1) no object pronoun stands before a finite verb (the closed list below);
 *   (2) no pronoun that stands where a name stood is followed, in its sentence, by "themselves".
 * A pronoun "stands where a name stood" where the same line rendered for the same pair WITHOUT genders (so NAMES-1 writes
 * the surname) has a word that the gendered render writes as a pronoun.
 *
 * @enforced-by npx vitest run tests/generators/tieLinePronouns.test.js
 */
import { describe, expect, it } from 'vitest';
import { STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';

/** Four cards: two of each sex, each with a surname no other card carries (so a same-sex pair's second mention is a surname). */
const MALE_A = Object.freeze({ id: 'm-a', name: 'Aldric Venn', gender: 'male' });
const MALE_B = Object.freeze({ id: 'm-b', name: 'Bram Holt', gender: 'male' });
const FEMALE_A = Object.freeze({ id: 'f-a', name: 'Cora Lisle', gender: 'female' });
const FEMALE_B = Object.freeze({ id: 'f-b', name: 'Dena Marsh', gender: 'female' });
/** The four pairs, by sex, in the tie's own order (r, s). */
const PAIRS = Object.freeze([
  ['male/male', MALE_A, MALE_B],
  ['male/female', MALE_A, FEMALE_A],
  ['female/male', FEMALE_A, MALE_A],
  ['female/female', FEMALE_A, FEMALE_B],
]);

/**
 * THE CLOSED LIST: the object pronouns, and the finite verbs none of them may stand before as its subject. "them" after a
 * preposition heads no clause ("both of them have", "whatever broke between them is"), so it is read only elsewhere.
 */
const OBJECT_PRONOUNS = Object.freeze(['him', 'her', '(?<!\\b(?:of|between|among|with|to|for|from)\\s)them']);
const FINITE_VERBS = Object.freeze(['would', 'will', 'shall', 'should', 'could', 'can', 'may', 'might', 'must',
  'has', 'have', 'had', 'is', 'are', 'was', 'were', 'does', 'do', 'did']);
const OBJECT_BEFORE_VERB = new RegExp(`\\b(?:${OBJECT_PRONOUNS.join('|')})\\s+(?:${FINITE_VERBS.join('|')})\\b`, 'i');
/** The pronouns NAMES-1 writes for a later mention. */
const MENTION_PRONOUNS = Object.freeze(new Set(['he', 'she', 'him', 'her', 'his']));

/** A card without its gender: NAMES-1 then writes a later mention as its surname. @param {any} c */
const ungendered = (c) => ({ id: c.id, name: c.name });
/** A word without its punctuation, lower-cased. @param {string} w */
const bare = (w) => w.replace(/[^\p{L}]/gu, '').toLowerCase();

/**
 * Whether a pronoun that stands where a name stood is followed in its sentence by "themselves".
 * @param {string} gendered the line rendered for the gendered pair @param {string} neutral the same line for the pair ungendered
 */
const pronounThenThemselves = (gendered, neutral) => {
  const g = gendered.split(/\s+/), n = neutral.split(/\s+/);
  if (g.length !== n.length) return true; // a second mention that changed the word count: fail loud, to be read
  for (let k = 0; k < g.length; k++) {
    if (g[k] === n[k] || !MENTION_PRONOUNS.has(bare(g[k]))) continue;
    for (let j = k + 1; j < g.length; j++) {
      if (bare(g[j]) === 'themselves') return true;
      if (/[.!?]["”')]?$/.test(g[j])) break; // the sentence ends
    }
  }
  return false;
};

/** Every tie line of the eighteen archetypes, rendered for each pair: `{ where, gendered, neutral }`. */
const renders = () => {
  /** @type {Array<{ where: string, gendered: string, neutral: string }>} */
  const out = [];
  for (const [key, archetype] of Object.entries(STRESS_ECONOMIC_EFFECTS)) {
    for (const field of /** @type {const} */ (['desc', 'tension'])) {
      const pool = archetype[field];
      for (let i = 0; i < pool.size; i++) {
        for (const [sexes, r, s] of PAIRS) {
          out.push({
            where: `${key}.${field}#${i}${i >= pool.head ? ' (reserve)' : ''} [${sexes}]`,
            gendered: pool(r, s, i),
            neutral: pool(ungendered(r), ungendered(s), i),
          });
        }
      }
    }
  }
  return out;
};

describe('a tie line\'s second mention never leaves an object pronoun as a subject (GOALS-4 builder 11)', () => {
  it('renders every tie line of the eighteen archetypes, head and reserve, both fields, for four pairs', () => {
    expect(Object.keys(STRESS_ECONOMIC_EFFECTS)).toHaveLength(18);
    const want = Object.values(STRESS_ECONOMIC_EFFECTS).reduce((n, a) => n + (a.desc.size + a.tension.size) * PAIRS.length, 0);
    const got = renders();
    expect(got).toHaveLength(want);
    for (const { where, gendered } of got) expect(typeof gendered === 'string' && gendered.length > 0, `${where}: a line`).toBe(true);
  });

  it('no object pronoun stands before a finite verb', () => {
    const offenders = renders().filter(({ gendered }) => OBJECT_BEFORE_VERB.test(gendered)).map(({ where, gendered }) => `${where}: ${gendered}`);
    expect(offenders).toEqual([]);
  });

  it('no pronoun standing where a name stood is followed by "themselves"', () => {
    const offenders = renders().filter(({ gendered, neutral }) => pronounThenThemselves(gendered, neutral)).map(({ where, gendered }) => `${where}: ${gendered}`);
    expect(offenders).toEqual([]);
  });
});

/**
 * tests/lint/decreeCause.walker.test.js — THE DECREE CAUSE WALKER (EM-E2; ARCH's
 * instrument 4 — *"every applied decree carries a chronicle line with a cause; overrides
 * carry `overrode`"*; design §16 and §19 ruling 2 for the vocabulary).
 *
 * THE LAW, IN TWO HALVES.
 *   (a) EVERY AUTHORED LINE DECLARES ITS CAUSE, from a closed vocabulary of two. A
 *       sentence that does not say whose hand it can speak for is a sentence the reader
 *       will put in the wrong mouth, and design §16's ruling — a party-caused line reads
 *       "by the party's hand" — is only enforceable if the corpus is partitioned by that
 *       word rather than by a habit.
 *   (b) NO LINE IS FREE TEXT. The pools are the only place a reader-facing decree
 *       sentence is spelled, so `decreeProse.js` must hold none. The failure this exists
 *       for is the innocent fallback: one `return 'A decree was recorded.'` on a path
 *       nobody draws through, and the chronicle has a sentence no corpus governs, no
 *       voice walker measured and no author wrote.
 *
 * ⛔ EVERY ARM DRIVES THE LIVE PREDICATE AND EVERY NEGATIVE CARRIES A MUTANT THAT MUST
 * FIRE. A census of a corpus is the easiest instrument to make vacuous — report `[]`,
 * report a clean bill, be believed — so each law below is a pure function of a corpus or
 * a source, the real thing is passed to it, and a BENT COPY is passed to the same
 * function and must be convicted. Nothing on disk is mutated by any arm here.
 *
 * ⛔ WHY THE FREE-TEXT SCAN IS A PARSE AND NOT A GREP. A line regex reads a token inside
 * a docblock, a `@param` tag or a regex literal as a string, and this file's leaf is
 * mostly docblock. `espree` is the parser the estate already scans literals with
 * (tests/lint/rawColorLiteral.test.js, tests/helpers/jsxLiteralWalk.js, the voice
 * walker's own counter), and comments are not literals to it, which is the whole of why
 * the scan can be exact instead of allowlisted.
 *
 * @enforced-by npx vitest run tests/lint/decreeCause.walker.test.js
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'espree';
import { describe, expect, it } from 'vitest';

import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { GUARD_KINDS } from '../../src/domain/edit/guards.js';
import {
  DECREE_FORMS, decreeChronicleLine, decreeLineParts,
} from '../../src/domain/display/stateProse/decreeProse.js';
import {
  DECREE_LINE_CAUSES, DECREE_PROSE_BLOCKS,
} from '../../src/domain/display/stateProse/decreeProsePools.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const READER_REL = 'src/domain/display/stateProse/decreeProse.js';
const POOLS_REL = 'src/domain/display/stateProse/decreeProsePools.js';

/** Design §20.3's statuses and EM-C1 §6's authors, the two vocabularies the pools key on. */
const STATUSES = ['applied', 'pending', 'withdrawn'];
const AUTHORS = ['dm', 'guard', 'surveyor'];

/**
 * Every string literal a source really holds — template quasis included, interpolation
 * holes and comments excluded, because a hole is an expression and a comment is a note.
 * @param {string} source @returns {string[]}
 */
function stringLiterals(source) {
  /** @type {string[]} */
  const out = [];
  const ast = parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
  /** @param {unknown} node */
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(visit); return; }
    const row = /** @type {Record<string, any>} */ (node);
    if (typeof row.type !== 'string') return;
    if (row.type === 'Literal' && typeof row.value === 'string') out.push(row.value);
    if (row.type === 'TemplateLiteral') {
      for (const quasi of row.quasis) out.push(String(quasi.value.cooked ?? quasi.value.raw));
    }
    for (const key of Object.keys(row)) {
      if (key === 'loc' || key === 'range' || key === 'parent') continue;
      visit(row[key]);
    }
  };
  visit(ast);
  return out;
}

/**
 * THE SENTENCE PREDICATE. A reader-facing sentence has two words in it; a pool key, an
 * op stage, a block id, a type name and an id prefix do not. Deliberately blunt in the
 * SAFE direction: `', '` and `' '` are joins and match nothing, while "the town" matches,
 * so a leaf that grew one sentence is convicted and a leaf that grew a hyphenated key is
 * not. @param {string} text
 */
const isSentence = (text) => /[A-Za-z]\s+[A-Za-z]/.test(text);

/** @param {string} rel @returns {string[]} */
const sentenceLiteralsOf = (rel) => stringLiterals(readFileSync(join(ROOT, rel), 'utf8')).filter(isSentence);

/**
 * THE CAUSE LAW, as a pure function of a corpus so every mutant below drives the very
 * code the live arm drives.
 * @param {Record<string, Record<string, ReadonlyArray<object>>>} blocks
 * @returns {string[]} one message per offending variant
 */
function causeProblems(blocks) {
  /** @type {string[]} */
  const problems = [];
  for (const [blockId, block] of Object.entries(blocks)) {
    for (const [poolKey, pool] of Object.entries(block)) {
      for (const variant of pool) {
        const at = `${blockId}::${poolKey}::vid ${/** @type {any} */ (variant).vid}`;
        const causes = /** @type {any} */ (variant).causes;
        if (!Array.isArray(causes) || causes.length === 0) {
          problems.push(`${at} declares no cause`);
          continue;
        }
        for (const cause of causes) {
          if (!DECREE_LINE_CAUSES.includes(cause)) problems.push(`${at} names a cause outside the vocabulary: ${String(cause)}`);
        }
        const text = /** @type {any} */ (variant).text;
        if (typeof text !== 'string' || !isSentence(text)) problems.push(`${at} carries no authored sentence`);
      }
    }
  }
  return problems.sort(compareCodepoint);
}

/**
 * THE TOTALITY LAW: a pool that cannot speak for one of the causes makes a cell of the
 * status-by-provenance-by-form cross fall silent for that cause alone, which is the
 * hardest kind of gap to see from a green suite.
 * @param {Record<string, Record<string, ReadonlyArray<object>>>} blocks
 * @returns {string[]}
 */
function silentPools(blocks) {
  /** @type {string[]} */
  const problems = [];
  for (const [blockId, block] of Object.entries(blocks)) {
    for (const [poolKey, pool] of Object.entries(block)) {
      for (const cause of DECREE_LINE_CAUSES) {
        const speaks = pool.some((variant) => (/** @type {any} */ (variant).causes || []).includes(cause));
        if (!speaks) problems.push(`${blockId}::${poolKey} is silent for ${cause}`);
      }
    }
  }
  return problems.sort(compareCodepoint);
}

/** A bent copy of the corpus: one variant of one pool replaced. @param {object} patch */
function bend(blockId, poolKey, index, patch) {
  const blocks = {};
  for (const [id, block] of Object.entries(DECREE_PROSE_BLOCKS)) {
    blocks[id] = {};
    for (const [key, pool] of Object.entries(block)) {
      blocks[id][key] = id === blockId && key === poolKey
        ? pool.map((variant, i) => (i === index ? { ...variant, ...patch } : variant))
        : pool;
    }
  }
  return blocks;
}

/**
 * Every authored template as the pattern its FILLED rendering must match. A slot stands
 * for a name the caller resolved, so it becomes a wildcard and everything around it stays
 * exact: a sentence that lost a word, gained one, or came from nowhere fails all of them.
 * @type {RegExp[]}
 */
const TEMPLATES = Object.values(DECREE_PROSE_BLOCKS)
  .flatMap((block) => Object.values(block))
  .flatMap((pool) => pool.map((variant) => /** @type {any} */ (variant).text))
  .filter((text) => text.includes('{'))
  .map((text) => new RegExp(`^${text
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\\\{[a-z]+\\\}/g, '.+')}$`));

/** One well-formed entry, for the execution arms. @param {object} over */
const entryOf = (over = {}) => ({
  id: 'd1', status: 'applied', addedBy: 'dm', orderIndex: 0, orderedAt: 's1',
  appliedAt: 's2', tickRef: 't1',
  op: { type: 'add-npc', target: { kind: 'settlement', id: 's1' }, stage: 'home', payload: {} },
  ...over,
});

describe('the decree cause walker — every authored line declares its cause', () => {
  it('the corpus is sound: every variant names a cause from the closed vocabulary and carries a sentence', () => {
    expect(causeProblems(DECREE_PROSE_BLOCKS)).toEqual([]);
    // NON-VACUOUS: the corpus really was walked, and it is not two rows deep.
    const counted = Object.values(DECREE_PROSE_BLOCKS)
      .flatMap((block) => Object.values(block)).reduce((n, pool) => n + pool.length, 0);
    expect(counted, 'the authored variant count this walker stands over').toBe(51);
    expect(DECREE_LINE_CAUSES, 'and the vocabulary is design §16\'s two').toEqual(['party', 'table']);
  });

  it('⛔ THE MUTANTS: an undeclared, an empty, an unknown and a non-list cause are each convicted', () => {
    expect(causeProblems(bend('DEC-HAND', 'dm', 0, { causes: undefined })))
      .toEqual(['DEC-HAND::dm::vid 1 declares no cause']);
    expect(causeProblems(bend('DEC-STANDING', 'pending', 1, { causes: [] })))
      .toEqual(['DEC-STANDING::pending::vid 20 declares no cause']);
    expect(causeProblems(bend('DEC-FORM', 'home', 2, { causes: ['oracle'] })))
      .toEqual(['DEC-FORM::home::vid 27 names a cause outside the vocabulary: oracle']);
    expect(causeProblems(bend('DEC-OVERRIDE', 'totality', 0, { causes: 'table' })))
      .toEqual(['DEC-OVERRIDE::totality::vid 46 declares no cause']);
    // A cause list that is half right is half convicted, one message per bad word.
    expect(causeProblems(bend('DEC-FOLLOWS', '*', 0, { causes: ['table', 'the stars'] })))
      .toEqual(['DEC-FOLLOWS::*::vid 49 names a cause outside the vocabulary: the stars']);
  });

  it('every pool speaks for every cause, so no cell of the cross falls silent', () => {
    expect(silentPools(DECREE_PROSE_BLOCKS)).toEqual([]);
    // ⛔ THE MUTANT: strip the party sentences from one hand pool and the gap is named.
    const stripped = bend('DEC-HAND', 'guard', 3, { causes: ['table'] });
    stripped['DEC-HAND'].guard = stripped['DEC-HAND'].guard.map((v) => ({ ...v, causes: ['table'] }));
    expect(silentPools(stripped)).toEqual(['DEC-HAND::guard is silent for party']);
  });
});

describe('the decree cause walker — no line is free text', () => {
  it('the reader spells no sentence of its own: every word a reader sees comes from the pools', () => {
    expect(sentenceLiteralsOf(READER_REL)).toEqual([]);
    // ⛔ THE CONTROL, so the scan is not simply blind. The pools file is nothing BUT
    // sentences, and the detector finds them all.
    expect(sentenceLiteralsOf(POOLS_REL).length, 'the detector sees authored sentences').toBe(51);
    // ⛔ THE PLANT, in the only form this arm can take without writing to the tree: the
    // innocent fallback, run through the same parser and the same predicate.
    const planted = [
      'export function line(entry) {',
      "  if (!entry) return 'A decree was recorded.';",
      "  return entry.id + ':' + 'off-stage';",
      '}',
    ].join('\n');
    expect(stringLiterals(planted).filter(isSentence)).toEqual(['A decree was recorded.']);
    // And the keys the leaf legitimately spells are NOT sentences, which is what keeps the
    // predicate from being a path exemption wearing a regex.
    expect(['off-stage', 'off-stage-phantom', 'DEC-HAND', 'follows-from', 'decree:', ', ', ' ']
      .filter(isSentence)).toEqual([]);
    // A comment is not a literal, so the leaf's docblock cannot mute or trip this arm.
    expect(stringLiterals('// the town is quiet\nconst a = 1;\n').filter(isSentence)).toEqual([]);
  });

  it('every sentence the reader can render is an authored member of the pool it names', () => {
    const authored = new Set(Object.values(DECREE_PROSE_BLOCKS)
      .flatMap((block) => Object.values(block))
      .flatMap((pool) => pool.map((variant) => /** @type {any} */ (variant).text)));
    const drawn = new Set();
    const guards = GUARD_KINDS.map((kind, i) => ({ id: `g${i}`, kind }));
    for (const status of STATUSES) {
      for (const addedBy of AUTHORS) {
        for (const form of DECREE_FORMS) {
          for (const cause of DECREE_LINE_CAUSES) {
            for (let seed = 0; seed < 40; seed += 1) {
              const entry = entryOf({
                status,
                addedBy,
                op: {
                  type: 'declare-war',
                  stage: form === 'home' ? 'home' : 'off-stage',
                  target: { kind: form === 'off-stage-phantom' ? 'phantom' : 'settlement', id: 'x' },
                  payload: {},
                },
                overrode: guards.map((guard) => guard.id),
                followsFrom: ['d0'],
              });
              for (const part of decreeLineParts(entry, null, {
                seed: `s${seed}`, cause, overrodeGuards: guards,
                registry: [{ id: 'd0', chronicleRef: 'decree:d0' }],
              })) drawn.add(part.text);
            }
          }
        }
      }
    }
    // EVERY DRAWN SENTENCE IS AUTHORED. A filled slot makes the rendered text differ from
    // its template, so the test is "one authored template renders to this" rather than
    // string equality — a fill is a name, and a name was never the corpus's word.
    expect([...drawn].filter((text) => !authored.has(text)
      && !TEMPLATES.some((rx) => rx.test(text)))).toEqual([]);
    // ⛔ AND THE CORPUS IS REACHABLE: a sentence no seed can draw is a sentence nobody
    // reviews and nobody reads, which is the other half of "the pools are the corpus".
    const unreachable = [...authored].filter((text) => !drawn.has(text)
      && !text.includes('{'));
    expect(unreachable, 'every slotless authored sentence is reachable by some seed').toEqual([]);
  });
});

describe('the decree cause walker — a line carries its cause, and an override carries its guard', () => {
  it('every applied decree renders a line whose cause is in the closed vocabulary', () => {
    for (const addedBy of AUTHORS) {
      for (const form of DECREE_FORMS) {
        for (const cause of DECREE_LINE_CAUSES) {
          const line = decreeChronicleLine(entryOf({
            addedBy,
            op: {
              type: 'declare-war',
              stage: form === 'home' ? 'home' : 'off-stage',
              target: { kind: form === 'off-stage-phantom' ? 'phantom' : 'settlement', id: 'x' },
              payload: {},
            },
          }), null, { seed: 'a', cause });
          expect(line, `${addedBy}/${form}/${cause}`).toBeTruthy();
          expect(DECREE_LINE_CAUSES.includes(line.cause), `${addedBy}/${form}/${cause}`).toBe(true);
          expect(line.prose.length).toBeGreaterThan(40);
        }
      }
    }
  });

  it('an entry that overrode a guard names that guard\'s kind, and one that overrode none names no kind', () => {
    for (const kind of GUARD_KINDS) {
      const line = decreeChronicleLine(
        entryOf({ overrode: ['g0'] }), null,
        { seed: 'a', overrodeGuards: [{ id: 'g0', kind }] },
      );
      expect(line.prose.includes(kind), `${kind} is named`).toBe(true);
    }
    // ⛔ THE PAIRED NEGATIVE. No override, no kind named anywhere in the line.
    // anchored: the five positives above render each kind's own clause from the same
    // pools, so an absent kind here is the absence of an override and not an empty corpus.
    const plain = decreeChronicleLine(entryOf(), null, { seed: 'a' });
    expect(GUARD_KINDS.filter((kind) => plain.prose.includes(kind))).toEqual([]);
  });

  it('the cause SELECTS the sentence: a party hand and a table hand do not read alike', () => {
    for (const addedBy of AUTHORS) {
      const entry = entryOf({ addedBy });
      const byTable = decreeLineParts(entry, null, { seed: 'a', cause: 'table' })[0];
      const byParty = decreeLineParts(entry, null, { seed: 'a', cause: 'party' })[0];
      expect(byTable.part).toBe('hand');
      expect(byParty.part).toBe('hand');
      expect(byParty.text === byTable.text, `${addedBy}: the two hands differ`).toBe(false);
      // Design §16's chair ruling, in the corpus rather than in a comment.
      expect(byParty.text.includes('party'), `${addedBy}: the party's hand is named`).toBe(true);
    }
  });
});

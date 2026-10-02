/**
 * tests/lint/decreeCause.walker.test.js — THE DECREE CAUSE WALKER (EM-E2, extended by
 * EM-E6; ARCH's instrument 4 — *"every applied decree carries a chronicle line with a
 * cause; overrides carry `overrode`"*; design §16 and §19 ruling 2 for the vocabulary).
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
 * ── EM-E6'S THIRD HALF: THE CATALOGUES ARE BOUND, NEVER COPIED ─────────────────────
 * Design §19 ruling 2 settles where a decree's EVENT and its PARTY CAUSE come from: the
 * event catalogue IS `affordanceManifest.js` minus `NON_AUTHORABLE_EVENTS`, and
 * `cause: 'party'` IS `PARTY_IMPACT_KINDS` through `applyPartyImpact`. The failure this
 * file now also exists for is a SECOND CATALOGUE, and a second catalogue never arrives
 * declared: it arrives as a helpful array of type words somebody pasted into the reader
 * so a picker could render without an import. So the arms below parse the reader's source
 * and intersect its string literals with both imported vocabularies, and a planted copy is
 * convicted by the same function that clears the real file.
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
  authorableEventTypes, eventFamilies, partyDeedClause, scheduledEventClause,
  stageScheduledEvent,
} from '../../src/domain/edit/eventCatalogue.js';
import {
  AFFORDANCE_MANIFEST, NON_AUTHORABLE_EVENTS, VERB_FAMILIES,
} from '../../src/domain/events/affordanceManifest.js';
import { PARTY_IMPACT_KINDS } from '../../src/domain/worldPulse/partyImpactKinds.js';
import { DECREE_AUTHORS, DECREE_STATUSES } from '../../src/domain/edit/registry.js';
import {
  DECREE_FORMS, decreeChronicleLine, decreeLineParts,
} from '../../src/domain/display/stateProse/decreeProse.js';
import {
  DECREE_EVENT_POOLS, DECREE_LINE_CAUSES, DECREE_PARTY_DEED_POOLS, DECREE_PROSE_BLOCKS,
} from '../../src/domain/display/stateProse/decreeProsePools.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const READER_REL = 'src/domain/display/stateProse/decreeProse.js';
const POOLS_REL = 'src/domain/display/stateProse/decreeProsePools.js';
/** EM-E6's reader, held to the same free-text and no-second-catalogue laws. */
const CATALOGUE_REL = 'src/domain/edit/eventCatalogue.js';

/**
 * Design §20.3's statuses and EM-C1 §6's authors, the two vocabularies the pools key on,
 * TAKEN FROM THE REGISTRY THAT LANDS THEM (U5). EM-E2 was built before EM-C1 was in the
 * tree, so these two rows were transcriptions; a transcription cannot red on the day the
 * vocabulary moves, and the import can.
 */
const STATUSES = [...DECREE_STATUSES];
const AUTHORS = [...DECREE_AUTHORS];

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

/** @param {string} rel @returns {string} */
const sourceOf = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/**
 * EVERY WORD OF EITHER CATALOGUE, from the catalogues themselves: the forty-one typed
 * settlement events and the twelve party-impact kinds. A reader that spells one of these
 * as a LITERAL has begun the second catalogue design §19 ruling 2 forbids, whether it
 * meant to or not, and the day a verb is added upstream the copy is silently wrong.
 * @type {ReadonlySet<string>}
 */
const CATALOGUE_WORDS = new Set([
  ...Object.keys(AFFORDANCE_MANIFEST), ...Object.keys(PARTY_IMPACT_KINDS),
]);

/**
 * THE SECOND-CATALOGUE LAW, as a pure function of a source so the mutant drives the very
 * code the live arm drives. An unquoted object KEY is an Identifier and not a literal, so
 * this sees a pasted array and not a pool addressed by its vocabulary's own word: the
 * corpus's keys are held to the imported rosters by the battery's totality arms instead,
 * which is the right instrument for a leaf that imports nothing.
 * @param {string} source @returns {string[]}
 */
const copiedCatalogueWords = (source) => [
  ...new Set(stringLiterals(source).filter((text) => CATALOGUE_WORDS.has(text))),
].sort(compareCodepoint);

/**
 * The module specifiers a source really imports, with the names it binds from each.
 * @param {string} source @returns {Map<string, string[]>}
 */
function importsOf(source) {
  const ast = parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
  /** @type {Map<string, string[]>} */
  const out = new Map();
  for (const node of ast.body) {
    if (node.type !== 'ImportDeclaration') continue;
    const names = node.specifiers
      .map((spec) => (spec.imported ? spec.imported.name : spec.local.name));
    out.set(String(node.source.value), [...(out.get(String(node.source.value)) || []), ...names]);
  }
  return out;
}

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
 * THE BLOCKS WHOSE SUBJECT EXISTS UNDER ONE CAUSE ONLY, declared BY NAME with the cause
 * that is theirs (EM-E6). `DEC-PARTY` names what the PARTY DID, and under the table's
 * cause there is no impact kind, hence no deed and nothing to name: a sentence there
 * written for the table would be the chronicle inventing an actor. Everything else
 * answers "how does a decree read", which both hands have an answer to.
 *
 * ⛔ A DECLARATION HERE TIGHTENS THE LAW, IT DOES NOT EXCUSE THE BLOCK. A declared block
 * owes its one cause AND is forbidden every other, so the arm convicts a missing party
 * sentence and a smuggled table sentence alike. An undeclared block owes all of them,
 * exactly as before, which is why every EM-E2 block is unaffected by this register
 * existing.
 * @type {Readonly<Record<string, string>>}
 */
const SINGLE_CAUSE_BLOCKS = Object.freeze({ 'DEC-PARTY': 'party' });

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
    const only = SINGLE_CAUSE_BLOCKS[blockId];
    for (const [poolKey, pool] of Object.entries(block)) {
      const speaksFor = (/** @type {string} */ cause) => pool
        .some((variant) => (/** @type {any} */ (variant).causes || []).includes(cause));
      for (const cause of DECREE_LINE_CAUSES) {
        // An undeclared block owes EVERY cause; a declared one owes its own and is
        // forbidden the rest, which is the same law read in both directions.
        if (!only || cause === only) {
          if (!speaksFor(cause)) problems.push(`${blockId}::${poolKey} is silent for ${cause}`);
        } else if (speaksFor(cause)) {
          problems.push(`${blockId}::${poolKey} speaks for ${cause}, which its subject cannot`);
        }
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
    // EM-E2 landed 51; EM-E6 added 21 event sentences over the catalogue's seven families
    // and 24 deed sentences over the party vocabulary's twelve kinds.
    expect(counted, 'the authored variant count this walker stands over').toBe(96);
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

  it('EM-E6 — the two new blocks are keyed BY the catalogues, and the deed block speaks for the party alone', () => {
    // ⛔ THE KEYS ARE THE IMPORTED ROSTERS, NOT A LIST THAT LOOKS LIKE THEM. The pools
    // leaf imports nothing by design, so this is where its keys are joined to the
    // vocabularies they claim to be: a family gained upstream, or a thirteenth impact
    // kind, reds HERE rather than arriving as a mute cell nobody notices.
    expect(Object.keys(DECREE_EVENT_POOLS).sort(compareCodepoint),
      'the event block is keyed by the manifest\'s own families')
      .toEqual([...VERB_FAMILIES].sort(compareCodepoint));
    expect(Object.keys(DECREE_PARTY_DEED_POOLS).sort(compareCodepoint),
      'the deed block is keyed by the one party vocabulary')
      .toEqual(Object.keys(PARTY_IMPACT_KINDS).sort(compareCodepoint));
    // The reader agrees with the corpus about the families, which is what makes the
    // draw's pool key a catalogue fact rather than a coincidence of spelling.
    expect([...eventFamilies()].sort(compareCodepoint))
      .toEqual(Object.keys(DECREE_EVENT_POOLS).sort(compareCodepoint));
    // ⛔ DESIGN §16'S CHAIR RULING, HELD ON THE CORPUS RATHER THAN ON ONE LINE: every
    // deed pool CAN say the owner's own words, so no kind can be the one that quietly
    // cannot.
    const mute = Object.entries(DECREE_PARTY_DEED_POOLS)
      .filter(([, pool]) => !pool.some((v) => v.text.includes('by the party\'s hand')))
      .map(([kind]) => kind);
    expect(mute, 'every impact kind can be spoken in the ruling\'s words').toEqual([]);
    // ⛔ THE TWO MUTANTS OF THE SINGLE-CAUSE LAW, one per direction.
    const smuggled = bend('DEC-PARTY', 'remove_npc', 0, { causes: ['party', 'table'] });
    expect(silentPools(smuggled))
      .toEqual(['DEC-PARTY::remove_npc speaks for table, which its subject cannot']);
    const silenced = bend('DEC-PARTY', 'remove_npc', 0, { causes: ['party'] });
    silenced['DEC-PARTY'].remove_npc = silenced['DEC-PARTY'].remove_npc
      .map((v) => ({ ...v, causes: [] }));
    expect(silentPools(silenced)).toEqual(['DEC-PARTY::remove_npc is silent for party']);
    // And an undeclared block still owes BOTH, so the register tightened one block
    // without loosening any other.
    const halved = bend('DEC-EVENT', 'War', 0, { causes: ['party'] });
    halved['DEC-EVENT'].War = halved['DEC-EVENT'].War.map((v) => ({ ...v, causes: ['party'] }));
    expect(silentPools(halved)).toEqual(['DEC-EVENT::War is silent for table']);
  });
});

describe('the decree cause walker — no line is free text', () => {
  it('the reader spells no sentence of its own: every word a reader sees comes from the pools', () => {
    expect(sentenceLiteralsOf(READER_REL)).toEqual([]);
    // EM-E6's catalogue reader draws two clauses of its own and is held to the same law:
    // its refusals are TOKENS and its sentences are the corpus's, or they are nobody's.
    expect(sentenceLiteralsOf(CATALOGUE_REL)).toEqual([]);
    // ⛔ THE CONTROL, so the scan is not simply blind. The pools file is nothing BUT
    // sentences, and the detector finds them all.
    expect(sentenceLiteralsOf(POOLS_REL).length, 'the detector sees authored sentences').toBe(96);
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
    // ⛔ EM-E6'S TWO BLOCKS ARE DRAWN BY THEIR OWN READER, NOT EXEMPTED FROM THE LAW.
    // `eventCatalogue.js` is the module that DRAWS them — `decreeLineParts` splices the
    // drawn clause and re-proves it against the corpus (U5), so a draw that never happened
    // is a clause that never reaches a line. Driving the reader here keeps the reachability
    // half below from being satisfiable by adding a slot to every new sentence, which is
    // how a corpus goes unread with a green suite. The splice's own arm — every authorable
    // type and every impact kind reaching a rendered line — lives in the battery.
    for (const type of authorableEventTypes()) {
      for (const cause of DECREE_LINE_CAUSES) {
        for (let seed = 0; seed < 40; seed += 1) {
          const clause = scheduledEventClause(type, { seed: `s${seed}`, cause, settlement: 'Kolstad' });
          if (clause) drawn.add(clause.text);
        }
      }
    }
    for (const kind of Object.keys(PARTY_IMPACT_KINDS)) {
      for (let seed = 0; seed < 40; seed += 1) {
        const clause = partyDeedClause(kind, { seed: `s${seed}`, settlement: 'Kolstad' });
        if (clause) drawn.add(clause.text);
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

  it('EM-E6 — the party cause the reader names is the one the chronicle speaks under', () => {
    // The two halves of design §19 ruling 2 meet here: the vocabulary the reader would
    // hand `applyPartyImpact` is the vocabulary the corpus has a deed pool for, and the
    // cause that pool speaks under is the cause the chronicle line carries.
    for (const kind of Object.keys(PARTY_IMPACT_KINDS)) {
      const clause = partyDeedClause(kind, { seed: 'a' });
      expect(clause, `${kind} has a deed clause`).toBeTruthy();
      expect(clause.blockId, kind).toBe('DEC-PARTY');
      expect(clause.poolKey, kind).toBe(kind);
      const line = decreeChronicleLine(entryOf(), null, { seed: 'a', cause: 'party' });
      expect(line.cause, kind).toBe('party');
    }
    // ⛔ THE PAIRED NEGATIVE: a kind outside the one vocabulary draws NOTHING, which is
    // what makes the clause a catalogue read rather than a string formatter.
    expect(partyDeedClause('broke_the_siege', { seed: 'a' })).toBe(null);
    expect(partyDeedClause(null, { seed: 'a' })).toBe(null);
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

describe('the decree cause walker — EM-E6 binds the catalogues, and mints no second one', () => {
  it('the catalogue reader COPIES no event type and no impact kind, and a planted copy is convicted', () => {
    expect(copiedCatalogueWords(sourceOf(CATALOGUE_REL)),
      'the reader spells neither catalogue').toEqual([]);
    // ⛔ THE CONTROL, so the detector is not simply blind: the manifest IS the catalogue,
    // and the same function finds its words by the dozen.
    expect(copiedCatalogueWords(sourceOf('src/domain/events/affordanceManifest.js')).length,
      'the detector sees a catalogue where one really lives').toBeGreaterThan(30);
    // ⛔ THE PLANT, in the only form this arm can take without writing to the tree: the
    // helpful array somebody pastes so a picker can render without an import, and the
    // lone kind somebody switches on. Both run through the same parser and predicate.
    const planted = [
      "const TYPES = ['ADD_NPC', 'PLAGUE'];",
      "export const isCrisis = (k) => k === 'resolve_stressor';",
    ].join('\n');
    expect(copiedCatalogueWords(planted)).toEqual(['ADD_NPC', 'PLAGUE', 'resolve_stressor']);
    // And a word that merely LOOKS like one is not convicted, so the predicate is the
    // catalogue's membership and not a shape heuristic wearing a regex.
    expect(copiedCatalogueWords("const a = 'ADD_LIGHTHOUSE'; const b = 'break_the_siege';"))
      .toEqual([]);
  });

  it('the reader takes both catalogues BY IMPORT, from the modules that own them', () => {
    const imports = importsOf(sourceOf(CATALOGUE_REL));
    const manifest = imports.get('../events/affordanceManifest.js') || [];
    expect(manifest, 'the event catalogue and its fold set, by name')
      .toEqual(expect.arrayContaining(['AFFORDANCE_MANIFEST', 'NON_AUTHORABLE_EVENTS']));
    expect(imports.get('../worldPulse/partyImpactKinds.js') || [],
      'the party vocabulary from the dependency-free leaf, never from the pipeline')
      .toEqual(['PARTY_IMPACT_KINDS']);
    expect(imports.get('../worldPulse/partyImpact.js') || [],
      'and the ONE write path from the module that owns it')
      .toEqual(['applyPartyImpact']);
    // ⛔ ANTI-VACUITY: the parse really read this file's imports, not an empty map.
    expect([...imports.keys()].length, 'the reader\'s import list is non-empty')
      .toBeGreaterThan(3);
    // ⛔ THE MUTANT: a reader that dropped the import and kept a local list is seen as
    // having no such import at all, which is the arm above failing rather than passing.
    const severed = importsOf("const NON_AUTHORABLE_EVENTS = new Set(['PLAGUE']);\nexport const a = 1;\n");
    expect(severed.get('../events/affordanceManifest.js')).toBe(undefined);
  });

  it('every authorable event type is stageable with a when, and every non-authorable one is refused BY NAME', () => {
    const authorable = authorableEventTypes();
    // The catalogue's own arithmetic, measured rather than transcribed: forty-one typed
    // settlement events, nine of them folded, thirty-two a decree may schedule.
    expect(Object.keys(AFFORDANCE_MANIFEST).length, 'the catalogue').toBe(41);
    expect(NON_AUTHORABLE_EVENTS.size, 'the folds').toBe(9);
    expect(authorable.length, 'the catalogue minus the folds').toBe(32);
    expect(authorable.filter((type) => NON_AUTHORABLE_EVENTS.has(type)),
      'and not one fold survives the subtraction').toEqual([]);

    const staged = authorable.map((type) => stageScheduledEvent(type, { tick: 3 }));
    expect(staged.filter((row) => !row.ok).map((row) => row.type),
      'every authorable type stages with a when').toEqual([]);
    expect(staged.map((row) => row.tick), 'each at the turn it was given')
      .toEqual(authorable.map(() => 3));
    expect([...new Set(staged.map((row) => row.family))].sort(compareCodepoint),
      'and every family of the catalogue is reached, so no pool of the block is dead')
      .toEqual([...VERB_FAMILIES].sort(compareCodepoint));

    // ⛔ REFUSED BY NAME, AND TOLD WHERE THE ACT ACTUALLY LIVES. The nine folds are the
    // manifest's own, and the carrying verb comes off the manifest's fold note.
    const refused = [...NON_AUTHORABLE_EVENTS].map((type) => stageScheduledEvent(type, { tick: 3 }));
    expect(refused.length, 'all nine folds were asked').toBe(9);
    expect(refused.filter((row) => row.ok), 'and none of them stages').toEqual([]);
    expect([...new Set(refused.map((row) => row.refusal))]).toEqual(['folded']);
    expect(refused.filter((row) => !row.type || !row.foldedInto).map((row) => row.type),
      'each refusal names itself and the verb that carries it').toEqual([]);
    expect(refused.filter((row) => !Object.keys(AFFORDANCE_MANIFEST).includes(row.foldedInto)),
      'and the carrier it names is a real verb of the same catalogue').toEqual([]);

    // The other two refusals, each by its own token, and the roster is closed at three.
    expect(stageScheduledEvent('ADD_LIGHTHOUSE', { tick: 3 }).refusal).toBe('unknown-type');
    expect(stageScheduledEvent('ADD_LIGHTHOUSE', { tick: 3 }).type).toBe('ADD_LIGHTHOUSE');
    expect(stageScheduledEvent(authorable[0], undefined).refusal).toBe('when-missing');
    expect(stageScheduledEvent(authorable[0], { tick: 'soon' }).refusal).toBe('when-missing');
    expect(stageScheduledEvent(authorable[0], { tick: Number.NaN }).refusal).toBe('when-missing');
    // ⛔ AND NO CLAMP ON `when`, which the charter's own row says in those words: a turn
    // already passed stages exactly as one still to come, because whether it is too late
    // is the registry's and the guards' question (design §2.7) and never this reader's.
    expect(stageScheduledEvent(authorable[0], { tick: -4 }).ok).toBe(true);
    expect(stageScheduledEvent(authorable[0], { tick: -4 }).tick).toBe(-4);
  });

  it('a scheduled event draws its clause on the family the CATALOGUE gives its type', () => {
    const authored = new Set(Object.values(DECREE_EVENT_POOLS)
      .flatMap((pool) => pool.map((variant) => variant.text)));
    for (const type of authorableEventTypes()) {
      const clause = scheduledEventClause(type, { seed: 'a', cause: 'table' });
      expect(clause, `${type} renders a clause`).toBeTruthy();
      expect(clause.blockId, type).toBe('DEC-EVENT');
      expect(clause.poolKey, `${type} draws on its own family`)
        .toBe(AFFORDANCE_MANIFEST[type].family);
      expect(authored.has(clause.text) || clause.text.includes('Kolstad'),
        `${type} draws an authored sentence`).toBe(true);
    }
    // ⛔ THE PAIRED NEGATIVE, both limbs: a folded type and a word outside the catalogue
    // each draw NOTHING, so the clause is a catalogue read and the silence is the
    // catalogue's own.
    // anchored: the loop above renders a clause for all thirty-two authorable types from
    // these very pools, so a null here is the fold closing and never an emptied block.
    for (const type of NON_AUTHORABLE_EVENTS) {
      expect(scheduledEventClause(type, { seed: 'a' }), `${type} is folded and says nothing`).toBe(null);
    }
    expect(scheduledEventClause('ADD_LIGHTHOUSE', { seed: 'a' })).toBe(null);
    expect(scheduledEventClause(undefined, { seed: 'a' })).toBe(null);
  });
});

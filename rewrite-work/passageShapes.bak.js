/**
 * domain/prose/passageShapes.js — THE FOURTH SEEDED DRAW (ARCH car 8a item 2; SITTING §T.4
 * adopting agenda C⁗ as chartered; the owner's rulings (a)–(e) of 2026-09-08 ~22:4x).
 *
 * WHAT THIS ANSWERS. The owner asked "we have sentence variation, do we have passage
 * variation?" and the honest answer was: three quarters of one. The passage varies by which
 * facts attach (the world's doing), by the connective draw and by the face combination — but
 * its SHAPE is fixed. Every composed unit is spine first, added sentence after. This module
 * is the missing quarter, and it is a MODEL of the shape question rather than a change to
 * the shipped arrangement: at car 8a nothing ships a second shape, and `composeStateProse.js`
 * is not a caller. The report (`scripts/prose-shape-report.mjs`) is the caller, the sitting
 * rules on the measured table at 8a's fold, and only then does the composer take a shape.
 *
 * ── THE CLOSED SET IS THREE, AND THE OWNER CLOSED IT ─────────────────────────────────
 *
 * Ruling (a), verbatim in substance: the set is the three and no more, because clarity,
 * thread, boundedness and a predictable information structure are what the fixed order
 * protects. Passage architecture is deliberately NOT made highly variable. A fourth shape is
 * an owner act, not an author's.
 *
 *   1. `spine-then-sentence`  the shipped shape. The spine, then the opener, then the
 *                             modifier's own sentence.
 *   2. `sentence-then-spine`  the added fact first. LAWFUL ONLY where the added face carries
 *                             a noun INTO the spine (the thread rule, car 8a item 4) AND the
 *                             relation is an `addition` that is not read as a cause.
 *   3. `clause-seat`          the consequence riding as a clause on the main sentence. LAWFUL
 *                             ONLY where a `consequence.clause` joint exists under S2's
 *                             guards. None exists at this tip, and that is PRINTED as a
 *                             refusal rather than left as a silence.
 *
 * ── ⛔ LICENSED BY THE COMPOSITION, NEVER RESCUED BY IT (ruling (b)) ──────────────────
 *
 * This is the rule the whole module exists to hold, and it is a rule about ORDER OF
 * OPERATIONS rather than about shapes:
 *
 *     world -> the facts -> the LAWFUL SHAPE SET -> a seeded selection among the lawful
 *
 * and NEVER a seeded shape followed by a fallback. The difference is not cosmetic. A draw
 * that picks a shape and then repairs it produces units whose shape is decided by the repair
 * path, which is unmeasurable and unbounded; a draw that selects among the already-lawful
 * produces units whose shape distribution can be read CONDITIONALLY on the lawful set, which
 * is exactly what ruling (c) asks the sitting to look at: "a shape that dominates only
 * because it is the only lawful one is not a tic". So `lawfulPassageShapes` returns the set
 * and its refusals WITH REASONS, and `drawPassageShape` refuses to be handed anything else.
 *
 * ── SHAPE IS A SURFACE, LIKE A FACE ──────────────────────────────────────────────────
 *
 * No shape moves a fact between the record and the pen. The facts and their secrecy stay
 * typed, the compiled passage stays audience-independent, and the same unit rendered under
 * two shapes carries the same claim set. That is asserted, not assumed: the walker holds the
 * piece roster and the claim set invariant across every lawful shape of a unit.
 *
 * PURE AND HEADLESS: no imports outside this layer's own walker vocabulary, no state, no
 * clock, no RNG. The one hash is the kernel's, reached through `hashKey`.
 *
 * @enforced-by tests/lint/prosePassageShapes.walker.test.js
 */
import { hashKey } from '../display/stateProse/stateProseKernel.js';
import { contentWords } from './composedWalker.js';

/** The SENTENCE seat's spelling, mirrored from the composer so this leaf imports no bundle. */
const SENTENCE_SEAT = 'sentence';
/** The CLAUSE seat's spelling. */
const CLAUSE_SEAT = 'clause';

/**
 * ⭐ THE CLOSED SET, in the order the owner named them. The order is the tie order and the
 * print order; it is NOT a preference, because the draw is an argmax over per-shape keys and
 * reads the array only to know what it may choose among.
 * @type {ReadonlyArray<string>}
 */
export const PASSAGE_SHAPES = Object.freeze([
  'spine-then-sentence', 'sentence-then-spine', 'clause-seat',
]);

/** The shipped shape — what every composed unit takes today and until the sitting rules. */
export const SHIPPED_SHAPE = 'spine-then-sentence';

/**
 * The shape-set digest material: the closed set joined, so a fourth shape appearing anywhere
 * moves one number on the SHIFT REGISTER instead of appearing quietly in a distribution.
 * @returns {string}
 */
export const shapeSetMaterial = () => PASSAGE_SHAPES.join('|');

/**
 * ⭐ THE NOUN CARRY — the thread rule's mechanical half, and shape 2's licence.
 *
 * Shape 2 puts the added fact FIRST, which means the reader meets it with no spine to hang it
 * on. That is only readable when the added sentence hands a noun forward into the spine: the
 * owner's own formulation is that adjacent sentences of a composed unit must connect, by
 * carrying a noun forward or by being the one turn outward placed last. Sentence-first is the
 * carrying case, so the carry is REQUIRED rather than preferred.
 *
 * ⛔ CONTENT WORDS, AND THE STOP LIST IS THE WALKER'S OWN. `contentWords` is imported from
 * `composedWalker.js` rather than re-spelled, because a second stop list is two vocabularies
 * that drift, and this one already refuses the words that would make every pair look
 * connected (`town`, `settlement`, `place`, `thing`). A shared `settlement` is not a thread;
 * it is the subject of the whole dossier.
 *
 * @param {string} spineText the spine's filled sentence
 * @param {string} modifierText the added face's filled sentence
 * @returns {{carries: boolean, shared: string[]}} `shared` is the carried vocabulary, sorted,
 *   so a refusal can print WHAT was missing rather than only that something was
 */
export function nounCarry(spineText, modifierText) {
  const spine = new Set(contentWords(spineText));
  const shared = contentWords(modifierText).filter((word) => spine.has(word)).sort();
  return { carries: shared.length > 0, shared };
}

/**
 * The modifier pieces of a unit, in seat order. A unit is spine (or turn) plus at most one
 * joint, so this is a list of nought or one at every tip this module has run at; it is
 * written as a list because S2's clause plus a second sentence is two.
 * @param {{pieces?: ReadonlyArray<{role?: string, seat?: string, relation?: string, key?: string}>}} unit
 * @returns {Array<{role?: string, seat?: string, relation?: string, key?: string}>}
 */
const modifiersOf = (unit) => (unit && Array.isArray(unit.pieces) ? unit.pieces : [])
  .filter((piece) => piece && piece.role === 'modifier');

/**
 * ⭐ THE LAWFUL SHAPE SET FOR ONE COMPOSED UNIT, with every refusal carrying its reason.
 *
 * ⛔ A UNIT WITH NO MODIFIER HAS NO SHAPE QUESTION, and saying so is not pedantry: a bare
 * spine is one sentence and there is nothing to order. Reporting such a unit as
 * "spine-then-sentence" would inflate shape 1's marginal share with units that were never
 * asked, and ruling (c) asks the sitting to read the marginal and the conditional side by
 * side precisely so an artefact like that cannot pass for a tic. Such a unit answers
 * `applicable: false` and belongs in NO shape's denominator.
 *
 * @param {{text?: string, pieces?: ReadonlyArray<object>}} unit a composed unit
 * @param {{spineText?: string, modifierText?: string, jointPhrase?: string,
 *   clauseJointsExist?: boolean}} [facts] what the composer knew and the unit does not carry:
 *   the two texts APART (the unit's `text` is already arranged), the joint's drawn phrase, and
 *   whether any `consequence.clause` joint exists in the connectives leaf at all
 * @returns {{applicable: boolean, lawful: string[], refused: Array<{shape: string, why: string}>}}
 */
export function lawfulPassageShapes(unit, facts = {}) {
  const modifiers = modifiersOf(unit);
  if (modifiers.length === 0) {
    return { applicable: false, lawful: [], refused: [] };
  }
  /** @type {string[]} */
  const lawful = [];
  /** @type {Array<{shape: string, why: string}>} */
  const refused = [];
  const sentenceSeated = modifiers.some((piece) => (piece.seat || SENTENCE_SEAT) === SENTENCE_SEAT);
  const clauseSeated = modifiers.some((piece) => piece.seat === CLAUSE_SEAT);

  // ── 1 · spine then sentence ──────────────────────────────────────────────────────
  // The shipped shape, and the only one that is lawful by its own construction: a sentence
  // seated after the spine reads with the spine already given.
  if (sentenceSeated) lawful.push('spine-then-sentence');
  else refused.push({ shape: 'spine-then-sentence', why: 'no modifier is seated at the sentence seat' });

  // ── 2 · sentence then spine ──────────────────────────────────────────────────────
  // TWO GUARDS, both required, and the second is the chair's recorded caution: an `addition`
  // arranged sentence-first can READ as a consequence ("here is the country; here is what it
  // means for the wall"), and arm A2 convicts a joint that implies a relation with no row. So
  // the relation must be an addition AND the joint must be the bare join: a joint that spells
  // a word is a joint that colours the order it is put in.
  if (!sentenceSeated) {
    refused.push({ shape: 'sentence-then-spine', why: 'no modifier is seated at the sentence seat' });
  } else {
    const relations = [...new Set(modifiers
      .filter((piece) => (piece.seat || SENTENCE_SEAT) === SENTENCE_SEAT)
      .map((piece) => piece.relation || 'addition'))];
    const carry = nounCarry(facts.spineText || '', facts.modifierText || '');
    const phrase = String(facts.jointPhrase ?? '').trim();
    if (relations.length !== 1 || relations[0] !== 'addition') {
      refused.push({
        shape: 'sentence-then-spine',
        why: `the relation is ${relations.join('+') || 'unknown'} and only a plain addition may be re-ordered`,
      });
    } else if (phrase !== '') {
      refused.push({
        shape: 'sentence-then-spine',
        why: `the joint spells "${phrase}", which colours the order it is put in; only the bare join may be re-ordered`,
      });
    } else if (!carry.carries) {
      refused.push({
        shape: 'sentence-then-spine',
        why: 'the added face carries no noun into the spine, so the thread would break at the join',
      });
    } else {
      lawful.push('sentence-then-spine');
    }
  }

  // ── 3 · the clause seat ──────────────────────────────────────────────────────────
  // S2 is SIGNED (§N.1) but its connective list is EMPTY: `composeStateProse.js` authors
  // `consequence.clause` as `[]`, so `drawConnective` answers null and no clause joint can be
  // seated on any world. The shape is therefore WITHHELD rather than refused on this unit's
  // own facts, and the distinction matters — a shape nobody can reach is an owed list, not an
  // unlawful arrangement, and 8a item 9 is the car that drafts the list.
  if (clauseSeated) lawful.push('clause-seat');
  else if (facts.clauseJointsExist === false) {
    refused.push({
      shape: 'clause-seat',
      why: 'WITHHELD — the connectives leaf carries no consequence.clause joint at all, so no world can seat one (8a item 9 drafts the list to its floor of three)',
    });
  } else {
    refused.push({ shape: 'clause-seat', why: 'no modifier is seated at the clause seat' });
  }

  return { applicable: true, lawful, refused };
}

/**
 * ⭐ THE SEEDED SELECTION AMONG THE LAWFUL SHAPES (ruling (b)'s second half).
 *
 * ⛔ AN ARGMAX, NOT A MODULUS, AND THE REASON IS THE LAWFUL SET ITSELF. The kernel's law 6
 * moved the variant draw to an argmax because a modulus over a list re-rolls every read when
 * the list's length changes. Here the length changes UNIT BY UNIT — a unit whose added face
 * happens to carry a noun has two lawful shapes where its sibling has one — so a modulus over
 * the lawful array would make a unit's shape depend on how many OTHER shapes happened to be
 * lawful for it, which is the same instability row 22 cured, in miniature and permanent. The
 * argmax over per-shape keys gives each shape its own coin: a shape becoming lawful takes only
 * the reads it wins, and the units where it loses are undisturbed.
 *
 * The parent key is `${seed}::${blockId}::${poolKey}::shape`, which is key 1 of ARCH §2.4 with
 * `::shape` appended — a SUFFIX, so the variant draw, the face draw and the joint draw are all
 * untouched by a shape arriving. Ties break to the closed set's own order.
 *
 * NO HASH WHEN ONE, and canonical-at-zero with no seed: both are the kernel's laws 3 and 4
 * applied here rather than re-decided.
 *
 * @param {ReadonlyArray<string>} lawful the output of `lawfulPassageShapes().lawful`
 * @param {string} blockId
 * @param {string} poolKey the spine key, which is the unit's identity
 * @param {string} seed
 * @returns {string|null} `null` where the unit has no shape question at all
 */
export function drawPassageShape(lawful, blockId, poolKey, seed) {
  if (!Array.isArray(lawful) || lawful.length === 0) return null;
  for (const shape of lawful) {
    if (!PASSAGE_SHAPES.includes(shape)) {
      throw new Error(`passageShapes: "${shape}" is not one of the closed set`
        + ` (${PASSAGE_SHAPES.join(', ')}). The set is the owner's and a fourth is an owner act.`);
    }
  }
  if (lawful.length === 1) return lawful[0];
  if (!seed) return lawful[0];
  const parent = `${seed}::${blockId}::${poolKey}::shape`;
  let best = lawful[0];
  let bestHash = hashKey(`${parent}::${best}`);
  let bestRank = PASSAGE_SHAPES.indexOf(best);
  for (let i = 1; i < lawful.length; i += 1) {
    const shape = lawful[i];
    const digest = hashKey(`${parent}::${shape}`);
    const rank = PASSAGE_SHAPES.indexOf(shape);
    if (digest > bestHash || (digest === bestHash && rank < bestRank)) {
      best = shape; bestHash = digest; bestRank = rank;
    }
  }
  return best;
}

/**
 * ⭐ THE ARRANGEMENT UNDER A GIVEN SHAPE — the render half, used by the report to compose the
 * same unit both ways so the sitting reads real sentences and not a plan for them.
 *
 * ⛔ IT MOVES NO FACT. Shape 2 re-orders two sentences that were both going to be printed to
 * the same reader on the same page; it adds nothing, drops nothing and re-types nothing. The
 * walker asserts exactly that, by comparing the content-word multiset of the two arrangements.
 *
 * Shape 2 takes the modifier's own sentence FIRST, in its authored capitalisation, and the
 * spine follows unchanged — there is no opener to place, because the only relation shape 2
 * admits is the bare addition, whose phrase is empty by construction (see the guard above).
 *
 * @param {string} shape one of `PASSAGE_SHAPES`
 * @param {{spineText: string, modifierText: string, opener?: string}} parts
 * @returns {string}
 */
export function arrangeUnderShape(shape, parts) {
  const spine = String(parts.spineText || '').trim();
  const modifier = String(parts.modifierText || '').trim();
  const opener = String(parts.opener || '').trim();
  if (shape === 'sentence-then-spine') return `${modifier} ${spine}`;
  if (opener) return `${spine} ${opener} ${modifier}`;
  return `${spine} ${modifier}`;
}

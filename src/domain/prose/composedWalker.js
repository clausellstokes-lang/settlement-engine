/**
 * domain/prose/composedWalker.js — THE COMPOSED UNIT AS THE WALKED ENTRY (ARCH §8.4, S17).
 *
 * ── WHAT IT IS ──────────────────────────────────────────────────────────────────────
 * `entryWalker.js` walks ONE authored variant against its own typed facts. This walks the
 * COMPOSED UNIT — a spine, its seated modifiers and their joint, arranged into the one string
 * a rung renders — against the facts of ALL of its pieces at once. The gap it closes is the
 * one the composed model opens: every claim rule the estate owns is written per variant, and
 * a restatement, a false citation or an unlicensed joint is a property of the JOIN and of
 * nothing either half carries alone.
 *
 * ── THE FOUR CHANNELS, AND WHY NOT-EXECUTABLE IS ONE OF THEM ───────────────────────
 *   FAIL             an assertion the arm can settle against a typed input, and it is wrong.
 *   WITHHELD         the semantic half, reported with the field consulted, ruled on by the
 *                    refuter, and NEVER counted as a pass.
 *   REPORT           a measured figure the sitting sets a budget from; it gates nothing yet.
 *   NOT-EXECUTABLE   the arm's INPUT is absent. The §908 law made executable: an arm keyed on
 *                    a column the census does not ship declares itself not-executable and
 *                    names the column, instead of answering `[]` and reading as a pass.
 * Every run prints all four. `composedVerdictOf` refuses to call any of the last three a pass.
 *
 * ── WHERE IT RUNS ──────────────────────────────────────────────────────────────────
 * At the GATE (`tests/lint/proseComposed.walker.test.js`) and nowhere else. NEVER at the
 * draw: a runtime refusal would change `eligible.length` and move every later index
 * (CLERK-LAWS §2.5 / R-DA-20). This module imports nothing from the composer, nothing from
 * the kernel and nothing from generation, and no product surface may name it.
 *
 * ── THE INPUT IS A ROW THE GATE ASSEMBLES, NOT THE COMPOSER'S RETURN ───────────────
 * The composer's `pieces` carry a pool key, a vid, an index and a face, because that is what
 * a manifest cell needs and the composer has no reason to keep a string it already spent.
 * A claim walker needs each piece's own TEXT. So the walked row is a WIDER shape the gate
 * builds from the composer's unit plus the corpus, and its typedef says so rather than
 * pretending the composer returns it.
 *
 * ── HONEST LIMITS, STATED SO THEY CANNOT BE MISREAD ────────────────────────────────
 * A0b's reader is a word list over a field's own name (`claimTokensOf`), so it finds
 * CANDIDATES and the census judges; its reading over the shipped corpus is PRINTED and held
 * SHRINK-ONLY rather than asserted at an exact integer, because a heuristic asserted exactly
 * becomes a re-record every car pays and nobody reads. A5's ruler is the estate's own
 * (opener, segment count, content-token overlap) and its FLOOR is unset: the arm REPORTS
 * until the first wording sets exist, which is ARCH §8.4's own channel for it.
 *
 * PURE, HEADLESS. No settlement import, no clock, no RNG, no I/O, no locale API.
 *
 * @enforced-by tests/lint/proseComposed.walker.test.js
 */
import { CONTRAST_SHAPES } from './entryLexicons.js';
import {
  claimTokensOf, claimsField, clausesOf, sentencesOf, typedFactsOf, walkEntry,
} from './entryWalker.js';

// ⭐ RE-EXPORTED, NOT RE-SPELLED (REWRITE car 8a-6). `claimTokensOf` and `claimsField` moved
// DOWN into `entryWalker.js` so ARM Q can read them: this module imports that one, so the
// dependency could only run one way. Every existing caller — the wave gate, the walkers, the
// projection contract — goes on importing them from here, and there is still exactly one
// implementation of "does this text claim this field".
export { claimTokensOf, claimsField };
import { classifyMoves, composedOrderIdOf } from './moveGrammar.js';

/**
 * One piece of a composed unit, as the GATE assembles it: the composer's provenance row plus
 * the piece's own filled text and the frozen metadata the claim arms read.
 * @typedef {object} ComposedPieceRow
 * @property {'spine'|'modifier'|'turn'} role
 * @property {string} key the pool key inside the block
 * @property {string} text the piece's own text, as it entered the arrangement
 * @property {string} [relation] the EFFECTIVE relation the joint was drawn from
 * @property {string} [declaredRelation] the relation the pool DECLARES, before any flip
 * @property {'sentence'|'clause'} [seat]
 * @property {'fragment'|'sentence'} [form]
 * @property {ReadonlyArray<string>} [marks]
 * @property {ReadonlyArray<string>} [slots]
 */
/**
 * One composed unit as it is walked.
 * @typedef {object} ComposedUnitRow
 * @property {string} blockId
 * @property {string} poolKey the SPINE's key
 * @property {string} text the arranged unit
 * @property {ReadonlyArray<ComposedPieceRow>} pieces
 * @property {string} [mount] the position the unit renders at, for the echo and page-set arms
 * @property {string} [id] a stable address; derived from block and pool when absent
 */
/**
 * One finding. The shape is `entryWalker`'s record shape with the channel named on the row,
 * because a composed arm reports on four channels and a caller sorting by `klass` would lose
 * the one distinction the §908 law exists to keep.
 * @typedef {object} ComposedFinding
 * @property {string} id the unit's address
 * @property {string} arm the named limb
 * @property {'FAIL'|'WITHHELD'|'REPORT'|'NOT-EXECUTABLE'} channel
 * @property {string} subject what the arm looked at
 * @property {string} value what it read
 * @property {string} description one plain sentence
 */
/**
 * @typedef {{fails: ComposedFinding[], withheld: ComposedFinding[], reports: ComposedFinding[],
 *   notExecutable: ComposedFinding[]}} ComposedResult
 */

/** THE ROSTER — every arm this module owns, so a walker cannot silently drop one. */
export const COMPOSED_ARMS = Object.freeze([
  'A0b', 'A1', 'A2', 'A3', 'A5', 'A6', 'A9', 'A11', 'A13', 'Aspect', 'Ambiguity', 'C7',
  'Restatement', 'Tail', 'Thread',
]);

/** @returns {ComposedResult} an empty result, so every arm starts from the same shape */
export function emptyResult() {
  return {
    fails: [], withheld: [], reports: [], notExecutable: [],
  };
}

/**
 * Push one finding onto the channel it names.
 * @param {ComposedResult} out
 * @param {ComposedFinding} row
 */
function emit(out, row) {
  if (row.channel === 'FAIL') out.fails.push(row);
  else if (row.channel === 'WITHHELD') out.withheld.push(row);
  else if (row.channel === 'REPORT') out.reports.push(row);
  else out.notExecutable.push(row);
}

/**
 * @param {string} id
 * @param {string} arm
 * @param {'FAIL'|'WITHHELD'|'REPORT'|'NOT-EXECUTABLE'} channel
 * @param {string} subject
 * @param {string} value
 * @param {string} description
 * @returns {ComposedFinding}
 */
function row(id, arm, channel, subject, value, description) {
  return {
    id, arm, channel, subject, value, description,
  };
}

/** @param {ComposedUnitRow} unit @returns {string} the unit's address */
function addressOf(unit) {
  if (unit && typeof unit.id === 'string' && unit.id !== '') return unit.id;
  return `${unit ? unit.blockId : ''} :: ${unit ? unit.poolKey : ''}`;
}

/** @param {unknown} value @returns {ReadonlyArray<ComposedPieceRow>} */
function piecesOf(value) {
  const unit = /** @type {ComposedUnitRow} */ (value);
  return unit && Array.isArray(unit.pieces) ? unit.pieces : [];
}

/** Merge one result into another, channel by channel.
 * @param {ComposedResult} into @param {ComposedResult} from @returns {ComposedResult} */
export function mergeResults(into, from) {
  into.fails.push(...from.fails);
  into.withheld.push(...from.withheld);
  into.reports.push(...from.reports);
  into.notExecutable.push(...from.notExecutable);
  return into;
}

// ── the composed entry, and the composed order ──────────────────────────────────────

/**
 * The composed unit as ONE walked entry (S17). Every claim arm the estate already owns then
 * runs over the JOIN rather than over a half of it.
 *
 * ⛔ THE SLOTS ARE THE UNION OF THE PIECES' AND NOT THE SPINE'S. Arm D asks whether the text
 * names a slot the block's bag fills; a modifier's slot is named by the unit and filled by the
 * same bag, so a spine-only slot list would let a modifier name a slot nothing fills and arm D
 * would report nothing. The MARKS are the union for the same reason and a harder one: the
 * audience law truncates the WHOLE unit, so one `dm-only` piece marks the unit.
 * @param {ComposedUnitRow} unit
 * @param {{register?: string, file?: string, reads?: ReadonlyArray<string>,
 *   vocabulary?: Readonly<Record<string, ReadonlyArray<string>>>}} [extra]
 * @returns {import('./entryWalker.js').ProseEntry}
 */
export function composedEntryOf(unit, extra = {}) {
  /** @type {string[]} */
  const marks = [];
  /** @type {string[]} */
  const slots = [];
  for (const piece of piecesOf(unit)) {
    for (const mark of piece.marks || []) if (!marks.includes(mark)) marks.push(mark);
    for (const slot of piece.slots || []) if (!slots.includes(slot)) slots.push(slot);
  }
  return {
    id: addressOf(unit),
    text: unit.text,
    block: unit.blockId,
    pool: unit.poolKey,
    marks,
    slots,
    register: extra.register || 'R1',
    file: extra.file || '',
    // ⭐ THE TYPED READS AND THEIR RATIFIED NOUNS (REWRITE car 8a-6), carried so ARM Q can ask
    // whether a qualifier names a SECOND TYPED FIELD. ABSENT is a narrowing and not a failure:
    // a caller that brings no census reader gets the arm it had before this car, which is why
    // both are optional rather than required.
    ...(Array.isArray(extra.reads) ? { reads: extra.reads } : {}),
    ...(extra.vocabulary ? { vocabulary: extra.vocabulary } : {}),
  };
}

/**
 * The composed unit's DERIVED ORDER (ARCH §4.2 step 8): the spine's own move sequence
 * followed by each seated modifier's, in seat order, with consecutive duplicates collapsed
 * exactly as the single-variant classifier collapses them.
 *
 * ⛔ IT IS DERIVED FROM THE PIECES AND NOT FROM THE ARRANGED STRING, and that is the whole
 * reason the function exists. Running the classifier over the arranged text reads the JOINT as
 * prose: `, so the muster is thin` opens on a comma and its clause is split at a boundary the
 * connective invented, so the modifier's move is attributed to whichever half the split landed
 * in. The pieces are what the composer actually seated.
 * @param {ComposedUnitRow} unit
 * @returns {{moves: string[], id: string, level: 0|1|2}}
 */
export function composedOrderOf(unit) {
  /** @type {string[]} */
  const moves = [];
  for (const piece of piecesOf(unit)) {
    for (const move of classifyMoves(piece.text)) {
      if (moves[moves.length - 1] !== move) moves.push(move);
    }
  }
  const read = composedOrderIdOf(moves);
  return { moves, id: read.id, level: read.level };
}

// ── A0b · the text claims every declared field and no other ─────────────────────────

/** The census's own synthetic label for a recovered TABLE reading, which is not a field. */
const SYNTHETIC_READ_RE = /\(via .+ in .+\)$/;


/**
 * Does the pool's predicate hold this field FALSE? That is what makes an unnamed field an
 * IMPLICIT NEGATION rather than a plain omission: the branch reached this key BECAUSE the
 * field was absent, so the text is discriminating on a fact it never states.
 * @param {ReadonlyArray<{field: string, op: string, value: string}>} predicate
 * @param {string} field
 * @returns {boolean}
 */
function heldFalse(predicate, field) {
  for (const clause of predicate) {
    if (clause.field !== field) continue;
    if (clause.op === 'falsy' || clause.op === 'not') return true;
    if ((clause.op === '===' || clause.op === '==') && /^(?:false|null|undefined|0|'')$/.test(String(clause.value))) return true;
  }
  return false;
}

/**
 * ⭐ ARM A0b (ARCH §4.4, §8.4; E-F2, T-F7). The text claims every field the pool declares it
 * READS, and no field outside that set. Three limbs, each with its own name because each has
 * its own cure:
 *
 *   over-claim         the text names a field the branch evaluates but the pool does not read
 *                      — the NARROWS line is false and the fact budget is understated.
 *   under-claim        a declared field the text never claims — the pool is spending a fact
 *                      budget on a fact the reader is never told.
 *   implicit-negation  a declared field the text never claims AND the predicate holds FALSE:
 *                      the spine discriminates on a fact it does not name. ARCH's own case is
 *                      `invasionRowPoolKey`'s `walls with citizen militia`, which is reached
 *                      only when `garrison` is false (`defenseStateProse.js:412-425`).
 *
 * NOT-EXECUTABLE where the census recovered no reading, and — separately named — where the
 * recovered reading is the census's own SYNTHETIC TABLE LABEL rather than a field. The second
 * is not hypothetical: SEAM car 3h tabled DS-DEF-2's four key functions, so the block ARCH
 * works its example on now reads one instrument label per row and this arm can ask nothing of
 * it. Both are printed; neither answers `[]`.
 * @param {{id: string, text: string, reads: ReadonlyArray<string>,
 *   universe?: ReadonlyArray<string>, predicate?: ReadonlyArray<{field: string, op: string,
 *   value: string}>, vocabulary?: Readonly<Record<string, ReadonlyArray<string>>>}} input
 *   `universe` is the field set an over-claim is hunted over; the census's `tests` by default.
 * @returns {ComposedResult}
 */
export function armA0b(input) {
  const out = emptyResult();
  const reads = input.reads || [];
  const predicate = input.predicate || [];
  const vocabulary = input.vocabulary || {};
  if (reads.length === 0) {
    emit(out, row(input.id, 'A0b', 'NOT-EXECUTABLE', '(census reads)', 'not recovered',
      'the wiring census recovered no reading for this pool, so there is no declared field set to reconcile the text against'));
    return out;
  }
  const synthetic = reads.filter((field) => SYNTHETIC_READ_RE.test(field));
  if (synthetic.length) {
    emit(out, row(input.id, 'A0b', 'NOT-EXECUTABLE', '(census reads)', synthetic.join(', '),
      'the recovered reading is the census\'s own synthetic table label and not a field path, so no text can claim it'));
    return out;
  }
  for (const field of reads) {
    if (claimsField(input.text, field, vocabulary) !== '') continue;
    const negated = heldFalse(predicate, field);
    emit(out, row(input.id, 'A0b', 'FAIL',
      negated ? 'implicit-negation' : 'under-claim', field,
      negated
        ? `the pool reaches this key only when \`${field}\` is absent, and the text never names it: the spine discriminates on a fact it does not state`
        : `the pool declares it reads \`${field}\` and the text never claims it, so a fact of the budget is spent on a fact the reader is not told`));
  }
  for (const field of input.universe || []) {
    if (reads.includes(field)) continue;
    const token = claimsField(input.text, field, vocabulary);
    if (token === '') continue;
    emit(out, row(input.id, 'A0b', 'FAIL', 'over-claim', `${field} (as "${token}")`,
      `the text claims \`${field}\`, which the branch evaluates but this pool does not read: the narrowing is false`));
  }
  return out;
}

// ── A1 · a modifier neither restates nor negates its spine ──────────────────────────

/**
 * ⭐ ARM A1 (ARCH §4.6). `typedFactsOf` overlap ACROSS PIECES on a governed noun: the same
 * band class is a RESTATEMENT, a disjoint class is a CONFLICT. Both FAIL, and the distinction
 * is kept because the cures are opposite ways round — a restatement drops the modifier, a
 * conflict means one of the two pieces is wrong about the town.
 *
 * ⛔ THE POPULATION IS THE PIECES OF ONE UNIT and never a pool's siblings: `armC5` already owns
 * "the OTHER variants of this pool cell", where a conflict is a FAIL because siblings must
 * agree by construction. Running the same comparison over pieces would have quietly widened
 * that arm's documented population, which is the shape SITTING §J was called on once already.
 *
 * The OBJECT-CLASS half of §4.6 is a PROJECTION refusal (`assertPoolDeclaration`'s attach
 * guard, T-F12) and is not re-asked here: a class collision cannot reach a composed unit,
 * because the attach that would carry it is refused at the freeze.
 * @param {ComposedUnitRow} unit
 * @returns {ComposedResult}
 */
export function armA1(unit) {
  const out = emptyResult();
  const id = addressOf(unit);
  const pieces = piecesOf(unit);
  if (pieces.length < 2) {
    emit(out, row(id, 'A1', 'NOT-EXECUTABLE', '(pieces)', String(pieces.length),
      'a cross-piece comparison needs two pieces; this unit is a bare spine'));
    return out;
  }
  const facts = pieces.map((piece) => typedFactsOf({ id: `${id}#${piece.key}`, text: piece.text }));
  for (let a = 0; a < pieces.length; a += 1) {
    for (let b = a + 1; b < pieces.length; b += 1) {
      for (const [noun, band] of Object.entries(facts[a].bands)) {
        const other = facts[b].bands[noun];
        if (!other) continue;
        const restates = other === band;
        emit(out, row(id, 'A1', 'FAIL', restates ? 'restatement' : 'conflict',
          `${noun}: ${band} vs ${other}`,
          restates
            ? `\`${pieces[a].key}\` and \`${pieces[b].key}\` band "${noun}" the same way, so the second piece says again what the first already said`
            : `\`${pieces[a].key}\` bands "${noun}" as ${band} and \`${pieces[b].key}\` bands it ${other}, inside one unit about one town`));
      }
    }
  }
  return out;
}

// ── A2 · the connective carries exactly its relation, licensed, in the right direction ──

/**
 * The relation-table edges between two endpoints, both spellings read, because the leaf keys a
 * pair ONCE and carries the direction on the row.
 * @param {Readonly<Record<string, ReadonlyArray<{relation: string, direction: string}>>>} relations
 * @param {string} from
 * @param {string} to
 * @returns {Array<{relation: string, direction: string, forward: boolean}>}
 */
function edgesBetween(relations, from, to) {
  /** @type {Array<{relation: string, direction: string, forward: boolean}>} */
  const edges = [];
  for (const edge of relations[`${from}|${to}`] || []) {
    edges.push({ relation: edge.relation, direction: edge.direction, forward: /^a(?:→|->)b$/.test(edge.direction) });
  }
  for (const edge of relations[`${to}|${from}`] || []) {
    edges.push({ relation: edge.relation, direction: edge.direction, forward: /^b(?:→|->)a$/.test(edge.direction) });
  }
  return edges;
}

/** Every endpoint the relation table names, on either side of every key. @param {Readonly<Record<string, unknown>>} relations @returns {Set<string>} */
export function relationEndpoints(relations) {
  /** @type {Set<string>} */
  const seen = new Set();
  for (const pair of Object.keys(relations || {})) {
    const at = pair.indexOf('|');
    if (at < 0) continue;
    seen.add(pair.slice(0, at));
    seen.add(pair.slice(at + 1));
  }
  return seen;
}

/**
 * ⭐ ARM A2 (ARCH §4.5, §5.2; T-F2, E-F14b). A `consequence` or `tension` joint is licensed by
 * the RELATION TABLE row for (the spine's PRIMARY field, the modifier's field), read WITH its
 * direction. No other field of a multi-field spine may be the licence.
 *
 * ⛔ THE THREE ANSWERS ARE NOT TWO, AND THE THIRD IS WHY THE ARM IS HONEST TODAY. A pair whose
 * endpoints are BOTH members of the table's own vocabulary and carries no row FAILS: the
 * question was asked and answered. A pair whose endpoints the table has never heard of is
 * WITHHELD, because the join is UNESTABLISHED rather than negative — which is exactly the
 * shipped state car 0 measured (F1: none of the 165 engine rows joins a desk read root, source
 * (d) empty), so at this tip EVERY joint on the shipped corpus is WITHHELD and none is a FAIL.
 * Reporting those as failures would have blamed the authors for a table nobody has ratified.
 * A row that exists but runs modifier→spine is a CAUSE, which seats as an `addition` (§4.5);
 * it is WITHHELD here because the projection already refuses the declaration that produced it.
 * @param {ComposedUnitRow} unit
 * @param {{relations?: Readonly<Record<string, ReadonlyArray<{relation: string,
 *   direction: string}>>>, primaryOf?: (key: string) => string,
 *   fieldOf?: (key: string) => string}} options
 * @returns {ComposedResult}
 */
export function armA2(unit, options) {
  const out = emptyResult();
  const id = addressOf(unit);
  const relations = options.relations;
  const joints = piecesOf(unit).filter((piece) => piece.role === 'modifier'
    && (piece.declaredRelation === 'consequence' || piece.declaredRelation === 'tension'));
  if (!joints.length) {
    emit(out, row(id, 'A2', 'NOT-EXECUTABLE', '(joints)', '0',
      'no seated modifier declares a `consequence` or a `tension`, so there is no licence to ask for'));
    return out;
  }
  if (!relations) {
    emit(out, row(id, 'A2', 'NOT-EXECUTABLE', '(relation leaf)', 'not supplied',
      'the relation table was not supplied, so no joint can be licensed or refused'));
    return out;
  }
  const vocabulary = relationEndpoints(relations);
  const primary = options.primaryOf ? options.primaryOf(unit.poolKey) : '';
  for (const piece of joints) {
    const field = options.fieldOf ? options.fieldOf(piece.key) : '';
    if (primary === '' || field === '') {
      emit(out, row(id, 'A2', 'NOT-EXECUTABLE', '(primary field)', `${unit.poolKey} / ${piece.key}`,
        'the census recovered no primary field for the spine or no field for the modifier, so the pair the licence is keyed on cannot be formed'));
      continue;
    }
    if (!vocabulary.has(primary) && !vocabulary.has(field)) {
      emit(out, row(id, 'A2', 'WITHHELD', 'unestablished join', `${primary} | ${field}`,
        'neither endpoint is a member of the relation table\'s own vocabulary, so the join is unestablished rather than negative (car 0\'s F1)'));
      continue;
    }
    const edges = edgesBetween(relations, primary, field)
      .filter((edge) => edge.relation === piece.declaredRelation);
    if (edges.some((edge) => edge.forward)) continue;
    if (edges.length) {
      emit(out, row(id, 'A2', 'WITHHELD', 'direction unread', `${primary} | ${field}`,
        `a \`${piece.declaredRelation}\` row exists for this pair and runs modifier to spine, which is a cause and seats as an addition`));
      continue;
    }
    emit(out, row(id, 'A2', 'FAIL', 'no row', `${primary} | ${field}`,
      `\`${piece.key}\` joins as a \`${piece.declaredRelation}\` with no relation-table row for the spine's primary field and its own`));
  }
  return out;
}

// ── A3 · wall 5, as an arm ──────────────────────────────────────────────────────────

/** Words too common to identify a rejected alternative; the check-pair stop list's own kind. */
const ALTERNATIVE_STOP = Object.freeze([
  'that', 'this', 'with', 'from', 'have', 'been', 'being', 'than', 'then', 'they', 'them',
  'their', 'there', 'here', 'what', 'when', 'which', 'would', 'could', 'should', 'about',
  'into', 'over', 'rather', 'anything', 'something', 'nothing', 'everything', 'more', 'most',
  'much', 'only', 'also', 'just', 'such', 'other', 'same', 'town', 'settlement', 'place',
  'thing', 'things',
]);

/**
 * The content words of a phrase, lower-cased and de-duplicated.
 *
 * ⛔ EXPORTED AT REWRITE car 8a-2 SO THERE IS ONE STOP LIST AND NOT TWO. `passageShapes.js`
 * needs exactly this vocabulary to decide whether an added face carries a noun into the
 * spine, and the words this list refuses — `town`, `settlement`, `place`, `thing` — are
 * precisely the ones that would make every pair of sentences in the dossier look connected.
 * A second copy would drift, and the drift would be invisible because both halves would agree
 * with themselves.
 * @param {string} text
 * @returns {string[]}
 */
export function contentWords(text) {
  const words = String(text || '').toLowerCase().replace(/\{[a-z_0-9]+\}/g, ' ')
    .replace(/[^a-z ]/g, ' ').split(/\s+/)
    .filter((word) => word.length >= 4 && !ALTERNATIVE_STOP.includes(word));
  return [...new Set(words)];
}

/**
 * ⭐ ARM A3 — WALL 5 (ARCH §4.5, `moveGrammar.js` WALLS id 5). A CONTRAST stands only where a
 * sibling pool key or a sibling band of THIS block names the rejected alternative.
 *
 * ⛔ THE TWO HALVES TAKE DIFFERENT CHANNELS, and the split is `check-pair`'s R4-BAND ruling
 * applied at the composed grain. Whether the block has any sibling at all is MECHANICAL, so a
 * contrast in a block with no siblings is a FAIL. Whether the rejected alternative NAMES what
 * a sibling band supplies is semantics, so it is WITHHELD to the refuter with the sibling keys
 * printed beside it — never a silent mechanical pass.
 * @param {ComposedUnitRow} unit
 * @param {{siblingKeys?: ReadonlyArray<string>}} options
 * @returns {ComposedResult}
 */
export function armA3(unit, options) {
  const out = emptyResult();
  const id = addressOf(unit);
  const shapes = [...String(unit.text || '').toLowerCase().matchAll(CONTRAST_SHAPES)];
  if (!shapes.length) {
    emit(out, row(id, 'A3', 'NOT-EXECUTABLE', '(contrast shape)', 'none',
      'the unit carries no contrast shape, so wall 5 has nothing to license'));
    return out;
  }
  // ⛔ AN ABSENT SIBLING SET IS AN INPUT THE CALLER DID NOT BRING; AN EMPTY ONE IS A FACT
  // ABOUT THE BLOCK, AND COLLAPSING THE TWO IS HOW A DRIVER MANUFACTURES ITS OWN FAILS.
  // The seam fold's 4b (SITTING §R): `reWalkBlock` dropped its options, this arm read `[]`,
  // and every contrast-carrying unit of a re-walked block reported a breach of wall 5 that
  // the corpus never committed. The §908 law settles it — a row keyed on an input nobody
  // supplied declares itself NOT-EXECUTABLE instead of answering.
  if (!options.siblingKeys) {
    emit(out, row(id, 'A3', 'NOT-EXECUTABLE', '(sibling keys)', shapes[0][0].trim(),
      'the caller supplied no sibling set at all, so wall 5 has nothing to read against; an EMPTY set is a different answer and fails below'));
    return out;
  }
  const siblings = options.siblingKeys;
  if (!siblings.length) {
    emit(out, row(id, 'A3', 'FAIL', 'no sibling names the alternative', shapes[0][0].trim(),
      'wall 5 licenses a contrast only where a sibling pool key or band names the rejected alternative, and this block holds no sibling'));
    return out;
  }
  const named = new Set(siblings.flatMap((key) => contentWords(key)));
  const body = String(unit.text || '').toLowerCase();
  for (const shape of shapes) {
    const phrase = shape[0].trim();
    // ⛔ THE ALTERNATIVE IS THE SHAPE PLUS WHAT FOLLOWS IT, up to the next clause stop, and
    // that is `check-pair`'s own R4-BAND-TEXT method rather than a new one. The SHAPE alone is
    // usually two function words (`rather than`), so a reader that took only the match would
    // find no content word at all and would withhold on every contrast in the estate.
    const at = typeof shape.index === 'number' ? shape.index : body.indexOf(phrase);
    const tail = body.slice(at, at + phrase.length + 60);
    const stop = tail.search(/[.;,]/);
    const alternative = stop > phrase.length ? tail.slice(0, stop) : tail;
    const hits = contentWords(alternative).filter((word) => named.has(word));
    if (hits.length) {
      emit(out, row(id, 'A3', 'REPORT', 'licensed by a sibling key', `${alternative.trim()} -> ${hits.join(', ')}`,
        'the rejected alternative names a word of a sibling pool key, which is wall 5\'s mechanical half satisfied'));
      continue;
    }
    emit(out, row(id, 'A3', 'WITHHELD', 'the band half is the refuter\'s', alternative.trim(),
      `no sibling KEY names this alternative; whether a sibling BAND supplies it is the refuter's (siblings: ${siblings.slice(0, 4).join(' | ')})`));
  }
  return out;
}

// ── A5 · the four faces are not four synonym swaps ──────────────────────────────────

/** @param {string} text @returns {string} the first two words, slots normalised to one token */
function openerOfText(text) {
  return String(text || '').replace(/\{[a-zA-Z_0-9]+\}/g, '{}').trim().split(/\s+/).slice(0, 2)
    .map((word) => word.toLowerCase().replace(/^[^a-z{]+|[^a-z}]+$/g, '')).filter(Boolean).join(' ');
}

/**
 * THE SIBLING DISTANCE, on the estate's own ruler and no new one: the two-word OPENER (the
 * shape `check-pair`'s A11 spread arm reads), the SENTENCE COUNT (the shape its U2 ceiling
 * reads, taken through `entryWalker.sentencesOf` so the composed grain and the entry grain
 * count the same way), and the CONTENT-TOKEN overlap the R4-BAND text probe already uses.
 *
 * The overlap is reported in BASIS POINTS, as an integer: `src/domain/**` bans a float, and a
 * ratio printed as a decimal is a rounding call waiting to be written.
 * @param {string} a
 * @param {string} b
 * @returns {{sameOpener: boolean, sameSegments: boolean, overlapBp: number}}
 */
export function siblingDistance(a, b) {
  const wordsA = contentWords(a);
  const wordsB = contentWords(b);
  const shared = wordsA.filter((word) => wordsB.includes(word)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return {
    sameOpener: openerOfText(a) === openerOfText(b),
    sameSegments: sentencesOf(a).length === sentencesOf(b).length,
    overlapBp: union === 0 ? 10000 : Math.round((shared * 10000) / union),
  };
}

/**
 * ⭐ ARM A5 (ARCH §8.4) — a wording set of four must not be four synonym swaps.
 *
 * ⛔ THE CHANNEL IS REPORT AND THE FLOOR IS AN ARGUMENT, which is ARCH §8.4's own ruling for
 * this arm ("floor measured on the VARIETY corpus; REPORT → FAIL"). No wording set exists at
 * this tip — every shipped variant has ONE face — so a floor asserted now would be a number
 * measured on a population that is not the one it will judge. The walker prints the
 * distribution of SIBLING distances over the shipped pools as the proxy the floor will be cut
 * from, and this arm reports every pair that clears all three tests at once.
 * @param {{id: string, faces: ReadonlyArray<string>, floorBp?: number}} input
 *   `floorBp` defaults to 10000, i.e. only an EXACT content-token match counts, which is the
 *   most conservative floor there is and the only one no measurement has yet earned.
 * @returns {ComposedResult}
 */
export function armA5(input) {
  const out = emptyResult();
  const faces = input.faces || [];
  const floorBp = typeof input.floorBp === 'number' ? input.floorBp : 10000;
  if (faces.length < 2) {
    emit(out, row(input.id, 'A5', 'NOT-EXECUTABLE', '(wording set)', String(faces.length),
      'a sibling distance needs two faces; this variant carries one, which is every shipped variant at this tip'));
    return out;
  }
  for (let a = 0; a < faces.length; a += 1) {
    for (let b = a + 1; b < faces.length; b += 1) {
      const measured = siblingDistance(faces[a], faces[b]);
      if (!measured.sameOpener || !measured.sameSegments || measured.overlapBp < floorBp) continue;
      emit(out, row(input.id, 'A5', 'REPORT', 'a synonym swap', `faces ${a} and ${b}: overlap ${measured.overlapBp} bp`,
        'the two faces share their opener, their sentence count and their content words, so they are one wording said twice'));
    }
  }
  return out;
}

// ── A6 · the four faces are claim-equal to their parent ─────────────────────────────

/** @param {string} text @returns {string[]} the slot names a text carries, sorted */
function slotsOf(text) {
  return [...new Set([...String(text || '').matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)]
    .map((hit) => hit[1]))].sort();
}

/**
 * ⭐ ARM A6, THE BYTE-EQUALITY HALF (ARCH §8.4). A face says the SAME claim with the SAME fills
 * to the SAME audience: its slot set and its mark set are byte-equal to its parent's.
 *
 * ⛔ THE CLAIM-EQUALITY HALF IS `scripts/check-pair.mjs` WITH THE LONGER ARM SUPPRESSED, and it
 * is not re-implemented here. That instrument owns the duration, count, ration, antithesis and
 * closer vocabularies; a second copy in `src/domain` would be a second home for a word list the
 * estate argues with by editing ONE file. The gate drives it with `longer: false`, because a
 * face is a SIBLING and not a rewrite: a longer face is a different wording, which is the point
 * of a wording set, while a longer REWRITE is the drift that arm was written to catch.
 * @param {{id: string, parent: {text: string, marks?: ReadonlyArray<string>},
 *   face: string, faceMarks?: ReadonlyArray<string>}} input
 * @returns {ComposedResult}
 */
export function armA6(input) {
  const out = emptyResult();
  const parentSlots = slotsOf(input.parent.text).join(' ');
  const faceSlots = slotsOf(input.face).join(' ');
  if (parentSlots !== faceSlots) {
    emit(out, row(input.id, 'A6', 'FAIL', 'slot set', `{${faceSlots || 'none'}} vs {${parentSlots || 'none'}}`,
      'a face names different slots from its parent, so the two are not eligible on the same towns and the wording set is not one record'));
  }
  const parentMarks = [...(input.parent.marks || [])].sort().join(' ');
  const faceMarks = [...(input.faceMarks || input.parent.marks || [])].sort().join(' ');
  if (parentMarks !== faceMarks) {
    emit(out, row(input.id, 'A6', 'FAIL', 'mark set', `[${faceMarks}] vs [${parentMarks}]`,
      'a face carries different marks from its parent, so the two answer different audiences inside one record'));
  }
  return out;
}

// ── A9 · fragment / sentence form, and the seam contract ────────────────────────────

/**
 * ⭐ ARM A9 (ARCH §2.5's closing line, T-F1, T-F8). A modifier row must FAIL the sentence
 * regex where it declares `FORM: fragment` and PASS it where it declares `FORM: sentence`.
 *
 * THE SEAM CONTRACT, stated once: the connective phrase — the comma AND the word — lives in
 * the CONNECTIVES LEAF and nowhere else. So a fragment opens on a bare lower-case word that is
 * no member of any clause list and never on a comma, and it carries no terminal stop, because
 * the composer supplies the stop when it closes the unit. A sentence-form row opens on a
 * capital that is not a `proper`-typed slot and closes on its own stop.
 * @param {{id: string, text: string, form?: string,
 *   clauseOpeners?: ReadonlyArray<string>, properSlots?: ReadonlyArray<string>}} input
 * @returns {ComposedResult}
 */
export function armA9(input) {
  const out = emptyResult();
  const text = String(input.text || '');
  if (input.form !== 'fragment' && input.form !== 'sentence') {
    emit(out, row(input.id, 'A9', 'NOT-EXECUTABLE', '(FORM)', String(input.form || 'absent'),
      'the row declares no FORM, which is every pool that ships today: no shipped pool declares `role: modifier`'));
    return out;
  }
  const openers = input.clauseOpeners || [];
  const proper = input.properSlots || [];
  // ⛔ A LEADING COMMA IS STRIPPED BEFORE THE FIRST TOKEN IS READ, so a row that breaks BOTH
  // halves of the seam contract at once reports both. Without the strip the first token of
  // `, and the muster is thin` is the comma itself, the clause-word limb reads an empty string
  // and the worst-shaped fragment in the vocabulary reports exactly one finding.
  const first = text.trim().replace(/^,\s*/, '').split(/\s+/)[0] || '';
  if (input.form === 'fragment') {
    if (/^\s*,/.test(text)) {
      emit(out, row(input.id, 'A9', 'FAIL', 'opens on a comma', text.slice(0, 24),
        'the comma lives in the connectives leaf and nowhere else, so a fragment that carries one joins twice'));
    }
    const bare = first.toLowerCase().replace(/[^a-z]/g, '');
    if (openers.includes(bare)) {
      emit(out, row(input.id, 'A9', 'FAIL', 'opens on a clause-list word', bare,
        'the joint is drawn from the connectives leaf, so a fragment opening on one of its words joins twice'));
    }
    if (/^[A-Z]/.test(first)) {
      emit(out, row(input.id, 'A9', 'FAIL', 'opens on a capital', first,
        'a fragment takes the clause seat inside the spine\'s own sentence, so it opens lower-case'));
    }
    if (/[.?]$/.test(text.trim())) {
      emit(out, row(input.id, 'A9', 'FAIL', 'carries a terminal stop', text.slice(-16),
        'the composer closes the unit after a clause-seat fragment, so a fragment that stops itself stops the unit twice'));
    }
    return out;
  }
  const opensProper = text.trim().match(/^\{([a-zA-Z_][a-zA-Z0-9_]*)\}/);
  if (opensProper && proper.includes(opensProper[1])) {
    emit(out, row(input.id, 'A9', 'FAIL', 'opens on a proper-typed slot', opensProper[1],
      'wall 10 widened across the join: a proper noun opens at most one variant per pool and never two adjacent'));
  } else if (!opensProper && !/^[A-Z]/.test(first)) {
    emit(out, row(input.id, 'A9', 'FAIL', 'does not open on a capital', first,
      'a sentence-seat modifier is its own sentence, so it opens on a capital'));
  }
  if (!/[.?]$/.test(text.trim())) {
    emit(out, row(input.id, 'A9', 'FAIL', 'carries no terminal stop', text.slice(-16),
      'a sentence-seat modifier is its own sentence and closes itself'));
  }
  return out;
}

// ── A11 · the echo bound ────────────────────────────────────────────────────────────

/**
 * ⭐ ARM A11 (ARCH §4.6, T-F10) — ONE PRODUCER FACT backs a modifier at at most ONE mount per
 * PAGE-SET, and at NO mount on a tab where that fact is a spine. The register card's "the FACT
 * must not recur", read at the modifier grain over car 0's fact index.
 *
 * ⛔ THE SPINE HALF IS THE STRICTER ONE AND IT IS NOT SYMMETRIC. A fact may spine at as many
 * mounts as its desks return it at; what is refused is a MODIFIER echoing a fact that already
 * spines somewhere the same reader will see. So the arm walks the modifier rows and consults
 * the spine rows, never the other way about.
 * @param {ReadonlyArray<{fact: string, key: string, role: string, mount: string}>} rows
 * @returns {ComposedResult}
 */
export function armA11(rows) {
  const out = emptyResult();
  const all = rows || [];
  const modifiers = all.filter((entry) => entry.role === 'modifier');
  if (!modifiers.length) {
    emit(out, row('(page-set)', 'A11', 'NOT-EXECUTABLE', '(modifier rows)', '0',
      'no pool in the supplied page-set declares `role: modifier`, which is the shipped state at this tip'));
    return out;
  }
  /** @type {Map<string, string[]>} */
  const spineMounts = new Map();
  for (const entry of all) {
    if (entry.role !== 'spine') continue;
    const seen = spineMounts.get(entry.fact) || [];
    if (!seen.includes(entry.mount)) seen.push(entry.mount);
    spineMounts.set(entry.fact, seen);
  }
  /** @type {Map<string, string[]>} */
  const byFact = new Map();
  for (const entry of modifiers) {
    const seen = byFact.get(entry.fact) || [];
    if (!seen.includes(entry.mount)) seen.push(entry.mount);
    byFact.set(entry.fact, seen);
  }
  for (const [fact, mounts] of byFact) {
    if (mounts.length > 1) {
      emit(out, row('(page-set)', 'A11', 'FAIL', 'the fact echoes', `${fact} at ${mounts.join(', ')}`,
        'one producer fact backs a modifier at more than one mount of a page-set, so the reader meets the same fact twice'));
    }
    const spined = (spineMounts.get(fact) || []).filter((mount) => mounts.includes(mount));
    if (spined.length) {
      emit(out, row('(page-set)', 'A11', 'FAIL', 'the fact already spines', `${fact} at ${spined.join(', ')}`,
        'a modifier states a fact that is a spine at the same mount, so the unit says twice what the page already said'));
    }
  }
  return out;
}

// ── Thread · subject continuity between adjacent sentences ──────────────────────────

/**
 * ⭐⭐ ARM THREAD (SITTING §T.4 adopting agenda C″; the owner, 2026-09-08 ~21:4x) — ADJACENT
 * SENTENCES OF A COMPOSED UNIT MUST CONNECT.
 *
 * A sentence connects to the one before it by CARRYING A NOUN FORWARD (a shared content word,
 * on the estate's one stop list), or it is THE PASSAGE'S ONE TURN OUTWARD, which is licensed
 * only in the LAST position and only once. Anything else is a MID-PASSAGE SHIFT: the line has
 * stopped and started somewhere else, and the reader is handed nothing to hold.
 *
 * ⛔ REPORT, NOT FAIL, UNTIL 8b's FIRST BATCH (the brief's item 4, SITTING §T.4 in terms). The
 * arm is landed with its plants so it is armed the day the first desk section is authored;
 * gating on it before a single composed unit exists would gate on nothing. Every verdict —
 * `carried`, `turn-outward` AND `broken` — is emitted, because ruling (c)'s distribution table
 * asks for THE THREAD VERDICTS and a table that printed only the failures could not tell a
 * corpus that threads from one that never had two sentences to thread.
 *
 * ⛔ ONE TURN, AND IT IS LAST. A second disconnect in the same unit is `broken` even if it is
 * final: "the one turn outward" is one. At the bound in force today (two sentences, one joint)
 * a unit has exactly one adjacent pair and the second sentence IS last, so `broken` is
 * unreachable on a lawful unit and reachable at once on a unit that exceeds the bound — which
 * is the shape the refuters' two thread findings at the taste took (a mid-passage tail that
 * hands nothing back; a doubled fact after the line has stopped).
 *
 * ⛔ AND IT IS NOT AN ECHO RULE. A11 counts FACTS; this arm counts NOUNS, and a noun carried
 * deliberately for the thread is the thing this arm ASKS for. The two are asserted apart in
 * the walker so neither can be quietly turned into the other.
 *
 * ⛔ THE SPLIT IS `entryWalker.sentencesOf`, THE ESTATE'S ONE SPLITTER, and the difference from
 * a local one matters: it neutralises `{slot}` markers first, so a fill can never manufacture
 * a sentence break. C″ names "a shared head noun OR SLOT", and the slot half needs no separate
 * reading here because this arm walks a COMPOSED unit, whose slots are already FILLED by step 7
 * — a shared `{seat}` reaches this arm as the seat's own filled noun, which `contentWords`
 * reads like any other. An UNFILLED row walked by hand would lose that half, and the walker
 * says so rather than leaving it to be discovered.
 *
 * @param {ComposedUnitRow} unit
 * @returns {ComposedResult}
 */
export function armThread(unit) {
  const out = emptyResult();
  const id = addressOf(unit);
  const sentences = sentencesOf(unit && unit.text);
  if (sentences.length < 2) {
    emit(out, row(id, 'Thread', 'NOT-EXECUTABLE', '(adjacent pairs)', String(sentences.length),
      'a unit of fewer than two sentences has no adjacent pair, so there is no thread to read'));
    return out;
  }
  let turns = 0;
  for (let at = 1; at < sentences.length; at += 1) {
    const before = sentences[at - 1];
    const here = sentences[at];
    const shared = contentWords(here).filter((word) => contentWords(before).includes(word)).sort();
    const last = at === sentences.length - 1;
    if (shared.length > 0) {
      emit(out, row(id, 'Thread', 'REPORT', `carried at sentence ${at + 1}`, shared.join(' '),
        'the sentence carries a noun forward from the one before it, which is the thread holding'));
      continue;
    }
    turns += 1;
    if (last && turns === 1) {
      emit(out, row(id, 'Thread', 'REPORT', `turn-outward at sentence ${at + 1}`, here.slice(0, 48),
        'the passage turns outward once, in the last position, which the thread rule licenses'));
      continue;
    }
    emit(out, row(id, 'Thread', 'REPORT', `broken at sentence ${at + 1}`, here.slice(0, 48),
      last
        ? 'a SECOND turn outward: the one turn the thread rule licenses has already been spent'
        : 'a MID-PASSAGE subject shift: the sentence hands nothing back and is not the last'));
  }
  return out;
}

// ── THE REFUTERS' GROUNDS, AS REPORTED ARMS (SITTING §T.5) ──────────────────────────

/**
 * ⛔⛔ WHY THESE FOUR ARMS EXIST, AND THE MEASUREMENT THAT ORDERED THEM (SITTING §T.5).
 *
 * "THE GATE'S BLIND SPOT, MEASURED: the gate read 0 owned findings on all 13 kept refinements;
 * the blind refuters failed 26 of 42 refined variants (12 A · 14 B) on grounds no owned arm
 * carries." The sitting ruled the wave's refute phase EXHAUSTIVE until the gate gains those
 * grounds as arms, and chartered them here as REPORTED arms.
 *
 * The refuters' seven classes, and where each lands:
 *   1. a qualification hung as a TAIL (R-DA-03)            → `armTail`, below
 *   2. a sibling PARAPHRASE beyond a synonym swap          → the gate's `siblingSpreadOf`,
 *      which reports the DISTANCE A5's detector cannot see (item 5b)
 *   3. a FORECAST (`never`) or a PERFECT ASPECT on a standing fact → `armAspect`
 *   4. an AMBIGUITY read after the defence spine           → `armAmbiguity`, WITHHELD
 *   5. a fact RESTATED inside one sentence                 → `armRestatement`
 *   6. costume in the syntax (a predicate-fronted inversion) → the grammar walker's own move
 *      ceiling already carries it; no second detector is minted
 *   7. a same-page contradiction with the CRITICAL ledger spine → armC7, which exists
 *
 * ⛔ EVERY ONE IS REPORT (or WITHHELD), NEVER FAIL. Refuters default to FAIL when uncertain, so
 * the sitting recorded that "the count overstates; the classes are real". An arm cut from an
 * overstating count and gated on the first day would refuse lawful prose, and a refused lawful
 * face is a trim. They report until a fold has read their rate on real wording sets.
 */

/** A qualifying tail is a comma followed by a hedge that adds no fact. */
const TAIL_HEDGES = Object.freeze([
  'at least for now', 'for now', 'for the moment', 'more or less', 'in a manner of speaking',
  'so to speak', 'in its way', 'in a sense', 'after a fashion', 'if it comes to that',
  'or so they say', 'or so it is said', 'as such', 'in the main', 'by and large',
  'all things considered', 'to a degree', 'up to a point', 'in any case', 'at any rate',
]);

/**
 * ⭐ ARM TAIL (SITTING §T.5, refuter class 1; R-DA-03) — A QUALIFICATION HUNG ON THE END.
 *
 * The move-grammar's R-DA-03 refuses a clause that qualifies the sentence away after it has
 * already been made. The shape the refuters caught is narrower and mechanical: a FINAL comma
 * clause that is one of the register's hedges and states no fact of its own. It is reported
 * with the tail quoted, because whether a given tail earns its place is the chair's call and
 * not a regex's.
 * @param {ComposedUnitRow} unit
 * @returns {ComposedResult}
 */
export function armTail(unit) {
  const out = emptyResult();
  const id = addressOf(unit);
  for (const sentence of sentencesOf(String(unit.text || ''))) {
    const at = sentence.lastIndexOf(',');
    if (at < 0) continue;
    const tail = sentence.slice(at + 1).replace(/[.?!]\s*$/, '').trim().toLowerCase();
    if (!tail) continue;
    const hedge = TAIL_HEDGES.find((phrase) => tail === phrase);
    if (!hedge) continue;
    emit(out, row(id, 'Tail', 'REPORT', 'a qualification hung as a tail', tail,
      'the sentence makes its claim and then takes some of it back in a final comma clause that'
      + ' states no fact of its own (R-DA-03; SITTING §T.5 refuter class 1)'));
  }
  return out;
}

/** A forecast, and a perfect aspect, in the register's own words. */
// `will never` and `shall never` are DROPPED as members: `never` already matches inside them,
// so keeping the compounds reports one clause twice and inflates the arm's own rate.
const FORECAST_WORDS = Object.freeze(['never', 'always', 'forever']);
const PERFECT_ASPECT = /\b(has|have|had) (?:never |always |long |already )?(?:been|stood|kept|held|paid|run|gone|come|grown|fallen|risen)\b/i;

/**
 * ⭐ ARM ASPECT (SITTING §T.5, refuter class 3) — A FORECAST OR A PERFECT ASPECT ON A STANDING
 * FACT.
 *
 * THE PROMISE's own ground: the record states what IS, and a standing fact has no history in
 * the corpus to have a perfect aspect about and no future to be forecast into. "The watch has
 * never been paid" claims a past the engine does not hold; "the gate will never shut" claims a
 * future no fact licenses. Both were refuter findings on both arms.
 * @param {ComposedUnitRow} unit
 * @returns {ComposedResult}
 */
export function armAspect(unit) {
  const out = emptyResult();
  const id = addressOf(unit);
  const text = String(unit.text || '');
  const lower = text.toLowerCase();
  for (const word of FORECAST_WORDS) {
    if (!new RegExp(`\\b${word}\\b`).test(lower)) continue;
    emit(out, row(id, 'Aspect', 'REPORT', 'a forecast on a standing fact', word,
      'the record states what IS; a standing fact carries no future for a forecast to reach'));
  }
  const perfect = text.match(PERFECT_ASPECT);
  if (perfect) {
    emit(out, row(id, 'Aspect', 'REPORT', 'a perfect aspect on a standing fact', perfect[0],
      'the perfect aspect claims a history the engine does not hold for this fact'));
  }
  return out;
}

/**
 * ⭐ ARM RESTATEMENT (SITTING §T.5, refuter class 5) — A FACT SAID TWICE INSIDE ONE SENTENCE.
 *
 * Not the echo bound (A11 counts facts across a PAGE-SET) and not the thread rule (which asks
 * for a carried noun BETWEEN sentences). This is one sentence whose two halves say the same
 * thing: the clauses either side of a joint share their content words. The threshold is the
 * estate's own overlap ruler in basis points, and it is high on purpose — a shared noun is the
 * thread doing its job, and only a near-total overlap is a restatement.
 * @param {ComposedUnitRow} unit
 * @param {{restatementFloorBp?: number, [key: string]: unknown}} [options] the walk's own
 *   option bag, of which this arm reads one key; typed open so `walkComposed` can hand over
 *   the same object every other arm receives rather than a second one built for this arm
 * @returns {ComposedResult}
 */
export function armRestatement(unit, options = {}) {
  const out = emptyResult();
  const id = addressOf(unit);
  const floor = typeof options.restatementFloorBp === 'number' ? options.restatementFloorBp : 6000;
  for (const sentence of sentencesOf(String(unit.text || ''))) {
    const clauses = clausesOf(sentence).filter((clause) => contentWords(clause).length >= 2);
    for (let at = 1; at < clauses.length; at += 1) {
      const { overlapBp } = siblingDistance(clauses[at - 1], clauses[at]);
      if (overlapBp < floor) continue;
      emit(out, row(id, 'Restatement', 'REPORT', 'a fact restated inside one sentence',
        `${overlapBp} bp overlap · "${clauses[at - 1].trim()}" / "${clauses[at].trim()}"`,
        'the two halves of one sentence carry the same content words, so the second half adds'
        + ' emphasis rather than a fact (SITTING §T.5 refuter class 5)'));
    }
  }
  return out;
}

/** The readings the refuters caught opening a claim after the defence spine. */
const AMBIGUOUS_AFTER_SPINE = Object.freeze([
  'without cover', 'short of its charge', 'under strength', 'out of hand', 'in name only',
  'past its best', 'beyond its means', 'off the books',
]);

/**
 * ⭐ ARM AMBIGUITY (SITTING §T.5, refuter class 4) — A PHRASE THAT OPENS A SECOND READING.
 *
 * ⛔ WITHHELD, NOT REPORT, AND THE CHANNEL IS THE RULING. The refuters' finding is that a
 * phrase like `without cover` reads one way beside a wall and another beside a muster, so the
 * claim it makes depends on what the reader just read. That is a QUESTION FOR A REFUTER and not
 * a mechanical verdict — WITHHELD is the estate's channel for exactly that, and `verdictOf`
 * treats a WITHHELD row as never a pass.
 * @param {ComposedUnitRow} unit
 * @returns {ComposedResult}
 */
export function armAmbiguity(unit) {
  const out = emptyResult();
  const id = addressOf(unit);
  const lower = String(unit.text || '').toLowerCase();
  for (const phrase of AMBIGUOUS_AFTER_SPINE) {
    if (!lower.includes(phrase)) continue;
    emit(out, row(id, 'Ambiguity', 'WITHHELD', 'a reading that depends on the spine', phrase,
      'this phrase carries a second reading beside a different spine, so what the unit claims'
      + ' depends on what the reader just read; a refuter answers it, never a regex'));
  }
  return out;
}

// ── A13 · the PROVENANCE move ───────────────────────────────────────────────────────

/** The three standings the holder census answers with; the two that do not license a citation. */
export const UNLICENSED_SOURCE = Object.freeze(['SOURCE-UNRESOLVED', 'OFFICE']);

/**
 * The PROVENANCE clauses of a text, read through the shared classifier and not a second regex.
 * @param {string} text
 * @returns {number} how many times the unit names the holder of a record
 */
export function provenanceCount(text) {
  return classifyMoves(text).filter((move) => move === 'PROVENANCE').length;
}

/**
 * ⭐ ARM A13 — THE PROVENANCE MOVE (owner 2026-09-08, SITTING §Q; MOVE-GRAMMAR §4.4.3).
 *
 * A cited claim is TWO licensed claims: the fact, and the record that holds it. So a citation
 * is COUNTED per pool and per register on the REPORT channel until the sitting sets its budget
 * from the bands, and a citation whose holder the census does not license is WITHHELD.
 *
 * ⛔ THE `source` COLUMN LANDED AT SEAM CAR 5b — `{kind, holder, standing}` per pool, written by
 * `holderTable.js` into every census row — and this arm was written to meet it with no change
 * of its own: a caller that hands it `sourceOf` gets the WITHHELD and FAIL limbs below, and a
 * caller that hands it none still answers NOT-EXECUTABLE naming the column rather than passing
 * by default. The COUNT is reported either way, because the budget is still the sitting's.
 *
 * ⛔ AND NO NEW MARK IS MINTED. The owner's rule gives the DM face of an INTERESTED fact a
 * `holder` mark "the audience filter reads (a `dm-only` mark today)". `dm-only` is a mark the
 * projector already emits and the kernel already filters on, so the arm asks for it by name
 * and the mark vocabulary gains nothing. Had a new mark been needed this arm would have been a
 * refusal with its measurement instead.
 * @param {ComposedUnitRow} unit
 * @param {{register?: string, sourceOf?: (key: string) => {kind: string, holder: string|null,
 *   standing: string}|null}} options
 * @returns {ComposedResult}
 */
export function armA13(unit, options) {
  const out = emptyResult();
  const id = addressOf(unit);
  const cited = provenanceCount(unit.text);
  const register = options.register || 'R1';
  if (cited === 0) return out;
  emit(out, row(id, 'A13', 'REPORT', `citations in ${register}`, String(cited),
    'the unit names the holder of a record, which is a PROVENANCE move and spends a budget the sitting has not yet set'));
  if (!options.sourceOf) {
    emit(out, row(id, 'A13', 'NOT-EXECUTABLE', '(census source column)', 'absent',
      'this caller brought no reader of the holder census, so no cited holder can be licensed or refused here'));
    return out;
  }
  for (const piece of piecesOf(unit)) {
    if (provenanceCount(piece.text) === 0) continue;
    const held = options.sourceOf(piece.key);
    if (!held) {
      emit(out, row(id, 'A13', 'WITHHELD', 'a cited holder the census does not license', piece.key,
        'the holder census carries no source row for this pool, so the citation names a record the world may not hold'));
      continue;
    }
    if (UNLICENSED_SOURCE.includes(held.standing)) {
      emit(out, row(id, 'A13', 'WITHHELD', 'a cited holder the census does not license', `${piece.key}: ${held.standing}`,
        'the fact\'s source is unresolved or is the office\'s own books, so the citation cites the speaker rather than a record'));
      continue;
    }
    if (held.holder === null) {
      emit(out, row(id, 'A13', 'WITHHELD', 'a holder with no institution', `${piece.key}: ${held.kind}`,
        'the holder kind resolves to no institution in this town\'s roster, so the cited record has nobody keeping it'));
      continue;
    }
    const marks = piece.marks || [];
    if (held.standing !== 'LICENSED' && !marks.includes('dm-only')) {
      emit(out, row(id, 'A13', 'FAIL', 'an interested holder on the player face', `${piece.key}: ${held.kind}`,
        'the holder of this record is a power with an interest in it, so the citing face is the DM\'s and carries the dm-only mark'));
    }
  }
  return out;
}

// ── C7 · cross-block sibling agreement on a page-set ────────────────────────────────

/**
 * ⭐ ARM C7 (ARCH §4.6, T-F11) — SIBLING AGREEMENT ACROSS BLOCKS, on one page-set.
 *
 * ⛔ WHY IT IS NEW AND WHY `armC5` MAY NOT BE WIDENED INTO IT. C5's documented population is
 * "the OTHER variants of this pool cell", where a disagreement is a FAIL because siblings must
 * agree BY CONSTRUCTION: one predicate selected both. Two units at two mounts of one page were
 * selected by two different predicates about two different subsystems, so a band disagreement
 * between them is EVIDENCE and not proof — the two may be banding two different nouns that
 * share a word. Hence a separate arm, and hence REPORT before FAIL (§8.4's own channel).
 *
 * ⛔ ONLY CROSS-BLOCK PAIRS ARE COMPARED. Two units of ONE block at one page are C5's and the
 * position budget's; comparing them here would double-report every within-block finding.
 * @param {ReadonlyArray<ComposedUnitRow>} pageSet
 * @returns {ComposedResult}
 */
export function armC7(pageSet) {
  const out = emptyResult();
  const units = pageSet || [];
  const blocks = new Set(units.map((unit) => unit.blockId));
  if (blocks.size < 2) {
    emit(out, row('(page-set)', 'C7', 'NOT-EXECUTABLE', '(blocks)', String(blocks.size),
      'a cross-block comparison needs two blocks on the page-set'));
    return out;
  }
  const facts = units.map((unit) => typedFactsOf({ id: addressOf(unit), text: unit.text }));
  for (let a = 0; a < units.length; a += 1) {
    for (let b = a + 1; b < units.length; b += 1) {
      if (units[a].blockId === units[b].blockId) continue;
      for (const [noun, band] of Object.entries(facts[a].bands)) {
        const other = facts[b].bands[noun];
        if (!other || other === band) continue;
        emit(out, row(`${addressOf(units[a])} vs ${addressOf(units[b])}`, 'C7', 'REPORT',
          'two blocks band one noun differently', `${noun}: ${band} vs ${other}`,
          `${units[a].blockId} bands "${noun}" as ${band} and ${units[b].blockId} bands it ${other} on one page-set; whether they name one subject is the refuter's`));
      }
    }
  }
  return out;
}

// ── the walk, the sample, and the exhaustive block re-walk ──────────────────────────

/**
 * ⭐ THE COMPOSED WALK. The unit through `walkEntry` (every claim class the estate already
 * owns, now over the JOIN) and through the composed-only arms beside it.
 *
 * ⛔ THE TWO RESULTS ARE RETURNED APART AND NOT MERGED. `walkEntry` answers in its own closed
 * `klass` vocabulary (C1..C6, D, Q, X, F25, W) and the composed arms answer in theirs; folding
 * one list into the other would give a reader one array whose rows mean two different things
 * and would put a channel the entry walker does not have (REPORT) into its results.
 * @param {ComposedUnitRow} unit
 * @param {import('./entryWalker.js').EntryGround} ground
 * @param {{relations?: Readonly<Record<string, ReadonlyArray<{relation: string,
 *   direction: string}>>>, primaryOf?: (key: string) => string, fieldOf?: (key: string) => string,
 *   siblingKeys?: ReadonlyArray<string>, register?: string,
 *   readsOf?: (key: string) => ReadonlyArray<string>,
 *   vocabularyOf?: (key: string) => Readonly<Record<string, ReadonlyArray<string>>>,
 *   sourceOf?: (key: string) => {kind: string, holder: string|null, standing: string}|null}} [options]
 * @returns {{entry: import('./entryWalker.js').WalkResult, composed: ComposedResult,
 *   order: {moves: string[], id: string, level: 0|1|2}}}
 */
export function walkComposed(unit, ground, options = {}) {
  const composed = emptyResult();
  mergeResults(composed, armA1(unit));
  mergeResults(composed, armA2(unit, options));
  mergeResults(composed, armA3(unit, options));
  mergeResults(composed, armA13(unit, options));
  // ⛔ THREAD LAST, AND REPORT-ONLY. Its rows never reach `composedVerdictOf` (REPORT is not a
  // channel that verdict reads), so landing it changes no pool's verdict at any tip before 8b.
  mergeResults(composed, armThread(unit));
  // ⛔ THE REFUTERS' GROUNDS (SITTING §T.5), REPORT AND WITHHELD ONLY. `armAmbiguity` is the one
  // that can move a verdict, and it moves it to WITHHELD — a question a refuter owes an answer
  // on, which is the channel the sitting named for it.
  mergeResults(composed, armTail(unit));
  mergeResults(composed, armAspect(unit));
  mergeResults(composed, armRestatement(unit, options));
  mergeResults(composed, armAmbiguity(unit));
  return {
    entry: walkEntry(composedEntryOf(unit, {
      register: options.register,
      // ARM Q's own two columns, taken from the caller's census readers where it brought them.
      reads: options.readsOf ? options.readsOf(unit.poolKey) : undefined,
      vocabulary: options.vocabularyOf ? options.vocabularyOf(unit.poolKey) : undefined,
    }), ground),
    composed,
    order: composedOrderOf(unit),
  };
}

/**
 * The verdict for one composed walk. PASS means no FAIL on either side and never "nothing was
 * found": a WITHHELD row is a question the refuter owes an answer on and a NOT-EXECUTABLE row
 * is an input the ground did not carry, and this function says so.
 * @param {{entry: import('./entryWalker.js').WalkResult, composed: ComposedResult}} result
 * @returns {'FAIL'|'WITHHELD'|'PASS'}
 */
export function composedVerdictOf(result) {
  if (result.entry.fails.length || result.composed.fails.length) return 'FAIL';
  if (result.entry.withheld.length || result.composed.withheld.length) return 'WITHHELD';
  return 'PASS';
}

/**
 * ⭐ THE SAMPLE (ARCH §8.4's last two rows) — EXHAUSTIVE per piece, SAMPLED per composition.
 *
 * ⛔ A DETERMINISTIC STRIDE OVER THE SORTED ADDRESSES, AND NOT A SEEDED DRAW. Two reasons, and
 * the second is the load-bearing one. A seeded draw would need a hash, and
 * `tests/lint/fnv1a32Identity.walker.test.js` holds the estate at its current count of
 * `fnv1a32` definitions SHRINK-ONLY, so an instrument minting a twenty-third copy reds by name.
 * And a stride is REPRODUCIBLE FROM THE PRINTED N ALONE: a reader with the corpus and the
 * number can rebuild the exact sample without being told a seed, which is what makes the
 * printed sha a check on the walk rather than a decoration.
 *
 * N is set at car 6 from the measured per-entry cost. This function takes it as an argument so
 * the placeholder and the ruled value are the same code path.
 * @param {ReadonlyArray<ComposedUnitRow>} units
 * @param {number} n
 * @returns {{n: number, total: number, picked: ComposedUnitRow[], addresses: string[]}}
 */
export function sampleOf(units, n) {
  const all = [...(units || [])].sort((a, b) => {
    const left = addressOf(a);
    const right = addressOf(b);
    if (left === right) return 0;
    return left < right ? -1 : 1;
  });
  const want = Math.max(0, Math.min(Math.trunc(n), all.length));
  if (want === 0) return { n: 0, total: all.length, picked: [], addresses: [] };
  const stride = Math.max(1, Math.floor(all.length / want));
  /** @type {ComposedUnitRow[]} */
  const picked = [];
  for (let at = 0; at < all.length && picked.length < want; at += stride) picked.push(all[at]);
  for (let at = 0; at < all.length && picked.length < want; at += 1) {
    if (!picked.includes(all[at])) picked.push(all[at]);
  }
  return {
    n: picked.length, total: all.length, picked, addresses: picked.map(addressOf),
  };
}

/**
 * ⭐ THE EXHAUSTIVE BLOCK RE-WALK AT A MODIFIER LANDING (ARCH §8.4's last row, T-F13).
 *
 * A modifier landing changes what every OTHER spine of its block composes to, because
 * `check-pair`'s `axisOf` falls back to every band of the block for a capital-initial key: the
 * new pool joins the sibling set every existing variant is verdicted against. So a landing
 * re-walks the block WHOLE — every variant of every spine pool, not a sample — and the sample
 * stays for the composed units.
 * ⛔ THE OPTIONS REACH THE ARMS. Until SEAM car 5c this function called `walkComposed(unit,
 * ground)` with no third argument, so a caller's `siblingKeys`, `relations`, `primaryOf`,
 * `fieldOf`, `register` and `sourceOf` were dropped at the door and A2, A3 and A13 answered
 * about the DRIVER rather than about the block (the seam fold's 4b, SITTING §R). A3 was the
 * visible one: it read `options.siblingKeys` as `[]` and FAILed 'no sibling names the
 * alternative' on every contrast-carrying unit. A3 now distinguishes an absent sibling set
 * from an empty one, so a caller that brings nothing gets NOT-EXECUTABLE and never a
 * manufactured FAIL; and this function hands the arms what it was given.
 * @param {ReadonlyArray<ComposedUnitRow>} units every unit the block can compose
 * @param {import('./entryWalker.js').EntryGround} ground
 * @param {{landing?: string, relations?: Readonly<Record<string, ReadonlyArray<{relation: string,
 *   direction: string}>>>, primaryOf?: (key: string) => string, fieldOf?: (key: string) => string,
 *   siblingKeys?: ReadonlyArray<string>, register?: string,
 *   sourceOf?: (key: string) => {kind: string, holder: string|null, standing: string}|null}}
 *   [options] the modifier key whose landing occasioned the re-walk, and the arms' own ground
 * @returns {{walked: number, verdicts: Record<string, number>, findings: ComposedResult}}
 */
export function reWalkBlock(units, ground, options = {}) {
  const findings = emptyResult();
  /** @type {Record<string, number>} */
  const verdicts = {
    FAIL: 0, WITHHELD: 0, PASS: 0,
  };
  const all = units || [];
  if (!all.length) {
    emit(findings, row(options.landing || '(block)', 'block-re-walk', 'NOT-EXECUTABLE',
      '(units)', '0', 'no unit was supplied, so the block was not re-walked and nothing may be read as green'));
    return { walked: 0, verdicts, findings };
  }
  for (const unit of all) {
    const result = walkComposed(unit, ground, options);
    verdicts[composedVerdictOf(result)] += 1;
    mergeResults(findings, result.composed);
  }
  return { walked: all.length, verdicts, findings };
}

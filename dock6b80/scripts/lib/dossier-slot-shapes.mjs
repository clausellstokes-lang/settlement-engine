/**
 * dossier-slot-shapes.mjs — THE SLOT SHAPE REGISTER, parsed from the two annexes.
 *
 * THE DEFECT THIS EXISTS TO MAKE IMPOSSIBLE. A dossier-prose slot has always had a NAME
 * and a SEMANTIC gloss and no declared GRAMMATICAL SHAPE. The sentence author assumes one
 * shape, the fill author assumes another, and nothing in the tree compares them. Measured
 * at f5a6c3bbf: `ACCESS_PROSE.road` was `'the road'` while all eight `{access}` seams
 * already supplied their own determiner, so every one of them rendered "off its the road",
 * "the the river carries all of it", "a working the road" — and 2,445 test files were
 * green over it, because every assertion in the estate is about shape, arm, identity or
 * determinism and none is about the rendered sentence.
 *
 * SO THE SHAPE IS DECLARED WHERE THE SLOT IS DECLARED, and this module is the ONE reader
 * of that declaration. It is imported by scripts/generate-dossier-state-prose.mjs (which
 * throws at projection time when a used slot carries no shape) and by
 * tests/data/dossierStateProseProjection.contract.test.js (which renders against it).
 *
 * WHY A MODULE AND NOT A FUNCTION IN THE GENERATOR. The generator is a top-level-await
 * script with side effects: importing it RUNS it, and outside `--check` that WRITES all
 * seven leaves. A test that imported a parser from it would rewrite the corpus as a side
 * effect of reading it. One home, no side effects, both callers import it.
 *
 * PURE: no I/O, no state, no clock. The callers read the files.
 */

/** The town whose page this is, a faction, a treaty, a road — a NAME. */
export const SHAPE_PROPER = 'proper';
/** A lowercase common-noun phrase. The SENTENCE supplies the article; the fill never does. */
export const SHAPE_BARE_COMMON = 'bare-common';
/** A lowercase free phrase used adverbially or predicatively; it supplies its own everything. */
export const SHAPE_PHRASE = 'phrase';
/**
 * RESERVED. `{band}` is one name for six incompatible roles (proportion-of, bare object,
 * degree adverbial, attributive quantifier, plural subject, frequency) across 37 uses in
 * 26 blocks. No single fill satisfies all six, so no shape can be declared until the slot
 * is split the way §0d already splits duration into four named forms. A fill table for a
 * RESERVED slot is refused rather than checked.
 */
export const SHAPE_RESERVED = 'RESERVED';

/** The closed set. A row carrying anything else is a parse error, never a default. */
export const SLOT_SHAPES = Object.freeze([
  SHAPE_PROPER, SHAPE_BARE_COMMON, SHAPE_PHRASE, SHAPE_RESERVED,
]);

/** Articles and possessive determiners a seam supplies and a fill must therefore not. */
const LEADING_DETERMINER = /^(the|a|an|its|his|her|their|our|this|that|these|those)\b/i;
/** A gloss separator. VOICE_AND_TONE bans it from reader-facing prose outright. */
const DASH = /[—–]/;
/** A body, not a phrase — the simulationSpine splice-guard's own test. */
const SENTENCE_BREAK = /[.!?]\s|[.!?]$/;
/** §0d bans digits from dossier-state prose outright. */
const DIGIT = /[0-9]/;
/** A raw engine token (snake_case) must never reach a reader. */
const ENGINE_TOKEN = /[a-z]+_[a-z]+/;

/**
 * A markdown table row's cells, or null when the line is not a table row.
 * @param {string} line
 * @returns {string[]|null}
 */
function cellsOf(line) {
  if (!line.startsWith('|')) return null;
  const body = line.replace(/^\|/, '').replace(/\|\s*$/, '');
  return body.split('|').map((c) => c.trim());
}

/**
 * Parse every `| {slot} | <shape> | … |` register row out of an annex.
 *
 * THE COLUMN IS FOUND BY ITS HEADER, never by index: §0c is `Slot | Shape | Fills with`,
 * §0c-2 is `Slot | Shape | Fills with | Minted by`, and the causal annex carries two more
 * tables of its own. A positional read would silently take `Minted by` for a shape on one
 * of them, and a shape token is exactly the kind of value that looks fine until it is
 * wrong everywhere at once.
 *
 * A row whose shape cell is missing, empty, or not one of the four tokens THROWS. A parser
 * that silently returned `{}` would make every arm built on it vacuous at the same moment.
 *
 * `{timeband_*}` declares a PREFIX family: the four named forms §0d tabulates share one
 * shape and one row. A wildcard that matches no used slot is itself an error (see
 * assertSlotShapesTotal), so a dead wildcard cannot hide a missing declaration.
 *
 * @param {string} md the annex source
 * @param {string} label for error messages
 * @returns {{exact: Record<string,string>, prefixes: Array<{prefix: string, shape: string}>}}
 */
export function parseSlotShapes(md, label) {
  /** @type {Record<string,string>} */
  const exact = {};
  /** @type {Array<{prefix: string, shape: string}>} */
  const prefixes = [];
  let shapeCol = -1;
  let slotCol = -1;
  for (const raw of md.split('\n')) {
    const line = raw.trimEnd();
    const cells = cellsOf(line);
    // A table ENDS at the first non-table line and the column map dies with it. Both
    // annexes carry other `| Slot | … |` tables — WRITER-2's per-cluster minting table is
    // one — and a map that outlived its table read that table's SECOND column as a shape
    // and threw on a prose gloss. The map is armed by a header and by nothing else.
    if (!cells) { shapeCol = -1; slotCol = -1; continue; }
    const lower = cells.map((c) => c.toLowerCase());
    if (lower.includes('slot')) {
      slotCol = lower.indexOf('slot');
      shapeCol = lower.includes('shape') ? lower.indexOf('shape') : -1;
      continue;
    }
    if (shapeCol < 0 || cells.length <= Math.max(slotCol, shapeCol)) continue;
    const nameCell = cells[slotCol];
    const m = nameCell.match(/^`\{([a-zA-Z_][a-zA-Z0-9_]*(?:_\*)?)\}`$/);
    if (!m) continue;
    const shape = cells[shapeCol];
    if (!SLOT_SHAPES.includes(shape)) {
      throw new Error(
        `${label}: slot \`{${m[1]}}\` declares shape "${shape}", which is not one of `
        + `${SLOT_SHAPES.join(' | ')}. A shape is declared or the slot is not registered; `
        + 'there is no default.',
      );
    }
    if (m[1].endsWith('_*')) {
      prefixes.push({ prefix: m[1].slice(0, -1), shape });
      continue;
    }
    if (exact[m[1]] && exact[m[1]] !== shape) {
      throw new Error(
        `${label}: slot \`{${m[1]}}\` is declared twice with different shapes `
        + `("${exact[m[1]]}" then "${shape}"). One slot, one shape.`,
      );
    }
    exact[m[1]] = shape;
  }
  if (Object.keys(exact).length === 0 && prefixes.length === 0) {
    throw new Error(`${label}: no slot register row found — the Shape column is missing or renamed.`);
  }
  return { exact, prefixes };
}

/**
 * Merge the registers of the two annexes into one lookup.
 *
 * The register is SPLIT ACROSS TWO FILES and neither is complete on its own: six slots
 * the corpus uses (`{house}` `{temple}` `{third_party}` `{war}` `{wound}` `{burden}`) are
 * registered only in the causal annex, and the state annex's §0c-2 carries seventeen the
 * causal one does not. A guard reading one file would report six phantom gaps and miss
 * nothing real.
 *
 * @param {Array<{exact: Record<string,string>, prefixes: Array<{prefix: string, shape: string}>}>} registers
 * @returns {{shapeOf: (slot: string) => string|undefined, exact: Record<string,string>, prefixes: Array<{prefix: string, shape: string}>}}
 */
export function mergeSlotShapes(registers) {
  /** @type {Record<string,string>} */
  const exact = {};
  /** @type {Array<{prefix: string, shape: string}>} */
  const prefixes = [];
  for (const reg of registers) {
    for (const [slot, shape] of Object.entries(reg.exact)) {
      if (exact[slot] && exact[slot] !== shape) {
        throw new Error(
          `slot \`{${slot}}\` is declared "${exact[slot]}" in one annex and "${shape}" in `
          + 'the other. A slot shared between the two registers carries ONE shape.',
        );
      }
      exact[slot] = shape;
    }
    for (const p of reg.prefixes) {
      if (!prefixes.some((q) => q.prefix === p.prefix && q.shape === p.shape)) prefixes.push(p);
    }
  }
  const shapeOf = (slot) => exact[slot]
    ?? prefixes.find((p) => slot.startsWith(p.prefix))?.shape;
  return { shapeOf, exact, prefixes };
}

/**
 * Every slot any variant names must carry a declared shape, and every wildcard must earn
 * its row. Returns the two gap lists rather than throwing, so a caller can report both at
 * once; the generator throws on either.
 *
 * @param {{shapeOf: (slot: string) => string|undefined, prefixes: Array<{prefix: string, shape: string}>}} register
 * @param {Iterable<string>} usedSlots every slot name the corpus actually uses
 * @returns {{undeclared: string[], deadPrefixes: string[]}}
 */
export function assertSlotShapesTotal(register, usedSlots) {
  const used = [...new Set(usedSlots)].sort();
  const undeclared = used.filter((slot) => register.shapeOf(slot) === undefined);
  const deadPrefixes = register.prefixes
    .filter((p) => !used.some((slot) => slot.startsWith(p.prefix)))
    .map((p) => `${p.prefix}*`);
  return { undeclared, deadPrefixes };
}

/**
 * Does this fill value obey its slot's declared shape? Returns the violated rule, or ''.
 *
 * THIS IS THE EXACT PREDICATE, and it deliberately needs no parse of the seam. The seam
 * heuristic ("is there a determiner three words back with only modifiers between?") is a
 * guess about English and its failure mode is a silent false negative. The shape contract
 * removes the guess: a `bare-common` fill may not carry a determiner ANYWHERE it lands,
 * because the shape's whole content is that the SENTENCE supplies one. That convicts
 * `'the road'` against all eight of its seams and against none of them equally — it
 * convicts the TABLE.
 *
 * `phrase` deliberately permits a leading determiner: it is the adverbial/predicative
 * shape, it supplies its own everything, and `{reason}` fills seams like "because of
 * {reason}" where an article-less noun would be ungrammatical.
 *
 * @param {string} shape one of SLOT_SHAPES
 * @param {string} value the fill
 * @returns {string} the violated rule, or '' when the fill conforms
 */
export function fillShapeViolation(shape, value) {
  if (typeof value !== 'string' || value.trim() === '') return 'EMPTY-FILL';
  const v = value.trim();
  if (shape === SHAPE_RESERVED) return 'RESERVED-SLOT-HAS-NO-DECLARABLE-FILL';
  if (DASH.test(v)) return 'DASH-IN-FILL';
  if (SENTENCE_BREAK.test(v)) return 'SENTENCE-IN-FILL';
  if (DIGIT.test(v)) return 'DIGIT-IN-FILL';
  if (ENGINE_TOKEN.test(v)) return 'ENGINE-TOKEN-IN-FILL';
  if (shape === SHAPE_PROPER) {
    return /^[A-Z]/.test(v) ? '' : 'PROPER-FILL-IS-NOT-CAPITALISED';
  }
  if (LEADING_DETERMINER.test(v)) {
    return shape === SHAPE_PHRASE ? '' : 'DETERMINER-IN-FILL';
  }
  return /^[a-z]/.test(v) ? '' : 'COMMON-FILL-IS-CAPITALISED';
}

/** The digit words, so a fixture built from a slot name never smuggles §0d's banned digit in. */
const DIGIT_WORDS = Object.freeze(['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']);

/**
 * A slot name as prose words. `{faction2}` becomes "faction two" rather than "faction2":
 * §0d bans digits from dossier prose outright, so a fixture carrying one convicts itself
 * and reports the FIXTURE's defect as the corpus's.
 * @param {string} slot @returns {string}
 */
function slotWords(slot) {
  return slot.replace(/_/g, ' ').replace(/[0-9]/g, (d) => ` ${DIGIT_WORDS[Number(d)]}`).replace(/\s+/g, ' ').trim();
}

/**
 * A canonical conforming fill for a slot, used as the contract test's fixture. Built FROM
 * the declared shape rather than hand-written, so a fixture can never teach a shape the
 * register does not declare — which is exactly how `fullSlots`'s `the ${slot}` propagated
 * the defect into the one place an implementer looks for the contract.
 *
 * `phrase` takes the conservative (determiner-free) form rather than its widest legal one:
 * the fixture's job is to exercise the SEAM, and a fill that supplies its own article
 * would insert nonsense into the article-supplying seams and prove nothing about either.
 * @param {string} shape @param {string} slot @returns {string}
 */
export function conformantFill(shape, slot) {
  const words = slotWords(slot);
  // A DISTINCT name per proper slot. One shared 'Thornwall' made "the {seat} at
  // {settlement}" render "the Thornwall at Thornwall", which is indistinguishable prose
  // and which a liveness probe cannot tell apart when it asks whether the line that named
  // one slot went away.
  return shape === SHAPE_PROPER
    ? words.replace(/(^| )([a-z])/g, (_m, sp, c) => sp + c.toUpperCase())
    : words;
}

/**
 * The ADVERSARIAL fixture: the shape violated in exactly one way, so the guard's own
 * non-vacuity control has something to convict. This is the fill table as it stood before
 * the cure — a determiner the sentence already supplied.
 * @param {string} shape @param {string} slot @returns {string}
 */
export function determinerFill(shape, slot) {
  return shape === SHAPE_PROPER ? conformantFill(shape, slot) : `the ${slotWords(slot)}`;
}

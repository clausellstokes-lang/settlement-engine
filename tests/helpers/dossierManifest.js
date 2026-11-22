/**
 * tests/helpers/dossierManifest.js — THE COMPOSED-PROSE MANIFEST, AND ITS SINGLE WRITER.
 *
 * WHAT IT IS (ARCH §3.7). The generator golden master hashes the serialised settlement and
 * provably cannot see a dossier SENTENCE: `readStateProse` is called only from
 * `src/domain/display/stateProse/*`. Its fixture is one sha per row — a shape that can say a
 * row moved and nothing else. The composed-prose model needs an instrument that says WHAT
 * moved, per cell, so that a signed car can be accepted on a classification rather than on a
 * diff. This module is that instrument's measurement half.
 *
 * ⛔ THE SINGLE WRITER OF THE MEASUREMENT, AND WHY THAT MATTERS HERE. The suite, the cells
 * script and the duplicate-unit script all import THIS module; none of them re-spells a cell.
 * The estate's own precedent is `tests/simulation/presetLightingWitnessRun.js`, imported by
 * its suite "so the recorded world and the asserted world cannot diverge", and the reason is
 * the same: an instrument whose recorder and whose asserter compute the cell differently
 * reports green about two different worlds.
 *
 * ── THE CELL, AND WHAT IS SYNTHESISED AT THIS TIP (M-F6) ────────────────────────────
 * A cell is `${keyOf(config)}::${audience}::${mount}::${rungIndex}` and carries
 * `{pool, vid, index, face, angle, pieces[], textSha}`. Two of those do not exist in the
 * shipped shape yet and are SYNTHESISED, declared here rather than discovered later:
 *
 *   `face`   0 always. Faces are car 3a's; a recorded 0 is a claim that this tip has one
 *            wording per variant, and car 3a's own arm asserts the composer reproduces it.
 *   `pieces` `[{role: 'spine', key: poolKey, vid, index, face: 0}]` — the one-piece unit
 *            every rung is today. ARCH §3.7: car 3a asserts the composer's `pieces` for an
 *            EMPTY candidate list is identical to this synthesis.
 *   `vid`    the variant's 0-based position in its pool AS AUTHORED. Car 4 mints a real
 *            `vid`; for it to be a re-index detector at all it must reproduce this ordering
 *            on an unchanged corpus, which is exactly what this synthesis pins.
 *
 * `index` is NOT synthesised either: it is the identified variant's position within the
 * AUDIENCE-FILTERED pool, which is the coordinate the two audiences can differ on and the one
 * the mixed-pool control reads. `vid` is its position in the pool as authored, which they
 * cannot.
 *
 * ⚠ HOW A CELL'S VARIANT IS IDENTIFIED, AND WHY NOT BY RECOMPUTING THE DRAW. `drawVariant`
 * selects `eligible[hash % eligible.length]`, and `eligibleVariants` filters by audience, by
 * slot ANCHORING and by state DIMENSIONS. This module can see the audience filter and NOT the
 * other two: the slot bag lives inside the desk call. A recomputation over the audible pool
 * therefore disagrees with the shipped draw on every pool where a variant names a slot the
 * call site did not fill — measured at 59 of 805 cells on six towns before this was cured.
 *
 * So the variant is identified from the RENDERED SENTENCE: the one variant of the pool whose
 * ANGLE matches the rung's and whose template, with each `{slot}` standing for anything,
 * matches the rendered text. That is a recomputation of an observed fact rather than of an
 * unobservable filter. Every cell still carries `drawAgrees` — whether the audible-pool
 * recomputation would have chosen the same variant — because the gap between the two is the
 * anchoring filter's own footprint, and it is a printed figure rather than a silence.
 *
 * ⚠ The first sentence of that paragraph is now HISTORY: since REWRITE car 8a-1 `drawVariant`
 * selects by ARGMAX over each variant's stable id (law 6) rather than by `hash % length`. The
 * REASON the variant is identified from the rendered sentence is unchanged and is the whole
 * point — this module still cannot see the slot bag — but `poolIndex` must carry `vid` for
 * the `drawAgrees` re-derivation to be about the same draw the page took. See there.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { drawVariant, variantIsAudible } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_MOUNTS } from '../../src/domain/display/stateProse/dossierMounts.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deskReturns } from '../../scripts/prose-rate-corpus.mjs';
import { loadStateLeaves, ROOT } from './dossierCorpus.js';
import { goldenCorpus, keyOf } from './goldenMasterCorpus.js';

export { goldenCorpus, keyOf };

/** The two faces of every cell. The manifest is recorded at both, always. */
export const AUDIENCES = Object.freeze(['dm', 'player']);

/** @param {string} text @returns {string} */
export const sha256 = (text) => createHash('sha256').update(text).digest('hex');

/**
 * SIXTEEN HEX, NOT SIXTY-FOUR, on a per-cell text digest. The cell table is ~52,500 rows and
 * is regenerated on demand at any sha; 64 bits of digest carries a collision probability
 * below 1e-10 at that size, and the file it saves a reader from is four times larger. The
 * per-ROW roll-up that ships as the fixture is the full 64.
 * @param {string} text
 * @returns {string}
 */
export const textDigest = (text) => sha256(String(text)).slice(0, 16);

/**
 * Every pool of the R1 leaves, keyed `block :: pool`, variants in AUTHORED ORDER.
 *
 * ⛔ `vid` IS CARRIED AND IS NOT DECORATION. `cellsOfTown` re-derives the draw over the
 * AUDIBLE pool to measure the anchoring filter's footprint (`drawAgrees`), and since law 6
 * the draw is an ARGMAX over the stable id: a pool shape that dropped `vid` would send that
 * re-derivation down `drawVariant`'s modulus fallback and measure the difference between two
 * DRAWS instead of the difference between two POOLS. Driven at car 8a-1 over the DRIFT run's
 * 73,284 cells: 5,966 under the modulus draw at 29ec62425; 47,227 under law 6 with `vid`
 * stripped, which is the nonsense figure; 3,914 under law 6 with it carried. The footprint
 * genuinely SHRANK, and for a reason the draw makes obvious — dropping a slot-unanchored
 * variant moves the argmax only when that variant was the winner, where the modulus re-rolls
 * on any change of length at all.
 * @returns {Promise<Map<string, Array<{idx: number, vid: number|undefined, text: string, angle: string, marks: string[], slots: string[]}>>>}
 */
export async function poolIndex() {
  /** @type {Map<string, Array<{idx: number, vid: number|undefined, text: string, angle: string, marks: string[], slots: string[]}>>} */
  const out = new Map();
  for (const entry of await loadStateLeaves()) {
    const key = `${entry.block} :: ${entry.pool}`;
    const seat = out.get(key) || [];
    seat.push({
      idx: entry.idx,
      vid: entry.vid,
      text: entry.text,
      angle: entry.angle,
      marks: entry.marks,
      slots: entry.slots,
    });
    out.set(key, seat);
  }
  for (const seat of out.values()) seat.sort((a, b) => a.idx - b.idx);
  return out;
}

/** The mounts a block speaks at, joined; the block id where the registry names none. */
export function mountsByBlock() {
  /** @type {Map<string, string[]>} */
  const seats = new Map();
  for (const m of DOSSIER_MOUNTS) {
    const seat = seats.get(m.blockId);
    if (seat) seat.push(m.mount); else seats.set(m.blockId, [m.mount]);
  }
  /** @type {Map<string, string>} */
  const out = new Map();
  for (const [block, mounts] of seats) out.set(block, [...new Set(mounts)].sort().join('|'));
  return out;
}

/**
 * Does a rendered sentence come from this variant's template? The template's literal halves
 * must match and every `{slot}` may stand for anything non-empty.
 * @param {string} template
 * @param {string} rendered
 * @returns {boolean}
 */
export function templateMatches(template, rendered) {
  const source = String(template)
    .split(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('(.+?)');
  return new RegExp(`^${source}$`).test(String(rendered));
}

/**
 * Walk a desk return for every rung that carries a (blockId, poolKey) provenance AND its
 * rendered sentence, in call order. Both shapes the desks return are read: the rung's
 * `provenance` block, and `readStateProse`'s own flat `{blockId, poolKey, angle, text}`.
 * @param {unknown} node
 * @param {Array<{blockId: string, poolKey: string, angle: string, text: string}>} out
 * @param {number} [depth]
 */
export function walkRungs(node, out, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 10) return;
  const flat = /** @type {{blockId?: unknown, poolKey?: unknown, angle?: unknown, text?: unknown}} */ (node);
  if (typeof flat.blockId === 'string' && typeof flat.poolKey === 'string' && typeof flat.text === 'string') {
    out.push({
      blockId: flat.blockId, poolKey: flat.poolKey, angle: String(flat.angle ?? ''), text: flat.text,
    });
    return;
  }
  const rung = /** @type {{provenance?: {blockId?: unknown, poolKey?: unknown, angle?: unknown}, sentence?: unknown}} */ (node);
  const p = rung.provenance;
  if (p && typeof p.blockId === 'string' && typeof p.poolKey === 'string' && typeof rung.sentence === 'string') {
    out.push({
      blockId: p.blockId,
      poolKey: p.poolKey,
      angle: String(p.angle ?? ''),
      text: rung.sentence,
      // ⭐ THE COMPOSER'S OWN PIECES, CARRIED THROUGH (TASTE car M-3). `legibilityRung` now
      // puts them on the provenance (ARCH §4.1); the cell builder reads them for a COMPOSED
      // unit and keeps the template identification for the one-piece unit every shipped rung
      // is. See `cellsOfTown` for why the split is exactly there.
      pieces: Array.isArray(/** @type {any} */ (p).pieces) ? /** @type {any} */ (p).pieces : null,
    });
    return;
  }
  for (const value of Object.values(node)) walkRungs(value, out, depth + 1);
}

/**
 * ONE TOWN, ONE AUDIENCE, EVERY CELL. Pure given the settlement and the frozen pools.
 * @param {object} settlement
 * @param {{key: string, seed: string, audience: string,
 *   pools: Map<string, Array<{idx: number, text: string, angle: string, marks: string[]}>>,
 *   mounts: Map<string, string>}} input
 * @returns {Array<object>}
 */
export function cellsOfTown(settlement, input) {
  /** @type {Array<{blockId: string, poolKey: string, angle: string, text: string}>} */
  const rungs = [];
  for (const entry of deskReturns(settlement, { seed: input.seed, audience: input.audience })) {
    walkRungs(entry.value, rungs);
  }
  /** @type {Map<string, number>} */
  const seen = new Map();
  /** @type {Array<object>} */
  const cells = [];
  for (const rung of rungs) {
    const mount = input.mounts.get(rung.blockId) || rung.blockId;
    const rungIndex = seen.get(mount) ?? 0;
    seen.set(mount, rungIndex + 1);
    const pool = input.pools.get(`${rung.blockId} :: ${rung.poolKey}`) || [];
    const audible = pool.filter((v) => variantIsAudible(v, input.audience));
    const candidates = pool.filter(
      (v) => v.angle === rung.angle && templateMatches(v.text, rung.text),
    );
    const chosen = candidates[0] || null;
    const drawn = drawVariant(audible, rung.blockId, rung.poolKey, input.seed);
    // ⭐⭐ A COMPOSED UNIT IS IDENTIFIED BY THE COMPOSER, A ONE-PIECE UNIT BY ITS TEXT
    // (TASTE car M-3), and the split is exactly there for a measured reason.
    //
    // The template reader identifies a cell's variant from the RENDERED SENTENCE, which is
    // the right instrument for a one-piece unit and CANNOT WORK on a composed one: a unit
    // that grew a modifier renders TWO variants concatenated, no single pool template matches
    // it, and the cell would record `vid: null` and classify RE-INDEXED — the classifier's own
    // STOP verdict — on every town a modifier reached. The composer already computed the
    // answer (`composedPieceOf` writes `vid` as the position AS AUTHORED and `index` as the
    // position in the AUDIENCE-FILTERED pool, which are this recorder's own two coordinates,
    // by construction), so a composed unit reads it rather than guessing at it.
    //
    // ⛔ AND THE ONE-PIECE PATH IS LEFT EXACTLY AS IT WAS, so not one shipped cell moves: the
    // committed fixture was recorded through the template reader and stays comparable to the
    // byte. The agreement of the two readings on a one-piece unit is asserted rather than
    // assumed (tests/property/dossierProseManifest.test.js), which is what makes this a
    // narrowing of the reader's job and not a second world beside it.
    const composed = Array.isArray(rung.pieces) && rung.pieces.length > 1 ? rung.pieces : null;
    const spinePiece = composed ? composed.find((piece) => piece.role === 'spine') : null;
    const vid = spinePiece ? spinePiece.vid : (chosen ? chosen.idx : null);
    const index = spinePiece ? spinePiece.index : (chosen ? audible.indexOf(chosen) : null);
    cells.push({
      cell: `${input.key}::${input.audience}::${mount}::${rungIndex}`,
      block: rung.blockId,
      pool: rung.poolKey,
      vid,
      index,
      face: spinePiece ? spinePiece.face : 0,
      angle: rung.angle,
      pieces: composed || [{
        role: 'spine', key: rung.poolKey, vid, index, face: 0,
      }],
      textSha: textDigest(rung.text),
      resolved: Boolean(chosen) || Boolean(spinePiece),
      ambiguous: !composed && candidates.length > 1,
      drawAgrees: composed ? true : (Boolean(chosen) && drawn === chosen),
    });
  }
  return cells;
}

/**
 * The generated settlement for one golden configuration, and the seed the desks read.
 * @param {{_seed: string}} config
 * @returns {{settlement: object, seed: string}}
 */
export function townOf(config) {
  const { _seed: seedIn, ...cfg } = config;
  const settlement = generateSettlementPipeline(cfg, null, { seed: seedIn, customContent: {} });
  return { settlement, seed: String(settlement._seed ?? settlement.id ?? seedIn) };
}

/**
 * THE DRIFT CORPUS, WHOLE: every golden configuration at every audience, as cells and as the
 * per-row roll-up the fixture carries.
 * @param {{configs?: ReadonlyArray<object>, audiences?: ReadonlyArray<string>,
 *   seedOverride?: string|null, onCells?: (cells: Array<object>) => void}} [options]
 *   `onCells` streams each town's cells to the caller and STOPS them being accumulated: the
 *   VARIETY corpus is 4,200 towns and holding every cell of it costs a reader nothing and the
 *   process a hundred megabytes.
 * @returns {Promise<{rows: Map<string, string>, cells: Array<object>, unresolved: number,
 *   ambiguous: number, drawDisagrees: number, towns: number, seconds: number}>}
 */
export async function driftRun(options = {}) {
  const configs = options.configs || goldenCorpus();
  const audiences = options.audiences || AUDIENCES;
  const pools = await poolIndex();
  const mounts = mountsByBlock();
  const started = Date.now();
  /** @type {Map<string, string>} */
  const rows = new Map();
  /** @type {Array<object>} */
  const cells = [];
  let unresolved = 0;
  let ambiguous = 0;
  let drawDisagrees = 0;
  for (const config of configs) {
    const key = keyOf(config);
    const { settlement, seed } = townOf(config);
    for (const audience of audiences) {
      const townCells = cellsOfTown(settlement, {
        key,
        seed: options.seedOverride === undefined || options.seedOverride === null ? seed : options.seedOverride,
        audience,
        pools,
        mounts,
      });
      for (const cell of townCells) {
        if (!cell.resolved) unresolved += 1;
        if (cell.ambiguous) ambiguous += 1;
        if (!cell.drawAgrees) drawDisagrees += 1;
      }
      if (options.onCells) options.onCells(townCells); else cells.push(...townCells);
      rows.set(`${key}::${audience}`, sha256(JSON.stringify(townCells)));
    }
  }
  return {
    rows,
    cells,
    unresolved,
    ambiguous,
    drawDisagrees,
    towns: configs.length,
    seconds: Math.round((Date.now() - started) / 1000),
  };
}

/**
 * ⭐ THE FILES WHOSE BYTES DECIDE WHAT THIS INSTRUMENT RECORDS — the executable half of
 * SITTING §P.2-29's "a fixture whose provenance sha is not the tip that wrote it".
 *
 * ⛔ WHY THESE THREE AND WHY A SHA OF THE RECORDER RATHER THAN OF THE COMMIT. A recorder
 * cannot know the sha of the commit it is about to be committed in, so a git sha in a fixture
 * is a DECLARATION a reader trusts and no arm can check. What an arm CAN check is the code
 * that produced the bytes: this module (the cell and the roll-up), the desk-read recipe every
 * cell is composed through, and the corpus that decides which towns exist. If any of the
 * three moves and the fixture does not, the fixture was recorded by a recorder that no longer
 * exists — which is exactly the state P12 says nothing refuses today.
 *
 * ⛔ AND WHAT "MOVES" MEANS HERE IS THE CODE, NOT THE BYTES (CURE-J, 2026-09-20). `recorderShas`
 * digests each file's COMMENT-STRIPPED source, because a raw-byte pin cannot tell a re-worded
 * docblock from a re-written function and charged an owner-signed golden re-record for the
 * first. See `stripComments`.
 * @type {ReadonlyArray<string>}
 */
export const MANIFEST_RECORDER_FILES = Object.freeze([
  'tests/helpers/dossierManifest.js',
  'tests/helpers/goldenMasterCorpus.js',
  'scripts/prose-rate-corpus.mjs',
]);

/** A character that may appear inside a JavaScript identifier. */
const IDENT_CHAR = /[A-Za-z0-9_$]/;

/**
 * The word tokens after which a `/` opens a REGEX LITERAL rather than dividing. After any
 * other identifier, number, `)` or `]` a `/` is division.
 */
const REGEX_AFTER_KEYWORD = Object.freeze(new Set([
  'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw',
  'case', 'do', 'else', 'yield', 'await',
]));

/**
 * ⭐ THE RECORDER'S CODE, WITHOUT ITS PROSE — the executable half of "a comment is not a
 * behaviour" (CURE-J, 2026-09-20).
 *
 * ⛔ THE CLASS THIS CURES, RECORDED WHERE THE NEXT READER WILL SEE IT. `recorderShas()` used to
 * hash each recorder file's RAW bytes, which is blind to the difference between a comment edit
 * and a behaviour edit. On 2026-09-20 FIX-C2 re-addressed a source citation inside a JSDoc
 * block of `scripts/prose-rate-corpus.mjs` — ONE line, `EconomicsTab.jsx:251-257` becoming
 * `EconomicsTab.jsx:272`, not a token of code — and the provenance arm refused the fixture with
 * ZERO rows moved. A citation re-address is a CONTINUING act in this estate (FIX-C2b was
 * re-addressing more of them as this cure was written), so a raw-sha pin on a source file turns
 * every one of them into a golden re-record, which is an owner-signed door. The identity a
 * provenance pin wants is the identity of the CODE.
 *
 * THE EXACT RULE, so a reader never has to infer it from the scanner:
 *   1. Line comments (a double slash to end of line) and block comments (slash-star to
 *      star-slash) are REMOVED.
 *   2. String literals, template literals (whole, from backtick to matching backtick, `${}`
 *      nesting tracked) and regex literals are copied BYTE-FOR-BYTE. Nothing inside a literal
 *      is ever read as a comment — which is exactly where the estate's two regex-based
 *      strippers fail, and why this is a scanner rather than a third copy of them.
 *   3. Every run of whitespace OUTSIDE a literal collapses to a single space, and the result
 *      is trimmed. Never to nothing: `return x` can never become `returnx`.
 *
 * ⚠ RULE 3 IS A DELIBERATE WIDENING BEYOND "COMMENTS", AND IT IS WHAT MAKES THE PROPERTY TRUE.
 * Removing a comment leaves its surrounding whitespace behind, so a stripper that preserved
 * whitespace would still move the sha when a comment was APPENDED (a newline survives) or
 * REFLOWED (a line count changes). The identity is therefore insensitive to reformatting —
 * indentation and line breaks — as well as to comments. Both are non-behavioural, so the
 * widening costs the pin nothing it was protecting; it is named here rather than discovered.
 *
 * ⚠ AND THE ONE PLACE IT IS DELIBERATELY OVER-SENSITIVE: a template literal is opaque, so a
 * comment written INSIDE a `${...}` interpolation survives into the digest and would move it.
 * That is the safe direction — an extra re-record, never a missed behaviour change — and no
 * recorder file carries one today.
 *
 * @param {string} source
 * @returns {string} the source's code, comments removed and whitespace collapsed
 */
export function stripComments(source) {
  const text = String(source);
  /** @type {string[]} */
  const out = [];
  let i = 0;
  let pendingSpace = false;
  let prevChar = '';
  let prevWord = '';

  const emit = (chunk) => {
    if (pendingSpace) { out.push(' '); pendingSpace = false; }
    out.push(chunk);
    prevChar = chunk[chunk.length - 1];
    prevWord = IDENT_CHAR.test(prevChar) ? (/[A-Za-z0-9_$]+$/.exec(chunk) || [''])[0] : '';
  };
  const regexAllowed = () => {
    if (prevChar === '') return true;
    if (prevChar === ')' || prevChar === ']') return false;
    if (IDENT_CHAR.test(prevChar)) return REGEX_AFTER_KEYWORD.has(prevWord);
    return true;
  };

  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '/' && next === '/') {
      const nl = text.indexOf('\n', i);
      i = nl === -1 ? text.length : nl;
      pendingSpace = true;
    } else if (ch === '/' && next === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end === -1 ? text.length : end + 2;
      pendingSpace = true;
    } else if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      pendingSpace = true;
      i += 1;
    } else if (ch === '\'' || ch === '"') {
      let j = i + 1;
      while (j < text.length) {
        if (text[j] === '\\') { j += 2; continue; }
        if (text[j] === ch) { j += 1; break; }
        j += 1;
      }
      emit(text.slice(i, j));
      i = j;
    } else if (ch === '`') {
      let j = i + 1;
      let depth = 0;
      while (j < text.length) {
        if (text[j] === '\\') { j += 2; continue; }
        if (depth === 0 && text[j] === '`') { j += 1; break; }
        if (depth === 0 && text[j] === '$' && text[j + 1] === '{') { depth = 1; j += 2; continue; }
        if (depth > 0 && text[j] === '{') { depth += 1; j += 1; continue; }
        if (depth > 0 && text[j] === '}') { depth -= 1; j += 1; continue; }
        j += 1;
      }
      emit(text.slice(i, j));
      i = j;
    } else {
      let consumed = false;
      if (ch === '/' && regexAllowed()) {
        let j = i + 1;
        let inClass = false;
        let closed = false;
        while (j < text.length) {
          const c = text[j];
          if (c === '\\') { j += 2; continue; }
          if (c === '\n') break;
          if (c === '[') { inClass = true; j += 1; continue; }
          if (c === ']') { inClass = false; j += 1; continue; }
          if (c === '/' && !inClass) { j += 1; closed = true; break; }
          j += 1;
        }
        if (closed) {
          while (j < text.length && /[a-z]/.test(text[j])) j += 1;
          emit(text.slice(i, j));
          i = j;
          consumed = true;
        }
      }
      if (!consumed) {
        emit(ch);
        i += 1;
      }
    }
  }
  return out.join('').trim();
}

/**
 * The recorder's own CODE, as one sha per file, read from the tree.
 *
 * ⛔ COMMENT-INSENSITIVE SINCE 2026-09-20 (CURE-J). The digest is taken over
 * `stripComments(source)`, never over the raw bytes: a prose edit to a recorder file is not a
 * change of what the recorder RECORDS, and pinning it as one made every source-citation
 * re-address into an owner-signed golden re-record. See `stripComments` for the exact rule and
 * for the two directions the suite drives it in.
 * @returns {Record<string, string>}
 */
export function recorderShas() {
  /** @type {Record<string, string>} */
  const out = {};
  for (const rel of MANIFEST_RECORDER_FILES) {
    out[rel] = sha256(stripComments(readFileSync(join(ROOT, rel), 'utf8')));
  }
  return out;
}

/**
 * The roll-up as the fixture carries it: keys sorted, one row per (config, audience).
 * @param {Map<string, string>} rows
 * @returns {Record<string, string>}
 */
export function manifestRows(rows) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const key of [...rows.keys()].sort()) out[key] = rows.get(key) || '';
  return out;
}

/**
 * The fixture's exact BYTES: a provenance block and the per-row roll-up.
 *
 * ⚠ THE PROVENANCE IS INSIDE THE BYTES the drift arm compares, so it cannot be edited away
 * without the arm noticing; and `rowsSha` digests the rows ALONE, so a hand-edited row reds
 * twice — once against the live run and once against the fixture's own digest.
 * @param {Map<string, string>} rows
 * @param {object} provenance the block to carry; `rowsSha` is computed here, never passed
 * @returns {string}
 */
export function manifestBytes(rows, provenance = {}) {
  const out = manifestRows(rows);
  const payload = {
    _provenance: { ...provenance, rows: Object.keys(out).length, rowsSha: sha256(JSON.stringify(out)) },
    rows: out,
  };
  return `${JSON.stringify(payload, null, 2)}\n`;
}

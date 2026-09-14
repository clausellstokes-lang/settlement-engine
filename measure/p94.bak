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
 * @returns {Promise<Map<string, Array<{idx: number, text: string, angle: string, marks: string[], slots: string[]}>>>}
 */
export async function poolIndex() {
  /** @type {Map<string, Array<{idx: number, text: string, angle: string, marks: string[], slots: string[]}>>} */
  const out = new Map();
  for (const entry of await loadStateLeaves()) {
    const key = `${entry.block} :: ${entry.pool}`;
    const seat = out.get(key) || [];
    seat.push({
      idx: entry.idx, text: entry.text, angle: entry.angle, marks: entry.marks, slots: entry.slots,
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
      blockId: p.blockId, poolKey: p.poolKey, angle: String(p.angle ?? ''), text: rung.sentence,
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
    const vid = chosen ? chosen.idx : null;
    const index = chosen ? audible.indexOf(chosen) : null;
    cells.push({
      cell: `${input.key}::${input.audience}::${mount}::${rungIndex}`,
      block: rung.blockId,
      pool: rung.poolKey,
      vid,
      index,
      face: 0,
      angle: rung.angle,
      pieces: [{
        role: 'spine', key: rung.poolKey, vid, index, face: 0,
      }],
      textSha: textDigest(rung.text),
      resolved: Boolean(chosen),
      ambiguous: candidates.length > 1,
      drawAgrees: Boolean(chosen) && drawn === chosen,
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
 * @type {ReadonlyArray<string>}
 */
export const MANIFEST_RECORDER_FILES = Object.freeze([
  'tests/helpers/dossierManifest.js',
  'tests/helpers/goldenMasterCorpus.js',
  'scripts/prose-rate-corpus.mjs',
]);

/**
 * The recorder's own bytes, as one sha per file, read from the tree.
 * @returns {Record<string, string>}
 */
export function recorderShas() {
  /** @type {Record<string, string>} */
  const out = {};
  for (const rel of MANIFEST_RECORDER_FILES) out[rel] = sha256(readFileSync(join(ROOT, rel), 'utf8'));
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

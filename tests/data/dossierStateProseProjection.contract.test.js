/**
 * dossierStateProseProjection.contract.test.js — LANE P-1: the corpus is the source.
 *
 * WHAT THIS GUARDS. The dossier state-prose corpus lives in TWO authored annexes
 * (docs/content/RECEIPT_POOLS_DOSSIER_STATE.md, RECEIPT_POOLS_CAUSAL_DOSSIER.md) and
 * is projected into src/data/dossierStateProse/*.generated.js by
 * scripts/generate-dossier-state-prose.mjs. Two things can go wrong and neither is
 * visible at a reading surface:
 *
 *   1. THE PROJECTION GOES STALE — the chair edits a variant, nobody regenerates, and
 *      the page keeps saying the old sentence while the doc says the new one. `--check`
 *      re-derives from the docs and byte-compares, so a stale leaf reds here.
 *   2. THE PARSER SILENTLY DROPS A VARIANT — a pool one line short still renders; it
 *      just never says that thing again. The generator throws on any tagged pool line
 *      it fails to consume, and this test asserts the MEASURED shape of what landed
 *      rather than trusting the annexes' own arithmetic (which disagrees with the
 *      measured count by a handful, per the merge notes — the measurement wins).
 *
 * These are inventory ratchets, not literal-value pins: nothing here forbids the chair
 * from adding variants. What it forbids is a corpus that shrinks, a desk that loses its
 * blocks, and a projection that no longer matches its source.
 *
 * @enforced-by this file + scripts/generate-dossier-state-prose.mjs --check
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  parseSlotShapes, mergeSlotShapes, assertSlotShapesTotal,
  fillShapeViolation, conformantFill, determinerFill,
} from '../../scripts/lib/dossier-slot-shapes.mjs';
import {
  INDEX_PAIRED_BLOCKS, MODIFIER_MOVES, POOL_ROLES, RELATIONS, S2_SIGNED,
  applyDeclaration, assertCensusCurrent, assertFaces, assertPoolDeclaration,
  endpointReads, isDeclarationLine, kinSpines, parseConnectives, parseFaceRow, readDeclarations, seatMeta,
  seatOf, turnKeyStanding, vidsOf, FACE_ROW_RE, FACE_TAG_RE,
} from '../../scripts/lib/dossier-annex-grammar.mjs';
import {
  ARCHIVER_SOURCE, FACE_SOURCES, PAIR_JOINTS, PAIR_KINDS, WEIGH_KIND,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { COVERT_SOURCES } from '../../src/domain/prose/wiringCensus.js';
// ⭐ THE ESTATE'S ONE STOP LIST, driven here exactly as the projector drives it (REWRITE car
// 8a-4). A test that spelled its own vocabulary would be checking `kinSpines` against a third
// list, and the whole point of resolving kinship at projection is that there is one.
import { contentWords } from '../../src/domain/prose/composedWalker.js';
import { DOSSIER_CONNECTIVES } from '../../src/data/dossierConnectives.generated.js';
import { DOSSIER_PROSE_NORMS } from '../../src/data/proseNorms.generated.js';
import { DOSSIER_RELATIONS, DOSSIER_RELATION_ALIASES } from '../../src/data/dossierRelations.generated.js';
import { COMPOSITION_BOUNDS } from '../../src/domain/display/stateProse/composeStateProse.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_CAUSAL_PROSE } from '../../src/data/dossierCausalProse.generated.js';
import {
  AUDIENCE_DM, AUDIENCE_PLAYER, STATE_MARK_DIMENSIONS,
  eligibleVariants, poolDimensions, readStateProse,
} from '../../src/domain/display/stateProse/stateProseKernel.js';

const ROOT = resolve(import.meta.dirname, '../..');

const DESKS = Object.freeze({
  economy: DOSSIER_STATE_PROSE_ECONOMY,
  power: DOSSIER_STATE_PROSE_POWER,
  defense: DOSSIER_STATE_PROSE_DEFENSE,
  warFaith: DOSSIER_STATE_PROSE_WAR_FAITH,
  stressors: DOSSIER_STATE_PROSE_STRESSORS,
  general: DOSSIER_STATE_PROSE_GENERAL,
});

/** Every block across every desk, as [id, block] pairs. */
const allStateBlocks = Object.values(DESKS).flatMap((desk) => Object.entries(desk));
const allBlocks = [...allStateBlocks, ...Object.entries(DOSSIER_CAUSAL_PROSE)];

/** @param {object} block */
function variantCount(block) {
  return Object.values(block.pools).reduce((n, pool) => n + pool.length, 0);
}

// ── THE GRAMMAR CONTRACT (2026-09-02) ────────────────────────────────────────
// None of the 2,445 test files in the estate rendered a state-prose variant with a real
// fill and looked at the SENTENCE. Every assertion is about shape, arm, identity or
// determinism, so `ACCESS_PROSE.road = 'the road'` sat in eight determiner-headed seams
// for a month printing "off its the road" and "a working the road" while the suite was
// green. These arms read the rendered string.

const STATE_DOC = resolve(ROOT, 'docs/content/RECEIPT_POOLS_DOSSIER_STATE.md');
const CAUSAL_DOC = resolve(ROOT, 'docs/content/RECEIPT_POOLS_CAUSAL_DOSSIER.md');
const DESK_DIR = resolve(ROOT, 'src/domain/display/stateProse');

const SHAPES = mergeSlotShapes([
  parseSlotShapes(readFileSync(STATE_DOC, 'utf8'), 'RECEIPT_POOLS_DOSSIER_STATE.md'),
  parseSlotShapes(readFileSync(CAUSAL_DOC, 'utf8'), 'RECEIPT_POOLS_CAUSAL_DOSSIER.md'),
]);

/** Every slot name any variant in either corpus actually uses. */
const USED_SLOTS = [...new Set(allBlocks.flatMap(([, block]) => Object.values(block.pools)
  .flat().flatMap((variant) => variant.slots)))].sort();

/**
 * WHOLE-STRING detectors, each compared against its own count in the TEMPLATE, so a hit
 * the AUTHOR put there is never a defect and no allowlist is needed. Measured over all
 * 2,734 templates: both of these fire ZERO times on the authored corpus, so every hit
 * after filling was introduced by a fill.
 */
const RENDERED_DETECTORS = Object.freeze({
  'ADJACENT-DETERMINERS': /\b(?:the|a|an|its|his|her|their|our)\s+(?:the|a|an)\b/gi,
  'DOUBLED-WORD': /\b(the|a|an|of|to|in|on|at|by|its|and)\s+\1\b/gi,
});

/**
 * The determiner-RUN detector — "a working {access}" meeting a fill that brought its own
 * article — is ANCHORED TO THE FILL and never run over free prose.
 *
 * Unanchored it is a heuristic about English and it convicts authored sentences: "buys the
 * Thornwall the time to make the next one" and "the town is poor, which is the complaint a
 * visitor will hear" both match, and both are correct. Anchored, it fires only when a
 * determiner opens the INSERTED text and another determiner stands within the three words
 * before it — which is exactly the defect and nothing else.
 */
const RUN_RE = /\b(?:the|a|an|its|his|her|their|our)\s+(?:\w+\s+){0,2}(the|a|an)\b/gi;
/** A fill may never carry these, whatever its shape. Scoped to the inserted span. */
const IN_FILL_DETECTORS = Object.freeze({
  'DASH-IN-FILL': /[—–]/,
  'DIGIT-IN-FILL': /[0-9]/,
  'RESIDUAL-SLOT-IN-FILL': /\{[a-zA-Z_]/,
});

/** @param {string} s @param {RegExp} rx */
function hits(s, rx) {
  return (s.match(new RegExp(rx.source, rx.flags)) || []).length;
}

/**
 * Every desk module in the tree, with the fill tables and shape mirrors it declares.
 * Discovered from the FILESYSTEM so a desk that lands next month is covered the day it
 * lands; five of the six desks the annex describes are still unwritten, and a guard that
 * imported one table by name would be a one-of-six guard on the morning of the second.
 * @returns {Promise<Array<{file: string, declared: Record<string, Record<string,string>>, mirror: Record<string,string>, exports: Array<[string, unknown]>}>>}
 */
async function loadDeskModules() {
  const out = [];
  for (const file of readdirSync(DESK_DIR).filter((n) => n.endsWith('.js')).sort()) {
    const mod = await import(pathToFileURL(join(DESK_DIR, file)).href);
    out.push({
      file,
      declared: mod.SLOT_FILL_TABLES || {},
      mirror: mod.SLOT_FILL_SHAPES || {},
      exports: Object.entries(mod),
    });
  }
  return out;
}

/**
 * Render one variant, tracking where each fill landed, and return every defect the FILL
 * introduced. The spans are what let the run detector be exact instead of heuristic.
 * @param {string} id @param {object} variant @param {(slot: string) => string} fillFor
 * @returns {string[]}
 */
function fillDefects(id, variant, fillFor) {
  /** @type {Array<{slot: string, start: number, end: number, value: string}>} */
  const spans = [];
  let rendered = '';
  let last = 0;
  for (const m of variant.text.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)) {
    rendered += variant.text.slice(last, m.index);
    const value = fillFor(m[1]);
    spans.push({ slot: m[1], start: rendered.length, end: rendered.length + value.length, value });
    rendered += value;
    last = m.index + m[0].length;
  }
  rendered += variant.text.slice(last);

  const out = [];
  for (const [kind, rx] of Object.entries(RENDERED_DETECTORS)) {
    if (hits(rendered, rx) > hits(variant.text, rx)) out.push(`${kind} :: ${id} :: ${rendered}`);
  }
  const starts = new Set(spans.map((s) => s.start));
  for (const m of rendered.matchAll(RUN_RE)) {
    // Index of the run's SECOND determiner. It is a defect only when the fill is what put
    // it there — an authored "the … the" is the author's sentence and stays the author's.
    if (starts.has(m.index + m[0].lastIndexOf(m[1]))) {
      out.push(`DETERMINER-RUN :: ${id} :: ${rendered}`);
    }
  }
  for (const span of spans) {
    for (const [kind, rx] of Object.entries(IN_FILL_DETECTORS)) {
      if (rx.test(span.value)) out.push(`${kind} :: ${id} :: {${span.slot}} = "${span.value}"`);
    }
  }
  return out;
}

describe('the dossier state-prose projection', () => {
  it('is not stale against the two authored annexes', () => {
    // Throws (and prints which leaf) when the docs moved and nobody regenerated.
    const out = execFileSync(
      'node',
      [resolve(ROOT, 'scripts/generate-dossier-state-prose.mjs'), '--check'],
      { cwd: ROOT, encoding: 'utf8' },
    );
    expect(out).toContain('verified');
  });

  it('keeps every desk populated — an emptied leaf is a lost surface', () => {
    for (const [name, desk] of Object.entries(DESKS)) {
      expect(Object.keys(desk).length, `desk ${name} has no blocks`).toBeGreaterThan(0);
    }
  });

  it('carries the measured corpus: 68 state blocks over 6 desks, 78 causal families', () => {
    // 59 block headers were authored at the 2026-08-03 merge; DS-GEN-4 is FOLDED INTO
    // DS-STR-1 (§0h V1-a) and keeps its id for cross-references without owning a pool,
    // so 58 landed.
    //
    // 58 → 62 (2026-08-22, content train car CT-1a, ratified at ODQ §378). The chapter
    // adds FOUR blocks of engine-known morphology — DS-GEN-12 (the ground), DS-GEN-13
    // (the market and the roads), DS-GEN-14 (founded once, grown since), DS-DEF-11 (why
    // the wall, and why not) — as WHOLLY NEW blocks. That shape is the whole point of
    // the car and it is load-bearing here: drawVariant keys its hash on
    // `${seed}::${blockId}::${poolKey}` and indexes `% eligible.length`, so APPENDING to
    // an existing pool would move every seeded draw over that pool, while a NEW block
    // moves nothing. Measured at the landing, not asserted: the other five desk leaves
    // and the causal leaf came out of the regeneration BYTE-IDENTICAL, and general +
    // defense differ only by their header count line plus the added blocks — zero
    // existing pools changed, so no same-seed sentence anywhere in the estate moved.
    //
    // 62 → 65 (2026-08-22, car CT-2, ratified at ODQ §378 and sequenced at §387).
    // The growth chapter adds THREE blocks — DS-POP-3 (the direction of the roll read
    // against the approach), DS-GEN-15 (the fabric wears it), DS-GEN-16 (what the years
    // left standing) — on the same wholly-new-block shape, and lands DARK. Measured at
    // this landing, not asserted, and TIGHTER than CT-1a's: SIX of the seven leaves came
    // out of the regeneration BYTE-IDENTICAL (defense, economy, power, stressors,
    // warFaith and the causal leaf), only general.generated.js moved at all, and its
    // ONLY removed line is its own header count comment. Key-by-key across all seven:
    // 3 ADDED, 0 REMOVED, 0 CHANGED. No existing pool changed length, so drawVariant's
    // `% eligible.length` cannot select differently anywhere, and there is no capsule.
    //
    // 65 → 68 (2026-08-22, car CT-3, ratified at ODQ §378 and sequenced at §387). The
    // institutions chapter adds THREE blocks — DS-GEN-17 (the company the town keeps),
    // DS-GEN-18 (why these workshops) and DS-FTH-4 (why the temple holds its ground) —
    // on the same wholly-new-block shape, and lands DARK. This car is the first to touch
    // TWO leaves, because DS-FTH- routes to the warFaith desk while DS-GEN- routes to
    // general; FIVE leaves came out of the regeneration BYTE-IDENTICAL (defense, economy,
    // power, stressors and the causal leaf) and each of the two that moved has exactly
    // ONE removed line, its own header count comment. Key-by-key across all seven:
    // 3 ADDED, 0 REMOVED, 0 CHANGED, and zero pre-existing (blockId, poolKey) pools
    // changed length — measured directly, which is the property drawVariant actually
    // reads. No same-seed movement, so no capsule.
    expect(allStateBlocks.length).toBe(68);
    expect(Object.keys(DOSSIER_CAUSAL_PROSE).length).toBe(78);
  });

  it('never shrinks: the variant inventory is a ratchet', () => {
    const stateVariants = allStateBlocks.reduce((n, [, b]) => n + variantCount(b), 0);
    const causalVariants = Object.values(DOSSIER_CAUSAL_PROSE)
      .reduce((n, b) => n + variantCount(b), 0);
    // Measured at the projection's first landing (2153). Adding variants is expected and
    // lawful; a DROP means the parser lost content or the corpus was cut.
    //
    // 2153 → 2201 (2026-08-22, CT-1a, ODQ §378 — CT-0 §5 R-5). The floor is re-pinned to
    // the MEASURED total at each content-train car rather than left where it was. Leaving
    // it is lawful and was the alternative on the bill; it is refused because the slack
    // between a stale floor and the real total is exactly where a later parser regression
    // hides — the pool a grammar change silently stops consuming still leaves the estate
    // above 2153, and this pin is the only thing in the tree that would have noticed.
    //
    // 2201 → 2238 (2026-08-22, CT-2, ODQ §378/§387). Re-pinned to the MEASURED total
    // again, per CT-0 §5 R-5 and on CT-1a's ratified precedent: the floor tracks the
    // corpus at every car, so the slack a parser regression could hide in never opens.
    //
    // 2238 → 2269 (2026-08-22, CT-3, ODQ §378/§387). Re-pinned to the MEASURED total on
    // the same standing rule. The car's own arithmetic is thirteen pools and thirty-one
    // variants across two desks: general 613 → 634 and warFaith 411 → 421.
    //
    // ⛔ 2269 → 2266 (2026-08-30, WF-8 shrink-back, ODQ §400). THIS IS THE ONE ROW THAT
    // MOVES THE FLOOR DOWNWARD, and it is a CHAIR-RULED CORPUS CUT rather than the loss
    // this ratchet exists to catch. DS-FTH-3 enumerated a FIFTH patron-fall cause
    // (`abandoned`) and carried a three-variant pool for it; `PATRON_FALL_CAUSES`
    // (src/domain/worldPulse/patronFall.js) has never held it, the classifier is total
    // over four arms and cannot emit a fifth, and the sink crossing the cause was named
    // for vacates no seat — zero producers, so no state could ever draw the pool. §400
    // ruled the doc shrink-back rather than a fifth token. Measured key-by-key against
    // the pre-edit projection: warFaith 421 → 418, the other five desks and the causal
    // leaf BYTE-IDENTICAL, and the diff is 0 ADDED / 1 REMOVED / 0 CHANGED with the one
    // removed key exactly `DS-FTH-3 :: FALL — abandoned` at 3 variants. Zero seeded
    // draws move because an undrawable pool was never drawn. THE PRODUCER DOOR STAYS
    // OPEN: if a later WF member builds pure-secularization seat vacancy, the cause, its
    // pool and the floor going back up land in the SAME commit as the producer.
    expect(stateVariants).toBeGreaterThanOrEqual(2266);
    expect(causalVariants).toBeGreaterThanOrEqual(468);
  });

  it('⭐⭐ never shrinks: the FACE inventory is a ratchet too (C\u2032; Part B \u00a722 d)', () => {
    // ⛔ THE OWNER'S "NEVER TRIM", DEFINED (Part B §22 d, confirmed 2026-09-08): "the variant
    // count and the face count are ratchets that red on any fall; the annex is append-only".
    // The variant half has been armed since the projection's first landing; the FACE half was
    // not, and SITTING §T.4 (agenda C′) ordered it "armed beside the variant ratchet BEFORE the
    // REWRITE's first writing workflow" — which is this car, the last one before 8b.
    //
    // ⛔ THE ESTATE-WIDE FLOOR IS RE-PINNED TO THE MEASURED TOTAL, on the variant ratchet's own
    // standing rule (CT-0 §5 R-5): a stale floor leaves slack, and slack is where a regression
    // hides. 2,266 today because every one of the 2,266 variants carries exactly ONE face; the
    // REWRITE's families grow toward four and this line rises with them, car by car.
    const faceTotal = META_ROWS.reduce((n, r) => n + r.meta.faceCounts.reduce((m, c) => m + c, 0), 0);
    expect(faceTotal, 'the face inventory only ever rises').toBeGreaterThanOrEqual(2266);

    // ⛔ PER POOL, AND THE ARITHMETIC IS THE FLOOR WHILE EVERY FAMILY IS SINGLE-FACED. A pool
    // carries one faceCounts entry per variant and every entry is at least 1, so its face total
    // is at least its variant count — and the variant count is itself a ratchet. That makes the
    // per-pool floor RISE automatically as families grow, with no second list of 708 integers
    // that would all read 1 today and that nobody would re-measure.
    const structural = META_ROWS.filter((r) => r.meta.faceCounts.length !== r.meta.variantCount
      || r.meta.faceCounts.some((c) => !Number.isInteger(c) || c < 1))
      .map((r) => `${r.id} :: ${r.pool}`);
    expect(structural, 'a face count that is not one integer per variant, each at least 1')
      .toEqual([]);
    const belowOwnVariants = META_ROWS
      .filter((r) => r.meta.faceCounts.reduce((m, c) => m + c, 0) < r.meta.variantCount)
      .map((r) => `${r.id} :: ${r.pool}`);
    expect(belowOwnVariants, 'no pool carries fewer faces than variants').toEqual([]);

    // ⭐ AND THE DECLARED PER-POOL FLOORS, for the day a pool rises above the universal one.
    // Read from the SHIFT REGISTER rather than typed here, on the `reIndexed` idiom car 8a-1
    // landed: a floor is a DECLARED ROW a car writes in the same commit as the growth, and the
    // contract holds the corpus to it. EMPTY today by construction — no family has grown — and
    // SHRINK-ONLY: a floor may be added or raised and never lowered.
    const declared = (SHIFT_REGISTER.mechanisms
      .find((m) => m.id === 'face-count-per-variant') || {}).floors || {};
    expect(Object.keys(declared).length,
      'no family has grown yet, so no pool needs a floor above its own variant count').toBe(0);
    for (const [at, floor] of Object.entries(declared)) {
      const row = META_ROWS.find((r) => `${r.id} :: ${r.pool}` === at);
      expect(row, `${at}: a declared face floor for a pool the corpus does not carry`).toBeTruthy();
      expect(row.meta.faceCounts.reduce((m, c) => m + c, 0),
        `${at}: the corpus fell below its own declared face floor — this is a TRIM`)
        .toBeGreaterThanOrEqual(Number(floor));
    }
  });

  it('⭐ THE ANNEX IS APPEND-ONLY: the pool roster only ever grows (Part B \u00a722 d)', () => {
    // The register's `pool-key-rename` digest reds on ANY key change, which catches a rename
    // and a removal alike but cannot tell them from an ADDITION. "Append-only" is the other
    // half and it is a count: the roster may gain keys and may never lose one.
    expect(META_ROWS.length, 'the pool roster only ever grows').toBeGreaterThanOrEqual(708);
    // AND NO KEY IS EMPTY OR DUPLICATED, which is what would let a removal hide inside a gain.
    const ids = META_ROWS.map((r) => `${r.id} :: ${r.pool}`);
    expect(new Set(ids).size, 'no (block, pool) is counted twice').toBe(ids.length);
    expect(ids.filter((at) => /:: $/.test(at)), 'no pool with an empty key').toEqual([]);
  });

  it('⭐⭐ THE SEVEN `canonical` ROWS, NAMED ONE BY ONE, AND THEIR SINGLE-FACED STANDING (C\u2032)', () => {
    // SITTING §T.4 adopting agenda C′: "the single-face canonical rows bound to live engine
    // strings are named one by one and their single-faced standing recorded". They are named
    // rather than counted because the record is the point: a reader of this file must be able
    // to see WHICH rows the estate has promised never to give a second face, and why.
    //
    // ⛔ WHY THEY STAY SINGLE-FACED. Each `canonical` row is a BYTE-COPY of a string the
    // ENGINE already owns and ships (the ONE-HOME rule, enforced at the projection). A second
    // face on such a row would be a second wording of a sentence the engine emits, which is
    // two homes for one string — the drift class the projector refuses by name. So "never
    // trim" and "grow toward four" apply to the AUTHORED rows of these pools, and the
    // canonical row at vid 0 keeps exactly one face BY REFUSAL (P-F6), not by neglect.
    //
    // ⛔ AND THEY ARE THE SAME SEVEN CAR 8a-1 FOUND, which is why `vid: 0` is a real id: these
    // pools number 0..n-1 while the other 701 number 1..n, and a `> 0` guard on the draw would
    // have split the corpus into two draw regimes silently.
    const CANONICAL = [
      'DS-ECO-3 :: ADEQUATE',
      'DS-ECO-3 :: SHORTAGE \u00d7 trade-dependent',
      'DS-ECO-3 :: SURPLUS \u00d7 trade-dependent',
      'DS-ECO-6 :: TIER: minor shadow activity (\u22653)',
      'DS-ECO-6 :: TIER: significant off-book activity (\u226515)',
      'DS-ECO-7 :: CATALOG',
      'DS-ECO-7 :: TALLIES',
    ];
    // DERIVED, NOT TRANSCRIBED: the seven are exactly the pools whose vid list contains 0.
    const withZero = META_ROWS.filter((r) => r.meta.vids.includes(0))
      .map((r) => `${r.id} :: ${r.pool}`).sort();
    expect(withZero, 'the seven pools that lead with a canonical row').toEqual([...CANONICAL].sort());
    expect(withZero.length, 'three on DS-ECO-3, two on DS-ECO-6, two on DS-ECO-7').toBe(7);
    for (const at of CANONICAL) {
      const row = META_ROWS.find((r) => `${r.id} :: ${r.pool}` === at);
      const zeroAt = row.meta.vids.indexOf(0);
      expect(zeroAt, `${at}: the canonical row leads the pool`).toBe(0);
      expect(row.meta.faceCounts[zeroAt], `${at}: the canonical row is SINGLE-FACED`).toBe(1);
      const block = allStateBlocks.find(([id]) => id === row.id)[1];
      const variant = block.pools[row.pool][zeroAt];
      expect(variant.angle, `${at}: and it is angled \`canonical\``).toBe('canonical');
      expect(String(variant.text).length, `${at}: and it carries the engine's own sentence`)
        .toBeGreaterThan(20);
    }
  });

  it('gives every causal family exactly six arm-tagged variants in one pool', () => {
    for (const [id, family] of Object.entries(DOSSIER_CAUSAL_PROSE)) {
      const keys = Object.keys(family.pools);
      expect(keys, `${id} should carry one unlabelled pool`).toEqual(['*']);
      expect(family.pools['*'].length, `${id} variant count`).toBe(6);
      expect(family.arms?.length, `${id} declares its arms`).toBeGreaterThan(0);
    }
  });

  it('leaves no pool thin enough to be single-voiced', () => {
    const thin = [];
    for (const [id, block] of allBlocks) {
      for (const [key, pool] of Object.entries(block.pools)) {
        if (pool.length < 2) thin.push(`${id} :: ${key} (${pool.length})`);
      }
    }
    expect(thin).toEqual([]);
  });

  it('carries prose, not markdown — no residual markup or authoring notes', () => {
    const dirty = [];
    for (const [id, block] of allBlocks) {
      for (const [key, pool] of Object.entries(block.pools)) {
        for (const variant of pool) {
          if (/`|\*\*/.test(variant.text)) dirty.push(`${id} :: ${key} :: ${variant.text.slice(0, 60)}`);
          if (variant.text.trim() === '') dirty.push(`${id} :: ${key} :: EMPTY`);
        }
      }
    }
    expect(dirty).toEqual([]);
  });

  it('declares every slot a variant actually uses', () => {
    const undeclared = [];
    for (const [id, block] of allBlocks) {
      for (const pool of Object.values(block.pools)) {
        for (const variant of pool) {
          for (const slot of variant.slots) {
            // §0c's SLOTS-LINE CONVENTION, reconciled: a slot USED must appear on its
            // block's SLOTS line. (A slot DECLARED need not be used — not checked.)
            if (!block.slots.includes(slot)) undeclared.push(`${id} :: {${slot}}`);
          }
        }
      }
    }
    // Recorded, not asserted-to-zero: the annexes' own convention permits a cluster to
    // mint slots in its local register (§0c-2), and several blocks use a minted slot
    // without restating it on the block's SLOTS line. The reader treats an undeclared
    // slot exactly as a declared one (fill it or the variant is ineligible), so this is
    // a corpus-hygiene reading rather than a runtime hazard. It only ratchets DOWN.
    expect(new Set(undeclared).size).toBeLessThanOrEqual(60);
  });

  it('marks dm-only variants so the player projection can truncate to silence', () => {
    const dmOnly = allBlocks.flatMap(([, block]) => Object.values(block.pools).flat())
      .filter((variant) => (variant.marks || []).includes('dm-only'));
    // §0e: covert content is marked inline, and R-DOS-G carries the marks into the
    // dossier-native register. If this hits zero the audience filter has nothing to do
    // and the truncation pin below it is vacuous.
    expect(dmOnly.length).toBeGreaterThanOrEqual(89);
  });
});

describe('the slot SHAPE contract — a fill obeys the grammar its seam assumes', () => {
  it('declares a shape for every slot any variant uses, and carries no dead wildcard', () => {
    const { undeclared, deadPrefixes } = assertSlotShapesTotal(SHAPES, USED_SLOTS);
    // A slot minted in §0c-2 or in the causal register without a shape reds HERE, at its
    // authoring, rather than at its first wiring — which is where {access} was found, a
    // month and one shipped defect later. The projection throws on the same condition, so
    // this arm is the reader's copy of a gate that also runs at generation.
    expect({ undeclared, deadPrefixes }).toEqual({ undeclared: [], deadPrefixes: [] });
  });

  it('covers the whole corpus: 39 slots over two annex registers', () => {
    // Measured, not asserted from either annex's own arithmetic. The register is SPLIT:
    // six of these ({house} {temple} {third_party} {war} {wound} {burden}) are declared
    // only in RECEIPT_POOLS_CAUSAL_DOSSIER.md and a guard reading one file reports six
    // phantom gaps. It only ratchets UP — a corpus that stops using a slot is lawful, a
    // register that stops covering one is not, and that is the arm above.
    expect(USED_SLOTS.length).toBeGreaterThanOrEqual(39);
    const byShape = {};
    for (const slot of USED_SLOTS) {
      const shape = SHAPES.shapeOf(slot);
      byShape[shape] = (byShape[shape] || 0) + 1;
    }
    expect(Object.keys(byShape).sort()).toEqual(['RESERVED', 'bare-common', 'phrase', 'proper']);
  });

  it('renders every variant grammatically against a shape-conformant fixture', () => {
    const defects = [];
    for (const [id, block] of allBlocks) {
      for (const [key, pool] of Object.entries(block.pools)) {
        for (const variant of pool) {
          defects.push(...fillDefects(`${id} :: ${key}`, variant,
            (slot) => conformantFill(SHAPES.shapeOf(slot), slot)));
        }
      }
    }
    expect(defects).toEqual([]);
  });

  it('⭐ `{defmaterial}` (ADDENDUM 18 ruling 10) is registered bare-common, mirrored by the desk, and renders through every seam its sibling `{defwork}` occupies', async () => {
    // THE SLOT LANDS BEFORE ANY FACE USES IT, so `USED_SLOTS` cannot exercise it and the arm
    // above never renders it. This arm stands in until a face does: the register row, the
    // desk's mirror, the declared palette of the two blocks that offer it, and a render of
    // the desk's OWN four words through every `{defwork}` seam — the seams a material word
    // will actually meet — plus the fixture render the arm above would run.
    expect(SHAPES.shapeOf('defmaterial')).toBe('bare-common');
    const desks = await loadDeskModules();
    const defense = desks.find((d) => d.file === 'defenseStateProse.js');
    expect(defense?.mirror.defmaterial).toBe('bare-common');
    expect(Object.keys(defense?.declared.defmaterial || {}).sort()).toEqual(
      ['City walls and gates', 'Palisade', 'Palisade or earthworks', 'Town walls'],
    );
    for (const id of ['DS-DEF-2', 'DS-DEF-11']) {
      const block = allBlocks.find(([blockId]) => blockId === id)?.[1];
      expect(block?.slots, `${id} declares the slot on its SLOTS line`).toContain('defmaterial');
    }
    const defects = [];
    let renders = 0;
    const words = ['x', ...Object.values(defense?.declared.defmaterial || {})];
    for (const [id, block] of allBlocks) {
      for (const [key, pool] of Object.entries(block.pools)) {
        for (const variant of pool) {
          if (!variant.slots.includes('defwork')) continue;
          // The same sentence with `{defmaterial}` standing where `{defwork}` stood.
          const twin = { ...variant, text: variant.text.replace(/\{defwork\}/g, '{defmaterial}') };
          for (const word of words) {
            renders += 1;
            defects.push(...fillDefects(`${id} :: ${key} (defmaterial for defwork)`, twin,
              (s) => (s === 'defmaterial'
                ? (word === 'x' ? conformantFill(SHAPES.shapeOf(s), s) : word)
                : conformantFill(SHAPES.shapeOf(s), s))));
          }
        }
      }
    }
    expect(defects).toEqual([]);
    // Non-vacuity: DS-DEF-11's three walled pools name `{defwork}` on SEVEN variants at this
    // tip (measured: 2 + 3 + 2), each rendered with the fixture and the four table words.
    expect(renders).toBeGreaterThanOrEqual(7 * words.length);
  });

  it('convicts a determiner-bearing fixture — the detectors are not vacuous', () => {
    // THE POSITIVE CONTROL. The arm above asserts an empty list, and an empty list is what
    // a detector that stopped matching also produces. This is the same corpus rendered
    // with each shape violated in exactly ONE way — a leading determiner, which is
    // precisely what ACCESS_PROSE carried — and the floors are MEASURED, not guessed.
    const byKind = {};
    const sites = new Set();
    for (const [id, block] of allBlocks) {
      for (const [key, pool] of Object.entries(block.pools)) {
        for (const variant of pool) {
          for (const d of fillDefects(`${id} :: ${key}`, variant,
            (slot) => determinerFill(SHAPES.shapeOf(slot), slot))) {
            const kind = d.split(' :: ')[0];
            byKind[kind] = (byKind[kind] || 0) + 1;
            sites.add(`${kind} @ ${id}`);
          }
        }
      }
    }
    // MEASURED at f5a6c3bbf over all 2,734 variants, then frozen as a floor: 108 / 101 /
    // 150. The corpus only grows, so these only rise. They are DELIBERATELY lower than the
    // figures a whole-string scan reports, because the run detector here is anchored to
    // the fill span and the other two are differenced against the template — the arithmetic
    // difference IS the false-positive population an unanchored version would convict.
    expect(byKind['ADJACENT-DETERMINERS'] ?? 0).toBeGreaterThanOrEqual(108);
    expect(byKind['DOUBLED-WORD'] ?? 0).toBeGreaterThanOrEqual(101);
    expect(byKind['DETERMINER-RUN'] ?? 0).toBeGreaterThanOrEqual(150);
    // The two blocks that carried the shipped defect must be named by the control, or it
    // has gone green on a corpus that no longer contains the bug it was built for.
    expect([...sites].sort()).toEqual(expect.arrayContaining([
      'ADJACENT-DETERMINERS @ DS-ECO-1',
      'ADJACENT-DETERMINERS @ DS-ECO-10',
      'DETERMINER-RUN @ DS-ECO-1',
      'DETERMINER-RUN @ DS-ECO-10',
    ]));
  });

  it('holds every desk fill table in the tree to its slot\'s declared shape', async () => {
    // ENUMERATED FROM THE FILESYSTEM, never from one import. A guard that named
    // ACCESS_NOUN would be a one-of-six guard the day a second desk lands, and five of the
    // six desks are unwritten. Every exported string map in the desk directory is a
    // CANDIDATE fill table and must be classified: either the module declares it in
    // SLOT_FILL_TABLES against a real slot, or it is one of the two declaration exports.
    // A new table nobody declared is a red, not a silence.
    const DECLARATION_EXPORTS = ['SLOT_FILL_TABLES', 'SLOT_FILL_SHAPES'];
    // CLASSIFIED, NOT EXEMPTED. Every string map in the desk directory must be one of
    // these two things, and adding a third costs a deliberate line here or in the module's
    // SLOT_FILL_TABLES. That is the whole mechanism: a new fill table cannot arrive
    // unnoticed, which is how `ACCESS_PROSE` arrived.
    const NOT_A_FILL_TABLE = Object.freeze({
      'dmFieldProjection.js::DM_FIELD_FRAMED_BY_BLOCK':
        'blockId → settlement field path, consumed by projectBesideDmField; no value of it '
        + 'ever reaches a {slot}',
      'dossierMounts.js::MOUNT_RUNGS':
        'the two legibility depths a mount may draw at, consumed only by dossierMounts.js '
        + 'as the router\u2019s rung vocabulary; no value of it ever reaches a {slot}',
      // DESK-DEFENSE car 7 (`13dd5bfcf`) exported these two and classified neither, which
      // is the arrival this mechanism exists to refuse — and it refused it, exactly as the
      // `ACCESS_PROSE` note above predicts. Both are MOUNT-ID maps of the
      // DM_FIELD_FRAMED_BY_BLOCK kind, not fill tables: their values are dossier mount ids
      // (`defense.threatAssessment`, `defense.militaryStatus`, `defense.postureHeader`),
      // and their only consumer is tests/domain/defenseStateProseDesk.test.js, which joins
      // each blocked lens to the LANDED position that already speaks its fact. Verified by
      // reading both maps and their consumer, not by the shape of their names: no value of
      // either is ever substituted into a {slot}, so declaring them against a slot would be
      // the false classification rather than the missing one.
      'defenseStateProse.js::DEF6_FACT_SPOKEN_AT':
        'DS-DEF-6 blocked lens \u2192 the dossier mount id of the landed position that '
        + 'already speaks its fact; consumed only by the desk suite to pin that coverage '
        + 'claim against the live registry. No value of it ever reaches a {slot}',
      'defenseStateProse.js::DEF10_FACT_SPOKEN_AT':
        'DS-DEF-10 family \u2192 the dossier mount id of the landed position that speaks '
        + 'its fact, exported for the same reason and read by the same suite. No value of '
        + 'it ever reaches a {slot}',
    });
    const violations = [];
    const undeclaredTables = [];
    const shapeDrift = [];
    let tablesChecked = 0;
    let valuesChecked = 0;

    for (const { file, declared, mirror, exports } of await loadDeskModules()) {
      const declaredTables = new Set(Object.values(declared));

      for (const [slot, table] of Object.entries(declared)) {
        tablesChecked += 1;
        const shape = SHAPES.shapeOf(slot);
        if (shape === undefined) {
          undeclaredTables.push(`${file} declares a table for {${slot}}, which no annex registers`);
          continue;
        }
        for (const [key, value] of Object.entries(table)) {
          valuesChecked += 1;
          const rule = fillShapeViolation(shape, value);
          if (rule) violations.push(`${file} ${slot}[${key}] = "${value}" — ${rule} (shape ${shape})`);
        }
      }

      for (const [name, value] of exports) {
        if (DECLARATION_EXPORTS.includes(name)) continue;
        const isStringMap = value && typeof value === 'object' && !Array.isArray(value)
          && Object.keys(value).length > 0
          && Object.values(value).every((v) => typeof v === 'string');
        if (isStringMap && !declaredTables.has(value) && !NOT_A_FILL_TABLE[`${file}::${name}`]) {
          undeclaredTables.push(`${file} exports the string map ${name} and SLOT_FILL_TABLES does not name it`);
        }
      }

      for (const [slot, shape] of Object.entries(mirror)) {
        // The desk's mirror of §0c's Shape column. A runtime module cannot read markdown,
        // so it carries a copy; this is the arm that keeps the copy from becoming a fork.
        if (SHAPES.shapeOf(slot) !== shape) {
          shapeDrift.push(`${file} believes {${slot}} is "${shape}"; the annex says "${SHAPES.shapeOf(slot)}"`);
        }
      }
    }

    expect({ violations, undeclaredTables, shapeDrift }).toEqual({
      violations: [], undeclaredTables: [], shapeDrift: [],
    });
    // Non-vacuity: the walk found real tables with real values. A directory that stopped
    // exporting anything would satisfy every list above by being empty.
    expect(tablesChecked).toBeGreaterThanOrEqual(1);
    expect(valuesChecked).toBeGreaterThanOrEqual(5);
  });

  it('renders every real fill table against every seam its slot occupies', async () => {
    // The cross product that would have caught the bug on the day it landed: every value
    // of every declared table, in every variant that names its slot, rendered and READ.
    // Today that is 5 ACCESS_NOUN values x 7 {access} variants = 35 sentences; it grows
    // with the tables because both sides are discovered, never listed.
    const defects = [];
    let renders = 0;
    for (const { declared } of await loadDeskModules()) {
      for (const [slot, table] of Object.entries(declared)) {
        for (const value of Object.values(table)) {
          for (const [id, block] of allBlocks) {
            for (const [key, pool] of Object.entries(block.pools)) {
              for (const variant of pool) {
                if (!variant.slots.includes(slot)) continue;
                renders += 1;
                defects.push(...fillDefects(`${id} :: ${key}`, variant,
                  (s) => (s === slot ? value : conformantFill(SHAPES.shapeOf(s), s))));
              }
            }
          }
        }
      }
    }
    expect(defects).toEqual([]);
    expect(renders).toBeGreaterThanOrEqual(35);
  });
});

// ── THE DEMOTED STATE DIMENSION (kernel law 5) ───────────────────────────────
// The annex keys DS-GEN-1 on THREE dimensions (`type` x max of `severity[]` x
// `factions[].length`) and the projection's pool key carries ONE. The surplus two were
// demoted into per-variant channels: faction count into `slots`, severity into `marks`.
// `eligibleVariants` enforced the slots demotion via `variantIsAnchored` and IGNORED the
// marks one, so a `minor` crime wave could draw the variant marked `catastrophic` and the
// page would state something false about the town. DS-GEN-6 (`hasFoodDeficit`) and
// DS-GEN-9 (`anchored`) carry the same shape.
//
// These five arms live HERE, beside the corpus, because the defect is a disagreement
// between the corpus's key and the reader's key and neither half proves it alone. They
// need no desk, no mount and no component, which is why they could have caught this on
// the day the projection landed. The fifth (T5) governs the one channel with NO kernel
// behind it — duration, which is carried by slots rather than by marks.

/**
 * An explicit PAST-DURATION claim in free prose: a sentence asserting how long ago its
 * subject was, rather than leaving that to a `{timeband_*}` slot. Deliberately WIDE — it
 * over-fires on distance ("smoke a long time before") and on state-licensed antiquity, and
 * both are named in T5's closed roster rather than narrowed away, so the roster stays the
 * place an author's judgment is recorded. NO `g` flag: `.test()` on a global regex is
 * stateful and would skip every other hit.
 */
const DURATION_CLAIM = /\blong ago\b|\ba long while\b|\blong since\b|\bgenerations ago\b|\ball gone now\b|\blifetimes? ago\b|\bcenturies ago\b|\bages ago\b|\byears back\b|\ba long time\b/i;

/** Every slot any variant of a pool names, filled with a conformant, non-empty value. */
function bagFor(pool) {
  const slots = {};
  for (const variant of pool) for (const slot of variant.slots) slots[slot] = 'X';
  return slots;
}

/** The dimension words one variant carries, for one dimension. */
function marksOf(variant, dimension) {
  return (variant.marks || []).filter((m) => STATE_MARK_DIMENSIONS[dimension].includes(m));
}

/** Every (block, pool) the projection demoted a dimension into. Derived, never listed. */
const DIMENSIONED_POOLS = allStateBlocks.flatMap(([id, block]) => Object.entries(block.pools)
  .filter(([, pool]) => poolDimensions(pool).length > 0)
  .map(([key, pool]) => ({ id, key, pool, dims: poolDimensions(pool) })));

/** Every (pool x dimension value) state those pools partition themselves into. */
const DIMENSION_STATES = DIMENSIONED_POOLS.flatMap(({ id, key, pool, dims }) => dims
  .flatMap((dimension) => STATE_MARK_DIMENSIONS[dimension]
    .map((value) => ({ id, key, pool, dimension, value }))));

describe('the demoted state dimension — the channel the kernel enforces', () => {
  it('closes the mark vocabulary and keeps the three semantics disjoint', () => {
    // T1. `marks` is an untyped bag carrying THREE semantics — the audience mark, the
    // state dimension, and the causal arm — and the kernel understands two of them. This
    // arm is what stops the third from ever colliding with the second, and it reds the day
    // an author invents a ninth state mark: that is the fail-open hole reopening, because
    // an unclassified word is a dimension the kernel cannot see.
    const stateMarks = new Set(allStateBlocks.flatMap(([, block]) => Object.values(block.pools)
      .flat().flatMap((variant) => variant.marks || [])));
    const causalMarks = new Set(Object.values(DOSSIER_CAUSAL_PROSE)
      .flatMap((family) => Object.values(family.pools).flat())
      .flatMap((variant) => variant.marks || []));
    const vocabulary = Object.values(STATE_MARK_DIMENSIONS).flat();

    const unclassified = [...stateMarks].filter((m) => m !== 'dm-only' && !vocabulary.includes(m));
    const inTwoDimensions = vocabulary.filter((word, i) => vocabulary.indexOf(word) !== i);
    // The causal register's arm names are family-local and OPEN (92 distinct today), so
    // they cannot be a closed vocabulary and stay outside STATE_MARK_DIMENSIONS. What must
    // hold is that they never collide with a dimension word — that collision is exactly
    // what would make `poolDimensions` see a dimension in a causal pool and silence the
    // causal reader, which is the one way this change could reach a shipped surface.
    const collisions = [...causalMarks].filter((m) => vocabulary.includes(m));

    expect({ unclassified, inTwoDimensions, collisions })
      .toEqual({ unclassified: [], inTwoDimensions: [], collisions: [] });
    // Non-vacuity, MEASURED at 2d5112851: 8 distinct state marks (dm-only + the 7
    // dimension words the three blocks use) and 92 distinct causal arms. Floors, not pins.
    expect(stateMarks.size).toBeGreaterThanOrEqual(8);
    expect(causalMarks.size).toBeGreaterThanOrEqual(92);
    expect(vocabulary.length).toBe(7);
  });

  it('reads NOTHING from a partitioned pool the caller did not answer', () => {
    // ⭐ T2 — THE ARM THAT REDS ON THE LIVE DEFECT. Against the pre-cure kernel every one
    // of these reads returns a SENTENCE, drawn from the whole pool with the severity, the
    // deficit or the anchor ignored. Fail-closed means [] -> null -> silence: R-DST-K
    // already means silence, and a contradiction has no safe reading.
    const spoke = [];
    const mute = [];
    for (const { id, key, pool, dims } of DIMENSIONED_POOLS) {
      const slots = bagFor(pool);
      const blind = readStateProse({ [id]: { pools: { [key]: pool } } }, id, key,
        { slots, seed: 's', audience: AUDIENCE_DM });
      if (blind !== null) spoke.push(`${id} :: ${key} :: ${blind.text}`);
      // THE TRANSITION, so the null above is the GATE and not an empty pool or a missing
      // fill: answering the dimension must bring the sentence back at every legal value.
      for (const dimension of dims) {
        for (const value of STATE_MARK_DIMENSIONS[dimension]) {
          const answered = readStateProse({ [id]: { pools: { [key]: pool } } }, id, key,
            { slots, seed: 's', audience: AUDIENCE_DM, dimensions: { [dimension]: value } });
          if (answered === null) mute.push(`${id} :: ${key} :: ${dimension}=${value}`);
        }
      }
    }
    expect({ spoke, mute }).toEqual({ spoke: [], mute: [] });

    // The named case, spelled out because it is the one a reader can check by eye.
    expect(readStateProse(DOSSIER_STATE_PROSE_GENERAL, 'DS-GEN-1', 'crime_wave',
      { slots: { settlement: 'X' }, seed: 's' })).toBeNull();
    expect(readStateProse(DOSSIER_STATE_PROSE_GENERAL, 'DS-GEN-1', 'crime_wave',
      { slots: { settlement: 'X' }, seed: 's', dimensions: { severity: 'minor' } })?.text)
      .toEqual(expect.any(String));

    // Non-vacuity, MEASURED: 24 pools across DS-GEN-1, DS-GEN-6 and DS-GEN-9.
    expect(DIMENSIONED_POOLS.length).toBeGreaterThanOrEqual(24);
    expect([...new Set(DIMENSIONED_POOLS.map((p) => p.id))].sort())
      .toEqual(['DS-GEN-1', 'DS-GEN-6', 'DS-GEN-9']);
  });

  it('never returns a variant that contradicts the state it was asked about', () => {
    // T3 — THE CONTRADICTION SWEEP, over every (pool x dimension value) state in the
    // corpus and both audiences. A returned variant either carries the asked value or
    // carries no word of that dimension at all; anything else is the page stating
    // something false about the town, which is worse than the page saying nothing.
    const contradictions = [];
    for (const audience of [AUDIENCE_DM, AUDIENCE_PLAYER]) {
      for (const { id, key, pool, dimension, value } of DIMENSION_STATES) {
        const slots = bagFor(pool);
        for (const variant of eligibleVariants(pool, { slots, audience, dimensions: { [dimension]: value } })) {
          const own = marksOf(variant, dimension);
          if (own.length > 0 && !own.includes(value)) {
            contradictions.push(`${audience} :: ${id} :: ${key} :: asked ${dimension}=${value} :: got [${own.join(', ')}]`);
          }
        }
      }
    }
    expect(contradictions).toEqual([]);

    // THE NAMED CASE, derived from the corpus rather than transcribed: the catastrophic
    // crime-wave line must be unreachable at `minor`. Before the cure the seeded draw over
    // the unfiltered pool could return exactly this sentence for a minor crime wave.
    const crimeWave = DOSSIER_STATE_PROSE_GENERAL['DS-GEN-1'].pools.crime_wave;
    const catastrophic = crimeWave.find((v) => (v.marks || []).includes('catastrophic'));
    expect(catastrophic.angle).toBe('unfolding');
    const minorReachable = new Set(eligibleVariants(crimeWave,
      { slots: { settlement: 'X' }, audience: AUDIENCE_DM, dimensions: { severity: 'minor' } })
      .map((v) => v.text));
    expect(minorReachable.has(catastrophic.text)).toBe(false);
    expect(minorReachable.size).toBeGreaterThanOrEqual(2);

    // Non-vacuity, MEASURED: 58 states — DS-GEN-1 30, DS-GEN-6 12, DS-GEN-9 16.
    expect(DIMENSION_STATES.length).toBeGreaterThanOrEqual(58);
  });

  it('names the authoring bill: the states a seed cannot vary', () => {
    // T4 — THE THIN-STATE RATCHET, the sibling of `leaves no pool thin enough to be
    // single-voiced` above and written to the same `declares every slot` idiom: recorded,
    // not asserted-to-zero, and it only ratchets DOWN. Honouring the dimension costs
    // variety in the states where the corpus authored only one line for a value, and every
    // settlement in such a state prints the same sentence. That is a CORPUS bill, payable
    // by authoring, and hiding it would be the fail-open reading in a different coat.
    const thin = {};
    for (const audience of [AUDIENCE_DM, AUDIENCE_PLAYER]) {
      thin[audience] = DIMENSION_STATES.filter(({ pool, dimension, value }) => eligibleVariants(
        pool, { slots: bagFor(pool), audience, dimensions: { [dimension]: value } },
      ).length <= 1).length;
    }
    // MEASURED at 2d5112851, and the two audiences DIFFER BY ONE. The design volume
    // recorded 13; that is the DM figure. On the player's page DS-GEN-1 :: infiltration_fear
    // at `severity: major` also collapses to one line, because the second `major` variant
    // there is the block's only `major + dm-only` line and the player cannot hear it. The
    // reader-facing number is 14. Both are pinned so neither audience can drift unseen.
    expect(thin[AUDIENCE_DM]).toBeLessThanOrEqual(13);
    expect(thin[AUDIENCE_PLAYER]).toBeLessThanOrEqual(14);
    // No state may go SILENT: a value with zero eligible variants is a dead branch of the
    // corpus dressed as a town with nothing to say, and the ratchet above would not see it.
    const silent = DIMENSION_STATES.filter(({ pool, dimension, value }) => eligibleVariants(
      pool, { slots: bagFor(pool), audience: AUDIENCE_DM, dimensions: { [dimension]: value } },
    ).length === 0);
    expect(silent).toEqual([]);
  });

  it('states no duration its pool key does not license — the channel with NO kernel', () => {
    // ⛔ T5 — THE THIRD CHANNEL, and the only one the kernel cannot enforce. T1–T4 govern
    // `marks`, which the kernel reads. DURATION has no mark word and no dimension: it is
    // carried by the `{timeband_*}` SLOTS, and `eligibleVariants` gates a variant on
    // whether its slots are SUPPLIED, never on what band was supplied. So a variant that
    // names no timeband slot is BAND-BLIND — eligible at every age of its subject, from
    // nine years to seven hundred — and any duration it asserts in free prose is asserted
    // about all of them.
    //
    // ⭐ WHY THIS ARM EXISTS AND WHAT IT COST. A chair words act (2026-09-05) proposed four
    // duration-free variants for DS-GEN-9's four silent `event type:` arms, three of them
    // carrying an explicit antiquity clause ("a long while back", "long ago", "all gone
    // now"). Measured over 48 generated towns before the act landed: eight marker draws
    // would have printed one of those clauses about an event 9 to 20 years old, on the
    // same HistoryTab that prints `{yearsAgo}y ago` at :286. The corpus's own convention
    // already forbade it and nothing in the tree said so — 2,619 band-blind variants
    // across both registers and exactly THREE carry a duration phrase, each recorded
    // below. This arm is what makes that convention a claim rather than a habit.
    //
    // THE RULE, stated so a later author can satisfy it: a duration is licensed when the
    // POOL KEY is what asserts it (DS-POW-3's key is `low instability, long-held order`);
    // it is unlicensed when the key names only a type and an arm, as every `event type:`
    // pool does. The cure for a sixth-band silence is a variant whose sentence is TRUE at
    // every band, or a new pool key that carries the band — never a duration in free prose.
    const claims = [];
    let bandBlind = 0;
    for (const [id, block] of allBlocks) {
      for (const [key, pool] of Object.entries(block.pools)) {
        for (const variant of pool) {
          if (/\{timeband/.test(variant.text)) continue;
          bandBlind += 1;
          if (DURATION_CLAIM.test(variant.text)) claims.push(`${id} :: ${key} :: [${variant.angle}]`);
        }
      }
    }
    // CLOSED ROSTER, not a floor: a fourth row means an author put a duration into a
    // band-blind sentence, and the arm's job is to make that a conversation.
    //   · DS-GEN-5 — "smoke a long time before you see" is DISTANCE, not the subject's age.
    //   · DS-POW-3 — the pool KEY is `low instability, long-held order`; the state licenses it.
    //   · JF-CPL-6b — ⚠ NOT licensed by its key, and RECORDED AS A FINDING rather than cured
    //     here: it is a causal family with no dated subject and no `{yearsAgo}` printed
    //     beside it, so it cannot be contradicted by a digit the way a DS-GEN-9 draw can.
    //     Whether it stays is the chair's line, not this arm's.
    expect(claims.sort()).toEqual([
      'DS-GEN-5 :: smoke (route isolated / mountain_pass) :: [visitor]',
      'DS-POW-3 :: low instability, long-held order :: [elder]',
      'JF-CPL-6b :: * :: [street]',
    ]);
    // NON-VACUITY, both ways. The denominator is MEASURED (2,619 band-blind of 2,734) and
    // only rises, and the detector is proven able to see: a synthetic band-blind sentence
    // in the refused shape must convict, and the same sentence without the clause must not.
    expect(bandBlind).toBeGreaterThanOrEqual(2619);
    expect(DURATION_CLAIM.test('The town stopped calling it new a long while back.')).toBe(true);
    expect(DURATION_CLAIM.test('The town stopped calling it new.')).toBe(false);
  });
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEAM CAR 4 · M2 — THE SCHEMA, KEYS ADDED ONLY (ARCH-COMPOSED-PROSE §12 row 4)
//
// The corpus gained `poolMeta` beside every block's `pools` and `vid` on every state variant,
// and nothing else. The arms below hold that claim in three ways at once: the RENDER half is
// re-derived from the leaves and from the wiring census and compared; every mechanism whose
// change would re-roll a drawn index is PINNED on docs/content/prose-shift-register.json and
// recomputed here; and every refusal of §2.5's grammar table is driven by a plant, because a
// rule that arrives with its first author is a rule nobody has ever seen refuse anything.
//
// ⛔ WHY THE PLANTS DRIVE scripts/lib/dossier-annex-grammar.mjs AND NOT THE PROJECTOR. The
// projector is an entry script that writes the corpus at import time; a plant that had to
// regenerate 884 KB of leaves to watch one error is a plant nobody re-runs. The rules live in
// the lib, the projector holds ONE copy of each, and both are driven here.
// ══════════════════════════════════════════════════════════════════════════════════

const CENSUS = JSON.parse(readFileSync(resolve(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
const CENSUS_BY_POOL = new Map(CENSUS.rows.map((r) => [`${r.block} :: ${r.pool}`, r]));
const SHIFT_REGISTER = JSON.parse(
  readFileSync(resolve(ROOT, 'docs/content/prose-shift-register.json'), 'utf8'),
);
/**
 * ⭐ THE CLASSIFIER'S OWN OUTPUT for car 8a-1's one-time re-index, committed at REWRITE car
 * 8a-11 so the register's DECLARED `draw-formula.reIndexed` block has something to be
 * recomputed FROM (SITTING §U c-6). Until then a self-consistent falsification of that block
 * passed 77/77 and printed itself to the owner as the veto surface.
 */
const REINDEX = JSON.parse(
  readFileSync(resolve(ROOT, 'docs/content/prose-reindex-8a1.json'), 'utf8'),
);

/** Every (block, pool) of the STATE register with its metadata, ordered as the pins are. */
const META_ROWS = allStateBlocks
  .flatMap(([id, block]) => Object.entries(block.pools)
    .map(([pool, variants]) => ({ id, pool, variants, meta: (block.poolMeta || {})[pool] })))
  .sort((a, b) => (`${a.id} :: ${a.pool}` < `${b.id} :: ${b.pool}` ? -1 : 1));

/** The digest idiom the register's `_digestMaterial` states, re-spelled here rather than imported. */
const digestOver = (fn) => sha256Hex(META_ROWS.map((r) => `${r.id} :: ${r.pool} :: ${fn(r)}`).join('\n'));
/** @param {string} text */
function sha256Hex(text) {
  return createHash('sha256').update(text).digest('hex');
}

describe('SEAM car 4 — poolMeta, the RENDER half, projected and never hand-edited', () => {
  it('gives every STATE block a poolMeta row per pool, and no row for a pool it does not hold', () => {
    const missing = [];
    const orphan = [];
    for (const [id, block] of allStateBlocks) {
      const meta = block.poolMeta;
      if (!meta) { missing.push(`${id}: no poolMeta at all`); continue; }
      for (const key of Object.keys(block.pools)) if (!meta[key]) missing.push(`${id} :: ${key}`);
      for (const key of Object.keys(meta)) if (!block.pools[key]) orphan.push(`${id} :: ${key}`);
    }
    expect({ missing, orphan }).toEqual({ missing: [], orphan: [] });
    // Non-vacuity: the walk found the whole register, not an empty one.
    expect(META_ROWS.length).toBe(708);
    expect(META_ROWS.every((r) => r.meta)).toBe(true);
  });

  it('counts what is there: variantCount, faceCounts and vids agree with the pool itself', () => {
    const wrong = [];
    for (const { id, pool, variants, meta } of META_ROWS) {
      const at = `${id} :: ${pool}`;
      if (meta.variantCount !== variants.length) wrong.push(`${at}: variantCount ${meta.variantCount} against ${variants.length} variants`);
      if (meta.faceCounts.length !== variants.length) wrong.push(`${at}: ${meta.faceCounts.length} faceCounts for ${variants.length} variants`);
      if (meta.vids.length !== variants.length) wrong.push(`${at}: ${meta.vids.length} vids for ${variants.length} variants`);
      variants.forEach((v, i) => {
        const faces = 1 + (Array.isArray(v.wordings) ? v.wordings.length : 0);
        if (meta.faceCounts[i] !== faces) wrong.push(`${at} #${i}: faceCounts ${meta.faceCounts[i]} against ${faces} faces`);
        if (meta.vids[i] !== v.vid) wrong.push(`${at} #${i}: vids[${i}] ${meta.vids[i]} against the variant's vid ${v.vid}`);
      });
    }
    expect(wrong).toEqual([]);
  });

  it('mints a vid on every state variant, strictly ascending, and NEVER on the causal leaf', () => {
    // ⛔ THE CAUSAL LEAF IS EXCLUDED BY A RULING, NOT BY AN OVERSIGHT. Its byte ceiling in
    // scripts/.prose-byte-baseline.json EQUALS its genesis bytes (`_causalLeafGround`), so a
    // `vid` on each of its 468 variants would breach a ceiling that is itself a refusal; §11
    // refuses wording sets on the causal register in wave one, and its families are not in the
    // wiring census at all. `vid` is the STATE schema's (ARCH §2.3).
    const bad = [];
    for (const { id, pool, variants } of META_ROWS) {
      let last = -1;
      for (const v of variants) {
        if (!Number.isInteger(v.vid)) bad.push(`${id} :: ${pool}: a variant carries no vid`);
        else if (v.vid <= last) bad.push(`${id} :: ${pool}: vid ${v.vid} follows ${last}`);
        if (Number.isInteger(v.vid)) last = v.vid;
      }
    }
    expect(bad).toEqual([]);
    const causalWithVid = Object.entries(DOSSIER_CAUSAL_PROSE)
      .filter(([, family]) => family.poolMeta
        || Object.values(family.pools).flat().some((v) => v.vid !== undefined))
      .map(([id]) => id);
    expect(causalWithVid).toEqual([]);
  });

  it('orders vids exactly as the manifest recorder orders its own synthesised vid', () => {
    // ⭐ THE ONE PROPERTY THE DRIFT INSTRUMENT DEPENDS ON. tests/helpers/dossierManifest.js
    // records a cell's `vid` as the variant's 0-BASED POSITION in the pool as authored, and
    // says in its own header that car 4's real vid "must reproduce this ordering on an
    // unchanged corpus". The two are DIFFERENT INTEGERS on purpose — a vid is the ANNEX ROW
    // NUMBER (§2.6), which starts at 1 on a pool with no canonical row — and the classifier's
    // re-index detector reads the ordering, not the value. This arm is that agreement, so a
    // later car that switches the recorder to read the leaf's vid finds the disagreement HERE
    // rather than in a re-recorded fixture.
    const disagree = [];
    for (const { id, pool, meta } of META_ROWS) {
      const rank = [...meta.vids].map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]).map(([, i]) => i);
      if (rank.join(',') !== meta.vids.map((_, i) => i).join(',')) disagree.push(`${id} :: ${pool}`);
    }
    expect(disagree).toEqual([]);
    // Non-vacuity, MEASURED: the two spellings differ on the pools with no canonical row, which
    // is nearly all of them, so an arm that compared the VALUES would be red rather than vacuous.
    const differing = META_ROWS.filter((r) => r.meta.vids.some((v, i) => v !== i)).length;
    expect(differing).toBeGreaterThanOrEqual(700);
  });

  it('declares every shipped pool a SPINE with an EMPTY attach set', () => {
    const roles = new Set(META_ROWS.map((r) => r.meta.role));
    expect([...roles]).toEqual(['spine']);
    expect(META_ROWS.filter((r) => r.meta.attach.length > 0)).toEqual([]);
    // A spine carries no modifier-only or turn-only field, by construction and by assertion.
    // ⭐ AND THE RESERVED KEYS ARE READ FROM THE REGISTER, NOT RETYPED HERE (SEAM car 5c,
    // SITTING §R cure 5). `seatReason` and `seatRow` are emitted on a modifier only, ship on
    // 0 pools and are read by NO module — the one gap in the chair's `a reader or a named
    // reserved` rule. Naming them on the register closes it, and this arm is what makes the
    // naming load-bearing: the list is the register's, so a key added there is held here
    // without a test edit, and a key REMOVED there stops being held, which the floor below
    // refuses to let happen silently.
    const RESERVED = SHIFT_REGISTER.notMechanisms.flatMap((n) => (n.reserved || []).map((r) => r.key));
    expect(RESERVED.sort(), 'the register must still name the reserved keys').toEqual(['seatReason', 'seatRow']);
    for (const row of SHIFT_REGISTER.notMechanisms.flatMap((n) => n.reserved || [])) {
      expect(row.readBy, `${row.key} is reserved because nothing reads it; give it a reader or keep it reserved`).toBe('(no module)');
      expect(typeof row.why, `${row.key} must say why`).toBe('string');
      expect(row.shippedOn, `${row.key} is reserved, so it ships on no pool`).toBe(0);
    }
    // ⭐ `kin` JOINS THE MODIFIER-ONLY LIST AT REWRITE car 8a-4 and is NOT reserved, because
    // the composer reads it: it is the kinship head of the salience comparator, named on the
    // SHIFT REGISTER's `comparator-and-band-rule` row with its own zero-pin. It is emitted
    // only where non-empty and only a modifier has an attach set, so a spine carrying one
    // would mean the projector had resolved a thread for a pool that attaches to nothing.
    const stray = META_ROWS.filter((r) => ['relation', 'form', 'move', 'explains', 'spines', 'covers', 'kin', ...RESERVED]
      .some((k) => r.meta[k] !== undefined))
      .map((r) => `${r.id} :: ${r.pool}`);
    expect(stray).toEqual([]);
  });

  it('⭐ readsCount equals the census, pool by pool, and is ABSENT where the census reads nothing', () => {
    // THE INTERLOCK the car-3a ADDENDUM ruled. The composer bounds a unit at
    // `k <= 3 - |spine.reads|`, and `reads` itself never ships (ARCH §16), so this integer is
    // the whole of what the render half knows about the authoring half. It is READ from the
    // census and never derived, so this arm is a JOIN between two committed files rather than
    // a restatement of one.
    const wrong = [];
    let present = 0;
    let absent = 0;
    for (const { id, pool, meta } of META_ROWS) {
      const row = CENSUS_BY_POOL.get(`${id} :: ${pool}`);
      const want = row && row.reads.length ? row.reads.length : undefined;
      if (want === undefined) absent += 1; else present += 1;
      if (meta.readsCount !== want) {
        wrong.push(`${id} :: ${pool}: leaf ${String(meta.readsCount)} against census ${String(want)}`);
      }
    }
    expect(wrong).toEqual([]);
    // MEASURED at this tip: exactly the RESOLVED / WIRING-UNRESOLVED split of the census.
    // 340 / 368 → 361 / 347 AT REWRITE car 8b-W, which tabled twenty-one defence pools that
    // had been reporting rung 4. The split IS the census's, so this pair moves whenever a
    // wiring car lands and the leaves are regenerated in the same act; the arm's value is the
    // JOIN above, which is what would catch a census that moved and a leaf that did not.
    expect({ present, absent }).toEqual({ present: 361, absent: 347 });
    expect(present).toBe(CENSUS.rows.filter((r) => r.reads.length > 0).length);
  });

  it('MUTANT: a census count that moves without a regeneration is caught by that join', () => {
    // A control that cannot fail proves nothing. The comparison above is re-driven over a
    // FABRICATED census in which one pool's reads grew, with the leaves untouched.
    const compare = (rows, metaRows) => {
      const by = new Map(rows.map((r) => [`${r.block} :: ${r.pool}`, r]));
      return metaRows.filter(({ id, pool, meta }) => {
        const row = by.get(`${id} :: ${pool}`);
        const want = row && row.reads.length ? row.reads.length : undefined;
        return meta.readsCount !== want;
      }).map(({ id, pool }) => `${id} :: ${pool}`);
    };
    expect(compare(CENSUS.rows, META_ROWS)).toEqual([]);
    const target = CENSUS.rows.find((r) => r.reads.length === 1);
    const moved = CENSUS.rows.map((r) => (r === target
      ? { ...r, reads: [...r.reads, 'planted.second.field'] } : r));
    expect(compare(moved, META_ROWS)).toEqual([`${target.block} :: ${target.pool}`]);
  });

  it('MUTANT: the sha interlock refuses a census taken over a composer that has since moved', () => {
    const stamped = Object.keys(CENSUS.stamp.files);
    expect(stamped.length, 'the census stamps no file — the interlock has nothing to check').toBeGreaterThanOrEqual(7);
    const honest = (rel) => readFileSync(resolve(ROOT, rel), 'utf8');
    expect(() => assertCensusCurrent(CENSUS, honest, sha256Hex)).not.toThrow();
    const moved = (rel) => (rel === stamped[0] ? `${honest(rel)}\n// planted\n` : honest(rel));
    expect(() => assertCensusCurrent(CENSUS, moved, sha256Hex)).toThrow(/is STALE against 1 of its own stamped files/);
    expect(() => assertCensusCurrent({ ...CENSUS, rows: [] }, honest, sha256Hex)).toThrow(/carries no rows/);
    expect(() => assertCensusCurrent({ ...CENSUS, schema: 'x' }, honest, sha256Hex)).toThrow(/carries schema/);
  });
});

describe('SEAM car 4 — the SHIFT REGISTER, printed and every pin recomputed (ARCH §8.6)', () => {
  it('prints the register: every mechanism whose change re-rolls a drawn index', () => {
    // PRINTED with process.stdout, the idiom the manifest suite already uses: vitest's console
    // interception swallows a console.log on a PASSING test, and a register nobody can read is
    // a register nobody checks.
    const lines = SHIFT_REGISTER.mechanisms.map((m) => `  ${m.id.padEnd(26)} ${m.pin.map((p) => p.kind).join('+').padEnd(24)} ${m.shift.slice(0, 58)}`);
    process.stdout.write(`\n[shift-register] ${SHIFT_REGISTER.mechanisms.length} mechanisms, `
      + `${SHIFT_REGISTER.notMechanisms.length} named NOT mechanisms, measured at `
      + `${SHIFT_REGISTER.measuredAt.pools} pools / ${SHIFT_REGISTER.measuredAt.variants} variants\n`);
    process.stdout.write(`${lines.join('\n')}\n`);
    // Non-vacuity: the file was read and it holds the roster ARCH §8.6 enumerates.
    expect(SHIFT_REGISTER.mechanisms.length).toBeGreaterThanOrEqual(15);
    const ids = SHIFT_REGISTER.mechanisms.map((m) => m.id);
    expect(new Set(ids).size, 'a duplicate mechanism id').toBe(ids.length);
    for (const m of SHIFT_REGISTER.mechanisms) {
      for (const field of ['mechanism', 'shift', 'door', 'idiom']) {
        expect(typeof m[field], `${m.id}.${field}`).toBe('string');
        expect(m[field].trim().length, `${m.id}.${field} is empty; a row that names no door has declared nothing`).toBeGreaterThan(0);
      }
      expect(Array.isArray(m.pin) && m.pin.length > 0, `${m.id} carries no pin`).toBe(true);
    }
    expect(ids).toEqual(expect.arrayContaining([
      'variant-count-per-pool', 'face-count-per-variant', 'vids', 'pool-key-rename',
      'connective-list-length', 'norm-bit', 'attach-set', 'draw-formula',
      'comparator-and-band-rule', 'fact-and-position-budget', 'registry-id', 'instance-key',
      // REWRITE car 8a-2. The FOURTH seeded draw. It ships nothing yet — the composer is not
      // a caller — and it is on the register from the day the mechanism exists rather than
      // from the day it moves a read, which is the register's whole discipline: a mechanism
      // absent from this file is a same-seed text shift nobody signed.
      'passage-shape',
    ]));
  });

  it('⭐ recomputes every pin from the leaves themselves — a pin is a measurement, not a promise', () => {
    /** The live value of each pin, re-derived here and never read from the register. */
    const live = {
      'variant-count-per-pool': [
        META_ROWS.reduce((n, r) => n + r.meta.variantCount, 0),
        digestOver((r) => r.meta.variantCount),
      ],
      'face-count-per-variant': [
        META_ROWS.reduce((n, r) => n + r.meta.faceCounts.reduce((m, c) => m + c, 0), 0),
        Math.max(...META_ROWS.flatMap((r) => r.meta.faceCounts)),
        digestOver((r) => r.meta.faceCounts.join(',')),
      ],
      vids: [digestOver((r) => r.meta.vids.join(','))],
      'pool-key-rename': [sha256Hex(META_ROWS.map((r) => `${r.id} :: ${r.pool}`).join('\n'))],
      'connective-list-length': [Object.fromEntries(Object.entries(DOSSIER_CONNECTIVES)
        .flatMap(([rel, bySeat]) => Object.entries(bySeat).map(([seat, list]) => [`${rel}.${seat}`, list.length])))],
      'norm-bit': [
        Object.keys(DOSSIER_PROSE_NORMS).length,
        Object.values(DOSSIER_PROSE_NORMS).filter((v) => v.departure === 1).length,
        CENSUS.rate.departureReport.lineBp,
        sha256Hex(Object.entries(DOSSIER_PROSE_NORMS).sort(([a], [b]) => (a < b ? -1 : 1))
          .map(([k, v]) => `${k} ${v.departure}`).join('\n')),
      ],
      'attach-set': [
        META_ROWS.filter((r) => r.meta.attach.length > 0).length,
        digestOver((r) => r.meta.attach.join('|')),
      ],
      // ⛔ THE BAND RULE'S LEAF SIDE (SEAM car 5c, the fold's R3). Index 0 is the `source` pin
      // that carries the combining rule verbatim; the loop returns on it before it reads this
      // table, so the hole at index 0 is deliberate and a later car that changed pin 0's kind
      // would be told 'nothing recomputes it' rather than passing silently.
      'comparator-and-band-rule': [
        undefined,
        META_ROWS.filter((r) => r.meta.relation === 'tension' || r.meta.relation === 'contrast').length,
        // ⭐ THE KINSHIP HEAD'S LEAF SIDE (REWRITE car 8a-4). `kin` is the comparator's first
        // input and it must ship on NOTHING: only a modifier has an attach set, and every one
        // of the 708 pools is a spine. The day it moves, a modifier pool has been born and the
        // comparator has an input it did not have before — which is exactly a declared row.
        META_ROWS.filter((r) => Array.isArray(r.meta.kin) && r.meta.kin.length > 0).length,
      ],
      // ⭐ THE PAIR'S JOINTS (ADDENDUM 18 ruling 23; car 8b-W-18i). Indices 0 and 1 are the two
      // `source` pins, which the loop returns on before it reads this table — hence the two
      // deliberate holes. Index 2 recomputes the kind-to-joint table from the KERNEL's own
      // export, so a car that re-worded a joint, dropped the full stop out of a list or moved
      // it off the end of one reds here naming the mechanism.
      'pair-joint': [
        undefined,
        undefined,
        Object.fromEntries(Object.entries(PAIR_JOINTS).map(([kind, list]) => [kind, [...list]])),
      ],
      'fact-and-position-budget': [{ ...COMPOSITION_BOUNDS }],
      'registry-id': [META_ROWS.filter((r) => r.meta.role === 'turn').length],
      // ⛔ A NON-MECHANISM WITH A PIN (SEAM car 5c, SITTING §R cure 4). `seat` was the one
      // register entry carried by ARGUMENT rather than by a measurement, so nothing red if a
      // later car started emitting it on a spine. The pin is its own promotion trigger.
      seat: [META_ROWS.filter((r) => r.meta.seat !== undefined).length],
      'instance-key': [META_ROWS.filter((r) => INDEX_PAIRED_BLOCKS.includes(r.id) && r.meta.attach.length > 0).length],
    };
    const drift = [];
    // A NON-MECHANISM MAY CARRY A PIN, and when it does the same loop recomputes it. A
    // mechanism MUST carry one (asserted above); a non-mechanism's pin is the trigger that
    // promotes it, so it is walked here and not in an arm of its own.
    const pinned = [...SHIFT_REGISTER.mechanisms, ...SHIFT_REGISTER.notMechanisms.filter((n) => n.pin)];
    expect(pinned.length, 'the loop must reach every pinned row, mechanism or not')
      .toBe(SHIFT_REGISTER.mechanisms.length + 1);
    for (const m of pinned) {
      m.pin.forEach((pin, i) => {
        if (pin.kind === 'source') {
          const src = readFileSync(resolve(ROOT, pin.file), 'utf8');
          for (const needle of pin.contains) {
            if (!src.includes(needle)) drift.push(`${m.id}: ${pin.file} no longer contains ${needle}`);
          }
          return;
        }
        const now = (live[m.id] || [])[i];
        if (now === undefined) { drift.push(`${m.id} pin ${i}: nothing recomputes it — the pin is a promise, not a measurement`); return; }
        const want = pin.value;
        const same = pin.kind === 'map'
          ? JSON.stringify(now) === JSON.stringify(want)
          : now === want;
        if (!same) {
          drift.push(`${m.id} pin ${i} (${pin.over}): the register pins ${JSON.stringify(want)}`
            + ` and the corpus measures ${JSON.stringify(now)}. If this move is intended, it is a`
            + ` ${m.shift || 'PROMOTION of a named NON-mechanism to a mechanism'} landing:`
            + ' edit the row IN THE SAME COMMIT and say so.');
        }
      });
    }
    expect(drift).toEqual([]);
  });

  it('MUTANT: a mechanism that moves without its row moving reds naming the mechanism', () => {
    // The reconstruction above, driven over a corpus in which one pool gained a variant.
    const moved = META_ROWS.map((r, i) => (i === 0
      ? { ...r, meta: { ...r.meta, variantCount: r.meta.variantCount + 1 } } : r));
    const pinned = SHIFT_REGISTER.mechanisms.find((m) => m.id === 'variant-count-per-pool').pin[0].value;
    expect(moved.reduce((n, r) => n + r.meta.variantCount, 0)).not.toBe(pinned);
    expect(META_ROWS.reduce((n, r) => n + r.meta.variantCount, 0)).toBe(pinned);
  });

  it('⭐ PRINTS THE ONE-TIME RE-INDEX — the owner\'s veto surface for Shift 1\'s draw half', () => {
    // SITTING §N.2 signed the index-stable draw and left the owner a veto that "stands until
    // that record is signed". The record is the classifier's per-cell diff across the draw
    // change, and it lives on the register's `draw-formula` row because that is the mechanism
    // that moved. It is DECLARED rather than pinned: no arm here can recompute it, since it
    // takes a DRIFT run at two different shas, and a number nobody can recompute must at
    // least be printed and held to its own arithmetic rather than left to be believed.
    const row = SHIFT_REGISTER.mechanisms.find((m) => m.id === 'draw-formula');
    const rec = row.reIndexed;
    expect(rec, 'the draw-formula row must carry its declared re-index').toBeTruthy();
    const classes = rec.byClass;
    const moved = classes['RE-INDEXED'];
    const pct = (n) => `${((n / rec.cells) * 100).toFixed(2)} %`;
    process.stdout.write(`\n[re-index] REWRITE car 8a-1 over ${rec.corpus}, base ${rec.baseSha}\n`
      + `  cells ${rec.cells}\n`
      + `  RE-INDEXED   ${String(moved).padStart(6)}  ${pct(moved)}   <- the one-time cost\n`
      + `  UNCHANGED    ${String(classes.UNCHANGED).padStart(6)}  ${pct(classes.UNCHANGED)}\n`
      + `  REPLACED     ${String(classes.REPLACED).padStart(6)}  <- a FACT would have moved\n`
      + `  WORDING-ONLY ${String(classes['WORDING-ONLY']).padStart(6)}   ADDITIVE ${classes.ADDITIVE}`
      + `   ADDED ${classes.ADDED}   REMOVED ${classes.REMOVED}\n`
      + `  dm ${rec.byAudience.dm.reIndexed} of ${rec.byAudience.dm.cells}`
      + ` · player ${rec.byAudience.player.reIndexed} of ${rec.byAudience.player.cells}\n`
      + `  blocks touched ${rec.blocksTouched} · untouched ${rec.blocksUntouched}`
      + ` · deepest ${rec.deepest} · shallowest ${rec.shallowest}\n`
      + `  ${rec.measuredBy}\n`);
    // ⛔ THE FENCE THE CAR IS SIGNED AGAINST, asserted and not merely printed. A draw change
    // may re-index; it may NOT replace a pool, rewrite a sentence, add a piece, or change the
    // roster. Any of those in this record would mean the car did something else as well.
    expect({
      REPLACED: classes.REPLACED,
      'WORDING-ONLY': classes['WORDING-ONLY'],
      ADDITIVE: classes.ADDITIVE,
      ADDED: classes.ADDED,
      REMOVED: classes.REMOVED,
    }, 'a draw change may only RE-INDEX').toEqual({
      REPLACED: 0, 'WORDING-ONLY': 0, ADDITIVE: 0, ADDED: 0, REMOVED: 0,
    });
    // The arithmetic: the classes partition the cells, and the audiences do too.
    const summed = Object.values(classes).reduce((a, b) => a + b, 0);
    expect(summed, 'the classes must partition the cells').toBe(rec.cells);
    expect(rec.byAudience.dm.cells + rec.byAudience.player.cells).toBe(rec.cells);
    expect(rec.byAudience.dm.reIndexed + rec.byAudience.player.reIndexed).toBe(moved);

    // ⭐⭐ AND THE RECOMPUTATION, which is what turns this row from a declaration into a
    // measurement (REWRITE car 8a-11, SITTING §U c-6; the fold's NEW-3). The arithmetic above
    // is INTERNAL — it holds the row against itself — so a SELF-CONSISTENT falsification
    // passed it: RE-INDEXED 40000 · UNCHANGED 33284 · dm 20000 · player 20000 reads 77/77 and
    // prints "RE-INDEXED 40000 54.58 %" to the owner as the veto surface. The classifier's own
    // per-class, per-block output is now committed beside the row, so every declared field is
    // recomputed from data rather than believed.
    //
    // ⛔ AND THE COMMITTED JSON IS ITSELF ANCHORED, or it would be a second hand-typed number
    // one file over: it carries the sha256 of the TWO per-cell tables it was classified from,
    // and `scripts/prose-manifest-cells.mjs` is deterministic — re-running it at the two shas
    // reproduces those bytes, which is how the tip digest was confirmed three times (at
    // f4005cccd, at 5c7eadb18 and at this car's own tip, byte-identical each time).
    expect(REINDEX.car, 'the committed classifier output is car 8a-1\'s').toBe(rec.car);
    expect(REINDEX.baseSha).toBe(rec.baseSha);
    for (const side of ['base', 'tip']) {
      expect(REINDEX.cellsFiles[side].sha256, `the ${side} cell table's digest`)
        .toMatch(/^[0-9a-f]{64}$/);
      expect(REINDEX.cellsFiles[side].cells, `the ${side} cell table's row count`)
        .toBe(rec.cells);
    }
    // (i) THE CELL TOTAL AND EVERY CLASS, re-derived from the per-block table.
    const blocks = Object.entries(REINDEX.byBlock);
    const recomputed = {
      cells: blocks.reduce((n, [, b]) => n + b.cells, 0),
      moved: blocks.reduce((n, [, b]) => n + b.reIndexed, 0),
      blocksTouched: blocks.filter(([, b]) => b.reIndexed > 0).length,
      blocksUntouched: blocks.filter(([, b]) => b.reIndexed === 0).length,
    };
    expect({
      cells: rec.cells,
      moved,
      blocksTouched: rec.blocksTouched,
      blocksUntouched: rec.blocksUntouched,
    }, '⛔ the declared re-index must be the classifier\'s own arithmetic, block by block')
      .toEqual(recomputed);
    expect(classes.UNCHANGED, 'and UNCHANGED is what the moved cells leave behind')
      .toBe(recomputed.cells - recomputed.moved);
    // (ii) THE AUDIENCE HALVES, from the classifier's own split.
    expect({ dm: rec.byAudience.dm, player: rec.byAudience.player },
      'the declared audience halves must be the classifier\'s')
      .toEqual({ dm: REINDEX.byAudience.dm, player: REINDEX.byAudience.player });
    expect(REINDEX.byClass, 'and every class, including the five the fence holds at zero')
      .toEqual({ ...classes });
    expect(REINDEX.indexOnly).toBe(rec.indexOnly);
    // (iii) THE DEEPEST AND SHALLOWEST BLOCKS ARE DERIVED, so the two prose figures on the row
    // are held by the same data as the integers beside them.
    const shares = blocks.map(([id, b]) => ({ id, share: b.reIndexed / b.cells }))
      .sort((a, b) => b.share - a.share || (a.id < b.id ? -1 : 1));
    const deepest = shares.filter((r) => r.share === shares[0].share).map((r) => r.id);
    const shallowest = shares[shares.length - 1];
    for (const id of deepest) expect(rec.deepest, 'the deepest block, named').toContain(id);
    expect(rec.shallowest, 'the shallowest block, named').toContain(shallowest.id);
    expect(rec.shallowest, 'with its share to two places')
      .toContain(`${(shallowest.share * 100).toFixed(2)}`);
    // And a floor under the record itself: a re-index of nothing would mean the draw did not
    // actually change, and a re-index of everything would mean it was not a draw change.
    expect(moved).toBeGreaterThan(0);
    expect(moved).toBeLessThan(rec.cells);
    expect(rec.blocksUntouched, 'a block the draw change did not reach at all').toBe(0);
  });

  it('names readsCount as NOT a mechanism, by name and with its reason (the ADDENDUM)', () => {
    const row = SHIFT_REGISTER.notMechanisms.find((n) => n.id === 'readsCount');
    expect(row, 'readsCount must be named on the register as a NON-mechanism').toBeTruthy();
    expect(row.why).toMatch(/not a modulus/i);
    expect(row.why).toMatch(/340/);
    expect(row.why).toMatch(/368/);
  });
});

describe('SEAM car 4 — the three leaves, at their floors', () => {
  it('CONNECTIVES: the four reachable pairs, all four AT THEIR FLOORS, and no fifth key', () => {
    expect(Object.keys(DOSSIER_CONNECTIVES).sort()).toEqual([...RELATIONS].sort());
    const pairs = Object.entries(DOSSIER_CONNECTIVES)
      .flatMap(([rel, bySeat]) => Object.keys(bySeat).map((seat) => `${rel}.${seat}`)).sort();
    expect(pairs).toEqual(['addition.sentence', 'consequence.clause', 'contrast.sentence', 'tension.sentence']);
    // ⭐⭐ ALL FOUR REACHED THEIR FLOOR OF THREE AT REWRITE car 8a-9 (S12; SITTING §T.2), AS
    // PUBLIC-COPY DRAFTS signed at the walk (§13 row 27). Asserted VERBATIM rather than by
    // length, because they are copy: a reader of this file should meet the joints themselves.
    expect(DOSSIER_CONNECTIVES.consequence.clause).toEqual([', so', ', and so', ', leaving']);
    expect(DOSSIER_CONNECTIVES.tension.sentence)
      .toEqual(['Against that,', 'Even so,', 'At the same time,']);
    // ⛔ THE EMPTY OPENER IS A PHRASE and STAYS A MEMBER of the two lists that assert adjacency
    // itself — S12 in terms. It leads each list, so a reader meets the plainest joint first.
    expect(DOSSIER_CONNECTIVES.contrast.sentence).toEqual(['', 'Instead,', 'In its place,']);
    expect(DOSSIER_CONNECTIVES.addition.sentence).toEqual(['', 'Beside that,', 'Also,']);
    // ⛔ THE WALLS, ON EVERY JOINT OF EVERY LIST: no em dash, no `which` tail, no digit, no
    // percent. The projector refuses each by name; asserted here too so the leaf itself is
    // held rather than only the parse that produced it.
    const joints = Object.values(DOSSIER_CONNECTIVES).flatMap((bySeat) => Object.values(bySeat).flat());
    expect(joints.length, 'four lists of three').toBe(12);
    expect(joints.filter((j) => /[\u2014\u2013]/.test(j)), 'an em dash in a joint').toEqual([]);
    expect(joints.filter((j) => /\bwhich\b/i.test(j)), 'a `which` tail (wall 6)').toEqual([]);
    expect(joints.filter((j) => /[0-9%]/.test(j)), 'a digit or a percent (T-F14)').toEqual([]);
    // AND THE SEAT'S OWN SHAPE: a CLAUSE joint carries its comma at the FRONT (it rides on the
    // spine's own sentence); a SENTENCE opener carries it at the END (the composer capitalises
    // the opener and down-cases the modifier after it). A joint on the wrong side of its comma
    // would compose a sentence the composer never intended.
    for (const joint of DOSSIER_CONNECTIVES.consequence.clause) {
      expect(joint.startsWith(', '), `${joint}: a clause joint opens on its own comma`).toBe(true);
    }
    for (const [rel, bySeat] of Object.entries(DOSSIER_CONNECTIVES)) {
      if (rel === 'consequence') continue;
      for (const joint of bySeat.sentence) {
        if (joint === '') continue;
        expect(joint.endsWith(','), `${joint}: a sentence opener closes on its own comma`).toBe(true);
        expect(/^[A-Z]/.test(joint), `${joint}: and opens on a capital`).toBe(true);
      }
    }
    // The leaf's own header is what a reader meets: assert it says what the lists now are, and
    // that the two former OWED lists are still UNLICENSED — a different thing from unwritten.
    const header = readFileSync(resolve(ROOT, 'src/data/dossierConnectives.generated.js'), 'utf8')
      .split('\nexport const')[0];
    expect(header).toContain('consequence.clause 3 · tension.sentence 3');
    expect(header).toContain('STILL UNLICENSED');
  });

  it('NORMS: a bit per FIRED pool, frozen, and absent where the corpus never fired', () => {
    const keys = Object.keys(DOSSIER_PROSE_NORMS);
    expect(keys.length).toBe(271);
    expect(Object.values(DOSSIER_PROSE_NORMS).filter((v) => v.departure === 1).length).toBe(72);
    const values = new Set(Object.values(DOSSIER_PROSE_NORMS).map((v) => v.departure));
    expect([...values].sort()).toEqual([0, 1]);
    // Every key is a LIVE (block, pool) of the shipped corpus, and every bit is the census's
    // own rate read against its own line. A norm keyed on a pool nobody holds would be a
    // signal the composer can never consult.
    const live = new Set(META_ROWS.map((r) => `${r.id}::${r.pool}`));
    const orphan = keys.filter((k) => !live.has(k));
    expect(orphan).toEqual([]);
    const wrong = [];
    for (const [key, row] of Object.entries(DOSSIER_PROSE_NORMS)) {
      const at = key.lastIndexOf('::');
      const census = CENSUS_BY_POOL.get(`${key.slice(0, at)} :: ${key.slice(at + 2)}`);
      const want = census.rateBp < CENSUS.rate.departureReport.lineBp ? 1 : 0;
      if (row.departure !== want) wrong.push(`${key}: leaf ${row.departure}, census rate ${census.rateBp} bp`);
    }
    expect(wrong).toEqual([]);
    // And the pools with NO row are exactly the pools the RATE corpus never fired.
    const unfired = CENSUS.rows.filter((r) => r.rateBp === null).length;
    expect(META_ROWS.length - keys.length).toBe(unfired);
  });

  it('⛔ RELATIONS: 165 rows with a direction, three ratified aliases, and a join of ZERO', () => {
    expect(Object.keys(DOSSIER_RELATIONS).length).toBe(165);
    const rows = Object.values(DOSSIER_RELATIONS).flat();
    expect(rows.length).toBe(165);
    const directions = new Set(rows.map((r) => r.direction));
    expect([...directions]).toEqual(['a→b']);
    expect([...new Set(rows.map((r) => r.relation))]).toEqual(['consequence']);
    expect([...new Set(rows.map((r) => r.source))].sort()).toEqual(['a', 'b', 'c']);
    // The composer reads the ARROW spelling and the census writes the ASCII one; the leaf is
    // what the composer reads, so the transcription is asserted rather than assumed.
    expect(CENSUS.relations.rows.every((r) => r.direction === 'a->b')).toBe(true);

    expect(DOSSIER_RELATION_ALIASES.length).toBe(3);
    expect(DOSSIER_RELATION_ALIASES.map((a) => a.endpoint).sort())
      .toEqual(['cause:occupation', 'economicGates.military', 'system:food_security']);
    expect([...new Set(DOSSIER_RELATION_ALIASES.map((a) => a.evidence))]).toEqual(['identifier']);

    // ⛔⛔ THE JOIN IS EMPTY, AND THAT IS CAR 0's F1 RE-EXECUTED ON THE SHIPPED LEAF. With the
    // ratified aliases applied, NO row has both endpoints resolving to a field a desk reads, so
    // no `consequence` and no `tension` joint is authorable anywhere today and every joint
    // stands at the `addition` floor. This is the arm that would tell the sitting the day an
    // alias makes the first one authorable.
    const aliasOf = new Set(DOSSIER_RELATION_ALIASES.map((a) => a.endpoint));
    const deskRoots = new Set(CENSUS.rows.flatMap((r) => r.reads).map((p) => p.split('.')[0]));
    const resolves = (e) => aliasOf.has(e) || deskRoots.has(String(e).split('.')[0]);
    const joined = Object.keys(DOSSIER_RELATIONS)
      .filter((key) => key.split('|').every((endpoint) => resolves(endpoint)));
    expect(joined).toEqual([]);
    // Non-vacuity: the resolver CAN resolve — ten rows join on exactly one endpoint.
    const half = Object.keys(DOSSIER_RELATIONS)
      .filter((key) => key.split('|').some((endpoint) => resolves(endpoint))).length;
    expect(half).toBe(10);
    expect(deskRoots.size).toBeGreaterThanOrEqual(60);
  });

  it('keeps the three leaves in src/data/ so the lazy-chunk rule claims them', () => {
    // vite.config.js:877-878 routes `/src/data/` to `data-lazy` unless the module is in the
    // EAGER set, and the composer that will import these three is reachable only from lazy tab
    // components. The chunk-membership assertion itself is car 2's, under VERIFY_DIST after a
    // build; this arm holds the PRECONDITION that rule needs, which is a source fact.
    for (const rel of ['src/data/dossierConnectives.generated.js', 'src/data/proseNorms.generated.js',
      'src/data/dossierRelations.generated.js']) {
      expect(readFileSync(resolve(ROOT, rel), 'utf8')).toContain('GENERATED by scripts/generate-dossier-state-prose.mjs');
    }
    const vite = readFileSync(resolve(ROOT, 'vite.config.js'), 'utf8');
    expect(vite).toContain("id.includes('/src/data/')");
  });
});

// ── §2.5's REFUSAL TABLE, ROW BY ROW, EACH WITH ITS PLANT ────────────────────────────
//
// The annex carries no typed line at this tip, so every one of these rules is exercised by a
// FIXTURE and by nothing else — which is exactly why each needs a plant AND a clean control.
// A refusal nobody has watched fire is a refusal nobody has measured.

/** A pool fixture in the shape the projector hands `assertPoolDeclaration`. */
function poolFixture(overrides = {}) {
  return {
    blockId: 'DS-TEST-1',
    poolKey: 'muster: short',
    variants: [
      { angle: 'plain', marks: ['dm-only'], text: 'the muster is thin', slots: [], index: 1 },
      { angle: 'plain', marks: ['dm-only'], text: 'the roll is short', slots: [], index: 2 },
    ],
    declared: {},
    censusOf: (key) => ({
      'muster: short': { tests: ['defenseProfile.economicGates.military'], reads: ['defenseProfile.economicGates.military'], status: 'RESOLVED', objectClass: 'purse', objectClasses: ['purse'], sites: [] },
      'walls: standing': { tests: ['walls'], reads: ['walls'], status: 'RESOLVED', objectClass: 'wall', objectClasses: ['wall'], sites: [] },
      'purse: short': { tests: ['defenseProfile.economicGates.military'], reads: ['defenseProfile.economicGates.military'], status: 'RESOLVED', objectClass: 'purse', objectClasses: ['purse'], sites: [] },
    })[key] || null,
    isCovert: (field) => COVERT_SOURCES.some((source) => String(field).split('.').includes(source)),
    edgesFrom: () => [],
    blockPoolKeys: new Set(['muster: short', 'walls: standing', 'purse: short']),
    declaredRoleByPool: { 'muster: short': 'modifier', 'walls: standing': 'spine', 'purse: short': 'spine' },
    ...overrides,
  };
}

/** The declared metadata of a lawful `addition` modifier, as the clean control. */
const LAWFUL_MODIFIER = Object.freeze({
  role: 'modifier',
  reads: ['defenseProfile.economicGates.military'],
  relation: 'addition',
  form: 'sentence',
  move: 'CONSEQUENCE',
  attach: ['walls: standing'],
});

describe('SEAM car 4 — §2.5\'s grammar, and every refusal it declares', () => {
  it('reads a typed line, several to a line, and refuses an unknown token AT the token', () => {
    const decls = readDeclarations('**ROLE:** `modifier` · **FORM:** `sentence` · **MOVE:** `CONSEQUENCE`');
    expect(decls.map((d) => d.tag)).toEqual(['ROLE', 'FORM', 'MOVE']);
    expect(decls.map((d) => d.tokens[0])).toEqual(['modifier', 'sentence', 'CONSEQUENCE']);
    expect(isDeclarationLine('**ROLE:** `modifier`')).toBe(true);
    // ⛔ AND NOT A LABEL, WHICH IS THE COLLISION THAT MATTERS. `**STATE-KEY.**` opens a prose
    // paragraph in 68 blocks and must stay prose; a bold pool label must stay a label.
    expect(isDeclarationLine('**STATE-KEY.** The closed ladder')).toBe(false);
    expect(isDeclarationLine('**COMBINATION C1: a high rung on a working approach**')).toBe(false);

    const into = {};
    applyDeclaration(readDeclarations('**ROLE:** `spine`')[0], into, 'x');
    expect(into.role).toBe('spine');
    for (const bad of ['**ROLE:** `header`', '**RELATION:** `cause`', '**MOVE:** `ABSENCE`',
      '**MOVE:** `HISTORY`', '**FORM:** `clause`']) {
      expect(() => applyDeclaration(readDeclarations(bad)[0], {}, 'x'), bad).toThrow();
    }
    expect(POOL_ROLES).toEqual(['spine', 'modifier', 'turn']);
    expect(MODIFIER_MOVES).toHaveLength(6);
    // ANCHORED on CONSEQUENCE, a sibling of the same closed vocabulary: the two struck moves
    // are absent BECAUSE they are struck (§4.6 / R-DA-08 for ABSENCE, R-DA-19 / S15 for
    // HISTORY on a state spine), not because the roster drifted away.
    expectAbsentWithAnchor(MODIFIER_MOVES, 'ABSENCE', 'CONSEQUENCE', 'the modifier move vocabulary');
    expectAbsentWithAnchor(MODIFIER_MOVES, 'HISTORY', 'CONSEQUENCE', 'the modifier move vocabulary');
  });

  it('refuses a `fragment` while S2 is unsigned, and says the clause seat is what is missing', () => {
    expect(S2_SIGNED).toBe(false);
    expect(() => applyDeclaration(readDeclarations('**FORM:** `fragment`')[0], {}, 'x'))
      .toThrow(/S2 is unsigned/);
    expect(() => applyDeclaration(readDeclarations('**FORM:** `sentence`')[0], {}, 'x')).not.toThrow();
  });

  it('refuses a NARROWS with no chair ruling id and no quoted sentence', () => {
    const ok = readDeclarations('**NARROWS:** `walls` — S12 §O.1 ruled "the reads grain is the selecting branch"')[0];
    expect(() => applyDeclaration(ok, {}, 'x')).not.toThrow();
    const bare = readDeclarations('**NARROWS:** `walls`')[0];
    expect(() => applyDeclaration(bare, {}, 'x')).toThrow(/no chair ruling id and quoted sentence/);
  });

  it('CLEAN CONTROL: a lawful `addition` modifier passes every cross-field refusal', () => {
    expect(() => assertPoolDeclaration(poolFixture({ declared: { ...LAWFUL_MODIFIER } }))).not.toThrow();
  });

  it('PLANT: a numeric pool key — it cannot be told from a variant row in an annex diff', () => {
    expect(() => assertPoolDeclaration(poolFixture({ poolKey: '3', declared: {} })))
      .toThrow(/collides with a variant row's own numbering/);
    expect(() => assertPoolDeclaration(poolFixture({ poolKey: 'C3', declared: {} }))).not.toThrow();
  });

  it('PLANT: a READS the census does not list, and two READS on one modifier', () => {
    expect(() => assertPoolDeclaration(poolFixture({
      declared: { ...LAWFUL_MODIFIER, reads: ['walls'] },
    }))).toThrow(/which the wiring census does not list/);
    expect(() => assertPoolDeclaration(poolFixture({
      declared: { ...LAWFUL_MODIFIER, reads: ['defenseProfile.economicGates.military', 'walls'] },
    }))).toThrow(/READS exactly ONE field path/);
  });

  it('PLANT: an UNMARKED variant on a COVERT-SOURCE pool (T-F5)', () => {
    const covert = `${COVERT_SOURCES[0]}.count`;
    const censusOf = (key) => (key === 'muster: short'
      ? { tests: [covert], reads: [covert], status: 'RESOLVED', objectClass: null, objectClasses: [], sites: [] }
      : poolFixture().censusOf(key));
    // Every variant marked: lawful, because no player page can meet it.
    expect(() => assertPoolDeclaration(poolFixture({
      censusOf, declared: { ...LAWFUL_MODIFIER, reads: [covert] },
    }))).not.toThrow();
    // One variant unmarked: the player page would show the SHAPE of a DM fact.
    expect(() => assertPoolDeclaration(poolFixture({
      censusOf,
      variants: [
        { angle: 'plain', marks: ['dm-only'], text: 'a', slots: [], index: 1 },
        { angle: 'plain', marks: [], text: 'b', slots: [], index: 2 },
      ],
      declared: { ...LAWFUL_MODIFIER, reads: [covert] },
    }))).toThrow(/carry no `dm-only` mark/);
  });

  it('PLANT: a `consequence` with no table row, and one whose only row runs modifier→spine', () => {
    expect(() => assertPoolDeclaration(poolFixture({
      declared: { ...LAWFUL_MODIFIER, relation: 'consequence', form: undefined },
    }))).toThrow(/NO relation-table row/);
    expect(() => assertPoolDeclaration(poolFixture({
      declared: { ...LAWFUL_MODIFIER, relation: 'consequence', form: undefined },
      edgesFrom: () => [{ relation: 'consequence', direction: 'b→a' }],
    }))).toThrow(/that row is a CAUSE and seats as `addition`/);
    // A row in the LICENSED direction passes, which is what makes the two above refusals and
    // not a blanket ban.
    expect(() => assertPoolDeclaration(poolFixture({
      declared: { ...LAWFUL_MODIFIER, relation: 'consequence', form: undefined },
      edgesFrom: () => [{ relation: 'consequence', direction: 'a→b' }],
    }))).not.toThrow();
    // A modifier with NO relation at all.
    expect(() => assertPoolDeclaration(poolFixture({
      declared: { ...LAWFUL_MODIFIER, relation: undefined },
    }))).toThrow(/a modifier declares a RELATION/);
  });

  it('PLANT: a FORM that disagrees with the seat its relation takes', () => {
    expect(() => assertPoolDeclaration(poolFixture({
      declared: { ...LAWFUL_MODIFIER, relation: 'contrast', form: 'fragment' },
    }))).toThrow(/disagrees with the seat/);
  });

  it('PLANT: an ATTACH the block does not hold, and one whose spine already tests the field', () => {
    expect(() => assertPoolDeclaration(poolFixture({
      declared: { ...LAWFUL_MODIFIER, attach: ['DS-GEN-3 :: purse: short'] },
    }))).toThrow(/which block DS-TEST-1 does not hold/);
    expect(() => assertPoolDeclaration(poolFixture({
      declared: { ...LAWFUL_MODIFIER, attach: ['purse: short'] },
    }))).toThrow(/whose selecting branch already tests/);
  });

  it('PLANT: an ATTACH on an INDEX-PAIRED list position, refused until Shift 2 (P-F7)', () => {
    expect(INDEX_PAIRED_BLOCKS).toEqual(['DS-GEN-2', 'DS-GEN-8', 'DS-REL-1']);
    expect(() => assertPoolDeclaration(poolFixture({
      blockId: 'DS-GEN-2', declared: { ...LAWFUL_MODIFIER },
    }))).toThrow(/INDEX-PAIRED list position/);
    // And the same set of declarations on a block that is NOT index-paired is lawful.
    expect(() => assertPoolDeclaration(poolFixture({ declared: { ...LAWFUL_MODIFIER } }))).not.toThrow();
  });

  it('PLANT: an ATTACH naming the same civic object class, and one SPANNING two classes', () => {
    const censusOf = (key) => (key === 'walls: standing'
      ? { tests: ['walls'], reads: ['walls'], status: 'RESOLVED', objectClass: 'purse', objectClasses: ['purse'], sites: [] }
      : poolFixture().censusOf(key));
    expect(() => assertPoolDeclaration(poolFixture({
      censusOf, declared: { ...LAWFUL_MODIFIER },
    }))).toThrow(/name the same civic object class/);
    // T-F3: a relation-bearing pool whose attach set spans two value classes is TWO pools.
    const spanning = (key) => ({
      'walls: standing': { tests: ['walls'], reads: ['walls'], status: 'RESOLVED', objectClass: 'wall', objectClasses: ['wall'], sites: [] },
      'purse: short': { tests: ['coin'], reads: ['coin'], status: 'RESOLVED', objectClass: 'law', objectClasses: ['law'], sites: [] },
    })[key] || poolFixture().censusOf(key);
    expect(() => assertPoolDeclaration(poolFixture({
      censusOf: spanning,
      declared: { ...LAWFUL_MODIFIER, relation: 'contrast', attach: ['walls: standing', 'purse: short'] },
    }))).toThrow(/spans 2 value classes/);
    // The same spanning set on an `addition` is lawful: no relation flips with polarity there.
    expect(() => assertPoolDeclaration(poolFixture({
      censusOf: spanning,
      declared: { ...LAWFUL_MODIFIER, attach: ['walls: standing', 'purse: short'] },
    }))).not.toThrow();
  });

  it('PLANT: a turn with no EXPLAINS, an id outside the registry, and a tier-2 id REFUSED', () => {
    expect(() => assertPoolDeclaration(poolFixture({
      declared: { role: 'turn', attach: [] },
    }))).toThrow(/a turn declares EXPLAINS/);
    expect(turnKeyStanding('condition:plague').ok).toBe(true);
    expect(turnKeyStanding('condition:plague:severe').ok).toBe(true);
    expect(turnKeyStanding('corruption:covert').ok).toBe(true);
    expect(turnKeyStanding('faction:ascendant').ok).toBe(false);
    // ⛔ A TIER-2 ID ANSWERS WITH ITS REASON, not with "unknown": the key is real, the import
    // wall is what refuses it.
    const refused = turnKeyStanding('cause:trade-strangled');
    expect(refused.ok).toBe(false);
    expect(refused.why).toMatch(/REFUSED/);
    expect(refused.why).toMatch(/import wall/);
    expect(turnKeyStanding('join:JF-CPL-6b').why).toMatch(/join-deriver/);
  });

  it('PLANT: a `[grammar: Vn]` tag left in `marks` would open the closed mark vocabulary', () => {
    // The routing is the projector's; this arm proves the ROUTE by reading the shipped corpus,
    // where the mark vocabulary is closed at eight words and no `grammar:` string appears.
    const marks = new Set(allStateBlocks.flatMap(([, b]) => Object.values(b.pools).flat())
      .flatMap((v) => v.marks || []));
    expect([...marks].filter((m) => m.startsWith('grammar'))).toEqual([]);
    const src = readFileSync(resolve(ROOT, 'scripts/generate-dossier-state-prose.mjs'), 'utf8');
    expect(src).toContain('GRAMMAR_TAG_RE');
    // No variant carries a grammar tag yet — Shift 1 authors them — so the claim the corpus
    // supports is the ABSENCE, pinned in both directions.
    const tagged = allStateBlocks.flatMap(([, b]) => Object.values(b.pools).flat())
      .filter((v) => v.grammar !== undefined);
    expect(tagged).toEqual([]);
  });

  it('PLANT: a face beyond the pin, on a bound row, naming a slot its parent lacks, naming {settlement} (ADDENDUM 18 ruling 12), or proper-initial', () => {
    const base = {
      label: 'x',
      parent: { angle: 'plain', text: 'the {settlement} muster is thin', slots: ['settlement'] },
      // THE SUBSET CONTROL: a face may OMIT a parent slot (ADDENDUM 18 ruling 12 — the fills
      // are the spine's; an unused fill is harmless).
      faces: ['the muster here is thin'],
      pinnedFaceCount: 4,
      shapeOf: (slot) => (slot === 'settlement' || slot === 'faction' ? 'proper' : 'bare-common'),
      clauseOpeners: ['and', 'so'],
      form: 'sentence',
    };
    expect(() => assertFaces(base)).not.toThrow();
    expect(() => assertFaces({ ...base, faces: ['a', 'b', 'c', 'd'] })).toThrow(/against a pin of 4/);
    expect(() => assertFaces({ ...base, parent: { ...base.parent, angle: 'canonical' } }))
      .toThrow(/the seven bound rows keep ONE face/);
    // A face may never ADD a slot: no fill reaches it and the rung goes silent.
    expect(() => assertFaces({ ...base, faces: ['the {faction} muster is thin'] })).toThrow(/SUBSET of its spine/);
    // ⛔ RULING 12: the town never names itself inside a [face] — mid-sentence or opening.
    expect(() => assertFaces({ ...base, faces: ['the muster of {settlement} is thin'] })).toThrow(/ruling 12/);
    expect(() => assertFaces({ ...base, faces: ['{settlement} keeps a thin muster'] })).toThrow(/ruling 12/);
    // T-F8 STAYS for the other `proper`-typed slots: a sentence face never opens on one.
    const twoSlots = { ...base, parent: { angle: 'plain', text: 'the {settlement} muster answers to {faction}', slots: ['settlement', 'faction'] } };
    expect(() => assertFaces({ ...twoSlots, faces: ['the muster answers to {faction}'] })).not.toThrow();
    expect(() => assertFaces({ ...twoSlots, faces: ['{faction} keeps the muster'] }))
      .toThrow(/opens on the `proper`-typed slot/);
    // The fragment half: a face may never carry the joint, which lives in the leaf.
    const frag = { ...base, form: 'fragment', parent: { angle: 'plain', text: 'thin', slots: [] }, faces: ['thin'] };
    expect(() => assertFaces(frag)).not.toThrow();
    expect(() => assertFaces({ ...frag, faces: [', and thin'] })).toThrow(/opens on a comma/);
    expect(() => assertFaces({ ...frag, faces: ['and thin'] })).toThrow(/a word of a clause list/);
  });

  it('⭐ THE FACE PIN IS DERIVED FROM THE SOURCE VOCABULARY, so the ceiling and the powers cannot drift apart (car 8b-W-18j)', () => {
    // ⛔ WHY A SOURCE SCAN AND NOT AN IMPORT. `scripts/generate-dossier-state-prose.mjs` is a
    // top-level script with no exports and no main guard: importing it to read `FACE_PIN`
    // would run the whole projection inside a unit test. The estate's own idiom for a
    // constant that lives in a script is therefore the scan (the `kind: source` pins on the
    // shift register, and the GRAMMAR_TAG_RE arm above), and the arm below drives the real
    // mechanism — `assertFaces` at the derived pin — so the scan is not the only proof.
    const src = readFileSync(resolve(ROOT, 'scripts/generate-dossier-state-prose.mjs'), 'utf8');
    expect(src, 'the pin is the spine plus one face per power, spelled as a derivation')
      .toContain('const FACE_PIN = 1 + FACE_SOURCES.length;');
    expect(src, 'and the vocabulary comes from the kernel, not a copy in the script')
      .toContain("import { FACE_SOURCES } from '../src/domain/display/stateProse/stateProseKernel.js';");
    // ⛔ THE NEGATIVE HALF: a literal would pass the `toContain` above if somebody added one
    // beside the derivation, so the numeric spelling is refused by name.
    expect(src.match(/const FACE_PIN\s*=\s*\d+\s*;/), 'no numeric literal ceiling survives').toBe(null);
    // THE MECHANISM, DRIVEN. At the derived pin a variant may carry one face per power and
    // exactly one more is refused — which is what "a ceiling that binds" means.
    const pin = 1 + FACE_SOURCES.length;
    const base = {
      label: 'j',
      parent: { angle: 'plain', text: 'the muster is thin', slots: [] },
      faces: [],
      pinnedFaceCount: pin,
      shapeOf: () => 'bare-common',
      clauseOpeners: ['and', 'so'],
      form: 'sentence',
    };
    const faces = (n) => Array.from({ length: n }, (_, i) => `the muster is thin, reading ${'x'.repeat(i + 1)}`);
    expect(() => assertFaces({ ...base, faces: faces(pin - 1) }), 'one face per power fits under the spine').not.toThrow();
    expect(() => assertFaces({ ...base, faces: faces(pin) })).toThrow(new RegExp(`against a pin of ${pin}`));
    // ⛔ AND IT IS A CEILING, NOT A FLOOR: every pool the corpus ships stands well under it,
    // which is the whole zero-shift argument for this car.
    const counts = allStateBlocks.flatMap(([, b]) => Object.values(b.pools).flat())
      .map((v) => 1 + (v.wordings ? v.wordings.length : 0));
    expect(Math.max(...counts), 'the largest face count in the shipped corpus').toBeLessThanOrEqual(pin);
  });

  it('⭐ ONE FACE PER POWER — the source tag parses, is stripped from the text, and an unknown source is refused NAMING the vocabulary (ADDENDUM 18 ruling 15; car 8b-W-18c)', () => {
    // The row shape, end to end: FACE_ROW_RE takes the row, parseFaceRow the rest.
    const row = '  - `[face]` `[hall]` The hall would like it noted that the circuit is kept.';
    const m = row.match(FACE_ROW_RE);
    expect(m, 'FACE_ROW_RE is unchanged and still takes a tagged row').toBeTruthy();
    // ⭐ `compromised` JOINS THE PARSED SHAPE AT CAR 8b-W-18m (ADDENDUM 18 ruling 26): a FLAG
    // rather than a position, false on every row that does not carry the mark — which is every
    // row of the shipped corpus, so nothing the projector emits moves.
    expect(parseFaceRow(m[1], 'x')).toEqual({ text: 'The hall would like it noted that the circuit is kept.', source: 'hall', pair: null, compromised: false, observed: false });
    // A bare face is the stranger's: no tag, no source, no pair — the shape every face had before this car.
    expect(parseFaceRow('The circuit is kept.', 'x')).toEqual({ text: 'The circuit is kept.', source: null, pair: null, compromised: false, observed: false });
    // The pair, with its KIND (the owner's refinement, 2026-09-13).
    expect(parseFaceRow('`[tavern · pair 1 · disagree]` Nobody stands on it, says the tavern.', 'x'))
      .toEqual({ text: 'Nobody stands on it, says the tavern.', source: 'tavern', pair: { id: 1, kind: 'disagree' }, compromised: false, observed: false });
    for (const kind of PAIR_KINDS.filter((k) => k !== WEIGH_KIND)) {
      expect(parseFaceRow(`\`[watch · pair 3 · ${kind}]\` text`, 'x').pair).toEqual({ id: 3, kind });
    }
    // ⭐ THE FIFTH KIND IS THE ARCHIVER'S AND ONLY THE ARCHIVER'S (car 8b-W-18i).
    expect(parseFaceRow(`\`[${ARCHIVER_SOURCE} · pair 3 · ${WEIGH_KIND}]\` It may be that both are right.`, 'x'))
      .toEqual({ text: 'It may be that both are right.', source: ARCHIVER_SOURCE, pair: { id: 3, kind: WEIGH_KIND }, compromised: false, observed: false });
    expect(FACE_TAG_RE.test('`[hall]` text')).toBe(true);
    expect(FACE_TAG_RE.test('The hall text')).toBe(false);
    // Every word of the vocabulary parses; the vocabulary is the kernel's, not a copy.
    // Every POWER parses bare. The thirteenth word is not a power: a bare `archiver` tag is
    // refused, and its own arm below drives that (car 8b-W-18i).
    for (const source of FACE_SOURCES.filter((s) => s !== ARCHIVER_SOURCE)) {
      expect(parseFaceRow(`\`[${source}]\` t`, 'x').source).toBe(source);
    }
    // ⛔ REFUSALS, each naming what a writer needs to read.
    expect(() => parseFaceRow('`[guilds]` t', 'L')).toThrow(/L: .*`guilds`.*not a power of the town.*stranger · elders · hall · tavern · guild · register · muster · watch · garrison · gate · market · court/);
    expect(() => parseFaceRow('`[ledger]` t', 'L'), 'an angle tag in the source slot is refused, loudly').toThrow(/not a power of the town/);
    expect(() => parseFaceRow('`[hall · twin 1 · disagree]` t', 'L')).toThrow(/pair N · KIND/);
    expect(() => parseFaceRow('`[hall · pair 0 · disagree]` t', 'L')).toThrow(/positive integer/);
    expect(() => parseFaceRow('`[hall · pair 1]` t', 'L'), 'a pair with no kind').toThrow(/PAIR KINDS.*disagree · reinforce · aside · view/);
    expect(() => parseFaceRow('`[hall · pair 1 · quarrel]` t', 'L')).toThrow(/`quarrel`.*disagree · reinforce · aside · view/);
    expect(() => parseFaceRow('`[hall · pair 1 · view · extra]` t', 'L')).toThrow(/the most is three/);
  });

  it('⭐ assertFaces refuses an unknown source, a pair of one or three, a one-source pair, a mixed-kind pair and a pair on a fragment (car 8b-W-18c)', () => {
    const base = {
      label: 'y',
      parent: { angle: 'plain', text: 'the muster is thin', slots: [] },
      faces: ['the hall counts it thin', 'the tavern counts it thinner'],
      sources: ['hall', 'tavern'],
      pairs: [{ id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }],
      pinnedFaceCount: 4,
      shapeOf: () => 'bare-common',
      clauseOpeners: ['and', 'so'],
      form: 'sentence',
    };
    expect(() => assertFaces(base), 'two powers, one pair, one kind: lawful').not.toThrow();
    expect(() => assertFaces({ ...base, sources: undefined, pairs: undefined }), 'no lists at all: the pre-car shape').not.toThrow();
    expect(() => assertFaces({ ...base, sources: ['hall', 'guilds'] })).toThrow(/face 2 names the source `guilds`.*CLOSED at the kernel/);
    expect(() => assertFaces({ ...base, pairs: [{ id: 1, kind: 'disagree' }, null] })).toThrow(/pair 1 is carried by 1 face/);
    expect(() => assertFaces({ ...base, faces: [...base.faces, 'the watch too'], sources: ['hall', 'tavern', 'watch'], pairs: [{ id: 1, kind: 'view' }, { id: 1, kind: 'view' }, { id: 1, kind: 'view' }] }))
      .toThrow(/pair 1 is carried by 3 face/);
    expect(() => assertFaces({ ...base, sources: ['hall', 'hall'] })).toThrow(/two faces of ONE source \(`hall`\)/);
    expect(() => assertFaces({ ...base, sources: [null, null] }), 'two untagged faces are two strangers').toThrow(/ONE source \(`stranger`\)/);
    expect(() => assertFaces({ ...base, pairs: [{ id: 1, kind: 'disagree' }, { id: 1, kind: 'aside' }] })).toThrow(/a pair has ONE kind/);
    expect(() => assertFaces({ ...base, pairs: [{ id: 1, kind: 'quarrel' }, { id: 1, kind: 'quarrel' }] })).toThrow(/the kinds are disagree · reinforce · aside · view/);
    expect(() => assertFaces({ ...base, form: 'fragment', faces: ['thin', 'thinner'] })).toThrow(/stands on a `fragment`-form pool/);
    expect(() => assertFaces({ ...base, sources: ['hall'] })).toThrow(/parallel by construction/);
    // Unpaired sourced faces are lawful on either form.
    expect(() => assertFaces({ ...base, pairs: [null, null] })).not.toThrow();
    expect(() => assertFaces({ ...base, form: 'fragment', faces: ['thin', 'thinner'], pairs: [null, null] })).not.toThrow();
  });

  it('⭐ THE ARCHIVER\'S WEIGHING ROW — the tag parses at the row, and every refusal names what a writer must read (ADDENDUM 18 ruling 22; car 8b-W-18i)', () => {
    // ── THE ROW-LOCAL REFUSALS (`parseFaceRow`), taken where the writer can see the line ───
    // A weigh on a power, and a power's mark on the archiver, are both decidable from ONE tag.
    expect(() => parseFaceRow(`\`[tavern · pair 1 · ${WEIGH_KIND}]\` t`, 'L'))
      .toThrow(/L: .*marks pair 1 `weigh` but speaks for `tavern`.*ARCHIVER'S one sentence closing a pair/);
    expect(() => parseFaceRow(`\`[${ARCHIVER_SOURCE} · pair 1 · disagree]\` t`, 'L'))
      .toThrow(/not a power of the town and never half of a pair; the only mark it takes is `weigh`/);
    expect(() => parseFaceRow(`\`[${ARCHIVER_SOURCE}]\` It may be that both are right.`, 'L'))
      .toThrow(/with no pair.*CLOSES a pair and never stands alone/);

    // ── THE LEAF-SIDE REFUSALS (`assertFaces`), which a leaf projected elsewhere still meets ─
    const lawful = {
      label: 'w',
      parent: { angle: 'plain', text: 'the walls stand', slots: [] },
      faces: [
        'The hall has the circuit kept.',
        'The tavern says nobody stands on it.',
        'It may be that the two are describing different weeks.',
      ],
      sources: ['hall', 'tavern', ARCHIVER_SOURCE],
      pairs: [{ id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, { id: 1, kind: WEIGH_KIND }],
      pinnedFaceCount: 1 + FACE_SOURCES.length,
      shapeOf: () => 'bare-common',
      clauseOpeners: ['and', 'so'],
      form: 'sentence',
    };
    expect(() => assertFaces(lawful), 'two halves and one weighing: lawful').not.toThrow();
    expect(() => assertFaces({ ...lawful, pairs: [{ id: 1, kind: 'reinforce' }, { id: 1, kind: 'reinforce' }, { id: 1, kind: WEIGH_KIND }] }),
      'a reinforce may be weighed too').not.toThrow();
    // ⛔ A WEIGH ON AN ASIDE OR A VIEW — neither leaves anything to weigh.
    for (const kind of ['aside', 'view']) {
      expect(() => assertFaces({ ...lawful, pairs: [{ id: 1, kind }, { id: 1, kind }, { id: 1, kind: WEIGH_KIND }] }), kind)
        .toThrow(new RegExp(`pair 1 is a \`${kind}\` and carries a weighing row`));
    }
    // ⛔ A SECOND WEIGH ON ONE PAIR — the archiver speaks once, or not at all.
    expect(() => assertFaces({
      ...lawful,
      faces: [...lawful.faces, 'Or the hall is simply behind on its filing.'],
      sources: [...lawful.sources, ARCHIVER_SOURCE],
      pairs: [...lawful.pairs, { id: 1, kind: WEIGH_KIND }],
    })).toThrow(/pair 1 carries 2 weighing rows.*speaks ONCE/);
    // ⛔ A WEIGH WITH NO PAIR — an id no two halves carry.
    expect(() => assertFaces({ ...lawful, pairs: [null, null, { id: 4, kind: WEIGH_KIND }] }))
      .toThrow(/pair 4 carries a weighing row and NO pair to weigh/);
    // ⛔ A WEIGH THAT IS NOT THE ARCHIVER'S, AND AN ARCHIVER THAT IS NOT A WEIGH.
    expect(() => assertFaces({ ...lawful, sources: ['hall', 'tavern', 'court'] }))
      .toThrow(/face 3 is marked `weigh` but speaks for `court`/);
    expect(() => assertFaces({ ...lawful, pairs: [{ id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null] }))
            // ⭐ RE-WORDED AT CAR 8b-W-18n: the refusal now names BOTH doors the archiver has —
      // the weighing (ruling 22) and the observation (ruling 27) — because a writer who
      // reads only the first would delete a lawful observed face to satisfy it.
      .toThrow(/face 3 speaks for the `archiver` and is neither a `weigh` nor `observed`/);
    // ⛔ MORE THAN ONE SENTENCE IN THE ARCHIVER'S HAND — three in the unit at most.
    expect(() => assertFaces({
      ...lawful,
      faces: [...lawful.faces.slice(0, 2), 'It may be that the two describe different weeks. The hall is behind on its filing.'],
    })).toThrow(/face 3 weighs pair 1 in 2 sentences.*ONE sentence/);
    // ⛔ AND THE ELLIPSIS IS NOT A STOP — the counter is the kernel's, so §7's own device in
    // the archiver's hand does not read as two sentences and is not refused.
    expect(() => assertFaces({
      ...lawful,
      faces: [...lawful.faces.slice(0, 2), 'It may be that the two describe different weeks… or that one of them is wrong.'],
    })).not.toThrow();
    // ⛔ THE PAIR ITSELF IS STILL EXACTLY TWO HALVES: the weighing does not make it three.
    expect(() => assertFaces({
      ...lawful,
      faces: [...lawful.faces, 'The watch says the walk is not in the record.'],
      sources: [...lawful.sources, 'watch'],
      pairs: [...lawful.pairs, { id: 1, kind: 'disagree' }],
    })).toThrow(/pair 1 is carried by 3 face/);
    // ⛔ AND THE WEIGHING COUNTS AGAINST THE FACE PIN like any other face (car 8b-W-18j's
    // ceiling is what lets a full pool carry one at all).
    expect(() => assertFaces({ ...lawful, pinnedFaceCount: 3 })).toThrow(/against a pin of 3/);
  });

  // ⭐ THE ZERO-SHIFT GROUND OF CAR 8b-W-18c HAS BEEN LAWFULLY ENDED BY THE FIRST v3 POOL, and
  // the arm is re-pinned rather than deleted: `DS-DEF-2` is the ONE block that ships sourced
  // faces today, its pools' rosters are named here face by face, and EVERY OTHER BLOCK still
  // carries no `sources` and no `pairs` at all. A further pool landing faces reds this arm by
  // name and is re-pinned in the commit that lands it, exactly as the shift register's
  // `face-count-per-variant` row is.
  //
  // ⭐⭐ RE-PINNED AT THE 8b DS-DEF-2 DRAFT GATE (v3), which landed THREE MORE POOLS of this
  // same block in one commit: `Invasion & War: force with NO walls`, `Internal Security: no
  // legal infrastructure` and `Disasters & Famine: NO reserves, NO medical provision`. The arm
  // that survives unchanged is the one that matters — nothing OUTSIDE DS-DEF-2 carries a face.
  const SOURCED_TODAY = Object.freeze({
    'DS-DEF-2 :: Invasion & War: walls with NO force #0': {
      sources: [null, 'elders', 'hall', 'guild'],
      pairs: [null, null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }],
    },
    // ⭐ RE-FROZEN AT THE POOL RE-CUT OF CARS 8b-W-18n/18o. Variant #1 gains the ARCHIVER'S
    // OWN OBSERVATION (ruling 27) and variant #2 gains the PUBLIC (ruling 28) — the two forms
    // those cars created, taking their first seats in the corpus. Both are a GROW and the
    // register's `face-count-per-variant` row carries the declared numbers (4,4,4 → 4,5,5).
    'DS-DEF-2 :: Invasion & War: walls with NO force #1': {
      sources: [null, 'stranger', 'tavern', 'gate', 'archiver'],
      pairs: undefined,
    },
    'DS-DEF-2 :: Invasion & War: walls with NO force #2': {
      sources: [null, 'elders', 'watch', 'court', 'public'],
      pairs: undefined,
    },
    // ⭐ THE DRAFT GATE'S THREE POOLS. Five faces on every variant of the two Invasion and
    // Disasters pools; ten, seven and seven on Internal Security, whose card seats the widest
    // roster of the block. Two pairs on each Invasion variant pattern, two on Disasters, and
    // two on Internal Security variant 1 (a `view` and a `reinforce`). No `archiver`, no
    // `public` and no `observed` mark anywhere in the three: those forms stay where car
    // 8b-W-18n first seated them, which is why the `observed` arm below is UNCHANGED.
    'DS-DEF-2 :: Invasion & War: force with NO walls #0': {
      sources: [null, 'hall', 'guild', 'watch', 'tavern', 'elders'],
      pairs: [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null],
    },
    'DS-DEF-2 :: Invasion & War: force with NO walls #1': {
      sources: [null, 'watch', 'stranger', 'hall', 'tavern', 'garrison'],
      pairs: [null, null, null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null],
    },
    'DS-DEF-2 :: Invasion & War: force with NO walls #2': {
      sources: [null, 'garrison', 'gate', 'hall', 'market', 'register'],
      pairs: undefined,
    },
    'DS-DEF-2 :: Internal Security: no legal infrastructure #0': {
      sources: [null, 'stranger', 'tavern', 'register', 'elders', 'gate', 'muster', 'watch', 'market', 'guild', 'garrison'],
      pairs: [null, { id: 1, kind: 'view' }, null, null, { id: 1, kind: 'view' },
        { id: 2, kind: 'reinforce' }, null, { id: 2, kind: 'reinforce' }, null, null, null],
    },
    'DS-DEF-2 :: Internal Security: no legal infrastructure #1': {
      sources: [null, 'stranger', 'garrison', 'tavern', 'elders', 'muster', 'gate', 'register'],
      pairs: undefined,
    },
    'DS-DEF-2 :: Internal Security: no legal infrastructure #2': {
      sources: [null, 'stranger', 'tavern', 'elders', 'register', 'gate', 'watch', 'guild'],
      pairs: undefined,
    },
    'DS-DEF-2 :: Disasters & Famine: NO reserves, NO medical provision #0': {
      sources: [null, 'elders', 'stranger', 'market', 'register', 'tavern'],
      pairs: [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null],
    },
    'DS-DEF-2 :: Disasters & Famine: NO reserves, NO medical provision #1': {
      sources: [null, 'elders', 'tavern', 'stranger', 'market', 'register'],
      pairs: [null, { id: 2, kind: 'disagree' }, { id: 2, kind: 'disagree' }, null, null, null],
    },
    'DS-DEF-2 :: Disasters & Famine: NO reserves, NO medical provision #2': {
      sources: [null, 'stranger', 'tavern', 'elders', 'register', 'market'],
      pairs: undefined,
    },
  });

  it('⭐ exactly ONE pool ships `sources`/`pairs` — DS-DEF-2, named face by face; every other block is still the zero-shift ground of car 8b-W-18c', () => {
    const rows = allStateBlocks.flatMap(([id, b]) => Object.entries(b.pools)
      .flatMap(([pool, variants]) => variants.map((v, at) => ({ key: `${id} :: ${pool} #${at}`, id, v }))))
      .filter(({ v }) => v.sources !== undefined || v.pairs !== undefined);
    // The roster, exactly: no more variants carry a face than these, and no fewer.
    expect(rows.map((r) => r.key).sort()).toEqual(Object.keys(SOURCED_TODAY).sort());
    for (const row of rows) {
      expect(row.v.sources, `${row.key} sources`).toEqual(SOURCED_TODAY[row.key].sources);
      expect(row.v.pairs, `${row.key} pairs`).toEqual(SOURCED_TODAY[row.key].pairs);
    }
    // THE ZERO-SHIFT ARM THAT SURVIVES: every block but DS-DEF-2 carries nothing at all.
    const elsewhere = allStateBlocks.filter(([id]) => id !== 'DS-DEF-2')
      .flatMap(([id, b]) => Object.entries(b.pools)
        .flatMap(([pool, variants]) => variants.map((v, at) => ({ id, pool, at, v }))))
      .filter(({ v }) => v.sources !== undefined || v.pairs !== undefined)
      .map(({ id, pool, at }) => `${id} :: ${pool} #${at}`);
    expect(elsewhere).toEqual([]);
    // And the counts the shift register's `face-count-per-variant` row now pins: 65 sourced
    // faces over 12 variants of FOUR pools, and SEVEN pairs, each carried by exactly two faces
    // (14 paired halves). Re-pinned at the 8b DS-DEF-2 draft gate from [3, 11, 2].
    const sourced = rows.reduce((n, r) => n + (r.v.sources || []).filter((x) => x !== null).length, 0);
    const paired = rows.reduce((n, r) => n + (r.v.pairs || []).filter((x) => x !== null).length, 0);
    expect([rows.length, sourced, paired]).toEqual([12, 65, 14]);
    // ⭐ AND THE OBSERVED LIST IS EMITTED ON EXACTLY ONE VARIANT, which is the mark's own
    // zero-shift ground: a variant with no observed face carries no `observed` key at all.
    const observed = allStateBlocks.flatMap(([id, b]) => Object.entries(b.pools)
      .flatMap(([pool, variants]) => variants.map((v, at) => ({ key: `${id} :: ${pool} #${at}`, v }))))
      .filter(({ v }) => v.observed !== undefined);
    expect(observed.map((r) => r.key))
      .toEqual(['DS-DEF-2 :: Invasion & War: walls with NO force #1']);
    expect(observed[0].v.observed).toEqual([false, false, false, false, true]);
  });

  it('PLANT: a RENUMBERING that would move an existing vid, and a count above its pin', () => {
    const two = [{ index: 1 }, { index: 2 }];
    expect(vidsOf('x', two, [1, 2], 2)).toEqual([1, 2]);
    expect(() => vidsOf('x', [{ index: 1 }, { index: 3 }], [1, 2], undefined))
      .toThrow(/would move variant 1's vid from 2 to 3/);
    expect(() => vidsOf('x', [{ index: 1 }], [1, 2], undefined)).toThrow(/NEVER TRIM/);
    expect(() => vidsOf('x', [{ index: 1 }, { index: 2 }, { index: 3 }], undefined, 2))
      .toThrow(/against a pin of 2/);
    expect(() => vidsOf('x', [{ index: 2 }, { index: 1 }], undefined, undefined)).toThrow(/runs backwards/);
    expect(() => vidsOf('x', [{ index: 1 }, { index: 1 }], undefined, undefined)).toThrow(/two variants carry row number/);
  });
});

describe('SEAM car 4 — §7b, the connectives section, and its own refusals', () => {
  const section = (rows) => `## §7b THE STATE CONNECTIVES\n\n| relation | seat | floor | pin | joints |\n|---|---|---|---|---|\n${rows.join('\n')}\n`;
  const FOUR = [
    '| `consequence` | `clause` | 3 | 0 | *(OWED)* |',
    '| `tension` | `sentence` | 3 | 0 | *(OWED)* |',
    '| `contrast` | `sentence` | 1 | 1 | `EMPTY-OPENER` |',
    '| `addition` | `sentence` | 1 | 1 | `EMPTY-OPENER` |',
  ];

  it('reads the shipped section into the shipped leaf, byte for byte', () => {
    const parsed = parseConnectives(readFileSync(STATE_DOC, 'utf8'));
    expect(parsed.lists).toEqual(DOSSIER_CONNECTIVES);
    // ⭐ NO LIST IS OWED SINCE REWRITE car 8a-9: all four stand at their floor of three. `owed`
    // is `joints.length < floor`, so an empty list here would mean a floor drafted and then
    // lost, which is the one direction S12 refuses.
    expect(parsed.pins.filter((p) => p.owed).map((p) => `${p.relation}.${p.seat}`).sort())
      .toEqual([]);
    expect(parsed.pins.map((p) => p.floor), 'and every floor is still three').toEqual([3, 3, 3, 3]);
    expect(parsed.pins.map((p) => p.pin), 'each pin measures its own list').toEqual([3, 3, 3, 3]);
  });

  it('CLEAN CONTROL plus PLANTS: a fifth relation, an unreachable seat, and a missing pair', () => {
    expect(() => parseConnectives(section(FOUR))).not.toThrow();
    expect(() => parseConnectives(section([...FOUR, '| `cause` | `clause` | 1 | 1 | `, so` |'])))
      .toThrow(/relation `cause` is outside the four/);
    expect(() => parseConnectives(section([...FOUR.slice(1), '| `consequence` | `sentence` | 3 | 0 | *(OWED)* |'])))
      .toThrow(/is not one of the FOUR REACHABLE pairs/);
    expect(() => parseConnectives(section(FOUR.slice(1)))).toThrow(/a fifth pair is a projector error/);
    expect(() => parseConnectives('no section here')).toThrow(/the section is missing/);
  });

  it('PLANT: a joint carrying an em dash, a `which`, a digit or a percent (T-F14)', () => {
    const withJoint = (joint) => section([
      FOUR[0], FOUR[1], FOUR[2],
      `| \`addition\` | \`sentence\` | 1 | 1 | \`${joint}\` |`,
    ]);
    expect(() => parseConnectives(withJoint(', and'))).not.toThrow();
    expect(() => parseConnectives(withJoint(', — and'))).toThrow(/carries an em dash/);
    expect(() => parseConnectives(withJoint(', which'))).toThrow(/carries a `which` tail/);
    expect(() => parseConnectives(withJoint(', by 3'))).toThrow(/carries a digit or a percent/);
    expect(() => parseConnectives(withJoint(', by 5%'))).toThrow(/carries a digit or a percent/);
  });

  it('⭐ PLANT: a LONGER connective list than its pin — the modulus of every joint drawn on it', () => {
    const longer = section([
      FOUR[0], FOUR[1], FOUR[2],
      '| `addition` | `sentence` | 1 | 1 | `EMPTY-OPENER` · `, and` |',
    ]);
    expect(() => parseConnectives(longer)).toThrow(/carries 2 joints against its pin of 1/);
    // And a pin RAISED without the joints to match is refused too, so the pin cannot be moved
    // ahead of the list to make room quietly.
    const emptyPin = section([
      FOUR[0], FOUR[1], FOUR[2],
      '| `addition` | `sentence` | 1 | 2 | `EMPTY-OPENER` |',
    ]);
    expect(() => parseConnectives(emptyPin)).toThrow(/carries 1 joints and pins 2/);
  });
});

describe('SEAM car 4 — the 68 STATE-KEY lines, transcribed against the branch grain', () => {
  it('⭐ transcribes each block\'s STATE-KEY into the census\'s `reads`, and PRINTS every disagreement', () => {
    // ARCH §12 row 4's last item. Each of the 68 blocks opens with a `**STATE-KEY.**` paragraph
    // naming, in prose, what keys the block; its `###` header names the block's FIELDS. The
    // census's `reads` is the SELECTING BRANCH's field set, recovered from the key function by
    // execution (SITTING §O.1). Where the two AGREE the transcription is a no-op — the census
    // already carries it — and where they DISAGREE the lane PRINTS it and resolves nothing: the
    // census measures the CODE and the STATE-KEY line is an author's account of it, and a lane
    // that "reconciled" them would be editing a measurement to match prose.
    //
    // ⛔ AND NOTHING IS WRITTEN. Transcribing a token the census does not carry would move a
    // census ROW, which is the chair's register door, so the only lawful landing for a
    // disagreement is this printed roster.
    //
    // ⛔ THE TOKEN SET IS ANCHORED ON THE BLOCK HEADER, and that is not a convenience. A
    // STATE-KEY paragraph backticks its ENUM VALUES too (`road` · `river` · `stocked` · `thin`),
    // and counting those as fields manufactures 396 disagreements no author ever made. The
    // header is where the block declares its own field expression, so a token is FIELD-SHAPED
    // here only when the header names it.
    const annex = readFileSync(STATE_DOC, 'utf8').split('\n');
    const FIELD_RE = /[a-zA-Z_][A-Za-z0-9_]*(?:\.[a-zA-Z_][A-Za-z0-9_]*)*/g;
    /** blockId -> {header, stateKey} */
    const blocks = new Map();
    let at = null;
    let buffer = null;
    for (const raw of annex) {
      const header = raw.match(/^###\s+(DS-[A-Z]+-\d+)\b/);
      if (header) {
        at = /FOLDED INTO/i.test(raw) ? null : header[1];
        if (at) blocks.set(at, { header: raw, stateKey: '' });
        buffer = null;
        continue;
      }
      if (!at) continue;
      if (/^\*\*STATE-KEY[:.]\*\*/.test(raw)) { buffer = [raw]; continue; }
      if (buffer && raw.trim() === '') { blocks.get(at).stateKey = buffer.join(' '); buffer = null; continue; }
      if (buffer) buffer.push(raw);
    }
    expect(blocks.size, 'the block reader found the wrong number of headers').toBe(68);
    expect([...blocks.values()].filter((b) => b.stateKey).length,
      'a block lost its STATE-KEY paragraph, or the reader has rotted').toBe(68);

    /** The census's branch-grain reads per block, with every last segment beside them. */
    const readsByBlock = new Map();
    for (const row of CENSUS.rows) {
      const seat = readsByBlock.get(row.block) || new Set();
      for (const path of row.reads) { seat.add(path); seat.add(path.split('.').pop()); }
      readsByBlock.set(row.block, seat);
    }

    const agreeing = [];
    const darkBlock = [];
    const readsOther = [];
    let blocksNamingAField = 0;
    for (const [block, { header, stateKey }] of blocks) {
      const declared = new Set(header.match(FIELD_RE) || []);
      const tokens = [...new Set([...stateKey.matchAll(/`([^`]+)`/g)].map((m) => m[1]))]
        .filter((t) => declared.has(t) || declared.has(t.split('.').pop()));
      if (tokens.length) blocksNamingAField += 1;
      const reads = readsByBlock.get(block) || new Set();
      for (const token of tokens) {
        const hit = reads.has(token) || reads.has(token.split('.').pop())
          || [...reads].some((r) => r.endsWith(`.${token}`) || token.endsWith(`.${r}`));
        if (hit) agreeing.push(`${block} :: ${token}`);
        else if (reads.size === 0) darkBlock.push(`${block} :: ${token}`);
        else readsOther.push(`${block} :: ${token}`);
      }
    }
    const total = agreeing.length + darkBlock.length + readsOther.length;
    process.stdout.write(`\n[state-key] 68 STATE-KEY paragraphs read · ${blocksNamingAField} name a`
      + ` field their own header declares · ${total} tokens · ${agreeing.length} AGREE with the`
      + ` branch grain and are transcribed · ${darkBlock.length} name a field in a block the`
      + ` census recovered NOTHING for · ${readsOther.length} name a field the census does not`
      + ` read on a block it did resolve. Nothing is written: a transcription the census does`
      + ` not carry would move a census row.\n`);
    for (const row of darkBlock) process.stdout.write(`  DARK-BLOCK  ${row}\n`);
    for (const row of readsOther) process.stdout.write(`  READS-OTHER ${row}\n`);

    // MEASURED at this tip and RECORDED, not asserted to zero: 16 / 23 / 71 of 110 tokens over
    // 46 blocks. These are the WIRING debt seen from the AUTHOR's side, which is a reading car 9
    // wants and not a defect of this car. The floors are what stop the reader going dark — a
    // token roster that fell to nothing would print an empty disagreement list and read as
    // agreement, which is the vacuous green this whole family exists to refuse.
    expect(blocksNamingAField).toBeGreaterThanOrEqual(46);
    expect(total).toBeGreaterThanOrEqual(110);
    expect(agreeing.length).toBeGreaterThanOrEqual(16);
    expect(darkBlock.length + readsOther.length).toBe(total - agreeing.length);
  });
});

// ── SEAM CAR 4d — THE SEAT LICENCE, RESOLVED AT PROJECTION ───────────────────────────────
// The composer used to ask the relation table itself, keyed on `spineMeta.reads[0]` — a field
// `PoolMeta` has never carried, because the authoring half lives in the wiring census and
// never ships (ARCH §16). The licence is now resolved HERE, where the census, the 165 relation
// rows and the three ratified aliases are all visible, and frozen onto the pool as a `seat`.

/** The alias lookup the resolver joins through, read off the committed leaf. */
const ALIAS_OF = new Map(DOSSIER_RELATION_ALIASES.map((r) => [r.endpoint, r.readRoot]));
/** A resolver input for one shipped pool, from the two committed files. */
function shippedSeatInput(row) {
  return {
    role: (row.meta || {}).role,
    relation: (row.meta || {}).relation,
    attach: (row.meta || {}).attach,
    reads: (CENSUS_BY_POOL.get(`${row.id} :: ${row.pool}`) || {}).reads,
    censusOf: (key) => CENSUS_BY_POOL.get(`${row.id} :: ${key}`) || null,
    relationRows: CENSUS.relations.rows,
    aliasOf: ALIAS_OF,
  };
}

/** The synthetic pair the fixture arms drive: one census row each side, one relation row. */
const FIXTURE_ROWS = Object.freeze([Object.freeze({
  a: 'condition:blight', b: 'system:food_security', relation: 'consequence',
  source: 'a', direction: 'a->b',
})]);
const FIXTURE_CENSUS = Object.freeze({
  'walls: standing': { reads: ['condition:blight'] },
  'muster: short': { reads: ['eco.foodSecurity.stockpile'] },
  'purse: short': { reads: ['court'] },
});
/** @param {object} over */
function seatInput(over = {}) {
  return {
    role: 'modifier',
    relation: 'consequence',
    attach: ['walls: standing'],
    reads: ['eco.foodSecurity.stockpile'],
    censusOf: (key) => FIXTURE_CENSUS[key] || null,
    relationRows: FIXTURE_ROWS,
    aliasOf: new Map([['system:food_security', 'eco']]),
    s2: true,
    ...over,
  };
}

describe('SEAM car 4d — the seat licence, computed where the census is visible', () => {
  it('⭐⭐ EVERY SHIPPED POOL SEATS AT THE SENTENCE, WITH ITS REASON, over all 708', () => {
    const tally = {};
    const modifiers = [];
    const carrying = [];
    for (const row of META_ROWS) {
      const licence = seatOf(shippedSeatInput(row));
      tally[`${licence.seat}/${licence.reason}`] = (tally[`${licence.seat}/${licence.reason}`] || 0) + 1;
      if ((row.meta || {}).role === 'modifier') modifiers.push(`${row.id} :: ${row.pool}`);
      if ((row.meta || {}).seat !== undefined) carrying.push(`${row.id} :: ${row.pool}`);
    }
    // The tally the projector prints, re-derived from the two committed files rather than
    // trusted: 708 pools, every one a sentence, and the reason is that none is a modifier yet.
    expect(tally).toEqual({ 'sentence/not-a-modifier': 708 });
    expect(META_ROWS).toHaveLength(708);
    // ⛔ NO SHIPPED POOL IS A MODIFIER, which is why no clause can seat and why the `seat` key
    // is emitted nowhere: an ABSENT seat reads in the composer as the sentence.
    expect(modifiers, 'no shipped pool declares role modifier').toEqual([]);
    expect(carrying, 'so no shipped pool carries a seat key').toEqual([]);
  });

  it('⭐ THE FIXTURE: a census row, a relation row and one ratified alias seat the CLAUSE', () => {
    const licence = seatOf(seatInput());
    expect(licence.seat).toBe('clause');
    expect(licence.reason).toBe('row');
    expect(licence.rows, 'and it names the row that licensed it')
      .toEqual(['a:condition:blight|system:food_security']);
    // AND THE EMITTED FRAGMENT is the two keys the projector spreads, and nothing else.
    expect(seatMeta(seatInput())).toEqual({
      seat: 'clause', seatRow: ['a:condition:blight|system:food_security'],
    });
  });

  it('⛔ THE SAME PAIR WITH THE ALIAS REMOVED IS `no-row` — the join is what licenses it', () => {
    const bare = seatOf(seatInput({ aliasOf: new Map() }));
    expect({ seat: bare.seat, reason: bare.reason }).toEqual({ seat: 'sentence', reason: 'no-row' });
    expect(seatMeta(seatInput({ aliasOf: new Map() })))
      .toEqual({ seat: 'sentence', seatReason: 'no-row' });
    // And an alias to the WRONG root does not license it either: the alias must name the read
    // root the endpoint is the same fact as, not merely exist.
    const wrong = seatOf(seatInput({ aliasOf: new Map([['system:food_security', 'war']]) }));
    expect(wrong.reason).toBe('no-row');
  });

  it('⛔ THE `every`-GRAIN: one unlicensed spine in the attach set closes the clause', () => {
    // `assertPoolDeclaration` asks the AUTHORING question — can this modifier seat anywhere —
    // and one licensed spine satisfies it. A FROZEN seat is read against whatever spine drew,
    // so it may say `clause` only when every pair the attach set names carries a row.
    const mixed = seatOf(seatInput({ attach: ['walls: standing', 'purse: short'] }));
    expect({ seat: mixed.seat, reason: mixed.reason })
      .toEqual({ seat: 'sentence', reason: 'no-row' });
    // The control: both spines licensed, and the pool takes the clause on one row id.
    const both = seatOf(seatInput({
      attach: ['walls: standing', 'purse: short'],
      relationRows: [...FIXTURE_ROWS,
        { a: 'court', b: 'system:food_security', relation: 'consequence', source: 'c', direction: 'a->b' }],
    }));
    expect(both.seat).toBe('clause');
    expect(both.rows).toEqual([
      'a:condition:blight|system:food_security', 'c:court|system:food_security',
    ]);
  });

  it('the DIRECTION is read off the row, in both spellings of the pair', () => {
    const mirrored = seatOf(seatInput({
      relationRows: [{
        a: 'system:food_security', b: 'condition:blight', relation: 'consequence',
        source: 'a', direction: 'b->a',
      }],
    }));
    expect(mirrored.seat, 'the pair keyed the other way with direction b to a is the same edge')
      .toBe('clause');
    const backward = seatOf(seatInput({
      relationRows: [{ ...FIXTURE_ROWS[0], direction: 'b->a' }],
    }));
    expect(backward.reason, 'a row running modifier to spine is a CAUSE and licenses nothing')
      .toBe('no-row');
    const wrongRelation = seatOf(seatInput({
      relationRows: [{ ...FIXTURE_ROWS[0], relation: 'tension' }],
    }));
    expect(wrongRelation.reason, 'and a `tension` row does not license a `consequence` clause')
      .toBe('no-row');
  });

  it('the reason vocabulary is CLOSED, and every branch of it is driven', () => {
    const reason = (over) => seatOf(seatInput(over)).reason;
    expect(reason({ role: 'spine' })).toBe('not-a-modifier');
    expect(reason({ role: 'turn' })).toBe('not-a-modifier');
    expect(reason({ relation: 'addition' })).toBe('not-consequence');
    expect(reason({ relation: undefined })).toBe('not-consequence');
    expect(reason({ reads: [] })).toBe('no-field');
    expect(reason({ attach: [] })).toBe('no-pair');
    expect(reason({ attach: null })).toBe('no-pair');
    expect(reason({ attach: ['nobody'] })).toBe('no-primary');
    expect(reason({ relationRows: [] })).toBe('no-row');
    expect(reason({})).toBe('row');
    // ⛔ S2 IS ASKED LAST, so a pool with no row reads `no-row` whatever the signature says.
    const unsigned = seatOf(seatInput({ s2: false }));
    expect({ seat: unsigned.seat, reason: unsigned.reason })
      .toEqual({ seat: 'sentence', reason: 's2-unsigned' });
    expect(unsigned.rows, 'and it still names what licensed it, so the row is not lost')
      .toEqual(['a:condition:blight|system:food_security']);
    expect(seatOf(seatInput({ s2: false, relationRows: [] })).reason).toBe('no-row');
    // The default is the module's own flag, which is where the owner's signature lands.
    expect(seatOf({ ...seatInput(), s2: undefined }).reason)
      .toBe(S2_SIGNED ? 'row' : 's2-unsigned');
  });

  it('a SPINE takes no `seat` key at all — absent is the sentence, not zero', () => {
    expect(seatMeta(seatInput({ role: 'spine' }))).toEqual({});
    expect(seatMeta(seatInput({ role: 'turn' }))).toEqual({});
    expect(seatMeta(seatInput({ relation: 'tension' })))
      .toEqual({ seat: 'sentence', seatReason: 'not-consequence' });
  });

  it('an endpoint reads a path when it IS the read root or a dotted descendant of it', () => {
    const aliases = new Map([['economicGates.military', 'settlement.defenseProfile']]);
    expect(endpointReads('economicGates.military', 'settlement.defenseProfile', aliases)).toBe(true);
    expect(endpointReads('economicGates.military', 'settlement.defenseProfile.walls', aliases)).toBe(true);
    expect(endpointReads('economicGates.military', 'settlement.defenseProfileX', aliases),
      'and a shared prefix that is not a dotted segment is NOT the same fact').toBe(false);
    expect(endpointReads('economicGates.military', 'settlement', aliases),
      'nor is the parent of the root').toBe(false);
    expect(endpointReads('court', 'court.seat', new Map()),
      'an endpoint with no alias may already be a read path').toBe(true);
    expect(endpointReads('', 'court', new Map())).toBe(false);
    expect(endpointReads('court', '', new Map())).toBe(false);
  });

  it('the SHIFT REGISTER names `seat` a NON-mechanism, and says what promotes it', () => {
    const row = SHIFT_REGISTER.notMechanisms.find((n) => n.id === 'seat');
    expect(row, '`seat` must be named on the register').toBeTruthy();
    expect(row.why, 'with the measurement that makes it one today').toMatch(/708/);
    expect(row.why).toMatch(/not a modulus/i);
    // ⛔ AND THE PROMOTION CONDITION IS WRITTEN DOWN, so the day it moves nobody has to
    // re-derive whether it was ever a mechanism.
    expect(row.why).toMatch(/SHIFT-CLASS/);
    expect(row.why).toMatch(/0 of 165/);
    // ⛔ AND THE PROMOTION TRIGGER IS NOW EXECUTABLE, not only written (SEAM car 5c, cure 4).
    // The argument above is sound and the skeptic could not refute it; what was missing is
    // that nothing RED if a later car started emitting `seat` on a spine, because the
    // recompute loop walked `mechanisms` only. The pin is recomputed by that same loop.
    expect(row.pin, '`seat` must carry a recomputable pin').toEqual([
      { kind: 'integer', over: 'pools carrying a seat key', value: 0 },
    ]);
    expect(META_ROWS.filter((r) => r.meta.seat !== undefined).length,
      'and the corpus must agree with it').toBe(0);
    // The two register halves agree: it is named NOT a mechanism and it is not a mechanism.
    // ANCHORED on `attach-set`, the mechanism row that governs the OTHER half of how a
    // modifier reaches a spine, so an empty mechanism roster cannot pass as an exclusion.
    expectAbsentWithAnchor(
      SHIFT_REGISTER.mechanisms.map((m) => m.id), 'seat', 'attach-set',
      'the shift register\'s mechanism roster',
    );
  });

  it('⛔ ON THE COMMITTED FILES THE JOIN IS STILL ZERO — car 0 F1, re-derived here', () => {
    // Every one of the 165 rows, asked in READ space through the three ratified aliases: none
    // has BOTH endpoints landing on a path a desk reads. This is the measurement that makes
    // "no clause can seat today" a number rather than a sentence in a header.
    const readPaths = [...new Set(CENSUS.rows.flatMap((r) => r.reads || []))];
    const lands = (endpoint) => readPaths.some((p) => endpointReads(endpoint, p, ALIAS_OF));
    const joining = CENSUS.relations.rows.filter((r) => lands(r.a) && lands(r.b));
    const oneSide = CENSUS.relations.rows.filter((r) => lands(r.a) !== lands(r.b));
    expect(CENSUS.relations.rows).toHaveLength(165);
    expect(joining, 'no row joins on both endpoints').toEqual([]);
    // THE NON-VACUITY CONTROL: the walk is not simply blind — rows DO land on one side.
    expect(oneSide.length, 'rows landing on exactly one endpoint').toBeGreaterThan(0);
    expect(readPaths.length, 'and the read roster is the census\'s own').toBeGreaterThanOrEqual(157);
  });
});

describe('⭐⭐ REWRITE car 8a-4 — `kin`, the thread rule\'s typed half (SITTING §T.4, agenda C″)', () => {
  // THE ESTATE'S OWN STOP LIST, not a second one: the same function the composed walker and
  // `passageShapes.js` read, which is the whole reason the resolution happens at PROJECTION
  // (ARCH §4.1 refuses a `src/domain/prose/` import in the composer).
  const kin = (pools, attach, variants) => kinSpines({
    pools, attach, variants, contentWordsOf: contentWords,
  });
  const v = (...faces) => ({ text: faces[0], wordings: faces.slice(1) });

  it('a spine every face threads with is KIN, and the answer names it', () => {
    const pools = { 'wall: kept': [v('The wall is kept out of the purse.')] };
    expect(kin(pools, ['wall: kept'], [v('The purse was emptied by the muster.')]))
      .toEqual(['wall: kept']);
  });

  it('⛔ ONE FACE THAT SHARES NOTHING BREAKS THE KINSHIP — the answer cannot depend on a draw', () => {
    // The load-bearing plant. `kin` is read by the comparator BEFORE the face draw, so a
    // kinship that held on some faces and not others would make the ORDER of composition a
    // function of which face the seeded face-draw happened to take: two towns on the same
    // seed would seat different modifiers for a reason no instrument prints. Face 2 of the
    // modifier shares nothing, and that is enough.
    const pools = { 'wall: kept': [v('The wall is kept out of the purse.')] };
    const threaded = [v('The purse was emptied by the muster.')];
    const partly = [v('The purse was emptied by the muster.', 'Coin went elsewhere entirely.')];
    expect(kin(pools, ['wall: kept'], threaded), 'the control threads').toEqual(['wall: kept']);
    expect(kin(pools, ['wall: kept'], partly), 'and one silent face withdraws it').toEqual([]);
  });

  it('⛔ A SHARED STOP WORD IS NOT A THREAD — `town` and `settlement` are the dossier\'s subject', () => {
    const pools = { 'wall: kept': [v('The town keeps its wall.')] };
    expect(kin(pools, ['wall: kept'], [v('The town has a market.')]),
      'two sentences about the town share nothing a reader would call a thread').toEqual([]);
    // THE PAIRED POSITIVE, over the same pair: add one real noun and the thread appears.
    expect(kin(pools, ['wall: kept'], [v('The town has a market beside the wall.')]))
      .toEqual(['wall: kept']);
  });

  it('⛔ AN EMPTY SIDE IS NEVER VACUOUSLY KIN, on either side of the pair', () => {
    // `every` over an empty list is TRUE, so both emptiness cases have to be answered
    // outright or a pool with no variants would thread with everything.
    expect(kin({ 'wall: kept': [] }, ['wall: kept'], [v('The purse is thin.')]),
      'a spine pool with no variant threads with nothing').toEqual([]);
    expect(kin({ 'wall: kept': [v('The purse is thin.')] }, ['wall: kept'], []),
      'and a modifier with no variant threads with nothing').toEqual([]);
    expect(kin({}, ['no such spine'], [v('The purse is thin.')]),
      'and an attach naming a pool the block does not carry is not kin').toEqual([]);
  });

  it('the answer is the THREADING SUBSET of `attach`, sorted', () => {
    const pools = {
      'wall: kept': [v('The wall is kept out of the purse.')],
      'harvest: short': [v('The harvest came in light.')],
      'muster: thin': [v('The muster is thin at the purse.')],
    };
    expect(kin(pools, ['muster: thin', 'harvest: short', 'wall: kept'],
      [v('The purse was emptied twice over.')]))
      .toEqual(['muster: thin', 'wall: kept']);
  });

  it('⛔ AND IT SHIPS ON NOTHING, which is why this car moves no generated byte', () => {
    // Only a MODIFIER has an attach set and every one of the 708 shipped pools is a spine, so
    // the projector's `kin.length ? { kin } : {}` never fires. Asserted over the leaves rather
    // than reasoned, and pinned a second time on the SHIFT REGISTER's comparator row.
    expect(META_ROWS.filter((r) => r.meta.kin !== undefined).map((r) => `${r.id} :: ${r.pool}`))
      .toEqual([]);
    expect(META_ROWS.length, 'over the whole shipped corpus, not a slice').toBe(708);
  });
});

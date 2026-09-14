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
import { readdirSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  parseSlotShapes, mergeSlotShapes, assertSlotShapesTotal,
  fillShapeViolation, conformantFill, determinerFill,
} from '../../scripts/lib/dossier-slot-shapes.mjs';
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

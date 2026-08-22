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
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_CAUSAL_PROSE } from '../../src/data/dossierCausalProse.generated.js';

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
    expect(stateVariants).toBeGreaterThanOrEqual(2269);
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

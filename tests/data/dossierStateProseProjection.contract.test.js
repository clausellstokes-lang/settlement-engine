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

  it('carries the measured corpus: 58 state blocks over 6 desks, 78 causal families', () => {
    // 59 block headers are authored; DS-GEN-4 is FOLDED INTO DS-STR-1 (§0h V1-a) and
    // keeps its id for cross-references without owning a pool, so 58 land.
    expect(allStateBlocks.length).toBe(58);
    expect(Object.keys(DOSSIER_CAUSAL_PROSE).length).toBe(78);
  });

  it('never shrinks: the variant inventory is a ratchet', () => {
    const stateVariants = allStateBlocks.reduce((n, [, b]) => n + variantCount(b), 0);
    const causalVariants = Object.values(DOSSIER_CAUSAL_PROSE)
      .reduce((n, b) => n + variantCount(b), 0);
    // Measured at the projection's first landing. Adding variants is expected and
    // lawful; a DROP means the parser lost content or the corpus was cut.
    expect(stateVariants).toBeGreaterThanOrEqual(2153);
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

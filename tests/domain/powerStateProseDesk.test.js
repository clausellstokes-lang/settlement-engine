/**
 * powerStateProseDesk.test.js — DESK CAR 2: the power desk, and an ALIVENESS suite.
 *
 * WHAT THIS FILE IS FOR, AND WHY IT IS SHAPED THE WAY IT IS.
 *
 * A dark world and a lit-but-incapable world are BYTE-IDENTICAL to every test that checks
 * shape, arm, identity or determinism. A feature shipped this week with two arms that
 * could not fire in any possible world, and every dormancy fence and coupling row over it
 * was green. So the central arms below are not "the desk returns the right key" — they are
 * "SWITCH THE BLOCK ON AND A SENTENCE COMES OUT", pool by pool, over states the real
 * generator can build.
 *
 * The three things that would make this suite vacuous, and the controls that refuse them:
 *   • A POOL KEY THE CORPUS DOES NOT CARRY. Every key the desk can emit is asserted to
 *     exist in the shipped leaf, and the band keys are additionally proved EQUAL to the
 *     producer's own label vocabulary rather than to a transcription of it.
 *   • A POOL NO STATE CAN REACH. All eleven pools are driven, and the count is asserted
 *     against the leaf so a twelfth pool cannot arrive untested.
 *   • A SENTENCE THAT IS THE SAME SENTENCE EVERYWHERE. The differential arm renders two
 *     states through one seed and requires the lines to differ.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  SLOT_FILL_SHAPES,
  SLOT_FILL_TABLES,
  legitimacyBandPoolKey,
  legitimacyLensPoolKey,
  powerStateProse,
} from '../../src/domain/display/stateProse/powerStateProse.js';
import { legitimacyBandFor } from '../../src/generators/factionDynamics.js';
import {
  parseSlotShapes, mergeSlotShapes, fillShapeViolation,
} from '../../scripts/lib/dossier-slot-shapes.mjs';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import {
  DOSSIER_MOUNTS, UNMOUNTED_BLOCKS, drawnAtMount, sentenceMountForBlock,
} from '../../src/domain/display/stateProse/dossierMounts.js';

const BLOCK = 'DS-POW-1';
const POOLS = DOSSIER_STATE_PROSE_POWER[BLOCK].pools;

const DOCS = resolve(import.meta.dirname, '../../docs/content');
const SHAPES = mergeSlotShapes([
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_DOSSIER_STATE.md'), 'utf8'), 'STATE'),
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_CAUSAL_DOSSIER.md'), 'utf8'), 'CAUSAL'),
]);

/** A settlement carrying exactly the fields this desk reads. */
function town(publicLegitimacy, { name = 'Thornwall', governingName = 'Ashford Company' } = {}) {
  return { name, _seed: 'seed-alpha', powerStructure: { publicLegitimacy, governingName } };
}

/** A legitimacy record with a neutral breakdown, so the lens is controlled per test. */
function legit(label, breakdown = {}, governanceFractured = false) {
  return {
    score: 50,
    label,
    breakdown: { prosperity: 0, safety: 0, defense: 0, food: 0, ...breakdown },
    governanceFractured,
  };
}

const BAND_LABELS = ['Endorsed', 'Approved', 'Tolerated', 'Contested', 'Legitimacy Crisis'];

describe('the power desk — the keys are the producer\'s, not a transcription', () => {
  it('every label legitimacyBandFor can emit is a DS-POW-1 pool key, and covers the ladder', () => {
    // DERIVED FROM THE PRODUCER. The band function is a total function of the score, so
    // walking 0..100 emits every label it can ever emit. A hand-copied list would be a
    // second spelling of the vocabulary and would agree with itself while both drifted.
    const emitted = new Set();
    for (let score = 0; score <= 100; score += 1) emitted.add(legitimacyBandFor(score).label);
    expect([...emitted].sort()).toEqual([...BAND_LABELS].sort());
    for (const label of emitted) {
      expect(POOLS[label], `the producer emits ${label} and the corpus has no such pool`).toBeTruthy();
      expect(legitimacyBandPoolKey(label)).toBe(label);
    }
  });

  it('an unrecognised label renders nothing rather than falling into a band', () => {
    expect(legitimacyBandPoolKey('Beloved')).toBeNull();
    expect(legitimacyBandPoolKey('')).toBeNull();
    expect(legitimacyBandPoolKey(undefined)).toBeNull();
    // And the whole desk goes silent with it, rather than drawing a neighbouring band.
    expect(powerStateProse(town(legit('Beloved'))).legitimacyBanner).toBeNull();
  });

  it('the declared slot shapes equal the annex register for every slot this desk fills', () => {
    for (const [slot, shape] of Object.entries(SLOT_FILL_SHAPES)) {
      expect(SHAPES.shapeOf(slot), `slot {${slot}}`).toBe(shape);
    }
    // The desk owns no literal fill table, and says so rather than omitting the field.
    expect(SLOT_FILL_TABLES).toEqual({});
  });
});

describe('the power desk — ALIVENESS: every pool fires over a state the generator builds', () => {
  // The eleven pools, each with the state that reaches it. THE POINT OF THIS TABLE is that
  // a pool absent from it is caught by the count arm below, so a pool cannot be mounted and
  // left unreachable in silence.
  const CASES = [
    ...BAND_LABELS.map((label) => [label, legit(label)]),
    ['governanceFractured true', legit('Legitimacy Crisis', {}, true)],
    ['breakdown dominated by PROSPERITY, favourable', legit('Endorsed', { prosperity: 20 })],
    ['breakdown dominated by PROSPERITY, adverse', legit('Contested', { prosperity: -20 })],
    ['breakdown dominated by SAFETY, adverse', legit('Contested', { safety: -20 })],
    ['breakdown dominated by DEFENSE, adverse', legit('Tolerated', { defense: -10 })],
    ['breakdown dominated by FOOD, adverse', legit('Tolerated', { food: -10 })],
  ];

  it('drives all eleven of the block\'s pools, and the block has exactly eleven', () => {
    // If the corpus grows a pool, this count reds and the new pool must be given a state
    // above rather than joining the mounted block as something no world can reach.
    expect(Object.keys(POOLS)).toHaveLength(11);
    expect(new Set(CASES.map(([key]) => key)).size).toBe(11);
    for (const [key] of CASES) expect(POOLS[key], `no such pool: ${key}`).toBeTruthy();
  });

  // A PLAIN PARAMETERLESS TEST LOOPING IN ITS BODY, never an `each` call. The lighting
  // walker parks a whole file that registers tests from a non-literal table, and its
  // each-family park debt is a SHRINK-ONLY ratchet — measured: an `it.each(CASES)` here
  // raised it from 111 to 112 and reddened the gate. Every assertion below carries the
  // pool key in its message, so a failure still names the pool that went dark.
  it('every one of the eleven pools renders a real sentence, not a null and not a stub', () => {
    for (const [key, record] of CASES) {
      const drawn = powerStateProse(town(record), { seed: 'seed-alpha' });
      const rung = BAND_LABELS.includes(key) ? drawn.legitimacyBanner : drawn.legitimacyLens;
      expect(rung, `the pool is mounted and the desk produced no rung for ${key}`).toBeTruthy();
      expect(rung.provenance, `provenance for ${key}`).toEqual(
        expect.objectContaining({ blockId: BLOCK, poolKey: key }),
      );
      // THE ARM THAT WOULD CATCH A LIT-BUT-INCAPABLE BLOCK: a real, filled sentence.
      expect(typeof rung.sentence, `sentence type for ${key}`).toBe('string');
      expect(rung.sentence.length, `sentence length for ${key}`).toBeGreaterThan(20);
      // No slot survived unfilled, and no engine token reached the reader.
      expect(rung.sentence, `unfilled slot in ${key}`).not.toMatch(/[{}]/);
      expect(rung.sentence, `engine token in ${key}`).not.toMatch(/[a-z]+_[a-z]+/);
      // §0d — the prose bands the figure, it never prints one.
      expect(rung.sentence, `digit in ${key}`).not.toMatch(/[0-9]/);
    }
  });

  it('the banner and the lens are drawn from two pools of ONE block at ONE position', () => {
    const drawn = powerStateProse(town(legit('Contested', { safety: -20 })), { seed: 's' });
    expect(drawn.legitimacyBanner.provenance.poolKey).toBe('Contested');
    expect(drawn.legitimacyLens.provenance.poolKey).toBe('breakdown dominated by SAFETY, adverse');
    expect(drawn.legitimacyBanner.provenance.blockId).toBe(BLOCK);
    expect(drawn.legitimacyLens.provenance.blockId).toBe(BLOCK);
    // Two readings, never the same sentence twice.
    expect(drawn.legitimacyBanner.sentence).not.toBe(drawn.legitimacyLens.sentence);
  });
});

describe('the power desk — the lens ordering is load-bearing', () => {
  it('LENS C precedes LENS B, which is what keeps the fracture pool reachable at all', () => {
    // governanceFractured and the crisis band are COEXTENSIVE at the producer
    // (legitimacyBandFor sets both on score < 30), so every fractured state also carries a
    // dominant breakdown. Had the lens preferred the breakdown, this pool would be
    // unreachable in every world the generator can build — lit, and unable to fire.
    const fracturedWithDominantBreakdown = legit('Legitimacy Crisis', { safety: -20 }, true);
    expect(legitimacyLensPoolKey(fracturedWithDominantBreakdown)).toBe('governanceFractured true');
    // THE CONTROL: the same record with the flag cleared falls through to the breakdown,
    // so the arm above is proving the ORDER and not merely that a key comes back.
    expect(legitimacyLensPoolKey(legit('Contested', { safety: -20 }, false)))
      .toBe('breakdown dominated by SAFETY, adverse');
  });

  it('a real generator score below the threshold sets both, confirming the coextension', () => {
    const band = legitimacyBandFor(10);
    expect(band.label).toBe('Legitimacy Crisis');
    expect(band.governanceFractured).toBe(true);
    // And above it, neither.
    const healthy = legitimacyBandFor(80);
    expect(healthy.label).toBe('Endorsed');
    expect(healthy.governanceFractured).toBe(false);
  });

  it('ties break in the declared order rather than by object iteration order', () => {
    // Two equal-magnitude adverse contributions: prosperity is declared first and wins,
    // so an unrelated edit to the record's key order cannot change the rendered sentence.
    expect(legitimacyLensPoolKey(legit('Contested', { prosperity: -10, food: -10 })))
      .toBe('breakdown dominated by PROSPERITY, adverse');
  });
});

describe('the power desk — the deliberate silences', () => {
  it('a dominant FAVOURABLE non-prosperity contribution renders nothing, never a false line', () => {
    // The corpus writes a favourable lens for prosperity alone, and safety/defense/food all
    // reach positive contributions, so this is a state the generator really produces.
    // Falling back to the prosperity line would state something false about the town.
    for (const field of ['safety', 'defense', 'food']) {
      expect(legitimacyLensPoolKey(legit('Endorsed', { [field]: 15 })), field).toBeNull();
    }
    // The banner still speaks: the silence is the LENS's, not the whole surface's.
    const drawn = powerStateProse(town(legit('Endorsed', { safety: 15 })), { seed: 's' });
    expect(drawn.legitimacyLens).toBeNull();
    expect(drawn.legitimacyBanner.sentence).toBeTruthy();
  });

  it('an all-zero breakdown is no dominance at all', () => {
    expect(legitimacyLensPoolKey(legit('Tolerated'))).toBeNull();
  });

  it('a legacy numeric publicLegitimacy narrates nothing rather than half a record', () => {
    const legacy = { name: 'Thornwall', powerStructure: { publicLegitimacy: 62, governingName: 'Ashford Company' } };
    const drawn = powerStateProse(legacy, { seed: 's' });
    expect(drawn.legitimacyBanner).toBeNull();
    expect(drawn.legitimacyLens).toBeNull();
  });

  it('a missing powerStructure is silence, not a crash', () => {
    expect(powerStateProse(undefined).legitimacyBanner).toBeNull();
    expect(powerStateProse({}).legitimacyBanner).toBeNull();
    expect(powerStateProse({ powerStructure: null }).legitimacyBanner).toBeNull();
  });
});

describe('the power desk — the {seat} fill and its refusal', () => {
  it('a conforming governingName fills {seat}, and the fill obeys the declared shape', () => {
    const drawn = powerStateProse(town(legit('Endorsed')), { seed: 'seed-alpha' });
    expect(fillShapeViolation('proper', 'Ashford Company')).toBe('');
    // The name reaches the reader.
    const seated = Object.keys(POOLS).map((key) => powerStateProse(
      town(legit('Endorsed')), { seed: key },
    ).legitimacyBanner?.sentence).filter(Boolean);
    expect(seated.some((line) => line.includes('Ashford Company'))).toBe(true);
    expect(drawn.legitimacyBanner.sentence).toBeTruthy();
  });

  it('a NON-conforming governingName degrades the pool instead of printing a token', () => {
    // 38 of the block's 41 variants name {seat}; three name only {settlement}. A refused
    // fill must drop the 38 and leave the three speaking — anchored liveness doing its
    // work — rather than rendering `merchant_league` at a reader.
    const bad = town(legit('Endorsed'), { governingName: 'merchant_league' });
    const drawn = powerStateProse(bad, { seed: 'seed-alpha' });
    // Endorsed carries one {settlement}-only variant, so the surface still speaks.
    expect(drawn.legitimacyBanner.sentence).toBeTruthy();
    expect(drawn.legitimacyBanner.sentence).not.toMatch(/merchant_league/);
    // A pool whose every variant names {seat} goes fully silent instead.
    const allSeat = powerStateProse(
      town(legit('Approved'), { governingName: 'merchant_league' }), { seed: 'seed-alpha' },
    );
    expect(allSeat.legitimacyBanner.sentence).toBeNull();
  });
});

describe('the power desk — THE PROMISE and the mount wiring', () => {
  it('same seed + same state ⇒ same sentence, and a different seed may differ', () => {
    const state = () => town(legit('Tolerated'));
    const a = powerStateProse(state(), { seed: 'seed-alpha' });
    const b = powerStateProse(state(), { seed: 'seed-alpha' });
    expect(a.legitimacyBanner.sentence).toBe(b.legitimacyBanner.sentence);
    expect(a.legitimacyBanner.provenance).toEqual(b.legitimacyBanner.provenance);
  });

  it('DIFFERENTIAL: one seed, two states, two different sentences', () => {
    // The arm that a dormant feature cannot pass. If the desk were incapable, both of
    // these would be null or identical.
    const endorsed = powerStateProse(town(legit('Endorsed')), { seed: 'same-seed' });
    const crisis = powerStateProse(town(legit('Legitimacy Crisis', {}, true)), { seed: 'same-seed' });
    expect(endorsed.legitimacyBanner.sentence).toBeTruthy();
    expect(crisis.legitimacyBanner.sentence).toBeTruthy();
    expect(endorsed.legitimacyBanner.sentence).not.toBe(crisis.legitimacyBanner.sentence);
    // And the lens differentiates too: silent on the healthy town, speaking on the crisis.
    expect(endorsed.legitimacyLens).toBeNull();
    expect(crisis.legitimacyLens.sentence).toBeTruthy();
  });

  it('the registry mounts DS-POW-1 once, as a sentence, on the power tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === BLOCK);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      mount: 'power.legitimacyBanner', tab: 'power', desk: 'power', rung: 'sentence',
    });
    expect(sentenceMountForBlock(BLOCK)?.mount).toBe('power.legitimacyBanner');
    expect(UNMOUNTED_BLOCKS).not.toContain(BLOCK);
  });

  it('the mount ROUTES: flipping the row to glance would silence both readings together', () => {
    const drawn = powerStateProse(town(legit('Contested', { safety: -20 })), { seed: 's' });
    // As mounted (sentence), both readings reach the page.
    expect(drawnAtMount('power.legitimacyBanner', drawn.legitimacyBanner).sentence).toBeTruthy();
    expect(drawnAtMount('power.legitimacyBanner', drawn.legitimacyLens).sentence).toBeTruthy();
    // A glance row strips the sentence AND its provenance from whatever it is handed —
    // the control proving the component is routed rather than merely naming a string.
    const asGlance = drawnAtMount('economics.economyTile', drawn.legitimacyBanner);
    expect(asGlance.sentence).toBeNull();
    expect(asGlance.provenance).toBeNull();
    // An unmounted position is silence, not a fallback to speech.
    expect(drawnAtMount('power.notAPosition', drawn.legitimacyBanner)).toBeNull();
  });
});

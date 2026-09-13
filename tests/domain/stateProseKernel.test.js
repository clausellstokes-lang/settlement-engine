/**
 * stateProseKernel.test.js — LANE P-2: the reader's six laws, proven.
 *
 * The kernel is small and everything it does is load-bearing, so each law gets a pin
 * that FAILS when the law is removed rather than a pin that merely exercises the happy
 * path:
 *
 *   1. ANCHORED LIVENESS — a line whose anchor state is absent does not render. Pinned
 *      as a TRANSITION (seed the state, see the line; take the state away, the line is
 *      gone) so the negative cannot go vacuous on an empty corpus.
 *   2. FAIL-CLOSED AUDIENCE — the player's page over a covert state is BYTE-IDENTICAL
 *      to the player's page over a state that genuinely has no covert seam.
 *   3. THE AVALANCHE DRAW — measured against the degenerate seed family that killed
 *      half a pool before the finalizer existed.
 *   4. SEEDLESS IS CANONICAL-AT-ZERO — plus same-seed determinism (THE PROMISE).
 *   5. THE DEMOTED STATE DIMENSION, FAIL-CLOSED — pinned here as DARKNESS (the reader is
 *      byte-identical on the 762 pools that demote nothing) because the law itself is
 *      pinned against the CORPUS, in tests/data/dossierStateProseProjection.contract.test.js,
 *      where the corpus and the reader can be read against each other. Splitting it that
 *      way is deliberate: the defect was a disagreement between the annex's STATE-KEY and
 *      the projection's pool key, and neither file alone can see both halves.
 *   6. THE INDEX-STABLE DRAW (REWRITE car 8a-1) — pinned as the PROPERTY that motivated
 *      it rather than as a percentage: appending a wording moves no read between two old
 *      wordings, and the shipped modulus is re-spelled in the same arm so the contrast is
 *      measured in one run instead of quoted from a receipt.
 *
 * The corpus is read live from the projected desk leaves, not from a fixture: a pin
 * over an invented pool would prove the kernel works on prose that does not ship.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  AUDIENCE_DM,
  AUDIENCE_PLAYER,
  drawFace,
  drawVariant,
  eligibleFaces,
  eligibleVariants,
  facePairOf,
  facePartner,
  faceSentenceCount,
  faceSourceOf,
  faceIsCompoundable,
  faceWeigh,
  fillSlots,
  hasStateProsePool,
  hashKey,
  joinPairFaces,
  openLowercased,
  pairJoint,
  poolDimensions,
  readStateProse,
  stableVid,
  stateProseSentence,
  variantIsAnchored,
  variantIsAudible,
  ARCHIVER_SOURCE,
  FACE_SOURCES,
  FULL_STOP_JOINT,
  PAIR_JOINTS,
  PAIR_KINDS,
  STATE_MARK_DIMENSIONS,
  UNIVERSAL_SOURCE,
  WEIGHABLE_KINDS,
  WEIGH_KIND,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_CAUSAL_PROSE } from '../../src/data/dossierCausalProse.generated.js';
import { PROSPERITY_TIERS } from '../../src/data/constants.js';
import { deriveProsperityLabel } from '../../src/generators/economy/prosperity.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/**
 * The hash pair, re-spelled here so every key this file checks is checked against an
 * INDEPENDENT fold rather than against the kernel's own. Module scope because both the
 * face arms (ARCH §2.6) and the law-6 draw arms need it, and two copies of a reference
 * fold in one file is two things that can drift apart.
 * @param {string} key
 * @returns {number}
 */
function referenceHash(key) {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  let x = h >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return x >>> 0;
}

/**
 * DS-ECO-8's rungs, SPLIT BY REACHABILITY (lane PT, 2026-08-03).
 *
 * The kernel's liveness laws used to be proven on `SUBSISTENCE` alone, and no live
 * settlement can ever reach that pool. `Subsistence` is rung 0 of PROSPERITY_TIERS,
 * but the generator does not emit it: `deriveProsperityLabel` returns out of
 * `LABELS = ['Struggling', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy']`
 * (src/generators/economy/prosperity.js), and constants.js records the same fact in
 * its own words — Subsistence "is an internal base label remapped to Struggling/Poor
 * before emission; it is kept here for tolerance toward legacy or hand-written saves."
 *
 * A law proven only on unreachable prose is a law proven on nothing a reader will ever
 * see, so both rungs are pinned. STRUGGLING is the band that ships; SUBSISTENCE stays
 * because legacy and hand-written saves still render it, and is labelled as exactly
 * that so nobody later mistakes it for the representative case.
 *
 * Both pools carry at least one `{settlement}`-anchored line and at least one slot-free
 * line, which is what makes the anchored-liveness negative below non-vacuous.
 */
const REACHABLE_RUNG = {
  block: 'DS-ECO-8', pool: 'STRUGGLING',
  why: 'REACHABLE — the generator\'s lowest emitted rung',
};
const LEGACY_RUNG = {
  block: 'DS-ECO-8', pool: 'SUBSISTENCE',
  why: 'LEGACY TOLERANCE — never emitted; legacy and hand-written saves only',
};
const PROSPERITY_RUNGS = [REACHABLE_RUNG, LEGACY_RUNG];

/**
 * THE LADDER, EXECUTED (lane PR, 2026-08-03).
 *
 * The two rungs above are a JUDGMENT written into prose: STRUGGLING is reachable,
 * SUBSISTENCE is not. Prose cannot red. Until this block existed, deleting a rung from
 * `deriveProsperityLabel`'s own `LABELS` ladder — the exact mutant the cycle-11 verifier
 * ran — left every pin in this file green while the corpus kept a pool no live
 * settlement could ever reach. Reachability is now MEASURED: the real generator function
 * is called, and the set of labels it can emit is compared, both directions, against the
 * set of pool keys DS-ECO-8 actually carries.
 *
 * THE SWEEP IS DELIBERATELY RNG-FREE. `deriveProsperityLabel` touches `_rng()` on
 * exactly one arm — the `'Subsistence'` INPUT, which rolls its own remap — so no sweep
 * cell passes that input. Every cell below is a pure function of its arguments, which is
 * what lets the emitted set be asserted as an exact equality rather than a containment.
 *
 * The stress column is what reaches rung 0: `under_siege` clamps the index to 0 from any
 * base, and `indebted` decrements it, so the sweep walks the whole ladder from five
 * bases without ever needing the RNG arm.
 */
const LADDER_SWEEP_BASES = ['Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy'];
const LADDER_SWEEP_STRESSES = [[], ['under_siege'], ['indebted']];

/** Every label the shipped ladder can actually put on a settlement. */
function emittedProsperityLabels() {
  const emitted = new Set();
  for (const base of LADDER_SWEEP_BASES) {
    for (const stressTypes of LADDER_SWEEP_STRESSES) {
      emitted.add(deriveProsperityLabel(base, { stressTypes }, []));
    }
  }
  return emitted;
}

describe('the state-prose reader — the corpus keys on bands the ladder can reach', () => {
  it('sweeps the real ladder deterministically, with no RNG arm touched', () => {
    // Guard-the-guard twice over. If the sweep ever became seed-dependent, the exact
    // set equality below would flake instead of failing honestly; and if the sweep
    // stopped calling the real function, it would compare a hard-coded list to itself.
    const first = [...emittedProsperityLabels()].sort();
    const second = [...emittedProsperityLabels()].sort();
    expect(first).toEqual(second);
    expect(deriveProsperityLabel('Moderate', { stressTypes: [] }, [])).toBe('Moderate');
    expect(deriveProsperityLabel('Poor', { stressTypes: ['under_siege'] }, [])).toBe('Struggling');
    // The RNG arm this sweep must never touch: `deriveProsperityLabel` rolls
    // `_rng()` on the 'Subsistence' INPUT alone, so a base list carrying it would
    // make every cell above seed-dependent and the exact set equality a flake.
    // anchored: the subject is a literal array declared in this file (line ~88), never a produced collection, so it cannot drift out from under the assertion
    expect(LADDER_SWEEP_BASES).not.toContain('Subsistence');
  });

  it('emits EXACTLY the bands DS-ECO-8 pools on, minus the legacy rung', () => {
    // The pin the LABELS-ladder mutant must red: delete 'Struggling' from
    // deriveProsperityLabel's LABELS and the emitted set loses the band the corpus
    // still carries a pool for, so this equality fails.
    const emitted = [...emittedProsperityLabels()].map((label) => String(label).toUpperCase()).sort();
    const pooled = Object.keys(DOSSIER_STATE_PROSE_ECONOMY[REACHABLE_RUNG.block].pools)
      .filter((key) => key !== LEGACY_RUNG.pool)
      .sort();
    expect(
      emitted,
      'the prosperity ladder and DS-ECO-8\'s pools have drifted apart: either the corpus '
      + 'keys on a band no settlement can reach, or the ladder emits a band with no prose',
    ).toEqual(pooled);
  });

  it('proves SUBSISTENCE is the legacy rung it is labelled as, rather than asserting it', () => {
    // The other half of the same claim. LEGACY TOLERANCE is only honest while the
    // generator genuinely cannot emit the rung; if a future ladder starts emitting it,
    // the label above becomes a lie and this reds.
    const emitted = [...emittedProsperityLabels()];
    // Compared in BOTH spellings on purpose: the pool key is upper-case and the label is
    // title-case, and a case-blind comparison here would pass whatever the ladder did.
    //
    // THE ANCHOR IS THE RUNG NEXT TO IT. `Struggling` is PROSPERITY_TIERS[1] — rung 1,
    // the lowest band the ladder does emit, reached by the very same `under_siege`
    // clamp that would reach rung 0 if rung 0 were reachable. It travels the identical
    // code path, so a ladder that stopped emitting anything, or an `emittedProsperityLabels`
    // that stopped calling the real function, reds on the anchor instead of passing the
    // exclusion. A hard-coded sibling the sweep never produces would not do.
    expectAbsentWithAnchor(
      emitted.map((label) => String(label).toUpperCase()),
      LEGACY_RUNG.pool,
      PROSPERITY_TIERS[1].toUpperCase(),
      'the legacy rung, upper-cased like the pool key',
    );
    expectAbsentWithAnchor(
      emitted,
      PROSPERITY_TIERS[0],
      PROSPERITY_TIERS[1],
      'the legacy rung, title-cased like the emitted label',
    );
    expect(PROSPERITY_TIERS[0]).toBe('Subsistence');
    expect(LEGACY_RUNG.pool).toBe(PROSPERITY_TIERS[0].toUpperCase());
  });
});

describe('the state-prose reader — anchored liveness', () => {
  it('pins the rungs the ladder actually names, reachable one first', () => {
    // Guard-the-guard: if the vocabulary is re-ordered or a rung renamed, these pins
    // would silently start proving the laws on a different band than their prose claims.
    expect(PROSPERITY_TIERS[0]).toBe('Subsistence');
    expect(PROSPERITY_TIERS[1]).toBe('Struggling');
    for (const rung of PROSPERITY_RUNGS) {
      expect(
        DOSSIER_STATE_PROSE_ECONOMY[rung.block].pools[rung.pool],
        `${rung.pool} (${rung.why}) is not in the shipped corpus`,
      ).toBeTruthy();
    }
  });

  for (const rung of PROSPERITY_RUNGS) {
    it(`offers the settlement-naming rung only while the town has a name — ${rung.pool} [${rung.why}]`, () => {
      const pool = DOSSIER_STATE_PROSE_ECONOMY[rung.block].pools[rung.pool];
      const named = eligibleVariants(pool, { slots: { settlement: 'Thornwall' }, audience: AUDIENCE_DM })
        .map((v) => v.text);
      const unnamed = eligibleVariants(pool, { slots: {}, audience: AUDIENCE_DM }).map((v) => v.text);

      const slotted = named.find((t) => t.includes('{settlement}'));
      expect(slotted, 'the rung must carry at least one settlement-anchored line').toBeTruthy();
      expectPresentThenAbsent(named, unnamed, slotted, 'settlement anchor removed');
      // The pool DEGRADES rather than going dark: the rung's slot-free variants still
      // speak. That is the anchor keeping this negative honest.
      expect(unnamed.length).toBeGreaterThan(0);
    });

    it(`substitutes the fill and leaves no placeholder behind — ${rung.pool} [${rung.why}]`, () => {
      // THE LIVENESS ANCHOR, in two halves. The corpus side: this rung provably
      // CARRIES a slot token, so the regex below has something it could catch —
      // over a slot-free pool the negative would be true of prose that never had a
      // placeholder to leave behind. The reader side: the draw provably returned
      // prose, so the regex is looking at live output rather than at undefined.
      const pool = DOSSIER_STATE_PROSE_ECONOMY[rung.block].pools[rung.pool];
      expect(
        pool.some((v) => /\{[a-z_]+\}/i.test(v.text)),
        `${rung.pool} carries no slot token at all — the no-placeholder negative would be vacuous`,
      ).toBe(true);
      const line = readStateProse(
        DOSSIER_STATE_PROSE_ECONOMY, rung.block, rung.pool,
        { slots: { settlement: 'Thornwall' }, seed: 'save-1::eco-8', audience: AUDIENCE_DM },
      );
      expect(line?.text).toBeTruthy();
      // anchored: the two assertions above prove the pool can produce a slot token and that the reader returned live prose, so this measures substitution rather than absence-of-everything
      expect(line?.text).not.toMatch(/\{[a-z_]+\}/i);
    });
  }

  it('drops exactly the variants whose anchor state is missing, keeping the rest', () => {
    // A causal family whose variants split across two slot demands: with {counterpart}
    // filled the counterpart-naming lines are live; without it they are gone, and the
    // lines that never needed it survive — the anchor that keeps this non-vacuous.
    const family = DOSSIER_CAUSAL_PROSE['JF-CPL-1a'];
    const full = { settlement: 'Thornwall', counterpart: 'Ashford', route: 'the Ford Road', good: 'salt', reason: 'the seizure', term: 'the indemnity', timeband_since: 'a decade on', timeband_age: 'a decade old' };
    const withCounterpart = eligibleVariants(family.pools['*'], { slots: full, audience: AUDIENCE_DM })
      .map((v) => v.text);
    const { counterpart, ...withoutCounterpart } = full;
    const without = eligibleVariants(family.pools['*'], { slots: withoutCounterpart, audience: AUDIENCE_DM })
      .map((v) => v.text);

    const counterpartLine = withCounterpart.find((t) => t.includes('{counterpart}'));
    expect(counterpartLine, 'the family must carry at least one counterpart-anchored line').toBeTruthy();
    expectPresentThenAbsent(withCounterpart, without, counterpartLine, 'counterpart anchor removed');
    expect(without.length, 'the unanchored lines must survive, or the negative is vacuous')
      .toBeGreaterThan(0);
  });

  it('never emits a sentence carrying an unfilled placeholder', () => {
    // The second gate: even asked directly, the filler refuses a partial fill.
    expect(fillSlots('{settlement} trades with {counterpart}.', { settlement: 'Thornwall' })).toBeNull();
    expect(fillSlots('{settlement} keeps to itself.', { settlement: 'Thornwall' }))
      .toBe('Thornwall keeps to itself.');
  });

  it('treats a numeric or blank fill as no fill — §0d bans digits from this register', () => {
    expect(variantIsAnchored({ slots: ['band'] }, { band: 42 })).toBe(false);
    expect(variantIsAnchored({ slots: ['band'] }, { band: '   ' })).toBe(false);
    expect(variantIsAnchored({ slots: ['band'] }, { band: 'a broad margin' })).toBe(true);
  });

  it('returns null for a pool the corpus does not carry, rather than a fallback', () => {
    expect(hasStateProsePool(DOSSIER_STATE_PROSE_ECONOMY, 'DS-ECO-8', 'AFFLUENT')).toBe(false);
    expect(stateProseSentence(DOSSIER_STATE_PROSE_ECONOMY, 'DS-ECO-8', 'AFFLUENT', {
      slots: { settlement: 'Thornwall' }, seed: 's',
    })).toBeNull();
  });
});

describe('the state-prose reader — fail-closed audience', () => {
  /**
   * A shipped pool holding both covert and open variants, with a slot bag generous
   * enough that eligibility turns on the AUDIENCE and not on a missing fill.
   */
  function covertPool() {
    for (const family of Object.values(DOSSIER_CAUSAL_PROSE)) {
      const pool = family.pools['*'];
      const slots = Object.fromEntries(
        [...new Set(pool.flatMap((v) => v.slots))].map((s) => [s, `a ${s} fill`]),
      );
      const live = eligibleVariants(pool, { audience: AUDIENCE_DM, slots });
      const covert = live.filter((v) => (v.marks || []).includes('dm-only'));
      if (covert.length > 0 && covert.length < live.length) return { pool, covert, slots };
    }
    throw new Error('no shipped pool mixes covert and open variants — the pin would be vacuous');
  }

  it('shows covert variants to the DM and never to the player', () => {
    const { pool, covert, slots } = covertPool();
    const dm = eligibleVariants(pool, { audience: AUDIENCE_DM, slots });
    const player = eligibleVariants(pool, { audience: AUDIENCE_PLAYER, slots });
    expectPresentThenAbsent(dm, player, covert[0], 'player projection');
  });

  it('treats an unrecognised audience as the player — the restrictive read', () => {
    const { pool, covert, slots } = covertPool();
    const unknown = eligibleVariants(pool, { audience: 'auditor', slots });
    // THE ANCHOR IS AN OPEN SIBLING FROM THE SAME POOL. `covertPool` guarantees the
    // pool mixes covert and open variants, so an open one exists; it travels the
    // identical eligibility path and must SURVIVE the unknown-audience read. Without
    // it, a filter that returned [] for every unrecognised audience — or a slot bag
    // that stopped satisfying the pool — would pass the exclusion while proving the
    // opposite of the restrictive read this test claims.
    const openSibling = eligibleVariants(pool, { audience: AUDIENCE_DM, slots })
      .find((v) => !(v.marks || []).includes('dm-only'));
    expectAbsentWithAnchor(unknown, covert[0], openSibling, 'the unrecognised audience reads as the player');
    expect(variantIsAudible(covert[0], 'auditor')).toBe(false);
    expect(variantIsAudible(covert[0], AUDIENCE_DM)).toBe(true);
  });

  it('renders a player page over a covert state byte-identically to one without', () => {
    // J-CPL-5's hardest form. Two pools with the same open variants; one also carries a
    // covert line. The player must not be able to tell them apart — not by content, not
    // by a gap, not by a different draw.
    const open = [
      { angle: 'street', text: 'The market keeps its hours.', slots: [] },
      { angle: 'ledger', text: 'The books close level.', slots: [] },
    ];
    const seamed = [...open, { angle: 'elder', marks: ['dm-only'], text: 'The rents go elsewhere.', slots: [] }];
    const corpusOpen = { 'X-1': { pools: { '*': open } } };
    const corpusSeamed = { 'X-1': { pools: { '*': seamed } } };
    for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      expect(
        readStateProse(corpusSeamed, 'X-1', '*', { seed, audience: AUDIENCE_PLAYER })?.text,
      ).toBe(
        readStateProse(corpusOpen, 'X-1', '*', { seed, audience: AUDIENCE_PLAYER })?.text,
      );
    }
  });
});

describe('the state-prose reader — the avalanche draw', () => {
  it('reaches every variant of a power-of-two pool on the degenerate seed family', () => {
    // The measured killer: a seed whose varying token appears an EVEN number of times
    // holds FNV-1a's bit 0 constant, so a raw `% 8` reaches four residues of eight.
    const pool = Array.from({ length: 8 }, (_, i) => ({ angle: 'ledger', text: `v${i}`, slots: [] }));
    const reached = new Set();
    for (let i = 0; i < 400; i++) {
      reached.add(drawVariant(pool, 'DS-X-1', '*', `wizard_news.${i}.applied.evt${i}`).text);
    }
    expect(reached.size).toBe(8);
  });

  it('binds the draw to the pool identity, so two pools on one seed do not move together', () => {
    const pool = Array.from({ length: 6 }, (_, i) => ({ angle: 'ledger', text: `v${i}`, slots: [] }));
    const a = Array.from({ length: 60 }, (_, i) => drawVariant(pool, 'DS-A-1', '*', `s${i}`).text);
    const b = Array.from({ length: 60 }, (_, i) => drawVariant(pool, 'DS-B-2', '*', `s${i}`).text);
    expect(a).not.toEqual(b);
  });
});

describe('the state-prose reader — THE PROMISE', () => {
  // Both rungs again: same-seed stability and canonical-at-zero are the two laws a
  // reader would notice breaking, and proving them only on the unreachable band would
  // leave the band every real settlement renders unproven.
  for (const rung of PROSPERITY_RUNGS) {
    it(`draws the same sentence for the same seed and the same state, every time — ${rung.pool} [${rung.why}]`, () => {
      const args = [DOSSIER_STATE_PROSE_ECONOMY, rung.block, rung.pool,
        { slots: { settlement: 'Thornwall' }, seed: 'world-7::DS-ECO-8', audience: AUDIENCE_DM }];
      const first = readStateProse(...args);
      for (let i = 0; i < 20; i++) expect(readStateProse(...args)).toEqual(first);
    });

    it(`reads canonical-at-zero when there is no seed — ${rung.pool} [${rung.why}]`, () => {
      const pool = DOSSIER_STATE_PROSE_ECONOMY[rung.block].pools[rung.pool];
      const seedless = readStateProse(DOSSIER_STATE_PROSE_ECONOMY, rung.block, rung.pool,
        { slots: { settlement: 'Thornwall' } });
      expect(seedless?.text).toBe(pool[0].text.replace('{settlement}', 'Thornwall'));
    });
  }
});

describe('the state-prose reader — law 5, and the darkness of it', () => {
  /**
   * THE WHOLE SHIPPED CORPUS, all seven leaves. The law-5 gate reads `marks`, which every
   * pool in the estate carries, so a proof over one desk would be a proof over 105 of 786
   * pools. Discovered by import rather than by filesystem walk because these are the seven
   * the projection actually emits and the contract test already holds that roster.
   */
  const ALL_POOLS = [
    ['economy', DOSSIER_STATE_PROSE_ECONOMY], ['power', DOSSIER_STATE_PROSE_POWER],
    ['defense', DOSSIER_STATE_PROSE_DEFENSE], ['warFaith', DOSSIER_STATE_PROSE_WAR_FAITH],
    ['stressors', DOSSIER_STATE_PROSE_STRESSORS], ['general', DOSSIER_STATE_PROSE_GENERAL],
    ['causal', DOSSIER_CAUSAL_PROSE],
  ].flatMap(([desk, corpus]) => Object.entries(corpus)
    .flatMap(([blockId, block]) => Object.entries(block.pools)
      .map(([poolKey, pool]) => ({ desk, blockId, poolKey, pool }))));

  /** Every slot the pool names, filled, so eligibility turns on the LAW and not on a gap. */
  function bagFor(pool) {
    const slots = {};
    for (const variant of pool) for (const slot of variant.slots || []) slots[slot] = 'Thornwall';
    return slots;
  }

  const SWEEP_SEEDS = ['', 'a', 'b', 'world-7', 'Thornwall::1', 'wizard_news.4.applied.evt4', 'zz', '19'];

  it('is BYTE-IDENTICAL to the pre-cure reader on every pool with no demoted dimension', () => {
    // T6 — WHAT LETS THIS LAND DARK AND SAY SO. The reference is the pre-cure eligibility
    // rule spelled out from the two predicates this file already exports, so the comparison
    // is against the reader as it behaved at 2d5112851 rather than against a memory of it.
    // 684 of 708 state pools and ALL 78 causal pools demote no dimension, and on every one
    // of them the gate must be invisible: same eligible set, same draw, same sentence.
    //
    // The loop collects instead of asserting inside — a bare `expect(` under a seed loop
    // reports a floor, never a count (tests/lint/seedLoopTotality.walker.test.js).
    const drift = [];
    let poolsChecked = 0;
    let draws = 0;
    for (const { desk, blockId, poolKey, pool } of ALL_POOLS) {
      if (poolDimensions(pool).length > 0) continue;
      poolsChecked += 1;
      const slots = bagFor(pool);
      for (const audience of [AUDIENCE_DM, AUDIENCE_PLAYER]) {
        const reference = pool.filter(
          (variant) => variantIsAudible(variant, audience) && variantIsAnchored(variant, slots),
        );
        const cured = eligibleVariants(pool, { slots, audience });
        if (cured.length !== reference.length || cured.some((v, i) => v !== reference[i])) {
          drift.push(`ELIGIBILITY :: ${desk} :: ${blockId} :: ${poolKey} :: ${audience}`);
        }
        for (const seed of SWEEP_SEEDS) {
          draws += 1;
          const was = drawVariant(reference, blockId, poolKey, seed);
          const wasText = was ? fillSlots(was.text, slots) : null;
          const nowText = readStateProse({ [blockId]: { pools: { [poolKey]: pool } } },
            blockId, poolKey, { slots, seed, audience })?.text ?? null;
          if (wasText !== nowText) {
            drift.push(`DRAW :: ${desk} :: ${blockId} :: ${poolKey} :: ${audience} :: seed "${seed}"`);
          }
        }
      }
    }
    expect(drift).toEqual([]);
    // Non-vacuity, MEASURED at 2d5112851: 786 pools ship, 24 of them demote a dimension,
    // so 762 are swept here. A sweep that stopped finding pools would satisfy the list above
    // by being empty, which is the failure mode this pair of floors exists to refuse.
    expect(poolsChecked).toBeGreaterThanOrEqual(762);
    expect(draws).toBeGreaterThanOrEqual(762 * 2 * SWEEP_SEEDS.length);
  });

  it('leaves the causal register untouched — no arm name is a dimension word', () => {
    // The one way this change could reach a SHIPPED surface. causalDossierProse.js hand-rolls
    // its own `marks` filter over 92 open, family-local arm names and then calls
    // eligibleVariants; if any arm name were also a dimension word, poolDimensions would see
    // a dimension in a causal pool and the causal reader would go silent. It cannot today,
    // and this is the arm that keeps it so.
    const causal = ALL_POOLS.filter((p) => p.desk === 'causal');
    const dimensioned = causal.filter((p) => poolDimensions(p.pool).length > 0);
    expect(dimensioned).toEqual([]);
    expect(causal.length).toBeGreaterThanOrEqual(78);
    const vocabulary = Object.values(STATE_MARK_DIMENSIONS).flat();
    expect(vocabulary).toEqual(['minor', 'major', 'catastrophic', 'deficit', 'no deficit', 'anchored', 'not anchored']);
  });
});

/**
 * ── ARCH-COMPOSED-PROSE car 3a: THE WORDING FACE ────────────────────────────────────
 *
 * `drawFace` is the SECOND level of the two-level roll (§2.6): the variant is drawn on
 * today's key and the SURFACE is drawn on a `::w` suffix of it. The whole point of the shape
 * is that the parent key never changes, so faces can be added to a variant without re-rolling
 * which variant a town reads — and on TODAY's corpus, where every variant has exactly one
 * face, the function returns before it touches the hash at all.
 *
 * That last claim is the one worth an arm rather than a paragraph, because behaviour cannot
 * distinguish it: `hash % 1` is 0 whatever the hash was. So the arm COUNTS THE HASH PAIR'S
 * OWN MULTIPLICATIONS. `fnv1a32` calls `Math.imul` once per character and `avalanche32`
 * twice; a spy on `Math.imul` therefore witnesses the fold running, and a live control proves
 * the witness is not simply blind.
 */
describe('the state-prose reader — the wording face (ARCH §2.6)', () => {
  /** A variant with one face: today's whole corpus. */
  const ONE_FACE = Object.freeze({ text: 'The walls stand.', angle: 'ledger' });
  /** A PLANTED four-face variant: the shape the rewrite wave freezes (§2.6, faceCounts 4). */
  const FOUR_FACE = Object.freeze({
    text: 'The walls stand.', angle: 'ledger', wordings: Object.freeze(['a', 'b', 'c']),
  });

  /**
   * THE SIX STATE LEAVES, whole — the R1 register the composed model migrates. The causal
   * register is excluded on purpose: `faceCounts` is R1's schema (§2.3) and R2's faces are a
   * deferred owner row (§13 row 14), so folding it in here would make the 2,266 floor below
   * mean something other than what ARCH counts.
   */
  const SHIPPED_POOLS = [
    ['economy', DOSSIER_STATE_PROSE_ECONOMY], ['power', DOSSIER_STATE_PROSE_POWER],
    ['defense', DOSSIER_STATE_PROSE_DEFENSE], ['warFaith', DOSSIER_STATE_PROSE_WAR_FAITH],
    ['stressors', DOSSIER_STATE_PROSE_STRESSORS], ['general', DOSSIER_STATE_PROSE_GENERAL],
  ].flatMap(([desk, corpus]) => Object.entries(corpus)
    .flatMap(([blockId, block]) => Object.entries(block.pools)
      .map(([poolKey, pool]) => ({ desk, blockId, poolKey, pool }))));

  it('⭐ A ONE-FACE VARIANT NEVER HASHES, counted on the hash pair itself', () => {
    const spy = vi.spyOn(Math, 'imul');
    try {
      expect(drawFace(ONE_FACE, 'DS-DEF-11', 'UNWALLED-SMALL', 'a-long-seed-string'), 'face 0')
        .toBe(0);
      expect(spy.mock.calls.length, 'the no-hash short-circuit: NEITHER half of the pair ran')
        .toBe(0);
      // THE LIVE CONTROL, or the count above proves only that the spy is deaf. A four-face
      // variant on the same seed runs the fold, so the witness is demonstrably awake.
      drawFace(FOUR_FACE, 'DS-DEF-11', 'UNWALLED-SMALL', 'a-long-seed-string');
      expect(spy.mock.calls.length, 'and the same witness sees the fold when it does run')
        .toBeGreaterThan(0);
    } finally {
      spy.mockRestore();
    }
  });

  it('⭐ THE SHIPPED CORPUS TAKES NO HASH EXCEPT ON THE ONE v3 POOL, and the corpus is read live', () => {
    // The claim car 3a rested on: the composer's face draw was byte-identical BY CONSTRUCTION,
    // because no variant that shipped carried a `wordings` list. THE FIRST v3 POOL HAS ENDED
    // THAT LAWFULLY, so the arm is re-pinned rather than deleted: the FOUR v3 pools with faces
    // today all sit in `DS-DEF-2` and every one of their twelve variants is NAMED. Everything
    // else still takes no hash and still draws face 0. Measured over the live leaves, so a
    // further pool landing faces reds here by name.
    // ⭐ RE-PINNED AT THE 8b DS-DEF-2 DRAFT GATE (v3) from the single `walls with NO force`
    // roster: three more pools of the same block landed faces in one commit.
    // ⭐⭐ RE-PINNED AT THE DRAFT GATE'S THIRD SITTING: FIVE more pools of the block landed faces
    // in one commit, so the roster was forty-two variants of fourteen pools. A sixth packet was
    // REFUSED at that gate (`Disasters & Famine: granary AND parish care only`) and was absent
    // here by the refusal. Everything outside DS-DEF-2 still takes no hash and still draws face 0.
    // ⭐⭐⭐ RE-PINNED AT THE 8b DS-DEF-2 CURE GATE (v3), AND THE REFUSED POOL IS WHY. Six cure
    // packets landed; five re-cut wordings inside counts they already had and move nothing here.
    // The whole of this move is `Disasters & Famine: granary AND parish care only`, whose cure
    // removes the one PROVENANCE citation the draft gate refused it for (`from the road` →
    // `from outside`) and which therefore takes its seat for the first time. The roster is now
    // FORTY-FIVE variants of FIFTEEN pools, +3 and +1 — a GROW only, no pool lost a face.
    const FACED_TODAY = ['DS-DEF-2 :: Beasts & Monsters: frontier, credible deterrence #0',
      'DS-DEF-2 :: Beasts & Monsters: frontier, credible deterrence #1',
      'DS-DEF-2 :: Beasts & Monsters: frontier, credible deterrence #2',
      'DS-DEF-2 :: Beasts & Monsters: frontier, force without a perimeter #0',
      'DS-DEF-2 :: Beasts & Monsters: frontier, force without a perimeter #1',
      'DS-DEF-2 :: Beasts & Monsters: frontier, force without a perimeter #2',
      'DS-DEF-2 :: Beasts & Monsters: plagued, perimeter but NO force to hold it #0',
      'DS-DEF-2 :: Beasts & Monsters: plagued, perimeter but NO force to hold it #1',
      'DS-DEF-2 :: Beasts & Monsters: plagued, perimeter but NO force to hold it #2',
      'DS-DEF-2 :: Disasters & Famine: NO reserves, NO medical provision #0',
      'DS-DEF-2 :: Disasters & Famine: NO reserves, NO medical provision #1',
      'DS-DEF-2 :: Disasters & Famine: NO reserves, NO medical provision #2',
      'DS-DEF-2 :: Disasters & Famine: granary AND hospital #0',
      'DS-DEF-2 :: Disasters & Famine: granary AND hospital #1',
      'DS-DEF-2 :: Disasters & Famine: granary AND hospital #2',
      'DS-DEF-2 :: Disasters & Famine: granary AND parish care only #0',
      'DS-DEF-2 :: Disasters & Famine: granary AND parish care only #1',
      'DS-DEF-2 :: Disasters & Famine: granary AND parish care only #2',
      'DS-DEF-2 :: Economic Survival: STRONG #0',
      'DS-DEF-2 :: Economic Survival: STRONG #1',
      'DS-DEF-2 :: Economic Survival: STRONG #2',
      'DS-DEF-2 :: Economic Survival: WEAK #0',
      'DS-DEF-2 :: Economic Survival: WEAK #1',
      'DS-DEF-2 :: Economic Survival: WEAK #2',
      'DS-DEF-2 :: Internal Security: court without detention #0',
      'DS-DEF-2 :: Internal Security: court without detention #1',
      'DS-DEF-2 :: Internal Security: court without detention #2',
      'DS-DEF-2 :: Internal Security: full legal chain (court AND prison) #0',
      'DS-DEF-2 :: Internal Security: full legal chain (court AND prison) #1',
      'DS-DEF-2 :: Internal Security: full legal chain (court AND prison) #2',
      'DS-DEF-2 :: Internal Security: no legal infrastructure #0',
      'DS-DEF-2 :: Internal Security: no legal infrastructure #1',
      'DS-DEF-2 :: Internal Security: no legal infrastructure #2',
      'DS-DEF-2 :: Invasion & War: force with NO walls #0',
      'DS-DEF-2 :: Invasion & War: force with NO walls #1',
      'DS-DEF-2 :: Invasion & War: force with NO walls #2',
      'DS-DEF-2 :: Invasion & War: walls AND professional garrison #0',
      'DS-DEF-2 :: Invasion & War: walls AND professional garrison #1',
      'DS-DEF-2 :: Invasion & War: walls AND professional garrison #2',
      'DS-DEF-2 :: Invasion & War: walls with NO force #0',
      'DS-DEF-2 :: Invasion & War: walls with NO force #1',
      'DS-DEF-2 :: Invasion & War: walls with NO force #2',
      'DS-DEF-2 :: Invasion & War: walls with citizen militia #0',
      'DS-DEF-2 :: Invasion & War: walls with citizen militia #1',
      'DS-DEF-2 :: Invasion & War: walls with citizen militia #2'];
    const withWordings = SHIPPED_POOLS
      .flatMap(({ desk, blockId, poolKey, pool }) => pool
        .map((variant, at) => ({ desk, blockId, poolKey, at, variant }))
        .filter((row) => Array.isArray(row.variant.wordings)))
      .map((row) => `${row.blockId} :: ${row.poolKey} #${row.at}`);
    expect(withWordings.sort(), 'the shipped variants carrying faces').toEqual(FACED_TODAY);
    expect(SHIPPED_POOLS.length, 'and the sweep found the corpus').toBeGreaterThanOrEqual(700);
    const spy = vi.spyOn(Math, 'imul');
    let faces = 0;
    let nonZero = 0;
    let hashedRows = 0;
    try {
      for (const row of SHIPPED_POOLS) {
        for (let at = 0; at < row.pool.length; at += 1) {
          const variant = row.pool[at];
          faces += 1;
          const faced = Array.isArray(variant.wordings);
          if (faced) hashedRows += 1;
          const before = spy.mock.calls.length;
          const drawn = drawFace(variant, row.blockId, row.poolKey, 'corpus-probe');
          const hashed = spy.mock.calls.length > before;
          if (!faced) {
            if (drawn !== 0) nonZero += 1;
            expect(hashed, `${row.blockId} :: ${row.poolKey} #${at} took the hash with one face`).toBe(false);
            continue;
          }
          // THE ONE POOL THAT CAN HASH. With NO roster the read is the stranger alone
          // (floor 1 fail-closed), so a variant whose faces are all seated — #0 and #2 —
          // still short-circuits on one eligible face; #1 carries the universal `stranger`
          // and folds. The hash is taken exactly when the eligible list has more than one
          // member, and never otherwise: that equality IS the arm.
          expect(hashed, `${row.blockId} :: ${row.poolKey} #${at} on no roster`)
            .toBe(eligibleFaces(variant, undefined).length > 1);
          // And on the full roster all four faces are eligible, so the fold must run and
          // the draw must land inside the list. This is what proves the spy is awake.
          const rostered = spy.mock.calls.length;
          const full = drawFace(variant, row.blockId, row.poolKey, 'corpus-probe', new Set(FACE_SOURCES));
          expect(spy.mock.calls.length > rostered, `${row.blockId} #${at} did NOT fold on the full roster`).toBe(true);
          expect(full).toBeGreaterThanOrEqual(0);
          expect(full).toBeLessThanOrEqual(variant.wordings.length);
        }
      }
      expect(nonZero, 'every shipped variant with ONE face draws face 0').toBe(0);
      // ⭐ RE-PINNED AT THE 8b DS-DEF-2 DRAFT GATE (v3): twelve, not three — the block's four
      // faced pools, three variants each. A GROW, and the ratchet that reds on a FALL is the
      // shift register's `face-count-per-variant` row, not this line.
      // ⭐⭐ RE-PINNED AGAIN AT THE DRAFT GATE'S THIRD SITTING: forty-two, not twenty-seven — five
      // more of the block's pools landed faces in one commit, three variants each. A GROW.
      expect(hashedRows, 'and exactly forty-five variants ship more than one face').toBe(45);
    } finally {
      spy.mockRestore();
    }
    expect(faces, 'the variant count the sweep actually walked').toBeGreaterThanOrEqual(2266);
  });

  it('⭐ A FOUR-FACE VARIANT IS UNIFORM: 25 % per face within 2 SE over 10,000 seeds', () => {
    // The distribution matters because a face draw that is not uniform is a rewrite wave
    // whose three new surfaces are read by a quarter of the towns the fourth is. The seeds
    // are FIXED, so this is a deterministic pin rather than a sample: it either holds at
    // this spelling forever or it never held.
    const N = 10000;
    const counts = [0, 0, 0, 0];
    for (let i = 0; i < N; i += 1) {
      counts[drawFace(FOUR_FACE, 'DS-DEF-11', 'UNWALLED-SMALL', `seed-${i}`)] += 1;
    }
    const se = Math.sqrt(0.25 * 0.75 / N);
    const deviations = counts.map((count) => Math.abs(count / N - 0.25) / se);
    process.stdout.write(`\n[drawFace] 10,000 seeds over four faces: ${counts.join(' / ')}`
      + ` · worst deviation ${Math.max(...deviations).toFixed(3)} SE\n`);
    expect(counts.reduce((a, b) => a + b, 0), 'every draw landed on a face').toBe(N);
    expect(counts.filter((count) => Math.abs(count / N - 0.25) > 2 * se), 'a face outside 2 SE')
      .toEqual([]);
    // AND THE NEGATIVE THE BAND WOULD OTHERWISE HIDE: a pin at 2 SE passes a distribution
    // that is merely close, so the arm also refuses a face nothing ever draws.
    expect(counts.filter((count) => count === 0), 'an unreachable face').toEqual([]);
  });

  it('⭐ THE KEY IS THE VARIANT KEY PLUS `::w`, and `::wording` is a different world', () => {
    // P-F10's nit, made executable. `draw-reroll.mjs` measured the two-level roll with the
    // suffix spelled `::wording`; the shipped suffix is `::w`, and a script that spells it
    // differently measures a corpus nobody ships.
    const seed = 'ashford-7';
    const expected = referenceHash(`${seed}::DS-DEF-11::UNWALLED-SMALL::w`) % 4;
    expect(drawFace(FOUR_FACE, 'DS-DEF-11', 'UNWALLED-SMALL', seed), 'the `::w` suffix')
      .toBe(expected);
    const other = referenceHash(`${seed}::DS-DEF-11::UNWALLED-SMALL::wording`) % 4;
    expect(other, 'and the two spellings really do disagree on this key').not.toBe(expected);
    // A SUFFIX, so the PARENT key is untouched and appending faces cannot re-roll the
    // variant draw. Driven on the kernel's own draw rather than asserted about it.
    const pool = [{ text: 'one' }, { text: 'two' }, { text: 'three' }];
    const faced = pool.map((v) => ({ ...v, wordings: ['x', 'y', 'z'] }));
    expect(drawVariant(faced, 'DS-DEF-11', 'UNWALLED-SMALL', seed).text,
      'the same variant before and after faces are added')
      .toBe(drawVariant(pool, 'DS-DEF-11', 'UNWALLED-SMALL', seed).text);
  });

  it('SEEDLESS IS CANONICAL-AT-ZERO at the face level too (law 4)', () => {
    // `galleryImportSettlement.js:76` sets `_seed: undefined` on an imported town, so the
    // desks reach the kernel with no seed. All three spellings of "no seed" read face 0.
    expect(drawFace(FOUR_FACE, 'B', 'P', ''), 'the empty string').toBe(0);
    expect(drawFace(FOUR_FACE, 'B', 'P', null), 'null, as the import leaves it').toBe(0);
    expect(drawFace(FOUR_FACE, 'B', 'P', undefined), 'undefined').toBe(0);
    const spy = vi.spyOn(Math, 'imul');
    try {
      drawFace(FOUR_FACE, 'B', 'P', '');
      expect(spy.mock.calls.length, 'and a seedless face takes no hash either').toBe(0);
    } finally {
      spy.mockRestore();
    }
  });

  it('reads a malformed `wordings` as ONE face rather than throwing on it', () => {
    // A display path: a blank surface beats a crashed one, and the projector is what refuses
    // a malformed face list. Every one of these is one face, so every one draws 0.
    expect(drawFace({ text: 'a', wordings: 'not a list' }, 'B', 'P', 's')).toBe(0);
    expect(drawFace({ text: 'a', wordings: [] }, 'B', 'P', 's')).toBe(0);
    expect(drawFace(null, 'B', 'P', 's'), 'and a missing variant is one face, not a throw')
      .toBe(0);
    expect(drawFace(undefined, 'B', 'P', 's')).toBe(0);
    // TWO faces is a real modulus, so the family is not simply "always 0".
    const two = { text: 'a', wordings: ['b'] };
    const drawn = new Set(Array.from({ length: 64 }, (_, i) => drawFace(two, 'B', 'P', `t${i}`)));
    expect([...drawn].sort(), 'a two-face variant reaches both faces').toEqual([0, 1]);
  });

  it('the key digest is the kernel\'s ONE pair, and the composer mints no second fold', () => {
    // ARCH §2.4: every key the composed model mints uses this pair. `hashKey` is the export
    // that makes that possible without a twenty-third `fnv1a32` in the tree
    // (tests/lint/fnv1a32Identity.walker.test.js holds the count SHRINK-ONLY).
    expect(hashKey('a'), 'against an independently spelled fold').toBe(referenceHash('a'));
    expect(hashKey(`s::B::P::w`)).toBe(referenceHash('s::B::P::w'));
    expect(hashKey(''), 'the empty key is still a digest').toBe(referenceHash(''));
    // And it is the pair the DRAW uses, proven through `drawVariant` rather than restated.
    // Law 6 changed WHAT the draw does with the digest (an argmax over per-variant keys,
    // not a modulus over the parent key) and changed NOTHING about which digest it is, so
    // this arm now re-spells the argmax against the independent fold. A pool with no `vid`
    // still takes the modulus, and that limb is spelled out too: both branches of the draw
    // are held against `referenceHash`, or a second fold could enter through the one this
    // arm stopped looking at.
    const idless = Array.from({ length: 7 }, (_, i) => ({ text: `v${i}` }));
    expect(drawVariant(idless, 'B', 'P', 'sx').text, 'the fallback limb: a modulus')
      .toBe(idless[referenceHash('sx::B::P') % 7].text);
    const withIds = Array.from({ length: 7 }, (_, i) => ({ text: `v${i}`, vid: i + 1 }));
    const winner = withIds.reduce((best, variant) => (
      referenceHash(`sx::B::P::v${variant.vid}`) > referenceHash(`sx::B::P::v${best.vid}`)
        ? variant : best));
    expect(drawVariant(withIds, 'B', 'P', 'sx').text, 'the law-6 limb: an argmax')
      .toBe(winner.text);
  });
});

/**
 * LAW 6 — THE INDEX-STABLE DRAW (ARCH §13 row 22; SIGNED at SITTING §N.2; REWRITE car 8a-1).
 *
 * The draw moved from `hash(seed::block::pool) % eligible.length` to the ARGMAX of
 * `hash(seed::block::pool::v<vid>)` over the eligible set. Three properties decide whether
 * that was worth a one-time re-index, and all three are measured here rather than quoted:
 *
 *   UNIFORMITY     the new draw must still spread a pool's reads evenly, or the rewrite
 *                  wave's later wordings are read by fewer towns than its earlier ones.
 *   APPEND-SAFETY  the reason the change exists. Appending a fourth wording must move about
 *                  a QUARTER of the pool's reads, and every read that moves must move TO
 *                  the new wording. The shipped modulus is measured beside it in the same
 *                  arm, because "about a quarter" means nothing without the "about three
 *                  quarters" it replaced.
 *   IDENTITY       the same call twice is the same variant (A4), which is THE PROMISE at
 *                  the level this function owns.
 *
 * And one arm that is not a property of the draw at all but of the CORPUS: the shipped
 * state leaves must never reach the modulus fallback, or a leaf that lost its `vid`s would
 * quietly revert to the unstable draw and no reader would see it happen.
 */
describe('the state-prose reader — law 6, the index-stable draw', () => {
  /** The six state leaves, whole, read live. */
  const STATE_POOLS = [
    ['economy', DOSSIER_STATE_PROSE_ECONOMY], ['power', DOSSIER_STATE_PROSE_POWER],
    ['defense', DOSSIER_STATE_PROSE_DEFENSE], ['warFaith', DOSSIER_STATE_PROSE_WAR_FAITH],
    ['stressors', DOSSIER_STATE_PROSE_STRESSORS], ['general', DOSSIER_STATE_PROSE_GENERAL],
  ].flatMap(([desk, corpus]) => Object.entries(corpus)
    .flatMap(([blockId, block]) => Object.entries(block.pools)
      .map(([poolKey, pool]) => ({ desk, blockId, poolKey, pool }))));

  /** 10,000 fixed seeds: a deterministic pin, never a sample that can drift run to run. */
  const SEEDS = Object.freeze(Array.from({ length: 10_000 }, (_, i) => `uniformity-seed-${i}`));

  /**
   * The SHIPPED draw as it stood at 29ec62425, re-spelled so the append-safety arm can
   * measure the old world and the new one in the same run. A contrast quoted from a
   * receipt is a contrast nobody can re-derive.
   * @param {ReadonlyArray<object>} eligible
   * @param {string} blockId @param {string} poolKey @param {string} seed
   * @returns {object}
   */
  function modulusDraw(eligible, blockId, poolKey, seed) {
    return eligible[referenceHash(`${seed}::${blockId}::${poolKey}`) % eligible.length];
  }

  it('⭐ THE SHIPPED STATE CORPUS NEVER REACHES THE MODULUS FALLBACK', () => {
    // The fallback exists for the causal register, which carries no `vid` on any variant
    // (§13 row 14: a reader, no caller). It must never be the state corpus's branch: a leaf
    // that lost its ids would revert to the unstable draw silently, and the whole value of
    // row 22 would leak away one regeneration at a time. Measured on the live leaves.
    const idless = STATE_POOLS.flatMap(({ desk, blockId, poolKey, pool }) => pool
      .map((variant, at) => ({ at, vid: variant.vid }))
      .filter((row) => !Number.isInteger(row.vid) || row.vid < 0)
      .map((row) => `${desk} :: ${blockId} :: ${poolKey} #${row.at} vid=${String(row.vid)}`));
    expect(idless.slice(0, 5), 'a shipped state variant with no stable id').toEqual([]);
    // ⛔ AND THE INVARIANT THE ARGMAX ACTUALLY RESTS ON: within one pool the ids are
    // DISTINCT. Two variants sharing an id share a draw key, so the pool's reads would
    // collapse onto whichever the tie rule happened to keep and the other would become
    // unreachable prose. The projector's `vids` digest pins the values; this pins the
    // property that makes them usable as a key.
    const collisions = STATE_POOLS
      .filter(({ pool }) => new Set(pool.map((v) => v.vid)).size !== pool.length)
      .map(({ desk, blockId, poolKey }) => `${desk} :: ${blockId} :: ${poolKey}`);
    expect(collisions.slice(0, 5), 'two variants of one pool sharing an id').toEqual([]);
    // Non-vacuity on both axes: the sweep found the corpus ARCH counts, and the ids it
    // found are the annex row numbers rather than a constant somebody defaulted in.
    const variants = STATE_POOLS.reduce((sum, row) => sum + row.pool.length, 0);
    expect(STATE_POOLS.length, 'the pools swept').toBeGreaterThanOrEqual(708);
    expect(variants, 'the variants swept').toBeGreaterThanOrEqual(2266);
    // The ids are the ANNEX ROW NUMBERS: contiguous from the pool's first row, in order.
    // 701 pools number from 1; the seven that lead with a `canonical` row number from 0,
    // and naming them here is what stops a later reader "tidying" the zero away.
    const misNumbered = STATE_POOLS
      .filter(({ pool }) => pool.some((v, at) => v.vid !== pool[0].vid + at))
      .map(({ desk, blockId, poolKey }) => `${desk} :: ${blockId} :: ${poolKey}`);
    expect(misNumbered.slice(0, 5), 'a pool whose ids are not its annex rows').toEqual([]);
    const zeroLed = STATE_POOLS.filter(({ pool }) => pool[0].vid === 0)
      .map(({ blockId, poolKey }) => `${blockId} :: ${poolKey}`);
    expect(zeroLed.sort(), 'the seven canonical-led pools, named').toEqual([
      'DS-ECO-3 :: ADEQUATE',
      'DS-ECO-3 :: SHORTAGE × trade-dependent',
      'DS-ECO-3 :: SURPLUS × trade-dependent',
      'DS-ECO-6 :: TIER: minor shadow activity (≥3)',
      'DS-ECO-6 :: TIER: significant off-book activity (≥15)',
      'DS-ECO-7 :: CATALOG',
      'DS-ECO-7 :: TALLIES',
    ]);
  });

  it('⭐⭐ THE GUARD ITSELF: `stableVid` READS vid 0 AS A REAL ID, and the draw proves it', () => {
    // ⛔ WHY THIS ARM EXISTS, and it is the skeptic's finding rather than a tidy-up (SITTING
    // §U c-4, fold NEW-1). The sweep above names the seven canonical-led pools, but it
    // RE-DERIVES the id-less predicate over the leaves — `!Number.isInteger(vid) || vid < 0`
    // spelled a second time — so it pins the CORPUS and is blind to the KERNEL. Measured by
    // the skeptic: with `|| vid <= 0` planted in `stableVid`, this file read 37 passed and
    // the projection contract read 77 passed while seven shipped pools silently reverted to
    // the modulus draw. Between car 8a-1 and the REWRITE's freeze act there was no green
    // instrument standing over the corpus's only draw-regime split. This is that instrument:
    // it calls the kernel's own predicate, so a guard that moves cannot pass.
    expect(stableVid({ vid: 0 }), '⛔ vid 0 is a REAL id: a `> 0` guard splits the corpus')
      .toBe(0);
    expect(stableVid({ vid: 1 }), 'and an ordinary id is itself').toBe(1);
    expect(stableVid({ vid: 6 }), 'and the deepest id the corpus carries').toBe(6);
    // The other side, so the predicate is not merely permissive: everything that is NOT an
    // annex row number reads as ABSENT and takes the fallback.
    const notAnId = [undefined, null, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, '0', '2', true];
    expect(notAnId.filter((vid) => stableVid({ vid }) !== null), 'a non-id read as an id')
      .toEqual([]);
    expect(stableVid(null), 'and no variant at all is no id').toBeNull();
    expect(stableVid(undefined)).toBeNull();

    // ⭐ AND THE DRAW, on a synthetic pool numbered from ZERO exactly as the seven are. The
    // argmax and the modulus are different functions, so on a pool the guard admits they
    // DISAGREE on most seeds; on a pool the guard rejects they agree on every seed by
    // construction, because the argmax branch is never entered. That contrast is what makes
    // this arm sensitive to the guard rather than to the corpus.
    const zeroLed = Object.freeze([0, 1, 2, 3].map((vid) => Object.freeze({
      vid, text: `synthetic wording ${vid}`, angle: vid === 0 ? 'canonical' : 'authored',
    })));
    const SYN_SEEDS = Array.from({ length: 400 }, (_, i) => `vid-zero-${i}`);
    let differ = 0;
    let zeroWins = 0;
    for (const seed of SYN_SEEDS) {
      const drawn = drawVariant(zeroLed, 'DS-SYN-0', 'zero-led', seed);
      if (drawn !== modulusDraw(zeroLed, 'DS-SYN-0', 'zero-led', seed)) differ += 1;
      if (drawn.vid === 0) zeroWins += 1;
    }
    // MEASURED at this tip: 299 of 400 seeds disagree with the modulus, and vid 0 takes 104
    // of the 400 draws (a quarter, which is the uniformity the argmax owes a four-row pool;
    // the modulus takes it on 110, and those two numbers being close is the point — the
    // COUNTS look alike, the per-seed answers do not, which is why this arm is per-seed).
    // Under the `vid <= 0` plant BOTH collapse: the pool takes the fallback on every seed, so
    // `differ` is 0 and this line reds by name.
    expect(differ, '⛔ THE PLANT: a zero-led pool that agrees with the modulus on EVERY seed'
      + ' means the guard read its id as absent').toBe(299);
    expect(zeroWins, 'and vid 0 is drawn like any other row, not skipped').toBe(104);
    // The seven shipped zero-led pools are the same shape, and their draw is asserted to be
    // the argmax's rather than the fallback's — read off the live leaves, not the synthetic.
    const shippedZeroLed = STATE_POOLS.filter(({ pool }) => pool[0].vid === 0);
    expect(shippedZeroLed.length, 'the seven canonical-led pools').toBe(7);
    const fellBack = shippedZeroLed.filter(({ pool }) => pool.every((v) => stableVid(v) === null));
    expect(fellBack, 'a shipped zero-led pool the kernel reads as id-less').toEqual([]);
  });

  it('⭐ THE CAUSAL REGISTER STILL TAKES THE MODULUS, so this car moved none of its reads', () => {
    // The other side of the same coin, and the reason this car can claim ZERO moved reads
    // outside the state corpus. R2 carries no ids, so `drawVariant` must agree with the
    // pre-cure draw on it, seed for seed, over every family and arm.
    const drift = [];
    let draws = 0;
    for (const [familyId, family] of Object.entries(DOSSIER_CAUSAL_PROSE)) {
      for (const [poolKey, pool] of Object.entries(family.pools || {})) {
        if (!Array.isArray(pool) || pool.length === 0) continue;
        for (const seed of ['a', 'world-7', 'zz', 'wizard_news.4.applied.evt4']) {
          draws += 1;
          if (drawVariant(pool, familyId, poolKey, seed)
            !== modulusDraw(pool, familyId, poolKey, seed)) {
            drift.push(`${familyId} :: ${poolKey} :: seed "${seed}"`);
          }
        }
      }
    }
    expect(drift).toEqual([]);
    expect(draws, 'and the sweep found the register').toBeGreaterThanOrEqual(4 * 78);
  });

  it('⭐ UNIFORM ON THE THREE-VARIANT CORPUS: chi-square 4.20 on 5,470,000 reads', () => {
    // §N.2's reference figures are 33.30 / 33.35 / 33.35 per cent, POOLED over the corpus.
    // MEASURED here at this tip over 547 three-variant pools x 10,000 fixed seeds:
    // 33.312 / 33.375 / 33.313 per cent, deepest departure from one third 0.0413 pp,
    // chi-square 4.201 on 2 degrees of freedom.
    //
    // ⛔ TWO FLOORS THIS ARM REFUSES TO USE, both of which car 8a's brief asked for and
    // both of which a PERFECTLY UNIFORM draw fails about as often as it passes.
    //
    //   "every pool within 2 SE" — 547 pools is 1,641 share measurements, and the largest
    //   of 1,641 standard normal deviations is about 3.4 SE by construction. Measured:
    //   3.43 SE, at economy :: DS-ECO-11 :: TERRAIN: Forest. Passing that floor would mean
    //   the draw was suspiciously FLAT, which is a different defect, not a healthy one.
    //
    //   "the pooled share within 2 SE" — at n = 5,470,000 the 2 SE band is 0.081 pp wide
    //   and there are three shares in it, so a uniform draw lands outside about one time
    //   in seven. It did, on the first run of this arm: 33.375 per cent against a band
    //   ending at 33.374.
    //
    // What replaces them is the textbook test the two were reaching for — a chi-square
    // goodness-of-fit at the pooled grain, held at the 0.001 critical value — plus an
    // absolute tolerance in percentage points, which is the thing a reader actually cares
    // about, and a per-pool ceiling loose enough to be a uniform draw's tail and far
    // tighter than any real bias: a draw favouring low ids reads TENS of SE out.
    const CHI2_CRITICAL_DF2_P001 = 13.816;
    const pools = STATE_POOLS.filter((row) => row.pool.length === 3);
    // Tallied by the pool's own SLOT, not by the id value, so that the seven pools whose
    // annex rows run 0..2 pool with the 540 whose rows run 1..3 instead of splitting the
    // three cells into five.
    const tally = [0, 0, 0];
    const perPoolSE = Math.sqrt((1 / 3) * (2 / 3) / SEEDS.length) * 100;
    let maxZ = 0;
    let maxAt = '';
    for (const { desk, blockId, poolKey, pool } of pools) {
      const local = [0, 0, 0];
      for (const seed of SEEDS) {
        const at = pool.indexOf(drawVariant(pool, blockId, poolKey, seed));
        local[at] += 1;
        tally[at] += 1;
      }
      for (let at = 0; at < 3; at += 1) {
        const z = Math.abs((local[at] / SEEDS.length) * 100 - 100 / 3) / perPoolSE;
        if (z > maxZ) { maxZ = z; maxAt = `${desk} :: ${blockId} :: ${poolKey} slot ${at}`; }
      }
    }
    const reads = pools.length * SEEDS.length;
    const expected = reads / 3;
    const chi2 = tally.reduce((sum, seen) => sum + ((seen - expected) ** 2) / expected, 0);
    const deepest = Math.max(...tally.map((seen) => Math.abs((seen / reads) * 100 - 100 / 3)));
    expect(chi2, `the pooled goodness of fit over ${reads} reads`)
      .toBeLessThan(CHI2_CRITICAL_DF2_P001);
    expect(deepest, 'the deepest pooled departure from one third, in points').toBeLessThan(0.15);
    expect(maxZ, `the deepest per-pool deviation, at ${maxAt}`).toBeLessThan(4.5);
    // Non-vacuity on both axes: the sweep found the corpus, and it reached every slot.
    expect(pools.length, 'three-variant pools swept').toBeGreaterThanOrEqual(500);
    expect(tally.filter((seen) => seen === 0), 'an unreachable slot').toEqual([]);
  });

  it('⭐ APPEND-SAFE: a fourth wording moves about a QUARTER, and every mover moves TO it', () => {
    // THE ROW'S GROUND, and the reason the modulus is measured in the same loop. On the
    // shipped `% length` draw an appended wording re-rolls about three quarters of a pool's
    // reads and most movers land on a DIFFERENT OLD wording, which reads to a player as the
    // sentence they had being rewritten. Under law 6 a mover can only land on the newcomer.
    // 2,000 of the 10,000 seeds: 547 pools x 2,000 seeds x 4 draws is already 4.4 million
    // draws, and the property below is exact rather than statistical, so more seeds buy
    // wall-clock rather than confidence.
    const APPEND_SEEDS = SEEDS.slice(0, 2000);
    const pools = STATE_POOLS.filter((row) => row.pool.length === 3);
    let stableMoved = 0;
    let stableToNew = 0;
    let modulusMoved = 0;
    let modulusToNew = 0;
    let reads = 0;
    const betweenOld = [];
    for (const { desk, blockId, poolKey, pool } of pools) {
      // A LAWFUL APPEND: the NEXT annex row, which is 4 on the 540 pools numbered 1..3 and
      // 3 on the seven numbered 0..2. Planting a fixed 4 everywhere would leave a hole in
      // the seven and measure a corpus the annex idiom forbids.
      const nextVid = pool[pool.length - 1].vid + 1;
      const planted = {
        angle: 'ledger', text: 'the planted fourth wording', slots: [], vid: nextVid,
      };
      const grown = [...pool, planted];
      for (const seed of APPEND_SEEDS) {
        reads += 1;
        const wasStable = drawVariant(pool, blockId, poolKey, seed);
        const nowStable = drawVariant(grown, blockId, poolKey, seed);
        if (wasStable !== nowStable) {
          stableMoved += 1;
          if (nowStable === planted) stableToNew += 1;
          else betweenOld.push(`${desk} :: ${blockId} :: ${poolKey} :: v${wasStable.vid} -> v${nowStable.vid}`);
        }
        const wasMod = modulusDraw(pool, blockId, poolKey, seed);
        const nowMod = modulusDraw(grown, blockId, poolKey, seed);
        if (wasMod !== nowMod) {
          modulusMoved += 1;
          if (nowMod === planted) modulusToNew += 1;
        }
      }
    }
    // ⛔ THE PROPERTY, not the percentage: NOT ONE read moves between two old wordings.
    expect(betweenOld.slice(0, 5), 'a read that moved between two OLD wordings').toEqual([]);
    expect(stableMoved, 'and every mover moved to the new wording').toBe(stableToNew);
    const stableShare = (stableMoved / reads) * 100;
    const modulusShare = (modulusMoved / reads) * 100;
    const modulusToNewShare = (modulusToNew / modulusMoved) * 100;
    // About a quarter: 1/(n+1) at n = 3 is 25 %. MEASURED at this tip over 1,094,000
    // reads: law 6 moves 25.01 %, all 273,643 of them to the new wording, none between two
    // old ones. The band is generous because it is a property of the hash rather than a
    // tuned constant.
    expect(stableShare).toBeGreaterThan(23);
    expect(stableShare).toBeLessThan(27);
    // And the contrast the row rests on, MEASURED in the same loop: the modulus moves
    // 74.99 % of the reads, and only 33.33 % of THOSE land on the newcomer, so 546,952
    // reads move between two old wordings that this car's draw leaves alone. Both halves
    // pinned, or "about a quarter" is a number with nothing to be better than.
    expect(modulusShare).toBeGreaterThan(70);
    expect(modulusShare).toBeLessThan(80);
    expect(modulusToNewShare).toBeLessThan(40);
    expect(reads, 'the reads measured').toBeGreaterThanOrEqual(500 * APPEND_SEEDS.length);
  });

  it('⭐ A4 — the same call twice is the same variant, and the audience filter cannot move it', () => {
    // THE PROMISE at the level this function owns. The second half is the point of keying
    // on `vid` rather than on a position: dropping a `dm-only` variant from the front of a
    // pool shifts every later INDEX, and under the modulus that alone re-rolls the read.
    const pool = [
      { angle: 'ledger', text: 'one', slots: [], vid: 1 },
      { angle: 'street', text: 'two', slots: [], vid: 2 },
      { angle: 'visitor', text: 'three', slots: [], vid: 3 },
    ];
    expectNoSeedFailures(collectSeedFailures(['a', 'world-7', 'zz'], (seed) => {
      const first = drawVariant(pool, 'DS-X-1', 'P', seed);
      expect(drawVariant(pool, 'DS-X-1', 'P', seed), 'repeat-call identity').toBe(first);
    }), 'the same call twice draws the same variant');
    // The filter arm: the SAME three variants reached through a pool that also holds a
    // covert one draw the same sentence, because the key never mentions a position.
    const withCovert = [
      { angle: 'ledger', text: 'covert', slots: [], vid: 4, marks: ['dm-only'] },
      ...pool,
    ];
    const drift = [];
    for (let i = 0; i < 400; i++) {
      const seed = `filter-${i}`;
      const plain = drawVariant(pool, 'DS-X-1', 'P', seed);
      const filtered = drawVariant(
        eligibleVariants(withCovert, { slots: {}, audience: AUDIENCE_PLAYER }),
        'DS-X-1', 'P', seed,
      );
      if (plain.vid !== filtered.vid) drift.push(`seed "${seed}": v${plain.vid} vs v${filtered.vid}`);
    }
    expect(drift.slice(0, 5), 'a covert sibling moved a player read').toEqual([]);
  });

  it('⭐ SEEDLESS IS STILL CANONICAL-AT-ZERO, and takes no argmax (law 4 survives law 6)', () => {
    const pool = [
      { angle: 'ledger', text: 'one', slots: [], vid: 1 },
      { angle: 'street', text: 'two', slots: [], vid: 2 },
    ];
    expectNoSeedFailures(collectSeedFailures(['', null, undefined], (seedless) => {
      expect(drawVariant(pool, 'B', 'P', seedless).text, 'index 0 of the eligible list')
        .toBe('one');
    }), 'all three spellings of no seed read index 0');
    const spy = vi.spyOn(Math, 'imul');
    try {
      drawVariant(pool, 'B', 'P', '');
      expect(spy.mock.calls.length, 'and a seedless draw takes no hash at all').toBe(0);
      drawVariant(pool, 'B', 'P', 's');
      expect(spy.mock.calls.length, 'while the same witness sees the argmax run')
        .toBeGreaterThan(0);
    } finally {
      spy.mockRestore();
    }
  });

  it('⭐ A FACT NEVER MOVES: the drawn variant is a member of the same eligible set as before', () => {
    // The car's own fence. Law 6 chooses differently INSIDE a set it does not touch, so on
    // every shipped state pool and every seed the newly drawn variant must be one the
    // shipped draw could also have returned. Proven as set membership rather than argued.
    const escapes = [];
    let checks = 0;
    for (const { desk, blockId, poolKey, pool } of STATE_POOLS) {
      const members = new Set(pool);
      for (const seed of ['a', 'b', 'world-7', 'Thornwall::1', 'zz', '19']) {
        checks += 1;
        const drawn = drawVariant(pool, blockId, poolKey, seed);
        if (!members.has(drawn)) escapes.push(`${desk} :: ${blockId} :: ${poolKey} :: "${seed}"`);
      }
    }
    expect(escapes).toEqual([]);
    expect(checks, 'the draws checked').toBeGreaterThanOrEqual(708 * 6);
  });
});

/**
 * ── ONE FACE PER POWER — THE SOURCE FILTER ON THE FACE DRAW AND THE PAIR (ADDENDUM 18
 * ruling 15, the owner's 2026-09-13 refinement on pair KINDS; REWRITE car 8b-W-18c) ──────
 *
 * `drawFace` now runs over the faces whose SOURCE resolves on this town. Four properties are
 * measured here rather than quoted:
 *   IDENTITY      a roster admitting every face draws exactly the shipped modulus, and a
 *                 variant with no sourced face draws exactly as before whatever the roster —
 *                 the zero-shift argument for the corpus that ships, executed.
 *   FILTER        a face whose source is absent is never drawn, over many seeds.
 *   FALLBACK      no eligible face falls back to the full set; no roster reads as the
 *                 stranger alone.
 *   STABILITY     the same seed and the same eligible set is the same face, always.
 * And the PAIR: the partner is the other eligible face carrying the same id, or nothing.
 */
describe('the state-prose reader — ONE FACE PER POWER: the source filter and the pair (car 8b-W-18c)', () => {
  /** A four-face variant, one face per power: the spine (stranger), the hall, the tavern, a bare face. */
  const POWERED = Object.freeze({
    text: 'The walls stand.',
    angle: 'ledger',
    wordings: Object.freeze(['The hall has it kept.', 'The tavern says nobody stands on it.', 'Anyone can see it.']),
    sources: Object.freeze([null, 'hall', 'tavern', null]),
    pairs: Object.freeze([null, Object.freeze({ id: 1, kind: 'disagree' }), Object.freeze({ id: 1, kind: 'disagree' }), null]),
  });
  /** The same faces with NO source list — the shape every shipped variant has. */
  const UNSOURCED = Object.freeze({ text: POWERED.text, angle: 'ledger', wordings: POWERED.wordings });
  const SEEDS = Array.from({ length: 400 }, (_, i) => `power-seed-${i}`);
  /** The six state leaves, whole and live — the ground of the zero-shift arm below. */
  const LIVE_POOLS = [
    DOSSIER_STATE_PROSE_ECONOMY, DOSSIER_STATE_PROSE_POWER, DOSSIER_STATE_PROSE_DEFENSE,
    DOSSIER_STATE_PROSE_WAR_FAITH, DOSSIER_STATE_PROSE_STRESSORS, DOSSIER_STATE_PROSE_GENERAL,
  ].flatMap((corpus) => Object.entries(corpus)
    .flatMap(([blockId, block]) => Object.entries(block.pools)
      .map(([poolKey, pool]) => ({ blockId, poolKey, pool }))));

  it('the vocabulary is closed, frozen, and the universal source is in it', () => {
    expect(Object.isFrozen(FACE_SOURCES)).toBe(true);
    expect(FACE_SOURCES).toEqual([
      'stranger', 'elders', 'hall', 'tavern', 'guild', 'register',
      'muster', 'watch', 'garrison', 'gate', 'market', 'court',
      // ⭐ THE THIRTEENTH WORD IS A POWER OF NOBODY (ADDENDUM 18 ruling 28; car 8b-W-18n). The
      // town's people as a whole, owed to no power and backed by no row — so it is seated by
      // NOTHING, which is why it is seated EVERYWHERE, exactly as the stranger is.
      'public',
      // ⭐ THE FOURTEENTH WORD IS NOT A POWER (ADDENDUM 18 ruling 22; car 8b-W-18i). It is in
      // the list because a `[face]` tag may carry it and for no other reason — it seats on no
      // town, and the arms below prove it never draws, unless it is marked `observed`
      // (ruling 27; car 8b-W-18n), which is the one archiver row that stands alone.
      'archiver',
    ]);
    expect(UNIVERSAL_SOURCE).toBe('stranger');
    expect(FACE_SOURCES).toContain(UNIVERSAL_SOURCE);
    expect(ARCHIVER_SOURCE).toBe('archiver');
    expect(FACE_SOURCES).toContain(ARCHIVER_SOURCE);
    expect(ARCHIVER_SOURCE, 'the archiver is not the universal source').not.toBe(UNIVERSAL_SOURCE);
    expect(Object.isFrozen(PAIR_KINDS)).toBe(true);
    expect(PAIR_KINDS).toEqual(['disagree', 'reinforce', 'aside', 'view', 'weigh']);
    expect(WEIGH_KIND).toBe('weigh');
    expect(PAIR_KINDS).toContain(WEIGH_KIND);
    expect(Object.isFrozen(WEIGHABLE_KINDS)).toBe(true);
    expect(WEIGHABLE_KINDS, 'an aside and a view leave nothing to weigh').toEqual(['disagree', 'reinforce']);
    for (const kind of WEIGHABLE_KINDS) expect(PAIR_KINDS).toContain(kind);
  });

  it('⭐ THE JOINTS ARE CLOSED, THE FULL STOP IS IN EVERY LIST, AND NO LIST CARRIES A SEMICOLON (ruling 23; car 8b-W-18i)', () => {
    expect(Object.isFrozen(PAIR_JOINTS)).toBe(true);
    expect(Object.keys(PAIR_JOINTS).sort(), 'one list per kind, no kind without one')
      .toEqual([...PAIR_KINDS].sort());
    expect(PAIR_JOINTS.disagree).toEqual([', though ', ', but ', ', while ', ', and yet ', '. ']);
    expect(PAIR_JOINTS.reinforce).toEqual([', and ', ', as ', '. ']);
    expect(PAIR_JOINTS.aside).toEqual(['. ']);
    expect(PAIR_JOINTS.view).toEqual(['. ']);
    expect(PAIR_JOINTS.weigh).toEqual(['. ']);
    expect(FULL_STOP_JOINT).toBe('. ');
    for (const [kind, list] of Object.entries(PAIR_JOINTS)) {
      expect(Object.isFrozen(list), kind).toBe(true);
      // ⛔ THE RULING'S OWN BAR: "Never a semicolon." And §0d's: no em dash, no bang, no digit.
      expect(list.filter((j) => /[;—!\d]/.test(j)), `${kind} carries a barred mark`).toEqual([]);
      expect(list, `${kind} can always take the stop`).toContain(FULL_STOP_JOINT);
      // THE STOP IS LAST, so appending a compound joint never moves the stop's own index.
      expect(list[list.length - 1], `${kind} keeps the stop last`).toBe(FULL_STOP_JOINT);
    }
  });

  it('⭐ THE JOINT DRAW: seeded, on a key of its own, canonical-at-zero, and every joint reachable (ruling 23)', () => {
    // A one-joint list takes no hash at all, which is `aside`, `view` and `weigh`.
    for (const kind of ['aside', 'view', 'weigh']) {
      for (const seed of SEEDS) expect(pairJoint(kind, 'B', 'P', seed), kind).toBe(FULL_STOP_JOINT);
    }
    // ⛔ AN UNKNOWN KIND FAILS CLOSED ONTO THE STOP — the arrangement the corpus already had.
    expect(pairJoint('quarrel', 'B', 'P', 'seed-x')).toBe(FULL_STOP_JOINT);
    expect(pairJoint('', 'B', 'P', 'seed-x')).toBe(FULL_STOP_JOINT);
    // CANONICAL-AT-ZERO (kernel law 4): no seed reads index 0, the kind's first compound form.
    expect(pairJoint('disagree', 'B', 'P', '')).toBe(', though ');
    expect(pairJoint('reinforce', 'B', 'P', '')).toBe(', and ');
    // EVERY JOINT IS REACHABLE, and the same seed always draws the same one.
    for (const kind of ['disagree', 'reinforce']) {
      const drawn = new Set();
      for (let i = 0; i < 400; i += 1) drawn.add(pairJoint(kind, 'DS-DEF-2', 'walls', `seed-${i}`));
      expect([...drawn].sort(), `${kind} reaches its whole list`).toEqual([...PAIR_JOINTS[kind]].sort());
    }
    for (const seed of SEEDS) {
      expect(pairJoint('disagree', 'B', 'P', seed)).toBe(pairJoint('disagree', 'B', 'P', seed));
    }
    // ⛔ A KEY OF ITS OWN: the pool identity is in it, so two pools on one seed may differ, and
    // the face key `::w` is untouched by the joint arriving.
    const spread = new Set(SEEDS.map((seed) => `${pairJoint('disagree', 'B', 'P1', seed)}|${pairJoint('disagree', 'B', 'P2', seed)}`));
    expect([...spread].some((row) => row.split('|')[0] !== row.split('|')[1]), 'the pool key is in the key').toBe(true);
  });

  it('⭐ THE ONE-SENTENCE GUARD: an ellipsis does not end a sentence, and a question is never compounded (ruling 23)', () => {
    expect(faceSentenceCount('The wall is kept.')).toBe(1);
    expect(faceSentenceCount('The wall is kept. Nobody is paid to guard it.')).toBe(2);
    // ⛔ THE ELLIPSIS, BOTH SPELLINGS — §7's own device in the archiver's notebook.
    expect(faceSentenceCount('The sum does not close… and nobody has asked why.')).toBe(1);
    expect(faceSentenceCount('The sum does not close... and nobody has asked why.')).toBe(1);
    expect(faceSentenceCount('The sum does not close… Nobody has asked why.')).toBe(1);
    expect(faceSentenceCount('a fragment with no stop at all'), 'no stop reads as one').toBe(1);
    expect(faceSentenceCount('Who keeps it?')).toBe(1);
    // COMPOUNDABLE is one sentence AND a full stop to close it.
    expect(faceIsCompoundable('The wall is kept.')).toBe(true);
    expect(faceIsCompoundable('The wall is kept. Nobody guards it.')).toBe(false);
    expect(faceIsCompoundable('Who keeps it?'), 'a question stands on its own').toBe(false);
    expect(faceIsCompoundable('a fragment with no stop')).toBe(false);
    expect(faceIsCompoundable('The sum does not close… and nobody has asked why.')).toBe(true);
  });

  it('⭐ THE LOWERCASE RULE: a common word falls, a {slot} never does, a capitalised name never does (ruling 23)', () => {
    // (1) THE COMMON WORD — the only branch that changes a byte.
    expect(openLowercased('The tavern says otherwise.', 'The tavern says otherwise.'))
      .toBe('the tavern says otherwise.');
    expect(openLowercased('Nobody stands on it.', 'Nobody stands on it.')).toBe('nobody stands on it.');
    expect(openLowercased('the tavern says otherwise.', 'the tavern says otherwise.'), 'already lower')
      .toBe('the tavern says otherwise.');
    // (2) THE SLOT — read on the RAW text, because the fill's case is the fill's own business.
    expect(openLowercased('{faction} says otherwise.', 'Ironhold says otherwise.'))
      .toBe('Ironhold says otherwise.');
    expect(openLowercased('  {faction} says otherwise.', '  Ironhold says otherwise.'))
      .toBe('  Ironhold says otherwise.');
    // (3) THE NAME — an interior capital is a name or an initialism, never a common word.
    expect(openLowercased('McGrath keeps the book.', 'McGrath keeps the book.'))
      .toBe('McGrath keeps the book.');
    expect(openLowercased('GateDuty is filed under standing.', 'GateDuty is filed under standing.'))
      .toBe('GateDuty is filed under standing.');
    // The rest of the sentence is never touched, only the opening character.
    expect(openLowercased('The Hall says so.', 'The Hall says so.')).toBe('the Hall says so.');
    expect(openLowercased('', '')).toBe('');
  });

  it('⭐ THE PAIR, JOINED: the full stop is byte-for-byte the old arrangement, and a compound needs both halves single (ruling 23)', () => {
    const a = 'The hall has the circuit kept.';
    const b = 'The tavern says nobody stands on it.';
    // THE STOP — exactly `${lead} ${trail}`, which is car 8b-W-18c's render.
    expect(joinPairFaces(a, b, b, FULL_STOP_JOINT)).toBe(`${a} ${b}`);
    // THE COMPOUND — the lead's own stop is struck, the joint carries its space, the trail falls.
    expect(joinPairFaces(a, b, b, ', though '))
      .toBe('The hall has the circuit kept, though the tavern says nobody stands on it.');
    expect(joinPairFaces(a, b, b, ', and yet '))
      .toBe('The hall has the circuit kept, and yet the tavern says nobody stands on it.');
    // ⛔ A TWO-SENTENCE HALF JOINS BY THE FULL STOP WHATEVER THE DRAW SAID — either half.
    const two = 'The tavern says nobody stands on it. Nobody at the table is surprised.';
    expect(joinPairFaces(a, two, two, ', though ')).toBe(`${a} ${two}`);
    expect(joinPairFaces(two, b, b, ', though ')).toBe(`${two} ${b}`);
    // ⛔ AND A SLOT-OPENING TRAIL KEEPS ITS FILL'S CASE INSIDE THE COMPOUND.
    expect(joinPairFaces(a, 'Ironhold says otherwise.', '{faction} says otherwise.', ', but '))
      .toBe('The hall has the circuit kept, but Ironhold says otherwise.');
  });

  it('⭐ IDENTITY: a roster admitting every face is the shipped modulus, byte for byte, and an unsourced variant ignores the roster', () => {
    const all = new Set(FACE_SOURCES);
    for (const seed of SEEDS) {
      const shipped = referenceHash(`${seed}::DS-DEF-11::UNWALLED-SMALL::w`) % 4;
      expect(drawFace(POWERED, 'DS-DEF-11', 'UNWALLED-SMALL', seed, all), `full roster ${seed}`).toBe(shipped);
      expect(drawFace(POWERED, 'DS-DEF-11', 'UNWALLED-SMALL', seed, ['hall', 'tavern']), `hall+tavern ${seed}`).toBe(shipped);
      for (const roster of [undefined, null, [], new Set(), new Set(['hall']), all]) {
        expect(drawFace(UNSOURCED, 'DS-DEF-11', 'UNWALLED-SMALL', seed, roster), `unsourced ${seed}`).toBe(shipped);
      }
    }
    expect(eligibleFaces(POWERED, all)).toEqual([0, 1, 2, 3]);
    expect(eligibleFaces(UNSOURCED, undefined), 'no source list: every face, whatever the roster').toEqual([0, 1, 2, 3]);
  });

  it('⭐ FILTER: a face whose power is absent is never drawn, and the eligible list is the ascending set', () => {
    expect(eligibleFaces(POWERED, new Set(['hall'])), 'the tavern is out').toEqual([0, 1, 3]);
    expect(eligibleFaces(POWERED, ['tavern']), 'the hall is out').toEqual([0, 2, 3]);
    expect(eligibleFaces(POWERED, new Set(['stranger'])), 'only the stranger').toEqual([0, 3]);
    const drawn = new Set();
    for (const seed of SEEDS) drawn.add(drawFace(POWERED, 'B', 'P', seed, new Set(['hall'])));
    expect([...drawn].sort(), 'a hall town never hears the tavern, and reaches every other face').toEqual([0, 1, 3]);
    // The modulus is the ELIGIBLE count, so the draw indexes the eligible list, never the raw index.
    for (const seed of SEEDS) {
      const at = referenceHash(`${seed}::B::P::w`) % 3;
      expect(drawFace(POWERED, 'B', 'P', seed, ['hall']), seed).toBe([0, 1, 3][at]);
    }
  });

  it('⛔ FALLBACK: no roster reads as the stranger alone; nothing eligible falls back to the full set', () => {
    expect(eligibleFaces(POWERED, undefined), 'no roster').toEqual([0, 3]);
    expect(eligibleFaces(POWERED, null)).toEqual([0, 3]);
    expect(eligibleFaces(POWERED, new Set())).toEqual([0, 3]);
    for (const seed of SEEDS) expect([0, 3]).toContain(drawFace(POWERED, 'B', 'P', seed));
    // A leaf the projector never saw: every face sourced, none resolving. The full set, so the
    // rung does not go silent for want of a source.
    const orphan = { text: 'a', wordings: ['b', 'c'], sources: ['court', 'watch', 'market'] };
    expect(eligibleFaces(orphan, new Set(['hall']))).toEqual([0, 1, 2]);
    const reached = new Set(SEEDS.map((seed) => drawFace(orphan, 'B', 'P', seed, ['hall'])));
    expect([...reached].sort()).toEqual([0, 1, 2]);
  });

  it('STABILITY: same seed, same eligible set, same face — and seedless is the first eligible face', () => {
    const roster = new Set(['tavern', 'muster']);
    for (const seed of SEEDS.slice(0, 64)) {
      const once = drawFace(POWERED, 'B', 'P', seed, roster);
      expect(drawFace(POWERED, 'B', 'P', seed, new Set(['tavern', 'muster']))).toBe(once);
      expect(drawFace(POWERED, 'B', 'P', seed, ['tavern']), 'the muster changes no eligible set here').toBe(once);
    }
    expect(drawFace(POWERED, 'B', 'P', '', roster), 'seedless').toBe(0);
    // A variant whose spine is sourced and absent (unlawful at the projector; the kernel still answers).
    const spineSourced = { text: 'a', wordings: ['b'], sources: ['court', null] };
    expect(drawFace(spineSourced, 'B', 'P', '', new Set()), 'seedless takes the FIRST ELIGIBLE').toBe(1);
  });

  it('⭐ ONE ELIGIBLE FACE NEVER HASHES — the no-hash short-circuit survives the filter', () => {
    const spy = vi.spyOn(Math, 'imul');
    try {
      // The hall alone resolves: faces 0, 1 and 3 — three eligible, so the fold RUNS (control).
      drawFace(POWERED, 'B', 'P', 'seed-x', new Set(['hall']));
      expect(spy.mock.calls.length, 'the live control').toBeGreaterThan(0);
      spy.mockClear();
      // A two-face variant whose second face is a court's, on a town with no court: one eligible.
      const oneLeft = { text: 'a', wordings: ['b'], sources: [null, 'court'] };
      expect(drawFace(oneLeft, 'B', 'P', 'seed-x', new Set(['hall']))).toBe(0);
      expect(spy.mock.calls.length, 'one eligible face: neither half of the pair ran').toBe(0);
    } finally {
      spy.mockRestore();
    }
  });

  it('the face readers: source and pair mark, malformed reads as none', () => {
    expect(faceSourceOf(POWERED, 0)).toBe(null);
    expect(faceSourceOf(POWERED, 1)).toBe('hall');
    expect(faceSourceOf(POWERED, 3)).toBe(null);
    expect(faceSourceOf(UNSOURCED, 1)).toBe(null);
    expect(faceSourceOf({ text: 'a', wordings: ['b'], sources: [null, ''] }, 1), 'the empty string is none').toBe(null);
    expect(facePairOf(POWERED, 1)).toEqual({ id: 1, kind: 'disagree' });
    expect(facePairOf(POWERED, 0)).toBe(null);
    expect(facePairOf({ text: 'a', wordings: ['b'], pairs: [null, { id: 0, kind: 'view' }] }, 1), 'id 0').toBe(null);
    expect(facePairOf({ text: 'a', wordings: ['b'], pairs: [null, { id: 2, kind: 'quarrel' }] }, 1), 'an unknown kind').toBe(null);
    expect(facePairOf({ text: 'a', wordings: ['b'], pairs: [null, 2] }, 1), 'a bare number is not a mark').toBe(null);
    expect(facePairOf(null, 0)).toBe(null);
  });

  it('⭐ THE PARTNER: the other eligible face of the pair, or nothing where it does not resolve', () => {
    const both = new Set(['hall', 'tavern']);
    expect(facePartner(POWERED, 1, both), 'the hall\'s partner is the tavern').toBe(2);
    expect(facePartner(POWERED, 2, both), 'and the tavern\'s the hall').toBe(1);
    expect(facePartner(POWERED, 1, new Set(['hall'])), 'no tavern here: the hall speaks alone').toBe(null);
    expect(facePartner(POWERED, 0, both), 'an unpaired face has no partner').toBe(null);
    expect(facePartner(POWERED, 3, both)).toBe(null);
    expect(facePartner(UNSOURCED, 1, both), 'no pair list at all').toBe(null);
    expect(facePartner(POWERED, 1), 'no roster: the tavern is not eligible').toBe(null);
    // Every READING kind pairs the same way; the kind is data the composer carries.
    for (const kind of PAIR_KINDS.filter((k) => k !== WEIGH_KIND)) {
      const v = { text: 'a', wordings: ['b', 'c'], sources: [null, 'hall', 'court'], pairs: [null, { id: 7, kind }, { id: 7, kind }] };
      expect(facePartner(v, 1, new Set(['hall', 'court'])), kind).toBe(2);
    }
    // ⛔ A WEIGH IS NOT HALF OF A PAIR (car 8b-W-18i): asked from either side, it answers null,
    // so no caller holding a face index of its own can turn the archiver into a partner.
    const weighed = {
      text: 'The walls stand.',
      wordings: ['The hall has it kept.', 'The tavern says nobody stands on it.', 'It may be that both are describing the same week.'],
      sources: [null, 'hall', 'tavern', ARCHIVER_SOURCE],
      pairs: [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, { id: 1, kind: WEIGH_KIND }],
    };
    const town = new Set(['hall', 'tavern']);
    expect(facePartner(weighed, 3, town), 'the weigh row has no partner').toBe(null);
    expect(facePartner(weighed, 1, town), 'and the hall\'s partner is still the tavern, not the archiver').toBe(2);
    expect(facePartner(weighed, 2, town)).toBe(1);
  });

  it('⭐ THE ARCHIVER NEVER DRAWS ALONE — excluded from every eligible list, on every roster (ruling 22; car 8b-W-18i)', () => {
    const weighed = {
      text: 'The walls stand.',
      wordings: ['The hall has it kept.', 'The tavern says nobody stands on it.', 'It may be that both are describing the same week.'],
      sources: [null, 'hall', 'tavern', ARCHIVER_SOURCE],
      pairs: [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, { id: 1, kind: WEIGH_KIND }],
    };
    // Face 3 is in NO eligible list — not the full vocabulary's, not a roster that names the
    // archiver outright (no town's roster ever does; `sourcesOf` cannot emit it).
    expect(eligibleFaces(weighed, new Set(FACE_SOURCES))).toEqual([0, 1, 2]);
    expect(eligibleFaces(weighed, new Set(['stranger', 'hall', 'tavern', ARCHIVER_SOURCE])))
      .toEqual([0, 1, 2]);
    expect(eligibleFaces(weighed, new Set(['hall']))).toEqual([0, 1]);
    expect(eligibleFaces(weighed, undefined), 'no roster: the spine alone').toEqual([0]);
    // And so the draw can never land on it, on any seed.
    const drawn = new Set(SEEDS.map((seed) => drawFace(weighed, 'B', 'P', seed, new Set(FACE_SOURCES))));
    expect([...drawn].sort(), 'every face the draw ever reaches').toEqual([0, 1, 2]);
    expect(drawn.has(3), 'the archiver is never drawn').toBe(false);
    // ⛔ THE ONE DOOR IT HAS. `faceWeigh` finds it from either half, and takes no roster.
    expect(faceWeigh(weighed, 1)).toBe(3);
    expect(faceWeigh(weighed, 2)).toBe(3);
    expect(faceWeigh(weighed, 0), 'an unpaired face weighs nothing').toBe(null);
    expect(faceWeigh(weighed, 3), 'and the weigh row does not weigh itself').toBe(null);
    // ⛔ NOT ON AN `aside` OR A `view` — the leaf's own side of the grammar's refusal.
    for (const kind of ['aside', 'view']) {
      const v = { ...weighed, pairs: [null, { id: 1, kind }, { id: 1, kind }, { id: 1, kind: WEIGH_KIND }] };
      expect(faceWeigh(v, 1), kind).toBe(null);
    }
    // ⛔ NOT WHERE THE ROW IS NOT THE ARCHIVER'S, and not where no row carries the mark.
    expect(faceWeigh({ ...weighed, sources: [null, 'hall', 'tavern', 'court'] }, 1)).toBe(null);
    expect(faceWeigh({ ...weighed, pairs: [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null] }, 1)).toBe(null);
    expect(faceWeigh(POWERED, 1), 'a variant with no weigh row at all').toBe(null);
    expect(faceWeigh(UNSOURCED, 1), 'no pair list at all').toBe(null);
    expect(faceWeigh(null, 0)).toBe(null);
  });

  it('⭐ ONE SHIPPED POOL CARRIES SOURCED FACES AND ONE PAIR, and every other block is still the zero-shift ground — read live', () => {
    // Re-pinned at the first v3 pool: the corpus is no longer sourceless, so the arm names
    // the pools that are and holds the old ground over everything else. A further pool
    // landing faces reds here by name and is re-pinned in the commit that lands it.
    // ⭐ RE-PINNED AT THE 8b DS-DEF-2 DRAFT GATE (v3): three more pools of the SAME block
    // landed faces in one commit, so the roster is twelve variants of four pools.
    // ⭐⭐ RE-PINNED AGAIN AT THE DRAFT GATE'S THIRD SITTING, which landed FIVE more pools of the
    // block — Beasts plagued-perimeter-but-NO-force, Beasts frontier force-without-a-perimeter,
    // Invasion walls-with-citizen-militia, Internal Security court-without-detention and Economic
    // Survival WEAK. A sixth packet was REFUSED at that gate for one PROVENANCE citation and kept
    // its shipped spine rows; its CURE packet removes the citing clause, so at the 8b DS-DEF-2
    // CURE gate `Disasters & Famine: granary AND parish care only` takes its seat and the roster
    // is FORTY-FIVE variants of FIFTEEN pools. None of the five seats the `archiver`,
    // the `public`, an `observed` mark or a `weigh`, so those arms are untouched; the zero-shift arm
    // over every OTHER block is unchanged, which is the arm that matters.
    const SOURCED_TODAY = ['DS-DEF-2 :: Beasts & Monsters: frontier, credible deterrence #0',
      'DS-DEF-2 :: Beasts & Monsters: frontier, credible deterrence #1',
      'DS-DEF-2 :: Beasts & Monsters: frontier, credible deterrence #2',
      'DS-DEF-2 :: Beasts & Monsters: frontier, force without a perimeter #0',
      'DS-DEF-2 :: Beasts & Monsters: frontier, force without a perimeter #1',
      'DS-DEF-2 :: Beasts & Monsters: frontier, force without a perimeter #2',
      'DS-DEF-2 :: Beasts & Monsters: plagued, perimeter but NO force to hold it #0',
      'DS-DEF-2 :: Beasts & Monsters: plagued, perimeter but NO force to hold it #1',
      'DS-DEF-2 :: Beasts & Monsters: plagued, perimeter but NO force to hold it #2',
      'DS-DEF-2 :: Disasters & Famine: NO reserves, NO medical provision #0',
      'DS-DEF-2 :: Disasters & Famine: NO reserves, NO medical provision #1',
      'DS-DEF-2 :: Disasters & Famine: NO reserves, NO medical provision #2',
      'DS-DEF-2 :: Disasters & Famine: granary AND hospital #0',
      'DS-DEF-2 :: Disasters & Famine: granary AND hospital #1',
      'DS-DEF-2 :: Disasters & Famine: granary AND hospital #2',
      'DS-DEF-2 :: Disasters & Famine: granary AND parish care only #0',
      'DS-DEF-2 :: Disasters & Famine: granary AND parish care only #1',
      'DS-DEF-2 :: Disasters & Famine: granary AND parish care only #2',
      'DS-DEF-2 :: Economic Survival: STRONG #0',
      'DS-DEF-2 :: Economic Survival: STRONG #1',
      'DS-DEF-2 :: Economic Survival: STRONG #2',
      'DS-DEF-2 :: Economic Survival: WEAK #0',
      'DS-DEF-2 :: Economic Survival: WEAK #1',
      'DS-DEF-2 :: Economic Survival: WEAK #2',
      'DS-DEF-2 :: Internal Security: court without detention #0',
      'DS-DEF-2 :: Internal Security: court without detention #1',
      'DS-DEF-2 :: Internal Security: court without detention #2',
      'DS-DEF-2 :: Internal Security: full legal chain (court AND prison) #0',
      'DS-DEF-2 :: Internal Security: full legal chain (court AND prison) #1',
      'DS-DEF-2 :: Internal Security: full legal chain (court AND prison) #2',
      'DS-DEF-2 :: Internal Security: no legal infrastructure #0',
      'DS-DEF-2 :: Internal Security: no legal infrastructure #1',
      'DS-DEF-2 :: Internal Security: no legal infrastructure #2',
      'DS-DEF-2 :: Invasion & War: force with NO walls #0',
      'DS-DEF-2 :: Invasion & War: force with NO walls #1',
      'DS-DEF-2 :: Invasion & War: force with NO walls #2',
      'DS-DEF-2 :: Invasion & War: walls AND professional garrison #0',
      'DS-DEF-2 :: Invasion & War: walls AND professional garrison #1',
      'DS-DEF-2 :: Invasion & War: walls AND professional garrison #2',
      'DS-DEF-2 :: Invasion & War: walls with NO force #0',
      'DS-DEF-2 :: Invasion & War: walls with NO force #1',
      'DS-DEF-2 :: Invasion & War: walls with NO force #2',
      'DS-DEF-2 :: Invasion & War: walls with citizen militia #0',
      'DS-DEF-2 :: Invasion & War: walls with citizen militia #1',
      'DS-DEF-2 :: Invasion & War: walls with citizen militia #2'];
    const rows = LIVE_POOLS
      .flatMap(({ blockId, poolKey, pool }) => pool.map((v, at) => ({ blockId, poolKey, at, v })))
      .filter(({ v }) => Array.isArray(v.sources) || Array.isArray(v.pairs));
    expect(rows.map(({ blockId, poolKey, at }) => `${blockId} :: ${poolKey} #${at}`).sort())
      .toEqual(SOURCED_TODAY);
    expect(LIVE_POOLS.length).toBeGreaterThanOrEqual(700);
    // The roster face by face, and the one pair carried by exactly two faces of variant #0.
    // ⭐ RE-FROZEN AT THE POOL RE-CUT OF CARS 8b-W-18n/18o: variant #1 gains the ARCHIVER'S
    // OWN OBSERVATION (ruling 27) and variant #2 gains the PUBLIC (ruling 28), the two forms
    // those cars created taking their first seats in the corpus.
    // ⭐ AND THE DRAFT GATE'S THREE POOLS BESIDE IT, in corpus order. None of them carries the
    // archiver or the public: those two forms still stand only where 18n/18o seated them.
    // ⭐ RE-FROZEN AGAIN AT THE 8b DS-DEF-2 CURE GATE (v3), on `Internal Security: no legal
    // infrastructure` and on that pool ONLY. Six faces were charged on FLOOR 1 for one fault —
    // a source tag the preimage cannot seat — and re-seated: `watch`, `guild` and `garrison`
    // leave the pool entirely, because `sourcesOf` seats none of the three on any of the 384
    // preimage towns. THE COUNTS DO NOT MOVE (11, 8, 8 as before) and neither do the pairs, so
    // the shift register's `face-count-per-variant` row is UNTOUCHED: this is a re-seat, not a
    // grow, and the `pairs` arm below is unchanged by construction.
    expect(rows.map(({ v }) => v.sources)).toEqual([
      [null, 'gate', 'hall', 'watch', 'guild', 'stranger', 'register', 'court', 'tavern', 'market', 'elders'], 
      [null, 'gate', 'hall', 'watch', 'guild', 'tavern', 'register', 'market', 'court', 'elders'], 
      [null, 'stranger', 'gate', 'watch', 'hall', 'tavern', 'court', 'guild', 'register', 'elders'], 
      [null, 'stranger', 'gate', 'elders', 'hall', 'guild', 'tavern', 'register', 'muster', 'court', 'garrison', 'market'], 
      [null, 'stranger', 'gate', 'register', 'hall', 'watch', 'tavern', 'garrison', 'guild', 'market', 'court', 'elders'], 
      [null, 'market', 'register', 'gate', 'court', 'muster', 'tavern', 'garrison', 'guild', 'hall', 'elders'], 
      // ⭐ RE-FROZEN AT THE 8b DS-DEF-2 CURE GATE (v3): `Beasts & Monsters: frontier, force
      // without a perimeter` #0. The DULL re-cut gave the variant a `reinforce` pair on its
      // two UNIVERSAL sources (stranger + muster, so it renders on every town) and renumbered
      // the variant's pairs — pair 1 the new reinforce, pair 2 the hall and the guilds,
      // unchanged in claim. It repurposed two STANDING faces and added none, so the face
      // count does not move and the `face-count-per-variant` register is untouched by it.
      [null, 'elders', 'stranger', 'muster', 'tavern', 'register', 'hall', 'guild', 'market', 'watch', 'garrison', 'court'], 
      [null, 'stranger', 'elders', 'guild', 'muster', 'watch', 'tavern', 'hall', 'market', 'register', 'garrison', 'court'], 
      [null, 'muster', 'elders', 'register', 'stranger', 'tavern', 'hall', 'guild', 'watch', 'market', 'garrison', 'court'], 
      [null, 'guild', 'market', 'tavern', 'hall', 'gate'], 
      // ⭐ RE-PINNED AT THE 8b DS-DEF-2 CURE GATE (v3): `Invasion & War: walls AND professional
      // garrison` #1 face 5 moved `elders` -> `tavern`, the cure's one target. `elders` seats on
      // thorp/hamlet/village ALONE, so the face drew on no preimage town of this pool; `tavern`
      // seats on every tier. A MOUTH moved, not a face count: the row below is one word wide.
      [null, 'gate', 'hall', 'court', 'stranger', 'tavern'], 
      [null, 'stranger', 'tavern', 'register', 'garrison', 'watch'], 
      [null, 'stranger', 'gate', 'market', 'tavern', 'elders', 'muster'], 
      [null, 'gate', 'elders', 'muster', 'tavern', 'stranger', 'muster', 'tavern'], 
      [null, 'gate', 'market', 'stranger', 'elders', 'tavern', 'elders', 'muster'], 
      [null, 'elders', 'hall', 'guild'], 
      [null, 'stranger', 'tavern', 'gate', 'archiver'], 
      [null, 'elders', 'watch', 'court', 'public'], 
      [null, 'hall', 'guild', 'watch', 'tavern', 'elders'], 
      [null, 'watch', 'stranger', 'hall', 'tavern', 'garrison'], 
      [null, 'garrison', 'gate', 'hall', 'market', 'register'], 
      [null, 'hall', 'tavern', 'watch', 'guild', 'court', 'market', 'gate', 'garrison', 'stranger'], 
      [null, 'watch', 'hall', 'tavern', 'court', 'stranger', 'register', 'market', 'garrison', 'guild', 'gate'], 
      [null, 'hall', 'stranger', 'court', 'tavern', 'watch', 'garrison', 'guild', 'market', 'gate'], 
      [null, 'watch', 'court', 'hall', 'market', 'register', 'guild', 'tavern', 'stranger', 'gate', 'garrison'], 
      [null, 'tavern', 'court', 'gate', 'watch', 'market', 'hall', 'stranger'], 
      [null, 'watch', 'hall', 'market', 'court', 'tavern', 'guild', 'garrison', 'gate'], 
      [null, 'stranger', 'tavern', 'register', 'elders', 'gate', 'muster', 'tavern', 'market', 'elders', 'muster'], 
      [null, 'stranger', 'elders', 'tavern', 'elders', 'muster', 'gate', 'register'], 
      [null, 'stranger', 'tavern', 'elders', 'register', 'gate', 'muster', 'market'], 
      [null, 'hall', 'watch', 'archiver', 'register', 'tavern', 'guild', 'stranger', 'garrison', 'archiver', 'market', 'hall'], 
      [null, 'hall', 'guild', 'archiver', 'watch', 'gate', 'stranger', 'tavern', 'garrison', 'market', 'register'], 
      [null, 'watch', 'garrison', 'hall', 'guild', 'stranger', 'register', 'hall', 'court'], 
      [null, 'gate', 'register', 'stranger', 'muster', 'elders', 'tavern', 'garrison', 'watch', 'market', 'court'], 
      [null, 'stranger', 'elders', 'tavern', 'register', 'gate', 'muster', 'market', 'watch', 'garrison'], 
      [null, 'stranger', 'register', 'elders', 'tavern', 'muster', 'gate', 'market', 'garrison'], 
      [null, 'hall', 'market', 'register', 'tavern', 'watch', 'stranger', 'gate', 'guild', 'garrison'], 
      [null, 'hall', 'market', 'watch', 'tavern', 'register', 'stranger', 'guild', 'gate', 'garrison'], 
      [null, 'hall', 'tavern', 'market', 'register', 'watch', 'gate', 'stranger', 'guild', 'garrison'], 
      // ⭐⭐ NEW AT THE 8b DS-DEF-2 CURE GATE (v3) — `Disasters & Famine: granary AND parish
      // care only`, the pool the DRAFT gate refused whole for one PROVENANCE citation. Its
      // cure's own target v3/0 removes the citing clause (`from the road` → `from outside`),
      // so the pool takes its seat here for the first time: three variants, 22 faces, two
      // marked pairs. This is the WHOLE of the cure gate's grow; the other five packets
      // re-cut wordings inside counts they already had.
      [null, 'hall', 'market', 'watch', 'register', 'guild', 'tavern', 'gate', 'garrison'], 
      [null, 'register', 'hall', 'tavern', 'market', 'guild', 'watch', 'stranger', 'court'], 
      [null, 'register', 'market', 'tavern', 'watch', 'guild', 'court'], 
      [null, 'elders', 'stranger', 'market', 'register', 'tavern'], 
      [null, 'elders', 'tavern', 'stranger', 'market', 'register'], 
      [null, 'stranger', 'tavern', 'elders', 'register', 'market'], 
    ]);
    expect(rows.map(({ v }) => v.pairs)).toEqual([
      [null, null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null, null, null, null, null], 
      undefined, 
      [null, null, null, { id: 5, kind: 'disagree' }, { id: 5, kind: 'disagree' }, { id: 6, kind: 'view' }, { id: 6, kind: 'view' }, null, null, null], 
      [null, null, null, null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null, null, null, null], 
      [null, null, { id: 5, kind: 'aside' }, { id: 5, kind: 'aside' }, { id: 2, kind: 'disagree' }, { id: 2, kind: 'disagree' }, null, null, null, null, null, null], 
      undefined, 
      // ⭐ RE-FROZEN AT THE 8b DS-DEF-2 CURE GATE (v3): `Beasts & Monsters: frontier, force
      // without a perimeter` #0. The DULL re-cut gave the variant a `reinforce` pair on its
      // two UNIVERSAL sources (stranger + muster, so it renders on every town) and renumbered
      // the variant's pairs — pair 1 the new reinforce, pair 2 the hall and the guilds,
      // unchanged in claim. It repurposed two STANDING faces and added none, so the face
      // count does not move and the `face-count-per-variant` register is untouched by it.
      [null, null, { id: 1, kind: 'reinforce' }, { id: 1, kind: 'reinforce' }, null, null, { id: 2, kind: 'disagree' }, { id: 2, kind: 'disagree' }, null, null, null, null], 
      [null, null, null, null, null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, { id: 2, kind: 'view' }, { id: 2, kind: 'view' }, null, null, null], 
      [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null, null, null, null, null, null, null], 
      [null, null, null, null, { id: 1, kind: 'view' }, { id: 1, kind: 'view' }], 
      [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null], 
      [null, null, null, null, { id: 3, kind: 'view' }, { id: 3, kind: 'view' }], 
      [null, null, null, null, null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }], 
      [null, null, null, null, null, null, { id: 2, kind: 'disagree' }, { id: 2, kind: 'disagree' }], 
      [null, null, null, null, null, null, { id: 3, kind: 'disagree' }, { id: 3, kind: 'disagree' }], 
      [null, null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }], 
      undefined, 
      undefined, 
      [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null], 
      [null, null, null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null], 
      undefined, 
      undefined, 
      [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null, { id: 2, kind: 'aside' }, { id: 2, kind: 'aside' }, null, null, null], 
      [null, { id: 3, kind: 'disagree' }, { id: 3, kind: 'disagree' }, null, null, null, null, null, null, null], 
      [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null, null, null, null, null, null], 
      [null, { id: 2, kind: 'disagree' }, { id: 2, kind: 'disagree' }, null, null, null, null, null], 
      [null, null, null, null, null, null, null, { id: 3, kind: 'reinforce' }, { id: 3, kind: 'reinforce' }], 
      [null, { id: 1, kind: 'view' }, null, null, { id: 1, kind: 'view' }, { id: 2, kind: 'reinforce' }, null, { id: 2, kind: 'reinforce' }, null, null, null], 
      undefined, 
      undefined, 
      [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, { id: 1, kind: 'weigh' }, null, null, null, null, null, null, null, null], 
      [null, { id: 2, kind: 'disagree' }, { id: 2, kind: 'disagree' }, { id: 2, kind: 'weigh' }, null, null, null, null, null, null, null], 
      [null, { id: 2, kind: 'reinforce' }, { id: 2, kind: 'reinforce' }, null, null, null, null, null, null], 
      [null, null, null, null, null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null, null], 
      undefined, 
      [null, null, { id: 3, kind: 'reinforce' }, { id: 3, kind: 'reinforce' }, null, null, null, null, null], 
      [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, { id: 2, kind: 'reinforce' }, { id: 2, kind: 'reinforce' }, null, null, null, null], 
      [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, { id: 2, kind: 'view' }, { id: 2, kind: 'view' }, null, null, null, null], 
      [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null, null, null, null, null], 
      // ⭐⭐ NEW AT THE 8b DS-DEF-2 CURE GATE (v3) — `Disasters & Famine: granary AND parish
      // care only`, the pool the DRAFT gate refused whole for one PROVENANCE citation. Its
      // cure's own target v3/0 removes the citing clause (`from the road` → `from outside`),
      // so the pool takes its seat here for the first time: three variants, 22 faces, two
      // marked pairs. This is the WHOLE of the cure gate's grow; the other five packets
      // re-cut wordings inside counts they already had.
      [null, { id: 1, kind: 'reinforce' }, { id: 1, kind: 'reinforce' }, null, null, null, null, null, null], 
      [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null, null, null, null], 
      undefined, 
      [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null, null, null], 
      [null, { id: 2, kind: 'disagree' }, { id: 2, kind: 'disagree' }, null, null, null], 
      undefined, 
    ]);
    // THE ZERO-SHIFT ARM THAT SURVIVES: every OTHER shipped variant's eligible list is [0]
    // whatever the roster, so no roster can move a single read outside DS-DEF-2.
    let checked = 0;
    let sourcedChecked = 0;
    for (const { blockId, pool } of LIVE_POOLS) {
      for (const v of pool) {
        checked += 1;
        if (blockId === 'DS-DEF-2' && Array.isArray(v.sources)) {
          sourcedChecked += 1;
          // On the sourced pool the roster DOES decide: no roster is the stranger alone
          // (floor 1 fail-closed), the full roster admits every face.
          // ⭐ RE-FROZEN AT CARS 8b-W-18n/18o: variants #1 and #2 carry FIVE faces, having
          // gained the archiver's observation and the public. The full roster admits all of
          // them, so the list is `[0..n-1]` where n is the variant's own face count — asserted
          // as that rather than as a literal, so the next grow reds on the CEILING below and
          // not on this line.
          // ⭐⭐ RE-FROZEN AT THE 8b DS-DEF-2 DRAFT GATE'S SECOND SITTING. `Economic Survival:
          // STRONG` is the first pool in the corpus to carry the ARCHIVER'S WEIGH (ruling 22),
          // and a weigh is NOT a candidate for the draw: it closes a pair through `faceWeigh`
          // and the archiver is not a power of the town. So the full roster admits every index
          // EXCEPT a weigh row's — derived from the variant rather than written as a literal,
          // so the next grow reds on the ceiling below and not on this line. The archiver's
          // OBSERVATION (ruling 27) is a candidate and is not filtered here.
          const n = 1 + v.wordings.length;
          const drawable = [...Array(n).keys()]
            .filter((i) => ((v.pairs || [])[i] || {}).kind !== 'weigh');
          expect(eligibleFaces(v, new Set(FACE_SOURCES))).toEqual(drawable);
          expect(eligibleFaces(v, undefined).length).toBeLessThanOrEqual(n);
          continue;
        }
        expect(eligibleFaces(v, undefined)).toEqual([0]);
        expect(eligibleFaces(v, new Set(FACE_SOURCES))).toEqual([0]);
      }
    }
    expect(sourcedChecked, 'the forty-five sourced variants were reached').toBe(45);
    expect(checked).toBeGreaterThanOrEqual(2266);
  });
});

/**
 * stateProseKernel.test.js — LANE P-2: the reader's five laws, proven.
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
  eligibleVariants,
  fillSlots,
  hasStateProsePool,
  hashKey,
  poolDimensions,
  readStateProse,
  stateProseSentence,
  variantIsAnchored,
  variantIsAudible,
  STATE_MARK_DIMENSIONS,
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

  /** The hash pair, re-spelled here so the key can be checked against an INDEPENDENT fold. */
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

  it('⭐ THE WHOLE SHIPPED CORPUS TAKES NO HASH, and the corpus is read live', () => {
    // The claim car 3a rests on: today the composer's face draw is byte-identical BY
    // CONSTRUCTION, because no variant that ships carries a `wordings` list. Measured over
    // the live leaves rather than a fixture, so the day the rewrite wave banks a face this
    // arm moves with it instead of describing a corpus that no longer exists.
    const withWordings = SHIPPED_POOLS
      .flatMap(({ desk, blockId, poolKey, pool }) => pool
        .map((variant, at) => ({ desk, blockId, poolKey, at, variant }))
        .filter((row) => Array.isArray(row.variant.wordings)))
      .map((row) => `${row.desk} :: ${row.blockId} :: ${row.poolKey} #${row.at}`);
    expect(withWordings.slice(0, 5), 'a shipped variant carrying faces').toEqual([]);
    expect(SHIPPED_POOLS.length, 'and the sweep found the corpus').toBeGreaterThanOrEqual(700);
    const spy = vi.spyOn(Math, 'imul');
    let faces = 0;
    let nonZero = 0;
    try {
      for (const row of SHIPPED_POOLS) {
        for (const variant of row.pool) {
          faces += 1;
          if (drawFace(variant, row.blockId, row.poolKey, 'corpus-probe') !== 0) nonZero += 1;
        }
      }
      expect(nonZero, 'every shipped variant draws face 0').toBe(0);
      expect(spy.mock.calls.length, 'and not one of them touched the hash pair').toBe(0);
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
    const pool = Array.from({ length: 7 }, (_, i) => ({ text: `v${i}` }));
    expect(drawVariant(pool, 'B', 'P', 'sx').text)
      .toBe(pool[referenceHash('sx::B::P') % 7].text);
  });
});

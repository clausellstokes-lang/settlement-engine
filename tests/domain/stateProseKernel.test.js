/**
 * stateProseKernel.test.js — LANE P-2: the reader's four laws, proven.
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
 *
 * The corpus is read live from the projected desk leaves, not from a fixture: a pin
 * over an invented pool would prove the kernel works on prose that does not ship.
 */
import { describe, expect, it } from 'vitest';
import {
  AUDIENCE_DM,
  AUDIENCE_PLAYER,
  drawVariant,
  eligibleVariants,
  fillSlots,
  hasStateProsePool,
  readStateProse,
  stateProseSentence,
  variantIsAnchored,
  variantIsAudible,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
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

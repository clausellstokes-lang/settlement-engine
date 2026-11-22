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
  eligibleVariants,
  fillSlots,
  hasStateProsePool,
  hashKey,
  poolDimensions,
  readStateProse,
  stableVid,
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
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';
import { variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { declarationAdmits } from '../../src/domain/facts/factVocabulary.js';

/**
 * CENSUS-5b unit 3 (re-keyed by that cause): a variant whose OWN declaration needs an active
 * crisis (`crisis: <kinds>` without `calm` or `any`; R-I) is not a calm variant, so the calm
 * pre-cure reference sets it aside — the crisis-safe twins of the pools that went mute (R-L).
 * @param {any} variant
 */
const needsCrisis = (variant) => {
  const c = variantFactDeclaration(variant).crisis;
  return c.length > 0 && !c.includes('calm') && !c.includes('any');
};
/**
 * CENSUS-5c unit 3 (2026-11-05): a variant that EXCLUDES a presence atom (`no organised crime`,
 * DS-DEF-4 structure null v1) is refused by the calm double, which holds every presence atom;
 * the calm reference sets it aside, as it sets aside a crisis-needing variant above.
 */
const excludesPresence = (variant) => variantFactDeclaration(variant).excludes.some((a) => !/^crisis\b/.test(a));
/**
 * LANDING-R2 (2026-11-07): a variant that NEEDS one value of a categorical fact — a band or a keyed presence
 * (`tier: >= town`, `population: small`, `migration: influx`; census-3c unit 4 586bedd7f, census-2b item 2 db3ed88c1) —
 * is refused by the calm double, which answers no value of any band (every PRESENCE atom holds; a band holds one value
 * or none — `stores: >= 6` and `war: peace` it does answer, and those stay in); the calm reference sets it aside, as it
 * sets aside a crisis-needing variant above.
 */
const needsCategorical = (variant) => variantFactDeclaration(variant).needs.some((a) => /^(?!institution\b|crisis\b)[a-z ]+:/.test(a)
  && declarationAdmits({ needs: [a], excludes: [], crisis: [] }, CALM_FACTS_ADMIT_ALL).refused.length > 0);

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
      // W1 ECO (2026-11-07): the FOOD AND PROSPERITY pools are a coupled lens (construction C12),
      // keyed on the food field's type token, not on a prosperity band.
      .filter((key) => !key.startsWith('FOOD AND PROSPERITY:'))
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

  // CENSUS-3c (R-N): DS-ECO-8's lines declare fact atoms (STRUGGLING v3 `market`), so the kernel
  // reads the pool against `facts` (fail-closed); the one calm double keeps these the laws' arms.
  for (const rung of PROSPERITY_RUNGS) {
    it(`offers the settlement-naming rung only while the town has a name — ${rung.pool} [${rung.why}]`, () => {
      const pool = DOSSIER_STATE_PROSE_ECONOMY[rung.block].pools[rung.pool];
      const named = eligibleVariants(pool, { slots: { settlement: 'Thornwall' }, audience: AUDIENCE_DM, facts: CALM_FACTS_ADMIT_ALL })
        .map((v) => v.text);
      const unnamed = eligibleVariants(pool, { slots: {}, audience: AUDIENCE_DM, facts: CALM_FACTS_ADMIT_ALL }).map((v) => v.text);

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
        { slots: { settlement: 'Thornwall' }, seed: 'save-1::eco-8', audience: AUDIENCE_DM, facts: CALM_FACTS_ADMIT_ALL },
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
        { slots: { settlement: 'Thornwall' }, seed: 'world-7::DS-ECO-8', audience: AUDIENCE_DM, facts: CALM_FACTS_ADMIT_ALL }];
      const first = readStateProse(...args);
      for (let i = 0; i < 20; i++) expect(readStateProse(...args)).toEqual(first);
    });

    it(`reads canonical-at-zero when there is no seed — ${rung.pool} [${rung.why}]`, () => {
      const pool = DOSSIER_STATE_PROSE_ECONOMY[rung.block].pools[rung.pool];
      const seedless = readStateProse(DOSSIER_STATE_PROSE_ECONOMY, rung.block, rung.pool,
        { slots: { settlement: 'Thornwall' }, facts: CALM_FACTS_ADMIT_ALL });
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
      // CENSUS-3b unit 2 skipped a pool whose variants declare FACT atoms (fail-closed without
      // `facts`); the CENSUS-1e merge keeps it in the sweep instead, read against R-N's one calm
      // double below (CENSUS-5's), so the sweep stays as wide as each side had it.
      poolsChecked += 1;
      const slots = bagFor(pool);
      for (const audience of [AUDIENCE_DM, AUDIENCE_PLAYER]) {
        const reference = pool.filter(
          (variant) => variantIsAudible(variant, audience) && variantIsAnchored(variant, slots) && !needsCrisis(variant) && !excludesPresence(variant) && !needsCategorical(variant),
        );
        // CENSUS-5: a pool whose lines declare fact atoms reads against `facts`; the calm
        // admit-all double keeps this the pre-cure comparison (`tests/helpers/calmFactsDouble.js`).
        const cured = eligibleVariants(pool, { slots, audience, facts: CALM_FACTS_ADMIT_ALL });
        if (cured.length !== reference.length || cured.some((v, i) => v !== reference[i])) {
          drift.push(`ELIGIBILITY :: ${desk} :: ${blockId} :: ${poolKey} :: ${audience}`);
        }
        for (const seed of SWEEP_SEEDS) {
          draws += 1;
          const was = drawVariant(reference, blockId, poolKey, seed);
          const wasText = was ? fillSlots(was.text, slots) : null;
          const nowText = readStateProse({ [blockId]: { pools: { [poolKey]: pool } } },
            blockId, poolKey, { slots, seed, audience, facts: CALM_FACTS_ADMIT_ALL })?.text ?? null;
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
    // F10 WALLS-WORD (2026-11-04): 32 more pools partition by `walls`, so 730 are swept.
    // F12 CRISIS-BLIND (2026-11-04): 14 more pools partition by a crisis dimension, so 716.
    // CENSUS-3b unit 2 (2026-11-05): DS-ECO-10 established and DS-ECO-12 one-source take `no hunger`
    // (a crisis dimension) and DS-ECO-8 COMFORTABLE declares `no crisis: indebted` (a fact atom), so 713.
    // CENSUS-5b unit 1 (2026-11-05): DS-DEF-1 `readiness WEAK` partitions by `walls` (v2, the
    // perimeter line, declares it; R-O), so 712 (the CENSUS-1e merge composes the two).
    // LANDING-R2 (2026-11-07, the pool census composed; measured by this sweep's own count, 787 pools less those with
    // a demoted dimension, on git-archive trees): 716 at the compose base (F12) -> 687 at the tip, by step: census-1b's
    // merges of census-4 (950b75014) -2, census-5b units 1-2 (ceb83b9c4) -1, census-2 (2b31f33f3) -5, census-3e
    // (3d3c52f9e) -6, census-5 (5215c4325) -13 (census-1b's tip e36e4916f 689), and the compose's unit 2 item 6
    // (b8d2c3569, two bare needs take crisis declarations) -2. Rung 1's merge moves none (687 either side of 77ea26af9).
    expect(poolsChecked).toBeGreaterThanOrEqual(687);
    expect(draws).toBeGreaterThanOrEqual(687 * 2 * SWEEP_SEEDS.length);
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
    // F10 WALLS-WORD (2026-11-04) added the `walls` fact dimension; no causal arm spells either word.
    // F12 CRISIS-BLIND (2026-11-04) added the five crisis fact dimensions; no causal arm spells any of their words.
    expect(vocabulary).toEqual(['minor', 'major', 'catastrophic', 'deficit', 'no deficit', 'anchored', 'not anchored', 'walls', 'no walls',
      'threat', 'no threat', 'hunger', 'no hunger', 'succession open', 'succession settled', 'unrest', 'no unrest', 'crisis', 'no crisis']);
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

  // ── THE SWEEP BY n (BUILD-1-CURE ADDENDUM 3; the chair's ruling of 2026-11-20 22:17 UTC) ──────────
  // A pool that grows past three variants must not leave the sweep: the floor counts every pool of
  // three or more (the chair's ruling of 2026-11-20 21:39 UTC, BUILD-1-CURE (b)), and the two sweeps
  // below read every such pool, GROUPED BY n, each group against its own three bounds. The bounds are
  // FUNCTIONS OF n whose value at n = 3 is exactly the constant these rows carried when they swept only
  // the three-variant class (13.816, 0.15 points, 23-27 %): the old sweep is the n = 3 case of this one,
  // asserted to the digit below. Nothing is loosened: the same significance (p = 0.001), the same number
  // of standard deviations, the same relative band.
  //
  // ⛔ A GROUP TOO SMALL TO BE TESTED AT THAT SIGNIFICANCE IS NAMED, NEVER SKIPPED SILENTLY. A fixed
  // bound tests a group at p = 0.001 only when a uniform draw would breach it no more often than that:
  // the bound must be at least the p = 0.001 normal quantile in the group's own standard errors
  // (Bonferroni over the n slots for the deepest departure; one share for the append). Below that, a
  // perfectly uniform draw fails the bound by chance, so asserting it would test the sample size, not the
  // draw. Those groups are LISTED and asserted as a list; their figures are printed; the chi-square, the
  // per-pool deviation, the slot reach and the append property still run over every group.

  // The chi-square critical value is computed here, not tabled: the regularised upper incomplete gamma
  // (series below a + 1, Lentz's continued fraction above) over ln-Gamma (Lanczos, g = 7), inverted by
  // bisection. No dependency; the standard table's p = 0.001 values are asserted below for every n the
  // corpus holds.
  const LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  /** @param {number} z @returns {number} */
  function lnGamma(z) {
    if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lnGamma(1 - z);
    const w = z - 1;
    let x = LANCZOS[0];
    for (let i = 1; i < LANCZOS.length; i += 1) x += LANCZOS[i] / (w + i);
    const t = w + 7.5;
    return 0.5 * Math.log(2 * Math.PI) + (w + 0.5) * Math.log(t) - t + Math.log(x);
  }
  /** Q(a, x), the regularised upper incomplete gamma. @param {number} a @param {number} x @returns {number} */
  function upperGammaQ(a, x) {
    const front = Math.exp(-x + a * Math.log(x) - lnGamma(a));
    if (x < a + 1) {
      let term = 1 / a;
      let sum = term;
      for (let k = 1; k < 1000 && term > sum * 1e-16; k += 1) { term *= x / (a + k); sum += term; }
      return 1 - sum * front;
    }
    let b = x + 1 - a;
    let c = 1e300;
    let d = 1 / b;
    let h = d;
    for (let i = 1; i < 1000; i += 1) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d;
      h *= d * c;
      if (Math.abs(d * c - 1) < 1e-16) break;
    }
    return front * h;
  }
  /** The chi-square value exceeded with probability p at df degrees of freedom. @param {number} df @param {number} p */
  function chi2CriticalAt(df, p) {
    let lo = 0;
    let hi = 400;
    for (let i = 0; i < 200; i += 1) {
      const mid = (lo + hi) / 2;
      if (upperGammaQ(df / 2, mid / 2) > p) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }
  const P_001 = 0.001;
  /** One slot's standard deviation under a uniform draw over n. @param {number} n */
  const slotSd = (n) => Math.sqrt((1 / n) * (1 - 1 / n));
  /** BOUND 1: the pooled chi-square at n − 1 degrees of freedom, p = 0.001 (13.816 at n = 3). @param {number} n */
  const chi2Bound = (n) => chi2CriticalAt(n - 1, P_001);
  /** BOUND 2: the deepest pooled departure from 1/n, in points, at today's number of SDs (0.15 at n = 3). @param {number} n */
  const departureBound = (n) => (0.15 * slotSd(n)) / slotSd(3);
  /** BOUND 3: the append share around 1/(n+1), ± 8 % of itself (23-27 % at n = 3). @param {number} n @returns {[number, number]} */
  const appendBand = (n) => [(100 / (n + 1)) * (1 - 0.08), (100 / (n + 1)) * (1 + 0.08)];
  /** The two-sided normal quantile at p, through the same routine (z² is chi-square at 1 df). @param {number} p */
  const zAt = (p) => Math.sqrt(chi2CriticalAt(1, p));
  /** Can a group of `pools` pools of n be tested against BOUND 2 at p = 0.001? @param {number} n @param {number} pools */
  const departureTestable = (n, pools) => departureBound(n) >= (zAt(P_001 / n) * slotSd(n) * 100) / Math.sqrt(pools * SEEDS.length);
  /** …against BOUND 3, over `reads` append reads? @param {number} n @param {number} reads */
  const appendTestable = (n, reads) => 0.08 * (100 / (n + 1))
    >= zAt(P_001) * 100 * Math.sqrt((1 / (n + 1)) * (n / (n + 1)) / reads);
  /** Every pool of three or more variants, grouped by n (ascending). */
  const SWEPT = STATE_POOLS.filter((row) => row.pool.length >= 3);
  /** @type {Map<number, typeof SWEPT>} */
  const BY_N = new Map();
  for (const row of SWEPT) BY_N.set(row.pool.length, [...(BY_N.get(row.pool.length) || []), row]);
  const N_ASC = [...BY_N.keys()].sort((a, b) => a - b);
  /** @param {{desk: string, blockId: string, poolKey: string}} row */
  const poolId = (row) => `${row.desk} :: ${row.blockId} :: ${row.poolKey}`;

  it('⭐ THE n = 3 CASE, TO THE DIGIT: the sweep by n carries today\'s three constants at n = 3', () => {
    expect(chi2Bound(3).toFixed(3), 'BOUND 1 at n = 3').toBe('13.816');
    expect(departureBound(3), 'BOUND 2 at n = 3').toBe(0.15);
    expect(appendBand(3).map((b) => b.toFixed(2)), 'BOUND 3 at n = 3').toEqual(['23.00', '27.00']);
    // The critical value for every n the corpus holds, against the standard table (p = 0.001).
    expect(Object.fromEntries(N_ASC.map((n) => [n, chi2Bound(n).toFixed(3)])), 'the critical value per n').toEqual({
      3: '13.816', 4: '16.266', 5: '18.467', 6: '20.515', 7: '22.458', 8: '24.322', 9: '26.124', 10: '27.877',
      11: '29.588', 12: '31.264', 13: '32.909',
    });
  });

  it('⭐ UNIFORM ON EVERY POOL OF THREE OR MORE, BY n: each group at its own bound, p = 0.001', () => {
    // MEASURED at 6581c349c (BUILD-1-CURE ADDENDUM 3): 781 pools, 7,810,000 reads; per n, chi-square
    // against its bound: 3: 1.701 / 13.816 · 4: 5.629 / 16.266 · 5: 4.734 / 18.467 · 6: 4.295 / 20.515 ·
    // 7: 3.782 / 22.458 · 8: 7.401 / 24.322 · 9: 7.046 / 26.124 · 10: 13.587 / 27.877 · 11: 12.270 /
    // 29.588 · 12: 10.940 / 31.264 · 13: 11.181 / 32.909; the deepest departure against its bound, n = 3
    // 0.0267 / 0.1500 and n = 4 0.0823 / 0.1378 (the two groups large enough to be tested); the deepest
    // per-pool deviation 3.603 SE (DS-POW-5 theocracy slot 1, n = 4).
    //
    // ⛔ TWO FLOORS THIS ARM STILL REFUSES (car 8a): "every pool within 2 SE" (the largest of thousands of
    // standard normal deviations is past 3 SE by construction) and "the pooled share within 2 SE" (a
    // uniform draw lands outside about one time in seven). The chi-square at the 0.001 critical value, an
    // absolute departure in points and a per-pool ceiling that is a uniform draw's tail replace them.
    /** @type {Array<{n: number, pools: number, reads: number, tally: number[], chi2: number, deepest: number, maxZ: number, maxAt: string, ids: string[], locals: number[][]}>} */
    const rows = [];
    /** @type {string[]} */
    const unreachable = [];
    for (const n of N_ASC) {
      const group = BY_N.get(n) || [];
      const tally = new Array(n).fill(0);
      const perPoolSE = (slotSd(n) * 100) / Math.sqrt(SEEDS.length);
      let maxZ = 0;
      let maxAt = '';
      /** @type {number[][]} */
      const locals = [];
      for (const row of group) {
        const { blockId, poolKey, pool } = row;
        const local = new Array(n).fill(0);
        for (const seed of SEEDS) {
          const at = pool.indexOf(drawVariant(pool, blockId, poolKey, seed));
          local[at] += 1;
          tally[at] += 1;
        }
        for (let at = 0; at < n; at += 1) {
          if (local[at] === 0) unreachable.push(`${poolId(row)} slot ${at}`);
          const z = Math.abs((local[at] / SEEDS.length) * 100 - 100 / n) / perPoolSE;
          if (z > maxZ) { maxZ = z; maxAt = `${poolId(row)} slot ${at}`; }
        }
        locals.push(local);
      }
      const reads = group.length * SEEDS.length;
      const expected = reads / n;
      const chi2 = tally.reduce((sum, seen) => sum + ((seen - expected) ** 2) / expected, 0);
      const deepest = Math.max(...tally.map((seen) => Math.abs((seen / reads) * 100 - 100 / n)));
      rows.push({ n, pools: group.length, reads, tally, chi2, deepest, maxZ, maxAt, ids: group.map(poolId), locals });
    }
    console.log(`\nTHE SWEEP BY n · ${SWEPT.length} pools of three or more\n${rows.map((r) => `  n=${r.n} pools ${r.pools}`
      + ` · chi-square ${r.chi2.toFixed(3)} / ${chi2Bound(r.n).toFixed(3)}`
      + ` · deepest ${r.deepest.toFixed(4)} / ${departureBound(r.n).toFixed(4)}${departureTestable(r.n, r.pools) ? '' : ' (too few pools: listed)'}`
      + ` · max z ${r.maxZ.toFixed(3)}`).join('\n')}\n`);
    // BOUND 1, every group.
    expect(rows.filter((r) => !(r.chi2 < chi2Bound(r.n))).map((r) => `n=${r.n}: chi-square ${r.chi2}`),
      'a group over its chi-square bound').toEqual([]);
    // BOUND 2, every group large enough to be tested at p = 0.001…
    expect(rows.filter((r) => departureTestable(r.n, r.pools) && !(r.deepest < departureBound(r.n)))
      .map((r) => `n=${r.n}: deepest ${r.deepest}`), 'a group over its departure bound').toEqual([]);
    // …and the groups too small for it, NAMED (measured at 6581c349c; a group that grows into the test leaves this list).
    expect(rows.filter((r) => !departureTestable(r.n, r.pools)).map((r) => `n=${r.n}: ${r.pools} pools`),
      'the groups too small to test the departure at p = 0.001').toEqual([
      'n=5: 43 pools', 'n=6: 40 pools', 'n=7: 35 pools', 'n=8: 8 pools', 'n=9: 7 pools', 'n=10: 6 pools',
      'n=11: 3 pools', 'n=12: 1 pools', 'n=13: 2 pools',
    ]);
    // The per-pool ceiling and the slot reach, every pool of every group.
    const worst = rows.reduce((a, b) => (b.maxZ > a.maxZ ? b : a));
    expect(worst.maxZ, `the deepest per-pool deviation, at ${worst.maxAt}`).toBeLessThan(4.5);
    expect(unreachable, 'an unreachable slot').toEqual([]);
    // Non-vacuity: the floor over the widened class.
    expect(SWEPT.length, 'pools of three or more swept').toBeGreaterThanOrEqual(500);
    // ⭐ GUARD (ii): THE n = 3 GROUP IS THE OLD SWEEP. The same pools as the old `length === 3` filter, and
    // the old run's own figures and verdicts over the same draws, printed beside the new ones. At
    // 82164879d the old row measured 486 pools, 4,860,000 reads, tally 1619682/1621300/1619018,
    // chi-square 1.7008938271604936, deepest 0.02674897119341324, max z 3.4294678887547416 at
    // economy :: DS-ECO-11 :: TERRAIN: Forest slot 1.
    const three = rows.find((r) => r.n === 3);
    expect(three?.ids, 'the n = 3 group is the old sweep\'s pools').toEqual(
      STATE_POOLS.filter((row) => row.pool.length === 3).map(poolId));
    const oldSE = Math.sqrt((1 / 3) * (2 / 3) / SEEDS.length) * 100;
    const oldMaxZ = Math.max(...(three?.locals || []).flatMap((local) => local
      .map((seen) => Math.abs((seen / SEEDS.length) * 100 - 100 / 3) / oldSE)));
    console.log(`  n=3 new: chi-square ${three?.chi2} · deepest ${three?.deepest} · max z ${three?.maxZ}`
      + `\n  n=3 old: chi-square ${three?.chi2} · deepest ${three?.deepest} · max z ${oldMaxZ} (old SE form)\n`);
    expect(three?.maxZ.toFixed(10), 'the old per-pool SE form reads the same deviation').toBe(oldMaxZ.toFixed(10));
    expect([
      (three?.chi2 ?? Infinity) < 13.816, (three?.deepest ?? Infinity) < 0.15, oldMaxZ < 4.5,
    ], 'the old run\'s three verdicts, its own constants').toEqual([
      (three?.chi2 ?? Infinity) < chi2Bound(3), (three?.deepest ?? Infinity) < departureBound(3), (three?.maxZ ?? Infinity) < 4.5,
    ]);
    // ⭐ AN EXPLICIT PER-TEST BUDGET CARRYING THE MEASURED FIGURE (LT28 car 2, 2026-09-15): the cure
    // `scripts/check-test-ratchet.mjs` names — never bank a row in the census, never raise the
    // suite-wide testTimeout. The three-variant row cost 7,483 ms alone at load 3.14 and was killed at
    // 61,996 ms inside a full ratchet run (an 8.3x contention multiple); 120_000 was set on that. The
    // widened row is MEASURED in the commit that widened it: 11,968 ms alone (6581c349c's corpus, 7,810,000
    // reads, through the gate mutex), a tenth of its 120_000; the budget is not raised.
    //
    // ⛔ THE READ COUNT IS NOT THE THING TO CUT: 10,000 seeds per pool is what gives each group's
    // chi-square its power.
  }, 120_000);

  it('⭐ APPEND-SAFE BY n: a new wording moves about 1/(n+1) of a pool\'s reads, and every mover moves TO it', () => {
    // THE ROW'S GROUND, and the reason the modulus is measured in the same loop. On the shipped `% length`
    // draw an appended wording re-rolls about n/(n+1) of a pool's reads and most movers land on a
    // DIFFERENT OLD wording, which reads to a player as the sentence they had being rewritten. Under law 6
    // a mover can only land on the newcomer. 2,000 of the 10,000 seeds: the property is exact rather than
    // statistical, so more seeds buy wall-clock rather than confidence.
    //
    // MEASURED at 6581c349c (BUILD-1-CURE ADDENDUM 3), the share moved against its band per n: 3: 24.994 /
    // 23.000-27.000 · 4: 19.840 / 18.400-21.600 · 5: 16.719 / 15.333-18.000 · 6: 14.294 / 13.143-15.429 ·
    // 7: 12.423 / 11.500-13.500 · 8: 10.931 / 10.222-12.000; every mover to the new wording, none between
    // two old ones, in every group.
    const APPEND_SEEDS = SEEDS.slice(0, 2000);
    /** @type {Array<{n: number, pools: number, reads: number, moved: number, toNew: number, modMoved: number, modToNew: number}>} */
    const rows = [];
    const betweenOld = [];
    for (const n of N_ASC) {
      const group = BY_N.get(n) || [];
      let moved = 0;
      let toNew = 0;
      let modMoved = 0;
      let modToNew = 0;
      for (const row of group) {
        const { blockId, poolKey, pool } = row;
        // A LAWFUL APPEND: the NEXT annex row (the pool's own numbering, 1-led or 0-led).
        const planted = { angle: 'ledger', text: 'the planted wording', slots: [], vid: pool[pool.length - 1].vid + 1 };
        const grown = [...pool, planted];
        for (const seed of APPEND_SEEDS) {
          const wasStable = drawVariant(pool, blockId, poolKey, seed);
          const nowStable = drawVariant(grown, blockId, poolKey, seed);
          if (wasStable !== nowStable) {
            moved += 1;
            if (nowStable === planted) toNew += 1;
            else betweenOld.push(`${poolId(row)} :: v${wasStable.vid} -> v${nowStable.vid}`);
          }
          const wasMod = modulusDraw(pool, blockId, poolKey, seed);
          const nowMod = modulusDraw(grown, blockId, poolKey, seed);
          if (wasMod !== nowMod) {
            modMoved += 1;
            if (nowMod === planted) modToNew += 1;
          }
        }
      }
      rows.push({ n, pools: group.length, reads: group.length * APPEND_SEEDS.length, moved, toNew, modMoved, modToNew });
    }
    const share = (/** @type {{moved: number, reads: number}} */ r) => (r.moved / r.reads) * 100;
    console.log(`\nAPPEND BY n\n${rows.map((r) => `  n=${r.n} pools ${r.pools} · moved ${share(r).toFixed(3)} %`
      + ` / ${appendBand(r.n).map((b) => b.toFixed(3)).join('-')}${appendTestable(r.n, r.reads) ? '' : ' (too few pools: listed)'}`
      + ` · modulus ${((r.modMoved / r.reads) * 100).toFixed(3)} %, ${((r.modToNew / r.modMoved) * 100).toFixed(3)} % of it to the new`)
      .join('\n')}\n`);
    // ⛔ THE PROPERTY, not the percentage: NOT ONE read moves between two old wordings, in any group.
    expect(betweenOld.slice(0, 5), 'a read that moved between two OLD wordings').toEqual([]);
    expect(rows.filter((r) => r.moved !== r.toNew).map((r) => `n=${r.n}`), 'and every mover moved to the new wording').toEqual([]);
    // BOUND 3, every group large enough to be tested at p = 0.001…
    expect(rows.filter((r) => appendTestable(r.n, r.reads)
      && !(share(r) > appendBand(r.n)[0] && share(r) < appendBand(r.n)[1])).map((r) => `n=${r.n}: ${share(r)} %`),
    'a group outside its append band').toEqual([]);
    // …and the groups too small for it, NAMED (measured at 6581c349c).
    expect(rows.filter((r) => !appendTestable(r.n, r.reads)).map((r) => `n=${r.n}: ${r.pools} pools`),
      'the groups too small to test the append share at p = 0.001').toEqual([
      'n=9: 7 pools', 'n=10: 6 pools', 'n=11: 3 pools', 'n=12: 1 pools', 'n=13: 2 pools',
    ]);
    // And the contrast the row rests on, the n = 3 case, where its constants were measured: the modulus
    // moves about three quarters of the reads and only a third of THOSE land on the newcomer.
    const three = rows.find((r) => r.n === 3);
    const modulusShare = three ? (three.modMoved / three.reads) * 100 : 0;
    const modulusToNewShare = three ? (three.modToNew / three.modMoved) * 100 : 100;
    expect(modulusShare).toBeGreaterThan(70);
    expect(modulusShare).toBeLessThan(80);
    expect(modulusToNewShare).toBeLessThan(40);
    // ⭐ GUARD (ii): the n = 3 group under the old band reads the old verdict. At 82164879d the old row
    // measured 486 pools, 972,000 reads, 242,939 moved, all to the new wording (24.99372427983539 %);
    // the modulus 728,702 moved (74.969341563786 %), 242,536 to the new (33.283290014299396 %).
    expect(three ? share(three) > 23 && share(three) < 27 : false, 'the old band\'s verdict')
      .toBe(three ? share(three) > appendBand(3)[0] && share(three) < appendBand(3)[1] : true);
    // Non-vacuity: the floor over the widened class.
    expect(rows.reduce((n, r) => n + r.reads, 0), 'the reads measured').toBeGreaterThanOrEqual(500 * APPEND_SEEDS.length);
    // An explicit per-test budget on the same ground as the row above: the three-variant row cost 3,899 ms
    // alone at load 3.14, and the 8.3x contention multiple put its worst case near 32 s; 60_000 is about
    // 2x that. The widened row is MEASURED in the commit that widened it: 5,916 ms alone (1,562,000 reads,
    // through the gate mutex), under a tenth of its 60_000; the budget is not raised.
  }, 60_000);

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

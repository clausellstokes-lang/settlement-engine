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
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

/** A shipped pool every variant of which names {settlement} and nothing else. */
const PROSPERITY = { block: 'DS-ECO-8', pool: 'SUBSISTENCE' };

describe('the state-prose reader — anchored liveness', () => {
  it('offers the settlement-naming rung only while the town has a name', () => {
    const pool = DOSSIER_STATE_PROSE_ECONOMY[PROSPERITY.block].pools[PROSPERITY.pool];
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

  it('substitutes the fill and leaves no placeholder behind', () => {
    const line = readStateProse(
      DOSSIER_STATE_PROSE_ECONOMY, PROSPERITY.block, PROSPERITY.pool,
      { slots: { settlement: 'Thornwall' }, seed: 'save-1::eco-8', audience: AUDIENCE_DM },
    );
    expect(line?.text).toBeTruthy();
    expect(line?.text).not.toMatch(/\{[a-z_]+\}/i);
  });

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
    expect(unknown).not.toContain(covert[0]);
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
  it('draws the same sentence for the same seed and the same state, every time', () => {
    const args = [DOSSIER_STATE_PROSE_ECONOMY, PROSPERITY.block, PROSPERITY.pool,
      { slots: { settlement: 'Thornwall' }, seed: 'world-7::DS-ECO-8', audience: AUDIENCE_DM }];
    const first = readStateProse(...args);
    for (let i = 0; i < 20; i++) expect(readStateProse(...args)).toEqual(first);
  });

  it('reads canonical-at-zero when there is no seed', () => {
    const pool = DOSSIER_STATE_PROSE_ECONOMY[PROSPERITY.block].pools[PROSPERITY.pool];
    const seedless = readStateProse(DOSSIER_STATE_PROSE_ECONOMY, PROSPERITY.block, PROSPERITY.pool,
      { slots: { settlement: 'Thornwall' } });
    expect(seedless?.text).toBe(pool[0].text.replace('{settlement}', 'Thornwall'));
  });
});

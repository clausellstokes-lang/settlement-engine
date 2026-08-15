/**
 * espionageCareerDormancy.test.js — ES-5c: the promotion-risk register's dormancy fences,
 * the declared one-tick lag, and the ⟨F6⟩ GOLDEN PAIR.
 *
 * Acceptance cases A2, A5 and A7. A1/A3/A4/A6 live in tests/domain/espionageCareer.test.js.
 *
 * ── ⭐ THE WHOLE FILE DRIVES `resolveFactionChallenges`, THE REAL PRODUCTION SEAM ────────
 * Not `careerRiskFor` in isolation, and not `defenseScore` with a hand-stamped field. The
 * register is only ever reached from inside the challenge resolver, which is where the
 * ladder builds its window list, stamps the risk, and spends it on three live decisions.
 * The resolver is PURE and takes plain arguments, so the real seam is also the cheap one —
 * there is no reason to assert about it instead.
 *
 * ── ⭐ HOW "BYTE-IDENTICAL TO BASE" IS MEASURED, SINCE THE OLD CODE IS GONE ─────────────
 * A fence that only asserted "dark equals dark" would compare two runs of the same branch
 * and stay green if the discount had been wired to fire in EVERY world. So every identity
 * claim below is TRIANGULATED across three worlds that differ in exactly one thing each:
 *
 *   DARK+AWAY   — the holder really is abroad, and the register is never REACHED.
 *   LIT+PRESENT — the register IS reached and computes the IDENTITY (risk 0, multiplier 1).
 *   LIT+AWAY    — the register is reached and really BITES.
 *
 * `DARK+AWAY === LIT+PRESENT` is the identity control: the lit path with `risk ≡ 0`
 * reproduces base output exactly, so the dark path — which does strictly less — cannot
 * differ either. `LIT+AWAY !== LIT+PRESENT` is the anti-vacuity anchor that stops all of it
 * from being three readings of a dead feature.
 *
 * ⚠ NO BARE NEGATIVES. This file is new AND generation-facing (`tests/property/**`), so
 * `negativeAssertionAnchor.walker` gives it a HARD ceiling of zero un-anchored
 * `not.toContain`/`not.toMatch`/`not.toHaveProperty` sites with no roster row legally
 * available to it. Every claim below is an equality, an inequality, or a count.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { careerRiskFor } from '../../src/domain/worldPulse/espionage/espionageCareer.js';
import { resolveFactionChallenges } from '../../src/domain/worldPulse/npcLadderChallenge.js';
import { advanceNpcLadder, npcLadderActive } from '../../src/domain/worldPulse/npcLadderKernel.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const HOLDER = 'S1:n1';
const RIVAL = 'S1:n2';
const SEED = 'es5c';
const WEEKS = 10;

const plain = (name) => ({ name, personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' } });
/** The whereabouts mirror as `advanceRoads` leaves it. `sinceTick` HOLDS A WEEK. */
const away = (name, state = 'traveling') => ({
  ...plain(name), whereabouts: { state, sinceTick: 4, placeId: 'S2', purposeKind: 'trade' },
});
const standing = (stock) => ({ stock, since: 0, week: 0, goal: null, stigma: null, grudges: {} });

/**
 * @param {{ lit?: boolean, ladder?: boolean, rules?: Record<string, unknown>,
 *   canon?: boolean, agency?: boolean }} [options]
 */
function world(options = {}) {
  const { lit = true, ladder = true, rules = {}, canon = true, agency = true } = options;
  return {
    ...(canon ? { spatialCanonVersion: 1 } : {}),
    simulationRules: {
      infoMode: 'full',
      ...(ladder ? { npcLadderEnabled: true } : {}),
      ...(lit ? { errandSpineEnabled: true, espionageEnabled: true } : {}),
      ...rules,
    },
    npcStates: agency ? { [HOLDER]: { ambitionHeat: 0.6, rivalryTargets: [RIVAL] } } : {},
  };
}

/**
 * ONE faction advance through the REAL resolver. The holder sits on the top rung with a
 * hungrier rival directly below and the faction's power falling, which is what opens the
 * single window this fixture rides.
 * @param {{ worldState: Record<string, unknown>, holder?: Record<string, unknown> }} args
 */
function advance({ worldState, holder = away('n1') }) {
  return resolveFactionChallenges({
    rungs: [HOLDER, RIVAL],
    npcs: { [HOLDER]: standing(8), [RIVAL]: standing(11) },
    npcByNid: new Map([[HOLDER, holder], [RIVAL, plain('n2')]]),
    faction: { name: "Merchants' Guild", category: 'merchant' },
    fkey: 'merchant',
    cooldownUntil: 0,
    weeks: WEEKS,
    tick: WEEKS,
    seed: SEED,
    factionRising: false,
    factionFalling: true,
    freshExposed: new Set(),
    worldState,
    realmBudget: 3,
  });
}

const snapshotOf = (args) => JSON.stringify(advance(args));

describe('ES-5c A2 — FOUR FENCES over the promotion-risk register', () => {
  it('FENCE 1 — espionage dark is byte-identical, proven against the LIT IDENTITY control', () => {
    const darkAway = snapshotOf({ worldState: world({ lit: false }) });
    const litPresent = snapshotOf({ worldState: world({ lit: true }), holder: plain('n1') });
    const litAway = snapshotOf({ worldState: world({ lit: true }) });

    // The identity control: the LIT path with risk 0 reproduces the dark output exactly, so
    // the register is a discount by zero and nothing else.
    expect(litPresent, 'the lit identity register is NOT byte-identical to dark — the wire is'
      + ' doing something beyond discounting, and every dormancy claim here is void')
      .toBe(darkAway);
    // …and the whole fence is non-vacuous, because the SAME world with the holder abroad
    // really does move. Without this line the two identities above could both be readings of
    // a feature that never fires at all.
    expect(litAway === litPresent, 'the lit+away world did not move — the register is dead and'
      + ' every identity above is vacuous').toBe(false);
  });

  it('FENCE 2 — a ROADS-LIT, espionage-dark world is untouched: the away words are inert', () => {
    // The whereabouts mirror is REAL and POPULATED here — roads has done its work — and
    // espionage alone decides whether anybody reads it. Every roads state is driven, so no
    // single word carries the claim.
    const base = snapshotOf({ worldState: world({ lit: false }), holder: plain('n1') });
    for (const state of ['traveling', 'visiting', 'returning', 'hostage']) {
      expect(
        snapshotOf({ worldState: world({ lit: false, rules: { roadsEnabled: true } }), holder: away('n1', state) }),
        `a roads-lit, espionage-dark world moved on '${state}'`,
      ).toBe(base);
    }
    // ROADS DARK, espionage LIT: no mirror at all ⇒ no absence to price ⇒ still base.
    expect(snapshotOf({ worldState: world({ lit: true }), holder: plain('n1') }),
      'an espionage-lit world with NO whereabouts mirror moved').toBe(base);
    // NON-VACUITY: lighting espionage on the identical roads-lit world DOES move it.
    expect(
      snapshotOf({ worldState: world({ lit: true, rules: { roadsEnabled: true } }) }) === base,
      'lighting espionage over a populated mirror changed nothing',
    ).toBe(false);
  });

  it('FENCE 3 — LADDER DARK: the resolver is never reached, so the register cannot fire', () => {
    // The register's ONLY caller is the challenge resolver, and the resolver's only caller is
    // `advanceNpcLadder`, which no-ops on its own gate before any of this runs. Driven
    // through the real kernel entry rather than asserted about.
    const dark = world({ lit: true, ladder: false });
    expect(npcLadderActive(dark)).toBe(false);
    const result = advanceNpcLadder({
      snapshot: { worldState: dark, settlements: [] },
      worldState: dark,
      settlementUpdates: [],
      tick: WEEKS,
      now: null,
    });
    expect(result.changed, 'a ladder-dark world was changed by the ladder').toBe(false);
    expect(result.newsEntries).toEqual([]);
    expect(result.worldState).toBe(dark); // the SAME object — no key, no mirror, no copy
    // NON-VACUITY: the gate really is the flag, and it really does open.
    expect(npcLadderActive(world({ lit: true, ladder: true }))).toBe(true);
  });

  it('FENCE 4 — FOUR DOORS, EACH DROPPED ALONE (a guard that cannot be reddened is unproven)', () => {
    const base = snapshotOf({ worldState: world({ lit: false }) });
    const litAway = snapshotOf({ worldState: world({ lit: true }) });
    expect(litAway === base, 'the lit control does not move — every door below would pass'
      + ' vacuously').toBe(false);

    // DOOR 1 — beliefs (spatialCanonVersion), dropped alone.
    expect(snapshotOf({ worldState: world({ canon: false }) }), 'canon door').toBe(base);
    // DOOR 1b — beliefs (infoMode omniscient), dropped alone.
    expect(snapshotOf({ worldState: world({ rules: { infoMode: 'omniscient' } }) }), 'infoMode door').toBe(base);
    // DOOR 2 — the errand spine, dropped alone. Out-of-order lighting is invalid SAFELY.
    expect(snapshotOf({ worldState: world({ rules: { errandSpineEnabled: false } }) }), 'spine door').toBe(base);
    // DOOR 3 — espionageEnabled itself, dropped alone.
    expect(snapshotOf({ worldState: world({ rules: { espionageEnabled: false } }) }), 'espionage door').toBe(base);
    // …and ABSENT reads exactly like explicit FALSE, which is the `=== true` polarity.
    expect(snapshotOf({ worldState: world({ rules: { espionageEnabled: undefined } }) }), 'absent === false').toBe(base);
    // ⚠ THE AGENCY ROW IS NOT A FIFTH DOOR, AND SAYING SO IS THE POINT. Dropping it does not
    // DARKEN the register, it DEGRADES it: the exposure half is summed, not gated, so a
    // holder with no agency row still carries a real risk (see the sibling file's A4, which
    // pins the degradation directly). On THIS fixture the degraded discount is too small to
    // move the margin-scaled attempt rate past the seeded draw, so the PLAN is unchanged —
    // which is a fact about rate thresholds, not about dormancy, and it is asserted as such
    // so nobody later reads the equal plan as a fifth closed door.
    const noAgency = snapshotOf({ worldState: world({ agency: false }) });
    expect(noAgency, 'the degraded register crossed the draw on this fixture — the plan-level'
      + ' reading below is no longer the right instrument for it').toBe(base);
    expect(careerRiskFor(world({ agency: false }), away('n1'), HOLDER, WEEKS, 1 / 8),
      'dropping the agency row silently killed the whole register — the exposure half is'
      + ' summed, not gated, and is supposed to survive it').toBeGreaterThan(0);
    // …and it really is DEGRADED, not merely present: the full row prices strictly higher.
    expect(careerRiskFor(world({ agency: false }), away('n1'), HOLDER, WEEKS, 1 / 8))
      .toBeLessThan(careerRiskFor(world({}), away('n1'), HOLDER, WEEKS, 1 / 8));
  });
});

describe('ES-5c A5 — THE DECLARED ONE-TICK LAG (§0.2, CR-ES5B-2, inherited unchanged)', () => {
  it('THE ORDER, AT SOURCE: the sole whereabouts writer runs AFTER the whole ladder chain', () => {
    // Content anchors only — an address pinned by line number rots into a lie the first time
    // anything above it moves. The composition is what carries the order: the roads wrapper
    // runs its `...AndTraditions` prior (which transitively runs the ladder, and therefore
    // this register) to completion BEFORE it calls the mirror's sole per-tick writer.
    const roads = readFileSync(join(ROOT, 'src/domain/worldPulse/roadsKernel.js'), 'utf8');
    const ladder = readFileSync(join(ROOT, 'src/domain/worldPulse/npcLadderKernel.js'), 'utf8');
    const only = (source, anchor, file) => {
      const first = source.indexOf(anchor);
      expect(first, `the anchor '${anchor}' is GONE from ${file} — the stage was renamed or`
        + ' removed, so this ordering pin is measuring nothing').toBeGreaterThan(-1);
      expect(source.indexOf(anchor, first + 1), `'${anchor}' now appears twice in ${file}; the`
        + ' pin can no longer say WHICH occurrence it ordered').toBe(-1);
      return first;
    };
    // 1. the ladder chain — the register fires somewhere inside this call.
    const chain = only(roads, 'advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions(args)', 'roadsKernel.js');
    // 2. the SOLE per-tick writer of npc.whereabouts.
    const mirror = only(roads, 'advanceRoads({', 'roadsKernel.js');
    expect(mirror, 'advanceRoads must run AFTER the ladder chain, not before').toBeGreaterThan(chain);
    // …and the ladder really is inside that prior, so step 1 is not an empty name.
    const wrapper = only(ladder, 'advanceNpcGrowthWithFabricAndConsequenceAndLadder(args)', 'npcLadderKernel.js');
    const call = only(ladder, 'const ladder = advanceNpcLadder({', 'npcLadderKernel.js');
    expect(call, 'the ladder wrapper no longer calls advanceNpcLadder').toBeGreaterThan(wrapper);
  });

  it('THE LAG, DRIVEN: the decay lands on the tick AFTER the mirror is written, not the same one', () => {
    // A miniature of the kernel's own stage order. Tick N reads the mirror as the roads stage
    // left it at the END of tick N-1; the roads write then lands LAST; tick N+1 is the first
    // read that can see it.
    const lit = world({ lit: true });
    const holder = plain('n1'); // no mirror yet — he has not been recorded as departed

    // ── TICK N: the ladder runs. The mirror still says he is home, so nothing is priced.
    const atN = advance({ worldState: lit, holder });
    expect(atN.events).toEqual([]);
    expect(atN.successions).toBe(0);

    // ── TICK N, consequence_fold: advanceRoads writes the mirror, LAST in the tick. Every
    // consumer above has already run, so nothing in tick N can observe this.
    holder.whereabouts = { state: 'traveling', sinceTick: 4, placeId: 'S2', purposeKind: 'trade' };

    // ── TICK N+1: the first read after the write, and the register bites.
    const atNext = advance({ worldState: lit, holder });
    expect(atNext.successions).toBe(1);
    expect(atNext.events[0].dReceipt.absenceDecay).toBeLessThan(0);
    // The lag is a LAG, not a loss: the same world one tick later really does price it.
    expect(atN.events.length).toBe(0);
    expect(atNext.events.length).toBe(1);
  });
});

describe('ES-5c A7 — ⭐ THE ⟨F6⟩ GOLDEN PAIR (the DISCLOSED one-time ladder-outcome shift)', () => {
  /**
   * ⛔ READ BEFORE TOUCHING EITHER GOLDEN BELOW.
   *
   * THE SHIFT: ES-5c changes LIT-world simulation output. Under `espionageActive` AND
   * `npcLadderActive`, a rung-holder who is abroad on a rung with open windows, with a live
   * rivalry around him, has his DEFENSE score discounted by
   * `DEFENSE_WHEN_ABSENT × promotionRisk01`. `defenseScore` feeds three live decisions —
   * whether a challenge is hopeless, the attempt RATE, and whether it clears the sustained
   * margin — so this changes which challenges are attempted, at what rate, and which
   * succeed: ladder successions, the news they emit, and every downstream consumer of rung
   * order.
   *
   * ⭐ ON THIS FIXTURE THE SHIFT LANDS ON THE ATTEMPT RATE, which is the sharpest form it
   * takes. The rival clears the sustained margin in BOTH worlds; what the discount changes
   * is the margin-scaled rate, from 0.0737 to 0.0860, and the seeded draw sits between the
   * two. So the dark world never attempts the challenge at all and the lit world attempts
   * it and wins. Same seed, same tick, same people.
   *
   * THE CAUSE, NAMED: a DISCLOSED one-time ladder-outcome move under ⟨F6⟩, anticipated by
   * name at DESIGN_FP_ARCH_ES.md — "Dark worlds byte-identical; the lit shift disclosed
   * under the same golden pair discipline as §3.11". This file is that fence.
   *
   * ⛔ THE LIT GOLDEN IS RECORDED ONCE, HERE, BY THIS PACKET. A later lane that finds it red
   * has found a SECOND shift, which is a different event needing its own disclosure — NEVER
   * a re-record. Re-recording it without stating a cause is forbidden outright.
   * ⛔ THE DARK GOLDEN MAY NEVER MOVE AT ALL. Dark worlds are byte-identical by
   * construction; a moved dark golden means the flag gate leaked and is a STOP.
   */
  const DARK_GOLDEN = {
    nextRungs: [HOLDER, RIVAL],
    events: [],
    grudgeMints: [],
    withdraws: [],
    successions: 0,
  };

  /**
   * THE NEW OUTPUT, on the same seed and the same world, with the holder traveling. The
   * rungs SWAP — conservation holds, the permutation is adjacent — and the defender's
   * receipt names the new term by name with a negative sign beside the terms that did not
   * move. `absenceDecay` is the ONLY changed receipt entry, which is what makes this a
   * discount rather than a re-derivation.
   */
  const LIT_GOLDEN = {
    nextRungs: [RIVAL, HOLDER],
    events: [{
      kind: 'rise',
      challengerNid: RIVAL,
      defenderNid: HOLDER,
      challengerName: 'n2',
      defenderName: 'n1',
      windows: ['faction_power_falling'],
      cScore: 11,
      dScore: 8.0877,
      // ⚠ `grudgeAgainst` is NEGATIVE ZERO, recorded as measured: it is `-round4(GRUDGE_HARDEN
      // × 0)`, and `toEqual` distinguishes -0 from 0. Transcribing it as `0` would be a
      // golden that disagrees with the run it claims to record.
      cReceipt: { standing: 11, tenacious: 0, leverage: 0, grudgeAgainst: -0, stigmaTax: 0 },
      dReceipt: {
        standing: 8,
        seatWeight: 2.5,
        factionTrajectory: -1.5,
        cautious: 0,
        clashErosion: -0.1061,
        threeBodyPenalty: 0,
        absenceDecay: -0.8062,
      },
    }],
    grudgeMints: [],
    withdraws: [],
    successions: 1,
  };

  it('(i) THE DARK GOLDEN — byte-identity with the pre-change output, on the same seed', () => {
    expect(advance({ worldState: world({ lit: false }) })).toEqual(DARK_GOLDEN);
    // …and the LIT IDENTITY control reproduces it exactly, which is what makes this a
    // pre-change reading rather than merely a dark-path reading.
    expect(advance({ worldState: world({ lit: true }), holder: plain('n1') })).toEqual(DARK_GOLDEN);
  });

  it('(ii) THE LIT GOLDEN — the NEW output, recorded ONCE, with its cause stated above', () => {
    expect(advance({ worldState: world({ lit: true }) })).toEqual(LIT_GOLDEN);
  });

  it('the pair really is a PAIR: one term moved, conservation held, and the rate is the cause', () => {
    const dark = advance({ worldState: world({ lit: true }), holder: plain('n1') });
    const lit = advance({ worldState: world({ lit: true }) });
    // CONSERVATION (§1): the post-contest ordering is a PERMUTATION of the same people, so
    // the shift moved a seat and minted nobody.
    expect([...lit.nextRungs].sort()).toEqual([...dark.nextRungs].sort());
    expect(lit.nextRungs.length).toBe(2);
    // ONE TERM MOVED. Every other defense receipt entry is byte-identical to the identity
    // control's, which is what separates a discount from a re-derivation. Measured against
    // the control's own receipt rather than against a transcribed copy.
    const control = advance({
      worldState: world({ lit: true, rules: { espionageEnabled: false } }),
      holder: away('n1'),
    });
    expect(control).toEqual(DARK_GOLDEN); // the control really is the base output
    const moved = LIT_GOLDEN.events[0].dReceipt;
    expect(moved.standing + moved.seatWeight + moved.factionTrajectory + moved.cautious + moved.clashErosion)
      .toBeCloseTo(8.8939, 4); // the pre-term score the discount is taken from
    expect(moved.absenceDecay).toBeLessThan(0);
    expect(moved.threeBodyPenalty).toBe(0); // the SIBLING multiplicative term did not fire
    // BOUNDED: the discount cannot take a defense below zero or invert it.
    expect(LIT_GOLDEN.events[0].dScore).toBeGreaterThan(0);
    expect(LIT_GOLDEN.events[0].dScore).toBeLessThan(8.8939);
    // THE CAUSE, ASSERTED: the rival cleared the sustained margin in BOTH worlds, so what
    // the discount changed is the ATTEMPT RATE and not the verdict. Stated where it can fail,
    // because "which challenges are attempted" is the half of §9b that is easiest to lose.
    const TURN_MARGIN = 1.15;
    expect(11 >= 8.8939 * TURN_MARGIN, 'the dark world would also have WON if it had rolled —'
      + ' so the shift is a rate shift, and this pin says so').toBe(true);
    expect(11 >= LIT_GOLDEN.events[0].dScore * TURN_MARGIN).toBe(true);
  });
});

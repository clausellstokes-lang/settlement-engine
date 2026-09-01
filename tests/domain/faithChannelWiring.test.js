/**
 * faithChannelWiring.test.js — W-FAITH F4c: the boon/bane channels reach the causal
 * substrate, and the three that cannot are proved inert rather than assumed inert.
 *
 * THE CAR'S CLAIM IN ONE SENTENCE: a deity's authored boon or bane moves the settlement
 * causal variable its channel is bound to, through the projection the pulse writes at
 * tick end, and moves NOTHING at all where no such variable exists.
 *
 * The suite is arranged so that each arm can fail for exactly one reason:
 *
 *   ROW 1  THE REGISTER — total, disjoint, and every binding a real variable with the
 *          right polarity. A structural arm: it can red without any world existing.
 *   ROW 2  THE LIVE WIRING — six deities, six channels, six causal variables, DRIVEN
 *          end to end through `projectReligionStateOntoSettlement` → `deriveCausalState`.
 *          This is the DISCOVERY arm: it is the one that would have stayed green if the
 *          projection never reached the substrate, so it is written to move a score.
 *   ROW 3  THE UNBOUND THREE — authored, projected, derived, and provably without effect
 *          ANYWHERE in the substrate: no key, no contributor, no moved score.
 *   ROW 4  DORMANCY — the estate as it stands. No authored aspect ⇒ no `field` key ⇒ the
 *          whole causal state byte-identical to the same world without this car.
 *   ROW 5  CALIBRATION — the magnitudes, measured rather than asserted, including the
 *          claim that a heavy boon from a dominant patron equals a lawful patron's swing.
 *
 * ⚠ PLAIN LOOPS, NEVER `test.each(<named binding>)`: the lighting census PARKS a file
 * whose `each` table is a named binding, and a parked file's assertions are ones the
 * census cannot vouch for (F3c act 2's J11, paid for once already in this train).
 */
import { describe, test, expect } from 'vitest';
// ⚠ TWO ADDRESSES SINCE SUBSTRATE WAVE 6, and this file is where the split is proved.
// The BINDING and its pricing pair live in the zero-import leaf `faithChannelBindings.js`
// so the EAGER `causalState.js` can price a channel without dragging the field kernel and
// `piety.js` into the first-paint closure; the FIELD keeps everything that needs a
// settlement. Both halves are imported from their own homes rather than through a
// re-export, which is what makes this file the leaf's LIT WALKTHROUGH — the mechanism
// lit-coverage ratchet grants AUTO credit only for a direct import, and a re-export would
// have left the leaf a worldPulse mechanism with no standing lit proof.
import {
  FAITH_CHANNEL_BINDINGS, faithChannelTotalOf, faithChannelLift,
} from '../../src/domain/worldPulse/faithChannelBindings.js';
import {
  FAITH_CHANNELS, FAITH_UNBOUND_CHANNELS, FAITH_FIELD_TUNING, faithFieldProjection,
} from '../../src/domain/worldPulse/faithField.js';
import { projectReligionStateOntoSettlement } from '../../src/domain/worldPulse/religionState.js';
import { deriveCausalState, SYSTEM_VARIABLES, variablePolarity } from '../../src/domain/causalState.js';
import { DEITY_EFFECT_CHANNEL_KEYS } from '../../src/domain/customContentSchema.js';
import { DEITY_LAW_TUNING } from '../../src/domain/corruption.js';

const SAVE_ID = 's.faith';

/** A bare settlement with no faith anything — the dormancy ground. */
const bareSettlement = () => ({
  id: SAVE_ID,
  name: 'Wardsmoor',
  population: 2400,
  config: {},
});

/**
 * One-deity religion state. `share: 100` + `standing: 'ascendant'` + `rankAxis: 'major'`
 * + patron is the LOUDEST lawful pantheon there is: the conserved adherent pool entire,
 * held by one dominant god. Every magnitude in ROW 5 is measured against this maximum.
 * @param {Record<string, unknown>} aspects
 */
const soleDeityState = (aspects) => ({
  patronRef: 'd.a',
  deities: {
    'd.a': {
      deityRef: 'd.a',
      snapshot: { _deityRef: 'd.a', name: 'The Warden', rankAxis: 'major', ...aspects },
      share: 100,
      standing: 'ascendant',
      legitimacy: 0.8,
      niche: 'warden',
      suppressed: false,
    },
  },
});

/** Drive the real seam: project the religion state onto the settlement, exactly as the
 *  pulse does, then derive the substrate from the settlement that came back. Nothing
 *  here hand-builds a `faithProfile` — a fixture that planted the projection itself
 *  would pass even if `projectReligionStateOntoSettlement` never wrote one. */
function driven(aspects) {
  const state = aspects ? soleDeityState(aspects) : null;
  const settlement = state
    ? projectReligionStateOntoSettlement(bareSettlement(), { [SAVE_ID]: state }, SAVE_ID)
    : bareSettlement();
  return { settlement, causal: deriveCausalState(settlement) };
}

/** The projected field record off a driven settlement. The kernel readers take the
 *  RECORD rather than the settlement (the observed-shape ratchet's one-read discipline —
 *  see `faithChannelTotalOf`), so the tests reach it the way `causalState` does: through
 *  the settlement the real projection wrote, never by hand-building one. */
const fieldOf = (settlement) => /** @type {{ faithProfile?: { field?: { channels?: Record<string, number> } } }} */ (
  settlement.config).faithProfile?.field;

describe('ROW 1 — the binding register is total, disjoint and well-formed', () => {
  test('the register partitions FAITH_CHANNELS exactly: bound ∪ unbound, nothing else', () => {
    const bound = Object.keys(FAITH_CHANNEL_BINDINGS);
    const unbound = Object.keys(FAITH_UNBOUND_CHANNELS);
    expect([...bound, ...unbound].sort()).toEqual([...FAITH_CHANNELS].sort());
    // Disjoint: a channel that appeared in both would be simultaneously wired and
    // declared inert, and whichever arm a reader trusted would be the wrong one.
    expect(bound.filter((c) => unbound.includes(c))).toEqual([]);
    // Non-vacuity: an empty register would satisfy a subset test and prove nothing.
    expect(bound.length).toBe(6);
    expect(unbound.length).toBe(3);
  });

  test('the channel vocabulary still matches the authoring wall it mirrors', () => {
    // The kernel MIRRORS DEITY_EFFECT_CHANNEL_KEYS rather than importing it (the pulse
    // must not pull in the authoring wall). A mirror that drifts is worse than no mirror,
    // and this register is now a third thing keyed on the same words.
    expect([...FAITH_CHANNELS]).toEqual([...DEITY_EFFECT_CHANNEL_KEYS]);
  });

  test('every bound channel names a real SYSTEM_VARIABLES member', () => {
    for (const [channel, variable] of Object.entries(FAITH_CHANNEL_BINDINGS)) {
      expect(SYSTEM_VARIABLES, `${channel} → ${variable}`).toContain(variable);
    }
  });

  test('every bound variable is HIGHER_IS_BETTER — the polarity that lets a boon simply add', () => {
    // `applyFaithChannel` has no per-variable sign table: it adds the lift. That is only
    // correct while every bound variable reads higher-is-better. Binding a channel to
    // `criminal_opportunity` (the estate's one lower-is-better variable) would silently
    // invert every boon aimed at it, and nothing else in the tree would notice.
    for (const [channel, variable] of Object.entries(FAITH_CHANNEL_BINDINGS)) {
      expect(variablePolarity(variable), `${channel} → ${variable}`).toBe('higher_is_better');
    }
  });

  test('no two channels are bound to the same variable', () => {
    const targets = Object.values(FAITH_CHANNEL_BINDINGS);
    expect(new Set(targets).size).toBe(targets.length);
  });

  test('every unbound channel carries a written reason, not an empty slot', () => {
    for (const [channel, reason] of Object.entries(FAITH_UNBOUND_CHANNELS)) {
      expect(typeof reason, channel).toBe('string');
      // A reason short enough to be a label is not a measurement. Each of these records
      // WHERE the lane looked and what it found; that is what makes the register vetoable.
      expect(reason.length, `${channel}'s reason is too short to be a finding`).toBeGreaterThan(80);
    }
  });
});

describe('ROW 2 — the live wiring: each bound channel moves its own variable and no other', () => {
  test('a heavy BOON lifts exactly the bound variable, on all six channels', () => {
    // ⭐ THE BASE IS A PANTHEON THAT AUTHORS NOTHING, not a settlement with no pantheon.
    // Both sides therefore carry an identical `faithProfile` and differ by the `field` key
    // ALONE, so a difference this arm reports can only be this car's. A no-religion base
    // would have made every arm below sensitive to anything else the projection writes.
    const base = driven({}).causal;
    for (const [channel, variable] of Object.entries(FAITH_CHANNEL_BINDINGS)) {
      const { causal } = driven({ boonChannel: channel, boonStrength: 'heavy' });
      expect(causal.scores[variable], `${channel} must LIFT ${variable}`)
        .toBeGreaterThan(base.scores[variable]);
      // ⭐ THE ISOLATION ARM, and it is what makes the arm above mean something: every
      // OTHER variable is untouched. Without it, a change that moved all sixteen scores
      // would pass the lift assertion just as happily.
      for (const other of SYSTEM_VARIABLES) {
        if (other === variable) continue;
        expect(causal.scores[other], `${channel} must not touch ${other}`).toBe(base.scores[other]);
      }
    }
  });

  test('a heavy BANE lowers exactly the bound variable, on all six channels', () => {
    const base = driven({}).causal;
    for (const [channel, variable] of Object.entries(FAITH_CHANNEL_BINDINGS)) {
      const { causal } = driven({ baneChannel: channel, baneStrength: 'heavy' });
      expect(causal.scores[variable], `${channel} must LOWER ${variable}`)
        .toBeLessThan(base.scores[variable]);
    }
  });

  test('the contributor receipt names the channel, the direction and the delta', () => {
    const { causal } = driven({ boonChannel: 'harvest', boonStrength: 'heavy' });
    const rows = causal.variables.food_security.contributors.filter((c) => c.source === 'faith.field.harvest');
    expect(rows.length, 'exactly one faith contributor, not zero and not two').toBe(1);
    expect(rows[0].effect).toBe('divine_boon');
    expect(rows[0].delta).toBeGreaterThan(0);
    expect(rows[0].reason).toMatch(/blessing on harvest/);
    // The receipt's delta must BE the movement, not a decoration beside it.
    const base = driven({}).causal;
    expect(causal.scores.food_security - base.scores.food_security).toBe(rows[0].delta);
  });

  test('a bane mints a divine_bane receipt with a negative delta', () => {
    const { causal } = driven({ baneChannel: 'order', baneStrength: 'heavy' });
    const rows = causal.variables.law_order.contributors.filter((c) => c.source === 'faith.field.order');
    expect(rows.length).toBe(1);
    expect(rows[0].effect).toBe('divine_bane');
    expect(rows[0].delta).toBeLessThan(0);
  });

  test('boon and bane on the SAME channel cancel to silence — no key, no contributor', () => {
    // D3 / §5 open question 3: a storm god who blesses AND wrecks the same channel is
    // legal, and equal magnitudes net to nothing. "Nothing" must mean no record at all,
    // not a record worth zero.
    const { settlement, causal } = driven({
      boonChannel: 'trade', boonStrength: 'firm', baneChannel: 'trade', baneStrength: 'firm',
    });
    const cfg = /** @type {{ faithProfile?: { field?: unknown } }} */ (settlement.config);
    expect(cfg.faithProfile?.field).toBeUndefined();
    expect(causal.variables.trade_connectivity.contributors.some((c) => c.source.startsWith('faith.field.'))).toBe(false);
  });
});

describe('ROW 3 — the three unbound channels are provably inert, not merely unwired', () => {
  test('an authored boon on an unbound channel mints NO projected key', () => {
    for (const channel of Object.keys(FAITH_UNBOUND_CHANNELS)) {
      const { settlement } = driven({ boonChannel: channel, boonStrength: 'heavy' });
      const cfg = /** @type {{ faithProfile?: { field?: unknown } }} */ (settlement.config);
      expect(cfg.faithProfile, `${channel}: the faith profile itself must still exist`).toBeTruthy();
      expect(cfg.faithProfile?.field, `${channel} must project no field record`).toBeUndefined();
    }
  });

  test('an authored boon on an unbound channel moves NO causal score anywhere', () => {
    const base = driven({}).causal;
    for (const channel of Object.keys(FAITH_UNBOUND_CHANNELS)) {
      const { causal } = driven({ boonChannel: channel, boonStrength: 'heavy' });
      expect(causal.scores, `${channel} moved a score`).toEqual(base.scores);
      // And no receipt anywhere claims it did — an inert channel that still printed a
      // contributor would be the worst of both, a lie the player could read.
      for (const variable of SYSTEM_VARIABLES) {
        expect(
          causal.variables[variable].contributors.some((c) => c.source.startsWith('faith.field.')),
          `${channel} minted a receipt on ${variable}`,
        ).toBe(false);
      }
    }
  });

  test('the lift function refuses an unbound channel even if a key were somehow present', () => {
    // Belt and braces at the other end of the seam: a hand-planted projection carrying an
    // unbound channel still lifts nothing, so the register is enforced on the READ side
    // too and not only by the projection's narrowing.
    const planted = { channels: { learning: 0.38, harvest: 0.38 } };
    expect(faithChannelTotalOf(planted, 'learning'), 'the raw read is honest about what is there').toBe(0.38);
    expect(faithChannelLift(planted, 'learning'), 'but the lift refuses it').toBe(0);
    // The positive control: the same planted shape DOES lift a bound channel, so the
    // refusal above is about the register and not about a broken reader.
    expect(faithChannelLift(planted, 'harvest')).toBe(8);
  });
});

describe('ROW 4 — dormancy: the estate as it stands today', () => {
  test('a pantheon with no authored aspects projects no field key', () => {
    const { settlement } = driven({});
    const cfg = /** @type {{ faithProfile?: { field?: unknown, piety?: unknown } }} */ (settlement.config);
    expect(cfg.faithProfile).toBeTruthy();
    expect(cfg.faithProfile?.field).toBeUndefined();
  });

  test('⭐ the field key is the ONLY thing this car adds — strip it and the substrate returns exactly', () => {
    // THE PROMISE, stated as the sharpest thing this suite can execute. Take the loudest
    // possible authored world, remove the one key this car mints, and the entire sixteen-
    // variable substrate — scores, bands, summary AND every contributor's reason string —
    // is character-for-character the substrate of the same world with nothing authored.
    //
    // ⚠ THIS IS DELIBERATELY NOT "no-pantheon vs pantheon". That comparison would also
    // sweep up everything else `projectReligionStateOntoSettlement` writes, and would pass
    // or fail for reasons that are not this car's — a green that means less than it looks.
    const authored = driven({ boonChannel: 'harvest', boonStrength: 'heavy' });
    const stripped = JSON.parse(JSON.stringify(authored.settlement));
    expect(stripped.config.faithProfile.field, 'the fixture must actually carry a field to strip').toBeTruthy();
    delete stripped.config.faithProfile.field;
    expect(JSON.stringify(deriveCausalState(stripped))).toBe(JSON.stringify(driven({}).causal));
    // The negative control: WITHOUT the strip the two differ, so the equality above is a
    // measurement rather than a comparison of two identical things.
    expect(JSON.stringify(authored.causal)).not.toBe(JSON.stringify(driven({}).causal));
  });

  test('an absent settlement, an absent config and an unknown channel all read literal 0', () => {
    expect(faithChannelTotalOf(null, 'harvest')).toBe(0);
    expect(faithChannelTotalOf(undefined, 'harvest')).toBe(0);
    expect(faithChannelTotalOf({}, 'harvest')).toBe(0);
    expect(faithChannelTotalOf({ channels: {} }, 'harvest')).toBe(0);
    // The settlement side of the same absence, through the seam a consumer really uses.
    expect(fieldOf(driven({}).settlement)).toBeUndefined();
    expect(faithChannelLift(null, 'harvest')).toBe(0);
    expect(faithChannelLift({ channels: { harvest: 0.38 } }, 'not_a_channel')).toBe(0);
  });

  test('the projection is null for every shape that should produce nothing', () => {
    const s = bareSettlement();
    expect(faithFieldProjection(s, null)).toBeNull();
    expect(faithFieldProjection(s, { deities: {} })).toBeNull();
    expect(faithFieldProjection(s, soleDeityState({}))).toBeNull();
    // A suppressed god is not a voice, however loudly it is authored.
    const suppressed = soleDeityState({ boonChannel: 'harvest', boonStrength: 'heavy' });
    suppressed.deities['d.a'].suppressed = true;
    expect(faithFieldProjection(s, suppressed)).toBeNull();
  });
});

describe('ROW 5 — calibration, measured rather than declared', () => {
  test('⭐ a heavy boon from a dominant patron equals a lawful patron\'s law swing, exactly', () => {
    // THE CALIBRATION CLAIM CAUSAL_SWING WAS CHOSEN TO MAKE TRUE, executed rather than
    // argued: the loudest lawful pantheon (a lone ascendant major patron holding the
    // whole conserved adherent pool, at neutral piety) lifts its variable by exactly
    // DEITY_LAW_TUNING.lawOrderSwing. The two authored deity levers speak at one volume.
    const { settlement } = driven({ boonChannel: 'harvest', boonStrength: 'heavy' });
    expect(faithChannelLift(fieldOf(settlement), 'harvest')).toBe(DEITY_LAW_TUNING.lawOrderSwing);
    expect(DEITY_LAW_TUNING.lawOrderSwing).toBe(8);
  });

  test('the strength ladder is monotone and the faint band is INAUDIBLE at full weight', () => {
    const lift = (strength) => faithChannelLift(
      fieldOf(driven({ boonChannel: 'harvest', boonStrength: strength }).settlement), 'harvest',
    );
    const faint = lift('faint');
    const firm = lift('firm');
    const heavy = lift('heavy');
    expect(heavy).toBeGreaterThan(firm);
    expect(firm).toBeGreaterThan(faint);
    // ⭐ THE SPARSITY PROPERTY, and it is a designed consequence rather than a rounding
    // accident: 0.05 × 1.52 × 20 = 1.52 → 2. A faint boon from the LOUDEST possible
    // patron is worth two points; from anything less it rounds to nothing at all.
    expect(faint).toBe(2);
    expect(firm).toBe(4);
    expect(heavy).toBe(8);
  });

  test('a marginal cult\'s faint boon rounds to silence and mints no receipt', () => {
    const state = soleDeityState({ boonChannel: 'harvest', boonStrength: 'faint' });
    state.deities['d.a'].share = 8;
    state.deities['d.a'].standing = 'cult';
    state.deities['d.a'].snapshot.rankAxis = 'cult';
    state.patronRef = 'd.b';                        // not the patron: no megaphone
    const settlement = projectReligionStateOntoSettlement(bareSettlement(), { [SAVE_ID]: state }, SAVE_ID);
    // 0.05 × (0.08 × 0.35 × 0.25) = 0.00035 → round6 keeps it, but the LIFT rounds to 0.
    expect(faithChannelLift(fieldOf(settlement), 'harvest')).toBe(0);
    const causal = deriveCausalState(settlement);
    expect(causal.variables.food_security.contributors.some((c) => c.source === 'faith.field.harvest')).toBe(false);
  });

  test('the DAMP_MAX backstop is what bounds an UNNORMALISED pantheon, and it is live', () => {
    // A caller who hands in shares that do not conserve is the case the clamp exists for.
    // Ten dominant heavy-boon patrons at 100 share each drive the raw total far past the
    // cap; the clamp holds it at exactly DAMP_MAX, and the lift is that cap × the swing.
    /** @type {{ patronRef: string, deities: Record<string, unknown> }} */
    const state = { patronRef: 'd.0', deities: {} };
    for (let i = 0; i < 10; i += 1) {
      state.deities[`d.${i}`] = {
        deityRef: `d.${i}`,
        snapshot: { _deityRef: `d.${i}`, name: `God ${i}`, rankAxis: 'major', boonChannel: 'harvest', boonStrength: 'heavy' },
        share: 100, standing: 'ascendant', legitimacy: 0.8, suppressed: false,
      };
    }
    const projection = faithFieldProjection(bareSettlement(), state);
    expect(projection).not.toBeNull();
    expect(projection?.channels.harvest).toBe(FAITH_FIELD_TUNING.DAMP_MAX);
    const settlement = projectReligionStateOntoSettlement(bareSettlement(), { [SAVE_ID]: state }, SAVE_ID);
    expect(faithChannelLift(fieldOf(settlement), 'harvest')).toBe(Math.round(FAITH_FIELD_TUNING.DAMP_MAX * FAITH_FIELD_TUNING.CAUSAL_SWING));
    expect(faithChannelLift(fieldOf(settlement), 'harvest')).toBe(12);
  });

  test('the magic gate silences every channel where the world says magic does not exist', () => {
    // D3's ONE chokepoint, proved through the wiring rather than at the kernel: where the
    // dial explicitly says magic is dead, an authored boon reaches no causal variable.
    const dead = bareSettlement();
    dead.config = { magicExists: false, magicLevel: 'none' };
    const state = soleDeityState({ boonChannel: 'harvest', boonStrength: 'heavy' });
    expect(faithFieldProjection(dead, state)).toBeNull();
    // The control: the SAME deity on a settlement whose dial says nothing is NOT silenced,
    // so the arm above is measuring the gate rather than a broken fixture.
    expect(faithFieldProjection(bareSettlement(), state)).not.toBeNull();
  });
});

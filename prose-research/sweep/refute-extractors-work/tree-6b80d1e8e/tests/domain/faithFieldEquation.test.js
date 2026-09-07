/**
 * faithFieldEquation.test.js — W-FAITH F3c act 2: the influence field's equation,
 * its caps, its ONE magic gate, and the dormancy guarantee that lets it land dark.
 *
 * ⚠ EVERY EXPECTED NUMBER BELOW IS COMPUTED BY HAND IN THE COMMENT ABOVE IT, never
 * by re-running the implementation's own arithmetic in the test. A test that
 * recomputes the formula it is checking asserts only that multiplication is
 * deterministic; these assert that the formula is THIS one.
 *
 * The suite is organised as the volume is: the vocabulary mirrors, then the weight,
 * then the aspect term, then the fold, then the caps, then the gate, then dormancy.
 */
import { describe, test, expect } from 'vitest';
import {
  DEITY_EFFECT_CHANNEL_KEYS,
  DEITY_EFFECT_STRENGTH_KEYS,
} from '../../src/domain/customContentSchema.js';
import { PIETY_TUNING } from '../../src/domain/worldPulse/piety.js';
import { DEITY_RANK_STRENGTH } from '../../src/domain/worldPulse/cultImpositionApply.js';
import {
  FAITH_CHANNELS,
  FAITH_STRENGTHS,
  FAITH_FIELD_TUNING,
  FAITH_FIELD_DOOR,
  magicGate01,
  standingWeight,
  memberWeight,
  aspectTerm,
  faithFieldOf,
  faithChannelMult,
  faithFieldProjection,
} from '../../src/domain/worldPulse/faithField.js';

/** A pantheon member, shaped as `religionState` writes one. */
function member({ ref = 'd.one', rank = 'major', share = 100, standing = 'ascendant', suppressed = false, ...aspects } = {}) {
  return {
    deityRef: ref,
    snapshot: { name: ref, rankAxis: rank, ...aspects },
    share,
    standing,
    suppressed,
  };
}

/** A religion state over the given members; the first is the patron unless told otherwise. */
function state(members, patronRef) {
  /** @type {Record<string, any>} */
  const deities = {};
  for (const m of members) deities[m.deityRef] = m;
  return { deities, patronRef: patronRef === undefined ? members[0]?.deityRef ?? null : patronRef };
}

/** A settlement with no magic record and no piety record: gate 1, piety 1. */
const BARE = Object.freeze({ id: 's.bare', config: {} });

describe('THE VOCABULARY MIRRORS — they cannot silently rot', () => {
  test('FAITH_CHANNELS is DEITY_EFFECT_CHANNEL_KEYS, in order', () => {
    // Mirrored rather than imported (the pulse must not pull the authoring wall in);
    // pinned here exactly as F1c pinned its three mirrors and F2c pinned TEMPER_WORDS.
    expect([...FAITH_CHANNELS]).toEqual([...DEITY_EFFECT_CHANNEL_KEYS]);
    expect(FAITH_CHANNELS.length).toBe(9);
  });

  test('FAITH_STRENGTHS is DEITY_EFFECT_STRENGTH_KEYS, and the tuning table covers exactly it', () => {
    expect([...FAITH_STRENGTHS]).toEqual([...DEITY_EFFECT_STRENGTH_KEYS]);
    expect(Object.keys(FAITH_FIELD_TUNING.STRENGTH).sort()).toEqual([...FAITH_STRENGTHS].sort());
  });

  test('the saturation cap IS the piety module\'s DAMP_MAX, by value', () => {
    // Not a coincidence and not a copy to be maintained: the field saturates on the
    // same discipline the opposition dampener does, so the two can never disagree
    // about how much a faith-side term may move a settlement.
    expect(FAITH_FIELD_TUNING.DAMP_MAX).toBe(PIETY_TUNING.DAMP_MAX);
  });

  test('the door is NAMED, not minted — no flag key is read anywhere in the leaf', () => {
    expect(FAITH_FIELD_DOOR).toBe('faithFieldEnabled');
  });
});

describe('w(d, s) — the member weight', () => {
  test('standingWeight reuses PIETY_TUNING\'s own table, and an unknown standing reads weakest', () => {
    expect(standingWeight('ascendant')).toBe(PIETY_TUNING.STANDING_DEVOTION.ascendant);
    expect(standingWeight('established')).toBe(PIETY_TUNING.STANDING_DEVOTION.established);
    expect(standingWeight('cult')).toBe(PIETY_TUNING.STANDING_DEVOTION.cult);
    expect(standingWeight('archbishop-of-nowhere')).toBe(PIETY_TUNING.STANDING_DEVOTION.cult);
    expect(standingWeight(undefined)).toBe(PIETY_TUNING.STANDING_DEVOTION.cult);
  });

  test('a patron at half the pool, major rank, ascendant: 0.5 × 0.95 × 1 × 1.6 = 0.76', () => {
    expect(memberWeight(member({ share: 50 }), true)).toBeCloseTo(0.76, 12);
  });

  test('the same member as a NON-patron drops the amplifier: 0.5 × 0.95 × 1 = 0.475', () => {
    expect(memberWeight(member({ share: 50 }), false)).toBeCloseTo(0.475, 12);
  });

  test('a cult-standing minor deity at a fifth of the pool: 0.2 × 0.6 × 0.25 = 0.03', () => {
    expect(memberWeight(member({ rank: 'minor', share: 20, standing: 'cult' }), false)).toBeCloseTo(0.03, 12);
  });

  test('no adherents ⇒ EXACTLY 0 — silence, not a floor', () => {
    expect(memberWeight(member({ share: 0 }), true)).toBe(0);
    expect(memberWeight(member({ share: -5 }), true)).toBe(0);
    expect(memberWeight(null, true)).toBe(0);
  });

  test('the rank weight is the estate\'s existing table, read off the SNAPSHOT', () => {
    // deityRankStrength keys on `rankAxis`, which lives on the snapshot rather than
    // on the membership record — a member weight that read the record would be 0.6
    // for every deity in the estate and nobody would notice.
    expect(memberWeight(member({ rank: 'cult', share: 100 }), false))
      .toBeCloseTo(DEITY_RANK_STRENGTH.cult, 12);
  });
});

describe('aspectTerm — the deity\'s own signed pull on one channel', () => {
  test('a firm boon on harvest reads +0.12 on harvest and 0 everywhere else', () => {
    const snap = { boonChannel: 'harvest', boonStrength: 'firm' };
    expect(aspectTerm(snap, 'harvest')).toBe(0.12);
    for (const ch of FAITH_CHANNELS) if (ch !== 'harvest') expect(aspectTerm(snap, ch)).toBe(0);
  });

  test('a heavy bane subtracts: −0.25', () => {
    expect(aspectTerm({ baneChannel: 'trade', baneStrength: 'heavy' }, 'trade')).toBe(-0.25);
  });

  test('boon AND bane on the SAME channel sum, and an equal pair nets to EXACT silence', () => {
    // The storm god who blesses and wrecks the sea (D3 / §5 question 3, default yes).
    const stormy = { boonChannel: 'sea', boonStrength: 'heavy', baneChannel: 'sea', baneStrength: 'heavy' };
    expect(aspectTerm(stormy, 'sea')).toBe(0);
    // …and an UNEQUAL pair nets to the difference rather than to the larger half.
    const lopsided = { boonChannel: 'sea', boonStrength: 'heavy', baneChannel: 'sea', baneStrength: 'faint' };
    expect(aspectTerm(lopsided, 'sea')).toBeCloseTo(0.25 - 0.05, 12);
  });

  test('an out-of-vocabulary strength or channel contributes NOTHING — membership, never truthiness', () => {
    expect(aspectTerm({ boonChannel: 'harvest', boonStrength: 'colossal' }, 'harvest')).toBe(0);
    expect(aspectTerm({ boonChannel: 'vengeance', boonStrength: 'heavy' }, 'vengeance')).toBe(0);
    // …and a truthy non-string never coerces into a band.
    expect(aspectTerm({ boonChannel: 'harvest', boonStrength: 3 }, 'harvest')).toBe(0);
  });

  test('no snapshot ⇒ 0', () => {
    expect(aspectTerm(null, 'harvest')).toBe(0);
    expect(aspectTerm(undefined, 'harvest')).toBe(0);
  });
});

describe('THE FOLD — term = aspectTerm × w × pietyMult × magicGate', () => {
  test('one patron, firm harvest boon, half the pool: 0.12 × 0.76 = 0.0912 ⇒ mult 1.0912', () => {
    const field = faithFieldOf(BARE, state([member({ share: 50, boonChannel: 'harvest', boonStrength: 'firm' })]));
    expect(field.channels.harvest).toBeCloseTo(0.0912, 12);
    expect(field.mults.harvest).toBeCloseTo(1.0912, 12);
    expect(field.members).toBe(1);
    expect(field.gated).toBe(false);
    expect(field.contributors).toEqual([
      { deityRef: 'd.one', channel: 'harvest', weight: expect.closeTo(0.76, 12), term: expect.closeTo(0.0912, 12) },
    ]);
  });

  test('THE FIELD IS A FIELD: a co-resident cult moves the channel the patron does not touch', () => {
    // The whole point of D4. Patron blesses harvest; a minor cult at cult standing
    // blights trade — and the patron's silence on trade does not silence the cult.
    // cult weight = 0.2 × 0.6 × 0.25 = 0.03 ⇒ term = −0.05 × 0.03 = −0.0015
    const field = faithFieldOf(BARE, state([
      member({ ref: 'd.patron', share: 80, boonChannel: 'harvest', boonStrength: 'firm' }),
      member({ ref: 'd.cult', rank: 'minor', share: 20, standing: 'cult', baneChannel: 'trade', baneStrength: 'faint' }),
    ], 'd.patron'));
    expect(field.channels.trade).toBeCloseTo(-0.0015, 12);
    expect(field.mults.trade).toBeCloseTo(0.9985, 12);
    expect(field.members).toBe(2);
  });

  test('the piety multiplier scales the whole term (a devout city feels its gods harder)', () => {
    const devout = { id: 's.devout', config: { faithProfile: { piety: { composite: 1.5 } } } };
    // 0.12 × 0.76 × 1.5 = 0.1368
    const field = faithFieldOf(devout, state([member({ share: 50, boonChannel: 'harvest', boonStrength: 'firm' })]));
    expect(field.channels.harvest).toBeCloseTo(0.1368, 12);
  });

  test('a SUPPRESSED member is not in the field at all', () => {
    const field = faithFieldOf(BARE, state([
      member({ ref: 'd.live', share: 100, boonChannel: 'craft', boonStrength: 'firm' }),
      member({ ref: 'd.dead', share: 100, suppressed: true, boonChannel: 'craft', boonStrength: 'heavy' }),
    ], 'd.live'));
    expect(field.members).toBe(1);
    expect(field.contributors.map((c) => c.deityRef)).toEqual(['d.live']);
  });

  test('a member with no adherents is silent even carrying a heavy boon', () => {
    const field = faithFieldOf(BARE, state([member({ share: 0, boonChannel: 'craft', boonStrength: 'heavy' })]));
    expect(field.channels.craft).toBe(0);
    expect(field.contributors).toEqual([]);
    // …and it still COUNTS as a member: silence is not absence.
    expect(field.members).toBe(1);
  });

  test('contributors come out in codepoint order, deterministically', () => {
    const members = [
      member({ ref: 'd.zeta', share: 30, boonChannel: 'order', boonStrength: 'firm' }),
      member({ ref: 'd.alpha', share: 30, boonChannel: 'order', boonStrength: 'firm' }),
      member({ ref: 'd.mid', share: 30, boonChannel: 'order', boonStrength: 'firm' }),
    ];
    const forward = faithFieldOf(BARE, state(members, 'd.mid'));
    const reversed = faithFieldOf(BARE, state([...members].reverse(), 'd.mid'));
    expect(forward.contributors.map((c) => c.deityRef)).toEqual(['d.alpha', 'd.mid', 'd.zeta']);
    expect(reversed.contributors).toEqual(forward.contributors);
    expect(reversed.channels).toEqual(forward.channels);
  });

  test('faithChannelMult is faithFieldOf\'s channel, and an unknown channel is the IDENTITY not undefined', () => {
    const st = state([member({ share: 50, boonChannel: 'harvest', boonStrength: 'firm' })]);
    expect(faithChannelMult(BARE, st, 'harvest')).toBe(faithFieldOf(BARE, st).mults.harvest);
    expect(faithChannelMult(BARE, st, 'vengeance')).toBe(1);
    // A NaN downstream is the failure this arm exists to prevent.
    expect(Number.isFinite(faithChannelMult(BARE, st, 'vengeance'))).toBe(true);
  });
});

describe('THE RUNAWAY GUARANTEE — structural first, the clamp as backstop', () => {
  /**
   * n heavy-boon deities sharing ONE conserved adherent pool — the shape
   * `renormShares` guarantees (active shares sum to 100).
   */
  function crowd(n, aspect) {
    return state(Array.from({ length: n }, (unused, i) => member({
      ref: `d.${String(i).padStart(2, '0')}`,
      share: 100 / n,
      ...aspect,
    })), 'd.00');
  }

  /** The same n deities, each wrongly holding the WHOLE pool — an unnormalised state. */
  function unnormalised(n, aspect) {
    return state(Array.from({ length: n }, (unused, i) => member({
      ref: `d.${String(i).padStart(2, '0')}`,
      share: 100,
      ...aspect,
    })), 'd.00');
  }

  // THE STRUCTURAL BOUND, derived: the pool is conserved at 100 points, so
  // Σ share01 ≤ 1, and every other factor has a maximum —
  //   STRENGTH.heavy(0.25) × DEITY_RANK_STRENGTH.major(0.95) × PATRON_AMP(1.6) = 0.38
  // attained ONLY by a lone ascendant major patron holding the entire pool.
  const STRUCTURAL_BOUND = 0.38;

  test('⭐ THE BOUND IS THE POOL, NOT THE CLAMP — the extremal conserved pantheon reads exactly 0.38', () => {
    const lonePatron = state([member({ share: 100, boonChannel: 'harvest', boonStrength: 'heavy' })]);
    expect(faithFieldOf(BARE, lonePatron).channels.harvest).toBeCloseTo(STRUCTURAL_BOUND, 12);
    // …and that extremum is STRICTLY BELOW the declared cap, which is why the cap
    // is a backstop rather than the guarantee. Asserted as an inequality so the day
    // someone raises STRENGTH or PATRON_AMP past the cap, this arm reds and the
    // architecture note above stops being true silently.
    expect(STRUCTURAL_BOUND).toBeLessThan(FAITH_FIELD_TUNING.DAMP_MAX);
  });

  test('ADDING GODS DIVIDES THE POOL — 10 and 40 members both stay under the structural bound', () => {
    // The runaway counter, and it is not the clamp: a crowded pantheon cannot exceed
    // a lone patron, because every new god takes share from the others.
    for (const n of [2, 5, 10, 40]) {
      const total = faithFieldOf(BARE, crowd(n, { boonChannel: 'war_readiness', boonStrength: 'heavy' }))
        .channels.war_readiness;
      expect(total).toBeLessThanOrEqual(STRUCTURAL_BOUND + 1e-12);
      expect(total).toBeGreaterThan(0);
    }
  });

  test('⭐ MORE gods mean LESS in total, and the decline has a CLOSED FORM', () => {
    const at = (n) => faithFieldOf(BARE, crowd(n, { boonChannel: 'war_readiness', boonStrength: 'heavy' }))
      .channels.war_readiness;
    // Over n equal ascendant major members of one conserved pool, exactly one of
    // which is the patron:
    //   total(n) = heavy × major × (1/n) × (n − 1 + PATRON_AMP)
    //            = 0.2375 × (1 + 0.6/n)
    // — derived by hand, then asserted against the implementation across a decade of
    // pantheon sizes. This is the anti-stacking property stated as an EQUATION
    // rather than as an inequality, so a wrong factor anywhere in the fold reds here.
    const closedForm = (n) => 0.2375 * (1 + 0.6 / n);
    for (const n of [1, 2, 3, 5, 10, 25, 40, 100]) {
      expect(at(n), `pantheon of ${n}`).toBeCloseTo(closedForm(n), 12);
    }
    // Strictly decreasing, and bounded below by the amp-free limit 0.2375 — so no
    // pantheon size is ever the dangerous one.
    expect(at(1)).toBeCloseTo(STRUCTURAL_BOUND, 12);
    expect(at(10)).toBeCloseTo(0.25175, 12);
    expect(at(40)).toBeCloseTo(0.2410625, 12);
    expect(at(100)).toBeGreaterThan(0.2375);
  });

  test('THE BACKSTOP IS LIVE, NOT DEAD CODE: an unnormalised state clamps to exactly DAMP_MAX', () => {
    // The clamp cannot be reached by any lawful pantheon, so this arm is what proves
    // it still works — without it, deleting the clamp would break no test.
    const over = faithFieldOf(BARE, unnormalised(10, { boonChannel: 'war_readiness', boonStrength: 'heavy' }));
    expect(over.channels.war_readiness).toBe(FAITH_FIELD_TUNING.DAMP_MAX);
    expect(over.mults.war_readiness).toBeCloseTo(1 + FAITH_FIELD_TUNING.DAMP_MAX, 12);
  });

  test('⚠ THE CHANNEL TOTAL IS SYMMETRIC BUT THE MULTIPLIER IS NOT — and MULT_MIN is why', () => {
    // Measured, not assumed. The signed TOTAL is symmetric: banes bottom out at
    // −DAMP_MAX exactly as boons top out at +DAMP_MAX.
    const under = faithFieldOf(BARE, unnormalised(10, { baneChannel: 'war_readiness', baneStrength: 'heavy' }));
    expect(under.channels.war_readiness).toBe(-FAITH_FIELD_TUNING.DAMP_MAX);

    // The MULTIPLIER is not, and this arm exists because the asymmetry is real and a
    // later reader would otherwise find it as a bug. `1 − 0.6 = 0.4` is BELOW
    // PIETY_TUNING.MULT_MIN (0.5), so the composite bound clips the bane side one
    // rung before the field's own cap does, while the boon side's 1.6 sits well
    // inside MULT_MAX (2.0). That is the OWNER's hard composite bound for this
    // subsystem winning over the field's — which is the correct precedence — but it
    // means a maximal bane and a maximal boon are NOT mirror images downstream.
    expect(1 - FAITH_FIELD_TUNING.DAMP_MAX).toBeLessThan(PIETY_TUNING.MULT_MIN);
    expect(under.mults.war_readiness).toBe(PIETY_TUNING.MULT_MIN);

    // ⭐ AND IT IS UNREACHABLE LAWFULLY: on a conserved pantheon the extreme is
    // ∓0.38, so the multiplier range is [0.62, 1.38] — comfortably inside the
    // owner's band, and the asymmetry never fires in a real world.
    const worstLawful = faithFieldOf(BARE, state([member({ share: 100, baneChannel: 'war_readiness', baneStrength: 'heavy' })]));
    expect(worstLawful.mults.war_readiness).toBeCloseTo(1 - STRUCTURAL_BOUND, 12);
    expect(worstLawful.mults.war_readiness).toBeGreaterThan(PIETY_TUNING.MULT_MIN);
  });

  test('the multiplier never leaves PIETY_TUNING\'s composite bound, even at a devout extreme', () => {
    const veryDevout = { id: 's.zeal', config: { faithProfile: { piety: { composite: PIETY_TUNING.MULT_MAX } } } };
    for (const st of [
      unnormalised(20, { boonChannel: 'hearth', boonStrength: 'heavy' }),
      unnormalised(20, { baneChannel: 'hearth', baneStrength: 'heavy' }),
    ]) {
      const m = faithFieldOf(veryDevout, st).mults.hearth;
      expect(m).toBeGreaterThanOrEqual(PIETY_TUNING.MULT_MIN);
      expect(m).toBeLessThanOrEqual(PIETY_TUNING.MULT_MAX);
    }
  });

  test('no channel escapes the fold — every channel of a mixed crowd is inside the cap', () => {
    const field = faithFieldOf(BARE, unnormalised(12, { boonChannel: 'sea', boonStrength: 'heavy', baneChannel: 'order', baneStrength: 'heavy' }));
    for (const ch of FAITH_CHANNELS) {
      expect(Math.abs(field.channels[ch])).toBeLessThanOrEqual(FAITH_FIELD_TUNING.DAMP_MAX);
    }
  });
});

describe('THE ONE MAGIC GATE (D3) — and the two cases it deliberately tells apart', () => {
  const DEAD = { id: 's.dead', config: { magicLevel: 'medium', magicExists: false } };
  const LIVE = { id: 's.live', config: { magicLevel: 'medium' } };

  test('an explicit dead-magic world gates the term to ZERO and says so', () => {
    expect(magicGate01(DEAD)).toBe(0);
    const field = faithFieldOf(DEAD, state([member({ share: 100, boonChannel: 'healing', boonStrength: 'heavy' })]));
    expect(field.gated).toBe(true);
    expect(field.channels.healing).toBe(0);
    expect(field.mults.healing).toBe(1);
  });

  test('⭐ a gated world produces an EMPTY contributor list, not one full of zeroes', () => {
    // A receipt reader must not be able to mistake a silenced god for a present one.
    const field = faithFieldOf(DEAD, state([member({ share: 100, boonChannel: 'healing', boonStrength: 'heavy' })]));
    expect(field.contributors).toEqual([]);
    // …while the members count still tells the reader the pantheon exists.
    expect(field.members).toBe(1);
  });

  test('⚠ AN UNPROFILED SETTLEMENT IS **NOT** GATED — absent is not "magic is dead"', () => {
    // The deliberate divergence from bufferMagic01, which answers 0 for !present
    // because it returns a SCALE. This is a GATE: `present: false` means "never
    // profiled", and silencing every pre-ledger settlement's faith would make an
    // unmeasured world observably different for a reason unrelated to faith.
    expect(magicGate01(BARE)).toBe(1);
    expect(magicGate01(null)).toBe(1);
    expect(magicGate01(undefined)).toBe(1);
    const field = faithFieldOf(BARE, state([member({ share: 100, boonChannel: 'healing', boonStrength: 'heavy' })]));
    expect(field.gated).toBe(false);
    expect(field.channels.healing).not.toBe(0);
  });

  test('a LIVE magic world is not gated, whatever the dial reads', () => {
    expect(magicGate01(LIVE)).toBe(1);
    expect(magicGate01({ config: { priorityMagic: 0 } })).toBe(1);
    // ⚠ and this is the honest edge: a dial at ZERO is a quiet world, not a dead
    // one. Only the `magicExists: false` switch closes the gate.
    expect(magicGate01({ config: { priorityMagic: 0, magicExists: false } })).toBe(0);
  });

  test('the gate is ONE chokepoint: it zeroes EVERY channel at once, never a subset', () => {
    const field = faithFieldOf(DEAD, state([
      member({ ref: 'd.a', share: 50, boonChannel: 'harvest', boonStrength: 'heavy' }),
      member({ ref: 'd.b', share: 50, baneChannel: 'trade', baneStrength: 'heavy' }),
    ], 'd.a'));
    for (const ch of FAITH_CHANNELS) {
      expect(field.channels[ch]).toBe(0);
      expect(field.mults[ch]).toBe(1);
    }
  });
});

describe('THE DORMANCY GUARANTEE — exactly 0 and exactly 1, on every path to absence', () => {
  const ABSENCES = [
    ['no religion state at all', null],
    ['an undefined religion state', undefined],
    ['a state with no deities key', {}],
    ['a state with an empty pantheon', { deities: {}, patronRef: null }],
    ['a pantheon whose every member is suppressed', state([member({ suppressed: true, boonChannel: 'harvest', boonStrength: 'heavy' })])],
    ['a pantheon that authors no boon or bane', state([member({ share: 100 })])],
  ];

  // ⚠ A PLAIN LOOP RATHER THAN `test.each(ABSENCES)`, AND DELIBERATELY SO. The
  // lighting census PARKS a file whose `each` table is a named binding it cannot
  // statically prove (`TEST_TABLE_UNPROVEN`), and a parked file contributes no
  // credited titles — the census can no longer vouch that these assertions run at
  // all. Every row carries its label in the assertion message instead, so a failure
  // still names which absence broke.
  test('every path to absence ⇒ every channel EXACTLY 0 and every multiplier EXACTLY 1', () => {
    for (const [label, religionState] of ABSENCES) {
      const field = faithFieldOf(BARE, /** @type {any} */ (religionState));
      for (const ch of FAITH_CHANNELS) {
        // `toBe` and not `toBeCloseTo`: the claim is that a legacy world cannot
        // observe the feature because there is NOTHING to observe, not because a
        // small number rounded away. A 1e-17 here would falsify the whole landing.
        expect(field.channels[ch], `${label} · ${ch} total`).toBe(0);
        expect(field.mults[ch], `${label} · ${ch} mult`).toBe(1);
        expect(faithChannelMult(BARE, /** @type {any} */ (religionState), ch), `${label} · ${ch} reader`).toBe(1);
      }
      expect(field.contributors, `${label} · contributors`).toEqual([]);
    }
  });

  test('a settlement that is null or undefined is dormant rather than a throw', () => {
    for (const s of [null, undefined]) {
      const field = faithFieldOf(s, null);
      expect(Object.keys(field.channels).sort()).toEqual([...FAITH_CHANNELS].sort());
      for (const ch of FAITH_CHANNELS) expect(field.mults[ch]).toBe(1);
    }
  });

  test('the reading names every channel, always — a consumer never meets an absent key', () => {
    const field = faithFieldOf(BARE, null);
    expect(Object.keys(field.channels)).toEqual([...FAITH_CHANNELS]);
    expect(Object.keys(field.mults)).toEqual([...FAITH_CHANNELS]);
  });

  test('the fold does not MUTATE the state it reads', () => {
    const st = state([member({ share: 50, boonChannel: 'harvest', boonStrength: 'firm' })]);
    const before = JSON.stringify(st);
    faithFieldOf(BARE, st);
    expect(JSON.stringify(st)).toBe(before);
  });
});

describe('THE JEALOUS FLAW (W-FAITH F5c) — the boon fades as share is contested, inside the gate', () => {
  /** The jealous patron and its rival: the geometry every arm below shares.
   *  jeal — major, ascendant, PATRON, share 55, heavy harvest boon, CONTENT vice at defining.
   *  rival — minor, established, share 45, nothing authored.
   *  contested01(jeal) = 45/100 = 0.45 (rival share only — unbelief does not contest)
   *  fade = 1 − JEALOUS_BOON_FADE 1 × LEVEL_SCALE.defining 1 × 0.45 = 0.55 */
  function pantheonWith(axes) {
    return state([
      member({ ref: 'd.jeal', rank: 'major', share: 55, standing: 'ascendant', boonChannel: 'harvest', boonStrength: 'heavy', ...(axes ? { characterAxes: axes } : {}) }),
      member({ ref: 'd.rival', rank: 'minor', share: 45, standing: 'established' }),
    ], 'd.jeal');
  }

  test('aspectTerm scales the BOON addend by the fade — and the default is the literal 1', () => {
    const snap = { boonChannel: 'harvest', boonStrength: 'heavy' };
    // heavy 0.25 × fade 0.55 = 0.1375
    expect(aspectTerm(snap, 'harvest', 0.55)).toBeCloseTo(0.1375, 12);
    // the two-argument call is the pre-flaw call, byte-identical: 0.25 × 1 = 0.25
    expect(aspectTerm(snap, 'harvest')).toBe(0.25);
  });

  test('the BANE is untouched by the fade — the charter says the BOON weakens', () => {
    const snap = { baneChannel: 'harvest', baneStrength: 'heavy' };
    // −0.25 whatever the fade: the scale multiplies an addend this snapshot lacks.
    expect(aspectTerm(snap, 'harvest', 0.55)).toBe(-0.25);
    expect(aspectTerm(snap, 'harvest', 0)).toBe(-0.25);
  });

  test('the fold: a defining-jealous patron blesses at 0.55 of its unflawed self', () => {
    // Unflawed control: heavy 0.25 × w(0.55 × 0.95 × 1 × 1.6 = 0.836) × piety 1 × gate 1 = 0.209
    const control = faithFieldOf(BARE, /** @type {any} */ (pantheonWith(null)));
    expect(control.channels.harvest).toBeCloseTo(0.209, 12);
    // Flawed: boon addend 0.25 × 0.55 = 0.1375; × 0.836 = 0.11495
    const flawed = faithFieldOf(BARE, /** @type {any} */ (pantheonWith(['CONTENT:vice:defining'])));
    expect(flawed.channels.harvest).toBeCloseTo(0.11495, 12);
  });

  test('a VIRTUE position on the same axis fades nothing — the vice-pole law', () => {
    const virtuous = faithFieldOf(BARE, /** @type {any} */ (pantheonWith(['CONTENT:virtue:defining'])));
    expect(virtuous.channels.harvest).toBeCloseTo(0.209, 12);
  });

  test('the typed cause: the faded contributor carries the flaw token, the control does not', () => {
    const flawed = faithFieldOf(BARE, /** @type {any} */ (pantheonWith(['CONTENT:vice:defining'])));
    expect(flawed.contributors.length).toBe(1);
    expect(flawed.contributors[0].flaw).toBe('jealous');
    const control = faithFieldOf(BARE, /** @type {any} */ (pantheonWith(null)));
    expect(control.contributors.length).toBe(1);
    // Asserted POSITIVELY as a key-set claim: a dormant contribution keeps its exact
    // pre-flaw shape, no flaw key minted.
    expect(Object.keys(control.contributors[0]).sort()).toEqual(['channel', 'deityRef', 'term', 'weight']);
  });

  test('⛔ THE MAGIC-GATE PIN: a flaw multiplying a magic-zeroed term stays EXACTLY zero', () => {
    // The world's dial says magic does not exist; the jealous patron authors a heavy
    // boon under full contest. The fade lives INSIDE the gated product, so the term is
    // exactly 0 — not small, 0 — the contributor list is EMPTY and the projection is
    // null. A mutation that lets any flaw arm ADD after the gate reds this arm.
    const DEAD = { id: 's.dead', config: { magicLevel: 'none', magicExists: false } };
    const st = /** @type {any} */ (pantheonWith(['CONTENT:vice:defining']));
    const gated = faithFieldOf(DEAD, st);
    expect(gated.gated).toBe(true);
    for (const ch of FAITH_CHANNELS) {
      expect(gated.channels[ch], `${ch} total under a dead-magic dial`).toBe(0);
      expect(gated.mults[ch], `${ch} mult under a dead-magic dial`).toBe(1);
    }
    expect(gated.contributors).toEqual([]);
    expect(faithFieldProjection(DEAD, st)).toBeNull();
  });

  test('an UNBOUND channel stays unbound with the flaw in play — no key, no score', () => {
    // The jealous god's boon on `learning` (declared unbound at F4c) mints nothing,
    // fade or no fade: the projection iterates the BINDINGS, and the flaw layer never
    // touches the binding registry.
    const st = state([
      member({ ref: 'd.jeal', rank: 'major', share: 55, standing: 'ascendant', boonChannel: 'learning', boonStrength: 'heavy', characterAxes: ['CONTENT:vice:defining'] }),
      member({ ref: 'd.rival', rank: 'minor', share: 45, standing: 'established' }),
    ], 'd.jeal');
    expect(faithFieldProjection(BARE, /** @type {any} */ (st))).toBeNull();
  });

  test('a vice position WITHOUT a boon or bane lights nothing — axes alone are not aspects', () => {
    const st = state([
      member({ ref: 'd.dark', rank: 'major', share: 55, standing: 'ascendant', characterAxes: ['CONTENT:vice:defining', 'TEMPER:vice:defining'] }),
      member({ ref: 'd.rival', rank: 'minor', share: 45, standing: 'established' }),
    ], 'd.dark');
    const field = faithFieldOf(BARE, /** @type {any} */ (st));
    for (const ch of FAITH_CHANNELS) {
      expect(field.channels[ch], `${ch}: a flaw with no aspect moved a channel`).toBe(0);
    }
    expect(field.contributors).toEqual([]);
    expect(faithFieldProjection(BARE, /** @type {any} */ (st))).toBeNull();
  });

  test('a SOLE jealous god among the faithless keeps its whole blessing — unbelief does not contest', () => {
    // One member at share 55, the remaining 45 points godless: contested01 = 0/100 = 0,
    // so the fade is the literal 1 and the total is the control's own 0.209.
    const st = state([
      member({ ref: 'd.jeal', rank: 'major', share: 55, standing: 'ascendant', boonChannel: 'harvest', boonStrength: 'heavy', characterAxes: ['CONTENT:vice:defining'] }),
    ], 'd.jeal');
    expect(faithFieldOf(BARE, /** @type {any} */ (st)).channels.harvest).toBeCloseTo(0.209, 12);
  });

  test('a SUPPRESSED rival does not contest — only active voices hold share against the jealous', () => {
    // The rival is suppressed (share 0 by the religion engine's own suppression write,
    // but even with a stale share the member is filtered before the fold): the jealous
    // god reads contested01 = 0 and blesses whole.
    const st = state([
      member({ ref: 'd.jeal', rank: 'major', share: 55, standing: 'ascendant', boonChannel: 'harvest', boonStrength: 'heavy', characterAxes: ['CONTENT:vice:defining'] }),
      member({ ref: 'd.rival', rank: 'minor', share: 45, standing: 'established', suppressed: true }),
    ], 'd.jeal');
    expect(faithFieldOf(BARE, /** @type {any} */ (st)).channels.harvest).toBeCloseTo(0.209, 12);
  });
});

/**
 * missionAcceptance.test.js — the battery for W-OPS car O2's acceptance seam.
 *
 * ⭐⭐ THE DISCIPLINE THIS FILE IS BUILT AROUND. The leaf takes its four seam values as
 * INPUTS, so a battery that only ever handed it hand-written literals would prove the
 * leaf self-consistent and would discover NOTHING about whether it can read the estate's
 * actual producers (the §866 vacuous-green class, and §711.4's "an arm that cannot
 * discover anything is a green that means less than it looks").
 *
 * So the arms below are driven from BOTH ends: once on literals, where an edge can be
 * placed exactly; and once on the REAL producers — `characterConsumers.riskRegister` and
 * `sendTwoDivergence.vetVolunteerEnvoy` — with a chart present AND absent, which is the
 * only way to prove the comparator can see a soul at all.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`: a loop-registered suite
 * is TEST_UNREGISTERED to the lighting census and its assertions are then evidence
 * nowhere, however green vitest reports it.
 *
 * @enforced-by this test
 */
import { describe, expect, test } from 'vitest';

import {
  ACCEPTANCE_PROVENANCE,
  ACCEPTANCE_REFUSALS,
  ACCEPTANCE_SEAM_ORDER,
  ACCEPTANCE_VERDICTS,
  REFUSED_MISSION_RECEIPT_ROW,
  RISK_WINDOW_SIDES,
  WILLINGNESS_KIND,
  decideAcceptance,
  freezeRegisterAtRooting,
  priceAgainstRegister,
  refusedMissionReceipt,
  registerGoverning,
  willingnessCandidate,
} from '../../src/domain/worldPulse/operations/missionAcceptance.js';
import { riskRegister } from '../../src/domain/npc/characterConsumers.js';
import { vetVolunteerEnvoy } from '../../src/domain/worldPulse/sendTwoDivergence.js';

/** A register placed exactly, so an edge can be tested without a soul in the way. */
const WINDOW = Object.freeze({ center: 0.5, breadth: 0.1, absent: Object.freeze([]) });

/** A roster NPC exactly as the generators write one: personality words, NO chart. */
const PLAIN_NPC = Object.freeze({
  personality: Object.freeze({ dominant: 'patient', flaw: 'callous', modifier: 'cautious' }),
});

/**
 * The same person with an authored chart — the world car L8's edit surface makes.
 *
 * ⚠ BOTH axes of F15's named pair are driven to their poles ON PURPOSE. Moving COURAGE
 * alone separates the two centres by exactly `RISK_CENTER_SHARE` (1 axis-lean × the
 * share), which is exactly `MIN_RISK_BREADTH` — so the bolder man's centre would land
 * precisely ON the warier man's window edge, `inside` by the inclusive comparison, and
 * the flip this arm exists to prove would silently not happen. Driving the pair to ±1
 * separates them by TWO shares and puts the gap a clear half-window outside.
 */
const BRAVE_NPC = Object.freeze({
  personality: PLAIN_NPC.personality,
  character: Object.freeze({
    axes: Object.freeze({
      COURAGE: Object.freeze({ pole: 'virtue', level: 'defining' }),
      PRUDENCE: Object.freeze({ pole: 'vice', level: 'defining' }),
    }),
  }),
});

const WARY_NPC = Object.freeze({
  personality: PLAIN_NPC.personality,
  character: Object.freeze({
    axes: Object.freeze({
      COURAGE: Object.freeze({ pole: 'vice', level: 'defining' }),
      PRUDENCE: Object.freeze({ pole: 'virtue', level: 'defining' }),
    }),
  }),
});

/** @param {Record<string, unknown>} over */
function accept(over) {
  return decideAcceptance({ operationId: 'op-1', register: WINDOW, risk01: 0.5, ...over });
}

describe('the acceptance vocabularies are closed and frozen', () => {
  test('the verdicts are exactly two, and frozen', () => {
    expect(ACCEPTANCE_VERDICTS).toEqual(['accepted', 'refused']);
    expect(Object.isFrozen(ACCEPTANCE_VERDICTS)).toBe(true);
  });

  test('the seam order is records-then-character-then-risk, and frozen', () => {
    expect(ACCEPTANCE_SEAM_ORDER).toEqual(['vetting', 'willingness', 'risk']);
    expect(Object.isFrozen(ACCEPTANCE_SEAM_ORDER)).toBe(true);
  });

  test('the window sides name an absence apart from a reading', () => {
    expect(RISK_WINDOW_SIDES).toEqual(['inside', 'above', 'below', 'unreadable']);
  });

  test('the provenance is CANDIDATE and unsigned, and names row 7', () => {
    expect(ACCEPTANCE_PROVENANCE.status).toBe('CANDIDATE');
    expect(ACCEPTANCE_PROVENANCE.signedBy).toBe(null);
    expect(ACCEPTANCE_PROVENANCE.ownerRows).toContain(REFUSED_MISSION_RECEIPT_ROW);
  });
});

describe('every refusal is separately reachable — a vocabulary nobody can reach is a lie', () => {
  test('invalid_operation', () => {
    expect(accept({ operationId: '' }).refusal).toBe('invalid_operation');
  });

  test('invalid_register', () => {
    expect(accept({ register: undefined }).refusal).toBe('invalid_register');
  });

  test('unpriced_operation', () => {
    expect(accept({ risk01: undefined }).refusal).toBe('unpriced_operation');
  });

  test('vetting', () => {
    expect(accept({ vetting: { accepted: false, basis: 'loyalty' } }).refusal).toBe('vetting');
  });

  test('unwilling', () => {
    expect(accept({ willing: false }).refusal).toBe('unwilling');
  });

  test('risk_above_window', () => {
    expect(accept({ risk01: 0.95 }).refusal).toBe('risk_above_window');
  });

  test('risk_below_window', () => {
    expect(accept({ risk01: 0.05 }).refusal).toBe('risk_below_window');
  });

  test('the roster and the reachable set are the same set', () => {
    const reached = [
      accept({ operationId: '' }).refusal,
      accept({ register: undefined }).refusal,
      accept({ risk01: undefined }).refusal,
      accept({ vetting: { accepted: false } }).refusal,
      accept({ willing: false }).refusal,
      accept({ risk01: 0.95 }).refusal,
      accept({ risk01: 0.05 }).refusal,
    ];
    expect([...new Set(reached)].sort()).toEqual([...ACCEPTANCE_REFUSALS].sort());
  });
});

describe('the window has TWO edges, and both are real refusals (§803.1 R5)', () => {
  test('inside the window accepts', () => {
    expect(accept({ risk01: 0.5 }).verdict).toBe('accepted');
    expect(accept({ risk01: 0.5 }).side).toBe('inside');
  });

  test('the bored veteran refuses the milk run — seek-more is not folded into acceptance', () => {
    const verdict = accept({ risk01: 0.05 });
    expect(verdict.verdict).toBe('refused');
    expect(verdict.side).toBe('below');
  });

  test('the timid man refuses the raid', () => {
    expect(accept({ risk01: 0.95 }).side).toBe('above');
  });

  test('both edges are inclusive — a risk exactly at the boundary is inside', () => {
    expect(priceAgainstRegister({ register: WINDOW, risk01: 0.6 }).side).toBe('inside');
    expect(priceAgainstRegister({ register: WINDOW, risk01: 0.4 }).side).toBe('inside');
  });
});

describe('⭐ THE §8b F4 ROOTING FREEZE — the ES §3.4b termination proof', () => {
  test('a rooted register governs, and the verdict says which one decided', () => {
    const rooted = freezeRegisterAtRooting(WINDOW, 12);
    const chosen = registerGoverning({ register: { center: 0.9, breadth: 0.05 }, rootedRegister: rooted });
    expect(chosen.source).toBe('rooted');
    expect(chosen.register.center).toBe(0.5);
  });

  test('with no rooting, the live register governs', () => {
    expect(registerGoverning({ register: WINDOW }).source).toBe('live');
    expect(registerGoverning({}).source).toBe('none');
  });

  test('⭐⭐ THE TERMINATION PROPERTY: drift cannot move a rooted stay\'s verdict', () => {
    const rooted = freezeRegisterAtRooting(WINDOW, 3);
    const risk = 0.95; // above the window the spy rooted with ⇒ the stay must end
    const atRooting = decideAcceptance({ operationId: 'stay-1', rootedRegister: rooted, risk01: risk });
    expect(atRooting.refusal).toBe('risk_above_window');

    // The man drifts bold: a LIVE register would now welcome this risk. The rooted
    // stay must NOT: a tolerance that rises as fast as the danger never terminates.
    const drifted = { center: 0.95, breadth: 0.4 };
    expect(priceAgainstRegister({ register: drifted, risk01: risk }).side).toBe('inside');
    const later = decideAcceptance({
      operationId: 'stay-1', register: drifted, rootedRegister: rooted, risk01: risk,
    });
    expect(later.refusal).toBe('risk_above_window');
    expect(later.registerSource).toBe('rooted');
  });

  test('the drifted tolerance DOES govern the next operation — F4 applies to the stay, not the man', () => {
    const drifted = { center: 0.95, breadth: 0.4 };
    const next = decideAcceptance({ operationId: 'op-next', register: drifted, risk01: 0.95 });
    expect(next.verdict).toBe('accepted');
    expect(next.registerSource).toBe('live');
  });

  test('the snapshot is frozen — a proof that relies on nobody writing to it is not a proof', () => {
    const rooted = freezeRegisterAtRooting(WINDOW, 7);
    expect(Object.isFrozen(rooted)).toBe(true);
    expect(rooted.rootedAtTick).toBe(7);
  });

  test('an unreadable register cannot be frozen into a false snapshot', () => {
    expect(freezeRegisterAtRooting({ center: null, breadth: 0.1 })).toBe(null);
    expect(freezeRegisterAtRooting(undefined)).toBe(null);
  });
});

describe('⚠⚠ null and "" are ABSENT, never a supplied zero', () => {
  test('an unpriced operation is unpriced, not maximally safe', () => {
    // Number(null) === 0 is FINITE. A leaf that coerced would read `null` as risk 0,
    // fall BELOW the window, and refuse for ambition — a character statement about a
    // man nobody priced an operation for.
    expect(accept({ risk01: null }).refusal).toBe('unpriced_operation');
    expect(accept({ risk01: '' }).refusal).toBe('unpriced_operation');
    expect(accept({ risk01: 0 }).refusal).toBe('risk_below_window');
  });

  test('a register with no centre is not a timid soul', () => {
    expect(accept({ register: { center: null, breadth: 0.1 } }).refusal).toBe('invalid_register');
    expect(accept({ register: { center: '', breadth: 0.1 } }).refusal).toBe('invalid_register');
  });

  test('the DECLARED-ABSENT roster rides every verdict, accepted and refused alike', () => {
    const partial = { center: 0.5, breadth: 0.1, absent: ['desperation01', 'disorder01'] };
    expect(accept({ register: partial }).absent).toEqual(['desperation01', 'disorder01']);
    expect(accept({ register: partial, risk01: 0.95 }).absent).toEqual(['desperation01', 'disorder01']);
  });

  test('a decision made on a rooted register carries THAT register\'s absences', () => {
    const rooted = freezeRegisterAtRooting({ center: 0.5, breadth: 0.1, absent: ['disorder01'] }, 1);
    const out = decideAcceptance({
      operationId: 'op-1', register: WINDOW, rootedRegister: rooted, risk01: 0.5,
    });
    expect(out.absent).toEqual(['disorder01']);
  });
});

describe('⭐ DRIVEN BY THE REAL PRODUCERS — the discovery arm', () => {
  test('the estate\'s own register drives the seam on a world with NO chart', () => {
    const register = riskRegister({ npc: PLAIN_NPC });
    // The doubly-absent world: the register is a real reading that makes no claim.
    expect(register.absent).toEqual(['desperation01', 'disorder01']);
    const out = decideAcceptance({ operationId: 'op-1', register, risk01: register.center });
    expect(out.verdict).toBe('accepted');
    expect(out.absent).toEqual(['desperation01', 'disorder01']);
  });

  test('⭐⭐ a CHART moves the window, and the same operation flips verdict', () => {
    const brave = riskRegister({ npc: BRAVE_NPC, disorder01: 0 });
    const wary = riskRegister({ npc: WARY_NPC, disorder01: 0 });
    // The comparator can see a soul at all — without this the arms above are vacuous.
    expect(brave.center).toBeGreaterThan(wary.center);

    // ⭐ THE FIXTURE GUARDS ITSELF. The flip below is only evidence if the two centres
    // are more than one window apart; if a later tuning of the share or the breadth
    // closed that gap, the arm would go green by accepting twice and prove nothing.
    const gap = brave.center - (wary.center + wary.breadth);
    expect(gap).toBeGreaterThan(0);

    // An operation priced at the brave man's centre. He takes it; the wary man does not.
    const risk = brave.center;
    expect(decideAcceptance({ operationId: 'raid', register: brave, risk01: risk }).verdict)
      .toBe('accepted');
    const refusal = decideAcceptance({ operationId: 'raid', register: wary, risk01: risk });
    expect(refusal.verdict).toBe('refused');
    expect(refusal.refusal).toBe('risk_above_window');
  });

  test('DESPERATION widens who says yes — the term the register declares absent by default', () => {
    const calm = riskRegister({ npc: PLAIN_NPC, disorder01: 0 });
    const desperate = riskRegister({ npc: PLAIN_NPC, desperation01: 1, disorder01: 0 });
    expect(desperate.center).toBeGreaterThan(calm.center);
    expect(desperate.absent).toEqual([]);
    expect(calm.absent).toEqual(['desperation01']);
  });

  test('the estate\'s ONE vetting reader refuses through this seam — no second reader is minted', () => {
    const refused = vetVolunteerEnvoy({
      quality: 'careful',
      volunteer: { npcId: 'n1', loyaltyBand: 'suspect', foreignTieBand: 'none' },
    });
    expect(refused.accepted).toBe(false);
    expect(refused.basis).toBe('loyalty');
    const out = accept({ vetting: refused });
    expect(out.refusal).toBe('vetting');
    expect(out.seam).toBe('vetting');
  });

  test('a hurried seat accepts a man it never read, and the seam passes him through', () => {
    const hurried = vetVolunteerEnvoy({
      quality: 'hurried',
      volunteer: { npcId: 'n1', loyaltyBand: 'suspect', foreignTieBand: 'close' },
    });
    expect(hurried.accepted).toBe(true);
    expect(hurried.basis).toBe('no_time_to_look');
    expect(accept({ vetting: hurried }).verdict).toBe('accepted');
  });

  test('the RECORDS decide before character — seam order is a fact, not statement order', () => {
    const out = accept({ vetting: { accepted: false }, willing: false, risk01: 0.95 });
    expect(out.seam).toBe('vetting');
  });

  test('an ABSENT verdict is a seat that did not vet, not a seat that refused', () => {
    // The estate has no "unvetted" state — the hurried arm still accepts — so inventing
    // a refusal here would reject operations that accept today.
    expect(accept({ vetting: undefined }).verdict).toBe('accepted');
    expect(accept({ vetting: {} }).verdict).toBe('accepted');
    // And only an explicit `false` refuses: a malformed falsy is not a refusal anyone made.
    expect(accept({ vetting: { accepted: 0 } }).verdict).toBe('accepted');
  });
});

describe('the R1 willingness door is DARK, and dark writes nothing', () => {
  test('an unlit door returns null — zero keys, byte-identical', () => {
    expect(willingnessCandidate({ npcId: 'n1', patronId: 'p1' })).toBe(null);
    expect(willingnessCandidate({ lit: false, npcId: 'n1', patronId: 'p1' })).toBe(null);
    expect(willingnessCandidate({ lit: 'true', npcId: 'n1', patronId: 'p1' })).toBe(null);
  });

  test('a lit door emits ONE typed candidate kind', () => {
    const row = willingnessCandidate({ lit: true, npcId: 'n1', patronId: 'p1' });
    expect(row).toEqual({ kind: 'seek_compromise', npcId: 'n1', patronId: 'p1' });
    expect(WILLINGNESS_KIND).toBe('seek_compromise');
  });

  test('a lit door with no counterparty emits nothing — a compromise needs someone to seek it with', () => {
    expect(willingnessCandidate({ lit: true, npcId: 'n1' })).toBe(null);
  });

  test('willingness ABSENT never refuses — a dark door must not reject what accepts today', () => {
    expect(accept({ willing: undefined }).verdict).toBe('accepted');
    expect(accept({ willing: true }).verdict).toBe('accepted');
  });
});

describe('the refused-mission receipt is DARK until row 7 is signed', () => {
  const refusal = () => accept({ risk01: 0.95 });

  test('unsigned emits nothing', () => {
    expect(refusedMissionReceipt({ decision: refusal(), principalId: 'court-1' })).toBe(null);
    expect(refusedMissionReceipt({ signed: false, decision: refusal(), principalId: 'court-1' }))
      .toBe(null);
  });

  test('signed receipts the refusal to the principal, and names the row it waits on', () => {
    const row = refusedMissionReceipt({ signed: true, decision: refusal(), principalId: 'court-1' });
    expect(row.row).toBe(REFUSED_MISSION_RECEIPT_ROW);
    expect(row.principalId).toBe('court-1');
    expect(row.refusal).toBe('risk_above_window');
  });

  test('⭐ the receipt distinguishes a man who said no from a man the seat rejected', () => {
    const own = refusedMissionReceipt({ signed: true, decision: refusal(), principalId: 'c' });
    expect(own.byThePerson).toBe(true);
    const rejected = refusedMissionReceipt({
      signed: true, decision: accept({ vetting: { accepted: false } }), principalId: 'c',
    });
    expect(rejected.byThePerson).toBe(false);
  });

  test('an accepted operation is never receipted as a refusal', () => {
    expect(refusedMissionReceipt({ signed: true, decision: accept({}), principalId: 'c' })).toBe(null);
  });
});

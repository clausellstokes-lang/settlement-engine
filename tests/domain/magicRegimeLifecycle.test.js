/**
 * magicRegimeLifecycle.test.js — W-K slice K2, the crossings and THE SHELLS
 * (docs/DESIGN_MAGIC_ECONOMY.md §3a, §3c, §8, §12; law 6 INFRASTRUCTURE REMEMBERS).
 *
 * The claims §12 asks this half to prove:
 *
 *   CROSSINGS CARRY MATERIAL RECEIPTS   a crossing event names the RUNGS that moved
 *       and the INSTITUTIONS that actually closed or reopened, by name. Anchored by
 *       asserting the names against the roster the fixture built, so a receipt that
 *       degraded to a bare band index reds.
 *   NO FLAPPING FOUNDRIES               driven end to end over a real roster under an
 *       oscillating economy, counting how many times the foundry actually changes
 *       state rather than how many times the number crossed a line.
 *   SHELLS, THROUGH K1                  K2 marks, K1 grades. The pin runs BOTH lanes:
 *       K2 demotes, then K1's own advance is what reports `shell_formed`, which is
 *       the proof that the two lanes share one spelling of closed rather than two.
 *   WARM START                          the reopened row is the SAME row, and the
 *       capacity K1 reports is the one the shell remembered, not a fresh 1.
 *   DORMANCY                            flag absent means the world comes back BY
 *       REFERENCE, with no events, no closures and no ledger key.
 */
import { describe, it, expect } from 'vitest';
import {
  MAGIC_REGIME_EVENT_KINDS,
  advanceMagicRegime,
  advanceMagicRegimeFor,
  applyMagicFormPatches,
  applyMagicRegime,
  magicClosureFate,
} from '../../src/domain/worldPulse/magicRegimeLifecycle.js';
import {
  MAGIC_REGIME_LEDGER,
  MAGIC_REGIME_TUNING,
  readMagicRegimeLedger,
} from '../../src/domain/worldPulse/magicRegimeModel.js';
import { advanceInstitutionStatus } from '../../src/domain/worldPulse/institutionStatusLifecycle.js';
import { deriveInstitutionStatus, institutionStatusRef } from '../../src/domain/worldPulse/institutionStatusModel.js';
import { availableMagicForms, shelledMagicForms } from '../../src/domain/worldPulse/magicForms.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const LIT = { magicEconomyEnabled: true };

/** All four causal economy scores at one value, which is what economyHealthScore means. */
const scoresAt = (value) => ({
  trade_connectivity: value, labor_capacity: value,
  infrastructure_condition: value, food_security: value,
});

/** The scandal-hit foundry the fixtures close and reopen. */
const foundry = () => ({
  id: 'inst.foundry', name: 'Golem workforce', tags: ['arcane'], status: 'active',
  impairments: [{ type: 'corruption', severity: 0.3, causeEventId: 'corruption:e1' }],
});

const guild = () => ({ id: 'inst.guild', name: "Mages' guild", tags: ['arcane', 'guild'], status: 'active' });
const tower = () => ({ id: 'inst.tower', name: "Wizard's tower", tags: ['arcane'], status: 'active' });

/** A metropolis snapshot at a given economy, with a given roster. */
const snapshotOf = (institutions, economy100) => ({
  settlements: [{
    id: 's1',
    settlement: {
      tier: 'metropolis',
      config: { magicLevel: 'high' },
      institutions,
      activeConditions: [{ archetype: 'corruption_exposed' }],
    },
    causal: { scores: scoresAt(economy100) },
  }],
});

describe('the closed crossing vocabulary', () => {
  it('is exactly two kinds: the shell transitions belong to K1', () => {
    expect([...MAGIC_REGIME_EVENT_KINDS]).toEqual(['magic_regime_promoted', 'magic_regime_demoted']);
  });

  it('draws its closure fate from institutionLifecycle\'s existing three words, never a fourth', () => {
    expect(magicClosureFate('foundry')).toBe('bankrupt');
    expect(magicClosureFate('guild')).toBe('bankrupt');
    expect(magicClosureFate('circle')).toBe('closed_for_want_of_custom');
    expect(['bankrupt', 'closed_for_want_of_custom', 'shuttered']).toContain(magicClosureFate('practitioner'));
  });
});

describe('a crossing carries MATERIAL receipts (§3a, §8)', () => {
  it('a demotion names the rungs that closed AND the institutions that shut, by name', () => {
    const result = advanceMagicRegimeFor({
      item: snapshotOf([foundry(), guild(), tower()], 50).settlements[0],
      prior: { regime: 'industrial', sinceTick: 0 },
      tick: 10,
    });
    expect(result.event.kind).toBe('magic_regime_demoted');
    expect(result.event.from).toBe('industrial');
    expect(result.event.to).toBe('patronized');
    // THE RUNGS.
    expect([...result.event.receipts.closed]).toEqual(['guild', 'foundry']);
    // THE BUILDINGS, by name. This is what makes the receipt material rather than
    // a band index in prose.
    expect([...result.event.receipts.institutions].sort()).toEqual(['Golem workforce', "Mages' guild"]);
    // The tower survives, because the patronized ceiling still reaches it. Anchored on
    // the foundry: the receipt is provably live and correctly populated, and the tower
    // is the one standing magic institution correctly kept OUT of the closure list.
    expectAbsentWithAnchor(result.event.receipts.institutions, "Wizard's tower", 'Golem workforce');
    expect(result.closures.map((c) => c.name).sort()).toEqual(['Golem workforce', "Mages' guild"]);
    // And the prose actually says so, in world.
    expect(result.event.summary).toContain('Golem workforce');
    expect(result.event.summary).toContain('closes its doors');
    expect(result.event.reasons.join(' ')).toContain('0.50');
  });

  it('a promotion names the rungs that opened, and the gate rises with it', () => {
    const poor = advanceMagicRegimeFor({
      item: snapshotOf([], 50).settlements[0], prior: { regime: 'funded', sinceTick: 0 }, tick: 10,
    });
    expect(poor.event).toBeNull(); // 0.50 sits inside funded: no crossing at all.
    const rich = advanceMagicRegimeFor({
      item: snapshotOf([], 70).settlements[0], prior: { regime: 'funded', sinceTick: 0 }, tick: 10,
    });
    expect(rich.event.kind).toBe('magic_regime_promoted');
    expect(rich.event.to).toBe('patronized');
    expect([...rich.event.receipts.opened]).toEqual(['tower']);
    expect(rich.event.gate01).toBeGreaterThan(poor.record ? 0 : 0);
    expect(rich.event.headline).toContain('finds a purse');
  });

  it('a crossing that moves no rung says so rather than inventing a form', () => {
    // metropolis + high magic is floored at the circle, so subsistence and funded
    // resolve to the same band: the crossing is real and materially silent.
    const result = advanceMagicRegimeFor({
      item: snapshotOf([], 45).settlements[0], prior: { regime: 'subsistence', sinceTick: 0 }, tick: 10,
    });
    expect(result.event.kind).toBe('magic_regime_promoted');
    expect([...result.event.receipts.opened]).toEqual([]);
    expect([...result.event.receipts.institutions]).toEqual([]);
  });
});

describe('NO FLAPPING FOUNDRIES, driven over a real roster (law 4)', () => {
  it('an economy oscillating across the whole dead band does not churn the foundry every tick', () => {
    const { industrial } = MAGIC_REGIME_TUNING.thresholds;
    let world = { simulationRules: LIT };
    let institutions = [foundry(), guild(), tower()];
    let stateChanges = 0;
    let previouslyShelled = false;

    for (let tick = 1; tick <= 40; tick++) {
      const economy100 = tick % 2 === 0 ? (industrial.enter + 0.05) * 100 : (industrial.leave - 0.05) * 100;
      const result = applyMagicRegime(world, { snapshot: snapshotOf(institutions, economy100), tick });
      world = result.worldState;
      institutions = applyMagicFormPatches({
        settlement: { institutions },
        closures: result.closures,
        reopenings: result.reopenings,
        regime: 'patronized',
      }).institutions;
      const shelled = shelledMagicForms({ institutions }).length > 0;
      if (shelled !== previouslyShelled) stateChanges += 1;
      previouslyShelled = shelled;
    }

    // 40 ticks of a genuine swing on EVERY tick. Without hysteresis the foundry would
    // open and shut on alternating ticks.
    // ⚠ THE BOUND IS AN INDEPENDENT LITERAL, NOT `40 / minDwellTicks`: an expectation
    // computed from the constant it guards is vacuous (setting the dwell to 0 makes
    // the bound Infinity), which the negative control caught. 20 states the law.
    expect(stateChanges).toBeGreaterThan(0);
    expect(stateChanges).toBeLessThanOrEqual(20);
    expect(MAGIC_REGIME_TUNING.minDwellTicks).toBeGreaterThanOrEqual(2);
  });

  it('an economy jittering INSIDE the dead band never touches the foundry at all', () => {
    const { industrial } = MAGIC_REGIME_TUNING.thresholds;
    const mid = (industrial.enter + industrial.leave) / 2;
    let world = { simulationRules: LIT };
    const institutions = [foundry(), guild(), tower()];
    const before = JSON.stringify(institutions);
    let closures = 0;
    for (let tick = 1; tick <= 40; tick++) {
      const economy100 = (tick % 2 === 0 ? mid + 0.02 : mid - 0.02) * 100;
      const result = applyMagicRegime(world, { snapshot: snapshotOf(institutions, economy100), tick });
      world = result.worldState;
      closures += result.closures.length;
    }
    expect(closures).toBe(0);
    expect(JSON.stringify(institutions)).toBe(before);
  });
});

describe('SHELLS: K2 marks, K1 grades (§3c, law 6)', () => {
  /** Run one K2 demotion and hand the roster to K1, exactly as a wiring slice would. */
  function demoteAndGrade() {
    const world = { simulationRules: LIT };
    const institutions = [foundry(), guild(), tower()];
    const seeded = applyMagicRegime(
      { ...world, spatialLedgers: { [MAGIC_REGIME_LEDGER]: { s1: { regime: 'industrial', sinceTick: 0 } } } },
      { snapshot: snapshotOf(institutions, 50), tick: 10 },
    );
    const after = applyMagicFormPatches({
      settlement: { institutions }, closures: seeded.closures, regime: 'patronized',
    });
    return { seeded, after };
  }

  it('the closed row carries institutionLifecycle\'s EXACT close spelling', () => {
    const { after } = demoteAndGrade();
    const closed = after.institutions.find((i) => i.id === 'inst.foundry');
    expect(closed).toMatchObject({
      status: 'remnant',
      _worldPulseInactive: true,
      _worldPulseEconomyClosed: true,
      worldPulseFate: 'bankrupt',
    });
    expect(closed.remnantReason).toContain('the building stands');
  });

  it('K1 grades that row a SHELL, which is the proof both lanes spell closed once', () => {
    const { after } = demoteAndGrade();
    const closed = after.institutions.find((i) => i.id === 'inst.foundry');
    const verdict = deriveInstitutionStatus({ institution: closed });
    expect(verdict.status).toBe('shell');
    expect(verdict.shell).toBe(true);
    expect(verdict.capacity01).toBe(0);
    // ANCHOR: the untouched tower on the SAME roster is graded operational, so the
    // shell above measures the mark rather than a grader stuck on one word.
    expect(deriveInstitutionStatus({
      institution: after.institutions.find((i) => i.id === 'inst.tower'),
    }).status).toBe('operational');
  });

  it('K1\'s own advance emits shell_formed, and K2 emits no shell event of its own', () => {
    const { seeded, after } = demoteAndGrade();
    expect(seeded.events.map((e) => e.kind)).toEqual(['magic_regime_demoted']);
    const k1 = advanceInstitutionStatus({
      snapshot: { settlements: [{ id: 's1', settlement: after }] },
      worldState: { simulationRules: LIT },
      priorLedger: null,
      tick: 10,
    });
    const shellFormed = k1.events.filter((e) => e.kind === 'shell_formed');
    expect(shellFormed.map((e) => e.name)).toContain('Golem workforce');
    expect(shellFormed[0].headline).toContain('falls quiet');
  });

  it('the shell REMEMBERS the capacity it was running at, not a fresh full one', () => {
    const { after } = demoteAndGrade();
    const k1 = advanceInstitutionStatus({
      snapshot: { settlements: [{ id: 's1', settlement: after }] },
      worldState: { simulationRules: LIT },
      priorLedger: null,
      tick: 10,
    });
    // The foundry closed with a live corruption impairment, so the capacity it
    // remembers is the impaired one. A shell that remembered 1 would make every warm
    // start a cold one.
    const remembered = k1.ledger.s1[institutionStatusRef(foundry())];
    expect(remembered.shell.capacity01).toBeLessThan(1);
    expect(remembered.shell.capacity01).toBeGreaterThan(0);
  });
});

describe('WARM START: the same row reopens (law 6)', () => {
  function fullCycle() {
    let institutions = [foundry(), guild(), tower()];
    let world = {
      simulationRules: LIT,
      spatialLedgers: { [MAGIC_REGIME_LEDGER]: { s1: { regime: 'industrial', sinceTick: 0 } } },
    };
    // TICK 10: the economy falls, the foundry closes.
    const down = applyMagicRegime(world, { snapshot: snapshotOf(institutions, 50), tick: 10 });
    world = down.worldState;
    institutions = applyMagicFormPatches({
      settlement: { institutions }, closures: down.closures, regime: 'patronized',
    }).institutions;
    const k1Down = advanceInstitutionStatus({
      snapshot: { settlements: [{ id: 's1', settlement: { institutions } }] },
      worldState: { simulationRules: LIT }, priorLedger: null, tick: 10,
    });
    // TICK 20: the economy recovers past the dwell, the ceiling rises, the row reopens.
    const up = applyMagicRegime(world, { snapshot: snapshotOf(institutions, 95), tick: 20 });
    world = up.worldState;
    institutions = applyMagicFormPatches({
      settlement: { institutions }, reopenings: up.reopenings, regime: 'industrial',
    }).institutions;
    const k1Up = advanceInstitutionStatus({
      snapshot: { settlements: [{ id: 's1', settlement: { institutions } }] },
      worldState: { simulationRules: LIT }, priorLedger: k1Down.ledger, tick: 20,
    });
    return { down, up, institutions, k1Down, k1Up, world };
  }

  it('the reopened institution is the SAME ROW: same id, same name, never a rebuild', () => {
    const { up, institutions } = fullCycle();
    expect(up.reopenings.map((r) => r.name)).toContain('Golem workforce');
    const reopened = institutions.filter((i) => i.id === 'inst.foundry');
    expect(reopened.length, 'a rebuild would have added a second row').toBe(1);
    expect(reopened[0].status).toBe('active');
    expect(reopened[0]._worldPulseEconomyClosed).toBe(false);
  });

  it('K1 emits shell_reactivated and reports the warm start it resumes from', () => {
    const { k1Up } = fullCycle();
    const reactivated = k1Up.events.filter((e) => e.kind === 'shell_reactivated');
    expect(reactivated.map((e) => e.name)).toContain('Golem workforce');
    expect(reactivated[0].summary).toContain('resumes from what it remembered');
    expect(reactivated[0].reasons.join(' ')).toContain('warm start');
  });

  it('the warm-start capacity is the one the shell remembered, strictly below full', () => {
    const { k1Up, institutions } = fullCycle();
    const key = institutionStatusRef(foundry());
    const verdict = deriveInstitutionStatus({
      institution: institutions.find((i) => i.id === 'inst.foundry'),
      record: k1Up.ledger.s1[key],
    });
    expect(verdict.warmStart).toBeTruthy();
    expect(verdict.warmStart.capacity01).toBeLessThan(1);
    expect(verdict.warmStart.closedTick).toBe(10);
  });

  it('the corruption scandal SURVIVES the close and reopen: the cycle launders nothing', () => {
    const { institutions } = fullCycle();
    const reopened = institutions.find((i) => i.id === 'inst.foundry');
    expect(reopened.impairments.map((i) => i.type)).toContain('corruption');
  });

  it('a shelled row is present before the recovery and gone from the shell set after it', () => {
    const { institutions } = fullCycle();
    let mid = [foundry(), guild(), tower()];
    const down = applyMagicRegime(
      { simulationRules: LIT, spatialLedgers: { [MAGIC_REGIME_LEDGER]: { s1: { regime: 'industrial', sinceTick: 0 } } } },
      { snapshot: snapshotOf(mid, 50), tick: 10 },
    );
    mid = applyMagicFormPatches({ settlement: { institutions: mid }, closures: down.closures, regime: 'patronized' }).institutions;
    expectPresentThenAbsent(
      shelledMagicForms({ institutions: mid }).map((f) => f.institution.name),
      shelledMagicForms({ institutions }).map((f) => f.institution.name),
      'Golem workforce',
    );
  });
});

describe('DORMANCY (law 8, §10)', () => {
  it('the flag absent means the world comes back BY REFERENCE, with nothing at all done', () => {
    const world = { simulationRules: {}, spatialLedgers: undefined };
    const result = applyMagicRegime(world, { snapshot: snapshotOf([foundry()], 95), tick: 5 });
    expect(result.worldState).toBe(world);
    expect(result.events).toEqual([]);
    expect(result.closures).toEqual([]);
    expect(result.reopenings).toEqual([]);
  });

  it('a dark advance returns the prior ledger untouched and writes no key', () => {
    const result = advanceMagicRegime({
      snapshot: snapshotOf([foundry()], 95),
      worldState: { simulationRules: { magicEconomyEnabled: false } },
      priorLedger: null,
      tick: 5,
    });
    expect(result).toEqual({ ledger: null, events: [], closures: [], reopenings: [] });
  });

  it('a dark world is BYTE-IDENTICAL after an advance that a lit world would have changed', () => {
    const dark = { simulationRules: {} };
    const before = JSON.stringify(dark);
    const result = applyMagicRegime(dark, { snapshot: snapshotOf([foundry()], 95), tick: 5 });
    expect(JSON.stringify(dark)).toBe(before);
    // ⚠ THE RETURNED WORLD, NOT JUST THE INPUT. Asserting only that `dark` is
    // unmutated is a WEAK claim that a gateless build also satisfies, because
    // setSpatialLedger is immutable and never touches its argument: the negative
    // control caught exactly that. The dormancy claim is about what comes BACK.
    expect(readMagicRegimeLedger(result.worldState)).toBeNull();
    expect(JSON.stringify(result.worldState)).toBe(before);
    // ANCHOR: the SAME advance on a LIT world does write, so the null above measures
    // the gate rather than an advance that never does anything.
    const lit = applyMagicRegime({ simulationRules: LIT }, { snapshot: snapshotOf([foundry()], 95), tick: 5 });
    expect(readMagicRegimeLedger(lit.worldState)).toBeTruthy();
  });

  it('a lit world whose settlements all sit at the base regime still writes NO key', () => {
    const lit = applyMagicRegime(
      { simulationRules: LIT },
      { snapshot: snapshotOf([], 10), tick: 99 },
    );
    expect(readMagicRegimeLedger(lit.worldState)).toBeNull();
  });

  it('...and still writes no key on the EARLY ticks, inside the dwell window', () => {
    // The tick-99 case above is carried by the dwell expiring, so it would pass even
    // with the never-crossed rule deleted. These early ticks are the ones that rule
    // actually holds up, and without it a lit realm grows one permanent ledger entry
    // per poor settlement from its very first advance.
    for (const tick of [0, 1, 2, 3]) {
      const lit = applyMagicRegime({ simulationRules: LIT }, { snapshot: snapshotOf([], 10), tick });
      expect(readMagicRegimeLedger(lit.worldState), `tick ${tick} wrote a base-regime key`).toBeNull();
    }
    // ANCHOR: a settlement that actually CROSSES on an early tick does write, so the
    // four nulls measure the never-crossed rule rather than an advance that is inert.
    const crossed = applyMagicRegime({ simulationRules: LIT }, { snapshot: snapshotOf([], 70), tick: 1 });
    expect(readMagicRegimeLedger(crossed.worldState)).toBeTruthy();
  });
});

describe('purity and persistence', () => {
  it('does not mutate the snapshot, the roster or the input worldState', () => {
    const institutions = [foundry(), guild(), tower()];
    const snapshot = snapshotOf(institutions, 50);
    const world = {
      simulationRules: LIT,
      spatialLedgers: { [MAGIC_REGIME_LEDGER]: { s1: { regime: 'industrial', sinceTick: 0 } } },
    };
    const beforeSnapshot = JSON.stringify(snapshot);
    const beforeWorld = JSON.stringify(world);
    applyMagicRegime(world, { snapshot, tick: 10 });
    expect(JSON.stringify(snapshot)).toBe(beforeSnapshot);
    expect(JSON.stringify(world)).toBe(beforeWorld);
  });

  it('survives a JSON round trip of the world and resumes the same regime', () => {
    const world = applyMagicRegime(
      { simulationRules: LIT },
      { snapshot: snapshotOf([], 70), tick: 1 },
    ).worldState;
    const revived = JSON.parse(JSON.stringify(world));
    expect(readMagicRegimeLedger(revived)).toEqual(readMagicRegimeLedger(world));
    // And an advance over the revived world behaves as one over the original.
    const fromOriginal = applyMagicRegime(world, { snapshot: snapshotOf([], 70), tick: 9 });
    const fromRevived = applyMagicRegime(revived, { snapshot: snapshotOf([], 70), tick: 9 });
    expect(JSON.stringify(readMagicRegimeLedger(fromRevived.worldState)))
      .toBe(JSON.stringify(readMagicRegimeLedger(fromOriginal.worldState)));
  });

  it('applyMagicFormPatches returns the SAME REFERENCE when nothing applies', () => {
    const settlement = { institutions: [tower()] };
    expect(applyMagicFormPatches({ settlement })).toBe(settlement);
    expect(applyMagicFormPatches({ settlement, closures: [{ cid: 's1', ref: 'nobody', name: 'x', form: 'guild' }] }))
      .toBe(settlement);
  });

  it('the band a demotion computes is the band the closures were taken against', () => {
    const settlement = { tier: 'metropolis', config: { magicLevel: 'high' }, institutions: [foundry(), tower()] };
    const result = advanceMagicRegimeFor({
      item: { id: 's1', settlement, causal: { scores: scoresAt(50) } },
      prior: { regime: 'industrial', sinceTick: 0 },
      tick: 10,
    });
    const band = availableMagicForms({ settlement, regime: result.record.regime });
    expect(band.top).toBe('tower');
    expect(result.closures.map((c) => c.form)).toEqual(['foundry']);
  });
});

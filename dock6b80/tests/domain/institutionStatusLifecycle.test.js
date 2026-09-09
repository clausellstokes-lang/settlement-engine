/**
 * institutionStatusLifecycle.test.js — W-K slice K1, the lifecycle half
 * (docs/DESIGN_MAGIC_ECONOMY.md §3c, §12's status test list).
 *
 * The five claims §12 asks this slice to prove, each pinned here with the
 * anti-vacuity anchor that makes it non-trivial:
 *
 *   NO-ORPHAN TOTALITY   an impairment cannot outlive its cause. Pinned by running
 *       auditInstitutionStatusLedger BEFORE and AFTER an advance over a ledger that
 *       was hand-orphaned: the before is dirty (the anchor), the after is clean.
 *   AUTOMATIC LIFT       the resolution emits an EVENT rather than silently dropping
 *       a record, and it fires on the same advance that notices.
 *   TWO-TIMESCALE        a fast cause impairs with NO motion on the slow axis. The
 *       anchor is that the shell verdict is byte-identical across the impairing tick.
 *   SHELL WARM START     a reopened shell resumes from what it remembered, not from
 *       nothing, and the remembered number is the capacity at CLOSE (not the shell's
 *       own zero, which would make every warm start a cold one).
 *   DORMANCY             flag absent means the world comes back BY REFERENCE and no
 *       ledger key is ever written.
 *
 * The cause reads are pinned against the marks the estate's own producers write
 * (supplyKernel's supply_starved, corruptionImpair's corruption, mutateEntities'
 * capacity, the occupations ledger), so a producer that renames its mark reds here
 * rather than silently ending every impairment in the game.
 */
import { describe, it, expect } from 'vitest';
import {
  INSTITUTION_STATUS_EVENT_KINDS,
  advanceInstitutionStatus,
  applyInstitutionStatus,
  buildLiveCauseIndex,
  liveCausesFor,
  readInstitutionCauseContext,
} from '../../src/domain/worldPulse/institutionStatusLifecycle.js';
import {
  INSTITUTION_IMPAIRMENT_CAUSES,
  INSTITUTION_STATUS_LEDGER,
  auditInstitutionStatusLedger,
  defaultSeverityForCause,
  deriveInstitutionStatus,
  impairmentAnnotation,
  readInstitutionStatusLedger,
  withDmSeverity,
} from '../../src/domain/worldPulse/institutionStatusModel.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const LIT = { magicEconomyEnabled: true };

/**
 * A settlement snapshot. `impairments` are the ESTATE's own impairment shape, exactly
 * as supplyKernel / corruptionImpair / mutateEntities stamp them.
 */
const snapshotOf = (institutions, conditions = []) => ({
  settlements: [{
    id: 's1',
    settlement: {
      institutions,
      activeConditions: conditions.map((archetype) => ({ archetype })),
    },
  }],
});

const hall = (extra = {}) => ({ id: 'institution.grain_hall', name: 'The Grain Hall', status: 'active', ...extra });

/** The exact mark supplyKernel stamps when an input road is cut. */
const supplyStarved = () => ({
  impairments: [{ type: 'supply_starved', severity: 0.6, causeEventId: 'supply-starved:s1' }],
});

/** The exact mark corruptionImpair stamps once an ousting makes the rot public. */
const corruptionMark = () => ({
  impairments: [{ type: 'corruption', severity: 0.45, causeEventId: 'corruption:npc_1:ousted:institutional' }],
});

/** The exact mark events/mutateEntities damageInstitution stamps. */
const damageMark = () => ({
  impairments: [{ type: 'capacity', severity: 0.7, causeEventId: 'evt_1' }],
});

const world = (rules = LIT, extra = {}) => ({ simulationRules: rules, ...extra });

const advance = (institutions, { conditions = [], priorLedger = null, tick = 10, rules = LIT, occupations = null } = {}) => (
  advanceInstitutionStatus({
    snapshot: snapshotOf(institutions, conditions),
    worldState: world(rules, occupations ? { occupations } : {}),
    priorLedger,
    tick,
  })
);

describe('K1 the cause reads are OTHER LAYERS\' marks, never new state', () => {
  it('supply_shortage reads supplyKernel\'s supply_starved stamp', () => {
    const ctx = readInstitutionCauseContext({
      institution: hall(supplyStarved()), settlement: {}, worldState: null, cid: 's1',
    });
    expect(liveCausesFor(ctx)).toEqual([
      { cause: 'supply_shortage', causeRef: 'impairment:supply_starved:institution_grain_hall' },
    ]);
  });

  it('supply_shortage also reads the settlement-level famine and cut-route conditions', () => {
    for (const condition of ['famine', 'trade_route_cut', 'regional_import_shortage']) {
      const ctx = readInstitutionCauseContext({
        institution: hall(),
        settlement: { activeConditions: [{ archetype: condition }] },
        worldState: null,
        cid: 's1',
      });
      expect(liveCausesFor(ctx).map((c) => c.cause), `${condition} did not read as a supply shortage`)
        .toEqual(['supply_shortage']);
    }
  });

  it('corruption_exposed reads corruptionImpair\'s corruption stamp', () => {
    const ctx = readInstitutionCauseContext({
      institution: hall(corruptionMark()), settlement: {}, worldState: null, cid: 's1',
    });
    expect(liveCausesFor(ctx).map((c) => c.cause)).toEqual(['corruption_exposed']);
  });

  it('damage reads the capacity stamp damageInstitution writes', () => {
    const ctx = readInstitutionCauseContext({
      institution: hall(damageMark()), settlement: {}, worldState: null, cid: 's1',
    });
    expect(liveCausesFor(ctx).map((c) => c.cause)).toEqual(['damage']);
  });

  it('siege_occupation reads the occupations ledger and the siege conditions', () => {
    const occupied = readInstitutionCauseContext({
      institution: hall(), settlement: {}, worldState: { occupations: { s1: { by: 'f2' } } }, cid: 's1',
    });
    expect(liveCausesFor(occupied)).toEqual([{ cause: 'siege_occupation', causeRef: 'occupation:s1' }]);

    const besieged = readInstitutionCauseContext({
      institution: hall(), settlement: { activeConditions: [{ archetype: 'siege' }] }, worldState: null, cid: 's1',
    });
    expect(liveCausesFor(besieged).map((c) => c.cause)).toEqual(['siege_occupation']);
  });

  it('a RESTORATION patch and a COVERT mark are NOT capacity causes', () => {
    // A negative severity is a restoration patch and a covert mark is a hidden capture;
    // entities/status.js already refuses to call either one visibly impairing, and K1
    // must agree or a popular leader's legitimacy bonus would read as damage.
    const patched = readInstitutionCauseContext({
      institution: hall({ impairments: [{ type: 'capacity', severity: -0.4, causeEventId: 'evt_boon' }] }),
      settlement: {}, worldState: null, cid: 's1',
    });
    expect(liveCausesFor(patched)).toEqual([]);
    const covert = readInstitutionCauseContext({
      institution: hall({ impairments: [{ type: 'capacity', severity: 0.7, causeEventId: 'evt_1', covert: true }] }),
      settlement: {}, worldState: null, cid: 's1',
    });
    expect(liveCausesFor(covert)).toEqual([]);
    // Anti-vacuity: the SAME shape without the patch/covert flag DOES read live.
    const real = readInstitutionCauseContext({
      institution: hall(damageMark()), settlement: {}, worldState: null, cid: 's1',
    });
    expect(liveCausesFor(real).map((c) => c.cause)).toEqual(['damage']);
  });

  it('a LEGITIMACY drag is deliberately NOT a capacity cause', () => {
    // Recorded, not forgotten: §3c's impairment is a CAPACITY modifier, so a scandal
    // that costs standing without costing output is honestly not one.
    const ctx = readInstitutionCauseContext({
      institution: hall({ impairments: [{ type: 'legitimacy', severity: 0.5, causeEventId: 'faction_suppression:f2' }] }),
      settlement: {}, worldState: null, cid: 's1',
    });
    expect(liveCausesFor(ctx)).toEqual([]);
  });
});

describe('K1 DORMANCY: the dark world is byte-identical (law 8)', () => {
  it('the advance is a no-op and writes no ledger when the flag is absent', () => {
    const dark = advance([hall(damageMark())], { rules: {} });
    expect(dark).toEqual({ ledger: null, events: [] });
    // Anti-vacuity: the SAME fixture under a lit flag DOES produce a ledger and events.
    const lit = advance([hall(damageMark())]);
    expect(lit.ledger).not.toBe(null);
    expect(lit.events.length).toBeGreaterThan(0);
  });

  it('a declared-false flag is behaviourally identical to an absent one', () => {
    expect(advance([hall(damageMark())], { rules: { magicEconomyEnabled: false } }))
      .toEqual(advance([hall(damageMark())], { rules: {} }));
  });

  it('applyInstitutionStatus returns the input worldState BY REFERENCE when dark', () => {
    const before = world({});
    const { worldState: after, events } = applyInstitutionStatus(before, {
      snapshot: snapshotOf([hall(damageMark())]), tick: 3,
    });
    expect(after).toBe(before);          // object identity, the strongest form of the gate
    expect(events).toEqual([]);
    expect(after.spatialLedgers).toBe(undefined);
  });

  it('a lit world that heals drops the key, so it re-reads as never having had one', () => {
    const sick = applyInstitutionStatus(world(), { snapshot: snapshotOf([hall(damageMark())]), tick: 1 });
    const healed = applyInstitutionStatus(sick.worldState, { snapshot: snapshotOf([hall()]), tick: 2 });
    expectPresentThenAbsent(
      Object.keys(sick.worldState.spatialLedgers || {}),
      Object.keys(healed.worldState.spatialLedgers || {}),
      INSTITUTION_STATUS_LEDGER,
      'a healed realm drops the ledger key',
    );
    expect(JSON.stringify(healed.worldState)).toBe(JSON.stringify(world()));
  });
});

describe('K1 THE NO-ORPHAN LAW (§3c: an impairment can NEVER orphan)', () => {
  it('an orphaned ledger is DIRTY before the advance and CLEAN after it', () => {
    // The cause is gone from the world (a healthy hall), but the ledger still carries
    // the record. This is the state a save reloaded after its cause resolved would be
    // in, and it is the only way an orphan can exist at all.
    const orphaned = {
      s1: {
        institution_grain_hall: {
          impairments: { damage: impairmentAnnotation({ cause: 'damage', causeRef: 'impairment:capacity:institution_grain_hall', sinceTick: 1 }) },
        },
      },
    };
    const snapshot = snapshotOf([hall()]);
    const liveIndex = buildLiveCauseIndex({ settlements: snapshot.settlements, worldState: world() });

    const before = auditInstitutionStatusLedger(orphaned, liveIndex);
    expect(before.ok, 'THE ANCHOR: the hand-orphaned ledger must genuinely audit dirty').toBe(false);
    expect(before.orphans[0].reason).toBe('the bound cause no longer reads live');

    const { ledger } = advance([hall()], { priorLedger: orphaned });
    const after = auditInstitutionStatusLedger(ledger, liveIndex);
    expect(after).toEqual({ ok: true, orphans: [] });
    expect(ledger).toBe(null);   // nothing left to remember, so nothing is persisted
  });

  it('the advance is TOTAL over the cause vocabulary: every cause can orphan and be swept', () => {
    // A SEED-FAMILY style totality rather than one cause: a per-cause sweep that only
    // covered `damage` would be a vacuous restriction pin.
    for (const cause of INSTITUTION_IMPAIRMENT_CAUSES) {
      const orphaned = {
        s1: {
          institution_grain_hall: {
            impairments: { [cause]: impairmentAnnotation({ cause, causeRef: `stale:${cause}`, sinceTick: 1 }) },
          },
        },
      };
      const { ledger, events } = advance([hall()], { priorLedger: orphaned });
      expect(ledger, `${cause} survived an advance in which it did not read live`).toBe(null);
      expect(events.map((e) => e.kind), `${cause} was dropped without a lift event`)
        .toEqual(['impairment_lifted']);
      expect(events[0].cause).toBe(cause);
    }
  });

  it('a record on a RUINED institution is dropped without a lift, because ruin is not a cure', () => {
    const prior = {
      s1: {
        institution_grain_hall: {
          impairments: { damage: impairmentAnnotation({ cause: 'damage', causeRef: 'impairment:capacity:institution_grain_hall', sinceTick: 1 }) },
        },
      },
    };
    const { ledger, events } = advance(
      [hall({ ...damageMark(), status: 'ruined', _worldPulseInactive: true })],
      { priorLedger: prior },
    );
    expect(ledger).toBe(null);
    // No lift: the impairment did not resolve, the institution did.
    //
    // THE ANCHOR is the sibling run, not a vocabulary constant: the SAME prior ledger
    // over a STANDING institution whose cause has cleared genuinely does emit a lift,
    // so the empty event list below is the ruin rule and not a dead lift path.
    const standing = advance([hall()], { priorLedger: prior });
    expectPresentThenAbsent(
      standing.events.map((e) => e.kind), events.map((e) => e.kind), 'impairment_lifted',
      'a cleared cause lifts on a standing institution; a ruin is not a cure',
    );
    expect(events).toEqual([]);
  });

  it('the live index and the advance agree, so the audit can never contradict the writer', () => {
    const snapshot = snapshotOf([hall(supplyStarved())]);
    const { ledger } = advance([hall(supplyStarved())]);
    const liveIndex = buildLiveCauseIndex({ settlements: snapshot.settlements, worldState: world() });
    expect(auditInstitutionStatusLedger(ledger, liveIndex)).toEqual({ ok: true, orphans: [] });
  });
});

describe('K1 THE AUTOMATIC LIFT emits an event (§3c)', () => {
  it('lifts on the SAME advance that notices, carrying the cause and its cure', () => {
    const { ledger: sick } = advance([hall(supplyStarved())], { tick: 5 });
    expect(Object.keys(sick.s1.institution_grain_hall.impairments)).toEqual(['supply_shortage']);

    const { ledger: well, events } = advance([hall()], { priorLedger: sick, tick: 9 });
    expect(well).toBe(null);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      kind: 'impairment_lifted', cid: 's1', ref: 'institution_grain_hall',
      name: 'The Grain Hall', cause: 'supply_shortage', tick: 9, capacity01: 1,
    });
    expect(events[0].summary).toContain('the road reopens or the stores refill');
    expect(events[0].reasons[0]).toContain('lifted automatically');
  });

  it('an opening cause emits its own receipt and stamps the tick it began', () => {
    const { ledger, events } = advance([hall(damageMark())], { tick: 7 });
    expect(events.map((e) => e.kind)).toEqual(['impairment_opened']);
    expect(ledger.s1.institution_grain_hall.impairments.damage.sinceTick).toBe(7);
  });

  it('a cause that HOLDS emits nothing and keeps its original sinceTick', () => {
    const { ledger: first } = advance([hall(damageMark())], { tick: 7 });
    const { ledger: second, events } = advance([hall(damageMark())], { priorLedger: first, tick: 30 });
    expect(events).toEqual([]);
    expect(second.s1.institution_grain_hall.impairments.damage.sinceTick).toBe(7);
  });

  it('a DM override survives an advance in which its cause still holds', () => {
    const { ledger: first } = advance([hall(damageMark())], { tick: 7 });
    const overridden = {
      s1: {
        institution_grain_hall: {
          impairments: { damage: withDmSeverity(first.s1.institution_grain_hall.impairments.damage, 1) },
        },
      },
    };
    const { ledger: second } = advance([hall(damageMark())], { priorLedger: overridden, tick: 8 });
    expect(second.s1.institution_grain_hall.impairments.damage.dmSeverity).toBe(1);
    const verdict = deriveInstitutionStatus({
      institution: hall(damageMark()), record: second.s1.institution_grain_hall,
    });
    expect(verdict.capacity01).toBe(0);

    // And it does NOT survive the cause resolving: a suspension is bound to its cause
    // exactly like the engine's own default is.
    const { ledger: third, events } = advance([hall()], { priorLedger: overridden, tick: 9 });
    expect(third).toBe(null);
    expect(events.map((e) => e.kind)).toEqual(['impairment_lifted']);
  });

  it('the bound cause INSTANCE is refreshed while the cause class holds', () => {
    // The record must always name the cause that is live NOW, not the one that first
    // raised it, or a supply shortage cured by one road and re-opened by another would
    // point at a dead instance.
    const { ledger: first } = advance([hall(supplyStarved())], { tick: 4 });
    expect(first.s1.institution_grain_hall.impairments.supply_shortage.causeRef)
      .toBe('impairment:supply_starved:institution_grain_hall');
    const { ledger: second } = advance([hall()], { conditions: ['famine'], priorLedger: first, tick: 5 });
    expect(second.s1.institution_grain_hall.impairments.supply_shortage.causeRef)
      .toBe('condition:famine:s1');
    expect(second.s1.institution_grain_hall.impairments.supply_shortage.sinceTick).toBe(4);
  });
});

describe('K1 THE TWO-TIMESCALE LAW: fast impairs, slow does not move (§3c)', () => {
  it('a cut road impairs immediately with NO motion on the slow axis', () => {
    const healthy = advance([hall()], { tick: 1 });
    expect(healthy.ledger).toBe(null);

    const cut = advance([hall(supplyStarved())], { tick: 2 });
    const verdict = deriveInstitutionStatus({
      institution: hall(supplyStarved()), record: cut.ledger.s1.institution_grain_hall,
    });
    // FAST: the impairment is live on the very next tick.
    expect(verdict.impaired).toBe(true);
    expect(verdict.capacity01).toBeCloseTo(1 - defaultSeverityForCause('supply_shortage'), 10);
    // SLOW: nothing about the funding verdict moved. Not the flag, not the stored shell
    // memory, not the emitted transitions.
    expect(verdict.shell).toBe(false);
    expect(cut.ledger.s1.institution_grain_hall.shell).toBe(undefined);
    expectAbsentWithAnchor(
      cut.events.map((e) => e.kind), 'shell_formed', 'impairment_opened',
      'the fast layer fired; the slow layer did not',
    );
  });

  it('this module CANNOT move the slow axis: the shell verdict is a read, not a write', () => {
    // The structural half of the law. Whatever the fast layer does, the institution
    // rows the advance was handed come back with their close marks untouched, because
    // opening and closing an institution is institutionLifecycle's job alone.
    const institution = hall(supplyStarved());
    const before = JSON.stringify(institution);
    advance([institution], { tick: 2 });
    expect(JSON.stringify(institution)).toBe(before);
  });
});

describe('K1 SHELL and its WARM START (law 6, INFRASTRUCTURE REMEMBERS)', () => {
  const shelledHall = (extra = {}) => hall({
    status: 'remnant', _worldPulseInactive: true, _worldPulseEconomyClosed: true, ...extra,
  });

  it('a shell forms with an event and remembers the capacity it closed at', () => {
    // It closes while ALREADY impaired, which is the case that separates a real warm
    // start from a cold one: the remembered number must be the capacity at close, not
    // the shell's own zero and not a full 1.
    const { ledger, events } = advance([shelledHall(supplyStarved())], { tick: 12 });
    const record = ledger.s1.institution_grain_hall;
    expect(events.map((e) => e.kind).sort()).toEqual(['impairment_opened', 'shell_formed']);
    expect(record.shell.sinceTick).toBe(12);
    expect(record.shell.capacity01).toBeCloseTo(1 - defaultSeverityForCause('supply_shortage'), 10);
    expect(record.shell.capacity01).toBeGreaterThan(0);   // NOT the shell's own zero
    expect(record.shell.capacity01).toBeLessThan(1);      // NOT a cold full rebuild
  });

  it('the shell verdict is zero output while it stands, and the impairment composes', () => {
    const { ledger } = advance([shelledHall(supplyStarved())], { tick: 12 });
    const verdict = deriveInstitutionStatus({
      institution: shelledHall(supplyStarved()), record: ledger.s1.institution_grain_hall,
    });
    expect(verdict).toMatchObject({ status: 'shell', shell: true, impaired: true, capacity01: 0 });
  });

  it('reopening WARM STARTS: the verdict reports what the shell remembered', () => {
    const { ledger: closed } = advance([shelledHall(supplyStarved())], { tick: 12 });
    const remembered = closed.s1.institution_grain_hall.shell.capacity01;

    // institutionLifecycle's `found` path re-raises the remnant: status active, the
    // close flags cleared. K1 reads that and reports the warm start.
    const reopened = hall({ ...supplyStarved(), status: 'active', _worldPulseInactive: false, _worldPulseEconomyClosed: false });
    const { ledger: back, events } = advance([reopened], { priorLedger: closed, tick: 40 });
    expect(events.map((e) => e.kind)).toEqual(['shell_reactivated']);

    const record = back.s1.institution_grain_hall;
    expectPresentThenAbsent(
      Object.keys(closed.s1.institution_grain_hall), Object.keys(record), 'shell',
      'the shell mark clears when the doors reopen',
    );
    expect(record.priorShell.capacity01).toBe(remembered);

    const verdict = deriveInstitutionStatus({ institution: reopened, record });
    expect(verdict.status).toBe('impaired');
    expect(verdict.shell).toBe(false);
    expect(verdict.warmStart).toEqual({ capacity01: remembered, closedTick: 12 });
  });

  it('an institution that never shelled reports NO warm start at all', () => {
    const { ledger } = advance([hall(supplyStarved())], { tick: 3 });
    const verdict = deriveInstitutionStatus({
      institution: hall(supplyStarved()), record: ledger.s1.institution_grain_hall,
    });
    expect(verdict.warmStart).toBe(undefined);
    expect('warmStart' in verdict).toBe(false);
  });

  it('a shell that stands for years keeps its ORIGINAL close tick and memory', () => {
    const { ledger: first } = advance([shelledHall(supplyStarved())], { tick: 12 });
    const { ledger: later, events } = advance([shelledHall(supplyStarved())], { priorLedger: first, tick: 300 });
    expect(events).toEqual([]);
    expect(later.s1.institution_grain_hall.shell).toEqual(first.s1.institution_grain_hall.shell);
  });

  it('an UNIMPAIRED shell remembers a full capacity, so recovery is genuinely warm', () => {
    const { ledger } = advance([shelledHall()], { tick: 12 });
    expect(ledger.s1.institution_grain_hall.shell.capacity01).toBe(1);
  });
});

describe('K1 the advance is deterministic, pure and draw-free', () => {
  it('two identical advances produce byte-identical results', () => {
    const one = advance([hall(supplyStarved()), hall({ ...corruptionMark(), id: 'institution.watch', name: 'The Watch' })], { tick: 6 });
    const two = advance([hall(supplyStarved()), hall({ ...corruptionMark(), id: 'institution.watch', name: 'The Watch' })], { tick: 6 });
    expect(JSON.stringify(one)).toBe(JSON.stringify(two));
  });

  it('takes no rng at all, so it cannot steal a draw from the pulse stream', () => {
    // The advance's signature has no rng parameter and the module imports none: a draw
    // here would perturb every downstream seeded decision and move a golden.
    expect(advanceInstitutionStatus.length).toBeLessThanOrEqual(1);
    const { events } = advance([hall(damageMark())], { tick: 1 });
    for (const event of events) expect(INSTITUTION_STATUS_EVENT_KINDS).toContain(event.kind);
  });

  it('multiple causes on one institution stack into one record, keyed by cause', () => {
    const beset = hall({
      impairments: [
        { type: 'supply_starved', severity: 0.6, causeEventId: 'supply-starved:s1' },
        { type: 'capacity', severity: 0.7, causeEventId: 'evt_1' },
      ],
    });
    const { ledger } = advance([beset], { conditions: ['siege'], tick: 2 });
    expect(Object.keys(ledger.s1.institution_grain_hall.impairments).sort())
      .toEqual(['damage', 'siege_occupation', 'supply_shortage']);
  });
});

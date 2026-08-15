/**
 * institutionStatusModel.test.js — W-K slice K1, the GENERAL INSTITUTION STATUS
 * model (docs/DESIGN_MAGIC_ECONOMY.md §3c).
 *
 * The pins here hold the MODEL half: the closed vocabularies, the capacity
 * arithmetic, the DM override band, the shell/ruin discrimination, the impaired-shell
 * composition, and the ledger's drop-when-empty round trip. The LIFECYCLE half (the
 * automatic lift, the two-timescale law, warm start, no-orphan totality) is pinned in
 * institutionStatusLifecycle.test.js.
 *
 * TWO PINS ARE LOAD-BEARING BEYOND THEIR OWN SUBJECT:
 *
 *   1. THE COMPOUNDING RULE IS PROVED SHARED, NOT FORKED. `combineSeverities`
 *      restates entities/status.js `severityFor`'s formula because the two aggregate
 *      over different homes and neither can call the other. A pin runs BOTH on
 *      identical numbers, so the moment either spelling moves, this file reds instead
 *      of the estate carrying two silently drifting definitions of how impairments
 *      compound.
 *   2. SHELL AND A ZERO-CAPACITY IMPAIRMENT ARE DISTINCT STATES WITH DISTINCT CURES.
 *      Both report zero output, which is exactly why a vocabulary that collapsed them
 *      would be indistinguishable in a test that only read capacity. The pin asserts
 *      the words, the flags AND the cures diverge.
 */
import { describe, it, expect } from 'vitest';
import {
  INSTITUTION_CAUSE_CURES,
  INSTITUTION_CAUSE_LABELS,
  INSTITUTION_IMPAIRMENT_CAUSES,
  INSTITUTION_STATUSES,
  INSTITUTION_STATUS_LEDGER,
  INSTITUTION_STATUS_TUNING,
  MAGIC_ECONOMY_RULE,
  STATUS_IMPAIRED,
  STATUS_OPERATIONAL,
  STATUS_SHELL,
  auditInstitutionStatusLedger,
  clampSeverity,
  clearDmSeverity,
  combineSeverities,
  defaultSeverityForCause,
  deriveInstitutionStatus,
  effectiveSeverity,
  impairmentAnnotation,
  institutionStatusRef,
  isRuinedInstitution,
  isShellInstitution,
  magicEconomyActive,
  readInstitutionStatusLedger,
  readInstitutionStatusRecord,
  withDmSeverity,
  writeInstitutionStatusLedger,
} from '../../src/domain/worldPulse/institutionStatusModel.js';
import { severityFor, withImpairment } from '../../src/domain/entities/status.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

/** A plain working institution. */
const working = (name = 'The Grain Hall') => ({ id: `institution.${name}`, name, status: 'active' });

/** The economic close institutionLifecycle actually writes. */
const shelled = (name = 'The Grain Hall') => ({
  ...working(name),
  status: 'remnant',
  _worldPulseInactive: true,
  _worldPulseEconomyClosed: true,
});

/** The calamity strike institutionLifecycle's sibling actually writes. */
const ruined = (name = 'The Grain Hall') => ({
  ...working(name),
  status: 'ruined',
  _worldPulseInactive: true,
  _worldPulseEconomyClosed: true,
});

/** A record carrying one live cause. */
const recordWith = (cause, extra = {}) => ({
  impairments: { [cause]: impairmentAnnotation({ cause, causeRef: `ref:${cause}`, sinceTick: 4 }), },
  ...extra,
});

describe('K1 the closed vocabularies (law 7, FINITE SEMANTICS)', () => {
  it('is exactly the three words §3c names, in the design\'s order', () => {
    expect(INSTITUTION_STATUSES).toEqual(['operational', 'impaired', 'shell']);
    expect([STATUS_OPERATIONAL, STATUS_IMPAIRED, STATUS_SHELL]).toEqual([...INSTITUTION_STATUSES]);
  });

  it('is exactly the four causes §3c names', () => {
    expect(INSTITUTION_IMPAIRMENT_CAUSES)
      .toEqual(['supply_shortage', 'corruption_exposed', 'damage', 'siege_occupation']);
  });

  it('the tuning, the cure table and the label table are TOTAL over the cause vocabulary', () => {
    // A widening that half-lands (a fifth cause with no default severity, or no cure)
    // is the failure this catches: the cause would read live and impair by zero, or
    // lift with an empty cure sentence.
    for (const cause of INSTITUTION_IMPAIRMENT_CAUSES) {
      expect(INSTITUTION_STATUS_TUNING.defaultSeverity[cause], `no default severity for ${cause}`)
        .toBeGreaterThan(0);
      expect(INSTITUTION_CAUSE_CURES[cause], `no cure for ${cause}`).toBeTruthy();
      expect(INSTITUTION_CAUSE_LABELS[cause], `no label for ${cause}`).toBeTruthy();
    }
    expect(Object.keys(INSTITUTION_STATUS_TUNING.defaultSeverity).sort())
      .toEqual([...INSTITUTION_IMPAIRMENT_CAUSES].sort());
    expect(Object.keys(INSTITUTION_CAUSE_CURES).sort())
      .toEqual([...INSTITUTION_IMPAIRMENT_CAUSES].sort());
  });

  it('every default severity sits inside §3c\'s band [reduced .. temporarily zero]', () => {
    for (const cause of INSTITUTION_IMPAIRMENT_CAUSES) {
      const severity = defaultSeverityForCause(cause);
      expect(severity).toBeGreaterThanOrEqual(INSTITUTION_STATUS_TUNING.MIN_SEVERITY);
      expect(severity).toBeLessThanOrEqual(INSTITUTION_STATUS_TUNING.MAX_SEVERITY);
    }
  });

  it('an unknown cause is NON-impairing rather than silently mid-band', () => {
    // A typo must not invent a degradation. 0 is the honest answer.
    expect(defaultSeverityForCause('reagent_famine')).toBe(0);
    expectAbsentWithAnchor(
      INSTITUTION_IMPAIRMENT_CAUSES, 'reagent_famine', 'supply_shortage',
      'the cause vocabulary is closed; a fifth member is a design decision, not a guess',
    );
  });
});

describe('K1 the gate is virtual and defensive (law 8, DORMANCY)', () => {
  it('reads magicEconomyEnabled === true, defensively; absent is dormant', () => {
    expect(magicEconomyActive({ simulationRules: { magicEconomyEnabled: true } })).toBe(true);
    expect(magicEconomyActive({ simulationRules: { magicEconomyEnabled: 'true' } })).toBe(false);
    expect(magicEconomyActive({ simulationRules: { magicEconomyEnabled: 1 } })).toBe(false);
    expect(magicEconomyActive({ simulationRules: {} })).toBe(false);
    expect(magicEconomyActive({})).toBe(false);
    expect(magicEconomyActive(null)).toBe(false);
  });

  it('names the rule key the certification row and the preset declaration both use', () => {
    expect(MAGIC_ECONOMY_RULE).toBe('magicEconomyEnabled');
    expect(INSTITUTION_STATUS_LEDGER).toBe('institutionStatus');
  });
});

describe('K1 the capacity arithmetic', () => {
  it('COMPOUNDS the way the estate already compounds, proved against severityFor', () => {
    // THE ANTI-FORK PIN. severityFor aggregates an entity's own impairments[] by type;
    // combineSeverities aggregates K1 cause annotations in a sidecar. Neither can call
    // the other, so the shared law is proved by running BOTH on identical numbers.
    for (const numbers of [[0.5, 0.5], [0.3, 0.6, 0.7], [0.6], [], [1, 0.5]]) {
      const entity = numbers.reduce(
        (acc, severity, index) => withImpairment(acc, {
          type: 'capacity', severity, causeEventId: `cause:${index}`,
        }),
        /** @type {{ status?: string, impairments?: unknown[] }} */ ({}),
      );
      expect(combineSeverities(numbers), `combine disagreed with severityFor on ${JSON.stringify(numbers)}`)
        .toBe(severityFor(entity, 'capacity'));
    }
    // Anti-vacuity: the shared rule is the COMPOUNDING one, not a sum and not a max.
    expect(combineSeverities([0.5, 0.5])).toBe(0.75);
    expect(combineSeverities([0.5, 0.5])).not.toBe(1);
  });

  it('a single cause reduces capacity to exactly 1 minus its default severity', () => {
    const verdict = deriveInstitutionStatus({
      institution: working(), record: recordWith('supply_shortage'),
    });
    expect(verdict.capacity01).toBeCloseTo(1 - defaultSeverityForCause('supply_shortage'), 10);
  });

  it('capacity stays inside 0..1 under any stack of causes', () => {
    const record = { impairments: {} };
    for (const cause of INSTITUTION_IMPAIRMENT_CAUSES) {
      record.impairments[cause] = withDmSeverity(
        impairmentAnnotation({ cause, causeRef: `ref:${cause}`, sinceTick: 1 }), 1,
      );
    }
    const verdict = deriveInstitutionStatus({ institution: working(), record });
    expect(verdict.capacity01).toBeGreaterThanOrEqual(0);
    expect(verdict.capacity01).toBeLessThanOrEqual(1);
  });
});

describe('K1 the DM override seam (§3c, sovereignty over operations)', () => {
  it('is honoured across the FULL range, including a temporarily ZERO capacity', () => {
    const base = impairmentAnnotation({ cause: 'damage', causeRef: 'ref:damage', sinceTick: 2 });
    const engineDefault = effectiveSeverity(base);
    expect(engineDefault).toBe(defaultSeverityForCause('damage'));

    // The full range: a light touch, the engine's own number, and full suspension.
    for (const [override, expectedCapacity] of [[0.05, 0.95], [0.5, 0.5], [1, 0]]) {
      const verdict = deriveInstitutionStatus({
        institution: working(),
        record: { impairments: { damage: withDmSeverity(base, override) } },
      });
      expect(verdict.capacity01, `override ${override} was not honoured`).toBeCloseTo(expectedCapacity, 10);
      expect(verdict.causes[0].dmOverridden).toBe(true);
    }
  });

  it('a full suspension is a TEMPORARILY zero capacity, still impaired and NOT a shell', () => {
    // The distinction §3c draws: zero output by suspension is the fast layer at its
    // extreme; zero output by unfunding is the slow verdict. Collapsing them would make
    // the cure wrong.
    const verdict = deriveInstitutionStatus({
      institution: working(),
      record: {
        impairments: {
          damage: withDmSeverity(
            impairmentAnnotation({ cause: 'damage', causeRef: 'ref:damage', sinceTick: 2 }), 1,
          ),
        },
      },
    });
    expect(verdict.capacity01).toBe(0);
    expect(verdict.status).toBe(STATUS_IMPAIRED);
    expect(verdict.shell).toBe(false);
  });

  it('clamps BELOW the floor of "reduced": a zero-severity override cannot silently un-impair', () => {
    const base = impairmentAnnotation({ cause: 'damage', causeRef: 'ref:damage', sinceTick: 2 });
    expect(clampSeverity(0)).toBe(INSTITUTION_STATUS_TUNING.MIN_SEVERITY);
    expect(clampSeverity(-4)).toBe(INSTITUTION_STATUS_TUNING.MIN_SEVERITY);
    expect(clampSeverity(9)).toBe(INSTITUTION_STATUS_TUNING.MAX_SEVERITY);
    expect(clampSeverity(Number.NaN)).toBe(INSTITUTION_STATUS_TUNING.MIN_SEVERITY);
    // The cure for a cause is to resolve the cause, never to zero its severity behind
    // the world's back: an override of 0 still leaves a visibly impaired institution.
    const verdict = deriveInstitutionStatus({
      institution: working(),
      record: { impairments: { damage: withDmSeverity(base, 0) } },
    });
    expect(verdict.status).toBe(STATUS_IMPAIRED);
    expect(verdict.capacity01).toBeLessThan(1);
  });

  it('clearing an override DELETES the key, so it serializes as never-overridden', () => {
    const overridden = withDmSeverity(
      impairmentAnnotation({ cause: 'damage', causeRef: 'ref:damage', sinceTick: 2 }), 0.9,
    );
    const cleared = clearDmSeverity(overridden);
    expectPresentThenAbsent(
      Object.keys(overridden), Object.keys(cleared), 'dmSeverity', 'clearDmSeverity',
    );
    expect(effectiveSeverity(cleared)).toBe(defaultSeverityForCause('damage'));
    expect(JSON.stringify(cleared)).toBe(JSON.stringify(
      impairmentAnnotation({ cause: 'damage', causeRef: 'ref:damage', sinceTick: 2 }),
    ));
  });
});

describe('K1 the shell verdict reads the estate\'s existing mark, and only that one', () => {
  it('the ECONOMIC close is a shell', () => {
    expect(isShellInstitution(shelled())).toBe(true);
    expect(isRuinedInstitution(shelled())).toBe(false);
  });

  it('a CALAMITY RUIN is NOT a shell, though it carries the same economy-closed flag', () => {
    // The trap this pin exists for: calamityKernel's strike stamps
    // `_worldPulseEconomyClosed: true` ALONGSIDE `status: 'ruined'`, so a shell test
    // that read the flag alone would grade a flattened building as merely unfunded.
    const wreck = ruined();
    expect(wreck._worldPulseEconomyClosed).toBe(true);
    expect(isShellInstitution(wreck)).toBe(false);
    expect(isRuinedInstitution(wreck)).toBe(true);
  });

  it('a MORAL ABOLITION is NOT a shell: something IS wrong with it', () => {
    const abolished = { ...shelled(), _worldPulseEconomyClosed: false, _worldPulseMorallyAbolished: true };
    expect(isShellInstitution(abolished)).toBe(false);
  });

  it('a RUIN is graded null, because ruin is outside the three-word vocabulary', () => {
    expect(deriveInstitutionStatus({ institution: ruined(), record: recordWith('damage') })).toBe(null);
    expect(deriveInstitutionStatus({ institution: { status: 'destroyed' } })).toBe(null);
    expect(deriveInstitutionStatus({ institution: { status: 'removed' } })).toBe(null);
    // Anti-vacuity: the same call on a standing institution DOES return a verdict, so
    // the nulls above are the ruin rule and not a broken derivation.
    expect(deriveInstitutionStatus({ institution: working() }).status).toBe(STATUS_OPERATIONAL);
  });
});

describe('K1 the composition: an impaired shell is the frayed-dark (§3c)', () => {
  it('an unimpaired institution is operational and at full capacity', () => {
    const verdict = deriveInstitutionStatus({ institution: working(), record: null });
    expect(verdict).toMatchObject({ status: STATUS_OPERATIONAL, impaired: false, shell: false, capacity01: 1 });
    expect(verdict.causes).toEqual([]);
  });

  it('a live cause is the FAST layer: impaired, reduced, still open', () => {
    const verdict = deriveInstitutionStatus({ institution: working(), record: recordWith('siege_occupation') });
    expect(verdict).toMatchObject({ status: STATUS_IMPAIRED, impaired: true, shell: false });
    expect(verdict.capacity01).toBeLessThan(1);
    expect(verdict.capacity01).toBeGreaterThan(0);
  });

  it('an unimpaired shell is the SLOW verdict: closed, zero output, nothing wrong with it', () => {
    const verdict = deriveInstitutionStatus({ institution: shelled(), record: null });
    expect(verdict).toMatchObject({ status: STATUS_SHELL, impaired: false, shell: true, capacity01: 0 });
  });

  it('the two COMPOSE: an impaired shell keeps both flags and reports its causes', () => {
    const verdict = deriveInstitutionStatus({ institution: shelled(), record: recordWith('corruption_exposed') });
    // The headline word is 'shell' because a closed institution produces nothing
    // whatever its remaining rot; the composition survives in the flag and the causes,
    // which is what lets cartography render the frayed-dark rather than one or other.
    expect(verdict.status).toBe(STATUS_SHELL);
    expect(verdict.impaired).toBe(true);
    expect(verdict.shell).toBe(true);
    expect(verdict.capacity01).toBe(0);
    expect(verdict.causes.map((c) => c.cause)).toEqual(['corruption_exposed']);
  });

  it('SHELL and a zero-capacity IMPAIRMENT are DISTINCT states with DISTINCT cures', () => {
    // Both report capacity 0, which is exactly why a collapsed vocabulary would be
    // invisible to a test that read capacity alone. The pin asserts the words, the
    // flags and the cures all diverge.
    const suspended = deriveInstitutionStatus({
      institution: working(),
      record: {
        impairments: {
          siege_occupation: withDmSeverity(
            impairmentAnnotation({ cause: 'siege_occupation', causeRef: 'occupation:s1', sinceTick: 3 }), 1,
          ),
        },
      },
    });
    const shell = deriveInstitutionStatus({ institution: shelled(), record: null });

    expect(suspended.capacity01).toBe(shell.capacity01);   // the anti-vacuity anchor
    expect(suspended.status).not.toBe(shell.status);
    expect(suspended.shell).toBe(false);
    expect(shell.impaired).toBe(false);
    // The cures follow the causes, and a shell has none to follow: its cure is funding.
    expect(suspended.causes[0].cure).toBe(INSTITUTION_CAUSE_CURES.siege_occupation);
    expect(shell.causes).toEqual([]);
  });
});

describe('K1 the ledger: drop-when-empty and a JSON round trip', () => {
  const world = () => ({ simulationRules: { magicEconomyEnabled: true } });

  it('writes, reads back, and survives a JSON round trip unchanged', () => {
    const ledger = { s1: { the_grain_hall: recordWith('damage') } };
    const written = writeInstitutionStatusLedger(world(), ledger);
    expect(readInstitutionStatusLedger(written)).toEqual(ledger);
    const revived = JSON.parse(JSON.stringify(written));
    expect(readInstitutionStatusLedger(revived)).toEqual(ledger);
    expect(readInstitutionStatusRecord(revived, 's1', 'the_grain_hall').impairments.damage.cause)
      .toBe('damage');
    expect(readInstitutionStatusRecord(revived, 's1', 'no_such_hall')).toBe(null);
  });

  it('DROPS the key outright when the last record clears (the byte-identity half)', () => {
    const populated = writeInstitutionStatusLedger(world(), { s1: { the_grain_hall: recordWith('damage') } });
    const drained = writeInstitutionStatusLedger(populated, {});
    expectPresentThenAbsent(
      Object.keys(populated.spatialLedgers || {}),
      Object.keys(drained.spatialLedgers || {}),
      INSTITUTION_STATUS_LEDGER,
      'writeInstitutionStatusLedger drop-when-empty',
    );
    // A lit-then-cleared world must be indistinguishable from one that never had a
    // ledger at all, or the dormancy golden can be broken by a run that healed.
    expect(JSON.stringify(drained)).toBe(JSON.stringify(writeInstitutionStatusLedger(world(), null)));
  });

  it('drops EMPTY records rather than persisting empty containers', () => {
    const written = writeInstitutionStatusLedger(world(), {
      s1: { hollow: { impairments: {} }, real: recordWith('damage') },
    });
    const kept = readInstitutionStatusLedger(written);
    expectAbsentWithAnchor(
      Object.keys(kept.s1), 'hollow', 'real', 'an empty record is dropped, not persisted',
    );
  });

  it('serializes in codepoint order, so a re-ordered save rebuilds byte-identically', () => {
    const forward = writeInstitutionStatusLedger(world(), { b: { z: recordWith('damage') }, a: { y: recordWith('damage') } });
    const reversed = writeInstitutionStatusLedger(world(), { a: { y: recordWith('damage') }, b: { z: recordWith('damage') } });
    expect(JSON.stringify(forward)).toBe(JSON.stringify(reversed));
  });

  it('the institution ref reuses the estate\'s canonical slug', () => {
    expect(institutionStatusRef({ name: 'The Grain Hall' })).toBe('the_grain_hall');
    expect(institutionStatusRef({ id: 'institution.mill', name: 'Other' })).toBe('institution_mill');
    expect(institutionStatusRef(null)).toBe('unknown');
  });
});

describe('K1 the no-orphan audit is total and non-vacuous', () => {
  const live = (causes) => ({ s1: { the_grain_hall: new Set(causes) } });

  it('passes when every stored cause reads live', () => {
    const audit = auditInstitutionStatusLedger(
      { s1: { the_grain_hall: recordWith('damage') } }, live(['damage']),
    );
    expect(audit).toEqual({ ok: true, orphans: [] });
  });

  it('reports an orphan when the bound cause stopped reading live', () => {
    const audit = auditInstitutionStatusLedger(
      { s1: { the_grain_hall: recordWith('damage') } }, live(['supply_shortage']),
    );
    expect(audit.ok).toBe(false);
    expect(audit.orphans).toEqual([
      { cid: 's1', ref: 'the_grain_hall', cause: 'damage', reason: 'the bound cause no longer reads live' },
    ]);
  });

  it('reports a cause outside the closed vocabulary', () => {
    const audit = auditInstitutionStatusLedger(
      { s1: { the_grain_hall: recordWith('reagent_famine') } }, live(['reagent_famine']),
    );
    expect(audit.ok).toBe(false);
    expect(audit.orphans[0].reason).toBe('cause is outside the closed vocabulary');
  });

  it('reports an annotation that names no live cause instance', () => {
    const audit = auditInstitutionStatusLedger(
      { s1: { the_grain_hall: { impairments: { damage: { cause: 'damage', causeRef: '', sinceTick: 1 } } } } },
      live(['damage']),
    );
    expect(audit.ok).toBe(false);
    expect(audit.orphans[0].reason).toBe('annotation names no live cause instance');
  });

  it('a settlement or institution the world no longer knows is an ORPHAN, not an excuse', () => {
    const audit = auditInstitutionStatusLedger({ s9: { ghost_hall: recordWith('damage') } }, live(['damage']));
    expect(audit.ok).toBe(false);
    expect(audit.orphans[0]).toMatchObject({ cid: 's9', ref: 'ghost_hall' });
  });

  it('an empty ledger is trivially clean, and that is not what the pins above measured', () => {
    expect(auditInstitutionStatusLedger(null, {})).toEqual({ ok: true, orphans: [] });
    expect(auditInstitutionStatusLedger({}, {})).toEqual({ ok: true, orphans: [] });
  });
});

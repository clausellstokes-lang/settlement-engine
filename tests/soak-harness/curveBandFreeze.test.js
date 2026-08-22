/**
 * curveBandFreeze.test.js — SK-5's proof surface (sk-b; ODQ §143.3, §72.3/§110.3).
 *
 * Two laws, and the second is the one with teeth.
 *
 *   FREEZE ELIGIBILITY — a band freezes only from the first clean run of the FULL
 *   instrument at build-complete-dark. Every other shape THROWS, because a half-written
 *   capsule is worse than none: a later reader cannot tell it from a baseline.
 *
 *   THE DECLARED-SHIFT RE-RECORD — proven three ways or refused. The key-by-key diff is
 *   the arm that stops a bad fix hiding wide damage behind ONE declared shift, and it is
 *   never satisfied by the capture's own exit 0.
 */

import { describe, expect, it } from 'vitest';

import {
  BAND_WIDTH_K,
  FREEZE_PRECONDITIONS,
  freeze,
  freezeBlockers,
  provisionalCurves,
  registryBandFamilies,
  verifyDeclaredShift,
} from '../../scripts/soak/curveBands.mjs';
import { bandFamilies } from '../../scripts/telemetry/simMetricAggregate.mjs';
import { SIM_METRICS } from '../../scripts/telemetry/simMetricRegistry.mjs';

const cleanReceipt = (over = {}) => ({
  sourceSha: 'abc123',
  profile: 'century-300',
  fullInstrument: true,
  deterministicFirings: 0,
  behavioralPropertiesPassing: true,
  provisional: false,
  rolling: false,
  restored: false,
  ...over,
});

const seriesFor = (families) => Object.fromEntries(families.map((family, index) => [
  family, [10 + index, 12 + index, 11 + index, 13 + index, 9 + index],
]));

describe('curve band freezing', () => {
  it('the band set is ENUMERATED FROM tm-3\'s registry, one family per year-epoch row', () => {
    const families = registryBandFamilies();
    // The harness reads the registry, not a copy of it.
    expect(families).toEqual(bandFamilies());
    const yearRows = SIM_METRICS.filter((row) => row.epoch === 'year').map((row) => row.name);
    expect(families).toEqual(yearRows);
    expect(families.length).toBeGreaterThan(0);
    // ⭐ The §151.3 experience family is among them, so the band set reaches
    // experience-facing aggregates and not only engine ones.
    expect(families).toContain('sim_narration_tempo');
    // ⭐ WEB-4 (ODQ §359.9 / §180.3a): and the band set watches whether that news is
    // ADDRESSED, not only how much of it there is. A row added to the registry becomes
    // a watched curve automatically — this assertion is what proves the automatic path
    // actually ran for this row rather than being described.
    expect(families).toContain('sim_address_chain');
    // A run-epoch row must NOT become a band family: a run scalar has no curve.
    const runRows = SIM_METRICS.filter((row) => row.epoch === 'run').map((row) => row.name);
    expect(families.filter((family) => runRows.includes(family))).toEqual([]);
  });

  it('a PROVISIONAL, rolling or restored receipt cannot freeze — it THROWS', () => {
    const families = registryBandFamilies();
    const series = seriesFor(families);
    expect(FREEZE_PRECONDITIONS.length).toBe(4);
    expect(freezeBlockers(cleanReceipt())).toEqual([]);

    // ⛔ THE ONE THE CHARTER NAMES: a rolling soak on a mid-build tip may NEVER freeze.
    expect(() => freeze({ families, series, receipt: cleanReceipt({ provisional: true }) }))
      .toThrow(/PROVISIONAL/);
    expect(() => freeze({ families, series, receipt: cleanReceipt({ rolling: true }) })).toThrow(/rolling/);
    expect(() => freeze({ families, series, receipt: cleanReceipt({ restored: true }) })).toThrow(/restored/);
    expect(() => freeze({ families, series, receipt: cleanReceipt({ fullInstrument: false }) }))
      .toThrow(/FULL instrument/);
    expect(() => freeze({ families, series, receipt: cleanReceipt({ deterministicFirings: 1 }) }))
      .toThrow(/not clean/);
    expect(() => freeze({ families, series, receipt: cleanReceipt({ behavioralPropertiesPassing: false }) }))
      .toThrow(/behavioral-contract property/);
    // ⛔ A RED RATCHET MAKES THE CAPSULE UNWRITABLE BY DESIGN — clear the reds, never
    // invent the figure.
    expect(() => freeze({ families, series, receipt: cleanReceipt({ ratchetsRed: true }) }))
      .toThrow(/UNWRITABLE BY DESIGN/);
    // A registry row with no observed series is a curve nobody would be watching.
    expect(() => freeze({ families, series: {}, receipt: cleanReceipt() }))
      .toThrow(/no observed series/);
  });

  it('a clean full instrument freezes, and the width is a marked-UNSOAKED band', () => {
    const families = registryBandFamilies();
    const capsule = freeze({ families, series: seriesFor(families), receipt: cleanReceipt() });
    expect(capsule.kind).toBe('soak_curve_band_capsule');
    expect(capsule.families).toEqual(families);
    expect(Object.keys(capsule.bands).sort()).toEqual([...families].sort());
    expect(capsule.frozenFrom).toEqual({ sourceSha: 'abc123', profile: 'century-300' });
    // ⚠ k IS UNSOAKED (§43) — no observed distribution exists yet, and the capsule says so
    // on its face so the figure cannot later be quoted as fitted.
    expect(BAND_WIDTH_K).toEqual({ min: 2, max: 3, default: 2.5, unsoaked: true });
    expect(capsule.kUnsoaked).toBe(true);
    expect(capsule.k).toBe(2.5);
    const first = capsule.bands[families[0]];
    expect(first.observations).toBe(5);
    expect(first.low).toBeLessThan(first.mean);
    expect(first.high).toBeGreaterThan(first.mean);
    // A PROVISIONAL report is emitted instead, and it says what it is.
    const provisional = provisionalCurves({ families, series: seriesFor(families), receipt: cleanReceipt() });
    expect(provisional.provisional).toBe(true);
    expect(provisional.provisionalReason).toContain('nothing freezes');
    expect(provisional.kind).toBe('soak_curve_report');
  });

  it('⛔ the re-record is proven THREE WAYS, and the key-by-key diff is the arm with teeth', () => {
    const before = { bands: { a: { mean: 1 }, b: { mean: 2 }, c: { mean: 3 } } };
    const oneMoved = { bands: { a: { mean: 9 }, b: { mean: 2 }, c: { mean: 3 } } };

    // The healthy case: one declared shift, nothing else moved, chair CAS present.
    const ok = verifyDeclaredShift({ before, after: oneMoved, declared: ['a'], chairCas: true });
    expect(ok.accepted).toBe(true);
    expect(ok.moved).toEqual(['a']);
    expect(ok.undeclared).toEqual([]);

    // ⛔ THE ARM THAT MATTERS: a fix declares ONE curve and quietly moves another. Only a
    // diff over EVERY key can see it, and the capture's own exit 0 never would.
    const twoMoved = { bands: { a: { mean: 9 }, b: { mean: 7 }, c: { mean: 3 } } };
    const hidden = verifyDeclaredShift({ before, after: twoMoved, declared: ['a'], chairCas: true });
    expect(hidden.accepted).toBe(false);
    expect(hidden.undeclared).toEqual(['b']);
    expect(hidden.refusals.join(' ')).toContain('UNDECLARED');

    // ZERO keys added, ZERO removed — a re-record that changed the key set is not a
    // re-record of the same instrument.
    const addedKey = { bands: { ...oneMoved.bands, d: { mean: 4 } } };
    expect(verifyDeclaredShift({ before, after: addedKey, declared: ['a'], chairCas: true }).added).toEqual(['d']);
    const removedKey = { bands: { a: { mean: 9 }, b: { mean: 2 } } };
    expect(verifyDeclaredShift({ before, after: removedKey, declared: ['a'], chairCas: true }).removed).toEqual(['c']);

    // The table IS the declaration: no table, no re-record.
    expect(verifyDeclaredShift({ before, after: oneMoved, declared: [], chairCas: true }).refusals.join(' '))
      .toContain('no declared-shift table');
    // A declaration nothing happened to is a declaration nobody checked.
    expect(verifyDeclaredShift({ before, after: oneMoved, declared: ['a', 'c'], chairCas: true }).refusals.join(' '))
      .toContain('did not move');
    // And the chair's CAS is the third proof, not an optional courtesy.
    expect(verifyDeclaredShift({ before, after: oneMoved, declared: ['a'], chairCas: false }).accepted).toBe(false);
  });
});

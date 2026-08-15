/**
 * tests/domain/events/dialClamps.test.js — DIAL DUAL-ENFORCEMENT (Composer V2
 * §3/§9): bounds are minted, then enforced twice.
 *
 * Enforcement 1 (buildEvent/UI) is pinned structurally by the coverage
 * walker's band/enum checks — the dial cannot express out-of-band. THIS suite
 * pins enforcement 2 (clampAtCommit): the handler reads retire the old silent
 * forgiveness — an out-of-band numeric severity clamps into [0,1] identically
 * in PREVIEW and APPLY (preview ≡ apply extends to dials), and equals the
 * at-bound in-band value; garbage (NaN) falls to the verb's default instead of
 * poisoning the deltas.
 */

import { describe, it, expect } from 'vitest';
import { runEventPipeline } from '../../../src/domain/events/eventPipeline.js';
import { EVENT_REGISTRY } from '../../../src/domain/events/registry.js';
import { STRESSOR_SEVERITY_VALUES, AFFORDANCE_MANIFEST, authorableVerbs } from '../../../src/domain/events/affordanceManifest.js';

const settlement = () => ({
  name: 'Clampton',
  population: 900,
  tier: 'village',
  institutions: [{ id: 'i1', name: 'Granary' }, { id: 'i2', name: "Thieves' Guild", category: 'criminal' }],
  powerStructure: { factions: [{ id: 'f1', name: 'Council', faction: 'Council' }] },
  npcs: [{ id: 'n1', name: 'Mira' }],
  config: { nearbyResources: ['timber'] },
});

const impair = (sev) => ({
  id: `ev_sev_${String(sev)}`, type: 'IMPAIR_INSTITUTION', targetId: 'Granary',
  payload: { severity: sev, dimension: 'capacity' },
});

// Severity-free comparison surface: deltas + narration + the impairment the
// handler wrote (its severity is the committed number).
function committedSeverity(result) {
  const granary = result.nextSettlement.institutions.find((i) => i.name === 'Granary');
  return (granary.impairments || [])[0]?.severity;
}

describe('clampAtCommit — the handler-read clamp (enforcement 2 of 2)', () => {
  it('an out-of-band severity (5) commits exactly like severity 1 — in preview AND apply shape', () => {
    const s = settlement();
    const wild = runEventPipeline(s, impair(5));
    const bound = runEventPipeline(s, impair(1));
    expect(wild.warnings.filter(w => w.severity === 'veto')).toEqual([]);
    expect(committedSeverity(wild)).toBe(1);
    expect(committedSeverity(bound)).toBe(1);
    expect(wild.systemStateDeltas).toEqual(bound.systemStateDeltas);
    expect(wild.afterSystemState).toEqual(bound.afterSystemState);
  });

  it('a negative severity clamps to 0 (no inverse-healing exploit)', () => {
    const s = settlement();
    const negative = runEventPipeline(s, impair(-3));
    const zero = runEventPipeline(s, impair(0));
    expect(committedSeverity(negative)).toBe(0);
    expect(negative.systemStateDeltas).toEqual(zero.systemStateDeltas);
  });

  it('garbage severity falls to the verb default instead of NaN-poisoning deltas', () => {
    const s = settlement();
    const garbage = runEventPipeline(s, impair('sevenish'));
    const dflt = runEventPipeline(s, impair(undefined));
    expect(committedSeverity(garbage)).toBe(0.5); // IMPAIR default
    expect(garbage.systemStateDeltas).toEqual(dflt.systemStateDeltas);
    for (const d of garbage.systemStateDeltas) expect(Number.isFinite(d.change)).toBe(true);
  });

  it('registry stateDeltas clamp too: DAMAGE_INSTITUTION at severity 9 scales like 1', () => {
    const spec = EVENT_REGISTRY.DAMAGE_INSTITUTION;
    const wild = spec.stateDeltas({ targetId: 'Granary', payload: { severity: 9 } });
    const bound = spec.stateDeltas({ targetId: 'Granary', payload: { severity: 1 } });
    expect(wild).toEqual(bound);
  });

  it('in-band values are byte-identical to the pre-clamp read (no behavior shift)', () => {
    const s = settlement();
    const r = runEventPipeline(s, impair(0.7));
    expect(committedSeverity(r)).toBe(0.7);
  });

  it('every band dial in the manifest maps its words inside the handler clamp range', () => {
    for (const v of authorableVerbs()) {
      for (const d of v.dials.filter(d => d.kind === 'band')) {
        for (const [word, n] of Object.entries(d.bandWords)) {
          expect(n, `${v.type}.${d.key}.${word}`).toBeGreaterThanOrEqual(0);
          expect(n, `${v.type}.${d.key}.${word}`).toBeLessThanOrEqual(1);
        }
      }
    }
    // The canonical word-band map itself.
    expect(STRESSOR_SEVERITY_VALUES.minor).toBeLessThan(STRESSOR_SEVERITY_VALUES.moderate);
    expect(STRESSOR_SEVERITY_VALUES.moderate).toBeLessThan(STRESSOR_SEVERITY_VALUES.severe);
  });

  it('APPLY_STRESSOR: an out-of-band severity commits the clamped crisis (entry + deltas)', () => {
    const s = settlement();
    const mk = (sev) => ({
      id: `ev_st_${String(sev)}`, type: 'APPLY_STRESSOR', targetId: 'famine',
      payload: { stressorType: 'famine', label: 'Famine', severity: sev },
    });
    const wild = runEventPipeline(s, mk(7));
    const bound = runEventPipeline(s, mk(1));
    expect(wild.systemStateDeltas).toEqual(bound.systemStateDeltas);
    const entryOf = (r) => (r.nextSettlement.stress || r.nextSettlement.stressors || []).find?.(
      (st) => String(st?.type || '').toLowerCase() === 'famine');
    expect(entryOf(wild)?.severity).toBe(1);
  });

  it('enum dial options match what buildEvent/the handlers accept (spot pins)', () => {
    expect(AFFORDANCE_MANIFEST.CHANGE_RULING_POWER.dials[0].options)
      .toEqual(['coup', 'election', 'succession', 'conquest', 'appointment']);
    expect(AFFORDANCE_MANIFEST.IMPOSE_CORRUPTION.dials[0].options)
      .toEqual(['individual', 'individual_institution']);
    expect(AFFORDANCE_MANIFEST.SHIFT_TIER.dials[0].options)
      .toEqual(['promotion', 'demotion']);
    expect(AFFORDANCE_MANIFEST.ADD_TRADE_GOOD.dials[0].options)
      .toEqual(['export', 'import']);
  });
});

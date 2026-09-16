/**
 * tableLedger.test.js — R-1 THE SESSION LEDGER: the finite-semantics SCHEMA WALL.
 *
 * These pins enforce the owner's binding law: every table effect is a TYPED
 * record from a CLOSED vocabulary with a BOUNDED magnitude, and free text is
 * FLAVOR ONLY — it can never reach a mechanical field. The clerk is a bucketing
 * clerk, never a writer: its output must pass this same wall.
 */
import { describe, test, expect } from 'vitest';
import {
  TABLE_EVENT_KINDS, MAGNITUDE_BANDS, MAGNITUDE_BAND_IDS, OBLIGATION_TYPES,
  TABLE_EVENT_SOURCE, KIND_SPEC, IMPAIR_DIMENSION,
  validateTableEvent, buildTableEffect, reviewClerkProposals, exposureTargets,
  institutionTargets, impairedInstitutionTargets,
  depletableResourceTargets, depletedResourceTargets,
} from '../../src/domain/tableLedger.js';

/** A valid target ref for each kind, so a totality loop can build every kind. */
const REF_FOR_KIND = {
  incident: '',
  'stressor-relief': 'famine',
  obligation: 'debt',
  exposure: 'npc.aldis',
  'structure-harm': 'inst.granary',
  'structure-restored': 'inst.granary',
  'supply-loss': 'timber',
  'supply-restored': 'timber',
};

describe('the closed vocabulary + bounded bands', () => {
  test('kinds and bands are frozen closed sets', () => {
    expect(Object.isFrozen(TABLE_EVENT_KINDS)).toBe(true);
    expect(Object.isFrozen(MAGNITUDE_BANDS)).toBe(true);
    expect([...TABLE_EVENT_KINDS].sort()).toEqual([
      'exposure', 'incident', 'obligation', 'stressor-relief',
      'structure-harm', 'structure-restored', 'supply-loss', 'supply-restored',
    ]);
    expect(MAGNITUDE_BAND_IDS).toEqual(['minor', 'moderate', 'major']);
    // Every band resolves to a clamped 0..1 severity.
    for (const id of MAGNITUDE_BAND_IDS) {
      expect(MAGNITUDE_BANDS[id]).toBeGreaterThan(0);
      expect(MAGNITUDE_BANDS[id]).toBeLessThanOrEqual(1);
    }
  });

  test('every kind has a spec, and the spec table is total over the vocabulary', () => {
    expect(Object.keys(KIND_SPEC).sort()).toEqual([...TABLE_EVENT_KINDS].sort());
    for (const kind of TABLE_EVENT_KINDS) {
      const spec = KIND_SPEC[kind];
      // A dial is offered only where a target is named; 'none' is the flavor kind.
      expect(spec.needsMagnitude && !spec.needsTarget).toBe(false);
      expect(['none', 'stressor', 'severity', 'impair', 'bare']).toContain(spec.payloadShape);
      // The shape IS the discriminator the admission wall mirrors: no target
      // means no event, and a 'bare' shape means a target with no dial.
      expect(spec.needsTarget).toBe(spec.payloadShape !== 'none');
      expect(spec.needsMagnitude).toBe(
        spec.payloadShape !== 'none' && spec.payloadShape !== 'bare',
      );
    }
  });

  test('the four economy verbs ride EXISTING engine event types', () => {
    expect(KIND_SPEC['structure-harm'].eventType).toBe('IMPAIR_INSTITUTION');
    expect(KIND_SPEC['structure-restored'].eventType).toBe('RESTORE_INSTITUTION');
    expect(KIND_SPEC['supply-loss'].eventType).toBe('DEPLETE_RESOURCE');
    expect(KIND_SPEC['supply-restored'].eventType).toBe('RECOVERED_RESOURCE');
    // structure-harm rides IMPAIR, never the composer-retired DAMAGE verb.
    for (const kind of TABLE_EVENT_KINDS) {
      expect(KIND_SPEC[kind].eventType).not.toBe('DAMAGE_INSTITUTION');
    }
  });

  test('the three dial-free kinds record a null band even when one is offered', () => {
    // validateTableEvent must not quietly accept a dial the kind does not have.
    for (const kind of ['structure-restored', 'supply-loss', 'supply-restored']) {
      const r = validateTableEvent({
        kind, magnitude: 'major', targets: { ref: REF_FOR_KIND[kind] }, flavor: 'x',
      });
      expect(r.ok).toBe(true);
      expect(r.record.band).toBeNull();
      expect(r.record.severity).toBeNull();
    }
  });

  test('structure-harm DOES require a band (its severity is real physics)', () => {
    const missing = validateTableEvent({
      kind: 'structure-harm', targets: { ref: 'inst.granary' }, flavor: 'x',
    });
    expect(missing.ok).toBe(false);
    const ok = validateTableEvent({
      kind: 'structure-harm', magnitude: 'major', targets: { ref: 'inst.granary' }, flavor: 'x',
    });
    expect(ok.ok).toBe(true);
    // The food-anchor break threshold is severity >= 0.6 with a capacity
    // dimension: 'major' crosses it, 'moderate' does not. Declared, not implied.
    expect(ok.record.severity).toBe(0.8);
    expect(MAGNITUDE_BANDS.major).toBeGreaterThanOrEqual(0.6);
    expect(MAGNITUDE_BANDS.moderate).toBeLessThan(0.6);
  });

  test('every economy verb still requires a named target', () => {
    for (const kind of ['structure-harm', 'structure-restored', 'supply-loss', 'supply-restored']) {
      const r = validateTableEvent({ kind, magnitude: 'moderate', targets: {}, flavor: 'x' });
      expect(r.ok).toBe(false);
    }
  });

  test('rejects an off-vocabulary kind (the wall)', () => {
    const r = validateTableEvent({ kind: 'nuke-the-realm', magnitude: 'major', targets: { ref: 'x' } });
    expect(r.ok).toBe(false);
    expect(r.record).toBeNull();
    expect(r.errors.join(' ')).toMatch(/kind must be one of/);
  });

  test('magnitude must be a NAMED band, never a raw number', () => {
    // A raw number is refused — magnitude is finite by construction.
    expect(validateTableEvent({ kind: 'obligation', magnitude: 0.97, targets: { ref: 'debt' } }).ok).toBe(false);
    expect(validateTableEvent({ kind: 'obligation', magnitude: 'catastrophic', targets: { ref: 'debt' } }).ok).toBe(false);
    const ok = validateTableEvent({ kind: 'obligation', magnitude: 'major', targets: { ref: 'debt' } });
    expect(ok.ok).toBe(true);
    expect(ok.record.severity).toBe(MAGNITUDE_BANDS.major);
  });

  test('mechanical kinds require a target; obligation target is a closed vocab', () => {
    expect(validateTableEvent({ kind: 'stressor-relief', magnitude: 'minor', targets: {} }).ok).toBe(false);
    expect(validateTableEvent({ kind: 'obligation', magnitude: 'minor', targets: { ref: 'made-up-burden' } }).ok).toBe(false);
    for (const t of OBLIGATION_TYPES) {
      expect(validateTableEvent({ kind: 'obligation', magnitude: 'minor', targets: { ref: t } }).ok).toBe(true);
    }
  });

  test('incident needs no target or magnitude (pure flavor)', () => {
    const r = validateTableEvent({ kind: 'incident', flavor: 'The party feasted in the longhall.' });
    expect(r.ok).toBe(true);
    expect(r.record.severity).toBeNull();
    expect(r.record.flavor).toBe('The party feasted in the longhall.');
  });
});

describe('FREE TEXT IS FLAVOR ONLY — the source-scan on the built directive', () => {
  // A flavor string planted with words that also name mechanical concepts. The
  // built directive's MECHANICAL surface must not contain it anywhere.
  const FLAVOR = 'the party BURNED the granary, INSULTED the baron, and SEVERITY be damned';

  test('a mechanical kind keeps flavor OFF every mechanical field', () => {
    const { record } = validateTableEvent({
      kind: 'obligation', magnitude: 'major', targets: { ref: 'debt', label: 'debt' }, flavor: FLAVOR,
    });
    const built = buildTableEffect(record);
    expect(built.dispatch).toBe('applyEvent');
    // The verbatim flavor rides tableFlavor, and NOWHERE else.
    expect(built.event.tableFlavor).toBe(FLAVOR);
    expect(built.event.source).toBe(TABLE_EVENT_SOURCE);
    // Mechanical surface: targetId + payload. Serialize and assert the flavor is absent.
    const mechanical = JSON.stringify({ type: built.event.type, targetId: built.event.targetId, payload: built.event.payload });
    expect(mechanical).not.toContain('BURNED');
    expect(mechanical).not.toContain('INSULTED');
    expect(mechanical).not.toContain(FLAVOR);
    // The payload's numeric severity is a banded value, not derived from text.
    expect(built.event.payload.severity).toBe(MAGNITUDE_BANDS.major);
  });

  test('an incident stores the DM words as a flavor line, still tagged source:table', () => {
    const { record } = validateTableEvent({ kind: 'incident', flavor: FLAVOR });
    const built = buildTableEffect(record);
    expect(built.dispatch).toBe('flavor');
    expect(built.entry.source).toBe(TABLE_EVENT_SOURCE);
    expect(built.entry.narrativeSummary).toBe(FLAVOR);
    // A flavor line has NO mechanical payload at all.
    expect(built.entry.payload).toBeUndefined();
  });

  test('every built directive carries source:table, and none leaks flavor', () => {
    for (const kind of TABLE_EVENT_KINDS) {
      const spec = KIND_SPEC[kind];
      const input = {
        kind, flavor: FLAVOR,
        ...(spec.needsMagnitude ? { magnitude: 'minor' } : {}),
        ...(spec.needsTarget ? { targets: { ref: REF_FOR_KIND[kind] } } : {}),
      };
      const { ok, record } = validateTableEvent(input);
      expect(ok, `${kind} failed validation`).toBe(true);
      const built = buildTableEffect(record);
      const stamped = built.dispatch === 'flavor' ? built.entry.source : built.event.source;
      expect(stamped).toBe(TABLE_EVENT_SOURCE);
      if (built.dispatch === 'flavor') continue;
      // The mechanical surface of EVERY kind is free of the DM's words.
      const mechanical = JSON.stringify({
        type: built.event.type, targetId: built.event.targetId, payload: built.event.payload,
      });
      expect(mechanical, kind).not.toContain('BURNED');
      expect(mechanical, kind).not.toContain('INSULTED');
      expect(mechanical, kind).not.toContain(FLAVOR);
      expect(built.event.tableFlavor).toBe(FLAVOR);
    }
  });

  test('structure-harm builds a banded impairment on a FIXED capacity dimension', () => {
    const { record } = validateTableEvent({
      kind: 'structure-harm', magnitude: 'major',
      targets: { ref: 'inst.granary', label: 'The Granary' }, flavor: FLAVOR,
    });
    const built = buildTableEffect(record);
    expect(built.event.type).toBe('IMPAIR_INSTITUTION');
    expect(built.event.targetId).toBe('inst.granary');
    // Exactly the two mechanical keys — no stressorType, no smuggled label.
    expect(built.event.payload).toEqual({ severity: MAGNITUDE_BANDS.major, dimension: 'capacity' });
    expect(IMPAIR_DIMENSION).toBe('capacity');
  });

  test('the three dial-free kinds build an EXACTLY empty payload', () => {
    for (const kind of ['structure-restored', 'supply-loss', 'supply-restored']) {
      const { record } = validateTableEvent({
        kind, targets: { ref: REF_FOR_KIND[kind], label: 'A thing' }, flavor: FLAVOR,
      });
      const built = buildTableEffect(record);
      // {} exactly: the engine's own default stands, and no dial was invented.
      expect(built.event.payload, kind).toEqual({});
      expect(Object.keys(built.event.payload), kind).toHaveLength(0);
      expect(built.event.targetId, kind).toBe(REF_FOR_KIND[kind]);
    }
  });
});

describe('the clerk is a bucketing clerk, never a writer', () => {
  test('reviewClerkProposals routes hallucinated buckets to rejected, valid ones to accepted', () => {
    const raw = [
      { kind: 'obligation', magnitude: 'moderate', targets: { ref: 'debt' }, flavor: 'a loan came due' },   // valid
      { kind: 'mind-control', magnitude: 'major', targets: { ref: 'everyone' } },                            // off-vocab
      { kind: 'stressor-relief', magnitude: 9000, targets: { ref: 'famine' } },                              // raw number
      { kind: 'exposure', magnitude: 'minor', targets: { ref: 'npc.aldis' }, flavor: 'unmasked' },           // valid
    ];
    const { accepted, rejected } = reviewClerkProposals(raw);
    expect(accepted.map(a => a.index)).toEqual([0, 3]);
    expect(rejected.map(r => r.index)).toEqual([1, 2]);
    // Accepted proposals become VALIDATED, typed records — never the raw text.
    for (const a of accepted) {
      expect(TABLE_EVENT_KINDS).toContain(a.record.kind);
    }
  });

  test('a non-array clerk output is safely empty', () => {
    expect(reviewClerkProposals(null)).toEqual({ accepted: [], rejected: [] });
  });
});

describe('the exposure roster mirrors the affordance manifest (SB2 parity pin)', () => {
  // exposureTargets is a MIRROR of affordanceManifest.compromisedTargets (the
  // manifest is a lazy leaf the Session Ledger chunk must not import — the
  // recorded chunk-rebalance hazard). This pin is what makes the mirror safe:
  // the two rosters can never drift without a red here.
  const fx = {
    npcs: [
      { id: 'npc.aldis', name: 'Aldis', corrupt: true },
      { name: 'Berta', corrupt: true },           // no id — keys by name (findNpc resolves both)
      { id: 'npc.cato', name: 'Cato' },           // clean — never offered
    ],
    institutions: [
      { id: 'inst.guild', name: 'The Guild', impairments: [{ type: 'corruption' }] },
      { id: 'inst.watch', name: 'The Watch', impairments: [{ type: 'legitimacy' }] }, // not corruption
    ],
    powerStructure: { factions: [
      { id: 'fac.cabal', faction: 'The Cabal', impairments: [{ type: 'corruption' }] },
      { faction: 'The Clean Hands' },
    ] },
  };

  test('exposureTargets returns exactly the manifest EXPOSE_CORRUPTION targetOptions', async () => {
    const { AFFORDANCE_MANIFEST } = await import('../../src/domain/events/affordanceManifest.js');
    const manifest = AFFORDANCE_MANIFEST.EXPOSE_CORRUPTION.targetOptions(fx);
    const mirror = exposureTargets(fx).map((t) => ({ id: t.ref, name: t.label }));
    expect(mirror).toEqual(manifest);
    // And the roster itself is the compromised set, id-or-name keyed.
    expect(mirror.map((m) => m.id)).toEqual(['npc.aldis', 'Berta', 'inst.guild', 'fac.cabal']);
  });

  test('a settlement with nothing compromised yields an empty roster (the picker offers nothing)', () => {
    expect(exposureTargets({ npcs: [{ id: 'n1', name: 'Clean' }] })).toEqual([]);
    expect(exposureTargets(null)).toEqual([]);
  });
});

describe('the economy verbs offer exactly what their handlers can act on', () => {
  // One fixture exercising every discrimination the four rosters make: a clean
  // institution vs a wounded one, and a live resource vs BOTH depletion formats
  // (the nearbyResourcesDepleted array AND the nearbyResourcesState map — a key
  // present in only the map is the case a naive reader drops).
  const fx = {
    institutions: [
      { id: 'inst.market', name: 'The Market' },                                  // whole
      { id: 'inst.granary', name: 'The Granary', impairments: [{ type: 'capacity' }] }, // wounded
      { id: 'inst.mill', name: 'The Mill', status: 'destroyed' },                 // wounded by status
    ],
    config: {
      nearbyResources: ['timber', 'iron', 'fish'],
      nearbyResourcesDepleted: ['iron'],
      nearbyResourcesState: { fish: 'depleted' },
    },
  };
  const ids = (roster) => roster.map((o) => o.id);

  test('structure-harm offers EVERY institution; structure-restored only the wounded', () => {
    expect(ids(institutionTargets(fx))).toEqual(['inst.market', 'inst.granary', 'inst.mill']);
    expect(ids(impairedInstitutionTargets(fx))).toEqual(['inst.granary', 'inst.mill']);
  });

  test('supply-loss offers only live resources; supply-restored only depleted ones', () => {
    // 'fish' is depleted via the STATE MAP alone — both rosters must see it.
    expect(ids(depletableResourceTargets(fx))).toEqual(['timber']);
    expect(ids(depletedResourceTargets(fx))).toEqual(['iron', 'fish']);
  });

  test('the two institution rosters ARE the manifest entries (one leaf, two desks)', async () => {
    const { AFFORDANCE_MANIFEST } = await import('../../src/domain/events/affordanceManifest.js');
    expect(impairedInstitutionTargets(fx))
      .toEqual(AFFORDANCE_MANIFEST.RESTORE_INSTITUTION.targetOptions(fx));
    expect(depletableResourceTargets(fx))
      .toEqual(AFFORDANCE_MANIFEST.DEPLETE_RESOURCE.targetOptions(fx));
    expect(depletedResourceTargets(fx))
      .toEqual(AFFORDANCE_MANIFEST.RECOVERED_RESOURCE.targetOptions(fx));
  });

  test('an empty settlement yields empty rosters (the picker says so honestly)', () => {
    for (const roster of [institutionTargets, impairedInstitutionTargets,
      depletableResourceTargets, depletedResourceTargets]) {
      expect(roster({})).toEqual([]);
      expect(roster(null)).toEqual([]);
    }
  });
});

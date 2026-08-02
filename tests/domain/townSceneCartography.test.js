/**
 * townSceneCartography.test.js — TC-1 THE CONTRACT
 * (docs/DESIGN_TOWN_CARTOGRAPHY.md §3, §7, A-1, A-3, A-8..A-11).
 *
 * A contract slice's tests are the whole deliverable, because the slice ships DARK:
 * no synthesis runs, so nothing but these pins can tell anyone whether the schema is
 * real. Every claim below is therefore executed against the REAL compiler output and
 * the REAL validator, and every rule is proved by a NEGATIVE CONTROL — the same block
 * with exactly one field broken, asserted to red with a named error, then repaired
 * and asserted to pass. A validator rule with no red is a rule that does not exist.
 *
 *   1. VOCABULARY   the eight closed vocabularies are frozen, sorted, censused by one
 *                   registry, and the ward kinds are BOUND to their producer
 *                   (districtProfile.js) rather than hand-rolled beside it.
 *   2. ADDITIVE     a pre-cartography manifest validates unchanged; the same manifest
 *                   carrying the block validates too; an unknown key still reds.
 *   3. CLOSURE      every reference resolves into a record the manifest publishes.
 *   4. DISCIPLINE   integers, permille, no colour, no seed, conditional keys.
 *   5. TRANSPORT    the gate is total on garbage and the dark envelope is unchanged.
 *   6. IDENTITY     the dormancy seam returns its input by reference.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  TOWN_CARTOGRAPHY_BLOCK_KEYS,
  TOWN_CARTOGRAPHY_BUDGET_KEYS,
  TOWN_CARTOGRAPHY_CONDITIONS,
  TOWN_CARTOGRAPHY_MANIFEST_KEY,
  TOWN_CARTOGRAPHY_RULE_KEY,
  TOWN_CARTOGRAPHY_SCHEMA_VERSION,
  TOWN_CARTOGRAPHY_STREET_KEYS,
  TOWN_CARTOGRAPHY_VOCABULARIES,
  TOWN_CARTOGRAPHY_WARD_KINDS,
  TOWN_SCENE_OPTIONAL_TOP_LEVEL_KEYS,
  attachTownCartographyLayers,
  compileTownSceneManifest,
  prepareTownSceneCompileInput,
  sceneDigest,
  stableSceneStringify,
  townCartographyActive,
  validateTownSceneCompileInput,
  validateTownSceneManifest,
} from '../../src/domain/townScene/index.js';
import { DISTRICT_CATEGORIES } from '../../src/domain/districtProfile.js';
import {
  bindCanonicalInfrastructureRefs,
  synthesizeTownSkeleton,
} from '../../src/domain/townCartography/cartographySynthesis.js';
import { GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CONTRACT_SOURCE = readFileSync(join(ROOT, 'src/domain/townScene/cartographyContract.js'), 'utf8');

/** The walled + watered town: it compiles real gates AND real bridges to reference. */
const WALLED_WATERED = GOLDEN_CONFIGS.findIndex(
  (config) => config.spec.walls === true && config.spec.water === true,
);

/** TC-2's wall-witness band begins at town, so this row exercises both binding
 * families non-vacuously instead of asking an unwalled village for gate witnesses. */
const BOUND_INFRASTRUCTURE = GOLDEN_CONFIGS.findIndex(
  (config) => ['town', 'city', 'metropolis'].includes(config.settlement.tier)
    && config.spec.walls === true
    && config.spec.water === true,
);

function baseManifest() {
  return compileTownSceneManifest({
    settlement: GOLDEN_CONFIGS[WALLED_WATERED].settlement,
    mapEdits: null,
    audience: 'dm',
  });
}

function compiledCartographyManifest(audience = 'dm') {
  return compileTownSceneManifest({
    settlement: GOLDEN_CONFIGS[BOUND_INFRASTRUCTURE].settlement,
    mapEdits: null,
    audience,
    worldState: { simulationRules: { [TOWN_CARTOGRAPHY_RULE_KEY]: true } },
  });
}

const provenance = (kind = 'generated', ref = null) => ({ kind, ref });

/**
 * A well-formed cartography block built AGAINST a real manifest, so every reference
 * it carries is a record that manifest actually publishes. Callers mutate one field
 * to build a negative control.
 * @param {Record<string, unknown>} manifest
 */
function wellFormedBlock(manifest) {
  const gateId = manifest.gates[0].id;
  const bridgeId = manifest.bridges[0].id;
  const institutionRef = manifest.semantics[0].sceneId;
  return {
    schemaVersion: TOWN_CARTOGRAPHY_SCHEMA_VERSION,
    streets: {
      arterials: [{
        id: 'street:arterial:a',
        classKind: 'arterial',
        polyline: [[100, 100], [400, 220], [700, 480]],
        widthPlan: 14,
        provenance: provenance(),
        decidedBy: 'lynch',
      }],
      lanes: [{
        id: 'street:lane:a',
        classKind: 'lane',
        polyline: [[400, 220], [430, 300]],
        widthPlan: 5,
        provenance: provenance('user_edit', 'anchor:district:market'),
        decidedBy: 'feel',
      }],
      gateRefs: [gateId],
      bridgeRefs: [bridgeId],
    },
    wards: [
      {
        id: 'ward:a',
        kind: 'merchant',
        polygon: [[100, 100], [400, 100], [400, 400], [100, 400]],
        tonePermille: 620,
        districtId: 'district:market',
        lynchElement: 'district',
        provenance: provenance(),
        decidedBy: 'state',
      },
      {
        id: 'ward:b',
        kind: 'religious',
        polygon: [[420, 100], [700, 100], [700, 380]],
        tonePermille: 310,
        districtId: null,
        lynchElement: 'node',
        provenance: provenance('pulse', 'tick:42'),
        decidedBy: 'prominence',
      },
    ],
    parcels: [{
      id: 'parcel:a',
      wardId: 'ward:a',
      polygon: [[120, 120], [200, 120], [200, 200], [120, 200]],
      anchor: [160, 160],
      provenance: provenance(),
      decidedBy: 'prominence',
    }],
    buildings: [
      {
        id: 'carto:building:a',
        parcelId: 'parcel:a',
        role: 'institution',
        footprint: [[130, 130], [180, 130], [180, 180], [130, 180]],
        heightPermille: 400,
        agePermille: 250,
        condition: 'sound',
        styleToken: 'stone.ashlar.guild',
        institutionRef,
        placement: 'district',
        lynchElement: 'landmark',
        provenance: provenance(),
        decidedBy: 'prominence',
      },
      {
        id: 'carto:building:b',
        parcelId: 'parcel:a',
        role: 'dwelling',
        footprint: [[190, 130], [198, 130], [198, 145]],
        heightPermille: 120,
        agePermille: 800,
        condition: 'worn',
        styleToken: 'timber.village',
        provenance: provenance(),
        decidedBy: 'feel',
      },
    ],
  };
}

/** Validate a manifest carrying `block`, returning the validator's own result. */
function validateWith(manifest, block) {
  return validateTownSceneManifest({ ...manifest, [TOWN_CARTOGRAPHY_MANIFEST_KEY]: block });
}

/** Deep structural clone via the manifest's own JSON-safe serializer. */
const clone = (value) => JSON.parse(stableSceneStringify(value));

describe('TC-2 compiler mount — the skeleton crosses the TC-1 contract, not beside it', () => {
  it('a real lit compile emits canonical streets and only references canonical infrastructure', () => {
    const settlement = GOLDEN_CONFIGS[BOUND_INFRASTRUCTURE].settlement;
    const base = compileTownSceneManifest({ settlement, mapEdits: null, audience: 'dm' });
    const synthesis = synthesizeTownSkeleton({
      terrain: base.terrain,
      roads: base.roads,
      settlement,
      digest: base.source.mapModelDigest,
    });
    const wallIds = new Set(base.walls.map((row) => row.id));
    const canonicalGates = base.gates.filter((row) => wallIds.has(row.wallId));
    const expectedGateRefs = bindCanonicalInfrastructureRefs(
      synthesis.infrastructureCandidates.gates,
      canonicalGates,
    );
    const expectedBridgeRefs = bindCanonicalInfrastructureRefs(
      synthesis.infrastructureCandidates.bridges,
      base.bridges,
    );
    const manifest = compiledCartographyManifest();
    const block = manifest.cartography;
    expect(block, 'the lit compiler must attach a cartography block').toBeTruthy();
    expect(validateTownSceneManifest(manifest)).toEqual({ ok: true, errors: [] });
    expect(block.streets.arterials.length).toBeGreaterThan(0);
    expect(block.streets.lanes.length).toBeGreaterThan(0);

    const expectedStreetKeys = [
      'classKind', 'decidedBy', 'id', 'polyline', 'provenance', 'widthPlan',
    ];
    for (const [classKind, rows] of [
      ['arterial', block.streets.arterials],
      ['lane', block.streets.lanes],
    ]) {
      for (const street of rows) {
        expect(Object.keys(street).sort()).toEqual(expectedStreetKeys);
        expect(street.classKind).toBe(classKind);
        expect(street.polyline.length).toBeGreaterThanOrEqual(2);
        expect(street.widthPlan).toBeGreaterThan(0);
        expect(street.provenance).toEqual({ kind: 'generated', ref: null });
        // These are the TC-2 working-record names. Seeing either here means the
        // compiler bypassed the contract adapter and mounted a provisional shape.
        expect(Object.prototype.hasOwnProperty.call(street, 'kind')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(street, 'centerline')).toBe(false);
      }
    }

    // The synthesis-local crossing witnesses materially select refs: neither list
    // is the old "copy every infrastructure id" shortcut, and no witness means no
    // binding. Yet the only rows that cross the contract remain canonical ids.
    expect(expectedGateRefs.length).toBeGreaterThan(0);
    expect(expectedBridgeRefs.length).toBeGreaterThan(0);
    expect(expectedGateRefs.length).toBeLessThan(canonicalGates.length);
    expect(expectedBridgeRefs.length).toBeLessThan(base.bridges.length);
    expect(block.streets.gateRefs).toEqual(expectedGateRefs);
    expect(block.streets.bridgeRefs).toEqual(expectedBridgeRefs);
    expect(bindCanonicalInfrastructureRefs([], canonicalGates)).toEqual([]);
    expect(bindCanonicalInfrastructureRefs([], base.bridges)).toEqual([]);
    expect(Object.keys(block).sort()).toEqual([...TOWN_CARTOGRAPHY_BLOCK_KEYS].sort());
    for (const duplicate of ['walls', 'gates', 'bridges']) {
      expect(Object.prototype.hasOwnProperty.call(block, duplicate)).toBe(false);
    }
    expect(block.wards).toEqual([]);
    expect(block.parcels).toEqual([]);
    expect(block.buildings).toEqual([]);
  });

  it('the real compiler is deterministic for every audience and the block is not a DM-only accident', () => {
    for (const audience of ['dm', 'player', 'public']) {
      const first = compiledCartographyManifest(audience);
      const second = compiledCartographyManifest(audience);
      expect(first.cartography.streets.arterials.length).toBeGreaterThan(0);
      expect(first.cartography.streets.lanes.length).toBeGreaterThan(0);
      expect(stableSceneStringify(second.cartography))
        .toBe(stableSceneStringify(first.cartography));
      expect(validateTownSceneManifest(first)).toEqual({ ok: true, errors: [] });
    }
  });
});

describe('TC-1 vocabulary — closed, censused, and bound to its producer', () => {
  it('the ward kinds ARE the estate twelve district categories, both ways', () => {
    // Exact-set-both-ways (the vocabularyTotality producer/consumer contract). The
    // contract module deliberately does NOT import districtProfile.js at runtime (it
    // drags the faction, causal, condition and threat derivations behind it), so the
    // binding is asserted here instead of assumed.
    expect(DISTRICT_CATEGORIES.length).toBeGreaterThan(0);
    expect([...TOWN_CARTOGRAPHY_WARD_KINDS].sort()).toEqual([...DISTRICT_CATEGORIES].sort());
  });

  it('every exported vocabulary is registered, frozen, sorted, unique and non-empty', () => {
    // The registry check is DERIVED FROM SOURCE, not from a hand-listed set: a ninth
    // vocabulary added to the module without a registry entry reds here.
    const exported = [...CONTRACT_SOURCE.matchAll(/export const (TOWN_CARTOGRAPHY_[A-Z_]+) = Object\.freeze\(\[/g)]
      .map((match) => match[1]);
    expect(exported.length).toBeGreaterThanOrEqual(8);
    const registered = new Set(Object.values(TOWN_CARTOGRAPHY_VOCABULARIES).map((list) => list.join('|')));
    // The two STRUCTURAL key lists are not semantic vocabularies, so they are named
    // here rather than registered; everything else must be censused.
    const structural = new Set([
      TOWN_CARTOGRAPHY_BLOCK_KEYS.join('|'),
      TOWN_CARTOGRAPHY_STREET_KEYS.join('|'),
      TOWN_CARTOGRAPHY_BUDGET_KEYS.join('|'),
    ]);
    for (const [name, list] of Object.entries(TOWN_CARTOGRAPHY_VOCABULARIES)) {
      expect(Object.isFrozen(list), name).toBe(true);
      expect(list.length, name).toBeGreaterThan(0);
      expect(new Set(list).size, name).toBe(list.length);
      // Sorted, with ONE declared exception: the condition ladder is ORDERED (index
      // is meaning, worst last), so alphabetising it would destroy the comparison the
      // next test pins. Naming the exception here keeps it deliberate.
      if (name !== 'conditions') expect([...list].sort(), name).toEqual([...list]);
    }
    expect(Object.keys(TOWN_CARTOGRAPHY_VOCABULARIES).length).toBe(8);
    expect(registered.size + structural.size).toBe(exported.length);
  });

  it('the condition ladder is ORDERED worst-last, so a rung comparison needs no second table', () => {
    expect([...TOWN_CARTOGRAPHY_CONDITIONS]).toEqual([
      'pristine', 'sound', 'worn', 'damaged', 'burned', 'ruined',
    ]);
    expect(TOWN_CARTOGRAPHY_CONDITIONS.indexOf('ruined'))
      .toBeGreaterThan(TOWN_CARTOGRAPHY_CONDITIONS.indexOf('pristine'));
  });
});

describe('TC-1 the additive schema — an old manifest loads unchanged, a new one is a superset', () => {
  it('a pre-cartography manifest still validates, and carries no cartography key', () => {
    const manifest = baseManifest();
    expect(validateTownSceneManifest(manifest)).toMatchObject({ ok: true, errors: [] });
    expect(Object.prototype.hasOwnProperty.call(manifest, TOWN_CARTOGRAPHY_MANIFEST_KEY)).toBe(false);
    expect(manifest.schemaVersion).toBe(1);
    // Anti-vacuity: the fixture actually publishes the records the block references.
    expect(manifest.gates.length).toBeGreaterThan(0);
    expect(manifest.bridges.length).toBeGreaterThan(0);
    expect(manifest.semantics.length).toBeGreaterThan(0);
  });

  it('the SAME manifest carrying a well-formed block validates, and the block is the only delta', () => {
    const manifest = baseManifest();
    const block = wellFormedBlock(manifest);
    expect(validateWith(manifest, block)).toMatchObject({ ok: true, errors: [] });
    const superset = { ...manifest, [TOWN_CARTOGRAPHY_MANIFEST_KEY]: block };
    const { cartography: _dropped, ...stripped } = superset;
    expect(stableSceneStringify(stripped)).toBe(stableSceneStringify(manifest));
    // A superset digests DIFFERENTLY, which is what makes the fence able to see it.
    expect(sceneDigest(superset)).not.toBe(sceneDigest(manifest));
  });

  it('NEGATIVE CONTROL: the top-level wall did not widen for anything but this one key', () => {
    const manifest = baseManifest();
    expect(TOWN_SCENE_OPTIONAL_TOP_LEVEL_KEYS).toEqual([TOWN_CARTOGRAPHY_MANIFEST_KEY]);
    const intruder = validateTownSceneManifest({ ...manifest, somethingElse: {} });
    expect(intruder.ok).toBe(false);
    expect(intruder.errors.join('\n')).toContain('manifest top-level keys must be exactly');
    // And a raw carrier is still refused, optional key or not.
    const carrier = validateTownSceneManifest({ ...manifest, worldState: {} });
    expect(carrier.ok).toBe(false);
  });

  it('NEGATIVE CONTROL: a PARTIAL block reds (the four layers are all-or-nothing)', () => {
    const manifest = baseManifest();
    for (const dropped of ['streets', 'wards', 'parcels', 'buildings', 'schemaVersion']) {
      const block = wellFormedBlock(manifest);
      delete block[dropped];
      const result = validateWith(manifest, block);
      expect(result.ok, `dropping ${dropped} must red`).toBe(false);
      expect(result.errors.join('\n')).toContain('cartography keys must be exactly');
    }
    // RESTORE: the untouched block passes, so the reds above measured the drop.
    expect(validateWith(manifest, wellFormedBlock(manifest))).toMatchObject({ ok: true });
  });

  it('NEGATIVE CONTROL: a wrong block schemaVersion reds', () => {
    const manifest = baseManifest();
    const block = { ...wellFormedBlock(manifest), schemaVersion: 2 };
    const result = validateWith(manifest, block);
    expect(result.ok).toBe(false);
    expect(result.errors.join('\n')).toContain('cartography.schemaVersion must be 1');
  });
});

describe('TC-1 referential closure — the map cannot invent a reference', () => {
  it('NEGATIVE CONTROL: a gate, bridge, ward, parcel or institution reference that resolves nowhere reds', () => {
    const manifest = baseManifest();
    /** @type {Array<[string, (block: Record<string, unknown>) => void, string]>} */
    const breaks = [
      ['gateRef', (block) => { block.streets.gateRefs = ['gate:nowhere:9']; }, 'gateRefs[0] must name a record'],
      ['bridgeRef', (block) => { block.streets.bridgeRefs = ['bridge:nowhere:9']; }, 'bridgeRefs[0] must name a record'],
      ['wardId', (block) => { block.parcels[0].wardId = 'ward:missing'; }, 'wardId must name a ward in this block'],
      ['parcelId', (block) => { block.buildings[0].parcelId = 'parcel:missing'; }, 'parcelId must name a parcel in this block'],
      ['institutionRef', (block) => { block.buildings[0].institutionRef = 'institution:missing'; }, 'must resolve through the manifest semantics table'],
    ];
    for (const [label, breakIt, expected] of breaks) {
      const block = wellFormedBlock(manifest);
      breakIt(block);
      const result = validateWith(manifest, block);
      expect(result.ok, `${label} must red`).toBe(false);
      expect(result.errors.join('\n'), label).toContain(expected);
    }
    // RESTORE: with every reference correct the same shape passes.
    expect(validateWith(manifest, wellFormedBlock(manifest))).toMatchObject({ ok: true, errors: [] });
  });

  it('NEGATIVE CONTROL: unsorted or duplicated ids red (canonical order is load-bearing for the digest)', () => {
    const manifest = baseManifest();
    const unsorted = wellFormedBlock(manifest);
    unsorted.wards = [unsorted.wards[1], unsorted.wards[0]];
    expect(validateWith(manifest, unsorted).errors.join('\n')).toContain('cartography.wards must be sorted by id');

    const duplicated = wellFormedBlock(manifest);
    duplicated.wards = [duplicated.wards[0], { ...duplicated.wards[0] }];
    expect(validateWith(manifest, duplicated).errors.join('\n')).toContain('duplicate id "ward:a"');
  });
});

describe('TC-1 the geometry and colour disciplines', () => {
  it('NEGATIVE CONTROL: a raw colour anywhere in the block reds, and removing it restores green (A-9)', () => {
    const manifest = baseManifest();
    for (const colour of ['#a34b12', 'rgb(12, 34, 56)']) {
      const block = wellFormedBlock(manifest);
      block.wards[0].districtId = colour;
      const result = validateWith(manifest, block);
      expect(result.ok, colour).toBe(false);
      expect(result.errors.join('\n'), colour).toContain('carries a raw colour');
    }
    expect(validateWith(manifest, wellFormedBlock(manifest))).toMatchObject({ ok: true, errors: [] });
  });

  it('NEGATIVE CONTROL: fractional and out-of-extent coordinates red, and permille stays an integer 0..1000', () => {
    const manifest = baseManifest();
    /** @type {Array<[string, (block: Record<string, unknown>) => void, string]>} */
    const breaks = [
      ['fractional ward vertex', (b) => { b.wards[0].polygon[0] = [100.5, 100]; }, 'must be an integer from 0 to 1000'],
      ['out-of-extent vertex', (b) => { b.wards[0].polygon[0] = [1001, 100]; }, 'must be an integer from 0 to 1000'],
      ['fractional anchor', (b) => { b.parcels[0].anchor = [160.25, 160]; }, 'anchor[0][0] must be an integer'],
      ['fractional permille', (b) => { b.buildings[0].heightPermille = 400.5; }, 'heightPermille must be an integer from 0 to 1000'],
      ['over-range permille', (b) => { b.wards[0].tonePermille = 1200; }, 'tonePermille must be an integer from 0 to 1000'],
      ['degenerate polygon', (b) => { b.wards[0].polygon = [[10, 10], [20, 20]]; }, 'polygon must carry at least 3 points'],
      ['degenerate polyline', (b) => { b.streets.arterials[0].polyline = [[10, 10]]; }, 'polyline must carry at least 2 points'],
    ];
    for (const [label, breakIt, expected] of breaks) {
      const block = wellFormedBlock(manifest);
      breakIt(block);
      const result = validateWith(manifest, block);
      expect(result.ok, label).toBe(false);
      expect(result.errors.join('\n'), label).toContain(expected);
    }
    expect(validateWith(manifest, wellFormedBlock(manifest))).toMatchObject({ ok: true, errors: [] });
  });

  it('NEGATIVE CONTROL: an out-of-vocabulary value reds on every closed field', () => {
    const manifest = baseManifest();
    /** @type {Array<[string, (block: Record<string, unknown>) => void]>} */
    const breaks = [
      ['ward kind', (b) => { b.wards[0].kind = 'waterfront'; }],
      ['ward lynch element', (b) => { b.wards[0].lynchElement = 'landmark'; }],
      ['street class', (b) => { b.streets.lanes[0].classKind = 'arterial'; }],
      ['building role', (b) => { b.buildings[1].role = 'shed'; }],
      ['condition', (b) => { b.buildings[0].condition = 'decrepit'; }],
      ['placement', (b) => { b.buildings[0].placement = 'scattered'; }],
      ['deciding layer', (b) => { b.buildings[0].decidedBy = 'tokens'; }],
      ['provenance kind', (b) => { b.wards[0].provenance = { kind: 'imported', ref: null }; }],
    ];
    for (const [label, breakIt] of breaks) {
      const block = wellFormedBlock(manifest);
      breakIt(block);
      expect(validateWith(manifest, block).ok, label).toBe(false);
    }
    expect(validateWith(manifest, wellFormedBlock(manifest))).toMatchObject({ ok: true, errors: [] });
  });

  it('NEGATIVE CONTROL: the conditional keys drop when empty and are required when they apply', () => {
    const manifest = baseManifest();
    /** @type {Array<[string, (block: Record<string, unknown>) => void, string]>} */
    const breaks = [
      ['dwelling with an institutionRef', (b) => { b.buildings[1].institutionRef = manifest.semantics[0].sceneId; },
        'institutionRef must be present for an institution and absent for a dwelling'],
      ['institution without an institutionRef', (b) => { delete b.buildings[0].institutionRef; },
        'institutionRef must be present for an institution and absent for a dwelling'],
      ['dwelling with a placement', (b) => { b.buildings[1].placement = 'clustered'; },
        'placement must be present for an institution and absent for a dwelling'],
      ['a non-landmark lynch element on a footprint', (b) => { b.buildings[1].lynchElement = 'path'; },
        'lynchElement must be one of: landmark'],
      ['generated provenance carrying a ref', (b) => { b.wards[0].provenance = { kind: 'generated', ref: 'tick:1' }; },
        'ref must be null for generated provenance'],
      ['a pulse provenance without a ref', (b) => { b.wards[1].provenance = { kind: 'pulse', ref: null }; },
        'ref must be a bounded lowercase token'],
    ];
    for (const [label, breakIt, expected] of breaks) {
      const block = wellFormedBlock(manifest);
      breakIt(block);
      const result = validateWith(manifest, block);
      expect(result.ok, label).toBe(false);
      expect(result.errors.join('\n'), label).toContain(expected);
    }
    expect(validateWith(manifest, wellFormedBlock(manifest))).toMatchObject({ ok: true, errors: [] });
  });

  it('the block JSON round-trips and digests identically regardless of key insertion order', () => {
    const manifest = baseManifest();
    const block = wellFormedBlock(manifest);
    const roundTripped = clone(block);
    expect(validateWith(manifest, roundTripped)).toMatchObject({ ok: true, errors: [] });
    expect(stableSceneStringify(roundTripped)).toBe(stableSceneStringify(block));

    // The same block assembled in a different key order must digest the same, or the
    // golden corpus design §7 asks for would depend on assembly order.
    const reordered = {
      buildings: block.buildings,
      wards: block.wards,
      schemaVersion: block.schemaVersion,
      parcels: block.parcels,
      streets: block.streets,
    };
    expect(sceneDigest(reordered)).toBe(sceneDigest(block));
    expect(validateWith(manifest, reordered)).toMatchObject({ ok: true, errors: [] });
  });
});

describe('TC-1 the dormancy seam and the transport gate', () => {
  it('the gate is TOTAL on garbage and reads only an explicit true', () => {
    expect(TOWN_CARTOGRAPHY_RULE_KEY).toBe('townCartographyEnabled');
    expect(townCartographyActive({ townCartographyEnabled: true })).toBe(true);
    for (const value of [undefined, null, 0, '', 'true', 1, {}, [], NaN]) {
      expect(townCartographyActive({ townCartographyEnabled: value }), String(value)).toBe(false);
    }
    for (const rules of [null, undefined, 'rules', 7, [], {}]) {
      expect(townCartographyActive(rules), String(rules)).toBe(false);
    }
  });

  it('the attach seam returns its input BY OBJECT IDENTITY when dark, and a new object when lit', () => {
    const manifest = baseManifest();
    expect(attachTownCartographyLayers(manifest, null)).toBe(manifest);
    expect(attachTownCartographyLayers(manifest, undefined)).toBe(manifest);
    const block = wellFormedBlock(manifest);
    const lit = attachTownCartographyLayers(manifest, block);
    expect(lit).not.toBe(manifest);
    expect(lit[TOWN_CARTOGRAPHY_MANIFEST_KEY]).toBe(block);
    // And attaching never mutates the manifest it was handed.
    expect(Object.prototype.hasOwnProperty.call(manifest, TOWN_CARTOGRAPHY_MANIFEST_KEY)).toBe(false);
  });

  it('the transport envelope carries the gate ONLY when lit, and refuses any other value', () => {
    const settlement = GOLDEN_CONFIGS[WALLED_WATERED].settlement;
    const dark = prepareTownSceneCompileInput({ settlement, mapEdits: null, audience: 'dm' });
    const lit = prepareTownSceneCompileInput({
      settlement,
      mapEdits: null,
      audience: 'dm',
      worldState: { simulationRules: { [TOWN_CARTOGRAPHY_RULE_KEY]: true } },
    });
    expect(Object.keys(dark).sort()).toEqual([
      'atmosphere', 'audience', 'inputDigest', 'kind', 'mapEdits', 'schemaVersion', 'settlement',
    ]);
    expect(Object.keys(lit).sort()).toEqual([
      'atmosphere', 'audience', 'cartography', 'inputDigest', 'kind', 'mapEdits', 'schemaVersion', 'settlement',
    ]);
    // The gate key changes the envelope digest, so a lit request cannot collide with a
    // dark one in the scene cache.
    expect(lit.inputDigest).not.toBe(dark.inputDigest);

    expect(validateTownSceneCompileInput(dark)).toMatchObject({ ok: true, errors: [] });
    expect(validateTownSceneCompileInput(lit)).toMatchObject({ ok: true, errors: [] });
  });

  it('NEGATIVE CONTROL: only { enabled: true } may ride the envelope, and a dark envelope is unchanged', () => {
    const settlement = GOLDEN_CONFIGS[WALLED_WATERED].settlement;
    const lit = prepareTownSceneCompileInput({
      settlement,
      mapEdits: null,
      audience: 'dm',
      worldState: { simulationRules: { [TOWN_CARTOGRAPHY_RULE_KEY]: true } },
    });
    for (const value of [{ enabled: false }, { enabled: true, extra: 1 }, true, null, {}]) {
      const tampered = { ...lit, cartography: value };
      const result = validateTownSceneCompileInput(tampered);
      expect(result.ok, JSON.stringify(value)).toBe(false);
      expect(result.errors.join('\n'), JSON.stringify(value))
        .toContain('cartography must be exactly { enabled: true }, or absent');
    }
    // RESTORE: the untampered lit envelope passes, so the reds above measured the value.
    expect(validateTownSceneCompileInput(lit)).toMatchObject({ ok: true, errors: [] });

    // A dark envelope digests EXACTLY as it did before the conditional key existed:
    // the core the digest covers is rebuilt here from the six pre-TC-1 fields alone.
    const dark = prepareTownSceneCompileInput({ settlement, mapEdits: null, audience: 'dm' });
    expect(dark.inputDigest).toBe(sceneDigest({
      kind: dark.kind,
      schemaVersion: dark.schemaVersion,
      audience: dark.audience,
      settlement: dark.settlement,
      mapEdits: dark.mapEdits,
      atmosphere: dark.atmosphere,
    }));
  });
});

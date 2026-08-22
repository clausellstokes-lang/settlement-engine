/**
 * tests/domain/townMapSpatialReceipt.test.js — MF-T2H's acceptance matrix.
 *
 * The family's two-file acceptance shape (the domain matrix plus a determinism companion,
 * following `townMapCoordinateAbiDeterminism.test.js`). ONE literal `describe`, straight-line
 * `test` calls with string-literal titles, and every loop runs INSIDE a named test — the SP-D
 * idiom, so the census credits the file rather than parking it (preamble §P5).
 *
 * ⭐⭐ WHAT THESE FOUR CASES ARE FOR. §287.4's content is that three rules become
 * UNREPRESENTABLE rather than merely forbidden, and a rule is only unrepresentable if the
 * construction actually REFUSES. Each case below therefore drives the refusal and its positive
 * control in the same test: an assertion that a bad receipt throws proves nothing unless the
 * neighbouring good receipt is shown to construct.
 */

import { describe, expect, test } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  DEPENDENCY_ROSTER,
  DIGEST_DOMAINS,
  NON_SPATIAL_FIELDS,
  RECEIPT_KINDS,
  SPATIAL_FIELDS,
  canonicalSpatial,
  fingerprint,
  noEffectDiagnostic,
  spatialEffectReceipt,
  spatialRef,
} from '../../src/domain/townMap/fabric/spatialReceipt.js';

/** A dependency pair, spelled once. */
const dep = (role, contentHash) => ({ role, contentHash });

/** The static-ACCESS branch's exact roster, which is `['SPATIAL', 'LAW']`. */
const STATIC_DEPS = Object.freeze([dep('SPATIAL', 'h1'), dep('LAW', 'h2')]);

/** A well-formed receipt input: observed at 2, sourced at 1, effective at 3 — dated for LATER. */
const WELL_FORMED = Object.freeze({
  kind: 'ACCESS',
  temporalMode: 'STATIC_POTENTIAL',
  sourceSpatialRef: { artifactId: null, contentHash: 'fp-v1-0000', effectiveAt: 1 },
  payload: { blocked: false },
  sourceIds: ['gate.north'],
  affectedIds: ['parcel.7'],
  observedAt: 2,
  effectiveAt: 3,
  dependencies: STATIC_DEPS,
});

/**
 * ⭐⭐ THE SEALED SPELLING OF THE DEPENDENCY JOIN, RE-SPELLED HERE AS THE CONTROL (ODQ §390.1).
 * The port cures this join; a witness that only shows the cured side cannot tell "injective" from
 * "the comparison stopped running", so the defective spelling is carried here deliberately and
 * asserted against a NAMED LITERAL below. It is a test fixture and never an import.
 */
const sealedDependencyJoin = (deps) => deps.map((d) => `${d.role}=${d.contentHash}`).join(',');

describe('MF-T2H spatial-receipt seam', () => {
  test('A1 · guard-the-guard: the receipt vocabularies are live and a well-formed receipt constructs, so every refusal below convicts something', () => {
    // ⭐ THE FAMILY'S OPENING ARM (preamble §P6). If either vocabulary silently emptied, the
    // roster and refusal assertions in A2-A4 would all pass on nothing.
    expect(RECEIPT_KINDS.length, 'the receipt-kind vocabulary emptied').toBe(7);
    expect(DIGEST_DOMAINS, 'the four §10.1 artifact domains').toEqual(
      ['SPATIAL', 'OBSERVATION', 'PROJECTION', 'RASTER'],
    );
    const rosterKeys = Object.keys(DEPENDENCY_ROSTER);
    expect(rosterKeys.length, 'the dependency roster emptied').toBe(10);
    // Every branch key names a REGISTERED kind, and every registered kind has at least one
    // branch — so neither vocabulary can drift away from the other unnoticed.
    const kindsInRoster = [...new Set(rosterKeys.map((k) => k.split('|')[0]))].sort();
    expect(kindsInRoster, 'a roster branch names a kind that is not registered, or a registered'
      + ' kind has no branch at all').toEqual([...RECEIPT_KINDS].sort());
    // …and the positive control the three refusal cases rest on: this input CONSTRUCTS.
    const receipt = spatialEffectReceipt(WELL_FORMED);
    expect(receipt.artifactKind).toBe('SPATIAL_EFFECT_RECEIPT');
    expect(receipt.contentHash).toMatch(/^fp-v1-[0-9a-f]{32}$/);
    expect(receipt.effectiveAt).toBe(3);
    expect(Object.isFrozen(receipt), 'a receipt is immutable by construction').toBe(true);
    // The absent §10.2 artifact families are NULL and named, never stubbed.
    expect([receipt.artifactId, receipt.provenanceRef, receipt.lawVersion]).toEqual([null, null, null]);
  });

  test('A2 · RULE 1 — a receipt dated inside its own pass cannot be constructed', () => {
    // ⛔ §287.4's whole content, as arithmetic. The latest source time here is observedAt = 2.
    // THE POSITIVE CONTROL FIRST: the smallest lawful effectiveAt constructs.
    expect(spatialEffectReceipt({ ...WELL_FORMED, effectiveAt: 3 }).effectiveAt).toBe(3);
    // ⭐ THE BRANCH UNDER TEST IS `effectiveAt > latest`, NOT `>=`. The equal case is the one a
    // mutant flips, and it is the one that would re-open same-pass feedback, so it is pinned by
    // itself rather than lumped in with the plainly-earlier case.
    expect(() => spatialEffectReceipt({ ...WELL_FORMED, effectiveAt: 2 }))
      .toThrow(/must be STRICTLY later than every source time/);
    expect(() => spatialEffectReceipt({ ...WELL_FORMED, effectiveAt: 1 })).toThrow(TypeError);
    expect(() => spatialEffectReceipt({ ...WELL_FORMED, effectiveAt: 0 })).toThrow(TypeError);
    // The source ref's own time counts too, not only the observation — a receipt effective at 3
    // is unrepresentable when the spatial artifact it reads was itself effective at 3.
    expect(() => spatialEffectReceipt({
      ...WELL_FORMED, sourceSpatialRef: { effectiveAt: 3 }, effectiveAt: 3,
    })).toThrow(/must be STRICTLY later/);
    // …and an ABSENT source time is a refusal, never a free pass: with nothing finite to be
    // later than, `latest` is null and the construction fails rather than defaulting to zero.
    expect(() => spatialEffectReceipt({
      ...WELL_FORMED, sourceSpatialRef: { effectiveAt: undefined }, observedAt: Number.NaN,
    })).toThrow(/must be STRICTLY later/);
  });

  test('A3 · RULE 2 — the dependency roster is closed by kind and temporal branch in order, and every composite preimage this module hashes is injective (ODQ §390.1)', () => {
    // ── THE ROSTER IS CLOSED ────────────────────────────────────────────────────────────
    // An unregistered kind, an unknown temporal branch, a missing role, an extra role and a
    // REORDERING are each construction failures rather than validation warnings.
    expect(() => spatialEffectReceipt({ ...WELL_FORMED, kind: 'SHADE' }))
      .toThrow(/is not a registered receipt kind/);
    expect(() => spatialEffectReceipt({ ...WELL_FORMED, temporalMode: 'LIVE' }))
      .toThrow(/needs a new discriminated branch, never an extra role in a tuple/);
    expect(() => spatialEffectReceipt({ ...WELL_FORMED, dependencies: [dep('SPATIAL', 'h1')] }))
      .toThrow(/requires exactly \[SPATIAL, LAW\] in that order/);
    expect(() => spatialEffectReceipt({
      ...WELL_FORMED, dependencies: [...STATIC_DEPS, dep('LAW', 'h3')],
    })).toThrow(/requires exactly \[SPATIAL, LAW\] in that order/);
    // ⭐ ORDER IS PART OF THE CONTRACT: the same two roles, swapped, is a refusal. Without this
    // arm the roster check degrades to a set comparison and two causal chains hash alike.
    expect(() => spatialEffectReceipt({
      ...WELL_FORMED, dependencies: [dep('LAW', 'h2'), dep('SPATIAL', 'h1')],
    })).toThrow(/requires exactly \[SPATIAL, LAW\] in that order/);
    // The four-role seasonal branch constructs, so the roster is not merely refusing everything.
    expect(spatialEffectReceipt({
      ...WELL_FORMED,
      kind: 'SHADE_EXPOSURE',
      temporalMode: 'SEASONAL_OBSERVATION',
      dependencies: [dep('SPATIAL', 'h1'), dep('OBSERVATION', 'h2'), dep('SOLAR_PROFILE', 'h3'),
        dep('LAW', 'h4')],
    }).orderedDependencies.map((d) => d.role))
      .toEqual(['SPATIAL', 'OBSERVATION', 'SOLAR_PROFILE', 'LAW']);

    // ── THE INJECTIVITY CURE, WITNESSED BOTH WAYS ───────────────────────────────────────
    // ⛔ The defect: a plain join over variable-length parts lets one list impersonate another.
    // The pair below is ENGINEERED so the sealed spelling produces ONE string from TWO different
    // dependency rosters. The pre-cure string is named as a literal, so this control cannot rot
    // into comparing the deriver with itself.
    const depsA = [dep('SPATIAL', 'x,LAW=y'), dep('LAW', 'z')];
    const depsB = [dep('SPATIAL', 'x'), dep('LAW', 'y,LAW=z')];
    const PRE_CURE_JOIN = 'SPATIAL=x,LAW=y,LAW=z';
    expect([sealedDependencyJoin(depsA), sealedDependencyJoin(depsB)],
      'the engineered pair stopped colliding under the sealed spelling — the witness rotted')
      .toEqual([PRE_CURE_JOIN, PRE_CURE_JOIN]);
    // …and under the LIVE module the two receipts carry DIFFERENT fingerprints. This is the cure.
    const hashOf = (over) => spatialEffectReceipt({ ...WELL_FORMED, ...over }).contentHash;
    expect(hashOf({ dependencies: depsA })).not.toBe(hashOf({ dependencies: depsB }));
    // ⭐ THE SAME DEFECT AT THE OTHER THREE SEAMS IN THIS MODULE, cured by the same rule. Each
    // pair below collides under a plain join and must not collide here.
    expect(hashOf({ sourceIds: ['a|b'], affectedIds: ['c'] }))
      .not.toBe(hashOf({ sourceIds: ['a'], affectedIds: ['b|c'] }));
    expect(hashOf({ sourceIds: ['a,b'] })).not.toBe(hashOf({ sourceIds: ['a', 'b'] }));
    expect(canonicalSpatial({ walls: 'a\nchannels:b' }).spatialHash)
      .not.toBe(canonicalSpatial({ walls: 'a', channels: 'b\nchannels:∅' }).spatialHash);
    // ⭐ THE NEGATIVE CONTROL. Plainly distinct inputs must ALSO read distinct — otherwise the
    // four assertions above would pass under a digest that had stopped depending on its input.
    expect(hashOf({ sourceIds: ['alpha'] })).not.toBe(hashOf({ sourceIds: ['omega'] }));
    // …and identical input reads IDENTICAL, so "distinct" is a measurement and not a nonce.
    expect(hashOf({ sourceIds: ['alpha'] })).toBe(hashOf({ sourceIds: ['alpha'] }));
  });

  test('A4 · RULE 3 — a no-effect result is a typed diagnostic, and the spatial digest is built from a named field roster rather than from the object', () => {
    // ── THE OTHER DOOR ──────────────────────────────────────────────────────────────────
    // An empty causal receipt is unrepresentable in BOTH directions…
    expect(() => spatialEffectReceipt({ ...WELL_FORMED, sourceIds: [] }))
      .toThrow(/uses noEffectDiagnostic, never an empty causal receipt/);
    expect(() => spatialEffectReceipt({ ...WELL_FORMED, affectedIds: [] }))
      .toThrow(/uses noEffectDiagnostic, never an empty causal receipt/);
    // …and the diagnostic is a SEPARATELY TYPED artifact, so a census can tell "nothing
    // happened" from "nobody looked". Its artifactKind is what makes the two unmixable.
    const diagnostic = noEffectDiagnostic('ACCESS', { effectiveAt: 1 }, ['gate.north'], 2);
    expect(diagnostic.artifactKind).toBe('SPATIAL_EFFECT_DIAGNOSTIC');
    expect(diagnostic.result).toBe('NO_EFFECT');
    expect(diagnostic.artifactKind)
      .not.toBe(spatialEffectReceipt(WELL_FORMED).artifactKind);
    expect(diagnostic.examinedIds).toEqual(['gate.north']);
    // A diagnostic carries NO contentHash — it is not a causal receipt wearing another name.
    expect(diagnostic.contentHash).toBeUndefined();

    // ── THE DIGEST IS BUILT FROM A NAMED ROSTER, NOT FROM THE OBJECT ────────────────────
    // ⛔ §10.1: "No aggregate digest is accepted as proof of a narrower invariant." The roster
    // is what makes that refusal structural: a field outside it CANNOT reach the digest.
    expect(SPATIAL_FIELDS.length).toBe(12);
    expectAbsentWithAnchor(SPATIAL_FIELDS, 'immersion', 'walls', 'the durable spatial roster');
    expectAbsentWithAnchor(NON_SPATIAL_FIELDS, 'walls', 'immersion', 'the §10.1 exclusion list');
    const durable = { walls: [[[0, 0], [1, 0], [1, 1]]], parcels: [{ id: 'p1' }] };
    const artifact = canonicalSpatial(durable, 4);
    expect(artifact.fieldRoster, 'the artifact publishes the roster it was built from')
      .toBe(SPATIAL_FIELDS);
    expect(artifact.coordinateAbiVersion, 'the ABI version this member does NOT move (§390.2)')
      .toBe(1);
    // ⭐ THE STRUCTURAL PROOF, DRIVEN RATHER THAN ASSERTED: adding EVERY excluded field at once
    // leaves the digest byte-identical, while touching ONE roster field moves it. A whole-object
    // hash would fail the first assertion, which is exactly the defect §10.1 forbids.
    const polluted = { ...durable };
    for (const name of NON_SPATIAL_FIELDS) polluted[name] = `noise:${name}`;
    expect(canonicalSpatial(polluted, 4).spatialHash,
      'an excluded field reached the spatial digest — the digest is reading the OBJECT')
      .toBe(artifact.spatialHash);
    expect(canonicalSpatial({ ...durable, parcels: [{ id: 'p2' }] }, 4).spatialHash,
      'a durable roster field did NOT move the digest — the roster read is dead')
      .not.toBe(artifact.spatialHash);
    // A reference resolves identity AND content together.
    expect(spatialRef(artifact)).toEqual({ artifactId: null, contentHash: artifact.spatialHash, effectiveAt: 4 });
    // ⚠ THE DIGEST IS NOT RE-DERIVED HERE ON PURPOSE (preamble §P2.10, the mirrors-the-deriver
    // arm). Re-spelling `canonicalBytes`' preimage in the test would assert the module against a
    // copy of itself and could never see a dead arm. What IS asserted is the declared SHAPE, and
    // that the fingerprint is a live function of its text rather than a constant.
    expect(artifact.spatialHash).toMatch(/^fp-v1-[0-9a-f]{32}$/);
    expect(artifact.canonicalByteLength).toBeGreaterThan(0);
    expect(fingerprint('witness'), 'the fingerprint is not deterministic').toBe(fingerprint('witness'));
    expect(fingerprint('witness'), 'the fingerprint ignores its input — every digest assertion'
      + ' above would then pass for the wrong reason').not.toBe(fingerprint('witnesz'));
  });
});

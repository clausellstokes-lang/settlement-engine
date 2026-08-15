/**
 * tests/domain/constructRealm.test.js — S6 REALM CONSTRUCTION pins
 * (DESIGN_AI_CONTROL_SURFACE §2 stage 6).
 *
 *   PIN 1 (REALM KNOBS ARE THE OP): the compiler may emit ONLY the composer's three knobs
 *     (realmSize/tone/mapKind) with valid values; anything else is dropped-and-listed.
 *   PIN 2 (CANONIZES NOTHING UNTIL COMMIT — verify at its SOURCE): composeInstantWorld PLACES
 *     everything but leaves the realm's SPATIAL canon UNFROZEN (spatialCanonVersion 0, no
 *     spatialDigest) — the commit (runSpatialCanonize) is a separate deliberate act.
 *   PIN 3 (THE COMPARATOR GENERALIZES): compareRealmToConstraints judges the composed realm's
 *     aggregate posture against declared constraints — deterministic, zero AI.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { validateRealmConfig, REALM_FIELDS_WIRE, coarseBand, CONSTRAINT_DIMENSIONS } from '../../src/domain/construct/configVocabulary.js';
import { compareRealmToConstraints } from '../../src/domain/construct/intentComparator.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { composeInstantWorld } from '../../src/lib/instantWorld/composeInstantWorld.js';

describe('construct realm — the knobs are the op / schema wall (PIN 1)', () => {
  it('keeps only valid realm knobs; drops unregistered keys + bad values', () => {
    const { config, unsupported } = validateRealmConfig({
      realmSize: 'small',            // valid → kept
      tone: 'dramatic_campaign',     // valid → kept
      mapKind: 'volcano',            // valid → kept
      realmSize2: 'huge',            // unregistered → dropped
      tone2: 'nope',                 // unregistered → dropped
    });
    expect(config).toEqual({ realmSize: 'small', tone: 'dramatic_campaign', mapKind: 'volcano' });
    expect(unsupported.map((u) => u.key).sort()).toEqual(['realmSize2', 'tone2']);
  });

  it('an invalid knob value is dropped (the wall, not fail-open into the composer)', () => {
    const { config, unsupported } = validateRealmConfig({ realmSize: 'gigantic', tone: 'quiet_local' });
    expect(config).toEqual({ tone: 'quiet_local' });
    expect(unsupported).toContainEqual({ key: 'realmSize', reason: 'invalid_value' });
  });

  it('the posted realm wire descriptor is JSON-serializable enum value lists', () => {
    expect(REALM_FIELDS_WIRE.realmSize.type).toBe('enum');
    expect(REALM_FIELDS_WIRE.realmSize.values).toContain('small');
    expect(REALM_FIELDS_WIRE.tone.values).toContain('quiet_local');
    expect(JSON.parse(JSON.stringify(REALM_FIELDS_WIRE))).toEqual(REALM_FIELDS_WIRE);
  });
});

describe('construct realm — composer + comparator (real compose)', () => {
  let composed;
  beforeAll(() => {
    // Compose a SMALL realm at a fixed seed — real placement, deterministic. The composer is
    // the S6 substrate ("places everything, canonizes nothing").
    composed = composeInstantWorld({ seed: 'surveyor-s6-pin', basicConfig: { realmSize: 'small', tone: 'realistic_regional' }, name: 'Pin Realm' });
  }, 60_000);

  it('CANONIZES NOTHING until commit — spatialCanonVersion 0, no spatialDigest (PIN 2)', () => {
    const ws = composed.campaign?.worldState || {};
    // members ARE placed + canon-phase, but the REALM's spatial canon is left unfrozen.
    expect(composed.settlements.length).toBeGreaterThan(0);
    expect(ws.spatialCanonVersion || 0).toBe(0);
    expect(ws.spatialDigest == null).toBe(true);
    // the map is a PLAN awaiting materialization, not frozen geometry.
    expect(composed.campaign?.mapState?.pendingMapGen).toBe(true);
  });

  it('the comparator generalizes to realm scale — aggregate posture vs constraints (PIN 3)', () => {
    const members = composed.settlements;
    // derive the realm's aggregate band for one dimension, then confirm the comparator agrees.
    const sums = {};
    for (const s of members) {
      const st = deriveSystemState(s.settlement || s);
      for (const d of CONSTRAINT_DIMENSIONS) {
        const v = st[d]?.value;
        if (typeof v === 'number') sums[d] = (sums[d] || 0) + v;
      }
    }
    const dim = CONSTRAINT_DIMENSIONS.find((d) => typeof sums[d] === 'number') || 'resilience';
    const avgBand = coarseBand(sums[dim] / members.length);
    const other = avgBand === 'high' ? 'low' : 'high';
    expect(compareRealmToConstraints(members, { [dim]: avgBand })).toEqual([]);      // matches ⇒ no deviation
    const dev = compareRealmToConstraints(members, { [dim]: other });
    expect(dev).toHaveLength(1);
    expect(dev[0]).toMatchObject({ dimension: dim, target: other, actual: avgBand });
  });

  it('an empty realm yields no deviations (never a throw)', () => {
    expect(compareRealmToConstraints([], { resilience: 'high' })).toEqual([]);
  });
});

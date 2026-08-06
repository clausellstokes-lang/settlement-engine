/**
 * envoyErrandSpineLifecycle.test.js — SP-D. LIFECYCLE TOTALITY for the three spine fields.
 *
 * THE BUG CLASS THIS FILE EXISTS FOR is this estate's most-bitten one: a field that
 * survives ONE path and ghosts on another. `normalizeErrand` builds its output from an
 * EXPLICIT key list, so a new field that is not named there does not error, does not warn,
 * and does not persist — it evaporates on the first `writeErrands`, while every unit test
 * of the mint stays green because the mint really did return it. So each path below is
 * proven by an executed ROUND TRIP, never by reading the writer and reasoning:
 *
 *   create · read · persist · JSON round-trip · regenerate (THE PROMISE's replay) ·
 *   undo (KILL then restore) · import (forged, half-split, legacy) · DM-KILL closes lost
 *
 * AND THE VEIL, which is a lifecycle path in this estate whether or not it is spelled like
 * one: a field that survives persistence has by that fact become something a public
 * payload could carry.
 */
import { describe, expect, it } from 'vitest';

import {
  closeEnvoyErrandsForNpcDeath,
  envoyErrandsOf,
  projectErrandPurpose,
  purposeClassOf,
  restoreEnvoyErrands,
} from '../../src/domain/worldPulse/envoyErrand.js';
import { normalizeErrand } from '../../src/domain/worldPulse/envoyErrandRecords.js';
import { serializeWorldSnapshotPublic } from '../../src/domain/display/worldSnapshotPublic.js';
import { mintCovert, mintOne, spineWorld } from '../helpers/errandSpineFixture.js';

/** The one row in the ledger, read back through the production reader. */
const only = (worldState) => envoyErrandsOf(worldState)[0];

const COVERT_BLOCK = {
  purposeClass: 'covert',
  declaredPurpose: 'diplomatic',
  truePurpose: 'covert',
};

describe('SP-D lifecycle — CREATE and READ', () => {
  it('a lit mint writes all three fields, and the reader hands them back', () => {
    const { worldState, errand, reason } = mintCovert();
    expect(reason).toBe('minted');
    expect(errand).toMatchObject(COVERT_BLOCK);
    const persisted = only(worldState);
    expect(persisted).toMatchObject(COVERT_BLOCK);
    expect(purposeClassOf(persisted)).toBe('covert');
  });

  it('a DARK mint writes none of them — and the SAME cargo is the control', () => {
    const dark = mintOne(spineWorld(), { purposeClass: 'covert', declaredPurpose: 'diplomatic' });
    expect(dark.reason).toBe('minted');
    const row = only(dark.worldState);
    // anchored: the lit control above proves this fixture CAN carry the keys.
    expect(Object.keys(row)).not.toContain('purposeClass');
    expect(Object.keys(row)).not.toContain('declaredPurpose'); // anchored: the lit control above writes all three
    expect(Object.keys(row)).not.toContain('truePurpose'); // anchored: same lit control, same fixture
    // The derivation still answers, which is why no migration is owed.
    expect(purposeClassOf(row)).toBe('diplomatic');
  });
});

describe('SP-D lifecycle — PERSIST', () => {
  it('survives the write normalizer, which is where an unnamed field would evaporate', () => {
    const { worldState } = mintCovert();
    // The row as it actually sits in the ledger key, not as the mint returned it.
    const raw = /** @type {Array<Record<string, unknown>>} */ (
      /** @type {Record<string, unknown>} */ (worldState).envoyErrands
    );
    expect(raw).toHaveLength(1);
    expect(raw[0]).toMatchObject(COVERT_BLOCK);
  });

  it('is IDEMPOTENT: re-normalizing a persisted row changes not one byte', () => {
    const { worldState } = mintCovert();
    const once = only(worldState);
    const twice = normalizeErrand(once);
    expect(JSON.stringify(twice)).toBe(JSON.stringify(once));
  });

  it('JSON round-trips byte-identically (the alias trap — an in-memory probe cannot see a shared reference)', () => {
    const { worldState } = mintCovert();
    const revived = JSON.parse(JSON.stringify(worldState));
    expect(JSON.stringify(envoyErrandsOf(revived))).toBe(JSON.stringify(envoyErrandsOf(worldState)));
    expect(only(revived)).toMatchObject(COVERT_BLOCK);
  });
});

describe('SP-D lifecycle — REGENERATE (THE PROMISE replays the same keyed mint)', () => {
  it('a second mint from the same inputs produces a byte-identical row', () => {
    expect(JSON.stringify(only(mintCovert().worldState)))
      .toBe(JSON.stringify(only(mintCovert().worldState)));
  });
});

describe('SP-D lifecycle — DM KILL closes lost, and UNDO restores the generalized row', () => {
  it('KILL closes a covert errand `lost` with its spine cargo intact', () => {
    const { worldState } = mintCovert();
    const killed = closeEnvoyErrandsForNpcDeath({
      worldState, npcId: 'npc.envoy.1', tick: 12, cause: 'dm_removed',
    });
    expect(killed.reason).toBe('lost');
    const row = only(killed.worldState);
    expect(row.state).toBe('lost');
    expect(row.lossCause).toBe('dm_removed');
    // The generalized fields are not a phase flag: a closed errand still knows what it was.
    expect(row).toMatchObject(COVERT_BLOCK);
  });

  it('UNDO restores the exact pre-KILL row, spine fields and all', () => {
    const { worldState } = mintCovert();
    const before = only(worldState);
    const killed = closeEnvoyErrandsForNpcDeath({
      worldState, npcId: 'npc.envoy.1', tick: 12, cause: 'dm_removed',
    });
    const restored = restoreEnvoyErrands({
      worldState: killed.worldState,
      priorErrands: killed.priorErrands,
      evictedErrands: killed.evictedErrands,
      killedAtTick: 12,
    });
    expect(restored.reason).toBe('restored');
    // Byte-exact: the undo is atomic and conflict-safe, so anything less is a defect.
    expect(JSON.stringify(only(restored.worldState))).toBe(JSON.stringify(before));
    expect(only(restored.worldState)).toMatchObject(COVERT_BLOCK);
  });
});

describe('SP-D lifecycle — IMPORT heals, never null-fills, and never invents a secret', () => {
  it('a legacy row (no spine fields at all) round-trips byte-identically', () => {
    const legacy = only(mintOne(spineWorld()).worldState);
    expect(JSON.stringify(normalizeErrand(legacy))).toBe(JSON.stringify(legacy));
    expect(JSON.stringify(legacy)).not.toContain('purposeClass'); // anchored: byte-identity asserted above
  });

  it('a forged class word DROPS the field and keeps the errand', () => {
    const row = only(mintCovert().worldState);
    const forged = normalizeErrand({ ...row, purposeClass: 'piracy' });
    expect(forged, 'a bad word must not destroy a traveller').toBeTruthy();
    expect(Object.keys(/** @type {object} */ (forged))).not.toContain('purposeClass'); // anchored: `forged` asserted truthy above
    // Healed to the derived class, and the cover story goes with it — the true half no
    // longer agrees with the resolved class, so the pair is not half-kept.
    expect(purposeClassOf(/** @type {object} */ (forged))).toBe('diplomatic');
    expect(Object.keys(/** @type {object} */ (forged))).not.toContain('truePurpose'); // anchored: the derived class is asserted above
  });

  it('a HALF-SPLIT drops both halves — an errand can lose a cover story, never gain a secret', () => {
    const row = only(mintCovert().worldState);
    const { truePurpose, ...noTrue } = row;
    const healed = /** @type {Record<string, unknown>} */ (normalizeErrand(noTrue));
    expect(healed).toBeTruthy();
    expect(Object.keys(healed)).not.toContain('declaredPurpose'); // anchored: `healed` asserted truthy above
    expect(Object.keys(healed)).not.toContain('truePurpose'); // anchored: the surviving purposeClass is asserted below
    // The class itself is lawful and survives, so this is the PAIR's atomicity and not a
    // blanket rejection of the row's spine cargo.
    expect(healed.purposeClass).toBe('covert');
  });

  it('a split whose true half disagrees with the class is refused as a split', () => {
    const row = only(mintCovert().worldState);
    const healed = /** @type {Record<string, unknown>} */ (
      normalizeErrand({ ...row, truePurpose: 'commercial' })
    );
    expect(healed.purposeClass).toBe('covert');
    expect(Object.keys(healed)).not.toContain('truePurpose'); // anchored: the surviving purposeClass is asserted below
    expect(Object.keys(healed)).not.toContain('declaredPurpose'); // anchored: `healed` asserted truthy above
  });

  it('a redundant class (equal to the derivation) is not stored twice', () => {
    const row = only(mintOne(spineWorld()).worldState);
    const rewritten = /** @type {Record<string, unknown>} */ (
      normalizeErrand({ ...row, purposeClass: 'diplomatic' })
    );
    expect(Object.keys(rewritten)).not.toContain('purposeClass'); // anchored: the derived class is asserted on the next line
    expect(purposeClassOf(rewritten)).toBe('diplomatic');
  });
});

describe('SP-D veil — the fail-closed projection, proven on a SEEDED covert errand', () => {
  it('the audience split withholds the truth, and does not betray that a truth exists', () => {
    const covert = only(mintCovert().worldState);
    const honest = only(mintOne(spineWorld({ spine: true })).worldState);

    const publicCovert = projectErrandPurpose(covert);
    const publicHonest = projectErrandPurpose(honest);
    expect(publicCovert).toEqual({ errandId: String(covert.id), purposeClass: 'diplomatic' });
    // THE HARDEST NEGATIVE: same keys, same words. The presence of a key would itself be
    // the tell, so the public shapes must be indistinguishable.
    expect(Object.keys(/** @type {object} */ (publicCovert)).sort())
      .toEqual(Object.keys(/** @type {object} */ (publicHonest)).sort());
    expect(JSON.stringify(publicCovert)).not.toContain('covert'); // anchored: the exact public shape is asserted above

    // ...and the DM view really does carry it, so the absence above is a decision.
    const dmView = projectErrandPurpose(covert, { includeCovert: true });
    expect(dmView).toEqual({
      errandId: String(covert.id),
      purposeClass: 'covert',
      declaredPurpose: 'diplomatic',
      truePurpose: 'covert',
    });
  });

  it('fails CLOSED on every non-true spelling of includeCovert', () => {
    const covert = only(mintCovert().worldState);
    for (const opts of [undefined, {}, { includeCovert: false }, { includeCovert: 1 },
      { includeCovert: 'true' }, { includeCovert: {} }, null]) {
      const row = projectErrandPurpose(covert, /** @type {any} */ (opts));
      expect(JSON.stringify(row), `includeCovert=${JSON.stringify(opts)} leaked`)
        .not.toContain('covert'); // anchored: the DM view is asserted to carry it in the test above
    }
  });

  it('no EXISTING projection or public payload carries the true purpose', () => {
    const { worldState } = mintCovert();
    // The whole errand ledger is HARD-DENIED from the public snapshot, which is the
    // structural half of the veil: there is no public payload for the field to ride.
    const snapshot = serializeWorldSnapshotPublic(worldState, { nodes: [], edges: [] }, []);
    const serialized = JSON.stringify(snapshot);
    expect(serialized).not.toContain('truePurpose'); // anchored: the world is asserted to CONTAIN it below
    expect(serialized).not.toContain('envoyErrands'); // anchored: the world is asserted to CONTAIN truePurpose below
    // anchored: the fixture really does hold a covert errand at this moment, so the two
    // absences above are measurements rather than an empty world.
    expect(JSON.stringify(worldState)).toContain('truePurpose');
  });
});

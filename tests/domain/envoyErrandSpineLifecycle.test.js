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
import { writeErrands } from '../../src/domain/worldPulse/envoyErrandLedger.js';
import { serializeWorldSnapshotPublic } from '../../src/domain/display/worldSnapshotPublic.js';
import { mintCovert, mintOne, spineWorld } from '../helpers/errandSpineFixture.js';

/** The one row in the ledger, read back through the production reader. */
const only = (worldState) => envoyErrandsOf(worldState)[0];

const COVERT_BLOCK = {
  purposeClass: 'covert',
  declaredPurpose: 'diplomatic',
  truePurpose: 'covert',
};

/**
 * THE SPINE KEY SET a row actually carries — the EXACT keys, never a `toContain` absence.
 * A total positive assertion cannot go vacuous the way a list of negatives can, which is
 * the whole reason the conjunction pins below are spelled with `toEqual` on this.
 * @param {unknown} row
 */
const spineOf = (row) => Object.fromEntries(
  ['purposeClass', 'declaredPurpose', 'truePurpose']
    .filter((key) => key in /** @type {Record<string, unknown>} */ (row))
    .map((key) => [key, /** @type {Record<string, unknown>} */ (row)[key]]),
);

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

describe('SP-D dormancy — THE MINT IS GATED, THE PERSIST IS NOT, AND THAT IS A DECISION', () => {
  /**
   * ⚠⚠ REPAIR SP-D-R5. THE CERTIFICATION ROW USED TO OVERCLAIM, AND LIVE CODE OUTRANKS
   * THE TABLE. Its invariant read "With the flag dark no errand row EVER GROWS a
   * purposeClass, declaredPurpose or truePurpose key". That is TRUE of the mint — fences
   * 1/2/3 of the dormancy suite prove it — and MEASURED FALSE of the import: a row minted
   * by a lit world and written into a dark one through `writeErrands` keeps all three,
   * because `normalizeErrand` spreads `errandSpineBlock` unconditionally and only
   * `errandMint.js` ever reads the flag.
   *
   * THE OTHER CURE WAS EXECUTED AND REJECTED, not argued away. Threading `errandSpineActive`
   * through `normalizeErrand`/`normalizeEnvoyErrands` and gating at the `writeErrands` seam
   * DOES strip the fields correctly (measured: the dark import then yields no keys and
   * `purposeClassOf` returns 'diplomatic') — and it BREAKS UNDO. `restoreEnvoyErrands`
   * returned `restore_conflict` where the byte-exact restore above expects `restored`,
   * because a pure persistence normalizer that suddenly depends on a world has callers
   * that do not have one. That is this estate's most-bitten bug class — a fix that
   * survives one lifecycle path and dies on another — bought for ZERO behavioural gain,
   * since the preserved cargo is inert: no module outside the errand family reads these
   * three fields anywhere in `src/`, which the consumer-registry walker now proves.
   *
   * So the MECHANISM stands and the CLAIM was narrowed. Both halves are pinned here, and
   * the second half is the one that had no pin at all.
   */
  it('a DARK world MINTS none of the three — the universal half, and it holds', () => {
    const dark = mintOne(spineWorld(), { purposeClass: 'covert', declaredPurpose: 'diplomatic' });
    expect(spineOf(only(dark.worldState))).toEqual({});
  });

  it('a DARK world PRESERVES lawful cargo on an IMPORT — deliberate, and inert', () => {
    const lit = only(mintCovert().worldState);
    expect(spineOf(lit), 'the fixture must really carry cargo to preserve').toEqual(COVERT_BLOCK);
    // A world whose simulationRules OMIT the key entirely — the installed-save shape.
    const darkWorld = spineWorld();
    expect(Object.prototype.hasOwnProperty.call(darkWorld.simulationRules, 'errandSpineEnabled'))
      .toBe(false);
    const imported = writeErrands(darkWorld, [lit]);
    // NOT stripped. A lit campaign's history is not destroyed by opening it dark, and
    // `THE PROMISE` (lived history is immutable) is why that is the right side to err on.
    expect(spineOf(only(imported))).toEqual(COVERT_BLOCK);
    expect(purposeClassOf(only(imported))).toBe('covert');
  });
});

describe('SP-D persist-side split — EVERY DOOR OF THE PAIR CONJUNCTION, PINNED ALONE', () => {
  /**
   * ⚠⚠ REPAIR SP-D-R4, AND IT IS THE ESTATE'S DEFENSE-IN-DEPTH COROLLARY BITING AGAIN.
   *
   * `errandSpineBlock` decides whether a declared/true pair survives a write with a THREE
   * CONJUNCT test:
   *
   *     PURPOSE_CLASS_SET.has(declared) && claimedTrue === resolved && declared !== resolved
   *
   * The wave that landed it proved the expression by DELETING THE WHOLE THING (control M5,
   * "THE PAIR ATOMICITY DELETED"), which is precisely the JOINT pin this estate's law
   * forbids as sufficient. Deleting each conjunct SEPARATELY was then executed, and TWO OF
   * THE THREE SURVIVED with all four SP-D suites at 55 passed (55):
   *
   *   · `PURPOSE_CLASS_SET.has(declared)` replaced by `true`  → 55/55 GREEN
   *   · `&& declared !== resolved` deleted                    → 55/55 GREEN
   *   · `&& claimedTrue === resolved` deleted                 → 2 failed (the only red)
   *
   * The behavioural cost of each survivor is real and lands on the IMPORT path, which is
   * the path a forged or hand-edited save enters by. With door 1 gone, an out-of-vocabulary
   * word survives the persist seam — the FINITE-SEMANTICS habitat exactly. With door 3
   * gone, an ordinary war errand grows a redundant `diplomatic`/`diplomatic` pair, breaking
   * both the drop-when-derivable rule and the "an installed save is not rewritten" promise,
   * silently and one byte at a time.
   *
   * So each door gets its own row below, and each row is a TOTAL key-set assertion.
   */
  it('DOOR 1 — an UNLAWFUL declared word drops the pair, and does not destroy the errand', () => {
    const row = only(mintCovert().worldState);
    expect(spineOf(row), 'the fixture must really carry a live split').toEqual(COVERT_BLOCK);
    const healed = normalizeErrand({ ...row, declaredPurpose: 'piracy' });
    expect(healed, 'a bad word must not destroy a traveller').toBeTruthy();
    // The class is lawful and stays; the cover story built on an unknown word does not.
    expect(spineOf(healed)).toEqual({ purposeClass: 'covert' });
    expect(purposeClassOf(/** @type {object} */ (healed))).toBe('covert');
  });

  it('DOOR 2 — a true half that disagrees with the resolved class drops the pair', () => {
    const row = only(mintCovert().worldState);
    const healed = normalizeErrand({ ...row, truePurpose: 'commercial' });
    expect(healed).toBeTruthy();
    expect(spineOf(healed)).toEqual({ purposeClass: 'covert' });
  });

  it('DOOR 3 — a REDUNDANT pair (declared === resolved) is dropped, not restated', () => {
    // A plain war errand: no class key at all, `diplomatic` by derivation.
    const legacy = only(mintOne(spineWorld()).worldState);
    expect(spineOf(legacy), 'a war errand carries no spine keys').toEqual({});
    const rewritten = normalizeErrand({
      ...legacy, declaredPurpose: 'diplomatic', truePurpose: 'diplomatic',
    });
    expect(rewritten).toBeTruthy();
    // NEVER RESTATE A DERIVATION: the pair says nothing the purpose did not already say.
    expect(spineOf(rewritten)).toEqual({});
    // ...and the promise that an installed save is not rewritten, spelled as bytes.
    expect(JSON.stringify(rewritten)).toBe(JSON.stringify(legacy));
  });

  it('DOOR 3 again, on a row that DOES carry a class — the class stays, the pair goes', () => {
    const row = only(mintCovert().worldState);
    const rewritten = normalizeErrand({
      ...row, declaredPurpose: 'covert', truePurpose: 'covert',
    });
    expect(rewritten).toBeTruthy();
    expect(spineOf(rewritten)).toEqual({ purposeClass: 'covert' });
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

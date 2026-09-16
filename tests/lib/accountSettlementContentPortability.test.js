import { describe, expect, test } from 'vitest';

import {
  makeCampaignContentBinding,
} from '../../src/domain/content/contentEnvironment.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  admitSettlementContentProvenance,
  buildSettlementContentProvenance,
} from '../../src/domain/content/settlementContentProvenance.js';
import {
  accountCampaignBindingDestinations,
  remapAccountSettlementContentProvenance,
  remapAccountSettlementLivingContentRoster,
} from '../../src/lib/accountSettlementContentPortability.js';
import {
  buildImportedAccountArchiveIdentityMap,
} from '../../src/lib/accountContentPortability.js';
import {
  LIVING_CONTENT_ROSTER_SCHEMA_VERSION,
  buildLivingContentRoster,
} from '../../src/domain/content/livingContentRoster.js';
import {
  LIVING_CONTENT_LAW_CONFIG_KEY,
  ROSTER_LIVING_CONTENT_LAW_VERSION,
} from '../../src/domain/content/livingContentLawVersion.js';
import {
  customContentReferencePack,
  identifyCustomContentPack,
} from '../fixtures/customContentReferencePack.js';

function sourceFixture() {
  const sourceItem = {
    name: 'Archive Hall',
    localUid: 'lu_archive_hall',
    definitionId: 'source-hall',
    revisionId: 'source-hall-r3',
  };
  const sourceBinding = makeCampaignContentBinding({
    institutions: [sourceItem],
  }, {
    environmentId: 'source-environment',
    environmentRevisionId: 'source-environment-r3',
  });
  const sourceProvenance = buildSettlementContentProvenance({
    institutions: [{
      name: sourceItem.name,
      source: 'custom',
      customDefinitionId: sourceItem.definitionId,
    }],
  }, {
    institutions: [{
      ...sourceItem,
      contentHash: sourceBinding.resolvedDefinitions[0].contentHash,
    }],
  }, {
    scope: 'campaign',
    environment: sourceBinding.environment,
    bindingHash: sourceBinding.bindingHash,
  });
  const destinationHash = contentRevisionHash('institutions', {
    name: sourceItem.name,
    localUid: 'lu_received_hall',
  });
  const destinationBinding = makeCampaignContentBinding({
    institutions: [{
      name: sourceItem.name,
      localUid: 'lu_received_hall',
      definitionId: 'received-hall',
      revisionId: 'received-hall-r1',
    }],
  }, {
    source: sourceBinding.environment.source,
    environmentId: 'received-environment',
    environmentRevisionId: 'received-environment-r3',
    packVersions: sourceBinding.environment.packVersions,
    tunables: sourceBinding.environment.tunables,
    visualSelection: sourceBinding.environment.visualSelection,
  });
  const destinationEnvironmentHash =
    destinationBinding.environment.environmentHash;
  const receipt = {
    definitionIds: [{
      sourceId: 'source-hall',
      destinationId: 'received-hall',
    }],
    revisionIds: [{
      sourceId: 'source-hall-r3',
      destinationId: 'received-hall-r1',
      destinationContentHash: destinationHash,
    }],
    localUids: [{
      sourceId: 'lu_archive_hall',
      destinationId: 'lu_received_hall',
    }],
    packIds: [],
    environmentIds: [{
      sourceId: 'source-environment',
      destinationId: 'received-environment',
    }],
    environmentRevisionIds: [{
      sourceId: 'source-environment-r3',
      destinationId: 'received-environment-r3',
      destinationEnvironmentHash,
    }],
  };
  const joined = buildImportedAccountArchiveIdentityMap({
    namespace: 'account-content:test',
    identityMap: receipt,
  });
  return {
    sourceBinding,
    sourceProvenance,
    destinationHash,
    destinationEnvironmentHash,
    identityMap: joined.identityMap,
  };
}

describe('account settlement content provenance portability', () => {
  test('rebuilds definition, revision, local uid, hash, environment, and binding joins', () => {
    const fixture = sourceFixture();
    const bindingDestinations = accountCampaignBindingDestinations(
      [{ contentBinding: fixture.sourceBinding }],
      fixture.identityMap,
    );

    const remapped = remapAccountSettlementContentProvenance(
      fixture.sourceProvenance,
      fixture.identityMap,
      bindingDestinations,
    );

    expect(remapped.ok).toBe(true);
    expect(admitSettlementContentProvenance(remapped.provenance).ok).toBe(true);
    const destinationBinding = bindingDestinations.get(
      fixture.sourceBinding.bindingHash,
    );
    expect(remapped.provenance).toMatchObject({
      scope: 'campaign',
      bindingHash: destinationBinding.bindingHash,
      environment: {
        environmentId: destinationBinding.environment.environmentId,
        environmentRevisionId:
          destinationBinding.environment.environmentRevisionId,
        environmentHash: destinationBinding.environment.environmentHash,
      },
      materializedDefinitions: [{
        definitionId: 'received-hall',
        revisionId: 'received-hall-r1',
        localUid: 'lu_received_hall',
        contentHash: fixture.destinationHash,
      }],
    });
    expect(remapped.provenance.receiptHash)
      .not.toBe(fixture.sourceProvenance.receiptHash);
  });

  test('clears a detached campaign hash while retaining receipt-backed exact joins', () => {
    const fixture = sourceFixture();
    const remapped = remapAccountSettlementContentProvenance(
      fixture.sourceProvenance,
      fixture.identityMap,
    );

    expect(remapped).toMatchObject({
      ok: true,
      provenance: {
        scope: 'standalone',
        bindingHash: null,
        environment: {
          environmentId: 'received-environment',
          environmentRevisionId: 'received-environment-r3',
          environmentHash: fixture.destinationEnvironmentHash,
        },
      },
    });
  });

  test('refuses to preserve source ids when the archive receipt is incomplete', () => {
    const fixture = sourceFixture();
    const empty = buildImportedAccountArchiveIdentityMap({
      namespace: 'account-content:test',
      identityMap: {
        definitionIds: [],
        revisionIds: [],
        localUids: [],
        packIds: [],
        environmentIds: [],
        environmentRevisionIds: [],
      },
    });

    expect(remapAccountSettlementContentProvenance(
      fixture.sourceProvenance,
      empty.identityMap,
    )).toMatchObject({
      ok: false,
      code: 'settlement_content_provenance_identity_incomplete',
    });
  });

  test('refuses to erase an environment join when only that receipt map is incomplete', () => {
    const fixture = sourceFixture();
    const incompleteEnvironment = {
      ...fixture.identityMap,
      environmentIds: new Map(),
      environmentRevisionIds: new Map(),
      environmentHashes: new Map(),
    };

    expect(remapAccountSettlementContentProvenance(
      fixture.sourceProvenance,
      incompleteEnvironment,
    )).toMatchObject({
      ok: false,
      code: 'settlement_content_provenance_environment_incomplete',
    });
  });
});

// ── O-11 PATH 2 — THE LIVING-CONTENT ROSTER'S REMAP (lane L-MAT) ─────────────
// The roster and the provenance receipt are minted side by side in the pipeline
// and are treated alike here: resolve every identity through the archive-backed
// map, or drop the whole record. These arms are the algebra; the two lifecycle
// paths (a v3 archive envelope, and a legacy content-pack envelope whose identity
// map is still empty at Phase 4) are proved in tests/store/accountImportSlice.
function rosterFixture(overrides = {}) {
  const fixture = sourceFixture();
  const sourceHash = fixture.sourceProvenance.materializedDefinitions[0].contentHash;
  const roster = {
    schemaVersion: LIVING_CONTENT_ROSTER_SCHEMA_VERSION,
    buckets: {
      deities: [{
        source: 'custom',
        isCustom: true,
        customDefinitionCategory: 'deities',
        localUid: 'lu_archive_hall',
        customDefinitionId: 'source-hall',
        customDefinitionRevisionId: 'source-hall-r3',
        customDefinitionContentHash: sourceHash,
        // The projection's own fallback: no authored fingerprint, so the row
        // carries the SOURCE content hash under a second key.
        customDefinitionFingerprint: sourceHash,
        name: 'Aster of the Kiln',
        ...overrides,
      }],
    },
  };
  return { ...fixture, roster, sourceHash };
}

describe('account settlement living-content roster portability', () => {
  test('rewrites every account-scoped identifier and leaves the authored fields alone', () => {
    const fixture = rosterFixture();
    const remapped = remapAccountSettlementLivingContentRoster(
      fixture.roster,
      fixture.identityMap,
    );
    expect(remapped.ok).toBe(true);
    const row = remapped.roster.buckets.deities[0];
    expect(row).toMatchObject({
      customDefinitionId: 'received-hall',
      customDefinitionRevisionId: 'received-hall-r1',
      customDefinitionContentHash: fixture.destinationHash,
      localUid: 'lu_received_hall',
      // Authored + classification fields ride through untouched.
      source: 'custom',
      isCustom: true,
      customDefinitionCategory: 'deities',
      name: 'Aster of the Kiln',
    });
    // The schema version is CARRIED, and it agrees with the builder's constant —
    // the pin the remapper deliberately does not make with a static import.
    expect(remapped.roster.schemaVersion).toBe(LIVING_CONTENT_ROSTER_SCHEMA_VERSION);
    // Non-vacuity: the source really did carry the ids we claim were rewritten.
    expect(fixture.roster.buckets.deities[0].customDefinitionId).toBe('source-hall');
  });

  test('the fingerprint is RE-DERIVED from the destination hash, never carried', () => {
    const fixture = rosterFixture();
    const row = remapAccountSettlementLivingContentRoster(
      fixture.roster,
      fixture.identityMap,
    ).roster.buckets.deities[0];
    expect(row.customDefinitionFingerprint).toBe(fixture.destinationHash);
    // THE TRAP THIS ARM EXISTS FOR: the source hash must not survive anywhere in
    // the row, under any key. Carrying the fingerprint verbatim would leave it.
    expect(Object.values(row).includes(fixture.sourceHash)).toBe(false);
    // …and the anchor that the trap was real: the source row DID carry it twice.
    expect(fixture.roster.buckets.deities[0].customDefinitionFingerprint)
      .toBe(fixture.sourceHash);
  });

  test('an INDEPENDENT source fingerprint is dropped rather than carried', () => {
    const fixture = rosterFixture({ customDefinitionFingerprint: 'authored-fingerprint' });
    const row = remapAccountSettlementLivingContentRoster(
      fixture.roster,
      fixture.identityMap,
    ).roster.buckets.deities[0];
    expect(Object.hasOwn(row, 'customDefinitionFingerprint')).toBe(false);
  });

  test('customDefinitionVersion remaps through revisionNumbers, and drops when unresolvable', () => {
    const unresolvable = rosterFixture({ customDefinitionVersion: 3 });
    // sourceFixture()'s receipt carries no destinationRevisionNumber, so the
    // destination ordinal is unknown and the field must not be asserted.
    const dropped = remapAccountSettlementLivingContentRoster(
      unresolvable.roster,
      unresolvable.identityMap,
    ).roster.buckets.deities[0];
    expect(Object.hasOwn(dropped, 'customDefinitionVersion')).toBe(false);

    // …and the paired positive, so the drop above is a decision and not a
    // function that never sets the field.
    const numbered = buildImportedAccountArchiveIdentityMap({
      namespace: 'account-content:test',
      identityMap: {
        definitionIds: [{ sourceId: 'source-hall', destinationId: 'received-hall' }],
        revisionIds: [{
          sourceId: 'source-hall-r3',
          destinationId: 'received-hall-r1',
          destinationContentHash: unresolvable.destinationHash,
          destinationRevisionNumber: 7,
        }],
        localUids: [{ sourceId: 'lu_archive_hall', destinationId: 'lu_received_hall' }],
        packIds: [], environmentIds: [], environmentRevisionIds: [],
      },
    });
    const kept = remapAccountSettlementLivingContentRoster(
      rosterFixture({ customDefinitionVersion: 3 }).roster,
      numbered.identityMap,
    ).roster.buckets.deities[0];
    expect(kept.customDefinitionVersion).toBe(7);
  });

  test('a bucket is RE-SORTED on the destination id, not the source order', () => {
    const fixture = sourceFixture();
    const secondHash = contentRevisionHash('institutions', {
      name: 'Second', localUid: 'lu_received_second',
    });
    const joined = buildImportedAccountArchiveIdentityMap({
      namespace: 'account-content:test',
      identityMap: {
        // SOURCE order a < b; DESTINATION order reverses it.
        definitionIds: [
          { sourceId: 'src-a', destinationId: 'dst-z' },
          { sourceId: 'src-b', destinationId: 'dst-a' },
        ],
        revisionIds: [
          { sourceId: 'src-a-r1', destinationId: 'dst-z-r1', destinationContentHash: fixture.destinationHash },
          { sourceId: 'src-b-r1', destinationId: 'dst-a-r1', destinationContentHash: secondHash },
        ],
        localUids: [], packIds: [], environmentIds: [], environmentRevisionIds: [],
      },
    });
    const roster = {
      schemaVersion: LIVING_CONTENT_ROSTER_SCHEMA_VERSION,
      buckets: {
        deities: [
          { customDefinitionId: 'src-a', customDefinitionRevisionId: 'src-a-r1' },
          { customDefinitionId: 'src-b', customDefinitionRevisionId: 'src-b-r1' },
        ],
      },
    };
    const remapped = remapAccountSettlementLivingContentRoster(roster, joined.identityMap);
    expect(remapped.ok).toBe(true);
    expect(remapped.roster.buckets.deities.map(row => row.customDefinitionId))
      .toEqual(['dst-a', 'dst-z']);
  });

  test('RESOLVE-OR-DROP: one unmapped identity refuses the WHOLE roster', () => {
    const fixture = rosterFixture();
    fixture.roster.buckets.deities.push({
      customDefinitionId: 'stranger',
      customDefinitionRevisionId: 'stranger-r1',
    });
    const remapped = remapAccountSettlementLivingContentRoster(
      fixture.roster,
      fixture.identityMap,
    );
    expect(remapped.ok).toBe(false);
    expect(remapped.code).toBe('settlement_living_content_roster_identity_incomplete');
    // The anchor: the SAME roster without the stranger resolves, so the refusal
    // is about the unmapped row and not about the fixture being unreadable.
    expect(remapAccountSettlementLivingContentRoster(
      rosterFixture().roster, fixture.identityMap,
    ).ok).toBe(true);
  });

  test('an EMPTY identity map (the legacy content-pack envelope at Phase 4) refuses', () => {
    const fixture = rosterFixture();
    const empty = buildImportedAccountArchiveIdentityMap({
      namespace: 'account-content:test',
      identityMap: {
        definitionIds: [], revisionIds: [], localUids: [],
        packIds: [], environmentIds: [], environmentRevisionIds: [],
      },
    });
    const remapped = remapAccountSettlementLivingContentRoster(
      fixture.roster,
      empty.identityMap,
    );
    expect(remapped.ok).toBe(false);
    expect(remapped.code).toBe('settlement_living_content_roster_identity_incomplete');
  });

  test('a null roster is a no-op, and an unreadable shape refuses', () => {
    expect(remapAccountSettlementLivingContentRoster(null, sourceFixture().identityMap))
      .toEqual({ ok: true, roster: null });
    const map = sourceFixture().identityMap;
    for (const bad of [
      { buckets: { deities: [] } },
      { schemaVersion: 0, buckets: { deities: [] } },
      { schemaVersion: 1 },
      { schemaVersion: 1, buckets: {} },
      { schemaVersion: 1, buckets: { deities: 'not-an-array' } },
    ]) {
      const remapped = remapAccountSettlementLivingContentRoster(bad, map);
      expect(remapped.ok, `shape ${JSON.stringify(bad)} must refuse`).toBe(false);
      expect(remapped.code).toBe('settlement_living_content_roster_shape_unreadable');
    }
  });

  // ── DEF-5 (lane L-MAT-FIX) — A LOCAL-ONLY ROW IS RESOLVED, NOT INCOMPLETE ────
  // `rosterRow` admits a definition on `localUid || customDefinitionId`, and the
  // identity projection emits every `customDefinition*` key OPTIONALLY. So a
  // definition that lives only in the author's local library — never committed to
  // the immutable ledger — produces a row with a localUid and NO account-scoped
  // identity. Reading that as "unresolved identity" dropped the WHOLE roster of any
  // world whose scope touched one such definition, which is the exact population
  // resolve-or-drop exists to preserve. Every fixture above sets
  // `customDefinitionId`, which is why the defect was green.
  function localOnlyRow(overrides = {}) {
    return {
      source: 'custom',
      isCustom: true,
      customDefinitionCategory: 'deities',
      localUid: 'lu_archive_hall',
      name: 'Local Patron',
      ...overrides,
    };
  }

  test('DEF-5: a LOCAL-ONLY row whose localUid resolves keeps the whole roster', () => {
    const fixture = rosterFixture();
    const roster = {
      schemaVersion: LIVING_CONTENT_ROSTER_SCHEMA_VERSION,
      buckets: { deities: [localOnlyRow()] },
    };
    // Non-vacuity: the localUid really is in the map, so a refusal below could
    // only be the "no account identity ⇒ unresolved" misreading this arm names.
    expect(fixture.identityMap.localUids.get('lu_archive_hall')).toBe('lu_received_hall');
    const remapped = remapAccountSettlementLivingContentRoster(roster, fixture.identityMap);
    expect(
      remapped.ok,
      `a fully localUid-mapped roster was refused: ${remapped.error || ''}`,
    ).toBe(true);
    const row = remapped.roster.buckets.deities[0];
    expect(row.localUid).toBe('lu_received_hall');
    expect(row.name).toBe('Local Patron');
    // It gains no account-scoped identity it never had — an invented
    // `customDefinitionId` would be a claim about a ledger row that does not exist.
    expect(Object.hasOwn(row, 'customDefinitionId')).toBe(false);
    expect(Object.hasOwn(row, 'customDefinitionRevisionId')).toBe(false);
  });

  test('DEF-5: a MIXED roster keeps both kinds of row, re-sorted on the destination key', () => {
    const fixture = rosterFixture();
    const roster = {
      schemaVersion: LIVING_CONTENT_ROSTER_SCHEMA_VERSION,
      buckets: {
        deities: [
          localOnlyRow({ localUid: 'lu_archive_hall', name: 'Local Patron' }),
          {
            ...fixture.roster.buckets.deities[0],
            localUid: undefined,
          },
        ],
      },
    };
    delete roster.buckets.deities[1].localUid;
    const remapped = remapAccountSettlementLivingContentRoster(roster, fixture.identityMap);
    expect(remapped.ok, `mixed roster refused: ${remapped.error || ''}`).toBe(true);
    const rows = remapped.roster.buckets.deities;
    expect(rows).toHaveLength(2);
    // Sorted by `customDefinitionId || localUid`: 'lu_received_hall' < 'received-hall'.
    expect(rows.map(r => r.customDefinitionId || r.localUid))
      .toEqual(['lu_received_hall', 'received-hall']);
  });

  test('DEF-5: an UNRESOLVABLE localUid still refuses the WHOLE roster', () => {
    // The half the ruling keeps. "No account identity" is a different row KIND;
    // "a localUid the receipt never mapped" is a genuine miss, and a roster that
    // half-resolves claims a scope that never existed.
    const fixture = rosterFixture();
    const roster = {
      schemaVersion: LIVING_CONTENT_ROSTER_SCHEMA_VERSION,
      buckets: { deities: [localOnlyRow({ localUid: 'lu_never_seen' })] },
    };
    expect(remapAccountSettlementLivingContentRoster(roster, fixture.identityMap))
      .toMatchObject({
        ok: false,
        code: 'settlement_living_content_roster_identity_incomplete',
      });
    // …and a row with NEITHER a localUid nor an account id refuses too.
    const anonymous = {
      schemaVersion: LIVING_CONTENT_ROSTER_SCHEMA_VERSION,
      buckets: { deities: [{ source: 'custom', isCustom: true, name: 'Nameless' }] },
    };
    expect(remapAccountSettlementLivingContentRoster(anonymous, fixture.identityMap))
      .toMatchObject({
        ok: false,
        code: 'settlement_living_content_roster_identity_incomplete',
      });
  });

  test('DEF-5: an EMPTY customDefinitionId is not an account identity claim', () => {
    // The membership test reads `customDefinition*` presence, so it must not be
    // fooled by a key present-but-blank — that is the "absent" the projection
    // means, and treating it as a claim would re-open the drop.
    const fixture = rosterFixture();
    const roster = {
      schemaVersion: LIVING_CONTENT_ROSTER_SCHEMA_VERSION,
      buckets: { deities: [localOnlyRow({ customDefinitionId: '', customDefinitionRevisionId: null })] },
    };
    const remapped = remapAccountSettlementLivingContentRoster(roster, fixture.identityMap);
    expect(remapped.ok).toBe(true);
    expect(remapped.roster.buckets.deities[0].localUid).toBe('lu_received_hall');
  });

  test('⭐ the REAL builder\'s output round-trips through this remapper', () => {
    // The agreement arm. The remapper validates the roster structurally rather
    // than importing the builder's constant (a byte decision recorded in its
    // header), so the two are pinned to agree HERE, where the import is free.
    const pack = identifyCustomContentPack(customContentReferencePack());
    const built = buildLivingContentRoster(pack, {
      [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION,
    });
    expect(built, 'the reference pack built no roster — this arm would be vacuous').toBeTruthy();
    expect(built.schemaVersion).toBe(LIVING_CONTENT_ROSTER_SCHEMA_VERSION);

    // Build an identity map that covers exactly the ids the builder emitted.
    const rows = Object.values(built.buckets).flat();
    expect(rows.length).toBeGreaterThan(3);
    const joined = buildImportedAccountArchiveIdentityMap({
      namespace: 'account-content:test',
      identityMap: {
        definitionIds: rows.map((row, index) => ({
          sourceId: row.customDefinitionId, destinationId: `dst-def-${index}`,
        })),
        revisionIds: rows.map((row, index) => ({
          sourceId: row.customDefinitionRevisionId,
          destinationId: `dst-rev-${index}`,
          destinationContentHash: contentRevisionHash('deities', { n: index }),
        })),
        localUids: rows
          .filter(row => typeof row.localUid === 'string' && row.localUid)
          .map((row, index) => ({ sourceId: row.localUid, destinationId: `dst-lu-${index}` })),
        packIds: [], environmentIds: [], environmentRevisionIds: [],
      },
    });
    const remapped = remapAccountSettlementLivingContentRoster(built, joined.identityMap);
    expect(remapped.ok, `the real roster was refused: ${remapped.error || ''}`).toBe(true);
    expect(Object.keys(remapped.roster.buckets).sort())
      .toEqual(Object.keys(built.buckets).sort());
    for (const row of Object.values(remapped.roster.buckets).flat()) {
      expect(String(row.customDefinitionId).startsWith('dst-def-')).toBe(true);
    }
  });
});

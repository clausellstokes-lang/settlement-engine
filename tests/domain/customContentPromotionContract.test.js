/**
 * Honesty and drift checks for the custom-content platform claim boundary.
 *
 * This is intentionally not a "green means the platform is complete" test.
 * It proves that the living architecture and machine-readable contract agree
 * with the source that exists today, including the gates they still withhold.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { CONTENT_STUDIO_STAGE } from '../../src/domain/content/contentDraftSession.js';
import { PACK_BUCKETS } from '../../src/lib/contentPacks.js';

const root = resolve(import.meta.dirname, '../..');
const contract = JSON.parse(readFileSync(
  resolve(root, 'docs/CUSTOM_CONTENT_PROMOTION_CONTRACT.json'),
  'utf8',
));
const architecture = readFileSync(resolve(root, contract.architecture), 'utf8');
const manifest = JSON.parse(readFileSync(
  resolve(root, contract.doctrine.canonicalAuthority),
  'utf8',
));

const IMPLEMENTED_IDS = Object.freeze([
  'CC-MANIFEST',
  'CC-ADMISSION',
  'CC-TRUTH',
  'CC-SEMANTIC-CLAIMS',
  'CC-AUTHORING-FLOW',
  'CC-SAMPLE',
  'CC-USAGE-ECHO',
  'CC-VERSION-PRIMITIVES',
  'CC-COMMAND',
  'CC-PACK-V2',
  'CC-ARCHIVE-PORTABILITY',
  'CC-ACCOUNT-PORTABILITY',
  'CC-CUTOVER-PROTOCOL',
  'CC-CAMPAIGN-BINDING',
  'CC-ENVIRONMENT-MIGRATION',
  'CC-TUNABLE-RUNTIME',
  'CC-HISTORY-UX',
  'CC-VISUAL-BOUNDARY',
  'CC-SUPPLY-CHAIN-ACTIVATION',
  'CC-REVIEWED-DERIVED-PERSISTENCE',
]);

const OPEN_IDS = Object.freeze([
  'CC-CLOUD-CUTOVER',
  'CC-PROVENANCE-COVERAGE',
  'CC-PLATFORM-EVIDENCE',
]);

const DEFERRED_IDS = Object.freeze([
  'CC-MARKETPLACE',
  'CC-GENRE-NEUTRALITY',
  'CC-VISUAL-EXPANSION',
  'CC-ARBITRARY-RULES',
]);

function ids(entries) {
  return entries.map((entry) => entry.id);
}

describe('custom-content platform promotion contract', () => {
  it('withholds the complete-platform claim while integration gates remain open', () => {
    expect(contract.claim).toMatchObject({
      implementationStatus: 'core_capabilities_implemented',
      integrationStatus: 'platform_cutover_incomplete',
      promotionStatus: 'withheld_pending_integration_and_evidence',
      currentDecision: 'withhold_complete_platform_claim',
      publicMarketplaceStatus: 'deferred_by_product_decision',
      genreNeutralityStatus: 'not_claimed',
      arbitraryExecutionStatus: 'prohibited',
    });
    expect(contract.openGates.length).toBeGreaterThan(0);
    expect(contract.promotionRules.allOpenGatesMustBeClosed).toBe(true);
    expect(contract.promotionRules.promotionRequiresSeparateReviewedChange).toBe(true);
  });

  it('pins the intentional implemented, open, and deferred boundary', () => {
    expect(ids(contract.implementedGates)).toEqual(IMPLEMENTED_IDS);
    expect(ids(contract.openGates)).toEqual(OPEN_IDS);
    expect(ids(contract.intentionalDeferrals)).toEqual(DEFERRED_IDS);

    const allIds = [
      ...ids(contract.implementedGates),
      ...ids(contract.openGates),
      ...ids(contract.intentionalDeferrals),
    ];
    expect(new Set(allIds).size).toBe(allIds.length);

    for (const id of allIds) {
      expect(architecture, `${id} is missing from the living architecture`)
        .toContain(`\`${id}\``);
    }
  });

  it('matches authorable buckets and truth axes to the canonical manifest', () => {
    expect(contract.doctrine).toMatchObject({
      canonicalAuthorityScope:
        'authorable_definition_fields_and_effect_truth',
      reviewedDerivedAuthority:
        'src/domain/content/reviewedSupplyChainPersistence.js',
      writeBoundary:
        'fingerprinted_application_commands_with_distinct_authorable_and_reviewed_derived_lanes',
      reviewedSupplyChains:
        'derived_non_authorable_artifact_with_dedicated_persistence_then_per_settlement_activation',
    });
    expect(contract.authorableBuckets).toEqual(manifest.authorableBuckets);
    expect(PACK_BUCKETS).toEqual(manifest.authorableBuckets);
    expect(contract.truthContract.effectKinds).toEqual(manifest.effectKinds);
    expect(contract.truthContract.activationKinds).toEqual(manifest.activationKinds);
    expect(contract.truthContract.scope).toBe('authorable_definition_fields');
    expect(contract.truthContract.userLabels).toEqual([
      'mechanical',
      'conditional',
      'presentation',
      'unsupported',
    ]);
    expect(contract.truthContract.unsupportedPersistsAsExecutableMeaning).toBe(false);
  });

  it('pins executable semantic coverage to the current manifest', () => {
    const authorableCategories = manifest.categories.filter(
      category => category.authorable,
    );
    const mechanicalFields = authorableCategories.flatMap(category => (
      category.fields.filter(field => field.effect === 'mechanical')
    ));
    const presentationFields = authorableCategories.flatMap(category => (
      category.fields.filter(field => field.effect === 'presentation')
    ));

    expect(contract.executableClaimContract).toMatchObject({
      manifestVersion: manifest.manifestVersion,
      mechanicalFieldCount: mechanicalFields.length,
      mechanicalCoverage:
        'exact_category_field_key_with_named_canonical_consumer_and_observation_probe',
      materializedIdentityResolution:
        'exact_definition_or_local_uid_then_unique_identity_free_legacy_name_fallback',
      ambiguousNameMechanics:
        'fail_closed_without_exact_materialized_identity',
      nativeKeywordFallback:
        'unstamped_legacy_only_current_custom_labels_mechanically_inert',
      presentationFieldCount: presentationFields.length,
      presentationBoundary:
        'same_seed_generation_with_canonical_mechanics_projection_unchanged',
      presentationAdversarialTierRouteTerrainCases: 18,
      assemblyCoherenceRngIsolation:
        'named_canonical_coherence_substream',
      registeredValueConditionalFields: ['services.category'],
      unknownFieldRejection: 'every_authorable_bucket',
      referencePackCoverage: 'every_authorable_bucket',
      tierRouteTerrainCases: 6,
      representativeTownSeedCount: 100,
      vanillaNonContamination:
        'byte_identical_before_and_after_custom_runtime',
    });
    expect(contract.executableClaimContract.lifecycleCoverage).toEqual([
      'reviewed_environment_activation',
      'campaign_binding_pin',
      'account_head_advancement',
      'environment_rollback',
      'archive_restore_with_destination_identity_remap',
    ]);
  });

  it('matches the documented authoring sequence to the reducer vocabulary', () => {
    expect(contract.authoringFlow).toEqual(Object.values(CONTENT_STUDIO_STAGE));
    expect(contract.sampleContract).toMatchObject({
      saved: false,
      comparison: 'same_seed_same_config',
      transport: 'click_lazy_worker',
      previewForcedBuckets: ['institutions', 'resources', 'services'],
      previewDispositionStates: ['materialized', 'absent', 'ambiguous'],
      previewOverrideMeaning:
        'marked_mandatory_without_bypassing_tier_provider_dependency_or_final_roster_gates',
      factProjectionOnly: true,
      campaignMigrationForecast: false,
    });
  });

  it('pins review as distinct from per-settlement supply-chain activation', () => {
    expect(contract.supplyChainContract).toEqual({
      reviewMeaning: 'author_accepted_deterministic_projection',
      runtimeStates: ['active', 'blocked', 'ineligible'],
      activationBoundary: 'final_tier_institution_resource_and_service_roster',
      identityResolution:
        'byte_exact_stable_ref_or_unique_legacy_name_fail_closed',
      inferenceIdentityResolution:
        'stable_refs_remain_byte_exact_graph_tokens_and_topology_ids_hash_ordered_exact_uids',
      materializationIdentityResolution:
        'exact_definition_revision_and_hash_or_unique_identity_free_legacy_name',
      revisionBinding: 'exact_computed_content_hash_and_projection_fingerprint',
      revisionChange: 'confirmation_stale_and_trade_blocked_until_rereview',
      endpointAuthority:
        'explicit_fingerprinted_discovered_imports_and_exports_only',
      pathProjectionAuthority:
        'fingerprinted_nodes_and_endpoints_not_top_level_render_aliases',
      conditionalRelationshipFields: [
        'institutions.requires',
        'services.requires',
        'resources.yields',
        'tradeGoods.requiredResources',
      ],
      conditionalOutputFields: ['resources.commodities'],
      tradePromotion: 'active_only',
      legacyWithoutEvidence: 'needs_reevaluation',
      nativeImpairmentIntegration: false,
    });

    expect(contract.reviewedDerivedPersistenceContract).toEqual({
      category: 'supplyChains',
      classification: 'reviewed_derived_non_authorable',
      writeBoundary: 'dedicated_exact_schema_local_and_cloud_cas_command',
      customNodeEvidence:
        'coherent_current_active_owner_definition_revision_head',
      customNodeTuple: [
        'definitionId',
        'revisionId',
        'revisionNumber',
        'contentHash',
        'localUid',
        'kind',
        'category',
      ],
      chainIdentity: 'canonical_hash_of_ordered_exact_node_uids',
      artifactIdentityMayChangeChainId: false,
      oneCurrentArtifactPerOwnerChainId: true,
      history:
        'append_only_revisions_with_exact_head_archive_and_idempotent_receipts',
      environmentAndCampaignBinding: 'direct_persisted_revision_only',
      genericAuthoringAdmission: false,
      packAdmission: false,
      archivePortability:
        'source_graph_validated_then_exact_node_remap_and_rehash',
      archiveChainCollision: 'fail_closed',
      legacyGenericRows:
        'never_activate_local_flat_rows_ignored_cloud_rows_receipt_quarantined',
      legacyReferenceQuarantine:
        'affected_pack_versions_removed_independently_affected_environment_revision_and_later_same_environment_suffix_quarantined_unrelated_histories_survive',
      confirmationImpliesSettlementActivation: false,
      repositoryImplemented: true,
      productionDeploymentProven: false,
    });
  });

  it('pins constitutional archive, account remap, and cutover laws', () => {
    expect(contract.archiveContract).toMatchObject({
      format: 'settlementforge.custom-content-ledger',
      fidelity: 'complete_graph_and_canonical_json_meaning_not_raw_file_bytes',
      exportAuthority:
        'authenticated_owner_data_right_not_premium_gated',
      importAuthority:
        'authenticated_active_premium_transaction',
      lineage: 'one_contiguous_1_through_n_chain_with_maximum_head',
      replay: 'same_command_and_fingerprint_returns_finalized_receipt',
      provenanceConvergence: {
        ignores: ['exported_at', 'outer_archive_fingerprint'],
        distinguishes: [
          'source_key',
          'source_ledger_fingerprint',
          'command_receipts',
          'nested_audit_provenance',
        ],
      },
      provenanceGraph: {
        logicalShape: 'multi_root_dag',
        jsonEncoding: 'nested_trees_with_shared_ancestors_repeated',
        duplicateFingerprint:
          'allowed_only_when_complete_canonical_node_meaning_is_identical',
        divergentDuplicateFingerprint: 'rejected',
        uniqueNodeLimit: 128,
      },
      transportOnlySemanticReplayReusesDestinationResult: true,
      transportOnlySemanticReplayConsumesReceiptSlot: false,
      merge: 'exact_immutable_duplicates_converge_conflicting_meaning_fails',
      fastForward: 'only_contiguous_suffix_over_exact_installed_prefix',
      staleSnapshotMayRewind: false,
      divergentLineageMayBranch: false,
      sourceFastForwardMayOverwriteLocalLifecycleEdit: false,
      limitsApplyToResultingOwnerGraph: true,
      prospectiveCanonicalExportReadmittedBeforeSuccess: true,
      limitFailureRollsBackGraphAndIsReplayable: true,
      finalAvailableExportedReceiptSlotUsable: true,
      failureClassification: {
        explicitDatabaseOrApiRefusal: 'confirmed_failed',
        unknownTransactionOutcome: 'reconcile_required',
      },
    });
    expect(contract.archiveContract.identityRemap).toMatchObject({
      rewritesCustomDependencies: true,
      recomputesRevisionContentHashes: true,
      rebuildsPackManifestsAndHashes: true,
      recomputesEnvironmentHashes: true,
      returnsDestinationHashes: true,
      serverCrossProvesSourceTransferAndIdentityMap: true,
      validatesReviewedSourceGraphBeforeRemap: true,
      rewritesReviewedCustomNodeTuples: true,
      recomputesReviewedChainIdentityProjectionAndHash: true,
      rejectsReviewedDestinationChainCollisions: true,
      reviewedArtifactsRemainExcludedFromPacks: true,
    });
    expect(contract.archiveContract.activationPolicies).toEqual({
      preserve:
        'default_account_restore_keeps_destination_activation',
      'adopt-if-empty':
        'cutover_may_adopt_source_activation_only_after_locked_pristine_destination_proof',
      compatibilityPointers:
        'rebuilt_only_from_winning_active_pack_facts',
    });

    expect(contract.accountPortabilityContract).toMatchObject({
      v3Authority: 'one_constitutional_archive',
      exportRequiresArchiveProjectionParity: true,
      duplicateDecodedJsonKeysRejected: true,
      archiveAndLegacyPackMayCompete: false,
      archiveLandsBeforeDependentSaves: true,
      reviewedDerivedArtifactsIncludedAndRemapped: true,
      campaignCurrentAndHistoryRemapped: true,
      v3CampaignDefinitionRevisionLocalUidContentHashAndPackJoinsMustBeComplete:
        true,
      v3MappedEnvironmentJoinMustBeCompleteAndHashConsistent: true,
      v3CampaignOnlyEnvironmentMayUseDeterministicEmbeddedIdentity: true,
      v3CampaignMayEmbedMissingDefinitionRevisionOrPackIdentity: false,
      legacyCampaignCompatibilityMayEmbedHistoricalIdentity: true,
      settlementDefinitionRevisionLocalUidAndHashesRemapped: true,
      settlementCampaignHashRetainedOnlyWithRebuiltBinding: true,
      incompleteExactProvenance: 'remove_and_warn',
      v3MayDegradeToPerHeadPackImport: false,
    });
    expect(contract.cutoverContract).toMatchObject({
      mergeBeforeImport: true,
      authSessionFenced: true,
      cloudReceiptMustBeConfirmedApplied: true,
      localClear: 'one_compare_all_snapshots_then_clear_operation',
      ambiguousOrStaleOutcomeRetainsAllLocalState: true,
      migrationFlagAfterSuccessfulClearOnly: true,
      checkpointMayHideNewLocalState: false,
      concurrentInvocationsCoalesced: true,
      successShapedUnconfirmedReceiptMayHydrateOrClear: false,
      repositoryImplemented: true,
      productionDeploymentProven: false,
    });
  });

  it('admits only the registered custom-institution visual subset', () => {
    const institutions = manifest.categories.find(
      (category) => category.key === 'institutions',
    );
    const fieldKeys = new Set(institutions.fields.map((field) => field.key));

    expect(contract.visualContract.authorableInstitutionFields).toEqual([
      'sceneProfileId',
      'landmarkLevel',
      'materialFamily',
      'glyph',
    ]);
    for (const field of contract.visualContract.authorableInstitutionFields) {
      expect(fieldKeys.has(field), `${field} is not registered`).toBe(true);
    }
    for (const field of contract.visualContract.unregisteredDeferredFields) {
      expect(fieldKeys.has(field), `${field} must stay outside admission`).toBe(false);
    }
    expect(contract.visualContract.arbitraryMeshAllowed).toBe(false);
    expect(contract.visualContract.arbitraryShaderAllowed).toBe(false);
  });

  it('keeps all asserted repository evidence resolvable', () => {
    for (const source of contract.sourceRoots) {
      if (!source.required) continue;
      expect(
        existsSync(resolve(root, source.path)),
        `Required custom-content source is missing: ${source.path}`,
      ).toBe(true);
    }

    for (const gate of contract.implementedGates) {
      expect(gate.claim.trim().length).toBeGreaterThan(30);
      expect(gate.evidence.length).toBeGreaterThan(0);
      for (const evidence of gate.evidence) {
        expect(
          existsSync(resolve(root, evidence)),
          `${gate.id} evidence is missing: ${evidence}`,
        ).toBe(true);
      }
    }
  });

  it('makes every withheld gate and product deferral reviewable', () => {
    for (const gate of contract.openGates) {
      expect(gate.status).toBe('open');
      expect(gate.reason.trim().length).toBeGreaterThan(80);
      expect(gate.requiredEvidence.length).toBeGreaterThan(2);
    }

    const cloudCutover = contract.openGates.find(
      (entry) => entry.id === 'CC-CLOUD-CUTOVER',
    );
    expect(cloudCutover.proofClass).toBe('deployment_and_rehearsal');
    expect(cloudCutover.reason).toContain('implemented in the repository');
    expect(contract.cutoverContract.productionDeploymentProven).toBe(false);
    expect(contract.reviewedDerivedPersistenceContract.productionDeploymentProven)
      .toBe(false);

    const marketplace = contract.intentionalDeferrals.find(
      (entry) => entry.id === 'CC-MARKETPLACE',
    );
    const genre = contract.intentionalDeferrals.find(
      (entry) => entry.id === 'CC-GENRE-NEUTRALITY',
    );
    const arbitraryRules = contract.intentionalDeferrals.find(
      (entry) => entry.id === 'CC-ARBITRARY-RULES',
    );

    expect(marketplace.status).toBe('deferred');
    expect(contract.promotionRules.publicMarketplaceRequiredForPromotion).toBe(false);
    expect(genre.status).toBe('not_claimed');
    expect(contract.promotionRules.completeGenreNeutralityRequiredForPromotion)
      .toBe(false);
    expect(arbitraryRules.status).toBe('prohibited');
    expect(contract.promotionRules.arbitraryExecutionMayBeEnabled).toBe(false);
    expect(contract.promotionRules).toMatchObject({
      reviewedDerivedMayUseGenericAuthoringOrPacks: false,
      reviewedDerivedConfirmationMayImplySettlementActivation: false,
      currentCustomLabelMayInvokeNativeKeywordMechanics: false,
      reviewedDerivedArchiveRemapMayReuseStaleSourceNodeEvidence: false,
    });
  });
});

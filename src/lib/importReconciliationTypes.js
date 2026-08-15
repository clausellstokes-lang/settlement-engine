/**
 * JSDoc contracts shared by the reconciliation modules.
 *
 * This file intentionally has no runtime behavior. The contracts describe the
 * JSON boundary precisely enough for full-project TypeScript checking while
 * keeping this JavaScript subsystem consumable by the existing build.
 */

/**
 * @typedef {'ingested'|'reconciling'|'previewed'|'applying'|'applied'|'failed_reconcilable'} ImportReconciliationStage
 */

/**
 * @typedef {'create'|'match'|'skip'|'defer'} ImportDecisionAction
 */

/**
 * @typedef {object} ImportReconciliationDecision
 * @property {ImportDecisionAction} action
 * @property {string|null} targetSaveId
 * @property {string} actor
 * @property {string|null} decidedAt
 */

/**
 * @typedef {object} ImportCandidate
 * @property {string} candidateId
 * @property {string} targetSaveId
 * @property {string} targetName
 * @property {'stable_source_id'|'stable_import_provenance'|'exact_name'} matchClass
 * @property {'exact'|'candidate'} confidence
 */

/**
 * @typedef {object} ImportProposal
 * @property {string} proposalId
 * @property {string[]} claimIds
 * @property {number} sourceIndex
 * @property {string|null} sourceSaveId
 * @property {string} sourceName
 * @property {string|null} sourceTier
 * @property {Record<string, unknown>} normalizedInput
 * @property {ImportCandidate[]} candidates
 * @property {string[]} conflictIds
 * @property {string[]} unsupportedIds
 * @property {ImportReconciliationDecision|null} decision
 */

/**
 * @typedef {object} ImportReconciliationSource
 * @property {string} format
 * @property {number} envelopeVersion
 * @property {string} parserVersion
 * @property {string} checksum
 * @property {string} checksumAlgorithm
 * @property {number} sizeBytes
 * @property {string|null} label
 * @property {string|null} ingestedAt
 * @property {string|null} storageRef
 */

/**
 * @typedef {object} ImportSourceCampaignChoice
 * @property {string} choiceId
 * @property {number} sourceIndex
 * @property {string|null} sourceId
 * @property {string} name
 * @property {string[]} settlementIds
 */

/**
 * @typedef {object} ImportReconciliationIngest
 * @property {number} schemaVersion
 * @property {'ingested'} stage
 * @property {ImportReconciliationSource} source
 * @property {ImportSourceCampaignChoice[]} sourceCampaigns
 * @property {Array<Record<string, unknown>>} unsupported
 * @property {Record<string, unknown>} envelope
 */

/**
 * @typedef {object} ImportCampaignMembership
 * @property {string} campaignId
 * @property {string} campaignName
 */

/**
 * @typedef {object} ImportSaveMembership
 * @property {string} saveId
 * @property {ImportCampaignMembership[]} campaigns
 */

/**
 * @typedef {object} ImportReconciliationScope
 * @property {string} targetCampaignId
 * @property {string} targetCampaignName
 * @property {string[]} targetMemberIds
 * @property {ImportSaveMembership[]} existingMemberships
 * @property {string|null} sourceCampaignChoiceId
 * @property {string|null} sourceCampaignId
 * @property {string|null} sourceCampaignName
 */

/**
 * @typedef {object} ImportCommandDraft
 * @property {number} schemaVersion
 * @property {string} draftId
 * @property {string} proposalId
 * @property {'import.settlement.create-and-attach'|'import.campaign.attach-existing'} kind
 * @property {boolean} executable
 * @property {{campaignId:string,saveId:string|null}} targets
 * @property {{sourceChecksum:string,membershipCampaignIds:string[]}} expected
 * @property {Record<string, unknown>} params
 * @property {string} [satisfiedBy]
 */

/**
 * @typedef {object} ImportDecisionCounts
 * @property {number} total
 * @property {number} undecided
 * @property {number} create
 * @property {number} match
 * @property {number} skip
 * @property {number} defer
 */

/**
 * @typedef {object} ImportReconciliationPreview
 * @property {{class:string,basis:string,simulatesCommands:boolean}} epistemic
 * @property {ImportDecisionCounts} decisionCounts
 * @property {Record<string, number>} effects
 * @property {Array<{proposalId:string,saveId:string,
 *   fromCampaigns:ImportCampaignMembership[],toCampaignId:string}>} membershipTransfers
 * @property {number} conflictCount
 * @property {number} unresolvedConflictCount
 * @property {number} unsupportedCount
 * @property {number} commandDraftCount
 * @property {number} executableDraftCount
 */

/**
 * @typedef {object} ImportDraftReceipt
 * @property {string} draftId
 * @property {string} proposalId
 * @property {number} attempt
 * @property {string} status
 * @property {boolean} ok
 * @property {boolean} needsReconciliation
 * @property {string|null} reason
 * @property {Record<string, unknown>} commandReceipt
 */

/**
 * @typedef {object} ImportApplicationReceipt
 * @property {number} schemaVersion
 * @property {string} receiptId
 * @property {string} sessionId
 * @property {string} sourceChecksum
 * @property {'applied'|'failed_reconcilable'} status
 * @property {boolean} ok
 * @property {string|null} attemptedAt
 * @property {ImportDecisionCounts} decisionCounts
 * @property {ImportDraftReceipt[]} commandReceipts
 * @property {Array<Record<string, unknown>>} failures
 * @property {Record<string, unknown>} recovery
 */

/**
 * @typedef {object} ImportReconciliationSession
 * @property {number} schemaVersion
 * @property {string} sessionId
 * @property {ImportReconciliationStage} stage
 * @property {ImportReconciliationSource} source
 * @property {ImportReconciliationScope} scope
 * @property {Array<Record<string, unknown>>} claims
 * @property {ImportProposal[]} proposals
 * @property {Array<Record<string, unknown>>} conflicts
 * @property {Array<{code:string,[key:string]:unknown}>} unsupported
 * @property {ImportCommandDraft[]} commandDrafts
 * @property {ImportReconciliationPreview|null} preview
 * @property {ImportApplicationReceipt|null} applicationReceipt
 */

export {};

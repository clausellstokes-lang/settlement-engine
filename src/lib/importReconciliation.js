/**
 * Public import-reconciliation API.
 *
 * The implementation is separated by responsibility so a future engineer can
 * reason about hostile source admission, session decisions, and command-side
 * recovery independently. This facade keeps callers on one stable import path.
 */

export {
  IMPORT_DECISION_ACTIONS,
  IMPORT_RECONCILIATION_PARSER_VERSION,
  IMPORT_RECONCILIATION_SCHEMA_VERSION,
  IMPORT_RECONCILIATION_STAGES,
  reconciliationSourceChecksum,
} from './importReconciliationShared.js';

export {
  admitExistingCampaignImport,
  ingestSettlementForgeExport,
} from './importReconciliationAdmission.js';

export {
  admitReconciliationSession,
  decideImportProposal,
  reconciliationDecisionSummary,
} from './importReconciliationSession.js';

export {
  applyImportReconciliation,
  previewImportReconciliation,
} from './importReconciliationExecution.js';

export {
  deterministicImportSaveId,
  reconciliationDraftToCommandFields,
} from './importReconciliationCommandIdentity.js';

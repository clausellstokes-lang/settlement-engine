/**
 * standardCommandRegistry.js — the small live application capability set.
 *
 * Importers reach this module only through lazy authoring/Surveyor paths. Keeping
 * it separate from operationRegistry prevents the 172-action store census from
 * becoming an accidental permission or AI-tool surface.
 */

import { createCommandRegistry } from './commandRegistry.js';
import { canonEventApplySpec } from './adapters/canonEventApply.js';
import { partyImpactRecordSpec } from './adapters/partyImpactRecord.js';
import { pendingEditCommitSpec } from './adapters/pendingEditCommit.js';
import {
  importCampaignAttachExistingSpec,
  importSettlementCreateAndAttachSpec,
} from './adapters/importReconciliationApply.js';
import { customContentCommandSpecs } from './adapters/customContentApply.js';

export const standardCommandRegistry = createCommandRegistry([
  canonEventApplySpec,
  partyImpactRecordSpec,
  pendingEditCommitSpec,
  importSettlementCreateAndAttachSpec,
  importCampaignAttachExistingSpec,
  ...customContentCommandSpecs,
]);

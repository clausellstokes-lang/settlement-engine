/**
 * Compatibility surface for the content-environment domain.
 *
 * New code should import the narrow authority it needs:
 *
 * - `contentEnvironmentRevision.js` for immutable environment revisions.
 * - `campaignContentBinding.js` for portable campaign cutoffs.
 * - `contentEnvironmentRuntime.js` for standalone moving-library resolution.
 *
 * This coordinator preserves the established public path for lazy UI, archive,
 * portability, and test consumers. Eager campaign hydration imports the narrow
 * binding authority directly so unrelated runtime and review code cannot join
 * first paint.
 */

export {
  CONTENT_ENVIRONMENT_SCHEMA_VERSION,
  VANILLA_CONTENT_ENVIRONMENT,
  VANILLA_ENVIRONMENT_ID,
  VANILLA_ENVIRONMENT_REVISION_ID,
  admitContentEnvironmentRevision,
  diffContentEnvironmentRevisions,
  directDefinitionReferencesFromLibrary,
  makeContentEnvironmentRevision,
  makeLibraryContentEnvironmentRevision,
} from './contentEnvironmentRevision.js';

export {
  CAMPAIGN_CONTENT_BINDING_SCHEMA_VERSION,
  admitCampaignContentBinding,
  contentRuntimeFromCampaignBinding,
  customContentFromCampaignBinding,
  makeCampaignContentBinding,
} from './campaignContentBinding.js';

export {
  contentRuntimeFromEnvironment,
} from './contentEnvironmentRuntime.js';

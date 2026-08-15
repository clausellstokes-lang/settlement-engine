/**
 * Eager-safe identity for the built-in vanilla content environment.
 *
 * The store needs this neutral pointer before custom-content tools load. The
 * heavier environment compiler imports this same value, so first paint and the
 * reviewed runtime cannot drift onto separate definitions of "vanilla".
 */

export const CONTENT_ENVIRONMENT_SCHEMA_VERSION = 1;
export const CAMPAIGN_CONTENT_BINDING_SCHEMA_VERSION = 1;
export const VANILLA_ENVIRONMENT_ID = 'system:vanilla';
export const VANILLA_ENVIRONMENT_REVISION_ID = 'system:vanilla:v1';
// SHA-256 of VANILLA_CORE's canonical JSON. The full, lazy environment module
// reconstructs and admits this object at module load, so a schema/default edit
// cannot silently leave the checked identity stale.
export const VANILLA_ENVIRONMENT_HASH =
  'aeb02a6f73cd182b45498535f24b7d7cc509799add744ce436d87a65f6c73bb3';

const VANILLA_CORE = Object.freeze({
  schemaVersion: CONTENT_ENVIRONMENT_SCHEMA_VERSION,
  environmentId: VANILLA_ENVIRONMENT_ID,
  environmentRevisionId: VANILLA_ENVIRONMENT_REVISION_ID,
  revisionNumber: 1,
  source: 'vanilla',
  packVersions: Object.freeze([]),
  directDefinitions: Object.freeze([]),
  tunables: Object.freeze({}),
  visualSelection: Object.freeze({}),
});

export const VANILLA_CONTENT_ENVIRONMENT = Object.freeze({
  ...VANILLA_CORE,
  environmentHash: VANILLA_ENVIRONMENT_HASH,
  createdAt: null,
});

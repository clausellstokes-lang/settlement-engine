/**
 * Receiving-account remap for settlement custom-content provenance.
 *
 * Campaign bindings and settlement usage receipts are separate durable
 * artifacts, but their hashes form a join. Keeping this projection beside the
 * account binding remapper makes the ordering explicit without inflating the
 * core campaign portability module past its legibility budget.
 */

import {
  admitCampaignContentBinding,
} from '../domain/content/contentEnvironment.js';
import {
  fingerprintContent,
} from '../domain/content/contentFingerprint.js';
import {
  admitSettlementContentProvenance,
  SETTLEMENT_CONTENT_PROVENANCE_SCHEMA_VERSION,
} from '../domain/content/settlementContentProvenance.js';
import {
  remapAccountCampaignContentBinding,
} from './accountContentPortability.js';
// The estate's own declaration of which row keys are ACCOUNT-SCOPED identity, read
// rather than re-typed: the roster remapper's local-only branch below keys on it,
// and a sixth key added to that projection must count here on the day it lands.
import {
  CUSTOM_DEFINITION_IDENTITY_KEYS,
} from '../domain/content/customDefinitionIdentityProjection.js';
// The roster's buckets are codepoint-sorted by the id this remapper REWRITES, so
// the destination order has to be re-derived with the same comparator the builder
// used. deterministicSort.js is a pinned eager leaf, so this edge is lazy→eager.
import { compareCodepoint } from '../domain/deterministicSort.js';

const SHA256_RE = /^[0-9a-f]{64}$/;

/** @param {unknown} value @returns {Record<string, unknown>} */
function plainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** A trimmed string, or null. `null` rather than `''` so "absent" and "present
 *  but blank" cannot both silently satisfy a lookup.
 *  @param {unknown} value @returns {string|null} */
function textOrNull(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * @typedef {{
 *   namespace:string,
 *   definitionIds:Map<string,string>,
 *   revisionIds:Map<string,string>,
 *   localUids:Map<string,string>,
 *   packIds:Map<string,string>,
 *   environmentIds:Map<string,string>,
 *   environmentRevisionIds:Map<string,string>,
 *   revisionContentHashes:Map<string,string>,
 *   revisionNumbers:Map<string,number>,
 *   environmentHashes:Map<string,string>,
 *   archiveBacked:boolean,
 *   importedData:Map<string,{
 *     data:Record<string,unknown>,definitionId:string,revisionId:string,
 *   }>,
 *   diagnostics:Readonly<Record<string,unknown>>,
 * }} AccountContentIdentityMap
 */

/**
 * Build the source-binding-hash → receiving binding join used by settlement
 * provenance. A settlement generated inside a campaign can point at either the
 * current cutoff or a historical cutoff, so both are included.
 *
 * @param {unknown} campaigns
 * @param {AccountContentIdentityMap} identityMap
 */
export function accountCampaignBindingDestinations(campaigns, identityMap) {
  const destinations = new Map();
  for (const rawCampaign of Array.isArray(campaigns) ? campaigns : []) {
    const candidates = [
      rawCampaign?.contentBinding,
      ...(Array.isArray(rawCampaign?.contentBindingHistory)
        ? rawCampaign.contentBindingHistory
        : []),
    ];
    for (const candidate of candidates) {
      const source = admitCampaignContentBinding(candidate);
      if (!source.ok) continue;
      const remapped = remapAccountCampaignContentBinding(
        source.binding,
        identityMap,
      );
      if (remapped.ok) {
        destinations.set(source.binding.bindingHash, remapped.binding);
      }
    }
  }
  return destinations;
}

/**
 * Rebuild a settlement's usage receipt in the receiving account namespace.
 *
 * Exact provenance is all-or-nothing per materialized definition. When the
 * archive command was not confirmed (or its receipt omits an identity/hash
 * pair), callers must remove the source receipt rather than present foreign
 * source ids as exact destination joins.
 *
 * @param {unknown} rawProvenance
 * @param {AccountContentIdentityMap} identityMap
 * @param {Map<string, Record<string, any>>} [bindingDestinations]
 */
export function remapAccountSettlementContentProvenance(
  rawProvenance,
  identityMap,
  bindingDestinations = new Map(),
) {
  if (rawProvenance == null) return { ok: true, provenance: null };
  const admitted = admitSettlementContentProvenance(rawProvenance);
  if (admitted.ok === false) {
    return {
      ok: false,
      code: admitted.reason,
      error: admitted.message,
    };
  }
  const source = admitted.provenance;
  const materializedDefinitions = [];
  for (const definition of source.materializedDefinitions) {
    const definitionId = identityMap.definitionIds.get(
      definition.definitionId,
    );
    const revisionId = identityMap.revisionIds.get(definition.revisionId);
    const contentHash = identityMap.revisionContentHashes.get(
      definition.revisionId,
    );
    const localUid = definition.localUid == null
      ? null
      : identityMap.localUids.get(definition.localUid);
    if (
      !definitionId
      || !revisionId
      || !SHA256_RE.test(String(contentHash || ''))
      || (definition.localUid != null && !localUid)
    ) {
      return {
        ok: false,
        code: 'settlement_content_provenance_identity_incomplete',
        error:
          'The archive receipt did not map every settlement content identity.',
      };
    }
    materializedDefinitions.push(Object.freeze({
      ...definition,
      definitionId,
      revisionId,
      contentHash,
      localUid: localUid || null,
    }));
  }

  const destinationBinding = source.bindingHash
    ? bindingDestinations.get(source.bindingHash) || null
    : null;
  let environment = null;
  if (destinationBinding?.environment) {
    environment = Object.freeze({
      environmentId: destinationBinding.environment.environmentId,
      environmentRevisionId:
        destinationBinding.environment.environmentRevisionId,
      environmentHash: destinationBinding.environment.environmentHash,
      source: destinationBinding.environment.source || null,
    });
  } else if (source.environment) {
    const environmentId = identityMap.environmentIds.get(
      source.environment.environmentId,
    );
    const environmentRevisionId = identityMap.environmentRevisionIds.get(
      source.environment.environmentRevisionId,
    );
    const environmentHash = identityMap.environmentHashes.get(
      source.environment.environmentRevisionId,
    );
    if (
      environmentId
      && environmentRevisionId
      && SHA256_RE.test(String(environmentHash || ''))
    ) {
      environment = Object.freeze({
        environmentId,
        environmentRevisionId,
        environmentHash,
        source: source.environment.source,
      });
    } else {
      return {
        ok: false,
        code: 'settlement_content_provenance_environment_incomplete',
        error:
          'The archive receipt did not map the settlement content environment.',
      };
    }
  }

  const core = {
    schemaVersion: SETTLEMENT_CONTENT_PROVENANCE_SCHEMA_VERSION,
    scope: destinationBinding ? 'campaign' : 'standalone',
    environment,
    // A campaign hash is exact only when that campaign cutoff was itself
    // rebuilt. Detached settlements keep exact definition/environment joins
    // but no longer pretend to belong to a foreign campaign constitution.
    bindingHash: destinationBinding?.bindingHash || null,
    materializedDefinitions,
  };
  const candidate = {
    ...core,
    receiptHash: fingerprintContent(core),
  };
  const verified = admitSettlementContentProvenance(candidate);
  if (verified.ok === false) {
    return {
      ok: false,
      code: verified.reason,
      error: verified.message,
    };
  }
  return { ok: true, provenance: verified.provenance };
}

/**
 * ⭐ THE LIVING-CONTENT ROSTER'S RECEIVING-ACCOUNT REMAP (O-11 path 2, lane L-MAT).
 *
 * `settlement.customContentRoster` is minted beside the provenance receipt in the
 * same three lines of `generateSettlementPipeline`, and the two are treated ALIKE
 * on import for the same reason: both are EXACTNESS RECORDS about authored
 * content, and a record that keeps SOURCE-ACCOUNT ids after the definitions have
 * been re-namespaced is not a weaker record, it is a false one.
 *
 * ⛔ RESOLVE-OR-DROP, AT PER-SETTLEMENT GRAIN — the same law the provenance
 * remapper obeys three functions up, and the same law the estate already applies
 * to an unresolvable foreign content identity (`accountImportBody.js` deletes the
 * receipt and pushes a per-settlement warning). Per-ROW resolution was considered
 * and refused: the roster records what was IN SCOPE for a run, so a half-resolved
 * scope record claims a scope that never existed. Dropping the whole roster with a
 * warning leaves an honest absence; keeping four of seven rows leaves a lie.
 *
 * ⛔ AND "DROP ALWAYS" WAS REFUSED TOO. A user moving their OWN estate between
 * accounts carries the definitions with it, so the identity map resolves and the
 * true record survives the move. That is the whole point of an archive-backed
 * import.
 *
 * ⚠ THE SCHEMA VERSION IS CARRIED, NOT COMPARED AGAINST THE BUILDER'S CONSTANT,
 * AND THAT IS A BYTE DECISION. Importing `LIVING_CONTENT_ROSTER_SCHEMA_VERSION`
 * from `livingContentRoster.js` would drag the roster module and the whole
 * content-manifest closure behind it into this module's chunk, on the import path,
 * for one integer. This function validates the roster STRUCTURALLY instead — the
 * house idiom the create-boundary walker states in terms ("the key is held by each
 * law's own gate test, where it is compared against the real constant rather than
 * against a spelling") — and the agreement between this remapper and the real
 * builder's output is pinned in the test, where the import is free.
 *
 * @param {unknown} rawRoster the source account's `settlement.customContentRoster`
 * @param {AccountContentIdentityMap} identityMap
 * @returns {{ok: true, roster: Record<string, unknown>|null}
 *   | {ok: false, code: string, error: string}}
 */
export function remapAccountSettlementLivingContentRoster(rawRoster, identityMap) {
  if (rawRoster == null) return { ok: true, roster: /** @type {Record<string, unknown>|null} */ (null) };

  const source = plainObject(rawRoster);
  const schemaVersion = Number(source.schemaVersion);
  const buckets = plainObject(source.buckets);
  if (
    !Number.isInteger(schemaVersion)
    || schemaVersion < 1
    || Object.keys(buckets).length === 0
  ) {
    return {
      ok: false,
      code: 'settlement_living_content_roster_shape_unreadable',
      error: 'The imported settlement carried a living-content roster this build cannot read.',
    };
  }

  /** @type {Record<string, ReadonlyArray<Record<string, unknown>>>} */
  const remappedBuckets = {};
  // The bucket keys are the law's own four, already in codepoint order in the
  // source; iterating them sorted keeps the destination independent of however
  // the source blob happened to serialize.
  for (const bucket of Object.keys(buckets).sort(compareCodepoint)) {
    const rows = Array.isArray(buckets[bucket]) ? buckets[bucket] : null;
    if (!rows) {
      return {
        ok: false,
        code: 'settlement_living_content_roster_shape_unreadable',
        error: 'The imported settlement carried a living-content roster this build cannot read.',
      };
    }
    const remappedRows = [];
    for (const rawRow of rows) {
      const row = plainObject(rawRow);
      const sourceRevisionId = textOrNull(row.customDefinitionRevisionId);
      const sourceLocalUid = textOrNull(row.localUid);
      const localUid = sourceLocalUid === null
        ? null
        : identityMap.localUids.get(sourceLocalUid);

      // ⭐ A LOCAL-ONLY ROW IS RESOLVED BY ITS `localUid` ALONE, AND READING IT
      // OTHERWISE DEFEATED THE WHOLE RULING. `rosterRow` admits a definition on
      // `localUid || customDefinitionId`, and the identity projection emits every
      // `customDefinition*` key OPTIONALLY — so a definition that lives only in
      // the author's local library, never committed to the immutable ledger,
      // produces a row with a localUid and no account-scoped identity at all.
      // Such a row has nothing to resolve against the archive; it is not
      // UNRESOLVED, it is a different KIND of row. Treating "no account identity"
      // as "unresolved identity" dropped the whole roster of any world whose
      // scope included one never-archived local definition — the exact population
      // resolve-or-drop exists to preserve (a user moving their OWN estate keeps
      // a true record). Executed before this branch existed: a fully
      // localUid-mapped roster returned `..._identity_incomplete`.
      //
      // The membership test reads the estate's OWN declared identity key list
      // rather than a local re-typing, so a sixth `customDefinition*` key added
      // to that projection later counts as account-scoped identity here without
      // anyone remembering to come back.
      const declaresAccountIdentity = CUSTOM_DEFINITION_IDENTITY_KEYS.some(
        key => Object.hasOwn(row, key) && row[key] != null && row[key] !== '',
      );
      if (!declaresAccountIdentity) {
        if (sourceLocalUid === null || !localUid) {
          // No account identity AND no resolvable localUid: nothing about this
          // row can be re-addressed, so the roster's all-or-nothing law applies.
          return {
            ok: false,
            code: 'settlement_living_content_roster_identity_incomplete',
            error:
              'The archive receipt did not map every living-content roster identity.',
          };
        }
        // Annotated rather than inferred: without it the array's element type
        // becomes a union of "the general row" and "the local-only row", and the
        // re-sort below — which reads `customDefinitionId` off either — stops
        // typechecking. The two branches produce the same KIND of thing.
        /** @type {Record<string, unknown>} */
        const localOnlyRow = { ...row, localUid };
        remappedRows.push(Object.freeze(localOnlyRow));
        continue;
      }

      const definitionId = identityMap.definitionIds.get(
        textOrNull(row.customDefinitionId),
      );
      const revisionId = identityMap.revisionIds.get(sourceRevisionId);
      const contentHash = identityMap.revisionContentHashes.get(sourceRevisionId);
      if (
        !definitionId
        || !revisionId
        || !SHA256_RE.test(String(contentHash || ''))
        || (sourceLocalUid !== null && !localUid)
      ) {
        return {
          ok: false,
          code: 'settlement_living_content_roster_identity_incomplete',
          error:
            'The archive receipt did not map every living-content roster identity.',
        };
      }

      // `source`, `isCustom`, `customDefinitionCategory` and every authored
      // presentation field are carried VERBATIM: they are the author's content,
      // not an account-scoped identifier, and rewriting them would make the
      // record disagree with the definition it points at.
      /** @type {Record<string, unknown>} */
      const remappedRow = { ...row, customDefinitionId: definitionId };
      remappedRow.customDefinitionRevisionId = revisionId;
      remappedRow.customDefinitionContentHash = contentHash;
      if (sourceLocalUid !== null) remappedRow.localUid = localUid;

      // ⚠ THE FINGERPRINT IS RE-DERIVED, NEVER CARRIED, AND THE REASON IS A
      // MEASURED TRAP. `projectCustomDefinitionIdentity` falls the fingerprint
      // BACK to the content hash when a definition declares none, so most rows
      // carry the source hash under a second key. Rewriting the hash and copying
      // the fingerprint would leave the SOURCE account's hash sitting in the
      // destination record. A fingerprint that equals the source hash is that
      // fallback and is re-derived from the destination hash; an INDEPENDENT one
      // is a source-account value with no entry in the identity map, so it is
      // dropped rather than carried — the roster is inert and read by nothing, so
      // an honest absence costs nothing and a stale identifier costs exactness.
      const sourceFingerprint = textOrNull(row.customDefinitionFingerprint);
      if (sourceFingerprint === null) {
        delete remappedRow.customDefinitionFingerprint;
      } else if (sourceFingerprint === textOrNull(row.customDefinitionContentHash)) {
        remappedRow.customDefinitionFingerprint = contentHash;
      } else {
        delete remappedRow.customDefinitionFingerprint;
      }

      // `customDefinitionVersion` is a REVISION NUMBER whenever it is an integer,
      // and the destination's numbering is its own. Remap it when the receipt
      // preserved the order; drop the field when it did not, rather than assert a
      // source-account ordinal about a destination revision.
      if (Object.hasOwn(row, 'customDefinitionVersion')) {
        const sourceVersion = row.customDefinitionVersion;
        if (Number.isInteger(sourceVersion)) {
          const destinationVersion = identityMap.revisionNumbers.get(sourceRevisionId);
          if (Number.isInteger(destinationVersion) && Number(destinationVersion) > 0) {
            remappedRow.customDefinitionVersion = destinationVersion;
          } else {
            delete remappedRow.customDefinitionVersion;
          }
        }
      }

      remappedRows.push(Object.freeze(remappedRow));
    }
    if (remappedRows.length === 0) continue;
    // ⛔ RE-SORT ON THE NEW ID. The builder sorts each bucket by
    // `customDefinitionId || localUid`, and this function just rewrote both — so
    // carrying the source order would persist an order keyed on ids that no
    // longer exist, and two accounts holding the same definitions would serialize
    // the same roster differently.
    remappedRows.sort((left, right) => compareCodepoint(
      textOrNull(left?.customDefinitionId) || textOrNull(left?.localUid) || '',
      textOrNull(right?.customDefinitionId) || textOrNull(right?.localUid) || '',
    ));
    remappedBuckets[bucket] = Object.freeze(remappedRows);
  }

  if (Object.keys(remappedBuckets).length === 0) {
    return {
      ok: false,
      code: 'settlement_living_content_roster_shape_unreadable',
      error: 'The imported settlement carried a living-content roster this build cannot read.',
    };
  }

  /** @type {Record<string, unknown>|null} */
  const roster = Object.freeze({
    schemaVersion,
    buckets: Object.freeze(remappedBuckets),
  });
  return { ok: true, roster };
}

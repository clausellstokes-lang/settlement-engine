/**
 * Source ingest and candidate admission for existing-campaign reconciliation.
 *
 * Account import remains the authoritative hostile-envelope validator and
 * settlement normalizer. This module turns that admitted material into a
 * deterministic, immutable review session; it performs no persistence.
 */

import {
  ensureNormalizeLoaded,
  MAX_IMPORT_BYTES,
  prepareSettlementEntry,
  validateAccountImport,
} from './accountImport.js';
import {
  IMPORT_RECONCILIATION_PARSER_VERSION,
  IMPORT_RECONCILIATION_SCHEMA_VERSION,
  cleanText,
  deepFreeze,
  detachedRecord,
  isRecord,
  normalizedName,
  reconciliationDiagnostic,
  reconciliationIssueId,
  reconciliationProposalId,
  reconciliationSourceChecksum,
  reconciliationStableToken,
  sourceIdOf,
  utf8Size,
} from './importReconciliationShared.js';
// The law marker's ONE spelling, read from the dependency-free leaf that declares
// it rather than re-typed in a strip — the same edge `importScrub.js` takes for
// the same act on the other archive-less importer. The leaf imports nothing, so
// this edge costs no closure.
import { LIVING_CONTENT_LAW_CONFIG_KEY } from '../domain/content/livingContentLawVersion.js';

/** @typedef {import('./importReconciliationTypes.js').ImportReconciliationIngest} ImportReconciliationIngest */
/** @typedef {import('./importReconciliationTypes.js').ImportReconciliationSession} ImportReconciliationSession */
/** @typedef {import('./importReconciliationTypes.js').ImportReconciliationSource} ImportReconciliationSource */

function sourceCampaignChoice(rawCampaign, index, checksum) {
  if (!isRecord(rawCampaign)) {
    return {
      ok: false,
      unsupported: {
        issueId: reconciliationIssueId(`source:${checksum}`, 'campaign-record', index),
        scope: `campaigns[${index}]`,
        code: 'campaign_record_invalid',
        message: 'This source campaign is not an object and cannot be reconciled.',
      },
    };
  }
  const sourceId = sourceIdOf(rawCampaign.id);
  const rawSettlementIds = Array.isArray(rawCampaign.settlementIds)
    ? rawCampaign.settlementIds
    : [];
  const settlementIds = Array.isArray(rawCampaign.settlementIds)
    ? rawSettlementIds.map(sourceIdOf).filter(Boolean)
    : [];
  const invalidMemberCount = rawSettlementIds.length - settlementIds.length;
  return {
    ok: true,
    campaign: {
      choiceId: `source-campaign:${reconciliationStableToken(
        `${checksum}:${index}:${sourceId || ''}`,
      )}`,
      sourceIndex: index,
      sourceId,
      name: cleanText(rawCampaign.name) || `Source campaign ${index + 1}`,
      settlementIds,
    },
    unsupported: (
      rawCampaign.settlementIds != null
      && !Array.isArray(rawCampaign.settlementIds)
    )
      ? {
          issueId: reconciliationIssueId(`source:${checksum}`, 'campaign-members', index),
          scope: `campaigns[${index}].settlementIds`,
          code: 'campaign_members_invalid',
          message: 'This source campaign has no readable settlement membership list.',
        }
      : invalidMemberCount > 0
        ? {
            issueId: reconciliationIssueId(
              `source:${checksum}`,
              'campaign-member-identifiers',
              index,
            ),
            scope: `campaigns[${index}].settlementIds`,
            code: 'campaign_member_identifiers_invalid',
            message: `${invalidMemberCount} source campaign member reference${
              invalidMemberCount === 1 ? ' is' : 's are'
            } missing a usable identifier.`,
          }
        : null,
  };
}

/**
 * Ingest and envelope-admit a SettlementForge account export without mutation.
 *
 * The parsed records remain private in-memory working material. The admitted
 * reconciliation session replaces them with claims/proposals and receipts
 * never copy the source payload.
 *
 * @param {string} text
 * @param {{label?:string|null, ingestedAt?:string|null,
 *   storageRef?:string|null}} [meta]
 * @returns {
 *   | {ok:true,value:ImportReconciliationIngest,diagnostic:Record<string, unknown>}
 *   | {ok:false,diagnostic:Record<string, unknown>}
 * }
 */
export function ingestSettlementForgeExport(text, meta = {}) {
  if (typeof text !== 'string' || utf8Size(text) > MAX_IMPORT_BYTES) {
    return {
      ok: false,
      diagnostic: reconciliationDiagnostic(
        'rejected',
        'source_too_large',
        'This export is too large to reconcile safely.',
      ),
    };
  }
  const admitted = validateAccountImport(text);
  if (admitted.ok !== true) {
    const diagnosticCode = admitted.failureKind === 'json_boundary_invalid'
      ? 'source_json_boundary_invalid'
      : 'source_envelope_invalid';
    return {
      ok: false,
      diagnostic: reconciliationDiagnostic(
        'rejected',
        diagnosticCode,
        admitted.error,
      ),
    };
  }

  const checksum = reconciliationSourceChecksum(text);
  const sourceCampaigns = [];
  const unsupported = [];
  admitted.value.campaigns.forEach((campaign, index) => {
    const choice = sourceCampaignChoice(campaign, index, checksum);
    if (choice.ok) {
      sourceCampaigns.push(choice.campaign);
      if (choice.unsupported) unsupported.push(choice.unsupported);
    } else {
      unsupported.push(choice.unsupported);
    }
  });

  let value;
  try {
    value = {
      schemaVersion: IMPORT_RECONCILIATION_SCHEMA_VERSION,
      stage: 'ingested',
      source: {
        format: 'settlementforge-account-export',
        envelopeVersion: admitted.value.version,
        parserVersion: IMPORT_RECONCILIATION_PARSER_VERSION,
        checksum,
        checksumAlgorithm: 'fnv1a32+djb2+utf8-size',
        sizeBytes: utf8Size(text),
        label: cleanText(meta.label) || null,
        ingestedAt: cleanText(meta.ingestedAt) || null,
        storageRef: cleanText(meta.storageRef) || null,
      },
      sourceCampaigns,
      unsupported,
      // Replaced by normalized proposals during admission.
      envelope: detachedRecord(admitted.value),
    };
  } catch {
    return {
      ok: false,
      diagnostic: reconciliationDiagnostic(
        'rejected',
        'source_json_boundary_invalid',
        'This export contains a structure that cannot be reconciled safely.',
      ),
    };
  }

  return {
    ok: true,
    value: deepFreeze(value),
    diagnostic: reconciliationDiagnostic(
      'current',
      'source_admitted',
      'The structured export was admitted.',
    ),
  };
}

function selectedSourceCampaign(ingest, sourceCampaignId) {
  const campaigns = Array.isArray(ingest.sourceCampaigns)
    ? ingest.sourceCampaigns
    : [];
  if (campaigns.length === 0) return { ok: true, campaign: null };
  if (campaigns.length === 1 && !sourceCampaignId) {
    return { ok: true, campaign: campaigns[0] };
  }
  const requested = cleanText(sourceCampaignId);
  const campaign = campaigns.find(item => (
    item.choiceId === requested || (item.sourceId && item.sourceId === requested)
  ));
  if (!campaign) {
    return {
      ok: false,
      error: campaigns.length > 1
        ? 'Choose which source campaign to reconcile.'
        : 'The selected source campaign is unavailable.',
      code: 'source_campaign_required',
    };
  }
  return { ok: true, campaign };
}

function importedProvenance(save) {
  const imported = save?.settlement?.importedFrom;
  if (!isRecord(imported)) return null;
  return {
    checksum: cleanText(imported.sourceChecksum) || null,
    sourceId: sourceIdOf(imported.sourceId),
  };
}

function candidatesForProposal(proposalId, sourceId, sourceName, checksum, existing) {
  const byTarget = new Map();
  for (const save of Array.isArray(existing) ? existing : []) {
    const targetSaveId = sourceIdOf(save?.id);
    if (!targetSaveId) continue;
    const targetName = cleanText(save?.name || save?.settlement?.name) || targetSaveId;
    const provenance = importedProvenance(save);
    let matchClass = null;
    let confidence = null;
    if (sourceId && targetSaveId === sourceId) {
      matchClass = 'stable_source_id';
      confidence = 'exact';
    } else if (
      sourceId
      && provenance?.sourceId === sourceId
      && (!provenance.checksum || provenance.checksum === checksum)
    ) {
      matchClass = 'stable_import_provenance';
      confidence = 'exact';
    } else if (
      normalizedName(sourceName)
      && normalizedName(targetName) === normalizedName(sourceName)
    ) {
      matchClass = 'exact_name';
      confidence = 'candidate';
    }
    if (!matchClass) continue;
    const candidate = {
      candidateId: `irc:${reconciliationStableToken(`${proposalId}:${targetSaveId}`)}`,
      targetSaveId,
      targetName,
      matchClass,
      confidence,
    };
    const prior = byTarget.get(targetSaveId);
    if (!prior || prior.confidence !== 'exact') byTarget.set(targetSaveId, candidate);
  }
  const rank = { stable_source_id: 0, stable_import_provenance: 1, exact_name: 2 };
  return [...byTarget.values()].sort((left, right) => (
    rank[left.matchClass] - rank[right.matchClass]
    || left.targetSaveId.localeCompare(right.targetSaveId)
  ));
}

function relationshipCount(rawSettlement) {
  if (!isRecord(rawSettlement)) return 0;
  return [
    rawSettlement.neighborRelationship ? 1 : 0,
    Array.isArray(rawSettlement.neighbourNetwork)
      ? rawSettlement.neighbourNetwork.length
      : 0,
    Array.isArray(rawSettlement.interSettlementRelationships)
      ? rawSettlement.interSettlementRelationships.length
      : 0,
  ].reduce((sum, value) => sum + value, 0);
}

function proposalIssues(proposalId, rawEntry, candidates, duplicateSourceIdCount) {
  const conflicts = [];
  const unsupported = [];
  const exact = candidates.filter(candidate => candidate.confidence === 'exact');
  const byName = candidates.filter(candidate => candidate.matchClass === 'exact_name');

  if (duplicateSourceIdCount > 1) {
    conflicts.push({
      conflictId: reconciliationIssueId(proposalId, 'duplicate-source-id'),
      proposalId,
      compatibility: 'ambiguous',
      code: 'duplicate_source_identity',
      message: `${duplicateSourceIdCount} source records share this stable save ID; review each one explicitly.`,
      candidateIds: candidates.map(candidate => candidate.candidateId),
      resolution: null,
    });
  }
  if (exact.length > 1) {
    conflicts.push({
      conflictId: reconciliationIssueId(proposalId, 'ambiguous-provenance'),
      proposalId,
      compatibility: 'ambiguous',
      code: 'multiple_stable_matches',
      message: 'More than one existing save claims the same source identity.',
      candidateIds: exact.map(candidate => candidate.candidateId),
      resolution: null,
    });
  } else if (exact.length === 0 && byName.length > 1) {
    conflicts.push({
      conflictId: reconciliationIssueId(proposalId, 'ambiguous-name'),
      proposalId,
      compatibility: 'ambiguous',
      code: 'multiple_name_matches',
      message: 'Several existing saves share this name; choose a target explicitly.',
      candidateIds: byName.map(candidate => candidate.candidateId),
      resolution: null,
    });
  } else if (exact.length === 0 && byName.length === 1) {
    conflicts.push({
      conflictId: reconciliationIssueId(proposalId, 'name-only-match'),
      proposalId,
      compatibility: 'review_required',
      code: 'name_match_is_not_identity',
      message: 'The name matches, but a name alone does not prove identity.',
      candidateIds: [byName[0].candidateId],
      resolution: null,
    });
  }

  const rawSettlement = rawEntry?.settlement;
  const relationships = relationshipCount(rawSettlement);
  if (relationships > 0) {
    unsupported.push({
      issueId: reconciliationIssueId(proposalId, 'relationships'),
      proposalId,
      scope: 'settlement.relationships',
      code: 'relationships_deferred',
      message: `${relationships} source relationship reference${
        relationships === 1 ? ' is' : 's are'
      } preserved in the source but not applied by this slice.`,
    });
  }
  if (rawEntry?.campaignState != null) {
    unsupported.push({
      issueId: reconciliationIssueId(proposalId, 'campaign-state'),
      proposalId,
      scope: 'settlement.campaignState',
      code: 'campaign_state_reset_to_draft',
      message: 'Per-save campaign state is not imported; a created settlement starts as a draft.',
    });
  }
  if (
    rawEntry?.aiData != null
    && (!isRecord(rawEntry.aiData) || Object.keys(rawEntry.aiData).length > 0)
  ) {
    unsupported.push({
      issueId: reconciliationIssueId(proposalId, 'ai-data'),
      proposalId,
      scope: 'settlement.aiData',
      code: 'ai_overlay_not_imported',
      message: 'AI overlay data is not copied across this reconciliation boundary.',
    });
  }
  if (
    rawEntry?.versionHistory != null
    && (
      !Array.isArray(rawEntry.versionHistory)
      || rawEntry.versionHistory.length > 0
    )
  ) {
    unsupported.push({
      issueId: reconciliationIssueId(proposalId, 'version-history'),
      proposalId,
      scope: 'settlement.versionHistory',
      code: 'version_history_not_imported',
      message: 'Historical snapshots remain in the source export and are not replayed.',
    });
  }
  return { conflicts, unsupported };
}

function selectedCampaignMechanics(ingest, selected) {
  if (!selected) return [];
  const raw = ingest.envelope?.campaigns?.[selected.sourceIndex];
  if (!isRecord(raw)) return [];
  const unsupported = [];
  const fields = [
    ['mapState', 'campaign_map_not_imported', 'Map state'],
    ['regionalGraph', 'regional_graph_not_imported', 'Regional graph state'],
    ['wizardNews', 'campaign_chronicle_not_imported', 'Campaign chronicle state'],
    ['worldState', 'world_state_not_imported', 'World simulation state'],
  ];
  for (const [field, code, label] of fields) {
    if (raw[field] == null) continue;
    unsupported.push({
      issueId: reconciliationIssueId(`campaign:${selected.choiceId}`, field),
      scope: `campaign.${field}`,
      code,
      message: `${label} remains in the source and is not applied by the settlement reconciliation slice.`,
    });
  }
  return unsupported;
}

/**
 * ⭐ DROP THE TWO SOURCE-ACCOUNT CUSTOM-CONTENT EXACTNESS RECORDS — AND THE
 * FOREIGN WORLD'S BIRTH-LAW MARKER — ON THE RECONCILED ENTRY (lane L-MAT-FIX,
 * DEF-3; the marker added by lane LIGHT car 2a, 2026-09-08, on the chair's
 * ruling C1). Mutates `entry.settlement` in place and returns one message per
 * RECORD removed, for the caller's `unsupported` list. The marker is stripped
 * SILENTLY, and the asymmetry is the point: a dropped record is something the
 * importer loses and must be told about, while the marker is a claim about
 * someone else's world that this account was never entitled to inherit.
 *
 * ⛔ WHY ANYTHING HAPPENS HERE AT ALL. `prepareSettlementEntry` preserves
 * `customContentRoster` and `customContentProvenance` verbatim, and this slice
 * freezes the prepared entry straight into `normalizedInput` — which is what the
 * `import.settlement.create-and-attach` command persists. So before this
 * function, a second account's exactness records reached a destination world
 * with the SOURCE account's ledger ids intact, unwarned. The gap used to be
 * declared rather than cured on the ground that no world carries these records
 * while the living-content dial is dormant; that ground was false at this
 * boundary of all places, because its input is an import FILE — exactly where
 * such a record comes from without any dial. (The dial was lit on 2026-09-08,
 * which retires the ground a second time rather than changing anything here: the
 * cure never rested on it.)
 *
 * ⛔ WHY BOTH RECORDS, TOGETHER. `customContentProvenance` (what materialized)
 * and `customContentRoster` (what was in scope) are minted side by side at the
 * end of one generation run and are governed alike on every other boundary — the
 * account importer remaps both, the public projection drops both, the gallery
 * ingest drops both. Curing one here and not the other would leave two records
 * that agree everywhere else disagreeing about exactly one path, which is a
 * shape a future reader cannot distinguish from an oversight.
 *
 * ⭐⭐ AND THE THIRD STRIP: THE FOREIGN BIRTH LAW, ON THE RULE THIS MODULE'S
 * OWN HEADER ALREADY CITES. `importScrub.js:115-121` states it for the sibling
 * archive-less importer, in its own words: an ingest that kept the marker would
 * import "a world that says it was born under the roster law while carrying no
 * roster — a world that lies about its own scope, permanently, because nothing
 * downstream re-mints a roster". Both boundaries are archive-less, both take a
 * FOREIGN account's world, and this one dropped the roster while leaving the
 * claim that produced it — the exact state that paragraph forbids.
 *
 * ⛔ AND WHY BOTH ECHOES, MEASURED ON THIS PATH. The marker rides a generated
 * world twice — the RESOLVED `settlement.config` and the AUTHORING
 * `settlement._config` — and those two are the only paths in a whole settlement
 * that move between law 1 and law 2. `scrubGalleryImportLivingContent` needs one
 * strip because `gallery.js`'s `stripImportConfidential` already deletes
 * `_config` wholesale on that path, as a regeneration hazard; nothing deletes it
 * here, which was measured on the first cut of this cure's own arm — it passed on
 * `config` and failed on `_config`. Cleaning one echo and leaving the other tells
 * the same lie one level down, and `_config` is what a save persists as its
 * regeneration input (`SaveToLibraryButton.jsx`), so it is the echo a future
 * re-birth would read.
 *
 * ⛔ AND WHY IT IS NOT CONDITIONAL ON EITHER RECORD. The marker rides on every
 * world the product mints since the dial was lit (2026-09-08), while the roster
 * is written only when the source run's reviewed environment held a living-content
 * definition — measured at the lighting: 0 of 525 golden rows and 0 of 768 RATE
 * towns carry the roster under law 2. So the ordinary reconciled import is
 * marker-carrying and roster-less, which is precisely the lying shape; a strip
 * gated on the records would never fire on it. The three strips are therefore
 * three independent presence tests, not one compound act.
 *
 * ⚠ THE ACCOUNT PATH'S CARVE-OUT DOES NOT REACH HERE, AND `importScrub.js`
 * SAYS WHY. That carve-out exists because the account path is the user's OWN
 * estate moving between their OWN accounts, where the roster is REMAPPED through
 * an archive receipt and the marker is a saved world's immutable birth law.
 * Reconciliation is archive-less and CROSS-ACCOUNT — the gallery shape — and it
 * has just dropped the roster two paragraphs above, so keeping the marker would
 * leave the denial attached to nothing. Reclassifying the imported copy as v1 is
 * the honest act, and it is a reclassification of a COPY: the source account's
 * own world is untouched by an import.
 *
 * ⛔ AND WHY A DROP RATHER THAN THE ACCOUNT IMPORTER'S REMAP — MEASURED, NOT
 * ASSUMED. Both records are keyed on `customDefinition*` identifiers belonging to
 * the source account's immutable ledger, and remapping them requires an
 * archive-backed identity map. A reconciliation source is an export FILE: it
 * carries no ledger archive, no import receipt and no reviewed content pack, so
 * the only map constructible here is the empty `archiveBacked:false` default, and
 * nothing in it can resolve a single source id. Routing through the shared
 * remappers would therefore compute a foregone refusal — every non-null record
 * would drop anyway, byte for byte the same outcome — while dragging
 * `accountSettlementContentPortability.js` and, behind it,
 * `settlementContentProvenance.js` into this module's import closure for no
 * behavioural difference. A boundary with no identity map performs the honest
 * act directly, which is the same rule `scrubGalleryImportLivingContent` states
 * for the other archive-less importer.
 *
 * ⇒ THE DAY THIS BOUNDARY GAINS AN ARCHIVE, this is the function to change:
 * resolve the map, call `remapAccountSettlementLivingContentRoster` and
 * `remapAccountSettlementContentProvenance` from
 * `./accountSettlementContentPortability.js`, and keep the drop as their
 * refusal branch. Nothing else on the path needs to move.
 *
 * ⚠ PRESENCE, NOT VALUE — AND THE REASON IS AN INSTRUMENT THIS FILE IS INSIDE.
 * The condition is `Object.hasOwn`, the house idiom for a strip, rather than a
 * `settlement.customContentRoster != null` truthiness read. Two reasons, and both
 * are real. (1) A strip's question IS presence: a settlement carrying the key
 * explicitly set to `null` is still carrying a source-account field, and removing
 * it is the same honest act. (2) `observedShapeReaders.walker` resolves a
 * `settlement`-shaped receiver in THIS file (it holds a frozen row for
 * `importedFrom on settlement`), and its corpus is GENERATED worlds — which carry
 * neither record. ⚠ THE GROUND FOR THAT LAST CLAUSE WAS "while the living-content
 * dial is dormant", AND IT WAS THE WRONG MECHANISM even before the dial was lit on
 * 2026-09-08: what keeps the roster off that corpus is that the corpus generates
 * with `customContent: {}`, so the roster has no definition to record and the
 * builder writes no key. Measured at the lighting: 0 of 525 golden rows and 0 of
 * 768 RATE towns carry the key under law 2. A value read would therefore still be
 * scored a reader-with-no-writer and would still red a shrink-only ratchet that
 * cannot lawfully be grown. The walker is right about generated worlds and blind
 * to this boundary, whose input is an import FILE; the presence test states the
 * strip without asserting anything about a value no generator writes.
 *
 * @param {Record<string, any>} entry the prepared entry (mutated)
 * @returns {string[]} one message per record that was dropped
 */
function dropReconciledSettlementContentRecords(entry) {
  const settlement = entry && typeof entry.settlement === 'object' && entry.settlement
    ? /** @type {Record<string, any>} */ (entry.settlement)
    : null;
  if (!settlement) return [];
  /** @type {string[]} */
  const dropped = [];

  if (Object.hasOwn(settlement, 'customContentProvenance')) {
    delete settlement.customContentProvenance;
    dropped.push(
      'This import carries no content archive, so the source account\'s '
      + 'custom-content provenance could not be re-addressed. It was removed.',
    );
  }

  if (Object.hasOwn(settlement, 'customContentRoster')) {
    delete settlement.customContentRoster;
    dropped.push(
      'This import carries no content archive, so the source account\'s '
      + 'living-content roster could not be re-addressed. It was removed.',
    );
  }

  // THE FOREIGN BIRTH LAW, on BOTH of the marker's echoes, in the shape
  // `importScrub.js:158-166` already ships for the same act rather than a second
  // one invented here. No message: see the headline above for why the asymmetry
  // with the two records is deliberate.
  for (const echo of ['config', '_config']) {
    const bag = settlement[echo];
    if (
      !bag
      || typeof bag !== 'object'
      || Array.isArray(bag)
      || !Object.hasOwn(bag, LIVING_CONTENT_LAW_CONFIG_KEY)
    ) continue;
    const {
      // The underscore-prefixed binding is the intentional drop of a foreign
      // world's birth-law marker; the lint config already admits that name shape,
      // so no disable directive is needed (and an unused one is itself a warning).
      [LIVING_CONTENT_LAW_CONFIG_KEY]: _livingContentLawVersion,
      ...rest
    } = /** @type {Record<string, any>} */ (bag);
    settlement[echo] = rest;
  }

  return dropped;
}

/**
 * Admit a source campaign's settlement records and build deterministic
 * candidates against the current owner-visible library.
 *
 * @param {unknown} ingest
 * @param {{
 *   targetCampaign:{id?:unknown,name?:unknown,settlementIds?:unknown[]},
 *   existingSettlements?:unknown[],
 *   existingCampaigns?:unknown[],
 *   sourceCampaignId?:string|null,
 * }} options
 */
export async function admitExistingCampaignImport(ingest, options) {
  if (
    !isRecord(ingest)
    || ingest.schemaVersion !== IMPORT_RECONCILIATION_SCHEMA_VERSION
    || ingest.stage !== 'ingested'
    || !isRecord(ingest.source)
    || !cleanText(ingest.source.checksum)
    || !isRecord(ingest.envelope)
    || !Array.isArray(ingest.sourceCampaigns)
    || !Array.isArray(ingest.unsupported)
    || !ingest.unsupported.every(isRecord)
    || !ingest.sourceCampaigns.every(campaign => (
      isRecord(campaign)
      && Boolean(cleanText(campaign.choiceId))
      && Number.isInteger(campaign.sourceIndex)
      && Boolean(cleanText(campaign.name))
      && Array.isArray(campaign.settlementIds)
    ))
  ) {
    return {
      ok: false,
      diagnostic: reconciliationDiagnostic(
        'rejected',
        'ingest_session_invalid',
        'The ingest session is invalid.',
      ),
    };
  }
  const admittedIngest = /** @type {ImportReconciliationIngest} */ (
    /** @type {unknown} */ (ingest)
  );
  const targetCampaignId = sourceIdOf(options?.targetCampaign?.id);
  if (!targetCampaignId) {
    return {
      ok: false,
      diagnostic: reconciliationDiagnostic(
        'rejected',
        'target_campaign_required',
        'Choose an existing target campaign.',
      ),
    };
  }
  const selectedResult = selectedSourceCampaign(admittedIngest, options.sourceCampaignId);
  if (!selectedResult.ok) {
    return {
      ok: false,
      diagnostic: reconciliationDiagnostic(
        'rejected',
        selectedResult.code,
        selectedResult.error,
      ),
    };
  }

  await ensureNormalizeLoaded();
  const selected = selectedResult.campaign;
  const memberIds = selected ? new Set(selected.settlementIds.map(String)) : null;
  const rawSettlements = Array.isArray(admittedIngest.envelope.settlements)
    ? admittedIngest.envelope.settlements
    : [];
  const sourceRowsById = new Map();
  const sourceIdCounts = new Map();
  rawSettlements.forEach((entry, index) => {
    const id = sourceIdOf(entry?.id);
    if (id) {
      sourceRowsById.set(id, index);
      sourceIdCounts.set(id, (sourceIdCounts.get(id) || 0) + 1);
    }
  });

  const proposals = [];
  const claims = [];
  const conflicts = [];
  const unsupported = [
    ...admittedIngest.unsupported,
    ...selectedCampaignMechanics(admittedIngest, selected),
  ];

  if (memberIds) {
    for (const memberId of memberIds) {
      if (sourceRowsById.has(memberId)) continue;
      unsupported.push({
        issueId: reconciliationIssueId(
          `campaign:${selected.choiceId}`,
          'missing-member',
          unsupported.length,
        ),
        scope: 'campaign.settlementIds',
        code: 'source_campaign_member_missing',
        message: `The source campaign references settlement "${memberId}", but its record is absent from the export.`,
      });
    }
  }

  for (let sourceIndex = 0; sourceIndex < rawSettlements.length; sourceIndex += 1) {
    const rawEntry = rawSettlements[sourceIndex];
    const sourceSaveId = sourceIdOf(rawEntry?.id);
    if (memberIds && (!sourceSaveId || !memberIds.has(sourceSaveId))) continue;

    const prepared = prepareSettlementEntry(rawEntry, {
      sourceName: admittedIngest.source.label,
      importedAt: null,
      sourceChecksum: admittedIngest.source.checksum,
      sourceId: sourceSaveId,
    });
    if (prepared.ok !== true) {
      unsupported.push({
        issueId: reconciliationIssueId(
          `source:${admittedIngest.source.checksum}`,
          'settlement-record',
          sourceIndex,
        ),
        scope: `settlements[${sourceIndex}]`,
        code: 'settlement_record_unsupported',
        message: prepared.reason,
        sourceName: cleanText(rawEntry?.name) || 'Unnamed settlement',
      });
      continue;
    }

    const proposalId = reconciliationProposalId(
      admittedIngest.source.checksum,
      sourceIndex,
    );
    // ⛔ BEFORE THE ENTRY IS FROZEN INTO `normalizedInput` — which is what the
    // `import.settlement.create-and-attach` command persists. A source-account
    // roster or provenance receipt that got past here would land in the
    // destination account's world with ids that mean nothing in its namespace.
    dropReconciledSettlementContentRecords(prepared.entry).forEach((message, recordIndex) => {
      unsupported.push({
        issueId: reconciliationIssueId(
          proposalId,
          'settlement-content-record',
          recordIndex,
        ),
        scope: `settlements[${sourceIndex}]`,
        code: 'settlement_content_record_unmappable',
        message,
        sourceName: cleanText(prepared.entry.name) || 'Imported settlement',
      });
    });
    const sourceName = cleanText(prepared.entry.name) || 'Imported settlement';
    const candidates = candidatesForProposal(
      proposalId,
      sourceSaveId,
      sourceName,
      admittedIngest.source.checksum,
      options.existingSettlements,
    );
    const issues = proposalIssues(
      proposalId,
      rawEntry,
      candidates,
      sourceSaveId ? sourceIdCounts.get(sourceSaveId) || 0 : 0,
    );
    const claim = {
      claimId: `claim:${proposalId}`,
      sourceLocation: `settlements[${sourceIndex}]`,
      normalizedText: sourceName,
      proposedKind: 'settlement',
      confidence: 'structured_source',
      parserVersion: IMPORT_RECONCILIATION_PARSER_VERSION,
    };
    const proposal = {
      proposalId,
      claimIds: [claim.claimId],
      sourceIndex,
      sourceSaveId,
      sourceName,
      sourceTier: cleanText(prepared.entry.tier) || null,
      normalizedInput: detachedRecord(prepared.entry),
      candidates,
      conflictIds: issues.conflicts.map(issue => issue.conflictId),
      unsupportedIds: issues.unsupported.map(issue => issue.issueId),
      decision: null,
    };
    claims.push(claim);
    proposals.push(proposal);
    conflicts.push(...issues.conflicts);
    unsupported.push(...issues.unsupported);
  }

  if (!Array.isArray(options.targetCampaign.settlementIds)) {
    return {
      ok: false,
      diagnostic: reconciliationDiagnostic(
        'rejected',
        'target_campaign_membership_invalid',
        'The target campaign has no readable settlement membership list.',
      ),
    };
  }
  const targetMemberIds = options.targetCampaign.settlementIds
    .map(sourceIdOf)
    .filter(Boolean);
  /** @type {Map<string, Record<string, unknown>>} */
  const topologyByCampaignId = new Map();
  for (const candidate of Array.isArray(options.existingCampaigns)
    ? options.existingCampaigns
    : []) {
    if (!isRecord(candidate)) continue;
    if (
      candidate?.accessState != null
      && candidate.accessState !== 'active'
    ) {
      continue;
    }
    const campaignId = sourceIdOf(candidate?.id);
    if (!campaignId) continue;
    if (!Array.isArray(candidate.settlementIds)) {
      return {
        ok: false,
        diagnostic: reconciliationDiagnostic(
          'rejected',
          'existing_campaign_membership_invalid',
          'An existing campaign has no readable settlement membership list.',
        ),
      };
    }
    topologyByCampaignId.set(campaignId, candidate);
  }
  // The explicit target is always part of the reviewed topology, even for
  // older callers that have not supplied the full campaign collection.
  topologyByCampaignId.set(targetCampaignId, options.targetCampaign);
  const existingCampaigns = [...topologyByCampaignId.values()];
  const existingMemberships = [];
  for (const save of Array.isArray(options.existingSettlements)
    ? options.existingSettlements
    : []) {
    if (!isRecord(save)) continue;
    const saveId = sourceIdOf(save.id);
    if (!saveId) continue;
    const campaigns = existingCampaigns
      .filter(candidate => (
        sourceIdOf(candidate?.id)
        && Array.isArray(candidate?.settlementIds)
        && candidate.settlementIds.some(memberId => String(memberId) === saveId)
      ))
      .map(candidate => ({
        campaignId: sourceIdOf(candidate.id),
        campaignName: cleanText(candidate.name) || sourceIdOf(candidate.id),
      }))
      .sort((left, right) => left.campaignId.localeCompare(right.campaignId));
    existingMemberships.push({ saveId, campaigns });
  }
  existingMemberships.sort((left, right) => left.saveId.localeCompare(right.saveId));
  const sessionId = [
    'irs',
    reconciliationStableToken(admittedIngest.source.checksum),
    reconciliationStableToken(selected?.choiceId || 'all-settlements'),
    reconciliationStableToken(targetCampaignId),
  ].join(':');
  const session = {
    schemaVersion: IMPORT_RECONCILIATION_SCHEMA_VERSION,
    sessionId,
    stage: 'reconciling',
    source: admittedIngest.source,
    scope: {
      targetCampaignId,
      targetCampaignName: cleanText(options.targetCampaign.name) || targetCampaignId,
      targetMemberIds,
      existingMemberships,
      sourceCampaignChoiceId: selected?.choiceId || null,
      sourceCampaignId: selected?.sourceId || null,
      sourceCampaignName: selected?.name || null,
    },
    claims,
    proposals,
    conflicts,
    unsupported,
    commandDrafts: [],
    preview: null,
    applicationReceipt: null,
  };

  return {
    ok: true,
    value: deepFreeze(
      /** @type {ImportReconciliationSession} */ (
        /** @type {unknown} */ (detachedRecord(session))
      ),
    ),
    diagnostic: reconciliationDiagnostic(
      'current',
      'reconciliation_admitted',
      `${proposals.length} settlement proposal${proposals.length === 1 ? '' : 's'} admitted.`,
    ),
  };
}

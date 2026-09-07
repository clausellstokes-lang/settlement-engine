const root = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const P = await import(root + '/src/lib/accountSettlementContentPortability.js');
const SCP = await import(root + '/src/domain/content/settlementContentProvenance.js');
const { fingerprintContent } = await import(root + '/src/domain/content/contentFingerprint.js');
const emptyMap = {
  namespace: 'dest', definitionIds: new Map(), revisionIds: new Map(), localUids: new Map(),
  packIds: new Map(), environmentIds: new Map(), environmentRevisionIds: new Map(),
  revisionContentHashes: new Map(), revisionNumbers: new Map(), environmentHashes: new Map(),
  archiveBacked: false, importedData: {}, diagnostics: [],
};
const show = (label, r) => console.log(label, JSON.stringify(r).slice(0, 400));

// 1. roster with an account-identity row
show('roster/account-id row:', P.remapAccountSettlementLivingContentRoster(
  { schemaVersion: 1, buckets: { deities: [{ customDefinitionId: 'src-def', customDefinitionRevisionId: 'src-rev' }] } }, emptyMap));
// 2. roster local-only row
show('roster/local-only row:', P.remapAccountSettlementLivingContentRoster(
  { schemaVersion: 1, buckets: { deities: [{ localUid: 'src-lu' }] } }, emptyMap));
// 3. roster with EMPTY bucket arrays
show('roster/empty buckets:', P.remapAccountSettlementLivingContentRoster(
  { schemaVersion: 1, buckets: { deities: [] } }, emptyMap));
// 4. provenance with ZERO materialized definitions
const core = {
  schemaVersion: SCP.SETTLEMENT_CONTENT_PROVENANCE_SCHEMA_VERSION,
  scope: 'standalone', environment: null, bindingHash: null, materializedDefinitions: [],
};
const receipt = { ...core, receiptHash: fingerprintContent(core) };
show('provenance/zero defs ADMIT:', SCP.admitSettlementContentProvenance(receipt));
show('provenance/zero defs REMAP:', P.remapAccountSettlementContentProvenance(receipt, emptyMap));
// 5. provenance with one definition
const core2 = { ...core, materializedDefinitions: [{ definitionId: 'src-def', revisionId: 'src-rev', contentHash: 'a'.repeat(64) }] };
const receipt2 = { ...core2, receiptHash: fingerprintContent(core2) };
show('provenance/one def REMAP:', P.remapAccountSettlementContentProvenance(receipt2, emptyMap));

const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const { remapAccountSettlementLivingContentRoster } =
  await import(`${D}/src/lib/accountSettlementContentPortability.js`);
const { buildLivingContentRoster } =
  await import(`${D}/src/domain/content/livingContentRoster.js`);
const { LIVING_CONTENT_LAW_CONFIG_KEY, ROSTER_LIVING_CONTENT_LAW_VERSION } =
  await import(`${D}/src/domain/content/livingContentLawVersion.js`);
const { buildImportedAccountArchiveIdentityMap } =
  await import(`${D}/src/lib/accountContentPortability.js`);

const LIT = { [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION };

// P2 — a roster the REAL builder mints from RAW (never-archived) local content.
const rawContent = {
  deities: [{ localUid: 'lu_local_1', name: 'Local One' }],
};
const builtRaw = buildLivingContentRoster(rawContent, LIT);
console.log('P2 built-from-raw roster:', JSON.stringify(builtRaw));
const fullMap = buildImportedAccountArchiveIdentityMap({
  namespace: 'account-content:test',
  identityMap: {
    definitionIds: [], revisionIds: [],
    localUids: [{ sourceId: 'lu_local_1', destinationId: 'lu_dst_1' }],
    packIds: [], environmentIds: [], environmentRevisionIds: [],
  },
});
const r2 = remapAccountSettlementLivingContentRoster(builtRaw, fullMap.identityMap);
console.log('P2 remap of a real, fully-localUid-mapped roster:', JSON.stringify(r2));

// P2b — a MIXED roster: one archived row (resolvable) + one local-only row.
const hash = 'a'.repeat(64);
const mixed = {
  schemaVersion: 1,
  buckets: {
    deities: [
      { source:'custom', isCustom:true, customDefinitionCategory:'deities',
        localUid:'lu_a', customDefinitionId:'src-a', customDefinitionRevisionId:'src-a-r1',
        customDefinitionContentHash: hash },
      { source:'custom', isCustom:true, customDefinitionCategory:'deities',
        localUid:'lu_local_1', name:'Local One' },
    ],
  },
};
const mixedMap = buildImportedAccountArchiveIdentityMap({
  namespace: 'account-content:test',
  identityMap: {
    definitionIds: [{ sourceId:'src-a', destinationId:'dst-a' }],
    revisionIds: [{ sourceId:'src-a-r1', destinationId:'dst-a-r1', destinationContentHash: 'b'.repeat(64) }],
    localUids: [
      { sourceId:'lu_a', destinationId:'dst-lu-a' },
      { sourceId:'lu_local_1', destinationId:'dst-lu-1' },
    ],
    packIds: [], environmentIds: [], environmentRevisionIds: [],
  },
});
console.log('P2b mixed roster remap:', JSON.stringify(
  remapAccountSettlementLivingContentRoster(mixed, mixedMap.identityMap)));

// P3 — foreign/unknown keys and an arbitrary bucket name survive verbatim.
const hostile = {
  schemaVersion: 99,
  buckets: {
    'not-a-law-bucket': [
      { customDefinitionId:'src-a', customDefinitionRevisionId:'src-a-r1',
        sourceAccountEmail:'victim@example.test',
        payload: { deep: 'x'.repeat(20) } },
    ],
  },
};
const r3 = remapAccountSettlementLivingContentRoster(hostile, mixedMap.identityMap);
console.log('P3 hostile roster remap:', JSON.stringify(r3));

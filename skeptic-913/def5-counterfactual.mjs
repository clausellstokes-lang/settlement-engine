const TIP = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT/src';
const PRE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skeptic-913/revert/src';
const roster = { schemaVersion: 1, buckets: { deities: [
  { source: 'custom', isCustom: true, customDefinitionCategory: 'deities', localUid: 'src-lu-1', name: 'Local Patron' },
] } };
const map = {
  namespace: 'dest', definitionIds: new Map(), revisionIds: new Map(),
  localUids: new Map([['src-lu-1', 'dest-lu-1']]),
  packIds: new Map(), environmentIds: new Map(), environmentRevisionIds: new Map(),
  revisionContentHashes: new Map(), revisionNumbers: new Map(), environmentHashes: new Map(),
  archiveBacked: true, importedData: {}, diagnostics: [],
};
for (const [label, base] of [['PRE-CURE (7d96e2b72)', PRE], ['TIP (f46ba7846)', TIP]]) {
  const m = await import(base + '/lib/accountSettlementContentPortability.js');
  const r = m.remapAccountSettlementLivingContentRoster(roster, map);
  console.log(label, '=>', JSON.stringify(r).slice(0, 300));
}

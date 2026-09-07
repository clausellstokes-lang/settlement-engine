const root = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const AI = await import(root + '/src/lib/accountImport.js');
await AI.ensureNormalizeLoaded();
const roster = { schemaVersion: 1, buckets: { deities: [{ source:'custom', isCustom:true, customDefinitionCategory:'deities', localUid:'lu_x', customDefinitionId: 'src-secret-def', customDefinitionRevisionId:'src-rev', name:'Aster' }] } };
const settlement = { name: 'Rosterton', tier: 'town', config: { settType: 'town' }, customContentRoster: roster };
const raw = {
  id: 'a-1', user_id: 'USER-A', name: 'Rosterton', tier: 'town',
  settlement,
  versionHistory: [{ id: 'snap-1', ts: 1750000000000, kind: 'manual', label: 'Before the fire',
    settlement: { ...settlement, name: 'Rosterton (before)' } }],
};
const r = AI.prepareSettlementEntry(raw, { sourceName: 'src', importedAt: null, sourceChecksum: 'ck', sourceId: 'a-1' });
console.log('ok', r.ok, r.reason || '');
console.log('vh length', r.entry?.versionHistory?.length);
console.log('SNAPSHOT roster survives prepareSettlementEntry:',
  JSON.stringify(r.entry?.versionHistory?.[0]?.settlement?.customContentRoster?.buckets?.deities?.[0]?.customDefinitionId));
console.log('LIVE settlement roster (what the reconciliation drop removes):',
  JSON.stringify(r.entry?.settlement?.customContentRoster?.buckets?.deities?.[0]?.customDefinitionId));

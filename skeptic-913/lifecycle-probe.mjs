const root = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const AI = await import(root + '/src/lib/accountImport.js');
await AI.ensureNormalizeLoaded();
const settlement = { name: 'Rosterton', tier: 'town', config: { settType: 'town' }, customContentRoster: { schemaVersion:1, buckets:{deities:[{customDefinitionId:'src-secret-def'}]} } };
const raw = { id:'a-1', name:'Rosterton', tier:'town', settlement,
  versionHistory: [{ id:'snap-1', ts:1750000000000, kind:'manual', label:'Before the fire', settlement: { ...settlement, name:'Rosterton (before)' } }] };
const lc = AI.admitRestoredLifecycle(raw);
console.log('notices', JSON.stringify(lc.notices));
console.log('vh len', lc.versionHistory.length);
const { admitSavedSettlementEntries } = await import(root + '/src/lib/saveAdmission.js');
const probe = admitSavedSettlementEntries([{ id:'p', settlement:{}, aiData:{}, campaignState:lc.campaignState, versionHistory: raw.versionHistory }], { source:'x', requireSettlement:true, targetSchemaVersion:null });
console.log('admit entries', JSON.stringify(probe).slice(0,600));

const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const m = await import(`${D}/src/lib/accountImport.js`);
await m.ensureNormalizeLoaded();
const entry = {
  name: 'Foreign Town',
  settlement: {
    name: 'Foreign Town', tier: 'town', schemaVersion: 1,
    config: { settType: 'town', _livingContentLawVersion: 2 },
    customContentRoster: { schemaVersion: 1, buckets: { stressors: [
      { source:'custom', isCustom:true, customDefinitionCategory:'stressors',
        localUid:'foreign-uid', customDefinitionId:'definition:stressors:foreign',
        customDefinitionRevisionId:'revision:stressors:foreign:1',
        customDefinitionContentHash:'a'.repeat(64), name:'Foreign Stressor',
        SMUGGLED_KEY:'not admitted by any manifest' } ] } },
  },
};
const r = m.prepareSettlementEntry(entry, { importedAt: null });
console.log('ok=', r.ok, r.reason || '');
const s = r.entry?.settlement || {};
console.log('roster key survives prepareSettlementEntry:', Object.hasOwn(s,'customContentRoster'));
console.log('source ids intact:', JSON.stringify(s.customContentRoster?.buckets?.stressors?.[0]?.customDefinitionId));
console.log('smuggled key survives:', s.customContentRoster?.buckets?.stressors?.[0]?.SMUGGLED_KEY);
console.log('config marker after scrub:', s.config?._livingContentLawVersion);

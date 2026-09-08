const ai = await import('./src/lib/accountImport.js');
await ai.ensureNormalizeLoaded();
const roster = { schemaVersion: 1, buckets: { deities: [{ source: 'custom', isCustom: true, customDefinitionId: 'src-1', customDefinitionRevisionId: 'src-1-r1', localUid: 'lu_1', name: 'Aster' }] } };
const raw = {
  id: 'a-1', name: 'Harbor', tier: 'town',
  settlement: {
    name: 'Harbor', tier: 'town', population: 900,
    config: { settType: 'town', _livingContentLawVersion: 2 },
    customContentRoster: roster,
    customContentProvenance: { schemaVersion: 1, receiptHash: 'r', scope: 'standalone', environment: null, bindingHash: null, materializedDefinitions: [] },
  },
};
const prepared = ai.prepareSettlementEntry(raw, { sourceName: 'probe', importedAt: null });
console.log('ok =', prepared.ok);
console.log('roster survives prepareSettlementEntry =', prepared.entry?.settlement?.customContentRoster != null);
console.log('roster ids unchanged =', JSON.stringify(prepared.entry?.settlement?.customContentRoster?.buckets?.deities?.[0]?.customDefinitionId));
console.log('provenance survives =', prepared.entry?.settlement?.customContentProvenance != null);
console.log('law marker survives on config =', prepared.entry?.settlement?.config?._livingContentLawVersion);

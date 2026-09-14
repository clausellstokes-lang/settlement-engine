const D = process.argv[2];
const { birthConfig, loadGenerationLawPayloads } = await import(`${D}/src/domain/density/densityCreateBoundary.js`);
const { generateSettlementPipeline } = await import(`${D}/src/generators/generateSettlementPipeline.js`);
const { LIVING_CONTENT_LAW_CONFIG_KEY, ROSTER_LIVING_CONTENT_LAW_VERSION, resolveLivingContentLawVersion } = await import(`${D}/src/domain/content/livingContentLawVersion.js`);
const { customContentReferencePack, identifyCustomContentPack } = await import(`${D}/tests/fixtures/customContentReferencePack.js`);
const { ACCOUNT_EXPORT_VERSION } = await import(`${D}/src/lib/accountData.js`);
const { ingestSettlementForgeExport, admitExistingCampaignImport } = await import(`${D}/src/lib/importReconciliation.js`);

await loadGenerationLawPayloads();
const world = generateSettlementPipeline(
  birthConfig({ settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'crossroads', monsterThreat: 'civilized' }),
  null,
  { seed: 'lgt-reconcile-lit-product', customContent: identifyCustomContentPack(customContentReferencePack()) },
);
console.log('MINTED  config marker :', world.config?.[LIVING_CONTENT_LAW_CONFIG_KEY]);
console.log('MINTED _config marker :', world._config?.[LIVING_CONTENT_LAW_CONFIG_KEY]);
console.log('MINTED roster present :', Object.hasOwn(world, 'customContentRoster'));
console.log('MINTED provenance     :', Boolean(world.customContentProvenance));
console.log('MINTED name           :', world.name);

const text = JSON.stringify({
  version: ACCOUNT_EXPORT_VERSION,
  settlements: [{ id: 's-1', name: 'Ashford', tier: 'town', settlement: JSON.parse(JSON.stringify(world)) }],
  campaigns: [],
});
console.log('envelope bytes        :', Buffer.byteLength(text));
const ingest = ingestSettlementForgeExport(text, { label: 'x.sf.json', ingestedAt: '2026-07-24T12:00:00.000Z', storageRef: 'local-file:x' });
console.log('ingest ok             :', ingest.ok, ingest.ok ? '' : JSON.stringify(ingest.diagnostic));
const admitted = await admitExistingCampaignImport(ingest.value, {
  targetCampaign: { id: 'target-campaign', name: 'Current campaign', settlementIds: [] },
  existingSettlements: [], existingCampaigns: [], sourceCampaignId: undefined,
});
console.log('admit ok              :', admitted.ok);
const p = admitted.value.proposals[0].normalizedInput.settlement;
console.log('PERSISTED  config has :', Object.hasOwn(p.config || {}, LIVING_CONTENT_LAW_CONFIG_KEY));
console.log('PERSISTED _config has :', p._config ? Object.hasOwn(p._config, LIVING_CONTENT_LAW_CONFIG_KEY) : '(no _config key)');
console.log('PERSISTED resolved law:', resolveLivingContentLawVersion(p.config), 'expect 1');
console.log('PERSISTED roster      :', p.customContentRoster);
console.log('PERSISTED provenance  :', p.customContentProvenance);
console.log('PERSISTED name        :', p.name);
console.log('unsupported codes     :', admitted.value.unsupported.map(u => u.code).join(', '));
console.log('config frozen?        :', Object.isFrozen(p.config));

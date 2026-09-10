const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const S = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/lmatfix';
const { migrateSettlementConfig } = await import(`${D}/src/lib/settlementConfigMigration.js`);
const { isAllowedConfigKey } = await import(`${D}/src/store/configSlice.js`);
const { materializesLivingContent, ROSTER_LIVING_CONTENT_LAW_VERSION } =
  await import(`${D}/src/domain/content/livingContentLawVersion.js`);
const { NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION } =
  await import(`${D}/src/domain/content/livingContentLaw.js`);
const { buildLivingContentRoster } = await import(`${D}/src/domain/content/livingContentRoster.js`);
const before = (await import(`${S}/boundary-BEFORE.mjs`)).birthConfig;
const after = (await import(`${D}/src/domain/density/densityCreateBoundary.js`)).birthConfig;

const importedConfig = { settType: 'town', _livingContentLawVersion: 2 };
const migrated = migrateSettlementConfig(importedConfig);
console.log('1 dial (shipped):', NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION, 'lit:', ROSTER_LIVING_CONTENT_LAW_VERSION);
console.log('2 migrateConfig keeps marker:', migrated._livingContentLawVersion);
console.log('3 isAllowedConfigKey:', isAllowedConfigKey('_livingContentLawVersion'));
const pack = { deities: [{ localUid: 'lu_mine', name: 'My Deity', definitionId: 'd1', revisionId: 'r1', contentHash: 'f'.repeat(64) }] };
for (const [label, fn] of [['BEFORE (HEAD 7d96e2b72)', before], ['AFTER  (clamped)', after]]) {
  const born = fn(migrated);
  console.log(`--- ${label}`);
  console.log('   4 birthConfig marker on a DARK build:', born._livingContentLawVersion);
  console.log('   4b key present at all:', Object.hasOwn(born, '_livingContentLawVersion'));
  console.log('   5 materializesLivingContent(born):', materializesLivingContent(born));
  console.log('   6 roster minted on a DARK build:', JSON.stringify(buildLivingContentRoster(pack, born)));
  console.log('   7 every other key carried:', JSON.stringify(born));
}

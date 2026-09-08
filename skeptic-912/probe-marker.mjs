const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const { prepareSettlementEntry, ensureNormalizeLoaded } = await import(`${D}/src/lib/accountImport.js`);
await ensureNormalizeLoaded();
const r = prepareSettlementEntry(
  { name: 'W', settlement: {
      name: 'W', tier: 'town',
      config: { settType: 'town', _livingContentLawVersion: 2, _seed: 7 },
      _config: { settType: 'town', _livingContentLawVersion: 2, _seed: 7 },
  } },
  { sourceName: 'src', importedAt: '2026-01-01T00:00:00.000Z', restoreLifecycle: true },
);
console.log('ok:', r.ok);
console.log('config after prepare:', JSON.stringify(r.entry?.settlement?.config));
console.log('_config after prepare:', JSON.stringify(r.entry?.settlement?._config));
const { migrateConfig } = await import(`${D}/src/domain/migrateConfig.js`).catch(() => ({}));
if (migrateConfig) {
  console.log('migrateConfig keeps marker:',
    JSON.stringify(migrateConfig({ settType:'town', _livingContentLawVersion: 2 })._livingContentLawVersion));
}

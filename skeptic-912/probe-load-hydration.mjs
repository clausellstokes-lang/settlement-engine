// SKEPTIC PROBE (read-only): is the store config REALLY never hydrated from a
// saved settlement?  SettlementsPanel.onLoad does
//   rawConfig = data.settlement?._config || data.config; updateConfig(migrateConfig(rawConfig))
const D = process.argv[2];
const { generateSettlementPipeline } = await import(`${D}/src/generators/generateSettlementPipeline.js`);
const { migrateSettlementConfig } = await import(`${D}/src/lib/settlementConfigMigration.js`);
const { isAllowedConfigKey } = await import(`${D}/src/store/configSlice.js`);
const { birthConfig } = await import(`${D}/src/domain/density/densityCreateBoundary.js`);
const { registerLivingContentRosterBuilder } = await import(`${D}/src/domain/content/livingContentSeam.js`);
const { buildLivingContentRoster } = await import(`${D}/src/domain/content/livingContentRoster.js`);
registerLivingContentRosterBuilder(buildLivingContentRoster);
const KEY = '_livingContentLawVersion';
const CONFIG = { settType:'town', culture:'germanic', terrainOverride:'plains', tradeRouteAccess:'crossroads', monsterThreat:'civilized' };
// A LIT birth, exactly what birthConfig will produce the day the dial moves.
const litBirth = { ...birthConfig({ ...CONFIG }), [KEY]: 2 };
const lit = generateSettlementPipeline(litBirth, null, { seed: 'skeptic-load' });
console.log('lit settlement.config[KEY]      =', lit.config[KEY]);
console.log('lit settlement._config[KEY]     =', lit._config?.[KEY]);
const hydrated = migrateSettlementConfig(lit._config || lit.config);
console.log('after migrateConfig, KEY        =', hydrated[KEY]);
console.log('isAllowedConfigKey(KEY)         =', isAllowedConfigKey(KEY));
console.log('=> the wizard form would carry  =', hydrated[KEY] !== undefined && isAllowedConfigKey(KEY));

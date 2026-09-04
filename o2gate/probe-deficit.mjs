const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree/';
const { economyStateProse } = await import(D + 'src/domain/display/stateProse/economyStateProse.js');
const { drawnAtMount } = await import(D + 'src/domain/display/stateProse/dossierMounts.js');
const { deriveFoodBalance } = await import(D + 'src/domain/display/dossierViewModel.js');

const s = {
  id: 'forge_town', name: 'Forge Town', _seed: 'forge_town', tier: 'town',
  economicState: {
    prosperity: 'Comfortable', economicComplexity: 'a market town', tradeAccess: 'road',
    situationDesc: 'The market square keeps its hours.',
    activeChains: [], incomeSources: [], institutionalServices: [],
    foodSecurity: { label: 'Deficit', stockpile: {} },
  },
  economicViability: { metrics: { foodBalance: {
    dailyProduction: 600, dailyNeed: 1000, deficit: 400, surplus: 0,
    importCoverage: 0, rawDeficit: 400, agricultureModifier: 1 } } },
};
const fbal = deriveFoodBalance(s);
console.log('deriveFoodBalance ->', JSON.stringify(fbal));
const d = economyStateProse(s, { foodBalance: fbal, granaryOutlook: { available: false } }, { seed: String(s._seed) });
console.log('HEADER :', JSON.stringify(drawnAtMount('economics.prosperityHeader', d.prosperityHeader)?.sentence));
console.log('FOODSEC:', JSON.stringify(drawnAtMount('economics.foodSecurity', d.foodSecurityRung)?.sentence));

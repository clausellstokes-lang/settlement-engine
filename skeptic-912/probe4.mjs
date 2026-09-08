const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const { generateSettlementPipeline } = await import(`${D}/src/generators/generateSettlementPipeline.js`);
const cfg = { settType:'town', culture:'germanic', terrainOverride:'plains', tradeRouteAccess:'crossroads', monsterThreat:'civilized', _livingContentLawVersion: 2 };
try {
  const s = generateSettlementPipeline(cfg, null, { seed: 'skeptic-912', customContent: {} });
  console.log('NO THROW; roster present =', Object.hasOwn(s,'customContentRoster'));
} catch (e) { console.log('THREW:', String(e.message).slice(0,80)); }

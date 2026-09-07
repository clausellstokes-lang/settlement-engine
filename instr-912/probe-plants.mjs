const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR';
const { generateSettlementPipeline } = await import(`file://${D}/src/generators/generateSettlementPipeline.js`);
const { collectPlotHooks, countPlotHookCategories, PLOT_HOOK_CATEGORIES } = await import(`file://${D}/src/domain/dossier/plotHooks.js`);
const s = generateSettlementPipeline({settType:'town',culture:'germanic',terrain:'grassland',tradeRouteAccess:'road'}, null, {seed:'car6-probe', customContent:{}});
const hooks = collectPlotHooks(s, {});
console.log('categories:', Object.keys(PLOT_HOOK_CATEGORIES));
console.log('hooks:', hooks.length);
console.log(JSON.stringify(hooks.slice(0,4), null, 1).slice(0, 1200));
console.log('counts:', JSON.stringify(countPlotHookCategories(hooks)));

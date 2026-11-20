// PLACE-1 · viabilityHooks MEASURE: every hook TEMPLATE the writers can store in economicViability.plotHooks[], by its
// opening words. Writers: `src/generators/economy/foodBalance.js :: deriveFoodBalanceAnalysis` (F*) and
// `:: deriveSupplyRiskAnalysis` (S*, T*, I*), the latter's twins resolved through `resolveSibling(…, OUTLOOK_HOOK_SIBLINGS)`
// (`src/generators/economy/outlookHookSiblings.js`).
export const TEMPLATES = [
  ['F1.routeCut', /^The \S+ trade route is cut, and nothing has come along it/],
  ['F2.nothingBought', /^No food can be bought in from outside now/],
  ['F3.sourceFailed', /^The .+ failed here this year, and /],
  ['F4.poorHarvest', /^A poor harvest somewhere else has spiked the price of grain/],
  ['S1.starving', /^The settlement is starving\. Its hungriest are turning to banditry, and a merchant/],
  ['S1t.moderateGapTwin', /^The settlement grows less food than it eats, and a merchant has offered/],
  ['S1s.starvingShut', /^The settlement is starving, and its hungriest are turning to banditry\.$/],
  ['S1b.starvingBesieged', /^The settlement is starving, and its hungriest steal/],
  ['S2.hoarded', /^No food comes in by trade now, and what is left here is in a few hands/],
  ['S3.importer', /^One importer now holds all the grain/],
  ['S4.dam', /^A town upstream has dammed the river/],
  ['S5.blockade', /^Ships sit across the harbour mouth/],
  ['S6.bandits', /^Bandits are taking the food caravans/],
  ['T1.forest', /^Something is killing the forest the timber comes from/],
  ['T2.rafts', /^The timber rafts stopped coming/],
  ['T2t.carts', /^The timber carts stopped coming/],
  ['T3.short', /^Timber is short this season/],
  ['I1.war', /^War has taken the iron/],
  ['I2.price', /^Iron has doubled in price this season/],
  ['I3.carts', /^The iron carts are three weeks late/],
  ['I4.toll', /^A new toll on the iron road/],
];
/** @param {string} text @returns {string} the template id, or `?` */
export const templateOf = (text) => (TEMPLATES.find(([, re]) => re.test(String(text))) || ['?'])[0];

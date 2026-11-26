let L = null;
const SELF = /feeds itself|grows what it eats|What .* eats it grows|has to come from outside/;
export async function measure(t, { tree }) {
  L ||= { vm: await import(`${tree}/src/domain/display/dossierViewModel.js`), fr: await import(`${tree}/src/domain/display/foodRowShown.js`), fc: await import(`${tree}/src/domain/display/foodCarrier.js`), tl: await import(`${tree}/src/domain/display/tradeListDisplay.js`), cs: await import(`${tree}/src/domain/display/commoditiesShown.js`) };
  const arriving = L.tl.tradeListsAsPrinted(t).imports.map(String);
  const pres = arriving.some((x) => /preserved provisions/i.test(x)); const game = arriving.some((x) => /game and hides/i.test(x));
  if (!pres && !game) return { hit: false };
  const lb = Number(L.fr.foodRowShown(t, !!L.fc.carriersOf(t, t.economicState))?.fb?.importCoverage) || 0;
  const summary = String(L.vm.deriveViability(t).summary || '');
  return { hit: true, pres, game, lb, otherFood: arriving.filter((x) => L.cs.isFoodSourceGood(x)), self: SELF.test(summary), summary: summary.slice(0, 120) };
}

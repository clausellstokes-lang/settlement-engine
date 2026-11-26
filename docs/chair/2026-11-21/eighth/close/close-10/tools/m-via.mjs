let L = null;
const FOOD = /grain|food|flour|bread|fish|meat|provision|cattle|livestock|dairy|fruit|vegetable|rice|wheat|barley|salt fish|foodstuff|produce|dates/i;
export async function measure(t, { tree }) {
  L ||= {
    vm: await import(`${tree}/src/domain/display/dossierViewModel.js`),
    fr: await import(`${tree}/src/domain/display/foodRowShown.js`),
    fc: await import(`${tree}/src/domain/display/foodCarrier.js`),
    tl: await import(`${tree}/src/domain/display/tradeListDisplay.js`),
    gd: await import(`${tree}/src/components/new/generalDeskRead.js`),
    fs2: await import('/home/user/wt-via/src/domain/display/commoditiesShown.js'),
    gc: await import(`${tree}/src/domain/region/goodsCatalog.js`),
  };
  const v = L.vm.deriveViability(t);
  const row = L.fr.foodRowShown(t, !!L.fc.carriersOf(t, t.economicState));
  const lists = L.tl.tradeListsAsPrinted(t);
  const stress = JSON.stringify(t.stress || []);
  let gen = ''; try { gen = JSON.stringify(L.gd.generalDeskLines(t)); } catch (e) { gen = 'ERR'; }
  return {
    verdict: v.verdict, summary: v.summary,
    foodLb: Number(row?.fb?.importCoverage) || 0,
    arriving: lists.imports.map(String), arrivingFood: lists.imports.map(String).filter((x) => FOOD.test(x)), arrivingFoodSrc: lists.imports.map(String).filter((x) => L.fs2.isFoodSourceGood(x)), arrivingFoodCat: lists.imports.map(String).filter((x) => L.gc.normalizeGood(x)?.category === 'food'),
    needed: lists.needed.map(String), debt: /more than it can ever repay/.test(stress),
    emptyLine: lists.imports.length ? null : L.tl.importsEmptyLineShown(row?.fb),
    genBuysIn: /buys in (some of )?what it cannot make/.test(gen), genSome: /buys in some of what it cannot make/.test(gen),
  };
}

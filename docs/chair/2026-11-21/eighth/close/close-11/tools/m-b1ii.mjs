let g = null, f = null, v = null;
export async function measure(t, { tree }) {
  g ||= await import(`${tree}/src/domain/traditions/genesis.js`);
  f ||= await import(`${tree}/src/domain/facts/factsOf.js`);
  v ||= await import(`${tree}/src/domain/facts/factVocabulary.js`);
  const facts = f.factsOf(t);
  return {
    gv: t.generatorVersion ?? null,
    sources: t.economicState?.foodSecurity?.foodRecord?.foodSources ?? null,
    farmland: v.atomHolds('institution: farmland', facts) ?? null,
    trads: g.deriveFoundingTraditions(t).map((r) => [r.coreMotif.element, r.coreMotif.act, r.name]),
  };
}

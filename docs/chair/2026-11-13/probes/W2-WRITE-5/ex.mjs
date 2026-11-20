// the default extractor: a compact read of the town for the line reads
export default function ex(t, f) {
  const inst = (t.institutions || []).map((i) => i.name);
  const ra = t.economicState?.resourceAnalysis || t.resourceAnalysis || {};
  return {
    tier: t.tier, pop: t.population, popBand: f.populationBand, crises: (Array.isArray(t.stress) ? t.stress : t.stress ? [t.stress] : []).map((s) => s.type),
    def: f.defence, guard: f.guardPresence, soldiers: !!f.soldiers, prosperity: f.prosperity, crime: f.crime, food: f.famine?.band, stores: f.storesMonths,
    magic: f.magic?.functions ? true : false, sacredHouse: f.sacredHouse, threat: f.threat, route: f.route, terrain: f.terrain,
    inst, imports: ra.imports ? { critical: ra.imports.critical, reasons: ra.imports.reasons } : null,
  };
}

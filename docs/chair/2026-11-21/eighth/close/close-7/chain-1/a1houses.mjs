const root = '/home/user/wt/a1/src';
const { institutionalCatalog, INSTITUTION_TIERS } = await import(root + '/data/institutionalCatalog.js');
const { resolveServiceCatalogKey } = await import(root + '/generators/services/institutionServices.js');
const { INSTITUTION_SERVICES } = await import(root + '/data/tradeGoodsData.js');
const { INSTITUTION_SERVICES: IS2 } = await import(root + '/data/institutionServices.js');
console.log('same table:', INSTITUTION_SERVICES === IS2, Object.keys(INSTITUTION_SERVICES).length, Object.keys(IS2).length);
const SICK = new Set(['Healing', 'Healing (nature)', 'Higher healing', 'Basic wound care', 'Medical care (basic)', 'Medical treatment',
  'Medical consultation', 'Surgery', 'Surgical procedures', 'Herbal remedies', 'Healing herbs', 'Herbal medicines', 'Herbalism and healing',
  'Fever and illness', 'Remove minor disease', 'Emergency treatment', 'Wound closing', 'Wound treatment', 'Specialist care',
  'Specialist physicians', 'Recovery wards', 'Long-term recovery', 'Quarantine', 'Antitoxins', 'Poison antidotes', 'Compound medicines',
  'Medicines and compounds', 'Specialist compounds', 'Birth assistance', 'Midwifery']);
const byKey = {};
for (const tier of INSTITUTION_TIERS) for (const [shelf, rows] of Object.entries(institutionalCatalog[tier] || {})) for (const name of Object.keys(rows)) {
  const k = resolveServiceCatalogKey(name); if (!k) continue;
  if (!Object.keys(INSTITUTION_SERVICES[k]).some((s) => SICK.has(s))) continue;
  ((byKey[k] ||= {})[name] ||= []).push(tier);
}
for (const [k, names] of Object.entries(byKey)) console.log(`${k} <= ` + Object.entries(names).map(([n, t]) => `${n} [${t.join(',')}]`).join('; '));
// catalogue keys with sick rows that no catalog name resolves to
for (const k of Object.keys(INSTITUTION_SERVICES)) if (Object.keys(INSTITUTION_SERVICES[k]).some((s) => SICK.has(s)) && !byKey[k]) console.log('NO ROSTER NAME RESOLVES TO:', k);

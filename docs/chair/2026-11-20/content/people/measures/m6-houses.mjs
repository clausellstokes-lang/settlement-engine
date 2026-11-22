// PEOPLE-2 seat M6 (2026-11-20): THE HOUSE LIST (the verdict's item 5: "no wording may NEED a house of a hideable kind
// (src/domain/people/cardVeil.js :: isHideableHouse) or any fact about crime; every OTHER house a wording needs is LISTED").
//
// For every pool (the first tranche as ruled, m6-pools.mjs; the second, m6-tranche2.mjs) it lists the atoms its wordings need
// or exclude, and marks the HOUSE atoms (an atom whose home reads the place's houses: a church, a temple, a monastery, a
// bank, docks, a market, a guild, a court, a legal house, walls, a watch, a garrison, a militia, a paid watch, soldiers).
// THE CHECK, by birth, on the same 150 places a size: each house atom is read twice through factsOf (the vocabulary's homes,
// read here as m6-common.mjs :: atomHolds reads them): on the born record, and on the same record with every house
// `isHideableHouse` marks taken off its roster (`institutions`). A house atom that holds on the first and not on the second
// NEEDED a hideable house in that place: the count of such places is printed per atom (expected 0). It also prints how many
// hideable houses the sample holds, by size, so a zero is not the zero of an empty sample.
// Usage: node m6-houses.mjs <checkout> <n per size>   (prints count lines only)
import { atomHolds, SIZES } from './m6-common.mjs';
import { RELATION_POOLS, DESC_POOLS, CODA_POOLS } from './m6-pools.mjs';
import { DESC_POOLS_2, CODA_POOLS_2 } from './m6-tranche2.mjs';

const [, , L, nArg = '150'] = process.argv;
if (!L) throw new Error('usage: node m6-houses.mjs <checkout> <n>');
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { isHideableHouse } = await import(`${L}/src/domain/people/cardVeil.js`);
await loadGenerationLawPayloads();

const HOUSE_ATOMS = new Set(['church', 'temple', 'institution: monastery', 'institution: bank', 'docks', 'market', 'guild', 'court sits', 'court', 'legal house', 'walls', 'watch', 'garrison', 'militia', 'paid watch', 'soldiers', 'hospital', 'healer', 'mercenary', 'sacredHouse']);
const pools = [
  ...Object.entries(RELATION_POOLS).map(([k, v]) => [`T1 relation ${k}`, v]),
  ...Object.entries(DESC_POOLS).map(([k, v]) => [`T1 opening "${k.slice(0, 48)}…"`, v]),
  ...CODA_POOLS.map((c) => [`T1 coda ${c.id}`, c.variants]),
  ...Object.entries(DESC_POOLS_2).map(([k, v]) => [`T2 opening "${k.slice(0, 48)}…"`, v]),
  ...Object.entries(CODA_POOLS_2).map(([k, v]) => [`T2 coda ${k}`, v]),
];
const used = new Set();
for (const [k, pool] of pools) {
  const atoms = new Set(pool.flatMap((v) => [...(v.needs || []), ...(v.excludes || [])]));
  const houses = [...atoms].filter((a) => HOUSE_ATOMS.has(a));
  for (const a of houses) used.add(a);
  const other = [...atoms].filter((a) => !HOUSE_ATOMS.has(a));
  console.log(`pool ${k}: houses ${houses.length ? houses.join(', ') : 'none'} · other atoms ${other.length ? other.join(', ') : 'none'}`);
}

const factsFor = (t) => {
  const f = factsOf(t); const d = f.defence || {};
  return {
    hasChurch: !!f.faith?.hasChurch, temple: !!f.hasInstitution('temple'), monastery: !!f.hasInstitution('monastery'), bank: !!f.hasInstitution('bank'),
    docks: !!f.hasInstitution('docks'), market: !!f.market, guild: !!f.guild, courtSits: !!f.courtSits, court: !!d.court, legalHouse: !!f.legalHouse,
    walls: !!d.walls, watch: !!d.watch, garrison: !!d.garrison, militia: !!d.militia, paidWatch: !!f.paidWatch, soldiers: !!f.soldiers,
    hospital: !!d.hospital, healer: !!d.healer, mercenary: !!d.mercenary, sacredHouse: !!f.sacredHouse, exports: [], imports: [],
  };
};
const needed = new Map([...used].map((a) => [a, { holds: 0, neededHideable: 0 }]));
for (const size of SIZES) {
  let hideable = 0; let placesWith = 0;
  for (let i = 0; i < +nArg; i++) {
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
    const insts = Array.isArray(t.institutions) ? t.institutions : [];
    const hid = insts.filter((x) => isHideableHouse(x));
    hideable += hid.length; if (hid.length) placesWith++;
    const A = factsFor(t);
    const B = factsFor({ ...t, institutions: insts.filter((x) => !isHideableHouse(x)) });
    for (const a of used) {
      const h = atomHolds(a, A); const h2 = atomHolds(a, B);
      if (h) needed.get(a).holds++;
      if (h && !h2) needed.get(a).neededHideable++;
    }
  }
  console.log(`sample ${size}: hideable houses on the rosters ${hideable} in ${placesWith}/${nArg} places`);
}
for (const [a, c] of needed) console.log(`house atom ${a}: holds in ${c.holds} places · holds only with a hideable house ${c.neededHideable}`);

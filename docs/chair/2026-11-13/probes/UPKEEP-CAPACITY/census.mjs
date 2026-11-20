// UPKEEP-CAPACITY, step 1: THE CENSUS OF SCALE. MEASURES ONLY; writes nothing in any tree.
//   node census.mjs <tree-root> <out.json>
// Every catalogue name, at every tier it is offered, is put alone on a roster and asked which defence part it
// opens BY THE CODE'S OWN OPENERS (getInstFlags, defenseTraditionNamesOf, defenseFactsOf, the market home): no
// keyword is re-spelled here. Each name's family and rung come from the catalogue (INSTITUTION_FAMILIES,
// familyNamesByTier: rung = position among the family's distinct names in tier order), its count range from its
// own name where it carries one. The authored cross-family pairs (institutionLadders.js) are listed beside.
import { writeFileSync } from 'node:fs';
const [root, out] = process.argv.slice(2);
const imp = (p) => import(`${root}/${p}`);
const cat = await imp('src/data/institutionalCatalog.js');
const { UPGRADE_CHAINS } = await imp('src/data/institutionLadders.js');
const { getInstFlags } = await imp('src/generators/helpers.js');
const B = await imp('src/domain/institutions/defenseInstitutionBuckets.js');
// Ruling E's alchemist hook (withdrawn by the chair 2026-11-13): on only with CAP_ALCH_E=1, as the first run had it.
const ALCH = process.env.CAP_ALCH_E ? ['alchemist shop', 'alchemist quarter'] : [];

const { computeEffectiveMagicPresence } = await imp('src/generators/priorityHelpers.js');
const presenceOf = (r) => computeEffectiveMagicPresence(r, { priorityMagic: 50, magicExists: true, nearbyResources: [] }).score;
export const presenceWeight = (name) => presenceOf([{ name, category: 'x' }]) - presenceOf([]);
const opens = (name) => {
  const roster = [{ name, category: 'x' }];
  const { inst } = getInstFlags({}, roster);
  const n = B.defenseTraditionNamesOf(roster);
  const instNoAlch = getInstFlags({}, roster.filter((i) => !ALCH.some((h) => i.name.toLowerCase().includes(h)))).inst;
  const o = {
    walls: inst.hasWalls, garrison: inst.hasGarrison, militia: inst.hasMilitia, watch: inst.hasWatch,
    court: inst.hasCourtSystem, prison: inst.hasPrison, wardens: n.wardens, company: inst.hasMercenary,
    charter: inst.hasCharterHall,
    arcane: !!(instNoAlch.hasMagicInst || n.arcane), arcaneTower: n.tower, arcaneGuild: n.arcaneGuild, teleport: n.teleport,
    clergy: !!(n.divine), clergyShrine: n.divineShrine, clergyStrong: n.divineStrong,
    druids: n.druid, market: inst.hasMarket, hospital: inst.hasHospital, alchemists: n.alchemy, granary: inst.hasGranary,
    parish: inst.hasChurch, elders: n.elders,
    magicPresence: presenceOf([{ name, category: 'x' }]) > presenceOf([]), magicDefBucket: B.partitionDefenseInstitutions(roster).magicDef.length > 0,
  };
  return Object.keys(o).filter((k) => o[k]);
};
const countRange = (name) => { const m = /\((\d+)\s*-\s*(\d+)(\+?)\)/.exec(name); return m ? `${m[1]}-${m[2]}${m[3]}` : null; };

const families = cat.INSTITUTION_FAMILIES.map((fam) => {
  const byTier = cat.familyNamesByTier(fam);
  const distinct = [...new Set(byTier.map((e) => e.name))];
  return { key: String(fam.shared?.name || byTier[0]?.name || ''), shelf: fam.shelf, successor: fam.successor ?? null,
    rungs: distinct.map((name, i) => ({ name, rung: i + 1, of: distinct.length, tiers: byTier.filter((e) => e.name === name).map((e) => e.tier), count: countRange(name), opens: opens(name), presenceWeight: presenceWeight(name) })) };
});
const parts = {};
for (const f of families) for (const r of f.rungs) for (const p of r.opens) (parts[p] ||= []).push({ family: f.key, shelf: f.shelf, ...r });
writeFileSync(out, JSON.stringify({ parts, authoredPairs: UPGRADE_CHAINS.filter(([a, b]) => opens(a).length || opens(b).length).map(([a, b]) => ({ lesser: a, greater: b, lesserOpens: opens(a), greaterOpens: opens(b) })) }, null, 1));
console.error(Object.entries(parts).map(([k, v]) => `${k}:${v.length}`).join(' '));

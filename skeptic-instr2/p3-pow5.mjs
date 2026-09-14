const D = '../skepINSTR2/';
const { walkEntry, verdictOf } = await import(D + 'src/domain/prose/entryWalker.js');
const { estateGround } = await import(D + 'src/domain/prose/entryGround.js');
const { loadStateLeaves } = await import(D + 'tests/helpers/dossierCorpus.js');
const { FACTION_ROLES } = await import(D + 'src/generators/factionRoles.js');
const ROLE_CATALOG = await import(D + 'src/generators/npc/factionRoleCatalog.js');
const { POWER_ROLES_BY_CATEGORY } = await import(D + 'src/data/historyData.js');
const { ROLE_CATEGORY_KEYWORDS } = await import(D + 'src/generators/roleCategory.js');
const roles = new Set();
for (const l of Object.values(FACTION_ROLES)) for (const r of l) if (r.role) roles.add(r.role);
for (const v of Object.values(ROLE_CATALOG)) { if (!Array.isArray(v)) continue; for (const r of v) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
for (const rows of Object.values(POWER_ROLES_BY_CATEGORY)) { if (!Array.isArray(rows)) continue; for (const r of rows) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
for (const l of Object.values(ROLE_CATEGORY_KEYWORDS)) for (const k of l) roles.add(k);
const ground = estateGround({ officeRoster: [...roles].sort() });
const leaves = await loadStateLeaves();
for (const e of leaves.filter(x => /DS-POW-5/.test(x.id))) {
  const r = walkEntry(e, ground);
  const q = r.withheld.filter(f => f.klass === 'Q').map(f => f.arm);
  console.log(`${e.id}\n   verdict=${verdictOf(r)} Q=[${q}] fails=[${r.fails.map(f=>f.klass+'/'+f.arm)}]`);
  if (/autocrat/.test(e.id)) console.log('   TEXT:', JSON.stringify(e.text));
}

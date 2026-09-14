const D = '../skepINSTR2/';
const { walkEntry, verdictOf } = await import(D + 'src/domain/prose/entryWalker.js');
const { estateGround } = await import(D + 'src/domain/prose/entryGround.js');
const { FACTION_ROLES } = await import(D + 'src/generators/factionRoles.js');
const ROLE_CATALOG = await import(D + 'src/generators/npc/factionRoleCatalog.js');
const { POWER_ROLES_BY_CATEGORY } = await import(D + 'src/data/historyData.js');
const { ROLE_CATEGORY_KEYWORDS } = await import(D + 'src/generators/roleCategory.js');
const roles = new Set();
for (const l of Object.values(FACTION_ROLES)) for (const r of l) if (r.role) roles.add(r.role);
for (const v of Object.values(ROLE_CATALOG)) { if (!Array.isArray(v)) continue; for (const r of v) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
for (const rows of Object.values(POWER_ROLES_BY_CATEGORY)) { if (!Array.isArray(rows)) continue; for (const r of rows) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
for (const l of Object.values(ROLE_CATEGORY_KEYWORDS)) for (const k of l) roles.add(k);
const text = '{settlement} turtles the chokepoints when it fights. It does not campaign; it holds the two or three places that matter and lets everything else go.';
for (const flag of [undefined, true, false]) {
  const g = estateGround({ officeRoster: [...roles].sort(), eventProvenance: flag });
  const r = walkEntry({ id: 'anchor5::2247', text, slots: ['settlement'] }, g);
  console.log(`eventProvenance=${String(flag)} verdict=${verdictOf(r)}`,
    '\n   fails=', r.fails.map(f=>f.klass+'/'+f.arm),
    '\n   withheld=', r.withheld.map(f=>f.klass+'/'+f.arm),
    '\n   notes=', (r.notes||[]).map(f=>f.klass+'/'+f.arm),
    '\n   notExec=', (r.notExecutable||[]).map(f=>(f.klass||'')+'/'+f.arm));
}

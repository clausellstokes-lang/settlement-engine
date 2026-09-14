const D = '../skepINSTR2/';
const { walkEntry, verdictOf } = await import(D + 'src/domain/prose/entryWalker.js');
const { estateGround } = await import(D + 'src/domain/prose/entryGround.js');
const { loadStateAnnex } = await import(D + 'tests/helpers/dossierCorpus.js');
const { FACTION_ROLES } = await import(D + 'src/generators/factionRoles.js');
const ROLE_CATALOG = await import(D + 'src/generators/npc/factionRoleCatalog.js');
const { POWER_ROLES_BY_CATEGORY } = await import(D + 'src/data/historyData.js');
const { ROLE_CATEGORY_KEYWORDS } = await import(D + 'src/generators/roleCategory.js');
const roles = new Set();
for (const l of Object.values(FACTION_ROLES)) for (const r of l) if (r.role) roles.add(r.role);
for (const v of Object.values(ROLE_CATALOG)) { if (!Array.isArray(v)) continue; for (const r of v) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
for (const rows of Object.values(POWER_ROLES_BY_CATEGORY)) { if (!Array.isArray(rows)) continue; for (const r of rows) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
for (const l of Object.values(ROLE_CATEGORY_KEYWORDS)) for (const k of l) roles.add(k);
const annex = await loadStateAnnex();
const hits = annex.filter(e => /turtles the chokepoints/.test(e.text || ''));
console.log('annex rows:', annex.length, '· matches:', hits.length);
for (const e of hits) {
  console.log('id:', e.id, '· line:', e.line, '· slots:', JSON.stringify(e.slots));
  for (const flag of [undefined, true, false]) {
    const g = estateGround({ officeRoster: [...roles].sort(), eventProvenance: flag });
    const r = walkEntry(e, g);
    const all = [...r.fails.map(f=>'FAIL '+f.klass+'/'+f.arm), ...r.withheld.map(f=>'WH '+f.klass+'/'+f.arm), ...(r.notes||[]).map(f=>'NOTE '+f.klass+'/'+f.arm)];
    console.log(`  flag=${String(flag)} verdict=${verdictOf(r)} armsFired=${all.length}`, JSON.stringify(all));
  }
}

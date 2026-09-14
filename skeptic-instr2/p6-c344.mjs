const D = '../skepINSTR2/';
const { walkEntry } = await import(D + 'src/domain/prose/entryWalker.js');
const { estateGround, withEntryContext } = await import(D + 'src/domain/prose/entryGround.js');
const H = await import(D + 'tests/helpers/dossierCorpus.js');
const { FACTION_ROLES } = await import(D + 'src/generators/factionRoles.js');
const ROLE_CATALOG = await import(D + 'src/generators/npc/factionRoleCatalog.js');
const { POWER_ROLES_BY_CATEGORY } = await import(D + 'src/data/historyData.js');
const { ROLE_CATEGORY_KEYWORDS } = await import(D + 'src/generators/roleCategory.js');
const roles = new Set();
for (const l of Object.values(FACTION_ROLES)) for (const r of l) if (r.role) roles.add(r.role);
for (const v of Object.values(ROLE_CATALOG)) { if (!Array.isArray(v)) continue; for (const r of v) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
for (const rows of Object.values(POWER_ROLES_BY_CATEGORY)) { if (!Array.isArray(rows)) continue; for (const r of rows) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
for (const l of Object.values(ROLE_CATEGORY_KEYWORDS)) for (const k of l) roles.add(k);
const base = estateGround({ officeRoster: [...roles].sort() });
const corpus = [...await H.loadStateLeaves(), ...await H.loadCausalLeaf(), ...await H.loadCrierVoice(), ...H.loadInFunctionNarratives()];
const ne = new Set(), fa = new Set();
for (const e of corpus) {
  if (walkEntry(e, withEntryContext(base, {})).notExecutable.some(f => f.klass === 'C3' && f.arm.startsWith('provenance'))) ne.add(e.id);
  if (walkEntry(e, withEntryContext(base, { eventProvenance: false })).fails.some(f => f.klass === 'C3')) fa.add(e.id);
}
console.log('corpus', corpus.length, '· notExecutable set', ne.size, '· fails set', fa.size);
const onlyNE = [...ne].filter(x => !fa.has(x)); const onlyFA = [...fa].filter(x => !ne.has(x));
console.log('SAME SET?', onlyNE.length === 0 && onlyFA.length === 0, '· onlyNE', onlyNE.length, '· onlyFA', onlyFA.length);
if (onlyNE.length) console.log('  onlyNE sample', onlyNE.slice(0,3));
if (onlyFA.length) console.log('  onlyFA sample', onlyFA.slice(0,3));

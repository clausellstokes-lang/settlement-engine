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

// (a) CURE 2 — the mis-located quantifier sentence
const probe4 = [
  'The wall is old, and all souls are counted here.',
  'Every household pays the toll.',
  'All the grain is stored in the granary walls.',
  'The tallow is small, and all hands are counted.',
];
console.log('=== CURE 2 · the four probe4 shapes ===');
for (const text of probe4) {
  const r = walkEntry({ id: 'probe::' + text.slice(0, 14), text, slots: [] }, ground);
  const fails = r.fails.map(f => `${f.klass}/${f.arm}`);
  const notes = (r.notes || []).map(f => `${f.klass}/${f.arm}`);
  const wh = r.withheld.map(f => `${f.klass}/${f.arm}`);
  console.log(`  "${text}"\n     verdict=${verdictOf(r)} FAILS=[${fails}] NOTES=[${notes}] WITHHELD=[${wh}]`);
}

// (b)+(c) CURE 15 — the Q trailing-coordinate class over the R1 leaves
const leaves = await loadStateLeaves();
console.log('\n=== CURE 15 · R1 leaves ===');
console.log('  R1 entries loaded:', leaves.length);
let trailing = 0, secondSentence = 0, entriesWithTrailing = 0;
let target = null;
for (const e of leaves) {
  const r = walkEntry(e, ground);
  const qs = r.withheld.filter(f => f.klass === 'Q');
  const t = qs.filter(f => /trailing coordinate/.test(f.arm));
  const s = qs.filter(f => /second sentence/.test(f.arm));
  trailing += t.length; secondSentence += s.length;
  if (t.length) entriesWithTrailing += 1;
  if (/DS-POW-5/.test(e.id) && /autocrat/.test(e.id)) {
    target = { id: e.id, verdict: verdictOf(r), q: qs.map(f => f.arm) };
  }
}
console.log('  Q findings · trailing coordinate:', trailing, '· second sentence:', secondSentence, '· total Q:', trailing + secondSentence);
console.log('  entries carrying a trailing-coordinate Q:', entriesWithTrailing);
console.log('  the brief\'s named control:', JSON.stringify(target));

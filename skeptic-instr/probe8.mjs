const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const fs = await import('node:fs');
const lex = await import(`${D}/src/domain/prose/entryLexicons.js`);
const { FACTION_ROLES } = await import(`${D}/src/generators/factionRoles.js`);
const ROLE_CATALOG = await import(`${D}/src/generators/npc/factionRoleCatalog.js`);
const roles = new Set();
for (const l of Object.values(FACTION_ROLES)) for (const r of l) if (r.role) roles.add(r.role);
for (const v of Object.values(ROLE_CATALOG)) { if (!Array.isArray(v)) continue; for (const r of v) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
const roster = [...roles].sort();
const all = fs.readFileSync('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skeptic-instr/all-role-literals.txt','utf8').split('\n').filter(Boolean);
const inRoster = (n) => roster.some(r => r.toLowerCase().includes(n));
const inAllLiterals = (n) => all.some(r => r.toLowerCase().includes(n));
console.log('OFFICE_NOUN_CANDIDATES judged ABSENT by the walker ground, but present as a role/title literal somewhere in src:');
for (const n of lex.OFFICE_NOUN_CANDIDATES) {
  if (!inRoster(n) && inAllLiterals(n)) console.log('  ', n, '→', all.filter(r=>r.toLowerCase().includes(n)).slice(0,4).join(' | '));
}
console.log('\nroster size', roster.length, '| all role/title literals', all.length);

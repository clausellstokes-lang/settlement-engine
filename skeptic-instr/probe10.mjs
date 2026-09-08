const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const lex = await import(`${D}/src/domain/prose/entryLexicons.js`);
const { ROLE_CATEGORY_KEYWORDS } = await import(`${D}/src/generators/roleCategory.js`);
const { FACTION_ROLES } = await import(`${D}/src/generators/factionRoles.js`);
const RC = await import(`${D}/src/generators/npc/factionRoleCatalog.js`);
const roles = new Set();
for (const l of Object.values(FACTION_ROLES)) for (const r of l) if (r.role) roles.add(r.role);
for (const v of Object.values(RC)) { if (!Array.isArray(v)) continue; for (const r of v) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
const roster = [...roles].sort();
const kw = Object.values(ROLE_CATEGORY_KEYWORDS).flat().map(s=>s.toLowerCase());
const missing = lex.OFFICE_NOUN_CANDIDATES.filter(n => !roster.some(r=>r.toLowerCase().includes(n)));
console.log('candidates the 35-role ground calls ABSENT:', missing.length, JSON.stringify(missing));
console.log('of those, present in ROLE_CATEGORY_KEYWORDS:', JSON.stringify(missing.filter(n=>kw.some(k=>k.includes(n)))));

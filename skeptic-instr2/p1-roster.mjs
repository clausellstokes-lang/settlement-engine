import { POWER_ROLES_BY_CATEGORY } from '../skepINSTR2/src/data/historyData.js';
import { ROLE_CATEGORY_KEYWORDS } from '../skepINSTR2/src/generators/roleCategory.js';
import { FACTION_ROLES } from '../skepINSTR2/src/generators/factionRoles.js';
import * as ROLE_CATALOG from '../skepINSTR2/src/generators/npc/factionRoleCatalog.js';
import { OFFICE_NOUN_CANDIDATES } from '../skepINSTR2/src/domain/prose/entryLexicons.js';
const narrow = new Set();
for (const list of Object.values(FACTION_ROLES)) for (const r of list) if (r.role) narrow.add(r.role);
for (const v of Object.values(ROLE_CATALOG)) { if (!Array.isArray(v)) continue; for (const r of v) { if (r?.role) narrow.add(r.role); if (r?.title) narrow.add(r.title); } }
const wide = new Set(narrow);
const fromKeywords = new Set();
for (const rows of Object.values(POWER_ROLES_BY_CATEGORY)) { if (!Array.isArray(rows)) continue; for (const r of rows) { if (r?.role) wide.add(r.role); if (r?.title) wide.add(r.title); } }
for (const list of Object.values(ROLE_CATEGORY_KEYWORDS)) for (const k of list) { wide.add(k); fromKeywords.add(k); }
console.log('narrow', narrow.size, 'wide', wide.size, 'keywordEntries', fromKeywords.size, 'candidates', OFFICE_NOUN_CANDIDATES.length);
const abs = (set) => OFFICE_NOUN_CANDIDATES.filter(n => ![...set].some(r => r.toLowerCase().includes(n)));
const an = abs(narrow), aw = abs(wide);
console.log('absent narrow', an.length, JSON.stringify(an));
console.log('absent wide  ', aw.length, JSON.stringify(aw));
const newly = an.filter(n => !aw.includes(n));
console.log('NEWLY RESOLVED', newly.length);
for (const n of newly) {
  const hits = [...wide].filter(r => r.toLowerCase().includes(n));
  const exact = hits.some(h => h.toLowerCase() === n);
  console.log(`  ${n} <- [${hits.slice(0,4).join(' | ')}] exactMatch=${exact}`);
}
const fake = ['archon','vizier','margrave','exarch','tribune','podesta','landgrave','chamberlain','marshal','warden','steward','sheriff','magistrate','constable','herald','scribe','bishop','abbot'];
console.log('BREADTH PROBE — nouns the world may or may not hold:');
for (const f of fake) {
  const hits = [...wide].filter(r => r.toLowerCase().includes(f));
  const nhits = [...narrow].filter(r => r.toLowerCase().includes(f));
  console.log(`  ${f}: wide=${hits.length?('HELD ['+hits.slice(0,2).join('|')+']'):'ABSENT'}  narrow=${nhits.length?'HELD':'ABSENT'}`);
}

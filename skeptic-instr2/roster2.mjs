import { FACTION_ROLES } from '../skepINSTR2/src/generators/factionRoles.js';
import * as ROLE_CATALOG from '../skepINSTR2/src/generators/npc/factionRoleCatalog.js';
import { POWER_ROLES_BY_CATEGORY } from '../skepINSTR2/src/data/historyData.js';
import { ROLE_CATEGORY_KEYWORDS } from '../skepINSTR2/src/generators/roleCategory.js';
import { OFFICE_NOUN_CANDIDATES } from '../skepINSTR2/src/domain/prose/entryLexicons.js';
const low=(s)=>String(s).toLowerCase();
const narrow=new Set();
for (const list of Object.values(FACTION_ROLES)) for (const row of list) if (row.role) narrow.add(row.role);
for (const value of Object.values(ROLE_CATALOG)) { if(!Array.isArray(value))continue; for (const row of value){ if(row?.role)narrow.add(row.role); if(row?.title)narrow.add(row.title);} }
const wide=new Set(narrow);
for (const rows of Object.values(POWER_ROLES_BY_CATEGORY)) { if(!Array.isArray(rows))continue; for(const row of rows){ if(row?.role)wide.add(row.role); if(row?.title)wide.add(row.title);} }
const kw=new Set();
for (const list of Object.values(ROLE_CATEGORY_KEYWORDS)) for (const k of list){ wide.add(k); kw.add(k);} 
const N=[...narrow], W=[...wide];
const absent=(vals,noun)=>!vals.some(v=>low(v).includes(noun));
const aN=OFFICE_NOUN_CANDIDATES.filter(n=>absent(N,n));
const aW=OFFICE_NOUN_CANDIDATES.filter(n=>absent(W,n));
console.log('narrow',N.length,'wide',W.length,'candidates',OFFICE_NOUN_CANDIDATES.length);
console.log('absent narrow',aN.length,'absent wide',aW.length);
console.log('absent wide:',aW.join(' · '));
console.log('newly HELD by the union (was absent, now present):');
for (const n of aN.filter(x=>!aW.includes(x))) {
  const hits=W.filter(v=>low(v).includes(n));
  const kwOnly=hits.every(h=>kw.has(h)&&!N.includes(h));
  console.log('  ',n,'<=',JSON.stringify(hits),kwOnly?'[KEYWORD-ONLY]':'');
}

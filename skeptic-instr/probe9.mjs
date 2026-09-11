const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const { walkEntry, verdictOf } = await import(`${D}/src/domain/prose/entryWalker.js`);
const { estateGround, withEntryContext } = await import(`${D}/src/domain/prose/entryGround.js`);
const C = await import(`${D}/tests/helpers/dossierCorpus.js`);
const { FACTION_ROLES } = await import(`${D}/src/generators/factionRoles.js`);
const RC = await import(`${D}/src/generators/npc/factionRoleCatalog.js`);
const roles = new Set();
for (const l of Object.values(FACTION_ROLES)) for (const r of l) if (r.role) roles.add(r.role);
for (const v of Object.values(RC)) { if (!Array.isArray(v)) continue; for (const r of v) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
const base = estateGround({ officeRoster: [...roles].sort() });
const leaves = await C.loadStateLeaves();
const e = leaves.find(x => x.text.includes('usages are precise'));
console.log('entry:', e?.id); console.log('text:', JSON.stringify(e?.text));
const r = walkEntry(e, withEntryContext(base, {}));
console.log('verdict', verdictOf(r));
for (const k of ['fails','withheld','notes','notExecutable']) console.log(' ', k, JSON.stringify(r[k].map(f=>`${f.klass}/${f.arm}`)));
// R5 sentence + distinct counts (receipt 1.7: 374 lines / 397 sentences / 374 distinct)
const { sentencesOf } = await import(`${D}/src/domain/prose/entryWalker.js`);
const crier = await C.loadCrierVoice();
let sent = 0; for (const c of crier) sent += sentencesOf(c.text).length;
console.log('\nR5 lines=', crier.length, 'sentences(by sentencesOf)=', sent,
  'distinct texts=', new Set(crier.map(c=>c.text.trim())).size);

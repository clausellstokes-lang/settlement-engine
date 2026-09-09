const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const { walkEntry } = await import(`${D}/src/domain/prose/entryWalker.js`);
const { estateGround, withEntryContext } = await import(`${D}/src/domain/prose/entryGround.js`);
const C = await import(`${D}/tests/helpers/dossierCorpus.js`);
const { FACTION_ROLES } = await import(`${D}/src/generators/factionRoles.js`);
const ROLE_CATALOG = await import(`${D}/src/generators/npc/factionRoleCatalog.js`);
const roles = new Set();
for (const l of Object.values(FACTION_ROLES)) for (const r of l) if (r.role) roles.add(r.role);
for (const v of Object.values(ROLE_CATALOG)) { if (!Array.isArray(v)) continue; for (const r of v) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); } }
const base = estateGround({ officeRoster: [...roles].sort() });
const leaves = await C.loadStateLeaves();
const corpus = [...leaves, ...await C.loadCrierVoice(), ...C.loadInFunctionNarratives()];
const BREACH = [
  ['newsVoice:97','every household is counted for the levy','a totality over an open column','the households are counted for the levy'],
  ['general.generated:855','the same trades exempt','exemption on a null column','the same trades listed'],
  ['factionDynamics:466','Church land exemptions','exemption on a null column','Church land holdings'],
];
for (const [where, find, arm, cure] of BREACH) {
  const e = corpus.find(x => x.text.includes(find));
  if (!e) { console.log(`${where}: NOT FOUND`); continue; }
  const before = walkEntry(e, withEntryContext(base,{})).fails.map(f=>f.arm);
  const after = walkEntry({...e, text: e.text.replace(find, cure)}, withEntryContext(base,{})).fails.map(f=>f.arm);
  console.log(`${where} id=${e.id} line=${e.line}\n   BEFORE ${JSON.stringify(before)}\n   AFTER  ${JSON.stringify(after)}\n   armPresentBefore=${before.includes(arm)} armAbsentAfter=${!after.includes(arm)}`);
}
const annex = C.joinAnnexToLeaves(C.loadStateAnnex(), leaves).joined.find(r => r.line === 5233);
console.log('\nANNEX 5233 found=', Boolean(annex), 'id=', annex?.id, 'block=', annex?.block, 'pool=', annex?.pool);
console.log('  text=', JSON.stringify(annex?.text?.slice(0,160)));
const ab = walkEntry(annex, withEntryContext(base,{})).fails.map(f=>f.arm);
console.log('  FAILS=', JSON.stringify(ab));
// mutation control the test does NOT run for the annex row:
const curedAnnex = { ...annex, text: annex.text.replace('exempt', 'listed') };
console.log('  cured FAILS=', JSON.stringify(walkEntry(curedAnnex, withEntryContext(base,{})).fails.map(f=>f.arm)));
// the three unnamed breaches the receipt claims
const causal = await C.loadCausalLeaf();
const all = [...leaves, ...causal, ...await C.loadCrierVoice(), ...C.loadInFunctionNarratives()];
for (const e of all) {
  const r = walkEntry(e, withEntryContext(base,{}));
  for (const f of r.fails) if (f.klass==='C2') console.log(`  C2FAIL ${f.arm} :: ${e.id} :: ${JSON.stringify(e.text.slice(0,110))}`);
}

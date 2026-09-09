const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const { walkEntry } = await import(`${D}/src/domain/prose/entryWalker.js`);
const lex = await import(`${D}/src/domain/prose/entryLexicons.js`);
const fx = await import(`${D}/tests/fixtures/brackwaterTables.js`);
const { estateGround, withEntryContext } = await import(`${D}/src/domain/prose/entryGround.js`);
const corpusMod = await import(`${D}/tests/helpers/dossierCorpus.js`);
const fillMod = await import(`${D}/tests/helpers/dossierComposedFill.js`);
const { FACTION_ROLES } = await import(`${D}/src/generators/factionRoles.js`);
const ROLE_CATALOG = await import(`${D}/src/generators/npc/factionRoleCatalog.js`);

function deriveOfficeRoster() {
  const roles = new Set();
  for (const list of Object.values(FACTION_ROLES)) for (const row of list) if (row.role) roles.add(row.role);
  for (const value of Object.values(ROLE_CATALOG)) { if (!Array.isArray(value)) continue;
    for (const row of value) { if (row?.role) roles.add(row.role); if (row?.title) roles.add(row.title); } }
  return [...roles].sort();
}
const roster = deriveOfficeRoster();
console.log('OFFICE ROSTER n =', roster.length, '| bailiff present:', roster.some(r=>r.toLowerCase().includes('bailiff')));
console.log('watch in OFFICE_NOUN_CANDIDATES:', lex.OFFICE_NOUN_CANDIDATES.includes('watch'), '| n candidates =', lex.OFFICE_NOUN_CANDIDATES.length);

const leaves = await corpusMod.loadStateLeaves();
const causal = await corpusMod.loadCausalLeaf();
const crier = await corpusMod.loadCrierVoice();
const gen = corpusMod.loadInFunctionNarratives();
console.log('COUNTS leaves=', leaves.length, 'causal=', causal.length, 'crier=', crier.length, 'gen=', gen.length,
  'leaves+causal=', leaves.length+causal.length,
  'pools=', new Set([...leaves,...causal].map(e=>e.poolId)).size,
  'blocks=', new Set(leaves.map(e=>e.block)).size);
const { joined, unjoined, leafLines } = corpusMod.joinAnnexToLeaves(corpusMod.loadStateAnnex(), leaves);
console.log('ANNEX joined=', joined.length, 'unjoined=', unjoined.length, 'leafLines=', leafLines.size);

const base = estateGround({ officeRoster: roster });
const cells = corpusMod.poolCells([...leaves, ...causal]);
const byBlock = fillMod.composedFillByBlock(fillMod.fillSites());
const corpus = [...leaves, ...causal, ...crier, ...gen];
const arms = new Map(); let failing=0, withheld=0, notExec=0;
for (const entry of corpus) {
  const bag = byBlock.get(entry.block);
  const r = walkEntry(entry, withEntryContext(base, {
    siblings: (cells.get(entry.poolId)||[]).filter(s=>s.id!==entry.id),
    ...(bag ? { fill: { declared: [], variantUnion: [], composed: bag.slots } } : {}),
  }));
  if (r.fails.length) failing++;
  withheld += r.withheld.length; notExec += r.notExecutable.length;
  for (const f of r.fails) { const k=`${f.klass} · ${f.arm}`; arms.set(k,(arms.get(k)||0)+1); }
}
console.log('\nCENSUS corpus=', corpus.length, 'failingEntries=', failing, 'withheld=', withheld, 'notExec=', notExec);
for (const [k,v] of [...arms].sort((a,b)=>b[1]-a[1])) console.log(String(v).padStart(5), k);
console.log('blocks with a bag =', [...new Set(leaves.map(e=>e.block))].filter(b=>byBlock.has(b)).length,
  '| no bag =', [...new Set(leaves.map(e=>e.block))].filter(b=>!byBlock.has(b)).length);

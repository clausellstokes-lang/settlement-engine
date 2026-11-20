// node gapdiff.cjs <load.cjs> <A corpus> <B corpus>: gap rows (institution rows) and priorityNotes gone/new, by text, with towns
const load=require(process.argv[2]);const [A,B]=process.argv.slice(3);
const a=Object.fromEntries(load(A).map(r=>[r.seed,r.s])),b=Object.fromEntries(load(B).map(r=>[r.seed,r.s]));
const key=g=>g.institution?`${g.institution}|${g.chain}|${g.kind}|${g.impact}`:`chain|${g.chain}|${g.impact}`;
const tally=(m,k,s)=>{(m[k]??=[]).push(s)};const gone={},added={},pg={},pa={};
for(const seed of Object.keys(a)){const ga=(a[seed].resourceAnalysis?.gaps||[]).map(key),gb=(b[seed]?.resourceAnalysis?.gaps||[]).map(key);
for(const k of ga) if(!gb.includes(k)) tally(gone,k,seed); for(const k of gb) if(!ga.includes(k)) tally(added,k,seed);
const na=a[seed].resourceAnalysis?.priorityNotes||[],nb=b[seed]?.resourceAnalysis?.priorityNotes||[];
for(const k of na) if(!nb.includes(k)) tally(pg,k,seed); for(const k of nb) if(!na.includes(k)) tally(pa,k,seed);}
const pr=(t,m)=>{console.log('##',t);for(const [k,v] of Object.entries(m).sort((x,y)=>y[1].length-x[1].length)) console.log(v.length+'\t'+k+'\t'+v.slice(0,3).join(','))};
pr('gap rows gone',gone);pr('gap rows new',added);pr('notes gone',pg);pr('notes new',pa);

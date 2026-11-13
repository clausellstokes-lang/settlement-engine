// ROUND-3-CUT steps 2, 6, 8: join the placement, the cold readers' verdicts, the writers, holders and round two; give
// every HIGH/MED line its status at the line's tip and its package; write ROUND-3-CUT.json and print the tables.
// node cut.mjs <cold.json> <matrix.json> <writers.json> <step2 dir> <out.json> [chance.json]
import fs from 'node:fs';
const [cf,mf,wf,sd,out,chf]=process.argv.slice(2);
const C=Object.fromEntries(JSON.parse(fs.readFileSync(cf,'utf8')).map(r=>[r.n,r])); const M=Object.fromEntries(JSON.parse(fs.readFileSync(mf,'utf8')).map(r=>[r.n,r])); const W=JSON.parse(fs.readFileSync(wf,'utf8'));
const CH=chf?JSON.parse(fs.readFileSync(chf,'utf8')):{}; // case -> {verdict, why}: ROUND-3-CUT's overrides of a reader's verdict, each stated
const V={}; for(const f of fs.readdirSync(sd).filter(f=>/^packet-\d+\.json$/.test(f))){ const P=JSON.parse(fs.readFileSync(`${sd}/${f}`,'utf8')); let Vs=[]; try{ Vs=JSON.parse(fs.readFileSync(`${sd}/${f.replace('packet','verdict')}`,'utf8')); }catch{} const byCase=Object.fromEntries(Vs.map(v=>[v.case,v]));
  for(const p of P){ const v=byCase[p.case]; (V[p.n]||={})[p.treeAfter]={case:p.case,verdict:CH[p.case]?.verdict||(v?v.verdict:'UNREAD'),inPlace:v?.inPlace||'',why:CH[p.case]?.why||v?.why||'',readerVerdict:v?.verdict||'',override:!!CH[p.case],severity:CH[p.case]?.severity||v?.severity||''}; } }
const FAM=(f)=>!f?'untraced': /dossierStateProse/.test(f)?'the corpus (src/data/dossierStateProse)': /^src\/data\/institution|institutionalCatalog/.test(f)?'the institution catalogue and its descriptions (src/data/institution*)': /^src\/data\/people\//.test(f)?'people data (src/data/people)': /^src\/data\//.test(f)?'data tables (src/data)': /^src\/components\/new\/tabs\//.test(f)?'the tabs (src/components/new/tabs)': /^src\/components\//.test(f)?'page cards (src/components/new)': /^src\/generators\/power|^src\/domain\/power/.test(f)?'power generators': /^src\/generators\/economy|computeActiveChains/.test(f)?'economy generators': /^src\/generators\//.test(f)?'generators (other)': /^src\/domain\/display\//.test(f)?'display leaves (src/domain/display)': /^src\/domain\//.test(f)?'domain (other)': /^src\/pdf\//.test(f)?'the PDF':'other';
const rows=[]; for(const w of W){ const c=C[w.n], m=M[w.n]; const v=V[w.n]||{};
  const cured=Object.entries(v).filter(([k,x])=>['TRUE','NOTHING'].includes(x.verdict)).map(([k])=>k);
  const reworded=Object.entries(v).filter(([k,x])=>/STILL FALSE|NEW FALSE/.test(x.verdict)).map(([k])=>k);
  const chance=Object.entries(v).filter(([k,x])=>x.verdict==='REMOVED BY CHANCE').map(([k])=>k);
  let status; if(!m.atLine) status='not at the line tip'; else if(cured.length) status='cured on a lane (read)'; else if(reworded.length) status='reworded, still false'; else if(chance.length) status='removed by chance only'; else if(Object.values(v).some(x=>x.verdict==='UNREAD')) status='removed, unread'; else status='no lane removes it';
  const h=w.holders||[]; const pkg= status==='not at the line tip'||status==='cured on a lane (read)' ? null : h.length===1?`lane ${h[0]}`: h.length>1?`several lanes: ${h.join(', ')}`:`no lane: ${FAM(w.writer?.file)}`;
  rows.push({n:w.n,severity:c.severity,mechanism:c.mechanism,town:c.town,tab:c.tab,sentence:c.sentence,fact:c.fact,writer:w.writer||null,holders:h,wordsHolders:w.wordsHolders||{},at:m.at,laneDiff:m.lane,replaced:v,status,curedOn:cured,rewordedOn:reworded,round2:w.round2||null,package:pkg}); }
fs.writeFileSync(out,JSON.stringify(rows,null,1));
const hm=(f)=>{ const h=rows.filter(r=>r.severity==='HIGH'&&f(r)).length, m=rows.filter(r=>r.severity==='MED'&&f(r)).length; return `${h} / ${m}`; };
console.log('status (HIGH / MED):'); for(const s of [...new Set(rows.map(r=>r.status))]) console.log('  ',s.padEnd(30),hm(r=>r.status===s));
const P={}; for(const r of rows) if(r.package) (P[r.package]||=[]).push(r);
console.log('packages (HIGH / MED / writers):'); for(const [k,v] of Object.entries(P).sort((a,b)=>b[1].filter(r=>r.severity==='HIGH').length-a[1].filter(r=>r.severity==='HIGH').length||b[1].length-a[1].length)) console.log('  ',k.padEnd(70),v.filter(r=>r.severity==='HIGH').length,'/',v.filter(r=>r.severity==='MED').length,'/',new Set(v.map(r=>r.writer?.file+'::'+r.writer?.fn)).size);

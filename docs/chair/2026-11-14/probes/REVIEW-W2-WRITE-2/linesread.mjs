// linesread.mjs <work> <readersDir> <out.md> <out.json>: REVIEW-W2-WRITE-2-LINES-READ from the line list (lines-tip.json),
// the readers' outputs (out-*.json), the exact own/carried classing (classed.json, drawn-undo: the tip tree with the
// base's corpus, on the tip's own records) and the reviewer's adjudications (ADJ below).
import fs from 'node:fs';
const [W,RD,MD,JS]=process.argv.slice(2);
const L=JSON.parse(fs.readFileSync(`${W}/lines-tip.json`)); const C=JSON.parse(fs.readFileSync(`${W}/classed.json`));
const outs={}; for(let k=1;k<=7;k++) for(const x of JSON.parse(fs.readFileSync(`${RD}/out-${k}.json`))) outs[x.id]={...x,reader:k};
// The reviewer's adjudications: severity lowered to LOW where the record cannot settle the claim or the claim is a
// habitual description under a closure; OWN where the stage's rewording introduced the false element.
const ADJ={
 'DS-GEN-17::GARRISONED::v1':['LOW','a watch is people under arms; the contradiction with "no soldiers" is soft'],
 'DS-GEN-18::BOUGHT-IN::v9':['LOW','"much ... came from elsewhere": the reader\'s own 2:1 threshold; the record cannot settle "much"'],
 'DS-ECO-10::POSTURE: vulnerable::v1':['LOW','true of the record (isolated route); the contradicting "carts bring in" is a generator food line, itself false (teleport/airship)'],
 'DS-ECO-10::POSTURE: vulnerable::v3':['LOW','as v1'],
 'DS-GEN-13::COMMERCE: a merchant guild, no bank::v1':['LOW','a habitual description under a plague closure'],
 'DS-GEN-13::WAREHOUSES::v4':['LOW','a habitual description under a plague closure'],
 'DS-GEN-17::GREAT HOUSE: monastery::v3':['LOW','a habitual description under a plague closure'],
 'DS-ECO-12::INCOME WEIGHT: the religious houses::v1':['LOW','"the religious houses" plural for one parish church: number of a generic noun, the claim itself true'],
 'DS-ECO-12::INCOME WEIGHT: the religious houses::v2':['LOW','as v1'],
};
const OWNREWORD={'DS-DEF-2::Invasion & War: neither walls nor force::v6':'the rewording\'s "nobody under arms"','DS-DEF-2::Economic Survival: STRONG::v3':'the rewording\'s "defenders are still paid from it"',
 'DS-GEN-16::LEGACY-UNRESOLVED::v1':'the rewording\'s "The {calamity} is" (agreement)','DS-GEN-16::LEGACY-UNRESOLVED::v2':'idem','DS-GEN-16::LEGACY-RECOVERED::v1':'the rewording\'s "which is" (agreement)','DS-GEN-16::LEGACY-RECOVERED::v2':'idem','DS-GEN-16::LEGACY-SHIFTED::v1':'idem','DS-GEN-16::LEGACY-SHIFTED::v2':'idem'};
const TIERS=['thorp','hamlet','village','town','city','metropolis'];
const rows=[];
for(const i of L){ const x=outs[i.id]||{}; const c=C.find(r=>r.id===i.id)||{own:[],car:[],falseTowns:[]};
  let verdict=x.verdict||'UNREAD', sev=c.worst||(x.verdict==='FALSE'?'MED':''); let adj=null;
  if(ADJ[i.id]&&verdict==='FALSE'){ adj=ADJ[i.id][1]; verdict='TRUE'; sev='LOW'; }
  let origin=''; if(verdict==='FALSE'){ if(i.kind==='new') origin='OWN (new line)'; else if(OWNREWORD[i.id]) origin='OWN ('+OWNREWORD[i.id]+')'; else if(c.own.length&&!c.car.length) origin='OWN (prints there only because of the stage: '+c.own.length+' town(s))'; else if(c.own.length) origin='OWN in '+c.own.length+' town(s) where it prints only because of the stage; CARRIED in '+c.car.length; else origin='CARRIED (false in the same towns with the base corpus)'; }
  const tiers=[...new Set(i.prints.map(p=>p.tier))].sort((a,b)=>TIERS.indexOf(a)-TIERS.indexOf(b));
  const crises={}; for(const p of i.prints) for(const s of (p.stress.length?p.stress:['calm'])) crises[s]=(crises[s]||0)+1;
  const fe=(x.eyeReads||[]).find(e=>e.true===false&&(e.severity==='HIGH'||e.severity==='MED'))||(x.eyeReads||[]).find(e=>e.true===false);
  rows.push({id:i.id,block:i.block,kind:i.kind,marks:i.marks,baseMarks:i.baseMarks||null,text:i.text,rewordOf:i.rewordOf||null,printsIn:i.prints.length,
    sizes:tiers.length?tiers[0]+(tiers.length>1?'–'+tiers[tiers.length-1]:''):'',crises,verdict,severity:sev,origin,adjudication:adj,
    eyeTowns:(x.eyeReads||[]).map(e=>e.town),script:x.script?{tests:x.script.tests,true:x.script.true,false:x.script.false}:null,
    falseTowns:c.falseTowns,ownTowns:c.own,example:fe?{town:fe.town,printed:fe.printed,fact:fe.fact}:null,twin:x.twinMissingCondition||null,slot:x.slotOrAgreement||null,machinery:x.machinery||null,note:x.note||null,reader:x.reader});
}
fs.writeFileSync(JS,JSON.stringify(rows,null,1));
const md=[]; const n=k=>rows.filter(k).length;
md.push('# REVIEW-W2-WRITE-2 · LINES READ: every new or reworded line of the stage b5206acd3..70e5e7468, read where it prints','',
`${rows.length} lines: ${n(r=>r.kind==='new')} new, ${n(r=>r.kind==='reworded')} reworded, ${n(r=>r.kind==='marks')} whose conditions alone changed, and ${n(r=>r.kind==='carried-59')} unchanged lines of the last read's 59 false rows.`,
`Verdicts: ${n(r=>r.verdict==='TRUE')} TRUE (LOW notes kept), ${n(r=>r.verdict==='FALSE')} FALSE at HIGH or MED (${n(r=>r.verdict==='FALSE'&&r.severity==='HIGH')} HIGH), ${n(r=>r.verdict==='NEVER PRINTS')} NEVER PRINTS.`,
`Of the FALSE: ${n(r=>r.verdict==='FALSE'&&r.origin.startsWith('OWN'))} are THE STAGE'S OWN in at least one town (${n(r=>r.verdict==='FALSE'&&/; CARRIED in/.test(r.origin))} of them also CARRIED elsewhere), ${n(r=>r.verdict==='FALSE'&&r.origin.startsWith('CARRIED'))} CARRIED only. OWN = a new line, a rewording that brought the false element in, or a town where the line prints only because of the stage (the tip tree with the base's corpus does not draw it there: drawn-undo).`,'',
'Columns: prints = towns whose kernel ledger drew the line (of 905 rendered); sizes = smallest–largest it reaches; verdict; origin; the worst false read (town · as printed · the fact against it). The full rows (eye-read towns, the script and its counts, every false town) are in `probes/REVIEW-W2-WRITE-2/lines-read.json`.','');
for(const b of [...new Set(rows.map(r=>r.block))]){ md.push(`## ${b}`,'','| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |','|---|---|---|---|---|---|');
  for(const r of rows.filter(r=>r.block===b)){ const ex=r.example&&r.verdict==='FALSE'?`${r.example.town}: "${String(r.example.printed).slice(0,140)}" — ${String(r.example.fact).slice(0,160)}`:(r.adjudication?'adjudged LOW: '+r.adjudication:(r.note||'').slice(0,160));
    const cell=s=>String(s).replace(/\|/g,'/').replace(/\n/g,' ');
    md.push(`| ${cell(r.id.split('::').slice(1).join(' · '))} | ${r.kind} · [${cell(r.marks.join(' · '))}] | ${r.printsIn} · ${r.sizes} | ${r.verdict}${r.severity&&r.verdict==='FALSE'?' '+r.severity:''}${r.script?` (script ${r.script.false} false / ${r.script.true+r.script.false})`:''} | ${cell(r.origin)} | ${cell(ex)} |`); }
  md.push(''); }
fs.writeFileSync(MD,md.join('\n')+'\n'); console.log(md.slice(2,5).join('\n'));

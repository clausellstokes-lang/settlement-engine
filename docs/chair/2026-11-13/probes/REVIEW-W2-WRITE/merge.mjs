// merge.mjs: the nine readers' files -> merged, normalised and attributed cold list.
// node merge.mjs <coldDir> <tipOut> <baseOut> <tipTree> <baseTree> <out.json>
import fs from 'node:fs'; import path from 'node:path';
const [C,TO,BO,TT,BT,O]=process.argv.slice(2);
const all=[]; for(const f of fs.readdirSync(C).filter(f=>/^reader-\d+\.json$/.test(f)).sort()) for(const x of JSON.parse(fs.readFileSync(path.join(C,f),'utf8'))) all.push({...x,reader:+f.match(/\d+/)[0]});
const dump=(d,t)=>fs.readFileSync(`${d}/dumps/${t}.txt`,'utf8');
const W=s=>s.replace(/\s+/g,'');
const splitS=l=>l.split(/(?<=[.!?…])\s+(?=[A-Z"“])/).map(s=>s.trim()).filter(Boolean);
const viewText=(txt,view)=>{const out=[];let cur=null;for(const l of txt.split('\n')){const h=l.match(/^== (.*) ==/);if(h){cur=h[1];continue;}if(cur===view)out.push(l);}return out.join('\n');};
// corpus variants (tip and base): template -> regex
const variants=tree=>{const r=[];const dir=`${tree}/src/data/dossierStateProse`;for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.generated.js'))){const s=fs.readFileSync(`${dir}/${f}`,'utf8');let block=null;for(const line of s.split('\n')){const b=line.match(/^  "(DS-[A-Z]+-\d+[a-z]?)": \{/);if(b)block=b[1];const m=line.match(/^\s*"text": (".*"),?$/);if(m){const t=JSON.parse(m[1]);const parts=t.split(/\{[a-zA-Z_]+\}/).map(p=>p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));if(parts.join('').replace(/\W/g,'').length<12)continue;r.push({file:f,block,text:t,re:new RegExp(parts.join('.{1,80}?').replace(/\btown(?=\b|')/g,'(?:thorp|hamlet|village|town|city|metropolis)'))});}}}return r;};
const VT=variants(TT), VB=variants(BT);
const findV=(V,s)=>{const hits=V.filter(v=>v.re.test(s));return hits.length?hits.map(h=>`${h.block}: ${h.text}`).slice(0,3):null;};
let miss=0; const g=new Map();
for(const x of all){ const d=dump(TO,x.town); x.verbatim=d.includes(x.sentence)||W(d).includes(W(x.sentence)); if(!x.verbatim)miss++;
  const k=x.town+'||'+x.sentence; if(!g.has(k)) g.set(k,{...x,tabs:[x.tab],readers:[x.reader]}); else {const e=g.get(k); if(!e.tabs.includes(x.tab))e.tabs.push(x.tab); if(!e.readers.includes(x.reader))e.readers.push(x.reader); const rank={HIGH:3,MED:2,LOW:1}; if(rank[x.severity]>rank[e.severity])e.severity=x.severity;} }
const RANGE=/\((\d[\d,]*(-\d[\d,]*)?\+?( households)?|[\d,]+\+ only)\)/;
const out=[...g.values()];
for(const x of out){ x.readerSeverity=x.severity; const s=x.sentence;
  const bare=RANGE.test(s)&&!/[a-z]\. |\bsupplied by\b|, the [a-z]/.test(s)&&s.length<120&&!/\bstops half-way\b/.test(s);
  if(/internal|broken/.test(x.mechanism)&&bare){x.severity='LOW';x.class='catalogue-range-name';}
  else if(RANGE.test(s)&&x.severity==='HIGH')x.severity='MED';
  if(/priority is \d+\/100/.test(s))x.severity='MED';
  const b=dump(BO,x.town); const bw=W(b); x.atBase=bw.includes(W(s)); x.partsNew=splitS(s).filter(p=>!bw.includes(W(p)));
  x.atBaseSameTabs=x.tabs.every(t=>W(viewText(b,t)).includes(W(s)));
  x.bornOnLane=x.partsNew.length>0; // prints at the tip, nowhere on the town's base page
  x.corpusTip=findV(VT,s); x.corpusBase=findV(VB,s); x.corpusOwn=!!x.corpusTip;
}
fs.writeFileSync(O,JSON.stringify(out,null,1));
const c={};for(const x of out){const k=x.severity+(x.class?'/cat':'');c[k]=(c[k]||0)+1;}
console.log('raw',all.length,'not verbatim',miss,'distinct',out.length,c);
const hm=out.filter(x=>x.severity!=='LOW');
console.log('HIGH+MED:',hm.length,'corpus words:',hm.filter(x=>x.corpusOwn).length,'born on lane:',hm.filter(x=>x.bornOnLane).length,'born on lane & corpus:',hm.filter(x=>x.bornOnLane&&x.corpusOwn).length);
console.log('all born on lane:',out.filter(x=>x.bornOnLane).length,'of which corpus',out.filter(x=>x.bornOnLane&&x.corpusOwn).length);

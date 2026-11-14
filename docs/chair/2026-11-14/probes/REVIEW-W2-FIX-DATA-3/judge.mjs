// REVIEW-W2-FIX-DATA-3 judge: every catalogue line, found where it prints in the dumps, read against each town's record.
//   TREE=<tree> CORPUS=<corpus.ndjson.gz> DUMPS=<dumps dir> OUT=<out.json> node judge.mjs
// Two readings per (line, town): the declared condition by the tree's own vocabulary (factsOf + atomHolds), and a
// RAW reading off the record (tier, the crisis list, institution names) that does not use the vocabulary.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
import L from './lines.mjs';
const R=process.env.TREE+'/src';
const { factsOf } = await import(R+'/domain/facts/factsOf.js');
const { atomHolds } = await import(R+'/domain/facts/factVocabulary.js');
const TIERS=['thorp','hamlet','village','town','city','metropolis'];
const crisesOf=(s)=>{ const a=Array.isArray(s.stress)?s.stress:(s.stress?[s.stress]:[]); return a.map(x=>x&&x.type).filter(Boolean); };
const names=(s)=>(s.institutions||[]).map(i=>String(i.name||''));
const has=(s,re)=>names(s).some(n=>re.test(n));
const RAW={
  market:(s)=>has(s,/market|fair|bazaar|exchange|souk|agora|merchant/i) && !has(s,/^Access to/i) || has(s,/market/i),
  river:(s)=>/riverside/i.test(String(s.config?.terrainType))||(/river/i.test(String(s.config?.tradeRouteAccess))&&!/coastal/i.test(String(s.config?.terrainType)))||undefined,
  'institution: tavern':(s)=>has(s,/tavern|\binn\b|ale ?house|alehouse|tap ?room|coaching inn/i),
  'institution: mill':(s)=>has(s,/(?<!saw)mill/i)&&!has(s,/^Access to external mill$/i)||has(s,/^(Mill|Mills|Watermill|Windmill|Grain mill)/i),
  'institution: smith':(s)=>has(s,/smith|forge/i),
  'institution: temple':(s)=>has(s,/temple|cathedral|church|monaster|abbey|basilica|parish/i)&&!has(s,/^Access to/i)||has(s,/temple|cathedral/i),
  'institution: docks':(s)=>has(s,/dock|port facilit|harbou?r|wharf|quay/i),
  'institution: mine':(s)=>has(s,/\bmine\b|\bmines\b/i),
  church:(s)=>has(s,/church|cathedral|chapel|temple|abbey|basilica|monaster|parish/i)&&!names(s).every(n=>!/church|cathedral|chapel|temple|abbey|basilica|monaster|parish/i.test(n)||/^Access to/i.test(n)),
  'church access':(s,page)=>/has no church of its own; its people (walk|go|travel)/i.test(page)||has(s,/^Access to .*(church|parish|temple)/i)||undefined,
  healer:(s)=>has(s,/healer|physician|apothecar|hospital|herbal|infirm|surgeon|chirurg|leech/i),
  guild:(s)=>has(s,/guild/i),
};
function rawHolds(atom,s){
  let m=/^tier: (≥|≤|=) (\w+)$/.exec(atom); if(m){ const t=TIERS.indexOf(s.tier), x=TIERS.indexOf(m[2]); return m[1]==='≥'?t>=x:m[1]==='≤'?t<=x:t===x; }
  m=/^crisis: (\w+)$/.exec(atom); if(m){ const c=crisesOf(s); if(['threat','unrest','hunger','succession'].includes(m[1])) return undefined; return c.includes(m[1]); }
  m=/^ruler: (\w+)$/.exec(atom); if(m) return undefined;
  return RAW[atom]?RAW[atom](s,PAGE):undefined;
}
function judge(cond,s,F){
  const out=[]; const crisis=crisesOf(s);
  for(const a of cond.needs||[]){ const v=atomHolds(a,F), r=rawHolds(a,s); if(v!==true) out.push(`vocab: needs ${a} =${v}`); if(r===false) out.push(`raw: needs ${a} =false`); }
  for(const a of cond.excludes||[]){ const v=atomHolds(a,F), r=rawHolds(a,s); if(v!==false) out.push(`vocab: excludes ${a} =${v}`); if(r===true) out.push(`raw: excludes ${a} =true`); }
  if((cond.crisis||[]).length && !cond.crisis.includes('any') && !cond.crisis.some(c=>crisis.includes(c))) out.push(`raw: crisis ${cond.crisis} not in [${crisis}]`);
  return out;
}
let PAGE='';
const rec=new Map();
const rl=readline.createInterface({input:fs.createReadStream(process.env.CORPUS).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const o=JSON.parse(line); rec.set(o.seed,o.s); }
const res={}; for(const l of L) res[l.id]={id:l.id,kind:l.kind,file:l.file,fn:l.fn,re:l.re.source,cond:l.cond,towns:[],fails:[]};
for(const f of fs.readdirSync(process.env.DUMPS)){
  const seed=f.replace(/\.txt$/,''); const s=rec.get(seed); if(!s) continue; const F=factsOf(s);
  const text=fs.readFileSync(process.env.DUMPS+'/'+f,'utf8').split('\n');
  let view=''; const hit=new Map(); PAGE=text.join('\n');
  for(const ln of text){ if(ln.startsWith('== ')){view=ln;continue;} for(const l of L){ const m=l.re.exec(ln); if(m){ const h=hit.get(l.id)||{views:new Set(),sent:''}; h.views.add(view); if(!h.sent){ const i=Math.max(0,m.index-160); h.sent=ln.slice(i,m.index+m[0].length+160);} hit.set(l.id,h);} } }
  for(const [id,h] of hit){ const l=L.find(x=>x.id===id); const why=judge(l.cond,s,F);
    const t={seed,name:s.name,tier:s.tier,pop:s.population,crisis:crisesOf(s),views:[...h.views].map(v=>v.replace(/^== | ==$/g,'')),sent:h.sent};
    res[id].towns.push(t); if(why.length) res[id].fails.push({...t,why}); }
}
fs.writeFileSync(process.env.OUT,JSON.stringify(res,null,1));
for(const r of Object.values(res)) console.log(r.id.padEnd(5),String(r.towns.length).padStart(4),'fails',String(r.fails.length).padStart(3),r.kind);

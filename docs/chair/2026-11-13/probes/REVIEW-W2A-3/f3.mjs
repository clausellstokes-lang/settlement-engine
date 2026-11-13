// node f3.mjs <base-dumps> <tip-dumps> <corpus.ndjson.gz>: the crime desk's lines, base against tip, with the town's facts
import fs from 'node:fs'; import zlib from 'node:zlib';
const [B,T,C]=process.argv.slice(2); const recs={};
for(const l of zlib.gunzipSync(fs.readFileSync(C)).toString().split('\n')){ if(!l.trim())continue; const o=JSON.parse(l); recs[o.seed]=o.s; }
const RX=/officials?\b|bought|bribe|payroll|grip on the hall|approach was made|nothing is bought|business with the hall|reach into the hall|criminal money/i;
const out={}, inn={}; const easier=[]; let towns=0;
const lines=(f)=>{ const m=new Map(); let tab=''; for(const l of fs.readFileSync(f,'utf8').split('\n')){ if(l.startsWith('== ')){tab=l;continue;} if(/^== Systems\/(Power|Defense)/.test(tab)&&RX.test(l)) m.set(l,tab);} return m; };
const norm=(l,r)=>l.split(r.name).join('{N}').replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/g,'{T}').slice(0,90);
for(const f of fs.readdirSync(T)){ const s=f.replace('.txt',''); const r=recs[s]; if(!r||!fs.existsSync(B+'/'+f)) continue;
  const b=lines(B+'/'+f), t=lines(T+'/'+f); let moved=false;
  for(const l of b.keys()) if(!t.has(l)){ const k=norm(l,r); out[k]=(out[k]||0)+1; moved=true; }
  for(const l of t.keys()) if(!b.has(l)){ const k=norm(l,r); inn[k]=(inn[k]||0)+1; moved=true; }
  if(moved) towns++;
  const page=fs.readFileSync(T+'/'+f,'utf8');
  for(const l of t.keys()) if(/Each season it gets easier to buy an official/.test(l)){
    const st=(Array.isArray(r.stress)?r.stress:r.stress?[r.stress]:[]).map(x=>x.type);
    const held=/patrols properly|well paid, well equipped|military command has taken charge of the streets|Occupation authorities enforce|curfew|watch is (?:strong|vigilant)/i.exec(page);
    const bl=[...lines(B+'/'+f).keys()].find(x=>/Criminal money is reaching the officials|spending money their posts never paid|Each season it gets easier/.test(x))||'';
    easier.push({s, tier:r.tier, pop:r.population, st:st.join('+'), contradicted: held?held[0]:null, watch: (r.defenseProfile?.institutions?.watch||[]).length, baseLine: /Each season/.test(bl)?'v2':/Criminal money/.test(bl)?'v1':/spending money/.test(bl)?'v3':'none'});
  } }
const top=(o)=>Object.entries(o).sort((a,b)=>b[1]-a[1]);
console.log('towns moved',towns,'| lines out',Object.values(out).reduce((a,b)=>a+b,0),'| lines in',Object.values(inn).reduce((a,b)=>a+b,0));
console.log('OUT'); for(const [k,v] of top(out)) console.log(' ',v,k); console.log('IN'); for(const [k,v] of top(inn)) console.log(' ',v,k);
const by=(f)=>{const c={}; for(const e of easier){const k=f(e); c[k]=(c[k]||0)+1;} return c;};
console.log('EASIER (the one ADVANCING line left at no official in pay):',easier.length);
console.log(' by tier',by(e=>e.tier)); console.log(' contradicted on its own page by a held street:',easier.filter(e=>e.contradicted).length, by(e=>e.contradicted?e.st||'none':'-'));
console.log(' by base line',by(e=>e.baseLine)); console.log(' contradicted, by base line',by(e=>e.contradicted?e.baseLine:'-')); console.log(' contradiction words',by(e=>e.contradicted||'-'));
console.log(' in a thorp or hamlet (streets, an official):',easier.filter(e=>e.tier==='thorp'||e.tier==='hamlet').length);
fs.writeFileSync('/home/user/wt/probes/f3-easier.json',JSON.stringify(easier,null,1));

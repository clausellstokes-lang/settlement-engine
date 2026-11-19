// whereprints.mjs <dir> <regex>...: for each line pattern, where it prints in the goals: count, smallest and largest tier, a crisis town (siege/famine/occupied), one sentence each.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [D,...res]=process.argv.slice(2); const T=['thorp','hamlet','village','town','city','metropolis'];
const rows=[]; for(const f of fs.readdirSync(D).filter(f=>f.endsWith('.ndjson.gz'))) for(const l of zlib.gunzipSync(fs.readFileSync(D+'/'+f)).toString().split('\n')) if(l) rows.push(JSON.parse(l));
for(const re of res){ const R=new RegExp(re); const hits=[];
  for(const r of rows) for(const c of r.npcs) for(const g of [c.gs,c.gl, c.sec, c.sp]) if(g&&R.test(g)) hits.push({k:r.key,t:r.tier,p:r.pop,st:r.stress,g,who:c.title});
  if(!hits.length){ console.log(`[${re}] prints nowhere`); continue; }
  hits.sort((a,b)=>T.indexOf(a.t)-T.indexOf(b.t)||a.p-b.p); const cr=hits.find(h=>h.st.some(s=>/under_siege|famine|occupied/.test(s)));
  const fmt=(h)=>`${h.k} (${h.t} ${h.p}${h.st.length?' '+h.st.join('+'):''}) ${h.who}: "${h.g}"`;
  console.log(`[${re}] ${hits.length} cards in ${new Set(hits.map(h=>h.k)).size} towns\n  small: ${fmt(hits[0])}\n  large: ${fmt(hits[hits.length-1])}\n  crisis: ${cr?fmt(cr):'none'}`); }

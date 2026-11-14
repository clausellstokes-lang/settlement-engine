// The history selection's declared refusals, read off the records (TREE, CORPUS env). Counts per rule; examples.
import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src';
const { factsOf } = await import(R+'/domain/facts/factsOf.js');
const { atomHolds } = await import(R+'/domain/facts/factVocabulary.js');
const { stabilityBandOf } = await import(R+'/domain/display/labelBands.js');
const { prosperityLabelOf } = await import(R+'/domain/prosperityRank.js');
const rows=zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map(l=>JSON.parse(l));
const out={}; const hit=(k,seed,x)=>{ (out[k]??=[]).push(seed+(x?' '+x:'')); };
const crisesOf=(s)=>{ const a=Array.isArray(s.stress)?s.stress:(s.stress?[s.stress]:[]); return a.map(x=>x&&x.type).filter(Boolean); };
for(const {seed,s} of rows){
  const F=factsOf(s); const h=s.history||{}; const cur=(h.currentTensions||[]).map(t=>t.type); const ev=(h.historicalEvents||[]).map(e=>e.templateType||e.type);
  const names=(s.institutions||[]).map(i=>i.name).join('|'); const cr=crisesOf(s);
  const dup=cur.filter((t,i)=>cur.indexOf(t)!==i); if(dup.length) hit('dup tension',seed,dup.join());
  const band=stabilityBandOf(String(s.powerStructure?.stability??'')); 
  if(cur.includes('leadership_vacuum')&&['Stable','Ordered','Enforced Order','Rigid'].includes(String(band))) hit('vacuum under settled',seed,band);
  const pl=prosperityLabelOf(s.economicState?.prosperity);
  for(const t of ['market_crash','trade_collapse']) if(cur.includes(t)&&['Prosperous','Wealthy'].includes(pl)) hit(t+' while rich',seed,pl);
  const guildV=atomHolds('guild',F), guildR=/guild/i.test(names);
  if(cur.includes('guild_conflict')&&!(guildV&&guildR)) hit('guild_conflict tension, no guild',seed,`v=${guildV} r=${guildR} ${s.tier}`);
  if(ev.includes('guild_conflict')&&!(guildV&&guildR)) hit('guild_conflict event, no guild',seed,`v=${guildV} r=${guildR} ${s.tier}`);
  if(cur.includes('occupation_legacy')&&cr.includes('occupied')) hit('occupation_legacy under occupation',seed);
  if(cur.includes('occupation_legacy')&&!ev.includes('occupation_legacy')) hit('occupation_legacy without its event',seed);
  const mV=atomHolds('market',F);
  for(const t of ['economic_disparity','trade_dispute','market_crash']) { if(cur.includes(t)&&mV!==true) hit(t+' tension, no market',seed,s.tier); }
  for(const t of ['economic_disparity','market_crash']) { if(ev.includes(t)&&mV!==true) hit(t+' event, no market',seed,s.tier); }
  if(cur.includes('infiltration_fear')&&cr.includes('infiltrated')) hit('infiltration_fear under infiltrated',seed);
  if(cur.includes('pilgrimage_surge')&&atomHolds('institution: temple',F)!==true) hit('pilgrimage_surge, no temple',seed,s.tier);
  for(const t of cur) hit('cur:'+t,seed);
}
for(const [k,v] of Object.entries(out).sort()) console.log(String(v.length).padStart(4),k, k.startsWith('cur:')?'':v.slice(0,6).join(' ; '));

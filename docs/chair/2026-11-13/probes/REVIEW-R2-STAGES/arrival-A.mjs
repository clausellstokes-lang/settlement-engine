// The arrival opener at A's base and tip over the 720: which towns draw the port pool, which have docks, which move.
import fs from 'node:fs'; import zlib from 'node:zlib';
const read=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const o=JSON.parse(l); m.set(o.seed, o.s);} return m; };
const T=process.env.TREE; const A=read(process.argv[2]), B=read(process.argv[3]);
const { ARRIVAL_SCENES } = await import(T+'/src/data/narrativeData.js');
const { factsOf } = await import(T+'/src/domain/facts/factsOf.js');
const txt=(r)=>typeof r==='function'?r('§'):typeof r.text==='function'?r.text('§'):String(r.text);
const portRows=ARRIVAL_SCENES.port.map(txt); const stem=(s)=>s.replace(/§/g,'').slice(0,28);
const which=(scene,name)=>{ const s=String(scene||'').split(name).join('§'); return portRows.findIndex(r=>s.includes(r.slice(0,40).replace(/§/g,'§'))); };
const res={docks:{n:0,moved:0,trueAfter:0},coastNoDocks:{n:0,moved:0},other:{moved:0}}; const ex=[];
for(const [seed,a] of A){ const b=B.get(seed); const fa=factsOf(b); const docks=fa.hasInstitution?.('docks'); const coast=!!fa.water?.coast;
  const ia=which(a.arrivalScene,a.name), ib=which(b.arrivalScene,b.name); const moved=a.arrivalScene!==b.arrivalScene;
  if(ia<0&&ib<0){ if(moved) {res.other.moved++; ex.push(['OTHER',seed,a.arrivalScene?.slice(0,90),b.arrivalScene?.slice(0,90)]);} continue; }
  const k=docks?'docks':'coastNoDocks'; res[k].n++; if(moved){ res[k].moved++; ex.push([k,seed,'coast='+coast,'base row '+ia,'tip row '+ib]); }
  if(docks&&ib>=0) res.docks.trueAfter++;
}
console.log(JSON.stringify(res)); for(const e of ex) console.log(e.join(' | '));

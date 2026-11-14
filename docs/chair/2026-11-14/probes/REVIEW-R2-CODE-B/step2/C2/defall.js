const z=require("zlib"),fs=require("fs"); const S="/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/";
const load=f=>new Map(z.gunzipSync(fs.readFileSync(f)).toString().trim().split("\n").map(l=>{const o=JSON.parse(l);return [o.seed,o.s];}));
const T=load(S+"births-tip.ndjson.gz");
const ct=f=>new Map(fs.readFileSync(f,"utf8").trim().split("\n").map(l=>{const o=JSON.parse(l);return [o.seed,o.L];}));
const CT=ct("all-tip.ct.jsonl"), CQ=ct("all-q.ct.jsonl");
const buckets=s=>{const di=(s.defenseProfile||{}).institutions||{}; return ["walls","garrison","watch","militia","mercenary","charter"].flatMap(b=>(di[b]||[]).map(i=>b+":"+i.name));};
let rem=[]; for(const [seed,L] of CT){ const q=CQ.get(seed)||[]; const qs=q.filter(l=>/no military, garrison or watch/.test(l)), ts=L.filter(l=>/no military, garrison or watch/.test(l));
  if(qs.length>ts.length) rem.push(seed+" "+T.get(seed).tier+" :: Q "+qs.map(x=>x.split("|")[0]).join(",")+" ; tip defender: "+L.filter(l=>/\|cast\|defends/.test(l)).join(" / ")+" ; buckets "+buckets(T.get(seed)).join(", ")); }
console.log("REMOVED",rem.length); rem.forEach(r=>console.log("  ",r));
let still=[]; for(const [seed,L] of CT){ if(L.some(l=>/no military, garrison or watch/.test(l))){ const b=buckets(T.get(seed)); if(b.length) still.push(seed+" "+T.get(seed).tier+" :: "+b.join(", ")+" | see: "+L.filter(l=>/\|see\|Defence/.test(l)).join(" / ")); } }
console.log("STILL with a bucket",still.length); still.forEach(r=>console.log("  ",r));

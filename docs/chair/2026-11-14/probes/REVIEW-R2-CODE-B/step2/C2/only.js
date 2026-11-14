const z=require("zlib"),fs=require("fs"); const f=process.argv[2];
const out={}; const ex={};
for(const l of z.gunzipSync(fs.readFileSync(f)).toString().split("\n")){ if(!l) continue; const {seed,s}=JSON.parse(l);
 for(const st of (Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[])){ const roles=(st.cast&&st.cast.roles)||[]; const stakes=(st.cast&&st.cast.stakes)||[];
  for(const r of roles){ if(r.role!=="brunt"||!/^(the only one|one of the house)/.test(r.reason)) continue;
   const n=s.npcs.find(x=>x.id===r.id); const losers=stakes.filter(k=>k.stake==="loses").map(k=>k.factionId);
   const houses=(n.memberships||[]).map(m=>{ const mem=s.npcs.filter(x=>(x.memberships||[]).some(mm=>mm.power===m.power)); return m.power+"#"+m.rank+"/"+mem.length+(losers.includes(m.power)?"*":""); });
   const isLever=roles.some(x=>x.role==="lever"&&x.id===r.id);
   const k=r.reason.slice(0,12)+(isLever?" +LEVER":""); out[k]=(out[k]||0)+1; (ex[k]=ex[k]||[]).push(seed+" "+s.tier+" "+st.type+" :: "+r.name+" ("+n.role+") houses "+houses.join(", ")+" losers="+losers.join("/"));
 } } }
for(const k in out){ console.log(k,out[k]); ex[k].slice(0,40).forEach(e=>console.log("   ",e)); }

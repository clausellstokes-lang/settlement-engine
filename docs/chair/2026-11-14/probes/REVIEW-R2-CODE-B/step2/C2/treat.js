const z=require("zlib"),fs=require("fs"); const f=process.argv[2];
const rows=z.gunzipSync(fs.readFileSync(f)).toString().trim().split("\n").map(JSON.parse); const t={};
for(const {seed,s} of rows){ for(const st of (Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[])){ for(const r of (st.cast&&st.cast.roles)||[]){ if(r.role!=="treater"||!/merchant/.test(r.reason)) continue;
  const n=(s.npcs||[]).find(x=>x.id===r.id); const pw=(n&&n.memberships||[]).map(m=>m.power+"#"+m.rank).join(",");
  const fac=(s.powerStructure.factions||[]).filter(fx=>(n.memberships||[]).some(m=>m.power===(fx.faction||fx.name))).map(fx=>fx.category);
  const k=r.reason.slice(0,30); (t[k]=t[k]||[]).push(seed+" :: "+r.name+" role="+(n&&n.role)+" in "+pw+" cat="+fac.join(",")); } } }
for(const k in t){ console.log(k, t[k].length); t[k].forEach(x=>console.log("   ",x)); }

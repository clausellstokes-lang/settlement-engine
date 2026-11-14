const z=require("zlib"),fs=require("fs"); const f=process.argv[2];
const rows=z.gunzipSync(fs.readFileSync(f)).toString().trim().split("\n").map(JSON.parse);
const out={tot:0,led:0,ex:[]};
for(const {seed,s} of rows){ for(const st of (Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[])){ for(const r of (st.cast&&st.cast.roles)||[]){ if(r.role!=="defender"||r.kind!=="institution") continue; out.tot++;
  const heads=(s.npcs||[]).filter(n=>n.institution&&n.institution.key===r.id); if(heads.length){ out.led++; if(out.ex.length<12) out.ex.push(seed+" "+s.tier+" :: "+r.name+" · "+r.reason+"  <- "+heads.map(h=>h.name+" ("+h.role+")").join(", ")); } } } }
console.log(f.split("/").pop(), "institution defenders",out.tot,"with a roster person of that house",out.led); out.ex.forEach(e=>console.log("  ",e));

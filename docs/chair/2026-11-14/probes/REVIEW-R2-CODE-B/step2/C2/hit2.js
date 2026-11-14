const z=require("zlib"),fs=require("fs"); const [f,ctf]=process.argv.slice(2);
const CT=new Map(fs.readFileSync(ctf,"utf8").trim().split("\n").map(l=>{const o=JSON.parse(l);return [o.seed,o.L];})); const t={};
for(const l of z.gunzipSync(fs.readFileSync(f)).toString().split("\n")){ if(!l) continue; const {seed,s}=JSON.parse(l); const L=CT.get(seed)||[];
 for(const st of (Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[])){ for(const r of (st.cast&&st.cast.roles)||[]){ if(r.role!=="brunt"||!/house the crisis hits/.test(r.reason)) continue;
   const n=s.npcs.find(x=>x.id===r.id); const houses=(n.memberships||[]).map(m=>m.power);
   const shown=houses.map(h=>{ const x=L.find(y=>y.startsWith(st.type+"|stake|"+h+" ")); return x? x.split("|stake|"+h+" ")[1].split(" ·")[0] : "absent"; });
   const k=r.reason.slice(0,22)+" :: "+(shown.every(x=>x==="untouched")?"ALL no-stake-yet":"some hit"); (t[k]=t[k]||[]).push(seed+"("+st.type+")"); } } }
for(const k of Object.keys(t).sort()) console.log(t[k].length, k, t[k].slice(0,4).join(" "));

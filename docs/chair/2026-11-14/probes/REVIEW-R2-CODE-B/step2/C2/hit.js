const z=require("zlib"),fs=require("fs"); const f=process.argv[2]; const t={};
for(const l of z.gunzipSync(fs.readFileSync(f)).toString().split("\n")){ if(!l) continue; const {seed,s}=JSON.parse(l);
 for(const st of (Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[])){ const roles=(st.cast&&st.cast.roles)||[]; const stakes=(st.cast&&st.cast.stakes)||[];
  for(const r of roles){ if(r.role!=="brunt"||!/house the crisis hits/.test(r.reason)) continue;
   const n=s.npcs.find(x=>x.id===r.id); const st2=Object.fromEntries(stakes.map(k=>[k.factionId,k.stake]));
   const mine=(n.memberships||[]).map(m=>st2[m.power]||"none"); const k=r.reason.replace(/ in the house.*/,"").slice(0,24)+" | person's houses' stakes: "+[...new Set(mine)].sort().join("+");
   (t[k]=t[k]||[]).push(seed); } } }
for(const k of Object.keys(t).sort()) console.log(t[k].length, k, t[k].slice(0,3).join(" "));

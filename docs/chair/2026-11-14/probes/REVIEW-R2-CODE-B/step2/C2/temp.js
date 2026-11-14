const z=require("zlib"),fs=require("fs"); const [f,ctf]=process.argv.slice(2);
const CT=new Map(fs.readFileSync(ctf,"utf8").trim().split("\n").map(l=>{const o=JSON.parse(l);return [o.seed,o.L];}));
const t={}; const tiers={}; const kinds={}; let n=0;
for(const l of z.gunzipSync(fs.readFileSync(f)).toString().split("\n")){ if(!l) continue; const {seed,s}=JSON.parse(l); const L=CT.get(seed)||[];
 for(const st of (Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[])){ for(const r of (st.cast&&st.cast.roles)||[]){ if(!r.temporary) continue; n++;
   const p=s.npcs.find(x=>x.id===r.id); const noLev=L.includes(st.type+"|lever|NONE");
   const k=[r.role, st.type, p?p.role:"NOCARD", p?("imp="+p.importance+" rank="+p.structuralRank+" mem="+(p.memberships||[]).length+" inst="+(p.institution?p.institution.key:"-")):"", noLev?"levers:NONE":"levers:some"].join(" | ");
   (t[k]=t[k]||[]).push(seed); tiers[s.tier]=(tiers[s.tier]||0)+1; } } }
console.log("temp rows",n,JSON.stringify(tiers)); for(const k of Object.keys(t).sort((a,b)=>t[b].length-t[a].length)) console.log(t[k].length,k,t[k].slice(0,3).join(" "));

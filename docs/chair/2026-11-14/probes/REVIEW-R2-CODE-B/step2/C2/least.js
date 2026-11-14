const z=require("zlib"),fs=require("fs"); const f=process.argv[2], ctf=process.argv[3];
const CT=new Map(fs.readFileSync(ctf,"utf8").trim().split("\n").map(l=>{const o=JSON.parse(l);return [o.seed,o.L];}));
const res={ok:0,one:0,notLeast:0,lever:0,rows:0}, bad=[];
for(const l of z.gunzipSync(fs.readFileSync(f)).toString().split("\n")){ if(!l) continue; const {seed,s}=JSON.parse(l);
 for(const st of (Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[])){ const roles=(st.cast&&st.cast.roles)||[];
  for(const r of roles){ if(r.role!=="brunt"||!/least say/.test(r.reason)) continue; res.rows++;
   const n=s.npcs.find(x=>x.id===r.id); const hook=(CT.get(seed)||[]).find(x=>x.startsWith(st.type+"|chook|")&&x.includes(r.name+" of "));
   const fac=hook? hook.split(r.name+" of ")[1].split(" takes the worst")[0] : null;
   const mem=(fac? s.npcs.filter(x=>(x.memberships||[]).some(m=>m.power===fac)) : []);
   const myRank=fac? ((n.memberships||[]).find(m=>m.power===fac)||{}).rank : null;
   const ranks=mem.map(x=>((x.memberships||[]).find(m=>m.power===fac)||{}).rank);
   const isLever=roles.some(x=>x.role==="lever"&&x.id===r.id);
   const maxRank=Math.max(...ranks.filter(x=>x!=null));
   let v="ok"; if(isLever) v="lever"; else if(mem.length<=1) v="one"; else if(myRank!=null&&myRank<maxRank) v="notLeast";
   res[v]=(res[v]||0)+1; if(v!=="ok"||bad.length<0) bad.push(seed+" "+s.tier+" "+st.type+" :: "+r.name+" ("+n.role+") of "+fac+" rank "+myRank+" of ranks ["+ranks.join(",")+"] members "+mem.length+(isLever?" LEVER":""));
   if(v==="ok"&&res.ok<=4) console.log("OK-ex",seed,s.tier,r.name,"("+n.role+") of",fac,"rank",myRank,"ranks",ranks.join(","));
 } } }
console.log(JSON.stringify(res)); bad.slice(0,30).forEach(b=>console.log("  ",b));

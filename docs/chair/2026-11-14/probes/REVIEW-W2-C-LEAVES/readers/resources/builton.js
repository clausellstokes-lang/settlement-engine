const o=require("./every-out.json");const {leaves,rec}=require("./lib.js");const fs=require("fs");
const INC={fish:/fish/i,grain:/grain/i,livestock:/wool|livestock/i,"medicinal herbs":/apothec|herbal/i,"iron ore":/iron/i,"gold/silver ore":/iron & metal|mint/i,gemstones:/gem/i,oasis_water:/oasis|water/i,hot_springs_mineral:/pilgrim|apothec|herbal/i,clay:/clay|potter/i};
const EX={fish:/fish|seafood/i,grain:/grain|flour/i,livestock:/livestock|wool|cattle|sheep|leather/i,"medicinal herbs":/herb|remed|potion/i,"iron ore":/iron/i,"gold/silver ore":/gold|silver|precious/i,gemstones:/gem/i,oasis_water:/water|oasis/i,hot_springs_mineral:/healing water|mineral/i,clay:/pottery|clay|brick/i};
const res=[];
for(const x of o.filter(o=>o.k==="full:builtOn")){const lv=leaves[x.seed];const R=rec(x.seed);const inc=R.economicState.incomeSources;
 const first=lv.exploit.full.map(c=>c.r).sort()[0];
 const m=inc.filter(i=>INC[first].test(i.source));const share=m.reduce((a,i)=>a+i.percentage,0);
 const ex=(R.economicState.primaryExports||[]).filter(e=>EX[first].test(e));
 const big=["town","city","metropolis"].includes(lv.tier);
 const verdict= big ? (share>=15?"true":"false") : (ex.length||share>=15?"true":"false");
 res.push({seed:x.seed,tier:lv.tier,crisis:lv.crisis,first,share,top:inc[0].source+" "+inc[0].percentage+"%",ex:ex.slice(0,3),verdict});}
const f=res.filter(r=>r.verdict==="false");console.log(res.length,f.length);for(const r of res)console.log(JSON.stringify(r));
fs.writeFileSync("builton-out.json",JSON.stringify(res,null,1));

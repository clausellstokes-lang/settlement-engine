const {L,leaves,rec,tab}=require("./lib.js");
const KEY={"Alpine pastures":["alpine_pasture"],"Medicinal herbs":["medicinal herbs"],"Fine glass sand":["glass sand","glass_sand"],"Wool":["wool"],"Salt pans":["desert_salt"],"Animal hides":["animal hides"],"Timber":["timber"],"Mountain timber":["mountain_timber"],"Mineral hot springs":["hot_springs_mineral"],"Camel herds":["camel_herds"],"Iron ore":["iron ore"],"Fish":["fish"]};
const P=L.filter(r=>/^Partial/.test(r.line));const out=[];
for(const r of P){const res=r.line.replace(/^Partial/,"").replace(/(very high|high|medium|low) value$/,"");const lv=leaves[r.seed];
 const cards=lv.exploit.partial.filter(c=>KEY[res].includes(c.r));
 for(const c of cards){out.push({seed:r.seed,res,tier:lv.tier,crisis:lv.crisis,filed:c.filed,moved:c.moved,houses:c.houses,needs:c.needs})}}
const z=out.filter(x=>x.needs.length===0);
console.log(out.length,z.length);const by={};for(const x of z){by[x.res]=(by[x.res]||[]);by[x.res].push(x.seed+(x.moved?"*":""))}
for(const k in by)console.log(k,by[k].length,by[k].slice(0,6).join(" "));
module.exports={out};

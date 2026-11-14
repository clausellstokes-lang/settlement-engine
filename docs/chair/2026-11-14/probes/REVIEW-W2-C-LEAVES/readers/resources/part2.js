const r=require("./part-out.json");const {leaves,rec}=require("./lib.js");const fs=require("fs");
const FIN={wool:/cloth|clothing|textiles|dyed|felt|garment/i,alpine_pasture:/cloth|clothing|textiles|dyed|felt|garment/i,timber:/barrel|ship construction|river craft|cargo barge|furniture|bows and crossbows|\bcarts?\b|wagon/i,mountain_timber:/barrel|ship construction|furniture|bows and crossbows/i,"animal hides":/leather|boots|saddle|shoe/i,"medicinal herbs":/remed|potion|elixir|tincture/i,"glass sand":/glass(?! sand)/i,glass_sand:/glass(?! sand)/i,hot_springs_mineral:/medicines|remed/i,desert_salt:/salted|preserved/i};
const MK={wool:/weav|dye|full|tailor|textile/i,alpine_pasture:/weav|dye|full|tailor|textile/i,timber:/carpent|cooper|shipyard|shipwright|bowyer|sawmill|wheelwright|boat/i,mountain_timber:/carpent|cooper|shipyard|bowyer|sawmill|charcoal/i,"animal hides":/tann|leather|cobbl|saddl/i,"medicinal herbs":/apothec|alchem|herbal/i,"glass sand":/glass/i,glass_sand:/glass/i,hot_springs_mineral:/apothec|alchem/i,desert_salt:/salt|fish/i};
const out={};
for(const k in r){out[k]={n:r[k].ok.length,f:[]};for(const x of r[k].ok){const lv=leaves[x.seed];const R=rec(x.seed);
 const cands=x.ev.filter(e=>e.needs.length&&e.sold.length);
 const fin=cands.map(e=>({r:e.r,fin:(R.economicState.primaryExports||[]).filter(ex=>FIN[e.r]&&FIN[e.r].test(ex)),mk:lv.roster.filter(n=>MK[e.r]&&MK[e.r].test(n)),needs:e.needs}));
 if(fin.length&&fin.every(f=>f.fin.length&&f.mk.length))out[k].f.push({seed:x.seed,tier:x.tier,crisis:x.crisis,s:x.s,fin})}}
for(const k in out){console.log("##",k,out[k].n,out[k].f.length);for(const x of out[k].f)console.log(x.seed,x.tier,"|",x.s.slice(0,60),"|",JSON.stringify(x.fin))}
fs.writeFileSync("part2-out.json",JSON.stringify(out,null,1));

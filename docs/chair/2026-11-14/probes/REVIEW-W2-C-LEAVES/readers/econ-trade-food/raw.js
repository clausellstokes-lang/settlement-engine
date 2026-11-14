const {leaves,lines,rec}=require("./lib");
const SRC={honey:["foraging_areas","ancient_grove"],"medicinal herbs":["foraging_areas","ancient_grove","marshlands"],peat:["marshlands"],grain:["grain_fields","fertile_floodplain","oasis_water"],
livestock:["grazing_land","alpine_pasture","camel_herds"],wool:["grazing_land","alpine_pasture","camel_herds"],dairy:["grazing_land","alpine_pasture","camel_herds"],"animal hides":["grazing_land","alpine_pasture","camel_herds","hunting_grounds"],
iron:["iron_deposits"],metalwork:["iron_deposits"],salt:["salt_flats","desert_salt"],fish:["fishing_grounds","river_fish"],dates:["date_palms","oasis_water"],coal:["coal_deposits"],stone:["stone_quarry"],"game meat":["hunting_grounds"],
timber:["managed_forest","mountain_timber","shipbuilding_timber","ancient_grove"],flour:["grain_fields","fertile_floodplain","river_mills"],"processed textiles":["river_mills"],water:["oasis_water"],furs:["hunting_grounds"],clay:["river_clay"],pottery:["river_clay"],gems:["precious_metals","gemstone_deposits"],glass:["glass_sand"]};
const out={};
for(const l of lines){if(!l.fam.startsWith("TRADE-PILLS"))continue;const L=leaves.get(l.seed);if(L.trade.local.join("")!==l.line)continue;const r=rec(l.seed);
 const cond=Object.fromEntries((r.resourceAnalysis.resourceConditions||[]).map(c=>[c.key,c.condition]));
 for(const p of L.trade.local){if(!SRC[p])continue;const av=SRC[p].filter(k=>r.config.nearbyResources.includes(k)&&cond[k]!=="depleted");
  if(!av.length){out[p]=out[p]||[];out[p].push(l.seed+" near="+r.config.nearbyResources.map(k=>k+":"+cond[k]).join(",")+" route="+r.economicState.tradeAccess)}}}
for(const p in out){console.log(p,out[p].length);console.log(out[p].slice(0,4).join("\n"))}

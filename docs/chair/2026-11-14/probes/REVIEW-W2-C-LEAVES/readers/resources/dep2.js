const fs=require("fs");const {leaves,rec,tab}=require("./lib.js");
const fam=JSON.parse(fs.readFileSync("prose-fam.json","utf8"));
const W={iron_deposits:/iron ore/i,gemstone_deposits:/gem/i,salt_flats:/salt/i,coal_deposits:/coal|peat/i,precious_metals:/gold|silver|precious metal/i,stone_quarry:/stone/i,fishing_grounds:/fish|seafood/i,river_fish:/fish/i,grain_fields:/grain|flour|bread/i,hunting_grounds:/game|fur|pelt|hide/i,foraging_areas:/honey|herb|forage/i,ancient_grove:/sacred wood|ritual comp/i,managed_forest:/timber|lumber|plank|beam/i,mountain_timber:/timber|plank|pine/i,grazing_land:/livestock|wool|dairy/i,alpine_pasture:/wool|sheep/i,marshlands:/reed|peat|waterfowl/i,camel_herds:/camel/i,date_palms:/date/i,ancient_ruins:/relic|antiq|artifact/i,glass_sand:/sand|glass/i};
const out={};
for(const k of ["dep:nothingMore","dep:workedOutExh","dep:workedOut","dep:bothers"]){out[k]={n:0,f:[]};
 for(const r of fam[k]){out[k].n++;const R=rec(r.seed);const lv=leaves[r.seed];const c=R.resourceAnalysis.resourceConditions.find(c=>c.label.toLowerCase()===r.m[0].toLowerCase());
  const ch=lv.chains.filter(x=>x.input===c.key&&/running/.test(x.raw)).map(x=>x.id+":"+x.raw);
  const ex=(R.economicState.primaryExports||[]).filter(e=>W[c.key]&&W[c.key].test(e)&&!/exhaust|deplet|import/i.test(e));
  if(ch.length||ex.length)out[k].f.push([r.seed,r.s,"chains "+ch+" exports "+ex])}}
for(const k in out){console.log(k,out[k].n,out[k].f.length);for(const x of out[k].f.slice(0,12))console.log("  ",JSON.stringify(x))}

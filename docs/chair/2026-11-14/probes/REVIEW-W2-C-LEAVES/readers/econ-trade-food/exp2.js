const {leaves,lines,rec}=require("./lib");
const strip=p=>p.replace(/ \((transit|naval route only|taxed by occupation)\)/g,"").trim();
// resource-derived exports
const RES={"Raw sand":["glass_sand","desert_salt"],"Raw wool":["grazing_land","alpine_pasture","camel_herds"],Livestock:["grazing_land","alpine_pasture","camel_herds"],"Live sheep":["grazing_land","alpine_pasture"],
"Sacred wood":["ancient_grove"],"Ritual components":["ancient_grove"],"Water rights":["oasis_water"],"Oasis provisions":["oasis_water"],"Iron ore":["iron_deposits"],"Rock salt":["desert_salt","salt_flats"],
"Date harvest":["date_palms"],"Desert grain":["date_palms"],"Medicinal herbs":["foraging_areas","ancient_grove","marshlands","hot_springs_mineral","magical_node"],"Wild honey":["foraging_areas","ancient_grove","marshlands"],
"Healing waters (bottled)":["hot_springs","hot_springs_mineral"],"Pilgrim hospitality":["hot_springs","hot_springs_mineral"],"Precious metals":["precious_metals"],"Reeds and thatch":["marshlands"],Waterfowl:["marshlands"],
Coal:["coal_deposits"],"Sea salt":["salt_flats"],"Draft camels":["camel_herds"],"Camel leather":["camel_herds"],"Camel wool":["camel_herds"],"Hewn timber":["mountain_timber","managed_forest"],"Pine planks":["mountain_timber","managed_forest"],
"Peat fuel":["marshlands"],"Recovered artefacts":["ancient_ruins"],"Shipbuilding timber":["shipbuilding_timber"],"Game meat":["hunting_grounds"],"Hunting trophies":["hunting_grounds"],"Raw gemstones":["gemstone_deposits","precious_metals"],
"Hardwood beams":["managed_forest","ancient_grove"],"Mineral salts":["hot_springs_mineral"],Alum:["hot_springs_mineral"],Sulfur:["hot_springs_mineral"],"Milled flour":["grain_fields","river_mills","fertile_floodplain"],"Milled timber":["managed_forest","mountain_timber","river_mills"],
"Quarried stone":["stone_quarry"],"Grain surplus":["grain_fields","fertile_floodplain"],"Salted fish":["fishing_grounds","river_fish"],"Smoked seafood":["fishing_grounds","river_fish"],"Fish oil":["fishing_grounds","river_fish"],"Freshwater catch":["river_fish","fishing_grounds"],"River fish":["river_fish"],"Furs and pelts":["hunting_grounds"],"Charcoal":["managed_forest","mountain_timber","ancient_grove","shipbuilding_timber"]};
const SVC={"Legal services (contracts, notarial)":/court|magistrat|notar|lawyer|legal|judge|chancery|guild governance|city hall|town hall/i,
"Waterborne freight services (cargo, pilotage)":/dock|port|harbou?r|barge|ferry|boat|wharf|quay|shipyard/i,"Ship passage":/dock|port|harbou?r|shipyard|wharf|quay/i,"Maritime services (cargo, pilotage)":/dock|port facilit|harbou?r|wharf|quay/i,
"Alchemical trade (potions, reagents)":/alchem/i,"Alchemical reagents":/alchem/i,"Military contract services":/garrison|mercenar|free company|barracks|hired blades|veteran|citadel|military|fortress|army/i,
"Military services — garrison contracts and armed escort":/garrison|mercenar|free company|barracks|hired blades|citadel|militia|military/i,"Military services — standing army leasing, siege engineering, garrison contracts":/garrison|barracks|army|citadel|military/i,
"Pilgrimage & religious tourism":/cathedral|temple|shrine|monaster|abbey|pilgrim|church|basilica|holy/i,"Financial services (letters of credit)":/bank|money|lender|counting|exchange|pawn|mint/i,"Financial services":/bank|money|lender|exchange/i,
"Arcane services (identification, enchanting)":/wizard|mage|arcan|enchant|sorcer|magic|scroll/i,"Spellcasting (minor)":/wizard|mage|arcan|hedge|magic|temple|church|priest|druid|cleric|sorcer|witch|shrine/i,"Magical identification":/wizard|mage|arcan|magic|enchant|sage/i,"Magical services":/wizard|mage|arcan|magic|hedge|witch/i,
"Rare texts":/librar|scriptor|archive|sage|universit|college|monaster|scribe|wizard|scholar/i,"Scholarly services (research access, rare texts)":/librar|scriptor|archive|sage|universit|college|scholar|academ/i,"Educational services (degrees, training)":/universit|college|academ|school/i,"Higher education":/universit|college|academ/i,
"Arcane reagents":/alchem|wizard|mage|arcan|enchant|magic|herb/i,"News and information":/crier|news|chronicl|post|courier|press|print|tavern|inn/i,"Maps and charts":/cartograph/i,"Books and manuscripts":/print|scriptor|bookbind|librar|universit|college|scribe|sage|wizard/i,
"Magical item market":/magic|enchant|wizard|mage|arcan/i,"Weapon enchantment":/enchant|wizard|mage|arcan|magic/i,"Planar travel information":/planar|portal|teleport|wizard|mage/i,"Ship construction":/shipyard|boatyard|shipwright/i,"River craft":/boatyard|shipyard|shipwright/i,"Cargo barges":/boatyard|shipyard|shipwright|barge/i,"Ocean-going vessels":/shipyard|shipwright/i,"River barges":/boatyard|shipyard|barge/i,
"Cavalry mounts":/stable|horse|beast|breeder|graz|herd|stud/i,"Draft horses":/stable|horse|beast|breeder|graz|herd|stud/i,"Meals and drink":/inn|tavern|alehouse|ale house|food/i,"Weapons and armour":/smith|armou?r|weapon|forge/i,"Quality tools and weapons":/smith|forge|metalwork/i};
const flags=[];
for(const l of lines){if(!l.fam.startsWith("TRADE-PILLS"))continue;const L=leaves.get(l.seed);if(L.trade.exports.join("")!==l.line)continue;const r=rec(l.seed);
 const cond=Object.fromEntries(r.resourceAnalysis.resourceConditions.map(c=>[c.key,c.condition]));const near=r.config.nearbyResources;
 const own=L.roster.filter(n=>!/^access to/i.test(n));
 for(const p of L.trade.exports){const g=strip(p);const transit=/\(transit\)/.test(p);
  const ch=L.chains.filter(c=>c.outputs.some(o=>o.toLowerCase()===g.toLowerCase()));
  if(transit){if(!ch.some(c=>c.entrepot||/entrepot/.test(c.raw)))flags.push({seed:l.seed,p,code:"transit-no-entrepot",info:ch.map(c=>c.id+":"+c.raw).join(",")});continue}
  if(RES[g]){const av=RES[g].filter(k=>near.includes(k)&&cond[k]!=="depleted");const subs=ch.some(c=>/running|vulnerable|magically/.test(c.shown||c.raw));
    if(!av.length&&!subs)flags.push({seed:l.seed,p,code:"res-absent",info:RES[g].map(k=>k+":"+(near.includes(k)?cond[k]:"absent")).join(",")+" chains="+ch.map(c=>c.id+":"+(c.shown||c.raw)).join(",")});}
  else if(SVC[g]){const h=own.filter(n=>SVC[g].test(n));if(!h.length)flags.push({seed:l.seed,p,code:"svc-nohouse",info:L.tier+" route="+L.route+" chains="+ch.map(c=>c.id+":"+(c.shown||c.raw)).join(",")})}
  else if(!ch.length)flags.push({seed:l.seed,p,code:"unmapped",info:""});
  else if(!ch.some(c=>/running|vulnerable|operational|entrepot|magically/.test(c.shown||c.raw)))flags.push({seed:l.seed,p,code:"chain-notworking",info:ch.map(c=>c.id+":"+(c.shown||c.raw)).join(",")});
 }}
require("fs").writeFileSync("expflags.json",JSON.stringify(flags,null,1));
const g={};for(const f of flags){const k=f.code+" "+strip(f.p);(g[k]=g[k]||[]).push(f.seed+" "+f.info)}
for(const k in g){console.log(g[k].length,k);console.log("   "+g[k].slice(0,3).join("\n   "))}

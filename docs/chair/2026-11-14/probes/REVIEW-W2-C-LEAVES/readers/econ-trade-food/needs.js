const {leaves,lines,rec}=require("./lib");
const T={
 timber:{near:["managed_forest","mountain_timber","shipbuilding_timber"],house:/woodcut|lumber|sawmill|forester|timber|logging/i,pill:/^(timber|milled lumber|milled timber|hewn timber|pine planks|shipbuilding timber|hardwood beams|fuel wood)/i},
 stone:{near:["stone_quarry"],house:/quarr/i,pill:/^(stone|quarried stone)/i},
 clay:{near:["river_clay"],house:/clay pit|brick|clay/i,pill:/^(clay)/i},
 "copper ore":{near:[],house:/copper/i,pill:/copper/i},
 grapes:{near:[],house:/vineyard|vintner|winery/i,pill:/grape|wine/i},
 "gold/silver ore":{near:["precious_metals"],house:/gold|silver|precious/i,pill:/^precious metals|^gems/i},
 "glass sand":{near:["glass_sand"],house:/sand/i,pill:/sand/i},
 "mineral hot springs":{near:["hot_springs_mineral"],house:/bath|spa|spring/i,pill:/healing waters|mineral salts/i},
 salt:{near:["salt_flats","desert_salt"],house:/salt/i,pill:/salt/i},
 livestock:{near:["grazing_land","alpine_pasture","camel_herds"],house:/graz|herd|pastur|shepherd|dairy|stock|cattle/i,pill:/^(livestock|live sheep|raw wool|wool|dairy)/i},
 fish:{near:["fishing_grounds","river_fish"],house:/fish/i,pill:/fish|seafood|catch/i},
 "animal hides":{near:["hunting_grounds","grazing_land"],house:/tann|hunt|leather|butcher/i,pill:/hides|leather|furs/i},
 "iron ore":{near:["iron_deposits"],house:/mine|iron/i,pill:/^iron/i},
 metals:{near:["iron_deposits","precious_metals"],house:/mine|smelt/i,pill:/^iron|metal|ingot/i},
 "medicinal herbs":{near:["foraging_areas","ancient_grove","marshlands"],house:/herb|apothec/i,pill:/medicinal herbs|herbal/i},
 "charcoal and fuel":{near:["coal_deposits","managed_forest","marshlands"],house:/charcoal|peat|coal|collier/i,pill:/coal|charcoal|peat|fuel/i},
 "preserved provisions for winter":{near:[],house:/salt|smoke|preserv/i,pill:/preserved/i},
 "quality textiles":{near:[],house:/weav|textile|cloth/i,pill:/textile|cloth/i},
 "quality textiles and cloth":{near:[],house:/weav|textile|cloth/i,pill:/textile|cloth/i},
 "fine textiles":{near:[],house:/silk|fine textile/i,pill:/fine textile/i},
 "livestock for meat and draft":{near:["grazing_land","alpine_pasture","camel_herds"],house:/graz|herd|pastur|shepherd|stock|cattle|horse/i,pill:/livestock|draft/i},
};
function key(g){g=g.toLowerCase().replace(/_/g," ").replace(/ \(.*\)$/,"");if(g==="mountain timber"||g==="timber and building wood")return "timber";if(g==="hot springs mineral")return "mineral hot springs";return g}
const out=[];
for(const l of lines){if(!/^NEEDS/.test(l.fam))continue;const L=leaves.get(l.seed);const r=rec(l.seed);const cond=Object.fromEntries(r.resourceAnalysis.resourceConditions.map(c=>[c.key,c.condition]));
 const shown=l.line.replace(/^Needed, and not brought in: /,"").replace(/\.$/,"").split(", ");
 const dup=shown.filter((x,i)=>shown.indexOf(x)!==i);
 const hits=[];
 for(const g of L.trade.needed){const k=key(g);const t=T[k];if(!t)continue;
  const near=t.near.filter(n=>r.config.nearbyResources.includes(n)&&cond[n]!=="depleted");
  const house=L.roster.filter(n=>t.house.test(n)&&!/^access to/i.test(n));
  const pills=[...L.trade.local,...L.trade.exports].filter(p=>t.pill.test(p));
  const arriving=L.trade.arriving.filter(p=>t.pill.test(p)||p.toLowerCase().includes(k));
  if(near.length||house.length||pills.length)hits.push({g,near,house,pills,arriving});}
 out.push({seed:l.seed,tier:L.tier,crisis:L.crisis.join("+"),line:l.line,dup,hits});}
require("fs").writeFileSync("needs.json",JSON.stringify(out,null,1));
console.log("towns",out.length,"dup",out.filter(o=>o.dup.length).length,"hit",out.filter(o=>o.hits.length).length);
const byG={};for(const o of out)for(const h of o.hits){const k=key(h.g)+(h.pills.length?" PILL":"")+(h.house.length?" HOUSE":"")+(h.near.length?" NEAR":"");(byG[k]=byG[k]||[]).push(o.seed+" near="+h.near+" house="+h.house.join("|")+" pills="+h.pills.join("|"))}
for(const k in byG){console.log("\n"+k,byG[k].length);console.log(byG[k].slice(0,4).join("\n"))}

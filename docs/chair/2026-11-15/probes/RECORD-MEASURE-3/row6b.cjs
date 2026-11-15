// row 6b: the food record's one source against the roster and the income (a lone non-farm source where farming stands)
const L=require('./load.cjs')(process.argv[2]);const o={oneSource:0,oneNonFarm:0,withFarmOrHarvest:0,bySrc:{}};const ex=[];
const farm=/farm|field|croft|orchard|vineyard|plough|pasture|grain|mill|harvest/i;
for(const {seed,s} of L){const fr=s.economicState.foodSecurity.foodRecord||{};const src=(fr.foodSources||[]);if(src.length!==1)continue;o.oneSource++;
 const nm=typeof src[0]==='string'?src[0]:(src[0].label||src[0].name||src[0].id||JSON.stringify(src[0]));if(farm.test(nm))continue;o.oneNonFarm++;
 const roster=(s.institutions||[]).map(i=>i.name).filter(n=>farm.test(n));const harv=(s.economicState.incomeSources||[]).find(x=>/Harvest|Agricultural/.test(x.source));
 if(roster.length||harv){o.withFarmOrHarvest++;o.bySrc[nm]=(o.bySrc[nm]||0)+1;if(ex.length<3)ex.push([seed,nm,roster.join('|'),harv?harv.source+':'+harv.percentage:''].join(' / '))}}
console.log(JSON.stringify(o));ex.forEach(e=>console.log(e.slice(0,240)));

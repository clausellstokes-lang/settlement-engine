const TIERS=['thorp','hamlet','village','town','city','metropolis'];
const CULTURES=[...Array(11).fill(0).map((_,i)=>'c'+i),'mediterranean'];
const TERRAINS=['plains','hills','forest','riverside','coastal','mountain','desert'];
const TERRAIN_ROUTE={plains:'road',hills:'road',forest:'isolated',riverside:'river',coastal:'port',mountain:'road',desert:'road'};
const TRADE=['road','river','port','crossroads','isolated','mountain_pass','none'];
const THREAT=['safe','civilized','frontier','plagued'];
const base={settType:'town',culture:'mediterranean',terrainOverride:'plains',tradeRouteAccess:'road',monsterThreat:'civilized'};
const seed='golden-master-v3';
const rows=[];
for(const settType of TIERS)for(const culture of CULTURES)for(const terrainOverride of TERRAINS)
  rows.push({...base,settType,culture,terrainOverride,tradeRouteAccess:TERRAIN_ROUTE[terrainOverride],_seed:seed});
for(const tradeRouteAccess of TRADE) rows.push({...base,tradeRouteAccess,_seed:seed});
rows.push({...base,tradeRouteAccess:'mountain_pass',terrainOverride:'mountain',_seed:seed});
for(const monsterThreat of THREAT) rows.push({...base,monsterThreat,_seed:seed});
for(const s of [seed,'gm-seed-a','gm-seed-b','gm-seed-c']){
  rows.push({...base,tradeRouteAccess:'random_trade',terrainOverride:'auto',_seed:s});
  rows.push({...base,tradeRouteAccess:'random_trade',terrainOverride:'mountain',_seed:s});
}
for(const s of ['gm-seed-a','gm-seed-b','gm-seed-c']) rows.push({...base,_seed:s});
const keyOf=c=>[c.settType,c.culture,c.terrainOverride,c.tradeRouteAccess,c.monsterThreat,c._seed].join('|');
const seen=new Set();
const out=rows.filter(c=>{const k=keyOf(c);if(seen.has(k))return false;seen.add(k);return true;});
const bySeed={};for(const r of out) bySeed[r._seed]=(bySeed[r._seed]||0)+1;
console.log('rows',out.length,'distinct seeds',Object.keys(bySeed).length,JSON.stringify(bySeed));

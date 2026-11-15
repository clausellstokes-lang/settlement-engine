const L=require('./load.cjs')(process.argv[2]);
const o={shown:0,shownNoSource:0,noSrcNoCrimHouse:0,bothDiffer:0,bothSame:0,src:0};const ex=[],tiers={},diffs=[];
for(const {seed,s} of L){const sp=s.economicState.safetyProfile||{}, bmc=Number(sp.blackMarketCapture)||0;
 const srcs=(s.economicState.incomeSources||[]).filter(x=>x.isCriminal); const shown=bmc>=3;
 if(srcs.length)o.src++;
 if(shown){o.shown++; if(!srcs.length){o.shownNoSource++; tiers[s.tier]=(tiers[s.tier]||0)+1; if(!(sp.criminalInstitutions||[]).length)o.noSrcNoCrimHouse++; if(ex.length<3)ex.push([seed,s.tier,bmc,(s.stress||[]).map?.(x=>x.type).join(','),(s.economicState.incomeSources||[]).map(x=>x.source+':'+x.percentage).join('|')].join(' '))}
  else { const p=srcs[0].percentage; if(p!==bmc){o.bothDiffer++; diffs.push(bmc-p)} else o.bothSame++; }}}
console.log(o,tiers); ex.forEach(e=>console.log(e));
diffs.sort((a,b)=>a-b); console.log('capture minus income share: min',diffs[0],'median',diffs[diffs.length>>1],'max',diffs[diffs.length-1]);

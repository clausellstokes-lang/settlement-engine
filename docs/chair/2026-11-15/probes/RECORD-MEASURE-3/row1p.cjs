const L=require('./load.cjs')(process.argv[2]);const rank={Suppressed:0,Minor:1,Significant:2,Strong:3,Dominant:4};
let above=0,gov=0,offLadder=0;const ex=[];const lad=p=>p>=35?'Dominant':p>=25?'Strong':p>=18?'Significant':p>=10?'Minor':'Suppressed';
for(const {seed,s} of L){const F=s.powerStructure.factions||[];const g=F.find(f=>f.isGoverning);if(!g)continue;gov++;
 if(F.some(f=>f!==g&&rank[f.powerLabel]>rank[g.powerLabel])){above++;if(ex.length<3)ex.push(seed+' '+F.map(f=>(f.isGoverning?'*':'')+f.faction+':'+f.power+':'+f.powerLabel).join(' | '))}
 if(F.some(f=>lad(f.power)!==f.powerLabel))offLadder++;}
console.log({gov,above,offLadder});ex.forEach(e=>console.log(e.slice(0,300)));

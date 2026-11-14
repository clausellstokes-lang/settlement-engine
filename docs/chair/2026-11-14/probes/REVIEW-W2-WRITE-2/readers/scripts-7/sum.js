const L=JSON.parse(require('fs').readFileSync('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers/lines-7.json'));
const idx=process.argv[2]?process.argv[2].split(',').map(Number):L.map((_,i)=>i);
for(const i of idx){const l=L[i];const tiers={},str={},views={},surf={page:0,pdf:0,pp:0};
for(const p of l.prints){tiers[p.tier]=(tiers[p.tier]||0)+1;for(const s of (p.stress.length?p.stress:['calm']))str[s]=(str[s]||0)+1;for(const v of p.page||[])views[v.view]=(views[v.view]||0)+1;if(p.page?.length)surf.page++;if(p.pdf?.length)surf.pdf++;if(p.pp?.length)surf.pp++;}
console.log(i,l.id,JSON.stringify({tiers,str,views,surf}));}

const { DOSSIER_STATE_PROSE_DEFENSE: D } = await import('/home/user/wt/r5q/src/data/dossierStateProse/defense.generated.js');
const { DOSSIER_STATE_PROSE_ECONOMY: E } = await import('/home/user/wt/r5q/src/data/dossierStateProse/economy.generated.js');
const show=(blk,re)=>{for(const [k,v] of Object.entries(blk.pools)) if(re.test(k)) { console.log('##',k); (Array.isArray(v)?v:[]).forEach(x=>console.log(' v'+x.vid, JSON.stringify(x.marks), x.text.slice(0,140))); if(!Array.isArray(v)) console.log(JSON.stringify(v).slice(0,300));}};
console.log(Object.keys(D['DS-DEF-3'].pools)); show(D['DS-DEF-3'],/^(Safe|Unsafe)|curfew/i);
console.log(Object.keys(D['DS-DEF-4'].pools)); show(D['DS-DEF-4'],/semi|diffuse|none/i);
console.log(Object.keys(E['DS-ECO-6'].pools)); show(E['DS-ECO-6'],/minor shadow/);

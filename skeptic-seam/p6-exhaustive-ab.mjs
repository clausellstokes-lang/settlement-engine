const SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit';
const A = await import(`${SC}/laneB6/src/domain/display/stateProse/defenseStateProse.js`);
const B = await import(`${SC}/skepSEAM/src/domain/display/stateProse/defenseStateProse.js`);
const THREATS = ['heartland','frontier','plagued','civilized','random_threat','Heartland',' frontier ','low','nonsense','',null,undefined,0,false,true,42];
const FLAGS = [true,false,0,1,'','x',null,undefined,NaN,[],{}];
const SCORES = [-1e9,-1,-0.5,0,19,19.9,20,39,39.9,40,64,64.9,65,99,100,1e9,NaN,Infinity,-Infinity,'50',null,undefined,true,{}];
function sweep(d){const r=[];
 for(const t of THREATS) for(const p of FLAGS) for(const f of FLAGS) r.push(`beasts|${String(t)}|${String(p)}|${String(f)}|${d.beastsRowPoolKey(t,p,f)}`);
 for(const a of FLAGS) for(const b of FLAGS) for(const c of FLAGS){r.push(`invasion|${String(a)}|${String(b)}|${String(c)}|${d.invasionRowPoolKey(a,b,c)}`);r.push(`disaster|${String(a)}|${String(b)}|${String(c)}|${d.disasterRowPoolKey(a,b,c)}`);}
 for(const a of FLAGS) for(const b of FLAGS) r.push(`internal|${String(a)}|${String(b)}|${d.internalRowPoolKey(a,b)}`);
 for(const n of SCORES) r.push(`economic|${String(n)}|${d.economicRowPoolKey(n)}`);
 return r;}
const a=sweep(A), b=sweep(B);
let diff=0; const ex=[];
for(let i=0;i<a.length;i++) if(a[i]!==b[i]){diff++; if(ex.length<5) ex.push(a[i]+'  ==>  '+b[i]);}
console.log('laneB6 rows',a.length,'| skepSEAM rows',b.length,'| differing',diff);
ex.forEach(e=>console.log('  ',e));
// how many distinct keys does the tip reach for DS-DEF-2?
const keys=new Set(b.map(r=>r.split('|').pop()).filter(k=>k&&k!=='null'&&k!=='undefined'));
console.log('distinct non-null keys reached by the sweep at the tip:',keys.size);

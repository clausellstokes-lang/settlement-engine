const L=require('./load.cjs')(process.argv[2]);
const band=n=>n>=65?'STRONG':n>=40?'ADEQUATE':n>=20?'WEAK':'CRITICAL';
const poor=new Set(['Poor','Struggling']);
const out={econStrongPoor:[],econAdequatePoor:[],econStrongAll:0,milStrongVuln:[],milStrongAll:0,milAdeqUndef:[]};
const byTier={};
for(const {seed,s} of L){const sc=s.defenseProfile.scores, rl=s.defenseProfile.readiness.label, p=s.economicState.prosperity;
 if(band(sc.economic)==='STRONG'){out.econStrongAll++; if(poor.has(p)){out.econStrongPoor.push(seed);byTier[s.tier]=(byTier[s.tier]||0)+1}}
 if(band(sc.economic)==='ADEQUATE'&&poor.has(p))out.econAdequatePoor.push(seed);
 if(band(sc.military)==='STRONG'){out.milStrongAll++; if(['Vulnerable','Undefended'].includes(rl))out.milStrongVuln.push(seed)}
 if(['ADEQUATE'].includes(band(sc.military))&&rl==='Undefended')out.milAdeqUndef.push(seed);
}
for(const k in out)console.log(k,Array.isArray(out[k])?out[k].length:out[k]); console.log(JSON.stringify(byTier));
console.log('poor/struggling total',L.filter(r=>poor.has(r.s.economicState.prosperity)).length);
// what makes econ strong in poor towns: storageMonths, market etc
const ex=L.filter(r=>out.econStrongPoor.includes(r.seed)).slice(0,5);
for(const {seed,s} of ex)console.log(seed,s.tier,s.economicState.prosperity,s.defenseProfile.scores.economic,'months',s.economicState.foodSecurity.storageMonths);
const ms=L.filter(r=>out.milStrongVuln.includes(r.seed)).slice(0,6);
for(const {seed,s} of ms)console.log('MIL',seed,s.tier,JSON.stringify(s.defenseProfile.scores).slice(0,90),s.defenseProfile.readiness.score,s.defenseProfile.readiness.label);

import { load } from './load.mjs';
const R=process.env.TREE+'/src';
const { chainNeedLine } = await import(R+'/domain/display/chainNeedShown.js');
const { houseDoesChainsWork } = await import(R+'/domain/display/tradeListDisplay.js');
const out={}; const inc=(k)=>out[k]=(out[k]||0)+1; const towns=new Set(), tAfter=new Set(); const samples={};
for (const f of process.argv.slice(2)) for(const {seed,s} of load(f)){ let firstSeen=false;
 for(const c of s.economicState?.activeChains||[]){ if(!c.dependency) continue; inc('before box'); towns.add(seed);
  const line=chainNeedLine(c,s,!firstSeen); if(line) firstSeen=true;
  if(!houseDoesChainsWork(c,c.dependency.institution)) inc('out: another trade house');
  else if(!line) inc('out: no goods brought in ('+c.dependency.resource+')');
  if(line){ inc('after box'); tAfter.add(seed); const form=line.replace(/^.*?(here depend on|here run on|With the roads cut).*?((, and would falter.*)|( by magic.*)|(: no trade road.*)|(, and .* stopped\.))?$/, '$1 $2'); inc('form: '+form.slice(0,60)); (samples[form.slice(0,40)] ??= []).push(seed+' :: '+line);} } }
console.log(out, 'towns before', towns.size, 'after', tAfter.size);
for (const [k,v] of Object.entries(samples)) console.log('##',k, v.length, '\n  '+v.filter((_,i)=>i%Math.max(1,Math.floor(v.length/4))===0).slice(0,5).join('\n  '));

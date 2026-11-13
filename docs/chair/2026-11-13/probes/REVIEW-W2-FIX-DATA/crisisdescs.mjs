// REVIEW-W2-FIX-DATA: the crisis-declared lines of this lane, by the final stress, in a corpus (towns printing each).
import fs from 'node:fs'; import zlib from 'node:zlib';
const L=zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().trim().split('\n');
const probes={
 'granary original (excl famine)': [/prevents famine|hold off famine/, 'famine'],
 'granary twin (famine)': [/This year it has not been enough|The famine is drawing them down/, 'famine'],
 'charnel original (excl siege)': [/carts that go out at dusk|Carts go out at dusk/, 'under_siege'],
 'charnel twin (siege)': [/no cart goes out to the new ground|with the roads cut it now holds/, 'under_siege'],
 'mill original (excl siege)': [/Grain carted to a mill outside/, 'under_siege'],
 'mill twin': [/ground by hand at home until the carts/, 'under_siege'],
 'fresh produce original': [/Available every morning/, 'under_siege'],
 'freight original': [/Organised road transport for goods between towns. Reliable/, 'under_siege'],
 'ironwork carts arrival': [/Racks of new ironwork/, 'under_siege'],
 'travellers water arrival': [/Travellers are offered water/, 'under_siege'],
};
const res={}; for(const k in probes) res[k]={inCrisis:0,outCrisis:0,ex:[]};
for(const l of L){ const {seed,s}=JSON.parse(l); const st=new Set([s.stress?.type, ...(s.config?.stressTypes||[])].filter(Boolean));
  const txt=JSON.stringify([s.institutions.map(i=>i.desc), s.availableServices, s.arrivalScene]);
  for(const [k,[re,c]] of Object.entries(probes)) if(re.test(txt)){ if(st.has(c)){res[k].inCrisis++; if(res[k].ex.length<4) res[k].ex.push(seed);} else res[k].outCrisis++; } }
for(const [k,v] of Object.entries(res)) console.log(k.padEnd(34), 'in crisis', v.inCrisis, '| out', v.outCrisis, v.ex.join(','));

import fs from 'node:fs'; import zlib from 'node:zlib';
for(const f of process.argv.slice(2)){ let origC=0,twinC=0, millOrig=0,millTwin=0, charnelTowns=0;
 for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n')){ const {seed,s}=JSON.parse(l);
  const sg=(s.stress?.type==='under_siege')||(s.config?.stressTypes||[]).includes('under_siege')||(s.config?.selectedStressesRandom===false&&(s.config?.selectedStresses||[]).includes('under_siege'));
  if(!sg) continue;
  const ch=s.institutions.find(i=>/charnel/i.test(i.name)); if(ch){charnelTowns++; if(/carts that go out at dusk|Carts go out at dusk/i.test(ch.desc)) origC++; else if(/no cart goes out|with the roads cut it now holds/i.test(ch.desc)) twinC++;}
  const svcs=Object.values(s.availableServices||{}).flat(); 
  if(svcs.some(v=>/Grain carted to a mill outside/.test(v.desc||''))) millOrig++; if(svcs.some(v=>/ground by hand at home until the carts/.test(v.desc||''))) millTwin++; }
 console.log(f,'| charnel towns='+charnelTowns,'dusk-ORIGINAL(false)='+origC,'siege-twin(cured)='+twinC,'|| mill service: original(false)='+millOrig,'twin(cured)='+millTwin); }

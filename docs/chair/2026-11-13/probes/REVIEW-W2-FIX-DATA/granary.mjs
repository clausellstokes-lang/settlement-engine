import fs from 'node:fs'; import zlib from 'node:zlib';
for(const f of process.argv.slice(2)){ let orig=0, twin=0, other=0; const oex=[];
 for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n')){ const {seed,s}=JSON.parse(l);
  const fam=(s.stress?.type==='famine')||(s.config?.stressTypes||[]).includes('famine')||(s.config?.selectedStressesRandom===false&&(s.config?.selectedStresses||[]).includes('famine'));
  if(!fam) continue; const g=s.institutions.find(i=>/granary/i.test(i.name)); if(!g) continue;
  if(/prevents famine|hold off famine/.test(g.desc)){orig++; if(oex.length<5)oex.push(seed+'/'+s.tier);}
  else if(/has not been enough|drawing them down faster/.test(g.desc)) twin++; else other++; }
 console.log(f, '| famine+granary origORIGINAL(false)='+orig, 'twin(cured)='+twin, 'other='+other, '|', oex.join(' ')); }

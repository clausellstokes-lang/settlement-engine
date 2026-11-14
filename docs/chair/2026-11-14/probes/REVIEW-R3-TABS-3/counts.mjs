import fs from 'node:fs';
const rd=(f)=>new Map(fs.readFileSync(f,'utf8').trim().split('\n').map(JSON.parse).map(o=>[o.seed,o]));
const F=rd('facts2.jsonl'); const CLAIMS=/raiders stay away|would think again|could be held|credible against raiders|would see off a raid|answers raiders well/;
for(const t of ['base','tip']){ const D=rd(`desk.${t}.jsonl`); let occ=0,occTowns=0,crit=0,critAny=0;
  for(const [s,d] of D){ const f=F.get(s); const o=f.stress.includes('occupied'); if(o) occTowns++;
    if(o && d.lines['posture.posture']) occ++;
    const inv=d.lines['threat.invasion']?.sentence||''; const c=/CRITICAL/.test(f.mil||'');
    if(c && CLAIMS.test(inv)) crit++; if(c && inv) critAny++; }
  console.log(t,'occupied towns',occTowns,'posture under occupation',occ,'invasion claim beside Critical',crit,'any invasion line beside Critical',critAny); }

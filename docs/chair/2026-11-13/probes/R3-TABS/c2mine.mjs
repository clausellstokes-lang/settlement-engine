import fs from 'node:fs';
const mine=['tabs/DefenseTab','tabs/HistoryTab','tabs/SubstrateTab','defenseStateProse','postureLineDisqualifiers','tabs/ServicesTab'];
const rows={};
for(const dir of process.argv.slice(2)){
  const H=JSON.parse(fs.readFileSync(dir+'/hits.by-file.json','utf8'));
  for(const [file,v] of Object.entries(H)){ if(!mine.some(m=>file.includes(m))) continue;
    for(const [kind,p] of Object.entries(v.patterns||{})) for(const [w,x] of Object.entries(p.writers||{})){ const k=`${file.split('/').pop()} · ${kind} · ${w}`; rows[k]=rows[k]||{}; rows[k][dir.split('/').pop()]=`${x.lines} lines/${x.towns} towns e.g. ${x.example?.seed} "${(x.example?.sentence||'').slice(0,90)}"`; } }
}
for(const k of Object.keys(rows).sort()){ console.log(k); for(const [d,v] of Object.entries(rows[k])) console.log('   ',d,v); }

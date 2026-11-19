import fs from 'node:fs';
for (const f of process.argv.slice(2)) { if(!fs.existsSync(f)) continue; const j=JSON.parse(fs.readFileSync(f,'utf8'));
  for (const t of j.testResults) for (const a of t.assertionResults) if (a.status==='failed') console.log(f.split('/').pop()+' | '+t.name.replace('/home/user/wt/tip/','')+' | '+a.fullName.slice(0,160));
  for (const t of j.testResults) if(t.status==='failed' && !t.assertionResults.some(a=>a.status==='failed')) console.log(f.split('/').pop()+' | FILE-LEVEL '+t.name.replace('/home/user/wt/tip/','')+' | '+String(t.message).slice(0,200)); }

import fs from 'node:fs';
const p='docs/census/declarations/CULTURE_PROFILES_DAILY.json'; const raw=fs.readFileSync(p,'utf8'); const j=JSON.parse(raw);
let ind=null; for (const n of [1,2]) if (JSON.stringify(j,null,n)+'\n'===raw) ind=n; if(!ind){ console.log('format not preserved'); process.exit(1); }
const R={ 'Herding and mixed farming produce a strongly seasonal food calendar.': { text:'Herds and field grain set a strongly seasonal food calendar.' },
 'Public ovens, neighborhood vendors, and shared dining customs make food distribution visibly civic.': { text:'Public ovens, market vendors, and shared dining customs make food distribution visibly civic.', needs:['market'] },
 'Shared waterworks, fermentation, and intensive garden production structure urban food supply.': { text:'Fermentation, careful use of water, and intensive garden plots shape the food supply.', dropStop:'tier (urban food supply)' } };
let n=0; for(const pool of j.pools) for(const line of pool.lines){ const r=R[line.text]; if(!r) continue; line.text=r.text; if(r.needs){ line.needs=r.needs; line.colour=false; } if(r.dropStop) line.stop=(line.stop||[]).filter(s=>s!==r.dropStop); n++; }
fs.writeFileSync(p, JSON.stringify(j,null,ind)+'\n'); console.log('ledger lines followed', n, 'indent', ind);

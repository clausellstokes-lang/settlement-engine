import fs from 'node:fs';
const census = JSON.parse(fs.readFileSync('docs/content/wiring-census.json','utf8'));
const rows = (census.rows || census).filter(r => String(r.block||'').startsWith('DS-POW-'));
console.log('rows', rows.length, 'keys', Object.keys(rows[0]).join(','));
const kinds = {}; let covert=0, interested=0;
for (const r of rows) {
  const k = r.source?.standing + ':' + (r.source?.kind||'-') + (r.source?.stateOrgan?'*':'');
  kinds[k]=(kinds[k]||0)+1; if (r.covert===true) covert++; if (r.source?.standing==='INTERESTED') interested++;
}
console.log(JSON.stringify(kinds), 'covert', covert);
for (const r of rows) console.log(`${r.block} :: ${r.pool} | reads=${JSON.stringify(r.reads)} | key=${r.keyFunction||''} | src=${r.source?.standing}/${r.source?.kind||''} | obj=${JSON.stringify(r.objectClass ?? r.objectClasses ?? '')} | swp=${JSON.stringify(r.slotsWithoutProvider||[])} | v=${r.variants} | marks=${JSON.stringify(r.marks||r.audience||'')}`);

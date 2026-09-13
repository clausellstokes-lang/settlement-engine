import fs from 'node:fs';
const D = process.argv[2];
const j = JSON.parse(fs.readFileSync(D + '/docs/content/wiring-census.json', 'utf8'));
const rows = (j.rows || j.pools || j).filter?.(r => /^DS-(WAR|FTH)-/.test(r.block)) || [];
console.log('rows', rows.length);
const byKind = {};
for (const r of rows) {
  const k = r.source?.kind || '(none)';
  byKind[k] = byKind[k] || [];
  byKind[k].push(`${r.block} :: ${r.pool} | standing=${r.source?.standing} stateOrgan=${r.source?.stateOrgan} covert=${r.covert} reads=${JSON.stringify(r.reads)} objectClasses=${JSON.stringify(r.objectClasses)}`);
}
for (const [k, v] of Object.entries(byKind)) { console.log('\n## kind', k, v.length); if (k !== '(none)') v.forEach(x => console.log('  ' + x)); }
console.log('\n## unresolved rows reads/objectClasses');
for (const r of rows) if (!r.source?.kind) console.log(`  ${r.block} :: ${r.pool} | covert=${r.covert} reads=${JSON.stringify(r.reads)} oc=${JSON.stringify(r.objectClasses)}`);

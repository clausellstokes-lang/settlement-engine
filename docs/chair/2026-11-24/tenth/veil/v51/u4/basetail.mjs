import { readFileSync } from 'node:fs';
const SF = await import('/home/user/wt/r5rival/scripts/veil/standingForms.mjs');
const rows = SF.compileRows(SF.readTable().forms);
for (const [set, seed] of [['stored-today','r3m-town-none-0-17'],['stored-today','r3m-city-none-1-117'],['stored-master','r3m-city-none-1-117']]) {
  const d = JSON.parse(readFileSync(`/var/tmp/v51/out/p1/${set}/${seed}.json`, 'utf8'));
  const names = d.powerStructure.factions.map(f => f.faction || f.name);
  for (const f of d.powerStructure.factions) {
    const others = names.filter(n => n !== (f.faction || f.name));
    const cut = SF.cutDesc(f.desc, rows);
    const base = typeof cut === 'string' ? cut : cut?.base ?? JSON.stringify(cut);
    const inBase = others.filter(n => base.includes(n)); const inDesc = others.filter(n => (f.desc||'').includes(n));
    if (inDesc.length) console.log(set, seed, f.faction || f.name, '| names in desc:', inDesc.join(', '), '| in BASE after cut:', inBase.join(', ') || 'none');
  }
}

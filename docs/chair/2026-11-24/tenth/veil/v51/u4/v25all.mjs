import { readFileSync, readdirSync } from 'node:fs'; import { join } from 'node:path';
const tree='/home/user/wt/r5desc';
const { standingBase } = await import(join(tree, 'src/domain/display/galleryWithholdAlways.js'));
const { buildNameSearch } = await import(join(tree, 'src/domain/display/gallerySecondHomes.js'));
const namesOf = (f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v !== '');
for (const dir of process.argv.slice(2)) for (const fn of readdirSync(dir).filter((n) => /^r3m-.*\.json$/.test(n)).sort()) {
  const rec = JSON.parse(readFileSync(join(dir, fn), 'utf8')); const t = rec.data || rec.settlement || rec;
  const rows = [t.powerStructure?.factions, t.factions].filter(Array.isArray).flat().filter((f) => f && typeof f === 'object');
  for (const f of rows) { if (typeof f.desc !== 'string') continue; const own = new Set(namesOf(f));
    const named = [...new Set(rows.filter((g) => g !== f).flatMap(namesOf))].filter((n) => !own.has(n)).filter((n) => { const s = buildNameSearch([n], [...own]); return !!s && s.hit(standingBase(f.desc)); });
    if (named.length) console.log(`${dir.split('-').pop()} ${fn} ${f.name||f.faction} niche=${f.contestsNiche??''} names ${JSON.stringify(named)}\n   BASE: ${standingBase(f.desc)}\n   CUT?: ${standingBase(f.desc)!==f.desc}`);
  }
}

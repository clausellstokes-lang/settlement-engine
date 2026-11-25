// standing sentences LEFT in a cut base: a row's literal opening (template up to its first slot, >= 14 chars) found in the base
import { readFileSync, readdirSync } from 'node:fs'; import { join } from 'node:path';
const tree='/home/user/wt/r5desc';
const { standingBase } = await import(join(tree, 'src/domain/display/galleryWithholdAlways.js'));
const forms = JSON.parse(readFileSync(join(tree,'scripts/veil/standingForms.data.json'),'utf8')).forms;
const opens = [...new Set(forms.map((r) => r.template.split('{')[0].trim()).filter((s) => s.length >= 14))];
for (const dir of process.argv.slice(2)) {
  let descs=0, left=0; const places=new Set(); const byOpen=new Map(); const ex=[];
  for (const fn of readdirSync(dir).filter((n) => /^r3m-.*\.json$/.test(n))) {
    const rec = JSON.parse(readFileSync(join(dir, fn), 'utf8')); const t = rec.data || rec.settlement || rec;
    for (const f of [t.powerStructure?.factions, t.factions].filter(Array.isArray).flat()) {
      if (!f || typeof f.desc !== 'string') continue; descs++;
      const b = standingBase(f.desc); const hit = opens.filter((o) => b.includes(o));
      if (hit.length) { left++; places.add(fn); for (const o of hit) byOpen.set(o,(byOpen.get(o)||0)+1); if (ex.length<4) ex.push(`${fn} ${f.name||f.faction}: ...${b.slice(Math.max(0,b.indexOf(hit[0])-10)).slice(0,260)}`); }
    }
  }
  console.log(`${dir}: descs ${descs}; a standing sentence LEFT in the cut base: ${left} descs, ${places.size} places`);
  for (const [o,n] of [...byOpen].sort((a,b)=>b[1]-a[1])) console.log(`   ${n}  "${o}"`);
  for (const e of ex) console.log(`   e.g. ${e}`);
}

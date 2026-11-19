// desk.mjs <tree> <instances.json>... : which instances are lines of the defence desk (DS-DEF), by variant
// prints rule · block › pool · vid · town count · instance count, and writes <json>.desk.json
import fs from 'node:fs';
const [tree, ...files] = process.argv.slice(2);
const { DOSSIER_STATE_PROSE_DEFENSE: D } = await import(tree + '/src/data/dossierStateProse/defense.generated.js');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const vars = [];
for (const [bid, b] of Object.entries(D)) for (const [pool, vs] of Object.entries(b.pools || {})) for (const v of vs) {
  const parts = v.text.split(/\{[a-zA-Z]+\}/).map(esc);
  vars.push({ bid, pool, vid: v.vid, marks: v.marks || [], text: v.text, re: new RegExp(parts.join('.+?')) });
}
const fold = (s) => String(s || '').replace(/[’‘]/g, "'");
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const out = []; const agg = new Map();
  for (const x of j) {
    const s = fold(x.sentence || x.line);
    const v = vars.find((v) => v.re.test(s)) || vars.find((v) => v.re.test(fold(x.line)));
    if (!v) continue;
    out.push({ ...x, desk: `${v.bid} › ${v.pool} › v${v.vid}`, marks: v.marks });
    const k = `${x.rule} | ${v.bid} › ${v.pool} › v${v.vid} [${v.marks.join(' · ')}]`;
    const a = agg.get(k) || { towns: new Set(), n: 0, text: v.text }; a.towns.add(x.town); a.n++; agg.set(k, a);
  }
  fs.writeFileSync(f.replace(/\.json$/, '.desk.json'), JSON.stringify(out, null, 1));
  console.log(`== ${f}: ${out.length} desk instances in ${new Set(out.map((x) => x.town)).size} towns`);
  for (const [k, a] of [...agg].sort((p, q) => q[1].n - p[1].n)) console.log(`${a.towns.size}t ${a.n}i  ${k}  :: ${a.text.slice(0, 110)}`);
}

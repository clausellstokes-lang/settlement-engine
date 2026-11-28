// K2: the defence desk's kinds over a census out-dir (corpus.ndjson.gz + dumps/). usage: node k2.mjs <tree> <out-dir> [--all-desks]
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [tree, out] = process.argv.slice(2);
const leaf = (await import(pathToFileURL(path.join(tree, 'src/data/dossierStateProse/defense.generated.js')).href)).DOSSIER_STATE_PROSE_DEFENSE;
const K = await import(pathToFileURL(path.join(tree, 'tests/helpers/defenceDeskKinds.js')).href);
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const members = [];
for (const [blockId, block] of Object.entries(leaf)) {
  for (const [poolKey, vars] of Object.entries(block.pools || {})) {
    for (const v of vars) {
      if (typeof v?.text !== 'string') continue;
      const re = new RegExp(esc(v.text).replace(/\\\{[a-z_]+\\\}/gi, '(.+?)').replace(/\btown(s?)\b/g, '(?:town|thorp|hamlet|village|city|metropolis|place|settlement)$1'));
      const lit = v.text.split(/\{[a-z_]+\}|\btowns?\b/i).sort((a, b) => b.length - a.length)[0];
      members.push({ blockId, poolKey, vid: v.vid, marks: v.marks || [], re, text: v.text, lit });
    }
  }
}
const key = (d) => `${d.blockId}::${d.poolKey}::${d.vid}`;
const marks = new Map(members.map((m) => [key(m), m.marks]));
const res = { towns: 0, byKind: {}, instances: [] };
const lines = zlib.gunzipSync(fs.readFileSync(path.join(out, 'corpus.ndjson.gz'))).toString('utf8').split('\n').filter(Boolean);
for (const l of lines) {
  const { seed, s } = JSON.parse(l);
  const f = path.join(out, 'dumps', `${seed}.txt`);
  if (!fs.existsSync(f)) continue;
  res.towns++;
  let sec = '';
  const seen = new Map();
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const h = line.match(/^== (.+) ==$/);
    if (h) { sec = h[1]; continue; }
    if (sec.startsWith('PDF/') || sec.startsWith('Table/')) continue;
    for (const m of members) if (line.includes(m.lit) && m.re.test(line) && !seen.has(key(m))) seen.set(key(m), { ...m, sec, line });
  }
  const drawn = [...seen.values()];
  for (const inst of K.defenceDeskKindsIn(s, drawn, (d) => marks.get(key(d)) || [])) {
    const d = seen.get(key(inst));
    res.instances.push({ seed, ...inst, sec: d.sec, text: d.text });
  }
}
for (const i of res.instances) {
  const k = (res.byKind[i.kind] ||= { instances: 0, towns: new Set(), lines: {} });
  k.instances++; k.towns.add(i.seed); const lk = `${i.blockId}::${i.poolKey}::v${i.vid}`; k.lines[lk] = (k.lines[lk] || 0) + 1;
}
for (const [kind, k] of Object.entries(res.byKind)) {
  console.log(`${kind}: ${k.instances} instances, ${k.towns.size} towns (of ${res.towns})`);
  for (const [lk, n] of Object.entries(k.lines).sort((a, b) => b[1] - a[1])) console.log(`   ${n}  ${lk}  ${members.find((m) => key(m) === lk.replace(/::v(\d+)$/, '::$1'))?.text.slice(0, 90)}`);
}
fs.writeFileSync(path.join(out, 'k2.json'), JSON.stringify(res.instances, null, 1));

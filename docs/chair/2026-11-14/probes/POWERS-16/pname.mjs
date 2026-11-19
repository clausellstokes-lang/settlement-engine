// pname.mjs <corpus.ndjson.gz> <dumpsdir> [nameRegex]: lines naming a power whose name carries a slash/bracket, inside a sentence; by template
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, dumps, rx] = process.argv.slice(2);
const R = new RegExp(rx || '[/()\\[\\]]|\\d');
const tpl = {}; const towns = new Set(); const names = {};
for (const line of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) {
  if (!line) continue; const { seed, s } = JSON.parse(line);
  const ns = (s.powerStructure?.factions || []).map((f) => String(f.faction)).filter((n) => R.test(n));
  if (!ns.length) continue; const f = dumps + '/' + seed + '.txt'; if (!fs.existsSync(f)) continue;
  let sec = '';
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
    if (l.startsWith('== ')) { sec = l.slice(3, -3); continue; }
    for (const n of ns) { if (!l.includes(n)) continue;
      const seg = l.split(/\s·\s|\|/).filter((x) => x.includes(n)); const sentence = seg.some((x) => x.split(n).join(' ').trim().split(/\s+/).filter((w) => /^[a-z]/.test(w)).length >= 4);
      if (!sentence) continue; // a label, a chip or a rank row: not a sentence
      const L = l.split(n).join(' <P> '); const w = L.split(/\s+/).filter(Boolean); const i = w.indexOf('<P>'); const t = sec + ' :: ' + w.slice(Math.max(0, i - 3), i + 5).join(' ').replace(/\d+/g, '#');
      (tpl[t] ||= new Set()).add(seed); towns.add(seed); (names[n] ||= new Set()).add(seed);
    }
  }
}
const rows = Object.entries(tpl).map(([t, s]) => [s.size, t]).sort((a, b) => b[0] - a[0]);
console.log('towns', towns.size, 'templates', rows.length, Object.fromEntries(Object.entries(names).map(([k, v]) => [k, v.size])));
for (const [n, t] of rows.slice(0, Number(process.env.TOP || 40))) console.log(n, t);

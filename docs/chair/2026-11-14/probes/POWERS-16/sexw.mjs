// sexw.mjs <corpus> <dumps>: lines that put a female title word (alewife, madam) beside a man the record holds
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, dumps] = process.argv.slice(2);
const W = /\b(alewife|madam|Alewife|Madam)\b/;
const tpl = {}; const towns = new Set(); const people = new Set(); let menTowns = new Set();
for (const line of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) {
  if (!line) continue; const { seed, s } = JSON.parse(line);
  const men = (s.npcs || []).filter((n) => n.gender === 'male' && /alewife|madam/.test(String(n.institution?.title || n.title || '')));
  if (!men.length) continue; menTowns.add(seed); const f = dumps + '/' + seed + '.txt'; if (!fs.existsSync(f)) continue;
  const women = (s.npcs || []).filter((n) => n.gender !== 'male' && /alewife|madam/.test(String(n.institution?.title || n.title || ''))).map((n) => n.name);
  let sec = '';
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
    if (l.startsWith('== ')) { sec = l.slice(3, -3); continue; }
    if (!W.test(l)) continue;
    for (const m of men) { const first = String(m.name).split(' ')[0];
      if (!l.includes(m.name) && !l.includes(first)) continue;
      if (women.some((w) => l.includes(w))) continue; // a line naming a woman of the title too: read by hand
      const L = l.replace(m.name, '<M>'); const w = L.split(/\s+/); const i = w.findIndex((x) => W.test(x));
      const t = sec + ' :: ' + w.slice(Math.max(0, i - 4), i + 3).join(' ');
      (tpl[t] ||= new Set()).add(seed); towns.add(seed); people.add(seed + m.name);
    }
  }
}
const rows = Object.entries(tpl).map(([t, s]) => [s.size, t]).sort((a, b) => b[0] - a[0]);
console.log('towns with such men', menTowns.size, 'towns printing', towns.size, 'men', people.size, 'templates', rows.length);
for (const [n, t] of rows.slice(0, Number(process.env.TOP || 30))) console.log(n, t);

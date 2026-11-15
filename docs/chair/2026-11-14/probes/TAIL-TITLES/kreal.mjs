// TAIL-TITLES: kprint's lines less its false hits (the power's name "Headman's Authority", "landlord", "the village
// headman's office"), split: an HONORIFIC line ("Connection: <Honorific> <Name>", the pools' word) or a TITLE line.
// node kreal.mjs <before> <after> <dumps>
import fs from 'node:fs'; import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const L = require('./load.cjs'); const [A, B, D] = process.argv.slice(2);
const a = Object.fromEntries(L(A).map((r) => [r.seed, r.s]));
const HON = { female: ['ferryman', 'headman', 'foreman', 'frontman', 'spokesman', 'abbot', 'lord'], male: ['mother', 'matron', 'madam', 'alewife', 'ale-wife', 'goodwife'] };
const strip = (l) => l.replace(/headman's authority/g, '').replace(/landlord/g, '').replace(/headman's office/g, '');
const word = (t) => String(t).replace(/^the /, '').toLowerCase();
const hon = {}, title = {}, ex = {};
for (const { seed, s } of L(B)) {
  const moved = s.npcs.map((n, i) => [a[seed].npcs[i], n]).filter(([o, n]) => o && o.title !== n.title);
  if (!moved.length) continue; let cur = '';
  for (const l of fs.readFileSync(`${D}/${seed}.txt`, 'utf8').split('\n')) { const m = /^== (.+) ==$/.exec(l); if (m) { cur = m[1]; continue; } const ll = strip(l.toLowerCase());
    for (const [o, n] of moved) { const nm = o.name.toLowerCase(); if (!ll.includes(nm)) continue;
      const h = (HON[n.gender] || []).find((w) => new RegExp(`\\b${w}\\s+${nm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(ll));
      if (h) { (hon[`${n.gender} ${o.title} · "${h}"`] ??= new Set()).add(seed); continue; }
      if (ll.includes(word(o.title))) { (title[cur] ??= new Set()).add(seed); (ex[cur] ??= []).push(`${seed}: ${l.trim().slice(0, 200)}`); } } }
}
const all = (o) => new Set(Object.values(o).flatMap((v) => [...v]));
console.log(`HONORIFIC lines: towns ${all(hon).size}`); for (const [k, v] of Object.entries(hon)) console.log(`  ${v.size}\t${k}`);
console.log(`TITLE lines: towns ${all(title).size}`); for (const [k, v] of Object.entries(title)) { console.log(`  ${v.size}\t${k}`); ex[k].slice(0, 3).forEach((x) => console.log('      ' + x)); }

// NAMES-4 (2026-11-20): the two-form swap mutants. usage: node mutate.mjs <tree> list | node mutate.mjs <tree> apply <id>
import fs from 'node:fs';
const [root, cmd, idArg] = process.argv.slice(2);
const FILES = {
  'src/generators/narrativeText.js': 'call', 'src/data/people/dmPowerLines.js': 'call',
  'src/data/people/goalFamilies.js': 'form', 'src/data/stressInstitutionEffects.js': 'form', 'src/generators/npcGenerator.js': 'has',
};
const sites = [];
for (const [f, kind] of Object.entries(FILES)) {
  const src = fs.readFileSync(`${root}/${f}`, 'utf8');
  if (kind === 'call') {
    for (const m of src.matchAll(/\b(agree|crimAgree|powerVerb)\(/g)) {
      if (src.slice(m.index - 6, m.index) === 'const ' ) continue;
      let i = m.index + m[0].length, d = 1;
      while (d && i < src.length) { const c = src[i]; if (c === '(') d++; else if (c === ')') d--; else if (c === '"' || c === "'" || c === '`') { const q = c; i++; while (src[i] !== q) { if (src[i] === '\\') i++; i++; } } i++; }
      const call = src.slice(m.index, i);
      const lits = [...call.matchAll(/(["'])((?:(?!\1).)*)\1/g)];
      if (lits.length < 2) continue;
      const a = lits.at(-2), b = lits.at(-1);
      if (a[2] === b[2]) continue;
      sites.push({ f, start: m.index, end: i, call, a: a[2], b: b[2], swap: () => call.slice(0, a.index) + a[1] + b[2] + a[1] + call.slice(a.index + a[0].length, b.index) + b[1] + a[2] + b[1] + call.slice(b.index + b[0].length) });
    }
  } else if (kind === 'form') {
    for (const m of src.matchAll(/\{(\w+)\|([^|{}]*)\|([^|{}]*)\}/g)) sites.push({ f, start: m.index, end: m.index + m[0].length, call: m[0], swap: () => `{${m[1]}|${m[3]}|${m[2]}}` });
  } else {
    const all = [...src.matchAll(/powerVerb\(topFaction, 'has', 'have'\)/g)];
    if (all.length) sites.push({ f, multi: all.map((x) => x.index), len: all[0][0].length, call: all[0][0], swapStr: "powerVerb(topFaction, 'have', 'has')" });
  }
}
if (cmd === 'list') { sites.forEach((s, i) => console.log(i, s.f, JSON.stringify(s.call).slice(0, 120))); process.exit(0); }
const s = sites[+idArg];
let src = fs.readFileSync(`${root}/${s.f}`, 'utf8');
if (s.multi) { for (const ix of [...s.multi].reverse()) src = src.slice(0, ix) + s.swapStr + src.slice(ix + s.len); }
else src = src.slice(0, s.start) + s.swap() + src.slice(s.end);
fs.writeFileSync(`${root}/${s.f}`, src);
console.log(s.f);

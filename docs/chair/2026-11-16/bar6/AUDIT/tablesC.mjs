// BAR6-AUDIT-C tables: the counts of the three populations, the commonest distinct lines of each rule, the writers.
//   node tablesC.mjs <name>=<runC-result.json> ... > TABLES-C.md
import fs from 'node:fs';
const pops = process.argv.slice(2).map((a) => { const [k, f] = a.split('='); return [k, JSON.parse(fs.readFileSync(f, 'utf8'))]; });
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const rules = [...new Set(pops.flatMap(([, xs]) => xs.map((x) => x.rule)))].sort();
const P = [];
P.push('# BAR6-AUDIT-C · TABLES (laws 6 and 7)', '', '## Counts by rule (towns · instances · distinct lines)', '');
P.push(`| rule | ${pops.map(([k]) => k).join(' | ')} |`, `|---|${pops.map(() => '---').join('|')}|`);
for (const r of rules) P.push(`| ${r} | ${pops.map(([, xs]) => { const y = xs.filter((x) => x.rule === r); return `${new Set(y.map((x) => x.town)).size} · ${y.length} · ${new Set(y.map((x) => norm(x.line))).size}`; }).join(' | ')} |`);
for (const law of ['L6', 'L7']) P.push(`| **${law}** | ${pops.map(([, xs]) => { const y = xs.filter((x) => x.law === law && !/-w$|^7w/.test(x.rule)); return `${new Set(y.map((x) => x.town)).size} · ${y.length} · ${new Set(y.map((x) => norm(x.line))).size}`; }).join(' | ')} |`);
P.push('', '(WEAK classes, counted apart and not in the law totals: 6a-w, 6b-w, 7w-tone.)', '');
const [name, xs] = pops.find(([k]) => k === '720') || pops[0];
P.push(`## The thirty commonest distinct lines of each rule (${name}), with the towns that print them`, '');
for (const r of rules) {
  const m = new Map();
  for (const x of xs.filter((x) => x.rule === r)) { const k = norm(x.line); const v = m.get(k) || { line: x.line, towns: new Set(), writer: x.writer, n: 0 }; v.towns.add(x.town); v.n++; m.set(k, v); }
  if (!m.size) continue;
  P.push(`### ${r} (${m.size} distinct)`, '', '| towns | line | writer | e.g. |', '|---|---|---|---|');
  for (const v of [...m.values()].sort((a, b) => b.towns.size - a.towns.size).slice(0, 30)) P.push(`| ${v.towns.size} | ${v.line.slice(0, 150).replace(/\|/g, '/')} | ${v.writer || ''} | ${[...v.towns][0]} |`);
  P.push('');
}
P.push(`## By writer file (${name}): instances and distinct lines, by rule`, '', '| writer | rule | instances | distinct |', '|---|---|---|---|');
const w = new Map();
for (const x of xs) { const k = `${x.writer || '(untraced)'}|${x.rule}`; const v = w.get(k) || { n: 0, l: new Set() }; v.n++; v.l.add(norm(x.line)); w.set(k, v); }
for (const [k, v] of [...w].sort((a, b) => b[1].n - a[1].n)) { const [f, r] = k.split('|'); P.push(`| ${f} | ${r} | ${v.n} | ${v.l.size} |`); }
process.stdout.write(P.join('\n') + '\n');

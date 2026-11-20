// BAR7-AUDIT-I tables · the sub-buckets of runI's output: node docs/chair/2026-11-17/bar7/AUDIT/tablesI.mjs <out.json> [label]
// Prints, per rule, the distinct lines with their towns (counted first, then apart), and the sub-buckets the hand-back
// quotes: "a generation old" by the event's age; the doubled list items by kind; the design point's towns by case; 9i by
// whether rival rings stand; 6e by word; 10i by kinds. Reads one file; writes nothing.
import fs from 'node:fs';
const [file, label = ''] = process.argv.slice(2);
if (!file) { console.error('usage: tablesI.mjs <out.json> [label]'); process.exit(2); }
const all = JSON.parse(fs.readFileSync(file, 'utf8'));
const group = (xs, k) => { const m = new Map(); for (const x of xs) { const v = typeof k === 'function' ? k(x) : x[k]; (m.get(v) || m.set(v, []).get(v)).push(x); } return m; };
const towns = (xs) => new Set(xs.map((x) => x.town)).size;
console.log(`== BAR7-AUDIT-I tables ${label} (${file})`);
for (const [rule, xs] of [...group(all, 'rule')].sort()) {
  const c = xs.filter((x) => x.status !== 'apart');
  console.log(`\n# ${rule}: counted ${c.length} in ${towns(c)} towns · apart ${xs.length - c.length} in ${towns(xs.filter((x) => x.status === 'apart'))}`);
  for (const [form, ys] of [...group(xs, 'form')].sort((a, b) => b[1].length - a[1].length).slice(0, 8)) {
    console.log(`  ${String(ys.length).padStart(3)} ${ys[0].status === 'apart' ? '(apart) ' : ''}${String(form).slice(0, 130)}`);
  }
}
const sub = (rule, key, name) => { const xs = all.filter((x) => x.rule === rule); if (!xs.length) return; console.log(`\n## ${rule} by ${name}`); for (const [k, ys] of [...group(xs, key)].sort((a, b) => b[1].length - a[1].length)) console.log(`  ${String(ys.length).padStart(4)} in ${String(towns(ys)).padStart(3)} towns · ${k}`); };
sub('low.generation', (x) => (x.age >= 55 ? '55-60 years' : x.age >= 50 ? '50-54 years' : '40-49 years'), 'age');
sub('low.doubled', (x) => `${x.kind} · ${/^Needed/.test(x.against.line) ? 'Needed' : x.against.line.split(':')[0]}`, 'kind and list');
sub('design.outside', 'case', 'case');
sub('9i.crews', (x) => (x.rings ? 'rival rings stand' : 'no rival rings: the key is a lone house\'s') + ` · ${x.cause}`, 'rings');
for (const r of ['6e.crown', '6e.no-higher', '6e.war-apart']) sub(r, 'word', 'word');
sub('10i.pair', 'kinds', 'kinds');
sub('10i.pair-respect', 'kinds', 'kinds');
sub('5x.slash', 'label', 'label');

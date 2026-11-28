// BAR7-AUDIT-I · THE STATIC HALF: every line of the annex desks (`src/data/dossierStateProse/*.generated.js`) a rule of this
// seat reads, with the band it declares and the denying states that band admits; every source line that names a crown,
// a king, a realm or a royal thing, with or without the `sovereign` atom; every house or power label with a slash.
//   node docs/chair/2026-11-17/bar7/AUDIT/staticI.mjs <out.json>        (run from the tree root; reads src/, writes nothing else)
// Prints the tables; writes every row to <out.json>. Pure reading; no draw, no birth.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const out = process.argv[2];
if (!out) { console.error('usage: staticI.mjs <out.json>'); process.exit(2); }
const dir = path.join(root, 'src/data/dossierStateProse');
const variants = [];
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.generated.js')).sort()) {
  const m = await import(path.join(dir, f));
  for (const corp of Object.values(m)) {
    if (!corp || typeof corp !== 'object') continue;
    for (const [block, b] of Object.entries(corp)) for (const [pool, vs] of Object.entries(b?.pools || {})) for (const v of vs || []) {
      if (typeof v?.text === 'string') variants.push({ desk: f.replace('.generated.js', ''), block, pool, vid: v.vid, marks: v.marks || [], text: v.text });
    }
  }
}
const has = (v, re) => v.marks.some((m) => re.test(m));
const rows = [];
const say = (rule, v, admits, why) => rows.push({ rule, desk: v.desk, block: v.block, pool: v.pool, vid: v.vid, marks: v.marks, text: v.text, admits, why });

// 9g · plenty, margin and level words. Each class names the states that deny it and the marks (or the pool's own key)
// that would shut them out. A line is COUNTED where its declaration admits at least one denying state.
const NEG = /\b(little to spare|nothing to spare|no reserve|never kept reserves|nothing left over|little left over for|too poor|so little to spare|no margin|has no reserve|before the hunger|until the hunger came|no longer)\b/i;
const CLASSES = [
  { kind: 'subsistence', re: /\bpast subsistence\b/i, deny: [{ state: 'economy label Subsistence (the economy desk\'s own complexity rung)', shut: (v) => /SUBSIST|complexity/i.test(v.pool) || has(v, /complexity|prosperity: ≥/) }] },
  { kind: 'stores', re: /\b(stores are more than the season needs|reach past the turn of the year with room to spare|stores go into \{season\} deep|its stores are deep|reserves deep enough|food stored)\b/i,
    deny: [{ state: 'stores under three months (no granary, household stores)', shut: (v) => has(v, /^stores: (≥|>=) ?[3-9]/) || has(v, /^institution: granary$/) }] },
  { kind: 'food', re: /\b(more than enough to get through a hard year|keeps itself supplied|eats well|grows more food than it eats|With food to spare|nobody looks hungry|nobody goes hungry|Plenty passes here|room to spare)\b/i,
    deny: [{ state: 'food word Pressured or lower, or a food gap', shut: (v) => has(v, /^food: (≥|>) ?(secure|surplus)$/) || has(v, /^no hunger$/) || has(v, /^food surplus$/) || /FOOD: surplus|Surplus|well stocked/.test(v.pool) },
      { state: 'a siege or a famine', shut: (v) => has(v, /^no crisis: .*(under_siege|famine|hunger)/) || has(v, /^no hunger$/) || has(v, /^no crisis$/) }] },
  { kind: 'money', re: /\b(closes every year ahead|reserves behind it|money to spare|little left over each year|has a little in hand|ends each year with|surplus at \{settlement\} is real|holds something in reserve)\b/i,
    deny: [{ state: 'a war (the war takes most of the money; the seat cannot afford its requisition)', shut: (v) => has(v, /^no crisis: .*(wartime|war\b)/) || has(v, /^no crisis$/) || has(v, /^crisis: (?!any)/) },
      { state: 'a debt', shut: (v) => has(v, /^no crisis: .*(indebted|debt)/) || has(v, /^no crisis$/) || has(v, /^crisis: (?!any)/) },
      { state: 'a siege or an occupation', shut: (v) => has(v, /^no crisis: .*(under_siege|occupied|threat)/) || has(v, /^no crisis$/) || has(v, /^crisis: (?!any)/) }] },
];
for (const v of variants) {
  if (NEG.test(v.text)) continue;
  for (const c of CLASSES) {
    if (!c.re.test(v.text)) continue;
    const admits = c.deny.filter((d) => !d.shut(v)).map((d) => d.state);
    say(`9g.${c.kind}`, v, admits, admits.length ? `declares ${JSON.stringify(v.marks)}; admits ${admits.join('; ')}` : 'shut');
    break;
  }
}
// 9i · crime's turf-war lines: denied by a Safe word and by an occupation's curfew
for (const v of variants) {
  if (!/\b(fighting over who runs the streets|brawling|gangs are at war|open war between the gangs)\b/i.test(v.text)) continue;
  const admits = [];
  if (!has(v, /^safety|^no safe|^crime wave|^no crisis: .*occupied|^crime: /)) admits.push('Safety Safe or Very Safe ("walk anywhere at any hour")');
  if (!has(v, /^no crisis: .*(occupied|threat)|^no crisis$/)) admits.push('an occupation\'s curfew ("Thieves are scarce now")');
  say('9i.crews', v, admits, `declares ${JSON.stringify(v.marks)}`);
}
// 9a · order kept: denied by Law & order Collapsed
for (const v of variants) {
  if (!/\b(?:garrison|watch|militia|guard|guards|soldiers|army)\b[^.]*\bkeeps? (?:order|the peace)\b|\border holds\b/i.test(v.text) || /\b(nobody|no one|once kept|cannot|could|no longer|struggling|gone to)\b/i.test(v.text)) continue;
  const admits = has(v, /^law|^no collapse|^order/) ? [] : ['Law & order · Collapsed'];
  say('9a.order', v, admits, `declares ${JSON.stringify(v.marks)}`);
}
// 7x · the town's own seat ruling freely: denied by an occupation
const FREE = /\b(one audience with the \{seat\} gets a decision|the answer comes quickly|can plan a season ahead on its word|knows who decides, and nobody expects that to change|Every decision about \{settlement\} is taken by|what it decides carries in most quarters|make an unpopular decision and still be obeyed|there is nobody else to be sent to|decides things the way a business does|what the hall decides is decided by that combination|Soldiers carry out the \{seat\}'s orders|rules by its faith: every decision)\b/;
for (const v of variants.filter((v) => /^(power|general|economy)$/.test(v.desk))) {
  if (!FREE.test(v.text) || has(v, /^dm-only$/)) continue;
  const shut = has(v, /^no crisis: .*(occupied|threat)|^no crisis$|^crisis: calm$/);
  say('7x.occupied-seat', v, shut ? [] : ['an occupation ("nothing it decides stands without the occupiers\' approval")'], `declares ${JSON.stringify(v.marks)}`);
}
// 6e · the crown in a line: every source line naming a crown, a king, a realm or a royal thing, and whether its row declares `sovereign`
// "realm" is the world map's own word for the world (the Herald, the realm view) and is left out; only the surfaces a TOWN page
// prints are walked: the pools (src/data), the generators and the town page's display leaves (src/domain/display).
const CROWN = /\b(crown|royal|king's|kings?\b|queen)\b/i;
const SKIP = /\b(crown (?:jewel|glass)|crowning|crowned|Crown of|treetop|tree crowns?)\b/i;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : /\.(js|jsx)$/.test(e.name) ? [path.join(d, e.name)] : []));
const crownRows = [];
for (const f of ['src/data', 'src/generators', 'src/domain/display'].flatMap((d) => walk(path.join(root, d)))) {
  if (/\.test\.|__tests__|\/map\/|herald|realm/i.test(f)) continue;
  const L = fs.readFileSync(f, 'utf8').split('\n');
  L.forEach((l, i) => {
    const t = l.trim();
    if (/^(\/\/|\*|\/\*)/.test(t)) return; // a comment is not a line the page prints
    const lits = [...t.matchAll(/(["'`])((?:\\.|(?!\1).)*)\1/g)].map((m) => m[2]).filter((s) => s.split(' ').length >= 3 && CROWN.test(s) && !SKIP.test(s));
    if (!lits.length) return;
    const ctx = L.slice(Math.max(0, i - 3), i + 4).join(' ');
    const declared = /sovereign/.test(ctx);
    for (const s of lits) crownRows.push({ rule: '6e.crown', file: path.relative(root, f), line: i + 1, text: s.slice(0, 160), declared });
  });
}
// 5x · slash labels a sentence can take (houses' and powers' roster names as authored)
const slashRows = [];
for (const f of walk(path.join(root, 'src/data')).concat(walk(path.join(root, 'src/generators')))) {
  if (/\.test\.|generated/.test(f)) continue;
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/\b(?:name|faction|label)\s*:\s*(["'])([A-Z][A-Za-z' ]*\/[A-Za-z' ]+)\1/g)) slashRows.push({ rule: '5x.label', file: path.relative(root, f), label: m[2] });
}
const slashUniq = [...new Map(slashRows.map((r) => [r.label, r])).values()];
const slotLines = variants.filter((v) => /\{(institution|faction|house|power)\}/.test(v.text));

fs.writeFileSync(out, JSON.stringify({ desk: rows, crown: crownRows, slash: slashUniq, slotLines: slotLines.length }, null, 1));
const by = new Map();
for (const r of rows) { const b = by.get(r.rule) || { n: 0, admits: 0 }; b.n++; if (r.admits.length) b.admits++; by.set(r.rule, b); }
console.log(`BAR7-AUDIT-I · the static half over ${variants.length} desk variants`);
console.log('rule              lines  declaring a band that admits a denying state');
for (const [k, b] of [...by].sort()) console.log(`${k.padEnd(17)} ${String(b.n).padStart(5)}  ${b.admits}`);
for (const r of rows.filter((r) => r.admits.length)) console.log(`  ${r.rule.padEnd(15)} ${r.desk}/${r.block} · ${r.pool.slice(0, 34)} · v${r.vid} · ${JSON.stringify(r.marks)} · admits: ${r.admits.join('; ')}\n      "${r.text.slice(0, 120)}"`);
const crownFiles = new Map(); for (const r of crownRows) crownFiles.set(r.file, (crownFiles.get(r.file) || 0) + 1);
console.log(`6e · source lines naming a crown, a king, a realm or a royal thing: ${crownRows.length} in ${crownFiles.size} files; declaring sovereign within their row: ${crownRows.filter((r) => r.declared).length}; not: ${crownRows.filter((r) => !r.declared).length}`);
for (const [f, n] of [...crownFiles].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${f}  (undeclared ${crownRows.filter((r) => r.file === f && !r.declared).length})`);
console.log(`5x · slash labels authored: ${slashUniq.length}: ${slashUniq.map((r) => `${r.label} (${r.file.replace(/^src\//, '')})`).join('; ')}`);
console.log(`5x · desk lines with a house or power slot ({institution} {faction} {house} {power}): ${slotLines.length}`);

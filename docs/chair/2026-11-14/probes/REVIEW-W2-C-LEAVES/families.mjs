// REVIEW-W2-C-LEAVES families.mjs <linediff.jsonl> <outdir> : the new lines (tip, not base) grouped into families by
// surface/view and section, a family being the line with the town's name, numbers and goods lists folded out.
// Writes <outdir>/<group>.jsonl (rows {fam, seed, view, sec, line}) and prints the family counts.
import fs from 'node:fs';
const [inf, od] = process.argv.slice(2); fs.mkdirSync(od, { recursive: true });
const rows = fs.readFileSync(inf, 'utf8').trim().split('\n').map(JSON.parse).filter((r) => r.kind === 'new');
const names = new Map();
const nameOf = (seed) => { if (!names.has(seed)) { try { names.set(seed, JSON.parse(fs.readFileSync(`/tmp/claude-0/rw2c/run/tip/records/${seed}.json`, 'utf8')).name || ''); } catch { names.set(seed, ''); } } return names.get(seed); };
function fam(r) {
  let l = r.line; const n = nameOf(r.seed); if (n) l = l.split(n).join('{N}');
  l = l.replace(/\d[\d,.]*/g, '#');
  let m;
  if ((m = l.match(/^(.*?) here (depend on|run on stored) (.*?)( brought in by magic| brought in| from outside)?(,|:|\.)(.*)$/))) return `NEED: {services} here ${m[2]} {goods}${m[4] || ''}${m[5]}${m[6]}`;
  if (/^Needed, and not brought in:/.test(l)) return 'NEEDS: Needed, and not brought in: {goods}.';
  if (/grows .* of what it eats|What is grown here|No food comes into|provision makes up|than it eats/.test(l)) return 'FOOD: ' + l.replace(/(grows|makes up) (less than a fifth|about [a-z ]+?|nearly all)( of)/g, '$1 {share}$3').replace(/in (a little of the rest|about [a-z ]+? of the rest|about half the rest|[a-z ]+ of the rest|nearly all the rest)/, 'in {share of rest}');
  if (/^Production: /.test(l)) return 'FOODROW: ' + l.replace(/#/g, '#');
  if (r.sec === 'Trade Profile') return 'TRADE-PILLS: ' + (l.length > 60 ? '{pills}' : l);
  return `${r.sec || '(no section)'}: ${l.length > 220 ? l.slice(0, 220) + '…' : l}`;
}
const groups = {};
for (const r of rows) {
  const v = r.view.split('/').pop(); const g = r.view === 'PDF' ? 'pdf' : r.view === 'journal' ? 'journal' : v === 'Economics' ? (r.sec === 'Economic Flows' ? 'econ-flows' : 'econ-trade-food') : v === 'Resources' ? 'resources' : ['Defense', 'Magic'].includes(v) ? 'defense-magic' : 'other-' + v;
  (groups[g] = groups[g] || []).push({ fam: fam(r), seed: r.seed, view: r.view, sec: r.sec, line: r.line });
}
for (const [g, rs] of Object.entries(groups)) {
  fs.writeFileSync(`${od}/${g}.jsonl`, rs.map((x) => JSON.stringify(x)).join('\n') + '\n');
  const c = new Map(); for (const x of rs) c.set(x.fam, (c.get(x.fam) || new Set()).add(x.seed));
  console.log(`${g}: ${rs.length} lines, ${c.size} families, ${new Set(rs.map((x) => x.seed)).size} towns`);
}

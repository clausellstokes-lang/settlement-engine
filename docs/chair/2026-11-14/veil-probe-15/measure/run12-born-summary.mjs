// VEIL-15, ITEM 1, BORN, COUNTED: reads two outputs of veil-probe-12/r2-born.probe.jsx (the same instrument, run once on
// the base's archive and once on this tree, each on a local chain built from its own migrations) and prints, of the
// impressions on the guard's born towns (both stored shapes), how many each read withholds, by veil (the default; every
// appearance eye shut) and Reveal DM (off; on), base -> after, for the gallery read, the party link, the import and the
// twin; the people on whom the four reads disagree; and every impression withheld after with the appearance shut, with
// the run of twelve it shares with its own appearance (the ruling's literal form, by the tree's caseFold), five printed.
//   node run12-born-summary.mjs <base.json> <after.json> <tree>
import { readFileSync } from 'node:fs';
const [baseFile, afterFile, tree] = process.argv.slice(2);
const { caseFold } = await import(`${tree}/src/domain/display/gallerySecondHomes.js`);
const RUN = 12;
const strings = (v, o = []) => { if (typeof v === 'string') o.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, o)); else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, o)); return o; };
const runOf = (a, b) => {
  for (const x of strings(a)) for (const y of strings(b)) {
    const [s, l] = [caseFold(x), caseFold(y)].sort((p, q) => Array.from(p).length - Array.from(q).length);
    const cs = Array.from(s);
    for (let i = 0; i + RUN <= cs.length; i += 1) { const w = cs.slice(i, i + RUN).join(''); if (l.includes(w)) return w; }
  }
  return null;
};
const load = (f) => JSON.parse(readFileSync(f, 'utf8'));
const B = load(baseFile); const A = load(afterFile);
const READS = ['gallery', 'link', 'import', 'client'];
const who = (r) => `${r.town}|${r.shape}|${r.id ?? r.name}`;
const cell = (rows, veil, dm, read) => rows.filter((r) => r.veil === veil && r.dm === dm && r.read === read);
const out = [];
const people = new Set(A.filter((r) => r.read === 'gallery' && r.veil === 'default' && r.dm === false).map(who)).size;
out.push(`impressions on the born towns (both shapes): ${people}; rows base ${B.length}, after ${A.length}`);
for (const [veil, label] of [['default', 'the default veil'], ['appearance', "every person's appearance eye shut"]]) {
  for (const dm of [false, true]) {
    const parts = READS.map((rd) => `${cell(B, veil, dm, rd).filter((r) => r.withheld).length} -> ${cell(A, veil, dm, rd).filter((r) => r.withheld).length}`);
    out.push(`  ${`${label}, Reveal DM ${dm ? 'on' : 'off'}:`.padEnd(52)} ${parts.join(' | ')}   (of ${cell(A, veil, dm, 'gallery').length}; gallery | link | import | twin)`);
  }
}
for (const [name, rows] of [['base', B], ['after', A]]) {
  const sentShut = rows.filter((r) => r.veil === 'appearance' && r.appearanceSent).length;
  const absent = rows.filter((r) => !r.present).length;
  const disagree = new Set();
  const by = new Map();
  for (const r of rows) { const k = `${who(r)}|${r.veil}|${r.dm}`; if (!by.has(k)) by.set(k, new Set()); by.get(k).add(r.withheld); }
  for (const [k, s] of by) if (s.size > 1) disagree.add(k);
  out.push(`  ${name}: the appearance sent with its eye shut ${sentShut} reads; a person absent ${absent} reads; people on whom the four reads disagree ${disagree.size}`);
}
const chance = new Map();
for (const r of A.filter((x) => x.veil === 'appearance' && x.withheld)) if (!chance.has(who(r))) chance.set(who(r), r);
out.push(`withheld after with every appearance eye shut (each a chance run of twelve, by the literal form): ${chance.size} impressions`);
const persons = new Set([...chance.values()].map((r) => `${r.town}|${r.id ?? r.name}`));
out.push(`  (${persons.size} persons, each in ${chance.size / Math.max(persons.size, 1)} shapes); base: ${new Set(B.filter((x) => x.veil === 'appearance' && x.withheld).map(who)).size} withheld`);
let shown = 0;
for (const r of chance.values()) {
  const run = runOf(r.physical, r.impression);
  if (shown < 5) out.push(`  ${r.town} ${r.shape} ${r.name}: run ${JSON.stringify(run)} | appearance ${JSON.stringify(r.physical)} | impression ${JSON.stringify(r.impression)}`);
  shown += 1;
  if (run === null) out.push('  ^ NO RUN BY THE LITERAL FORM: a withholding the ruling does not account for');
}
const missed = A.filter((x) => x.veil === 'appearance' && !x.withheld && x.read === 'gallery' && runOf(x.physical, x.impression) !== null);
out.push(`  sent after with the appearance shut although a run of twelve is shared (the literal form): ${missed.length}`);
console.log(out.join('\n'));

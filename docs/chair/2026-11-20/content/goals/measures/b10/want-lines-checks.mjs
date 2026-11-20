// GOALS-4 builder 10 (2026-11-20), a scratch tool kept as the receipt of its output beside it.
// The two checks on the lines, at the BUILD tree (builder 9's want-lines-check.mjs and want-lines-reserve.mjs, adapted to
// read WANT-LINES-FINAL.md's approved wording and a tree where the 380 already stand in their cells).
// usage: node checks.mjs <buildTree> <baseTree> <lines380.json>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [, , L, B, J] = process.argv;
const imp = (t, p) => import(pathToFileURL(path.join(t, p)).href);
const GF = await imp(L, 'src/data/people/goalFamilies.js');
const GB = await imp(B, 'src/data/people/goalFamilies.js');
const { assertDeclarable } = await imp(L, 'src/domain/facts/factVocabulary.js');
const src = fs.readFileSync(path.join(L, 'tests/data/goalFamilies.test.js'), 'utf8');
const a = src.indexOf('const STRUCK_TICS'); const b = src.indexOf('\n}\n', src.indexOf('function shapeViolations')) + 3;
const lifted = src.slice(a, b);
const shapeViolations = new Function('GOAL_SLOTS', 'GOAL_SLOTS_STRUCK', 'GOAL_SUBKIND_SLOTS', 'assertDeclarable', `${lifted}\nreturn shapeViolations;`)(GF.GOAL_SLOTS, GF.GOAL_SLOTS_STRUCK, GF.GOAL_SUBKIND_SLOTS, assertDeclarable);
const cells = JSON.parse(fs.readFileSync(J, 'utf8'));
const text = (l) => (typeof l === 'string' ? l : l.line);
const out = [];
// (1) THE SHAPE CHECK: the lifted checker over every cell of the build (the 380 in place) then that cell's reserve
const table = {};
for (const [fam, subs] of Object.entries(GF.GOAL_FAMILY_LINES)) { table[fam] = {}; for (const [sub, vs] of Object.entries(subs)) { table[fam][sub] = {};
  for (const [v, lines] of Object.entries(vs)) table[fam][sub][v] = [...lines, ...(GF.GOAL_RESERVE_LINES?.[fam]?.[sub]?.[v] || [])]; } }
for (const [fam, subs] of Object.entries(GF.GOAL_RESERVE_LINES)) for (const [sub, vs] of Object.entries(subs)) for (const v of Object.keys(vs)) if (!table[fam]?.[sub]?.[v]) out.push(`reserve cell with no drawn cell: ${fam}.${sub}.${v}`);
const viol = shapeViolations(table);
out.push(`lifted checker: ${path.join(L, 'tests/data/goalFamilies.test.js')}, ${lifted.split('\n').length} lines`);
out.push(`shapeViolations over the build's cells (the 380 in place) + reserve: ${viol.length}`); for (const x of viol) out.push('  ' + x);
const slots = (t) => [...String(t).matchAll(/\{([^}|]*)(?:\|[^}]*)?\}/g)].map((m) => m[1]);
let slotWarn = 0, placed = 0;
for (const c of cells) {
  const have = new Set(GB.GOAL_FAMILY_LINES[c.family][c.sub][c.vantage].flatMap((l) => slots(text(l))));
  const now = GF.GOAL_FAMILY_LINES[c.family][c.sub][c.vantage].map(text);
  if (JSON.stringify(now.slice(c.from)) === JSON.stringify(c.lines.map((l) => l.line)) && now.length === c.to) placed += c.lines.length;
  for (const l of c.lines) for (const s of slots(l.line)) if (!have.has(s)) { slotWarn++; out.push(`  slot {${s}} not used by the base cell's own lines — ${c.family}/${c.sub}/${c.vantage}: ${l.line}`); }
}
out.push(`the 380 at their cells' ends, verbatim: ${placed}`);
out.push(`new-line slots outside the base cell's own slot set: ${slotWarn}`);
const plant = (line) => { const t = JSON.parse(JSON.stringify(table)); t.RANK.enter.short.push(line); return shapeViolations(t).length > viol.length; };
out.push(`controls: a planted bad slot reds it ${plant('Win {rival} over this season.')}; a planted tic reds it ${plant('Do the work rather than talk about it this season.')}; a planted duplicate of a new line reds it ${plant(cells[0].lines[0].line)}`);
// (2) THE RESERVE CHECK: every new PERSONALITY drawn line against its cluster's GOAL_RESERVE_LINES.PERSONALITY lines
const STOP = new Set('a an the and or of to in on at for with by from as is be been being their them they this that these those every any one some no not never all who what when where which so if it its than then there here more most only own other others someone anyone everyone season'.split(' '));
const words = (s) => new Set(String(s).toLowerCase().match(/[a-z']+/g).filter((w) => !STOP.has(w) && w.length > 2).map((w) => w.replace(/(ing|ed|es|s)$/, '')));
const share = (x, y) => { const A = words(x), Bw = words(y); const i = [...A].filter((w) => Bw.has(w)).length; return i / Math.max(1, Math.min(A.size, Bw.size)); };
let n = 0, flagged = 0, dups = 0, pairs = 0;
out.push('\n== THE RESERVE CHECK: each new PERSONALITY drawn line beside its cluster\'s reserve (both vantages; \'=\' its own) ==');
for (const c of cells.filter((x) => x.family === 'PERSONALITY')) for (const l of c.lines) {
  n++; out.push(`PERSONALITY/${c.sub}/${c.vantage} #${l.n}: ${l.line}`);
  for (const w of ['short', 'long']) for (const r of (GF.GOAL_RESERVE_LINES.PERSONALITY?.[c.sub]?.[w] || []).map(text)) {
    pairs++; const s = share(l.line, r); if (s >= 0.5) flagged++; if (r.trim().toLowerCase() === l.line.trim().toLowerCase()) dups++;
    out.push(`  reserve ${w === c.vantage ? '=' : ' '}${w.padEnd(5)} ${s.toFixed(2)}${s >= 0.5 ? ' !' : '  '} ${r}`);
  }
}
out.push(`\n${n} new PERSONALITY lines; ${pairs} pairs against the reserve; duplicates ${dups}; pairs with a word share >= 0.50: ${flagged}`);
console.log(out.join('\n'));
process.exitCode = viol.length || slotWarn || dups || flagged || placed !== 380 ? 1 : 0;

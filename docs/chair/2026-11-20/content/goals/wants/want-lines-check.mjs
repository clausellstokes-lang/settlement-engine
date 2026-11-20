// GOALS-3 builder 9 (scratch check, docs only): THE SHAPE LAW OVER THE NEW LINES. Lifts `shapeViolations` (and the
// constants it reads) VERBATIM out of <tree>/tests/data/goalFamilies.test.js (from `const STRUCK_TICS` to the end of the
// function: the test file's own text, not a copy kept here), and runs it over a SCRATCH table: every cell of
// GOAL_FAMILY_LINES, then that cell's GOAL_RESERVE_LINES, then the new lines of the given WANT-LINES files appended (so a
// new line that repeats any cell or reserve line, in any case, is a `duplicate:`). Also: the counts per cell, each new
// line's slots against its cell's existing slot set, and the anchored negatives (a planted bad slot and a planted tic must
// each red the lifted checker, as the test's controls do).
// Usage: node want-lines-check.mjs <tree> <WANT-LINES-n.md>...
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [, , L, ...FILES] = process.argv;
const imp = (p) => import(pathToFileURL(path.join(L, p)).href);
const GF = await imp('src/data/people/goalFamilies.js');
const { assertDeclarable } = await imp('src/domain/facts/factVocabulary.js');
const src = fs.readFileSync(path.join(L, 'tests/data/goalFamilies.test.js'), 'utf8');
const a = src.indexOf('const STRUCK_TICS'); const b = src.indexOf('\n}\n', src.indexOf('function shapeViolations')) + 3;
if (a < 0 || b < 3) throw new Error('shapeViolations not found in the test file');
const lifted = src.slice(a, b);
const { GOAL_SLOTS, GOAL_SLOTS_STRUCK, GOAL_SUBKIND_SLOTS } = GF;
// eslint-disable-next-line no-new-func
const shapeViolations = new Function('GOAL_SLOTS', 'GOAL_SLOTS_STRUCK', 'GOAL_SUBKIND_SLOTS', 'assertDeclarable', `${lifted}\nreturn shapeViolations;`)(GOAL_SLOTS, GOAL_SLOTS_STRUCK, GOAL_SUBKIND_SLOTS, assertDeclarable);
// the new lines, by cell
const NEW = {}; const QUOTED = {}; let total = 0;
for (const f of FILES) { let cell = null, on = false;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const h = /^### \d+ · (\w+)\/(\w+)\/(short|long) /.exec(line); if (h) { cell = h.slice(1, 4).join('/'); on = false; continue; }
    if (/^New:\s*$/.test(line)) { on = true; continue; }
    const m = /^\d+\. (.+)$/.exec(line); if (cell && on && m) { (NEW[cell] ||= []).push(m[1].trim()); total++; }
    const q = /^- (.+)$/.exec(line); if (cell && !on && q) (QUOTED[`${path.basename(f)} ${cell}`] ||= []).push(q[1].trim()); } }
// the scratch table: cells, then reserve, then the new lines
const table = {};
for (const [fam, subs] of Object.entries(GF.GOAL_FAMILY_LINES)) { table[fam] = {}; for (const [sub, vs] of Object.entries(subs)) { table[fam][sub] = {};
  for (const [v, lines] of Object.entries(vs)) table[fam][sub][v] = [...lines, ...(GF.GOAL_RESERVE_LINES?.[fam]?.[sub]?.[v] || []), ...(NEW[`${fam}/${sub}/${v}`] || [])]; } }
for (const c of Object.keys(NEW)) { const [f, k, v] = c.split('/'); if (!GF.GOAL_FAMILY_LINES[f]?.[k]?.[v]) throw new Error(`no such cell: ${c}`); }
const out = [];
const viol = shapeViolations(table);
out.push(`tree ${L}; files ${FILES.join(', ')}; new lines ${total} in ${Object.keys(NEW).length} cells`);
out.push(`lifted checker: tests/data/goalFamilies.test.js, ${lifted.split('\n').length} lines (const STRUCK_TICS … function shapeViolations)`);
out.push(`shapeViolations over cells + reserve + new lines: ${viol.length}`); for (const x of viol) out.push('  ' + x);
// each new line's slots: a subset of the slots its cell's own lines use (no slot the cell's family does not fill)
const slots = (t) => [...String(t).matchAll(/\{([^}|]*)(?:\|[^}]*)?\}/g)].map((m) => m[1]);
let slotWarn = 0;
for (const [c, lines] of Object.entries(NEW)) { const [f, k, v] = c.split('/'); const have = new Set((GF.GOAL_FAMILY_LINES[f][k][v]).flatMap((l) => slots(typeof l === 'string' ? l : l.line)));
  const now = GF.GOAL_FAMILY_LINES[f][k][v].length;
  out.push(`  ${c}: ${now} → ${now + lines.length} (+${lines.length})`);
  for (const l of lines) for (const s of slots(l)) if (!have.has(s)) { slotWarn++; out.push(`    slot {${s}} not used by the cell's own lines — ${l}`); } }
out.push(`new-line slots outside the cell's own slot set: ${slotWarn}`);
// the layout's TWO existing lines per cell: each must stand verbatim among its cell's drawn lines
let misquoted = 0;
for (const [fc, q] of Object.entries(QUOTED)) { const c = fc.split(' ')[1]; const [f, k, v] = c.split('/'); const cellText = GF.GOAL_FAMILY_LINES[f][k][v].map((l) => (typeof l === 'string' ? l : l.line));
  for (const l of q) if (!cellText.includes(l)) { misquoted++; out.push(`  not verbatim in ${c}: ${l}`); }
  if (q.length !== 2) out.push(`  ${fc} quotes ${q.length} existing lines, not two`); }
out.push(`existing lines quoted: ${Object.values(QUOTED).flat().length}, not verbatim: ${misquoted}`);
// the anchored negatives (the test's controls): each plant must red the lifted checker
const plant = (line) => { const t = JSON.parse(JSON.stringify(table)); t.RANK.enter.short.push(line); return shapeViolations(t).length > viol.length; };
out.push(`controls: a planted bad slot reds it ${plant('Win {rival} over this season.')}; a planted tic reds it ${plant('Do the work rather than talk about it this season.')}`);
console.log(out.join('\n'));
process.exitCode = viol.length || slotWarn || misquoted ? 1 : 0;

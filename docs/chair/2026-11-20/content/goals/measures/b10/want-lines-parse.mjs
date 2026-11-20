// GOALS-4 builder 10 (2026-11-20), a scratch tool kept as the receipt of its output beside it.
// usage: node parse.mjs <tree> <WANT-LINES-FINAL.md> [json-out]
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const [tree, md, out] = process.argv.slice(2);
const { GOAL_FAMILY_LINES, GOAL_RESERVE_LINES } = await import(pathToFileURL(`${tree}/src/data/people/goalFamilies.js`).href);
const text = readFileSync(md, 'utf8');
const cells = []; let cur = null; const odd = [];
for (const raw of text.split('\n')) {
  const h = raw.match(/^### ([A-Z]+)\/([a-z_]+)\/(short|long) · (\d+) → (\d+) \(\+(\d+)\)$/);
  if (h) { cur = { family: h[1], sub: h[2], vantage: h[3], from: +h[4], to: +h[5], plus: +h[6], lines: [] }; cells.push(cur); continue; }
  if (raw.startsWith('#')) { if (cur) cur = null; continue; }
  const m = raw.match(/^(\d+)\. (.*)  <sub>([0-9]+:[0-9.]+)<\/sub>$/);
  if (m) { if (!cur) { odd.push(raw); continue; } cur.lines.push({ n: +m[1], line: m[2], src: m[3] }); continue; }
  if (cur && /^\d+\./.test(raw)) odd.push(raw);
}
const textOf = (e) => (typeof e === 'string' ? e : e.line);
let total = 0; const problems = [];
const famPlus = {};
for (const c of cells) {
  const live = GOAL_FAMILY_LINES[c.family]?.[c.sub]?.[c.vantage];
  const liveN = live ? live.length : -1;
  total += c.lines.length;
  famPlus[c.family] = (famPlus[c.family] || 0) + c.lines.length;
  if (c.lines.length !== c.plus || c.from + c.plus !== c.to) problems.push(`header ${c.family}/${c.sub}/${c.vantage}: ${c.lines.length} lines vs +${c.plus}`);
  c.lines.forEach((l, i) => { if (l.n !== c.from + 1 + i) problems.push(`numbering ${c.family}/${c.sub}/${c.vantage} #${l.n}`); });
  const liveTexts = (live || []).map(textOf);
  const already = c.lines.filter((l) => liveTexts.includes(l.line)).length;
  console.log(`${c.family}/${c.sub}/${c.vantage}: header ${c.from}→${c.to} live ${liveN} lines ${c.lines.length} alreadyInCell ${already} ${liveN === c.from ? 'BEFORE' : liveN === c.to ? 'AFTER' : 'MISMATCH'}`);
  const strange = c.lines.filter((l) => /[\\`*_<>]/.test(l.line.replace(/\{[^}]*\}/g, '')));
  for (const s of strange) problems.push(`markdown char? ${s.line}`);
}
console.log('cells', cells.length, 'lines', total, 'byFamily', JSON.stringify(famPlus));
console.log('odd', odd.length, odd);
console.log('problems', problems.length, problems);
if (out) writeFileSync(out, JSON.stringify(cells, null, 1));

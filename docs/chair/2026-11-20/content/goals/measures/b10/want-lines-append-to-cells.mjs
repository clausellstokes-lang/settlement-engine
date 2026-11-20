// GOALS-4 builder 10 (2026-11-20), a scratch tool kept as the receipt of its output beside it.
// usage: node append.mjs <goalFamilies.js> <lines380.json>  — appends each cell's lines before its closing `]),`
import { readFileSync, writeFileSync } from 'node:fs';
const [file, json] = process.argv.slice(2);
const src = readFileSync(file, 'utf8').split('\n');
const cells = JSON.parse(readFileSync(json, 'utf8'));
const start = src.findIndex((l) => l.startsWith('export const GOAL_FAMILY_LINES'));
let end = src.findIndex((l, i) => i > start && l === '});');
const find = (re, from, to) => { for (let i = from; i < to; i += 1) if (re.test(src[i])) return i; return -1; };
const lit = (s) => { if (!s.includes("'")) return `'${s}'`; if (s.includes('"')) throw new Error(`both quotes: ${s}`); return `"${s}"`; };
let added = 0;
for (const c of cells) {
  const f = find(new RegExp(`^  ${c.family}: Object\\.freeze\\(\\{$`), start, end);
  const fEnd = find(/^  \}\),$/, f, end);
  const s = find(new RegExp(`^    ${c.sub}: Object\\.freeze\\(\\{$`), f, fEnd);
  const sEnd = find(/^    \}\),$/, s, fEnd);
  const v = find(new RegExp(`^      ${c.vantage}: cell\\(\\[$`), s, sEnd);
  const close = find(/^      \]\),$/, v, sEnd);
  if ([f, fEnd, s, sEnd, v, close].some((x) => x < 0)) throw new Error(`not found: ${c.family}/${c.sub}/${c.vantage} ${[f, fEnd, s, sEnd, v, close]}`);
  const existing = src.slice(v + 1, close);
  if (existing.length !== c.from) throw new Error(`count ${c.family}/${c.sub}/${c.vantage}: ${existing.length} lines vs ${c.from}`);
  if (!existing.every((l) => /^        .*,$/.test(l))) throw new Error(`shape ${c.family}/${c.sub}/${c.vantage}`);
  const add = c.lines.map((l) => `        ${lit(l.line)},`);
  src.splice(close, 0, ...add);
  end += add.length; added += add.length;
}
writeFileSync(file, src.join('\n'));
console.log('appended', added, 'lines in', cells.length, 'cells');

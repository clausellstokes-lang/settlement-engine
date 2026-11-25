#!/usr/bin/env node
/**
 * THE JOINED PROOF (WORDS-1): two page-battery runs made WITH `--views --strings` (base, and the joined tree of the units,
 * made by the chair's no-commit method) over one plan. A MEASURE: it changes nothing. Prints:
 *   - places moved by record hash and by page hash; page-battery rows moved (gained or lost, per row);
 *   - E1's zero check: the measure's detector (gap 1, `e1-measure.mjs`'s words) over every printed sentence of the owner
 *     pages and every string of the public projection, before and after (hits, places);
 *   - every changed string (record and public, by path) and every changed printed line (by view, as a multiset), each
 *     classed by the unit that explains it: E8 (the line equals its base once him/herself reads "themselves"), E1 (the
 *     detector at gap 3 finds fewer doubles after), D6 (the contender's two words), else OTHER (listed: must be read);
 *   - per unit, the places it moved, and three examples.
 * Usage: node joined-proof.mjs <baseDir> <joinDir> [--examples=3] [--other=<tsv>]
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [A, B] = process.argv.slice(2);
const arg = (n, f) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : f; };
const NEX = Number(arg('examples', '3')); const OTHER_OUT = arg('other');
const CONTRACTIONS = new Set(['it', 'that', 'there', 'he', 'she', 'what', 'who', 'let', 'here', 'where', 'how', 'one', 'everyone', 'nobody', 'someone', 'no one', 'anyone', 'something', 'nothing', 'everything', 'this', 'when', 'why']);
const STOP = new Set(['is', 'are', 'was', 'were', 'be', 'been', 'and', 'or', 'but', 'nor', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'the', 'a', 'an', 'as', 'than', 'that', 'which', 'who', 'whom', 'whose', 'has', 'have', 'had', 'will', 'would', 'can', 'could', 'may', 'might', 'shall', 'should', 'must', 'do', 'does', 'did', 'not', 'no', 'into', 'over', 'under', 'about', 'after', 'before', 'its', 'their', 'his', 'her', 'our', 'your', 'my', 'this', 'these', 'those', 'if', 'so', 'yet', 'while', 'once', 'says', 'keeps', 'holds', 'runs', 'takes', 'makes', 'gives', 'sets', 'puts', 'gets', 'lets']);
const WORD = String.raw`[\p{L}\p{N}][\p{L}\p{N}\-]*`;
const POSS = new RegExp(String.raw`(?<![\p{L}\p{N}])(${WORD})(?:['’]s|s['’])(?![\p{L}\p{N}])`, 'gu');
const SPLIT = /(?<=[.!?…]["”')]?)\s+(?=["“'(]?\p{Lu})/u;
/** e1-measure's detector @param {string} s @param {number} GAP */
function doubles(s, GAP) {
  const ps = [];
  for (const m of String(s).matchAll(POSS)) { if (CONTRACTIONS.has(m[1].toLowerCase()) && /['’]s$/.test(m[0])) continue; ps.push({ start: m.index, end: m.index + m[0].length }); }
  const out = [];
  for (let i = 0; i + 1 < ps.length; i++) {
    const between = s.slice(ps[i].end, ps[i + 1].start);
    if (!/^\s+$/.test(between) && !new RegExp(String.raw`^\s+(?:${WORD}\s+){1,${Math.max(GAP, 1)}}$`, 'u').test(between)) continue;
    const words = between.trim() ? between.trim().split(/\s+/) : [];
    if (words.length > GAP || words.some((w) => STOP.has(w.toLowerCase()))) continue;
    out.push(s.slice(ps[i].start, ps[i + 1].end));
  }
  return out;
}
const sentDoubles = (/** @type {string} */ t, /** @type {number} */ g) => String(t).split(SPLIT).flatMap((x) => doubles(x, g));
const D6W = new Set(['Could contend', 'Could contest the seat', 'Contender', 'Contests the seat']);
const held = (/** @type {string} */ t) => String(t).replace(/\b(?:him|her)self\b/g, 'themselves');
/** which unit explains before → after @param {string|undefined} a @param {string|undefined} b */
function classOf(a, b) {
  if (a === undefined || b === undefined) return 'OTHER';
  if (D6W.has(a.trim()) && D6W.has(b.trim())) return 'D6';
  if (/Could contest the seat|could contest the seat/.test(b) && held(a) === held(b).replace(/could contest the seat/g, 'contests the seat').replace(/Could contest the seat/g, 'Contests the seat')) return 'D6';
  const e8 = held(b) === held(a) && a !== b;
  const e1 = sentDoubles(a, 3).length > sentDoubles(b, 3).length;
  if (e8 && !e1) return 'E8';
  if (e1 && held(a) === a && held(b) === b) return 'E1';
  if (e1) return 'E1+E8';
  return 'OTHER';
}
const read = (/** @type {string} */ d) => Object.fromEntries(readdirSync(join(d, 'rows')).filter((f) => f.endsWith('.json')).map((f) => { const r = JSON.parse(readFileSync(join(d, 'rows', f), 'utf8')); return [r.seed, r]; }));
const X = read(A); const Y = read(B);
const seeds = Object.keys(X).filter((s) => Y[s]).sort();
const missing = Object.keys(X).filter((s) => !Y[s]).concat(Object.keys(Y).filter((s) => !X[s]));
let recMoved = 0; let pageMoved = 0; const rowMoves = {}; const rowPlaces = new Set();
const z = { before: { page: 0, pagePl: new Set(), pub: 0, pubPl: new Set(), rec: 0, recPl: new Set() }, after: { page: 0, pagePl: new Set(), pub: 0, pubPl: new Set(), rec: 0, recPl: new Set() }, afterHits: [] };
const units = {}; const other = [];
const note = (u, seed, where, a, b) => { const e = (units[u] ||= { strings: 0, lines: 0, places: new Set(), pagePlaces: new Set(), ex: [] }); e.places.add(seed); if (where === 'page') { e.lines++; e.pagePlaces.add(seed); } else e.strings++; if (e.ex.length < NEX && !e.ex.some((x) => x.seed === seed)) e.ex.push({ seed, where, a, b }); };
for (const s of seeds) {
  const x = X[s]; const y = Y[s];
  if (x.recordHash !== y.recordHash) recMoved++;
  if (x.pageHash !== y.pageHash) pageMoved++;
  const lost = x.rows.filter((r) => !y.rows.includes(r)); const gained = y.rows.filter((r) => !x.rows.includes(r));
  for (const r of lost) (rowMoves[r] ||= { lost: 0, gained: 0 }).lost++;
  for (const r of gained) (rowMoves[r] ||= { lost: 0, gained: 0 }).gained++;
  if (lost.length + gained.length) rowPlaces.add(s);
  // E1's zero check: owner pages (printed sentences) and the public projection (strings under `public`), plus the record
  for (const [side, r] of [['before', x], ['after', y]]) {
    for (const lines of Object.values(r.printed || {})) for (const line of lines) { const n = sentDoubles(line, 1).length; if (n) { z[side].page += n; z[side].pagePl.add(s); if (side === 'after') z.afterHits.push(`${s} page: ${sentDoubles(line, 1).join(' | ')} — ${String(line).slice(0, 140)}`); } }
    for (const [k, t] of Object.entries(r.strings || {})) { const n = sentDoubles(t, 1).length; if (!n) continue; if (k.startsWith('public')) { z[side].pub += n; z[side].pubPl.add(s); if (side === 'after') z.afterHits.push(`${s} ${k}: ${sentDoubles(t, 1).join(' | ')}`); } else { z[side].rec += n; z[side].recPl.add(s); } }
  }
  // strings by path
  const ks = new Set([...Object.keys(x.strings || {}), ...Object.keys(y.strings || {})]);
  for (const k of ks) { const a = x.strings?.[k]; const b = y.strings?.[k]; if (a === b) continue; const u = classOf(a, b); note(u, s, k.startsWith('public') ? 'public' : 'record', a, b); if (u === 'OTHER') other.push([s, k, a ?? '∅', b ?? '∅']); }
  // printed lines by view, as a multiset: pair the removed with the added in order
  const views = new Set([...Object.keys(x.printed || {}), ...Object.keys(y.printed || {})]);
  for (const v of views) {
    const L = [...(x.printed?.[v] || [])]; const R = [...(y.printed?.[v] || [])];
    const cnt = new Map(); for (const l of L) cnt.set(l, (cnt.get(l) || 0) + 1);
    const added = []; for (const r of R) { if (cnt.get(r)) cnt.set(r, cnt.get(r) - 1); else added.push(r); }
    const removed = []; for (const [l, n] of cnt) for (let i = 0; i < n; i++) removed.push(l);
    const m = Math.max(removed.length, added.length);
    for (let i = 0; i < m; i++) { const a = removed[i]; const b = added[i]; const u = classOf(a, b); note(u, s, 'page', a, b); if (u === 'OTHER') other.push([s, `page:${v}`, a ?? '∅', b ?? '∅']); }
  }
}
console.log(`joined-proof ${A} → ${B}: births ${seeds.length}${missing.length ? `; MISSING ${missing.join(' ')}` : ''}`);
console.log(`  places moved: record hash ${recMoved}, page hash ${pageMoved}; page-battery rows moved on ${rowPlaces.size} places${Object.keys(rowMoves).length ? `: ${Object.entries(rowMoves).map(([r, m]) => `${r} −${m.lost}/+${m.gained}`).join(', ')}` : ''}`);
for (const side of ['before', 'after']) console.log(`  E1 detector (gap 1) ${side}: owner pages ${z[side].page} hits in ${z[side].pagePl.size} places; public projection ${z[side].pub} in ${z[side].pubPl.size}; record strings ${z[side].rec} in ${z[side].recPl.size}`);
for (const h of z.afterHits.slice(0, 8)) console.log(`    AFTER: ${h}`);
for (const [u, e] of Object.entries(units).sort()) {
  console.log(`  ${u}: ${e.strings} strings, ${e.lines} printed lines; places ${e.places.size} (page ${e.pagePlaces.size})`);
  for (const x of e.ex) console.log(`    ${x.seed} [${x.where}]\n      − ${String(x.a ?? '∅').slice(0, 220)}\n      + ${String(x.b ?? '∅').slice(0, 220)}`);
}
if (OTHER_OUT) writeFileSync(OTHER_OUT, `${other.map((r) => r.map((v) => String(v).replace(/[\t\n]/g, ' ')).join('\t')).join('\n')}\n`);
console.log(`  OTHER (unexplained by any unit): ${other.length}`);

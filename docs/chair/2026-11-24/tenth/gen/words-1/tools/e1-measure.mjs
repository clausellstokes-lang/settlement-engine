#!/usr/bin/env node
/**
 * E1 MEASURE (WORDS-1): every printed sentence that holds two possessives in a row ("the network's head's instructions").
 * Reads a page-battery run made WITH `--views` (`<dir>/rows/<seed>.json`, field `printed`: 'Group/Tab' → text nodes).
 * A MEASURE: it changes nothing.
 *
 * A double possessive: a possessive word ("X's" or "Xs'") followed, within the possessor noun phrase, by a second
 * possessive word, with at most `--gap` plain words between them (default 0: adjacent, "head's"); words that end a noun
 * phrase (verbs, conjunctions, prepositions, articles) are not allowed between. Contractions ("it's", "that's", "he's" ...)
 * are not possessives.
 *
 * Usage: node e1-measure.mjs --dir=<run> [--gap=0] [--out=<file.tsv>]
 * Prints per SHAPE (the sentence with every capitalised name run masked as N): the count of places by size, occurrences,
 * three seeds and one example; writes every hit as TSV (seed, size, view, sentence, the matched span).
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (n, f) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : f; };
const DIR = arg('dir'); const GAP = Number(arg('gap', '0')); const OUT = arg('out');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CONTRACTIONS = new Set(['it', 'that', 'there', 'he', 'she', 'what', 'who', 'let', 'here', 'where', 'how', 'one', 'everyone', 'nobody', 'someone', 'no one', 'anyone', 'something', 'nothing', 'everything', 'this', 'when', 'why']);
const STOP = new Set(['is', 'are', 'was', 'were', 'be', 'been', 'and', 'or', 'but', 'nor', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'the', 'a', 'an', 'as', 'than', 'that', 'which', 'who', 'whom', 'whose', 'has', 'have', 'had', 'will', 'would', 'can', 'could', 'may', 'might', 'shall', 'should', 'must', 'do', 'does', 'did', 'not', 'no', 'into', 'over', 'under', 'about', 'after', 'before', 'its', 'their', 'his', 'her', 'our', 'your', 'my', 'this', 'these', 'those', 'if', 'so', 'yet', 'while', 'once', 'says', 'keeps', 'holds', 'runs', 'takes', 'makes', 'gives', 'sets', 'puts', 'gets', 'lets']);
const WORD = String.raw`[\p{L}\p{N}][\p{L}\p{N}\-]*`;
const POSS = new RegExp(String.raw`(?<![\p{L}\p{N}])(${WORD})(?:['’]s|s['’])(?![\p{L}\p{N}])`, 'gu');
const SPLIT = /(?<=[.!?…]["”')]?)\s+(?=["“'(]?\p{Lu})/u;

/** @param {string} s @returns {string[]} spans of two possessives in a row */
function doubles(s) {
  /** @type {Array<{ word: string, start: number, end: number }>} */ const ps = [];
  for (const m of s.matchAll(POSS)) {
    if (CONTRACTIONS.has(m[1].toLowerCase()) && /['’]s$/.test(m[0])) continue;
    ps.push({ word: m[1], start: m.index, end: m.index + m[0].length });
  }
  const out = [];
  for (let i = 0; i + 1 < ps.length; i++) {
    const between = s.slice(ps[i].end, ps[i + 1].start);
    if (!/^\s+$/.test(between) && !new RegExp(String.raw`^\s+(?:${WORD}\s+){1,${Math.max(GAP, 1)}}$`, 'u').test(between)) continue;
    const words = between.trim() ? between.trim().split(/\s+/) : [];
    if (words.length > GAP) continue;
    if (words.some((w) => STOP.has(w.toLowerCase()))) continue;
    out.push(s.slice(ps[i].start, ps[i + 1].end));
  }
  return out;
}
const mask = (/** @type {string} */ s) => s.replace(/\b\p{Lu}[\p{L}\-']*(?:\s+(?:of|the|de|van|von)?\s*\p{Lu}[\p{L}\-']*)*/gu, 'N').replace(/\d+/g, '#');

const rows = readdirSync(join(DIR, 'rows')).filter((f) => f.endsWith('.json'));
/** @type {Map<string, { places: Map<string, Set<string>>, n: number, seeds: string[], ex: string, span: string }>} */ const shapes = new Map();
const tsv = []; let places = 0; const placesBySize = {};
for (const f of rows) {
  const r = JSON.parse(readFileSync(join(DIR, 'rows', f), 'utf8'));
  let hit = false; const seen = new Set();
  for (const [view, lines] of Object.entries(r.printed || {})) {
    for (const line of lines) for (const sent of String(line).split(SPLIT)) {
      for (const span of doubles(sent)) {
        const key = `${sent}`; if (seen.has(key + span)) continue; seen.add(key + span);
        hit = true; tsv.push([r.seed, r.size, view, sent.replace(/\t/g, ' '), span].join('\t'));
        const sh = mask(sent);
        const e = shapes.get(sh) || { places: new Map(), n: 0, seeds: [], ex: sent, span };
        e.n++; if (!e.places.has(r.size)) e.places.set(r.size, new Set()); e.places.get(r.size).add(r.seed);
        if (!e.seeds.includes(r.seed) && e.seeds.length < 3) e.seeds.push(r.seed);
        shapes.set(sh, e);
      }
    }
  }
  if (hit) { places++; placesBySize[r.size] = (placesBySize[r.size] || 0) + 1; }
}
const list = [...shapes.entries()].sort((a, b) => b[1].n - a[1].n);
console.log(`e1-measure ${DIR} gap=${GAP}: births read ${rows.length}; places with a double possessive ${places} (${SIZES.map((z) => `${z} ${placesBySize[z] || 0}`).join(', ')}); hits ${tsv.length}; shapes ${list.length}`);
for (const [sh, e] of list) {
  const by = SIZES.map((z) => (e.places.get(z)?.size || 0)).join(' ');
  console.log(`${String(e.n).padStart(4)}  [${by}]  ${e.seeds.join(' ')}\n      span: ${e.span}\n      ex:   ${e.ex.slice(0, 260)}`);
}
if (OUT) writeFileSync(OUT, `${tsv.join('\n')}\n`);

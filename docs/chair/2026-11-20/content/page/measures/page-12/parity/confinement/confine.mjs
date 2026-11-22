#!/usr/bin/env node
/**
 * PAGE-12's COPY (CAUSES-PARITY-2, B), unchanged but for the corpus list: `--corpora=hxd` (default golden,census).
 * THE CONFINEMENT CHECK (the seventh chair's CV4; NAMES-2's check of its hand-back §3, rebuilt generic by NAMES-3). Usage:
 *   node confine.mjs <before-out> <after-out> [--words=number|names|none] [--control] [--fails=20]
 * reads `golden.jsonl` and `census.jsonl` from each (`run.mjs <tree> <out> born`; or `trees.mjs`, which does both trees)
 * and diffs every document key by key, matched by its corpus key.
 *
 * "Non-string" counts every number, boolean or null that moved, a type change, a key added or removed, a key order
 * changed and an array's length: the claim is that there are none. Each changed string is then read as words (an LCS
 * diff); the words gone and the words added must pair up as the SAME word in its other number: a verb ("wants"/"want",
 * "is"/"are", "has"/"have", "it's"/"they've"), a pronoun ("it"/"them", "its"/"their", "itself"/"themselves"). Any other
 * changed word fails the string (`--words=number`, the default). `--words=names` is NAMES-2's second check: every word gone
 * or added is "the", a pronoun, or a word of the town's own power names, person names or roles (either side's record).
 * `--words=none` reads no words (the counts and the fields only). `--control` diffs each after-document against its
 * neighbour's: the word check must flag nearly all.
 * Prints the counts per corpus, the changed strings counted by field, and every failing string (the first 20).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [beforeDir, afterDir] = process.argv.slice(2);
const control = process.argv.includes('--control');
const FAILS = Number((process.argv.find((a) => a.startsWith('--fails=')) || '--fails=20').slice(8));
const WORDS = (process.argv.find((a) => a.startsWith('--words=')) || '--words=number').slice(8);

/** the two numbers of one word, each way (lower case; a capital is folded) */
const NUMBER = new Map();
const pair = (one, many) => { NUMBER.set(`${one}>${many}`, true); NUMBER.set(`${many}>${one}`, true); };
for (const [a, b] of [['is', 'are'], ['has', 'have'], ['was', 'were'], ['does', 'do'], ['it', 'them'], ['it', 'they'], ['its', 'their'],
  ['itself', 'themselves'], ["it's", "they've"], ["it's", "they're"], ["doesn't", "don't"], ["isn't", "aren't"], ["hasn't", "haven't"]]) pair(a, b);
/** a verb's -s form against its bare form: wants/want, carries/carry, goes/go, presides/preside */
const verbPair = (a, b) => {
  const [s, bare] = a.length > b.length ? [a, b] : [b, a];
  return s === `${bare}s` || s === `${bare}es` || (bare.endsWith('y') && s === `${bare.slice(0, -1)}ies`);
};
const sameWord = (gone, added) => {
  const g = gone.toLowerCase().replace(/[^a-z']/g, ''); const a = added.toLowerCase().replace(/[^a-z']/g, '');
  // the punctuation around the word must not move
  if (gone.replace(/[A-Za-z']/g, '') !== added.replace(/[A-Za-z']/g, '')) return false;
  return NUMBER.has(`${g}>${a}`) || verbPair(g, a);
};

/** an LCS of two word lists; returns the aligned edits as [gone[], added[]] runs */
function edits(x, y) {
  const n = x.length, m = y.length;
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = x[i] === y[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const runs = []; let g = [], a = []; let i = 0, j = 0;
  const flush = () => { if (g.length || a.length) runs.push([g, a]); g = []; a = []; };
  while (i < n || j < m) {
    if (i < n && j < m && x[i] === y[j]) { flush(); i++; j++; }
    else if (j < m && (i >= n || L[i][j + 1] >= L[i + 1][j])) a.push(y[j++]);
    else g.push(x[i++]);
  }
  flush();
  return runs;
}
/** a changed string is lawful when every edit run swaps words one for one, each the same word in its other number */
const lawful = (before, after) => edits(before.split(/\s+/), after.split(/\s+/))
  .every(([g, a]) => g.length === a.length && g.every((w, k) => sameWord(w, a[k])));

const PRONOUNS = new Set(['the', 'he', 'she', 'him', 'her', 'his', 'hers', 'himself', 'herself', 'they', 'them', 'their', 'theirs', 'themselves', 'it', 'its', 'itself', "it's", "they're", "they've", "he's", "she's"]);
const norm = (w) => w.toLowerCase().replace(/[’]/g, "'").replace(/^[^a-z\u00c0-\u024f']+|[^a-z\u00c0-\u024f']+$/g, '').replace(/'s$|'$/, '');
/** the words of a record's own power names, person names and roles @param {any} doc */
function vocabulary(doc) {
  const v = new Set(PRONOUNS);
  const add = (t) => { for (const w of String(t || '').split(/[\s/()]+/)) for (const p of [w, ...w.split('-')]) { const n = norm(p); if (n) v.add(n); } };
  for (const f of doc?.powerStructure?.factions || []) add(f?.faction);
  // a person's names and every short label the card carries (its role, title, styled office): the words a later mention may take
  for (const n of doc?.npcs || []) for (const val of Object.values(n || {})) if (typeof val === 'string' && val.length <= 80) add(val);
  return v;
}
/** NAMES-2's second check: every word gone or added is "the", a pronoun, or a word of the town's names and roles */
const namesOnly = (before, after, vocab) => edits(before.split(/\s+/), after.split(/\s+/))
  .every(([g, a]) => [...g, ...a].every((w) => !norm(w) || vocab.has(norm(w))));
const judge = (before, after, vocab) => (WORDS === 'none' ? true : WORDS === 'names' ? namesOnly(before, after, vocab) : lawful(before, after));

const fieldOf = (path) => path.replace(/\[\d+\]/g, '[]');
function diff(x, y, path, acc) {
  if (typeof x === 'string' && typeof y === 'string') { if (x !== y) acc.strings.push({ path, before: x, after: y }); return; }
  if (x === null || y === null || typeof x !== 'object' || typeof y !== 'object') {
    if (!(Number.isNaN(x) && Number.isNaN(y)) && x !== y) acc.other.push(`${path}: ${JSON.stringify(x)?.slice(0, 80)} -> ${JSON.stringify(y)?.slice(0, 80)}`);
    return;
  }
  if (Array.isArray(x) !== Array.isArray(y)) { acc.other.push(`${path}: array/object`); return; }
  if (Array.isArray(x)) {
    if (x.length !== y.length) acc.other.push(`${path}: length ${x.length} -> ${y.length}`);
    for (let i = 0; i < Math.min(x.length, y.length); i++) diff(x[i], y[i], `${path}[${i}]`, acc);
    return;
  }
  const kx = Object.keys(x), ky = Object.keys(y);
  if (kx.join('\u0000') !== ky.join('\u0000')) acc.other.push(`${path}: keys ${kx.length} -> ${ky.length}${kx.length === ky.length ? ' (order)' : ''}`);
  for (const k of kx) if (Object.hasOwn(y, k)) diff(x[k], y[k], path ? `${path}.${k}` : k, acc);
}

const read = (dir, corpus) => readFileSync(join(dir, `${corpus}.jsonl`), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
for (const corpus of (process.argv.find((a) => a.startsWith('--corpora=')) || '--corpora=golden,census').slice(10).split(',')) {
  const before = read(beforeDir, corpus); const after = read(afterDir, corpus);
  const byKey = new Map(after.map((d) => [JSON.stringify(d.key), d.doc]));
  let identical = 0, otherDocs = 0, strings = 0, bad = 0;
  const fields = new Map(); const towns = new Map(); const fails = []; const others = [];
  before.forEach((b, i) => {
    const a = control ? after[(i + 1) % after.length].doc : byKey.get(JSON.stringify(b.key));
    if (a === undefined) { others.push(`${b.key}: missing after`); otherDocs++; return; }
    const acc = { strings: [], other: [] };
    diff(b.doc, a, '', acc);
    if (!acc.strings.length && !acc.other.length) identical++;
    if (acc.other.length) { otherDocs++; others.push(...acc.other.slice(0, 3).map((o) => `${b.key} ${o}`)); }
    const vocab = WORDS === 'names' ? new Set([...vocabulary(b.doc), ...vocabulary(a)]) : null;
    for (const s of acc.strings) {
      strings++;
      const f = fieldOf(s.path);
      fields.set(f, (fields.get(f) || 0) + 1);
      if (!towns.has(f)) towns.set(f, new Set()); towns.get(f).add(String(b.key));
      if (!judge(s.before, s.after, vocab)) { bad++; if (fails.length < FAILS) fails.push(`${b.key} ${s.path}\n    before: ${s.before}\n    after:  ${s.after}`); }
    }
  });
  console.log(`## ${corpus}${control ? ' (CONTROL: each against its neighbour)' : ''}: documents ${before.length} · identical ${identical} · with a non-string difference ${otherDocs} · differing strings ${strings} · of them passing the word check (${WORDS}) ${strings - bad} · other ${bad}`);
  if (!control) {
    for (const [f, n] of [...fields.entries()].sort((p, q) => q[1] - p[1])) console.log(`| ${f} | ${n} | ${towns.get(f).size} |`);
    for (const o of others.slice(0, 20)) console.log(`NON-STRING ${o}`);
    for (const f of fails) console.log(`OTHER ${f}`);
  }
}

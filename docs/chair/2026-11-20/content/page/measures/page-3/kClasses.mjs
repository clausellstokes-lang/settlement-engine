#!/usr/bin/env node
/**
 * PAGE-3 K1's TRIAL CLASSIFIER (from page-2/kTiesTrial.mjs; K.md, "THE TRIAL"). Usage:
 *   node kClasses.mjs <born-before> <born-after> [--others=10]
 * reads `golden.jsonl` and `census.jsonl` (the confinement tool's births, `trees.mjs`) from each, matches documents by
 * corpus key, diffs every leaf (a string, number, boolean or null that moved; an array's length; a key added, removed or
 * reordered) and sorts EVERY differing leaf into the five classes K.md names, or OTHER:
 *   1 a corrected card's own `influence`, `power`, `structuralPosition` (a corrected card: its `influence` moved);
 *   2 a tie touching a corrected card (any leaf of it) and a goal that reads such a tie (the goal's npc target, before
 *     or after, is the other end of a moved tie that touches a corrected card);
 *   3 another tie of the same town in prose only (`description`, `tension`, `proseVariant`), and `prominentRelationship`
 *     where its strings quote a moved tie (both of its people's names, or its description or tension), or where its
 *     two names, before or after, are a moved tie's two ends;
 *   4 the crisis cast (`stress[].cast`, its twin `stressors[].cast`) of a crisis where a corrected card holds a role on
 *     one side and not the other, and a cast row a corrected card holds on both sides (its reason: smallNameBacked);
 *   5 a goal of a card dealt AFTER a card whose goal is class 2 (the deal runs in roster order; goals.js :: dealGoals).
 * Prints per corpus: documents, identical, each class's leaves and towns, OTHER (leaves, towns, the first paths with
 * before/after), and OTHER's fields by count. Then, over both corpora: cards by band, before and after; the powers
 * whose first card (rank 1) reads 'low', before and after; the towns where a crisis role changes hands (two named).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [beforeDir, afterDir] = process.argv.slice(2);
const OTHERS = Number((process.argv.find((a) => a.startsWith('--others=')) || '--others=10').slice(9));
const read = (dir, corpus) => readFileSync(join(dir, `${corpus}.jsonl`), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const S = (v) => (v == null ? '' : String(v));
const short = (v) => { const s = JSON.stringify(v); return s === undefined ? 'undefined' : s.length > 160 ? `${s.slice(0, 157)}...` : s; };

/** every differing leaf of two values: { path, before, after } */
function leaves(x, y, path, out) {
  const isObj = (v) => v !== null && typeof v === 'object';
  if (!isObj(x) || !isObj(y)) {
    if (!(Number.isNaN(x) && Number.isNaN(y)) && x !== y) out.push({ path, before: x, after: y });
    return out;
  }
  if (Array.isArray(x) !== Array.isArray(y)) { out.push({ path, before: x, after: y }); return out; }
  if (Array.isArray(x)) {
    if (x.length !== y.length) out.push({ path: `${path}#length`, before: x.length, after: y.length });
    for (let i = 0; i < Math.max(x.length, y.length); i++) {
      if (i >= x.length || i >= y.length) out.push({ path: `${path}[${i}]`, before: x[i], after: y[i] });
      else leaves(x[i], y[i], `${path}[${i}]`, out);
    }
    return out;
  }
  const kx = Object.keys(x); const ky = Object.keys(y);
  const common = kx.filter((k) => Object.hasOwn(y, k));
  if (common.join('\u0000') !== ky.filter((k) => Object.hasOwn(x, k)).join('\u0000')) out.push({ path: `${path}#keyorder`, before: kx.length, after: ky.length });
  for (const k of kx) if (!Object.hasOwn(y, k)) out.push({ path: path ? `${path}.${k}` : k, before: x[k], after: undefined });
  for (const k of ky) if (!Object.hasOwn(x, k)) out.push({ path: path ? `${path}.${k}` : k, before: undefined, after: y[k] });
  for (const k of common) leaves(x[k], y[k], path ? `${path}.${k}` : k, out);
  return out;
}

const goalTargets = (goal) => {
  const t = new Set();
  for (const h of ['short', 'long']) {
    const i = goal?.intent?.[h];
    if (i?.target?.kind === 'npc' && i.target.id != null) t.add(String(i.target.id));
    for (const r of i?.refs || []) t.add(String(r));
  }
  return t;
};
const castRoles = (entry) => (Array.isArray(entry?.cast?.roles) ? entry.cast.roles : []);
const holderOf = (r) => (r && r.kind === 'npc' ? S(r.id) : null);

/** sort one document's differing leaves */
function classify(b, a) {
  const all = leaves(b, a, '', []);
  if (!all.length) return { all, cls: [] };
  const npcsB = Array.isArray(b.npcs) ? b.npcs : []; const npcsA = Array.isArray(a.npcs) ? a.npcs : [];
  const byIdA = new Map(npcsA.map((n) => [S(n?.id), n]));
  const C = new Set(npcsB.filter((n) => byIdA.has(S(n?.id)) && byIdA.get(S(n.id)).influence !== n.influence).map((n) => S(n.id)));
  const tiesB = Array.isArray(b.relationships) ? b.relationships : []; const tiesA = Array.isArray(a.relationships) ? a.relationships : [];
  const ends = (t) => [S(t?.from), S(t?.to)];
  // the ties that moved (by index; a tie's identity is its two ends on either side)
  const movedTies = [];
  for (let i = 0; i < Math.max(tiesB.length, tiesA.length); i++) if (JSON.stringify(tiesB[i]) !== JSON.stringify(tiesA[i])) movedTies.push(i);
  const touches = (i) => [...ends(tiesB[i]), ...ends(tiesA[i])].some((id) => C.has(id));
  const corrTies = movedTies.filter(touches);
  /** pairs (as "x|y" both ways) joined by a moved tie that touches a corrected card */
  const corrPairs = new Set();
  for (const i of corrTies) for (const t of [tiesB[i], tiesA[i]]) if (t) { const [f, o] = ends(t); corrPairs.add(`${f}|${o}`); corrPairs.add(`${o}|${f}`); }
  const goalReadsCorrTie = (idx) => {
    const id = S(npcsB[idx]?.id);
    const tg = new Set([...goalTargets(npcsB[idx]?.goal), ...goalTargets(npcsA[idx]?.goal)]);
    return [...tg].some((y) => corrPairs.has(`${id}|${y}`));
  };
  // the quoted texts of the moved ties (class 3's prominentRelationship)
  const quoteOf = [];
  for (const i of movedTies) for (const t of [tiesB[i], tiesA[i]]) if (t) quoteOf.push(t);
  const quotes = (s) => typeof s === 'string' && quoteOf.some((t) => (S(t.npc1Name) && S(t.npc2Name) && s.includes(t.npc1Name) && s.includes(t.npc2Name))
    || (S(t.description) && s.includes(t.description)) || (S(t.tension) && s.includes(t.tension)));
  // crises where a corrected card holds a role on one side and not the other
  const corrCrises = new Set(); const corrRows = new Set();
  for (const key of ['stress', 'stressors']) {
    const eb = Array.isArray(b[key]) ? b[key] : [b[key]]; const ea = Array.isArray(a[key]) ? a[key] : [a[key]];
    eb.forEach((e, k) => {
      const hb = new Map(castRoles(e).map((r) => [r.role, holderOf(r)])); const ha = new Map(castRoles(ea[k]).map((r) => [r.role, holderOf(r)]));
      for (const role of new Set([...hb.keys(), ...ha.keys()])) {
        const x = hb.get(role) ?? null; const y = ha.get(role) ?? null;
        if (x !== y && ((x && C.has(x)) || (y && C.has(y)))) corrCrises.add(`${key}[${k}]`);
      }
      // a row a corrected card holds on both sides (its reason may read its power: crisisCast.js :: smallNameBacked)
      castRoles(e).forEach((r, j) => { if (holderOf(r) && C.has(holderOf(r)) && holderOf(castRoles(ea[k])[j]) === holderOf(r)) corrRows.add(`${key}[${k}].${j}`); });
    });
  }
  // the prominent tie, before or after, IS a moved tie (its two names are a moved tie's two ends): its names quote it
  const pairOf = (pr) => [S(pr?.npc1), S(pr?.npc2)].sort().join('|');
  const promQuotesMovedTie = [b.prominentRelationship, a.prominentRelationship].some((pr) => pr && quoteOf.some((t) => pairOf(pr) === [S(t.npc1Name), S(t.npc2Name)].sort().join('|')));
  const goalLeaf = (p) => p.match(/^npcs\[(\d+)\]\.goal\b/);
  const firstClass2Goal = Math.min(...all.map((l) => goalLeaf(l.path)).filter(Boolean).map((m) => Number(m[1])).filter((i) => goalReadsCorrTie(i)), Infinity);
  const cls = all.map((l) => {
    const p = l.path;
    let m = p.match(/^npcs\[(\d+)\]\.(\w+)/);
    if (m) {
      const idx = Number(m[1]); const field = m[2]; const id = S(npcsB[idx]?.id);
      if (C.has(id) && ['influence', 'power', 'structuralPosition'].includes(field)) return 1;
      if (field === 'goal') { if (goalReadsCorrTie(idx)) return 2; if (idx > firstClass2Goal) return 5; }
      return 0;
    }
    m = p.match(/^relationships\[(\d+)\](?:\.(\w+))?/);
    if (m) {
      const i = Number(m[1]);
      if (touches(i)) return 2;
      if (['description', 'tension', 'proseVariant'].includes(m[2])) return 3;
      return 0;
    }
    if (/^prominentRelationship\b/.test(p) && (quotes(l.before) || quotes(l.after) || promQuotesMovedTie)) return 3;
    m = p.match(/^(stress(?:ors)?(?:\[\d+\])?)\.cast(?:\.roles\[(\d+)\])?/);
    if (m) { const key = m[1].includes('[') ? m[1] : `${m[1]}[0]`; if (corrCrises.has(key) || (m[2] != null && corrRows.has(`${key}.${m[2]}`))) return 4; }
    return 0;
  });
  return { all, cls, C, handover: corrCrises.size > 0 };
}

const towns = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set(), 0: new Set() };
const BANDS = ['low', 'moderate', 'high'];
const bandCount = { before: { low: 0, moderate: 0, high: 0 }, after: { low: 0, moderate: 0, high: 0 } };
const firstLow = { before: 0, after: 0, powers: 0, examples: [] };
const handovers = []; const handoverTowns = new Set();
for (const corpus of ['golden', 'census']) {
  const before = read(beforeDir, corpus); const after = read(afterDir, corpus);
  const byKey = new Map(after.map((d) => [JSON.stringify(d.key), d.doc]));
  let identical = 0; const n = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; const t = { 0: new Set(), 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set() };
  const others = []; const otherFields = new Map(); let corrected = 0; let missing = 0;
  for (const rowB of before) {
    const key = JSON.stringify(rowB.key); const docA = byKey.get(key);
    if (docA === undefined) { missing++; continue; }
    const docB = rowB.doc;
    for (const [side, doc] of [['before', docB], ['after', docA]]) {
      for (const c of doc.npcs || []) if (BANDS.includes(c?.influence)) bandCount[side][c.influence]++;
    }
    // the first card (rank 1) of each power, before and after
    const firstOf = (doc) => { const m = new Map(); for (const c of doc.npcs || []) for (const ms of c?.memberships || []) if (ms?.rank === 1 && !m.has(ms.power)) m.set(ms.power, c); return m; };
    const fb = firstOf(docB); const fa = firstOf(docA);
    for (const [power, c] of fb) {
      firstLow.powers++;
      if (c.influence === 'low') firstLow.before++;
      const ca = fa.get(power); if (ca?.influence === 'low') firstLow.after++;
      if (c.influence === 'low' && ca && ca.influence !== 'low' && firstLow.examples.length < 3) firstLow.examples.push(`${corpus} ${rowB.key}: ${power}'s first card ${c.name} (${c.role}) low -> ${ca.influence}`);
    }
    const { all, cls, C, handover } = classify(docB, docA);
    if (handover) handoverTowns.add(`${corpus}:${key}`);
    if (!all.length) { identical++; continue; }
    if (C?.size) corrected += C.size;
    all.forEach((l, k) => {
      const c = cls[k]; n[c]++; t[c].add(key); towns[c].add(`${corpus}:${key}`);
      if (c === 0) {
        const f = l.path.replace(/\[\d+\]/g, '[]'); if (!otherFields.has(f)) otherFields.set(f, { n: 0, towns: new Set(), first: `${rowB.key} ${l.path}: ${short(l.before)} -> ${short(l.after)}` });
        const of = otherFields.get(f); of.n++; of.towns.add(key);
        if (others.length < OTHERS) others.push(`${rowB.key} ${l.path}\n    before: ${short(l.before)}\n    after:  ${short(l.after)}`);
      }
      if (c === 4 && /\.roles\[\d+\]\.id$/.test(l.path) && handovers.length < 2 && !handovers.some((h) => h.startsWith(`${corpus} ${rowB.key}`))) {
        const role = (() => { const m = l.path.match(/^(stress(?:ors)?(?:\[\d+\])?)\.cast\.roles\[(\d+)\]/); const e = m[1].includes('[') ? docB.stress[Number(m[1].match(/\[(\d+)\]/)[1])] : docB.stress; return e?.cast?.roles?.[Number(m[2])]; })();
        const nm = (doc, id) => (doc.npcs || []).find((x) => S(x.id) === S(id));
        const x = nm(docB, l.before); const y = nm(docA, l.after);
        handovers.push(`${corpus} ${rowB.key} (${docB.name}), ${l.path.split('.cast')[0]} ${role?.role}: ${x?.name} (${x?.role}, ${x?.influence} ${x?.power}) -> ${y?.name} (${y?.role}, ${y?.influence} ${y?.power})`);
      }
    });
  }
  console.log(`## ${corpus}: documents ${before.length}${missing ? ` (missing after ${missing})` : ''} · identical ${identical} · corrected cards ${corrected}`);
  console.log('| class | leaves | towns |'); console.log('|---|---|---|');
  for (const c of [1, 2, 3, 4, 5]) console.log(`| ${c} | ${n[c]} | ${t[c].size} |`);
  console.log(`| OTHER | ${n[0]} | ${t[0].size} |`);
  for (const [f, k] of [...otherFields.entries()].sort((p, q) => q[1].n - p[1].n)) console.log(`OTHER FIELD ${f}: ${k.n} leaves, ${k.towns.size} towns; first ${k.first}`);
  for (const o of others) console.log(`OTHER ${o}`);
}
console.log('## both corpora');
console.log(`cards by band, before: ${BANDS.map((b) => `${b} ${bandCount.before[b]}`).join(' · ')}`);
console.log(`cards by band, after:  ${BANDS.map((b) => `${b} ${bandCount.after[b]}`).join(' · ')}`);
console.log(`powers ${firstLow.powers}: first card (rank 1) reads 'low' before ${firstLow.before}, after ${firstLow.after}`);
for (const e of firstLow.examples) console.log(`  e.g. ${e}`);
console.log(`towns where a crisis role changes hands: ${handoverTowns.size} (class 4 towns, any cast leaf: ${towns[4].size})`);
for (const h of handovers) console.log(`  e.g. ${h}`);

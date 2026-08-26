#!/usr/bin/env node
/**
 * harness/laneSPINE3/partitionDigest.mjs — SPINE-3 · a CONTROL on the distinctness derivation.
 *
 * The distinctness key used by landlockedRemeasure.mjs is only three fields (edge count, way
 * count, landlocked id set). Three fields can COLLIDE. This computes a FULL structural digest of
 * each leaf's arrangement — every vertex coordinate, every edge (endpoints, type, rank, frontier),
 * every face class — and asks whether digest-equality produces the SAME equivalence classes.
 *
 * ⛔ THE DIGEST'S OWN CONTROL: a planted one-field mutation must CHANGE the digest. A digest that
 * cannot break is a digest that proves nothing.
 */
import { createHash } from 'node:crypto';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

/** ORDER-SENSITIVE: the arrays exactly as the constructor built them. */
function digestOrdered(arr) {
  const h = createHash('sha256');
  h.update(`V${arr.verts.length}\n`);
  for (const v of arr.verts) h.update(`${v.x},${v.y},${v.frontier ? 1 : 0}\n`);
  h.update(`E${arr.edges.length}\n`);
  for (const e of arr.edges) {
    const he = arr.halfEdges[e.he];
    h.update(`${he.origin},${arr.halfEdges[he.twin].origin},${e.type},${e.rank || '-'},${e.frontier ? 1 : 0}\n`);
  }
  h.update(`F${arr.faces.length}\n`);
  for (const f of arr.faces) h.update(`${f.cls},${f.alive ? 1 : 0}\n`);
  return h.digest('hex').slice(0, 16);
}

/** ORDER-INSENSITIVE: the same content as a sorted multiset, so array order cannot carry it. */
function digestSorted(arr) {
  const es = [];
  for (const e of arr.edges) {
    const he = arr.halfEdges[e.he];
    const a = arr.verts[he.origin]; const b = arr.verts[arr.halfEdges[he.twin].origin];
    const p = `${a.x},${a.y}`; const q = `${b.x},${b.y}`;
    es.push(`${p < q ? p + '|' + q : q + '|' + p}|${e.type}|${e.rank || '-'}|${e.frontier ? 1 : 0}`);
  }
  es.sort();
  const fs = arr.faces.filter((f) => f.alive).map((f) => f.cls).sort();
  const h = createHash('sha256');
  h.update(es.join('\n')); h.update('\n##\n'); h.update(fs.join(','));
  return h.digest('hex').slice(0, 16);
}

const rows = [];
for (const key of leaves) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const P = buildSettledPartition(partitionInputs(settlement, model, fabric));
  const arr = P.arrangement;
  const dO = digestOrdered(arr);
  const dS = digestSorted(arr);

  // ⛔ CONTROL: flip ONE bit of content. Both digests must move.
  const savedType = arr.edges[0].type;
  arr.edges[0].type = savedType === 'BOUND' ? 'WALL' : 'BOUND';
  const mO = digestOrdered(arr); const mS = digestSorted(arr);
  arr.edges[0].type = savedType;
  const rO = digestOrdered(arr); const rS = digestSorted(arr);

  rows.push({ key, dO, dS, breaks: mO !== dO && mS !== dS, restores: rO === dO && rS === dS });
  console.log(`${key.padEnd(12)} ordered=${dO} sorted=${dS} digestBreaksOnPlant=${mO !== dO && mS !== dS} restores=${rO === dO && rS === dS}`);
}

for (const [label, f] of [['ORDERED', (r) => r.dO], ['SORTED', (r) => r.dS]]) {
  const m = new Map();
  for (const r of rows) { const k = f(r); if (!m.has(k)) m.set(k, []); m.get(k).push(r.key); }
  console.log(`\n${label} DIGEST CLASSES: ${m.size}`);
  for (const [k, v] of m) console.log(`  ${k}  [${v.length}] ${v.join(', ')}`);
}
console.log(`\nall digests break on the planted mutation: ${rows.every((r) => r.breaks)}`);
console.log(`all digests restore afterwards:            ${rows.every((r) => r.restores)}`);

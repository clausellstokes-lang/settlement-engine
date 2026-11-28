// BIRTH-AUDIT Q1 by kind of house (kinds.mjs): marks and towns, by kind and cause, and the calm-and-connected headline.
//   node docs/chair/2026-11-17/birth/probes/q1bykind.mjs <q1.json.gz>
import fs from 'node:fs'; import zlib from 'node:zlib';
import { kindOf } from './kinds.mjs';
const q1 = JSON.parse(zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString());
const label = { i: '(i) buys and works', ii: '(ii) is the source', iii: '(iii) other', null: '(no kind)' };
for (const pop of Object.keys(q1.towns)) {
  const R = q1.rows.filter((r) => r.pop === pop);
  console.log(`\n${pop}: | kind | reading | houses · towns | born short · towns | of them calm + connected: houses · towns |`);
  const g = {};
  for (const r of R) { const k = `${label[kindOf(r.id)]} | ${r.reading === '(ii) spent ground' ? 'spent ground' : 'no source, no import (gap or trade good)'}`; (g[k] ||= []).push(r); }
  for (const [k, S] of Object.entries(g).sort()) { const born = S.filter((r) => r.cause.startsWith('BORN')); const cc = born.filter((r) => !r.crises.length && r.route === 'connected');
    const t = (x) => new Set(x.map((r) => r.seed)).size;
    console.log(`| ${k} | ${S.length} · ${t(S)} | ${born.length} · ${t(born)} | ${cc.length} · ${t(cc)} |`); }
}

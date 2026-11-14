// usage: node bodies.mjs — STYLE-2-MERGE-14: each carried red's body at the line (line-carried.json) against the save tip (the shard JSONs)
import { readFileSync, writeFileSync } from 'node:fs';
const norm = (s) => s.replace(/\/home\/user\/wt-[a-z0-9]+/g, '<TREE>').replace(/\x1b\[[0-9;]*m/g, '').replace(/ \d+ms\b/g, '');
const read = (f, root) => { const out = new Map(); const j = JSON.parse(readFileSync(f, 'utf8'));
  for (const r of j.testResults) { const file = r.name.replace(root, ''); const fa = r.assertionResults.filter((a) => a.status === 'failed');
    if (r.status === 'failed' && !fa.length) out.set(`${file} > [LOAD]`, norm(r.message || ''));
    for (const a of fa) out.set(`${file} > ${a.fullName}`, norm((a.failureMessages || []).join('\n').split('\n').filter((l) => !/^\s+at /.test(l)).join('\n'))); } return out; };
const L = read('/home/user/rec14/line-carried.json', '/home/user/wt-line49/');
const T = new Map(); for (let i = 1; i <= 6; i++) for (const [k, v] of read(`/home/user/rec14/shard-${i}.json`, '/home/user/wt-s49c/')) T.set(k, v);
const keys = new Set([...L.keys(), ...T.keys()].filter((k) => [...L.keys()].includes(k) || /siteCoherence|landingFixture|news|foundingWorld|proseFamily|dossierProseManifest/.test(k)));
let rep = '';
for (const k of [...keys].sort()) { const a = L.get(k), b = T.get(k); const v = a === undefined ? 'RED AT TIP ONLY' : b === undefined ? 'RED AT LINE ONLY' : a === b ? 'BODY EQUAL' : 'BODY DIFFERS';
  console.log(`${v} · ${k.slice(0, 170)}`); if (v === 'BODY DIFFERS') rep += `=== ${k}\n--- line\n${a}\n--- tip\n${b}\n`; }
writeFileSync('/home/user/rec14/bodies.diff.txt', rep);

// Field diff: two corpora of the same seeds; every leaf path that differs, by family (top-level key).
import fs from 'node:fs'; import zlib from 'node:zlib';
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const A = load(process.argv[2]); const B = load(process.argv[3]);
const leaves = (v, p, out) => { if (v && typeof v === 'object') { for (const [k, x] of Object.entries(v)) leaves(x, `${p}.${k}`, out); } else out.set(p, v); return out; };
const fam = {}; const births = new Set(); const examples = [];
for (const [seed, a] of A) {
  const b = B.get(seed); const la = leaves(a, '', new Map()); const lb = leaves(b, '', new Map());
  for (const k of new Set([...la.keys(), ...lb.keys()])) if (la.get(k) !== lb.get(k)) {
    const f = k.split('.').slice(0, 3).join('.').replace(/\.\d+$/, ''); fam[f] = (fam[f] || 0) + 1; births.add(seed);
    if (examples.length < 6) examples.push(`${seed} ${k}: ${JSON.stringify(la.get(k))?.slice(0, 80)} → ${JSON.stringify(lb.get(k))?.slice(0, 80)}`);
  }
}
console.log('births compared', A.size, 'births moved', births.size); console.log(fam); for (const e of examples) console.log(e);

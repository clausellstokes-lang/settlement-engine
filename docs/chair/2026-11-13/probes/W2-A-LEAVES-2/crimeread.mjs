// the crime desk's lines (Power "Crime and the hall" section + Defense criminal structure note) base vs tip, with the
// facts that decide them: officials in pay (the leaf at the tip tree), the stored rung
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const [S] = process.argv.slice(2);
const { officialsInCriminalPayOf } = await import(`${S}/lane/src/domain/facts/officialsInPay.js`);
const recs = new Map(zlib.gunzipSync(fs.readFileSync(`${S}/out/base/corpus.ndjson.gz`)).toString().split('\n').filter(Boolean).map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const views = (f) => { const v = {}; let c = null; for (const l of fs.readFileSync(f, 'utf8').split('\n')) { const m = l.match(/^== (.+) ==$/); if (m) { c = m[1]; v[c] = []; } else if (c && l) v[c].push(l); } return v; };
const P = /officials?|bought|approach was made|grip on the hall|nothing is bought|business with the hall is straight|has not;|reach into the hall|Each season it gets easier|losing their grip|still own a few|one ring|protection money/i;
const crimeLines = (v) => [...(v['Systems/Power'] || []), ...(v['Systems/Defense'] || [])].filter((l) => P.test(l) && l.length < 400);
const out = { removed: [], added: [], towns: 0 };
for (const seed of recs.keys()) {
  const b = crimeLines(views(`${S}/out/base/dumps/${seed}.txt`)); const t = crimeLines(views(`${S}/out/tip3/dumps/${seed}.txt`));
  const rem = b.filter((l) => !t.includes(l)); const add = t.filter((l) => !b.includes(l));
  if (rem.length || add.length) out.towns++;
  const s = recs.get(seed); const facts = { inPay: officialsInCriminalPayOf(s).length, state: s.powerStructure?.criminalCaptureState };
  for (const l of rem) out.removed.push({ seed, l, ...facts }); for (const l of add) out.added.push({ seed, l, ...facts });
}
fs.writeFileSync(`${S}/out/crimeread.json`, JSON.stringify(out));
console.log({ towns: out.towns, removed: out.removed.length, added: out.added.length });

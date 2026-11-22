// R3-TELL-5b unit (iii) MEASURE FIRST: the open place's capture form from the cached pool's signatures (parts A and B:
// every nothing-hidden read). Per size and Reveal read, distinct births showing each joint value of
//   r.powers.capture (rows: powers and relations carrying captureState), f.powerStructure.criminalCaptureState,
//   r.powers.criminal, r.inst.criminal, r.powers.relations
//   node capjoint.mjs <pooldir>
import fs from 'node:fs';
const [dir] = process.argv.slice(2);
const shards = fs.readdirSync(dir).filter((f) => /^poolb?-shard\d\.json$/.test(f)).sort();
const out = {}; const births = {};
for (const f of shards) {
  const part = f.startsWith('poolb') ? 'B' : 'A';
  const j = JSON.parse(fs.readFileSync(`${dir}/${f}`));
  for (const b of j.births) {
    const seen = new Set();
    for (const [k, i] of Object.entries(b.sigs)) {
      const rd = k.split('|')[0]; const p = JSON.parse(j.sigs[i]);
      const v = `cap=${p.r?.['powers.capture'] ?? '-'} ccs=${p.f?.['powerStructure.criminalCaptureState'] ?? '-'} pc=${p.r?.['powers.criminal'] ?? '-'} ic=${p.r?.['inst.criminal'] ?? '-'} rel=${p.r?.['powers.relations'] ?? '-'}`;
      seen.add(`${b.size}|${rd}|${v}`); seen.add(`${b.size}|${rd}|ALL|cap=${p.r?.['powers.capture'] ?? '-'}`);
      seen.add(`${b.size}|${rd}|part${part}|cap=${p.r?.['powers.capture'] ?? '-'}`);
    }
    for (const s of seen) out[s] = (out[s] || 0) + 1;
    births[`${b.size}|${part}`] = (births[`${b.size}|${part}`] || 0) + 1;
  }
}
console.log('births by size|part', JSON.stringify(births));
for (const k of Object.keys(out).sort()) console.log(`${k}\t${out[k]}`);

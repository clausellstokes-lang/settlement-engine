// R3-TELL-5b unit (iii): reads capform.probe.jsx's shards.  node capform-an.mjs <dir> <towns|pool>
import fs from 'node:fs';
const [dir, mode] = process.argv.slice(2);
const B = [0, 1, 2, 3].flatMap((s) => JSON.parse(fs.readFileSync(`${dir}/cap-${mode}-shard${s}.json`)).births);
const cls = (p) => (p.crimH.length ? 'H' : '') + (p.crimP.length ? 'P' : '') || '-';
const tally = {}; const inc = (k, seed) => ((tally[k] ||= new Set()).add(seed));
for (const b of B) {
  const grp = mode === 'towns' ? (b.hidden.length ? 'hidden' : 'control') : `part${b.part}`;
  inc(`${b.size}|${grp}|#births`, b.seed);
  inc(`${b.size}|${grp}|stored ccs=${b.stored.ccs} pw=${b.stored.pw.length} rel=${b.stored.rel.length} gov=${b.stored.gov}`, b.seed);
  for (const [k, p] of Object.entries(b.pages)) {
    const rd = k.split('|')[0];
    inc(`${b.size}|${grp}|${rd}|served=${cls(p)}|ccs=${p.ccs}|pw=${p.pw.length}|rel=${p.rel.length}`, b.seed);
    if (!p.crimH.length && !p.crimP.length) { for (const x of p.pw) inc(`${b.size}|${grp}|${rd}|NOCRIM pw ${x.replace(/^[^|]*\|/, '')}`, b.seed); for (const x of p.rel) inc(`${b.size}|${grp}|${rd}|NOCRIM rel ${x.replace(/^\[[^\]]*\]\|/, '')}`, b.seed); }
  }
}
for (const k of Object.keys(tally).sort()) console.log(`${k}\t${tally[k].size}`);

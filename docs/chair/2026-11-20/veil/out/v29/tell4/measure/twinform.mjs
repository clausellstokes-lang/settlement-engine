// R3-TELL-4: THE TWIN'S FORM, measured from the cached pool's signatures (parts A and B: every nothing-hidden read).
//   node twinform.mjs <pooldir> <part key>[,<part key>...]   e.g. r.people.allegiance,f.availableServices.criminal
// Per size: the distribution of each part's value over the nothing-hidden reads (birth x Reveal x setting, deduplicated
// per birth: a birth counts once per value it shows).
import fs from 'node:fs';
const [dir, keysArg] = process.argv.slice(2);
const keys = keysArg.split(',');
const shards = fs.readdirSync(dir).filter((f) => /^pool-shard\d\.json$/.test(f) || /^poolb-shard\d\.json$/i.test(f));
const out = {};
for (const f of shards) {
  const j = JSON.parse(fs.readFileSync(`${dir}/${f}`));
  for (const b of j.births) {
    const seen = new Set();
    for (const i of Object.values(b.sigs)) {
      const p = JSON.parse(j.sigs[i]);
      for (const k of keys) { const [part, ...rest] = k.split('.'); const v = JSON.stringify(p[part]?.[rest.join('.')] ?? '-'); seen.add(`${k}=${v}`); }
    }
    for (const s of seen) { const key = `${b.size}|${s}`; out[key] = (out[key] || 0) + 1; }
    out[`${b.size}|#births`] = (out[`${b.size}|#births`] || 0) + 1;
  }
}
for (const k of Object.keys(out).sort()) console.log(`${k}\t${out[k]}`);

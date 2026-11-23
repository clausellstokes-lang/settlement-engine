// DISAGREE PHASE 2 PROOF (d), THE DARK PROOF (PROSE-6's builder): read-only. BASE=<tree at 244fa84ef> TIP=<tree> node <script> [N=150].
// One digest a tree over the 900 births' records, taken over every field that is not a string (JSON.stringify with each
// string replaced by one marker), and the strings that differ between the two trees, by path.
import { createHash } from 'node:crypto';
const trees = { base: process.env.BASE, tip: process.env.TIP || '/home/user/wt-disagree' };
const t0 = Date.now();
const mods = {};
for (const [name, T] of Object.entries(trees)) {
  const R = T + '/src/';
  const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
  await loadGenerationLawPayloads();
  mods[name] = { generateSettlementPipeline, birthConfig, hash: createHash('sha256') };
}
const MARK = '\u0000STRING';
const darkOf = (s) => JSON.stringify(s, (_, v) => (typeof v === 'string' ? MARK : v));
const stringsOf = (v, path = '', out = new Map()) => {
  if (typeof v === 'string') out.set(path, v);
  else if (Array.isArray(v)) v.forEach((x, i) => stringsOf(x, `${path}[${i}]`, out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) stringsOf(x, path ? `${path}.${k}` : k, out);
  return out;
};
const N = Number(process.argv[2] || 150);
let births = 0; let darkDiffer = 0; const differ = []; let differCount = 0;
for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  for (let i = 0; i < N; i++) {
    const seed = `dz-${settType}-${i}`;
    const rec = {};
    for (const [name, m] of Object.entries(mods)) {
      rec[name] = m.generateSettlementPipeline(m.birthConfig({ settType }), null, { seed, customContent: {} });
      m.hash.update(darkOf(rec[name]));
    }
    births++;
    if (darkOf(rec.base) !== darkOf(rec.tip)) darkDiffer++;
    const a = stringsOf(rec.base); const b = stringsOf(rec.tip);
    for (const p of new Set([...a.keys(), ...b.keys()])) {
      if (a.get(p) === b.get(p)) continue;
      differCount++;
      if (differ.length < 40) differ.push(`${seed} ${p}: ${JSON.stringify(a.get(p))?.slice(0, 120)} -> ${JSON.stringify(b.get(p))?.slice(0, 120)}`);
    }
  }
}
console.log('DARK base', mods.base.hash.digest('hex'));
console.log('DARK tip ', mods.tip.hash.digest('hex'));
console.log('births', births, '| births whose dark form differs', darkDiffer, '| strings that differ', differCount);
for (const d of differ) console.log('  ', d);
console.log(`RUN ${((Date.now() - t0) / 1000).toFixed(1)}s`);

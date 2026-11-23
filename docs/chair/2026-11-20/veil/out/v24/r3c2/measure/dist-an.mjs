// dist-an.mjs <dir>: the seat's 09:18 relay, acceptance 2: the served distribution of the derived Defense key and of each
// operations label (criminalInstitutions), over the hidden-house pool, against the CONTROL (towns of the same tiers with no
// hideable house, read through the same open veil), per engine and Reveal setting; shares of towns, by tier and overall.
import { readFileSync } from 'node:fs';
const dir = process.argv[2];
const towns = [0, 1, 2, 3].flatMap((s) => JSON.parse(readFileSync(`${dir}/shard${s}.json`, 'utf8')));
const pct = (n, d) => (d ? `${n}/${d} (${Math.round((100 * n) / d)}%)` : '0/0');
for (const k of ['server/off', 'server/dm', 'twin/off', 'twin/dm']) {
  const pool = towns.filter((t) => t.reads).map((t) => ({ tier: t.tier, ...t.reads[k] }));
  const ctl = towns.filter((t) => t.control).map((t) => ({ tier: t.tier, ...t.control[k] }));
  const tiers = [...new Set(ctl.map((t) => t.tier))];
  const P = pool.filter((t) => tiers.includes(t.tier));
  console.log(`== ${k}: hidden-house pool ${pool.length} (${P.length} of the control's tiers ${tiers.join(',')}), control ${ctl.length}`);
  for (const key of ['organized', 'semi-organized', 'diffuse', null]) {
    const a = P.filter((t) => t.key === key).length; const c = ctl.filter((t) => t.key === key).length;
    console.log(`  key ${String(key).padEnd(15)} pool ${pct(a, P.length).padEnd(12)} control ${pct(c, ctl.length)}`);
  }
  const labels = [...new Set([...P, ...ctl].flatMap((t) => t.ops || []))].sort();
  for (const l of labels) {
    const a = P.filter((t) => (t.ops || []).includes(l)).length; const c = ctl.filter((t) => (t.ops || []).includes(l)).length;
    console.log(`  label ${l.padEnd(22)} pool ${pct(a, P.length).padEnd(12)} control ${pct(c, ctl.length)}`);
  }
  // the house-free COUNTERFACTUAL of the same pool, read through the same veil: what the shown houses alone serve
  const cfKey = (key) => P.filter((t) => t.cf === key).length;
  console.log(`  counterfactual keys: ${['organized', 'semi-organized', 'diffuse', null].map((x) => `${x} ${pct(cfKey(x), P.length)}`).join(' | ')}`);
  for (const l of [...new Set(P.flatMap((t) => [...(t.ops || []), ...(t.cfOps || [])]))].sort()) {
    const a = P.filter((t) => (t.ops || []).includes(l)).length; const b = P.filter((t) => (t.cfOps || []).includes(l)).length;
    const above = P.filter((t) => (t.ops || []).includes(l) && !(t.cfOps || []).includes(l)).map((t) => t.tier).length;
    console.log(`  label ${l.padEnd(22)} served ${pct(a, P.length).padEnd(12)} counterfactual ${pct(b, P.length).padEnd(12)} served where the counterfactual has none: ${above}`);
  }
  const nothingCriminal = P.filter((t) => t.key === null).length;
  console.log(`  pool towns serving NO operations label: ${pct(P.filter((t) => !(t.ops || []).length).length, P.length)}; control ${pct(ctl.filter((t) => !(t.ops || []).length).length, ctl.length)}; key null: pool ${pct(nothingCriminal, P.length)}`);
}

// keylevel-an.mjs <dir>: R3-CURE-5 unit 2's table from keylevel.probe.jsx's two shards (the chair's 12:21 (a), (b), (c)).
import { readFileSync } from 'node:fs';
const dir = process.argv[2];
const towns = [0, 1].flatMap((s) => JSON.parse(readFileSync(`${dir}/keylevel-shard${s}.json`, 'utf8')));
const pct = (n, d) => (d ? `${n}/${d} (${(100 * n / d).toFixed(1)}%)` : '0/0');
const sizes = ['village', 'town', 'city', 'metropolis'];
console.log(`births ${towns.length}; threw ${towns.filter((t) => t.threw).length}; with a hideable house ${towns.filter((t) => t.hidden?.length).length}; control (none) ${towns.filter((t) => t.hidden && !t.hidden.length).length}; B threw ${towns.filter((t) => t.Bthrew).length}`);
// (a0) THE ENGINE: the born towns' own holders (stored, before any projection), by list, key and size: carrying the key
if (towns.some((t) => t.stored)) {
  const st = {};
  for (const t of towns) for (const h of t.stored || []) { const k = `${h.list}|${h.key}|${t.size}`; (st[k] ||= [0, 0]); st[k][0] += 1; if (h.has) st[k][1] += 1; }
  console.log(`(a0) THE ENGINE (stored, shape ${towns[0].shape}): list | key | size: holders WITH the key`);
  for (const k of Object.keys(st).sort()) console.log(`  ${k}: with ${pct(st[k][1], st[k][0])}`);
}
for (const dm of [false, true]) {
  console.log(`\n== Reveal DM ${dm ? 'ON' : 'OFF'} (twin) ==`);
  // (a) NOTHING-HIDDEN pages (control + counterfactual B): by size, holder kind, key: carrying the key, served
  const nh = towns.flatMap((t) => (t.pages || []).filter((p) => p.dm === dm && p.role !== 'hidden').map((p) => ({ t, p })));
  const rows = {};
  for (const { t, p } of nh) for (const h of p.served) { const k = `${h.list}|${h.kind}|${h.key}|${t.size}`; (rows[k] ||= [0, 0]); rows[k][0] += 1; if (h.has) rows[k][1] += 1; }
  const rowsPub = {};
  for (const { t, p } of nh) for (const h of p.pub) { const k = `${h.list}|${h.kind}|${h.key}|${t.size}`; (rowsPub[k] ||= [0, 0]); rowsPub[k][0] += 1; if (h.has) rowsPub[k][1] += 1; }
  console.log(`(a) NOTHING-HIDDEN pages: ${nh.length} (control ${nh.filter((x) => x.p.role === 'control').length}, counterfactual ${nh.filter((x) => x.p.role === 'counterfactual').length}). list | holder kind | key | size: served holders WITHOUT the key / served holders (and in the projection before the veil: WITH the key)`);
  for (const k of Object.keys(rows).sort()) { const [n, has] = rows[k]; const [pn, phas] = rowsPub[k] || [0, 0]; if (k.includes('person') || n) console.log(`  ${k}: without ${pct(n - has, n)} | projection with ${pct(phas, pn)}`); }
  // (b) CUT pages: each cut, its holder kind and size, against the nothing-hidden rate of WITHOUT for the same list/kind/key/size
  const cuts = towns.flatMap((t) => (t.pages || []).filter((p) => p.dm === dm && p.role === 'hidden').flatMap((p) => (p.cuts || []).map((c) => ({ t, c }))));
  const pagesHidden = towns.flatMap((t) => (t.pages || []).filter((p) => p.dm === dm && p.role === 'hidden'));
  console.log(`(b) PAGES WITH A HOUSE HIDDEN: ${pagesHidden.length}; pages with a key cut: ${pagesHidden.filter((p) => (p.cuts || []).length).length}; cuts: ${cuts.length}`);
  const by = {};
  for (const { t, c } of cuts) { const k = `${c.list}|${c.kind}|${c.key}|${t.size}`; (by[k] ||= { n: 0, towns: new Set(), servedNull: 0, still: 0 }); by[k].n += 1; by[k].towns.add(t.seed); if (c.servedValue === null) by[k].servedNull += 1; if (c.stillNamed.length) by[k].still += 1; }
  for (const k of Object.keys(by).sort()) { const [n, has] = rows[k] || [0, 0]; console.log(`  CUT ${k}: ${by[k].n} holders in ${by[k].towns.size} towns (key absent after: ${by[k].servedNull}; a served string still naming the cut value: ${by[k].still}) | nothing-hidden rate WITHOUT the key, same list/kind/size: ${pct(n - has, n)}`); }
  const still = cuts.filter(({ c }) => c.stillNamed.length);
  if (still.length) console.log(`  still named: ${still.slice(0, 10).map(({ t, c }) => `${t.seed} ${c.key}=${c.value} at ${c.stillNamed.slice(0, 3).join(',')}`).join(' ; ')}`);
  // (c) the two options' counts: withhold the holder (holders that would leave, pages touched), or re-derive the key over what is served
  const powers = cuts.filter(({ c }) => c.list !== 'npcs'); const people = cuts.filter(({ c }) => c.list === 'npcs');
  const peopleIds = new Set(people.map(({ t, c }) => `${t.seed}|${c.value}|${c.memberships}`));
  console.log(`(c) WITHHOLD THE HOLDER: ${powers.length} served power rows leave (${new Set(powers.map(({ t }) => t.seed)).size} towns); ${people.length} person-keys cut (${new Set(people.map(({ t }) => t.seed)).size} towns). RE-DERIVE: the key re-written over the served powers (contestsNiche: the niche's served holder; an affiliation key: the person's served membership), same holders.`);
  const ppl = people.reduce((o, { c }) => { o[c.key] = (o[c.key] || 0) + 1; o[`members>0`] = (o['members>0'] || 0) + (c.memberships > 0 ? 1 : 0); return o; }, {});
  console.log(`  person cuts by key: ${JSON.stringify(ppl)}`);
}

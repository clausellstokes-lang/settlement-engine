// R3-TELL-8 step 1: THE TABLES (m1.probe.jsx's shards).   node m1-an.mjs <dir>
// Pages are keyed '<off|dm>|<setting>|<tw|sv>'. GATED = a read that hides at least one house the town holds (ruling 62 (3)):
// every setting of a hidden-house town but 'allShown' and 'unmarked' (which hide nothing by construction: cards shown / no veil).
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const shards = readdirSync(dir).filter((f) => /^m1-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
const towns = shards.flatMap((s) => s.towns);
const P = []; const say = (s = '') => P.push(s);
const J = (x) => JSON.stringify(x);
const types = (l) => (Array.isArray(l) ? l.map((p) => p[0]).sort() : l);
const hid = towns.filter((t) => t.hidden.length); const ctl = towns.filter((t) => !t.hidden.length);
const pagesOf = (t, f = () => true) => Object.entries(t.pages).map(([k, p]) => { const [dm, set, eng] = k.split('|'); return { t, k, dm, set, eng, p }; }).filter(f);
const gated = (x) => x.t.hidden.length && x.set !== 'allShown' && x.set !== 'unmarked';
const uniq = (xs) => [...new Set(xs)];
say(`R3-TELL-8 STEP 1 (m1.probe.jsx): ${towns.length} births (${hid.length} hidden-house, ${ctl.length} controls); shards ${shards.map((s) => `${s.meta.shard.join('/')} ${s.meta.started}..${s.meta.ended}`).join('; ')}; rng active at probe: ${uniq(shards.map((s) => s.meta.rngAtProbe)).join(',')}; per birth: ${uniq(towns.map((t) => t.rngNow)).join(',')}`);
const all = towns.flatMap((t) => pagesOf(t));
say(`pages: ${all.length} (tw ${all.filter((x) => x.eng === 'tw').length}, sv ${all.filter((x) => x.eng === 'sv').length})`);
// ENGINE PARITY
let par = { key: 0, ref: 0, n: 0 }; const parList = [];
for (const t of towns) for (const k of Object.keys(t.pages)) if (k.endsWith('|tw')) { const s = t.pages[k.replace(/\|tw$/, '|sv')]; const w = t.pages[k]; par.n += 1; if (J(s.key) !== J(w.key)) { par.key += 1; parList.push(`${t.seed} ${k} key`); } if (J(s.ref) !== J(w.ref)) { par.ref += 1; parList.push(`${t.seed} ${k} ref`); } }
say(`ENGINE PARITY (server against twin, the same read): key differs ${par.key}, reader's list differs ${par.ref} of ${par.n}${parList.length ? `: ${parList.slice(0, 12).join('; ')}` : ''}`);
say('');
// HALF 1 and HALF 2 TODAY (the arm's two halves, red today)
const keyed = all.filter((x) => Array.isArray(x.p.key));
say(`THE ARM, HALF 1 TODAY (a shared read carries the key): ${keyed.length} of ${all.length} pages; hidden-house towns ${uniq(keyed.filter((x) => x.t.hidden.length).map((x) => x.t.seed)).length} of ${hid.length}, controls ${uniq(keyed.filter((x) => !x.t.hidden.length).map((x) => x.t.seed)).length} of ${ctl.length}; by setting: ${J(Object.fromEntries(uniq(all.map((x) => x.set)).map((s) => [s, keyed.filter((x) => x.set === s).length])))}`);
const h2 = keyed.filter((x) => J(x.p.key) !== J(x.p.ref)); const h2t = keyed.filter((x) => J(types(x.p.key)) !== J(types(x.p.ref)));
const h2towns = (xs, f) => uniq(xs.filter(f).map((x) => x.t.seed));
say(`THE ARM, HALF 2 TODAY (a served list != the record reference over the same page): by TYPE ${h2t.length} pages, hidden-house towns ${h2towns(h2t, gated).length} (gated reads), controls ${h2towns(h2t, (x) => !x.t.hidden.length).length}, nothing-hidden reads of hidden-house towns ${h2towns(h2t, (x) => x.t.hidden.length && !gated(x)).length}; by [type, desc] ${h2.length} pages, gated towns ${h2towns(h2, gated).length}, controls ${h2towns(h2, (x) => !x.t.hidden.length).length}, nothing-hidden reads ${h2towns(h2, (x) => x.t.hidden.length && !gated(x)).length}`);
say(`  gated towns (by type): ${h2towns(h2t, gated).sort().join(', ')}`);
const descOnly = h2.filter((x) => J(types(x.p.key)) === J(types(x.p.ref)));
if (descOnly.length) say(`  desc-only differences (types equal): ${descOnly.length} pages, towns ${uniq(descOnly.map((x) => `${x.t.seed}${x.t.hidden.length ? '' : '(ctl)'}`)).join(', ')}; e.g. ${descOnly.slice(0, 3).map((x) => `${x.t.seed} ${x.k}: served ${J(x.p.key.filter((p) => !x.p.ref.some((q) => J(q) === J(p))))} ref ${J(x.p.ref.filter((p) => !x.p.key.some((q) => J(q) === J(p))))}`).join(' || ')}`);
say('');
// 1b THE INPUTS
const rin = all.filter((x) => x.p.refIn !== '=');
say(`1b THE INPUTS (the writer over the STORED config, tier and houses restricted to the served ones, against the writer over the page): differ on ${rin.length} pages; towns ${uniq(rin.map((x) => x.t.seed)).length}${rin.length ? `: ${uniq(rin.map((x) => `${x.t.seed} ${x.set}`)).slice(0, 20).join('; ')}` : ''}`);
const cfgKeys = {}; for (const x of all) for (const c of x.p.cfg) cfgKeys[c] = (cfgKeys[c] || 0) + 1;
say(`  config keys the page lacks (-) or changes (~), pages each: ${J(cfgKeys)}`);
say(`  tier differs: ${all.filter((x) => x.p.tier !== '=').length} pages`);
const alt = {}; for (const x of all) for (const n of x.p.housesAltered) alt[n] = (alt[n] || 0) + 1;
say(`  served houses that equal no stored house byte for byte: ${all.filter((x) => x.p.housesAltered.length).length} pages; names (pages): ${J(Object.entries(alt).sort((a, b) => b[1] - a[1]).slice(0, 15))}`);
say('');
// 1c SEEDLESS
const sl = towns.filter((t) => J(t.seedless) !== J(t.stored)); const slT = towns.filter((t) => J(types(t.seedless)) !== J(types(t.stored)));
say(`1c SEEDLESS, the stored inputs (config, tier, ALL houses, the stored seats/tensions/services), no seed active: differs from the stored list on ${sl.length} of ${towns.length} births by [type, desc] (by type ${slT.length})${sl.length ? `: ${sl.map((t) => t.seed).join(', ')}` : ''}`);
const nh = all.filter((x) => x.t.hidden.length && x.set === 'allShown'); const nhBad = nh.filter((x) => J(x.p.ref) !== J(x.t.stored));
say(`1c THE 184 NOTHING-HIDDEN READINGS (allShown, the 92, off and DM) x 2 engines = ${nh.length} pages: the reader over the page != the stored list on ${nhBad.length} (towns ${uniq(nhBad.map((x) => x.t.seed)).length}${nhBad.length ? `: ${uniq(nhBad.map((x) => x.t.seed)).join(', ')}` : ''}); served key != stored on ${nh.filter((x) => J(x.p.key) !== J(x.t.stored)).length}`);
const cOwn = all.filter((x) => !x.t.hidden.length && x.set !== 'unmarked' && Array.isArray(x.p.key)); const cBad = cOwn.filter((x) => J(x.p.ref) !== J(x.t.stored));
say(`1c THE CONTROLS' OPEN READS (key served): ${cOwn.length} pages; the reader != the stored list on ${cBad.length}${cBad.length ? `: ${uniq(cBad.map((x) => x.t.seed)).join(', ')}` : ''}`);
const um = all.filter((x) => x.set === 'unmarked'); const umBad = um.filter((x) => J(x.p.ref) !== J(x.t.stored));
say(`1c THE UNMARKED SHAPE (no veil): ${um.length} pages; the reader != the stored list on ${umBad.length}${umBad.length ? ` (towns ${uniq(umBad.map((x) => x.t.seed)).length}: ${uniq(umBad.map((x) => x.t.seed)).slice(0, 12).join(', ')})` : ''}; served key != stored on ${um.filter((x) => J(x.p.key) !== J(x.t.stored)).length}`);
say('');
// 1e THE GROUPING
const conf = (f) => { const m = {}; for (const x of all) { const c = `${x.set === 'unmarked' ? 'unmarked' : 'marked'}:${x.p.shut ? 'shut' : 'open'}:${f(x)}`; m[c] = (m[c] || 0) + 1; } return m; };
say(`1e THE GROUPING: (shape:truth:evidence) pages; evidence = criminalInstitutions an array: ${J(conf((x) => (x.p.evOps ? 'ops' : 'no-ops')))}`);
say(`  today's GROUPING_OPEN_EVIDENCE (both arrays): ${J(conf((x) => (x.p.evToday ? 'ev' : 'no-ev')))}`);
say(`  the key today: ${J(conf((x) => (Array.isArray(x.p.key) ? 'key' : 'no-key')))}`);
say('');
// 1a THE DEPENDENTS, on every page whose key is served today: each over the served list and over the reader's
const comp = ['blc', 'cs', 'shadow', 'stand', 'smug'];
const dd = keyed.filter((x) => x.p.dep !== '=');
say(`1a THE DEPENDENTS (pages serving the key today: ${keyed.length}): the dependent over the served list != over the reader's list on ${dd.length} pages`);
for (const c of comp) { const xs = dd.filter((x) => J(x.p.dep.served[c]) !== J(x.p.dep.ref[c])); say(`  ${c}: ${xs.length} pages; gated towns ${h2towns(xs, gated).length}, controls ${h2towns(xs, (x) => !x.t.hidden.length).length}, nothing-hidden reads ${h2towns(xs, (x) => x.t.hidden.length && !gated(x)).length}${xs.length ? `; e.g. ${xs.slice(0, 3).map((x) => `${x.t.seed} ${x.k}: ${J(x.p.dep.served[c])} -> ${J(x.p.dep.ref[c])}`).join(' || ')}` : ''}`); }
const pr = all.filter((x) => x.p.prose);
say(`  publicProse 'defense:criminal' (composed at birth from the stored list) ships on ${pr.length} pages: gated reads of hidden-house towns ${pr.filter(gated).length}; controls ${pr.filter((x) => !x.t.hidden.length).length}; nothing-hidden reads of hidden-house towns ${pr.filter((x) => x.t.hidden.length && !gated(x)).length}; of those where the stored list != the reader's on the same page: ${pr.filter((x) => J(x.t.stored) !== J(x.p.ref)).length}`);
say('');
// 1f THE MERCHANT ARMY
const maT = towns.filter((t) => t.maStored || t.maHookStored || Object.values(t.pages).some((p) => p.ma || p.maHook));
say(`1f THE MERCHANT ARMY: births with the stored flag ${towns.filter((t) => t.maStored).length}, with the stored hook ${towns.filter((t) => t.maHookStored).length}`);
for (const t of maT) {
  const ps = pagesOf(t);
  const bad1 = ps.filter((x) => x.p.maHook && x.p.ma === 0); const bad2 = ps.filter((x) => !x.p.maHook && x.p.ma === 1 && x.p.hooks);
  say(`  ${t.seed} (hidden ${t.hidden.length}) stored flag ${t.maStored} hook ${t.maHookStored} | served-derived flag: ${J(Object.fromEntries(['off', 'dm'].map((dm) => [dm, uniq(ps.filter((x) => x.dm === dm).map((x) => x.p.ma))])))} | hook served on ${ps.filter((x) => x.p.maHook).length}/${ps.length} | hook served where the served flag is false: ${bad1.length} (${uniq(bad1.map((x) => `${x.dm}|${x.set}`)).join(' ')}) | hook absent where the served flag is true and hooks served: ${bad2.length} (${uniq(bad2.map((x) => `${x.dm}|${x.set}`)).join(' ')})`);
}
console.log(P.join('\n'));

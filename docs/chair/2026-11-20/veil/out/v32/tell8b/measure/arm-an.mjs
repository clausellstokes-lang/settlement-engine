// R3-TELL-8b (i): THE ARM'S TABLE (arm.probe.jsx's shards).   node arm-an.mjs <dir>   exit 0 green, 1 red
// Pages are keyed '<off|dm>|<setting>|<tw|sv>'. GATED = a read of a hidden-house town at a setting that hides a house
// (every setting but 'allShown' and 'unmarked').
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const shards = readdirSync(dir).filter((f) => /^arm-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
const towns = shards.flatMap((s) => s.towns);
const P = []; const say = (s = '') => P.push(s);
const J = (x) => JSON.stringify(x);
const uniq = (xs) => [...new Set(xs)];
const types = (l) => (Array.isArray(l) ? l.map((p) => p[0]).sort() : l);
const all = towns.flatMap((t) => Object.entries(t.pages).map(([k, p]) => { const [dm, set, eng] = k.split('|'); return { t, k, dm, set, eng, p }; }));
const hid = towns.filter((t) => t.hidden.length); const ctl = towns.filter((t) => !t.hidden.length);
const gated = (x) => x.t.hidden.length && x.set !== 'allShown' && x.set !== 'unmarked';
const bySet = (xs) => J(Object.fromEntries(uniq(all.map((x) => x.set)).map((s) => [s, xs.filter((x) => x.set === s).length])));
const towns_ = (xs) => uniq(xs.map((x) => x.t.seed)).sort();
say(`R3-TELL-8b THE ARM (arm.probe.jsx): ${towns.length} births (${hid.length} hidden-house, ${ctl.length} controls), ${all.length} pages; shards ${shards.map((s) => `${s.meta.shard.join('/')} ${s.meta.started}..${s.meta.ended}`).join('; ')}`);
let par = 0; const parL = [];
for (const x of all.filter((y) => y.eng === 'tw')) { const s = x.t.pages[x.k.replace(/\|tw$/, '|sv')]; for (const f of ['h1', 'ref', 'shown', 'maHook']) if (J(s?.[f]) !== J(x.p[f])) { par += 1; parL.push(`${x.t.seed} ${x.k} ${f}`); } }
say(`ENGINE PARITY (server against twin, h1/ref/shown/maHook): ${par} differences${parL.length ? `: ${parL.slice(0, 12).join('; ')}` : ''}`);
const h1 = all.filter((x) => x.p.h1);
say(`HALF 1 (a shared read carries the key): ${h1.length} of ${all.length} pages; hidden-house towns ${towns_(h1.filter((x) => x.t.hidden.length)).length} of ${hid.length}, controls ${towns_(h1.filter((x) => !x.t.hidden.length)).length} of ${ctl.length}; by setting ${bySet(h1)}`);
const h2 = all.filter((x) => x.p.h2);
const h2t = h2.filter((x) => J(types(x.p.shown)) !== J(types(x.p.ref === '#none' ? '#absent' : x.p.ref)));
say(`HALF 2 (the list the page prints != the record reference over the served page): ${h2.length} pages; by [type, desc]: gated towns ${towns_(h2.filter(gated)).length} of ${hid.length}, controls ${towns_(h2.filter((x) => !x.t.hidden.length)).length}, nothing-hidden reads of hidden-house towns ${towns_(h2.filter((x) => x.t.hidden.length && !gated(x))).length}; by type: gated towns ${towns_(h2t.filter(gated)).length}, controls ${towns_(h2t.filter((x) => !x.t.hidden.length)).length}; by setting ${bySet(h2)}`);
say(`  gated towns (by [type, desc]): ${towns_(h2.filter(gated)).join(', ')}`);
say(`  controls: ${towns_(h2.filter((x) => !x.t.hidden.length)).join(', ')}`);
for (const x of h2.slice(0, 6)) say(`  e.g. ${x.t.seed} ${x.k}: shown ${J(x.p.shown).slice(0, 220)} | ref ${J(x.p.ref).slice(0, 220)}`);
const shutShown = all.filter((x) => !x.p.open && x.p.shown !== '#absent');
say(`  a page whose grouping is not proven open and prints a list: ${shutShown.length}`);
const mh = all.filter((x) => x.p.mh);
say(`THE MERCHANT-ARMY HOOK (pool served, stored had it, served != the served flag): ${mh.length} pages, towns ${towns_(mh).join(', ') || 'none'}; by setting ${bySet(mh)}; shortfall ${mh.filter((x) => x.p.ma === 1).length}, surplus ${mh.filter((x) => x.p.ma !== 1).length}`);
const rr = all.filter((x) => x.p.rr);
say(`RULING 88 (the writer over the served page != the writer with the record's own settle inputs): ${rr.length} of ${all.length} pages, towns ${towns_(rr).join(', ') || 'none'}; by setting ${bySet(rr)}`);
const red = h1.length + h2.length + mh.length + par;
say(`VERDICT: ${red ? `RED (HALF 1 ${h1.length}, HALF 2 ${h2.length}, hook ${mh.length}, parity ${par})` : 'GREEN (0 and 0, controls 0, hook 0, parity 0)'}`);
console.log(P.join('\n'));
process.exit(red ? 1 : 0);

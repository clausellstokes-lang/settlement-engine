// VEIL-52 (1)(a): the tables of snap.probe.jsx's shards.   node snap-an.mjs <outdir>   (EXIT 4 if a plant is served and not caught)
import { readdirSync, readFileSync } from 'node:fs';
const O = process.argv[2];
const S = readdirSync(O).filter((f) => /^snap-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')));
const J = (v) => JSON.stringify(v);
const merge = (k) => { const o = {}; for (const s of S) for (const [x, n] of Object.entries(s[k] || {})) o[x] = (o[x] || 0) + n; return o; };
const camps = S.flatMap((s) => s.campaigns);
console.log(`FORM ${S[0]?.meta.form} shards ${S.length} campaigns ${camps.length} (places ${camps.reduce((a, c) => a + c.seeds.length, 0)}, with a hideable house ${camps.reduce((a, c) => a + c.hidden, 0)}) g ${S[0]?.meta.g} ticks ${S[0]?.meta.ticks} plant ${S[0]?.meta.plant} | wall per shard ms ${J(S.map((s) => s.meta.ms))}`);
console.log(`READS ${S.reduce((a, s) => a + s.reads, 0)} | no world ${J(merge('noWorld'))} | publish ${J(merge('publishPath'))} | sections present (campaigns) ${J(merge('sectionsOn'))}`);
const wb = S.flatMap((s) => s.worldBytes).sort((a, b) => a - b); console.log(`WORLD BYTES min ${wb[0]} median ${wb[wb.length >> 1]} max ${wb[wb.length - 1]} | ticks run ${J([...new Set(camps.map((c) => c.ticks))])} | pulse errors ${S.reduce((a, s) => a + s.pulseErrors.length, 0)}`);
for (const e of S.flatMap((s) => s.pulseErrors).slice(0, 3)) console.log(`  PULSE ERROR ${J(e)}`);
const hits = {}; for (const s of S) for (const [k, v] of Object.entries(s.hits)) { const h = (hits[k] ||= { pat: v.pat, kind: v.kind, reads: 0, campaigns: {}, doors: {}, ex: v.ex }); h.reads += v.reads; Object.assign(h.campaigns, v.campaigns); for (const [d, n] of Object.entries(v.doors)) h.doors[d] = (h.doors[d] || 0) + n; }
const byKind = {}; for (const h of Object.values(hits)) { const b = (byKind[h.kind] ||= { paths: 0, reads: 0, campaigns: {} }); b.paths += 1; b.reads += h.reads; Object.assign(b.campaigns, h.campaigns); }
console.log(`HITS BY KIND ${J(Object.fromEntries(Object.entries(byKind).map(([k, b]) => [k, { paths: b.paths, reads: b.reads, campaigns: Object.keys(b.campaigns).length }])))}`);
for (const v of Object.values(hits).sort((a, b) => b.reads - a.reads)) console.log(`  HIT ${v.pat} [${v.kind}] reads ${v.reads} campaigns ${Object.keys(v.campaigns).length} doors ${J(v.doors)} | ex ${J(v.ex)}`);
console.log(`SECTIONS REFUSED BY THE SERVER'S OWN CHECK (campaigns) ${J(merge('sectionsRefused'))}`);
console.log(`PERSON HITS THE OLD SUBSTRING MATCH HAD AND THE WHOLE-WORD MATCH DOES NOT: ${J(merge('personSubstrOnly'))}`);
const pl = S.map((s) => s.plant).filter((p) => p.done);
let blind = 0;
for (const p of pl) { console.log(`PLANT ${p.campaign} house ${J(p.house)} person ${J(p.person)} | expect ${J(p.expect)} | caught ${J(p.caught)} | REFUSED BY THE SERVER ${J(p.refused || {})}`); for (const [k, n] of Object.entries(p.expect)) if ((p.caught[k] || 0) < n) blind += 1; }
if (S[0]?.meta.plant && !pl.length) console.log('PLANT NOT PLACED (no hideable house in the shard)');
console.log(`PLANT BLIND CELLS ${blind}`);
process.exit(blind ? 4 : 0);

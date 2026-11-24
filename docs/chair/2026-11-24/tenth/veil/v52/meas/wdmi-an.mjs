// VEIL-52 (1)(b): A COPY OF wd-an.mjs (b126c9813), + the plant's line (WD_PLANT=1). V43-MEASURE: the tables of one form's shards.   node wd-an.mjs <outdir>   (EXIT 3 on a map-member hit that is not the known fault)
import { readdirSync, readFileSync } from 'node:fs';
const O = process.argv[2];
const S = readdirSync(O).filter((f) => /^wd-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')));
const sum = (k) => S.reduce((a, s) => a + (s[k] || 0), 0);
const merge = (k) => { const o = {}; for (const s of S) for (const [x, n] of Object.entries(s[k] || {})) o[x] = (o[x] || 0) + n; return o; };
const first = (k) => { const o = {}; for (const s of S) for (const [x, v] of Object.entries(s[k] || {})) if (!o[x]) o[x] = v; return o; };
const J = (v) => JSON.stringify(v);
const places = S.flatMap((s) => s.places);
console.log(`FORM ${S[0]?.meta.form} shards ${S.length} places ${places.length} (hidden-house ${places.filter((p) => p.hidden).length}, controls ${places.filter((p) => !p.hidden).length}) | wall per shard ms ${J(S.map((s) => s.meta.ms))} | server ms ${J(S.map((s) => s.meta.srvMs))}`);
console.log(`READS ${sum('reads')} | HIDING ${sum('hiding')} on ${places.filter((p) => p.hidingReads).length} places | no document ${J(merge('noDoc'))}`);
console.log(`HIDING BY engine|door|Reveal ${J(merge('hidingBy'))}`);
const daily = {}; for (const s of S) for (const [k, v] of Object.entries(s.daily)) { daily[k] ||= { differ: 0, reads: 0 }; daily[k].differ += v.differ; daily[k].reads += v.reads; }
console.log('DAILY (deriveDailyLife(served, null) vs the never-there read, by slot: differ / hiding reads)');
for (const [k, v] of Object.entries(daily)) console.log(`  ${k.padEnd(22)} ${v.differ} / ${v.reads}`);
const pairs = first('dailyPairs');
for (const [k, v] of Object.entries(pairs)) console.log(`  PAIR ${k}: ${J(v.served)} | ${J(v.never)} | ${v.seed} ${v.setting} dm=${v.dm} ${v.eng} ${v.door}`);
console.log(`DAILY SIDE (after rederiveForPage): ${J(merge('dailyPage'))}`);
for (const [k, v] of Object.entries(first('dailyPagePairs'))) console.log(`  SIDE PAIR ${k}: ${J(v.served)} | ${J(v.never)} | ${v.seed} ${v.setting} dm=${v.dm} ${v.eng} ${v.door}`);
const off = { served: {}, never: {} }; let odiff = 0; let opair = null;
for (const s of S) { for (const [k, n] of Object.entries(s.office.hidingServed)) off.served[k] = (off.served[k] || 0) + n; for (const [k, n] of Object.entries(s.office.hidingNever)) off.never[k] = (off.never[k] || 0) + n; odiff += s.office.differ; opair ||= s.office.pair; }
console.log(`OFFICE LINES on hiding reads: served ${J(off.served)} | never-there ${J(off.never)} | differ ${odiff} ${opair ? `| PAIR ${J(opair)}` : ''} | L12 in the catalogue: ${S.some((s) => s.l12)}`);
console.log(`DM SLOT: in deriveDailyLife(served, null).slots ${S.reduce((a, s) => a + s.dmSlot.inSlots, 0)} | as a key in a served document ${S.reduce((a, s) => a + s.dmSlot.asKey, 0)} ${J(Object.assign({}, ...S.map((s) => s.dmSlot.keyPaths)))}`);
const ow = {}; for (const s of S) for (const [k, v] of Object.entries(s.ownerish)) { ow[k] ||= { n: 0, doors: {} }; ow[k].n += v.n; for (const [d, n] of Object.entries(v.doors)) ow[k].doors[d] = (ow[k].doors[d] || 0) + n; }
console.log(`OWNER-ISH KEYS in served documents (/audience|owner|^dm|_dm$|dmOnly|dm_only|dmLayer|isDm|gmOnly/i): ${Object.keys(ow).length}`);
for (const [k, v] of Object.entries(ow).sort((a, b) => b[1].n - a[1].n)) console.log(`  ${k} n=${v.n} ${J(v.doors)}`);
console.log(`NEVER-THERE records: ${sum('neverReads')} | still naming a withheld thing in their own strings: ${sum('neverDangling')}`);
console.log(`STORED vs BORN: same ${S.reduce((a, s) => a + s.storedVsBorn.same, 0)} differ ${S.reduce((a, s) => a + s.storedVsBorn.differ, 0)} ${J(S.flatMap((s) => s.storedVsBorn.diffSeeds).slice(0, 5))} | births with a neighborRelationship name: ${sum('neighbour')}`);
const names = {}; for (const s of S) for (const [k, v] of Object.entries(s.names)) { const n = (names[k] ||= { pat: v.pat, kind: v.kind, reads: 0, places: {}, doors: {}, ex: v.ex }); n.reads += v.reads; Object.assign(n.places, v.places); for (const [d, c] of Object.entries(v.doors)) n.doors[d] = (n.doors[d] || 0) + c; }
console.log(`NAMES: ${Object.keys(names).length} path patterns`);
for (const v of Object.values(names).sort((a, b) => b.reads - a.reads)) console.log(`  HIT ${v.pat} [${v.kind}] reads ${v.reads} places ${Object.keys(v.places).length} doors ${J(v.doors)} | ex ${J(v.ex)}`);
const mk = merge('mapKnown'); const mo = S.flatMap((s) => s.mapOther);
console.log(`MAP MEMBER: known fault (prominentRelationship / pressureSentence, Reveal off) ${J(mk)} | OTHER ${mo.length}`);
for (const x of mo.slice(0, 20)) console.log(`  MAP OTHER ${J(x)}`);
const pl = S.map((s) => s.plant).filter((p) => p && p.done);
for (const p of pl) console.log(`PLANT ${J(p.seed)} ${J(p.text)} | hiding reads ${J(p.reads)} | present ${J(p.present)} | caught ${J(p.caught)} | BLIND ${J(p.blind)}`);
if (!pl.length) console.log('PLANT none (WD_PLANT unset or no hideable house in the shard)');
process.exit(pl.some((p) => Object.keys(p.blind).length) ? 4 : mo.length ? 3 : 0);

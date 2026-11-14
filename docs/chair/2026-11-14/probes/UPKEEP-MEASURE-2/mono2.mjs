// UPKEEP-MEASURE-2: THE MONOTONICITY PROBE, widened from the reader's mono.mjs (whose own set it still marks, `r:1`).
//   ADD:     EVERY catalogue house (not only those that open a scaled part) written at the place's tier or one tier
//            around, added alone, with its catalogue row's category, tags and baseChance (as mono.mjs writes it).
//   ENLARGE: every house on the roster renamed to each next greater name of ANY ladder pair of UPGRADE_CHAINS (the
//            reader's: only pairs sharing a scaled job; ours marks those `r:1`).
// The record is otherwise untouched; defence is re-read by the tree's generateDefenseProfile at the record's own keep.
//   TREE=<tree> node mono2.mjs <record_dir> <seedlist> <out.ndjson> [shard] [shards]
// Out: one row per change with a fall: {seed,tier,kind,house,to,r,falls:{score:[before,after]}}; last line {"done":..}
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE;
const { generateDefenseProfile } = await import(T + '/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T + '/src/domain/facts/keep.js');
const { getInstFlags } = await import(T + '/src/generators/priorityHelpers.js');
const { defenseTraditionNamesOf } = await import(T + '/src/domain/institutions/defenseInstitutionBuckets.js');
const { isFabricInstitution, institutionalCatalog } = await import(T + '/src/data/institutionalCatalog.js');
const { UPGRADE_CHAINS } = await import(T + '/src/data/institutionLadders.js');
const SCALED_PARTS = {
  garrison: (i) => i.hasGarrison, militia: (i) => i.hasMilitia, watch: (i) => i.hasWatch, court: (i) => i.hasCourtSystem,
  prison: (i) => i.hasPrison, wardens: (_, n) => n.wardens, company: (i) => i.hasMercenary, charter: (i) => i.hasCharterHall,
  clergy: (_, n) => n.divine, druids: (_, n) => n.druid, market: (i) => i.hasMarket, hospital: (i) => i.hasHospital,
  alchemists: (_, n) => n.alchemy };
const jobsOf = (house) => { const one = [house]; const { inst } = getInstFlags({}, one); const names = defenseTraditionNamesOf(one.filter((i) => !isFabricInstitution(i))); return Object.keys(SCALED_PARTS).filter((id) => SCALED_PARTS[id](inst, names)); };
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rowOf = {}; for (const t of TIERS) for (const [shelf, rows] of Object.entries(institutionalCatalog[t] || {})) for (const [n, row] of Object.entries(rows || {})) (rowOf[n] ||= {})[t] = { ...row, category: shelf };
const allNames = Object.keys(rowOf);
const scaledSet = new Set(allNames.filter((n) => jobsOf({ name: n }).length));
const greaterOf = {}; const readerPair = new Set();
for (const [l, g] of UPGRADE_CHAINS) {
  (greaterOf[l.toLowerCase()] ||= []).push(g);
  const jl = jobsOf({ name: l }), jg = jobsOf({ name: g }); if (jl.some((j) => jg.includes(j))) readerPair.add(`${l.toLowerCase()}>${g}`);
}
const SC = ['military', 'monster', 'internal', 'economic', 'magical'];
const scoresOf = (s) => { const p = generateDefenseProfile(s, keepOfRecord(s.economicState)); const o = {}; for (const k of SC) o[k] = p.scores[k]; o.readiness = p.readiness.score; return o; };
const [dir, seedfile, outf, shardArg = '0', shardsArg = '1'] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg);
const out = fs.createWriteStream(outf); let tried = 0, falls = 0, triedR = 0;
const seeds = fs.readFileSync(seedfile, 'utf8').trim().split('\n');
for (let q = shard; q < seeds.length; q += shards) {
  const seed = seeds[q];
  const f = `${dir}/${seed}.json.gz`; if (!fs.existsSync(f)) continue;
  const s = JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
  const s0 = scoresOf(s);
  const rec = (kind, house, to, r, s1) => { tried++; if (r) triedR++; const d = {}; for (const k of Object.keys(s0)) if (s1[k] < s0[k]) d[k] = [s0[k], s1[k]];
    if (Object.keys(d).length) { falls++; out.write(JSON.stringify({ seed, tier: s.tier, kind, house, to, r: r ? 1 : 0, falls: d }) + '\n'); } };
  (s.institutions || []).forEach((h, i) => { for (const g of greaterOf[String(h.name).toLowerCase()] || []) {
    const s1 = { ...s, institutions: s.institutions.map((x, j) => (j === i ? { ...x, name: g } : x)) };
    rec('enlarge', h.name, g, readerPair.has(`${String(h.name).toLowerCase()}>${g}`), scoresOf(s1)); } });
  const ti = TIERS.indexOf(s.tier); const near = new Set(TIERS.slice(Math.max(0, ti - 1), ti + 2));
  const have = new Set((s.institutions || []).map((h) => String(h.name).toLowerCase()));
  for (const n of allNames) { if (have.has(n.toLowerCase())) continue; const tt = Object.keys(rowOf[n]).find((t) => near.has(t)); if (!tt) continue;
    const row = rowOf[n][tt]; const s1 = { ...s, institutions: [...(s.institutions || []), { name: n, category: row.category, tags: row.tags || [], baseChance: row.baseChance }] };
    rec('add', null, n, scaledSet.has(n), scoresOf(s1)); }
}
out.write(JSON.stringify({ done: true, tried, triedReaderSet: triedR, falls, catalogueNames: allNames.length, scaledNames: scaledSet.size }) + '\n');
out.end();

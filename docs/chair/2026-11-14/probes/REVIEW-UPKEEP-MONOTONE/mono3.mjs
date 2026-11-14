// REVIEW-UPKEEP-MONOTONE 8(a): the claim tried on MADE RECORDS of the reviewer's own, beyond the measuring seat's mono2.mjs.
// For each born record and each VARIANT (the record's config or roster bent to a hard case), every catalogue house written at
// the place's tier or one around is added alone, and every roster house renamed to each greater name of any UPGRADE_CHAINS pair;
// defence re-read by the tree's generateDefenseProfile at the record's own keep. A row per change with a fall.
//   TREE=<tree> node mono3.mjs <record_dir> <seedlist> <out.ndjson> [shard] [shards] [variants comma list]
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE;
const { generateDefenseProfile } = await import(T + '/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T + '/src/domain/facts/keep.js');
const { institutionalCatalog } = await import(T + '/src/data/institutionalCatalog.js');
const { UPGRADE_CHAINS } = await import(T + '/src/data/institutionLadders.js');
const { partitionDefenseInstitutions } = await import(T + '/src/domain/institutions/defenseInstitutionBuckets.js');
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rowOf = {}; for (const t of TIERS) for (const [shelf, rows] of Object.entries(institutionalCatalog[t] || {})) for (const [n, row] of Object.entries(rows || {})) (rowOf[n] ||= {})[t] = { ...row, category: shelf };
const allNames = Object.keys(rowOf);
const greaterOf = {}; for (const [l, g] of UPGRADE_CHAINS) (greaterOf[l.toLowerCase()] ||= []).push(g);
const CRIME = /fence|smuggl|gang|outlaw|thieves|black market|assassin|crime|cutthroat|bandit|pirate|brothel|gambling/i;
const SC = ['military', 'monster', 'internal', 'economic', 'magical'];
const scoresOf = (s) => { const p = generateDefenseProfile(s, keepOfRecord(s.economicState)); const o = {}; for (const k of SC) o[k] = p.scores[k]; o.readiness = p.readiness.score; return o; };
const withStress = (s, types) => ({ ...s, stress: types.map((type) => ({ type })), config: { ...s.config, stressTypes: types } });
const withCfg = (s, c) => ({ ...s, config: { ...s.config, ...c } });
const defenceNames = (s) => { const p = partitionDefenseInstitutions(s.institutions || []); return new Set(Object.values(p).flat().map((h) => h?.name).filter(Boolean)); };
const VARIANTS = {
  born: (s) => s,
  siegeFamine: (s) => withStress(s, ['under_siege', 'famine']),
  monsterPlague: (s) => withStress(s, ['monster_pressure', 'plague_onset']),
  occupiedWar: (s) => withStress(s, ['occupied', 'wartime', 'indebted']),
  allCrises: (s) => withStress(s, ['under_siege', 'famine', 'occupied', 'plague_onset', 'succession_void', 'politically_fractured', 'recently_betrayed', 'indebted', 'infiltrated', 'monster_pressure', 'wartime']),
  dialsHigh: (s) => withCfg(s, { priorityMagic: 100, priorityReligion: 100, priorityMilitary: 100, priorityCriminal: 100 }),
  dialsGate: (s) => withCfg(s, { priorityMagic: 55, priorityReligion: 65, priorityMilitary: 5, priorityCriminal: 0 }),
  harsh: (s) => withCfg(s, { terrainType: 'mountain', tradeRouteAccess: 'isolated', monsterThreat: 'plagued', neighborRelationship: { relationshipType: 'hostile' } }),
  tinyPop: (s) => ({ ...s, population: 9 }),
  bare: (s) => { const d = defenceNames(s); return { ...s, institutions: (s.institutions || []).filter((h) => !d.has(h.name)) }; },
  hiredOnly: (s) => { const d = defenceNames(s); const r = (s.institutions || []).filter((h) => !d.has(h.name)); const row = rowOf['Free company hall'] ? Object.values(rowOf['Free company hall'])[0] : null; return { ...s, institutions: [...r, { name: 'Free company hall', category: row?.category || 'defense', tags: row?.tags || [], baseChance: row?.baseChance }] }; },
};
const [dir, seedfile, outf, shardArg = '0', shardsArg = '1', vlist = Object.keys(VARIANTS).join(',')] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg);
const out = fs.createWriteStream(outf); const tried = {}, falls = {};
const seeds = fs.readFileSync(seedfile, 'utf8').trim().split('\n');
for (let q = shard; q < seeds.length; q += shards) {
  const seed = seeds[q];
  const f = `${dir}/${seed}.json.gz`; if (!fs.existsSync(f)) continue;
  const born = JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
  for (const v of vlist.split(',')) {
    const s = VARIANTS[v](born);
    let s0; try { s0 = scoresOf(s); } catch (e) { out.write(JSON.stringify({ seed, v, error: String(e) }) + '\n'); continue; }
    const rec = (kind, house, to, s1) => { tried[v] = (tried[v] || 0) + 1; const d = {}; for (const k of Object.keys(s0)) if (s1[k] < s0[k]) d[k] = [s0[k], s1[k]];
      if (Object.keys(d).length) { falls[v] = (falls[v] || 0) + 1; out.write(JSON.stringify({ seed, v, tier: s.tier, kind, house, to, crime: CRIME.test(to) ? 1 : 0, falls: d }) + '\n'); } };
    (s.institutions || []).forEach((h, i) => { for (const g of greaterOf[String(h.name).toLowerCase()] || []) {
      rec('enlarge', h.name, g, scoresOf({ ...s, institutions: s.institutions.map((x, j) => (j === i ? { ...x, name: g } : x)) })); } });
    const ti = TIERS.indexOf(s.tier); const near = new Set(TIERS.slice(Math.max(0, ti - 1), ti + 2));
    const have = new Set((s.institutions || []).map((h) => String(h.name).toLowerCase()));
    for (const n of allNames) { if (have.has(n.toLowerCase())) continue; const tt = Object.keys(rowOf[n]).find((t) => near.has(t)); if (!tt) continue;
      const row = rowOf[n][tt];
      rec('add', null, n, scoresOf({ ...s, institutions: [...(s.institutions || []), { name: n, category: row.category, tags: row.tags || [], baseChance: row.baseChance }] })); }
  }
}
out.write(JSON.stringify({ done: true, tried, falls, catalogueNames: allNames.length }) + '\n');
out.end();

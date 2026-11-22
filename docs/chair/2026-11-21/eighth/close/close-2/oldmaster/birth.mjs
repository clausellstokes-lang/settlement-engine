// usage: node birth.mjs <tree> <out.json> [dumpKeysFile dumpOut.json]
import { createHash } from 'node:crypto';
import { writeFileSync, readFileSync } from 'node:fs';
const [tree, outPath, dumpKeysFile, dumpOut] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(`${tree}/src/generators/generateSettlementPipeline.js`);
const { goldenCorpus, keyOf } = await import(`${tree}/tests/helpers/goldenMasterCorpus.js`);
const manifest = JSON.parse(readFileSync(`${tree}/tests/fixtures/generator-golden-master.json`, 'utf8'));
const h = (x) => createHash('sha256').update(x === undefined ? '<undefined>' : JSON.stringify(x)).digest('hex');
const dumpKeys = dumpKeysFile ? new Set(JSON.parse(readFileSync(dumpKeysFile, 'utf8'))) : null;
const rows = goldenCorpus();
const out = {}; const dumps = {};
let match = 0; const t0 = Date.now();
for (const c of rows) {
  const k = keyOf(c);
  const { _seed, ...cfg } = c;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  const full = createHash('sha256').update(JSON.stringify(s)).digest('hex');
  if (manifest[k] === full) match++;
  const fields = {};
  for (const f of Object.keys(s)) fields[f] = h(s[f]).slice(0, 16);
  const ps = s.powerStructure || {};
  const st = Array.isArray(s.stress) ? s.stress.map((x) => x?.type) : s.stress?.type ?? null;
  out[k] = {
    full, manifestMatch: manifest[k] === full, fields,
    facts: {
      name: s.name, settType: c.settType, population: s.population,
      prosperity: s.economicState?.prosperity,
      factions: (ps.factions || []).map((f) => [f.faction, f.power]),
      governing: (ps.factions || []).find((f) => f.isGoverning)?.faction ?? ps.governingName ?? null,
      government: ps.government ?? null,
      npcs: (s.npcs || []).length, stress: st,
    },
  };
  if (dumpKeys && dumpKeys.has(k)) dumps[k] = s;
}
writeFileSync(outPath, JSON.stringify(out));
if (dumpKeys) writeFileSync(dumpOut, JSON.stringify(dumps, null, 1));
console.log(`rows=${rows.length} manifestMatch=${match} secs=${((Date.now() - t0) / 1000).toFixed(1)}`);

// UPKEEP-CAPACITY: THE GOLDEN CORPUS BY MEASURE (no golden's door is opened). Per row of tests/helpers/
// goldenMasterCorpus.js :: goldenCorpus, born as the golden tests bear it (pipelinePinnedMode.test.js: the config's
// _seed as the seed, customContent {}), the sha256 of the whole record and of its defence profile.
//   node goldens.mjs <tree> <out.ndjson>
import { createWriteStream } from 'node:fs';
import { createHash } from 'node:crypto';
const [R, out] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(`${R}/src/generators/generateSettlementPipeline.js`);
const { goldenCorpus, keyOf } = await import(`${R}/tests/helpers/goldenMasterCorpus.js`);
const { loadGenerationLawPayloads } = await import(`${R}/src/domain/density/densityCreateBoundary.js`);
await loadGenerationLawPayloads();
const h = (x) => createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const o = createWriteStream(out);
for (const config of goldenCorpus()) {
  const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  o.write(JSON.stringify({ key: keyOf(config), all: h(s), def: h(s.defenseProfile), pow: h(s.powerStructure), score: s.defenseProfile?.readiness?.score, band: s.defenseProfile?.readiness?.label }) + '\n');
}
o.end();

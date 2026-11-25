// node xcount.mjs <srcTree> <findTree> <plan.json> <runDir> <out.json> : re-read a battery render's printed views (stored
// by --views) with ANOTHER tree's pageCensusFindings. The town is re-born on srcTree exactly as the battery's renderer
// does (birthConfig, generateSettlementPipeline, withPublicProse(composePublicProse)). With findTree = srcTree this must
// reproduce the stored rows (the self-check, reported as `selfMismatch`).
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const [src, fnd, planFile, dir, out] = process.argv.slice(2);
const S = `${src}/src/`;
const pipe = await import(S + 'generators/generateSettlementPipeline.js');
const pub = await import(S + 'domain/display/publicProse.js');
const ppc = await import(S + 'components/new/publicProseCompose.js');
const dens = await import(S + 'domain/density/densityCreateBoundary.js');
const find = await import(`${fnd}/src/domain/coherence/pageCensusFindings.js`);
await dens.loadGenerationLawPayloads();
const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const counts = {}; const per = {}; let recMismatch = 0; let selfMismatch = 0;
for (const row of JSON.parse(readFileSync(planFile, 'utf8'))) {
  const r = JSON.parse(readFileSync(`${dir}/rows/${row.seed}.json`, 'utf8'));
  let town = pipe.generateSettlementPipeline(dens.birthConfig(row.config), null, { seed: row.seed, customContent: {} });
  if (sha(town) !== r.recordHash) recMismatch++;
  town = pub.withPublicProse(town, ppc.composePublicProse(town));
  const rows = [...new Set(find.pageCensusFindings(town, r.printed).map((f) => f.row))].sort();
  if (src === fnd && JSON.stringify(rows) !== JSON.stringify(r.rows)) selfMismatch++;
  per[row.seed] = rows;
  for (const x of rows) (counts[x] ||= {})[row.size] = (counts[x][row.size] || 0) + 1;
}
writeFileSync(out, JSON.stringify({ src, find: fnd, rowsKnown: Object.keys(find.PAGE_CENSUS_ROWS), counts, per, recMismatch, selfMismatch }));
console.log(`xcount: ${Object.keys(per).length} births; record-hash mismatches ${recMismatch}; self mismatches ${selfMismatch}; rows ${JSON.stringify(Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, Object.values(v).reduce((a, b) => a + b, 0)])))}`);

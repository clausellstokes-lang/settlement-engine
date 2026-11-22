#!/usr/bin/env node
// FORTUNE-7 unit 0(c): the LASTING draft's governance paragraphs, rendered on a SCRATCH PLANT tree (never committed):
// `fortuneMerits.js :: meritsOf` adds 'lasting' (history.age >= the p90 of `tier ?? config.settType`, the same gates), and
// `governanceAccount.js` pushes the draft line, marked «…», directly after the standing (and the weathered) sentence.
// The candidates are the seeds whose age reaches the p90 in age-run.mjs's lit file, plus hxd-metropolis-73.
// usage: node draft-pages.mjs <plant-tree> <lines.json> <age-C.jsonl> <out.txt>
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const [treeArg, linesPath, agesPath, out] = process.argv.slice(2);
const T = resolve(treeArg);
globalThis.PLANT_LASTING_LINES = JSON.parse(readFileSync(linesPath, 'utf8'));
const P90 = JSON.parse(process.env.PLANT_P90 || '{"thorp":269,"hamlet":108,"village":225,"town":276,"city":441,"metropolis":731}');
const imp = (p) => import(join(T, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { governanceAccountOf, governanceStressTypesOf } = await imp('src/domain/display/governanceAccount.js');
const { resolvePrimaryStress } = await imp('src/generators/stressPriority.js');
const { meritsOf } = await imp('src/domain/fortune/fortuneMerits.js');
const { createCustomContentSlice } = await imp('src/store/customContentSlice.js');
const { settlementContentRuntimeOptions } = await imp('src/store/settlementContentRuntime.js');
const { eligibleCustomContent } = await imp('src/domain/customContentSchema.js');
const { contentRuntimeFromCampaignBinding } = await imp('src/domain/content/contentEnvironment.js');
// lit-run.mjs :: visitorJob, verbatim in effect: the config and the store's content runtime at rest
const visitorJob = (size, seed) => {
  const config = { ...DEFAULT_CONFIG, settType: size, _institutionToggles: {}, _categoryToggles: {}, _goodsToggles: {}, _servicesToggles: {}, _randomizePriorities: true };
  let st;
  const slice = createCustomContentSlice(() => {}, () => st);
  st = { ...slice, activeCampaignId: null, campaigns: [], config: { ...DEFAULT_CONFIG, settType: size }, configExplicitFields: {} };
  return { seed, config, options: settlementContentRuntimeOptions(st, contentRuntimeFromCampaignBinding, eligibleCustomContent) };
};
const { toPublicSafe } = await imp('src/domain/display/publicSafe.js');
await loadGenerationLawPayloads();
const rows = readFileSync(agesPath, 'utf8').trim().split('\n').slice(1).map((l) => JSON.parse(l)).filter((r) => r.age >= P90[r.size]);
const jobs = rows.map((r) => visitorJob(r.size, r.seed));
jobs.push({ seed: 'hxd-metropolis-73', config: { ...DEFAULT_CONFIG, settType: 'metropolis' }, options: { customContent: {} } });
const para = (rec) => governanceAccountOf(rec, { primaryStress: resolvePrimaryStress(governanceStressTypesOf(rec)) })?.text ?? '(no paragraph)';
const lines = [];
const counts = { lastingOnly: 0, both: 0, captured: 0, ageReached: rows.length };
for (const { seed, config, options } of jobs) {
  const size = config.settType;
  const rec = generateSettlementPipeline({ ...birthConfig(config), _fortuneLawVersion: 2 }, null, { seed, ...options });
  const m = meritsOf(rec);
  if (!m.includes('lasting')) continue;
  const cap = ['corrupted', 'capture'].includes(rec.powerStructure?.criminalCaptureState);
  const kind = m.includes('weathered') ? 'BOTH' : 'LASTING ONLY';
  if (kind === 'BOTH') counts.both += 1; else counts.lastingOnly += 1;
  if (cap) counts.captured += 1;
  const leg = rec.powerStructure.publicLegitimacy;
  lines.push(`== ${rec.name} | ${seed} | ${size} | age ${rec.history.age} | ${leg.label} ${leg.score} (merits +${leg.breakdown?.merits ?? 0}) | ${kind}${cap ? ' | CAPTURED HALL (' + rec.powerStructure.criminalCaptureState + ')' : ''}`);
  const own = para(rec);
  const shared = para(toPublicSafe(rec));
  lines.push(`OWNER: ${own}`);
  lines.push(own === shared ? 'SHARED: identical' : `SHARED: ${shared}`);
}
lines.unshift(`wording ${process.env.PLANT_WORDING || '(mixed pick)'}; seeds at or above the p90: ${counts.ageReached}; merited lasting only ${counts.lastingOnly}, both ${counts.both}, captured halls among them ${counts.captured}`);
writeFileSync(out, lines.join('\n') + '\n');
console.log(lines[0]);

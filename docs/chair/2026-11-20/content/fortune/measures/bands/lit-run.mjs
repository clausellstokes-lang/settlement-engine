#!/usr/bin/env node
// FORTUNE-6 lit re-measure (scratch instrument; changes nothing under src/ or tests/). The visitor's pool is
// measure-lit.mjs :: visitorJob (origin/lane/seat-6-2026-11-20), copied; seeds visitor-<size>-0..149, as BANDS.md.
// usage: node lit-run.mjs <tree> <state> <force-json> <out.jsonl>
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const [treeArg, state, forceJson, out] = process.argv.slice(2);
const T = resolve(treeArg);
const imp = (p) => import(join(T, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { createCustomContentSlice } = await imp('src/store/customContentSlice.js');
const { settlementContentRuntimeOptions } = await imp('src/store/settlementContentRuntime.js');
const { eligibleCustomContent } = await imp('src/domain/customContentSchema.js');
const { contentRuntimeFromCampaignBinding } = await imp('src/domain/content/contentEnvironment.js');
const FORCE = JSON.parse(forceJson);
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const visitorJob = (size, i) => {
  const config = { ...DEFAULT_CONFIG, settType: size, _institutionToggles: {}, _categoryToggles: {}, _goodsToggles: {}, _servicesToggles: {}, _randomizePriorities: true };
  let st;
  const slice = createCustomContentSlice(() => {}, () => st);
  st = { ...slice, activeCampaignId: null, campaigns: [], config: { ...DEFAULT_CONFIG, settType: size }, configExplicitFields: {} };
  const runtime = settlementContentRuntimeOptions(st, contentRuntimeFromCampaignBinding, eligibleCustomContent);
  return { size, seed: `visitor-${size}-${i}`, config, options: runtime };
};
const lines = [JSON.stringify({ meta: { state, tree: T, force: FORCE } })];
let errors = 0;
for (const size of SIZES) for (let i = 0; i < 150; i += 1) {
  const job = visitorJob(size, i);
  const rec = { seed: job.seed, size };
  try {
    const t = generateSettlementPipeline({ ...birthConfig(job.config), ...FORCE }, null, { seed: job.seed, ...job.options });
    const leg = t.powerStructure?.publicLegitimacy;
    rec.label = leg?.label ?? null; rec.score = leg?.score ?? null;
    rec.merits = leg?.breakdown?.merits ?? null;
    rec.calm = !t.stress; rec.tier = t.tier; rec.law = t.config?._fortuneLawVersion ?? null;
    rec.rp = t.config?._randomizePriorities === true;
  } catch (e) { errors += 1; rec.error = String(e?.stack || e).split('\n').slice(0, 3).join(' | '); }
  lines.push(JSON.stringify(rec));
}
writeFileSync(out, lines.join('\n') + '\n');
console.log(`state ${state}: ${lines.length - 1} births, ${errors} errors -> ${out}`);

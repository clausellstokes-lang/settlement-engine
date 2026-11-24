#!/usr/bin/env node
// FORTUNE-7 unit 4 (the chair's E90): THE DARK PROOF. Births with NO law marker (the dial at the default), the visitor's
// pool (lit-run.mjs :: visitorJob), each record's bytes hashed WITH the config `birthConfig` gave it; one sha256 over
// all of them in seed order. Equal hashes at two trees = every dark birth byte-identical. Read-only.
// usage: node dark-hash.mjs <tree> <per-size> <out.txt>
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
const [treeArg, nArg, out] = process.argv.slice(2);
const T = resolve(treeArg);
const N = Number(nArg) || 150;
const imp = (p) => import(join(T, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { createCustomContentSlice } = await imp('src/store/customContentSlice.js');
const { settlementContentRuntimeOptions } = await imp('src/store/settlementContentRuntime.js');
const { eligibleCustomContent } = await imp('src/domain/customContentSchema.js');
const { contentRuntimeFromCampaignBinding } = await imp('src/domain/content/contentEnvironment.js');
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const all = createHash('sha256');
const lines = [];
let births = 0; let errors = 0;
for (const size of SIZES) for (let i = 0; i < N; i += 1) {
  const config = { ...DEFAULT_CONFIG, settType: size, _institutionToggles: {}, _categoryToggles: {}, _goodsToggles: {}, _servicesToggles: {}, _randomizePriorities: true };
  let st;
  const slice = createCustomContentSlice(() => {}, () => st);
  st = { ...slice, activeCampaignId: null, campaigns: [], config: { ...DEFAULT_CONFIG, settType: size }, configExplicitFields: {} };
  const seed = `visitor-${size}-${i}`;
  try {
    const born = birthConfig(config);
    const rec = generateSettlementPipeline(born, null, { seed, ...settlementContentRuntimeOptions(st, contentRuntimeFromCampaignBinding, eligibleCustomContent) });
    const bytes = JSON.stringify({ config: born, record: rec });
    const h = createHash('sha256').update(bytes).digest('hex');
    all.update(`${seed}:${h}\n`);
    lines.push(`${seed} ${h}`);
    births += 1;
  } catch (e) { errors += 1; lines.push(`${seed} ERROR ${String(e).slice(0, 80)}`); }
}
const head = `births ${births}, errors ${errors}, sha256 ${all.digest('hex')}`;
writeFileSync(out, `${head}\n${lines.join('\n')}\n`);
console.log(head);

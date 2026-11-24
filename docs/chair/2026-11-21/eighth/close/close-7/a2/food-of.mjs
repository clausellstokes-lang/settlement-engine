// A2 (CLOSE-7): node food-of.mjs <tree> <plan.json> <out.jsonl> — per birth: the production band, the printed food band
// (famineOf(r).shownBand, the `food` atom), the prosperity, and the three Daily Life slots' texts (owner's tab). Writes nothing else.
import { writeFileSync } from 'node:fs';
import { readFileSync } from 'node:fs';
const [tree, planFile, out] = process.argv.slice(2);
const R = `${tree}/src/`;
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { deriveDailyLife } = await import(R + 'domain/dailyLife.js');
const { deriveAllCapacities } = await import(R + 'domain/capacityModel.js');
const { famineOf } = await import(R + 'domain/facts/famine.js');
await loadGenerationLawPayloads();
const plan = JSON.parse(readFileSync(planFile, 'utf8'));
const lines = [];
for (const { seed, size, config } of plan) {
  const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
  const slots = deriveDailyLife(s, { audience: 'owner' }).slots;
  const t = (k) => String(slots[k]?.text || '');
  lines.push(JSON.stringify({ seed, size, prod: deriveAllCapacities(s).capacities.food_production.band, printed: famineOf(s).shownBand,
    prosperity: s.economicState?.prosperity ?? null, market: null,
    food_culture: t('food_culture'), commoner_resentments: t('commoner_resentments'), outsider_impressions: t('outsider_impressions'), dawn_work: t('dawn_work') }));
}
writeFileSync(out, lines.join('\n') + '\n');
console.log(`food-of: ${lines.length} births from ${tree}`);

import { appendFileSync } from 'node:fs';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { economicSurvivalBandOf } from 'TREE/src/domain/display/defenseScoreBands.js';
import { standingLabelOf } from 'TREE/src/domain/facts/keep.js';
import { purseWordOfBand } from 'TREE/src/generators/safetyProfile.js';
import { factsOf } from 'TREE/src/domain/facts/factsOf.js';
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    const town = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const band = economicSurvivalBandOf(town);
    appendFileSync(out, JSON.stringify({ seed: row.seed, band, purse: purseWordOfBand(band, standingLabelOf(town.economicState)), rung: factsOf(town).prosperity, guard: town.economicState?.safetyProfile?.guardEffectivenessDesc?.slice(0, 400) }) + '\n');
  }
}

// node mossgate.mjs <tree> — Mossgate's twenty forks as foundingWorldBones.test.js makes them: the ruler and its kind, and
// whether a power named Religious Authorities stands
import path from 'node:path';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { SAMPLE_SETTLEMENTS, forkConfigFor, forkSeedFor } = await imp('src/data/sampleSettlements.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const sample = SAMPLE_SETTLEMENTS.find((s) => s.id === 'sample-mossgate');
for (let i = 0; i < 20; i++) {
  const seed = String(forkSeedFor(sample, `f${String(i).padStart(2, '0')}x${((i * 2654435761) >>> 0).toString(16)}`));
  const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...forkConfigFor(sample) }), null, { seed, customContent: {} });
  const fs_ = s.powerStructure.factions;
  console.log(i, fs_.some((f) => f.faction === 'Religious Authorities') ? 'RA  ' : 'none', fs_.map((f) => `${f.isGoverning ? '*' : ''}${f.faction}(${f.category || ''})`).join(', '));
}

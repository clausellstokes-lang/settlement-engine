import { makeCfgFor } from './seedcfg.mjs';
const R = process.env.TREE + '/src';
const { generateSettlementPipeline } = await import(R + '/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + '/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + '/store/configSlice.js');
const { resolveGenerationContentProfile } = await import(R + '/domain/generationContentProfile.js');
await loadGenerationLawPayloads();
const seed = process.argv[2]; const s = generateSettlementPipeline(makeCfgFor(birthConfig, DEFAULT_CONFIG)(seed), null, { seed, customContent: {} });
console.log(seed, s.tier, s.config?.contentProfile, JSON.stringify(resolveGenerationContentProfile(s.config).boundaries), (Array.isArray(s.stress)?s.stress:[s.stress]).map(x=>x?.type));

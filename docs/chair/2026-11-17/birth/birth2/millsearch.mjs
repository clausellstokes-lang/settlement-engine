import { makeCfgFor } from '/tmp/claude-0/-home-user-settlement-engine/7fbb7bd1-852b-5533-9ec2-2daf0e27f457/scratchpad/pc/seedcfg.mjs';
const R = process.env.TREE + '/src';
const { generateSettlementPipeline } = await import(R + '/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + '/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + '/store/configSlice.js');
const HI = await import(R + '/domain/facts/houseInputAtHand.js');
await loadGenerationLawPayloads(); const cfgFor = makeCfgFor(birthConfig, DEFAULT_CONFIG);
const [prefix, from, to] = process.argv.slice(2);
for (let i = Number(from); i < Number(to); i++) { const seed = `${prefix}-${i}`;
  const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
  const mill = (s.economicState?.activeChains || []).find((c) => c?.chainId === 'river_milling');
  if (mill && (mill.outputs || []).includes('Fulled cloth') && HI.housesShortOf(s).get('Fuller') === 'wool') console.log('HIT', seed); }
console.log('done', prefix);

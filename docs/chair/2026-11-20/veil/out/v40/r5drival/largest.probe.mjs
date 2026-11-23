// R5D-RIVAL (VEIL-40): the cost law's input, by R5D-SQL-2's recipe (out/v37/r5dsql2/r5dsql2.probe.jsx, "(1) THE BORN READS"): its
// 72 births in its order (N=6: thorp..metropolis x calm, infiltrated; seeds v11-ties-<size>-<stress|calm>-<i>), each with its
// publicProse composed, and the LARGEST BORN METROPOLIS (its stored text) written with the default veil record to
// R5DRV_COST_OUT/largest-metropolis.json for cost.mjs. A measure input: it reads no database and changes nothing.
//   RV6_SRC=<tree> RV9_PROBE=<this file> R5DRV_COST_OUT=<dir> npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs --maxWorkers=1
import { it, expect } from 'vitest';
import { writeFileSync } from 'node:fs';

it('the largest born metropolis of R5D-SQL-2\'s 72 births', async () => {
  const SRC = process.env.RV6_SRC; const OUT = process.env.R5DRV_COST_OUT;
  expect(SRC && OUT).toBeTruthy();
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const DEFAULT_OV = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
  const births = [];
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) for (let i = 0; i < 6; i += 1) births.push([settType, stress, `v11-ties-${settType}-${stress || 'calm'}-${i}`]);
  let largest = null;
  for (const [settType, stress, seed] of births) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let born; try { born = gen(density.birthConfig(cfg), null, { seed, customContent: {} }); } catch { continue; }
    const rec = clone({ ...born, publicProse: compose(born) });
    if (settType === 'metropolis') { const len = JSON.stringify(rec).length; if (!largest || len > largest.len) largest = { seed, len, rec }; }
  }
  expect(largest).toBeTruthy();
  writeFileSync(`${OUT}/largest-metropolis.json`, JSON.stringify({ seed: largest.seed, length: largest.len, record: largest.rec, defaultVeil: DEFAULT_OV }));
}, 3_600_000);

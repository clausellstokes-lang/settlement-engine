// VEIL-V102: the thorp seed's criminal parts (the born guard's premise check).
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
it('thorp', async () => {
  const veil = await import(`${process.cwd()}/src/domain/display/galleryVeil.js`);
  const sw = await import(`${process.cwd()}/src/domain/display/criminalVeilSwitch.js`);
  const { generateSettlementPipeline } = await import(`${process.cwd()}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${process.cwd()}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${process.cwd()}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = [];
  for (const settType of ['thorp', 'hamlet']) for (let i = 0; i < 8; i += 1) {
    const A = JSON.parse(JSON.stringify(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType }), null, { seed: `v102-${settType}-${i}`, customContent: {} })));
    for (const dm of [false, true]) {
      const pub = veil.galleryPayloadFor(A, { shareDm: dm }); const m = veil.curateModelFor(pub, []);
      out.push(`v102-${settType}-${i} dm=${dm}: ${sw.criminalPartsOf(m.defaults, [], sw.presentCriminalGroupings(pub), m).join(' ')}`);
    }
  }
  writeFileSync(process.env.V102_OUT, out.join('\n'));
}, 600000);

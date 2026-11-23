// VEIL-VR17: on born towns of a tree's own generator, every tier, a browser's dials: are safetyProfile.criminalInstitutions
// and .crimeTypes both arrays (the evidence the Defense block's grouping is open)? Prints the count.
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
it('arrays', async () => {
  const SRC = process.env.VR17_SRC;
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const D = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  let n = 0, both = 0, noSp = 0; const odd = [];
  for (const settType of tiers) for (let i = 0; i < Number(process.env.VR17_N || 10); i++) {
    const raw = JSON.parse(JSON.stringify(gen({ ...D, settType }, null, { seed: `vr17-arrays-${settType}-${i}`, customContent: {} })));
    n += 1; const sp = raw?.economicState?.safetyProfile;
    if (!sp) { noSp += 1; odd.push(`${settType}-${i}: no safetyProfile`); continue; }
    if (Array.isArray(sp.criminalInstitutions) && Array.isArray(sp.crimeTypes)) both += 1; else odd.push(`${settType}-${i}: ${typeof sp.criminalInstitutions}/${typeof sp.crimeTypes}`);
  }
  writeFileSync(process.env.VR17_OUT, `${SRC}: ${n} born towns (6 tiers), both arrays ${both}, no safetyProfile ${noSp}\n${odd.slice(0, 10).join('\n')}\n`);
}, 3_600_000);

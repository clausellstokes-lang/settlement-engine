// VEIL-V102: seeds for the born guard, every tier: per seed, Reveal DM on, the criminal houses (and how many have people
// by the applier's identity), the criminal factions (and which depth fields carry data), and people's corruption.
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
it('seeds', async () => {
  const veil = await import(`${process.cwd()}/src/domain/display/galleryVeil.js`);
  const { cardHouseOf } = await import(`${process.cwd()}/src/domain/people/cardPowers.js`);
  const { generateSettlementPipeline } = await import(`${process.cwd()}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${process.cwd()}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${process.cwd()}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = [];
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < 8; i += 1) {
    const seed = `v102-${settType}-${i}`;
    const A = JSON.parse(JSON.stringify(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType }), null, { seed, customContent: {} })));
    const pub = veil.galleryPayloadFor(A, { shareDm: true });
    const d = veil.defaultVeilFor(pub);
    const houses = d.filter((x) => x.address.startsWith('card:institution:')).map((x) => x.address.slice(17));
    const names = (pub.institutions || []).filter((h) => houses.includes(veil.CARD_KINDS.institution.idOf(h))).map((h) => h.name);
    const staffed = names.filter((n) => (pub.npcs || []).some((p) => (cardHouseOf(p) || '') === n)).length;
    const fac = (pub.powerStructure?.factions || []).filter((f) => String(f.category).toLowerCase() === 'criminal').map((f) => Object.keys(f).filter((k) => ['desc', 'goals', 'conflicts', 'members'].includes(k)).join('+'));
    out.push(`${seed}: houses ${houses.length} staffed ${staffed} factions [${fac.join(' | ')}] corruption ${d.some((x) => x.cls === 'npc-corruption')}`);
  }
  writeFileSync(process.env.V102_OUT, out.join('\n'));
}, 1800000);

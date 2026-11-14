// node seatline.mjs <tree> <seed> — the dossier's seat (powerStrata.js :: rulingChainOf) after one lit step of the ladder
import path from 'node:path';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { advanceNpcLadder } = await imp('src/domain/worldPulse/npcLadderKernel.js');
const { rulingChainOf } = await imp('src/domain/dossier/powerStrata.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const seed = process.argv[3];
const s = generateSettlementPipeline(birthConfig({ ...DIALS, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
const worldState = { simulationRules: { npcLadderEnabled: true }, calendar: { elapsedWeeks: 260 } };
const r = advanceNpcLadder({ snapshot: { settlements: [{ id: 'a', name: s.name, settlement: s }] }, worldState, settlementUpdates: [{ saveId: 'a', settlement: s }], tick: 260, now: null });
const lived = r.settlementUpdates[0].settlement;
const chain = rulingChainOf(lived);
const leader = (s.npcs || []).find((c) => (c.memberships || []).some((m) => m.power === nameOf(governingFactionOf(s)) && m.rank === 1));
console.log(`${s.name} (${seed}), ${nameOf(governingFactionOf(s))}; the birth's leader: ${leader?.name}, ${leader?.title} and ${leader?.role}`);
console.log(`  the dossier's seat after one step: ${JSON.stringify(chain.npc)}`);

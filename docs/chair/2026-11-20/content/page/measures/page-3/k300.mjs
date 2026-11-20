// K1's role census: the 300 towns (hxd-<size>-<i>, PAGE-2's forge) in one tree, every card's role/influence/power, to JSON.
// usage: node k300.mjs <tree> <out.json>
import { writeFileSync } from 'node:fs';
const [, , L, OUT] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`); await loadGenerationLawPayloads();
const towns = [];
for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  towns.push({ seed, name: t.name, cards: (t.npcs || []).map((n) => ({ id: n.id, name: n.name, role: n.role, title: n.title, influence: n.influence, power: n.power })) });
}
writeFileSync(OUT, JSON.stringify(towns));
console.log(`k300: ${towns.length} towns, ${towns.reduce((s, t) => s + t.cards.length, 0)} cards`);

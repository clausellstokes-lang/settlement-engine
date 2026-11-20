// GOALS-4 builder 10 (2026-11-20), a scratch tool kept as the receipt of its output beside it.
// usage: node born.mjs <tree> <n per size> <out.json> — every card's goals (text + intent family/kind) on the measure towns
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [, , L, n = '50', out] = process.argv;
const imp = (p) => import(pathToFileURL(path.join(L, p)).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { SIZES } = await imp('tests/components/pageCensusWalk.shared.mjs');
await loadGenerationLawPayloads();
const towns = {};
for (const size of SIZES) for (let i = 0; i < +n; i += 1) {
  const seed = `hxd-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  towns[seed] = (t.npcs || []).map((c) => ({ id: String(c.id), short: c.goal?.short ?? null, long: c.goal?.long ?? null,
    is: c.goal?.intent?.short ? `${c.goal.intent.short.family}.${c.goal.intent.short.kind}` : null,
    il: c.goal?.intent?.long ? `${c.goal.intent.long.family}.${c.goal.intent.long.kind}` : null,
    intent: JSON.stringify(c.goal?.intent ?? null) }));
}
fs.writeFileSync(out, JSON.stringify(towns));
console.log('towns', Object.keys(towns).length, 'cards', Object.values(towns).reduce((a, b) => a + b.length, 0));

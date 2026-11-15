// VEIL-16: regenerate the born towns' largest metropolis (seed prefix v11-ties, as r5-born) and write it, new shape with publicProse.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('big', async () => {
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const all = [];
  for (const stress of [null, 'infiltrated']) for (let i = 0; i < 20; i += 1) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType: 'metropolis', ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let born; try { born = gen(density.birthConfig(cfg), null, { seed: `v11-ties-metropolis-${stress || 'calm'}-${i}`, customContent: {} }); } catch { continue; }
    const text = JSON.stringify({ ...born, publicProse: compose(born) });
    all.push({ seed: `${stress || 'calm'}-${i}`, name: born.name, len: text.length, ties: (born.relationships || []).length, covert: (born.relationships || []).filter((t) => t && t.covert === true).length, text });
  }
  all.sort((a, b) => b.len - a.len);
  for (const [k, t] of all.slice(0, 3).entries()) writeFileSync(`${process.env.OUTDIR}/big${k}.json`, t.text);
  writeFileSync(`${process.env.OUTDIR}/big-list.txt`, all.map((t) => `${t.seed} ${t.name} ${t.len} ties ${t.ties} covert ${t.covert}`).join('\n'));
}, 3_600_000);

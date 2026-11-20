// VEIL-19's builder (item C): EVERY COPY OF THE ENGINE'S INSTITUTION FLAGS a born town stores. The born towns of
// bcd-born.probe.jsx (seed prefix 'v11-ties', six sizes, calm and infiltrated, R5_N each), in the new stored shape with its
// public prose (master's shape stores the same economicState): every path of the record at which an object holds a key the engine's
// getInstitutionNames writes (has* booleans), with the number of towns holding it. No database.
//   RV6_SRC=<tree> RV6_PROBE=flag-copies.probe.jsx FLAG_OUT=<file> R5_N=4 npx vitest run --config <this dir>/vitest.config.mjs
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
it('every copy of the institution flags', async () => {
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { getInstFlags } = await import(`${SRC}/src/generators/priorityHelpers.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const FLAGS = new Set(Object.keys(getInstFlags({}, []).inst).filter(k => k.startsWith('has')));
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const N = Number(process.env.R5_N || 4); const PFX = process.env.R5_SEED || 'v11-ties';
  const at = new Map(); let towns = 0;
  const walk = (v, p, town) => {
    if (Array.isArray(v)) { v.forEach((x) => walk(x, `${p}[]`, town)); return; }
    if (!isRec(v)) return;
    const held = Object.keys(v).filter(k => FLAGS.has(k));
    if (held.length) { const k = `${p} {${held.length} flags}`; if (!at.has(k)) at.set(k, new Set()); at.get(k).add(town); }
    for (const [k, x] of Object.entries(v)) walk(x, `${p}.${k}`, town);
  };
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let born; try { born = gen(density.birthConfig(cfg), null, { seed: `${PFX}-${settType}-${stress || 'calm'}-${i}`, customContent: {} }); } catch { continue; }
    towns += 1;
    walk({ ...born, publicProse: compose(born) }, '$', `${settType}/${stress || 'calm'}/${i}`);
  }
  const lines = [`flag-copies: ${towns} towns; the engine's flags: ${[...FLAGS].length}`, ...[...at].map(([k, s]) => `  ${k}: ${s.size} towns`)];
  writeFileSync(process.env.FLAG_OUT, `${lines.join('\n')}\n`);
}, 14_400_000);

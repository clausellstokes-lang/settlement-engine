// V33-LP PIECE 1: THE DUMP MODE. Births by the engine at RV6_SRC (master db832c892 for the legacy dump; the lane's tree
// for the born-today twin of the same slice), stored as that tree's save stores a place: master's supabaseSave writes
// `data: withNeighbourNetworkFromRelationship(settlement)` (a no-op without a neighbour) where `settlement` is the
// generation's direct generateSettlementPipeline result (workers/generationRequest.js :: runSettlementOp, no locks) and
// master has NO publicProse module; the lane's tree composes publicProse (tell-common.mjs :: birth). LP_PROSE=auto picks by
// the tree: compose where src/components/new/publicProseCompose.js exists, else store the pipeline's output as is.
// THE SLICE (of the lane's pool LP_POOL): part A (pool-shard*.json, nothing hidden today) the first LP_A births per size
// by k; part B (poolb-shard*.json, houses held today) the first LP_B per size by k; the towns (tell-common.mjs :: pool,
// N=2: the gate's 140 births, its 92 hidden-house towns and 48 controls). The SAME seeds, configs (cfgOf = the probe's,
// DEFAULT_CONFIG + the dials + settType + the crisis) and birthConfig, from THIS tree's own modules. Shard s of n.
// Out: LP_OUT/<seed>.json (the stored document) and LP_OUT/index-shard<s>.json ({ seed, role, size, crisis, k, dial }).
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const CRISES = 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured'.split(',');
const TSIZES = 'village,town,town,city,city,metropolis,metropolis'.split(',');
const SIZES = ['village', 'town', 'city', 'metropolis'];

it('V33-LP dump', async () => {
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  const prose = (process.env.LP_PROSE || 'auto') === 'auto' ? existsSync(`${SRC}/src/components/new/publicProseCompose.js`) : process.env.LP_PROSE === '1';
  let compose = null;
  if (prose) {
    const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
    const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
    compose = (t) => { const u = { ...t }; delete u.publicProse; return withPublicProse(u, composePublicProse(u)); };
  }
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
  const POOL = process.env.LP_POOL || '/var/tmp/v18/t2/pool-r5c-1';
  const NA = Number(process.env.LP_A ?? 45); const NB = Number(process.env.LP_B ?? 30);
  const pick = (re, n) => {
    const all = readdirSync(POOL).filter((f) => re.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${POOL}/${f}`, 'utf8')).births);
    return SIZES.flatMap((s) => all.filter((b) => b.size === s).sort((x, y) => x.k - y.k).slice(0, n));
  };
  const jobs = [
    ...pick(/^pool-shard\d+\.json$/, NA).map((b) => ({ role: 'A', seed: b.seed, size: b.size, crisis: b.crisis, k: b.k })),
    ...pick(/^poolb-shard\d+\.json$/, NB).map((b) => ({ role: 'B', seed: b.seed, size: b.size, crisis: b.crisis, k: b.k })),
  ];
  if (process.env.LP_TOWNS !== '0') {
    let idx = 0;
    for (let k = 0; k < 2; k += 1) for (const size of TSIZES) for (const crisis of CRISES) { idx += 1; jobs.push({ role: 'T', seed: `r3m-${size}-${crisis}-${k}-${idx}`, size, crisis, k }); }
  }
  const OUT = process.env.LP_OUT; mkdirSync(OUT, { recursive: true });
  const index = [];
  jobs.forEach((j, i) => {
    if (i % SHARD[1] !== SHARD[0]) return;
    let dial = null;
    let t = generateSettlementPipeline(birthConfig(cfgOf(j.size, j.crisis)), null, { seed: j.seed, customContent: {}, onStep: (_n, ctx) => {
      if (typeof ctx?.effectiveConfig?.priorityCriminal === 'number') dial = ctx.effectiveConfig.priorityCriminal;
    } });
    if (compose) t = compose(t);
    const doc = JSON.parse(JSON.stringify(t)); // the jsonb column's round trip
    writeFileSync(`${OUT}/${j.seed}.json`, JSON.stringify(doc));
    index.push({ ...j, dial, prose: !!compose, hasPublicProse: 'publicProse' in doc });
  });
  writeFileSync(`${OUT}/index-shard${SHARD[0]}.json`, JSON.stringify({ src: SRC, prose: !!compose, ended: new Date().toISOString(), index }));
}, 14_400_000);

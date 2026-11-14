/** @vitest-environment node */
// W2-WRITE-5 eligibility probe: births in the app's own shape (DEFAULT_CONFIG, selectedStressesRandom:false,
// selectedStresses:[...], _randomizePriorities:true), every public prose site drawn (owner side), and for every
// corpus pool read: the eligible vids (as asked) and the drawn vid. Writes ndjson lines {seed, p:{id:[elig,drawn]}}.
import { test, vi } from 'vitest';
import fs from 'node:fs';
const REC = { cur: null };
vi.mock('__TREE__/src/domain/display/stateProse/stateProseKernel.js', async (orig) => {
  const m = await orig();
  const last = new WeakMap();
  return { ...m,
    eligibleVariants: (pool, options) => { const r = m.eligibleVariants(pool, options); if (Array.isArray(pool)) last.set(pool, r); if (REC.cur && Array.isArray(pool) && pool.length && typeof pool[0].vid === 'number') { REC.lastPool = pool; REC.lastElig = r; } return r; },
    drawVariant: (eligible, blockId, poolKey, seed) => { const v = m.drawVariant(eligible, blockId, poolKey, seed); if (REC.cur) { const id = `${blockId}::${poolKey}`; const e = (eligible || []).map((x) => x.vid); const o = REC.cur[id] ||= { e: [], d: [] }; for (const x of e) if (!o.e.includes(x)) o.e.push(x); if (v && !o.d.includes(v.vid)) o.d.push(v.vid); } return v; },
  };
});
vi.mock('__TREE__/src/store/index.js', () => { const useStore = () => undefined; useStore.subscribe = () => () => {}; useStore.getState = () => ({}); return { useStore }; });
vi.mock('__TREE__/src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('__TREE__/src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('__TREE__/src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
import { generateSettlementPipeline } from '__TREE__/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '__TREE__/src/domain/display/publicProse.js';
import { composePublicProse, PUBLIC_PROSE_SITES } from '__TREE__/src/components/new/publicProseCompose.js';
import { publicVeiledRecordOf } from '__TREE__/src/domain/display/publicSafe.js';
import { birthConfig, loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '__TREE__/src/store/configSlice.js';
const SEEDS = fs.readFileSync(process.env.ELIG_SEEDS, 'utf8').trim().split('\n');
const OUT = process.env.ELIG_OUT;
const EX = process.env.EXTRACT ? (await import(process.env.EXTRACT)).default : null;
import { factsOf } from '__TREE__/src/domain/facts/factsOf.js';
function cfgFor(seed) {
  const m = seed.match(/^[a-z0-9]+-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(?:[a-z]+-)?(\d+)$/); if (!m) throw new Error(seed);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true });
}
test('elig', async () => {
  await loadGenerationLawPayloads();
  const fd = fs.openSync(OUT, 'w');
  for (const seed of SEEDS) {
    try {
      let town = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
      town = withPublicProse(town, composePublicProse(town));
      REC.cur = {};
      const ctx = { veiledRecord: publicVeiledRecordOf(town) };
      for (const [, draw] of PUBLIC_PROSE_SITES) { try { draw(town, false, ctx); } catch { /* */ } }
      const p = REC.cur; REC.cur = null;
      let x; if (EX) { try { x = EX(town, factsOf(town)); } catch (e) { x = { exErr: String(e).slice(0, 120) }; } }
      fs.writeSync(fd, JSON.stringify({ seed, p, x }) + '\n');
    } catch (e) { fs.writeSync(fd, JSON.stringify({ seed, err: String(e).slice(0, 200) }) + '\n'); REC.cur = null; }
  }
  fs.closeSync(fd);
}, 36000000);

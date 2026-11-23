import { it, vi } from 'vitest';
import { loadEngine, loadVeil } from '/home/user/wt/r3tell3/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs';
import { CRIM_RE } from '/home/user/wt/r3tell3/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-surface.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
import { appendFileSync } from 'node:fs';
const log = (...a) => appendFileSync('/tmp/claude-0/-home-user-settlement-engine/dad99dac-210f-5758-ba9e-629f0852db78/scratchpad/look.out', a.join(' ') + '\n');
it('look', async () => {
  const E = await loadEngine(process.env.RV6_SRC); const V = await loadVeil(process.env.RV6_SRC);
  for (const b of E.pool(2, [0, 1])) {
    log('seed', b.seed); if (!['r3m-town-insurgency-0-14', 'r3m-town-none-0-23', 'r3m-city-none-1-113', 'r3m-metropolis-infiltrated-0-62'].includes(b.seed)) continue;
    const A = E.birth(b.cfg, b.seed, null); const B = E.birth(b.cfg, b.seed, (h) => E.isHideableHouse(h));
    const { deltas } = V.settings(A, false); const page = V.twin(A, false, V.write(deltas.own));
    log('==', b.seed, 'hidden', JSON.stringify((A.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => h.name)));
    log(' imports stored', JSON.stringify(A.economicState?.primaryImports), '\n served', JSON.stringify(page.economicState?.primaryImports), '\n B', JSON.stringify(B.economicState?.primaryImports));
    log(' tensions stored', JSON.stringify(A.history?.currentTensions), '\n served', JSON.stringify(page.history?.currentTensions), '\n B', JSON.stringify(B.history?.currentTensions));
    log(' safetyDesc stored', JSON.stringify(A.economicState?.safetyProfile?.safetyDesc), '\n B', JSON.stringify(B.economicState?.safetyProfile?.safetyDesc));
    log(' crim imports regex', JSON.stringify((A.economicState?.primaryImports || []).filter((x) => CRIM_RE.test(JSON.stringify(x)))));
  }
}, 600000);

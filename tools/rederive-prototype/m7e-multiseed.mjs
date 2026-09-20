/** Multi-seed probe: a ONE-TRIAL perturbation is a one-bit test with false negatives. */
import { createHash } from 'node:crypto';
import { instrumentedRoot, runHeadless, getStepMeta } from './instrument.mjs';

const meta = new Map(getStepMeta().map(m => [m.name, m]));
const h = (v) => { let s; try { s = JSON.stringify(v); } catch { s = String(v); } if (s === undefined) s = 'U'; return createHash('sha1').update(s).digest('hex').slice(0, 16); };
const STEP = 'resolveConfig';
const CONFIGS = [
  ['IN corpus (control)', {}],
  ["settType:'random'", { settType: 'random' }],
  ["culture:'random_culture'", { culture: 'random_culture' }],
  ['_randomizePriorities:true', { _randomizePriorities: true }],
];
const SEEDS = Array.from({ length: 24 }, (_, i) => `probe-${i}`);
for (const [label, extra] of CONFIGS) {
  const counts = new Map();
  for (const seed of SEEDS) {
    const row = {
      settType: 'town', culture: 'germanic', terrainOverride: 'plains',
      tradeRouteAccess: 'road', monsterThreat: 'civilized', ...extra, _seed: seed,
    };
    const snap = (p) => {
      let bag = null;
      runHeadless(row, instrumentedRoot(seed, { perturbStep: p }).root, {
        onStep: (n, ctx) => {
          if (n !== STEP) return;
          const m = meta.get(n);
          bag = {};
          for (const k of new Set([...m.provides, ...m.mutates])) bag[k] = k in ctx ? h(ctx[k]) : 'A';
        },
      });
      return bag;
    };
    const a = snap(null); const b = snap(STEP);
    for (const k of Object.keys(a)) if (a[k] !== b[k]) counts.set(k, (counts.get(k) || 0) + 1);
  }
  const line = [...counts.entries()].sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k}:${v}/${SEEDS.length}`).join(' , ');
  console.log(`${label}\t${line}`);
}

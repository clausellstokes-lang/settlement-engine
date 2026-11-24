/** @vitest-environment node */
import { test } from 'vitest';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const h = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 12);
test('probe', async () => {
  const out = {};
  for (const T of ['/home/user/wt/lit', '/home/user/wt/b1i']) {
    const corpus = await import(/* @vite-ignore */ `${T}/scripts/audit/soak-review/corpus.mjs`);
    await corpus.ensureLaws();
    const { generateSettlementPipeline } = await import(/* @vite-ignore */ `${T}/src/generators/generateSettlementPipeline.js`);
    const { birthConfig } = await import(/* @vite-ignore */ `${T}/src/domain/density/densityCreateBoundary.js`);
    const { DEFAULT_CONFIG } = await import(/* @vite-ignore */ `${T}/src/store/configSlice.js`);
    const { configOf } = await import(/* @vite-ignore */ `${T}/tests/components/pageCensusWalk.shared.mjs`);
    const rows = {};
    for (let i = 0; i < 30; i++) { const s = corpus.birth(i).settlement; rows[`soak${i}`] = { name: s.name, terrain: s.config.terrainType, n: s.npcs.length, h: h(s), roster: s.institutions.map((x) => x.name) }; }
    for (const [seed, size, crisis] of [['r2s-under_siege-town-1', 'town', 'under_siege'], ['r2s-famine-city-1', 'city', 'famine']]) {
      const s = generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
      rows[seed] = { name: s.name, terrain: s.config.terrainType, route: s.config.tradeRouteAccess, h: h(s), roster: s.institutions.map((x) => x.name) };
    }
    out[T] = rows;
  }
  const A = out['/home/user/wt/lit']; const B = out['/home/user/wt/b1i'];
  const lines = [];
  for (const k of Object.keys(A)) { if (A[k].h !== B[k].h) lines.push(`${k} ${A[k].name} ${A[k].terrain} ${A[k].route || ''} moved; lost ${A[k].roster.filter((x) => !B[k].roster.includes(x)).join('|')} gained ${B[k].roster.filter((x) => !A[k].roster.includes(x)).join('|')}`); }
  lines.push(`unmoved: ${Object.keys(A).filter((k) => A[k].h === B[k].h).map((k) => `${k}(${A[k].terrain})`).join(' ')}`);
  writeFileSync(process.env.PROBE_OUT, lines.join('\n') + '\n');
}, 3600000);

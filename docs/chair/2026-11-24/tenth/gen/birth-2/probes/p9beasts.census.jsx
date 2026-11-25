/** @vitest-environment node */
// C6 (A) "P9" probe (BIRTH-2): per birth of a plan, the two sides of the Defense tab's Beasts & Monsters row as the tab
// reads them: THE GRADE (`defenseScoreBands.js :: scoreBand(defenseProfile.scores.monster)`, the tab's threatScores row) and
// its source parts (the defence ledger's `defenseProfile.scores.monster`; the threat tier `config.monsterThreat`), and THE
// LINE (`defenseStateProse.js :: defenseThreatProse(...).beasts`, its pool key read by `beastsRowPoolKey`'s family);
// with the size, the land and the route. Changes nothing.
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
const T = process.env.P9_TREE || '/home/user/settlement-engine';
test('P9 probe', async () => {
  const R = `${T}/src/`;
  const { generateSettlementPipeline } = await import(/* @vite-ignore */ R + 'generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(/* @vite-ignore */ R + 'domain/density/densityCreateBoundary.js');
  const { scoreBand } = await import(/* @vite-ignore */ R + 'domain/display/defenseScoreBands.js');
  const { measuredMonsterFamily, defenseThreatProse } = await import(/* @vite-ignore */ R + 'domain/display/stateProse/defenseStateProse.js');
  await loadGenerationLawPayloads();
  const plan = JSON.parse(readFileSync(process.env.P9_PLAN, 'utf8'));
  const out = [];
  for (const { seed, size, config } of plan) {
    const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
    const c = s.config || {}; const sc = s.defenseProfile?.scores || {};
    let beasts = null; try { const b = defenseThreatProse(s)?.beasts; beasts = b ? JSON.stringify(b).slice(0, 300) : null; } catch (e) { beasts = `ERR ${String(e?.message || e).slice(0, 80)}`; }
    const parts = (s.defenseProfile?.parts || s.defenseProfile?.ledger || []).filter?.((p) => p && (p.dims?.mon || p.mon)) || [];
    out.push(JSON.stringify({ seed, size, threat: c.monsterThreat ?? null, family: measuredMonsterFamily(c.monsterThreat), terrain: c.terrainType ?? null, route: c.tradeRouteAccess ?? null,
      monster: sc.monster ?? null, band: scoreBand(sc.monster || 0), beasts, monParts: parts.slice(0, 8).map((p) => `${p.group || p.kind || ''}:${p.id || p.label || ''}=${p.dims?.mon ?? p.mon}`) }));
  }
  writeFileSync(process.env.P9_OUT, out.join('\n') + '\n');
}, 3600000);
